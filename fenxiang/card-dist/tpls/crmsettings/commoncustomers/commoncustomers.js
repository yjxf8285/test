/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/crmsettings/commoncustomers/commoncustomers",["util","../settings-common","dialog","modules/crm-high-seas/crm-high-seas","../settings-common.html","../settings-common.css","modules/crm-list-header/crm-list-header","modules/crm-setting-customerlist/crm-setting-customerlist","modules/crm-object-import/crm-object-import","modules/crm-customer-export/crm-customer-export","modules/crm-select-colleague/crm-select-colleague","modules/crm-select-highseas/crm-select-highseas","modules/crm-customerinsetting-edit/crm-customerinsetting-edit","moment"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=a("../settings-common"),h=a("modules/crm-list-header/crm-list-header"),i=a("modules/crm-setting-customerlist/crm-setting-customerlist"),j=a("modules/crm-object-import/crm-object-import"),k=a("modules/crm-customer-export/crm-customer-export"),l=a("modules/crm-select-colleague/crm-select-colleague"),m=a("modules/crm-select-highseas/crm-select-highseas"),n=a("modules/crm-customerinsetting-edit/crm-customerinsetting-edit"),o=a("moment");b.init=function(){var a,c,d=b.tplEl,e=b.tplName,p=$(".crm-crmsettings-commoncustomers-filterinfo",d),q=null,r=null,s=null,t=null,u=null,v=null,w={employeeID:-1,keyword:"",sortType:1,pageNumber:1,pageSize:25};g.createCrmSettingLeftNav(d,e);var x=function(){c=new h({element:$(".crm-list-hd",d),title:"已归属客户",searchPlaceholder:"搜索客户"}),c.on("search",function(b){a.refresh({keyword:b})})},y=function(){a=new i({warpEl:$(".list-warp",d),url:"/HighSeas/GetFCustomersCommonForManager",hasButtons:!1,overwriteRowClick:!0,aoColumns:[{mData:"customerID",sWidth:"26px",sClass:"td-checkbox-warp",bSortable:!1,mRender:function(a){var b='<div class="mn-checkbox-box checkbox-for-comtable crm-datatable-checkboxinput">&nbsp;&nbsp;<span data-value="'+a+'" class="mn-checkbox-item"></span> </div>';return b}},{mData:"customerID",sWidth:"0px",sClass:"customer-foolo",bSortable:!1,mRender:function(){return""}},{mData:"name",sWidth:"160px",sClass:"black-name crmtable-sort-name",bSortable:!1,mRender:function(a){var b='<span title="'+a+'">'+a+"</span>";return b}},{mData:"ownerName",sWidth:"110px",sClass:"black-name crmtable-sort-ownername",bSortable:!1,mRender:function(a){var b='<span title="'+a+'">'+a+"</span>";return b}},{mData:"customerStateTagOption",sWidth:"170px",sClass:"crmtable-sort-customer-status",bSortable:!1,mRender:function(a){var b='<span title="'+a+'">'+a+"</span>";return b}},{mData:"lastUpdateTime",sWidth:"170px",sClass:"crmtable-sort-lastupdatetime",bSortable:!1,asSorting:["desc","asc"],mRender:function(a){var b='<span title="'+o.unix(a).format("YYYY-MM-DD HH:mm")+'">'+o.unix(a).format("YYYY-MM-DD HH:mm")+"</span>";return b}},{mData:"createTime",sWidth:"120px",sClass:"crmtable-sort-createtime",bSortable:!1,mRender:function(a){var b='<span title="'+o.unix(a).format("YYYY-MM-DD HH:mm")+'">'+o.unix(a).format("YYYY-MM-DD HH:mm")+"</span>";return b}},{mData:"createTime",sClass:"th-blank",bSortable:!1,mRender:function(){var a="";return a}}]});var b=$(".crm-setting-multyset",d),c=$(".crm-button-submit",d);a.refresh(w),a.on("rowClick",function(a){q.show({customerID:a})}),a.on("isSelected",function(){b.show(),c.hide()}),a.on("unSelected",function(){b.hide(),c.show()})},z=function(){q||(q=new n,q.on("success",function(){a.refresh(w)}))},A=function(){r||(r=new j({title:"客户导入",downloadApi:"GetFCustomerCommonExcelTemplate",importApi:"/HighSeas/ImportFCustomerCommon",downloadText:"归属人客户导入模板"}),r.on("uploaded",function(){a.refresh(listCondition)}))},B=function(){s||(s=new k({title:"已归属客户导出",hasBelongTo:!0,exportApi:"/HighSeas/ExportFCustomersCommonExcel"}))},C=function(){v=new l({isMultiSelect:!1,hasWorkLeaveBtn:!0,title:"选择归属人"}),v.on("selected",function(b){var c=a.getSelected(),d=c.length,e=b.employeeID,g=b.name,h="是否将选中的"+d+"个客户的归属人设置为"+g;f.confirm(h,"设置归属人",function(){f.api({url:"/FCustomer/ModifyFCustomerOwners",type:"post",dataType:"json",data:{customerIDs:c.join(","),ownerID:e},success:function(b){if(b.success){for(var c=0,d=0,e=b.value.ChangeOwnerResults,g=0;g<e.length;g++)1==e[g].value1?c+=1:d+=1;a.refresh(w),a.trigger("unSelected"),f.alert("本次调整有"+c+"个成功，"+d+"个失败")}}},{submitSelector:""})})})},D=function(){$(".crm-crmsettings-cummoncustomers-cancelbelong",d).on("click",function(){var b=a.getSelected();if(b.length<=0)f.alert("请勾选客户");else{var c="是否要取消选中的"+b.length+"个客户的归属人";f.confirm(c,"取消归属人",function(){f.api({url:"/FCustomer/ModifyFCustomerOwners",type:"post",dataType:"json",data:{customerIDs:b.join(","),ownerID:0},success:function(b){if(b.success){for(var c=0,d=0,e=b.value.ChangeOwnerResults,g=0;g<e.length;g++)1==e[g].value1?c+=1:d+=1;a.refresh(w),a.trigger("unSelected"),f.alert("本次调整有"+c+"个成功，"+d+"个失败")}}},{submitSelector:""})})}})},E=function(){u||(u=new m({title:"选择公海",url:"/HighSeas/GetAllHighSeas/",hasCreate:!0}),u.on("selected",function(b){var c=a.getSelected();f.confirm("是否将选中的"+c.length+"个客户移动到"+b.name+"？","",function(){f.api({url:"/HighSeas/MoveHighseasCustomersForManager",type:"post",dataType:"json",data:{targetHighSeasID:b.id,customerIDs:c.join(",")},success:function(b){if(b.success){for(var c=0,d=0,e=b.value.result,g=0;g<e.length;g++)1==e[g].value1?c+=1:d+=1;a.refresh(w),a.trigger("unSelected"),f.alert("本次调整有"+c+"个成功，"+d+"个失败")}}})})}),u.on("created",function(){g.refreshHighSeas()}))},F=function(){t||(t=new l({isMultiSelect:!1,hasWorkLeaveBtn:!0,title:"选择归属人"}),t.on("selected",function(b){w.employeeID=b.employeeID,p.find("span").text(b.name),p.show(),a.refresh(w)}))},G=function(){$(".customer-import",d).on("click",function(){r.show()}),$(".customer-export",d).on("click",function(){s.show()}),$(".crm-cummoncustomers-fliter",d).on("click",function(){t.show()}),$(".crm-cummoncustomers-setbelong",d).on("click",function(){v.show()}),$(".crm-cummoncustomers-mvSea",d).on("click",function(){u.show()}),p.find("a").on("click",function(){w.employeeID=-1,a.refresh(w),p.hide()})};!function(){x(),z(),A(),B(),C(),D(),E(),F(),y(),G()}()}});