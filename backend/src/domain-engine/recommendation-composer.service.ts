import { Injectable } from '@nestjs/common';
import { DomainStatus, DomainType, RecommendationItem } from './types';

@Injectable()
export class RecommendationComposerService {
  /**
   * Selecionar recomendações acionáveis baseadas em factos determinísticos.
   * Gating: Zero recomendações em dados insuficientes.
   */
  compose(domain: DomainType, score: any): RecommendationItem[] {
    if (score.status !== 'sufficient_data' || score.band === 'optimal') {
      return []; // Coherence Policy: No recommendations on weak data or perfect score
    }

    const recs: RecommendationItem[] = [];
    const pool = this.getRecommendationPool(domain, score.band);
    
    // Pick top 2 for deterministic UI focus
    return pool.slice(0, 2);
  }

  private getRecommendationPool(domain: DomainType, band: 'fair' | 'poor'): RecommendationItem[] {
    const registry: Record<string, Record<string, RecommendationItem[]>> = {
      sleep: {
        fair: [
          {
            id: 'sleep_hygiene_1',
            type: 'lifestyle',
            title: 'Higiene do Sono',
            bodyShort: 'Evite luz azul 1h antes de deitar.',
            bodyLong: 'A exposição à luz azul interfere com a produção de melatonina, impactando a latência do sono.',
            priorityRank: 1,
            effortLevel: 'low',
            impactLevel: 'medium'
          }
        ],
        poor: [
          {
            id: 'sleep_recovery_1',
            type: 'lifestyle',
            title: 'Protocolo de Recuperação',
            bodyShort: 'Mantenha o quarto a 18°C.',
            bodyLong: 'Uma temperatura ambiente mais baixa facilita a descida da temperatura corporal central, essencial para o sono profundo.',
            priorityRank: 1,
            effortLevel: 'medium',
            impactLevel: 'high'
          }
        ]
      },
      nutrition: {
        fair: [
           {
            id: 'nutri_stable_1',
            type: 'nutrition',
            title: 'Estabilidade Glicémica',
            bodyShort: 'Aumente a ingestão de fibras ao jantar.',
            bodyLong: 'As fibras ajudam a manter a curva de glucose estável durante o período de repouso nocturno.',
            priorityRank: 1,
            effortLevel: 'low',
            impactLevel: 'medium'
          }
        ],
        poor: [
          {
            id: 'nutri_rebalance_1',
            type: 'nutrition',
            title: 'Protocolo Hidratação',
            bodyShort: 'Aumente o consumo de água (+0.5L/dia).',
            bodyLong: 'Os seus marcadores biográficos indicam um estado de hidratação sub-óptimo para a sua carga de atividade.',
            priorityRank: 1,
            effortLevel: 'low',
            impactLevel: 'high'
          }
        ]
      }
    };

    const domainEntry = registry[domain] || registry['sleep'];
    return domainEntry[band] || [];
  }
}
