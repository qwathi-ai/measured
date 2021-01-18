/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import { nothing } from './nothing'

describe('Nothing', () => {
  // definition
  it('should conform to definition schema', () => {
    expect(nothing.name).to.equal(Symbol.for('nothing'))
    expect(nothing.parse).to.be.a('function')
  })
  // parse
  it('should return nothing', () => {
    const n = nothing.parse()
    expect(n).to.be.undefined
  })
})
