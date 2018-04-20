/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/leaderssetting/leaderssetting",["util","../settings-common","dialog","../settings-common.html","../settings-common.css","modules/crm-leaderssetting/crm-leaderssetting"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event,a("util");var f=a("../settings-common"),g=a("modules/crm-leaderssetting/crm-leaderssetting");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".leaders-settings-warp",a),e=new g({warpEl:d,url:"/Employee/GetAllEmployees",data:{isStop:0,keyword:"",isFirstChar:!1,pageSize:22,pageNumber:1}});e.load(),f.createCrmSettingLeftNav(a,c)}});