/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/attach/attach-common",["util","moment","./attach-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=(a("moment"),a("./attach-common.html")),h=$(g);b.init=function(a){var b=$(".tpl-l .tpl-inner",a),c=f.getContactData(),d=c.u,e={},g=_.template(h.filter(".attach-tpl-left").html());_.extend(e,{userName:d.name,profileImage:d.profileImage}),b.html(g(e)),f.regTplNav($(".tpl-nav-lb",b)),f.tplRouterReg($(".tpl-nav-lb",b))}});