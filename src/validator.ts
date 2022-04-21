import ValidatorJS from 'validator';
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

export type IsDefined = {
  type: 'IsDefined';
  properties: {
    value: unknown;
  };
};

export type IsOptional = {
  type: 'IsOptional';
};

export type Equals = {
  type: 'Equals';
  properties: {
    comparison: unknown;
  };
};

export type NotEquals = {
  type: 'NotEquals';
  properties: {
    comparison: unknown;
  };
};

export type IsEmpty = {
  type: 'IsEmpty';
};

export type IsNotEmpty = {
  type: 'IsNotEmpty';
};

export type IsIn = {
  type: 'IsIn';
  properties: {
    values: Array<unknown>;
  };
};

export type IsNotIn = {
  type: 'IsNotIn';
  properties: {
    values: Array<unknown>;
  };
};

export type IsBoolean = {
  type: 'IsBoolean';
};

export type IsDate = {
  type: 'IsDate';
};

export type IsString = {
  type: 'IsDate';
};

export type IsNumber = {
  type: 'IsNumber';
  properties: {
    options: ValidatorJS.IsNumericOptions;
  };
};

export type IsInt = {
  type: 'IsInt';
};

export type IsArray = {
  type: 'IsArray';
};

export type IsEnum = {
  type: 'IsEnum';
  properties: {
    entity: Record<string, unknown>;
  };
};

export type IsDivisibleBy = {
  type: 'IsDivisibleBy';
  properties: {
    num: number;
  };
};

export type IsPositive = {
  type: 'IsPositive';
};

export type IsNegative = {
  type: 'IsNegative';
};

export type Min = {
  type: 'Min';
  properties: {
    min: number;
  };
};

export type Max = {
  type: 'Max';
  properties: {
    max: number;
  };
};

export type MinDate = {
  type: 'MinDate';
  properties: {
    date: Date;
  };
};

export type MaxDate = {
  type: 'MaxDate';
  properties: {
    date: Date;
  };
};

export type IsBooleanString = {
  type: 'IsBooleanString';
};

export type IsDateString = {
  type: 'IsDateString';
};

export type IsNumberString = {
  type: 'IsNumberString';
  properties: {
    options: ValidatorJS.IsNumericOptions;
  };
};

export type Contains = {
  type: 'Contains';
  properties: {
    seed: string;
  };
};

export type NotContains = {
  type: 'NotContains';
  properties: {
    seed: string;
  };
};

export type IsAlpha = {
  type: 'IsAlpha';
};

export type IsAlphanumeric = {
  type: 'IsAlphanumeric';
};

export type IsDecimal = {
  type: 'IsDecimal';
  properties: {
    options: ValidatorJS.IsDecimalOptions;
  };
};

export type IsAscii = {
  type: 'IsAscii';
};

export type IsBase32 = {
  type: 'IsBase32';
};

export type IsBase64 = {
  type: 'IsBase64';
};

export type IsIBAN = {
  type: 'IsIBAN';
};

export type IsBIC = {
  type: 'IsBIC';
};

export type IsByteLength = {
  type: 'IsByteLength';
  properties: {
    min: number;
    max?: number;
  };
};

export type IsCreditCard = {
  type: 'IsCreditCard';
};

export type IsCurrency = {
  type: 'IsCurrency';
  properties: {
    options: ValidatorJS.IsCurrencyOptions;
  };
};

export type IsEthereumAddress = {
  type: 'IsEthereumAddress';
};

export type IsBtcAddress = {
  type: 'IsBtcAddress';
};

export type IsDataURI = {
  type: 'IsDataURI';
};

export type IsEmail = {
  type: 'IsEmail';
  properties: {
    options: ValidatorJS.IsEmailOptions;
  };
};

export type IsFQDN = {
  type: 'IsFQDN';
  properties: {
    options: ValidatorJS.IsFQDNOptions;
  };
};

export type IsFullWidth = {
  type: 'IsFullWidth';
};

export type IsHalfWidth = {
  type: 'IsHalfWidth';
};

export type IsVariableWidth = {
  type: 'IsVariableWidth';
};

export type IsHexColor = {
  type: 'IsHexColor';
};

export type IsHSLColor = {
  type: 'IsHSLColor';
};

export type IsRgbColor = {
  type: 'IsRgbColor';
  properties?: {
    includePercentValues: boolean;
  };
};

export type IsIdentityCard = {
  type: 'IsIdentityCard';
  properties?: {
    locale: string;
  };
};

export type IsPassportNumber = {
  type: 'IsPassportNumber';
  properties?: {
    countryCode: string;
  };
};

export type IsPostalCode = {
  type: 'IsPostalCode';
  properties?: {
    locale: string;
  };
};

export type IsHexadecimal = {
  type: 'IsHexadecimal';
};

export type IsOctal = {
  type: 'IsOctal';
};

export type IsMACAddress = {
  type: 'IsMACAddress';
  properties?: {
    options: ValidatorJS.IsMACAddressOptions;
  };
};

export type IsIP = {
  type: 'IsIP';
  properties?: {
    version: '4' | '6';
  };
};

export type IsPort = {
  type: 'IsPort';
};

export type IsISBN = {
  type: 'IsISBN';
};

export type IsEAN = {
  type: 'IsEAN';
};

export type IsISIN = {
  type: 'IsISIN';
};

export type IsISO8601 = {
  type: 'IsISO8601';
  properties?: {
    options: ValidatorJS.IsISO8601Options;
  };
};

export type IsJSON = {
  type: 'IsJSON';
};

export type IsJWT = {
  type: 'IsJWT';
};

export type IsObject = {
  type: 'IsObject';
};

export type IsNotEmptyObject = {
  type: 'IsNotEmptyObject';
};

export type IsLowercase = {
  type: 'IsLowercase';
};

export type IsLatLong = {
  type: 'IsLatLong';
};

export type IsLatitude = {
  type: 'IsLatitude';
};

export type IsLongitude = {
  type: 'IsLongitude';
};

export type IsMobilePhone = {
  type: 'IsMobilePhone';
  properties: {
    locale: string;
  };
};

export type IsISO31661Alpha2 = {
  type: 'IsISO31661Alpha2';
};

export type IsISO31661Alpha3 = {
  type: 'IsISO31661Alpha3';
};

export type IsLocale = {
  type: 'IsLocale';
};

export type IsPhoneNumber = {
  type: 'IsPhoneNumber';
  properties: {
    locale: string;
  };
};

export type IsMongoId = {
  type: 'IsMongoId';
};

export type IsMultibyte = {
  type: 'IsMultibyte';
};

export type IsSurrogatePair = {
  type: 'IsSurrogatePair';
};

export type IsUrl = {
  type: 'IsUrl';
  properties?: {
    options: ValidatorJS.IsURLOptions;
  };
};

export type IsMagnetURI = {
  type: 'IsMagnetURI';
};

export type IsUUID = {
  type: 'IsUUID';
  properties: {
    version?: '3' | '4' | '5' | 'all';
  };
};

export type IsFirebasePushId = {
  type: 'IsFirebasePushId';
};

export type IsUppercase = {
  type: 'IsUppercase';
};

export type Length = {
  type: 'Length';
  properties: {
    min: number;
    max?: number;
  };
};

export type MinLength = {
  type: 'MinLength';
  properties: {
    min: number;
  };
};

export type MaxLength = {
  type: 'MaxLength';
  properties: {
    max: number;
  };
};

export type Matches = {
  type: 'Matches';
  properties: {
    pattern: RegExp;
    modifiers?: string;
  };
};

export type IsMilitaryTime = {
  type: 'IsMilitaryTime';
};

export type IsHash = {
  type: 'IsHash';
  properties: {
    algorithm: string;
  };
};

export type IsMimeType = {
  type: 'IsMimeType';
};

export type IsSemVer = {
  type: 'IsSemVer';
};

export type IsISSN = {
  type: 'IsISSN';
  properties?: {
    options: ValidatorJS.IsISSNOptions;
  };
};

export type IsISRC = {
  type: 'IsISRC';
};

export type IsRFC3339 = {
  type: 'IsRFC3339';
};

export type ArrayContains = {
  type: 'ArrayContains';
  properties: {
    values: Array<unknown>;
  };
};

export type ArrayNotContains = {
  type: 'ArrayNotContains';
  properties: {
    values: Array<unknown>;
  };
};

export type ArrayNotEmpty = {
  type: 'ArrayNotEmpty';
};

export type ArrayMinSize = {
  type: 'ArrayMinSize';
  properties: {
    min: number;
  };
};

export type ArrayMaxSize = {
  type: 'ArrayMaxSize';
  properties: {
    max: number;
  };
};

export type ArrayUnique = {
  type: 'ArrayUnique';
  properties: {
    identifier: (e: unknown) => unknown;
  };
};

export type IsInstance = {
  type: 'IsInstance';
  properties: {
    value: unknown;
  };
};

export type Allow = {
  type: 'Allow';
};

export type Validator =
  | IsDefined
  | IsOptional
  | Equals
  | NotEquals
  | IsEmpty
  | IsNotEmpty
  | IsIn
  | IsNotIn
  | IsBoolean
  | IsDate
  | IsString
  | IsNumber
  | IsInt
  | IsArray
  | IsEnum
  | IsDivisibleBy
  | IsPositive
  | IsNegative
  | Min
  | Max
  | MinDate
  | MaxDate
  | IsBooleanString
  | IsDateString
  | IsNumberString
  | Contains
  | NotContains
  | IsAlpha
  | IsAlphanumeric
  | IsDecimal
  | IsAscii
  | IsBase32
  | IsBase64
  | IsIBAN
  | IsBIC
  | IsByteLength
  | IsCreditCard
  | IsCurrency
  | IsEthereumAddress
  | IsBtcAddress
  | IsDataURI
  | IsEmail
  | IsFQDN
  | IsFullWidth
  | IsHalfWidth
  | IsVariableWidth
  | IsHexColor
  | IsHSLColor
  | IsRgbColor
  | IsIdentityCard
  | IsPassportNumber
  | IsPostalCode
  | IsHexadecimal
  | IsOctal
  | IsMACAddress
  | IsIP
  | IsPort
  | IsISBN
  | IsEAN
  | IsISIN
  | IsISO8601
  | IsJSON
  | IsJWT
  | IsObject
  | IsNotEmptyObject
  | IsLowercase
  | IsLatLong
  | IsLatitude
  | IsLongitude
  | IsMobilePhone
  | IsISO31661Alpha2
  | IsISO31661Alpha3
  | IsLocale
  | IsPhoneNumber
  | IsMongoId
  | IsMultibyte
  | IsSurrogatePair
  | IsUrl
  | IsMagnetURI
  | IsUUID
  | IsFirebasePushId
  | IsUppercase
  | Length
  | MinLength
  | MaxLength
  | Matches
  | IsMilitaryTime
  | IsHash
  | IsMimeType
  | IsSemVer
  | IsISSN
  | IsISRC
  | IsRFC3339
  | ArrayContains
  | ArrayNotContains
  | ArrayNotEmpty
  | ArrayMinSize
  | ArrayMaxSize
  | ArrayUnique
  | IsInstance
  | Allow;
