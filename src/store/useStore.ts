import { create } from 'zustand';
import { MiniAppManifest, Permission } from '../miniapps/types';

interface UserProfile {
  name: string;
  goals: string[];
  habits: string[];
}

interface Measurement {
  id: string;
  type: 'urinalysis' | 'ecg' | 'ppg' | 'weight' | 'temp';
  value: any;
  timestamp: number;
}

interface ThemeScore {
  id: string;
  themeCode: string;
  value: number;
  stateLabel: string;
  insight?: {
    summaryShort: string;
    explanationLong: string;
  };
  recommendations?: any[];
}

interface AppState {
  // ── Core ──────────────────────────────────────────────────────────────────
  user: UserProfile | null;
  measurements: Measurement[];
  themeScores: ThemeScore[];
  globalScore: number;
  isNfcLoading: boolean;
  isMeasuring: boolean;
  credits: number;

  // ── Mini-App Shell ────────────────────────────────────────────────────────
  installedAppIds: string[];
  activeApp: MiniAppManifest | null;
  grantedPermissions: Record<string, Permission[]>; // appId → granted permissions

  // ── Core Actions ──────────────────────────────────────────────────────────
  setUser: (user: UserProfile) => void;
  addMeasurement: (measurement: Measurement) => void;
  setThemeScores: (scores: ThemeScore[]) => void;
  setGlobalScore: (score: number) => void;
  setNfcLoading: (loading: boolean) => void;
  setIsMeasuring: (measuring: boolean) => void;
  setCredits: (credits: number) => void;

  // ── Mini-App Actions ──────────────────────────────────────────────────────
  installApp: (id: string) => void;
  uninstallApp: (id: string) => void;
  launchApp: (app: MiniAppManifest) => void;
  closeApp: () => void;
  grantPermissions: (appId: string, perms: Permission[]) => void;
  isAppInstalled: (id: string) => boolean;
  hasGrantedPermissions: (id: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  // ── Core State ─────────────────────────────────────────────────────────────
  user: null,
  measurements: [],
  themeScores: [],
  globalScore: 0,
  isNfcLoading: false,
  isMeasuring: false,
  credits: 10,

  // ── Mini-App State ─────────────────────────────────────────────────────────
  installedAppIds: [],
  activeApp: null,
  grantedPermissions: {},

  // ── Core Actions ───────────────────────────────────────────────────────────
  setUser: (user) => set({ user }),
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [measurement, ...state.measurements] })),
  setThemeScores: (themeScores) => set({ themeScores }),
  setGlobalScore: (score) => set({ globalScore: score }),
  setNfcLoading: (loading) => set({ isNfcLoading: loading }),
  setIsMeasuring: (isMeasuring) => set({ isMeasuring }),
  setCredits: (credits) => set({ credits }),

  // ── Mini-App Actions ────────────────────────────────────────────────────────
  installApp: (id) =>
    set((state) => ({
      installedAppIds: state.installedAppIds.includes(id)
        ? state.installedAppIds
        : [...state.installedAppIds, id],
    })),

  uninstallApp: (id) =>
    set((state) => ({
      installedAppIds: state.installedAppIds.filter((a) => a !== id),
      grantedPermissions: Object.fromEntries(
        Object.entries(state.grantedPermissions).filter(([k]) => k !== id)
      ),
    })),

  launchApp: (app) => set({ activeApp: app }),
  closeApp: () => set({ activeApp: null }),

  grantPermissions: (appId, perms) =>
    set((state) => ({
      grantedPermissions: { ...state.grantedPermissions, [appId]: perms },
    })),

  isAppInstalled: (id) => get().installedAppIds.includes(id),
  hasGrantedPermissions: (id) => !!get().grantedPermissions[id],
}));
