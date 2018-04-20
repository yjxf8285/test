<style lang="scss" scoped>
.table-box {
  position: relative;
}
.add-btn {
  float: right;
}
</style>
<template>
  <div class="key-transaction">
     <top-bar @barChange="barChange"></top-bar>
    <div class="operation-bar theme-border-color-darken">
      <el-button class="add-btn" type="primary" :disabled="!ruleForm.sysId" @click="dialogVisible = true">
        <i class="ion-plus-round"></i>
      </el-button>
    </div>
    <div class="page-container table-box" ref="tableContainer">
      <el-table
        :data="transcationList.data"
        stripe
        style="width: 100%" class="">
        <el-table-column
          prop="name"
          label="关键Web事务">
          <template slot-scope="scope">
            <a class="theme-font-color-primary" href="javascript:void 0;" @click="affairListClick(scope.row.name)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="选择"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button @click="del(scope.row.id)" type="text" size="small"><span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="创建关键Web事务"
        :visible.sync="dialogVisible"
        size="small">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="系统：">
            <span>{{ruleForm.sysName}}</span>
          </el-form-item>
          <el-form-item label="关键Web事务：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSave" :disabled="disabledSubmit" :loading="addKeyTranLoading">添 加</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  Dialog,
  Form,
  Input,
  Message,
  FormItem,
  Button,
  Loading
} from 'element-ui'

export default {
  mounted() {
    // this.$root.eventBus.$on('system-change', this.setSys)
    this.setSys()
    this.getListData()
  },
  destroyed() {
    this.$root.eventBus.$off('system-change', this.setSys)
  },
  data() {
    return {
      queryData: {},
      dialogVisible: false,
      disabledSubmit: true,
      disabledDel: false,
      transcationList: {
        data: [],
        loading: false,
        loadingInstance: null
      },
      addKeyTranLoading: false,
      ruleForm: {
        name: '',
        sysName: '',
        sysId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入关键事务名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ]
      },
      first: true
    }
  },
  watch: {
    ruleForm: {
      handler(v) {
        this.disabledSubmit = v.name.length === 0
        this.ruleForm.name = $.trim(v.name)
      },
      deep: true
    },
    'transcationList.loading'(v) {
      if (v) {
        this.transcationList.loadingInstance = Loading.service({
          target: this.$refs.tableContainer
        })
      } else {
        if (this.transcationList.loadingInstance) {
          this.transcationList.loadingInstance.close()
          this.transcationList.loadingInstance = null
        }
      }
    }
  },
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-dialog': Dialog,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button
  },
  methods: {
    barChange(arr) {
      if (arr && arr.length) {
        this.queryData = {
          interval: arr[0].id,
          systemId: arr[1].id,
          groupId: arr[2].id,
          agentId: arr[3].id
        }
      }
      this.getListData()
    },
    setSys() {
      if (this.first) {
        this.$root.eventBus.$on('system-change', this.setSys)
        this.first = false
      }
      let sys = this.$root.eventBus.getCurSystem()
      this.ruleForm.sysName = sys.name
      this.ruleForm.sysId = sys.id
      this.getListData(this.ruleForm.sysId)
    },
    handleSave() {
      let that = this
      that.$refs.ruleForm.validate(valid => {
        if (!valid) return
        that.api
          .getCriticalSave({
            data: {
              systemId: that.ruleForm.sysId,
              name: that.ruleForm.name
            },
            beforeSend() {
              that.disabledSubmit = true
              that.addKeyTranLoading = true
            },
            complete() {
              that.disabledSubmit = false
              that.addKeyTranLoading = false
            }
          })
          .done(res => {
            if (res.code === 0) {
              Message({
                message: '添加成功',
                type: 'success'
              })
              that.dialogVisible = false
              that.ruleForm.name = ''
              that.$refs.ruleForm.resetFields()
              that.getListData()
            } else {
              Message({
                message: '添加失败',
                type: 'error'
              })
            }
          })
      })
    },
    del(id) {
      let that = this
      this.api
        .getCriticalDelete({
          data: {
            _id: id
          },
          beforeSend() {
            // that.disabledDel = true
            that.transcationList.loading = true
          },
          complete() {
            that.transcationList.loading = false
          }
        })
        .done(res => {
          if (res.code === 0) {
            Message({
              message: '删除成功',
              type: 'success'
            })
            this.getListData()
          } else {
            Message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
    },
    getListData() {
      let that = this
      that.api
        .getCriticalList({
          data: {
            system_id:
              that.ruleForm.sysId || this.$root.eventBus.getCurSystem().id,
            interval: this.queryData.interval
          },
          beforeSend() {
            that.transcationList.loading = true
          }
        })
        .done(res => {
          if (res.code === 0) {
            // that.disabledDel = false;
            that.transcationList.data = res.data
          }
        })
        .always(res => {
          that.transcationList.loading = false
        })
    },
    affairListClick(name) {
      this.$router.push({
        name: 'web-slow-transaction-satisfy',
        query: Object.assign({}, this.$route.query, {
          queryStr: name,
          systemId: this.$root.eventBus.getCurSystem().id,
          interval: this.$root.eventBus.getCurTime().id
        })
      })
    }
  }
}
</script>

