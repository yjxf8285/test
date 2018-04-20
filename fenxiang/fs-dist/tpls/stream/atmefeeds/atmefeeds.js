/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/stream/atmefeeds/atmefeeds",["../stream-common","util","dialog","../stream-common.html","modules/fs-reply/fs-reply-list","modules/feed-list/feed-list","tabs"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("../stream-common"),g=a("modules/fs-reply/fs-reply-list"),h=a("modules/feed-list/feed-list"),i=a("tabs"),j=a("util");b.init=function(){var a=b.tplEl,c=b.tplName;f.init(a,c);var d,k=$(".feed-tabs",a),l=$(".search-inp",a),m=$(".search-btn",a),n=function(a){var b=$(a),c=b.data("feedList");c&&c.loadKill()},o=function(a){0==a.get("activeIndex")?a.trigger("switched",0,-1):a.switchTo(0),a.adjustTriggerBg()},p=null;d=new i({element:k,triggers:$(".feed-main-item",k),panels:$(".feed-main-panel",k),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render(),d.on("switched",function(a){var b,c,d,e=this.get("panels").eq(a),f=$(".feed-list",e),g=$(".feed-list-pagination",e),j=e.attr("feedtype"),k=e.attr("feedname");"0"==j||"1"==j?(d=e.data("feedList"),d?d.reload():(d=new h({element:f,pagSelector:g,pagOpts:{pageSize:20,visiblePageNums:7},withLazyload:!1,listPath:"/feed/getFeedsOfAtMe",defaultRequestData:function(){return{subType:0,feedType:j,keyword:_.str.trim(l.val())}},searchOpts:{inputSelector:l,btnSelector:m},listEmptyText:"没有找到提到我的工作"}),d.load(),e.data("feedList",d)),p=d):(b=$(".feed-sub-list",e),c=b.data("subTabs"),b.data("rendered")?o(c):(c=new i({element:b,triggers:$(".feed-"+k+"-item",b),panels:$(".feed-"+k+"-panel",b),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click",withTabEffect:!1}).render().on("switched",function(a){var b=this.get("panels").eq(a),c=$(".feed-list",b),d=$(".feed-list-pagination",b),e=b.attr("subtype"),f=b.data("feedList");f?f.reload():(f=new h({element:c,pagSelector:d,pagOpts:{pageSize:20,visiblePageNums:7},withLazyload:!1,listPath:"/feed/getFeedsOfAtMe",defaultRequestData:function(){return{subType:e,feedType:j,keyword:_.str.trim(l.val())}},searchOpts:{inputSelector:l,btnSelector:m},listEmptyText:"没有找到提到我的工作"}),f.load(),b.data("feedList",f)),p=f}).on("switch",function(a,b){n(this.get("panels").eq(b))}),c.trigger("switched",0,-1),b.data("rendered",!0),b.data("subTabs",c)))}).on("switch",function(a,b){n(this.get("panels").eq(b))});var q=g.replyList,r=$(".reply-tabs",a),s=new i({element:r,triggers:$(".ui-tab-item",r),panels:$(".ui-tab-panel",r),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render();s.on("switched",function(a){var b=this.get("panels").eq(a),c=$(".reply-list",b),d=$(".reply-list-pagination",b),e=b.attr("feedtype"),f=b.data("replyList");f?f.reload():(f=new q({element:c,pagSelector:d,pagOpts:{pageSize:45,totalSize:0,visiblePageNums:7},listPath:"/feed/getFeedReplysOfAtMe",defaultRequestData:function(){return{feedType:e,keyword:_.str.trim(l.val())}},replyCb:function(){},listEmptyText:"没有找到提到我的回复",searchOpts:{inputSelector:l,btnSelector:m}}),f.load(),b.data("feedList",f)),p=f}),e.event.on("switched",function(a){var b=j.getTplQueryParams(),c=b?b.type:"feed";"stream-atmefeeds"==a?(k.show(),r.hide(),p&&p.resetSearch(),"feed"==c?$(".filter-field",t).eq(0).click():$(".filter-field",t).eq(1).click()):p&&p.loadKill&&p.loadKill()});var t=$(".filter",a);t.on("click",".filter-field",function(b){var c=$(this),e=c.attr("val"),f=$(".depw-text",a);$(".filter-field",t).removeClass("depw-menu-aon"),c.addClass("depw-menu-aon"),f.hide(),p&&p.resetSearch(),"feed"==e?(k.show(),r.hide(),f.eq(0).show(),o(d)):(k.hide(),r.show(),f.eq(1).show(),o(s)),b.preventDefault()}),m.click(function(a){p.reload(),a.preventDefault()})}});