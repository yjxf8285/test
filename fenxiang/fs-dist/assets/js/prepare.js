/**
 * 项目预处理，通过seajs preload
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root=window;
    var util=require('util'),
        Widget=require('widget');
        //Validator=require('validator');
    //Backbone config
    Backbone.ajax=util.api; //设置backbone的ajax为util.api

    /**
     * widget修复window.beforeload时卸载组件产生的错误
     * 产生错误的条件是对this.element==null调用undelegateEvents
     */
    (function(){

        var DELEGATE_EVENT_NS = ".delegate-events-";
        var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
        var EXPRESSION_FLAG = /{{([^}]+)}}/g;
        var INVALID_SELECTOR = "INVALID_SELECTOR";

        Widget.prototype.undelegateEvents=function(eventKey) {
            var args = {};
            // 卸载所有
            if (arguments.length === 0) {
                args.type = DELEGATE_EVENT_NS + this.cid;
            } else {
                args = parseEventKey(eventKey, this);
            }
            this.element&&this.element.off(args.type, args.selector);   //加入this.element非空判定
            return this;
        };

        function parseEventKey(eventKey, widget) {
            var match = eventKey.match(EVENT_KEY_SPLITTER);
            var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;
            // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
            var selector = match[2] || undefined;
            if (selector && selector.indexOf("{{") > -1) {
                selector = parseExpressionInEventKey(selector, widget);
            }
            return {
                type: eventType,
                selector: selector
            };
        }
        // 解析 eventKey 中的 {{xx}}, {{yy}}
        function parseExpressionInEventKey(selector, widget) {
            return selector.replace(EXPRESSION_FLAG, function(m, name) {
                var parts = name.split(".");
                var point = widget, part;
                while (part = parts.shift()) {
                    if (point === widget.attrs) {
                        point = widget.get(part);
                    } else {
                        point = point[part];
                    }
                }
                // 已经是 className，比如来自 dataset 的
                if (isString(point)) {
                    return point;
                }
                // 不能识别的，返回无效标识
                return INVALID_SELECTOR;
            });
        }
        var toString = Object.prototype.toString;
        function isString(val) {
            return toString.call(val) === "[object String]";
        }
    }());
});