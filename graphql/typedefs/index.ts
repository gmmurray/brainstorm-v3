const types = /* GraphQL */ `
  type Query {
    # templates
    templates(limit: Int): [Template]!
    template(id: ID!): Template

    # ideas
    ideas(limit: Int): [Idea]!
    idea(id: ID!): Idea
  }
  type Mutation {
    # templates
    createTemplate(template: TemplateCreateInput!): Template!
    updateTemplate(id: ID!, template: TemplateUpdateInput!): Template!
    deleteTemplate(id: ID!): Boolean

    # ideas
    createIdea(idea: IdeaCreateInput!): Idea!
    updateIdea(id: ID!, idea: IdeaUpdateInput!): Idea!
    deleteIdea(id: ID!): Boolean
  }
`;
export default types;
