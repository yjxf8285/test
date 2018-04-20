/**
 * util工具箱
 *
 * 遵循seajs module规范
 */

define(function (require, exports, module) {
    var Overlay = require('overlay'),
        mask = require('mask'),
        Events = require('events'),
        ConfirmBox = require('confirmbox'),
        Widget=require('widget'),
        Dialog=require('dialog'),
        placeholder = require('placeholder'),
        localStore = require('store'),
        helperTpl = require('assets/html/helper.html'),
        json = require('json'),
        moment=require('moment'),
        $ = require('$');
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store;
    var util = {},
        helperEl = $(helperTpl);
    var publishModel=PUBLISH_MODEL||"product";  //发布模式development/product，默认为生产模式
    _.extend(util, {
        "ajax": (function () {
            var globalMask,
                ajaxStore = [];
            return function (opts, cusOpts) {
                var partMask, //局部遮罩索引
                    maskRefEl;  //被遮罩element;
                var xhrDeferred;
                opts = $.extend({
                    "timeout": 180000  //3m超时设置
                }, opts || {});
                cusOpts = $.extend({
                    "mask": false,
                    "maskCls": "",
                    "keepMask":false, //请求完毕后会保持遮罩，会影响全局遮罩和局部遮罩
                    "errorAlertModel":"2",   //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
                    "abortLast":false,   //设置是否需要终止上个ajax请求，默认不终止
                    "authorizedJump":true   //用户未登录会自动跳转到登录页
                }, cusOpts || {});
                //处理是否需要终止上次相同接口的ajax请求
                if(cusOpts.abortLast){
                    _.each(ajaxStore,function(itemConfig){
                        if(itemConfig.requestPath==opts.url){
                            itemConfig.xhr.abort(); //直接终止
                        }
                    });
                }
                if (cusOpts.mask) {
                    if (cusOpts.mask === true) { //全局遮罩
                        if (!globalMask) {
                            globalMask = mask;
                            globalMask.show();
                        } else {
                            globalMask.show();
                        }
                    } else { //局部遮罩
                        maskRefEl = $(cusOpts.mask);
                        partMask = new Overlay({
                            template: '<div class="fs-ajax-part-mask"></div>',
                            width: maskRefEl.outerWidth(),
                            height: maskRefEl.outerHeight(),
                            zIndex: 999,
                            style: 'border:1px solid red;color:green;',
                            align: {
                                selfXY: [0, 0],     // element 的定位点，默认为左上角
                                baseElement: maskRefEl,     // 基准定位元素，默认为当前可视区域
                                baseXY: [0, 0]      // 基准定位元素的定位点，默认为左上角
                            }
                        }).show();
                        if (cusOpts.maskCls) {
                            partMask.element.addClass(cusOpts.maskCls);
                        }
                    }
                    //判断上次请求是否已经结束，如果没有直接返回，什么都不做
                    if(_.some(ajaxStore,function(itemConfig){
                        if(itemConfig.requestPath==opts.url){
                            return true;
                        }
                    })){
                        return;
                    }
                }
                xhrDeferred = $.ajax(opts);
                xhrDeferred.always(function () {
                    var keepMask = false, //是否需要继续保存modal
                        curIndex;
                    _.each(ajaxStore, function (item, i) {
                        if (item.globalMask && item.xhr.state() == "pending") { //当有一个待modal的ajax请求未返回时，将继续保持modal
                            keepMask = true;
                        }
                        if (item.xhr === xhrDeferred) {
                            curIndex = i;
                        }
                    });
                    if(cusOpts.keepMask){ //如果用户已配置保留遮罩则保留
                        keepMask=true;
                    }
                    if (cusOpts.mask === true && !keepMask) {
                        globalMask.hide();
                    }
                    //清除ajaxStore对应项，防止内存泄漏
                    if (typeof(curIndex) == "number") {
                        ajaxStore.splice(curIndex, 1);
                    }
                    //清除局部遮罩
                    if(!cusOpts.keepMask){   //用户设置保留遮罩则局部遮罩会保留，以后通过maskCls找回
                        partMask && partMask.element.remove() && partMask.destroy();
                    }
                    //ajax返回统一处理
                    util.ajaxCallback(xhrDeferred, opts,cusOpts);
                });
                ajaxStore.push({
                    xhr: xhrDeferred,
                    requestPath: opts.url,
                    globalMask: cusOpts.mask === true ? true : false
                });
                return xhrDeferred;
            };
        }()),
        "api": function (opts,cusOpts) {
            /*var responseData = {
             success: false,
             Unauthorized: false,
             isNetworkError: true,
             message: "",
             value: null
             };*/
            var xhrDeferred;
            var apiCb,
                success,
                error,
                complete,
                data;
            var submitEl,
                submitHtmlStr;
            cusOpts = $.extend({
                "submitSelector": false, //提交按钮dom selector
                "autoPrependPath":true  //如果为true自动补全请求地址("/H/"前缀)
            }, cusOpts || {});
            if(cusOpts.submitSelector){
                submitEl=$(cusOpts.submitSelector);
                submitHtmlStr=submitEl.html();
            }
            opts = opts || {};
            if (!opts.url) {
                return false;
            }
            if(cusOpts.autoPrependPath){
                opts.url = FS.API_PATH + opts.url;
            }
            apiCb = opts.apiCb || FS.EMPTY_FN;
            success = opts.success || FS.EMPTY_FN;
            error = opts.error || FS.EMPTY_FN;
            complete=opts.complete||FS.EMPTY_FN;

            opts = _.extend({
                "cache": false,
                "type": 'post',
                "dataType": 'json',
                "contentType": 'application/json; charset=utf-8'
            }, opts,{
                "success": function (responseData,textStatus, jqXHR) {
                    //将value{String}替换成{Object}
                    /*if(responseData.value.length>0){
                        responseData.value=json.parse(responseData.value);
                    }else{
                        responseData.value=null;
                    }*/
                    //responseData.time替换成serviceTime
                    //responseData.serviceTime=responseData.time;
                    return success.apply(this, [responseData,textStatus,jqXHR]);
                },
                "error": function () {
                    return error.apply(this, arguments);
                },
                "complete": function (jqXHR, textStatus) {
                    if(submitEl){
                        submitEl.removeClass('state-requesting').removeAttr('style').html(submitHtmlStr);
                    }
                    return complete.apply(this,arguments);
                }
            });
            data = opts.data;
            if (opts.type == "post"&&data) {
                opts.data = json.stringify(data).replace(/\+/g, "%2B").replace(/\&/g, "%26"); //替换+和&符号
            }
            if(submitEl){
                if(!submitEl.hasClass('state-requesting')){     //防止多次重复提交,将按钮宽度增大35px
                    submitEl.addClass('state-requesting').width(submitEl.width()+35).html('<span class="icon-requesting"><img src="'+FS.BLANK_IMG+'" alt="loading" />&nbsp;&nbsp;</span>'+submitHtmlStr+'中');
                    xhrDeferred = util.ajax(opts,cusOpts);
                }
            }else{
                xhrDeferred = util.ajax(opts,cusOpts);
            }
            return xhrDeferred;
        },
        "getResponseData": function (jqXhr, opts) {
            var responseData;
            if (jqXhr.status == 200) {
                if (opts.dataType == "json") {
                    responseData = json.parse(jqXhr.responseText);
                } else {
                    responseData = {
                        "success": true,
                        "message": "success",
                        "value": jqXhr.responseText
                    };
                }
            } else {        //服务端错误
                responseData = {
                    "success": false,
                    "errorStatus": jqXhr.status,
                    "message": jqXhr.statusText
                };
            }
            return responseData;
        },
        "ajaxCallback": function (jqXhr, opts,cusOpts) {
            var responseData = util.getResponseData(jqXhr, opts);
            //先隐藏全局错误提示
            util.hideGlobalError();
            //对sucess==false的情况进行处理
            if (!responseData.success) {     //处理错误提示
                if (responseData.isAuthorized===false&&cusOpts.authorizedJump) {  //未认证跳到登录页
                    location.href = FS.BASE_PATH+"/login.aspx?auto=1";  //直接跳到登录页 加上auto==1防止登录页和工作管理页票据不一致的问题（登录页认为已经登录了，但是工作管理页认为没登录）
                    //location.reload();  //刷新本页直接跳到登录页
                    return false;
                }
                if(_.isUndefined(responseData.errorStatus)){ //业务逻辑错误
                    if(responseData.statusCode==-1){     //-1表示服务端处理异常
                        util.showGlobalError('服务器连接异常，请确定您的网络连接状况');
                        return;
                    }
                    if(cusOpts.errorAlertModel>1){  //errorAlertModel==2时才会提醒，2为默认提醒方式
                        if(responseData.message&&responseData.message.length>0){
                            util.alert(responseData.message);
                        }
                    }
                }else{    //服务器错误
                    if (responseData.errorStatus != 0) { //abort不提示
                        util.showGlobalError('服务器连接异常，请确定您的网络连接状况');
                    }
                }

            }
        },
        /**
         * 展示页面全局错误提醒
         * @param message
         */
        "showGlobalError":function(message){
            var serviceErrorEl=$('#fs-service-error');
            if(serviceErrorEl.length==0){
                serviceErrorEl=$('<div id="fs-service-error"></div>');
                serviceErrorEl.html('<div class="error-message"></div><span class="close-btn">×</span>');
                serviceErrorEl.appendTo('body');
                serviceErrorEl.on('click','.close-btn',function(){
                    serviceErrorEl.hide();
                });
            }
            $('.error-message',serviceErrorEl).html(message);
            serviceErrorEl.css({
                "margin-left":-(serviceErrorEl.width()/2)+'px'
            }).show();
        },
        /**
         * 隐藏全局错误提示
         */
        "hideGlobalError":function(){
            var serviceErrorEl=$('#fs-service-error');
            serviceErrorEl.hide();
        },
        /**
         * 模板数据getter
         * @param tplName
         * @param key
         * @returns {*}
         */
        "getTplStore": function (tplName, key) {
            return store[tplName] ? store[tplName][key] : FS.UNDEFINED;
        },
        /**
         * 模板数据setter
         * @param tplName
         * @param data
         * @returns {*}
         */
        "setTplStore": function (tplName, data) {
            store[tplName] = store[tplName] || {};
            return _.extend(store[tplName], data);
        },
        /**
         * 模板数据清理
         * @param tplName
         * @param key
         */
        "clearTplStore":function(tplName,key){
            var tplStore=store[tplName]||{};
            if(key){
                tplStore[key]=null;
                store[tplName]=tplStore;
            }else{
                store[tplName]=null;
            }
        },
        "tplRouterReg": (function () {
            var xhr,
                list = tpl.list;
            var NavRouter = Backbone.Router.extend({
                routes: {
                    '': 'blank'
                },
                blank: function () {
                    //空路由重定向到空白页
                    navTo('blank/blank.html', 'blank');
                }
            });
            var navRouter = new NavRouter();
            tpl.navRouter = navRouter;  //设置tpl nav路由
            //设置tpl事件
            tpl.event = new Events();   //设置tpl事件对象
            /**
             * 新模板预处理
             * @param tplEl
             * @param tplName
             */
            var tplPreproccess = function (tplEl, tplName) {
                placeholder($('input,textarea', tplEl));
            };
            //未缓存模板替换前的清理工作
            var tplClear = function (tplName) {
                //TODO:
                //清理router(router可直接覆盖不需要清理)
                //清理tpl event(在页面逻辑中用one注册事件，执行完毕后自动清除)
                //清理tpl store，remove all data store
                util.clearTplStore(tplName);
            };
            /**
             * 激活tpl
             * @param tplSelector
             * @param tplName
             */
            var activeTpl=function(tplName,tplSelector){
                var tplEl=$(tplSelector);
                var tplTitle=tplEl.attr('tpltitle')||'纷享科技'; //tpl title
                tpl.event.trigger('switch', tplName, tplEl);
                tplEl.addClass('fs-tpl-active').show();
                //设置document title
                document.title=tplTitle;

                //页面切换行为会隐藏所有的弹框和弹框遮罩
                Dialog.hideAll();
                $(root).resize();   //每次切换到当前tpl以后触发window的resize事件,处理类似日历组件定位的问题
                tpl.event.trigger('switched', tplName, tplEl);
            };
            //导航handler
            var navTo = function (tplPath, navName) {
                var subTplEl = $('#sub-tpl'),
                    subTplMaskEl=$('.sub-tpl-switch-mask',subTplEl);   //模板切换遮罩
                var tplEvent = tpl.event;
                //abort其他导航加载
                xhr && xhr.abort();
                //beforeswitch拦截事件，返回false阻断执行
                if(!tplEvent.trigger('beforeswitch', navName)){
                    return false;
                }
                //模板遮罩初始化
                if(subTplMaskEl.length==0){
                    subTplMaskEl=$('<div class="sub-tpl-switch-mask"></div>');
                    subTplMaskEl.css({
                        "position":"absolute",
                        "top":0,
                        "left":0,
                        "width":"100%",
                        "height":"100%",
                        "z-index":20
                    }).hide().appendTo(subTplEl);
                }
                //清理未设置缓存的tpl，隐藏缓存的tpl
                _.each(list, function (item, tplName2) {
                    var elEl=item.el,
                        isCached=item.isCached;
                    //移除未设置缓存的tpl
                    if(!isCached){  //remove拦截
                        if(tplEvent.trigger('beforeremove', tplName2, elEl)){
                            elEl&&elEl.off()&&elEl.removeData()&&elEl.remove();  //移除element上的事件代理，移除element本身
                            tplClear(tplName2);  //一些公共清理
                            item.el=null;   //释放内存
                            //触发remove事件，用于各页面逻辑的清理工作
                            tplEvent.trigger('afterremove', tplName2, elEl);  //移除之后触发
                        }else{
                            return; //直接返回不提示，期待页面逻辑的手动删除
                        }
                    }else{  //隐藏被设置成缓存的tpl
                        elEl.removeClass('fs-tpl-active').hide();
                    }
                });
                //先打开模板切换遮罩
                subTplMaskEl.show();

                if (list[navName] && list[navName].isCached) {
                    activeTpl(navName,list[navName].el);
                    //关闭模板切换遮罩
                    subTplMaskEl.hide();
                    return;
                } else {
                    xhr = util.ajax({
                        "url": FS.TPL_PATH + '/' + tplPath,
                        "type": "get",
                        "dataType": "html",
                        "success": function (result) {
                            var tplEl = $(result);
                            var tplName = tplEl.attr('tplname'),
                                tplPartPaths,   //定位模板路径
                                js = tplEl.attr('js'),
                                css = tplEl.attr('css'),
                                isCached = tplEl.attr('iscached');
                            var el = list[tplName] ? list[tplName].el : null,
                                deps = [];

                            //先隐藏现有的tpl element，防止页面颤抖
                            _.each(list, function (item) {
                                item.el&&item.el.removeClass('fs-tpl-active').hide();
                            });
                            //加入新tpl
                            list[tplName] = {
                                "el": tplEl,
                                "isCached": false
                            };
                            //可缓存
                            if (isCached === "true") {
                                list[tplName].isCached = true;
                            }
                            tplEl.appendTo(subTplEl);
                            //模板预处理
                            tplPreproccess(tplEl, tplName);
                            //路径预处理
                            tplPartPaths = tplName.split('-');

                            if (_.isUndefined(js) || js === "true") {
                                js = 'tpls/' + tplPartPaths.join('/') + '/' + tplPartPaths[tplPartPaths.length - 1] + '.js';
                            }
                            if (_.isUndefined(css) || css === "true") {
                                css = 'tpls/' + tplPartPaths.join('/') + '/' + tplPartPaths[tplPartPaths.length - 1] + '.css';
                            }
                            if (css !== "false") {
                                deps.push(css);
                            }
                            if (js !== "false") {
                                deps.push(js);
                            }
                            if (deps.length > 0) {
                                require.async(deps, function (css, js) {
                                    if (_.isUndefined(js)) {
                                        js = css;
                                    }
                                    //设置tplName和tplEl供init内部使用，用于定位对应的html模板
                                    js.tplName = tplName;
                                    js.tplEl = tplEl;
                                    if(publishModel=="development"){
                                        js.init();
                                    }else{
                                        try{ //生成环境执行报错被忽略，开发环境下需开启
                                            js.init();
                                        }catch(e){}
                                    }
                                    activeTpl(tplName,tplEl);
                                    //关闭模板切换遮罩
                                    subTplMaskEl.hide();
                                });
                            } else {
                                activeTpl(tplName,tplEl);
                                //关闭模板切换遮罩
                                subTplMaskEl.hide();
                            }
                        }
                    });
                }
            };
            /**
             * 注册模板路由入口
             * @param tplNavSelector 可以是jq selector也可以是router path
             *                       如果tplNavSelector不能被辨识为页面已有的dom则被当成router path处理
             */
            return function (tplNavSelector) {
                var tplNavEl;
                //判定tplNavSelector
                if (tplNavSelector.slice(0, 1) == '#') {
                    tplNavEl = $('<a href="' + tplNavSelector + '"></a>');
                } else {
                    tplNavEl = $(tplNavSelector);
                }
                //注册路由
                tplNavEl.each(function () {
                    var meEl = $(this),
                        href = meEl.attr('href'),
                        tempHref,
                        tplPath = "#",
                        routerPath,
                        routerAttr,
                        navName = meEl.attr('navname');
                    //保证链接地址全部小写
                    href = href.toLowerCase();
                    meEl.attr('href', href);

                    //获得hash，注意ie6/7对于动态创建的a标签会自动加上http://
                    //所以需要手动截出hash部分
                    href = href.slice(href.indexOf('#') + 1);
                    //设置路由
                    routerAttr=meEl.attr('router');
                    routerPath = (routerAttr?routerAttr.slice(1):"")||href; //首选router自定义属性作为路由

                    if (href.indexOf('/=/') !== -1) {
                        //获取模板地址
                        href = href.slice(0, href.indexOf('/=/'));
                    }
                    //切分href
                    tempHref = href.split('/');
                    //首先从自定义的navname获取模板名
                    if (!_.isUndefined(navName)) {
                        //保证模板名全部小写
                        navName = navName.toLowerCase();
                        meEl.attr('navname', navName);
                    } else {  //未设置navname则从链接地址分析得出
                        navName = tempHref.join('-');
                    }

                    tempHref[tempHref.length] = tempHref[tempHref.length - 1] + '.html';
                    tplPath = tempHref.join('/');

                    navRouter.route(routerPath, navName, function () {
                        navTo(tplPath, navName);
                    });
                });
            };
        }()),
        /**
         * js文件线性加载
         * @param  {[type]}   paths    [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        "asyncOrder": function (paths, callback) {
            var i = 0, rvs = [];
            paths = [].concat(paths);
            var circleFn = function () {
                require.async(paths[i], function (rv) {
                    if (i == (paths.length - 1)) {
                        callback(rvs);
                    } else {
                        i++;
                        circleFn();
                    }
                    rvs.push(rv);

                });
            };
            circleFn();
        },
        "alert": function (message, callback, opts) {
            var iconHtml,
                messageWCls;
            opts = _.extend({
                "className":"fs-alert",
                "title":" ",  //显示标题栏
                "closeTpl": "×",
                "content": helperEl.filter('.fs-show').html(),
                "zIndex": 2000,
                "hasMask": true,
                "width":380,
                "messageType":""    //success/failed/info,默认为空
            }, opts || {});
            switch(opts.messageType){
                case "info":
                    iconHtml='<img class="icon-info icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-alert-info-wrapper';
                    break;
                case "success":
                    iconHtml='<img class="icon-success icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-alert-success-wrapper';
                    break;
                case "failed":
                    iconHtml='<img class="icon-failed icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-alert-success-wrapper';
                    break;
                default:
                    iconHtml='';
                    break;
            }
            ConfirmBox.alert('<div class="'+messageWCls+' fn-clear">'+iconHtml+'<span class="message-content">'+message+'</span></div>', callback, opts);
        },
        "confirm": function (message, title, callback, opts) {
            var iconHtml,
                messageWCls;
            opts = _.extend({
                "className":"fs-confirm",
                "closeTpl": "×",
                "content": helperEl.filter('.fs-show').html(),
                "zIndex": 2000,
                "hasMask": true,
                "messageType":"info"    //success/failed/info
            }, opts || {});

            switch(opts.messageType){
                case "info":
                    iconHtml='<img class="icon-info icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-confirm-info-wrapper';
                    break;
                case "success":
                    iconHtml='<img class="icon-success icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-confirm-success-wrapper';
                    break;
                case "failed":
                    iconHtml='<img class="icon-failed icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-confirm-failed-wrapper';
                    break;
                case "question":
                    iconHtml='<img class="icon-question icon-flag" src="'+FS.BLANK_IMG+'" />';
                    messageWCls='fs-confirm-question-wrapper';
                    break;
                default:
                    iconHtml='';
                    break;
            }
            ConfirmBox.confirm('<div class="'+messageWCls+' fn-clear">'+iconHtml+'<span class="message-content">'+message+'</span></div>', title, callback, opts);
        },
        /**
         * 金额大写转换
         * From http://blog.csdn.net/redraiment/article/details/6548199
         * @param  {[type]} n [description]
         * @return {String}   [description]
         */
        "digitUppercase": function (n) {
            var fraction = ['角', '分'];
            var digit = [
                '零', '壹', '贰', '叁', '肆',
                '伍', '陆', '柒', '捌', '玖'
            ];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '')
                    .replace(/^$/, '零')
                    + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
        },
        "getFileType": function (file) {
            var fileType = "common",
                fileName=file.name.toLowerCase();
            if (/\.(?:jpg|jpeg|png|gif|bmp)$/.test(fileName)) {
                fileType = "jpg";
            } else if (/\.(?:doc|docx)$/.test(fileName)) {
                fileType = "doc";
            } else if (/\.(?:pdf)$/.test(fileName)) {
                fileType = "pdf";
            } else if (/\.(?:rar)$/.test(fileName)) {
                fileType = "rar";
            } else if (/\.(?:xls|xlsx)$/.test(fileName)) {
                fileType = "xls";
            } else if (/\.(?:zip)$/.test(fileName)) {
                fileType = "zip";
            } else if (/\.(?:ppt|pptx)$/.test(fileName)) {
                fileType = "ppt";
            } else if (/\.(?:txt)$/.test(fileName)) {
                fileType = "txt";
            }
            return fileType;

        },
        /**
         * 文件大小格式化
         * @param  {[type]} byteSize [description]
         * @return {[type]}          [description]
         */
        "getFileSize": function (byteSize) {
            var v = 0, unit = "BYTE";
            if (byteSize > 1073741824) {   //1G=1073741824 BYTE
                v = (byteSize / 1073741824).toFixed(0);
                unit = "GB";
            }else if (byteSize > 1048576) {   //1M=1048576 BYTE
                v = (byteSize / 1048576).toFixed(0);
                unit = "MB";
            } else if (byteSize > 1024) {
                v = (byteSize / 1024).toFixed(0);
                unit = "KB";
            } else {
                v = byteSize;
                unit = "B";
            }
            return v + unit;
        },
        "placeholder": function (elSelector) {
            placeholder(elSelector);
        },
        /**
         * 本地存储
         * @param  {[type]} type  tpl/module
         * @param  {[type]} key   [description]
         * @param  {[type]} value
         * @return {[type]}       [description]
         */
        "localStore": function (type, key, value) {
            var container;
            if (_.isUndefined(type) || _.isUndefined(key)) {
                return false;
            }
            container = localStore.get(type) || {};
            if (_.isUndefined(value)) {   //get取方式
                return container[key];
            } else {
                container[key] = value;
                localStore.set(type, container);
                return value;
            }
        },
        /**
         * 分类格式化联系人和部门信息
         * @param  {[type]} type        [description]
         * @param  {[type]} contactData [description]
         * @return {[type]}             [description]
         */
        "getContactDataByType": function (type, contactData) {
            var rows = [];
            var setContactDataGf = function (node) {
                if (node.isGroup) {
                    if (node.children && node.children.length > 0) {
                        _.each(node.children, function (child) {
                            child.groupName = node.name;
                            child.groupId = node.id;
                            if (child.isGroup && child.children && child.children.length > 0) {
                                setContactDataGf(child);
                            }
                        });
                    }
                }
                return node;
            };
            var circleFn = function (row) {
                if (type == "person" && !row.isGroup) {
                    rows.push({
                        "id": row.id,
                        "name": row.name,
                        "spell": row.spell,
                        "groupName": row.groupName,
                        "groupId": row.groupId
                    });
                } else if (type == "group" && row.isGroup) {
                    rows.push({
                        "id": row.id,
                        "name": row.name,
                        "spell": row.spell,
                        "groupName": row.groupName,
                        "groupId": row.groupId
                    });
                }
                if (row.children && row.children.length > 0) {
                    _.each(row.children, function (row) {
                        circleFn(row);
                    });
                }
            };
            type = type || "person";
            contactData = setContactDataGf(contactData);
            circleFn(contactData);
            return rows;
        },
        /**
         * 将handler注册到document上
         * @param  {[type]} handler [description]
         * @return {[type]}         [description]
         */
        "regDocEvent": function (eventType, handler) {
            var fn = function (evt) {
                handler.apply(this, arguments);
                evt.stopPropagation();
            };
            $('body').on(eventType, fn);
            return fn;
        },
        /**
         * 取消对document的handler绑定
         * @return {[type]} [description]
         */
        "unRegDocEvent": function (eventType, handler) {
            $('body').off(eventType, handler);
            //return handler;
        },
        /**
         * 全局点击动作，通过监听冒泡到document的click事件来执行
         */
        "regGlobalClick":(function(){
            var store=[];
            $('body').on('click',function(evt){
                store=_.filter(store,function(config){
                    var elEl=config.element,
                        handler=config.handler;
                    if($.contains(document.body,elEl.get(0))){
                        //如果存在用户自定义动作handler，执行
                        if(handler){
                            handler(evt);
                        }else{  //否则默认行为是掩藏element
                            elEl.hide();
                        }
                        return true;
                    }else{
                        //filter掉不存在的dom
                        return false;
                    }
                });
            });
            return function(elSelector,handler){
                store.push({
                    "element":$(elSelector),
                    "handler":handler
                });
            };
        }()),
        /**
         * 对js对象的深度拷贝
         * @param obj
         * @returns {*}
         */
        "deepClone": function (obj) {
            return json.parse(json.stringify(obj));
        },
        /**
         * 判断inputSelector是否focus，通过fs-input-focus className,如果已focus不操作，如果没有
         * 设置focus
         * @param inputSelector
         */
        "setInputFocusOne":function(inputSelector){
            var inputEl=$(inputSelector);
            if(!inputEl.hasClass('fs-input-focus')){
                inputEl.get(0).focus();
            }
        },
        /**
         * 获得textarea光标位置
         * @param textarea
         * @returns {{text: string, start: number, end: number}}
         */
        "getCursorPosition": function (textarea) {
            var rangeData = {text: "", start: 0, end: 0 };
            //textarea.focus();
            util.setInputFocusOne(textarea);    //重复设置textarea focus在ie下会导致window.scroll定位错乱，所有保证最多设置一次
            if (textarea.setSelectionRange) { // W3C
                rangeData.start = textarea.selectionStart;
                rangeData.end = textarea.selectionEnd;
                rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
            } else if (document.selection) { // IE
                var i,
                    oS = document.selection.createRange(),
                // Don't: oR = textarea.createTextRange()
                    oR = document.body.createTextRange();
                oR.moveToElementText(textarea);
                rangeData.text = oS.text;
                rangeData.bookmark = oS.getBookmark();
                // object.moveStart(sUnit [, iCount])
                // Return Value: Integer that returns the number of units moved.
                for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                    // Why? You can alert(textarea.value.length)
                    if (textarea.value.charAt(i) == '\n') {
                        i++;
                    }
                }
                rangeData.start = i;
                rangeData.end = rangeData.text.length + rangeData.start;
            }
            return rangeData;
        },
        /**
         * 设置textarea光标位置
         * @param textarea
         * @param rangeData
         */
        "setCursorPosition": function (textarea, rangeData) {
            var start,
                end;
            if (!rangeData) {
                alert("You must get cursor position first.");
                return false;
            }
            start=rangeData.start;
            end=rangeData.end;

            if (textarea.setSelectionRange) { // W3C
                util.setInputFocusOne(textarea);    //重复设置textarea focus在ie下会导致window.scroll定位错乱，所有保证最多设置一次
                textarea.setSelectionRange(start, end);
            } else if (textarea.createTextRange) { // IE
                var oR = textarea.createTextRange();

                //Fix IE from counting the newline characters as two seperate characters
                var breakPos,
                    i;
                //设置断点位置
                breakPos=start;
                for (i=0; i < breakPos; i++){
                    if( textarea.value.charAt(i).search(/[\r\n]/) != -1 ) {
                        start = start - .5;
                    }
                }
                //设置断点位置
                breakPos=end;
                for (i=0; i < breakPos; i++) {
                    if( textarea.value.charAt(i).search(/[\r\n]/) != -1 ) {
                        end = end- .5;
                    }
                }

                oR.moveEnd('textedit',-1);
                oR.moveStart('character',start);
                oR.moveEnd('character',end - start);
                oR.select();
            }
        },
        /**
         * 将内容追加到光标的位置，并保持光标位置不动
         * @param textarea
         * @param text
         */
        "appendInput": function (inputSelector, text) {
            var inputEl=$(inputSelector),
                inputDom=inputEl.get(0),
                val = inputEl.val();
            var rangeData = util.getCursorPosition(inputDom);
            inputEl.val(val.slice(0, rangeData.start) + text + val.slice(rangeData.end));
            //重设光标位置
            util.setCursorPosition(inputDom, _.extend(rangeData,{
                "start": rangeData.start + text.length,
                "end": rangeData.start + text.length
            }));
        },
        "setCursorPositionEnd":function(inputSelector){
            var inputEl=$(inputSelector),
                val=inputEl.val();
            var rangeData = util.getCursorPosition(inputEl.get(0));
            inputEl.get(0).focus();
            //设置光标位置到末尾
            util.setCursorPosition(inputEl.get(0), _.extend(rangeData,{
                "start": val.length,
                "end": val.length
            }));
        },
        /**
         * 获得当前模板地址栏传递参数
         * @returns {null}
         */
        "getTplQueryParams": function (href) {
            href = href||location.href;
            var params = null,
                query;
            if (href.indexOf('/=/') !== -1) {
                query = href.slice(href.indexOf('/=/') + 3);
                if(query.length>0){
                    params={};
                    query = query.split('/');
                    _.each(query, function (param) {
                        var tempParam = param.split('-');
                        params[tempParam[0]] = decodeURI(tempParam[1]);
                    });
                }
            }
            return params;
        },
        /**
         * 获取当前页面地址对应的模板名
         */
        "getCurrentTplName":function(){
            var href = location.href,
                tplName = "";
            //先把query params截掉
            if (href.indexOf('/=/') !== -1) {
                href = href.slice(0,href.indexOf('/=/'));
            }
            //只保留hash部分
            if(href.indexOf('#') !== -1){
                href = href.slice(href.indexOf('#')+1);
            }
            if(href.length>0){
                tplName=href.split('/');
                tplName=tplName.join('-');
            }
            return tplName;
        },
        /**
         * 注册链接为强制刷新链接，即时在本页面内也可以刷新
         * @param linkSelector
         */
        regRefreshLink:function(linkSelector){
            var linkEl=$(linkSelector);
            linkEl.click(function(){
                var currentHref=location.href,
                    linkHref=$(this).attr('href');
                currentHref=currentHref.slice(currentHref.indexOf('#')+1);
                linkHref=linkHref.slice(linkHref.indexOf('#')+1);
                if(currentHref==linkHref){
                    tpl.navRouter.navigate('', {
                        trigger: false  //静默方式
                    });
                }
            });

        },
        /**
         * 以count次数循环变换startProperty和endProperty
         * @param opts element:作用dom节点；startProperty:开始属性；endProperty:结束属性；count:变化次数
         */
        toggleAnimate: function (opts) {
            var elEl = $(opts.element),
                startProperty = opts.startProperty,
                endProperty = opts.endProperty,
                animateOpts = opts.animateOpts || {
                    "easing": "swing",
                    "duration": 400
                },
                count = opts.count;
            var complete = animateOpts.complete || FS.EMPTY_FN,
                i = 0;
            //加载颜色plugin，From https://github.com/jquery/jquery-color
            util.asyncOrder(['jslibs/jquery.color-2.1.2.min'], function () {
                (function () {
                    var handler = arguments.callee;
                    elEl.animate(startProperty, _.extend(animateOpts, {
                        "complete": function () {
                            elEl.animate(endProperty, _.extend(animateOpts, {
                                "complete": function () {
                                    i++;
                                    if (i < count) {
                                        handler();
                                    }
                                    return complete.apply(this, arguments);
                                }
                            }));
                            return complete.apply(this, arguments);
                        }
                    }));
                }());
            });
        },
        /**
         * 显示输入框红色错误提示
         * @param elSelector
         */
        showInputError:function(elSelector){
            util.toggleAnimate({
                "element": $(elSelector),
                "startProperty": {
                    "backgroundColor": "#ff0000",
                    "opacity":0.33
                },
                "endProperty": {
                    "backgroundColor": "white",
                    "opacity":1
                },
                "animateOpts": {
                    "easing": "swing",
                    "duration": 130
                },
                "count": 2   //循环2次
            });
        },
        /**
         * 绝对定位式隐藏与显示
         * @param elSelector
         */
        hideWithAbs:function(elSelector,hidden){
            hidden=!!hidden;
            var elEl=$(elSelector);
            if(hidden){
                elEl.addClass('fn-hide-abs');
            }else{
                elEl.removeClass('fn-hide-abs');
            }
        },
        /**
         * 获取格式化后的联系人和部门数据，返回从原始数据的深度拷贝
         */
        getContactData:(function(){
            var store; //存储格式化完毕的数据
            var formatContactData=function (contactData, type) {
                var formatData = [];
                _.each(contactData, function (itemData) {
                    var newData={
                        "name": itemData.name,
                        "nickName":itemData.nickName||itemData.name,    //昵称默认是name值
                        //"id": itemData.empID,
                        "spell": itemData.spell.toLowerCase(),
                        "type": type
                    };
                    if(type=="p"){
                        newData.id= itemData.employeeID;
                        newData.gender=itemData.gender;
                        newData.groupIDs=itemData.groupIDs||[];
                        newData.workingState=itemData.workingState||''; //工作状态
                        /*if(itemData.profileImage){
                            newData.profileImagePath=itemData.profileImage;
                            //newData.originProfileImage=util.getDfLink(itemData.profileImage+'1',itemData.name,false,'jpg');
                            newData.profileImage=util.getDfLink(itemData.profileImage+'2',itemData.name,false,'jpg');
                        }else{
                            newData.profileImagePath='';
                            //newData.originProfileImage=newData.profileImage=FS.ASSETS_PATH+'/images/employee_default_120_120.png';
                        }*/
                        newData.profileImagePath=itemData.profileImage||"";
                        newData.profileImage=util.getAvatarLink(newData.profileImagePath,2);
                    }else{
                        if(!isNaN(itemData.memberCount)){
                            newData.memberCount=itemData.memberCount;   //包含员工数
                        }
                        newData.id= itemData.id;
                    }
                    formatData.push(newData);
                });
                return formatData;
            };
            return function(isCopy){  //isCopy==true表示获取一份新的数据拷贝，否则返回数据单体存储
                var contactData,
                    currentMember;
                var contactPersonData,
                    contactGroupData,
                    tempStore;
                if(!isCopy&&store){ //如果数据已经存在，直接返回，单例模式，减少内存空间使用
                    return store;
                }
                contactData = util.deepClone(FS.getAppStore('contactData'));
                //判断是否是邀请人初始数据
                if(!_.isUndefined(contactData.inviteEmployeeID)){
                    return {
                        "u":{
                            "id":contactData.inviteEmployeeID
                        }
                    };
                }
                currentMember=contactData.currentMember;
                contactPersonData = contactData.members||[];
                contactGroupData = contactData.groups||[];

                //当前用户格式化
                currentMember.spell=currentMember.spell.toLowerCase();
                currentMember.type="p";
                currentMember.id=currentMember.employeeID;
                currentMember.groupIDs=currentMember.groupIDs||[];  //所属部门可能为空
                currentMember.functionPermissions=contactData.functionPermissions;  //登录用户权限
                currentMember.isAdmin=contactData.isAdmin;  //是否是管理员
                currentMember.enterpriseAccount=contactData.enterpriseAccount;  //企业账号
                currentMember.account=contactData.account;  //个人账号
                currentMember.workingState=currentMember.workingState||'';  //当前用户工作状态
                currentMember.mobile=contactData.mobile;    //用户手机号
                currentMember.isPhoneBound=contactData.isPhoneBound; //是否绑定了手机
                currentMember.boundEmployeeExmail=contactData.boundEmployeeExmail; //是否绑定了邮箱
                currentMember.allCompanyDefaultString=contactData.allCompanyDefaultString||"全公司"; //所属“全公司”显示名称
                currentMember.isDemoAccount=contactData.isDemoAccount;  //是否是演示帐号
                currentMember.exmailDomain=contactData.exmailDomain;   //是否显示邮件
                currentMember.modules=contactData.modules;  //表明企业具有的模块权限
                currentMember.uploadFileSizeLimit=contactData.uploadFileSizeLimit;  //支持的最大上传文件大小
                currentMember.inVipService=contactData.inVipService;   //是否是收费用户

                //把当前用户放入members中(member中已经包含了当前登录用户)
                /*contactPersonData.push({
                    "name": currentMember.name,
                    "nickName":"我",
                    "id": currentMember.empID,
                    "spell": currentMember.spell,
                    "profileImage": currentMember.profileImage,
                    "originProfileImage":currentMember.originProfileImage,
                    "groupIDs":currentMember.groupIDs
                });*/
                //把全公司放到groups中（貌似去掉比较合适?）
                contactGroupData.push({
                    "name":contactData.allCompanyDefaultString||"全公司",
                    "nickName":contactData.allCompanyDefaultString||"全公司",
                    "memberCount":contactPersonData.length,
                    "id":"999999",  //硬编码成999999
                    "spell":"quangongsi"
                });
                //处理u的profileImage
                //currentMember.profileImage=util.getDfLink(currentMember.profileImage+'3',currentMember.name,false,'jpg');
                /*if(currentMember.profileImage){
                    currentMember.profileImagePath=currentMember.profileImage;  //原头像路径
                    //currentMember.originProfileImage=util.getDfLink(currentMember.profileImage+'1',currentMember.name,false,'jpg');
                    currentMember.profileImage=util.getDfLink(currentMember.profileImage+'2',currentMember.name,false,'jpg');
                }else{
                    currentMember.profileImagePath='';
                    //currentMember.originProfileImage=currentMember.profileImage=FS.ASSETS_PATH+'/images/employee_default_120_120.png';   //默认头像
                }*/
                currentMember.profileImagePath=currentMember.profileImage||"";
                currentMember.profileImage=util.getAvatarLink(currentMember.profileImagePath,2);
                tempStore={
                    "p":formatContactData(contactPersonData, 'p'),  //members
                    "g":formatContactData(contactGroupData, 'g'),   //groups
                    "u":currentMember,
                    "v":contactData.version //服务端版本号
                };
                if(!store){
                    store=tempStore;
                }
                return tempStore;
            };
        }()),
        /**
         * 根据id和type获取对应的联系人或部门信息
         * @param id
         * @param type
         */
        getContactDataById:function(id,type){
            var contactData=util.getContactData(),
                typeData=contactData[type];
            return _.find(typeData,function(itemData){
                return itemData.id==id;
            });
        },
        /**
         * 根据name和type获取对应的contact信息
         * @param name
         * @param type
         * @returns {*}
         */
        getContactDataByName: function (name, type) {
            var contactData=util.getContactData(),
                typeData=contactData[type];
            return _.find(typeData, function (tempData) {
                return tempData.name == name;
            });
        },
        /**
         * 根据部门id获取所在部门下的所有员工信息
         * 性能低下
         * @param circleId
         * @returns {Array}
         */
        /*getEmployeeListByCircleId:function(circleId){
            var contactData=util.getContactData(),
                allEmployee=contactData["p"];
            var listData=[];
            _.each(allEmployee,function(employeeData){
                if(_.some(employeeData.groupIDs,function(groupId){
                    return groupId==circleId;
                })){
                    listData.push(employeeData);
                }
            });
            return listData;
        },*/
        getEmployeeListByCircleId:function(circleId){
            var originContactData=FS.getAppStore('contactData'),
                allMembers=originContactData["allMembers"];
            return allMembers[parseInt(circleId)]||null;
        },
        /**
         * 保存personalConfig到本地
         */
        /*fetchPersonalConfig:function(){
            var contactData = FS.getAppStore('contactData'),
                personalConfig;
            if(contactData){
                personalConfig=contactData.personalConfig;
                if(_.isString(personalConfig)&&personalConfig.length>0){
                    //保存到FS命名空间下
                    FS.personalConfig=json.parse(decodeURI(personalConfig));
                }else{
                    FS.personalConfig=null;
                }
            }else{
                FS.personalConfig=null;
            }
        },*/
        /**
         * 企业配置包含个人配置，获取企业配置的同时就获得了个人配置
         */
        fetchPersonalConfig:function(){
            util.fetchEnterpriseConfig();
        },
        /**
         * 根据cateKey获取对应的value
         * @param cateKey
         * @returns {*}
         */
        getPersonalConfig:function(cateKey){
            var enterpriseConfig=FS.enterpriseConfig||{},
                personalConfig=enterpriseConfig[151]||"";
            if(personalConfig.length>0){
                personalConfig=json.parse(personalConfig);
                return personalConfig[cateKey];
            }else{
                return;
            }
        },
        /**
         * 设置catekey的值
         * @param cateKey
         * @param val
         */
        setPersonalConfig:function(cateKey,val){
            var personalConfig=FS.enterpriseConfig[151]||"";
            if(personalConfig.length>0){
                personalConfig=json.parse(personalConfig);
            }else{
                personalConfig={};
            }
            personalConfig[cateKey]=val;
            FS.enterpriseConfig[151]=json.stringify(personalConfig);
        },
        /**
         * 同步到远程保存，静默方式上传
         */
        updatePersonalConfig:function(){
            var personalConfig=FS.enterpriseConfig[151];
            util.api({
                "type":"post",
                "dataType":"json",
                "url":"/GlobalInfo/SetEnterpriseConfig",
                "data":{
                    "value":personalConfig,
                    "key":"151"
                }
            });
        },
        /**
         * 获取企业配置信息
         */
        fetchEnterpriseConfig:function(){
            var contactData = FS.getAppStore('contactData'),
                profiles,
                enterpriseConfig;
            if(contactData){
                profiles=contactData.profiles;
                enterpriseConfig={};
                if(profiles.length>0){
                    _.each(profiles,function(profile){
                        enterpriseConfig[profile.value]=profile.value1;
                    });
                    //保存到FS命名空间下
                    FS.enterpriseConfig=enterpriseConfig;
                }else{
                    FS.enterpriseConfig={};
                }
            }else{
                FS.enterpriseConfig={};
            }

        },
        /**
         * 根据typeKey获取对应的value
         * @param typeKey
         * @param needParse 是否需要json.parse,默认为false不需要
         * @returns {*}
         */
        getEnterpriseConfig:function(typeKey,needParse){
            var enterpriseConfig=FS.enterpriseConfig||{};
            var setting=enterpriseConfig[typeKey]||"";
            if(needParse){
                if(setting.length==0){
                    setting=null;
                }else{
                    setting=json.parse(setting);
                }
            }
            return setting;
        },
        /**
         * 设置typeKey的值
         * @param typeKey
         * @param needStringify 是否需要json.stringify,默认为false不需要
         * @param val
         */
        setEnterpriseConfig:function(typeKey,val,needStringify){
            var enterpriseConfig=FS.enterpriseConfig||{};
            if(needStringify){
                val=json.stringify(val);
            }
            enterpriseConfig[typeKey]=val;
            FS.enterpriseConfig=enterpriseConfig;
        },
        /**
         * 同步到远程保存，静默方式上传
         */
        updateEnterpriseConfig:function(typeKey,callback){
            var enterpriseConfig=FS.enterpriseConfig;
            util.api({
                "type":"post",
                "dataType":"json",
                "url":"/GlobalInfo/SetEnterpriseConfig",
                "data":{
                    "value":enterpriseConfig[typeKey],
                    "key":typeKey
                },
                "success":function(responseData){
                    callback&&callback.call(this,responseData);
                }
            });
        },
        /**
         * 注册模板导航按钮，用于模板切换时高亮导航
         * 第二个参数是高亮导航对应的className，默认是depw-menu-aon
         */
        regTplNav:(function(){
            //var host=location.host;
            var store=[];
            tpl.event.on('switched', function (tplName, tplSelector) {
                var locationHref=location.href;
                if(locationHref.indexOf('#')!=-1){
                    locationHref=encodeURI(locationHref.toLowerCase().slice(locationHref.indexOf('#')));
                }else{
                    locationHref="#";
                }
                //locationHref=encodeURIComponent(locationHref);
                //清除掉已不在dom流中element
                store= _.filter(store,function(config){
                    if($.contains(document.body,config.element.get(0))){
                        return true;
                    }else{
                        return false;
                    }
                });
                //挨个遍历高亮导航
                _.each(store,function(config){
                    var elEl=config.element,
                        hlCls=config.hlCls,
                        href=config.href,
                        lightModel=config.lightModel;
                    var originLocationHref=locationHref;
                    if(lightModel=="ignore"){
                        if(originLocationHref.indexOf('/=/')!=-1){
                            originLocationHref=originLocationHref.slice(0,originLocationHref.indexOf('/=/'));
                        }
                    }
                    if(originLocationHref==href){
                        elEl.addClass(hlCls);
                    }else{
                        elEl.removeClass(hlCls);
                    }
                });
                //点亮附加高亮导航，可用于定位父级导航,可设置多重父集导航
                _.each(store,function(config){
                    var elEl=config.element,
                        hlCls=config.hlCls,
                        lightNav=elEl.attr('lightnav');
                    if(elEl.hasClass(hlCls)){
                        if(lightNav){
                            lightNav=lightNav.split(',');
                            _.each(lightNav,function(navHref){
                                _.each(store,function(config){
                                    var elEl=config.element,
                                        hlCls=config.hlCls,
                                        href=config.href;
                                    if(elEl.attr('notracenav')!=="true"){   //加入notracenav自定义属性的dom不会被点亮
                                        if(navHref==href){
                                            elEl.addClass(hlCls);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            });
            return function(elSelector,hlCls){
                var elEl=$(elSelector);
                hlCls=hlCls||"depw-menu-aon";
                elEl.each(function(){
                    var config={};
                    var meEl=$(this),
                        navHref,
                        lightModel;
                    navHref=meEl.attr('navhref')||meEl.attr('href');
                    lightModel=meEl.attr('lightmodel')||'with';  //高亮方式 with/ignore(带参数和不带参数)匹配，默认带参数匹配
                    if(navHref.indexOf('#')!=-1){
                        navHref=navHref.slice(navHref.indexOf('#'));
                    }
                    //保证链接地址全部小写
                    navHref = navHref.toLowerCase();
                    _.extend(config,{
                        "element":meEl,
                        "hlCls":hlCls,
                        "href":encodeURI(navHref),
                        "lightModel":lightModel
                    });
                    //放到容器中保存
                    store.push(config);
                });

            };
        }()),
        "showTip":function(opts){
            var tip=arguments.callee.tip,
                tipEl;
            /**
             * after show后调用callback重新设置tip的位置
             */
            var afterShowCb=function(){
                var tipEl=tip.element,
                    arrowsEl=$('.arrows-wrapper',tipEl),  //三角型箭头
                    align=tip.get('align'),
                    baseEl=align.baseElement;
                if(arrowsEl.length==0){
                    arrowsEl=$('<div class="arrows-wrapper"></div>').appendTo(tipEl);
                    arrowsEl.html('<div class="arrows-inner"></div>');
                }
                //TODO:根据tip的宽高重新设置tip位置
                tip.set('align',{
                    selfXY: [0, 0],
                    baseElement: baseEl,
                    baseXY: [0, baseEl.outerHeight()+8]
                });
                //默认是向上的箭头
                arrowsEl.removeClass('arrows-t arrows-b arrows-l arrows-r').addClass('arrows-t');
                return tip;
            };
            opts= _.extend({
                "baseElement":null,
                "content":'<div></div>',
                "afterShow":FS.EMPTY_FN
            },opts||{});
            opts.baseElement=$(opts.baseElement);

            if(!tip){
                //tip初始化
                tip=new Overlay({
                    template: '<div class="fs-tip"></div>',
                    "zIndex":1000
                }).render();
                //全局点击隐藏
                util.regGlobalClick(tip.element,function(){
                    if(tip.element.is(':visible')){
                        tip.hide();
                    }
                });
                arguments.callee.tip=tip;   //保留引用，tip为单例模式
            }
            tipEl=tip.element;
            //设置tip内容
            tipEl.html(opts.content);
            //设置初始align
            tip.set('align',{
                selfXY: [0, 0],
                baseElement: opts.baseElement,
                baseXY: [0, opts.baseElement.outerHeight()+8]
            });
            //拦截show方法
            //tip.afterShow();
            tip.on('after:show',function(){
                opts.afterShow.call(tip,afterShowCb);
                //只执行一次立马清除
                tip.off('after:show',arguments.callee);
            });
            tip.show();
        },
        /**
         * 根据code返回source名称
         * @param code
         */
        getSourceNameFromCode:function(code){
            var sourceName;
            code=parseInt(code);
            switch(code){
                case 1:
                    sourceName="纷享销客";
                    break;
                case 2:
                case 201:
                case 202:
                case 301:
                case 302:
                    sourceName="手机网页版";
                    break;
                case 3:
                    sourceName="桌面版";
                    break;
                case 203:
                    sourceName="iPhone";
                    break;
                case 204:
                    sourceName="iPad";
                    break;
                case 303:
                    sourceName="Android";
                    break;
                case 304:
                    sourceName="Android HD";
                    break;
                case 501:
                    sourceName="网页版";
                    break;
                case 502:
                    sourceName="企业QQ";
                    break;
                default:
                    sourceName="未知";
                    break;
            }
            return sourceName;
        },
        /**
         * 从fileInfo中提取包含的附件类型名称
         * @param fileInfos
         * @returns {Array}
         */
        getAttachTypeName:function(fileInfos){
            var attachTypeNames=[];
            _.each(fileInfos,function(fileInfo){
                if(fileInfo.value==2){
                    if(!_.find(attachTypeNames,function(attachTypeName){
                        return attachTypeName=="图片";
                    })){
                        attachTypeNames.push('图片');
                    }
                }else if(fileInfo.value==3){
                    if(!_.find(attachTypeNames,function(attachTypeName){
                        return attachTypeName=="附件";
                    })){
                        attachTypeNames.push('附件');
                    }
                }else if(fileInfo.value==1){
                    if(!_.find(attachTypeNames,function(attachTypeName){
                        return attachTypeName=="录音";
                    })){
                        attachTypeNames.push('录音');
                    }
                }
            });
            return attachTypeNames;
        },
        /**
         * 根据feedType获取feed类型名
         * @param feedType
         * @returns {*}
         */
        getFeedTypeName:function(feedType){
            var feedTypeName;
            feedType=parseInt(feedType);
            switch(feedType){
                case 1:
                    feedTypeName="分享";
                    break;
                case 2:
                    feedTypeName="日志";
                    break;
                case 3:
                    feedTypeName="指令";
                    break;
                case 4:
                    feedTypeName="审批";
                    break;
                default:
                    feedTypeName="未知";
                    break;
            }
            return feedTypeName;
        },
        /**
         * 获取任务状态名
         * @param workStatus
         * @returns {*}
         */
        getWorkStatusName:function(workStatus){
            var workStatusName;
            workStatus=parseInt(workStatus);
            switch(workStatus){
                case 1:
                    workStatusName="执行中";
                    break;
                case 2:
                    workStatusName="已完成";
                    break;
                case 3:
                    workStatusName="已取消";
                    break;
                default:
                    workStatusName="";
                    break;
            }
            return workStatusName;
        },
        /**
         * 获取日志子类型
         * @param planType
         * @returns {*}
         */
        getPlanTypeName:function(planType){
            var planTypeName;
            planType=parseInt(planType);
            switch(planType){
                case 1:
                    planTypeName="日志";
                    break;
                case 2:
                    planTypeName="周计划";
                    break;
                case 3:
                    planTypeName="月计划";
                    break;
                default:
                    planTypeName="未知";
                    break;
            }
            return planTypeName;
        },
        /**
         * 获取审批状态名
         * @param approveStatus
         * @returns {*}
         */
        getApproveStatusName:function(approveStatus){
            var approveStatusName;
            approveStatus=parseInt(approveStatus);
            switch(approveStatus){
                case 1:
                    approveStatusName="待审批";
                    break;
                case 2:
                    approveStatusName="同意";
                    break;
                case 3:
                    approveStatusName="不同意";
                    break;
                case 4:
                    approveStatusName="已取消";
                    break;
                default:
                    approveStatusName="";
                    break;
            }
            return approveStatusName;
        },
        /**
         * 获取审批操作类型
         * @param operationType
         */
        getApproveOperationTypeName:function(operationType){
            var operationTypeName;
            operationType=parseInt(operationType);
            switch(operationType){
                case 1:
                    operationTypeName="同意";
                    break;
                case 2:
                    operationTypeName="不同意";
                    break;
                case 3:
                    operationTypeName="设置为已取消";
                    break;
                default:
                    operationTypeName="";
                    break;
            }
            return operationTypeName;
        },
        /**
         * 获取任务操作类型
         * @param operationType
         */
        getWorkOperationTypeName:function(operationType){
            var operationTypeName;
            operationType=parseInt(operationType);
            switch(operationType){
                case 1:
                    operationTypeName="设置为已完成";
                    break;
                case 2:
                    operationTypeName="设置为未完成";
                    break;
                case 3:
                    operationTypeName="设置为已取消";
                    break;
                case 4:
                    operationTypeName="点评工作";
                    break;
                case 5:
                    operationTypeName="转他人执行";
                    break;
                default:
                    operationTypeName="";
                    break;
            }
            return operationTypeName;
        },
        /**
         * 获取提醒时段名称
         * @param smsRemindType
         * @returns {*}
         */
        getSmsRemindTypeName:function(smsRemindType){
            var smsRemindTypeName;
            smsRemindType=parseInt(smsRemindType);
            switch(smsRemindType){
                case 1:
                    smsRemindTypeName="不提醒";
                    break;
                case 2:
                    smsRemindTypeName="提前15分钟提醒";
                    break;
                case 3:
                    smsRemindTypeName="提前半小时提醒";
                    break;
                case 4:
                    smsRemindTypeName="提前1小时提醒";
                    break;
                case 5:
                    smsRemindTypeName="提前2小时提醒";
                    break;
                case 6:
                    smsRemindTypeName="提前6小时提醒";
                    break;
                case 7:
                    smsRemindTypeName="提前1天提醒";
                    break;
                default:
                    smsRemindTypeName="未知";
                    break;
            }
            return smsRemindTypeName;
        },
        /**
         * 获取日志操作类型名
         * @param operationType
         * @returns {*}
         */
        getPlanOperationType:function(operationType){
            var operationTypeName;
            operationType=parseInt(operationType);
            switch(operationType){
                case 1:
                    operationTypeName="点评";
                    break;
                case 2:
                    operationTypeName="设置为已取消";
                    break;
                default:
                    operationTypeName="";
                    break;
            }
            return operationTypeName;
        },
        /**
         * 阿拉伯数字转换成中文数字，10以内
         * @param number
         * @returns {*}
         */
        changeToChineseNum:function(number){
            var chineseNumber;
            number=parseInt(number);
            switch(number){
                case 0:
                    chineseNumber="零";
                    break;
                case 1:
                    chineseNumber="一";
                    break;
                case 2:
                    chineseNumber="二";
                    break;
                case 3:
                    chineseNumber="三";
                    break;
                case 4:
                    chineseNumber="四";
                    break;
                case 5:
                    chineseNumber="五";
                    break;
                case 6:
                    chineseNumber="六";
                    break;
                case 7:
                    chineseNumber="七";
                    break;
                case 8:
                    chineseNumber="八";
                    break;
                case 9:
                    chineseNumber="九";
                    break;
                case 10:
                    chineseNumber="十";
                    break;
                default:
                    chineseNumber="未知";
                    break;
            }
            return chineseNumber;
        },
        /**
         * 获取发布的可视范围自动完成默认值
         * @param configTypeName plan/approve/work/schedule...
         * @returns Array
         */
        getPublishRange:function(configTypeName){
            var contactData=util.getContactData(),
                currentUserData=contactData["u"],
                belongGroupIds=currentUserData.groupIDs,  //所属groups
                groupStore=[],  //部门
                groupAcInitData={
                    "parseData":function(data){
                        var acData=[].concat(data);
                        return acData;
                    },
                    "createHtml":function(data){
                        var itemEl;
                        var dataId=data.id,
                            title;
                        title=data.value+'（'+util.getContactDataById(dataId,'g').memberCount+'）';
                        itemEl=$('<li class="ui-autocomplete-item"><a class="fs-prevent-default" href="javascript:;" title="'+title+'">'+title+'</a></li>');
                        return itemEl;
                    },
                    "eqFields":['id','type'],
                    "renderCb":function(store,listSelector){
                        var that=this;
                        var visibleHEl,
                            listEl=$(listSelector),
                            moreItemsEl=$('.ui-autocomplete-item',listEl).slice(3);
                        if(moreItemsEl.length>0){
                            visibleHEl=$('<li class="visible-h state-hidden"><a href="javascript:;">展开部门&#8230;</a></li>');
                            visibleHEl.appendTo(listEl);
                            visibleHEl.on('click',function(evt){
                                if(visibleHEl.hasClass('state-hidden')){
                                    moreItemsEl.show();
                                    $('a',visibleHEl).html('收起部门&#8230;');
                                    visibleHEl.removeClass('state-hidden');
                                }else{
                                    moreItemsEl.hide();
                                    $('a',visibleHEl).html('展开部门&#8230;');
                                    visibleHEl.addClass('state-hidden');
                                }
                                that.show(); //重新设置下拉面板高度
                                evt.stopPropagation();
                            });
                            //开始默认隐藏更多的item
                            moreItemsEl.hide();
                        }
                    }
                };
            if(belongGroupIds.length>0){
                _.each(belongGroupIds,function(groupId,i){
                    var groupData=util.getContactDataById(groupId,'g');
                    groupStore[i]={
                        "id":groupId,
                        "value":groupData.name,
                        "type":"g"
                    };
                });
                //限制5个
                //groupStore=groupStore.slice(0,5);
            }
            groupAcInitData.store=groupStore;
            var myStore=[], //和我相关一些信息
                myAcInitData={
                    "parseData":function(data){
                        var acData=[],
                            ids;
                        acData=acData.concat(data);
                        return acData;
                        /*if(data.flag=="myGroup"){
                            ids=data.ids.split(',');
                            _.each(ids,function(id){
                                var groupData=util.getContactDataById(id,'g');
                                acData.push({
                                    "id":id,
                                    "value":groupData.name,
                                    "type":"g"
                                });
                            });
                        }else{
                            acData=acData.concat(data);
                        }
                        return acData;*/
                    },
                    "createHtml":function(data){
                        var itemEl;
                        itemEl=$('<li class="ui-autocomplete-item"><a class="fs-prevent-default" title="'+data.value+'" href="javascript:;">'+data.value+'</a></li>');
                        return itemEl;
                    },
                    "eqFields":['id','type']
                };
            //我的所有部门
            if(belongGroupIds.length>0){
                myStore.push({
                    "id": belongGroupIds.join(','),
                    "value":"我的所有部门",
                    "name":"我的所有部门", //提供selectBar.addItem直接使用
                    "type":"mix",
                    "validity":"no", //不进行有效性验证
                    "valueType":"g"  //获取选中值时的真实key，如果不设置则采用type设置
                });
            }
            //全公司
            myStore.push({
                "id": 999999,
                "value":currentUserData.allCompanyDefaultString,
                "name":currentUserData.allCompanyDefaultString,   //提供selectBar.addItem直接使用
                "type":"mix",
                "validity":"no", //不进行有效性验证
                "valueType":"g"  //获取选中值时的真实key，如果不设置则采用type设置
            });
            //我自己
            myStore.push({
                "id": currentUserData.id,
                "value":"我自己",
                "type":"p"
            });
            myAcInitData.store=myStore;
            if(!configTypeName){       //如果configTypeName为空，直接返回上两个section
                return [groupAcInitData,myAcInitData];
            }
            if(configTypeName=="circle"){   //如果只是部门，把自己过滤掉
                myStore.pop();
                return [groupAcInitData,myAcInitData];
            }
            var employees=util.getPersonalConfig(configTypeName+"Employees"),
                ranges=util.getPersonalConfig(configTypeName+"Ranges"),
                employeeStore=[],
                employeeAcInitData={
                    "parseData":function(data){
                        var acData=[].concat(data);
                        return acData;
                    },
                    "createHtml":function(data){
                        var itemEl;
                        itemEl=$('<li class="ui-autocomplete-item"><a class="fs-prevent-default" href="javascript:;" title="'+data.value+'">'+data.value+'</a></li>');
                        return itemEl;
                    },
                    "eqFields":['id','type']
                },
                rangeStore=[],
                rangeAcInitData={
                    "parseData":function(data){
                        var acData=[];
                        var vals=data.value.split(','),
                            ids=data.ids.split('|'),
                            circleIds=ids[0].split(','),
                            employeeIds=ids[1].split(',');
                        _.each(circleIds,function(id){
                            acData.push({
                                "value":vals[acData.length],
                                "id":id,
                                "type":"g"
                            });
                        });
                        _.each(employeeIds,function(id){
                            acData.push({
                                "value":vals[acData.length],
                                "id":id,
                                "type":"p"
                            });
                        });
                        return acData;
                    },
                    "createHtml":function(data){
                        var itemEl;
                        itemEl=$('<li class="ui-autocomplete-item"><a class="fs-prevent-default" title="'+data.value+'" href="javascript:;">'+data.value+'</a></li>');
                        return itemEl;
                    },
                    "eqFields":['id','type']
                };
            _.each(employees,function(employee,i){
                employeeStore[i]={
                    "id":employee.dataID,
                    "value":employee.name,
                    "type":"p"
                };
            });
            _.each(ranges,function(range,i){
                rangeStore[i]={
                    "ids":range.dataIDs,
                    "value":range.names,
                    "type":"mix"
                };
            });
            employeeAcInitData.store= employeeStore;
            rangeAcInitData.store= rangeStore;

            return [groupAcInitData,myAcInitData,employeeAcInitData,rangeAcInitData];
        },
        /**
         * 获取发布默认选中人
         * @param cateKey
         * @returns {Array}
         */
        getPublishDefaultUser:function(cateKey){
            var defaultUserConfig=util.getPersonalConfig(cateKey),
                store=[],
                acInitData={
                    "parseData":function(data){
                        var acData=[].concat(data);
                        return acData;
                    },
                    "createHtml":function(data){
                        var itemEl;
                        itemEl=$('<li class="ui-autocomplete-item"><a class="fs-prevent-default" href="javascript:;" title="'+data.value+'">'+data.value+'</a></li>');
                        return itemEl;
                    },
                    "eqFields":['id','type']
                };
            _.each(defaultUserConfig,function(configItem,i){
                var userData=util.getContactDataById(configItem.dataID,'p');
                if(userData){       //filter掉离职的人
                    store.push({
                        "id":configItem.dataID,
                        "value":configItem.name,
                        "type":"p"
                    });
                }

            });
            acInitData.store=store;
            return [acInitData];
        },
        /**
         * 从input中获取at内容
         * @param inputSelector
         * @returns {*}
         */
        getAtFromInput: function (inputSelector) {
            var inputEl = $(inputSelector),
                v = _.str.trim(inputEl.val()),
                atStore;
            if (v.length > 0) {
                //atStore=v.match(/@[^@\s:：]+/g);
                atStore=v.match(/@[\u4e00-\u9fa5\w-]+/g); //匹配 @+汉字字母数字下划线中划线
            }
            atStore= _.map(atStore,function(v){
                return v.slice(1);  //去掉@
            });
            return atStore;
        },
        /**
         * 自定义时间距离描述
         * @param dateObj
         * @param baseDate
         * @param type  1:详尽型,2:简单型
         * @returns {*}
         */
        getDateSummaryDesc:function(dateObj,baseDate,type){
            var diffValue;
            if(_.isUndefined(type)){
                type=baseDate;
                baseDate=moment();
            }
            dateObj=moment(dateObj);
            baseDate=moment(baseDate);
            //第一种风格，比较详尽型
            if(type==1){
                diffValue=parseInt(baseDate.diff(dateObj,'seconds'));
                if(diffValue<60){
                    if(diffValue<10){
                        return "几秒前";
                    }else{
                        return diffValue+"秒前";
                    }
                }
                diffValue=parseInt(baseDate.diff(dateObj,'minutes'));
                if(diffValue<60){
                    if(diffValue==1){
                        return "1分钟前";
                    }
                    return diffValue+"分钟前";
                }
                diffValue=parseInt(moment(baseDate).startOf('day').diff(moment(dateObj).startOf('day'),'days'));
                if(diffValue==0){ //当天
                    return "今天 "+dateObj.format('HH:mm');
                }
                if(diffValue==1){
                    return "昨天 "+dateObj.format('HH:mm');
                }
                diffValue=parseInt(moment(baseDate).startOf('year').diff(moment(dateObj).startOf('year'),'years'));
                if(diffValue==0){ //当年
                    return dateObj.format('MM月DD日 HH:mm');
                }
                return dateObj.format('YYYY年MM月DD日 HH:mm');
            }else{  //第二种风格，简单型
                diffValue=parseInt(moment(baseDate).startOf('day').diff(moment(dateObj).startOf('day'),'days'));
                if(diffValue==0){ //当天
                    return "今天 "+dateObj.format('HH:mm');
                }
                if(diffValue==-1){
                    return "明天 "+dateObj.format('HH:mm');
                }
                if(diffValue==-2){
                    return "后天 "+dateObj.format('HH:mm');
                }
                if(diffValue==1){
                    return "昨天 "+dateObj.format('HH:mm');
                }
                if(diffValue==2){
                    return "前天 "+dateObj.format('HH:mm');
                }
                diffValue=parseInt(moment(baseDate).startOf('year').diff(moment(dateObj).startOf('year'),'years'));
                if(diffValue==0){ //当年
                    return dateObj.format('MM月DD日 HH:mm');
                }
                return dateObj.format('YYYY年MM月DD日 HH:mm');
            }
        },
        /**
         * 获取图片或附件的预览地址或下载地址
         * @param opts
         * @returns {string}
         */
        getDfLink:function(id,name,isAttachment,extendInfo){
            //isAttachment=isAttachment?1:0;
            var path;
            name=encodeURIComponent(name);
            if(extendInfo){
                id=id+'.'+extendInfo;
            }else{
                extendInfo=util.getFileExtText(id);
            }
            if(isAttachment){   //下载
                path=FS.API_PATH+'/df/get?id='+id+'&name='+name+'&isAttachment='+isAttachment+'&extendInfo='+extendInfo;
            }else{   //直接打开
                path=FS.API_PATH+'/df/get?id='+id;
            }
            return path;
        },
        /**
         * 获取图片或附件的预览地址或下载地址
         * @param opts
         * @returns {string}
         */
        getDfGlobalLink:function(id,name,isAttachment,extendInfo){
            var path;
            name=encodeURIComponent(name);
            if(extendInfo){
                id=id+'.'+extendInfo;
            }else{
                extendInfo=util.getFileExtText(id);
            }
            if(isAttachment){   //下载
                path=FS.API_PATH+'/DF/GetGlobal?id='+id+'&name='+name+'&isAttachment='+isAttachment+'&extendInfo='+extendInfo;
            }else{   //直接打开
                path=FS.API_PATH+'//DF/GetGlobal?id='+id;
            }
            return path;
        },
        /**
         * 获取头像地址
         * @param path
         * @param sizeType
         */
        getAvatarLink:function(path,sizeType){
            if(path&&path.length>0){
                return util.getDfLink(path+sizeType+'.jpg','',false);
            }else{
                return FS.ASSETS_PATH+'/images/employee_default_120_120.png';
            }
        },
        /**
         * 通过文件名获取文件扩展名
         * @param fileName
         * @returns {*}
         */
        getFileExtText:function(fileName){
            var extIndex=fileName.lastIndexOf('.'),
                extText;
            if(extIndex==-1){
                extText="";
            }else{
                extText=fileName.slice(extIndex+1);
            }
            return extText;
        },
        /**
         * 获取文件名称部分,不包含扩展名
         * @param fileName
         * @returns {*}
         */
        getFileNamePath:function(fileName){
            var extIndex=fileName.lastIndexOf('.'),
                fileNamePath;
            if(extIndex==-1){
                fileNamePath=fileName;
            }else{
                fileNamePath=fileName.slice(0,extIndex);
            }
            return fileNamePath;
        },
        /**
         * 通过文件名获取上传类型
         * @param fileName
         * @returns {string}
         */
        getUploadType:function(fileName){
            var uploadType = "";
            if (/\.(?:jpg|jpeg|png|gif)$/i.test(fileName)) {
                uploadType = "img";
            } else{
                uploadType = "attach";
            }
            return uploadType;
        },
        /**
         * 设置全屏模式
         * @param isFullScreen
         */
        setFullScreen:function(isFullScreen){
            var htmlEl=$('html'),
                bodyEl=$('body');
            if(isFullScreen){
                if(!htmlEl.data('overflowY')){     //把以前的overflow保存起来
                    htmlEl.data('overflowY',htmlEl.css('overflow-y'));
                }
                htmlEl.css('overflow-y','hidden');
            }else{
                htmlEl.css('overflow-y',htmlEl.data('overflowY')||"scroll");
            }
        },
        /**
         * 把item unshift到list里，如果原来item不存在，直接unshift，如果已存在，调整位置
         * @param list
         * @param item
         * @param iterator
         * @returns {*}
         */
        toListTop:function(list,item,iterator){
            if(!_.some(list,iterator)){     //不在list里，unshift到最前面
                list.unshift(item);
            }else{  //已经在里面，排到最前面
                list= _.reject(list,iterator); //先过滤，再unshift
                list.unshift(item);
            }
            return list;
        },
        /**
         * 根据定位数据获取定位信息
         * @param locationData
         */
        getLocationInfo:function(locationData){
            var address='';
            if(locationData.country!="中国"){
                address+=locationData.country;
            }
            //是否是直辖市
            if(locationData.province!=locationData.city){
                address+=locationData.province;
            }
            //过滤部分为空的地址片段
            _.each([locationData.city,locationData.district,locationData.street,locationData.streetNumber],function(partAddr){
                if(partAddr.length>0){
                    address+=partAddr;
                }
            });
            return address;
        },
        /**
         * 根据keyCode判断是否是数字、字符、和空格/回车
         * @param keyCode
         */
        isNatureCode:function(keyCode){
            var passed=false,
                i;
            var numCodeList=[],
                letterCodeList=[],
                otherCodeList=[];
            for(i=48;i<57;i++){    //数字
                numCodeList.push(i);
            }
            for(i=65;i<90;i++){  //字母
                letterCodeList.push(i);
            }
            otherCodeList.push(32); //空格
            otherCodeList.push(13); //回车
            return _.contains([].concat(numCodeList,letterCodeList,otherCodeList),keyCode);
        },
        /**
         * 将一个或多个对象合并到第一个参数（它也必须是对象）中，
         * 如果只有一个参数，则合并到mix的调用者上，如果最后一个参数是布尔，则用于判定是否覆盖已有属性
         * @param receiver
         * @param supplier
         * @returns {*}
         */
        mix:function(receiver, supplier){
            var args = Array.apply([], arguments ),i = 1, key,//如果最后参数是布尔，判定是否覆写同名属性
                ride = typeof args[args.length - 1] == "boolean" ? args.pop() : true;
            if(args.length === 1){//处理$.mix(hash)的情形
                receiver = !this.window ? this : {} ;
                i = 0;
            }
            while((supplier = args[i++])){
                for ( key in supplier ) {//允许对象糅杂，用户保证都是对象
                    if (supplier.hasOwnProperty(key) && (ride || !(key in receiver))) {
                        receiver[ key ] = supplier[ key ];
                    }
                }
            }
            return receiver;
        },
        /**
         * 根据attachSource获取附件来源名
         * @param attachSource
         */
        getAttachSourceName:function(attachSource){
            var attachSourceName;
            attachSource=parseInt(attachSource);
            switch(attachSource){
                case 1:
                    attachSourceName="feed";
                    break;
                case 2:
                    attachSourceName="reply";
                    break;
                case 3:
                    attachSourceName="qx";
                    break;
                case 4:
                    attachSourceName="email";
                    break;
                default:
                    attachSourceName="unknown";
                    break;
            }
            return attachSourceName;
        },
        /**
         * 判断firstArr和secondArr元素是否互相包含，length一致
         * @param firstArr
         * @param secondArr
         */
        isArrayElementEq:function(firstArr,secondArr){
            var isEq=true;
            if(firstArr.length!=secondArr.length){
                return false;
            }
            _.some(firstArr,function(firstItem){
                if(!_.contains(secondArr,firstItem)){
                    isEq=false;
                    return true;
                }
            });
            return isEq;
        },
        /**
         * 从contactData中过滤掉type类型的ids
         * @param ids
         * @param type
         * @returns {Array}
         */
        excludeContactData:function(ids,type){
            var contactData=util.getContactData();
            ids=[].concat(ids);
            type=type||"p";
            return _.reject(contactData[type],function(itemData){
                return _.some(ids,function(id){
                    return itemData.id==id;
                });
            });
        },
        /**
         * 从dataStore中过滤掉指定key的vals
         * @param ids
         * @param key
         * @param dataStore
         * @returns {Array}
         */
        excludeDataByKey:function(vals,key,dataStore){
            vals=[].concat(vals);
            return _.reject(dataStore,function(itemData){
                return _.some(vals,function(val){
                    return itemData[key]==val;
                });
            });
        },
        /**
         * 隐藏说有的浮动窗口
         */
        hideAllFloatWins:function(){
            //隐藏搜索弹框
            Dialog.hideAll();
            //隐藏其他搜索浮动窗口
            $('.fs-float-win').each(function(){
                Widget.query(this).hide();
            });
        },
        /**
         * 显示成功提示
         */
        showSucessTip:(function(){
            var tipDialog=new Dialog({
                "className":"fs-success-tip",
                "content":"success",
                "width":"auto",
                "visibleWithAnimate":true
            });
            return function(tipContent){
                var dialogEl;
                if(!tipDialog.rendered){
                    tipDialog.render();
                }
                dialogEl=tipDialog.element;
                dialogEl.html('<img src="'+FS.BLANK_IMG+'" class="icon-success" /><span class="tip-content">'+tipContent+'</span>');
                tipDialog.show();
                setTimeout(function(){
                    tipDialog.hide();
                },1000);
            };
        }()),
        showGuideTip:(function(){
            var store=[];
            var tid;
            var adjustFn=function(itemConfig){
                var elEl=itemConfig.element,
                    leftBracketEl=itemConfig.leftBracket,
                    rightBracketEl=itemConfig.rightBracket;
                var opts=itemConfig.opts;
                var selfWidth=elEl.outerWidth(),
                    selfHeight=elEl.outerHeight(),
                    selfOffset=elEl.offset();
                leftBracketEl.height(selfHeight+opts.leftHeightIncrement);
                leftBracketEl.css({
                    "top":(selfOffset.top+opts.leftTopIncrement)+'px',
                    "left":(selfOffset.left-leftBracketEl.width()+opts.leftLeftIncrement)+'px'
                });
                rightBracketEl.height(selfHeight+opts.rightHeightIncrement);
                rightBracketEl.css({
                    "top":(selfOffset.top+opts.rightTopIncrement)+'px',
                    "left":(selfOffset.left+selfWidth+opts.rightLeftIncrement)+'px'
                });
            };
            $(root).resize(function(){
                clearTimeout(tid);
                tid=setTimeout(function(){
                    //清除不在页面内的element，节约内存
                    store= _.filter(store,function(itemConfig){
                        return $.contains($('body')[0], itemConfig.leftBracket[0]);
                    });
                    _.each(store,function(itemConfig){
                        adjustFn(itemConfig);
                    });
                },100);
            });
            tpl.event.on('switched', function (tplName2, tplEl) {
                _.each(store,function(itemConfig){
                    var elEl=itemConfig.element,
                        leftBracketEl=itemConfig.leftBracket,
                        rightBracketEl=itemConfig.rightBracket;
                    if(elEl.is(':hidden')){
                        leftBracketEl.hide();
                        rightBracketEl.hide();
                    }else{
                        leftBracketEl.show();
                        rightBracketEl.show();
                        adjustFn(itemConfig);
                    }
                });
            });
            return function(elSelector,opts){
                var itemConfig;
                var elEl=$(elSelector);
                var leftBracketEl,
                    rightBracketEl,
                    imgWEl;
                //默认参数
                opts= _.extend({
                    "leftLeftIncrement":0,  //左侧边框左移动增量
                    "leftTopIncrement":0,  //左侧边框上移动增量
                    "leftHeightIncrement":0, //左侧高度增量
                    "rightLeftIncrement":0, //右侧边框左移动增量
                    "rightTopIncrement":0, //右侧边框上移动增量
                    "rightHeightIncrement":0,    //右侧高度增量
                    "imageName":"", //tip图片名
                    "imageDescription":"",  //图片描述
                    "imagePlace":"right",
                    "imagePosition":{
                        "top":0,
                        "left":"16px"
                    },
                    "renderCb":FS.EMPTY_FN
                },opts||{});
                if(elEl.length==0||elEl.is(':hidden')){ //如果没找到要提示的或者要提示的dom处于隐藏状态，直接返回
                    return;
                }
                if(elEl.data('noguide')||elEl.attr('noguide')=="yes"){  //通过data-noguide或者noguide自定义属性拦截
                    return;
                }
                //构建bracket结构
                leftBracketEl=$('<div class="fs-guide-left-bracket fs-guide-bracket"></div>');
                rightBracketEl=$('<div class="fs-guide-right-bracket fs-guide-bracket"></div>');
                leftBracketEl.appendTo('body');
                rightBracketEl.appendTo('body');
                //设置配置项
                itemConfig={
                    "element":elEl,
                    "leftBracket":leftBracketEl,
                    "rightBracket":rightBracketEl,
                    "opts":opts
                };
                //设置图片位置
                itemConfig[opts.imagePlace+'Bracket'].html('<div class="fs-guide-image-wrapper"><img class="fs-guide-image" src="'+FS.ASSETS_PATH+'/images/guide/'+opts.imageName+'" alt="'+opts.imageDescription+'" /></div>');
                imgWEl=$('.fs-guide-image-wrapper',itemConfig[opts.imagePlace+'Bracket']);
                imgWEl.css(_.extend({
                    "position":"absolute"
                },opts.imagePosition));
                //render回调
                opts.renderCb.call(this,imgWEl,leftBracketEl,rightBracketEl,elEl);
                //首次执行定位
                adjustFn(itemConfig);
                //设置store存储
                store.push(itemConfig);
            };
        }())
    });
    FS.util = util;
    module.exports = util;
});