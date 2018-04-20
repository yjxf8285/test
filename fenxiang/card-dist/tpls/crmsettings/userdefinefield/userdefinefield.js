/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/crmsettings/userdefinefield/userdefinefield",["util","modules/crm-userdefinefield/crm-userdefinefield","../settings-common","dialog","modules/crm-high-seas/crm-high-seas","../settings-common.html","../settings-common.css"],function(a,b){var c,d,e=window,f=e.FS,g=f.tpl,h=g.event,i=a("util"),j=a("modules/crm-userdefinefield/crm-userdefinefield"),k=a("../settings-common");b.init=function(){var a=b.tplEl;c=b.tplName;var e=i.getTplQueryParams(),f=e?e.tagtype:1,g=$(".userdefinefield-warp",a);d=new j({warpEl:g,data:{tagType:f}}),k.createCrmSettingLeftNav(a,c)},h.on("switched",function(a){var b,e,f;a==c&&(b=i.getTplQueryParams(),e=b?b.tagtype:1,f={tagType:parseFloat(e),keyword:""},d&&d.refresh(f))})});