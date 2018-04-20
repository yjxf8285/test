/**
 * 同事上下级
 *
 * 遵循seajs module规范
 * @author liuxiaofan 2014-03-26
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../settings-common');
    var Leaderssetting = require('modules/crm-leaderssetting/crm-leaderssetting');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var leaderssettingWarpEl = $('.leaders-settings-warp', tplEl);
        var leaderssetting = new Leaderssetting({
            warpEl: leaderssettingWarpEl,
            url: "/Employee/GetAllEmployees",
            data: {
                isStop: 0,//是否离职员工
                keyword: '',//搜索关键字
                isFirstChar: false,//是否是首字符方式查询
                pageSize: 28,//分页大小 28
                pageNumber: 1//第几页
            }
        });
        leaderssetting.load();
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);
        //util.showGlobalLoading(1);
    };
});