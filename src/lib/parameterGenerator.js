import { RuleEvaluator } from './rules/ruleEvaluator'
import { validate } from './rules/ruleValidator'
import { last } from '~/src/utils/arrayUtils'

const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))))
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)

const isValidCase = (scenario, spec) => {
  if (spec.exemptRule == null) {
    return true
  }

  const ruleEvaluator = new RuleEvaluator(spec.converters)
  return !ruleEvaluator.evaluate(scenario, spec.converters)
}

const buildParam = (scenario, spec) => {
  const param = { spec, scenario: {} }
  const tokenConverter = {}

  Object.keys(spec.variables).forEach((key, index) => {
    spec.variables[key].forEach((element) => {
      if (spec.converters != null) {
        tokenConverter[element.toString()] = spec.converters[index]
      }
    })
  })

  // zip
  Object.keys(spec.variables)
    .map((e, i) => [e, scenario[i]])
    .forEach((array) => {
      const varName = array[0]
      const varValue = last(array)
      param.scenario[varName] = varValue
    })

  param.converterHash = tokenConverter

  // debugger

  param.expectedOutcome = validate(scenario, param)

  return param
}

/**
 * addCase. Generate the combinations, then add the fixture to the final list
 * @type {[type]}
 */
export const generateData = (spec = null) => {
  // object destructuring does not work correctly in this case.
  const { variables } = spec
  const values = Object.values(variables)

  const scenarios = cartesian(values[0], ...values.slice(1))
  // const scenarios = cartesian(clone(values[0]), clone(values.slice(1)))
  const list = []

  scenarios.forEach((scenario) => {
    if (isValidCase(scenario, spec)) {
      list.push(buildParam(scenario, spec))
    }
  })

  return list
}
