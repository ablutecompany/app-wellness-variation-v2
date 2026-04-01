/**
 * SEMANTIC OUTPUT CONTRACT v1.2.0
 * Hardened Operational View Models - Selective Invalidation
 */

export type SemanticStatus = 
  | 'sufficient_data' 
  | 'insufficient_data' 
  | 'unavailable' 
  | 'stale';

/**
 * ESTADO FORMAL DE SINCRONIZAÇÃO OPERACIONAL (v1.2.0)
 */
export type SemanticOutputStatus = 
  | 'idle'
  | 'loading' 
  | 'ready' 
  | 'refreshing'
  | 'stale'
  | 'insufficient_data' 
  | 'error';

export interface SemanticMetadata {
  lastUpdatedAt: number;
  lastRequestedAt: number;
  lastErrorAt?: number;
  isDirty: boolean;
  dirtyDomains: Record<string, boolean>; // NOVO: Invalidação Seletiva
  staleAfterMs: number;
  version: string;
  retryCount: number;
}

export interface SemanticInsightView {
  id: string;
  summary: string;
  description: string;
  tone: 'informative' | 'supportive' | 'alert';
  factors: string[];
}

export interface SemanticRecommendationView {
  id: string;
  title: string;
  actionable: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface SemanticDomainView {
  domain: string;
  label: string;
  score: number;
  status: SemanticStatus;
  statusLabel: string;
  band: 'optimal' | 'fair' | 'poor';
  mainInsight?: SemanticInsightView;
  recommendations: SemanticRecommendationView[];
  generatedAt: number;
  version: string;
}

export interface SemanticOutputState {
  version: string;
  generatedAt: number;
  domains: Record<string, SemanticDomainView>;
  status: SemanticOutputStatus;
  metadata: SemanticMetadata;
  isLive: boolean;
}
