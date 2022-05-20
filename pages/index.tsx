import { Container } from 'react-bootstrap';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  if (user) {
    router.push('/home');
  }

  return (
    <Container>
      <h3>
        login <a href="/api/auth/login">here</a>
      </h3>
    </Container>
  );
};

export default Home;
