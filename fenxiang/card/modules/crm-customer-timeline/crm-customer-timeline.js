/**
 * CRM - 产品
 * @author liuxiaofan
 * 2014-04-02
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-customer-timeline/crm-customer-timeline.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var ContactBox = require('modules/crm-contact-box/crm-contact-box');
    var Tabs = require('uilibs/tabs');
    var FeedList = require('modules/feed-list/feed-list');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    var CustomerMap = require('modules/crm-customer-map/crm-customer-map');
    var FollowUp = require('modules/crm-follow-up/crm-follow-up');

    var CustomerTimeline = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: '', //CLASS名
        template: _.template($(htmltpl).filter('.crm-customer-timeline-template').html()), //模板
        options: {
            warpEl: null,
            customerData: null
        },
        events: {
            'click .add-opp-in-customer': 'addOpp',
            'click .add-contracts-in-customer': 'addContracts',
            'click .add-product-in-customer': 'addProduct',
            'click .modify-product-in-opp': 'modifyProduct',
            'click .modify-opp-in-opp': 'modifyOpp',
            'click .modify-contracts-in-opp': 'modifyContracts'
        },
        destroy: function(){
        	this.feedpublish && (this.feedpublish.destroy());
        	this.contactBox && (this.contactBox.destroy());
        	this.followUpBox && (this.followUpBox.destroy());
        },
        addOpp: function () {
            this.v.addOppDialog.show();
        },
        addContracts: function () {
            this.v.addContractDialog.show();
        },
        addProduct: function () {
            this.v.addProductDialog.show();
        },
        modifyProduct: function (e) {
            var meEl = $(e.currentTarget);
            this.v.addProductDialog.show({
                oppProductRelationID: meEl.parent().parent().data('id')
            });
        },
        modifyOpp: function (e) {
            this.v.modifyOppDialog.show({
                salesOpportunityID: $(e.target).parent().parent().attr('data-id')
            });
        },
        modifyContracts: function (e) {
            this.v.modifyContractDialog.show({
                contractID: $(e.target).parent().parent().attr('data-id')
            });
        },
        initialize: function () {
            this.loadData();
        },
        render: function () {
            var $el = this.$el;
            var renderTemplate = this.template;
            var that = this;
            $el.html(renderTemplate({value: {
                employees: {}
            }}));
            this.options.warpEl.html($el);
            var c = this.options.customerData.value.FCustomer;
            $('.customer-no', $el).text(c.fCustomerNo||'');
            $('.customer-addr', $el).text(c.address);
            $('.customer-site', $el).html('').html($('<a>').attr('target', '_blank').attr('href', c.webSite.indexOf('http://') > -1 ? c.webSite : 'http://' + c.webSite).text(c.webSite));
            var OppProductRelations = that.responseData.value.OppProductRelations || null;
            var Opportunitys = that.responseData.value.Opportunitys || null;
            var Contracts = that.responseData.value.Contracts || null;
            var liStrOppProductRelations = '';
            var liStrOpportunitys = '';
            var liStrContracts = '';
            $('.jdata-name', $el).text(c.name);

            //左栏产品列表
            if (OppProductRelations && OppProductRelations.length > 0) {
                _.each(OppProductRelations, function (item) {
                    liStrOppProductRelations += ' <li data-id="' + item.oppProductRelationID + '"> <span class="tit"><a href="javascript:;" class="modify-product-in-opp">' + item.productName + '</a></span> <span class="value" title="单价 ' + item.unitAmount + ' 数量 ' + item.count + '">￥' + item.totalAmount + '</span> </li>';
                });
                $('.detail-left-list-product', $el).html('<ul class="detail-left-list-ul">' + liStrOppProductRelations + '</ul>');
            } else {
                $('.detail-left-list-product', $el).html('<div class="text-align-c"> 当前客户下没有产品，请在机会下添加</div>');
            }

            //左栏机会列表
            if (Opportunitys && Opportunitys.length > 0) {
                _.each(Opportunitys, function (item) {
                    liStrOpportunitys += ' <li data-id="' + item.salesOpportunityID + '"> <span class="tit"><a href="javascript:;" class="modify-opp-in-opp">' + item.name + '</a></span> <span class="value">' + item.salesStage.winRate + '%</span> </li>';
                });
                $('.detail-left-list-opportunitys', $el).html('<ul class="detail-left-list-ul">' + liStrOpportunitys + '</ul>');
                $('.detail-left-list-opportunitys', $el).parent().find('.fn-right').css('display', '');
            } else {
                $('.detail-left-list-opportunitys', $el).html('<div class="text-align-c"> 当前客户下没有机会，<a href="javascript:;" class="add-opp-in-customer">立即添加</a></div>');
            }
            //左栏合同列表
            if (Contracts && Contracts.length > 0) {
                _.each(Contracts, function (item) {
                    liStrContracts += ' <li data-id="' + item.contractID + '"> <span class="tit"><a href="javascript:;" class="modify-contracts-in-opp">' + item.title + '</a></span> <span class="value">' + item.statesDesc + '</span> </li>';
                });
                $('.detail-left-list-contracts', $el).html('<ul class="detail-left-list-ul">' + liStrContracts + '</ul>');
                $('.detail-left-list-contracts', $el).parent().find('.fn-right').css('display', '');
            } else {
                $('.detail-left-list-contracts', $el).html('<div class="text-align-c"> 当前客户下没有合同，<a href="javascript:;" class="add-contracts-in-customer">立即添加</a></div>');
            }
            this.setCrmAttachment();

        },
        refresh: function () {
            var customerID = this.options.customerData.value.FCustomer.customerID;
            var self = this;
            var that = this;
            util.api({
                "url": '/FCustomer/GetFCustomerDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    customerID: customerID, //int，产品ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        self.responseData = responseData;
                        self.contactBox.reload(self.responseData.value.Contacts || []);

                        var OppProductRelations = that.responseData.value.OppProductRelations || null;
                        var Opportunitys = that.responseData.value.Opportunitys || null;
                        var Contracts = that.responseData.value.Contracts || null;
                        var liStrOppProductRelations = '';
                        var liStrOpportunitys = '';
                        var liStrContracts = '';

                        //左栏产品列表
                        if (OppProductRelations && OppProductRelations.length > 0) {
                            _.each(OppProductRelations, function (item) {
                                liStrOppProductRelations += ' <li data-id="' + item.oppProductRelationID + '"> <span class="tit"><a href="javascript:;" class="modify-product-in-opp">' + item.productName + '</a></span> <span class="value" title="单价 ' + item.unitAmount + ' 数量 ' + item.count + '">￥' + item.totalAmount + '</span> </li>';
                            });
                            $('.detail-left-list-product', $el).html('<ul class="detail-left-list-ul">' + liStrOppProductRelations + '</ul>');
                        } else {
                            $('.detail-left-list-product', $el).html('<div class="text-align-c"> 当前客户下没有产品，请在机会下立即添加</div>');
                        }

                        //左栏机会列表
                        if (Opportunitys && Opportunitys.length > 0) {
                            _.each(Opportunitys, function (item) {
                                liStrOpportunitys += ' <li data-id="' + item.salesOpportunityID + '"> <span class="tit"><a href="javascript:;" class="modify-opp-in-opp">' + item.name + '</a></span> <span class="value">' + item.salesStage.winRate + '%</span> </li>';
                            });
                            $('.detail-left-list-opportunitys', $el).html('<ul class="detail-left-list-ul">' + liStrOpportunitys + '</ul>');
                            $('.detail-left-list-opportunitys', $el).parent().find('.fn-right').css('display', '');
                        } else {
                            $('.detail-left-list-opportunitys', $el).html('<div class="text-align-c"> 当前客户下没有机会，<a href="javascript:;" class="add-opp-in-customer">立即添加</a></div>');
                        }
                        //左栏合同列表
                        if (Contracts && Contracts.length > 0) {
                            _.each(Contracts, function (item) {
                                liStrContracts += ' <li data-id="' + item.contractID + '"> <span class="tit"><a href="javascript:;" class="modify-contracts-in-opp">' + item.title + '</a></span> <span class="value">' + item.statesDesc + '</span> </li>';
                            });
                            $('.detail-left-list-contracts', $el).html('<ul class="detail-left-list-ul">' + liStrContracts + '</ul>');
                            $('.detail-left-list-contracts', $el).parent().find('.fn-right').css('display', '');
                        } else {
                            $('.detail-left-list-contracts', $el).html('<div class="text-align-c"> 当前客户下没有合同，<a href="javascript:;" class="add-contracts-in-customer">立即添加</a></div>');
                        }

                    }
                }
            });

            var $el = this.$el;
            var c = this.v.options.customerData.value.FCustomer;
            $('.jdata-name', $el).text(c.name);
            $('.customer-no', $el).text(c.fCustomerNo||'');
            $('.customer-addr', $el).text(c.address);
            this.customerMapBox.refresh(c.address);
            $('.customer-site', $el).html('').html($('<a>').attr('target', '_blank').attr('href', c.webSite.indexOf('http://') > -1 ? c.webSite : 'http://' + c.webSite).text(c.webSite));

        },
        loadData: function () {
            var self = this;
            var customerID = this.options.customerData.value.FCustomer.customerID;
            util.api({
                "url": '/FCustomer/GetFCustomerDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    customerID: customerID, //int，产品ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        self.responseData = responseData;
                        self.render();
                    }
                }
            });
        },
        //实例化feed列表
        setFeedList: function () {
            var elEl=$(this.$el);
            var searchEl = $('.search-inp',elEl),
                searchBtnEl = $('.search-btn',elEl);
            var that = this;
            var myId = this.options.customerData.value.FCustomer.customerID;


            //构建feedtabs
            var feedTabsEl = $('.feed-tabs', this.$el);
            this.feedTabs = new Tabs({
                "element": feedTabsEl,
                "triggers": $('.ui-tab-item', feedTabsEl),
                "panels": $('.ui-tab-panel', feedTabsEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click'
            }).render();
            this.feedTabs.on('switched', function (toIndex, fromIndex) {
                var curPanelEl=this.get('panels').eq(toIndex);
                that.feedList = new FeedList({
                    "element": $('.crm-feed-list-warp',curPanelEl), //list selector
                    "pagSelector": $('.feed-list-pagination', curPanelEl), //pagination selector
                    "pagOpts": {//分页配置项
                        "pageSize": 16,
                        "visiblePageNums": 3
                    },
                    GetBatchFilesSource: 1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                    crmParam: {
                        type: 'customer',
                        id: myId
                    },
                    "listPath": "/CrmFeed/GetFeeds",
                    "defaultRequestData": function () {
                        return {
                            "feedType": toIndex,
                            "fbrType": 1, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                            "dataID": myId, //
                            "type": 1, //1是分享类型
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
                    "listEmptyText": "暂无记录",
                    "searchOpts": {
                        "inputSelector": searchEl,
                        "btnSelector": searchBtnEl
                    } //默认请求数据
                });
                that.feedList.load();
            });
            this.feedTabs.trigger('switched', 0, -1); //将feed切换到全部列表
            searchBtnEl.on('click',function(evt){
                that.feedList.reload({
                    "keyword": _.str.trim(searchEl.val())
                });
                evt.preventDefault();
            });
        },
        //实例化输入框
        setPublish: function () {
            var that = this;
            var elEl = this.$el;
            var myId = this.options.customerData.value.FCustomer.customerID;
            var searchEl = $('.search-inp', this.$el);
            var searchElx = $('.empty-h', this.$el);
            var contactIDs = [];
            var Contacts = that.responseData.value.Contacts;
            _.each(Contacts, function (item) {
                contactIDs.push(item.contactID);
            });
            this.feedpublish = new Publish({
                "element": $('.feed-submit-box-warp', elEl),
                "title": "新建销售记录",
                "placeholder": "发布新销售记录",
                "type": "event",
                "customerInfo": that.responseData.value.FCustomer,
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
                    "fbrType": 1,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                    //1，与客户关联，dataID：客户ID；DataID1：联系人ID
                    //2,与联系人关联，DataID：客户ID；DataID1：联系人ID
                    //3,与机会关联，DataID：客户ID；DataID1：联系人ID列表；DataID2：机会ID
                    "customerID": myId,// int，客户ID
                    "contactIDs": contactIDs.join(','),// string，联系人ID1
                    "salesOpportunityID": 0// int，机会ID
                },
                "display": ["time", "contact", "picture", "attach", "tag", "at", "topic"]
            });
            this.feedpublish.on('post', function (feedID) {
                //                that.feedList.unshiftFromFeedId(feedID);//请求一条数据
                that.feedList.load({
                    "keyword": ''
                });
                that.feedTabs.switchTo(0); //将feed切换到全部列表
            });
        },
        setCrmAttachment: function () {
            var myId = this.options.customerData.value.FCustomer.customerID;
            var $el = this.$el;
            var that = this;
            var self = this;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            var itemsData = this.responseData.value.feedAttachEntitys;
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "dataID": myId,
                    "fbrType": 1
                }
            });
            this.attachment.render();

            this.attachment.on('toAll', function () {
                //切换到附件信息
                that.options.detail.tab.select("tab-files");
            });
            this.attachment.on('uploaded', function () {
                that.v.attachmentList.reload();
            });
            var hasOperation = undefined;
            if (self.options.customerData.value.FCustomer.ownerID == util.getCurrentEmp().employeeID) {
                hasOperation = true;
            } else {
                hasOperation = false;
            }
            
            this.contactBox = new ContactBox({
                "hasOperation": hasOperation,
                "element": $(".left-list-contacts", $el),
                "showTabContactNumEl": $(".crm-tab-btn[data-value=tab-contacts]", $('#customers-showcustomer')),
                "items": self.responseData.value.Contacts || [],
                "combineApi": "/Contact/BatchCombineContactAndFCustomer",
                "parameter": {
                    "customerID": myId,
                    "contactIDs": ""
                },
                "canEdit": true
            });
            this.contactBox.on('onNew', function () {
                self.v.addContactDialog.show({
                    customerID: self.options.customerData.value.FCustomer.customerID,
                    customerName: self.options.customerData.value.FCustomer.name
                });
            });
            this.contactBox.on('updateSuccess', function () {
                that.refresh();
            });
            that.setPublish();
            that.setFeedList();
            this.customerMapBox = new CustomerMap({
                "element": $(".crm-customer-map", $el),
                "address": that.responseData.value.FCustomer.address,
                "mapWidth": 320
            });
            var items = [];
            _.map(self.responseData.value.FCustomer.fcustomerCombineSalers, function (obj) {
                items.push(obj.employee);
            })
            this.followUpBox = new FollowUp({
                "element": $(".crm_follow_up", $el),
                "addApi": '/FCustomer/AddFCustomersCombineSalers',
                "deleteApi": "/FCustomer/DeleteFCustomerCombineSaler",
                "parameter": {
                    "customerIDs": [self.options.customerData.value.FCustomer.customerID],
                    "employeeIDs": ""
                },
                "selectColleagueS": self.options.selectColleagueS,
                "ownerID": self.options.customerData.value.FCustomer.ownerID,
                "items": items,
                "title": "联合跟进人",
                "typeName": "客户",
                "name": "联合跟进人"
            });
            
        }

    });

    module.exports = CustomerTimeline;
});