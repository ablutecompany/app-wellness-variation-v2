/**
 * SEMANTIC DOMAIN ENGINE v1.2.0 - Core Types
 * Deterministic Health Narratives
 */

export type DomainType = 'sleep' | 'nutrition' | 'general' | 'energy' | 'recovery' | 'performance';

export type DomainStatus = 
  | 'sufficient_data' 
  | 'insufficient_data' 
  | 'unavailable' 
  | 'stale';

export interface EvidenceRef {
  biomarkerCode: string;
  value: number;
  unit: string;
  capturedAt: Date;
  state: 'optimal' | 'borderline' | 'critical';
}

export interface DomainInsight {
  id: string;
  summary: string;
  explanation: string;
  tone: 'informative' | 'supportive' | 'alert';
  factors: string[];
  version: string;
}

export interface RecommendationItem {
  id: string;
  type: string;
  title: string;
  bodyShort: string;
  bodyLong: string;
  priorityRank: number;
  effortLevel: 'low' | 'medium' | 'high';
  impactLevel: 'low' | 'medium' | 'high';
}

export interface DomainScore {
  value: number; // 0-100
  stateLabel: string; // 'Excelente', 'Bom', 'Atenção'
  band: 'optimal' | 'fair' | 'poor';
  confidence: number; // 0.0 - 1.0
  freshnessPenalty: number;
  completenessPenalty: number;
  status: DomainStatus;
}

export interface DomainSemanticOutput {
  domain: DomainType;
  version: string;
  generatedAt: number;
  score: DomainScore;
  insights: DomainInsight[];
  recommendations: RecommendationItem[];
  evidence: EvidenceRef[];
  trace: string[]; // Audit IDs
}

export interface DomainSemanticBundle {
  bundleVersion: string;
  generatedAt: number;
  userId: string;
  domains: Record<string, DomainSemanticOutput>;
  coherenceFlags: string[];
}
