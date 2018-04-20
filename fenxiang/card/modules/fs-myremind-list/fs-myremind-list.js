/**
 * 我的提醒列表
 *
 * @author liuxiaofan
 * 2014-03-20
 */

define(function (require, exports, module) {
    var tpl = require('modules/fs-myremind-list/fs-myremind-list.html');
    var css = require('modules/fs-myremind-list/fs-myremind-list.css');
    var util = require('util');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination');
    var contactData = util.getContactData(),
        currentUserDataId = contactData["u"].id; //当前登录人

    /**
     * FS 我的提醒列表
     * 普通选项参数会被注册到 this.options 中。
     * 特殊的选项： model, collection, el, id, className, 以及 tagName。
     */
    var MyRemindList = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: 'myremind-list-item', //CLASS名

        url: null, //请求地址
        data: null, //请求参数
        template: _.template($(tpl).filter('.feed-list-myremind').html()), //模板
        events: {
            "click .aj-myremind-delete": "delFeed" //重新请求数据
        },
        // 初始化设置
        initialize: function () {
            this.render();
            this.setupDoms();
            //            this.load();//请求数据
        },
        // 渲染
        render: function () {
            this.options.warpEl.html(this.$el);
            return this;
        },
        // 清空
        destroy: function () {
            this.remove();
        },
        // 请求数据
        load: function () {
            var that = this;
            var elEl = this.$el;
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                "beforeSend": function() {
                    var loadingEl='<div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div>';
                    elEl.html(loadingEl);
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        if (responseData.value.totalCount > 0) {
                            elEl.html(that.template(that.formatData(responseData)));//更新模板HTML字符串并且插入到父级容器
                            that.pagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                            that.pagination.render().show();

                        } else {
                            elEl.html('<div class="list-empty-tip" style="display: block;"><img class="icon-empty" alt="loading" src="../../html/card/assets/images/clear.gif">&nbsp;&nbsp;<span class="empty-text">未找到相关的记录</span></div>');
                            that.pagination.hide();
                        }
                        that.trigger('success',responseData);

                    }
                }
            });
        },
        // 刷新数据
        refresh: function (data) {
            this.options.data = _.extend(this.options.data, data);

            this.load();
        },
        // 原始数据格式化
        formatData: function (responseData) {
            var formatData = {};
            _.extend(formatData, responseData || {});
            // timingMessageRemainds数据重新整理
            _.each(formatData.value.timingMessageRemainds, function (timingMessageRemaind) {
                var serviceTime = responseData.serviceTime,
                    yearTime, ctime, rtime, yearTimeService;
                yearTime = moment(timingMessageRemaind.remaindTime).format('YYYY');
                yearTimeService = moment.unix(serviceTime).format('YYYY');

                if (yearTime == yearTimeService) { //如果是今年就不显示年了
                    ctime = moment(timingMessageRemaind.createTime).format('MMMDD日 (dddd) HH:mm');
                    rtime = moment(timingMessageRemaind.remaindTime).format('MMMDD日 HH:mm');
                } else {
                    ctime = moment(timingMessageRemaind.createTime).format('YYYY年MMMDD日 (dddd) HH:mm');
                    rtime = moment(timingMessageRemaind.remaindTime).format('YYYY年MMMDD日 HH:mm');
                }
                //自己创建的不显示创建者
                if (currentUserDataId == timingMessageRemaind.creator.employeeID) {
                    timingMessageRemaind.hideCreator = 'fn-hide';
                } else {
                    timingMessageRemaind.hideCreator = '';
                }
                timingMessageRemaind.createTime = ctime;
                timingMessageRemaind.remaindTime = rtime;
            });
            return formatData;
        },
        delFeed: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var itemEl = meEl.closest('.fs-feed-item');
            util.confirm('确定要删除此条提醒吗？', '删除确认', function () {
                util.api({
                    "url": '/TimingMessage/DeleteTimingMessageRemaind',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        timingMessageRemaindIDs: meEl.data('listid')// string，提醒的ID(格式：1,2,3)
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            util.remind(2, "删除成功");
                            itemEl.slideUp(300);
                        }
                    }
                });
            });
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.$el;
            var that = this;
            this.elEl = elEl;
            this.approveBdEl = $('.approve-bd', elEl); //表单身体部分
            //初始化分页组件
            this.pagination = new Pagination({
                "element": this.options.pagEl,
                "pageSize": 10,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });

            //that.fetch();
            this.pagination.on('page', function (pageNumber) {
                that.refresh({
                    pageNumber: pageNumber// int，页码
                });
            });
        },
        // 设置组件
        setupComponent: function () {

        }
    });
    module.exports = MyRemindList;
});