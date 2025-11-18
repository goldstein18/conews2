'use client';

import dynamic from 'next/dynamic';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import with SSR disabled to avoid Tiptap build issues in Vercel
const NovelEditor = dynamic(
  () => import('./novel-editor').then((mod) => mod.NovelEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg bg-muted/50 p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }
);

interface NovelEditorFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function NovelEditorField({
  field,
  label,
  description,
  placeholder,
  disabled = false,
  minHeight = '400px'
}: NovelEditorFieldProps) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <NovelEditor
          content={field.value || ''}
          onChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
          minHeight={minHeight}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
