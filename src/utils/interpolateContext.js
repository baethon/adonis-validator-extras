const R = require('ramda')
const { pope } = require('pope')

const interpolateValue = context => value => pope(value, context)

module.exports = (rules, context) => {
  return R.map(interpolateValue(context), rules)
}
