/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/search/images/images",["util","modules/fs-attach/fs-attach-list","../search-common","filter","moment","../search-common.html","autocomplete","events"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store,e.event;var f=a("util"),g=a("modules/fs-attach/fs-attach-list"),h=a("../search-common");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".tpl-l",a),e=$(".attach-list",a),i=$(".attach-list-pagination",a),j=$(".search-inp-s",a),k=h.init(a,c),l=new g({element:e,pagSelector:i,pagOpts:{pageSize:45,totalSize:0,visiblePageNums:7},attachType:"img",listPath:"/FeedSearch/getImgFeedForSearch",defaultRequestData:{},listEmptyText:"没有符合条件的搜索结果"});k.on("search",function(a){var b=_.extend({feedType:0,keyword:_.str.trim(j.val()),feedAttachType:0},a);b.keyword.length>0&&(l.opts.defaultRequestData=b,l.reload())}),function(){var b=f.getTplQueryParams(),c=b?b.key:"";j.val(decodeURIComponent(c)).keyup(),$(".tpl-nav-l",d).eq(1).addClass("depw-menu-aon"),$(".all-employee",a).click(),$(".search-include-nav-list",$(".tpl-l",a)).hide()}()}});