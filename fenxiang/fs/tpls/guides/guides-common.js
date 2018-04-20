/**
 * stream辅助页面逻辑
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util=require('util');
    var contactData=util.getContactData(),
        loginUserData=contactData["u"];
    exports.init=function(tplEl,tplName){
		 
        //注册子导航
		util.tplRouterReg("#guides/resetpassword");
		
    };
	//保存成功 动画
	exports.saveSuccessAnimated=function(tplEl,tplName){
		var saveSuccessEl=$('.save-success-apv',tplEl);
		saveSuccessEl.animate({top:'0px'},300,function(){
			setTimeout(function(){
				saveSuccessEl.animate({top:'54px'},300);
			},2000);		
		});		
	};
});