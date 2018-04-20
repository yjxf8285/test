/**
 * Created by AnThen on 2016-5-12.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-access/weixin-tpl.html");
//加载组件
require('../component/index.js');
/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'微信接入'
});
//图表配置
var chartsOption = {
    color:util.getChartColors(),
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:['服务号关注量','订阅号关注量','个人号好友量']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'服务号关注量',
            type:'bar',
            data:[68413,70413,72413,74413,76413,78413,80413]
        },
        {
            name:'订阅号关注量',
            type:'bar',
            data:[79565,79915,80265,80615,80965,81315,81665]
        },
        {
            name:'个人号好友量',
            type:'bar',
            data:[3900,4300,4700,5100,5500,5900,6300]
        }
    ]
};
var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template: _.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "click #tab-table": "tabTable"
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
        $('#page-body', this.el).html(this.template(this.model.toJSON()));
        var myChart = echarts.init(document.getElementById('chartstop'), 'macarons');
        myChart.setOption(chartsOption);
        return this;
    }
});


/************生成页面************/
var container = new Container({
    el: '#container'
});