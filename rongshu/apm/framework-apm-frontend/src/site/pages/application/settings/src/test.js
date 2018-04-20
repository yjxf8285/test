
export default {
  name: 'tier-list-setting',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-input': Input,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
    'el-pagination': Pagination,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem
  },
  mounted () {
    this.getTierTypes()
    this.getTierList()
    this.searchName = this.$route.query.tierFilterName
  },
  data () {
    return {
      originTierList: [],
      searchName: '',
      curTier: {
        name: ''
      },
      createDialogVisible: false,
      deleteDialogVisible: false,
      deleteTierId: null,
      createForm: {
        name: '',
        tierType: 1,
        TierTypes: [],
        description: ''
      },
      createRules: {
        name: [{
          required: true,
          message: '请输入Tier名称',
          trigger: 'blur'
        },
        {
          max: 10,
          message: 'Tier名称不能超过10个字符',
          trigger: 'blur'
        },
        {
          validator: nameValidator,
          trigger: 'blur'
        }
        ]
      },
      downloadDialogVisible: false
    }
  },
  computed: {
    tierList () {
      return this.originTierList.filter(tier => {
        if (tier.name === '__browser__') return false
        if (this.searchName) return tier.name.indexOf(this.searchName) !== -1
        else return true
      })
    }
  },
  watch: {
    searchName (v) {
      if (v) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            tierFilterName: this.searchName
          })
        })
      }
    }
  },
  methods: {
    create () {
      let vm = this
      vm.$refs.createForm.validate(res => {
        if (res) {
          vm.api.createTier({
            data: Object.assign({
              applicationId: this.$root.eventBus.getCurSystem().id,
              tier_type: this.createForm.tierType
            },
            vm.createForm
            ),
            beforeSend () {
              vm.loading = true
            },
            complete () {
              vm.loading = false
            },
            success (res) {
              vm.createDialogVisible = false
              if (res.code === 0) {
                Notification({
                  title: '创建成功',
                  type: 'success'
                })
                vm.getTierList()
                vm.createForm.name = ''
                vm.createForm.description = ''
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
    getTierTypes () {
      this.api.getTierType().then(res => {
        if (res.code === 0) {
          this.createForm.TierTypes = res.data
        }
      })
    },
    getTierList () {
      let vm = this
      vm.api.getTierListByApplicationId({
        data: {
          applicationId: this.$root.eventBus.getCurSystem().id
        },
        beforeSend () {
          vm.loading = true
        },
        complete () {
          vm.loading = false
        },
        success (res) {
          if (res.code === 0) {
            vm.originTierList = res.data.map((ins, index) => {
              return Object.assign({
                index,
                modifying: false,
                tempName: '',
                loading: false,
                correct: true,
                warning: ''
              },
              ins
              )
            })
          }
        }
      })
    },
    downloadInstance (rowData) {
      window.open(
        window.$$apm.outerRemoteHost +
          '/agent/downloadAgent?applicationId=' +
          this.$root.eventBus.getCurSystem().id +
          '&tierId=' +
          rowData.id +
          '&type=' +
          rowData.tierType
      )
    },
    renameTier (scope) {
      console.log(scope)
      scope.row.modifying = true
      scope.row.tempName = scope.row.name
      this.$nextTick(() => {
        $($('.tier-name-modifying')[scope.$index])
          .find('input')[0]
          .focus()
      })
    },
    cancelModify (scope) {
      scope.row.modifying = false
      scope.row.correct = true
    },
    validateName (scope) {
      return nameValidator({}, scope.row.tempName, res => {
        if (res instanceof Error) {
          scope.row.warning = res.toString().substring(7)
          return (scope.row.correct = false)
        } else {
          return (scope.row.correct = true)
        }
      })
    },
    confirmModify (scope) {
      let vm = this
      if (vm.validateName(scope)) {
        console.log(scope)
        vm.api.updateTierName({
          data: {
            id: scope.row.id,
            name: scope.row.tempName
          },
          beforeSend () {
            scope.row.loading = true
          },
          complete () {
            scope.row.loading = false
          },
          success (res) {
            if (res.code === 0) {
              scope.row.modifying = false
              scope.row.name = scope.row.tempName
              Notification({
                title: '修改成功',
                type: 'success'
              })
            } else {
              Notification({
                title: '修改失败',
                message: res.message,
                type: 'error'
              })
            }
          }
        })
      }
    },
    deleteTierConfirm (scope) {
      this.deleteDialogVisible = true
      this.deleteTierId = scope.row.id
    },
    deleteTier () {
      let that = this
      that.api
        .deleteTier({
          data: {
            tierId: that.deleteTierId
          }
        })
        .then(function () {
          that.deleteDialogVisible = false
          that.deleteTierId = null
          that.getTierList()
        })
    }
  }
}
