import { ITemplateMongo, Template } from '../../../lib/types/Template';

import { BackendUser } from '../../../lib/types/BackendUser';
import { TemplateModel } from '../../../mongoose/TemplateModel';
import { dbConnect } from '../../../mongoose/db';

const templateQueries = {
  templates: async (_: any, args: any, context: any) => {
    await dbConnect();
    const userId = (context.user as BackendUser).sub;
    const limit = args.limit as number | undefined;

    const query = TemplateModel.find({ userId });
    console.log(limit);
    if (limit) {
      query.limit(limit);
    }

    const templates = await query.lean<ITemplateMongo[]>();
    return templates.map(t => new Template(t));
  },
  template: async (_: any, args: any, context: any) => {
    await dbConnect();
    const templateId = args.id as string;
    const userId = (context.user as BackendUser).sub;

    const template = await TemplateModel.findOne({
      $and: [{ _id: templateId }, { userId }],
    }).lean<ITemplateMongo>();

    if (!template) return null;

    return new Template(template);
  },
};

export default templateQueries;
