import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLType,
  printSchema,
} from 'graphql';

import { GraphQLDateTime } from './GraphQLDateTime.ts';
import { GraphQLPaginateInput } from './GraphQLPaginateInput.ts';
import { GraphQLSortInput } from './GraphQLSortInput.ts';
import {
  Argument,
  Model,
  Operation,
  OperationType,
  Property,
  Relationship,
} from './types.ts';

export class GraphQLGenerator {
  models: Array<Model>;
  objectTypes: Record<string, GraphQLObjectType>;
  scalarTypes: Record<string, GraphQLScalarType>;

  constructor() {
    this.models = [];
    this.objectTypes = {};
    this.scalarTypes = {
      Int: GraphQLInt,
      Float: GraphQLFloat,
      String: GraphQLString,
      Boolean: GraphQLBoolean,
      ID: GraphQLID,
      DateTime: GraphQLDateTime,
    };
  }

  addModel(model: Model) {
    this.models.push(model);

    const objectType = this.createObjectType(model);

    this.addObjectType(objectType);
  }

  getType(type: string) {
    const typeObject = this.scalarTypes[type] || this.objectTypes[type];

    if (!typeObject) {
      throw new Error(`Unsupported type: ${type}`);
    }

    return typeObject;
  }

  addObjectType(type: GraphQLObjectType) {
    this.objectTypes[type.name] = type;
  }

  printSchema(schema: GraphQLSchema, filePath: string) {
    Deno.writeFileSync(
      filePath,
      new TextEncoder().encode(printSchema(schema)),
    );
  }

  printDocument(documentString: string, filePath: string) {
    Deno.writeFileSync(
      filePath,
      new TextEncoder().encode(documentString),
    );
  }

  createSchema() {
    const query = this.createQuery();
    const mutation = this.createMutation();

    const schema = new GraphQLSchema({
      query,
      mutation,
      types: Object.values(this.objectTypes),
    });

    return schema;
  }

  createQuery() {
    const query = new GraphQLObjectType({
      name: 'Query',
      fields: () => {
        return this.createOperations(
          [
            OperationType.show,
            OperationType.list,
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
            OperationType.create,
            OperationType.update,
            OperationType.remove,
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
        relationships[relationship.name] = this.createProperty(relationship);
      }
    }

    return relationships;
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

  getLabelForOperationType(type: OperationType) {
    const label = String(OperationType[type]).charAt(0).toUpperCase() +
      String(OperationType[type]).slice(1);

    return label;
  }

  createOperation(model: Model, operation: Operation) {
    const modelObjectType = this.objectTypes[model.name];
    if (!modelObjectType) {
      throw new Error(`Model ${model.name} not found`);
    }

    let inputType: GraphQLInputObjectType;
    let outputType: GraphQLObjectType;

    const operationLabel = this.getLabelForOperationType(operation.type);

    inputType = new GraphQLInputObjectType({
      name: `${model.name}${operationLabel}Input`,
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
      name: `${model.name}${operationLabel}Result`,
      fields: () => {
        return {
          entry: {
            type: modelObjectType,
          },
        };
      },
    });

    switch (operation.type) {
      case OperationType.show:
        // Use the generic types.
        break;

      case OperationType.list:
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operationLabel}Input`,
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
          name: `${model.name}${operationLabel}Result`,
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

      case OperationType.create:
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operationLabel}Input`,
          fields: () => {
            return {
              ...this.createOperationInputFields(operation),
            };
          },
        });
        break;

      case OperationType.update:
        inputType = new GraphQLInputObjectType({
          name: `${model.name}${operationLabel}Input`,
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

      case OperationType.remove:
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
        fields[argument.name] = this.createProperty(argument) as {
          type: GraphQLInputType;
        };
      }
    }

    return fields;
  }

  // Because 'graphql-js' doesn't support serializing a Document AST to a string
  // we need to do it ourselves.
  createDocument() {
    const fragments: Array<string> = [];
    const operations: Array<string> = [];

    for (const model of this.models) {
      if (!model.operations) {
        continue;
      }

      const fragmentName = `${model.name}Fragment`;

      fragments.push(`
fragment ${fragmentName} on ${model.name} {
  ${model.properties.map((property) => property.name).join('\n  ')}
}
      `);

      for (const operation of model.operations) {
        const operationLabel = `${model.name}${
          this.getLabelForOperationType(operation.type)
        }`;
        const operationName = `${operation.type}${model.name}`;

        switch (operation.type) {
          case OperationType.show:
            operations.push(`
query ${operationName}($input: ${operationLabel}Input!) {
  ${operationName}(input: $input) {
    entry {
      ...${fragmentName}
    }
  }
}
            `);
            break;

          case OperationType.list:
            operations.push(`
query ${operationName}($input: ${operationLabel}Input!) {
  ${operationName}(input: $input) {
    entries {
      ...${fragmentName}
    }
    total
  }
}
            `);
            break;

          case OperationType.create:
            operations.push(`
mutation ${operationName}($input: ${operationLabel}Input!) {
  ${operationName}(input: $input) {
    entry {
      ...${fragmentName}
    }
  }
}
            `);
            break;

          case OperationType.update:
            operations.push(`
mutation ${operationName}($input: ${operationLabel}Input!) {
  ${operationName}(input: $input) {
    entry {
      ...${fragmentName}
    }
  }
}
            `);
            break;

          case OperationType.remove:
            operations.push(`
mutation ${operationName}($input: ${operationLabel}Input!) {
  ${operationName}(input: $input) {
    entry {
      ...${fragmentName}
    }
  }
}
            `);
            break;

          default:
            throw new Error(`Unsupported operation type: ${operation.type}`);
        }
      }
    }

    const document = `
${fragments.join('\n')}
${operations.join('\n')}
    `;

    return document;
  }
}
