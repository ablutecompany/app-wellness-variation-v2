import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Base';
import { Activity } from 'lucide-react-native';

export interface SideTabPreviewProps {
  label: string;
  score: number;
  color: string;
  position: 'left' | 'right';
}

export const SideTabPreview: React.FC<SideTabPreviewProps> = ({ label, score, color, position }) => {
  return (
    <View style={[styles.container, position === 'left' ? styles.left : styles.right]}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Typography variant="h3" style={styles.score}>
        {score || '--'}
      </Typography>
      <View style={styles.labelContainer}>
        <Typography variant="caption" style={styles.label} numberOfLines={1}>
          {label}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3, // "subtle visual identity" 
    transform: [{ scale: 0.85 }],
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: theme.spacing.sm,
  },
  score: {
    fontSize: 24,
    color: theme.colors.textMuted,
  },
  labelContainer: {
    maxWidth: 80,
    marginTop: theme.spacing.xs,
  },
  label: {
    color: theme.colors.textMuted,
    textAlign: 'center',
  }
});
