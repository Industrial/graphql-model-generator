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

export interface Validator {
  name: string;
  properties?: Record<string, unknown>;
}

export type Signature = (
  className: string,
  propertyName: string,
  validator: Validator,
) => string;

export const signatures: Record<string, Signature> = {};

const emptyString = <T extends Validator>(_properties: T['properties']) =>
  '\'\'';

export function addSignature<T extends Validator>(
  key: string,
  value: (properties: T['properties']) => string = emptyString,
) {
  signatures[key] = (klass, name, validator) =>
    `ClassValidator.${key}(${
      value(validator.properties)
    })(${klass}, '${name}')`;
}

export interface IsDefined extends Validator {
  type: 'IsDefined';
  properties: {
    value: unknown;
  };
}
addSignature<IsDefined>('IsDefined', (properties) => `${properties.value}`);

export interface IsOptional extends Validator {
  type: 'IsOptional';
}
addSignature<Equals>('Equals');

export interface Equals extends Validator {
  type: 'Equals';
  properties: {
    comparison: unknown;
  };
}
addSignature<Equals>('Equals', ({ comparison }) => `${comparison}`);

export interface NotEquals extends Validator {
  type: 'NotEquals';
  properties: {
    comparison: unknown;
  };
}
addSignature<NotEquals>(
  'NotEquals',
  ({ comparison }) => `${comparison}`,
);

export interface IsEmpty extends Validator {
  type: 'IsEmpty';
}
addSignature<IsEmpty>('IsEmpty');

export interface IsNotEmpty extends Validator {
  type: 'IsNotEmpty';
}
addSignature<IsNotEmpty>('IsNotEmpty');

export interface IsIn extends Validator {
  type: 'IsIn';
  properties: {
    values: Array<unknown>;
  };
}
addSignature<IsIn>(
  'IsIn',
  ({ values }) => JSON.stringify(values),
);

export interface IsNotIn extends Validator {
  type: 'IsNotIn';
  properties: {
    values: Array<unknown>;
  };
}
addSignature<IsNotIn>(
  'IsNotIn',
  ({ values }) => JSON.stringify(values),
);

export interface IsBoolean extends Validator {
  type: 'IsBoolean';
}
addSignature<IsBoolean>('IsBoolean');

export interface IsDate extends Validator {
  type: 'IsDate';
}
addSignature<IsDate>('IsDate');

export interface IsString extends Validator {
  type: 'IsDate';
}
addSignature<IsString>('IsString');

export interface IsNumber extends Validator {
  type: 'IsNumber';
  properties: {
    options: ValidatorJS.IsNumericOptions;
  };
}
addSignature<IsNumber>(
  'IsNumber',
  ({ options }) => JSON.stringify(options),
);

export interface IsInt extends Validator {
  type: 'IsInt';
}
addSignature<IsInt>('IsInt');

export interface IsArray extends Validator {
  type: 'IsArray';
}
addSignature<IsArray>('IsArray');

export interface IsEnum extends Validator {
  type: 'IsEnum';
  properties: {
    entity: Record<string, unknown>;
  };
}
addSignature<IsEnum>(
  'IsEnum',
  ({ entity }) => JSON.stringify(entity),
);

export interface IsDivisibleBy extends Validator {
  type: 'IsDivisibleBy';
  properties: {
    num: number;
  };
}
addSignature<IsDivisibleBy>(
  'IsDivisibleBy',
  ({ num }) => `${num}`,
);

export interface IsPositive extends Validator {
  type: 'IsPositive';
}
addSignature<IsPositive>('IsPositive');

export interface IsNegative extends Validator {
  type: 'IsNegative';
}
addSignature<IsNegative>('IsNegative');

export interface Min extends Validator {
  type: 'Min';
  properties: {
    min: number;
  };
}
addSignature<Min>(
  'Min',
  ({ min }) => `${min}`,
);

export interface Max extends Validator {
  type: 'Max';
  properties: {
    max: number;
  };
}
addSignature<Max>(
  'Max',
  ({ max }) => `${max}`,
);

export interface MinDate extends Validator {
  type: 'MinDate';
  properties: {
    date: Date;
  };
}
addSignature<MinDate>(
  'MinDate',
  ({ date }) => `${date.toISOString()}`,
);

export interface MaxDate extends Validator {
  type: 'MaxDate';
  properties: {
    date: Date;
  };
}
addSignature<MaxDate>(
  'MaxDate',
  ({ date }) => `${date.toISOString()}`,
);

export interface IsBooleanString extends Validator {
  type: 'IsBooleanString';
}
addSignature<IsBooleanString>('IsBooleanString');

export interface IsDateString extends Validator {
  type: 'IsDateString';
}
addSignature<IsDateString>('IsDateString');

export interface IsNumberString extends Validator {
  type: 'IsNumberString';
  properties: {
    options: ValidatorJS.IsNumericOptions;
  };
}
addSignature<IsNumberString>(
  'IsNumberString',
  ({ options }) => JSON.stringify(options),
);

export interface Contains extends Validator {
  type: 'Contains';
  properties: {
    seed: string;
  };
}
addSignature<Contains>(
  'Contains',
  ({ seed }) => `${seed}`,
);

export interface NotContains extends Validator {
  type: 'NotContains';
  properties: {
    seed: string;
  };
}
addSignature<NotContains>(
  'Contains',
  ({ seed }) => `${seed}`,
);

export interface IsAlpha extends Validator {
  type: 'IsAlpha';
}
addSignature<IsAlpha>('IsAlpha');

export interface IsAlphanumeric extends Validator {
  type: 'IsAlphanumeric';
}
addSignature<IsAlphanumeric>('IsAlphanumeric');

export interface IsDecimal extends Validator {
  type: 'IsDecimal';
  properties: {
    options: ValidatorJS.IsDecimalOptions;
  };
}
addSignature<IsDecimal>(
  'IsDecimal',
  ({ options }) => JSON.stringify(options),
);

export interface IsAscii extends Validator {
  type: 'IsAscii';
}
addSignature<IsAscii>('IsAscii');

export interface IsBase32 extends Validator {
  type: 'IsBase32';
}
addSignature<IsBase32>('IsBase32');

export interface IsBase64 extends Validator {
  type: 'IsBase64';
}
addSignature<IsBase64>('IsBase64');

export interface IsIBAN extends Validator {
  type: 'IsIBAN';
}
addSignature<IsIBAN>('IsIBAN');

export interface IsBIC extends Validator {
  type: 'IsBIC';
}
addSignature<IsBIC>('IsBIC');

export interface IsByteLength extends Validator {
  type: 'IsByteLength';
  properties: {
    min: number;
    max?: number;
  };
}
addSignature<IsByteLength>(
  'IsByteLength',
  ({ min, max }) => max ? `${min}, ${max}` : `${min}`,
);

export interface IsCreditCard extends Validator {
  type: 'IsCreditCard';
}
addSignature<IsCreditCard>('IsCreditCard');

export interface IsCurrency extends Validator {
  type: 'IsCurrency';
  properties: {
    options: ValidatorJS.IsCurrencyOptions;
  };
}
addSignature<IsCurrency>(
  'IsCurrency',
  ({ options }) => JSON.stringify(options),
);

export interface IsEthereumAddress extends Validator {
  type: 'IsEthereumAddress';
}
addSignature<IsEthereumAddress>('IsEthereumAddress');

export interface IsBtcAddress extends Validator {
  type: 'IsBtcAddress';
}
addSignature<IsBtcAddress>('IsBtcAddress');

export interface IsDataURI extends Validator {
  type: 'IsDataURI';
}
addSignature<IsDataURI>('IsDataURI');

export interface IsEmail extends Validator {
  type: 'IsEmail';
  properties: {
    options: ValidatorJS.IsEmailOptions;
  };
}
addSignature<IsEmail>(
  'IsEmail',
  ({ options }) => JSON.stringify(options),
);

export interface IsFQDN extends Validator {
  type: 'IsFQDN';
  properties: {
    options: ValidatorJS.IsFQDNOptions;
  };
}
addSignature<IsFQDN>(
  'IsFQDN',
  ({ options }) => JSON.stringify(options),
);

export interface IsFullWidth extends Validator {
  type: 'IsFullWidth';
}
addSignature<IsFullWidth>('IsFullWidth');

export interface IsHalfWidth extends Validator {
  type: 'IsHalfWidth';
}
addSignature<IsHalfWidth>('IsHalfWidth');

export interface IsVariableWidth extends Validator {
  type: 'IsVariableWidth';
}
addSignature<IsVariableWidth>('IsVariableWidth');

export interface IsHexColor extends Validator {
  type: 'IsHexColor';
}
addSignature<IsHexColor>('IsHexColor');

export interface IsHSLColor extends Validator {
  type: 'IsHSLColor';
}
addSignature<IsHSLColor>('IsHSLColor');

export interface IsRgbColor extends Validator {
  type: 'IsRgbColor';
  properties?: {
    includePercentValues: boolean;
  };
}
addSignature<IsHSLColor>(
  'IsHSLColor',
  (properties) => properties ? `${properties.includePercentValues}` : ``,
);

export interface IsIdentityCard extends Validator {
  type: 'IsIdentityCard';
  properties?: {
    locale: string;
  };
}
addSignature<IsHSLColor>(
  'IsHSLColor',
  (properties) => properties ? `${properties.locale}` : ``,
);

export interface IsPassportNumber extends Validator {
  type: 'IsPassportNumber';
  properties?: {
    countryCode: string;
  };
}
addSignature<IsPassportNumber>(
  'IsPassportNumber',
  (properties) => properties ? `${properties.countryCode}` : ``,
);

export interface IsPostalCode extends Validator {
  type: 'IsPostalCode';
  properties?: {
    locale: string;
  };
}
addSignature<IsPostalCode>(
  'IsPostalCode',
  (properties) => properties ? `${properties.locale}` : ``,
);

export interface IsHexadecimal extends Validator {
  type: 'IsHexadecimal';
}
addSignature<IsHexadecimal>('IsHexadecimal');

export interface IsOctal extends Validator {
  type: 'IsOctal';
}
addSignature<IsOctal>('IsOctal');

export interface IsMACAddress extends Validator {
  type: 'IsMACAddress';
  properties?: {
    options: ValidatorJS.IsMACAddressOptions;
  };
}
addSignature<IsMACAddress>(
  'IsMACAddress',
  (properties) => properties ? JSON.stringify(properties.options) : ``,
);

export interface IsIP extends Validator {
  type: 'IsIP';
  properties?: {
    version: '4' | '6';
  };
}
addSignature<IsIP>(
  'IsIP',
  (properties) => properties ? `${properties.version}` : ``,
);

export interface IsPort extends Validator {
  type: 'IsPort';
}
addSignature<IsPort>('IsPort');

export interface IsISBN extends Validator {
  type: 'IsISBN';
}
addSignature<IsISBN>('IsISBN');

export interface IsEAN extends Validator {
  type: 'IsEAN';
}
addSignature<IsEAN>('IsEAN');

export interface IsISIN extends Validator {
  type: 'IsISIN';
}
addSignature<IsISIN>('IsISIN');

export interface IsISO8601 extends Validator {
  type: 'IsISO8601';
  properties?: {
    options: ValidatorJS.IsISO8601Options;
  };
}
addSignature<IsISO8601>(
  'IsISO8601',
  (properties) => properties ? JSON.stringify(properties.options) : '',
);

export interface IsJSON extends Validator {
  type: 'IsJSON';
}
addSignature<IsJSON>('IsJSON');

export interface IsJWT extends Validator {
  type: 'IsJWT';
}
addSignature<IsJWT>('IsJWT');

export interface IsObject extends Validator {
  type: 'IsObject';
}
addSignature<IsObject>('IsObject');

export interface IsNotEmptyObject extends Validator {
  type: 'IsNotEmptyObject';
}
addSignature<IsNotEmptyObject>('IsNotEmptyObject');

export interface IsLowercase extends Validator {
  type: 'IsLowercase';
}
addSignature<IsLowercase>('IsLowercase');

export interface IsLatLong extends Validator {
  type: 'IsLatLong';
}
addSignature<IsLatLong>('IsLatLong');

export interface IsLatitude extends Validator {
  type: 'IsLatitude';
}
addSignature<IsLatitude>('IsLatitude');

export interface IsLongitude extends Validator {
  type: 'IsLongitude';
}
addSignature<IsLongitude>('IsLongitude');

export interface IsMobilePhone extends Validator {
  type: 'IsMobilePhone';
  properties: {
    locale: string;
  };
}
addSignature<IsMobilePhone>(
  'IsMobilePhone',
  ({ locale }) => locale,
);

export interface IsISO31661Alpha2 extends Validator {
  type: 'IsISO31661Alpha2';
}
addSignature<IsISO31661Alpha2>('IsISO31661Alpha2');

export interface IsISO31661Alpha3 extends Validator {
  type: 'IsISO31661Alpha3';
}
addSignature<IsISO31661Alpha3>('IsISO31661Alpha3');

export interface IsLocale extends Validator {
  type: 'IsLocale';
}
addSignature<IsLocale>('IsLocale');

export interface IsPhoneNumber extends Validator {
  type: 'IsPhoneNumber';
  properties: {
    locale: string;
  };
}
addSignature<IsPhoneNumber>(
  'IsPhoneNumber',
  ({ locale }) => locale,
);

export interface IsMongoId extends Validator {
  type: 'IsMongoId';
}
addSignature<IsMongoId>('IsMongoId');

export interface IsMultibyte extends Validator {
  type: 'IsMultibyte';
}
addSignature<IsMultibyte>('IsMultibyte');

export interface IsSurrogatePair extends Validator {
  type: 'IsSurrogatePair';
}
addSignature<IsSurrogatePair>('IsSurrogatePair');

export interface IsUrl extends Validator {
  type: 'IsUrl';
  properties?: {
    options: ValidatorJS.IsURLOptions;
  };
}
addSignature<IsUrl>(
  'IsUrl',
  (properties) => properties ? JSON.stringify(properties.options) : '',
);

export interface IsMagnetURI extends Validator {
  type: 'IsMagnetURI';
}
addSignature<IsMagnetURI>('IsMagnetURI');

export interface IsUUID extends Validator {
  type: 'IsUUID';
  properties?: {
    version: '3' | '4' | '5' | 'all';
  };
}
addSignature<IsUUID>(
  'IsUUID',
  (properties) => properties ? `${properties.version}` : ``,
);

export interface IsFirebasePushId extends Validator {
  type: 'IsFirebasePushId';
}
addSignature<IsFirebasePushId>('IsFirebasePushId');

export interface IsUppercase extends Validator {
  type: 'IsUppercase';
}
addSignature<IsUppercase>('IsUppercase');

export interface Length extends Validator {
  type: 'Length';
  properties: {
    min: number;
    max?: number;
  };
}
addSignature<Length>(
  'Length',
  ({ min, max }) => max ? `${min}, ${max}` : `${min}`,
);

export interface MinLength extends Validator {
  type: 'MinLength';
  properties: {
    min: number;
  };
}
addSignature<MinLength>('MinLength', ({ min }) => `${min}`);

export interface MaxLength extends Validator {
  type: 'MaxLength';
  properties: {
    max: number;
  };
}
addSignature<MaxLength>('MaxLength', ({ max }) => `${max}`);

// export interface Matches extends Validator {
//   type: 'Matches';
//   properties: {
//     pattern: RegExp;
//     modifiers?: string;
//   };
// };
// classPropertyDecoratorSignatures.Matches = (
//   klass,
//   name,
//   properties: Matches['properties'],
// ) => {
//   if (properties.modifiers) {
//     return `Matches(${klass}, ${name})(${properties.pattern}, ${properties.modifiers})`;
//   } else {
//     return `Matches(${klass}, ${name})(${properties.pattern})`;
//   }
// };

export interface IsMilitaryTime extends Validator {
  type: 'IsMilitaryTime';
}
addSignature<IsMilitaryTime>('IsMilitaryTime');

export interface IsHash extends Validator {
  type: 'IsHash';
  properties: {
    algorithm: string;
  };
}
addSignature<IsHash>('IsHash', ({ algorithm }) => `${algorithm}`);

export interface IsMimeType extends Validator {
  type: 'IsMimeType';
}
addSignature<IsMimeType>('IsMimeType');

export interface IsSemVer extends Validator {
  type: 'IsSemVer';
}
addSignature<IsSemVer>('IsSemVer');

export interface IsISSN extends Validator {
  type: 'IsISSN';
  properties?: {
    options: ValidatorJS.IsISSNOptions;
  };
}
addSignature<IsISSN>(
  'IsISSN',
  (properties) => properties ? JSON.stringify(properties.options) : '',
);

export interface IsISRC extends Validator {
  type: 'IsISRC';
}
addSignature<IsISRC>('IsISRC');

export interface IsRFC3339 extends Validator {
  type: 'IsRFC3339';
}
addSignature<IsRFC3339>('IsRFC3339');

export interface ArrayContains extends Validator {
  type: 'ArrayContains';
  properties: {
    values: Array<unknown>;
  };
}
addSignature<ArrayContains>(
  'ArrayContains',
  ({ values }) => JSON.stringify(values),
);

export interface ArrayNotContains extends Validator {
  type: 'ArrayNotContains';
  properties: {
    values: Array<unknown>;
  };
}
addSignature<ArrayNotContains>(
  'ArrayNotContains',
  ({ values }) => JSON.stringify(values),
);

export interface ArrayNotEmpty extends Validator {
  type: 'ArrayNotEmpty';
}
addSignature<ArrayNotEmpty>('ArrayNotEmpty');

export interface ArrayMinSize extends Validator {
  type: 'ArrayMinSize';
  properties: {
    min: number;
  };
}
addSignature<ArrayMinSize>(
  'ArrayMinSize',
  ({ min }) => `${min}`,
);

export interface ArrayMaxSize extends Validator {
  type: 'ArrayMaxSize';
  properties: {
    max: number;
  };
}
addSignature<ArrayMaxSize>(
  'ArrayMaxSize',
  ({ max }) => `${max}`,
);

// export interface ArrayUnique extends Validator {
//   type: 'ArrayUnique';
//   properties: {
//     identifier: (e: unknown) => unknown;
//   };
// };
// classPropertyDecoratorSignatures.ArrayUnique = (
//   klass,
//   name,
//   properties: ArrayUnique['properties'],
// ) => `ArrayUnique(${klass}, ${name})(${properties.max})`;

// export interface IsInstance extends Validator {
//   type: 'IsInstance';
//   properties: {
//     value: unknown;
//   };
// };

export interface Allow extends Validator {
  type: 'Allow';
}
addSignature<Allow>('Allow');

export type Validators =
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
  // | Matches
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
  // | ArrayUnique
  // | IsInstance
  | Allow;
