/**
 * fs 选择城市
 * Created by liuxf on 08-14-0014.
 */

define(function (require, exports, module) {
    var tpl = require('modules/fs-select-city/fs-select-city.html');
//    var css = require('modules/fs-select-city/fs-select-city.css');
    var util = require('util');
    var Tabs = require('tabs');
    var Dialog = require("dialog");
    var FsSelectCity = Dialog.extend({
        "attrs": {
            "content": tpl,
            "className": "fs-select-city-dialog",
            "zIndex": 1001,
            "width": 480
        },
        "events": {
            'click .city-list .ui-tab-panel a': 'selectaCity',
            'click .clear-btn': 'clearCity'
        },
        setup: function () {
            var result = FsSelectCity.superclass.setup.apply(this, arguments);
            var that = this;
            //获取城市列表的数据
            $.ajax({
                "url": FS.BASE_PATH + '/html/card/data/citylist.json',
                "type": 'get',
                "dataType": 'json',
                "success": function (responseData) {
                    that.cityListStr(responseData);//拼HTML
                    that.render();//提前把DOM准备好
                }
            });
            return result;
        },
        "render": function () {
            var result = FsSelectCity.superclass.render.apply(this, arguments);
            var elEl = this.element;
            var citylistEl = $('.city-list', elEl);
            var cityListStr = this.get('cityListStr');
            citylistEl.html(cityListStr);
            return result;
        },
        setPlugins: function () {
            var elEl = this.element;
            var tabsEl = $('.citylist-tabs', elEl);
            if (!this.cityTabs) {
                this.cityTabs = new Tabs({
                    "element": tabsEl,
                    "triggers": $('.ui-tab-item', tabsEl),
                    "panels": $('.ui-tab-panel', tabsEl),
                    "activeIndex": 0,
                    "triggerBgTop": 2,   //手动设置triggerBg的top，如果不设置，默认值是导航top-2
                    "activeTriggerClass": "ui-tab-item-current",
                    "triggerType": 'click'
                }).render();
            }
        },
        cityListStr: function (responseData) {
            var cityListStr = '';
            var hotCityStr = '';
            var keyListStr = '';
            _.each(responseData, function (uItem, keyName) {
                //热门城市因为格式不同需要提出来处理
                if (keyName != 'hotCity') {
                    var abcdStr = '';
                    _.each(uItem, function (mItem, keyName) {
                        var subStr = '';
                        _.each(mItem, function (item) {
                            subStr += '<li><a href="javascript:;">' + item.Name + '</a></li>';
                        });
                        if(mItem){
                        abcdStr += '<div><div class="l">' + keyName.substring(keyName.length - 1, keyName.length) + '</div><div class="r"><ul class="fn-clear">' + subStr + '</ul></div></div>';
                        }
                    });
                    keyListStr += '<div class="ui-tab-panel">' + abcdStr + '</div>';
                } else {
                    _.each(uItem, function (item) {
                        hotCityStr += '<li><a href="javascript:;">' + item.Name + '</a></li>';
                    });
                }
            });
            cityListStr = '<ul class="ui-tab-panel fn-clear">' + hotCityStr + '</ul>' + keyListStr;
            this.set('cityListStr', cityListStr);
        },
        "show": function (inputEl) {
            var result = FsSelectCity.superclass.show.apply(this, arguments);
            inputEl && this.set('inputEl', $(inputEl));
            this.setPlugins();
            return result;
        },
        "hide": function () {
            var result = FsSelectCity.superclass.hide.apply(this, arguments);
            this.cityTabs.switchTo(0);
            $('.ui-tab-trigger-bg', this.element).width('26px');//修正背景条宽度
            return result;
        },
        selectaCity: function (e) {
            var meEl = $(e.currentTarget);
            var cityName = meEl.text();
            var inputEl = this.get('inputEl');
            inputEl && inputEl.text(cityName);
            inputEl && (inputEl.trigger('selected'));
            this.hide();
        },
        clearCity:function(){
            var inputEl = this.get('inputEl');
            inputEl && inputEl.text('');
            inputEl && (inputEl.trigger('clear'));
            this.hide();
        }
    });
    module.exports = FsSelectCity;
});
