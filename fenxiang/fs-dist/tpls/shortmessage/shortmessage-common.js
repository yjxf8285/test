/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/shortmessage/shortmessage-common",["util","moment","./shortmessage-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=(a("moment"),a("./shortmessage-common.html")),h=$(g);f.tplRouterReg("#shortmessage/showsession/=/:id-:value/:empid-:value"),b.init=function(a){var b=$(".tpl-l .tpl-inner",a),c=f.getContactData(),d=c.u,e={},g=_.template(h.filter(".sm-tpl-left").html());_.extend(e,{userName:d.name,profileImage:d.profileImage}),b.html(g(e))}});