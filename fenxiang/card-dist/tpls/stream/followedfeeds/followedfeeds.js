/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/stream/followedfeeds/followedfeeds",["tabs","util","modules/fs-reply/fs-reply-list","modules/feed-list/feed-list","../stream-common","assets/zclip/1.1.1/zclip","dialog","../stream-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("tabs"),g=a("util"),h=a("modules/fs-reply/fs-reply-list"),i=a("modules/feed-list/feed-list"),j=h.replyList,k=a("../stream-common");b.init=function(){var a,c=b.tplEl,h=b.tplName,l=$(".filter",c),m=$(".feed-tabs",c),n=$(".search-inp",c),o=$(".search-btn",c),p=function(a){var b=$(a),c=b.data("feedList");c&&c.loadKill()},q=function(a){0==a.get("activeIndex")?a.trigger("switched",0,-1):a.switchTo(0)},r=null;k.init(c,h),a=new f({element:m,triggers:$(".feed-main-item",m),panels:$(".feed-main-panel",m),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render(),a.on("switched",function(a){var b,c,e,g=this.get("panels").eq(a),h=$(".feed-list",g),k=$(".depw-menu-aon",l).attr("feedtype"),m=$(".feed-reply-list",g),s=$(".feed-list-pagination",g),t=$(".feed-sub-list",g),u=$(".feed-sub-reply-list",g),v=g.attr("feedtype"),w=g.attr("feedname");"followreply"==k?(t.length>0?(m=$(".feed-reply-list",u),s=$(".feed-list-pagination",u),u.show(),t.hide()):(h.hide(),m.show()),e=g.data("feedReplayList"),e?e.reload():(e=new j({element:m,pagSelector:s,pagOpts:{pageSize:45,visiblePageNums:7},listPath:"/feed/getFeedReplysOfIFollowed",defaultRequestData:function(){return{feedType:v,keyword:_.str.trim(n.val())}},searchOpts:{inputSelector:n,btnSelector:o},replyCb:d.EMPTY_FN}),e.load(),g.data("feedReplayList",e)),r=e):"0"==v||"1"==v||"9998"==v?(c=g.data("feedList"),h.show(),m.hide(),c?c.reload():(c=new i({element:h,pagSelector:s,pagOpts:{pageSize:45,visiblePageNums:7},loadSize:15,listPath:"/feed/getFeedFollows",withFollowTime:!0,defaultRequestData:function(){return{subType:0,feedType:v,keyword:_.str.trim(n.val())}},itemReadyCb:function(){var a=this.$el;$(".aj-attention",a).addClass("aj-unattention myatt").removeClass("aj-attention").text("取消关注")},searchOpts:{inputSelector:n,btnSelector:o}}),c.load(),g.data("feedList",c)),r=c):(u.hide(),t.show(),b=t.data("subTabs"),t.data("rendered")?q(b):(b=new f({element:t,triggers:$(".feed-"+w+"-item",t),panels:$(".feed-"+w+"-panel",t),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click",withTabEffect:!1}).render().on("switched",function(a){var b=this.get("panels").eq(a),c=$(".feed-list",b),d=$(".feed-list-pagination",b),e=b.attr("subtype"),f=b.data("feedList");f?f.reload():(f=new i({element:c,pagSelector:d,pagOpts:{pageSize:45,totalSize:0,visiblePageNums:7},loadSize:15,listPath:"/feed/getFeedFollows",withFollowTime:!0,defaultRequestData:function(){return{subType:e,feedType:v,keyword:_.str.trim(n.val())}},searchOpts:{inputSelector:n,btnSelector:o}}),f.load(),b.data("feedList",f)),r=f}).on("switch",function(a,b){p(this.get("panels").eq(b))}),b.trigger("switched",0,-1),t.data("rendered",!0),t.data("subTabs",b)))}).on("switch",function(a,b){p(this.get("panels").eq(b))}),o.click(function(a){r.reload(),a.preventDefault()}),e.event.on("switched",function(b){var c,d,e=$(".filter-field",l);e.removeClass("depw-menu-aon"),"stream-followedfeeds"==b?(c=g.getTplQueryParams(),d=c?c.type:"","followed"==d?e.eq(1).addClass("depw-menu-aon"):e.eq(0).addClass("depw-menu-aon"),q(a)):r&&r.loadKill&&r.loadKill()}),l.on("click",".filter-field",function(b){var c=$(this);$(".filter-field",l).removeClass("depw-menu-aon"),c.addClass("depw-menu-aon"),q(a),$(".ui-tab-trigger-bg",m).width("26px"),b.preventDefault()})}});