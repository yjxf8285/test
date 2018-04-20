/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/datamanage/datamanage",["util"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store,e.event;var f=a("util");b.init=function(){b.tplName;var a=b.tplEl,c=$(".datamanage-form",a),d=$(".j-feedid",c),e=/^[0-9]{0,10}$/,g=function(a){f.api({url:"/Management/DeleteFeed",type:"post",data:{feedID:a},dataType:"json",success:function(a){a.success&&(f.showSucessTip("信息删除成功"),d.val(""))}})};c.on("click",".j-button-submit",function(){var a=d.val();return d.val()==d.data("empty")?!1:(e.test(d.val())?f.confirm("删除该信息将删除该信息的所有回复、附件、图片、录音等信息且不可恢复、您确定删除吗？","提示",function(){g(a)}):(f.alert("信息ID错误",""),d.val("")),void 0)}),$("body").on("focusin","[data-empty]",function(){var a=$(this),b=$.trim(a.val()),c=a.data("empty");b==c&&a.val("")}).on("focusout","[data-empty]",function(){var a=$(this),b=$.trim(a.val()),c=a.data("empty");0==b.length&&a.val(c)}),f.regTplNav($(".tpl-l .flag-left-list a",a),"fl-item-on")}});