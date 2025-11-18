import { useCallback } from 'react';
import { RecurringDate } from '@/store/recurring-dates-store';
import { 
  transformRecurringDatesToAPI, 
  expandAPIPatternToRecurringDates,
  APITransformationResult
} from '../lib/recurring-patterns';

/**
 * Hook for transforming recurring dates between UI and API formats
 */
export function useRecurringTransformation() {
  /**
   * Transform recurring dates from UI format to API format
   */
  const transformForAPI = useCallback((recurringDates: RecurringDate[]): APITransformationResult => {
    return transformRecurringDatesToAPI(recurringDates);
  }, []);
  
  /**
   * Transform API data to UI format (for loading existing events)
   */
  const transformFromAPI = useCallback((apiData: Record<string, unknown>): RecurringDate[] => {
    return expandAPIPatternToRecurringDates(apiData);
  }, []);
  
  /**
   * Get transformation summary for debugging
   */
  const getTransformationSummary = useCallback((recurringDates: RecurringDate[]) => {
    const result = transformRecurringDatesToAPI(recurringDates);
    
    return {
      inputDatesCount: recurringDates.length,
      outputFormat: result.useEventDates ? 'eventDates' : 
                   result.useRecurringPattern ? 'recurringPattern' : 
                   result.useRRule ? 'rrule' : 'none',
      outputDatesCount: result.eventDates?.length || 0,
      pattern: result.pattern,
      hasConsistentTimeSlots: !result.useEventDates || result.eventDates?.length === 0,
      transformation: result
    };
  }, []);
  
  return {
    transformForAPI,
    transformFromAPI,
    getTransformationSummary
  };
}