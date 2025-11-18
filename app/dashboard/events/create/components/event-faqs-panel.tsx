'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { HelpCircle, Plus, X, GripVertical } from 'lucide-react';
import { EventMediaFormData, FAQItemFormData } from '../../lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EventFAQsPanelProps {
  form: UseFormReturn<EventMediaFormData>;
  disabled?: boolean;
}

export function EventFAQsPanel({ form, disabled = false }: EventFAQsPanelProps) {
  const faqs = form.watch('faqs') || [];
  const maxFaqs = 10;
  
  const addFAQ = () => {
    if (faqs.length >= maxFaqs) return;
    
    const newFaq: FAQItemFormData = {
      question: '',
      answer: '',
      orderIndex: faqs.length
    };
    
    const updatedFaqs = [...faqs, newFaq];
    form.setValue('faqs', updatedFaqs);
  };
  
  const removeFAQ = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    // Reorder the remaining FAQs
    const reorderedFaqs = updatedFaqs.map((faq, i) => ({
      ...faq,
      orderIndex: i
    }));
    form.setValue('faqs', reorderedFaqs);
  };
  
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, [field]: value };
      }
      return faq;
    });
    form.setValue('faqs', updatedFaqs);
  };
  
  const moveFAQ = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= faqs.length) return;
    
    const updatedFaqs = [...faqs];
    const [movedFaq] = updatedFaqs.splice(fromIndex, 1);
    updatedFaqs.splice(toIndex, 0, movedFaq);
    
    // Update order indices
    const reorderedFaqs = updatedFaqs.map((faq, i) => ({
      ...faq,
      orderIndex: i
    }));
    
    form.setValue('faqs', reorderedFaqs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5" />
          <span>Frequently Asked Questions</span>
        </CardTitle>
        <CardDescription>
          Answer common questions to make attending your event easy and welcoming for everyone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add FAQ Button */}
        {faqs.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No FAQs yet</h4>
          <p className="text-muted-foreground mb-4">
            Add your first question to help attendees learn more about your event
          </p>
          <Button
            type="button"
            onClick={addFAQ}
            disabled={disabled || faqs.length >= maxFaqs}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* FAQ Items */}
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="cursor-move p-1 hover:bg-gray-100 rounded">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Move buttons */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ(index, index - 1)}
                    disabled={disabled || index === 0}
                    className="h-6 w-6 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ(index, index + 1)}
                    disabled={disabled || index === faqs.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    ↓
                  </Button>
                  
                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    disabled={disabled}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Question Input */}
                <div>
                  <FormLabel className="text-sm font-medium">Question</FormLabel>
                  <Input
                    placeholder="Enter your question..."
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    disabled={disabled}
                    maxLength={200}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {(faq.question || '').length}/200 characters
                  </div>
                </div>

                {/* Answer Input */}
                <div>
                  <FormLabel className="text-sm font-medium">Answer</FormLabel>
                  <Textarea
                    placeholder="Enter your answer..."
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    disabled={disabled}
                    rows={3}
                    maxLength={300}
                    className="mt-1 resize-none"
                  />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {(faq.answer || '').length}/300 characters
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          {faqs.length < maxFaqs && (
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={addFAQ}
                disabled={disabled}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question ({faqs.length}/{maxFaqs})
              </Button>
            </div>
          )}
          
          {faqs.length >= maxFaqs && (
            <div className="text-center text-sm text-muted-foreground">
              Maximum of {maxFaqs} FAQs reached
            </div>
          )}
        </div>
      )}
      
      {/* Form Field for validation */}
      <FormField
        control={form.control}
        name="faqs"
        render={() => (
          <FormItem className="hidden">
            <FormControl>
              <input type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
        {faqs.length > 0 && (
          <div className="text-sm text-muted-foreground">
            ✅ {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} added
          </div>
        )}
      </CardContent>
    </Card>
  );
}