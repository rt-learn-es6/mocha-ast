// import { expect } from 'chai'
// import { describe, it } from 'mocha'

import { DynamicClass } from './dynamicClass'

import { readJSONFixture } from '~/src/utils/jsonUtils'
import { generateData } from './parameterGenerator'
import { Rule } from './rules/rule'

const _getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace

  let callerfile
  const err = new Error()
  Error.prepareStackTrace = (_err, stack) => stack
  const currentfile = err.stack.shift().getFileName()

  while (err.stack.length) {
    callerfile = err.stack.shift().getFileName()

    if (currentfile !== callerfile) break
  }

  Error.prepareStackTrace = originalFunc

  return callerfile
}

let specsConfig
let actual

export const ast = (name, specDsl) => {
  // describe('yo', () => {
  //   it('go', () => {
  //     expect(1).to.eq(1)
  //   })
  // })

  // console.log(name)
  // console.log(body)
  const specFile = _getCallerFile()

  const specConfigPath = specFile.replace(
    /(test\/.*?)(\w+\.spec)\.js/,
    '$1ast/$2.json'
  )

  specsConfig = readJSONFixture(specConfigPath)

  specDsl()
}

/**
 * DOT
 * - spec the DSL function name
 * - specConfig the JSON object from the JSON file
 * - specObject the spec config transformed to a more usable format.
 *
 * @param  {[type]} id   [description]
 * @param  {[type]} body [description]
 * @return {[type]}      [description]
 */
export const spec = (id, executeDsl) => {
  console.log('Inside spec')
  console.log(id)

  const specConfig = specsConfig.specs[id]

  const specObj = {
    description: id,
    variables: specConfig.variables,
    rule: new Rule(specConfig.rules),
  }

  if ('pair' in specConfig) {
    specObj.pair = {}
    specObj.pairReversed = {}

    const pairConfig = specConfig.pair
    const key = Object.keys(pairConfig)[0].toString()
    const value = pairConfig[key].toString()
    specObj.pair[key] = value.toString()
    specObj.pairReversed[value] = key
  }

  if (specConfig.converters == null) {
    const stringConverter = new DynamicClass('StringConverter')
    specObj.converters = specConfig.variables.map(() => stringConverter)
  } else {
    specObj.converters = specConfig.converters.map(
      (converter) => new DynamicClass(converter)
    )
  }

  const fixtures = generateData(specObj)

  debugger

  fixtures.forEach((fixture) => {
    const { scenario } = fixture

    // invokes the client dsl
    executeDsl(...Object.values(scenario))
  })
}

export const execute = (executeBody = () => {}) => {
  console.log('execute')

  debugger

  executeBody()
}

export const result = (execResult) => {
  debugger

  actual = execResult
}
