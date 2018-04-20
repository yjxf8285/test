/**
 * CRM - 产品
 * @author liuxiaofan
 * 2014-04-02
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-product-list/crm-product-list.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var ImportDialog = require('modules/crm-object-import/crm-object-import');//导入产品
    var DataTables = require('datatable');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination2');//分页组件
    var ProductDialog = require('modules/crm-product-edit/crm-product-edit');

    /**
     * CRM - 产品
     */
    var ProductList = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'product-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-product-list-template').html()), //模板
        options: {
            warpEl: null,//父级容器
            url: "",
            data: {
                keyword: '',//搜索关键字
                //                listTagOptionID: '407,0',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 0,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                pageSize: 10,//分页大小
                //                "totalSize": 38,//一共多少条
                pageNumber: 1//当前页
            }
        },
        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .create-product-btn": "_createProduct", //新建产品按钮
            "click .product-import-btn": "_productImport", //导入产品
            "click .delete-product-btn": "_deleteProduct", //删除产品按钮
            "click .checkbox-selectall-btn": "_checkboxSelectall" //选择所有复选框
        },
        _productImport: function(){
        	this.importDialog.show();
        },
        //点击TH表格排序
        _crmTableSort: function (e) {
            var that = this;
            /*
            *如果此时是拖拽事件
            *则直接返回
            */
            var cursor=$(e.target).css('cursor');
            if(cursor=="col-resize") return;
            //表格排序配置
            util.crmTableSortSet({
                element: $('.sort-select-list', this.$el), //排序下拉框
                meEl: $(e.currentTarget),//触发点击事件的元素
                oThs: [
                    {//名称
                        clasName: '.crmtable-sort-name',
                        sortType: [2, 3]//升序值，降序值
                    },
                    {//最后修改时间
                        clasName: '.crmtable-sort-lastedittime',
                        sortType: [1, 0]//升序值，降序值
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });
        },
        // 新建产品按钮
        _createProduct: function () {
            this.createNewProductDialog.show();
        },

        //删除产品
        _deleteProduct: function () {
            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var productIDs = [];
            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    productIDs.push($(this).data('value'));
                }
            });
            if (productIDs.length > 0) {
                util.confirm('你确定要删除选中的' + productIDs.length + '个产品吗？', '', function () {
                    util.api({
                        "url": '/Product/DeleteProducts',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "productIDs": productIDs
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var result = responseData.value.result;
                                var resultstr = '';
                                var itemResultStr = '';
                                var delYesCount = 0;
                                var delNoCount = 0;
                                _.each(result, function (item, index) {
                                    var productID = item.value;
                                    var isSuccess = item.value1;
                                    var describe = item.value2;
                                    var name = '';
                                    _.each(that.products, function (product, index) {
                                        if (product.productID === productID) {
                                            name = product.name;
                                        }
                                    });
                                    if (!isSuccess) {
                                        itemResultStr += name + '删除失败，原因：' + describe + '</br>';
                                        delNoCount++;
                                    } else {
                                        delYesCount++;
                                    }
                                });
                                resultstr += itemResultStr + '本次操作有' + delYesCount + '个成功，' + delNoCount + '个失败';
                                util.alert(resultstr, function () {
                                    $('.checkbox-selectall-btn', that.$el).removeClass('mn-selected');
                                    that.refresh(); //刷新
                                });
                            }
                        }
                    });

                });
            } else {
                util.alert('请选择要删除的产品');
            }
        },
        //获取产品标签的相关数据
        _getProductTagsDatas: function () {
            var crmData = util.getCrmData();//获取CRM缓存数据
            var functionPermissions = crmData.functionPermissions;//权限数据
            var productTags = util.getTagsByType(5);//获取所有产品标签
            var allProductTags = [];//存放产品标签数据数组
            var productLineID = 0;
            var productLineTagsForList = [ //产品线数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            _.each(productTags, function (productTag, index) {
                allProductTags.push(productTag);

                if (productTag.systemTagCode === 110) {
                    productLineID = productTag.fBusinessTagID;
                    _.each(productTag.options, function (option, index) {
                        productLineTagsForList.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        })
                    });
                }
            });

            this.allProductTags = allProductTags;//产品标签数据，新建标签的窗口需要用到
            this.productLineTagsForList = productLineTagsForList;//产品线下拉列表需要数据保存起来
            this.productLineID = productLineID;//产品线id
            this.functionPermissions = functionPermissions;//权限数据
        },
        // 初始化设置
        initialize: function () {
        	var that = this;
            this._getProductTagsDatas();
            this.importDialog = new ImportDialog({
                "title": "产品导入",
                "downloadApi": "GetMyProductExcelTemplate",
                "importApi": "/Product/ImportMyProduct",
                "downloadText": "产品导入模板"
            });
            this.importDialog.on('uploaded', function () {
                that.refresh();
            })
            this.render();
        },
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            elEl.html(renderTemplate({value: {
                employees: {}
            }}));
            this.options.warpEl.html(elEl);
            this.showFnBtn();
            this.setupComponent();//设置组件
            this.createNewProductDialog = new ProductDialog();
            this.createNewProductDialog.v = this;
            return this;
        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var topFnBtnsEl = $('.top-fn-btns', this.$el);
            var isShowFnBtn = false;
            _.each(this.functionPermissions, function (functionPermission, index) {
                var value = functionPermission.value;
                if (value == 31) { //31是客户管理员权限
                    isShowFnBtn = true;
                }
            });
            if (isShowFnBtn) {
                topFnBtnsEl.show();
            } else {
                topFnBtnsEl.hide();

            }
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var productSelectListEl = $('.product-select-list', elEl);
            var sortSelectListEl = $('.sort-select-list', elEl);//排序下拉框元素
            //排序列表事件
            util.mnEvent(sortSelectListEl, 'change', function (val) {
                util.mnSelect(sortSelectListEl, 'removeOption', 2); //移除掉第3项
                //that.oTable.fnSort([]);//排序样式重置
                $('th',that.oTable).removeClass('sorting_asc').removeClass('sorting_desc');
                that.refresh({ sortType: val });//刷新
            });
            //实例化分页组件
            this.pagination = new Pagination({
                "element": paginationWarpEl,
                "pageSize": this.options.data.pageSize,
                "totalSize": 0,
                "activePageNumber": 1
            });

            //重新设置产品线select的数据源(重新设置options)
            util.mnSelect(productSelectListEl, 'syncModel', this.productLineTagsForList);

            //产品线下拉列表事件
            util.mnEvent(productSelectListEl, 'change', function (val, text) {
                that.options.data.listTagOptionID = that.productLineID + ',' + val;
                that.refresh();
            });

            //分页事件
            this.pagination.on('page', function (val) {
                that.options.data.pageNumber = val;
                that.refresh();
            });
            //表格的TR点击事件
            elEl.on('click', '.crm-datatable tbody tr td', function () {
                var rowDataEl = $(this).closest('tr');
                var rowData = that.oTable.fnGetData(rowDataEl.get(0));
                var returnUrl = encodeURIComponent('/') + 'products' + encodeURIComponent('/') + 'product';
                var id = rowData.productID;
                var name = encodeURI(rowData.name);

                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: id
                };
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url+'/=/param-'+ encodeURIComponent(JSON.stringify(param));

                //跳转到详情页
                if (!$(this).is('.td-checkbox-warp')) {//排除掉复选框列
                    tpl.navRouter.navigate('#products/showproduct/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
                    tpl.event.one('dataUpdate', function () {
                        that.options.ID = id;
                        that.refresh();
                    });

                    $('.crm-datatable tbody tr', elEl).removeClass('row_selected');
                    rowDataEl.addClass('row_selected');//当前行添加选中样式
                }

            });
        },
        // 请求数据(仅一次时使用)
        load: function () {
            this.setDataTabel();//实例化datatable(所有请求数据从实例化表格开始)
        },
        // 刷新数据
        refresh: function (data) {
            data && (_.extend(this.options.data, data));
            this.oTable.fnReloadAjax();
        },
        // datatabel表格配置
        setDataTabel: function () {
            var that = this;
            var elEl = this.$el;
            var tableEl = elEl.find('.crm-table-bd .crm-datatable');
            this.oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip',//拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": [
                    //复选框
                    {
                        "mData": "productID",//列数据的数组keyname
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
                        "sWidth": "400px",
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
                        "sWidth": "150px",
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
                        "sWidth": "100px",
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
                        "sWidth": "100px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //最后修改人
                    {
                        "mData": "creator",
                        "sWidth": "60px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data.name + '">' + data.name + '</span>';
                            return newData;
                        }
                    },
                    //最后修改时间
                    {
                        "mData": "lastEditTime",
                        "sWidth": "120px",
                        "sClass": "crmtable-sort-lastedittime",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                            return newData;
                        }
                    } ,
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
                "sAjaxSource": this.options.url,
                //请求和回调处理
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                    var requestData = that.options.data;
                    // 监听复选框change事件
                    $('tbody tr', that.oTable).each(function (i) {
                        var that = this;
                        util.mnEvent($(this).find('.mn-checkbox-box'), 'change', function (val) {
                            if (val.length == 0) {//取消选中
                                $(that).addClass('row_selected');
                            } else {
                                $(that).removeClass('row_selected');
                            }
                        });
                    });

                    //请求数据
                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": sSource,
                        "data": requestData,
                        beforeSend: function () {
                            util.showGlobalLoading(1);//显示黄条加载提示
                        },
                        "success": function (responseData) {
                            util.hideGlobalLoading(1);//隐藏黄条加载提示
                            var totalCount = responseData.value.totalCount;
                            that.products = responseData.value.products;//把产品标签保存起来后面会需要取产品名字
                            fnCallback(that._formatTableData(responseData));
                            that.pagination.setTotalSize(totalCount);

                            if (that.options.ID) {
                                $('[data-value=' + that.options.ID + ']').closest('tr').addClass('row_selected');
                            }

                        }
                    });
                },
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                "bFilter": false, //搜索栏  
                "bPaginate": false, //是否启用分页
                "bInfo": false, //显示表格信息
                "bSort":false,//是否排序
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": '<span class="empty-tip">没有获取到产品</span>'
                }
            });

        },
        /**
         * 格式化json为了表格数据
         * 因为datatable只能识别数组类型的数据
         */
        "_formatTableData": function (responseData) {
            var formatData = [];
            var data = responseData.value;
            var products = data.products;
            var directorys = data.directorys;
            _.each(products, function (product) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, product));
            });
            return {
                "aaData": formatData
            };
        },
        //选择所有复选框
        _checkboxSelectall: function (e) {
            var meEl = $(e.currentTarget);
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
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
        // 清空
        destroy: function () {
            this.remove();
        }
    });

    module.exports = ProductList;
})
;