/**
 * 扩展Confirmbox
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var ConfirmboxCore=require('confirmbox_core');
    var Confirmbox=ConfirmboxCore.extend({
        events: {
            "click [data-role=confirm] a": function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.trigger("confirm",evt);
            },
            "click [data-role=cancel] a": function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.trigger("cancel",evt); //触发cancel事件，通过onCancel回调配置处理
                this.hide();
            },
            "click [data-role=close]": function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.trigger("cancel",evt); //触发cancel事件，通过onCancel回调配置处理
                this.hide();
            }
        }
    });
    Confirmbox.alert = function(message, callback, options) {
        var defaults = {
            message: message,
            title: "",
            cancelTpl: "",
            closeTpl: "",
            onConfirm: function(evt) {
                callback && callback(evt);
                this.hide();
            },
            onCancel: function(evt) {
                callback && callback(evt);
            }
        };
        new Confirmbox($.extend(null, defaults, options)).show().after("hide", function() {
            this.destroy();
        });
    };
    Confirmbox.confirm = function(message, title, callback, options) {
        options= _.extend({
            "autoHide":true //点击确定按钮自动隐藏自身
        },options||{});
        var defaults = {
            message: message,
            title: title,
            closeTpl: "",
            onConfirm: function(evt) {
                callback && callback.call(this,evt);
                if(options.autoHide){
                    this.hide();
                }
            }
        };
        new Confirmbox($.extend(null, defaults, options)).show().on('cancel', function(){
        	options.onCancel && options.onCancel();
        }).after("hide", function() {
            this.destroy();
        });
    };
    module.exports=Confirmbox;
});