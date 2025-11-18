'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { User, Clock, Car, Accessibility, X } from 'lucide-react';
import { EventMediaFormData } from '../../lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdditionalInfoField {
  key: keyof Pick<EventMediaFormData, 'ageInfo' | 'doorTime' | 'parkingInfo' | 'accessibilityInfo'>;
  label: string;
  icon: React.ElementType;
  placeholder: string;
}

const ADDITIONAL_INFO_FIELDS: AdditionalInfoField[] = [
  {
    key: 'ageInfo',
    label: 'Age Info',
    icon: User,
    placeholder: 'Add age information...',
  },
  {
    key: 'doorTime',
    label: 'Door Time',
    icon: Clock,
    placeholder: 'Add door information...',
  },
  {
    key: 'parkingInfo',
    label: 'Parking Information',
    icon: Car,
    placeholder: 'Add parking information...',
  },
  {
    key: 'accessibilityInfo',
    label: 'Accessibility Information',
    icon: Accessibility,
    placeholder: 'Add accessibility information...',
  },
];

interface EventAdditionalInfoPanelProps {
  form: UseFormReturn<EventMediaFormData>;
  disabled?: boolean;
}

export function EventAdditionalInfoPanel({ form, disabled = false }: EventAdditionalInfoPanelProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  
  const toggleField = (fieldKey: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldKey)) {
      newExpanded.delete(fieldKey);
    } else {
      newExpanded.add(fieldKey);
    }
    setExpandedFields(newExpanded);
  };

  const closeField = (fieldKey: string) => {
    const newExpanded = new Set(expandedFields);
    newExpanded.delete(fieldKey);
    setExpandedFields(newExpanded);
    
    // Clear the field value when closing
    form.setValue(fieldKey as keyof EventMediaFormData, '');
  };

  // Check if any field has content
  const hasAnyContent = ADDITIONAL_INFO_FIELDS.some(field => {
    const value = form.watch(field.key);
    return value && value.trim() !== '';
  });

  // Auto-expand fields that have content
  React.useEffect(() => {
    const fieldsWithContent = ADDITIONAL_INFO_FIELDS.filter(field => {
      const value = form.watch(field.key);
      return value && value.trim() !== '';
    }).map(field => field.key);
    
    if (fieldsWithContent.length > 0) {
      setExpandedFields(prev => new Set([...prev, ...fieldsWithContent]));
    }
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Additional Information</span>
        </CardTitle>
        <CardDescription>
          Add details like age guidelines, door times, parking, or accessibility to help guests plan their visit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collapsible Field Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ADDITIONAL_INFO_FIELDS.map((field) => {
          const Icon = field.icon;
          const isExpanded = expandedFields.has(field.key);
          const hasContent = form.watch(field.key)?.trim() !== '';
          
          return (
            <Button
              key={field.key}
              type="button"
              variant={isExpanded || hasContent ? "default" : "outline"}
              size="sm"
              className={`h-9 px-3 text-left justify-start text-xs ${
                hasContent ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' : ''
              }`}
              onClick={() => toggleField(field.key)}
              disabled={disabled}
            >
              <Icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{field.label}</span>
              <span className="ml-auto text-sm font-light">+</span>
            </Button>
          );
        })}
      </div>

      {/* Expanded Field Forms */}
      <div className="space-y-4">
        {ADDITIONAL_INFO_FIELDS.map((field) => {
          const isExpanded = expandedFields.has(field.key);
          if (!isExpanded) return null;
          
          return (
            <div key={field.key} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{field.label}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => closeField(field.key)}
                  disabled={disabled}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name={field.key}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={field.placeholder}
                        disabled={disabled}
                        rows={3}
                        maxLength={200}
                        className="resize-none bg-white"
                        {...formField}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {(formField.value || '').length}/200 characters
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </div>
      
        {hasAnyContent && (
          <div className="text-sm text-muted-foreground">
            ✅ Additional information added successfully
          </div>
        )}
      </CardContent>
    </Card>
  );
}