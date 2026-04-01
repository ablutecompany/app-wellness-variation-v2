import { Injectable } from '@nestjs/common';
import { DomainStatus, DomainType, DomainScore } from './types';

@Injectable()
export class ScoringService {
  /**
   * Calcular o score numérico final para um domínio biográfico.
   * Puro, determinístico, auditável.
   */
  calculate(domain: DomainType, measurements: any[]): DomainScore {
    if (measurements.length === 0) {
      return this.getUnavailableScore();
    }

    // 1. Extrair factos (Latest measurements)
    const weights = this.getWeights(domain);
    let totalScore = 0;
    let totalWeight = 0;
    let dataMaturity = 0;

    for (const m of measurements) {
      const weight = weights[m.code] || 0;
      if (weight > 0) {
        // Normalização base (0-100)
        const value = Math.max(0, Math.min(100, m.valueNumeric));
        totalScore += value * weight;
        totalWeight += weight;
        dataMaturity++;
      }
    }

    if (totalWeight === 0) return this.getUnavailableScore();

    // 2. Penalizações (Freshness & Completeness)
    const rawScore = totalScore / totalWeight;
    const { freshnessPenalty, completenessPenalty } = this.calculatePenalties(domain, dataMaturity);
    
    const finalValue = Math.max(0, Math.min(100, rawScore - freshnessPenalty - completenessPenalty));

    // 3. Status Gating
    const status: DomainStatus = dataMaturity < 3 ? 'insufficient_data' : 'sufficient_data';

    // 4. Band Allocation
    const band: 'optimal' | 'fair' | 'poor' = finalValue > 80 ? 'optimal' : finalValue > 50 ? 'fair' : 'poor';
    const stateLabel = this.getStateLabel(band);

    return {
      value: Math.round(finalValue),
      stateLabel,
      band,
      confidence: Math.min(1.0, dataMaturity / 10),
      freshnessPenalty,
      completenessPenalty,
      status
    };
  }

  private getWeights(domain: DomainType): Record<string, number> {
    const maps: Record<DomainType, Record<string, number>> = {
      sleep: { sleep_quality: 0.5, heart_rate: 0.2, activity_load: 0.3 },
      nutrition: { glucose: 0.4, urea: 0.3, sodium: 0.3 },
      general: { wellness_score: 1.0 },
      energy: { glucose: 0.6, hydration: 0.4 },
      recovery: { urea: 0.5, sleep_quality: 0.5 },
      performance: { activity_load: 0.7, hydration: 0.3 }
    };
    return maps[domain] || { base: 1.0 };
  }

  private calculatePenalties(domain: DomainType, maturity: number) {
    // Audit-ready: Penalização fixa baseada em maturidade de dados
    const completenessPenalty = maturity < 3 ? 15 : maturity < 5 ? 5 : 0;
    const freshnessPenalty = 0; // Futura integração com timestamps
    return { freshnessPenalty, completenessPenalty };
  }

  private getStateLabel(band: 'optimal' | 'fair' | 'poor'): string {
    const labels = { optimal: 'Excelente', fair: 'Bom', poor: 'Atenção' };
    return labels[band];
  }

  private getUnavailableScore(): DomainScore {
    return {
      value: 0,
      stateLabel: 'Indisponível',
      band: 'poor',
      confidence: 0,
      freshnessPenalty: 0,
      completenessPenalty: 0,
      status: 'unavailable'
    };
  }
}
