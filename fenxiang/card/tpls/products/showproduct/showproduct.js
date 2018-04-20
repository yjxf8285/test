/**
 * CRM - 产品 - tpl
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
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var publishHelper = require('modules/publish/publish-helper');
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var AttachmentList = require('modules/crm-attachment/crm-attachment');//附件列表组件
    var ProductDialog = require('modules/crm-product-edit/crm-product-edit');


    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    /**
     * 产品详情页
     */
    var ShowProduct = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.init(); //初始化
    };
    $.extend(ShowProduct.prototype, {
        init: function () {
            var that = this;
            var elEl = this.$el;
            this.bindEvents(); //事件绑定
            this._getProductTagsDatas();
            this.setupComponent();//设置组件

            this.modifyProductDialog = new ProductDialog({
                productID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyProductDialog.on('success', function(){
                that.refresh();
            });
            this.modifyProductDialog.v = this;
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
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面
            });
            //删除产品
            elEl.on('click', '.delete-product-btn', function () {
                that._deleteProduct();
            });
            //修改产品
            elEl.on('click', '.modify-product-btn', function () {
                that.modifyProductDialog.show();
            });
        },
        //获取产品标签的相关数据
        _getProductTagsDatas: function () {
            var crmData = util.getCrmData();//获取CRM缓存数据
            var fBusinessTags = crmData.fBusinessTags;//标签数据
            var functionPermissions = crmData.functionPermissions;//权限数据
            var allProductTags = [];//产品标签数据
            var productLineTagsForList = [//产品线数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === 5) {
                    allProductTags.push(fBusinessTag);
                    if (fBusinessTag.systemTagCode === 110) {
                        _.each(fBusinessTag.options, function (option, index) {
                            productLineTagsForList.push({
                                "text": option.name,
                                "value": option.fBusinessTagOptionID
                            });
                        });
                    }
                }
            });
            this.allProductTags = allProductTags;//产品标签数据，新建标签的窗口需要用到
            this.productLineTagsForList = productLineTagsForList;//产品线下拉列表需要数据保存起来
            this.functionPermissions = functionPermissions;//权限数据
        },
        //实例化输入框
        setPublish: function () {
            var that=this;
            var elEl=this.$el;
            var myId = this.options.queryParams.id;

           this.feedpublish = new Publish({
                "element":$('.feed-submit-box-warp',elEl),
                "title":"新建产品记录",
                "placeholder":"发布新产品记录",
                "type":"feed",
                "condition":{
                    "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件
                    "feedContent":"",// string，Feed内容
                    "fbrType":4,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
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
            var myId = this.options.queryParams.id;
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "dataID": myId,
                    "fbrType": 4
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
            var productID = this.options.queryParams.id;
            this.attachmentList = new AttachmentList({
                "element": crmAttachmentListSimpleWarp,
                "condition": {
                    "fbrType": 4,//  1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": productID // 产品ID
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
//                "fbrType": 4, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                GetBatchFilesSource:1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                crmParam: {
                	type: 'product',
                	id: dataId
                },
                "listPath": "/CrmFeed/GetFeeds",
                "defaultRequestData": function () {
                    return {
                        "fbrType": 4, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
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
        },
        render: function () {
            var elEl = this.$el;
            var product = this.responseData.value.product;
            var name = product.name;
            var unit = product.unit;
            var description = product.description;
            var unitAmount = _.str.numberFormat(parseFloat(product.unitAmount), 2);//加小数点加逗号product.unit;
            var creatorName = product.creator.name;
            var createTime = moment.unix(product.createTime).format('YYYY年MMMDD日 HH:mm');
            var lastEditEmployeeName = product.lastEditEmployee.name;
            var lastEditTime = moment.unix(product.lastEditTime).format('YYYY年MMMDD日 HH:mm');
            var fBusinessTagRelations = product.fBusinessTagRelations;
            var fBusinessTagRelationsStr = '';

            _.each(fBusinessTagRelations, function (fBusinessTagRelation, index) {
                var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><span class="input-wrapper">' + fBusinessTagOptionName + '</span></li>';
            });
            $('.hd-titname', elEl).text(name);
            $('.product-name', elEl).text(name);
            $('.product-unit', elEl).text(unit);
            $('.product-unitamount', elEl).text(unitAmount);
            $('.product-description', elEl).text(description);
            $('.product-creatorname', elEl).text(creatorName);
            $('.product-createtime', elEl).text(createTime);
            $('.product-lasteditemployeename', elEl).text(lastEditEmployeeName);
            $('.product-lastedittime', elEl).text(lastEditTime);
            $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
            this.showFnBtn();

        },
        load: function () {
            var elEl = this.$el;
            var productID = this.options.queryParams.id;
            var that = this;
            util.api({
                "url": '/Product/GetProductDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    productID: productID, //int，产品ID
                    attachPageNum: 6//int，附件显示条数(写死6条)
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
        //删除产品
        _deleteProduct: function () {
            var that = this;
            var productIDs = this.responseData.value.product.productID;
            util.confirm('你确定要删除该产品吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/Product/DeleteProducts',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "productIDs": productIDs
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
            this.setPublish();//实例化输入框
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
        var showProduct = new ShowProduct({
            element: tplEl,
            queryParams: queryParams
        });
        showProduct.load();
    };

});