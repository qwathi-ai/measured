/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import s from './stack'

const greeting = {
  name: 'greeting',
  parse: (t: any) => {
    return `${t} world`
  },
  intepretation: (t: any) => {
    if (t === 'hello') {
      return true
    }
    return false
  }
}
let stack = s.initialize()

describe('Stack', () => {
  // Api
  it('should conform to api', () => {
    expect(stack).to.be.an.instanceof(s)
    expect(stack.definitions).to.deep.equal([])
  })

  // Define
  it('should define a parser', () => {
    stack.define(greeting)
    expect(stack.definitions).to.deep.equal([greeting])
  })

  // Intepretation
  it('should return symbol', () => {
    expect(stack.intepret('hello')).to.equal(Symbol.for('greeting'))
  })

  // Fetch
  it('should return parser', () => {
    expect(stack.get('greeting')).to.deep.equal(greeting)
    expect(stack.get(Symbol.for('greeting'))).to.deep.equal(greeting)
    expect(stack.get(Symbol.for('404'))).to.equal(undefined)
    expect(stack.get('404')).to.equal(undefined)
  })

  // isDefined
  it('should return true for defined parser', () => {
    expect(stack.isDefined('greeting')).to.equal(true)
    expect(stack.isDefined(Symbol.for('greeting'))).to.equal(true)
    expect(stack.isDefined(Symbol.for('404'))).to.equal(false)
    expect(stack.isDefined('404')).to.equal(false)
  })

  // Invoke
  it('should return parsed value ', () => {
    expect(stack.invoke('greeting', 'Sup!')).to.deep.equal({
      _source: 'Sup!',
      value: `Sup! world`,
      symbol: Symbol.for('greeting')
    })
    expect(stack.invoke('greets', 'Sup!')).to.deep.equal({
      _source: 'Sup!',
      value: `Sup!`,
      symbol: Symbol.for('unknown')
    })
  })

  // Remove
  it('should remove parser ', () => {
    stack.remove('greeting')
    expect(stack.definitions).to.deep.equal([])
  })
})
