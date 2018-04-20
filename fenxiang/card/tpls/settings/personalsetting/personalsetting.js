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
		currentUserData=contactData["u"];
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
		
		//settings input click
		//var settingsInput=$('.settings-input'),
		//settingsTextarea=$('.settings-textarea');
		var formEl=$('.personalsetting-form',tplEl),
			inputEl=$('.settings-input,.settings-textarea',formEl),
			settingsTextarea=$('.settings-textarea',formEl);

		var userFullName=$('#user-fullname'),
			userName=$('#user-name'),
		    userAccount=$('#user-account'),
			userGenderM=$('#s-sex-male'),
			userGenderF=$('#s-sex-female'),
			userDepartment=$('#user-department'),
			userPost=$('#user-post'),
			userQq=$('#user-qq'),
			userMsn=$('#user-msn'),
			userEmail=$('#user-email'),
			userTel=$('#user-tel'),
			userDescription=$('#user-description');	
		//禁止输入中文
		formEl.on('keyup','#user-qq,#user-msn,#user-email,#user-tel',function(){
			var meEl=$(this);
			meEl.val(meEl.val().replace(/[^\x00-\xff]/ig,''));
		});	
		var getRequestData=function(){
			var requestData={};
			requestData.employeeID=currentUserData.id;
			requestData.account=userAccount.val();
			requestData.name=userName.val();
			requestData.tel=userTel.val();
			requestData.department=userDepartment.val();
			requestData.post=userPost.val();
			requestData.qq=userQq.val();
			requestData.msn=userMsn.val();
			requestData.email=userEmail.val();
			if(userGenderM.is(':checked'))
			{
				requestData.gender="M";
			}else if(userGenderF.is(':checked')){
				requestData.gender="F";
			}
			requestData.description=userDescription.val();
			return requestData;	
		};
		var isValid=function(){
			var isPassed=true;
			var accountValue=userAccount.val(),
				userDepartmentVal= _.str.trim(userDepartment.val()),
				userPostVal= _.str.trim(userPost.val()),
				userQqVal= _.str.trim(userQq.val()),
				userMsnVal= _.str.trim(userMsn.val()),
				userEmailVal= _.str.trim(userEmail.val()),
				userTelVal= _.str.trim(userTel.val()),
                userDescriptionVal= _.str.trim(userDescription.val());
			if(accountValue.length==0){
				isPassed=false;	
			}
			/*if(userDepartmentVal.length>50){
                util.alert('请控制部门在50字内，目前已超出<em>'+(userDepartmentVal.length-50)+'</em>个字');
                isPassed=false;
            }
			if(userPostVal.length>50){
                util.alert('请控制职务在50字内，目前已超出<em>'+(userPostVal.length-50)+'</em>个字');
                isPassed=false;
            }
			if(userQqVal.length>20){
                util.alert('请控制QQ在20字内，目前已超出<em>'+(userQqVal.length-20)+'</em>个字');
                isPassed=false;
            }
			if(userMsnVal.length>50){
                util.alert('请控制MSN在50字内，目前已超出<em>'+(userMsnVal.length-50)+'</em>个字');
                isPassed=false;
            }
			if(userEmailVal.length>50){
                util.alert('请控制工作邮箱在50字内，目前已超出<em>'+(userEmailVal.length-50)+'</em>个字');
                isPassed=false;
            }
			if(userTelVal.length>20){
                util.alert('请控制办公电话在20字内，目前已超出<em>'+(userTelVal.length-20)+'</em>个字');
                isPassed=false;
            }*/
            if(userDescriptionVal.length>500){
                util.alert('请控制工作介绍在500字内，目前已超出<em>'+(userDescriptionVal.length-500)+'</em>个字');
                isPassed=false;
            }
			
			return isPassed; 	
		};
		var clear=function(){
				
		};
		formEl.on('click','.settings-input,.settings-textarea',function(evt){
			var meEl=$(this);
			inputEl.each(function(){
				var inputEl=$(this);
				inputEl.removeClass('settings-input-on');
				inputEl.next().hide();		
			});
			meEl.addClass('settings-input-on');
			meEl.next().show();
			evt.stopPropagation();		
		}).on('click','.save-success-btn',function(evt){
			var requestData;
			if(isValid()){
				requestData=getRequestData();
				util.api({
					"type":"post",
					"url":"/Account/SaveCurrentUser/",
					"data":requestData,
					"success":function(responseData){
						if(responseData.success){
							//clear();	
							tplCommon.saveSuccessAnimated(tplEl,tplName);
						}		
					}	
				});	
			}
			
			evt.preventDefault();		
		});
        //设置默认页面数据
        util.api({
            "type":"get",
            "data":{"employeeID":currentUserData.id},
            "url":"/Account/GetEmployeeByID",
            "success":function(responseData){
                var dataRoot;
                if(responseData.success){
                    dataRoot=responseData.value;
                    userFullName.val(dataRoot.fullName);
                    userName.val(dataRoot.name);
                    userAccount.val(dataRoot.account);
                    if(dataRoot.gender=="M")
                    {
                        userGenderM.prop("checked",true);
                    }else if(dataRoot.gender=="F"){
                        userGenderF.prop("checked",true);
                    }
                    userDepartment.val(dataRoot.department);
                    userPost.val(dataRoot.post);
                    userQq.val(dataRoot.qq);
                    userMsn.val(dataRoot.msn);
                    userEmail.val(dataRoot.email);
                    userTel.val(dataRoot.tel);
                    userDescription.val(dataRoot.description);

                }
            }
        });
		util.regGlobalClick(inputEl,function(){
			inputEl.each(function(){
				var inputEl=$(this);
				inputEl.removeClass('settings-input-on');
				inputEl.next().hide();		
			});		
		});
		
		//tab部分
		tplCommon.init(tplEl,tplName);
    };
});