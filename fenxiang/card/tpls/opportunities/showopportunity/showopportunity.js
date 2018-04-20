/**
 * CRM - 机会详情 - tpl
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
    var Tab = require('uilibs/tabs2');
    var publishHelper = require('modules/publish/publish-helper');
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var AttachmentList = require('modules/crm-attachment/crm-attachment');//附件列表组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var OpportunityDialog = require('modules/crm-opportunity-edit/crm-opportunity-edit');
    var Detaillist = require('modules/crm-detaillists/crm-detaillists');//明细页产品列表
    var CompetitorSelect = require('modules/crm-select-competitor/crm-select-competitor');
    var ProductSelect = require('modules/crm-select-product/crm-select-product');
    var ProductInOppEditDialog = require('modules/crm-productinopp-edit/crm-productinopp-edit');
    var ContactsDialog = require('modules/crm-select-contacts/crm-select-contacts');
    var CompetitorInOppEditDialog = require('modules/crm-competitorinopp-edit/crm-competitorinopp-edit');
    var ContractDialog = require('modules/crm-contract-edit/crm-contract-edit');
    var ContactView = require('modules/crm-contact-view/crm-contact-view');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    var FollowUp = require('modules/crm-follow-up/crm-follow-up');//联合跟进人
    var ContactBox = require('modules/crm-contact-box/crm-contact-box');//联系人
    var Mainchart = require('modules/crm-chart/mainchart');//左侧漏斗
    /**
     * 销售机会详情页
     */
    var Showopportunity = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.myID = this.options.queryParams.id;
        this.init(); //初始化
    };
    $.extend(Showopportunity.prototype, {
        init: function () {
            var elEl = this.$el;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.bindEvents(); //事件绑定
            var that = this;
            var tplName = exports.tplName;
            tpl.event.one('beforeremove',function(tplName2){
                if(tplName2==tplName){
                    that.destroy();
                }
            });
        },
        //事件绑定
        bindEvents: function () {
            var elEl = this.$el;
            var that = this;
            var nowVal = util.mnGetter($('.updatestates-select-list', elEl));
            // 更新状态下拉框
            util.mnEvent($('.updatestates-select-list', elEl), 'change', function (val, text) {
                if(val==that.salesStageNo){
                    return;
                }
                that.updateSalesOpportunitySalesStageNo.val = val;
                that.updateSalesOpportunitySalesStageNo.text = text;
                that.updateSalesOpportunitySalesStageNo.show();
                //                that.updateSalesOpportunitySalesStageNo.set('content','是否确定要将当前机会的【状态】变更为【' + text + '】？');
                return;
            });
            //修改预计成交金额预测状态
            util.mnEvent($('.isoutreport-btn', elEl), 'change', function (val, text) {
                if (val == 1) {
                    val = true;
                } else {
                    val = false;
                }
                util.api({
                    "url": '/SalesOpportunity/UpdateSalesOpportunityOutReportFlag',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        salesOpportunityID: that.myID,
                        isOutReport: val
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            util.remind(2, "修改成功");
                        }
                    }
                });

            });
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
            });
            //删除
            elEl.on('click', '.delete-btn', function () {
                that._delete();
            });
            //修改
            elEl.on('click', '.modify-btn', function () {
                that.editOppDialog.show();
            });
            //变更负责人
            elEl.on('click', '.canchangeowner-btn', function () {
                that.selectColleagueS.show();
            });
            //作废
            elEl.on('click', '.update-opportunity-states-un-btn', function () {
                util.confirm('你确定要作废选该销售机会吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/UpdateSalesOpportunitysStates',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            salesOpportunityIDs: that.myID, //List<int>，
                            states: 2//int，状态：1、启用；2、作废
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var ret = responseData.value && responseData.value.result && responseData.value.result[0];
                                if (ret) {
                                    if (ret.value1) {
                                        util.remind(2, "作废机会成功");
                                        that.refresh();
                                    } else {
                                        util.alert('作废销售机会失败，原因：' + ret.value2);
                                    }
                                }
                            }
                        }
                    });
                });
            });
            //启用
            elEl.on('click', '.update-opportunity-states-on-btn', function () {
                util.confirm('你确定要启用选该销售机会吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/UpdateSalesOpportunitysStates',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            salesOpportunityIDs: that.myID, //List<int>，
                            states: 1//int，状态：1、启用；2、作废
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                var ret = responseData.value && responseData.value.result && responseData.value.result[0];
                                if (ret) {
                                    if (ret.value1) {
                                        util.remind(2, "启用机会成功！");
                                        that.refresh(); //刷新
                                    } else {
                                        util.alert('启用销售机会失败，原因：' + ret.value2);
                                    }
                                }
                            }
                        }
                    });
                });
            });
            //关注按钮
            elEl.on('click', '.follow-switch-btn', function (e) {
                that._switchFollow(e);
            });
            elEl.on('click', '.add-contract-in-opp', function (e) {
                that.addContractDialog.show();
            });
            elEl.on('click', '.modify-contracts-in-opp', function (e) {
                that.editContractDialog.show({
                    contractID: $(e.target).parent().parent().attr('data-id')
                });
            });

            elEl.on('click', '.add-product-in-opp', function (e) {

                that.addProductSelectDialog.show();
            });
            elEl.on('click', '.modify-product-in-opp', function (e) {
                that.modifyProductInOppDialog.show({
                    flag: 'view',
                    oppProductRelationID: $(e.target).parent().parent().attr('data-id')
                });
            });

            elEl.on('click', '.add-competitor-in-opp', function (e) {
                that.addCompetitorSelectDialog.show();
            });
            elEl.on('click', '.add-contracts-in-opp', function (e) {
                that.addContractDialog.show();
            });
            elEl.on('click', '.modify-competitor-in-opp', function (e) {
                that.modifyCompetitorInOppDialog.show({
                    flag: 'view', //edit
                    salesOpportunityID: that.options.queryParams.id,
                    competitorID: $(e.target).parent().parent().attr('data-id')
                });
            });
            //变更负责人
            this.selectColleagueS.on("selected", function (val) {
                var lastOwnerId = $(".owner-name", elEl).attr('data-ownerId') || that.responseData.value.salesOpportunity.owner.employeeID;
                util.confirm('你确定要将销售机会的负责人变更为' + val.name + '吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/UpdateSalesOpportunitysOwnerID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            salesOpportunityIDs: that.myID, //
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
                                        itemResultStr = '变更销售机会的负责人失败，原因：' + describe + '</br>';
                                        util.alert(itemResultStr);
                                    } else {
                                        util.remind(1, "变更成功");
                                        //                                        that.refresh(); //刷新  不能刷新页面因为负责人变了就没有权限看此页面
                                        $(".owner-name", elEl).text(val.name).attr('data-ownerId', val.employeeID);//单独刷新负责人名称
                                        that.followUpBox.replace(lastOwnerId, val);//刷新联合跟进人
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
                    "url": '/SalesOpportunity/SalesOpportunityCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { salesOpportunityID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('following').addClass('no-follow').text('关注')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/SalesOpportunity/SalesOpportunityFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { salesOpportunityID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('no-follow').addClass('following').text('已关注')
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
            //            var salesStagesInUse = crmData.salesStagesInUse;//销售阶段数据
            var allTags = []; //存放线索标签数据数组
            var salesStagesInUseList = []; //存放销售阶段数据数组
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
            //            _.each(salesStagesInUse, function (item) {
            //                salesStagesInUseList.push(
            //                    {
            //                        "text": item.name + '（' + item.winRate + '%）',
            //                        "value": item.salesStageNo
            //                    }
            //                );
            //            });
            //            util.mnSelect($('.updatestates-select-list', this.$el), 'syncModel', salesStagesInUseList);//重置状态选项
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
                    "fbrType": 3
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
                    "fbrType": 3,// 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": that.myID // 对手ID
                }
            });
            this.attachmentList.on('uploaded', function () {
                that.attachment.reload();
            });
        },
        //实例化feed列表
        setFeedList: function () {
            var feedListEl = $('.crm-feed-list-warp', this.$el);
            var pagEl = $('.feed-list-pagination', this.$el);
            var searchEl = $('', this.$el);
            var that = this;
            this.feedList = new FeedList({
                "element": feedListEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": {//分页配置项
                    "pageSize": 15,
                    "visiblePageNums": 3
                },
                GetBatchFilesSource: 1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                    type: 'opportunity',
                    id: that.options.queryParams.id
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 3, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
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
                $('.modify-product-btn', elEl).show();
            } else {
                $('.modify-product-btn', elEl).hide();
            }
            if (canDelete) {
                $('.delete-product-btn', elEl).show();
            } else {
                $('.delete-product-btn', elEl).hide();
            }
            if (canChangeOwner) {
                $('.canchangeowner-product-btn', elEl).show();
            } else {
                $('.canchangeowner-product-btn', elEl).hide();
            }
        },

        render: function () {
            var elEl = this.$el;
            var customer = this.responseData.value.customer || null;
            var salesOpportunity = this.responseData.value.salesOpportunity;
            var fBusinessTagRelations, fBusinessTagRelationsStr = '';
            var followBtn = $('.follow-switch-btn', elEl);
            var param;
            var currentParam = util.getTplQueryParams2();
            if (customer) {
                param = {
                    id: customer.customerID,
                    returnUrl: 'opportunities/showopportunity/=/param-' + encodeURIComponent(JSON.stringify(currentParam))
                }
                $('.jdata-customername', elEl).html('<a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + customer.name + '</a>');

            } else {
                $('.jdata-customername', elEl).html('<a href="javascript:;"></a>');
            }
            var liStrOppProductRelations = '';
            var liStrOpportunitys = '';
            var liStrContracts = '';
            var oppProductRelations = this.responseData.value.salesOpportunity.oppProductRelations || null;
            var oppCompetitorRelations = this.responseData.value.salesOpportunity.oppCompetitorRelations || null;
            var contracts = this.responseData.value.contracts || null;
            //左栏产品列表
            if (oppProductRelations && oppProductRelations.length > 0) {
                _.each(oppProductRelations, function (item) {
                    liStrOppProductRelations += ' <li data-id="' + item.oppProductRelationID + '"> <span class="tit"><a href="javascript:;" class="modify-product-in-opp">' + item.productName + '</a></span> <span class="value" title="单价 ' + _.str.numberFormat(item.unitAmount, 2) + ' * 数量 ' + _.str.numberFormat(item.count, 4) + '">￥' + _.str.numberFormat(item.totalAmount) + '</span> </li>';
                });
                $('.detail-left-list-product', elEl).html('<ul class="detail-left-list-ul">' + liStrOppProductRelations + '</ul>');
                $('.detail-left-list-product', elEl).parent().find('.fn-right').show();
            } else {
                $('.detail-left-list-product', elEl).html('<div class="text-align-c"> 当前机会下没有产品，<a href="javascript:;" class="add-product-in-opp">立即添加</a></div>');
                $('.detail-left-list-product', elEl).parent().find('.fn-right').hide();
            }

            //左栏竞争对手列表
            if (oppCompetitorRelations && oppCompetitorRelations.length > 0) {
                _.each(oppCompetitorRelations, function (item) {
                    liStrOpportunitys += ' <li data-id="' + item.competitorID + '"  data-opp-id="' + item.salesOpportunityID + '"> <span class="tit"><a href="javascript:;" class="modify-competitor-in-opp">' + item.name + '</a></span> <span class="value">赢率' + item.winRate + '%</span> </li>';
                });
                $('.detail-left-list-competitors', elEl).html('<ul class="detail-left-list-ul">' + liStrOpportunitys + '</ul>');
                $('.detail-left-list-competitors', elEl).parent().find('.fn-right').show();
            } else {
                $('.detail-left-list-competitors', elEl).html('<div class="text-align-c"> 当前机会下没有竞争对手，<a href="javascript:;" class="add-competitor-in-opp">立即添加</a></div>');
                $('.detail-left-list-competitors', elEl).parent().find('.fn-right').hide();
            }

            //左栏合同列表
            if (contracts && contracts.length > 0) {
                _.each(contracts, function (item) {
                    liStrContracts += ' <li data-id="' + item.contractID + '"> <span class="tit"><a href="javascript:;" class="modify-contracts-in-opp">' + item.title + '</a></span> <span class="value">' + item.statesDesc + '</span> </li>';
                });
                $('.detail-left-list-contracts', elEl).html('<ul class="detail-left-list-ul">' + liStrContracts + '</ul>');
                $('.detail-left-list-contracts', elEl).parent().find('.fn-right').show();
            } else {
                $('.detail-left-list-contracts', elEl).html('<div class="text-align-c"> 当前机会下没有合同，<a href="javascript:;" class="add-contracts-in-opp">立即添加</a></div>');
                $('.detail-left-list-contracts', elEl).parent().find('.fn-right').hide();
            }

            if (salesOpportunity) {
                if (!salesOpportunity.isOutReport) {
                    $('.isoutreport-btn', elEl).find('.mn-checkbox-item').addClass('mn-selected');
                } else {
                    $('.isoutreport-btn', elEl).find('.mn-checkbox-item').removeClass('mn-selected');
                }
                fBusinessTagRelations = salesOpportunity.fBusinessTagRelations;
                fBusinessTagRelationsStr = '';
                _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                    var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                    var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                    fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
                });
                $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);


                var $defineFieldUl = $('.opportunity-define-field-tag-ul', elEl);
                var defineFieldHtml = [];
                if (salesOpportunity.userDefineFieldDataList && salesOpportunity.userDefineFieldDataList.textList) {
                    _.map(salesOpportunity.userDefineFieldDataList.textList, function (obj) {
                        if (obj.value != '') {
                            defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                            defineFieldHtml.push(obj.fieldDescription);
                            defineFieldHtml.push('</div><div class="textarea-wrapper">');
                            defineFieldHtml.push(obj.value);
                            defineFieldHtml.push('</div></li>');
                        }
                    });
                }
                if (salesOpportunity.userDefineFieldDataList && salesOpportunity.userDefineFieldDataList.dateList) {
                    _.map(salesOpportunity.userDefineFieldDataList.dateList, function (obj) {
                        if (obj.value > 0) {
                            defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                            defineFieldHtml.push(obj.fieldDescription);
                            defineFieldHtml.push('</div><div class="input-wrapper">');
                            //                        defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日 HH:mm'));
                            defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日'));
                            defineFieldHtml.push('</div></li>');
                        }
                    });
                }
                if (salesOpportunity.userDefineFieldDataList && salesOpportunity.userDefineFieldDataList.numList) {
                    _.map(salesOpportunity.userDefineFieldDataList.numList, function (obj) {
                        defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                        defineFieldHtml.push(obj.fieldDescription);
                        defineFieldHtml.push('</div><div class="input-wrapper">');
                        defineFieldHtml.push(obj.value);
                        defineFieldHtml.push('</div></li>');
                    });
                }
                if (defineFieldHtml.length > 0) {
                    $defineFieldUl.show();
                    $defineFieldUl.html(defineFieldHtml.join(''));
                } else {
                    $defineFieldUl.hide();
                }

                if (salesOpportunity.isFollow) {
                    followBtn.addClass('following').text('已关注');
                } else {
                    followBtn.addClass('no-follow').text('关注');
                }
                $('.hd-titname', elEl).text(salesOpportunity.name);//标题
                $('.jdata-ownername', elEl).text(salesOpportunity.owner.name);//负责人
                $('.jdata-createtime', elEl).text(moment.unix(salesOpportunity.createTime).format('YYYY年MMMDD日 HH:mm'));//创建时间
                $('.jdata-lasteditemployeename', elEl).text(salesOpportunity.lastEditEmployee.name);//最后修改人
                $('.jdata-lastedittime', elEl).text(moment.unix(salesOpportunity.lastEditTime).format('YYYY年MMMDD日 HH:mm'));//最后修改时间
                $('.jdata-name', elEl).text(salesOpportunity.name);//string，姓名(必填，长度100)
                $('.jdata-company', elEl).text(salesOpportunity.company);//string，公司名称(非必填，长度200)


                switch (salesOpportunity.states) {
                    case 1:
                        $('.update-opportunity-states-btn', elEl).text('作废').addClass('update-opportunity-states-un-btn').removeClass('update-opportunity-states-on-btn');
                        break;
                    case 2:
                        $('.update-opportunity-states-btn', elEl).text('启用').addClass('update-opportunity-states-on-btn').removeClass('update-opportunity-states-un-btn');

                        break;

                }
                $('.jdata-expecteddealtime', elEl).text(moment.unix(salesOpportunity.expectedDealTime).format('YYYY年MM月DD日'));


                $('.jdata-expectedincome', elEl).text('￥' + _.str.numberFormat(parseFloat(salesOpportunity.expectedIncome), 2));
                $('.tab-time-line-box .jdata-expectedsalesamount', elEl).text('￥' + _.str.numberFormat(parseFloat(salesOpportunity.expectedSalesAmount), 2));
                $('.tab-time-line-box .jdata-maybeamount', elEl).text('￥' + _.str.numberFormat(parseFloat(salesOpportunity.expectedSalesAmount * salesOpportunity.salesStage.winRate / 100), 2));
                $('.tab-base-info-box .jdata-expectedsalesamount', elEl).text(_.str.numberFormat(parseFloat(salesOpportunity.expectedSalesAmount), 2) + '元');
                $('.tab-base-info-box .jdata-maybeamount', elEl).text(_.str.numberFormat(parseFloat(salesOpportunity.expectedSalesAmount * salesOpportunity.salesStage.winRate / 100), 2) + '元');
                $('.jdata-foundtime', elEl).text(moment.unix(salesOpportunity.foundTime).format('YYYY-MM-DD'));
                $('.updatestates-select-list', elEl).find('.mn-select-title').text(salesOpportunity.salesStage.name + '（' + salesOpportunity.salesStage.winRate + '%）');
                $('.jdata-salesstage', elEl).text(salesOpportunity.salesStage.name + '，赢率' + salesOpportunity.salesStage.winRate + '%');

                $('.jdata-l', elEl).text(salesOpportunity.L);
                $('.jdata-executiondescription', elEl).text(salesOpportunity.executionDescription);
                $('.jdata-summary', elEl).text(salesOpportunity.summary);
                $('.jdata-effect', elEl).text(salesOpportunity.effect);
                $('.jdata-demands', elEl).text(salesOpportunity.demands);
                $('.jdata-description', elEl).text(salesOpportunity.description);

            }
            this.showFnBtn();


        },
        load: function () {
            var elEl = this.$el;
            var id = this.options.queryParams.id;
            var that = this;
            util.api({
                "url": '/SalesOpportunity/GetSalesOpportunityDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    salesOpportunityID: id, //int，ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                        if (!that.addContractDialog) {
                            that.addContractDialog = new ContractDialog({
                                salesOpportunityID: responseData.value.salesOpportunity.salesOpportunityID,
                                salesOpportunityName: responseData.value.salesOpportunity.name,
                                customerID: responseData.value.customer.customerID,
                                customerName: responseData.value.customer.name
                            });
                            that.addContractDialog.on('success', function () {
                                that.refresh();
                                that.detaillistContracts.refresh();
                            });
                            that.editContractDialog = new ContractDialog();
                            that.editContractDialog.on('success', function () {
                                that.refresh();
                                that.detaillistContracts.refresh();
                            });

                            that.editOppDialog = new OpportunityDialog({
                                salesOpportunityID: that.options.queryParams && that.options.queryParams.id,
                                customerName: responseData.value && responseData.value.customer && responseData.value.customer.name
                            });
                            that.editOppDialog.on('success', function () {
                                that.refresh();
                            });
                            that.editOppDialog.v = that;
                        }
                        // 联合跟进人
                        var items = [];
                        var oppCombineSalers = responseData.value.salesOpportunity.oppCombineSalers;
                        _.each(oppCombineSalers, function (item) {
                            items.push(item.employee);
                        });
                        that.setPublish();
                        if (!that.followUpBox) {
                            that.followUpBox = new FollowUp({
                                "element": $(".crm_follow_up", elEl),
                                "addApi": "/SalesOpportunity/AddOppCombineSalers",
                                "deleteApi": "/SalesOpportunity/DeleteOppCombineSaler",
                                "parameter": {
                                    "salesOpportunityID": id,
                                    "employeeIDs": ""
                                },
                                "selectColleagueS": that.selectColleagueS,
                                "items": items,
                                "ownerID": responseData.value.salesOpportunity.ownerID,
                                "title": "联合跟进人",
                                "typeName": "机会",
                                "name": "联合跟进人"
                            });
                        }
                        //左侧联系人
                        var contacts = responseData.value.salesOpportunity.oppContactRelations;
                        if (!that.contactBoxModify) {
                            that.contactBoxModify = new ContactBox({
                                "element": $(".crm_contact_modify", elEl),
                                "customerID": responseData.value.customer.customerID,
                                "combineApi": "/SalesOpportunity/SetOppContacts",
                                "type": "modify",
                                "parameter": {
                                    "salesOpportunityID": id,
                                    "contactIDs": []
                                },
                                "items": contacts
                            });
                            that.contactBoxModify.on('modify', function () {
                                that.detaillistContacts.refresh();

                            });
                            that.contactBoxModify.on('onNew', function () {
                                that.modifyDialog.show();

                            });
                        } else {
                            that.contactBoxModify.reload(contacts);
                        }

                        var salesStageNo = responseData.value.salesOpportunity.salesStage.salesStageNo;
                        var crmData = util.getCrmData(); //获取CRM缓存数据
                        var salesStagesInUse = crmData.salesStagesInUse;//销售阶段数据
                        var salesStagesInUseList = [];
                        _.each(salesStagesInUse, function (item) {
                            salesStagesInUseList.push(
                                {
                                    "text": item.name + '（' + item.winRate + '%）',
                                    "value": item.salesStageNo,
                                    "selected": item.salesStageNo == salesStageNo ? true : false,
                                    "defaultSelected": item.salesStageNo == salesStageNo ? true : false
                                }
                            );
                        });
                        that.salesStageNo=salesStageNo;
                        util.mnSelect($('.updatestates-select-list', this.$el), 'syncModel', salesStagesInUseList);//重置状态选项
                        //变更销售阶段的弹框
                        that.updateSalesOpportunitySalesStageNo = new UpdateSalesOpportunitySalesStageNoDialog({
                            content: elEl.filter('.opportunitysalesstageno-tpl').html()
                        });
                        that.updateSalesOpportunitySalesStageNo.v = that;
                        that.updateSalesOpportunitySalesStageNo.defaultText = $('.updatestates-select-list', elEl).find('.mn-select-title').text();
                        that.updateSalesOpportunitySalesStageNo.defaulValue = salesStageNo;

                        //左侧漏斗
                        that.mainchart = new Mainchart.Salesstage($(".crm-left-mainchart", elEl), salesStageNo);
                        that._detaillistContacts(); //机会中的联系人列表
                        that._initModifyDialog();//修改联系人
                    } else {
                        util.alert(responseData.message, function () {
                            that._backToListPage();//不成功就返回到列表
                        }, {  "zIndex": 3000});

                    }
                }
            }, {
                "errorAlertModel": "1" //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
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
            util.confirm('你确定要删除该销售机会吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/SalesOpportunity/DeleteSalesOpportunitys',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "salesOpportunityIDs": that.myID
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
        //机会中的联系人列表
        _detaillistContacts: function () {
            var that = this;
            var elEl = this.$el;
            if (!this.detaillistContacts) {
                this.detaillistContacts = new Detaillist({
                    warpEl: $('.tab-contact-box', elEl),
                    title: '联系人',
                    rightTopBTnText: '修改',
                    operationClass: 'table-modify-btn',
                    url: '/SalesOpportunity/GetContactsByOppID', //请求地址
                    data: {
                        salesOpportunityID: that.myID
                    },
                    emptyStr: '当前机会下没有获取到联系人',
                    jDatas: 'contacts',//需要的数据对象
                    thDatas: ['姓名', '联系方式', '职务', '部门', '公司'],//表格标题
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

                this.detaillistContacts.refresh();
                //添加
                this.detaillistContacts.on('add', function (rowData) {
                    that.modifyDialog.show();
                });
                //修改
                this.detaillistContacts.on('modify', function (rowData) {
                    that.modifyDialog.show(rowData);
                });
                //tr
                this.detaillistContacts.on('tr', function (rowData) {
                    that.contactViewDialog.show({
                        contactID: rowData.contactID
                    })
                });

            }
        },
        //修改联系人
        _initModifyDialog: function () {
            var self = this;
            self.modifyDialog = new ContactsDialog({
                "title": "选择联系人",
                "url": "/Contact/GetContactsByCustomerID",
                "type": "modify",
                "defaultCondition": {
                    "customerID": self.responseData.value.salesOpportunity.customerID
                }
            });
            self.modifyDialog.on("selected", function (val) {
                var parameter = {},
                    contactIDs = [];
                _.each(val, function (item) {
                    contactIDs.push(item.contactID);
                });
                //                console.log(val)
                parameter.contactIDs = contactIDs;
                parameter.salesOpportunityID = self.myID;
                util.api({
                    'url': "/SalesOpportunity/SetOppContacts",
                    'type': 'post',
                    "dataType": 'json',
                    'data': parameter,
                    'success': function (responseData) {
                        if (!responseData.success) {
                            return;
                        }
                        self.detaillistContacts.refresh();
                        self.refresh();//刷新
                    }
                });
            });
        },
        //机会中的合同列表
        _detaillistContracts: function () {
            var that = this;
            var elEl = this.$el;
            var self = this;
            this.detaillistContracts = new Detaillist({
                warpEl: $('.tab-contract-box', elEl),
                title: '合同',
                url: '/SalesOpportunity/GetContractsByOppID', //请求地址
                data: {
                    salesOpportunityID: that.myID
                },
                emptyStr: '当前机会下没有获取到合同',
                jDatas: 'contracts',//需要的数据对象
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
            this.detaillistContracts.on('tr', function (rowData) {
                that.editContractDialog.show({
                    contractID: rowData.contractID
                });
            });
            this.detaillistContracts.on('add', function (rowData) {
                that.addContractDialog.show();
            });
            this.detaillistContracts.on('modify', function (rowData) {
                that.editContractDialog.show({
                    contractID: rowData.contractID
                });
            });
            this.detaillistContracts.on('del', function (rowData) {
                var that = this;
                util.confirm('你确定要解除该合同与此机会的关系吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/DeleteOppContractRelation',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "salesOpportunityID": rowData.salesOpportunityID,
                            contractID: rowData.contractID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                self.refresh();
                                that.refresh();
                            }
                        }
                    });
                });
            });
        },
        //机会中的产品列表
        _detaillistProduct: function () {
            var that = this;
            var elEl = this.$el;
            var self = this;
            this.detaillistProduct = new Detaillist({
                warpEl: $('.tab-product-box', elEl),
                title: '产品',
                url: '/SalesOpportunity/GetOppProductRelationsByOppID', //请求地址
                data: {
                    salesOpportunityID: that.myID
                },
                emptyStr: '当前机会下没有获取到产品',
                jDatas: 'oppProductRelations',//需要的数据对象
                thDatas: ['名称', '单位', '单价', '数量', '总价', '操作'],//表格标题
                aoColumnsData: [//列配置
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
            this.detaillistProduct.on('add', function (rowData) {
                var salesOpportunityID = that.myID

                //添加产品
                that.addProductSelectDialog.show();
            });
            this.detaillistProduct.on('modify', function (rowData) {
                that.modifyProductInOppDialog.show({
                    flag: 'edit',
                    oppProductRelationID: rowData.oppProductRelationID
                });
            });
            this.detaillistProduct.on('tr', function (rowData) {
                that.modifyProductInOppDialog.show({
                    flag: 'view',
                    oppProductRelationID: rowData.oppProductRelationID
                });
            });
            this.detaillistProduct.on('del', function (rowData) {
                var that = this;
                util.confirm('你确定要删除该产品吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/DeleteOppProductRelation',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "oppProductRelationID": rowData.oppProductRelationID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                self.refresh();
                                that.refresh();
                            }
                        }
                    });
                });
            });
        },
        //机会中的对手列表
        _detaillistCompetitor: function () {
            var that = this;
            var elEl = this.$el;
            var self = this;
            this.detaillistCompetitor = new Detaillist({
                warpEl: $('.tab-competitor-box', elEl),
                title: '竞争对手',
                url: '/SalesOpportunity/GetOppCompetitorRelationsByOppID', //请求地址
                data: {
                    salesOpportunityID: that.myID
                },
                emptyStr: '当前机会下没有获取到竞争对手',
                jDatas: 'oppCompetitorRelations',//需要的数据对象
                thDatas: ['名称', '报价', '赢率', '优势', '劣势', '操作'],//表格标题
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
                    {
                        "mData": "price",
                        "sWidth": "90px",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var formatNum = _.str.numberFormat(parseFloat(data), 2);//加小数点加逗号
                            var newData = '<span title="' + formatNum + '">' + formatNum + '</span>';
                            return newData;
                        }
                    },
                    {
                        "mData": "winRate",
                        "sWidth": "90px",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + data + '%">' + data + '%</span>';
                            return newData;
                        }
                    },
                    {
                        "mData": "advantage",
                        "sWidth": "90px",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
                    {
                        "mData": "disadvantage",
                        "sWidth": "90px",
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var newData = '<span title="' + data + '">' + data + '</span>';
                            return newData;
                        }
                    },
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
            this.detaillistCompetitor.on('add', function (rowData) {
                that.addCompetitorSelectDialog.show();
            });
            this.detaillistCompetitor.on('modify', function (rowData) {
                that.modifyCompetitorInOppDialog.show({
                    flag: 'edit', //edit
                    salesOpportunityID: rowData.salesOpportunityID,
                    competitorID: rowData.competitorID
                });
            });
            this.detaillistCompetitor.on('tr', function (rowData) {
                that.modifyCompetitorInOppDialog.show({
                    flag: 'view', //edit
                    salesOpportunityID: rowData.salesOpportunityID,
                    competitorID: rowData.competitorID
                });
            });
            this.detaillistCompetitor.on('del', function (rowData) {
                var that = this;
                util.confirm('你确定要删除该竞争对手吗？', '', function () {
                    util.api({
                        "url": '/SalesOpportunity/DeleteOppCompetitorRelation',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "salesOpportunityID": rowData.salesOpportunityID,
                            competitorID: rowData.competitorID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                self.refresh();
                                that.refresh();
                            }
                        }
                    });
                });
            });
        },
        //实例化输入框
        setPublish: function () {
            var that = this;
            var elEl = this.$el;
            var myId = this.options.queryParams.id;
            if (!this.feedpublish) {
                this.feedpublish = new Publish({
                    "element": $('.feed-submit-box-warp', elEl),
                    "title": "新建销售记录",
                    "placeholder": "发布新销售记录",
                    "type": "event",
                    "condition": {
                        "associationContactIDs": "",// string，关联联系人ID集合，逗号分隔
                        "fileInfos": [],// List<ParamValue<int, string, int, string>>，附件集合
                        "isAllDayEvent": false,// bool，是否全天事件
                        "startTime": 0,// long，事件开始提醒时间
                        "remindType": 1,// int，全部 = 0,不提醒 = 1,销售记录发生时= 2,5分钟前 = 3,15分钟前= 4,30分钟前= 5,1小时前= 6,2小时前= 7,6小时前= 8,1天前= 9,2天前= 10,自定义时间= 11
                        //"remindTime":0,// long，自定义时间
                        "isSentSms": false,// bool，是否发送短信
                        "feedContent": "",// string，事件内容
                        "parentFeedID": 0, //int，父事件ID
                        "listTagOptionID": [],// List<string>，销售记录标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)，除销售记录外选其他标签会报错
                        "fbrType": 3,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                        //1，与客户关联，dataID：客户ID；DataID1：联系人ID
                        //2,与联系人关联，DataID：客户ID；DataID1：联系人ID
                        //3,与机会关联，DataID：客户ID；DataID1：联系人ID列表；DataID2：机会ID
                        "customerID": that.responseData.value.salesOpportunity.customerID,// int，客户ID
                        "contactIDs": 0,// string，联系人ID1
                        "salesOpportunityID": myId// int，机会ID
                    },
                    "display": ["time", "contact", "picture", "attach", "tag", "at", "topic"]
                });
                this.feedpublish.on('post', function (feedID) {
                    //                that.feedList.unshiftFromFeedId(feedID);//请求一条数据
                    that.feedList.load();
                });
            }

        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            var topMenuTabEl = $('.tab-menu', elEl);
            var salesOpportunityID = this.options.queryParams && this.options.queryParams.id;
            //            util.autoAdjustPos($('.flaot-left-menu', this.$el));//浮动元素（滚动到元素位置贴到顶部固定）
            //实例化选人组件
            this.selectColleagueS = new SelectColleague({
                "isMultiSelect": false,
                "title": '请选择负责人'
            });

            this.setFeedList();//实例化feed列表
            this.setCrmAttachment();//实例化左栏附件
            this.setAttachmentList();//实例化附件列表
            this._detaillistProduct(); //机会中的产品列表
            this._detaillistCompetitor(); //机会中的对手列表
            this._detaillistContracts(); //机会中的合同列表
            this.tab = new Tab({
                "element": topMenuTabEl, //容器
                "container": this.$el, //大父级容器
                "items": [
                    {value: "tab-time-line", text: "时间线"},
                    {value: "tab-base-info", text: "基本信息"},
                    {value: "tab-contact", text: "联系人"},
                    {value: "tab-product", text: "产品"},
                    {value: "tab-competitor", text: "竞争对手"},
                    {value: "tab-contract", text: "合同"},
                    {value: "tab-files", text: "附件"}
                ]
            });
            this.tab.on('change', function (beforeTab, nowTab) {
                switch (nowTab) {
                    case 'tab-product':
                        that.detaillistProduct.refresh();
                        break;
                    case 'tab-competitor':
                        that.detaillistCompetitor.refresh();
                        break;
                    case 'tab-contract':
                        that.detaillistContracts.refresh();
                        break;
                    //                    case 'tab-contact':
                    //                        that.detaillistContacts.refresh();
                    //                        break;
                }

            });
            this.contactViewDialog = new ContactView();//查看表格中的联系人
            this.addCompetitorSelectDialog = new CompetitorSelect({
                salesOpportunityID: salesOpportunityID
            });
            this.addCompetitorSelectDialog.on('success', function () {
                that.detaillistCompetitor.refresh();
                that.refresh();
            });
            this.addProductSelectDialog = new ProductSelect({
                salesOpportunityID: salesOpportunityID
            });

            this.addProductSelectDialog.on('success', function () {
                that.detaillistProduct.refresh();
                that.refresh();
            });
            this.modifyProductInOppDialog = new ProductInOppEditDialog({
                salesOpportunityID: salesOpportunityID
            });
            this.modifyProductInOppDialog.on('success', function () {
                that.detaillistProduct.refresh();
                that.refresh();
            });
            this.modifyCompetitorInOppDialog = new CompetitorInOppEditDialog({
                salesOpportunityID: salesOpportunityID
            });
            this.modifyCompetitorInOppDialog.on('success', function () {
                that.detaillistCompetitor.refresh();
                that.refresh();
            });

            this.addContactsDialog = new ContactsDialog({
                defaultCondition: {
                    employeeID: util.getCurrentEmp().employeeID
                }
            });
            this.addContactsDialog.on('selected', function (obj) {
                //                console.log(arguments);
                that.detaillistContacts.refresh();
            });

        },
        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        	this.contactBoxModify && (this.contactBoxModify.destroy());
        }
    });

    /**
     * 变更销售阶段的弹框
     */
    var UpdateSalesOpportunitySalesStageNoDialog = Dialog.extend({
        "attrs": {
            content: $(tpl).filter('.opportunitysalesstageno-tpl').html(),
            closeTpl: "<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-updatesalesopportunitysalesstagenodialog'
        },
        "events": {
            'click .f-submit': 'submit',
            'click .f-cancel': 'hide'
        },
        "hide": function () {
            var result = UpdateSalesOpportunitySalesStageNoDialog.superclass.hide.apply(this, arguments);
            var selectEl = $('.updatestates-select-list', this.v.$el);
            util.mnSetter(selectEl,this.defaulValue );//设置为默认值

            return result;
        },
        "show": function () {
            var result = UpdateSalesOpportunitySalesStageNoDialog.superclass.show.apply(this, arguments);
            var serviceTime = this.v.responseData.serviceTime || 0;
            var expectedDealTime = this.v.responseData.value.salesOpportunity.expectedDealTime || 0;
            var val = this.val;
            var serviceM = new Date(serviceTime * 1000).getMonth() + 1;
            var expectedDealM = new Date(expectedDealTime * 1000).getMonth() + 1;
            //如果选的是赢单
            if (val == 10) {
                if (expectedDealM != serviceM) {
                    $('.set-nowtime', this.element).show();
                }
            } else {
                $('.set-nowtime', this.element).hide();
            }
            $('.text', this.element).text(this.text);
            $('.con', this.element).show();

            return result;
        },

        "submit": function (e) {
            var isDealTime = false;
            var that = this;
            var mnSelector = $('.set-nowtime-checkbox', this.element);
            if (util.mnGetter(mnSelector) == 1) {
                isDealTime = true;
            } else {
                isDealTime = false;
            }

            util.api({
                "url": '/SalesOpportunity/UpdateSalesOpportunitySalesStageNo',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    salesOpportunityID: that.v.myID,
                    isSetExpectedDealTime: isDealTime,
                    salesStageNo: that.val
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        util.remind(1, "变更成功");

                        that.v.refresh();
                    }
                    that.hide();
                }
            });
        }

    });

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showopportunity = new Showopportunity({
            element: tplEl,
            queryParams: queryParams
        });
        showopportunity.load();
    };

});