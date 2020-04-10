import { last, contains } from '~/src/utils/arrayUtils'

import { NumberConverter } from '~/src/lib/converters/numberConverter'
import { BooleanConverter } from '~/src/lib/converters/booleanConverter'
import { StringConverter } from '~/src/lib/converters/stringConverter'

import { NOT, fromSymbol, isOperator } from './operator'
import { RuleError } from './ruleError'
import {
  TRUE,
  FALSE,
  isOpenBracket,
  isCloseBracket,
  binaryOperation,
} from './logicHelper'

const RE_TOKEN_BODY = /^.+(?=\[)/
const RE_TOKENS = /([!|)(&])|([a-zA-Z\\s0-9]+\[\\d\])/

const DEFAULT_CONVERT_HASH = {
  number: new NumberConverter(),
  boolean: new BooleanConverter(),
  string: new StringConverter(),
}

// DEFAULT_CONVERT_HASH.number = new IntegerConverter()
// DEFAULT_CONVERT_HASH.boolean = new BooleanConverter()
// DEFAULT_CONVERT_HASH.string = new StringConverter()

const precedence = (symbolChar = '') => fromSymbol(symbolChar).getPrecedence()

/**
 * Returns value of 'n' if rule token ends with '[n]'. where 'n' is the
 * variable group index.
 *
 * @param string token to check for subscript.
 */
const extractSubscript = (token = '') => {
  // debugger

  const subscript = token.match(/\[(\d+)\]$/)
  return subscript == null ? -1 : parseInt(subscript[1], 10)
}

/** Evaluates the rules. */
export class RuleEvaluator {
  /** @param pConverterList list of rule token converters. */
  constructor(converters = []) {
    this.converters = converters

    this.stackOperations = []
    this.stackRpn = []
    this.stackAnswer = []
  }

  parse(expression) {
    /* cleaning stacks */
    this.stackOperations.length = 0
    this.stackRpn.length = 0

    /* splitting input string into tokens */
    const tokens = expression
      .split(RE_TOKENS)
      .filter((x) => x != null && x !== '')

    /* loop for handling each token - shunting-yard algorithm */
    tokens.forEach((token) => this.shuntInternal(token.trim()))

    while (this.stackOperations.length > 0) {
      this.stackRpn.push(this.stackOperations.pop())
    }

    this.stackRpn.reverse()
  }

  evaluate(scenario = [], ruleTokenConvert = {}) {
    /* check if is there something to evaluate */
    if (this.stackRpn.length === 0) {
      return true
    }

    if (this.stackRpn.length === 1) {
      return this.evaluateOneRpn(scenario)
    }

    // debugger

    return this.evaluateMultiRpn(scenario, ruleTokenConvert)
  }

  /**
   * @param ruleTokenConvert token to converter map.
   * @param defaultConverter default converter to use.
   */
  getNextValue(ruleTokenConvert = {}, defaultConverter = null) {
    let subscript = -1
    const retval = []
    let value = this.stackAnswer.pop().trim()
    if (TRUE !== value && FALSE !== value) {
      subscript = extractSubscript(value.toString())
      const valueStr = value.toString().trim()
      if (subscript > -1) {
        const converter = this.converters[subscript]
        // value = converter.convert(valueStr[/^.+(?=\[)/])
        value = converter.convert(
          valueStr.substring(0, valueStr.lastIndexOf('['))
        )
      } else if (
        ruleTokenConvert == null ||
        ruleTokenConvert[valueStr] == null
      ) {
        value = defaultConverter.convert(valueStr)
      } else {
        value = ruleTokenConvert[valueStr].convert(valueStr)
      }
    }
    retval.push(subscript)
    retval.push(value)
    return retval
  }

  /** @param token token. */
  shuntInternal(token = '') {
    if (isOpenBracket(token)) {
      this.stackOperations.push(token)
    } else if (isCloseBracket(token)) {
      while (
        this.stackOperations.length > 0 &&
        !isOpenBracket(last(this.stackOperations).trim())
      ) {
        this.stackRpn.push(this.stackOperations.pop())
      }
      this.stackOperations.pop()
    } else if (isOperator(token)) {
      while (
        this.stackOperations.length > 0 &&
        isOperator(last(this.stackOperations).trim()) &&
        precedence(token[0]) <= precedence(last(this.stackOperations).trim()[0])
      ) {
        this.stackRpn.push(this.stackOperations.pop())
      }
      this.stackOperations.push(token)
    } else {
      this.stackRpn.push(token)
    }
  }

  // private

  /**
   * @param scenario List of values to evaluate against the rule expression.
   * @param ruleTokenConvert token to converter map.
   */
  evaluateMultiRpn(scenario = [], ruleTokenConvert = {}) {
    /* clean answer stack */
    this.stackAnswer.length = 0

    /* get the clone of the RPN stack for further evaluating */
    const stackRpnClone = JSON.parse(JSON.stringify(this.stackRpn))

    /* evaluating the RPN expression */
    while (stackRpnClone.length > 0) {
      const token = stackRpnClone.pop().trim()
      if (isOperator(token)) {
        if (NOT.getSymbol() === token) {
          this.evaluateMultiNot(scenario)
        } else {
          this.evaluateMulti(scenario, ruleTokenConvert, fromSymbol(token[0]))
        }
      } else {
        this.stackAnswer.push(token)
      }
    }

    if (this.stackAnswer.length > 1) {
      throw new RuleError('Some operator is missing')
    }

    return this.stackAnswer.pop().substring(1)
  }

  /**
   * @param scenario List of values to evaluate against the rule expression.
   * @param ruleTokenConvert token to converter map.
   * @param operator OR/AND.
   */
  evaluateMulti(scenario = [], ruleTokenConvert = {}, operator = null) {
    // debugger

    const type = typeof scenario[0]
    const defaultConverter = DEFAULT_CONVERT_HASH[type]

    const leftArr = this.getNextValue(ruleTokenConvert, defaultConverter)
    const rightArr = this.getNextValue(ruleTokenConvert, defaultConverter)

    const operation = binaryOperation(operator.getName())

    // debugger

    const answer = operation(
      scenario,
      leftArr[0],
      rightArr[0],
      leftArr[1],
      rightArr[1]
    )

    if (answer[0] === '|') {
      this.stackAnswer.push(answer)
    } else {
      this.stackAnswer.push(`|${answer}`)
    }
  }

  /**
   * @param scenario List of values to evaluate against the rule expression.
   */
  evaluateMultiNot(scenario = []) {
    const left = this.stackAnswer.pop().trim()

    let answer
    if (TRUE === left) {
      answer = FALSE
    } else if (FALSE === left) {
      answer = TRUE
    } else {
      const subscript = extractSubscript(left)
      if (subscript < 0) {
        answer = (!contains(scenario, left)).toString()
      } else {
        const defaultConverter = DEFAULT_CONVERT_HASH[scenario.first.class]
        const converted = defaultConverter.convert(left[RE_TOKEN_BODY])
        answer = (scenario[subscript] === converted).toString()
      }
    }

    if (answer[0] === '|') {
      this.stackAnswer.push(answer)
    } else {
      this.stackAnswer.push(`|${answer}`)
    }
  }

  /** @param scenario to evaluate against the rule expression. */
  evaluateOneRpn(scenario = []) {
    const single = this.stackRpn[this.stackRpn.length - 1]
    const subscript = extractSubscript(single)
    if (subscript > -1) {
      const defaultConverter = DEFAULT_CONVERT_HASH[typeof scenario[0]]
      return (
        scenario[subscript] === defaultConverter.convert(single[RE_TOKEN_BODY])
      )
    }

    return scenario.indexOf(single) > -1
  }
}
