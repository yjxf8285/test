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
            titleSummaryEl=$('.title-summary',tplEl),   //副标题
            groupStarEl = $('.star-big', tplEl); // 部门星标
        //公共处理
        tplCommon.init(tplEl,tplName);
		var createTitle=function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var circleID=queryParams? queryParams.id:"999999"; //默认请求全部同事
            var circleData=util.getContactDataById(circleID,'g');
            //alert(circleData.memberCount);
            $('.cac_center_tname',tplEl).html(circleData?circleData.name:"已停用");
            //$('.cac_center_tcount',tplEl).html(circleData.memberCount);
            if(circleID=="999999"){
                groupStarEl.hide();
                titleSummaryEl.html('这些是全公司的全部同事，包含和您在相同的部门和不同部门中的同事。');
            }else{
                if(util.isAsterisk(circleID,'g')){
                    groupStarEl.attr('data-groupid', circleID).addClass('j-starred j-group').addClass('star-big-active').attr('title','取消部门星标');
                }else{
                    groupStarEl.attr('data-groupid', circleID).addClass('j-starred j-group').removeClass('star-big-active').attr('title','添加部门星标');
                }
                titleSummaryEl.html('这些是'+(circleData?circleData.name:"已停用")+'的全部同事。');
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
                    "isStop":0, //add by 13 at 2014-01-02,只筛选在职员工
                    "isExceptCurrentUser":false, //是否排除当前人,需求变更为包含当前登录用户
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
            employeeList.empty();//先清空
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


        // 添加星标时间
        tplEl.on('click', '.j-starred', function(evt) {

            var isAsterisk=false;
            var $this = $(this),
                activeCls = $this[0].className.split(' ')[0] + '-active';
            if ($this.hasClass(activeCls)) {
                isAsterisk=false;
            } else {
                isAsterisk=true;
            }
            if($this.is('.j-group')){
                util.api({
                    "url": '/Employee/SetCircleAsterisk', //添加星标
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        circleID: $this.attr('data-groupid'),// int，部门ID
                        isAsterisk: isAsterisk// bool，是否星标(设置:true;取消:false)
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            if (isAsterisk) {
                                $this.addClass(activeCls).attr('title','取消部门星标');
                            } else {
                                $this.removeClass(activeCls).attr('title','添加部门星标');
                            }
                        }
                    }
                });
            }else{
                util.api({
                    "url": '/Employee/SetEmployeeAsterisk', //添加星标
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        employeeID: $this.attr('data-employeeid'),// int，员工ID
                        isAsterisk: isAsterisk// bool，是否星标(设置:true;取消:false)
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            if (isAsterisk) {
                                $this.addClass(activeCls).attr('title','取消同事星标');
                            } else {
                                $this.removeClass(activeCls).attr('title','添加同事星标');
                            }
                        }
                    }
                });
            }


        });
    };
});