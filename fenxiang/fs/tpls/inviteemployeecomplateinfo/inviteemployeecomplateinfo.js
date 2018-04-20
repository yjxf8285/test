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
	    util=require('util');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
		var originContactData=FS.getAppStore('contactData');
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
		var userAccount=$('#user-account',tplEl),
			newPwd=$('#new-pwd',tplEl),
			confirmNewPwd=$('#confirm-new-pwd',tplEl),
			userFullname=$('#user-fullname',tplEl);
        //设置默认账号
        userAccount.val(originContactData.account);

		userAccount.blur(function(){
			var meEl=$(this);
			var errorHtml=meEl.nextAll('.settings-input-error').html();
			if(_.str.trim(meEl.val()) == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="请输入帐号";
			}else if(_.str.trim(meEl.val()).length < 2 || _.str.trim(meEl.val()).length > 50){
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="2-50个字符，英文或数字开头的英文、数字和下划线组合";
			}else{
			    meEl.removeClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').hide();	
			}
			meEl.nextAll('.settings-input-error').html(errorHtml);
		});	
		newPwd.blur(function(){
			var meEl=$(this);
			var errorHtml=meEl.nextAll('.settings-input-error').html();
			errorHtml="";
			if(_.str.trim(meEl.val()) == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="请输入新密码";
			}else if(_.str.trim(meEl.val()).length < 6 || _.str.trim(meEl.val()).length > 20){
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
			if(_.str.trim(meEl.val()) == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
				errorHtml="请输入确认密码";
			}else if(_.str.trim(meEl.val()) !== _.str.trim(newPwd.val())){
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
		userFullname.blur(function(){
			var meEl=$(this);
			if(_.str.trim(meEl.val()) == '')
			{
				settingsInput.next('.settings-input-prompt').hide();
				meEl.addClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').show();
			}else{
			    meEl.removeClass('settings-input-onerror');
				meEl.nextAll('.settings-input-error').hide();	
			}
		});
        /**
         * 获取提交参数
         */
		var getRequestData=function(){
            var requestData={};
            requestData["password"]= _.str.trim(newPwd.val());
            requestData["account"]= _.str.trim(userAccount.val());
            requestData["fullName"]= _.str.trim(userFullname.val());
            requestData["name"]= requestData["fullName"];
            requestData["department"]= _.str.trim($('#user-department').val());
            requestData["post"]= _.str.trim($('#user-post').val());
            requestData["gender"]= $('[name="s-sex"]',formEl).filter(':checked').val();
            return requestData;
        };
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
					"data":getRequestData(),
					"url":"/account/UpdateInviteCurrentUser",
					"success":function(responseData){
						if(responseData.success){
							//保存
							var saveSuccessEl=$('.save-success-apv',tplEl);
							saveSuccessEl.animate({top:'0px'},300,function(){
								setTimeout(function(){
									saveSuccessEl.animate({top:'54px'},300);
                                    location.reload();  //页面刷新
								},2000);		
							});	
						}
					}
				});
					
			}else{
				//alert('failed');	
			}
			evt.preventDefault();	
		});
		
		
		
    };
});