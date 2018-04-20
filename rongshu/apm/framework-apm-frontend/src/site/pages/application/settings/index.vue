<style lang="scss" scoped>
.content {
  margin-top: 0px;
}
.tabs {
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.tab-list {
  height: 40px;
  padding: 0 10px;
  li {
    float: left;
    height: 100%;
    a {
      position: relative;
      bottom: -1px;
      display: block;
      height: 100%;
      box-sizing: border-box;
      line-height: 40px;
      padding: 0 20px;
    }
    a:hover,
    a.active {
      text-decoration: none;
      border-bottom-width: 2px;
      border-bottom-style: solid;
    }
  }
}
</style>
<template>
  <div>
    <div class="common-container">
      <div class="tabs au-theme-font-color--primary-3 au-theme-border-color--primary-3">
        <ul class="tab-list">
          <li>
            <router-link
              class="au-theme-hover-border-color--primary-3"
              :class="{
                'active au-theme-border-color--primary-3': $route.name === 'tier-list-setting' || $route.name === 'instance-list-setting'
              }" :to="{name: 'tier-list-setting'}">探针设置
            </router-link>
          </li>
          <li>
            <router-link
              active-class="active" :to="{name: 'regular-setting'}">规则设置
            </router-link>
          </li>
          <li>
            <router-link
              active-class="active" :to="{name: 'web-probe-setting'}">Web探针
            </router-link>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
    <DefaultContainer>
      <Tabs></Tabs>
    </DefaultContainer>
  </div>

</template>
<script>
import {Tabs} from 'admin-ui'
import {DefaultContainer} from '_components/containers'
const defaultSelected = (route, tabName) => {
  return route.name === tabName
}
const mapping = [
  {
    name: 'tier-list-setting',
    text: '探针设置',
    selected(route) {
      return route.name === 'tier-list-setting' || route.name === 'instance-list-setting'
    }
  },
  {
    name: 'regular-setting',
    text: '规则设置',
    selected: defaultSelected
  },
  {
    name: 'web-probe-setting',
    text: 'Web探针',
    selected: defaultSelected
  }
]
export default {
  name: 'settings',
  componets: {
    Tabs,
    DefaultContainer
  },
  watch: {
    '$route.name': {
      handler(routeName) {
        mapping.forEach(map => {
          let current = mapping.name === routeName
          if(current){
            this.current = map.name
          }
        })
      }
    }
  },
  data() {
    return {

    }
  },
  mounted () {

  }
}
</script>
