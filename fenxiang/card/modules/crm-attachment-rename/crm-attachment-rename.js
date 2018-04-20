
 /**
 * 使用方法
 *
 * 1.请确保只new一次，不要出现重复初始化
 * 2.无须传参数
    
3.使用的时候调用show（attachId,oldName）

 */
define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util');
    var tpl = require('modules/crm-attachment-rename/crm-attachment-rename.html');
////    var tplStyle = require('modules/crm-attachment-rename/crm-attachment-rename.css');
	var Rename = Dialog.extend({
		"attrs":{
			"content": tpl,
			"width":455,
            "attachId":0,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            "attachName":""
		},

		setup:function(){
            var result=Rename.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result = Rename.superclass.render.apply(this, arguments);
            return result;
        },
        //隐藏
        "hide": function () {
            var result = Rename.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (attachId,oldName) {
            var result = Rename.superclass.show.apply(this, arguments);
            $(".crm-attachment-rename-old-name",this.element).text(util.getFileNamePath(oldName));
            this.set("attachId",attachId);
            this.set("attachName",oldName);
            return result;
        },

        "events":{
        	'click .crm-attachment-rename-button-ok': '_submit',
        	'click .crm-attachment-rename-button-cancel': '_cancel',
            'keyup .crm-attachment-rename-input': '_keyup'
        },

        "_keyup":function(evt){
            if (evt.keyCode == 13){
                this._submit();
                return;
            }
        },


        "reset":function(){
            $(".crm-attachment-rename-input",this.element).val("");
        },

        "_cancel":function(){
            this.hide();
        },

        "_submit":function(){
            var newName = $(".crm-attachment-rename-input",this.element).val();
            var oldName = this.get("attachName");
            var attachId = this.get("attachId");
            if(!newName){
                util.showInputError($(".crm-attachment-rename-input",this.element));
                return;
            }
            this.trigger("submit",attachId,oldName,newName);
            this.hide();
        },

        "destroy":function(){
            var result=Rename.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Rename;
});