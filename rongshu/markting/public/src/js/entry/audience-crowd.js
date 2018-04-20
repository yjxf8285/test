/**
 * Created by AnThen on 2016-5-9.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/audience/crowd-tpl.html");
//组件
var Modals = require('component/modals.js');
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'人群管理'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateMorelist: _.template($(tpl).filter('#tpl-morelist').html())
    },
    //设置响应事件
    events: {
        "click .list-ico": "showMorelist",
        "click #showgrouplist": layout.showgrouplist,//弹出人群中查找
        "click #delete-crowd-info": "deleteInfo"
    },
    showMorelist: function(e){
        var that = $(e.currentTarget),
            thatTrIndex = that.parents('tr').index();
        $('#morelist').attr('trigger',thatTrIndex);
    },
    deleteInfo: function(){
        var that = this;
        new Modals.Confirm({
            content:"您确实要删掉这条信息吗？",
            listeners:{
                close:function(type){
                    if(type){
                        var deleteIndex = parseInt($('#morelist').attr('trigger'));
                        $('#list-tbody').children('tr').eq(deleteIndex).empty().remove();
                        $('#morelist-box', that.$el).html(that.template.templateMorelist(that.model.toJSON()));
                        $('.dropdown-button').dropdown({
                            inDuration: 300,
                            outDuration: 225,
                            constrain_width: false,
                            hover: false,
                            gutter: 0,
                            belowOrigin: false
                        });
                    }else{
                        //console.log("click cancel");
                    }
                }
            }
        });
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织视图模板
    render: function () {
        //加载主模板
        $('#page-body', this.$el).html(this.template.templateMain(this.model.toJSON()));
        $('#morelist-box', this.$el).html(this.template.templateMorelist(this.model.toJSON()));
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#container'
});