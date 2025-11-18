import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ImpersonationState {
  isImpersonating: boolean;
  originalAdminId: string | null;
  originalAdminEmail: string | null;
  originalAdminName: string | null;
  originalAdminToken: string | null; // ✅ Backup token for emergency recovery
  targetUserId: string | null;
  targetUserEmail: string | null;
  targetUserName: string | null;
  sessionId: string | null;
  expiresAt: Date | null;
  reason: string | null;

  // Actions
  startImpersonation: (data: {
    originalAdminId: string;
    originalAdminEmail: string;
    originalAdminName: string;
    originalAdminToken?: string; // ✅ Optional backup token
    targetUserId: string;
    targetUserEmail: string;
    targetUserName: string;
    sessionId: string;
    expiresIn: string; // e.g., "1h"
    reason?: string;
  }) => void;
  endImpersonation: () => void;
  isExpired: () => boolean;
  getTimeRemaining: () => string | null;
}

// Helper to parse duration string (e.g., "1h", "30m") to milliseconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([hm])$/);
  if (!match) return 60 * 60 * 1000; // Default 1 hour

  const value = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === 'h') return value * 60 * 60 * 1000;
  if (unit === 'm') return value * 60 * 1000;

  return 60 * 60 * 1000; // Default 1 hour
};

// Helper to format time remaining
const formatTimeRemaining = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

export const useImpersonationStore = create<ImpersonationState>()(
  persist(
    (set, get) => ({
      isImpersonating: false,
      originalAdminId: null,
      originalAdminEmail: null,
      originalAdminName: null,
      originalAdminToken: null,
      targetUserId: null,
      targetUserEmail: null,
      targetUserName: null,
      sessionId: null,
      expiresAt: null,
      reason: null,

      startImpersonation: (data) => {
        const expiresAt = new Date(Date.now() + parseDuration(data.expiresIn));

        set({
          isImpersonating: true,
          originalAdminId: data.originalAdminId,
          originalAdminEmail: data.originalAdminEmail,
          originalAdminName: data.originalAdminName,
          originalAdminToken: data.originalAdminToken || null,
          targetUserId: data.targetUserId,
          targetUserEmail: data.targetUserEmail,
          targetUserName: data.targetUserName,
          sessionId: data.sessionId,
          expiresAt,
          reason: data.reason || null,
        });

        console.log('🎭 Impersonation started:', {
          target: data.targetUserEmail,
          expiresAt: expiresAt.toISOString(),
          hasBackupToken: !!data.originalAdminToken,
        });
      },

      endImpersonation: () => {
        console.log('🎭 Impersonation ended');

        set({
          isImpersonating: false,
          originalAdminId: null,
          originalAdminEmail: null,
          originalAdminName: null,
          originalAdminToken: null,
          targetUserId: null,
          targetUserEmail: null,
          targetUserName: null,
          sessionId: null,
          expiresAt: null,
          reason: null,
        });
      },

      isExpired: () => {
        const { expiresAt, isImpersonating } = get();
        if (!isImpersonating || !expiresAt) return false;

        return new Date() > new Date(expiresAt);
      },

      getTimeRemaining: () => {
        const { expiresAt, isImpersonating } = get();
        if (!isImpersonating || !expiresAt) return null;

        const now = Date.now();
        const expiry = new Date(expiresAt).getTime();
        const remaining = expiry - now;

        if (remaining <= 0) return 'Expired';

        return formatTimeRemaining(remaining);
      },
    }),
    {
      name: 'impersonation-storage',
      partialize: (state) => ({
        isImpersonating: state.isImpersonating,
        originalAdminId: state.originalAdminId,
        originalAdminEmail: state.originalAdminEmail,
        originalAdminName: state.originalAdminName,
        originalAdminToken: state.originalAdminToken,
        targetUserId: state.targetUserId,
        targetUserEmail: state.targetUserEmail,
        targetUserName: state.targetUserName,
        sessionId: state.sessionId,
        expiresAt: state.expiresAt,
        reason: state.reason,
      }),
    }
  )
);
