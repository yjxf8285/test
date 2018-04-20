/**
 * Created by AnThen on 2016-5-11.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/label-management/custom-tpl.html");
//组件
var Modals = require('component/modals.js');

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'自定义标签'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:{
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateTable1: _.template($(tpl).filter('#tpl-table1').html()),
        templateTable2: _.template($(tpl).filter('#tpl-table2').html()),
        templateTable3: _.template($(tpl).filter('#tpl-table3').html()),
        templateTable4: _.template($(tpl).filter('#tpl-table4').html()),
        templateTable5: _.template($(tpl).filter('#tpl-table5').html()),
        templateTable6: _.template($(tpl).filter('#tpl-table6').html()),
        templateDropdown: _.template($(tpl).filter('#dropdown-content').html())
    },
    //设置响应事件
    events: {
        //"click #pagination li a": "pagination",//后期封装成组件这里不需要写分页逻辑
        "click #showgrouplist": layout.showgrouplist,//弹出人群中查找
        "click .dropdown-button-more": "showMorelist",
        "click #delete": "delete"
    },
    showMorelist: function(e){
        var that = $(e.currentTarget),
            thatTrIndex = that.parents('tr').index();
        $('#morelist').attr('trigger',thatTrIndex);
    },
    delete: function(){
        var that = this;
        new Modals.Confirm({
            content:"您确定要删除这个标签吗？",
            listeners:{
                close:function(type){
                    if(type){
                        var deleteIndex = parseInt($('#morelist').attr('trigger'));
                        $('#tbody-box').children('tr').eq(deleteIndex).empty().remove();
                        $('#dropdown-box', that.$el).html(that.template.templateDropdown(that.model.toJSON()));
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
        $('#page-body', this.el).html(this.template.templateMain(this.model.toJSON()));
        $('#tbody-box', this.el).html(this.template.templateTable1(this.model.toJSON()));
        $('#dropdown-box', this.el).html(this.template.templateDropdown(this.model.toJSON()));
        //$('#pagination-box', this.el).html(this.template.templateagination(this.model.toJSON()));//统一分页
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#container'
});