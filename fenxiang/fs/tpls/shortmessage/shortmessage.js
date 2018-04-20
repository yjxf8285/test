/**
 * 企信列表
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        tplCommon = require('./shortmessage-common'),
        ShortmessageList = require('modules/fs-qx/fs-shortmessage-list');
    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;

        var listEl = $('.qx-list', tplEl);
        var pagEl = $('.qx-list-pagination', tplEl);
        //创建列表
        var qxList = new ShortmessageList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/ShortMessage/GetShortMessageSessions", //企信列表的接口地址
            "searchOpts": {},
            "listCb": function(responseData) { //列表数据请求后的回调
            }
        });
        //公共逻辑
        tplCommon.init(tplEl,tplName);

        //切换到当前模板后重新加载企信列表
        var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //刷新
                if(!firstRender){
                    qxList.reload();
                }else{
                    firstRender=false;
                    qxList.load();
                }
            }
        });
    };
});