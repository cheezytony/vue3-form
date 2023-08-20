# vue3-form

This package offers form validation using vue 3 composition api

## Installation
```bash
npm install vue3-form
```

## Usage
```vue
<template>
  <form @submit.prevent="submit">
    <input v-model="form.fields.email.value" type="email" placeholder="Enter your email address" />

    <!-- Display error message -->
    <p>{{ form.fields.email.errors.required }}</p>
    <p>{{ form.fields.email.errors.email }}</p>
    <!-- OR -->
    <p>
      {{ getFieldError(form.fields.email).join(', ') }}
    </p>


    <input v-model="form.fields.password.value" type="password" placeholder="Enter your password" />

    <!-- Display error message -->
    <p>{{ form.fields.password.errors.required }}</p>
    <p>{{ form.fields.password.errors.stringMin }}</p>
    <!-- OR -->
    <p>
      {{ getFieldError(form.fields.password, 'stringMax') }}
    </p>
    <!-- OR -->
    <p>
      {{ getFieldError(form.fields.password).join(', ') }}
    </p>

    <button type="submit">
      Login
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFieldError, getRawFormData, useForm, validateForm } from 'vue3-form';

export default defineComponent({
  setup() {
    const form = useForm({
      email: { rules: ['required', 'email'] },
      password: {
        rules: [
          'required',
          'stringMin:8',
          'stringMax:32',
          'alphabetsLowercase',
          'alphabetsUppercase',
          'numbers',
          'specialCharacters',
          'noSequence',
        ]
      }
    });

    const submit = () => {
      if (!validateForm(form)) {
        // Form is invalid
        return;
      }

      // Form is valid...
      // proceed with submission.
      const fields = getRawFormData(form);
    }
    
    return { form, getFieldError, submit };
  },
});
</script>
```

## Form instance structure
```ts
{
  fields: Record<string, FormField>
  error: string | null
  success: string | null
  loading: boolean
  touched: boolean
  valid: boolean
}
```

## Form field instance structure
```ts
{
  name: string
  value: any
  rules: string[]
  errors: Record<string, string>
  serverErrors: string[]
}
```

## Available methods
#### useForm
Generates a new form instance.

#### getFields
Returns an array of all the fields in the form.

#### getFormData
Creates and returns a FormData instance using the fields of the form.

#### getRawFormData
Get a json object of the form using the field names as keys.

#### updateForm
Updates the states and properties of the form.

#### setFormErrors
Updates the errors of the fields in the form.

#### getFieldError
Returns either a single error or all errors of the field specified.

#### validateField
Checks and returns a fields validity.

#### validateForm
Checks and returns the validity of the specified form by validating all it's fields.

#### resetForm
Returns a form to it's initial state, including it's fields, and states.


## Available validation rules
- alphabets
- alphabetsLowercase
- alphabetsLowercaseOnly
- alphabetsOnly
- alphabetsUppercase
- alphabetsUppercaseOnly
- array
- arrayContains
- arrayContains:string
- arrayDoesntContain
- arrayDoesntContain:string
- boolean
- date
- dateAfter
- dateAfter:string
- dateBefore
- dateBefore:string
- dateBetween
- dateBetween:string
- dateExact
- dateExact:string
- dateFormat
- dateFormat:string
- different
- email
- exact
- exact:string
- false
- file
- files
- filesLength
- filesMax
- filesMin
- money
- name
- noSequence
- nullable
- numberBetween
- numberBetween:number,${number}
- numberExact
- numberExact:number
- numberMax
- numberMax:number
- numberMin
- numberMin:number
- numbers
- numbersOnly
- phone
- required
- specialCharacters
- specialCharactersOnly
- stringLength
- stringLength:number
- stringMax
- stringMax:number
- stringMin
- stringMin:number
- true
- url
