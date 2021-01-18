/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { list } from './list'

import o from '../core/options'
o.setoptions({
  dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY']
})

import s from '../core/stack'
import { date } from './date'
const stack = s.initialize([date])

const li: any = [new Date('2020-05-21')]
describe('List', () => {
  // definitions
  it('should conform to definition schema', () => {
    expect(list.name).to.equal(Symbol.for('list'))
    expect(list.parse).to.be.a('function')
  })
  // parse error
  it(`should not accept non-array values`, () => {
    ;[
      '2020-02-31',
      'hello',
      '10%',
      42.3,
      42,
      {},
      true,
      new Date('2020-05-21')
    ].forEach((t) => {
      expect(() => {
        list.parse(t)
      }).to.throw()
    })
  })
  // parse list
  it(`should parse list values`, () => {
    const b: any = list.parse(li, stack)
    expect(b).to.be.an('array')
  })
  // parse list items
  it(`should parse list items`, () => {
    const b: any = list.parse(li, stack)
    expect(b[0]).to.equal(date.parse(li[0]))
  })
})
