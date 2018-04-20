/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        json=require('json'),
        fsHelper=require('modules/fs-qx/fs-qx-helper');
    var Uploader=fsHelper.Uploader;
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
		//左侧 切换
		var leftListWrap=$('.flag-left-list',tplEl),
			entSetupWrap=$('.ent-setup-wrap',tplEl),
			loginSetupWrap=$('.login-setup-wrap',tplEl),
            customManageWrap=$('.custom-manage-wrap',tplEl);
		leftListWrap.find('li').click(function(){
			leftListWrap.find('a').removeClass('fl-item-on');
			var meEl=$(this);
            var index=meEl.index();
			$('a',meEl).addClass('fl-item-on');
			if(index==0){
				entSetupWrap.show();
				loginSetupWrap.hide();
                customManageWrap.hide();
			}else if(index==1){
				entSetupWrap.hide();
                customManageWrap.hide();
				loginSetupWrap.show();
			}else if(index==2){
                entSetupWrap.hide();
                loginSetupWrap.hide();
                customManageWrap.show();
            }
		});	
		//登录页设置 颜色选择控件
		var lsuInpText=$('.lsu-inp-text',tplEl),
			lsuViewColor=$('.lsu-view-color',tplEl),
			lsuSelWrap=$('.lsu-sel-wrap',tplEl),
			lsuSelView=$('.lsu-sel-view',tplEl),
			lsuViewCvalue=$('.lsu-view-cvalue',lsuSelWrap),
			lsuSelList=$('.lsu-sel-list',lsuSelWrap);
		lsuSelList.find('li').click(function(){
			var meEl=$(this);
			lsuSelList.find('li').removeClass('lslon');
			meEl.addClass('lslon');
			var meColor=meEl.attr('color');
			lsuViewCvalue.css('background-color',meColor);
			lsuViewColor.css('background-color',meColor);
			lsuInpText.val(meColor.slice(1,7));
			lsuSelList.hide();
		});	
		lsuSelView.click(function(evt){
			lsuSelView.addClass('lsuvcon');
			if(lsuSelList.is(':visible')){
				lsuSelList.hide();		
			}else{
				lsuSelList.show();
				//lsuSelView.removeClass('lsuvcon');
			}
			evt.stopPropagation();
		});
		$(document).click(function(){lsuSelList.hide();lsuSelView.removeClass('lsuvcon');});
		lsuInpText.keyup(function(){
			var meEl=$(this);
			var meColor=meEl.val();
			if(meEl.val().length==6){
				lsuViewColor.css('background-color','#'+meColor);
			}
		});
		//接口 rander
		var entSetupWrap=$('.ent-setup-wrap',tplEl),
			smsEnterpriseNameEl=$('.sms-enterprise-name',entSetupWrap),
			smsEnterpriseBtn=$('.sms-enterprise-btn',entSetupWrap),
			allCompanyInpEl=$('.all-company-inp',entSetupWrap),
			allCompanyBtn=$('.all-company-btn',entSetupWrap),
			enterpriseBgcolorBtn=$('.enterprise-bgcolor-btn',tplEl),
			enterpriseBgcDefaultBtn=$('.enterprise-bgc-default-btn',tplEl);
		util.api({
			"type":"get",
			"data":{},
			"url":"/Management/GetEnterpriseInfo",
			"success":function(responseData){
				if(responseData.success){
					var entValue=responseData.value;
					var smsEnterpriseName=entValue.enterpriseName,
						allCompanyDefaultString=entValue.allCompanyDefaultString,
						enterpriseBackgroundColor=entValue.enterpriseBackgroundColor;
					smsEnterpriseNameEl.val(smsEnterpriseName);	
					allCompanyInpEl.val(allCompanyDefaultString);
					lsuInpText.val(enterpriseBackgroundColor);
					lsuViewColor.css('background-color','#'+enterpriseBackgroundColor);	
					var lsuSelItemData=lsuSelList.find('li');
					lsuSelItemData.each(function(){
						var meEl=$(this);
						if(meEl.attr('color').slice(1) == enterpriseBackgroundColor){
							meEl.addClass('lslon');
							lsuViewCvalue.css('background-color','#'+enterpriseBackgroundColor);
						}
					});
				}
			}
		});
		smsEnterpriseBtn.click(function(){
            var val=_.str.trim(smsEnterpriseNameEl.val());
			if(val.length==0){
				util.showInputError(smsEnterpriseNameEl);
			}else{
				util.api({
					"type":"post",
					"data":{"enterpriseName":val},
					"url":"/Management/SetEnterpriseName",
					"success":function(responseData){
						if(responseData.success){
                            $('.hd .enterprise-name').text(val);
							util.alert('保存成功。');
						}
					}
				});
			}
		});
		allCompanyBtn.click(function(){
            var val= _.str.trim(allCompanyInpEl.val());
			if(val.length==0){
				util.showInputError(allCompanyInpEl);
			}else{
				util.api({
					"type":"post",
					"data":{"allCompanyDefaultString":val},
					"url":"/Management/SetAllCompanyDefaultString",
					"success":function(responseData){
						if(responseData.success){
                            //设置模板变量
                            util.setTplStore('entinfomgt',{
                                "enterpriseName":val
                            });
							util.alert('保存成功。');
						}
					}
				});
			}
		});
		enterpriseBgcolorBtn.click(function(){
            var val= _.str.trim(lsuInpText.val());
			if(val.length < 6){
				util.showInputError(lsuInpText);
			}else{
				util.api({
					"type":"post",
					"data":{"backgroundColor":val},
					"url":"/Management/SetEnterpriseBackgroundColor",
					"success":function(responseData){
						if(responseData.success){
							util.alert('保存成功。');
						}
					}
				});
			}
		});
		enterpriseBgcDefaultBtn.click(function(){
			var defaultColor='a6ce39';
			util.api({
				"type":"post",
				"data":{"backgroundColor":defaultColor},
				"url":"/Management/SetEnterpriseBackgroundColor",
				"success":function(responseData){
					if(responseData.success){
						lsuInpText.val(defaultColor);
						lsuViewColor.css('background-color','#'+defaultColor);
						lsuViewCvalue.css('background-color','#'+defaultColor);
						lsuSelList.find('li').removeClass('lslon');
						lsuSelList.find('li').eq(0).addClass('lslon');
					}
				}
			});
		});
		//接口 rander end
		//logo上传
        var logoUploadBtnEl=$('.up-logo-file',tplEl),
            restoreLogoBtnEl=$('.up-logo-default-btn',tplEl),
            loginUploadBtnEl=$('.up-mainimg-file',tplEl),
            restoreLoginBtnEl=$('.up-mainimg-default-btn',tplEl);
        var logoImgEl=$('.hd .logo-img'),
            tplLogoImgEl=$('.logo-img',tplEl),
            tplLoginImgEl=$('.login-img',tplEl);
        var globalData=FS.getAppStore('globalData');
        var logoPath=FS.API_PATH+'/Authorize/GetLogoImg?type=1&ent='+globalData.enterprise,
            loginPath=FS.API_PATH+'/Authorize/GetLogoImg?type=2&ent='+globalData.enterprise;

        var logoUploader=new Uploader({
            "element":logoUploadBtnEl,
            "h5UploadPath":"/Management/uploadFile", //上传地址
            "flashUploadPath":"/Management/UploadFileByForm", //普通表单上传地址
            "h5Opts":{
                multiple:false,
                accept:"image/*",
                filter: function (files) {
                    var passedFiles=[];
                    _.each(files,function(fileData){
                        if(util.getFileType(fileData)=="jpg"){
                            passedFiles.push(fileData);
                        }else{
                            util.alert('请选择图片格式的文件');
                        }
                    });
                    return passedFiles;
                }
            },
            "flashOpts":{
                file_types : "*.jpg;*.gif;*.jpeg;*.png",
                file_types_description : "图片格式",
                button_width: 80,
                button_height: 25
            },
            "onSelect":function(file){
                this.startUpload();
            },
            "onSuccess":function(file,responseText){
                //上传成功后处理
                var responseData=json.parse(responseText);
                var filePath;
                if(responseData.success){
                    filePath=responseData.value.filePath;
                    util.api({
                        type: 'post',
                        data: {
                            "logoPath":filePath
                        },
                        url: '/Management/UploadLogo',
                        success: function (responseData) {
                            var random=new Date()/1;
                            if(responseData.success){
                                //更换logo
                                logoImgEl.attr('src',logoPath+'&r='+random);
                                tplLogoImgEl.attr('src',logoPath+'&r='+random);
                            }
                        }
                    });
                }
            },
            "onComplete":function(){
                //上传成功后清理文件缓存
                this.removeAllFile();
            }
        });
        var loginUploader=new Uploader({
            "element":loginUploadBtnEl,
            "h5UploadPath":"/Management/uploadFile", //上传地址
            "flashUploadPath":"/Management/UploadFileByForm", //普通表单上传地址
            "h5Opts":{
                multiple:false,
                accept:"image/*",
                filter: function (files) {
                    var passedFiles=[];
                    _.each(files,function(fileData){
                        if(util.getFileType(fileData)=="jpg"){
                            passedFiles.push(fileData);
                        }else{
                            util.alert('请选择图片格式的文件');
                        }
                    });
                    return passedFiles;
                }
            },
            "flashOpts":{
                file_types : "*.jpg;*.gif;*.jpeg;*.png",
                file_types_description : "图片格式",
                button_width: 80,
                button_height: 25
            },
            "onSelect":function(file){
                this.startUpload();
            },
            "onSuccess":function(file,responseText){
                //上传成功后处理
                var responseData=json.parse(responseText);
                var filePath;
                if(responseData.success){
                    filePath=responseData.value.filePath;
                    util.api({
                        type: 'post',
                        data: {
                            "picPath":filePath
                        },
                        url: '/Management/UploadMainPic',
                        success: function (responseData) {
                            var random=new Date()/1;
                            if(responseData.success){
                                //更换login image
                                tplLoginImgEl.attr('src',loginPath+'&r='+random);
                            }
                        }
                    });
                }
            },
            "onComplete":function(){
                //上传成功后清理文件缓存
                this.removeAllFile();
            }
        });
        //点击logo恢复默认按钮
        restoreLogoBtnEl.click(function(){
            util.api({
                type: 'post',
                url: '/Management/ClearLogo',
                success: function (responseData) {
                    var random=new Date()/1;
                    if(responseData.success){
                        //更换logo
                        logoImgEl.attr('src',logoPath+'&r='+random);
                        tplLogoImgEl.attr('src',logoPath+'&r='+random);
                    }
                }
            });
        });
        //点击login恢复默认按钮
        restoreLoginBtnEl.click(function(){
            util.api({
                type: 'post',
                url: '/Management/ClearMainPic',
                success: function (responseData) {
                    var random=new Date()/1;
                    if(responseData.success){
                        //更换login image
                        tplLoginImgEl.attr('src',loginPath+'&r='+random);
                    }
                }
            });
        });
        //页面设置默认的logo图片
        tplLogoImgEl.attr('src',logoPath+'&r='+(new Date()/1));
        tplLoginImgEl.attr('src',loginPath+'&r='+(new Date()/1));

        //客户管理部分
        customManageWrap.on('click','.f-sub',function(evt){
            var isAllow=$('.control-modify-parent',customManageWrap).prop('checked');
            util.api({
                type: 'post',
                data:{
                    "isAllow":!isAllow
                },
                url: '/Management/SetIsAllowSetOwnLeader',
                success: function (responseData) {
                    if(responseData.success){
                        //$('.control-modify-parent',customManageWrap).prop('checked',false);
                        globalData.isAllowSetOwnLeader=!isAllow;
                        util.alert("保存成功");
                    }
                }
            });
        });
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                $('.control-modify-parent',customManageWrap).prop('checked',!globalData.isAllowSetOwnLeader);
            }
        });
        //客户管理权限控制
        /*if(globalData.model==1){
            $('.flag-left-list .custom-manage-item',tplEl).hide();
        }*/
        //登录页设置权限控制
        if(globalData.isLoginPagePersonalization){
            $('.login-setting-item',tplEl).show();
        }
    };
});