const R = require('ramda')

const pathRegex = /\{([a-zA-Z.]+)\}/g

const trimBraces = str => str.substring(1, str.length - 1)

const extractPaths = R.pipe(
  Object.values,
  R.chain(str => str.match(pathRegex)),
  R.reject(R.isNil),
  R.uniq,
  R.map(trimBraces),
  R.reduce(
    (carry, path) => Object.assign({}, carry, {
      [path]: R.lensPath(R.split('.', path))
    }),
    {}
  )
)

const interpolateValue = (paths, context) => value => {
  return value.replace(pathRegex, (_, path) => {
    const lens = paths[path]

    return (lens && R.view(lens, context)) || ''
  })
}

module.exports = (rules, context) => {
  const paths = extractPaths(rules)

  return R.map(interpolateValue(paths, context), rules)
}
