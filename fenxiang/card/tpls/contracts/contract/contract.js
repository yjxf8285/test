/**
 * CRM - 合同 - tpl
 *
 * @author liuxiaofan
 * 2014-05-13
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-contract-list/crm-contract-list');
    var tplName, list, header;
    exports.init = function () {
        var tplEl = exports.tplEl;
        tplName = exports.tplName;

        var currentEmp = util.getCrmData().currentEmp;
        var employee = util.getCrmData().currentEmp;

        //切换人
        var _initSubordinate = function (employee) {
            var employeeNameEl = $('.crm-tpl-l .tpl-inner .crm-list-left-nav .employee-name', tplEl);
            if (!employee) {
                return;
            }
            var subordinate = new Subordinate({
                "element": $(".tpl-marketing-subordinate-wrapper", tplEl),
                "employeeName": employee.name,
                "imageSrc": util.getAvatarLink(employee.profileImage, '2'),
                "canSelect": employee.subEmployees && employee.subEmployees.length > 0
            });

            subordinate.on("selected", function (sub) {
                var name = sub.name;
                employee = sub;
                if (sub.employeeID == currentEmp.employeeID) {
                    name = "我";
                    $('.create-contract-btn', tplEl).show();
                    header.setTitle('我负责或参与的合同');
                } else {
                    name = sub.name;
                    $('.create-contract-btn', tplEl).hide();
                    header.setTitle(sub.name + '负责或参与的合同');
                }
                employeeNameEl.text(name);
                header.clearSearch();
//                list.resetQueryCondition();
                list && list.refresh({
                    employeeID: sub.employeeID,//员工ID
                    queryType: 2,//int，查询类型 1:全部合同；2：负责或参与的合同；3：下属的合同;4:关注的合同
                    keyword: '',//string，搜索关键字
                    states: 0,//int，合同状态：全部= 0；执行前= 1；执行中= 2；结束= 3；意外终止= 4
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    pageSize: 10,//int，分页大小
                    pageNumber: 1,//int，当前页keyword: string，搜索关键字
                    endDayType: 0, //init
                    deadlineBeginTime: -1,//long，预估成交时间上限
                    deadlineEndTime: -1,//long，预估成交时间下限
                    isOwner: -1//int，类型：全部=-1;参与=0;负责=1;

                });//刷新
                list && list.reSetMnselect(); //重置下拉框
                tpl.navRouter.navigate('#contracts/contract'); //通过路由清空地址栏参数
                $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');

            });
        };
        //实例化头部
        var _initHeader = function () {
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "我负责或参与的合同",
                "searchPlaceholder": "搜索合同"
            });
            header.on("search", function (keyword) {
                list && list.refresh({
                    "keyword": keyword
                });//刷新
            });
        };

        //实例化表格
        var _initList = function () {
            list = new List({
                data: {
                    employeeID: employee.employeeID,//所要查询的合同的归宿人，如果查自己就传本身的id
                    queryType: 2,//int，查询类型 1:全部合同；2：负责或参与的合同；3：下属的合同;4:关注的合同
                    keyword: '',//string，搜索关键字
                    states: 0,//int，合同状态：全部= 0；执行前= 1；执行中= 2；结束= 3；意外终止= 4
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    pageSize: 10,//int，分页大小
                    pageNumber: 1,//int，当前页keyword: string，搜索关键字
                    endDayType: 0, //init
                    deadlineBeginTime: -1,//long，预估成交时间上限
                    deadlineEndTime: -1,//long，预估成交时间下限
                    isOwner: -1//int，类型：全部=-1;参与=0;负责=1;
                },
                "warpEl": $(".contracts-contract-warp", tplEl),
                "url": "/Contract/GetContractList"
            });
            list.load();
        };

        var init = function () {
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
            if (queryParams && queryParams.queryType) {
                tagType = queryParams.queryType
            } else {
                tagType = 2;
            }
            if (queryParams && queryParams.id) {
                return;
            }
            //左侧菜单高亮手动控制
            switch (tagType) {
                case 4:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
                    $('.isowner-select-list-warp', tplEl).hide();
                    break;
                case 2:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
                    $('.isowner-select-list-warp', tplEl).show();
                    break;
                case 3:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(2).addClass('state-active');
                    $('.isowner-select-list-warp', tplEl).show();
                    break;
            }
            header.setTitle($('.crm-list-left-nav .state-active').text()+util.addListTitle($('.crm-list-left-nav .state-active').text(), '合同', 2));//设置页面头部标题文字
            header.clearSearch();
//            list.resetQueryCondition();//这样会造成2次请求
            data = {

                states: 0,//int，合同状态：全部= 0；执行前= 1；执行中= 2；结束= 3；意外终止= 4
                tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                pageSize: 10,//int，分页大小
                pageNumber: 1,//int，当前页keyword: string，搜索关键字
                isOwner: -1,//int，类型：全部=-1;参与=0;负责=1;
                queryType: parseFloat(tagType),
                endDayType: 0, //init
                deadlineBeginTime: -1,//long，预估成交时间上限
                deadlineEndTime: -1,//long，预估成交时间下限
                keyword: ''//string，搜索关键字(标签名称 模糊匹配)
            };
            list && list.refresh(data);//刷新
            list && list.reSetMnselect(); //重置下拉框
        }
    });

});