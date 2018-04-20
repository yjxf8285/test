define(function(require, exports, module) {
    
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = require('util'),
        Pagination = require('uilibs/pagination'),
        moment = require('moment'),
        htmlTpl = require('./app-reportsetting-logs.html');
    
    var ReportSettinglayers = Backbone.View.extend({

        template: _.template($(htmlTpl).filter('.rpt-logs-tpl').html()),
        
        options: {
            wrapEl: null, // 外层元素
            templateID: null // 上一步创建表的id
        },
        
        // 记录数据
        logsData: null,
        
        // 分页条数
        pageSize: 10,
        
        // 分页对象
        pagination: null,
        
        // 初始化
        initialize: function() {
            this.wrapEl = this.options.wrapEl;
        },
        
        refresh: function(templateID) {
            this.pagination = null;
            this.logsData = null;
            this.templateID = templateID * 1;
            this.getLogsData();
        },
        
        /**
         * 
         * 获取日志数据
         */
        getLogsData: function(pageNumber) {
            var that = this;
            util.api({
                'url': '/DataReporting/GetDrSysLogs',
                'type': 'get',
                'dataType': 'json',
                'data': {
                    templateID: that.templateID,
                    pageSize: that.pageSize,
                    pageNumber: pageNumber || 1,
                    keyWord: ''
                },
                'success': function(resp) {
                    if (resp.success) {
                        that.logsData = resp.value;
                        that.formatData();
                        that.renderTable();
                        if (!that.pagination) {
                            that.renderPages();
                        }
                    } else {
                        that.renderTable({data: []}); 
                    }
                }
            });
        },

           
        /**
         * 格式化数据
         */
         formatData: function(data) {
            var that = this;
            _.each(that.logsData.items, function(source) {
                source.createTime = moment.unix(source.createTime).format('YYYY-MM-DD HH:mm');
            });
         },
         
        
        /**
         * 渲染表格数据
         */
        renderTable: function () {
            var that = this;
            $('.rpt-logs-tbox', that.wrapEl).html(that.template({data: that.logsData.items || []}));
        },
        
        /**
         * 渲染分页
         */
        renderPages: function() {
            var that = this;
            that.pagination = new Pagination({
                'element': $('.rpt-logs-pagination', that.wrapEl),
                'pageSize': that.pageSize,
                'visiblePageNums': 10
            });
            that.pagination.render();
            that.pagination.setTotalSize(that.logsData.totalCount);
            that.pagination.on('page', function (pageNumber) {
                that.getLogsData(pageNumber);
            });      
        },
        
        render: function(data) {
            this.$el.html(this.template(data));
            $('.report-layers-right', this.wrapEl).append(this.$el);
        }
    });

    module.exports = ReportSettinglayers;
});