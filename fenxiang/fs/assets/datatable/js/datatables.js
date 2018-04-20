/**
 * 扩展datatables
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var DatatableCore=require('datatable_core'),
        DatatablePlugin=require('./datatables-plugin.js');    //引入datatable plugin扩展

    module.exports=DatatableCore;   //返回datable构造函数
});
