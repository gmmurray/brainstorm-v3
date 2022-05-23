import baseTypes from './typedefs';
import commonTypes from './typedefs/common';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import templateTypes from './typedefs/template';

export const typeDefs = mergeTypeDefs([baseTypes, commonTypes, templateTypes]);
