# graphql-model-generator
Generate a GraphQL Schema and Document from a JSON model.

## Goals
* Define your data model in JSON.
* Use standard operations to fetch and modify your data:
  * Show (fetch a single entity of a model).
  * List (fetch a list of entities of a model).
  * Create (create a new entity of a model).
  * Update (update an existing entity of a model).
  * Remove (remove an existing entity of a model).
* Generate a GraphQL Schema based on the Model JSON.
* Generate a GraphQL Document based on the Model JSON.
* Generate TypeScript client side code based on the Schema and Document. These are basic types which do not need customization.
  * This part uses [GraphQLCodeGenerator](https://www.graphql-code-generator.com).
    * Currently not included in the package.
* Generate TypeScript server side code based on the Schema and Document. These are basic types which do not need customization
  * This part uses [GraphQLCodeGenerator](https://www.graphql-code-generator.com).
    * Currently not included in the package.
* Generate a standard server implementation based on the Schema and Document. Change it or extend the classes to suit your needs.
  * This part uses [TypeGraphQL](https://typegraphql.com).
    * Currently not included in the package.

## TODO:
* Use [GraphQLCodeGenerator](https://www.graphql-code-generator.com) from within the package.
* Use [TypeGraphQL](https://typegraphql.com) from within the package.
* Support Authorization for fields and operations.

## Usage
### Model
First, define a model.

```ts
import { Model, PropertyType, OperationType } from 'https://deno.land/x/graphql_model_generator/mod.ts';

export const Article: Model = {
  name: 'Article',

  properties: [
    {
      name: 'title',
      type: PropertyType.String,
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: PropertyType.String,
      required: true,
      unique: true,
    },
    {
      name: 'body',
      type: PropertyType.String,
      required: true,
    },
    {
      name: 'createdAt',
      type: PropertyType.DateTime,
      required: true,
    },
    {
      name: 'updatedAt',
      type: PropertyType.DateTime,
      required: true,
    },
  ],

  // relationships: [],

  operations: [
    {
      name: 'show',
      type: OperationType.show,
    },

    {
      name: 'list',
      type: OperationType.list,
      arguments: [
        {
          name: 'title',
          type: PropertyType.String,
        },

        {
          name: 'body',
          type: PropertyType.String,
        },
      ],
    },

    {
      name: 'create',
      type: OperationType.create,
      arguments: [
        {
          name: 'title',
          type: PropertyType.String,
          required: true,
        },

        {
          name: 'body',
          type: PropertyType.String,
          required: true,
        },
      ],
    },

    {
      name: 'update',
      type: OperationType.update,
      arguments: [
        {
          name: 'title',
          type: PropertyType.String,
          required: true,
        },

        {
          name: 'body',
          type: PropertyType.String,
          required: true,
        },
      ],
    },

    {
      name: 'remove',
      type: OperationType.remove,
    },
  ],
};
```

### Validate
You can validate your model (JavaScript / TypeScript / JSON) with JSON Schema:

```ts
import { validate, validateOrThrow } from 'https://deno.land/x/graphql_model_generator/mod.ts';

// The file above.
import { Article } from './Article.ts';

const models = [Article];

const { valid, errors } = validate(models);
console.log(valid, errors);

// OR

validateOrThrow(models);
```

### Generate
```ts
const generator = new GraphQLGenerator();

for (const model of models) {
  generator.addModel(model);
}

const schema = generator.createSchema();
generator.printSchema(schema, 'schema.graphql');

const document = generator.createDocument();
generator.printDocument(document, 'document.graphql');
```

#### `schema.graphql`
```graphql
type Article {
  id: ID!
  title: String!
  slug: String!
  body: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Represents a time value as seconds since midnight, January 1, 1970 UTC. DateTime may either be expressed as a number of milliseconds or an ISO-8601 string. DateTime is serialized into JSON in the number of milliseconds since epoch.
"""
scalar DateTime

type Query {
  showArticle(input: ArticleShowInput!): ArticleShowResult!
  listArticle(input: ArticleListInput!): ArticleListResult!
}

type ArticleShowResult {
  entry: Article
}

input ArticleShowInput {
  id: ID!
}

type ArticleListResult {
  entries: [Article]!
  total: Int!
}

input ArticleListInput {
  title: String!
  body: String!
  sort: Sort
  paginate: Paginate
}

input Sort {
  column: String
}

input Paginate {
  skip: Int = 0
  take: Int = 10
}

type Mutation {
  createArticle(input: ArticleCreateInput!): ArticleCreateResult!
  updateArticle(input: ArticleUpdateInput!): ArticleUpdateResult!
  removeArticle(input: ArticleRemoveInput!): ArticleRemoveResult!
}

type ArticleCreateResult {
  entry: Article
}

input ArticleCreateInput {
  title: String!
  body: String!
}

type ArticleUpdateResult {
  entry: Article
}

input ArticleUpdateInput {
  id: ID!
  title: String!
  body: String!
}

type ArticleRemoveResult {
  entry: Article
}

input ArticleRemoveInput {
  id: ID!
}
```

#### `document.graphql`
```graphql
fragment ArticleFragment on Article {
  title
  slug
  body
  createdAt
  updatedAt
}
      

query showArticle($input: ArticleShowInput!) {
  showArticle(input: $input) {
    entry {
      ...ArticleFragment
    }
  }
}
            

query listArticle($input: ArticleListInput!) {
  listArticle(input: $input) {
    entries {
      ...ArticleFragment
    }
    total
  }
}
            

mutation createArticle($input: ArticleCreateInput!) {
  createArticle(input: $input) {
    entry {
      ...ArticleFragment
    }
  }
}
            

mutation updateArticle($input: ArticleUpdateInput!) {
  updateArticle(input: $input) {
    entry {
      ...ArticleFragment
    }
  }
}
            

mutation removeArticle($input: ArticleRemoveInput!) {
  removeArticle(input: $input) {
    entry {
      ...ArticleFragment
    }
  }
}
```