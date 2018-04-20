/**
 * Created by AnThen on 2016-5-10.
 */
/*初始化必须的模块*/
'use strict';//严格模式

/*加载模块*/
//加载本页模块
var tpl = require("html/data-access/file-tpl.html");
//组件
var Modals = require('component/modals.js');

/*构造页面*/
var Layout = require('module/layout/layout');
//先创建布局
var layout = new Layout({
    index: 1,
    leftMenuCurName:'文件接入'
});

var Container = Backbone.View.extend({
    //初始化model
    model: new Backbone.Model(),
    //组织模块
    template:_.template($(tpl).filter('#tpl-content').html()),
    //设置响应事件
    events: {
        "change input[type=checkbox]": "checkboxChange",
        "change #upload-file": "uploadFile",
        "click #upload-but": "startUpload"
    },
    checkboxChange: function(){
        var tip = false;
        $('#list-but-ul li').each(function(){
            tip = $(this).children('.filled-in').is(':checked');
            if(tip){
                $('#download-templet').removeClass('close').attr('href','../../download/文件接入预置模板.zip');
                return false;
            }else{
                $('#download-templet').addClass('close').attr('href','javascript:void(0)');
            };
        });
    },
    uploadFile: function(){
        $('#files').removeClass('init').addClass('loading');
        $('#files').removeClass('init').addClass('success');
        $('#second-main').html('POS流水');
        $('#second-amount').html('200');
        $('#second-undefined-num').html('2');
        $('#second-undefined-doubt').css('display','block').attr('title','商品折扣,促销信息');
        $('#upload-but').removeClass('close');
    },
    addLable: function(e){
        var that = $(e.currentTarget),
            thatVal = "",
            blockCon = "",
            blockCon1 = "<div class='block-box'><span class='text'>",
            blockCon2 = "</span><span id='del-block' class='ico icon iconfont'>&#xe637;</span></div>";
        thatVal = that.val();
        blockCon = blockCon1 + thatVal + blockCon2;
        $('#block-box').append(blockCon);
        that.val('');
    },
    addLableBlur: function(){
        $('#block-area').removeClass('hover');
    },
    addLableFocus: function(){
        $('#block-area').addClass('hover');
    },
    delBlock: function(e){
        var that = $(e.currentTarget);
        that.parents('.block-box').empty().remove();
    },
    startUpload: function(e){
        if(!$(e.currentTarget).hasClass('close')){
            layout.duringTask(1);
            new Modals.Alert("文件上传成功!");
            $('#upload-file').val('');
            $('#files').removeClass('init loading success').addClass('init');
            $('#second-main').empty();
            $('#second-amount').empty();
            $('#second-undefined').empty();
            $('#block-box').empty();
            $('#upload-but').addClass('close');
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
        $('#page-body', this.el).html(this.template(this.model.toJSON()));
        return this;
    }
})    ;

/************生成页面************/
var container = new Container({
    el: '#container'
});