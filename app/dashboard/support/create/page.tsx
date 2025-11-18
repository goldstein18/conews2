"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";
import { TicketCreateForm } from "../components/ticket-create-form";

export default function CreateTicketPage() {
  return (
    <ProtectedPage {...ProtectionPresets.AuditLogs}>
      <CreateTicketPageContent />
    </ProtectedPage>
  );
}

function CreateTicketPageContent() {
  const router = useRouter();

  const handleSuccess = (ticketId: string) => {
    router.push(`/dashboard/support/${ticketId}`);
  };

  const handleCancel = () => {
    router.push('/dashboard/support');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/support')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create Support Ticket</h1>
        <p className="text-sm text-gray-600 mt-1">
          Describe your issue and our support team will get back to you as soon as possible
        </p>
      </div>

      {/* Form */}
      <TicketCreateForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
