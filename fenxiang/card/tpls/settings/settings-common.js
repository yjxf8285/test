/**
 * stream辅助页面逻辑
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var Dialog = require('dialog');
    var util = require('util'),
        tabTpl = require('./settings-common.html'),
        commonStyle = require('./settings-common.css'),
        tabTplEl = $(tabTpl);
    exports.init = function (tplEl, tplName) {
        var contactData = util.getContactData(),
            loginUserData = contactData["u"];
        var tabTemp = tabTplEl.filter('.settings-tpl-left').html(); // tab 模版
        var tplLeftEl = $('.tpl-l .tpl-inner', tplEl),
            bindEmailWEl, setLeaderEl ;
        tplLeftEl.html(tabTemp); //tab 模版渲染
        bindEmailWEl = $('.bind-email-l-wrapper', tplLeftEl);
        setLeaderEl = $('.set-leader-l-wrapper', tplLeftEl);
        //settings tab切换
        var swtabList = $('.settings-nav-list', tplEl);
        swtabList.find("li > a").click(function () {
            var meEl = $(this);
            swtabList.find("li > a").removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
        });
        if (loginUserData.exmailDomain) {    //邮箱域名不为空的情况下出现
            bindEmailWEl.show();
        }
        if(FS.getAppStore('contactData') && FS.getAppStore('contactData').isAllowSetOwnLeader){
            setLeaderEl.show();
        }
        //高亮导航注册
        util.regTplNav($('a', swtabList), 'depw-menu-aon');
        //注册子导航
        util.tplRouterReg("#settings/personalsetting");
        util.tplRouterReg("#settings/resetpassword");
        util.tplRouterReg("#settings/avatarsetting");
        util.tplRouterReg("#settings/bindphone");
        util.tplRouterReg("#settings/setupnodisturb");
        util.tplRouterReg("#settings/personalclientconfig");
        util.tplRouterReg("#settings/planremindconfig");
        util.tplRouterReg("#settings/boundexmail");
        util.tplRouterReg("#settings/setleader");
    };
    //保存成功 动画
    exports.saveSuccessAnimated = function (tplEl, tplName) {
        var saveSuccessEl = $('.save-success-apv', tplEl);
        saveSuccessEl.animate({top: '0px'}, 300, function () {
            setTimeout(function () {
                saveSuccessEl.animate({top: '54px'}, 300);
            }, 2000);
        });
    };
    //创建crm设置页左侧
    exports.createCrmSettingLeftNav = function (tplEl, tplName) {
        var crmSettingLeftTpl = tabTplEl.filter('.crm-settings-left-tpl').html();  //crm 设置页左侧模板
        var tplLeftEl = $('.crm-tpl-l .tpl-inner', tplEl);
        var crmData = util.getCrmData(),
            tagData = crmData.tags;
        //渲染DOM
        tplLeftEl.html(_.template(crmSettingLeftTpl)({
            "tagData": _.map(tagData, function (itemData) {
                return {
                    "tagType": itemData.value,
                    "tagName": itemData.value1
                };
            })
        }));
        //绑定标签管理点击事件
        tplLeftEl.on('click', '.label-manage-l', function (evt) {
            var tagListEl = $('.label-manage-list', tplLeftEl);
            tagListEl.show();
            evt.preventDefault();
            evt.stopPropagation();
        });
        //绑定销售阶段设置点击事件
        tplLeftEl.on('click', '.label-salesstage-l', function (evt) {
            var tagListEl = $('.label-manage-list', tplLeftEl);
//            console.info(tagListEl)
            tagListEl.hide();
            salesStageDialog.load();//每次点击都load保持最新数据
            evt.preventDefault();
            evt.stopPropagation();
        });

        util.regGlobalClick($('.label-manage-list', tplLeftEl));
        //注册高亮导航
        util.regTplNav($('.tpl-nav-l', tplLeftEl), 'state-active');
        util.regTplNav($('.label-manage-list a', tplLeftEl), 'state-active');


        /**
         * 销售阶段设置的弹框
         * liuxf
         * 2014-04-22
         */
        var SalesStageDialog = Dialog.extend({
            "attrs": {
                width: 500,
                content: tabTplEl.filter('.crm-salesstagedialog-tpl').html(),
                className: 'dialog-createnewproductdialog'
            },
            "events": {
                'click .js-inuse': 'selectTr',
                'click .button-submit': 'submit',
                'click .button-cancel': 'hide'
            },
            //选择每行时事件
            selectTr: function (e) {
                var meEl = $(e.currentTarget);
                var trEl = meEl.closest('tr');
                var inputEl = trEl.find('td input');
                if (!meEl.parent().is('.mn-disabled-checkbox-box')) {//排除掉disabled的
                    // 选中
                    if (meEl.is('.mn-selected')) {
                        inputEl.prop("disabled", true); //表单置灰
                        meEl.data('value',false);
                    } else {
                        inputEl.prop("disabled", false); //取消表单置灰
                        meEl.data('value',true);
                    }
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            load: function () {
                var that = this;
                util.api({
                    "url": '/SalesStage/GetAllSalesStages',
                    "type": 'get',
                    "dataType": 'json',
                    "success": function (responseData) {
                        if (responseData.success) {
                            var salesStages = responseData.value.salesStages;
                            var tabodyEl = $('.salesstagedialog-table tbody', that.element);
                            var trStr = '';
                            _.each(salesStages, function (salesStage) {
                                var salesStageNo = salesStage.salesStageNo;
                                var inUse = salesStage.inUse;
                                var name = salesStage.name;
                                var winRate = salesStage.winRate;
                                var inputDisabled = "";
                                var mnDisabled = "";
                                var mnSelected = "";
                                if (inUse) {
                                    mnSelected = 'mn-selected';
                                } else {
                                    inputDisabled = 'disabled="disabled"';
                                }
                                if (salesStageNo == 10 || salesStageNo == 11) {
                                    inputDisabled = 'disabled="disabled"';
                                    mnDisabled = 'mn-disabled-checkbox-box';
                                }
                                trStr += '<tr data-salesstageno="' + salesStageNo + '"> <td><div class="mn-checkbox-box checkbox-for-comtable ' + mnDisabled + '">&nbsp;&nbsp;<span class="mn-checkbox-item js-inuse ' + mnSelected + '" data-value="' + inUse + '"></span> </div></td> <td><input type="text" class="textfield input-name" value="' + name + '" ' + inputDisabled + '></td> <td><input type="text" class="textfield input-winrate" value="' + winRate + '" ' + inputDisabled + '></td> </tr>';
                            });
                            tabodyEl.html(trStr);
                            that.show();//拼好了再显示
                        }
                    }
                });
            },
            submit: function (e) {
                var that = this;
                var tabodyEl = $('.salesstagedialog-table tbody', that.element);
                var salesStagesJson = [];
                tabodyEl.find('tr').each(function () {
                    var salesStageNo = $(this).data('salesstageno');
                    var inUse = $(this).find('.js-inuse').data('value');
                    var name = $(this).find('.input-name').val();
                    var winRate = $(this).find('.input-winrate').val();
                    salesStagesJson.push(
                        {"inUse": inUse, "name": name, "salesStageNo": salesStageNo, "winRate": Number(winRate)}
                    );
                });

                util.confirm("您确定要保存您对销售阶段设置的修改吗？", "", function () {
                    util.api({
                        "url": '/SalesStage/SetSalesStages',
                        "type": 'post',
                        "data": {
                            salesStagesJson: salesStagesJson
                        },
                        "dataType": 'json',
                        "success": function (responseData) {
                            if (responseData.success) {
                                util.remind(1,"修改成功");
                                that.load();
                            }
                        }
                    });
                });

            }
        });
        var salesStageDialog = new SalesStageDialog();
        salesStageDialog.render();
    };
});