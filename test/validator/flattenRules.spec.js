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

    const Validator = new F()
    const expected = {
      name: 'string',
      lastname: 'string',
      'family.*.name': 'string'
    }

    expect(Validator.rules).to.deep.equal(expected)

    // just to make sure that consequent calls return same result
    expect(Validator.rules).to.deep.equal(expected)
  })
})
