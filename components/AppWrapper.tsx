import { Container, Spinner } from 'react-bootstrap';

import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';

const AppWrapper: FunctionComponentWithProps = ({ children }) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <Container className="auth-loader-container">
        <Spinner animation="border" />
      </Container>
    );
  }

  return <>{children}</>;
};

export default AppWrapper;
