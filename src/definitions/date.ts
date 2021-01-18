import { isDayjs } from 'dayjs'
import o from '../core/options'
import m from '../core/models'
import h from '../core/helpers'

/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const date: m.MeasuredDefinition<string> = {
  name: Symbol.for('date'),

  parse: (token: any): string => {
    // redundant check
    let value: any = token.value || token
    const opt = o.options.dateformat

    if (isDayjs(value)) {
      value = value.format(opt[0])
    }

    if (h.isJSDate(value)) {
      if (isNaN(value.getTime())) {
        throw new TypeError(
          `Expected ${value} to be a valid date with format ${opt}.`
        )
      }
      value = value.toISOString()
    }

    if (
      value &&
      typeof value === 'string' &&
      !h.isValidDate(value, opt as any)
    ) {
      throw new TypeError(
        `Expected ${JSON.stringify(
          value,
          null,
          2
        )} to be a valid date with format ${opt}.`
      )
    }

    // console.log(token, value, h.parseDate(value, opt).format(opt[0]))

    return h.parseDate(value, opt).format(opt[0])
  }
}

export default date
