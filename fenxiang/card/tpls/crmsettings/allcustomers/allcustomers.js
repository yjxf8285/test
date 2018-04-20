/**
 * 全部客户
 *
 * 遵循seajs module规范
 * @author zdl 2014-06-03
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../settings-common');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-customer-list-all/crm-customer-list-all');
    var CustomerDialog = require('modules/crm-customer-add/crm-customer-add');
    var ImportDialog = require('modules/crm-object-import/crm-object-import');
    var ExportDialog = require('modules/crm-customer-export/crm-customer-export');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName,
            createDialog = null,
            exportDialog = null,
            importDialog = null,
            selectColleague = null;
        var list, header;
        var $filterTitle = $('.crm-crmsettings-filterinfo',tplEl);
        var listCondition = {
                employeeID: -1,//，员工ID
                keyword: '',// string，搜索关键字
                isFirstChar: false,//，是否首字母查询
                //sortType: 0,//，排序规则
                pageNumber: 1,//，页码
                pageSize: 15,
                queryType: 1
            };
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);

        var _initHeader = function(){

            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "全部客户",
                "searchPlaceholder": "搜索客户、客户编号"
            });
            header.on("search", function (keyword) {
                list.refresh({
                    "keyword": keyword
                });
            });
        };

        var _initList = function(){
            list = new List({
                element: $('.list-warp', tplEl)
                
            });

            list.on("refreshed",function(total){
                if(header){
                    header.setCount(total);
                }
            });
            
            list.refresh(listCondition);
        };

        var _initCreateDialog = function(){
            if(createDialog){
                return;
            }
            createDialog = new CustomerDialog({
                inSetting: true
            });//先把弹框NEW出来因为只有1个
            createDialog.on("success",function(){
                list.refresh(listCondition);
            });
        };
       

        var _initImportDialog = function(){
            if(importDialog){
                return;
            }
            importDialog = new ImportDialog({
                "title": "客户导入",
                "downloadApi": "GetAllFCustomerExcelTemplate",
                "importApi": "/FCustomer/ImportAllFCustomers",
                "downloadText": "客户导入模板"
            });
            importDialog.on('uploaded', function () {
                list.refresh(listCondition);
            })
        };

        var _initExortDialog = function(){
            if(exportDialog){
                return;
            }
            exportDialog = new ExportDialog({
               "title": "全部客户导出",
               "hasBelongTo":true,
               "isMulti": true,
                "exportApi": "/FCustomer/ExportAllFCustomersExcel"
            });
        };

        var _initSelectColleague = function(){
            if(selectColleague){
                return;
            }
            selectColleague = new SelectColleague({
               "isMultiSelect":false,
                "hasWorkLeaveBtn":true,
                "title":"选择员工"
            });
            selectColleague.on("selected",function(val){
                listCondition.employeeID = val.employeeID;
                $filterTitle.find('span').text(val.name);
                $filterTitle.show();
                list.refresh(listCondition);
            });
        };

        var _initEvent = function(){
            $(".create-customer-btn",tplEl).on("click",function(){
                createDialog.show();
            });
            $(".customer-import",tplEl).on("click",function(){
                importDialog.show();
            });
            $(".customer-export",tplEl).on("click",function(){
                exportDialog.show();
            });
            $(".crm-allcustomers-fliter",tplEl).on("click",function(){
                selectColleague.show();
            });
            $filterTitle.find('a').on("click",function(){
                listCondition.employeeID = -1;
                list.refresh(listCondition);
                $filterTitle.hide();
            });
        };

        var destroy=function(){
            //debugger;
            if(header){

                header.destroy();
            }
        };
        //tplEvent.one('beforeremove',function(tplName2){
            //if(tplName2==tplName){
                //destroy();
            //}
        //});

        
        var _init = function(){
            _initHeader();
            _initList();
            _initCreateDialog();
            _initImportDialog();
            _initExortDialog();
            _initSelectColleague();
            _initEvent();
        }();
    };
});