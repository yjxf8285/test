/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/guides/guides-common",["util"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=f.getContactData();g.u,b.init=function(){f.tplRouterReg("#guides/resetpassword")},b.saveSuccessAnimated=function(a){var b=$(".save-success-apv",a);b.animate({top:"0px"},300,function(){setTimeout(function(){b.animate({top:"54px"},300)},2e3)})}});