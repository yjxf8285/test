/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
var tpl = require('./tpl.html');
var Header = Backbone.View.extend({
    template: _.template($(tpl).filter('#tpl-con').html()),
    events: {
        "click #status-list .finished": "finishedtask",
        "click .showuser-btn": "showUser",
        "keyup .search-input": "search",
        "click .search-ico": "searchShow",
        "blur .search-input": "searchHide",
    },
    initialize: function (options) {
        this.options = _.extend({
            index: 0
        }, options || {});
        this.render();
    },
    finishedtask: function () {
        window.location.href = BASE_PATH + '/html/data-supervise/quality-report.html'
    },
    search: function (e) {
        var val = $(e.currentTarget).val().trim();
        var recentlyEl = $('.nodata', this.$el);
        var feedlistEl = $('.search-feeds', this.$el);
        if (val == '8') {
            recentlyEl.hide();
            feedlistEl.html('<li class="count">共找到2条记录</li> <li><a href="/html/audience/segment.html">>8个月孕龄的孕期准妈妈</a></li><li><a href="/html/audience/segment.html"><8个月孕龄的孕期准妈妈</a></li>').show();
        } else if (val == '促销') {
            recentlyEl.hide();
            feedlistEl.html('<li class="count">共找到2条记录</li> <li><a href="/html/activity/plan.html?planId=3&status=active&returnurl=/html/activity/supervise.html">周末促销活动</a></li><li><a href="/html/activity/plan.html?planId=2&status=active&returnurl=/html/activity/supervise.html">周末促销活动测试</a></li>').show();
        } else if (val == '') {
            recentlyEl.hide();
            feedlistEl.hide();
        } else {
            recentlyEl.show();
            feedlistEl.hide();
        }
        //
    },
    showUser: function (e) {
        var userListEl = $('#user-list');

        if (userListEl.is('.on')) {
            userListEl.removeClass('on');
            $('.recently', userListEl).show();
            $('.user-feedlist', userListEl).hide();
        } else {
            userListEl.addClass('on');
        }
        e.stopPropagation();

    },
    selectBtn: function (e) {
        $('.topmenu-btn', this.$el).eq(this.options.index).addClass('cur');
    },
    searchShow: function (e) {
        //$('.search-ico', this.$el).removeClass('show');
        $('.search-input', this.$el).addClass('show');
    },
    searchHide: function (e) {
        $('.search-input', this.$el).removeClass('show').val('');
        //$('.search-ico', this.$el).addClass('show');

    },
    render: function () {
        this.$el.html(this.template(this.options));
        this.selectBtn();
        return this;
    }
});

module.exports = Header;