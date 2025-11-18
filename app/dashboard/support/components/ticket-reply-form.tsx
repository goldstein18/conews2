"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketComments } from "../hooks";
import {
  addCommentSchema,
  defaultAddCommentValues,
  type AddCommentFormData,
} from "../lib/validations";

interface TicketReplyFormProps {
  ticketId: string;
  onSuccess?: () => void;
  canAddInternalNotes?: boolean;
}

export function TicketReplyForm({
  ticketId,
  onSuccess,
  canAddInternalNotes = false,
}: TicketReplyFormProps) {
  const { addComment, loading } = useTicketComments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      ...defaultAddCommentValues,
      ticketId,
    },
  });

  const isInternal = form.watch('isInternal');

  const onSubmit = async (data: AddCommentFormData) => {
    try {
      setIsSubmitting(true);
      await addComment(data);

      // Reset form
      form.reset({
        ticketId,
        content: '',
        isInternal: false,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isInternal ? (
            <>
              <Lock className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-600">Add Internal Note</span>
            </>
          ) : (
            'Add Reply'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Comment Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isInternal ? 'Internal Note' : 'Your Reply'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isInternal
                          ? "Add a note that only staff can see..."
                          : "Type your reply..."
                      }
                      className={`min-h-[120px] ${
                        isInternal ? 'border-yellow-300 bg-yellow-50' : ''
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {isInternal
                      ? 'This note will only be visible to support staff'
                      : 'Your reply will be visible to the ticket creator and support staff'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Internal Note Toggle (Staff Only) */}
            {canAddInternalNotes && (
              <FormField
                control={form.control}
                name="isInternal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-gray-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Internal Note
                      </FormLabel>
                      <FormDescription>
                        Only visible to support staff members
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className={isInternal ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                {(isSubmitting || loading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isInternal ? 'Add Internal Note' : 'Send Reply'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
