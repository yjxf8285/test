/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/circles/circles-common",["util","./circles-common.html"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event;var f=a("util"),g=a("./circles-common.html"),h=$(g);b.init=function(a){var b=$(".tpl-l .tpl-inner",a),c=f.getContactData(),d=c.u,e=(d.groupIDs,c.g),g={},i=[],j=_.template(h.filter(".circles-tpl-left").html());_.extend(g,{userName:d.name,profileImage:d.profileImage}),e=_.filter(e,function(a){return"999999"!=a.id}),_.each(e,function(a){a&&i.push({groupNameEncoded:encodeURIComponent(a.name),groupName:a.name,groupID:a.id,cTitle:a.name})}),g.groups=i,b.html(j(g)),f.regTplNav($(".circles-nav-list .files-nav-item a",b))}});