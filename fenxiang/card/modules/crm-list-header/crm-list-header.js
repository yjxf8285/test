/**
 * 列表页头
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

define(function (require, exports, module) {


    var root = window,
        FS = root.FS;
    var Widget = require('widget');
    var util = require('util');
    var tpl = require('modules/crm-list-header/crm-list-header.html');
////    var tplStyle = require('modules/crm-list-header/crm-list-header.css');
    var SearchBox = require('uilibs/search-box'); //搜索框组件
    var Header = Widget.extend({
        "attrs": {
            "element": null,
            "title": "",
            "searchPlaceholder": "搜索"
        },

        "setup": function () {
            var result = Header.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },
        //初始化
        "_init": function () {
            this.element.html(tpl);
            this._initHtml();
            this._initSearchBox();
            this.setCount();
        },

        "_initHtml": function () {
            $(".crm-list-header-name", this.element).text(this.get("title"));
            $(".crm-list-header-name", this.element).attr("title",this.get("title"));
        },

        "_initSearchBox": function () {
            var self = this;
            var searchBox = new SearchBox({
                "element": $(".crm-list-header-search", self.element),
                "placeholder": self.get("searchPlaceholder")
            });
            searchBox.on('search', function (queryValue) {
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {

                    });
                } else {
                    self.trigger("search", queryValue);
                }
            });
            self.searchBox = searchBox;
        },
        "clearSearch": function () {
            this.searchBox.clear();
        },
        "setTitle": function (title) {
            $(".crm-list-header-name", this.element).text(title);
            $(".crm-list-header-name", this.element).attr("title",title);
        },
        //人数
        "setCount": function (num) {
            var isNum = num || 0;
            if (num) {
                $(".count-text", this.element).show();
                $(".count-num", this.element).text(num);
            } else {
                $(".count-text", this.element).hide();
            }

        },
        "destroy": function () {
            var result = Header.superclass.render.apply(this, arguments);
            this.element.empty();
            return result;
        }
    });
    module.exports = Header;
});