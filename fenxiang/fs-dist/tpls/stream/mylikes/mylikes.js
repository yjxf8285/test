/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/stream/mylikes/mylikes",["tabs","util","../stream-common","dialog","../stream-common.html","modules/fs-like/fs-like"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event;a("tabs"),a("util");var g=a("../stream-common"),h=a("modules/fs-like/fs-like");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".like-list",a),e=$(".like-list-pagination",a),i=$(".filter",a),j=new h({element:d,pagSelector:e,listPath:"/FeedExtend/GetFeedLikesOfIReceive",searchOpts:{},listCb:function(){}});i.on("click",".filter-field",function(a){var b=$(this),c=b.attr("liketype");$(".filter-field",i).removeClass("depw-menu-aon"),b.addClass("depw-menu-aon"),j.opts.listPath="received"==c?"/FeedExtend/GetFeedLikesOfIReceive":"/FeedExtend/GetFeedLikesOfISend",j.reload(),a.preventDefault()}),g.init(a,c);var k=!0;f.on("switched",function(a){a==c&&(k?(j.load(),k=!1):($(".filter-field",i).removeClass("depw-menu-aon").eq(0).addClass("depw-menu-aon"),j.opts.listPath="/FeedExtend/GetFeedLikesOfIReceive",j.reload()))})}});