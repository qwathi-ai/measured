import m from '../core/models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const bool: m.MeasuredDefinition<boolean> = {
  name: Symbol.for('boolean'),

  parse: (token: any): boolean => {
    // redundant check
    let value = token.value || token
    if (typeof value === 'string') {
      value = value.trim().toLowerCase() === 'true' ? true : false
    }
    return Boolean(value)
  }
}

export default bool
