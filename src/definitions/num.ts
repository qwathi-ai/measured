import m from '../core/models'
import h from '../core/helpers'
/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const num: m.MeasuredDefinition<number> = {
  name: Symbol.for('number'),

  parse: (token: any): number => {
    // redundant check
    let value = token.value || token

    // if (!h.isValidNumber(value)) {
    //   throw new TypeError(`Expected ${value} to be a finite number.`)
    // }

    return h.parseNumber(value, true)
  }
}

export default num
