/**
 * Created by AnThen on 2016/4/15.
 */
/*初始化必须的模块*/
'use strict';//严格模式
/*加载scss文件*/
//import style from '../../css/page/antest.scss'; //es6写法

/*加载模块*/
//加载本页模块
var tpl = require("../../html/antest/tpl.html");
//加载公用模块
var Header = require('module/header/header.js');

/*构造页面*/
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        template1: _.template($(tpl).filter('.tpl-header').html()),
        template2: _.template($(tpl).filter('.tpl-content').html()),
        template3: _.template($(tpl).filter('.tpl-footer').html())
    },
    //设置响应事件
    events: {
        "click .icon": "open",
        "click .button.edit": "openEditDialog",
        "click .button.delete": "destroy"
    },
    open: function () {
        var that = this;
        util.api({
            url: 'list',
            data: {
                id: 2
            },
            success: function (resData) {
                that.model.set({name: resData.data})
            }
        })
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.setComponent();
    },
    //加载公用模块
    setComponent: function () {
        this.header = new Header({
            el: '#header'
        });
    },
    //组织视图模板
    render: function () {
        this.$el.find('#content').html(
            this.template.template1(this.model.toJSON()) +
            this.template.template2(this.model.toJSON()) +
            this.template.template3(this.model.toJSON())
        );
        return this;
    }
});

/************生成页面************/

var container = new Container({
    el: '#container'
});
