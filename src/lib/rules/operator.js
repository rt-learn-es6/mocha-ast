/**
 * Operator Enum in Java. To be used only internally in RuleEvaluator class.
 */
export class Operator {
  constructor(name = '', symbol = '', precedence = -1) {
    this.name = name
    this.symbol = symbol
    this.precedence = precedence
  }

  getPrecedence() {
    return this.precedence
  }

  getSymbol() {
    return this.symbol
  }

  getName() {
    return this.name
  }

  toString() {
    return this.symbol
  }
}

export const AND_NAME = 'And'
export const OR_NAME = 'Or'

export const NOT = new Operator('Not', '!', 100)
export const AND = new Operator(AND_NAME, '&', 2)
export const OR = new Operator(OR_NAME, '|', 1)

const OPERATORS = [NOT, AND, OR]

export const fromSymbol = (symbol) =>
  OPERATORS.find((operator) => operator.getSymbol() === symbol)

export const isOperator = (token) =>
  token !== null &&
  OPERATORS.map((operator) => operator.getSymbol()).indexOf(token) > -1
