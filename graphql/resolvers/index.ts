import { templateMutations, templateQueries } from './template';

const resolvers = {
  Query: {
    ...templateQueries,
  },
  Mutation: {
    ...templateMutations,
  },
};

export default resolvers;
