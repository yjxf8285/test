/**
 * Created by AnThen on 2016-5-9.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/activity/supervise-tpl.html");
//组件
var Modals = require('component/modals.js');

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'活动管理'
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
        templateTableDefault: _.template($(tpl).filter('#tpl-table3').html() + $(tpl).filter('#tpl-table4').html()),
        templateMorelist: _.template($(tpl).filter('#tpl-morelist').html())
    },
    //设置响应事件
    events: {
        "click #activitySuperviseMoreList": "activitySuperviseMoreList",
        "keyup .activity-supervise-search-input": "activitySuperviseSearch",
        "click #activitySuperviseDelete": "activitySuperviseDelete",
        "click #search-ico": "searchShow",
        "blur #search-input": "searchHide",
        "click #tab-table": "tabTable"
    },
    activitySuperviseMoreList: function(e){
        var that = $(e.currentTarget),
            thisParentsType = that.parents('tr').attr('class'),
            thatTrIndex = that.parents('tr').index(),
            morelistLastChild = $('#morelist').children('li:last-child');
        $('#morelist').attr('trigger',thatTrIndex);
        morelistLastChild.removeClass();
        if(thisParentsType == "going"){
            morelistLastChild.addClass('close');
        };
    },
    activitySuperviseSearch: function(e){
        var val = $(e.currentTarget).val().trim();
        var recentlyEl = $('.nodata', this.$el);
        var feedlistEl = $('.search-feeds', this.$el);
        if (val.length > 0) {
            recentlyEl.hide();
            feedlistEl.show();
        } else {
            recentlyEl.show();
            feedlistEl.hide();
        }
        if (val == 'age') {
            feedlistEl.html('<li class="count">共找到1条记录</li> <li>1. 风继续吹</li>');
        } else if (val == 'name') {
            feedlistEl.html('<li class="count">共找到3条记录</li> <li>1.2016年迎新活动</li> <li>1.2016年迎新活动</li> <li>1.2016年迎新活动</li>');
        } else {
            recentlyEl.show();
            feedlistEl.hide();
        }
    },
    activitySuperviseDelete: function(e){
        var thisParentsType = $(e.currentTarget).parents('li').attr('class');
        if(thisParentsType != "close"){
            var that = this;
            new Modals.Confirm({
                content:"您确实要删掉这条信息吗？",
                listeners:{
                    close:function(type){
                        if(type){
                            var deleteIndex = parseInt($('#morelist').attr('trigger'));
                            $('#tbody-box').children('tr').eq(deleteIndex).empty().remove();
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
        };
    },
    searchShow: function (e) {
        //$('#search-ico', this.$el).addClass('hide');
        $('#search-input', this.$el).addClass('show');
    },
    searchHide: function (e) {
        $('#search-input', this.$el).removeClass('show').val('');
        //$('#search-ico', this.$el).removeClass('hide');

    },
    tabTable: function(e){
        var thisType = $(e.currentTarget).attr('type');
        switch (thisType){
            case "table1":
                $('#tbody-box', this.el).html(this.template.templateTable1(this.model.toJSON()));
                break;
            case "table2":
                $('#tbody-box', this.el).html(this.template.templateTable2(this.model.toJSON()));
                break;
            case "table3":
                $('#tbody-box', this.el).html(this.template.templateTable3(this.model.toJSON()));
                break;
            case "table4":
                $('#tbody-box', this.el).html(this.template.templateTable4(this.model.toJSON()));
                break;
            case "table5":
                $('#tbody-box', this.el).html(this.template.templateTableDefault(this.model.toJSON()));
                break;
        };
        $('#morelist-box', this.$el).html(this.template.templateMorelist(this.model.toJSON()));
        $('.dropdown-button-more').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: 0,
            belowOrigin: false
        });
        console.log(111)
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    //组织完试图做的事情
    afterRender: function () {
        var tbodyBoxObject = $('#tbody-box').width() * 0.17;
        var aaa = $('.tbody-box-object').css('width',tbodyBoxObject);
    },
    //组织视图模板
    render: function () {
        //加载主模板
        $('#page-body', this.$el).html(this.template.templateMain(this.model.toJSON()));//table-box
        $('#tbody-box', this.$el).html(this.template.templateTableDefault(this.model.toJSON()));
        $('#morelist-box', this.$el).html(this.template.templateMorelist(this.model.toJSON()));
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#container'
});