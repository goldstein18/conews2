import * as Sentry from "@sentry/nextjs";

export const captureAPIError = (error: unknown, context?: Record<string, unknown>) => {
  Sentry.withScope((scope) => {
    scope.setTag("errorType", "api");
    if (context) {
      scope.setContext("apiError", context);
    }
    Sentry.captureException(error);
  });
};

export const captureGraphQLError = (error: unknown, query?: string, variables?: unknown) => {
  Sentry.withScope((scope) => {
    scope.setTag("errorType", "graphql");
    scope.setContext("graphqlError", {
      query,
      variables,
      error: error instanceof Error ? error.message : String(error),
    });
    Sentry.captureException(error);
  });
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, unknown>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    timestamp: Date.now() / 1000,
  });
};

export const setUserContext = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.role,
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};