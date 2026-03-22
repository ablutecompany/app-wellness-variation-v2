import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Typography } from './Base';
import { theme } from '../theme';

interface Optimization {
  type: string;
  description: string;
}

interface ThemeProps {
  title: string;
  score: number;
  state: string;
  summary: string;
  explanation: string;
  optimizations: Optimization[];
  potential: string;
}

export const ThemeCard: React.FC<ThemeProps> = ({
  title,
  score,
  state,
  summary,
  explanation,
  optimizations,
  potential
}) => {
  const [showRefs, setShowRefs] = React.useState(false);

  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={20} tint="dark" style={styles.glassCard}>
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <Typography variant="h3" style={styles.title}>{title}</Typography>
            <View style={styles.stateTag}>
              <Typography variant="caption" style={styles.stateText}>
                {state.toUpperCase()}
              </Typography>
            </View>
          </View>
          <View style={styles.scoreCircle}>
            <Typography variant="h3" style={styles.scoreVal}>{score}</Typography>
          </View>
        </View>

        <Typography style={styles.summary}>{summary}</Typography>
        
        <Typography variant="caption" style={styles.explanation}>
          {explanation}
        </Typography>

        <View style={styles.divider} />

        <View style={styles.optHeader}>
          <Typography variant="caption" style={styles.sectionLabel}>ESTRATÉGIAS DE OTIMIZAÇÃO</Typography>
          <View style={styles.potentialBox}>
            <Typography variant="caption" style={styles.potentialLabel}>POTENCIAL: </Typography>
            <Typography variant="caption" style={styles.potentialVal}>{potential}</Typography>
          </View>
        </View>

        {optimizations.map((opt, index) => (
          <View key={index} style={styles.optRow}>
            <View style={styles.optIndicator} />
            <View style={styles.optMain}>
              <Typography variant="caption" style={styles.optType}>{opt.type}</Typography>
              <Typography style={styles.optDesc}>{opt.description}</Typography>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.refButton} 
          onPress={() => setShowRefs(true)}
          activeOpacity={0.7}
        >
          <Typography variant="caption" style={styles.refText}>REFERÊNCIAS</Typography>
        </TouchableOpacity>
      </BlurView>

      {showRefs && (
        <View style={styles.refModalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            onPress={() => setShowRefs(false)} 
          />
          <BlurView intensity={80} tint="dark" style={styles.refModal}>
            <Typography variant="h3" style={styles.refModalTitle}>Fontes & Referências</Typography>
            <Typography variant="caption" style={styles.refModalContent}>
              Este insight é baseado em biomarcadores urinários (NT-proBNP, Potássio) e dados de variabilidade cardíaca. As recomendações seguem as diretrizes da European Society of Cardiology.
            </Typography>
            <TouchableOpacity 
              style={styles.refCloseBtn} 
              onPress={() => setShowRefs(false)}
            >
              <Typography style={styles.refCloseText}>FECHAR</Typography>
            </TouchableOpacity>
          </BlurView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glassCard: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleArea: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  stateTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.15)',
  },
  stateText: {
    color: '#00F2FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scoreVal: {
    color: '#00F2FF',
    fontSize: 22,
    fontWeight: '300',
  },
  summary: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  explanation: {
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 20,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  optHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  potentialBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  potentialLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  potentialVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00D4AA',
  },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  optIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00F2FF',
    marginRight: 16,
    opacity: 0.6,
  },
  optMain: {
    flex: 1,
  },
  optType: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  optDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  refButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  refText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  refModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  refModal: {
    width: '90%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(10, 15, 25, 0.8)',
  },
  refModalTitle: {
    color: '#fff',
    marginBottom: 12,
  },
  refModalContent: {
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
    marginBottom: 20,
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
