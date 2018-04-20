define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util');
    var tpl = require('modules/crm-salestarget-setting/crm-salestarget-setting.html');
//    var tplStyle = require('modules/crm-salestarget-setting/crm-salestarget-setting.css');
    var moment = require('moment');
    var curEmployee = util.getCrmData().currentEmp;
	var Setting = Dialog.extend({
		"attrs":{
			"element":null,
			"width":925,
            "content": tpl,
            "closeTpl":"<div class = 'crm-ui-dialog-close crm-salestarget-setting-close'>×</div>",
            "fiscalYear":2014,
            "yearFrom":2013,
            "result":{},
            "month":{
                "January":0,
                "February":0,
                "March":0,
                "April":0,
                "May":0,
                "June":0,
                "July":0,
                "August":0,
                "September":0,
                "October":0,
                "November":0,
                "December":0
            },
            "season":{
                "FirstSeason":0,
                "SecondSeason":0,
                "ThirdSeason":0,
                "FourthSeason":0
            },
            "year":{
                "FiscalYear":0,
                "Year":0
            },
            "isInit":false
		},

		setup:function(){
            var result=Setting.superclass.setup.apply(this,arguments);
            return result;
        },

        "_init":function(){
            //this.element.html(tpl);
            this._initYearSelect();
            this._initEvent();
        },

        "_initYearSelect":function(){
            
            var yearFrom = this.get("yearFrom");
            var thisYear = moment().year();
            var option = [];
            for(var i = yearFrom;i <= thisYear+2;i++){
                option.push({
                    "text": i + "年",
                    "value": i,
                    "selected":i == thisYear
                })
            }

            util.mnSelect($(".crm-salestarget-setting-select-list-year",this.element), 'syncModel',option);
            this.set("fiscalYear",thisYear);
        },

        "_initEvent":function(){
            var self = this;
            util.mnEvent($(".crm-salestarget-setting-select-list-year",this.element), 'change', function (val, text) {
                self.set("fiscalYear",val);
                self._setYear();
                self._getData();
            });
        },

        "_setYear":function(){
            var fiscalYear = this.get("fiscalYear");
            _.each($(".crm-salestarget-setting-year",this.element),function(item){
                $(item).text(fiscalYear);
            });
        },

        "_getData":function(){
            var fiscalYear = this.get("fiscalYear"),
            	employee = this.get('employee');
            var self = this;
            util.api({
                'url': '/SalesStatistic/GetSalesTargetOfLower/',
                'type': 'get',
                "dataType": 'json',
                'data': {"fiscalYear":fiscalYear, employeeID:employee.employeeID},
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    var employeeSalesTarget = responseData.value.employeeSalesTarget;
                    self.set("result",employeeSalesTarget);
                    self._setValue(employeeSalesTarget);
                }
            });
        },

        "_saveData":function(){
            var fiscalYear = this.get("fiscalYear");
            var employee = this.get('employee');
            var year = this.get("year");
            var season = this.get("season");
            var month = this.get("month");
            var self = this;
            var data = {};
            year.FiscalYear = fiscalYear;
            data = _.extend(data,year);
            data = _.extend(data,season);
            data = _.extend(data,month);

            var isValid = true;

            for(var prop in data){
                var val = $("."+prop.toLowerCase(),this.element).val();
                if(val){
                    if(!this._isValid(val)){
                        util.alert("请正确填写金额");
                        return;
                    }
                    data[prop] = val;
                }
            };
            data.employeeID = employee.employeeID;
            util.api({
                'url': '/SalesStatistic/SaveSalesTargetOfLower/',
                'type': 'post',
                "dataType": 'json',
                'data': data,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    self.trigger("saved");
                    self.hide();
                }
            });
        },
		
        "_setValue":function(data){
            for(var prop in data){
                if($("."+prop,this.element)){
                    $("."+prop,this.element).val(data[prop]);
                }
            }
        },

        "_isValid":function(val){
            var strP=/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
            if(!strP.test(val)){
                return false;
            }
            return true;
        },

        "_toMonth":function(){
            var year = $(".year",this.element).val();
            if(year % 12 != 0){
                util.alert("年度目标不是12的整数倍，不能平均分配到每个月。")
                return;
            }
            var season = this.get("season");
            var month = this.get("month");
            for(var prop in season){
                $("."+prop.toLowerCase(),this.element).val(year/4);
            };
            for(var prop in month){
                $("."+prop.toLowerCase(),this.element).val(year/12);
            };
        },

        //隐藏
        "hide": function () {
            var result = Setting.superclass.hide.apply(this, arguments);
            return result;
        },

        //显示
        "show": function (employee) {
            var result = Setting.superclass.show.apply(this, arguments);
            if(!this.get("isInit")){
                this.set("isInit",true);
                this._init();
            }else{
                var thisYear = moment().year();
                util.mnSetter($(".crm-salestarget-setting-select-list-year",this.element),thisYear);
                //return result;
            }
            $('.crm-salestarget-setting-who', this.element).html(employee.employeeID==curEmployee.employeeID ? '我' : employee.name);
            this.set("employee", employee);
            this._setYear();
            this._getData();
            return result;
        },

        "events":{
        	'click .crm-salestarget-setting-button-ok': '_submit',
        	'click .crm-salestarget-setting-button-cancel': '_cancel',
            'click .crm-salestarget-setting-to-month': '_toMonth'
        },

        "_cancel":function(){
            this.hide();
        },

        "_submit":function(){
            this._saveData();
        },

        "destroy":function(){
            var result=Setting.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Setting;
});