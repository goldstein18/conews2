'use client';

import { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeSlot } from '@/store/recurring-dates-store';
import { calculateDuration, generateTimeSlots } from '../../lib/date-utils';

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onTimeSlotsChange: (timeSlots: TimeSlot[]) => void;
  mode: 'single' | 'multiple';
  onModeChange: (mode: 'single' | 'multiple') => void;
}

export function TimeSlotManager({
  timeSlots,
  onTimeSlotsChange,
  mode,
  onModeChange
}: TimeSlotManagerProps) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorConfig, setGeneratorConfig] = useState({
    startTime: '09:00',
    endTime: '17:00',
    interval: '60'
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Ensure there's always a time slot in single mode
  useEffect(() => {
    if (mode === 'single' && timeSlots.length === 0) {
      const newSlot: TimeSlot = {
        id: generateId(),
        startTime: '19:00',
        endTime: '22:00',
        duration: calculateDuration('19:00', '22:00')
      };
      onTimeSlotsChange([newSlot]);
    }
  }, [mode, timeSlots.length, onTimeSlotsChange]); // Dependencies for the effect

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: generateId(),
      startTime: '09:00',
      endTime: '10:00',
      duration: '1h'
    };
    onTimeSlotsChange([...timeSlots, newSlot]);
  };

  const ensureSingleTimeSlot = () => {
    if (timeSlots.length === 0) {
      const newSlot: TimeSlot = {
        id: generateId(),
        startTime: '19:00',
        endTime: '22:00',
        duration: calculateDuration('19:00', '22:00')
      };
      onTimeSlotsChange([newSlot]);
      return newSlot.id;
    }
    return timeSlots[0].id;
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    const updatedSlots = timeSlots.map(slot => {
      if (slot.id === id) {
        const updated = { ...slot, ...updates };
        // Recalculate duration if times changed
        if (updates.startTime || updates.endTime) {
          updated.duration = calculateDuration(updated.startTime, updated.endTime);
        }
        return updated;
      }
      return slot;
    });
    onTimeSlotsChange(updatedSlots);
  };

  const removeTimeSlot = (id: string) => {
    onTimeSlotsChange(timeSlots.filter(slot => slot.id !== id));
  };

  const handleGenerateSlots = () => {
    const generated = generateTimeSlots(
      generatorConfig.startTime,
      generatorConfig.endTime,
      parseInt(generatorConfig.interval)
    );
    onTimeSlotsChange(generated);
    setShowGenerator(false);
  };

  const clearAllSlots = () => {
    onTimeSlotsChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            type="button"
            onClick={() => onModeChange('single')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Single time
          </button>
          <button
            type="button"
            onClick={() => onModeChange('multiple')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'multiple'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Multiple times
          </button>
        </div>
      </div>

      {/* Single Time Mode */}
      {mode === 'single' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="single-start-time">Start time *</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="single-start-time"
                type="time"
                value={timeSlots[0]?.startTime || '19:00'}
                onChange={(e) => {
                  const slotId = ensureSingleTimeSlot();
                  updateTimeSlot(slotId, { startTime: e.target.value });
                }}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="single-end-time">End time *</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="single-end-time"
                type="time"
                value={timeSlots[0]?.endTime || '22:00'}
                onChange={(e) => {
                  const slotId = ensureSingleTimeSlot();
                  updateTimeSlot(slotId, { endTime: e.target.value });
                }}
                className="pl-10"
              />
            </div>
            {timeSlots[0] && (
              <div className="text-sm text-gray-500 mt-1">
                Duration: {timeSlots[0].duration}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multiple Times Mode */}
      {mode === 'multiple' && (
        <div className="space-y-4">
          {/* Generator Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Generate time slots</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowGenerator(!showGenerator)}
            >
              {showGenerator ? 'Hide' : 'Show'}
            </Button>
          </div>

          {/* Time Slot Generator */}
          {showGenerator && (
            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start time</Label>
                    <Input
                      type="time"
                      value={generatorConfig.startTime}
                      onChange={(e) => setGeneratorConfig(prev => ({ 
                        ...prev, 
                        startTime: e.target.value 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>End time</Label>
                    <Input
                      type="time"
                      value={generatorConfig.endTime}
                      onChange={(e) => setGeneratorConfig(prev => ({ 
                        ...prev, 
                        endTime: e.target.value 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Interval</Label>
                    <Select
                      value={generatorConfig.interval}
                      onValueChange={(value) => setGeneratorConfig(prev => ({ 
                        ...prev, 
                        interval: value 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGenerator(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateSlots}
                  >
                    Generate Slots
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Slots List */}
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, { startTime: e.target.value })}
                      className="pl-10"
                      placeholder="Start time"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, { endTime: e.target.value })}
                      className="pl-10"
                      placeholder="End time"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500 min-w-[60px]">
                  {slot.duration}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(slot.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {/* Add Time Slot Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={addTimeSlot}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a time slot
            </Button>
          </div>

          {/* Clear All Button */}
          {timeSlots.length > 0 && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllSlots}
                className="text-red-500 hover:text-red-700"
              >
                Clear all slots
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}