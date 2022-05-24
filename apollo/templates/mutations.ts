import { gql } from '@apollo/client';

export const CREATE_TEMPLATE_MUTATION = gql`
  mutation CreateTemplate($template: TemplateCreateInput!) {
    createTemplate(template: $template) {
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

export const UPDATE_TEMPLATE_MUTATION = gql`
  mutation UpdateTemplate(
    $updateTemplateId: ID!
    $template: TemplateUpdateInput!
  ) {
    updateTemplate(id: $updateTemplateId, template: $template) {
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

export const DELETE_TEMPLATE_MUTATION = gql`
  mutation DeleteTemplate($deleteTemplateId: ID!) {
    deleteTemplate(id: $deleteTemplateId)
  }
`;
