/**
 * 销售预测机会
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
     var root = window,
         FS = root.FS,
         tpl = FS.tpl,
         store = tpl.store,
         tplEvent = tpl.event;

    var util = require('util');
    var Widget=require('widget');
    var moment = require('moment');
    var tplHtml = require('modules/crm-salestarget-opportunity/crm-salestarget-opportunity.html');
    var SalestargetExport = require('modules/crm-salestarget-export/crm-salestarget-export');
//    var tplStyle = require('modules/crm-salestarget-opportunity/crm-salestarget-opportunity.css');
    var Pagination=require('uilibs/pagination2');
 	var Opportunity = Widget.extend({
 		"attrs":{
 			"element":null,
            "condition":{
                "fiscalYear":2014,//int，财年
                "salesForecastTimeRange":1,//int，销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;)
                "monthNo":0,//int，月度(当monthNo赋值为1-12时,忽略salesForecastTimeRange)
                "cellType":0,//int，pipeline=1；赢单金额=2；可能完成金额=3；总预测值=4；
                "salesStageNo":0,//int，当celltype = 1时，SalesStageNo为阶段单元格，SalesStageNo = 0为pipeline的值
                "employeeID":2,// int，员工ID
                "containSubordinate":true,// bool，是否包含下属
                "pageSize":10,// int，分页大小
                "pageNumber":1// int，页码
            },
            "pagination":null,
            "url":"",
            "oppID":0
 		},

 		"events":{
 			"click .crm-salestarget-opportunity-tr":"_toDetail",
 			"click .crm-salestarget-button-export-oppo":"_showExport"
 		},

 		"setup":function(){
 			var result = Opportunity.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		//初始化
 		"_init":function(){
            this.element.html(tplHtml);
            this._initPagination();
            this._initExport();
 		},
 		
 		"_initExport": function(){
 			this.salestargetExport = new SalestargetExport({
 				type: 2
 			});
 		},
 		
 		"_showExport": function(){
 			if(this.salestargetExport) {
        		var condition = this.get('condition');
        		this.salestargetExport.show({
        			"fiscalYear": condition.fiscalYear, //年份
    		        "salesForecastTimeRange": condition.salesForecastTimeRange, //销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;
    		        "employeeID": condition.employeeID, 
    		        "monthNo":condition.monthNo,
    		        "containSubordinate": condition.containSubordinate
        		});
        	}
 		},
        "_initPagination":function(){
            var self = this;
            var pagination = new Pagination({
                "element":$('.pagination-wrapper',this.element),
                "pageSize":10,
                "totalSize":0,
                "activePageNumber":1
            });

            pagination.on('page',function(val){
                var condition = self.get("condition");
                condition.pageNumber = val;
                self.set("condition",condition);
                self.refresh(self.get("url"),condition);
            });
            this.set("pagination",pagination);
        },


        "_getData":function(url,condition){
            var self = this;
            util.api({
                'url': url,
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    self.get("pagination").setTotalSize(responseData.value.totalCount);
                    self._showData(responseData.value);
                }
            });
        },

        "_showData":function(data){
            if(!data || data.salesOpportunitys.length < 1){
                $(".crm-salestarget-no-opportunity",this.element).show();
                $(".crm-salestarget-opportunity-table",this.element).hide();
                $(".crm-salestarget-opportunity-pagination",this.element).hide();
                return;
            }
            $(".crm-salestarget-no-opportunity",this.element).hide();
            $(".crm-salestarget-opportunity-table",this.element).show();
            $(".crm-salestarget-opportunity-pagination",this.element).show();
            var self = this,
                opportunityTable = "";
            var oppID = this.get("oppID");
            _.each(data.salesOpportunitys,function(row){
                var selectedClass = "";
                if(oppID == row.salesOpportunityID){
                    selectedClass = "row_selected";
                    //self.set("oppID",0);
                }
                opportunityTable += "<tr data-salesOpportunityID = '"+row.salesOpportunityID+"' data-name ='"+row.name+"' class ='crm-salestarget-opportunity-tr "+selectedClass+"'><td><span class='crm-salestarget-opportunity-name fn-text-overflow' title = '"+row.name+"'>"+row.name+"</span></td>";
                opportunityTable += "<td><span title = '"+row.owner.name+"'>"+row.owner.name+"</span></td>";
                opportunityTable += "<td><span class = 'crm-salestarget-opportunity-customer-name fn-text-overflow' title = '"+row.customerName+"'>"+row.customerName+"</span></td>";
                opportunityTable += "<td><span title = '"+row.typeTagOptionName+"'>"+row.typeTagOptionName+"</span></td>";
                opportunityTable += "<td><span title = '"+_.str.numberFormat(parseFloat(row.expectedSalesAmount), 2)+"'>"+_.str.numberFormat(parseFloat(row.expectedSalesAmount), 2)+"</span></td>";
                opportunityTable += "<td><span title = '"+moment.unix(row.expectedDealTime).format('YYYY-MM-DD')+"'>"+moment.unix(row.expectedDealTime).format('YYYY-MM-DD')+"</span></td>";
                opportunityTable += "<td><span title = '"+row.salesStage.name+"'>"+row.salesStage.name+"</span></td>";
                opportunityTable += "<td><span title = '"+row.salesStage.winRate+"%'>"+row.salesStage.winRate+"%</span></td>";
                opportunityTable += "<td><span title = '"+row.sourceTagOptionName+"'>"+row.sourceTagOptionName+"</span></td></tr>";
            });
            $(".crm-salestarget-opportunity-table-body",this.element).html(opportunityTable);
        },

       
        "refresh":function(url,condition){
            this.set("url",url);
            var currentCondition = this.get("condition");
            if(condition){
                currentCondition = _.extend(currentCondition,condition);
                this.set("condition",currentCondition);
            }
            this._getData(url,currentCondition);
        },

        "_toDetail":function(e){
            var self = this;
            var currentEl = $(e.currentTarget);
            if(!currentEl){
                return;
            }
            $(".row_selected",this.element).removeClass("row_selected");
            currentEl.addClass("row_selected");
            var returnUrl = '/salestargets/salestarget';
            var id = currentEl.attr("data-salesOpportunityID");
//            var name = encodeURIComponent(encodeURI(currentEl.attr("data-name")));
//            var url = '#opportunities/showopportunity/=/id-' + id + '/name-' + name + '/returnUrl-' + returnUrl;
//            FS.tpl.navRouter.navigate('#opportunities/showopportunity/=/id-' + id + '/name-' + name + '/returnUrl-' + returnUrl, {
//                trigger: true
//            });
            var param = {
                id: id,
                returnUrl: returnUrl
            };
            tpl.event.one('dataUpdate', function(){
                self.set('oppID', id);
                //self.refresh(self.get("url"));
                self.trigger("dataUpdate");
            });
            tpl.navRouter.navigate('#opportunities/showopportunity/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });

        },

 		"destroy":function(){
 			var result = Opportunity.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Opportunity;
 });