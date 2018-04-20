/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/worktodo/tododetail/tododetail",["util","modules/fs-worktodo/worktodo-list","../worktodo-common","moment","../worktodo-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=a("util"),h=a("modules/fs-worktodo/worktodo-list"),i=a("../worktodo-common");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".worktodo-list",a);i.init(a,c);var e=new h({element:d,pagSelector:!1,listPath:"/worktodolist/getWorkToDoListByID",defaultRequestData:function(){var a=g.getTplQueryParams(),b=a?a.id:0;return{workToDoListID:b}}});f.on("switch",function(a){a==c&&(e.loaded?e.reload():(e.load(),e.loaded=!0))}),g.tplRouterReg("#worktodo")}});