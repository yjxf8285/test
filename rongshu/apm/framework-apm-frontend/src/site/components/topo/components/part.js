
import EventEmitter from '../util/eventemitter'

class Part extends EventEmitter {
  constructor (root, data, option) {
    super()
    this.root = root
    this.data = data
    this.option = option || {}
    this.id = data.id
    this.name = (option && option.name) || data.showName || data.id
    this.hide = data.hide
    this.x = this.data.x || 0
    this.y = this.data.y || 0
  }

  render () {

  }
}

export default Part
