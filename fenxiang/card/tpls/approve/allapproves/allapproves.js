/**
 * Approve 人事审批管理
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        Dialog=require('dialog'),
        FeedList=require('modules/feed-list/feed-list'),
        publish=require('modules/publish/publish'),
        tplCommon = require('../approve-common');

    var DateSelect=publish.dateSelect,
        SelectBar=publish.selectBar,
        SearchInput=publish.SearchInput,
        AllApproveValid=tplCommon.AllApproveValid,
        MonthWorkDialog=tplCommon.MonthWorkDialog,
        CompDialog=tplCommon.CompDialog;

    var contactData=util.getContactData();

    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var listEl=$('.feed-list',tplEl),
            searchBarEl=$('.search-bar',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            filterEl=$('.tpl-filter',tplEl),
            approveTypeEl=$('.approve-type',filterEl),
            queryEl=$('.query',filterEl),   //搜索框
            sendFilterEl=$('.send-field',filterEl),
            sendStartDateEl=$('.start-date',sendFilterEl),
            sendEndDateEl=$('.end-date',sendFilterEl),
            approveFilterEl=$('.approve-field',filterEl),
            approveStartDateEl=$('.start-date',approveFilterEl),
            approveEndDateEl=$('.end-date',approveFilterEl),
            rangeEl=$('.range-sb',filterEl),    //同事筛选范围
            sysNoEl=$('.sys-no',filterEl),
            subEl=$('.f-sub',filterEl), //查询按钮
            exportMonthEl=$('.export-month-l',tplEl),   //月度考勤统计
            exportApproveEl=$('.export-approve-l',tplEl), //汇总统计
            exportLeaveEl=$('.export-leave-l',tplEl), //导出请假单汇总统计
            exportApproveBaoxiaoEl=$('.export-approve-baoxiao-l',tplEl), //报销统计
            exportApproveTripEl=$('.export-approve-trip-l',tplEl), //差旅统计
            exportApproveLoanEl=$('.export-approve-loan-l',tplEl);   //借款统计

        //公共处理
        tplCommon.init(tplEl,tplName);
        //组件初始化
        var sendSd=new DateSelect({
            "element": sendStartDateEl,
            "placeholder": "选择日期"
        }),sendEd=new DateSelect({
            "element": sendEndDateEl,
            "placeholder": "选择日期"
        }),approveSd=new DateSelect({
            "element": approveStartDateEl,
            "placeholder": "选择日期"
        }),approveEd=new DateSelect({
            "element": approveEndDateEl,
            "placeholder": "选择日期"
        }),rangeSb=new SelectBar({
            "element": rangeEl,
            "data": [{
                "title": "同事",
                "type": "p",
                "list": contactData["p"]
            },{
                "title": "部门",
                "type": "g",
                "list": contactData["g"]
            }],
            "title": "请选择同事范围",
            "acInitData":util.getPublishRange(),
            "autoCompleteTitle": "请输入姓名或拼音"
        }),searchField=new SearchInput({
            "element":queryEl
        });
        //清空field
        filterEl.on('click','.clear-h',function(evt){
            var meEl=$(this),
                fieldEl=meEl.closest('.f-field');
            if(fieldEl.hasClass('send-field')){
                sendSd.clear();
                sendEd.clear();
            }
            if(fieldEl.hasClass('approve-field')){
                approveSd.clear();
                approveEd.clear();
            }
            if(fieldEl.hasClass('sys-no-field')){
                sysNoEl.val("");
            }
            evt.preventDefault();
        }).on('click','.approve-type',function(evt){
            approveTypeEl.removeClass('depw-tabs-aon');
            $(this).addClass('depw-tabs-aon');
            evt.preventDefault();
        });
        subEl.click(function(evt){
            if(isValid()){
                feedList.pagination.reset();
                feedList.reload();
            }
        });
        searchBarEl.on('click','.return-back-l',function(evt){
            clear();
            searchBarEl.hide();
            feedList.reload();
            evt.preventDefault();
        });
        var isValid=function(){
            var sysNo=_.str.trim(sysNoEl.val());
            if(sysNo.length>0){
                if(isNaN(parseInt(sysNo))){
                    util.alert("请输入合法的系统编号");
                    return false;
                }
            }
            return true;
        };
        var getRequestData=function(){
            var approveType=approveTypeEl.filter('.depw-tabs-aon').attr('approvetype');
            var sbData=rangeSb.getSelectedData();
            var sendSdValue=sendSd.getValue(true),
                sendEdValue=sendEd.getValue(true),
                approveSdValue=approveSd.getValue(true),
                approveEdValue=approveEd.getValue(true);
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var aType = queryParams ? queryParams.atype : 0; //获取atype
            aType=parseInt(aType);
            if(aType==1){   //人事approve type==2
                approveType=2;
            }
            return {
                "feedId": parseInt(_.str.trim(sysNoEl.val()))||0,
                "approveType":approveType,
                "circleIds": (sbData['g']||[]).join(','),
                "employeeIds":(sbData['p']||[]).join(','),
                "sendApprovalBeginTime":sendSdValue?sendSdValue.unix():0,
                "sendApprovalEndTime":sendEdValue?sendEdValue.add('days', 1).subtract('seconds', 1).unix():0,
                "replyApprovalBeginTime":approveSdValue?approveSdValue.unix():0,
                "replyApprovalEndTime":approveEdValue?approveEdValue.add('days', 1).subtract('seconds', 1).unix():0,
                "keyword":searchField.getValue()
            };
        };
        var isInSearchModel=function(requestData){
            if(requestData["circleIds"].length==0&&requestData["employeeIds"].length==0&&requestData["sendApprovalBeginTime"]==0&&requestData["sendApprovalEndTime"]==0&&requestData["replyApprovalBeginTime"]==0&&requestData["replyApprovalEndTime"]==0&&requestData["keyword"].length==0){
                return false;
            }
            return true;
        };
        var clear=function(){
            rangeSb.removeAllItem();
            approveTypeEl.removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
            //关键词清理
            searchField.clear();
            //调用其他field清理
            $('.clear-h',filterEl).click();
            //feedlist清理
            feedList.empty();
            feedList.pagination.hide();
        };

        var feedList=new FeedList({
            "element":listEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":20,
                "visiblePageNums":7
            },
            "listPath":"/FeedApprove/GetApprovalsForApproveManagement",
            "defaultRequestData":function(){
                return getRequestData();
            },
            "listSuccessCb":function(responseData,requestData){
                var totalCount;
                if(responseData.success){
                    totalCount=responseData.value.totalCount;
                    $('.result-num',searchBarEl).text(totalCount);
                    if(isInSearchModel(requestData)){
                        searchBarEl.show();
                    }else{
                        searchBarEl.hide();
                    }
                }
            },
            "listEmptyText":"没有审批"
        });
        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        //密码验证
        var allApproveValid=new AllApproveValid({
            "successCb":function(responseData){
                if(responseData.success){
                    //刷新主列表
                    if(firstRender){
                        feedList.load();
                        firstRender=false;
                    }else{
                        feedList.reload();
                    }
                }
            }
        });
        //导出月度考勤统计
        var exportMonthDialog=new MonthWorkDialog();
        exportMonthEl.click(function(evt){
            exportMonthDialog.show();
            evt.preventDefault();
        });
        //导出汇总统计
        var compDialog=new CompDialog();
        exportApproveEl.click(function(evt){
            compDialog.show({
            	title: '审批汇总统计',
            	type: 0,
            	url: '/FeedApprove/ExportApprovalSummary'
            });
            evt.preventDefault();
        });
        // 导出请假单汇总统计
        exportLeaveEl.click(function(evt){
            compDialog.show({
            	title: '请假单汇总统计',
                type: 6,
            	url: '/FeedApprove/ExportStaffLeaveSummary' 
            });
            evt.preventDefault();
        });        
        exportApproveBaoxiaoEl.click(function(evt){
            compDialog.show({
            	title: '报销单汇总统计',
            	type: 3,
            	url: '/FeedApprove/ExportReimbursedSummary'
            });
            evt.preventDefault();
        });
        exportApproveTripEl.click(function(evt){
            compDialog.show({
            	title: '差旅单汇总统计',
            	type: 4,
            	url: '/FeedApprove/ExportTravelSummary'
            });
            evt.preventDefault();
        });
        exportApproveLoanEl.click(function(evt){
            compDialog.show({
            	title: '借款单汇总统计',
            	type: 5,
            	url: '/FeedApprove/ExportBorrowApplicationSummary'
            });
            evt.preventDefault();
        });

        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                var queryParams = util.getTplQueryParams(); //传给模板的参数
                var aType = queryParams ? queryParams.atype : 0; //获取atype
                var functionPermissions;
                aType=parseInt(aType);
                if(aType==0){   //财务管理
                    $('.staffing-title',tplEl).hide();
                    $('.finance-title',tplEl).show();
                    $('.approve-type-field',tplEl).show();
                    $('.export-approve-field',tplEl).show();
                    allApproveValid.set('defaultRequestData',function(){
                        return {
                            "functionNo":3
                        };
                    });
                    $('.help-readme .cw-text',tplEl).show();
                    $('.help-readme .rs-test',tplEl).hide();
                }else if(aType==1){  //人事管理
                    $('.staffing-title',tplEl).show();
                    $('.finance-title',tplEl).hide();
                    $('.approve-type-field',tplEl).hide();
                    $('.export-approve-field',tplEl).hide();
                    allApproveValid.set('defaultRequestData',function(){
                        return {
                            "functionNo":4
                        };
                    });
                    $('.help-readme .cw-text',tplEl).hide();
                    $('.help-readme .rs-test',tplEl).show();
                }
                //如果权限和请求地址不匹配，修正跳转地址
                functionPermissions=contactData["u"].functionPermissions;
                if(_.some(functionPermissions,function(permission){
                    return permission.value==3;
                })){   //先判断财务管理
                    tpl.navRouter.navigate('#approve/allapproves/=/atype-0', {
                        trigger: true
                    });
                }else{
                    //在不是财务管理的情况下再判断是否是人事管理员
                    if(_.some(functionPermissions,function(permission){
                        return permission.value==4;
                    })){
                        tpl.navRouter.navigate('#approve/allapproves/=/atype-1', {
                            trigger: true
                        });
                    }else{
                        tpl.navRouter.navigate('#stream', {
                            trigger: true
                        });
                    }
                }
                allApproveValid.show();
            }else{
                clear();
            }
        });
    };
});