/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/settings/resetpassword/resetpassword",["tabs","util","../settings-common","../settings-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=(a("tabs"),a("util")),g=a("../settings-common");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".settings-input",a),e=$(".resetpassword-form",a),h=$(".settings-input",e);e.on("click",".settings-input",function(a){var b=$(this);h.each(function(){var a=$(this);a.removeClass("settings-input-on"),a.next().hide()}),b.removeClass("settings-input-onerror"),b.nextAll(".settings-input-error").hide(),b.addClass("settings-input-on"),b.next().show(),b.next(".settings-input-prompt").show(),a.stopPropagation()}),f.regGlobalClick(h,function(){h.each(function(){var a=$(this);a.removeClass("settings-input-on"),a.next().hide()})});var i=$("#old-pwd",a),j=$("#new-pwd",a),k=$("#confirm-new-pwd",a);i.blur(function(){var a=$(this);""==a.val()?(d.next(".settings-input-prompt").hide(),a.addClass("settings-input-onerror"),a.nextAll(".settings-input-error").show()):(a.removeClass("settings-input-onerror"),a.nextAll(".settings-input-error").hide())}),j.blur(function(){var a=$(this),b=a.nextAll(".settings-input-error").html();b="",""==a.val()?(d.next(".settings-input-prompt").hide(),a.addClass("settings-input-onerror"),a.nextAll(".settings-input-error").show(),b="请输入新密码"):a.val().length<6||a.val().length>20?(d.next(".settings-input-prompt").hide(),a.addClass("settings-input-onerror"),a.nextAll(".settings-input-error").show(),b="此项应为6-20半角字符（字母、数字、符号）组成"):(a.removeClass("settings-input-onerror"),a.nextAll(".settings-input-error").hide()),a.nextAll(".settings-input-error").html(b)}),k.blur(function(){var a=$(this),b=a.nextAll(".settings-input-error").html();b="",""==a.val()?(d.next(".settings-input-prompt").hide(),a.addClass("settings-input-onerror"),a.nextAll(".settings-input-error").show(),b="请输入确认密码"):a.val()!==j.val()?(d.next(".settings-input-prompt").hide(),a.addClass("settings-input-onerror"),a.nextAll(".settings-input-error").show(),b="两次输入的密码不一致，请重新输入"):(a.removeClass("settings-input-onerror"),a.nextAll(".settings-input-error").hide()),a.nextAll(".settings-input-error").html(b)});var l=$(".pwd-save-btn",a);l.click(function(b){var d=!0;$(".settings-input",a).blur(),$(".settings-input",a).each(function(){return $(this).hasClass("settings-input-onerror")?(d=!1,!1):void 0}),d&&f.api({type:"post",data:{oldPwd:i.val(),newPwd:j.val()},url:"/Account/ChangeEmployeePasswordAndTicket/",success:function(b){b.success&&g.saveSuccessAnimated(a,c)}}),b.preventDefault()}),g.init(a,c)}});