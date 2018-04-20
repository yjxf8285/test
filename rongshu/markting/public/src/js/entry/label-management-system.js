/**
 * Created by AnThen on 2016-5-10.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/label-management/system-tpl.html");
var tplData = require("html/label-management/system-data.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'系统标签'
});
//临时存放数据 todo：demo阶段是这么写，后期MVC模式要跟model关系打通，不能乱放
var tempData = {
    tit: ''
};
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: {
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateTable1: _.template($(tplData).filter('#tpl-tbody1').html()),
        templateDropdown1: _.template($(tplData).filter('#dropdown-content1').html()),
        templateTable2: _.template($(tplData).filter('#tpl-tbody2').html()),
        templateDropdown2: _.template($(tplData).filter('#dropdown-content2').html()),
        templateTable3: _.template($(tplData).filter('#tpl-tbody3').html()),
        templateDropdown3: _.template($(tplData).filter('#dropdown-content3').html()),
        templateTable4: _.template($(tplData).filter('#tpl-tbody4').html()),
        templateDropdown4: _.template($(tplData).filter('#dropdown-content4').html()),
        templateTable5: _.template($(tplData).filter('#tpl-tbody5').html()),
        templateDropdown5: _.template($(tplData).filter('#dropdown-content5').html()),
        templateTable6: _.template($(tplData).filter('#tpl-tbody6').html()),
        templateDropdown6: _.template($(tplData).filter('#dropdown-content6').html()),
        templateTable7: _.template($(tplData).filter('#tpl-tbody7').html()),
        templateDropdown7: _.template($(tplData).filter('#dropdown-content7').html()),
        templateTable8: _.template($(tplData).filter('#tpl-tbody8').html()),
        templateDropdown8: _.template($(tplData).filter('#dropdown-content8').html()),
        templateTable9: _.template($(tplData).filter('#tpl-tbody9').html()),
        templateDropdown9: _.template($(tplData).filter('#dropdown-content9').html()),
        templateTable10: _.template($(tplData).filter('#tpl-tbody10').html()),
        templateDropdown10: _.template($(tplData).filter('#dropdown-content10').html()),
        templateTable11: _.template($(tplData).filter('#tpl-tbody11').html()),
        templateDropdown11: _.template($(tplData).filter('#dropdown-content11').html()),
        templateTable12: _.template($(tplData).filter('#tpl-tbody12').html()),
        templateDropdown12: _.template($(tplData).filter('#dropdown-content12').html()),
        templateTable13: _.template($(tplData).filter('#tpl-tbody13').html()),
        templateDropdown13: _.template($(tplData).filter('#dropdown-content13').html())
    },
    //设置响应事件
    events: {
        "click #sync": "sync",
        "click .page-table-box tr": "trEvents",
        "click #lablelist li": "lablelist"
    },
    sync: function(e){
        var that = $(e.currentTarget);
        that.addClass('sync');
        setTimeout(function(){
            that.removeClass('sync');
            Materialize.toast('没有可更新的标签！',2000,'toast');
        },2000);
    },
    trEvents: function (e) {
        var meEl = $(e.currentTarget);
        tempData.tit = meEl.find('.first').text();
    },
    lablelist: function (e) {
        var thatText = $(e.currentTarget).text();
        $('#selectTtxt', this.el).text(thatText);
        switch (thatText) {
            case "用户标签-个人标签":
                $('#tbody-box', this.el).html(this.template.templateTable1(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown1(this.model.toJSON()));
                break;
            case "用户标签-家庭标签":
                $('#tbody-box', this.el).html(this.template.templateTable2(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown2(this.model.toJSON()));
                break;
            case "用户标签-宝宝标签":
                $('#tbody-box', this.el).html(this.template.templateTable3(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown3(this.model.toJSON()));
                break;
            case "用户标签-会员标签":
                $('#tbody-box', this.el).html(this.template.templateTable4(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown4(this.model.toJSON()));
                break;
            case "用户标签-位置标签":
                $('#tbody-box', this.el).html(this.template.templateTable5(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown5(this.model.toJSON()));
                break;
            case "交易标签-交易历史":
                $('#tbody-box', this.el).html(this.template.templateTable6(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown6(this.model.toJSON()));
                break;
            case "交易标签-交易偏好":
                $('#tbody-box', this.el).html(this.template.templateTable7(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown7(this.model.toJSON()));
                break;
            case "交易标签-售后行为":
                $('#tbody-box', this.el).html(this.template.templateTable8(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown8(this.model.toJSON()));
                break;
            case "互动标签-用户触达":
                $('#tbody-box', this.el).html(this.template.templateTable9(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown9(this.model.toJSON()));
                break;
            case "互动标签-互动历史":
                $('#tbody-box', this.el).html(this.template.templateTable10(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown10(this.model.toJSON()));
                break;
            case "互动标签-互动偏好":
                $('#tbody-box', this.el).html(this.template.templateTable11(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown11(this.model.toJSON()));
                break;
            case "意图标签-用户类型细分":
                $('#tbody-box', this.el).html(this.template.templateTable12(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown12(this.model.toJSON()));
                break;
            case "意图标签-用户意图预测":
                $('#tbody-box', this.el).html(this.template.templateTable13(this.model.toJSON()));
                $('#dropdown-box', this.el).html(this.template.templateDropdown13(this.model.toJSON()));
                break;
        }
        $('.dropdown-button-more').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false,
            hover: false,
            gutter: -5,
            belowOrigin: false
        });
    },
    initialize: function () {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
    },
    afterRender: function () {
        if ($('#mymodal').length == 0) {
            $('body').append('<div id="mymodal" class="modal"></div>');
        }
    },
    //组织视图模板
    render: function () {
        //加载主模板
        $('#page-body', this.el).html(this.template.templateMain(this.model.toJSON()));
        $('#tbody-box', this.el).html(this.template.templateTable1(this.model.toJSON()));
        $('#dropdown-box', this.el).html(this.template.templateDropdown1(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});

/************生成页面************/
var container = new Container({
    el: '#container'
});