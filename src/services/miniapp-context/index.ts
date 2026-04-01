import { Permission } from '../../miniapps/types';

export interface ContextState {
  user: any;
  measurements: any[];
  themeScores: any[];
  globalScore: number;
  grantedPermissions: Record<string, Permission[]>;
}

export function buildContextPayload(appId: string, state: ContextState) {
  // Lista de permissões efetivamente ativas e concedidas
  const perms = state.grantedPermissions[appId] || [];

  // 1. profileContext
  // Exibido apenas se autorizado através da flag PROFILE_READ
  const profileContext = perms.includes('PROFILE_READ')
    ? {
        name: state.user?.name || null,
        goals: state.user?.goals || [],
        habits: state.user?.habits || [],
      }
    : null;

  // 2. healthSummaryContext
  // Expõe a saúde agregada APENAS se autorizado em HEALTH_DATA_READ
  // Sem dump cego; isolando variáveis genéricas
  const healthSummaryContext = perms.includes('HEALTH_DATA_READ')
    ? {
        globalScore: state.globalScore,
        themeScores: state.themeScores.map(ts => ({
          themeCode: ts.themeCode,
          value: ts.value,
          stateLabel: ts.stateLabel
        })),
        recentMeasurementsCount: state.measurements.length,
      }
    : null;

  // 3. sleepContextPackage
  // Isolando leituras ou temas de sono para apps de sono (SLEEP_DATA_READ)
  const sleepContextPackage = perms.includes('SLEEP_DATA_READ')
    ? {
        sleepScore: state.themeScores.find(ts => ts.themeCode === 'sleep')?.value || null,
        // Adaptamos o histórico que existe filtrando para evitar exfiltrações
        relatedMeasurements: state.measurements
          .filter(m => m.type === 'urinalysis' || m.type === 'ppg')
          .slice(0, 5)
      }
    : null;

  // 4. nutritionContextPackage
  // Isolando dieta/metabolismo para nutrição (NUTRITION_DATA_READ)
  const nutritionContextPackage = perms.includes('NUTRITION_DATA_READ')
    ? {
        nutritionScore: state.themeScores.find(ts => ts.themeCode === 'nutrition')?.value || null,
        // Limita a partilha estritamente ao tipo pertinente
        lastMetabolicLogs: state.measurements
          .filter(m => m.type === 'weight')
          .slice(0, 3)
      }
    : null;

  // 5. permissionsContext
  // Lista auditável de direitos efetivamente injetados para introspeção da app
  const permissionsContext = {
    granted: perms,
    timestamp: Date.now(),
    version: '1.0'
  };

  return {
    appId,
    profileContext,
    healthSummaryContext,
    sleepContextPackage,
    nutritionContextPackage,
    permissionsContext
  };
}
