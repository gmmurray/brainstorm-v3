import { gql } from '@apollo/client';

export const GET_LIMITED_TEMPLATES_QUERY = gql`
  query Templates($limit: Int) {
    templates(limit: $limit) {
      id
      userId
      name
      fields {
        name
        type
      }
    }
  }
`;

export const GET_TEMPLATES_QUERY = gql`
  query Templates {
    templates {
      id
      userId
      name
      fields {
        name
        type
      }
    }
  }
`;

export const GET_TEMPLATE_QUERY = gql`
  query Template($templateId: ID!) {
    template(id: $templateId) {
      id
      userId
      name
      fields {
        name
        type
      }
    }
  }
`;
