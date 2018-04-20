/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-select-customer/crm-select-customer",["dialog","util","uilibs/pagination2","modules/crm-select-customer/crm-select-customer.html"],function(a,b,c){var d=a("dialog"),e=a("util"),f=a("uilibs/pagination2"),g=a("modules/crm-select-customer/crm-select-customer.html"),h=d.extend({attrs:{title:"选择客户",url:"/FCustomer/GetFCustomers/",content:g,closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",width:800,height:600,condition:{},needToRest:!1,defaultCondition:{employeeID:2,isFirstChar:!1,listTagOptionID:"",sortType:2,queryType:2,keyword:"",pageSize:12,pageNumber:1},result:[]},setup:function(){var a=h.superclass.setup.apply(this,arguments),b=e.deepClone(this.get("defaultCondition"));return this.set("condition",b),a},render:function(){var a=h.superclass.render.apply(this,arguments);return this._initOthers(),a},hide:function(){var a=h.superclass.hide.apply(this,arguments);return this.reset(),a},show:function(a){var b=h.superclass.show.apply(this,arguments),c=this.get("condition");return a&&(c.keyword=a,$(".crm-select-customer-search-input",this.element).val(a),this.set("condition",c)),this._getData(c),b},reset:function(){$(".crm-select-customer-search-input",this.element).val("");var a=e.deepClone(this.get("defaultCondition"));this.set("condition",a)},events:{"click .crm-select-customer-search-button":"_onButtonClick","click .crm-select-customer-clean-keywords":"_cleanKeywords","keydown .crm-select-customer-search-input":"_onButtonKeydown","click .crm-select-customer-colleague":"_onColleageClick","mouseover .crm-select-customer-colleague":"_onColleageMouseOver","mouseout .crm-select-customer-colleague":"_onColleageMouseOut","click .crm-select-customer-button-cancel":"_cancel"},_initOthers:function(){this.get("title")&&$(".crm-select-customer-title").text(this.get("title"));var a=this;a.pagination=new f({element:$(".crm-select-customer-result-pagination",a.element),pageSize:a.get("condition").pageSize,totalSize:0,activePageNumber:1}),a.pagination.on("page",function(b){var c=a.get("condition");c.pageNumber=b,a.set("condition",c),a._getData(c)})},_getData:function(a){var b=this;e.api({url:this.get("url"),type:"get",dataType:"json",data:a,success:function(a){a.success&&b._getColleagueHtml(a.value.customers,a.value.totalCount)}},{mask:b.element,maskCls:"self-cls"})},_cleanKeywords:function(){var a=this.get("condition");a.keyword="",$(".crm-select-customer-search-input",this.element).val(""),this.set("condition",a),this._getData(a)},_getColleagueHtml:function(a,b){var c="",d=this;return 1>b?($(".crm-select-customer-no-result",this.element).show(),$(".crm-select-customer-result-container",this.element).hide()):($(".crm-select-customer-no-result",this.element).hide(),$(".crm-select-customer-result-container",this.element).show()),a?(b>=0&&this.pagination.setTotalSize(b),$(".crm-select-customer-result-container",this.element).empty(),_.each(a,function(a){var b=d.get("result"),e=_.find(b,function(b){return b.customerID==a.customerID});c+=e?"<div class = 'crm-select-customer-colleague crm-select-customer-colleague-selected fn-left fn-clear' data-value = '"+a.customerID+"' data-name ='"+a.name+"'>":"<div class = 'crm-select-customer-colleague fn-left fn-clear' data-value = '"+a.customerID+"' data-name ='"+a.name+"'>",c+="<div class = 'crm-select-customer-name fn-text-overflow' title = '"+a.name+"'>"+a.name+"</div>",c+="<div class = 'crm-select-customer-owner fn-text-overflow' title = '"+a.ownerName+"'>归属人："+a.ownerName+"</div></div>"}),$(".crm-select-customer-result-container",this.element).html(c),void 0):c},_showSelected:function(){this.get("needToRest")||(this.set("needToRest",!0),$(".crm-select-customer-search-box",this.element).css("width",$(".crm-select-customer-search-box",this.element).width()-103),$(".crm-select-customer-search-input",this.element).css("width",$(".crm-select-customer-search-input",this.element).width()-103),$(".crm-select-customer-unselect-all",this.element).show(),$(".crm-select-customer-result-box",this.element).hide(),$(".crm-select-customer-result-selected-box",this.element).show())},_toSelecting:function(){this.get("needToRest")&&(this.set("needToRest",!1),$(".crm-select-customer-search-box",this.element).css("width",$(".crm-select-customer-search-box",this.element).width()+103),$(".crm-select-customer-search-input",this.element).css("width",$(".crm-select-customer-search-input",this.element).width()+103),$(".crm-select-customer-unselect-all",this.element).hide(),$(".crm-select-customer-result-selected-box",this.element).hide(),$(".crm-select-customer-result-box",this.element).show())},_onButtonClick:function(){var a=this.get("condition");a.keyword=$(".crm-select-customer-search-input",this.element).val(),this.set("condition",a),this._getData(a)},_onButtonKeydown:function(a){if(a){var b=a.which;13==b&&(a.preventDefault(),this._onButtonClick())}},_onColleageClick:function(a){this.trigger("selected",{customerID:$(a.currentTarget).attr("data-value"),name:$(a.currentTarget).attr("data-name")}),this.hide()},_onColleageMouseOver:function(a){!$(a.currentTarget).hasClass("crm-select-customer-colleague-active")&&$(a.currentTarget).hasClass("crm-select-customer-colleague")&&$(a.currentTarget).addClass("crm-select-customer-colleague-active")},_onColleageMouseOut:function(a){$(a.currentTarget).hasClass("crm-select-customer-colleague-active")&&$(a.currentTarget).removeClass("crm-select-customer-colleague-active")},_cancel:function(){this.hide()},destroy:function(){var a;return a=f.superclass.destroy.apply(this,arguments),this.reset(),a}});c.exports=h});