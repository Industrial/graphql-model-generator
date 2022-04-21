import { Project } from 'ts-morph';

import { Generator } from './Generator.ts';

export abstract class TypeScriptGenerator extends Generator {
  // TODO: Helper function?
  static formatTypeScript(text: string): string {
    const project = new Project({
      useInMemoryFileSystem: true,
    });

    const sourceFile = project.createSourceFile('file.ts', text);

    sourceFile.formatText();

    return sourceFile.getText();
  }
}
