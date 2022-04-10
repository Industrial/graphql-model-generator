import { GraphQLObjectType, GraphQLScalarType } from 'graphql';

import { Model } from './types.ts';
import { scalarTypes as defaultScalarTypes } from './scalarTypes.ts';

export type ObjectTypes = Record<string, GraphQLObjectType>;
export type ScalarTypes = Record<string, GraphQLScalarType>;

export class Generator {
  objectTypes: ObjectTypes;
  scalarTypes: ScalarTypes;
  models: Array<Model>;

  constructor(
    objectTypes: ObjectTypes = {},
    scalarTypes: ScalarTypes = defaultScalarTypes,
  ) {
    this.objectTypes = objectTypes;
    this.scalarTypes = scalarTypes;
    this.models = [];
  }

  addModel(model: Model) {
    this.models.push(model);
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
