/**
 * 创建层级-上报节点视图
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = require('util'),
        tplhtml = require('modules/app-reportsetting/app-reportsetting-reportview/app-reportsetting-reportview.html'),
        Pagination = require('uilibs/pagination2'),
        SearchBox = require('uilibs/search-box'), //搜索框组件;
        EditLayer = require('modules/app-reportsetting/app-reportsetting-editlayer/app-reportsetting-editlayer'),
        MoveLayer = require('modules/app-reportsetting/app-reportsetting-movelayer/app-reportsetting-movelayer'),
        AddLayer = require('modules/app-reportsetting/app-reportsetting-addlayer/app-reportsetting-addlayer');
    require('modules/app-reportsetting/app-reportsetting-reportview/app-reportsetting-reportview.css');
    var ReportView = Backbone.View.extend({
    	options: {
    		wrapEl: null,
    		data: {
    			pageSize: 10,
    			pageNumber: 1,
    			keyword: '',
    			templateID: null
    		}
    	},
    	template: _.template($(tplhtml).filter('.report-layers-reportview-tpl').html()), //模板
    	refresh: function(data){
    		data = data || {};
    		this.options.data = _.extend(this.options.data, data);
    		this.load();
    	},
    	reset: function(){
    		this.options.data.pageNumber = 1;
    		this.options.data.keyword = '';
    		this.searchBox.clear();
    		this.page.reset();
    	},
    	events: {
    		"click .btn-create": "create", //新建节点
    		"click .btn-move": "move", //移动
    		"click .btn-del": "del" //删除
    	},
    	//点击新建上报节点
    	create: function(){
    		var that = this;
    		this.addLayer.show({
        		title: '新建上报节点',
        		templateID: this.options.data.templateID,
        		callback: function(nodeID, nodeName, $btn){
	    			util.api({
	                    'url': '/DataReporting/AddTemplateNode',
	                    'type': 'post',
	                    'dataType': 'json',
	                    'data': {
	                        templateID: that.options.data.templateID,
	                        isBottom: true,
	                        parentID: nodeID,
	                        nodeName: nodeName
	                    },
	                    'success': function(resp) {
	                        if (resp.success) {
	                        	that.refresh({
	        						pageNumber: 1,
	        						keyword: ''
	        					});
	                            that.addLayer.hide();
	                        }
	                    }
	                },{
                        'submitSelector': $btn
                    });
    			}
        	});
    	},
    	load: function(){
    		var that = this;
    		util.api({
    			"url": '/DataReporting/GetBottomNode',
                "type": 'get',
                "dataType": 'json',
                "data": that.options.data,
                "success": function(responseData) { 
    				if(responseData.success) {
    					that.renderTbody(responseData.value.items);
    					that.setPage(responseData.value.totalCount);
    					that.$el.find('.checkbox-selectall-btn').removeClass('mn-selected');
    				}
    			}
    		});
    	},
    	render: function(){
    		var elEl = this.$el;
	        elEl.html(this.template({id: 2}));
	        this.options.wrapEl.html(elEl);
    	},
    	initialize: function(){
    		var that = this;
    		this.render();
    		this.searchBox = new SearchBox({
                "element": $(".search-warp", this.$el),
                "placeholder": '搜索'
            });
    		this.editLayer = new EditLayer();
    		this.editLayer.on('saveName', function(){
    			that.refresh({
    				pageNumber: 1,
    				keyword: ''
    			});
    		});
    		this.addLayer = new AddLayer();
    		this.moveLayer = new MoveLayer();
    		this.bindEvents();
    	},
    	bindEvents: function(){
    		var that = this;
    		$(this.$el).delegate('.btn-edit', 'click', function(){
    			var $this = $(this);
    			that.editLayer.show({
    				templateID: that.options.data.templateID,
    				id: $(this).attr('data-id'),
    				name: $(this).closest('tr').find('.node-name').text()
    			});
    		});
    		that.searchBox.on('search', function (queryValue) {
	    		var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {});
                } else {
                	that.refresh({keyword: queryValue});
                }
            });
    		$(this.$el).delegate('.checkbox-selectall-btn', 'click', function(e){
    			that._checkboxSelectall(e);
    		});
    	},
    	move: function(){
    		var that = this,
	            selectedCheckboxEl = $('.report-view-tb tbody .checkbox-for-comtable .mn-selected', that.$el);
	        if(selectedCheckboxEl.length > 0){
	        	that.moveLayer.show({
            		templateID: that.options.data.templateID,
            		callback: function(parentID){
		        		var nodeIDs = [];
		            	$.each(selectedCheckboxEl, function(idx, item){
		            		var nodeID = $(item).attr('data-value');
		            		nodeIDs.push(parseInt(nodeID));
		            	});
		            	util.api({
		        			"url": '/DataReporting/BatchMoveTemplateBottomNode',
		                    "type": 'post',
		                    "dataType": 'json',
		                    "data": {
		            			templateID: that.options.data.templateID,
		            			parentID: parentID,
		            			nodeIDs: nodeIDs
		            		},
		                    "success": function(responseData) { 
		        				if(responseData.success) {
		        					that.refresh({
		        						pageNumber: 1,
		        						keyword: ''
		        					});
		        				}
		        			}
		        		});
	        		}
            	});
	        } else {
	            util.alert('请选择节点');
	        }
    	},
    	del: function(){
    		var that = this,
	            selectedCheckboxEl = $('.report-view-tb tbody .checkbox-for-comtable .mn-selected', that.$el);
	        if(selectedCheckboxEl.length > 0){
	            util.confirm('确定删除所选节点吗？', '删除上报节点', function(){
	            	var nodeIDs = [];
	            	$.each(selectedCheckboxEl, function(idx, item){
	            		var nodeID = $(item).attr('data-value');
	            		nodeIDs.push(parseInt(nodeID));
	            	});
	            	util.api({
	        			"url": '/DataReporting/BatchRemoveTemplateNode',
	                    "type": 'post',
	                    "dataType": 'json',
	                    "data": {
	            			templateID: that.options.data.templateID,
	            			nodeIDs: nodeIDs
	            		},
	                    "success": function(responseData) { 
	        				if(responseData.success) {
	        					that.refresh({
	        						pageNumber: 1,
	        						keyword: ''
	        					});
	        				}
	        			}
	        		});
	            });            
	        } else {
	            util.alert('请选择节点');
	        }
    	},
    	//选择所有复选框
        _checkboxSelectall: function (e) {
            var meEl = $(e.currentTarget);
            var tableEl = this.$el.find('.report-view-tb tbody');
            var allCheckboxEl = $('.checkbox-for-comtable', tableEl);
            var checkboxItemEl = allCheckboxEl.find('.mn-checkbox-item');
            if (meEl.is('.mn-selected')) {
                checkboxItemEl.removeClass('mn-selected');
                $('tbody tr', this.oTable).removeClass('row_selected');
            } else {
                checkboxItemEl.addClass('mn-selected');
                $('tbody tr', this.oTable).addClass('row_selected');
            }
        },
    	renderTbody: function(data){
    		var that = this,
    			$tbody = $('tbody', that.$el),
    			template = _.template($(tplhtml).filter('.reportview-list-tbody-tpl').html());
    		$tbody.html('');
    		if(data.length) {
    			$.each(data, function(idx, item) {
    				item.viewers = that.getWords(item.top6BrowserName);
    				item.inners = that.getWords(item.top6SenderName);
    				item.outers = that.getWords(item.top6ExternalEmpName);
    				$tbody.append(template(item));
    			});
    		} else {
    			$tbody.append('<tr><td colspan="7" class="empty-tip">' + (that.options.data.keyword ? '未搜索到符合条件的结果' : '还没有上报节点') + '</td></tr>')
    		}
    	},
    	getWords: function(arrTop){
    		arrTop = arrTop || [];
    		var result = arrTop.join(','),
    			len = arrTop.length;
    		if(result.length > 7) {
    			result = result.substring(0, 7) + '...等' + len + '人';
    		}
    		return result;
    	},
    	setPage: function(totalSize){
    		var that = this;
    		if(!this.page) {
    			this.page = new Pagination({
                    "element": $('.page-ctner', this.$el),
                    "pageSize": this.options.data.pageSize,
                    "visiblePageNums": 7
                });	
        		this.page.on('page', function (pageNumber) {
                    that.refresh({
                        pageNumber: pageNumber// int，页码
                    });
                });
    		}
    		this.page.setTotalSize(totalSize);
    	}
    });
    module.exports = ReportView;
});