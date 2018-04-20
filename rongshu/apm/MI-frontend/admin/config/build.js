/**
 * @author: jiangfeng
 * @summary: 构建时的配置文件
 */
module.exports = {
  'app': {
    'disableAuthorize': false,
    'staticSrc': './fe/assets',
    'renderView': './fe/views',
    'serviceDirectory': './be/services',
    'routeDirectory': './be/routes'
  },
  'runtime': {
    'i18n': {
      'directory': './be/runtime/locales'
    }
  }
}
