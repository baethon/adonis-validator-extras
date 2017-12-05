const chai = require('chai')
const utils = require('../../src/utils')

const { expect } = chai

describe('utils | fromPaths', () => {
  it('extracts data from paths', () => {
    const data = {
      name: 'Jon',
      lastname: 'Snow',
      address: {
        city: 'Winterfell',
        address: 'The Citadel',
        number: 'unknown'
      }
    }

    const paths = [
      'name',
      'lastname',
      'address.city',
      'address.number',
      'nickname'
    ]

    expect(utils.fromPaths(paths, data)).to.deep.equal({
      name: 'Jon',
      lastname: 'Snow',
      address: {
        city: 'Winterfell',
        number: 'unknown'
      }
    })
  })

  it('extracts data from paths with arrays of objects', () => {
    const data = {
      name: 'Jon',
      family: [
        {
          name: 'Array',
          relation: 'sister',
          age: '???'
        },
        {
          name: 'Sansa',
          relation: 'sister',
          age: '???'
        }
      ]
    }

    const paths = [
      'family.*.name',
      'family.*.relation'
    ]

    expect(utils.fromPaths(paths, data)).to.deep.equal({
      family: [
        { name: 'Array', relation: 'sister' },
        { name: 'Sansa', relation: 'sister' }
      ]
    })
  })

  it('extracts data from plain arrays', () => {
    const data = {
      tags: ['foo', 'bar']
    }

    const paths = [
      'tags.*'
    ]

    expect(utils.fromPaths(paths, data)).to.deep.equal({
      tags: ['foo', 'bar']
    })
  })

  it('extracts data from complex paths', () => {
    const data = {
      it: {
        will: [{
          be: [{
            even: {
              more: 'complicated'
            }
          }]
        }]
      },
      foo: {
        bar: true
      }
    }

    const paths = [
      'it.will.*.be.*.even.more',
      'foo.bar'
    ]

    expect(utils.fromPaths(paths, data)).to.deep.equal(data)
  })
})
