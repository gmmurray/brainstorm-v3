import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Ideas = () => {
  return <div>Ideas</div>;
};

export default withPageAuthRequired(Ideas);
