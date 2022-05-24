import { ApolloClient, InMemoryCache } from '@apollo/client';

const baseUri = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export const apolloClient = new ApolloClient({
  uri: `${baseUri}/api/graphql`,
  cache: new InMemoryCache(),
});
