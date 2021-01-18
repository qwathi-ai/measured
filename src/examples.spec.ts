/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import dayjs from 'dayjs'
import measured from '.'

let definitions = 0
describe('Examples', () => {
  beforeEach(() => {
    measured.setoptions({
      decimalseparator: [',', '.'],
      dateformat: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      decimalplaces: 3
    })
  })

  it(`should return a locally parsed smart object`, () => {
    expect(
      measured({
        a: '',
        b: 'false',
        c: '35.3',
        d: '14,9%',
        e: '2020-05-21',
        f: 'hello word',
        g: ['4', 'the', 'love', '"true"', 'th']
      }).value
    ).to.deep.equal({
      a: undefined,
      b: false,
      c: 35.3,
      d: 0.149,
      e: '2020-05-21',
      f: 'hello word',
      g: [4, 'the', 'love', true, 'th']
    })
  })

  it(`should parse quoted date strings`, () => {
    expect(measured('"21-05-2020"').symbol).to.equal(Symbol.for('date'))
    expect(measured(new Date('2020-05-21')).symbol).to.equal(Symbol.for('date'))
    // expect(measured('10,49%').value).to.equal(0.105)
  })

  it(`should only parse date formats in list`, () => {
    measured.setoptions({ dateformat: 'YYYY-MM-DD' })
    expect(measured('2020-05-21').symbol).to.equal(Symbol.for('date'))
    expect(measured('05-21-2020').symbol).to.equal(Symbol.for('unknown'))

    measured.setoptions({ dateformat: 'MM-DD-YYYY' })
    expect(measured('2020-05-21').symbol).to.equal(Symbol.for('unknown'))
    expect(measured('05-21-2020').symbol).to.equal(Symbol.for('date'))

    measured.setoptions({ dateformat: ['YYYY-MM-DD', 'MM-DD-YYYY'] })
    expect(measured('2020-05-21').symbol).to.equal(Symbol.for('date'))
    expect(measured('05-21-2020').symbol).to.equal(Symbol.for('date'))
  })

  it(`should only numbers with decimal seperators described in list`, () => {
    measured.setoptions({ decimalseparator: '.' })
    expect(measured('10.4').symbol).to.equal(Symbol.for('number'))
    expect(measured('10,4').symbol).to.equal(Symbol.for('unknown'))

    measured.setoptions({ decimalseparator: ',' })
    expect(measured('10.4').symbol).to.equal(Symbol.for('unknown'))
    expect(measured('10,4').symbol).to.equal(Symbol.for('number'))

    measured.setoptions({ decimalseparator: [',', '.'] })
    expect(measured('10.4').symbol).to.equal(Symbol.for('number'))
    expect(measured('10,4').symbol).to.equal(Symbol.for('number'))
  })

  it(`should define how to greet`, () => {
    const symbol = Symbol.for('greeting')

    const Greeting = {
      name: symbol || 'greeting',
      intepretation: (token: any) => {
        return typeof token === 'string' && token.startsWith('hello')
          ? true
          : false
      },
      parse: (token: any) => {
        if (!Greeting.intepretation) {
          throw TypeError(`Expected value of pattern "hello xxx".`)
        }
        return token.replace('hello', 'how are you doing today,') + '?'
      }
    }
    definitions = measured.list.length
    measured.define<string>(Greeting)
    expect(measured('hello world').symbol).to.equal(symbol)
    expect(measured('hello world').value).to.equal(
      'how are you doing today, world?'
    )
  })

  it(`should invoke a greeting`, () => {
    const symbol = Symbol.for('greeting')
    // Here we use the symbol defined earlier.
    const greeting = measured.invoke(symbol, 'hello Jamangile')
    const greeting2 = measured.invoke(symbol, 'hello Jamangile')
    expect(greeting.value).to.equal('how are you doing today, Jamangile?')
    expect(greeting.symbol).to.equal(symbol)
    expect(greeting).to.deep.equal(greeting2)
  })

  it(`should list definitions`, () => {
    expect(measured.list).to.be.an('array')
  })

  // it(`should remove a definition`, () => {
  //   const symbol = Symbol.for('greeting')
  //   measured.remove(symbol)
  //   expect(measured.list.length).to.be.equal(definitions)
  // })

  it(`should validate date`, () => {
    let n = '05-21-2020'
    expect(measured.isValidDate(n)).to.be.true
    expect(measured.isValidDate(n, 'MM-DD-YYYY')).to.be.true
  })

  it(`should validate number`, () => {
    let n = '-10,5'
    expect(measured.isValidNumber(n)).to.be.true
  })
  it(`should parse date`, () => {
    measured.setoptions({ dateformat: ['MM-DD-YYYY'] })
    let n = '05-21-2020'
    expect(measured.parseDate(n).toISOString()).to.equal(
      dayjs('2020-05-21').toISOString()
    )
    expect(measured.isValidDate(n, 'MM-DD-YYYY')).to.be.true
  })

  it(`should parse number`, () => {
    let n = '-10,5'
    expect(measured.parseNumber(n)).to.equal(-10.5)
  })
})
