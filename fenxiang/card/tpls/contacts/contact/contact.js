/**
 * CRM - 联系人 - tpl
 *
 * @author liuxiaofan
 * 2014-05-15
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Dialog = require('dialog');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-contact-list/crm-contact-list');
    var tplName, list, header;
    exports.init = function () {
        var tplEl = exports.tplEl;
        tplName = exports.tplName;
        var currentEmp = util.getCrmData().currentEmp;
        var employee = util.getCrmData().currentEmp;
        var tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
        var leftNavEl = $('.crm-list-left-nav', tplEl);

        //切换人
        var _initSubordinate = function (employee) {
            var employeeNameEl = $('.crm-tpl-l .tpl-inner .crm-list-left-nav .employee-name', tplEl);
            if (!employee) {
                return;
            }
            var canSelect = false;
            if (employee.subEmployees && employee.subEmployees.length > 0) {
                canSelect = true;
            } else {
                canSelect = false;
            }
            var subordinate = new Subordinate({
                "element": $(".tpl-salesopportunity-subordinate-wrapper", tplEl),
                "employeeName": employee.name,
                "imageSrc": util.getAvatarLink(employee.profileImage, '2'),
                "canSelect": canSelect
            });
            //切换头像
            subordinate.on("selected", function (sub) {
                var name = sub.name;
                employee = sub;
                if (sub.employeeID == currentEmp.employeeID) {
                    name = "我";
                    $('.will-be-hide', leftNavEl).show();
                    $('.top-fn-btns', tplEl).show();
                    header.setTitle('我的联系人');
                } else {
                    name = sub.name;
                    $('.will-be-hide', leftNavEl).hide();
                    $('.top-fn-btns', tplEl).hide();
                    header.setTitle(name + '的联系人');
                }
                employeeNameEl.text(name);
                list && list.refresh({
                    employeeID: sub.employeeID,//员工ID
                    keyword: '',//string，关键字
                    isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                    source: 0,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                    createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                    startDate: 0,// long，开始时间
                    endDate: 0,//long，结束时间
                    listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                    sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                    isContainSubordinate: 0,// int，是否包含下属 0：自己;1:下属;-1:全部
                    pageSize: 10,// int，分页大小
                    pageNumber: 1// int，当前页
                });//刷新
                list && list.reSetMnselect();//重置下拉框
                tpl.navRouter.navigate('#contacts/contact');//通过路由清空地址栏参数
                $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
            });
        };
        //实例化头部
        var _initHeader = function () {
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "我的联系人",
                "searchPlaceholder": "搜索联系人"
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
                    keyword: '',//string，关键字
                    isFirstChar: false,// bool，是否按照姓名拼音首字母查询
                    source: 0,// int，名片来源: 1: 手工创建；2：扫描名片；3：复制联系人；
                    createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                    startDate: 0,// long，开始时间
                    endDate: 0,//long，结束时间
                    listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                    sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                    isContainSubordinate: 0,// int，是否包含下属 0：自己;1:下属;-1:全部
                    pageSize: 10,// int，分页大小
                    pageNumber: 1// int，当前页
                },
                "warpEl": $(".contacts-contact-warp", tplEl),
                "url": "/Contact/GetUserContacts"
            });
            list.load();
        };
        // 移除已经初始化过的组件
        var destoryInitedModule = function () {
            _.each([list, header], function (item) {
                if(item && item.destroy){
                    item.destroy();
                }
            });
        };

        var init = function () {
            destoryInitedModule();
            _initSubordinate(employee);
            _initHeader();
            _initList();
        }();
        list && list.refresh();//刷新

        /**
         * 手机名片扫描
         */
        var MobileCardScanDialog = Dialog.extend({
            "attrs": {
                width: 800,
                height: 596,
                closeTpl: "<div class = 'crm-ui-dialog-close'>×</div>",
                content: '<div class="dialog-mobilecardscandialog-warp"> <p>名片扫描——智能而超酷的客户录入体验  <br/><br/>纷享销客与国内最优秀的名片扫描服务提供商“名片全能王”技术合作，将以最优秀的识别性能和最快的识别速度，带给您畅爽体验！ <br/> <br/><span style="color: #C80000;">使用名片扫描功能需要将手机客户端升级到最新版本（苹果手机3.1.0版，安卓手机3.1.0版），并根据提示安装“名片全能王”。如有疑问请致电400 668 9050</span> </p> <img src="../../html/card/assets/images/mobile_card_scan.jpg" alt=""/> </div>',
                className: 'dialog-mobilecardscandialog'
            }});
        var mobileCardScanDialog = new MobileCardScanDialog();
        $('.mobile-card-scan-btn', tplLeftEl).on('click', function () {
            mobileCardScanDialog.show();
        });
    };
    //监听页面切换事件
    tplEvent.on('switched', function (tplName2, tplEl) {
        var queryParams, tagType, data, isContainSubordinate;
        var currentEmp = util.getCrmData().currentEmp;
        //如果是当前页面
        if (tplName2 == tplName) {
            queryParams = util.getTplQueryParams2();
            tagType = (queryParams && queryParams.queryType) ? queryParams.queryType : 0;
            var stateActiveEl = $('.crm-list-left-nav .state-active');
            //左侧菜单高亮手动控制
            switch (tagType) {
                case 0:
                    isContainSubordinate = 0;
                    if (stateActiveEl.find('.employee-name').text() == '我') {
                        $('.top-fn-btns', tplEl).show();
                    } else {
                        $('.top-fn-btns', tplEl).hide();
                    }
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(0).addClass('state-active');
                    break;
                case 2:
                    isContainSubordinate = 1;
                    $('.top-fn-btns', tplEl).hide();
                    $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
                    break;
            }
            $('.top-fn-btns', tplEl).find('.create-sharetome-btn').hide();

            header.setTitle($('.crm-list-left-nav .state-active').text()+util.addListTitle($('.crm-list-left-nav .state-active').text(), '联系人', 3));//设置页面头部标题文字
            header.clearSearch();//清空搜索关键字
            if (queryParams && queryParams.id) {
                return;
            }


            data = {
                queryType: parseFloat(tagType),
                createCustomer: -1,// int，是否创建联系人 0：未创建 1：创建 -1 全部
                sortType: 12,// int，排序规则 1：CreateTime倒序；2：NameSpell,Name正序;3:IsDeleted正序,NameSpell,Name正序;
                isContainSubordinate: isContainSubordinate,// int，是否包含下属 0：自己;1:下属;-1:全部
                pageSize: 10,// int，分页大小
                pageNumber: 1,// int，当前页
                keyword: ''
            };

            list && list.refresh(data);//刷新
            list && list.reSetMnselect();//重置下拉框


        }
    });

});