/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-customer-list-all/crm-customer-list-all",["modules/crm-customer-list-all/crm-customer-list-all.html","widget","util","datatable","moment","uilibs/pagination2","modules/crm-customerinsetting-edit/crm-customerinsetting-edit","modules/crm-customer-merge/crm-customer-merge"],function(a,b,c){var d=window,e=d.FS,f=e.tpl;f.store,f.list;var f=a("modules/crm-customer-list-all/crm-customer-list-all.html"),g=a("widget"),h=a("util");a("datatable"),a("moment");var i=a("uilibs/pagination2"),j=a("modules/crm-customerinsetting-edit/crm-customerinsetting-edit"),k=a("modules/crm-customer-merge/crm-customer-merge"),l=g.extend({attrs:{element:null,aoColumns:[{mData:"name",sWidth:"200px",sClass:"black-name crmtable-sort-name",bSortable:!0,mRender:function(a){var b='<span title="'+a+'">'+a+"</span>";return b}},{mData:"fCustomerNo",sWidth:"50px",sClass:"black-name crmtable-sort-name",bSortable:!0,mRender:function(a){var b='<span title="'+a+'">'+a+"</span>";return b}},{mData:"highSeasID",sWidth:"200px",sClass:"black-name",bSortable:!1,mRender:function(a,b,c){var d="";return a>0&&(d='<span title="'+c.highSeasName+'">'+c.highSeasName+"</span>"),d}},{mData:"highSeasID",sWidth:"100px",sClass:"black-name",bSortable:!1,mRender:function(a,b,c){var d="";return a>0&&(d='<span title="'+c.ownerName+'">'+c.ownerName+"</span>"),d}},{mData:"highSeasID",sWidth:"100px",sClass:"black-name",bSortable:!1,mRender:function(a,b,c){var d="";return 0==a&&(d='<span title="'+c.ownerName+'">'+c.ownerName+"</span>"),d}},{mData:"createTime",sClass:"th-operate",bSortable:!1,mRender:function(a,b,c){var d="";return h.getCrmData().isAllowDangerOperate&&(d='<a data-id="'+c.customerID+'" data-name="'+c.name+'" class="btn-merge" href="#" onclick="return false;">合并客户</a>'),d}}],condition:{highSeasID:0,employeeID:-1,keyword:"",sortType:1,pageSize:15,pageNumber:0},oTable:null,firstLoad:!0,editDialog:null,highSeasPermissions:[],isMyHighSeas:!1,isHighSeaAdmin:!1,url:"/FCustomer/GetAllFCustomers"},events:{"click .crm-datatable th":"_crmTableSort"},setup:function(){var a=l.superclass.render.apply(this,arguments);return this._init(),a},_init:function(){this.element.html(f),this._initDataTabel(),this._initComponent(),this._initCustomerInSettingDialog()},_crmTableSort:function(a){var b=this,c=$(a.target).css("cursor");"col-resize"!=c&&h.crmTableSortSet({element:$(".sort-select-list",this.$el),meEl:$(a.currentTarget),oThs:[{clasName:".crmtable-sort-name",sortType:[2,4]}],callback:function(a){b.refresh(a)}})},_initComponent:function(){var a=this.element,b=this,c=$(".pagination-wrapper",a),d=$(".sort-select-list",a);h.mnEvent(d,"change",function(a){h.mnSelect(d,"removeOption",2),b.get("oTable").fnSort([]),b.refresh({sortType:a})}),this.pagination=new i({element:c,pageSize:15,totalSize:0,activePageNumber:1}),h.getCrmData().isAllowDangerOperate&&$(".th-operate",a).html("操作"),this.pagination.on("page",function(a){var c=b.get("condition");c.pageNumber=a,b.set("condition",c),b.refresh(c)}),a.on("click",".crm-datatable tbody tr td",function(){if(!$(this).hasClass("td-checkbox-warp")&&!$(this).hasClass("th-operate")){var a=$(this).closest("tr"),c=b.get("oTable").fnGetData(a.get(0)),d=c.customerID;b.get("editDialog").show({customerID:d})}}),this.customerMerge=new k,this.customerMerge.on("success",function(){b.refresh()}),a.on("click",".btn-merge",function(){var a=$(this),c=a.attr("data-id"),d=a.attr("data-name");b.customerMerge.show({customerID:c,customerName:d})})},refresh:function(a){this.set("firstLoad",!1),a&&(a=_.extend(this.get("condition"),a),this.set("condition",a)),this.get("oTable").fnReloadAjax()},_initDataTabel:function(){var a=this,b=$(".crm-table-bd .crm-datatable",this.element),c=b.dataTable({sDom:"Rlfrtip",aoColumns:a.get("aoColumns"),sAjaxSource:a.get("url"),fnServerData:function(b,c,d,e){if(!a.get("firstLoad")){var f=a.get("condition");e.jqXHR=h.api({dataType:"json",type:"get",url:b,data:f,beforeSend:function(){h.showGlobalLoading(1)},success:function(b){d(a._formatTableData(b)),h.hideGlobalLoading(1);var c=b.value.totalCount;a.pagination.setTotalSize(c),a.trigger("refreshed",c)}})}},bAutoWidth:!1,bFilter:!1,bPaginate:!1,bInfo:!1,oLanguage:{sEmptyTable:'<span class="empty-tip">该条件下，没有客户</span>'}});c.fnSort([]),this.set("oTable",c)},_initCustomerInSettingDialog:function(){var a=this,b=new j;b.on("success",function(){a.refresh(a.get("condition"))}),this.set("editDialog",b)},_formatTableData:function(a){return{aaData:a.value.customers}},destroy:function(){var a=l.superclass.destroy.apply(this,arguments);return this.element.empty(),a}});c.exports=l});