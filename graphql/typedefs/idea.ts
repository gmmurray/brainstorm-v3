const types = /* GraphQL */ `
  type IdeaField {
    name: String
    type: TemplateFieldType
    value: String
  }

  input IdeaFieldInput {
    name: String
    type: TemplateFieldType
    value: String
  }

  type Idea {
    id: ID!
    userId: String
    name: String
    template: Template
    fields: [IdeaField]
  }

  input IdeaCreateTemplateInput {
    id: ID!
    userId: String!
    name: String!
    fields: [TemplateFieldInput]
  }

  # inputs
  input IdeaCreateInput {
    userId: String!
    name: String!
    template: String!
    fields: [IdeaFieldInput]
  }

  input IdeaUpdateInput {
    name: String!
    template: IdeaCreateTemplateInput
    fields: [IdeaFieldInput]
  }
`;

export default types;
