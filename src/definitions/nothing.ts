import m from '../core/models'
/**
 * @internal
 * @private
 * @ignore
 * @memberof definitions
 */
export const nothing: m.MeasuredDefinition<undefined> = {
  name: Symbol.for('nothing'),

  parse: (): undefined => {
    // redundant check
    return undefined
  }
}

export default nothing
