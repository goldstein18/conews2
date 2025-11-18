import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { PermissionsAPI } from './services/permissions-api';

const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin', // Include cookies
  headers: {
    'content-type': 'application/json',
  },
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // Only log GraphQL errors in development
    if (process.env.NODE_ENV === 'development') {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
  }

  if (networkError) {
    // Only log network errors in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Network error]: ${networkError}`);
    }
  }
});

const authLink = setContext((_, { headers }) => {
  // No need to manually add authorization header since BFF handles tokens via httpOnly cookies
  return {
    headers: {
      ...headers,
      'content-type': 'application/json',
    }
  }
});

const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    httpLink,
  ]),
  cache: new InMemoryCache({
    resultCaching: false, // Disable result caching - Redis handles caching on API
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache', // Always fetch from network - Redis cache on API
    },
    query: {
      fetchPolicy: 'no-cache', // No cache for regular queries
    },
    mutate: {
      fetchPolicy: 'no-cache', // No cache for mutations
    },
  },
});

// Initialize PermissionsAPI with Apollo client
PermissionsAPI.initialize(client);

export default client;
