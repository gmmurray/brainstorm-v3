import { BackendUser } from '../../../lib/types/BackendUser';
import { Idea } from '../../../lib/types/Idea';
import { IdeaModel } from '../../../mongoose/IdeaModel';
import { dbConnect } from '../../../mongoose/db';

const ideaMutations = {
  createIdea: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const idea = args.template as Partial<Idea>;

    const newIdea = await IdeaModel.create({
      ...idea,
      userId,
    });

    return (await IdeaModel.findById(userId, newIdea.id)) as Idea;
  },
  updateIdea: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const idea = { ...args.idea, userId } as Partial<Idea>;
    const ideaId = args.id as string;

    await IdeaModel.findOneAndReplace(
      { $and: [{ _id: ideaId }, { userId }] },
      idea,
    );

    const result = await IdeaModel.findById(ideaId);

    return new Idea(result);
  },
  deleteIdea: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const ideaId = args.id as string;

    await IdeaModel.findOneAndDelete({
      $and: [{ _id: ideaId }, { userId }],
    });

    return true;
  },
};

export default ideaMutations;
