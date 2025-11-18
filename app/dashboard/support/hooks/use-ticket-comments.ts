import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { ADD_TICKET_COMMENT, GET_TICKET } from '@/lib/graphql/tickets';
import { AddCommentInput, AddTicketCommentResponse } from '@/types/ticket';

export function useTicketComments() {
  const [addCommentMutation, { loading }] = useMutation<AddTicketCommentResponse>(ADD_TICKET_COMMENT, {
    onCompleted: (data) => {
      const isInternal = data.addTicketComment.isInternal;
      toast.success(isInternal ? 'Internal note added successfully' : 'Reply added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });

  const addComment = async (input: AddCommentInput) => {
    const result = await addCommentMutation({
      variables: { addCommentInput: input },
      refetchQueries: [
        {
          query: GET_TICKET,
          variables: { id: input.ticketId },
        },
      ],
    });
    return result.data?.addTicketComment;
  };

  return {
    addComment,
    loading,
  };
}
