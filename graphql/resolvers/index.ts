import { ideaMutations, ideaQueries } from './idea';
import { templateMutations, templateQueries } from './template';

const resolvers = {
  Query: {
    ...templateQueries,
    ...ideaQueries,
  },
  Mutation: {
    ...templateMutations,
    ...ideaMutations,
  },
};

export default resolvers;
