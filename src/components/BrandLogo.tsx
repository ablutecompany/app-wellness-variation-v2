import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'small' }) => {
  const fontSize = size === 'large' ? 28 : size === 'medium' ? 20 : 16;

  return (
    <View style={styles.container}>
      <Text style={[styles.base, { fontSize }]}>
        {'ablute'}
        <Text style={[styles.under, { fontSize }]}>{'_'}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: -1,
  },
  under: {
    color: '#73BCFF',
    fontWeight: '700',
  },
});
