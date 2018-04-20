/**
 * 报数-审核记录-查看记录
 */
define(function(require, exports, module){
	var root = window,
	    FS = root.FS,
	    tpl = FS.tpl
	    util = FS.util;
	var moment = require('moment');
	require('modules/app-reportcheck-item/app-reportcheck-item.css');
    var tplhtml = require('modules/app-reportcheck-item/app-reportcheck-item.html');
	
    //CONST变量
    var CONST = {
    	STATUS: {
    		WAIT: 1,//待审核
    		PASS: 2,//通过
    		FAIL: 3//驳回
    	}
    };
    	
    /**
     * 定义类
     */
    var ReportCheckItem = function(opts) {
    	this.opts = $.extend({
            wrapper: null,
            templateID: null,
            batchNo: null,
            isreceive: false
        }, opts || {});;
        this.$el = this.opts.wrapper;
        this.init();
    }; 
    ReportCheckItem.prototype = {
    	init: function(){
    		this.$el.html(tplhtml);
    		this.bindEvents();
    	},
    	show: function(opts){
    		var that = this;
    		this.opts = $.extend(this.opts, opts || {});
    		util.api({
    			"url": '/DataReporting/GetBatchDrtBakCompare',
                "type": 'get',
                "dataType": 'json',
                "data": {
    				templateID: parseInt(this.opts.templateID),
    				batchNO: parseInt(this.opts.batchNo)
    			},
                "success": function (responseData) {
                    if (responseData.success) {
                    	that.render(responseData.value)
                    }
                }
    		});
    	},
    	/**
    	 * 渲染
    	 */
    	render: function(data){
    		var that = this;
    		$('.item-title', this.$el).text(data.baseInfo.templateName);
    		$('.info-sender', this.$el).text(data.baseInfo.employee.name);
    		$('.info-begintime', this.$el).text(moment.unix(data.baseInfo.createTime).format('YYYY-MM-DD HH:mm'));
    		$('.info-state', this.$el).attr('class', 'info-content info-state info-' + this.getApproveStatus(data.baseInfo.dataApproveStatus).cls).text(this.getApproveStatus(data.baseInfo.dataApproveStatus).desc);
    		$('.info-approver', this.$el).text(data.baseInfo.dataApproverName);
    		$('.info-launchtime', this.$el).text(moment.unix(data.baseInfo.updateTime).format('YYYY-MM-DD HH:mm'));
    		var $table = $('.reportcheck-item-tb', this.$el),
    			$thead = $('thead', $table),
    			$tbody = $('tbody', $table);
    		var theadHtml = '<tr><th width="45">序号</th><th width="45">状态</th><th>层级</th>' + this.getTheadHtml(data.items[0].compareInfos) + '</tr>';
    		$thead.html(theadHtml);
    		var tbodyHtml = [];
    		$.each(data.items, function(idx, item) {
    			tbodyHtml.push('<tr><td>' + (idx+1) + '</td><td><span class="rc-type type-' + that.getReportType(item.compareInfos).cls + '">' + that.getReportType(item.compareInfos).desc + '</span></td><td>' + item.nodeName + '</td>' + that.getTbodyHtml(item) + '</tr>');
    		});
    		$tbody.html(tbodyHtml.join(''));
    		if(data.baseInfo.dataApproveStatus == CONST.STATUS.WAIT && that.opts.isreceive) {
    			$('.rc-btn-ctner', this.$el).show();
    		} else {
    			$('.rc-btn-ctner', this.$el).hide();
    		}
    	},
    	/**
    	 * 获取审批状态
    	 */
    	getApproveStatus: function(status){
    		var result = {};
    		switch(status) {
    			case CONST.STATUS.WAIT: 
    				result = {
    					desc: '待审核',
    					cls: 'orange'
    				};
    				break;
    			case CONST.STATUS.PASS: 
    				result = {
    					desc: '已通过',
    					cls: 'green'
    				};
    				break;
    			case CONST.STATUS.FAIL: 
    				result = {
    					desc: '驳回',
    					cls: 'red'
    				};
    				break;
    		}
    		return result;
    	},
    	/**
    	 * 获取修改类型
    	 */
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
    	/**
    	 * 获取表头html
    	 */
    	getTheadHtml: function(data){
    		var result = [];
    		$.each(data, function(idx, item){
    			result.push('<th>' + item.fieldDesc + '</th>');
    		});
    		return result.join('');
    	},
    	
    	/**
    	 * 获取表体html
    	 */
    	getTbodyHtml: function(data){
    		var result = [],
    			str,
    			type = this.getReportType(data.compareInfos).cls,
    			nodeName = data.nodeName;
    		$.each(data.compareInfos, function(idx, item){
    			if(type == 'edit') {
    				str = '<div class="value-before">' + item.valueBefore + '</div><div class="value-after">' + item.valueAfter + '</div>';
    			} else {
    				str = '<div class="value-normal">' + item.valueAfter + '</div>';
    			}
    			result.push('<td>' + str + '</td>');
    		});
    		return result.join('');
    	},
    	
    	bindEvents: function(){
    		var that = this;
    		$('.btn-pass', this.opts.wrapper).bind('click', function(){
    			util.api({
                    "url": '/DataReporting/AgreeDrtBakData',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
    					templateID: that.opts.templateID,
    					batchNO: that.opts.batchNo
    				},
                    "success": function (responseData) {
    					util.remind(2, '操作成功');
                        that.show();
                    }
                });
    		});
    		$('.btn-fail', this.opts.wrapper).bind('click', function(){
    			util.api({
                    "url": '/DataReporting/DisagreeDrtBakData',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
    					templateID: that.opts.templateID,
    					batchNO: that.opts.batchNo
    				},
                    "success": function (responseData) {
    					util.remind(2, '操作成功');
                        that.show();
                    }
                });
    		});
    	}
    }
    module.exports = ReportCheckItem;
});