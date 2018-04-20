/* 
 Created on : 2013-12-04, 14:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var fsHelper = require('modules/fs-qx/fs-qx-helper');
    var publishHelper = require('modules/publish/publish-helper');
    var moment = require('moment');
    var JoinDialog = fsHelper.JoinDialog; //选人选部门弹出组件
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    exports.init = function() {
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
//        if(FS.getAppStORE('GLOBALDATA').ISALLOWDANGEROPERATE) {
//			$('.LEFT-CRM-RESET').SHOW();
//		}
        /**
         * 定位统计
         * @param {object} opts
         */
        var Locationmanages = function(opts) {
            opts = $.extend({
                "element": $('body') //容器为jQuery对象
            }, opts || {});
            this.opts = opts;
            this.element = opts.element;
            this.init(); //执行初始化
        };
        $.extend(Locationmanages.prototype, {
            /**
             * 初始化
             */
            init: function() {
                this.bindEvents(); //事件绑定
                this.renderCircleDialog(); //渲染选部门的弹框
                this.renderEmployeesDialog(); //渲染选个人的弹框
                this.setDateSelect(); //实例化选择日期组件
            },
            /**
             * 实例化选择日期组件
             */
            setDateSelect: function() {
                var starttimeDs = new DateSelect({
                    "element": $('.j-starttime-warp'), //选择开始时间
                    "placeholder": "选择日期",
                    "formatStr": "YYYY年MM月DD日（dddd）"
                });
                var endtimeDs = new DateSelect({
                    "element": $('.j-endtime-warp'), //选择开始时间
                    "placeholder": "选择日期",
                    "formatStr": "YYYY年MM月DD日（dddd）"
                });
                this.starttimeDs = starttimeDs;
                this.endtimeDs = endtimeDs;
            },
            /**
             * 事件绑定
             */
            bindEvents: function() {
                var elEl = this.element;
                var that = this;
                //提交按钮
                elEl.on('click', '.j-submit-btn', function() {
                    if ((that.circleJoinData.length == 0) && (that.employeesJoinData.length == 0)) {
                        util.alert('部门或者员工至少选择一个');
                    } else {
                        that.getLocationResultExcel();
                    }
                });
                //选择部门
                elEl.on('click', '.j-select-circle', function() {
                    that.getAllCircleInfos(); //获取所有部门的数据
                });
                //选择员工
                elEl.on('click', '.j-select-employee', function() {
                    that.getAllShortEmployees(); //获取所有员工的数据
                });
                //清空部门
                elEl.on('click', '.j-circle-warp .j-select-clear', function() {
                    var circleWarpEl = $(this).closest('.rwarp').find('.circle-warp');
                    that.circleJoinData = [];
                    circleWarpEl.hide();
                    $(this).hide();
                });
                //清空员工
                elEl.on('click', '.j-employees-warp .j-select-clear', function() {
                    var employeesWarpEl = $(this).closest('.rwarp').find('.circle-warp');
                    that.employeesJoinData = [];
                    employeesWarpEl.hide();
                    $(this).hide();
                });
                //移除单个
                elEl.on('click', '.circle-warp b', function() {
                    var ddEl = $(this).closest('dd');
                    var circleWarpEl = $(this).closest('.circle-warp');
                    var selectClearEl = $(this).closest('.rwarp').find('.j-select-clear');
                    var id = ddEl.data('id');
                    var type = ddEl.data('type');
                    if (type == 'c') { //c代表是部门的数据
                        that.circleJoinData = util.excludeDataByKey(id, 'id', that.circleJoinData);
                    } else {
                        that.employeesJoinData = util.excludeDataByKey(id, 'id', that.employeesJoinData);
                    }
                    ddEl.remove();
                    if (circleWarpEl.html() == '') {
                        circleWarpEl.hide();
                        selectClearEl.hide();
                    }
                });
                //下载表格
                elEl.on('click', '.locationmanages-downbtn', function(evt) {
                    var linkEl = $(evt.currentTarget);
                    util.confirm('是否要保存签到统计报表', '提示', function(evt) {
                        window.open(linkEl.attr('href'));
                        linkEl.hide();
                    }, {
                        "onCancel": function() {
                            linkEl.hide();
                        }
                    });
                    evt.preventDefault();
                });
            },
            /**
             * 获取所有员工的数据
             * @returns {array}
             */
            getAllShortEmployees: function() {
                var that = this;
                util.api({
                    "url": '/Management/GetAllShortEmployees',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {},
                    "success": function(responseData) {
                        var datas = responseData.value;
                        if (responseData.success) {
                            _.each(datas, function(data) {
                                data.id = data.employeeID;
                            });
                            that.allEmployeesData = datas; //把所有员工的数据保存起来
                            that.modifyEmployeesDialog(); //修改员工的弹框
                        }
                    }
                });
            },
            /**
             * 获取所有部门的数据
             * @returns {array}
             */
            getAllCircleInfos: function() {
                var that = this;
                util.api({
                    "url": '/Management/GetAllCircleInfos',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {},
                    "success": function(responseData) {
                        if (responseData.success) {
                            that.allCircleData = responseData.value; //把所有部门的数据保存起来
                            that.modifyCircleDialog(); //修改部门的弹框
                        }
                    }
                });
            },
            /**
             * 渲染员工弹框
             */
            renderEmployeesDialog: function() {
                this.employeesDialog = new JoinDialog({
                    "unjoinLabel": "未选员工",
                    "joinLabel": "已选员工",
                    "unit": "项",
                    "bbarUnit": "个员工",
                    "inputPlaceholder": "输入关键词，快速筛选员工",
                    "unjoinEmptyTip":"没有未选员工",
                    "unjoinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工",
                    "joinEmptyTip":"没有已选员工",
                    "joinSearchEmptyTip":"没有筛选条件为{{keyword}}的员工"
                }).render();
                this.employeesDialog.setTitle('选择员工');
                this.employeesJoinData = []; //右边初始状态为空
            },
            /**
             * 渲染部门弹框
             */
            renderCircleDialog: function() {
                this.circleDialog = new JoinDialog({
                    "unjoinLabel": "未选部门",
                    "joinLabel": "已选部门",
                    "unit": "项",
                    "bbarUnit": "部门",
                    "inputPlaceholder": "输入关键词，快速筛选部门",
                    "unjoinEmptyTip":"没有未选部门",
                    "unjoinSearchEmptyTip":"没有筛选条件为{{keyword}}的部门",
                    "joinEmptyTip":"没有已选部门",
                    "joinSearchEmptyTip":"没有筛选条件为{{keyword}}的部门"
                }).render();
                this.circleDialog.setTitle('选择部门');
                this.circleJoinData = []; //右边初始状态为空
            },
            /**
             * 修改员工的弹框
             * @returns {array}
             */
            modifyEmployeesDialog: function() {
                var that = this;
                var modifyEmployeesDialog = this.employeesDialog;
                var joinData = that.employeesJoinData;
                var joinDataNewArray = [];
                _.each(joinData, function(data) {
                    joinDataNewArray.push(data.id);
                });
                var unjoinData = util.excludeDataByKey(joinDataNewArray, 'id', that.allEmployeesData); //所有部门里面排除已选的部门
                modifyEmployeesDialog.setInitData({
                    "joinData": joinData,
                    "unjoinData": unjoinData
                });
                modifyEmployeesDialog.show();
                //确定按钮
                modifyEmployeesDialog.set('successCb', function(joinData) {
                    that.employeesJoinData = joinData;
                    this.hide();
                    that.showEmployeesDom(); //渲染员工数据的DOM
                });
            },
            /**
             * 修改部门的弹框
             * @returns {array}
             */
            modifyCircleDialog: function() {
                var that = this;
                var modifyCircleDialog = this.circleDialog;
                var joinData = that.circleJoinData;
                var joinDataNewArray = [];
                _.each(joinData, function(data) {
                    joinDataNewArray.push(data.id);
                });
                var unjoinData = util.excludeDataByKey(joinDataNewArray, 'id', that.allCircleData); //所有部门里面排除已选的部门
                //去掉已停用的部门
                unjoinData= _.reject(unjoinData,function(itemData){
                    return itemData.isStop;
                });
                modifyCircleDialog.setInitData({
                    "joinData": joinData,
                    "unjoinData": unjoinData
                });
                modifyCircleDialog.show();
                //确定按钮
                modifyCircleDialog.set('successCb', function(joinData) {
                    that.circleJoinData = joinData;
                    modifyCircleDialog.hide();
                    that.showCircleDom(); //渲染部门数据的DOM
                });
            },
            /**
             * 渲染员工数据的DOM
             */
            showEmployeesDom: function() {
                var elEl = this.element;
                var employeesEl = $('.j-employees-warp', elEl);
                var employeesDlEl = $('.circle-warp', employeesEl);
                var clearBtnEl = $('.j-select-clear', employeesEl);
                var joinDatas = this.employeesJoinData;
                var ddStr = '';
                $.each(joinDatas, function(i, joinData) {
                    ddStr += '<dd data-id="' + joinData.id + '" data-type="p">' + joinData.name + '<b> ×</b></dd>';
                });
                employeesDlEl.html(ddStr).show();
                clearBtnEl.show();
            },
            /**
             * 渲染部门数据的DOM
             */
            showCircleDom: function() {
                var elEl = this.element;
                var circleEl = $('.j-circle-warp', elEl);
                var circleDlEl = $('.circle-warp', circleEl);
                var clearBtnEl = $('.j-select-clear', circleEl);
                var joinDatas = this.circleJoinData;
                var ddStr = '';
                $.each(joinDatas, function(i, joinData) {
                    ddStr += '<dd data-id="' + joinData.id + '" data-type="c">' + joinData.name + '<b> ×</b></dd>';
                });
                circleDlEl.html(ddStr).show();
                clearBtnEl.show();
            },
            /**
             * 定位统计excel生成,返回临时文件地址
             * @returns {url}
             */
            getLocationResultExcel: function() {
                var elEl = this.element;
                var downbtnEl = $('.locationmanages-downbtn', elEl);
                var checkboxEl = $('.j-locationmanages-checkbox', elEl);
                var isChecked = checkboxEl.prop('checked');
                var circleIDs = '';
                var employeeIDs = '';
                var reg = /,$/gi; //去掉字符串结尾的,号
                var starttimeDs = this.starttimeDs;
                var endtimeDs = this.endtimeDs;
                var startTime = starttimeDs.getValue(true);
                var endTime = endtimeDs.getValue(true);

                if(startTime){
                    startTime=startTime.unix();
                }else{
                    startTime=0;
                }
                if(endTime){
                    endTime=endTime.add('days', 1).subtract('seconds', 1).unix();
                }else{
                    endTime=0;
                }
                $.each(this.circleJoinData, function(i, circleJoinData) {
                    circleIDs += '' + circleJoinData.id + ',';
                });
                $.each(this.employeesJoinData, function(i, employeesJoinData) {
                    employeeIDs += '' + employeesJoinData.id + ',';
                });
                util.api({
//                    "url": '/Management/GetLocationResultExcel',
                    "url": '/Location/GetLocationResultExcel',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        circleIDs: circleIDs.replace(reg, ""),
                        employeeIDs: employeeIDs.replace(reg, ""),
                        startTime: startTime,
                        endTime: endTime,
                        isExportContent: isChecked
                    },
                    "beforeSend": function() {
                        downbtnEl.show().addClass('loading').html('正在生成报表，请稍后...');
                    },
                    "success": function(responseData) {
                        if (responseData.success) {
                            downbtnEl.attr('href', FS.API_PATH+'/df/gettemp?id='+responseData.value+'&name=签到统计报表.xls').removeClass('loading').html('生成完毕，点击下载报表');
                        } else {
                            downbtnEl.hide();
                        }
                    }
                }, {
                    "modal": $('.j-submit-btn', elEl)
                });
            },
            destroy: function() {
                //                this.xxx = null;
            }
        });
//        new Locationmanages({
//            "element": tplEl
//        }); //实例化
        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');
    };
});