/**
 * ArtsGroupLocation Component
 * Location and contact information for arts group
 */

'use client';

import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicArtsGroup } from '@/types/public-arts-groups';

interface ArtsGroupLocationProps {
  artsGroup: PublicArtsGroup;
}

export function ArtsGroupLocation({ artsGroup }: ArtsGroupLocationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        {artsGroup.address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">{artsGroup.address}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {artsGroup.phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Phone</p>
              <a
                href={`tel:${artsGroup.phone}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {artsGroup.phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {artsGroup.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a
                href={`mailto:${artsGroup.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {artsGroup.email}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {artsGroup.website && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Website</p>
              <a
                href={artsGroup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors break-all"
              >
                {artsGroup.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
