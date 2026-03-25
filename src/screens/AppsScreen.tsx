import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Check, Plus, ExternalLink } from 'lucide-react-native';
import { Container, Typography } from '../components/Base';
import { MINI_APP_CATALOG, getFeaturedApp } from '../miniapps/catalog';
import { CATEGORY_LABELS, MiniAppManifest, MiniAppCategory } from '../miniapps/types';
import { PermissionSheet } from '../miniapps/PermissionSheet';
import { useStore } from '../store/useStore';
import { useAnalytics } from '../miniapps/analytics';

const CATEGORY_TABS: Array<{ key: 'all' | MiniAppCategory; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: 'female-health', label: 'Saúde Feminina' },
  { key: 'sleep', label: 'Sono' },
  { key: 'nutrition', label: 'Nutrição' },
  { key: 'mental', label: 'Mental' },
  { key: 'longevity', label: 'Longevidade' },
];

export const AppsScreen = ({ navigation }: { navigation: any }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | MiniAppCategory>('all');
  const [permSheet, setPermSheet] = useState<MiniAppManifest | null>(null);

  const { installedAppIds, isAppInstalled, launchApp } = useStore();
  const { logEvent } = useAnalytics();

  const featured = getFeaturedApp();
  const installedApps = MINI_APP_CATALOG.filter((a) => installedAppIds.includes(a.id));
  const filteredCatalog = activeCategory === 'all'
    ? MINI_APP_CATALOG
    : MINI_APP_CATALOG.filter((a) => a.category === activeCategory);

  const handleAdd = (app: MiniAppManifest) => {
    setPermSheet(app);
  };

  const handleOpen = (app: MiniAppManifest) => {
    launchApp(app);
    if (Platform.OS === 'web') {
      Linking.openURL(app.url);
    } else {
      navigation?.navigate('MiniApp', { app });
    }
  };

  const handleInstalled = () => {
    setPermSheet(null);
  };

  return (
    <Container safe style={styles.container}>
      {/* ── Background atmosphere ── */}
      <View style={styles.atmosphere} pointerEvents="none">
        <View style={[styles.aura, styles.aura1]} />
        <View style={[styles.aura, styles.aura2]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        stickyHeaderIndices={[1]}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>App Place</Typography>
          <Typography style={styles.subtitle}>
            Mini-apps curadas para o teu ecossistema de bem-estar
          </Typography>
        </View>

        {/* ── Category Tabs (sticky) ── */}
        <View style={styles.tabsWrapper}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => setActiveCategory(tab.key)}
                  activeOpacity={0.7}
                >
                  <Typography style={{ ...styles.tabText, ...(active ? styles.tabTextActive : {}) }}>
                    {tab.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Installed Apps ── */}
        {installedApps.length > 0 && (
          <View style={styles.section}>
            <Typography style={styles.sectionLabel}>AS TUAS APPS</Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.installedRow}
            >
              {installedApps.map((app) => (
                <TouchableOpacity
                  key={app.id}
                  style={styles.installedItem}
                  onPress={() => handleOpen(app)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.appIconLarge, { backgroundColor: app.iconBg, borderColor: app.iconColor + '30' }]}>
                    {/* 3D gloss overlay */}
                    <LinearGradient
                      colors={['rgba(255,255,255,0.25)', 'transparent', 'rgba(0,0,0,0.6)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
                      pointerEvents="none"
                    />
                    <Typography style={[styles.appIconEmoji, { color: app.iconColor }]}>
                      {app.iconEmoji}
                    </Typography>
                  </View>
                  <Typography style={styles.installedName} numberOfLines={1}>
                    {app.name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Featured Banner ── */}
        {featured && !isAppInstalled(featured.id) && activeCategory === 'all' && (
          <View style={styles.section}>
            <Typography style={styles.sectionLabel}>EM DESTAQUE</Typography>
            <TouchableOpacity
              style={styles.featuredCard}
              activeOpacity={0.85}
              onPress={() => handleAdd(featured)}
            >
              <LinearGradient
                colors={[featured.iconColor + '25', featured.iconColor + '05']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.featuredBorder} />
              <View style={styles.featuredContent}>
                <View style={[styles.featuredIcon, { backgroundColor: featured.iconBg, borderColor: featured.iconColor + '40' }]}>
                  <Typography style={[styles.featuredEmoji, { color: featured.iconColor }]}>
                    {featured.iconEmoji}
                  </Typography>
                </View>
                <View style={styles.featuredMeta}>
                  <View style={styles.featuredBadge}>
                    <Typography style={styles.featuredBadgeText}>✦ DESTAQUE</Typography>
                  </View>
                  <Typography style={styles.featuredName}>{featured.name}</Typography>
                  <Typography style={styles.featuredTagline}>{featured.tagline}</Typography>
                  <View style={styles.featuredRating}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Typography style={styles.featuredRatingText}>
                      {featured.rating} · {featured.reviewCount} avaliações
                    </Typography>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.featuredAddBtn, { backgroundColor: featured.iconColor }]}
                onPress={() => handleAdd(featured)}
                activeOpacity={0.8}
              >
                <Typography style={styles.featuredAddText}>ADICIONAR</Typography>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* ── App Catalog List ── */}
        <View style={styles.section}>
          <Typography style={styles.sectionLabel}>CATÁLOGO</Typography>
          <View style={styles.catalogList}>
            {filteredCatalog.map((app) => {
              const installed = isAppInstalled(app.id);
              return (
                <View key={app.id} style={styles.catalogCardWrapper}>
                  <BlurView intensity={12} tint="dark" style={styles.catalogCard}>
                    {/* Left: icon */}
                    <View style={[styles.catalogIcon, { backgroundColor: app.iconBg, borderColor: app.iconColor + '25' }]}>
                      <Typography style={[styles.catalogEmoji, { color: app.iconColor }]}>
                        {app.iconEmoji}
                      </Typography>
                    </View>

                    {/* Middle: info */}
                    <View style={styles.catalogInfo}>
                      <View style={styles.catalogNameRow}>
                        <Typography style={styles.catalogName}>{app.name}</Typography>
                        {app.developerVerified && (
                          <View style={styles.verifiedBadge}>
                            <Typography style={styles.verifiedText}>✓</Typography>
                          </View>
                        )}
                      </View>
                      <Typography style={styles.catalogTagline} numberOfLines={2}>
                        {app.tagline}
                      </Typography>
                      <View style={styles.catalogMeta}>
                        <Typography style={styles.catalogCategory}>
                          {CATEGORY_LABELS[app.category]}
                        </Typography>
                        {app.rating && (
                          <>
                            <View style={styles.metaDot} />
                            <Star size={9} color="#FFD700" fill="#FFD700" />
                            <Typography style={styles.catalogRating}>{app.rating}</Typography>
                          </>
                        )}
                      </View>
                    </View>

                    {/* Right: CTA */}
                    {installed ? (
                      <TouchableOpacity
                        style={[styles.ctaBtn, styles.openBtn, { borderColor: app.iconColor + '50' }]}
                        onPress={() => handleOpen(app)}
                        activeOpacity={0.75}
                      >
                        <Typography style={[styles.ctaText, { color: app.iconColor }]}>ABRIR</Typography>
                        <ExternalLink size={10} color={app.iconColor} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.ctaBtn, styles.addBtn]}
                        onPress={() => handleAdd(app)}
                        activeOpacity={0.75}
                      >
                        <Plus size={12} color="#05070A" />
                        <Typography style={styles.addText}>ADD</Typography>
                      </TouchableOpacity>
                    )}
                  </BlurView>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Permission Consent Sheet ── */}
      {permSheet && (
        <PermissionSheet
          app={permSheet}
          visible={!!permSheet}
          onClose={() => setPermSheet(null)}
          onInstalled={handleInstalled}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#05070A' },
  atmosphere: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  aura: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    ...(Platform.OS === 'web' ? { filter: 'blur(120px)' } as any : {}),
  },
  aura1: {
    top: -120,
    left: -150,
    backgroundColor: 'rgba(255, 111, 186, 0.04)',
  },
  aura2: {
    bottom: -100,
    right: -150,
    backgroundColor: 'rgba(0, 242, 255, 0.03)',
  },
  scroll: { paddingTop: 0 },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
    lineHeight: 20,
  },
  // ── Category tabs ──
  tabsWrapper: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  // ── Section ──
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  // ── Installed row ──
  installedRow: {
    gap: 14,
    paddingRight: 4,
  },
  installedItem: {
    width: 72,
    alignItems: 'center',
    gap: 8,
  },
  appIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  appIconEmoji: {
    fontSize: 28,
    fontWeight: '800',
  },
  installedName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  // ── Featured ──
  featuredCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 16,
  },
  featuredBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featuredContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  featuredIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  featuredEmoji: {
    fontSize: 32,
    fontWeight: '800',
  },
  featuredMeta: { flex: 1 },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  featuredName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  featuredTagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredRatingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  featuredAddBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  featuredAddText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  // ── Catalog list ──
  catalogList: { gap: 12 },
  catalogCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  catalogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  catalogIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  catalogEmoji: {
    fontSize: 22,
    fontWeight: '800',
  },
  catalogInfo: { flex: 1 },
  catalogNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  catalogName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#00D4AA',
    fontSize: 9,
    fontWeight: '900',
  },
  catalogTagline: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 5,
  },
  catalogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  catalogCategory: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  catalogRating: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  ctaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  openBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  addBtn: {
    backgroundColor: '#ffffff',
  },
  addText: {
    color: '#05070A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
