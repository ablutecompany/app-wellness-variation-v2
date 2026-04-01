/**
 * DOMAIN AFFINITY REGISTRY v1.2.0
 * Governed Mapping: Signals -> Semantic Domains
 */

export type SemanticDomain = 'sleep' | 'nutrition' | 'general' | 'performance';

/**
 * Mapeamento explícito de tipos de medição para domínios afectados.
 */
const MEASUREMENT_AFFINITY: Record<string, SemanticDomain[]> = {
  'urinalysis': ['sleep', 'nutrition', 'general'],
  'weight': ['nutrition', 'general'],
  'ppg': ['sleep', 'general'],
  'ecg': ['general', 'performance'],
  'temp': ['sleep', 'general']
};

/**
 * Mapeamento explícito de Mini-Apps para domínios afectados.
 */
const APP_AFFINITY: Record<string, SemanticDomain[]> = {
  'com.ablute.sleep': ['sleep', 'general'],
  'com.ablute.nutrition': ['nutrition', 'general'],
  'com.ablute.wash': ['general'],
  'com.ablute.h1': ['performance', 'general']
};

/**
 * Mapeamento de tipos de evento biográfico (Contribution Events) para domínios.
 */
const EVENT_AFFINITY: Record<string, SemanticDomain[]> = {
  'sleep_log': ['sleep'],
  'meal_log': ['nutrition'],
  'nutrient_target_reached': ['nutrition', 'general'],
  'step_goal_reached': ['performance', 'general'],
  'heart_rate_variability': ['sleep', 'performance', 'general']
};

export class DomainAffinity {
  /**
   * Resolve quais domínios devem ser invalidados baseados num sinal.
   */
  static resolveFromMeasurement(type: string): SemanticDomain[] {
    return MEASUREMENT_AFFINITY[type] || ['general'];
  }

  static resolveFromApp(appId: string): SemanticDomain[] {
    // Fallback se não for match exacto (governed fallback)
    if (APP_AFFINITY[appId]) return APP_AFFINITY[appId];

    // Heurística residual assinalada para apps de terceiros / novas
    if (appId.includes('sleep')) return ['sleep', 'general'];
    if (appId.includes('nutrition')) return ['nutrition', 'general'];
    
    return ['general'];
  }

  static resolveFromEvent(eventType: string): SemanticDomain[] {
    return EVENT_AFFINITY[eventType] || ['general'];
  }
}
