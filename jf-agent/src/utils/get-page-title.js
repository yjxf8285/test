/*
 * @Author: wuyulong
 * @Date: 2020-02-20 12:12:29
 * @LastEditTime: 2020-02-21 12:11:49
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/utils/get-page-title.js
 */
import defaultSettings from '@/settings'

const title = defaultSettings.title || '代理商平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
