import h from './helpers'
import o from './options'
import m from './models'

/**
 * @internal
 * @private
 * @ignore
 * @memberof core.autocast
 */
export const autocast = (
  stack?: m.MeasuredStack,
  token?: any
): m.MeasuredDatum<any> => {
  // return if already understood
  let _source = token ? token.value || token : token
  let value = _source && _source.trim ? _source.trim() : _source
  const _symbol = typeof value

  // return "quoted"
  if (_symbol === 'string' && h.isQuotedString(value)) {
    const p = JSON.parse(value)
    return autocast(stack, p)
  }

  // search stack for alternatives
  const found = stack && stack.intepret ? stack.intepret(value) : undefined
  if (found) {
    return h.resolver(found, _source, value, stack)
  }

  // return nothing
  if (_symbol === 'string' && value === '') {
    return h.resolver(Symbol.for('nothing'), _source, value, stack)
  }
  if (!value) {
    return h.resolver(Symbol.for('nothing'), _source, value, stack)
  }

  // return boolean
  if (_symbol === 'boolean') {
    return h.resolver(Symbol.for('boolean'), _source, value, stack)
  }
  if (
    _symbol === 'string' &&
    (value.trim().toLowerCase() === 'true' ||
      value.trim().toLowerCase() === 'false')
  ) {
    return h.resolver(Symbol.for('boolean'), _source, value, stack)
  }

  // return date
  // Talk about over engineering...
  if (
    (value.getMonth && value.getMonth === 'function') ||
    (value instanceof Date &&
      Object.prototype.toString.call(value) === '[object Date]')
  ) {
    return h.resolver(Symbol.for('date'), _source, value, stack)
  }
  if (_symbol === 'string' && h.isValidDate(value, o.options.dateformat)) {
    return h.resolver(Symbol.for('date'), _source, value, stack)
  }

  // return number
  if (_symbol === 'number') {
    if (Number.isInteger(value)) {
      return h.resolver(Symbol.for('integer'), _source, value, stack)
    }
    return h.resolver(Symbol.for('number'), _source, value, stack)
  }
  if (_symbol === 'string' && h.isValidNumber(value)) {
    const n = h.parseNumber(value)
    return autocast(stack, n)
  }
  // return object
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return h.resolver(Symbol.for('dictionary'), _source, value, stack)
  }

  // return array
  if (Array.isArray(value)) {
    return h.resolver(Symbol.for('list'), _source, value, stack)
  }

  return { symbol: Symbol.for('unknown'), _source, value }
}

export default autocast
