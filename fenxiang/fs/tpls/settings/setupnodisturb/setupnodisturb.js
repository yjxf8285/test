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
		//radio click 事件	
		var startRadiosEl=$('.start-radios',tplEl),
		 	endRadiosEl=$('.end-radios',tplEl),
			sTimeText=$('.s-time-text',tplEl),
			eTimeText=$('.e-time-text',tplEl),
			setupnodisturbOpen=$('#setupnodisturb-open',tplEl),
			setupnodisturbMtpl=$('.setupnodisturb-main-tpl',tplEl),
			setupnodisturbBtn=$('.save-success-btn',tplEl);

        var noDisturbSetting=util.getEnterpriseConfig(106); //默认免打扰设置
			
		setupnodisturbOpen.click(function(){
			var meEl=$(this);
			if(meEl.is(':checked')){
				setupnodisturbMtpl.show();
                $('.start-time[value="23"]',startRadiosEl).prop('checked',true);
			}else{
				setupnodisturbMtpl.hide();
                $('.end-time[value="7"]',startRadiosEl).prop('checked',true);
			}	
		});	
		startRadiosEl.find('input[type=radio]').click(function(){
			var meEl=$(this);
			sTimeText.html(meEl.val());
		});
		endRadiosEl.find('input[type=radio]').click(function(){
			var meEl=$(this);
			eTimeText.html(meEl.val());
		});
		setupnodisturbBtn.click(function(evt){
			var svalue;
            if(setupnodisturbOpen.prop('checked')){
                svalue = sTimeText.text()+","+eTimeText.text();
            }else{
                svalue ="";
            }
            //设置本地存储
            util.setEnterpriseConfig(106,svalue);
            //同步到服务器端
            util.updateEnterpriseConfig(106,function(responseData){
                if(responseData.success){
                    tplCommon.saveSuccessAnimated(tplEl,tplName);
                }
            });
			evt.preventDefault();
		});
		//设置默认数据
        if(noDisturbSetting.length>0){
            noDisturbSetting=noDisturbSetting.split(',');
            $('.start-time',tplEl).filter('[value="'+noDisturbSetting[0]+'"]').prop('checked',true);
            $('.end-time',tplEl).filter('[value="'+noDisturbSetting[1]+'"]').prop('checked',true);
            sTimeText.text(noDisturbSetting[0]);
            eTimeText.text(noDisturbSetting[1]);
            setupnodisturbOpen.prop('checked',true);
            setupnodisturbMtpl.show();
        }else{
            setupnodisturbOpen.prop('checked',false);
            setupnodisturbMtpl.hide();
        }
		//tab部分
		tplCommon.init(tplEl,tplName);
		
    };
});