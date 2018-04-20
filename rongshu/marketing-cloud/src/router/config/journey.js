export default [
  {
    path: '/journey',
    name: 'journey',
    component: resolve => require(['../../vues/journey/index.vue'], resolve)
  },
  {
    path: '/journey/view',
    name: '',
    component: resolve => require(['../../vues/journey/src/index.vue'], resolve)
  }
]
