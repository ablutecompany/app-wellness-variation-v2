import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, PanResponder, useWindowDimensions, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { BrandLogo } from '../components/BrandLogo';
import { ThemeCard } from '../components/ThemeCard';
import { Utensils, Zap, SlidersHorizontal, Activity, Database, Smartphone, X, User, ChevronRight, Menu, Battery, Heart, Scale, Droplets, Target, Settings, RefreshCw, Moon, Droplet, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Video, ResizeMode } from 'expo-av';

const RAW_BIOMARKERS = [
  { id: 'b1', name: 'NT-proBNP', value: '120', unit: 'pg/mL', source: 'ablute' },
  { id: 'b2', name: 'F2-isoprostanos', value: '2.4', unit: 'ng/mg', source: 'ablute' },
  { id: 'b3', name: 'Sódio', value: '140', unit: 'mEq/L', source: 'ablute' },
  { id: 'b4', name: 'Potássio', value: '4.2', unit: 'mEq/L', source: 'ablute' },
  { id: 'b5', name: 'Potencial Redox', value: '-12', unit: 'mV', source: 'ablute' },
  { id: 'b6', name: 'pH Urinário', value: '6.2', unit: 'pH', source: 'ablute' },
  { id: 'b7', name: 'Glicose', value: '88', unit: 'mg/dL', source: 'ablute' },
  { id: 'b8', name: 'Ritmo Cardíaco', value: '64', unit: 'bpm', source: 'health_kit' },
];

const MOCK_THEMES = [
  {
    title: 'Performance & Equilíbrio',
    paragraph1: 'Tens base para ter um bom desempenho hoje, mas o teu corpo parece responder melhor a equilíbrio do que a excesso.',
    paragraph2: 'Continua capaz e funcional, mas já com sinais de carga acumulada. Se mantiveres controlo, ritmo e boa gestão do esforço, a resposta tende a ser melhor do que se tentares puxar ao máximo.',
    refText1: 'Para esta leitura, olharam-se sobretudo os sinais que ajudam a perceber como o teu corpo está a lidar com esforço e equilíbrio geral no dia de hoje. A tua frequência cardíaca de repouso apareceu um pouco acima do teu habitual e a variabilidade cardíaca ficou abaixo do teu baseline, o que muitas vezes é associado a maior carga fisiológica e menor frescura. Também foram considerados sinais urinários como creatinina e F2-isoprostanos, que ajudam a enquadrar concentração urinária e exigência do organismo após treino intenso.',
    refText2: 'Esta leitura procura dar contexto funcional. Questões de saúde devem ser discutidas com o médico.'
  },
  {
    title: 'Energia & Disponibilidade',
    paragraph1: 'Tens energia disponível para o dia, mas não de forma infinita.',
    paragraph2: 'O teu corpo continua a responder bem, embora possa perder estabilidade se descurares hidratação, refeições ou pausas. Hoje, pequenos ajustes ao longo do dia podem fazer diferença na forma como te manténs disponível.',
    refText1: 'Aqui pesaram mais os sinais ligados a hidratação, disponibilidade funcional e custo fisiológico do dia. O peso surgiu abaixo do teu habitual, e sódio, potássio e ureia urinários ajudaram a reforçar a ideia de um dia mais exigente, com sudorese e reposição ainda incompleta. Em conjunto, estes sinais são muitas vezes associados a energia disponível, mas menos estável se o corpo não for bem apoiado com água, alimentação e pausas.',
    refText2: 'Isto não substitui avaliação clínica. Se houver dúvidas sobre saúde, o ideal é falar com um médico.'
  },
  {
    title: 'Potencial',
    paragraph1: 'Hoje, dar o teu melhor não significa forçar mais.',
    paragraph2: 'Significa usar bem a capacidade que tens, com foco, critério e sem gastar o que o teu corpo ainda precisa para recuperar. O melhor de hoje parece estar mais na consistência do que em ir até ao limite.',
    refText1: 'Nesta leitura foram tidos em conta sobretudo os sinais que ajudam a perceber exigência, fadiga e capacidade de resposta no momento. A frequência cardíaca de repouso, a variabilidade cardíaca e a temperatura ligeiramente acima do teu habitual sugerem um corpo que já trabalhou bastante e que ainda está a reorganizar-se. A literatura associa muitas vezes este tipo de padrão a dias em que o melhor rendimento vem mais de boa gestão do que de insistir em mais carga.',
    refText2: 'A interpretação clínica de questões de saúde cabe sempre a profissionais de saúde.'
  },
  {
    title: 'Resistência saudável',
    paragraph1: 'O teu corpo mostra boa capacidade para aguentar bem o dia ou esforço moderado, desde que mantenhas um ritmo estável.',
    paragraph2: 'Há base para continuidade, mas a melhor resposta tende a surgir com constância e não com picos de intensidade. Hoje, a tua resistência parece mais saudável quando é bem distribuída.',
    refText1: 'Para este tema, o mais importante foi cruzar o teu baseline com os sinais do dia. O teu histórico mostra boa base cardiovascular e boa adaptação ao esforço, mas a leitura atual indica também algum custo acumulado. Foram especialmente relevantes a frequência cardíaca de repouso, a variabilidade cardíaca e alguns sinais urinários como ureia e creatinina, que ajudam a perceber como o corpo está a sustentar esforço e recuperação.',
    refText2: 'Esta explicação serve apenas para contexto funcional e não para diagnóstico.'
  },
  {
    title: 'Recuperação',
    paragraph1: 'O teu corpo está a recuperar, mas ainda não terminou esse processo.',
    paragraph2: 'Não há sinais de quebra, mas há margem evidente para consolidar descanso, hidratação e reposição. Hoje, pode compensar mais proteger a recuperação do que acrescentar nova exigência.',
    refText1: 'Este é um dos temas em que os sinais do dia pesam mais. A variabilidade cardíaca abaixo do teu habitual, a frequência cardíaca de repouso acima do baseline, a temperatura ligeiramente superior e marcadores como creatinina, ureia e F2-isoprostanos ajudam a reforçar a ideia de recuperação ainda em curso. A literatura associa muitas vezes este conjunto de sinais a um organismo que continua funcional, mas ainda a consolidar descanso, hidratação e reposição.',
    refText2: 'Se existirem dúvidas sobre saúde, sintomas ou alterações persistentes, deve falar com o médico.'
  },
  {
    title: 'Idade muscular',
    paragraph1: 'A tua base muscular parece boa para o teu contexto, mas hoje o corpo tende a responder melhor a consistência do que a estímulos agressivos.',
    paragraph2: 'Há boa margem funcional, mas a adaptação muscular beneficia mais de regularidade, alimentação e recuperação do que de insistir em carga alta num dia já exigente.',
    refText1: 'Aqui foram considerados sobretudo sinais que ajudam a enquadrar adaptação muscular, exigência do dia e capacidade de recuperação. Ureia e creatinina urinárias mais altas, juntamente com o peso ligeiramente abaixo do habitual e uma variabilidade cardíaca mais baixa, ajudam a perceber um corpo que treinou com intensidade e que pode beneficiar mais de regularidade e recuperação do que de insistência agressiva. Estes sinais são frequentemente usados na literatura para contextualizar esforço, adaptação e frescura funcional.',
    refText2: 'Esta leitura não substitui aconselhamento médico e deve ser vista apenas como orientação funcional.'
  }
];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [showProfile, setShowProfile] = useState(false);
  const [showControl, setShowControl] = useState(false);

  // ── Animation States ──────────────────────────────────────────────────────
  const themesAnim = useRef(new Animated.Value(-width)).current;
  const dataAnim = useRef(new Animated.Value(width)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(1)).current;

  const DRAWER_DOWN = 590;
  const DRAWER_UP = 0;
  const lastDrawerY = useRef(DRAWER_DOWN);
  const drawerAnim = useRef(new Animated.Value(DRAWER_DOWN)).current;

  // Force sync drawer position on hot reload so user sees exact bottom state
  React.useEffect(() => {
    drawerAnim.setValue(DRAWER_DOWN);
    lastDrawerY.current = DRAWER_DOWN;
  }, [DRAWER_DOWN]);

  const drawerBgOpacity = drawerAnim.interpolate({
    inputRange: [DRAWER_UP, DRAWER_DOWN],
    outputRange: [1, 0.10],
    extrapolate: 'clamp',
  });

  const drawerInnerOpacity = drawerAnim.interpolate({
    inputRange: [DRAWER_UP, DRAWER_DOWN],
    outputRange: [1, 0.25],
    extrapolate: 'clamp',
  });

  const centerContentY = drawerAnim.interpolate({
    inputRange: [DRAWER_UP, DRAWER_DOWN],
    outputRange: [-150, 0],
    extrapolate: 'clamp',
  });

  const drawerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, { dy }) => {
        let newY = lastDrawerY.current + dy;
        if (newY < DRAWER_UP) newY = DRAWER_UP;
        if (newY > DRAWER_DOWN) newY = DRAWER_DOWN;
        drawerAnim.setValue(newY);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        let finalY = lastDrawerY.current + dy;
        let toValue = DRAWER_DOWN;
        if (vy < -0.5 || finalY < (DRAWER_DOWN + DRAWER_UP) / 2) toValue = DRAWER_UP;
        else toValue = DRAWER_DOWN;

        Animated.spring(drawerAnim, {
          toValue,
          bounciness: 0,
          useNativeDriver: false,
        }).start(() => {
          lastDrawerY.current = toValue;
        });
      }
    })
  ).current;

  // ── Central Visual Animation ──────────────────────────────────────────────
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 3000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, { toValue: 1, duration: 15000, useNativeDriver: true }),
        Animated.timing(floatAnim1, { toValue: 0, duration: 15000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, { toValue: 0, duration: 20000, useNativeDriver: true }),
        Animated.timing(floatAnim2, { toValue: 1, duration: 20000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ── Gesture Handlers ──────────────────────────────────────────────────────
  const mainPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > 10 || Math.abs(dy) > 10,
      onPanResponderRelease: (_, { x0, dx, dy }) => {
        // Left Edge Swipe -> Themes
        if (x0 < 60 && dx > 80) {
          Animated.spring(themesAnim, { toValue: 0, useNativeDriver: true }).start();
        }
        // Right Edge Swipe -> Data
        if (x0 > width - 60 && dx < -80) {
          Animated.spring(dataAnim, { toValue: 0, useNativeDriver: true }).start();
        }
        // Bottom Swipe Up -> App Drawer
        if (dy < -60) {
          Animated.spring(drawerAnim, { toValue: DRAWER_UP, useNativeDriver: false }).start(() => lastDrawerY.current = DRAWER_UP);
        }
      },
    })
  ).current;

  return (
    <Container safe style={styles.container}>
      {/* ── FULL SCREEN BACKGROUND VIDEO ───────────────────────────────── */}
      <View style={StyleSheet.absoluteFillObject}>
        <Video
          source={require('../../assets/video (4).mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          rate={0.05}
          shouldPlay
          isLooping
          isMuted
        />
        {/* Base darkening layer */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.65)' }]} pointerEvents="none" />

        {/* Floating nuances */}
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: floatAnim1 }]} pointerEvents="none">
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: floatAnim2 }]} pointerEvents="none">
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.2)']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>

      <View {...mainPanResponder.panHandlers} style={styles.mainView}>
          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <BrandLogo size="medium" />
            <View style={styles.headerRight}>
              <View style={styles.topIconRow}>
                <TouchableOpacity style={styles.iconCircle} onPress={() => setShowControl(true)}>
                  <SlidersHorizontal size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconCircle} onPress={() => setShowProfile(true)}>
                  <User size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.evalBadge}>
                <Typography variant="caption" style={styles.evalText}>EVALUATION:</Typography>
                <Typography variant="caption" style={styles.evalVal}>8 DAYS AGO</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── CENTRAL VISUAL (The HoloPulse) ────────────────────────────────── */}
          <Animated.View style={[styles.centerContainer, { transform: [{ translateY: centerContentY }] }]}>
            <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={['rgba(0, 242, 255, 0.2)', 'rgba(0, 212, 170, 0.1)']}
                style={styles.orbInner}
              />
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>
          </Animated.View>

          {/* ── LEFT EDGE HANDLE: THEMES ──────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.leftEdgeHandle}
            onPress={() => Animated.spring(themesAnim, { toValue: 0, useNativeDriver: true }).start()}
          >
            <View style={styles.edgePill} />
            <Typography variant="caption" style={styles.edgeLabel}>TEMAS</Typography>
          </TouchableOpacity>

          {/* ── RIGHT EDGE HANDLE: BIODATA ────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.rightEdgeHandle}
            onPress={() => Animated.spring(dataAnim, { toValue: 0, useNativeDriver: true }).start()}
          >
            <View style={styles.edgePill} />
            <Typography variant="caption" style={styles.edgeLabel}>DADOS</Typography>
          </TouchableOpacity>

          {/* Trigger inside drawer now handles interactions */}
        </View>


        {/* ── SIDE PANEL: THEMES (LEFT) ─────────────────────────────────────── */}
        <Animated.View style={[styles.sidePanel, styles.leftPanel, { transform: [{ translateX: themesAnim }] }]}>
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.panelHeader}>
              <Typography variant="h2" style={styles.panelTitle}>Temas AI</Typography>
              <TouchableOpacity onPress={() => Animated.spring(themesAnim, { toValue: -width, useNativeDriver: true }).start()}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelScroll}>
              {MOCK_THEMES.map((theme, i) => (
                <ThemeCard key={i} {...theme} />
              ))}
            </ScrollView>
          </BlurView>
        </Animated.View>

        {/* ── SIDE PANEL: DATA (RIGHT) ──────────────────────────────────────── */}
        <Animated.View style={[styles.sidePanel, styles.rightPanel, { transform: [{ translateX: dataAnim }] }]}>
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.panelHeader}>
              <TouchableOpacity onPress={() => Animated.spring(dataAnim, { toValue: width, useNativeDriver: true }).start()}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
              <Typography variant="h2" style={styles.panelTitle}>Biodata</Typography>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelScroll}>
              {RAW_BIOMARKERS.map((item, i) => (
                <View key={i} style={styles.bioRow}>
                  <Typography style={styles.bioName}>{item.name}</Typography>
                  <View style={styles.bioValueArea}>
                    <Typography style={styles.bioVal}>{item.value}</Typography>
                    <Typography variant="caption" style={styles.bioUnit}>{item.unit}</Typography>
                  </View>
                </View>
              ))}
            </ScrollView>
          </BlurView>
        </Animated.View>

        {/* ── BOTTOM DRAWER: APPS ───────────────────────────────────────────── */}
        <Animated.View
          style={[styles.appDrawer, { transform: [{ translateY: drawerAnim }] }]}
        >
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: drawerBgOpacity }]}>
            <BlurView intensity={65} tint="dark" style={styles.drawerContent} />
          </Animated.View>

          <Animated.View style={{ flex: 1, width: '100%', opacity: drawerInnerOpacity, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' }}>
            <View {...drawerPanResponder.panHandlers} style={{ zIndex: 10, width: '100%', backgroundColor: 'transparent' }}>
              <View style={styles.drawerHandleArea}>
                <View style={styles.drawerHandle} />
                <Typography variant="caption" style={styles.drawerTitle}>APP PLACE</Typography>
              </View>

              <Animated.View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
                <View style={styles.appGrid}>
                  {[
                    { id: '1', name: 'Nutri', icon: <Utensils size={24} color="#00F2FF" /> },
                    { id: '2', name: 'Female', icon: <Zap size={24} color="#00D4AA" /> },
                    { id: '3', name: 'MySup', icon: <Activity size={24} color="#FFD700" /> },
                  ].map(app => (
                    <TouchableOpacity key={app.id} style={styles.appItem}>
                      <View style={styles.appIconContainer}>{app.icon}</View>
                      <Typography variant="caption" style={styles.appName}>{app.name}</Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </View>

            <Animated.View style={{ flex: 1, width: '100%' }}>
              <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              >
                <Typography variant="h3" style={styles.sectionTitle}>Disponíveis para Download</Typography>
                <View style={styles.downloadList}>
                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Moon size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>Sleep+</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Otimização de Ciclos</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Droplet size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>HydraTrack</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Gestão de Água</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Brain size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>Mind</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Foco e Meditação</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Activity size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>Fasting</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Jejum Intermitente</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Heart size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>CardioSync</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Saúde Cardiovascular</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.downloadRow}>
                    <View style={styles.rowIcon}>
                      <Target size={24} color="#00F2FF" opacity={0.6} />
                    </View>
                    <View style={styles.rowInfo}>
                      <Typography style={styles.rowTitle}>MacroTrack</Typography>
                      <Typography variant="caption" style={styles.rowDesc}>Nutrição Detalhada</Typography>
                    </View>
                    <View style={styles.rowActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Typography style={styles.actionText}>INFO</Typography>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.installBtn]}>
                        <Typography style={[styles.actionText, styles.installText]}>INSTALAR</Typography>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#05070A',
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  glowBall: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 20,
    zIndex: 100,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 12,
  },
  topIconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evalBadge: {
    backgroundColor: 'rgba(115, 188, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(115, 188, 255, 0.2)',
    alignItems: 'flex-end',
  },
  evalText: {
    fontSize: 9,
    color: '#73BCFF',
    fontWeight: '800',
    letterSpacing: 1,
    opacity: 0.6,
  },
  evalVal: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '800',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 120,
  },
  orbInner: {
    ...StyleSheet.absoluteFillObject,
  },
  centerLabel: {
    color: '#fff',
    letterSpacing: 4,
    fontWeight: '800',
    marginBottom: 8,
  },
  centerSub: {
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    fontWeight: '600',
  },
  footerLine: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  // Left/Right edge tap handles
  leftEdgeHandle: {
    position: 'absolute',
    left: 0,
    top: '40%',
    width: 32,
    height: 80,
    backgroundColor: 'rgba(115, 188, 255, 0.08)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'rgba(115, 188, 255, 0.2)',
  },
  rightEdgeHandle: {
    position: 'absolute',
    right: 0,
    top: '40%',
    width: 32,
    height: 80,
    backgroundColor: 'rgba(0, 212, 170, 0.08)',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: 'rgba(0, 212, 170, 0.2)',
  },
  edgePill: {
    width: 3,
    height: 28,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 4,
  },
  edgeLabel: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
    writingDirection: 'ltr',
    transform: [{ rotate: '90deg' }],
    marginTop: 4,
  },
  // Bottom App Drawer trigger (always visible)
  drawerTrigger: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Side Panels
  sidePanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 500,
  },
  leftPanel: {
    left: 0,
  },
  rightPanel: {
    right: 0,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  panelTitle: {
    color: '#fff',
  },
  panelScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  bioName: {
    color: '#fff',
    fontSize: 15,
  },
  bioValueArea: {
    alignItems: 'flex-end',
  },
  bioVal: {
    color: '#00F2FF',
    fontWeight: '700',
  },
  bioUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
  },
  // Main View
  mainView: {
    flex: 1,
  },
  // App Drawer
  appDrawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 750,
    zIndex: 400,
  },
  sectionTitle: {
    color: '#fff',
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 32,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    opacity: 0.6,
  },
  appGridSub: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  drawerContent: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  drawerHandleArea: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  drawerTitle: {
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '800',
  },
  appGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  appItem: {
    alignItems: 'center',
  },
  appIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    color: '#fff',
    fontWeight: '700',
  },
  downloadList: {
    gap: 16,
    paddingBottom: 40,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rowDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  installBtn: {
    backgroundColor: '#00F2FF',
  },
  installText: {
    color: '#000000',
  },
});
