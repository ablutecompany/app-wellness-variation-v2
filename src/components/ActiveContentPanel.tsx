import React from 'react';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Base';
import { BlurView } from 'expo-blur';
import { Zap, Activity, Info, List as CheckList, TrendingUp } from 'lucide-react-native';

export interface ActiveContentPanelProps {
  isHome: boolean;
  
  // Home Slots
  home_state_title?: string;
  home_summary_short?: string;
  home_cta_label?: string;
  onHomeCtaPress?: () => void;
  
  // Theme Slots
  theme_id?: string;
  theme_label?: string;
  theme_score?: number;
  theme_status_short?: string;
  theme_summary_short?: string;
  theme_explanation?: string;
  theme_action_1?: string;
  theme_action_2?: string;
  theme_action_3?: string;
  theme_improvement_potential?: string;
  color?: string;
}

const GlassHUD: React.FC<{ style?: any, children: React.ReactNode }> = ({ style, children }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.glassBase, style, { backgroundColor: 'rgba(20, 25, 35, 0.4)', backdropFilter: 'blur(12px)' } as any]}>
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={30} tint="dark" style={[styles.glassBase, style]}>
      {children}
    </BlurView>
  );
};

export const ActiveContentPanel: React.FC<ActiveContentPanelProps> = (props) => {
  const accentColor = props.color || theme.colors.primary;

  if (props.isHome) {
    return (
      <View style={styles.container} pointerEvents="box-none">
        {/* Top HUD for Home */}
        <View style={styles.topHudContainer} pointerEvents="none" />
        
        {/* Bottom HUD for Home Options (CTA) */}
        <View style={styles.bottomHudContainer} pointerEvents="box-none">
          <GlassHUD style={styles.homeHud}>
            <View style={styles.hudHeader}>
              <View style={[styles.indicatorDot, { backgroundColor: accentColor }]} />
              <Typography variant="caption" style={{ color: theme.colors.textMuted }}>STATUS</Typography>
            </View>
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>
              {props.home_state_title || 'Biological Intelligence'}
            </Typography>
            <Typography variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
              {props.home_summary_short || 'Ready for analysis.'}
            </Typography>
            <TouchableOpacity style={styles.ctaButton} onPress={props.onHomeCtaPress}>
              <Zap size={14} color={theme.colors.wellnessGreen} style={{ marginRight: 8 }} />
              <Typography variant="caption" style={{ color: theme.colors.wellnessGreen, fontWeight: 'bold' }}>
                {props.home_cta_label || 'Realizar Análise'}
              </Typography>
            </TouchableOpacity>
          </GlassHUD>
        </View>
      </View>
    );
  }

  // Active Theme Layout
  const actions = [props.theme_action_1, props.theme_action_2, props.theme_action_3].filter(Boolean);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* TOP HUD: Core Stats (Floating above Nucleus) */}
      <View style={styles.topHudContainer} pointerEvents="none">
        <GlassHUD style={styles.topHud}>
           <View style={styles.hudHeader}>
              <View style={[styles.indicatorDot, { backgroundColor: accentColor }]} />
              <Typography variant="caption" style={{ color: theme.colors.textMuted }}>{props.theme_label}</Typography>
           </View>
           <View style={styles.scoreRow}>
              <Typography style={[styles.scoreLarge, { color: accentColor }]}>
                {props.theme_score || '--'}
              </Typography>
              <View style={styles.scoreBadge}>
                 <Activity size={10} color={accentColor} />
              </View>
           </View>
           <Typography variant="caption" style={styles.statusShort}>
              {props.theme_status_short || 'A aguardar dados...'}
           </Typography>
        </GlassHUD>
      </View>

      {/* BOTTOM HUD: Detailed Info & Actions (Floating below Nucleus) */}
      <View style={styles.bottomHudContainer} pointerEvents="box-none">
        <GlassHUD style={styles.bottomHud}>
          <Typography variant="body" style={styles.summaryShort} numberOfLines={2}>
            {props.theme_summary_short || 'No summary available.'}
          </Typography>
          
          <View style={styles.divider} />
          
          <View style={styles.explanationBox}>
            <Info size={14} color={theme.colors.textMuted} style={{ marginRight: theme.spacing.sm, marginTop: 2 }} />
            <Typography variant="caption" style={styles.explanationText} numberOfLines={4}>
              {props.theme_explanation || 'No detailed explanation available for this theme yet.'}
            </Typography>
          </View>

          {actions.length > 0 && (
            <View style={styles.actionsContainer}>
              <Typography variant="caption" style={styles.actionsTitle}>RECOMENDAÇÕES</Typography>
              {actions.map((act, idx) => (
                <View key={idx} style={styles.actionItem}>
                  <CheckList size={12} color={accentColor} style={{ marginRight: 8 }} />
                  <Typography variant="caption" style={{ color: theme.colors.textSecondary, flex: 1 }} numberOfLines={1}>{act}</Typography>
                </View>
              ))}
            </View>
          )}

          {props.theme_improvement_potential && (
            <View style={styles.potentialContainer}>
              <TrendingUp size={12} color={theme.colors.wellnessGreen} style={{ marginRight: 8 }} />
              <Typography variant="caption" style={{ color: theme.colors.wellnessGreen }}>
                Potencial: {props.theme_improvement_potential}
              </Typography>
            </View>
          )}

        </GlassHUD>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    zIndex: 10,
  },
  glassBase: {
    borderRadius: 20,
    padding: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topHudContainer: {
    alignItems: 'flex-start',
    marginTop: 40,
  },
  bottomHudContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topHud: {
    minWidth: 160,
  },
  bottomHud: {
    width: '100%',
    maxWidth: 400,
  },
  homeHud: {
    width: 280,
    alignItems: 'center',
  },
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  scoreLarge: {
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: -1,
    lineHeight: 44,
  },
  scoreBadge: {
    marginLeft: 4,
    marginTop: 4,
    padding: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statusShort: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    fontSize: 12,
  },
  summaryShort: {
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: theme.spacing.sm,
  },
  explanationBox: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  explanationText: {
    color: theme.colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  actionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  actionsTitle: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
    fontSize: 10,
    letterSpacing: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  potentialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,168,107,0.1)',
    paddingVertical: 6,
    borderRadius: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,168,107,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
  }
});
