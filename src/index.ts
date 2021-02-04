import _ from './core'
import m from './core/models'
import amile from './core/amile'

const ai = new amile()

import nothing from './definitions/nothing'
import bool from './definitions/bool'
import int from './definitions/int'
import num from './definitions/num'
import date from './definitions/date'
import percent from './definitions/percent'
import list from './definitions/list'
import dictionary from './definitions/dictionary'

const stack = _.stack.initialize([
  nothing,
  bool,
  int,
  num,
  date,
  percent,
  list,
  dictionary
])

/**
 * # `Measured`
 * * If no token, `null` or `undefined` is given,  `nothing` is returned.
 * * If token is "double-quoted" string, token is `JSON.parsed` .
 * * If token is `String(10)`, token is parsed into `number` and rerun through autocast function.
 * * If token is date `string` and is in a valid format, `date` type is returned.
 *
 * Inspired by [aqbjs](https://github.com/arangodb/aqbjs)
 * ```js
 * const measured = require('@jamangile/measured')
 * measured.setoptions({
 *  dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY'],
 *  decimalseparator: [',', '.'],
 *  decimalplaces: 3
 * })
 *
 * assert(measured('').symbol === Symbol.for('nothing'))
 * assert(measured('"21-05-2020"').symbol === Symbol.for('date'))
 * assert(measured('10,49%').value === 0.105)
 * ```
 * ___
 * @param token to auto-cast.
 */
const measured = (token: any): m.MeasuredDatum<unknown> => {
  return _.autocast(stack, token)
}

measured.ai = ai

/**
 * ## Set Options
 *
 * Two options available in `@jamangile/measured`.
 *
 * ### Date format
 * Set a list of different date formats `@jamangile/measured` should parse.
 * This value defaults to <u>the first date format given in the options</u> .
 * To get an exhaustive list of available date formats see [string format](https://day.js.org/docs/en/parse/string-format).
 *
 * Date format options can be given as a string parameter or an array of acceptable date formats.
 *
 * ```js
 * // YYYY-MM-DD
 * measured.setoptions({dateformat:'YYYY-MM-DD'})
 * assert(measured('2020-05-21').symbol === Symbol.for('date'))
 * assert(measured('05-21-2020').symbol === Symbol.for('unknown'))
 *
 * // MM-DD-YYYY
 * measured.setoptions({dateformat:'MM-DD-YYYY'})
 * assert(measured('2020-05-21').symbol === Symbol.for('unknown'))
 * assert(measured('05-21-2020').symbol === Symbol.for('date'))
 *
 * // YYYY-MM-DD && MM-DD-YYYY
 * measured.setoptions({dateformat: ['YYYY-MM-DD', 'MM-DD-YYYY']})
 * assert(measured('2020-05-21').symbol === Symbol.for('date'))
 * assert(measured('05-21-2020').symbol === Symbol.for('date'))
 * ```
 *
 * ### Decimal seperator
 * Set a list of different decimal separators to parse numbers.
 * This value defaults to `"."`. <u>Only `"."`  and `","` are allowed as inputs, otherwise an error it thrown.</u>
 *
 * ```js
 * // "."
 * measured.setoptions({decimalseparator:'.'})
 * assert(measured('10.4').symbol === Symbol.for('number'))
 * assert(measured('10,4').symbol === Symbol.for('unknown'))
 *
 * // ","
 * measured.setoptions({decimalseparator:','})
 * assert(measured('10.4').symbol === Symbol.for('unknown'))
 * assert(measured('10,4').symbol === Symbol.for('number'))
 *
 * // "," && "."
 * measured.setoptions({decimalseparator:[',','.']})
 * assert(measured('10.4').symbol === Symbol.for('number'))
 * assert(measured('10,4').symbol === Symbol.for('number'))
 * ```
 * ___
 * @param options set options to these values.
 */
measured.setoptions = _.options.setoptions

/**
 * ## Define
 *
 * Extend the stack by creating your own definition(s). For now, a definition requires three properties.
 * * **`name` :** a name for the definition. Accepts both string value and symbols.
 * * **`parse`:** a function defining how to process unknown tokens.
 * * **`intepretation` :** *an optional* function defining if an unknown token can be processed. (The name sounds a bit suspect to me, but let's continue.)
 *
 * ### Create a custom definition
 * Below is an example of a simple definition. It parses a greeting.
 *
 * ```js
 * const measured = require('@jamangile/measured')
 * const symbolForGreeting = Symbol.for('greeting')
 *
 * const Greeting = {
 *  name: symbolForGreeting || 'greeting',
 *  intepretation: (token) => {
 *    return typeof token === 'string' && token.startsWith('hello') ? true : false
 *  },
 *  parse: (token) => {
 *    if (!Greeting.intepretation) {
 *      throw TypeError(`Expected value of pattern "hello xxx".`)
 *    }
 *    return token.replace('hello', 'how are you doing today,') + "?"
 *  }
 * }
 *
 * measured.define(Greeting) // measured.define( [ Greeting ] )
 * assert(measured('hello world').symbol === symbolForGreeting || Symbol.for('greeting'))
 * assert(measured('hello world').value === 'how are you doing today, world?')
 * ```
 * ___
 * @param definition definition of your custom type.
 */
measured.define = <T>(def: m.MeasuredDefinition<T>): void => {
  if (Array.isArray(def)) def.map(stack.define)
  else stack.define(def)
}

/**
 * ## Invoke
 * A definition can be invoked using either the name or the symbol. It is, however, recommended that a symbol is used to invoke a custom definitions
 *
 * ```js
 * const greeting = measured.invoke(symbolForGreeting, 'hello Jamangile') // recommended
 * const greeting2 = measured.invoke(Symbol.for('greeting'), 'hello Jamangile') // works
 *
 * assert(greeting.value === 'how are you doing today, Jamangile?')
 * assert(greeting.value === greeting2.value)
 * assert(greeting.symbol === greeting2.symbol)
 * ```
 * ___
 * @param symbol definition to invoke.
 * @param token token to parse.
 */
measured.invoke = <T>(s: Symbol | string, t: any): m.MeasuredDatum<T> => {
  return stack.invoke(s, t)
}

/**
 * ## List
 *
 * List all available definition in local store.
 */
measured.list = stack.definitions.map((d) => d.name)

/**
 * ### Remove
 *
 * Removes a definition from local store.
 * ___
 * @param symbol definition to remove.
 */
measured.remove = (s: Symbol | string) => {
  stack.remove(s)
}

/**
 * ### Is Valid Date
 *
 * Checks that a token is a valid date and is with the correct format. `@jamangile/measured` uses [dayjs](https://github.com/iamkun/dayjs) to check against a date format in the following manner.
 * * Checks string formats exactly match formats listed in [`dateformat`](#date-format) options property.
 * * Checks that the date [is valid](https://github.com/iamkun/dayjs/issues/306).
 * * Allows for custom [formats](https://day.js.org/docs/en/parse/string-format).
 *
 * ```js
 * measured.setoptions({dateformat:'MM-DD-YYYY'})
 * assert(measured.isValid('05-21-2020') === true)
 * ```
 * ___
 * @param t unknown date token to validate.
 * @param o _optional_. Set new option parameters on runtime.
 */
measured.isValidDate = _.helpers.isValidDate

/**
 * ### Is Valid Number
 *
 * Validates that a token is a valid finite number.
 * * Checks decimal seperators match seperators listed in [`decimalseparator`](#decimal-seperator) options property.
 * * Checks that number is a valid finite number.
 *
 * ```js
 * measured.setoptions({decimalseparator:','})
 * assert(measured.isValidNumber('-10,5') === true)
 * ```
 * ___
 * @param t unknown number token to validate.
 */
measured.isValidNumber = _.helpers.isValidNumber

/**
 * ### Parse Number
 *
 * Parse a numerical token into a number.
 *
 * * Checks decimal seperators match seperators listed in [`decimalseparator`](#decimal-seperator) options property.
 * * Checks that number is a valid finite number.
 * * Applies number of decimal places to response. This is Optional.
 * ___
 * @param n numerical token to parse.
 */
measured.parseNumber = _.helpers.parseNumber

/**
 * ### Parse Date
 *
 * Parse a date token into a date string.
 *
 * * Checks decimal seperators match seperators listed in [`dateformat`](#decimal-seperator) options property.
 * * Checks that number is a valid finite number.
 * * Applies number of decimal places to response. This is Optional.
 * ___
 * @param n numerical token to parse.
 */
measured.parseDate = _.helpers.parseDate

export default measured
