/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { int } from './int'

describe('Integer', () => {
  // definitions
  it('should conform to definition schema', () => {
    expect(int.name).to.equal(Symbol.for('integer'))
    expect(int.parse).to.be.a('function')
  })
  // parser error
  it(`should not parse non-integer values`, () => {
    ;[
      '2020-02-31',
      'hello',
      '10%',
      {},
      true,
      new Date('2020-05-21'),
      4.2,
      '4.2'
    ].forEach((t) => {
      expect(() => {
        int.parse(t)
      }).to.throw()
    })
  })
  // parse
  it(`should return integer`, () => {
    ;[42, '42'].forEach((t) => {
      const b = int.parse(t)
      expect(b).to.equal(Number(t))
    })
  })
})
