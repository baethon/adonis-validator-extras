const chai = require('chai')
const flattenRules = require('../../src/validator/flattenRules')

const { expect } = chai

class Dummy {
  get rules () {
    return {
      name: 'string',
      lastname: 'string',
      family: [{
        name: 'string'
      }]
    }
  }
}

describe('validator | flattenRules', () => {
  it('lazy flattens rules getter', () => {
    const F = flattenRules(Dummy)

    const validator = new F()
    const expected = {
      name: 'string',
      lastname: 'string',
      'family.*.name': 'string'
    }

    expect(validator.rules).to.deep.equal(expected)

    // just to make sure that consequent calls return same result
    expect(validator.rules).to.deep.equal(expected)
  })

  it('interpolates context', () => {
    const F = flattenRules(class {
      get rules () {
        return { email: 'unique:users,email,id,{params.id}' }
      }
    })

    const validator = new F()
    validator.ctx = {
      params: { id: 1 }
    }

    expect(validator.rules).to.deep.equal({
      email: 'unique:users,email,id,1'
    })
  })
})
