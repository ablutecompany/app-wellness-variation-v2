import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, RefreshCw } from 'lucide-react-native';
import { Typography } from '../components/Base';
import { BrandLogo } from '../components/BrandLogo';
import { MiniAppManifest } from './types';
import { useStore } from '../store/useStore';
import { useAnalytics } from './analytics';
import { buildContextPayload } from '../services/miniapp-context';

// react-native-webview is native-only. We lazy-import to avoid web crashes.
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

interface MiniAppContainerProps {
  app: MiniAppManifest;
  navigation?: any;
}

/**
 * The ablute_ JavaScript bridge injected into every mini-app WebView.
 * Mini-apps can call:
 *   window.ablute.getUser()        → { name, goals }
 *   window.ablute.getHealth()      → { globalScore, credits }
 *   window.ablute.emit(evt,payload) → sends postMessage back to native shell
 */
function buildBridgeScript(payload: any): string {
  const payloadJson = JSON.stringify(payload ?? {});
  return `
    (function() {
      window.__ablute_context__ = ${payloadJson};
      
      // Fallback para mini-apps existentes
      window.__ablute_user__   = window.__ablute_context__.profileContext || {};
      window.__ablute_health__ = window.__ablute_context__.healthSummaryContext || {};
      
      window.ablute = {
        getContext: function() { return window.__ablute_context__; },
        getUser:    function() { return window.__ablute_user__; },
        getHealth:  function() { return window.__ablute_health__; },
        emit: function(event, payload) {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({ event: event, payload: payload }));
          } catch(e) {}
        }
      };
      
      // Dispatch a ready event so mini-apps can listen
      window.dispatchEvent(new CustomEvent('ablute:ready', { detail: window.__ablute_context__ }));
      true; // required for Android
    })();
  `;
}

export const MiniAppContainer: React.FC<MiniAppContainerProps> = ({
  app,
  navigation,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const webViewRef = useRef<any>(null);
  const launchTime = useRef(Date.now());

  const storeState = useStore();
  const { closeApp, recordAppEvent } = storeState;
  const { logEvent } = useAnalytics();

  const handleClose = () => {
    const duration = Math.round((Date.now() - launchTime.current) / 1000);
    logEvent('APP_CLOSED', app.id, { duration_seconds: duration });
    closeApp();
    navigation?.goBack();
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.event && data.payload) {
        recordAppEvent({
          eventId: Math.random().toString(36).substring(2, 15),
          sourceApp: app.id,
          eventType: data.event as any,
          payload: data.payload,
          recordedAt: Date.now(),
          confidence: data.payload.confidence,
          validityWindow: data.payload.validityWindow,
        });
        console.log('[MiniApp Bridge] Guardado evento:', data.event);
      }
    } catch {}
  };

  // ── WEB FALLBACK ─────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <LinearGradient
          colors={['#05070A', '#0A0F1A']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.iconCircle, { backgroundColor: app.iconBg, borderColor: app.iconColor + '30' }]}>
          <Typography style={[styles.iconEmoji, { color: app.iconColor }]}>{app.iconEmoji}</Typography>
        </View>
        <Typography style={styles.webFallbackTitle}>{app.name}</Typography>
        <Typography style={styles.webFallbackSubtitle}>
          Abre no dispositivo para a experiência completa
        </Typography>
        <TouchableOpacity
          style={[styles.openWebBtn, { borderColor: app.iconColor + '50' }]}
          onPress={() => Linking.openURL(app.url)}
        >
          <Typography style={[styles.openWebText, { color: app.iconColor }]}>
            Abrir no navegador →
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeWebBtn} onPress={handleClose}>
          <Typography style={styles.closeWebText}>Fechar</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  // ── NATIVE WEBVIEW ────────────────────────────────────────────────────────
  const bridgeScript = buildBridgeScript(buildContextPayload(app.id, storeState));

  return (
    <View style={styles.container}>
      {/* Native header */}
      <SafeAreaView>
        <View style={styles.header}>
          <BrandLogo size="small" />
          <View style={styles.headerCenter}>
            <View style={[styles.miniDot, { backgroundColor: app.iconColor }]} />
            <Typography style={styles.headerAppName}>{app.name}</Typography>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => webViewRef.current?.reload()}
            >
              <RefreshCw size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={handleClose}>
              <X size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Thin accent line */}
      <View style={[styles.accentLine, { backgroundColor: app.iconColor }]} />

      {/* WebView */}
      {!error ? (
        <WebView
          ref={webViewRef}
          source={{ uri: app.url }}
          style={styles.webView}
          injectedJavaScriptBeforeContentLoaded={bridgeScript}
          onMessage={handleMessage}
          onLoad={() => {
            setLoading(false);
            logEvent('APP_LAUNCHED', app.id);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          allowsBackForwardNavigationGestures
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
        />
      ) : (
        <View style={styles.errorView}>
          <Typography style={styles.errorEmoji}>⚠️</Typography>
          <Typography style={styles.errorTitle}>Não foi possível carregar</Typography>
          <Typography style={styles.errorDesc}>{app.url}</Typography>
          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: app.iconColor + '50' }]}
            onPress={() => { setError(false); webViewRef.current?.reload(); }}
          >
            <Typography style={[styles.retryText, { color: app.iconColor }]}>Tentar novamente</Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading overlay */}
      {loading && !error && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={app.iconColor} />
          <Typography style={styles.loadingText}>A carregar {app.name}…</Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#05070A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerAppName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentLine: {
    height: 1,
    opacity: 0.5,
  },
  webView: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#05070A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    top: 80,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  errorEmoji: { fontSize: 40 },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorDesc: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  retryText: { fontSize: 14, fontWeight: '600' },
  // ── Web fallback ──
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconEmoji: { fontSize: 36, fontWeight: '800' },
  webFallbackTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  webFallbackSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  openWebBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  openWebText: { fontSize: 15, fontWeight: '600' },
  closeWebBtn: { paddingVertical: 12 },
  closeWebText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  },
});
