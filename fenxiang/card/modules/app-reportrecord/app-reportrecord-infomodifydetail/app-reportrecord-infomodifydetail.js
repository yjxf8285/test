/**
 * 报表记录-列表
 */
define(function (require, exports, module) {
    
    var util=require('util'),
        templateStr='<p class="reportrecord-info-moifydetail-title"></p><div class="reportrecord-info-moifydetail-data"></div>',
        style=require('./app-reportrecord-infomodifydetail.css'),
        moment = require('moment');



    var RecordInfo = Backbone.View.extend({
        options:{
            templateId:null,
            wrapperEl:null
        },
        template:_.template(templateStr),
        //初始化
        initialize:function(options){
            var self=this;

            self.options=options;
            self.$el.html(self.template({}));
            self.options.wrapperEl.empty().append(self.$el);
            self.$baseInfo = self.$('.reportrecord-info-moifydetail-title');
        },
        //渲染
        render:function(id){
            var self = this;
            if(!id) return false;
            util.api({
                type: 'get',
                url: '/DataReporting/GetDrtBakCompare',
                data: {
                    'templateID': self.options.templateId,
                    'drtBakID': id
                },
                "beforeSend": function () {
                    self.$('.reportrecord-info-moifydetail-data').html('<div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div>');
                },
                success: function (res) {
                    var data = res.value;
                    if (res.success && data) {
                        var baseInfo = data.baseInfo;
                        self.$baseInfo.html('<span>上报人：' + baseInfo.employee.name + '</span> <span>报数开始时间：' + baseInfo.currentDay + '</span> <span>状态：' + baseInfo.dataApproveStatusDesc + '</span>');
                        var items = data.items;
                        if (items.length == 0) {
                            self._showNotice();
                        }
                        else {
                            var tableHtml = '';
                            tableHtml += '<table class="report-tb"><thead><th width="130">门店</th>';
                            tableHtml += self.getThead(items[0].compareInfos);
                            tableHtml += '<th width="245">修改时间</th></thead><tbody>';
                            for(var i = 0; i < items.length; i++){
                                tableHtml += '<tr><td>' + items[0].nodeName + '</td>' + self.getRowHtml(items[i].compareInfos) + '<td>' + moment(baseInfo.updateTime * 1000).format('YYYY-MM-DD hh:mm') + '</td></tr>'
                            }
                            tableHtml += '</tbody></table>';
                            self.$('.reportrecord-info-moifydetail-data').html(tableHtml);
                        }
                    }
                    else {
                        self._showNotice();
                    }
                },
                error: function () {
                    self._showNotice('网络错误，没有获取到修改详情');
                }
            });
        },
        getThead: function (data) {
            var r = '';
            for(var i = 0; i < data.length; i++){
                r += '<th>' + data[i].fieldDesc + '</th>'
            }
            return r;
        },
        getRowHtml: function (data) {
            var r = '', t;
            for(var i = 0; i < data.length; i++){
                t = data[i];
                if(data[i].valueBefore){
                    r += '<td><del>' + t.valueBefore + '</del><em>' + t.valueAfter + '</em></td>';
                }
                else {
                    r += '<td><em>' + t.valueAfter + '</em></td>';
                }
            }
            return r;
        },
        _showNotice: function (msg) {
            msg = msg ? msg : '没有获取到修改详情';
            this.$('.reportrecord-info-moifydetail-data').html('<div class="reportrecord-info-moifydetail-error">' + msg + '</div>');
        }
    });

    module.exports = RecordInfo;
});