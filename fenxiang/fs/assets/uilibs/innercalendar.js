/**
 * 内嵌calendar
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var Calendar=require('calendar');
    var InnerCalendar=Calendar.extend({
        "attrs":{
            align: {
                getter: function() {
                    var trigger = this.get("trigger");
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 0,0 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            },
            zIndex:10
        },
        setup:function(){
            var self = this,
                elEl=this.element;
            var result=InnerCalendar.superclass.setup.call(this);
            this.model.on("changeMonth changeYear changeStartday changeMode",function(){
                self._adjustHeight();
            });
            return result;
        },
        show: function() {
            var result=InnerCalendar.superclass.show.apply(this,arguments);
            //内嵌式calendar需要在show时设置focus
            this.setFocus(this.get('focus'));
            return result;
        },
        "_adjustHeight":function(){
            $(this.get("trigger")).height(this.element.outerHeight(true));
        },
        "render":function(){
            var result=InnerCalendar.superclass.render.call(this);
            this._adjustHeight();
            return result;
        }
    });
    module.exports=InnerCalendar;
});