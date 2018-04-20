/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/maptest/maptest",["modules/fs-map/fs-map-list"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("modules/fs-map/fs-map-list");b.init=function(){var a=b.tplEl;b.tplName;var c=$(".map-list",a),d=$(".map-list-pagination",a);$(".filter",a);var e=new f({element:c,pagSelector:d,listPath:"/Location/GetLocationInfosByIDAndTimeRange",oData:{employeeID:2,startTime:0,endTime:0},pagOpts:{pageNumber:1,pageSize:10,visiblePageNums:1},searchOpts:{},listCb:function(){}});e.load()}});