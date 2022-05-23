import { ITemplateField } from './TemplateField';
import { Types } from 'mongoose';

export interface ITemplate {
  userId: string;
  name: string;
  fields: ITemplateField[];
}

export interface ITemplateMongo extends ITemplate {
  _id: Types.ObjectId;
}

export class Template implements ITemplate {
  id: string;
  userId: string;
  name: string;
  fields: ITemplateField[];
  constructor(template: ITemplateMongo) {
    this.id = template._id.toString();
    this.userId = template.userId;
    this.name = template.name;
    this.fields = template.fields;
  }
}
