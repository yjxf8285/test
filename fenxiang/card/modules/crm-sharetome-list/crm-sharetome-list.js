/**
 * CRM - 共享联系人 -list
 * @author liuxiaofan
 * 2014-05-13
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-sharetome-list/crm-sharetome-list.html');
    var Dialog = require('dialog');
    //        var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var ImportDialog = require('modules/crm-object-import/crm-object-import');//导入人
    var Pagination = require('uilibs/pagination2'); //分页组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var ContactDialog = require('modules/crm-contact-edit/crm-contact-edit');
    var ContactViewDialog = require('modules/crm-contact-view/crm-contact-view');
    var ExportDialog = require('modules/crm-contact-export/crm-contact-export');

    /**
     * CRM - 共享联系人列表
     */

    var sContact = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'competitor-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-contract-list-template').html()), //模板
        overwriteRowClick: false,//是否覆盖列表点击事件，如果覆盖请注册rowClick事件
        options: {
            warpEl: null, //父级容器
            url: "",
            data: {},
            isLoadServerData: false
        },
        events: {
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .list-created-contact-btn": "_listCreatedContact", //列表中创建联系人
            "click .create-contract-btn": "_createContract", //新建联系人按钮
            "click .delete-contract-btn": "_deleteContract", //新建联系人按钮
            "click .create-sharetome-btn": "_createAllShareTome", //将共享联系人全部创建为联系人
            "click .remove-sharetome-btn": "_removeAllShareTome", //将共享联系人全部清理
            "click .contract-import-btn": "_contractImport", //导入联系人按钮
            "click .contract-export-btn": "_contractExport", //导出联系人按钮
            //            "click .customers-follow": "_followSwitch", //关注和取消关注
            "click .checkbox-selectall-btn": "_checkboxSelectall" //选择所有复选框
        },
        _listCreatedContact: function (e) {
            var meEl = $(e.currentTarget);
            var rowDataEl = meEl.closest('tr');
            var rowData = this.oTable.fnGetData(rowDataEl.get(0));
            var that = this;
            util.api({
                "url": '/Contact/CopyContact',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    shareContactMessageID: rowData.shareContactMessageID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.refresh();
                    }
                }
            });
            return false;
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
                element: $('.sort-select-list', this.$el), //容器是JQ对象
                meEl: $(e.currentTarget),//触发点击事件的元素
                oThs: [
                    {//名称
                        clasName: '.crmtable-sort-name',
                        sortType: [2, 4]//升序值，降序值
                    },
                    {//职务
                        clasName: '.crmtable-sort-post',
                        sortType: [5, 6]//升序值，降序值
                    },
                    {//部门
                        clasName: '.crmtable-sort-department',
                        sortType: [7, 8]//升序值，降序值
                    },
                    {//公司
                        clasName: '.crmtable-sort-company',
                        sortType: [9, 10]//升序值，降序值
                    },
                    {//更新时间
                        clasName: '.crmtable-sort-upatetime',
                        sortType: [11, 12]//升序值，降序值
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });

        },
        //清空共享记录
        _removeAllShareTome: function () {
            var that = this;
            util.confirm('是否清空全部共享记录', '', function () {
                util.api({
                    "url": '/Contact/DeleteShareContactMessageAll',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {},
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.refresh();
                        }
                    }
                });
            });
        },
        //全部创建
        _createAllShareTome: function () {
            var that = this,
                count = 0,
                shareRecords = that.responseData.value.shareContactDetails;
            for (var i = 0, len = shareRecords.length; i < len; i++) {
                if (!shareRecords[i].isCreated) {
                    count++
                }
            }
            util.confirm('共有' + count + '条共享没有创建，您确定要批量创建吗？', '', function () {
                util.api({
                    "url": '/Contact/CopyContactsUnCreated',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {},
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.refresh();
                        }
                    }
                });
            });
        },
        //导入联系人
        _contractImport: function () {
            this.importDialog.show();
        },
        //导入联系人
        _contractExport: function () {
            this.exportDialog.show();
        },
        //关注和取消关注
        _followSwitch: function (e) {
            e.stopPropagation();
            var $el = $(e.target),
                contractID = $el.parents('tr').children().eq(0).find('span').attr('data-value');
            if ($el.hasClass('customers-following')) {
                //取消关注
                util.api({
                    "url": '/Contact/ContactCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: contractID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-following').addClass('customers-nofollow')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/Contact/ContactFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: contractID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-nofollow').addClass('customers-following')
                        }
                    }
                });
            }
        },

        // 新建按钮
        _createContract: function () {
            this.createDialog.show();
        },
        // 删除按钮
        _deleteContract: function () {

            var that = this;
            var tableEl = this.$el.find('.crm-table-bd .crm-datatable tbody');
            var allCheckboxEl = $('.checkbox-for-comtable .mn-checkbox-item', tableEl);
            var contactIDs = [];
            allCheckboxEl.each(function (i) {
                if ($(this).is('.mn-selected')) {
                    contactIDs.push($(this).data('value'));
                }
            });
            if (contactIDs.length > 0) {
                util.confirm('你确定要删除选中的' + contactIDs.length + '个联系人吗？', '', function () {
                    util.api({
                        "url": '/Contact/DeleteContacts',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contactIDs: contactIDs //List<int>，
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var result = responseData.value.result;
                                var resultstr = '';
                                var itemResultStr = '';
                                var delYesCount = 0;
                                var delNoCount = 0;
                                _.each(result, function (item, index) {
                                    var contactID = item.value;
                                    var isSuccess = item.value1;
                                    var describe = item.value2;
                                    var name = '';
                                    _.each(that.products, function (product, index) {
                                        if (product.salesOpportunityID === contactID) {
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
                util.alert('请选择要删除的联系人');
            }
        },


        //获取标签的相关数据
        _getProductTagsDatas: function () {
            var crmData = util.getCrmData(); //获取CRM缓存数据
            var functionPermissions = crmData.functionPermissions; //权限数据
            var marketingEventTypes = util.getTagsByType(9); //获取所有线索标签
            var allTags = []; //存放线索标签数据数组
            var that = this;
            var isAllowExportData = crmData.isAllowExportData;
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
                isAllowExportData: isAllowExportData, //是否允许导出
                functionPermissions: functionPermissions //权限数据
            });

        },
        // 初始化设置
        initialize: function () {
            this._getProductTagsDatas();
            var that = this;
            this.importDialog = new ImportDialog({
                "title": "我的联系人导入",
                "downloadApi": "GetMyContactExcelTemplate",
                "importApi": "/Contact/ImportMyContact",
                "downloadText": "我的联系人导入模板"
            });
            this.importDialog.on('uploaded', function () {
                that.refresh();
            })
            this.exportDialog = new ExportDialog({
                "type": "list"// list:列表的联系人导出，set:设置的联系人导出
            });
            this.createDialog = new ContactDialog();
            this.createViewDialog = new ContactViewDialog();
            this.createDialog.v = this;
            this.createViewDialog.v = this;
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
            this.showFnBtn();//控制权限按钮显示
            return this;
        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var elEl = this.$el;
            var exportEl = $('.contract-export-btn', elEl);

            var isAllowExportData = this.isAllowExportData;

            if (isAllowExportData) {
                exportEl.show();
            } else {
                exportEl.hide();
            }

        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var statesSelectListEl = $('.states-select-list', elEl);//状态
            var sortSelectListEl = $('.sort-select-list', elEl);
            //排序列表事件
            util.mnEvent(sortSelectListEl, 'change', function (val) {
                util.mnSelect(sortSelectListEl, 'removeOption', 2); //移除掉第3项
                that.oTable.fnSort([]);//排序样式重置
                that.refresh({ sortType: val });//刷新
            });
            //实例化分页组件
            this.pagination = new Pagination({
                "element": paginationWarpEl,
                "pageSize": this.options.data.pageSize,
                "totalSize": 0,
                "activePageNumber": 1
            });

            //状态下拉列表事件
            util.mnEvent(statesSelectListEl, 'change', function (val, text) {
                that.options.data.createCustomer = val;
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
                //                var returnUrl = encodeURIComponent('/') + 'contacts' + encodeURIComponent('/') + 'contact';
                var id = rowData.contactID;
                var shareContactMessageID = rowData.shareContactMessageID;
                var isCreated = rowData.isCreated;
                //                var name = encodeURIComponent(encodeURI(rowData.name));
                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: id
                }
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url + '/=/param-' + encodeURIComponent(JSON.stringify(param));

                //跳转到详情页
                if (!$(this).is('.td-checkbox-warp')) { //排除掉复选框列
                    that.createViewDialog.show({
                        contactID: id,
                        isShareContact: !isCreated,
                        shareContactMessageID: shareContactMessageID
                    });
                    /*   $('.crm-datatable tbody tr', elEl).removeClass('row_selected');
                     rowDataEl.addClass('row_selected'); //当前行添加选中样式
                     if (that.options.overwriteRowClick) {
                     that.trigger("rowClick", id);
                     return;
                     }
                     tpl.navRouter.navigate('#contacts/showcontact/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
                     tpl.event.one('dataUpdate', function () {
                     that.options.ID = id;
                     that.refresh();
                     });*/

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
                    /* {
                     "mData": "contactID", //列数据的数组keyname
                     "sWidth": "26px", //列宽
                     "sClass": "td-checkbox-warp",
                     "bSortable": false, //支持排序
                     "mRender": function (data, type, full) { //第1列内容
                     var mnCheckbox = '<div class="mn-checkbox-box checkbox-for-comtable">&nbsp;&nbsp;<span data-value="' + data + '" class="mn-checkbox-item"></span> </div>';
                     return mnCheckbox;
                     }
                     },*/
                    //关注
                    /* {
                     "mData": "followTime",
                     "sWidth": "30px",
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

                    //姓名
                    {
                        "mData": "post",
                        "sWidth": "150px",
                        "sClass": "black-name crmtable-sort-name",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var name = full.name || full.contactName;
                            var isShowBirthDay = full.isShowBirthDay;
                            var isUnread = full.isUnread;
                            var isNewStr = '<span style="color: #f60;">[新] </span>';
                            var newData;
                            var birthDayIcoStr='<span class="birthday-ico"></span>';
                            if (isUnread) {
                                isNewStr = '<span style="color: #f60;">[新] </span>';
                            } else {
                                isNewStr = '';
                            }
                            if (isShowBirthDay) {
                                newData = '<span title="' + name + '">' + isNewStr + name + '</span>' + birthDayIcoStr;
                            } else {
                                newData = '<span title="' + name + '">' + isNewStr + name + '</span>';
                            }

                            return newData;
                        }
                    },
                    //职务
                    {
                        "mData": "post",
                        "sWidth": "90px",
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
                        "sWidth": "90px",
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
                        "sWidth": "100px",
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
                        "mData": "followTime",
                        "sWidth": "120px",
                        "sClass": "crmtable-sort-upatetime",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var upatetime = full.upatetime || full.shareTime;
                            var newData = '<span title="' + moment.unix(upatetime).format('YYYY-MM-DD') + '">' + moment.unix(upatetime).format('YYYY-MM-DD') + '</span>';
                            return newData;
                        }
                    },
                    //状态
                    {
                        "mData": "isCreated",
                        "sWidth": "100px",
                        "sClass": "",
                        "bSortable": true,
                        "mRender": function (data, type, full) { //第2列内容
                            var isCreatedStr = '';
                            if (data) {
                                isCreatedStr = '已创建';
                            } else {
                                isCreatedStr = '<a href="javascript:;" class="list-created-contact-btn">创建联系人</a>';
                            }
                            var newData = isCreatedStr;
                            return newData;
                        }
                    },
                    //空列
                    {
                        "mData": "followTime",
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

                            if (that.options.ID) {
                                $('[data-value=' + that.options.ID + ']').closest('tr').addClass('row_selected');
                            }

                            /* 监听复选框change事件 */
                            $('.checkbox-for-comtable .mn-checkbox-item', that.$el).removeClass('mn-selected'); //先清空多选框
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
                            if (totalCount) {
                                $(".count-text").show();
                                $(".count-num").text(totalCount);
                            } else {
                                $(".count-text").hide();
                            }
                            that.trigger('loadSuccess', responseData);
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
                    "sEmptyTable": '<span class="empty-tip">没有获取到联系人</span>'
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
            var contacts = data.contacts || data.shareContactDetails;
            _.each(contacts, function (contact) { //目录列表
                formatData.push(_.extend({
                    "isDir": true,
                    "followTime": 0,
                    "attachSize": 0
                }, contact));
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


    module.exports = sContact;
});