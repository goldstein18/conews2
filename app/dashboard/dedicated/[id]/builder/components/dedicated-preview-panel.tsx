'use client';

import { useEffect } from 'react';
import { render } from '@react-email/render';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { useDedicatedBuilderStore } from '@/store/dedicated-builder-store';
import { DedicatedEmail } from '../lib/email-templates/dedicated-email-template';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedPreviewPanelProps {
  dedicated: Dedicated;
}

/**
 * Helper function to validate dedicated data for email generation
 */
const validateDedicatedForEmail = (dedicated: Dedicated): boolean => {
  return !!(
    dedicated.subject &&
    dedicated.alternateText &&
    dedicated.link &&
    dedicated.imageUrl &&
    dedicated.imageUrl !== 'placeholder'
  );
};

export function DedicatedPreviewPanel({ dedicated }: DedicatedPreviewPanelProps) {
  const { generatedHtml, setGeneratedHtml } = useDedicatedBuilderStore();

  // Generate HTML using React Email when dedicated data changes
  useEffect(() => {
    if (!validateDedicatedForEmail(dedicated)) {
      return;
    }

    const generatePreview = async () => {
      try {
        const html = await render(DedicatedEmail({
          subject: dedicated.subject,
          alternateText: dedicated.alternateText,
          link: dedicated.link,
          imageUrl: dedicated.imageUrl || '',
          market: dedicated.market,
          unsubscribeUrl: '#unsubscribe'
        }));

        setGeneratedHtml(html);
      } catch (error) {
        console.error('Error generating preview:', error);
      }
    };

    generatePreview();
  }, [dedicated, setGeneratedHtml]);

  const isValid = validateDedicatedForEmail(dedicated);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="h-6 w-6" />
          Email Preview
        </h2>
        <p className="text-muted-foreground mt-1">
          Preview how your dedicated campaign will appear in recipients&apos; inboxes
        </p>
      </div>

      {/* Validation Status */}
      {isValid ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Email is ready for campaign creation
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Email cannot be previewed. Please ensure the dedicated has a valid image uploaded.
          </AlertDescription>
        </Alert>
      )}

      {/* Email Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Subject Line</p>
            <p className="text-sm mt-1">{dedicated.subject}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Link Destination</p>
            <a
              href={dedicated.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 block truncate"
            >
              {dedicated.link}
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Market</p>
            <Badge variant="outline" className="mt-1">
              {dedicated.market.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Send Date</p>
            <p className="text-sm mt-1">
              {new Date(dedicated.sendDate).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* HTML Preview */}
      {generatedHtml && isValid ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                srcDoc={generatedHtml}
                title="Email Preview"
                className="w-full h-[600px] border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {dedicated.imageUrl === 'placeholder'
                ? 'Please upload an image to preview the email'
                : 'Unable to generate preview'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
