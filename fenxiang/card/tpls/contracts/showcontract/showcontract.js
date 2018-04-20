/**
 * CRM - 合同详情 - tpl
 *
 * @author liuxiaofan
 * 2014-05-20
 */
define(function (require, exports, module) {

    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var FeedList = require('modules/feed-list/feed-list');
    var Dialog = require('dialog');
    var moment = require('moment');
    var DataTables = require('datatable');
    var ConfirmBox = require('confirmbox');
    var Tab = require('uilibs/tabs2');
    var publishHelper = require('modules/publish/publish-helper');
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var AttachmentList = require('modules/crm-attachment/crm-attachment');//附件列表组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var SalesclueDialog = require('modules/crm-salesclue-edit/crm-salesclue-edit');
    var ContractDialog = require('modules/crm-contract-edit/crm-contract-edit');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    var PaymentPlanDialog = require('modules/crm-paymentplan-edit/crm-paymentplan-edit');//回款计划
    var PaymentRecordDialog = require('modules/crm-paymentrecord-edit/crm-paymentrecord-edit');//回款记录
    var FollowUp = require('modules/crm-follow-up/crm-follow-up');


    /**
     * 合同详情页
     */
    var ShowContract = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.myID = this.options.queryParams.id;
        this.init(); //初始化
    };
    $.extend(ShowContract.prototype, {
        init: function () {
            var elEl = this.$el;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.bindEvents(); //事件绑定
            this._getContractPaymentsByContractID()//回款计划及记录
            var that = this;
            var tplName = exports.tplName;
            tpl.event.one('beforeremove',function(tplName2){
                if(tplName2==tplName){
                    that.destroy();
                }
            });
        },
        //回款计划及记录详情
        _getContractPaymentsByContractID: function () {
            var that = this;
            var warpEl = $('.returned-money-warp', this.$el);
            var planWarpEl = $('.plan-warp', warpEl);
            var recordWarpEl = $('.record-warp', warpEl);
            var recordAData = [];
            var planAData = [];
            var _runderPlans = function (data) {
                var trStr = '';
                planAData = [];//先清空，不然刷新后数据会累积
                _.each(data, function (option) {
                    var contractPaymentPlanID = option.contractPaymentPlanID;
                    var ownerID = option.ownerID;
                    var ownerName = option.owner.name;
                    var amount = _.str.numberFormat(parseFloat(option.amount), 2);//应收
                    var paidAmount = _.str.numberFormat(parseFloat(option.paidAmount), 2);//实收
                    var unPaidAmount = _.str.numberFormat(parseFloat(option.unPaidAmount), 2);//应收余额
                    var paymentTimes = option.paymentTimes;//期
                    var expectedTime = option.expectedTime;//计划时间
                    var isPaied = option.isPaied;//状态（已付清，未付清）
                    isPaied ? isPaied = '已付清' : isPaied = '未付清';
                    expectedTime = moment.unix(expectedTime).format('YYYY年MM月DD日');
                    planAData.push({
                        contractPaymentPlanID: contractPaymentPlanID,
                        contractID: that.myID,
                        contractTitle: $('.crm-detail-tab').find('.hd-titname').text(),
                        ownerID: ownerID,
                        ownerName: ownerName,
                        paymentTimes: paymentTimes,
                        paymentTime: option.expectedTime,
                        amount: option.amount
                    });

                    trStr += '<tr><td class="text-black">' + amount + '</td> <td class="text-black">' + paidAmount + '</td><td class="text-black">' + unPaidAmount + '</td> <td>' + paymentTimes + '期</td> <td>' + expectedTime + '</td> <td>' + isPaied + '</td> <td> <a class="plan-modify-btn" href="javascript:;" data-id="' + contractPaymentPlanID + '">编辑</a> <a class="plan-del-btn" href="javascript:;" data-id="' + contractPaymentPlanID + '">删除</a> <a class="record-add-btn-b" href="javascript:;" data-id="' + contractPaymentPlanID + '">添加回款记录</a> </td> <td></td> </tr>';
                });
                $('.crm-com-table tbody', planWarpEl).html(trStr);
            };
            var _runderRecords = function (data) {
                var trStr = '';
                _.each(data, function (option) {
                    var contractPaymentRecordID = option.contractPaymentRecordID;
                    var amount = _.str.numberFormat(parseFloat(option.amount), 2);//金额
                    var paymentType = option.paymentType;//付款方式
                    var paymentTimes = option.paymentTimes;//期
                    var paymentTime = option.paymentTime;//实际时间
                    var isBilling = option.isBilling;//状态（已开票，未开票）
                    var isBillingStr = '';
                    var isBillingBtnStr = '';

                    recordAData.push({
                        contractPaymentRecordID: contractPaymentRecordID,
                        amount: amount,
                        paymentType: paymentType,
                        paymentTimes: paymentTimes,
                        paymentTime: paymentTime,
                        isBilling: isBilling
                    });

                    if (isBilling) {
                        isBillingStr = '已开票';
                        isBillingBtnStr = '设置为未开票';
                    } else {
                        isBillingStr = '未开票';
                        isBillingBtnStr = '设置为已开票';
                    }
                    paymentTime = moment.unix(paymentTime).format('YYYY年MM月DD日');
                    switch (paymentType) {
                        case 1:
                            paymentType = '支票';
                            break;
                        case 2:
                            paymentType = '现金';
                            break;
                        case 3:
                            paymentType = '邮政汇款';
                            break;
                        case 4:
                            paymentType = '电汇';
                            break;
                        case 5:
                            paymentType = '网上转账';
                            break;
                        case 6:
                            paymentType = '其他';
                            break;
                    }

                    trStr += ' <tr> <td class="text-black">' + amount + '</td> <td>' + paymentType + '</td> <td>' + paymentTimes + '期</td> <td>' + paymentTime + '</td> <td>' + isBillingStr + '</td> <td> <a class="record-modify-btn" href="javascript:;" data-id="' + contractPaymentRecordID + '">编辑</a> <a class="record-del-btn" href="javascript:;" data-id="' + contractPaymentRecordID + '">删除</a> <a class="record-setticket-btn" href="javascript:;" data-id="' + contractPaymentRecordID + '" >' + isBillingBtnStr + '</a> </td> <td></td> </tr>';

                });
                $('.crm-com-table tbody', recordWarpEl).html(trStr);
            };
            var _load = function () {
                util.api({
                    "url": '/Contract/GetContractPaymentsByContractID', //谁的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "contractID": that.myID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            var contractPaymentPlans = responseData.value.contractPaymentPlans;//计划
                            var contractPaymentRecords = responseData.value.contractPaymentRecords;//记录
                            if (contractPaymentPlans.length > 0) {
                                _runderPlans(contractPaymentPlans);
                                $('.crm-com-table', planWarpEl).show();
                                $('.plan-add-btn', planWarpEl).show();
                                $('.isnodatatip', planWarpEl).hide();
                            } else {
                                $('.crm-com-table', planWarpEl).hide();
                                $('.plan-add-btn', planWarpEl).hide();
                                $('.isnodatatip', planWarpEl).show();
                            }
                            if (contractPaymentRecords.length > 0) {
                                _runderRecords(contractPaymentRecords);
                                $('.crm-com-table', recordWarpEl).show();
                                $('.record-add-btn', recordWarpEl).show();
                                $('.isnodatatip', recordWarpEl).hide();
                            } else {
                                $('.crm-com-table', recordWarpEl).hide();
                                $('.record-add-btn', recordWarpEl).hide();
                                $('.isnodatatip', recordWarpEl).show();
                            }


                        }
                    }
                });
            };
            planWarpEl.on('click', '.plan-add-btn', function () {
                that.addPaymentPlanDialog.show();
            });
            planWarpEl.on('click', '.plan-add-btn-b', function () {
                that.addPaymentPlanDialog.show();
            });
            //列表中添加回款记录
            planWarpEl.on('click', '.record-add-btn-b', function (rowData) {
                var meEl = $(this);
                var contractPaymentPlanID = meEl.data('id');

                var oData = _.filter(planAData, function (option) {
                    if (option.contractPaymentPlanID == contractPaymentPlanID) {
                        return option;
                    }
                });
                that.addPaymentRecordDialog.show(oData[0]);
            });
            planWarpEl.on('click', '.plan-modify-btn', function () {
                var meEl = $(this);
                var contractPaymentPlanID = meEl.data('id');
                var oData = _.filter(planAData, function (option) {
                    if (option.contractPaymentPlanID == contractPaymentPlanID) {
                        return option;
                    }
                });
                that.editPaymentPlanDialog.show(oData[0]);
            });
            planWarpEl.on('click', '.plan-del-btn', function () {
                var meEl = $(this);
                var contractPaymentPlanID = meEl.data('id');
                util.confirm('你确定要删除该回款计划吗？', '', function () {
                    util.api({
                        "url": '/Contract/DeleteContractPaymentPlans',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "contractPaymentPlanIDs": contractPaymentPlanID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                util.remind(2, "删除成功");
                                that.refreshPayment();
                            }
                        }
                    });
                });
            });
            recordWarpEl.on('click', '.record-add-btn', function () {
                that.addPaymentRecordDialog.show();
            });
            recordWarpEl.on('click', '.record-add-btn-b', function () {
                that.addPaymentRecordDialog.show();
            });
            recordWarpEl.on('click', '.record-modify-btn', function () {
                var meEl = $(this);
                var contractPaymentRecordID = meEl.data('id');
                var oData = _.filter(recordAData, function (option) {
                    if (option.contractPaymentRecordID == contractPaymentRecordID) {
                        return option;
                    }
                });
                that.editPaymentRecordDialog.show(oData[0]);

            });
            recordWarpEl.on('click', '.record-del-btn', function () {
                var meEl = $(this);
                var contractPaymentRecordID = meEl.data('id');
                util.confirm('你确定要删除该回款记录吗？', '', function () {
                    util.api({
                        "url": '/Contract/DeleteContractPaymentRecords',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "contractPaymentRecordIDs": contractPaymentRecordID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                util.remind(2, "删除成功");
                                that.refreshPayment();
                            }
                        }
                    });
                });
            });
            recordWarpEl.on('click', '.record-setticket-btn', function () {
                var meEl = $(this);
                var contractPaymentRecordID = meEl.data('id');
                var isBilling = true;
                var isBillingStr = '已开票';
                if (meEl.text() == '设置为已开票') {
                    meEl.text('设置为未开票');
                    isBilling = true;
                    isBillingStr = '已开票';
                } else {
                    meEl.text('设置为已开票')
                    isBilling = false;

                    isBillingStr = '未开票';
                }
                util.api({
                    "url": '/Contract/UpdateContractPaymentRecordsIsBilling',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "contractPaymentRecordIDs": contractPaymentRecordID,
                        isBilling: isBilling
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            util.remind(2, "设置成功，状态：" + isBillingStr);
                            _load();
                        }
                    }
                });
            });

            _load();
            this.refreshPayment = function(){
            	_load();
            	this.refresh();
            }

        },
        //事件绑定
        bindEvents: function () {
            var elEl = this.$el;
            var that = this;

            // 更新状态下拉框
            util.mnEvent($('.updatestates-select-list', elEl), 'change', function (val, text) {
                var remainingDaysDesc = that.responseData.value.remainingDaysDesc;//接口里面给出的当前的状态
                util.confirm('是否确定要将当前合同的【状态】变更为【' + text + '】？',' ', function () {
                    util.api({
                        "url": '/Contract/UpdateContractsStates', //谁的接口地址
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contractIDs: that.myID,
                            states: val
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var result = responseData.value.result;
                                var itemResultStr = '';
                                _.each(result, function (item, index) {
                                    var isSuccess = item.value1;
                                    var describe = item.value2;

                                    if (!isSuccess) {
                                        itemResultStr = '变更合同状态失败,原因没有权限：' + describe;
                                        util.alert(itemResultStr, function () {
                                        });
                                    } else {
                                        util.remind(1, "变更成功");
                                        that.load();
                                    }
                                });


                            }
                        }
                    });
                }, {
                    "onCancel": function () {
                        $('.updatestates-select-list',elEl).find('.mn-select-title').text(remainingDaysDesc)
                    }
                });
            });
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
            });
            //查看更多回款明细
            elEl.on('click', '.returned-seemore-btn', function () {
                that.tab.select("tab-returned-money");
            });
            //删除
            elEl.on('click', '.delete-btn', function () {
                that._delete();
            });
            //修改
            elEl.on('click', '.modify-btn', function () {
                that.modifyCompetitorDialog.show();
            });
            //变更负责人
            elEl.on('click', '.canchangeowner-btn', function () {
                //                var ownerName=that.responseData.vale.contract.owner.name||'';

                that.selectColleagueS.show();
            });

            //关注按钮
            elEl.on('click', '.follow-switch-btn', function (e) {
                that._switchFollow(e);
            });
            //变更负责人
            this.selectColleagueS.on("selected", function (val) {
            	var lastOwnerId = that.responseData.value.contract.owner.employeeID;
                util.confirm('你确定要将合同的负责人变更为' + val.name + '吗？', ' ', function () {
                    util.api({
                        "url": '/Contract/UpdateContractsOwnerID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contractIDs: that.myID, //
                            ownerID: val.employeeID //int，负责人ID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var result = responseData.value.result;
                                var itemResultStr = '';
                                _.each(result, function (item) {
                                    var isSuccess = item.value1;
                                    var describe = item.value2;
                                    if (!isSuccess) {
                                        itemResultStr = '变更合同的负责人失败，原因：' + describe + '</br>';
                                        util.alert(itemResultStr);
                                    } else {
                                        util.remind(1, "变更成功");
                                        //                                        that.refresh(); //刷新  不能刷新页面因为负责人变了就没有权限看此页面
                                        $(".owner-name", elEl).text(val.name);//单独刷新负责人名称
                                        that.followUp.replace(lastOwnerId, val);//刷新联合跟进人
                                    }
                                });
                            }
                        }
                    });

                });

            });
        },
        //关注开关
        _switchFollow: function (e) {
            var $el = $(e.target);
            var that = this;
            if ($el.hasClass('following')) {
                //取消关注
                util.api({
                    "url": '/Contract/ContractCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('following').addClass('no-follow').text('关注')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/Contract/ContractFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('no-follow').addClass('following').text('已关注');
                        }
                    }
                });
            }

        },
        //获取线索标签的相关数据
        _getTagsDatas: function () {
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
                allTags: allTags, //标签数据，新建标签的窗口需要用到
                competitorscale: competitorscale, //规模标签数据
                competitiveness: competitiveness, //竞争力标签数据
                functionPermissions: functionPermissions //权限数据
            });

        },

        //实例化左栏附件
        setCrmAttachment: function () {
            var that = this;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "dataID": that.myID,
                    "fbrType": 6
                }
            });
            this.attachment.render();
            this.attachment.on('toAll', function () {
                //切换到附件信息
                that.tab.select("tab-files");
            });
            this.attachment.on('uploaded', function () {
                that.attachmentList.reload();
            });
        },
        //实例化附件列表
        setAttachmentList: function () {
            var that = this;
            var crmAttachmentListSimpleWarp = $('.crm-attachmentlist-simple-warp', this.$el);
            this.attachmentList = new AttachmentList({
                "element": crmAttachmentListSimpleWarp,
                "condition": {
                    "fbrType": 6,// 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": that.myID // 对手ID
                }
            });
            this.attachmentList.on('uploaded', function () {
                that.attachment.reload();
            });
        },
        //实例化feed列表
        setFeedList: function () {
            var that = this;
            var feedListEl = $('.crm-feed-list-warp', this.$el);
            var pagEl = $('.feed-list-pagination', this.$el);
            var searchEl = $('', this.$el);
            this.feedList = new FeedList({
                "element": feedListEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": {//分页配置项
                    "pageSize": 15,
                    "visiblePageNums": 3
                },
                GetBatchFilesSource:1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                	type: 'contract',
                	id: that.myID
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 6, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                        "dataID": that.myID, //
                        "type": 1, //1是分享类型
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
                "listEmptyText": "暂无记录"
                /*"searchOpts": {
                 "inputSelector": searchEl,
                 "btnSelector": searchBtnEl
                 } //默认请求数据*/
            });
            this.feedList.load();

        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var elEl = this.$el;
            var value = this.responseData.value;
            var canModify = value.canModify;
            var canDelete = value.canDelete;
            var canChangeOwner = value.canChangeOwner;
            if (canModify) {
                $('.modify-btn', elEl).show();
            } else {
                $('.modify-btn', elEl).hide();
            }
            if (canDelete) {
                $('.delete-btn', elEl).show();
            } else {
                $('.delete-btn', elEl).hide();
            }
            if (canChangeOwner) {
                $('.canchangeowner-btn-r', elEl).show();
            } else {
                $('.canchangeowner-btn-r', elEl).hide();
            }
        },
        render: function () {
            var elEl = this.$el;
            var that = this;
            var contract = this.responseData.value.contract || null;
            var customer = this.responseData.value.customer || 0;
            var fBusinessTagRelations, fBusinessTagRelationsStr = '';
            var followBtn = $('.follow-switch-btn', elEl);
            var param;
            var currentParam = util.getTplQueryParams2();
            if (customer) {
                param = {
                    id: customer.customerID,
                    returnUrl: 'contracts/showcontract/=/param-' + encodeURIComponent(JSON.stringify(currentParam))
                }
                $('.jdata-customername', elEl).html('<a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + customer.name + '</a>');

            } else {
                $('.jdata-customername', elEl).html('<a href="javascript:;"></a>');
            }
            if (contract) {
                fBusinessTagRelations = contract.fBusinessTagRelations;
                fBusinessTagRelationsStr = '';
                _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                    var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                    var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                    fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
                });
                $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
                if (contract.isFollow) {
                    followBtn.addClass('following').text('已关注');
                } else {
                    followBtn.addClass('no-follow').text('关注');
                }
                $('.hd-titname', elEl).text(contract.title);//标题
                $('.jdata-ownername', elEl).text(contract.owner.name);//负责人
                $('.jdata-creatorname', elEl).text(contract.creator.name);
                $('.jdata-createtime', elEl).text(moment.unix(contract.createTime).format('YYYY年MMMDD日 HH:mm'));//创建时间
                $('.jdata-lasteditemployeename', elEl).text(contract.lastEditEmployee.name);//最后修改人
                $('.jdata-lastedittime', elEl).text(moment.unix(contract.lastEditTime).format('YYYY年MMMDD日 HH:mm'));//最后修改时间
                $('.jdata-name', elEl).text(contract.name);//string，姓名(必填，长度100)
                $('.jdata-company', elEl).text(contract.company);//string，公司名称(非必填，长度200)

                //                util.mnSetter($('.updatestates-select-list', elEl), contract.states);//设置下拉框状态
                contract.oristates = contract.states;
                switch (contract.states) {
                    case 1:
                        contract.states = '执行前';
                        break;
                    case 2:
                        contract.states = '执行中';
                        break;
                    case 3:
                        contract.states = '结束';
                        break;
                    case 4:
                        contract.states = '意外终止';
                        break;
                }
                $('.updatestates-select-list', elEl).find('.mn-select-title').text(contract.states);
                if (contract.discount >= 10) {
                    contract.discount = '无折扣';
                } else {
                	contract.discount+='折';
                }
                $('.jdata-discount', elEl).text(contract.discount);
                $('.jdata-remainingdaysdesc', elEl).text(this.responseData.value.remainingDaysDesc + ((contract.oristates == 1 || contract.oristates == 2) ? '天' : ''));
                $('.jdata-contractperiod', elEl).text(this.responseData.value.contractPeriod + '天');
                $('.jdata-contractno', elEl).text(contract.contractNO);
                $('.jdata-content', elEl).text(contract.content);
                $('.jdata-productdescription', elEl).text(contract.productDescription);
                $('.jdata-paymenttypedesc', elEl).text(contract.paymentTypeDesc);
                $('.jdata-customersigner', elEl).text(contract.customerSigner);
                $('.jdata-signername', elEl).text(contract.signer.name);
                $('.jdata-states', elEl).text(contract.states);//状态
                $('.jdata-customerstatetagoptionname', elEl).text(contract.customerStateTagOptionName);

                $('.jdata-plannum', elEl).text(this.responseData.value.planNum + '期');
                $('.jdata-recordnum', elEl).text(this.responseData.value.recordNum + '笔');

                $('.jdata-plantotalamount', elEl).text(_.str.numberFormat(parseFloat(this.responseData.value.planTotalAmount), 2));
                $('.jdata-recordtotalamount', elEl).text(_.str.numberFormat(parseFloat(this.responseData.value.recordTotalAmount), 2));
                if (this.responseData.value.recordTotalAmount > 0) {
                	if(contract.totalAmount) {
                		$('.jadta-recordstates', elEl).text('已回款' + parseFloat((this.responseData.value.recordTotalAmount / contract.totalAmount) * 100).toFixed(4) + '%');
                	} else {
                		$('.jadta-recordstates', elEl).text('');
                	}
                } else {
                    $('.jadta-recordstates', elEl).text('未回款');
                }


                $('.jdata-totalamount', elEl).text(_.str.numberFormat(parseFloat(contract.totalAmount), 2) + '元');
                $('.jdata-actualincome', elEl).text('￥' + _.str.numberFormat(parseFloat(contract.actualIncome), 2));
                $('.jdata-begindate', elEl).text(moment.unix(contract.beginDate).format('YYYY年MM月DD日'));
                $('.jdata-enddate', elEl).text(moment.unix(contract.endDate).format('YYYY年MM月DD日'));
                $('.jdata-signdate', elEl).text(moment.unix(contract.signDate).format('YYYY年MM月DD日'));
                $('.jdata-location', elEl).text(contract.location);
                $('.jdata-expectedcost', elEl).text(_.str.numberFormat(parseFloat(contract.expectedCost), 2));
                $('.jdata-actualcost', elEl).text(_.str.numberFormat(parseFloat(contract.actualCost), 2));
                $('.jdata-expectedincome', elEl).text(_.str.numberFormat(parseFloat(contract.expectedIncome), 2));
                $('.jdata-actualincome', elEl).text(_.str.numberFormat(parseFloat(contract.actualIncome), 2));

                $('.jdata-l', elEl).text(contract.L);
                $('.jdata-executiondescription', elEl).text(contract.executionDescription);
                $('.jdata-summary', elEl).text(contract.summary);
                $('.jdata-effect', elEl).text(contract.effect);
                $('.jdata-description', elEl).text(contract.description);

            }
            this.showFnBtn();


            this.addPaymentPlanDialog = new PaymentPlanDialog({
                contractID: contract.contractID,
                contractTitle: contract.title,
                ownerID: Number(contract.owner.employeeID),
                ownerName: contract.owner.name
            });
            this.addPaymentPlanDialog.v = this;
            this.editPaymentPlanDialog = new PaymentPlanDialog({
                contractID: contract.contractID,
                contractTitle: contract.title,
                ownerID: Number(contract.owner.employeeID),
                ownerName: contract.owner.name
            });
            this.addPaymentRecordDialog = new PaymentRecordDialog({
                contractID: contract.contractID,
                ownerID: Number(contract.owner.employeeID),
                ownerName: contract.owner.name
            });
            this.editPaymentRecordDialog = new PaymentRecordDialog({
                contractID: contract.contractID,
                ownerID: Number(contract.owner.employeeID),
                ownerName: contract.owner.name
            });

            this.addPaymentPlanDialog.on('success', function () {
                that.refreshPayment();
            });
            this.editPaymentPlanDialog.on('success', function () {
                that.refreshPayment();
            });
            this.addPaymentRecordDialog.on('success', function () {
                that.refreshPayment();
            });
            this.editPaymentRecordDialog.on('success', function () {
                that.refreshPayment();
            });


        },
        load: function () {
            var elEl = this.$el;
            var that = this;
            util.api({
                "url": '/Contract/GetContractDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    contractID: that.myID, //int，ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                        var items = [];
                        var contractParticipants = responseData.value.contract.contractParticipants;
                        _.each(contractParticipants, function (item) {
                            var employee = item.employee;
                            items.push(employee)
                        });

                        that.followUp = new FollowUp({
                            "element": $(".contract-partin", elEl),
                            "addApi": "/Contract/AddContractParticipants",
                            "deleteApi": "/Contract/DeleteContractParticipants",
                            "parameter": {
                                contractID: that.myID, //int，ID
                                "employeeIDs": ""
                            },
                            "selectColleagueS": that.selectColleagueS,
                            "ownerID": responseData.value.contract.ownerID,
                            "items": items,
                            "title": "合同参与人",
                            "typeName": "合同",
                            "name": "参与人",
                            "btnAddTitle": "添加合同参与人",
                            "addWinTitle": "选择参与人"
                        });
                    } else {
                        util.alert(responseData.message, function () {
                            that._backToListPage();
                        },{  "zIndex": 3000});
                    }
                }
            }, {
                "errorAlertModel": "1"   //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
            });
        },
        refresh: function () {
            this.load();
        },
        //返回到上级页面
        _backToListPage: function () {
            var queryParams = util.getTplQueryParams2();
            tpl.navRouter.navigate(queryParams.returnUrl, {trigger: true});
            tpl.event.trigger('dataUpdate');
        },
        //删除
        _delete: function () {
            var that = this;
            util.confirm('你确定要删除该合同吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/Contract/DeleteContracts',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "contractIDs": that.myID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            var result = responseData.value.result;
                            var item = result[0];
                            var isSuccess = item.value1;
                            var describe = item.value2;
                            if (isSuccess) {//成功的就返回上级页面
                                that._backToListPage();//返回到上级页面
                            } else {
                                util.alert('删除失败，原因：' + describe);
                            }

                        }
                    }
                });
            });

        },
        //实例化输入框
        setPublish: function () {
            var that = this;
            var elEl = this.$el;
            var myId = this.options.queryParams.id;
            this.feedpublish = new Publish({
                "element": $('.feed-submit-box-warp', elEl),
                "title": "新建合同记录",
                "placeholder": "发布新合同记录",
                "type": "feed",
                "condition": {
                    "fileInfos": [],// List<ParamValue<int, string, int, string>>，附件
                    "feedContent": "",// string，Feed内容
                    "fbrType": 6,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                    //4，与产品关联，dataID：产品ID；
                    //5,与对手关联，dataID：对手ID；
                    //6，与合同关联，dataID：合同ID；
                    //7，与市场活动关联，dataID：市场活动ID；
                    //8，销售线索关联，dataID：线索ID
                    "dataID": myId// int，数据ID
                },
                "display": ["picture", "attach", "at", "topic"]
            });
            this.feedpublish.on('post', function (feedID) {
                //                that.feedList.unshiftFromFeedId(feedID);//请求一条数据
                that.feedList.load();
            });
        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            var topMenuTabEl = $('.tab-menu', this.$el);
            //修改合同
            this.modifyCompetitorDialog = new ContractDialog({
                contractID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyCompetitorDialog.on('success', function () {
                that.refresh();
            });
            this.modifyCompetitorDialog.v = this;
            this.tab = new Tab({
                "element": topMenuTabEl, //容器
                "container": this.$el, //大父级容器
                "items": [
                    {value: "tab-time-line", text: "时间线"},
                    {value: "tab-returned-money", text: "回款明细"},
                    {value: "tab-base-info", text: "基本信息"},
                    {value: "tab-files", text: "附件"}
                ]
            });
            //            util.autoAdjustPos($('.flaot-left-menu', this.$el));//浮动元素（滚动到元素位置贴到顶部固定）
            //实例化选人组件
            this.selectColleagueS = new SelectColleague({
                "isMultiSelect": false,
                "title": '请选择负责人'
            });
            this.setPublish();
            this.setFeedList();//实例化feed列表
            this.setCrmAttachment();//实例化左栏附件
            this.setAttachmentList();//实例化附件列表

        },

        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        }
    });


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showContract = new ShowContract({
            element: tplEl,
            queryParams: queryParams
        });
        showContract.load();
    };

});