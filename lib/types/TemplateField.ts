export enum TemplateFieldTypes {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
}

export interface ITemplateField {
  name: string;
  type: TemplateFieldTypes;
}
