/**
 * Created by liuxiaofan on 2016-5-4.
 */
'use strict';//严格模式

var tpl = require("html/asset/weixin-tpl.html");//模板
var Layout = require('module/layout/layout');
var Modals = require('component/modals.js');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName: '微信资产'
});
//右侧页面的view
var PageRight = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        data: {}
    }),
    template: _.template($(tpl).filter('#tpl-pageright').html()),
    //设置响应事件
    events: {
        "click .j-savecrowd": "savecrowd",
        "click .j-setname": "setname",
        "click #group-all": "selectAllfeed",
        "click .showgrouplist": layout.showgrouplist,//弹出人群中查找
    },
    savecrowd: function () {
        new Modals.Window({
            id: 1,
            title: "保存人群",
            content: '<div style="margin: 30px 0;"><div class="input-field "> <input id="weixin-nickname" type="text" class="validate"> <label for="weixin-nickname" class="">名称</label> </div></div>',
            width: '380',//默认是auto
            buttons: [{
                text: '确定',
                handler: function (self) {
                    self.close();
                    var val = $('#weixin-nickname').val().trim();
                  if(val){
                      Materialize.toast('保存成功!', 3000)
                  }else{
                      Materialize.toast('保存失败!', 3000)
                  }


                }
            },
                {
                    text: '取消',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件

                close: function () {
                    console.log(this.$el)
                }
            }

        })
    },
    setname: function () {

        new Modals.Window({
            id: 2,
            title: "设置昵称",
            content: '<div style="margin: 30px 0;"><div class="input-field "> <input id="weixin-nickname" type="text" class="validate"> <label for="weixin-nickname" class="">名称</label> </div></div>',
            width: '380',//默认是auto
            buttons: [{
                text: '确定',
                handler: function (self) {
                    self.close();
                    var val = $('#weixin-nickname').val().trim();
                    if (val) {
                        $('.weixin-asset-list .cur .name').text(val);
                        $('.option-area .header .user-name .txt').text(val);
                    }
                }
            },
                {
                    text: '取消',
                    handler: function (self) {
                        self.close();
                    }
                }
            ],
            listeners: {//window监听事件事件

                close: function () {

                }
            }

        })
    },
    //选中所有的复选框
    selectAllfeed: function (e) {
        var meEl = $(e.currentTarget);
        if (meEl.is(':checked')) {
            $('.checkitem', this.$el).prop('checked', true);
        } else {
            $('.checkitem', this.$el).prop('checked', false);
        }
    },
    initialize: function () {
        var that = this;
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织视图模板
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $('.dropdown-button').dropdown();
        return this;
    }
});

//微信号列表view
var WeixinList = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        listData: []
    }),
    template: _.template($(tpl).filter('#tpl-weixinlist').html()),
    events: {
        "click .weixin-asset-list li": "selectWeixin",
    },
    selectWeixin: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        var i = meEl.index();
        $('li', this.$el).removeClass('cur');
        meEl.addClass('cur')
        this.pageRight.model.set({
            data: that.model.get('listData').data[i]
        })
    },
    initialize: function () {
        var that = this;
        this.model.on('change', function (m) {
            that.render();
        });
    },
    afterRender: function () {
        var that = this;
        if (!this.pageRight) {
            this.pageRight = new PageRight({
                el: $('.option-area')
            });
        }
        $('li', this.$el).eq(0).trigger('click')
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});

//最大容器view
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        mainData: []
    }),
    template: _.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "click .tabs li ": "tabEvent",
    },
    tabEvent: function (e) {
        var that = this;
        var meEl = $(e.currentTarget);
        var index = meEl.index();
        if (meEl.is('.disabled'))return;
        this.weixinList.model.set({
            listData: that.model.get('mainData')[index]
        })

    },


    initialize: function () {
        var that = this;
        this.load();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    afterRender: function () {
        var that = this;

        this.weixinList = new WeixinList({
            el: $('.weixinlist-wrap', that.$el)
        });
        $('ul.tabs').tabs();
        this.weixinList.model.set({
            listData: that.model.get('mainData')[0]
        })

    },
    load: function () {
        var that = this;
        util.api({
            surl: '/apidata/weixinasset.json',
            success: function (resData) {
                that.model.set({
                    mainData: resData
                });
            }
        });
    },
    //组织视图模板
    render: function () {

        //加载主模板
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});


var container = new Container({
    el: '#page-body'
});

