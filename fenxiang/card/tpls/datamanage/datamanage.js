/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
	var root = window,
		FS = root.FS,
		tpl = FS.tpl,
		store = tpl.store,
		tplEvent = tpl.event;
	var util = require('util');

	exports.init = function() {
		var tplName = exports.tplName;
		var tplEl = exports.tplEl;
//		if(FS.getAppStore('globalData').isAllowDangerOperate) {
//			$('.left-crm-reset').show();
//		}
		var datamanageformEl = $('.datamanage-form', tplEl);
		var feedidEl = $('.j-feedid', datamanageformEl);
		var regExpStr = /^[0-9]{0,10}$/;
		/**
		 * 信息删除AJAX
		 */
		var deleteFeed = function(feedid) {
			util.api({
				"url": '/Management/DeleteFeed',
				"type": 'post',
				"data": {
					"feedID": feedid
				},
				"dataType": 'json',
				"success": function(responseData) {
					if (responseData.success) {
						util.showSucessTip('信息删除成功');
                                                feedidEl.val(''); //清空输入框
					}
                                         
				}
			});
		};
		/**
		 * 信息删除按钮
		 */
		datamanageformEl.on('click', '.j-button-submit', function() {
			var feedid = feedidEl.val();
                      
			if (feedidEl.val() == feedidEl.data('empty')) {
//                             util.alert('信息ID错误', '');
				return false;
			}
			if (regExpStr.test(feedidEl.val())) {
				util.confirm('删除该信息将删除该信息的所有回复、附件、图片、录音等信息且不可恢复、您确定删除吗？', '提示', function() {
					deleteFeed(feedid);
				});
			} else {
				util.alert('信息ID错误', '');
                                feedidEl.val(''); //清空输入框
			}
		});
		/**
		 * input文字获取焦点消失离开显示
		 */
		var inputTextVal = '';
		$('body').on('focusin', '[data-empty]', function() {
			var fieldEl = $(this);
			var val = $.trim(fieldEl.val()),
				emptyTip = fieldEl.data('empty');
			if (val == emptyTip) {
				fieldEl.val('');
			}
		}).on('focusout', '[data-empty]', function() {
			var fieldEl = $(this);
			var val = $.trim(fieldEl.val()),
				emptyTip = fieldEl.data('empty');
			if (val.length == 0) {
				fieldEl.val(emptyTip);
			}
		});

        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');
	};
});