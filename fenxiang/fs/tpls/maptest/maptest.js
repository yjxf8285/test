/**
 * 地图列表
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;


    var MapList = require('modules/fs-map/fs-map-list');

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var listEl = $('.map-list', tplEl);
        var pagEl = $('.map-list-pagination', tplEl),
            filterEl = $('.filter', tplEl);
        //创建列表
        var mapList = new MapList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/Location/GetLocationInfosByIDAndTimeRange", //map列表接口地址
            "oData": {
                "employeeID": 2,
                "startTime": 0,
                "endTime": 0
            },
            "pagOpts": { //分页配置项
                "pageNumber": 1,
                "pageSize": 10,
                "visiblePageNums": 1
            },
            "searchOpts": {},
            "listCb": function(responseData) { //列表数据请求后的回调
            }
        });
        mapList.load();
    };
});