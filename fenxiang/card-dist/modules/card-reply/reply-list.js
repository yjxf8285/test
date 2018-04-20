/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/card-reply/reply-list",["widget","util","./reply.html","modules/publish/publish","moment","modules/feed-list/feed-list-helper","modules/fs-attach/fs-attach-preview","modules/fs-attach/fs-attach-file-preview","uilibs/audio-player"],function(a,b,c){var d=window,e=d.FS;e.tpl;var f=(a("widget"),a("util")),g=a("./reply.html"),h=a("modules/publish/publish"),i=(a("moment"),a("modules/feed-list/feed-list-helper.js")),j=a("modules/fs-attach/fs-attach-preview"),k=a("modules/fs-attach/fs-attach-file-preview");a("uilibs/audio-player");var l=$(g);l.filter(".feed-reply-tpl").html(),_.template(l.filter(".feed-reply-input-tpl").html()),_.template(l.filter(".feed-reply-item-tpl").html()),h.atInput,h.mediaMaker,i.feedContentFormat_,(new j).render();var m=k.FileReader;new m;var n=f.getContactData();n.u;var o=function(){};_.extend(o.prototype,{}),c.exports=o});