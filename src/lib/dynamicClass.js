import { StringConverter } from '~/src/lib/converters/stringConverter'
import { BooleanConverter } from '~/src/lib/converters/booleanConverter'
import { NumberConverter } from '~/src/lib/converters/numberConverter'

// Use ES6 Object Literal Property Value Shorthand to maintain a map
// where the keys share the same names as the classes themselves
const classes = {
  StringConverter,
  BooleanConverter,
  NumberConverter,
}

export class DynamicClass {
  constructor(className) {
    return new classes[className]()
  }
}
