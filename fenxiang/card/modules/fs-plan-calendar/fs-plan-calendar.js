/**
 * FS日志日历
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
        CardCalendar=require('cardcalendar'),
        fsPlanCalendarTpl=require('./fs-plan-calendar.html'),
        fsPlanCalendarStyle=require('./fs-plan-calendar.css'),
        FeedList = require('modules/feed-list/feed-list'),
        util=require('util'),
        moment=require('moment'),
        publish=require('modules/publish/publish');

    var fsPlanCalendarTplEl=$(fsPlanCalendarTpl);
    var DateSelect=publish.dateSelect;
    var SelectBar = publish.selectBar; 
    var container=[],
        dateFormatStr="YYYY-MM-DD",
        dateFormatStr2="YYYY年MM月DD日";

    var ExportPlanDialog=Dialog.extend({
    	"sb": {},
        "attrs":{
            className:'fs-plan-export-dialog',
            content:fsPlanCalendarTplEl.filter('.fs-plan-export-tpl').html(),
            employeeId:0,
            successCb:FS.EMPTY_FN
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .date-shortcut":"_clickDateSc",   //日期快捷键
			"click .ff-success-a":"_clickAhref"  
        },
		"_clickAhref":function(){
			var elEl=this.element;
			$('.ff-success-a',elEl).hide();
		},
        "_clickDateSc":function(evt){
            var meEl=$(evt.currentTarget);
            var sd=this.sd,
                ed=this.ed;
            var weekRef=moment();
            if(weekRef.day()==0){   //sunday==0
                weekRef=weekRef.subtract('d', 1);
            }
            if(meEl.hasClass('current-week')){ //本周
                sd.setValue(weekRef.clone().startOf('week').add('d', 1));
                ed.setValue(weekRef.clone().endOf('week').add('d', 1));
            }
            if(meEl.hasClass('last-week')){ //上周
                sd.setValue(weekRef.clone().startOf('week').subtract('w', 1).add('d', 1));
                ed.setValue(moment().startOf('week'));
            }
            if(meEl.hasClass('current-month')){ //本月
                sd.setValue(moment().startOf('month'));
                ed.setValue(moment().endOf('month'));
            }
            if(meEl.hasClass('last-month')){ //上月
                sd.setValue(moment().startOf('month').subtract('M', 1));
                ed.setValue(moment().startOf('month').subtract('d', 1));
            }
            evt.preventDefault();
        },
        /**
         * 获取发布的可视范围
         * @param feedTypeName plan/approve/work/schedule...
         * @returns {{}}
         */
        getPublishRange:function(feedTypeName){
            return util.getPublishRange(feedTypeName, false, true);
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
        	var that = this;
        	var contactData =util.getContactData();
            this.contactPersonData = contactData['p'];
            this.contactGroupData = contactData['g'];
            this.currentUserData=contactData['u'];
            var elEl=this.element,
                startDateEl=$('.start-date',elEl),
                endDateEl=$('.end-date',elEl);
            var startDate = new DateSelect({
                "element": startDateEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            var endDate = new DateSelect({
                "element": endDateEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            this.sd=startDate;
            this.ed=endDate;
            this.contactGroupData = _.reject(contactData["g"],function(circleData){  //排除全公司
                return circleData.id==999999;
            });
            var sb = new SelectBar({
                "element": $('.selectbar', this.element),
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": this.contactPersonData
                    },
                    {
                        "title": "部门",
                        "type": "g",
                        "list": this.contactGroupData,
                        "unitSuffix":"个部门"
                    }
                ],
                "defaultSelectedData":[{
                	"id":this.get('employeeId'),
                    "type":"p"
                }],
                "acInitData":this.getPublishRange('note'),
                "title": "选择部门、同事&#8230;",
                "autoCompleteTitle": "请输入部门或同事的名称或拼音"
            });
            this.sb = sb;
            sb.on('inputshow',function(){
                sb.setAcInitData(that.getPublishRange('note'), $('.selectbar', that.element));
            });
        },
        "render":function(){
            var result=ExportPlanDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=ExportPlanDialog.superclass.show.apply(this,arguments);
            return result;
        },
        "hide":function(){
            var result=ExportPlanDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
				feedPlanTypeEl=$('[name="plan_type"]',elEl);
			var sd=this.sd,
				ed=this.ed,
				selectedFeedPlanType=feedPlanTypeEl.filter(':checked').val(),
                employeeId=this.get('employeeId');
			var sbData = this.sb.getSelectedData();
            var requestData={
				"employeeIDs":sbData.p||[],
				"circleIDs": sbData.g||[],
				"feedPlanType":selectedFeedPlanType,
				"startTime":sd.getValue(true).unix(),
				"endTime":ed.getValue(true).add('days', 1).subtract('seconds', 1).unix()  //保证是当天时间23:59:59
	        };
            return requestData;
        },
        "isValid":function(){
        	var sbData = this.sb.getSelectedData(),
        		p = sbData.p || [],
        		g = sbData.g || [];
        	if(!p.length && !g.length) {
        		util.alert('请选择员工或者部门。');
        		return false;
        	}
            var elEl=this.element,
                startDateInputEl=$('.start-date .fs-publish-dateselect-input',elEl),
                endDateInputEl=$('.end-date .fs-publish-dateselect-input',elEl);
			if(startDateInputEl.val()=='' || endDateInputEl.val()=='')
			{
				util.alert('起始时间不能为空！');
				return false;
			}	
            return true;
        },
        "_clear":function(){
            var elEl=this.element,
			    feedPlanTypeEl=$('[name="plan_type"]',elEl),
			    startDateInputEl=$('.start-date .fs-publish-dateselect-input',elEl),
                endDateInputEl=$('.end-date .fs-publish-dateselect-input',elEl);
			$('.ff-success-a',elEl).hide();
			$('.ff-success-a',elEl).attr('href','#')
			feedPlanTypeEl.eq(0).attr('checked','checked');
			startDateInputEl.val('');
			endDateInputEl.val('');
			this.sb.removeAllItem();
			this.sb.trigger('addItem', [{
            	"id":this.get('employeeId'),
                "type":"p"
            }], $('.selectbar', elEl));
        },
        getPersonalConfig: function(){
            var requestData=this.getRequestData(),
                employeeIDs=requestData["employeeIDs"], //员工
                circleIDs=requestData["circleIDs"], //部门
                rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                rangeNames=""; //可视范围名称
            var noteEmployees=util.getPersonalConfig('noteEmployees')||[],
                noteRanges=util.getPersonalConfig('noteRanges')||[];

            //可视范围中的员工
            _.each(employeeIDs,function(employeeId){
                var employeeData=util.getContactDataById(employeeId,'p');
                noteEmployees= _.filter(noteEmployees,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=employeeId;
                });
                //前插一个新的
                noteEmployees.unshift({
                    "dataID": employeeId,
                    "isCircle":false,
                    "name":employeeData.name
                });
                if(noteEmployees.length>5){
                    noteEmployees.pop();  //大于5的话干掉最后一个
                }
            });
            //可视范围
            if(circleIDs.length+employeeIDs.length>1){
                noteRanges= _.filter(noteRanges,function(configItem){     //先删掉以前存储的
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
                noteRanges.unshift({
                    "dataIDs": rangeIds,
                    "names":rangeNames
                });
                if(noteRanges.length>5){
                    noteRanges.pop();  //大于5的话干掉最后一个
                }
            }
            return {
                "noteEmployees":noteEmployees,
                "noteRanges":noteRanges
            };
        },
        "_submit":function(){
            var that=this;
			var elEl=this.element,
                downloadEl=$('.ff-success-a',elEl);
            
            if(this.isValid()){
            	var personalConfig=this.getPersonalConfig();
                //重设回个人配置中
                _.each(personalConfig,function(val,cateKey){
                    util.setPersonalConfig(cateKey,val);
                });
                //同步到服务端
                util.updatePersonalConfig();
				var requestData=this.getRequestData();
                util.api({
                    "data":requestData,
                    "url":"/Feedplan/GetFeedPlanExcelOfOneEmployee",
                    'timeout': 120000,//导出设置超时2min
                    "success":function(responseData){
                        var downloadName;
                        if(responseData.success){
                            that.get('successCb').apply(that,[responseData,requestData]);
                            downloadName=responseData.value.name+'_'+moment.unix(requestData.startTime).format('YYYYMMDD')+'-'+
                                moment.unix(requestData.endTime).format('YYYYMMDD')+'_日志统计报表.'+
                                util.getFileExtText(responseData.value.path);
                           // that.hide();
                            downloadEl.show();
                            downloadEl.attr('href',FS.API_PATH+'/DF/GetTemp?id='+responseData.value.path+'&name='+encodeURIComponent(downloadName)+'&isAttachment=1');
                        }
                    }
                },{
                    "submitSelector":$('.f-sub',elEl)
                });
            }
        },
        "_cancel":function(){
			this.hide();
        },
        "destroy":function(){
            var result;
            this.sd&&this.sd.destroy();
            this.ed&&this.ed.destroy();
            result=ExportPlanDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    var FsPlanCalendar=CardCalendar.extend({
        "attrs":{
            "listDefaultRequest":{
                "value":{},
                "getter":function(val){
                    if(_.isFunction(val)){
                        return val();
                    }else{
                        return val;
                    }
                }
            },
            "refreshDefaultRequest":{
                "value":{},
                "getter":function(val){
                    if(_.isFunction(val)){
                        return val();
                    }else{
                        return val;
                    }
                }
            },
            "showTodayBtn":false,
            /*"planDate":[{
             "startDate":moment().add('days', 1),    //开始创建时间
             "userId":"1"    //创建人id
             },{
             "startDate":moment().add('days', 2),
             "userId":"2"
             }],*/
            "className":"fs-plan-calendar",
            "planDate":[],
            "activePlanDate":"", //{String}
            "refreshCb":FS.EMPTY_FN //刷新日历回调
        },
        events: {
            "click .stamp-red": "_showPlan"
        },
        setup:function(){
            var that=this;
            var result=FsPlanCalendar.superclass.setup.call(this);
            this.planDialog=new Dialog({
                "content":fsPlanCalendarTplEl.filter('.fs-plan-calendar-dialog-tpl').html(),
                "className":"fs-plan-calendar-dialog",
                "width":600,
                "height":500,
                "zIndex":101
            });
            this.planList=null; //schedule是feedList中分享下一种子类型
            this.deleteStore=[this.planDialog];
            //注册自定义事件
            this._regEvents();
            return result;
        },
        /**
         * 切换当前日期后重刷日历
         * @param currentDate
         * @private
         */
        _onChangeCurrentDate:function(currentDate){
            var result=FsPlanCalendar.superclass._onChangeCurrentDate.apply(this,arguments);
            var panelState=this.get('panelState');
            if(panelState=="date"){
                this.refreshPlanDate();
            }
            return result;
        },
        /**
         * 切换面板状态后重刷日历
         * @param currentDate
         * @private
         */
        _onChangePanelState:function(panelState){
            var result=FsPlanCalendar.superclass._onChangePanelState.apply(this,arguments);
            if(panelState=="date"){
                this.refreshPlanDate();
            }
            return result;
        },
        _showPlan:function(e){
            var elEl=$(e.currentTarget),
                dateStr=elEl.attr('data-date'),
                dateValue=moment(dateStr,dateFormatStr);
            //设置当前的schedule date
            this.set('activePlanDate',dateStr);
            //打开弹框
            this.showPlanDialog(dateValue);

        },
        /**
         * 日程管理列表
         * @param  {[type]} dateValue [description]
         * @return {[type]}      [description]
         */
        showPlanDialog:function(dateValue){
            if (!this.planDialog.rendered) {
                this._renderPlanDialog();
            }
            //设置title
            $('.fs-plan-calendar-dialog-title',this.planDialog.element).text(moment(dateValue).format(dateFormatStr2)+'的日志');
            this.planDialog.show();
            //管理列表面板弹出后加载schedule列表
            this.fetchPlanList();
        },
        hidePlanDialog:function(){
            this.planDialog.hide();
        },
        /**
         * 注册自定义事件
         * @private
         */
        _regEvents:function(){
            var that=this;
            var planDialog=this.planDialog,
                planDialogEl=planDialog.element;
            planDialogEl.on('click','.close-btn',function(){
                    that.hidePlanDialog();
                });
            planDialog.after('hide',function(){
                //清空删除feed的确认弹框
                $('.show-slide-up-tip-warp').remove();
            });
        },
        _renderPlanDialog:function(){
            //渲染添加对话框
            this.planDialog.render();
            //初始化scheduleList
            this._initPlanList();
        },
        _initPlanList:function(){
            var that=this;
            var listEl=$('.plan-list',this.planDialog.element);

            this.planList=new FeedList({
                "element": listEl, //list selector
                "pagSelector": false, //pagination selector
                "withLazyload":false,   //关闭懒加载
                "listPath":"/FeedPlan/GetFeedPlanScheduleInfosByCurrentEmployeeID",
                "defaultRequestData": function () {
                    var activePlanDate=that.get('activePlanDate');
                    return _.extend({
                        "date": moment(activePlanDate,dateFormatStr).unix()
                    },that.get('listDefaultRequest'));
                }
            });
        },
        /**
         * 获取当前月起止时间，包含上月和下月再本月的显示部门
         * @returns {{startDate: *, endDate: *}}
         */
        getCurrentMonthRange:function(){
            var datePanelEl=$('.card-calendar-date-panel',this.element),
                dateEl=$('.date-body td',datePanelEl),
                startDate,
                endDate;
            startDate=moment(dateEl.first().data('date'),dateFormatStr);
            endDate=moment(dateEl.last().data('date'), dateFormatStr);
            return {
                "startDate":startDate,
                "endDate":endDate
            };
        },
        _renderPlanDate:function(){
            var that=this;
            var planDate=this.get('planDate'),
                currentMonth=this.getCurrentMonthRange(),
                startDate=currentMonth.startDate,
                endDate=currentMonth.endDate;
            //先清空red时间戳
            this.removeStamp('red');
            _.each(planDate,function(v){
                 that.setStamp("red",moment(v.startDate));
            });
            this.updateDateView();
        },
        _onRenderPlanDate:function(val){
            this._renderPlanDate();
        },
        /**
         * 重新刷新日程表，获取当前月日程点
         */
        refreshPlanDate:function(){
            var that=this;
            var currentMonth=this.getCurrentMonthRange();
            var refreshCb=this.get('refreshCb');
            util.api({
                "url":"/employee/getEmployeeShortcutInfos",
                "data": _.extend({
                    "startTime":currentMonth.startDate.unix(),   //转成秒(m)
                    "endTime":currentMonth.endDate.unix()
                },this.get('refreshDefaultRequest')),
                "type":"get",
                "success":function(responseData){
                    var items,planDate=[];
                    if(responseData.success){
                        items=responseData.value.feedPlanScheduleInfos;
                        _.each(items,function(item){
                            planDate.push({
                                "startDate":new Date(item*1000)
                            });
                        });
                        that.set('planDate',planDate);
                        refreshCb&&refreshCb.call(that,responseData);
                    }
                }
            });
        },
        _onRenderActivePlanDate:function(val){},
        fetchPlanList:function(){
            //先清空列表容器
            this.planList.empty();
            this.planList.reload();
        },
        destroy:function(){
            var that=this;
            var result;
            //组件清理
            _.each(this.deleteStore,function(cpt){
                cpt.destroy();
            });
            //销毁planList
            this.planList&&this.planList.destroy();

            this.deleteStore=[];
            result=FsPlanCalendar.superclass.destroy.call(this);
            return result;
        }
    });
    module.exports={
        "FsPlanCalendar":FsPlanCalendar,
        "ExportPlanDialog":ExportPlanDialog
    };
});