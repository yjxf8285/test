<style lang="scss" scoped>
  .version-selector {
    display: inline-block;
  }
</style>
<template>
  <div class="version-selector">
    <au-select :loading="loading" :size="size" v-model="currentVersion" :options="versionOptions" placeholder="请选择版本"/>
  </div>
</template>
<script>
  import store from '_store'

  export default {
    name: 'version-selector',
    mounted () {
      this.getVersionList().then(this.getCurrentVersion)
    },
    data () {
      return {
        versions: [],
        currentVersion: '',
        loading: null
      }
    },
    props: {
      size: String
    },
    computed: {
      versionOptions () {
        return this.versions.map(v => {
          return {
            text: v,
            value: v
          }
        })
      }
    },
    watch: {
      currentVersion (v) {
        store.setCurrentVersion(v)
      }
    },
    methods: {
      getVersionList () {
        let vm = this
        vm.loading = true
        return vm.api.getVersionList({
          data: {
            condition: Object.assign({
              appId: store.getCurrentApplication().appId
            }, store.getCurrentTimeSpan())
          }
        }).then(res => {
          if (res) {
            vm.versions = res.data ? res.data : []
            vm.loading = false
            store.setVersionList(vm.version)
          }
        })
      },
      getCurrentVersion () {
        let cache = store.getCurrentVersion()
        if (cache && this.versions.indexOf(cache) !== -1) {
          this.currentVersion = cache
        } else {
          this.currentVersion = this.versions[0]
        }
      }
    }
  }
</script>


