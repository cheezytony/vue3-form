export type FormInputValue = unknown;

export type RuleName =
  | 'alphabets'
  | 'alphabetsLowercase'
  | 'alphabetsLowercaseOnly'
  | 'alphabetsOnly'
  | 'alphabetsUppercase'
  | 'alphabetsUppercaseOnly'
  | 'array'
  | 'arrayContains'
  | `arrayContains:${string}`
  | 'arrayDoesntContain'
  | `arrayDoesntContain:${string}`
  | 'boolean'
  | 'date'
  | 'dateAfter'
  | `dateAfter:${string}`
  | 'dateBefore'
  | `dateBefore:${string}`
  | 'dateBetween'
  | `dateBetween:${string}`
  | 'dateExact'
  | `dateExact:${string}`
  | 'dateFormat'
  | `dateFormat:${string}`
  | 'different'
  | 'email'
  | 'exact'
  | `exact:${string}`
  | 'false'
  | 'file'
  | 'files'
  | 'filesLength'
  | 'filesMax'
  | 'filesMin'
  | 'money'
  | 'name'
  | 'noSequence'
  | 'nullable'
  | 'numberBetween'
  | `numberBetween:${number},${number}`
  | 'numberExact'
  | `numberExact:${number}`
  | 'numberMax'
  | `numberMax:${number}`
  | 'numberMin'
  | `numberMin:${number}`
  | 'numbers'
  | 'numbersOnly'
  | 'phone'
  | 'required'
  | 'specialCharacters'
  | 'specialCharactersOnly'
  | 'stringLength'
  | `stringLength:${number}`
  | 'stringMax'
  | `stringMax:${number}`
  | 'stringMin'
  | `stringMin:${number}`
  | 'true'
  | 'url';

export type FormPropertyKey =
  | 'error'
  | 'loading'
  | 'success'
  | 'touched'
  | 'valid';

export type ServerErrors = Record<string, string[]>;

export type ValidationCallback = (status: boolean) => void;

export interface FormField {
  rules?: (RuleName | Rule)[];
  value?: FormInputValue;
}

export interface FormFieldNormalized {
  name: string;
  rules: (RuleName | Rule)[];
  value: FormInputValue;
  errors: Record<string, string> | null;
  serverErrors: string[] | null;
}

export interface FormProperties {
  error?: string | null;
  success?: string | null;
  loading?: boolean;
  touched?: boolean;
  valid?: boolean;
}

export interface Form<TKey extends string = string> {
  fields: Record<TKey, FormFieldNormalized>;
  error: string | null;
  success: string | null;
  loading: boolean;
  touched: boolean;
  valid: boolean;
  __base: {
    keys: Record<TKey, FormField>;
    extra: Record<string, unknown>;
  };
}

export interface Rule<TForm extends Form = Form> {
  test: (field: FormFieldNormalized, args: string[], form: TForm) => boolean;
  message: (field: FormFieldNormalized, args: string[], form: TForm) => string;
  props?: Record<string, string | number>;
}
