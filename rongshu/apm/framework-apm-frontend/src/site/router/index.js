import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

function getRouteMap () {
  if (!window.localStorage.getItem('routeMap')) {
    window.localStorage.setItem('routeMap', JSON.stringify({}))
  }
  return JSON.parse(window.localStorage.getItem('routeMap'))
}

let routeFromMap = {
  get: function (path) {
    return getRouteMap()[path]
  },
  set: function (path, route) {
    let map = getRouteMap()
    map[path] = {
      name: route.name,
      query: route.query,
      param: route.param
    }
    window.localStorage.setItem('routeMap', JSON.stringify(map))
  }
}

function deepMerge (target = {}, object = {}) {
  let res = {}
  for (let key in target) {
    res[key] = target[key]
  }
  for (let key in object) {
    if (res[key] && typeof res[key] === 'object' && typeof object[key] === 'object') {
      res[key] = Object.assign({}, res[key], object[key])
    } else res[key] = object[key]
  }
  return res
}

Router.prototype.back = function (info = {}, onComplete, onAbort) {
  let route = this.history.current
  let from = routeFromMap.get(route.fullPath)
  if (from) {
    this.history.push(deepMerge(from, info), onComplete, onAbort)
  }
}

Router.prototype.child = function (info = {}, onComplete, onAbort) {
  let route = this.history.current
  if (route.meta.child) {
    this.history.push(deepMerge(route.meta.child, info), onComplete, onAbort)
  } else console.warn('if you wish to drilldown on route link, you should add child in route meta config')
}

Router.prototype.getBreadcrumbs = function () {
  let route = this.history.current
  let res = []
  route.matched.forEach(m => {
    if (m.meta.title) {
      res.push({
        text: m.meta.title,
        url: m.name
      })
    }
  })
  return res
}

Vue.use(Router)

let route = new Router({ routes })
route.afterEach((to, from) => {
  console.log(from, to)
  if (from.fullPath !== '/') {
    routeFromMap.set(to.fullPath, from)
  }
})

export default route
