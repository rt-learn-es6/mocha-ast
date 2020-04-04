import { expect } from 'chai'
import { describe, it } from 'mocha'

import { and } from '~/src/examples/logicChecker'

describe('logicChecker', () => {
  it('returns true, given: true and false', () => {
    expect(and(true, false)).to.eq(false)
  })
})
