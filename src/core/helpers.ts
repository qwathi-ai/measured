import dayjs, { Dayjs } from 'dayjs'
import cpf from 'dayjs/plugin/customParseFormat'
dayjs.extend(cpf)

import o from './options'
import m from './models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof core.helpers
 */
namespace helpers {
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const resolver = (
    symbol: Symbol,
    _source: any,
    value: any,
    stack?: m.MeasuredStack
  ): m.MeasuredDatum<any> => {
    const _s = stack && stack.invoke ? stack.invoke(symbol, value) : { value }
    return {
      symbol,
      _source,
      value: _s.value
    }
  }
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const assign = (
    _d: m.MeasuredDefinition<any>,
    memory: Map<Symbol, m.MeasuredDefinition<any>>
  ): Map<Symbol, m.MeasuredDefinition<any>> => {
    // first ensure name is a symbol
    if (!_d || !(_d.name && _d.parse)) {
      throw new TypeError(
        `Definition must at least have a name and parse function.`
      )
    }
    if (!memory) {
      throw new Error(
        `assign method requires a definition and a Map to assign the definition to.`
      )
    }
    let _symbol: any = false
    if (typeof _d.name === 'string') {
      _symbol = Symbol.for(_d.name)
    }
    if (typeof _d.name === 'symbol') {
      _symbol = _d.name
    }
    if (!_symbol) {
      throw new TypeError(`Expected ${_d.name} to be either a string or symbol`)
    }

    // check if a parser for this symbol already exists
    if (memory.has(_symbol)) {
      throw new Error(`Parser for ${_symbol} already exists`)
    }
    memory.set(_symbol, _d)
    return memory
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const isValidDate = (t: any, dateFormats?: any): boolean => {
    // console.log(t, isJSDate(t), dateFormats)
    if (isJSDate(t)) {
      return !isNaN(t.getTime())
    }
    return dayjs(t, dateFormats || o.options.dateformat).isValid()
  }
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const isJSDate = (t: any): boolean => {
    return (
      typeof t.getMonth === 'function' &&
      t instanceof Date &&
      Object.prototype.toString.call(t) === '[object Date]'
    )
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const parseDate = (t: any, dateFormats?: any): Dayjs => {
    const fmts = dateFormats || o.options.dateformat
    if (!isValidDate(t, fmts)) {
      throw new TypeError(`Expected ${t} to be a valid date.`)
    }
    if (isJSDate(t)) {
      return dayjs(t.toISOString(), fmts)
    }
    // console.log(t, fmts, dayjs(t, fmts))
    return dayjs(t, fmts)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  const reNumber = (d: string) =>
    // eslint-disable-next-line security/detect-non-literal-regexp
    new RegExp(`^[-+]{0,1}?\\d*[${d}]{0,1}\\d+$`)

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  const isNumber = (t: any) => {
    if (typeof t === 'number') {
      return true
    }

    if (
      typeof t === 'string' &&
      reNumber(o.options.decimalseparator.join('')).test(t)
    ) {
      return true
    }
    return false
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const isValidNumber = (t: any): boolean => {
    return isNumber(t)
      ? t === t && Number(t) !== Infinity && Number(t) !== -Infinity
      : false
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const isInteger = (t: any): boolean => {
    return isValidNumber(t) ? Number.isInteger(Number(t)) : false
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const parseNumber = (t: any, decimalPlaces?: boolean): number => {
    if (!isValidNumber(t)) {
      throw new TypeError(`Expected ${t} to be a valid finite number.`)
    }
    const places = o.options.decimalplaces
    const strip = places && places > -1 && decimalPlaces
    let number = t

    if (typeof t === 'string' && t.includes(',')) {
      number = Number(number.replace(',', '.'))
    } else {
      number = Number(number)
    }
    // console.log(number, strip, places)
    if (strip) {
      number = Number(number.toFixed(places))
    }
    return number
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.helpers
   */
  export const isQuotedString = (s: string): boolean => {
    return (
      s.length >= 2 &&
      s.charAt(0) === s.charAt(s.length - 1) &&
      s.charAt(0) === '"'
    )
  }
}
export default helpers
