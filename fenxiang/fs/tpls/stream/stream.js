/**
 * Steam模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var util = require('util'),
        moment = require('moment'),
        json=require('json'),
        Events=require('events'),
        Tabs = require('uilibs/tabs'),
        Dialog = require('dialog'),
        publish = require('modules/publish/publish.js'),
        FsSchedule = require('modules/fs-schedule/fs-schedule'),
        Validator = require('validator'),
        clientStore=require('store'),
        tplCommon = require('./stream-common'),
        FeedList = require('modules/feed-list/feed-list'),
        announcement=require('modules/fs-announcement/fs-announcement'),
        worktodo=require('modules/fs-worktodo/fs-worktodo');

    var AtInput = publish.atInput,
        MediaMaker = publish.mediaMaker,
        SelectBar = publish.selectBar,
        DateSelect = publish.dateSelect,
        TimeSelect = publish.timeSelect,
        Receipt=publish.Receipt,
        MyHistoryPlan=publish.MyHistoryPlan;
    //公告
    var NewNoticeDialog=announcement.NewNoticeDialog,
        NoticeBanner=announcement.NoticeBanner;
    //待办
    var NewWorktodoDialog=worktodo.NewWorktodoDialog;
	/*邀请同事 START*/
    var InviteColleague=tplCommon.InviteColleague;
	/*邀请同事 END*/
    var Stream = function (opts) {
        opts=_.extend({
            "tplEl":null,
            "tplName":"",
            "autoInit":true, //自动渲染
            "feedListPath":"/Feed/GetFeeds",   //默认请求的feedlist接口
            "applyFeedlistRd":{},   //默认附加到feedlist的请求参数
            "beforeFeedListParse":function(responseData){   //覆盖feedlist中的beforeListParse配置项
                return responseData;
            },
            "feedListSuccessCb":FS.EMPTY_FN, //列表返回成功回调
            "feedlistConfig":{} //feedlist配置
        },opts||{});
        this.opts=opts;
        this.tplEl = opts.tplEl||exports.tplEl;
        this.tplName = opts.tplName||exports.tplName;
        opts.autoInit&&this.init();
    };
    _.extend(Stream.prototype, {
        init: function () {
            this.dataInit();
            this.publishInit();
            /*this.planInit();
            this.approveInit();
            this.workInit();
            this.shareInit();*/
            this.feedInit();
            this.rightSideBarInit();
            this.otherInit();
        },
        /*formatContactData: function (contactData, type) {
            var formatData = [];
            _.each(contactData, function (itemData) {
                formatData.push({
                    "name": itemData.name,
                    "id": itemData.id,
                    "spell": itemData.spell.toLowerCase(),
                    "type": type
                });
            });
            return formatData;
        },*/
        dataInit: function () {
            /*var contactData = util.deepClone(FS.getAppStore('contactData') || {});
            var contactPersonData = contactData.members,
                contactGroupData = contactData.groups;
            this.contactPersonData = this.formatContactData(contactPersonData, 'p');
            this.contactGroupData = this.formatContactData(contactGroupData, 'g');*/
            var contactData =util.getContactData();
            this.contactPersonData = contactData['p'];
            this.contactGroupData = contactData['g'];
            this.currentUserData=contactData['u'];
        },
        /**
         * 初始化输入框
         */
        atInputInit:function(){
            var that=this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                publishInputEl = $('.publish-input', publishWEl);
            //输入框at功能
            new AtInput({
                "element": publishInputEl
            });
            //禁用esc键
            publishInputEl.keydown(function(evt){
                if(evt.keyCode==27){
                    evt.preventDefault();
                }
            });
            //页面切回后重新调整输入框大小
            tpl.event.on('switched', function (tplName2, tplEl) {
                if (tplName2 == that.tplName) {
                    publishInputEl.trigger('autosize.resize');
                }
            });
        },
        publishInit: function () {
            var that = this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                publishInputEl = $('.publish-input', publishWEl);
            var mediaShareEl=$('.media-share',publishWEl),  //共享media实例
                mediaShare;
            var pageConfig=util.getEnterpriseConfig(107,true)||{};
            this.atInputInit();
            mediaShare = new MediaMaker({
                "element": mediaShareEl,
                "action": ["h5imgupload","h5attachupload","vote","at","topic"],
                "actionOpts": {
                    "vote":{
                        "contactData":this.contactPersonData
                    },
                    "at": {
                        "inputSelector": publishInputEl
                    },
                    "topic": {
                        "inputSelector": publishInputEl
                    },
                    "h5imgupload":{
                        "flashFallback":true  //对于不支持h5上传的要启用flash回退
                    },
                    "h5attachupload":{
                        "flashFallback":true  //对于不支持h5上传的要启用flash回退
                    }
                }
            });
            //构建发布框tabs
            var publishTabs = new Tabs({
                "element": publishWEl,
                "triggers": $('.fs-publish-nav', publishWEl),
                "panels": $('.fs-publish-panel', publishWEl),
                "activeTriggerClass": "ui-tab-item-current",
                "activeIndex": 0,
                "triggerType": 'click',
                "withTabEffect": true,   //切换动画
                "triggerBgTop":"5px",    //手动设置切换背景的top值
                "triggerBgCls":"publish-tab-trigger-wrapper" //设置trigger cls
            }).render();
            //设置media data引用
            $('.media',publishTabs.get('panels')).data('media',mediaShare);

            //功能面板显隐控制
            publishWEl.on('click','.panel-visible-h',function(){
                var meEl=$(this),
                    panelEl=meEl.closest('.fs-publish-panel'),
                    publishFormEl=$('.fs-publish-form',panelEl),
                    formThumbEl=$('.form-thumb',panelEl);
                publishFormEl.hide();
                formThumbEl.show();
                meEl.hide();
                //触发publishhide事件
                that.trigger('publishhide',panelEl);

            }).on('click','.ui-tab-item-current a',function(evt){   //点击当前激活tab导航时显示功能表单
                var curPanelEl = publishTabs.get('panels').eq(publishTabs.get('activeIndex')),
                    formThumbEl=$('.form-thumb',curPanelEl);    //缩略功能区
                //手动触发显示功能表单
                formThumbEl.click();
                evt.preventDefault();
            }).on('click','.form-thumb',function(){
                var meEl=$(this),
                    panelEl=meEl.closest('.fs-publish-panel'),
                    publishFormEl=$('.fs-publish-form',panelEl),
                    visibleEl=$('.panel-visible-h',panelEl);
                publishFormEl.show();
                //默认光标进入输入框
                $('.publish-input',publishFormEl).get(0).focus();
                meEl.hide();
                visibleEl.show();
                //触发publishhide事件
                that.trigger('publishshow',panelEl);
            });
            //延迟渲染publishTabs里的其他组件
            publishTabs.on('switched',function(toIndex, fromIndex){
                var curPanelEl = publishTabs.get('panels').eq(toIndex),
                    fromPanelEl=publishTabs.get('panels').eq(fromIndex),
                    currentInputEl=$('.publish-input',curPanelEl),  //当前input框
                    fromLastInputEl=$('.publish-input',fromPanelEl).last(), //上一个panel中的最后一个input
                    formThumbEl=$('.form-thumb',curPanelEl),    //缩略功能区
                    feedName=curPanelEl.attr('feedname'),
                    mediaHostEl=$('.media',curPanelEl);    //media容器
                var fromInputVal=fromLastInputEl.val();
                if(!curPanelEl.data('rendered')){
                    that[feedName+'Init']&&that[feedName+'Init']();
                    curPanelEl.data('rendered',true);
                }
                //展开功能区
                if(formThumbEl.is(':visible')){
                    formThumbEl.click();
                }
                //重新设置media位置和引用
                if($('.media-share',mediaHostEl).length==0){
                    mediaShareEl.appendTo(mediaHostEl);
                }
                //设置media功能键可见性
                if(curPanelEl.attr('feedname')=="share"){
                    mediaShare.showAction('vote');
                }else{
                    mediaShare.hideAction('vote');
                }
                //将上一个panel中的input移到当前input中
                if(fromInputVal.length>0){
                    currentInputEl.last().val(fromInputVal).keyup().change();
                }else{
                    currentInputEl.last().val('').keyup().change();
                }
                //触发，调整输入框大小
                currentInputEl.trigger('autosize.resize');
                currentInputEl.last().get(0).focus();   //聚焦
                //先清理回执和历史日志引导图
                $('.fs-guide-send-receipt-bracket,.fs-guide-history-plan-bracket').remove();
                //判断是否显示回执引导图
                if(feedName=="share"){
                    if(!that.currentUserData["isDemoAccount"]&&pageConfig.IsShowReceiptTip&&$('.fs-guide-bracket').length==0){
                        util.showGuideTip($('.sms-wrapper',curPanelEl),{
                            "leftLeftIncrement":0,  //左侧边框左移动增
                            "rightLeftIncrement":0, //右侧边框左移动增量
                            "imageName":"receiption.png",
                            "imagePosition":{
                                "top":"-94px",
                                "left":"20px"
                            },
                            "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                                //模拟图片map映射
                                var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                                    closeBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                                var closeCb=function(){
                                    pageConfig.IsShowReceiptTip=false;
                                    util.setEnterpriseConfig(107,pageConfig,true);
                                    util.updateEnterpriseConfig(107);
                                    leftEl.remove();
                                    rightEl.remove();
                                    $('.fs-guide-history-plan-bracket').css('visibility','visible');
                                };
                                leftEl.addClass('fs-guide-send-receipt-bracket');
                                rightEl.addClass('fs-guide-send-receipt-bracket');
                                $('.fs-guide-history-plan-bracket').css('visibility','hidden');
                                closeLinkEl.css({
                                    "width":"26px",
                                    "height":"26px",
                                    "position":"absolute",
                                    "top":"9px",
                                    "left":"236px",
                                    "cursor":"pointer"
                                }).appendTo(imgWEl);
                                closeBtnEl.css({
                                    "width":"140px",
                                    "height":"32px",
                                    "position":"absolute",
                                    "top":"124px",
                                    "left":"88px",
                                    "cursor":"pointer"
                                }).appendTo(imgWEl);
                                //点击关闭
                                closeLinkEl.click(function(){
                                    closeCb();
                                });
                                //点击关闭按钮
                                closeBtnEl.click(function(){
                                    closeCb();
                                });
                                hostEl.one('click',function(){
                                    closeCb();
                                });
                            }
                        });
                    }
                }else if(feedName=="plan"){
                    if(!that.currentUserData["isDemoAccount"]&&!pageConfig.IsSkipPlan){    //并且日志数量大于7
                        util.showGuideTip($('.show-history-plan-l',curPanelEl),{   //历史日志引导提醒
                            "leftTopIncrement":-5,
                            "rightTopIncrement":-5,
                            "rightLeftIncrement":-5,
                            "imageName":"history-plan.png",
                            "imagePosition":{
                                "top":"-160px",
                                "left":"-225px"
                            },
                            "imagePlace":"left",
                            "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                                var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>');
                                var closeCb=function(){
                                    pageConfig.IsSkipPlan=true;
                                    util.setEnterpriseConfig(107,pageConfig,true);
                                    util.updateEnterpriseConfig(107);
                                    leftEl.remove();
                                    rightEl.remove();
                                };
                                leftEl.addClass('fs-guide-history-plan-bracket');
                                rightEl.addClass('fs-guide-history-plan-bracket');
                                closeLinkEl.css({
                                    "width":"26px",
                                    "height":"26px",
                                    "position":"absolute",
                                    "top":"4px",
                                    "right":"24px",
                                    "cursor":"pointer"
                                }).appendTo(imgWEl);
                                //点击关闭按钮
                                closeLinkEl.click(function(){
                                    closeCb();
                                });
                                hostEl.one('click',function(){
                                    closeCb();
                                });
                            }
                        });
                    }
                }
            });
            //客户端存储feed内容
            var lastInputFeedInfo,
                contentInputEl;
            if(clientStore.enabled){
                contentInputEl=publishInputEl;
                contentInputEl.keyup(function(){
                    var meEl=$(this);
                    var val= _.str.trim(meEl.val()),
                        name=meEl.attr('name'),
                        info= _.extend(clientStore.get('lastInputFeedInfo')||{},{
                            'employeeId':that.currentUserData['id']
                        });
                    info[name]=val;
                    clientStore.set('lastInputFeedInfo', info);
                });
                //设置默认值
                lastInputFeedInfo=clientStore.get('lastInputFeedInfo');
                if(lastInputFeedInfo&&(lastInputFeedInfo.employeeId==this.currentUserData['id'])){
                    contentInputEl.filter('[name="content"]').val(lastInputFeedInfo.content).keyup().change();
                    contentInputEl.filter('[name="report"]').val(lastInputFeedInfo.report).keyup().change();
                    contentInputEl.filter('[name="plan"]').val(lastInputFeedInfo.plan).keyup().change();
                }else{
                    clientStore.set('lastInputFeedInfo', null);
                }
            }

            //禁用enter提交操作
            //注册publishshow/publishhide事件
            /*that.on('publishshow',function(panelEl){
                if(panelEl.attr('feedname')=="share"){
                    mediaShare.showAction('vote');
                }else{
                    mediaShare.hideAction('vote');
                }
            }); */
            publishTabs.trigger('switched',0,-1);
            //页面第一次打开，plan只显示缩略功能
            //$('.panel-visible-h',publishTabs.get('panels').eq(publishTabs.get('activeIndex'))).click();
            //创建引用
            //this.atInput=atInput;
            this.publishTabs = publishTabs;
        },
        getAtContent: function (inputSelector) {
            return util.getAtFromInput(inputSelector);  //提到util中
        },
        /**
         * 输入at内容分组，返回noExist-不存在的员工;noInclude-未在可视范围的员工
         * @param inputSelector
         * @param rangeSb
         * @returns {{noExist: Array, noInclude: Array}}
         */
        groupAtContent: function (inputSelector, rangeSb) {
            var that = this;
            var atContent = [], //所有at成员
                validAtContent=[],  //有效成员=所有成员-不存在成员
                noExist = [],     //不存在的成员
                noInclude = [];   //未包含在发布范围中的成员
            var inputEl = $(inputSelector);
            //获取发布内容包含的at内容
            inputEl.each(function () {
                atContent = atContent.concat(that.getAtContent(this));
            });
            if (atContent.length > 0) {
                //筛选出所有未知成员
                validAtContent=_.filter(atContent, function (name) {
                    if (!that.isExistContactData(name)) {
                        noExist.push(name);
                        return false;
                    }else{
                        return true;
                    }
                });
                //筛选出所有未包含成员
                _.each(validAtContent, function (name) {
                    if (!that.isIncludeInRange(name, rangeSb)) {
                        noInclude.push(name);
                    }
                });
            }
            //把不包含的的成员信息补充完整
            noInclude=_.map(noInclude,function(name){
                var typeData,
                    type="g";
                //先尝试作为组织信息补充
                typeData=that.getContactDataByName(name,'g');
                if(!typeData){ //没找到组织，肯定是员工信息了
                    typeData=that.getContactDataByName(name,'p');
                    type="p";
                }
                return _.extend({
                    "type":type
                },typeData);    //返回完整的信息
            });

            return {
                "noExist": noExist,
                "noInclude": noInclude,
                "validAtContent":validAtContent
            };
        },
        isExistContactData: function (name) {
            var contactPersonData = this.contactPersonData,
                contactGroupData=this.contactGroupData;
            var found;
            found = _.find(contactPersonData, function (val) {
                if (val.name == name) {
                    return true;
                }
            });
            if(!found){    //没找到员工，开始找部门
                found= _.find(contactGroupData, function (val) {
                    if (val.name == name) {
                        return true;
                    }
                });
            }
            return !!found;
        },
        /**
         * 根据id和type获取对应的contact信息
         * @param id
         * @param type
         */
        getContactDataById: function (id, type) {
            var contactTypeData = (type == "g" ? this.contactGroupData : this.contactPersonData);
            return _.find(contactTypeData, function (tempData) {
                return tempData.id == id;
            });
        },
        /**
         * 根据name和type获取对应的contact信息
         * @param name
         * @param type
         * @returns {*}
         */
        getContactDataByName: function (name, type) {
            var contactTypeData = (type == "g" ? this.contactGroupData : this.contactPersonData);
            return _.find(contactTypeData, function (tempData) {
                return tempData.name == name;
            });
        },
        /**
         * 判定name的员工是否包含在rangeSb选中范围中
         * @param rangeSb
         * @param name
         * @returns {boolean}
         */
        isIncludeInRange: function (name, rangeSb) {
            var that = this;
            var contactPersonData = this.contactPersonData,
                contactGroupData=this.contactGroupData;
            var SbData = rangeSb.getSelectedData(),
                personData = SbData["p"] || [],
                groupData = SbData["g"] || [];
            var include = false,
                tempData,
                typeData;
            //先尝试查询name是否为组织
            typeData=_.find(contactGroupData, function (val) {
                if (val.name == name) {
                    return true;
                }
            });
            if(typeData){   //如果判断为组织
                //继续判断是否在可视范围中
                _.find(groupData, function (id) {
                    tempData = that.getContactDataById(id, 'g');
                    if (tempData.name == name) {
                        return include = true;
                    }
                });
            }else{  //不是组织肯定是员工
                //排查是否已经直接在可视范围中
                _.find(personData, function (id) {
                    tempData = that.getContactDataById(id, 'p');
                    if (tempData.name == name) {
                        return include = true;
                    }
                });
                //如果未包含在发布人群中，则继续查询组织
                if (!include) {
                    _.find(groupData, function (id) {
                        tempData = that.getContactDataById(id, 'g');
                        //if (tempData&&tempData.id == that.getContactDataByName(name, 'p').groupID) {
                        if (tempData&& _.contains(that.getContactDataByName(name, 'p').groupIDs,tempData.id)) {
                            return include = true;
                        }
                    });
                }
            }
            return include;
        },
        /**
         * 获取发布默认选中人
         * @param cateKey
         * @returns {Array}
         */
        getPublishDefaultUser:function(cateKey){
            return util.getPublishDefaultUser(cateKey);
        },
        /**
         * 获取发布的可视范围
         * @param feedTypeName plan/approve/work/schedule...
         * @returns {{}}
         */
        getPublishRange:function(feedTypeName){
            return util.getPublishRange(feedTypeName);
        },
        /**
         * 日志初始化
         */
        "planInit": function () {
            var that = this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                planWEl = $('.fs-publish-plan', publishWEl),   //日志面板
                inputEl = $('.publish-input', planWEl),
                topicTipEl=$('.publish-topic-tip',planWEl), //话题提示
                sendSmsCbEl = $('.send-sms', planWEl),
                planExtendEl = $('.publish-extend', planWEl),
                showHisPlanLinkEl=$('.show-history-plan-l',planWEl),    //显示历史日志链接
                pbarDia,
                pbar;

            var media,
                planExtTabs;
            var getCurrentRangeSb = function () {
                var planExtTabsAi = planExtTabs.get('activeIndex'),   //获得直属领导当前active index tab
                    planExtTabPanelEl = planExtTabs.get('panels').eq(planExtTabsAi),
                    planExtSb = $('.selectbar', planExtTabPanelEl).data('sb');   //当前激活tab下的selectbar组件
                return planExtSb;
            };
            var getRequestData = function () {
                var requestData = {},
                    files;
                var planExtTabsAi = planExtTabs.get('activeIndex'),   //获得直属领导当前active index tab
                    planExtTabPanelEl = planExtTabs.get('panels').eq(planExtTabsAi),
                    planExtSb = getCurrentRangeSb(),   //当前激活tab下的selectbar组件

                    planExtSbData = planExtSb.getSelectedData(),  //selectbar组件选中数据
                    ksfwSb = $('.ksfw .selectbar', planWEl).data('sb'),
                    ksfwSbData = ksfwSb.getSelectedData();
                //获得输入内容
                _.each(['report', 'plan', 'content'], function (logType) {
                    var elEl = $('[name="' + logType + '"]', planWEl);
                    requestData[logType] = _.str.trim(elEl.val());
                });
                //日类类型?日志/周计划/月计划
                requestData["planType"] = planExtTabPanelEl.attr('logtype');
                //直属领导信息
                requestData["leaderID"] = planExtSbData["p"] ? planExtSbData["p"][0] : '';
                //可视范围信息
                requestData["circleIDs"] = ksfwSbData['g'] || [];  //组织
                requestData["employeeIDs"] = ksfwSbData['p'] || [];    //个人
                //默认将直属领导放入可视范围
                if(requestData["leaderID"].length>0){
                    requestData["employeeIDs"].push(requestData["leaderID"]);
                }
                //上传文件信息
                requestData["fileInfos"] = [];
                files = media.getUploadValue();
                _.each(files, function (file) {
                    if (file.uploadType == "img") {
                        requestData["fileInfos"].push({
                            "value": 2, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    } else if (file.uploadType == "attach") {
                        requestData["fileInfos"].push({
                            "value": 3, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    }
                });
                //是否发送短信
                requestData["isSendSms"] = $('[name="sendSms"]', planWEl).prop('checked');
                return requestData;
            };
            var isValid = function () {
                var passed = true,
                    requestData = getRequestData();
                var planExtSb = getCurrentRangeSb();   //当前激活tab下的selectbar组件

                if (requestData["leaderID"].length == 0) {
                    passed = false;
                    $('.input-tip', planExtSb.element).click();
                }
                inputEl.each(function(){
                    var meEl=$(this);
                    var v= _.str.trim(meEl.val()),
                        name=meEl.attr('name');
                    if(name=="report"&&v.length>2000){
                        util.alert('工作总结不能超过2000字，目前已超出<em>'+(v.length-2000)+'</em>个字');
                        passed=false;
                        return false;
                    }
                    if(name=="plan"&&v.length>2000){
                        util.alert('工作计划不能超过2000字，目前已超出<em>'+(v.length-2000)+'</em>个字');
                        passed=false;
                        return false;
                    }
                    if(name=="content"&&v.length>10000){
                        util.alert('心得体会不能超过10000字，目前已超出<em>'+(v.length-10000)+'</em>个字');
                        passed=false;
                        return false;
                    }
                });
                return passed;

            };
            /**
             * 发布后清理
             */
            var clear = function () {
                //发布框清空
                inputEl.val("").height(50).change();
                //多媒体清空
                media.resetAll();
                //直属领导清理
                /*$('.selectbar', planWEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });*/

                //可视范围重置
                $('.ksfw .selectbar', planWEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });
                //发送短信重置
                sendSmsCbEl.prop('checked', false);
                //隐藏话题提示
                topicTipEl.hide();
            };
            var groupAt = function () {
                var ksfwSb = $('.ksfw .selectbar', planWEl).data('sb');
                return that.groupAtContent(inputEl, ksfwSb);
            };
            var getPersonalConfig=function(){
                var requestData=getRequestData(),
                    leaderId=requestData["leaderID"],
                    leaderData=util.getContactDataById(leaderId,'p'),
                    employeeIDs=requestData["employeeIDs"], //员工
                    circleIDs=requestData["circleIDs"], //部门
                    rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                    rangeNames=""; //可视范围名称
                var planLeaders=util.getPersonalConfig('planLeaders')||[],
                    planEmployees=util.getPersonalConfig('planEmployees')||[],
                    planRanges=util.getPersonalConfig('planRanges')||[];
                //直属领导
                planLeaders= _.filter(planLeaders,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=leaderId;
                });
                //前插一个新的
                planLeaders.unshift({
                    "dataID": leaderId,
                    "isCircle":false,
                    "name":leaderData.name
                });
                if(planLeaders.length>5){
                    planLeaders.pop();  //大于5的话干掉最后一个
                }

                //可视范围中的员工
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    planEmployees= _.filter(planEmployees,function(configItem){     //先删掉以前存储的
                        return configItem.dataID!=employeeId;
                    });
                    //前插一个新的
                    planEmployees.unshift({
                        "dataID": employeeId,
                        "isCircle":false,
                        "name":employeeData.name
                    });
                    if(planEmployees.length>5){
                        planEmployees.pop();  //大于5的话干掉最后一个
                    }
                });
                //可视范围
                if(circleIDs.length+employeeIDs.length>1){
                    planRanges= _.filter(planRanges,function(configItem){     //先删掉以前存储的
                        return configItem.dataIDs!=rangeIds;
                    });

                    _.each(circleIDs,function(circleId){
                        var circleData=util.getContactDataById(circleId,'g');
                        rangeNames+=circleData.name+'，';
                    });
                    _.each(employeeIDs,function(employeeId){
                        var employeeData=util.getContactDataById(employeeId,'p');
                        rangeNames+=employeeData.name+'，';
                    });
                    //干掉最后一个逗号
                    if(rangeNames.length>0){
                        rangeNames=rangeNames.slice(0,-1);
                    }
                    //前插一个新的
                    planRanges.unshift({
                        "dataIDs": rangeIds,
                        "names":rangeNames
                    });
                    if(planRanges.length>5){
                        planRanges.pop();  //大于5的话干掉最后一个
                    }
                }
                return {
                    "planLeaders":planLeaders,
                    "planEmployees":planEmployees,
                    "planRanges":planRanges
                };
            };
            var updateSbAcInitData=function(){
                //选择任务执行人
                $('.selectbar', planExtendEl).each(function () {
                    var sb=$(this).data('sb');
                    sb.opts.acInitData=that.getPublishDefaultUser('planLeaders');
                });
                //可视范围
                $('.ksfw .selectbar', planWEl).each(function () {
                    var sb = $(this).data('sb');
                    sb.opts.acInitData=that.getPublishRange('plan');
                });
            };
            //查看历史日志
            var myHistoryPlan=new MyHistoryPlan({
                //"trigger":showHisPlanLinkEl,
                "inputSelector":{
                    "today":inputEl.eq(0),   //今日工作总结
                    "tomorrow":inputEl.eq(1),    //明日工作计划
                    "xdth":inputEl.eq(2) //心得提会
                }
            });
            showHisPlanLinkEl.click(function(evt){
                myHistoryPlan.show();
                evt.preventDefault();
            });
            //planWEl.data('media',media); //test
            //media.destroy();
            //设置多媒体功能
            /*media = new MediaMaker({
                "element": $('.media', planWEl),
                "action": ["imgUpload", "attachUpload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });*/
            media=$('.media', planWEl).data('media');
            //如果输入框中有话题信息，显示话题tip，没有隐藏
            inputEl.keyup(function(){
                var meEl=$(this);
                var v= _.str.trim(meEl.val()),
                    name=meEl.attr('name');
                if(/#[^\n]+?#/g.test(v)){
                    topicTipEl.slideDown(200,function(){
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                }else{
                    topicTipEl.slideUp(200,function(){
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                }

                /*if(name=="report"&&v.length>2000){    //工作总结2k
                    meEl.val(v.slice(0,2000)).trigger('autosize.resize');
                }
                if(name=="plan"&&v.length>2000){    //工作计划2k
                    meEl.val(v.slice(0,2000)).trigger('autosize.resize');
                }
                if(name=="content"&&v.length>10000){    //心得体会1W
                    meEl.val(v.slice(0,10000)).trigger('autosize.resize');
                }*/
            });
            /*inputEl.keydown(function(evt){
                var meEl=$(this),
                    v= _.str.trim(meEl.val()),
                    name=meEl.attr('name');
                if(name=="report"&&v.length>2000){    //工作总结2k
                    evt.preventDefault();
                }
                if(name=="plan"&&v.length>2000){    //工作计划2k
                    evt.preventDefault();
                }
                if(name=="content"&&v.length>10000){    //心得体会1W
                    evt.preventDefault();
                }
            });*/
            planExtTabs = new Tabs({
                "element": planExtendEl,
                "triggers": $('.publish-extend-nav', planExtendEl),
                "panels": $('.publish-extend-panel', planExtendEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click',
                "triggerBgTop":"0"
            }).render();
            planExtTabs.on('switch', function (toIndex, fromIndex) {
                var curPanelEl = planExtTabs.get('panels').eq(toIndex),
                    logTypeText = curPanelEl.attr('logtypetext').split(',');
                var inputBoxEl = $('.publish-input-wrapper label', planWEl).slice(0, 2);    //前两个input框
                inputBoxEl.each(function (i) {
                    var meEl = $(this),
                        logTypeTextEl = $('.logtype-text', meEl);
                    logTypeTextEl.text(logTypeText[i]);
                });
                //设置日志历史planType
                myHistoryPlan.set('planType',toIndex+1);
            }).on('switched', function (toIndex, fromIndex) {
                var curPanelEl = planExtTabs.get('panels').eq(toIndex),
                    fromPanelEl=planExtTabs.get('panels').eq(fromIndex),
                    currentSb = $('.selectbar',curPanelEl).data('sb'),
                    fromSb=$('.selectbar',fromPanelEl).data('sb');
                var fromSbSelectData=fromSb.getSelectedData(),
                    defaultEmployeeId,
                    defaultSd;
                currentSb.removeAllItem();
                if(fromSbSelectData["p"]){
                    defaultEmployeeId=fromSbSelectData["p"][0];
                    defaultSd={
                        "id":defaultEmployeeId,
                        "name":util.getContactDataById(defaultEmployeeId,'p').name,
                        "type":'p'
                    };
                    currentSb.addItem(defaultSd);
                }
            });
            //media.element.insertAfter(planExtendEl).css('margin-top','0px');
            //选择直属领导
            $('.selectbar', planExtendEl).each(function () {
                var planleaders=that.getPublishDefaultUser('planLeaders'),
                    planStore=planleaders[0].store,
                    defaultUserData=planStore[0],
                    defaultSelectedData=[];
                //如果存在默认选中人，赋给selectbar默认值
                if(defaultUserData){
                    defaultSelectedData=[{
                        "id":defaultUserData.id,
                        "name":defaultUserData.value,
                        "type":"p"
                    }];
                }
                //直属领导不能选择自己,filter掉
                var contactPersonData=util.deepClone(that.contactPersonData);
                contactPersonData= _.filter(contactPersonData,function(pData){
                    return pData.id!=that.currentUserData.id;
                });
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactPersonData
                        }
                    ],
                    "title": "选择日志点评人",
                    "singleCked": true,  //只能单选
                    "acInitData":that.getPublishDefaultUser('planLeaders'),
                    "defaultSelectedData":defaultSelectedData,
                    "autoCompleteTitle": "请输入姓名或拼音"
                });
                $(this).data('sb', sb);
            });
            $('.ksfw .selectbar', planWEl).each(function () {
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": that.contactPersonData
                        },
                        {
                            "title": "部门",
                            "type": "g",
                            "list": that.contactGroupData,
                            "unitSuffix":"个部门"
                        }
                    ],
                    "acInitData":that.getPublishRange('plan'),
                    "title": "选择抄送范围&#8230;",
                    "autoCompleteTitle": "请输入部门或同事的名称或拼音"
                });
                $(this).data('sb', sb);
                sb.on('inputshow',function(){
                    sb.setAcInitData(that.getPublishRange('plan'));
                });
            });
            //发日志
            var validator = new Validator({
                element: $('.fs-publish-log-form', planWEl),
                autoSubmit: false,
                checkOnSubmit: true,
                onFormValidated: function (error, results, element) {
                    if (error) {
                        _.each(results, function (itemData) {
                            var elEl = itemData[2];
                            if (elEl.hasClass('publish-input')) {
                                //elEl.closest('.publish-input-wrapper').
                                that.publishErrorHl(elEl.closest('.publish-input-wrapper'));
                            }
                        });
                    }
                }
            });
            //至少有一个输入框非空
            validator.addItem({
                element: inputEl,
                required: true,
                display: '请输入内容'
            });
            inputEl.change(function () {
                var required = true;
                var item = validator.query(inputEl);
                inputEl.each(function () {
                    var meEl = $(this),
                        v = _.str.trim(meEl.val());
                    if (v.length > 0) {
                        required = false;
                        return false;   //跳出循环
                    }
                });
                item.set('required', required);
            });
            //监听publishhide事件，清空form
            this.on('publishhide',function(panelEl){
                if(panelEl.attr('feedname')=="plan"){
                    clear();
                }
            });
            //注册验证对象
            this.regValidator({
                "validator": validator,
                "media": media,
                "isValid": isValid,   //自定义验证
                "clear": clear,   //发布后清理
                "sendPath": "/FeedPlan/SendFeedPlan", //发布接口
                "getRequestData": getRequestData,   //请求数据
                "groupAt": groupAt,   //at who 内容分组
                "getPersonalConfig":getPersonalConfig,   //获取个人配置信息
                "updateSbAcInitData":updateSbAcInitData
            });
        },
        "approveInit": function () {
            var that = this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                approveWEl = $('.fs-publish-approve', publishWEl),   //审批面板
                inputEl = $('.publish-input', approveWEl),
                topicTipEl=$('.publish-topic-tip',approveWEl), //话题提示
                sendSmsCbEl = $('.send-sms', approveWEl),
                approveExtendEl = $('.publish-extend', approveWEl),
                leaveEl = $('.leave', approveWEl),
                baoxiaoEl = $('.baoxiao', approveWEl),
                leaveRowTpl = $('.leave-row-tpl', approveWEl).html(),
                baoxiaoRowTpl = $('.baoxiao-row-tpl', approveWEl).html(),
                baoxiaoSummaryEl = $('.baoxiao-summary', approveWEl),
                baoxiaoUpperEl = $('.upper-text', baoxiaoSummaryEl),
                baoxiaoTjEl = $('.num-text', baoxiaoSummaryEl),
                leaveTimeSpanEl=$('.total-time-span',approveWEl),   //请假单总时间
                i = 0,
                leaveMinRowNum = 3,
                baoxiaoMinRowNum = 3,
                pbarDia,
                pbar;

            var media,
                approveExtTabs;
            /**
             * 动态生成一条请假单
             * @param {[type]} rowTpl [description]
             */
            var addLeaveRow = function (rowTpl) {
                var rowEl = $(rowTpl || leaveRowTpl);
                var startDate,
                    startTime,
                    endDate,
                    endTime,
                    startDateWEl,
                    startTimeWEl,
                    endDateWEl,
                    endTimeWEl;

                rowEl.appendTo(leaveEl);
                //初始化请假类型
                /*new Select({
                 trigger: $('.cate-wrapper select',rowEl)
                 }).render();*/
                //初始化日期和时间下拉菜单
                startDateWEl = $('.start-date-wrapper', rowEl);
                startDate = new DateSelect({
                    "element": startDateWEl,
                    "placeholder": "选择日期"
                });
                endDateWEl = $('.end-date-wrapper', rowEl);
                endDate = new DateSelect({
                    "element": endDateWEl,
                    "placeholder": "选择日期"
                });
                startTimeWEl = $('.start-time-wrapper', rowEl);
                startTime = new TimeSelect({
                    "element": startTimeWEl,
                    "placeholder": "选择时间"
                });
                endTimeWEl = $('.end-time-wrapper', rowEl);
                endTime = new TimeSelect({
                    "element": endTimeWEl,
                    "placeholder": "选择时间"
                });
                //如果time栏为空，选择date栏时默认选中第一个time option
                startDate.on('change', function () {
                    if (startTime.getValue() == "") {
                        startTime.selector.select(0);
                    }
                });
                endDate.on('change', function () {
                    if (endTime.getValue() == "") {
                        endTime.selector.select(0);
                    }
                });

                //清空input change事件
                $('.cate', leaveEl).unbind('change');
                $('.cate', rowEl).change(function () {
                    addLeaveRow();
                });
                return rowEl;
            };
            /**
             * 动态生成一条报销单
             * @param {[type]} rowTpl [description]
             */
            var addBaoxiaoRow = function (rowTpl) {
                var rowEl = $(rowTpl || baoxiaoRowTpl);
                rowEl.appendTo(baoxiaoEl);
                //清空input change事件
                $('input', baoxiaoEl).unbind('change');
                $('input', rowEl).change(function () {
                    addBaoxiaoRow();
                });
                return rowEl;
            };
            var getCurrentRangeSb = function () {
                var approveExtTabsAi = approveExtTabs.get('activeIndex'),   //获得审批人当前active index tab
                    approveExtTabPanelEl = approveExtTabs.get('panels').eq(approveExtTabsAi),
                    approveExtSb = $('.selectbar', approveExtTabPanelEl).data('sb');   //当前激活tab下的selectbar组件
                return approveExtSb;
            };
            var getRequestData = function () {
                var requestData = {},
                    files;
                var approveExtTabsAi = approveExtTabs.get('activeIndex'),   //获得审批人当前active index tab
                    approveExtTabPanelEl = approveExtTabs.get('panels').eq(approveExtTabsAi),
                    approveExtSb = $('.selectbar', approveExtTabPanelEl).data('sb'),   //当前激活tab下的selectbar组件
                    approveExtSbData = approveExtSb.getSelectedData(),  //selectbar组件选中数据
                    ksfwSb = $('.ksfw .selectbar', approveWEl).data('sb'),
                    ksfwSbData = ksfwSb.getSelectedData();
                //获得输入内容
                requestData["content"] = _.str.trim($('[name="content"]', approveWEl).val());
                //审批类型?普通/请假单/报销单
                requestData["approveType"] = approveExtTabPanelEl.attr('approvetype');
                //审批人信息
                requestData["currentApproverID"] = approveExtSbData["p"] ? approveExtSbData["p"][0] : '';
                //可视范围信息
                requestData["circleIDs"] = ksfwSbData['g'] || [];  //组织
                requestData["employeeIDs"] = ksfwSbData['p'] || [];    //个人
                //默认将审批人信息放入可视范围
                if(requestData["currentApproverID"].length>0){
                    requestData["employeeIDs"].push(requestData["currentApproverID"]);
                }
                requestData["approveDetail"]=[];    //审批细节
                //请假单
                if(requestData["approveType"]=="2"){
                    $('tbody tr',leaveEl).each(function(){
                        var trEl=$(this);
                        var startDate=$('.start-date-wrapper input',trEl).val(),
                            startTime=$('.start-time-wrapper input',trEl).val(),
                            endDate=$('.end-date-wrapper input',trEl).val(),
                            endTime=$('.end-time-wrapper input',trEl).val();
                        requestData["approveDetail"].push({
                            "reasonType":parseInt($('.cate',trEl).val()),
                            "reasonTypeDesc":$('.cate option:selected',trEl).text(),
                            "startDate":startDate,  //for 验证
                            "stopDate":endDate,   //for 验证
                            "startTime":startTime,  //for 验证
                            "stopTime":endTime,    //for 验证
                            "beginTime":startDate?moment(startDate+" "+startTime,'YYYYMMDD HH:mm').unix():0,
                            "endTime":endDate?moment(endDate+" "+endTime,'YYYYMMDD HH:mm').unix():0,
                            "hours": parseFloat(_.str.trim($('.time-span-edit',trEl).val()))
                        });
                    });
                }
                //报销单
                if(requestData["approveType"]=="3"){
                    $('tbody tr',baoxiaoEl).each(function(){
                        var trEl=$(this);
                        requestData["approveDetail"].push({
                            "title": _.str.trim($('.cate',trEl).val()),
                            "amount":parseFloat(_.str.trim($('.amount',trEl).val())),
                            "remark":_.str.trim($('.mark',trEl).val())
                        });
                    });
                }
                //清除全空行
                requestData["approveDetail"]= _.reject(requestData["approveDetail"],function(itemData){
                    var isEmpty=true;
                    _.find(itemData,function(itemValue){
                        if(!!itemValue){
                            isEmpty=false;
                            return true;
                        }
                    });
                    return isEmpty;
                });
                //approveDetail转换成字符串类型
                requestData["approveDetail"]=json.stringify(requestData["approveDetail"]);

                //上传文件信息
                requestData["fileInfos"] = [];
                files = media.getUploadValue();
                _.each(files, function (file) {
                    if (file.uploadType == "img") {
                        requestData["fileInfos"].push({
                            "value": 2, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    } else if (file.uploadType == "attach") {
                        requestData["fileInfos"].push({
                            "value": 3, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    }
                });
                //是否发送短信
                requestData["isSendSms"] = $('[name="sendSms"]', approveWEl).prop('checked');
                return requestData;
            };
            var isValid = function () {
                var passed = true,
                    requestData = getRequestData(),
                    approveType=requestData["approveType"],
                    approveDetail=json.parse(requestData["approveDetail"]);
                var approveExtSb = getCurrentRangeSb();
                if (requestData["currentApproverID"].length == 0) {
                    passed = false;
                    $('.input-tip', approveExtSb.element).click();
                    return false;
                }
                if(requestData['content'].length>2000){
                    util.alert('发布内容不能超过2000字，目前已超出<em>'+(requestData['content'].length-2000)+'</em>个字');
                    passed=false;
                    return false;
                }
                //发布细节验证
                if(approveType=="2"){   //请假单
                    passed=!(_.find(approveDetail,function(itemData){
                        if(!itemData["reasonType"]){
                            util.alert("请假事项不能为空");
                            return true;
                        }
                        if(itemData["beginTime"]==0){
                            util.alert("请假开始时间不能为空");
                            return true;
                        }
                        if(itemData["endTime"]==0){
                            util.alert("请假结束时间不能为空");
                            return true;
                        }
                        if(moment.unix(itemData["beginTime"]).isAfter(moment.unix(itemData["endTime"]))){
                            util.alert("结束时间需大于开始时间");
                            return true;
                        }
                        if(moment.unix(itemData["beginTime"]).isSame(moment.unix(itemData["endTime"]))){
                            util.alert("结束时间需大于开始时间");
                            return true;
                        }
                        if(!itemData["hours"]){
                            util.alert("请输入请假时间，以小时计算");
                            return true;
                        }
                        if(isNaN(itemData["hours"])){
                            util.alert("请输入有效的请假时间");
                            return true;
                        }
                    }));
                }
                if(approveType=="3"){   //报销单
                    passed=!(_.find(approveDetail,function(itemData){
                        if(!itemData["title"]){
                            util.alert("报销项名称不能为空");
                            return true;
                        }
                        if(!itemData["amount"]){
                            util.alert("请输入报销金额");
                            return true;
                        }
                        if(isNaN(itemData["amount"])){
                            util.alert("请输入有效的报销金额");
                            return true;
                        }
                    }));
                }
                return passed;
            };
            /**
             * 初始化请假单
             */
            var leaveInit = function () {
                for (i = 0; i < leaveMinRowNum; i++) {
                    addLeaveRow();
                }
            };
            /**
             * 初始化报销单
             */
            var baoxiaoInit = function () {
                for (i = 0; i < baoxiaoMinRowNum; i++) {
                    addBaoxiaoRow();
                }
            };
            /**
             * 发布后清理
             */
            var clear = function () {
                //发布框清空
                inputEl.val("").height(50);
                //多媒体清空
                media.resetAll();
                //审批人清理
                /*$('.selectbar', approveExtendEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });*/
                //报销单和请假单重新初始化
                $('tbody',leaveEl).empty();
                $('tbody',baoxiaoEl).empty();
                $('.num',leaveTimeSpanEl).text("0");
                baoxiaoUpperEl.text("");
                baoxiaoTjEl.text("");
                leaveInit();
                baoxiaoInit();

                //可视范围重置
                $('.ksfw .selectbar', approveWEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });
                //发送短信重置
                sendSmsCbEl.prop('checked', false);
                //隐藏话题提示
                topicTipEl.hide();
            };
            var groupAt = function () {
                var ksfwSb = $('.ksfw .selectbar', approveWEl).data('sb');
                return that.groupAtContent(inputEl, ksfwSb);
            };
            var getPersonalConfig=function(){
                var requestData=getRequestData(),
                    approverID=requestData["currentApproverID"],
                    approveData=util.getContactDataById(approverID,'p'),
                    employeeIDs=requestData["employeeIDs"], //员工
                    circleIDs=requestData["circleIDs"], //部门
                    rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                    rangeNames=""; //可视范围名称
                var approveApprovers=util.getPersonalConfig('approveApprovers')||[],
                    approveEmployees=util.getPersonalConfig('approveEmployees')||[],
                    approveRanges=util.getPersonalConfig('approveRanges')||[];
                //直属领导
                approveApprovers= _.filter(approveApprovers,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=approverID;
                });
                //前插一个新的
                approveApprovers.unshift({
                    "dataID": approverID,
                    "isCircle":false,
                    "name":approveData.name
                });
                if(approveApprovers.length>5){
                    approveApprovers.pop();  //大于5的话干掉最后一个
                }

                //可视范围中的员工
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    approveEmployees= _.filter(approveEmployees,function(configItem){     //先删掉以前存储的
                        return configItem.dataID!=employeeId;
                    });
                    //前插一个新的
                    approveEmployees.unshift({
                        "dataID": employeeId,
                        "isCircle":false,
                        "name":employeeData.name
                    });
                    if(approveEmployees.length>5){
                        approveEmployees.pop();  //大于5的话干掉最后一个
                    }
                });
                //可视范围
                if(circleIDs.length+employeeIDs.length>1){
                    approveRanges= _.filter(approveRanges,function(configItem){     //先删掉以前存储的
                        return configItem.dataIDs!=rangeIds;
                    });

                    _.each(circleIDs,function(circleId){
                        var circleData=util.getContactDataById(circleId,'g');
                        rangeNames+=circleData.name+'，';
                    });
                    _.each(employeeIDs,function(employeeId){
                        var employeeData=util.getContactDataById(employeeId,'p');
                        rangeNames+=employeeData.name+'，';
                    });
                    //干掉最后一个逗号
                    if(rangeNames.length>0){
                        rangeNames=rangeNames.slice(0,-1);
                    }
                    //前插一个新的
                    approveRanges.unshift({
                        "dataIDs": rangeIds,
                        "names":rangeNames
                    });
                    if(approveRanges.length>5){
                        approveRanges.pop();  //大于5的话干掉最后一个
                    }
                }
                return {
                    "approveApprovers":approveApprovers,
                    "approveEmployees":approveEmployees,
                    "approveRanges":approveRanges
                };
            };
            var updateSbAcInitData=function(){
                //选择任务执行人
                $('.selectbar', approveExtendEl).each(function () {
                    var sb=$(this).data('sb');
                    sb.opts.acInitData=that.getPublishDefaultUser('approveApprovers');
                });
                //可视范围
                $('.ksfw .selectbar', approveWEl).each(function () {
                    var sb = $(this).data('sb');
                    sb.opts.acInitData=that.getPublishRange('approve');
                });
            };
            //初始化请假单
            leaveInit();
            //初始化报销单
            baoxiaoInit();
            //请假单效果
            leaveEl.on('change', 'input.time-span-edit', function () {
                var timeSpanEl = $('input.time-span-edit', leaveEl),
                    totalTime = 0;
                timeSpanEl.each(function () {
                    var meEl = $(this),
                        v = _.str.trim(meEl.val());
                    if (v.length > 0) {
                        v = parseFloat(v);
                        if (!isNaN(v)) {
                            v = parseFloat(v.toFixed(1));
                            totalTime += v;
                            meEl.val(v);
                        } else {
                            meEl.val('0');
                        }
                    }
                });
                $('.num',leaveTimeSpanEl).text(totalTime.toFixed(1));
            });
            //报销单统计
            baoxiaoEl.on('change', 'input.amount', function () {
                var amountEl = $('input.amount', baoxiaoEl),
                    totalAmount = 0;
                amountEl.each(function () {
                    var meEl = $(this),
                        v = _.str.trim(meEl.val());
                    if (v.length > 0) {
                        v = parseFloat(v);
                        if (!isNaN(v)) {
                            v = parseFloat(v.toFixed(2));
                            totalAmount += v;
                            meEl.val(v.toFixed(2));
                        } else {
                            meEl.val('非有效数字');
                        }
                    }
                });
                //截取小数点后两位
                totalAmount=parseFloat(totalAmount.toFixed(2));
                baoxiaoUpperEl.text(util.digitUppercase(totalAmount));
                baoxiaoTjEl.text(totalAmount.toFixed(2));

            });

            //设置多媒体功能
            /*media = new MediaMaker({
                "element": $('.media', approveWEl),
                "action": ["imgUpload", "attachUpload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });*/
            media = $('.media', approveWEl).data('media');
            //如果输入框中有话题信息，显示话题tip，没有隐藏
            inputEl.keyup(function(){
                var meEl=$(this);
                var v= _.str.trim($(this).val());
                if(/#[^\n]+?#/g.test(v)){
                    topicTipEl.slideDown(200);
                }else{
                    topicTipEl.slideUp(200);
                }
                /*if(v.length>2000){    //
                    meEl.val(v.slice(0,2000)).trigger('autosize.resize');
                }*/
            });
            approveWEl.on('keydown','.baoxiao-wrapper input,.leave-wrapper input',function(evt){
                if(evt.keyCode==13){      //防回车提交
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            });
            /*inputEl.keydown(function(evt){
                var meEl=$(this),
                    v= _.str.trim(meEl.val());
                if(v.length>2000){    //2000字限制
                    evt.preventDefault();
                }
            });*/
            approveExtTabs = new Tabs({
                "element": approveExtendEl,
                "triggers": $('.publish-extend-nav', approveExtendEl),
                "panels": $('.publish-extend-panel', approveExtendEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click',
                "triggerBgTop":"0"
            }).render();
            approveExtTabs.on('switched',function(toIndex,fromIndex){
                var curPanelEl = approveExtTabs.get('panels').eq(toIndex),
                    fromPanelEl=approveExtTabs.get('panels').eq(fromIndex),
                    currentSb = $('.selectbar',curPanelEl).data('sb'),
                    fromSb=$('.selectbar',fromPanelEl).data('sb');
                var fromSbSelectData=fromSb.getSelectedData(),
                    defaultEmployeeId,
                    defaultSd;
                currentSb.removeAllItem();
                if(fromSbSelectData["p"]){
                    defaultEmployeeId=fromSbSelectData["p"][0];
                    defaultSd={
                        "id":defaultEmployeeId,
                        "name":util.getContactDataById(defaultEmployeeId,'p').name,
                        "type":'p'
                    };
                    currentSb.addItem(defaultSd);
                }
            });
            //选择审批人
            $('.selectbar', approveExtendEl).each(function () {
                var approveApprovers=that.getPublishDefaultUser('approveApprovers'),
                    approveStore=approveApprovers[0].store,
                    defaultUserData=approveStore[0],
                    defaultSelectedData=[];
                //如果存在默认选中人，赋给selectbar默认值
                if(defaultUserData){
                    defaultSelectedData=[{
                        "id":defaultUserData.id,
                        "name":defaultUserData.value,
                        "type":"p"
                    }];
                }
                //审批人不能选择自己,filter掉
                var contactPersonData=util.deepClone(that.contactPersonData);
                contactPersonData= _.filter(contactPersonData,function(pData){
                    return pData.id!=that.currentUserData.id;
                });
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactPersonData
                        }
                    ],
                    "singleCked": true,  //只能单选
                    "acInitData":approveApprovers,
                    "defaultSelectedData":defaultSelectedData,
                    "title": "选择审批人",
                    "autoCompleteTitle": "请输入姓名或拼音"
                });
                $(this).data('sb', sb);
            });
            //可视范围
            $('.ksfw .selectbar', approveWEl).each(function () {
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": that.contactPersonData
                        },{
                            "title": "部门",
                            "type": "g",
                            "list": that.contactGroupData,
                            "unitSuffix":"个部门"
                        }
                    ],
                    "acInitData":that.getPublishRange('approve'),
                    "title": "选择抄送范围&#8230;",
                    "autoCompleteTitle": "请输入部门或同事的名称或拼音"
                });
                $(this).data('sb', sb);
            });
            //发审批
            var validator = new Validator({
                element: $('.fs-publish-approve-form', approveWEl),
                autoSubmit: false,
                checkOnSubmit: true,
                onFormValidated: function (error, results, element) {
                    if (error) {
                        _.each(results, function (itemData) {
                            var elEl = itemData[2];
                            if (elEl.hasClass('publish-input')) {
                                that.publishErrorHl(elEl.closest('.publish-input-wrapper'));
                            }
                        });
                    }
                }
            });
            //输入非空
            validator.addItem({
                element: $('[name="content"]', approveWEl),
                required: true,
                errormessageRequired: ''
            });
            //监听publishhide事件，清空form
            this.on('publishhide',function(panelEl){
                if(panelEl.attr('feedname')=="approve"){
                    clear();
                }
            });
            //注册验证对象
            this.regValidator({
                "validator": validator,
                "media": media,
                "isValid": isValid,   //自定义验证
                "clear": clear,   //发布后清理
                "sendPath": "/FeedApprove/SendFeedApprove", //发布接口
                "getRequestData": getRequestData,   //请求数据
                "groupAt": groupAt,   //at who 内容分组
                "getPersonalConfig":getPersonalConfig,
                "updateSbAcInitData":updateSbAcInitData
            });
        },
        "workInit": function () {
            var that = this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                workWEl = $('.fs-publish-work', publishWEl),   //任务面板
                inputEl = $('.publish-input', workWEl), //输入框
                topicTipEl=$('.publish-topic-tip',workWEl), //话题提示
                sendSmsCbEl = $('.send-sms', workWEl),
                workExtendEl = $('.publish-extend', workWEl),
                smsWarnCountsEl = $('.sms-warn-counts', workWEl),
                smsWarnListEl = $('.sms-warn-list', workWEl),
                smsWarnRowTpl = $('.sms-warn-tpl', workWEl).html(),
                pbarDia,
                pbar;

            var media;
            //初始化任务完成时间
            var taskCompleteDtEl = $('.task-complete-datetime', workWEl),
                taskCompleteDsEl = $('.date-select-wrapper', taskCompleteDtEl),
                taskCompleteTsEl = $('.time-select-wrapper', taskCompleteDtEl),
                taskCompleteDs,
                taskCompleteTs;
            taskCompleteDs = new DateSelect({
                "element": taskCompleteDsEl,
                "placeholder": "请选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            taskCompleteTs = new TimeSelect({
                "element": taskCompleteTsEl,
                "placeholder": "请选择时间"
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            taskCompleteDs.on('change', function () {
                if (taskCompleteTs.getValue() == ""&&taskCompleteDs.getValue() != "") {
                    taskCompleteTs.selector.select(0);
                }
            });
            /**
             * 动态生成一条短信提醒
             * @param {[type]} rowTpl [description]
             */
            var addSmsWarnRow = function (data, rowTpl) {
                var rowEl,
                    dateWEl,
                    timeWEl,
                    dateSelect,
                    timeSelect;
                var compiled;
                data = data || {"counts": 0};
                rowTpl = rowTpl || smsWarnRowTpl;
                compiled = _.template(rowTpl);
                rowEl = $(compiled(data));
                rowEl.appendTo(smsWarnListEl);

                dateWEl = $('.date-select-wrapper', rowEl);
                timeWEl = $('.time-select-wrapper', rowEl);
                dateSelect = new DateSelect({
                    "element": dateWEl,
                    "placeholder": "请选择日期",
                    "formatStr":"YYYY年MM月DD日（dddd）"
                });
                timeSelect = new TimeSelect({
                    "element": timeWEl,
                    "placeholder": "请选择时间"
                });
                rowEl.data('dateSelect', dateSelect);
                rowEl.data('timeSelect', timeSelect);

                //如果time栏为空，选择date栏时默认选中第一个time option
                dateSelect.on('change', function () {
                    if (timeSelect.getValue() == ""&&dateSelect.getValue() != "") {
                        timeSelect.selector.select(0);
                    }
                });
                return rowEl;
            };
            var getRequestData = function () {
                var requestData = {},
                    files;
                var workExtSb = $('.selectbar', workExtendEl).data('sb'),   //当前激活tab下的selectbar组件
                    workExtSbData = workExtSb.getSelectedData(),  //selectbar组件选中数据
                    smsWarnItemEl = $('.sms-warn-list .sms-warn', workWEl),    //短信提醒列表
                    ksfwSb = $('.ksfw .selectbar', workWEl).data('sb'),
                    ksfwSbData = ksfwSb.getSelectedData();
                var compDate = taskCompleteDs.getValue(),
                    compTime = taskCompleteTs.getValue();
                //获得输入内容
                requestData["content"] = _.str.trim($('[name="content"]', workWEl).val());
                //任务发出人
                //requestData["assignerID"] ="13";    //TODO:需要替换成当前登录用户,后台自动获取
                requestData["assignerID"]=that.currentUserData.id;
                //任务执行人信息
                requestData["executerID"]=workExtSbData["p"]||[];
                //任务完成时间
                if (compDate.length > 0) {
                    //requestData["completeTime"] = compDate + 'T' + compTime + ':00Z';
                    requestData["deadline"] = moment(compDate+" "+compTime,'YYYYMMDD HH:mm').unix();
                } else {
                    requestData["deadline"] = '';
                }
                //短信提醒类型
                requestData["smsRemindType"]=parseInt($(':checked',smsWarnCountsEl).val())+1; //1表示无提醒，以此类推加1
                //短信提示时间
                requestData["smsRemindTimes"] = [];
                smsWarnItemEl.each(function () {
                    var meEl = $(this),
                        dateSelect = meEl.data('dateSelect'),
                        timeSelect = meEl.data('timeSelect'),
                        dateValue = dateSelect.getValue(),
                        timeValue = timeSelect.getValue();
                    if (dateValue.length > 0) {
                        //requestData["smsRemindTimes"].push(dateValue + 'T' + timeValue + ':00Z');
                        requestData["smsRemindTimes"].push({
                            "value":requestData["smsRemindTimes"].length+1,   //顺序
                            "value1":moment(dateValue+" "+timeValue,'YYYYMMDD HH:mm').unix()  //提醒时间
                        });
                    }

                });
                //可视范围信息
                requestData["circleIDs"] = ksfwSbData['g'] || [];  //组织
                requestData["employeeIDs"] = ksfwSbData['p'] || [];    //个人
                //默认将任务执行人放入可视范围
                /*if(requestData["executerID"].length>0){
                    requestData["employeeIDs"].push(requestData["executerID"]);
                }
                if(requestData["executerIDs"].length>0){
                    requestData["employeeIDs"]=requestData["employeeIDs"].concat(requestData["executerIDs"]);
                }*/
                requestData["employeeIDs"]=requestData["employeeIDs"].concat(requestData["executerID"]);
                //上传文件信息
                requestData["fileInfos"] = [];
                files = media.getUploadValue();
                _.each(files, function (file) {
                    if (file.uploadType == "img") {
                        requestData["fileInfos"].push({
                            "value": 2, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    } else if (file.uploadType == "attach") {
                        requestData["fileInfos"].push({
                            "value": 3, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    }
                });
                //是否发送短信
                requestData["isSendSms"] = $('[name="sendSms"]', workWEl).prop('checked');
                return requestData;
            };
            var isValid = function () {
                var passed = true,
                    requestData = getRequestData();
                var workExtSb = $('.selectbar', workExtendEl).data('sb'),
                    tempEl;
                if (requestData["executerID"].length==0) {  //可以是多个ExecuterID
                    passed = false;
                    $('.input-wrapper',workExtSb.element).click();
                }
                if(requestData['content'].length>2000){
                    util.alert('发布内容不能超过2000字，目前已超出<em>'+(requestData['content'].length-2000)+'</em>个字');
                    passed=false;
                    return false;
                }
                //完成时间
                if (requestData["deadline"].length==0) {
                    passed = false;
                    //date input
                    tempEl=$('.date-select-wrapper input',taskCompleteDtEl);
                    if(_.str.trim(tempEl.val()).length==0){
                        that.publishErrorHl(tempEl);
                    }
                    //time input
                    tempEl=$('.time-select-wrapper input',taskCompleteDtEl);
                    if(_.str.trim(tempEl.val()).length==0){
                        that.publishErrorHl(tempEl);
                    }
                }
                //短信提醒
                /*if(parseInt(requestData["smsRemindType"])>0){
                    if(requestData["smsRemindTimes"].length==0){
                        $('.sms-warn-datetime',smsWarnListEl).each(function(){
                            that.publishErrorHl($('.date-select-wrapper input',this));
                        });
                        passed=false;
                    }else{
                        _.find(requestData["smsRemindTimes"],function(v,i){
                            var dateTimeEl=$('.sms-warn-datetime',smsWarnListEl).eq(i);
                            if(v==""){
                                passed=false;
                                //date input
                                tempEl=$('.date-select-wrapper input',dateTimeEl);
                                if(_.str.trim(tempEl.val()).length==0){
                                    that.publishErrorHl(tempEl);
                                }
                                //time input
                                tempEl=$('.time-select-wrapper input',dateTimeEl);
                                if(_.str.trim(tempEl.val()).length==0){
                                    that.publishErrorHl(tempEl);
                                }
                                return true;
                            }
                        });
                    }
                }*/
                $('.sms-warn-datetime',smsWarnListEl).filter(':visible').each(function(){
                    var tempEl=$('.date-select-wrapper input',this);
                    if(_.str.trim(tempEl.val()).length==0){
                        that.publishErrorHl($('.date-select-wrapper input',this));
                        passed=false;
                    }
                });
                return passed;

            };
            /**
             * 发布后清理
             */
            var clear = function () {
                //发布框清空
                inputEl.val("").height(50);
                //多媒体清空
                media.resetAll();
                //任务执行人清理
                /*$('.selectbar', workExtendEl).data('sb').removeAllItem();*/
                //任务完成时间清理
                taskCompleteDs.clear();
                taskCompleteTs.clear();
                //短信提醒次数清零
                $('input', smsWarnCountsEl).eq(0).click();
                //可视范围重置
                $('.ksfw .selectbar', workWEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });
                //发送短信重置
                sendSmsCbEl.prop('checked', false);
                //隐藏话题提示
                topicTipEl.hide();
            };

            var groupAt = function () {
                var ksfwSb = $('.ksfw .selectbar', workWEl).data('sb');
                return that.groupAtContent(inputEl, ksfwSb);
            };

            var getPersonalConfig=function(){
                var requestData=getRequestData(),
                    executerID=requestData["executerID"],
                    //approveData=util.getContactDataById(approverID,'p'),
                    employeeIDs=requestData["employeeIDs"], //员工
                    circleIDs=requestData["circleIDs"], //部门
                    rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                    rangeNames=""; //可视范围名称
                var workExecuters=util.getPersonalConfig('workExecuters')||[],
                    workEmployees=util.getPersonalConfig('workEmployees')||[],
                    workRanges=util.getPersonalConfig('workRanges')||[];
                //任务执行人
                _.each(executerID,function(id){
                    workExecuters= _.filter(workExecuters,function(configItem){     //先删掉以前存储的
                        return configItem.dataID!=id;
                    });
                });
                _.each(executerID,function(id){
                    var executerData=util.getContactDataById(id,'p');
                    //前插一个新的
                    workExecuters.unshift({
                        "dataID": id,
                        "isCircle":false,
                        "name":executerData.name
                    });
                });

                if(workExecuters.length>5){
                    workExecuters.pop();  //大于5的话干掉最后一个
                }

                //可视范围中的员工
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    workEmployees= _.filter(workEmployees,function(configItem){     //先删掉以前存储的
                        return configItem.dataID!=employeeId;
                    });
                    //前插一个新的
                    workEmployees.unshift({
                        "dataID": employeeId,
                        "isCircle":false,
                        "name":employeeData.name
                    });
                    if(workEmployees.length>5){
                        workEmployees.pop();  //大于5的话干掉最后一个
                    }
                });
                //可视范围
                if(circleIDs.length+employeeIDs.length>1){
                    workRanges= _.filter(workRanges,function(configItem){     //先删掉以前存储的
                        return configItem.dataIDs!=rangeIds;
                    });

                    _.each(circleIDs,function(circleId){
                        var circleData=util.getContactDataById(circleId,'g');
                        rangeNames+=circleData.name+'，';
                    });
                    _.each(employeeIDs,function(employeeId){
                        var employeeData=util.getContactDataById(employeeId,'p');
                        rangeNames+=employeeData.name+'，';
                    });
                    //干掉最后一个逗号
                    if(rangeNames.length>0){
                        rangeNames=rangeNames.slice(0,-1);
                    }
                    //前插一个新的
                    workRanges.unshift({
                        "dataIDs": rangeIds,
                        "names":rangeNames
                    });
                    if(workRanges.length>5){
                        workRanges.pop();  //大于5的话干掉最后一个
                    }
                }
                return {
                    "workExecuters":workExecuters,
                    "workEmployees":workEmployees,
                    "workRanges":workRanges
                };
            };
            var updateSbAcInitData=function(){
                //选择任务执行人
                $('.selectbar', workExtendEl).each(function () {
                    var sb=$(this).data('sb');
                    sb.opts.acInitData=that.getPublishDefaultUser('workExecuters');
                });
                //可视范围
                $('.ksfw .selectbar', workWEl).each(function () {
                    var sb = $(this).data('sb');
                    sb.opts.acInitData=that.getPublishRange('work');
                });
            };
            //设置多媒体功能
            /*media = new MediaMaker({
                "element": $('.media', workWEl),
                "action": ["imgUpload", "attachUpload", "at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });*/
            media= $('.media', workWEl).data('media');
            //如果输入框中有话题信息，显示话题tip，没有隐藏
            inputEl.keyup(function(){
                var meEl=$(this);
                var v= _.str.trim($(this).val());
                if(/#[^\n]+?#/g.test(v)){
                    topicTipEl.slideDown(200);
                }else{
                    topicTipEl.slideUp(200);
                }
                /*if(v.length>2000){    //
                    meEl.val(v.slice(0,2000)).trigger('autosize.resize');
                }*/
            });
            /*inputEl.keydown(function(evt){
                var meEl=$(this),
                    v= _.str.trim(meEl.val());
                if(v.length>2000){    //2000字限制
                    evt.preventDefault();
                }
            });*/
            //选择任务执行人
            $('.selectbar', workExtendEl).each(function () {
                var workExecuters=that.getPublishDefaultUser('workExecuters'),
                    workStore=workExecuters[0].store,
                    defaultUserData=workStore[0],
                    defaultSelectedData=[];
                //如果存在默认选中人，赋给selectbar默认值
                if(defaultUserData){
                    defaultSelectedData=[{
                        "id":defaultUserData.id,
                        "name":defaultUserData.value,
                        "type":"p"
                    }];
                }
                //指令执行人不能选择自己,filter掉
                var contactPersonData=util.deepClone(that.contactPersonData);
                contactPersonData= _.filter(contactPersonData,function(pData){
                    return pData.id!=that.currentUserData.id;
                });
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactPersonData
                        }
                    ],
                    "singleCked": false, //可以多选
                    "title": "选择指令执行人",
                    "acInitData":workExecuters,
                    "defaultSelectedData":defaultSelectedData,
                    "autoCompleteTitle": "请输入姓名或拼音"
                });
                $(this).data('sb', sb);
            });
            //监听短信提醒，动态设置短信提醒时间
            smsWarnCountsEl.on('click', 'input', function () {
                var meEl = $(this),
                    i = 0,
                    counts = parseInt(meEl.val()),
                    readyItemEl = $('.sms-warn', smsWarnListEl),
                    readyItemCount = readyItemEl.length;
                if (readyItemCount >= counts) {
                    readyItemEl.slice(counts).remove();
                } else {
                    for (i = 0; i < counts - readyItemCount; i++) {
                        addSmsWarnRow({
                            "counts": util.changeToChineseNum(i + 1+readyItemCount)
                        });
                    }
                }
            });
            //可视范围
            $('.ksfw .selectbar', workWEl).each(function () {
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": that.contactPersonData
                        },
                        {
                            "title": "部门",
                            "type": "g",
                            "list": that.contactGroupData,
                            "unitSuffix":"个部门"
                        }
                    ],
                    "title": "选择抄送范围&#8230;",
                    "acInitData":that.getPublishRange('work'),
                    "autoCompleteTitle": "请输入部门或同事的名称或拼音"
                });
                $(this).data('sb', sb);
            });
            //发审批
            var validator = new Validator({
                element: $('.fs-publish-work-form', workWEl),
                autoSubmit: false,
                checkOnSubmit: true,
                onFormValidated: function (error, results, element) {
                    if (error) {
                        _.each(results, function (itemData) {
                            var elEl = itemData[2];
                            if (elEl.hasClass('publish-input')) {
                                that.publishErrorHl(elEl.closest('.publish-input-wrapper'));
                            }
                        });
                    }
                }
            });
            //输入非空
            validator.addItem({
                element: $('[name="content"]', workWEl),
                required: true,
                errormessageRequired: ''
            });
            //监听publishhide事件，清空form
            this.on('publishhide',function(panelEl){
                if(panelEl.attr('feedname')=="work"){
                    clear();
                }
            });
            //注册验证对象
            this.regValidator({
                "validator": validator,
                "media": media,
                "isValid": isValid,   //自定义验证
                "clear": clear,   //发布后清理
                "sendPath": "/FeedWork/BatchSendFeedWork", //发布接口
                "getRequestData": getRequestData,   //请求数据
                "groupAt": groupAt,   //at who 内容分组
                "getPersonalConfig":getPersonalConfig,
                "updateSbAcInitData":updateSbAcInitData
            });
        },
        "shareInit": function () {
            var that = this;
            var publishWEl = $('.publish-wrapper', this.tplEl),
                shareWEl = $('.fs-publish-share', publishWEl),   //分享面板
                inputEl = $('.publish-input', shareWEl),   //分享面板
                isSendSmsEl = $('.is-send-sms', shareWEl),
                isReceiptEl=$('.is-receipt',shareWEl),  //回执checkbox
                receiptTipEl=$('.receipt-tip',shareWEl),
                smsRangeGroupEl = $('.send-sms-g', publishWEl),    //发送部门范围
                smsRangePersonEl = $('.send-sms-p', publishWEl),   //发送个人范围
                topicTipEl=$('.publish-topic-tip',shareWEl);  //话题提示
                //smsRangeTipEl = $('.send-sms-tip', publishWEl),    //短信范围提示
                //sendSmsDia,
                //pbarDia,
                //pbar;

            var media,
                receiptDialog;  //回执弹框
            var getRequestData = function () {
                var requestData = {},
                    files;
                var ksfwSb = $('.ksfw .selectbar', shareWEl).data('sb'),
                    ksfwSbData = ksfwSb.getSelectedData(),
                    smsRangeGData = smsRangeGroupEl.val(),
                    smsRangePData = smsRangePersonEl.val();
                var attachTypeNames=[]; //上传附件类型
                var voteData={},    //整合后数据
                    voteValue;  //原始投票数据
                //获得输入内容
                requestData["content"] = _.str.trim($('[name="content"]', shareWEl).val());
                //可视范围信息
                requestData["circleIDs"] = ksfwSbData['g'] || [];  //组织
                requestData["employeeIDs"] = ksfwSbData['p'] || [];    //个人
                //是否回执
                requestData["isSendReceipt"]=isReceiptEl.prop('checked');
                //短信发送范围
                requestData["smsCircleIDs"] = smsRangeGData ? smsRangeGData.split(',') : [];  //组织
                requestData["smsEmployeeIDs"] = smsRangePData ? smsRangePData.split(',') : [];    //个人
                //上传文件信息
                requestData["fileInfos"] = [];
                files = media.getUploadValue();
                _.each(files, function (file) {
                    if (file.uploadType == "img") {
                        requestData["fileInfos"].push({
                            "value": 2, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    } else if (file.uploadType == "attach") {
                        requestData["fileInfos"].push({
                            "value": 3, //FeedAttachType
                            "value1":file.pathName,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    }
                });
                //是否发送短信
                requestData["isSendSms"] = (isSendSmsEl.val()=="1"?true:false);
                //有上传图片或者附件时，内容可以为空,否则必须填内容
                if(requestData.fileInfos.length>0){
                    if(requestData['content'].length==0){
                        attachTypeNames=util.getAttachTypeName(requestData.fileInfos);
                        if(attachTypeNames.length>0){
                            if(attachTypeNames.length>2){     //三个分类或以上用顿号分割
                                requestData['content']='分享'+attachTypeNames.join('、');
                            }else if(attachTypeNames.length>1){ //两个用"和"
                                requestData['content']='分享'+attachTypeNames.join('和');
                            }else{  //一个直接输出
                                requestData['content']='分享'+attachTypeNames[0];
                            }
                        }
                    }
                }
                //投票激活状态附加投票信息
                if(media.isActive('vote')){
                    voteValue=media.voteGetValue();
                    _.each(voteValue,function(v,key){
                        voteData[key]= v.value;
                    });
                    //附件到request data中
                    _.extend(requestData,{
                        "vote":voteData
                    });
                    //另外：提取voteOptions附加到request data中
                    _.extend(requestData,{
                        "voteOptions":voteData["voteOptions"]
                    });
                }else{
                    requestData["vote"]=null;
                }
                return requestData;
            };
            var isValid = function () {
                var passed = true,
                    requestData = getRequestData();
                var ksfwSb = $('.ksfw .selectbar', shareWEl).data('sb');
                var fileTypeNames;
                var groupAtData = groupAt(),
                    noExist = groupAtData.noExist,
                    noInclude = groupAtData.noInclude;
                //最终发布的内容不能为空
                if(requestData['content'].length==0){
                    that.publishErrorHl(inputEl.closest('.publish-input-wrapper'));
                    return false;
                }
                if(requestData['content'].length>10000){
                    util.alert('发布内容不能超过10000字，目前已超出<em>'+(requestData['content'].length-10000)+'</em>个字');
                    passed=false;
                    return false;
                }
                //分享的可视范围不能为空,移到regValidtor里判定，考虑输入内容中at现象
                /*if(requestData["circleIDs"].length==0&&requestData["employeeIDs"].length==0){
                    passed=false;
                    $('.input-wrapper',ksfwSb.element).click();
                    return passed;
                }*/
                if(requestData["circleIDs"].length==0&&requestData["employeeIDs"].length==0){   //可视范围为空下的判定
                    //未包含员工判定
                    if(noInclude.length>0){
                        passed=true;
                        return passed;
                    }
                    //未知员工判定
                    if (noExist.length > 0) {
                        util.confirm('您通过@提到当中 ' + noExist.join('，') + ' 不是员工姓名或部门的名称，是否继续？', '提示', function (evt) {
                            $('.input-wrapper',ksfwSb.element).click();
                            evt.stopPropagation();  //阻止冒泡
                        },{
                            "onCancel":function(){}
                        });
                        passed=false;
                        return passed;
                    }
                    $('.input-wrapper',ksfwSb.element).click();
                    passed=false;
                    return passed;
                }else{
                    passed=true;
                }
                //投票激活状态下判定
                if(media.isActive('vote')){
                    passed=media.voteIsValid();
                    return passed;
                }
                return passed;
            };
            /**
             * 发布后清理
             */
            var clear = function () {
                //发布框清空
                inputEl.val("").height(50);
                //多媒体清空
                media.resetAll();
                //可视范围重置
                $('.ksfw .selectbar', shareWEl).each(function () {
                    $(this).data('sb').removeAllItem();
                });
                //发送短信重置
                isSendSmsEl.val("0");
                clearReceipt();
                //清空回执信息
                isReceiptEl.prop('checked', false);
                clearReceipt();
                //隐藏话题提示
                topicTipEl.hide();
            };
            var groupAt = function () {
                var ksfwSb = $('.ksfw .selectbar', shareWEl).data('sb');
                return that.groupAtContent(inputEl, ksfwSb);
            };
            var getPersonalConfig=function(){
                var requestData=getRequestData(),
                    employeeIDs=requestData["employeeIDs"], //员工
                    circleIDs=requestData["circleIDs"], //部门
                    rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                    rangeNames=""; //可视范围名称
                var shareEmployees=util.getPersonalConfig('shareEmployees')||[],
                    shareRanges=util.getPersonalConfig('shareRanges')||[];

                //可视范围中的员工
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    shareEmployees= _.filter(shareEmployees,function(configItem){     //先删掉以前存储的
                        return configItem.dataID!=employeeId;
                    });
                    //前插一个新的
                    shareEmployees.unshift({
                        "dataID": employeeId,
                        "isCircle":false,
                        "name":employeeData.name
                    });
                    if(shareEmployees.length>5){
                        shareEmployees.pop();  //大于5的话干掉最后一个
                    }
                });
                //可视范围
                if(circleIDs.length+employeeIDs.length>1){
                    shareRanges= _.filter(shareRanges,function(configItem){     //先删掉以前存储的
                        return configItem.dataIDs!=rangeIds;
                    });

                    _.each(circleIDs,function(circleId){
                        var circleData=util.getContactDataById(circleId,'g');
                        rangeNames+=circleData.name+'，';
                    });
                    _.each(employeeIDs,function(employeeId){
                        var employeeData=util.getContactDataById(employeeId,'p');
                        rangeNames+=employeeData.name+'，';
                    });
                    //干掉最后一个逗号
                    if(rangeNames.length>0){
                        rangeNames=rangeNames.slice(0,-1);
                    }
                    //前插一个新的
                    shareRanges.unshift({
                        "dataIDs": rangeIds,
                        "names":rangeNames
                    });
                    if(shareRanges.length>5){
                        shareRanges.pop();  //大于5的话干掉最后一个
                    }
                }
                return {
                    "shareEmployees":shareEmployees,
                    "shareRanges":shareRanges
                };
            };
            /**
             * 更新selectbar自动完成默认数据
             */
            var updateSbAcInitData=function(){
                var ksfwSb = $('.ksfw .selectbar', shareWEl).data('sb');
                ksfwSb.opts.acInitData=that.getPublishRange('share');
            };
            //设置回执范围
            var setReceiptRange=function(rangeData){
                var gData,    //部门数据
                    pData,   //个人数据
                    showArr=[];
                if(_.isEmpty(rangeData)){
                    receiptTipEl.text("").hide();
                }else{
                    gData = rangeData['g']||[];
                    pData = rangeData['p']||[];
                    if(gData.length>0){
                        showArr.push(gData.length+'个部门');
                    }
                    if(pData.length>0){
                        showArr.push(pData.length+'个人');
                    }
                    //设置隐藏传递值
                    smsRangeGroupEl.val(gData.join(','));
                    smsRangePersonEl.val(pData.join(','));
                    isSendSmsEl.val($('.is-sms-send',receiptDialog.element).prop('checked')?"1":"0");
                    receiptTipEl.text('已选择'+showArr.join('，')).show();
                }
            };
            //清空回执信息
            var clearReceipt = function () {
                smsRangeGroupEl.val('');
                smsRangePersonEl.val('');
                isSendSmsEl.val("0");
                receiptTipEl.empty().hide();
            };
            //如果输入框中有话题信息，显示话题tip，没有隐藏
            inputEl.keyup(function(){
                var meEl=$(this);
                var v= _.str.trim(meEl.val());
                if(/#[^\n]+?#/g.test(v)){
                    topicTipEl.slideDown(200,function(){
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                }else{
                    topicTipEl.slideUp(200,function(){
                        $(root).trigger('resize');  //触发resize事件，引导图重定位
                    });
                }

                /*if(v.length>10000){    //发分享可发1w字
                    meEl.val(v.slice(0,10000)).trigger('autosize.resize');
                }*/
            });
            /*inputEl.keydown(function(evt){
                var v= _.str.trim($(this).val());
                if(v.length>10000&&util.isNatureCode(evt.keyCode)){    //发分享可发1w字
                    evt.preventDefault();
                }
            });*/
            media = $('.media', shareWEl).data('media');
            if(!media){
                media=new MediaMaker({
                    "element": $('.media', shareWEl),
                    "action": ["h5imgupload","h5attachupload","vote","at","topic"],
                    "actionOpts": {
                        "vote":{
                            "contactData":this.contactPersonData
                        },
                        "at": {
                            "inputSelector": inputEl
                        },
                        "topic": {
                            "inputSelector": inputEl
                        },
                        "h5imgupload":{
                            "flashFallback":true  //对于不支持h5上传的要启用flash回退
                        },
                        "h5attachupload":{
                            "flashFallback":true  //对于不支持h5上传的要启用flash回退
                        }
                    }
                });
            }
            //可视范围
            $('.ksfw .selectbar', shareWEl).each(function () {
                var sb = new SelectBar({
                    "element": this,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": that.contactPersonData
                        },
                        {
                            "title": "部门",
                            "type": "g",
                            "list": that.contactGroupData,
                            "unitSuffix":"个部门"
                        }
                    ],
                    "title": "选择发送范围&#8230;",
                    "acInitData":that.getPublishRange('share'),
                    "autoCompleteTitle": "请输入部门或同事的名称或拼音"
                });
                $(this).data('sb', sb);
            });
            receiptDialog=new Receipt({
                "inputSelector":inputEl,
                "rangeSb":$('.ksfw .selectbar', shareWEl).data('sb'),
                "submitCb":function(sbData){
                    setReceiptRange(sbData);
                    this.hide();
                },
                "cancelCb":function(){
                    isReceiptEl.prop('checked',false);
                    //清空回执信息
                    clearReceipt();
                }
            });
            isReceiptEl.click(function(evt){
                var checked = isReceiptEl.prop('checked');
                if(checked){
                    receiptDialog.show();
                }else{
                    //清空回执信息
                    clearReceipt();
                }
            });
            //发分享
            var validator = new Validator({
                element: $('.fs-publish-share-form', shareWEl),
                autoSubmit: false,
                checkOnSubmit: true,
                onFormValidated: function (error, results, element) {
                    if (error) {
                        _.each(results, function (itemData) {
                            var elEl = itemData[2];
                            if (elEl.hasClass('publish-input')) {
                                that.publishErrorHl(elEl.closest('.publish-input-wrapper'));
                            }
                        });
                    }
                }
            });
            //输入非空
            validator.addItem({
                element: $('[name="content"]', shareWEl),
                required: false,    //有图片或者附件时内容可以为空
                errormessageRequired: ''
            });
            //监听publishhide事件，清空form
            this.on('publishhide',function(panelEl){
                if(panelEl.attr('feedname')=="share"){
                    clear();
                }
            });
            //注册验证对象
            this.regValidator({
                "validator": validator,
                "media": media,
                "isValid": isValid,   //自定义验证
                "clear": clear,   //发布后清理
                "sendPath": "/Feed/SendFeed", //发布接口
                "getRequestData": getRequestData,   //请求数据
                "groupAt": groupAt,   //at who 内容分组
                "getPersonalConfig":getPersonalConfig,
                "updateSbAcInitData":updateSbAcInitData,
                "feedType":"share"
            });
        },
        feedInit: function () {
            var that = this;
            var opts=this.opts;
            var feedListEl = $('.feed-list', this.tplEl),
                searchEl = $('.search-inp', feedListEl),
                searchBtnEl = $('.search-btn', feedListEl),
                feedTabsEl=$('.feed-tabs',feedListEl);
            var feedListTabs;
            /**
             * 杀死feedlist懒加载并清空
             * @param panelSelector
             */
            var killLoad = function (panelSelector) {
                var panelEl = $(panelSelector),
                    feedList = panelEl.data('feedList');
                feedList && feedList.loadKill();
                feedList&&feedList.empty();
            };
            /**
             * 刷新第一个tab
             * @param tabs
             */
            var reloadFirstTab=function(tabs){
                //刷新第一个子tab
                if(tabs.get('activeIndex')==0){
                    tabs.trigger('switched', 0, -1);
                }else{
                    tabs.switchTo(0);
                }
            };
            var worktodoCb=function(responseData){
                if(responseData.success&&that.tplName=="stream"){
                    that.createRightSbContent();
                }
            };
            //设置当前激活tab
            this.currentFeedList = null;
            feedListTabs = new Tabs({
                "element": feedTabsEl,
                "triggers": $('.feed-main-item', feedTabsEl),
                "panels": $('.feed-main-panel', feedTabsEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click'
            }).render();

            feedListTabs.on('switched',function (toIndex, fromIndex) {
                var curPanelEl = this.get('panels').eq(toIndex),
                    listEl = $('.feed-list', curPanelEl),
                    pagEl = $('.feed-list-pagination', curPanelEl),
                    subFeedListEl,
                    subTabs;
                var feedType = curPanelEl.attr('feedtype'),
                    feedName = curPanelEl.attr('feedname'),
                    feedList,
                    subType,
                    feedRemindClickCb,
                    listEmptyText;
                if (feedType == "0" || feedType == "1") {   //全部和分享
                    feedList = curPanelEl.data('feedList');
                    subType = curPanelEl.attr('subtype');
                    if(feedType=="0"){
                        listEmptyText="您所属的部门中还没有人发言，您来发布第一个分享吧~";
                    }else if(feedType == "1"){   //分享类型点击新消息提醒定位到全部列表
                        feedRemindClickCb=function(){
                            //刷新全部feed列表
                            reloadFirstTab(feedListTabs);
                        };
                        if(subType==1){
                            listEmptyText="您所属的部门中还没有人发布过公告";
                        }else{
                            listEmptyText="您所属的部门中还没有人发布过分享";
                        }
                    }
                    if (!feedList) {
                        feedList = new FeedList(_.extend({
                            "element": listEl, //list selector
                            "pagSelector": pagEl, //pagination selector
                            "pagOpts": { //分页配置项
                                "pageSize": 45,
                                "visiblePageNums": 7
                            },
                            "loadSize": 15,   //单次加载15条记录
                            "withFeedRemind":true, //新new feed提示
                            "withLazyload":true,    //开启懒加载
                            "listPath":opts.feedListPath,
                            "beforeListParse":opts.beforeFeedListParse,
                            "listEmptyText":listEmptyText,
                            //"listSuccessCb":opts.feedListSuccessCb,
                            "listSuccessCb":function(responseData){
                                /*if(feedType == "0" ){   //如果是全部的主列表，通过模板存储保存最大的feedId供 GlobalInfo/GetRemindGlobalInfo接口使用
                                    util.setTplStore("stream",{
                                        "maxFeedId":feedList.lastMaxId
                                    });
                                }*/
                                var lastMaxId=parseInt(util.getTplStore("stream","maxFeedId")||0);
                                if(feedList.lastMaxId>lastMaxId){
                                    util.setTplStore("stream",{     //设置stream模板变量maxFeedId，用于new feed提醒
                                        "maxFeedId":feedList.lastMaxId
                                    });
                                }
                                opts.feedListSuccessCb&&opts.feedListSuccessCb.apply(this,arguments);
                            },
                            "defaultRequestData": function () {
                                var applyFeedlistRd=opts.applyFeedlistRd;
                                if(_.isFunction(applyFeedlistRd)){
                                    applyFeedlistRd=applyFeedlistRd(feedList);
                                }
                                return _.extend({
                                    "circleID": 0, //部门id，0表示获取全部信息
                                    "subType": subType?subType:0, //子类型
                                    "feedType": feedType,
                                    "keyword": _.str.trim(searchEl.val())
                                },applyFeedlistRd);
                            },
                            "searchOpts":{
                                "inputSelector":searchEl,
                                "btnSelector":searchBtnEl
                            },
                            "feedRemindClickCb":feedRemindClickCb,
                            "itemWorktodoCb":worktodoCb
                        },opts.feedlistConfig));
                        feedList.load();
                        curPanelEl.data('feedList', feedList);
                    } else {
                        feedList.reload();
                    }
                    that.currentFeedList = feedList;
                } else {  //日志、审批、任务
                    subFeedListEl = $('.feed-sub-list', curPanelEl);
                    //获取当前主tab面板内的子tabs
                    subTabs=subFeedListEl.data('subTabs');
                    if (!subFeedListEl.data('rendered')) {
                        subTabs = new Tabs({
                            "element": subFeedListEl,
                            "triggers": $('.feed-' + feedName + '-item', subFeedListEl),
                            "panels": $('.feed-' + feedName + '-panel', subFeedListEl),
                            "activeIndex": 0,
                            "activeTriggerClass": "ui-tab-item-current",
                            "triggerType": 'click',
                            "withTabEffect": false
                        }).render().on('switched',function (toIndex, fromIndex) {
                                var curPanelEl = this.get('panels').eq(toIndex),
                                    listEl = $('.feed-list', curPanelEl),
                                    pagEl = $('.feed-list-pagination', curPanelEl);
                                var subType = curPanelEl.attr('subtype'),
                                    feedList = curPanelEl.data('feedList');
                                var listEmptyText;
                                if (!feedList) {
                                    if(feedType=="2"){
                                        listEmptyText="您所属的部门中还没有人发布过日志";
                                    }else if(feedType=="3"){
                                        listEmptyText="您所属的部门中还没有人发布过指令";
                                    }else if(feedType=="4"){
                                        listEmptyText="您所属的部门中还没有人发布过审批";
                                    }
                                    feedList = new FeedList(_.extend({
                                        "element": listEl, //list selector
                                        "pagSelector": pagEl, //pagination selector
                                        "pagOpts": { //分页配置项
                                            "pageSize": 45,
                                            "visiblePageNums": 7
                                        },
                                        "loadSize": 15,   //单次加载15条记录
                                        "withFeedRemind":true, //新new feed提示
                                        "withLazyload":true,    //开启懒加载
                                        "listPath":opts.feedListPath,
                                        "beforeListParse":opts.beforeFeedListParse,
                                        "listSuccessCb":opts.feedListSuccessCb,
                                        "listEmptyText":listEmptyText,
                                        "defaultRequestData": function () {
                                            var applyFeedlistRd=opts.applyFeedlistRd;
                                            if(_.isFunction(applyFeedlistRd)){
                                                applyFeedlistRd=applyFeedlistRd(feedList);
                                            }
                                            return _.extend({
                                                "circleID": 0, //部门id
                                                "subType": subType, //子类型
                                                "feedType": feedType,
                                                "keyword": _.str.trim(searchEl.val())
                                            },applyFeedlistRd);
                                        },
										"searchOpts":{
											"inputSelector":searchEl,
											"btnSelector":searchBtnEl
										},
                                        "feedRemindClickCb":function(){
                                            //刷新全部feed列表
                                            reloadFirstTab(feedListTabs);
                                        },
                                        "itemWorktodoCb":worktodoCb
                                    },opts.feedlistConfig));
                                    feedList.load();
                                    curPanelEl.data('feedList', feedList);
                                } else {
                                    feedList.reload();
                                }
                                that.currentFeedList = feedList;
                            }).on('switch', function (toIndex, fromIndex) {
                                //切换前kill掉当前tab中的feedList加载
                                killLoad(this.get('panels').eq(fromIndex));
                            });
                        //默认加载第一个tab
                        subTabs.trigger('switched', 0, -1);
                        subFeedListEl.data('rendered', true);
                        //保存引用
                        subFeedListEl.data('subTabs', subTabs);
                    }else{
                        //刷新第一个子tab
                        reloadFirstTab(subTabs);
                    }
                }
            }).on('switch', function (toIndex, fromIndex) {
                killLoad(this.get('panels').eq(fromIndex));
            });
            //默认加载全部feed列表
            reloadFirstTab(feedListTabs);
            //切换到当前模板后重新加载feedlist
            var firstRender=true;
            tpl.event.on('switched', function (tplName2, tplEl) {
                if (tplName2 == that.tplName) {
                    //主列表切换后不刷新,依赖hasNewFeed机制
                    //reloadFirstTab(feedListTabs);
                    //刷新右侧边栏
                    if(!firstRender){
                        that.createRightSbContent&&that.createRightSbContent();
                        //开启feedlist lazyload
                        //that.currentFeedList && that.currentFeedList.lazyload.start();
                        //直接刷新
                        reloadFirstTab(feedListTabs);
                    }
                    firstRender=false;
                }else{
                    that.currentFeedList && that.currentFeedList.lazyload.stop();
                }
            });
            //点击关键字查询按钮触发当前feedlist的reload行为
            searchBtnEl.click(function () {
                that.currentFeedList.pagination.reset();
                that.currentFeedList.reload();
            });
            //保留引用
            this.feedListTabs = feedListTabs;
        },
        addFeedToMain: function (feedId) {
            var currentFeedList = this.currentFeedList;
            feedId=[].concat(feedId);  //发指令可能返回多个feed
            _.each(feedId,function(itemId){
                currentFeedList.unshiftFromFeedId(itemId);
            });
            //清空demo信息
            $('.feed-demo-wrapper',currentFeedList.element).remove();
        },
        rightSideBarInit:function(){
            var that=this;
            var tplEl=this.tplEl;
            var contactData=util.getContactData(),
                currentUserData=contactData["u"];
            var pageConfig=util.getEnterpriseConfig(107,true)||{};

            //render 右侧栏 同事
            var streamRightEl=$('.home-right-content',tplEl),
             	righthImgWrapEl=$('.right-img-wrap',tplEl),
             	righthTitleWrapEl=$('.right-htitle-wrap',tplEl),
				todoListWrapperEl=$('.todolist-wrapper',tplEl),
            	rightTdlistWrapEl=$('.right-todolist-wrap',todoListWrapperEl),
             	rightVotesWrapEl=$('.right-votes-wrap',tplEl),
			 	rightFixedTopicsWrapEl=$('.right-fixedtopics-wrap',tplEl),
			 	rightNewTopicsWrapEl=$('.right-newtopics-wrap',tplEl);

            var scheduleHolderEl = $('.fs-schedule-holder', tplEl),
                addScheduleLEl=$('.add-schedule-l',tplEl);
            var schedule=new FsSchedule({
                "trigger": scheduleHolderEl,
                "scheduleDeleteCb":function(responseData,requestData){
                    var currentFeedList = that.currentFeedList,
                        listEl=currentFeedList.element,
                        itemEl;
                    var dataRoot,
                        feedId;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        feedId=requestData.feedID;
                        itemEl=$('[feedid="'+feedId+'"]',listEl).closest('.list-item');
                        if(itemEl.length>0){
                            itemEl.slideUp(600);
                        }
                    }
                }
            });
            //点击添加日程按钮弹出添加日程弹框
            addScheduleLEl.click(function(evt){
                schedule.showAddDialog(new Date());
                evt.preventDefault();
            });
            //防止日历定位偏差
            $(root).scroll(function(){
                $(root).resize().unbind('scroll',arguments.callee);
            });
            var setSchedule=function(data){
                var scheduleDate=[];
                _.each(data,function(item){
                    scheduleDate.push({
                        "startDate":new Date(item.startTime*1000),
                        "creatorId":item.creatorID
                    });
                });
                schedule.set("scheduleDate",scheduleDate);
            };
            var currentMonth=schedule.getCurrentMonthRange();
			/**
			 * @params status show/hide
			 */
			var changeWorktodoStatus=function(status,wSelector){
				status=status||"show";
				var wEl=$(wSelector),
				 	worktodoOpenOff=$('.worktodo-icopenoff',wEl),
					worktodoItemControl=$('.worktodo-item-control',wEl),
					itemsEl=$('.worktodo-item',wEl);
				if(status=="show"){
					itemsEl.show();
					worktodoOpenOff.html('收起');
					worktodoItemControl.removeClass("worktodo-item-open");
					worktodoItemControl.addClass("worktodo-item-off");		
					//设置状态标志
					wEl.data('status','show');
				}else{
					itemsEl.hide().slice(0,10).show();
					worktodoOpenOff.html('展开');
					worktodoItemControl.removeClass("worktodo-item-off");
					worktodoItemControl.addClass("worktodo-item-open");		
					//设置状态标志
					wEl.data('status','hide');
				}		
			};
			//待办展开收起 点击事件
			var worktodoItemControl=$('.worktodo-item-control',tplEl);
			worktodoItemControl.on('click',function(){
				var worktodoOpenOff=$('.worktodo-icopenoff',todoListWrapperEl),
					worktodoOpenOffHtml=worktodoOpenOff.html();
				if(worktodoOpenOffHtml=='展开'){
					changeWorktodoStatus('show',todoListWrapperEl);
				}else{
					changeWorktodoStatus('hide',todoListWrapperEl);
				}
				
			});
			/**
			 * 创建右侧内容
			 */
			var createSideBarContent=function(){
				util.api({
					"type":"get",
					"data":{
						"circleID":"0",
						"startTimeTicks":moment(currentMonth.startDate).unix(),
						"endTimeTicks":moment(currentMonth.endDate).unix()
					},
					//"url":"/content/fs/data/stream-right-nav.json",
					//"url":"/global_html/getShortcutInfo",
                    "url":"/globalInfo/getShortcutInfo",
					"success":function(responseData){
	
						var inCircleEmployeeIDs;
						var members=contactData["p"];
						//var filterMemberData=[];
						if(responseData.success){
							inCircleEmployeeIDs=responseData.value.inCircleEmployeeIDs||[];
							if(inCircleEmployeeIDs.length>14){
								inCircleEmployeeIDs=inCircleEmployeeIDs.slice(0,14);
							}
							//先清空内容
							righthImgWrapEl.empty();
							_.each(inCircleEmployeeIDs,function(id){
								var memberData=_.find(members,function(data){
									return data.id==id;
								});
								if(memberData){
									//filterMemberData.push(memberData);
									var userName=memberData.name,
										userId=memberData.id,
										profileImage=memberData.profileImage;
									var righthImgHtml="<a href='#profile/=/empid-"+userId+"' title='"+userName+"'><img src='"+profileImage+"' width='24' height='24' /></a>";
									righthImgWrapEl.append(righthImgHtml);
								}
							});
	
							//render 右侧栏 同事 title
							var thisCircle;
							thisCircle=responseData.value.thisCircle;
							
							//重新渲染回页面
							//righthTitleWrapEl.html(thisCircle.name+'（'+thisCircle.memberCount+'）');
							righthTitleWrapEl.html('全部同事('+thisCircle.memberCount+')<span class="rt-apv right-yq-apv fn-hide"><a href="javascript:;" class="invite-apv fna-blue">邀请同事</a></span>');
							
							//判断是否显示管理和邀请同事按钮
							if(contactData['u'].isAdmin){
								//$('.open-admin-wrapper').show();
								$('.right-yq-apv',righthTitleWrapEl).show();
                                if(!currentUserData["isDemoAccount"]&&pageConfig.IsShowInviteEmployeeTask){
                                    util.showGuideTip($('.invite-apv',righthTitleWrapEl),{   //邀请同事引导提醒
                                        "leftTopIncrement":-5,
                                        "rightTopIncrement":-5,
                                        "rightLeftIncrement":-5,
                                        "imageName":"invite-task.png",
                                        "imagePosition":{
                                            "top":"-100px",
                                            "left":"-280px"
                                        },
                                        "imagePlace":"left",
                                        "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                                            //模拟图片map映射
                                            var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                                                closeBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                                            //如果邀请同事引导图出来，隐藏头像和部门引导图
                                            $('.fs-guide-group-bracket,.fs-guide-avatar-bracket,.fs-guide-send-receipt-bracket,.fs-guide-history-plan-bracket').css('visibility','hidden');
                                            var closeCb=function(){
                                                pageConfig.IsShowInviteEmployeeTask=false;
                                                util.setEnterpriseConfig(107,pageConfig,true);
                                                util.updateEnterpriseConfig(107);
                                                leftEl.remove();
                                                rightEl.remove();
                                                //如果部门引导图存在显示出来
                                                $('.fs-guide-avatar-bracket').css('visibility','visible');
                                            };
                                            closeLinkEl.css({
                                                "width":"26px",
                                                "height":"26px",
                                                "position":"absolute",
                                                "top":"7px",
                                                "left":"197px",
                                                "cursor":"pointer"
                                            }).appendTo(imgWEl);
                                            closeBtnEl.css({
                                                "width":"122px",
                                                "height":"32px",
                                                "position":"absolute",
                                                "top":"129px",
                                                "left":"46px",
                                                "cursor":"pointer"
                                            }).appendTo(imgWEl);
                                            //点击关闭
                                            closeLinkEl.click(function(){
                                                closeCb();
                                            });
                                            //点击关闭按钮
                                            closeBtnEl.click(function(){
                                                closeCb();
                                            });
                                            hostEl.one('click',function(){
                                                closeCb();
                                            });
                                        }
                                    });
                                }
							}else{
								//$('.open-admin-wrapper').hide();
								$('.right-yq-apv',righthTitleWrapEl).hide();
							}
							//邀请同事弹框
							var inviteDialog=new InviteColleague({
								trigger: $('.invite-apv',righthTitleWrapEl)
							}).render();
	
							//render 右侧栏 互动待办
							var toDoList;
							toDoList=responseData.value.toDoList;
							$(".todolist-count").text(toDoList.length); //互动待办个数
							
							if(toDoList.length>0){
								rightTdlistWrapEl.empty();	//清空内容
								_.each(toDoList,function(data){
									var rightTdlistHtml;
									var title="",
										creatorID=data.creatorID,
										creatorName=data.creatorName,
										isImportant=data.isImportant;
									var isImportantClass;
									if(isImportant){
										isImportantClass="color-red";
									}else{
									    isImportantClass="";	
									}
									if (creatorID==currentUserData.id){
										title=data.title;
									}
									else{
										title='<span class="color-blue">'+creatorName+'：</span>'+data.title;
									}
									rightTdlistHtml="<li class='worktodo-item' worktodoid='"+data.workToDoListID+"'><input type='checkbox' class='is-complete' /><a href='#worktodo/tododetail/=/id-"+data.workToDoListID+"' class='tpl-nav-l "+isImportantClass+"' title='"+data.title+"'>"+title+"</a></li>";
									rightTdlistWrapEl.append(rightTdlistHtml);
								});
								
								var worktodoIcNumber=$('.worktodo-icnumber',worktodoItemControl);
								if(toDoList.length>10){
									$('.worktodo-item',rightTdlistWrapEl).slice(0,10).show();
									worktodoItemControl.show();
									worktodoIcNumber.html(toDoList.length-10);
									//设置状态标志
									todoListWrapperEl.data('status','hide');
                                    //更新按钮状态
                                    changeWorktodoStatus("hide",todoListWrapperEl);
								}else{
									$('.worktodo-item',rightTdlistWrapEl).show();
									worktodoItemControl.hide();
								}
								
								
							}else{
								rightTdlistWrapEl.html("<li class='color-999999'>无待办事项</li>");
							}
							
							rightTdlistWrapEl.find(">li>input[type=checkbox]").click(function(){
								if($(this).prop("checked")==true){
									$(this).next().css("text-decoration","line-through");
								}else{
									$(this).next().css("text-decoration","none");
								}
	
							});
							//render 右侧栏 固定话题
							var fixedTopics;
							fixedTopics=responseData.value.fixedTopics;
							/*if(fixedTopics.length>5){     //后台限制输出个数
								fixedTopics=fixedTopics.slice(0,5);
							}*/
							if(fixedTopics.length<1){
								$('.fixedtopics-wrapper').hide();
							}else{
								$('.fixedtopics-wrapper').show();
							}
							rightFixedTopicsWrapEl.empty();	//清空内容
							_.each(fixedTopics,function(data){
								var feedId=data.topicID;
								var rightFixedTopicsHtml;
								rightFixedTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='tpl-nav-l fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightFixedTopicsWrapEl.append(rightFixedTopicsHtml);
							});
							//render 右侧栏 最新话题
							var newTopics;
							newTopics=responseData.value.newTopics;
							/*if(newTopics.length>5){  //后台限制输出个数
								newTopics=newTopics.slice(0,5);
							}*/
							if(newTopics.length<1){
								$('.newtopics-wrapper').hide();
							}else{
								$('.newtopics-wrapper').show();
							}
							rightNewTopicsWrapEl.empty();	//清空内容
							_.each(newTopics,function(data){
								var feedId=data.topicID;
								var rightNewTopicsHtml;
								rightNewTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='tpl-nav-l fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightNewTopicsWrapEl.append(rightNewTopicsHtml);
							});
							
							//render 右侧栏 投票
							var votes;
							votes=responseData.value.votes;
							if(votes.length>10){
								votes=votes.slice(0,10);
							}
							if(votes.length<1){
								$('.right-votes-title-wrap').hide();
							}else{
								$('.right-votes-title-wrap').show();
							}
							rightVotesWrapEl.empty();	//清空内容
							_.each(votes,function(data){
								var feedId=data.feedID;
								var rightVotesHtml;
								rightVotesHtml="<li class='hr-vote'><a href='#stream/showfeed/=/id-"+feedId+"/showvotedetail-1' class='fna-blue'>"+data.title+"</a></li><li class='padL25 color-999999'>已有"+data.voteEmpCount+"人参与</li>";
								rightVotesWrapEl.append(rightVotesHtml);
							});
							//设置日程
							setSchedule(responseData.value.scheduleDates);
							//设置导航
							util.tplRouterReg($('.tpl-nav-l',streamRightEl));
						}
					}
				});		
			};
            createSideBarContent();
            util.tplRouterReg('#stream/showfeed/=/:id-:value');
            util.tplRouterReg('#stream/showfeed/=/:id-:value/:pn-:value');
            util.tplRouterReg('#stream/showfeed/=/:id-:value/:showvotedetail-:value');   //首页右边栏vote feed点击默认打开详情
            //保留右侧创建函数的引用
            this.createRightSbContent=createSideBarContent;
            //添加待办快捷方式
            (function(){
                var todoListEl=$('.right-todolist-wrap',tplEl),
                    addWorktodoLinkEl=$('.add-worktodo-l',tplEl);
                var setIsCompleted=function(isComplete,taskId,callback,maskSelector){
                    util.api({
                        type:'post',
                        data:{
                            "workToDoListID":taskId,
                            "isCompleted":isComplete
                        },
                        url:'/worktodolist/setIsCompleted',
                        success:function(responseData){
                            if(responseData.success){
                                callback.call(this,responseData);
                            }
                        }
                    },{
                        "mask":maskSelector
                    });
                };
                //创建待办
                new NewWorktodoDialog({
                    "trigger":addWorktodoLinkEl,
                    "successCb":function(){
                        //添加待办成功后重新创建右侧边栏
                        createSideBarContent();
                        this.hide();    //隐藏弹框
                    }
                });
                //点击checkbox取消和开启待办
                todoListEl.on('change','.is-complete',function(evt){
                    var meEl=$(evt.currentTarget),
                        itemEl=meEl.closest('.worktodo-item'),
                        isCompleteEl=$('.is-complete',itemEl);
                    var workToDoListID=itemEl.attr('worktodoid');
                    if(isCompleteEl.prop('checked')){
                        //设置成已完成
                        setIsCompleted(true,workToDoListID,function(){
                            itemEl.addClass('worktodo-state-undone');
                        },meEl);

                    }else{
                        //设置成未完成
                        setIsCompleted(false,workToDoListID,function(){
                            itemEl.removeClass('worktodo-sstate-undone')
                        },meEl);
                    }
                }).on('mouseenter','.worktodo-item',function(evt){
                    var itemEl=$(evt.currentTarget),
                        ckEl=itemEl.find('.is-complete');
                    if(ckEl.prop('checked')){
                        ckEl.attr('title','点击设置为未完成');
                    }else{
                        ckEl.attr('title','点击设置为已完成');
                    }
                });
                //注册待办的导航路由
                util.tplRouterReg('#worktodo/tododetail/=/:id-:value');
            }());

            //点击创建公告显示对话框
            if(_.some(currentUserData.functionPermissions,function(permission){
                return permission.value==1;    //权限1表示可以发公告
            })){
                $('.right-notice-wrap',tplEl).show();
                new NewNoticeDialog({
                    "trigger":$('.add-notice-l',tplEl),
                    "successCb":function(responseData,requestData){
                        var title;
                        if(responseData.success){
                            //插入新的公告feed
                            that.addFeedToMain(responseData.value);
                            //加入新的公告banner
                            title=requestData.title;
                            that.noticeBanner&&that.noticeBanner.addItem('公告：<time class="color-999999">'+moment.unix(responseData.serviceTime).format('MM-DD')+'</time> '+title+'（<a href="#stream/showfeed/=/id-'+responseData.value+'" class="fna-blue">详情</a>）',0);
                            this.hide();
                        }

                    }
                });
            }else{
                $('.right-notice-wrap',tplEl).hide();
            }
        },
        /**
         * 其它初始化
         */
        otherInit:function(){
            var that=this;
            var tplEl=this.tplEl;
            //公告banner
            util.api({
                "type":"get",
                "data":{},
                "url":"/FeedAnnounce/GetAnnouncesOfIsShow",
                "success":function(responseData){
                    if(responseData.success){
                        var listData=responseData.value;
                        var htmlArr=[];
                        if(listData.length<1){
                            $('.main-announcement',tplEl).hide();
                        }else{
                            _.each(listData,function(data,i){
                                var anTime=data.isShowTime,
                                    anTitle=data.title,
                                    anFeedId=data.feedID;
                                htmlArr[i]='公告：<time class="color-999999">'+moment.unix(anTime).format('MM-DD')+'</time> '+anTitle+'（<a href="#stream/showfeed/=/id-'+anFeedId+'" class="fna-blue">详情</a>）';
                            });
                            that.noticeBanner=new NoticeBanner({
                                "element":$('.main-announcement',tplEl),
                                "data":htmlArr
                            });
                        }
                    }
                }
            });
            tpl.event.on('switched', function (tplName2, tplEl) {
                if (tplName2 == that.tplName) {
                    that.noticeBanner&&that.reRenderNoticeBanner();
                }
            });
        },
        /**
         * 公告渲染
         */
        reRenderNoticeBanner:function(){
            var noticeBanner=this.noticeBanner;
            var tplEl=this.tplEl;
            //公告banner
            util.api({
                "type":"get",
                "data":{},
                "url":"/FeedAnnounce/GetAnnouncesOfIsShow",
                "success":function(responseData){
                    if(responseData.success){
                        var listData=responseData.value;
                        var htmlArr=[];
                        if(listData.length<1){
                            $('.main-announcement',tplEl).hide();
                        }else{
                            _.each(listData,function(data,i){
                                var anTime=data.isShowTime,
                                    anTitle=data.title,
                                    anFeedId=data.feedID;
                                htmlArr[i]='公告：<time class="color-999999">'+moment.unix(anTime).format('MM-DD')+'</time> '+anTitle+'（<a href="#stream/showfeed/=/id-'+anFeedId+'" class="fna-blue">详情</a>）';
                            });
                            noticeBanner.updateData(htmlArr);
                        }
                    }
                }
            });
        },
        /**
         * 发布错误高亮提示
         */
        publishErrorHl:function(elSelector){
            var elEl=$(elSelector);
            util.showInputError(elEl);
        },
        regValidator: function (opts) {
            var that = this;
            var streamOpts=this.opts,
                publishCb=streamOpts.publishCb,
                refreshAfterPublish=streamOpts.refreshAfterPublish;  //发布后强制刷新
            var validator = opts.validator,   //验证器
                media = opts.media,   //media组件
                sendPath = opts.sendPath, //发布接口
                isValid = opts.isValid,   //自定义验证 Function}
                clear = opts.clear,   //发布后清理 Function}
                getRequestData = opts.getRequestData,   //请求数据 {Function}
                groupAt = opts.groupAt,   //发布内容中对at who的分组 {Function}
                getPersonalConfig=opts.getPersonalConfig,   //获取个人配置信息
                updateSbAcInitData=opts.updateSbAcInitData,
                feedType=opts.feedType; //区分是什么类型的提交

            var formEl=validator.element, //提交表单
                panelVisibleHEl=$('.panel-visible-h',formEl.closest('.fs-publish-panel'));  //控制表单隐藏的按钮

            validator.on('formValidated', function (hasError) {
                if (!hasError && isValid()) {  //通过验证后提交
                    //通过media提交接口发布内容
                    var groupAtData = groupAt(),
                        noExist = groupAtData.noExist,
                        noInclude = groupAtData.noInclude,
                        validAtContent=groupAtData.validAtContent;
                    var requestData = getRequestData();
                    var sendCore=function(){
                        media.send(function (sendCb) {
                            var tempEmployeeData;
                            requestData = _.extend(requestData,{
                                "fileInfos":getRequestData().fileInfos //保证fileInfos信息准备好
                            });
                            if(feedType=="share"){    //发分享，只有唯一一个人的可视范围，追加到content后面
                                if(requestData["circleIDs"].length==0&&requestData["employeeIDs"].length==1){
                                    tempEmployeeData=util.getContactDataById(requestData["employeeIDs"][0],'p');
                                    if(tempEmployeeData.id!=that.currentUserData["id"]){    //at的不是当前登录用户
                                        if(!_.contains(validAtContent,tempEmployeeData.name)){ //保证content中没有at过
                                            requestData['content']=requestData['content']+'\n'+'@'+tempEmployeeData.name;
                                        }
                                    }
                                }
                            }
                            var personalConfig=getPersonalConfig();
                            //重设回个人配置中
                            _.each(personalConfig,function(val,cateKey){
                                util.setPersonalConfig(cateKey,val);
                            });
                            //更新selectbar acinitData
                            updateSbAcInitData&&updateSbAcInitData();
                            //同步到服务端
                            util.updatePersonalConfig();

                            util.api({
                                'url': sendPath,
                                'type': 'post',
                                'data': requestData,
                                'success': function (responseData) {
                                    if (responseData.success) {
                                        //feed主列表add一条数据
                                        if(responseData.value){
                                            if(refreshAfterPublish){
                                                that.currentFeedList&&that.currentFeedList.reload();
                                            }else{
                                                that.addFeedToMain(responseData.value);
                                            }
                                        }
                                        //成功后清理
                                        clear();    //发送成功后清理
                                        //发布成功后关闭表单
                                        panelVisibleHEl.click();
                                        //清空feedContent客户端存储
                                        clientStore.set('lastInputFeedInfo', null);
                                        //发布后的回调
                                        publishCb&&publishCb.call(that,responseData,requestData);
                                    }
                                    sendCb();   //media send callback回调
                                }
                            },{
                                "submitSelector":$('[type="submit"]',formEl)
                            });
                        }, formEl.closest('.publish-wrapper'));
                    };

                    var confirmInclude = function () {
                        var confirmMsg,
                            msgPart=[],
                            namePart=[],
                            employeeArr=[],
                            circleArr=[];
                        //如果可视范围内包含全公司，不需要判定是否包含其他部门
                        if(_.some(requestData["circleIDs"],function(circleId){
                            return circleId=="999999";
                        })){
                            sendCore();
                            return;
                        }
                        if (noInclude.length > 0) {
                            //数据分类并去重
                            _.each(noInclude,function(typeData){
                                if(typeData.type=="p"){
                                    if(!_.some(employeeArr,function(itemData){  //去重
                                        return itemData.id==typeData.id;
                                    })){
                                        employeeArr.push(typeData);
                                    }

                                }else{
                                    if(!_.some(circleArr,function(itemData){  //去重
                                        return itemData.id==typeData.id;
                                    })){
                                        circleArr.push(typeData);
                                    }
                                }
                            });
                            //拼接提示信息
                            if(employeeArr.length>0){
                                msgPart.push(employeeArr.length+'人');
                                namePart=namePart.concat(_.map(employeeArr,function(typeData){ //只提取名字
                                    return typeData.name;
                                }));
                            }
                            if(circleArr.length>0){
                                msgPart.push(circleArr.length+'部门');
                                namePart=namePart.concat(_.map(circleArr,function(typeData){ //只提取名字
                                    return typeData.name;
                                }));
                            }
                            if(msgPart.length>0){
                                msgPart='（共'+msgPart.join('，')+'）';
                                namePart=namePart.join('、');
                            }else{
                                msgPart='';
                                namePart='';
                            }
                            confirmMsg='您通过@提到当中 '+namePart+msgPart+'不在您选择的范围中，是否要将这些人和部门包含在发布的范围当中';

                            util.confirm(confirmMsg, '提示', function () {
                                //添加到发布范围中
                                requestData["employeeIDs"]=requestData["employeeIDs"].concat(_.map(employeeArr,function(typeData){
                                    return typeData.id;
                                }));
                                requestData["circleIDs"]=requestData["circleIDs"].concat(_.map(circleArr,function(typeData){
                                    return typeData.id;
                                }));

                                sendCore();
                            }, {
                                "onCancel": function () {
                                    //sendCore();
                                }
                            });
                        } else {
                            sendCore();
                        }
                    };
                    /*noExist = _.map(noExist, function (name) {
                        return  "@" + name;
                    });
                    noInclude = _.map(noInclude, function (name) {
                        return  "@" + name;
                    });*/
                    //外层包装
                    var wrapSend=function(){
                        //未知员工和未包含员工判定
                        if (noExist.length > 0) {
                            util.confirm('您通过@提到当中 ' + noExist.join(',') + '不是员工姓名或部门的名称，是否继续？', '提示', function () {
                                confirmInclude();
                            },{
                                "onCancel":function(){}
                            });
                        } else {
                            //如果可视范围内不包含全公司，需要确认at成员是否在范围内
                            if(!_.some(requestData["circleIDs"],function(circleId){
                                return circleId=="999999";
                            })){
                                confirmInclude();
                            }else{
                                sendCore();
                            }

                        }
                    };
                    //"附件"包含内容提示
                    if(requestData['content'].search('附件')!=-1&&requestData["fileInfos"].length==0){
                        util.confirm('您在正文的文字中提到了“附件”，但是您却没有添加任何附件。是否确定发布不含附件的信息？','提示',function(){
                            wrapSend();
                        });
                    }else{
                        wrapSend();
                    }
                }
            });
        }
    });
    //添加自定义事件功能
    Events.mixTo(Stream);
    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName=exports.tplName,
            stream;
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
        //stream初始化
        stream = new Stream({
            "feedListSuccessCb":function(responseData,requestData){
                var feedType=requestData.feedType,
                    keyword=requestData.keyword,
                    currentFeedList=stream.currentFeedList,
                    feedListInnerEl,
                    emptyTipEl,
                    htmlStr='';
                if(responseData.success&&responseData.value.items.length==0&&keyword.length==0){
                    feedListInnerEl=$('.feed-list-inner',currentFeedList.element);
                    emptyTipEl=$('.list-empty-tip',currentFeedList.element);
                    if($('.list-item',feedListInnerEl).length>0){   //防止懒加载覆盖
                        return;
                    }
                    if(feedListInnerEl.data('hideDemo')){
                        return;
                    }
                    if(feedType==0){    //全部
                        _.each(['share','share-2','plan','work'],function(imgName){
                            htmlStr+='<li class="feed-demo-item"><img src="'+FS.ASSETS_PATH+'/images/feed-demo/'+imgName+'.png" alt="" /></li>';
                        });
                    }else if(feedType==1){  //分享
                        htmlStr+='<li class="feed-demo-item"><img src="'+FS.ASSETS_PATH+'/images/feed-demo/share.png" alt="" /></li>';
                    }else if(feedType==2){  //日志
                        htmlStr+='<li class="feed-demo-item"><img src="'+FS.ASSETS_PATH+'/images/feed-demo/plan.png" alt="" /></li>';
                    }else if(feedType==3){  //指令
                        htmlStr+='<li class="feed-demo-item"><img src="'+FS.ASSETS_PATH+'/images/feed-demo/work.png" alt="" /></li>';
                    }else if(feedType==4){  //审批
                        htmlStr+='<li class="feed-demo-item"><img src="'+FS.ASSETS_PATH+'/images/feed-demo/share-2.png" alt="" /></li>';
                    }
                    htmlStr='<ul class="feed-demo-list">'+htmlStr+'</ul>';
                    htmlStr='<div class="demo-readme"><p>欢迎您加入纷享平台！以下为<span class="state-hl">模拟信息</span>，便于您初次了解主要功能，阅读后可选择关闭，您也可以在帮助中心重新点击查看。</p><span class="close-l"></span></div>'+htmlStr;
                    htmlStr=htmlStr+'<div class="demo-bbar"><a class="close-l" href="javascrip:;">关闭</a></div>';
                    feedListInnerEl.html('<div class="feed-demo-wrapper">'+htmlStr+'</div>');
                    emptyTipEl.hide();
                    $('.close-l',feedListInnerEl).click(function(evt){
                        emptyTipEl.show();
                        feedListInnerEl.empty().data('hideDemo',true);
                        evt.preventDefault();
                    });
                }

            }
        });
    };
    exports.Stream=Stream;  //提供给其他tpl引用
});