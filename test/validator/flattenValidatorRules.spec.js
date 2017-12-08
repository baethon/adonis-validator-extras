const chai = require('chai')
const flattenValidatorRules = require('../../src/validator/flattenValidatorRules')

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

describe('validator | flattenValidatorRules', () => {
  it('lazy flattens rules getter', () => {
    const F = flattenValidatorRules(Dummy)

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
