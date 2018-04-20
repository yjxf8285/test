/**
 * Created by liuxiaofan on 2016-5-4.
 * 细分管理
 */
'use strict';//严格模式

var tpl = require("html/audience/manage-tpl.html");//模板
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 2,
    leftMenuCurName: '细分管理'
});
var arr = function (n) {
    var res = [];
    for (var i = 0; i <= n; i++) {
        res.push(i)
    }
    return res;
}
//列表json数据
var listData = {
    0: [],
    1: [

        {
            name: '>8个月孕龄的孕期准妈妈'
        },
        {
            name: '<8个月孕龄的孕期准妈妈'
        },
        {
            name: '0~6个月新妈妈爸爸'
        },
        {
            name: '6~24个月宝宝父母'
        },
        {
            name: '7-12个月宝宝的会员'
        }
    ],
    2: [
        {
            name: '>8个月孕龄的孕期准妈妈'
        },
        {
            name: '<8个月孕龄的孕期准妈妈'
        },
        {
            name: '0~6个月新妈妈爸爸'
        },
        {
            name: '6~24个月宝宝父母'
        },
        {
            name: '7-12个月宝宝的会员'
        }
    ],
    3: [
        {
            name: '>8个月孕龄的孕期准妈妈'
        },
        {
            name: '<8个月孕龄的孕期准妈妈'
        },
        {
            name: '0~6个月新妈妈爸爸'
        },
        {
            name: '6~24个月宝宝父母'
        },
        {
            name: '7-12个月宝宝的会员'
        }
    ],
    999: [
        {
            name: '>8个月孕龄的孕期准妈妈'
        },
        {
            name: '<8个月孕龄的孕期准妈妈'
        }
    ],
    888: []
};
var chartsData = {
    1: [
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [0, 10, 2, 10, 20, 20, 30]
            }
        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [0, 10, 2, 10, 20, 20, 30]
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [21, 37, 32, 49, 119, 5, 43]

            }
        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [0, 10, 2, 10, 20, 20, 30]
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [21, 37, 32, 49, 119, 5, 43]
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [20, 36, 31, 48, 118, 4, 42]

            }
        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [0, 10, 2, 10, 20, 20, 30]
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [21, 37, 32, 49, 119, 5, 43]
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [20, 36, 31, 48, 118, 4, 42]

            },
            {
                name: '6~24个月宝宝父母',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [19, 35, 30, 47, 117, 3, 41]
            }
        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [0, 10, 2, 10, 20, 20, 30]
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [21, 37, 32, 49, 119, 5, 43]
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [20, 36, 31, 48, 118, 4, 42]

            },
            {
                name: '6~24个月宝宝父母',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [19, 35, 30, 47, 117, 3, 41]
            },
            {
                name: '7-12个月宝宝的会员',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [8, 3, 1, 4, 6, 2, 6]
            }
        ]

    ],
    2: [
        [
            {
                name: '数量',
                type: 'funnel',
                minSize: '40%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },

                itemStyle: {
                    normal: {
                        label: {
                            //position: 'inside',
                            formatter: '{c}%'
                        }


                    }

                },
                data: [
                    {value: 100, name: '人数'},
                    {value: 50.67, name: '覆盖'},
                    {value: 16.67, name: '触达'},
                    {value: 8.89, name: '参与'}
                ]
            }
        ],
        [
            {
                name: '数量',
                type: 'funnel',
                minSize: '40%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },

                itemStyle: {
                    normal: {
                        label: {
                            //position: 'inside',
                            formatter: '{c}%'
                        }


                    }

                },
                data: [
                    {value: 100, name: '人数'},
                    {value: 60.67, name: '覆盖'},
                    {value: 26.67, name: '触达'},
                    {value: 18.89, name: '参与'}
                ]
            }
        ],
        [
            {
                name: '数量',
                type: 'funnel',
                minSize: '40%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },

                itemStyle: {
                    normal: {
                        label: {
                            //position: 'inside',
                            formatter: '{c}%'
                        }


                    }

                },
                data: [
                    {value: 100, name: '人数'},
                    {value: 70.67, name: '覆盖'},
                    {value: 36.67, name: '触达'},
                    {value: 28.89, name: '参与'}
                ]
            }
        ],
        [
            {
                name: '数量',
                type: 'funnel',
                minSize: '40%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },

                itemStyle: {
                    normal: {
                        label: {
                            //position: 'inside',
                            formatter: '{c}%'
                        }


                    }

                },
                data: [
                    {value: 100, name: '人数'},
                    {value: 80.67, name: '覆盖'},
                    {value: 46.67, name: '触达'},
                    {value: 38.89, name: '参与'}
                ]
            }
        ],
        [
            {
                name: '数量',
                type: 'funnel',
                minSize: '40%',
                labelLine: {
                    normal: {
                        show: false
                    }
                },

                itemStyle: {
                    normal: {
                        label: {
                            //position: 'inside',
                            formatter: '{c}%'
                        }


                    }

                },
                data: [
                    {value: 100, name: '人数'},
                    {value: 90.67, name: '覆盖'},
                    {value: 56.67, name: '触达'},
                    {value: 48.89, name: '参与'}
                ]
            }
        ]
    ],
    3: [
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 80], [100, 60], [150, 80], [200, 100], [250, 60], [300, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '100'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '54'}
                    ]
                }
            }

        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 80], [100, 60], [150, 80], [200, 100], [250, 60], [300, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '100'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '54'}
                    ]
                }
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 60], [100, 100], [150, 140], [200, 80], [250, 50], [300, 10]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '140'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '63'}
                    ]
                }
            }
        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 80], [100, 60], [150, 80], [200, 100], [250, 60], [300, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '100'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '54'}
                    ]
                }
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 60], [100, 100], [150, 140], [200, 80], [250, 50], [300, 10]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '140'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '63'}
                    ]
                }
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 100], [100, 70], [150, 40], [200, 60], [250, 30], [300, 30]


                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '110'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '47'}
                    ]
                }
            }

        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [10, 10], [50, 80], [99, 60], [12, 80], [200, 100], [250, 60], [234, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '100'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '54'}
                    ]
                }
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 60], [100, 100], [150, 140], [200, 80], [250, 50], [300, 10]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '140'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '63'}
                    ]
                }
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 88], [109, 70], [150, 40], [222, 60], [250, 30], [258, 30]


                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '110'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '47'}
                    ]
                }
            },
            {
                name: '6~24个月宝宝父母',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 120], [100, 80], [150, 40], [200, 10], [250, 10], [300, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '120'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '37'}
                    ]
                }
            }

        ],
        [
            {
                name: '>8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 80], [100, 60], [150, 80], [200, 100], [250, 60], [300, 0]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '100'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '54'}
                    ]
                }
            },
            {
                name: '<8个月孕龄的孕期准妈妈',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [0, 0], [50, 60], [89, 100], [150, 140], [145, 80], [210, 50], [240, 34]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '140'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '63'}
                    ]
                }
            },
            {
                name: '0~6个月新妈妈爸爸',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [33, 0], [233, 100], [123, 70], [167, 40], [189, 60], [188, 30], [288, 45]


                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '110'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '47'}
                    ]
                }
            },
            {
                name: '6~24个月宝宝父母',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [3, 0], [50, 120], [56, 80], [98, 40], [79, 10], [288, 10], [187, 100]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '120'},
                        {type: 'min', name: '0'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '37'}
                    ]
                }
            },
            {
                name: '7-12个月宝宝的会员',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[0] / 8);
                },
                data: [
                    [10, 30], [52, 60], [45, 80], [56, 70], [76, 120], [55, 60], [257, 20]

                ],

                markPoint: {
                    data: [
                        {type: 'max', name: '120'},
                        {type: 'min', name: '30'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '63'}
                    ]
                }
            }
        ]

    ]
};

// 指定图表的配置项和数据
var option1 = {
    title: {
        //text: '净增人数',
        x: 'center'
    },
    animation:false,//关闭动画效果
    color: util.getChartColors(),
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            //name: '日期',
            axisLabel: {
                formatter: '{value}'
            },
            boundaryGap: false,
            data: ['2月20日', '3月5日', '3月20日', '4月5日', '4月20日', '5月5日', '5月20日']
            //data: arr(90)
        }
    ],
    yAxis: [
        {
            type: 'value',
            //name: '人次',
            axisLabel: {
                formatter: '{value} 人'
            }
        }
    ],
    series: chartsData[1]
};
var option2 = {
    //标题
    title: {
        //text: '活动转化分析',
        x: 'center'
    },
    animation:false,//关闭动画效果
    color: util.getChartColors(),
    //hover提示
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    //图例按钮
    legend: {
        y: 'bottom',
        data: ['人数', '覆盖', '触达', '参与']
    },
    //可计算
    calculable: true,
    //数据系列
    series: chartsData[2]
};
var option3 = {
    title: {
        //text: '活跃用户分析',
        x: 'center'
    },
    animation:false,//关闭动画效果
    color: util.getChartColors(),
    tooltip: {
        trigger: 'axis'
    },

    xAxis: [
        {
            type: 'value',
            name: '生命周期',
            axisLabel: {
                formatter: function (v, a) {
                    return v + ' 天'
                }
            },
            boundaryGap: false
        }
    ],

    yAxis: [
        {
            type: 'value',
            'name': '活跃度',
            scale: true,
            axisLabel: {
                formatter: '{value} 人次'
            }
        }
    ],
    series: chartsData[3]
};
var myChart1, myChart2, myChart3;
//列表视图
var ListV = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model({
        listData: [
            {
                name: '>8个月孕龄的孕期准妈妈'
            },
            {
                name: '<8个月孕龄的孕期准妈妈'
            },
            {
                name: '0~6个月新妈妈爸爸'
            },
            {
                name: '6~24个月宝宝父母'
            },
            {
                name: '7-12个月宝宝的会员'
            }
        ]
    }),
    events: {
        "change .checkitem": "selectItem"//复选框事件
    },
    template: _.template($(tpl).filter('#tpl-list').html()),
    selectItem: function (e) {
        var meEl = $(e.currentTarget);
        var len = $(':checked', this.el).length - 1;
        option1.series = chartsData[1][len];
        option2.series = chartsData[2][len];
        option3.series = chartsData[3][len];
        this.options.reloadCharts.call(manage);
    },
    initialize: function (options) {
        var that = this;
        this.render();
        this.model.on('change', function (m) {
            that.render();
        });
        this.options = _.extend({}, options);
    },
    refresh: function (index) {
        this.model.set({listData: listData[index]})
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

//布局视图
var Manage = Backbone.View.extend({
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
        "click .tabs .tab a": "tabEvent",//切换事件
        "click #group-all": "selectAllfeed",
        "keyup .search-input": "searchfeed"
    },
    //搜索列表
    searchfeed: function (e) {
        var val = $(e.currentTarget).val().trim();
        if (val == '8') {
            this.listV.refresh(999);
            $('.checkitem', this.el).click();
        } else if(val==''){
            this.listV.refresh(1);
            $('.checkitem', this.el).click();
        }else{
            this.listV.refresh(888);
            $('#group-all', this.el).prop('checked', false);
        }

    },
    //tab切换事件
    tabEvent: function (e) {
        var meEl = $(e.currentTarget);
        var id = meEl.attr('href').trim().slice(meEl.attr('href').trim().indexOf('#') + 1);
        $('#group-all', this.el).prop('checked', false);
        $('.search-input', this.el).val('');
        this.options.feedIndex = id;
        this.listV.refresh(id);
        $('#group-all', this.el).click();//先全部选中
    },
    //选中所有的复选框
    selectAllfeed: function () {
        var meEl = $('#group-all', this.el);
        if (meEl.is(':checked')) {
            $('.checkitem', this.$el).prop('checked', true);
        } else {
            $('.checkitem', this.$el).prop('checked', false);
        }
        var curItemLength = ($('.itemlist-wrap :checked', this.el).length) - 1;
        option1.series = chartsData[1][curItemLength];
        option2.series = chartsData[2][curItemLength];
        option3.series = chartsData[3][curItemLength];

        this.reloadCharts();
    },
    //更新图表
    reloadCharts: function () {
        var len = $('.checkitem:checked', this.el).length;
        var allItemLen = $('.checkitem', this.el).length;
        myChart1.clear();
        myChart2.clear();
        myChart3.clear();
        myChart1.setOption(option1);
        myChart2.setOption(option2);
        myChart3.setOption(option3);
        if (len == allItemLen) {
            $('#group-all').prop('checked', true);
        } else {
            $('#group-all').prop('checked', false);
        }
        if (len == 0) {
            $('.main-r .nodata', this.el).show();
            $('.main-r .havedata', this.el).hide();
        } else {
            $('.main-r .nodata', this.el).hide();
            $('.main-r .havedata', this.el).show();
        }
    },
    //选中全部图表
    allCharts: function () {
        option1.series = chartsData[1][2];
        option2.series = chartsData[2][2];
        option3.series = chartsData[3][2];
        this.reloadCharts();
    },

    initialize: function (options) {
        var that = this;
        this.render();
        this.renderCharts();
        this.renderSubView();
        $('#group-all', this.el).click();//先全部选中
        this.model.on('change', function (m) {
            that.render();
        });
        this.options = _.extend({}, options);
    },
    //渲染子视图
    renderSubView: function () {
        this.listV = new ListV({
            el: $('.itemlist-wrap', this.el),
            reloadCharts: this.reloadCharts
        })
    },
    //渲染charts
    renderCharts: function () {
        // 基于准备好的dom，初始化echarts实例
        myChart1 = echarts.init(document.getElementById('chartstop'), 'macarons');
        myChart2 = echarts.init(document.getElementById('chartsleft'), 'macarons');
        myChart3 = echarts.init(document.getElementById('chartsright'), 'macarons');
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var manage = new Manage({
    el: '#page-body'
});



