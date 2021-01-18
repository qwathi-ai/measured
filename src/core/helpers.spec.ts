/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import h from './helpers'
import s from './stack'

const _greeting = Symbol('greeting')
const definitions = [
  {
    name: _greeting,
    parse: (t: any) => {
      return t.replace('world', `🌍`)
    },
    intepretation: (t: any) => {
      if (t === 'hello world') {
        return true
      }
      return false
    }
  }
]
const stack = s.initialize(definitions)

describe('Helpers', () => {
  // resolver
  it('should return standard resolver output', () => {
    // without stack
    expect(h.resolver(_greeting, 'hello world', 'hello world')).to.deep.equal({
      symbol: _greeting,
      _source: 'hello world',
      value: 'hello world'
    })
    // with stack
    expect(
      h.resolver(_greeting, 'hello world', 'hello world', stack)
    ).to.deep.equal({
      symbol: _greeting,
      _source: 'hello world',
      value: stack.invoke(_greeting, 'hello world').value
    })
  })

  // assign
  it('should assign definition to a stack', () => {
    const _test = Symbol('test')
    const m = new Map()
    expect(m.size).to.equal(0)
    expect(m.get(_test)).to.be.undefined

    expect(() => {
      ;(h as any).assign({}, m)
    }).to.throw
    expect(() => {
      ;(h as any).assign({})
    }).to.throw
    expect(() => {
      ;(h as any).assign({ name: _greeting }, m)
    }).to.throw

    const test = {
      name: _test,
      parse: (t: any) => {
        return Number(t)
      }
    } as any
    h.assign(test, m)

    expect(() => {
      ;(h as any).assign(test, m)
    }).to.throw

    expect(m.size).to.equal(1)
    expect(m.get(_test)).to.deep.equal(test)
  })

  // isValidDate
  it('should return false for invalid dates', () => {
    ;[new Date('2020-08-35'), '21-05-2020'].forEach((d) => {
      expect(h.isValidDate(d, ['YYYY-MM-DD'])).to.be.false
    })
  })

  // Parse Date
  it('should parse dates', () => {
    ;[new Date('2020-08-31'), '2020-08-31', '08-31-2020'].forEach((d) => {
      expect(
        h.parseDate(d, ['YYYY-MM-DD', 'MM-DD-YYYY']).format('YYYY-MM-DD')
      ).to.equal('2020-08-31')
    })
  })
})
