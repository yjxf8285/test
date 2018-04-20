/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/entnetworkdisk/entnetworkdisk-common",["util","moment","./entnetworkdisk-common.html","./entnetworkdisk-common.css"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=(a("moment"),a("./entnetworkdisk-common.html")),h=(a("./entnetworkdisk-common.css"),$(g));f.tplRouterReg("#entnetworkdisk/remindmyfile"),f.tplRouterReg("#entnetworkdisk/medownloadfile"),b.init=function(a){var b=$(".tpl-l .tpl-inner",a),c=f.getContactData(),d=c.u,e={},g=_.template(h.filter(".entnetworkdisk-tpl-left").html());_.extend(e,{userName:d.name,profileImage:d.profileImage}),b.html(g(e)),f.regTplNav($(".tpl-nav-lb",b))}});