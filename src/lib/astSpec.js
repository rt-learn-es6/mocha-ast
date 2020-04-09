/**
 * CaseFixture.java, containing an actual and specific combination of variables.
 * @deprecated
 */
export class AstSpec {
  constructor(description = '', variables = [], rule = null) {
    this.description = description
    this.variables = variables
    this.pair = {}
    this.pairReversed = {}
    this.rule = rule
    this.exemptRule = null
    return this
  }

  initPair(pairConfig = {}) {
    const key = Object.keys(pairConfig)[0].toString()
    const value = pairConfig[key].toString()
    this.pair[key] = value.toString()
    this.pairReversed[value] = key
    return this
  }

  initConverters(converters = []) {
    this.converters = converters
    return this
  }

  initExemptRule(exemptRule) {
    this.exemptRule = exemptRule
    return this
  }

  getVariables() {
    return this.variables
  }

  getPair() {
    return this.pair
  }

  getPairReversed() {
    return this.pairReversed
  }

  getRule() {
    return this.rule
  }

  getDescription() {
    return this.description
  }

  getExemptRule() {
    return this.exemptRule
  }

  getConverters() {
    return this.converters
  }

  toString() {
    return `Class: ${typeof this}
Description: ${this.description}
Variables: ${this.variables}
Rules: ${this.rules}
Pair: ${this.pair}
Converters: ${this.converters}
    `
  }
}
