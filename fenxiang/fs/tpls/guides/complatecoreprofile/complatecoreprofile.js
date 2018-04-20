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
        tplCommon = require('../guides-common');
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
		
		//验证
		var userFullname=$('#user-fullname',tplEl);
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
		
		var pwdSaveBtnEl=$('.pwd-save-btn',tplEl);
		
		pwdSaveBtnEl.click(function(evt){
			var fullNameVal=_.str.trim($('#user-fullname',tplEl).val()),
				departmentVal=_.str.trim($('#user-department',tplEl).val()),
				postVal=_.str.trim($('#user-post',tplEl).val()),
				userGenderM=$('#s-sex-male'),
				userGenderF=$('#s-sex-female');
			var genderVal='';	
				if(userGenderM.is(':checked'))
				{
					genderVal="M";
				}else if(userGenderF.is(':checked')){
					genderVal="F";
				}
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
					"data":{
						"fullName":fullNameVal,
						"name":fullNameVal,
						"department":departmentVal,
						"post":postVal,
						"gender":genderVal
						},
					"url":"/account/UpdateCurrentUser",
					"success":function(responseData){
						if(responseData.success){
							tplCommon.saveSuccessAnimated(tplEl,tplName);
                            location.reload();
						}
					}
				});
					
			}else{
				//alert('failed');	
			}
			evt.preventDefault();	
		});
		tplCommon.init(tplEl,tplName);
    };
});