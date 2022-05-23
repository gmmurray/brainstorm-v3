import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import AppWrapper from '../lib/components/AppWrapper';
import AuthWrapper from '../lib/components/AuthWrapper';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AppWrapper>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </AppWrapper>
    </UserProvider>
  );
}

export default MyApp;
