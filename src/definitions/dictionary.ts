import autocast from '../core/autocast'
import m from '../core/models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const dictionary: m.MeasuredDefinition<any> = {
  name: Symbol.for('dictionary'),

  parse: (token: any, stack?: m.MeasuredStack): any => {
    // redundant check
    const value = token.value || token

    if (Object.prototype.toString.call(value) !== '[object Object]') {
      throw new TypeError(`Expected ${value} to be an object.`)
    }
    const r: any = Object.create(null)

    for (let [key, t] of Object.entries(value)) {
      const a = autocast(stack!, t)
      r[key] = a.value
    }

    return r
  }
}

export default dictionary
