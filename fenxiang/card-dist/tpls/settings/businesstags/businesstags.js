/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/settings/businesstags/businesstags",["util","uilibs/search-box","modules/crm-businesstags/crm-businesstags","../settings-common","dialog","../settings-common.html","../settings-common.css"],function(a,b){var c=window,d=c.FS,e=d.tpl,f=e.event,g=a("util");a("uilibs/search-box");var h=a("modules/crm-businesstags/crm-businesstags"),i=a("../settings-common");b.init=function(){var a=b.tplEl,c=b.tplName,d=$(".businesstags-warp",a),e=new h({warpEl:d,url:"/FBusinessTag/GetBusinessTags",data:{}});i.createCrmSettingLeftNav(a,c),f.on("switched",function(a){var b,d,f;a==c&&(b=g.getTplQueryParams(),d=b?b.tagtype:1,f={tagType:parseFloat(d),keyword:""},e&&e.refresh(f))})}});