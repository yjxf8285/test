/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/announcements/announcements",["util","dialog","modules/fs-announcement/fs-announcement","modules/feed-list/feed-list"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=a("util"),h=(a("dialog"),a("modules/fs-announcement/fs-announcement")),i=a("modules/feed-list/feed-list"),j=g.getContactData(),k=j.u,l=h.NewNoticeDialog;b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".announcements-list",a),e=$(".announcements-list-pagination",a);$(".sort-date",a);var g=$(".search-inp",a),h=$(".search-btn",a),j=new i({element:d,pagSelector:e,pagOpts:{pageSize:45,visiblePageNums:7},loadSize:15,noticeStyle:2,listPath:"/FeedAnnounce/GetFeedAnnounces",listEmptyText:"没有搜索到公告信息",defaultRequestData:function(){return{keyword:_.str.trim(g.val())}},searchOpts:{inputSelector:g,btnSelector:h}});_.some(k.functionPermissions,function(a){return 1==a.value})&&($("#btn-new-create",a).show(),new l({trigger:$("#btn-new-create",a),successCb:function(a){a.success&&(j.reload(),this.hide())}})),h.click(function(a){j.reload(),a.preventDefault()}),f.on("switched",function(a){a==c?j.reload():j&&j.loadKill()});var m=$(".head-img-wrap",a),n=$(".head-img-wrap-tpl",m).html(),o=_.template(n),p=o({userName:k.name,profileImage:k.profileImage});m.html(p)}});