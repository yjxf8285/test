/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/profile/profilelocations/profilelocations",["util","moment","modules/fs-map/fs-map-list","modules/publish/publish","modules/fs-map/fs-map"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=(e.store,e.event),g=a("util"),h=a("moment"),i=a("modules/fs-map/fs-map-list"),j=a("modules/publish/publish"),k=a("modules/fs-map/fs-map"),l=j.dateSelect,m=k.FsMap;b.init=function(){var a=b.tplEl,d=b.tplName,e=$(".tpl-l",a),j=$(".location-list-wrapper",e),k=$(".location-list",e),n=$(".location-list-pagination",e),o=$(".avatar-wrapper",e),p=$(".employee-name",e),q=$(".location-info .num",e),r=$(".start-date",e),s=$(".end-date",e),t=$(".map-wrapper",a),u=$(".query-btn",e),v=$(".clear-btn-map",e),w=new l({element:r,placeholder:"选择日期"}),x=new l({element:s,placeholder:"选择日期"}),y=function(a){var b="";return"中国"!=a.country&&(b+=a.country),a.province!=a.city&&(b+=a.province),_.each([a.city,a.district,a.street,a.streetNumber],function(a){a.length>0&&(b+=a)}),b},z=new m({element:t,autoOpenTip:!1,tipTpl:function(a){var b=y(a);return'<h3 style="margin-bottom: 30px;">'+b+'</h3><p style="color:#999999;width:230px;" class="fn-clear">'+g.getDateSummaryDesc(h.unix(a.createTime),new Date,2)+'<a href="#" onclick="showDescDialog('+a.feedID+');return false;" style="float:right;color:#0082CB;">详情</a></p>'}});z.on("mapinit",function(a){a.showDescDialog=function(a){$(".map-showdetail",k).filter('[feedid="'+a+'"]').click()}});var A,B=new i({element:k,pagSelector:n,listPath:"/Location/GetLocationInfosByIDAndTimeRange",pagOpts:{pageSize:10,visiblePageNums:5,style:"simple"},defaultRequestData:function(){var a=g.getTplQueryParams(),b=a?a.id:"",c=w.getValue(!0),d=x.getValue(!0);return{employeeID:b,startTime:c?c.unix():0,endTime:d?d.add("days",1).subtract("seconds",1).unix():0}},listCb:function(a){var b,c;a.success&&(b=a.value,c=b.employeeInfo,o.html('<img src="'+g.getAvatarLink(c.profileImage,2)+'" alt="'+c.name+'" />'),p.text(c.name),q.text(b.totalCount),z.setLocation(b.locations))},selectCb:function(a){var b=z.pointers;_.some(b,function(b){var c=b.data;return c.feedID==a.feedID?(z.AMap.event.trigger(b.pointer,"click"),!0):void 0})},listEmptyText:"没有签到信息"});$(c).resize(function(){t.is(":visible")&&(clearTimeout(A),A=setTimeout(function(){var a=t.offset(),b=j.offset(),d=$(c).height(),e=d-a.top,f=d-b.top-20;j.height(f>0?f:0),t.height(e>0?e:0),z.adjustSize()},300))}),u.click(function(){B.reload()}),v.click(function(){w.clear(),x.clear(),B.reload()});var C=$("#sub-tpl"),D=C.width();f.on("switched",function(a){a==d?(C.css("width","100%"),g.setFullScreen(!0),$(".right-qq-apv").hide(),v.click()):(C.width(D),g.setFullScreen(!1),$(".right-qq-apv").show())})}});