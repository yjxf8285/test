/**
 * work类型的feed helper
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS;
    var util = require('util'),
        Pagination=require('uilibs/pagination'),
        moment=require('moment');

    var feedListTpl=require('./feed-list.html'),
        feedListTplEl=$(feedListTpl),
        worktodoItemCompiled=_.template(feedListTplEl.filter('.fs-worktodo-item-wrapper').html());  //item模板编译函数
    /**
     * work发出者replyList
     * @param opts
     * @constructor
     */
    var WorkReplyListSend=function(opts){
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 45,
                "totalSize": 0,
                "visiblePageNums": 7
            },
            "defaultRequestData": {} //默认请求数据
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.pagEl = $(opts.pagSelector);
        this.pagination = null; //分页组件
        this.init();
    };

    _.extend(WorkReplyListSend.prototype, {
        "init": function() {
            var that = this,
                opts = this.opts;
            var elEl = this.element;
            var list = this.list;
            //构建list容器
            elEl.addClass('work-reply-list-send').html('<div class="work-reply-list-tbar"></div><div class="work-reply-list-inner"></div>');
            this._initTbar();
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
            //注册事件
            this._regEvents();
        },
        /**
         * 初始化tbar区
         */
        "_initTbar":function(){
            var elEl = this.element,
                tbarEl=$('.work-reply-list-tbar',elEl);
            tbarEl.html('<label>确认结果：</label><button class="undone-l" type="button">未完成继续执行</button><button class="done-l" type="button">已完成点评结果</button>');
        },
        "_regEvents":function(){
            var that=this;
            var elEl=this.element;
        },
        "_createItem":function(item){
            var htmlStr,
                itemEl;
            var elEl=this.element,
                listEl = $('.fs-worktodo-list-inner', elEl);
            htmlStr=replyItemCompiled({
                "title":item.title,
                "createTime":moment.unix(item.createTime).startOf('hour').fromNow()
            });
            itemEl=$(htmlStr);
            itemEl.data('store',item).appendTo(listEl);
            if(item.feed){
                this._createFeedV(itemEl);
            }
            return itemEl;
        },
        prependNewTask:function(taskId){
            var that=this;
            var elEl=this.element,
                listEl = $('.fs-worktodo-list-inner', elEl);
            //打开loading提示
            this.showLoading();
            util.api({
                type:'get',
                data:{
                    workToDoListID:taskId
                },
                url:'/worktodolist/getWorkToDoListByID',
                success:function(responseData){
                    var items;
                    if(responseData.success){
                        items=responseData.value;
                        _.each(items,function(item){
                            var itemEl=that._createItem(item);
                            itemEl.prependTo(listEl);
                        });
                        //重新设置总记录数 当前总记录+1
                        that.pagination.setTotalSize(that.pagination.get('totalSize')+1);
                        //隐藏loading
                        that.hideLoading();
                    }
                }
            });
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
            var elEl=this.element,
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
            //打开loading提示
            this.showLoading();
            util.api({
                type:'get',
                data: _.extend({
                    isImportant:"0",
                    "isCompleted":"0",
                    "keyword":"",
                    "pageSize":pagination.get('pageSize'),
                    "pageNumber":pagination.get('activePageNumber')
                },requestData),
                url:'/worktodolist/getWorkToDoLists',
                success:function(responseData){
                    var items;
                    if(responseData.success){
                        items=responseData.value.items;
                        _.each(items,function(item){
                            var itemEl=that._createItem(item);
                            itemEl.appendTo(listEl);
                        });
                        //重新设置总记录数 当前总记录+1
                        that.pagination.setTotalSize(that.pagination.get('totalSize')+1);
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
            if (!loading) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo(elEl);
                loadingEl.html('<span class="icon-loading"></span><span class="loading-text">正在加载，请稍后&#8230;</span>');
                loading = new Spin({
                    "color": "#0082CB",
                    "length": 5, // The length of each line
                    "width": 2,
                    "radius": 3,
                    "top": 5
                }).spin($('.icon-loading', loadingEl).get(0));
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
        "load": function() {
            this.pagination.jump(1);
        },
        "reload": function() {
            this.load();
        },
        "removeItemEl":function(itemSelector){
            var itemEl=$(itemSelector),
                feedV=itemEl.data('feedV');
            feedV&&feedV.destroy && feedV.destroy();   //销毁feedV
            itemEl.removeData();  //清空所有数据
            itemEl.remove();  //安全移除
        },
        "empty": function() {
            var listEl = $('.fs-worktodo-list-inner', this.element),
                itemEl=$('.fs-worktodo-item',listEl);
            itemEl.each(function(){
                var meEl=$(this),
                    feedV=meEl.data('feedV');
                feedV&&feedV.destroy && feedV.destroy();   //销毁feedV
                meEl.removeData();  //清空所有数据
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
            this.element = null;
        }
    });
    module.exports={
        "workReplyListSend":WorkReplyListSend
    };
});