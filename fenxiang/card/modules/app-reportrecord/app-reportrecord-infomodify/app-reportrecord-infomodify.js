/**
 * 报表记录-列表
 */
define(function (require, exports, module) {

    var util = require('util'),
        templateStr = require('./app-reportrecord-infomodify.html'),
        style = require('./app-reportrecord-infomodify.css');

    var Pagination = require('uilibs/pagination'),
        Calender = require('calendar'),
        moment = require('moment');
    var modifyDetailTpl = require('../app-reportrecord-infomodifydetail/app-reportrecord-infomodifydetail.html');

    var modifyRowTpl = _.template(' <tr><td>{{index}}</td><td>{{currentTime}}</td><td>{{senderName}}</td><td>{{content}}</td><td>{{approverName}}</td><td>{{approveTime}}</td><td><a href="javascript:void(0)" onclick="return false;" class="reportrecord-infomodify-view" data-id="{{dataLogID}}">查看修改详情</a></td></tr>');
    var Dialog = require('dialog');

    /**
     * 查看修改详情的弹框
     */
    var ModifyDetailDialog = Dialog.extend({
        "attrs": {
            width: 800,
            content: modifyDetailTpl,
            className: 'common-style-richard modifyDetailDialog-dialog'
        },
        "events": {
            'click .f-cancel': 'cancel'
        },
        "cancel": function (evt) {
            this.hide();
        },
        //判断是新还是改
        getReportType: function(infos){
            var editFlag = false,
                addFlag = true;
            $.each(infos, function(idx, item){
                if(item.valueBefore) {
                    addFlag = false;
                }
                if(item.valueBefore != item.valueAfter) {
                    editFlag = true;
                }
            });
            if(addFlag) {
                return {
                    cls: 'add',
                    desc: '新'
                }
            }
            if(editFlag) {
                return {
                    cls: 'edit',
                    desc: '改'
                }
            }
            return {
                cls: 'notedit',
                desc: '未变'
            }
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
        "hide": function () {
            var result = ModifyDetailDialog.superclass.hide.apply(this, arguments); //调用阿拉蕾原始渲染接口
            return result;
        },
        "render": function (oData) {
            var result = ModifyDetailDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            var self = this;
            var elEl=this.element;
            util.api({
                type: 'get',
                url: '/DataReporting/GetDrtBakCompare',
                data:oData,
                "beforeSend": function () {
                    self.$('.reportrecord-info-moifydetail-data').html('<div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div>');
                },
                success: function (res) {
                    var data = res.value;
                    if (res.success && data) {
                        var baseInfo = data.baseInfo;
//                        elEl.find('.reportrecord-info-moifydetail-title').html('<span>上报人：' + baseInfo.employee.name + '</span> <span>报数开始时间：' + moment.unix(baseInfo.createTime).format('YYYY-MM-DD HH:mm') + '</span> <span>状态：' + baseInfo.dataApproveStatusDesc + '</span>');

                        $('.item-title',elEl).html(baseInfo.templateName);
                        $('.info-sender',elEl).html(baseInfo.employee.name);
                        $('.info-approver', elEl).html(baseInfo.dataApproverName);
                        $('.info-state',elEl).html(baseInfo.dataApproveStatusDesc);
                        $('.info-begintime',elEl).html(moment.unix(baseInfo.createTime).format('YYYY-MM-DD HH:mm'));
                        $('.info-launchtime',elEl).html(moment(baseInfo.updateTime * 1000).format('YYYY-MM-DD hh:mm'));

                        var items = data.items;
                        var tableHtml = '';
                        tableHtml += '<table class="report-tb"><thead><th width="50">序号</th><th width="50">状态</th><th width="130">门店</th>';
                        tableHtml += self.getThead(items[0].compareInfos);
                        tableHtml += '</thead><tbody>';
                        for (var i = 0; i < items.length; i++) {
                            tableHtml += '<tr><td>'+(i+1)+'</td><td class="'+self.getReportType(items[i].compareInfos).cls+'">'+self.getReportType(items[i].compareInfos).desc+'</td><td>' + items[0].nodeName + '</td>' + self.getRowHtml(items[i].compareInfos) + '</tr>'
                        }
                        tableHtml += '</tbody></table>';
                        self.$('.reportrecord-info-moifydetail-data').html(tableHtml);
                    }
                }
            });
            return result;
        }
    });

    /**
     * 列表
     */
    var RecordInfoModify = Backbone.View.extend({
        template: _.template(templateStr),
        options: {
            templateId: null,
            pageSize: 20,
            pageNumber: 1,
            getListUrl: '/DataReporting/GetDataLogs'
        },
        //初始化
        initialize: function (options) {
            var self = this;
            self.options = _.extend(self.options, options);
            self.$el.html(self.template({}));
            self.options.wrapperEl.empty().append(self.$el);

            // self.$keywords = self.$('.report-search-wrap .ipt-search');
            self.$date = self.$('.report-search-wrap .date');
            self.$date.val(moment(new Date()).format('YYYY-MM-DD'));

            self.widgetDate = new Calender({"trigger": self.$date});
            self.widgetDate.on('selectDate', function (date) {
                self.options.time = moment(date).format('YYYYMMDD');
                self.render();
            });
            $('.modifyDetailDialog-dialog').remove();
            this.modifyDetailDialog = new ModifyDetailDialog();
        },
        //渲染
        render: function () {
            var self = this;
            util.api({
                type: 'get',
                url: self.options.getListUrl,
                data: {
                    'templateID': self.options.templateId,
                    'currentDay': self.options.time || self.$date.val().replace(/-/g, ''),
                    'pageSize': self.options.pageSize,
                    'pageNumber': self.options.pageNumber
                },
                "beforeSend": function () {
                    var loadingEl = '<tr><td colspan="7"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    self.$('.reportrecord-unupdata tbody').html(loadingEl);
                },
                success: function (res) {
                    var data = res.value;
                    if (res.success && data) {
                        self.options.totalCount = data.totalCount;
                        var items = data.dRTemplates;
                        if (data.totalCount == 0 || items.length == 0) {
                            self._showNotice();
                        }
                        else {
                            var str = '', t, u;
                            for (var i = 0; i < items.length; i++) {
                                t = items[i];
                                u = util.getContactDataById(items[i].approverID, "p");
                                str += modifyRowTpl({
                                    index: i + 1,
                                    currentTime: items[i].currentDay,
                                    senderName: items[i].sender.name,
                                    content: items[i].content,
                                    approverName: u ? u.name : '',
                                    approveTime: moment(items[i].approveTime).format('YYYY-MM-DD hh:mm'),
                                    dataLogID: items[i].drtBakID
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
            msg = msg ? msg : '没有获取到修改日志';
            self.$('.reportrecord-unupdata tbody').html('<tr><td colspan="7" class="empty-tip">' + msg + '</td></tr>');
        },
        events: {
            'click .reportrecord-infomodify-view': 'showDetail',
            'click .report-search-wrap .btn-search': 'render'
        },
        showDetail: function (evt) {
            var $this = $(evt.target);


            //            this.trigger('showModifyDetail', $this.attr('data-id'));
            var templateId = this.options.templateId;
            var id = $this.attr('data-id');
            this.modifyDetailDialog.render({
                templateId: templateId,
                drtBakID: id
            }).show();
        }
    });

    module.exports = RecordInfoModify;
});