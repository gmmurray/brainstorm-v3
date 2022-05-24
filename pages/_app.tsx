import '../styles/globals.scss';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import AppWrapper from '../lib/components/AppWrapper';
import AuthWrapper from '../lib/components/AuthWrapper';
import { UserProvider } from '@auth0/nextjs-auth0';
import { apolloClient } from '../apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <AppWrapper>
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        </AppWrapper>
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;
