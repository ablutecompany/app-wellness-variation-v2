import { create } from 'zustand';

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
  user: UserProfile | null;
  measurements: Measurement[];
  themeScores: ThemeScore[];
  globalScore: number;
  isNfcLoading: boolean;
  isMeasuring: boolean;
  credits: number;
  setUser: (user: UserProfile) => void;
  addMeasurement: (measurement: Measurement) => void;
  setThemeScores: (scores: ThemeScore[]) => void;
  setGlobalScore: (score: number) => void;
  setNfcLoading: (loading: boolean) => void;
  setIsMeasuring: (measuring: boolean) => void;
  setCredits: (credits: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  measurements: [],
  themeScores: [],
  globalScore: 0,
  isNfcLoading: false,
  isMeasuring: false,
  credits: 10,
  setUser: (user) => set({ user }),
  addMeasurement: (measurement) => set((state) => ({ 
    measurements: [measurement, ...state.measurements] 
  })),
  setThemeScores: (themeScores) => set({ themeScores }),
  setGlobalScore: (score) => set({ globalScore: score }),
  setNfcLoading: (loading) => set({ isNfcLoading: loading }),
  setIsMeasuring: (isMeasuring) => set({ isMeasuring }),
  setCredits: (credits) => set({ credits }),
}));
