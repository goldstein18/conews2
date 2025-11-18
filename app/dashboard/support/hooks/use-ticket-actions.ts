import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_TICKET,
  UPDATE_TICKET,
  UPDATE_TICKET_STATUS,
  ASSIGN_TICKET,
  DELETE_TICKET,
  GET_TICKETS_PAGINATED,
  GET_TICKET,
} from '@/lib/graphql/tickets';
import {
  CreateTicketInput,
  UpdateTicketInput,
  UpdateTicketStatusInput,
  AssignTicketInput,
  CreateTicketResponse,
  UpdateTicketResponse,
  UpdateTicketStatusResponse,
  AssignTicketResponse,
  DeleteTicketResponse,
} from '@/types/ticket';

export function useTicketActions() {
  // Create ticket mutation
  const [createTicketMutation, { loading: creating }] = useMutation<CreateTicketResponse>(CREATE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
    onCompleted: () => {
      toast.success('Ticket created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });

  // Update ticket mutation
  const [updateTicketMutation, { loading: updating }] = useMutation<UpdateTicketResponse>(UPDATE_TICKET, {
    onCompleted: () => {
      toast.success('Ticket updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update ticket: ${error.message}`);
    },
  });

  // Update ticket status mutation
  const [updateTicketStatusMutation, { loading: updatingStatus }] = useMutation<UpdateTicketStatusResponse>(
    UPDATE_TICKET_STATUS,
    {
      refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
      onCompleted: () => {
        toast.success('Ticket status updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update status: ${error.message}`);
      },
    }
  );

  // Assign ticket mutation
  const [assignTicketMutation, { loading: assigning }] = useMutation<AssignTicketResponse>(ASSIGN_TICKET, {
    refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
    onCompleted: () => {
      toast.success('Ticket assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign ticket: ${error.message}`);
    },
  });

  // Delete ticket mutation
  const [deleteTicketMutation, { loading: deleting }] = useMutation<DeleteTicketResponse>(DELETE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS_PAGINATED }],
    onCompleted: () => {
      toast.success('Ticket deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete ticket: ${error.message}`);
    },
  });

  // Wrapper functions
  const createTicket = async (input: CreateTicketInput) => {
    const result = await createTicketMutation({
      variables: { createTicketInput: input },
    });
    return result.data?.createTicket;
  };

  const updateTicket = async (input: UpdateTicketInput) => {
    const result = await updateTicketMutation({
      variables: { updateTicketInput: input },
      refetchQueries: [
        {
          query: GET_TICKET,
          variables: { id: input.id },
        },
      ],
    });
    return result.data?.updateTicket;
  };

  const updateTicketStatus = async (input: UpdateTicketStatusInput) => {
    const result = await updateTicketStatusMutation({
      variables: { updateTicketStatusInput: input },
      refetchQueries: [
        {
          query: GET_TICKET,
          variables: { id: input.ticketId },
        },
      ],
    });
    return result.data?.updateTicketStatus;
  };

  const assignTicket = async (input: AssignTicketInput) => {
    const result = await assignTicketMutation({
      variables: { assignTicketInput: input },
      refetchQueries: [
        {
          query: GET_TICKET,
          variables: { id: input.ticketId },
        },
      ],
    });
    return result.data?.assignTicket;
  };

  const deleteTicket = async (id: string) => {
    const result = await deleteTicketMutation({
      variables: { id },
    });
    return result.data?.deleteTicket;
  };

  return {
    createTicket,
    updateTicket,
    updateTicketStatus,
    assignTicket,
    deleteTicket,
    loading: creating || updating || updatingStatus || assigning || deleting,
    creating,
    updating,
    updatingStatus,
    assigning,
    deleting,
  };
}
