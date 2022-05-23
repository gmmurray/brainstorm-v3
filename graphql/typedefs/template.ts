const types = /* GraphQL */ `
  type TemplateField {
    name: String
    type: TemplateFieldType
  }

  input TemplateFieldInput {
    name: String
    type: TemplateFieldType
  }

  type Template {
    id: ID!
    userId: String!
    name: String!
    fields: [TemplateField]
  }

  # inputs
  input TemplateCreateInput {
    userId: String!
    name: String!
    fields: [TemplateFieldInput]
  }

  input TemplateUpdateInput {
    name: String!
    fields: [TemplateFieldInput]
  }
`;

export default types;
