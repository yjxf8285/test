/**
 * Author LLJ
 * Date 2016-5-3 9:33
 */
var Modals = require('component/modals.js');
var Mock = require('../mock/data.js');
var MockData = {
    legend: {
        data: ['展现', '点击', '访问', '咨询', '订单']
    },
    data: [
        {value: 100, name: '展现'},
        {value: 50, name: '点击'},
        {value: 40, name: '访问'},
        {value: 30, name: '咨询'},
        {value: 15, name: '订单'}
    ]
};
var Random = 0;
var BarData = {
    color: ['#5182ad'],
    title: {
        text: ''
    },
    legend: {
        data: []
    },
    xAxis: {
        splitLine: {show: false},
        data: []
    },
    yAxis: {
        splitLine: {show: false},
        show: false
    },
    series: [{
        name: '',
        data: []
    }]
};
function getData(num) {
    var data = [];
    switch (num) {
        case 0:
            data = [{data: []}];
            break;
        case 1:
            data = [{
                top: 5,
                minSize: '40%',
                data: [{value: 100, name: TMPConditionNames[0]}]
            }]
            break;
        case 2:
            data = [{
                top: 5,
                minSize: '40%',
                data: [{value: 100, name: TMPConditionNames[0]},
                    {value: 50, name: TMPConditionNames[1]}]
            }]
            break;
        case 3:
            data = [{
                top: 5,
                minSize: '45%',
                data: [{value: 90, name: TMPConditionNames[0]},
                    {value: 60, name: TMPConditionNames[1]},
                    {value: 30, name: TMPConditionNames[2]}
                ]
            }]
            break;
    }
    return data;
}


function changeData(data) {
    var len = data[0].data.length;
    if (len == 1) {
        data[0].data[0].value = 80;
    } else if (len == 2) {
        data[0].data[0].value = 80;
        data[0].data[1].value = 40;
    } else if (len == 3) {
        data[0].data[0].value = 80;
        data[0].data[1].value = 50;
        data[0].data[2].value = 25;
    }
}

var TMPConditionNames;
//-----------------Mock end------------
var resultAreaTpls = require('../tpl/result-area-tpl.html');
var tooblarTpls = require('../tpl/toolbar.html');
var modalsTpl = require("../tpl/modal-tpl.html");

var rightTpls = require('../tpl/right-tpl.html');
var groupTpl = require('../tpl/group-tpl.html');
var TAGS = ['性别', '年龄', '家庭角色', '婚姻状况', '个人年收入范围', '孕产状态', '宝宝年龄', '宝宝性别', '会员级别', '会员生命周期定义', '居住位置', '曾购买的品类', '最近一次购买间隔', '客单价', '购买品牌偏好', '促销机制偏好', '曾经投诉', '用户招募来源', '最近一次参与的活动', '触达渠道偏好'];
function getDateStr() {
    var date = new Date(); //日期对象
    var now = "";
    now = date.getFullYear() + "-";
    now = now + (date.getMonth() + 1) + "-";
    now = now + date.getDate() + " ";
    now = now + date.getHours() + ":";
    now = now + date.getMinutes() + ":";
    now = now + date.getSeconds() + "";
    return now;
}
function getConditionResDataByKey(k) {
    var res = [];
    Mock.tag.forEach(function (itm, i) {
        if (itm.name == k) {
            res.push(itm);
        }
    })
    return res;
}
function getSuggestDataByKey(k) {
    var res = [];
    Mock.tag.forEach(function (itm, i) {
        if (itm.name.indexOf(k) > -1) {
            res.push(itm.name);
        }
    })
    return res;
}
//控制器
function controller() {
    var events = {};
    var _this = this;

    function delGroupCondition(e) {
        var group = $(e.currentTarget).siblings(".group-box"),
            gId = group.attr('id');
        group.children(".init").remove();
        //var chartId=_this.getChartIdByGId(gId);
        //console.log('chartId',chartId)
        //_this.delChartCanvas(chartId);
        _this.checkoutGroup();
        var chartId = _this.getChartIdByGId(gId);
        _this.resizeFunnelChart(chartId);

    }

    function delSingleCondition(e) {
        var group = $(e.currentTarget).parent().parent().parent(),
            gId = group.attr('id');
        $(e.currentTarget).parent().parent().remove();
        _this.loadChartByGroup(gId);
        _this.checkoutGroup();
        var chartId = _this.getChartIdByGId(gId);
        _this.resizeFunnelChart(chartId);
    }
    //chart 初始化
    function initChart(arg) {
        _this.charts.create(arg);
    }
    //改变搜索结果html
    function changeResultArea(html) {
        _this.view.$el.find('#result-area').html(html)
    }
    //增加标签
    function addTag() {
        var val = $('#tag-name').val();
        if ($.trim(val)) {
            var html = '<div class="segment-tag">' + val + '<i class="icon iconfont rui-close">&#xe622;</i></div>';
            $('#tag-wrap').append(html);
        }

    }
    //绑定键盘事件
    function bindKeydown(type) {
        if (type) {
            document.onkeydown = function (e) {
                e = e || window.event;
                if ((e.keyCode || e.which) == 13) {
                    addTag();
                }
            }
        } else {
            document.onkeydown = null;
        }
    }

    //发布
    function doRelease() {
        $('#rui-modals-edit').hide();
        $('#rui-modals-save').addClass("rui-disabled");
    }
    //变换toolbar title
    function changeAudienceTitle(title,release) {
        //"
        var release =release|| $('#audience-release')[0] && $('#audience-release')[0].checked;
        var name = title || $('#audience-name').val();
        if ($.trim(name)) {
            var dateTime = getDateStr();
            var html = _.template($(tooblarTpls).filter("#toolbar").html())({
                name: name,
                release: release,
                dateTime: dateTime
            });
            //var html=name+'<span class="color">&nbsp;|&nbsp;'+(release?'发布':'未发布')+'&nbsp;|&nbsp;</span>2016-03-19&nbsp;18:00:00&nbsp;&nbsp;&nbsp;<span class="color">由</span>&nbsp;张三&nbsp;<span class="color">最后修改</span>';
            $('#audience-edit-result').html(html);
        }

    };

    this.loadChartByGroup = function (gId, isChange, xAxis) {
        var funnelChartNum = this.getFunnelChartsNum();
        //TODO::
        var num = 0;
        if (gId == 'bar1') {
            this.addBgImg('drawing4', true)
            if (Random == null) {
                BarData.series = [{
                    name: '',
                    data: [{
                        data: []
                    }]
                }];
                BarData.xAxis = {
                    splitLine: {show: false},
                    data: [],
                    show: false
                };
            } else {
                this.addBgImg('drawing4', false);
                //删除最后一个字段
                xAxis.splice(-1, 1);
                BarData.series = [{
                    name: '',
                    data: (function () {
                        var arr = [];
                        xAxis.forEach(function (itm, i) {
                            arr.push(Math.ceil(Math.random() * 100))
                        })
                        return arr;
                    })()
                }];
                BarData.xAxis = {
                    splitLine: {show: false},
                   // 'type':'category',
                   // 'axisLabel':{'interval':0},
                    show: true,
                    data: xAxis
                };
            }
            _this.charts.getChartById("bar1").setOption(BarData);
            return;
        }
        _this.view.$el.find("#" + gId + ' .dom-dragable').each(function (i, itm) {
            num++;
        })
        var chartId = _this.getChartIdByGId(gId);
        if (!_this.charts.getChartById(chartId)) {
            _this.createNewChartCanvas(chartId);
            _this.charts.create({
                id: chartId,
                type: 'funnel',
                renderTo: '#' + chartId
            })
        }
        TMPConditionNames = _this.getConditionNamesByGId(gId);
        var data = getData(num >= 3 ? 3 : num);
        if (isChange) {
            changeData(data)
        }
        data[0].label = {
            normal: {
                position: 'inside',
                formatter: '{c}',
                textStyle: {
                    color: '#fff'
                }
            }

        };
        var arg = $.extend(true, {}, {
            legend: {
                data: TMPConditionNames
            },
            series: data
        })
        _this.charts.getChartById(chartId).setOption(arg);
    };
    this.setFunnelChartWrapDivWH = function () {
        var con = this.view.$el.find('#canvas-content'),
            h = con.height(),
            w = con.width();
        var tmpW = h > w ? w : h;
        var num = this.getFunnelChartsNum();
        var width, height;
        width = height = (tmpW / num) * 0.8 - 80;
        this.view.$el.find(".canvas-area").css({
            width: width > 280 ? width : 280,
            height: height > 200 ? height : 200,
            'marginLeft': -(width > 280 ? width / 2 : 140),
            'marginTop': -(height > 200 ? height / 2 : 100)
        })

    };
    this.resizeFunnelChart = function (chartId) {
        //var charts= this.charts.getCharts();
        var charts = _this.charts.objects;
        for (var k in charts) {
            if (k != chartId) {//Echart Bug  不能在setOption 之后立即resize ,否则漏斗不显示
                charts[k].resize();
            }
        }
    };
    /**
     * 获取漏斗chart 个数
     */
    this.getFunnelChartsNum = function () {
        return this.view.$el.find('.drawing-box .canvas-area').length;
    };
    this.validateCondition = function (name, gId) {
        var arr = this.getConditionNamesByGId(gId);
        return arr.indexOf(name) > -1;
    };
    this.isConditionLimit = function (gId) {
        return this.view.$el.find('.actions-box #' + gId + " .init").length >= 3;
    };
    this.getConditionNamesByGId = function (gId) {

        var arr = [];
        //this.view.$el.find('#'+gId+' .term-box input[type="hidden"]').each(function(i,itm){
        //    var $tar=$(itm),text=$tar.val();
        //    if(text){
        //        arr.push(text);
        //    }
        //});
        this.view.$el.find('#' + gId + ' .term-box .input').each(function (i, itm) {
            var $tar = $(itm), text = $tar.text();
            if (text) {
                arr.push(text);
            }
        });
        return arr;
    };
    this.createNewChartCanvas = function (id) {
        if (!$('#' + id)[0]) {
            var h = _.template($(rightTpls).filter("#tab-canvas-box").html())({chartId: id});
            this.view.$el.find('#canvas-content').append(h);
        }
        this.setFunnelChartWrapDivWH();
    };
    this.delChartCanvas = function (id) {
        _this.charts.disposeChart(id);
        this.view.$el.find('#' + id + "-box").parent().parent().remove();
    };

    this.getChartIdByGId = function (gId) {
        if(!gId){
            return "";
        }
        var num = gId.substring(5);
        return gId + "-drawing" + num;
    };
    /**
     * 设置总计覆盖人数
     * @param type
     */
    this.changeTotal = function (type) {
        var min = this.getFunnelMinTotal();
        var max = this.getFunnelMaxTotal();
        var rd = Math.min(min + Math.ceil(Math.random() * 20), max);
        this.view.$el.find('#totalNum').text(isNaN(rd) ? 0 : rd);
    };
    this.switchConfigArea = function (type) {
        if (type) {
            $('#triggerConfig').addClass('trigger-hide');
            $('#config-area').addClass('config-area-show');
            $('#config-area').children('.config-box').addClass('config-box-show');
            $('#config-area').children('.drawing-area').addClass('drawing-area-show');
            $('#aud-tag-search').val("");
            _this.showConditionSearchRes("");
            //dropdown 有问题 自动获取焦点无法显示
            //this.focusInput();
        } else {
            $('#triggerConfig').removeClass('trigger-hide');
            $('#config-area').removeClass('config-area-show');
            $('#config-area').children('.config-box').removeClass('config-box-show');
            $('#config-area').children('.drawing-area').removeClass('drawing-area-show');
        }


    };
    /**
     * 是否达到组的上限
     * @returns {boolean}
     */
    this.isGroupLimit = function () {
        //没有条件也不能增加新组或者组条件大于3个
        return _this.isAllEmpty() || this.view.$el.find('.actions-box .prerequisite-box').length >= 3;
    };
    this.checkoutGroup = function () {
        var _this = this;
        this.view.$el.find('.actions-box .prerequisite-box').each(function (i, itm) {
            var $tar = $(itm);
            if (!$tar.find('.init').length) {
                var gId = $tar.find('.group-box').attr('id');
                var chartId = _this.getChartIdByGId(gId);
                _this.delChartCanvas(chartId);
                $tar.remove();
            }
        })
        if (_this.isAllEmpty()) {
            _this.initGroup();
            _this.changeTotal(false);
            _this.addBgImg('drawing-box', true);

        } else {
            _this.changeTotal(true);
            _this.addBgImg('drawing-box', false);
        }
        this.view.$el.find('.actions-box .prerequisite-box:first .huo-box').remove();
        this.setFunnelChartWrapDivWH();
    };
    this.initGroup = function () {
        var hml = _.template($(groupTpl).filter("#group-init").html())();
        this.view.$el.find('.actions-box').append(hml);
    };
    this.isAllEmpty = function () {
        return !this.view.$el.find('.actions-box .prerequisite-box').length || !this.view.$el.find('.actions-box  .init').length;
    };
    this.addDragTarAbleCls = function (type) {
        var _this = this;
        type ? this.view.$el.find('.actions-box .term-box:not(".init")').addClass('hover') : this.view.$el.find('.actions-box .term-box:not(".init")').removeClass('hover');
        this.view.$el.find('.actions-box .group-box').each(function (i, itm) {
            var $gp = $(itm), gId = $gp.attr('id')
            if (_this.isConditionLimit(gId)) {
                $gp.find('.term-box:not(".init")').removeClass('hover');
            }

        })
    };
    this.changeHomeIcon = function () {
        var params = util.getLocationParams();
        var data = "{}";
        if (params && params['returnurl']) {
            var header = $('#page-body-header');
            header.addClass('return-url');
            header.find(".return-pages").attr("href", BASE_PATH + params['returnurl']);
        }
    };
    this.init = function () {
        var _this = this;
        events = {
            "click ": function (e) {
                var $tar = $(e.target);
                if ($tar.attr('id') != 'triggerConfig' && !$tar.parents('.config-area')[0]) {
                    _this.switchConfigArea(false);
                }
                _this.hideSuggest();
            },
            "click #rui-modals-save": function (e) {
                if (!$(e.target).hasClass("rui-disabled")) {
                    var txt = getDateStr();
                    changeAudienceTitle("未命名-" + txt);
                    Materialize.toast("保存成功！", 3000)
                }

            },
            "click #rui-modals-edit": function () {
                var name = $("#toolbar-title").text();
                new Modals.Window({
                    id: "modals-edit",
                    title: '细分信息编辑',
                    content: _.template($(modalsTpl).filter('#tpl-modal-edit').html())({name: name || ""}),
                    width: 384,
                    buttons: [{
                        text: '保存', cls: 'accept', handler: function (thiz) {
                            changeAudienceTitle();
                            var release = $('#audience-release')[0] && $('#audience-release')[0].checked;
                            if (release) {
                                doRelease()
                            }
                            thiz.close();
                        }
                    }, {
                        text: '取消', cls: 'decline', handler: function (thiz) {
                            thiz.close();
                        }
                    }],
                    listeners: {
                        afterRender: function (thiz) {
                        },
                        close: function () {

                        }
                    }
                })
            },
            "click #aud-tag-edit": function () {
                new Modals.Window({
                    id: "aud-tag-edit-window",
                    title: '细分人群标签',
                    content: _.template($(modalsTpl).filter('#tpl-modal-shuqian').html()),
                    width: 384,
                    events: {
                        click: function (e) {
                            if (e.$target.hasClass('rui-close')) {
                                e.$target.parent().remove();
                            }
                        }
                    },
                    buttons: [{
                        text: '保存', cls: 'accept', handler: function (thiz) {
                            thiz.close();
                        }
                    }, {
                        text: '取消', cls: 'decline', handler: function (thiz) {
                            thiz.close();
                        }
                    }],
                    listeners: {
                        open: function (thiz) {
                            bindKeydown(true);
                        },
                        close: function () {
                            bindKeydown(false);
                        }
                    }
                })
            },
            "click #triggerConfig": function (e) {
                if (e.currentTarget.className.indexOf("shine-blue") > -1) {
                    e.currentTarget.classList.remove("shine-blue")
                }
                _this.switchConfigArea(true);
            },
            "click .action-input-close": function (e) {
                delSingleCondition(e);
                e.stopPropagation();
            },
            "mousedown .action-input-close": function (e) {
                //屏蔽移动式出现的可拖拽区域 （否出现bug）
                e.stopPropagation();
            },
            "click .delete-all": function (e) {
                delGroupCondition(e);
            },
            'click .act-box': function (e) {
                var group, gId,
                    tar = e.target, $tar = $(tar);
                if (e.target.nodeName.toLowerCase() == 'input') {
                    var checked = $tar.get(0) && $tar.get(0).checked;
                    var group = $tar.parent().parent().parent(),
                        gId = group.attr('id');
                    if (gId) {
                        _this.loadChartByGroup(gId, checked);
                    }
                }
            },
            'click .trigger-tag': function (e) {
                var tar = e.target, $tar = $(tar);
                $(".result-search").val($tar.text());
                var val = $tar.text();
                val = $.trim(val);
                var res = val == "" ? "" : getConditionResDataByKey(val);
                _this.showConditionSearchRes(res);
                e.stopPropagation();
            },
            "click .aud-suggest-trigger": function (e) {
                var tar = e.target, $tar = $(tar);
                var val = $tar.text();
                val = $.trim(val);
                _this.view.$el.find("#config-area input").val(val);
                var res = val == "" ? "" : getConditionResDataByKey(val);
                _this.showConditionSearchRes(res);
                _this.view.$el.find("#seg-condition-search").hide();
                e.stopPropagation();
            },
            'keyup .result-search': function (e) {
                var val = $(e.currentTarget).val();
                val = $.trim(val);
                var tpl = "";
                var res = "";
                if (val != "") {
                    res = getConditionResDataByKey(val);
                    var sug = getSuggestDataByKey(val);
                    _this.showSuggest(sug);
                } else {
                    _this.view.$el.find("#seg-condition-search").hide();
                }
                _this.showConditionSearchRes(res);
            }

        };

    };
    this.focusInput = function () {
        _this.view.$el.find('.result-search').focus();

    };
    this.config = function (view, charts,  drag) {
        this.view = view;
        this.charts = charts;
        this.drag = drag;
    };
    this.bindEvent = function () {
        return events;
    }
    this.hideSuggest = function () {
        _this.view.$el.find("#seg-condition-search").hide();
    };
    this.showSuggest = function (res) {
        var tpl = _.template($(resultAreaTpls).filter("#suggest").html())({
            result: res
        })
        var list = _this.view.$el.find("#seg-condition-search");
        list.show();
        list.html(tpl)

    };
    this.tagsInit = function () {
        var tagHtml = '<span class="trigger-tag">' + TAGS.join('</span> | <span class="trigger-tag">') + '</span>';
        var tpl = _.template($(resultAreaTpls).filter('#result-init').html())({tags: tagHtml});
        changeResultArea(tpl);
    }
    this.showConditionSearchRes = function (data) {
        var tpl = "";
        var res = [];
        var tagHtml = '<span class="trigger-tag">' + TAGS.join('</span> | <span class="trigger-tag">') + '</span>';
        if (typeof data == "string") {
            tpl = _.template($(resultAreaTpls).filter('#result-init').html())({tags: tagHtml});
        } else {
            res = data.length ? data[0].result : [];
            tpl = _.template($(resultAreaTpls).filter('#result-tpl').html())({data: res});
        }
        Random = data ? (data.length ? 1 : null) : null;
        _this.loadChartByGroup("bar1", null, res);
        changeResultArea(tpl);
    }
    /**
     * charts 初始化
     */
    this.initCharts = function () {
        var box = $("#config-area .drawing-box"), width = ($('#segment-id').width() / 2) * 0.8 - 80, height = box.height();
        $('#drawing4').css({width: width});
        var _this = this;
        initChart({
            id: 'bar1',
            type: 'bar',
            renderTo: '#drawing4',
            title: {
                text: ''
            },
            legend: {
                data: []
            },
            xAxis: {
                splitLine: {show: false},
                data: [],
                show: false
            },
            yAxis: {
                splitLine: {show: false},
                show: false
            },
            series: [{data: []}]

        });

    };
    this.addBgImg = function (id, type) {
        var $tar = this.view.$el.find('#' + id);
        type ? $tar[0].classList.add('no-data') : $tar[0].classList.remove('no-data');

    }
    /**
     *  获取漏斗最大个数
     * @returns {Array.length|*}
     */
    this.getFunnelMaxTotal = function () {
        var arr = this.getFunnelChartData();
        var tmpArr = [];
        if (arr && arr.length > 0) {
            arr.forEach(function (itm, i) {
                var last = itm[0].data[itm[0].data.length - 1];
                last&&tmpArr.push(last.value);
            })

        }
        var sum = 0;
        tmpArr.forEach(function (itm, i) {
            sum += itm;
        })
        return sum;
    };
    /**
     * 获取漏斗最小数据
     * @returns {Array}
     */
    this.getFunnelMinTotal = function () {
        var arr = this.getFunnelChartData();
        var tmpArr = [];
        if (arr && arr.length > 0) {
            arr.forEach(function (itm, i) {
                if(itm[0]&&itm[0].data&&itm[0].data[0]){
                    tmpArr.push(itm[0].data[0].value)
                }
            })

        }
        tmpArr.sort(function (a, b) {
            return a < b ? 1 : -1
        });
        return tmpArr[0];
    };
    /**
     * 获取漏斗数据
     * @returns {Array}
     */
    this.getFunnelChartData = function () {
        var arr = [];
        var charts = this.charts.getCharts();
        for (var k in charts) {
            var chart = charts[k];
            var opt = chart.getOption();
            if (opt && opt.type == 'funnel') {
                arr.push(opt.series)
            }
        }
        return arr;
    }
    this.loadData=function(){
        //MOCK
        var data=[
                ['会员-不限','家庭角色-妈妈','孕产状态-孕晚期'],//>8个月孕龄的孕期准妈妈
                ['会员-不限','家庭角色-妈妈','孕产状态-孕早期、孕中期'],//<8个月孕龄的孕期准妈妈
                ['会员-不限','家庭角色-妈妈、爸爸','宝宝年龄-0~6月'],//0~6个月新妈妈爸爸
                ['会员-不限','家庭角色-妈妈、爸爸','宝宝年龄-7~12月、1~2岁'],//6~24个月宝宝父母
                ['会员-不限','宝宝年龄-7~12月'],//7-12个月宝宝的会员
            ];
        var params= util.getLocationParams();
        var con=$('#group1 [attr-data="group1"]')
        var  condArr,title="未命名-"+ getDateStr();
        if(!params){
            return ;
        }else if(params.audienceId=='1'){
            TMPConditionNames=condArr= data[0];
            title='>8个月孕龄的孕期准妈妈';
        }else  if(params.audienceId=='2'){
            TMPConditionNames=condArr=data[1];
            title='<8个月孕龄的孕期准妈妈';
        }else  if(params.audienceId=='3'){
            TMPConditionNames=condArr= data[2];
            title='0~6个月新妈妈爸爸';
        }else  if(params.audienceId=='4'){
            TMPConditionNames=condArr= data[3];
            title='6~24个月宝宝父母';
        }else  if(params.audienceId=='5'){
            TMPConditionNames=condArr= data[4];
            title='7-12个月宝宝的会员';

        }
        if(condArr){
            changeAudienceTitle(title,true);
            doRelease();
            condArr.forEach(function(itm,i){
                var arr=itm.split("-");
                _this.drag.createConditionInput(con,arr[0],itm)
            })
            this.loadChartByGroup('group1')
        }

    };

    this.init();

}

module.exports = controller;