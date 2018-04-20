let $container = null
function getDomHeight ($obj) {
  let height = 0
  if ($obj.currentStyle) {
    height = $obj.currentStyle.height
  } else {
    height = document.defaultView.getComputedStyle($obj, null).height
  }
  return +height.replace('px', '')
}

class LazyLoader {
  constructor ($el, $container, onload) {
    this.$lazyElement = $el
    this.$container = $container
    this.load = onload
    this.init()
  }
  /**
   * 初始化DOM元素位置信息
   */
  init () {
    let containerOffsetTop = this.$container.offsetTop
    this.relativeTop = this.$lazyElement.offsetTop - containerOffsetTop
  }
  /**
   * 懒加载的加载规则
   * 通过loaded来进行判断是否已经加载过
   */
  lazyload () {
    if (this.relativeTop - this.$container.scrollTop > getDomHeight(this.$container)) {
      return false
    }
    this.load()
    return true
  }
}

let onScroll = () => {
  LazyLoader.$components.forEach((lazyloaderInstance) => {
    lazyloaderInstance.lazyload()
  })
}

LazyLoader.$components = []

LazyLoader.setContainer = ($c) => {
  $container = $c
  $container.addEventListener('scroll', () => { onScroll() }, false)
  onScroll()
}

LazyLoader.registerComponent = ($el, onload) => {
  let instance = new LazyLoader($el, $container, onload)
  LazyLoader.$components.push(instance)
  onScroll()
  return instance
}

export default LazyLoader
