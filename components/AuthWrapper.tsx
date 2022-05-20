import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import Layout from './Layout';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

const AuthWrapper: FunctionComponentWithProps = ({ children }) => {
  const { user } = useUser();

  if (user) {
    return <Layout>{children}</Layout>;
  } else {
    return <>{children}</>;
  }
};

export default AuthWrapper;
