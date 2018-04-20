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
        InnerCalendar=require('innercalendar'),
        fsPlanCalendarTpl=require('./fs-plan-calendar.html'),
        fsPlanCalendarStyle=require('./fs-plan-calendar.css'),
        FeedList = require('modules/feed-list/feed-list'),
        util=require('util'),
        moment=require('moment'),
        publish=require('modules/publish/publish');

    var fsPlanCalendarTplEl=$(fsPlanCalendarTpl);
    var DateSelect=publish.dateSelect;

    var container=[],
        dateFormatStr="YYYY-MM-DD",
        dateFormatStr2="YYYY年MM月DD日";

    var ExportPlanDialog=Dialog.extend({
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
            if(meEl.hasClass('current-week')){ //本周
                sd.setValue(moment().startOf('week').add('d', 1));
                ed.setValue(moment().endOf('week').add('d', 1));
            }
            if(meEl.hasClass('last-week')){ //上周
                sd.setValue(moment().startOf('week').subtract('w', 1).add('d', 1));
                ed.setValue(moment().startOf('week'));
            }
            if(meEl.hasClass('current-month')){ //本月
                sd.setValue(moment().startOf('month'));
                ed.setValue(moment().endOf('month'));
            }
            if(meEl.hasClass('last-month')){ //上月
                sd.setValue(moment().startOf('month').subtract('M', 1));
                ed.setValue(moment().endOf('month').subtract('M', 1));
            }
            evt.preventDefault();
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
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
            var requestData={
				"employeeID":employeeId,
				"feedPlanType":selectedFeedPlanType,
				"startTime":sd.getValue(true).unix(),
				"endTime":ed.getValue(true).add('days', 1).subtract('seconds', 1).unix()  //保证是当天时间23:59:59
	        };
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
                startDateInputEl=$('.start-date .fs-publish-dateselect-input',elEl),
                endDateInputEl=$('.end-date .fs-publish-dateselect-input',elEl);
			if(startDateInputEl.val()=='' || endDateInputEl.val()=='')
			{
				util.alert('起始时间不能为空！');
				return false;
			}	
            var requestData=this.getRequestData();
            var passed=true;
            return passed;
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
        },
        "_submit":function(){
            var that=this;
			var elEl=this.element,
                downloadEl=$('.ff-success-a',elEl);
            
            if(this.isValid()){
				var requestData=this.getRequestData();
                util.api({
                    "data":requestData,
                    "url":"/Feedplan/GetFeedPlanExcelOfOneEmployee",
                    "success":function(responseData){
                        var employeeData,
                            downloadName;
                        if(responseData.success){
                            that.get('successCb').apply(that,[responseData,requestData]);
                            employeeData=util.getContactDataById(requestData.employeeID,'p');
                            downloadName=employeeData.name+'_'+moment.unix(requestData.startTime).format('YYYYMMDD')+'-'+
                                moment.unix(requestData.endTime).format('YYYYMMDD')+'_日志统计报表.'+
                                util.getFileExtText(responseData.value);
                           // that.hide();
                            downloadEl.show();
                            downloadEl.attr('href',FS.API_PATH+'/DF/GetTemp?id='+responseData.value+'&name='+encodeURIComponent(downloadName)+'&isAttachment=1');
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
    var FsPlanCalendar=InnerCalendar.extend({
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
            "click .fs-calendar-state-ordered": "_showPlan"
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
            //切换年、月保持calendar的选中状态
            this.model.on("changeMonth changeYear",function(){
                that.refreshPlanDate();
            });
            this.planList=null; //schedule是feedList中分享下一种子类型
            this.deleteStore=[this.planDialog];
            //注册自定义事件
            this._regEvents();
            container.push({
                "trigger":$(this.get('trigger')),
                "ins":this
            });
            return result;
        },
        _showPlan:function(e){
            var elEl=$(e.currentTarget),
                dateStr=elEl.attr('data-value'),
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
        _renderPlanDate:function(){
            var planDate=this.get('planDate'),
                currentMonth=this.getCurrentMonthRange(),
                dateEl=$('[data-role="date"]',this.element),
                filterDate,
                startDate=currentMonth.startDate,
                endDate=currentMonth.endDate;

            filterDate=_.filter(planDate,function(v){
                if(v.startDate>=startDate&& v.startDate<=endDate){
                    return true;
                }
            });
            dateEl.removeClass('fs-calendar-state-ordered');
            _.each(filterDate,function(v){
                dateEl.filter('[data-value="'+moment(v.startDate).format(dateFormatStr)+'"]').addClass('fs-calendar-state-ordered');
            });
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
            container= _.filter(container,function(val){
                return  val.ins!==that;
            });
            result=FsPlanCalendar.superclass.destroy.call(this);
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
    tpl.event.on('switch', function (tplName, tplEl) {
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
    module.exports={
        "FsPlanCalendar":FsPlanCalendar,
        "ExportPlanDialog":ExportPlanDialog
    };
});