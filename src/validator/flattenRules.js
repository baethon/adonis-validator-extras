const R = require('ramda')
const { flattenRules } = require('../utils')

module.exports = validatorClass => {
  const { prototype } = validatorClass
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'rules')

  if (!descriptor.get) {
    return validatorClass
  }

  const getRulesWith = fn => Object.defineProperty(prototype, 'rules', { get: fn })

  getRulesWith(function () {
    return R.tap(
      R.compose(getRulesWith, R.always),
      flattenRules(descriptor.get.call(this))
    )
  })

  return validatorClass
}
