/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
	var root = window;
	var FS = root.FS;
	var tpl = FS.tpl;
	var util = require('util');
	/**
	 * 组件声明
	 */
	var showInputError = util.showInputError; //输入框为空就红色闪闪
	exports.init = function() {
		var tplName = exports.tplName;
		var tplEl = exports.tplEl;
		var exmailsformEl = $('.exmails-form', tplEl);
		var emailtypeEl = $('.j-emailtype', exmailsformEl);
		var comnameEl = $('.j-comname', exmailsformEl);
		var appidEl = $('.j-appid', exmailsformEl);
		var appkeyEl = $('.j-appkey', exmailsformEl);
		/**
		 * 绑定邮箱AJAX
		 */
		var bindingEnterpriseMail = function(oData) {
			util.api({
				"url": '/Management/BindingEnterpriseMail',
				"type": 'post',
				"dataType": 'json',
				"data": oData,
				"success": function(responseData) {
					if (responseData.success) {
						bindingEnterpriseMailSuccess();
					}
				}
			}, {
				"submitSelector": $('.j-button-submit', exmailsformEl)
			});
		};
		/**
		 * 取消绑定邮箱AJAX
		 */
		var cancelEnterpriseMail = function() {
			util.api({
				"url": '/Management/CancelEnterpriseMail',
				"type": 'post',
				"data": null,
				"dataType": 'json',
				"success": function(responseData) {
					if (responseData.success) {
						cancelEnterpriseMailSuccess();
					};
				}
			}, {
				"submitSelector": $('.j-button-unsubmit', exmailsformEl)
			});
		};
		/**
		 * 绑定成功之后
		 */
		var bindingEnterpriseMailSuccess = function() {
			emailtypeEl.prop("disabled", true);
			comnameEl.prop("disabled", true);
			appidEl.closest('dd').hide();
			appkeyEl.closest('dd').hide();
			$('.j-button-submit', exmailsformEl).addClass('hide');
			$('.j-button-unsubmit', exmailsformEl).show();
		};
		/**
		 * 取消绑定成功之后
		 */
		var cancelEnterpriseMailSuccess = function() {
			emailtypeEl.prop("disabled", false);
			comnameEl.prop("disabled", false);
			appidEl.closest('dd').show();
			appkeyEl.closest('dd').show();
			$('.j-button-submit', exmailsformEl).removeClass('hide');
			$('.j-button-unsubmit', exmailsformEl).addClass('hide');
		};
		/**
		 * 提交绑定邮箱按钮事件
		 */
		exmailsformEl.on('click', '.j-button-submit', function() {
			var oData = {
				"exmailProviderID": emailtypeEl.val(),
				"domainName": comnameEl.val(),
				"appID": appidEl.val(),
				"appKey": appkeyEl.val()
			};
			if (comnameEl.val() == comnameEl.data('empty')) {
				showInputError(comnameEl);
				return false;
			}
			if (appidEl.val() == appidEl.data('empty')) {
				showInputError(appidEl);
				return false;
			}
			if (appkeyEl.val() == appkeyEl.data('empty')) {
				showInputError(appkeyEl);
				return false;
			}
			bindingEnterpriseMail(oData);
		});
		/**
		 * 取消绑定按钮事件
		 */
		exmailsformEl.on('click', '.j-button-unsubmit', function() {
			util.confirm('确定要取消绑定企业邮箱吗', '提示', function() {
				cancelEnterpriseMail();
			});
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

        //设置初始绑定邮箱数据
        util.api({
            "url":"/Management/GetExmailDomainName",
            "type":"get",
            "success":function(responseData){
                var dataRoot;
                if(responseData.success){
                    dataRoot=responseData.value;
                    //设置公司域名
                    if(dataRoot.length>0){
                        comnameEl.val(dataRoot);
                        bindingEnterpriseMailSuccess();
                    }
                }
            }
        });
	};
});