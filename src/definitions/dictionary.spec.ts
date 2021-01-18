/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { dictionary } from './dictionary'

import o from '../core/options'
o.setoptions({
  dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY']
})

import s from '../core/stack'
import { date } from './date'
const stack = s.initialize([date])

const obj = {
  dated: '2020-05-21'
}

describe('Dictionary', () => {
  // definition
  it('should conform to definition schema', () => {
    expect(dictionary.name).to.equal(Symbol.for('dictionary'))
    expect(dictionary.parse).to.be.a('function')
  })
  // parse error
  it(`should only accept dictionary type values`, () => {
    ;['2020-02-31', 'hello', 42.3, true, undefined].forEach((t) => {
      expect(() => {
        dictionary.parse(t)
      }).to.throw()
    })
  })
  // parse dictionary
  it(`should parse dictionary values`, () => {
    const b = dictionary.parse(obj, stack)
    expect(b).to.be.an('object')
  })
  // parse
  it(`should parse dictionary properties`, () => {
    const b: any = dictionary.parse(obj, stack)
    expect(b['dated']).to.equal(date.parse(obj['dated']))
  })
})
