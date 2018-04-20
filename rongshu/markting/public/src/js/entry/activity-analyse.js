/**
 * Created by AnThen on 2016-5-19.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/activity/analyse-tpl.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName:'活动管理'
});

/*echarts图*/
var echart1 = {
    color:util.getChartColors(),//自定义的色卡
    title: {
        text: ''
    },
    legend: {
        bottom:'5%',
        data:['阅读次数','阅读人数','原文阅读次数','原文阅读人数','分享次数','分享人数','收藏次数','收藏人数']
    },
    grid: {
        top:'5%',
        left: '3%',
        right: '4%',
        bottom: '25%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1日','2日','3日','4日','5日','6日','7日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'阅读次数',
            type:'line',
            data: [180, 260, 280, 180, 169, 100, 60]
        },
        {
            name:'阅读人数',
            type:'line',
            data: [145, 200, 210, 160, 235, 90, 40]
        },
        {
            name:'原文阅读次数',
            type:'line',
            data: [120, 180, 181, 120, 210, 100, 45]
        },
        {
            name:'原文阅读人数',
            type:'line',
            data: [95, 160, 152, 90, 185, 90, 40]
        },
        {
            name:'分享次数',
            type:'line',
            data: [22, 140, 160, 20, 16, 5, 1]
        },
        {
            name:'分享人数',
            type:'line',
            data: [20, 120, 150, 16, 14, 5, 1]
        },
        {
            name:'收藏次数',
            type:'line',
            data: [35, 100, 65, 25, 15, 6, 5]
        },
        {
            name:'收藏人数',
            type:'line',
            data: [35, 80, 36, 28, 18, 4, 4]
        }
    ]
};
var echart2 = {
    color:util.getChartColors(),//自定义的色卡
    title: {
        text: '',
        subtext: ''
    },
    legend: {
        y: '90%',
        data: ['人数','覆盖','触达','参与']
    },
    calculable: true,
    series: [
        {
            name:'活动转化',
            type:'funnel',
            left: '10%',
            top: 0,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '25%',
            maxSize: '75%',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                },
                emphasis: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: [
                {value: 100, name: '人数'},
                {value: 80, name: '覆盖'},
                {value: 60, name: '触达'},
                {value: 40, name: '参与'}
            ]
        }
    ]
};
var echart3 = {
    color:util.getChartColors(),//自定义的色卡
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: '70%',
        y: '16%',
        radius: '100%',
        data:['官网','wechat微店','天猫旗舰店','亚马逊','APP','乐海涛','京东','其他电商平台']
    },
    series: [
        {
            name:'客户来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:2200, name:'官网'},
                {value:1620, name:'wechat微店'},
                {value:2500, name:'天猫旗舰店'},
                {value:92, name:'亚马逊'},
                {value:3100, name:'APP'},
                {value:700, name:'乐海涛'},
                {value:3980, name:'京东'},
                {value:830, name:'其他电商平台'}
            ]
        }
    ]
};

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:_.template($(tpl).filter('#tpl-content').html()),
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
    //组织完试图做的事情
    afterRender: function () {
        this.myChart1 = echarts.init(document.getElementById('active'), 'macarons');
        this.myChart1.setOption(echart1);
        this.myChart1 = echarts.init(document.getElementById('analysis'), 'macarons');
        this.myChart1.setOption(echart2);
        this.myChart1 = echarts.init(document.getElementById('distribution'), 'macarons');
        this.myChart1.setOption(echart3);
    },
    //组织视图模板
    render: function () {
        //加载主模板
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#page-body'
});