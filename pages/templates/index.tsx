import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Templates = () => {
  return <div>Templates</div>;
};

export default withPageAuthRequired(Templates);
