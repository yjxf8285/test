/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/approve/atmeapproves/atmeapproves",["util","tabs","modules/feed-list/feed-list","../approve-common","moment","dialog","modules/publish/publish","../approve-common.css","../approve-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=(e.store,e.event),g=(a("util"),a("tabs")),h=a("modules/feed-list/feed-list"),i=a("../approve-common");b.init=function(){var a,c=b.tplEl,d=b.tplName,e=$(".feed-tabs",c),j=$(".search-inp",c),k=$(".search-btn",c);i.init(c,d);var l=function(a){var b=$(a),c=b.data("feedList");c&&c.loadKill()},m=function(a){0==a.get("activeIndex")?a.trigger("switched",0,-1):a.switchTo(0)},n=null;a=new g({element:e,triggers:$(".ui-tab-item",e),panels:$(".ui-tab-panel",e),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render(),a.on("switched",function(a){var b=this.get("panels").eq(a),c=$(".feed-list",b),d=$(".feed-list-pagination",b),e=b.data("feedList"),f=b.attr("approvestatus");e?e.reload():(e=new h({element:c,pagSelector:d,pagOpts:{pageSize:10,visiblePageNums:7},listPath:"/feed/getFeedsOfAtMe",defaultRequestData:function(){return{subType:f,feedType:4,keyword:_.str.trim(j.val())}},searchOpts:{inputSelector:j,btnSelector:k}}),e.load(),b.data("feedList",e)),n=e}).on("switch",function(a,b){l(this.get("panels").eq(b))}),k.click(function(a){n.reload(),a.preventDefault()});var o=function(){var b=a.get("panels");b.each(function(){var a=$(this),b=a.data("feedList");b&&b.destroy(),a.removeData()})};f.one("beforeremove",function(a){a==d&&o()}),m(a)}});