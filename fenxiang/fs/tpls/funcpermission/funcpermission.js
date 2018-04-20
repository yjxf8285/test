/**
 * 权限管理模板
 * lxf
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
            FS = root.FS,
            tpl = FS.tpl,
            store = tpl.store,
            tplEvent = tpl.event;
    var fsHelper = require('modules/fs-qx/fs-qx-helper');
    var JoinDialog = fsHelper.JoinDialog; //选人选部门弹出组件
    var util = require('util');
    exports.init = function() {
        var tplEl = exports.tplEl,
                tplName = exports.tplName;
        //left 显示促销宝
        var globalData = FS.getAppStore('globalData');



        /**
         * section元素定义
         */
        //系统管理员
        var flagSystemAdmin = $('#flag-system-admin', tplEl),
                fsaListWrap = $('.flag-name-list', flagSystemAdmin),
                fsaCount = $('.fna-count', flagSystemAdmin);
        //公告管理员
        var flagNoticeAdmin = $('#flag-notice-admin', tplEl),
                fnaListWrap = $('.flag-name-list', flagNoticeAdmin),
                fnaCount = $('.fna-count', flagNoticeAdmin);
        //话题管理员
        var flagTopicAdmin = $('#flag-topic-admin', tplEl),
                ftaListWrap = $('.flag-name-list', flagTopicAdmin),
                ftaCount = $('.fta-count', flagTopicAdmin);
        //财务审批管理员
        var flagFinancialAdmin = $('#flag-financial-admin', tplEl),
                ffaListWrap = $('.flag-name-list', flagFinancialAdmin),
                ffaCount = $('.ffa-count', flagFinancialAdmin);
        //人事审批管理员
        var flagPersonnelAdmin = $('#flag-personnel-admin', tplEl),
                fpaListWrap = $('.flag-name-list', flagPersonnelAdmin),
                fpaCount = $('.fpa-count', flagPersonnelAdmin);
        //指令管理员
        var flagWorkAdmin = $('#flag-work-admin', tplEl),
                fwaListWrap = $('.flag-name-list', flagWorkAdmin),
                fwaCount = $('.fca-count', flagWorkAdmin);
        //日志管理员
        var flagPlanAdmin = $('#flag-plan-admin', tplEl),
                fplanaListWrap = $('.flag-name-list', flagPlanAdmin),
                fplanaCount = $('.fca-count', flagPlanAdmin);
        //定位管理员
        var flagLocationAdmin = $('#flag-location-admin', tplEl),
                flaListWrap = $('.flag-name-list', flagLocationAdmin),
                flaCount = $('.fca-count', flagLocationAdmin);
        //客户管理员
        var flagCustomerAdmin = $('#flag-customer-admin', tplEl),
                fcaListWrap = $('.flag-name-list', flagCustomerAdmin),
                fcaCount = $('.fca-count', flagCustomerAdmin);
        //促销宝
        var flagMarketingAdmin = $('#flag-marketing-admin', tplEl),
                fmaListWrap = $('.flag-name-list', flagMarketingAdmin),
                fmaCount = $('.fma-count', flagMarketingAdmin);
        /**
         * 修改权限人相关操作
         * by liuxf
         */
        var ModifyPermissionsPeople = function(opts) {
            opts = $.extend({
                "element": tplEl
            }, opts || {});
            this.opts = opts;
            this.element = opts.element;
            this.init(); //初始化
        };
        $.extend(ModifyPermissionsPeople.prototype, {
            init: function() {

                this.fetch(); //页面渲染
                this.renderEmployeesDialog(); //渲染弹框
                this.getAllShortEmployees(); //获取所有员工的数据
                this.bindEvents(); //事件绑定
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
                        }
                    }
                });
            },
            bindEvents: function() {
                var that = this;
                var elEl = this.element;
                var cmainPannel = $('.tpl-c', tplEl).find('.tpl-inner');
                var cmainPanItem = $('.flag-cenm-wrap', cmainPannel);
                // 左侧切换
                elEl.on('click', '.flag-left-list li a', function() {
                    var meEl=$(this);
                    var sectionName=meEl.attr('section');
                    if(sectionName){
                        $('.flag-left-list li a',tplEl).removeClass('fl-item-on');
                        meEl.addClass('fl-item-on');
                        cmainPanItem.hide();
                        cmainPanItem.filter('#flag-'+sectionName+'-admin').show();
                    }
                });

                // 修改权限人按钮
                elEl.on('click', '.j-modifypermissions-btn', function() {
                    var meEl = $(this);
                    //请求一次数据，为了每次都取最新的结果()
                    //todo:更合理的方法应该是在这里调用一下fetch方法，但是因为页面初次加载也要fetch，会冲突。
                    util.api({
                        "type": "get",
                        "data": {},
                        "url": "/Management/GetAllFunctionPermissions",
                        "success": function(responseData) {
                            if (responseData.success) {
                                // list 系统管理员
                                var permissionsDataSystem = responseData.value.permissions[0] || [];
                                fsaCount.html(permissionsDataSystem.length);
                                _.each(permissionsDataSystem, function(value) {
                                    value.id = value.employeeID;
                                });
                                if (permissionsDataSystem.length > 0) {
                                    var permissionsListHtml = '';
                                    _.each(permissionsDataSystem, function(data) {
                                        var name = data.name;
                                        permissionsListHtml += '<li>' + name + '</li>';
                                    });
                                    fsaListWrap.html(permissionsListHtml);
                                } else {
                                    fsaListWrap.html('无数据！');
                                }
                                // list 公告管理员
                                var permissionsData = responseData.value.permissions[1] || [];
                                fnaCount.html(permissionsData.length);
                                _.each(permissionsData, function(value) {
                                    value.id = value.employeeID;
                                });
                                if (permissionsData.length > 0) {
                                    var permissionsListHtml = '';
                                    _.each(permissionsData, function(data) {
                                        var name = data.name;
                                        permissionsListHtml += '<li>' + name + '</li>';
                                    });
                                    fnaListWrap.html(permissionsListHtml);
                                } else {
                                    fnaListWrap.html('无数据！');
                                }
                                // list 话题管理员
                                var permissionsDataTopic = responseData.value.permissions[2] || [];
                                _.each(permissionsDataTopic, function(value) {
                                    value.id = value.employeeID;
                                });
                                ftaCount.html(permissionsDataTopic.length);
                                if (permissionsDataTopic.length > 0) {
                                    var permissionsListHtmlTopic = '';
                                    _.each(permissionsDataTopic, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlTopic += '<li>' + name + '</li>';
                                    });
                                    ftaListWrap.html(permissionsListHtmlTopic);
                                } else {
                                    ftaListWrap.html('无数据！');
                                }
                                // list 财务审批管理员
                                var permissionsDataFinancial = responseData.value.permissions[3] || [];
                                _.each(permissionsDataFinancial, function(value) {
                                    value.id = value.employeeID;
                                });
                                ffaCount.html(permissionsDataFinancial.length);
                                if (permissionsDataFinancial.length > 0) {
                                    var permissionsListHtmlFinancial = '';
                                    _.each(permissionsDataFinancial, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlFinancial += '<li>' + name + '</li>';
                                    });
                                    ffaListWrap.html(permissionsListHtmlFinancial);
                                } else {
                                    ffaListWrap.html('无数据！');
                                }
                                // list 人事审批管理员
                                var permissionsDataPersonnel = responseData.value.permissions[4] || [];
                                _.each(permissionsDataPersonnel, function(value) {
                                    value.id = value.employeeID;
                                });
                                fpaCount.html(permissionsDataPersonnel.length);
                                if (permissionsDataPersonnel.length > 0) {
                                    var permissionsListHtmlPersonnel = '';
                                    _.each(permissionsDataPersonnel, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                    });
                                    fpaListWrap.html(permissionsListHtmlPersonnel);
                                } else {
                                    fpaListWrap.html('无数据！');
                                }

                                // list 指令管理员
                                var permissionsDataWork = responseData.value.permissions[5] || [];
                                _.each(permissionsDataWork, function(value) {
                                    value.id = value.employeeID;
                                });
                                fwaCount.html(permissionsDataWork.length);
                                if (permissionsDataWork.length > 0) {
                                    var permissionsListHtmlPersonnel = '';
                                    _.each(permissionsDataWork, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                    });
                                    fwaListWrap.html(permissionsListHtmlPersonnel);
                                } else {
                                    fwaListWrap.html('无数据！');
                                }
                                // list 日志管理员
                                var permissionsDataPlan = responseData.value.permissions[6] || [];
                                _.each(permissionsDataPlan, function(value) {
                                    value.id = value.employeeID;
                                });
                                fplanaCount.html(permissionsDataPlan.length);
                                if (permissionsDataPlan.length > 0) {
                                    var permissionsListHtmlPersonnel = '';
                                    _.each(permissionsDataPlan, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                    });
                                    fplanaListWrap.html(permissionsListHtmlPersonnel);
                                } else {
                                    fplanaListWrap.html('无数据！');
                                }
                                // list 定位管理员
                                var permissionsDataLocation = responseData.value.permissions[7] || [];
                                _.each(permissionsDataLocation, function(value) {
                                    value.id = value.employeeID;
                                });
                                flaCount.html(permissionsDataLocation.length);
                                if (permissionsDataLocation.length > 0) {
                                    var permissionsListHtmlPersonnel = '';
                                    _.each(permissionsDataLocation, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                    });
                                    flaListWrap.html(permissionsListHtmlPersonnel);
                                } else {
                                    flaListWrap.html('无数据！');
                                }
                                // list 客户管理员
                                var permissionsDataCustomer = responseData.value.permissions[31] || [];
                                _.each(permissionsDataCustomer, function(value) {
                                    value.id = value.employeeID;
                                });
                                fcaCount.html(permissionsDataCustomer.length);
                                if (permissionsDataCustomer.length > 0) {
                                    var permissionsListHtmlCustomer = '';
                                    _.each(permissionsDataCustomer, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlCustomer += '<li>' + name + '</li>';
                                    });
                                    fcaListWrap.html(permissionsListHtmlCustomer);
                                } else {
                                    fcaListWrap.html('无数据！');
                                }
                                // list 促销宝
                                var permissionsDataMarketing = responseData.value.permissions[21] || [];
                                _.each(permissionsDataMarketing, function(value) {
                                    value.id = value.employeeID;
                                });
                                fmaCount.html(permissionsDataMarketing.length);
                                if (permissionsDataMarketing.length > 0) {
                                    var permissionsListHtmlMarketing = '';
                                    _.each(permissionsDataMarketing, function(data) {
                                        var name = data.name;
                                        permissionsListHtmlMarketing += '<li>' + name + '</li>';
                                    });
                                    fmaListWrap.html(permissionsListHtmlMarketing);
                                } else {
                                    fmaListWrap.html('无数据！');
                                }
                                // list end
                                that.permissionsDataSystem = permissionsDataSystem; // list 系统管理员
                                that.permissionsData = permissionsData; // list 公告管理员
                                that.permissionsDataTopic = permissionsDataTopic; // list 话题管理员
                                that.permissionsDataFinancial = permissionsDataFinancial; // list 财务审批管理员
                                that.permissionsDataPersonnel = permissionsDataPersonnel; // list 人事审批管理员
                                that.permissionsDataWork = permissionsDataWork; // list 指令管理员
                                that.permissionsDataPlan = permissionsDataPlan; // list 日志管理员
                                that.permissionsDataLocation = permissionsDataLocation; // list 定位管理员
                                that.permissionsDataCustomer = permissionsDataCustomer; // list 客户管理员
                                that.permissionsDataMarketing = permissionsDataMarketing; // list 促销宝
                                
                                //执行弹窗操作
                                that.setDialogType(meEl);
                                that.employeesDialog.show();
                            }
                        }
                    });

                });
            },
            /**
             * 设置选人弹框分类
             */
            setDialogType: function(elEl) {
                var employeesDialog = this.employeesDialog;
                if (elEl.is('.j-system')) {
                    this.setInitData(0, this.permissionsDataSystem); //系统管理员弹框的操作
                    employeesDialog.setTitle('修改系统管理员权限人');
                }
                if (elEl.is('.j-data')) {
                    this.setInitData(1, this.permissionsData); //公告管理员弹框的操作
                    employeesDialog.setTitle('修改公告管理员权限人');
                }
                if (elEl.is('.j-top')) {
                    this.setInitData(2, this.permissionsDataTopic); //话题管理员
                    employeesDialog.setTitle('修改话题管理员权限人');
                }
                if (elEl.is('.j-financial')) {
                    this.setInitData(3, this.permissionsDataFinancial); //财务审批管理员
                    employeesDialog.setTitle('修改财务审批管理员权限人');
                }
                if (elEl.is('.j-personnel')) {
                    this.setInitData(4, this.permissionsDataPersonnel); //人事审批管理员
                    employeesDialog.setTitle('修改人事审批管理员权限人');
                }
                if (elEl.is('.j-work')) {
                    this.setInitData(5, this.permissionsDataWork); //指令管理员
                    employeesDialog.setTitle('修改指令管理员权限人');
                }
                if (elEl.is('.j-plan')) {
                    this.setInitData(6, this.permissionsDataPlan); //日志管理员
                    employeesDialog.setTitle('修改日志管理员权限人');
                }
                if (elEl.is('.j-location')) {
                    this.setInitData(7, this.permissionsDataLocation); //定位管理员
                    employeesDialog.setTitle('修改定位管理员权限人');
                }
                if (elEl.is('.j-customer')) {
                    this.setInitData(31, this.permissionsDataCustomer); //客户管理员
                    employeesDialog.setTitle('修改客户管理员权限人');
                }
                if (elEl.is('.j-market')) {
                    this.setInitData(21, this.permissionsDataMarketing); //促销宝
                    employeesDialog.setTitle('修改促销宝管理员权限人');
                }
            },
            /**
             * 弹框的内部操作
             * @param {[int]}
             */
            setInitData: function(functionNo, joinData) {
                var employeesDialog = this.employeesDialog;
                var that = this;
                var joinDataNewArray = [];
                _.each(joinData, function(data) {
                    joinDataNewArray.push(data.id);
                });
                var unjoinData = util.excludeDataByKey(joinDataNewArray, 'id', that.allEmployeesData); //所有部门里面排除已选的部门
                employeesDialog.setInitData({
                    "joinData": joinData,
                    "unjoinData": unjoinData
                });
                //弹框的确定按钮
                employeesDialog.set('successCb', function(joinData) {
                    // 获取数据添加和移除人的数据
                    var dataState = this.joinList.getDataState();
                    var lostDatas = dataState.lost;
                    var addDatas = dataState.add;
                    var lostDatasArray = [];
                    var addDatasArray = [];
                    var oData = {};
                    _.each(addDatas, function(addData) {
                        addDatasArray.push(addData.employeeID);
                    });
                    _.each(lostDatas, function(lostData) {
                        lostDatasArray.push(lostData.employeeID);
                    });
                    oData = {
                        functionNo: functionNo,
                        addEmployeeIDs: addDatasArray,
                        deleteEmployeeIDs: lostDatasArray
                    };
                    that.modifyFunctionNoEmployees(oData); //提交修改AJAX
                });
            },
            /**
             * 渲染选择员工的弹框
             */
            renderEmployeesDialog: function() {
                this.employeesDialog = new JoinDialog({
                    "unjoinLabel": "未选员工",
                    "joinLabel": "已选员工",
                    "unit": "项",
                    "bbarUnit": "人",
                    "inputPlaceholder": "输入关键词，快速筛选员工",
                    "unjoinEmptyTip": "没有未选员工",
                    "unjoinSearchEmptyTip": "没有筛选条件为{{keyword}}的员工",
                    "joinEmptyTip": "没有已选员工",
                    "joinSearchEmptyTip": "没有筛选条件为{{keyword}}的员工"
                }).render();
            },
            /**
             * 变更权限内的用户
             * @param  {[object]} oData [{
             functionNo: 1,//类型
             addEmployeeIDs: addDatasArray,
             deleteEmployeeIDs: lostDatasArray
             }]
             */
            modifyFunctionNoEmployees: function(oData) {
                var that = this;
                var employeesDialog = this.employeesDialog;
                util.api({
                    "url": '/Management/ModifyFunctionNoEmployees',
                    "type": 'post',
                    "dataType": 'json',
                    "data": oData,
                    "beforeSend": function() {
                    },
                    "success": function(responseData) {
                        if (responseData.success) {
                            employeesDialog.hide();
                            that.fetch(); //刷新列表
                        }
                    }
                },{
                    "submitSelector":$('.f-sub',employeesDialog.element)
                });
            },
            fetch: function() {
                var that = this;
                util.api({
                    "type": "get",
                    "data": {},
                    "url": "/Management/GetAllFunctionPermissions",
                    "success": function(responseData) {
                        if (responseData.success) {
                            // list 系统管理员
                            var permissionsDataSystem = responseData.value.permissions[0] || [];
                            fsaCount.html(permissionsDataSystem.length);
                            _.each(permissionsDataSystem, function(value) {
                                value.id = value.employeeID;
                            });
                            if (permissionsDataSystem.length > 0) {
                                var permissionsListHtml = '';
                                _.each(permissionsDataSystem, function(data) {
                                    var name = data.name;
                                    permissionsListHtml += '<li>' + name + '</li>';
                                });
                                fsaListWrap.html(permissionsListHtml);
                            } else {
                                fsaListWrap.html('<span class="funcpermission-list-empty-tip">未分配系统管理员。</span>');
                            }
                            // list 公告管理员
                            var permissionsData = responseData.value.permissions[1] || [];
                            fnaCount.html(permissionsData.length);
                            _.each(permissionsData, function(value) {
                                value.id = value.employeeID;
                            });
                            if (permissionsData.length > 0) {
                                var permissionsListHtml = '';
                                _.each(permissionsData, function(data) {
                                    var name = data.name;
                                    permissionsListHtml += '<li>' + name + '</li>';
                                });
                                fnaListWrap.html(permissionsListHtml);
                            } else {
                                fnaListWrap.html('<span class="funcpermission-list-empty-tip">未分配公告管理员。</span>');
                            }
                            // list 话题管理员
                            var permissionsDataTopic = responseData.value.permissions[2] || [];
                            _.each(permissionsDataTopic, function(value) {
                                value.id = value.employeeID;
                            });
                            ftaCount.html(permissionsDataTopic.length);
                            if (permissionsDataTopic.length > 0) {
                                var permissionsListHtmlTopic = '';
                                _.each(permissionsDataTopic, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlTopic += '<li>' + name + '</li>';
                                });
                                ftaListWrap.html(permissionsListHtmlTopic);
                            } else {
                                ftaListWrap.html('<span class="funcpermission-list-empty-tip">未分配话题管理员。</span>');
                            }
                            // list 财务审批管理员
                            var permissionsDataFinancial = responseData.value.permissions[3] || [];
                            _.each(permissionsDataFinancial, function(value) {
                                value.id = value.employeeID;
                            });
                            ffaCount.html(permissionsDataFinancial.length);
                            if (permissionsDataFinancial.length > 0) {
                                var permissionsListHtmlFinancial = '';
                                _.each(permissionsDataFinancial, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlFinancial += '<li>' + name + '</li>';
                                });
                                ffaListWrap.html(permissionsListHtmlFinancial);
                            } else {
                                ffaListWrap.html('<span class="funcpermission-list-empty-tip">未分配财务审批管理员。</span>');
                            }
                            // list 人事审批管理员
                            var permissionsDataPersonnel = responseData.value.permissions[4] || [];
                            _.each(permissionsDataPersonnel, function(value) {
                                value.id = value.employeeID;
                            });
                            fpaCount.html(permissionsDataPersonnel.length);
                            if (permissionsDataPersonnel.length > 0) {
                                var permissionsListHtmlPersonnel = '';
                                _.each(permissionsDataPersonnel, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                });
                                fpaListWrap.html(permissionsListHtmlPersonnel);
                            } else {
                                fpaListWrap.html('<span class="funcpermission-list-empty-tip">未分配人事审批管理员。</span>');
                            }

                            // list 指令管理员
                            var permissionsDataWork = responseData.value.permissions[5] || [];
                            _.each(permissionsDataWork, function(value) {
                                value.id = value.employeeID;
                            });
                            fwaCount.html(permissionsDataWork.length);
                            if (permissionsDataWork.length > 0) {
                                var permissionsListHtmlPersonnel = '';
                                _.each(permissionsDataWork, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                });
                                fwaListWrap.html(permissionsListHtmlPersonnel);
                            } else {
                                fwaListWrap.html('<span class="funcpermission-list-empty-tip">未分配指令管理员。</span>');
                            }
                            // list 日志管理员
                            var permissionsDataPlan = responseData.value.permissions[6] || [];
                            _.each(permissionsDataPlan, function(value) {
                                value.id = value.employeeID;
                            });
                            fplanaCount.html(permissionsDataPlan.length);
                            if (permissionsDataPlan.length > 0) {
                                var permissionsListHtmlPersonnel = '';
                                _.each(permissionsDataPlan, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                });
                                fplanaListWrap.html(permissionsListHtmlPersonnel);
                            } else {
                                fplanaListWrap.html('<span class="funcpermission-list-empty-tip">未分配日志管理员。</span>');
                            }
                            // list 定位管理员
                            var permissionsDataLocation = responseData.value.permissions[7] || [];
                            _.each(permissionsDataLocation, function(value) {
                                value.id = value.employeeID;
                            });
                            flaCount.html(permissionsDataLocation.length);
                            if (permissionsDataLocation.length > 0) {
                                var permissionsListHtmlPersonnel = '';
                                _.each(permissionsDataLocation, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlPersonnel += '<li>' + name + '</li>';
                                });
                                flaListWrap.html(permissionsListHtmlPersonnel);
                            } else {
                                flaListWrap.html('<span class="funcpermission-list-empty-tip">未分配定位管理员。</span>');
                            }
                            // list 客户管理员
                            var permissionsDataCustomer = responseData.value.permissions[31] || [];
                            _.each(permissionsDataCustomer, function(value) {
                                value.id = value.employeeID;
                            });
                            fcaCount.html(permissionsDataCustomer.length);
                            if (permissionsDataCustomer.length > 0) {
                                var permissionsListHtmlCustomer = '';
                                _.each(permissionsDataCustomer, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlCustomer += '<li>' + name + '</li>';
                                });
                                fcaListWrap.html(permissionsListHtmlCustomer);
                            } else {
                                fcaListWrap.html('<span class="funcpermission-list-empty-tip">未分配客户管理员。</span>');
                            }
                            // list 促销宝
                            var permissionsDataMarketing = responseData.value.permissions[21] || [];
                            _.each(permissionsDataMarketing, function(value) {
                                value.id = value.employeeID;
                            });
                            fmaCount.html(permissionsDataMarketing.length);
                            if (permissionsDataMarketing.length > 0) {
                                var permissionsListHtmlMarketing = '';
                                _.each(permissionsDataMarketing, function(data) {
                                    var name = data.name;
                                    permissionsListHtmlMarketing += '<li>' + name + '</li>';
                                });
                                fmaListWrap.html(permissionsListHtmlMarketing);
                            } else {
                                fmaListWrap.html('<span class="funcpermission-list-empty-tip">未分配促销宝管理员。</span>');
                            }
                            // list end
                            that.permissionsDataSystem = permissionsDataSystem; // list 系统管理员
                            that.permissionsData = permissionsData; // list 公告管理员
                            that.permissionsDataTopic = permissionsDataTopic; // list 话题管理员
                            that.permissionsDataFinancial = permissionsDataFinancial; // list 财务审批管理员
                            that.permissionsDataPersonnel = permissionsDataPersonnel; // list 人事审批管理员
                            that.permissionsDataWork = permissionsDataWork; // list 指令管理员
                            that.permissionsDataPlan = permissionsDataPlan; // list 日志管理员
                            that.permissionsDataLocation = permissionsDataLocation; // list 定位管理员
                            that.permissionsDataCustomer = permissionsDataCustomer; // list 客户管理员
                            that.permissionsDataMarketing = permissionsDataMarketing; // list 促销宝
                        }
                    }
                });
            },
            destroy: function() {
                //this.xxx = null;
            }
        });
        new ModifyPermissionsPeople(); //实例化

        //促销宝权限控制
        if (globalData.model == 2) {
            $('.tpl-l .flag-left-list li', tplEl).hide();
            $('.left-item-marketing', tplEl).show().click();
        } else if (globalData.model == 1) {
            $('.left-item-marketing', tplEl).hide();
        }
    };
});