import { Container } from 'react-bootstrap';
import Link from 'next/link';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'login';
    }
  }, []);

  if (user) {
    router.push('/home');
  }

  return (
    <Container>
      <h3>
        login <Link href="/api/auth/login">here</Link>
      </h3>
    </Container>
  );
};

export default Home;
