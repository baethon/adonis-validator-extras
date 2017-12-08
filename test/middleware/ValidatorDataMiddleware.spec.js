const chai = require('chai')
const sinon = require('sinon')
const { resolver } = require('@adonisjs/fold')
const Middleware = require('../../src/middleware/ValidatorDataMiddleware')

chai.use(require('sinon-chai'))

const { expect } = chai

class DummyValidator {
  get rules () {
    return {
      'name': 'string',
      'lastname': 'string',
      'family.*.name': 'string'
    }
  }
}

describe('ValidatorDataMiddleware', () => {
  const resolverStub = {
    forDir: null,
    resolve: null
  }

  before(() => {
    resolverStub.resolve = sinon.stub()
      .withArgs('DummyValidator')
      .returns(new DummyValidator())

    resolverStub.forDir = sinon.stub(resolver, 'forDir')
      .withArgs('validators')
      .returns(resolverStub)
  })

  after(() => {
    resolver.forDir.restore()
  })

  it('extends request with fields from validator', async () => {
    const m = new Middleware()

    const request = {
      all () {
        return {
          name: 'Jon',
          lastname: 'Snow',
          age: 'unknown',
          family: [
            { name: 'Sansa', age: 'unknown' },
            { name: 'Array', age: 'unknown' }
          ]
        }
      }
    }
    const next = sinon.spy()

    await m.handle({ request }, next, 'DummyValidator')

    expect(request).to.have.property('_validated').which.deep.include({
      name: 'Jon',
      lastname: 'Snow',
      family: [
        { name: 'Sansa' },
        { name: 'Array' }
      ]
    })

    expect(next).to.have.been.calledOnce // eslint-disable-line
  })
})
