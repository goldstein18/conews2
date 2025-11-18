import { create } from 'zustand';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: string; // e.g., "3h", "2h 30m"
}

export interface RecurringDate {
  id: string;
  date: string; // YYYY-MM-DD format
  repeats: 'once' | 'daily' | 'weekly' | 'monthly';
  timeSlots: TimeSlot[];
}

export interface CalendarNavigationState {
  currentMonth: Date;
  selectedDate: string | null;
  isSheetOpen: boolean;
}

export interface RecurringDatesState {
  // Data state
  recurringDates: RecurringDate[];
  
  // Calendar UI state
  currentMonth: Date;
  selectedDate: string | null;
  isSheetOpen: boolean;
  editingDateId: string | null;
  
  // Actions - Date management
  addRecurringDate: (date: RecurringDate) => void;
  updateRecurringDate: (id: string, updates: Partial<RecurringDate>) => void;
  removeRecurringDate: (id: string) => void;
  getRecurringDateById: (id: string) => RecurringDate | undefined;
  hasDateSelected: (date: string) => boolean;
  getDateTimeSlots: (date: string) => TimeSlot[];
  
  // Actions - Time slot management
  addTimeSlot: (dateId: string, timeSlot: TimeSlot) => void;
  updateTimeSlot: (dateId: string, timeSlotId: string, updates: Partial<TimeSlot>) => void;
  removeTimeSlot: (dateId: string, timeSlotId: string) => void;
  
  // Actions - Calendar navigation
  setCurrentMonth: (month: Date) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  
  // Actions - Sheet management
  openSheet: (date?: string, editingId?: string) => void;
  closeSheet: () => void;
  setSelectedDate: (date: string | null) => void;
  
  // Actions - Utility
  reset: () => void;
  clear: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return '';
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let diffMinutes = endMinutes - startMinutes;
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle next day
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const initialState = {
  recurringDates: [],
  currentMonth: new Date(),
  selectedDate: null,
  isSheetOpen: false,
  editingDateId: null,
};

export const useRecurringDatesStore = create<RecurringDatesState>()((set, get) => ({
  ...initialState,
  
  // Date management
  addRecurringDate: (date: RecurringDate) => {
    set(state => ({
      recurringDates: [...state.recurringDates, { ...date, id: date.id || generateId() }]
    }));
  },
  
  updateRecurringDate: (id: string, updates: Partial<RecurringDate>) => {
    set(state => ({
      recurringDates: state.recurringDates.map(date => 
        date.id === id ? { ...date, ...updates } : date
      )
    }));
  },
  
  removeRecurringDate: (id: string) => {
    set(state => ({
      recurringDates: state.recurringDates.filter(date => date.id !== id)
    }));
  },
  
  getRecurringDateById: (id: string) => {
    return get().recurringDates.find(date => date.id === id);
  },
  
  hasDateSelected: (date: string) => {
    return get().recurringDates.some(recurringDate => recurringDate.date === date);
  },
  
  getDateTimeSlots: (date: string) => {
    const recurringDate = get().recurringDates.find(rd => rd.date === date);
    return recurringDate?.timeSlots || [];
  },
  
  // Time slot management
  addTimeSlot: (dateId: string, timeSlot: TimeSlot) => {
    const timeSlotWithId = {
      ...timeSlot,
      id: timeSlot.id || generateId(),
      duration: calculateDuration(timeSlot.startTime, timeSlot.endTime)
    };
    
    set(state => ({
      recurringDates: state.recurringDates.map(date => 
        date.id === dateId 
          ? { ...date, timeSlots: [...date.timeSlots, timeSlotWithId] }
          : date
      )
    }));
  },
  
  updateTimeSlot: (dateId: string, timeSlotId: string, updates: Partial<TimeSlot>) => {
    set(state => ({
      recurringDates: state.recurringDates.map(date => 
        date.id === dateId 
          ? {
              ...date,
              timeSlots: date.timeSlots.map(slot => 
                slot.id === timeSlotId 
                  ? { 
                      ...slot, 
                      ...updates,
                      duration: updates.startTime || updates.endTime
                        ? calculateDuration(
                            updates.startTime || slot.startTime,
                            updates.endTime || slot.endTime
                          )
                        : slot.duration
                    }
                  : slot
              )
            }
          : date
      )
    }));
  },
  
  removeTimeSlot: (dateId: string, timeSlotId: string) => {
    set(state => ({
      recurringDates: state.recurringDates.map(date => 
        date.id === dateId 
          ? { ...date, timeSlots: date.timeSlots.filter(slot => slot.id !== timeSlotId) }
          : date
      )
    }));
  },
  
  // Calendar navigation
  setCurrentMonth: (month: Date) => {
    set({ currentMonth: month });
  },
  
  navigateMonth: (direction: 'prev' | 'next') => {
    set(state => {
      const newMonth = new Date(state.currentMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return { currentMonth: newMonth };
    });
  },
  
  // Sheet management
  openSheet: (date?: string, editingId?: string) => {
    set({
      isSheetOpen: true,
      selectedDate: date || null,
      editingDateId: editingId || null
    });
  },
  
  closeSheet: () => {
    set({
      isSheetOpen: false,
      selectedDate: null,
      editingDateId: null
    });
  },
  
  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },
  
  // Utility
  reset: () => {
    set(initialState);
  },
  
  clear: () => {
    set({ recurringDates: [] });
  },
}));