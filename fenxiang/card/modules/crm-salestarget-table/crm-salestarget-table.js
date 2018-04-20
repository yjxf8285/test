/**
 * 销售预测
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){

    var root = window,
         FS = root.FS,
        tpl = FS.tpl;
    var util = require('util');
    var Widget=require('widget');
    var moment = require('moment');
    var tplHtml = require('modules/crm-salestarget-table/crm-salestarget-table.html');
//    var tplStyle = require('modules/crm-salestarget-table/crm-salestarget-table.css');
    var Opportunity = require('modules/crm-salestarget-opportunity/crm-salestarget-opportunity');
    var SalestargetExport = require('modules/crm-salestarget-export/crm-salestarget-export');
    var Chart=require('modules/crm-chart/mainchart');
 	var Target = Widget.extend({
 		"attrs":{
 			"element":null,
            "condition":{
                "fiscalYear":2014,//int，财年
                "salesForecastTimeRange":1,//int，销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;)
                "employeeID":2,// int，员工ID
                "containSubordinate":true,// bool，是否包含下属
                "isFirst":true// bool?，是否第一次调用(主要用作数据统计,第一次加载页面时候传True)
            },
            "yearFrom":2013,
            "opportunity":null,
            "chart":null,
            "cellSelectApi":"/SalesStatistic/GetSalesOpportunitysOfSalesForecastCellSelect",
            "rowSelectApi":"/SalesStatistic/GetSalesOpportunitysOfSalesForecastRowSelect",
            "cell":{
                "monthNo":0,
                "cellType":0,
                "salesStageNo":0
            },
            "status":"row"//选择状态，用于记住选择状态。取值为row or cell
 		},

 		"events":{
 			"click .crm-salestarget-group-button-detail":"_showDetail",
            "click .crm-salestarget-group-button-prediction":"_showPrediction",
            "click .crm-salestarget-group-button-table":"_showTable",
            "click .crm-salestarget-group-button-chart":"_showChart",
            "mouseover .crm-salestarget-table-can-hover-cell":"_cellMouseover",
            "mouseout .crm-salestarget-table-can-hover-cell":"_cellMouseout",
            "click .crm-salestarget-table-row-select":"_rowSelect",
            "click .crm-salestarget-table-cell-select":"_cellClick" 
 		},

 		"setup":function(){
 			var result = Target.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		//初始化
 		"_init":function(){
            this.element.html(tplHtml);
            this._initYearSelect();
            this._initThisYearSelect();
            this._initExport();
            //this._initChart();
            this._initEvent();
            this._initOpportunity();
            this._getData();
 		},
 		
 		"_initExport": function(){
 			this.salestargetExport = new SalestargetExport({
 				type: 1
 			});
 		},

        "_initYearSelect":function(){
            var yearFrom = this.get("yearFrom");
            var thisYear = moment().year();
            var option = [];
            var condition = this.get("condition");
            condition.fiscalYear = thisYear;
            for(var i = yearFrom;i <= thisYear+1;i++){
                option.push({
                    "text": i + "年",
                    "value": i,
                    "selected":i == thisYear
                })
            }
            util.mnSelect($(".crm-salestarget-select-list-year",this.element), 'syncModel',option);
            this.set("condition",condition);
        },

        "_initThisYearSelect":function(){
            var quarter = this._quarter();
            var condition = this.get("condition");
            condition.salesForecastTimeRange = quarter + 3;
            var option = [{
                            "text":"一季度",
                            "value": 4,
                            "selected":quarter == 1
                            },{
                            "text":"二季度",
                            "value": 5,
                            "selected":quarter == 2
                            },{
                            "text":"三季度",
                            "value": 6,
                            "selected":quarter == 3
                            },{
                            "text":"四季度",
                            "value": 7,
                            "selected":quarter == 4
                            },{
                            "text":"上半年",
                            "value": 2,
                            "selected":false
                            },{
                            "text":"下半年",
                            "value": 3,
                            "selected":false
                            },{
                            "text":"全年",
                            "value": 1,
                            "selected":false
                            }];
            util.mnSelect($(".crm-salestarget-select-list-this-year",this.element), 'syncModel',option);
            this.set("condition",condition);
        },

        "_quarter":function(){
            var month = moment().month();
            return  Math.floor(month/3 + 1);
        },

        "_initEvent":function(){
            var self = this;
            util.mnEvent($(".crm-salestarget-select-list-year",this.element), 'change', function (val, text) {
                var condition = self.get("condition");
                condition.fiscalYear = val;
                this.set("condition",condition);
                self.refresh();
            });
            util.mnEvent($(".crm-salestarget-select-list-this-year",this.element), 'change', function (val, text) {
                var condition = self.get("condition");
                condition.salesForecastTimeRange = val;
                this.set("condition",condition);
                self.refresh();
            });
            tpl.event.on('dataUpdate', function(){
//                self.set('oppID', id);
//                self.refresh();
            });
        },
        
        "showExport": function(){
        	if(this.salestargetExport) {
        		var condition = this.get('condition');
        		this.salestargetExport.show({
        			"fiscalYear": condition.fiscalYear, //年份
    		        "salesForecastTimeRange": condition.salesForecastTimeRange, //销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;
    		        "employeeID": condition.employeeID, 
    		        "containSubordinate": condition.containSubordinate
        		});
        	}
        },
        
        "_initOpportunity":function(){
            var self = this;
            var opportunity = new Opportunity({
                "element":$(".crm-salestarget-opportunity",this.opportunity)
            });
            opportunity.on("dataUpdate",function(){
//                debugger;
                self.refresh();
            });
            this.set("opportunity",opportunity);
        },

        "_initChart":function(data){
            //var currentCondition = this.get("condition");
            var chart = new Chart.Typeba($(".crm-salestarget-table-chart",this.element),data);
            this.set("chart",chart);
        },

        "_getData":function(){
            var condition = this.get("condition");
            var self = this;
            util.api({
                'url': '/SalesStatistic/GetSalesForecastDataOfEmployee',
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    condition.isFirst = false;
                    self.set("condition",condition);
                    self._showData(responseData.value.salesForecastDataRows);
                    if(self.get("chart")){
                        self.get("chart").update(responseData);
                    }else{
                        self._initChart(responseData);
                    }
                }
            });
        },

        "_showData":function(data){
            if(!data || data.length < 1){
                return;
            }
            var self = this,
                monthTable = "",
                detailTable = "",
                predictionTable = "",
                detailTableHeader = "<tr>";
            //init header
            var headerWidth = 1028 / (data[0].pipelineColumns.length + 1) - 40;
            _.each(data[0].pipelineColumns,function(column){
                detailTableHeader += "<th><div style = 'width:"+headerWidth+"px' title = '"+column.name+"("+column.winRate+"%)'>"+column.name+"("+column.winRate+"%)</div></th>";
            });
            detailTableHeader += "<th>销售漏斗</th></tr>";
            $(".crm-salestarget-detail-table-head",this.element).html(detailTableHeader);
            _.each(data,function(row){
                var text = "合计";
                if(!row.isTotalRow){
                    text = row.monthNo + "月";
                }
                monthTable += "<tr><td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-row-select' data-month = '"+row.monthNo+"'>"+text+"</td></tr>";
                detailTable +="<tr>";
                _.each(row.pipelineColumns,function(column){
                    detailTable += "<td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType = 1 data-salesStageNo = "+column.salesStageNo+">"+self._toCurrencyStr(column.amount)+"</td>";
                });
                detailTable += "<td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType =1 data-salesStageNo = 0>"+self._toCurrencyStr(row.pipelineAmount)+"</td></tr>";
                predictionTable += "<tr><td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType =1 data-salesStageNo = 0>"+self._toCurrencyStr(row.pipelineAmount)+"</td>";
                predictionTable += "<td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType =2 data-salesStageNo = 0>"+self._toCurrencyStr(row.winAmount)+"</td>";
                predictionTable += "<td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType =3 data-salesStageNo = 0>"+self._toCurrencyStr(row.maybeWinAmount)+"</td>";
                predictionTable += "<td class = 'crm-salestarget-table-can-hover-cell crm-salestarget-table-cell-select' data-month = '"+row.monthNo+"' data-cellType =4 data-salesStageNo = 0>"+self._toCurrencyStr(row.salesForecastAmount)+"</td>";
                predictionTable += "<td class = 'crm-salestarget-table-cannot-hover-cell' data-month = '"+row.monthNo+"'>"+self._toCurrencyStr(row.targetAmount)+"</td></tr>";
            });
            $(".crm-salestarget-month-table-body",this.element).html(monthTable);
            $(".crm-salestarget-detail-table-body",this.element).html(detailTable);
            $(".crm-salestarget-prediction-table-body",this.element).html(predictionTable);
            
            this._unselect();
            var cell=this.get('cell');
            cell.monthNo=0;cell.cellType=0;cell.salesStageNo=0;
            this._setSelect();
        },

        "_setSelect":function(){
            var cell = this.get("cell");
            var api = "";
            if(cell.cellType == 0 && cell.salesStageNo == 0){
                _.each($("[data-month="+cell.monthNo+"]",this.element),function(td){
                    $(td).addClass("crm-salestarget-table-cell-selected");
                });
                api = this.get("rowSelectApi");
            }else{
                $("[data-month="+cell.monthNo+"][data-cellType="+cell.cellType+"][data-salesStageNo="+cell.salesStageNo+"]",this.element).addClass("crm-salestarget-table-cell-selected");
                api = this.get("cellSelectApi");
            }
            this._opportunityRefresh(api);
        },

        "_unselect":function(){
            var cell = this.get("cell");
            _.each($("[data-month="+cell.monthNo+"]",this.element),function(td){
                $(td).removeClass("crm-salestarget-table-cell-selected");
            });
        },

        "_toCurrencyStr":function(value){
            return "¥" + _.str.numberFormat(parseFloat(parseFloat(value).toFixed(2)),2);
        },

        "_showTable":function(e){
            $(".crm-salestarget-group-button-table",this.element).addClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-group-button-chart",this.element).removeClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-table-chart",this.element).hide();
            $(".crm-salestarget-table-explaination",this.element).show();
            $(".crm-salestarget-table-info",this.element).show();
            $(".crm-salestarget-group-button-detail",this.element).show();
            $(".crm-salestarget-group-button-prediction",this.element).show();
        },

        "_showChart":function(e){
            $(".crm-salestarget-group-button-chart",this.element).addClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-group-button-table",this.element).removeClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-table-chart",this.element).show();
            $(".crm-salestarget-table-explaination",this.element).hide();
            $(".crm-salestarget-table-info",this.element).hide();
            $(".crm-salestarget-group-button-detail",this.element).hide();
            $(".crm-salestarget-group-button-prediction",this.element).hide();
            this.get('chart')._frame();
        },

        "_showDetail":function(e){
            $(".crm-salestarget-group-button-detail",this.element).addClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-group-button-prediction",this.element).removeClass("crm-salestarget-group-button-selected");
            var predictionTableContainer =  $(".crm-salestarget-prediction-table-container",this.element);
            var detailTableContainer =  $(".crm-salestarget-detail-table-container",this.element);
            //move right
            predictionTableContainer.animate({
              left: "0px"
            });
            detailTableContainer.animate({
              left: "0px"
            });
        },

        "_showPrediction":function(){
            $(".crm-salestarget-group-button-detail",this.element).removeClass("crm-salestarget-group-button-selected");
            $(".crm-salestarget-group-button-prediction",this.element).addClass("crm-salestarget-group-button-selected");            

            var predictionTableContainer =  $(".crm-salestarget-prediction-table-container",this.element);
            var detailTableContainer =  $(".crm-salestarget-detail-table-container",this.element);
            //move left
            predictionTableContainer.animate({
              left: "-1028px"
            });
            detailTableContainer.animate({
              left: "-1028px"
            });
        },

        "_cellMouseover":function(e){
            var currentEl = $(e.currentTarget);
            if(!currentEl){
                return;
            }
            if(currentEl.hasClass("crm-salestarget-table-cell-selected")){
                return;
            }
            currentEl.addClass("crm-salestarget-table-cell-hover");
        },

        "_cellMouseout":function(e){
            var currentEl = $(e.currentTarget);
            if(!currentEl){
                return;
            }
            currentEl.removeClass("crm-salestarget-table-cell-hover");
        },

        "_cellClick":function(e){
            var currentEl = $(e.currentTarget);
            if(!currentEl){
                return;
            }
            this._unselect();
            var cell = this.get("cell");
            cell.monthNo = currentEl.attr("data-month");
            cell.cellType = currentEl.attr("data-cellType");
            cell.salesStageNo = currentEl.attr("data-salesStageNo");
            this.set("cell",cell);
            currentEl.addClass("crm-salestarget-table-cell-selected");
            this._opportunityRefresh(this.get("cellSelectApi"));
        },

        "_rowSelect":function(e){
            var currentEl = $(e.currentTarget);
            if(!currentEl){
                return;
            }
            this._unselect();
            var cell = this.get("cell");
            cell.monthNo = currentEl.attr("data-month");
            cell.cellType = 0;
            cell.salesStageNo = 0;
            this.set("cell",cell);
            this._setSelect();
        },

        "_opportunityRefresh":function(url){
            var condition = this.get("condition");
            condition = _.extend(condition,this.get("cell"));
            this.get("opportunity").refresh(url,condition);
        },

        "refresh":function(condition){
            var currentCondition = this.get("condition");
            if(condition){
                currentCondition = _.extend(currentCondition,condition);
                this.set("condition",currentCondition);
            }
            //this.get("chart").update(currentCondition);
            this._getData();
        },

 		"destroy":function(){
 			var result = Target.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Target;
 });