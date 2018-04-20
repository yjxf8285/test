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
    var util=require('util'),
        tabTpl=require('./settings-common.html'),
        tabTplEl=$(tabTpl);
    var contactData=util.getContactData(),
        loginUserData=contactData["u"];
    exports.init=function(tplEl,tplName){
		 var tabTemp=tabTplEl.filter('.settings-tpl-tab').html(); // tab 模版
		 var tpltabEl=$('.swtab-list',tplEl),
             bindEmailWEl;
		 tpltabEl.html(tabTemp); //tab 模版渲染
         bindEmailWEl=$('.bind-email-l-wrapper',tpltabEl);
        //settings tab切换
		var swtabList=$('.swtab-list',tplEl);
        swtabList.find("li > a").click(function(){
			var meEl=$(this);
			swtabList.find("li > a").removeClass('swtab-item-aon');
			meEl.addClass('swtab-item-aon');
		});
        if(loginUserData.exmailDomain){    //邮箱域名不为空的情况下出现
            bindEmailWEl.show();
        }
        //高亮导航注册
        util.regTplNav($('a',swtabList),'swtab-item-aon');
        //注册子导航
        util.tplRouterReg("#settings/personalsetting");
		util.tplRouterReg("#settings/resetpassword");
		util.tplRouterReg("#settings/avatarsetting");
		util.tplRouterReg("#settings/bindphone");
		util.tplRouterReg("#settings/setupnodisturb");
		util.tplRouterReg("#settings/personalclientconfig");
		util.tplRouterReg("#settings/planremindconfig");
		util.tplRouterReg("#settings/boundexmail");
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