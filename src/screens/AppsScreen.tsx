import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Container, Typography } from '../components/Base';
import { BlurView } from 'expo-blur';
import { ShoppingBag, Star, Download } from 'lucide-react-native';

const APPS = [
  { name: 'Sleep Deep+', dev: 'ablute_ Labs', desc: 'Integração profunda com o teu sono.', rating: 4.8 },
  { name: 'Metabolic Tracker', dev: 'BioSync', desc: 'Leitura contínua de biomarcadores.', rating: 4.9 },
  { name: 'Yoga Flow', dev: 'ZenITH', desc: 'Sugestão de treinos baseados na tua frescura.', rating: 4.7 },
];

export const AppsScreen: React.FC = () => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.atmosphere}>
        <View style={styles.aura} />
      </View>

      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>App Store</Typography>
        <Typography style={styles.subtitle}>Extensões para o teu ecossistema</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {APPS.map((app, index) => (
          <View key={index} style={styles.cardWrapper}>
            <BlurView intensity={15} tint="dark" style={styles.appCard}>
              <View style={styles.appIcon}>
                <ShoppingBag size={22} color="#00F2FF" />
              </View>
              <View style={styles.appInfo}>
                <Typography variant="body" style={styles.appName}>{app.name}</Typography>
                <Typography variant="caption" style={styles.appDesc}>{app.desc}</Typography>
                <View style={styles.ratingRow}>
                  <Star size={10} color="#FFD700" fill="#FFD700" />
                  <Typography variant="caption" style={styles.ratingText}>{app.rating}</Typography>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Download size={16} color="#ffffff" />
              </TouchableOpacity>
            </BlurView>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#05070A',
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  aura: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    top: -100,
    left: -200,
    backgroundColor: 'rgba(0, 242, 255, 0.03)',
    ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } as any : {}),
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.1)',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  appDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 4,
    color: '#FFD700',
    fontWeight: '800',
    fontSize: 11,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }
});
