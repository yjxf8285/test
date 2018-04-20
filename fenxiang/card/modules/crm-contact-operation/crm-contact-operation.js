/**
 * 联合跟进人
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
    var root = window,
         FS = root.FS;
    var Widget=require('widget');
    var tpl = require('modules/crm-contact-operation/crm-contact-operation.html');
////    var tplStyle = require('modules/crm-contact-operation/crm-contact-operation.css');
    var util = require('util');
    
 	var Operation = Widget.extend({
 		"attrs":{
 			"element":null,
 			"isFollow":null
 		},

 		"events":{
 			"click .crm-contact-operation-select-li":"_select",
            "click .crm-contact-operation-new-li":"_new",
            "click .crm-contact-operation":"_showOperation"
 		},

 		"setup":function(){
 			var result = Operation.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},


        "_select":function(){
            $(".crm-contact-operation-container",this.element).hide();
            this.trigger("select");
        },

        "_new":function(){
            $(".crm-contact-operation-container",this.element).hide();
            this.trigger("new");
        },
        
 		//初始化
 		"_init":function(){
            this.element.html(tpl);
            if(this.get('isFollow')) {
            	$('.crm-contact-operation-select-li', this.element).hide();
            } else {
            	$('.crm-contact-operation-select-li', this.element).show();
            }
            this._initEvent();
 		},


        "_initEvent":function(e){
            $(document).on("click",function(e){

                if ($(e.target).is('.crm-contact-operation-container') || $(e.target).is('.crm-contact-operation-ul') || 
                    $(e.target).is('.crm-contact-operation-new-li')|| $(e.target).is('.crm-contact-operation-select-li')
                    || $(e.target).is('.crm-contact-operation')){
                    return;
                }
                $(".crm-contact-operation-container",this.element).hide();
            })
        },

        "_showOperation":function(e){
            var current = $(e.currentTarget);
            $(".crm-contact-operation-container",this.element).css({"left":current.position().left-170,"top":current.position().top+35});
            $(".crm-contact-operation-container",this.element).show();
        },

 		"destroy":function(){
 			var result = Operation.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Operation;
 });