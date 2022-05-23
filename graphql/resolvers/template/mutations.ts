import { BackendUser } from '../../../lib/types/BackendUser';
import { Template } from '../../../lib/types/Template';
import { TemplateModel } from '../../../mongoose/TemplateModel';
import { dbConnect } from '../../../mongoose/db';

const templateMutations = {
  createTemplate: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const template = args.template as Partial<Template>;

    const newTemplate = await TemplateModel.create({
      ...template,
      userId,
    });

    return new Template(newTemplate);
  },
  updateTemplate: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const template = { ...args.template, userId } as Partial<Template>;
    const templateId = args.id as string;

    await TemplateModel.findOneAndReplace(
      { $and: [{ _id: templateId }, { userId }] },
      template,
    );

    const result = await TemplateModel.findById(templateId);

    return new Template(result);
  },
  deleteTemplate: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const templateId = args.id as string;

    await TemplateModel.findOneAndDelete({
      $and: [{ _id: templateId }, { userId }],
    });

    return true;
  },
};

export default templateMutations;
