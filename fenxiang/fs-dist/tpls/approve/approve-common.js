/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/approve/approve-common",["util","moment","dialog","modules/publish/publish","./approve-common.css","./approve-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=a("moment"),h=a("dialog"),i=a("modules/publish/publish"),j=(a("./approve-common.css"),a("./approve-common.html")),k=$(j),l=i.selectBar,m=i.dateSelect;f.tplRouterReg("#approve/sentapproves/=/:approvestatus-:value");var n=function(a){var b=$(".approver-my-list-wrap",a),c=$(".approver-ups-list-wrap",a);b.empty(),c.empty(),f.api({type:"get",data:{},url:"/feedApprove/getFeedApprovesInAbeyance",success:function(a){if(a.success){var d=a.value.iSends,e=a.value.iSendCount;if($(".approver-ups-title-count").text(e),d.length>5&&(d=d.slice(0,5)),d.length>0){var h="";_.each(d,function(a){if(a.employee){var b=a.employee,c=b?b.name:"",d=a.employeeID,e=f.getAvatarLink(b?b.profileImage:"",3),i=g.unix(a.dateTime).format("MM-DD HH:mm"),j=a.feedID,k=a.feedContent;h+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+e+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+d+"' class='fna-blue'>"+c+"</a> <span class='rlist-pname-apvdate'>"+i+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+j+"'>"+k+"</a></div>"}}),c.html(h)}else c.append("<div class='right-list-notext color-999999'>无我审批的事项</div>");var i=a.value.toBeIs,j=a.value.toBeICount;if($(".approver-my-title-count").text(j),i.length>5&&(i=i.slice(0,5)),i.length>0){var k="";_.each(i,function(a){if(a.employee){var b=a.employee,c=b?b.name:"",d=a.employeeID,e=f.getAvatarLink(b?b.profileImage:"",3),h=g.unix(a.dateTime).format("MM-DD HH:mm"),i=a.feedID,j=a.feedContent;k+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+e+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+d+"' class='fna-blue'>"+c+"</a> <span class='rlist-pname-apvdate'>"+h+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+i+"'>"+j+"</a></div>"}}),b.html(k)}else b.append("<div class='right-list-notext color-999999'>无上级审批的事项</div>")}}})};b.createRightSb=n;var o=h.extend({attrs:{width:400,className:"all-approve-valid-dialog",content:k.filter(".all-approve-valid-tpl").html(),successCb:d.EMPTY_FN,cancelCb:function(){e.navRouter.navigate("#stream",{trigger:!0})},defaultRequestData:d.EMPTY_FN},events:{"click .ui-dialog-close":"_clickCloseBtn","keydown .pwd":"_keydownPwd","click .f-sub":"_submit","click .f-cancel":"_cancel"},hide:function(){var a=o.superclass.hide.apply(this,arguments);return this._clear(),a},getRequestData:function(){var a=this.element,b=$(".pwd",a),c={password:_.str.trim(b.val())};return _.extend(c,this.get("defaultRequestData")()),c},isValid:function(){var a=this.element,b=$(".pwd",a);return 0==_.str.trim(b.val()).length?(f.showInputError(b),!1):!0},_clickCloseBtn:function(){this.hide(),this.get("cancelCb").call(this)},_clear:function(){var a=this.element,b=$(".pwd",a);b.val("")},_keydownPwd:function(a){var b=this.element;$(".f-sub",b),13==a.keyCode&&this._submit(a)},_submit:function(){var a=this,b=this.getRequestData(),c=$(".f-sub",this.element);this.isValid()&&f.api({data:b,url:"/Account/ValidateUserAndPermission",success:function(c){c.success&&(a.get("successCb").apply(a,[c,b]),a.hide())}},{submitSelector:c})},_cancel:function(){this.hide(),this.get("cancelCb").call(this)}});b.AllApproveValid=o;var p=h.extend({attrs:{width:500,className:"all-approve-month-work-dialog",content:k.filter(".all-approve-month-work-tpl").html()},events:{"click .f-sub":"_submit","click .f-cancel":"_cancel","click .download-l":"_hideDownload"},hide:function(){var a=p.superclass.hide.apply(this,arguments);return this._clear(),a},show:function(){var a=p.superclass.show.apply(this,arguments),b=$(".free-download-readme",this.element);return this.inVipService()?b.hide():(this._adjustDownLoadTime(),b.show()),a},_adjustDownLoadTime:function(a){var b=this,c=this.element,d=$(".f-sub",c),e=$(".free-download-readme .total-download-time",c);d.addClass("button-state-disabled"),f.api({url:"/file/GetDownLoadLimit",type:"get",data:{bussinessType:4},success:function(c){var f,g;c.success&&(f=c.value,g=f.value-f.value1,d.text("生成报表（余"+g+"次）").data("remainTime",g),g>0&&d.removeClass("button-state-disabled"),e.text(f.value)),a&&a.call(b,c)}})},inVipService:function(){var a=f.getContactData(),b=a.u;return b.inVipService},render:function(){var a=p.superclass.render.apply(this,arguments);return this._renderCpt(),a},_renderCpt:function(){var a=this.element,b=$(".range-sb",a),c=$(".year-select",a),d=$(".month-select",a),e=f.getContactData(),h=g().year(),i=g().month(),j="",k=new l({element:b,data:[{title:"同事",type:"p",list:e.p},{title:"部门",type:"g",list:e.g}],title:"请选择同事范围",autoCompleteTitle:"请输入姓名或拼音",acInitData:f.getPublishRange()});this.sb=k,c.html('<option value="'+(h-1)+'">'+(h-1)+'年</option><option value="'+h+'" selected="selected">'+h+"年</option>");for(var m=1;12>=m;m++)j+='<option value="'+m+'">'+(10>m?"0"+m:m)+"月</option>";d.html(j).val(i+1)},_hideDownload:function(a){var b,c=this.element,d=$(".f-sub",c);this.inVipService()||(b=d.data("remainTime"),b--,d.text("生成报表（余"+b+"次）").data("remainTime",b),0>=b&&d.addClass("button-state-disabled")),$(a.currentTarget).hide()},getRequestData:function(){var a=this.element,b=$(".year-select",a),c=$(".month-select",a),d=this.sb.getSelectedData(),e={year:_.str.trim(b.val()),month:_.str.trim(c.val()),circleIds:(d.g||[]).join(","),employeeIds:(d.p||[]).join(",")};return e},isValid:function(){return!0},_clear:function(){var a=this.element,b=$(".year-select",a),c=$(".month-select",a),d=$(".download-l",a),e=g().year(),f=g().month();b.val(e),c.val(f),this.sb.removeAllItem(),d.hide()},_submit:function(){var a,b=this.element,c=$(".download-l",b),e=$(".f-sub",b),g=this.getRequestData(),h=function(){f.api({data:g,url:"/FeedApprove/ExportStaffLeaveStatistics",type:"get",success:function(b){b.success&&(a=g.year+"-"+g.month+"_月度考勤统计."+f.getFileExtText(b.value),c.attr("href",d.API_PATH+"/DF/GetTemp1?bussinessType=4&id="+b.value+"&name="+encodeURIComponent(a)+"&isAttachment=1").show())}},{submitSelector:e})};this.isValid()&&!e.hasClass("button-state-disabled")&&(this.inVipService()?h():this._adjustDownLoadTime(function(a){a.success&&h()}))},_cancel:function(){this.hide()},destroy:function(){var a;return this.sb&&this.sb.destroy(),a=p.superclass.render.apply(this,arguments)}});b.MonthWorkDialog=p;var q=h.extend({attrs:{width:500,className:"all-approve-comp-dialog",content:k.filter(".all-approve-comp-tpl").html()},events:{"click .f-sub":"_submit","click .f-cancel":"_cancel","click .date-shortcut":"_clickDateSc","click .clear-l":"_clearDate","click .download-l":"_hideDownload"},hide:function(){var a=q.superclass.hide.apply(this,arguments);return this._clear(),a},show:function(){var a=q.superclass.show.apply(this,arguments),b=$(".free-download-readme",this.element);return this.inVipService()?b.hide():(this._adjustDownLoadTime(),b.show()),a},render:function(){var a=q.superclass.render.apply(this,arguments);return this._renderCpt(),a},_adjustDownLoadTime:function(a){var b=this,c=this.element,d=$(".f-sub",c),e=$(".free-download-readme .total-download-time",c);d.addClass("button-state-disabled"),f.api({url:"/file/GetDownLoadLimit",type:"get",data:{bussinessType:5},success:function(c){var f,g;c.success&&(f=c.value,g=f.value-f.value1,d.text("生成报表（余"+g+"次）").data("remainTime",g),g>0&&d.removeClass("button-state-disabled"),e.text(f.value)),a&&a.call(b,c)}})},_renderCpt:function(){var a=this.element,b=$(".range-sb",a),c=$(".start-date",a),d=$(".end-date",a),e=f.getContactData(),g=new l({element:b,data:[{title:"同事",type:"p",list:e.p},{title:"部门",type:"g",list:e.g}],title:"请选择同事范围",autoCompleteTitle:"请输入姓名或拼音",acInitData:f.getPublishRange()}),h=new m({element:c,placeholder:"选择日期",formatStr:"YYYY年MM月DD日（dddd）"}),i=new m({element:d,placeholder:"选择日期",formatStr:"YYYY年MM月DD日（dddd）"});this.sb=g,this.sd=h,this.ed=i},inVipService:function(){var a=f.getContactData(),b=a.u;return b.inVipService},_hideDownload:function(a){var b,c=this.element,d=$(".f-sub",c);this.inVipService()||(b=d.data("remainTime"),b--,d.text("生成报表（余"+b+"次）").data("remainTime",b),0>=b&&d.addClass("button-state-disabled")),$(a.currentTarget).hide()},_clickDateSc:function(a){var b=$(a.currentTarget),c=this.sd,d=this.ed;b.hasClass("current-week")&&(c.setValue(g().startOf("week").add("d",1)),d.setValue(g().endOf("week").add("d",1))),b.hasClass("last-week")&&(c.setValue(g().startOf("week").subtract("w",1).add("d",1)),d.setValue(g().startOf("week"))),b.hasClass("current-month")&&(c.setValue(g().startOf("month")),d.setValue(g().endOf("month"))),b.hasClass("last-month")&&(c.setValue(g().startOf("month").subtract("M",1)),d.setValue(g().endOf("month").subtract("M",1))),a.preventDefault()},_clearDate:function(a){var b=this.sd,c=this.ed;b.clear(),c.clear(),a.preventDefault()},getRequestData:function(){var a=this.element,b=$(".is-include-reply",a),c=$(".approve-type",a),d=this.sd,e=this.ed,f=this.sb.getSelectedData(),g=d.getValue(!0),h=e.getValue(!0),i={beginTime:g?g.unix():0,endTime:h?h.unix():0,circleIDs:(f.g||[]).join(","),employeeIDs:(f.p||[]).join(","),approveType:c.filter(":checked").val(),isDisplayReply:b.prop("checked")};return i},isValid:function(){var a=this.sd,b=this.ed,c=a.getValue(!0),d=b.getValue(!0);return c?d?!0:(f.showInputError(b.element),!1):(f.showInputError(a.element),!1)},_clear:function(){var a=this.element,b=$(".approve-type",a),c=$(".is-include-reply",a),d=$(".download-l",a);b.filter('[value="0"]').prop("checked",!0),c.prop("checked",!1),this.sb.removeAllItem(),this.sd.clear(),this.ed.clear(),d.hide()},_submit:function(){var a,b=this.element,c=$(".download-l",b),e=$(".f-sub",b),h=this.getRequestData(),i=function(){f.api({data:h,url:"/FeedApprove/ExportApprovalSummary",type:"get",success:function(b){b.success&&(a=g.unix(h.beginTime).format("YYYYMMDD")+"-"+g.unix(h.endTime).format("YYYYMMDD")+"审批汇总统计."+f.getFileExtText(b.value),c.attr("href",d.API_PATH+"/DF/GetTemp1?bussinessType=5&id="+b.value+"&name="+encodeURIComponent(a)+"&isAttachment=1").show())}},{submitSelector:e})};this.isValid()&&!e.hasClass("button-state-disabled")&&(this.inVipService()?i():this._adjustDownLoadTime(function(a){a.success&&i()}))},_cancel:function(){this.hide()},destroy:function(){var a;return this.sb&&this.sb.destroy(),a=q.superclass.render.apply(this,arguments)}});b.CompDialog=q,b.init=function(a,b){var c=$(".tpl-l .tpl-inner",a),d=f.getContactData(),e=d.u,g=e.functionPermissions,h={},i=_.template(k.filter(".approve-tpl-left").html());_.extend(h,{userName:e.name,profileImage:e.profileImage}),c.html(i(h)),_.some(g,function(a){return 3==a.value})?$(".finance-approve-l",c).closest(".files-nav-item").show():_.some(g,function(a){return 4==a.value})&&$(".staffing-approve-l",c).closest(".files-nav-item").show(),f.regTplNav($(".tpl-nav-lb",c),"depw-menu-aon"),n(a,b),f.tplRouterReg($(".tpl-nav-lb",c))}});