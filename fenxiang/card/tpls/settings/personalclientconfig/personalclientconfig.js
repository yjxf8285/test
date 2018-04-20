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
			
		var pccOpen=$('.is-play-notice-sound',tplEl),
            playLinkEl=$('.play-l',tplEl),
			pccBtn=$('.save-success-btn',tplEl);

        var setting= _.extend({     //默认小黄标提醒设置
            "IsShowInviteEmployeeTask":false,
            "IsShowReceiptTip":false,
            "IsShowReceiptionGuide":false,
            "IsSkipApproveGuide":false,
            "IsSkipNMSMarketing":false,
            "IsSkipPlan":true,
            "IsSkipPlanGuide":false,
            "IsSkipSMSMarketing":false,
            "IsSkipShareGuide":false,
            "IsSkipWorkGuide":false,
            "PlayNotificationSound":false
        },util.getEnterpriseConfig(107,true));

        if(setting["PlayNotificationSound"]){
            pccOpen.prop('checked',true);
        }else{
            pccOpen.prop('checked',false);
        }
		pccBtn.click(function(evt){
            if(pccOpen.prop('checked')){
                setting["PlayNotificationSound"]=true;
            }else{
                setting["PlayNotificationSound"]=false;
            }
            //设置本地存储
            util.setEnterpriseConfig(107,setting,true);
            //同步到服务器端
            util.updateEnterpriseConfig(107,function(responseData){
                if(responseData.success){
                    tplCommon.saveSuccessAnimated(tplEl,tplName);
                }
            });
			evt.preventDefault();
		});
        //试听
        playLinkEl.click(function(evt){
            FS.remindSoundPlayer&&FS.remindSoundPlayer.play();
            evt.preventDefault();
        });
		//tab部分
		tplCommon.init(tplEl,tplName);
		
    };
});