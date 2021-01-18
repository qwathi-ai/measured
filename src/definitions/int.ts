import m from '../core/models'
import h from '../core/helpers'
/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const int: m.MeasuredDefinition<number> = {
  name: Symbol.for('integer'),

  parse: (token: any): number => {
    // redundant check
    let value = token.value || token

    // if (!h.isValidNumber(value)) {
    //   throw new TypeError(`Expected ${value} to be a finite integer.`)
    // }
    if (!h.isInteger(value)) {
      throw new TypeError(`Expected ${value} to be a finite integer.`)
    }

    return h.parseNumber(value, true)
  }
}

export default int
