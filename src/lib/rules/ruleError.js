export class RuleError extends Error {
  constructor(message) {
    super()
    this.name = 'RuleError'
    this.message = message || 'Rule Error'
  }
}
