/**
 * 邮箱设置
 *
 * 遵循seajs module规范
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
			
		var bemnInputEl=$('.bemn-input',tplEl),
			bembCodeBtnEl=$('.bemb-code-btn',tplEl),
			bemnCodeInputEl=$('.bemn-code-input',tplEl),
			bembBtnEl=$('.bemb-btn',tplEl);
		var bemain=$('.bemain',tplEl),
			emailBc=$('#email-bc',tplEl),
			emailSvlaue=$('.email-wrapper',tplEl);
		var exmailAfter="@"+loginUserData.exmailDomain;
        //设置域名后缀
        $('.exmail-domain',tplEl).text(loginUserData.exmailDomain);
		//获取验证码提交
		bembCodeBtnEl.click(function(){
			if(bemnInputEl.val() == '')
			{
				util.showInputError(bemnInputEl);
			}else{
				var codeBtnHtml="<time id='bebtn-time'>60</time>秒后可重新发送";
				util.api({
					"type":"post",
					"data":{"exmail":bemnInputEl.val()+exmailAfter},
					"url":"/Account/GetBindingEmployeeExmailCode/",
					"success":function(responseData){
						if(responseData.success){
							bembCodeBtnEl.attr("disabled","disabled");
							bembCodeBtnEl.addClass('bebtn-disabled');
							bembCodeBtnEl.html(codeBtnHtml);
							bembCodeBtnEl.next('a').show();
							var bebtnTime=$('#bebtn-time');
							
							var i=60;
							var tid=setInterval(function(){
								if(i<1){
									clearInterval(tid);	
									bembCodeBtnEl.removeAttr("disabled");
									bembCodeBtnEl.removeClass('bebtn-disabled');
									bembCodeBtnEl.html('获取验证码');
								}else{
									bebtnTime.text(i);
									i--;		
								}		
							},1000);		
												
							emailSvlaue.html(bemnInputEl.val()+exmailAfter);
						}						
					}
				});
			}
			
		});
		//绑定邮箱提交
		bembBtnEl.click(function(){
			if(bemnCodeInputEl.val() == ''){
				util.showInputError(bemnCodeInputEl);
			}else{
				util.api({
					"type":"post",
					"data":{"code":bemnCodeInputEl.val()},
					"url":"/Account/BindingEmployeeExmail/",
					"success":function(responseData){
						if(responseData.success){
							bemain.hide();
							emailBc.show();
                            $('#tip-settings-boundexmail').attr('href',FS.BASE_PATH+'/H/Account/GetBindingEmployeeExmailLoginUrl').attr('target','_blank');
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
					"url":"/Account/CancelBindingEmployeeExmail/",
					"success":function(responseData){
						if(responseData.success){
							bemain.show();
							emailBc.hide();
							bemnInputEl.val("");
							bemnCodeInputEl.val("");
                            $('#tip-settings-boundexmail').attr('href','#settings/boundexmail').removeAttr('target');
						}	
					}
			});
			evt.preventDefault();
		});
		//更改邮箱
		editNumberEl.click(function(){			
			bemain.show();
			emailBc.hide();
			bemnInputEl.val("");
			bemnCodeInputEl.val("");
		});
		//显示邮箱的默认绑定状态
        if(loginUserData.boundEmployeeExmail){     //已绑定邮箱
            bemain.hide();
            emailBc.show();
        }else{
            bemain.show();
            emailBc.hide();
        }
		//tab部分
		tplCommon.init(tplEl,tplName);
    };
});