import { ITemplate, ITemplateMongo, Template } from './Template';

import { ITemplateField } from './TemplateField';
import { Types } from 'mongoose';

export interface IIdeaField extends ITemplateField {
  value: any;
}

export interface IIdea {
  userId: string;
  name: string;
  template?: string | ITemplate | ITemplateMongo;
  fields: IIdeaField[];
}

export interface IIdeaMongo extends IIdea {
  _id: Types.ObjectId;
  template?: ITemplateMongo;
}

export class Idea implements IIdea {
  id: string;
  userId: string;
  name: string;
  fields: IIdeaField[];
  template?: Template | string;
  constructor(idea: IIdeaMongo) {
    this.id = idea._id.toString();
    this.userId = idea.userId;
    this.name = idea.name;
    this.fields = idea.fields;
    this.template = idea.template ? new Template(idea.template) : undefined;
  }
}
