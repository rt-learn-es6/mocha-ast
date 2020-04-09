import { RuleEvaluator } from './ruleEvaluator'

const processOutcome = (
  scenario = [],
  fixture = {},
  list = [],
  outcome = ''
) => {
  const specObject = fixture.spec

  const clause = specObject.rule.getClause(outcome)
  const ruleEvaluator = new RuleEvaluator(specObject.converters)

  // debugger

  ruleEvaluator.parse(clause)

  list.push(ruleEvaluator.evaluate(scenario, fixture.converterHash))
}

export const evaluate = (scenario = [], fixture = null) => {
  const retval = []
  fixture.spec.rule.getOutcomes().forEach((outcome) => {
    processOutcome(scenario, fixture, retval, outcome)
  })

  return retval
}
