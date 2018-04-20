/**
 * 定义信息列表Model
 * 
 * 遵循seajs module规范
 * @author liuxf
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        store=tpl.store,
        tplEvent=tpl.event;
    var util=require('util');
    var ItemM = Backbone.Model.extend({
        defaults : {  
            imgUrl : '',  
            desc : ''
        }  
    });
    exports.itemM=ItemM;
});
