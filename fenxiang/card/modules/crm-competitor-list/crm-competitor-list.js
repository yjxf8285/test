/**
 * CRM - 对手
 * @author liuxiaofan
 * 2014-04-02
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-competitor-list/crm-competitor-list.html');
    var Dialog = require('dialog');
    //        var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination2'); //分页组件
    var CompetitorDialog = require('modules/crm-competitor-edit/crm-competitor-edit');

    /**
     * CRM - 对手
     */

    var Competitor = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'competitor-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-competitor-list-template').html()), //模板
        options: {
            warpEl: null, //父级容器
            url: "",
            data: {}
        },
        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .crm-datatable th.modif-time": "_thModifTime", //点击TH的修改时间
            "click .create-competitor-btn": "_createCompetitor", //新建产品按钮
            "click .delete-competitor-btn": "_deleteCompetitor", //删除对手按钮
            "click .checkbox-selectall-btn": "_checkboxSelectall" //选择所有复选框
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
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });
        },
        // 新建竞争对手按钮
        _createCompetitor: function () {
            this.createNewCompetitorDialog.show();
        },
        //删除对手
        _deleteCompetitor: function () {
            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var competitorIDs = [];
            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    competitorIDs.push($(this).data('value'));
                }
            });
            if (competitorIDs.length > 0) {
                util.confirm('你确定要删除选中的' + competitorIDs.length + '个竞争对手吗？', '', function () {
                    util.api({
                        "url": '/Competitor/DeleteCompetitors',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "competitorIDs": competitorIDs
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
                util.alert('请选择要删除的竞争对手');
            }
        },
        //获取对手标签的相关数据
        _getProductTagsDatas: function () {
            var crmData = util.getCrmData(); //获取CRM缓存数据
            var functionPermissions = crmData.functionPermissions; //权限数据
            var competitorTags = util.getTagsByType(6); //获取所有对手标签
            var allCompetitorTags = []; //存放对手标签数据数组
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
            _.each(competitorTags, function (competitorTag, index) {
                allCompetitorTags.push(competitorTag);
                if (competitorTag.systemTagCode === 106) { //106是竞争对手规模
                    _.each(competitorTag.options, function (option, index) {
                        competitorscale.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        });
                    });
                    that.competitorscaleFBusinessTagID = competitorTag.fBusinessTagID;//规模的标签ID
                }
                if (competitorTag.systemTagCode === 111) { //111是竞争力
                    _.each(competitorTag.options, function (option, index) {
                        competitiveness.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        });
                    });
                    that.competitivenessFBusinessTagID = competitorTag.fBusinessTagID;//竞争力的标签ID
                }
            });
            _.extend(this, {
                allCompetitorTags: allCompetitorTags, //产品标签数据，新建标签的窗口需要用到
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
//            this.showFnBtn();//逻辑是始终显示 所以不判断了
            this.setupComponent(); //设置组件
            this.createNewCompetitorDialog = new CompetitorDialog();
            this.createNewCompetitorDialog.v = this;
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
            var competitorscaleSelectListEl = $('.competitorscale-select-list', elEl);
            var competitivenessSelectListEl = $('.competitiveness-select-list', elEl);
            var sortSelectListEl = $('.sort-select-list', elEl);
            var competitorscaleFBusinessTagID = that.competitorscaleFBusinessTagID;//规模的标签ID
            var competitivenessFBusinessTagID = that.competitivenessFBusinessTagID;//竞争力的标签ID
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

            //重新设置规模select的数据源(重新设置options)
            util.mnSelect(competitorscaleSelectListEl, 'syncModel', this.competitorscale);
            //重新竞争力select的数据源(重新设置options)
            util.mnSelect(competitivenessSelectListEl, 'syncModel', this.competitiveness);

            //规模下拉列表事件
            util.mnEvent(competitorscaleSelectListEl, 'change', function (val, text) {
                //                that.options.data.listTagOptionID = '106,1282_111,1284';
                that.options.data.listTagOptionID = competitorscaleFBusinessTagID + ',' + val + '_' + competitivenessFBusinessTagID + ',' + util.mnGetter(competitivenessSelectListEl);
                that.refresh();
            });

            //竞争力下拉列表事件
            util.mnEvent(competitivenessSelectListEl, 'change', function (val, text) {
                that.options.data.listTagOptionID = competitorscaleFBusinessTagID + ',' + util.mnGetter(competitorscaleSelectListEl) + '_' + competitivenessFBusinessTagID + ',' + val;
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
                var returnUrl = encodeURIComponent('/') + 'competitors' + encodeURIComponent('/') + 'competitor';
                var id = rowData.competitorID;
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
                    tpl.navRouter.navigate('#competitors/showcompetitor/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
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
            this.setDataTabel(); //实例化datatable(所有请求数据从实例化表格开始)
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
                "sDom": 'Rlfrtip', //拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": [
                    //复选框
                    {
                        "mData": "competitorID", //列数据的数组keyname
                        "sWidth": "26px", //列宽
                        "sClass": "td-checkbox-warp",
                        "bSortable": false, //支持排序
                        "mRender": function (data, type, full) { //第1列内容
                            var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';
                            return mnCheckbox;
                        }
                    },
                    //名称
                    {
                        "mData": "name",
                        "sWidth": "500px",
                        "sClass": "black-name crmtable-sort-name",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';

                            return newData;
                        }
                    },
                    //联系信息
                    {
                        "mData": "contactInfo",
                        "sWidth": "180px",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //竞争力
                    {
                        "mData": "competitivenessTagOptionName",
                        "sWidth": "100px",
                        "bSortable": false,
                        "mRender": function (data, type, full) { //第2列内容
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    //规模
                    {
                        "mData": "competitorScaleTagOptionName",
                        "sWidth": "100px",
                        "sClass": "",
                        "bSortable": false,
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
                    oSettings.jqXHR = util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": sSource,
                        "data": requestData,
                        beforeSend: function () {
                            util.showGlobalLoading(1); //显示黄条加载提示
                        },
                        "success": function (responseData) {
                            util.hideGlobalLoading(1); //隐藏黄条加载提示
                            var totalCount = responseData.value.totalCount;
                            that.products = responseData.value.products; //把产品标签保存起来后面会需要取产品名字
                            fnCallback(that._formatTableData(responseData));
                            that.pagination.setTotalSize(totalCount);
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
                    "sEmptyTable": '<span class="empty-tip">没有获取到竞争对手</span>'
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
            var competitors = data.competitors;
            var directorys = data.directorys;
            _.each(competitors, function (competitor) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "downloadTimes": 0,
                    "attachSize": 0
                }, competitor));
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

    /**
     * 创建新标签的弹框
     */
    var CreateNewCompetitorDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-createnewcompetitortags-template').html(),
            className: 'dialog-createnewcompetitortags'
        },
        "events": {
            'click .button-submit': 'submit',
            'click .button-cancel': 'hide'
        },
        "render": function () {
            var result = CreateNewCompetitorDialog.superclass.render.apply(this, arguments);
            this.setupDoms(); //设置DOM
            this.setupComponent(); //设置组件
            return result;
        },
        "hide": function () {
            var result = CreateNewCompetitorDialog.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "show": function () {
            var result = CreateNewCompetitorDialog.superclass.show.apply(this, arguments);
            return result;
        },
        "clear": function () {
            //清空所有输入框val
            $('.area-auto-height', this.element).val('');
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });
        },
        "submit": function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var elEl = this.element;
            var competitorNameVal = $('.competitor-name', elEl).val();
            var advantageVal = $('.competitor-advantage', elEl).val();
            var disadvantageVal = $('.competitor-disadvantage', elEl).val();
            var strategiesVal = $('.competitor-strategies', elEl).val();
            var salesSituationVal = $('.competitor-salesSituation', elEl).val();
            var marketingSituationVal = $('.competitor-marketingSituation', elEl).val();
            var contactInfoVal = $('.competitor-contactInfo', elEl).val();
            var descriptionVal = $('.competitor-description', elEl).val();
            var productTagsListLiWarpVal = $('.product-tags-list-warp > li', elEl);
            var listTagOptionID = [];
            productTagsListLiWarpVal.each(function (i) {
                var fBusinessTagID = $('.selects-tit', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });

            util.api({
                "url": '/Competitor/AddCompetitor',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    name: competitorNameVal, //string，竞争对手名称(必输，长度200)
                    advantage: advantageVal, //string，优势(长度不限)
                    disadvantage: disadvantageVal, //string，劣势(长度不限)
                    strategies: strategiesVal, //string，应对策略(长度不限)
                    salesSituation: salesSituationVal, //string，销售分析(长度不限)
                    marketingSituation: marketingSituationVal, //string，市场分析(长度不限)
                    contactInfo: contactInfoVal, //string，联系信息(长度不限)
                    description: descriptionVal, //string，描述(长度不限)
                    listTagOptionID: listTagOptionID//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.hide();
                        util.remind(2, "添加成功");
                        that.v.refresh(); //刷新列表
                    }
                }
            }, {
                "submitSelector": meEl
            });
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.element;
            var productTagsListWarpEl = $('.product-tags-list-warp', elEl);
            var allCompetitorTags = this.v.allCompetitorTags;
            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });
            //实例化下拉框
            _.each(allCompetitorTags, function (allCompetitorTag, index) {
                var name = allCompetitorTag.name;
                var options = allCompetitorTag.options;
                var ulStr = '';
                var defaultItem = '';
                if (options.length > 0) {
                    _.each(options, function (option, index) {
                        var isDefault = option.isDefault;
                        if (isDefault) {
                            defaultItem = option.name;
                        }
                        ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + option.fBusinessTagOptionID + '" data-selected="' + isDefault + '">' + option.name + '</li></ul>';
                    });
                } else {
                    ulStr = '<ul class="mn-select-list"><li class="mn-select-item" data-value="0"></li></ul>';
                }
                productTagsListWarpEl.append('<li class="fn-clear"> <div class="selects-tit" data-fbusinesstagid="' + allCompetitorTag.fBusinessTagID + '"> ' + name + ' </div> <div class="selects-warp"> <span select-cls="product-tags-list-selects" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">' + defaultItem + '</span><span class="title-icon"></span></span>' + ulStr + '</span> </div> </li>');
            });
        }
    });

    module.exports = Competitor;
});