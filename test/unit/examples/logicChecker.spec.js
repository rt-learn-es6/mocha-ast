import { ast, spec, execute, result } from '~/src/lib/mocha-ast'

import { and, or } from '~/src/examples/logicChecker'

ast('logicChecker', () => {
  spec('Logical AND', () => {
    execute((left, right) => {
      result(and(left, right))
    })
  })

  spec('Logical OR', () => {
    execute((left, right) => {
      result(or(left, right))
    })
  })
})
