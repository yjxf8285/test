/**
 * CRM - 市场 - tpl
 *
 * @author liuxiaofan
 * 2014-05-12
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-marketing-list/crm-marketing-list');
    var tplName, list, header;
    var currentEmp = util.getCrmData().currentEmp;
    var employee = util.getCrmData().currentEmp;
    exports.init = function () {
        var tplEl = exports.tplEl;
        var leftNavEl = $('.crm-list-left-nav', tplEl);
        tplName = exports.tplName;


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
                    $('.create-salesclue-btn', tplEl).show();
                    header.setTitle('我负责或参与的市场活动');
                } else {
                    name = sub.name;
                    $('.create-salesclue-btn', tplEl).hide();
                    header.setTitle(sub.name + '负责或参与的市场活动');
                }
                employeeNameEl.text(name);
                list && list.refresh({
                    employeeID: sub.employeeID,//员工ID
                    states: 0,//int，状态：0、全部；1、未处理；2、已联系；3、关闭
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    pageSize: 10,//int，分页大小
                    pageNumber: 1,//int，当前页keyword: string，搜索关键字
                    queryType: 1,
                    keyword: ''//string，搜索关键字(标签名称 模糊匹配)

                });//刷新
                list && list.reSetMnselect(); //重置下拉框
                tpl.navRouter.navigate('#marketings/marketing'); //通过路由清空地址栏参数
                $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
            });
        };
        //实例化头部
        var _initHeader = function () {
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "我负责或参与的市场活动",
                "searchPlaceholder": "搜索市场活动"
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
                    employeeID: employee.employeeID,//员工ID
                    queryType: 0,//int，查询类型：0、我负责的线索；1、下属负责的线索；2、我创建的线索；3、下属创建的线索；
                    keyword: '',//string，搜索关键字
                    states: 0,//int，状态：0、全部；1、未处理；2、已联系；3、关闭
                    tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                    sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                    pageSize: 10,//int，分页大小
                    pageNumber: 1//int，当前页keyword: string，搜索关键字
                },
                "warpEl": $(".marketings-marketing-warp", tplEl),
                "url": "/MarketingEvent/GetMarketingEventList"
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
            if (queryParams && queryParams.id) return;

            tagType = queryParams ? queryParams.queryType : 1; //默认打开tagType类型
            //左侧菜单高亮手动控制
            switch (tagType) {
                case 3:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
                    header && (header.setTitle($('.crm-list-left-nav li a', tplEl).eq(0).text()));
                    break;
                case 1:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
                    header && (header.setTitle($('.crm-list-left-nav li a', tplEl).eq(1).text()));
                    break;
                case 2:
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(2).addClass('state-active');
                    header && (header.setTitle($('.crm-list-left-nav li a', tplEl).eq(2).text()));
                    break;
            }
            header.setTitle($('.crm-list-left-nav .state-active').text()+util.addListTitle($('.crm-list-left-nav .state-active').text(), '市场活动', 4));//设置页面头部标题文字
            header.clearSearch();//清空搜索关键字
            data = {
                states: 0,//int，状态：0、全部；1、未处理；2、已联系；3、关闭
                tagOptionIDsJson: '',//string，标签选项列表(标签ID和标签选项ID，用逗号隔开)，demo：106,1282_111,1284
                sortType: 6,//int，排序类型：1、最后编辑时间正序；2、名称正序；3、名称倒序；4、公司名称正序；5、公司名称倒序；6、最后更新时间倒序
                pageSize: 10,//int，分页大小
                pageNumber: 1,//int，当前页keyword: string，搜索关键字
                queryType: parseFloat(tagType),
                keyword: ''//string，搜索关键字(标签名称 模糊匹配)
            };
            list && list.refresh(data);//刷新
            list && list.reSetMnselect(); //重置下拉框
        }
    });

});