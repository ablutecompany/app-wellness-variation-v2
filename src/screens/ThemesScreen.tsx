import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Container, Typography } from '../components/Base';
import { ThemeCard } from '../components/ThemeCard';

import { useStore } from '../store/useStore';
import { generateInsights } from '../services/insights';

export const ThemesScreen: React.FC = () => {
  const store = useStore();
  const themes = generateInsights(store);

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
        {themes.map((theme, index) => (
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
