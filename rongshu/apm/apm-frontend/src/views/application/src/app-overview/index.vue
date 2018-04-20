<template>
  <div class="app-overview clearfix">
    <top-bar @barChange="barChange" style="margin: 0" :noNeedId="false"></top-bar>

    <div class="page-container" :style="{'padding-left':paddingLeft}">
      <el-dialog title="添加应用" :visible.sync="createDialogVisible">
        <el-form :model="createForm" :rules="createRules" ref="createForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="createForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="createForm.description" prop="description" :maxlength="80"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="creatingLoading" @click="create">确定</el-button>
        </div>
      </el-dialog>
      <div class="new-btn-wrap">
        <el-button size="small" @click="createDialogVisible = true" type="primary">添加应用</el-button>
      </div>
      <div class="grid-wrap clearfix">
        <div class="grid-content" v-for="(item,index) in appList" :key="index">
          <div class="title" @click="torouterLink(item.appId,item.appName)">
            <i class="icon-health " :class="item.healthClass"></i>
            <a class="theme-font-color-primary text"
            >
              <span>{{item.appName}} ></span>
            </a>
          </div>
          <div class="content">
            <div class="chart-wrap">
              <PieHealthy
                :optionData="{ legend: { data: ['健康','一般','不容忍'] }, series: [{ data: [ {value: item.healthyCount, name: '健康'}, {value: item.normalCount, name: '一般'}, {value: item.intoleranceCount, name: '不容忍'} ] } ] }"
              ></PieHealthy>
            </div>
            <div class="info-box">
              <div class="box-con">
                <div class="vaule">{{item.apdex}}</div>
                <div class="text">Apdex</div>
              </div>
              <div class="box-con">
                <div class="vaule">{{item.avgResponseTime}} ms</div>
                <div class="text">响应时间</div>
              </div>
              <div class="box-con">
                <div class="vaule">{{item.rpm}} rpm</div>
                <div class="text">吞吐率</div>
              </div>
              <div class="box-con">
                <div class="vaule">{{item.errorRate}} %</div>
                <div class="text">错误率</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import util from '_util'
import PieHealthy from '../../../../components/charts/chart-pie-healthy'
import topBarQuery from '../../../../components/mixin/topBarQuery'
import { nameValidator } from '_cbl'
import {
  Button,
  Form,
  Input,
  Notification,
  FormItem,
  Dialog,
  Loading
} from 'element-ui'

export default {
  components: {
    PieHealthy,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-button': Button
  },
  mixins: [topBarQuery],
  data() {
    return {
      createDialogVisible: false,
      createForm: {
        name: '',
        description: ''
      },
      creatingLoading: false,
      createRules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
          { max: 80, message: '应用名称不能超过80个字符', trigger: 'blur' },
          { validator: nameValidator, trigger: 'blur' }
        ]
      },
      paddingLeft: '0',
      appList: []
    }
  },

  watch: {
    appList() {
      this.$nextTick(() => {
        this.fixLeftPadding()
      })
    }
  },
  computed: {},
  mounted: function() {
    this.fixLeftPadding()
    $(window).on('resize', this.fixLeftPadding)
    //      Loading.service({ fullscreen: true });
    this.loadingInstance = Loading.service({ fullscreen: true })
  },
  methods: {
    barChange(queryData) {
      this.topBarQueryData = queryData // 项目中一旦使用Mixin会导致代码难以跟踪，所以一定要加上注释说明其关系，例如这里的topBarQueryData对象通过topBarQueryMixin进行格式化
      this.getData()
    },
    create() {
      let vm = this
      vm.$refs.createForm.validate(res => {
        if (res) {
          vm.api.createApplication({
            data: vm.createForm,
            beforeSend() {
              vm.creatingLoading = true
            },
            complete() {
              vm.creatingLoading = false
            },
            success(res) {
              vm.createDialogVisible = false
              if (res.code === 0) {
                Notification({
                  title: '创建成功',
                  type: 'success'
                })
                vm.getData()
                vm.createForm = {
                  name: '',
                  description: ''
                }
              } else {
                Notification({
                  title: '创建失败',
                  message: res.message,
                  type: 'error'
                })
              }
            }
          })
        }
      })
    },
    fixLeftPadding() {
      let remainWidth = 0
      let boxWidth = $('.grid-content').width() + 10
      let numberOfbox = $('.grid-content').length
      let documentWidth = $(document).width()
      let rowNum = parseInt(documentWidth / boxWidth)
      if (rowNum <= numberOfbox) {
        remainWidth = documentWidth - boxWidth * rowNum - 63
      } else {
        remainWidth = documentWidth - boxWidth * numberOfbox - 63
      }
      this.paddingLeft = parseInt(remainWidth / 2) + 'px'
    },
    torouterLink(appId, appName) {
      this.$root.eventBus.setCurSystem({
        id: appId,
        name: appName
      })
      this.$router.push({
        name: 'dashboard'
      })
    },
    getData() {
      this.api
        .getAppOverview({
          data: {
            condition: {
              startTime: this.startTime,
              endTime: this.endTime
            }
          }
        })
        .then(res => {
          if (res.code === 0) {
            this.loadingInstance.close()
            res.data.map(m => {
              m.rpm = util.toDecimal(m.rpm, 1)
              m.avgResponseTime = util.toDecimal(m.avgResponseTime, 1)
              if (m.health) {
                m.healthClass = util.handleHealthy(m.health).IconClass
              } else {
                m.healthClass = 'icon-health-healthy'
              }
            })
            this.appList = res.data
          }
        })
        .always(() => {
          this.loadingInstance.close()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-overview {
  .new-btn-wrap {
    padding: 24px 0 0 30px;
  }
  .grid-wrap {
    padding: 24px 24px 19px 24px;
    .grid-content {
      float: left;
      width: 320px;
      height: 400px;
      background: #fff;
      box-shadow: 3px 3px 3px #ddd;
      border: solid 1px #ccc;
      margin: 0 5px 10px;
      .title {
        cursor: pointer;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: solid 1px #ccc;
        .icon {
          font-size: 20px;
          vertical-align: middle;
        }
        .text {
          width: 250px;
          margin-left: 4px;
          font-size: 14px;
          vertical-align: middle;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .content {
        .chart-wrap {
          height: 180px;
        }
        .info-box {
          padding-top: 10px;
          border-top: solid 1px #ccc;
          margin: 0 20px;
          display: flex;
          flex-wrap: wrap;
          .box-con {
            padding: 20px 20px 0;
            box-sizing: border-box;
            text-align: center;
            width: 50%;
            .vaule {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
