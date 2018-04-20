         /**
 * CRM - 销售预测 - tpl
 *
 * @author zhangdl
 * 2014-05-07
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Subordinate=require('modules/crm-subordinate-select/crm-subordinate-select');
    var SalesTargetTable=require('modules/crm-salestarget-table/crm-salestarget-table');
    var Setting = require('modules/crm-salestarget-setting/crm-salestarget-setting');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName,
            employee = null,
            setting = null,
            salesTargetTable = null;

        var _initSubordinate = function(emp){
            if(!emp){
                return;
            }
            var subordinate = new Subordinate({
                "element":$(".crm-salestarget-subordinate-wrapper",tplEl),
                "employeeName":emp.name,
                "imageSrc":util.getAvatarLink(emp.profileImage, '2'),
                "canSelect": emp && emp.subEmployees && emp.subEmployees.length > 0
            });

            subordinate.on("selected",function(sub){
                employee = sub;
                salesTargetTable.refresh({"employeeID":employee.employeeID});
                var curEmp = util.getCrmData().currentEmp;
                $(".crm-salestarget-button-set",tplEl).html('设置' + ((curEmp.employeeID==employee.employeeID)?'我':employee.name) + '的业务目标');
            });
        };

        var _initSalesTargetTable = function(){
            salesTargetTable = new SalesTargetTable({
                "element":$(".crm-salestarget-table-wrapper",tplEl),
                "condition":{
                    "fiscalYear":0,//int，财年
                    "salesForecastTimeRange":0,//int，销售预测时间段范围(全年= 1;上半年= 2;下半年= 3;一季度= 4;二季度= 5;三季度= 6;四季度= 7;)
                    "employeeID":employee.employeeID,// int，员工ID
                    "containSubordinate":true,// bool，是否包含下属
                    "isFirst":true// bool?，是否第一次调用(主要用作数据统计,第一次加载页面时候传True)
                }
            });

        };

        var _initSetting = function(){
            setting = new Setting({});
            setting.on("saved",function(){
                salesTargetTable.refresh();
            });
        };

        var _initEvents = function(){
            util.mnEvent($(".crm-salestarget-checkbox",tplEl), 'change', function (val) {
                var checked = false;
                if(val.length < 1){
                    checked = true;
                }
                salesTargetTable.refresh({"containSubordinate":checked});
            });

            $(".crm-salestarget-button-set",tplEl).on("click",function(){
                setting.show(employee);
            });
            $(".crm-salestarget-button-export",tplEl).on("click",function(){
            	salesTargetTable.showExport();
            });
        };

        var _changeName = function(name){
            $(".marketing-follow",tplEl).text(name+"关注的");
            $(".marketing-charge",tplEl).text(name+"负责或参与的");
            $(".marketing-subordinate-charge",tplEl).text(name+"下属负责或参与的");
        };

        var init = function(){
            employee = util.getCrmData().currentEmp;
            _initSubordinate(employee);
            _initSalesTargetTable();
            _initSetting();
            _initEvents();
        }();
    };

});