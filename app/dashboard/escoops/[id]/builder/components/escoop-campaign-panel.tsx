'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  TestTube,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
  Mail,
  Edit
} from 'lucide-react';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import { useBrevoCampaigns, type BrevoList, type BrevoSegment } from '../hooks/use-brevo-campaigns';

interface EscoopCampaignPanelProps {
  escoopId: string;
}

export function EscoopCampaignPanel({ escoopId }: EscoopCampaignPanelProps) {
  const {
    settings,
    generatedHtml,
    campaign,
    setCampaignId,
    setCampaignStatus,
    setCampaignError,
    clearCampaignError
  } = useEscoopBuilderStore();

  const {
    lists,
    segments,
    createCampaign,
    createLoading,
    updateCampaign,
    updateLoading,
    sendTest,
    testLoading,
    sendCampaign,
    sendLoading
  } = useBrevoCampaigns();

  const [testEmails, setTestEmails] = useState('');

  // Validation
  const isConfigurationValid = () => {
    const hasListsOrSegments =
      (settings.selectedBrevoLists?.length > 0) ||
      (settings.selectedBrevoSegments?.length > 0);

    return (
      settings.subjectLine?.trim() !== '' &&
      hasListsOrSegments &&
      generatedHtml !== null
    );
  };

  const getSelectedListsInfo = () => {
    return lists.filter((list: BrevoList) => settings.selectedBrevoLists?.includes(list.id));
  };

  const getSelectedSegmentsInfo = () => {
    return segments.filter((segment: BrevoSegment) => settings.selectedBrevoSegments?.includes(segment.id));
  };

  const getTotalSubscribers = () => {
    return getSelectedListsInfo().reduce((total: number, list: BrevoList) => total + list.uniqueSubscribers, 0);
  };

  const handleCreateCampaign = async () => {
    if (!isConfigurationValid()) {
      setCampaignError('Please complete all required settings before creating campaign');
      return;
    }

    clearCampaignError();

    try {
      const result = await createCampaign({
        escoopId,
        htmlContent: generatedHtml || '',
        subject: settings.subjectLine,
        listIds: settings.selectedBrevoLists || [],
        segmentIds: settings.selectedBrevoSegments || [],
        sender: {
          name: 'CultureOwl',
          email: 'no-reply@cultureowl.com'
        },
        toField: '[DEFAULT_TO_FIELD]'
      });

      if (result?.success && result?.campaignId) {
        setCampaignId(result.campaignId);
        setCampaignStatus('created');
      } else {
        setCampaignError(result?.message || 'Failed to create campaign');
      }
    } catch {
      setCampaignError('An error occurred while creating the campaign');
    }
  };

  const handleUpdateCampaign = async () => {
    if (!isConfigurationValid()) {
      setCampaignError('Please complete all required settings before updating campaign');
      return;
    }

    clearCampaignError();

    try {
      const result = await updateCampaign({
        escoopId,
        htmlContent: generatedHtml || undefined,
        subject: settings.subjectLine,
        listIds: settings.selectedBrevoLists || [],
        segmentIds: settings.selectedBrevoSegments || [],
        sender: {
          name: 'CultureOwl',
          email: 'no-reply@cultureowl.com'
        },
        toField: '[DEFAULT_TO_FIELD]'
      });

      if (result?.success) {
        // Campaign successfully updated - show success message via toast
        // No need to change campaign status as it remains the same
      } else {
        setCampaignError(result?.message || 'Failed to update campaign');
      }
    } catch {
      setCampaignError('An error occurred while updating the campaign');
    }
  };

  const handleSendTest = async () => {
    if (!campaign.campaignId) return;

    const emails = testEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      setCampaignError('Please enter at least one test email address');
      return;
    }

    clearCampaignError();

    try {
      const result = await sendTest({
        campaignId: campaign.campaignId,
        testEmails: emails
      });

      if (result?.success) {
        setCampaignStatus('test_sent');
      } else {
        setCampaignError(result?.message || 'Failed to send test campaign');
      }
    } catch {
      setCampaignError('An error occurred while sending test campaign');
    }
  };

  const handleSendCampaign = async () => {
    if (!campaign.campaignId) return;

    clearCampaignError();

    try {
      const result = await sendCampaign({
        campaignId: campaign.campaignId
      });

      if (result?.success) {
        setCampaignStatus('sent');
      } else {
        setCampaignError(result?.message || 'Failed to send campaign');
      }
    } catch {
      setCampaignError('An error occurred while sending campaign');
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Campaign Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {campaign.campaignStatus === 'not_created' && (
                  <Badge variant="outline">Not Created</Badge>
                )}
                {campaign.campaignStatus === 'created' && (
                  <Badge variant="default" className="bg-blue-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Created
                  </Badge>
                )}
                {campaign.campaignStatus === 'test_sent' && (
                  <Badge variant="default" className="bg-green-500">
                    <TestTube className="h-3 w-3 mr-1" />
                    Test Sent
                  </Badge>
                )}
                {campaign.campaignStatus === 'sent' && (
                  <Badge variant="default" className="bg-purple-500">
                    <Send className="h-3 w-3 mr-1" />
                    Campaign Sent
                  </Badge>
                )}
                {campaign.campaignStatus === 'error' && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
              {campaign.campaignId && (
                <span className="text-sm text-muted-foreground">
                  Campaign ID: {campaign.campaignId}
                </span>
              )}
            </div>
          </div>

          {campaign.lastError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{campaign.lastError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Campaign Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Subject Line</Label>
              <p className="text-sm text-muted-foreground">
                {settings.subjectLine || 'Not configured'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Sender</Label>
              <p className="text-sm text-muted-foreground">
                CultureOwl (no-reply@cultureowl.com)
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Selected Lists ({settings.selectedBrevoLists?.length || 0})</span>
            </Label>
            {settings.selectedBrevoLists?.length > 0 ? (
              <div className="mt-2 space-y-2">
                {getSelectedListsInfo().map((list: BrevoList) => (
                  <div key={list.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{list.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {list.uniqueSubscribers.toLocaleString()} subscribers
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Total from Lists</span>
                  <span className="text-sm font-medium">
                    {getTotalSubscribers().toLocaleString()} subscribers
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                No lists selected.
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Selected Segments ({settings.selectedBrevoSegments?.length || 0})</span>
            </Label>
            {settings.selectedBrevoSegments?.length > 0 ? (
              <div className="mt-2 space-y-2">
                {getSelectedSegmentsInfo().map((segment: BrevoSegment) => (
                  <div key={segment.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex-1">
                      <span className="text-sm">{segment.name}</span>
                      <div className="text-xs text-muted-foreground">
                        Category: {segment.categoryName}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Dynamic
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                No segments selected.
              </p>
            )}
          </div>

          {!isConfigurationValid() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete configuration required: {' '}
                {(!settings.subjectLine || settings.subjectLine.trim() === '') && 'Subject line, '}
                {(!settings.selectedBrevoLists || settings.selectedBrevoLists.length === 0) &&
                 (!settings.selectedBrevoSegments || settings.selectedBrevoSegments.length === 0) &&
                 'Select lists or segments, '}
                {!generatedHtml && 'Generate preview content'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Campaign Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaign.campaignStatus === 'not_created' && (
            <Button
              onClick={handleCreateCampaign}
              disabled={!isConfigurationValid() || createLoading}
              className="w-full"
              size="lg"
            >
              {createLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Campaign...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Create Campaign in Brevo
                </>
              )}
            </Button>
          )}

          {(campaign.campaignStatus === 'created' || campaign.campaignStatus === 'test_sent') && (
            <div className="space-y-4">
              {/* Update Campaign Section */}
              <Button
                onClick={handleUpdateCampaign}
                disabled={!isConfigurationValid() || updateLoading}
                variant="outline"
                className="w-full"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Campaign...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Campaign Content
                  </>
                )}
              </Button>

              <Separator />

              {/* Test Campaign Section */}
              <div className="space-y-3">
                <Label htmlFor="test-emails">Test Email Addresses</Label>
                <Textarea
                  id="test-emails"
                  placeholder="Enter email addresses, one per line&#10;test@example.com&#10;admin@company.com"
                  rows={3}
                  value={testEmails}
                  onChange={(e) => setTestEmails(e.target.value)}
                />
                <Button
                  onClick={handleSendTest}
                  disabled={testLoading}
                  variant="outline"
                  className="w-full"
                >
                  {testLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Test...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Send Test Campaign
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Send Final Campaign */}
              <div className="space-y-3">
                <div className="text-center">
                  <h4 className="text-lg font-medium">Ready to Send?</h4>
                  <p className="text-sm text-muted-foreground">
                    This will send the campaign to {getTotalSubscribers().toLocaleString()} subscribers
                  </p>
                </div>
                <Button
                  onClick={handleSendCampaign}
                  disabled={sendLoading}
                  className="w-full"
                  size="lg"
                  variant={campaign.campaignStatus === 'test_sent' ? 'default' : 'outline'}
                >
                  {sendLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Campaign...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Campaign to All Subscribers
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {campaign.campaignStatus === 'sent' && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Campaign Sent Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Your campaign has been sent to {getTotalSubscribers().toLocaleString()} subscribers.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}