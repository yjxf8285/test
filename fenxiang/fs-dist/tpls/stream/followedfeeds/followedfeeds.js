/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/stream/followedfeeds/followedfeeds",["tabs","util","modules/feed-list/feed-list","../stream-common","dialog","../stream-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("tabs"),g=(a("util"),a("modules/feed-list/feed-list")),h=a("../stream-common");b.init=function(){var a,c=b.tplEl,d=b.tplName,i=$(".feed-tabs",c),j=$(".search-inp",c),k=$(".search-btn",c),l=function(a){var b=$(a),c=b.data("feedList");c&&c.loadKill()},m=function(a){0==a.get("activeIndex")?a.trigger("switched",0,-1):a.switchTo(0)},n=null;h.init(c,d),a=new f({element:i,triggers:$(".feed-main-item",i),panels:$(".feed-main-panel",i),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render(),a.on("switched",function(a){var b,c,d,e=this.get("panels").eq(a),h=$(".feed-list",e),i=$(".feed-list-pagination",e),o=e.attr("feedtype"),p=e.attr("feedname");"0"==o||"1"==o?(d=e.data("feedList"),d?d.reload():(d=new g({element:h,pagSelector:i,pagOpts:{pageSize:45,visiblePageNums:7},loadSize:15,listPath:"/feed/getFeedFollows",withFollowTime:!0,defaultRequestData:function(){return{subType:0,feedType:o,keyword:_.str.trim(j.val())}},itemReadyCb:function(){var a=this.$el;$(".aj-attention",a).addClass("aj-unattention myatt").removeClass("aj-attention").text("取消关注")},searchOpts:{inputSelector:j,btnSelector:k}}),d.load(),e.data("feedList",d)),n=d):(b=$(".feed-sub-list",e),c=b.data("subTabs"),b.data("rendered")?m(c):(c=new f({element:b,triggers:$(".feed-"+p+"-item",b),panels:$(".feed-"+p+"-panel",b),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click",withTabEffect:!1}).render().on("switched",function(a){var b=this.get("panels").eq(a),c=$(".feed-list",b),d=$(".feed-list-pagination",b),e=b.attr("subtype"),f=b.data("feedList");f?f.reload():(f=new g({element:c,pagSelector:d,pagOpts:{pageSize:45,totalSize:0,visiblePageNums:7},loadSize:15,listPath:"/feed/getFeedFollows",withFollowTime:!0,defaultRequestData:function(){return{subType:e,feedType:o,keyword:_.str.trim(j.val())}},searchOpts:{inputSelector:j,btnSelector:k}}),f.load(),b.data("feedList",f)),n=f}).on("switch",function(a,b){l(this.get("panels").eq(b))}),c.trigger("switched",0,-1),b.data("rendered",!0),b.data("subTabs",c)))}).on("switch",function(a,b){l(this.get("panels").eq(b))}),k.click(function(a){n.reload(),a.preventDefault()}),e.event.on("switched",function(b){"stream-followedfeeds"==b?m(a):n&&n.loadKill()})}});