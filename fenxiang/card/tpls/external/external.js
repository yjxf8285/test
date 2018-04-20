define(function(require, exports, module) {
    
    var win = window,
        doc = win.document,
        util = require('util'),
        json = require('json'),
        Dialog = require("dialog"),
        htmlTpl = require('./external-tpl.html'),
        ImportDialog = require('modules/crm-object-import/crm-object-import'),
        Pagination = require('uilibs/pagination'),
        ExternalView = null,
        Authorize = null;
    
    
    /**
     * 
     * 授权弹框
     */
    Authorize = Dialog.extend({
    
        attrs: {
            className: 'authorize-dialog',
            width: 490,
            content: $(htmlTpl).filter('.external-authorize-tpl').html()
        },
          
        events: {
            'click .j-btn-enter':  '_enterHandle',
            'click .j-btn-cancel': '_cancelHandle'
        },
        
        /**
         * @desc取消按钮监听事件
         *
         */
        _cancelHandle: function() {
            var that = this;
            that.trigger('cancel');
            that.hide();
        },
        
        /**
         * @desc确定按钮监听事件
         *
         */
        _enterHandle: function(evt) {
            var that = this,
                checkedItem = [];
                
            $('input', that.element).each(function(){
                if (this.checked) {
                    checkedItem.push(this.value * 1);
                }
            });
            
            that.trigger('enter', {
                'btnEl': $(evt.target),
                'data': checkedItem
            });
        },
        
        show: function(num) {
            var result = Authorize.superclass.show.call(this);
            $('.num', this.element).html(num);
            return result;
        },
        
        hide: function() {
            $('input', this.element).prop('checked', false);
            return Authorize.superclass.hide.call(this);
        },
        
        destroy: function() {
            var result = Authorize.superclass.destroy.apply(this, arguments);
            return result;        
        }        
    });
    
    
    
    
    /**
     * 
     * 构造函数
     */
    ExternalView = Backbone.View.extend({
        
        template: _.template($(htmlTpl).filter('.external-list-tpl').html()),
        
        
        // 每页显示条数
        pageSize: 10,
        
        
        // 接口
        urls: {
            getList: '/ExternalMember/GetExternalMemberList',
            addNew: '/ExternalMember/CreatExternalMember',
            edite: '/ExternalMember/ModifyExternalMember',
            del: '/ExternalMember/DeleteMember',
            importExl: '/ExternalMember/ImportExternalMembers',
            downloadExl: 'getexternalmemberexceltemplate',
            authorize: '/ExternalMember/GrantAllowedApp'
        },        
        
        /**
         * @description 初始化请求
         * 
         */
        initialize: function() {
            var that = this;
            
            this.postData = { // 默认请求参数列表
                'keyWord': '',
                'status': 0,
                'allowedApp': '',
                'pageSize': that.pageSize,
                'pageNumber': 1
            };
            
            this.initPages();
            this.getData();
        },
        
        
        events: {
            'click .j-add-new': '_addNew',  // 新建联系人
            'click .j-edite': '_edite',    // 编辑联系人
            'click .j-del': '_del',       // 删除联系人
            'click .j-import': '_import',   // 导入联系人
            'click .j-checkall':  '_checkAll', // 全选
            'click .j-checkitem': '_checkItem', // 单选
            'click .j-authorize': '_authorize', // 授权
            'click .j-btn-search': '_search'  // 搜索
        },
        
        
        /**
         * 初始化分页
         */
        initPages: function() {
            var that = this;
            that.pagination = new Pagination({
                'element': $('.external-pages', that.$el),
                'pageSize': that.pageSize,
                'visiblePageNums': 7
            });
            that.pagination.on('page', function (pageNumber) {
                that.getData(pageNumber);
            });      
        },

        
        /**
         * @description重新设置全选按钮的状态
         */
        resetChecked: function() {
            $('.j-authorize', this.$el).addClass('button-state-disabled');
            $('.j-checkall', this.$el).prop('checked', false);
            $('.j-checkitem', this.$el).prop('checked', false);             
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

            that.resetChecked();
            that.postData.pageNumber = pageNumber || 1; // 设置请求页数
            that.loadingStart = true;
            
            util.api({
                'url': that.urls.getList,
                'type': 'get',
                'data': that.postData,
                'dataType': 'json',
                'success': function (requestData) {
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
            this.postData.status = $.trim($('#fstatus', $el).val());
            this.postData.allowedApp = $.trim($('#fapp', $el).val());
            $('tbody', $el).html('<tr><td colspan="9" class="td-loading">正在搜索中...</td></tr>');
            this.pagination.reset();
            this.getData();
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
                that.addNewDialog = new module.dialog({
                    'className': 'add-external-dialog',
                    'showauthorize': true
                });
                that.addNewDialog.show();
                that.addNewDialog.on('enter', function(lastData) {

                    util.api({
                        'type': 'post',
                        'url':  that.urls.addNew,
                        'data': lastData.data,
                        'dataType': 'json',
                        'success': function (requestData) {
                            that.addNewDialog.hide();
                            util.remind(2, '新建成功!');
                            that.pagination.reset();
                            that.getData();
                        }
                    }, {
                        'submitSelector': lastData.btnEl
                    });
                });
            });
        },
        
        
        /**
         * @description编辑外部联系人
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
                    'title': '编辑上报人',
                    'showauthorize': true,
                    'className': 'add-external-dialog'
                });
                that.editeDialog.show(data);
                that.editeDialog.on('enter', function(lastData) {

                    util.api({
                        'type': 'post',
                        'url':  that.urls.edite,
                        'data': lastData.data,
                        'dataType': 'json',
                        'success': function (requestData) {
                            that.editeDialog.hide();
                            util.remind(2, '编辑成功!');
                            that.getData(that.postData.pageNumber);
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
                $('tbody', that.$el).html('<tr><td colspan="9" class="td-loading">正在删除中...</td></tr>');
                util.api({
                    'type': 'post',
                    'url': that.urls.del,
                    'data': {
                        userIds: userId
                    },
                    'dataType': 'json',
                    'success': function (requestData) {
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
                'title': '导入外部上报人',
                'downloadApi': that.urls.downloadExl,
                'importApi': that.urls.importExl,
                'downloadText': '外部上报人导入模板'
            });
            that.importDialog.show();
            that.importDialog.on('uploaded', function (data) {
                console.log(data);
            });
        },
        
        
        /**
         * @description 批量授权
         * 
         */
         _authorize: function(event) {
            var that = this,
                $target = $(event.target),
                ids = [];
                
            if ($target.hasClass('button-state-disabled')) {
                return false;
            }
            
            // 选中的id列表
            $('.checkbox-checked', this.$el).each(function(index, item){
                ids.push($(item).data('userid'));
            });
            
            if (that.authorize) {
                that.authorize.show(ids.length);
                return false;
            }
            that.authorize = new Authorize();
            that.authorize.show(ids.length);
            that.authorize.on('enter', function(lastData) {
                var postData = [];
                _.each(ids, function(id) {
                    postData.push({
                        "externalUserID": id,
                        "apps": lastData.data
                    });
                });
                util.api({
                    'type': 'post',
                    'url':  that.urls.authorize,
                    'data': {
                        'jsonData': json.stringify(postData)
                    },
                    'dataType': 'json',
                    'success': function (requestData) {
                        if (requestData.value.failedCount == 0) {
                            util.remind(2, '批量授权成功!');
                        } else {
                            util.remind(1, '批量授权失败!');
                        }
                        that.authorize.hide();
                        that.resetChecked();
                    }
                }, {
                    'submitSelector': lastData.btnEl
                });
                
            });
         },
        
        
        
        /**
         * @description全选
         *
         */        
        _checkAll: function(event) {
            var target = event.target,
                $checkItem = $('.j-checkitem', this.$el),
                $btnAuthoriz = $('.j-authorize', this.$el);
                
            if (target.checked) {
                $checkItem.prop('checked', true).addClass('checkbox-checked');
                $btnAuthoriz.removeClass('button-state-disabled');
            } else {
                $checkItem.prop('checked', false).removeClass('checkbox-checked');
                $btnAuthoriz.addClass('button-state-disabled');
            }
        },

        
        /**
         * @description单选
         *
         */        
        _checkItem: function(event) {
            
            var $el = this.$el,
                $target = $(event.target),
                $btnAuthoriz = $('.j-authorize', $el),
                $inputCheckAll = $('.j-checkall', $el),
                checkedLen = 0;
            
            if ($target.prop('checked')) {
                $target.addClass('checkbox-checked');
            } else {
                $target.removeClass('checkbox-checked');           
            }
            
            // 检查是否全选
            checkedLen = $('.checkbox-checked', $el).length;
            if (checkedLen > 0) {
                $btnAuthoriz.removeClass('button-state-disabled');
                
                if (checkedLen == this.requestData.members.length) {
                    $inputCheckAll.prop('checked', true);
                } else {
                     $inputCheckAll.prop('checked', false);
                }
            } else {
                $btnAuthoriz.addClass('button-state-disabled');
            }
        },        
        
        
        /**
         * @description重新渲染
         *
         */       
        refresh: function() {
            var $el = this.$el;
            $('#fkeyword', $el).val('');
            $('#fstatus', $el).val('0');
            $('#fapp', $el).val('');
            this._search()
        },
        
        /**
         * @description新建外部联系人
         *
         */
        destroy: function() {
            var that = this;
            that.authorize && that.authorize.destroy();
            that.editeDialog && that.editeDialog.destroy();
            that.addNewDialog && that.addNewDialog.destroy();
            that.importDialog && that.importDialog.destroy();
        }
        
    });
    
    
    /**
     * 
     * 页面初始化
     */
    exports.init = function() {
    
        var externalView = new ExternalView({el: exports.tplEl});
        
        // 销毁弹框
        win.FS.tpl.event.one('beforeremove', function(tplName2) {
            if (tplName2 == exports.tplName) {
                externalView.destroy();
            }
        }); 
    };

});