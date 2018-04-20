/**
 * CRM - 设置 - 标签管理 - tpl
 *
 * @author liuxiaofan
 * 2014-03-20
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-customer-highseas/crm-customer-highseas');
    var ImportDialog = require('modules/crm-object-import/crm-object-import');
    var ExportDialog = require('modules/crm-customer-export/crm-customer-export');
    var tplCommon = require('../settings-common');
    var HighSeaSetting = require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
    var HighSeaSelect = require('modules/crm-select-highseas/crm-select-highseas');
    var OwnerSelect = require('modules/crm-seaselect-follow/crm-seaselect-follow');


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var list = null;
        var header = null;
        var condition = {
                "highSeasID":0,// int，公海ID
                "employeeID":-1, //int，归属员工，查询所有传-1
                "keyword": "",//string，搜索关键字
                //"sortType": 2,//int，排序类型，1：最后更新时间倒序；2：客户名称正序
                "pageSize": 15,//int，分页大小
                "pageNumber": 0//int，当前页
            };
        var $filterTitle = $('.crm-crmsettings-filterinfo',tplEl);
        var importDialog = null;
        var exportDialog = null;
        var ownerDialog = null;
        var selectColleague = null;
        var highSeaSetting = null;
        var highSeasID = 0;
        var highSeaSelect = null;
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);
        //监听页面切换事件
        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams;
            //如果是当前页面
            if (tplName2 == tplName) {
                $(".nav-highseas").addClass("state-active");
                queryParams = util.getTplQueryParams2();
                if(queryParams){
                    condition.highSeasID = queryParams.id;
                    highSeasID = queryParams.id;
                    if(list){
                        list.refresh(condition);    
                    }
                    if(header){
                        header.setTitle(queryParams.name);    
                    }
                    if(exportDialog){
                        exportDialog.setTitle(queryParams.name+"客户导出");   
                    }
                }
            }
        });

        var _initHeader = function(){
            header = new Header({
                "element": $(".high-seas-header", tplEl),
                "title": "",
                "searchPlaceholder": "搜索客户、客户编号"
            });
            header.on("search", function (keyword) {

                //todo
                list.refresh({
                    "keyword": keyword
                });
            });
        };

        var _initList = function(){
            list = new List({
                "element":$(".high-seas-list",tplEl),
                "condition":condition,
                "url":"/HighSeas/GetFCustomersHighSeasForManager"
            });
            list.on("select",function(){
                $(".crm-highseas-select-show",tplEl).show();
                $(".crm-highseas-unselect-show",tplEl).hide();
            });
            list.on("unselect",function(){
                $(".crm-highseas-unselect-show",tplEl).show();
                $(".crm-highseas-select-show",tplEl).hide();
            });
            list.on("refreshed",function(total){
                if(header){
                    header.setCount(total);
                }
            });
        };

        var _initImportDialog = function(){
            if(importDialog){
                return;
            }
            importDialog = new ImportDialog({
                "title": "客户导入",
                "downloadApi": "GetFCustomerHighSeasExcelTemplate",
                "importApi": "/HighSeas/ImportFCustomerHighSeas",
                "downloadText": "公海客户导入模板"
            });
            importDialog.on('uploaded', function () {
                list.refresh(condition);
            })
        };

        var _initExortDialog = function(){
            if(exportDialog){
                return;
            }
            exportDialog = new ExportDialog({
               "title": "客户导出",
               "hasBelongTo":true,
               "ownerName":"跟进人",
                "exportApi": "/HighSeas/ExportFCustomersHighSeasExcel"
            });
        };

        var _initOwnerDialog = function(){
            if(ownerDialog){
                return;
            }
            ownerDialog = new OwnerSelect();
            ownerDialog.on("selected",function(value){
                var items = list.getSelectItems();
                util.confirm("是否将选中的"+items.length+"个客户的跟进人设置为"+value.name+"？","",function(){
                    util.api({
                        'url': "/HighSeas/AllocateCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"employeeID":value.employeeID,"customerIDs":items.join(",")},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            var result = responseData.value.result;
                            var successCount = 0;
                            var failureCount = 0;
                            _.each(result,function(item){
                                if(item.value1){
                                    successCount ++;
                                }else{
                                    failureCount ++;
                                }
                            })
                            util.alert("本次调整有"+successCount+"个成功，"+failureCount+"个失败");
                            list.refresh();
                        }
                    });
                });
            });
        };

        var _initSelectColleague = function(){
            if(selectColleague){
                return;
            }
            selectColleague = new OwnerSelect({
                "title":"选择跟进人"
            });
            selectColleague.on("selected",function(val){
                condition.employeeID = val.employeeID;
                $filterTitle.find('span').text(val.name);
                $filterTitle.show();
                list.refresh({
                	employeeID: val.employeeID
                });
            });
        };

        var _initHighSeaSetting = function(){
            if(highSeaSetting){
                return;
            }
            highSeaSetting = new HighSeaSetting();
            highSeaSetting.on("modifySuccess",function(value){
                tplCommon.refreshHighSeas();
                list.refresh(condition);
                header.setTitle(value.name);
                //tpl.navRouter.navigate('#crmsettings/highseas/=/param-' + encodeURIComponent(JSON.stringify(value)), { trigger: true });
            });
            highSeaSetting.on("deleteSuccess",function(value){
                tplCommon.refreshHighSeas();
                tpl.navRouter.navigate('#crmsettings/unallocatedcustomers', { trigger: true });
            });
        };

        var _initHighSeaSelect = function(){
            if(highSeaSelect){
                return;
            }

            highSeaSelect = new HighSeaSelect({
                "title":"选择公海",
                "url":"/HighSeas/GetAllHighSeas/",
                "hasCreate":true
            });

            highSeaSelect.on("selected",function(value){
                var items = list.getSelectItems();
                util.confirm("是否将选中的"+items.length+"个客户移动到"+value.name+"？","",function(){
                    util.api({
                        'url': "/HighSeas/MoveHighseasCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"targetHighSeasID":value.id,"customerIDs":items.join(",")},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            list.refresh(condition);
                        }
                    });
                });
            });

            highSeaSelect.on("created",function(id){
                tplCommon.refreshHighSeas();
            });

        };

        var _initEvent = function(){
            $(".crm-customer-import",tplEl).on("click",function(){
                importDialog.show();
            });
            $(".crm-customer-export",tplEl).on("click",function(){
                exportDialog.show({"highSeasID":highSeasID});
            });
            $(".crm-set-owner",tplEl).on("click",function(){
                ownerDialog.show(list.get("highSeasPermissions"));
            });
            $(".crm-cancel-owner",tplEl).on("click",function(){
                var items = list.getSelectItems();
                util.confirm("是否要取消选中的"+items.length+"个客户的跟进人？","",function(){
                    util.api({
                        'url': "/HighSeas/TakeBackCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"customerIDs":items.join(",")},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            list.refresh();
                        }
                    });
                });
            });
            $(".crm-move-other",tplEl).on("click",function(){
                highSeaSelect.show(highSeasID);
            });
            $(".crm-remove-from-highseas",tplEl).on("click",function(){
                var items = list.getSelectItems();
                util.confirm("是否要将选中的"+items.length+"个客户移出该公海？","",function(){
                    var para = {
                        "highSeasID":highSeasID,
                        "customerIDs":items.join(",")
                    }
                    util.api({
                        'url': "/HighSeas/RemoveHighseasCustomers",
                        'type': 'post',
                        "dataType": 'json',
                        'data': para,
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            list.refresh(condition);
                        }
                    });
                });
            });

            $(".crm-highsea-edit",tplEl).on("click",function(){
                highSeaSetting.show(highSeasID);
            });

            $(".crm-filter-by-employee",tplEl).on("click",function(){
                selectColleague.show(list.get("highSeasPermissions"));
            });
            $filterTitle.find('a').on("click",function(){
                condition.employeeID = -1;
                list.refresh(condition);
                $filterTitle.hide();
            });
        };

        var _init = function(){
            _initHeader();
            _initList();
            _initImportDialog();
            _initExortDialog();
            _initSelectColleague();
            _initHighSeaSetting();
            _initHighSeaSelect();
            _initOwnerDialog();
            _initEvent();
        }();

    };
});