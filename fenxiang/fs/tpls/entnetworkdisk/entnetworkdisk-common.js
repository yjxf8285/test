/**
 * 网盘辅助页面逻辑
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
        moment=require('moment'),
        leftTpl=require('./entnetworkdisk-common.html'),
        commonStyle=require('./entnetworkdisk-common.css'),
        leftTplEl=$(leftTpl);
    //注册子路由
    util.tplRouterReg('#entnetworkdisk/remindmyfile');
    util.tplRouterReg('#entnetworkdisk/medownloadfile');

    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"];
        var renderData={};
        var leftCompiled=_.template(leftTplEl.filter('.entnetworkdisk-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });

        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));
        //高亮导航注册
        util.regTplNav($('.tpl-nav-lb',tplLeftEl));
    };
});