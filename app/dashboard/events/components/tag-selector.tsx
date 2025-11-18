'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { cn } from '@/lib/utils';
import {
  GET_MAIN_GENRES,
  GET_SUBGENRES, 
  GET_SUPPORTING_TAGS,
  GET_AUDIENCE_TAGS
} from '@/lib/graphql/tags';
// Simplified command components using existing UI components
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export type TagType = 'mainGenre' | 'subgenre' | 'supporting' | 'audience';

interface Tag {
  id: string;
  name: string;
  display?: string;
  color?: string;
  mainGenre?: string;
}

interface TagSelectorProps {
  type: TagType;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  mainGenreId?: string; // For subgenre filtering
  multiple?: boolean;
  required?: boolean;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export function TagSelector({
  type,
  value,
  onChange,
  mainGenreId,
  multiple = false,
  required = false,
  placeholder,
  label,
  description,
  className,
  error,
  disabled = false
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Determine which GraphQL query to use
  const query = useMemo(() => {
    switch (type) {
      case 'mainGenre':
        return GET_MAIN_GENRES;
      case 'subgenre':
        return GET_SUBGENRES;
      case 'supporting':
        return GET_SUPPORTING_TAGS;
      case 'audience':
        return GET_AUDIENCE_TAGS;
      default:
        return GET_MAIN_GENRES;
    }
  }, [type]);
  
  // First, get main genres to convert mainGenreId to mainGenre name
  const { data: mainGenresData } = useQuery(GET_MAIN_GENRES, {
    skip: type !== 'subgenre' || !mainGenreId,
    errorPolicy: 'all'
  });
  
  // Convert mainGenreId to mainGenre name for subgenre queries
  const mainGenreName = useMemo(() => {
    if (type !== 'subgenre' || !mainGenreId || !mainGenresData?.mainGenres) {
      return null;
    }
    
    const mainGenre = mainGenresData.mainGenres.find((genre: Tag) => genre.id === mainGenreId);
    const genreName = mainGenre?.name;
    return genreName || null;
  }, [type, mainGenreId, mainGenresData]);

  // Query variables (only needed for subgenres)
  const queryVariables = useMemo(() => {
    return type === 'subgenre' && mainGenreName ? { mainGenre: mainGenreName } : {};
  }, [type, mainGenreName]);
  
  // Fetch tags
  const { data, loading, error: queryError } = useQuery(query, {
    variables: queryVariables,
    skip: type === 'subgenre' && !mainGenreName, // Skip subgenres if no main genre name available
    errorPolicy: 'all'
  });
  
  // Extract tags from query result
  const tags: Tag[] = useMemo(() => {
    if (!data) return [];
    
    switch (type) {
      case 'mainGenre':
        return data.mainGenres || [];
      case 'subgenre':
        return data.subgenres || [];
      case 'supporting':
        return data.supportingTags || [];
      case 'audience':
        return data.audienceTags || [];
      default:
        return [];
    }
  }, [data, type]);
  
  // Filter tags based on search term
  const filteredTags = useMemo(() => {
    if (!searchTerm) return tags;
    
    const term = searchTerm.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(term) ||
      tag.display?.toLowerCase().includes(term)
    );
  }, [tags, searchTerm]);
  
  // Convert value to array for consistent handling
  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return value ? [value as string] : [];
  }, [value, multiple]);
  
  // Get selected tags
  const selectedTags = useMemo(() => {
    return tags.filter(tag => selectedValues.includes(tag.id));
  }, [tags, selectedValues]);
  
  // Handle tag selection
  const handleSelect = (tagId: string) => {
    if (disabled) return;
    
    if (multiple) {
      const newValue = selectedValues.includes(tagId)
        ? selectedValues.filter(id => id !== tagId)
        : [...selectedValues, tagId];
      onChange(newValue);
    } else {
      onChange(selectedValues.includes(tagId) ? '' : tagId);
      setIsOpen(false);
    }
  };
  
  // Handle tag removal (for multiple selection)
  const handleRemove = (tagId: string) => {
    if (disabled || !multiple) return;
    
    const newValue = selectedValues.filter(id => id !== tagId);
    onChange(newValue);
  };
  
  // Get placeholder text
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    const typeLabels = {
      mainGenre: 'Select main genre',
      subgenre: 'Select subgenre',
      supporting: 'Select supporting tags',
      audience: 'Select audience tags'
    };
    
    return typeLabels[type];
  };
  
  // Display text for trigger button
  const getDisplayText = () => {
    if (selectedTags.length === 0) {
      return getPlaceholder();
    }
    
    if (multiple && selectedTags.length > 2) {
      return `${selectedTags.length} tags selected`;
    }
    
    return selectedTags
      .map(tag => tag.display || tag.name)
      .join(', ');
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {/* Selected tags (for multiple selection) */}
      {multiple && selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1"
              style={{ 
                backgroundColor: tag.color ? `${tag.color}20` : undefined,
                borderColor: tag.color || undefined 
              }}
            >
              <span>{tag.display || tag.name}</span>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(tag.id)}
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              'w-full justify-between',
              error && 'border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <span className={cn(
              'truncate',
              selectedTags.length === 0 && 'text-muted-foreground'
            )}>
              {getDisplayText()}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-3 border-b">
            <Input
              placeholder={`Search ${type}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
          
          <ScrollArea className="max-h-64">
            {filteredTags.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {queryError ? 'Error loading tags' : 'No tags found'}
              </div>
            ) : (
              <div className="p-1">
                {filteredTags.map((tag) => {
                  const isSelected = selectedValues.includes(tag.id);
                  
                  return (
                    <div
                      key={tag.id}
                      onClick={() => handleSelect(tag.id)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted",
                        isSelected && "bg-muted"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        {tag.color && (
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: tag.color }}
                          />
                        )}
                        <span className="text-sm">{tag.display || tag.name}</span>
                      </div>
                      
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      {/* Special message for subgenres when no main genre is selected */}
      {type === 'subgenre' && !mainGenreId && (
        <p className="text-sm text-muted-foreground">
          Please select a main genre first to choose subgenres.
        </p>
      )}
    </div>
  );
}

// Compound component for complete tag selection
interface EventTagSelectorProps {
  mainGenreId: string;
  onMainGenreChange: (genreId: string) => void;
  subgenreId: string;
  onSubgenreChange: (genreId: string) => void;
  supportingTagIds: string[];
  onSupportingTagsChange: (tagIds: string[]) => void;
  audienceTagIds: string[];
  onAudienceTagsChange: (tagIds: string[]) => void;
  errors?: {
    mainGenreId?: string;
    subgenreId?: string;
    supportingTagIds?: string;
    audienceTagIds?: string;
  };
  disabled?: boolean;
  className?: string;
}

export function EventTagSelector({
  mainGenreId,
  onMainGenreChange,
  subgenreId,
  onSubgenreChange,
  supportingTagIds,
  onSupportingTagsChange,
  audienceTagIds,
  onAudienceTagsChange,
  errors = {},
  disabled = false,
  className
}: EventTagSelectorProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Event Categories</h3>
          <p className="text-sm text-muted-foreground">
            Help people discover your event by selecting relevant categories and tags.
          </p>
        </div>
        
        {/* Main Genre - Required */}
        <TagSelector
          type="mainGenre"
          value={mainGenreId}
          onChange={(value) => onMainGenreChange(value as string)}
          label="Main Category"
          description="Primary category for your event"
          required
          disabled={disabled}
          error={errors.mainGenreId}
        />
        
        {/* Subgenre - Required */}
        <TagSelector
          type="subgenre"
          value={subgenreId}
          onChange={(value) => onSubgenreChange(value as string)}
          mainGenreId={mainGenreId}
          label="Sub Category"
          description="Specific style within your main genre"
          required
          disabled={disabled}
          error={errors.subgenreId}
        />
        
        <Separator />
        
        {/* Supporting Tags - Optional, Multiple */}
        <TagSelector
          type="supporting"
          value={supportingTagIds}
          onChange={(value) => onSupportingTagsChange(value as string[])}
          multiple
          label="Supporting Tags"
          description="Additional descriptive tags (optional)"
          disabled={disabled}
          error={errors.supportingTagIds}
        />
        
        {/* Audience Tags - Optional, Multiple */}
        <TagSelector
          type="audience"
          value={audienceTagIds}
          onChange={(value) => onAudienceTagsChange(value as string[])}
          multiple
          label="Audience Tags"
          description="Who is your event for? (optional)"
          disabled={disabled}
          error={errors.audienceTagIds}
        />
      </div>
    </div>
  );
}