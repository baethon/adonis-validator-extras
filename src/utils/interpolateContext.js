const R = require('ramda')
const template = require('./template')

const interpolateValue = context => value => template(value, context)

module.exports = (rules, context) => {
  return R.map(interpolateValue(context), rules)
}
