import { evaluate } from './scenarioEvaluator'
import { contains } from '~/src/utils/arrayUtils'
import { assert } from '~/src/lib/assert'

const opposite = (outcome = '', spec = null) => {
  if (contains(Object.keys(spec.pair), outcome)) {
    return spec.pair[outcome]
  }

  return spec.pairReversed[outcome]
}

const validateMulti = (spec = null, ruleResult = []) => {
  const matchedOutputs = []
  let matchCount = 0

  for (let i = 0; i < ruleResult.length; i += 1) {
    if (ruleResult[i] === 'true') {
      matchCount += 1
      matchedOutputs.push(spec.rule.getOutcomes()[i])
    }
  }

  assert(
    `Scenario must fall into a unique rule output/clause:
    #{scenario} , matched: #{matchedOutputs}`,
    matchCount === 1
  )

  return matchedOutputs[0]
}

const binaryOutcome = (outcome = '', spec = null, expected = false) => {
  const isPositive = contains(Object.keys(spec.pair), outcome)
  if (isPositive) {
    return expected === 'true' ? outcome : opposite(outcome, spec)
  }
  return expected === 'true' ? opposite(outcome, spec) : outcome
}

export const validate = (scenario = [], fixture = {}) => {
  const ruleResult = evaluate(scenario, fixture)
  const { spec } = fixture
  const { rule } = spec

  const singleResult = rule.getSize() === 1
  if (singleResult) {
    const nextResult = ruleResult[0]
    const outcome = rule.getOutcomes()[0]
    return binaryOutcome(outcome, spec, nextResult)
  }

  return validateMulti(spec, ruleResult)
}
