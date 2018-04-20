define(function (require, exports, module) {

    var win = window,
        doc = win.document,
        htmlTpl = require('./reportother-tpl.html'),
        leftNav = require('modules/app-report-leftnav/app-report-leftnav'),
        ImportDialog = require('modules/crm-object-import/crm-object-import'),
        util = require('util'),
        Pagination = require('uilibs/pagination2'),
        ReportOtherView = null;
    
    
    /**
     * 
     * 构造函数
     */
    ReportOtherView = Backbone.View.extend({
        
        template: _.template($(htmlTpl).filter('.reportother-list-tpl').html()),
        
        // 每页显示条数
        pageSize: 10,
        
        // 接口
        urls: {
            getList: '/DataReporting/GetExternalMemberList',
            addNew: '/DataReporting/CreateExternalReporter',
            edite: '/DataReporting/ModifyExternalMember',
            del: '/DataReporting/DeleteUsers',
            importExl: '/DataReporting/ImportExternalMembers',
            downloadExl: 'getexternalmemberexceltemplate'
        },
        
        /**
         * @description 初始化请求
         * 
         */
        initialize: function() {
            
            var that = this,
                $el = this.$el;
            
            this.postData = { // 默认请求参数列表
                'keyWord': '',
                'status': 0,
                'pageSize': that.pageSize
            };
            
            util.mnSetter($('.select-fstatus', $el), 0);
            util.mnEvent($('.select-fstatus', $el), 'change', function() {
                that._search();
            });
            
            this.initPages();
            this.getData();
        },
        
        
        events: {
            'click .j-add-new': '_addNew',  // 新建联系人
            'click .j-edite': '_edite',    // 编辑联系人
            'click .j-del': '_del',       // 删除联系人
            'click .j-import': '_import',   // 导入联系人
            'click .j-btn-search': '_search',  // 搜索
            'keypress #fkeyword': '_enterSearch'            // 点击确定键搜索 
        },
        
        
        /**
         * 初始化分页
         */
        initPages: function() {
            var that = this;
            that.pagination = new Pagination({
                'element': $('.reportother-pages', that.$el),
                'pageSize': that.pageSize,
                'visiblePageNums': 7
            });
            that.pagination.on('page', function (pageNumber) {
                that.getData(pageNumber);
            });
        },
        
        
        /**
         * @description获取制定页数的数据
         * @param {Number} 请求页数  只在请求分页时后传入这个值
         * 默认请求第一页
         *
         */        
        getData: function(pageNumber) {
            var that = this;
 
            if (that.loadingStart) {
                return;
            }
            
            // 设置请求页数
            that.postData.pageNumber = pageNumber || 1;
            
            that.loadingStart = true;

            util.api({
                "type": 'get',
                "url": that.urls.getList,
                "data": that.postData,
                "dataType": 'json',
                "success": function (requestData) {
                    that.requestData = requestData.value;
                    that.render(pageNumber);
                    that.loadingStart = false;
                }
            });
        },    
        
        
        /**
         *  @description渲染分页
         * 非切换分页时都会重新渲染
         */
        renderPages: function(totalCount) {
            if (totalCount <= this.pageSize) {
                return;
            }
            this.pagination.setTotalSize(totalCount);
            this.pagination.render();
        },

        
        /**
         * @description渲染列表 
         */
        render: function(pageNumber) {
            var requestData = this.requestData;
            var html = this.template({data: requestData.members});
            $('tbody', this.$el).html(html);
            
            if (typeof pageNumber == 'undefined') {
                this.renderPages(requestData.totalCount);
            } 
        },
        

        /**
         * @description搜索
         *
         */
        _search: function() {
            var $el = this.$el;
            this.postData.keyWord = $.trim($('#fkeyword', $el).val());
            this.postData.status = util.mnGetter($('.select-fstatus', $el));
            $('tbody', $el).html('<tr><td colspan="8" class="td-loading">正在搜索中...</td></tr>');
            this.pagination.reset();
            this.getData();
        },
        
        
        /**
         *
         *
         */
        _enterSearch: function(event) {
            if (event.keyCode == 13) {
                this._search();
            }
        },
        
        /**
         * @description新建外部联系人
         *
         */
        _addNew: function() {
            var that = this;
            
            if (that.addNewDialog) {
                that.addNewDialog.show();
                return false;
            }
            
            seajs.use('modules/app-reportother-dialog/app-reportother-dialog', function(module) {
                that.addNewDialog = new module.dialog();
                that.addNewDialog.show();
                that.addNewDialog.on('enter', function(lastData) {
                    util.api({
                        "type": 'post',
                        "url":  that.urls.addNew,
                        "data": lastData.data,
                        "dataType": 'json',
                        "success": function (response) {
                    		if(response.success) {
                    			if(response.value) {
                    				that.addNewDialog.hide();
                                    util.remind(2, '新建成功!');
                                    that.pagination.reset();
                                    that.getData();
                    			} else {
                    				util.alert(response.error);
                    			}
                    		}
                        }
                    }, {
                        'submitSelector': lastData.btnEl
                    });
                });
            });
        },
        
        
        /**
         * @description编辑外部联系人弹框
         *
         */
        _edite: function(event) {
            event.preventDefault();
            var that = this,
                $target = $(event.target),
                index = $target.data('infoindex') * 1,
                data = that.requestData.members[index];
            
            if (that.editeDialog) {
                that.editeDialog.show(data);
                return false;
            }

            seajs.use('modules/app-reportother-dialog/app-reportother-dialog', function(module) {
                that.editeDialog = new module.dialog({
                    'title': '编辑上报人'
                });
                that.editeDialog.show(data);
                that.editeDialog.on('enter', function(lastData) {
                    util.api({
                        "type": 'post',
                        "url":  that.urls.edite,
                        "data": lastData.data,
                        "dataType": 'json',
                        "success": function (response) {
                    		if(response.success) {
                    			if(response.value) {
                    				that.editeDialog.hide();
                                    util.remind(2, '编辑成功!');
                                    that.getData(that.postData.pageNumber);
                    			} else {
                    				util.alert(response.error);
                    			}
                    		}
                        }
                    }, {
                        'submitSelector': lastData.btnEl
                    });
                });
            });
        },

        
        /**
         * @description删除练习人
         *
         */        
        _del: function(evt) {
            evt.preventDefault();
            var that = this,
                userId = $(evt.target).data('userid');
            
            util.confirm('该外部联系人将被删除，确定吗？', '确认删除', function() {
                that.pagination.reset();
                $('tbody', that.$el).html('<tr><td colspan="8" class="td-loading">正在删除中...</td></tr>');
                util.api({
                    "type": 'post',
                    "url": that.urls.del,
                    "data": {
                        userId: userId
                    },
                    "dataType": 'json',
                    "success": function (requestData) {
                        that.getData();
                    }
                });
            });
        },
        
        /**
         * @description 导入上报人
         *
         */          
        _import: function () {
            var that = this;
            if (that.importDialog) {
                that.importDialog.show();
                return false;
            }
            that.importDialog = new ImportDialog({
                "title": "导入外部上报人",
                "downloadApi": that.urls.downloadExl,
                "importApi": that.urls.importExl,
                "downloadText": "外部上报人导入模板"
            });
            that.importDialog.show();
            that.importDialog.on('uploaded', function (data) {
                console.log(data);
            });
        },
        
        
        /**
         * 重新渲染
         */
        refresh: function() {
            $('#fkeyword', this.$el).val('');
            
            if (util.mnGetter($('.select-fstatus', this.$el)) != 0) {
                util.mnSetter($('.select-fstatus', this.$el), 0);
            } else {
                this._search();
            }
        },
         
         
        /**
         * @description新建外部联系人
         *
         */
        destroy: function() {
            var that = this;
            that.editeDialog && that.editeDialog.destroy();
            that.addNewDialog && that.addNewDialog.destroy();
            that.importDialog && that.importDialog.destroy();
        }
        
    });    
    
    /**
     * 页面载入执行函数
     */
    exports.init = function () {
    
        var tplEl = exports.tplEl
        
        // 设置左侧导航
        leftNav.init($('.tpl-l', tplEl));

        //初始化页面
        var reportOtherView = new ReportOtherView({el: tplEl});

        // nav点击刷新页面
        var $curNav = $('.report-left-nav .state-active', tplEl);
        if ($curNav.attr('href') == '#app/reportother') {
            $curNav.on('click', function() {
                reportOtherView.refresh();
            });
        }        
        
        // 销毁弹框
        win.FS.tpl.event.one('beforeremove', function(tplName2) {
            if (tplName2 == exports.tplName) {
                reportOtherView.destroy();
            }
        });
    }
});