/**
 * CRM - 机会 - tpl
 *
 * @author liuxiaofan
 * 2014-05-14
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-opportunity-list/crm-opportunity-list');
    var tplName, list, header;
    var isMe = true;
    var employee = util.getCrmData().currentEmp;
    var employeeId=employee.employeeID;
    exports.init = function () {
        var tplEl = exports.tplEl;
        tplName = exports.tplName;
        var currentEmp = util.getCrmData().currentEmp;
        var leftNavEl = $('.crm-list-left-nav', tplEl);

        //左侧菜单高亮
        var _initLeftNav = function () {
            var tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
            //            util.regTplNav($('.tpl-nav-l', tplLeftEl), 'state-active');TODO 手动处理高亮
        };
        //切换人
        var _initSubordinate = function (employee) {
            var employeeNameEl = $('.crm-tpl-l .tpl-inner .crm-list-left-nav .employee-name', tplEl);
            if (!employee) {
                return;
            }
            var subordinate = new Subordinate({
                "element": $(".tpl-salesopportunity-subordinate-wrapper", tplEl),
                "employeeName": employee.name,
                "imageSrc": util.getAvatarLink(employee.profileImage, '2'),
                "canSelect": employee.subEmployees && employee.subEmployees.length > 0
            });

            subordinate.on("selected", function (sub) {
                var name = sub.name;
                var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
                var tagType = queryParams ? queryParams.queryType : 1; //默认打开tagType类型
                employee = sub;
                if (sub.employeeID == currentEmp.employeeID) { //如果当前用户是我自己
                    name = "我";
                    $('.managenav', leftNavEl).show();
                    isMe = true;
                    header.setTitle('我负责或参与的机会');
                    $('.create-opportunity-btn', tplEl).show();//新建
                    employeeId=currentEmp.employeeID;
                } else {
                    isMe = false;
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');

                    $('.managenav', leftNavEl).hide();
                    header.setTitle(sub.name + '负责或参与的机会');
                    $('.create-opportunity-btn', tplEl).hide();//新建
                    $('.update-opportunity-states-un-btn', tplEl).show();//作废
                    $('.update-opportunity-isreview-yes-btn', tplEl).hide();//同意
                    $('.update-opportunity-isreview-no-btn', tplEl).hide();//不同意
                    $('.update-opportunity-states-on-btn', tplEl).hide();//启用
                    $('.update-opportunity-sowner-btn', tplEl).show();//变更
                    header.clearSearch();
                    employeeId=sub.employeeID;

                }
                list && list.refresh({
                    employeeID: employeeId,//员工ID
                    keyword: '',//string，搜索关键字
                    customerID: 0,//int，客户ID
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 1,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    beginSalesAmount: -1,//decimal，预估销售金额下限
                    endSalesAmount: -1,//decimal，预估销售金额上限
                    dealDayType: 0,//int，年度类型，0:自定义;1:本月度;2:下月度;3:本季度;4:下月度;5:本年度;
                    beginDealTime: -1,//long，预估成交时间上限
                    endDealTime: -1,//long，预估成交时间下限
                    beginStageDays: -1,// int，最后销售阶段变化时间上限
                    endStageDays: -1,//int，最后销售阶段变化时间下限
                    salesStageNos: '',// List<int>，销售阶段集合
                    isReview: -1,//int，是否审核过，0：未审核，1,：已审核
                    pageSize: 10,//int，分页大小
                    pageNumber: 1,//int，当前页keyword: string，搜索关键字
                    isOwner: -1,//int，全部 -1,参与 0,负责 1
                    queryType: 1
                });//刷新
                employeeNameEl.text(name);
                list && list.reSetMnselect(); //重置下拉框
                tpl.navRouter.navigate('#opportunities/salesopportunity'); //通过路由清空地址栏参数
                $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');


            });
        };
        //实例化头部
        var _initHeader = function () {
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "我负责或参与的机会",
                "searchPlaceholder": "搜索销售机会"
            });
            header.on("search", function (keyword) {
                list && list.refresh({
                    "keyword": keyword
                });//刷新
            });
        };
        // 点击左侧菜单改变头部标题
        leftNavEl.on('click', 'li a', function (e) {
            //            header.setTitle($(this).text());
        });

        //实例化表格
        var _initList = function () {
            list = new List({
                data: {
                    employeeID: employeeId,//所要查询的合同的归宿人，如果查自己就传本身的id
                    queryType: 2,//int，查询类型，0:全部;1:我的销售机会,2:下属的销售机会;3:关注的销售机会;4:我审核的销售机会(直属下属);5:我和所有下属作废的机会
                    keyword: '',//string，搜索关键字
                    customerID: 0,//int，客户ID
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 1,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    beginSalesAmount: -1,//decimal，预估销售金额下限
                    endSalesAmount: -1,//decimal，预估销售金额上限
                    dealDayType: 0,//int，年度类型，0:自定义;1:本月度;2:下月度;3:本季度;4:下月度;5:本年度;
                    beginDealTime: -1,//long，预估成交时间上限
                    endDealTime: -1,//long，预估成交时间下限
                    beginStageDays: -1,// int，最后销售阶段变化时间上限
                    endStageDays: -1,//int，最后销售阶段变化时间下限
                    salesStageNos: '',// List<int>，销售阶段集合
                    isReview: -1,//int，是否审核过，0：未审核，1,：已审核
                    pageSize: 10,//int，分页大小
                    pageNumber: 1,//int，当前页keyword: string，搜索关键字
                    isOwner: -1//int，全部 -1,参与 0,负责 1
                },
                "warpEl": $(".opportunities-salesopportunity-warp", tplEl),
                "url": "/SalesOpportunity/GetSalesOpportunityList"
            });
            list.load();
        };

        var init = function () {
            _initLeftNav();
            _initSubordinate(employee);
            _initHeader();
            _initList();
        }();
    };
    //监听页面切换事件
    tplEvent.on('switched', function (tplName2, tplEl) {
        var queryParams, tagType, data;

        //如果是当前页面
        if (tplName2 == tplName) {

            queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
            tagType = queryParams ? queryParams.queryType : 1; //默认打开tagType类型

            if (queryParams && queryParams.id) {
                return;
            }

            //左侧菜单高亮手动控制
            switch (tagType) {
                case 3:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
                    break;
                case 1:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
                    break;
                case 2:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(2).addClass('state-active');
                    break;
                case 4:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(3).addClass('state-active');
                    break;
                case 5:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(4).addClass('state-active');
                    break;
            }
            header.setTitle($('.crm-list-left-nav .state-active').text()+util.addListTitle($('.crm-list-left-nav .state-active').text(), '机会', 2));//设置页面头部标题文字
            //清空搜索内容
            header.clearSearch();
            //审核的机会
            if (tagType == 4) {
                $('.isreview-list-warp', tplEl).show();//是否审核下拉
                $('.isowner-list-warp', tplEl).hide();//归属下拉
                $('.update-opportunity-isreview-yes-btn', tplEl).show();//同意
                $('.update-opportunity-isreview-no-btn', tplEl).show();//不同意
                $('.update-opportunity-states-on-btn', tplEl).hide();//启用
                $('.create-opportunity-btn', tplEl).hide();//新建
                $('.update-opportunity-sowner-btn', tplEl).show();//变更
                $('.update-opportunity-states-un-btn', tplEl).hide();//作废
            } else if (tagType == 5) {//作废的机会
                $('.update-opportunity-states-on-btn', tplEl).show();//启用
                $('.update-opportunity-isreview-yes-btn', tplEl).hide();//同意
                $('.update-opportunity-isreview-no-btn', tplEl).hide();//不同意
                $('.update-opportunity-states-un-btn', tplEl).hide();//作废
                $('.create-opportunity-btn', tplEl).hide();//新建
                $('.update-opportunity-sowner-btn', tplEl).hide();//变更
                $('.isreview-list-warp', tplEl).hide();//是否审核下拉
                $('.isowner-list-warp', tplEl).hide();//归属下拉
            } else if (tagType == 3) {//我关注的
                $('.isowner-list-warp', tplEl).hide();
                $('.update-opportunity-states-on-btn', tplEl).hide();//启用
                $('.update-opportunity-isreview-yes-btn', tplEl).hide();//同意
                $('.update-opportunity-isreview-no-btn', tplEl).hide();//不同意
            } else {
                $('.update-opportunity-states-un-btn', tplEl).show();//作废
                if (isMe) {
                    $('.create-opportunity-btn', tplEl).show();//新建
                } else {
                    $('.create-opportunity-btn', tplEl).hide();//新建
                }

                $('.update-opportunity-sowner-btn', tplEl).show();//变更
                $('.update-opportunity-isreview-yes-btn', tplEl).hide();//同意
                $('.update-opportunity-isreview-no-btn', tplEl).hide();//不同意
                $('.update-opportunity-states-on-btn', tplEl).hide();//启用
                $('.isreview-list-warp', tplEl).hide();//是否审核下拉
                $('.isowner-list-warp', tplEl).show();//归属下拉
            }
            /*   data = {
             queryType: parseFloat(tagType),
             keyword: ''//string，搜索关键字(标签名称 模糊匹配)
             };*/
            // 每次都使用默认数据不记录之前的参数了
            data = {
                queryType: parseFloat(tagType),//int，查询类型，0:全部;1:我的销售机会,2:下属的销售机会;3:关注的销售机会;4:我审核的销售机会(直属下属);5:我和所有下属作废的机会
                keyword: '',//string，搜索关键字
                customerID: 0,//int，客户ID
                tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                sortType: 1,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                beginSalesAmount: -1,//decimal，预估销售金额下限
                endSalesAmount: -1,//decimal，预估销售金额上限
                dealDayType: 0,//int，年度类型，0:自定义;1:本月度;2:下月度;3:本季度;4:下月度;5:本年度;
                beginDealTime: -1,//long，预估成交时间上限
                endDealTime: -1,//long，预估成交时间下限
                beginStageDays: -1,// int，最后销售阶段变化时间上限
                endStageDays: -1,//int，最后销售阶段变化时间下限
                salesStageNos: '',// List<int>，销售阶段集合
                isReview: -1,//int，是否审核过，0：未审核，1,：已审核
                pageSize: 10,//int，分页大小
                pageNumber: 1,//int，当前页keyword: string，搜索关键字
                isOwner: -1//int，全部 -1,参与 0,负责 1
            };
            list && list.refresh(data);//刷新表格
            list && list.reSetMnselect(); //重置下拉框

        }
    });

});