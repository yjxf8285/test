/**
 * 部门同事列表
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        EmployeeList=require('modules/fs-employee/fs-employee-list'),
        tplCommon = require('../circles-common');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var listEl=$('.employee-list',tplEl),
            pagEl=$('.employee-list-pagination',tplEl),
            filterEl=$('.filter',tplEl),
            searchWEl=$('.search-wrap',tplEl),
            searchEl=$('.search-inp',tplEl),    //搜素框
            searchBtnEl=$('.search-btn',tplEl),
            letterWEl=$('.letter-wrapper',tplEl),   //检索字母容器
            workStatusEl=$('.working-status',tplEl),   //工作状态，离职or在职
            workRoleEl=$('.working-role',tplEl);    //用户角色
        var listTotalCountEl=$('.cac_center_tcount',tplEl),
            titleSummaryEl=$('.title-summary',tplEl);   //副标题
        //公共处理
        tplCommon.init(tplEl,tplName);
		var createTitle=function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var circleID=queryParams? queryParams.id:"999999"; //默认请求全部同事
            var circleData=util.getContactDataById(circleID,'g');
            //alert(circleData.memberCount);
            $('.cac_center_tname',tplEl).html(circleData.name);
            //$('.cac_center_tcount',tplEl).html(circleData.memberCount);
            if(circleID=="999999"){
                titleSummaryEl.html('这些是全公司的全部同事，包含和您在相同的部门和不同部门中的同事。');
            }else{
                titleSummaryEl.html('这些是'+circleData.name+'的全部同事。');
            }
        };
        //创建列表
        var employeeList=new EmployeeList({
            "element":listEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "listPath":"/circle/getAllEmployees1",
            "defaultRequestData":function(){
                var letterEl=$('.depw-tabs-aon',letterWEl),
                    letterValue=letterEl.attr('val'),
                    isStop=$('.depw-tabs-aon',workStatusEl).attr('val'),
                    userRole=$('.depw-tabs-aon',workRoleEl).attr('val'),
                    isFirstChar=false,
                    keyword= _.str.trim(searchEl.val());
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var circleID=queryParams? queryParams.id:0; //默认请求全部同事

                if(letterValue!="0"){
                    isFirstChar=true;   //首字母检索
                    keyword= letterValue;
                }
                return {
                    "circleID":circleID,
                    "keyword": keyword,
                    "userRole":userRole,
                    //"isStop":isStop,
                    "isStop":0, //add by 13 at 2014-01-02,只筛选在线员工
                    "isExceptCurrentUser":false, //是否排除当前人,默认不排除当前登录用户
                    "isFirstChar":isFirstChar  //是否首字母检索，当为true时，首字母放到keyword中
                };
            }, //默认请求数据
            "searchOpts":{
                "inputSelector":searchEl,
                "btnSelector":searchBtnEl
            },
            "listCb":function(responseData){    //列表数据请求后的回调
                if(responseData.success){
                    listTotalCountEl.text(responseData.value.totalCount);
                }
            }
        });
        employeeList.loaded=false;   //用于判定是否是第一次加载
        //筛选信息
        filterEl.on('click','a',function(evt){
            var meEl=$(this),
                filterEl=meEl.closest('.filter');
            $('a',filterEl).removeClass('depw-tabs-aon');
            meEl.addClass('depw-tabs-aon');
            //清空输入框
            $('.empty-h',searchWEl).click();
            employeeList.reload();
            evt.preventDefault();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            $('a',letterWEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
            employeeList.reload();
            evt.preventDefault();
        });
        //请求列表，非缓存方式
        employeeList.load();
        createTitle();
        //切换到当前模板后重新加载list
        /*tplEvent.on('switch', function (tplName2, tplEl) {
            if(tplName2==tplName){
                if(employeeList.loaded){
                    employeeList.reload();
                }else{  //如果是第一次加载
                    employeeList.load();
                    employeeList.loaded=true;
                }
				createTitle();
            }
        });*/
    };
});