export const nameValidator = function (rule, value, callback) {
  let reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  return callback(
    (reg.test(value))
      ? undefined : new Error('应用名称只能包含字母、中文、数字和下划线，且只能以字母或中文开头'))
}
