/**
 * CRM - 市场详情 - tpl
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
    var SalesclueDialog = require('modules/crm-salesclue-edit/crm-salesclue-edit');
    var MarketingDialog = require('modules/crm-marketing-edit/crm-marketing-edit');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    var FollowUp = require('modules/crm-follow-up/crm-follow-up');//联合跟进人

    var cur_state;//状态选择值
    /**
     * 市场活动详情页
     */
    var ShowMarketing = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.init(); //初始化
    };
    $.extend(ShowMarketing.prototype, {
        init: function () {
            var elEl = this.$el;
            var that = this;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.setFeedList();//实例化feed列表

            this.setAttachmentList();//实例化附件列表

            this.bindEvents(); //事件绑定
            this.createSalesclueDailog = new SalesclueDialog({
                marketingEventID: this.options.queryParams && this.options.queryParams.id
            });
            this.createSalesclueDailog.v = this;
            this.modifyCompetitorDialog = new MarketingDialog({
                marketingEventID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyCompetitorDialog.v = this;
            this.modifyCompetitorDialog.on('success', function () {
                that.refresh();
            });
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
            var myId = this.options.queryParams.id;
            var changeState = function (val, text) {
                util.confirm('是否确定要将当前活动的【状态】变更为【' + text + '】吗？', '', function () {
                    cur_state = util.mnGetter($('.updatestates-select-list', elEl));
                    util.api({
                        "url": '/MarketingEvent/UpdateMarketingEventsStates', //谁的接口地址
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            marketingEventIDs: myId,
                            states: val
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                //成功之后
                                //                            util.remind(1, "变更成功");
                                that.load();
                            }
                        }
                    });
                }, {
                    onCancel: function () {
                        cancel();
                    }
                });
            };
            var cancel = function () {
                util.mnOffEvent($('.updatestates-select-list', elEl), 'change', changeState);
                util.mnSetter($('.updatestates-select-list', elEl), cur_state);
                util.mnEvent($('.updatestates-select-list', elEl), 'change', changeState);
            };
            // 更新状态下拉框
            util.mnEvent($('.updatestates-select-list', elEl), 'change', changeState);
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
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
                that.selectColleagueS.show();
            });
            //新建线索
            elEl.on('click', '.create-salesclue-btn', function () {
                that.createSalesclueDailog.show();
            });
            //关注按钮
            elEl.on('click', '.follow-switch-btn', function (e) {
                that._switchFollow(e);
            });
            //变更负责人
            this.selectColleagueS.on("selected", function (val) {
                var lastOwnerId = that.responseData.value.marketingEvent.owner.employeeID;
                util.confirm('你确定要将市场活动的负责人变更为' + val.name + '吗？', '', function () {
                    util.api({
                        "url": '/MarketingEvent/UpdateMarketingEventsOwnerID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            marketingEventIDs: myId, //List<int>，销售线索ID集合
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
                                        itemResultStr = '变更市场活动的负责人失败，原因：' + describe + '</br>';
                                        util.alert(itemResultStr);
                                    } else {
                                        util.remind(1, "变更成功");
                                        //                                        that.refresh(); //刷新  不能刷新页面因为负责人变了就没有权限看此页面
                                        $(".owner-name", elEl).text(val.name);//单独刷新负责人名称
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
            var myId = this.options.queryParams.id;

            if ($el.hasClass('following')) {
                //取消关注
                util.api({
                    "url": '/MarketingEvent/MarketingEventCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { marketingEventID: myId },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('following').addClass('no-follow').text('关注')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/MarketingEvent/MarketingEventFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { marketingEventID: myId },
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
            var myId = this.options.queryParams.id;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "dataID": myId,
                    "fbrType": 7
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
            var competitorID = this.options.queryParams.id;
            this.attachmentList = new AttachmentList({
                "element": crmAttachmentListSimpleWarp,
                "condition": {
                    "fbrType": 7,// 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": competitorID // 对手ID
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
            var dataID = this.options.queryParams.id;
            this.feedList = new FeedList({
                "element": feedListEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": {//分页配置项
                    "pageSize": 15,
                    "visiblePageNums": 3
                },
                GetBatchFilesSource: 1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                    type: 'marketing',
                    id: dataID
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 7, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                        "dataID": dataID, //
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
            var marketingEvent = this.responseData.value.marketingEvent || null;
            var fBusinessTagRelations, fBusinessTagRelationsStr = '';
            var followBtn = $('.follow-switch-btn', elEl);
            if (marketingEvent) {
                fBusinessTagRelations = marketingEvent.fBusinessTagRelations;
                fBusinessTagRelationsStr = '';
                _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                    var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                    var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                    fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
                });
                $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
                if (marketingEvent.isFollow) {
                    followBtn.addClass('following').text('已关注');
                } else {
                    followBtn.addClass('no-follow').text('关注');
                }
                $('.hd-titname', elEl).text(marketingEvent.name);//标题
                $('.jdata-ownername', elEl).text(marketingEvent.owner.name);//负责人
                $('.jdata-createtime', elEl).text(moment.unix(marketingEvent.createTime).format('YYYY年MMMDD日 HH:mm'));//创建时间
                $('.jdata-lasteditemployeename', elEl).text(marketingEvent.lastEditEmployee.name);//最后修改人
                $('.jdata-lastedittime', elEl).text(moment.unix(marketingEvent.lastEditTime).format('YYYY年MMMDD日 HH:mm'));//最后修改时间
                $('.jdata-name', elEl).text(marketingEvent.name);//string，姓名(必填，长度100)
                $('.jdata-company', elEl).text(marketingEvent.company);//string，公司名称(非必填，长度200)

                //                util.mnSetter($('.updatestates-select-list', elEl), marketingEvent.states);//设置下拉框状态
                cur_state = marketingEvent.states;
                switch (marketingEvent.states) {
                    case 1:
                        marketingEvent.states = '已计划';
                        break;
                    case 2:
                        marketingEvent.states = '进行中';
                        break;
                    case 3:
                        marketingEvent.states = '已结束';
                        break;
                    case 4:
                        marketingEvent.states = '终止';
                        break;
                }
                $('.updatestates-select-list .mn-select-title', elEl).text(marketingEvent.states)
                $('.jdata-states', elEl).text(marketingEvent.states);//状态

                util.mnSetter($('.mn-radio-box', elEl), marketingEvent.gender);// string，性别(非必填，长度1)
                $('.jdata-expectedincome', elEl).text('￥' + _.str.numberFormat(parseFloat(marketingEvent.expectedIncome), 2));
                $('.jdata-actualincome', elEl).text('￥' + _.str.numberFormat(parseFloat(marketingEvent.actualIncome), 2));
                $('.jdata-begindate', elEl).text(moment.unix(marketingEvent.beginDate).format('YYYY-MM-DD'));
                $('.jdata-enddate', elEl).text(moment.unix(marketingEvent.endDate).format('YYYY-MM-DD'));
                $('.jdata-location', elEl).text(marketingEvent.location);
                $('.jdata-expectedcost', elEl).text(_.str.numberFormat(parseFloat(marketingEvent.expectedCost), 2));
                $('.jdata-actualcost', elEl).text(_.str.numberFormat(parseFloat(marketingEvent.actualCost), 2));
                $('.jdata-expectedincome', elEl).text(_.str.numberFormat(parseFloat(marketingEvent.expectedIncome), 2));
                $('.jdata-actualincome', elEl).text(_.str.numberFormat(parseFloat(marketingEvent.actualIncome), 2));

                $('.jdata-l', elEl).text(marketingEvent.marketingPlan);
                $('.jdata-executiondescription', elEl).text(marketingEvent.executionDescription);
                $('.jdata-summary', elEl).text(marketingEvent.summary);
                $('.jdata-effect', elEl).text(marketingEvent.effect);
                $('.jdata-description', elEl).text(marketingEvent.description);

            }
            this.showFnBtn();


        },
        load: function () {
            var elEl = this.$el;
            var id = this.options.queryParams.id;
            var that = this;
            util.api({
                "url": '/MarketingEvent/GetMarketingEventDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    marketingEventID: id, //int，ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                        // 联合跟进人
                        var items = [];
                        var marketingParticipants = responseData.value.marketingEvent.marketingParticipants;
                        _.each(marketingParticipants, function (item) {
                            items.push(item.employee);
                        });
                        if (!that.followUpBox) {
                            that.followUpBox = new FollowUp({
                                "element": $(".crm_follow_up", elEl),
                                "addApi": "/MarketingEvent/AddMarketingParticipants",
                                "deleteApi": "/MarketingEvent/DeleteMarketingParticipants",
                                "parameter": {
                                    "marketingEventID": id,
                                    "employeeIDs": ""
                                },
                                "selectColleagueS": that.selectColleagueS,
                                "items": items,
                                "ownerID": responseData.value.marketingEvent.ownerID,
                                "btnAddTitle": "联合参与人",
                                "addWinTitle": "选择联合参与人",
                                "title": "联合参与人",
                                "typeName": "市场",
                                "name": "联合参与人"
                            });
                        }
                    }else {
                        util.alert(responseData.message, function () {
                            that._backToListPage();//不成功就返回到列表
                            return;
                        },{  "zIndex": 3000});

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
        _delete: function () {
            var that = this;
            var myId = this.options.queryParams.id;
            util.confirm('你确定要删除该市场活动吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/MarketingEvent/DeleteCompetitors',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "marketingEventIDs": myId
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
                "title": "新建市场活动记录",
                "placeholder": "发布新市场活动记录",
                "type": "feed",
                "condition": {
                    "fileInfos": [],// List<ParamValue<int, string, int, string>>，附件
                    "feedContent": "",// string，Feed内容
                    "fbrType": 7,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
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
            if (!this.tab) {
                this.tab = new Tab({
                    "element": topMenuTabEl, //容器
                    "container": this.$el, //大父级容器
                    "items": [
                        {value: "tab-time-line", text: "时间线"},
                        {value: "tab-base-info", text: "基本信息"},
                        {value: "tab-files", text: "附件"}
                    ]
                });
            }

            //            util.autoAdjustPos($('.flaot-left-menu', this.$el));//浮动元素（滚动到元素位置贴到顶部固定）
            this.setCrmAttachment();//实例化左栏附件
            //实例化选人组件
            if (!this.selectColleagueS) {
                this.selectColleagueS = new SelectColleague({
                    "isMultiSelect": false,
                    "title": '请选择负责人'
                });
            }

            this.setPublish();
        },
        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        }
    });


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showSalesClue = new ShowMarketing({
            element: tplEl,
            queryParams: queryParams
        });
        showSalesClue.load();
    };

});