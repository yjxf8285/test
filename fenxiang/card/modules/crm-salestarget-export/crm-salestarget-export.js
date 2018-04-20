/**
 * 销售预测导出
 *
 * 遵循seajs module规范
 * @author mxy
 */

define(function (require, exports, module) {
    var Dialog = require("dialog"),
        root = window,
        FS = root.FS,
        util = require('util');
    var tpl = require('modules/crm-salestarget-export/crm-salestarget-export.html');
    var moment = require('moment');
    // exportApi : "/FCustomer/ImportMyFCustomer"
    // title:"测试客户导出"
    var SalestargetExport = Dialog.extend({
        "attrs": {
	    	"content": tpl,
	    	"width": 500,
	    	"closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "type": 1, //1表示选择，2表示选中
            "condition": {
		    	"fiscalYear": '', //年份
		        "salesForecastTimeRange": '', //销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;
		        "employeeID": '', 
		        "containSubordinate": true
    		}
        },

        "setup": function () {
            var result = SalestargetExport.superclass.setup.apply(this, arguments);
            return result;
        },

        "render": function () {
            var result = SalestargetExport.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },

        "_init": function () {
        	var type = this.get('type');
        	if(type==1) {
        		$(".crm-salestarget-export-title", this.element).text('导出预测数据');
        		$('.crm-salestarget-export-select-options-tr', this.element).show();
        		$('.crm-salestarget-export-selected-options-tr', this.element).hide();
        	} else {
        		$(".crm-salestarget-export-title", this.element).text('导出预测的销售机会');
        		$('.crm-salestarget-export-select-options-tr', this.element).hide();
        		$('.crm-salestarget-export-selected-options-tr', this.element).show();
        		
        	}
            
            this._initOptions();
            this._initEvents();
        },
        
        "_initEvents": function(){
        	var self = this;
            util.mnEvent($(".crm-salestarget-select-list-year",this.element), 'change', function (val, text) {
                var condition = self.get("condition");
                condition.fiscalYear = val;
                self.set("condition",condition);
            });
            util.mnEvent($(".crm-salestarget-select-list-this-year",this.element), 'change', function (val, text) {
                var condition = self.get("condition");
                condition.salesForecastTimeRange = val;
                self.set("condition",condition);
            });
        },
        "_getYear": function(){
        	var condition = this.get('condition');
        	return condition.fiscalYear + '年';
        },
        "_getQuarter": function(){
        	var condition = this.get('condition'),
        		quarter = '';
            var monthNo=this.get('monthNo');
            if(monthNo>0){
                quarter = monthNo+'月';
            }else{
                switch(condition.salesForecastTimeRange) {
                    case 1:
                        quarter = '全年';
                        break;
                    case 2:
                        quarter = '上半年';
                        break;
                    case 3:
                        quarter = '下半年';
                        break;
                    case 4:
                        quarter = '一季度';
                        break;
                    case 5:
                        quarter = '二季度';
                        break;
                    case 6:
                        quarter = '三季度';
                        break;
                    case 7:
                        quarter = '四季度';
                        break;
                }
            }


        	return quarter;
        },
        "_initSelectedOptions": function(){
        	$('.selected-year', this.element).text(this._getYear());
        	$('.selected-quarter', this.element).text(this._getQuarter());
        },
        
        "_initOptions": function(){
        	//设置年
        	var yearFrom = 2013;
            var thisYear = moment().year();
            var option = [];
            var condition = this.get("condition");
            condition.fiscalYear = thisYear;
            for(var i = yearFrom;i <= thisYear+1;i++){
                option.push({
                    "text": i + "年",
                    "value": i,
                    "selected":i == thisYear
                });
            }
            util.mnSelect($(".crm-salestarget-select-list-year",this.element), 'syncModel',option);
            this.set("condition",condition);
            //设置季度
            var quarter = this._quarter();
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
        
        //隐藏
        "hide": function () {
            var result = SalestargetExport.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (para) {
            var result = SalestargetExport.superclass.show.apply(this, arguments);
            if (para) {
                var currentPara = this.get("condition");
                currentPara = _.extend(currentPara, para);
                this.set("condition", currentPara);
                this.set("monthNo", currentPara.monthNo);
                util.mnSetter($(".crm-salestarget-select-list-year",this.element), currentPara.fiscalYear);
                util.mnSetter($(".crm-salestarget-select-list-this-year",this.element), currentPara.salesForecastTimeRange);
                this._initSelectedOptions();
            }
            return result;
        },

        "events": {
            "click .crm-salestarget-export-button-export": "_export"
        },

        "_export": function () {
            var self = this,
            	type = self.get('type'),
            	para = self.get('condition');
            if(type==2) {
            	para.monthNo = this.get('monthNo');
            }
            util.api({
                'url': self.get("type")==1 ? '/SalesStatistic/GetSalesForecastDataOfEmployeeExcel' : '/SalesStatistic/GetSalesOpportunitysOfSalesForecastRowSelectExcel',
                'type': 'get',
                "dataType": 'json',
                'data': para,
                'timeout': 120000,//导出设置超时2min
                'success': function (responseData) {
                    if (!responseData.success) {
                        return;
                    }
                    var serviceTime = responseData.serviceTime;
                    $(".crm-salestarget-export-download", self.element).attr("href", FS.API_PATH + "/DF/GetTemp?id=" + responseData.value + "&name=" + encodeURI(self._getYear()+self._getQuarter()) + '_' +  encodeURI(type==1?'预测数据':'预测数据的销售机会') + ".xls&isAttachment=true");
                    $(".crm-salestarget-export-download", self.element).show();
                }
            },{
                "submitSelector": $('.crm-salestarget-export-button-export', self.element)
            });
        },

        "reset": function () {
            $(".crm-salestarget-export-download", this.element).hide();
        },

        "destroy": function () {
            var result = SalestargetExport.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = SalestargetExport;
});