import { expect } from 'chai'
import { describe, it } from 'mocha'

import { readJSONFixture } from '~/src/utils/jsonUtils'

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

export const test = (name, body) => {
  // describe('yo', () => {
  //   it('go', () => {
  //     expect(1).to.eq(1)
  //   })
  // })

  console.log(name)
  console.log(body)
  const specFile = _getCallerFile()

  const specConfigPath = specFile.replace(
    /(test\/.*?)(\w+\.spec)\.js/,
    '$1ast/$2.json'
  )

  const specConfig = readJSONFixture(specConfigPath)

  console.log(specConfig)

  console.log(specFile)
}

export const spec = (name, body) => {
  console.log('Inside spec')
}

export const execute = (name, body) => {
  console.log('execute')
}

export const result = (name, body) => {
  console.log('Result')
}
