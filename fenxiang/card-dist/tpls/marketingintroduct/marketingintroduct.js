/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/marketingintroduct/marketingintroduct",["moment","util"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=(e.store,a("moment"),e.event);a("util"),b.init=function(){var a=(b.tplEl,b.tplName);f.on("switch",function(b){b==a?($(".hd-b").hide(),$(".hd .top-nav-l").removeClass("sc-tag"),$(".hd .cxb-l").removeClass("sc-tag").addClass("sc-tagon")):($(".hd-b").show(),$(".hd .top-nav-l").removeClass("sc-tag").eq(0).addClass("sc-tagon"))})}});