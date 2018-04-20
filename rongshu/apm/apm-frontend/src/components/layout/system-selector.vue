<style lang="scss" scoped>
.system-selector {
  position: relative;
  height: 50px;
  overflow: hidden;
  .sys-sel-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ccc;
    opacity: 0.3;
  }
}

.ion-ios-search-strong {
  font-size: 20px;
}

.mini-btn {
  padding: 6px 10px;
}

.system-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 10px;
  li {
    padding: 10px 5px;
    cursor: pointer;
    span {
      width: 180px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      background: #2b8dd1;
      color: #fff;
    }
  }
}

.system-list-btn {
  cursor: pointer;
  height: 38px;
  * {
    float: left;
    margin-top: 18px;
    margin-right: 12px;
  }
  .sys-name {
    font-size: 14px;
    color: #333;
    width: 120px;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    &.mini {
      font-size: 16px;
      margin-left: 18px;
      height: 20px;
    }
  }

  .ion-chevron-down {
    margin-top: 18px;
    margin-right: 12px;
  }
}

.search-box {
  font-size: 12px;
}
</style>
<template>
  <div class="system-selector">
    <div class="sys-sel-mask"
         v-show="inSettingPage"></div>
    <el-popover
      class="system-dropdown"
      ref="syslist"
      :placement="placement"
      width="217"
      :visible-arrow="false"
      offset="100 0"
      trigger="click">
      <el-input
        class="search-box"
        placeholder="搜索"
        size="small"
        v-model="keyWord"
        @change="searchList"
        >
      </el-input>
      <ul class="system-list">
        <li v-for="item in options"
            @click="selectList(item.value, item.label)"
            :key="item.value"><span :title="item.label">{{item.label}}</span>
        </li>
      </ul>
    </el-popover>
    <div v-popover:syslist class="system-list-btn clearfix">
      <i class="icon ion-android-apps" style="font-size: 22px;margin-top: 14px;margin-left:28px; "></i>
      <span :class="{'sys-name':true,'mini':isPackUp}">{{isPackUp ? '...' : curData.label}}</span>
      <i class="icon ion-arrow-down-b" style="font-size: 18px;margin-top: 16px;"></i>
    </div>
  </div>
</template>

<script>
import { Button, Select, Input, Option, Popover } from 'element-ui'
export default {
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-popover': Popover
  },
  props: {
    isPackUp: true
  },

  data() {
    return {
      placement: 'bottom-end',
      curSystemId: '',
      options: [],
      keyWord: '',
      curData: {
        value: '',
        label: ''
      }
    }
  },
  watch: {
    isPackUp(v) {
      this.placement = v ? 'bottom-end' : 'right'
    },
    curSystemId(v) {
      this.setSession({
        id: v,
        name: this.curData.label
      })
    }
  },
  mounted() {
    this.getData()
    this.$root.eventBus.refreshSystemSelector = this.refresh
  },
  computed: {
    inSettingPage() {
      let temp = this.$route.path.split('/')
      return temp && temp[1] === 'settings'
    }
  },
  methods: {
    searchList() {
      let newList = []
      let keyWord = $.trim(this.keyWord)
      if (keyWord) {
        this.allOptions.map(item => {
          let lowLabel = item.label.toLowerCase()
          let lowKey = this.keyWord.toLowerCase()
          if (lowLabel.search(lowKey) >= 0) {
            newList.push(item)
          }
        })
        this.options = newList
      } else {
        this.options = this.allOptions
      }
    },
    selectList(id, name) {
      $('body').click()
      this.setAppId(id, name)
    },
    setSession(v) {
      this.$root.eventBus.setCurSystem(v)
    },
    setAppId(id, name) {
      this.curData = {
        value: id,
        label: name
      }
      this.curSystemId = id
    },
    refresh() {
      this.getData()
    },
    getData() {
      this.api.getListSystemConfig({}).done(res => {
        //        this.api.getMock({}).done(res => {
        if (res.code !== 0) return
        let data = res.data
        /* let resources = window.$$apm.resources.split(',');//权限列表
          //此判断为了避免开发环境没有resources而导致的无应用数据
          if (resources[0] === "<$=resources$>") {
            resources = data.map(m => m.system_config_name)
          } */
        let showData = data
        /* data.map(m => {
            if (resources.indexOf(m.system_config_name) >= 0) {
              showData.push(m)
            }
          }); */
        let newArr = []
        /** jiangfeng,修复用户权限未配置应用时，应用数据仍然加载的BUG */
        this.$root.eventBus.setAppList(showData)
        if (showData && showData.length > 0) {
          let queryAppId = this.$route.query.appId
          let curSystemId = queryAppId || this.$root.eventBus.getCurSystem().id
          if (curSystemId) {
            let curSystemName =
              (showData.find(m => curSystemId === m.system_config_id) &&
                showData.find(m => curSystemId === m.system_config_id)
                  .system_config_name) ||
              '请选择'
            this.setAppId(curSystemId, curSystemName)
          } else {
            this.setAppId(showData[0].system_config_id, showData[0].system_config_name)
          }
        } else {
          this.curSystemId = null
        }
        showData.map(item => {
          newArr.push({
            value: item.system_config_id,
            label: item.system_config_name
          })
        })
        this.allOptions = newArr
        this.options = newArr
      })
    }
  }
}
</script>

