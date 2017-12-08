const R = require('ramda')
const { resolver } = require('@adonisjs/fold')
const utils = require('../utils')

class ValidatorDataMiddleware {
  async handle (ctx, next, validator) {
    const validatorName = Array.isArray(validator) ? validator[0] : validator

    const validatorInstance = resolver.forDir('validators').resolve(validatorName)

    if (!R.isEmpty(validatorInstance.rules)) {
      const { request } = ctx
      request._validated = utils.fromPaths(Object.keys(validatorInstance.rules), request.all())
    }

    await next()
  }
}

module.exports = ValidatorDataMiddleware
