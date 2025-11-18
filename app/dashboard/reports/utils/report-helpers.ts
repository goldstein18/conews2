// Report generation status polling utilities
export const POLLING_INTERVALS = {
  FAST: 3000,    // 3 seconds - for active generation
  NORMAL: 5000,  // 5 seconds - for normal checking
  SLOW: 10000,   // 10 seconds - for background checks
} as const;

// Report status type guards
export const isReportCompleted = (status: string): boolean => {
  return status === 'COMPLETED';
};

export const isReportFailed = (status: string): boolean => {
  return status === 'FAILED';
};

export const isReportPending = (status: string): boolean => {
  return status === 'PENDING' || status === 'GENERATING';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Format numbers for display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

// Format percentage
export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

// Calculate CTR
export const calculateCTR = (clicks: number, impressions: number): number => {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
};

// Date formatting utilities
export const formatReportDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
  });
  
  const endFormatted = end.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

// Validate report generation input
export const validateReportInput = (input: {
  companyId: string;
  startDate: Date;
  endDate: Date;
  includeEvents: boolean;
  includeBanners: boolean;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input.companyId) {
    errors.push('Company selection is required');
  }
  
  if (!input.startDate) {
    errors.push('Start date is required');
  }
  
  if (!input.endDate) {
    errors.push('End date is required');
  }
  
  if (input.startDate && input.endDate && input.startDate > input.endDate) {
    errors.push('End date must be after start date');
  }
  
  if (!input.includeEvents && !input.includeBanners) {
    errors.push('At least one asset type must be selected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Generate download filename
export const generateReportFilename = (
  companyName: string,
  startDate: string,
  endDate: string,
  type: 'pdf' | 'csv' = 'pdf'
): string => {
  const start = new Date(startDate).toISOString().split('T')[0];
  const end = new Date(endDate).toISOString().split('T')[0];
  const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  return `asset_report_${sanitizedCompanyName}_${start}_to_${end}.${type}`;
};

// Polling management utilities
export class ReportPollingManager {
  private intervalId: number | null = null;
  private currentInterval: number = POLLING_INTERVALS.NORMAL;
  
  start(
    pollFunction: () => Promise<void>,
    interval: number = POLLING_INTERVALS.NORMAL
  ): void {
    this.stop(); // Clear any existing interval
    this.currentInterval = interval;
    
    this.intervalId = window.setInterval(async () => {
      try {
        await pollFunction();
      } catch (error) {
        console.error('Polling error:', error);
        this.stop(); // Stop polling on error
      }
    }, interval);
  }
  
  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  isRunning(): boolean {
    return this.intervalId !== null;
  }
  
  getCurrentInterval(): number {
    return this.currentInterval;
  }
}

// Asset type utilities
export const ASSET_TYPE_COLORS = {
  'EVENTS': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  'BANNERS': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  'ALL': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dot: 'bg-gray-500',
  },
} as const;

export const getAssetTypeColor = (type: string) => {
  return ASSET_TYPE_COLORS[type as keyof typeof ASSET_TYPE_COLORS] || ASSET_TYPE_COLORS.ALL;
};