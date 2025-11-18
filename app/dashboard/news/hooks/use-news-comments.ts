import { useQuery, useMutation } from "@apollo/client";
import { GET_NEWS_COMMENTS, ADD_NEWS_COMMENT, DELETE_NEWS_COMMENT } from "@/lib/graphql/news";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

// Placeholder types for comments (not yet implemented in API)
interface NewsComment {
  id: string;
  content: string;
  createdAt: string;
}

interface NewsCommentsResponse {
  newsComments: NewsComment[];
}

interface NewsCommentsVariables {
  newsId: string;
}

interface UseNewsCommentsProps {
  newsId: string;
}

export function useNewsComments({ newsId }: UseNewsCommentsProps) {
  const { data, loading, error, refetch } = useQuery<NewsCommentsResponse, NewsCommentsVariables>(
    GET_NEWS_COMMENTS,
    {
      variables: { newsId },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      skip: !newsId,
    }
  );

  const [addCommentMutation] = useMutation(ADD_NEWS_COMMENT);
  const [deleteCommentMutation] = useMutation(DELETE_NEWS_COMMENT);

  const addComment = async (content: string) => {
    try {
      await addCommentMutation({
        variables: {
          newsId,
          content,
        },
        refetchQueries: [{ query: GET_NEWS_COMMENTS, variables: { newsId } }],
      });
      showSuccessToast("Comment added successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add comment";
      showErrorToast(errorMessage);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation({
        variables: { commentId },
        refetchQueries: [{ query: GET_NEWS_COMMENTS, variables: { newsId } }],
      });
      showSuccessToast("Comment deleted successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete comment";
      showErrorToast(errorMessage);
    }
  };

  return {
    comments: data?.newsComments || [],
    loading,
    error,
    addComment,
    deleteComment,
    refetch,
  };
}