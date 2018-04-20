/**
 * 网盘
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
    var tplCommon = require('./entnetworkdisk-common'),
        WebDisk = require('modules/webdisk/webdisk');
    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;
        var diskEl = $('.web-disk', tplEl),
            tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var webdisk = new WebDisk({
            "element": diskEl, //容器
            "listPath": "/NetDisk/GetNDDirectoryInfos", //网盘请求列表默认地址
            "searchPath":"/NetDisk/SearchFiles" //搜索列表请求地址
        });

        tplCommon.init(tplEl,tplName);
        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams,
                action,
                employeeId,
                employeeName,
                dirId,
                selectedId;
            if(tplName2==tplName){
                queryParams = util.getTplQueryParams(); //传给模板的参数
                action = queryParams ? queryParams.action : ""; //获取FeedID
                if(action.length>0){    //带有动作的页面跳转
                    if(action=="view"){     //查看某人所有文件
                        employeeId=queryParams.empid;
                        employeeName=decodeURIComponent(queryParams.empname);
                        webdisk.load({
                            "employeeID": employeeId,
                            "keyword": "",
                            "pageSize": 10000,
                            "pageNumber": 1
                        }, '/NetDisk/GetOneEmployeeSendFiles', function(responseData) {
                            var elEl=webdisk.element,
                                navWEl = $('.disk-breadcrumbs', elEl);
                            if (responseData.success) {
                                //设置导航
                                navWEl.html('&nbsp;/&nbsp;<span class="nav-item">' + employeeName + '的上传文件</span>');
                            }
                            //禁用新建、上传、删除功能键
                            $('.topmenu-fn-new,.topmenu-fn-upload,.topmenu-fn-del', elEl).addClass('disable');
                            //设置网盘搜索用户状态
                            webdisk._stateAtemployee = true;
                        });
                    }else if(action=="fixed"){  //定位文件所属位置
                        dirId=queryParams.dirid;
                        selectedId=queryParams.selectedid;
                        webdisk.load({
                            "directoryID": dirId
                        }, '', function() {
                            var elEl=webdisk.element;
                            //选中对应的文件
                            webdisk.trHasCur($('[dataid="'+selectedId+'"]',elEl).filter('[datatype="file"]').closest('tr'));
                            //设置网盘搜索用户状态为false
                            webdisk._stateAtemployee = false;
                        });
                    }
                    //高亮"纷享网盘导航"
                    $('.tpl-nav-lb',tplLeftEl).eq(0).addClass('depw-menu-aon');
                }else{  //普通页面跳转
                    if(firstRender){
                        webdisk.load();
                        firstRender=false;
                    }else{
                        webdisk.reset();
                    }
                }
            }
        });
    };
});