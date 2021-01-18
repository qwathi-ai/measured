/* eslint-disable prettier/prettier */
/* eslint-env node, mocha */
import h from '../core/helpers'
import { expect } from 'chai'

import { date } from './date'
import o from '../core/options'
import dayjs from 'dayjs'

describe('Date', () => {
  // set test options
  before(() => {
    o.setoptions({
      dateformat: 'YYYY-MM-DD'
    })
  })

  // function
  it('should conform to definition schema', () => {
    expect(date.name).to.equal(Symbol.for('date'))
    expect(date.parse).to.be.a('function')
  })

  // parse error
  it(`should only accept dates formats defined in options.`, () => {
    // incorrect format but correct date.
    ;['21-05-2020', new Date('not_a_date')].forEach((t) => {
      expect(() => {
        date.parse(t)
      }).to.throw()
    })
  })
  // // parse dates
  // it(`should parse date inputs`, () => {
  //   const dateformat = ['YYYY-MM-DD', 'DD-MM-YYYY'] as any
  //   o.setoptions({
  //     dateformat
  //   })
  //   ;[
  //     '2020-05-20',
  //     '21-05-2020',
  //     new Date('2020-05-22'),
  //     date.parse('2020-05-23'),
  //     dayjs('2020-05-23')
  //   ].forEach((t: any) => {
  //     const b = date.parse(t)
  //     let _t = h.isJSDate(t) ? t.toISOString() : t
  //     const r = h.parseDate(_t, dateformat.concat('YYYY-MM-DDTHH:mm:ss.sssZ'))
  //     expect(b).to.equal(r)
  //   })
  // })
})
