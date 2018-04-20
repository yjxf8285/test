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
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
			
		//settings input click
		var settingsInput=$('.settings-input',tplEl);

		var formEl=$('.resetpassword-form',tplEl),
			inputEl=$('.settings-input',formEl);
		formEl.on('click','.settings-input',function(evt){
			var meEl=$(this);
			inputEl.each(function(){
				var inputEl=$(this);
				inputEl.removeClass('settings-input-on');
				inputEl.next().hide();		
			});
			meEl.removeClass('settings-input-onerror');
			meEl.nextAll('.settings-input-error').hide();
			meEl.addClass('settings-input-on');
			meEl.next().show();
			meEl.next('.settings-input-prompt').show();
			evt.stopPropagation();		
		});

		util.regGlobalClick(inputEl,function(){
			inputEl.each(function(){
				var inputEl=$(this);
				inputEl.removeClass('settings-input-on');
				inputEl.next().hide();		
			});		
		});
		
		//验证密码
		var oldPwd=$('#old-pwd',tplEl),
			newPwd=$('#new-pwd',tplEl),
			confirmNewPwd=$('#confirm-new-pwd',tplEl);
		oldPwd.blur(function(){
			var meEl=$(this);
			if(meEl.val() == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
			}else{
			    meEl.removeClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').hide();	
			}
		});	
		newPwd.blur(function(){
			var meEl=$(this);
			var errorHtml=meEl.nextAll('.settings-input-error').html();
			errorHtml="";
			if(meEl.val() == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="请输入新密码";
			}else if(meEl.val().length < 6 || meEl.val().length > 20){
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="此项应为6-20半角字符（字母、数字、符号）组成";
			}else{
			    meEl.removeClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').hide();	
			}
			meEl.nextAll('.settings-input-error').html(errorHtml);
		});
		confirmNewPwd.blur(function(){
			var meEl=$(this);
			var errorHtml=meEl.nextAll('.settings-input-error').html();
			errorHtml="";
			if(meEl.val() == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="请输入确认密码";
			}else if(meEl.val() !== newPwd.val()){
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="两次输入的密码不一致，请重新输入";
			}else{
			    meEl.removeClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').hide();	
			}
			meEl.nextAll('.settings-input-error').html(errorHtml);
		});
		
		var pwdSaveBtnEl=$('.pwd-save-btn',tplEl);
		pwdSaveBtnEl.click(function(evt){
			var passed=true;
			$('.settings-input',tplEl).blur();
			
			$('.settings-input',tplEl).each(function(){
				if($(this).hasClass('settings-input-onerror')){
					passed=false;
					return false;	
				}	
			});	
			if(passed){
				
				util.api({
					"type":"post",
					"data":{"oldPwd":oldPwd.val(),"newPwd":newPwd.val()},
					"url":"/Account/ChangeEmployeePasswordAndTicket/",
					"success":function(responseData){
						if(responseData.success){
							tplCommon.saveSuccessAnimated(tplEl,tplName);
						}
					}
				});
					
			}else{
				//alert('failed');	
			}
			evt.preventDefault();	
		});
		
		//tab部分
		tplCommon.init(tplEl,tplName);
		
    };
});