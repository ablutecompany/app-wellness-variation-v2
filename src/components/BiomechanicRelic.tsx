import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import Svg, { RadialGradient, Defs, Rect, Stop, Circle, G } from 'react-native-svg';

const LinearGradient = Platform.OS === 'web'
  ? ({ style, colors, ...props }: any) => (
      <View style={[style, { backgroundImage: `linear-gradient(${props.start?.y === 0 ? '180deg' : '90deg'}, ${colors.join(', ')})` }]} {...props} />
    )
  : (() => { const { LinearGradient: LG } = require('expo-linear-gradient'); return LG; })();

const useSpinAnim = (duration: number) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true })).start();
  }, []);
  return anim;
};

const usePulseAnim = (duration: number) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: duration / 2, useNativeDriver: true })
    ])).start();
  }, []);
  return anim;
};

const useLinearAnim = (duration: number) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true })).start();
  }, []);
  return anim;
};

export const BiomechanicRelic = ({ size = 240 }: { size?: number }) => {
  // Breathes
  const mist1Anim = usePulseAnim(9000);
  const mist2Anim = usePulseAnim(12000);
  const shadowPulse = usePulseAnim(10000);
  const pulseGlow = usePulseAnim(6400);
  const ringPulse = usePulseAnim(7000);
  const eyeBeat = usePulseAnim(5600);
  const pupilBreathe = usePulseAnim(5600);
  
  // Star Drift (Parallax)
  const starDrift = useLinearAnim(44000).interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.1] });
  const twinkleLayer1 = usePulseAnim(8000).interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] });
  const twinkleLayer2 = usePulseAnim(6000).interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] });

  // Twinkles
  const twinkleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(twinkleAnim, { toValue: 1, duration: 1920, useNativeDriver: true }),
      Animated.timing(twinkleAnim, { toValue: 0, duration: 2880, useNativeDriver: true })
    ])).start();
  }, [twinkleAnim]);

  // Spins
  const spin10Fwd = useSpinAnim(10000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin11Rev = useSpinAnim(11000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin12Rev = useSpinAnim(12000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin16Fwd = useSpinAnim(16000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin18Fwd = useSpinAnim(18000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin20Fwd = useSpinAnim(20000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin22Fwd = useSpinAnim(22000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin24Fwd = useSpinAnim(24000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin28Rev = useSpinAnim(28000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin32Rev = useSpinAnim(32000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin34Fwd = useSpinAnim(34000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin42Rev = useSpinAnim(42000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin44Rev = useSpinAnim(44000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin48Rev = useSpinAnim(48000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin58Fwd = useSpinAnim(58000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin80Fwd = useSpinAnim(80000).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin90Rev = useSpinAnim(90000).interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  // Interpretations
  const mist1Scale = mist1Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const mist1Opacity = mist1Anim.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1] });
  const mist2Scale = mist2Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  
  const shadowScale = shadowPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const shadowOpacity = shadowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0.65] });
  
  const haloScale = pulseGlow.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.05] });
  const haloOpacity = pulseGlow.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] });

  const ringPScale = ringPulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.04] });
  const ringPOpacity = ringPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.8] });

  const eyeBScale = eyeBeat.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const pupilScale = pupilBreathe.interpolate({ inputRange: [0, 1], outputRange: [1, 0.93] });
  const pupilOpacity = pupilBreathe.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });

  const twinkleOpacity = twinkleAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.18, 1, 0.46] });
  const twinkleScale = twinkleAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.8, 1.22, 0.95] });

  // Arrays (View Mapped Dots for max performance instead of heavy radial gradients)
  const stars1 = [
    { x: '10%', y: '18%', o: 0.92, s: 2, c: '#fff' }, { x: '21%', y: '70%', o: 0.84, s: 2.4, c: 'rgba(255,240,213,1)' },
    { x: '35%', y: '26%', o: 0.76, s: 2, c: 'rgba(171,226,255,1)' }, { x: '48%', y: '14%', o: 0.86, s: 2, c: '#fff' },
    { x: '62%', y: '81%', o: 0.76, s: 2.4, c: 'rgba(255,234,189,1)' }, { x: '74%', y: '24%', o: 0.76, s: 2.4, c: 'rgba(150,228,255,1)' },
    { x: '88%', y: '64%', o: 0.84, s: 2, c: '#fff' }, { x: '54%', y: '90%', o: 0.64, s: 2, c: 'rgba(161,233,255,1)' },
    { x: '18%', y: '48%', o: 0.7, s: 2, c: 'rgba(255,230,180,1)' }, { x: '82%', y: '42%', o: 0.7, s: 2, c: 'rgba(170,230,255,1)' }
  ];
  const stars2 = [
    { x: '15%', y: '36%', s: 4, c: 'rgba(255, 246, 230, 0.44)' }, { x: '29%', y: '14%', s: 4, c: 'rgba(170, 231, 255, 0.36)' },
    { x: '66%', y: '30%', s: 4, c: 'rgba(255, 219, 148, 0.34)' }, { x: '83%', y: '18%', s: 4, c: 'rgba(171, 222, 255, 0.3)' },
    { x: '71%', y: '82%', s: 4, c: 'rgba(255, 241, 214, 0.34)' }
  ];
  const dustDots = [
    { x: '16%', y: '38%', s: 2.4, c: 'rgba(255, 240, 208, 0.55)' }, { x: '26%', y: '70%', s: 2, c: 'rgba(152, 230, 255, 0.44)' },
    { x: '44%', y: '18%', s: 2.2, c: 'rgba(255, 229, 181, 0.44)' }, { x: '58%', y: '78%', s: 2, c: 'rgba(171, 234, 255, 0.34)' },
    { x: '78%', y: '28%', s: 2.2, c: 'rgba(255, 236, 207, 0.42)' }, { x: '84%', y: '58%', s: 2, c: 'rgba(141, 220, 255, 0.36)' }
  ];
  const microStars = [
    { x: '30%', y: '42%', s: 2, c: 'rgba(255, 240, 209, 0.62)' }, { x: '64%', y: '35%', s: 2, c: 'rgba(165, 234, 255, 0.42)' },
    { x: '42%', y: '66%', s: 2, c: 'rgba(255, 225, 174, 0.4)' }, { x: '58%', y: '62%', s: 2, c: 'rgba(160, 230, 255, 0.36)' }
  ];

  const veins = [12, 37, 64, 96, 129, 161, 196, 231, 268, 304, 337];
  const sigils = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      
      {/* 0. Starfield Backgrounds */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateY: starDrift }], zIndex: 0 }]} pointerEvents="none">
         {stars1.map((s, i) => <View key={`s1_${i}`} style={{ position: 'absolute', left: s.x as any, top: s.y as any, width: s.s, height: s.s, borderRadius: s.s/2, backgroundColor: s.c, opacity: s.o }} />)}
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: twinkleLayer1, transform: [{ translateY: starDrift }], zIndex: 0 }]} pointerEvents="none">
         {stars2.map((s, i) => <View key={`s2_${i}`} style={{ position: 'absolute', left: s.x as any, top: s.y as any, width: s.s, height: s.s, borderRadius: s.s/2, backgroundColor: s.c }} />)}
      </Animated.View>

      {/* 1. MIST (Gold Nebula) */}
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: mist1Opacity, transform: [{ scale: mist1Scale }], zIndex: 0 }]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="mist1" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="rgba(232, 182, 80, 0.12)" />
              <Stop offset="62%" stopColor="transparent" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#mist1)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: mist2Scale }], zIndex: 0 }]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="mist2" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="rgba(92, 145, 255, 0.08)" />
              <Stop offset="68%" stopColor="transparent" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#mist2)" />
        </Svg>
      </Animated.View>

      {/* Constellation Ring */}
      <Animated.View style={{
        position: 'absolute', width: '78%', height: '78%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 224, 168, 0.05)',
        zIndex: 0, transform: [{ rotate: spin58Fwd }], opacity: 0.9
      }} pointerEvents="none" />
      <Animated.View style={{
        position: 'absolute', width: '70%', height: '70%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(138, 188, 255, 0.06)', borderStyle: 'dashed',
        zIndex: 0, transform: [{ rotate: spin44Rev }]
      }} pointerEvents="none" />
      
      {/* Sigils (Orbiting Marks) */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1, transform: [{ rotate: spin90Rev }] }} pointerEvents="none">
        {sigils.map((deg, i) => (
          <View key={`sig_${i}`} style={{
            position: 'absolute', left: '50%', top: '50%', width: 28, height: 28,
            marginLeft: -14, marginTop: -14,
            transform: [{ rotate: `${deg}deg` }, { translateY: -size * 0.42 }],
            opacity: 0.48
          }}>
            <View style={{ position: 'absolute', inset: 0, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255, 228, 178, 0.22)' }} />
            <View style={{ position: 'absolute', left: '31%', top: '31%', width: '38%', height: '38%', borderRadius: 999, backgroundColor: 'rgba(255,245,223,0.82)' }} />
          </View>
        ))}
      </Animated.View>

      {/* 2. Void Shadow */}
      <Animated.View style={{
        position: 'absolute', bottom: '20%', width: '42%', height: '12%', borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.84)',
        shadowColor: 'rgba(0,0,0,1)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 16,
        transform: [{ scale: shadowScale }], opacity: shadowOpacity, zIndex: 0
      }} pointerEvents="none" />

      {/* 3. Halo Pulse Astral */}
      <Animated.View style={{
        position: 'absolute', width: '58%', height: '58%', zIndex: 1,
        transform: [{ scale: haloScale }], opacity: haloOpacity,
      }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id="haloBg" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="rgba(237, 191, 98, 0.16)" />
              <Stop offset="42%" stopColor="rgba(63, 96, 234, 0.08)" />
              <Stop offset="68%" stopColor="transparent" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#haloBg)" />
        </Svg>
      </Animated.View>

      {/* Halo Spinners */}
      <Animated.View style={{
        position: 'absolute', width: '73%', height: '73%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 226, 173, 0.12)',
        zIndex: 1, transform: [{ rotate: spin22Fwd }]
      }} pointerEvents="none" />
      <Animated.View style={{
        position: 'absolute', width: '95%', height: '95%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(112, 149, 255, 0.08)',
        zIndex: 1, transform: [{ rotate: spin28Rev }]
      }} pointerEvents="none" />

      {/* 4. Pulse Ring Gold */}
      <Animated.View style={{
        position: 'absolute', width: '61%', height: '61%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 233, 186, 0.12)',
        shadowColor: 'rgba(223, 174, 78, 0.4)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 22,
        transform: [{ scale: ringPScale }], opacity: ringPOpacity, zIndex: 1
      }} pointerEvents="none" />
      
      <Animated.View style={{
        position: 'absolute', width: '68%', height: '68%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 232, 189, 0.08)', borderStyle: 'dashed',
        zIndex: 1, transform: [{ rotate: spin34Fwd }], opacity: 0.6
      }} pointerEvents="none" />
      <Animated.View style={{
        position: 'absolute', width: '80%', height: '80%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(138, 190, 255, 0.08)', borderStyle: 'dashed',
        zIndex: 1, transform: [{ rotate: spin42Rev }], opacity: 0.45
      }} pointerEvents="none" />

      {/* Dust */}
      <Animated.View style={{ position: 'absolute', width: '84%', height: '84%', zIndex: 2, transform: [{ rotate: spin80Fwd }], opacity: 0.8 }} pointerEvents="none">
         {dustDots.map((s, i) => <View key={`d_${i}`} style={{ position: 'absolute', left: s.x as any, top: s.y as any, width: s.s, height: s.s, borderRadius: s.s/2, backgroundColor: s.c }} />)}
      </Animated.View>

      {/* 5. Satellite Orbits Main */}
      <Animated.View style={{
        position: 'absolute', width: '70%', height: '70%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 226, 175, 0.1)', borderStyle: 'dashed',
        zIndex: 2, transform: [{ rotate: spin20Fwd }]
      }} pointerEvents="none" />
      <Animated.View style={{
        position: 'absolute', width: '82%', height: '82%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(120, 163, 255, 0.08)', borderStyle: 'dashed',
        zIndex: 2, transform: [{ rotate: spin32Rev }]
      }} pointerEvents="none" />
      <Animated.View style={{
        position: 'absolute', width: '100%', height: '100%', borderRadius: 999,
        borderWidth: 1, borderColor: 'rgba(255, 233, 189, 0.05)', borderStyle: 'dashed',
        zIndex: 2, transform: [{ rotate: spin48Rev }]
      }} pointerEvents="none" />

      {/* 6. Satellites (Math offset spins via nested views) */}
      {/* Big Satellites (s1, s2, s5 at 16s fwd) */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin16Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '15%', width: 19, height: 19, marginLeft: -9.5, marginTop: -9.5, borderRadius: 9.5, backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: 'rgba(255,221,154,0.6)', shadowRadius: 14, shadowOpacity: 1, borderWidth: 1, borderColor: 'rgba(255,241,213,0.4)', alignContent: 'center', justifyContent: 'center' }}>
           <View style={{ position: 'absolute', inset: -5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(229, 183, 84, 0.28)' }} />
        </View>
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin16Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '15%', width: 19, height: 19, marginLeft: -9.5, marginTop: -9.5, borderRadius: 9.5, backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: 'rgba(255,221,154,0.6)', shadowRadius: 14, shadowOpacity: 1, transform: [{ rotate: '119deg' }, { translateY: size * -0.35 }, { rotate: '-119deg' }] }}>
           <View style={{ position: 'absolute', inset: -5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(229, 183, 84, 0.28)' }} />
        </View>
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin16Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '15%', width: 19, height: 19, marginLeft: -9.5, marginTop: -9.5, borderRadius: 9.5, backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: 'rgba(255,221,154,0.6)', shadowRadius: 14, shadowOpacity: 1, transform: [{ rotate: '184deg' }, { translateY: size * -0.35 }, { rotate: '-184deg' }] }}>
           <View style={{ position: 'absolute', inset: -5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(229, 183, 84, 0.28)' }} />
        </View>
      </Animated.View>

      {/* Small Satellites (s3, s4 at 11s rev) */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin11Rev }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '22%', width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5, borderRadius: 5.5, backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: 'rgba(255,220,145,0.6)', shadowRadius: 12, shadowOpacity: 1, transform: [{ rotate: '68deg' }, { translateY: size * -0.28 }, { rotate: '-68deg' }] }}>
           <View style={{ position: 'absolute', inset: -5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(229, 183, 84, 0.28)' }} />
        </View>
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin11Rev }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '22%', width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5, borderRadius: 5.5, backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: 'rgba(255,220,145,0.6)', shadowRadius: 12, shadowOpacity: 1, transform: [{ rotate: '209deg' }, { translateY: size * -0.28 }, { rotate: '-209deg' }] }}>
           <View style={{ position: 'absolute', inset: -5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(229, 183, 84, 0.28)' }} />
        </View>
      </Animated.View>

      {/* Tiny Satellites (s6, s7, s8 at 24s fwd) */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin24Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '9%', width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.96)', shadowColor: 'rgba(255, 227, 174, 0.6)', shadowRadius: 10, shadowOpacity: 1, transform: [{ rotate: '55deg' }, { translateY: size * -0.41 }, { rotate: '-55deg' }] }} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin24Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '9%', width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.96)', shadowColor: 'rgba(255, 227, 174, 0.6)', shadowRadius: 10, shadowOpacity: 1, transform: [{ rotate: '177deg' }, { translateY: size * -0.41 }, { rotate: '-177deg' }] }} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 6, transform: [{ rotate: spin24Fwd }] }} pointerEvents="none">
        <View style={{ position: 'absolute', left: '50%', top: '9%', width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.96)', shadowColor: 'rgba(255, 227, 174, 0.6)', shadowRadius: 10, shadowOpacity: 1, transform: [{ rotate: '228deg' }, { translateY: size * -0.41 }, { rotate: '-228deg' }] }} />
      </Animated.View>

      {/* 7. The EYE Astral */}
      <Animated.View style={{
        position: 'absolute', width: '46%', height: '46%', borderRadius: 999, overflow: 'hidden',
        zIndex: 4, transform: [{ scale: eyeBScale }],
        borderWidth: 1, borderColor: 'rgba(255,240,211,0.3)',
        shadowColor: 'rgba(88,126,255,0.4)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 44
      }} pointerEvents="none">
        
        {/* Sky Gradient */}
        <Svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <Defs>
            <RadialGradient id="eyeBg1" cx="37%" cy="28%" rx="50%" ry="50%" fx="37%" fy="28%">
              <Stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
              <Stop offset="7%" stopColor="rgba(255,244,221,0.9)" />
              <Stop offset="13%" stopColor="rgba(148,226,255,0.42)" />
              <Stop offset="18%" stopColor="transparent" />
            </RadialGradient>
            <RadialGradient id="eyeBg2" cx="50%" cy="54%" rx="50%" ry="50%" fx="50%" fy="54%">
              <Stop offset="0%" stopColor="rgba(54,97,255,0.98)" />
              <Stop offset="40%" stopColor="rgba(16,33,110,0.98)" />
              <Stop offset="74%" stopColor="rgba(6,8,18,1)" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#eyeBg2)" />
          <Rect width="100%" height="100%" fill="url(#eyeBg1)" />
        </Svg>
        
        {/* Iris Rotation Mask */}
        <Animated.View style={{ position: 'absolute', inset: '8%', borderRadius: 999, borderWidth: 4, borderColor: 'rgba(255,227,162,0.4)', borderStyle: 'dotted', transform: [{ rotate: spin10Fwd }], opacity: 0.6 }} />

        {/* Iris Filament (SVG Dashes) */}
        <Animated.View style={{ position: 'absolute', inset: '16%', zIndex: 3, transform: [{ rotate: spin18Fwd }], opacity: 0.78 }}>
          <Svg width="100%" height="100%">
            <Circle cx="50%" cy="50%" r="42%" stroke="rgba(255, 241, 213, 0.4)" strokeWidth="6" strokeDasharray="3 14" fill="none" />
            <Circle cx="50%" cy="50%" r="38%" stroke="rgba(149, 230, 255, 0.4)" strokeWidth="4" strokeDasharray="5 20" fill="none" />
          </Svg>
        </Animated.View>

        {/* Inner Pupil Breathe */}
        <Animated.View style={{ position: 'absolute', inset: '28%', borderRadius: 999, backgroundColor: 'rgba(7, 8, 15, 1)', shadowColor: 'rgba(255,221,157,0.3)', shadowRadius: 18, shadowOpacity: 1, transform: [{ scale: pupilScale }], opacity: pupilOpacity }} />
        
        {/* Veins */}
        <View style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {veins.map((deg, i) => (
            <View key={`vein_e_${i}`} style={{
              position: 'absolute', left: '50%', top: '50%', width: 1.4, height: '34%',
              marginLeft: -0.7, marginTop: -size * 0.46 * 0.34,
              transform: [{ rotate: `${deg}deg` }, { translateY: size * 0.08 }],
            }}>
              <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,229,182,0.38)', 'rgba(156,234,255,0.54)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFillObject} />
            </View>
          ))}
        </View>

        {/* Micro Stars in Eye */}
        <Animated.View style={{ position: 'absolute', inset: 0, zIndex: 4, opacity: twinkleLayer2 }}>
           {microStars.map((s, i) => <View key={`ms_${i}`} style={{ position: 'absolute', left: s.x as any, top: s.y as any, width: s.s, height: s.s, borderRadius: s.s/2, backgroundColor: s.c }} />)}
        </Animated.View>

        {/* Glints */}
        <Animated.View style={{ position: 'absolute', inset: 0, zIndex: 5, opacity: twinkleOpacity, transform: [{ scale: twinkleScale }] }}>
           <View style={{ position: 'absolute', top: '30%', left: '37%', width: '12%', height: '12%', borderRadius: 999, backgroundColor: '#FFF', shadowColor: 'rgba(255,236,195,0.5)', shadowRadius: 4, shadowOpacity: 1 }} />
           <View style={{ position: 'absolute', top: '46%', left: '61%', width: '5.4%', height: '5.4%', borderRadius: 999, backgroundColor: '#FFF' }} />
           <View style={{ position: 'absolute', top: '58%', left: '33%', width: '6.2%', height: '6.2%', borderRadius: 999, backgroundColor: '#FFF' }} />
           <View style={{ position: 'absolute', top: '24%', left: '56%', width: '4.4%', height: '4.4%', borderRadius: 999, backgroundColor: '#FFF' }} />
        </Animated.View>

      </Animated.View>

    </View>
  );
};
