/**
 * worktodo 待办
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var util = require('util'),
        feedV = require('modules/feed-list/feed-list-v'),
        feedM = require('modules/feed-list/feed-list-m'),
        feedC = require('modules/feed-list/feed-list-c'),
        worktodoTpl = require('./fs-worktodo.html'),
        worktodoStyle = require('./fs-worktodo.css'),
        Pagination = require('uilibs/pagination'),
        Dialog = require('dialog'),
        Spin = require('spin'),
        moment = require('moment'),
        publish=require('modules/publish/publish');
    var FeedItemV = feedV.itemV, //feed的mvc
        FeedItemM = feedM.itemM,
        FeedListC = feedC.listC,
        worktodoTplEl = $(worktodoTpl),
        worktodoItemCompiled = _.template(worktodoTplEl.filter('.fs-worktodo-item-wrapper').html()), //item模板编译函数
        worktodoModifyTpl = worktodoTplEl.filter('.fs-worktodo-modify-wrapper').html(); //修改待办模板
    //创建feelist collection
    var tempFeedListC = new FeedListC();
    var contactData=util.getContactData(),
        loginUserData=contactData["u"];

    var AtInput=publish.atInput;
    //待办详情路由注册
    util.tplRouterReg('#worktodo/tododetail/=/:id-:value');
    /**
     * 扩展dialog用于修改待办
     * @type {*}
     */
    var ModifyDialog = Dialog.extend({
        "attrs": {
            content: worktodoModifyTpl,
            className: 'fs-worktodo-modify-dialog',
            successCb: FS.EMPTY_FN //提交成功后回调
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        "setup":function(){
            var elEl = this.element,
                worktodoTitleEl;
            this.after('show',function(){
                worktodoTitleEl = $('.worktodo-title', elEl);
                worktodoTitleEl.trigger('autosize.resize');
            });
            return ModifyDialog.superclass.setup.apply(this,arguments);
        },
        "render":function(){
            var result=ModifyDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "_renderCpt":function(){
            var elEl = this.element,
                worktodoTitleEl = $('.worktodo-title', elEl);
            var atInput=new AtInput({
                "element":worktodoTitleEl
            });
            this.atInput=atInput;
        },
        "showWithStore": function(store) {
            var elEl = this.element,
                worktodoTitleEl = $('.worktodo-title', elEl),
                isImportantEl = $('.is-important', elEl);
            this.store = store;
            //设置标题
            worktodoTitleEl.val(store.title).trigger('autosize.resize');
            //设置是否是重要事项
            if (store.isImportant) {
                isImportantEl.prop('checked', true);
            } else {
                isImportantEl.prop('checked', false);
            }
            //显示出来
            this.show();
        },
        "isValid": function() {
            var passed = true;
            var requestData = this.getRequestData();
            var elEl = this.element,
                worktodoTitleEl = $('.worktodo-title', elEl);
            //标题不能为空
            if (requestData["title"].length == 0) {
                util.showInputError(worktodoTitleEl);
                passed = false;
            }
            //标题不能超过1000字
            if (requestData["title"].length >1000) {
                util.alert('内容不超过1000字');
                passed = false;
            }
            return passed;
        },
        "getRequestData": function() {
            var requestData = {};
            var store = this.store;
            var elEl = this.element,
                worktodoTitleEl = $('.worktodo-title', elEl),
                isImportantEl = $('.is-important', elEl);
            //id
            requestData["workToDoListID"] = store.workToDoListID;
            //title
            requestData["title"] = _.str.trim(worktodoTitleEl.val());
            //重要性
            requestData["isImportant"] = isImportantEl.prop('checked');
            return requestData;
        },
        "clearForm": function() {
            var elEl = this.element,
                worktodoTitleEl = $('.worktodo-title', elEl),
                isImportantEl = $('.is-important', elEl);
            worktodoTitleEl.val("").trigger('autosize.resize');
            isImportantEl.prop('checked', false);
        },
        "_submit": function(evt) {
            var that = this;
            var requestData = this.getRequestData();
            if (this.isValid()) {
                util.api({
                    type: 'post',
                    data: requestData,
                    url: '/worktodolist/modifyWorkToDoList',
                    success: function(responseData) {
                        if (responseData.success) {
                            //隐藏本身
                            that.hide();
                            that.get('successCb').call(that, responseData, requestData);
                        }
                    }
                });
            }
            evt.preventDefault();
        },
        "_cancel": function(evt) {           
            this.clearForm();
            this.hide();
            evt.preventDefault();
        },
        "destroy":function(){
            var result;
            this.atInput&&this.atInput.destroy();
            result=ModifyDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    //创建待办修改对话框
    var modifyDialog = new ModifyDialog().render();
    /**
     * 待办列表定义
     * @param opts
     * @constructor
     */
    var WorktodoList = function(opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 45,
                "totalSize": 0,
                "visiblePageNums": 7
            },
            "listPath": "/worktodolist/getWorkToDoLists",
            "defaultRequestData": {}, //默认请求数据
            "searchOpts":{
                "inputSelector":null,   //搜索输入框
                "btnSelector":null  //搜索按钮
            },
            "listEmptyText":"暂无记录"  //列表记录为空的文字提示
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this._initPagination();
        //this.pagEl = $(opts.pagSelector);
        this.pagination = null; //分页组件
        this.tempRequestData={};
        this.init();
    };

    _.extend(WorktodoList.prototype, {
        "_initPagination": function() {
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
        "init": function() {
            var that = this,
                opts = this.opts;
            var elEl = this.element;
            var list = this.list;
            //构建list容器
            elEl.addClass('fs-worktodo-list').html('<div class="fs-worktodo-list-inner"></div>');
            //初始化分页组件
            this.pagination = new Pagination(_.extend({
                "element": this.pagEl
            }, opts.pagOpts));
            this.pagination.on('page', function(pageNumber) {
                //清空列表
                that.empty();
                //请求数据
                that.fetch();
            });
            //渲染分页组件
            this.pagination.render();
            //搜索返回bar初始化
            if(opts.searchOpts&&opts.searchOpts.inputSelector){
                this._searchBarInit();
            }
            //初始化列表结果空白提示
            this._initListEmptyTip();
            //注册事件
            this._regEvents();
        },
        /**
         * 搜索条初始化，显示查询总信息和返回按钮
         * @private
         */
        _searchBarInit:function(){
            var that=this,
                opts=this.opts,
                searchOpts=opts.searchOpts;
            var elEl=this.element,
                searchInputEl=$(searchOpts.inputSelector), //搜索输入框
                searchBtnEl=$(searchOpts.btnSelector),  //搜索按钮
                barEl;
            barEl=$('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);
            //创建快速关闭按钮
            var searchEmptyEl=$('<span class="empty-h">&#10005;</span>'),
                searchInputWEl=$('<span class="list-search-input-wrapper"></span>');
            searchInputEl.wrap(searchInputWEl);
            searchInputWEl=searchInputEl.closest('.list-search-input-wrapper');
            searchEmptyEl.hide().appendTo(searchInputWEl);

            //搜索输入框enter提交事件注册和快速清空按钮
            searchInputEl.keydown(function(evt){
                if(evt.keyCode==13){    //监听回车按键
                    searchBtnEl.click();
                }
            }).keyup(function(){
                    var val= _.str.trim($(this).val());
                    if(val.length>0){
                        searchEmptyEl.show();
                        searchInputEl.addClass('with-input-value');
                    }else{
                        searchEmptyEl.hide();
                        searchInputEl.removeClass('with-input-value');
                    }
                });
            searchEmptyEl.click(function(){
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
            });
            //点击返回到查看全部列表
            barEl.on('click','.back-l',function(evt){
                var emptyEl = $('.list-empty-tip', elEl);   //记录空白提示
                that.reload({
                    "keyword":""
                });
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                barEl.hide();
                emptyEl.hide();
                evt.preventDefault();
            });
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState:function(requestData,responseData){
            var elEl=this.element,
                barEl=$('.list-search-bar',elEl),
                numEl=$('.num',barEl);
            if(requestData.keyword.length>0){
                if(responseData.success){
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
        _initListEmptyTip:function(){
            var elEl=this.element,
                emptyEl=$('<div class="list-empty-tip"></div>');
            var opts=this.opts,
                emptyText=opts.listEmptyText;
            emptyEl.html('<img src="'+FS.BLANK_IMG+'" alt="loading" class="icon-empty" />&nbsp;&nbsp;<span class="empty-text">'+emptyText+'</span>');
            emptyEl.appendTo(elEl);
        },
        /**
         * 列表结果记录集为空的提示状态
         * @private
         */
        _updatelistStatus:function(responseData){
            var elEl=this.element,
                emptyEl=$('.list-empty-tip',elEl);
            var totalCount;
            if(responseData.success){
                totalCount=responseData.value.totalCount;
                if(totalCount==0){  //列表结果为空，提示空提示信息
                    emptyEl.show();
                }else{
                    emptyEl.hide();
                }
            }
        },
        "_regEvents": function() {
            var that = this;
            var elEl = this.element;
            //设置完成状态
            elEl.on('click', '.mark-l', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item'),
                    isCompleteEl = $('.is-complete', itemEl),
                    labelEl = isCompleteEl.next(),
                    markEl = $('.mark-l', itemEl);
                var store = itemEl.data('store');
                if (isCompleteEl.prop('checked')) {
                    //设置成未完成
                    that.setIsCompleted(false, store.workToDoListID, function() {
                        markEl.text('标记为已完成');
                        labelEl.text('未完成');
                        isCompleteEl.prop('checked', false);
                    },meEl);

                } else {
                    //设置成已完成
                    that.setIsCompleted(true, store.workToDoListID, function() {
                        markEl.text('标记为未完成');
                        labelEl.text('已完成');
                        isCompleteEl.prop('checked', true);
                    },meEl);
                }
                evt.preventDefault();
            }).on('change', '.is-complete', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item'),
                    isCompleteEl = $('.is-complete', itemEl),
                    labelEl = isCompleteEl.next(),
                    markEl = $('.mark-l', itemEl);
                var store = itemEl.data('store');
                if (isCompleteEl.prop('checked')) {
                    //设置成未完成
                    that.setIsCompleted(true, store.workToDoListID, function() {
                        markEl.text('标记为未完成');
                        labelEl.text('已完成');
                    },meEl.closest('.label-for'));

                } else {
                    //设置成已完成
                    that.setIsCompleted(false, store.workToDoListID, function() {
                        markEl.text('标记为已完成');
                        labelEl.text('未完成');
                    },meEl.closest('.label-for'));
                }
            }).on('mouseenter','.tbar-l',function(evt){
                var targetEl=$(evt.currentTarget),
                    ckEl=$(evt.currentTarget).find('.is-complete');
                if(ckEl.prop('checked')){
                    targetEl.attr('title','点击设置为未完成');
                }else{
                    targetEl.attr('title','点击设置为已完成');
                }
            });
            //删除待办提示框
            elEl.on('click', '.del-l-parent', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item'),
                    fnEl = meEl.closest('.fs-worktodo-item-actions'),
                    cancelmenuEl = $('.cancelmenu', fnEl),
                    cancelboxEl = $('.cancelmenu-box', cancelmenuEl);
                cancelmenuEl.show();
                cancelboxEl.animate({
                    top: '0'
                }, 400);
                return false;
            });
            //删除待办提示框取消
            elEl.on('click', '.f-cancel', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item'),
                    cancelmenuEl = $('.cancelmenu', itemEl),
                    cancelboxEl = $('.cancelmenu-box', cancelmenuEl);

                cancelboxEl.animate({
                    top: '120'
                }, 400);
                return false;
            });
            //删除待办
            elEl.on('click', '.del-l', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item');
                var store = itemEl.data('store');
                util.api({
                    type: 'post',
                    data: {
                        "workToDoListID": store.workToDoListID
                    },
                    url: '/worktodolist/deleteWorkToDoList',
                    success: function(responseData) {
                        if (responseData.success) {
                            that.removeItemEl(itemEl);
                            //返回待办列表
                            location.href="#worktodo";
                        }
                    }
                },{
                    "submitSelector":meEl
                });
                evt.preventDefault();
            });
            //修改待办
            elEl.on('click', '.edit-l', function(evt) {
                var meEl = $(evt.currentTarget),
                    itemEl = meEl.closest('.fs-worktodo-item'),
                    titleEl = $('.fs-worktodo-item-title', itemEl);
                var store = itemEl.data('store');
                modifyDialog.showWithStore(store);
                modifyDialog.set('successCb', function(responseData, requestData) {
                    if (responseData.success) {
                        //更新item
                        //titleEl.text(requestData.title);
                        that.updateItem(requestData.workToDoListID);
                    }
                });
                evt.preventDefault();
            });
        },
        /**
         * 设置待办完成状态
         * @param isComplete
         * @param taskId
         * @param callback
         */
        "setIsCompleted": function(isComplete, taskId, callback,maskSelector) {
            var that = this;
            util.api({
                type: 'post',
                data: {
                    "workToDoListID": taskId,
                    "isCompleted": isComplete
                },
                url: '/worktodolist/setIsCompleted',
                success: function(responseData) {
                    if (responseData.success) {
                        callback.call(that, responseData);
                    }
                }
            },{
                "mask":$(maskSelector)
            });
        },
        "_createFeedV": function(itemSelector,serviceTime) {
            var itemEl = $(itemSelector),
                feedWrapperEl = $('.fs-worktodo-item-content', itemEl), //包裹feed容器
                store = itemEl.data('store');
            var items = tempFeedListC.parse({
                "success": true,
                "value": {
                    "items": [store.feed]
                },
                "serviceTime":serviceTime
            });
            var feedV = new FeedItemV({
                "model": new FeedItemM(items[0]),
                "withAvatar":false, //不显示头像
                "withActionBtn":false,   //不显示功能键
                "detailStyle":1,
                "scheduleStyle":1   //日程风格
            }).render();
            var elEl = feedV.$el;
            feedWrapperEl.append(elEl);
            //展示feed全文
            var feedContentVisibleHEl=$('.feed-content-visible-h',elEl);
            if(feedContentVisibleHEl.length>0){
                feedContentVisibleHEl.click();  //展开全文
                //隐藏控制按钮
                feedContentVisibleHEl.hide();
            }
        },
        "_createItem": function(item,serviceTime,feeds) {
            var htmlStr,
                itemEl,
                feedData;
            var elEl = this.element,
                listEl = $('.fs-worktodo-list-inner', elEl);
            htmlStr = worktodoItemCompiled({
                "workToDoListID":item.workToDoListID,
                "feedID": item.feedID,
                "isCompleted": item.isCompleted,
                "isImportant": item.isImportant,
                "title": item.title.replace(/\n/g,'<br/>'),
                "createTime": util.getDateSummaryDesc(moment.unix(item.createTime),moment.unix(serviceTime), 1),
                "isBelongToMe":loginUserData.id==item.creatorID?true:false,    //是否属于自己创建的待办
                "creatorID":item.creatorID,
                "creatorName":item.creatorName
            });
            itemEl = $(htmlStr);
            feedData= _.find(feeds,function(itemData){
                return itemData.feedID==item.feedID;
            });
            item.feed=feedData;
            itemEl.data('store', item).appendTo(listEl);
            if (feedData) {
                this._createFeedV(itemEl,serviceTime);
            }
            
            return itemEl;
        },
        prependNewTask: function(taskId) {
            var that = this;
            var elEl = this.element,
                listEl = $('.fs-worktodo-list-inner', elEl);
            //打开loading提示
            this.showLoading();
            util.api({
                type: 'get',
                data: {
                    workToDoListID: taskId
                },
                url: '/worktodolist/getWorkToDoListByID',
                success: function(responseData) {
                    var items,
                        feeds;
                    if (responseData.success) {
                        items = responseData.value.items;
                        feeds = responseData.value.feeds.items;
                        _.each(items, function(item) {
                            var itemEl = that._createItem(item,responseData.serviceTime,feeds);
                            itemEl.prependTo(listEl);
                        });
                        //重新设置总记录数 当前总记录+1
                        that.pagination.setTotalSize(that.pagination.get('totalSize') + 1);
                        //隐藏loading
                        that.hideLoading();
                    }
                }
            });
        },
        updateItem: function(taskId) {
            var that = this;
            var elEl = this.element,
                listEl = $('.fs-worktodo-list-inner', elEl),
                itemEl;
            $('.fs-worktodo-item', listEl).each(function() {
                var meEl = $(this);
                if (meEl.data('store').workToDoListID == taskId) {
                    itemEl = meEl;
                    return false; //中断执行
                }
            });
            if (itemEl) { //如果找到了
                util.api({
                    type: 'get',
                    data: {
                        workToDoListID: taskId
                    },
                    url: '/worktodolist/getWorkToDoListByID',
                    success: function(responseData) {
                        var items,
                            feeds;
                        if (responseData.success) {
                            items = responseData.value.items;
                            feeds= responseData.value.feeds.items;
                            _.each(items, function(item) {
                                var newItemEl = that._createItem(item,responseData.serviceTime,feeds);
                                newItemEl.insertAfter(itemEl); //添加新的
                                itemEl.remove(); //删除以前的
                            });
                        }
                    }
                });
            }
        },
        /**
         * 高亮搜索关键字
         * @param keyword
         */
        hlKeyword:function(keyword){
            var elEl = this.element,
                itemContentsEl;
            if(keyword.length>0){
                itemContentsEl = $('.fs-worktodo-item-title', elEl);
                itemContentsEl.each(function(){
                    var itemEl=$(this),
                        itemText=itemEl.text();
                    itemEl.html(itemText.replace(new RegExp(keyword, 'g'),'<span class="state-keyword-hl">'+keyword+'</span>'));
                });
            }
        },
        /**
         *
         * @param config
         */
        fetch: function() {
            var that = this;
            var requestData = {};
            var opts = this.opts,
                pagination = this.pagination;
            var elEl = this.element,
                listEl = $('.fs-worktodo-list-inner', elEl);
            requestData = _.extend({
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber') //当前页码
            }, requestData || {});
            //加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData= _.extend({
                isImportant: "0",
                "isCompleted": "0",
                "keyword": "",
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber')
            },requestData,this.tempRequestData);
            this.tempRequestData={};    //用完重置为空
            //打开loading提示
            this.showLoading();
            util.api({
                type: 'get',
                data: requestData,
                url: opts.listPath,
                success: function(responseData,ajaxOpts) {
                    var dataRoot,
                        items,
                        feeds;
                    if (responseData.success) {
                        dataRoot=responseData.value;
                        items = dataRoot.items;
                        feeds=dataRoot.feeds.items;
                        _.each(items, function(item) {
                            var itemEl = that._createItem(item,responseData.serviceTime,feeds);
                            itemEl.appendTo(listEl);
                        });
                        //高亮所有的搜索关键字
                        that.hlKeyword(requestData.keyword);
                        //重新设置总记录数
                        that.pagination.setTotalSize(dataRoot.totalCount);
                        //更新提示搜索信息
                        that._updateSearchBarState(requestData,responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
                        //隐藏loading
                        that.hideLoading();
                    }
                }
            });
        },
        "showLoading": function() {
            var loading = this.loading,
                elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length==0) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo(elEl);
                loadingEl.html('<span class="icon-loading"><img src="'+FS.BLANK_IMG+'" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
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
        "hideLoading": function() {
            var elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 加载第一页
         */
        "load": function(requestData) {
            this.tempRequestData=requestData;
            this.pagination.jump(1);
        },
        "reload": function(requestData) {
            this.load(requestData);
        },
        "removeItemEl": function(itemSelector) {
            var itemEl = $(itemSelector),
                feedV = itemEl.data('feedV');
            feedV && feedV.destroy && feedV.destroy(); //销毁feedV
            itemEl.removeData(); //清空所有数据
            itemEl.remove(); //安全移除
        },
        "empty": function() {
            var listEl = $('.fs-worktodo-list-inner', this.element),
                itemEl = $('.fs-worktodo-item', listEl);
            itemEl.each(function() {
                var meEl = $(this),
                    feedV = meEl.data('feedV');
                feedV && feedV.destroy && feedV.destroy(); //销毁feedV
                meEl.removeData(); //清空所有数据
            });
            listEl.empty();
        },
        "destroy": function() {
            this.pagination.destroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消pagination绑定
            this.pagination = null;
            this.tempRequestData={};
            this.element = null;
        }
    });
    module.exports = WorktodoList;
});