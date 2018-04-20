define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;

    var util = require('util'),
        SearchBox = require('uilibs/search-box'),
        Tab = require('uilibs/tabs2'),
        AttachmentList = require('modules/crm-attachment/crm-attachment'),
        SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');

    var CustomerDialog = require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit'),
        CustomerTimeline = require('modules/crm-customer-timeline/crm-customer-timeline'),
        CustomerBaseinfo = require('modules/crm-customer-baseinfo/crm-customer-baseinfo'),
        ContractDialog = require('modules/crm-contract-edit/crm-contract-edit'),
        ContactDialog = require('modules/crm-contact-edit/crm-contact-edit'),
        ContactViewDialog = require('modules/crm-contact-view/crm-contact-view'),
        ContactsDialog = require('modules/crm-select-contacts/crm-select-contacts'),
        OpportunityDialog = require('modules/crm-opportunity-edit/crm-opportunity-edit');
    var ProductInOppEditDialog = require('modules/crm-productinopp-edit/crm-productinopp-edit');
    var Detaillist = require('modules/crm-detaillists/crm-detaillists');//明细页产品列表
    var moment = require('moment');
    var Operation = require('modules/crm-contact-operation/crm-contact-operation');

    var ShowCustomer = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.init(); //初始化
    };
    exports.init = function () {
        new ShowCustomer({
            element: exports.tplEl
        });
    };
    $.extend(ShowCustomer.prototype, {
        init: function () {
            var tplEl = this.options.element,
                tplName = exports.tplName,
                $customerTypeEl = $('.customer-status-select', tplEl),
                $detailBd = $('.tab-time-line-box', tplEl),
                $baseinfoBd = $('.tab-base-info-box', tplEl),
                $contactBd = $('.tab-contacts-box', tplEl),
                customerStatusTagID;

            var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4

            var CustomerDetail = Backbone.View.extend({
                el: tplEl,
                events: {
                    'click .customer-to-follow-btn': '_switchFollow',
                    'click .crm-button-back': '_pageBack',
                    'click .customers-edit-btn': '_editCustomer',
                    'click .customers-chg-respo-btn': '_chgResp',
                    'click .customer-detail-resp': '_chgResp'
                },
                initialize: function () {
                    this._getCustomerTagsDatas();
                    this.render();
                    this.myID = queryParams.id;
                },
                destroy: function(){
                	this.timeline && (this.timeline.destroy());
                	this.contactsDialog && (this.contactsDialog.destroy());
                	this.editDialog && (this.editDialog.destroy());
                	this.selectColleague && (this.selectColleague.destroy());
                	this.selectColleague && (this.selectColleague.destroy());
                	this.addOppDialog && (this.addOppDialog.destroy());
                	this.addContactDialog && (this.addContactDialog.destroy());
                	this.editContactDialog && (this.editContactDialog.destroy());
                	util.mnDestroy($customerTypeEl);
                },
                render: function () {
                    this.loadCustomerData();
                },
                //客户中的联系人列表
                _detaillistContacts: function () {
                    var that = this;
                    var self = this;
                    var elEl = this.$el;
                    var operation = false;
                    var rightTopBTnText = ' ';
                    var ownerId = this.options.customerData.value.FCustomer.owner.employeeID || 0;
                    var emptyStr = '没有联系人，立即<a href="javascript:;" class="table-add-btn">新建</a>或<a href="javascript:;" class="table-modify-btn">选择已有</a> ';
                    if (ownerId == this.currentEmpID) {
                        operation = true;
                        rightTopBTnText = '操作 ∨';
                        emptyStr = '没有联系人，立即<a href="javascript:;" class="table-add-btn">新建</a>或<a href="javascript:;" class="table-modify-btn">选择已有</a> ';
                    } else {
                        operation = true;
                        rightTopBTnText = '操作 ∨';
                        emptyStr = '没有联系人，立即<a href="javascript:;" class="table-add-btn">新建</a>';
                    }

                    this.detaillistContacts = new Detaillist({
                        warpEl: $('.tab-contacts-box', elEl),
                        title: '联系人',
                        operation: operation,//操作V

                        rightTopBTnText: rightTopBTnText,
                        operationClass: 'table-operation-btn',
                        url: '/FCustomer/GetContactsByCustomerID', //请求地址
                        data: {
                            customerID: that.myID
                        },
                        hideAddBtn: true,
                        emptyStr: emptyStr,
                        jDatas: 'Contacts',//需要的数据对象
                        thDatas: ['姓名', '联系方式', '职务', '部门', '公司', '操作'],//表格标题
                        aoColumnsData: [//列配置
                            //名称
                            {
                                "mData": "name",
                                "sWidth": "200px",
                                "sClass": "text-black",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            //联系方式
                            {
                                "mData": "firstContactWay",
                                "sWidth": "120px",
                                "sClass": "",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var typeDesc = data.typeDesc;
                                    var content = data.content;
                                    if (content) {
                                        content = '：' + content;
                                    }
                                    var newData = '<span title="' + typeDesc + content + '">' + typeDesc + content + '</span>';

                                    return newData;
                                }
                            },
                            {
                                "mData": "post",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "department",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },

                            {
                                "mData": "company",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            //操作
                            {
                                "mData": "blank",
                                "sWidth": "200px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<a href="javascript:;" class="table-del-btn">取消关联</a>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "blank",
                                "sClass": "th-blank",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '';
                                    return newData;
                                }
                            }
                        ]

                    });
                    //                this.detaillistContacts.on('add', function (rowData) {
                    //                    var salesOpportunityID = that.myID
                    //                    that.operation.show();
                    //                });
                    this.detaillistContacts.on('del', function (rowData) {
                        var that = this;
                        util.confirm('你确定要将联系人' + rowData.name + '从客户' + rowData.customerName + '下移除吗？', '', function () {
                            util.api({
                                "url": '/Contact/UnCombineContactAndFCustomer',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    "contactID": rowData.contactID
                                },
                                "success": function (responseData) {
                                    if (responseData.success) {
                                        that.refresh();
                                        self.refresh();
                                    }
                                }
                            });
                        });
                    });
                    this.detaillistContacts.on('add', function (rowData) {
                        that.addContactDialog.show({
                            customerID: queryParams.id,
                            customerName: self.options.customerData.value.FCustomer.name || self.options.customerData.value.FCustomer.customerName
                        });
                    });
                    this.detaillistContacts.on('modify', function (rowData) {
                        self.contactsDialog.show();
                    });
                    this.detaillistContacts.on('tr', function (rowData) {
                        that.editContactDialog.show({
                            contactID: rowData.contactID
                        })
                    });


                },
                //客户中的机会列表
                _detaillistOpp: function () {
                    var that = this;
                    var self = this;
                    var elEl = this.$el;
                    this.detaillistOpp = new Detaillist({
                        warpEl: $('.tab-opp-box', elEl),
                        title: '机会',
                        url: '/SalesOpportunity/GetSalesOpportunitysByCustomerID', //请求地址
                        data: {
                            customerID: that.myID
                        },
                        emptyStr: '当前客户下没有获取到机会',
                        jDatas: 'salesOpportunitys',//需要的数据对象
                        thDatas: ['名称', '负责人', '状态', '金额', '预计成交日期', '销售阶段', '赢率', '操作'],//表格标题
                        aoColumnsData: [//列配置
                            //名称
                            {
                                "mData": "name",
                                "sWidth": "100px",
                                "sClass": "text-black",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "owner",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data.name + '">' + data.name + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "statesDesc",
                                "sWidth": "30px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },

                            {
                                "mData": "expectedSalesAmount",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    data = _.str.numberFormat(parseFloat(data), 2);
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            //预计成交日期
                            {
                                "mData": "expectedDealTime",
                                "sWidth": "60px",
                                "sClass": "crmtable-sort-expecteddealtime",
                                //                        "sType": "numeric-comma",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容
                                    var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                                    return newData;
                                }
                            },
                            //销售阶段
                            {
                                "mData": "salesStage",
                                "sWidth": "90px",
                                "sClass": "crmtable-sort-salesstage",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容

                                    var newData = '<span title="' + data.name + '">' + data.name + '</span>';
                                    return newData;
                                }
                            },
                            //盈率
                            {
                                "mData": "salesStage",
                                "sWidth": "30px",
                                "sClass": "",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容

                                    var newData = '<span title="' + data.name.winRate + '%">' + data.winRate + '%</span>';
                                    return newData;
                                }
                            },
                            //操作
                            {
                                "mData": "blank",
                                "sWidth": "50px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<a href="javascript:;" class="table-modify-btn">编辑</a> <a href="javascript:;" class="table-del-btn">删除</a>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "blank",
                                "sClass": "th-blank",
                                "sWidth": "10px",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容
                                    var newData = '';
                                    return newData;
                                }
                            }
                        ]

                    });
                    this.detaillistOpp.on('add', function (rowData) {
                        var id = that.myID
                        self.addOppDialog.show();
                    });
                    this.detaillistOpp.on('tr', function (rowData) {
                        var salesOpportunityID = rowData.salesOpportunityID || 0;
                        var returnUrl = encodeURIComponent('/') + 'customers' + encodeURIComponent('/') + 'showcustomer';
                        var url = window.location.href.split('#')[1];
                        var param = {
                            id: salesOpportunityID
                        };
                        param = _.extend({}, util.getTplQueryParams2(), param);
                        param.returnUrl = url;
                        tpl.navRouter.navigate('#opportunities/showopportunity/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
                    });
                    this.detaillistOpp.on('modify', function (rowData) {
                        self.modifyOppDialog.show({
                            salesOpportunityID: rowData.salesOpportunityID
                        });
                    });
                    this.detaillistOpp.on('del', function (rowData) {
                        var that = this;
                        util.confirm('你确定要删除该机会吗？', '', function () {
                            util.api({
                                "url": '/SalesOpportunity/DeleteSalesOpportunitys',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    "salesOpportunityIDs": rowData.salesOpportunityID
                                },
                                "success": function (responseData) {
                                    if (responseData.success) {
                                        if (responseData.value.result[0].value1) {
                                            that.refresh();
                                        } else {
                                            util.alert('删除销售机会失败，原因：' + responseData.value.result[0].value2);
                                        }
                                    }
                                }
                            });
                        });
                    });

                },
                //客户中的合同列表
                _detaillistContracts: function () {
                    var that = this;
                    var self = this;
                    var elEl = this.$el;
                    this.detaillistContracts = new Detaillist({
                        warpEl: $('.tab-contract-box', elEl),
                        title: '合同',
                        url: '/Contract/GetContractsByCustomerID', //请求地址
                        data: {
                            customerID: that.myID
                        },
                        emptyStr: '当前客户下没有获取到合同',
                        jDatas: 'hContractEntity',//需要的数据对象
                        thDatas: ['标题', '合同编号', '状态', '开始日期', '结束日期', '操作'],//表格标题
                        aoColumnsData: [//列配置
                            //名称
                            {
                                "mData": "title",
                                "sWidth": "200px",
                                "sClass": "text-black",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "contractNO",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "statesDesc",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },

                            {
                                "mData": "beginDate",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "endDate",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                                    return newData;
                                }
                            },
                            //操作
                            {
                                "mData": "blank",
                                "sWidth": "200px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<a href="javascript:;" class="table-modify-btn">编辑</a> <a href="javascript:;" class="table-del-btn">删除</a>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "blank",
                                "sClass": "th-blank",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容
                                    var newData = '';
                                    return newData;
                                }
                            }
                        ]

                    });
                    this.detaillistContracts.on('add', function (rowData) {
                        var id = that.myID
                        self.addContractDialog.show();
                    });
                    this.detaillistContracts.on('modify', function (rowData) {
                        self.modifyContractDialog.show({
                            contractID: rowData.contractID
                        });
                    });

                    this.detaillistContracts.on('tr', function (rowData) {
                        var contractID = rowData.contractID || 0;
                        var returnUrl = encodeURIComponent('/') + 'customers' + encodeURIComponent('/') + 'showcustomer';
                        var url = window.location.href.split('#')[1];
                        var param = {
                            id: contractID
                        };
                        param = _.extend({}, util.getTplQueryParams2(), param);
                        param.returnUrl = url;
                        tpl.navRouter.navigate('#contracts/showcontract/=/param-' + encodeURIComponent(JSON.stringify(param)), {
                            trigger: true
                        });
                    });

                    this.detaillistContracts.on('del', function (rowData) {
                        var that = this;
                        util.confirm('你确定要删除该合同吗？', '', function () {
                            util.api({
                                "url": '/Contract/DeleteContracts',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    "contractIDs": rowData.contractID
                                },
                                "success": function (responseData) {
                                    if (responseData.success) {
                                        that.refresh();
                                    }
                                }
                            });
                        });
                    });
                },
                //客户中的产品列表
                _detaillistProduct: function () {
                    var that = this;
                    var elEl = this.$el;
                    this.detaillistProduct = new Detaillist({
                        warpEl: $('.tab-product-box', elEl),
                        title: '产品',
                        url: '/FCustomer/GetProductRelationsByCustomerID', //请求地址
                        data: {
                            customerID: that.myID
                        },
                        hideAddBtn: true,
                        emptyStr: '当前客户下没有获取到产品，请在机会下添加',
                        jDatas: 'oppProductRelations',//需要的数据对象
                        thDatas: ['名称', '单位', '单价', '数量', '总价'],//表格标题
                        aoColumnsData: [ //列配置
                            //名称
                            {
                                "mData": "productName",
                                "sWidth": "200px",
                                "sClass": "text-black",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "unit",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "unitAmount",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var formatNum = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                                    var newData = '<span title="' + formatNum + '">' + formatNum + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "count",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var newData = '<span title="' + data + '">' + data + '</span>';
                                    return newData;
                                }
                            },
                            {
                                "mData": "totalAmount",
                                "sWidth": "90px",
                                "bSortable": false,
                                "mRender": function (data, type, full) {
                                    var formatNum = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                                    var newData = '<span title="' + formatNum + '">' + formatNum + '</span>';
                                    return newData;
                                }
                            },

                            {
                                "mData": "blank",
                                "sClass": "th-blank",
                                "bSortable": false,
                                "mRender": function (data, type, full) { //第2列内容
                                    var newData = '';
                                    return newData;
                                }
                            }
                        ]

                    });
                    this.detaillistProduct.on('add', function (rowData) {
                        var salesOpportunityID = that.myID
                    });
                    this.detaillistProduct.on('modify', function (rowData) {
                    });
                    this.detaillistProduct.on('tr', function (rowData) {
                        that.addProductDialog.show({
                            oppProductRelationID: rowData.oppProductRelationID
                        });

                        /* var productID = rowData.productID || 0;
                         var returnUrl = encodeURIComponent('/') + 'customers' + encodeURIComponent('/') + 'showcustomer';
                         var url = window.location.href.split('#')[1];
                         var param = {
                         id: productID
                         };
                         param = _.extend({}, util.getTplQueryParams2(), param);
                         param.returnUrl = url;
                         tpl.navRouter.navigate('#products/showproduct/=/param-' + encodeURIComponent(JSON.stringify(param)), {
                         trigger: true
                         });*/
                    });
                    this.detaillistProduct.on('del', function (rowData) {
                        var that = this;
                        util.confirm('你确定要删除该产品吗？', '', function () {
                            util.api({
                                "url": '/FCustomer/DeleteOppProductRelation',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    "oppProductRelationID": rowData.oppProductRelationID
                                },
                                "success": function (responseData) {
                                    if (responseData.success) {
                                        that.refresh();
                                    }
                                }
                            });
                        });
                    });
                    this.detaillistProduct.$el.find('.table-add-btn').hide();
                    this.detaillistProduct.on('loadSuccess', function () {
                        that.detaillistProduct.$el.find('.table-add-btn').hide();
                    });
                },
                //设置组件
                setComponent: function () {
                    var $el = this.$el;
                    var self = this;
                    var that = this;
                    var c = this.options.customerData.value.FCustomer;
                    var remainingDaysDesc = self.options.customerData.value.FCustomer.fBusinessTagRelations[0].fBusinessTagOptionName;//接口里面给出的当前的状态
                    this._detaillistProduct(); //客户中的产品列表
                    this._detaillistContracts(); //客户中的合同列表
                    this._detaillistOpp(); //客户中的机会列表
                    //选择负责人
                    this.selectColleague = new SelectColleague({
                        //"element":$('.select-colleague',tplEl)
                        "isMultiSelect": false,
                        "hasWorkLeaveBtn": false,
                        "title": "选择负责人"
                    });
                    this.selectColleague.on("selected", function (obj) {
                        var lastOwnerId = self.options.customerData.value.FCustomer.ownerID;
                        util.confirm('您确定要将该销售客户的负责人变更为【' + obj.name + '】吗?', ' ', function () {
                            util.api({
                                "url": '/FCustomer/ModifyFCustomerOwner',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    customerID: queryParams.id,
                                    ownerID: obj.employeeID
                                },
                                "success": function (data) {
                                    var itemResultStr = '';
                                    if (data.success) {
                                        util.remind(1, "变更成功");
                                        $('.customer-detail-resp', $el).text(obj.name);
                                        self.options.customerData.value.FCustomer.ownerID = obj.employeeID;
                                        that.timeline.followUpBox.replace(lastOwnerId, obj);//刷新联合跟进人
                                        location.reload();//强行刷新整体页面 因为bug 1628
                                    }
                                }
                            }, {
                                "submitSelector": ''
                            });
                        });
                    });

                    //下拉框
                    var options = [];
                    _.map(FS.getAppStore('contactData').fBusinessTags, function (tag, index) {
                        if (tag.systemTagCode == 101) {
                            customerStatusTagID = tag.fBusinessTagID;

                            _.map(tag.options, function (opt, index) {
                                if (opt.fBusinessTagOptionID == (c.fBusinessTagRelations[0] && c.fBusinessTagRelations[0].fBusinessTagOptionID)) {
                                    options.push({
                                        "text": opt.name,
                                        "value": opt.fBusinessTagOptionID,
                                        "selected": true
                                    });
                                } else {
                                    options.push({
                                        "text": opt.name,
                                        "value": opt.fBusinessTagOptionID
                                    });
                                }
                            })
                            util.mnSelect($customerTypeEl, 'syncModel', options);
                            //                        util.mnEvent($customerTypeEl, 'change', self.selectChgFun);

                        }
                    });
                    util.mnEvent($('.customer-status-select', tplEl), 'change', function (val, text) {

                        util.confirm('是否确定要将当前客户的【' + '客户状态' + '】修改为【' + text + '】?', ' ', function () {
                            util.api({
                                "url": '/FCustomer/ModifyCustomerState',
                                "type": 'post',
                                "dataType": 'json',
                                "data": {
                                    customerID: queryParams.id,
                                    tagOptionID: val
                                },
                                "success": function (data) {
                                    if (data.success) {
                                        util.remind(2, "修改成功");
                                        self.refresh();
                                    } else {
                                        $('.customer-status-select', $el).find('.mn-select-title').text(remainingDaysDesc);
                                    }
                                    /*   var tags = self.options.customerData.value.fCustomer.fBusinessTagRelations;
                                     //                                        var statusTag = _.find(tags, function(tag){
                                     //                                            return tag.fBusinessTagID == customerStatusTagID;
                                     //                                        });
                                     _.each(tags, function (tag) {
                                     if (tag.fBusinessTagID == customerStatusTagID) {
                                     tag.fBusinessTagOptionID = val;
                                     tag.fBusinessTagOptionName = text;
                                     }
                                     });*/

                                }
                            }, {
                                "submitSelector": ''
                            });
                        }, {
                            "onCancel": function () {
                                $('.customer-status-select', $el).find('.mn-select-title').text(remainingDaysDesc)
                            }
                        });
                    });
                    var topMenuTabEl = $('.tab-menu', this.$el);
                    //Tab
                    this.tab = new Tab({
                        "element": topMenuTabEl,//容器
                        "container": this.$el,//大父级容器
                        "items": [
                            {value: "tab-time-line", text: "时间线"},
                            {value: "tab-base-info", text: "基本信息" },
                            {value: "tab-contacts", text: "联系人"},
                            {value: "tab-opp", text: "机会"},
                            {value: "tab-contract", text: "合同"},
                            {value: "tab-product", text: "产品"},
                            {value: "tab-files", text: "附件"}
                        ]
                    });
                    this.tab.on('change', function (beforeTab, nowTab) {
                        switch (nowTab) {
                            case 'tab-product':
                                self.detaillistProduct.refresh();
                                break;
                            case 'tab-opp':
                                self.detaillistOpp.refresh();
                                break;
                            case 'tab-contract':
                                self.detaillistContracts.refresh();
                                break;
                            case 'tab-contacts':
                                self.detaillistContacts.refresh();
                                break;
                        }

                    });
                    var crmAttachmentListSimpleWarp = $('.tab-files-box', this.$el);
                    var productID = queryParams.id;
                    this.attachmentList = new AttachmentList({
                        "element": crmAttachmentListSimpleWarp,
                        "condition": {
                            "fbrType": 1,//  1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                            "dataID": productID // 产品ID
                        }
                    });
                    this.attachmentList.on('uploaded', function () {
                        that.timeline.attachment.reload();
                    });


                },
                selectChgFun: function (val, text) {
                    var self = this;
                    util.confirm('是否确定要将当前客户的【' + '客户状态' + '】修改为【' + text + '】?', ' ', function () {
                        util.api({
                            "url": '/FCustomer/ModifyCustomerState',
                            "type": 'post',
                            "dataType": 'json',
                            "data": {
                                customerID: queryParams.id,
                                tagOptionID: val
                            },
                            "success": function (data) {
                                /*   var tags = self.options.customerData.value.fCustomer.fBusinessTagRelations;
                                 //                                        var statusTag = _.find(tags, function(tag){
                                 //                                            return tag.fBusinessTagID == customerStatusTagID;
                                 //                                        });
                                 _.each(tags, function (tag) {
                                 if (tag.fBusinessTagID == customerStatusTagID) {
                                 tag.fBusinessTagOptionID = val;
                                 tag.fBusinessTagOptionName = text;
                                 }
                                 });*/
                                util.remind(2, "修改成功");

                            }
                        }, {
                            "submitSelector": ''
                        });
                    });
                },
                _setPageInfo: function () {
                    var $el = this.$el;
                    var c = this.options.customerData.value.FCustomer;
                    $('.crm-detail-tab', $el).children('h1').text(c.name);
                    $('.customer-detail-resp', $el).text(c.owner.name);
                    var followBtn = $('.customer-to-follow-btn', $el);
                    if (c.isFollowed) {
                        followBtn.addClass('following').text('已关注');
                    } else {
                        followBtn.addClass('no-follow').text('关注');
                    }
                },
                loadCustomerData: function () {
                    var self = this;
                    util.api({
                        //                    "url": '/FCustomer/GetCustomerByID',//应该是调错接口了应该是Detail
                        "url": '/FCustomer/GetFCustomerDetailByID',
                        "type": 'get',
                        "dataType": 'json',
                        "data": {
                            customerID: queryParams.id,
                            attachNum: 6
                        },
                        "success": function (data) {
                            if (data.success) {
                                self.options.customerData = data;
                                self.setComponent();
                                self.timeline = new CustomerTimeline({
                                    warpEl: $detailBd,
                                    customerData: self.options.customerData,
                                    detail: self,
                                    selectColleagueS: self.selectColleague
                                });
                                self.timeline.v = self;
                                self.baseinfo = new CustomerBaseinfo({
                                    warpEl: $baseinfoBd,
                                    customerData: self.options.customerData,
                                    detail: self
                                });
                                self.baseinfo.v = self;


                                self.editDialog = new CustomerDialog({
                                    warpEl: '',
                                    customerID: self.options.customerData.value.FCustomer.customerID
                                });
                                self.editDialog.v = self;
                                self.editDialog.on('success', function () {
                                    self.refresh();
                                });
                                self.addContractDialog = new ContractDialog({
                                    customerID: self.options.customerData.value.FCustomer.customerID,
                                    customerName: self.options.customerData.value.FCustomer.name
                                });
                                self.addContractDialog.on('success', function () {
                                    self.detaillistContracts.refresh();
                                    self.timeline.refresh();
                                });
                                self.modifyContractDialog = new ContractDialog();
                                self.modifyContractDialog.on('success', function () {
                                    self.detaillistContracts.refresh();
                                });

                                self.addOppDialog = new OpportunityDialog({
                                    customerID: self.options.customerData.value.FCustomer.customerID,
                                    customerName: self.options.customerData.value.FCustomer.name
                                });
                                self.addOppDialog.on('success', function () {
                                    self.detaillistOpp.refresh();
                                    self.timeline.refresh();
                                });
                                self.addContactDialog = new ContactDialog({
                                    customerID: self.options.customerData.value.FCustomer.customerID,
                                    customerName: self.options.customerData.value.FCustomer.name
                                });
                                self.editContactDialog = new ContactDialog();
                                self.editContactDialog.on('updateSuccess', function () {
                                    self.detaillistContacts.refresh();
                                    self.timeline.refresh();
                                });
                                self.addContactDialog.on('success', function () {
                                    self.detaillistContacts.refresh();
                                    self.timeline.refresh();
                                });
                                self.addProductDialog = new ProductInOppEditDialog();
                                self.addProductDialog.on('success', function () {
                                    self.timeline.refresh();
                                    self.detaillistProduct.refresh();
                                });
                                self.modifyOppDialog = new OpportunityDialog();
                                self.modifyOppDialog.on('success', function () {
                                    self.detaillistOpp.refresh();
                                });
                                self.contactsDialog = new ContactsDialog({
                                    "title": "给客户选择联系人",
                                    "defaultCondition": {
                                        "employeeID": util.getCrmData().currentEmp.employeeID
                                    }
                                });
                                self.contactsDialog.on("selected", function (val) {
                                    var parameter = {
                                        customerID: queryParams.id
                                    };
                                    var contactIDs = [];
                                    _.each(val, function (item) {
                                        contactIDs.push(item.contactID);
                                    });
                                    parameter.contactIDs = contactIDs;
                                    util.api({
                                        'url': '/Contact/BatchCombineContactAndFCustomer',
                                        'type': 'post',
                                        "dataType": 'json',
                                        'data': parameter,
                                        'success': function (responseData) {
                                            if (!responseData.success) {
                                                return;
                                            }
                                            self.detaillistContacts.refresh();
                                            self.timeline.refresh();
                                        }
                                    });
                                });
                                self._detaillistContacts(); //客户中的联系人列表
                                self.operation = new Operation({
                                    "element": $(".table-operation-btn", self.$el.find('.tab-contacts-box')),
                                    "isFollow": data.value.FCustomer.ownerID != util.getCrmData().currentEmp.employeeID
                                })

                                self.operation.on("new", function () {
                                    self.addContactDialog.show({
                                        customerID: queryParams.id,
                                        //                                    customerName: self.options.customerData.value.FCustomer.customerName
                                        customerName: self.options.customerData.value.FCustomer.name || self.options.customerData.value.FCustomer.customerName
                                    });

                                });
                                self.operation.on("select", function () {
                                    self.contactsDialog.show();
                                });
                                self._setPageInfo();

                            } else {
                                util.alert(data.message, function () {
                                    self._pageBack();//不成功就返回到列表
                                });

                            }

                        }
                    }, {
                        "errorAlertModel": "1" //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
                    });
                },
                refresh: function () {
                    var self = this;
                    util.api({
                        "url": '/FCustomer/GetFCustomerDetailByID',
                        "type": 'get',
                        "dataType": 'json',
                        "data": {
                            customerID: queryParams.id,
                            attachNum: 6
                        },
                        "success": function (data) {
                            if (data.success) {
                                self.options.customerData = data;

                                /*  var customerStatusOptID = data.value.FCustomer.fBusinessTagRelations[0] && data.value.FCustomer.fBusinessTagRelations[0].fBusinessTagOptionID;
                                 if (customerStatusOptID) {
                                 util.mnOffEvent($customerTypeEl, 'change');
                                 util.mnSetter($customerTypeEl, customerStatusOptID);

                                 }*/

                                self.timeline ? self.timeline.refresh() : self.timeline = new CustomerTimeline({
                                    warpEl: $detailBd,
                                    customerData: self.options.customerData,
                                    detail: self
                                });
                                self.baseinfo ? self.baseinfo.refresh() : self.baseinfo = new CustomerBaseinfo({
                                    warpEl: $baseinfoBd,
                                    customerData: self.options.customerData,
                                    detail: self
                                });
                                self._setPageInfo();
                            //重置下拉框
                            var options = [];
                            var c = self.options.customerData.value.FCustomer;
                            _.map(FS.getAppStore('contactData').fBusinessTags, function (tag, index) {
                                if (tag.systemTagCode == 101) {
                                    customerStatusTagID = tag.fBusinessTagID;
                                    _.map(tag.options, function (opt, index) {
                                        if (opt.fBusinessTagOptionID == (c.fBusinessTagRelations[0] && c.fBusinessTagRelations[0].fBusinessTagOptionID)) {
                                            options.push({
                                                "text": opt.name,
                                                "value": opt.fBusinessTagOptionID,
                                                "selected": true
                                            });
                                        } else {
                                            options.push({
                                                "text": opt.name,
                                                "value": opt.fBusinessTagOptionID
                                            });
                                        }
                                    })
                                    util.mnSelect($customerTypeEl, 'syncModel', options);
                                    //                        util.mnEvent($customerTypeEl, 'change', self.selectChgFun);
                                }
                            });
                            } else {
                                util.alert(data.message, function () {
                                    self._pageBack();//不成功就返回到列表
                                });
                            }

                        }
                    }, {
                        "submitSelector": ''
                    });
                },
                refreshRespName: function (obj) {
                    $('.customer-detail-resp', this.element).text(obj.name);
                    var lastOwnerId = this.options.customerData.value.FCustomer.ownerID;
                    this.timeline.followUpBox.replace(lastOwnerId, obj);//刷新联合跟进人
                    this.options.customerData.value.FCustomer.ownerID = obj.employeeID;
                },
                _getCustomerTagsDatas: function () {
                    var crmData = util.getCrmData();//获取CRM缓存数据
                    var fBusinessTags = crmData.fBusinessTags;//标签数据
                    var functionPermissions = crmData.functionPermissions;//权限数据
                    var currentEmpID = crmData.currentEmp.employeeID;//登录人ID
                    var tags = [];
                    var contactTags = [];
                    var productLineTagsForList = [ //产品线数据
                        {
                            "text": '不限',
                            "value": 0
                        }
                    ];
                    _.each(fBusinessTags, function (fBusinessTag, index) {
                        if (fBusinessTag.type === util.CONSTANT.TAG_TYPE.CUSTOMER) {
                            tags.push(fBusinessTag);
                            //                    if (fBusinessTag.systemTagCode === 110) {
                            _.each(fBusinessTag.options, function (option, index) {
                                productLineTagsForList.push({
                                    "text": option.name,
                                    "value": option.fBusinessTagOptionID
                                })
                            });
                            //                    }
                        } else if (fBusinessTag.type === util.CONSTANT.TAG_TYPE.CONTACTS) {
                            contactTags.push(fBusinessTag);
                        }
                    });
                    this.tags = tags;
                    this.currentEmpID = currentEmpID;
                    this.productLineTagsForList = productLineTagsForList;//产品线下拉列表需要数据保存起来
                    this.functionPermissions = functionPermissions;//权限数据
                },
                _switchFollow: function (e) {
                    var $el = $(e.target);
                    var customerID = this.options.customerData.value.FCustomer.customerID;

                    if ($el.hasClass('following')) {
                        //取消关注
                        util.api({
                            "url": '/FCustomer/CancelFCustomerFollow',
                            "type": 'post',
                            "dataType": 'json',
                            "data": { customerID: customerID },
                            "success": function (responseData) {
                                if (responseData.success) {
                                    $el.removeClass('following').addClass('no-follow').text('关注')
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
                                    $el.removeClass('no-follow').addClass('following').text('已关注')
                                }
                            }
                        });
                    }

                },
                _pageBack: function () {
                    if (queryParams.returnUrl) {
                        tpl.navRouter.navigate(queryParams.returnUrl, {trigger: true});//手动跳转页面
                        tpl.event.trigger('dataUpdate');
                    } else {
                        tpl.navRouter.navigate('#customers/home', {trigger: true});//手动跳转页面
                    }
                },
                _editCustomer: function () {
                    var self = this;
                    this.editDialog.show({
                        dialogType: 3,
                        flag: 'edit'
                    });
                },
                _chgResp: function () {
                    this.selectColleague.show();
                }
            });

            this.customerDetail = new CustomerDetail();
            //        var queryParams = util.getTplQueryParams();
            //        var productList = new CustomerList({
            //            warpEl: customerListWrapperEl,
            //            url: "/FCustomer/GetFCustomers",
            //            nav: queryParams && queryParams.nav || ''
            //        });
            //        productList.load();
            var that = this;
            tpl.event.one('beforeremove',function(tplName2){
                if(tplName2==tplName){
                    that.destroy();
                }
            });
        },
        destroy: function(){
        	this.customerDetail.destroy();
        },
    });

});
