/**
 * FS下选择客户的弹框
 * Created by liuxf on 2014-07-21.
 */
define(function (require, exports, module) {
    var Dialog = require("dialog");
    var util = require('util');
    var tpl = require('modules/fs-select-customer/fs-select-customer.html');
//    var tplStyle = require('modules/fs-select-customer/fs-select-customer.css');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box'); //搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var FsSelectCustomer = Dialog.extend({
        "attrs": {
            "title": "",
            "width": 894,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "content": tpl,
            "url": '/FCustomer/GetFCustomers',
            "condition": {
                employeeID: util.getCrmData().currentEmp.employeeID,//int，员工ID
                isFirstChar: false,// bool，是否首字母查询
                listTagOptionID: "",//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 0,
                queryType: 999,//int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;历史记录=999)
                keyword: "",
                pageSize: 10,
                pageNumber: 1
            },
            "fCustomerDatas": [],//用来存储已选择的客户数据
            "className": 'fs-select-customer-dialog',
            "hasShown": false
        },
        "events": {
            'click .crm-button-submit': 'submit',
            "click .checkbox-selectall-btn": "_checkboxSelectall", //选择所有复选框
            "click .left-listmenu li": "leftListMenu", //左侧菜单选项
            "click .crm-datatable tbody tr": "tr", //tr点击
            "click .customers-follow": "_followSwitch", //关注
            'click .crm-button-cancel': 'hide'
        },
        "render": function () {
            var result = FsSelectCustomer.superclass.render.apply(this, arguments);
            var historyData = util.getCustomerConfig() || [];
            this.set('historyData', historyData);
            this.setupComponent();
            this.load();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = FsSelectCustomer.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        //显示
        "show": function (val) {
            var result = FsSelectCustomer.superclass.show.apply(this, arguments);
            this.set('hasShown', true);
            var historyData = util.getCustomerConfig() || [];
            if (val) {
                this.set('fCustomerDatas', val);
                $('.selected-count .num', this.element).text(val.length);
                this.lightTr();//根据已选择的数据高亮显示已选择数据
            }
            this.set('historyData', historyData);//每次show的时候都获取一下历史记录
            this.refresh({
                isFirstChar: false,// bool，是否首字母查询
                listTagOptionID: "",//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 0,
                queryType: 999,//int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;历史记录=999)
                keyword: "",
                pageSize: 10,
                pageNumber: 1
            });//默认参数
            return result;
        },
        //根据已选择的数据高亮显示已选择数据
        lightTr: function (trEl) {
            var that = this;
            var fCustomerDatas = this.get('fCustomerDatas');
            !trEl && (trEl = $('.crm-datatable tbody tr', this.element));//因为异步请求时TR元素会被重置，所以要传进来。
            if (fCustomerDatas.length > 0) {
                _.each(fCustomerDatas, function (item) {
                    var customerID = item.customerID;
                    trEl.each(function () {
                        var $this = $(this);
                        var trId = $this.find('.mn-checkbox-item').data('value');
                        if (trId == customerID) {
                            $this.addClass('row_selected');
                            $this.find('.mn-checkbox-item').addClass('mn-selected');
                        }
                    });
                });
            }
        },
        //提交
        submit: function () {
            var fCustomerDatas = this.get('fCustomerDatas');
            this.trigger('selected', fCustomerDatas);
            this.hide();
        },
        //重置
        "reset": function () {
            this.set('fCustomerDatas', []);//已选择设置为空
            this.searchBox.clear();
            this.pagination.reset();//重置分页
            $('.selected-count .num', this.element).text('0');//已选择数量为0
            $('.checkbox-for-comtable .mn-checkbox-item', this.element).removeClass('mn-selected'); //先清空多选框
            $('tbody tr', this.element).removeClass('row_selected');//清空TR选中
            $('.left-listmenu li', this.element).removeClass('selected').eq(1).addClass('selected');
        },

        //表格的TR点击逻辑
        tr: function (e) {
            var meEl = $(e.currentTarget);
            var isSelected = meEl.is('.row_selected');
            var mnCheckboxItemEl = $('.mn-checkbox-item', meEl);
            var fCustomerDatas = this.get('fCustomerDatas');
            var thisRowData = this.oTable.fnGetData(meEl.get(0));
            if(!thisRowData){//如果是空记录就中断执行
                return false;
            }
            var isContains = _.some(fCustomerDatas, function (obj) {
                if (obj.customerID == thisRowData.customerID) {
                    return true;
                }
            });//如果A包含B返回true
            if (isSelected) {//选中时
                meEl.removeClass('row_selected');
                mnCheckboxItemEl.removeClass('mn-selected');
                //从数组中删除满足条件的那个元素
                fCustomerDatas = _.reject(fCustomerDatas, function (obj) {
                    return obj.customerID == thisRowData.customerID;
                });
            } else {
                meEl.addClass('row_selected');
                mnCheckboxItemEl.addClass('mn-selected');
                !isContains && fCustomerDatas.push(thisRowData);
            }
            $('.selected-count .num', this.element).text(fCustomerDatas.length);
            this.set('fCustomerDatas', fCustomerDatas);
            e.stopPropagation();//目的是阻止模拟checkbox组件的默认勾选事件
        },

        //关注
        _followSwitch: function (e) {
            e.stopPropagation();
            var $el = $(e.target),
                customerID = $el.parents('tr').children().eq(0).find('span').attr('data-value');
            if ($el.hasClass('customers-following')) {
                //取消关注
                util.api({
                    "url": '/FCustomer/CancelFCustomerFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { customerID: customerID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-following').addClass('customers-nofollow')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/FCustomer/FCustomerFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { customerID: customerID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-nofollow').addClass('customers-following')
                        }
                    }
                });
            }
        },
        leftListMenu: function (e) {
            var meEl = $(e.currentTarget);
            var queryType = meEl.data('value');
            $('.left-listmenu li', this.element).removeClass('selected');
            meEl.addClass('selected');
            this.refresh({
                queryType: queryType,
                keyword: ""//
            });
            this.searchBox.clear();
        },
        //获取数据
        "load": function (data) {
            var that = this;
            var condition = this.get('condition');
            data && (data = _.extend(condition, data));
            this.setDataTabel();
        },
        //刷新
        refresh: function (data) {
            var defCondition = this.get('condition');
            var newCondition = {};
            data && (newCondition = _.extend(defCondition, data));
            this.set('condition', newCondition);
            $('.checkbox-for-comtable .mn-checkbox-item', this.element).removeClass('mn-selected'); //先清空多选框
            this.oTable.fnReloadAjax();
        },
        setDataTabel: function () {
            var that = this;
            var elEl = this.element;
            var tableEl = elEl.find('.crm-datatable');
            if (!this.oTable) {
                this.oTable = tableEl.dataTable({
                    "sDom": 'Rlfrtip',//拖拽需要的结构，具体配置见官方API
                    //每列的数据处理
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
                        //关注
                        /*  {
                         "mData": "followTime",
                         "sWidth": "24px",
                         "sClass": "customer-foolo",
                         "bSortable": false,
                         "mRender": function (data, type, full) { //第2列内容
                         var newData;
                         if (data > 0) {
                         newData = '<div class="customers-follow customers-following" title="取消关注"></div>';
                         } else {
                         newData = '<div class="customers-follow customers-nofollow" title="关注"></div>';
                         }
                         return newData;
                         }
                         },*/
                        //名称
                        {
                            "mData": "name",
                            "sWidth": "130px",
                            "sClass": "black-name crmtable-sort-name",
                            "bSortable": true,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //负责人
                        {
                            "mData": "ownerName",
                            "sWidth": "70px",
                            "sClass": "black-name crmtable-sort-ownername",
                            "bSortable": true,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //客户状态
                        {
                            "mData": "ownerName",
                            "sWidth": "110px",
                            "bSortable": false,
                            "mRender": function (data, type, full) {
                                var useData = full.customerStateTagOptionName || full.customerStateTagOption || '';
                                var newData = '<span title="' + useData + '">' + useData + '</span>';
                                return newData;
                            }
                        },
                        //最后修改时间
                        {
                            "mData": "lastUpdateTime",
                            "sWidth": "95px",
                            "sClass": "crmtable-sort-lastupdatetime",
                            "bSortable": true,
                            "asSorting": [ "desc", "asc" ],
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                                return newData;
                            }
                        },
                        //创建时间
                        {
                            "mData": "createTime",
                            "sWidth": "95px",
                            "sClass": "crmtable-sort-createtime",
                            "bSortable": true,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                                return newData;
                            }
                        }
                        //空列
                        /*  {
                         "mData": "createTime",
                         "sClass": "th-blank",
                         "bSortable": false,
                         "mRender": function (data, type, full) { //第2列内容
                         var newData = '';
                         return newData;
                         }
                         }*/
                    ],
                    //接口地址
                    "sAjaxSource": this.get('url'),
                    //请求和回调处理
                    "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                        var condition = that.get('condition');
                        var fCustomerDatas = that.get('fCustomerDatas');//已选数据
                        var historyData = that.get('historyData');
                        if (condition.queryType == 999) {//999代表历史记录
                            that.pagination.setTotalSize(historyData.length);

                            if (historyData.length > 0) {
                                fnCallback(that._formatTableData(historyData));
                                that.lightTr();//根据已选择的数据高亮显示已选择数据
                                that.pagination.hide();
                            } else { //如果没有历史记录请求最新20条我的客户
                            	if(that.get('hasShown')) {
                            		util.api({
                                        "dataType": 'json',
                                        "type": "get",
                                        "url": '/FCustomer/GetFCustomers',
                                        "data": {
                                            isFirstChar: false,// bool，是否首字母查询
                                            listTagOptionID: "",//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                                            sortType: 8,
                                            employeeID: util.getCrmData().currentEmp.employeeID,//int，员工ID,
                                            queryType: 1,//int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;历史记录=999)
                                            keyword: "",
                                            pageSize: 20,
                                            pageNumber: 1
                                        },
                                        "success": function (responseData) {
                                            fnCallback(that._formatTableData(responseData));
                                            that.lightTr();//根据已选择的数据高亮显示已选择数据
                                            that.pagination.hide();
                                        }
                                    });
                            	}
                            }

                        } else if (condition.queryType == 888) {//代表已选择
                            fnCallback(that._formatTableData(fCustomerDatas));
                            if (fCustomerDatas.length > 0) {
                                $('tbody tr', that.element).addClass('row_selected');
                                $('tbody tr .mn-checkbox-item', this.element).addClass('mn-selected');
                            }
                            that.pagination.hide();
                        } else {
                            oSettings.jqXHR = util.api({
                                "dataType": 'json',
                                "type": "get",
                                "url": sSource,
                                "data": condition,
                                beforeSend: function () {
                                    util.showGlobalLoading(1);//显示黄条加载提示
                                },
                                "success": function (responseData) {
                                    util.hideGlobalLoading(1);//隐藏黄条加载提示
                                    var totalCount = responseData.value.totalCount;
                                    that.pagination.setTotalSize(totalCount);
                                    fnCallback(that._formatTableData(responseData));
                                    var trEl = $('.crm-datatable tbody tr', that.element);
                                    that.lightTr(trEl);//根据已选择的数据高亮显示已选择数据
                                }
                            });
                        }
                    },
                    "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                    "bFilter": false, //搜索栏  
                    "bPaginate": false, //是否启用分页(默认为ture)
                    "sPaginationType": 'full_numbers', //分页样式，支持两种内置方式，two_button 和 full_numbers, 默认使用 two_button。
                    "bInfo": false, //显示表格信息
                    "oLanguage": { //多语言配置
                        //无结果时显示的内容
                        "sEmptyTable": '<span class="empty-tip">您可以通过搜索框搜索客户，或通过左侧“我的客户”手动选择。</span>',
                        "sProcessing": "正在加载中......",
                        "sLengthMenu": "每页显示 _MENU_ 条记录",
                        "sZeroRecords": "对不起，查询不到相关数据！",
                        "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                        "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                        "sSearch": "搜索",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sPrevious": "上一页",
                            "sNext": "下一页",
                            "sLast": "末页"
                        }
                    }
                });
            }

        },
        /**
         * 格式化json为了表格数据
         * 因为datatable只能识别数组类型的数据
         */
        "_formatTableData": function (responseData) {
            var formatData = [];
            var customers = [];
            if (responseData.value) {
                customers = responseData.value.customers;
            } else {
                customers = responseData;
            }
            _.each(customers, function (customer) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, customer));
            });
            return {
                "aaData": formatData
            };
        },
        //选择所有复选框
        _checkboxSelectall: function (e) {
            var meEl = $(e.currentTarget);
            var tableEl = this.element.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable', tableEl);
            var checkboxItemEl = allCheckboxEl.find('.mn-checkbox-item');
            if (meEl.is('.mn-selected')) {
                checkboxItemEl.removeClass('mn-selected');
                $('tbody tr', this.oTable).removeClass('row_selected');
            } else {
                checkboxItemEl.addClass('mn-selected');
                $('tbody tr', this.oTable).addClass('row_selected');
            }
        },
        //配置组件
        "setupComponent": function () {
            var that = this;
            if (!this.searchBox) {
                this.searchBox = new SearchBox({
                    "element": $(".search-warp", this.element),
                    "placeholder": '请输入搜索关键字'
                });
            }
            this.searchBox.on('search', function (keyword) {
                var len = keyword.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键字长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    that.refresh({
                        keyword: keyword,
                        queryType: 1// int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;)
                    });
                }
                $('.left-listmenu li', that.element).removeClass('selected');
                $('.search-result-tip', that.element).css('visibility', 'visible');
            });
            //实例化分页组件
            if (!this.pagination) {
                this.pagination = new Pagination({
                    "element": $('.pagination-wrapper', this.element),
                    "pageSize": 10,
                    "totalSize": 0,
                    "activePageNumber": 1
                });
            }
            //分页事件
            this.pagination.on('page', function (val) {
                that.refresh({
                    pageNumber: val
                });
            });
        }

    });
    module.exports = FsSelectCustomer;


});