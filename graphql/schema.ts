import baseTypes from './typedefs';
import commonTypes from './typedefs/common';
import ideaTypes from './typedefs/idea';
import { mergeTypeDefs } from '@graphql-tools/merge';
import templateTypes from './typedefs/template';

export const typeDefs = mergeTypeDefs([
  baseTypes,
  commonTypes,
  templateTypes,
  ideaTypes,
]);
