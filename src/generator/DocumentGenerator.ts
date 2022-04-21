import { GraphQLGenerator } from './GraphQLGenerator.ts';

export class DocumentGenerator extends GraphQLGenerator {
  document?: string;

  // Because 'graphql-js' doesn't support serializing a Document AST to a string
  // we need to do it ourselves.
  create() {
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
        const operationLabel = `${model.name}${operation.type}`;
        const operationName = `${operation.name}${model.name}`;

        switch (operation.type) {
          case 'Show':
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

          case 'List':
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

          case 'Create':
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

          case 'Update':
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

          case 'Remove':
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

    this.document = document;
    this.output = document;
  }
}
