/**
 * Created by Richard on 2014/11/5.
 */

define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var showInputError = util.showInputError; //输入框为空就红色闪闪

    exports.init = function() {
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var enterpriseformEl = $('.enterprise-form', tplEl);

        var corpidEl = $('.j-corpid', enterpriseformEl);
        var secretEl = $('.j-secret', enterpriseformEl);
        /**
         * 绑定AJAX
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
                "submitSelector": $('.j-button-submit', enterpriseformEl)
            });
        };
        /**
         * 取消绑定AJAX
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
                    }
                }
            }, {
                "submitSelector": $('.j-button-unsubmit', enterpriseformEl)
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
            $('.j-button-submit', enterpriseformEl).addClass('hide');
            $('.j-button-unsubmit', enterpriseformEl).show();
        };
        /**
         * 取消绑定成功之后
         */
        var cancelEnterpriseMailSuccess = function() {
            emailtypeEl.prop("disabled", false);
            comnameEl.prop("disabled", false);
            appidEl.closest('dd').show();
            appkeyEl.closest('dd').show();
            $('.j-button-submit', enterpriseformEl).removeClass('hide');
            $('.j-button-unsubmit', enterpriseformEl).addClass('hide');
        };
        /**
         * 提交绑定按钮事件
         */
        enterpriseformEl.on('click', '.j-button-submit', function() {
            var oData = {
                "corpid": corpidEl.val(),
                "secret": secretEl.val()
            };
            if (corpidEl.val() == corpidEl.data('empty')) {
                showInputError(corpidEl);
                return false;
            }
            if (secretEl.val() == secretEl.data('empty')) {
                showInputError(secretEl);
                return false;
            }
            bindingEnterpriseMail(oData);
        });
        /**
         * 取消绑定按钮事件
         */
        enterpriseformEl.on('click', '.j-button-unsubmit', function() {
            util.confirm('确定要取消绑定企业号吗', '提示', function() {
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
            "url":"/Management/GetWQBindingInfo",
            "type":"post",
            "data":{
                appType:1
            },
            "success":function(responseData){
                var dataRoot=responseData.value;
                var corpId=dataRoot.corpId;
                var secret=dataRoot.secret;
                if(responseData.success){
                    //设置公司域名
                    if(corpId.length>0){
                        enterpriseformEl.find('.j-corpid').val(corpId).addClass('noboder');
                        enterpriseformEl.find('.j-secret').val(secret).addClass('noboder');
                        enterpriseformEl.find('.j-button-submit').hide();
                        enterpriseformEl.find('.j-button-unsubmit').show();
                        enterpriseformEl.show();
                    }else{
                        enterpriseformEl.find('.j-button-submit').show();
                        enterpriseformEl.find('.j-button-unsubmit').hide();
                        enterpriseformEl.show();
                    }
                }
            }
        });
    };
});