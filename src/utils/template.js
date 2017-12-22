const R = require('ramda')
const regex = /\{{2}(.+?)\}{2}/g

const isObject = R.is(Object)

const getFrom = (path, data) => {
  if (!path.length || !isObject(data)) {
    return data
  }

  return getFrom(path.slice(1), data[path[0]])
}

module.exports = (template, data) => {
  return template.replace(regex, (_, pathStr) => {
    return getFrom(pathStr.split('.'), data) || ''
  })
}
