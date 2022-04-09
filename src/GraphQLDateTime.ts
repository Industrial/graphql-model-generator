import { GraphQLScalarType } from 'graphql';

export const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  description:
    'Represents a time value as seconds since midnight, January 1, 1970 UTC. DateTime may either be expressed as a number of milliseconds or an ISO-8601 string. DateTime is serialized into JSON in the number of milliseconds since epoch.',
});
