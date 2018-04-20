<style lang="scss" scoped>
  .application {
    height: 100%;
  }
  .left {
    position: relative;
    float: left;
    height: 100%;
    padding-top: 50px;
    border-right-style: solid;
    border-right-width: 1px;
  }
  .application-selector {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .menu {
    width: 260px;
  }
  .right {
    padding:14px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
</style>

<template>
  <div class="application" style="height: 100%;">
    <div class="left au-theme-border-color--base-8">
      <div class="application-selector">
        <application-selector/>
      </div>
      <au-menu
        class="menu"
        :items="menuItems"
        @select="go"
        @toggle="toggle"
        collapse-handlebar-position="bottom"
        :collapsable="true"/>
    </div>
    <div class="right" ref="mainContentContainer">
       <topBar :title="pageTitle" ref="topBar"></topBar>
      <router-view/>
    </div>
  </div>
</template>
<script>
import LazyLoader from '_helpers/lazy-loader'
import menuItems from '../../router/menu'
import routers from '../../router/routes'
import topBar from '../../components/top-bar'
import ApplicationSelector from '../../components/application-selector'

let routerTitleMapping = {}
function mapRouter (router) {
  if (Array.isArray(router)) {
    router.forEach(r => {
      mapRouter(r)
    })
    return
  }
  if (router.name) {
    routerTitleMapping[router.name] = router.title || ''
    if (router.children && router.children.length > 0) {
      for (let r in router.children) {
        mapRouter(router.children[r])
      }
    }
  }
}
mapRouter(routers)

export default {
  name: 'application',
  components: {
    topBar,
    ApplicationSelector
  },
  data () {
    return {
      pageTitle: '',
      menuItems,
      isMenuCollapse: false
    }
  },
  watch: {
    '$route.name': {
      deep: true,
      handler (v) {
        this.$nextTick(() => {
          this.pageTitle = routerTitleMapping[v] || ''
          this.$refs.topBar.refresh()
        })
      }
    }
  },
  mounted () {
    LazyLoader.setContainer(this.$refs.mainContentContainer)
  },
  methods: {
    go (item) {
      this.$router.push({name: item.url})
    },
    toggle (res) {
      console.log(res)
    }
  }
}
</script>
