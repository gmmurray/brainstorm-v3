import { IIdea, IIdeaField } from '../lib/types/Idea';
import mongoose, { Schema, model } from 'mongoose';

const ideaFieldSchema = new Schema<IIdeaField>({
  type: String,
  name: String,
  value: Schema.Types.Mixed,
});

const ideaSchema = new Schema<IIdea>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    template: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    fields: { type: [ideaFieldSchema] },
  },
  { timestamps: true },
);

export const IdeaModel =
  mongoose?.models?.Idea ?? model<IIdea>('Idea', ideaSchema);
