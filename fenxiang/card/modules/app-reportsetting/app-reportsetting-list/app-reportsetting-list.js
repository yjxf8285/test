/**
 * 报表管理-列表
 * liuxf
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = FS.util;
    require('modules/app-reportsetting/app-reportsetting-list/app-reportsetting-list.css');
    var tplhtml = require('modules/app-reportsetting/app-reportsetting-list/app-reportsetting-list.html');
    var Pagination = require('uilibs/pagination2');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var moment = require('moment');
    var tableTemplate=_.template($(tplhtml).filter('.report-talbe-list-html').html()); //表格模板
    var ReportList = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: '', //CLASS名
        template: _.template($(tplhtml).filter('.report-list-html').html()), //模板
        options: {
            wrapEl: null //父级容器
        },

        init: function () {
            this.element = this.options.wrapEl;
            this.render();
            this.bindEvents();
        },
        render: function () {
            this.load();
            this.setupComponent();
        },
        refreshTable:function(data){
            var that = this;
            this.options.data = _.extend(this.options.data, data);
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                beforeSend: function () {
                    var loadingEl = '<tr><td colspan="5"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    that.options.wrapEl.find('.report-tb-box tbody').html(loadingEl);
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.options.wrapEl.find('.reportsetting-tbody').html(tableTemplate(that.formatData(responseData)));
                        that.pagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                    }
                }
            });
        },
        // 请求列表数据
        load: function () {
            var that = this;
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                beforeSend: function () {
                    var loadingEl = '<tr><td colspan="5"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    that.options.wrapEl.find('.report-tb-box tbody').html(loadingEl);
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.options.wrapEl.html(that.template(that.formatData(responseData)));//更新模板HTML字符串并且插入到父级容器
                        that.setSearch();
                        that.pagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                        util.mnEvent($('#report-reportmanage .report-list-condition .states-list-select-list'), 'change', function(val, text) {
                            that.refreshTable({
                                status: val
                            });
                        });
                        util.mnEvent($('#report-reportmanage .report-list-condition .order-select-list'), 'change', function(val, text) {
                            that.refreshTable({
                                sortType: val
                            });
                        });
                    }
                }
            });
        },
        //实例化搜索框
        setSearch: function(){
        	var that = this;
    		this.searchBox = new SearchBox({
                "element": $('.search-warp', this.element),
                "placeholder": "搜索"
            });
            this.searchBox.on('search', function (queryValue) {
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {});
                } else {
                	that.refreshTable({
                        keyword: queryValue//搜索关键字
                    });
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

            // 搜索结果
            formatData.templates = responseData.value.templates.length ? responseData.value.templates : null;
            formatData.keyword = this.options.data.keyword;
            _.each(formatData.templates, function (item) {
                item.createTime=moment.unix(item.createTime).format('YYYY-MM-DD HH:mm');
            });
            return formatData;
        },
        bindEvents: function () {
            var that = this;
            this.element.delegate('.btn-create', 'click', function () {
                that.trigger('beginCreate', {
                    step: 1
                });
            });
            //详情
            this.element.delegate('.list-edit-btn', 'click', function (e) {
                var meEl = $(e.currentTarget);
                var trEl = meEl.closest('tr');
                var templateID = trEl.data('templateid');
                var templateName = trEl.data('templatename');
                that.trigger('beginEdit', {
                    templateID: templateID,
                    step: 1,
                    templateName: templateName
                });
            });
            //启用
            this.element.delegate('.list-start-btn', 'click', function (e) {

                var meEl = $(e.currentTarget);
                var trEl = meEl.closest('tr');
                var templateID = trEl.data('templateid');
                util.api({
                    "url": '/DataReporting/StartTemplate',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        templateID: templateID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {

                            util.alert('启用成功！', function () {
                                $('.list-status-txt', trEl).html('<span class="gray">已启用</span>');
                                meEl.text('暂停').removeClass('list-start-btn').addClass('list-stop-btn');
                            });

                        }
                    }
                });

            });
            //暂停
            this.element.delegate('.list-stop-btn', 'click', function (e) {
                var meEl = $(e.currentTarget);
                var trEl = meEl.closest('tr');
                var templateID = trEl.data('templateid');
                util.api({
                    "url": '/DataReporting/StopTemplate',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        templateID: templateID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {

                            util.alert('暂停成功！', function () {
                                $('.list-status-txt', trEl).text('暂停');
                                meEl.text('启用').removeClass('list-stop-btn').addClass('list-start-btn');
                            });

                        }
                    }
                });

            });
            //删除
            this.element.delegate('.list-del-btn', 'click', function (e) {
                var meEl = $(e.currentTarget);
                var trEl = meEl.closest('tr');
                var templateID = trEl.data('templateid');
                util.confirm('确定要删除该报表吗？', '', function () {
                    util.api({
                        "url": '/DataReporting/RemoveTemplate',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            templateID: templateID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                util.alert('删除成功！', function () {
                                    trEl.remove();
                                });

                            }
                        }
                    });
                });

            });
        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            var elEl = this.$el;

            //分页
            this.pagination = new Pagination({
                "element": this.options.pagEl,
                "pageSize": this.options.data.pageSize,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });
            this.pagination.render();
            this.pagination.on('page', function (pageNumber) {
                that.refreshTable({
                    pageNumber: pageNumber// int，页码
                });
            });

        }
    });
    module.exports = ReportList;
});