'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Send,
  TestTube,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
  Mail,
  RefreshCw
} from 'lucide-react';
import { useDedicatedBuilderStore } from '@/store/dedicated-builder-store';
import { useBrevoLists, useBrevoSegments, type BrevoList, type BrevoSegment } from '../hooks';
import { CREATE_DEDICATED_CAMPAIGN, UPDATE_DEDICATED_CAMPAIGN } from '@/lib/graphql/dedicated';
import { SEND_TEST_CAMPAIGN } from '@/lib/graphql/brevo-campaigns';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedCampaignPanelProps {
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

export function DedicatedCampaignPanel({ dedicated }: DedicatedCampaignPanelProps) {
  const {
    settings,
    generatedHtml,
    campaign,
    setSelectedBrevoLists,
    setSelectedBrevoSegments,
    setCampaignId,
    setCampaignStatus,
    setCampaignError,
    clearCampaignError
  } = useDedicatedBuilderStore();

  const { lists, loading: listsLoading } = useBrevoLists();
  const { segments, loading: segmentsLoading } = useBrevoSegments();

  const [testEmails, setTestEmails] = useState('');
  const [scheduleNow, setScheduleNow] = useState(false);

  // Mutations
  const [createCampaignMutation, { loading: createLoading }] = useMutation(CREATE_DEDICATED_CAMPAIGN);
  const [updateCampaignMutation, { loading: updateLoading }] = useMutation(UPDATE_DEDICATED_CAMPAIGN);
  const [sendTestMutation, { loading: testLoading }] = useMutation(SEND_TEST_CAMPAIGN);

  // Validation
  const isSendDateValid = () => {
    if (!dedicated.sendDate) return false;
    const sendDate = new Date(dedicated.sendDate);
    const now = new Date();
    return sendDate > now;
  };

  const isConfigurationValid = () => {
    const hasListsOrSegments =
      (settings.selectedBrevoLists?.length > 0) ||
      (settings.selectedBrevoSegments?.length > 0);

    // Basic requirements always needed
    const basicValid = (
      validateDedicatedForEmail(dedicated) &&
      hasListsOrSegments &&
      generatedHtml !== null
    );

    // If scheduling, send date must be valid
    // If creating as draft, send date validation not required
    if (scheduleNow) {
      return basicValid && isSendDateValid();
    }

    return basicValid;
  };

  const getSelectedListsInfo = () => {
    return lists.filter((list: BrevoList) => settings.selectedBrevoLists?.includes(list.id));
  };

  const getTotalSubscribers = () => {
    return getSelectedListsInfo().reduce((total: number, list: BrevoList) => total + list.uniqueSubscribers, 0);
  };

  // Handlers
  const handleCreateCampaign = async () => {
    if (!isConfigurationValid()) {
      setCampaignError('Please complete all required settings before creating campaign');
      return;
    }

    clearCampaignError();

    try {
      // Build input object conditionally
      const createInput: {
        dedicatedId: string;
        subject: string;
        htmlContent: string;
        listIds: string[];
        segmentIds: string[];
        exclusionListIds: string[];
        sender: { name: string; email: string };
        scheduledAt?: string;
      } = {
        dedicatedId: dedicated.id,
        subject: dedicated.subject,
        htmlContent: generatedHtml || '',
        listIds: settings.selectedBrevoLists || [],
        segmentIds: settings.selectedBrevoSegments || [],
        exclusionListIds: settings.exclusionListIds || [],
        sender: {
          name: 'CultureOwl',
          email: 'no-reply@cultureowl.com'
        }
      };

      // Only include scheduledAt if user wants to schedule
      if (scheduleNow && dedicated.sendDate) {
        createInput.scheduledAt = dedicated.sendDate;
      }

      const result = await createCampaignMutation({
        variables: {
          createDedicatedCampaignInput: createInput
        }
      });

      if (result?.data?.createDedicatedCampaign?.success) {
        const campaignId = result.data.createDedicatedCampaign.campaignId;
        setCampaignId(campaignId);
        setCampaignStatus('created');

        const successMessage = scheduleNow
          ? 'Campaign created and scheduled successfully'
          : 'Campaign created as draft successfully';

        toast.success(successMessage, {
          description: `Campaign ID: ${campaignId}`
        });
      } else {
        const errorMsg = result?.data?.createDedicatedCampaign?.message || 'Failed to create campaign';
        setCampaignError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'An error occurred while creating the campaign';
      setCampaignError(errorMsg);
      toast.error(errorMsg);
      console.error('Create campaign error:', error);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!isConfigurationValid()) {
      setCampaignError('Please complete all required settings before updating campaign');
      return;
    }

    clearCampaignError();

    try {
      const result = await updateCampaignMutation({
        variables: {
          updateDedicatedCampaignInput: {
            dedicatedId: dedicated.id,
            subject: dedicated.subject,
            htmlContent: generatedHtml || undefined,
            listIds: settings.selectedBrevoLists || [],
            segmentIds: settings.selectedBrevoSegments || [],
            scheduledAt: dedicated.sendDate
          }
        }
      });

      if (result?.data?.updateDedicatedCampaign?.success) {
        toast.success('Campaign updated successfully');
      } else {
        const errorMsg = result?.data?.updateDedicatedCampaign?.message || 'Failed to update campaign';
        setCampaignError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'An error occurred while updating the campaign';
      setCampaignError(errorMsg);
      toast.error(errorMsg);
      console.error('Update campaign error:', error);
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
      const result = await sendTestMutation({
        variables: {
          input: {
            campaignId: campaign.campaignId,
            testEmails: emails
          }
        }
      });

      if (result?.data?.sendTestCampaign?.success) {
        setCampaignStatus('test_sent');
        toast.success('Test email sent successfully', {
          description: `Sent to ${emails.length} recipient${emails.length > 1 ? 's' : ''}`
        });
        setTestEmails('');
      } else {
        const errorMsg = result?.data?.sendTestCampaign?.message || 'Failed to send test campaign';
        setCampaignError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'An error occurred while sending test campaign';
      setCampaignError(errorMsg);
      toast.error(errorMsg);
      console.error('Send test error:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Send className="h-6 w-6" />
          Campaign Management
        </h2>
        <p className="text-muted-foreground mt-1">
          Create and send your dedicated campaign to Brevo subscribers
        </p>
      </div>

      {/* Send Date Warning - Only show if user wants to schedule and date is invalid */}
      {scheduleNow && !isSendDateValid() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Invalid Send Date:</strong> The scheduled send date ({new Date(dedicated.sendDate).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}) is in the past. Please update the send date to a future date before scheduling the campaign.
          </AlertDescription>
        </Alert>
      )}

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
              <p className="text-sm text-muted-foreground">{dedicated.subject}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Sender</Label>
              <p className="text-sm text-muted-foreground">
                CultureOwl (no-reply@cultureowl.com)
              </p>
            </div>
          </div>

          <Separator />

          {/* Lists Selection */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Brevo Lists *
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select at least one list to send the campaign to
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
              {listsLoading ? (
                <p className="text-sm text-muted-foreground">Loading lists...</p>
              ) : lists.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lists available</p>
              ) : (
                lists.map((list: BrevoList) => (
                  <div key={list.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={settings.selectedBrevoLists?.includes(list.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = settings.selectedBrevoLists || [];
                        const newValue = checked
                          ? [...currentValue, list.id]
                          : currentValue.filter((id) => id !== list.id);
                        setSelectedBrevoLists(newValue);
                      }}
                    />
                    <div className="flex-1 leading-none">
                      <Label className="text-sm font-medium cursor-pointer">
                        {list.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {list.uniqueSubscribers.toLocaleString()} subscribers
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Segments Selection */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Brevo Segments (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Optionally select segments to further refine your audience
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
              {segmentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading segments...</p>
              ) : segments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No segments available</p>
              ) : (
                segments.map((segment: BrevoSegment) => (
                  <div key={segment.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={settings.selectedBrevoSegments?.includes(segment.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = settings.selectedBrevoSegments || [];
                        const newValue = checked
                          ? [...currentValue, segment.id]
                          : currentValue.filter((id) => id !== segment.id);
                        setSelectedBrevoSegments(newValue);
                      }}
                    />
                    <div className="flex-1 leading-none">
                      <Label className="text-sm font-medium cursor-pointer">
                        {segment.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {segment.categoryName}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Campaign Summary */}
          {isConfigurationValid() && (
            <>
              <Separator />
              <div className="rounded-lg border p-4 bg-muted space-y-2">
                <h4 className="font-medium">Campaign Summary</h4>
                <div className="text-sm space-y-1">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Selected Lists:</span>
                    <span className="font-medium">{settings.selectedBrevoLists?.length || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Selected Segments:</span>
                    <span className="font-medium">{settings.selectedBrevoSegments?.length || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Total Subscribers:</span>
                    <span className="font-medium text-primary">{getTotalSubscribers().toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Campaign Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Schedule Option */}
          {campaign.campaignStatus === 'not_created' && (
            <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/50">
              <Checkbox
                id="schedule-now"
                checked={scheduleNow}
                onCheckedChange={(checked) => setScheduleNow(checked as boolean)}
              />
              <div className="flex-1 leading-none">
                <Label
                  htmlFor="schedule-now"
                  className="text-sm font-medium cursor-pointer"
                >
                  Schedule campaign for {new Date(dedicated.sendDate).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </Label>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {scheduleNow
                    ? 'Campaign will be automatically sent at the scheduled time'
                    : 'Campaign will be created as draft (you can schedule it later from Brevo)'}
                </p>
              </div>
            </div>
          )}

          {/* Create/Update Campaign */}
          {campaign.campaignStatus === 'not_created' ? (
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
          ) : (
            <Button
              onClick={handleUpdateCampaign}
              disabled={!isConfigurationValid() || updateLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {updateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Campaign...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Campaign
                </>
              )}
            </Button>
          )}

          {/* Test Email */}
          {campaign.campaignStatus !== 'not_created' && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Send Test Email</Label>
                <Textarea
                  placeholder="Enter test email addresses (one per line)"
                  value={testEmails}
                  onChange={(e) => setTestEmails(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleSendTest}
                  disabled={!campaign.campaignId || testLoading}
                  variant="secondary"
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
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Validation Message */}
          {!isConfigurationValid() && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please ensure:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {!validateDedicatedForEmail(dedicated) && (
                    <li>Dedicated has a valid image uploaded</li>
                  )}
                  {!(settings.selectedBrevoLists?.length > 0 || settings.selectedBrevoSegments?.length > 0) && (
                    <li>At least one Brevo list or segment is selected</li>
                  )}
                  {scheduleNow && !isSendDateValid() && (
                    <li>Send date must be in the future when scheduling (current send date is in the past)</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
