import { Model } from '../types.ts';

export abstract class Generator {
  outputDirectoryPath: string;

  models: Array<Model>;
  output: string;

  constructor(outputDirectoryPath: string) {
    this.outputDirectoryPath = outputDirectoryPath;
    this.models = [];
    this.output = '';
  }

  addModel(model: Model) {
    this.models.push(model);
  }

  abstract create(): void;

  write(filePath: string) {
    if (!this.output) {
      throw new Error('Output not created.');
    }

    Deno.writeFileSync(
      `${this.outputDirectoryPath}/${filePath}`,
      new TextEncoder().encode(this.output),
    );
  }
}
