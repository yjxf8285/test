/**
 * FS下选择联系人的弹框
 * Created by liuxf on 2014-07-21.
 */
define(function (require, exports, module) {
    var Dialog = require("dialog");
    var util = require('util');
    var tpl = require('modules/fs-select-contact/fs-select-contact.html');
//    var tplStyle = require('modules/fs-select-contact/fs-select-contact.css');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box'); //搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var FsSelectContact = Dialog.extend({
        "attrs": {
            "title": "",
            "width": 894,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "content": tpl,
            "url": "/Contact/GetUserContacts",
            "condition": {
                employeeID: util.getCrmData().currentEmp.employeeID,//int，员工ID
                keyword: '',//string，关键字
                isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                source: 0,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                startDate: 0,// long，开始时间
                endDate: 0,//long，结束时间
                queryType: 999,//int 历史记录=999
                listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                isContainSubordinate: 1,// int，是否包含下属 0：自己;1:下属;-1:全部
                pageSize: 10,// int，分页大小
                pageNumber: 1// int，当前页
            },
            "contactDatas": [],//用来存储已选择的联系人数据
            "historyData": [],//用来存储历史记录数据
            "className": 'fs-select-contact-dialog',
            "hasShown": false
        },
        "events": {
            'click .crm-button-submit': 'submit',
            "click .checkbox-selectall-btn": "_checkboxSelectall", //选择所有复选框
            "click .left-listmenu li": "leftListMenu", //左侧菜单选项
            "click .crm-datatable tbody tr": "tr", //tr点击
            'click .crm-button-cancel': 'hide'
        },
        "render": function () {
            var result = FsSelectContact.superclass.render.apply(this, arguments);
            this.set('historyData', util.getContactsConfig());
            this.setupComponent();
            this.load();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = FsSelectContact.superclass.hide.apply(this, arguments);
            this.reset();

            return result;
        },
        //显示
        "show": function (isSelectContacts, customerIDs) {
            var result = FsSelectContact.superclass.show.apply(this, arguments);
            this.set('hasShown', true);
            this.set('historyData', util.getContactsConfig());//再获取一次历史数据
            if (isSelectContacts) {
                this.set('contactDatas', isSelectContacts);
                $('.selected-count .num', this.element).text(isSelectContacts.length);
                this.lightTr();//根据已选择的数据高亮显示已选择数据
            }
            customerIDs = customerIDs || [];
            this.set('condition', {
                customerIDs: customerIDs.join(',')
            });
            this.refresh({
                keyword: '',//string，关键字
                isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                source: 0,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                startDate: 0,// long，开始时间
                endDate: 0,//long，结束时间
                queryType: 999,//int 历史记录=999
                listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                isContainSubordinate: 1,// int，是否包含下属 0：自己;1:下属;-1:全部
                pageSize: 10,// int，分页大小
                pageNumber: 1// int，当前页
            });//默认参数
            return result;
        },
        //根据已选择的数据高亮显示已选择数据
        lightTr: function (trEl) {
            var that = this;
            var contactDatas = this.get('contactDatas');
            !trEl && (trEl = $('.crm-datatable tbody tr', this.element));//因为异步请求时TR元素会被重置，所以要传进来。
            if (contactDatas.length > 0) {
                _.each(contactDatas, function (item) {
                    var contactID = item.contactID;
                    trEl.each(function () {
                        var $this = $(this);
                        var trId = $this.find('.mn-checkbox-item').data('value');
                        if (trId == contactID) {
                            $this.addClass('row_selected');
                            $this.find('.mn-checkbox-item').addClass('mn-selected');
                        }
                    });
                });
            }
        },
        //提交
        submit: function () {
            var contactDatas = this.get('contactDatas');
            this.trigger('selected', contactDatas);
            this.hide();
        },
        //重置
        "reset": function () {
            this.set('contactDatas', []);//已选择设置为空
            this.searchBox.clear();
            this.pagination.reset();//重置分页
            $('.selected-count .num', this.element).text('0');//已选择数量为0
            $('.checkbox-for-comtable .mn-checkbox-item', this.element).removeClass('mn-selected'); //先清空多选框
            $('tbody tr', this.element).removeClass('row_selected');//清空TR选中
            $('.left-listmenu li', this.element).removeClass('selected').eq(2).addClass('selected');
        },

        //表格的TR点击逻辑
        tr: function (e) {
            var meEl = $(e.currentTarget);
            var isSelected = meEl.is('.row_selected');
            var mnCheckboxItemEl = $('.mn-checkbox-item', meEl);
            var contactDatas = this.get('contactDatas');
            var thisRowData = this.oTable.fnGetData(meEl.get(0));
            if(!thisRowData){//如果是空记录就中断执行
                return false;
            }
            var isContains = _.some(contactDatas, function (obj) {
                if (obj.contactID == thisRowData.contactID) {
                    return true;
                }
            });//如果A包含B返回true
            if (isSelected) {//选中时
                meEl.removeClass('row_selected');
                mnCheckboxItemEl.removeClass('mn-selected');
                //从数组中删除满足条件的那个元素
                contactDatas = _.reject(contactDatas, function (obj) {
                    return obj.contactID == thisRowData.contactID;
                });
            } else {
                meEl.addClass('row_selected');
                mnCheckboxItemEl.addClass('mn-selected');
                !isContains && contactDatas.push(thisRowData);
            }
            $('.selected-count .num', this.element).text(contactDatas.length);
            this.set('contactDatas', contactDatas);
            e.stopPropagation();//目的是阻止模拟checkbox组件的默认勾选事件
        },


        leftListMenu: function (e) {
            var meEl = $(e.currentTarget);
            var queryType = meEl.data('value');
            var isContainSubordinate = meEl.data('iscontainsubordinate');
            $('.left-listmenu li', this.element).removeClass('selected');
            meEl.addClass('selected');
            if (queryType == 777) {//已选客户的联系人列表
                this.set('url', '/Contact/GetContactsOfCustomerIDs');
            } else {
                this.set('url', '/Contact/GetUserContacts');//联系人列表
            }
            this.refresh({
                queryType: queryType,
                isContainSubordinate: isContainSubordinate,
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

                    "aoColumns": [
                        //复选框
                        {
                            "mData": "contactID", //列数据的数组keyname
                            "sWidth": "26px", //列宽
                            "sClass": "td-checkbox-warp",
                            "bSortable": false, //支持排序
                            "mRender": function (data, type, full) { //第1列内容

                                var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';


                                return mnCheckbox;
                            }
                        },

                        //姓名
                        {
                            "mData": "post",
                            "sWidth": "70px",
                            "sClass": "black-name crmtable-sort-name",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var name = full.name || full.contactName;
                                var isDeleted = full.isDeleted || false;
                                var newData = '';
                                var isDelStr = '[已删除] ';
                                var isDelClass = 'is-del';

                                if (isDeleted) {
                                    isDelStr = '[已删除] ';
                                    isDelClass = 'is-del';
                                    newData = '<span title="' + name + '" style="color:#999;">' + isDelStr + name + '</span>';
                                } else {
                                    isDelStr = '';
                                    isDelClass = '';
                                    newData = '<span title="' + name + '">' + name + '</span>';
                                }
                                return newData;
                            }
                        },
                        //联系方式
                        {
                            "mData": "firstContactWay",
                            "sWidth": "100px",
                            "sClass": "",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var typeDesc = data.typeDesc;
                                var content = data.content;
                                if (content) {
                                    content = '：' + content;
                                }
                                var newData = '<span title="' + typeDesc + content + '">' + typeDesc + content + '</span>';
                                return newData;
                            }
                        },
                        //职务
                        {
                            "mData": "post",
                            "sWidth": "50px",
                            "sClass": "crmtable-sort-post",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //部门
                        {
                            "mData": "department",
                            "sWidth": "50px",
                            "sClass": "crmtable-sort-department",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '<span title="' + data + '">' + data + '</span>';
                                return newData;
                            }
                        },
                        //公司
                        {
                            "mData": "company",
                            "sWidth": "80px",
                            "sClass": "crmtable-sort-company",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var name = data;
                                var customerID = full.customerID;
                                var cur = '';
                                var customerName = full.customerName;
                                if (customerID > 0) {
                                    name = customerName;
                                    cur = 'iscontact-yes';
                                }
                                var newData = '<span title="' + name + '" class="' + cur + '">' + name + '</span>';
                                return newData;
                            }
                        },

                        //更新时间
                        {
                            "mData": "upatetime",
                            "sWidth": "50px",
                            "sClass": "crmtable-sort-upatetime",
                            "bSortable": true,
                            "mRender": function (data, type, full) { //第2列内容
                                var upatetime = full.upatetime || full.shareTime;
                                var newData = '<span title="' + moment.unix(upatetime).format('YYYY-MM-DD') + '">' + moment.unix(upatetime).format('YYYY-MM-DD') + '</span>';
                                return newData;
                            }
                        }
                        //空列
                       /* {
                            "mData": "upatetime",
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
//                    ajax:this.get('url'),
                    //请求和回调处理
                    "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                        var condition = that.get('condition');
                        var contactDatas = that.get('contactDatas');//已选数据
                        var historyData = that.get('historyData') || [];
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
                                        "url": '/Contact/GetUserContacts',
                                        "data": {
                                            employeeID: util.getCrmData().currentEmp.employeeID,//int，员工ID
                                            keyword: '',//string，关键字
                                            isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                                            source: 0,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                                            createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                                            startDate: 0,// long，开始时间
                                            endDate: 0,//long，结束时间
                                            listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                                            sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                                            isContainSubordinate: -1,// int，是否包含下属 0：自己;1:下属;-1:全部
                                            pageSize: 20,// int，分页大小
                                            pageNumber: 1// int，当前页
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
                            fnCallback(that._formatTableData(contactDatas));
                            if (contactDatas.length > 0) {
                                $('tbody tr', that.element).addClass('row_selected');
                                $('tbody tr .mn-checkbox-item', this.element).addClass('mn-selected');
                            }
                            that.pagination.hide();
                        } else {
                            oSettings.jqXHR = util.api({
                                "dataType": 'json',
                                "type": "get",
                                "url": that.get('url'),
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
                    "bPaginate": false, //是否启用分页
                    "bInfo": false, //显示表格信息
                    "oLanguage": { //多语言配置
                        //无结果时显示的内容
                        "sEmptyTable": '<span class="empty-tip">您可以通过搜索框搜索联系人，或通过左侧“我的联系人”手动选择。</span>',
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
            var contacts = [];
            if (responseData.value) {
                contacts = responseData.value.contacts;
            } else {
                contacts = responseData;
            }
            _.each(contacts, function (contact) { //目录列表
                formatData.push(_.extend({
                    "typeDesc": {},
                    "contactID": 0,
                    "post": ''
                }, contact));
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
                that.set('url', '/Contact/GetUserContacts');//联系人列表
                var len = keyword.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键字长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    that.refresh({
                        keyword: keyword,
                        isContainSubordinate: -1,//int，是否包含下属 0：自己;1:下属;-1:全部
                        queryType: 2
                    });
                }
                $('.left-listmenu li', that.element).removeClass('selected');
                $('.search-result-tip',that.element).css('visibility','visible');
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
    module.exports = FsSelectContact;


});