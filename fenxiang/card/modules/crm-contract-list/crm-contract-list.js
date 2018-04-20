/**
 * CRM - 合同 -list
 * @author liuxiaofan
 * 2014-05-13
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-contract-list/crm-contract-list.html');
    var Dialog = require('dialog');
    //        var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var DateDialog = require('modules/crm-date-dialog/crm-date-dialog');
    var Pagination = require('uilibs/pagination2'); //分页组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var ContractDialog = require('modules/crm-contract-edit/crm-contract-edit');

    /**
     * CRM - 合同
     */

    var Contract = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'competitor-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-contract-list-template').html()), //模板
        options: {
            warpEl: null, //父级容器
            url: "",
            data: {},
            isLoadServerData: false
        },
        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .create-contract-btn": "_createCompetitor", //新建合同按钮
            "click .update-contract-sowner-btn": "_updateSalesCluesOwner", //变更合同负责人按钮
            "click .delete-contract-btn": "_deleteCompetitor", //删除合同按钮
            "click .customers-follow": "_followSwitch", //关注和取消关注
            "click .checkbox-selectall-btn": "_checkboxSelectall" //选择所有复选框
        },
        //关注和取消关注
        _followSwitch: function (e) {
            e.stopPropagation();
            var $el = $(e.target),
                contractID = $el.parents('tr').children().eq(0).find('span').attr('data-value');
            var cursor=$el.css('cursor');
            if(cursor=="col-resize") return;
            if ($el.hasClass('customers-following')) {
                //取消关注
                util.api({
                    "url": '/Contract/ContractCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: contractID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-following').addClass('customers-nofollow').attr('title', '关注');
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/Contract/ContractFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: contractID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-nofollow').addClass('customers-following').attr('title', '取消关注');
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
            var contractIDs = [];

            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    contractIDs.push($(this).data('value'));
                }
            });
            if (contractIDs.length > 0) {
                this.selectOwner.contractIDs = contractIDs;
                this.selectOwner.show();

            } else {
                util.alert('请选择合同');
            }

        },
        //删除
        _deleteCompetitor: function () {
            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var contractIDs = [];
            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    contractIDs.push($(this).data('value'));
                }
            });
            if (contractIDs.length > 0) {
                util.confirm('你确定要删除选中的' + contractIDs.length + '个合同吗？', '', function () {
                    util.api({
                        "url": '/Contract/DeleteContracts',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contractIDs: contractIDs //List<int>，
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
                util.alert('请选择要删除的合同');
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
            this.setDateDialog();
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
            this.createNewCompetitorDialog = new ContractDialog({
//                contractID: 154
            });
            this.createNewCompetitorDialog.v = this;
            return this;
        },
        // 设置时间弹框
        setDateDialog: function() {
            var that = this;
            that.dateDialog = new DateDialog();
            that.dateDialog.on('enter', function(data) {
                that.options.data.endDayType = 0;
                that.options.data.deadlineBeginTime = data.startTime;
                that.options.data.deadlineEndTime = data.endTime;
                that.curSelect.set('selectedIndex', -1); // 使自定义时间继续可点击
                that.refresh();
                $('.dealdaytype-select-list .mn-select-title', that.$el).html(data.timeText);
                that.dateDialog.hide();
            });
            that.dateDialog.on('cancel', function() {
                // 设置为当前的值
                var val = that.options.data.endDayType || 0;
                var deadlineBeginTime = that.options.data.deadlineBeginTime;
                if (deadlineBeginTime > 0) { // 当前选中的为自定义时间
                    that.curSelect.set('selectedIndex', -1); // 使自定义时间继续可点击
                    return;
                }
                var $curSelectItem = $('.ui-select-item[data-value = ' + val + ']', $(that.curSelect.element));
                $('.dealdaytype-select-list .mn-select-title', that.$el).html($curSelectItem.text());
                that.curSelect.set('selectedIndex', $curSelectItem.index());
            });            
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

       /* resetQueryCondition: function(){//注释掉的原因是这样会导致触发change事件造成2次请求

        	util.mnReset($('.isowner-select-list', this.$el));
        	util.mnReset($('.states-select-list', this.$el));
        	util.mnReset($('.sort-select-list', this.$el));
        },*/
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var statesSelectListEl = $('.states-select-list', elEl);//状态
            var isownerSelectListEl = $('.isowner-select-list', elEl);//归属
            var dealdaytypeSelectListEl =  $('.dealdaytype-select-list', elEl); // 结束于
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
                var contractIDs = this.contractIDs;
                var ownerlength = contractIDs.length;
                var ownerID = val.employeeID;
                var ownerName = val.name;
                util.confirm('你确定要将选中的' + ownerlength + '个合同的负责人变更为' + ownerName + '吗？', '', function () {
                    util.api({
                        "url": '/Contract/UpdateContractsOwnerID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contractIDs: contractIDs, //List<int>，销售线索ID集合
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
            util.mnEvent(statesSelectListEl, 'change', function (val, text) {
                that.options.data.states = val;
                that.refresh();
            });
            //归属下拉列表事件
            util.mnEvent(isownerSelectListEl, 'change', function (val, text) {
                that.options.data.isOwner = val;
                that.refresh();
            });
            //结束于
            util.mnEvent(dealdaytypeSelectListEl, 'change', function (val, text) {
                if (val == 6) {
                    that.curSelect = this;
                    that.dateDialog.show();
                    return;
                }

                that.options.data.deadlineBeginTime = -1;
                that.options.data.deadlineEndTime = -1;
                that.options.data.endDayType = val;
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
                var id = rowData.contractID;

                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: id
                }
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url+'/=/param-'+ encodeURIComponent(JSON.stringify(param));
                //跳转到详情页
                if (!$(this).is('.td-checkbox-warp')) { //排除掉复选框列
                    tpl.navRouter.navigate('#contracts/showcontract/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
                    tpl.event.one('dataUpdate', function(){
                        that.options.ID = id;
                        that.refresh();
                    });
                    $('.crm-datatable tbody tr', elEl).removeClass('row_selected');
                    rowDataEl.addClass('row_selected'); //当前行添加选中样式
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
            util.mnSelect($('.states-select-list', elEl), 'syncModel', [{
                "text": "全部",
                "value": 0
            }, {
                "text": "执行前",
                "value": 1
            }, {
                "text": "执行中",
                "value": 2
            }, {
                "text": "结束",
                "value": 3
            }, {
                "text": "意外终止",
                "value": 4
            }]);
            util.mnSelect($('.isowner-select-list', elEl), 'syncModel', [{
                "text": "全部",
                "value": -1
            }, {
                "text": "参与的",
                "value": 0
            }, {
                "text": "负责的",
                "value": 1
            }]);
            util.mnSelect($('.dealdaytype-select-list', elEl), 'syncModel', [{
                "text": "不限",
                "value": 0
            }, {
                "text": "本月",
                "value": 1
            }, {
                "text": "下月",
                "value": 2
            }, {
                "text": "本季度",
                "value": 3
            }, {
                "text": "下季度",
                "value": 4
            }, {
                "text": "本年度",
                "value": 5
            }, {
               "text": "自定义",
               "value": '6'
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
                        "mData": "contractID", //列数据的数组keyname
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
                    //标题
                    {
                        "mData": "title",
                        "sWidth": "120px",
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
                        "sWidth": "50px",
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
                    //合同编号
                    {
                        "mData": "contractNO",
                        "sWidth": "90px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //状态
                    {
                        "mData": "states",
                        "sWidth": "50px",
                        //                        "sType": "numeric-comma",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            //合同状态(全部=0;已计划=1；进行中=2；已结束=3；中止=4)
                            switch (data) {
                                case 0:
                                    data = '全部';
                                    break;
                                case 1:
                                    data = '执行前';
                                    break;
                                case 2:
                                    data = '执行中';
                                    break;
                                case 3:
                                    data = '结束';
                                    break;
                                case 4:
                                    data = '意外终止';
                                    break;
                            }
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //结束日期
                    {
                        "mData": "endDate",
                        "sWidth": "75px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                            return newData;
                        }
                    },
                    //合同金额
                    {
                        "mData": "totalAmount",
                        "sWidth": "80px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var fData = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                            var newData = '<span title="' + fData + '">' + fData + '</span>';
                            return newData;
                        }
                    },
                    //折扣
                    {
                        "mData": "discount",
                        "sWidth": "50px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            if (data >= 10) {
                                data = '无折扣';
                            } else {
                            	data += '折';
                            }
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //回款金额
                    {
                        "mData": "paidTotalAmount",
                        "sWidth": "62px",
                        "sClass": "",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var fData = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                            var newData = '<span title="' + fData + '">' + fData + '</span>';
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
                            that.showFnBtn();//控制权限按钮显示
                            if(that.options.ID){
                                $('[data-value='+that.options.ID+']').closest('tr').addClass('row_selected');
                            }
                            /* 监听复选框change事件 */
                            $('.checkbox-for-comtable .mn-checkbox-item',that.$el).removeClass('mn-selected'); //先清空多选框
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
                    "sEmptyTable": '<span class="empty-tip">没有获取到合同</span>'
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
            var hContractEntity = data.hContractEntity;
            _.each(hContractEntity, function (hContractEntit) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, hContractEntit));
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


    module.exports = Contract;
});