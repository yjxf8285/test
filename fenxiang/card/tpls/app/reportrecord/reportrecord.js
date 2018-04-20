define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        list = tpl.list;

    var util = require('util');
    var leftNav = require('modules/app-report-leftnav/app-report-leftnav');
    var RecordList = require('modules/app-reportrecord/app-reportrecord-list/app-reportrecord-list');
    var RecordInfo = require('modules/app-reportrecord/app-reportrecord-info/app-reportrecord-info');

    /**
     * 页面载入执行函数
     */
    exports.init = function () {
        var tplEl = exports.tplEl;
        // 设置左侧导航
        leftNav.init($('.tpl-l', tplEl));

        var $wrapperEl = $('.reportrecord-wrapper', tplEl),
            recordList = new RecordList({'wrapperEl': $wrapperEl}),
            recordInfo = new RecordInfo({'wrapperEl': $wrapperEl});

        recordList.render();
        recordList.on('view', function (tableId, tableName) {
            recordList.hide();
            recordInfo.render(tableId, tableName);
        });
        recordInfo.on('view', function () {
            recordList.render();
        });
        tplEl.on('click', '.leftnav-reportrecord-list', function () {
            recordList.render();
        });
    }
});
