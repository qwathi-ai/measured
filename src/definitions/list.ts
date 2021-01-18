import autocast from '../core/autocast'
import m from '../core/models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const list: m.MeasuredDefinition<Array<any>> = {
  name: Symbol.for('list'),

  parse: (token: any, s?: m.MeasuredStack): Array<any> => {
    // redundant check
    let value = token.value || token

    if (!Array.isArray(value)) {
      throw new TypeError(`Expected ${JSON.stringify(value)} to be an array.`)
    }

    const resp = value.map((_) => {
      const a = autocast(s, _)
      return a.value
    })

    return resp
  }
}

export default list
