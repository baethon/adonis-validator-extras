const chai = require('chai')
const utils = require('../../src/utils')

const { expect } = chai

describe('utils | flattenObject', () => {
  it('flattens nested objects', () => {
    const rules = utils.flattenObject({
      address: {
        street: 'required'
      }
    })

    expect(rules).to.deep.equal({
      'address.street': 'required'
    })
  })

  it('flattens nested arrays of objects', () => {
    const rules = utils.flattenObject({
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
    const rules = utils.flattenObject({
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
