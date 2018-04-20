/**
 * 扩展Events
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var EventsCore=require('events_core');
    EventsCore.prototype.one=function(events, callback, context){
        var that=this;
        var handler=function(){
            that.off(events, handler, context);
            return callback.apply(this,arguments);
        };
        this.on(events,handler,context);
    };
    module.exports=EventsCore;
});