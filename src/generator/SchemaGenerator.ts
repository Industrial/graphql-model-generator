import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  printSchema,
} from 'graphql';

import { GraphQLGenerator } from './GraphQLGenerator.ts';
import { GraphQLPaginateInput } from '../GraphQLPaginateInput.ts';
import { GraphQLSortInput } from '../GraphQLSortInput.ts';
import {
  Argument,
  Model,
  Operation,
  OperationType,
  Property,
  Relationship,
} from '../types.ts';

export class SchemaGenerator extends GraphQLGenerator {
  schema?: GraphQLSchema;

  override addModel(model: Model) {
    this.models.push(model);

    const objectType = this.createObjectType(model);

    this.addObjectType(objectType);
  }

  createQuery() {
    const query = new GraphQLObjectType({
      name: 'Query',
      fields: () => {
        return this.createOperations(
          [
            'Show',
            'List',
          ],
        );
      },
    });

    return query;
  }

  createMutation() {
    const mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: () => {
        return this.createOperations(
          [
            'Create',
            'Update',
            'Remove',
          ],
        );
      },
    });

    return mutation;
  }

  createObjectType(model: Model) {
    const objectType = new GraphQLObjectType({
      name: model.name,
      fields: () => {
        return {
          ...this.createProperties(model),
          ...this.createRelationships(model),
        };
      },
    });

    return objectType;
  }

  createProperties(model: Model) {
    // deno-lint-ignore no-explicit-any
    const properties: GraphQLFieldConfigMap<any, any> = {};

    properties.id = this.createProperty({
      name: 'id',
      type: 'ID',
      required: true,
    });

    for (const property of model.properties) {
      properties[property.name] = this.createProperty(property);
    }

    return properties;
  }

  createRelationships(model: Model) {
    // deno-lint-ignore no-explicit-any
    const relationships: GraphQLFieldConfigMap<any, any> = {};

    if (model.relationships) {
      for (const relationship of model.relationships) {
        relationships[relationship.name] = this.createRelationship(
          relationship,
        );
      }
    }

    return relationships;
  }

  createRelationship(relationship: Relationship) {
    let type:
      | ReturnType<typeof this.getType>
      | GraphQLList<GraphQLType>
      | GraphQLNonNull<GraphQLNullableType> = this.getType(relationship.type);

    if (!type) {
      throw new Error(`Unsupported type: ${relationship.type}`);
    }

    if (relationship.list === true) {
      type = new GraphQLList(type);
    }

    if (
      typeof relationship.required === 'undefined' ||
      relationship.required === true
    ) {
      type = new GraphQLNonNull(type);
    }

    return {
      type,
    };
  }

  createProperty(property: Property | Relationship | Argument) {
    let type:
      | ReturnType<typeof this.getType>
      | GraphQLList<GraphQLType>
      | GraphQLNonNull<GraphQLNullableType> = this.getType(property.type);

    if (!type) {
      throw new Error(`Unsupported type: ${property.type}`);
    }

    if (property.list === true) {
      type = new GraphQLList(type);
    }

    if (
      typeof property.required === 'undefined' ||
      property.required === true
    ) {
      type = new GraphQLNonNull(type);
    }

    // TODO: Handle the unique property.
    // TODO: Handle the permissions property.

    return {
      type,
    };
  }

  createOperations(operationTypes: Array<OperationType>) {
    // deno-lint-ignore no-explicit-any
    const operations: GraphQLFieldConfigMap<any, any> = {};

    for (const model of this.models) {
      if (!model.operations) {
        continue;
      }

      for (const operation of model.operations) {
        if (!operationTypes.includes(operation.type)) {
          continue;
        }

        operations[`${operation.name}${model.name}`] = this.createOperation(
          model,
          operation,
        );
      }
    }

    return operations;
  }

  createOperation(model: Model, operation: Operation) {
    const modelObjectType = this.objectTypes[model.name];
    if (!modelObjectType) {
      throw new Error(`Model ${model.name} not found`);
    }

    let inputType: GraphQLInputObjectType;
    let outputType: GraphQLObjectType;

    inputType = new GraphQLInputObjectType({
      name: `${model.name}${operation.type}Input`,
      fields: () => {
        const inputFields = this.createOperationInputFields(operation);

        if (Object.keys(inputFields).length > 0) {
          return {
            id: {
              type: GraphQLID,
            },
            ...inputFields,
          };
        }

        return {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        };
      },
    });

    // Generic output type used for most operations.
    outputType = new GraphQLObjectType({
      name: `${model.name}${operation.type}Result`,
      fields: () => {
        return {
          entry: {
            type: modelObjectType,
          },
        };
      },
    });

    switch (operation.type) {
      case 'Show':
        // Use the generic types.
        break;

      case 'List':
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operation.type}Input`,
          fields: () => {
            return {
              ...this.createOperationInputFields(operation),
              sort: {
                type: GraphQLSortInput,
              },
              paginate: {
                type: GraphQLPaginateInput,
              },
            };
          },
        });
        outputType = new GraphQLObjectType({
          name: `${model.name}${operation.type}Result`,
          fields: () => {
            return {
              entries: {
                type: new GraphQLNonNull(new GraphQLList(modelObjectType)),
              },
              total: {
                type: new GraphQLNonNull(GraphQLInt),
              },
            };
          },
        });
        break;

      case 'Create':
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operation.type}Input`,
          fields: () => {
            return {
              ...this.createOperationInputFields(operation),
            };
          },
        });
        break;

      case 'Update':
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operation.type}Input`,
          fields: () => {
            return {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
              ...this.createOperationInputFields(operation),
            };
          },
        });
        break;

      case 'Remove':
        // Use the generic types.
        break;

      default:
        throw new Error(
          `Unsupported operation type: ${operation.type}`,
        );
    }

    return {
      type: new GraphQLNonNull(outputType),
      args: {
        input: {
          type: new GraphQLNonNull(inputType),
        },
      },
    };
  }

  createOperationInputFields(operation: Operation) {
    const fields: GraphQLInputFieldConfigMap = {};

    if (operation.arguments) {
      for (const argument of operation.arguments) {
        fields[argument.name] = this.createArgument(argument) as {
          type: GraphQLInputType;
        };
      }
    }

    return fields;
  }

  createArgument(argument: Argument) {
    let type:
      | ReturnType<typeof this.getType>
      | GraphQLList<GraphQLType>
      | GraphQLNonNull<GraphQLNullableType> = this.getType(argument.type);

    if (!type) {
      throw new Error(`Unsupported type: ${argument.type}`);
    }

    if (argument.list === true) {
      type = new GraphQLList(type);
    }

    if (
      typeof argument.required === 'undefined' ||
      argument.required === true
    ) {
      type = new GraphQLNonNull(type);
    }

    // TODO: Handle the validators property.

    return {
      type,
    };
  }

  create() {
    const query = this.createQuery();
    const mutation = this.createMutation();

    const schema = new GraphQLSchema({
      query,
      mutation,
      types: Object.values(this.objectTypes),
    });

    this.schema = schema;
    this.output = printSchema(schema);
  }
}
