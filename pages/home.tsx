import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { NextPage } from 'next';

const Home: NextPage = () => {
  const { user } = useUser();
  return (
    <div>
      <h1 className="display-1">home</h1>
      <p>{user!.sub}</p>
      <a href="/api/auth/logout">logout</a>
    </div>
  );
};

export default withPageAuthRequired(Home);
