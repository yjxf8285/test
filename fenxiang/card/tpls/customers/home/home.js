define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event,
        store = tpl.store,
        list = tpl.list;

    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
    var CustomerList = require('modules/crm-customer-list/crm-customer-list');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var HighSeas = require('modules/crm-high-seas/crm-high-seas');
    var tplName, customerList, header;

    // 移除已经初始化过的组件
    var destoryInitedModule = function () {
        _.each([customerList, header], function (item) {
            if(item && item.destroy){
                item.destroy();
            }
        });
    };
    exports.init = function () {
        var tplEl = exports.tplEl,

            tplEvent = tpl.event,
            tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
        tplName = exports.tplName;
        var highSeas = null;
        var leftNavEl = $('.crm-list-left-nav', tplEl),
            customerListWrapperEl = $('.customer-list-warp', tplEl);

        destoryInitedModule();
        customerList = new CustomerList({
            warpEl: customerListWrapperEl,
            url: "/FCustomer/GetFCustomers"
        });
        header = new Header({
            "element": $(".crm-list-hd", tplEl),
            "title": "我的客户",
            "searchPlaceholder": "搜索客户、客户编号"
        });
        header.on("search", function (keyword) {
            customerList.refresh({
                "keyword": keyword,
                isFirstChar:false
            });
        });

        if (!highSeas) {
            highSeas = new HighSeas({
                "api": "/HighSeas/GetMyHighSeas",
                "navClass": ".crm-high-sea-mine",
                "canCreate": false,
                "url": "#customers/highseas/"
            });
            tplEvent.on('deleteHighSeasSuccess', function(){
            	highSeas.refresh();
            });
        }
        tplLeftEl.on('click', '.crm-high-sea-mine', function (evt) {
            highSeas.show(evt);
            evt.preventDefault();
            evt.stopPropagation();
        });

        var currentMember = FS.getAppStore('contactData').currentMember;
        var isAllowExportData = FS.getAppStore('contactData').isAllowExportData;
        var currentMemberID = currentMember.employeeID;//登录用户的ID
        if (isAllowExportData) {
            $('.customer-export', tplEl).show();
        } else {
            $('.customer-export', tplEl).hide();
        }
        //头像切换
        var sub = new Subordinate({
            "element": $(".customers-img-wrap", tplEl),
            "employeeName": currentMember.name,//按钮默认显示的名称
            "imageSrc": util.getAvatarLink(currentMember.profileImage, '2'),//按钮默认显示的头像
            "canSelect": currentMember.subEmployees ? true : false//如果没有下属，不能选
        });

        sub.on("selected", function (val) {
            customerList.options.data.employeeID = val.employeeID;

            if (currentMemberID == val.employeeID) {//是登录人还是其他人
                $('.top-fn-btns .l', tplEl).show();
                $('.employee-name', leftNavEl).text('我');
                header.setTitle('我的客户');
                $(".crm-high-sea-mine", tplEl).show();
            } else {
                $('.top-fn-btns .l', tplEl).hide();
                $('.employee-name', leftNavEl).text(val.name);
                header.setTitle(val.name + '的客户');
                $(".crm-high-sea-mine", tplEl).hide();
            }
            customerList && customerList.refresh({
                employeeID: val.employeeID,
                listTagOptionID: '1,0',
                keyword: '',//搜索关键字
                isFirstChar: false,
                ownerID:0,
                queryType: 2,
                sortType: 1,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                employeeName: val.name,
                profileImage: val.profileImage
            });
            customerList && customerList.reSetMnselect();//重置模拟下拉框
            customerList && customerList.selectFilterbar && customerList.selectFilterbar.reSet();//重置筛选
            tpl.navRouter.navigate('#customers/home'); //通过路由清空地址栏参数
            $('.crm-list-left-nav li a', tplEl).removeClass('state-active').eq(1).addClass('state-active');
            updateSavedData({employeeID: val.employeeID, employeeName: val.name, profileImage: val.profileImage});
        });

        var queryParams, tagType, data;
        queryParams = util.getTplQueryParams2();
        tagType = (queryParams && queryParams.queryType) ? queryParams.queryType : 2;
        if (tagType == 4) {//我关注的
            $('.top-fn-btns .l', tplEl).hide();
            $('.crm-list-left-nav li a', tplEl).eq(0).addClass('state-active');
        } else if (tagType == 2) {
            $('.top-fn-btns .l', tplEl).show();
            $('.crm-list-left-nav li a', tplEl).eq(1).addClass('state-active');
        } else if (tagType == 3) {//下属的
            $('.top-fn-btns .l', tplEl).hide();
            $('.crm-list-left-nav li a', tplEl).eq(2).addClass('state-active');
        } else {
            $('.top-fn-btns .l', tplEl).show();
        }
        data = {
            employeeID: currentMemberID,
            pageSize: 10,
            queryType: parseFloat(tagType)
        };

        //页面返回
        updateSavedData();
        if (queryParams && queryParams.t && (new Date().getTime() - parseFloat(queryParams.t)) < 1000) {
            customerList.refresh(data, tagType);//TODO //添加的参数 客户状态，分页，发生变化
            //页面f5刷新
        } else {
            customerList && customerList.refresh(data, tagType);
        }
        /**
         * 将页面上暂存的数据填充进去
         */
        function updateSavedData(queryParams) {
            var navEl = $('.crm-list-left-nav li a', tplEl);
            if (queryParams && queryParams.employeeID && queryParams.employeeName && queryParams.employeeID != util.getCurrentEmp().employeeID) {
                $('.employee-name', navEl).text(queryParams.employeeName);
                var title = tplEl.find('a.state-active').children('.employee-name').text() + tplEl.find('a.state-active').children().last().text();
                header.setTitle(title);
                //                sub.reset(queryParams);
            } else {
                $('.employee-name', navEl).text('我');
            }
        }
    }

    tplEvent.on('switched', function (tplName2, tplEl) {
        var queryParams, tagType, data;
        //如果是当前页面
        if (tplName2 == tplName) {
            queryParams = util.getTplQueryParams2();
            if (queryParams && queryParams.id) {
                return;
            }
            tagType = (queryParams && queryParams.queryType) || 2;
            data = {
                queryType: parseFloat(tagType),
                listTagOptionID: '1,0',
                keyword: '',//搜索关键字
                ownerID:0,
                isFirstChar: false,
                sortType: 1,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                pageSize: 10,//分页大小
                pageNumber: 1//当前页
            };
            var stateActiveEl = $('.crm-list-left-nav .state-active');
            $('.crm-list-left-nav li a', tplEl).removeClass('state-active');
            if (tagType == 4) {//我关注的
                $('.top-fn-btns .l', tplEl).hide();
                $('.crm-list-left-nav li a', tplEl).eq(0).addClass('state-active');
            } else if (tagType == 2) {
                if (stateActiveEl.find('.employee-name').text() == '我') {
                    $('.top-fn-btns .l', tplEl).show();
                } else {
                    $('.top-fn-btns .l', tplEl).hide();
                }
                $('.crm-list-left-nav li a', tplEl).eq(1).addClass('state-active');
            } else if (tagType == 3) {//下属的
                $('.top-fn-btns .l', tplEl).hide();
                $('.crm-list-left-nav li a', tplEl).eq(2).addClass('state-active');
            } else {
                $('.top-fn-btns .l', tplEl).show();
            }

            header.setTitle($('.crm-list-left-nav .state-active').text() + util.addListTitle($('.crm-list-left-nav .state-active').text(), '客户', 2));//设置页面头部标题文字
            header.clearSearch();//清空搜索关键字
            customerList && customerList.refresh(data);//刷新
            customerList && customerList.reSetMnselect();//重置模拟下拉框
            customerList && customerList.selectFilterbar && customerList.selectFilterbar.reSet();//重置筛选

        }
    });

});
