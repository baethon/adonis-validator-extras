const chai = require('chai')
const utils = require('../../src/utils')

const { expect } = chai

describe('utils | flattenRules', () => {
  it('flattens nested objects', () => {
    const rules = utils.flattenRules({
      address: {
        street: 'required'
      }
    })

    expect(rules).to.deep.equal({
      'address.street': 'required'
    })
  })

  it('flattens nested arrays of objects', () => {
    const rules = utils.flattenRules({
      tags: [{
        name: 'string',
        and: [{
          even: 'more'
        }]
      }]
    })

    expect(rules).to.deep.include({
      'tags.*.name': 'string',
      'tags.*.and.*.even': 'more'
    })
  })

  it('flattens nested arrays', () => {
    const rules = utils.flattenRules({
      tags: ['string'],
      and: [{
        even: ['more']
      }]
    })

    expect(rules).to.deep.include({
      'tags.*': 'string',
      'and.*.even.*': 'more'
    })
  })
})
