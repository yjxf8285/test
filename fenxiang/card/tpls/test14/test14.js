/**
 * crm测试页
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        Dialog = require('dialog'),
        SearchBox = require('uilibs/search-box');
    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        $('.getter-btn', tplEl).click(function () {
            alert(util.mnGetter($('.mn-checkbox-box', tplEl)));
            alert(util.mnGetter($('.mn-radio-box', tplEl)));
            alert(util.mnGetter($('.mn-select-box', tplEl)));
        });
        $('.setter-btn', tplEl).click(function () {
            util.mnSetter($('.mn-checkbox-box', tplEl), 1);
            util.mnSetter($('.mn-radio-box', tplEl), 2);
            util.mnSetter($('.mn-select-box', tplEl), 2);
        });
        $('.disable-btn', tplEl).click(function () {
            util.mnDisable($('.mn-checkbox-box', tplEl));
            util.mnDisable($('.mn-radio-box', tplEl));
            util.mnDisable($('.mn-select-box', tplEl));
        });
        $('.enable-btn', tplEl).click(function () {
            util.mnEnable($('.mn-checkbox-box', tplEl));
            util.mnEnable($('.mn-radio-box', tplEl));
            util.mnEnable($('.mn-select-box', tplEl));
        });
        var demoDialog = new Dialog({
            "content": tplEl.find('.demo-dialog-tpl').html(),
            "className": "demo-dialog",
            "width": 600,
            "height": 500
        });

        //初始化一个搜索框
        var searchBox = new SearchBox({
            "element": $('.search-box', tplEl),
            "placeholder": "搜索框"
        });
        searchBox.on('search', function (queryValue) {
            alert(queryValue);
        });


        $('.show-dialog-btn', tplEl).click(function () {
            demoDialog.show();
        });
        //重新设置select的数据源(重新设置options)
        $('.update-select-model-btn', tplEl).click(function () {
            util.mnSelect($('.mn-select-box', tplEl), 'syncModel', [
                {
                    "text": "test14",
                    "value": "14"
                },
                {
                    "text": "test15",
                    "value": "15"
                }
            ]);
        });
        //重新设置select的数据源(重新设置options)
        $('.update-select-model-btn', tplEl).click(function () {
            util.mnSelect($('.mn-select-box', tplEl), 'syncModel', [
                {
                    "text": "test14",
                    "value": "14"
                },
                {
                    "text": "test15",
                    "value": "15"
                }
            ]);
        });
        //添加一个select option
        $('.add-select-model-btn', tplEl).click(function () {
            util.mnSelect($('.mn-select-box', tplEl), 'addOption', {
                "text": "test16",
                "value": "16"
            });
        });
        //删掉一个select option
        $('.remove-select-model-btn', tplEl).click(function () {
            util.mnSelect($('.mn-select-box', tplEl), 'removeOption', 1);  //1表示option的索引
        });
        //绑定下拉框select事件
        $('.bind-select-change-event', tplEl).click(function () {
            util.mnEvent($('.mn-select-box', tplEl), 'change', function (val, text) {
                alert(val + '-' + text);
            });
        });

        $('.reset-btn', tplEl).click(function () {
            $('.mn-checkbox-box,.mn-radio-box,.mn-select-box', tplEl).each(function () {
                util.mnReset(this);
            });

        });
        //alert弹框
        $('.open-alert-btn', tplEl).click(function () {
            util.alert('.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box');
        });
        $('.open-confirm-btn', tplEl).click(function () {
            util.confirm('.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box.mn-checkbox-box,.mn-radio-box,.mn-select-box', 'title');
        });

        /**
         * fs选客户的弹框
         */
        var FsSelectContact = require('modules/fs-select-contact/fs-select-contact');
        var fsc = new FsSelectContact({

        });
        tplEl.on('click', '.open-select-customer-btn', function () {
            fsc.show();
        });
        fsc.on('selected', function (data) {
            console.info(data)
        });

        /**
         * fs选城市的弹框
         */
        var FsSelectCity = require('modules/fs-select-city/fs-select-city');
        var sCity = new FsSelectCity();
        tplEl.on('click', '.open-select-city-btn', function () {
            sCity.show($('.ui-search-field'));
        });
        sCity.on('selected', function (cityName) {
            console.info(cityName);
            console.info(cityName);
            /*456*/
        });

    };

});