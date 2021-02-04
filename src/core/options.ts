import m from './models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof core.options
 */
namespace options {
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.options
   */
  export const allowed_delimeters = [',', '.']

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.options
   */
  export const options = Object.create({
    dateformat: ['YYYY-MM-DD'],
    decimalseparator: ['.'],
    decimalplaces: -1
    // socket: 'ws://localhost:4170/amile'
  }) as m.MeasuredOptions

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.options
   */
  const checkSeparators = (d: string) => {
    if (d && allowed_delimeters.indexOf(d) === -1) {
      throw new Error(
        `Expected ${d} to be one of the following: ${JSON.stringify(
          allowed_delimeters
        )}.`
      )
    }
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.options
   */
  export const setoptions = (o?: any): void => {
    if (!o) {
      return
    }
    let opt = Object.create(null)

    if (o.dateformat) {
      opt.dateformat = Array.isArray(o.dateformat)
        ? o.dateformat
        : [o.dateformat]
    }

    if (o.decimalseparator) {
      opt.decimalseparator = Array.isArray(o.decimalseparator)
        ? o.decimalseparator
        : [o.decimalseparator]
      opt.decimalseparator.map(checkSeparators)
    }

    if (o.decimalplaces) {
      if (
        !(
          typeof o.decimalplaces === 'number' &&
          Number.isInteger(o.decimalplaces)
        )
      ) {
        throw new TypeError(
          `Expected "decimalplaces" property to be a finite integer.`
        )
      }
      opt.decimalplaces = o.decimalplaces
    }

    if (o.socket) {
      if (typeof o.socket !== 'string') {
        throw new TypeError(`Expected "socket" property to be a url string.`)
      }
      opt.socket = o.socket
    }

    Object.assign(options, opt)
    return
  }
}

export default options
