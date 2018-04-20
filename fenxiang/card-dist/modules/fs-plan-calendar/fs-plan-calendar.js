/**
 * 纷享模块逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("modules/fs-plan-calendar/fs-plan-calendar",["modules/publish/publish","dialog","mask","cardcalendar","./fs-plan-calendar.html","./fs-plan-calendar.css","modules/feed-list/feed-list","util","moment"],function(a,b,c){var d=window,e=d.FS;e.tpl;var f=a("modules/publish/publish"),g=a("dialog"),h=(a("mask"),a("cardcalendar")),i=a("./fs-plan-calendar.html"),j=(a("./fs-plan-calendar.css"),a("modules/feed-list/feed-list")),k=a("util"),l=a("moment"),f=a("modules/publish/publish"),m=$(i),n=f.dateSelect,o=f.selectBar,p="YYYY-MM-DD",q="YYYY年MM月DD日",r=g.extend({sb:{},attrs:{className:"fs-plan-export-dialog",content:m.filter(".fs-plan-export-tpl").html(),employeeId:0,successCb:e.EMPTY_FN},events:{"click .f-sub":"_submit","click .f-cancel":"_cancel","click .date-shortcut":"_clickDateSc","click .ff-success-a":"_clickAhref"},_clickAhref:function(){var a=this.element;$(".ff-success-a",a).hide()},_clickDateSc:function(a){var b=$(a.currentTarget),c=this.sd,d=this.ed,e=l();0==e.day()&&(e=e.subtract("d",1)),b.hasClass("current-week")&&(c.setValue(e.clone().startOf("week").add("d",1)),d.setValue(e.clone().endOf("week").add("d",1))),b.hasClass("last-week")&&(c.setValue(e.clone().startOf("week").subtract("w",1).add("d",1)),d.setValue(l().startOf("week"))),b.hasClass("current-month")&&(c.setValue(l().startOf("month")),d.setValue(l().endOf("month"))),b.hasClass("last-month")&&(c.setValue(l().startOf("month").subtract("M",1)),d.setValue(l().startOf("month").subtract("d",1))),a.preventDefault()},getPublishRange:function(a){return k.getPublishRange(a,!1,!0)},_renderCpt:function(){var a=this,b=k.getContactData();this.contactPersonData=b.p,this.contactGroupData=b.g,this.currentUserData=b.u;var c=this.element,d=$(".start-date",c),e=$(".end-date",c),f=new n({element:d,placeholder:"选择日期",formatStr:"YYYY年MM月DD日（dddd）"}),g=new n({element:e,placeholder:"选择日期",formatStr:"YYYY年MM月DD日（dddd）"});this.sd=f,this.ed=g,this.contactGroupData=_.reject(b.g,function(a){return 999999==a.id});var h=new o({element:$(".selectbar",this.element),data:[{title:"同事",type:"p",list:this.contactPersonData},{title:"部门",type:"g",list:this.contactGroupData,unitSuffix:"个部门"}],defaultSelectedData:[{id:this.get("employeeId"),type:"p"}],acInitData:this.getPublishRange("note"),title:"选择部门、同事&#8230;",autoCompleteTitle:"请输入部门或同事的名称或拼音"});this.sb=h,h.on("inputshow",function(){h.setAcInitData(a.getPublishRange("note"),$(".selectbar",a.element))})},render:function(){var a=r.superclass.render.apply(this,arguments);return this._renderCpt(),a},show:function(){var a=r.superclass.show.apply(this,arguments);return a},hide:function(){var a=r.superclass.hide.apply(this,arguments);return this._clear(),a},getRequestData:function(){var a=this.element,b=$('[name="plan_type"]',a),c=this.sd,d=this.ed,e=b.filter(":checked").val();this.get("employeeId");var f=this.sb.getSelectedData(),g={employeeIDs:f.p||[],circleIDs:f.g||[],feedPlanType:e,startTime:c.getValue(!0).unix(),endTime:d.getValue(!0).add("days",1).subtract("seconds",1).unix()};return g},isValid:function(){var a=this.sb.getSelectedData(),b=a.p||[],c=a.g||[];if(!b.length&&!c.length)return k.alert("请选择员工或者部门。"),!1;var d=this.element,e=$(".start-date .fs-publish-dateselect-input",d),f=$(".end-date .fs-publish-dateselect-input",d);return""==e.val()||""==f.val()?(k.alert("起始时间不能为空！"),!1):!0},_clear:function(){var a=this.element,b=$('[name="plan_type"]',a),c=$(".start-date .fs-publish-dateselect-input",a),d=$(".end-date .fs-publish-dateselect-input",a);$(".ff-success-a",a).hide(),$(".ff-success-a",a).attr("href","#"),b.eq(0).attr("checked","checked"),c.val(""),d.val(""),this.sb.removeAllItem(),this.sb.trigger("addItem",[{id:this.get("employeeId"),type:"p"}],$(".selectbar",a))},getPersonalConfig:function(){var a=this.getRequestData(),b=a.employeeIDs,c=a.circleIDs,d=c.join(",")+"|"+b.join(","),e="",f=k.getPersonalConfig("noteEmployees")||[],g=k.getPersonalConfig("noteRanges")||[];return _.each(b,function(a){var b=k.getContactDataById(a,"p");f=_.filter(f,function(b){return b.dataID!=a}),f.unshift({dataID:a,isCircle:!1,name:b.name}),f.length>5&&f.pop()}),c.length+b.length>1&&(g=_.filter(g,function(a){return a.dataIDs!=d}),_.each(c,function(a){var b=k.getContactDataById(a,"g");e+=b.name+"，"}),_.each(b,function(a){var b=k.getContactDataById(a,"p");e+=b.name+"，"}),e.length>0&&(e=e.slice(0,-1)),g.unshift({dataIDs:d,names:e}),g.length>5&&g.pop()),{noteEmployees:f,noteRanges:g}},_submit:function(){var a=this,b=this.element,c=$(".ff-success-a",b);if(this.isValid()){var d=this.getPersonalConfig();_.each(d,function(a,b){k.setPersonalConfig(b,a)}),k.updatePersonalConfig();var f=this.getRequestData();k.api({data:f,url:"/Feedplan/GetFeedPlanExcelOfOneEmployee",timeout:12e4,success:function(b){var d;b.success&&(a.get("successCb").apply(a,[b,f]),d=b.value.name+"_"+l.unix(f.startTime).format("YYYYMMDD")+"-"+l.unix(f.endTime).format("YYYYMMDD")+"_日志统计报表."+k.getFileExtText(b.value.path),c.show(),c.attr("href",e.API_PATH+"/DF/GetTemp?id="+b.value.path+"&name="+encodeURIComponent(d)+"&isAttachment=1"))}},{submitSelector:$(".f-sub",b)})}},_cancel:function(){this.hide()},destroy:function(){var a;return this.sd&&this.sd.destroy(),this.ed&&this.ed.destroy(),a=r.superclass.destroy.apply(this,arguments)}}),s=h.extend({attrs:{listDefaultRequest:{value:{},getter:function(a){return _.isFunction(a)?a():a}},refreshDefaultRequest:{value:{},getter:function(a){return _.isFunction(a)?a():a}},showTodayBtn:!1,className:"fs-plan-calendar",planDate:[],activePlanDate:"",refreshCb:e.EMPTY_FN},events:{"click .stamp-red":"_showPlan"},setup:function(){var a=s.superclass.setup.call(this);return this.planDialog=new g({content:m.filter(".fs-plan-calendar-dialog-tpl").html(),className:"fs-plan-calendar-dialog",width:600,height:500,zIndex:101}),this.planList=null,this.deleteStore=[this.planDialog],this._regEvents(),a},_onChangeCurrentDate:function(){var a=s.superclass._onChangeCurrentDate.apply(this,arguments),b=this.get("panelState");return"date"==b&&this.refreshPlanDate(),a},_onChangePanelState:function(a){var b=s.superclass._onChangePanelState.apply(this,arguments);return"date"==a&&this.refreshPlanDate(),b},_showPlan:function(a){var b=$(a.currentTarget),c=b.attr("data-date"),d=l(c,p);this.set("activePlanDate",c),this.showPlanDialog(d)},showPlanDialog:function(a){this.planDialog.rendered||this._renderPlanDialog(),$(".fs-plan-calendar-dialog-title",this.planDialog.element).text(l(a).format(q)+"的日志"),this.planDialog.show(),this.fetchPlanList()},hidePlanDialog:function(){this.planDialog.hide()},_regEvents:function(){var a=this,b=this.planDialog,c=b.element;c.on("click",".close-btn",function(){a.hidePlanDialog()}),b.after("hide",function(){$(".show-slide-up-tip-warp").remove()})},_renderPlanDialog:function(){this.planDialog.render(),this._initPlanList()},_initPlanList:function(){var a=this,b=$(".plan-list",this.planDialog.element);this.planList=new j({element:b,pagSelector:!1,withLazyload:!1,listPath:"/FeedPlan/GetFeedPlanScheduleInfosByCurrentEmployeeID",defaultRequestData:function(){var b=a.get("activePlanDate");return _.extend({date:l(b,p).unix()},a.get("listDefaultRequest"))}})},getCurrentMonthRange:function(){var a,b,c=$(".card-calendar-date-panel",this.element),d=$(".date-body td",c);return a=l(d.first().data("date"),p),b=l(d.last().data("date"),p),{startDate:a,endDate:b}},_renderPlanDate:function(){var a=this,b=this.get("planDate"),c=this.getCurrentMonthRange();c.startDate,c.endDate,this.removeStamp("red"),_.each(b,function(b){a.setStamp("red",l(b.startDate))}),this.updateDateView()},_onRenderPlanDate:function(){this._renderPlanDate()},refreshPlanDate:function(){var a=this,b=this.getCurrentMonthRange(),c=this.get("refreshCb");k.api({url:"/employee/getEmployeeShortcutInfos",data:_.extend({startTime:b.startDate.unix(),endTime:b.endDate.unix()},this.get("refreshDefaultRequest")),type:"get",success:function(b){var d,e=[];b.success&&(d=b.value.feedPlanScheduleInfos,_.each(d,function(a){e.push({startDate:new Date(1e3*a)})}),a.set("planDate",e),c&&c.call(a,b))}})},_onRenderActivePlanDate:function(){},fetchPlanList:function(){this.planList.empty(),this.planList.reload()},destroy:function(){var a;return _.each(this.deleteStore,function(a){a.destroy()}),this.planList&&this.planList.destroy(),this.deleteStore=[],a=s.superclass.destroy.call(this)}});c.exports={FsPlanCalendar:s,ExportPlanDialog:r}});