'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search input with icon and clear button
 * Used in GlobalSearch component
 */
export function SearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search venues or locations...',
  className = ''
}: SearchInputProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />

      {/* Input field */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-11 pl-10 ${value ? 'pr-10' : 'pr-4'}`}
        autoComplete="off"
      />

      {/* Clear button - only visible when there's text */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-accent transition-colors z-10"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
