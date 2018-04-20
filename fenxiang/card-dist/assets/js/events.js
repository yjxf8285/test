/**
 * 纷享资源脚本
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("jslibs/events",["events_core"],function(a,b,c){var d=a("events_core");d.prototype.one=function(a,b,c){var d=this,e=function(){return d.off(a,e,c),b.apply(this,arguments)};this.on(a,e,c)},c.exports=d});