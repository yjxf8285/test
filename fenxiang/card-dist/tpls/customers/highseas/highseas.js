/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/customers/highseas/highseas",["util","modules/crm-list-header/crm-list-header","modules/crm-customer-highseas/crm-customer-highseas","modules/crm-subordinate-select/crm-subordinate-select","modules/crm-highsea-editsetting/crm-highsea-editsetting","modules/crm-high-seas/crm-high-seas","modules/crm-seaselect-follow/crm-seaselect-follow"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=a("util"),h=a("modules/crm-list-header/crm-list-header"),i=a("modules/crm-customer-highseas/crm-customer-highseas"),j=a("modules/crm-subordinate-select/crm-subordinate-select"),k=a("modules/crm-highsea-editsetting/crm-highsea-editsetting"),l=a("modules/crm-high-seas/crm-high-seas"),m=a("modules/crm-seaselect-follow/crm-seaselect-follow");b.init=function(){var a=b.tplEl,c=$(".crm-tpl-l .tpl-inner",a);tplName=b.tplName;var d=null,n=null,o=null,p={highSeasID:0,employeeID:-1,keyword:"",pageSize:15,pageNumber:0},q=$(".crm-crmsettings-filterinfo",a),r=null,s=null,t=null,u=null,v=0,w=!1;f.on("switched",function(a){var b;a==tplName&&(b=g.getTplQueryParams2(),b&&(p.highSeasID=b.id,v=b.id,d&&d.refresh(p),n&&n.setTitle(b.name)))});var x=function(){n||(n=new h({element:$(".high-seas-header",a),title:"",searchPlaceholder:"搜索客户、客户编号"}),n.on("search",function(a){d.refresh({keyword:a})}))},y=function(){d||(d=new i({element:$(".high-seas-list",a),condition:p,isMyHighSeas:!0,url:"/HighSeas/GetMyCustomerHighSeas"}),d.on("select",function(){w&&($(".crm-highseas-select-show",a).show(),$(".crm-highseas-unselect-show",a).hide())}),d.on("unselect",function(){w&&($(".crm-highseas-unselect-show",a).show(),$(".crm-highseas-select-show",a).hide())}),d.on("rowClick",function(a){var b=window.location.href.split("#")[1];b=b.split("/=/")[0];var c={id:a};c=_.extend({},g.getTplQueryParams2(),c),c.returnUrl=b+"/=/param-"+encodeURIComponent(JSON.stringify(c)),e.event.one("dataUpdate",function(){d.refresh()}),e.navRouter.navigate("#customers/showcustomer/=/param-"+encodeURIComponent(JSON.stringify(c)),{trigger:!0})}),d.on("isAdmin",function(b){w=b,b?($(".td-checkbox-warp",a).show(),$(".crm-highseas-unselect-show",a).show()):($(".td-checkbox-warp",a).hide(),$(".crm-highseas-unselect-show",a).hide(),$(".crm-highseas-select-show",a).hide())}),d.on("refreshed",function(a){n&&n.setCount(a)}))},z=function(){t||(t=new m,t.on("selected",function(a){var b=d.getSelectItems();g.confirm("是否将选中的"+b.length+"个客户的跟进人设置为"+a.name+"？","",function(){g.api({url:"/HighSeas/AllocateCustomersForManager",type:"post",dataType:"json",data:{employeeID:a.employeeID,customerIDs:b.join(",")},success:function(a){if(a.success){var b=a.value.result,c=0,e=0;_.each(b,function(a){a.value1?c++:e++}),g.alert("本次调整有"+c+"个成功，"+e+"个失败"),d.refresh(p)}}})})}))},A=function(){u||(u=new k,u.on("modifySuccess",function(a){o.refresh(),e.navRouter.navigate("#customers/highseas/=/param-"+encodeURIComponent(JSON.stringify(a)),{trigger:!0})}),u.on("deleteSuccess",function(){o.refresh(),e.navRouter.navigate("#customers/home",{trigger:!0})}))},B=function(){s||(s=new m({title:"选择员工"}),s.on("selected",function(a){p.employeeID=a.employeeID,q.find("span").text(a.name),q.show(),d.refresh(p)}))},C=function(){if(!r){var b=g.getCrmData().currentEmp;r=new j({element:$(".customers-img-wrap",a),employeeName:b.name,imageSrc:g.getAvatarLink(b.profileImage,"2"),canSelect:!1})}},D=function(){o||(o=new l({api:"/HighSeas/GetMyHighSeas",navClass:".crm-high-sea-mine",canCreate:!1,url:"#customers/highseas/"}))},E=function(){$(".crm-set-owner",a).on("click",function(){t.show(d.get("highSeasPermissions"))}),$(".crm-cancel-owner",a).on("click",function(){var a=d.getSelectItems();g.confirm("是否要取消选中的"+a.length+"个客户的跟进人？","",function(){g.api({url:"/HighSeas/TakeBackCustomersForManager",type:"post",dataType:"json",data:{customerIDs:a.join(",")},success:function(a){a.success&&d.refresh(p)}})})}),$(".crm-highsea-edit",a).on("click",function(){u.show(v)}),$(".crm-filter-by-employee",a).on("click",function(){s.show(d.get("highSeasPermissions"))}),q.find("a").on("click",function(){p.employeeID=-1,d.refresh(p),q.hide()}),c.on("click",".crm-high-sea-mine",function(a){o.show(a),a.preventDefault(),a.stopPropagation()})};!function(){x(),y(),B(),C(),D(),z(),A(),E()}()}});