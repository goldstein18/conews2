'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Settings, Users, Mail, Loader2, RefreshCw } from 'lucide-react';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import { useBrevoLists, useBrevoSegments, type BrevoList, type BrevoSegment } from '../hooks/use-brevo-campaigns';


export function EscoopSettingsPanel() {
  const {
    settings,
    updateSubjectLine,
    updateNewsletterName,
    updateBrevoLists,
    updateBrevoSegments,
    updateProofRecipients
  } = useEscoopBuilderStore();
  const [activeTab, setActiveTab] = useState('general');
  const [proofEmails, setProofEmails] = useState('');

  // Fetch Brevo lists and segments
  const { lists, loading: listsLoading, error: listsError, refetch: refetchLists } = useBrevoLists();
  const { segments, loading: segmentsLoading, error: segmentsError, refetch: refetchSegments } = useBrevoSegments();

  // Initialize proof emails from store
  useEffect(() => {
    setProofEmails(settings.proofRecipients?.join('\n') || '');
  }, [settings.proofRecipients]);

  const handleSubjectLineChange = (value: string) => {
    if (value.length <= 60) {
      updateSubjectLine(value);
    }
  };

  const handleBrevoListToggle = (listId: string, checked: boolean) => {
    const currentLists = settings.selectedBrevoLists || [];
    const updatedLists = checked
      ? [...currentLists, listId]
      : currentLists.filter(id => id !== listId);
    updateBrevoLists(updatedLists);
  };

  const handleBrevoSegmentToggle = (segmentId: string, checked: boolean) => {
    const currentSegments = settings.selectedBrevoSegments || [];
    const updatedSegments = checked
      ? [...currentSegments, segmentId]
      : currentSegments.filter(id => id !== segmentId);
    updateBrevoSegments(updatedSegments);
  };

  const handleProofEmailsChange = (value: string) => {
    setProofEmails(value);
    const emails = value
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes('@'));
    updateProofRecipients(emails);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '\n' + value.substring(end);
      setProofEmails(newValue);

      // Update cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);

      handleProofEmailsChange(newValue);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="recipients">
            <Users className="h-4 w-4 mr-2" />
            Recipients
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Mail className="h-4 w-4 mr-2" />
            Delivery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="flex-1 overflow-auto space-y-4">
          {/* Newsletter Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Newsletter Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject-line">Email Subject Line</Label>
                <Input
                  id="subject-line"
                  placeholder="Enter email subject line..."
                  value={settings.subjectLine || ''}
                  onChange={(e) => handleSubjectLineChange(e.target.value)}
                  maxLength={60}
                  className="h-9"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(settings.subjectLine || '').length}/60 characters
                </div>
              </div>

              <div>
                <Label htmlFor="newsletter-name">Newsletter Name</Label>
                <Input
                  id="newsletter-name"
                  placeholder="eScoop Newsletter"
                  value={settings.newsletterName || ''}
                  onChange={(e) => updateNewsletterName(e.target.value)}
                />
              </div>

              <div>
                <Label>From Name</Label>
                <p className="text-sm text-muted-foreground mt-1">CultureOwl</p>
              </div>

              <div>
                <Label>From Email</Label>
                <p className="text-sm text-muted-foreground mt-1">no-reply@cultureowl.com</p>
              </div>

            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="recipients" className="flex-1 overflow-auto space-y-4">
          {/* Brevo Lists */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Brevo Lists</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select subscriber lists for this newsletter
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchLists();
                    refetchSegments();
                  }}
                  disabled={listsLoading || segmentsLoading}
                >
                  {(listsLoading || segmentsLoading) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {listsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading lists...</span>
                </div>
              ) : listsError ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Failed to load Brevo lists</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      refetchLists();
                      refetchSegments();
                    }}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : lists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No lists found
                </div>
              ) : (
                lists.map((list: BrevoList) => (
                  <div key={list.id} className="flex items-center space-x-3 p-3 border rounded">
                    <Checkbox
                      id={`list-${list.id}`}
                      checked={settings.selectedBrevoLists?.includes(list.id) || false}
                      onCheckedChange={(checked) =>
                        handleBrevoListToggle(list.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <label htmlFor={`list-${list.id}`} className="font-medium cursor-pointer">
                        {list.name}
                      </label>
                      <div className="text-sm text-muted-foreground">
                        {list.uniqueSubscribers.toLocaleString()} subscribers
                        {list.totalBlacklisted > 0 && (
                          <span className="ml-2">
                            · {list.totalBlacklisted} blacklisted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Brevo Segments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Brevo Segments</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select dynamic segments for this newsletter
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {segmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading segments...</span>
                </div>
              ) : segmentsError ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Failed to load Brevo segments</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      refetchLists();
                      refetchSegments();
                    }}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : segments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No segments found
                </div>
              ) : (
                segments.map((segment: BrevoSegment) => (
                  <div key={segment.id} className="flex items-center space-x-3 p-3 border rounded">
                    <Checkbox
                      id={`segment-${segment.id}`}
                      checked={settings.selectedBrevoSegments?.includes(segment.id) || false}
                      onCheckedChange={(checked) =>
                        handleBrevoSegmentToggle(segment.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <label htmlFor={`segment-${segment.id}`} className="font-medium cursor-pointer">
                        {segment.name}
                      </label>
                      <div className="text-sm text-muted-foreground">
                        Category: {segment.categoryName}
                        <span className="ml-2">
                          · Created: {new Date(segment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Segmentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Segmentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Location Filter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    <SelectItem value="miami">Miami-Dade only</SelectItem>
                    <SelectItem value="broward">Broward only</SelectItem>
                    <SelectItem value="palm-beach">Palm Beach+ only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subscription Date</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All subscribers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subscribers</SelectItem>
                    <SelectItem value="new">New subscribers (last 30 days)</SelectItem>
                    <SelectItem value="active">Active subscribers only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="flex-1 overflow-auto space-y-4">
          {/* Test Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Email Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure email addresses to receive test campaigns
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-emails">Test Email Addresses</Label>
                <Textarea
                  id="test-emails"
                  placeholder="Enter email addresses, one per line&#10;example@domain.com&#10;test@company.com"
                  rows={4}
                  value={proofEmails}
                  onChange={(e) => handleProofEmailsChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {settings.proofRecipients?.length || 0} email addresses configured
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  );
}