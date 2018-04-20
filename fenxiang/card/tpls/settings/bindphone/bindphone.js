/**
 * 我的归档
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var Tabs=require('tabs'),
	    util=require('util'),
        tplCommon = require('../settings-common');
    var contactData=util.getContactData(),
        loginUserData=contactData["u"];
    exports.init=function(){

        var tplEl = exports.tplEl,
            tplName=exports.tplName;
		var phoneBtn=$('.bpmb-btn',tplEl),
		    phoneInput=$('.bpmn-input',tplEl),
			bindphoneSuccessTpl=$('.bindphone-success',tplEl),
			bindphoneMainTpl=$('.bindphone-main',tplEl),
			phoneWrapper=$('.phone-wrapper',tplEl);
        if(loginUserData.isPhoneBound){     //已绑定手机
            phoneWrapper.html(loginUserData.mobile.slice(0,3)+'****'+loginUserData.mobile.slice(-4));

//            phoneWrapper.html((phone&&phone.slice(0,3))||loginUserData.mobile.slice(0,3)+'****'+(phone&&phone.slice(-4))||loginUserData.mobile.slice(-4));
            bindphoneSuccessTpl.show();
            bindphoneMainTpl.hide();
        }else{
            bindphoneSuccessTpl.hide();
            bindphoneMainTpl.show();
        }
		phoneBtn.click(function(){
			// var phoneNum=/^(13[0-9]|15[0-9]|18[0-9])|14[7]\d{8}|17[07]\d{8}$/;
			if(phoneInput.val() == '' || !util.isMobilePhoneNum(phoneInput.val())){
				util.showInputError(phoneInput);
			}else{
				util.api({
					"type":"post",
					"data":{"mobile":phoneInput.val()},
					"url":"/Account/MobileBinding/",
					"success":function(responseData){
						if(responseData.success){
							var originValue=phoneInput.val(),
							    phoneHtml=originValue.slice(0,3)+'****'+originValue.slice(-4);
							phoneWrapper.html(phoneHtml);
							bindphoneSuccessTpl.show();
							bindphoneMainTpl.hide();
                            //更新本地数据
                            loginUserData.isPhoneBound=true;
                            loginUserData.mobile=phoneInput.val();
						}
					}
				});
				
			}
		});
		var editNumberEl=$('#edit-number',tplEl),
			cannelBindEl=$('#cannel-bind',tplEl);
		//取消绑定	
		cannelBindEl.click(function(evt){
			util.api({
					"type":"post",
					"data":{},
					"url":"/Account/CancelMobileBinding/",
					"success":function(responseData){
						if(responseData.success){
							
							bindphoneSuccessTpl.hide();
							bindphoneMainTpl.show();
							phoneInput.val("");
                            //更新本地数据
                            loginUserData.isPhoneBound=false;
						}	
					}
			});
			evt.preventDefault();
		});
		//更改号码
		editNumberEl.click(function(){			
			bindphoneSuccessTpl.hide();
			bindphoneMainTpl.show();
			phoneInput.val("");
			//phoneInput.attr("placeholder","手机号应为11位数字组成");
		});
		
		//tab部分
		tplCommon.init(tplEl,tplName);
		
    };
});