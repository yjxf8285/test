/**
 * Created by 刘晓帆 on 2016-4-11.
 * 首页
 */
'use strict';
var tpl = require("html/index/index-tpl.html");//模板
var Layout = require('module/layout/layout');
var option1 = {
    title: {
        //text: '微信净增用户',
        x: 'center'
    },
    animation:false,//关闭动画效果
    //grid: {
    //    left: '3%',
    //    right: '4%',
    //    bottom: '8%',
    //    top: '20%',
    //    containLabel: true
    //},
    color: util.getChartColors(),
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['2月20日', '3月5日', '3月20日', '4月5日', '4月20日', '5月5日', '5月20日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '乐友孕婴童',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                }
            },
            data: [0, 10, 2, 10, 20, 20, 30]
        },
        {
            name: '乐友孕婴童陕西',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                }
            },
            data: [4, 5, 6, 60, 700, 5, 50]

        },
        {
            name: '天津乐友孕婴童',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                }
            },
            data: [8, 0, 10, 110, 380, 10, 70]


        },
        {
            name: '上海乐友孕婴童',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {type: 'default'},
                }
            },
            data: [12, 5, 14, 160, 60, 25, 90]

        }
    ]
};
var option2 = {
    //标题
    title: {
        //text: '活动转化分析',
        x: 'center'
        //subtext: '纯属虚构'
    },
    animation:false,//关闭动画效果
    //grid: {
    //    left: '1%',
    //    right: '1%',
    //    bottom: '1%',
    //    top: '1%',
    //    containLabel: true
    //},
    //hover提示
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    //图例按钮
    //legend: {
    //    y: 'bottom',
    //    data: ['客户量', '覆盖', '触达', '参与']
    //},
    //可计算
    calculable: true,
    //数据系列
    series: [
        {
            name: '数量',
            type: 'funnel',
            minSize: '40%',
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {
                    value: 100,
                    name: '客户量',
                    itemStyle: {
                        normal: {
                            color: '#8a93d9',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 69.53,
                    name: '覆盖',
                    itemStyle: {
                        normal: {
                            color: '#73a9dc',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 2.89,
                    name: '触达',
                    itemStyle: {
                        normal: {
                            color: '#62c1dc',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                },
                {
                    value: 0.07,
                    name: '参与',
                    itemStyle: {
                        normal: {
                            color: '#62dccf',
                            label: {
                                //position: 'inside',
                                formatter: '{c}%'
                            }
                        }
                    },
                }
            ]
        }
    ]
};
var option3 = {
    title: {
        //text: '活动分析',
        x: 'center'
    },
    animation:false,//关闭动画效果
    //grid: {
    //    left: '3%',
    //    right: '4%',
    //    bottom: '8%',
    //    top: '20%',
    //    containLabel: true
    //},
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['1日', '2日', '3日', '4', '5日', '6日', '7日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '阅读次数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#8a93d9',
                    areaStyle: {type: 'default'},
                }
            },
            data: [180, 260, 280, 180, 169, 100, 60]

        },
        {
            name: '阅读人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#73a9dc',
                    areaStyle: {type: 'default'},
                }
            },
            data: [145, 200, 210, 160, 235, 90, 40]


        },
        {
            name: '原文阅读次数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#62c1dc',
                    areaStyle: {type: 'default'},
                }
            },
            data: [120, 180, 181, 120, 210, 100, 45]


        },
        {
            name: '原文阅读人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#62dccf',
                    areaStyle: {type: 'default'},
                }
            },
            data: [95, 160, 152, 90, 185, 90, 40]
        },
        {
            name: '分享次数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#f8b656',
                    areaStyle: {type: 'default'},
                }
            },
            data: [22, 140, 160, 20, 16, 5, 1]

        },
        {
            name: '分享人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#f6c755',
                    areaStyle: {type: 'default'},
                }
            },
            data: [20, 120, 150, 16, 14, 5, 1]

        },
        {
            name: '收藏次数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#c090ec',
                    areaStyle: {type: 'default'},
                }
            },
            data: [35, 100, 65, 25, 15, 6, 5]

        },
        {
            name: '收藏人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#fd8eab',
                    areaStyle: {type: 'default'},
                }
            },
            data: [35, 80, 36, 28, 18, 4, 4]

        }
    ]
};
var option4 = {
    //grid: {
    //    left: '3%',
    //    right: '4%',
    //    bottom: '0%',
    //    top: '-10%',
    //    containLabel: true
    //},
    title: {
        //text: '用户来源',
        x: 'center'
    },
    animation:false,//关闭动画效果
    legend: {
        orient: 'vertical',
        x: '60%',
        y: '13%',
        radius: '80%',
        data: ['官网', 'APP', 'wechat微店', '乐海淘', '天猫旗舰店', '官网', '亚马逊', '其他电商平台']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',

            avoidLabelOverlap: false,
            radius: '80%',
            center: ['35%', '50%'],
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
            data: [
                {
                    itemStyle: {
                        normal: {
                            color: '#8a93d9',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    value: 2200, name: '京东'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#73a9dc',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 3100, name: 'APP'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#62c1dc',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 1620, name: 'wechat微店'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#62dccf',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 700, name: '乐海淘'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#f8b656',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 2500, name: '天猫旗舰店'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#f6c755',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 3980, name: '官网'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#c090ec',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 92, name: '亚马逊'
                },
                {
                    itemStyle: {
                        normal: {
                            color: '#fd8eab',
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }, value: 830, name: '其他电商平台'
                }
            ],

        }
    ]
};
//先创建布局
var layout = new Layout({
    index: 0,
    showLeft: false
});
//layout.duringTask(1)
//布局视图
var Index = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        listData: [{
            listName: '',
            listNum: '',
            groupData: []
        }]
    }),
    template: _.template($(tpl).filter('#tpl-layout').html()),
    events: {
        "click .seemore-btn": "seemore",
        "click .itemlistwrap li": "switchItem",
        "click .fnbtn-screen": "screen",
        "click .fnbtn-customview": "customview",
        "click .fnbtn-down": "down"
    },

    initialize: function (options) {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.options = _.extend({}, options);
    },
    afterRender: function () {
        this.myChart1 = echarts.init(document.getElementById('charts1'));
        this.myChart2 = echarts.init(document.getElementById('charts2'));
        this.myChart3 = echarts.init(document.getElementById('charts3'));
        this.myChart4 = echarts.init(document.getElementById('charts4'));
        this.myChart1.setOption(option1);
        this.myChart2.setOption(option2);
        this.myChart3.setOption(option3);
        this.myChart4.setOption(option4);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});

var index = new Index({
    el: '#page-body'
});

