<style lang="scss">
@import "~vars";

$barHeight: 36px;
.filter-bar {
  //background: #fff;
  margin: 0 $marginWidth 0 $marginWidth;
  .filter-bar-query {
    height: $barHeight;
    padding: 0px;
    box-shadow: 0 0px 1px rgba(60, 65, 71, 0.5);
    background: #fff;
    .submit {
      width: 100px;
      float: right;
    }
    .query {
      position: relative;
      float: right;
    }
    .query > .el-input > .el-input__inner {
      border-width: 0px 0px 0px 1px;
      height: $barHeight !important;
      color: #666;
      border-radius: 0;
      &:focus,
      &:hover {
        border-color: #dcdcdc;
      }
    }
    .time-selector {
      margin-left: 0px;
    }
    .el-dropdown-menu {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .filter-bar-query:after {
    content: "";
    display: block;
    clear: both;
  }
  .tabs {
    background-color: #fff;
    margin-top: $marginWidth / 2;
    //border-bottom: 1px solid #d1d7e5 !important;
    box-shadow: 0 0px 1px rgba(60, 65, 71, 0.5);
  }
  .tab-list:after {
    content: "";
    display: block;
    clear: both;
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
        font-size: $font-size-large;
      }
      a:hover,
      a.active {
        border-bottom: 2px solid;
      }
    }
  }
  .instance-type-tag {
    position: relative;
    top: -2px;
    width: 52px;
    margin-right: 5px;
    text-align: center;
  }
  .expand-btn {
    float: right;
    padding: 0;
    width: 28px;
    height: 28px;
    font-size: $font-icon-size-large;
  }
  .title {
    color: #666;
    border-left: 3px solid #2879ff;
    height: $barHeight;
    line-height: $barHeight;
    padding-left: 10px;
    display: inline-block;
  }
  .getback-btn {
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-left: solid 1px #dcdcdc;
    height: $barHeight;
    line-height: $barHeight;
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background: #2879ff;
      color: #fff;
    }
  }
}
</style>
<template>
  <div class="filter-bar">
    <div class="filter-bar-query theme-font-color-base theme-border-color-base">
      <div v-if="!!title" class="title">{{title}}</div>
      <div class="fn-fr" v-show="!pureTitle">
      <time-selector class="query time-selector"></time-selector>
      <el-select
        v-show="!!$route.query.tierId"
        class="query"
        v-model="curInsToken"
        placeholder="请选择实例"
        size="small">
        <el-option
          label="All"
          value="__all__">
          <el-tag
            class="instance-type-tag"
            :type="output.instance.token === '__all__' ? 'gray' : ''">
            All
          </el-tag>
          所有实例
        </el-option>
        <el-option
          v-for="ins in instances"
          :key="ins.token"
          :label="ins.name"
          :value="ins.token">
          <el-tag class="instance-type-tag"
                  :type="ins.token === output.instance.token ? 'gray' : (instanceTypeMap[ins.type].color)">
            {{ instanceTypeMap[ins.type].name }}
          </el-tag>
          {{ ins.name }}
        </el-option>
      </el-select>
      <el-button v-show="$route.name === 'app-portal'" class="expand-btn" size="small" @click="requirefullScreen">
        <i class="ion-android-expand"></i>
      </el-button>
      <div
        v-show="showGetBackBtn"
        class="getback-btn fn-fr" size="small" @click="getback">
        <span>返回</span>
      </div>
      </div>
    </div>
    <div class="tabs" v-show="$route.query.tierId">
      <ul class="tab-list" v-show="isPHPIns">
        <li>
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-dashboard', query: $route.query}">仪表盘
          </router-link>
        </li>
        <li>
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-transaction', query: $route.query}">事务
          </router-link>
        </li>
        <li>
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-database', query: $route.query}">数据库

          </router-link>
        </li>
        <li>
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-error', query: $route.query}">错误率
          </router-link>
        </li>
        <li>
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-environment', query: $route.query}">执行环境
          </router-link>
        </li>
      </ul>
      <ul class="tab-list" v-show="hasCurrentIns ? javaCurrent : !allTuxedoIns">
        <li v-show="
          hasCurrentIns ? javaCurrent : !allTuxedoIns
        ">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-dashboard', query: $route.query}">仪表盘
          </router-link>
        </li>
        <li v-show="
          hasCurrentIns ? javaCurrent  : !allTuxedoIns
        ">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-transaction', query: $route.query}">事务
          </router-link>
        </li>
        <li v-show="
          hasCurrentIns ? javaCurrent  : !allTuxedoIns
        ">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-database', query: $route.query}">数据库
          </router-link>
        </li>
        <li v-show="
          hasCurrentIns ? javaCurrent  : !allTuxedoIns
        ">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-remote', query: $route.query}">
            <span :class="{active: $route.name === 'tier-remote' || $route.name === 'tier-remote-detail'}">远程调用</span>
          </router-link>
        </li>
        <li v-show="
          hasCurrentIns ? javaCurrent  : !allTuxedoIns
        ">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-error', query: $route.query}">错误率
          </router-link>
        </li>

        <li v-show="hasCurrentIns && javaCurrent">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-jvm', query: $route.query}">JVM

          </router-link>
        </li>
        <li v-show="hasCurrentIns && javaCurrent">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-threaddump', query: $route.query}">线程分析

          </router-link>
        </li>
        <li v-show="hasCurrentIns && javaCurrent">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-environment', query: $route.query}">执行环境

          </router-link>
        </li>
        <li v-show="false">
          <router-link
            active-class="active theme-border-color-primary theme-font-color-primary"
            class="theme-font-color-weak" :to="{name: 'tier-tuxedo', query: $route.query}">TUXEDO

          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import TimeSelector from './time-selector'
import { instanceTypeMap } from '_cbl'
import { Select, Option, Tag, Button } from 'element-ui'

export default {
  name: 'top-bar',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-tag': Tag,
    'el-button': Button,
    'time-selector': TimeSelector
  },
  mounted() {
    this.$root.eventBus.$on('system-or-time-change', res => {
      console.log('system-or-time-change')
      if (this.lastSys.id) {
        if (
          this.$route.path.indexOf('/application/tier/detail') !== -1 &&
          this.lastSys.id !== res.curSystem.id
        ) {
          this.$root.eventBus.$on('system-change', res => {
            this.$router.push({
              name: 'tier-list'
            })
          })
        } else {
          this.output.time = ''
          this.output.system = res.curSystem
          this.trigger('system-or-time-change')
          this.getInstances()
        }
      } else {
        this.lastSys = res.curSystem
        this.output.time = ''
        this.output.system = res.curSystem
        this.trigger('system-or-time-change')
        this.getInstances()
      }
    })
  },
  destroyed() {
    this.$root.eventBus.$off('system-or-time-change')
    this.$root.eventBus.$off('system-change')
  },
  props: {
    // 这个参数决定了触发barchange事件时是否需要有系统di，默认是必须要的，但是首页的系统列表特殊就不需要，所以加了这个标识
    noNeedId: {
      default: true
    },
    pureTitle: {
      default: false
    },
    timeDisabled: false,
    autoRefreshDisabled: false,
    title: String,
    showBack: false
  },

  data() {
    return {
      instances: [],
      instanceMap: {},
      curInsToken: '__all__',
      output: {
        time: '',
        system: '',
        curTier: {
          id: this.$route.query.tierId || '',
          name: ''
        },
        instance: {
          token: '',
          id: '',
          name: '',
          type: ''
        }
      },
      lastSys: {},
      instanceTypeMap: _.cloneDeep(instanceTypeMap)
    }
  },

  computed: {
    showGetBackBtn() {
      return !!this.$route.query.tierId || this.showBack
    },
    // 是否为php探针实例
    isPHPIns() {
      let isPHPIns = this.$route.query.instanceType === 4
      return isPHPIns
    },
    hasCurrentIns() {
      let hascurrentIns = !!(this.$route.query.instanceToken || this.output.instance.id)
      return hascurrentIns
    },
    allJavaIns() {
      if (this.instances && this.instances.length > 0) {
        for (let ins of this.instances) {
          if (ins.type !== 1) {
            console.log('allJavaIns:' + false)
            return false
          }
        }
        console.log('allJavaIns:' + true)
        return true
      }
      console.log('allJavaIns:' + false)
      return false
    },
    allTuxedoIns() {
      if (this.instances && this.instances.length > 0) {
        for (let ins of this.instances) {
          if (ins.type !== 2) {
            console.log('allTuxedoIns:' + false)
            return false
          }
        }
        console.log('allTuxedoIns:' + true)
        return true
      }
      console.log('allTuxedoIns:' + false)
      return true
    },
    TuxCurrent() {
      return (
        !!this.instanceMap[this.$route.query.instanceToken] &&
        this.instanceMap[this.$route.query.instanceToken].type === 2
      )
    },
    javaCurrent() {
      // console.log('java', !!this.instanceMap[this.$route.query.instanceToken]) && (this.instanceMap[this.$route.query.instanceToken].type === 1)
      console.log('currentInstanceToken:' + this.$route.query.instanceToken)
      console.log('currentInstanceMap:')
      console.log(JSON.stringify(this.instanceMap, null, 2))
      let currentIns = this.instanceMap[this.$route.query.instanceToken]
      let isJavaCurrent = false
      if (currentIns) {
        isJavaCurrent = currentIns.type === 1
      }
      return isJavaCurrent
    }
  },
  watch: {
    curInsToken(v) {
      if (v === '__all__') {
        this.output.instance = {
          token: '',
          id: '',
          name: '',
          type: ''
        }
      } else {
        this.output.instance = this.instanceMap[v]
      }
      this.selectInstance()
    },
    'output.instance'(v) {
      if (v.token) {
        this.curInsToken = v.token
      } else {
        this.curInsToken = '__all__'
      }
    }
  },
  methods: {
    getback() {
      window.history.back()
    },

    trigger() {
      if (this.output.system.id || !this.noNeedId) {
        // lxf注：这个判断要干嘛？
        // if (this.$route.query.instanceToken) {
        //   if (!this.output.instance.token) return
        // }
        let startTime = window.sessionStorage.getItem('startTime')
        let endTime = window.sessionStorage.getItem('endTime')

        let barQuery = {
          time: {
            startTime: startTime,
            endTime: endTime
          },
          system: this.output.system,
          tier: this.output.curTier,
          instance: this.output.instance
        }
        this.$emit('barChange', barQuery)
      }
    },
    selectInstance() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          instanceToken: this.output.instance.id,
          instanceType: this.output.instance.agent_config_type
        })
      })
      this.setCurrentInstance()
      this.trigger('select instance')
    },
    setCurrentInstance() {
      if (this.instances.length) {
        if (!this.hasCurrentIns && this.allTuxedoIns) {
          // 未选中实例但当前tier中全部都是tux
          this.$router.push({
            name: 'tier-tuxedo',
            query: Object.assign({}, this.$route.query, {
              instanceToken: this.instances[0].token
            })
          })
        } else if (this.hasCurrentIns && this.TuxCurrent) {
          // 已选中tux实例
          // console.log('已选中tux实例')
          // console.log(this.TuxCurrent, this.output.instance.token, this.$route.query.instanceToken)
          if (
            this.$route.path.indexOf('/application/tier/detail/tuxedo') === -1
          ) {
            this.$router.push({
              name: 'tier-tuxedo',
              query: Object.assign({}, this.$route.query)
            })
          } else {
            this.curInsToken = this.instances.find(ins => {
              return ins.token === this.$route.query.instanceToken
            }).token
          }
        } else {
          // 非全tux实例tier或非tux实例
          // console.log('非全tux实例tier或非tux实例')
          if (
            this.$route.path.indexOf('/application/tier/detail/tuxedo') === -1
          ) {
            for (let i of this.instances) {
              if (i.token === this.$route.query.instanceToken) {
                this.output.instance = i
                return // 从instances中找到了当前的ins，说明不是all
              }
            }
            // 否则就是all
            if (
              // 这时如果是后三个tab则应该跳回总览
              this.$route.path.indexOf('/application/tier/detail/jvm') !== -1 ||
              this.$route.path.indexOf(
                '/application/tier/detail/threaddump'
              ) !== -1 ||
              this.$route.path.indexOf(
                '/application/tier/detail/environment'
              ) !== -1
            ) {
              this.$router.push({
                name: 'tier-dashboard',
                query: Object.assign({}, this.$route.query)
              })
            }
          } else {
            // tier-pandect
            // console.log('tier-pandect')
            this.$router.push({
              name: 'tier-dashboard',
              query: Object.assign({}, this.$route.query)
            })
          }
        }
      }
    },
    setInsMap(data) {
      let vm = this
      vm.instances = data
      let temp = {}
      for (let i = 0; i < data.length; i++) {
        temp[data[i].token] = data[i]
      }
      vm.instanceMap = temp
    },
    getInstances() {
      let vm = this
      if (vm.output.curTier.id) {
        if (this.$root.eventBus.instancesInTiers.length) {
          vm.setInsMap(this.$root.eventBus.instancesInTiers)
          vm.setCurrentInstance()
        } else {
          vm.$root.api.getInstances({
            data: {
              tierId: vm.output.curTier.id
            },
            success(res) {
              if (res.data) {
                let data = res.data.map(ins =>
                  Object.assign({}, ins, {
                    token: ins.id,
                    agent_config_type: ins.type,
                    agent_config_name: ins.name
                  })
                )
                vm.setInsMap(data)
                vm.setCurrentInstance()
              }
            }
          })
        }
      }
    },
    requirefullScreen() {
      this.$emit('fullScreen')
    }
  }
}
</script>
