import { GraphQLObjectType, GraphQLScalarType } from 'graphql';

import { Generator } from './Generator.ts';
import { scalarTypes as defaultScalarTypes } from '../scalarTypes.ts';

export abstract class GraphQLGenerator extends Generator {
  objectTypes: Record<string, GraphQLObjectType>;
  scalarTypes: Record<string, GraphQLScalarType>;

  constructor(
    outputDirectoryPath: string,
    objectTypes: Record<string, GraphQLObjectType> = {},
    scalarTypes: Record<string, GraphQLScalarType> = defaultScalarTypes,
  ) {
    super(outputDirectoryPath);

    this.objectTypes = objectTypes;
    this.scalarTypes = scalarTypes;
  }

  addObjectType(type: GraphQLObjectType) {
    this.objectTypes[type.name] = type;
  }

  addScalarType(type: GraphQLScalarType) {
    this.scalarTypes[type.name] = type;
  }

  getType(type: string) {
    const typeObject = this.scalarTypes[type] || this.objectTypes[type];

    if (!typeObject) {
      throw new Error(`Unsupported type: ${type}`);
    }

    return typeObject;
  }
}
