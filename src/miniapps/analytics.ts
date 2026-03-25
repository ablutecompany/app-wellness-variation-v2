import { AnalyticsEvent } from './types';
import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// Simple local analytics store (no external service in v1)
// ─────────────────────────────────────────────────────────────────────────────

interface AnalyticsStore {
  events: AnalyticsEvent[];
  logEvent: (
    event: AnalyticsEvent['event'],
    appId: string,
    meta?: Record<string, unknown>
  ) => void;
  getEventsForApp: (appId: string) => AnalyticsEvent[];
}

export const useAnalytics = create<AnalyticsStore>((set, get) => ({
  events: [],
  logEvent: (event, appId, meta) => {
    const entry: AnalyticsEvent = {
      event,
      appId,
      timestamp: Date.now(),
      meta,
    };
    set((state) => ({ events: [entry, ...state.events] }));
  },
  getEventsForApp: (appId) => get().events.filter((e) => e.appId === appId),
}));
