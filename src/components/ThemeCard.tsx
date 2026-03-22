import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from './Base';
import { theme } from '../theme';

interface ThemeProps {
  title: string;
  paragraph1: string;
  paragraph2: string;
  refText1: string;
  refText2: string;
}

export const ThemeCard: React.FC<ThemeProps> = ({
  title,
  paragraph1,
  paragraph2,
  refText1,
  refText2
}) => {
  const [showRefs, setShowRefs] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={20} tint="dark" style={styles.glassCard}>
        <Typography variant="h3" style={styles.title}>{title}</Typography>
        
        <View style={styles.divider} />

        <Typography style={styles.paragraph1}>{paragraph1}</Typography>
        
        <Typography variant="caption" style={styles.paragraph2}>
          {paragraph2}
        </Typography>

        <TouchableOpacity 
          style={styles.refButton} 
          onPress={() => setShowRefs(true)}
          activeOpacity={0.7}
        >
          <Typography variant="caption" style={styles.refText}>REFERÊNCIAS</Typography>
        </TouchableOpacity>
      </BlurView>

      <Modal visible={showRefs} transparent animationType="fade">
        <BlurView intensity={60} tint="dark" style={styles.refModalFullscreen}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            onPress={() => setShowRefs(false)} 
            activeOpacity={1}
          />
          <View style={styles.refModalCentered}>
            <View style={styles.refModal}>
              <Typography style={styles.refModalContent1}>
                {refText1}
              </Typography>
              <Typography variant="caption" style={styles.refModalContent2}>
                {refText2}
              </Typography>
              <TouchableOpacity 
                style={styles.refCloseBtn} 
                onPress={() => setShowRefs(false)}
              >
                <Typography style={styles.refCloseText}>FECHAR</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glassCard: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  title: {
    color: '#00F2FF',
    marginBottom: 16,
    letterSpacing: -0.5,
    fontSize: 20,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  paragraph1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 12,
  },
  paragraph2: {
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    fontSize: 13,
  },
  refButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  refText: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 10,
  },
  refModalFullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Dim it a bit under the blur
  },
  refModalCentered: {
    width: '85%',
    maxWidth: 400,
  },
  refModal: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
  },
  refModalContent1: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 16,
  },
  refModalContent2: {
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
    fontSize: 12,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  refCloseBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 242, 255, 0.1)',
  },
  refCloseText: {
    color: '#00F2FF',
    fontSize: 12,
    fontWeight: '700',
  }
});
