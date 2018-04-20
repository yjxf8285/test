/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
var util = window.util || require('util');
var tpl = require('./tpl.html');
var Header = require('../header/header');
var LeftMenu = require('../leftmenu/leftmenu');
var Layout = Backbone.View.extend({
    el: 'body',
    model: new Backbone.Model({
        index: 0,
        showLeft: true
    }),
    template: _.template($(tpl).filter('.tpl-con').html()),
    events: {
        "click #user-list": "stopProa",
        "click #groupuser-list": "stopProa",
        "click #container": "containerEvents",
        "click .js-showuserfile": "showUserFile",
        "click .menu-btn": "toggleMenu",
        "keyup .search-user-input": "searchUser",
    },
    //显示联系人档案
    showUserFile: function () {
        $('#userFileWindow').openModal({
            ready: function () {
                $('#userfilepage').attr('src', BASE_PATH + '/html/audience/contact-file.html');
            },
            complete: function () {
                $('#userfilepage').attr('src', '');
            }
        });
    },
    //弹出人群中查找
    showgrouplist: function (e) {
        $('#groupuser-list').addClass('on');
        $('.dropdown-content').hide();
        e && e.stopPropagation();
    },
    //任务期间
    duringTask: function (boolean) {
        if (boolean) {
            $('.corner', this.el).show();
        } else {
            $('.corner', this.el).hide();
        }
    },
    //阻止事件传播
    stopProa: function (e) {
        if ($('.dropdown-button').has(e.target).length != 1) {
            $('.dropdown-button').trigger('close');
        }
        e.stopPropagation();
    },


    //全局点击事件
    containerEvents: function (e) {
        $('#user-list').removeClass('on');
        $('#groupuser-list').removeClass('on');
    },
    initialize: function (options) {
        this.options = _.extend({
            index: 0,
            leftMenuCurName: ''
        }, options || {});
        this.model.set(this.options)
        this.render();
        this.model.on('change', this.render.bind(this));
        this.setComponent();
    },

    searchUser: function (e) {
        var val = $(e.currentTarget).val().trim();
        var recentlyEl = $('.recently', this.$el);
        var userFeedlistEl = $('.user-feedlist', this.$el);
        if (val == '赵英') {
            recentlyEl.hide();
            userFeedlistEl.show();
        } else {
            recentlyEl.show();
            userFeedlistEl.hide();
        }
    },
    toggleMenu: function (e) {
        var meEl = $(e.currentTarget);
        var leftEl = $('#page-left', this.$el);
        var rightEl = $('#page-right', this.$el);
        meEl.text('a')
        if (meEl.is('.on')) {
            meEl.html("&#xe602;").attr('title', '展开栏目');
            $('.leftmenu-wrap-s', leftEl).show();
            $('.leftmenu-wrap-b', leftEl).hide();
            meEl.removeClass('on');
            leftEl.removeClass('on');
            rightEl.removeClass('on');
        } else {
            meEl.html('&#xe600;').attr('title', '收起栏目');
            $('.leftmenu-wrap-s', leftEl).hide();
            $('.leftmenu-wrap-b', leftEl).show();
            meEl.addClass('on');
            leftEl.addClass('on');
            rightEl.addClass('on');
        }
    },
    setComponent: function () {
        this.header = new Header({
            el: '#header',
            index: this.options.index || 0
        });
        if (this.options.index > 0) {
            this.leftMenu = new LeftMenu({
                el: '#page-left',
                index: this.options.index || 0,
                submenuName: this.options.leftMenuCurName || ''
            });
        }

    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()))
        return this;
    }
});
module.exports = Layout;