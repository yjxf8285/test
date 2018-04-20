/**
 * CRM - 线索 - tpl
 *
 * @author liuxiaofan
 * 2014-05-06
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
    var htmltpl = require('modules/crm-salesclue-list/crm-salesclue-list.html');
    var publishHelper = require('modules/publish/publish-helper');
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var AttachmentList = require('modules/crm-attachment/crm-attachment');//附件列表组件
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    var SalesclueDialog = require('modules/crm-salesclue-edit/crm-salesclue-edit');
    var OpportunityDialog = require('modules/crm-opportunity-salesclue-edit/crm-opportunity-salesclue-edit');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件

    /**
     * 线索详情页
     */
    var ShowSalesClue = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.init(); //初始化
    };
    $.extend(ShowSalesClue.prototype, {
        init: function () {
            var elEl = this.$el;
            var that = this;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.bindEvents(); //事件绑定
            this.modifyCompetitorDialog = new SalesclueDialog({
                salesclueID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyCompetitorDialog.on('success', function () {
                that.refresh();
            });
            this.modifyCompetitorDialog.v = this;
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
            var myID = this.options.queryParams.id;
            // 更新状态下拉框
            util.mnEvent($('.updatesalescluesstates-select-list', elEl), 'change', function (val, text) {
                util.api({
                    "url": '/SalesClue/UpdateSalesCluesStates', //谁的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        salesClueIDs: myID,
                        states: val
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            util.remind(1, "变更成功");
                           that.refresh();
                        }
                    }
                });

            });
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
            });
            //删除
            elEl.on('click', '.delete-btn', function () {
                that._deleteProduct();
            });
            //修改
            elEl.on('click', '.modify-btn', function () {
                that.modifyCompetitorDialog.show();
            });
            //变更负责人
            elEl.on('click', '.canchangeowner-btn', function () {
                that.selectColleagueS.show();
            });
            //新建机会
            elEl.on('click', '.create-opportunity-btn', function () {
                var meEl = $(this);
                if (!meEl.is(".crm-button-state-disabled")) {
                    that.createDialog.show();
                }
            });
            //选人事件
            this.selectColleagueS.on("selected", function (val) {
                util.api({
                    "url": '/SalesClue/UpdateSalesCluesOwnerID', //谁的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        salesClueIDs: myID,
                        ownerID: val.employeeID //int，负责人ID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            util.remind(1, "变更成功");
                            $(".owner-name", elEl).text(val.name).attr('data-ownerId', val.employeeID);//单独刷新负责人名称
                        }
                    }
                });
            });
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
            var competitorID = this.options.queryParams.id;
            //左栏附件模块
            if (!this.attachment) {
                this.attachment = new Attachment({
                    "element": crmAttachmentSimpleWarp,
                    "condition": {
                        "fbrType": 8,// 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                        "dataID": competitorID // 对手ID
                    }
                });
            }

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
            var competitorID = this.options.queryParams.id;
            if (!this.attachmentList) {
                this.attachmentList = new AttachmentList({
                    "element": crmAttachmentListSimpleWarp,
                    "condition": {
                        "fbrType": 8,// 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                        "dataID": competitorID // 对手ID
                    }
                });
            }

            this.attachmentList.on('uploaded', function () {
                that.attachment.reload();
            });
        },
        //实例化feed列表
        setFeedList: function () {
            var feedListEl = $('.crm-feed-list-warp', this.$el);
            var pagEl = $('.feed-list-pagination', this.$el);
            var searchEl = $('', this.$el);
            var dataId = this.options.queryParams.id;
            this.feedList = new FeedList({
                "element": feedListEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": {//分页配置项
                    "pageSize": 15,
                    "visiblePageNums": 3
                },
                GetBatchFilesSource: 1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                	type: 'salesclue',
                	id: dataId
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 8, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                        "dataID": dataId, //产品id
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
            var isCreateOpportunity = value.salesClue.isCreateOpportunity;//是否已创建机会
            var canChangeOwner = value.canChangeOwner;
            if (canModify) {
                $('.modify-btn', elEl).show();
            } else {
                $('.modify-btn', elEl).hide();
            }
            if (isCreateOpportunity) {
                $('.create-opportunity-btn', elEl).text('已创建机会').addClass("crm-button-state-disabled"); //表单置灰
            } else {
                $('.create-opportunity-btn', elEl).text('新建机会...').removeClass("crm-button-state-disabled");
            }
            if (canDelete) {
                $('.delete-btn', elEl).show();
            } else {
                $('.delete-btn', elEl).hide();
            }
            if (canChangeOwner) {
                $('.canchangeowner-btn', elEl).show();
            } else {
                $('.canchangeowner-btn', elEl).hide();
            }
        },
        render: function () {
            var elEl = this.$el;
            var salesClue = this.responseData.value.salesClue || {};
            var fBusinessTagRelations = salesClue.fBusinessTagRelations;
            var fBusinessTagRelationsStr = '';
            _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
            });
            $('.hd-titname', elEl).text(salesClue.name + ' ' + salesClue.company);//标题
            $('.marketing-ownername', elEl).text(salesClue.owner.name);//负责人
            $('.marketing-createtime', elEl).text(moment.unix(salesClue.createTime).format('YYYY年MMMDD日 HH:mm'));//创建时间
            $('.marketing-lasteditemployeename', elEl).text(salesClue.lastEditEmployee.name);//最后修改人
            $('.marketing-lastedittime', elEl).text(moment.unix(salesClue.lastEditTime).format('YYYY年MMMDD日 HH:mm'));//最后修改时间
            $('.marketing-name', elEl).text(salesClue.name);//string，姓名(必填，长度100)
            $('.marketing-company', elEl).text(salesClue.company);//string，公司名称(非必填，长度200)
            //状态（未处理：1；已联系：2；关闭：3）
            switch (salesClue.states) {
                case 1:
                    salesClue.states = '未处理';
                    break;
                case 2:
                    salesClue.states = '已联系';
                    break;
                case 3:
                    salesClue.states = '关闭';
                    break;
            }
            $('.marketing-states', elEl).text(salesClue.states);//状态
            $('.updatesalescluesstates-select-list .mn-select-title', elEl).text(salesClue.states);//状态
            util.mnSetter($('.mn-radio-box', elEl), salesClue.gender);// string，性别(非必填，长度1)
            $('.marketing-post', elEl).text(salesClue.post);// string，职务(非必填，长度50)
            $('.marketing-tel', elEl).text(salesClue.tel);// string，电话(非必填，长度100)
            $('.marketing-mobile', elEl).text(salesClue.mobile);// string，手机(非必填，长度100)
            $('.marketing-email', elEl).text(salesClue.email);//string，电子邮件(非必填，长度100)
            $('.marketing-province', elEl).text(salesClue.province);//string，省份(非必填，长度100)
            $('.marketing-weibo', elEl).text(salesClue.weibo);//string，微博(非必填，长度100)
            $('.marketing-wechat', elEl).text(salesClue.weChat);//string，微信(非必填，长度100)
            $('.marketing-address', elEl).text(salesClue.address);// string，地址(非必填，长度500)
            $('.marketing-postcode', elEl).text(salesClue.postCode);//string，邮编(非必填，长度100)
            $('.marketing-qq', elEl).text(salesClue.qq);//string，QQ(非必填，长度100)
            $('.marketing-description', elEl).text(salesClue.description);// string，描述(非必填，长度不限)
            $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);

            this.createDialog = new OpportunityDialog({
                salesClueID: salesClue.salesClueID,
                customerName: salesClue.company || '',
                contactName: salesClue.name || ''
            });
            this.createDialog.v = this;

            this.showFnBtn();

        },
        load: function () {
            var elEl = this.$el;
            var salesClueID = this.options.queryParams.id;
            var that = this;
            util.api({
                "url": '/SalesClue/GetSalesClueDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    salesClueID: salesClueID, //int，ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                        that.setCrmAttachment();//实例化左栏附件
                        that.setAttachmentList();//实例化附件列表

                    }else{
                        util.alert(responseData.message, function() {
                            that._backToListPage(); //不成功就返回到列表
                        },{"zIndex": 3000});
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

            //            var queryParams = this.options.queryParams;
            //            var backUrl = decodeURIComponent(queryParams.returnUrl);
            //            backUrl += '/=/param-' + encodeURIComponent(JSON.stringify(queryParams));
            //            tpl.navRouter.navigate(backUrl, {trigger: true});//手动跳转页面
            //            tpl.event.trigger('dataUpdate');
        },
        //删除
        _deleteProduct: function () {
            var that = this;
            var salesClueID = this.responseData.value.salesClue.salesClueID;
            util.confirm('你确定要删除该销售线索吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/SalesClue/DeleteSalesClues',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "salesClueIDs": salesClueID
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
                "title": "新建线索记录",
                "placeholder": "发布新线索记录",
                "type": "feed",
                "condition": {
                    "fileInfos": [],// List<ParamValue<int, string, int, string>>，附件
                    "feedContent": "",// string，Feed内容
                    "fbrType": 8,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
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
            var topMenuTabEl = $('.tab-menu', this.$el);
            this.tab = new Tab({
                "element": topMenuTabEl, //容器
                "container": this.$el, //大父级容器
                "items": [
                    {value: "tab-time-line", text: "时间线"},
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

        },
        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        }
    });


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showSalesClue = new ShowSalesClue({
            element: tplEl,
            queryParams: queryParams
        });
        showSalesClue.load();
    };

});