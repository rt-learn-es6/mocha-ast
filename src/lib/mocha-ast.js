import { expect } from 'chai'
import { describe, it } from 'mocha'

const _getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace

  let callerfile
  try {
    const err = new Error()
    Error.prepareStackTrace = (_err, stack) => stack
    const currentfile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()

      if (currentfile !== callerfile) break
    }
  } catch (e) {
    console.log(e)
  }

  Error.prepareStackTrace = originalFunc

  return callerfile
}

export const test = (name, body) => {
  debugger

  describe('yo', () => {
    it('go', () => {
      expect(1).to.eq(1)
    })

  })

  console.log('Running test!')
  console.log(name)
  console.log(body)
  console.log(_getCallerFile())
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
