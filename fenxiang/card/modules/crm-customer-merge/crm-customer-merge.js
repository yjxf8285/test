/**
 * 客户合并弹框
 */
define(function (require, exports, module) {
    var Dialog = require("dialog");
    var util = require('util');
    var tpl = require('modules/crm-customer-merge/crm-customer-merge.html');
    var tplStyle = require('modules/crm-customer-merge/crm-customer-merge.css');
    var moment = require('moment');
    var DataTables = require('datatable');
    var SearchBox = require('uilibs/search-box'); //搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var CustomerMerge = Dialog.extend({
        "attrs": {
            "title": "客户合并",
            "width": 740,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "content": tpl,
            "url": '/FCustomer/GetAllFCustomers',
            "condition": {
                employeeID: 0,//0-表示全部
                isFirstChar: false,// bool，是否首字母查询
                sortType: 2,
                keyword: "",
                pageSize: 8,
                pageNumber: 1
            },
            "fCustomerDatas": [],//用来存储已选择的客户数据
            "targetCustomer": {},//用来存储合并到的用户
            "className": 'fs-customer-merge-dialog'
        },
        "events": {
            'click .crm-button-submit': 'submit',
            "click .crm-datatable tbody tr": "tr", //tr点击
            'click .crm-button-cancel': 'hide'
        },
        "render": function () {
            var result = CustomerMerge.superclass.render.apply(this, arguments);
            this.setupComponent();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = CustomerMerge.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        //显示
        "show": function (customer) {
            var result = CustomerMerge.superclass.show.apply(this, arguments);
            this.set('targetCustomer', customer);
            var condition = this.get('condition');
            condition.excludeCustomerIDs = customer.customerID;
            this.set('condition', condition);
            $('.merge-target', this.element).html(customer.customerName);
            this.load();
            return result;
        },
        submit: function () {
        	var that = this,
        		fCustomerDatas = this.get('fCustomerDatas');
        	if(fCustomerDatas.length) {
        		var msg = ['确定将客户:'],
        			ids = [];
                $.each(fCustomerDatas, function(idx, item){
                	msg.push('“' + item.name + '”');
                	if(idx != fCustomerDatas.length-1) {
                		msg.push('，')
                	}
                	ids.push(item.customerID);
                });
                msg.push('合并到“' + this.get('targetCustomer').customerName + '”吗?');
                util.confirm(msg.join(''), '合并客户', function(){
                	util.api({
                        "data":{targetCustomerID:that.get('targetCustomer').customerID, sourceCustomerIDs: ids},
                        "url":"/Fcustomer/MergeCustomer",
                        "success":function(responseData){
                            if(responseData.success){
                                that.trigger('success');
                                that.hide();
                            }
                        }
                    })
                });
        	} else {
        		util.alert('您没有选中任何客户。');
        	}
        },
        //重置
        "reset": function () {
            this.searchBox.clear();
            $('.checkbox-for-comtable .mn-checkbox-item', this.element).removeClass('mn-selected'); //先清空多选框
            $('tr', this.element).removeClass('row_selected');//清空TR选中
            this.refresh({ pageNumber: 1 });//回到第一页
            this.pagination.reset();//重置分页
            this.set('fCustomerDatas', []);
            $('.merge-count', this.element).html('0');
            $('.merge-search-title', this.element).html('全部客户：');
            var condition = this.get('condition');
            condition.keyword = '';
            this.set('condition', condition);
        },

        //表格的TR点击事件
        tr: function (e) {
            var meEl = $(e.currentTarget);
            if(meEl.find('.dataTables_empty')[0]) return;
            var isSelected = meEl.is('.row_selected');
            var mnCheckboxItemEl = $('.mn-checkbox-item', meEl);
            var fCustomerDatas = this.get('fCustomerDatas');
            var thisRowData = this.oTable.fnGetData(meEl.get(0));
            var isContains = _.some(fCustomerDatas, function (obj) {
                if (obj.customerID == thisRowData.customerID) {
                    return true;
                }
            });//如果A包含B返回true
            if (isSelected) {
                meEl.removeClass('row_selected');
                mnCheckboxItemEl.removeClass('mn-selected');
                fCustomerDatas = _.reject(fCustomerDatas, function (obj) {
                    return obj.customerID == thisRowData.customerID;
                });  // 返回操作结果为false的成员
            } else {
            	if(!isContains && fCustomerDatas.length>4) {
                	util.alert('最多可以选择5个客户');
                	return;
                }
                meEl.addClass('row_selected');
                mnCheckboxItemEl.addClass('mn-selected');
                !isContains && fCustomerDatas.push(thisRowData);
            }

            $('.merge-count', this.element).text(fCustomerDatas.length);
            this.set('fCustomerDatas', fCustomerDatas);
            e.stopPropagation();
        },
        //获取数据
        "load": function (data) {
            var that = this;
            var condition = this.get('condition');
            data && (data = _.extend(condition, data));
            var historyCustomer = util.getCustomerConfig();
            this.setDataTabel();

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
                        //负责人
                        {
                            "mData": "ownerName",
                            "sWidth": "124px",
                            "sClass": "black-name crmtable-sort-ownername",
                            "bSortable": true,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //客户状态
                        {
                            "mData": "customerStateTagOptionName",
                            "sWidth": "124px",
                            "bSortable": false,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        }
                    ],
                    //接口地址
                    "sAjaxSource": this.get('url'),
                    //请求和回调处理
                    "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                        var condition = that.get('condition');
                        var fCustomerDatas = that.get('fCustomerDatas');//已选数据
                        if (condition.queryType == 999) {//999代表历史记录
                            var historyData = util.getCustomerConfig() || [];
                            that.pagination.setTotalSize(historyData.length);
                            fnCallback(that._formatTableData(historyData));
                            //根据已选择的数据高亮显示已选择数据
                            var trEl = $('.crm-datatable tbody tr',this.oTable);
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

                        } else if (condition.queryType == 000) {//代表已选择
                            fnCallback(that._formatTableData(fCustomerDatas));

                            if (fCustomerDatas.length > 0) {
                                $('tbody tr', that.element).addClass('row_selected');
                                $('tbody tr .mn-checkbox-item', this.element).addClass('mn-selected');
                            }

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
                                    //根据已选择的数据高亮显示已选择数据
                                    var trEl = $('.crm-datatable tbody tr',this.oTable);

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
                                }
                            });
                        }


                    },
                    "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                    "bFilter": false, //搜索栏  
                    "bPaginate": false, //是否启用分页
                    "bInfo": false, //显示表格信息
                    "oLanguage": {
                        //无结果时显示的内容
                        "sEmptyTable": '<span class="empty-tip">暂无满足条件的结果</span>'
                    }
                });
            } else {
            	this.refresh(this.get('condition'));
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
        refresh: function (data) {
            var defCondition = this.get('condition');
            var newCondition = {};
            data && (newCondition = _.extend(defCondition, data));
            this.set('condition', newCondition);
            $('.checkbox-for-comtable .mn-checkbox-item', this.element).removeClass('mn-selected'); //先清空多选框
            this.oTable.fnReloadAjax();
        },
        "setupComponent": function () {
            var that = this;
            if (!this.searchBox) {
                this.searchBox = new SearchBox({
                    "element": $(".merge-search-wrap", this.element),
                    "placeholder": '请输入关键字，如：北京宝马东城4S店'
                });
            }

            this.searchBox.on('search', function (keyword) {
                var len = keyword.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                	$('.merge-search-title', that.element).html('搜索结果：')
                    that.refresh({
                        keyword: keyword
                    });
                }
            });
            //实例化分页组件
            if (!this.pagination) {
                this.pagination = new Pagination({
                    "element": $('.pagination-wrapper', this.element),
                    "pageSize": 8,
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
    module.exports = CustomerMerge;


});