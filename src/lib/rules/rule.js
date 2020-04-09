import { contains } from '~/src/utils/arrayUtils'
import { RuleError } from './ruleError'

/**
 * Represents a logical rule object. For es6 let's keep this as an object to keep
 * the utility functions compartmentalized.
 */
export class Rule {
  /**
   * TODO: Validation of the output_clause_src parameter.
   *
   * Instantiate a rule with the given clause. <br/>
   * <br/>
   * <b>Parameter Example:</b><br/>
   * Visible:Proposed|Approved<br/>
   * <br/>
   * Peace:Friendly|Indifferent\<br/>
   * ~War:Angry\<br/>
   * ~Neutral:Play safe
   */
  constructor(rules = {}) {
    if (rules.length === 0) {
      throw new RuleError('Must not have empty rules')
    }

    this.outcomeClauseHash = {}
    const dups = []

    Object.keys(rules).forEach((outcome) => {
      let clause = rules[outcome]

      if (dups.indexOf(outcome) > -1) {
        throw new RuleError(`${outcome} matched multiple clauses`)
      }

      dups.push(outcome)

      clause = Rule.removeSpaces(clause, '\\(')
      clause = Rule.removeSpaces(clause, '\\)')
      clause = Rule.removeSpaces(clause, '&')
      clause = Rule.removeSpaces(clause, '\\|')
      clause = Rule.removeSpaces(clause, '!')
      this.outcomeClauseHash[outcome.toString()] = clause.trim()
    })

    return this
  }

  getSize() {
    return Object.keys(this.outcomeClauseHash).length
  }

  /**
   * Removes the leading and trailing spaces of rule tokens.
   *
   * @param string rule clause.
   * @param separator rule clause token.
   */
  static removeSpaces(string = '', separator = '') {
    return string.replace(new RegExp(`\\s*${separator} \\s*`, 'g'), separator)
  }

  /**
   * @return the outcomes array
   */
  getOutcomes() {
    return Object.keys(this.outcomeClauseHash)
  }

  /**
   * @param action action which rule we want to retrieve.
   * @return the actionToRuleClauses
   */
  getClause(outcome = '') {
    return this.outcomeClauseHash[outcome]
  }

  /**
   * Get rule result give a fixed list of scenario tokens. Used for fixed
   * list.
   *
   * @param scenario of interest.
   * @return the actionToRuleClauses
   */
  getRuleOutcome(scenario = []) {
    const scenStr = scenario.toString()
    const andedScen = scenStr.substr(1, scenStr.length - 2).replace(/,\s/g, '&')

    Object.keys(this.outcomeRuleHash).forEach((output) => {
      const clause = this.outcomeRuleHash[output]
      const orListClause = clause.split('\\|').map((x) => x.trim())
      if (contains(orListClause, andedScen)) {
        return output
      }
      return null
    })
  }

  /**
   * @see {@link Object#toString()}
   * @return String representation of this instance.
   */
  toString() {
    return this.outcomeClauseHash.toString()
  }
}
