export enum TemplateFieldTypes {
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
}

export interface ITemplateField {
  name: string;
  type: TemplateFieldTypes;
}
