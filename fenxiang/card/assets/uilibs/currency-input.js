/**
 * 钱输入框
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
 	var Widget = require("widget");

 	var CurrencyInput = Widget.extend({
 		/*
 		*金额输入框
 		*element必须属性
 		*/
 		"attrs": {
 			"element":null,
 			"name":"",
 			"id":"",
 			"required":false,
 			"value":0
 		},

 		"events":{
 			'mousedown .crm-currency-mask':'_readyToInput',
 			'keyup .crm-currency-input':'_onKeyUp',
            'keydown .crm-currency-input':'_onKeyDown',
 			'blur .crm-currency-input':'_onSubmit',
 			'focus .crm-currency-input':'_onFocus'
 		},
 		"setup":function(){
 			var result=CurrencyInput.superclass.setup.apply(this,arguments);
 			this._getHtml();
 			return result;
 		},

 		"render":function(){
 			var result=CurrencyInput.superclass.setup.apply(this,arguments);
 			
 			return result;
 		},

 		"destroy":function(){
            var result;
            result=CurrencyInput.superclass.destroy.apply(this,arguments);
            
            return result;
        },

        //准备输入事件
        "_readyToInput":function(){
        	var self = this;
        	$(".crm-currency-mask",this.element).hide();
        	$(".crm-currency-input",this.element).show();
        	var value = $(".crm-currency-input",this.element).val();
        	setTimeout(function(){
        		$(".crm-currency-input",this.element).focus();	
//        		self._onTyping();
        	},100);     	
        	//$(".crm-currency-input",this.element).focus();
        },

        //输入过程中事件
        "_onKeyUp":function(e){ 
        	var value = $(".crm-currency-input",this.element).val();
        	this.set("value",value);
        	if(!value){
        		$(".crm-currency-display").hide();
        		return;
        	}
            var strP=/^([0-9]\d{0,15})+\.{0,1}[0-9]{0,2}$/;
            if(!strP.test(value)){
                $(".crm-currency-input",this.element).val(value.substr(0,value.length-1));
                return false;
            }
        	var strVal = _.str.numberFormat(parseFloat(value),2);
        	$(".crm-currency-display").text(strVal);
        	this._showInfo();
        },

        "_onKeyDown":function(e){
            if(e){
                var keyCode = e.which;
                var permitCode = [110,96,97,98,99,100,101,102,103,104,105,48,49,50,51,52,53,54,55,56,57,190,8,37,39];
                if(!_.contains(permitCode,keyCode)){
                    e.preventDefault();
                    return;
                }
                var value = $(".crm-currency-input",this.element).val();
                var num = value.split(".")[0];
                if(num.length>=15 && keyCode != 8 && keyCode != 39 && keyCode != 37){
                    e.preventDefault();
                    return;   
                }
//                console.log(keyCode);
            }
        },

        "_onFocus": function(){
            var v = $(".crm-currency-input",this.element).val();
            if(v == 0){
                $(".crm-currency-input",this.element).val('');
            }
        },
        //显示信息
        "_showInfo":function(){
        	var offset = $(".crm-currency-input",this.element).offset();
        	var height = $(".crm-currency-input",this.element).height();
        	$(".crm-currency-display").css({"left":offset.left-11,"top":offset.top+height+11});
        	$(".crm-currency-display").show();
        },

        //提交事件
        "_onSubmit":function(){
        	var value = $(".crm-currency-input",this.element).val()||0;
    		if(!this.isValid()){
    			return;
    		}
//    		if(!value){
//    			$(".crm-currency-mask",this.element).text("请填写金额");
//    			if($(".crm-currency-mask",this.element).hasClass("crm-currency-done")){
//        			$(".crm-currency-mask",this.element).removeClass("crm-currency-done");
//        		}
//    		}else{
    			var strVal = _.str.numberFormat(parseFloat(value),2);
	    		$(".crm-currency-mask",this.element).text(strVal);
	        	if(!$(".crm-currency-mask",this.element).hasClass("crm-currency-done")){
	        		$(".crm-currency-mask",this.element).addClass("crm-currency-done");
	        	}
//    		}
        	$(".crm-currency-mask",this.element).show();
        	$(".crm-currency-input",this.element).hide();
        	$(".crm-currency-display").hide();
        },

        //获取html
        "_getHtml":function(){
        	var html = "",
        	name = this.get("name"),
        	id = this.get("id");
        	if(id){
        		html += "<div class = 'crm-currency-input-container'><input value='0' placeholder = '请填写金额' name = '"+ name+"' id = '"+ id +"' class = 'crm-currency-input fn-hide' />";
        	}else{
        		html += "<div class = 'crm-currency-input-container'><input value='0' placeholder = '请填写金额' name = '"+ name+"' class = 'crm-currency-input fn-hide' />";
        	}
        	html += "<div class = 'crm-currency-mask'>0.00</div></div>";
        	this.element.html(html);
        	if ( $(".crm-currency-display").length < 1 ){
        		$("body").append("<div class = 'crm-currency-display fn-hide'></div>");
        	}
        	return html;
        },

        //获取数值接口
        "val":function(){
            if(this.isValid()){
                return parseFloat($(".crm-currency-input",this.element).val()||0);
            }
        	return -1;
        },
        //设置数值接口
        "setValue":function(val){
        	$(".crm-currency-input",this.element).val(val);
        	this.set("value",val);
        	var strVal = _.str.numberFormat(parseFloat(val),2);
        	$(".crm-currency-display").text(strVal);
        	$(".crm-currency-mask",this.element).text(strVal);
        	if(!$(".crm-currency-mask",this.element).hasClass("crm-currency-done")){
        		$(".crm-currency-mask",this.element).addClass("crm-currency-done");
        	}
        	$(".crm-currency-mask",this.element).show();
        	$(".crm-currency-input",this.element).hide();
        	$(".crm-currency-display").hide();
        },
        //重置接口
        "reset":function(){
        	$(".crm-currency-input",this.element).val("0");
        	this.set("value",0);
        	$(".crm-currency-display").text("0.00");
        	$(".crm-currency-mask",this.element).text("0.00");
        	if($(".crm-currency-mask",this.element).hasClass("crm-currency-done")){
        		$(".crm-currency-mask",this.element).removeClass("crm-currency-done");
        	}
        	$(".crm-currency-mask",this.element).show();
        	$(".crm-currency-input",this.element).hide();
        	$(".crm-currency-display").hide();
        },
        //验证接口
        "isValid":function(){

        	var val = $(".crm-currency-input",this.element).val();

        	if(val==''){
        		return true;
        	}
        	if(!val && this.get("required")){
        		$(".crm-currency-display").text("请填写金额");
        		return false;
        	}
        	var strP=/^(([1-9]\d{0,15})|0)(\.\d{1,2})?$/;
        	if(!strP.test(val)){
    			$(".crm-currency-display").text("请正确填写金额");
    			return false;
    		}
    		return true;
        }

 	});
 	module.exports = CurrencyInput;
 });