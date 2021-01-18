/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import p from './percent'

const percent = p as any
import o from '../core/options'

describe('Percent', () => {
  before(() => {
    o.setoptions({
      decimalseparator: [',', '.'],
      dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY'],
      decimalplaces: 3
    })
  })
  // definition
  it('should conform to definition schema', () => {
    expect(percent.name).to.equal(Symbol.for('percent'))
    expect(percent.parse).to.be.a('function')
    expect(percent.intepretation).to.be.a('function')
    expect(percent._toNumber).to.be.a('function')
  })
  // detection failure
  it(`should not detect values failing <number>% pattern`, () => {
    ;[
      '2020-02-31',
      'hello',
      {},
      10,
      '10',
      'aw12%',
      true,
      new Date('2020-05-21')
    ].forEach((t) => {
      expect(percent.intepretation(t)).to.be.false
    })
  })
  // parse error
  it(`should not parse non-numeric values`, () => {
    ;['2020-02-31', 'hello', {}, true, new Date('2020-05-21')].forEach((t) => {
      expect(() => {
        percent.parse(t)
      }).to.throw
    })
  })
  // detection
  it(`should detect <number>% pattern`, () => {
    ;[
      { v: '42,1%', t: 0.421 },
      { v: '42.1%', t: 0.421 },
      { v: '-42.1%', t: -0.421 },
      { v: '+42,1%', t: 0.421 }
    ].forEach((t) => {
      expect(percent.intepretation(t.v)).to.be.true
      expect(percent.parse(t.v).toFixed(3)).to.equal(t.t.toFixed(3))
    })
  })
  // parse
  it(`should return numeric values`, () => {
    ;[
      { v: 42, t: 0.42 },
      { v: 42.1, t: 0.421 },
      { v: '-42', t: -0.42 },
      { v: '42.1', t: 0.421 },
      { v: '42,1', t: 0.421 },
      { v: '-42,1%', t: -0.421 },
      { v: '42.1%', t: 0.421 }
    ].forEach((t) => {
      const b = percent.parse(t.v)
      expect(b.toFixed(3)).to.equal(t.t.toFixed(3))
    })
  })
})
