import { AND_NAME, OR_NAME } from './operator'

/**
 * Provides logic evaluation functionalities. Custom logical AND/OR evaluator.
 */
export const TRUE = '|true'
export const FALSE = '|false'

/**
 * Helper method to evaluate left or right token.
 *
 * @param scenario list of scenario tokens.
 * @param subscript scenario token subscript.
 * @param object left or right token.
 */
export const pevaluate = (scenario = [], subscript = -1, object = null) => {
  if (subscript < 0) {
    return scenario.indexOf(object) > -1
  }

  return scenario[subscript] === object
}

/**
 * @param scenario list of scenario tokens.
 * @param leftSubscript left index.
 * @param rightSubscript right index.
 * @param left left token.
 * @param right right token.
 */
const performLogicalAnd = (
  scenario = [],
  leftSubscript = -1,
  rightSubscript = -1,
  left = null,
  right = null,
) => {
  if (FALSE === left || FALSE === right) {
    return FALSE
  }

  if (TRUE === left && TRUE === right) {
    return TRUE
  }

  if (TRUE === left) {
    if (rightSubscript < 0) {
      return String(scenario.indexOf(right) > -1)
    }
    return (scenario[rightSubscript] === right).toString()
  }

  if (TRUE === right) {
    if (leftSubscript < 0) {
      return String(scenario.indexOf(left) > -1)
    }
    return (scenario[leftSubscript] === left).toString()
  }

  const leftEval = pevaluate(scenario, leftSubscript, left)
  const rightEval = pevaluate(scenario, rightSubscript, right)

  return (leftEval && rightEval).toString()
}

/**
 * @param scenario list of scenario tokens.
 * @param leftSubscript left index.
 * @param rightSubscript right index.
 * @param left left token.
 * @param right right token.
 */
const performLogicalOr = (
  scenario = [],
  leftSubscript = -1,
  rightSubscript = -1,
  left = null,
  right = null,
) => {
  if (TRUE === left || TRUE === right) {
    return TRUE
  }

  if (FALSE === left && FALSE === right) {
    return FALSE
  }

  if (FALSE === left) {
    if (rightSubscript < 0) {
      return String(scenario.indexOf(right) > -1)
    }
    return (scenario[rightSubscript] === right).toString()
  }

  if (FALSE === right) {
    if (leftSubscript < 0) {
      return String(scenario.indexOf(left) > -1)
    }
    return (scenario[leftSubscript] === left).toString()
  }

  const leftEval = pevaluate(scenario, leftSubscript, left)
  const rightEval = pevaluate(scenario, rightSubscript, right)

  return (leftEval || rightEval).toString()
}

const OPERATIONS = {}
OPERATIONS[AND_NAME] = performLogicalAnd
OPERATIONS[OR_NAME] = performLogicalOr

export const binaryOperation = (operationName) => OPERATIONS[operationName]

/**
 * Check if the token is opening bracket.
 *
 * @param token Input <code>String</code> token
 * @return <code>boolean</code> output
 */
export const isOpenBracket = (token) => token === '('

/**
 * Check if the token is closing bracket.
 *
 * @param token Input <code>String</code> token
 * @return <code>boolean</code> output
 */
export const isCloseBracket = (token) => token === ')'
