/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/work/performance/performance",["util","dialog","modules/publish/publish","moment","../work-common","../work-common.html","tpls/approve/approve-common","modules/publish/publish-helper"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store;var f=e.event,g=a("util");a("dialog");var h=a("modules/publish/publish"),i=a("moment"),j=a("../work-common"),k=a("tpls/approve/approve-common"),l=a("modules/publish/publish-helper"),m=l.DateSelect,n=h.selectBar,o=k.AllApproveValid,p=g.getContactData();p.u,b.init=function(){var a=b.tplEl,c=b.tplName,e=$(".performance",a),h=g.getContactData(),k=h.u,l=k.inVipService;j.init(a,c);var p=function(a){a=$.extend({element:e},a||{}),this.opts=a,this.element=a.element,this.statusId=0,this.init()};$.extend(p.prototype,{init:function(){this.inVipServiceFn(),this.bindEvents(),this.setDateSelect(),this.senderSb(),this.executorSb()},inVipServiceFn:function(){var a=this.element,b=$(".j-submit-btn",a),c=$(".total-download-time",a);l?$(".readme-list",a).remove():(b.addClass("button-state-disabled"),g.api({url:"/file/GetDownLoadLimit",type:"get",dataType:"json",data:{bussinessType:3},beforeSend:function(){},success:function(d){if(d.success){var e=d.value.value,f=d.value.value1,g=e-f;c.text(e),g>0?(parseFloat(g)/e<=.1?(b.text("生成报表（余"+g+"次）"),$(".readme-list",a).show()):(b.text("生成报表"),$(".readme-list",a).hide()),b.data("value",g),b.data("total",e),b.removeClass("button-state-disabled")):(b.text("生成报表（余0次）"),$(".readme-list",a).show())}}}))},bindEvents:function(){var a=this.element,b=this;a.on("click",".performance-form .j-submit-btn",function(a){var c=$(a.currentTarget);c.is(".button-state-disabled")||(b.inVipServiceFn(),b.fecth())}),a.on("click",".download-link",function(b){var c=$(b.currentTarget),d=$(".j-submit-btn",a),e=d.data("value"),f=d.data("total");parseFloat(e-1)/f<=.1?(d.text("生成报表（余"+(e-1)+"次）"),$(".readme-list",a).show()):$(".readme-list",a).hide(),1==e&&d.addClass("button-state-disabled"),c.hide()}),a.on("click",".performance-status a",function(){return $(".performance-status a",a).removeClass("cur"),$(this).addClass("cur"),b.statusId=$(this).data("statusid"),!1}),a.on("click",".performance-form .clear-h",function(){b.starttimeDs.clear(),b.endtimeDs.clear()}),a.on("click",".date-shortcut",function(a){var c=b.starttimeDs,d=b.endtimeDs,e=$(this),f=i();0==f.day()&&(f=f.subtract("d",1)),e.hasClass("current-week")&&(c.setValue(f.clone().startOf("week").add("d",1)),d.setValue(f.clone().endOf("week").add("d",1))),e.hasClass("last-week")&&(c.setValue(f.clone().startOf("week").subtract("w",1).add("d",1)),d.setValue(f.clone().startOf("week"))),e.hasClass("current-month")&&(c.setValue(i().startOf("month")),d.setValue(i().endOf("month"))),e.hasClass("last-month")&&(c.setValue(i().startOf("month").subtract("M",1)),d.setValue(i().startOf("month").subtract("d",1))),a.preventDefault()})},senderSb:function(){var a=this.element,b=$(".sender-sb",a),c=new n({element:b,data:[{title:"同事",type:"p",list:h.p}],singleCked:!0,title:"选择发出人",autoCompleteTitle:"请输入姓名或拼音"});this.senderSb=c},executorSb:function(){var a=this.element,b=$(".executor-sb",a),c=new n({element:b,data:[{title:"同事",type:"p",list:h.p},{title:"部门",type:"g",list:h.g}],singleCked:!1,title:"选择执行人",autoCompleteTitle:"请输入员工姓名或部门"});this.executorSb=c},setDateSelect:function(){var a=this.element,b=$(".start-date",a),c=$(".end-date",a),d=new m({element:b,placeholder:"选择日期",formatStr:"YYYY年MM月DD日"}),e=new m({element:c,placeholder:"选择日期",formatStr:"YYYY年MM月DD日"});this.starttimeDs=d,this.endtimeDs=e},isValid:function(){var a=this.starttimeDs,b=this.endtimeDs,c=this.setOdata();return 0==c.startTime?(g.showInputError($("input",a.element)),!1):0==c.endTime?(g.showInputError($("input",b.element)),!1):c.startTime>c.endTime?(g.alert("请选择发送的结束时间大于开始时间"),!1):!0},setOdata:function(){var a=this.senderSb,b=this.executorSb,c=a.getSelectedData(),d=b.getSelectedData(),e=c.p||[0],f=d.p||[],g=d.g||[],h=this.starttimeDs.getValue(!0),i=this.endtimeDs.getValue(!0),j={};return h=h?h.unix():0,i=i?i.add("days",1).subtract("seconds",1).unix():0,_.extend(j,{workType:this.statusId,startTime:h,endTime:i,assignerID:e[0],executerEmployeeIDs:f,executerCircleIDs:g}),j},fecth:function(){var a=this.element,b=this.setOdata(),c=$(".downbtntip",a);this.isValid()&&g.api({url:"/FeedWork/GetExportWorkSummary",type:"post",dataType:"json",timeout:12e4,data:b,beforeSend:function(){c.show().addClass("loading").html("正在生成报表，请稍后...")},success:function(a){if(a.success){var b='<a class="download-link" href="'+d.API_PATH+"/df/gettemp1?id="+a.value+"&name="+encodeURIComponent("员工指令统计报表")+'.xls&bussinessType=3">生成完毕，点击下载报表</a>';c.html(b).removeClass("loading")}else c.hide()}},{modal:$(".performance-form .j-submit-btn",a)})},destroy:function(){}}),new p({element:e});var q=new o({defaultRequestData:function(){return{functionNo:5}},successCb:function(a){a.success}});f.one("switched",function(a){a==c&&q.show()})}});