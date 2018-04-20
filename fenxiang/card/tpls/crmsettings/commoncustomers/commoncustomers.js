/**
 * 未分配客户
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
    //var List = require('modules/crm-customer-list/crm-customer-list');
    var List = require('modules/crm-setting-customerlist/crm-setting-customerlist');
    var ImportDialog = require('modules/crm-object-import/crm-object-import');
    var ExportDialog = require('modules/crm-customer-export/crm-customer-export');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var HighSeaSelect = require('modules/crm-select-highseas/crm-select-highseas');
    var CustomerInSettingDialog=require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit');
    var moment = require('moment');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;

        //筛选提示信息
        var $filterTitle=$('.crm-crmsettings-commoncustomers-filterinfo',tplEl);

        //头部列表
        var list, 
            header;
        //各组件
        var editDialog=null,
            importDialog=null,
            exportDialog=null,
            selectColleague=null,
            seaDialog=null,
            selectColleagueb=null;

        //表格参数
        var param={
                employeeID:-1,
                keyword:'',
                sortType:1,
                pageNumber:1,
                pageSize:25
            };
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);

        //初始化顶部
        var _initHeader=function(){
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "已归属客户",
                "searchPlaceholder": "搜索客户"
            });
            header.on("search", function (keyword) {
                list.refresh({
                    "keyword": keyword
                });
            });
        };
        //初始化列表
        var _initList=function(){
            //table body
            list = new List({
                warpEl: $('.list-warp', tplEl),
                url: "/HighSeas/GetFCustomersCommonForManager",
                hasButtons:false,
                overwriteRowClick:true,
                aoColumns:[
                    //复选框
                    {
                        "mData": "customerID",//列数据的数组keyname
                        "sWidth": "26px",//列宽
                        "sClass": "td-checkbox-warp",
                        "bSortable": false,//支持排序
                        "mRender": function (data, type, full) { //第1列内容
                            var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable crm-datatable-checkboxinput">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';
                            return mnCheckbox;
                        }
                    },
                    //关注隐藏
                    {
                        "mData": "customerID",
                        "sWidth": "0px",
                        "sClass": "customer-foolo",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            return "";
                        }
                    },
                    //名称
                    {
                        "mData": "name",
                        "sWidth": "160px",
                        "sClass": "black-name crmtable-sort-name",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //负责人隐藏
                    {
                        "mData": "ownerName",
                        "sWidth": "110px",
                        "sClass": "black-name crmtable-sort-ownername",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                        	var newData= '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //客户状态
                    {
                        "mData": "customerStateTagOption",
                        "sWidth": "170px",
                        "sClass": "crmtable-sort-customer-status",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //最后修改时间
                    {
                        "mData": "lastUpdateTime",
                        "sWidth": "170px",
                        "sClass": "crmtable-sort-lastupdatetime",
                        "bSortable": false,
                        "asSorting": [ "desc", "asc" ],
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                            return newData;
                        }
                    },
                    //创建时间
                    {
                        "mData": "createTime",
                        "sWidth": "120px",
                        "sClass": "crmtable-sort-createtime",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                            return newData;
                        }
                    }
                    ,
                    //空列
                    {
                        "mData": "createTime",
                        "sClass": "th-blank",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '';
                            return newData;
                        }
                    }
                    
                ]//设置list显示模版
            });
            var multyBtn=$('.crm-setting-multyset',tplEl),
                singleBtn=$('.crm-button-submit',tplEl);
                
            list.refresh(param);
            list.on("rowClick",function(id){
                editDialog.show({
                    customerID: id
                })
            });
            list.on("isSelected",function(){
               multyBtn.show();
               singleBtn.hide();
            })
            list.on("unSelected",function(){
                multyBtn.hide();
                singleBtn.show();
            })  
            //list.refresh(this.oTable);
        };
        //===========初始化单个客户详情
        var _initEditDialog = function(){
            if(editDialog){
                return;
            }
            editDialog = new CustomerInSettingDialog();
            editDialog.on("success",function(){
                list.refresh(param);
            });
        };
        //===========初始化导入客户对话框
        var _initImportDialog = function(){
            if(importDialog){
                return;
            }
            importDialog = new ImportDialog({
                "title": "客户导入",
                "downloadApi": "GetFCustomerCommonExcelTemplate",
                "importApi": "/HighSeas/ImportFCustomerCommon",
                "downloadText": "归属人客户导入模板"
            });
            importDialog.on('uploaded', function () {
                list.refresh(listCondition);
            })
        };
        //===========获取现在列表中选中的ids
        var _getSelected=function(){
            var array=[];
            var tds=$('td.td-checkbox-warp',tplEl);
            tds.each(function(){
                var $span=$(this).find('.mn-checkbox-item');
                if($span.hasClass('mn-selected')){ 
                    array.push($span.attr('data-value'));
                }
            })
            return array;
        };
        //===========初始化导出客户对话框
        var _initExportDialog = function(){
            if(exportDialog){
                return;
            }
            exportDialog = new ExportDialog({
               "title": "已归属客户导出",
               "hasBelongTo":true,
               "exportApi": "/HighSeas/ExportFCustomersCommonExcel"
            });
        };
        //初始化设置归属人
        var _initSelectDialog=function(){
            selectColleagueb=new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":true,
                "title":"选择归属人"
            });
            selectColleagueb.on("selected",function(val){
                var customerArray=list.getSelected();
                var num=customerArray.length;

                var employeeID = val.employeeID,
                    name=val.name;
                
                var text="是否将选中的"+num+"个客户的归属人设置为"+name;
                util.confirm(text,'设置归属人',function(){
            
                    util.api({
                        "url":'/FCustomer/ModifyFCustomerOwners',
                        "type":'post',
                        "dataType":'json',
                        "data":{
                            customerIDs:customerArray.join(','),
                            ownerID:employeeID
                        },
                        "success":function(data){
                            if(!data.success){
                                return;
                            }
                            var successNum=0,
                                failedNum=0;
                            var results=data.value.ChangeOwnerResults;
                            for(var i=0;i<results.length;i++){
                                if(results[i].value1==true){
                                    successNum +=1;
                                }else{
                                    failedNum +=1;
                                }
                            }
                            list.refresh(param);
                            list.trigger('unSelected');
                            util.alert("本次调整有"+successNum+"个成功，"+failedNum+"个失败");
                        }
                    },{
                        "submitSelector": ''
                    });
                });
            });
        };
        //初始化取消设置归属人
        var _initCancelDialog=function(){
             $(".crm-crmsettings-cummoncustomers-cancelbelong",tplEl).on("click",function(){
                var customerArray=list.getSelected();
                if(customerArray.length<=0){
                    util.alert('请勾选客户');
                }else{
                    var text="是否要取消选中的"+customerArray.length+"个客户的归属人";
                    util.confirm(text,'取消归属人',function(){
            
                        util.api({
                            "url":'/FCustomer/ModifyFCustomerOwners',
                            "type":'post',
                            "dataType":'json',
                            "data":{
                                customerIDs:customerArray.join(','),
                                ownerID:0
                            },
                            "success":function(data){
                                if(!data.success){
                                    return;
                                }
                                var successNum=0,
                                    failedNum=0;
                                var results=data.value.ChangeOwnerResults;
                                for(var i=0;i<results.length;i++){
                                    if(results[i].value1==true){
                                        successNum +=1;
                                    }else{
                                        failedNum +=1;
                                    }
                                }
                                list.refresh(param);
                                list.trigger('unSelected');
                                util.alert("本次调整有"+successNum+"个成功，"+failedNum+"个失败");
                            }
                        },{
                            "submitSelector": ''
                        });
                    });
                }
            });
        };
        //初始化移动到公海
        var _initSeaDialog=function(){
            if(seaDialog){
                return;
            }

            seaDialog= new HighSeaSelect({
                "title":"选择公海",
                "url":"/HighSeas/GetAllHighSeas/",
                "hasCreate":true
            });

            seaDialog.on("selected",function(value){
                var items = list.getSelected();
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
                            var successNum=0,
                                failedNum=0;
                            var results=responseData.value.result;
                            for(var i=0;i<results.length;i++){
                                if(results[i].value1==true){
                                    successNum +=1;
                                }else{
                                    failedNum +=1;
                                }
                            }
                            list.refresh(param);
                            list.trigger('unSelected');
                            util.alert("本次调整有"+successNum+"个成功，"+failedNum+"个失败");
                        }
                    });
                });
            });

            seaDialog.on("created",function(id){
                tplCommon.refreshHighSeas();
            });
        };
        //===========按归属人筛选
        var _initSelectColleague = function(){
            if(selectColleague){
                return;
            }
            selectColleague = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":true,
                "title":"选择归属人"
            });
            selectColleague.on("selected",function(val){
                param.employeeID = val.employeeID;
                $filterTitle.find('span').text(val.name);
                $filterTitle.show();
                //$(".crm-filter-by-employee",tplEl).text("由"+val.name+"负责的客户");
                list.refresh(param);
            });
        };

        var _initEvent = function(){
            $(".customer-import",tplEl).on("click",function(){
                importDialog.show();
            });
            $(".customer-export",tplEl).on("click",function(){
                exportDialog.show();
            });
            $(".crm-cummoncustomers-fliter",tplEl).on("click",function(){
                selectColleague.show();
            });
            $(".crm-cummoncustomers-setbelong",tplEl).on("click",function(){
                selectColleagueb.show();
            });
            $(".crm-cummoncustomers-mvSea",tplEl).on("click",function(){
                seaDialog.show();
            });
            $filterTitle.find('a').on("click",function(){
                param.employeeID=-1;
                list.refresh(param);
                $filterTitle.hide();
            })
        };
        
        var _init = function(){
            _initHeader();
            _initEditDialog();
            _initImportDialog();
            _initExportDialog();
            _initSelectDialog();
            _initCancelDialog();
            _initSeaDialog();
            _initSelectColleague();
            _initList();
            _initEvent();
        }();
    };
});