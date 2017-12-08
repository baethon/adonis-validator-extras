const { ServiceProvider } = require('@adonisjs/fold')
const NE = require('node-exceptions')
const Middleware = require('../src/middleware/ValidatorDataMiddleware')

const castArray = value => Array.isArray(value) ? value : [value]

class ValidationExtenderProvider extends ServiceProvider {
  _registerMiddleware () {
    this.app.bind('Baethon/Middleware/ValidatorData', () => {
      return new Middleware()
    })
  }

  register () {
    this._registerMiddleware()
  }

  boot () {
    const Server = this.app.use('Adonis/Src/Server')
    Server.registerNamed({
      avData: 'Baethon/Middleware/ValidatorData'
    })

    const Route = this.app.use('Adonis/Src/Route')

    this._extendRouteMacro(Route)
    this._extendResourceMacro(Route)

    const Request = this.app.use('Adonis/Src/Request')
    Request.macro('validated', function () {
      if (this._validated === undefined) {
        throw new NE.RuntimeException('Request was not validated', 500, 'E_REQUEST_NOT_VALIDATED')
      }

      return this._validated
    })
  }

  _extendRouteMacro (Route) {
    const originalMacro = Route.Route.getMacro('validator')
    Route.Route.macro('validator', function (validatorClass) {
      originalMacro.call(this, validatorClass)
      this.middleware([`avData:${validatorClass}`])
      return this
    })
  }

  _extendResourceMacro (Route) {
    const originalMacro = Route.RouteResource.getMacro('validator')
    Route.RouteResource.macro('validator', function (validatorsMap) {
      originalMacro.call(this, validatorsMap)

      const middlewareMap = new Map()

      for (const [routeNames, validators] of validatorsMap) {
        const middleware = castArray(validators).map((validator) => `avData:${validator}`)
        middlewareMap.set(routeNames, middleware)
      }

      this.middleware(middlewareMap)

      return this
    })
  }
}

module.exports = ValidationExtenderProvider
