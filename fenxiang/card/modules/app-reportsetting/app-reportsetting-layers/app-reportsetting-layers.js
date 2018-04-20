define(function(require, exports, module) {
    
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = require('util'),
        zTree = require('assets/ztree/js/ztree'),
        Dialog = require("dialog"),
        fsHelper = require('modules/fs-qx/fs-qx-helper'),
        JoinDialog = fsHelper.JoinDialog,
        htmlTpl = require('./app-reportsetting-layers.html'),
        ReportView = require('modules/app-reportsetting/app-reportsetting-reportview/app-reportsetting-reportview'),
        AddLayer = require('modules/app-reportsetting/app-reportsetting-addlayer/app-reportsetting-addlayer'),
        MoveLayer = require('modules/app-reportsetting/app-reportsetting-movelayer/app-reportsetting-movelayer'),
        LayersInvolver = require('modules/app-reportsetting/app-reportsetting-involver/app-reportsetting-involver');
    
    require('./app-reportsetting-layers.css');

    var ReportSettinglayers = Backbone.View.extend({
    
        tagName: 'div',
        
        className: 'reportseeting-layers',
        
        template: '',
        
        options: {
            wrapEl: null, // 外层元素
            templateID: null // 上一步创建表的id
        },        
        
        // 保存树形对象
        zTree: null,
        
        // 用于保存左侧树的数据
        treeNodes: null, 
        
        // 当前选中的tree节点
        curTreeNode: null,
        
        //存储上报节点视图
        reportView: null,
        
        // 分页对象
        pagination: null,
        
        // 联系人弹框对象
        dialog: null,
        
        // 类型 1 查看人 2 上报人 3： 外部人
        empType: 1,
        
        events: {},
        
        initialize: function() {
            this.wrapEl = this.options.wrapEl;
            this.templateID = this.options.templateID * 1 || null;
            this.wrapEl.prepend('<div class="manage-layer-view"><div class="manage-layer-con"><div id="reportZreeBox" class="report-tree-box"></div><div class="report-layers-right fn-clear"></div></div></div><div class="report-layer-view"></div>');
            this.wrapEl.prepend(_.template($(htmlTpl).filter('.report-layers-tabs').html()));
            this.wrapEl.find('.manage-layer-view').prepend(_.template($(htmlTpl).filter('.report-layers-manage-opts').html()));
            this.addLayer = new AddLayer();
            this.moveLayer = new MoveLayer();
            this.layersInvolver = new LayersInvolver({
            	wrapEl: $('.report-layers-right', this.wrapEl)
            });
            this.bindEvents();
        },
        
        refresh: function(templateID) {
            this.$el.html('');
            $('.report-tree-box', this.wrapEl).html('');
            this.zTree = null;
            this.curTreeNode = null;
            this.pagination = null;
            this.empType = 1;
            this.templateID = templateID * 1;
            this.renderZtree();
            $('.app-tab', this.options.wrapEl).eq(0).click();
        },
        addManageNode: function(){
        	var $btns = $('.curSelectedNode .diy_add_btn', this.element);
        	$($btns[0]).click();
        },
        addReportNode: function(){
        	var $btns = $('.curSelectedNode .diy_add_btn', this.element);
        	$($btns[1]).click();
        },
        bindEvents: function(){
        	var that = this;
        	$(this.options.wrapEl).delegate('.report-next-btn', 'click', function(){
        		that.trigger('beginEdit', {
        			templateID: that.templateID,
            		step: 3
        		});
        	});
        	$(this.options.wrapEl).delegate('.report-pre-btn', 'click', function(){
        		that.trigger('beginCreate', {
        			templateID: that.templateID,
            		step: 1
        		});
        	});            
        	$(this.options.wrapEl).delegate('.report-cancel-btn', 'click', function(){
        		that.trigger('cancelCreate', {
        			templateID: that.templateID,
            		step: 3
        		});
        	});
        	$(this.options.wrapEl).delegate('.btn-create-manage', 'click', function(){
        		if($(this).hasClass('gray')) return;
        		that.addManageNode();
        	});
        	$(this.options.wrapEl).delegate('.btn-create-report', 'click', function(){
        		if($(this).hasClass('gray')) return;
        		that.addReportNode();
        	});
        	$(this.options.wrapEl).delegate('.app-tab', 'click', function(){
        		var $this = $(this);
        		if($this.hasClass('active')) {
        			return;
        		}
        		$('.app-tab', that.options.wrapEl).removeClass('active');
        		$this.addClass('active');
        		if($this.attr('data-type') == 'manage') {
        			$('.report-layer-view', that.options.wrapEl).hide();
        			$('.manage-layer-view', that.options.wrapEl).show();
                    that.refreshTree(); // 重新渲染树
                    that.reportView.reset();
        		} else {
        			if(!that.reportView) {
        				that.reportView = new ReportView({
        					wrapEl: $('.report-layer-view', that.options.wrapEl)
        				});
        			}
        			$('.report-layer-view', that.options.wrapEl).show();
        			$('.manage-layer-view', that.options.wrapEl).hide();
        			that.reportView.refresh({
        				templateID: that.templateID
        			});
        		}
        	});
        },
        
        
        /**
         * @desc 删除节点
         * @param {Object} 当前删除节点
         */
        _onDelNode: function(treeNode) {
            var that = this,
                tipText = '';   
            if (treeNode.isRoot) {
                util.alert('至少保留一个节点');
                return false;
            }
            tipText = treeNode.isParent ? '该层级及其子层级' : '该层级';
            util.confirm(tipText + '将被删除，确定吗？', '确认删除', function() {
                var selectNode = treeNode.getParentNode();
                that.zTree.removeNode(treeNode);
                if (that.zTree.getSelectedNodes().length == 0) {
                    that.zTree.selectNode(selectNode);
                    that._onSelected(selectNode);
                }
                util.api({
                    'url': '/DataReporting/RemoveTemplateNode',
                    'type': 'post',
                    'dataType': 'json',
                    'data': {
                        templateID: that.templateID,
                        nodeID: treeNode.nodeID
                    }
                });
            });
        },
        
        
        /**
         * @desc 重命名节点
         * @param {Object} 当前要修改的节点
         * @param {String} 当前修改的新名称
         */
        _onRenameNode: function(treeNode, newName) {
            var that = this;
            
            // 字符长度验证
            if (newName.length > 20 || $.trim(newName) == '') {
                util.alert('层次名称必须为1-20个字符', function() {
                    $('#' + treeNode.tId + '_a').find('input').focus();
                });
                return false;
            }
            
            // 验证同名节点
            var parentNode = treeNode.getParentNode(),
                childrens = parentNode ? parentNode.children : [];
            if (childrens) {
                var temp = _.some(childrens, function(item) {
                    if (item.nodeID != treeNode.nodeID) {
                        return item.nodeName == newName;
                    }
                });
                if (temp) {
                    util.alert(newName + '已存在，层级名称不可重复', function() {
                        $('#' + treeNode.tId + '_a').find('input').focus();
                    });
                    return false;
                }
            }
            
            // 请求接口修改
            if (treeNode.nodeName != newName) {
                util.api({
                    'url': '/DataReporting/UpdateTemplateNodeName',
                    'type': 'post',
                    'dataType': 'json',
                    'data': {
                        templateID: that.templateID,
                        nodeID: treeNode.nodeID,
                        nodeName: newName
                    },
                    'success': function(resp) {
                        if (!resp.success) {
                            var $span = $('#' + treeNode.tId + '_span');
                            $span.html(treeNode.nodeName);
                        }
                    }
                });
            }
            return true;
        },
        
        
        /**
         * @desc 移动节点
         * @param {Object} 当前要移动的节点
         */
        _onMoveNode: function(treeNode) {
            var that = this;
            that.moveLayer.show({
                templateID: that.templateID,
                callback: function(targetNodeID, $btn) {
                    // 避免多次请求
                    if (that.moveNodeRequest) { return; }
                    that.moveNodeRequest = true;
                    util.api({
                        'url': '/DataReporting/MoveTemplateNode',
                        'type': 'post',
                        'dataType': 'json',
                        'data': {
                            templateID: that.templateID,
                            nodeID: treeNode.nodeID,
                            parentID: targetNodeID
                        },
                        'success': function(resp) {
                            var targetNode = that.zTree.getNodeByParam("nodeID", targetNodeID, null);
                            that.zTree.moveNode(targetNode, treeNode, 'inner');
                            that.moveLayer.hide();
                        },
                        'complete': function() {
                            that.moveNodeRequest = false;
                        }
                    },{
                        'submitSelector': $btn
                    });
                }
            });
        },

        
        /**
         * @desc 新增节点
         * @param {Object} 当前要要新增子元素的节点
         * @param {String} 新增节点类型 report： 上报节点  manage: 管理节点
         */
        _onAddNode: function(treeNode, type) {
            var that = this;
            that.addLayer.show({
                title: (type == 'report') ? '新建上报节点' : '新建管理节点',
                parentName: treeNode.nodeName,
                nodeID: treeNode.nodeID,
                callback: function(nodeID, newName, $btn) {
                    // 避免多次请求
                    if (that.addNodeRequest) { return; }
                    that.addNodeRequest = true;
                    util.api({
                        'url': '/DataReporting/AddTemplateNode',
                        'type': 'post',
                        'dataType': 'json',
                        'data': {
                            templateID: that.templateID,
                            isBottom: (type == 'report'),
                            parentID: nodeID,
                            nodeName: newName
                        },
                        'success': function(resp) {
                            if (resp.success) {
                                that.zTree.addNodes(treeNode, {
                                    nodeName: newName,
                                    nodeID: resp.value,
                                    isBottom: (type == 'report')
                                });
                                that.addLayer.hide();
                            }
                        },
                        'complete': function() {
                            that.addNodeRequest = false;
                        }
                    },{
                        'submitSelector': $btn
                    });
                }
            });
        },        

        
        /**
         * @desc 选中节点
         * @param {Object} 当前选中的节点
         */
        _onSelected: function(treeNode) {
            var that = this,
                $wrapEl = that.options.wrapEl,
                isBottom = treeNode.isBottom;

            // 避免重新渲染
            if (that.curTreeNode && that.curTreeNode.nodeID == treeNode.nodeID) {
                return false;
            }
            that.curTreeNode = treeNode;
 
            that.render({
                name: treeNode.nodeName,
                id: treeNode.nodeID,
                parent: !isBottom,
                otherPeople: false,
                templateID: that.templateID
            });
            
            // 置灰按钮
            if (!isBottom) {
                $('.btn-create-manage, .btn-create-report', $wrapEl).removeClass('gray');
            } else {
                $('.btn-create-manage, .btn-create-report', $wrapEl).addClass('gray');
            }    
        },      
        
        
        /**
         * @desc 初始化左测树
         */
        _zTreeInit: function() {
            var that = this;
            that.zTree = zTree.init($('#reportZreeBox'), that.treeNodes, {
                onDelNode: $.proxy(that._onDelNode, that),
                onRenameNode: $.proxy(that._onRenameNode, that),
                onMoveNode: $.proxy(that._onMoveNode, that),
                onAddNode: $.proxy(that._onAddNode, that),
                onSelected: $.proxy(that._onSelected, that)
            });            
        },

                
        /**
         * @desc重新渲染左侧树形
         */ 
        refreshTree: function() {
        	this.zTree && this.zTree.destroy();
            this.zTree = null;
            this.getTreeData();
        },
        
        
        /**
         * @desc渲染左侧树形结构
         */        
        getTreeData: function () {
            var that = this;
            
            if (that.getTreeDataRequest) {return false;}
            that.getTreeDataRequest = true;
            
            util.api({
                'url': '/DataReporting/GetTemplateNodes',
                'type': 'get',
                'dataType': 'json',
                'data': {
                    templateID: that.templateID
                },
                'success': function(resp) {
                    if (resp.success) {
                        that.treeNodes = resp.value.nodes;
                        that._zTreeInit();
                        that.layersInvolver.getAllSimpleEmployees();
                        that.layersInvolver.getAllOuterEmployees();
                    }
                },
                'complete': function() {
                    that.getTreeDataRequest = false;
                }
            });
        },
        
        
        /**
         * @desc渲染左侧树形结构
         */          
        renderZtree: function() {
            this.getTreeData();
        },
        
        
        render: function(data) {
        	data.showtip = true;
            this.layersInvolver.refresh(data);
        },
        reset: function(){
        	this.reportView && this.reportView.reset();
        }
    });

    module.exports = ReportSettinglayers;
});