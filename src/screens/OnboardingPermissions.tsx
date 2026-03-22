import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../components/Base';
import { Button } from './OnboardingWelcome';
import { theme } from '../theme';
import { 
  Activity, 
  Bluetooth, 
  Heart, 
  MapPin, 
  Mic, 
  Smartphone 
} from 'lucide-react-native';

const ESSENTIAL_PERMISSIONS = [
  { id: 'nfc', icon: Smartphone, title: 'Hardware ablute_', desc: 'Ativação imediata via NFC para análise funcional.' },
  { id: 'consent', icon: Smartphone, title: 'Privacidade e Consentimento', desc: 'Acordo legal para processamento seguro dos teus dados.' },
];

const RECOMMENDED_PERMISSIONS = [
  { id: 'health', icon: Heart, title: 'Biomarcadores de Saúde', desc: 'Sincronização passiva para contexto AI personalizado.' },
  { id: 'sensors', icon: Activity, title: 'Atividade e Movimento', desc: 'Interpretação da tua recuperação e esforço diário.' },
  { id: 'location', icon: Bluetooth, title: 'Equipamento Próximo', desc: 'Deteção automática de hardware via Bluetooth LE.' },
];

export const OnboardingPermissions: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleFinalize = () => {
    navigation.goBack();
  };

  const renderItem = (p: any) => (
    <View key={p.id} style={styles.permissionItem}>
      <View style={styles.iconContainer}>
        <p.icon size={22} color={theme.colors.primary} />
      </View>
      <View style={styles.permText}>
        <Typography variant="body" style={styles.permTitle}>{p.title}</Typography>
        <Typography variant="caption" color={theme.colors.textMuted}>{p.desc}</Typography>
      </View>
    </View>
  );

  return (
    <Container safe style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h2" style={styles.title}>
            Inputs e Fontes de Dados
          </Typography>
          <Typography color={theme.colors.textSecondary} style={styles.subtitle}>
            A tua base biológica. Quanto mais sinais autorizares, mais precisa e útil será a leitura interpretativa do teu corpo.
          </Typography>
        </View>

        <Typography variant="caption" color={theme.colors.textMuted} style={styles.sectionLabel}>
          ESSENCIAIS
        </Typography>
        {ESSENTIAL_PERMISSIONS.map(renderItem)}

        <View style={{ height: theme.spacing.xl }} />

        <Typography variant="caption" color={theme.colors.textMuted} style={styles.sectionLabel}>
          RECOMENDADOS (CONTEXTO AI)
        </Typography>
        {RECOMMENDED_PERMISSIONS.map(renderItem)}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Salvar e Voltar" 
          onPress={handleFinalize}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    lineHeight: 24,
  },
  sectionLabel: {
    marginBottom: theme.spacing.md,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  permText: {
    flex: 1,
  },
  permTitle: {
    fontWeight: '600',
    marginBottom: 2,
    color: theme.colors.text,
  },
  footer: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  skip: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  skipText: {
    textAlign: 'center',
    opacity: 0.6,
  }
});
