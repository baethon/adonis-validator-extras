const chai = require('chai')
const utils = require('../../src/utils')

const { expect } = chai

describe('utils | template', () => {
  it('replaces params from data', () => {
    const tmpl = 'foo {{bar}} bar'
    const data = { bar: 'BAR' }

    expect(utils.template(tmpl, data)).to.equal('foo BAR bar')
  })

  it('replaces params from nested object', () => {
    const tmpl = 'Hello {{jon.name}}'
    const data = { jon: { name: 'Jon' } }

    expect(utils.template(tmpl, data)).to.equal('Hello Jon')
  })

  it('replaces empty values with empty strings', () => {
    const tmpl = 'Hello {{jon.name}}'
    const data = { }

    expect(utils.template(tmpl, data)).to.equal('Hello ')
  })
})
