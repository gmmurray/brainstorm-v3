import { IIdeaMongo, Idea } from '../../../lib/types/Idea';

import { BackendUser } from '../../../lib/types/BackendUser';
import { IdeaModel } from '../../../mongoose/IdeaModel';
import { Template } from '../../../lib/types/Template';
import { dbConnect } from '../../../mongoose/db';

const ideaMutations = {
  createIdea: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const idea = args.idea as Partial<Idea>;

    const newIdea = await IdeaModel.create({
      userId,
      name: idea.name,
      template: (idea.template as Template).id,
      fields: idea.fields,
    });

    const created = await IdeaModel.findById(newIdea.id).populate('template');

    return new Idea(created);
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
