/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import { expect } from 'chai'
import options from './options'

const newOptions = {
  dateformat: 'DD-MM-YYYY',
  decimalseparator: '.',
  decimalplaces: 3
} as any

describe('Options', () => {
  // // function
  // before(() => {
  //   options.setoptions(newOptions)
  // })
  it('should be a function', () => {
    expect(options.setoptions).to.be.a('function')
    expect(options.options).to.be.an('object')
    expect(options.allowed_delimeters).to.deep.equal([',', '.'])
  })

  // set options
  it('should update default options', () => {
    options.setoptions(newOptions)
    expect(options.options).to.deep.equal({
      dateformat: ['DD-MM-YYYY'],
      decimalseparator: ['.'],
      decimalplaces: 3
    })
  })

  // Allow for multiple decimal seperators.
  it('should allow for decimal seperators', () => {
    newOptions.decimalseparator = ['.', ',']
    options.setoptions(newOptions)
    expect(options.options).to.deep.equal({
      dateformat: ['DD-MM-YYYY'],
      decimalseparator: ['.', ','],
      decimalplaces: 3
    })
  })

  // Allow for multiple dates formats.
  it('should allow for multiple date formats', () => {
    newOptions.dateformat = ['YYYY-MM-DD', 'DD-MM-YYYY']
    options.setoptions(newOptions)
    expect(options.options).to.deep.equal(newOptions)
  })

  // error handling
  it(`should only accept these ${JSON.stringify(
    options.allowed_delimeters
  )} as a decimalseparator`, () => {
    const deci = {
      dateformat: ['DD-MM-YYYY'],
      decimalseparator: [':>']
    } as any
    expect(() => options.setoptions(deci)).to.throw()
  })

  // error handling
  it(`should accept no input`, () => {
    const before = options.options
    options.setoptions()
    expect(options.options).deep.equal(before)
  })

  // error handling
  it(`should throw decimal place error`, () => {
    expect(() => {
      options.setoptions({ decimalplaces: 'i' })
    }).to.throw
  })

  it(`should set decimal places`, () => {
    options.setoptions({ decimalplaces: 1 })
    expect(options.options).deep.equal({
      dateformat: ['YYYY-MM-DD', 'DD-MM-YYYY'],
      decimalseparator: ['.', ','],
      decimalplaces: 1
    })
  })
})
