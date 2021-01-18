/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { bool } from './bool'

describe('Boolean', () => {
  // definition
  it('should conform to definition schema', () => {
    expect(bool.name).to.equal(Symbol.for('boolean'))
    expect(bool.parse).to.be.a('function')
  })

  // parse true
  it(`should parse values as truthy`, () => {
    ;['true', 1, true, {}, [], () => {}, bool.parse(true)].forEach((t) => {
      const b = bool.parse(t)
      expect(b).to.be.true
    })
  })

  // parse false
  it(`should parse values as falsey`, () => {
    ;['false', 0, false, bool.parse(false)].forEach((t) => {
      const b = bool.parse(t)
      expect(b).to.be.false
    })
  })
})
