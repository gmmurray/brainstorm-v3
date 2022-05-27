import { IIdeaMongo, Idea } from '../../../lib/types/Idea';

import { BackendUser } from '../../../lib/types/BackendUser';
import { IdeaModel } from '../../../mongoose/IdeaModel';
import { dbConnect } from '../../../mongoose/db';

const ideaQueries = {
  ideas: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const limit = args.limit as number | undefined;

    const query = IdeaModel.find({ userId });

    if (limit) {
      query.limit(limit);
    }

    const ideas = await query.populate('template').lean<IIdeaMongo[]>();

    return ideas.map(i => new Idea(i));
  },
  idea: async (_: any, args: any, context: any) => {
    await dbConnect();
    const ideaId = args.id as string;
    const userId = (context.user as BackendUser).sub;

    const idea = await IdeaModel.findOne({
      $and: [{ _id: ideaId }, { userId }],
    }).populate('template');

    return new Idea(idea);
  },
};

export default ideaQueries;
