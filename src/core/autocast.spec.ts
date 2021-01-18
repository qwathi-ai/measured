/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import autocast from './autocast'
import o from './options'

o.setoptions({
  dateformat: 'DD-MM-YYYY',
  decimalseparator: '.'
})

describe('Autocast', () => {
  // options
  it('should be a function', () => {
    expect(autocast).to.be.a('function')
  })

  // nothing
  it(`should return symbol for nothing`, () => {
    ;['', undefined, null].forEach((t) => {
      const r = autocast(undefined, t)
      expect(r.symbol).to.equal(Symbol.for('nothing'))
    })
  })

  // bool
  it(`should return symbol for bool `, () => {
    ;[`"true"`, 'true', true].forEach((t) => {
      const r = autocast(undefined, t)
      expect(r.symbol).to.equal(Symbol.for('boolean'))
    })
  })

  // number
  it(`should return symbol for number with default seperator '.'`, () => {
    ;[`"42.1"`, '42.1', 42.1].forEach((t) => {
      const symbol = autocast(undefined, t)
      expect(symbol.symbol).to.equal(Symbol.for('number'))
    })
  })

  // number with different seperators
  it(`should return symbol for number with any allowed seperators [',', '.']`, () => {
    // change options to array
    o.setoptions({
      decimalseparator: [',', '.']
    })
    ;[`"42,1"`, '42.1', 42.1].forEach((t) => {
      const symbol = autocast(undefined, t)
      expect(symbol.symbol).to.equal(Symbol.for('number'))
    })
  })

  // integer
  it(`should return symbol for integer `, () => {
    ;[`"42"`, '42', 42].forEach((t) => {
      const symbol = autocast(undefined, t)
      expect(symbol.symbol).to.equal(Symbol.for('integer'))
    })
  })

  // date
  it(`should return symbol for date string in default format 'YYYY-MM-DD' `, () => {
    o.setoptions({
      dateformat: 'YYYY-MM-DD'
    })
    ;[`"2020-05-21"`, '2020-05-21', new Date('2020-05-21')].forEach((t) => {
      const symbol = autocast(undefined, t)
      expect(symbol.symbol).to.equal(Symbol.for('date'))
    })
  })

  // dates with different formats
  it(`should return symbol for any date string in dateformat array `, () => {
    // change options to array
    o.setoptions({
      dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY']
    })
    ;[`"2020-05-21"`, '21-05-2020'].forEach((t) => {
      const symbol = autocast(undefined, t)
      expect(symbol.symbol).to.equal(Symbol.for('date'))
    })
  })

  // dictionary
  it(`should return symbol for dictionary`, () => {
    // basic object
    const t = { a: '', b: true, c: 42.1, d: 42, e: '2020-05-21', f: '10%' }
    const symbol = autocast(undefined, t)
    expect(symbol.symbol).to.equal(Symbol.for('dictionary'))
  })

  // list
  it(`should return symbol for list`, () => {
    // basic list
    const t = ['', true, 42.1, 42, '2020-05-21', '10%', { a: 10 }]
    const symbol = autocast(undefined, t)
    expect(symbol.symbol).to.equal(Symbol.for('list'))
  })

  // quoted
  it(`should return symbol for quoted`, () => {
    // eslint-disable-next-line prettier/prettier
    ;[
      { v: `""`, k: Symbol.for('nothing') },
      { v: `"true"`, k: Symbol.for('boolean') },
      { v: `"10"`, k: Symbol.for('integer') },
      { v: `"10.3"`, k: Symbol.for('number') },
      { v: `"2010-03-29"`, k: Symbol.for('date') },
      { v: `"straight"`, k: Symbol.for('unknown') }
    ].forEach((r) => {
      const symbol = autocast(undefined, r.v)
      expect(symbol.symbol).to.equal(r.k)
    })
  })
})
