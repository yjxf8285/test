define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event,
        store = tpl.store,
        list = tpl.list;

    var util = require('util'),
        leftNav = require('modules/app-report-leftnav/app-report-leftnav'),
        ReportList = require('modules/app-reportsetting/app-reportsetting-list/app-reportsetting-list'),
        SettingOptions = require('modules/app-reportsetting/app-reportsetting-options/app-reportsetting-options'),
        ReportSettinglayers = require('modules/app-reportsetting/app-reportsetting-layers/app-reportsetting-layers'),
        ReportSettingLogs = require('modules/app-reportsetting/app-reportsetting-logs/app-reportsetting-logs'),
        ReportSettingRules = require('modules/app-reportsetting/app-reportsetting-rules/app-reportsetting-rules'),
        Tab = require('uilibs/tabs2');


    var tplEl,
        reportList,
        settingOptions,
        reportSettinglayers,
        reportSettingRules,
        reportSettingLogs,
        type = 'create', //create || edit
        nowStepNum = 0,
        nowtemplateID = 0,
        tab;


    /**
     * 页面载入执行函数
     */
    exports.init = function () {
        tplEl = exports.tplEl;
        type = 'create', //create || edit
            nowStepNum = 0,
            nowtemplateID = 0;
        var tplName = exports.tplName;
        // 设置左侧导航
        leftNav.init($('.tpl-l', tplEl));
        var pagEl = $('.report-list-pagination', tplEl);
        //控制页面跳转逻辑在此
        reportList = new ReportList({
            wrapEl: $('.report-manage-content .report-list-content', tplEl),
            pagEl: pagEl,
            url: '/DataReporting/GetTemplatesByAdmin',
            data: {
                status:0,// int，状态：0：全部；1：未启用；2：暂停；3：启用
                sortType: 1,//int，排序类型：1：按创建时间倒序；2：按状态排序；3：按创建人排序
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，页号
            }
        });
        reportList.init();
        reportList.on('beginCreate', exports.beginCreate);
        reportList.on('beginEdit', exports.beginEdit);
        settingOptions = new SettingOptions({
            wrapEl: $('.report-setting-options .report-setting-content', tplEl)
        });
        settingOptions.init();
        settingOptions.on('cancelCreate', exports.cancelCreate);
        settingOptions.on('beginEdit', exports.beginEdit);
        settingOptions.on('beginCreate', exports.beginCreate);
        settingOptions.on('tplNameChange', exports.changeName);

        reportSettinglayers = new ReportSettinglayers({
            wrapEl: $('.report-setting-layers .report-setting-content', tplEl)
        });
        reportSettinglayers.on('beginEdit', exports.beginEdit);
        reportSettinglayers.on('cancelCreate', exports.cancelCreate);
        reportSettinglayers.on('beginCreate', exports.beginCreate);
        // 第3步要先new出来
        reportSettingRules = new ReportSettingRules({
            warpEl: $('.report-setting-rules .report-setting-content', tplEl),
            url: '/DataReporting/GetTemplateConfig',

            data: {
                type: type,
                templateID: 0//先设置默认值0 后面会有赋值
            }
        });
        reportSettingRules.on('beginCreate', exports.beginCreate);
        reportSettingRules.on('editSuccess', exports.cancelCreate);
        
        //初始化编辑tabs
        tab = new Tab({
            "element": $('.report-edit-tabs', tplEl),//容器
            "container": tplEl,//大父级容器
            "items": [
                {value: "tab-options", text: "设置报表项"},
                {value: "tab-layer", text: "设置汇报层级"},
                {value: "tab-rules", text: "设置规则"},
                {value: "tab-logs", text: "修改日志"}
            ]
        });
        bindTabs();
        
        // 修改日志
        reportSettingLogs = new ReportSettingLogs({
            warpEl: $('.report-setting-logs', tplEl)
        });
        
        // 返回按钮
        tplEl.on('click', '.report-back', function () {
            if (type == 'create') {
                if (nowStepNum > 1) {
                    exports.beginCreate({
                        step: nowStepNum - 1,
                        templateID: nowtemplateID
                    });
                } else {
                    exports.cancelCreate();
                }

            } else {
                exports.cancelCreate();
            }
        });
        //回到列表页
        tplEl.on('click', '.backtolist, .reportmanage-list', function () {
            exports.cancelCreate();
        });
    };


    /**
     * 绑定tab切换事件
     */
    var bindTabs = function () {
        tab.on('change', function (beforeTab, nowTab) {
        	var step = 1;
        	switch(nowTab) {
        	case 'tab-options':
        		step = 1;
        		break;
        	case 'tab-layer':
        		step = 2;
        		break;
        	case 'tab-rules':
        		step = 3;
        		break;
        	case 'tab-logs':
        		step = 4;
        		break;
        	}
        	exports.beginEdit({
                templateID: $('.report-edit-tplname', tplEl).attr('data-tplid'),
                step: step
            });
        });
    };
    /**
     * 修改名称
     */
    exports.changeName = function (data) {
        $('.report-edit-tplname', tplEl).text(data.name).attr('data-tplid', data.templateID);
    };
    /**
     * 进入创建
     */
    exports.beginCreate = function (data) {
    	$('.report-title-setting', tplEl).show();
        $('.report .report-list-ctner').hide();
        $('.report .report-edit-ctner').show();
        $('.report-edit-header', tplEl).hide();
        $('.report-create-header', tplEl).show();
        $('.report-setting-title', tplEl).show();
        $('.report-btn-box', tplEl).show();
        $('.report-edit-btn-box', tplEl).hide();
        $('.report-back-ctner', tplEl).show();

        var step = data.step,
            templateID = data.templateID;

        if (step == 1) {

            $('.report-setting-rules, .report-setting-layers').hide();
            $('.report-setting-options').show();
            settingOptions.show({templateID: templateID});
            $('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-options clear');
            type = 'create';

        } else if (step == 2) {

            $('.report-setting-options, .report-setting-rules').hide();
            $('.report-setting-layers').show();
            reportSettinglayers.refresh(templateID);
            settingOptions.reset();
            $('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-layer clear');

        }
        $('.bread-last', tplEl).html('创建报表');
        nowStepNum = step;
    };
    /**
     * 放弃创建
     */
    exports.cancelCreate = function (data) {
        type = 'create';
        nowStepNum = 0;
        nowtemplateID = 0;
        $('.report .report-edit-ctner').hide();
        $('.report .report-list-ctner').show();
        $('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-options clear');
        $('.report-back-ctner', tplEl).hide();
       /* reportList.refresh({
            pageNumber:1
        });*/
        reportList.pagination.jump(1);//跳到第一页
        settingOptions && settingOptions.reset();
        reportSettinglayers && reportSettinglayers.reset();
        resetTab();
        //可根据step分别处理
        //var step = data.step;
    };
    
    //重置tab
    var resetTab = function(){
    	tab && tab.reset();
    };
    /**
     * 进入编辑报表(对于第二、三步，始终是edit)
     */
    exports.beginEdit = function (data) {
        $('.report-list-ctner', tplEl).hide();
        $('.report-edit-ctner', tplEl).show();
        $('.report-back-ctner', tplEl).show();
        var templateID = data.templateID,
            step = data.step;
        nowtemplateID = templateID;
        if (step == 1) {
            $('.report-setting-rules, .report-setting-layers, .report-setting-logs').hide();
            $('.report-setting-options').show();
            $('.report-setting-step', tplEl).attr('report-setting-step cur-options clear');
            settingOptions.show({
                templateID: templateID
            });
            type = 'edit';
        } else if (step == 2) {
            $('.report-setting-options, .report-setting-rules, .report-setting-logs').hide();
            $('.report-setting-layers').show();
            reportSettinglayers.refresh(templateID);
            settingOptions.reset();
        } else if (step == 3) {
            $('.report-setting-options, .report-setting-layers, .report-setting-logs').hide();
            $('.report-setting-rules').show();
            reportSettingRules.refresh({
                type: type,
                templateID: templateID

            });
            settingOptions.reset();
            
        } else if (step == 4) { // 修改日志
            $('.report-setting-options, .report-setting-layers, .report-setting-rules').hide();
            $('.report-setting-logs').show();
            reportSettingLogs.refresh(templateID);
        }
        if (type == 'create') {
        	$('.report-title-setting', tplEl).show();
            $('.report-setting-title', tplEl).show();
            $('.report-edit-btn-box', tplEl).hide();
            $('.report-btn-box', tplEl).show();
            $('.report-create-header', tplEl).show();
            $('.report-edit-header', tplEl).hide();
            if(step == 1) {
            	$('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-options clear');
            } else if(step == 2) {
            	$('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-layer clear');
            } else if(step == 3) {
            	$('.report-setting-step', tplEl).attr('class', 'report-setting-step cur-rules clear');
            }
            $('.bread-last', tplEl).html('创建报表');
        } else if (type == 'edit') {
        	$('.report-title-setting', tplEl).hide();
            $('.report-create-header', tplEl).hide();
            $('.report-edit-header', tplEl).show();
            $('.report-setting-title', tplEl).hide();
            $('.report-edit-btn-box', tplEl).show();
            $('.report-btn-box', tplEl).hide();
            $('.bread-last', tplEl).html(data.templateName);
        }
        nowStepNum = step;
    };


});
