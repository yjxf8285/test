import Vue from 'vue'
import Router from 'vue-router'

import assets from './config/assets.js'
import enhancement from './config/enhancement.js'
import journey from './config/journey.js'
import overview from './config/overview.js'
import test from './config/test.js'

Vue.use(Router)

var routes = []
.concat(assets)
.concat(enhancement)
.concat(journey)
.concat(overview)
.concat(test)
.concat([
  {
    path: '/',
    name: 'home',
    redirect: { name: 'journey' }
  }
])

export default new Router({
  routes:routes
})
