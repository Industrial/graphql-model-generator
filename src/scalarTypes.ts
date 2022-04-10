import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { GraphQLDateTime } from './GraphQLDateTime.ts';

export const scalarTypes = {
  Int: GraphQLInt,
  Float: GraphQLFloat,
  String: GraphQLString,
  Boolean: GraphQLBoolean,
  ID: GraphQLID,
  DateTime: GraphQLDateTime,
};
