/**
 * 纷享资源脚本
 * @Author: 纷享网页前端部
 * @Date: 2014-09-02
 */
!function(a){var b=(FS_VERSION||"0.0.0.0").split("."),c=PUBLISH_MODEL||"product",d={},e={store:{},list:{},event:null,navRouter:null},f={},g="product"==c?"fs-dist":"fs";d.BASE_PATH=FS_BASEPATH||"",_.extend(d,{TPL_PATH:d.BASE_PATH+"/html/"+g+"/tpls",MODULE_PATH:d.BASE_PATH+"/html/"+g+"/modules",FILES_PATH:d.BASE_PATH+"/temp/files",ASSETS_PATH:d.BASE_PATH+"/html/"+g+"/assets",API_PATH:d.BASE_PATH+"/H",BLANK_IMG:d.BASE_PATH+"/html/"+g+"/assets/images/clear.gif",BLANK_PAGE:d.BASE_PATH+"/html/"+g+"/tpls/blank/blank.html"}),seajs.config({plugins:["shim","text","style"],alias:{$:{src:"jslibs/jquery-1.8.3.min.js",exports:function(){return Backbone.$=jQuery,Backbone.history.start(),Backbone.emulateHTTP=!0,Backbone.emulateJSON=!0,define("$-debug",[],function(a,b,c){c.exports=jQuery}),jQuery}},swfobject:{src:"jslibs/swfobject.js",exports:function(){return swfobject}},swfupload:{src:"assets/swfupload/swfupload.js",exports:function(){return SWFUpload}},spin:{src:"assets/js/spin.min.js",exports:function(){return Spinner}},datatable_core:{src:"assets/datatable/js/jquery.dataTables.min.js",exports:function(){return jQuery.fn.dataTable}},audioplayer:{src:"assets/audio-player/audio-player-noswfobject.js",exports:function(){return AudioPlayer.setup(d.ASSETS_PATH+"/audio-player/player.swf",{width:290,initialvolume:100,transparentpagebg:"yes",left:"000000",lefticon:"FFFFFF"}),AudioPlayer}},store:{src:"assets/js/store.js",exports:function(){return store}},tinyscrollbar:{src:"assets/js/jquery.tinyscrollbar.js",exports:function(){return $.fn.tinyscrollbar}},scrollbar:"assets/uilibs/scrollbar/scrollbar.js",datatable:"assets/datatable/js/datatables.js",json:"gallery/json/1.0.2/json",detector:"arale/detector/1.1.0/detector",position_core:"arale/position/1.0.0/position",position:"jslibs/position",placeholder:"uilibs/placeholder",base:"arale/base/1.0.1/base",widget:"arale/widget/1.0.3/widget",validator_core:"arale/validator/0.9.2/validator",validator:"uilibs/validator",overlay:"arale/overlay/1.0.1/overlay",dialog_core:"arale/dialog/1.0.1/dialog",dialog:"uilibs/dialog",confirmbox_core:"arale/dialog/1.0.1/confirmbox",confirmbox:"uilibs/confirmbox",tabs_core:"arale/switchable/0.9.12/tabs",tabs:"uilibs/tabs",filter:"uilibs/filter",autocomplete_core:"arale/autocomplete/1.2.0/autocomplete",autocomplete:"uilibs/autocomplete",select_core:"arale/select/0.9.3/select",select:"uilibs/select",calendar_core:"arale/calendar/0.8.5/calendar",calendar:"uilibs/calendar",innercalendar:"uilibs/innercalendar",mask:"arale/overlay/1.0.1/mask",events_core:"arale/events/1.0.0/events",events:"jslibs/events",moment_core:"gallery/moment/2.0.0/moment",moment:"uilibs/moment",fsupload:"uilibs/fsupload",h5uploader:"uilibs/uploader/h5uploader",flashuploader:"uilibs/uploader/flashuploader",dnd:"uilibs/dnd",preview:"uilibs/preview",util:"jslibs/util",prepare:"jslibs/prepare","$-debug":"jquery/jquery/1.8.0/jquery-debug"},paths:{arale:d.BASE_PATH+"/html/"+g+"/assets/seajs/sea-modules/arale",gallery:d.BASE_PATH+"/html/"+g+"/assets/seajs/sea-modules/gallery",jquery:d.BASE_PATH+"/html/"+g+"/assets/seajs/sea-modules/jquery",assets:d.BASE_PATH+"/html/"+g+"/assets",jslibs:d.BASE_PATH+"/html/"+g+"/assets/js",stylelibs:d.BASE_PATH+"/html/"+g+"/assets/style",uilibs:d.BASE_PATH+"/html/"+g+"/assets/uilibs",tpls:d.BASE_PATH+"/html/"+g+"/tpls",modules:d.BASE_PATH+"/html/"+g+"/modules",fs:d.BASE_PATH+"/html/"+g},vars:{locale:"zh-cn"},map:[[/^(.*\/assets\/.*\.(?:css|js))(?:.*)$/i,"$1?"+b[0]+"-"+b[1]],[/^(.*\/modules\/.*\.(?:css|js))(?:.*)$/i,"$1?"+b[0]+"-"+b[2]],[/^(.*\/tpls\/.*\.(?:css|js))(?:.*)$/i,"$1?"+b[0]+"-"+b[3]],[/^(.*\/.*\.(?:css|js))(?:.*)$/i,"$1?"+b[0]]],preload:[this.JSON?"":"json","prepare"],debug:!1,charset:"utf-8"}),function(){function a(a){var c=seajs.resolve(a.refUri),d=seajs.resolve(a.id),e=a.newId;b.push({refUri:c,id:d,newId:e})}var b=[];seajs.on("resolve",function(a){_.each(b,function(b){b.refUri==a.refUri&&seajs.resolve(a.id,a.refUri)==b.id&&(a.id=b.newId)})}),d.seajsRedirect=a,a({refUri:"confirmbox_core",id:"dialog_core",newId:"dialog"})}(),_.templateSettings=_.extend(_.templateSettings,{evaluate:/##([\s\S]+?)##/g,interpolate:/\{\{(.+?)\}\}/g,escape:/\{\{\{\{-([\s\S]+?)\}\}\}\}/g}),_.extend(d,{tpl:e,setAppStore:function(a,b){return f[a]=b},getAppStore:function(a){return f[a]},UNDEFINED:void 0,EMPTY_FN:function(){}}),a.FS=d}(window);