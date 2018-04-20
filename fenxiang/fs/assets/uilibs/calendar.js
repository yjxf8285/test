/**
 * 本地化calendar
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var CalendarCore=require('calendar_core'),
        moment=require('moment'),
        $=require('$');
    var lang={
        Su: "日",
        Mo: "一",
        Tu: "二",
        We: "三",
        Th: "四",
        Fr: "五",
        Sa: "六",
        Jan: "一月",
        Feb: "二月",
        Mar: "三月",
        Apr: "四月",
        May: "五月",
        Jun: "六月",
        Jul: "七月",
        Aug: "八月",
        Sep: "九月",
        Oct: "十月",
        Nov: "十一月",
        Dec: "十二月",
        Today: "今天"
    };
    var Calendar=CalendarCore.extend({
        attrs:{
            "showTodayBtn":true
        },
        templateHelpers: {
            _: function(key) {
                return lang[key] || key;
            }
        },
        setup:function(){
            var self = this,
                elEl=this.element;
            var result=Calendar.superclass.setup.call(this);
            var hideTodayBtn=function(){
                if(!self.get('showTodayBtn')){  //隐藏"今天"按钮
                    $('.ui-calendar-today',elEl).hide();
                }
            };
            hideTodayBtn();
            this.model.on("changeMonth changeYear changeStartday changeMode",function(){
                //TODO:多嵌套了一层ui-calendar,期待calendar更新
                //临时方案
                var innerEl=$('.ui-calendar',elEl);
                if(innerEl.length>0){ 
                    innerEl.find('.ui-calendar-navigation,.ui-calendar-control,.ui-calendar-data-container,.ui-calendar-footer').appendTo(self.element);
                    innerEl.remove();
                }
                //设置自定义独特的class
                self._setCustomDateClsHelper();
                hideTodayBtn();
            });
            //设置_focusDate属性
            this._focusDate=moment();   //默认设置为当天
            return result;
        },
        /**
         * setFocus另一版本，不追踪日期改变
         * @private
         */
        setFocus_:function(dateArg){
            this._focusDate=moment(dateArg);
            this._setCustomDateClsHelper();
        },
        /**
         * 自定义日期class标识设置
         * @private
         */
        _setCustomDateClsHelper:function(){
            var self = this,
                elEl=this.element;
            $('.ui-calendar-data-container .ui-calendar-date-column li',elEl).removeClass('current-date focused-date-alias').each(function(){
                var itemEl=$(this);
                var dateText=itemEl.data('value');
                //设置今天class标识
                if(dateText==moment().format('YYYY-MM-DD')){
                    itemEl.addClass('current-date');
                }
                //设置focus date alias标识
                if(dateText==self._focusDate.format('YYYY-MM-DD')){
                    itemEl.addClass('focused-date-alias');
                }
            });
        },
        destroy:function(){
            var result;
            this.element.remove();
            result=Calendar.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports=Calendar;
});