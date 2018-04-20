/**
 * APP - 报表管理 - 规则设置
 *
 * @author liuxiaofan
 * 2014-09-17
 */

define(function (require, exports, module) {
    var tpl = require('./app-reportsetting-rules.html');
    var style = require('./app-reportsetting-rules.css');
    var util = require('util');
    var fsHelper = require('modules/fs-qx/fs-qx-helper');
    var JoinDialog = fsHelper.JoinDialog; //选人选部门弹出组件

    var ReportSettingRules = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: 'app-reportsetting-rules', //CLASS名
        url: null, //请求地址
        data: null, //请求参数
        template: _.template($(tpl).filter('.app-reportsetting-rules-tpl').html()), //模板
        events: {
            "click .ico-del-btn": "delEmployee",
            "click .select-isneedapprove-btn": "selectIsneedapprove",
            "click .add-auditor-btn": "addAuditorBtn",
            "click .select-allweek": "selectAllweek",
            "click .week-item .mn-checkbox-item": "selectOneweek"
        },
        sortTable: function () {
            /* var elEl = this.$el;
             var tableEl = $('.report-tb', elEl);
             var trEl = $('tbody tr', tableEl);
             if (trEl && trEl.length > 0) {
             trEl.each(function (i) {
             $(this).find('td').eq(0).text(i + 1);
             });
             tableEl.show();
             } else {
             tableEl.hide();
             }*/
        },
        //删除审批人
        delEmployee: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var elEl = this.$el;
            var trEl = meEl.closest('li');
            var id = trEl.data('id');

            //是否可以删除此人
            util.api({
                "url": '/DataReporting/IsAllowDeleteApprover',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    templateID: that.options.data.templateID,// int，模板ID
                    employeeID: id//int，审批人ID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        trEl.remove();

                        var unjoinData = _.reject(that.joinEmployeeData, function (item) {
                            return item.employeeID == id;
                        });
                        that.joinEmployeeData = unjoinData;
                        that.sortTable();//表格序号排序
                    } else {
                        util.alert('不能删除该审批人');
                    }
                }
            });
        },
        rulesSubmit: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var elEl = this.$el;
            var weekEl = elEl.find('.select-date-week');
            var joinEmployeeData = this.joinEmployeeData || [];
            var joinEmployeeDataIds = [];
            _.each(joinEmployeeData, function (item) {
                joinEmployeeDataIds.push(item.id || item.employeeID);
            });
            var successTxt = '创建成功！';
            if (meEl.is('.report-edit-btn-ok')) {//如果是编辑的保存按钮
                successTxt = '保存成功！';
            } else {
                successTxt = '创建成功！';
            }
            util.api({
                "url": '/DataReporting/UpdateTemplateConfig',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    templateID: parseInt(that.options.data.templateID),// int，模板ID
                    sendDeadline: util.mnGetter('.data-senddeadline', elEl),//int，每日上报报表截止时间,枚举
                    sendReminderTime: util.mnGetter('.data-sendremindertime', elEl),//int，每日上报提醒时间，枚举
                    sendReminderTypeList: util.mnGetter('.data-sendremindertypelist', elEl),// List<int>，每日上报提醒类型【手机客户端与PC端提醒 = 1, 短信提醒 = 2, 邮件提醒 = 4】
                    viewingDeadline: util.mnGetter('.data-viewingdeadline', elEl),// int，每日查看报表截止时间，枚举
                    viewingReminderTypeList: util.mnGetter('.data-viewingremindertypelist', elEl),//List<int>，每日查看提醒类型【手机客户端与PC端提醒 = 1, 短信提醒 = 2, 邮件提醒 = 4】
                    isNeedApprove: util.mnGetter('.data-isneedapprove', elEl)[0] || 2,//int，补报或修改数据是否需要审批;1:需要；2：不需要
                    isMonday: $('.data-monday', weekEl).attr('data-value'),// bool，周一是否可以上报
                    isTuesday: $('.data-tuesday', weekEl).attr('data-value'),//bool，周二是否可以上报
                    isWednesday: $('.data-wednesday', weekEl).attr('data-value'),// bool，周三是否可以上报
                    isThursday: $('.data-thursday', weekEl).attr('data-value'),// bool，周四是否可以上报
                    isFriday: $('.data-friday', weekEl).attr('data-value'),// bool，周五是否可以上报
                    isSaturday: $('.data-saturday', weekEl).attr('data-value'),// bool，周六是否可以上报
                    isSunday: $('.data-sunday', weekEl).attr('data-value'),// bool，周日是否可以上报
                    approveIDs: joinEmployeeDataIds// List<int>，添加的审批人id集合
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        util.alert(successTxt, function () {
                            that.trigger('success');
                            that.trigger('editSuccess', {
                                step: 3
                            });
                        });

                    }
                }
            });
        },
        selectIsneedapprove: function (e) {
            var meEl = $(e.currentTarget);
            var fnWarpEl = this.$el.find('.fn-warp');
            if (meEl.is('.mn-selected')) {
                fnWarpEl.hide();
            } else {
                fnWarpEl.show();
            }
        },
        //添加审核人按钮
        addAuditorBtn: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            //所有部门里面排除已选的部门
            var unjoinData = _.reject(this.allSimpleEmployees, function (item) {
                return _.some(that.joinEmployeeData, function (val) {
                    return item.employeeID == val.employeeID;
                });
            });
            _.each(that.joinEmployeeData,function(item){
                item.id=item.employeeID;
            });
            this.employeesDialog.setInitData({
                //                "joinData": [],//右边每次都为空
                "joinData": that.joinEmployeeData,
                "unjoinData": unjoinData
            });
            this.employeesDialog.show();
        },
        selectAllweek: function (e) {
            var meEl = $(e.currentTarget);
            var weekEl = this.$el.find('.select-date-week');
            var allCheckboxEl = $('.week-item .mn-checkbox-item', weekEl);
            if (meEl.is('.mn-selected')) {
                allCheckboxEl.removeClass('mn-selected').attr('data-value', 'false');
            } else {
                allCheckboxEl.addClass('mn-selected').attr('data-value', 'true');
            }
        },
        selectOneweek: function (e) {
            var meEl = $(e.currentTarget);
            var weekEl = this.$el.find('.select-date-week');
            var selectAllweekEl = $('.select-allweek', weekEl);
            var allCheckboxEl = $('.week-item .mn-checkbox-item', weekEl);
            var isSelcetLen = 0;
            if (meEl.is('.mn-selected')) {
                selectAllweekEl.removeClass('mn-selected');
                meEl.attr('data-value', 'false');
            } else {
                meEl.attr('data-value', 'true');
                allCheckboxEl.each(function () {
                    if ($(this).is('.mn-selected')) {
                        isSelcetLen++;
                    }
                });
                if (isSelcetLen == 6) {
                    selectAllweekEl.addClass('mn-selected');
                } else {
                    selectAllweekEl.removeClass('mn-selected');
                }
            }
        },
        // 初始化设置
        initialize: function () {
            this.joinEmployeeData = [];//用来保存已经选择的审批人
            this.render();
            this.bindEvents();
        },
        // 渲染
        render: function () {
            var warpEl = this.options.warpEl;
            warpEl.prepend(this.$el);
            this.setupComponent();
            return this;
        },
        // 请求数据
        load: function () {

            var that = this;
            var elEl = this.$el;
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                "success": function (responseData) {
                    if (responseData.success) {
                        elEl.html(that.template(that.formatData(responseData)));//更新模板HTML字符串并且插入到父级容器
                        that.getAllSimpleEmployees();
                        util.mnSetter($('.data-senddeadline', elEl), responseData.value.sendDeadline);
                        util.mnSetter($('.data-sendremindertime', elEl), responseData.value.sendReminderTime);
                        util.mnSetter($('.data-viewingdeadline', elEl), responseData.value.viewingDeadline);
                        util.mnSetter($('.data-isneedapprove', elEl), responseData.value.isNeedApprove);
                        var trStr = '';
                        var liStr = '';
                        if (responseData.value.isNeedApprove == 1) {//审核人列表
                            $('.fn-warp', elEl).show();
                            if (responseData.value.approvers.length > 0) {
                                that.joinEmployeeData = responseData.value.approvers;
                               /* _.each(responseData.value.approvers, function (item, i) {
                                    trStr += ' <tr data-id="' + item.employeeID + '"><td>' + (i + 1) + '</td><td>' + item.name + '</td><td>' + item.mobile + '</td><td>' + item.post + '</td><td><a href="javascript:;" class="del-employee-btn">删除</a> </td></tr>';
                                });
                                $('.fn-list-warp', elEl).show().find('tbody').html(trStr);*/
                                _.each(responseData.value.approvers, function (item, i) {
                                    var name=item.name;
                                    var imgSrc=util.getAvatarLink(item.profileImage, '2');
                                    liStr+=' <li data-id="' + item.employeeID + '"><b class="ico-del-btn"></b><div class="pic-warp"><img src="'+imgSrc+'" class="pic"/></div><div class="tit">'+name+'</div> </li>'

                                });
                                $('.report-pics-warp',elEl).html(liStr+' <li> <div class="img add-auditor-btn">+</div> <div class="tit">审核人</div> </li>');
                            }
                        }
                        if (that.options.data.type == 'create') {//如果是创建就勾选
                            that.$el.find('.select-isneedapprove-btn').addClass('mn-selected');
                            that.$el.find('.fn-warp').show();
                            util.mnSetter($('.data-isneedapprove', elEl), 1);
                        }
                        util.mnEvent($('.data-senddeadline', elEl), 'change', function (val, text) {
                            $('.report-data-time', elEl).text(text);
                        });
                    }
                }
            });
        },
        //获取所有审核人的数据
        getAllSimpleEmployees: function () {
            var that = this;
            var elEl = this.$el;
            var modifyEmployeesDialog = this.employeesDialog;
            var joinDataNewArray = [];//已选的ID
            util.api({
                //                "url": '/Employee/GetAllShortEmployees',
                "url": '/Employee/GetAllSimpleEmployees',
                "type": 'get',
                "dataType": 'json',
                "data": {},
                "success": function (responseData) {
                    var datas = responseData.value;
                    var unjoinData;
                    if (responseData.success) {
                        _.each(datas, function (data) {
                            data.id = data.employeeID;
                        });
                        that.allSimpleEmployees = datas;
                    }
                }
            });
        },
        // 刷新数据
        refresh: function (data) {
            this.joinEmployeeData = [];//刷新就清空审批人数据
            this.options.data = _.extend(this.options.data, data);
            this.load();
        },
        // 原始数据格式化
        formatData: function (responseData) {
            var elEl = this.$el;
            var formatData = {};
            _.extend(formatData, responseData || {});
            //周选择部分
            formatData.isMonday = responseData.value.isMonday ? 'mn-selected' : '';
            formatData.isTuesday = responseData.value.isTuesday ? 'mn-selected' : '';
            formatData.isWednesday = responseData.value.isWednesday ? 'mn-selected' : '';
            formatData.isThursday = responseData.value.isThursday ? 'mn-selected' : '';
            formatData.isFriday = responseData.value.isFriday ? 'mn-selected' : '';
            formatData.isSaturday = responseData.value.isSaturday ? 'mn-selected' : '';
            formatData.isSunday = responseData.value.isSunday ? 'mn-selected' : '';
            formatData.isMondayValue = responseData.value.isMonday;
            formatData.isTuesdayValue = responseData.value.isTuesday;
            formatData.isWednesdayValue = responseData.value.isWednesday;
            formatData.isThursdayValue = responseData.value.isThursday;
            formatData.isFridayValue = responseData.value.isFriday;
            formatData.isSaturdayValue = responseData.value.isSaturday;
            formatData.isSundayValue = responseData.value.isSunday;
            if (responseData.value.isMonday && responseData.value.isTuesday && responseData.value.isWednesday && responseData.value.isThursday && responseData.value.isFriday && responseData.value.isSaturday && responseData.value.isSunday) {
                formatData.isAllday = 'mn-selected';
            } else {
                formatData.isAllday = '';
            }
            //时间选择部分

            formatData.sendDeadline = responseData.value.sendDeadline - 1 + ':00';
            formatData.sendReminderTime = responseData.value.sendReminderTime - 1 + ':00';
            if (responseData.value.viewingDeadline < 25) {
                formatData.viewingDeadline = responseData.value.viewingDeadline - 1 + ':00';
            } else {
                formatData.viewingDeadline = '次日' + (responseData.value.viewingDeadline - 1) + ':00';
            }
            formatData.sendReminderTimea = '';
            formatData.sendReminderTimeb = '';
            formatData.sendReminderTimec = '';
            _.each(responseData.value.sendReminderTypeList, function (item) {
                switch (item) {
                    case 1:
                        formatData.sendReminderTimea = 'mn-selected';
                        break;
                    case 2:
                        formatData.sendReminderTimeb = 'mn-selected';
                        break;
                    case 4:
                        formatData.sendReminderTimec = 'mn-selected';
                        break;

                }
            });
            formatData.viewingReminderTypeLista = '';
            formatData.viewingReminderTypeListb = '';
            formatData.viewingReminderTypeListc = '';
            _.each(responseData.value.viewingReminderTypeList, function (item) {
                switch (item) {
                    case 1:
                        formatData.viewingReminderTypeLista = 'mn-selected';
                        break;
                    case 2:
                        formatData.viewingReminderTypeListb = 'mn-selected';
                        break;
                    case 4:
                        formatData.viewingReminderTypeListc = 'mn-selected';
                        break;

                }
            });

            formatData.isNeedApprove = (responseData.value.isNeedApprove == 1) ? 'mn-selected' : '';


            return formatData;
        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            var elEl = this.$el;

            //选择审批人的弹框
            this.employeesDialog = new JoinDialog({
                "unjoinLabel": "未选审批人",
                "joinLabel": "已选审批人",
                "unit": "项",
                "bbarUnit": "个审批人",
                "inputPlaceholder": "输入关键词，快速筛选审批人",
                "unjoinEmptyTip": "没有未选审批人",
                "unjoinSearchEmptyTip": "没有筛选条件为{{keyword}}的审批人",
                "joinEmptyTip": "没有已选审批人",
                "joinSearchEmptyTip": "没有筛选条件为{{keyword}}的审批人"
            }).render();
            this.employeesDialog.setTitle('选择审批人');
            //确定按钮
            this.employeesDialog.set('successCb', function (joinData) {
                var trStr = '';
                var liStr = '';
                //                that.joinEmployeeData = that.joinEmployeeData.concat(joinData);//这里要加上原来已经选择的人
                that.joinEmployeeData = joinData;
                this.hide();
                if (joinData) {

                    //                    _.each(joinData, function (item, i) {
                    //
                    //                        trStr += ' <tr data-id="' + item.employeeID + '"> <td>' + (i + 1) + '</td><td>' + item.name + '</td><td>' + item.mobile + '</td><td>' + item.post + '</td><td><a href="javascript:;" class="del-employee-btn">删除</a> </td></tr>';
                    //                    });
                    //                    $('.fn-list-warp', elEl).show().find('tbody').append(trStr);
                    _.each(joinData, function (item, i) {
                        var name=item.name;
                        var imgSrc=util.getAvatarLink(item.profileImage, '2');
                        liStr+=' <li data-id="' + item.employeeID + '"><b class="ico-del-btn"></b><div class="pic-warp"><img src="'+imgSrc+'" class="pic"/></div><div class="tit">'+name+'</div> </li>'

                    });
                    $('.report-pics-warp',elEl).html(liStr+' <li> <div class="img add-auditor-btn">+</div> <div class="tit">审核人</div> </li>');
                }
                that.sortTable();//表格序号排序
            });
        },
        bindEvents: function () {
            var that = this;
            var elEl = this.$el;
            var rulesEl = $('.report-setting-rules');
            rulesEl.delegate('.rules-submit-btn', 'click', function (e) {
                that.rulesSubmit(e);
            });
            rulesEl.delegate('.report-edit-btn-ok', 'click', function (e) {
                that.rulesSubmit(e);
            });
            rulesEl.delegate('.prev-btn', 'click', function (e) {
                that.trigger('beginCreate', {
                    step: 2,
                    templateID: that.options.data.templateID
                });
            });

        }

    });
    module.exports = ReportSettingRules;
});