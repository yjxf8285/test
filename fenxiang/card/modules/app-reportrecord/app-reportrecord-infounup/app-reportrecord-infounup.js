/**
 * 报表记录-详情-未上报情况
 */
define(function (require, exports, module) {

    var util = require('util'),
        templateStr = require('./app-reportrecord-infounup.html'),
        style = require('./app-reportrecord-infounup.css');
    var Pagination = require('uilibs/pagination'),
        Calender = require('calendar'),
        moment = require('moment');
    var unupRowTpl = _.template(' <tr><td>{{index}}</td><td>{{currentDay}}</td><td>{{bakTime1}}</td><td>{{templateNodeName}}</td><td>{{employeeName}}</td></tr>');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var RecordInfoUnup = Backbone.View.extend({
        template: _.template(templateStr),
        options: {
            templateId: null,
            currentDay: '',
            pageSize: 10,
            pageNumber: 1,
            getListUrl: '/DataReporting/GetDataReportUnSend'
        },
        //初始化
        initialize: function (options) {
            var self = this;
            var that=this;
            self.options = _.extend(self.options, options);
            self.$el.html(self.template({}));
            self.options.wrapperEl.empty().append(self.$el);
            self.$keywords = self.$('.report-search-wrap .ipt-search');
            self.$date = self.$('.report-search-wrap .date');
            self.$date.val(moment(new Date()).format('YYYY-MM-DD'));

            self.widgetDate = new Calender({"trigger": self.$date});
            self.widgetDate.on('selectDate',function(date){
                self.options.time=moment(date).format('YYYYMMDD');
                self.render();
            });
            //实例化搜索框
            this.searchBox = new SearchBox({
                "element": $('.search-warp',this.$el),
                "placeholder": "搜索"
            });
            this.searchBox.on('search', function (queryValue) {
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    self.render();
                }
            });
        },
        //渲染
        render: function () {
            var self = this;
            if (!self.options.templateId) {
                return false;
            }
            var _date = self.options.time||self.$date.val().replace(/-/g, '');
            util.api({
                type: 'get',
                url: self.options.getListUrl,
                data: {
                    'keyword': $('.reportrecord-unupdata-search-warp input').val(),
                    'pageSize': self.options.pageSize,
                    'pageNumber': self.options.pageNumber,
                    'templateID': self.options.templateId,
                    'currentDay': _date
                },
                "beforeSend": function () {
                    var loadingEl = '<tr><td colspan="5"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    self.$('.reportrecord-unupdata tbody').html(loadingEl);
                },
                success: function (res) {
                    var data = res.value;
                    if (res.success && data) {
                        self.options.totalCount = data.totalCount;
                        var items = data.drUnReads;
                        if(data.totalCount == 0 || items.length == 0){
                            self._showNotice();
                        }
                        else {
                            var str = '', t;
                            for(var i = 0; i < items.length; i++){
                                t = items[i];
                                str += unupRowTpl({
                                    index: i + 1,
                                    currentDay: t.currentDay,
                                    bakTime1: t.isBak ? moment(new Date(parseInt(t.bakTime1, 10))).format('YYYY-MM-DD HH:mm') : '',
                                    templateNodeName: t.templateNode && t.templateNode.nodeName,
                                    employeeName: t.employee.name
                                });
                            }
                            self.$('.reportrecord-unupdata tbody').html(str);
                        }
                        self.setPagination();
                    }
                    else {
                        self._showNotice();
                    }
                },
                error: function () {
                    self._showNotice('网络错误，没有获取到未上报情况');
                }
            });
        },
        setPagination: function () {
            var self = this;
            if (self.pagination) {
                self.$('.reportrecord-page').empty();
            }
            self.pagination = new Pagination({
                "element": self.$('.reportrecord-page'),
                "pageSize": self.options.pageSize,
                "totalSize": self.options.totalCount,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });
            self.pagination.on('page', function (pageNumber) {
                self.options.pageNumber = pageNumber;
                self.render();
            });
        },
        _showNotice: function (msg) {
            msg = msg ? msg : '没有获取到未上报情况';
            self.$('.reportrecord-unupdata tbody').html('<tr><td colspan="5" class="empty-tip">' + msg + '</td></tr>');
        },
        events: {
            'click .report-search-wrap .btn-search': 'render',
            'keydown .ipt-search':'_keydown'
        },
        _keydown: function(e){
            if(e.keyCode == 13) {
                this.render();
            }
        }
    });

    module.exports = RecordInfoUnup;
});