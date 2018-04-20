/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/allcontacts/allcontacts",["util","../settings-common","dialog","../settings-common.html","../settings-common.css","modules/crm-list-header/crm-list-header","modules/crm-contact-list/crm-contact-list"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event,a("util");var f=a("../settings-common"),g=a("modules/crm-list-header/crm-list-header"),h=a("modules/crm-contact-list/crm-contact-list");b.init=function(){var a=b.tplEl,c=b.tplName,d=new h({data:{employeeID:0,keyword:"",isFirstChar:!1,isDeleted:-1,createCustomer:-1,sortType:0,isContainSubordinate:-1,pageSize:25,pageNumber:1},warpEl:$(".list-warp",a),url:"Contact/GetAllContacts"});d.load(),d.refresh(),$(".top-fn-btns",a).hide();var e=new g({element:$(".crm-list-hd",a),title:"全部联系人",searchPlaceholder:"搜索联系人"});e.on("search",function(a){d.refresh({keyword:a})}),f.createCrmSettingLeftNav(a,c)}});