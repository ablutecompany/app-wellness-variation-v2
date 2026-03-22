import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Container, Typography } from '../components/Base';
import { ThemeCard } from '../components/ThemeCard';

const MOCK_THEMES = [
  {
    title: 'Recuperação Muscular',
    score: 64,
    state: 'abaixo do ideal',
    summary: 'O teu corpo está a processar uma carga de stress físico elevada.',
    explanation: 'Os níveis de biomarcadores indicam uma ligeira desidratação e um rácio de cortisol/DHEA acima da média. Isto sugere que a recuperação pós-treino não foi concluída.',
    potential: '64 → 72',
    optimizations: [
      { type: 'HABITOS', description: 'Aumentar o repouso ativo hoje.' },
      { type: 'ALIMENTAÇÃO', description: 'Reforçar magnésio através de espinafres e amêndoas.' }
    ]
  },
  {
    title: 'Foco e Performance',
    score: 82,
    state: 'bom',
    summary: 'Estado de alerta excelente com boa resiliência cognitiva.',
    explanation: 'A variabilidade da frequência cardíaca (HRV) está estável e o sono profundo atingiu o objetivo. Estás num estado propício para trabalho profundo.',
    potential: '82 → 88',
    optimizations: [
      { type: 'SONO', description: 'Manter a hora de deitar de ontem.' },
      { type: 'HABITOS', description: 'Exposição solar matinal de 15 min.' }
    ]
  }
];

export const ThemesScreen: React.FC = () => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.atmosphere}>
        <View style={styles.aura} />
      </View>

      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>Temas AI</Typography>
        <Typography style={styles.subtitle}>Insights baseados no teu contexto atual</Typography>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MOCK_THEMES.map((theme, index) => (
          <ThemeCard key={index} {...theme} />
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
    top: -200,
    right: -200,
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
  }
});
