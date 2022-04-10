import { Generator } from './Generator.ts';
import { getLabelForOperationType, OperationType } from './types.ts';

export class DocumentGenerator extends Generator {
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
          getLabelForOperationType(operation.type)
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

  write(documentString: string, filePath: string) {
    Deno.writeFileSync(
      filePath,
      new TextEncoder().encode(documentString),
    );
  }
}
