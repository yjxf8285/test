/**
 *
 在客户下创建合同，

 */

define(function (require, exports, module) {
    var Dialog = require("dialog"),
        util = require('util'),
        Pagination = require('uilibs/pagination2');
    var tpl = require('modules/crm-select-opp/crm-select-opp.html');
    var moment = require('moment');
    var DataTables = require('datatable');
//    var tplStyle = require('modules/crm-select-opp/crm-select-opp.css');
    var SelectOpp = Dialog.extend({
        attrs: {
            "title": "选择联机会",
            "url": '/SalesOpportunity/GetSalesOpportunityList',
            "content": tpl,
            "isMultiSelect": false,
            "hasDeptTree": false,
            "hasWorkLeaveBtn": false,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "width": 800,
            "height": 535,
            "condition": {},
            "defaultCondition": {
                customerID: 0,
                employeeID: util.getCurrentEmp().employeeID,
                queryType: 1,
                sortType: 1,
                keyword: '',
                beginSalesAmount: -1,
                endSalesAmount: -1,
                dealDayType: 0,
                beginDealTime: -1,
                endDealTime: -1,
                beginStageDays: -1,
                endStageDays: -1,
                salesStageNos: '',
                tagOptionIDsJson: '',
                isReview: -1,
                isOwner: -1,
                pageSize: 10,
                pageNumber: 1
            },
            "needToRest": false,
            "result": [],
            "isLoadServerData": false
        },
        setup: function () {
            if(this.get("condition") && this.get("condition").customerID){
                this.get('defaultCondition').customerID = this.get("condition").customerID
            }
            var result = SelectOpp.superclass.setup.apply(this, arguments);
            var cond = _.extend({}, this.get('defaultCondition'), this.get("condition"));
            this.set("condition", cond);
            return result;
        },
        render: function () {
            var result = SelectOpp.superclass.render.apply(this, arguments);
            this._initTable();
            return result;
        },
        hide: function () {
            var result = SelectOpp.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        show: function () {
            var result = SelectOpp.superclass.show.apply(this, arguments);
            try{
                this.refresh();
                this.pagination.reset();
            }catch(ex){}
            return result;
        },
        reset: function () {
            $(".search-input", this.element).val('');
            this.set('condition', this.get('defaultCondition'));
            this.pagination.jump(1,true);
        },
        events: {
            'click .crm-datatable th': "_crmTableSort",
            'click .crm-datatable tbody tr td': '_selectRow',
            'click .search-button': '_btnSearch',
            'keydown .search-input': '_inputSearch'
        },
        _crmTableSort: function (e) {
            var that = this;
            //表格排序配置
            util.crmTableSortSet({
                element: $('.sort-select-list', this.$el), //排序下拉框
                meEl: $(e.currentTarget),//触发点击事件的元素
                selectData: [//重置下拉框选项数据
                    {
                        "text": "发生变化的在最前面",
                        "value": "0"
                    },
                    {
                        "text": "预计成交金额大的在前面",
                        "value": "3"
                    },
                    {
                        "text": "预计成交日期早的在前面",
                        "value": "4"
                    },
                    {
                        "text": "销售阶段晚的在最前面",
                        "value": "7"
                    },
                    {
                        "text": "表格列排序",
                        "value": "",
                        selected: true
                    }
                ],
                oThs: [
                    {//名称
                        clasName: '.crmtable-sort-name',
                        sortType: [8, 9]//升序值，降序值
                    },
                    {//金额
                        clasName: '.crmtable-sort-expectedsalesamount',
                        sortType: [3, 2]//升序值，降序值
                    },
                    {//预计成交日期
                        clasName: '.crmtable-sort-expecteddealtime',
                        sortType: [4, 5]//升序值，降序值
                    },
                    {//销售阶段
                        clasName: '.crmtable-sort-salesstage',
                        sortType: [7, 6]//升序值，降序值
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });
        },
        _formatTableData: function (responseData) {
            var formatData = [];
            var data = responseData.value;
            var salesOpportunitys = data.salesOpportunitys;
            _.each(salesOpportunitys, function (salesOpportunity) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, salesOpportunity));
            });
            return {
                "aaData": formatData
            };
        },
        _btnSearch: function(){
            this._search();
        },
        _inputSearch: function(e){
            if(e.keyCode == 13){
                this._search();
                e.preventDefault();
            }
        },
        _search: function(e){
            this.get('condition').keyword = $('.search-input', this.element).val();
            this.refresh();
        },
        _selectRow: function(e){
            var rowDataEl = $(e.target).closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));

            this.trigger("selected", rowData);
            this.hide();
        },
        _initTable: function () {
            var tableEl = $('.crm-opp-list-datatable', this.element);
            var self = this;
            self.pagination = new Pagination({
                "element": $('.pagination-wrapper', self.element),
                "pageSize": self.get("condition").pageSize,
                "totalSize": 0,
                "activePageNumber": 1
            });
            self.pagination.on("page", function (val) {
                var condition = self.get("condition");
                condition.pageNumber = val;
                self.set("condition", condition);
                self.refresh();
            });
            if(tableEl.hasClass('dataTable')){
                this.oTable = tableEl;
            }else {
                this.oTable = tableEl.dataTable({
                    "sDom": 'Rlfrtip', //拖拽需要的结构，具体配置见官方API
                    //每列的数据处理
                    "aoColumns": [
                        //名称
                        {
                            "mData": "name",
                            "sWidth": "150px",
                            "sClass": "black-name crmtable-sort-name",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data + '">' + data + '</span>';

                                return newData;
                            }
                        },
                        //负责人
                        {
                            "mData": "owner",
                            "sWidth": "60px",
                            "sClass": "",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data.name + '">' + data.name + '</span>';
                                return newData;
                            }
                        },
                        //客户
                        {
                            "mData": "customerName",
                            "sWidth": "90px",
                            //                        "sType": "numeric-comma",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //类型
                        {
                            "mData": "typeTagOptionName",
                            "sWidth": "80px",
                            "sClass": "",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },

                        //金额
                        {
                            "mData": "expectedSalesAmount",
                            "sWidth": "100px",
                            "sClass": "crmtable-sort-expectedsalesamount",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var fData = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                                var newData = '<span title="' + fData + '">' + fData + '</span>';
                                return newData;
                            }
                        },
                        //预计成交日期
                        {
                            "mData": "expectedDealTime",
                            "sWidth": "100px",
                            "sClass": "crmtable-sort-expecteddealtime",
                            //                        "sType": "numeric-comma",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + moment.unix(data).format('YYYY年MM月DD日') + '">' + moment.unix(data).format('YYYY年MM月DD日') + '</span>';
                                return newData;
                            }
                        },
                        //空列
                        {
                            "mData": "lastEditTime",
                            "sClass": "th-blank",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '';
                                return newData;
                            }
                        }
                    ],
                    //接口地址
                    "sAjaxSource": this.get('url'),
                    //请求和回调处理
                    "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                        if (!self.get('isLoadServerData')) return;

                        var requestData = self.get('condition');
                        oSettings.jqXHR = util.api({
                            "dataType": 'json',
                            "type": "get",
                            "url": sSource,
                            "data": requestData,
                            beforeSend: function () {
                                util.showGlobalLoading(1);
                            },
                            "success": function (responseData) {
                                var totalCount = responseData.value.totalCount;
                                util.hideGlobalLoading(1);
                                self.responseData = responseData;

                                self.salesOpportunitys = responseData.value.salesOpportunitys;
                                fnCallback(self._formatTableData(responseData));
                                self.pagination.setTotalSize(totalCount);
                            }
                        });
                    },
                    "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                    "bFilter": false,
                    //搜索栏  
                    "bPaginate": false, //是否启用分页
                    "bInfo": false,
                    //显示表格信息
                    "oLanguage": {
                        //无结果时显示的内容
                        "sEmptyTable": '<span class="empty-tip">没有获取到机会</span>'
                    }
                });
            }
        },
        refresh: function (condition) {
            if(condition){
                this.set('condition', _.extend({}, this.get('condition'), condition));
            }
            this.set('isLoadServerData', true);
            this.oTable.fnReloadAjax();
        },
        _submit: function (e) {
            if (this.get("isMultiSelect")) {
                this.trigger("selected", this.get("result"));
            } else {
                this.trigger("selected", this.get("result")[0]);
            }
            this.hide();
        },
        //取消
        _cancel: function (e) {
            this.hide();
        },

        destroy: function () {
            var result;
            result = Pagination.superclass.destroy.apply(this, arguments);
            this.reset();
            return result;
        }
    });
    module.exports = SelectOpp;
});