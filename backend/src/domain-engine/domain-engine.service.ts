import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from './scoring.service';
import { InsightComposerService } from './insight-composer.service';
import { RecommendationComposerService } from './recommendation-composer.service';
import { DomainType, DomainSemanticOutput, DomainSemanticBundle, DomainStatus } from './types';

@Injectable()
export class DomainEngineService {
  constructor(
    private prisma: PrismaService,
    private scoringService: ScoringService,
    private insightComposer: InsightComposerService,
    private recommendationComposer: RecommendationComposerService,
  ) {}

  /**
   * Gerar o bundle semântico (Audit-Ready v1.2.0).
   * Suporta recomputação parcial real via requestedDomains.
   */
  async generateBundle(userId: string, requestedDomains?: DomainType[]): Promise<DomainSemanticBundle> {
    const allDomains: DomainType[] = ['sleep', 'nutrition', 'general', 'energy', 'recovery', 'performance'];
    const processedDomains: DomainType[] = [];
    const outputs: Record<string, DomainSemanticOutput> = {};

    // 1. Fetch relevant signals (latest normalized measurements)
    const measurements = await this.prisma.normalizedMeasurement.findMany({
      where: { session: { userId } },
      orderBy: { capturedAt: 'desc' },
      distinct: ['code'],
    });

    for (const domain of allDomains) {
      // ── LOGICA DE RECOMPUTAÇÃO PARCIAL ──
      const skip = requestedDomains && !requestedDomains.includes(domain);
      
      if (skip) {
        // Opção: Preenchimento compatível (v1.2.0 - Stale Placeholder)
        // No futuro, isto pode vir de uma cache de último bundle bem-sucedido.
        outputs[domain] = this.createStalePlaceholder(domain);
      } else {
        outputs[domain] = await this.processDomain(domain, measurements);
        processedDomains.push(domain);
      }
    }

    return {
      bundleVersion: '1.2.0',
      generatedAt: Date.now(),
      userId,
      domains: outputs,
      coherenceFlags: ['multi_domain_sync_active', 'partial_recomputation_v1_2'],
      auditTrace: {
        requestedDomains: requestedDomains || ['all'],
        processedDomains,
        engineVersion: '1.2.0'
      }
    } as any; // Cast compatível com metadados de trace
  }

  private async processDomain(domain: DomainType, allMeasurements: any[]): Promise<DomainSemanticOutput> {
    const score = this.scoringService.calculate(domain, allMeasurements);
    const insights = this.insightComposer.compose(domain, score, allMeasurements);
    const recommendations = this.recommendationComposer.compose(domain, score);

    const evidence = allMeasurements.map(m => ({
      biomarkerCode: m.code,
      value: m.valueNumeric,
      unit: m.unit,
      capturedAt: m.capturedAt,
      state: m.valueNumeric > 80 ? 'optimal' : m.valueNumeric > 40 ? 'borderline' : 'critical'
    }));

    return {
      domain,
      version: '1.2.0',
      generatedAt: Date.now(),
      score,
      insights,
      recommendations,
      evidence: (evidence as any[]).slice(0, 5),
      trace: []
    };
  }

  private createStalePlaceholder(domain: DomainType): DomainSemanticOutput {
    return {
      domain,
      version: '1.2.0', // Mantém compatibilidade de versão
      generatedAt: 0,   // Sinaliza que não foi re-gerado agora
      score: {
        value: 0,
        stateLabel: 'Pendente Revalidação',
        band: 'poor',
        confidence: 0,
        freshnessPenalty: 1,
        completenessPenalty: 0,
        status: 'stale' // INDICAÇÃO CLARA DETERMINÍSTICA
      },
      insights: [],
      recommendations: [],
      evidence: [],
      trace: ['skipped_by_request']
    };
  }
}
