import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_NOTES, ADD_COMPANY_NOTE, UPDATE_COMPANY_NOTES } from "@/lib/graphql/company-notes";
import { GET_COMPANY_DETAIL } from "@/lib/graphql/members";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

interface AddNoteInput {
  note: string;
  author?: string; // Optional, uses current user if not provided
}

interface CompanyNotesHookProps {
  companyId: string;
}

// Parse notes string into structured array
export function parseNotes(notesString: string): Array<{
  id: string;
  content: string;
  author: string;
  createdAt: string;
}> {
  if (!notesString || notesString.trim() === '') {
    return [];
  }

  // Split notes by double line breaks (each note is separated by \n\n)
  const noteBlocks = notesString.split('\n\n').filter(block => block.trim() !== '');
  
  const parsedNotes = [];
  
  for (let i = 0; i < noteBlocks.length; i += 2) {
    const content = noteBlocks[i]?.trim();
    const metadata = noteBlocks[i + 1]?.trim();
    
    if (content && metadata) {
      // Parse metadata line like "Admin (Mike Wilson) 2024-02-20"
      const metadataMatch = metadata.match(/^(.+?)\s+(\d{4}-\d{2}-\d{2})$/);
      
      if (metadataMatch) {
        const [, author, date] = metadataMatch;
        parsedNotes.push({
          id: `note-${i / 2}`,
          content,
          author,
          createdAt: date
        });
      }
    }
  }
  
  return parsedNotes;
}

export function useCompanyNotes({ companyId }: CompanyNotesHookProps) {
  const [addingNote, setAddingNote] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);

  // Fetch company notes
  const { data, loading, error, refetch } = useQuery(GET_COMPANY_NOTES, {
    variables: { companyId },
    skip: !companyId,
    errorPolicy: "all",
  });

  // Add note mutation
  const [addNoteMutation] = useMutation(ADD_COMPANY_NOTE, {
    // Refetch notes and company detail after adding
    refetchQueries: [
      {
        query: GET_COMPANY_NOTES,
        variables: { companyId }
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  // Update notes mutation
  const [updateNotesMutation] = useMutation(UPDATE_COMPANY_NOTES, {
    // Refetch notes and company detail after updating
    refetchQueries: [
      {
        query: GET_COMPANY_NOTES,
        variables: { companyId }
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  const addNote = async (noteInput: AddNoteInput) => {
    if (!noteInput.note.trim()) {
      showErrorToast("Note content cannot be empty");
      return;
    }

    setAddingNote(true);
    
    try {
      const result = await addNoteMutation({
        variables: {
          companyId,
          note: noteInput.note,
          author: noteInput.author
        },
      });

      if (result.data?.addCompanyNote) {
        showSuccessToast("Note added successfully!");
        return true;
      }
    } catch (error: unknown) {
      console.error('Add note error:', error);
      let errorMessage = 'Failed to add note';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setAddingNote(false);
    }

    return false;
  };

  const updateNotes = async (newNotesString: string) => {
    if (!newNotesString.trim()) {
      showErrorToast("Notes cannot be empty");
      return false;
    }

    setUpdatingNotes(true);
    
    try {
      const result = await updateNotesMutation({
        variables: {
          companyId,
          notes: newNotesString.trim()
        },
      });

      if (result.data?.updateCompanyNotes) {
        showSuccessToast("Notes updated successfully!");
        return true;
      }
    } catch (error: unknown) {
      console.error('Update notes error:', error);
      let errorMessage = 'Failed to update notes';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setUpdatingNotes(false);
    }

    return false;
  };

  // Parse the raw notes string into structured data
  const parsedNotes = data?.getCompanyNotes ? parseNotes(data.getCompanyNotes) : [];

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    notes: parsedNotes,
    rawNotes: data?.getCompanyNotes || '',
    loading,
    error: displayError,
    addingNote,
    updatingNotes,
    addNote,
    updateNotes,
    refetch,
  };
}