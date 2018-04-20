/**
 * CRM - 明细页列表模块
 *
 * @author liuxiaofan
 * 2014-05-26
 */

define(function (require, exports, module) {
    var tpl = require('modules/crm-detaillists/crm-detaillists.html');
    var util = require('util');
    var Pagination = require('uilibs/pagination2'); //分页组件

    /**
     * 普通选项参数会被注册到 this.options 中。
     * 特殊的选项： model, collection, el, id, className, 以及 tagName。
     */
    var Detaillist = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: '', //CLASS名
        title: '',
        jDatas: '',
        thDatas: [],
        aoColumnsData: [],
        url: null, //请求地址
        data: null, //请求参数
        template: _.template($(tpl).filter('.crm-detaillists-tpl').html()), //模板
        events: {
            "click .table-add-btn": "add",
            "click .table-modify-btn": "modify",
            "click tbody tr": "tr",
            "click .table-del-btn": "del"
        },
        tr: function (e) {
            var rowDataEl = $(e.target).closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));
            this.trigger('tr', rowData);
            return false;
        },
        add: function (e) {
            var rowDataEl = $(e.target).closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));
            this.trigger('add', rowData);
            return false;
        },
        modify: function (e) {
            var rowDataEl = $(e.target).closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));
            this.trigger('modify', rowData);
            return false;
        },
        del: function (e) {
            var rowDataEl = $(e.target).closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));
            this.trigger('del', rowData);
            return false;
        },
        // 初始化设置
        initialize: function () {
            var that = this;
            this.render();
            var paginationWarpEl = $('.pagination-wrapper', this.$el);
            if (this.options.pagination) {
                paginationWarpEl.parent().show();
            } else {
                paginationWarpEl.parent().hide();
            }
            //实例化分页组件
            this.pagination = new Pagination({
                "element": paginationWarpEl,
                "pageSize": this.options.data.pageSize,
                "totalSize": 0,
                "activePageNumber": 1
            });
            //分页事件
            this.pagination.on('page', function (val) {
                that.options.data.pageNumber = val;
                that.refresh();
            });
        },
        // 渲染
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            var rightTopBTnText = this.options.rightTopBTnText || '添加';
            var operationClass = this.options.operationClass || 'table-add-btn';
            var operation = this.options.operation || false;

            var defaultData = {
                title: this.options.title,
                rightTopBTnText: rightTopBTnText,
                operationClass: operationClass,
                thDatas: this.options.thDatas
            };
            if (operation) {
                defaultData.operation = 'operation';
            } else {
                defaultData.operation = '';
            }

            elEl.html(renderTemplate(defaultData));
            this.options.warpEl.html(elEl);

            return this;
        },
        // 请求数据
        load: function () {
            if (!this.oTable) {
                this.setDataTabel(); //调用datatables插件
            } else {
                //重新请求
                this.oTable.fnReloadAjax();
            }
        },
        // 刷新数据
        refresh: function (data) {
            data && _.extend(this.options.data, data);
            this.load();
        },
        // 原始数据格式化
        formatData: function (responseData) {
            var formatData = {};
            _.extend(formatData, responseData || {});
            // 搜索结果
            formatData.title = this.options.title || '';
            return formatData;
        },
        // datatabel表格配置
        setDataTabel: function () {
            var that = this;
            var elEl = this.$el;
            var tableEl = $('.crm-table-bd .crm-datatable', elEl);
            var addStr = '， <a class="table-add-btn" href="javascript:;">' + (this.options.emptyBtnWords || '立即添加') + '</a>';

            if (this.options.hideAddBtn) {
                addStr = '';
            }
            var emptyStr = '<span class="empty-tip">' + this.options.emptyStr + addStr + '</span>';
            this.oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip', //拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": this.options.aoColumnsData,
                //接口地址
                "sAjaxSource": this.options.url,
                //请求和回调处理
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": sSource,
                        "data": that.options.data,
                        beforeSend: function () {
                            util.showGlobalLoading(1); //显示黄条加载提示
                        },
                        "success": function (responseData) {
                            util.hideGlobalLoading(1); //隐藏黄条加载提示
                            that.responseData = responseData;
                            fnCallback(that._formatTableData(responseData));
                            var totalCount = responseData.value.totalCount;
                            if (responseData.success) {
                                that.pagination.setTotalSize(totalCount);//获取到页数的总数
                            }
                            that.trigger('loadSuccess');
                        }
                    });
                },
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                "bFilter": false,
                //搜索栏  
                "bPaginate": false, //是否启用分页
                "bInfo": false,//显示表格信息
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": emptyStr
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
            var jDatas = data[this.options.jDatas] || [];

            if (jDatas.length == 0) {
                $('.baseinfo-hd .table-add-btn', this.$el).hide();
            } else {
                $('.baseinfo-hd .table-add-btn', this.$el).show();
            }
            if(this.options.operation){
                $('.baseinfo-hd .table-operation-btn', this.$el).show();
            }else{
                $('.baseinfo-hd .table-operation-btn', this.$el).hide();
            }


            _.each(jDatas, function (option) { //目录列表
                formatData.push(_.extend({
                    "blank": ''
                }, option));
            });
            return {
                "aaData": formatData
            };
        }
    });
    module.exports = Detaillist;
});