import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Container, Typography } from '../components/Base';
import { ThemeCard } from '../components/ThemeCard';
import { getSemanticInsights, getSemanticStatus } from '../services/insights';
import { semanticOutputService } from '../services/semantic-output';

export const ThemesScreen: React.FC = () => {
  const [themes, setThemes] = React.useState(getSemanticInsights());
  const [status, setStatus] = React.useState(getSemanticStatus());

  React.useEffect(() => {
    const unsubscribe = semanticOutputService.subscribe(() => {
      setThemes(getSemanticInsights());
      setStatus(getSemanticStatus());
    });
    return unsubscribe;
  }, []);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <View style={styles.stateContainer}>
          <Typography style={styles.stateText}>A sincronizar rastro biográfico...</Typography>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <View style={styles.stateContainer}>
          <Typography style={styles.stateText}>Erro na recepção do bundle semântico.</Typography>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {themes.map((theme, index) => (
          <ThemeCard key={index} {...theme} />
        ))}
      </ScrollView>
    );
  };

  return (
    <Container safe style={styles.container}>
      <View style={styles.atmosphere}>
        <View style={styles.aura} />
      </View>

      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>Temas AI</Typography>
        <Typography style={styles.subtitle}>Insights determinísticos v1.2.0</Typography>
      </View>
      
      {renderContent()}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#05070A',
    flex: 1,
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
    ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } : {}),
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
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  stateText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 16,
  }
});
