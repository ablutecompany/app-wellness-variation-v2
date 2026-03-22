import React, { useRef, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated, FlatList, ListRenderItem, Platform } from 'react-native';
import { theme } from '../theme';
import { Nucleus } from './Nucleus';
import { SideTabPreview } from './SideTabPreview';
import { ActiveContentPanel, ActiveContentPanelProps } from './ActiveContentPanel';

const { width, height } = Dimensions.get('window');
const CAROUSEL_WIDTH = width;
const LOOP_COUNT = 100; // Large number to simulate infinite scrolling

// Master Data List (13 Nodes)
export const ORBITAL_NODES: ActiveContentPanelProps[] = [
  { isHome: true, color: theme.colors.biologicalBlue },
  { isHome: false, theme_id: 't1', theme_label: 'Performance', color: theme.colors.biologicalBlue, theme_score: 88, theme_status_short: 'Apto' },
  { isHome: false, theme_id: 't2', theme_label: 'Recuperação', color: theme.colors.biologicalBlue, theme_score: 78, theme_status_short: 'Descanso ligeiro' },
  { isHome: false, theme_id: 't3', theme_label: 'Energia', color: theme.colors.wellnessGreen, theme_score: 91, theme_status_short: 'Pico' },
  { isHome: false, theme_id: 't4', theme_label: 'Prontidão funcional', color: theme.colors.wellnessGreen, theme_score: 85, theme_status_short: 'Apto' },
  { isHome: false, theme_id: 't5', theme_label: 'Resistência', color: theme.colors.biologicalBlue, theme_score: 82, theme_status_short: 'Estável' },
  { isHome: false, theme_id: 't6', theme_label: 'Construção muscular', color: theme.colors.warning, theme_score: 74, theme_status_short: 'Em foco' },
  { isHome: false, theme_id: 't7', theme_label: 'Composição corporal', color: theme.colors.biologicalBlue, theme_score: 89, theme_status_short: 'Otimo' },
  { isHome: false, theme_id: 't8', theme_label: 'Sono', color: theme.colors.wellnessGreen, theme_score: 95, theme_status_short: 'Profundo' },
  { isHome: false, theme_id: 't9', theme_label: 'Foco e clareza mental', color: theme.colors.biologicalBlue, theme_score: 86, theme_status_short: 'Claro' },
  { isHome: false, theme_id: 't10', theme_label: 'Vitalidade', color: theme.colors.wellnessGreen, theme_score: 90, theme_status_short: 'Alta' },
  { isHome: false, theme_id: 't11', theme_label: 'Resiliência ao stress', color: theme.colors.error, theme_score: 65, theme_status_short: 'Alerta' },
  { isHome: false, theme_id: 't12', theme_label: 'Bem-estar funcional', color: theme.colors.biologicalBlue, theme_score: 84, theme_status_short: 'Equilíbrio' },
];

export interface OrbitalCarouselProps {
  globalScore: number;
  isMeasuring: boolean;
  onNfcTap: () => void;
  onLongPress: () => void;
}

export const OrbitalCarousel: React.FC<OrbitalCarouselProps> = ({ globalScore, isMeasuring, onNfcTap, onLongPress }) => {
  const flatListRef = useRef<FlatList>(null);
  
  // The scrollX animated value to drive interpolations
  const scrollX = useRef(new Animated.Value(0)).current;

  // Flatten the array to simulate infinite scroll
  const data: ActiveContentPanelProps[] = useMemo(() => {
    const list: any[] = [];
    for (let i = 0; i < LOOP_COUNT; i++) {
      ORBITAL_NODES.forEach((node, idx) => {
        list.push({ ...node, _key: `${i}_${idx}`, _indexInLoop: idx });
      });
    }
    return list;
  }, []);

  const SEQUENCE_LENGTH = ORBITAL_NODES.length;
  const middleLoopIndex = Math.floor(LOOP_COUNT / 2) * SEQUENCE_LENGTH; // Starts pointing at Home

  // Get index wrapping logic
  const getPrevNode = (idx: number) => ORBITAL_NODES[(idx - 1 + SEQUENCE_LENGTH) % SEQUENCE_LENGTH];
  const getNextNode = (idx: number) => ORBITAL_NODES[(idx + 1) % SEQUENCE_LENGTH];

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    // Interpolate opacity/scale based on scroll position so the active panel is only visible when snapped
    const inputRange = [
      (index - 1) * CAROUSEL_WIDTH,
      index * CAROUSEL_WIDTH,
      (index + 1) * CAROUSEL_WIDTH
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp'
    });
    
    // We only attach pointerEvents when fully visible to prevent blocking gestures
    const nodeIdx = item._indexInLoop;
    const prevNode = getPrevNode(nodeIdx);
    const nextNode = getNextNode(nodeIdx);

    const isCurrentlyHome = item.isHome;

    return (
      <View style={styles.slide}>
        
        {/* Abstract Side Previews (Fixed to left and right edges, visible even during scroll crossing) */}
        <Animated.View style={[styles.previewLeft, { opacity }]}>
          <SideTabPreview 
            position="left" 
            label={prevNode.isHome ? 'Home' : (prevNode.theme_label || '')} 
            score={prevNode.theme_score || globalScore} 
            color={prevNode.color || theme.colors.primary} 
          />
        </Animated.View>

        <Animated.View style={[styles.previewRight, { opacity }]}>
          <SideTabPreview 
            position="right" 
            label={nextNode.isHome ? 'Home' : (nextNode.theme_label || '')} 
            score={nextNode.theme_score || globalScore} 
            color={nextNode.color || theme.colors.primary} 
          />
        </Animated.View>

        {/* The Active Content HUD over the Nucleus */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="box-none">
          <ActiveContentPanel 
            {...item} 
            onHomeCtaPress={onNfcTap}
            home_state_title={isMeasuring ? 'A calibrar biologica...' : undefined}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* Central Fixed Core */}
      <View style={styles.fixedNucleusContainer}>
         <Nucleus 
           score={globalScore} 
           status={isMeasuring ? 'forte' : 'fraco'} 
           onPress={() => {}} // Swiping determines navigation now
           onLongPress={onLongPress}
         />
      </View>

      {/* The Scrollable Orbital Ring */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.FlatList
          ref={flatListRef as any}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_WIDTH}
          decelerationRate="fast"
          initialScrollIndex={middleLoopIndex}
          getItemLayout={(_, index) => ({
            length: CAROUSEL_WIDTH,
            offset: CAROUSEL_WIDTH * index,
            index,
          })}
          windowSize={3}
          maxToRenderPerBatch={3}
          initialNumToRender={3}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: Platform.OS !== 'web' } // Web NativeDriver for scroll sometimes throws, but let's try true or false (false is safer for scroll Web)
          )}
          scrollEventThrottle={16}
          style={styles.orbitList}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: CAROUSEL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedNucleusContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  orbitList: {
    flex: 1,
    zIndex: 2,
  },
  slide: {
    width: CAROUSEL_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewLeft: {
    position: 'absolute',
    left: -20, // Keep it partially offscreen or hugging the edge
    top: '40%',
    zIndex: 3,
  },
  previewRight: {
    position: 'absolute',
    right: -20,
    top: '40%',
    zIndex: 3,
  }
});
