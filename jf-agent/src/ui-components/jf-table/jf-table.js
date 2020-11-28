/*
 * @Author: wuyulong
 * @Date: 2020-04-29 17:09:34
 * @LastEditTime: 2020-04-30 17:54:36
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-platform-web/src/ui-components/jf-table/jf-table.js
 */
import JfTable from "./jf-table.vue";

JfTable.install = function(Vue){
    Vue.component(JfTable.name,JfTable)
}
export default JfTable;