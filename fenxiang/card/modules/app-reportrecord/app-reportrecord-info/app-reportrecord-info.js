/**
 * 报表记录-列表
 */
define(function (require, exports, module) {

    var util=require('util'),
        templateStr=require('./app-reportrecord-info.html'),
        style=require('./app-reportrecord-info.css');
    var Tab = require('uilibs/tabs2');
    var breadcrumbHtml = '<span>当前位置:</span> <a href="#app/reportdata">报数系统</a> &gt; <a href="javascript:void(0)" onclick="return false;" class="report-record-list">报表记录</a>';
    //三个模块
    var RecordInfoChart=require('../app-reportrecord-infochart/app-reportrecord-infochart'),
        RecordInfoUnup = require('../app-reportrecord-infounup/app-reportrecord-infounup'),
        RecordInfoModify = require('../app-reportrecord-infomodify/app-reportrecord-infomodify');


    var RecordInfo = Backbone.View.extend({
        template:_.template(templateStr),
        options:{
            chartModule:null,
            unupModule:null,
            modifyModule:null,
            modifyDetailModule:null,
            templateId:null,
            wrapperEl:null,
            tableName:'报表'
        },
        //初始化
        initialize:function(){
            var me = this;

            me.$el.html(me.template({}));
            me.initDom();
            me.bindEvent();

        },
        initDom:function(){
            var me=this;
            me.$conWrapper = me.$('.reportrecord-info-content');
            me.$modifyCon = me.$('.reportrecord-info-modify-content');
            me.$breadcrumb = me.$('.report-breadcrumb');
            me.$chart = me.$('.-content-chart');
            me.$unup = me.$('.-content-unup');
            me.$modify = me.$('.-content-modify');
            me.$tab = me.$('.app-tabs');
            me.$title=me.$('h2');
            me.$breadcrumbWrapper = me.$('.report-breadcrumb');
        },
        //渲染
        render:function(id, tableName, index){
            var me = this;
            me.options.chartModule = new RecordInfoChart({'wrapperEl': me.$chart, 'templateId': id});
            me.options.unupModule = new RecordInfoUnup({'wrapperEl': me.$unup, 'templateId': id});
            me.options.modifyModule = new RecordInfoModify({'wrapperEl': me.$modify, 'templateId': id});
//            me.options.modifyDetailModule = new RecordInfoModifyDetail({wrapperEl: me.$modifyCon, 'templateId': id});

          /*  me.options.modifyModule.on('showModifyDetail', function (mid) {
                var html = breadcrumbHtml + ' &gt; <a href="javascript:void(0)" onclick="return false;" class="switch-tab" data-for="0">' + tableName + '</a>';
                html += ' &gt; <a href="javascript:void(0)" class="switch-tab" onclick="return false;" data-for="2">修改日志</a>';
                html += ' &gt; <a href="javascript:void(0)" onclick="return false;">查看修改详情</a>';
//                me.$breadcrumbWrapper.html(html);
                me.$conWrapper.hide();
                me.$modifyCon.show();
                me.options.modifyDetailModule.render(mid);
            });*/
            me.options.templateId = id;
            me.options.tableName = tableName;
            me.$title.text(tableName);
            me.$breadcrumbWrapper.html(breadcrumbHtml + ' &gt; <a href="javascript:void(0)" onclick="return false;">' + tableName + '</a>');
            me.options.wrapperEl.empty().append(me.$el);
            me.$conWrapper.show();
            me.$modifyCon.hide();
            index = index || 0;
//            me.$tab.find('a:eq(' + index + ')').trigger('click');
            me.options['chartModule'].render();
            $('.-content-chart',me.$el).show();
            //Tab

            this.tab = new Tab({
                "element": $('.tab-menu',this.$el),//容器
                "container": this.$el,//大父级容器
                "items": [
                    {value: "-content-chart", text: "报表"},
                    {value: "-content-unup", text: "未上报情况" },
                    {value: "-content-modify", text: "修改日志"}
                ]
            });

            this.tab.on('change', function (beforeTab, nowTab) {
                $('.-content-chart',me.$el).hide();
                $('.-content-unup',me.$el).hide();
                $('.-content-modify',me.$el).hide();
                switch (nowTab) {
                    case '-content-chart':
                        me.options['chartModule'].render();
                        $('.-content-chart',me.$el).show();
                        break;
                    case '-content-unup':
                        me.options['unupModule'].render();
                        $('.-content-unup',me.$el).show();
                        break;
                    case '-content-modify':
                        me.options['modifyModule'].render();
                        $('.-content-modify',me.$el).show();
                        break;

                }

            });
        },
        bindEvent: function () {
            var me = this;
//            me.options.wrapperEl.on('click', '.app-tab', function () {
//                var $se=$(this), _target = $se.attr('data-for');
//                $se.addClass('active').siblings().removeClass('active');
//                me['$'+_target].show().siblings().hide();
//                me.options[_target+'Module'].render();
//            });
            me.options.wrapperEl.on('click', '.report-record-list', function () {
                me.trigger('view');
            });
            me.options.wrapperEl.on('click', '.switch-tab', function () {
                var index = $(this).attr('data-for');
                me.$breadcrumbWrapper.html(breadcrumbHtml + ' &gt; <a href="javascript:void(0)" onclick="return false;">' + me.options.tableName + '</a>');
                me.$tab.find('a:eq(' + index + ')').trigger('click');
                me.$conWrapper.show();
                me.$modifyCon.hide();
            });
        },
        destory:function(){
            var me=this;
            /*
            me.options.chartModule.destory();
            me.options.unupModule.destory();
            me.options.modifyModule.destory();
            */
            me.$el.remove();
        }
    });

    module.exports = RecordInfo;
});
