import { camelCase, pascalCase } from 'change-case';

import { Model, Operation } from '../types.ts';
import { TypeScriptGenerator } from './TypeScriptGenerator.ts';
import { signatures } from '../validator.ts';

export class ResolverGenerator extends TypeScriptGenerator {
  serviceDirectoryPath: string;

  imports: string;

  constructor(outputDirectoryPath: string, serviceDirectoryPath: string) {
    super(outputDirectoryPath);

    this.serviceDirectoryPath = serviceDirectoryPath;
    this.imports = '';
  }

  override addModel(model: Model) {
    this.models.push(model);

    this.createClass(model);
  }

  addImport(importString: string) {
    this.imports = TypeScriptGenerator.formatTypeScript(
      `${this.imports}${importString}`,
    );
  }

  addOutput(output: string) {
    this.output = TypeScriptGenerator.formatTypeScript(
      `${this.output}${output}`,
    );
  }

  createShowOperation(
    inputName: string,
    outputName: string,
    operationName: string,
    servicePropertyName: string,
  ) {
    return `
@Query(() => [${outputName}])
async ${operationName}(
  @Arg('input') input: ${inputName},
): Promise<${outputName}> {
  return await this.${servicePropertyName}.find(input);
}`;
  }

  createListOperation(
    inputName: string,
    outputName: string,
    operationName: string,
    servicePropertyName: string,
  ) {
    return `
@Query(() => [${outputName}])
async ${operationName}(
  @Arg('input') input: ${inputName},
): Promise<${outputName}> {
  return await this.${servicePropertyName}.find(input);
}`;
  }

  createCreateOperation(
    inputName: string,
    outputName: string,
    operationName: string,
    servicePropertyName: string,
  ) {
    return `
@Mutation(() => ${outputName})
async ${operationName}(
  @Arg('input') input: ${inputName},
): Promise<${outputName}> {
  return await this.${servicePropertyName}.create(input);
}`;
  }

  createUpdateOperation(
    inputName: string,
    outputName: string,
    operationName: string,
    servicePropertyName: string,
  ) {
    return `
@Mutation(() => ${outputName})
async ${operationName}(
  @Arg('input') input: ${inputName},
): Promise<${outputName}> {
  return await this.${servicePropertyName}.update(input);
}`;
  }

  createRemoveOperation(
    inputName: string,
    outputName: string,
    operationName: string,
    servicePropertyName: string,
  ) {
    return `
@Mutation(() => ${outputName})
async ${operationName}(
  @Arg('input') input: ${inputName},
): Promise<${outputName}> {
  return await this.${servicePropertyName}.remove(input);
}`;
  }

  createOperationValidators(operation: Operation, inputName: string) {
    if (!operation.arguments) {
      return '';
    }

    return operation.arguments?.map((argument) =>
      argument.validators?.map((validator) => {
        const signature = signatures[validator.type];
        if (!signature) {
          throw new Error(`Unknown validator type: ${validator.type}`);
        }
        return signature(
          inputName,
          argument.name,
          validator,
        );
      }).join('\n')
    ).join('\n');
  }

  createClass(model: Model) {
    const resolverName = pascalCase(`${model.name}Resolver`);
    const serviceName = pascalCase(`${model.name}Service`);
    const servicePropertyName = camelCase(serviceName);

    const serviceImport =
      `import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';`;
    this.addImport(serviceImport);

    const modelImport =
      `import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';`;
    this.addImport(modelImport);

    let output = ``;
    let importsOutput = ``;
    let operationsOutput = ``;
    const validatorsOutput: Array<string> = [];

    if (model.operations && model.operations.length > 0) {
      for (const operation of model.operations) {
        const inputName = pascalCase(`${model.name}-${operation.type}-Input`);
        const outputName = pascalCase(`${model.name}-${operation.type}-Result`);
        const operationName = camelCase(`${operation.type}-${operation.name}`);

        validatorsOutput.push(this.createOperationValidators(
          operation,
          inputName,
        ));

        importsOutput += `
import { ${inputName} } from '${this.outputDirectoryPath}/server.ts';
import { ${outputName} } from '${this.outputDirectoryPath}/server.ts';`;

        const operations = {
          Show: this.createShowOperation,
          List: this.createListOperation,
          Create: this.createCreateOperation,
          Update: this.createUpdateOperation,
          Remove: this.createRemoveOperation,
        };
        const operationOutput = operations[operation.type];

        if (!operationOutput) {
          throw new Error(`Unknown operation type: ${operation.type}`);
        }

        operationsOutput += operationOutput(
          inputName,
          outputName,
          operationName,
          servicePropertyName,
        );
      }
    }

    const classOutput = `
@Service()
@Resolver(${model.name})
export class ${resolverName} {
  constructor(
    private readonly ${servicePropertyName}: ${serviceName},
  ) {}
${operationsOutput}
}`;

    output = `
${validatorsOutput.join('\n')}
${classOutput}
${output}
    `;

    this.addImport(importsOutput);
    this.addOutput(output);
  }

  createImports(model: Model) {
    const serviceName = pascalCase(`${model.name}Service`);

    this.addImport(`
import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';
import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';
    `);
  }

  create() {
    this.output = TypeScriptGenerator.formatTypeScript(
      `
import ClassValidator from 'class-validator';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
${this.imports}
${this.output}
      `,
    );
  }
}
