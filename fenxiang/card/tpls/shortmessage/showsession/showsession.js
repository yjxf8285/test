/**
 * 企信会话列表
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
        tplCommon = require('../shortmessage-common'),
        ShowsessionList = require('modules/fs-qx/fs-showsession-list');
    var sessionID = 0, sessionCategory = null;
    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;

        var listEl = $('.session-list', tplEl);
        var pagEl = $('.session-list-pagination', tplEl);
        var sessionTitleEl = $('.nav-info .session-title', tplEl); //与xx的对话,session标题
        //创建列表
        var sessionList = new ShowsessionList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/V3Messenger/HistoricalViewMessages", //企信详情列表的接口地址
            "searchOpts": {},
            "defaultRequestData": function() {
                var queryParams = util.getTplQueryParams(); //传给模板的参数
                var sessionId = queryParams ? queryParams.id : 0;
                sessionID = sessionId;
                return {
                    "sessionId": sessionId
                };
            },
            "listCb": function(responseData) {
                if (responseData.success) {
                    sessionCategory = responseData.value.sessionCategory
                    sessionTitleEl.html(responseData.value.sessionName);
                }
            },
            "listEmptyText":"当前会话内没有对话"
        });
        //公共逻辑
        tplCommon.init(tplEl, tplName);
        //清空聊天记录
        tplEl.on('click', '.clear-session-btn', function() {
            if(!sessionCategory || !sessionID){return false;}
            util.confirm('你确定要清空该对话的所有信息吗？', '提示', function(evt) {
                //点确定执行
                sessionList.emptyToService(sessionID, sessionCategory);
            }, {
                "onCancel": function() {},
                "width": 338
            });
        });

        //切换到当前模板后重新加载企信列表
        var firstRender = true;
        tplEvent.on('switched', function(tplName2, tplEl) {
            if (tplName2 == tplName) {
                /*var queryParams = util.getTplQueryParams(); //传给模板的参数
                var employeeId = queryParams ? queryParams.empid : 0;*/
                //刷新
                if (!firstRender) {
                    sessionList.reload();
                } else {
                    firstRender = false;
                    sessionList.load();
                }
            }
        });
    };
});