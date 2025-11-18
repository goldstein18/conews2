"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DatePickerRangeProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  startLabel?: string;
  endLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
}

export function DatePickerRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Start Date",
  endLabel = "End Date",
  disabled = false,
  maxDate = new Date(),
  minDate,
  className,
}: DatePickerRangeProps) {
  // Format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Parse date from HTML date input
  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    return new Date(value + 'T00:00:00');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateFromInput(e.target.value);
    onStartDateChange(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateFromInput(e.target.value);
    onEndDateChange(date);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="start-date">{startLabel}</Label>
        <Input
          id="start-date"
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
          disabled={disabled}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          min={minDate ? formatDateForInput(minDate) : undefined}
          className="w-full"
        />
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="end-date">{endLabel}</Label>
        <Input
          id="end-date"
          type="date"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
          disabled={disabled}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          min={startDate ? formatDateForInput(startDate) : (minDate ? formatDateForInput(minDate) : undefined)}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Preset ranges for quick selection
export const DATE_RANGE_PRESETS = [
  {
    label: "Last 7 days",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      return { start, end };
    },
  },
  {
    label: "Last 30 days",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      return { start, end };
    },
  },
  {
    label: "Last 3 months",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 3);
      return { start, end };
    },
  },
  {
    label: "Last 6 months",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 6);
      return { start, end };
    },
  },
  {
    label: "Last 12 months",
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 12);
      return { start, end };
    },
  },
  {
    label: "This year",
    getDates: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), 0, 1);
      return { start, end };
    },
  },
] as const;

// Preset selector component
interface DateRangePresetsProps {
  onPresetSelect: (start: Date, end: Date) => void;
  className?: string;
}

export function DateRangePresets({ onPresetSelect, className }: DateRangePresetsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">Quick Select</Label>
      <div className="grid grid-cols-2 gap-2">
        {DATE_RANGE_PRESETS.map((preset) => {
          const { start, end } = preset.getDates();
          return (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => onPresetSelect(start, end)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}