// ─────────────────────────────────────────────────────────────────────────────
// Mini-App type definitions
// ─────────────────────────────────────────────────────────────────────────────

export type MiniAppCategory =
  | 'female-health'
  | 'sleep'
  | 'nutrition'
  | 'mental'
  | 'fitness'
  | 'longevity';

export type Permission =
  | 'PROFILE_READ'
  | 'HEALTH_DATA_READ'
  | 'NOTIFICATIONS'
  | 'CYCLE_DATA_READ';

export const PERMISSION_LABELS: Record<Permission, { label: string; desc: string; icon: string }> = {
  PROFILE_READ: {
    label: 'Perfil da utilizadora',
    desc: 'Nome, idade, objetivos de saúde e preferências',
    icon: '👤',
  },
  HEALTH_DATA_READ: {
    label: 'Dados de saúde',
    desc: 'Biomarcadores, ECG, HRV e leituras de sensores',
    icon: '💊',
  },
  NOTIFICATIONS: {
    label: 'Notificações',
    desc: 'Enviar lembretes e alertas contextuais',
    icon: '🔔',
  },
  CYCLE_DATA_READ: {
    label: 'Dados do ciclo',
    desc: 'Ciclo menstrual, sintomas e padrões hormonais',
    icon: '🌙',
  },
};

export const CATEGORY_LABELS: Record<MiniAppCategory, string> = {
  'female-health': 'Saúde Feminina',
  sleep: 'Sono',
  nutrition: 'Nutrição',
  mental: 'Mental',
  fitness: 'Fitness',
  longevity: 'Longevidade',
};

export interface MiniAppManifest {
  id: string;
  name: string;
  tagline: string;
  developer: string;
  developerVerified: boolean;
  category: MiniAppCategory;
  iconEmoji: string;
  iconColor: string;     // accent/primary colour
  iconBg: string;        // icon background colour
  url: string;           // HTTPS URL of the web app
  permissions: Permission[];
  version: string;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics event
// ─────────────────────────────────────────────────────────────────────────────
export interface AnalyticsEvent {
  event: 'APP_LAUNCHED' | 'APP_CLOSED' | 'APP_INSTALLED' | 'APP_UNINSTALLED';
  appId: string;
  timestamp: number;
  meta?: Record<string, unknown>;
}
