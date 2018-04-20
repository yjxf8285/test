/**
 * 全部客户
 *
 * 遵循seajs module规范
 * @author liuxiaofan 2014-06-03
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../settings-common');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-contact-list/crm-contact-list');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var list = new List({
            data: {
                employeeID: 0,//int，员工ID，如果是自身就填自己的id
                keyword: '',//string，关键字
                isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                isDeleted: -1,// int，是否为删除的，0,1
                createCustomer: -1,//int，是否创建联系人 0：未创建 1：创建 -1 全部
                sortType: 0,//int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                isContainSubordinate: -1,// int，是否包含下属 0：自己;1:下属;-1:全部
                pageSize: 25,//int，分页大小
                pageNumber: 1// int，当前页
            },
            "warpEl": $(".list-warp", tplEl),
            "url": "Contact/GetAllContacts"
        });
        list.load();
        list.refresh();
        $('.top-fn-btns', tplEl).hide();
        var header = new Header({
            "element": $(".crm-list-hd", tplEl),
            "title": "全部联系人",
            "searchPlaceholder": "搜索联系人"
        });
        header.on("search", function (keyword) {
            list.refresh({
                "keyword": keyword
            });
        });
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);
    };
});