define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event,
        store = tpl.store,
        list = tpl.list;
    
    var util = require('util'),
    	Pagination = require('uilibs/pagination2'),
    	leftNav = require('modules/app-report-leftnav/app-report-leftnav'),
    	ReportCheckItem = require('modules/app-reportcheck-item/app-reportcheck-item'),
    	SearchBox = require('uilibs/search-box'), //搜索框组件
    	moment = require('moment');
    var tplName,
    	reportCheck;
    /**
     * 定义审核对象
     */
    var ReportCheck = function(opts) {
    	var that = this;
    	this.opts = $.extend({
    		element: null,
    		receivePageEl: null,
    		sendPageEl: null,
    		data: {
	    		keyword: '',//string，搜索关键字
	            pageSize: 10,//int，分页大小
	            pageNumber: 1//int，页数
    		},
    		type: 'receive',
    		conf: {
    			receive: {
    				url: '/DataReporting/GetMyApproveDrtBakData',
    				blank: '没有收到审核请求',
    				cols: 6
    			},
    			send: {
        			url: '/DataReporting/GetMySendDrtBakData',
        			blank: '没有发出的审核请求',
        			cols: 4
    			}
    		}
    	}, opts || {});
    	this.element = this.opts.element;
    };
    /**
     * 原型方法
     */
    ReportCheck.prototype = {
    	//初始化
		init: function(type) {
    		this.opts.type = type || 'receive';
    		var that = this;
	        this.reportCheckItem = new ReportCheckItem({
	        	wrapper: $('.report-check-item-content', this.element)
	        });
	        // 设置左侧导航
	        leftNav.init($('.tpl-l', this.element));
//	        this.load();
	        
            this.searchBox = new SearchBox({
                "element": $(".report-search-wrap", that.element),
                "placeholder": '搜索'
            });
	        this.bindEvents();
	    },
	    //加载数据
	    load: function(){
	    	var that = this,
	    		$tbody = $('.rc-' + that.opts.type + '-tb tbody', this.element),
	    		conf = that.opts.conf[that.opts.type];
            util.api({
                "url": conf.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.opts.data,
                "beforeSend": function () {
                    var loadingEl = '<tr><td colspan="' + conf.cols + '"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    $tbody.html(loadingEl);
                },
                "success": function (responseData) {
                    if (responseData.success) {
                    	$tbody.html(that.renderTable(responseData));
                    	if(that.opts.type == 'receive') {
                    		if(!that.receivePagination) {
                    			that.receivePagination = new Pagination({
                                    "element": that.opts.receivePageEl,
                                    "pageSize": that.opts.data.pageSize,
                                    "visiblePageNums": 7
                                });
                                that.receivePagination.render();
                                that.receivePagination.on('page', function (pageNumber) {
                                    that.refresh({
                                        pageNumber: pageNumber// int，页码
                                    });
                                });
                    		}
                    		that.receivePagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                    	} else {
                    		if(!that.sendPagination) {
                    			that.sendPagination = new Pagination({
                                    "element": that.opts.sendPageEl,
                                    "pageSize": that.opts.data.pageSize,
                                    "visiblePageNums": 7
                                });
                                that.sendPagination.render();
                                that.sendPagination.on('page', function (pageNumber) {
                                    that.refresh({
                                        pageNumber: pageNumber// int，页码
                                    });
                                });
                    		}
                    		that.sendPagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                    	}
                    }
                }
            });
	    },
	    //渲染列表数据
	    renderTable: function(response) {
	    	var that = this,
	    		html = [],
	    		str;
	    	response.value.items = response.value.items || [];
	    	if(that.opts.type == 'receive') {
	    		if(response.value.items.length) {
			    	$.each(response.value.items, function(idx, item){
			    		str = '<tr><td class="text-left">' + item.templateName + '</td><td>' + item.employee.name + '</td><td>' + item.employee.mobile + '</td><td>' + moment.unix(item.createTime).format('YYYY-MM-DD HH:mm') + '</td>' + that.getState(item.dataApproveStatus) + '<td><a href="#" data-templatename="' + item.templateName + '" data-templateid="' + item.templateID + '" data-batchno="' + item.batchNo + '" onclick="return false;" class="btn-see">查看</a></td></tr>';
			    		html.push(str);
			    	});
		    	} else {
		    		html.push('<tr class="blank"><td colspan="6">' + (that.opts.data.keyword ? '未搜索到符合条件的结果' : that.opts.conf['receive'].blank) + '</td></tr>');
		    	}
	    	} else {
	    		if(response.value.items.length) {
			    	$.each(response.value.items, function(idx, item){
			    		str = '<tr><td class="text-left">' + item.templateName + '</td><td>' + moment.unix(item.updateTime).format('YYYY-MM-DD HH:mm') + '</td>' + that.getState(item.dataApproveStatus) + '<td><a href="#" data-templatename="' + item.templateName + '" data-templateid="' + item.templateID + '" data-batchno="' + item.batchNo + '" onclick="return false;" class="btn-see">查看</a></td></tr>';
			    		html.push(str);
			    	});
		    	} else {
		    		html.push('<tr class="blank"><td colspan="4">' + (that.opts.data.keyword ? '未搜索到符合条件的结果' : that.opts.conf['send'].blank) + '</td></tr>');
		    	}
	    	}
	    	return html.join('');
	    },
	    /**
	     * reset
	     */
	    reset: function(){
	    	$('.report-check-list-content', this.element).show();
    		$('.report-check-item-content', this.element).hide();
    		$('.report-title-setting', this.element).show();
	    	$('.app-tab', this.element).removeClass('active');
	    	$($('.app-tab', this.element)[0]).trigger('click');
	    },
	    /**
	     * 获取审批状态
	     */
	    getState: function(dataApproveStatus){
	    	var result = '<td></td>';
	    	switch(dataApproveStatus) {
	    	case 1:
	    		result = '<td class="f-orange">待审核</td>';
	    		break;
	    	case 2:
	    		result = '<td class="f-green">已通过</td>';
	    		break;
	    	case 3:
	    		result = '<td class="f-red">驳回</td>';
	    		break;
	    	case 4:
	    		result = '<td>无需审核</td>';
	    		break;
	    	}
	    	return result;
	    },
	    //刷新列表
	    refresh: function(data){
	    	this.opts.data = _.extend(this.opts.data, data);
            this.load();
	    },
	    urlrefresh: function(type) {
	    	this.opts.type = type || 'receive';
	    	$('.report-check-tabs .app-tab', this.element).removeClass('active');
	    	if(type == 'receive') {
	    		$($('.report-check-tabs .app-tab', this.element)[0]).click();
	    	} else {
	    		$($('.report-check-tabs .app-tab', this.element)[1]).click();
	    	}
	    },
	    //事件绑定
	    bindEvents: function(){
	    	var that = this,
	    		reportcheckEl = this.element.closest('#report-reportcheck');
	    	$('.report-check-tabs', this.element).delegate('.app-tab', 'click', function(){
	    		var $this = $(this);
	    		if($this.hasClass('active')) return;
	    		var type = $this.attr('data-type');
	    		that.opts.type = type;
	    		$('.report-check-tabs .app-tab', that.element).removeClass('active');
	    		$this.addClass('active');
	    		that.searchBox && that.searchBox.clear();
	    		that.opts.data.keyword = '';
	    		if(type == 'receive') {
	    			$('.report-receive-ctner', that.element).show();
	    			$('.report-send-ctner', that.element).hide();
	    		} else {
	    			$('.report-send-ctner', that.element).show();
	    			$('.report-receive-ctner', that.element).hide();
	    		}
	    		that.load({
	    			pageNumber: 1
	    		})
	    	});
	    	$('.rc-send-tb', that.element).delegate('.btn-see', 'click', function(e){
	    		$('.report-check-list-content', that.element).hide();
	    		$('.report-check-item-content', that.element).show();
	    		$('.report-title-setting', that.element).hide();
	    		that.reportCheckItem.show({
	    			templateID: $(this).attr('data-templateid'),
	    			batchNo: $(this).attr('data-batchno'),
	    			isreceive: false
	    		});
	    		e.stopPropagation();
	    	});
	    	$('.rc-send-tb', that.element).delegate('tbody tr', 'click', function(){
	    		if($(this).hasClass('blank')) return;
	    		$(this).find('.btn-see').click();
	    	});
	    	$('.rc-receive-tb', that.element).delegate('.btn-see', 'click', function(e){
	    		$('.report-check-list-content', that.element).hide();
	    		$('.report-check-item-content', that.element).show();
	    		$('.report-title-setting', that.element).hide();
	    		that.reportCheckItem.show({
	    			templateID: $(this).attr('data-templateid'),
	    			batchNo: $(this).attr('data-batchno'),
	    			isreceive: true
	    		});
	    		e.stopPropagation();
	    	});
	    	$('.rc-receive-tb', that.element).delegate('tbody tr', 'click', function(){
	    		if($(this).hasClass('blank')) return;
	    		$(this).find('.btn-see').click();
	    	});
	    	that.searchBox.on('search', function (queryValue) {
	    		var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {});
                } else {
                	that.beginSearch(queryValue);
                }
            });
	    	reportcheckEl.on('click', '.reportcheck-list', function(){
	    		that.reset();
	    	});
	    },
	    beginSearch: function(keyword){
    		this.refresh({
    			keyword: keyword
    		});
	    }
    };


    /**
     * 默认初始化
     */
    exports.init = function(){
        tplName = exports.tplName;
    	var tplEl = exports.tplEl;
    	reportCheck = new ReportCheck({
    		element: tplEl,
    		receivePageEl: $('.report-receive-ctner .page-ctner', tplEl),
    		sendPageEl: $('.report-send-ctner .page-ctner', tplEl)
    	});
    	reportCheck.init();
    };
    //监听页面切换事件
    tplEvent.on('switched', function (tplName2, tplEl) {
        var queryParams, tagType, data;

        //如果是当前页面
        if (tplName2 == tplName) {
            queryParams = util.getTplQueryParams2();  //取地址栏的参数格式示例 /=/tagType-4
            if(queryParams==2){//
            	reportCheck.urlrefresh('send');
            }else{
            	reportCheck.urlrefresh('receive');
            }
        }
    });
});
