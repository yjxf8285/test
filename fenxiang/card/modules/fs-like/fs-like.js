/**
 * 我的赞列表
 *
 * 遵循seajs module规范
 * @author Liuxf
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;

    /* 引用文件 */
    var util = require('util'); //工具箱
    var Pagination = require('uilibs/pagination'); //分页组件
    var moment = require('moment'); //时间组件
    var likelistTpl = require('./fs-like.html');
    var likelistStyle = require('./fs-like.css');

    var contactData = util.getContactData(),
        currentUserData = contactData["u"]; //自己
    /* 公共声明 */
    likelistTpl = $(likelistTpl);

    /**
     * 我的赞列表MVC定义
     * @param opts
     * @constructor
     */
    var LikelistM = Backbone.Model.extend({});
    var LikelistC = Backbone.Collection.extend({
        model: LikelistM,
        // url:'/attach_html/getImgImgFilesOfIReceive',
        sync: function (method, model, options) {
            var data = options.data || {};
            options.data = _.extend({
                "pageSize": 10,
                "pageNumber": 1
            }, data);
            Backbone.sync('read', model, options);
        },
        parse: function (responseData) {
            /* 预处理 */
            var items = responseData.value.items;

            var newItems, fmfeedType, feedTypeDescriptionTop;
            if (responseData.success) {

                newItems = util.deepClone(responseData.value.feedLikes);
                _.each(newItems, function (item) {
                    var likeType = item.likeType || 1;
                    item.sendername = item.employee && item.employee.name || '已删除用户'; //发出赞的人
                    item.profileImage = util.getAvatarLink(item.employee && item.employee.profileImage, 2); //发出赞的人头像
                    item.employeeID = item.employee && item.employee.employeeID; //发出赞的人id
                    item.feedSenderName = '<a href="Index#profile/=/empid-' + item.feedSender.employeeID + '">' + item.feedSender.name + '</a>'; //发feed的人
                    // item.feedSenderName = item.feedSender.name; //发feed的人无连接

                    item.feedemployeeID = item.feedSender.employeeID; //发feed的人id

                    if (currentUserData.employeeID == item.feedemployeeID) {
                        item.feedSenderName = '我';
                    }
                    if (currentUserData.employeeID == item.employeeID) {
                        item.sendername = '我';
                    }


                    /* 格式化feed类型 */


                    if (likeType == 2) {//1是feed，2是回复
                        fmfeedType = '回复';
                        feedTypeDescriptionTop = '回复';
                        if (currentUserData.employeeID == item.feedReplySender.employeeID) {
                            item.feedReplySender.name = '我';
                            item.feedSenderName = item.feedReplySender.name;
                        } else {
                            item.feedSenderName = '<a href="Index#profile/=/empid-' + item.feedReplySender.employeeID + '">' + item.feedReplySender.name + '</a>'; //发回复的人
                        }


                    } else {
                        fmfeedType = util.getFeedTypeName(item.feedType);
                        feedTypeDescriptionTop = '工作';
                    }
                    item.feedTypeDescription = fmfeedType;
                    item.feedTypeDescriptionTop = feedTypeDescriptionTop;
                    item.likeTime = item.likeTime;
                    item.likeTime = util.getDateSummaryDesc(moment.unix(item.likeTime), moment.unix(responseData.serviceTime), 2);
                    item.sourceDescription = ('，来自' + item.sourceDescription) || '';
                    if (item.source == 1) {
                        item.sourceDescription = '';
                    }
                });
            } else {
                newItems = [];
            }
            return newItems;
        }
    });
    var LikelistV = Backbone.View.extend({
        tagName: "div",
        className: "fs-likelist-item card-border-rad",
        initialize: function () {
            var templatepath = likelistTpl.filter('.fs-likelist-send-item-tpl').html();
            this.template = _.template(templatepath);
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    /**
     * 员工列表定义
     * @param opts
     * @constructor
     */
    var Likelist = function (opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 20,
                "visiblePageNums": 7
            },
            "listPath": "/attach_html/getAttachImgFilesOfIReceive", //默认附件列表请求地址为我收到的附件列表地址
            "defaultRequestData": {}, //默认请求数据
            "searchOpts": {
                "inputSelector": null, //搜索输入框
                "btnSelector": null //搜索按钮
            },
            "listCb": FS.EMPTY_FN, //list请求后的回调
            "listEmptyText": "暂无记录" //列表记录为空的文字提示
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.pagEl = $(opts.pagSelector);
        this.pagination = null; //分页组件
        this.tempRequestData = {}; //通过load或者reload覆盖的请求数据
        this.init();
    };

    _.extend(Likelist.prototype, {
        "init": function () {
            var that = this,
                opts = this.opts;
            var elEl = this.element;
            var list;

            //设置list collection
            list = new LikelistC();
            //监听collection add事件
            list.on('add', function (m, c, opts) {
                var itemV;
                itemV = new LikelistV({
                    "model": m
                }).render();
                itemV.$el.data('itemV', itemV).appendTo(elEl);
            });
            this.list = list;
            list.opts = opts;
            // 初始化分页组件

            this.pagination = new Pagination(_.extend({
                "element": this.pagEl
            }, opts.pagOpts));
            this.pagination.on('page', function (pageNumber) {
                //清空列表
                that.empty();
                //请求数据
                that.fetch();
            });
            //渲染分页组件
            this.pagination.render();
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                // this._searchBarInit();
            }
            //初始化列表结果空白提示
            this._initListEmptyTip();
        },
        /**
         * 搜索条初始化，显示查询总信息和返回按钮
         * @private
         */
        _searchBarInit: function () {
            var that = this,
                opts = this.opts,
                searchOpts = opts.searchOpts;
            var elEl = this.element,
                searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                searchBtnEl = $(searchOpts.btnSelector), //搜索按钮
                barEl;
            barEl = $('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);
            //创建快速关闭按钮
            var searchEmptyEl = $('<span class="empty-h">x</span>'),
                searchInputWEl = $('<span class="list-search-input-wrapper"></span>');
            searchInputEl.wrap(searchInputWEl);
            searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
            searchEmptyEl.hide().appendTo(searchInputWEl);

            //搜索输入框enter提交事件注册和快速清空按钮
            searchInputEl.keydown(function (evt) {
                if (evt.keyCode == 13) { //监听回车按键
                    searchBtnEl.click();
                }
            }).keyup(function () {
                var val = _.str.trim($(this).val());
                if (val.length > 0) {
                    searchEmptyEl.show();
                    searchInputEl.addClass('with-input-value');
                } else {
                    searchEmptyEl.hide();
                    searchInputEl.removeClass('with-input-value');
                }
            });
            searchEmptyEl.click(function () {
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
            });
            //点击返回到查看全部列表
            barEl.on('click', '.back-l', function (evt) {
                that.reload({
                    "keyword": ""
                });
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                evt.preventDefault();
            });
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState: function (requestData, responseData) {
            var elEl = this.element,
                barEl = $('.list-search-bar', elEl),
                numEl = $('.num', barEl);
            if (!requestData.isFirstChar && requestData.keyword.length > 0) {
                if (responseData.success) {
                    numEl.text(responseData.value.totalCount);
                    barEl.show();
                    return;
                }
            }
            barEl.hide();
            return;
        },
        /**
         * 初始化list记录为空的tip
         * @private
         */
        _initListEmptyTip: function () {
            var elEl = this.element,
                emptyEl = $('<div class="list-empty-tip"></div>');
            var opts = this.opts,
                emptyText = opts.listEmptyText;
            emptyEl.html('<img src="' + FS.BLANK_IMG + '" alt="loading" class="icon-empty" />&nbsp;&nbsp;<span class="empty-text">' + emptyText + '</span>');
            emptyEl.appendTo(elEl);
        },
        /**
         * 列表结果记录集为空的提示状态
         * @private
         */
        _updatelistStatus: function (responseData) {
            var elEl = this.element,
                emptyEl = $('.list-empty-tip', elEl);
            var totalCount;
            if (responseData.success) {
                totalCount = responseData.value.totalCount;
                if (totalCount == 0) { //列表结果为空，提示空提示信息
                    emptyEl.show();
                } else {
                    emptyEl.hide();
                }
            }
        },
        /**
         *
         * @param config
         */
        fetch: function () {
            var that = this;
            var opts = this.opts;
            var list = this.list;
            var pagination = this.pagination;
            var requestData = _.extend({
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber'),
                "sinceID": 0,
                "maxID": 0
            });
            // var requestData = _.extend({
            // 	"pageSize": 10,
            // 	"pageNumber": 1,
            // 	"sinceID": 0,
            // 	"maxID": 0
            // });
            // 加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData = _.extend(requestData, this.tempRequestData);
            this.tempRequestData = {}; //用完重置为空
            // 打开loading提示
            this.showLoading();
            this.list.fetch({
                "url": opts.listPath,
                "data": requestData,
                "success": function (c, responseData) {
                    var dataRoot;
                    if (responseData.success) {
                        dataRoot = responseData.value;
                        //设置分页总记录数
                        //if(pagination.get('totalSize')==-1){
                        pagination.setTotalSize(dataRoot.totalCount);
                        //}
                        //更新提示搜索信息
                        // that._updateSearchBarState(requestData, responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
                        //参数回调
                        opts.listCb.call(that, responseData);
                        //关闭loading提示
                        that.hideLoading();
                    }
                }
            });
        },
        "showLoading": function () {
            var loading = this.loading,
                elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length == 0) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo(elEl);
                loadingEl.html('<span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
                /*loading = new Spin({
                 "color": "#0082CB",
                 "length": 5, // The length of each line
                 "width": 2,
                 "radius": 3,
                 "top": 5
                 }).spin($('.icon-loading', loadingEl).get(0));*/
                //设置实例引用
                this.loading = loading;
            }
            loadingEl.show();
        },
        "hideLoading": function () {
            var elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 加载第一页
         */
        "load": function (requestData) {
            this.tempRequestData = requestData;
            this.pagination.jump(1);
        },
        "reload": function (requestData) {
            this.load(requestData);
        },
        "empty": function () {
            var elEl = this.element,
                itemEl = $('.fs-likelist-item', elEl);
            itemEl.each(function () {
                var meEl = $(this),
                    itemV = meEl.data('itemV');
                //清除itemV
                itemV.remove();
                meEl.removeData(); //清空所有data数据
            });
            elEl.empty();
        },
        "destroy": function () {
            //清空list
            this.list = null;
            this.pagination.destroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消pagination绑定
            this.pagination = null;
            this.tempRequestData = {};
            this.element = null;
        }
    });
    module.exports = Likelist;
});