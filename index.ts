import {
  reactive, ref, Ref, watch,
} from 'vue';

import {
  Form,
  FormField,
  FormFieldNormalized,
  FormProperties,
  Rule,
  RuleName,
  ServerErrors,
  ValidationCallback,
} from './types';

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
  arrayContains: {
    test: ({ value }, array) => array.indexOf(value as string) > -1,
    message: (name, array) => `this field has to contain any of these ${array.join(', ')}.`,
  },
  arrayDoesntContain: {
    test: ({ value }, array) => array.indexOf(value as string) < 0,
    message: (name, array) => `this field cannot contain any of these ${array.join(', ')}.`,
  },
  date: {
    test: ({ value }) => value?.constructor === Date,
    message: () => 'this field.',
  },
  email: {
    test: ({ value }) => !!value?.toString().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
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
    message: (field, [fieldName]) => `this field should be the same as the ${fieldName} field.`,
  },
  file: {
    test: ({ value }) => value?.constructor === File,
    message: () => 'a file has to be chosen for this field.',
  },
  money: {
    test: ({ value }) => !!value?.toString().match(/^\d+(\.\d{1,2})?$/),
    message: () => 'this field can only money format and in 2 decimal places.',
  },
  name: {
    test: ({ value }) => !!value?.toString().match(/\w{2}(\s\w{2})+/),
    message: () => 'this field has to be a valid full address name.',
  },
  noSequence: {
    test: ({ value }) => !value?.toString()?.match(new RegExp(SEQUENCES.join('|'))),
    message: () => 'this field must not contain simple sequences like abc, 123',
  },
  nullable: {
    test: () => true,
    message: () => '',
  },
  numberBetween: {
    test: ({ value }, [start, end]) => Number(value) > Number(start) && Number(value) < Number(end),
    message: (field, [start, end]) => `this field must be between ${start} and ${end}.`,
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
    test: ({ value }) => !!value?.toString().match(/^(\+|)(234|0)(7|8|9)(0|1)\d{8}$/),
    message: () => 'the field has to be a valid nigerian address number.',
  },
  required: {
    test: ({ value }) => !!value,
    message: () => 'this field is required.',
  },
  specialCharacters: {
    test: ({ value }) => !!value?.toString().match(/[!@#$%^&*()_+~`{}[\]\\;:'"<>,.?/]+/),
    message: () => 'this field must contain punctuations.',
  },
  specialCharactersOnly: {
    test: ({ value }) => !!value?.toString().match(/^[!@#$%^&*()_+~`{}[\]\\;:'"<>,.?/]+$/),
    message: () => 'this field must contain only punctuations.',
  },
  stringLength: {
    test: ({ value }, [length]) => value?.toString().length === Number(length),
    message: (field, [length]) => `this field has to be exactly ${length} characters.`,
  },
  stringMax: {
    test: ({ value }, [max]) => (value?.toString().length || 0) <= Number(max),
    message: (field, [max]) => `this field has to contain less than ${max} characters.`,
  },
  stringMin: {
    test: ({ value }, [min]) => (value?.toString().length || 0) >= Number(min),
    message: (field, [min]) => `this field has to contain at least ${min} characters.`,
  },
  url: {
    test: ({ value }) => !!value?.toString().match(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    message: () => 'this field has to be a valid url address',
  },
};

function generateForm(keys: Record<string, FormField>, extra: Record<string, unknown> = {}): Form {
  const fields: Record<string, FormFieldNormalized> = {};
  Object.keys(keys).forEach((name) => {
    const param = keys[name];
    const value = (typeof param === 'object' && param.value) || '';
    const field: FormFieldNormalized = reactive({
      name,
      value: value !== undefined ? value : '',
      rules: (typeof param === 'object' && param.rules) || ['required'],
      errors: null,
      serverErrors: null,
    });
    fields[name] = field;
  });

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
}

export function getFields(form: Ref<Form>): FormFieldNormalized[] {
  return Object.keys(form.value.fields).map((name) => form.value.fields[name]);
}

export function getFormData(form: Ref<Form>): FormData {
  const formData = new FormData();
  const { value: { fields } } = form;
  Object.keys(fields).forEach((name) => {
    const { value } = fields[name];
    formData.append(name, (value === null || value === undefined) ? '' : value.toString());
  });
  return formData;
}

export function getRawFormData(form: Ref<Form>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const { value: { fields } } = form;
  Object.keys(fields).forEach((name) => {
    data[name] = fields[name].value;
  });
  return data;
}

export function updateForm(form: Ref<Form>, properties: FormProperties): void {
  Object.keys(properties)
    .map(() => Object.assign(form.value, properties as Record<string, unknown>));
}

export function setFormErrors(form: Ref<Form>, serverErrors: ServerErrors): void {
  getFields(form).forEach((field) => {
    field.serverErrors = serverErrors?.[field.name];
  });
}

export function getFieldErrors(
  field: FormFieldNormalized,
  ruleName?: RuleName,
): string | string[] | undefined {
  if (ruleName) {
    return field.errors?.[ruleName];
  }

  const { errors, serverErrors } = field;
  return Object.keys(errors || {})
    .map((name) => (errors || {})[name]).concat(serverErrors || []);
}

export function validateField(field: FormFieldNormalized, form: Ref<Form>): boolean {
  const { rules } = field;
  let isValid = true;
  field.errors = null;
  field.serverErrors = null;

  rules.forEach((key: RuleName) => {
    const [ruleName, ruleArgs] = key.split(':');
    const args = ruleArgs?.split(',');

    const { test, message } = ruleHub[ruleName];
    if (!test(field, args, form.value)) {
      field.errors = field.errors || {};
      field.errors[ruleName] = message(field, args, form.value);
      isValid = false;
    }
  });

  return isValid;
}

export function validateForm(form: Ref<Form>, callback?: ValidationCallback): boolean {
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
}

export function resetForm(form: Ref<Form>): void {
  const { __base: { keys, extra } } = form.value;
  form.value = generateForm(keys, extra);
}

export function useForm(
  fields: Record<string, FormField>,
  extra: Record<string, unknown> = {},
): Ref<Form> {
  const form = ref(generateForm(fields, extra));

  Object.keys(fields).forEach((name) => {
    const field = form.value.fields[name];
    watch(
      () => field.value,
      () => validateField(field, form),
    );
  });

  return form;
}
