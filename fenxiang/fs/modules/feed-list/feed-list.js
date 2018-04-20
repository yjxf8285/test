/**
 * feedlist 入口
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        c = require('modules/feed-list/feed-list-c'),
        v = require('modules/feed-list/feed-list-v'),
        FsLazyload = require('modules/fs-lazyload/fs-lazyload'),
        Pagination = require('uilibs/pagination'),
        moment = require('moment'),
        Spin = require('spin');
    var FeedList = function (opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector,设置成false表示不带分页
            "pagOpts": { //分页配置项
                "pageSize": 45,
                "totalSize": -1,
                "visiblePageNums": 7
            },
            "itemReadyCb": FS.EMPTY_FN,  //item ready后callback
            "itemDeleteCb":FS.EMPTY_FN, //item delete后callback
            "itemReceiptCb":FS.EMPTY_FN,    //item receipt后callback
            "itemWorktodoCb":FS.EMPTY_FN,   //item worktodo后callback
            "feedRemindClickCb":void (0), //新消息提醒点击回调
            "withFeedRemind": false, //默认不开启new feed提示
            "withLazyload": false,    //是否开启懒加载，默认不开启
            "withArchive": false,    //是否显示归档信息，默认不显示
            "withFollowTime": false, //是否显示关注时间，默认不显示
            "withAvatar": true,  //是否显示头像，默认显示
            "withActionBtn": true,   //默认带右下角功能键
            "reloadAfterReply":false,   //回复后刷新整个feed，默认不刷新feed
            "scheduleStyle": "1",    //日程item view风格，1是主列表风格，2是弹框列表风格，默认是1
            "noticeStyle": "1",  //公告item view风格，1是主列表风格，2是公告列表风格
            "detailStyle":"1",  //1为正常显示模式，2为打印模式
            "loadSize": 15,   //单次加载15条记录
            "listPath": "/Feed/GetFeeds",   //请求列表默认地址
            "defaultRequestData": {}, //默认请求数据
            "listXhrBeforeSend":FS.EMPTY_FN,
            "searchOpts": {
                "inputSelector": null,   //搜索输入框
                "btnSelector": null  //搜索按钮
            },
            "listEmptyText": "暂无记录",  //列表记录为空的文字提示
            "searchEmptyText":"未找到相关的记录",
            "beforeListParse": function (responseData) {   //默认原样返回
                return responseData;
            },
            "listSuccessCb": FS.EMPTY_FN //列表成功请求返回回调
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this._initPagination();
        //this.pagEl=$(opts.pagSelector);
        this.items = [];
        this.list = new c.listC();
        this.pagination = null;   //分页组件
        this.lazyload = null;     //懒加载组件
        this.feedRemindTid=null; //新消息提醒time id
        this.lastMaxId = 0;   //最近一次请求的maxId
        this.tempRequestData = {};    //通过load或者reload覆盖的请求数据
        this.listXhr=null;  //列表请求ajax句柄
        this.init();
    };
    _.extend(FeedList.prototype, {
        "_initPagination": function () {
            var opts = this.opts;
            if (opts.pagSelector === false) {
                this.pagEl = $('<div class="feed-list-pagination"></div>').appendTo(this.element);
                //隐藏分页，设置pageSize足够大，把数据一次请求完
                this.pagEl.hide();
                opts.pagOpts.pageSize = 10000;
            } else {
                this.pagEl = $(opts.pagSelector);
            }
        },
        "init": function () {
            var that = this,
                opts = this.opts;
            var elEl = this.element,
                listEl;
            var ItemV = v.itemV;
            var list = this.list,
                parse;
            var isJumpPage = true;    //指示是否跳页
            var bei = 1;  //分页组件每页记录数和feedlist每次加载记录数之比
            //构建list容器
            elEl.html('<div class="feed-list-inner"></div>');
            listEl = $('.feed-list-inner', elEl);
            //重载list.parse接口
            parse = list.parse;
            list.parse = function (responseData) {
                var result = opts.beforeListParse.call(this, responseData);
                if (result !== false) {
                    return parse.call(this, result);
                } else {
                    return;

                }
            };
            //监听collection add事件
            list.on('add', function (m, c, listOpts) {
                var itemV,
                    at = listOpts.at;
                itemV = new ItemV({
                    "model": m,
                    "withArchive": opts.withArchive,
                    "withFollowTime": opts.withFollowTime,
                    "withAvatar": opts.withAvatar,
                    "withActionBtn": opts.withActionBtn, //是否带功能键
                    "replyWithMedia": true,  //带多媒体功能
                    "replyListOpts": {   //回复列表配置参数
                        "listPath": "/Feed/GetFeedReplysByFeedID",  //请求回复列表地址
                        "withPagination": false   //默认不带分页
                    },
                    "reloadAfterReply":opts.reloadAfterReply,   //回复后刷新整个feed，默认不刷新
                    "scheduleStyle": opts.scheduleStyle,
                    "noticeStyle": opts.noticeStyle,
                    "detailStyle": opts.detailStyle,
                    "deleteCb":function(responseData,requestData){
                        if(responseData.success){
                            that._updatelistStatus(responseData);
                        }
                        return opts.itemDeleteCb.apply(this,arguments);
                    },
                    "worktodoCb":opts.itemWorktodoCb,
                    "receiptCb":function(responseData,requestData){
                        var globalRemindEl=$('#global-remind'), //小黄条提醒
                            receiptItemEl,
                            receiptCounts=0;
                        if(responseData.success){
                            //回执后小黄条数减1，减到0后隐藏
                            receiptItemEl=$('.receipt-item',globalRemindEl);
                            receiptCounts=parseInt($('.remind-counts',receiptItemEl).text());
                            if(receiptCounts>1){
                                $('.remind-counts',receiptItemEl).text(receiptCounts-1);
                            }else{
                                $('.remind-counts',receiptItemEl).text(0);
                                receiptItemEl.remove();
                            }
                            //全部隐藏后
                            if($('.remind-item',globalRemindEl).length==0){
                                globalRemindEl.hide();
                            }
                        }
                        return opts.itemReceiptCb.apply(this,arguments);
                    },
                    "delegateOtherCb":function(responseData){ //指令转他人执行回调
                        if(responseData.success){
                            that.unshiftFromFeedId(responseData.value.value1); //前插一个新的feed
                        }
                    }
                }).render();
                if (at == 0) {   //前插
                    itemV.$el.prependTo(listEl);
                } else {  //后插
                    itemV.$el.appendTo(listEl);
                }

                that.items.push(itemV);
                opts.itemReadyCb.call(itemV);
            });
            //初始化分页组件
            this.pagination = new Pagination(_.extend({
                "element": this.pagEl
            }, opts.pagOpts));
            this.pagination.on('page', function (pageNumber) {
                isJumpPage = true;
                //如果是跳页，先清空list
                that.empty();
                if (opts.withLazyload) {  //判断是否需要懒加载
                    //重新开启懒加载
                    that.loadStart();
                    //lazyload过程中不显示pagination
                    that.pagination.hide();
                } else {
                    //直接加载
                    that.plainLoad();
                }
            });
            bei = parseInt(this.pagination.get('pageSize') / opts.loadSize);    //注意必须能整除，否则会发生加载混乱
            //初始化懒加载组件
            this.lazyload = new FsLazyload({
                "triggerSize": 20,  //距离底部20px的余量
                "executeHandler": function (activeIndex, cb) {
                    var pagActivePageNumber = that.pagination.get('activePageNumber'),    //分页组件当前页码
                        pageNumber = (pagActivePageNumber - 1) * bei + activeIndex + 1;
                    var requestData = {
                        "pageNumber": pageNumber
                    };
                    if (elEl.is(':visible')) {    //只有当feedlist可见时才会发出请求，这是一处全局开关
                        //如果是跳页操作，覆盖sinceID为0
                        if (isJumpPage) {
                            requestData.sinceID = 0;
                        }else{
                            //lazyload过程中不显示pagination
                            that.pagination.hide();
                        }
                        that.fetch(requestData, cb);
                        isJumpPage = false;   //不考虑回退操作，直接变更跳页状态，TODO：待完善
                    }
                },
                "circleCount": bei
            });
            this.lazyload.on('stop', function () {
                //懒加载终止后显示分页
                that.pagination.show();
            });
            //渲染分页组件
            this.pagination.render();
            //新feed提醒
            if (opts.withFeedRemind) { //For test 暂时注释掉new feed提醒
                this._initFeedRemind();
            }
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                this._searchBarInit();
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
                searchBtnEl = $(searchOpts.btnSelector),  //搜索按钮
                barEl,
                isInit=searchInputEl.data('isInit');
            var searchEmptyEl,
                searchInputWEl;
            if(!isInit){
                //创建快速关闭按钮
                searchEmptyEl = $('<span class="empty-h">&#10005;</span>');
                searchInputWEl = $('<span class="list-search-input-wrapper"></span>');

                searchInputEl.wrap(searchInputWEl);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchEmptyEl.hide().appendTo(searchInputWEl);

                //搜索输入框enter提交事件注册和快速清空按钮
                searchInputEl.keydown(function (evt) {
                    if (evt.keyCode == 13) {    //监听回车按键
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
                searchInputEl.data('isInit',true);
            }
            barEl = $('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);

            //点击返回到查看全部列表
            barEl.on('click', '.back-l', function (evt) {
                var emptyEl = $('.list-empty-tip', elEl),   //记录空白提示
                    searchEmptyEl=$('.empty-h',searchInputEl.closest('.list-search-input-wrapper'));
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                barEl.hide();
                emptyEl.hide();
                that.reload({
                    "keyword": ""
                });
                evt.preventDefault();
            });
            this.searchBarEl=barEl;
        },
        /**
         * 搜索框销毁
         * @private
         */
        _searchBarDestroy:function(){
            var opts = this.opts,
                searchOpts = opts.searchOpts;
            var searchInputEl, //搜索输入框
                searchInputWEl; //搜索包裹框
            if(this.searchBarEl){
                searchInputEl = $(searchOpts.inputSelector);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchInputEl.insertAfter(searchInputWEl);
                searchInputWEl.remove();
                searchInputEl.val("").unbind();
                searchInputEl.data('isInit',false);
                this.searchBarEl.remove();
                this.searchBarEl=null;  //释放，节约内存
            }
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState: function (requestData, responseData) {
            var elEl = this.element,
                barEl = $('.list-search-bar', elEl),
                numEl = $('.num', barEl);
            if (requestData.keyword.length > 0) {
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
         * 搜索重置
         */
        resetSearch:function(){
            var opts = this.opts,
                searchOpts = opts.searchOpts;
            var searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                searchInputWEl=searchInputEl.closest('.list-search-input-wrapper'),
                searchEmptyEl=$('.empty-h',searchInputWEl);
            searchEmptyEl.click().hide();
            this.searchBarEl&&this.searchBarEl.hide();
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
        _updatelistStatus: function (responseData,requestData) {
            var opts=this.opts,
                listEmptyText=opts.listEmptyText,
                searchEmptyText=opts.searchEmptyText;
            var elEl = this.element,
                itemEl = $('.fs-feed-item', elEl), //item element
                emptyEl = $('.list-empty-tip', elEl);
            var emptyText=(requestData&&requestData.keyword&&requestData.keyword.length>0)?searchEmptyText:listEmptyText;
            //设置空白提示信息
            $('.empty-text',emptyEl).text(emptyText);
            if (itemEl.length == 0) {
                emptyEl.show();
            } else {
                emptyEl.hide();
            }
        },
        /**
         * 隐藏空记录提示
         * @private
         */
        _hideEmptyTip:function(){
            var elEl = this.element,
                emptyEl = $('.list-empty-tip', elEl);
            emptyEl.hide();
        },
        /**
         * 新feed提醒
         * @private
         */

        _initFeedRemind: function () {
            var that = this;
            var opts=this.opts;
            var elEl = this.element,
                feedRemindEl = $('.feed-remind', elEl);
            if (feedRemindEl.length == 0) {
                feedRemindEl = $('<div class="feed-remind">有<span class="num">0</span>条新信息，点击查看</div>');
                feedRemindEl.prependTo(elEl);
            }
            //点击刷新整个列表
            feedRemindEl.on('click', function () {
                that.resetSearch();  //重置搜索
                if(opts.feedRemindClickCb){
                    opts.feedRemindClickCb.call(that);
                }else{   //默认刷新列表
                    that.reload();
                }
                feedRemindEl.hide();
            });
            //注册tplEvent.globalremind事件句柄，获取是否有新feed提示
            tplEvent.on('globalremind', function (remindData) {
                var newFeedCount;
                if(remindData.success){
                    if (elEl.is(':visible')) {    //只有在element在显示状态下才出提示
                        newFeedCount = remindData.value.newFeedCount;
                        if (newFeedCount > 0) {
                            $('.num', feedRemindEl).text(newFeedCount);
                            feedRemindEl.show();
                        } else {
                            feedRemindEl.hide();
                        }
                        //更新item view的创建时间
                        _.each(that.items, function (itemV) {
                            var originData = itemV.model.get('originData'),
                                createTime = originData.createTime;
                            $('.f-date', itemV.$el).text(util.getDateSummaryDesc(moment.unix(createTime), moment.unix(remindData.serviceTime), 1));
                        });
                    }
                }
            });

        },
        /**
         * 隐藏feed提醒
         */
        hideFeedRemind:function(){
            var elEl = this.element,
                feedRemindEl = $('.feed-remind', elEl);
            feedRemindEl.hide();
        },
        /**
         *
         * @param config
         * @param cb 懒加载回调，用于指示单次操作完成
         */
        fetch: function (requestData, cb) {
            var that = this;
            var opts = this.opts,
                list = this.list,
                pagination = this.pagination,
                lastOriginData = list.lastOriginData || {},
                dataRoot = lastOriginData.value || {};
            requestData = _.extend({
                "pageSize": opts.loadSize,
                "pageNumber": 1,  //默认加载第一页
                "sinceID": dataRoot.sinceID || 0, //跳页加载为0,以后加载为上次接口对应返回值
                "maxID": this.lastMaxId   //首次加载为0,以后加载为上次接口对应返回值
            }, requestData || {});
            //如果pageNumber==1，强制刷新，设置maxID=0
            if (requestData.pageNumber == 1) {
                requestData.maxID = 0;
            }
            //如果未开启懒加载，maxID和sinceID传0
            if(!opts.withLazyload){
                requestData.maxID = 0;
                requestData.sinceID = 0;
            }
            //加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData = _.extend(requestData, this.tempRequestData);
            this.tempRequestData = {};    //用完重置为空
            //打开loading提示
            this.showLoading();
            this.listXhr&&this.listXhr.abort(); //防止请求堆积
            this.listXhr=this.list.fetch({
                "url": opts.listPath,
                "data": requestData,
                "beforeSend":opts.listXhrBeforeSend,
                //success回调已经被backbone封装，如下
                //if (success) success(collection, resp, options);
                "success": function (c, responseData, ajaxOpts) {
                    var dataRoot;
                    //beforeListParse同时对自定义success回调起作用
                    responseData = opts.beforeListParse.call(this, responseData);

                    if (responseData.success) {
                        dataRoot = responseData.value;
                        //设置分页总记录数
                        /*if (opts.withLazyload) {     //懒加载只设置一次
                            if(pagination.get('totalSize') == -1){
                                pagination.setTotalSize(dataRoot.totalCount);
                            }
                        }else{
                            pagination.setTotalSize(dataRoot.totalCount);
                        }*/
                        pagination.setTotalSize(dataRoot.totalCount);   //.net逻辑可直接设置totalCount总数，有新feed原始totalCount也不会增加
                        //显示分页组件
                        //pagination.show();
                        //保存上一次数据存储
                        that.list.lastOriginData = responseData;
                        //更新最近一次maxID
                        if (dataRoot.maxID > 0) {   //如果返回0，则抛弃，保留上一次的maxID
                            that.lastMaxId = dataRoot.maxID;
                        }
                        cb(true);
                        //如果没有返回数据中断lazyload
                        if (!dataRoot.items || dataRoot.items.length == 0) {
                            that.loadKill();
                        }
                        //更新提示搜索信息
                        that._updateSearchBarState(ajaxOpts.data, responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData,requestData);
                        //成功回调
                        opts.listSuccessCb.call(this, responseData, requestData);
                    }
                    //关闭loading提示
                    that.hideLoading();
                }
            });
        },
        "showLoading": function () {
            var loading = this.loading,
                elEl = this.element,
                loadingEl = $('.feed-list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length == 0) {
                loadingEl = $('<div class="feed-list-loading list-loading"></div>');
                loadingEl.appendTo(elEl);
                loadingEl.html('<span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
                /*loading=new Spin({
                 "color":"#0082CB",
                 "length": 5, // The length of each line
                 "width": 2,
                 "radius": 3,
                 "top": 5
                 }).spin($('.icon-loading',loadingEl).get(0));*/
                //设置实例引用
                this.loading = loading;
            }
            loadingEl.show();
        },
        "hideLoading": function () {
            var elEl = this.element,
                loadingEl = $('.feed-list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 普通加载方式
         */
        "plainLoad": function () {
            var opts = this.opts,
                pagOpts = opts.pagOpts,
                pagination = this.pagination;
            var requestData = {};
            //设置分页信息
            _.extend(requestData, {
                "pageSize": pagOpts.pageSize,
                "pageNumber": pagination.get('activePageNumber')
            });
            //发送请求
            this.fetch(requestData, FS.EMPTY_FN);
        },
        /**
         * 开启懒加载
         */
        "loadStart": function () {
            //终止现有懒加载过程
            this.lazyload.kill();
            //重开懒加载
            this.lazyload.start(true);  //绕过界限判定直接执行
        },
        "loadKill": function () {
            //终止现有懒加载过程
            this.lazyload.kill();
        },
        /**
         * 加载第一页
         */
        "load": function (requestData) {
            //先隐藏空记录提示
            this._hideEmptyTip();
            //重置分页组件
            this.pagination.reset();
            //隐藏feed提醒
            this.hideFeedRemind();
            this.tempRequestData = requestData;
            this.pagination.jump(1);
        },
        "reload": function (requestData) {
            //清理上一次加载的原始数据
            this.list.lastOriginData = null;
            this.load(requestData);
        },
        /**
         * 向feed列表unshift一条数据
         * @param dataSource
         */
        "unshift": function (dataSource) {
            var list = this.list; //list collection
            var formatData = list.parse(dataSource)[0];
            list.unshift(formatData);
            this._updatelistStatus();   //更新列表状态
        },
        /**
         * 根据feedId向列表前插入一个feed
         * @param feedId
         */
        "unshiftFromFeedId":function(feedId){
            var that = this;
            util.api({
                "type": "get",
                "data": {
                    "feedID": feedId
                },
                "url": "/Feed/GetFeedByFeedID",
                "success": function (responseData) {
                    if (responseData.success) {
                        that.unshift(responseData);
                    }
                }
            });
        },
        /**
         * 向feed列表push一条数据
         * @param dataSource
         */
        "push": function (dataSource) {
            var list = this.list; //list collection
            var formatData = list.parse(dataSource)[0];
            list.push(formatData);
        },
        "empty": function () {
            var items = this.items;
            var listEl = $('.feed-list-inner', this.element);
            _.each(items, function (itemV) {
                itemV.destroy && itemV.destroy();
            });
            this.items = [];
            listEl.empty();
        },
        /**
         * 隐藏item上的划出tip
         */
        "hideItemSlideTip":function(){
            $('.show-slide-up-tip-warp').hide();
        },
        "destroy": function () {
            this.pagination.destroy();
            this.lazyload.destroy();
            this.listXhr=null;
            //搜索框销毁
            this._searchBarDestroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消list和pagination绑定
            this.list.lastOriginData = null;
            this.list = null;
            this.pagination = null;
            this.lazyload = null;
            this.lastMaxId = 0;
            this.tempRequestData = {};
            this.element.off();
            this.element.empty();   //dom清理
            this.element = null;
        }
    });
    //注册router
    util.tplRouterReg('#stream/showfeed/=/:id-:value');
    module.exports = FeedList;
});