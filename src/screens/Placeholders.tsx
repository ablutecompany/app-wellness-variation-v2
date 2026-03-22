import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';

interface PlaceholderProps {
  title: string;
  icon?: React.ReactNode;
}

const PlaceholderScreen: React.FC<PlaceholderProps> = ({ title, icon }) => (
  <Container safe style={styles.container}>
    <View style={styles.content}>
      {icon}
      <Typography variant="h2" style={styles.title}>{title}</Typography>
      <Typography color={theme.colors.textSecondary}>Em desenvolvimento...</Typography>
    </View>
  </Container>
);

export const ThemesScreen = () => <PlaceholderScreen title="Temas AI" />;
export const AnalysesScreen = () => <PlaceholderScreen title="Biomarcadores" />;
export const AppsScreen = () => <PlaceholderScreen title="App Store" />;
export const ProfileScreen = () => <PlaceholderScreen title="Perfil" />;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  }
});
