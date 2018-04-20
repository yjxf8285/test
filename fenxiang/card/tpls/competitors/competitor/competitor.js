/**
 * CRM - 对手 - tpl
 *
 * @author liuxiaofan
 * 2014-04-23
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
    var Competitor = require('modules/crm-competitor-list/crm-competitor-list');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var competitorListWarpEl = $('.competitors-competitor-warp', tplEl);
        var competitor = new Competitor({
            warpEl: competitorListWarpEl,
            data: {
                listTagOptionID: '407,0', //List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                keyword: '', //搜索关键字
                sortType: 0, //排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                pageSize: 10, //分页大小
                //                "totalSize": 38,//一共多少条
                pageNumber: 1 //当前页
            },
            url: "/Competitor/GetCompetitorList"
        });
        competitor.load();
        var header = new Header({
            "element": $(".crm-list-hd", tplEl),
            "title": "竞争对手",
            "searchPlaceholder": "搜索竞争对手"
        });
        header.on("search", function (keyword) {
            competitor.refresh({
                "keyword": keyword
            });
        });

    };

});