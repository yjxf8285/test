/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/attach/sentimages/sentimages",["util","tabs","modules/fs-attach/fs-attach-list","../attach-common","moment","../attach-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=(a("util"),a("tabs")),h=a("modules/fs-attach/fs-attach-list"),i=a("../attach-common");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".img-tabs",a),e=$(".search-inp",a),j=$(".search-btn",a);i.init(a,c);var k=function(a){0==a.get("activeIndex")?a.trigger("switched",0,-1):a.switchTo(0)},l=null,m=new g({element:d,triggers:$(".ui-tab-item",d),panels:$(".ui-tab-panel",d),activeIndex:0,activeTriggerClass:"ui-tab-item-current",triggerType:"click"}).render();m.on("switched",function(a){var b=this.get("panels").eq(a),c=$(".img-list",b),d=$(".img-list-pagination",b),f=b.data("imgList"),g=b.attr("feedtype");f?f.reload():(f=new h({element:c,pagSelector:d,pagOpts:{pageSize:18,visiblePageNums:7},attachType:"img",listPath:"/attach/getAttachFilesOfISend",loadSize:15,defaultRequestData:function(){return{attachType:2,feedType:g,keyword:_.str.trim(e.val())}},searchOpts:{inputSelector:e,btnSelector:j}}),f.load(),b.data("imgList",f)),l=f}),j.click(function(a){l.reload(),a.preventDefault()});var n=function(){var a=m.get("panels");a.each(function(){var a=$(this),b=a.data("imgList");b&&b.destroy(),a.removeData()})};f.one("beforeremove",function(a){a==c&&n()}),k(m)}});