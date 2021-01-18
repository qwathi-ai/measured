namespace Models {
  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Options
   * Two options are currently available. These options can be extended or modified using `options.setoptions` method.
   *___
   * * **dateformat**:  Date [string format](https://day.js.org/docs/en/parse/string-format) to test dates. Defaults to `YYYY-MM-DD`
   * * **decimalseparator**:  Decimal part separator for numbers. Defaults to `.`
   * * **decimalplaces**: Number of digits to appear after the decimal seperator. If the `-1`, then numbers will not be formated. Defaults to -1
   */
  export interface MeasuredOptions {
    /**Date [string format](https://day.js.org/docs/en/parse/string-format) to test dates. Defaults to `YYYY-MM-DD` */
    dateformat: string[]
    /**Decimal part separator for numbers. Defaults to `.` */
    decimalseparator: string[]
    /** Number of digits to appear after the decimal seperator. If the `-1`, then numbers will not be formated. Defaults to -1*/
    decimalplaces: number
  }

  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Datum
   * Simple storage pattern for typed values `<T>`.
   *___
   * * **_source**: Original version of token.
   * * **symbol**: Intepreted symbol of token.
   * * **value**: Intepreted value of token.
   */
  export interface MeasuredDatum<T> {
    /**Original version of token. */
    _source?: unknown
    /**Intepreted symbol of token. */
    symbol: Symbol
    /**Intepreted value of token. */
    value: T
  }

  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Parser
   * Simple function for parsing unknown tokens to intepreted type values `<T>`.
   *___
   * @param token token to intepret.
   * @returns intepreted value `<T>`.
   */
  export type MeasuredParser<T> = (token?: unknown, s?: MeasuredStack) => T

  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Intepretation
   * Simple function to determine if a token can be intepreted by definition.
   *___
   * @param token token to intepret.
   * @returns true if token can be intepreted, otherwise false.
   */
  export type MeasuredIntepretation = (token?: unknown) => boolean

  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Definition
   * Simple model for defining typed values `<T>`.
   *___
   * * **name**: Symbolic reference to definition of type `<T>`.
   * * **parse**: Simple function for parsing unknown tokens to intepreted typed value `<T>`.
   * * **detect**: Optional function to determine if a token can be intepreted by definition.
   */
  export interface MeasuredDefinition<T> {
    /**Symbolic reference to type `<T>`. */
    name: string | Symbol

    /**
     * @internal
     * @memberof core.models
     *
     * ### `Measured` Parser
     * Simple function for parsing unknown tokens to intepreted type values `<T>`.
     *___
     * @param token token to intepret.
     * @returns intepreted value `<T>`.
     */
    parse: MeasuredParser<T>

    /**
     * @internal
     * @memberof core.models
     *
     * ### `Measured` Intepretation
     * Simple function to determine if a token can be intepreted by definition.
     *___
     * @param token token to intepret.
     * @returns true if token can be intepreted, otherwise false.
     */
    intepretation?: MeasuredIntepretation
  }

  /**
   * @internal
   * @memberof core.models
   *
   * ### `Measured` Stack
   * Stack engine with simple data methods. api described below.
   *___
   * * **define**: define a new parser of type `<T>`
   * * **remove**: remove a parser
   * * **intepret**: return a symbolic intepretation of an unknown token.
   * * **parse**: parse a token with a specified parser into a `Measured` datum.
   * * **ls**: list all available symbolic parsers
   */
  export interface MeasuredStack {
    /**
     * @internal
     * @memberof core.models
     *
     * #### Definitions
     * list all available definitions
     *___
     */
    definitions: MeasuredDefinition<any>[]

    /**
     * @internal
     * @memberof core.models
     *
     * #### Define
     * Define a new intepretation of value type `<T>`
     *___
     * @param def definition of parser
     */
    define: <T>(def: MeasuredDefinition<T>) => void

    /**
     * @internal
     * @memberof core.models
     *
     * #### isDefined
     * checks if a particular symbol is defined
     *___
     * @param sym symbol to validate.
     */
    isDefined(sym: string | Symbol): boolean

    /**
     * @internal
     * @memberof core.models
     *
     * #### Get
     * return definition for symbol.
     *___
     * @param sym symbol to get the definition of.
     */
    get(sym: string | Symbol): MeasuredDefinition<any> | undefined

    /**
     * @internal
     * @memberof core.models
     *
     * #### Remove
     * remove a definition
     *___
     * @param sym symbol to remove
     */
    remove: (sym: string | Symbol) => void

    /**
     * @internal
     * @memberof core.models
     *
     * #### Intepret
     * intepret a token.
     *___
     * @param t token to intepret.
     */
    intepret: (t: any) => Symbol

    /**
     * @internal
     * @memberof core.models
     *
     * #### Invoke
     * cast a token with a specified parser into a `Measured` datum.
     *___
     * @param sym symbol of parser to cast token with.
     * @param t token to invoke.
     * @returns datum of typed symbol typed value.
     */
    invoke: (sym: string | Symbol, t: any) => MeasuredDatum<any>
  }

  export interface MeasuredArguments {
    token: any
    _parsers: MeasuredStack
  }
}

export default Models
