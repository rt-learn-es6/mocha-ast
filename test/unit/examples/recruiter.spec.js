import { stub } from 'sinon'

import {
  ast,
  spec,
  execute,
  result,
  subject,
  prepare,
} from '~/src/lib/mocha-ast'

import { Recruiter } from '~/src/examples/recruiter'

ast('Recruiter', () => {
  spec('#assess', () => {
    subject(() => new Recruiter())

    prepare((sandbox, position, score) => {
      sandbox.stub(subject(), 'getPosition').returns(position)
      sandbox.stub(subject(), 'getScore').returns(score)
    })

    execute(() => {
      result(subject().assess())
    })
  })
})
