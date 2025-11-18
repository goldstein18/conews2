"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketActions } from "../hooks";
import {
  createTicketSchema,
  defaultCreateTicketValues,
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS,
  type CreateTicketFormData,
} from "../lib/validations";

interface TicketCreateFormProps {
  onSuccess?: (ticketId: string) => void;
  onCancel?: () => void;
}

export function TicketCreateForm({ onSuccess, onCancel }: TicketCreateFormProps) {
  const router = useRouter();
  const { createTicket, creating } = useTicketActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: defaultCreateTicketValues,
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      setIsSubmitting(true);
      const ticket = await createTicket(data);

      if (ticket) {
        if (onSuccess) {
          onSuccess(ticket.id);
        } else {
          router.push(`/dashboard/support/${ticket.id}`);
        }
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard/support');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the issue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and concise title for your support request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about your issue, including steps to reproduce if applicable..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please include as much detail as possible to help us resolve your issue quickly
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How urgent is this issue?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What type of issue is this?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || creating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || creating}
          >
            {(isSubmitting || creating) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Ticket
          </Button>
        </div>
      </form>
    </Form>
  );
}
