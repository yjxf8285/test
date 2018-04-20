/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/settings-common",["dialog","util","./settings-common.html","./settings-common.css"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("dialog"),g=a("util"),h=a("./settings-common.html"),i=(a("./settings-common.css"),$(h));b.init=function(a){var b,c,e=g.getContactData(),f=e.u,h=i.filter(".settings-tpl-left").html(),j=$(".tpl-l .tpl-inner",a);j.html(h),b=$(".bind-email-l-wrapper",j),c=$(".set-leader-l-wrapper",j);var k=$(".settings-nav-list",a);k.find("li > a").click(function(){var a=$(this);k.find("li > a").removeClass("depw-menu-aon"),a.addClass("depw-menu-aon")}),f.exmailDomain&&b.show(),d.getAppStore("contactData")&&d.getAppStore("contactData").isAllowSetOwnLeader&&c.show(),g.regTplNav($("a",k),"depw-menu-aon"),g.tplRouterReg("#settings/personalsetting"),g.tplRouterReg("#settings/resetpassword"),g.tplRouterReg("#settings/avatarsetting"),g.tplRouterReg("#settings/bindphone"),g.tplRouterReg("#settings/setupnodisturb"),g.tplRouterReg("#settings/personalclientconfig"),g.tplRouterReg("#settings/planremindconfig"),g.tplRouterReg("#settings/boundexmail"),g.tplRouterReg("#settings/setleader")},b.saveSuccessAnimated=function(a){var b=$(".save-success-apv",a);b.animate({top:"0px"},300,function(){setTimeout(function(){b.animate({top:"54px"},300)},2e3)})},b.createCrmSettingLeftNav=function(a){var b=i.filter(".crm-settings-left-tpl").html(),c=$(".crm-tpl-l .tpl-inner",a),d=g.getCrmData(),e=d.tags;c.html(_.template(b)({tagData:_.map(e,function(a){return{tagType:a.value,tagName:a.value1}})})),c.on("click",".label-manage-l",function(a){var b=$(".label-manage-list",c);b.show(),a.preventDefault(),a.stopPropagation()}),c.on("click",".label-salesstage-l",function(a){var b=$(".label-manage-list",c);b.hide(),j.load(),a.preventDefault(),a.stopPropagation()}),g.regGlobalClick($(".label-manage-list",c)),g.regTplNav($(".tpl-nav-l",c),"state-active"),g.regTplNav($(".label-manage-list a",c),"state-active");var h=f.extend({attrs:{width:500,content:i.filter(".crm-salesstagedialog-tpl").html(),className:"dialog-createnewproductdialog"},events:{"click .js-inuse":"selectTr","click .button-submit":"submit","click .button-cancel":"hide"},selectTr:function(a){var b=$(a.currentTarget),c=b.closest("tr"),d=c.find("td input");b.parent().is(".mn-disabled-checkbox-box")?(a.preventDefault(),a.stopPropagation()):b.is(".mn-selected")?(d.prop("disabled",!0),b.data("value",!1)):(d.prop("disabled",!1),b.data("value",!0))},load:function(){var a=this;g.api({url:"/SalesStage/GetAllSalesStages",type:"get",dataType:"json",success:function(b){if(b.success){var c=b.value.salesStages,d=$(".salesstagedialog-table tbody",a.element),e="";_.each(c,function(a){var b=a.salesStageNo,c=a.inUse,d=a.name,f=a.winRate,g="",h="",i="";c?i="mn-selected":g='disabled="disabled"',(10==b||11==b)&&(g='disabled="disabled"',h="mn-disabled-checkbox-box"),e+='<tr data-salesstageno="'+b+'"> <td><div class="mn-checkbox-box checkbox-for-comtable '+h+'">&nbsp;&nbsp;<span class="mn-checkbox-item js-inuse '+i+'" data-value="'+c+'"></span> </div></td> <td><input type="text" class="textfield input-name" value="'+d+'" '+g+'></td> <td><input type="text" class="textfield input-winrate" value="'+f+'" '+g+"></td> </tr>"}),d.html(e),a.show()}}})},submit:function(){var a=this,b=$(".salesstagedialog-table tbody",a.element),c=[];b.find("tr").each(function(){var a=$(this).data("salesstageno"),b=$(this).find(".js-inuse").data("value"),d=$(this).find(".input-name").val(),e=$(this).find(".input-winrate").val();c.push({inUse:b,name:d,salesStageNo:a,winRate:Number(e)})}),g.confirm("您确定要保存您对销售阶段设置的修改吗？","",function(){g.api({url:"/SalesStage/SetSalesStages",type:"post",data:{salesStagesJson:c},dataType:"json",success:function(b){b.success&&(g.remind(1,"修改成功"),a.load())}})})}}),j=new h;j.render()}});