import { Validator } from './validator.ts';

export type Compound<T> = Array<T> | Record<string, T>;

export type Model = {
  name: string;
  properties: Array<Property>;
  relationships?: Array<Relationship>;
  operations?: Array<Operation>;
};

export type Property = {
  name: string;
  type: PropertyType;
  list?: boolean;
  required?: boolean;
  unique?: boolean;
  permissions?: Array<Permission>;
};

export type PropertyType =
  | 'Int'
  | 'Float'
  | 'String'
  | 'Boolean'
  | 'ID'
  | 'DateTime';

export type Relationship = {
  name: string;
  type: string;
  list?: boolean;
  required?: boolean;
};

export type Operation = {
  name: string;
  type: OperationType;
  arguments?: Array<Argument>;
  permissions?: Array<Permission>;
};

export type OperationType = 'Create' | 'Show' | 'List' | 'Update' | 'Remove';

export type Argument = {
  name: string;
  type: PropertyType;
  list?: boolean;
  required?: boolean;
  validators?: Array<Validator>;
};

export type Permission = {
  role: string;
  type: PermissionType;
};

export type PermissionType = 'Allow' | 'Deny';
