# @baethon/adonis-validator-extras

Package contains some extensions for [Adonis Validation](https://github.com/adonisjs/adonis-validation-provider) extension.

# Table of contents

<!-- TOC depthFrom:2 -->

- [Installation](#installation)
- [Request extension](#request-extension)
- [Validator rules flattener](#validator-rules-flattener)
- [development](#development)
    - [tests & linting](#tests--linting)
    - [issues & PR](#issues--pr)

<!-- /TOC -->

## Installation

1. Install package
    ```bash
    # via adonis
    adonis install @baethon/adonis-validator-extras

    # or for Yarn users
    adonis install --yarn @baethon/adonis-validator-extras

    # or via yarn
    yarn add @baethon/adonis-validator-extras

    # or via npm
    npm i @baethon/adonis-validator-extras
    ```
1. Add `@baethon/adonis-validator-extras/providers/ValidationExtenderProvider` to application providers

## Request extension

Module provides `validated()` macro for request instance. It will return data from request which went through [route validators](http://adonisjs.com/docs/4.0/validator#_route_validator).

Only defined data will be returned.

```js
Route
  .post('/test', ({ request }) => {
    console.log(request.validated())
  })
  .validator('Test')
```

This method will fail with exception if request was not validated with `validator()`.

## Validator rules flattener

[Indicative](http://indicative.adonisjs.com/) has support for nested rules.

In many ways they can be inconvienient:

```js
class Test {
  get rules () {
    return {
      name: 'required',
      'address.street': 'string',
      'address.city': 'string'
    }
  }
}
```

It gets even worse with arrays:

```js
class Test {
  get rules () {
    return {
      name: 'required',
      'family.*.name': 'string',
      'family.*.age': 'integer',
    }
  }
}
```

Package provides `flattenRules` helper which allows to write nested rules in more natural manner and later _flatten_ them to format accepted by Indicative.

```js
const { flattenRules } = require('@baethon/adonis-validator-extras')

class Test {
  get rules () {
    return {
      name: 'required',
      family: [{
        name: 'string',
        age: 'integer'
      }]
    }
  }
}

module.exports = flattenRules(Test)
```

`flattenRules` will process rules only once. Results are cached which means that `rules` getter **will be static**.

Flattened rules support string interpolation (using [pope](https://github.com/poppinss/pope)) of values from `ctx`:

```js
const { flattenRules } = require('@baethon/adonis-validator-extras')

class Test {
  get rules () {
    return {
      email: 'unique:users,email,id,{{params.id}}'
    }
  }
}

module.exports = flattenRules(Test)
```

## development

If you're planning to contribute to the package please make sure to adhere to following conventions.

### tests & linting

* lint your code using [standard](https://standardjs.com/); run `npm run lint` to check if there are any linting errors
* make sure to write tests for all the changes/bug fixes

### issues & PR

* try to provide regression test when you find a bug
* share some context on what you are trying to do, with enough code to reproduce the issue
