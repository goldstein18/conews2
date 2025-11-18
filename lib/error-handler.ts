import { ApolloError } from "@apollo/client";

/**
 * Maps GraphQL/Apollo errors to user-friendly messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApolloError) {
    // Check for specific GraphQL errors
    const graphQLError = error.graphQLErrors?.[0];
    const networkError = error.networkError;
    
    if (graphQLError) {
      const message = graphQLError.message.toLowerCase();
      
      // Map specific error messages to user-friendly ones
      switch (true) {
        case message.includes('invalid credentials'):
        case message.includes('unauthorized'):
        case message.includes('wrong password'):
        case message.includes('incorrect password'):
        case message.includes('authentication failed'):
        case message.includes('login failed'):
          return 'Email or password is incorrect';
          
        case message.includes('user not found'):
        case message.includes('account not found'):
          return 'No account found with this email address';
          
        case message.includes('account disabled'):
        case message.includes('account suspended'):
          return 'Your account has been disabled. Please contact support';
          
        case message.includes('email not verified'):
          return 'Please verify your email address before signing in';
          
        case message.includes('too many attempts'):
        case message.includes('rate limit'):
          return 'Too many login attempts. Please try again later';
          
        default:
          return graphQLError.message;
      }
    }
    
    if (networkError) {
      // Handle network errors
      if ('statusCode' in networkError) {
        switch (networkError.statusCode) {
          case 401:
            return 'Invalid credentials';
          case 403:
            return 'Access denied';
          case 429:
            return 'Too many requests. Please try again later';
          case 500:
            return 'Server error. Please try again later';
          default:
            return 'Network error. Please check your connection';
        }
      }
      return 'Network error. Please check your connection';
    }
    
    // Fallback for other Apollo errors
    return error.message || 'An unexpected error occurred';
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown errors
  return 'An unexpected error occurred';
}