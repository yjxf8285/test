/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
define("tpls/disk/disk",["modules/webdisk/webdisk"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.store,e.event;var f=a("modules/webdisk/webdisk");b.init=function(){b.tplName;var a=b.tplEl,c=$(".disk-model",a);new f({element:c,listPath:"/NetDisk/GetNDDirectoryInfos"})}});