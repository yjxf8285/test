/**
 * 全部客户
 *
 * 遵循seajs module规范
 * @author liuxiaofan 2014-06-03
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../settings-common');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-contact-list/crm-contact-list');
    var ImportDialog = require('modules/crm-object-import/crm-object-import');
    var ExportDialog = require('modules/crm-contact-export/crm-contact-export');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var ContactView=require('modules/crm-contact-view/crm-contact-view');
    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName,
            exportDialog = null,
            importDialog = null,
            contactView = null,
            selectColleague = null;
        var list = null;
        var $filterTitle = $('.crm-crmsettings-filterinfo',tplEl);
        var listCondition = {
                employeeID: 0,//int，员工ID，如果是自身就填自己的id
                keyword: '',//string，关键字
                isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                isDeleted: 0,// int，是否为删除的，0,1
                createCustomer: -1,//int，是否创建联系人 0：未创建 1：创建 -1 全部
                sortType: 12,//int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                isContainSubordinate: -1,// int，是否包含下属 0：自己;1:下属;-1:全部
                pageSize: 25,//int，分页大小
                pageNumber: 1// int，当前页
            };
        var _initHeader = function(){
            var header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "全部联系人",
                "searchPlaceholder": "搜索联系人"
            });
            header.on("search", function (keyword) {
                list.refresh({
                    "keyword": keyword
                });
            });
        };

        var _initList = function(){
            list = new List({
                data: listCondition,
                "warpEl": $(".list-warp", tplEl),
                "url": "/Contact/GetAllContacts",
                "overwriteRowClick":true,
                "isSetting":true
            });
            list.on("rowClick",function(id){
                if(!contactView){
                    return;
                }
                contactView.show({"contactID":id});
            });
            list.load();
            list.refresh();
            $('.top-fn-btns', tplEl).hide();
        };

        var _initImportDialog = function(){
            if(importDialog){
                return;
            }
            importDialog = new ImportDialog({
                "title": "联系人导入",
                "downloadApi": "GetAllContactExcelTemplate",
                "importApi": "/Contact/ImportAllContact",
                "downloadText": "联系人导入模板"
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
               "title": "全部联系人导出",
                "isAll":true
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

        var _initContactView = function(){
            contactView = new ContactView();
            
        };

        var _initEvent = function(){
            $(".contacts-import",tplEl).on("click",function(){
                importDialog.show();
            });
            $(".contacts-export",tplEl).on("click",function(){
                exportDialog.show();
            });
            $(".crm-allcontacts-fliter",tplEl).on("click",function(){
                selectColleague.show();
            });
            $filterTitle.find('a').on("click",function(){
                listCondition.employeeID = -1;
                list.refresh(listCondition);
                $filterTitle.hide();
            });
        };
        
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);

        var _init = function(){
            _initHeader();
            _initList();
            _initImportDialog();
            _initExortDialog();
            _initSelectColleague();
            _initContactView();
            _initEvent();
        }();
    };
});