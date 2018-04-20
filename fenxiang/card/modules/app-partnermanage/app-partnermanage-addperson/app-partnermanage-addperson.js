/**********
 * 新增代理商彈窗
 **********/
define(function(require, exports, module) {
    var util=require("util");

    var Dialog = require("dialog");
    var addPartnerString = require("./app-partnermanage-add.html"),
        style=require("./app-partnermanage-add.css");
	
    var AddPartner=Dialog.extend({
        "attrs":{
			"content":addPartnerString,
			"width":455,
            "closeTpl":"X"
		},
        initialize:function(){
            var result=Dialog.superclass.initialize.apply(this,arguments);
            return result;
        },
		setup:function(){
            var result=Dialog.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result =Dialog.superclass.render.apply(this, arguments);
            return result;
        },
        //显示
        "show": function () {
            var result = Dialog.superclass.show.apply(this, arguments);
            return result;
        },
        //隐藏
        "hide": function () {
            var result =Dialog.superclass.hide.apply(this, arguments);
            return result;
        },
        "events":{
           'click .overlay-a':'overlay_a'
        },
        'overlay_a':function(){
            console.log('this is overlay-a');
        },
        "destroy":function(){
            var result=Dialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    
    module.exports=AddPartner;
});   









