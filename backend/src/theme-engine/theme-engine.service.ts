import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThemeEngineService {
  constructor(private prisma: PrismaService) {}

  private getThemeWeights(themeCode: string): Record<string, number> {
    const weightsMap: Record<string, Record<string, number>> = {
      energy: { glucose: 0.3, urea: 0.2, sodium: 0.2, potassium: 0.1, hydration: 0.2 },
      recovery: { urea: 0.4, creatinine: 0.2, sleep_quality: 0.4 },
      performance: { glucose: 0.3, hydration: 0.2, activity_load: 0.5 },
    };
    return weightsMap[themeCode] || { base: 1.0 };
  }

  async calculateScore(userId: string, themeCode: string, sessionId?: string) {
    const theme = await this.prisma.themeDefinition.findUnique({ where: { code: themeCode } });
    if (!theme) throw new Error('Theme not found');

    const weights = this.getThemeWeights(themeCode);
    const weightCodes = Object.keys(weights);

    // 1. Fetch relevant signals (latest normalized measurements)
    const measurements = await this.prisma.normalizedMeasurement.findMany({
      where: { session: { userId }, code: { in: weightCodes } },
      orderBy: { capturedAt: 'desc' },
      distinct: ['code'],
    });

    // 2. Base Calculation
    let baseScore = 0;
    const componentsData = [];
    
    for (const code of weightCodes) {
      const weight = weights[code];
      const match = measurements.find(m => m.code === code);
      const val = match?.valueNumeric ?? 50; // Neutral fallback
      
      const contribution = val * weight;
      baseScore += contribution;

      componentsData.push({
        type: 'biomarker',
        code,
        weight,
        effectDirection: 1,
        valueSummary: match ? `${match.valueNumeric}${match.unit}` : 'N/A',
        contributionScore: Math.round(contribution),
      });
    }

    // 3. Apply Penalties (Logic Engine Spec)
    const freshnessPenalty = this.calculateFreshnessPenalty(measurements);
    const completenessPenalty = (weightCodes.length - measurements.length) * 5;
    
    const finalValue = Math.max(0, Math.min(100, Math.round(baseScore - freshnessPenalty - completenessPenalty)));
    const confidence = Math.max(0, 100 - (freshnessPenalty * 2 + completenessPenalty));

    // 4. Persistence
    const themeScore = await this.prisma.themeScore.create({
      data: {
        userId,
        definitionId: theme.id,
        value: finalValue,
        stateLabel: this.getStateLabel(finalValue),
        band: 'functional',
        version: '1.2.0',
        confidence,
        sessionId,
        dataWindow: { period: '7d', signalsCaptured: measurements.length },
        components: { create: componentsData as any },
      },
    });

    // 5. Generate Insight (Layer 5)
    await this.generateInsight(themeScore.id, userId, themeCode, finalValue);

    // 6. Select Top 3 Recommendations (Layer 4)
    await this.selectRecommendations(themeScore.id, userId, themeCode, finalValue);

    return themeScore;
  }

  private calculateFreshnessPenalty(measurements: any[]): number {
    if (measurements.length === 0) return 20;
    const now = new Date();
    const oldest = Math.min(...measurements.map(m => m.capturedAt.getTime()));
    const hoursDiff = (now.getTime() - oldest) / (1000 * 60 * 60);
    return Math.min(30, Math.floor(hoursDiff / 12)); // 1 point per 12h capped at 30
  }

  private getStateLabel(score: number): string {
    if (score >= 80) return 'excelente';
    if (score >= 65) return 'bom';
    if (score >= 50) return 'moderado';
    return 'fraco';
  }

  private async generateInsight(scoreId: string, userId: string, themeCode: string, score: number) {
    const templates = {
      energy: score > 60 
        ? 'A tua energia está funcional, mas ainda pouco estável.' 
        : 'Os teus níveis de energia sugerem fadiga metabólica.',
      recovery: score > 60
        ? 'A tua recuperação está em bom ritmo.'
        : 'Sinais de stress muscular detetados na ureia.',
    };

    const text = templates[themeCode as keyof typeof templates] || 'Estado funcional analisado.';

    await this.prisma.themeInsight.create({
      data: {
        userId,
        scoreId,
        summaryShort: text,
        explanationLong: `Com um score de ${score}, identificamos que os teus drivers positivos estão a compensar os fatores limitantes, mas há margem para otimização nutricional.`,
        explanationFactors: { status: 'analyzed' },
        language: 'pt-PT',
        version: '1.0.5',
        tone: 'clinical-light',
      },
    });
  }

  private async selectRecommendations(scoreId: string, userId: string, themeCode: string, score: number) {
    // Simulated selection of Top 3
    const pool = [
      { type: 'nutrition', title: 'Aumenta o magnésio', body: 'Espinafres e amêndoas ajudam na estabilidade.', rank: 1 },
      { type: 'habit', title: 'Dorme +15min', body: 'Pequenos incrementos melhoram o score.', rank: 2 },
      { type: 'hydration', title: 'Bebe mais água', body: 'Fundamental para o transporte de nutrientes.', rank: 3 },
    ];

    for (const rec of pool) {
      await this.prisma.recommendation.create({
        data: {
          userId,
          scoreId,
          type: rec.type,
          title: rec.title,
          bodyShort: rec.body,
          bodyLong: rec.body,
          priorityRank: rec.rank,
          effortLevel: 'low',
          impactLevel: 'medium',
          version: '1.0',
        },
      });
    }
  }

  async getUserThemes(userId: string) {
    return this.prisma.themeScore.findMany({
      where: { userId },
      include: { definition: true, insights: true },
      orderBy: { generatedAt: 'desc' },
    });
  }
}
