/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var moment = require('moment');
    exports.init = function() {
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var networkdiskmanageTbodyEl = $('.networkdiskmanage-liketable .liketable-body', tplEl);
        var networkdiskmanageFooterEl = $('.networkdiskmanage-liketable .liketable-footer', tplEl);
        /**
         * 格式化数据
         */
        var formatData = function(data) {
            var trStr = '';
            var icoLock = '';
            var directorys = data.directorys || [];
            _.each(directorys, function(directory) {
                var isPublic = directory.isPublic;
                var isReadOnly = directory.isReadOnly;
                var directoryName = directory.name;
                var nDDirectoryID = directory.nDDirectoryID;
                var directorySpace = util.getFileSize(directory.directorySpace) || '0 B';
                var creatorName = directory.creator.name;
                var createTime = directory.createTime;
                if (isReadOnly) {
                    icoLock = 'lock';
                }else{
                    icoLock='';
                }
                var formatTime = moment.unix(createTime).format('YYYY年MMMDD日 HH:mm');
                trStr += '<div class="liketable-tr fn-clear" data-dirid="'+nDDirectoryID+'"><div class="liketable-td first">&nbsp;</div><div class="liketable-td font-hgray file-name"><span class="ico ' + icoLock + '"></span>' + directoryName + '</div><div class="liketable-td size">' + directorySpace + '</div><div class="liketable-td name" >' + creatorName + '</div><div class="liketable-td data">' + formatTime + '</div><div class="liketable-td del"> <a href="javascript:;" class="j-del">删除</a></div></div>';
            });
            return trStr;
        };
        /**
         * 获取网盘目录
         */
        var getNDDirectoryInfos = function() {
            util.api({
                "url": '/Management/GetNDDirectoryInfos',
                "type": 'get',
                "dataType": 'json',
                "data": {},
                "success": function(responseData) {
                    var data = responseData.value || {};
                    var len = data.directorys.length || 0;
                    if (responseData.success) {
                        networkdiskmanageTbodyEl.html(formatData(data)); //渲染身体
                        networkdiskmanageFooterEl.text('状态：文件夹总数' + len + '个'); //渲染尾部
                    }
                }
            });
        };
        getNDDirectoryInfos(); //执行请求
        /**
         * 删除按钮的事件
         */
        var delBtn = $('.j-del', networkdiskmanageTbodyEl);
        networkdiskmanageTbodyEl.on('click', '.j-del', function() {
            var trEl = $(this).closest('.liketable-tr');
            var dirid = trEl.data('dirid');
            util.confirm('是否确定删除该文件夹？删除文件夹同时删除文件夹下所有内容。', '提示', function() {
                /**
                 * 删除网盘目录+目录下文件
                 */
                util.api({
                    "url": '/Management/DeleteNDDirectory',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "directoryID":dirid
                    },
                    "success": function(responseData) {
                        if (responseData.success) {
                            trEl.remove();
                        }
                    }
                });
            });
        });

        /**
         * tr点击变色
         */
        var tableEl = $('.networkdiskmanage-liketable', tplEl);
        tableEl.on('click', '.liketable-body .liketable-tr', function() {
            var thisEl = $(this);
            $('.liketable-body .liketable-tr', tableEl).removeClass('cur');
            thisEl.addClass('cur');
        });

        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');
    };
});