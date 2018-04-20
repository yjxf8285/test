/**
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var tpl = require('modules/crm-customer-highseas/crm-customer-highseas.html');
    var Widget = require('widget');
    var util = require('util');
    var DataTables = require('datatable');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination2');//分页组件
    var CustomerInSettingDialog = require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit');

    var CustomerSeas = Widget.extend({
        "attrs": {
            "element": null,
            "aoColumns": [
                //复选框
                {
                    "mData": "customerID",//列数据的数组keyname
                    "sWidth": "26px",//列宽
                    "sClass": "td-checkbox-warp",
                    "bSortable": false,//支持排序
                    "mRender": function (data, type, full) { //第1列内容
                        var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';
                        return mnCheckbox;
                    }
                },
                //名称
                {
                    "mData": "name",
                    "sWidth": "200px",
                    "sClass": "black-name crmtable-sort-name",
                    "bSortable": true,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + data + '">' + data + '</span>';
                        return newData;
                    }
                },
                 //编号
                {
                    "mData": "fCustomerNo",
                    "sWidth": "100px",
                    "sClass": "black-name crmtable-sort-no",
                    "bSortable": true,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + data + '">' + data + '</span>';
                        return newData;
                    }
                },
                //跟进人
                {
                    "mData": "ownerName",
                    "sWidth": "100px",
                    "sClass": "black-name crmtable-sort-ownername",
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + data + '">' + data + '</span>';
                        return newData;
                    }
                },

                //到期时间
                {
                    "mData": "expireTime",
                    "sWidth": "120px",
                    "sClass": "crmtable-sort-expireTime",
                    "bSortable": false,
                    "asSorting": [ "desc", "asc" ],
                    "mRender": function (data, type, full) {
                        if (data == 0) {
                            return "";
                        }
                        var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                        return newData;
                    }
                },
                //超期
                {
                    "mData": "remainingDays",
                    "sWidth": "120px",
                    "sClass": "crmtable-sort-remainingDays",
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        var newData = "";
                        if (data > 0) {
                            newData = '<span title="余' + data + '天">余' + data + '天</span>';
                        }
                        if (data < 0) {
                            newData = '<span style = "color:red" title="超期' + Math.abs(data) + '天">超期' + Math.abs(data) + '天</span>';
                        }
                        return newData;
                    }
                },
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
            ],//设置list显示模版
            "condition": {
                "highSeasID": 0,// int，公海ID
                "employeeID": -1, //int，归属员工，查询所有传-1
                "keyword": "",//string，搜索关键字
                "sortType": 1,//int，排序类型，1：最后更新时间倒序；2：客户名称正序
                "pageSize": 15,//int，分页大小
                "pageNumber": 0//int，当前页
            },
            "oTable": null,
            "firstLoad": true,
            "editDialog": null,
            "overWriteRowClick": false,
            "highSeasPermissions": [],
            "isMyHighSeas": false,
            "isHighSeaAdmin": false,
            "url": "/HighSeas/GetFCustomersHighSeasForManager"
        },

        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .checkbox-selectall-btn": "_checkboxSelectall",//选择所有复选框
            "click .mn-checkbox-item": "_checkOrNot"//选择所有复选框
        },


        "setup": function () {
            var result = CustomerSeas.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },

        //初始化
        "_init": function () {
            this.element.html(tpl);
            this._initDataTabel();
            this._initComponent();
            this._initCustomerInSettingDialog();
        },

        //点击TH表格排序
        _crmTableSort: function (e) {
            var that = this;
            //表格排序配置
            util.crmTableSortSet({
                element: $('.sort-select-list', this.$el), //容器是JQ对象
                meEl: $(e.currentTarget),//触发点击事件的元素
                oThs: [
                    {//名称
                        clasName: '.crmtable-sort-name',
                        sortType: [2, 4]//升序值，降序值
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });

        },

        // 设置组件
        _initComponent: function () {
            var elEl = this.element;
            var that = this;
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var sortSelectListEl = $('.sort-select-list', elEl);
            //排序列表事件
            util.mnEvent(sortSelectListEl, 'change', function (val) {
                util.mnSelect(sortSelectListEl, 'removeOption', 2); //移除掉第3项
                that.get("oTable").fnSort([]);//排序样式重置
                that.refresh({ sortType: val });//刷新
            });
            //实例化分页组件
            this.pagination = new Pagination({
                "element": paginationWarpEl,
                "pageSize": 15,
                "totalSize": 0,
                "activePageNumber": 1
            });


            //分页事件
            this.pagination.on('page', function (val) {
                var condition = that.get("condition");
                condition.pageNumber = val;
                that.set("condition", condition);
                that.refresh(condition);
            });
            //表格的TR点击事件
            elEl.on('click', '.crm-datatable tbody tr td', function () {
                if ($(this).hasClass('td-checkbox-warp')) {//排除掉复选框列
                    return;
                }

                var rowDataEl = $(this).closest('tr');
                var rowData = that.get("oTable").fnGetData(rowDataEl.get(0));
                var cID = rowData.customerID;
                if (that.get("overWriteRowClick")) {
                    that.trigger("rowClick", cID);
                    return;
                }
                //设置页面传1
                var dialogType = 0;
                var isHighSeaAdmin = that.get("isHighSeaAdmin");
                var isMyHighSeas = that.get("isMyHighSeas");
                //我的公海页面
                if (isMyHighSeas) {
                    //是管理员传2
                    if (isHighSeaAdmin) {
                        dialogType = 2;
                    } else {
                        //非管理员传1
                        dialogType = 1;
                    }
                }
                that.get("editDialog").show({
                    customerID: cID,
                    dialogType: dialogType
                });
            });
        },
        //更新数据

        // 请求数据
        //        load: function () {
        //            this.setDataTabel();//实例化datatable(所有请求数据从实例化表格开始)
        //            this.options.isLoadServerData = true;
        //        },
        // 刷新数据
        "refresh": function (condition) {
            this.set("firstLoad", false);
            util.mnReset($(".crm-customer-highseas-select-all", this.element));
            if (condition) {
                condition = _.extend(this.get("condition"), condition);
                this.set("condition", condition);
                this.pagination.jump(condition.pageNumber,true);
            }
            this.get("oTable").fnReloadAjax();
        },
        // datatabel表格配置
        "_initDataTabel": function () {
            var that = this;
            var tableEl = $('.crm-table-bd .crm-datatable', this.element);
            var oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip',//拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": that.get("aoColumns"),
                //接口地址
                "sAjaxSource": that.get("url"),
                //请求和回调处理
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                    if (that.get("firstLoad")) {
                        return;
                    }
                    var requestData = that.get("condition");

                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": sSource,
                        "data": requestData,
                        beforeSend: function () {
                            util.showGlobalLoading(1);//显示黄条加载提示
                        },
                        "success": function (responseData) {
                            fnCallback(that._formatTableData(responseData));
                            var highSeasPermissions = responseData.value.highSeas.highSeasPermissions;
                            that.set("highSeasPermissions", highSeasPermissions);
                            var isHighSeaAdmin = false;
                            var currentEmployID = util.getCrmData().currentEmp.employeeID;
                            var result = _.find(highSeasPermissions, function (item) {
                                return item.employeeID == currentEmployID;
                            });
                            if (result) {
                                isHighSeaAdmin = result.isAdmin;
                            }
                            that.set("isHighSeaAdmin", isHighSeaAdmin);
                            that.trigger("isAdmin", isHighSeaAdmin);
                            util.hideGlobalLoading(1);//隐藏黄条加载提示
                            var totalCount = responseData.value.totalCount;
                            that.pagination.setTotalSize(totalCount);
                            that.trigger("refreshed", totalCount);
                            var selectedItems = that.getSelectItems();
                            if (selectedItems.length > 0) {
                                that.trigger("select");
                            } else {
                                that.trigger("unselect");
                            }
                        }
                    });
                },
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                "bFilter": false, //搜索栏  
                "bPaginate": false, //是否启用分页
                "bInfo": false, //显示表格信息
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": '<span class="empty-tip">该条件下，没有客户</span>'
                }
            });
            this.set("oTable", oTable);
        },

        "_initCustomerInSettingDialog": function () {
            var self = this;
            var editDialog = new CustomerInSettingDialog();
            editDialog.on("success", function () {
                self.refresh(self.get("condition"));
            });
            this.set("editDialog", editDialog);
        },
        /**
         * 格式化json为了表格数据
         * 因为datatable只能识别数组类型的数据
         */
        "_formatTableData": function (responseData) {
            return {
                "aaData": responseData.value.customers
            };
        },
        //选择所有复选框
        _checkboxSelectall: function (e) {
            var meEl = $(e.currentTarget);
            var tableEl = $('.crm-table-bd .crm-datatable tbody', this.element);
            var allCheckboxEl = $('.checkbox-for-comtable', tableEl);
            var checkboxItemEl = allCheckboxEl.find('.mn-checkbox-item');
            if (meEl.is('.mn-selected')) {
                checkboxItemEl.removeClass('mn-selected');
                $('tbody tr', this.oTable).removeClass('row_selected');
            } else {
                checkboxItemEl.addClass('mn-selected');
                $('tbody tr', this.oTable).addClass('row_selected');
            }
            var selectedItems = this.getSelectItems();
            if (selectedItems.length > 0) {
                this.trigger("select");
            } else {
                this.trigger("unselect");
            }
        },

        "_checkOrNot": function (e) {
            var currentEl = $(e.currentTarget);
            var val = currentEl.attr("data-value");
            var selectedItems = this.getSelectItems();
            if (!currentEl.hasClass("mn-selected")) {
                currentEl.parent().parent().parent().addClass('row_selected');
                if (selectedItems.length == 0) {
                    this.trigger("select");
                }
            } else {
                currentEl.parent().parent().parent().removeClass('row_selected');
                if (selectedItems.length == 1) {
                    this.trigger("unselect");
                    util.mnReset($(".crm-customer-highseas-select-all", this.element));
                }
            }
        },

        "getSelectItems": function () {
            var result = [];
            var tableEl = $('.crm-table-bd .crm-datatable tbody', this.element);
            _.each($(".mn-selected", tableEl), function (item) {
                result.push($(item).attr("data-value"));
            });
            return result;
        },
        // 清空
        "destroy": function () {
            var result = CustomerSeas.superclass.destroy.apply(this, arguments);
            this.element.empty();
            return result;
        }
    });

    module.exports = CustomerSeas;
});