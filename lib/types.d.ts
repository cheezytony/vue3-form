export declare type FormInputValue = string | number | boolean | null;
export declare type RuleName = 'alphabets' | 'alphabetsLowercase' | 'alphabetsLowercaseOnly' | 'alphabetsOnly' | 'alphabetsUppercase' | 'alphabetsUppercaseOnly' | 'arrayContains' | `arrayContains:${string}` | 'arrayDoesntContain' | `arrayDoesntContain:${string}` | 'date' | 'dateAfter' | `dateAfter:${string}` | 'dateBefore' | `dateBefore:${string}` | 'dateBetween' | `dateBetween:${string}` | 'dateExact' | `dateExact:${string}` | 'dateFormat' | `dateFormat:${string}` | 'email' | 'exact' | `exact:${string}` | 'file' | 'money' | 'name' | 'noSequence' | 'nullable' | 'numbers' | 'numbersOnly' | 'numberBetween' | `numberBetween:${number}:${number}` | 'numberExact' | `numberExact:${number}` | 'numberMin' | `numberMin:${number}` | 'numberMax' | `numberMax:${number}` | 'phone' | 'required' | 'specialCharacters' | 'specialCharactersOnly' | 'stringLength' | `stringLength:${number}` | 'stringMax' | `stringMax:${number}` | 'stringMin' | `stringMin:${number}` | 'url';
export declare type FormPropertyKey = 'error' | 'loading' | 'success' | 'touched' | 'valid';
export declare type ServerErrors = Record<string, string[]>;
export declare type ValidationCallback = (status: boolean) => void;
export interface FormField {
    rules?: [RuleName | Rule];
    value?: FormInputValue;
}
export interface FormFieldNormalized {
    name: string;
    rules: [RuleName | Rule];
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
export interface Form {
    fields: Record<string, FormFieldNormalized>;
    error: string | null;
    success: string | null;
    loading: boolean;
    touched: boolean;
    valid: boolean;
    __base: {
        keys: Record<string, FormField>;
        extra: Record<string, unknown>;
    };
}
export interface Rule {
    test: (field: FormFieldNormalized, args: string[], form: Form) => boolean;
    message: (field: FormFieldNormalized, args: string[], form: Form) => string;
    props?: Record<string, string | number>;
}
