/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/shortmessage/shortmessage",["util","./shortmessage-common","moment","./shortmessage-common.html","modules/fs-qx/fs-shortmessage-list"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=(e.store,e.event),g=(a("util"),a("./shortmessage-common")),h=a("modules/fs-qx/fs-shortmessage-list");b.init=function(){var a=b.tplName,c=b.tplEl,d=$(".qx-list",c),e=$(".qx-list-pagination",c),i=new h({element:d,pagSelector:e,listPath:"/ShortMessage/GetShortMessageSessions",searchOpts:{},listCb:function(){}});g.init(c,a);var j=!0;f.on("switched",function(b){b==a&&(j?(j=!1,i.load()):i.reload())})}});