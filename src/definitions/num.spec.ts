/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { num } from './num'

import o from '../core/options'
o.setoptions({
  decimalseparator: ['.', ',']
})

describe('Number', () => {
  // definition
  it('should conform to definition schema', () => {
    expect(num.name).to.equal(Symbol.for('number'))
    expect(num.parse).to.be.a('function')
  })
  // parse error
  it(`should not accept non-numeric values`, () => {
    ;['2020-02-31', 'hello', '10%', {}, true, new Date('2020-05-21')].forEach(
      (t) => {
        expect(() => {
          num.parse(t)
        }).to.throw()
      }
    )
  })
  // parse
  it(`should return number`, () => {
    ;[
      { v: 42, t: 42 },
      { v: 42.1, t: 42.1 },
      { v: '42', t: 42 },
      { v: '42.1', t: 42.1 },
      { v: '42,1', t: 42.1 }
    ].forEach((t) => {
      const b = num.parse(t.v)
      expect(b).to.equal(t.t)
    })
  })
})
