define(function (require, exports, module) {
    var Dialog = require("dialog"),
        util = require('util'),
        Pagination = require('uilibs/pagination2');
    var tpl = require('modules/crm-select-product/crm-select-product.html');
    var moment = require('moment');
    var DataTables = require('datatable');
    var tplStyle = require('modules/crm-select-opp/crm-select-opp.css');
    var AddProductDialog = Dialog.extend({
        attrs: {
            "title": "&nbsp;",
            "url": "/Product/GetProductList/",
            "content": $(tpl).filter('.crm-add-product-dialog'),
            "isMultiSelect": false,
            "hasDeptTree": false,
            "hasWorkLeaveBtn": false,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "width": 800,
            "height": 700,
            "condition": {},
            "defaultCondition": {
                keyword: '',
                listTagOptionID: '407,0',
                sortType: 0,
                pageSize: 10,
                pageNumber: 1
            },
            "needToRest": false,
            "result": [],
            salesOpportunityID: undefined,
            productID: undefined,
            productName: undefined,
            unit: undefined,
            unitAmount: undefined
        },
        setup: function () {
            var result = AddProductDialog.superclass.setup.apply(this, arguments);
            var cond = _.extend({}, this.get('defaultCondition'), this.get("condition"));
            this.set("condition", cond);
            return result;
        },
        render: function () {
            var result = AddProductDialog.superclass.render.apply(this, arguments);

            return result;
        },
        hide: function (noCloseParent) {
            var result = AddProductDialog.superclass.hide.apply(this, arguments);
            this.reset();
            if(noCloseParent !== true)
                this.v.hide();
            return result;
        },
        reset: function () {
            var $el = this.element;
            $('.productName', $el).val('');
            $('.count', $el).val('');
            $('.description', $el).val('');
            $('.unit', $el).val('');
            $('.unitAmount', $el).val('');
            this.set('productName', '');
            this.set('unit', '');
            this.set('unitAmount', '');
            this.set('productID', '');
        },
        show: function (opt) {
            var result = AddProductDialog.superclass.show.apply(this, arguments);
            if(opt){
                if(opt.productName)
                    this.set('productName', opt.productName);
                if(opt.unit)
                    this.set('unit', opt.unit);
                if(opt.unitAmount)
                    this.set('unitAmount', opt.unitAmount);
                if(opt.productID)
                    this.set('productID', opt.productID);

                this.fillFormData();
            }
            return result;
        },
        events: {
            'click .add-product-back': "_cancel",
            'click .add-product-cancel': "_cancel",
            'click .add-product-submit': "_submit"
        },
        _submit: function (e) {
            var self = this;
            var productName = this.get('productName');
            var unit = this.get('unit');
            var unitAmount = parseFloat($('.unitAmount', this.element).val())|| 0;
            if(isNaN(unitAmount)){
                unitAmount = parseFloat(this.get('unitAmount'));
            }
            var salesOpportunityID = this.get('salesOpportunityID');
            var productID =this.get('productID');

            var count = parseFloat($('.count', this.element).val());
            if(isNaN(count))
                count = 0;
            if((unitAmount+'').length>16){
                util.alert('请填写正确单价');return;
            }
            var description = $('.description', this.element).val() || '';
            unit = $('.unit', this.element).val() || '';
            util.api({
                "url": '/SalesOpportunity/AddOppProductRelation',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    salesOpportunityID: salesOpportunityID,
                    productName: productName,
                    productID: productID,
                    unit: unit,
                    unitAmount: unitAmount,
                    count: count,
                    description: description
                },
                "success": function (data) {
                    if (data.success) {
                        self.hide()
                        self.v.hide();
                        util.remind(2,"保存成功");
                        self.v.trigger('success');
                    }
                }
            }, {
                "submitSelector": ''
            });

        },
        //取消
        _cancel: function (e) {
            this.hide(true);
        },
        destroy: function () {
            var result;
            result = Pagination.superclass.destroy.apply(this, arguments);
            this.reset();
            return result;
        },
        fillFormData: function(){
            var productName = this.get('productName');
            var unit = this.get('unit');
            var unitAmount = this.get('unitAmount');
//            salesOpportunityID: undefined,
//                productID: undefined,

            if(productName)
                $('.productName', this.element).val(productName);
            if(unit)
                $('.unit', this.element).val(unit);
            if(unitAmount)
                $('.unitAmount', this.element).val(unitAmount);
        }
    });

    var SelectProduct = Dialog.extend({
        attrs: {
            "title": "选择产品",
            "url": "/Product/GetProductList/",
            "content": $(tpl).filter('.crm-select-product-dialog'),
            "isMultiSelect": false,
            "hasDeptTree": false,
            "hasWorkLeaveBtn": false,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "width": 800,
            "height": 603,
            "condition": {},
            "defaultCondition": {
                keyword: '',
                listTagOptionID: '407,0',
                sortType: 0,
                pageSize: 10,
                pageNumber: 1
            },
            "needToRest": false,
            "result": [],
            salesOpportunityID: undefined,
            "isLoadServerData": false
        },
        setup: function () {
            var result = SelectProduct.superclass.setup.apply(this, arguments);
            var cond = _.extend({}, this.get('defaultCondition'), this.get("condition"));
            this.set("condition", cond);
            return result;
        },
        render: function () {
            var result = SelectProduct.superclass.render.apply(this, arguments);
            this._initTable();
            this.addProductDialog = new AddProductDialog({
                salesOpportunityID: this.get('salesOpportunityID')
            });
            this.addProductDialog.v = this;
            return result;
        },
        hide: function () {
            var result = SelectProduct.superclass.hide.apply(this, arguments);
            this.reset();
            this.addProductDialog.hide(true);
            return result;
        },
        show: function () {
            var result = SelectProduct.superclass.show.apply(this, arguments);
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
            'click .fs-col-select-button-close': "hide",
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
            if(data && data.products)
                var products = data.products;
            _.each(products, function (salesOpportunity) { //目录列表
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
            this.addProductDialog.show({
                salesOpportunityID: this.get('salesOpportunityID'),
                productID: rowData.productID,
                productName: rowData.name,
                unit: rowData.unit,
                unitAmount: rowData.unitAmount
            });
//            this.trigger("selected", rowData);
//            this.hide();
        },
        _initTable: function () {
            var tableEl = $('.crm-product-list-datatable', this.element);
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
            })
            this.oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip', //拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": [
                    //名称
                    {
                        "mData": "name",
                        "sWidth": "200px",
                        "sClass": "black-name crmtable-sort-name",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';

                            return newData;
                        }
                    },
                    //单位
                    {
                        "mData": "unit",
                        "sWidth": "76px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //单价
                    {
                        "mData": "unitAmount",
                        "sWidth": "76px",
                        "sType": "",
                        "sClass": "product-unitAmount",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var fData = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                            var newData = '<span title="' + fData + '">' + fData + '</span>';
                            return newData;
                        }
                    },
                    //产品线
                    {
                        "mData": "productLineTagOptionName",
                        "sWidth": "76px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
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

                            self.products = responseData.value.products;
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
                "bDestroy" : true,
                //显示表格信息
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": '<span class="empty-tip">没有获取到产品</span>'
                }
            });
        },
        refresh: function (condition) {
            if(condition){
                this.set('condition', _.extend(this.get('condition'), condition));
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
    module.exports = SelectProduct;
});