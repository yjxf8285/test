/**
 * CRM - 设置 - 标签管理 - tpl
 *
 * @author liuxiaofan
 * 2014-03-20
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-customer-highseas/crm-customer-highseas');
    var Subordinate = require('modules/crm-subordinate-select/crm-subordinate-select');
    var HighSeaSetting = require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
    var HighSeas = require('modules/crm-high-seas/crm-high-seas');
    var OwnerSelect = require('modules/crm-seaselect-follow/crm-seaselect-follow');


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
            tplName = exports.tplName;
        var list = null;
        var header = null;
        var highSeas = null;
        var condition = {
                    "highSeasID":0,// int，公海ID
                    "employeeID":-1, //int，归属员工，查询所有传-1
                    "keyword": "",//string，搜索关键字
                    //"sortType": 2,//int，排序类型，1：最后更新时间倒序；2：客户名称正序
                    "pageSize": 15,//int，分页大小
                    "pageNumber": 0//int，当前页
                };
        var $filterTitle = $('.crm-crmsettings-filterinfo',tplEl);
        var subordinate = null;
        var selectColleague = null;
        var ownerDialog = null;
        var highSeaSetting = null;
        var highSeasID = 0;
        var isHighSeaAdmin = false;
        //监听页面切换事件
        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams;
            //如果是当前页面
            if (tplName2 == tplName) {
                queryParams = util.getTplQueryParams2();
                if(queryParams){
                    condition.highSeasID = queryParams.id;
                    highSeasID = queryParams.id;
                    if(list){
                        list.refresh(condition);    
                    }
                    if(header){
                        header.setTitle(queryParams.name);    
                    }
                }
            }
        });

        var _initHeader = function(){
            if(header){
                return;
            }
            header = new Header({
                "element": $(".high-seas-header", tplEl),
                "title": "",
                "searchPlaceholder": "搜索客户、客户编号"
            });
            header.on("search", function (keyword) {

                //todo
                list.refresh({
                    "keyword": keyword
                });
            });
        };

        var _initList = function(){
            if(list){
                return;
            }
            list = new List({
                "element":$(".high-seas-list",tplEl),
                "condition":condition,
                "isMyHighSeas":true,
                "url":"/HighSeas/GetMyCustomerHighSeas"
            });
            list.on("select",function(){
                if(isHighSeaAdmin){
                    $(".crm-highseas-select-show",tplEl).show();
                    $(".crm-highseas-unselect-show",tplEl).hide();
                }
            });
            list.on("unselect",function(){
                if(isHighSeaAdmin){
                    $(".crm-highseas-unselect-show",tplEl).show();
                    $(".crm-highseas-select-show",tplEl).hide();
                }
            });
            list.on("rowClick",function(id){
                var url = window.location.href.split('#')[1];
                url = url.split('/=/')[0];
                var param = {
                    id: id
                };
                param = _.extend({}, util.getTplQueryParams2(), param);
                param.returnUrl = url+'/=/param-'+ encodeURIComponent(JSON.stringify(param));
                tpl.event.one('dataUpdate', function () {
                    list.refresh();
                });
                tpl.navRouter.navigate('#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)), { trigger: true });
            });
            list.on("isAdmin",function(isAdmin){
                isHighSeaAdmin = isAdmin;
                if(isAdmin){
                    $(".td-checkbox-warp",tplEl).show();
                    $(".crm-highseas-unselect-show",tplEl).show();
                }else{
                    $(".td-checkbox-warp",tplEl).hide();
                    $(".crm-highseas-unselect-show",tplEl).hide();
                    $(".crm-highseas-select-show",tplEl).hide();
                }
            });
            list.on("refreshed",function(total){
                if(header){
                    header.setCount(total);
                }
            });
        };

        var _initOwnerDialog = function(){
            if(ownerDialog){
                return;
            }
            ownerDialog = new OwnerSelect();
            ownerDialog.on("selected",function(value){
                var items = list.getSelectItems();
                util.confirm("是否将选中的"+items.length+"个客户的跟进人设置为"+value.name+"？","",function(){
                    util.api({
                        'url': "/HighSeas/AllocateCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"employeeID":value.employeeID,"customerIDs":items.join(",")},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            var result = responseData.value.result;
                            var successCount = 0;
                            var failureCount = 0;
                            _.each(result,function(item){
                                if(item.value1){
                                    successCount ++;
                                }else{
                                    failureCount ++;
                                }
                            })
                            util.alert("本次调整有"+successCount+"个成功，"+failureCount+"个失败");
                            list.refresh(condition);
                        }
                    });
                });
            });
        };

        var _initHighSeaSetting = function(){
            if(highSeaSetting){
                return;
            }
            highSeaSetting = new HighSeaSetting();
            highSeaSetting.on("modifySuccess",function(value){
                highSeas.refresh();
                tpl.navRouter.navigate('#customers/highseas/=/param-' + encodeURIComponent(JSON.stringify(value)), { trigger: true });
            });
            highSeaSetting.on("deleteSuccess",function(value){
                highSeas.refresh();
                tpl.navRouter.navigate('#customers/home', { trigger: true });
            });
        };
       

        var _initSelectColleague = function(){
            if(selectColleague){
                return;
            }
            selectColleague = new OwnerSelect({
                "title":"选择员工"
            });
            selectColleague.on("selected",function(val){
                condition.employeeID = val.employeeID;
                $filterTitle.find('span').text(val.name);
                $filterTitle.show();
                list.refresh(condition);
            });
        };

        var _initSubordinate = function(){
            if(subordinate){
                return;
            }
            var currentMember = util.getCrmData().currentEmp;
            subordinate =new Subordinate({
                "element": $(".customers-img-wrap", tplEl),
                "employeeName": currentMember.name,//按钮默认显示的名称
                "imageSrc": util.getAvatarLink(currentMember.profileImage, '2'),//按钮默认显示的头像
                "canSelect":false//如果没有下属，不能选
            });
        };

        var _initHighSeas = function(){
            if(highSeas){
                return;
            }
            highSeas = new HighSeas({
                "api":"/HighSeas/GetMyHighSeas",
                "navClass":".crm-high-sea-mine",
                "canCreate":false,
                "url":"#customers/highseas/"
            });
        };

        var _initEvent = function(){
            $(".crm-set-owner",tplEl).on("click",function(){
                ownerDialog.show(list.get("highSeasPermissions"));
            });
            $(".crm-cancel-owner",tplEl).on("click",function(){
                var items = list.getSelectItems();
                util.confirm("是否要取消选中的"+items.length+"个客户的跟进人？","",function(){
                    util.api({
                        'url': "/HighSeas/TakeBackCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"customerIDs":items.join(",")},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            list.refresh(condition);
                        }
                    });
                });
            });
            $(".crm-highsea-edit",tplEl).on("click",function(){
                highSeaSetting.show(highSeasID);
            });
            $(".crm-filter-by-employee",tplEl).on("click",function(){
                selectColleague.show(list.get("highSeasPermissions"));
            });
            $filterTitle.find('a').on("click",function(){
                condition.employeeID = -1;
                list.refresh(condition);
                $filterTitle.hide();
            });

            tplLeftEl.on('click', '.crm-high-sea-mine', function (evt) {
                highSeas.show(evt);
                evt.preventDefault();
                evt.stopPropagation();
            });
        };

        var _init = function(){
            _initHeader();
            _initList();
            _initSelectColleague();
            _initSubordinate();
            _initHighSeas();
            //公海管理员
            _initOwnerDialog();
            _initHighSeaSetting();
            _initEvent();
        }();

    };
});