import m from '../core/models'
import h from '../core/helpers'
import o from '../core/options'

const rePercent = (o: string[]) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(`^[-+]{0,1}?\\d*[${o.join('')}]{0,1}\\d+%$`)
}

type MeasuredPercent<Number> = m.MeasuredDefinition<Number> & {
  _toNumber: (t: any) => number
}
/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const percent: MeasuredPercent<number> = {
  name: Symbol.for('percent'),

  intepretation: (t: any): boolean => {
    if (
      typeof t === 'string' &&
      rePercent(o.options.decimalseparator).test(t)
    ) {
      return true
    }
    return false
  },

  _toNumber: (t: any): number => {
    if (
      typeof t === 'string' &&
      rePercent(o.options.decimalseparator).test(t)
    ) {
      const n = percent._toNumber(t.replace('%', ''))
      return n
    }
    const per = h.parseNumber(t) / 100
    return h.parseNumber(per, true)
  },

  parse: (token: any): number => {
    let value = token.value || token
    return percent._toNumber(value)
  }
}

export default percent
