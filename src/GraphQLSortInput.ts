import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const GraphQLSortInput = new GraphQLInputObjectType({
  name: 'Sort',
  fields: {
    column: {
      type: GraphQLString,
    },
  },
});
