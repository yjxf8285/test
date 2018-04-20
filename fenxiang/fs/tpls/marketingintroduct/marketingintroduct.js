/**
 * Index模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
		moment = require('moment'),
        tplEvent = tpl.event;
    var util = require('util');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;

        tplEvent.on('switch', function (tplName2, tplEl) {
            if(tplName2==tplName){
                $('.hd-b').hide();
                $('.hd .top-nav-l').removeClass('sc-tag');
                $('.hd .cxb-l').removeClass('sc-tag').addClass('sc-tagon');
            }else{
                $('.hd-b').show();
                $('.hd .top-nav-l').removeClass('sc-tag').eq(0).addClass('sc-tagon'); //默认工作管理高亮
            }
        });
    };
});