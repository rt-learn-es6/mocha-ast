/**
 * Shortlist score of 9, accept 10, and reject the rest
 */
const assessManager = (score) => {
  if (score === 9) return 'Shortlist'

  if (score === 10) return 'Accept'

  return 'Reject'
}

/**
 * Shortlist score of 8, accept 9 or 10, and reject the rest
 */
const assessSrEngineer = (score) => {
  if (score === 8) return 'Shortlist'

  if (score > 8) return 'Accept'

  return 'Reject'
}

/**
 * Score of 9 and above are overqualified, shortlist 7, accept 8, and reject the rest.
 */
const assessEngineer = (score) => {
  if (score > 8) return 'Over Qualified'

  if (score == 8) return 'Accept'

  if (score == 7) return 'Shortlist'

  return 'Reject'
}

export class Recruiter {
  getScore() {}
  getPosition() {}

  assess() {
    if (this.position === 'Manager') {
      return assessManager(this.score())
    }

    if (this.position === 'Senior Engineer') {
      return assessSrEngineer(this.score())
    }

    if (this.position === 'Engineer') {
      return assessEngineer(this.score())
    }
    return null
  }
}
