/**
 * 待办列表
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent = tpl.event;
    var util=require('util'),
        WorktodoList=require('modules/fs-worktodo/worktodo-list'),
        tplCommon=require('../worktodo-common');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var listEl=$('.worktodo-list',tplEl);
        //设置公共部分
        tplCommon.init(tplEl,tplName);

        var worktodoList=new WorktodoList({
            "element":listEl, //list selector
            "pagSelector":false, //pagination selector
            "listPath":"/worktodolist/getWorkToDoListByID",
            "defaultRequestData":function(){
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var workToDoListID=queryParams? queryParams.id:0; //默认待办id为0
                return {
                    "workToDoListID":workToDoListID
                };
            }
        });
        //切换到当前模板后重新加载list
        tplEvent.on('switch', function (tplName2, tplEl) {
            if(tplName2==tplName){
                if(worktodoList.loaded){
                    worktodoList.reload();
                }else{  //如果是第一次加载
                    worktodoList.load();
                    worktodoList.loaded=true;
                }
            }
        });
        //注册子路由
        util.tplRouterReg('#worktodo');
    };
});