<style lang="scss" scoped>
  @import "./index";

  .tag {
    white-space: normal;
  }

  .operation {
    height: 41px;
    border-bottom: 1px solid;
    padding: 0 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    text-align: right;
  }

  .tabs {
    margin-bottom: 10px;
  }
</style>
<template>
  <div class="report">
    <!-- <top-bar @barChange="barChange"></top-bar> -->
    <div class="common-container">
      <el-tabs class="tabs">
        <el-tab-pane label="Web事务">
          <div class="content" style="margin-top: -15px">
            <div class="table-container" ref="webAffairContainer">
              <div class="table-box" v-for="item in webAffair" v-bind:key="item.name">
                <h4 class="name">
                  <el-tag class="tag">{{item.name}}</el-tag>
                </h4>
                <el-table :data="item.list" stripe class="table">
                  <el-table-column prop="name" label="时间"></el-table-column>
                  <el-table-column prop="avg" label="平均响应时间(ms)"></el-table-column>
                  <el-table-column prop="max" label="最长响应时间(ms)"></el-table-column>
                  <el-table-column prop="rpm" label="吞吐量(rpm)"></el-table-column>
                  <el-table-column prop="error" label="错误率">
                    <template slot-scope="scope">
                      <span>{{scope.row.error}}</span>%

                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="table-prompt" v-if="webAffair.length==0">暂无数据</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关键Web事务">
          <div class="content" style="margin-top: -15px">
            <div class="table-container" ref="pivotalWebAffairContainer">
              <div class="table-box" v-for="item in pivotalWebAffair" v-bind:key="item.name">
                <h4 class="name">
                  <el-tag>{{item.name}}</el-tag>
                </h4>
                <el-table :data="item.list" stripe class="table">
                  <el-table-column prop="name" label="时间"></el-table-column>
                  <el-table-column prop="avg" label="平均响应时间(ms)"></el-table-column>
                  <el-table-column prop="max" label="最长响应时间(ms)"></el-table-column>
                  <el-table-column prop="rpm" label="吞吐量(rpm)"></el-table-column>
                  <el-table-column prop="error" label="错误率">
                    <template slot-scope="scope">
                      <span>{{scope.row.error}}</span>%

                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="table-prompt" v-if="pivotalWebAffair.length==0">暂无数据</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据库">
          <div class="content" style="margin-top: -15px">
            <div class="table-container" ref="dataBaseContainer">
              <div class="table-box" v-for="item in dataBase" v-bind:key="item.name">
                <h4 class="name">
                  <el-tag class="tag">{{item.name}}</el-tag>
                </h4>
                <el-table :data="item.list" stripe class="table">
                  <el-table-column prop="name" label="时间"></el-table-column>
                  <el-table-column prop="avg" label="平均响应时间(ms)"></el-table-column>
                  <el-table-column prop="max" label="最长响应时间(ms)"></el-table-column>
                  <el-table-column prop="rpm" label="吞吐量(rpm)"></el-table-column>
                  <el-table-column prop="error" label="错误率">
                    <template slot-scope="scope">
                      <span>{{scope.row.error}}</span>%

                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="table-prompt" v-if="dataBase.length==0">暂无数据</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import {
    Dropdown, DropdownMenu, DropdownItem, Button, Table, TableColumn, Tabs, TabPane, Tag, Message, Loading
  }
    from 'element-ui'
  import TnBar from '_charts/topn-bar'
  import tableTree from '_ui-mod/table-tree'

  export default {
    name: 'app-database-tn-slow-detail',
    components: {
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'el-tag': Tag,
      TnBar,
      tableTree
    },
    mounted() {
      this.currentSy = this.$root.eventBus.getCurSystem()
      this.$root.eventBus.$on('system-or-time-change', v => {
        this.currentSy = v.curSystem
      })
    },
    data() {
      return {
        webAffair: [],
        webAffairLoading: {},
        webAffairPaginator: {
          currentPage: 0,
          total: 10,
          pageCount: 0
        },
        pivotalWebAffair: [],
        pivotalWebAffairLoading: {},
        pivotalWebAffairPaginator: {
          currentPage: 0,
          total: 10,
          pageCount: 0
        },
        dataBase: [],
        dataBaseLoading: {},
        dataBasePaginator: {
          currentPage: 0,
          total: 10,
          pageCount: 0
        },
        currentSy: {},
        sys: []
      }
    },
    watch: {
      currentSy: function(val) {
        this.getWebAffair(val.id)
        this.getPivotalWebAffair(val.id)
        this.getDataBase(val.id)
      }
    },
    methods: {
      getWebAffair(id) {
        let that = this
        let pageCount = 0
        let webAffair = []
        let list = []
        let name = ''
        this.api.getWebAffair({
          data: {
            systemId: id,
            page: that.webAffairPaginator.currentPage,
            size: that.webAffairPaginator.total
          },
          beforeSend() {
            that.webAffairLoading = Loading.service({
              target: that.$refs.webAffairContainer
            })
          },
          success(res) {
            that.webAffairLoading.close()
            if (res.code === 0) {
              if (res.data) {
                pageCount = res.data.count
                res.data.list.map((m, i) => {
                  m.list.map((n, j) => {
                    switch (n.name) {
                      case 'one-month':
                        name = '一个月'
                        break
                      case 'fourteen-day':
                        name = '14天'
                        break
                      case 'seven-day':
                        name = '7天'
                        break
                      case 'yesterday':
                        name = '昨天'
                        break
                    }
                    list.push({
                      avg: n.avg,
                      error: n.error,
                      max: n.max,
                      name: name,
                      rpm: n.tps
                    })
                  })
                  webAffair.push({
                    info: m.info,
                    name: m.name,
                    list: list
                  })
                  list = []
                })
              } else {
                pageCount = 0
                webAffair = []
              }
            } else {
              pageCount = 0
              webAffair = []
              Message.error('获取数据失败！！！')
            }
            that.webAffairPaginator.pageCount = pageCount
            that.webAffair = webAffair
          },
          error() {
            that.webAffairLoading.close()
            Message.error('服务器错误！！！')
          }
        })
      },
      getPivotalWebAffair(id, type) {
        let that = this
        let pageCount = 0
        let pivotalWebAffair = []
        let list = []
        let name = ''
        this.api.getPivotalWebAffair({
          data: {
            systemId: id,
            page: that.pivotalWebAffairPaginator.currentPage,
            size: that.pivotalWebAffairPaginator.total
          },
          beforeSend() {
            if (type) {
              that.pivotalWebAffairLoading = Loading.service({
                target: that.$refs.pivotalWebAffairContainer
              })
            }
          },
          success(res) {
            if (type) {
              that.pivotalWebAffairContainer.close()
            }
            if (res.code === 0) {
              if (res.data) {
                pageCount = res.data.count
                res.data.list.map((m, i) => {
                  m.list.map((n, j) => {
                    switch (n.name) {
                      case 'one-month':
                        name = '一个月'
                        break
                      case 'fourteen-day':
                        name = '14天'
                        break
                      case 'seven-day':
                        name = '7天'
                        break
                      case 'yesterday':
                        name = '昨天'
                        break
                    }
                    list.push({
                      avg: n.avg,
                      error: n.error,
                      max: n.max,
                      name: name,
                      rpm: n.tps
                    })
                  })
                  pivotalWebAffair.push({
                    info: m.info,
                    name: m.name,
                    list: list
                  })
                  list = []
                })
              } else {
                pageCount = 0
                pivotalWebAffair = []
              }
            } else {
              Message.error('获取数据失败！！！')
              pageCount = 0
              pivotalWebAffair = []
            }
            that.webAffairPaginator.pageCount = pageCount
            that.pivotalWebAffair = pivotalWebAffair
          },
          error() {
            if (type) {
              that.pivotalWebAffairContainer.close()
            }
            Message.error('服务器错误！！！')
          }
        })
      },
      getDataBase(id, type) {
        let that = this
        let pageCount = 0
        let dataBase = []
        let list = []
        let name = ''
        this.api.getDataBase({
          data: {
            systemId: id,
            page: that.dataBasePaginator.currentPage,
            size: that.dataBasePaginator.total
          },
          beforeSend() {
            if (type) {
              that.dataBaseLoading = Loading.service({
                target: that.$refs.dataBaseContainer
              })
            }
          },
          success(res) {
            if (type) {
              that.dataBaseContainer.close()
            }
            if (res.code === 0) {
              if (res.data) {
                pageCount = res.data.count
                res.data.list.map((m, i) => {
                  m.list.map((n, j) => {
                    switch (n.name) {
                      case 'one-month':
                        name = '一个月'
                        break
                      case 'fourteen-day':
                        name = '14天'
                        break
                      case 'seven-day':
                        name = '7天'
                        break
                      case 'yesterday':
                        name = '昨天'
                        break
                    }
                    list.push({
                      avg: n.avg,
                      error: n.error,
                      max: n.max,
                      name: name,
                      rpm: n.tps
                    })
                  })
                  dataBase.push({
                    info: m.info,
                    name: m.name,
                    list: list
                  })
                  list = []
                })
              } else {
                pageCount = 0
                dataBase = []
              }
            } else {
              pageCount = 0
              dataBase = []
              Message.error('获取数据失败！！！')
            }
            that.webAffairPaginator.pageCount = pageCount
            that.dataBase = dataBase
          },
          error() {
            if (type) {
              that.dataBaseContainer.close()
            }
            Message.error('服务器错误！！！')
          }
        })
      }
    }
  }
</script>
