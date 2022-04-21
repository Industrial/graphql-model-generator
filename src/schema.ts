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
        validators: {
          type: 'array',
          items: {
            $ref: '#/$defs/Validator',
          },
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

    Validator: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          enum: [
            'Allow',
            'ArrayContains',
            'ArrayMaxSize',
            'ArrayMinSize',
            'ArrayNotContains',
            'ArrayNotEmpty',
            'ArrayUnique',
            'Contains',
            'Equals',
            'IsAlpha',
            'IsAlphanumeric',
            'IsArray',
            'IsAscii',
            'IsBIC',
            'IsBase32',
            'IsBase64',
            'IsBoolean',
            'IsBooleanString',
            'IsBtcAddress',
            'IsByteLength',
            'IsCreditCard',
            'IsCurrency',
            'IsDataURI',
            'IsDate',
            'IsDateString',
            'IsDecimal',
            'IsDefined',
            'IsDivisibleBy',
            'IsEAN',
            'IsEmail',
            'IsEmpty',
            'IsEnum',
            'IsEthereumAddress',
            'IsFQDN',
            'IsFirebasePushId',
            'IsFullWidth',
            'IsHSLColor',
            'IsHalfWidth',
            'IsHash',
            'IsHexColor',
            'IsHexadecimal',
            'IsIBAN',
            'IsIP',
            'IsISBN',
            'IsISIN',
            'IsISO31661Alpha2',
            'IsISO31661Alpha3',
            'IsISO8601',
            'IsISRC',
            'IsISSN',
            'IsIdentityCard',
            'IsIn',
            'IsInstance',
            'IsInt',
            'IsJSON',
            'IsJWT',
            'IsLatLong',
            'IsLatitude',
            'IsLocale',
            'IsLongitude',
            'IsLowercase',
            'IsMACAddress',
            'IsMagnetURI',
            'IsMilitaryTime',
            'IsMimeType',
            'IsMobilePhone',
            'IsMongoId',
            'IsMultibyte',
            'IsNegative',
            'IsNotEmpty',
            'IsNotEmptyObject',
            'IsNotIn',
            'IsNumber',
            'IsNumberString',
            'IsNumberString',
            'IsObject',
            'IsOctal',
            'IsOptional',
            'IsPassportNumber',
            'IsPhoneNumber',
            'IsPort',
            'IsPositive',
            'IsPostalCode',
            'IsRFC3339',
            'IsRgbColor',
            'IsSemVer',
            'IsString',
            'IsSurrogatePair',
            'IsUUID',
            'IsUppercase',
            'IsUrl',
            'IsVariableWidth',
            'Length',
            'Matches',
            'Max',
            'MaxDate',
            'MaxLength',
            'Min',
            'MinDate',
            'MinLength',
            'NotContains',
            'NotEquals',
          ],
        },
        properties: {
          type: 'object',
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
};
