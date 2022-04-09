import { GraphQLInputObjectType, GraphQLInt } from 'graphql';

export const GraphQLPaginateInput = new GraphQLInputObjectType({
  name: 'Paginate',
  fields: {
    skip: {
      type: GraphQLInt,
      defaultValue: 0,
    },
    take: {
      type: GraphQLInt,
      defaultValue: 10,
    },
  },
});
