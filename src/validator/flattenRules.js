const R = require('ramda')
const { flattenObject, interpolateContext } = require('../utils')

const interpolate = rules => function () {
  return interpolateContext(rules, this.ctx)
}

const flattenWithInterpolate = R.compose(interpolate, flattenObject)

const getRulesWith = (prototype, get) => Object.defineProperty(prototype, 'rules', { get })

module.exports = validatorClass => {
  const { prototype } = validatorClass
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'rules')

  if (!descriptor.get) {
    return validatorClass
  }

  getRulesWith(prototype, function () {
    getRulesWith(prototype, flattenWithInterpolate(descriptor.get.call(this)))
    return this.rules
  })

  return validatorClass
}
