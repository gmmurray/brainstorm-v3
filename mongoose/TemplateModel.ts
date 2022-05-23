import mongoose, { Schema, model } from 'mongoose';

import { ITemplate } from '../lib/types/Template';
import { ITemplateField } from '../lib/types/TemplateField';

const templateFieldSchema = new Schema<ITemplateField>({
  name: String,
  type: String,
});

const templateSchema = new Schema<ITemplate>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, minlength: 1 },
    fields: { type: [templateFieldSchema], required: true },
  },
  { timestamps: true },
);

export const TemplateModel =
  mongoose?.models?.Template ?? model<ITemplate>('Template', templateSchema);
