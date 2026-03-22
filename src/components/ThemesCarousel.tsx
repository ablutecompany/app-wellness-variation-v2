import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Animated, Platform, useWindowDimensions, PanResponder, TouchableOpacity, ScrollView, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { Typography } from './Base';
import { Nucleus } from './Nucleus';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
interface CardNode {
  id: string;
  isHome: boolean;
  label: string;
  score: number;
  short: string;
  longTitle: string;
  detail: string;
  actions: string[];
  contribution: string;
  accent: string;
}

export interface ThemesCarouselProps {
  globalScore: number;
  isMeasuring: boolean;
  onNfcTap: () => void;
  onLongPress: () => void;
  onNodeChange?: (isHome: boolean) => void;
  daysSinceExam?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// THEMES DATA — Consistent professional accents
// ─────────────────────────────────────────────────────────────────────────────
const CARDS: CardNode[] = [
  { id: 'home', isHome: true, label: '', score: 0, short: '', longTitle: '', detail: '', actions: [], contribution: '', accent: '#00F2FF' },
  {
    id: 'performance',
    isHome: false,
    label: 'Performance & Equilíbrio',
    score: 81,
    short: 'Dia sólido',
    longTitle: 'Tens base para ter um bom desempenho hoje, mas o teu corpo parece responder melhor a equilíbrio do que a excesso.',
    detail: 'Continua capaz e funcional, mas já com sinais de carga acumulada. Se mantiveres controlo, ritmo e boa gestão do esforço, a resposta tende a ser melhor.',
    actions: ['Mantém um ritmo constante no treino', 'Hidrata-te bem ao longo do dia', 'Evita somar fadiga desnecessária'],
    contribution: 'Frequência cardíaca e variabilidade (HRV) cruzadas com marcadores metabólicos sugerem um dia de carga moderada.',
    accent: '#00FF95', // Emerald
  },
  {
    id: 'energy',
    isHome: false,
    label: 'Energia & Disponibilidade',
    score: 85,
    short: 'Energia estável',
    longTitle: 'Tens energia disponível para o dia, mas não de forma infinita.',
    detail: 'O teu corpo continua a responder bem, embora possa perder estabilidade se descurares hidratação ou pausas.',
    actions: ['Não saltes refeições principais', 'Mantém água por perto', 'Foca-te em tarefas exigentes agora'],
    contribution: 'Marcadores de hidratação e ureia sugerem boa disponibilidade, mas com necessidade de suporte constante.',
    accent: '#00F2FF', // Cyan
  },
  {
    id: 'recovery',
    isHome: false,
    label: 'Recuperação',
    score: 72,
    short: 'Em progresso',
    longTitle: 'O teu corpo está a recuperar, mas ainda não terminou esse processo.',
    detail: 'Há margem para consolidar descanso e reposição. Hoje compensa proteger a recuperação.',
    actions: ['Privilegia sono de qualidade', 'Evita esforço intenso adicional', 'Reposição eletrolítica ativa'],
    contribution: 'HRV abaixo do baseline e frequência de repouso elevada indicam processo de recuperação ativo.',
    accent: '#FFD700', // Gold
  },
  {
    id: 'overall',
    isHome: false,
    label: 'Avaliação geral',
    score: 80,
    short: 'Equilíbrio Ativo',
    longTitle: 'No geral, o teu corpo está num bom lugar — hoje é um dia para consolidar.',
    detail: 'A leitura integrada é positiva. Mantenha os bons hábitos para estabilizar o sistema.',
    actions: ['Mantém as rotinas atuais', 'Dá atenção ao descanso', 'Consolidação de carga'],
    contribution: 'Integração de todos os biossinais sugere um estado funcional estável e sem alertas.',
    accent: '#00F2FF',
  },
];

const NODE_COUNT = CARDS.length;

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING — refined tech aesthetic
// ─────────────────────────────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number; accent: string }> = ({ score, accent }) => {
  const radius = 30;
  const stroke = 2.5;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (score / 100) * circ;

  return (
    <View style={ring.wrap}>
      {Platform.OS === 'web' ? (
        <svg width={70} height={70} viewBox="0 0 70 70" style={{ position: 'absolute' } as any}>
          <circle cx="35" cy="35" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx="35" cy="35" r={radius} fill="none" stroke={accent} strokeWidth={stroke}
            strokeDasharray={`${circ}`} strokeDashoffset={`${progress}`}
            strokeLinecap="round" transform="rotate(-90 35 35)" />
        </svg>
      ) : (
        <View style={[ring.track, { width: 70, height: 70, borderRadius: 35, borderWidth: stroke, borderColor: 'rgba(255,255,255,0.06)' }]} />
      )}
      <Typography style={[ring.num, { color: accent }]}>{score}</Typography>
    </View>
  );
};

const ring = StyleSheet.create({
  wrap: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute' },
  num: { fontSize: 22, fontWeight: '800', letterSpacing: -1 },
});

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC GLOW BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const DynBg: React.FC<{ accent: string }> = ({ accent }) => {
  const dx = useRef(new Animated.Value(0)).current;
  const p = useRef(new Animated.Value(0.1)).current;
  useEffect(() => {
    const a1 = Animated.loop(Animated.sequence([
      Animated.timing(dx, { toValue: 15, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(dx, { toValue: -15, duration: 8000, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    const a2 = Animated.loop(Animated.sequence([
      Animated.timing(p, { toValue: 0.3, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(p, { toValue: 0.1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
    ]));
    a1.start(); a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, [dx, p]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{ 
        position: 'absolute', width: 400, height: 400, borderRadius: 200, 
        top: '10%', left: '5%', backgroundColor: accent + '12', opacity: p, 
        transform: [{ translateX: dx }], 
        ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } as any : {}) 
      }} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOLOGRAPHIC THEME CARD
// ─────────────────────────────────────────────────────────────────────────────
const ThemeCard: React.FC<{ card: CardNode }> = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    Animated.spring(expandAnim, { toValue: next ? 1 : 0, tension: 60, friction: 10, useNativeDriver: false }).start();
  };

  const expandHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 320] });
  const expandOpacity = expandAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });

  return (
    <View style={c.container}>
      <BlurView intensity={Platform.OS === 'web' ? 12 : 25} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[c.accentBar, { backgroundColor: card.accent }]} />
      
      <View style={c.content}>
        <View style={c.header}>
          <ScoreRing score={card.score} accent={card.accent} />
          <View style={c.headerInfo}>
            <Typography variant="caption" style={c.label}>{card.label}</Typography>
            <Typography variant="h3" style={c.short}>{card.short}</Typography>
          </View>
          <TouchableOpacity style={c.plusBtn} onPress={toggle}>
            <Plus size={18} color={isOpen ? 'rgba(255,255,255,0.2)' : card.accent} />
          </TouchableOpacity>
        </View>

        <Typography style={c.longTitle}>{card.longTitle}</Typography>

        <Animated.View style={{ maxHeight: expandHeight, opacity: expandOpacity, overflow: 'hidden' }}>
          <View style={c.divider} />
          <Typography style={c.detail}>{card.detail}</Typography>
          
          <Typography variant="caption" style={c.actionHead}>Protocolo Sugerido</Typography>
          {card.actions.map((a, i) => (
            <View key={i} style={c.actionLine}>
              <View style={[c.dot, { backgroundColor: card.accent }]} />
              <Typography style={c.actionTxt}>{a}</Typography>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const c = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    opacity: 0.6,
  },
  content: { padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerInfo: { flex: 1, marginLeft: 16 },
  label: { opacity: 0.5, marginBottom: 2 },
  short: { color: '#fff' },
  plusBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  longTitle: {
    fontSize: 15, lineHeight: 22,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 20,
  },
  detail: {
    fontSize: 14, lineHeight: 22,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  actionHead: { color: 'rgba(255,255,255,0.3)', marginBottom: 12 },
  actionLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, marginRight: 10, opacity: 0.6 },
  actionTxt: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN THEMES CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
export const ThemesCarousel: React.FC<ThemesCarouselProps> = ({ globalScore, isMeasuring, onNfcTap, onLongPress, onNodeChange, daysSinceExam = 14 }) => {
  const { width } = useWindowDimensions();
  const CW = Platform.OS === 'web' ? Math.min(width, 500) : width;

  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { onNodeChange?.(CARDS[activeIndex].isHome); }, [activeIndex, onNodeChange]);

  const navigateTo = useCallback((dir: 'next' | 'prev') => {
    const ex = dir === 'next' ? -1 : 1;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(slideAnim, { toValue: ex * -30, duration: 150, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => {
      setActiveIndex((p: number) => dir === 'next' ? (p + 1) % NODE_COUNT : (p - 1 + NODE_COUNT) % NODE_COUNT);
      slideAnim.setValue(ex * 30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  const goHome = useCallback(() => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      setActiveIndex(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: Platform.OS !== 'web' }).start();
    });
  }, [fadeAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 15 && Math.abs(gs.dy) < 50,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -35 || gs.vx < -0.3) navigateTo('next');
        else if (gs.dx > 35 || gs.vx > 0.3) navigateTo('prev');
      },
    })
  ).current;

  const n = CARDS[activeIndex];

  return (
    <View style={[s.root, { width: CW }]} {...panResponder.panHandlers}>
      {!n.isHome && <DynBg accent={n.accent} />}

      {Platform.OS === 'web' && (
        <>
          <TouchableOpacity style={[s.arw, { left: 10 }]} onPress={() => navigateTo('prev')}>
            <ChevronLeft size={20} color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.arw, { right: 10 }]} onPress={() => navigateTo('next')}>
            <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
        </>
      )}

      {!n.isHome && (
        <TouchableOpacity style={s.closeBtn} onPress={goHome}>
          <X size={16} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      )}

      <Animated.View style={[s.stage, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        {n.isHome ? (
          <View style={s.homeZone}>
            <Nucleus score={globalScore} status={isMeasuring ? 'forte' : 'fraco'} onPress={onNfcTap} onLongPress={onLongPress} daysSinceExam={daysSinceExam} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 60 }} style={{ flex: 1, width: '100%' }}>
            <ThemeCard card={n} />
          </ScrollView>
        )}
      </Animated.View>

      <View style={s.indicator}>
        {CARDS.map((t, i) => (
          <View key={t.id} style={[s.dot, i === activeIndex && s.dotActive, i === activeIndex && { backgroundColor: t.isHome ? theme.colors.primary : t.accent }]} />
        ))}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stage: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  indicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)' },
  dotActive: { width: 14, height: 4, borderRadius: 2 },
  arw: { position: 'absolute', top: '50%', zIndex: 100, width: 40, height: 40, borderRadius: 20,backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  closeBtn: { position: 'absolute', top: 10, right: 30, zIndex: 100, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  homeZone: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
});
