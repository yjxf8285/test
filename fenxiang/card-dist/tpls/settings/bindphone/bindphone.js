/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/bindphone/bindphone",["tabs","util","../settings-common","dialog","../settings-common.html","../settings-common.css"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=(a("tabs"),a("util")),g=a("../settings-common"),h=f.getContactData(),i=h.u;b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".bpmb-btn",a),e=$(".bpmn-input",a),h=$(".bindphone-success",a),j=$(".bindphone-main",a),k=$(".phone-wrapper",a);i.isPhoneBound?(k.html(i.mobile.slice(0,3)+"****"+i.mobile.slice(-4)),h.show(),j.hide()):(h.hide(),j.show()),d.click(function(){""!=e.val()&&f.isMobilePhoneNum(e.val())?f.api({type:"post",data:{mobile:e.val()},url:"/Account/MobileBinding/",success:function(a){if(a.success){var b=e.val(),c=b.slice(0,3)+"****"+b.slice(-4);k.html(c),h.show(),j.hide(),i.isPhoneBound=!0,i.mobile=e.val()}}}):f.showInputError(e)});var l=$("#edit-number",a),m=$("#cannel-bind",a);m.click(function(a){f.api({type:"post",data:{},url:"/Account/CancelMobileBinding/",success:function(a){a.success&&(h.hide(),j.show(),e.val(""),i.isPhoneBound=!1)}}),a.preventDefault()}),l.click(function(){h.hide(),j.show(),e.val("")}),g.init(a,c)}});