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

export enum PropertyType {
  'Int' = 'Int',
  'Float' = 'Float',
  'String' = 'String',
  'Boolean' = 'Boolean',
  'ID' = 'ID',
  'DateTime' = 'DateTime',
}

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

export enum OperationType {
  'create' = 'create',
  'show' = 'show',
  'list' = 'list',
  'update' = 'update',
  'remove' = 'remove',
}

export type Argument = {
  name: string;
  type: PropertyType;
  list?: boolean;
  required?: boolean;
};

export type Permission = {
  role: string;
  type: PermissionType;
};

export enum PermissionType {
  'allow' = 'allow',
  'deny' = 'deny',
}
