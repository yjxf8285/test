/**
 * CRM - 对手详情 - tpl
 *
 * @author liuxiaofan
 * 2014-03-28
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
    var CompetitorDialog = require('modules/crm-competitor-edit/crm-competitor-edit');
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件

    /**
     * 对手详情页
     */
    var Showcompetitor = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.init(); //初始化
    };
    $.extend(Showcompetitor.prototype, {
        init: function () {
            var elEl = this.$el;
            var that = this;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.bindEvents(); //事件绑定
            this.modifyCompetitorDialog = new CompetitorDialog({
                competitorID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyCompetitorDialog.on('success', function(){
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
            var competitorID = this.options.queryParams.id;
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
            });
            //删除
            elEl.on('click', '.delete-product-btn', function () {
                that._deleteProduct();
            });
            //修改
            elEl.on('click', '.modify-product-btn', function () {
                that.modifyCompetitorDialog.show();
            });
            //变更负责人
            elEl.on('click', '.canchangeowner-product-btn', function () {
                that.selectColleagueS.show();
            });
            //选人事件
            this.selectColleagueS.on("selected", function (val) {
                util.api({
                    "url": '/Competitor/UpdateCompetitorOwnerID', //谁的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        competitorID: competitorID,// int，竞争对手ID
                        ownerID: val.employeeID //int，负责人ID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            util.remind(1, "变更成功");
                            that.load();
                        }
                    }
                });
            });
        },
        //获取对手标签的相关数据
        _getTagsDatas: function () {
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
        //实例化输入框
        setPublish: function () {
            var that=this;
            var elEl=this.$el;
            var myId = this.options.queryParams.id;
            this.feedpublish = new Publish({
                "element":$('.feed-submit-box-warp',elEl),
                "placeholder":"发布新竞争对手记录",
                "title":"新建竞争对手记录",
                "type":"feed",
                "condition":{
                    "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件
                    "feedContent":"",// string，Feed内容
                    "fbrType":5,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                    //4，与产品关联，dataID：产品ID；
                    //5,与对手关联，dataID：对手ID；
                    //6，与合同关联，dataID：合同ID；
                    //7，与市场活动关联，dataID：市场活动ID；
                    //8，销售线索关联，dataID：线索ID
                    "dataID":myId// int，数据ID
                },
                "display":["picture","attach", "at", "topic"]
            });
            this.feedpublish.on('post',function(feedID){
                //                that.feedList.unshiftFromFeedId(feedID);//请求一条数据
                that.feedList.load();
            });
        },
        //实例化左栏附件
        setCrmAttachment: function () {
            var that = this;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            var competitorID = this.options.queryParams.id;
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "fbrType": 5,//  1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": competitorID // 对手ID
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
                    "fbrType": 5,//  1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
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
            var dataId = this.options.queryParams.id;
            this.feedList = new FeedList({
                "element": feedListEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": {//分页配置项
                    "pageSize": 15,
                    "visiblePageNums": 3
                },
                GetBatchFilesSource:1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                	type: 'competitor',
                	id: dataId
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 5, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
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
                $('.canchangeowner-product-btn-r', elEl).show();
            } else {
                $('.canchangeowner-product-btn-r', elEl).hide();
            }
        },
        render: function () {
            var elEl = this.$el;
            var competitor = this.responseData.value.competitor;
            var name = competitor.name;//名称
            var description = competitor.description;//描述
            var creatorName = competitor.creator.name;//创建人
            var ownerName = competitor.owner.name;//负责人
            var advantage = competitor.advantage;//优势
            var disadvantage = competitor.disadvantage;//劣势
            var strategies = competitor.strategies;//应对策略
            var salesSituation = competitor.salesSituation;//销售分析
            var marketingSituation = competitor.marketingSituation;//市场情况
            var contactInfo = competitor.contactInfo;//联系方式
            var createTime = moment.unix(competitor.createTime).format('YYYY年MMMDD日 HH:mm');
            var lastEditEmployeeName = competitor.lastEditEmployee.name;//最后修改人
            var lastEditTime = moment.unix(competitor.lastEditTime).format('YYYY年MMMDD日 HH:mm');
            var fBusinessTagRelations = competitor.fBusinessTagRelations;
            var fBusinessTagRelationsStr = '';

            _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
            });
            $('.hd-titname', elEl).text(name);
            $('.product-name', elEl).text(name);
            $('.owner-name', elEl).text(ownerName);
            $('.baseinfo-advantage', elEl).text(advantage);
            $('.baseinfo-disadvantage', elEl).text(disadvantage);
            $('.baseinfo-strategies', elEl).text(strategies);
            $('.baseinfo-salessituation', elEl).text(salesSituation);
            $('.baseinfo-marketingsituation', elEl).text(marketingSituation);
            $('.baseinfo-contactinfo', elEl).text(contactInfo);
            $('.baseinfo-description', elEl).text(description);
            $('.product-creatorname', elEl).text(ownerName);
            $('.product-createtime', elEl).text(createTime);
            $('.product-lasteditemployeename', elEl).text(lastEditEmployeeName);
            $('.product-lastedittime', elEl).text(lastEditTime);
            $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
            this.showFnBtn();

        },
        load: function () {
            var elEl = this.$el;
            var competitorID = this.options.queryParams.id;
            var that = this;
            util.api({
                "url": '/Competitor/GetCompetitorDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    competitorID: competitorID, //int，产品ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                    }
                }
            });
        },
        refresh:function(){
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
        //删除产品
        _deleteProduct: function () {
            var that = this;
            var competitorIDs = this.responseData.value.competitor.competitorID;
            util.confirm('你确定要删除该竞争对手吗？删除后将不可恢复。', '', function () {
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
            this.setCrmAttachment();//实例化左栏附件
            this.setAttachmentList();//实例化附件列表
        },
        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        }
    });
    /**
     * 修改标签的弹框
     */
        /*
    var ModifycompetitorDialog = Dialog.extend({
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
            var result = ModifycompetitorDialog.superclass.render.apply(this, arguments);
            this.setupDoms(); //设置DOM
            this.setupComponent(); //设置组件
            return result;
        },
        "hide": function () {
            var result = ModifycompetitorDialog.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "show": function () {
            var result = ModifycompetitorDialog.superclass.show.apply(this, arguments);
            this.showDefautData();
            return result;
        },
        //重置回默认值
        "showDefautData": function () {
            var elEl = this.element;
            var competitor = this.v.responseData.value.competitor;
            var name = competitor.name;//名称
            var description = competitor.description;//描述
            var creatorName = competitor.creator.name;//创建人
            var ownerName = competitor.owner.name;//负责人
            var advantage = competitor.advantage;//优势
            var disadvantage = competitor.disadvantage;//劣势
            var strategies = competitor.strategies;//应对策略
            var salesSituation = competitor.salesSituation;//销售分析
            var marketingSituation = competitor.marketingSituation;//市场情况
            var contactInfo = competitor.contactInfo;//联系方式



            $('.competitor-name', elEl).val(name);
            $('.competitor-advantage', elEl).val(advantage);
            $('.competitor-disadvantage', elEl).val(disadvantage);
            $('.competitor-strategies', elEl).val(strategies);
            $('.competitor-salesSituation', elEl).val(salesSituation);
            $('.competitor-marketingSituation', elEl).val(marketingSituation);
            $('.competitor-contactInfo', elEl).val(contactInfo);
            $('.competitor-description', elEl).val(description);
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
            var competitorID = this.v.responseData.value.competitor.competitorID;
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
                "url": '/Competitor/UpdateCompetitor',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    competitorID: competitorID, // int，竞争对手ID
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
                        that.v.load();//刷新列表
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
    */
    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showcompetitor = new Showcompetitor({
            element: tplEl,
            queryParams: queryParams
        });
        showcompetitor.load();
    };

});