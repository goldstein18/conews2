'use client';

import { Calendar, MapPin, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface EventPreviewCardProps {
  title?: string;
  summary?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  city?: string;
  state?: string;
  virtual?: boolean;
  status?: 'draft' | 'published';
  image?: string;
  className?: string;
}

export function EventPreviewCard({
  title,
  summary,
  date,
  startTime,
  endTime,
  venueName,
  city,
  state,
  virtual,
  status = 'draft',
  image,
  className
}: EventPreviewCardProps) {

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    try {
      return format(parseISO(dateString), 'EEE, MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  const getTimeDisplay = () => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    
    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return start;
    }
    return 'Time TBD';
  };

  const getLocationDisplay = () => {
    if (virtual) {
      return 'Virtual Event';
    }
    
    if (venueName) {
      const location = [venueName, city, state].filter(Boolean).join(', ');
      return location || 'Location TBD';
    }
    
    return 'Location TBD';
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", className)}>
      {/* Event Image */}
      <div className="relative h-32 bg-gradient-to-br from-orange-100 via-pink-50 to-red-100">
        {image ? (
          <Image 
            src={image} 
            alt={title || 'Event'} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={status === 'published' ? 'default' : 'secondary'}
            className="text-xs font-medium shadow-sm"
          >
            {status === 'published' ? 'Live' : 'Draft'}
          </Badge>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {title || 'Untitled Event'}
        </h3>
        
        {summary && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        )}
        
        {/* Date and Time */}
        <div className="flex items-start space-x-2 mb-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">
              {formatDate(date)}
            </p>
            <p className="text-xs text-gray-600">
              {getTimeDisplay()}
            </p>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-start space-x-2">
          {virtual ? (
            <Globe className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-xs text-gray-600 line-clamp-1">
            {getLocationDisplay()}
          </p>
        </div>
      </div>
    </div>
  );
}