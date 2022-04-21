import { camelCase, pascalCase } from 'change-case';

import { Model } from '../types.ts';
import { TypeScriptGenerator } from './TypeScriptGenerator.ts';

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
    this.imports += importString;
  }

  addClass(classDeclaration: string) {
    this.output += classDeclaration;
  }

  createClass(model: Model) {
    const resolverName = pascalCase(`${model.name}Resolver`);
    const serviceName = pascalCase(`${model.name}Service`);
    const servicePropertyName = camelCase(serviceName);

    let serverImports = `
import {
  ${model.name},
    `;

    let output = `
@Service()
@Resolver(${model.name})
export class ${resolverName} {
  constructor(
    private readonly ${servicePropertyName}: ${serviceName},
  ) {}
    `;

    if (model.operations && model.operations.length > 0) {
      for (const operation of model.operations) {
        const inputName = pascalCase(`${model.name}-${operation.type}-Input`);
        const outputName = pascalCase(`${model.name}-${operation.type}-Result`);
        const operationName = camelCase(`${operation.type}-${operation.name}`);

        serverImports += `
  ${inputName},
  ${outputName},
        `;

        switch (operation.type) {
          case 'Show':
            output += `
            @Query(() => [${outputName}])
            async ${operationName}(
              @Arg('input') input: ${inputName},
            ): Promise<${outputName}> {
              return await this.${servicePropertyName}.find(input);
            }
          `;
            break;

          case 'List':
            output += `
            @Query(() => [${outputName}])
            async ${operationName}(
              @Arg('input') input: ${inputName},
            ): Promise<${outputName}> {
              return await this.${servicePropertyName}.find(input);
            }
          `;
            break;

          case 'Create':
            output += `
            @Mutation(() => ${outputName})
            async ${operationName}(
              @Arg('input') input: ${inputName},
            ): Promise<${outputName}> {
              return await this.${servicePropertyName}.create(input);
            }
          `;
            break;

          case 'Update':
            output += `
            @Mutation(() => ${outputName})
            async ${operationName}(
              @Arg('input') input: ${inputName},
            ): Promise<${outputName}> {
              return await this.${servicePropertyName}.update(input);
            }
          `;
            break;

          case 'Remove':
            output += `
            @Mutation(() => ${outputName})
            async ${operationName}(
              @Arg('input') input: ${inputName},
            ): Promise<${outputName}> {
              return await this.${servicePropertyName}.remove(input);
            }
          `;
            break;
        }
      }
    }

    serverImports += `
} from '${this.outputDirectoryPath}/server.ts';
    `;

    const imports = `
${serverImports}
import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';
    `;

    output += `
}
    `;

    this.addImport(TypeScriptGenerator.formatTypeScript(imports));
    this.addClass(TypeScriptGenerator.formatTypeScript(output));
  }

  createImports(model: Model) {
    const serviceName = pascalCase(`${model.name}Service`);

    this.addImport(TypeScriptGenerator.formatTypeScript(`
import { ${model.name} } from '${this.outputDirectoryPath}/server.ts';
import { ${serviceName} } from '${this.serviceDirectoryPath}/${serviceName}.ts';
    `));
  }

  create() {
    this.output = TypeScriptGenerator.formatTypeScript(
      `
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
${this.imports}
${this.output}
      `,
    );
  }
}
