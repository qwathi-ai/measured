import m from './models'
import h from './helpers'
import amile from './amile'

class MeasuredStack implements m.MeasuredStack {
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  private _definitions: Map<Symbol, m.MeasuredDefinition<any>>

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  constructor(
    defs?: m.MeasuredDefinition<any> | m.MeasuredDefinition<any>[],
    stack?: Map<Symbol, m.MeasuredDefinition<any>>
  ) {
    let memory = stack || new Map()

    let _definitions = defs ? (Array.isArray(defs) ? defs : [defs]) : []
    for (let def of _definitions) {
      if (def) memory = h.assign(def, memory)
    }

    this._definitions = memory
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  get definitions(): m.MeasuredDefinition<any>[] {
    const _r = new Array()
    for (let def of this._definitions) {
      _r.push(def[1])
    }
    return _r
  }
  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   *
   * #### Initialize
   * Re-initialize stack engine with listed definitions.
   *___
   * @param def list of definitions to include in stack.
   * @param stack optional initialzed stack to append definitions to.
   * @returns new measured stack
   */
  public static initialize<T>(
    def?: m.MeasuredDefinition<T> | m.MeasuredDefinition<T>[],
    stack?: Map<Symbol, m.MeasuredDefinition<any>>
  ): m.MeasuredStack {
    return new MeasuredStack(def, stack)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public define<T>(def: m.MeasuredDefinition<T>): void {
    this._definitions = h.assign(def, this._definitions)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public isDefined(sym: string | Symbol): boolean {
    const s: any = typeof sym === 'string' ? Symbol.for(sym) : sym
    return this._definitions.has(s)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public get(sym: string | Symbol): m.MeasuredDefinition<any> | undefined {
    const s: any = typeof sym === 'string' ? Symbol.for(sym) : sym
    return this._definitions.get(s)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public remove(sym: string | Symbol): void {
    const s = typeof sym === 'string' ? Symbol.for(sym) : sym
    this._definitions.delete(s)
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public intepret(token: any): Symbol {
    const t = token.value || token
    let found = undefined
    const cur = this._definitions.entries()
    let iter = cur.next()
    while (!iter.done) {
      const sym: any = iter.value[0]
      const def: m.MeasuredDefinition<any> = iter.value[1]
      if (def && def.intepretation && def.intepretation(t)) {
        found = sym
        break
      }
      iter = cur.next()
    }
    return found
  }

  /**
   * @internal
   * @private
   * @ignore
   * @memberof core.stack
   */
  public invoke<T>(sym: string | Symbol, t: any): m.MeasuredDatum<T> {
    const symbol = typeof sym === 'string' ? Symbol.for(sym) : sym
    const value: any = t.value || t
    const def: m.MeasuredDefinition<any> | undefined = this._definitions.get(
      symbol
    )
    // console.log(def, value, this)
    return def
      ? { _source: value, value: def.parse(value, this), symbol }
      : { _source: value, value, symbol: Symbol.for('unknown') }
  }
}

export default MeasuredStack
