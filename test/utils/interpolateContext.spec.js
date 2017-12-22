const chai = require('chai')
const utils = require('../../src/utils')
const Macroable = require('macroable')

const { expect } = chai

describe('utils | interpolateContext', () => {
  it('interpolates context into object values', () => {
    const rules = {
      name: 'unique:users,email,id,{{params.id}}',
      foo: 'required'
    }

    const context = {
      params: { id: 1 }
    }

    expect(utils.interpolateContext(rules, context)).to.deep.equal({
      name: 'unique:users,email,id,1',
      foo: 'required'
    })
  })

  it('interpolates multiple values', () => {
    const rules = {
      name: 'unique:users,email,{{query.field}},{{params.id}}'
    }

    const context = {
      params: { id: 1 },
      query: { field: 'id' }
    }

    expect(utils.interpolateContext(rules, context)).to.deep.equal({
      name: 'unique:users,email,id,1'
    })
  })

  it('interpolate context from macroable', () => {
    class Query extends Macroable {
    }

    Query._getters = {}
    Query.getter('field', () => 'id')

    const rules = {
      name: 'unique:users,email,{{query.field}}'
    }

    const context = {
      query: new Query()
    }

    expect(utils.interpolateContext(rules, context)).to.deep.equal({
      name: 'unique:users,email,id'
    })
  })
})
