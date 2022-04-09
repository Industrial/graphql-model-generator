import Ajv from 'ajv';

import { Compound } from './types.ts';
import { schema } from './schema.ts';

const ajv = new Ajv();

export function validate(input: Compound<unknown>) {
  const validator = ajv.compile(schema);
  const valid = validator(input);

  return {
    valid,
    errors: validator.errors,
  };
}

export function validateOrThrow(input: Compound<unknown>) {
  const { valid, errors } = validate(input);

  if (!valid) {
    throw new Error(JSON.stringify(errors));
  }
}
