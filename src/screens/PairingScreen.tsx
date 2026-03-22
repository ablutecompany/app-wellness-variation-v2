import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Typography } from '../components/Base';
import { theme } from '../theme';
import { Smartphone } from 'lucide-react-native';
import { BrandLogo } from '../components/BrandLogo';
import { BlurView } from 'expo-blur';
import { useStore } from '../store/useStore';

type PairingStatus = 'searching' | 'connected';

export const PairingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { credits } = useStore();
  const [status, setStatus] = React.useState<PairingStatus>('searching');

  const handleTap = () => {
    if (status === 'searching') {
      setStatus('connected');
      // After showing "Equipamento Detetado", navigate to Main after a brief pause
      setTimeout(() => navigation.replace('Main'), 2000);
    }
  };

  // ── "Equipamento Detetado" — full screen, only text ──────────────────────
  if (status === 'connected') {
    return (
      <View style={styles.detectedScreen}>
        <View style={styles.aura} />
        <Typography variant="h1" style={styles.detectedText}>Equipamento Detetado</Typography>
        <View style={styles.scanLine} />
      </View>
    );
  }

  // ── "Encoste para Iniciar" — glassmorphism floating card ─────────────────
  return (
    <View style={styles.backdrop}>
      <View style={styles.aura} />
      
      {/* Header stays visible above the modal */}
      <View style={styles.header}>
        <BrandLogo size="small" />
        <View style={styles.creditBadge}>
          <Typography variant="caption" style={styles.creditText}>{credits} Créditos</Typography>
        </View>
      </View>

      {/* Floating glass modal — tap anywhere on it to proceed */}
      <TouchableOpacity 
        style={styles.modalContainer} 
        onPress={handleTap} 
        activeOpacity={0.9}
      >
        <BlurView intensity={Platform.OS === 'web' ? 15 : 30} tint="dark" style={styles.glassPlate}>
          <View style={[styles.borderAccent, { backgroundColor: theme.colors.primary }]} />
          
          <View style={styles.modalContent}>
            {/* Icon container with tech glow */}
            <View style={styles.iconHaze}>
              <View style={styles.iconCircle}>
                <Smartphone size={32} color={theme.colors.primary} />
              </View>
            </View>

            {/* Title */}
            <Typography variant="h2" style={styles.title}>Encoste para Iniciar</Typography>

            {/* Subtitle */}
            <Typography style={styles.subtitle}>
              Aproxima o teu telemóvel do sensor do equipamento ablute_ para ativar a análise.
            </Typography>

            {/* Tap hint */}
            <View style={styles.tapHint}>
              <Typography variant="caption" style={styles.tapHintText}>Tocar para simular NFC</Typography>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#05070A',
    paddingTop: 16,
  },
  aura: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    top: -200,
    left: -100,
    backgroundColor: 'rgba(0, 242, 255, 0.04)',
    ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } as any : {}),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  creditBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  creditText: {
    fontWeight: '800',
    color: '#00F2FF',
    letterSpacing: 1,
  },
  modalContainer: {
    paddingHorizontal: 20,
    marginTop: 80,
    flex: 0.7,
    justifyContent: 'center',
  },
  glassPlate: {
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  borderAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    opacity: 0.5,
  },
  modalContent: {
    padding: 40,
    alignItems: 'center',
  },
  iconHaze: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.2)',
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  tapHint: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.15)',
  },
  tapHintText: {
    color: '#00F2FF',
    letterSpacing: 2,
    fontWeight: '800',
  },
  detectedScreen: {
    flex: 1,
    backgroundColor: '#05070A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedText: {
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -1,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 242, 255, 0.2)',
    top: '50%',
  },
});
