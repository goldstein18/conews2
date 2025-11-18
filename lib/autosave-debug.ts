'use client';

import { AutoSaveMetrics } from '@/store/event-draft-store';

/**
 * Development utility for monitoring autosave performance
 */
export class AutoSaveDebugger {
  private static instance: AutoSaveDebugger;
  private logs: Array<{
    timestamp: Date;
    type: 'save_start' | 'save_complete' | 'save_error' | 'batch_created' | 'field_change';
    data: Record<string, unknown>;
    duration?: number;
  }> = [];

  private saveStartTimes: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): AutoSaveDebugger {
    if (!AutoSaveDebugger.instance) {
      AutoSaveDebugger.instance = new AutoSaveDebugger();
    }
    return AutoSaveDebugger.instance;
  }

  /**
   * Log a field change for monitoring
   */
  logFieldChange(fieldName: string, config: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'development') return;
    
    this.logs.push({
      timestamp: new Date(),
      type: 'field_change',
      data: { fieldName, config }
    });

    this.trimLogs();
  }

  /**
   * Log when a save operation starts
   */
  logSaveStart(saveId: string, fieldsCount: number) {
    if (process.env.NODE_ENV !== 'development') return;
    
    this.saveStartTimes.set(saveId, Date.now());
    this.logs.push({
      timestamp: new Date(),
      type: 'save_start',
      data: { saveId, fieldsCount }
    });

    this.trimLogs();
  }

  /**
   * Log when a save operation completes
   */
  logSaveComplete(saveId: string, success: boolean, error?: Error | string) {
    if (process.env.NODE_ENV !== 'development') return;
    
    const startTime = this.saveStartTimes.get(saveId);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    if (startTime) {
      this.saveStartTimes.delete(saveId);
    }

    this.logs.push({
      timestamp: new Date(),
      type: success ? 'save_complete' : 'save_error',
      data: { saveId, error },
      duration
    });

    this.trimLogs();
    
    // Log performance warning if save took too long
    if (duration && duration > 2000) {
      console.warn(`[AutoSave] Slow save detected: ${duration}ms for ${saveId}`);
    }
  }

  /**
   * Log when a batch is created
   */
  logBatchCreated(fieldsCount: number, totalDebounceTime: number) {
    if (process.env.NODE_ENV !== 'development') return;
    
    this.logs.push({
      timestamp: new Date(),
      type: 'batch_created',
      data: { fieldsCount, totalDebounceTime }
    });

    this.trimLogs();
  }

  /**
   * Generate performance report
   */
  generateReport(metrics?: AutoSaveMetrics): string {
    if (process.env.NODE_ENV !== 'development') return 'Debug reports only available in development';
    
    const saves = this.logs.filter(log => log.type === 'save_complete');
    const errors = this.logs.filter(log => log.type === 'save_error');
    const fieldChanges = this.logs.filter(log => log.type === 'field_change');
    const batches = this.logs.filter(log => log.type === 'batch_created');

    const avgSaveTime = saves.reduce((sum, log) => sum + (log.duration || 0), 0) / saves.length || 0;
    const maxSaveTime = Math.max(...saves.map(log => log.duration || 0), 0);

    return `
AutoSave Performance Report
==========================
Session Statistics:
- Field Changes: ${fieldChanges.length}
- Batches Created: ${batches.length}
- Successful Saves: ${saves.length}
- Failed Saves: ${errors.length}
- Average Save Time: ${avgSaveTime.toFixed(2)}ms
- Max Save Time: ${maxSaveTime}ms

Global Metrics (if available):
${metrics ? `
- Total Saves: ${metrics.totalSaves}
- Batched Saves: ${metrics.batchedSaves}
- Average Debounce Time: ${metrics.averageDebounceTime.toFixed(2)}ms
- Failure Count: ${metrics.failureCount}
- Last Save Time: ${metrics.lastSaveTime}ms
` : '- No global metrics available'}

Efficiency Score: ${this.calculateEfficiencyScore(saves, errors, batches)}%

Recent Activity:
${this.logs.slice(-10).map(log => `
  ${log.timestamp.toLocaleTimeString()} [${log.type.toUpperCase()}] ${JSON.stringify(log.data)}${log.duration ? ` (${log.duration}ms)` : ''}
`).join('')}
    `.trim();
  }

  /**
   * Calculate efficiency score based on performance metrics
   */
  private calculateEfficiencyScore(saves: Array<{ duration?: number }>, errors: unknown[], batches: unknown[]): number {
    const successRate = saves.length / (saves.length + errors.length) * 100 || 100;
    const batchEfficiency = batches.length > 0 ? (saves.length / batches.length) * 10 : 100;
    const speedScore = saves.reduce((score, log) => {
      if (!log.duration) return score + 100;
      if (log.duration < 500) return score + 100;
      if (log.duration < 1000) return score + 80;
      if (log.duration < 2000) return score + 60;
      return score + 40;
    }, 0) / saves.length || 100;

    return Math.min(100, Math.round((successRate + batchEfficiency + speedScore) / 3));
  }

  /**
   * Keep only last 100 logs to prevent memory issues
   */
  private trimLogs() {
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  /**
   * Clear all debug logs
   */
  clearLogs() {
    this.logs = [];
    this.saveStartTimes.clear();
  }

  /**
   * Get current logs for debugging
   */
  getLogs() {
    return [...this.logs];
  }
}

// Global debug utility
export const autosaveDebugger = AutoSaveDebugger.getInstance();

// Console helper for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).autosaveDebug = {
    report: () => console.log(autosaveDebugger.generateReport()),
    logs: () => console.table(autosaveDebugger.getLogs()),
    clear: () => autosaveDebugger.clearLogs()
  };
}