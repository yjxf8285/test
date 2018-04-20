/**
 * CRM - 市场
 * @author liuxiaofan
 * 2014-05-12
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-marketing-list/crm-marketing-list.html');
    var Dialog = require('dialog');
    //        var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination2'); //分页组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var MarketingDialog = require('modules/crm-marketing-edit/crm-marketing-edit');

    /**
     * CRM - 市场
     */

    var Marketing = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'competitor-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-salesclue-list-template').html()), //模板
        options: {
            warpEl: null, //父级容器
            url: "",
            data: {},
            isLoadServerData: false
        },
        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .create-salesclue-btn": "_createCompetitor", //新建产品按钮
            "click .update-salesclue-sowner-btn": "_updateSalesCluesOwner", //变更负责人按钮
            "click .delete-salesclue-btn": "_deleteCompetitor", //删除对手按钮
            "click .customers-follow": "_followSwitch", //关注和取消关注
            "click .checkbox-selectall-btn": "_checkboxSelectall" //选择所有复选框
        },
        //关注和取消关注
        _followSwitch: function(e){
            e.stopPropagation();
            var $el = $(e.target),
                marketingEventID = $el.parents('tr').children().eq(0).find('span').attr('data-value');
            if($el.hasClass('customers-following')){
                //取消关注
                util.api({
                    "url": '/MarketingEvent/MarketingEventCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { marketingEventID: marketingEventID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-following').addClass('customers-nofollow')
                        }
                    }
                });
            }else{
                //添加关注
                util.api({
                    "url": '/MarketingEvent/MarketingEventFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { marketingEventID: marketingEventID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-nofollow').addClass('customers-following')
                        }
                    }
                });
            }
        },
        //点击TH表格排序
        _crmTableSort: function (e) {
            var that=this;
            /*
            *如果此时是拖拽事件
            *则直接返回
            */
            var cursor=$(e.target).css('cursor');
            if(cursor=="col-resize") return;
            //表格排序配置
            util.crmTableSortSet({
                element: $('.sort-select-list', this.$el), //排序下拉框
                meEl:$(e.currentTarget),//触发点击事件的元素
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
                callback:function(data){
                    that.refresh(data);//刷新列表
                }
            });
        },
        // 新建竞争对手按钮
        _createCompetitor: function () {
            this.createNewCompetitorDialog.show();
        },
        //变更负责人
        _updateSalesCluesOwner: function () {
            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var marketingEventIDs = [];

            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    marketingEventIDs.push($(this).data('value'));
                }
            });
            if (marketingEventIDs.length > 0) {
                this.selectOwner.marketingEventIDs = marketingEventIDs;
                this.selectOwner.show();

            } else {
                util.alert('请选择市场活动');
            }

        },
        //删除
        _deleteCompetitor: function () {
            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var marketingEventIDs = [];
            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    marketingEventIDs.push($(this).data('value'));
                }
            });
            if (marketingEventIDs.length > 0) {
                util.confirm('你确定要删除选中的' + marketingEventIDs.length + '个市场活动吗？', '', function () {
                    util.api({
                        "url": '/MarketingEvent/DeleteCompetitors',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            marketingEventIDs: marketingEventIDs //List<int>，
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
                                    $('.checkbox-selectall-btn .mn-checkbox-item').removeClass('mn-selected');
                                    that.refresh(); //刷新
                                });
                            }
                        }
                    });

                });
            } else {
                util.alert('请选择要删除的市场活动');
            }
        },
        //获取市场标签的相关数据
        _getProductTagsDatas: function () {
            var crmData = util.getCrmData(); //获取CRM缓存数据
            var functionPermissions = crmData.functionPermissions; //权限数据
            var marketingEventTypes = util.getTagsByType(9); //获取所有线索标签
            var allTags = []; //存放线索标签数据数组
            var that = this;
            var competitorscale = [//规模标签数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            var competitiveness = [//竞争力标签数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            _.each(marketingEventTypes, function (marketingEventType, index) {
                allTags.push(marketingEventType);

                if (marketingEventType.systemTagCode === 109) { //109线索来源
                    _.each(marketingEventType.options, function (option, index) {
                        competitiveness.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        });
                    });
                    that.marketingEventTypeFBusinessTagID = marketingEventType.fBusinessTagID;//线索来源的标签ID
                }
            });
            _.extend(this, {
                allCompetitorTags: allTags, //产品标签数据，新建标签的窗口需要用到
                competitorscale: competitorscale, //规模标签数据
                competitiveness: competitiveness, //竞争力标签数据
                functionPermissions: functionPermissions //权限数据
            });

        },
        // 初始化设置
        initialize: function () {
            this._getProductTagsDatas();
            this.render();
        },
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            elEl.html(renderTemplate({
                value: {
                    employees: {}
                }
            }));
            this.options.warpEl.html(elEl);
            this.setDataTabel();
            this.setupComponent(); //设置组件
            this.createNewCompetitorDialog = new MarketingDialog({
//                marketingEventID: 72
            });
            this.createNewCompetitorDialog.v = this;
            return this;
        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var elEl = this.$el;
            var createEl = $('.create-salesclue-btn', elEl);
            var updateEl = $('.update-salesclue-sowner-btn', elEl);
            var deleteEl = $('.delete-salesclue-btn', elEl);
            var canCreate = this.responseData.value.canCreate;
            var canChangeOwner = this.responseData.value.canChangeOwner;
            var canDelete = this.responseData.value.canDelete;
            if (canCreate) {
                createEl.show();
            } else {
                createEl.hide();
            }
            if (canChangeOwner) {
                updateEl.show();
            } else {
                updateEl.hide();
            }
            if (canDelete) {
                deleteEl.show();
            } else {
                deleteEl.hide();
            }

        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var marketingSelectListEl = $('.marketing-select-list', elEl);
            var sortSelectListEl = $('.sort-select-list', elEl);
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
            //变更负责的选人弹框
            this.selectOwner = new SelectColleague({
                "isMultiSelect": false,
                "title": '请选择负责人'
            });
            //变更负责的选人弹框的选中事件
            this.selectOwner.on("selected", function (val) {
                var marketingEventIDs = this.marketingEventIDs;
                var ownerlength = marketingEventIDs.length;
                var ownerID = val.employeeID;
                var ownerName = val.name;
                util.confirm('你确定要将选中的' + ownerlength + '个市场活动的负责人变更为' + ownerName + '吗？', '', function () {
                    util.api({
                        "url": '/MarketingEvent/UpdateMarketingEventsOwnerID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            marketingEventIDs: marketingEventIDs, //List<int>，销售线索ID集合
                            ownerID: ownerID //int，负责人ID
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
                                    $('.checkbox-selectall-btn .mn-checkbox-item').removeClass('mn-selected');
                                    that.refresh(); //刷新
                                });
                            }
                        }
                    });

                });
            });

            //状态下拉列表事件
            util.mnEvent(marketingSelectListEl, 'change', function (val, text) {
                that.options.data.states = val;
                that.options.data.pageNumber = 1;
                that.options.data.keyword = '';
                that.pagination.reset();
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
                var returnUrl = encodeURIComponent('/') + 'marketings' + encodeURIComponent('/') + 'marketing';
                var id = rowData.marketingEventID;

                var name = encodeURIComponent(encodeURI(rowData.name));

                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: id
                };
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url+'/=/param-'+ encodeURIComponent(JSON.stringify(param));

                //跳转到详情页
                if (!$(this).is('.td-checkbox-warp')) {//排除掉复选框列
                    tpl.navRouter.navigate('#marketings/showmarketing/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
                    tpl.event.one('dataUpdate', function () {
                        that.options.ID = id;
                        that.refresh();
                    });

                    $('.crm-datatable tbody tr', elEl).removeClass('row_selected');
                    rowDataEl.addClass('row_selected');//当前行添加选中样式
                }
            });
        },
        // 请求数据
        load: function () {
            this.options.isLoadServerData = true;
        },
        // 刷新数据
        refresh: function (data) {
            data && (_.extend(this.options.data, data));
            this.oTable.fnReloadAjax();
        },
        //重置模拟下拉框
        reSetMnselect: function() {
            var elEl = this.$el;
            util.mnSelect($('.marketing-select-list', elEl), 'syncModel', [{
                "text": "全部",
                "value": 0
            }, {
                "text": "已计划",
                "value": 1
            }, {
                "text": "进行中",
                "value": 2
            }, {
                "text": "已结束",
                "value": 3
            }, {
                "text": "终止",
                "value": 4
            }]);

            util.mnSelect($('.sort-select-list', elEl), 'syncModel', [{
                "text": "发生变化的在最前面",
                "value": 0
            }, {
                "text": "按名称排序",
                "value": 2
            }]);
            //重置分页组件为第一页
            this.pagination.jump(1, true);

        },
        // datatabel表格配置
        setDataTabel: function () {
            var that = this;
            var elEl = this.$el;
            var tableEl = elEl.find('.crm-table-bd .crm-datatable');
            this.oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip', //拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": [
                    //复选框
                    {
                        "mData": "marketingEventID", //列数据的数组keyname
                        "sWidth": "26px", //列宽
                        "sClass": "td-checkbox-warp",
                        "bSortable": false, //支持排序
                        "mRender": function (data, type, full) { //第1列内容
                            var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';
                            return mnCheckbox;
                        }
                    },
                    //关注
                    {
                        "mData": "isFollow",
                        "sWidth": "24px",
                        "sClass": "customer-foolo",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData;
                            if (data) {
                                newData = '<div class="customers-follow customers-following" title="取消关注"></div>';
                            } else {
                                newData = '<div class="customers-follow customers-nofollow" title="关注"></div>';
                            }
                            return newData;
                        }
                    },
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
                    //状态
                    {
                        "mData": "states",
                        "sWidth": "50px",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            //合同状态(全部=0;已计划=1；进行中=2；已结束=3；中止=4)
                            switch (data) {
                                case 0:
                                    data = '全部';
                                    break;
                                case 1:
                                    data = '已计划';
                                    break;
                                case 2:
                                    data = '进行中';
                                    break;
                                case 3:
                                    data = '已结束';
                                    break;
                                case 4:
                                    data = '中止';
                                    break;
                            }
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //类型
                    {
                        "mData": "marketingEventTypeTagOptionName",
                        "sWidth": "90px",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //开始日期
                    {
                        "mData": "beginDate",
                        "sWidth": "120px",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                            return newData;
                        }
                    },
                    //负责人
                    {
                        "mData": "owner",
                        "sWidth": "50px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data.name + '">' + data.name + '</span>';
                            return newData;
                        }
                    },
                    //最后修改人
                    {
                        "mData": "lastEditEmployee",
                        "sWidth": "100px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = data.name;
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
                "sAjaxSource": this.options.url,
                //请求和回调处理
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                    //打断请求 TODO：目前这种做法并不合理，应该使用that.load()方法来执行表格请求，暂时还没想好整个逻辑如何梳理
                    if (!that.options.isLoadServerData) return;
                    var requestData = that.options.data;
                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": sSource,
                        "data": requestData,
                        beforeSend: function () {
                            util.showGlobalLoading(1); //显示黄条加载提示
                        },
                        "success": function (responseData) {
                            var totalCount = responseData.value.totalCount;
                            util.hideGlobalLoading(1); //隐藏黄条加载提示
                            that.responseData = responseData;
                            that.products = responseData.value.products; //把产品标签保存起来后面会需要取产品名字
                            fnCallback(that._formatTableData(responseData));
                            that.pagination.setTotalSize(totalCount);//获取到页数的总数
//                            that.showFnBtn();//控制权限按钮显示
                            /* 监听复选框change事件 */
                            $('.checkbox-for-comtable .mn-checkbox-item',that.$el).removeClass('mn-selected'); //先清空多选框
                            if(that.options.ID){
                                $('[data-value='+that.options.ID+']').closest('tr').addClass('row_selected');
                            }
                            $('tbody tr', that.oTable).each(function (i) {
                                var that = this;
                                util.mnEvent($(this).find('.mn-checkbox-box'), 'change', function (val) {
                                    if (val.length == 0) { //取消选中
                                        $(that).addClass('row_selected');
                                    } else {
                                        $(that).removeClass('row_selected');
                                    }
                                });
                            });
                        }
                    });
                },
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                "bFilter": false,
                //搜索栏  
                "bPaginate": false, //是否启用分页
                "bInfo": false,
                "bSort":false,//是否排序
                //显示表格信息
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": '<span class="empty-tip">没有获取到市场活动</span>'
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
            var marketingEvents = data.marketingEvents;
            _.each(marketingEvents, function (marketingEvent) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, marketingEvent));
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


    module.exports = Marketing;
});