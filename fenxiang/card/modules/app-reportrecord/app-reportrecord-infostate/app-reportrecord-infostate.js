/**
 * 报表记录-列表
 */
define(function (require, exports, module) {
    
    var util=require('util'),
        templateStr=require('./app-reportrecord-infostate.html'),
        style=require('./app-reportrecord-infostate.css');

    var RecordInfo = Backbone.View.extend({
        template:_.template(templateStr),
        //初始化
        initialize:function(options){
            var self=this;

            self.options=options;
            self.$el.html(self.template({}));
        },
        //渲染
        render:function(){
            var self=this;

            self.options.wrapperEl.empty().append(self.$el);
        },
        events:{
           
        }
    });

    module.exports = RecordInfo;
});