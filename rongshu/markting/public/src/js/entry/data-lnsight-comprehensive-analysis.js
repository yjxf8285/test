/**
 * Created by AnThen on 2016-5-20.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-lnsight/comprehensive-analysis-tpl.html");

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 3,
    leftMenuCurName:'综合分析'
});

/*本页全局使用*/
//全局变量
var iframeTrueSrc = "http://bas.ruixuesoft.com/main/data-overview/analysis-list/8aaffc4854ccb57d0154ccce6788006c#mode=integrated&layout=table",
    iframeFalseSrc = "comprehensive-analysis-empty.html";
//全局函数
var checkboxCheckedFalse = function (obj){
    var state = false;
    obj.each(function(){
        var type = $(this).is(':checked');
        if(type){
            state = true;
        }else{
            state = false;
            return false;
        }
    });
    return state;
};
var checkboxCheckedTrue = function (obj){
    var state = false;
    obj.each(function(){
        var type = $(this).is(':checked');
        if(type){
            state = true;
            return false;
        }else{
            state = false;
        }
    });
    return state;
};

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:_.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "click #filled-segment-all": "segmentAll",
        "click .filled-segment-child": "segmentChild",
        "click #filled-activity-all": "activityAll",
        "click .filled-activity-child": "activityChild"
    },
    segmentAll: function(e){
        var thisType = checkboxCheckedFalse($(e.currentTarget)),
            segmentAll = $('#filled-segment input[type=checkbox]'),
            activityAll = $('#filled-activity input[type=checkbox]');
        if(thisType){
            segmentAll.prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            segmentAll.prop("checked",false);
            if(!checkboxCheckedFalse(segmentAll) && !checkboxCheckedFalse(activityAll)){
                $('#iframe').attr('src',iframeFalseSrc);
            }
        }
    },
    segmentChild: function(e){
        var segmentAll = $('#filled-segment input[type=checkbox]'),
            activityAll = $('#filled-activity input[type=checkbox]'),
            monitor = $('.filled-segment-child'),
            state = false;
        monitor.each(function(){
            var thisType = $(this).is(':checked');
            if(thisType){
                state = true;
            }else{
                state = false;
                return false;
            }
        });
        if(state){
            segmentAll.prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            $('#filled-segment-all').prop("checked",false);
            if(checkboxCheckedTrue(segmentAll) || checkboxCheckedTrue(activityAll)){
                $('#iframe').attr('src',iframeTrueSrc);
            }else{
                $('#iframe').attr('src',iframeFalseSrc);
            }
        }
    },
    activityAll: function(e){
        var thisType = checkboxCheckedFalse($(e.currentTarget)),
            segmentAll = $('#filled-segment input[type=checkbox]'),
            activityAll = $('#filled-activity input[type=checkbox]');
        if(thisType){
            activityAll.prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            activityAll.prop("checked",false);
            if(!checkboxCheckedFalse(segmentAll) && !checkboxCheckedFalse(activityAll)){
                $('#iframe').attr('src',iframeFalseSrc);
            }
        }
    },
    activityChild: function(e){
        var segmentAll = $('#filled-segment input[type=checkbox]'),
            activityAll = $('#filled-activity input[type=checkbox]'),
            monitor = $('.filled-activity-child'),
            state = false;
        monitor.each(function(){
            var thisType = $(this).is(':checked');
            if(thisType){
                state = true;
            }else{
                state = false;
                return false;
            }
        });
        if(state){
            activityAll.prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            $('#filled-activity-all').prop("checked",false);
            if(checkboxCheckedTrue(segmentAll) || checkboxCheckedTrue(activityAll)){
                $('#iframe').attr('src',iframeTrueSrc);
            }else{
                $('#iframe').attr('src',iframeFalseSrc);
            }
        }
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
        /*初始化iframe高度*/
        var segmentAreaHeight = $('#segment-area').height(),
            activityAreaHeight = $('#activity-area').height();
        $('#bas-area').css('top',segmentAreaHeight+activityAreaHeight+32);
        /*初始化checkbox*/
        //得到地址栏指定参数
        function geturlparam(param)
        {
            //构造一个含有目标参数的正则表达式对象
            var reg = new RegExp("(^|&)"+ param +"=([^&]*)(&|$)");
            //匹配目标参数
            var r = window.location.search.substr(1).match(reg);
            //返回参数值
            if (r!=null) return decodeURI(r[2]); return false;
        }
        //初始化iframe
        if(geturlparam('crowd')==1){
            $('#filled-segment-5').prop("checked",true);
            $('#iframe').attr('src',iframeTrueSrc);
        }else{
            $('#filled-segment-5').prop("checked",false);
            $('#iframe').attr('src',iframeFalseSrc);
        }
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