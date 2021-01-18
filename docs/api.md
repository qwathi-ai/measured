## Autocast

* If no token, `null` or `undefined` is given,  token is parsed into nothing.
* If token is "double-quoted" string, token is `JSON.parsed` .
* If token is numerical string, token is parsed into `number`.
* If token is date `string` and is in a valid format, token is parsed into date.

Inspired by [aqbjs](https://github.com/arangodb/aqbjs)

```js
const measured = require('@qwathi-ai/measured')

measured.setoptions({
  dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY'],
  decimalseparator: [',', '.'],
  decimalplaces: 3
})

assert(measured('').symbol === Symbol.for('nothing'))
assert(measured('"21-05-2020"').symbol === Symbol.for('date'))
assert(measured('10,49%').value === 0.105)
```

## Set Options

Two options available in `@qwathi-ai/measured`.

### Date format

Set a list of different date formats `@qwathi-ai/measured` should parse. This value defaults to <u>the first date format given in the options</u> . To get an exhaustive list of available date formats see [string format](https://day.js.org/docs/en/parse/string-format).

Date format options can be given as a string parameter or an array of acceptable date formats.

```js
// YYYY-MM-DD
measured.setoptions({dateformat:'YYYY-MM-DD'})
assert(measured('2020-05-21').symbol === Symbol.for('date'))
assert(measured('05-21-2020').symbol === Symbol.for('unknown'))

// MM-DD-YYYY
measured.setoptions({dateformat:'MM-DD-YYYY'})
assert(measured('2020-05-21').symbol === Symbol.for('unknown'))
assert(measured('05-21-2020').symbol === Symbol.for('date'))

// YYYY-MM-DD && MM-DD-YYYY
measured.setoptions({dateformat: ['YYYY-MM-DD', 'MM-DD-YYYY']})
assert(measured('2020-05-21').symbol === Symbol.for('date'))
assert(measured('05-21-2020').symbol === Symbol.for('date'))
```

### Decimal seperator

Set a list of different decimal separators to parse numbers. This value defaults to `"."`. <u>Only `"."`  and `","` are allowed as inputs, otherwise an error it thrown.</u>

```js
// "."
measured.setoptions({decimalseparator:'.'})
assert(measured('10.4').symbol === Symbol.for('number'))
assert(measured('10,4').symbol === Symbol.for('unknown'))

// ","
measured.setoptions({decimalseparator:','})
assert(measured('10.4').symbol === Symbol.for('unknown'))
assert(measured('10,4').symbol === Symbol.for('number'))

// "," && "."
measured.setoptions({decimalseparator:[',','.']})
assert(measured('10.4').symbol === Symbol.for('number'))
assert(measured('10,4').symbol === Symbol.for('number'))
```

## Define

Extend the `@qwathi-ai/measured` by creating your own definition(s). For now, a definition requires three properties.

* **`name` :** a name for the definition. Accepts both string value and symbols.
* **`parse`:** a function defining how to process unknown tokens.
* **`intepretation` :** a function defining if an unknown token can be processed. (The name sounds a bit suspect to me, but let's continue.)

### Create a custom definition

Below is an example of a simple definition. It defines how to parse a greeting.

```js
const measured = require('@qwathi-ai/measured')
const symbolForGreeting = Symbol.for('greeting')

const Greeting = {
  name: symbolForGreeting || 'greeting',
  intepretation: (token) => {
    return typeof token === 'string' && token.startsWith('hello') ? true : false
  },
  parse: (token) => {
    if (!Greeting.intepretation) {
      throw TypeError(`Expected value of pattern "hello xxx".`)
    }
   return token.replace('hello', 'how are you doing today,') + "?"
  }
}

measured.define(Greeting) // measured.define( [ Greeting ] )
assert(measured('hello world').symbol === symbolForGreeting || Symbol.for('greeting'))
assert(measured('hello world').value === 'how are you doing today, world?')
```

## Invoke

A definition can be invoked using either the name or the symbol. It is, however, recommended that a symbol is used to invoke custom definitions.

```js
const greeting = measured.invoke(symbolForGreeting, 'hello Jamangile') // recommended
const greeting2 = measured.invoke(Symbol.for('greeting'), 'hello Jamangile') // works

assert(greeting.value === 'how are you doing today, Jamangile?')
assert(greeting.value === greeting2.value)
assert(greeting.symbol === greeting2.symbol)
```

## List

List all available definitions stored locally.

```js
console.log(measured.list)
```

## Remove

Removes a definition from local store.

```js
measured.remove(symbolForGreeting)
console.log(measured.list) 
```

## Helpers

Some helpers functions have been made available.

### Is Valid Date

Checks that a token is a valid date and is with the correct format. `@qwathi-ai/measured` uses [dayjs](https://github.com/iamkun/dayjs) to check against a date format in the following manner.

* Checks string formats exactly match formats listed in [`dateformat`](#date-format) options property. This can be overwritten passing the `dateFormat` argument.
* Checks that the date [is valid](https://github.com/iamkun/dayjs/issues/306).

```js
measured.setoptions({dateformat:'MM-DD-YYYY'})
assert(measured.isValidDate('05-21-2020') === true)
assert(measured.isValidDate('05-21-2020', 'MM-DD-YYYY') === true)
```

### Is Valid Number

Validates that a token is a valid finite number.

* Checks decimal seperators match seperators listed in [`decimalseparator`](#decimal-seperator) options property.
* Checks that number is a valid finite number.

```js
measured.setoptions({decimalseparator:','})
assert(measured.isValidNumber('-10,5') === true)
```

### Parse Number

Parse a numerical string.

* Checks decimal seperators match seperators listed in [`decimalseparator`](#decimal-seperator) options property.
* Checks that number is a valid finite number.
* Applies number of decimal places to response. This is Optional, it can be applied by passing the `decimalPlaces` argument to true.

```js
measured.setoptions({decimalseparator:','})
assert(measured.parseNumber('-10,5') === -10.5)
```

### Parse Date

Parse a string into a [dayjs](https://github.com/iamkun/dayjs) object.

* Checks string formats exactly match formats listed in [`dateformat`](#date-format) options property.
* Checks that the date [is valid](https://github.com/iamkun/dayjs/issues/306).
* Allows for custom [formats](https://day.js.org/docs/en/parse/string-format).
* Returns dayjs date object

```js
measured.setoptions({dateformat:['YYYY-MM-DD','MM-DD-YYYY']})
assert(measured.parseDate('05-21-2020').format('YYYY-MM-DD') === '2020-21-05')
assert(measured.parseDate('05-21-2020',['YYYY-MM-DD','MM-DD-YYYY']).format('YYYY-MM-DD') === '2020-21-05')
```

