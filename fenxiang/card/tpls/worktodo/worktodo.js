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
    var WorktodoList=require('modules/fs-worktodo/worktodo-list'),
        worktodo=require('modules/fs-worktodo/fs-worktodo'),
        Dialog=require('dialog'),
        publish = require('modules/publish/publish.js'),
        tplCommon=require('./worktodo-common'),
        util=require('util');
    //创建待办弹框
    var NewWorktodoDialog=worktodo.NewWorktodoDialog;

    var SelectBar = publish.selectBar,
        AtInput=publish.atInput;
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName,
            filterEl=$('.filter',tplEl),
            worktodoListEl=$('.worktodo-list',tplEl),
            pagEl=$('.worktodo-list-pagination',tplEl),
            addWorktodoBtnEl=$('.add-worktodo-btn',tplEl);  //新建待办按钮
        var searchEl = $('.search-inp', filterEl),
            searchBtnEl = $('.search-btn', filterEl);
        //设置公共部分
        tplCommon.init(tplEl,tplName);

        //联系人数据
        var contactData = util.getContactData(),
            userData=contactData["u"];

        var worktodoList=new WorktodoList({
            "element":worktodoListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "defaultRequestData":function(){
                return {
                    "isImportant":$('.important',filterEl).filter('.depw-tabs-aon').attr('val'),
                    "isCompleted":$('.complete',filterEl).filter('.depw-tabs-aon').attr('val'),
                    "keyword": _.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
            //默认请求数据
        });

        var addDialog=new NewWorktodoDialog({
            "trigger":addWorktodoBtnEl,
            "successCb":function(responseData,requestData){
                if(responseData.success){
                    //如果选中同事中有当前登录用户，刷新当前列表
                    if(_.find(requestData["employeeIDs"],function(id){
                        return id==userData.id;
                    })){
                        //向列表中插入一条新数据
                        worktodoList.prependNewTask(responseData.value.workToDoListID);
                    }
                    this.hide();
                }
            }
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            worktodoList.reload();
            evt.preventDefault();
        });
        //筛选
        filterEl.on('click','.important,.complete',function(){
            var meEl=$(this);
            if(meEl.hasClass('important')){
                $('.important',filterEl).removeClass('depw-tabs-aon');
            }else{
                $('.complete',filterEl).removeClass('depw-tabs-aon');
            }
            meEl.addClass('depw-tabs-aon');
            //重新请求
            worktodoList.reload();
        });
        worktodoList.load();
        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //刷新右侧列表
                if(!firstRender){
                    worktodoList.reload();
                }else{
                    firstRender=false;
                }

            }
        });
    };
});