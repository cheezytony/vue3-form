import { reactive, ref, Ref, watch } from 'vue';

import {
  Form,
  FormField,
  FormFieldNormalized,
  FormInputValue,
  FormProperties,
  FormPropertyKey,
  Rule,
  RuleName,
  ServerErrors,
  ValidationCallback,
} from './types';

export {
  Form,
  FormField,
  FormFieldNormalized,
  FormInputValue,
  FormProperties,
  FormPropertyKey,
  Rule,
  RuleName,
  ServerErrors,
  ValidationCallback,
};

const SEQUENCES = ['abc', '123'];

export const ruleHub: Record<string, Rule> = {
  alphabets: {
    test: ({ value }) => !!value?.toString().match(/[a-z A-Z]/),
    message: () => 'this field must contain letters.',
  },
  alphabetsLowercase: {
    test: ({ value }) => !!value?.toString().match(/[a-z]/),
    message: () => 'this field must contain lowercase letters.',
  },
  alphabetsLowercaseOnly: {
    test: ({ value }) => !!value?.toString().match(/^[a-z]+$/),
    message: () => 'this field must contain only lowercase letters.',
  },
  alphabetsOnly: {
    test: ({ value }) => !!value?.toString().match(/^[a-z A-Z]+$/),
    message: () => 'this field must contain only letters.',
  },
  alphabetsUppercase: {
    test: ({ value }) => !!value?.toString().match(/[A-Z]/),
    message: () => 'this field must contain uppercase letters.',
  },
  alphabetsUppercaseOnly: {
    test: ({ value }) => !!value?.toString().match(/^[A-Z]+$/),
    message: () => 'this field must contain only uppercase letters.',
  },
  array: {
    test: ({ value }) => Array.isArray(value),
    message: () => 'this field has to be an array.',
  },
  arrayContains: {
    test: ({ value }, array) => array.indexOf(value as string) > -1,
    message: (name, array) =>
      `this field has to contain any of these ${array.join(', ')}.`,
  },
  arrayDoesntContain: {
    test: ({ value }, array) => array.indexOf(value as string) < 0,
    message: (name, array) =>
      `this field cannot contain any of these ${array.join(', ')}.`,
  },
  boolean: {
    test: ({ value }) => typeof value === 'boolean',
    message: () => 'this field has to be a boolean.',
  },
  date: {
    test: ({ value }) =>
      !!value && value?.constructor === Date || !!Date.parse(value as string),
    message: () => 'this field.',
  },
  different: {
    test: ({ value }, [fieldName], form) => {
      const field = form.fields[fieldName];
      if (!field) {
        throw new Error(`Field ${fieldName} not found in form fields.`);
      }

      return !!value && value !== field.value;
    },
    message: (field, [fieldName]) =>
      `this field should be the different from the ${fieldName} field.`,
  },
  email: {
    test: ({ value }) =>
      !!value
        ?.toString()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    message: () => 'this field has to be a valid email address.',
  },
  exact: {
    test: ({ value }, [fieldName], form) => {
      const field = form.fields[fieldName];
      if (!field) {
        throw new Error(`Field ${fieldName} not found in form fields.`);
      }

      return !!value && value === field.value;
    },
    message: (field, [fieldName]) =>
      `this field should be the same as the ${fieldName} field.`,
  },
  false: {
    test: ({ value }) => value === false,
    message: () => 'this field has to be false.',
  },
  file: {
    test: ({ value }) => value?.constructor === File,
    message: () => 'a file has to be chosen for this field.',
  },
  files: {
    test: ({ value }) => value?.constructor === FileList,
    message: () => 'this field should contain at least one file.',
  },
  filesLength: {
    test: ({ value }, [length]) => (value as FileList).length === Number(length),
    message: (field, [length]) =>
      `this field should contain exactly ${length} files.`,
  },
  filesMax: {
    test: ({ value }, [max]) => (value as FileList).length <= Number(max),
    message: (field, [max]) =>
      `this field should contain less than ${max} files.`,
  },
  filesMin: {
    test: ({ value }, [min]) => (value as FileList).length >= Number(min),
    message: (field, [min]) =>
      `this field should contain at least ${min} files.`,
  },
  money: {
    test: ({ value }) => !!value?.toString().match(/^\d+(\.\d{1,2})?$/),
    message: () => 'this field can only money format and in 2 decimal places.',
  },
  name: {
    test: ({ value }) => !!value?.toString().match(/\w{2}(\s\w{2})+/),
    message: () => 'this field has to be a valid full name.',
  },
  noSequence: {
    test: ({ value }) =>
      !value?.toString()?.match(new RegExp(SEQUENCES.join('|'))),
    message: () => 'this field must not contain simple sequences like abc, 123',
  },
  nullable: {
    test: () => true,
    message: () => '',
  },
  numberBetween: {
    test: ({ value }, [start, end]) =>
      Number(value) >= Number(start) && Number(value) <= Number(end),
    message: (field, [start, end]) =>
      `this field must be between ${start} and ${end}.`,
  },
  numberExact: {
    test: ({ value }, [expected]) => Number(value) === Number(expected),
    message: (field, [expected]) => `this field has to be exactly ${expected}.`,
  },
  numberMax: {
    test: ({ value }, [max]) => Number(value) <= Number(max),
    message: (field, [max]) => `this field has to contain less than ${max}.`,
  },
  numberMin: {
    test: ({ value }, [min]) => Number(value) >= Number(min),
    message: (field, [min]) => `this field has to contain at least ${min}.`,
  },
  numbers: {
    test: ({ value }) => !!value?.toString().match(/\d/),
    message: () => 'this field must contain numbers.',
  },
  numbersOnly: {
    test: ({ value }) => !!value?.toString().match(/^\d+$/),
    message: () => 'this field must contain only numbers.',
  },
  phone: {
    test: ({ value }) =>
      !!value?.toString().match(/^(\+|)(234|0)(7|8|9)(0|1)\d{8}$/),
    message: () => 'the field has to be a valid nigerian phone number.',
  },
  required: {
    test: ({ value }) => !!value,
    message: () => 'this field is required.',
  },
  specialCharacters: {
    test: ({ value }) =>
      !!value?.toString().match(/[!@#$%^&*()_+~`{}[\]\\;:'"<>,.?/]+/),
    message: () => 'this field must contain punctuations.',
  },
  specialCharactersOnly: {
    test: ({ value }) =>
      !!value?.toString().match(/^[!@#$%^&*()_+~`{}[\]\\;:'"<>,.?/]+$/),
    message: () => 'this field must contain only punctuations.',
  },
  stringLength: {
    test: ({ value }, [length]) => value?.toString().length === Number(length),
    message: (field, [length]) =>
      `this field has to be exactly ${length} characters.`,
  },
  stringMax: {
    test: ({ value }, [max]) => (value?.toString().length || 0) <= Number(max),
    message: (field, [max]) =>
      `this field has to contain less than ${max} characters.`,
  },
  stringMin: {
    test: ({ value }, [min]) => (value?.toString().length || 0) >= Number(min),
    message: (field, [min]) =>
      `this field has to contain at least ${min} characters.`,
  },
  true: {
    test: ({ value }) => value === true,
    message: () => 'this field has to be true.',
  },
  url: {
    test: ({ value }) =>
      !!value
        ?.toString()
        .match(
          /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        ),
    message: () => 'this field has to be a valid url address',
  },
};

const generateForm = <TKey extends string>(
  keys: Record<TKey, FormField>,
  extra: Record<string, unknown> = {}
): Form<TKey> => {
  const fields = {} as Record<TKey, FormFieldNormalized>;
  for (const name in keys) {
    const param = keys[name];
    const value = typeof param === 'object' && param.value;
    const field: FormFieldNormalized = reactive({
      name,
      value: value !== undefined ? value : '',
      rules: (typeof param === 'object' && param.rules) || ['required'],
      errors: null,
      serverErrors: null,
    });
    fields[name] = field;
  }

  return {
    fields,
    error: null,
    success: null,
    loading: false,
    touched: false,
    valid: false,
    ...extra,
    __base: {
      keys,
      extra,
    },
  };
};

export const getFields = <TKey extends string>(
  form: Ref<Form<TKey>>
): FormFieldNormalized[] => {
  return Object.keys(form.value.fields).map(
    (name) => form.value.fields[name as TKey]
  );
};

export const getFormData = (form: Ref<Form>): FormData => {
  const formData = new FormData();
  const {
    value: { fields },
  } = form;
  Object.keys(fields).forEach((name) => {
    const { value } = fields[name];
    formData.append(
      name,
      value === null || value === undefined ? '' : value.toString()
    );
  });
  return formData;
};

export const getRawFormData = <TKeys extends string>(
  form: Ref<Form<TKeys>>
): Record<TKeys, unknown> => {
  const data = {} as Record<TKeys, unknown>;
  const {
    value: { fields },
  } = form;
  for (const name in fields) {
    data[name] = fields[name].value;
  }
  return data;
};

export const updateForm = (
  form: Ref<Form>,
  properties: FormProperties
): void => {
  Object.keys(properties).map(() =>
    Object.assign(form.value, properties as Record<string, unknown>)
  );
};

export const setFormErrors = (
  form: Ref<Form>,
  serverErrors: ServerErrors
): void => {
  getFields(form).forEach((field) => {
    field.serverErrors = serverErrors?.[field.name];
  });
};

export const getFieldError = (
  field: FormFieldNormalized,
  ruleName?: RuleName
): string | string[] | undefined => {
  if (ruleName) {
    return field.errors?.[ruleName];
  }

  const { errors, serverErrors } = field;
  return Object.keys(errors || {})
    .map((name) => (errors || {})[name])
    .concat(serverErrors || []);
};

export const validateField = <TFormRef extends Ref<Form>>(
  field: FormFieldNormalized,
  form: TFormRef
): boolean => {
  const { rules } = field;
  let isValid = true;
  field.errors = null;
  field.serverErrors = null;

  rules.forEach((key: RuleName | Rule, index) => {
    switch (typeof key) {
      case 'string': {
        const [ruleName, ruleArgs] = key.split(':');
        const args = ruleArgs?.split(',');

        const { test, message } = ruleHub[ruleName];
        if (!test(field, args, form.value)) {
          field.errors = field.errors || {};
          field.errors[ruleName] = message(field, args, form.value);
          isValid = false;
        }
        break;
      }
      case 'function': {
        const { test, message } = key as Rule;
        if (!test(field, [], form.value)) {
          field.errors = field.errors || {};
          field.errors[index] = message(field, [], form.value);
          isValid = false;
        }
        break;
      }
    }
    if (typeof key === 'function') {
      return;
    }
  });

  return isValid;
};

export const validateForm = (
  form: Ref<Form>,
  callback?: ValidationCallback
): boolean => {
  let isValid = true;
  form.value.valid = true;

  getFields(form).forEach((field) => {
    if (!validateField(field, form)) {
      isValid = false;
    }
  });
  form.value.valid = isValid;

  if (callback) {
    callback(isValid);
  }

  return isValid;
};

export const resetForm = (form: Ref<Form>): void => {
  const {
    __base: { keys, extra },
  } = form.value;
  form.value = generateForm(keys, extra);
};

export const useForm = <TKey extends string>(
  fields: Record<TKey, FormField>,
  extra: Record<string, unknown> = {}
) => {
  const form = ref(generateForm<TKey>(fields, extra));

  for (const name in form.value.fields) {
    const field = form.value.fields[name] as unknown as FormFieldNormalized;
    
    watch(
      () => field.value,
      () => validateField(field, form as Ref<Form>)
    );
  }

  return form;
};
