/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/department/department",["util","moment","modules/feed-list/feed-list","../stream/stream-common","dialog","../stream/stream-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=a("util"),h=(a("moment"),a("modules/feed-list/feed-list")),i=a("../stream/stream-common"),j=i.InviteColleague;b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".search-inp",a),e=$(".search-btn",a);i.init(a,c);var k,l=g.getTplQueryParams(),m=$(".feed-list",a),n=$(".feed-list-pagination",a),o=$(".plan-status-type",a),p=$(".info-type-wrapper",a);$(".tpl-c .depw-title",a).text(l?decodeURIComponent(l.ctitle):"");var q=function(a){"send"==a?($(".plan-status",o).removeClass("depw-tabs-aon").eq(0).addClass("depw-tabs-aon"),$(".share-wrapper,.plan-wrapper,.approve-wrapper,.work-wrapper",o).hide(),$(".include-file",o).removeClass("depw-tabs-aon").eq(0).addClass("depw-tabs-aon")):($(".plan-status",o).removeClass("depw-tabs-aon").eq(0).addClass("depw-tabs-aon"),$(".share-wrapper,.plan-wrapper,.approve-wrapper,.work-wrapper,.include-file-wrap",o).hide())};k=new h({element:m,pagSelector:n,pagOpts:{pageSize:45,visiblePageNums:7},loadSize:15,withFeedRemind:!0,withLazyload:!0,listPath:"/feed/getFeedsFromCircleSend",defaultRequestData:function(){var b=$(".subtype-wrapper",o).filter(":visible");return{circleID:l?l.cid:0,subType:$(".depw-tabs-aon",b).attr("subtype")||0,feedAttachType:$(".include-file-wrap .depw-tabs-aon",a).attr("attachtype"),feedType:$(".plan-status-wrap .depw-tabs-aon",a).attr("feedtype"),keyword:_.str.trim(d.val())}},listSuccessCb:function(){var a=parseInt(g.getTplStore("stream","maxFeedId")||0);k.lastMaxId>a&&g.setTplStore("stream",{maxFeedId:k.lastMaxId})},searchOpts:{inputSelector:d,btnSelector:e}}),k.load(),o.on("click",".plan-status",function(a){var b=$(this);b.hasClass("plan-status")&&($(".subtype-wrapper",o).hide(),$(".subtype-wrapper,.include-file-wrap",o).each(function(){$(".depw-tabs-a",this).removeClass("depw-tabs-aon").eq(0).addClass("depw-tabs-aon")}),b.is("[feedname]")&&$("."+b.attr("feedname")+"-wrapper").show()),a.preventDefault()}).on("click",".depw-tabs-a",function(){var a=$(this),b=a.closest(".status-wrapper"),c=a.attr("infotype");$(".depw-tabs-a",b).removeClass("depw-tabs-aon"),a.addClass("depw-tabs-aon"),"send"==c?k.opts.listPath="/feed/getFeedsFromCircleSend":"received"==c&&(k.opts.listPath="/feed/getFeeds"),k.reload()}),p.on("click","a",function(b){var c=$(this),d=$(".include-file-wrap",a),e=c.attr("infotype");$("a",p).removeClass("depw-menu-aon"),c.addClass("depw-menu-aon"),q(e),"send"==e?(k.opts.listPath="/feed/getFeedsFromCircleSend",d.show()):(k.opts.listPath="/feed/getFeeds",d.hide()),k.resetSearch(),k.reload(),b.preventDefault()}),e.click(function(a){k.reload(),a.preventDefault()});var r,s,t,u=g.getContactData(),v=u.p,w=[],x=$(".right-img-wrap",a),y=$(".right-htitle-wrap",a),z="",A=l?parseInt(l.cid):0;r=g.getContactDataById(A,"g"),v=_.filter(v,function(a){return a.id!=u.u.id}),"999999"==A?(w=v,s=r.memberCount-1):(_.each(v,function(a){var b=a.groupIDs;_.contains(b,A)&&w.push(a)}),s=r.memberCount,_.some(u.u.groupIDs,function(a){return a==A})&&(s-=1)),t=r.name||u.u.allCompanyDefaultString,y.html('<span class="circle-name">'+t+"("+s+")"+'</span><span class="rt-apv right-yq-apv fn-hide"><a href="javascript:;" class="invite-apv fna-blue">邀请同事</a></span>'),w=w.slice(0,35),_.each(w,function(a){z+='<a href="#profile/=/empid-'+a.id+'" title="'+a.name+'"><img src="'+a.profileImage+'" /></a>'}),x.html(z),u.u.isAdmin?$(".right-yq-apv",y).show():$(".right-yq-apv",y).hide(),new j({trigger:$(".invite-apv",y)}).render(),"999999"!=A&&$(".view-all-employee-l",a).attr("href","#circles/allcolleague/=/id-"+A+"/name-"+encodeURIComponent(t)),f.one("beforeremove",function(a){a==c&&(k.destroy(),k=null)})}});