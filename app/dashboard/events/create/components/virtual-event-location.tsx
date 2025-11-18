'use client';

import { UseFormReturn } from 'react-hook-form';
import { Link, Globe, Video, Monitor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { EventDetailsFormData } from '../../lib/validations';

interface VirtualEventLocationProps {
  form: UseFormReturn<EventDetailsFormData>;
}

const VIRTUAL_PLATFORMS = [
  { value: 'zoom', label: 'Zoom', icon: Video },
  { value: 'teams', label: 'Microsoft Teams', icon: Monitor },
  { value: 'meet', label: 'Google Meet', icon: Video },
  { value: 'webex', label: 'Cisco Webex', icon: Monitor },
  { value: 'youtube', label: 'YouTube Live', icon: Video },
  { value: 'facebook', label: 'Facebook Live', icon: Video },
  { value: 'twitch', label: 'Twitch', icon: Video },
  { value: 'other', label: 'Other Platform', icon: Globe }
];

export function VirtualEventLocation({ form }: VirtualEventLocationProps) {
  const virtualLink = form.watch('virtualEventLink');

  return (
    <div className="space-y-6">
      {/* Platform Selector (Optional) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Platform (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {VIRTUAL_PLATFORMS.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Card
                key={platform.value}
                className="cursor-pointer hover:bg-gray-50 transition-colors border-gray-200"
              >
                <CardContent className="p-3 text-center">
                  <IconComponent className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-xs font-medium text-gray-700">
                    {platform.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Virtual Event Link */}
      <FormField
        control={form.control}
        name="virtualEventLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-1">
              <span>Virtual Event Link</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="url"
                  placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-def-ghi"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              Enter the link where attendees will join your virtual event
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Link Preview */}
      {virtualLink && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-purple-800 mb-1">
                  Virtual Event Link
                </div>
                <div className="text-sm text-purple-600 break-all">
                  {virtualLink}
                </div>
                <div className="text-xs text-purple-500 mt-2">
                  Attendees will use this link to join your virtual event
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Virtual Event Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-blue-800 mb-2">
                Virtual Event Tips
              </div>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Test your virtual platform before the event</li>
                <li>• Provide clear joining instructions to attendees</li>
                <li>• Consider having a backup streaming option</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Set up the meeting room ahead of time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="font-medium text-amber-800 mb-1">
                Privacy & Security
              </div>
              <div className="text-sm text-amber-600">
                Make sure your virtual event link is secure and won&apos;t be misused. 
                Consider using waiting rooms or passwords for sensitive events.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}