/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/crm-salestarget-opportunity/crm-salestarget-opportunity",["util","widget","moment","modules/crm-salestarget-opportunity/crm-salestarget-opportunity.html","modules/crm-salestarget-export/crm-salestarget-export","uilibs/pagination2"],function(a,b,c){var d=window,e=d.FS,f=e.tpl;f.store,f.event;var g=a("util"),h=a("widget"),i=a("moment"),j=a("modules/crm-salestarget-opportunity/crm-salestarget-opportunity.html"),k=a("modules/crm-salestarget-export/crm-salestarget-export"),l=a("uilibs/pagination2"),m=h.extend({attrs:{element:null,condition:{fiscalYear:2014,salesForecastTimeRange:1,monthNo:0,cellType:0,salesStageNo:0,employeeID:2,containSubordinate:!0,pageSize:10,pageNumber:1},pagination:null,url:"",oppID:0},events:{"click .crm-salestarget-opportunity-tr":"_toDetail","click .crm-salestarget-button-export-oppo":"_showExport"},setup:function(){var a=m.superclass.render.apply(this,arguments);return this._init(),a},_init:function(){this.element.html(j),this._initPagination(),this._initExport()},_initExport:function(){this.salestargetExport=new k({type:2})},_showExport:function(){if(this.salestargetExport){var a=this.get("condition");this.salestargetExport.show({fiscalYear:a.fiscalYear,salesForecastTimeRange:a.salesForecastTimeRange,employeeID:a.employeeID,monthNo:a.monthNo,containSubordinate:a.containSubordinate})}},_initPagination:function(){var a=this,b=new l({element:$(".pagination-wrapper",this.element),pageSize:10,totalSize:0,activePageNumber:1});b.on("page",function(b){var c=a.get("condition");c.pageNumber=b,a.set("condition",c),a.refresh(a.get("url"),c)}),this.set("pagination",b)},_getData:function(a,b){var c=this;g.api({url:a,type:"get",dataType:"json",data:b,success:function(a){a.success&&(c.get("pagination").setTotalSize(a.value.totalCount),c._showData(a.value))}})},_showData:function(a){if(!a||a.salesOpportunitys.length<1)return $(".crm-salestarget-no-opportunity",this.element).show(),$(".crm-salestarget-opportunity-table",this.element).hide(),$(".crm-salestarget-opportunity-pagination",this.element).hide(),void 0;$(".crm-salestarget-no-opportunity",this.element).hide(),$(".crm-salestarget-opportunity-table",this.element).show(),$(".crm-salestarget-opportunity-pagination",this.element).show();var b="",c=this.get("oppID");_.each(a.salesOpportunitys,function(a){var d="";c==a.salesOpportunityID&&(d="row_selected"),b+="<tr data-salesOpportunityID = '"+a.salesOpportunityID+"' data-name ='"+a.name+"' class ='crm-salestarget-opportunity-tr "+d+"'><td><span class='crm-salestarget-opportunity-name fn-text-overflow' title = '"+a.name+"'>"+a.name+"</span></td>",b+="<td><span title = '"+a.owner.name+"'>"+a.owner.name+"</span></td>",b+="<td><span class = 'crm-salestarget-opportunity-customer-name fn-text-overflow' title = '"+a.customerName+"'>"+a.customerName+"</span></td>",b+="<td><span title = '"+a.typeTagOptionName+"'>"+a.typeTagOptionName+"</span></td>",b+="<td><span title = '"+_.str.numberFormat(parseFloat(a.expectedSalesAmount),2)+"'>"+_.str.numberFormat(parseFloat(a.expectedSalesAmount),2)+"</span></td>",b+="<td><span title = '"+i.unix(a.expectedDealTime).format("YYYY-MM-DD")+"'>"+i.unix(a.expectedDealTime).format("YYYY-MM-DD")+"</span></td>",b+="<td><span title = '"+a.salesStage.name+"'>"+a.salesStage.name+"</span></td>",b+="<td><span title = '"+a.salesStage.winRate+"%'>"+a.salesStage.winRate+"%</span></td>",b+="<td><span title = '"+a.sourceTagOptionName+"'>"+a.sourceTagOptionName+"</span></td></tr>"}),$(".crm-salestarget-opportunity-table-body",this.element).html(b)},refresh:function(a,b){this.set("url",a);var c=this.get("condition");b&&(c=_.extend(c,b),this.set("condition",c)),this._getData(a,c)},_toDetail:function(a){var b=this,c=$(a.currentTarget);if(c){$(".row_selected",this.element).removeClass("row_selected"),c.addClass("row_selected");var d="/salestargets/salestarget",e=c.attr("data-salesOpportunityID"),g={id:e,returnUrl:d};f.event.one("dataUpdate",function(){b.set("oppID",e),b.trigger("dataUpdate")}),f.navRouter.navigate("#opportunities/showopportunity/=/param-"+encodeURIComponent(JSON.stringify(g)),{trigger:!0})}},destroy:function(){var a=m.superclass.render.apply(this,arguments);return a}});c.exports=m});