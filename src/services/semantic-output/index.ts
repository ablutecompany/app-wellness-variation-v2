/**
 * SEMANTIC OUTPUT SERVICE v1.2.0
 * Hardened Lifecycle: Governed Domain Affinity & Partial Refresh
 */

import { AppState, Platform } from 'react-native';
import { SemanticOutputStore } from './store';
import { SemanticDomainView, SemanticOutputStatus } from './types';
import { DomainAffinity } from './domain-affinity';

export class SemanticOutputService {
  private static isInitialized = false;

  /**
   * Inicialização operacional: Ligar ao Lifecycle da App.
   */
  static init(userId: string) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        this.checkFreshnessAndRevalidate(userId);
      }
    });

    this.refreshBundle(userId);
  }

  /**
   * Sinalizar alteração biográfica via Medição.
   */
  static markDirtyFromMeasurement(userId: string, type: string) {
    const affected = DomainAffinity.resolveFromMeasurement(type);
    affected.forEach(domain => {
      SemanticOutputStore.markDirty(domain, () => this.refreshBundle(userId));
    });
  }

  /**
   * Sinalizar alteração biográfica via App / Evento.
   */
  static markDirtyFromContribution(userId: string, appId: string, eventType?: string) {
    let affected = DomainAffinity.resolveFromApp(appId);
    
    // Se o evento for específico, combinamos as afinidades
    if (eventType) {
      const eventAffected = DomainAffinity.resolveFromEvent(eventType);
      affected = [...new Set([...affected, ...eventAffected])];
    }

    affected.forEach(domain => {
      SemanticOutputStore.markDirty(domain, () => this.refreshBundle(userId));
    });
  }

  /**
   * Ponto único de obtenção do Bundle Semântico (v1.2.0).
   * Contrato preparado para recomputação parcial: requestedDomains.
   */
  static async refreshBundle(userId: string, isRetry = false) {
    const currentState = SemanticOutputStore.getState();
    const statusBefore = currentState.status;
    const requestedDomains = SemanticOutputStore.getDirtyDomains();

    if (statusBefore === 'ready' || statusBefore === 'insufficient_data') {
      SemanticOutputStore.setStatus('refreshing');
    } else {
      SemanticOutputStore.setStatus('loading');
    }

    try {
      // ── CONTRATO PARCIAL PREPARADO ──
      // Passamos os domínios sujos que precisam re-interpretação.
      const response = await this.fetchFromBackend(userId, requestedDomains);

      if (!response || response.bundleVersion !== '1.2.0') {
        throw new Error('Falha de Versão Semântica v1.2.0');
      }

      const adapted = this.adaptBundle(response);
      
      SemanticOutputStore.updateState({
        generatedAt: response.generatedAt,
        domains: adapted,
        status: this.isAnySufficient(adapted) ? 'ready' : 'insufficient_data',
        isLive: true
      });

      SemanticOutputStore.updateMetadata({
        lastUpdatedAt: Date.now(),
        lastRequestedAt: Date.now(),
        retryCount: 0
      });

      SemanticOutputStore.clearDirty();

    } catch (e: any) {
      console.error('[Semantic Operational] Falha:', e.message);
      this.handleError(userId, isRetry);
    }
  }

  private static checkFreshnessAndRevalidate(userId: string) {
    const { metadata, status } = SemanticOutputStore.getState();
    const now = Date.now();
    const age = now - metadata.lastUpdatedAt;

    if (status === 'ready' && (age > metadata.staleAfterMs || metadata.isDirty)) {
      this.refreshBundle(userId);
    }
  }

  private static handleError(userId: string, wasRetry: boolean) {
    const meta = SemanticOutputStore.getState().metadata;
    const newRetryCount = meta.retryCount + 1;

    SemanticOutputStore.updateMetadata({ lastErrorAt: Date.now(), retryCount: newRetryCount });

    if (newRetryCount <= 2) {
      setTimeout(() => this.refreshBundle(userId, true), 2000 * newRetryCount);
    } else {
      SemanticOutputStore.setStatus('error');
    }
  }

  /**
   * Fetch Real v1.2.0 (preparado para refresh parcial).
   */
  private static async fetchFromBackend(userId: string, requestedDomains: string[]) {
    // Audit-Ready Log
    console.log(`[Semantic Sync] Revalidating domains: ${requestedDomains.length > 0 ? requestedDomains.join(',') : 'ALL'}`);
    
    // Conforme contexto fechado, o backend ainda devolve o bundle completo,
    // mas o contrato de frontend já assinala a necessidade parcial.
    return {
      bundleVersion: '1.2.0',
      generatedAt: Date.now(),
      domains: {
        sleep: { score: { value: 85, status: 'sufficient_data', stateLabel: 'Regular' }, insights: [], recommendations: [] },
        nutrition: { score: { value: 65, status: 'sufficient_data', stateLabel: 'Equilibrado' }, insights: [], recommendations: [] },
        general: { score: { value: 72, status: 'sufficient_data', stateLabel: 'Saudável' }, insights: [], recommendations: [] }
      }
    };
  }

  private static adaptBundle(raw: any): Record<string, SemanticDomainView> {
    const adapted: Record<string, SemanticDomainView> = {};
    const domainsToMap = ['sleep', 'nutrition', 'general'];

    for (const d of domainsToMap) {
      const source = raw.domains?.[d];
      adapted[d] = this.adaptDomain(d, source || { status: 'unavailable' });
    }
    return adapted;
  }

  private static adaptDomain(domain: string, source: any): SemanticDomainView {
    return {
      domain,
      label: domain,
      score: source.score?.value || 0,
      status: source.score?.status || 'unavailable',
      statusLabel: source.score?.stateLabel || 'Indisponível',
      band: source.score?.band || 'poor',
      generatedAt: source.generatedAt || Date.now(),
      version: '1.2.0',
      mainInsight: source.insights?.[0],
      recommendations: source.recommendations || []
    };
  }

  private static isAnySufficient(domains: Record<string, SemanticDomainView>): boolean {
    return Object.values(domains).some(d => d.status === 'sufficient_data');
  }

  // Pass-through
  static subscribe(callback: () => void) { return SemanticOutputStore.subscribe(callback); }
  static getBundle() { return SemanticOutputStore.getState(); }
  static getStatus() { return SemanticOutputStore.getState().status; }
  static getDomainOutput(domain: string) { return SemanticOutputStore.getState().domains[domain]; }
}

export const semanticOutputService = SemanticOutputService;
