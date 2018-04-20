/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/competitors/competitor/competitor",["util","modules/crm-list-header/crm-list-header","modules/crm-competitor-list/crm-competitor-list"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event,a("util");var f=a("modules/crm-list-header/crm-list-header"),g=a("modules/crm-competitor-list/crm-competitor-list");b.init=function(){var a=b.tplEl;b.tplName;var c=$(".competitors-competitor-warp",a),d=new g({warpEl:c,data:{listTagOptionID:"407,0",keyword:"",sortType:0,pageSize:10,pageNumber:1},url:"/Competitor/GetCompetitorList"});d.load();var e=new f({element:$(".crm-list-hd",a),title:"竞争对手",searchPlaceholder:"搜索竞争对手"});e.on("search",function(a){d.refresh({keyword:a})})}});