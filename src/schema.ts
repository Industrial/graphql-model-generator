export const schema = {
  type: 'array',
  items: {
    $ref: '#/$defs/Model',
  },

  $defs: {
    Model: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        properties: {
          type: 'array',
          items: {
            $ref: '#/$defs/Property',
          },
        },
        relationships: {
          type: 'array',
          items: {
            $ref: '#/$defs/Relationship',
          },
        },
        operations: {
          type: 'array',
          items: {
            $ref: '#/$defs/Operation',
          },
        },
      },
      required: ['name', 'properties'],
      additionalProperties: false,
    },

    Property: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          $ref: '#/$defs/PropertyType',
        },
        list: {
          type: 'boolean',
        },
        required: {
          type: 'boolean',
        },
        unique: {
          type: 'boolean',
        },
        permissions: {
          type: 'array',
          items: {
            $ref: '#/$defs/Permission',
          },
        },
      },
      required: ['name', 'type'],
      additionalProperties: false,
    },

    PropertyType: {
      type: 'string',
      enum: [
        'Int',
        'Float',
        'String',
        'Boolean',
        'ID',
        'DateTime',
      ],
    },

    Relationship: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
        list: {
          type: 'boolean',
        },
        required: {
          type: 'boolean',
        },
      },
      required: ['name', 'type'],
      additionalProperties: false,
    },

    Operation: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          $ref: '#/$defs/OperationType',
        },
        arguments: {
          type: 'array',
          items: {
            $ref: '#/$defs/Argument',
          },
        },
        permissions: {
          type: 'array',
          items: {
            $ref: '#/$defs/Permission',
          },
        },
      },
      required: ['name', 'type'],
      additionalProperties: false,
    },

    OperationType: {
      type: 'string',
      enum: ['create', 'show', 'list', 'update', 'remove'],
    },

    Argument: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          $ref: '#/$defs/PropertyType',
        },
        list: {
          type: 'boolean',
        },
        required: {
          type: 'boolean',
        },
      },
      required: ['name', 'type'],
      additionalProperties: false,
    },

    Permission: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
        },
        type: {
          $ref: '#/$defs/PermissionType',
        },
      },
      required: ['role', 'type'],
      additionalProperties: false,
    },

    PermissionType: {
      type: 'string',
      enum: ['allow', 'deny'],
    },
  },
};
