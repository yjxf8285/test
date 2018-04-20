/**
 * 项目级common设置
 * 定义util工具箱，seajs configs，backbone初始化设置等等
 */

(function (root) {
    //var $=jQuery;
    var fsVersion=(FS_VERSION||"0.0.0.0").split('.');    //FS_VERSION是前端版本号宏定义
    var publishModel=PUBLISH_MODEL||"product";  //发布模式development/product，默认为生产模式
    //项目全局命名空间
    var FS = {},
        tpl = {
            "store": {},
            "list": {},
            "event": null,
            "navRouter": null
        };
    var appStore = {};
    var fsPath=(publishModel=="product"?"fs-dist":"fs");
    //设置全局路径
    //FS.BASE_PATH='http://push.oa.b.qq.com/QQ00000011';
    FS.BASE_PATH = FS_BASEPATH||'';
    _.extend(FS, {
        "TPL_PATH": FS.BASE_PATH + "/html/"+fsPath+"/tpls",  //模板路径
        "MODULE_PATH": FS.BASE_PATH + "/html/"+fsPath+"/modules",  //模块路径
        "FILES_PATH":FS.BASE_PATH + "/temp/files",  //上传附件和图片路径
        "ASSETS_PATH": FS.BASE_PATH + "/html/"+fsPath+"/assets", //静态资源路径
        "API_PATH": FS.BASE_PATH+'/H',   //接口服务路径
        "BLANK_IMG": FS.BASE_PATH + "/html/"+fsPath+"/assets/images/clear.gif",   //1像素透明图片
        "BLANK_PAGE": FS.BASE_PATH + "/html/"+fsPath+"/tpls/blank/blank.html"   //空页面
    });
    //seajs配置
    seajs.config({
        plugins: ['shim', 'text', 'style'],
        // 别名配置
        alias: {
            '$': {
                "src": "jslibs/jquery-1.8.3.min.js",
                "exports": function () {
                    //设置backbone中$的依赖
                    Backbone.$ = jQuery;

                    //开启backbone路由机制
                    Backbone.history.start();
                    //设置前后通讯方式
                    Backbone.emulateHTTP = true;  //采用传统的get/post请求方式
                    Backbone.emulateJSON = true;  //rest信息通过_method参数传递

                    define('$-debug', [], function (require, exports, module) {
                        module.exports = jQuery;
                    });
                    return jQuery;
                }
            },
            'swfobject': {
                "src": "jslibs/swfobject.js",
                "exports": function () {
                    return swfobject;
                }
            },
            'swfupload': {
                "src": "assets/swfupload/swfupload.js",
                "exports": function () {
                    return SWFUpload;
                }
            },
            'spin': {
                "src": "assets/js/spin.min.js",
                "exports": function () {
                    return Spinner;
                }
            },
            'datatable_core': {
                "src": "assets/datatable/js/jquery.dataTables.min.js",
                "exports": function () {
                    return jQuery.fn.dataTable;
                }
            },
            'audioplayer': {
                "src": "assets/audio-player/audio-player-noswfobject.js",
                "exports": function () {
                    AudioPlayer.setup(FS.ASSETS_PATH+"/audio-player/player.swf", {
                        width: 290,
                        initialvolume: 100,
                        transparentpagebg: "yes",
                        left: "000000",
                        lefticon: "FFFFFF"
                    });
                    return AudioPlayer;
                }
            },
            'store': {
                "src": "assets/js/store.js",
                "exports": function () {
                    return store;
                }
            },
            'tinyscrollbar': {
                "src": "assets/js/jquery.tinyscrollbar.js",
                "exports": function () {
                    return $.fn.tinyscrollbar;
                }
            },
            'scrollbar': "assets/uilibs/scrollbar/scrollbar.js",
            'datatable': "assets/datatable/js/datatables.js",
            'json': 'gallery/json/1.0.2/json',
            'detector': 'arale/detector/1.1.0/detector',
            'position_core': 'arale/position/1.0.0/position',
            'position': 'jslibs/position',
            //'store': 'gallery/store/1.3.7/store',
            //'placeholder': 'arale/placeholder/1.0.1/placeholder',
            'placeholder': 'uilibs/placeholder',
            'base': 'arale/base/1.0.1/base',
            'widget': 'arale/widget/1.0.3/widget',
            'validator_core': 'arale/validator/0.9.2/validator',
            'validator': 'uilibs/validator',
            'overlay': 'arale/overlay/1.0.1/overlay',
            //'overlay':'fs/debug/overlay-debug',
            'dialog_core': 'arale/dialog/1.0.1/dialog',
            'dialog': 'uilibs/dialog',
            //'$-debug':'uilibs/$-debug',
            'confirmbox_core': 'arale/dialog/1.0.1/confirmbox',
            'confirmbox': 'uilibs/confirmbox',
            'tabs_core': 'arale/switchable/0.9.12/tabs',
            'tabs': 'uilibs/tabs',
            'filter':'uilibs/filter',   //提取自autocomplete component里
            'autocomplete_core': 'arale/autocomplete/1.2.0/autocomplete',
            'autocomplete': 'uilibs/autocomplete',
            'select_core': 'arale/select/0.9.3/select',
            'select': 'uilibs/select',
            'calendar_core': 'arale/calendar/0.8.5/calendar',
            //'calendar_core':'https://raw.github.com/aralejs/calendar/master/src/calendar.js',
            'calendar': 'uilibs/calendar',
            'innercalendar': 'uilibs/innercalendar',
            'mask': 'arale/overlay/1.0.1/mask',
            'events_core': 'arale/events/1.0.0/events',
            'events': 'jslibs/events',
            //'moment_core':'gallery/moment/1.7.2/moment',
            'moment_core': 'gallery/moment/2.0.0/moment',
            'moment': 'uilibs/moment',
            'fsupload': 'uilibs/fsupload',
            'h5uploader': 'uilibs/uploader/h5uploader', //h5版上传
            'flashuploader': 'uilibs/uploader/flashuploader', //flash版上传
            'dnd': 'uilibs/dnd', //拖拽组件
            'preview': 'uilibs/preview',
            'util': 'jslibs/util',
            'prepare':'jslibs/prepare',
            '$-debug':'jquery/jquery/1.8.0/jquery-debug'
        },
        // 路径配置
        paths: {
            //'arale':'https://a.alipayobjects.com/arale',
            //'gallery': 'https://a.alipayobjects.com/gallery',
            'arale': FS.BASE_PATH + '/html/'+fsPath+'/assets/seajs/sea-modules/arale',
            'gallery': FS.BASE_PATH + '/html/'+fsPath+'/assets/seajs/sea-modules/gallery',
            'jquery': FS.BASE_PATH + '/html/'+fsPath+'/assets/seajs/sea-modules/jquery',
            'assets': FS.BASE_PATH + '/html/'+fsPath+'/assets',
            'jslibs': FS.BASE_PATH + '/html/'+fsPath+'/assets/js',
            'stylelibs': FS.BASE_PATH + '/html/'+fsPath+'/assets/style',
            'uilibs': FS.BASE_PATH + '/html/'+fsPath+'/assets/uilibs',
            //'tpls': FS.BASE_PATH + '/html/fs/tpls/build/dist',     //build地址
            //'modules': FS.BASE_PATH + '/html/fs/modules/build/dist', //build地址
            'tpls': FS.BASE_PATH + '/html/'+fsPath+'/tpls',
            'modules': FS.BASE_PATH + '/html/'+fsPath+'/modules',
            'fs': FS.BASE_PATH + '/html/'+fsPath
        },
        // 变量配置
        vars: {
            'locale': 'zh-cn'
        },
        // 映射配置
        map: [
            [ /^(.*\/assets\/.*\.(?:css|js))(?:.*)$/i, '$1?'+fsVersion[0]+'-'+fsVersion[1] ],
            [ /^(.*\/modules\/.*\.(?:css|js))(?:.*)$/i, '$1?'+fsVersion[0]+'-'+fsVersion[2] ],
            [ /^(.*\/tpls\/.*\.(?:css|js))(?:.*)$/i, '$1?'+fsVersion[0]+'-'+fsVersion[3] ],
            [ /^(.*\/.*\.(?:css|js))(?:.*)$/i, '$1?'+fsVersion[0] ]

            //[ 'widget.js', 'widget-debug.js' ]
            //['http://example.com/js/app/', 'http://localhost/js/app/']
        ],
        // 插件
        //plugins: ['text', 'shim'],
        // 预加载项
        preload: [
            this.JSON ? '' : 'json','prepare'
        ],
        // 调试模式
        debug: false,
        // Sea.js 的基础路径
        //base: '/',
        // 文件编码
        charset: 'utf-8'
    });

    /*seajs.on('fetch', function(data) {
        var ext=data.uri.slice(-5);
        if(ext==".html"){
            data.requestUri = data.uri+'.js';
        }
    });*/
    /**
     * aralejs组件内部通过require方式加载其他组件时，可通过此方式重定向到自定义的组件
     * 多用于对aralejs官方组件的bug修复
     * 子类需要继承修复的组件时可通过此方式拦截，重新绑定父类
     */
    (function(){
        var store=[];
        function seajsRedirect(opts){
            var refUri=seajs.resolve(opts.refUri),
                id=seajs.resolve(opts.id),
                newId=opts.newId;
            store.push({
                "refUri":refUri,
                "id":id,
                "newId":newId
            });
        }
        seajs.on('resolve',function(data) {
            _.each(store,function(item){
                if(item.refUri==data.refUri&&seajs.resolve(data.id,data.refUri)==item.id){
                    data.id=item.newId;
                }
            });
        });
        //提供外部引用
        FS.seajsRedirect=seajsRedirect;

        //默认重绑定confirmbox的父类
        seajsRedirect({
            refUri:'confirmbox_core',
            id:'dialog_core',
            newId:'dialog'
        });
    }());

    //设置underscore.js template分割符为{{ }}
    _.templateSettings = _.extend(_.templateSettings, {
        evaluate: /##([\s\S]+?)##/g,
        interpolate: /\{\{(.+?)\}\}/g,
        escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
    });
    //暴露到root下
    _.extend(FS, {
        "tpl": tpl,
        "setAppStore": function (key, value) {
            return appStore[key] = value;
        },
        "getAppStore": function (key) {
            return appStore[key];
        },
        "UNDEFINED": void(0),
        "EMPTY_FN": function () {
        }
    });
    root.FS = FS;
}(window));
