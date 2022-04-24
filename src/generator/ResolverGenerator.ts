import { camelCase, pascalCase } from 'change-case';

import { Model, Operation } from '../types.ts';
import { TypeScriptGenerator } from './TypeScriptGenerator.ts';
import { signatures } from '../validator.ts';

export class ResolverGenerator extends TypeScriptGenerator {
  serviceDirectoryPath: string;

  imports: Array<string>;

  constructor(outputDirectoryPath: string, serviceDirectoryPath: string) {
    super(outputDirectoryPath);

    this.serviceDirectoryPath = serviceDirectoryPath;
    this.imports = [];
  }

  override addModel(model: Model) {
    this.models.push(model);

    this.createClass(model);
  }

  addImport(importString: string) {
    this.imports.push(importString);
  }

  addOutput(output: string) {
    this.output = `${this.output}${output}`;
  }

  getModelServiceName(model: Model) {
    return pascalCase(`${model.name}Service`);
  }

  getModelResolverName(model: Model) {
    return pascalCase(`${model.name}Resolver`);
  }

  getModelServicePropertyName(model: Model) {
    return camelCase(this.getModelServiceName(model));
  }

  getOperationInputName(model: Model, operation: Operation) {
    return pascalCase(`${model.name}-${operation.type}-Input`);
  }

  getOperationOutputName(model: Model, operation: Operation) {
    return pascalCase(`${model.name}-${operation.type}-Result`);
  }

  getOperationName(operation: Operation) {
    return camelCase(`${operation.type}-${operation.name}`);
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

  createOperations(model: Model) {
    if (!model.operations) {
      return '';
    }

    const servicePropertyName = this.getModelServicePropertyName(model);

    const operations = {
      Show: this.createShowOperation,
      List: this.createListOperation,
      Create: this.createCreateOperation,
      Update: this.createUpdateOperation,
      Remove: this.createRemoveOperation,
    };

    return model.operations.map((operation) => {
      const inputName = this.getOperationInputName(model, operation);
      const outputName = this.getOperationOutputName(model, operation);
      const operationName = this.getOperationName(operation);

      return operations[operation.type](
        inputName,
        outputName,
        operationName,
        servicePropertyName,
      );
    }).join('\n');
  }

  createOperationValidators(model: Model) {
    if (!model.operations) {
      return '';
    }

    return model.operations.map((operation) => {
      if (!operation.arguments) {
        return '';
      }

      const inputName = this.getOperationInputName(model, operation);

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
    }).join('\n');
  }

  createOperationsImports(model: Model) {
    if (!model.operations) {
      return '';
    }

    return model.operations.map((operation) => {
      const inputName = this.getOperationInputName(model, operation);
      const outputName = this.getOperationOutputName(model, operation);

      return `
import { ${inputName} } from '${this.outputDirectoryPath}/server.ts';
import { ${outputName} } from '${this.outputDirectoryPath}/server.ts';`;
    }).join('\n');
  }

  createClass(model: Model) {
    const resolverName = this.getModelResolverName(model);
    const serviceName = this.getModelServiceName(model);
    const servicePropertyName = this.getModelServicePropertyName(model);

    this.addImport(
      `import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';`,
    );
    this.addImport(
      `import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';`,
    );

    let output = ``;
    const operationsOutput = this.createOperations(model);
    const operationValidatorsOutput = this.createOperationValidators(model);
    const operationsImportsOutput = this.createOperationsImports(model);

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
${operationValidatorsOutput}
${classOutput}
${output}
    `;

    this.addImport(operationsImportsOutput);
    this.addOutput(output);
  }

  createImports(model: Model) {
    const serviceName = this.getModelServiceName(model);
    this.addImport(`
import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';
import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';`);
  }

  create() {
    this.output = TypeScriptGenerator.formatTypeScript(`
import ClassValidator from 'class-validator';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
${this.imports.join('\n')}
${this.output}`);
  }
}
