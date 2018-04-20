/**
 * 联系人导出
 *
 * 遵循seajs module规范
 * @author liuxiaofan
 * 2014-05-30
 */

define(function (require, exports, module) {
    var Dialog = require("dialog"),
        root = window,
        FS = root.FS,
        util = require('util');
    var tpl = require('modules/crm-contact-export/crm-contact-export.html');
////    var tplStyle = require('modules/crm-contact-export/crm-contact-export.css');
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');
    var moment = require('moment');

    var ContactExport = Dialog.extend({
        "attrs": {
            "content": tpl,
            "isAll": false,
            "width": 480,
            "title": "",
            "selectColleague": null,
            "belongTo": 0,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>"
        },

        "setup": function () {
            var result = ContactExport.superclass.setup.apply(this, arguments);
            return result;
        },

        "render": function () {
            var result = ContactExport.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },

        "_init": function () {
            if (this.get("isAll")) {
                $(".crm-contact-export-is-all", this.element).show();
            } else {
                $(".crm-contact-export-is-all", this.element).hide();
            }
            this._initSelectColleague();
        },

        "_initSelectColleague": function () {
            var self = this;
            var selectColleague = new SelectColleague({
                "isMultiSelect": false,
                "hasWorkLeaveBtn": false,
                "title": "选择归属人"
            });

            selectColleague.on("selected", function (val) {
                self._onColleagueSelect(val);
            });
            self.set("selectColleague", selectColleague);
        },

        //隐藏
        "hide": function () {
            var result = ContactExport.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (optionsData) {
            var result = ContactExport.superclass.show.apply(this, arguments);
            this.set('optionsData', optionsData);//把带过来的列表参数保存起来

            return result;
        },

        "events": {
            "click .crm-isfirstchar-chekbox": "_isfirstcharChekbox",
            "click .crm-contact-export-button-select": "_colleagueSelect",
            "click .crm-contact-export-button-clear": "_colleagueClear",
            "click .crm-contact-export-button-export": "_export"
        },
        _isfirstcharChekbox: function () {
            var isfirstcharChekboxEl = $('.crm-isfirstchar-chekbox', this.element);
            var isfirstcharWarpEl = $('.crm-contact-export-isfirstchar-warp', this.element);
            var keyWordWarpEl = $('.crm-contact-export-keyword-warp', this.element);
            var isfirstchar = util.mnGetter(isfirstcharChekboxEl);


            if (isfirstcharChekboxEl.find('.mn-checkbox-item').is('.mn-selected')) {
                keyWordWarpEl.show();
                isfirstcharWarpEl.hide();
            } else {
                keyWordWarpEl.hide();
                isfirstcharWarpEl.show();
            }

        },
        "_colleagueSelect": function () {
            this.get("selectColleague").show();
        },

        "_onColleagueSelect": function (val) {
            if (!val) {
                return;
            }
            $(".crm-contact-export-belong-to", this.element).text(val.name);
            this.set("belongTo", val.employeeID);
            $(".crm-contact-export-button-clear", this.element).show();
        },

        "_colleagueClear": function () {
            $(".crm-contact-export-belong-to", this.element).text("");
            this.set("belongTo", 0);
            $(".crm-contact-export-button-clear", this.element).hide();
        },

        "_export": function () {
            var isfirstcharChekboxEl = $('.crm-isfirstchar-chekbox', this.element);
            var self = this;
            var belongTo = this.get("belongTo");
            var name = encodeURI("我的联系人");
            var optionsData = this.get('optionsData');
            var isfirstchar = util.mnGetter(isfirstcharChekboxEl);
            var keyword = '';// string，搜索关键字
            if (isfirstchar.length > 0) {
                isfirstchar = true;
                keyword = util.mnGetter($(".isfirstchar-select-list", this.element));
            } else {
                isfirstchar = false;
                keyword = $(".crm-contact-export-keyword-input", this.element).val();// string，搜索关键字
            }
            var urlStr = '/Contact/ExportUserContactsExcel';
            var statesEl = $('.states-select-list', '#contacts-contact');
            var createCustomer = util.mnGetter(statesEl);
            var oData;
            if (createCustomer === null) {
                createCustomer = -1;
            }

            if (this.get("isAll")) {
                name = encodeURI("全部联系人");
                oData = { //默认数据导出用户联系人的参数
                    employeeID: this.get("belongTo"),//int，员工ID，如果是自身就填自己的id
                    keyword: keyword,//string，搜索关键字
                    isFirstChar: isfirstchar,//bool，是否首字母查询
                    createCustomerFlag: util.mnGetter($(".crm-contact-export-customer", this.element)),//int，是否创建联系人 0：未创建 1：创建 -1 全部
                    isDeleted: util.mnGetter($(".crm-contact-export-status", this.element))//int，是否删除，0,1
                };
                urlStr = "/Contact/ExportAllContactsExcel";
            } else {
                name = encodeURI("我的联系人");
                urlStr = '/Contact/ExportUserContactsExcel';
                oData = { //默认数据导出用户联系人的参数
                    keyword: keyword,
                    employeeID: optionsData.employeeID,//int，员工ID，如果是自身就填自己的id(不能传0)
                    sortType: optionsData.sortType,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;4:NameSpell,Name倒序；5：职务正序；6：职务倒序；7：部门正序；8：部门倒序；9：公司正序；10：公司倒序；11：更新时间正序；12：更新时间倒序
                    isContainSubordinate: optionsData.isContainSubordinate,// int，是否包含下属 0：自己;1:下属;-1:全部
                    isFirstChar: isfirstchar,//bool，是否首字母查询
                    createCustomer: optionsData.createCustomer,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                    source: optionsData.source,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                    startDate: 0,// long，开始时间
                    endDate: 0,// long，结束时间
                    listTagOptionID: []// List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                };
            }
            util.api({
                'url': urlStr,
                'type': 'post',
                "dataType": 'json',
                'data': oData,
                'timeout': 120000,//导出设置超时2min
                'success': function (responseData) {
                    if (responseData.success) {
                        var serviceTime = responseData.serviceTime;
                        var fTime = moment.unix(serviceTime).format('YYYYMMDDHHmm');
                        $(".crm-contact-export-download", self.element).attr("href", FS.API_PATH + "/DF/GetTemp?id=" + responseData.value + "&name=" + fTime + '_' + name + ".xls&isAttachment=true").show();
                    }
                }
            }, {
                "submitSelector": $('.crm-contact-export-button-export', this.element)
            });
        },

        "reset": function () {
            $(".crm-contact-export-belong-to", this.element).text("");
            this.set("belongTo", 0);
            $(".crm-contact-export-button-clear", this.element).hide();
            $(".crm-contact-export-download", this.element).hide();
            if (this.get("isAll")) {
                util.mnSetter($(".crm-contact-export-customer", this.element), -1);
                util.mnSetter($(".crm-contact-export-status", this.element), -1);
            }
            $(".crm-contact-export-keyword-input", this.element).val("");
            util.mnSetter($('.crm-isfirstchar-chekbox', this.element), []);
            util.mnSetter($(".isfirstchar-select-list", this.element), "A")
            $('.crm-contact-export-isfirstchar-warp', this.element).hide();
            $('.crm-contact-export-keyword-warp', this.element).show();
        },

        "destroy": function () {
            var result = ContactExport.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = ContactExport;
});