/**
 * Created by 刘晓帆 on 2016-4-11.
 */
'use strict';
var tpl = require('./tpl.html');
var LeftMenu = Backbone.View.extend({
    template: _.template($(tpl).filter('#tpl-con').html()),
    events: {
        "mouseenter .leftmenu-wrap-s > li": "showSubMenu",
        "mouseleave .leftmenu-wrap-s .subm-con": "hideSubMenu",
        "mouseleave .leftmenu-wrap-s > li": "hideSubMenu",
    },
    initialize: function (options) {
        this.options = _.extend({
            index: 0,
            submenuName: ''
        }, options || {});
        this.beforeRender();
        this.render();
        this.renderMenu();
    },
    showSubMenu: function (e) {
        var liEl = $(e.currentTarget);
        var allSubbox = $('.leftmenu-wrap-s .subm-con', this.$el);
        var allBtn = $('.leftmenu-wrap-s .leftmenu-btn', this.$el);
        var subEl = $('.subm-con', liEl);
        var index = liEl.index();
        allSubbox.eq(index).fadeIn(200);
        allBtn.removeClass('active');
        $('.leftmenu-btn', liEl).addClass('active');
    },
    hideSubMenu: function () {
        $('.leftmenu-wrap-s .leftmenu-btn', this.$el).removeClass('active');
        $('.leftmenu-wrap-s .subm-con', this.$el).fadeOut(0);

    },
    renderMenu: function () {
        var index = this.options.index;
        if (index == 1) {
            $('.menuwrap', this.el).html(_.template($(tpl).filter('#tpl-dmpmenu').html()))
        }
        if (index == 2) {
            $('.menuwrap', this.el).html(_.template($(tpl).filter('#tpl-marketingmenu').html()))
        }
        if (index == 3) {
            $('.menuwrap', this.el).html(_.template($(tpl).filter('#tpl-insight').html()))
        }
        var submenuName = this.options.submenuName;
        var menua = $('.collapsible-body a', this.el);
        menua.each(function (i, m) {
            if ($(m).text() == submenuName) {
                $(m).closest('li').addClass('cur');
                $(m).closest('.collapsible-body').siblings('.collapsible-header').addClass('active');
            }
        });
    },
    beforeRender:function(){

    },
    render: function () {
        this.$el.html(this.template(this.options));

        return this;
    }
});

module.exports = LeftMenu;
