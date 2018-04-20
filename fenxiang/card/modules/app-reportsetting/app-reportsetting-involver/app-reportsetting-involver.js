define(function(require, exports, module) {
    
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = require('util'),
        Dialog = require("dialog"),
        fsHelper = require('modules/fs-qx/fs-qx-helper'),
        JoinDialog = fsHelper.JoinDialog,
        htmlTpl = require('./app-reportsetting-involver.html');
    
    require('./app-reportsetting-involver.css');

    var LayersInvolver = Backbone.View.extend({
    
        tagName: 'div',
        
        className: 'reportseeting-layers-involver',
        
        template: _.template($(htmlTpl).filter('.report-layers-tpl').html()),
        
        options: {
            wrapEl: null, // 外层元素
            templateID: null // 上一步创建表的id
        },        
        
        data: {
        	name: '',//节点名称
        	id: null,//节点id
        	parent: false,//是否是管理节点
        	templateID: null,//模板id
        	showtip: true //是否显示tip
        },
                
        // 分页条数
        pageSize: 999999,
                
        // 联系人弹框对象
        dialog: null,
        
        // 当前查看人数据
        viewPeopleData: [],
        
        // 内部上报人数据
        innerPeopleData: [],
        
        // 外部上报人数据
        outerPeopleData: [],
        
        // 所有人员列表
        allSimpleEmployees: [],
        
        // 所有外部人员列表
        allOuterEmployees: [],
        
        // 类型  viewer查看人   inner内部上报人   outer外部上报人
        empType: 'viewer',
        
        events: {},
        
        removeStart: false,
        
        initialize: function() {
            this.wrapEl = this.options.wrapEl;
            this.templateID = this.options.templateID * 1 || null;
            this.setViewPeopleDialog();
            this.bindEvents();
        },
        bindEvents: function(){
        	var that = this;
        	this.wrapEl.delegate('.btn-viewer-edit, .btn-inner-edit, .btn-outer-edit', 'click', function(e){
        		that.addViewPeopleHandle(e);
        	}).delegate('.ico-del-btn', 'click', function(e){
        		that.removeViewPeople(e);
        	});
        },
        refresh: function(data) {
        	this.data = _.extend(this.data, data)
        	this.$el.html('');
            this.templateID = data.templateID * 1;
            this.render(data);
            this.getViewPeopleData();
        },
               
        // 获取所有人员的数据
        getAllSimpleEmployees: function () {
            var that = this;
            util.api({
                "url": '/Employee/GetAllSimpleEmployees',
                "type": 'get',
                "dataType": 'json',
                "data": {},
                "success": function (resp) {
                    if (resp.success) {
                    	var datas = resp.value;
                        _.each(datas, function (data) {
                            data.id = data.employeeID;
                        });
                        that.allSimpleEmployees = datas;
                    }
                }
            });
        }, 
        
        // 获取有报数权限的外部用户
        getAllOuterEmployees: function(){
        	var that = this;
            util.api({
                "url": '/DataReporting/GetExternalEmp',
                "type": 'get',
                "dataType": 'json',
                "data": {},
                "success": function (resp) {
                    if (resp.success) {
                    	datas = resp.value.externalEmps;
                        _.each(datas, function (data) {
                            data.id = data.externalEmployeeKey;
                        });
                        that.allOuterEmployees = datas;
                    }
                }
            });
        },
        
        /*
         * 设置弹框
         */ 
        addViewPeopleHandle: function(e) {
            var	$target = $(e.target),
            	type = $target.attr('data-type'),
            	that = this,      
                joinDataIds = [],
                joinData = [],
                unjoinData = [],
                datas = [];  // 已添加的ids
            if(type == 'viewer') {
            	datas = that.viewPeopleData.browsers;
            	_.each(datas, function(item) {
                    joinDataIds.push(item.employeeID);
                });
            	that.empType = 'viewer';
            	that.dialog.setTitle('添加查看人');
            } else if(type == 'inner') {
            	datas = that.innerPeopleData.hybridEmployees;
            	_.each(datas, function(item) {
                    joinDataIds.push(item.employeeID);
                });
            	that.empType = 'inner';
            	that.dialog.setTitle('添加内部上报人');
            } else if(type == 'outer') {
            	datas = that.outerPeopleData.hybridEmployees;
            	_.each(datas, function(item) {
                    joinDataIds.push(item.externalEmployeeKey);
                });
            	that.empType = 'outer';
            	that.dialog.setTitle('添加外部上报人');
            }
            if(this.empType == 'viewer' || this.empType == 'inner') {
            	unjoinData = _.reject(that.allSimpleEmployees, function (item) {
                    return _.some(joinDataIds, function (val) {
                        return item.employeeID == val;
                    });
                });
            	joinData = _.map(joinDataIds, function (participantId) {
                    return util.getContactDataById(participantId, 'p');
                });
            } else {
            	if(that.allOuterEmployees.length) {
	            	unjoinData = _.reject(that.allOuterEmployees, function (item) {
	                    return _.some(joinDataIds, function (val) {
	                        return item.externalEmployeeKey == val;
	                    });
	                });
            	}
            	_.each(that.outerPeopleData.hybridEmployees, function(item){
            		item.id = item.externalEmployeeKey;
            		joinData.push(item);
            	});
            }
            
            that.dialog.setInitData({
                "joinData": joinData,
                "unjoinData": unjoinData
            });
            
            that.dialog.show();
        },        
        
        /*
         * 设置添加查看人的弹出框
         */ 
        setViewPeopleDialog: function() {
            var that = this;
            
            that.dialog = new JoinDialog({
                "unjoinLabel": "未选员工",
                "joinLabel": "已选员工",
                "unit": "项",
                "bbarUnit": "个员工",
                "inputPlaceholder": "输入关键词，快速筛选员工",
                "unjoinEmptyTip":"没有未选员工",
                "unjoinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工",
                "joinEmptyTip":"没有已选员工",
                "joinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工"
            }).render();
            
            that.dialog.setTitle('添加查看人');

            //确定按钮
            that.dialog.set('successCb', function(joinData) {
                var ids = [];
                _.each(joinData, function(item) {
                    ids.push(item.id);
                });
                that.addOrRemovePeople(ids);
                this.hide();
            });        
        },
        
        // 添加外部上报人
        addOtherpeopleDialog: function() {
            var that = this;
            if (that.OtherPeopleDialog) {
                that.OtherPeopleDialog.show();
                return false;
            }
            var OtherPeopleDialog = Dialog.extend({
                attrs: {
                    content: $(htmlTpl).filter('.add-otherpeople-tpl').html(),
                    closeTpl: '',
                    width: 520
                },
                events: {
                    'click .cancel-addOther-btn': 'cancelAddOther', // 取消添加外部人员
                    'click .enter-addOther-btn': 'enterAddOther' // 确定添加外部人员
                },
                cancelAddOther: function() {
                    this.hide();
                },
                validateForm: function() {
                    var longReg = /^\S{1,50}$/,
                        emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        phoneReg = /^1[3|4|5|8][0-9]\d{8}$/;
                        
                    return false;
                },
                enterAddOther: function() {
                    alert('xx');
                }
            });
            that.OtherPeopleDialog = new OtherPeopleDialog();
            that.OtherPeopleDialog.show();
        },
        
        /**
         * 
         * 添加或删除查看人 上报人
         */
        addOrRemovePeople: function(ids) {
            var that = this;
            	url = '',
            	data = {
        			templateID: that.data.templateID,
                    nodeID: that.data.id
            	};
           if(this.empType == 'outer') {
        	   url = '/DataReporting/AddOrRemoveNodeExternalEmployee';
        	   data.empKeys = ids;
           } else {
        	   url = '/DataReporting/AddOrRemoveNodeEmployee';
        	   data.empType = (this.empType == 'viewer' ? 1 : 2);
        	   data.empIDs = ids;
           }
            util.api({
                'url': url,
                'type': 'post',
                'dataType': 'json',
                'data': data,
                'success': function(resp) {
                    if (resp.success) {
                    	var type = that.empType;
                    	if(type == 'viewer') {
                    		that.getViewerData();
                    	} else if(type == 'inner') {
                    		that.getInnerData();
                    	} else if(type == 'outer') {
                    		that.getOuterData();
                    	}
                    }
                }
            });
        },

        /* 
         * 删除按钮的行为
         */
        removeViewPeople: function(e) {
            var that = this,
                target = e.target,
                id = $(target).attr('data-id'),
                type = $(target).attr('data-type'),
                data = {
	            	templateID: that.templateID,
	                nodeID: that.data.id
            	};
            if(type == 'outer') {
            	url = '/DataReporting/RemoveSingleNodeExternalEmployee';
            	data.empKey = id;
            } else {
            	url = '/DataReporting/RemoveSingleNodeEmployee';
            	data.empID = id*1;
            	if(type == 'viewer') {
                	data.empType = 1;
                } else if(type == 'inner') {
                	data.empType = 2;
                }
            }
            if (this.removeStart) {
                return false;
            }
            this.removeStart = true;
            util.api({
                'url': url,
                'type': 'post',
                'dataType': 'json',
                'data': data,
                'success': function(resp) {
                    if(resp.success) {
                    	if(type == 'viewer') {
                    		that.getViewerData();
                    	} else if(type == 'inner') {
                    		that.getInnerData();
                    	} else if(type == 'outer') {
                    		that.getOuterData();
                    	}
                    }
                    that.removeStart = false;
                },
                'error': function(){
                	that.removeStart = false;
                }
            });
        },

        /**
         * 
         * 获取查看人或者上报人数据
         */
        getViewPeopleData: function(parent) {
            var that = this;
            //获取查看人
            this.getViewerData();
            if(!this.data.parent) {
            	//获取内部上报人
            	this.getInnerData();
            	//获取外部上报人
            	this.getOuterData();
            }
        },
        /**
         * 
         */
        getOuterData: function(){
        	var that = this;
        	util.api({
                'url': '/DataReporting/GetNodeExternalEmp',
                'type': 'get',
                'dataType': 'json',
                'data': {
                    templateID: that.data.templateID,
                    nodeID: that.data.id,
                    pageSize: that.pageSize,
                    pageNumber: 1
                },
                'success': function(resp) {
                    if (resp.success) {
                        that.outerPeopleData = resp.value;
                        that.renderTable('outer'); 
                    }
                }
            });
        },
        
        /**
         * 获取内部上报人数据
         */
        getInnerData: function(){
        	var that = this;
        	util.api({
                'url': '/DataReporting/GetNodeSenders',
                'type': 'get',
                'dataType': 'json',
                'data': {
                    templateID: that.data.templateID,
                    nodeID: that.data.id,
                    pageSize: that.pageSize,
                    pageNumber: 1
                },
                'success': function(resp) {
                    if (resp.success) {
                        that.innerPeopleData = resp.value;
                        that.renderTable('inner'); 
                    }
                }
            });
        },
        
        /**
         * 获取查看人数据
         */
        getViewerData: function(){
        	var that = this;
        	util.api({
                'url': '/DataReporting/GetNodeBrowsers',
                'type': 'get',
                'dataType': 'json',
                'data': {
                    templateID: that.data.templateID,
                    nodeID: that.data.id,
                    pageSize: that.pageSize,
                    pageNumber: 1
                },
                'success': function(resp) {
                    if (resp.success) {
                        that.viewPeopleData = resp.value;
                        that.renderTable('viewer'); 
                    }
                }
            });
        },
        
        /**
         * 渲染表格数据
         */
        renderTable: function (type) {
            var that = this,
                template = _.template($(htmlTpl).filter('.report-layers-tbtpl').html()),
                data = []; 
            if(type == 'viewer') {
            	data = that.viewPeopleData.browsers;
            	for(var i=0,len=data.length; i<len; i++) {
                	data[i].imgsrc = util.getAvatarLink(data[i].profileImage, 2);
                }
            } else if(type == 'inner') {
            	data = that.innerPeopleData.hybridEmployees;
            	for(var i=0,len=data.length; i<len; i++) {
                	data[i].imgsrc = util.getAvatarLink(data[i].profileImage, 2);
                }
            } else if(type == 'outer') {
            	data = that.outerPeopleData.hybridEmployees;
            	for(var i=0,len=data.length; i<len; i++) {
                	data[i].imgsrc = util.getExternalLink(data[i].externalProfileImage);
                	data[i].employeeID = data[i].externalEmployeeKey;
                }
            }
            data.type = type;
            $('.report-tb-box.list-' + type, that.wrapEl).html(template({data: data}));          
        },
        
        render: function(data) {
            this.wrapEl.html(this.template(data));
        }
    });

    module.exports = LayersInvolver;
});