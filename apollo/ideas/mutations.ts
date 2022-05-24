import { gql } from '@apollo/client';

export const CREATE_IDEA_MUTATION = gql`
  mutation CreateIdea($idea: IdeaCreateInput!) {
    createIdea(idea: $idea) {
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

export const UPDATE_IDEA_MUTATION = gql`
  mutation UpdateIdea($updateIdeaId: ID!, $idea: IdeaUpdateInput!) {
    updateIdea(id: $updateIdeaId, idea: $idea) {
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

export const DELETE_IDEA_MUTATION = gql`
  mutation DeleteIdea($deleteIdeaId: ID!) {
    deleteIdea(id: $deleteIdeaId)
  }
`;
