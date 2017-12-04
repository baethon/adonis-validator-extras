const R = require('ramda')

const isArray = Array.isArray
const isObject = R.both(R.is(Object), R.complement(isArray))
const isArrayOfObjects = R.both(isArray, R.compose(isObject, R.head))
const isComplexRule = R.either(isArrayOfObjects, isObject)

const flattenLeaf = (rules, name, parentName) => {
  const nested = isArray(rules)
  const key = nested
    ? `${parentName}${name}.*`
    : `${parentName}${name}`

  const values = nested
    ? R.head(rules)
    : rules

  return { [key]: values }
}

const keyOf = (rules, name, parentName) => isArrayOfObjects(rules)
  ? `${parentName}${name}.*.`
  : `${parentName}${name}.`

const valueOf = R.cond([
  [isArrayOfObjects, R.head],
  [R.T, R.identity]
])

const reduceRules = (rules, parentProp) => (carry, name) => {
  const currentRules = rules[name]

  return Object.assign(
    {},
    carry,
    isComplexRule(currentRules)
      ? flattenRules(valueOf(currentRules), keyOf(currentRules, name, parentProp))
      : flattenLeaf(currentRules, name, parentProp)
  )
}

const flattenRules = (rules, parentProp = '') => Object.keys(rules)
  .reduce(reduceRules(rules, parentProp), {})

module.exports = flattenRules
