import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Typography } from '../components/Base';
import { theme } from '../theme';
import { X, TrendingUp, ShieldCheck, Zap, Utensils } from 'lucide-react-native';

export const GlobalDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Container safe style={styles.container}>
      <View style={styles.header}>
        <View>
          <Typography variant="h2">Detalhe Global</Typography>
          <Typography variant="caption">Composição do teu Score (82)</Typography>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.explanationCard}>
          <Typography variant="h3" style={{ marginBottom: 12 }}>O teu Insight AI</Typography>
          <Typography color={theme.colors.textSecondary} style={{ lineHeight: 22 }}>
            A tua Prontidão Funcional de 82 indica uma excelente capacidade de resposta metabólica. 
            Contudo, o teu rácio de ureia sugere que a recuperação muscular ainda não está completa.
          </Typography>
        </View>

        <View style={styles.recommendationsList}>
          <Typography variant="h3" style={{ marginBottom: 16 }}>Top 3 Recomendações</Typography>
          
          <View style={styles.recommendationBox}>
            <Utensils size={20} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typography variant="body" style={{ fontWeight: 'bold' }}>Aumenta Magnésio</Typography>
              <Typography variant="caption">Espinafres e amêndoas ao jantar.</Typography>
            </View>
          </View>

          <View style={styles.recommendationBox}>
            <Zap size={20} color={theme.colors.wellnessGreen} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typography variant="body" style={{ fontWeight: 'bold' }}>Ciclo de Sono</Typography>
              <Typography variant="caption">Tenta dormir mais 20min hoje.</Typography>
            </View>
          </View>

          <View style={styles.recommendationBox}>
            <ShieldCheck size={20} color={theme.colors.success} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typography variant="body" style={{ fontWeight: 'bold' }}>Hidratação Focada</Typography>
              <Typography variant="caption">+500ml de água na próxima 1h.</Typography>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.xl,
  },
  recommendationsList: {
    marginBottom: theme.spacing.xxl,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 20,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  }
});
