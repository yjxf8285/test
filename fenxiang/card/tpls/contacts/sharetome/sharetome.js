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
    var List = require('modules/crm-sharetome-list/crm-sharetome-list');
    var tplName, list;
    exports.init = function () {
        var tplEl = exports.tplEl,
            header = null;
        tplName = exports.tplName;
        var currentEmp = util.getCrmData().currentEmp;
        var employee = util.getCrmData().currentEmp;
        var tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);

        //左侧菜单高亮
        var _initLeftNav = function () {

            util.regTplNav($('.tpl-nav-l', tplLeftEl), 'state-active');

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
                employee = sub;
                if (sub.employeeID == currentEmp.employeeID) {
                    name = "我";
                }
                employeeNameEl.text(name);
                list && list.refresh({
                    employeeID: sub.employeeID//员工ID
                });//刷新
            });
        };
        //实例化头部
        var _initHeader = function () {
            header = new Header({
                "element": $(".crm-list-hd", tplEl),
                "title": "共享给我的联系人",
                "searchPlaceholder": "搜索联系人"
            });
            $(".crm-list-hd", tplEl).find('.crm-list-header-search').hide();//这里不需要显示搜索框
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
                    pageSize: 10,//int，
                    pageNumber: 1// int，
                },
                isLoadServerData: true,
                "warpEl": $(".contacts-contact-warp", tplEl),
                "url": "/Contact/GetShareContacts"
            });
            list.on('loadSuccess', function(responseData){
            	var contacts = (responseData.success && responseData.value && responseData.value.shareContactDetails) || [],
            		hasUnCreated = false;
            	for(var i=0,len=contacts.length; i<len; i++) {
            		if(!contacts[i].isCreated) {
            			hasUnCreated = true;
            		}
            	}
            	if(hasUnCreated) {
            		$('.top-fn-btns', tplEl).find('.create-sharetome-btn').removeAttr('disabled').removeClass('crm-button-state-disabled');
            	} else {
            		$('.top-fn-btns', tplEl).find('.create-sharetome-btn').attr('disabled', true).addClass('crm-button-state-disabled');
            	}
            	if(contacts.length) {
            		$('.top-fn-btns', tplEl).find('.remove-sharetome-btn').removeAttr('disabled').removeClass('crm-button-state-disabled');
            	} else {
            		$('.top-fn-btns', tplEl).find('.remove-sharetome-btn').attr('disabled', true).addClass('crm-button-state-disabled');
            	}
            });
            list.load();
            $('.top-fn-btns', tplEl).find('button').hide();
            $('.top-fn-btns', tplEl).find('.create-sharetome-btn').show();
            $('.top-fn-btns', tplEl).find('.remove-sharetome-btn').show();
            $('.crm-table-list-hd', tplEl).hide();
        };

        var init = function () {
            _initLeftNav();
            _initSubordinate(employee);
            _initHeader();
            _initList();
        }();

        /**
         * 手机名片扫描
         */
        var MobileCardScanDialog = Dialog.extend({
            "attrs": {
                width: 800,
                height:596,
                closeTpl: "<div class = 'crm-ui-dialog-close'>×</div>",
                content: '<div class="dialog-mobilecardscandialog-warp"> <p>名片扫描——智能而超酷的客户录入体验  <br/><br/>纷享销客与国内最优秀的名片扫描服务提供商“名片全能王”技术合作，将以最优秀的识别性能和最快的识别速度，带给您畅爽体验！ <br/> <br/><span style="color: #C80000;">使用名片扫描功能需要将手机客户端升级到最新版本（苹果手机3.1.0版，安卓手机3.1.0版），并根据提示安装“名片全能王”。如有疑问请致电400 668 9050</span> </p> <img src="../../html/card/assets/images/mobile_card_scan.jpg" alt=""/> </div>',
                className: 'dialog-mobilecardscandialog'
            }});
        var mobileCardScanDialog = new MobileCardScanDialog();
        $('.mobile-card-scan-btn', tplLeftEl).on('click', function () {
            mobileCardScanDialog.show();
        });
    };


});