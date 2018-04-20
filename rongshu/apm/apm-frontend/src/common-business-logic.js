export const nameValidator = function(rule, value, callback) {
  let reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  return callback(
    (reg.test(value))
    ? undefined : new Error('应用名称只能包含字母、中文、数字和下划线，且只能以字母或中文开头'))
}

const genValidator = function(regStr, msg, otherCondition) {
  return {
    validator(rule, value, callback) {
      let reg = new RegExp(regStr)
      let oCon = (typeof otherCondition === 'function') ? otherCondition(value) : true
      let cbArg = (reg.test(value) && oCon) ? undefined : new Error(msg)
      return callback(cbArg)
    },
    trigger: 'blur'
  }
}
export const configItemValidators = {
  // 自定义的验证只能放在第二个位置，应用列表页将这些验证规则用于element-ui的表单验证
  // 实例列表页则单独使用了第二项自定义验证来验证表格中的表单
  'kepler_agent_collector_host': [{
    required: true,
    message: '请输入主机地址',
    trigger: 'blur'
  }, {}],
  'kepler_agent_collector_port': [{
    required: true,
    message: '请输入端口号',
    trigger: 'blur'
  },
    // 只能为1-65535之间的正整数
    genValidator(
      '^\\d+$', '请输入正确的端口号，只能为1~65535之间的整数',
      (value) => {
        return Number(value) >= 1 && Number(value) <= 65535
      }
    )
  ],
  'kepler_sampling_rate': [{
    required: true,
    message: '请输入采样率',
    trigger: 'blur'
  },
    // 数字，0.01-100，百分比
    genValidator(
      '^[0-9]+([.]{1}[0-9]{1,2})?$', '请输入正确的采样率，最小为0, 最大为100',
      (value) => {
        return Number(value) >= 0.01 && Number(value) <= 100
      }
    )
  ],
  'kepler_healthcheck_period': [{
    required: true,
    message: '请输入心跳周期',
    trigger: 'blur'
  },
    // 正整数，单位为秒
    genValidator('^\\d+$', '请输入正确的心跳周期，仅允许正整数')
  ],
  'kepler_apdext_time': [{
    required: true,
    message: '请输入Apdext',
    trigger: 'blur'
  },
    // 正整数
    genValidator('^\\d+$', '请输入正确的Apdext，仅允许正整数')
  ],

  'kepler_metrics_collect_period': [{
    required: true,
    message: '请输入JVM采样周期',
    trigger: 'blur'
  },
    // 正整数，单位为秒
    genValidator('^\\d+$', '请输入正确的JVM采样周期，仅允许正整数')
  ],
  'kepler_thread_dump_period': [{
    required: true,
    message: '请输入线程采样周期',
    trigger: 'blur'
  },
    // 正整数，单位为毫秒，
    genValidator('^\\d+$', '请输入正确的线程采样周期，仅允许正整数')
  ],
  'kepler_browser_showlog': [
    // { required: true, message: '请输入线程采样周期', trigger: 'blur' }
  ],
  'kepler_browser_openTraceEnabled': [
    // { required: true, message: '请输入线程采样周期', trigger: 'blur' }
  ],
  'kepler_browser_transFrequency': [{
    required: true,
    message: '请输入线程采样周期',
    trigger: 'blur'
  },
    // 正整数，单位为毫秒，
    genValidator('^\\d+$', '请输入正确的线程采样周期，仅允许正整数')
  ],
  'kepler_trace_destination_ignore': [],
  'kepler_http_excludeurl': [

  ]
}
export const customConfigItemValidators = {
  'className': [{
    required: true,
    message: '请输入类名',
    trigger: 'blur'
  },
    genValidator('^[a-zA-Z]([a-zA-Z]|[0-9])+$', '只能输入英文字母及数字')
  ],
  'methodName': [{
    required: true,
    message: '请输入方法',
    trigger: 'blur'
  },
    genValidator('^[a-zA-Z]([a-zA-Z]|[0-9])+$', '只能输入英文字母及数字')
  ]
}

export const appConfig = {
  'kepler_agent_collector_host': {
    id: 1,
    key: 'kepler.agent.collector.host',
    name: '主机地址',
    value: '10.32.10.22',
    type: 1,
    correct: true,
    warning: ''
  },
  'kepler_agent_collector_port': {
    id: 2,
    key: 'kepler.agent.collector.port',
    name: '主机端口',
    value: '8000',
    type: 1,
    correct: true,
    warning: ''
  },
  'kepler_sampling_rate': {
    id: 3,
    key: 'kepler.sampling.rate',
    name: '采样率',
    value: 99,
    type: 1,
    correct: true,
    warning: ''
  },
  'kepler_healthcheck_period': {
    id: 3,
    key: 'kepler.healthcheck.period',
    name: '心跳周期',
    value: 99,
    type: 1,
    correct: true,
    warning: ''
  },
  'kepler_apdext_time': {
    id: 4,
    key: 'kepler.apdext.time',
    name: 'ApdexT',
    value: 100,
    type: 1,
    correct: true,
    warning: ''
  },

  'kepler_metrics_collect_period': {
    id: 5,
    key: 'kepler.metrics.collect.period',
    name: 'jvm采样周期',
    value: 60000,
    type: 2,
    correct: true,
    warning: ''
  },
  'kepler_thread_dump_period': {
    id: 6,
    key: 'kepler.thread.dump.period',
    name: '线程采样周期',
    value: 400,
    type: 2,
    correct: true,
    warning: ''
  },
  'kepler_browser_showlog': {
    id: 7,
    key: 'kepler.browser.showlog',
    name: '是否启用浏览器端日志输出',
    value: 'false',
    isBoolean: true,
    type: 4,
    correct: true,
    warning: ''
  },
  'kepler_browser_openTraceEnabled': {
    id: 8,
    key: 'kepler.browser.openTraceEnabled',
    name: '是否启用OpenTracing',
    value: 'true',
    isBoolean: true,
    type: 4,
    correct: true,
    warning: ''
  },
  'kepler_browser_transFrequency': {
    id: 9,
    key: 'kepler.browser.transFrequency',
    name: '探针数据发送频率',
    value: 1000,
    type: 4
  },
  'kepler_trace_destination_ignore': {
    applicationId: '5346663515938639607',
    id: '3683584851365350189',
    key: 'kepler.trace.destination.ignore',
    name: '白名单',
    type: 0,
    value: 'no',
    correct: true,
    warning: ''
  },
  'kepler_http_excludeurl': {
    applicationId: '710335158458396672',
    id: '16',
    key: 'kepler_http_excludeurl',
    name: 'url白名单',
    type: 0,
    value: 5,
    correct: true,
    warning: ''
  },
  'kepler_http_reqparam_trace': {
    applicationId: '710335158458396672',
    id: '17',
    key: 'kepler_http_reqparam_trace',
    name: '是否追踪请求参数',
    isBoolean: true,
    type: 0,
    value: 'true',
    correct: true,
    warning: ''
  },
  'kepler_http_reqparam_eachlength': {
    applicationId: '710335158458396672',
    id: '18',
    key: 'kepler_http_reqparam_eachlength',
    name: '单个请求参数长度限制',
    type: 0,
    value: 64,
    correct: true,
    warning: ''
  },
  'kepler_http_reqparam_totallength': {
    applicationId: '710335158458396672',
    id: '19',
    key: 'kepler_http_reqparam_eachlength',
    name: '所有请求参数长度限制',
    type: 0,
    value: 512,
    correct: true,
    warning: ''
  }
}

// 配置的显示顺序 注意后端接口给的key是用点儿分割的，前端会转成下划线
export const configIndexMap = [
  'kepler_agent_collector_host',
  'kepler_agent_collector_port',
  'kepler_sampling_rate',
  'kepler_healthcheck_period',
  'kepler_apdext_time',
  'kepler_http_excludeurl',
  'kepler_metrics_collect_period',
  'kepler_thread_dump_period',
  'kepler_browser_showlog',
  'kepler_browser_openTraceEnabled',
  'kepler_trace_destination_ignore',
  'kepler_browser_transFrequency',
  'kepler_http_reqparam_trace',
  'kepler_http_reqparam_eachlength',
  'kepler_http_reqparam_totallength'
]

export const configTypeMap = [{
  name: '通用',
  color: ''
},
{
  name: 'Java',
  color: 'primary'
},
{
  name: 'Tuxedo',
  color: 'success'
},
{
  name: 'Browser',
  color: 'danger'
},
{
  name: 'PHP',
  color: 'warning'
}
]

export const instanceTypeMap = [{
  name: '通用',
  color: ''
},
{
  name: 'Java',
  color: 'primary'
},
{
  name: 'Tuxedo',
  color: 'success'
},
{
  name: 'Browser',
  color: 'danger'
},
{
  name: 'PHP',
  color: 'warning'
}
]

export const apdexConverter = (v) => {
  switch (v) {
    case 'SLOW':
      return {
        apdexIconClass: 'icon-apdex-slow',
        apdexStatus: 'slow',
        apdexTitle: '缓慢'
      }
    case 'VERY_SLOW':
      return {
        apdexIconClass: 'icon-apdex-very-slow',
        apdexStatus: 'very_slow',
        apdexTitle: '非常慢'
      }
    case 'ERROR':
      return {
        apdexIconClass: 'icon-apdex-error',
        apdexStatus: 'error',
        apdexTitle: '错误'
      }
    case 'NORMAL':
    default:
      return {
        apdexIconClass: 'icon-apdex-normal',
        apdexStatus: 'normal',
        apdexTitle: '正常'
      }
  }
}
