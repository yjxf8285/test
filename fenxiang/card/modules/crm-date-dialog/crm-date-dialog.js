/*
 * 机会合同下的自定义时间
 */
 
define(function(require, exports, module) {
    
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        util = require('util'),
        Dialog = require("dialog"),
        publishHelper = require('modules/publish/publish-helper'),
        DateSelect = publishHelper.DateSelect, //选择日期组件
        htmlTpl = require('./crm-date-dialog.html');
    
    require('./crm-date-dialog.css');
    
    
    Dialog = Dialog.extend({
    
        attrs: {
            className: 'crm-date-dialog',
            content: $(htmlTpl).filter('.m-crm-date-tpl').html(),
            closeTpl: '',
            width: 450
        },
        
        events: {
            'click .m-crm-date .btn-enter': '_enter',
            'click .m-crm-date .btn-cancel, .m-crm-date .btn-close': '_cancel'
        },
        
        _cancel: function() {
            var that = this;
            that.trigger('cancel', {});
            that.hide();
        },
        
        _enter: function() {
            var that = this;
            var startTime = that.starttimeDs.getValue(true);
            var endTime = that.endtimeDs.getValue(true);
            if (that.isValid()) {            
                that.trigger('enter', {
                    timeText: startTime._i + '-' + endTime._i,
                    startTime: startTime.unix(),
                    endTime: endTime.unix()
                });
            }
        },
        
        /**
         * 验证是否输入了日期
         */
        isValid: function() {
            var starttimeDs = this.starttimeDs,
                endtimeDs = this.endtimeDs;
                
            var startTime = starttimeDs.getValue(true),
                endTime = endtimeDs.getValue(true);

            if (!startTime) {
                util.showInputError($('input', starttimeDs.element));
                return false;
            }
            if (!endTime) {
                util.showInputError($('input', endtimeDs.element));
                return false;
            }
            if (startTime.unix() > endTime.unix()) {
                util.alert('结束时间必须大于开始时间！');
                return false;
            }
            return true;
        },        
        
        hide: function() {
            return Dialog.superclass.hide.apply(this, arguments);
        },
        
        show: function () {
            var result = Dialog.superclass.show.apply(this, arguments);
            this.setDate();
            return result;
        },
        
        setDate: function() {
            var that = this;
            var $el = $(that.element);
            this.starttimeDs = new DateSelect({
                "element": $('.j-starttime', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY.MM.DD"
            });
            this.endtimeDs = new DateSelect({
                "element": $('.j-endtime', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY.MM.DD"
            });
        }       
    });
        
    module.exports = Dialog;
});