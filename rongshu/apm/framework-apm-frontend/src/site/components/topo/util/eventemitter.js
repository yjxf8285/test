
class EventEmitter {
  constructor () {
    this.listeners = {}
  }

  on (evt, fn, context) {
    var handlers = this.listeners[evt]
    if (!handlers) {
      handlers = []
      this.listeners[evt] = handlers
    }
    var item = {
      fn: fn,
      context: context
    }
    handlers.push(item)
    return item
  }

  off (evt, fn, context) {
    var handlers = this.listeners[evt]
    if (handlers) {
      handlers.forEach((item, i) => {
        if (item.fn === fn && item.context === context) {
          handlers.splice(i, 1)
        }
      })
    }
  }

  emit (evt, params) {
    var handlers = this.listeners[evt]
    if (handlers) {
      handlers.forEach((item, i) => {
        let fn = item.fn
        let context = item.context
        fn.apply(context, [params])
      })
    }
  }
}

export default EventEmitter
