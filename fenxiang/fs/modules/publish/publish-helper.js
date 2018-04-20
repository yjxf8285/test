/**
 * 定义发布@、上传、录音、选人、选取可视范围、发布框自适应大小
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        Events = require('events'),
        placeholder = require('placeholder'),
        Calendar=require('calendar'),
        Select = require('select'),
        moment = require('moment'),
        publishStyle = require('modules/publish/publish.css');

    var InnerCalendar = Calendar.extend({
        "attrs": {
            showTodayBtn: false,
            align: {
                getter: function () {
                    var trigger = this.get("trigger");
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 13, 13 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        }
    });
    var DateSelect = function (opts) {
        opts = _.extend({
            "element": null,
            "placeholder": "请选择日期",
            "formatStr":"YYYY-MM-DD"    //时间格式化字符串
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    DateSelect.prototype.init = function () {
        var that = this;
        var elEl = this.element,
            opts = this.opts,
            inputEl;
        var dateModel = [],
            tempDate,
            tempDateText;
        var formatStr=opts.formatStr;
        elEl.html('<input type="text" class="fs-publish-dateselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $('.fs-publish-dateselect-input', elEl);
        placeholder(inputEl);
        //设置date model
        tempDate = moment();  //今天
        tempDateText = tempDate.format(formatStr);
        dateModel[0] = {
            "value": tempDateText,
            "text": '今天'
        };

        tempDate = moment().add('days', 1);    //明天
        tempDateText = tempDate.format(formatStr);
        dateModel[1] = {
            "value": tempDateText,
            "text": '明天'
        };

        tempDate = moment().startOf('week').add('days', 5);    //本周五
        tempDateText = tempDate.format(formatStr);
        dateModel[2] = {
            "value": tempDateText,
            "text": '本周五'
        };

        tempDate = moment().startOf('week').add('days', 8);    //下周一
        tempDateText = tempDate.format(formatStr);
        dateModel[3] = {
            "value": tempDateText,
            "text": '下周一'
        };

        tempDate = moment().startOf('month').add('months', 1).subtract('days',1);    //本月底
        tempDateText = tempDate.format(formatStr);
        dateModel[4] = {
            "value": tempDateText,
            "text": '本月底'
        };
        var selector = new Select({
            trigger: inputEl,
            className: 'fs-publish-dateselect',
            template: '<div class="{{classPrefix}}">' +
                '<div class="fs-publish-dateselect-title">请选择日期<a class="reset-l" href="javascript:;">清空</a></div>' +
                '<div class="fs-publish-dateselect-calendar"></div>' +
                '<ul class="{{classPrefix}}-content" data-role="content">' +
                '{{#each select}}' +
                '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}" class="fs-prevent-default">{{{text}}}</a></li>' +
                '{{/each}}' +
                '</ul>' +
                '</div>',
            model: dateModel,
            zIndex: 2000,
            autoWidth: false
        }).render();
        var selectorEl = selector.element,
            calendarPlaceEl = $('.fs-publish-dateselect-calendar', selectorEl);
        var calendar = new InnerCalendar({
            trigger: calendarPlaceEl,
            zIndex: 2000
        });
        calendar.on('selectDate', function (date) {
            var val = date.format(formatStr);
            inputEl.val(val);
            selector.hide();
            that.trigger('change', val);
        });
        selector.on('change', function (targetEl) {
            var val = targetEl.data('value');
            inputEl.val(val);
            that.trigger('change', val);
        });
        selector.after("show", function () {
            calendar.show();
            calendar.setFocus_(that.getValue(true)||new Date());
            //calendar.setFocus(calendar.get('focus'));
        });
        selector.after('hide', function () {
            calendar.hide();
        });
        selectorEl.on('click','.reset-l' ,function (evt) {
            inputEl.val("");
            inputEl[0].focus();
            inputEl[0].blur();
            selector.set("selectedIndex", -1);
            selector.hide();
            that.trigger('change', "");
            evt.preventDefault();
        });
        //阻止calendar click冒泡到document上关闭select
        calendar.element.on('click',function(evt){
            evt.stopPropagation();
        });
        this.calendar=calendar;
        this.selector = selector;
    };
    DateSelect.prototype.getValue = function (isDate) {
        var opts=this.opts,
            formatStr=opts.formatStr;
        var elEl = this.element,
            inputEl = $('.fs-publish-dateselect-input', elEl),
            dateText=_.str.trim(inputEl.val()),
            dateValue=moment(dateText, formatStr);
        if(isDate){
            return dateValue;
        }else{
            return _.str.trim(dateValue?dateValue.format('YYYY-MM-DD'):"");  //默认输出YYYY-MM-DD格式的字符串
        }

    };
    DateSelect.prototype.setValue = function (momentParam) {
        var momentDate=moment(momentParam);
        var calendar=this.calendar;
        //设置calendar日期
        calendar.setFocus(momentDate);
        calendar.trigger('selectDate',momentDate);

    };
    DateSelect.prototype.clear = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-dateselect-input', elEl);
        this.selector.select(-1);   //select清空
        inputEl.val('');
        return;
    };
    DateSelect.prototype.destroy = function () {
        this.calendar&&this.calendar.destroy();
        this.selector&&this.selector.destroy();
    };
    Events.mixTo(DateSelect);

    var TimeSelect = function (opts) {
        opts = _.extend({
            "element": null,
            "placeholder": "请选择时间"
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    TimeSelect.prototype.init = function () {
        var that = this;
        var elEl = this.element,
            opts = this.opts,
            inputEl;
        var timeModel = [],
            i = 0,
            beginTime = moment("20130423080000", "YYYYMMDDhhmmss"),   //2013-04-23 08:00:00
            tempTime = beginTime;
        elEl.html('<input type="text" class="fs-publish-timeselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $('.fs-publish-timeselect-input', elEl);
        placeholder(inputEl);
        //设置time model
        for (i = 0; i < 48; i++) {
            timeModel.push({
                value: tempTime.format("HH:mm"),
                text: tempTime.format("HH:mm")
            });
            tempTime = beginTime.add('minutes', 30);
        }
        this.selector = new Select({
            trigger: inputEl,
            model: timeModel,
            zIndex: 2000,
            autoWidth: false,
            className: 'fs-publish-timeselect',
            template: '<div class="{{classPrefix}}">' +
                '<div class="fs-publish-timeselect-title">请选择时间<a class="reset-l" href="javascript:;">清空</a></div>' +
                '<ul class="{{classPrefix}}-content" data-role="content">' +
                '{{#each select}}' +
                '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a class="fs-prevent-default" href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>' +
                '{{/each}}' +
                '</ul>' +
                '</div>'
        }).render().on('change', function (targetEl) {
                var val = targetEl.data('value');
                inputEl.val(val);
                that.trigger('change', val);
            });
        this.selector.element.on('click','.reset-l' ,function (evt) {
            inputEl.val("");
            inputEl[0].focus();
            inputEl[0].blur();
            that.selector.hide();
            that.selector.set("selectedIndex", -1);
            that.trigger('change', "");
            evt.preventDefault();
        });
    };
    TimeSelect.prototype.getValue = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-timeselect-input', elEl);
        return _.str.trim(inputEl.val());
    };
    TimeSelect.prototype.setValue = function (mix) {
        var selector=this.selector;
        selector.select(mix);
    };
    TimeSelect.prototype.clear = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-timeselect-input', elEl);
        this.selector.select(-1);   //select清空
        return inputEl.val('');
    };
    TimeSelect.prototype.destroy = function () {
        this.selector&&this.selector.destroy();
    };
    Events.mixTo(TimeSelect);

    _.extend(exports,{
        "DateSelect":DateSelect,
        "TimeSelect":TimeSelect
    });
});