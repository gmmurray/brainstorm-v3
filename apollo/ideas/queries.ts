import { gql } from '@apollo/client';

export const GET_IDEAS_QUERY = gql`
  query Ideas($limit: Int) {
    ideas(limit: $limit) {
      id
      userId
      name
      template {
        fields {
          name
          type
        }
        id
        userId
        name
      }
      fields {
        name
        type
        value
      }
    }
  }
`;

export const GET_IDEA_QUERY = gql`
  query Idea($ideaId: ID!) {
    idea(id: $ideaId) {
      id
      userId
      name
      template {
        id
        userId
        name
        fields {
          name
          type
        }
      }
      fields {
        name
        type
        value
      }
    }
  }
`;
