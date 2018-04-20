/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/allcustomers/allcustomers",["util","../settings-common","dialog","../settings-common.html","../settings-common.css","modules/crm-list-header/crm-list-header","modules/crm-customer-list/crm-customer-list"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event,a("util");var f=a("../settings-common"),g=a("modules/crm-list-header/crm-list-header"),h=a("modules/crm-customer-list/crm-customer-list");b.init=function(){var a,c,d=b.tplEl,e=b.tplName;$(".top-fn-btns",d).hide(),f.createCrmSettingLeftNav(d,e),c=new g({element:$(".crm-list-hd",d),title:"全部客户",searchPlaceholder:"搜索客户"}),c.on("search",function(b){a.refresh({keyword:b})}),a=new h({warpEl:$(".list-warp",d),url:"/FCustomer/GetAllFCustomers"}),a.load(),a.refresh({employeeID:-1,keyword:"",isFirstChar:!1,sortType:0,pageNumber:1,pageSize:25,queryType:1})}});