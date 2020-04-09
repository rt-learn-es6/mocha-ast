/**
 * Used to provide assertion check similar to java
 * @param  {[type]} condition [description]
 * @param  {[type]} message   [description]
 * @return {[type]}           [description]
 */
export const assert = (condition, message) => {
  if (!condition) {
    throw message || 'Assertion failed'
  }
}
