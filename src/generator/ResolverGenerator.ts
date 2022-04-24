import { camelCase, pascalCase } from 'change-case';

import { Model } from '../types.ts';
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

  createClass(model: Model) {
    const resolverName = pascalCase(`${model.name}Resolver`);
    const serviceName = pascalCase(`${model.name}Service`);
    const servicePropertyName = camelCase(serviceName);

    const serviceImport =
      `import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';`;
    this.addImport(TypeScriptGenerator.formatTypeScript(serviceImport));

    const modelImport =
      `import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';`;
    this.addImport(TypeScriptGenerator.formatTypeScript(modelImport));

    let output = ``;
    let importsOutput = ``;
    let operationsOutput = ``;
    let validatorsOutput = ``;

    if (model.operations && model.operations.length > 0) {
      for (const operation of model.operations) {
        const inputName = pascalCase(`${model.name}-${operation.type}-Input`);
        const outputName = pascalCase(`${model.name}-${operation.type}-Result`);
        const operationName = camelCase(`${operation.type}-${operation.name}`);

        if (operation.arguments && operation.arguments.length > 0) {
          for (const argument of operation.arguments) {
            if (argument.validators && argument.validators.length > 0) {
              for (const validator of argument.validators) {
                const signature = signatures[validator.type];

                if (!signature) {
                  throw new Error(`Unknown validator type: ${validator.type}`);
                }

                const signatureOutput = signature(
                  inputName,
                  argument.name,
                  validator,
                );

                validatorsOutput = `
${validatorsOutput}
${signatureOutput}`;
              }
            }
          }
        }

        importsOutput += `
import { ${inputName} } from '${this.outputDirectoryPath}/server.ts';
import { ${outputName} } from '${this.outputDirectoryPath}/server.ts';`;

        switch (operation.type) {
          case 'Show':
            operationsOutput += this.createShowOperation(
              inputName,
              outputName,
              operationName,
              servicePropertyName,
            );
            break;

          case 'List':
            operationsOutput += this.createListOperation(
              inputName,
              outputName,
              operationName,
              servicePropertyName,
            );
            break;

          case 'Create':
            operationsOutput += this.createCreateOperation(
              inputName,
              outputName,
              operationName,
              servicePropertyName,
            );
            break;

          case 'Update':
            operationsOutput += this.createUpdateOperation(
              inputName,
              outputName,
              operationName,
              servicePropertyName,
            );
            break;

          case 'Remove':
            operationsOutput += this.createRemoveOperation(
              inputName,
              outputName,
              operationName,
              servicePropertyName,
            );
            break;
        }
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
${validatorsOutput}
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
