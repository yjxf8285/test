/**
 * Created by AnThen on 2016-5-10.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-supervise/quality-report-tpl.html");
//加载组件
var Modals = require('component/modals.js');

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'数据质量报告'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:{
        templateMain: _.template($(tpl).filter('#tpl-content').html()),
        templateTable: _.template($(tpl).filter('#tpl-table').html())
    },
    //设置响应事件
    events: {
        "click .moreico": "moreicoIndex",
        "change #uploadFile": "uploadFile"
    },
    moreicoIndex : function(e){
        var that = $(e.currentTarget),
            thatIllegal = that.parents('tr').children('.illegal'),
            thatTrIndex = that.parents('tr').index();
        if(thatIllegal.html().trim() == ''){
            $('#morelist li:last-child').addClass('stop');
        }else{
            $('#morelist li:last-child').removeClass('stop');
        };
        $('#morelist').attr('trigger',thatTrIndex);
    },
    uploadFile: function(e){
        var that = $(e.currentTarget),
            thatFile = that.val(),
            modifyHtml = "",
            modifyHtml1 = "<a class='download' href='",
            modifyHtml2 = "'>",
            modifyHtml3 = "</a><div class='time'>",
            modifyHtml4 = "</div>",
            newtime = getdata(),
            trigger = parseInt(that.parents('#morelist').attr('trigger')),
            where = $('#quality-report-table').children('tbody').children('tr').eq(trigger).children('#modify');
        layout.duringTask(1);
        modifyHtml = modifyHtml1 + thatFile + modifyHtml2 + thatFile + modifyHtml3 + newtime + modifyHtml4;
        where.html(modifyHtml);
        new Modals.Alert("上传成功 !");

        //当前时间
        function getdata(){
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var minutes = date.getMinutes();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if(minutes >= 0 && minutes <= 9){
                minutes = "0" + minutes;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + minutes;
            return currentdate;
        };
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
        $('#table-box', this.el).html(this.template.templateTable(this.model.toJSON()));
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#container'
});