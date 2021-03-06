/**
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-customer-list/crm-customer-list.html');
    var style = require('modules/crm-customer-list/crm-customer-list.css');
    var SelectFilterbar = require('modules/crm-select-filterbar/crm-select-filterbar');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var ImportDialog = require('modules/crm-object-import/crm-object-import');
    var ExportDialog = require('modules/crm-customer-export/crm-customer-export');
    var CustomerDialog = require('modules/crm-customer-add/crm-customer-add');
    var SelectContactsDialog = require('modules/crm-select-contacts/crm-select-contacts');
    var Scrollbar = require('scrollbar');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');//按人筛选组件
    var customerStatusTagID;

    var CustomerList = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'customer-list-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-customer-list-template').html()), //模板
        options: {
            warpEl: null,//父级容器
            url: "",
            hasButtons: true,//是否需要类表上方的按钮
            overwriteRowClick: false,//是否覆盖列表点击事件，如果覆盖请注册rowClick事件
            aoColumns: [
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
                //关注
                {
                    "mData": "followTime",
                    "sWidth": "24px",
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
                //编号
                {
                    "mData": "fCustomerNo",
                    "sWidth": "50px",
                    "sClass": "black-name crmtable-sort-no",
                    "bSortable": true,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + data + '">' + data + '</span>';
                        return newData;
                    }
                },
                //负责人
                {
                    "mData": "ownerName",
                    "sWidth": "50px",
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
                    "sWidth": "100px",
                    "bSortable": false,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + data + '">' + data + '</span>';
                        return newData;
                    }
                },
                //最后变化时间
                {
//                    "mData": "lastUpdateTime",
                    "mData": "lastChangedTime",
                    "sWidth": "120px",
                    "sClass": "crmtable-sort-lastupdatetime",
                    "bSortable": true,
                    "asSorting": [ "desc", "asc" ],
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                        return newData;
                    }
                },
                //创建时间
                {
                    "mData": "createTime",
                    "sWidth": "120px",
                    "sClass": "crmtable-sort-createtime",
                    "bSortable": true,
                    "mRender": function (data, type, full) {
                        var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '">' + moment.unix(data).format('YYYY-MM-DD HH:mm') + '</span>';
                        return newData;
                    }
                },
                //空列
                {
                    "mData": "createTime",
                    "sClass": "th-blank",
                    "bSortable": false,
                    "mRender": function (data, type, full) { //第2列内容
                        var newData = '';
                        return newData;
                    }
                }
            ],//设置list显示模版
            data: {
                employeeID: util.getCrmData().currentEmp.employeeID,
                ownerID: 0, //int?，筛选归属人ID
                keyword: '',//搜索关键字
                isFirstChar: false,
                listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 1,//排序规则(按照最后更新时间或者关注时间倒序=1；按照客户nameSpell、Name正排序=2;先按照归属人nameSpell、Name正排，再按照客户的最后变化时间倒排，当前用户的客户排列在前面=3；按照客户nameSpell、Name倒排序=4；按负责人正排序=5；按负责人倒排序=6；按修改时间正排序=7；按修改时间倒排序=8；按创建时间正排序=9；按创建时间倒排序=10)
                queryType: 2,//查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;)
                pageSize: 10,//分页大小
                pageNumber: 1//当前页
            },
            isLoadServerData: false
        },
        events: {
            "click .cancel-selectallcustomer": "cancelSelectallcustomer", //取消按人筛选按钮
            "click .crm-allcustomers-fliter": "allCustomersFliter", //按人筛选按钮
            "click .crm-datatable th": "_crmTableSort", //点击TH表格排序
            "click .customers-follow": "_followSwitch", //关注
            "click .create-customer-btn": "_createCustomer",
            "click .create-by-contracts-btn": "_createByContracts",
            "click .delete-product-btn": "_deleteProduct", //删除产品按钮
            "click .checkbox-selectall-btn": "_checkboxSelectall", //选择所有复选框
            "click .customer-import": "_customerImport",//导入客户
            "click .customer-add-combine-salers": "_customerAddCombineSalers",//添加联合跟进人
            "click .customer-export": "_customerExport"//导出客户
        },
        cancelSelectallcustomer:function(){
            var $filterTitle = $('.crm-crmsettings-filterinfo',this.$el);
            this.refresh({
                keyword: '',// string，搜索关键字
                isFirstChar: false,//，是否首字母查询
                ownerID: 0,//，归属人ID
                pageNumber: 1,//，页码
                pageSize: 10
            });
            $filterTitle.hide();
        },
        allCustomersFliter:function(){
            this.selectAllCustomer.show();
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
                    {//编号
                        clasName: '.crmtable-sort-no',
                        sortType: [11, 12]//升序值，降序值
                    },
                    {//负责人
                        clasName: '.crmtable-sort-ownername',
                        sortType: [5, 6]//升序值，降序值
                    },
                    {//最后修改时间
                        clasName: '.crmtable-sort-lastupdatetime',
                        sortType: [7, 8]//升序值，降序值
                    },
                    {//创建
                        clasName: '.crmtable-sort-createtime',
                        sortType: [9, 10]//升序值，降序值
                    }
                ],
                callback: function (data) {
                    that.refresh(data);//刷新列表
                }
            });

        },
        //导入客户
        _customerImport: function () {
            this.importDialog.show();
        },
        //导出客户
        _customerExport: function () {
            this.exportDialog.show();
        },
        //添加联合跟进人
        _customerAddCombineSalers: function () {
            var me = this,
                selectedCheckboxEl = $('.crm-table-bd .crm-datatable tbody .checkbox-for-comtable .mn-selected', me.$el);
            if(selectedCheckboxEl.length > 0){
                me.selectColleague.show();
            }
            else {
                util.alert('请选择客户');
            }
        },
        //关注
        _followSwitch: function (e) {
            e.stopPropagation();
            var $el = $(e.target),
                customerID = $el.parents('tr').children().eq(0).find('span').attr('data-value');
            if ($el.hasClass('customers-following')) {
                //取消关注
                util.api({
                    "url": '/FCustomer/CancelFCustomerFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { customerID: customerID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-following').addClass('customers-nofollow')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/FCustomer/FCustomerFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { customerID: customerID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('customers-nofollow').addClass('customers-following')
                        }
                    }
                });
            }
        },
        _createCustomer: function () {
            this.createDialog.show();
        },
        //通过联系人创建
        _createByContracts: function () {
            this.createByContactsDialog.show();
        },
        //获取客户标签的相关数据
        _getCustomerTagsDatas: function () {
            var crmData = util.getCrmData();//获取CRM缓存数据
            var fBusinessTags = crmData.fBusinessTags;//标签数据
            var functionPermissions = crmData.functionPermissions;//权限数据
            var isForbiddenCreateFCustomer = crmData.isForbiddenCreateFCustomer;//是否不允许创建客户
            var tags = [];//客户标签数据
            var systemTags = null;
            var TagsOptionForList = [ //客户选项数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === util.CONSTANT.TAG_TYPE.CUSTOMER) {//筛选出客户标签
                    if (fBusinessTag.isSystemTag) {
                        systemTags = fBusinessTag;
                    } else {
                        tags.push(fBusinessTag);
                    }

                    //                    if (fBusinessTag.systemTagCode === 110) {
                    _.each(fBusinessTag.options, function (option, index) {
                        TagsOptionForList.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        })
                    });
                    //                    }
                }
            });
            tags.unshift(systemTags); //把系统标签放在第一位
            this.tags = tags;//客户标签数据，新建标签的窗口需要用到

            this.TagsOptionForList = TagsOptionForList;//客户选项数据
            this.functionPermissions = functionPermissions;//权限数据
            this.isForbiddenCreateFCustomer = isForbiddenCreateFCustomer;//是否不允许创建客户
        },
        // 初始化设置
        initialize: function () {
            var $el = this.$el,
                that = this;

            this._getCustomerTagsDatas();

            this.selectAllCustomer = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":true,
                "title":"选择员工"
            });
            this.selectAllCustomer.on("selected",function(val){
                var $filterTitle = $('.crm-crmsettings-filterinfo',$el);
                $filterTitle.find('span').text(val.name);
                $filterTitle.show();
                that.refresh({
                    keyword: '',// string，搜索关键字
                    isFirstChar: false,//，是否首字母查询
                    ownerID: val.employeeID,//，归属人ID
                    pageNumber: 1,//，页码
                    pageSize: 10
                });
            });

            this.createDialog = new CustomerDialog();//先把弹框NEW出来因为只有1个
            this.createDialog.v = this;

            this.createByContactsDialog = new SelectContactsDialog({
                "title": "选择联系人创建客户",
                "url": "/Contact/GetUserContacts/",
                "defaultCondition": {
                    "employeeID": util.getCurrentEmp().employeeID,
                    "isFirstChar": false,
                    "source": 0,
                    "createCustomer": 0,
                    "startDate": 0,
                    "endDate": 0,
                    "tagOptionIDsJson": "",
                    "sortType": 1,
                    "keyword": "",
                    "isContainSubordinate": 0,
                    "pageSize": 12,
                    "pageNumber": 1
                }
            });
            this.createByContactsDialog.on('selected', function (arr) {
                var contactIDs = [];
                _.map(arr, function (obj) {
                    contactIDs.push(obj.contactID);
                });
                util.api({
                    "url": '/FCustomer/BatchAddFCustomerByContactID',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contactIDs: contactIDs },
                    "success": function (responseData) {
                        if (responseData.success) {
                            var msg = [];
                            var result = (responseData.value && responseData.value.result) || [];
                            var successNum = 0;
                            for (var i = 0, len = result.length; i < len; i++) {
                                if (result[i].value1) {
                                    successNum++;
                                } else {
                                    msg.push(result[i].value2);
                                }
                            }

                            if (msg.length) {
                                msg.unshift('本次共成功创建客户' + successNum + '个,失败' + (result.length - successNum) + '个,失败原因:');
                            } else {
                                msg.unshift('本次共成功创建客户' + successNum + '个,失败' + (result.length - successNum) + '个。');
                            }

                            util.alert(msg.join('<br>'));
                            that.refresh({
                                listTagOptionID: '1,0',
                                keyword: '',//搜索关键字
                                isFirstChar: false,
                                sortType: 1,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                                pageSize: 10,//分页大小
                                pageNumber: 1//当前页
                            });
                            that.reSetMnselect();//重置模拟下拉框
                        }
                    }
                });
            });

            this.createByContactsDialog.v = this;


            this.importDialog = new ImportDialog({
                "title": "我的客户导入",
                "downloadApi": "GetMyFCustomerExcelTemplate",
                "importApi": "/FCustomer/ImportMyFCustomer",
                "downloadText": "我的客户导入模板"
            });
            this.importDialog.on('uploaded', function () {
                that.refresh({
                    listTagOptionID: '1,0',
                    keyword: '',//搜索关键字
                    isFirstChar: false,
                    sortType: 1,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                    pageSize: 10,//分页大小
                    pageNumber: 1//当前页
                });
                that.reSetMnselect();//重置模拟下拉框
            });

            this.exportDialog = new ExportDialog({
                "title": "我的客户导出",
                "exportApi": "/FCustomer/ExportMyFCustomersExcel"
            });
            this.render();
            var hasButtons = this.options.hasButtons;
            if (hasButtons) {
                $(".top-fn-btns", $el).show()
            } else {
                $(".top-fn-btns", $el).hide()
            }
            this.setDataTabel();//实例化datatable(所有请求数据从实例化表格开始)
            //            this.scroll = new Scrollbar({
            //                "element":$('.crm-table-bd', $el)
            //            });
            this.options.isLoadServerData = true;

            var me = this;
            me.selectColleague = new SelectColleague({
                "isMultiSelect":true,
                "hasWorkLeaveBtn":false,
                "title": "选择联合跟进人",
                "defaultCondition":{
                    "queryType":0,
                    "isFirstChar":false,
                    "keyword":"",
                    "circleID":-1,
                    // "exceptEmployeeIDs":this._getExceptEmployeeIDs,
                    "isStop":false,
                    "pageSize":20,
                    "pageNumber":1
                }
            });
            me.selectColleague.on("selected",function(val){
                if(!val || val.length < 1){
                    return;
                }
                var selectedCheckboxEl = $('.crm-table-bd .crm-datatable tbody .checkbox-for-comtable .mn-selected', me.$el),
                    data = {
                        customerIDs: [],
                        employeeIDs: []
                    };
                if(selectedCheckboxEl.length < 1){
                    util.alert('请选择客户');
                    return ;
                }
                selectedCheckboxEl.each(function () {
                    data.customerIDs.push($(this).attr('data-value'));
                });
                _.each(val, function (item) {
                    data.employeeIDs.push(item.employeeID);
                });
                util.api({
                    "dataType": 'json',
                    data: data,
                    "type": "post",
                    "url": '/FCustomer/AddFCustomersCombineSalers',
                    "success": function (res) {
                        if(res.success){
                            util.remind(2,"保存成功");
                            me.refresh();
                        }
                    }
                });
            });
        },
        render: function () {
            var $el = this.$el;
            var renderTemplate = this.template;
            var that = this;
            var tags = this.tags;
            $el.html(renderTemplate({
                value: {
                    employees: {}
                }
            }));
            this.options.warpEl.html($el);
            this.showFnBtn();
            this.setupComponent();//设置组件

            return this;
        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var topFnBtnsEl = $('.top-fn-btns', this.$el);
            var isShowFnBtn = false;
            var isForbiddenCreateFCustomer = this.isForbiddenCreateFCustomer;
            _.each(this.functionPermissions, function (functionPermission, index) {
                var value = functionPermission.value;
                if (value == 31) { //31是客户管理员权限
                    isShowFnBtn = true;
                }
            });
            if (isForbiddenCreateFCustomer) {
                $('.create-customer-btn', this.$el).hide();
                $('.create-by-contracts-btn', this.$el).hide();
                $('.customer-import', this.$el).hide();
            } else {
                $('.create-customer-btn', this.$el).show();
                $('.create-by-contracts-btn', this.$el).show();
                $('.customer-import', this.$el).show();
            }
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
            var customerStatusSelectEl = $('.customer-select-list', elEl);
            var sortSelectListEl = $('.sort-select-list', elEl);
            //排序列表事件
            util.mnEvent(sortSelectListEl, 'change', function (val) {
                util.mnSelect(sortSelectListEl, 'removeOption', 2); //移除掉第3项
//                that.oTable.fnSort([]);//排序样式重置
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
            //分页事件
            this.pagination.on('page', function (val) {
                that.options.data.pageNumber = val;
                that.refresh();
            });
            _.map(FS.getAppStore('contactData').fBusinessTags, function (tag, index) {
                if (tag.systemTagCode == 101) {//客户状态标签
                    customerStatusTagID = tag.fBusinessTagID;
                    var options = [
                        {
                            value: 0,
                            text: '不限'
                        }
                    ];
                    _.map(tag.options, function (opt, index) {
                        options.push({
                            text: opt.name,
                            value: opt.fBusinessTagOptionID
                        });
                    });

                    util.mnEvent(customerStatusSelectEl, 'change', function (val, text) {
                        that.options.data.listTagOptionID = tag.fBusinessTagID + ',' + val;
                        that.refresh();
                    });
                    that.selectEloptionsaaa = options;


                }
            });

            //表格的TR点击事件
            elEl.on('click', '.crm-datatable tbody tr td', function () {
                if ($(this).hasClass('td-checkbox-warp')) {//排除掉复选框列
                    return;
                }
                var rowDataEl = $(this).closest('tr');
                var rowData = that.oTable.fnGetData(rowDataEl.get(0));
                var cID = rowData.customerID;
                //                var returnUrl = encodeURIComponent('/') + 'products' + encodeURIComponent('/') + 'product';
                //                var id = rowData.productID;
                //                var name = encodeURI(rowData.name);
                //                //跳转到详情页
                //                if(!$(this).is('.td-checkbox-warp')){//排除掉复选框列
                //                    tpl.navRouter.navigate('#products/showproduct/=/id-' + id + '/name-' + name + '/returnUrl-' + returnUrl, { trigger: true });
                //                }
                $('.crm-datatable tbody tr', elEl).removeClass('row_selected');
                rowDataEl.addClass('row_selected');//当前行添加选中样式
                if (that.options.overwriteRowClick) {
                    that.trigger("rowClick", cID);
                    return;
                }
                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: cID
                };
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url + '/=/param-' + encodeURIComponent(JSON.stringify(param));
                tpl.event.one('dataUpdate', function () {
                    that.options.customerID = cID;
                    that.refresh();
                });
                tpl.navRouter.navigate('#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
            });

            //条件筛选工具条
            if (!this.selectFilterbar) {
                this.selectFilterbar = new SelectFilterbar({
                    warpEl: $('.customer-select-toolbar', elEl),
                    title: '客户 - 条件筛选',
                    v: this,
                    defLine:2,//默认显示几行
                    data: this.tags
                });
            }

        },
        //更新数据

        // 请求数据
        //        load: function () {
        //            this.setDataTabel();//实例化datatable(所有请求数据从实例化表格开始)
        //            this.options.isLoadServerData = true;
        //        },
        // 刷新数据

        refresh: function (data, tagType) {
            data && (_.extend(this.options.data, data));
            this.oTable.fnReloadAjax();
        },
        //重置模拟下拉框
        reSetMnselect: function () {
            var elEl = this.$el;
            var that = this;
            var customerStatusSelectEl = $('.customer-select-list', elEl);
            _.map(FS.getAppStore('contactData').fBusinessTags, function (tag, index) {
                if (tag.systemTagCode == 101) {//客户状态标签
                    customerStatusTagID = tag.fBusinessTagID;
                    var options = [
                        {
                            value: 0,
                            text: '不限'
                        }
                    ];
                    _.map(tag.options, function (opt, index) {
                        options.push({
                            text: opt.name,
                            value: opt.fBusinessTagOptionID
                        });
                    });

                    util.mnEvent(customerStatusSelectEl, 'change', function (val, text) {
                        that.options.data.listTagOptionID = tag.fBusinessTagID + ',' + val;
                        that.refresh();
                    });
                    that.selectEloptions = options;


                }
            });
            util.mnSelect(customerStatusSelectEl, 'syncModel', this.selectEloptions);
            util.mnSelect($('.sort-select-list', elEl), 'syncModel', [
                {
                    "text": "发生变化的在最前面",
                    "value": 0
                },
                {
                    "text": "按名称排序",
                    "value": 2
                }
            ]);
            //重置分页组件为第一页
            this.pagination.jump(1, true);
        },
        // datatabel表格配置
        setDataTabel: function () {
            var that = this;
            var elEl = this.$el;
            var tableEl = elEl.find('.crm-table-bd .crm-datatable');
            this.oTable = tableEl.dataTable({
                "sDom": 'Rlfrtip',//拖拽需要的结构，具体配置见官方API
                //每列的数据处理
                "aoColumns": this.options.aoColumns,
                //接口地址
                "sAjaxSource": this.options.url,
                //请求和回调处理
                "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                    if (!that.options.isLoadServerData) return;
                    var requestData = that.options.data;

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
                            $('.customers-title-intro', elEl).children('span').text(totalCount);
                            that.customers = responseData.value.customers;//把产品标签保存起来后面会需要取产品名字
                            fnCallback(that._formatTableData(responseData));
                            that.pagination.setTotalSize(totalCount);

                            if (that.options.customerID) {
                                $('[data-value=' + that.options.customerID + ']').closest('tr').addClass('row_selected');
                            }
                            /* 监听复选框change事件 */
                            $('.checkbox-for-comtable .mn-checkbox-item', that.$el).removeClass('mn-selected'); //先清空多选框
                            $('tbody tr', that.oTable).each(function (i) {
                                var that = this;
                                util.mnEvent($(this).find('.mn-checkbox-box'), 'change', function (val) {
                                    if (val == '') {//选中
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

                        }
                    });
                },
                "bAutoWidth": false, //列的宽度会根据table的宽度自适应(打开会影响拖拽功能)
                "bFilter": false, //搜索栏  
                "bPaginate": false, //是否启用分页
                "bInfo": false,
                "bSort":false,//是否排序
                "oLanguage": {
                    //无结果时显示的内容
                    "sEmptyTable": '<span class="empty-tip">没有获取到客户</span>'
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
            var products = data.customers;
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
            try{
                this.exportDialog && this.exportDialog.destroy();
                this.importDialog && this.importDialog.destroy();
                this.selectColleague && this.selectColleague.destroy();
                this.createByContactsDialog && this.createByContactsDialog.destroy();
            } catch (e){}
            this.remove();
        }
    });

    module.exports = CustomerList;
});