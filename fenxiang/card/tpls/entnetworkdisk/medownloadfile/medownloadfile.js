/**
 * 网盘-我下载的文件
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../entnetworkdisk-common'),
        WebDisk = require('modules/webdisk/webdisk');
    //注册路由
    util.tplRouterReg('#entnetworkdisk/=/:action-:value/:empid-:value/:empname-:value');
    util.tplRouterReg('#entnetworkdisk/=/:action-:value/:dirid-:value/:selectedid-:value');
    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;
        var diskEl = $('.web-disk', tplEl);
        var webdisk = new WebDisk({
            "element": diskEl, //容器
            "listPath": "/NetDisk/GetDownloadFiles", //网盘请求列表默认地址
            "searchPath":"/NetDisk/GetDownloadFiles",
            "defaultListRequestData":{
                "pageSize":10000,
                "pageNumber":1,
                "keyword":""
            },
            "rootNode": { //默认打开根节点信息
                "name": '我下载的文件',
                "nDDirectoryID": 0,
                "isReadOnly":true,
                "parentID": 0
            },
            "showEmpFileOnly":false, //可同时显示"查看某人文件"和"打开文件位置"右键按钮
            "contextActions":[{
                "selector":".rightmenu-fn-viewwho",
                "handler":function(evt,selectedData){
                    var linkEl=$(this);
                    var creator = selectedData.creator;
                    //action==view表示查看"某人"所属文件
                    linkEl.attr('href','#entnetworkdisk/=/action-view/empid-'+creator.employeeID+'/empname-'+encodeURIComponent(creator.name));
                }
            },{
                "selector":".rightmenu-fn-view-dir",
                "handler":function(evt,selectedData){
                    var linkEl=$(this);
                    //action==fixed表示定位文件位置
                    linkEl.attr('href','#entnetworkdisk/=/action-fixed/dirid-'+selectedData.parentID+'/selectedid-'+selectedData.nDFileID);
                }
            }]
        });
        tplCommon.init(tplEl,tplName);
        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                if(firstRender){
                    webdisk.load();
                    firstRender=false;
                }else{
                    webdisk.reset();
                }
            }
        });
    };
});