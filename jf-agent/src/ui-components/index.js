/*
 * @Author: wuyulong
 * @Date: 2020-04-29 17:22:19
 * @LastEditTime: 2020-05-09 17:20:34
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/ui-components/index.js
 */
import JfUploadExcel from "./jf-upload-excel/jf-upload-excel";
import JfTable from "./jf-table/jf-table";
import JfDatePicker from "./jf-date-picker/jf-date-picker";

const uiComponents = {
    components: [
        JfUploadExcel,
        JfTable,
        JfDatePicker
    ],
    install:function(Vue,option={}){
        this.components.map((el)=>{
            return Vue.component(el.name,el)
        })
    }
}

export default uiComponents;