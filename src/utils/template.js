const R = require('ramda')
const regex = /\{{2}(.+?)\}{2}/g

const isObject = R.is(Object)
const isFunctionCall = string => string.substr(-2) === '()'
const callMethod = (object, key) => {
  const method = key.substr(0, key.length - 2)
  return object[method]()
}

const get = (data, key) => isFunctionCall(key)
  ? callMethod(data, key)
  : data[key]

const getFrom = (path, data) => {
  if (!path.length || !isObject(data)) {
    return data
  }

  return getFrom(path.slice(1), get(data, path[0]))
}

module.exports = (template, data) => {
  return template.replace(regex, (_, pathStr) => {
    return getFrom(pathStr.split('.'), data) || ''
  })
}
