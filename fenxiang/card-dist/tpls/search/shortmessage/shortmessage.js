/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/search/shortmessage/shortmessage",["util","modules/fs-qx/fs-showsession-list","../search-common","filter","moment","../search-common.html","autocomplete","events"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store,e.event;var f=a("util"),g=a("modules/fs-qx/fs-showsession-list"),h=a("../search-common"),i=function(a,b){var c=f.getPersonalConfig("searchHistory")||[],d="";c=_.reject(c,function(b){return b==a}),c.unshift(a),c=c.slice(0,10),_.each(c,function(a){d+='<li><a href="#search/shortmessage/=/key-'+a+'"><i class="srl-icon"></i>'+a+"</a></li>"}),b.html(d),f.setPersonalConfig("searchHistory",c),f.updatePersonalConfig()};f.tplRouterReg("#shortmessage/showsession/=/:id-:value"),b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".tpl-l",a),j=$(".session-list",a),k=$(".session-list-pagination",a),l=$(".search-inp-s",a),m=h.init(a,c),n=new g({element:j,pagSelector:k,listPath:"/FeedSearch/GetShortMessagesForSearch",searchOpts:{},itemRenderCb:function(a,b){var c,d=a.$el,e=$(".fs-showsession-item-my-dialog",d),f=b.get("session");c=f.value3?"+展开该群对话的对话":"+展开我与"+f.value1+"的对话",$('<a style="display:block;padding-top:10px;text-align: right;" class="to-session-l" href="#shortmessage/showsession/=/id-'+f.value+'" title="'+c+'">'+c+"</a>").appendTo(e)},listEmptyText:"没有符合条件的搜索结果"});a.on("click",".clear-search-l",function(){var b=$(".tpl-r .search-r-list",a);b&&(b.empty(),f.setPersonalConfig("searchHistory",[]),f.updatePersonalConfig())}),m.on("search",function(b){var c=_.str.trim(l.val()),d=$(".tpl-r .search-r-list",a),e=_.extend({feedType:0,keyword:c,feedAttachType:0},b);e.keyword.length>0&&(n.opts.defaultRequestData=e,n.reload()),d&&i(c,d)}),e.event.on("switched",function(a,b){var c,d,e;"search-shortmessage"==a&&(c=f.getTplQueryParams(),d=c?c.key:"",e=$(".tpl-r .search-r-list",b),i(d,e))}),function(){var b=f.getTplQueryParams(),c=b?b.key:"";l.val(decodeURIComponent(c)).keyup(),$(".tpl-nav-l",d).eq(5).addClass("depw-menu-aon"),$(".all-employee",a).click(),$(".search-include-nav-list",$(".tpl-l",a)).show()}()}});