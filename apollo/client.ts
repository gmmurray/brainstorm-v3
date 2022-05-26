import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ServerError,
  ServerParseError,
} from '@apollo/client';

import { onError } from '@apollo/client/link/error';

const baseUri = process.env.NEXT_PUBLIC_BASE_URL ?? '';

const httpLink = new HttpLink({ uri: `${baseUri}/api/graphql` });

const authLink = onError(({ networkError }) => {
  if (
    networkError &&
    (networkError as ServerParseError | ServerError)?.statusCode === 401
  ) {
    if (typeof window !== 'undefined') {
      window.location.replace(
        `/api/auth/login?returnTo=${window.location.pathname}`,
      );
    }
  }
});
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
