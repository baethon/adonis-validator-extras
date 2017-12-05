const R = require('ramda')

const pathToLens = R.compose(R.lensPath, R.split('.'))
const splitArrayPath = path => {
  const regex = /^(.+?)\.\*\.?(.+)?/
  const [, left, right] = regex.exec(path)

  return [left, right]
}

const fromLens = (path, data, carry) => {
  const lens = pathToLens(path)
  const value = R.view(lens, data)

  return (value !== undefined)
    ? R.set(lens, value, carry)
    : carry
}

const fromArray = (path, data, carry) => {
  const [left, right] = splitArrayPath(path)
  const lens = pathToLens(left)
  const leftData = R.view(lens, data)

  if (!leftData) {
    return carry
  }

  if (!right) {
    return R.set(lens, leftData, carry)
  }

  const leftResult = R.view(lens, carry) || []
  const mapped = leftData.map((item, index) => {
    const carry = leftResult[index] || {}

    return reducePath(item)(carry, right)
  })

  return R.set(lens, mapped, carry)
}

const reducePath = data => (carry, path) => R.contains('*', path)
  ? fromArray(path, data, carry)
  : fromLens(path, data, carry)

module.exports = (paths, data) => paths.reduce(reducePath(data), {})
