/**
 * FS日程表
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var publish=require('modules/publish/publish'),
        Dialog=require('dialog'),
        mask=require('mask'),
        InnerCalendar=require('innercalendar'),
        FsReply=require('modules/fs-reply/fs-reply'),
        scheduleStyle=require('modules/fs-schedule/fs-schedule.css'),
        scheduleTpl=require('modules/fs-schedule/fs-schedule.html'),
        FeedList = require('modules/feed-list/feed-list'),
        util=require('util'),
        moment=require('moment');

    var scheduleEl=$(scheduleTpl),
        SelectBar=publish.selectBar,
        MediaMaker=publish.mediaMaker,
        DateSelect=publish.dateSelect,
        TimeSelect=publish.timeSelect,
        AtInput=publish.atInput;
    
    var container=[],
        dateFormatStr="YYYY-MM-DD",
        dateFormatStr2="YYYY年MM月DD日";

    //日程范围数据准备
    //var contactData=util.deepClone(FS.getAppStore('contactData')||{});
    var contactData=util.getContactData(),
        currentUserData=contactData["u"];

    var rangeDialog=new Dialog({
        "content":'<ul class="fs-schedule-range-list"></ul>',
        "className":"fs-schedule-range-dialog",
        "zIndex":1002,
        "closeTpl": "",
        "hasMask":false,
        "width":60,
        "height":100
    });
    //注册全局点击事件
    util.regGlobalClick(rangeDialog.element,function(){
        if(rangeDialog.element.is(':visible')){
            rangeDialog.hide();
        }
    });
    //客户日程提醒对话框
    var CustomAlertDialog=Dialog.extend({
        "attrs":{
            width: '540px',
            //height:"",
            className:'fs-schedule-custom-alert-dialog',
            content:scheduleEl.filter('.fs-schedule-custom-alert-tpl').html(),
            zIndex:1003
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel"
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
            var that=this;
            var elEl=this.element,
                sbEl=$('.range-selectbar',elEl);
            //可视范围
            var sb = new SelectBar({
                "element": sbEl,
                "data": [{
                    "title": "部门",
                    "type": "g",
                    "list": contactData["g"],
                    "unitSuffix":"个部门"
                },{
                    "title": "同事",
                    "type": "p",
                    "list": contactData["p"]
                }],
                "title": "选择可视范围",
                "autoCompleteTitle": "请输入部门或同事的名称或拼音"
            });
            this.sb=sb;
        },
        "render":function(){
            var result=CustomAlertDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=CustomAlertDialog.superclass.show.apply(this,arguments);
            return result;
        },
        "hide":function(){
            var result=CustomAlertDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "_submit":function(){

        },
        "_cancel":function(){
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            result=CustomAlertDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    //日程组件
    var FsSchedule=InnerCalendar.extend({
    	"attrs":{
            "showTodayBtn":false,
            //扩展scheduleData,加入创建人id
            /*"scheduleDate":[{
                "startDate":moment().add('days', 1),    //开始创建时间
                "creatorId":"1"    //创建人id
            },{
                "startDate":moment().add('days', 2),
                "creatorId":"2"
            }],*/
            "className":"fs-schedule",
            "scheduleDate":[],
            "activeScheduleDate":"", //{String}
            "scheduleDeleteCb":FS.EMPTY_FN   //日程删除后的回调
        },
        events: {
            "click [data-role=date]": "_showSchedule"
        },
        setup:function(){
            var that=this;
            var result=FsSchedule.superclass.setup.call(this);
            this.addDialog=new Dialog({
                "content":scheduleEl.filter('.fs-schedule-add-dialog').html(),
                "className":"fs-schedule-add-dialog",
                "zIndex":1001,
                "width":560
            });
            this.addDialog.after('hide',function(){
                that.clearAddDialog();
            });
            this.manageDialog=new Dialog({
                "content":scheduleEl.filter('.fs-schedule-manage-dialog').html(),
                "className":"fs-schedule-manage-dialog",
                "width":600,
                "height":500
            });
            //客户日程提醒
            this.customAlertDialog=new CustomAlertDialog();
            //切换年、月保持schedule的选中状态
            this.model.on("changeMonth changeYear changeStartday changeMode",function(){
                //that._renderScheduleDate();
                var currentMonthRange=that.getCurrentMonthRange(),
                    startTime=currentMonthRange.startDate.unix();
                if(startTime>0){
                    that.refreshScheduleDate();
                }
            });
            //this.scheduleVs=[]; //设置view容器供以后删除
            this.scheduleList=null; //schedule是feedList中分享下一种子类型
            this.deleteStore=[this.addDialog,this.manageDialog];
            //注册自定义事件
            this._regEvents();
            container.push({
                "trigger":$(this.get('trigger')),
                "ins":this
            });
            return result;
        },
        _showSchedule:function(e){
            var elEl=$(e.currentTarget),
                dateStr=elEl.attr('data-value'),
                dateValue=moment(dateStr,dateFormatStr);
            //设置当前的schedule date
            this.set('activeScheduleDate',dateStr);
            //选择时间
            //this._selectDate.apply(this,arguments);
            if(elEl.hasClass('fs-schedule-ordered')){
                this.showManageDialog(dateValue);
            }else{
                this.showAddDialog();
            }

        },
        /**
         * 显示发布日程弹框，可传入发布日期
         * @param momentDate
         */
        showAddDialog:function(momentDate){
            var addDialog=this.addDialog,
                dialogEl=addDialog.element,
                comp,
                ds, //日期控件
                ts; //时间控件
            var activeScheduleDate=this.get('activeScheduleDate'),  //激活日期时间
                publishDate;    //发布日期
            if(momentDate){
                publishDate=moment(momentDate);
            }else{
                publishDate=moment(activeScheduleDate,dateFormatStr);
            }
            if (!addDialog.rendered) {
                this._renderAddDialog();
            }
            comp=dialogEl.data('comp');
            ds=comp.ds; //日期控件
            ts=comp.ts; //时间控件
            //设置ds,ts默认值
            ds.setValue(publishDate);
            ts.setValue(2);
            //隐藏feedlist上的划出提示
            this.scheduleList&&this.scheduleList.hideItemSlideTip();
            addDialog.show();
        },
        clearAddDialog:function(){
            //clear发布信息
            var addDialog=this.addDialog,
                addDialogEl=addDialog.element,
                isSmsEl=$('.is-sms',addDialogEl),
                smsAlertEl=$('.sms-alert',addDialogEl),
                contentEl=$('.schedule-input',addDialogEl),
                comp=addDialogEl.data('comp');
            var sb=comp.sb,
                ds=comp.ds,
                ts=comp.ts,
                media=comp.media;
            //日程范围清空,放入当前用户
            sb.removeAllItem();
            sb.addItem(currentUserData);
            //清空时间
            ds.clear();
            ts.clear();
            //短信提醒
            smsAlertEl.val("1");  //默认选中无提醒
            //发布内容清空
            contentEl.val("").trigger('autosize.resize');  //自适应高度需触发keyup事件
            //多媒体清空
            media.resetAll();
            //取消发送短信
            isSmsEl.prop("checked",false);
        },
        hideAddDialog:function(){
            //this.clearAddDialog();
            this.addDialog.hide();
        },
        /**
         * 日程管理列表
         * @param  {[type]} dateValue [description]
         * @return {[type]}      [description]
         */
        showManageDialog:function(dateValue){
            if (!this.manageDialog.rendered) {
                this._renderManageDialog();
            }
            //设置title
            $('.fs-schedule-manage-title',this.manageDialog.element).text(moment(dateValue).format(dateFormatStr2)+'的日程');
            this.manageDialog.show();
            //管理列表面板弹出后加载schedule列表
            this.fetchScheduleList();
        },
        hideManageDialog:function(){
            this.manageDialog.hide();
            //先清空列表容器
            this.scheduleList.empty();
            this.refreshScheduleDate();  //刷新日历
        },
        /**
         * 判定发布是否通过验证
         */
        isPublishValid:function(){
            var requestData=this.getPublishRequestData();
            var addDialog=this.addDialog,
                addDialogEl=addDialog.element,
                isSmsEl=$('.is-sms',addDialogEl),
                smsAlertEl=$('.sms-alert',addDialogEl),
                contentEl=$('.schedule-input',addDialogEl),
                comp=addDialogEl.data('comp');
            var sb=comp.sb,
                ds=comp.ds;
            var passed=true;
            //发布内容非空判定
            if(requestData['scheduleContent'].length==0){
                util.showInputError(contentEl.closest('.schedule-input-wrapper'));
                passed=false;
            }
            //内容不超过2000字
            if(requestData['scheduleContent'].length>2000){
                util.alert('内容不超过2000字');
                passed=false;
            }
            //日程范围非空判定
            if(requestData["circleIDs"].length==0&&requestData["employeeIDs"].length==0){
                $('.input-wrapper',sb.element).click();
                passed=false;
            }
            //起始时间非空判定
            if(requestData["startTimeTicks"].length==0){
                util.showInputError($('input',ds.element));
                passed=false;
            }
            return passed;
        },
        /**
         * 获得发布提交数据
         */
        getPublishRequestData:function(){
            var requestData={};
            var addDialog=this.addDialog,
                addDialogEl=addDialog.element,
                isSmsEl=$('.is-sms',addDialogEl),
                smsAlertEl=$('.sms-alert',addDialogEl),
                contentEl=$('.schedule-input',addDialogEl),
                comp=addDialogEl.data('comp');
            var sb=comp.sb,
                sbData=sb.getSelectedData(),
                media=comp.media,
                files,
                ds=comp.ds,
                dsValue=ds.getValue(),
                ts=comp.ts,
                tsValue=ts.getValue(),
                isImmediatelySendSms=isSmsEl.prop('checked'),
                smsRemindType=smsAlertEl.val(),
                scheduleContent= _.str.trim(contentEl.val());
            requestData["circleIDs"]=sbData['g']||[];  //组织
            requestData["employeeIDs"]=sbData['p']||[];    //个人
            //附件
            files=media.getUploadValue();
            requestData["fileInfos"]=[];
            _.each(files,function(file){
                if(file.uploadType=="img"){
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1":file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name  //文件原名
                    });
                }else if(file.uploadType=="attach"){
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1":file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name  //文件原名
                    });
                }
            });
            //开始时间Ticks
            if(dsValue.length>0){
                requestData["startTimeTicks"]=moment(dsValue+' '+tsValue,'YYYY-MM-DD HH:mm:ss').unix();
            }else{
                requestData["startTimeTicks"]="";
            }

            //是否立即发送短信
            requestData["isImmediatelySendSms"]=isImmediatelySendSms;
            //短信提醒枚举
            requestData["smsRemindType"]=smsRemindType;
            //日程内容
            requestData["scheduleContent"]=scheduleContent;
            return requestData;
        },
        /**
         * 从提交操作中获取个人配置信息
         */
        getPersonalConfig:function(){
            var requestData=this.getPublishRequestData(),
                employeeIDs=requestData["employeeIDs"], //员工
                circleIDs=requestData["circleIDs"], //部门
                rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                rangeNames=""; //可视范围名称
            var scheduleEmployees=util.getPersonalConfig('scheduleEmployees')||[],
                scheduleRanges=util.getPersonalConfig('scheduleRanges')||[];

            //可视范围中的员工
            _.each(employeeIDs,function(employeeId){
                var employeeData=util.getContactDataById(employeeId,'p');
                scheduleEmployees= _.filter(scheduleEmployees,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=employeeId;
                });
                //前插一个新的
                scheduleEmployees.unshift({
                    "dataID": employeeId,
                    "isCircle":false,
                    "name":employeeData.name
                });
                if(scheduleEmployees.length>5){
                    scheduleEmployees.pop();  //大于5的话干掉最后一个
                }
            });
            //可视范围
            if(circleIDs.length+employeeIDs.length>1){
                scheduleRanges= _.filter(scheduleRanges,function(configItem){     //先删掉以前存储的
                    return configItem.dataIDs!=rangeIds;
                });

                _.each(circleIDs,function(circleId){
                    var circleData=util.getContactDataById(circleId,'g');
                    rangeNames+=circleData.name+',';
                });
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    rangeNames+=employeeData.name+',';
                });
                //干掉最后一个逗号
                if(rangeNames.length>0){
                    rangeNames=rangeNames.slice(0,-1);
                }
                //前插一个新的
                scheduleRanges.unshift({
                    "dataIDs": rangeIds,
                    "names":rangeNames
                });
                if(scheduleRanges.length>5){
                    scheduleRanges.pop();  //大于5的话干掉最后一个
                }
            }
            return {
                "scheduleEmployees":scheduleEmployees,
                "scheduleRanges":scheduleRanges
            };
        },
        publish:function(){
            var that=this;
            var addDialog=this.addDialog,
                addDialogEl=addDialog.element,
                submitEl=$('.f-sub',addDialogEl),   //添加确定按钮
                manageDialog=this.manageDialog,
                manageDialogEl=manageDialog.element,
                comp=addDialogEl.data('comp');
            var media=comp.media;
            var requestData;
            var personalConfig=this.getPersonalConfig();    //个人默认配置信息
            if(this.isPublishValid()){ //通过了验证后提交发布请求
                //重设回个人配置中
                _.each(personalConfig,function(val,cateKey){
                    util.setPersonalConfig(cateKey,val);
                });
                //同步到服务端
                util.updatePersonalConfig();

                media.send(function (sendCb) {
                    requestData=that.getPublishRequestData();
                    util.api({
                        'url': '/Schedule/SendSchedule',
                        'type': 'post',
                        'data': requestData,
                        'success': function (responseData) {
                            if(responseData.success){
                                that.hideAddDialog();
                                if(manageDialogEl.is(':visible')){
                                    //刷新列表
                                    that.fetchScheduleList();
                                }else{
                                    //刷新当前月日程信息
                                    that.refreshScheduleDate();
                                }

                                sendCb();   //media send callback回调
                            }
                        }
                    },{
                        "submitSelector":submitEl
                    });
                }, addDialogEl);
            }
        },
        /**
         * 注册自定义事件
         * @private
         */
        _regEvents:function(){
            var that=this;
            //发布日程事件绑定
            var addDialog=this.addDialog,
                addDialogEl=addDialog.element,
                manageDialog=this.manageDialog,
                manageDialogEl=manageDialog.element;
            //点击reset button关闭dialog
            addDialogEl.on('click','[type="reset"]',function(){
                that.hideAddDialog();
            });
            //点击发布触发发布动作
            addDialogEl.on('click','[type="submit"]',function(evt){
                evt.stopPropagation();  //阻止冒泡到document影响日程范围的验证行为
                that.publish();
                evt.preventDefault();
            });
            //点击客户日程提醒弹出对话框
            addDialogEl.on('click','.custom-alert',function(evt){
                var cbEl=$(this);
                if(cbEl.prop('checked')){
                    that.customAlertDialog.show();
                }
                evt.preventDefault();
            });
            //点击close button关闭dialog
            manageDialogEl.on('click','.create-btn',function(){
                that.showAddDialog();
            }).on('click','.close-btn,.ui-dialog-close',function(){
                that.hideManageDialog();
            });
        },
        _renderAddDialog:function(){
            var that=this;
            var dialogEl,
                rangeEl,
                dateWEl,
                timeWEl,
                mediaEl,
                sb,
                ds,
                ts,
                media,
                atInput;

            //渲染添加对话框
            this.addDialog.render();
            dialogEl=this.addDialog.element;
            rangeEl=$('.schedule-range',dialogEl);
            dateWEl=$('.start-date-wrapper',dialogEl);
            timeWEl=$('.start-time-wrapper',dialogEl);
            mediaEl=$('.media',dialogEl);

            sb=new SelectBar({
                "element":rangeEl,
                "data":[{
                    "title":"部门",
                    "type":"g",
                    "list":contactData["g"],
                    "unitSuffix":"个部门"
                },{
                    "title":"同事",
                    "type":"p",
                    "list":contactData["p"]
                }],
                "defaultSelectedData":[{    //设置默认选中值为当前登录用户
                    "id":currentUserData.id,
                    "type":"p"
                }],
                "title":"选择同事或部门",
                "autoCompleteTitle":"选择同事或部门",
                "acInitData":util.getPublishRange('schedule')
            });
            sb.on('inputshow',function(){
                sb.setAcInitData(util.getPublishRange('schedule'));
            });
            ds=new DateSelect({
                "element":dateWEl,
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            ts=new TimeSelect({
                "element":timeWEl
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            ds.on('change', function () {
                if (ts.getValue() == "") {
                    ts.selector.select(0);
                }
            });
            //设置多媒体功能
            media=new MediaMaker({
                "element":mediaEl,
                "action":["h5imgupload","h5attachupload"]
            });
            atInput=new AtInput({
                "element": $('.schedule-input',dialogEl)
            });
            dialogEl.data("comp",{
                "sb":sb,
                "ds":ds,
                "ts":ts,
                "media":media,
                "atInput":atInput
            });
            //填充销毁容器
            this.deleteStore=this.deleteStore.concat([sb,ds,ts,media]);
        },
        _renderManageDialog:function(){
             //渲染添加对话框
            this.manageDialog.render();
            //初始化scheduleList
            this._initScheduleList();
        },
        _initScheduleList:function(){
            var that=this;
            var scheduleDeleteCb=this.get('scheduleDeleteCb');
            var listEl=$('.fs-schedule-manage-list',this.manageDialog.element);

            this.scheduleList=new FeedList({
                "element": listEl, //list selector
                "pagSelector": false, //pagination selector
                "withLazyload":false,   //关闭懒加载
                "scheduleStyle":3,  //弹框列表风格
                "listPath":"/schedule/getInfosByCurrentEmpID",
                "itemDeleteCb":function(responseData,requestData){   //feed item删除后回调
                    that.refreshScheduleDate();  //刷新日历
                    scheduleDeleteCb.call(that,responseData,requestData);
                },
                "listEmptyText":"今日未添加日程",
                "defaultRequestData": function () {
                    var activeScheduleDate=that.get('activeScheduleDate');
                    return {
                        "startTime": moment(activeScheduleDate,dateFormatStr).unix()
                    };
                }
            });
        },
        /**
         * 获取当前月起止时间，包含上月和下月再本月的显示部门
         * @returns {{startDate: *, endDate: *}}
         */
        getCurrentMonthRange:function(){
            var dateEl=$('[data-role="date"]',this.element),
                startDate,
                endDate;
            startDate=moment(dateEl.first().attr('data-value'),dateFormatStr);
            endDate=moment(dateEl.last().attr('data-value'), dateFormatStr);
            return {
                "startDate":startDate,
                "endDate":endDate
            };
        },
        _renderScheduleDate:function(){
            var scheduleDate=this.get('scheduleDate'),
                currentMonth=this.getCurrentMonthRange(),
                dateEl=$('[data-role="date"]',this.element),
                filterDate,
                startDate=currentMonth.startDate,
                endDate=currentMonth.endDate;

            filterDate=_.filter(scheduleDate,function(v){
                if(v.startDate>=startDate&& v.startDate<=endDate){
                    return true;
                }
            });
            dateEl.removeClass('fs-schedule-ordered fs-schedule-my-ordered fs-schedule-other-ordered');
            _.each(filterDate,function(v){
                var currentDateEl=dateEl.filter('[data-value="'+moment(v.startDate).format(dateFormatStr)+'"]');
                //设置公用高亮样式
                currentDateEl.addClass('fs-schedule-ordered');
                //区分自己和其他用户的日程高亮样式
                if(v.creatorId==currentUserData.id){
                    currentDateEl.addClass('fs-schedule-my-ordered');
                }else{
                    currentDateEl.addClass('fs-schedule-other-ordered');
                }
            });
        },
        _onRenderScheduleDate:function(val){
            this._renderScheduleDate();
        },
        /**
         * 重新刷新日程表，获取当前月日程点
         */
        refreshScheduleDate:function(){
            var that=this;
            var currentMonth=this.getCurrentMonthRange();
            util.api({
                "url":"/Schedule/GetScheduleInfos",
                "data":{
                    "startTime":currentMonth.startDate.unix(),   //转成秒(m)
                    "endTime":currentMonth.endDate.unix()
                },
                "type":"get",
                "success":function(responseData){
                    var items,scheduleDate=[];
                    if(responseData.success){
                        items=responseData.value;
                        _.each(items,function(item){
                            scheduleDate.push({
                                "startDate":new Date(item.startTime*1000),
                                "creatorId":item.creatorID
                            });
                        });
                        that.set('scheduleDate',scheduleDate);
                    }
                }
            });
        },
        _onRenderActiveScheduleDate:function(val){},

        fetchScheduleList:function(){
            var activeScheduleDate=this.get('activeScheduleDate');
            this.scheduleList.reload();
        },
        destroy:function(){
            var that=this;
            var result;
            //清除addDialogEl.data绑定
            this.addDialog.element&&this.addDialog.element.removeData();
            //组件清理
            _.each(this.deleteStore,function(comp){
                comp.destroy&&comp.destroy();
            });
            //销毁scheduleList
            this.scheduleList&&this.scheduleList.destroy();

            this.deleteStore=[];
            container= _.filter(container,function(val){
                return  val.ins!==that;
            });
            result=FsSchedule.superclass.destroy.call(this);
            return result;
        }
    });
    //switch之前先隐藏日历
    tpl.event.on('beforeswitch', function (tplName) {
        _.each(container,function(v){
            var ins=v.ins;
            ins.hide();
        });
    });
    tpl.event.on('switched', function (tplName, tplEl) {
        _.each(container,function(v){
            var triggerEl=v.trigger,
                ins=v.ins;
            if($.contains( tplEl.get(0), triggerEl.get(0) )){
                ins.show();
            }else{
                ins.hide();
            }
        });
    });
    module.exports=FsSchedule;
});