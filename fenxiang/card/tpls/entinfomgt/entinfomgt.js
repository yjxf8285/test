/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        json = require('json'),
        fsHelper = require('modules/fs-qx/fs-qx-helper');
    var JoinDialog = fsHelper.JoinDialog; //选人选部门弹出组件
    var Uploader = fsHelper.Uploader;
    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        //左侧 切换
        var leftListWrap = $('.flag-left-list', tplEl),
            entSetupWrap = $('.ent-setup-wrap', tplEl),
            loginSetupWrap = $('.login-setup-wrap', tplEl),
            customManageWrap = $('.custom-manage-wrap', tplEl),
            modifyFullCompanyLimitWrap = $('.modify-full-company-limit-wrap', tplEl);

        leftListWrap.find('li').click(function () {
            leftListWrap.find('a').removeClass('fl-item-on');
            var meEl = $(this);
            var index = meEl.index();
            $('a', meEl).addClass('fl-item-on');

            if (index == 0) {
                entSetupWrap.show();
                loginSetupWrap.hide();
                customManageWrap.hide();
                modifyFullCompanyLimitWrap.hide();
            } else if (index == 1) {
                entSetupWrap.hide();
                customManageWrap.hide();
                loginSetupWrap.show();
                modifyFullCompanyLimitWrap.hide();
            } else if (index == 2) {
                entSetupWrap.hide();
                loginSetupWrap.hide();
                customManageWrap.show();
                modifyFullCompanyLimitWrap.hide();
            } else if (index == 3) {
                entSetupWrap.hide();
                loginSetupWrap.hide();
                customManageWrap.hide();
                modifyFullCompanyLimitWrap.show();
            }
        });

        //登录页设置 颜色选择控件
        var lsuInpText = $('.lsu-inp-text', tplEl),
            lsuViewColor = $('.lsu-view-color', tplEl),
            lsuSelWrap = $('.lsu-sel-wrap', tplEl),
            lsuSelView = $('.lsu-sel-view', tplEl),
            lsuViewCvalue = $('.lsu-view-cvalue', lsuSelWrap),
            lsuSelList = $('.lsu-sel-list', lsuSelWrap);
        lsuSelList.find('li').click(function () {
            var meEl = $(this);
            lsuSelList.find('li').removeClass('lslon');
            meEl.addClass('lslon');
            var meColor = meEl.attr('color');
            lsuViewCvalue.css('background-color', meColor);
            lsuViewColor.css('background-color', meColor);
            lsuInpText.val(meColor.slice(1, 7));
            lsuSelList.hide();
        });
        lsuSelView.click(function (evt) {
            lsuSelView.addClass('lsuvcon');
            if (lsuSelList.is(':visible')) {
                lsuSelList.hide();
            } else {
                lsuSelList.show();
                //lsuSelView.removeClass('lsuvcon');
            }
            evt.stopPropagation();
        });
        $(document).click(function () {
            lsuSelList.hide();
            lsuSelView.removeClass('lsuvcon');
        });
        lsuInpText.keyup(function () {
            var meEl = $(this);
            var meColor = meEl.val();
            if (meEl.val().length == 6) {
                lsuViewColor.css('background-color', '#' + meColor);
            }
        });
        //接口 rander
        var smsEnterpriseNameEl = $('.sms-enterprise-name', entSetupWrap),
            smsEnterpriseBtn = $('.sms-enterprise-btn', entSetupWrap),
            allCompanyInpEl = $('.all-company-inp', entSetupWrap),
            allCompanyBtn = $('.all-company-btn', entSetupWrap),
            enterpriseBgcolorBtn = $('.enterprise-bgcolor-btn', tplEl),
            enterpriseBgcDefaultBtn = $('.enterprise-bgc-default-btn', tplEl);

        util.api({
            "type": "get",
            "data": {},
            "url": "/Management/GetEnterpriseInfo",
            "success": function (responseData) {
                if (responseData.success) {
                    var entValue = responseData.value;
                    var smsEnterpriseName = entValue.enterpriseName,
                        allCompanyDefaultString = entValue.allCompanyDefaultString,
                        enterpriseBackgroundColor = entValue.enterpriseBackgroundColor;
                    smsEnterpriseNameEl.val(smsEnterpriseName);
                    allCompanyInpEl.val(allCompanyDefaultString);
                    lsuInpText.val(enterpriseBackgroundColor);
                    lsuViewColor.css('background-color', '#' + enterpriseBackgroundColor);
                    var lsuSelItemData = lsuSelList.find('li');
                    lsuSelItemData.each(function () {
                        var meEl = $(this);
                        if (meEl.attr('color').slice(1) == enterpriseBackgroundColor) {
                            meEl.addClass('lslon');
                            lsuViewCvalue.css('background-color', '#' + enterpriseBackgroundColor);
                        }
                    });
                }
            }
        });
        smsEnterpriseBtn.click(function () {
            var val = _.str.trim(smsEnterpriseNameEl.val());
            if (val.length == 0) {
                util.showInputError(smsEnterpriseNameEl);
            } else {
                util.api({
                    "type": "post",
                    "data": {"enterpriseName": val},
                    "url": "/Management/SetEnterpriseName",
                    "success": function (responseData) {
                        if (responseData.success) {
                            $('.hd .enterprise-name').text(val);
                            util.alert('保存成功。');
                        }
                    }
                });
            }
        });
        allCompanyBtn.click(function () {
            var val = _.str.trim(allCompanyInpEl.val());
            if (val.length == 0) {
                util.showInputError(allCompanyInpEl);
            } else {
                util.api({
                    "type": "post",
                    "data": {"allCompanyDefaultString": val},
                    "url": "/Management/SetAllCompanyDefaultString",
                    "success": function (responseData) {
                        if (responseData.success) {
                            //设置模板变量
                            util.setTplStore('entinfomgt', {
                                "enterpriseName": val
                            });
                            util.alert('保存成功。');
                        }
                    }
                });
            }
        });
        enterpriseBgcolorBtn.click(function () {
            var val = _.str.trim(lsuInpText.val());
            if (val.length < 6) {
                util.showInputError(lsuInpText);
            } else {
                util.api({
                    "type": "post",
                    "data": {"backgroundColor": val},
                    "url": "/Management/SetEnterpriseBackgroundColor",
                    "success": function (responseData) {
                        if (responseData.success) {
                            util.alert('保存成功。');
                        }
                    }
                });
            }
        });
        enterpriseBgcDefaultBtn.click(function () {
            var defaultColor = 'a6ce39';
            util.api({
                "type": "post",
                "data": {"backgroundColor": defaultColor},
                "url": "/Management/SetEnterpriseBackgroundColor",
                "success": function (responseData) {
                    if (responseData.success) {
                        lsuInpText.val(defaultColor);
                        lsuViewColor.css('background-color', '#' + defaultColor);
                        lsuViewCvalue.css('background-color', '#' + defaultColor);
                        lsuSelList.find('li').removeClass('lslon');
                        lsuSelList.find('li').eq(0).addClass('lslon');
                    }
                }
            });
        });
        //接口 rander end
        //logo上传
        var logoUploadBtnEl = $('.up-logo-file', tplEl),
            restoreLogoBtnEl = $('.up-logo-default-btn', tplEl),
            loginUploadBtnEl = $('.up-mainimg-file', tplEl),
            restoreLoginBtnEl = $('.up-mainimg-default-btn', tplEl);
        var logoImgEl = $('.hd .logo-img'),
            tplLogoImgEl = $('.logo-img', tplEl),
            tplLoginImgEl = $('.login-img', tplEl);
        var globalData = FS.getAppStore('globalData');
        var logoPath = FS.API_PATH + '/Authorize/GetLogoImg?type=1&ent=' + globalData.enterprise,
            loginPath = FS.API_PATH + '/Authorize/GetLogoImg?type=2&ent=' + globalData.enterprise;

        var logoUploader = new Uploader({
            "element": logoUploadBtnEl,
            "h5UploadPath": "/Management/uploadFile", //上传地址
            "flashUploadPath": "/Management/UploadFileByForm", //普通表单上传地址
            "h5Opts": {
                multiple: false,
                accept: "image/*",
                filter: function (files) {
                    var passedFiles = [];
                    _.each(files, function (fileData) {
                        if (util.getFileType(fileData) == "jpg") {
                            passedFiles.push(fileData);
                        } else {
                            util.alert('请选择图片格式的文件');
                        }
                    });
                    return passedFiles;
                }
            },
            "flashOpts": {
                file_types: "*.jpg;*.gif;*.jpeg;*.png",
                file_types_description: "图片格式",
                button_width: 80,
                button_height: 25
            },
            "onSelect": function (file) {
                this.startUpload();
            },
            "onSuccess": function (file, responseText) {
                //上传成功后处理
                var responseData = json.parse(responseText);
                var filePath;
                if (responseData.success) {
                    filePath = responseData.value.filePath;
                    util.api({
                        type: 'post',
                        data: {
                            "logoPath": filePath
                        },
                        url: '/Management/UploadLogo',
                        success: function (responseData) {
                            var random = new Date() / 1;
                            if (responseData.success) {
                                //更换logo
                                logoImgEl.attr('src', logoPath + '&r=' + random);
                                tplLogoImgEl.attr('src', logoPath + '&r=' + random);
                            }
                        }
                    });
                }
            },
            "onComplete": function () {
                //上传成功后清理文件缓存
                this.removeAllFile();
            }
        });
        var loginUploader = new Uploader({
            "element": loginUploadBtnEl,
            "h5UploadPath": "/Management/uploadFile", //上传地址
            "flashUploadPath": "/Management/UploadFileByForm", //普通表单上传地址
            "h5Opts": {
                multiple: false,
                accept: "image/*",
                filter: function (files) {
                    var passedFiles = [];
                    _.each(files, function (fileData) {
                        if (util.getFileType(fileData) == "jpg") {
                            passedFiles.push(fileData);
                        } else {
                            util.alert('请选择图片格式的文件');
                        }
                    });
                    return passedFiles;
                }
            },
            "flashOpts": {
                file_types: "*.jpg;*.gif;*.jpeg;*.png",
                file_types_description: "图片格式",
                button_width: 80,
                button_height: 25
            },
            "onSelect": function (file) {
                this.startUpload();
            },
            "onSuccess": function (file, responseText) {
                //上传成功后处理
                var responseData = json.parse(responseText);
                var filePath;
                if (responseData.success) {
                    filePath = responseData.value.filePath;
                    util.api({
                        type: 'post',
                        data: {
                            "picPath": filePath
                        },
                        url: '/Management/UploadMainPic',
                        success: function (responseData) {
                            var random = new Date() / 1;
                            if (responseData.success) {
                                //更换login image
                                tplLoginImgEl.attr('src', loginPath + '&r=' + random);
                            }
                        }
                    });
                }
            },
            "onComplete": function () {
                //上传成功后清理文件缓存
                this.removeAllFile();
            }
        });
        //点击logo恢复默认按钮
        restoreLogoBtnEl.click(function () {
            util.api({
                type: 'post',
                url: '/Management/ClearLogo',
                success: function (responseData) {
                    var random = new Date() / 1;
                    if (responseData.success) {
                        //更换logo
                        logoImgEl.attr('src', logoPath + '&r=' + random);
                        tplLogoImgEl.attr('src', logoPath + '&r=' + random);
                    }
                }
            });
        });
        //点击login恢复默认按钮
        restoreLoginBtnEl.click(function () {
            util.api({
                type: 'post',
                url: '/Management/ClearMainPic',
                success: function (responseData) {
                    var random = new Date() / 1;
                    if (responseData.success) {
                        //更换login image
                        tplLoginImgEl.attr('src', loginPath + '&r=' + random);
                    }
                }
            });
        });
        //页面设置默认的logo图片
        tplLogoImgEl.attr('src', logoPath + '&r=' + (new Date() / 1));
        tplLoginImgEl.attr('src', loginPath + '&r=' + (new Date() / 1));

        //客户管理部分
        //修改上级权限
        customManageWrap.on('click', '.f-sub', function (evt) {
            var isAllow = $('.control-modify-parent', customManageWrap).prop('checked');
            util.api({
                type: 'post',
                data: {
                    "isAllow": !isAllow
                },
                url: '/Management/SetIsAllowSetOwnLeader',
                success: function (responseData) {
                    if (responseData.success) {
                        //$('.control-modify-parent',customManageWrap).prop('checked',false);
                        globalData.isAllowSetOwnLeader = !isAllow;
                        util.alert("保存成功");
                    }
                }
            });
        });
        //修改导出权限
        customManageWrap.on('click', '.f-sub-exportdata', function (evt) {
            var isAllow = $('.control-modify-exportdata', customManageWrap).prop('checked');
            util.api({
                type: 'post',
                data: {
                    "isAllow": !isAllow
                },
                url: '/Management/SetIsAllowExportData',
                success: function (responseData) {
                    if (responseData.success) {
                        //$('.control-modify-exportdata',customManageWrap).prop('checked',false);
                        globalData.isAllowExportData = !isAllow;
                        util.alert("保存成功");
                    }
                }
            });
        });

        //修改添加权限
        customManageWrap.on('click', '.f-sub-isforbidden', function (evt) {
            var isForbidden = $('.control-modify-isforbidden', customManageWrap).prop('checked');
            util.api({
                type: 'post',
                data: {
                    "isForbidden": isForbidden
                },
                url: '/Management/SetIsForbiddenCreateFCustomer',
                success: function (responseData) {
                    if (responseData.success) {
                        //$('.control-modify-exportdata',customManageWrap).prop('checked',false);
                        globalData.isForbiddenCreateFCustomer = !isForbidden;
                        util.alert("保存成功");
                    }
                }
            });
        });

        tplEvent.on('switched', function (tplName2, tplEl) {
            if (tplName2 == tplName) {
                $('.control-modify-parent', customManageWrap).prop('checked', !globalData.isAllowSetOwnLeader);//勾选修改上级权限
                $('.control-modify-exportdata', customManageWrap).prop('checked', !globalData.isAllowExportData);//勾选修改导出权限
                $('.control-modify-isforbidden', customManageWrap).prop('checked', globalData.isForbiddenCreateFCustomer);//勾选修改添加权限
            }

        });
        //客户管理权限控制
        /*if(globalData.model==1){
         $('.flag-left-list .custom-manage-item',tplEl).hide();
         }*/
        //登录页设置权限控制
        if (globalData.isLoginPagePersonalization) {
            $('.login-setting-item', tplEl).show();
        }
        /**
         * 信息发送范围设置
         * liuxiaofan
         * 2014-04-03
         */

        var ModifyInfoArea = function (opts) {
            opts = $.extend({
                element: null //容器是JQ对象
            }, opts || {});
            this.opts = opts;
            this.element = opts.element;
            this.init(); //初始化
        };
        $.extend(ModifyInfoArea.prototype, {
            init: function () {
                var elEl = this.element;
                var opts = this.opts;
                this.render();
                this.bindEvents(); //事件绑定
            },
            render: function () {
                this.setDom();//绑定DOM
                this._getAllShortEmployees();//获取所有员工和部门数据
            },
            load: function () {
                var that = this;
                //获取所有限制发送全公司的员工列表
                util.api({
                    "url": '/Management/GetFullCompanyLimitWithEmployee',
                    "type": 'get',
                    "dataType": 'json',
                    "success": function (responseData) {
                        var datas = responseData.value.employees;
                        if (responseData.success) {
                            that.modifyEmployeeBd.html(that._formatListHtml(datas));
                            that.employeesCountEl.html(datas.length);
                        }
                    }
                });
                //获取所有限制发送全公司的部门列表
                util.api({
                    "url": '/Management/GetFullCompanyLimitWithCircle',
                    "type": 'get',
                    "dataType": 'json',
                    "success": function (responseData) {
                        var datas = responseData.value.circles;
                        if (responseData.success) {
                            that.modifyCircleBd.html(that._formatListHtml(datas));
                            that.circlesCountEl.html(datas.length);
                        }
                    }
                });
            },
            setDom: function () {
                var elEl = this.element;
                this.modifyEmployeeBd = elEl.find('.modify-employee-bd');
                this.modifyCircleBd = elEl.find('.modify-circle-bd');
                this.employeesCountEl = elEl.find('.employees-count');
                this.circlesCountEl = elEl.find('.circles-count');
            },
            bindEvents: function () {
                var elEl = this.element;
                var that = this;
                //设置员工的按钮
                elEl.on('click', '.modify-employee-submit-btn', function () {
                    if (that.employeesDialog) {
                        that.employeesDialog.show();
                    } else {
                        that._renderEmployeesDialog();
                    }
                    that.employeesDialog.setTitle('选择员工');
                    //重新请求弹框内数据保证最新
                    util.api({
                        "url": '/Management/GetFullCompanyLimitWithEmployee',
                        "type": 'get',
                        "dataType": 'json',
                        "success": function (responseData) {
                            var datas = responseData.value.employees;
                            if (responseData.success) {
                                _.each(datas, function (data) {
                                    data.id = data.employeeID;
                                });
                                that._setEmployeeInitData(datas); //传员工
                            }
                        }
                    });
                });
                //设置部门的按钮
                elEl.on('click', '.modify-circle-submit-btn', function () {
                    if (that.circlesDialog) {
                        that.circlesDialog.show();
                    } else {
                        that._renderCirclesDialog();
                    }
                    that.circlesDialog.setTitle('选择部门');
                    //重新请求弹框内数据保证最新
                    util.api({
                        "url": '/Management/GetFullCompanyLimitWithCircle',
                        "type": 'get',
                        "dataType": 'json',
                        "success": function (responseData) {
                            var datas = responseData.value.circles;
                            if (responseData.success) {
                                that._setCircleInitData(datas); //传部门
                            }
                        }
                    });
                });
            },
            destroy: function () {
                this.element.remove();
            },
            /**
             * 获取所有员工和部门的数据
             * @returns {array}
             */
            _getAllShortEmployees: function () {
                var that = this;
                //所有员工
                util.api({
                    "url": '/Management/GetAllShortEmployees',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {},
                    "success": function (responseData) {
                        var datas = responseData.value;
                        if (responseData.success) {
                            _.each(datas, function (data) {
                                data.id = data.employeeID;
                            });
                            that.allEmployeesData = datas; //把所有员工的数据保存起来
                        }
                    }
                });
                //所有部门
                util.api({
                    "url": '/Management/GetAllCircleInfos',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {},
                    "success": function (responseData) {
                        var datas = responseData.value;
                        if (responseData.success) {

                            that.allCirclesData = datas; //把所有员工的数据保存起来
                        }
                    }
                });
            },
            /**
             * 渲染选择员工的弹框
             */
            _renderEmployeesDialog: function () {
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
                }).render().show();
            },
            /**
             * 渲染选择部门的弹框
             */
            _renderCirclesDialog: function () {
                this.circlesDialog = new JoinDialog({
                    "unjoinLabel": "未选部门",
                    "joinLabel": "已选部门",
                    "unit": "项",
                    "bbarUnit": "项",
                    "inputPlaceholder": "输入关键词，快速筛选部门",
                    "unjoinEmptyTip": "没有未选部门",
                    "unjoinSearchEmptyTip": "没有筛选条件为{{keyword}}的部门",
                    "joinEmptyTip": "没有已选部门",
                    "joinSearchEmptyTip": "没有筛选条件为{{keyword}}的部门"
                }).render().show();
            },
            /**
             * 选择员工弹框的内部操作
             * @param {[int]}
             */
            _setEmployeeInitData: function (joinData) {
                var employeesDialog = this.employeesDialog;
                var that = this;
                var joinDataNewArray = [];
                _.each(joinData, function (data) {
                    joinDataNewArray.push(data.employeeID);
                });
                var unjoinData = util.excludeDataByKey(joinDataNewArray, 'id', that.allEmployeesData); //所有员工里面排除已选的员工
                employeesDialog.setInitData({
                    "joinData": joinData,
                    "unjoinData": unjoinData
                });
                //弹框的确定按钮
                employeesDialog.set('successCb', function (joinData) {
                    // 获取数据添加和移除人的数据
                    var dataState = this.joinList.getDataState();
                    var lostDatas = dataState.lost;
                    var addDatas = dataState.add;
                    var lostDatasArray = [];
                    var addDatasArray = [];
                    var oData = {};
                    _.each(addDatas, function (addData) {
                        addDatasArray.push(addData.employeeID);
                    });
                    _.each(lostDatas, function (lostData) {
                        lostDatasArray.push(lostData.employeeID);
                    });

                    //提交
                    util.api({
                        "url": '/Management/ModifyFullCompanyLimitWithEmployee',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            addEmployeeIDs: addDatasArray,
                            deleteEmployeeIDs: lostDatasArray
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                employeesDialog.hide();
                                that.load(); //刷新列表
                            }
                        }
                    }, {
                        "submitSelector": $('.f-sub', employeesDialog.element)
                    });
                });
            },
            /**
             * 选择部门弹框的内部操作
             * @param {[int]}
             */
            _setCircleInitData: function (joinData) {
                var circlesDialog = this.circlesDialog;
                var that = this;
                var joinDataNewArray = [];
                _.each(joinData, function (data) {
                    joinDataNewArray.push(data.id);
                });
                var unjoinData = util.excludeDataByKey(joinDataNewArray, 'id', that.allCirclesData); //所有部门里面排除已选的部门
                circlesDialog.setInitData({
                    "joinData": joinData,
                    "unjoinData": unjoinData
                });
                //弹框的确定按钮
                circlesDialog.set('successCb', function (joinData) {
                    // 获取数据添加和移除人的数据
                    var dataState = this.joinList.getDataState();
                    var lostDatas = dataState.lost;
                    var addDatas = dataState.add;
                    var lostDatasArray = [];
                    var addDatasArray = [];
                    var oData = {};
                    _.each(addDatas, function (addData) {
                        addDatasArray.push(addData.id);
                    });
                    _.each(lostDatas, function (lostData) {
                        lostDatasArray.push(lostData.id);
                    });
                    //提交
                    util.api({
                        "url": '/Management/ModifyFullCompanyLimitWithCircle',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            addCircleIDs: addDatasArray,
                            deleteCircleIDs: lostDatasArray
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                circlesDialog.hide();
                                that.load(); //刷新列表
                            }
                        }
                    }, {
                        "submitSelector": $('.f-sub', circlesDialog.element)
                    });
                });
            },

            //拼列表
            _formatListHtml: function (datas) {
                var dataListStr = '';
                var dataUlStr = '';
                _.each(datas, function (data, index) {
                    dataListStr += '<li>' + data.name + '</li>';
                });
                dataUlStr = '<ul class="modify-com-list fn-clear">' + dataListStr + '</ul>';
                return dataUlStr;
            }

        });
        var modifyInfoArea = new ModifyInfoArea({
            element: modifyFullCompanyLimitWrap
        });
        modifyInfoArea.load();
    };
});