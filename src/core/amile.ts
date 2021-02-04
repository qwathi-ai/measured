import o from './options'
import { EventEmitter } from 'events'

export class Amile extends EventEmitter {
  private ws: any
  constructor() {
    super()
    const ws = new WebSocket(o.options.server)
    ws.onopen = (o) => {
      this.emit('open', o)
    }
    ws.onclose = (c) => {
      this.emit('close', c)
    }
    ws.onmessage = (m) => {
      this.emit('message', m)
    }
    ws.onerror = (e) => {
      this.emit('error', e)
    }
    this.ws = ws
  }

  send(msg: any): void {
    this.ws.send(msg)
  }
}

export default Amile
