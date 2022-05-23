import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import Link from 'next/link';
import { NextPage } from 'next';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const { user } = useUser();
  //const [createTemplate, { data, loading, error }] = useMutation(gql`createTemplate(template: TemplateCreateInput!): Template!`)
  useEffect(() => {
    const client = new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      cache: new InMemoryCache(),
    });

    const template = {
      name: 'updatededed',
      fields: [],
    };
    // client
    //   .mutate({
    //     mutation: gql`
    //       mutation UpdateTemplate(
    //         $updateTemplateId: ID!
    //         $template: TemplateUpdateInput!
    //       ) {
    //         updateTemplate(id: $updateTemplateId, template: $template) {
    //           name
    //           id
    //         }
    //       }
    //     `,
    //     variables: { updateTemplateId: '628b099ac1e9c7cf7b8491dd', template },
    //   })
    //   .then(res => console.log(res));
    client
      .mutate({
        mutation: gql`
          mutation UpdateTemplate($deleteTemplateId: ID!) {
            deleteTemplate(id: $deleteTemplateId)
          }
        `,
        variables: { deleteTemplateId: '628b099ac1e9c7cf7b8491dd' },
      })
      .then(res => console.log(res));
  }, []);
  return (
    <div>
      <h1 className="display-1">home</h1>
      <p>{user!.sub}</p>
      <Link href="/api/auth/logout">logout</Link>
    </div>
  );
};

export default withPageAuthRequired(Home);
