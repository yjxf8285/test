/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/plan/followedplans/followedplans",["util","modules/feed-list/feed-list","../plan-common","moment","../plan-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=(e.store,e.event),g=(a("util"),a("modules/feed-list/feed-list")),h=a("../plan-common");b.init=function(){var a,c=b.tplName,d=b.tplEl,e=$(".feed-list",d),i=$(".feed-list-pagination",d);h.init(d,c),a=new g({element:e,pagSelector:i,pagOpts:{pageSize:10,visiblePageNums:7},listPath:"/feed/getFeedFollows",defaultRequestData:function(){return{keyword:"",feedType:2}}});var j=function(){a.destroy()};f.one("beforeremove",function(a){a==c&&j()}),a.reload()}});