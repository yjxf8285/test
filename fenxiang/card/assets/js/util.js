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
        Select=require('select'),
        placeholder = require('placeholder'),
        localStore = require('store'),
        helperTpl = require('assets/html/helper.html'),
        json = require('json'),
        moment=require('moment'),
        clientStore=require('store'),
        $ = require('$');
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store;
    var util = {},
        helperEl = $(helperTpl);
    util.noAuthCount = 0;
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
                    "timeout": 35000  //临时改为35s超时设置
                }, opts || {});
                cusOpts = $.extend({
                    "mask": false,
                    "maskCls": "",
                    "loadingType":0,   //加载符类型
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
                        if (cusOpts.maskCls) {
                            globalMask.element.addClass(cusOpts.maskCls);
                        }
                    } else { //局部遮罩
                        maskRefEl = $(cusOpts.mask);
                        if(maskRefEl&&maskRefEl.is(':visible')){
                            partMask = new Overlay({
                                template: '<div class="fs-ajax-part-mask"></div>',
                                width: maskRefEl.outerWidth(),
                                height: maskRefEl.outerHeight(),
                                zIndex: 10000,
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

                    }
                    //判断上次请求是否已经结束，如果没有直接返回，什么都不做
                    if(_.some(ajaxStore,function(itemConfig){
                        if(itemConfig.requestPath==opts.url&&itemConfig.mask===cusOpts.mask){
                            return true;
                        }
                    })){
                        return;
                    }
                }
                //判断是否显示loading符
                if(cusOpts.loadingType>0){
                    util.showGlobalLoading(cusOpts.loadingType);
                }
                xhrDeferred = $.ajax(opts);
                xhrDeferred.always(function (jqxhr, textStatus) {
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
                        if (cusOpts.maskCls) {
                            globalMask.element.removeClass(cusOpts.maskCls);
                        }
                    }
                    //清除ajaxStore对应项，防止内存泄漏
                    if (typeof(curIndex) == "number") {
                        ajaxStore.splice(curIndex, 1);
                    }
                    //清除局部遮罩
                    if(!cusOpts.keepMask){   //用户设置保留遮罩则局部遮罩会保留，以后通过maskCls找回
                        partMask && partMask.element.remove() && partMask.destroy();
                    }
                    //隐藏loading符
                    if(cusOpts.loadingType>0){
                        util.hideGlobalLoading(cusOpts.loadingType);
                    }
                    //ajax返回统一处理
                    util.ajaxCallback(xhrDeferred, opts,cusOpts, textStatus);
                });
                ajaxStore.push({
                    xhr: xhrDeferred,
                    requestPath: opts.url,
                    globalMask: cusOpts.mask === true,
                    mask:cusOpts.mask
                });
                return xhrDeferred;
            };
        }()),
        "api": function(opts, curOpts){
    		var netErrorCount = 0;
    		if(opts.type && opts.type.toLowerCase() == 'get') {
    			opts.netErrorRetry = function(callback){
					if(netErrorCount < 5) {
						netErrorCount++;
    					setTimeout(function(){
    						if(!curOpts) {
    							curOpts = {};
    						}
    						curOpts.autoPrependPath = false;
    						opts.netErrorCount = netErrorCount;
    						util.api_once(opts, curOpts);
    					}, 5000);
    				} else {
    					callback && callback();
    				}
    			};
    			return util.api_once(opts, curOpts);
    		} else {
                return util.api_once(opts, curOpts);
    		}
    	},
        "api_once": function (opts,cusOpts) {
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
                //opts.data = json.stringify(data).replace(/\+/g, "%2B").replace(/\&/g, "%26"); //替换+和&符号
                opts.data = json.stringify(data);
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

        /*
        *是否已有 升级提示窗口 标志位
        */
        "_hasMaintainingPrompt":false,
        "ajaxCallback": function (jqXhr, opts, cusOpts, textStatus) {
            var responseData = util.getResponseData(jqXhr, opts);
            //先隐藏全局错误提示
            util.hideGlobalError();
            //对sucess==false的情况进行处理
            if (!responseData.success) {     //处理错误提示
            	if(opts.netErrorRetry) {
                	if(!opts.netErrorCount || (opts.netErrorCount && opts.netErrorCount<5)) {
                		if(textStatus=='timeout') {
                    		jqXhr.abort();
                    		opts.netErrorRetry && opts.netErrorRetry();
                    		return false;
                    	}
                	}
                }
                if (responseData.isAuthorized===false&&cusOpts.authorizedJump) {  //未认证跳到登录页
                		util.noAuthCount++;
                		if(util.noAuthCount>3) {
                			location.href = FS.BASE_PATH+"/login.aspx?auto=1";  //直接跳到登录页 加上auto==1防止登录页和工作管理页票据不一致的问题（登录页认为已经登录了，但是工作管理页认为没登录）
                            //location.reload();  //刷新本页直接跳到登录页
                            return false;
                		}
                }
                if(_.isUndefined(responseData.errorStatus)){ //业务逻辑错误
                    if(responseData.statusCode==-1){     //-1表示服务端处理异常
                        util.showGlobalError('服务器连接异常，请确定您的网络连接状况');
                        try{
                    		clientStore.set('xhrerror', jqXhr.status + '---' + jqXhr.statusText + '---' + opts.url);
                    	}catch(e){}
                        return;
                    }
                    if(cusOpts.errorAlertModel>1){  //errorAlertModel==2时才会提醒，2为默认提醒方式
                        if(responseData.message&&responseData.message.length>0){
                            var errorArrary = responseData.message.split("\r\n");
                            var errorMsg = errorArrary.join("<br/>");
                            util.alert(((opts&&opts.errorMsgTitle) || '')+errorMsg, function(){
                            	opts.alertmsgcb && opts.alertmsgcb();
                            });
                        }
                    }
                }else{    //服务器错误
                    if (responseData.errorStatus != 0) { //abort不提示
                        util.showGlobalError('服务器连接异常，请确定您的网络连接状况。');
                        try{
                    		clientStore.set('xhrerror', jqXhr.status + '---' + jqXhr.statusText + '---' + opts.url);
                    	}catch(e){}
                    }
                }
                /*
                *升级提示
                *不管success与否都弹出
                */
                //responseData.maintainingPrompt=responseData.serviceTime;
                if(responseData.maintainingPrompt && responseData.maintainingPrompt.length>0){
                    //如果此时有弹窗 
                    //   提示信息不一样 再弹一个
                    //   提示信息一样 略过
                    //没有弹窗直接弹出
                    if(util._hasMaintainingPrompt){
                        if(responseData.maintainingPrompt==util._hasMaintainingPrompt){
                            return;
                        }else{
                            util.alert(responseData.maintainingPrompt,function(){util._hasMaintainingPrompt=false});
                            util._hasMaintainingPrompt=responseData.maintainingPrompt;
                        }
                    //
                    }else{
                        util.alert(responseData.maintainingPrompt,function(){util._hasMaintainingPrompt=false});
                        util._hasMaintainingPrompt=responseData.maintainingPrompt;
                    }
                }

            } else {
            	util.noAuthCount = 0;
            	if(responseData.value && responseData.value.version && responseData.value.version != FS.getAppStore("contactData").version) {
            		util.showUpgradeTip();
                    return;
            	} else {
            		//重试成功后隐藏全局错误提示
                    util.hideGlobalError();
            	}
                /*
                *升级提示
                */
                //responseData.maintainingPrompt=responseData.serviceTime;
                if(responseData.maintainingPrompt && responseData.maintainingPrompt.length>0){
                    //如果此时有弹窗 
                    //   提示信息不一样 再弹一个
                    //   提示信息一样 略过
                    //没有弹窗直接弹出
                    if(util._hasMaintainingPrompt){
                        if(responseData.maintainingPrompt==util._hasMaintainingPrompt){
                            return;
                        }else{
                            util.alert(responseData.maintainingPrompt,function(){util._hasMaintainingPrompt=false});
                            util._hasMaintainingPrompt=responseData.maintainingPrompt;
                        }
                    //
                    }else{
                        util.alert(responseData.maintainingPrompt,function(){util._hasMaintainingPrompt=false});
                        util._hasMaintainingPrompt=responseData.maintainingPrompt;
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
         * 展示升级提醒
         * @param message
         */
        "showUpgradeTip":function(message, grade){
    		if(window.store.get('upgradetipshown')) return;
            var upgradeEl=$('#fs-upgrade-tip');
            if(upgradeEl.length==0){
            	upgradeEl=$('<div id="fs-upgrade-tip"></div>');
            	upgradeEl.html('<img src="' + FS.ASSETS_PATH + '/images/upgrade.gif' + '"><span class="error-message">网页版已更新，建议您保存当前工作内容并刷新页面。</span><a class="btn-refresh" onclick="return false;" href="#">立即刷新</a><span class="close-btn">×</span>');
            	upgradeEl.appendTo('body');
            	upgradeEl.on('click','.close-btn',function(){
            		upgradeEl.hide();
                }).on('click', '.btn-refresh', function(){
                	window.location.reload();
                });
            }
            upgradeEl.css({
                "margin-left":-(upgradeEl.width()/2)+'px'
            }).show().animate({
            	top: 0
            }, {
            	duration: 300
            });
            window.store.set('upgradetipshown', 1);
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
                list = tpl.list,
                validCounter=0;    //防止require.async加载页面依赖时可能引发的布局错乱问题
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
            var activeTpl=function(tplName,tplSelector, tplPath){
                var tplEl=$(tplSelector);
                var tplTitle=tplEl.attr('tpltitle')||FS.pageTitle; //tpl title
                tpl.event.trigger('switch', tplName, tplEl);
                tplEl.addClass('fs-tpl-active').show();
                //设置document title
                document.title=tplTitle;

                //页面切换行为会隐藏所有的弹框和弹框遮罩,除了有fixed-in-tpl-switch className的弹框
                Dialog.hideAll(':not(.fixed-in-tpl-switch)');
                //隐藏select组件弹出面板
                //用户切换行为会隐藏所有预览组件
                $('.ui-select').each(function(){
                    Widget.query(this).hide();
                });

                $(root).resize();   //每次切换到当前tpl以后触发window的resize事件,处理类似日历组件定位的问题
                $(root).scrollTop(0).trigger('scroll');  //保证滚动到最顶部
                tpl.event.trigger('switched', tplName, tplEl);
                var qureyParam = util.getTplQueryParams();
                var dataLighted = (qureyParam && qureyParam.datalighted) || tplEl.attr('data-lighted');
                var navObj = util.getNavRouterContants();
                var subEl = $('#sub-tpl');
                var appEl =$('.hd-app-inner'),
                    oaEl = $('.hd-crm-inner'),
                    appsEl =$('.hd-apps-inner'),
                    appNav = $('.app-top-nav-l'),
                    appsNav = $('.apps-top-nav-l'),
                    crmNav = $('.crm-top-nav-l');

                if(dataLighted && dataLighted.split('|').length==2){
                    var lightStr = dataLighted.split('|');
                    var oaOrCrm = lightStr[0];
                    var crm2Nav  = lightStr[1];
                    var app2Nav  = lightStr[1];
                    if(oaOrCrm.indexOf('crm')>-1){
                        appEl.hide();
                        oaEl.show();
                        appNav.removeClass('tnavon state-active');
                        crmNav.addClass('tnavon state-active');
                        appsEl.hide();
                        appsNav.removeClass('tnavon state-active');
//                        }else if(str.indexOf('oa')>-1){
                    }else if(oaOrCrm.indexOf('app'>-1)){
                    	appEl.hide();
                        oaEl.hide();
                        appNav.removeClass('tnavon state-active');
                        crmNav.removeClass('tnavon state-active');
                        appsEl.show();
                        appsNav.addClass('tnavon state-active');
                        var idx = $.inArray(app2Nav, navObj.app);
                        if(idx < 0) {
                        	idx = 0;
                        }
                        appsEl.find('.tpl-nav-l').removeClass('tnavon state-active');
                        appsEl.find('.tpl-nav-l').eq(idx).addClass('tnavon state-active');
                    }else{
                        oaEl.hide();
                        appEl.show();
                        crmNav.removeClass('tnavon state-active');
                        appNav.addClass('tnavon state-active');
                        appsEl.hide();
                        appsNav.removeClass('tnavon state-active');
                    }

                    for(var i= 0, len=navObj.crm.length; i<len; i++){
                        if(navObj.crm[i] == crm2Nav){
                            appEl.hide();
                            oaEl.show();

                            oaEl.find('.tpl-nav-l').removeClass('tnavon state-active');
                            if(i>5){
                                oaEl.find('.tpl-nav-l').eq(6).addClass('tnavon state-active');
                            }else{
                                oaEl.find('.tpl-nav-l').eq(i).addClass('tnavon state-active');
                            }
                        }
                    }
                    for(var i= 0, len=navObj.oa.length; i<len; i++){
                        if(navObj.oa[i] == crm2Nav){
                            oaEl.hide();
                            appEl.show();

                            appEl.find('.tpl-nav-l').removeClass('tnavon state-active');
                            appEl.find('.tpl-nav-l').eq(i).addClass('tnavon state-active');
                        }
                    }
                    for(var i= 0, len=navObj.app.length; i<len; i++){
                        if(navObj.app[i] ==app2Nav){
                            oaEl.hide();
                            appEl.hide();
                            appsEl.show();
                            oaEl.find('.tpl-nav-l').removeClass('tnavon state-active');
                            appEl.find('.tpl-nav-l').removeClass('tnavon state-active');
                            appsEl.find('.tpl-nav-l').eq(i).addClass('tnavon state-active');
                            appNav.removeClass('tnavon state-active');
                            appsNav.addClass('tnavon state-active');
                        }
                    }

                }else{
                    oaEl.hide();
                    appEl.show();
                    appsEl.hide();
                    crmNav.removeClass('tnavon state-active');
                    appsNav.removeClass('tnavon state-active');
                    appNav.addClass('tnavon state-active');
                }

                //f5页面刷新，more的设置
                var navStr = tplPath.split('/')[0];
                if(navObj.crm[navStr]){
                    var currentNav = navObj.crm[navStr];
                    appEl && appEl.hide();
                    oaEl && oaEl.show();
                    oaEl && oaEl.find('.tpl-nav-l').removeClass('tnavon state-active');

                    if(util.isCrmAdmin()){
                        if(currentNav.index>7){
                            var currentA = $('<a href="'+currentNav.href+'" id="'+currentNav.tip+'" class="tpl-nav-l" >'+currentNav.text+'</a>');
                            $('.more-nav-link').prev().empty().append(currentA);
                            $('.more-nav-list').find('#'+currentNav.tip).addClass('state-selected');
                            if($('.more-nav-list').find('#tip-crmsetting').length == 0)
                                $('.more-nav-list').append($('<li class="more-nav-item"><a href="#crmsettings/leaderssetting" id="tip-crmsetting" class="tpl-nav-l setting" >设置</a></li>'));
                        }
                    }else{
                        if(currentNav.index>=8){
                            var currentA = $('<a href="'+currentNav.href+'" id="'+currentNav.tip+'" class="tpl-nav-l" >'+currentNav.text+'</a>');
                            $('.more-nav-link').prev().show().empty().append(currentA);
                            $('.more-nav-list').find('#'+currentNav.tip).addClass('state-selected');
//                            if($('.more-nav-list').find('#tip-marketing').length == 0)
//                                $('.more-nav-list').append($('<li class="more-nav-item"><a href="#marketings/marketing" id="tip-marketing" class="tpl-nav-l" >市场</a></li>'));
                        }
                    }
                    if(currentNav.index >=7){
                        oaEl && oaEl.find('.tpl-nav-l').eq(6).addClass('tnavon state-active');
                    }else{
                        oaEl && oaEl.find('.tpl-nav-l').eq(currentNav.index-1).addClass('tnavon state-active');
                    }
                }
            };
            /**
             * 导航handler
             * @param tplPath
             * @param navName
             * @param crm       是否是crm    true
             * @returns {boolean}
             */
            var navTo = function (tplPath, navName, crm) {
                var fsVersion=FS.version.split('.');
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
                //有效算子加1
                validCounter++;
                if (list[navName] && list[navName].isCached) {
                    activeTpl(navName,list[navName].el, tplPath);
                    //关闭模板切换遮罩
                    subTplMaskEl.hide();
                    return;
                } else {
                    xhr = util.ajax({
                        "url": FS.TPL_PATH + '/' + tplPath+'?'+fsVersion[0]+'-'+fsVersion[3],
                        "type": "get",
                        "dataType": "html",
                        "success": function (result) {
                            var tplEl = $(result);
                            var tplName = tplEl.attr('tplname'),
                                tplPartPaths,   //定位模板路径
                                js = tplEl.attr('js'),
                                css = tplEl.attr('css'),
                                isCached = tplEl.attr('iscached'),
                                dataLighted = tplEl.attr('data-lighted');


                            //保存本次请求有效算子，用于在require.async回调中与validCounter比较，如果小于validCounter，则不在激活过期的模板页
                            var selfValidCounter=validCounter;

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

                            var crmNavObj = util.getNavRouterContants().crm,
                                href = crmNavObj[navName.split('-')[0]] && crmNavObj[navName.split('-')[0]].href;
//                            console.log(list)
                            if(href && href.substring(1)==navName.replace('-', '/')){
                                for(var prop in crmNavObj) {
                                    if(crmNavObj.hasOwnProperty(prop)){
//                                        console.log(prop)
                                        if(crmNavObj[prop].href != href) {
//                                            console.log(href + '-----------' + crmNavObj[prop].href)
                                            var pTemp = crmNavObj[prop].href.substr(1).replace('/', '-');
//                                            console.log(pTemp, list[pTemp])
                                            list[pTemp] && list[pTemp].el && (list[pTemp].el.remove());
                                            delete list[pTemp];
                                        }
                                    }
                                }
                            }
//                            console.log(list)
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
                                    if(selfValidCounter==validCounter){  //相等表示本次模板切换没有过期
                                        activeTpl(tplName,tplEl, tplPath);
                                        //关闭模板切换遮罩
                                        subTplMaskEl.hide();
                                    }
                                });
                            } else {
                                activeTpl(tplName,tplEl, tplPath);
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
            return function (tplNavSelector, crm) {
                var tplNavEl, ss = crm;
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
                    var isCrm;
                    if(crm){
                        isCrm = 'true'
                    }
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
                        navTo(tplPath, navName, isCrm);
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
            if(!title){
                title = " ";
            }
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
            var tmp = n + '',
            	arr = tmp.split('.'),
            	target = arr[1];
            if(target && target.length) {
            	var jiao = parseInt(target[0]);
            	if(jiao) {
            		s += (digit[jiao] + fraction[0]);
            	}
            	var fen = parseInt(target[1]);
            	if(fen) {
            		s += (digit[fen] + fraction[1]);
            	}
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
        /**
         * 获取文件类型
         * @param file
         * @param fullTest true表示进一步细分
         * @returns {string}
         */
        "getFileType": function (file,fullTest) {
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
            if(fullTest){
                if (/\.(?:png)$/.test(fileName)) {
                    fileType = "png";
                }else if (/\.(?:gif)$/.test(fileName)) {
                    fileType = "gif";
                }
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
            if(!obj){
                return obj;
            }
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
                        params[tempParam[0]] = decodeURI(param.substring(param.indexOf('-')+1, param.length));
                    });
                }
            }
            return params;
        },
        "getTplQueryParams2": function (href) {
            href = href||location.href;
            var query;
            if (href.indexOf('/=/') !== -1) {
                query = href.slice(href.indexOf('/=/') + 3);
                try{
                    return JSON.parse(decodeURIComponent(query.substring(query.indexOf('-')+1, query.length))) || undefined;
                }catch(ex){
                    return undefined
                }
            }else{
                return undefined;
            }
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
         * 取当前员工对象
         */
        "getCurrentEmp":(function(){
            var emp = undefined;
            if(FS.getAppStore('contactData'))
                emp = FS.getAppStore('contactData').currentMember;
            return function(){
                return emp;
            }
        })(),
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
                animateOpts = _.extend({
                    "easing": "swing",
                    "duration": 400
                },opts.animateOpts||{}),
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
                        newData.isAsterisk= itemData.isAsterisk;
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
                        newData.isAsterisk= itemData.isAsterisk;
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
                currentMember=contactData.currentMember||{};
                contactPersonData = contactData.members;
                contactGroupData = contactData.groups||[];
                //当前用户格式化
                if(currentMember.length>0){
                    currentMember.spell=currentMember.spell.toLowerCase()||'';
                }
                currentMember.type="p";
                currentMember.id=currentMember.employeeID;
                currentMember.groupIDs=currentMember.groupIDs||[];  //所属部门可能为空
                currentMember.functionPermissions=contactData.functionPermissions;  //登录用户权限
                currentMember.isAdmin=contactData.isAdmin;  //是否是管理员
                currentMember.enterpriseAccount=contactData.enterpriseAccount;  //企业帐号
                currentMember.account=contactData.account;  //个人帐号
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
        getCrmData:(function(){
            var store; //存储格式化完毕的数据
            return function(isCopy){  //isCopy==true表示获取一份新的数据拷贝，否则返回数据单体存储
                var crmData,
                    tempStore;
                if(!isCopy&&store){ //如果数据已经存在，直接返回，单例模式，减少内存空间使用
                    return store;
                }
                crmData = util.deepClone(FS.getAppStore('contactData'));
                tempStore={
                    "tags":crmData.tags,
                    "fBusinessTags":crmData.fBusinessTags,
                    "currentEmp":crmData.currentMember,
                    "functionPermissions":crmData.functionPermissions,
                    "isAllowExportData":crmData.isAllowExportData,
                    "isForbiddenCreateFCustomer":crmData.isForbiddenCreateFCustomer,
                    "isAllowDangerOperate":crmData.isAllowDangerOperate,
                    "isAllowSetOwnLeader":crmData.isAllowSetOwnLeader,
                    "leaderEmp":crmData.leaderEmp,
                    "myHighSeasResponse":crmData.myHighSeasResponse,
                    "salesStagesInUse":crmData.salesStagesInUse,
                    userDefineFieldInUse: crmData.userDefineFieldInUse
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
                allMembers=originContactData["allMembers"]||[];
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
         * 获取客户配置信息
         */
        getCustomerConfig: function(){
        	var enterpriseConfig=FS.enterpriseConfig||{},
	            personalConfig=enterpriseConfig[161]||"";
	        if(personalConfig.length>0){
	            personalConfig=json.parse(personalConfig);
	            return personalConfig;
	        }else{
	            return null;
	        }
        },
        /**
         * 设置客户配置信息
         */
        setCustomerConfig: function(value){
        	value = value.length ? value : '';
        	value = json.stringify(value);
        	util.api({
                "type":"post",
                "dataType":"json",
                "url":"/GlobalInfo/SetEnterpriseConfig",
                "data":{
                    "value":value,
                    "key":"161"
                }
            });
        	var enterpriseConfig=FS.enterpriseConfig||{};
            enterpriseConfig[161] = value;
        },
        /**
         * 获取客户配置信息
         */
        getContactsConfig: function(){
        	var enterpriseConfig=FS.enterpriseConfig||{},
	            personalConfig=enterpriseConfig[171]||"";
	        if(personalConfig.length>0){
	            personalConfig=json.parse(personalConfig);
	            return personalConfig;
	        }else{
	            return null;
	        }
        },
        /**
         * 设置客户配置信息
         */
        setContactsConfig: function(value){
        	value = value.length ? value : '';
        	value = json.stringify(value);
        	util.api({
                "type":"post",
                "dataType":"json",
                "url":"/GlobalInfo/SetEnterpriseConfig",
                "data":{
                    "value":value,
                    "key":171
                }
            });
        	var enterpriseConfig=FS.enterpriseConfig||{};
            enterpriseConfig[171] = value;
        },
        /**
         * 获取企业配置信息
         */
        fetchEnterpriseConfig:function(){
            var contactData = FS.getAppStore('contactData'),
                profiles={},
                enterpriseConfig;
            if(contactData){
                profiles=contactData.profiles||{};
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
                                            //                                        TODO 已支持三级导航高亮后期优化
//                                        =======================================
//                                            if(elEl[0].innerHTML == 'CRM'){
//                                                $('.hd-app-inner').hide();
//                                                $('.hd-crm-inner').show();
//                                            }else if(elEl[0].innerHTML == '工作管理'){
//                                                $('.hd-crm-inner').hide();
//                                                $('.hd-app-inner').show();
//                                            }
//                                            var lightNav = elEl.attr('lightnav');
//                                            if(lightNav){
//                                                lightNav=lightNav.split(',');
//                                                _.each(lightNav,function(navHref){
//                                                    _.each(store,function(config){
//                                                        var elEl=config.element,
//                                                            hlCls=config.hlCls,
//                                                            href=config.href;
//                                                        if(elEl.attr('notracenav')!=="true"){   //加入notracenav自定义属性的dom不会被点亮
//                                                            if(navHref==href){
//                                                                elEl.addClass(hlCls);
//                                                            }
//                                                        }
//                                                    });
//                                                });
//                                            }
//                                        =======================================
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
                case 5:
                	feedTypeName="销售记录";
                	break;
				case 2003:
                	feedTypeName="群通知";
                	break;               
				 default:
                    feedTypeName="未知";
                    break;
            }
            return feedTypeName;
        },
        /**
         * 根据feedType获取提醒type
         * @feedType feed类型
         */
        getRemindType: function(feedType){
        	var remindType;
            feedType=parseInt(feedType);
            switch(feedType){
                case 1:
                	remindType=2;
                    break;
                case 2:
                	remindType=3;
                    break;
                case 3:
                	remindType=4;
                    break;
                case 4:
                	remindType=5;
                    break;
                case 5:
                	remindType=6;
                	break;
				case 2003:
                	remindType=7;
                	break;                default:
                	remindType=1;
                    break;
            }
            return remindType;
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
                    smsRemindTypeName="按时提醒";
                    break;
                case 3:
                    smsRemindTypeName="提前5分钟提醒";
                    break;
                case 4:
                    smsRemindTypeName="提前15分钟提醒";
                    break;
                case 5:
                    smsRemindTypeName="提前30分钟提醒";
                    break;
                case 6:
                    smsRemindTypeName="提前1小时提醒";
                    break;
                case 7:
                    smsRemindTypeName="提前2小时提醒";
                    break;
                case 8:
                    smsRemindTypeName="提前6小时提醒";
                    break;
                case 9:
                    smsRemindTypeName="提前1天提醒";
                    break;
                case 10:
                    smsRemindTypeName="提前2天提醒";
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
         * @param withoutCircle 可选，是否忽略部门
         * @param without999999 可选，是否忽略全公司
         * @returns Array
         */
        getPublishRange:function(configTypeName,withoutCircle, without999999){
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
            if(!without999999){
	            myStore.push({
	                "id": 999999,
	                "value":currentUserData.allCompanyDefaultString,
	                "name":currentUserData.allCompanyDefaultString,   //提供selectBar.addItem直接使用
	                "type":"mix",
	                "validity":"no", //不进行有效性验证
	                "valueType":"g"  //获取选中值时的真实key，如果不设置则采用type设置
	            });
        	}
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
            if(withoutCircle){  //如果忽略部门，只取员工信息
                return [employeeAcInitData];
            }
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
         * 从content中获取at内容
         * @param content
         * @returns {*}
         */
        getAtFromContent: function (content) {
            var atStore;
            if (content.length > 0) {
                //atStore=v.match(/@[^@\s:：]+/g);
                atStore=content.match(/@[\u4e00-\u9fa5\w-]+/g); //匹配 @+汉字字母数字下划线中划线
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
         * @param type  1:详尽型,2:简单型,3:具体日期会滤掉时间部分
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
            }else if(type==2){  //第二种风格，简单型
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
            }else if(type==3){
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
                    return dateObj.format('MM月DD日');
                }
                return dateObj.format('YYYY年MM月DD日');
            }
        },
		getFileUrl: function (fileName, name, isAttachment) {
            var url = FS.API_PATH + '/df/get?id=' + fileName;
            if (isAttachment) {
                url += '&isAttachment=' + isAttachment;
                if (name) {
                    url += '&name=' + name;
                }
            }
            return url;
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
         * 获取外部上报人头像地址
         * @param path
         */
        getExternalLink:function(path){
            return path || FS.ASSETS_PATH+'/images/employee_default_120_120.png';
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
        }()),
        autoAdjustPos:(function(){
            var store=[];
            var coreFn=function(){
                var winScrollTop=$(root).scrollTop(),
                    prevWinScrollTop=$(this).data('prevWinScrollTop'),  //上一次的滚动top
                    winHeight=$(root).height();
                //过滤掉不在文档流中的dom
                store= _.filter(store,function(config){
                    return $.contains(document.body,config.element.get(0));
                });
                //采用相对定位控制滚动
                _.each(store,function(config){
                    var elEl=config.element,
                        offsetTop=config.offsetTop;
                    var elHeight=elEl.outerHeight(true);
                    var refTop=elEl.data('refTop')||offsetTop;  //相对参考top
                    if(elEl.is(':visible')){
                        if(winScrollTop>=offsetTop){
                            if(elHeight<=winHeight){  //element的高度不足window的高度，紧贴上边沿
                                elEl.css('top',(winScrollTop-offsetTop)+'px');
                                elEl.addClass('fixed-top');
                            }else{
                                if(winScrollTop>prevWinScrollTop){  //向下滚
                                    elEl.removeClass('fixed-top');
                                    if(refTop+elHeight-winHeight+30<winScrollTop){      //30px是补足值，防止element的高度值最大时滚动到最底部产生颤抖
                                        elEl.css('top',(winScrollTop-offsetTop-elHeight+winHeight)+'px');
                                        elEl.addClass('fixed-bottom');
                                    }else{
                                        elEl.removeClass('fixed-bottom');
                                        //elEl.data('refTop',offsetTop);
                                    }
                                }else if(winScrollTop<prevWinScrollTop){   //向上滚
                                    refTop=elEl.offset()["top"];
                                    elEl.data('refTop',refTop);
                                    elEl.removeClass('fixed-bottom');
                                    if(winScrollTop<=elEl.offset()["top"]&&winScrollTop>=offsetTop){
                                        elEl.css('top',(winScrollTop-offsetTop)+'px');
                                        elEl.addClass('fixed-top');
                                    }else{
                                        elEl.removeClass('fixed-top');
                                    }
                                }
                            }
                        }else{
                            elEl.css('top','0px');
                            elEl.removeClass('fixed-top');
                            elEl.removeClass('fixed-bottom');
                            elEl.data('refTop',offsetTop);
                        }
                    }
                });
                $(root).data('prevWinScrollTop',winScrollTop);
            };
            /**
             * 判断是否符合滚动条件
             */
            var isValidScroll=function(){
                var bodyEl=$('body'),
                    appWEl=$('#app-portal');
                if(bodyEl.width()<appWEl.width()){
                    return false;
                }
                return true;
            };
            /**
             * 清除滚动效果
             */
            var clearScrollEffect=function(){
                //采用相对定位控制滚动
                _.each(store,function(config){
                    var elEl=config.element;
                    elEl.css('top','0px');
                    elEl.removeClass('fixed-top');
                    elEl.removeClass('fixed-bottom');
                });
            };

            var tid;
            $(root).scroll(function(evt){
                if(isValidScroll()){
                    coreFn();
                }else{
                    clearScrollEffect();
                }
            }).resize(function(evt){
                clearTimeout(tid);
                tid=setTimeout(function(){
                    if(isValidScroll()){
                        coreFn();
                    }else{
                        clearScrollEffect();
                    }
                },600);
            });
            return function(elSelector){
                var elEl;
                if(elSelector===true){
                    coreFn();
                }else{
                    elEl=$(elSelector);
                    if(elEl.length>0){
                        elEl.css("position","relative");
                        var w = elEl.width();
                        if(w>0) {//防止display:none时被设为0
                        	elEl.width(elEl.width());   //显式设置宽度，防止fixed定位时布局错乱
                        }
                        store.push({
                            "element":elEl,
                            "offsetTop":elEl.offset()["top"]
                        });
                    }
                }
            };
        }()),
        /**
         * 初始化模拟select组件
         * @param boxSelector
         * @private
         */
        _mnInitSelect:function(boxSelector){
            var boxEl=$(boxSelector),
                listEl,
                titleEl,
                modelData,
                cpt,
                initValue=null,
                selectCls;
            if(boxEl.hasClass('mn-select-box')){
                listEl=$('.mn-select-list',boxEl);
                titleEl=$('.mn-select-title',boxEl);
                selectCls=boxEl.attr('select-cls')||'';
                boxEl.addClass(selectCls);
                //组织model数据
                modelData=[];
                $('.mn-select-item',listEl).each(function(){
                    var itemEl=$(this),
                        modelItemData;
                    modelItemData={
                        value:itemEl.data('value'),
                        text:itemEl.text()
                    };
                    if(itemEl.data('selected')){
                        modelItemData.selected=true;
                        initValue=modelItemData["value"];
                    }
                    if(itemEl.data('disabled')){
                        modelItemData.disabled=true;
                    }
                    modelData.push(modelItemData);
                });
                cpt=new Select({
                    trigger: titleEl,
                    model: modelData,
                    className:'mn-select-panel '+selectCls,
                    zIndex:10000    //保证层是最高的
                }).render();
                //清除模板dom
                $('.mn-select-list',boxEl).remove();
                //设置初始选中值
                boxEl.data('value',initValue);

                cpt.on('change', function(targetEl, prevEl) {
                    //更新value
                    boxEl.data('value',targetEl.data('value'));
                });
                //存储引用
                boxEl.data('cpt',cpt);
                return cpt;
            }
        },
        /**
         * 初始化表单模拟元素，包括checkbox/radio/select，注意select只支持单选
         * 获取模拟表单元素value
         */
        mnGetter:(function(){
            //表单模拟元素初始化，采用懒初始化方式
            //保证document ready后执行
            $(function(){
                $('body').on('click','.mn-checkbox-box',function(evt){  //复选框多选方式
                    var boxEl=$(this),
                        targetEl=$(evt.target),
                        vals=[],
                        defaultVal;
                    if(boxEl.hasClass('mn-disabled')){  //控制禁用状态
                        return;
                    }
                    if(_.isUndefined(boxEl.data('defaultValue'))){  //设置默认值
                        defaultVal=util.mnGetter(boxEl);
                        boxEl.data('defaultValue',defaultVal);
                    }
                    if(targetEl.hasClass('mn-checkbox-item')){
                        //反转选中
                        if(targetEl.hasClass('mn-selected')){
                            targetEl.removeClass('mn-selected');

                        }else{
                            targetEl.addClass('mn-selected');
                        }
                        //设置新的选中值
                        $('.mn-selected',boxEl).each(function(){
                            vals.push($(this).data('value'));
                        });
                        //util.mnSetter(boxEl,vals);
                        boxEl.data('value',vals);

                    }
                }).on('click','.mn-checkbox-box .label-for',function(evt){  //与label联动
                    var labelForEl=$(this),
                        boxEl=labelForEl.closest('.mn-checkbox-box'),
                        targetEl=$(evt.target);
                    if(boxEl.hasClass('mn-disabled')){  //控制禁用状态
                        return;
                    }
                    if(targetEl.is('label')){
                        //联动触发checkbox item的click事件
                        $('.mn-checkbox-item',labelForEl).click();
                    }
                }).on('click','.mn-radio-box',function(evt){    //单选方式
                    var boxEl=$(this),
                        targetEl=$(evt.target),
                        val,
                        defaultVal;
                    if(boxEl.hasClass('mn-disabled')){  //控制禁用状态
                        return;
                    }
                    if(_.isUndefined(boxEl.data('defaultValue'))){  //设置默认值
                        defaultVal=util.mnGetter(boxEl);
                        boxEl.data('defaultValue',defaultVal);
                    }
                    if(targetEl.hasClass('mn-radio-item')){
                        val=targetEl.data('value');
                        //清除其他选中，设置当前item选中样式
                        $('.mn-radio-item',boxEl).removeClass('mn-selected');
                        targetEl.addClass('mn-selected');
                        //设置新的选中值
                        boxEl.data('value',val);
                        //util.mnSetter(boxEl,val);
                    }
                }).on('click','.mn-radio-box .label-for',function(evt){   //与label联动
                    var labelForEl=$(this),
                        boxEl=labelForEl.closest('.mn-radio-box'),
                        targetEl=$(evt.target);
                    if(boxEl.hasClass('mn-disabled')){  //控制禁用状态
                        return;
                    }
                    if(targetEl.is('label')){
                        //联动触发radio item的click事件
                        $('.mn-radio-item',labelForEl).click();
                    }
                }).on('click','.mn-select-box',function(evt){
                    var boxEl=$(this),
                        targetEl=$(evt.target),
                        cpt=boxEl.data('cpt'),
                        defaultVal;
                    if(boxEl.hasClass('mn-disabled')){  //控制禁用状态
                        return;
                    }
                    if(_.isUndefined(boxEl.data('defaultValue'))){  //设置默认值
                        defaultVal=util.mnGetter(boxEl);
                        boxEl.data('defaultValue',defaultVal);
                    }
                    if(targetEl.hasClass('mn-select-title')){
                        if(!cpt){   //第一次点击，初始化select
                            //初始化select
                            cpt=util._mnInitSelect(boxEl);
                            //直接显示
                            cpt.show();
                        }
                    }
                });

            });
            //实际获取表单模拟元素value
            return function(boxSelector){
                var boxEl=$(boxSelector),
                    val,
                    cpt;
                if(boxEl.hasClass('mn-checkbox-box')){  //复选框
                    val=boxEl.data('value');
                    if(_.isUndefined(val)){  //未进行初始化，主动找
                        val=[];
                        $('.mn-selected',boxEl).each(function(){
                            val.push($(this).data('value'));
                        });
                    }


                }else if(boxEl.hasClass('mn-radio-box')){
                    val=boxEl.data('value');
                    if(_.isUndefined(val)){  //未进行初始化，主动找
                        val=null;
                        $('.mn-selected',boxEl).each(function(){
                            val=$(this).data('value');
                            return false;
                        });
                    }
                }else if(boxEl.hasClass('mn-select-box')){
                    cpt=boxEl.data('cpt');
                    val=boxEl.data('value');
                    if(_.isUndefined(cpt)){  //未进行初始化，主动找
                        val=null;
                        $('.mn-select-item',boxEl).each(function(){
                            var meEl=$(this);
                            if(meEl.data('selected')){
                                val=meEl.data('value');
                                return false;
                            }
                        });
                    }
                }
                return val;
            };
        }()),
        /**
         * 设置模拟表单值
         * @param boxSelector
         * @param val
         */
        mnSetter:function(boxSelector,val){
            var boxEl=$(boxSelector),
                cpt,
                defaultVal;   //默认初始值
            if(_.isUndefined(boxEl.data('defaultValue'))){  //设置默认值
                defaultVal=util.mnGetter(boxSelector);
                boxEl.data('defaultValue',defaultVal);
            }
            if(boxEl.hasClass('mn-checkbox-box')){  //复选框
                val=[].concat(val);
                //先全清选中
                $('.mn-selected',boxEl).removeClass('mn-selected');
                //选中指定item
                _.each(val,function(itemVal){
                    $('.mn-checkbox-item',boxEl).each(function(){
                        var itemEl=$(this);
                        if(itemEl.data('value')==itemVal){
                            itemEl.addClass('mn-selected');
                            return false;
                        }
                    });
                });
                //设置value
                boxEl.data('value',val);
            }else if(boxEl.hasClass('mn-radio-box')){
                //先全清选中
                $('.mn-selected',boxEl).removeClass('mn-selected');
                //选中指定item
                $('.mn-radio-item',boxEl).each(function(){
                    var itemEl=$(this);
                    if(itemEl.data('value')==val){
                        itemEl.addClass('mn-selected');
                        return false;
                    }
                });
                //设置value
                boxEl.data('value',val);
            }else if(boxEl.hasClass('mn-select-box')){
                cpt=boxEl.data('cpt');
                //清除默认显示值
//                $('.mn-select-title',boxEl).empty();
                if(_.isUndefined(cpt)){  //未进行初始化，调整选中item
                    $('.mn-select-item',boxEl).each(function(){
                        var itemEl=$(this);
                        //先清选中
                        itemEl.data('selected',false);
                        if(itemEl.data('value')==val){
                            itemEl.data('selected',true);
                            boxEl.find('.mn-select-title').text(itemEl.text())
                        }
                    });
                }else{
                    cpt.options.each(function(i){
                        var itemEl=$(this);
                        if(itemEl.data('value')==val){
                            cpt.select(i);
                        }
                    });
                }
                //设置value
                boxEl.data('value',val);
            }
        },
        /**
         * 禁用模拟表单
         * @param boxSelector
         */
        mnDisable:function(boxSelector){
            var boxEl=$(boxSelector),
                cpt;
            boxEl.addClass('mn-disabled');
            if(boxEl.hasClass('mn-checkbox-box')){  //复选框
                boxEl.addClass('mn-disabled-checkbox-box');
            }else if(boxEl.hasClass('mn-radio-box')){
                boxEl.addClass('mn-disabled-radio-box');
            }else if(boxEl.hasClass('mn-select-box')){
                boxEl.addClass('mn-disabled-select-box');
                cpt=boxEl.data('cpt');
                cpt&&cpt.set('disabled',true);
            }
        },
        /**
         * 开启模拟表单
         * @param boxSelector
         */
        mnEnable:function(boxSelector){
            var boxEl=$(boxSelector),
                cpt;
            boxEl.removeClass('mn-disabled');
            if(boxEl.hasClass('mn-checkbox-box')){  //复选框
                boxEl.removeClass('mn-disabled-checkbox-box');
            }else if(boxEl.hasClass('mn-radio-box')){
                boxEl.removeClass('mn-disabled-radio-box');
            }else if(boxEl.hasClass('mn-select-box')){
                boxEl.removeClass('mn-disabled-select-box');
                cpt=boxEl.data('cpt');
                cpt&&cpt.set('disabled',false);
            }
        },
        /**
         * 重置表单元素
         * @param boxSelector
         */
        mnReset:function(boxSelector){
            var boxEl=$(boxSelector),
                defaultVal=boxEl.data('defaultValue');
            if(!_.isUndefined(defaultVal)){  //不处理第一次调用
                util.mnSetter(boxEl,defaultVal);
            }
        },
        /**
         * 模拟select扩展方法,暴露aralejs select组件方法
         * @param boxSelector
         * @param methodName 方法名
         * @param methodValue 方法值
         */
        mnSelect:function(boxSelector,methodName,methodValue){
            var boxEl=$(boxSelector),
                cpt=boxEl.data('cpt'),
                result,
                val;
            if(boxEl.hasClass('mn-select-box')){
                if(!cpt){
                    //初始化select
                    cpt=util._mnInitSelect(boxEl);
                }
                val=util.mnGetter(boxEl);
                result=cpt[methodName](methodValue);
                if(methodName=="addOption"||methodName=="removeOption"){    //patch:重设选中值
                    util.mnSetter(boxEl,val);
                }
                return result;
            }
        },
        /**
         * 清除select
         */
        mnDestroy: function(boxSelector) {
        	var boxEl=$(boxSelector),
            	cpt=boxEl.data('cpt');
        	cpt && (cpt.destroy());
        },
        /**
         * 绑定模拟表单组件事件
         * @param boxSelector
         * @param eventName
         * @param callback
         */
        mnEvent:function(boxSelector,eventName,callback){
            var boxEl=$(boxSelector),
                cpt;
            if(boxEl.hasClass('mn-checkbox-box')){  //复选框
                if(eventName=="change"){
                    boxEl.on('click','.mn-checkbox-item',function(evt){
                        var itemEl=$(this),
                            currentValue=util.mnGetter(boxEl);
                        callback.call(itemEl,currentValue);

                    });
                }
            }else if(boxEl.hasClass('mn-radio-box')){
                if(eventName=="change"){
                    boxEl.on('click','.mn-checkbox-item',function(evt){
                        var itemEl=$(this),
                            currentValue=util.mnGetter(boxEl);
                        callback.call(itemEl,currentValue);
                    });
                }

            }else if(boxEl.hasClass('mn-select-box')){
                cpt=boxEl.data('cpt');
                if(!cpt){
                    //初始化select
                    cpt=util._mnInitSelect(boxEl);
                }
                if(eventName=="change"){
                    cpt.on('change',function(targetEl, prevEl) {
                        callback.call(cpt,targetEl.data('value'),targetEl.text());
                    });
                }
            }
        },
        /**
         * 仅支持select change事件
         * @param boxSelector
         * @param eventName
         * @param callback
         */
        mnOffEvent:function(boxSelector,eventName,callback){
            var boxEl=$(boxSelector),
                cpt;
            if(boxEl.hasClass('mn-checkbox-box')){  //复选框
//                if(eventName=="change"){
//                    boxEl.on('click','.mn-checkbox-item',function(evt){
//                        var itemEl=$(this),
//                            currentValue=util.mnGetter(boxEl);
//                        callback.call(itemEl,currentValue);
//
//                    });
//                }
            }else if(boxEl.hasClass('mn-radio-box')){
//                if(eventName=="change"){
//                    boxEl.on('click','.mn-checkbox-item',function(evt){
//                        var itemEl=$(this),
//                            currentValue=util.mnGetter(boxEl);
//                        callback.call(itemEl,currentValue);
//                    });
//                }

            }else if(boxEl.hasClass('mn-select-box')){
                cpt=boxEl.data('cpt');
                if(!cpt){
                    //初始化select
                    cpt=util._mnInitSelect(boxEl);
                }
                if(eventName=="change"){
                    cpt.off('change');
                }
            }
        },
        /**
         * 显示全局loading加载符
         * @param loadingType  加载符类型
         * @param initOpts 配置项
         */
        showGlobalLoading:function(loadingType,initOpts,defaultText){
            loadingType=loadingType||1;
            defaultText=defaultText||'正在加载...';
            var loading=Widget.query('.global-loading-'+loadingType);
            if(!loading){
                loading=new Overlay(_.extend({
                    //className: 'global-loading-'+loadingType,
                    template:'<div class="global-loading-'+loadingType+'">'+defaultText+'</div>',
                    width: 236,
                    zIndex:1101,
                    align: {
                        selfXY: ["center", 0],     // element 的定位点，默认为左上角
                        baseXY: ["center", 96]
                    }
                },initOpts||{}));
            }
            loading.show();
        },
        /**
         * 隐藏全局loadding加载符
         * @param loadingType
         */
        hideGlobalLoading:function(loadingType){
            loadingType=loadingType||1;
            var loading=Widget.query('.global-loading-'+loadingType);
            loading&&loading.hide();
        },

        /**
         * 提示框
         * @param remindType 1 为黄色背景提示框；2 为白色背景提示框
         * @param remindText 提示信息
         */

        remind:function(remindType,remindText){
            var type = remindType || 1;
            var text = remindText || "保存成功";
            if(type == 1){
                var remind1 = $(".global-remind-1");
                if(remind1.length < 1){
                    $("body").append("<div class = 'global-remind-1'>"+text+"</div>");
                }else{
                    remind1.text(text);
                    remind1.show();
                }
                setTimeout(function(){
                    $(".global-remind-1").hide();
                },1000);
            }
            if(type == 2){
                var remind2 = Widget.query(".global-remind-2");
                if(!remind2){
                    remind2 = new Dialog({
                        template:"<div class = 'global-remind-2'>"+text+"</div>",
                        hasMask :false,
                        width :"auto",
                        zIndex:1101
                    });
                    $("body").append("<div class = 'global-remind-mask'></div>");
                }else{
                    $(".global-remind-2").text(text);
                }
                $(".global-remind-mask").show();
                remind2.show();
                setTimeout(function(){
                    remind2.hide();
                    $(".global-remind-mask").hide();
                },1000);
            }
        },

        showMask:function(){
            var mask = $(".global-mask");
            if(mask.length < 1){
                $("body").append("<div class = 'global-mask'></div>");
            }
            mask.show();
        },

        hideMask:function(){
            var mask = $(".global-mask");
            if(mask.length < 1){
                return;
            }
            mask.hide();
        },

        /**
         * 当前用户是否为crm管理员
         * @returns {boolean}
         */
        isCrmAdmin: function(){
            var isCrmAdmin = false;
            var perm = FS.getAppStore('contactData').functionPermissions;
            _.map(perm, function(obj){
                if(obj.value == 31)
                    isCrmAdmin = true;
            });
            return isCrmAdmin;
        },

        /**
         * 常量集合
         */
        CONSTANT: {
            //1、客户；2、联系人；3、事件；4、销售机会；5、产品；6、竞争对手；7、合同；8、市场活动；9、销售线索；
            TAG_TYPE: {
                CUSTOMER: 1,
                CONTACTS: 2,
                EVENT: 3,
                SALES_OPP: 4,
                PRODUCT: 5,
                COMPETITOR: 6,
                CONTRACT: 7,
                MARKETING: 8,
                SALES_CLUE: 9
            },
            SYS_TAG_TYPE: {
                CustomerState: 101,//客户状态
                RoleRelation: 102,//角色关系
                SalesAction: 103,//销售动作
                SalesOpportunitySource: 104,//机会来源
                SalesOpportunityType: 105,//机会类型
                CompetitorScale: 106,//竞争对手规模
                ContractType: 107,//合同类型
                MarketingEventType: 108,//活动类型
                SalesClueSource: 109,//线索来源
                ProductLine: 110,//产品线
                Competitiveness: 111//竞争力
            }
        },
        /**
         *
         * @param tagType
         */
        getTagsByType: function(tagType){
            var fBusinessTags = this.getCrmData().fBusinessTags;
            var retTags = [];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === tagType) {
                    retTags.push(fBusinessTag);
                }
            });
            return retTags;
        },
        /**
         *
         * @param tagType 1.客户 2.联系人 3.机会
         * @returns {Array}
         */
        getUserDefineFieldByType: function(tagType){
            var fBusinessTags = this.getCrmData().userDefineFieldInUse;
            var retTags = [];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === tagType) {
                    retTags.push(fBusinessTag);
                }
            });
            return retTags;
        },
        /**
         * 返回导航对象数组
         * @returns {{crmNav: string[], oaNav: string[]}}
         */
        getNavRouterContants: function(){
            return {
                crm: {
                    customers:{index: 1, text: '客户', tip: 'tip-product', href: '#customers/home'},
                    contacts:{index: 2, text: '联系人', tip: 'tip-contact', href: '#contacts/contact'},
                    opportunities:{index: 3, text: '机会', tip: 'tip-opportunitie', href: '#opportunities/salesopportunity'},
                    contracts:{index: 4, text: '合同', tip: 'tip-contract', href: '#contracts/contract'},
                    salesperformances:{index: 5, text: '仪表盘', tip: 'tip-salesperformance', href: '#salesperformances/salesperformance'},
                    salestargets:{index: 6, text: '预测', tip: 'tip-salestarget', href: '#salestargets/salestarget'},
                    crmsettings:{index: 7, text: '设置', tip: 'tip-crmsetting', href: '#crmsettings/leaderssetting'},
                    marketings:{index: 8, text: '市场', tip: 'tip-marketing', href: '#marketings/marketing'},
                    salesclues:{index: 9, text: '线索', tip: 'tip-salesclue', href: '#salesclues/salesclue'},
                    competitors:{index: 10, text: '对手', tip: 'tip-competitor', href: '#competitors/competitor'},
                    products:{index: 11, text: '产品', tip: 'tip-product', href: '#products/product'}
                },
                oa: ['stream', 'plan', 'work', 'approve', 'locations', 'attach', 'entnetworkdisk'],
				app: ['workmessage', 'reportdata'],
                other: ['profile', 'circles','shortmessage', 'settings']
            }
        },
        /**
         * 联系人联系方式
         * @returns {*[]}
         */
        getContactsWays: function(){
            return [{value: 1, text: '电话'},{value: 2, text: '手机'},{value: 3, text: '电子邮件'},{value: 4, text: '传真'},
                {value: 5, text: '新浪微博'},{value: 6, text: '腾讯微博'},{value: 7, text: '微信'},{value: 8, text: 'QQ'},{value: 9, text: 'MSN'}]
        },
        /**
         * 合同-付款方式
         * @returns {Array}
         */
        getPayWays: function(){
            return [{value: 1, text: '支票'},{value: 2, text: '现金'},{value: 3, text: '邮政汇款'},
                {value: 4, text: '电汇'},{value: 5, text: '网上转账'},{value: 6, text: '其他'}];
        },
        /**
         * 联系人来源
         */
        C_CONTACT_SOURCE: {

        },
        /**
         * crm表格排序配置
         * by liuxiaofan
         */
        crmTableSortSet: function (opts) {
            opts = $.extend({
                element: null, //排序下拉框元素
                meEl: null,//触发点击事件的元素
                selectData: [//下拉框选项数据
                    {
                        "text": "发生变化的在最前面",
                        "value": "0"
                    },
                    {
                        "text": "按名称排序",
                        "value": "2"
                    },
                    {
                        "text": "表格列排序",
                        "value": "",
                        selected: true
                    }
                ],
                oThs: null,//列对象
                callback: function (data) {
                }
            }, opts || {});
            if (opts.oThs) {
                if (opts.meEl.is('.sorting')) {
                    opts.meEl.siblings().removeClass('sorting_asc').removeClass('sorting_desc');
                    _.each(opts.oThs, function (oTh) {
                        var thName = oTh.clasName;
                        var sortType = oTh.sortType;
                        if (opts.meEl.is(thName)) {
                            if (opts.meEl.is('.sorting_asc')) {//升序
                                opts.callback({ sortType: sortType[0] });
                                opts.meEl.removeClass('sorting_asc').addClass('sorting_desc');
                            } else {
                                opts.callback({ sortType: sortType[1] });
                                opts.meEl.removeClass('sorting_desc').addClass('sorting_asc');
                            }
                            util.mnSelect(opts.element, 'syncModel', opts.selectData);
                        }
                    });
                }

            }
        },
        /**
         * 列表title名称补全
         */
        addListTitle:function(listTitText,addStr,num){
            var subStr = listTitText.substring(listTitText.length - num);
            if (subStr != addStr) {
                return addStr;
            } else {
                return '';
            }
        },
        disableCrmBtn: function($btn){
            $btn.attr('disabled', true).css({'opacity': '.5','cursor': 'default'});
        },
        enableCrmBtn: function($btn){
            $btn.removeAttr('disabled').css({'opacity': '1','cursor': 'pointer'});
        },
        /**
         * 自定义字段表单事件处理
         * @param $el
         * @param numOrText
         */
        bindDefineFieldInput: function($el, numOrText){
        	var timer1 = null,
        		timer2 = null;
            if(numOrText == 'num'){
                $el.on('input propertychange', function(e){
                    timer1 && clearTimeout(timer1);
                    timer1 = null;
                    timer1 =setTimeout(function(){
                    	var val = $(e.target).val();
                        val = val.substring(0, 15);
                        var hasDot = val.length>0?(val.indexOf('.') == val.length-1) : false;
                        var val2 = parseFloat(val);
                        if(isNaN(val2)){
                            $(e.target).val('');
                        }else{
                            $(e.target).val(hasDot ? val2+'.':val2);
                        }
                    }, 10);
                });
            }else if(numOrText == 'text'){
                $el.on('input propertychange', function(e){
                	timer2 && clearTimeout(timer2);
                    timer2 = null;
                    timer2 = setTimeout(function(){
                    	var val = $(e.target).val();
                    }, 10);
                });
            }
        },

        /**
         *
         */
        generateDefineField: function(fieldUl, defineFields, DateSelect){
            fieldUl.html('');
            var defineDateFieldArray = [];
            _.each(defineFields, function(field){
                if(field.fieldType == 2){
                    var liTemp = $('<li class="fn-clear"> <div class="selects-tit inputs-tit f-user-define-field-id" data-id="'
                        + field.userDefineFieldID + '"> ' + field.fieldDescription + ' </div><div class="input-warp date-wrapper"></div></li>');
                    fieldUl.append(liTemp);
                    var dateTemp = new DateSelect({
                        "element": liTemp.find('.date-wrapper'),
                        "placeholder": "选择日期",
                        "formatStr": "YYYY年MM月DD日（dddd）",
                        "isCRM":true
                    });
                    defineDateFieldArray.push({
                        fieldName: field.fieldName,
                        dateObj: dateTemp
                    })
                }else if(field.fieldType == 1){
                    var liTemp = $('<li class="fn-clear"> <div class="selects-tit inputs-tit f-user-define-field-text" data-id="'
                        + field.userDefineFieldID + '" data-fieldname="'+field.fieldName+'"> ' + field.fieldDescription +
                        ' </div><div class="inputs-warp"><textarea class="area-auto-height textarea-h19" placeholder="请填写'+field.fieldDescription +'"></textarea></div> </li>');

                    fieldUl.append(liTemp);
                    util.bindDefineFieldInput(liTemp.find('input'), 'text');
                }else if(field.fieldType == 3){
                    var liTemp = $('<li class="fn-clear"> <div class="selects-tit inputs-tit f-user-define-field-num" data-id="'
                        + field.userDefineFieldID + '" data-fieldname="'+field.fieldName+'"> ' + field.fieldDescription +
                        ' </div><div class="inputs-warp"><input class="dialog-input-text " placeholder="请填写'+field.fieldDescription +'"></div> </li>');
                    fieldUl.append(liTemp);
                    util.bindDefineFieldInput(liTemp.find('input').val(0), 'num');
                }
            });
            return defineDateFieldArray;

        },
        /**
         * 表单字段正侧验证
         */
        check: {
            //验证正则表达式
            _reg: {
                phoneReg: /^1[0-9]{10}$/,    //手机正则
                mailReg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9_-]+$/, //邮箱正则
                passwordReg: /^[a-zA-Z0-9]{6,10}$/							 //密码正则
            },
            checkPhone: function (str) {
                return this._reg.phoneReg.test(str);
            },
            checkMail: function (str) {
                return this._reg.mailReg.test(str);
            },
            checkPassword: function (str) {
                return this._reg.passwordReg.test(str);
            }
        },
       
        /**
         * @title 算剩余时间
         * @param 根据选日期组件返回的开始时间和结束时间计算相差多少个小时，精确到0.5小时。
         * @returns 如果结果为负数或者0返回空字符串
         * @author liuxf
         */
        countTime: function (startDate, startTime, endDate, endTime) {
            if(!startDate.getValue()){
                return ''
            }
            var sDate = moment(startDate.getValue() + " " + startTime.getValue(), 'YYYYMMDD HH:mm');
            var eDate = moment(endDate.getValue() + " " + endTime.getValue(), 'YYYYMMDD HH:mm');
            var diffValue = parseInt(eDate.diff(sDate, 'minute'));
            var forHour = diffValue / 60;

            if (forHour > 0) {
                return forHour;
            } else {
                return '';
            }
        },
        /**
         * 根据url query生成对应json
         * @param query
         * @returns {{}}
         */
        queryToJson: function (query) {
            var r = {}, t = query.split('&');
            for (var i = 0; i < t.length; i++) {
                if (t[i]) {
                    var _t = t[i].split('=');
                    if (_t.length >= 1) {
                        r[_t[0]] = _t[1] || null;
                    }
                }
            }

            return r;
        },
        /**
         * emoji表情
         */
        emoji :(function(){
            var // _reg = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g,
                _reg = /\u2049\uFE0F|\u2049|\u2122|\u2139\uFE0F|\u2139|\u2194\uFE0F|\u2194|\u2195\uFE0F|\u2195|\u2196\uFE0F|\u2196|\u2197\uFE0F|\u2197|\u2198\uFE0F|\u2198|\u2199\uFE0F|\u2199|\u2600\uFE0F|\u2600|\u2601\uFE0F|\u2601|\u2611\uFE0F|\u2611|\u2614\uFE0F|\u2614|\u2615\uFE0F|\u2615|\u2648\uFE0F|\u2648|\u2649\uFE0F|\u2649|\u2650\uFE0F|\u2650|\u2651\uFE0F|\u2651|\u2652\uFE0F|\u2652|\u2653\uFE0F|\u2653|\u2660\uFE0F|\u2660|\u2663\uFE0F|\u2663|\u2665\uFE0F|\u2665|\u2666\uFE0F|\u2666|\u2668\uFE0F|\u2668|\u2693\uFE0F|\u2693|\u2702\uFE0F|\u2702|\u2705|\u2708\uFE0F|\u2708|\u2709\uFE0F|\u2709|\u2712\uFE0F|\u2712|\u2714\uFE0F|\u2714|\u2716\uFE0F|\u2716|\u2728|\u2733\uFE0F|\u2733|\u2734\uFE0F|\u2734|\u2744\uFE0F|\u2744|\u2747\uFE0F|\u2747|\u2753|\u2754|\u2755|\u2757\uFE0F|\u2757|\u2764\uFE0F|\u2764|\u2795|\u2796|\u2797|\u2934\uFE0F|\u2934|\u2935\uFE0F|\u2935|\u3030|\u3297\uFE0F|\u3297|\u3299\uFE0F|\u3299|\u00A9|\u00AE|\u203C\uFE0F|\u203C|\u21A9\uFE0F|\u21A9|\u21AA\uFE0F|\u21AA|\u231A\uFE0F|\u231A|\u231B\uFE0F|\u231B|\u23E9|\u23EA|\u23EB|\u23EC|\u23F0|\u23F3|\u24C2\uFE0F|\u24C2|\u25AA\uFE0F|\u25AA|\u25AB\uFE0F|\u25AB|\u25B6\uFE0F|\u25B6|\u25C0\uFE0F|\u25C0|\u25FB\uFE0F|\u25FB|\u25FC\uFE0F|\u25FC|\u25FD\uFE0F|\u25FD|\u25FE\uFE0F|\u25FE|\u260E\uFE0F|\u260E|\u261D\uFE0F|\u261D|\u263A\uFE0F|\u263A|\u264A\uFE0F|\u264A|\u264B\uFE0F|\u264B|\u264C\uFE0F|\u264C|\u264D\uFE0F|\u264D|\u264E\uFE0F|\u264E|\u264F\uFE0F|\u264F|\u267B\uFE0F|\u267B|\u267F\uFE0F|\u267F|\u26A0\uFE0F|\u26A0|\u26A1\uFE0F|\u26A1|\u26AA\uFE0F|\u26AA|\u26AB\uFE0F|\u26AB|\u26BD\uFE0F|\u26BD|\u26BE\uFE0F|\u26BE|\u26C4\uFE0F|\u26C4|\u26C5\uFE0F|\u26C5|\u26CE|\u26D4\uFE0F|\u26D4|\u26EA\uFE0F|\u26EA|\u26F2\uFE0F|\u26F2|\u26F3\uFE0F|\u26F3|\u26F5\uFE0F|\u26F5|\u26FA\uFE0F|\u26FA|\u26FD\uFE0F|\u26FD|\u270A|\u270B|\u270C\uFE0F|\u270C|\u270F\uFE0F|\u270F|\u274C|\u274E|\u27A1\uFE0F|\u27A1|\u27B0|\u27BF|\u2B05\uFE0F|\u2B05|\u2B06\uFE0F|\u2B06|\u2B07\uFE0F|\u2B07|\u2B1B\uFE0F|\u2B1B|\u2B1C\uFE0F|\u2B1C|\u2B50\uFE0F|\u2B50|\u2B55\uFE0F|\u2B55|\u303D\uFE0F|\u303D|\uD83C\uDC04\uFE0F|\uD83C\uDC04|\uD83C\uDCCF|\uD83C\uDD70|\uD83C\uDD71|\uD83C\uDD7E|\uD83C\uDD7F\uFE0F|\uD83C\uDD7F|\uD83C\uDD8E|\uD83C\uDD91|\uD83C\uDD92|\uD83C\uDD93|\uD83C\uDD94|\uD83C\uDD95|\uD83C\uDD96|\uD83C\uDD97|\uD83C\uDD98|\uD83C\uDD99|\uD83C\uDD9A|\uD83C\uDE01|\uD83C\uDE02|\uD83C\uDE1A\uFE0F|\uD83C\uDE1A|\uD83C\uDE2F\uFE0F|\uD83C\uDE2F|\uD83C\uDE32|\uD83C\uDE33|\uD83C\uDE34|\uD83C\uDE35|\uD83C\uDE36|\uD83C\uDE37|\uD83C\uDE38|\uD83C\uDE39|\uD83C\uDE3A|\uD83C\uDE50|\uD83C\uDE51|\uD83C\uDF00|\uD83C\uDF01|\uD83C\uDF02|\uD83C\uDF03|\uD83C\uDF04|\uD83C\uDF05|\uD83C\uDF06|\uD83C\uDF07|\uD83C\uDF08|\uD83C\uDF09|\uD83C\uDF0A|\uD83C\uDF0B|\uD83C\uDF0C|\uD83C\uDF0D|\uD83C\uDF0E|\uD83C\uDF0F|\uD83C\uDF10|\uD83C\uDF11|\uD83C\uDF12|\uD83C\uDF13|\uD83C\uDF14|\uD83C\uDF15|\uD83C\uDF16|\uD83C\uDF17|\uD83C\uDF18|\uD83C\uDF19|\uD83C\uDF1A|\uD83C\uDF1B|\uD83C\uDF1C|\uD83C\uDF1D|\uD83C\uDF1E|\uD83C\uDF1F|\uD83C\uDF20|\uD83C\uDF30|\uD83C\uDF31|\uD83C\uDF32|\uD83C\uDF33|\uD83C\uDF34|\uD83C\uDF35|\uD83C\uDF37|\uD83C\uDF38|\uD83C\uDF39|\uD83C\uDF3A|\uD83C\uDF3B|\uD83C\uDF3C|\uD83C\uDF3D|\uD83C\uDF3E|\uD83C\uDF3F|\uD83C\uDF40|\uD83C\uDF41|\uD83C\uDF42|\uD83C\uDF43|\uD83C\uDF44|\uD83C\uDF45|\uD83C\uDF46|\uD83C\uDF47|\uD83C\uDF48|\uD83C\uDF49|\uD83C\uDF4A|\uD83C\uDF4B|\uD83C\uDF4C|\uD83C\uDF4D|\uD83C\uDF4E|\uD83C\uDF4F|\uD83C\uDF50|\uD83C\uDF51|\uD83C\uDF52|\uD83C\uDF53|\uD83C\uDF54|\uD83C\uDF55|\uD83C\uDF56|\uD83C\uDF57|\uD83C\uDF58|\uD83C\uDF59|\uD83C\uDF5A|\uD83C\uDF5B|\uD83C\uDF5C|\uD83C\uDF5D|\uD83C\uDF5E|\uD83C\uDF5F|\uD83C\uDF60|\uD83C\uDF61|\uD83C\uDF62|\uD83C\uDF63|\uD83C\uDF64|\uD83C\uDF65|\uD83C\uDF66|\uD83C\uDF67|\uD83C\uDF68|\uD83C\uDF69|\uD83C\uDF6A|\uD83C\uDF6B|\uD83C\uDF6C|\uD83C\uDF6D|\uD83C\uDF6E|\uD83C\uDF6F|\uD83C\uDF70|\uD83C\uDF71|\uD83C\uDF72|\uD83C\uDF73|\uD83C\uDF74|\uD83C\uDF75|\uD83C\uDF76|\uD83C\uDF77|\uD83C\uDF78|\uD83C\uDF79|\uD83C\uDF7A|\uD83C\uDF7B|\uD83C\uDF7C|\uD83C\uDF80|\uD83C\uDF81|\uD83C\uDF82|\uD83C\uDF83|\uD83C\uDF84|\uD83C\uDF85|\uD83C\uDF86|\uD83C\uDF87|\uD83C\uDF88|\uD83C\uDF89|\uD83C\uDF8A|\uD83C\uDF8B|\uD83C\uDF8C|\uD83C\uDF8D|\uD83C\uDF8E|\uD83C\uDF8F|\uD83C\uDF90|\uD83C\uDF91|\uD83C\uDF92|\uD83C\uDF93|\uD83C\uDFA0|\uD83C\uDFA1|\uD83C\uDFA2|\uD83C\uDFA3|\uD83C\uDFA4|\uD83C\uDFA5|\uD83C\uDFA6|\uD83C\uDFA7|\uD83C\uDFA8|\uD83C\uDFA9|\uD83C\uDFAA|\uD83C\uDFAB|\uD83C\uDFAC|\uD83C\uDFAD|\uD83C\uDFAE|\uD83C\uDFAF|\uD83C\uDFB0|\uD83C\uDFB1|\uD83C\uDFB2|\uD83C\uDFB3|\uD83C\uDFB4|\uD83C\uDFB5|\uD83C\uDFB6|\uD83C\uDFB7|\uD83C\uDFB8|\uD83C\uDFB9|\uD83C\uDFBA|\uD83C\uDFBB|\uD83C\uDFBC|\uD83C\uDFBD|\uD83C\uDFBE|\uD83C\uDFBF|\uD83C\uDFC0|\uD83C\uDFC1|\uD83C\uDFC2|\uD83C\uDFC3|\uD83C\uDFC4|\uD83C\uDFC6|\uD83C\uDFC7|\uD83C\uDFC8|\uD83C\uDFC9|\uD83C\uDFCA|\uD83C\uDFE0|\uD83C\uDFE1|\uD83C\uDFE2|\uD83C\uDFE3|\uD83C\uDFE4|\uD83C\uDFE5|\uD83C\uDFE6|\uD83C\uDFE7|\uD83C\uDFE8|\uD83C\uDFE9|\uD83C\uDFEA|\uD83C\uDFEB|\uD83C\uDFEC|\uD83C\uDFED|\uD83C\uDFEE|\uD83C\uDFEF|\uD83C\uDFF0|\uD83D\uDC00|\uD83D\uDC01|\uD83D\uDC02|\uD83D\uDC03|\uD83D\uDC04|\uD83D\uDC05|\uD83D\uDC06|\uD83D\uDC07|\uD83D\uDC08|\uD83D\uDC09|\uD83D\uDC0A|\uD83D\uDC0B|\uD83D\uDC0C|\uD83D\uDC0D|\uD83D\uDC0E|\uD83D\uDC0F|\uD83D\uDC10|\uD83D\uDC11|\uD83D\uDC12|\uD83D\uDC13|\uD83D\uDC14|\uD83D\uDC15|\uD83D\uDC16|\uD83D\uDC17|\uD83D\uDC18|\uD83D\uDC19|\uD83D\uDC1A|\uD83D\uDC1B|\uD83D\uDC1C|\uD83D\uDC1D|\uD83D\uDC1E|\uD83D\uDC1F|\uD83D\uDC20|\uD83D\uDC21|\uD83D\uDC22|\uD83D\uDC23|\uD83D\uDC24|\uD83D\uDC25|\uD83D\uDC26|\uD83D\uDC27|\uD83D\uDC28|\uD83D\uDC29|\uD83D\uDC2A|\uD83D\uDC2B|\uD83D\uDC2C|\uD83D\uDC2D|\uD83D\uDC2E|\uD83D\uDC2F|\uD83D\uDC30|\uD83D\uDC31|\uD83D\uDC32|\uD83D\uDC33|\uD83D\uDC34|\uD83D\uDC35|\uD83D\uDC36|\uD83D\uDC37|\uD83D\uDC38|\uD83D\uDC39|\uD83D\uDC3A|\uD83D\uDC3B|\uD83D\uDC3C|\uD83D\uDC3D|\uD83D\uDC3E|\uD83D\uDC40|\uD83D\uDC42|\uD83D\uDC43|\uD83D\uDC44|\uD83D\uDC45|\uD83D\uDC46|\uD83D\uDC47|\uD83D\uDC48|\uD83D\uDC49|\uD83D\uDC4A|\uD83D\uDC4B|\uD83D\uDC4C|\uD83D\uDC4D|\uD83D\uDC4E|\uD83D\uDC4F|\uD83D\uDC50|\uD83D\uDC51|\uD83D\uDC52|\uD83D\uDC53|\uD83D\uDC54|\uD83D\uDC55|\uD83D\uDC56|\uD83D\uDC57|\uD83D\uDC58|\uD83D\uDC59|\uD83D\uDC5A|\uD83D\uDC5B|\uD83D\uDC5C|\uD83D\uDC5D|\uD83D\uDC5E|\uD83D\uDC5F|\uD83D\uDC60|\uD83D\uDC61|\uD83D\uDC62|\uD83D\uDC63|\uD83D\uDC64|\uD83D\uDC65|\uD83D\uDC66|\uD83D\uDC67|\uD83D\uDC68|\uD83D\uDC69|\uD83D\uDC6A|\uD83D\uDC6B|\uD83D\uDC6C|\uD83D\uDC6D|\uD83D\uDC6E|\uD83D\uDC6F|\uD83D\uDC70|\uD83D\uDC71|\uD83D\uDC72|\uD83D\uDC73|\uD83D\uDC74|\uD83D\uDC75|\uD83D\uDC76|\uD83D\uDC77|\uD83D\uDC78|\uD83D\uDC79|\uD83D\uDC7A|\uD83D\uDC7B|\uD83D\uDC7C|\uD83D\uDC7D|\uD83D\uDC7E|\uD83D\uDC7F|\uD83D\uDC80|\uD83D\uDC81|\uD83D\uDC82|\uD83D\uDC83|\uD83D\uDC84|\uD83D\uDC85|\uD83D\uDC86|\uD83D\uDC87|\uD83D\uDC88|\uD83D\uDC89|\uD83D\uDC8A|\uD83D\uDC8B|\uD83D\uDC8C|\uD83D\uDC8D|\uD83D\uDC8E|\uD83D\uDC8F|\uD83D\uDC90|\uD83D\uDC91|\uD83D\uDC92|\uD83D\uDC93|\uD83D\uDC94|\uD83D\uDC95|\uD83D\uDC96|\uD83D\uDC97|\uD83D\uDC98|\uD83D\uDC99|\uD83D\uDC9A|\uD83D\uDC9B|\uD83D\uDC9C|\uD83D\uDC9D|\uD83D\uDC9E|\uD83D\uDC9F|\uD83D\uDCA0|\uD83D\uDCA1|\uD83D\uDCA2|\uD83D\uDCA3|\uD83D\uDCA4|\uD83D\uDCA5|\uD83D\uDCA6|\uD83D\uDCA7|\uD83D\uDCA8|\uD83D\uDCA9|\uD83D\uDCAA|\uD83D\uDCAB|\uD83D\uDCAC|\uD83D\uDCAD|\uD83D\uDCAE|\uD83D\uDCAF|\uD83D\uDCB0|\uD83D\uDCB1|\uD83D\uDCB2|\uD83D\uDCB3|\uD83D\uDCB4|\uD83D\uDCB5|\uD83D\uDCB6|\uD83D\uDCB7|\uD83D\uDCB8|\uD83D\uDCB9|\uD83D\uDCBA|\uD83D\uDCBB|\uD83D\uDCBC|\uD83D\uDCBD|\uD83D\uDCBE|\uD83D\uDCBF|\uD83D\uDCC0|\uD83D\uDCC1|\uD83D\uDCC2|\uD83D\uDCC3|\uD83D\uDCC4|\uD83D\uDCC5|\uD83D\uDCC6|\uD83D\uDCC7|\uD83D\uDCC8|\uD83D\uDCC9|\uD83D\uDCCA|\uD83D\uDCCB|\uD83D\uDCCC|\uD83D\uDCCD|\uD83D\uDCCE|\uD83D\uDCCF|\uD83D\uDCD0|\uD83D\uDCD1|\uD83D\uDCD2|\uD83D\uDCD3|\uD83D\uDCD4|\uD83D\uDCD5|\uD83D\uDCD6|\uD83D\uDCD7|\uD83D\uDCD8|\uD83D\uDCD9|\uD83D\uDCDA|\uD83D\uDCDB|\uD83D\uDCDC|\uD83D\uDCDD|\uD83D\uDCDE|\uD83D\uDCDF|\uD83D\uDCE0|\uD83D\uDCE1|\uD83D\uDCE2|\uD83D\uDCE3|\uD83D\uDCE4|\uD83D\uDCE5|\uD83D\uDCE6|\uD83D\uDCE7|\uD83D\uDCE8|\uD83D\uDCE9|\uD83D\uDCEA|\uD83D\uDCEB|\uD83D\uDCEC|\uD83D\uDCED|\uD83D\uDCEE|\uD83D\uDCEF|\uD83D\uDCF0|\uD83D\uDCF1|\uD83D\uDCF2|\uD83D\uDCF3|\uD83D\uDCF4|\uD83D\uDCF5|\uD83D\uDCF6|\uD83D\uDCF7|\uD83D\uDCF9|\uD83D\uDCFA|\uD83D\uDCFB|\uD83D\uDCFC|\uD83D\uDD00|\uD83D\uDD01|\uD83D\uDD02|\uD83D\uDD03|\uD83D\uDD04|\uD83D\uDD05|\uD83D\uDD06|\uD83D\uDD07|\uD83D\uDD08|\uD83D\uDD09|\uD83D\uDD0A|\uD83D\uDD0B|\uD83D\uDD0C|\uD83D\uDD0D|\uD83D\uDD0E|\uD83D\uDD0F|\uD83D\uDD10|\uD83D\uDD11|\uD83D\uDD12|\uD83D\uDD13|\uD83D\uDD14|\uD83D\uDD15|\uD83D\uDD16|\uD83D\uDD17|\uD83D\uDD18|\uD83D\uDD19|\uD83D\uDD1A|\uD83D\uDD1B|\uD83D\uDD1C|\uD83D\uDD1D|\uD83D\uDD1E|\uD83D\uDD1F|\uD83D\uDD20|\uD83D\uDD21|\uD83D\uDD22|\uD83D\uDD23|\uD83D\uDD24|\uD83D\uDD25|\uD83D\uDD26|\uD83D\uDD27|\uD83D\uDD28|\uD83D\uDD29|\uD83D\uDD2A|\uD83D\uDD2B|\uD83D\uDD2C|\uD83D\uDD2D|\uD83D\uDD2E|\uD83D\uDD2F|\uD83D\uDD30|\uD83D\uDD31|\uD83D\uDD32|\uD83D\uDD33|\uD83D\uDD34|\uD83D\uDD35|\uD83D\uDD36|\uD83D\uDD37|\uD83D\uDD38|\uD83D\uDD39|\uD83D\uDD3A|\uD83D\uDD3B|\uD83D\uDD3C|\uD83D\uDD3D|\uD83D\uDD50|\uD83D\uDD51|\uD83D\uDD52|\uD83D\uDD53|\uD83D\uDD54|\uD83D\uDD55|\uD83D\uDD56|\uD83D\uDD57|\uD83D\uDD58|\uD83D\uDD59|\uD83D\uDD5A|\uD83D\uDD5B|\uD83D\uDD5C|\uD83D\uDD5D|\uD83D\uDD5E|\uD83D\uDD5F|\uD83D\uDD60|\uD83D\uDD61|\uD83D\uDD62|\uD83D\uDD63|\uD83D\uDD64|\uD83D\uDD65|\uD83D\uDD66|\uD83D\uDD67|\uD83D\uDDFB|\uD83D\uDDFC|\uD83D\uDDFD|\uD83D\uDDFE|\uD83D\uDDFF|\uD83D\uDE00|\uD83D\uDE01|\uD83D\uDE02|\uD83D\uDE03|\uD83D\uDE04|\uD83D\uDE05|\uD83D\uDE06|\uD83D\uDE07|\uD83D\uDE08|\uD83D\uDE09|\uD83D\uDE0A|\uD83D\uDE0B|\uD83D\uDE0C|\uD83D\uDE0D|\uD83D\uDE0E|\uD83D\uDE0F|\uD83D\uDE10|\uD83D\uDE11|\uD83D\uDE12|\uD83D\uDE13|\uD83D\uDE14|\uD83D\uDE15|\uD83D\uDE16|\uD83D\uDE17|\uD83D\uDE18|\uD83D\uDE19|\uD83D\uDE1A|\uD83D\uDE1B|\uD83D\uDE1C|\uD83D\uDE1D|\uD83D\uDE1E|\uD83D\uDE1F|\uD83D\uDE20|\uD83D\uDE21|\uD83D\uDE22|\uD83D\uDE23|\uD83D\uDE24|\uD83D\uDE25|\uD83D\uDE26|\uD83D\uDE27|\uD83D\uDE28|\uD83D\uDE29|\uD83D\uDE2A|\uD83D\uDE2B|\uD83D\uDE2C|\uD83D\uDE2D|\uD83D\uDE2E|\uD83D\uDE2F|\uD83D\uDE30|\uD83D\uDE31|\uD83D\uDE32|\uD83D\uDE33|\uD83D\uDE34|\uD83D\uDE35|\uD83D\uDE36|\uD83D\uDE37|\uD83D\uDE38|\uD83D\uDE39|\uD83D\uDE3A|\uD83D\uDE3B|\uD83D\uDE3C|\uD83D\uDE3D|\uD83D\uDE3E|\uD83D\uDE3F|\uD83D\uDE40|\uD83D\uDE45|\uD83D\uDE46|\uD83D\uDE47|\uD83D\uDE48|\uD83D\uDE49|\uD83D\uDE4A|\uD83D\uDE4B|\uD83D\uDE4C|\uD83D\uDE4D|\uD83D\uDE4E|\uD83D\uDE4F|\uD83D\uDE80|\uD83D\uDE81|\uD83D\uDE82|\uD83D\uDE83|\uD83D\uDE84|\uD83D\uDE85|\uD83D\uDE86|\uD83D\uDE87|\uD83D\uDE88|\uD83D\uDE89|\uD83D\uDE8A|\uD83D\uDE8B|\uD83D\uDE8C|\uD83D\uDE8D|\uD83D\uDE8E|\uD83D\uDE8F|\uD83D\uDE90|\uD83D\uDE91|\uD83D\uDE92|\uD83D\uDE93|\uD83D\uDE94|\uD83D\uDE95|\uD83D\uDE96|\uD83D\uDE97|\uD83D\uDE98|\uD83D\uDE99|\uD83D\uDE9A|\uD83D\uDE9B|\uD83D\uDE9C|\uD83D\uDE9D|\uD83D\uDE9E|\uD83D\uDE9F|\uD83D\uDEA0|\uD83D\uDEA1|\uD83D\uDEA2|\uD83D\uDEA3|\uD83D\uDEA4|\uD83D\uDEA5|\uD83D\uDEA6|\uD83D\uDEA7|\uD83D\uDEA8|\uD83D\uDEA9|\uD83D\uDEAA|\uD83D\uDEAB|\uD83D\uDEAC|\uD83D\uDEAD|\uD83D\uDEAE|\uD83D\uDEAF|\uD83D\uDEB0|\uD83D\uDEB1|\uD83D\uDEB2|\uD83D\uDEB3|\uD83D\uDEB4|\uD83D\uDEB5|\uD83D\uDEB6|\uD83D\uDEB7|\uD83D\uDEB8|\uD83D\uDEB9|\uD83D\uDEBA|\uD83D\uDEBB|\uD83D\uDEBC|\uD83D\uDEBD|\uD83D\uDEBE|\uD83D\uDEBF|\uD83D\uDEC0|\uD83D\uDEC1|\uD83D\uDEC2|\uD83D\uDEC3|\uD83D\uDEC4|\uD83D\uDEC5|\uD83C\uDDE8\uD83C\uDDF3|\uD83C\uDDE9\uD83C\uDDEA|\uD83C\uDDEA\uD83C\uDDF8|\uD83C\uDDEB\uD83C\uDDF7|\uD83C\uDDEC\uD83C\uDDE7|\uD83C\uDDEE\uD83C\uDDF9|\uD83C\uDDEF\uD83C\uDDF5|\uD83C\uDDF0\uD83C\uDDF7|\uD83C\uDDF7\uD83C\uDDFA|\uD83C\uDDFA\uD83C\uDDF8|\u0023\uFE0F\u20E3|\u0023\u20E3|\u0030\uFE0F\u20E3|\u0030\u20E3|\u0031\uFE0F\u20E3|\u0031\u20E3|\u0032\uFE0F\u20E3|\u0032\u20E3|\u0033\uFE0F\u20E3|\u0033\u20E3|\u0034\uFE0F\u20E3|\u0034\u20E3|\u0035\uFE0F\u20E3|\u0035\u20E3|\u0036\uFE0F\u20E3|\u0036\u20E3|\u0037\uFE0F\u20E3|\u0037\u20E3|\u0038\uFE0F\u20E3|\u0038\u20E3|\u0039\uFE0F\u20E3|\u0039\u20E3/g,
                _default = {
                    path: FS.ASSETS_PATH + '/images/emoji/',
                    imgPrefix: 'emoji_',
                    imgExtension: '.png'
                },
                _convertStringToUnicodeCodePoints = function (str) {
                    var surrogate1st = 0,
                        unicodeCodes = [],
                        i = 0,
                        l = str.length;

                    for (; i < l; i++) {
                        var utf16Code = str.charCodeAt(i);
                        if (surrogate1st != 0) {
                            if (utf16Code >= 0xDC00 && utf16Code <= 0xDFFF) {
                                var surrogate2nd = utf16Code,
                                    unicodeCode = (surrogate1st - 0xD800) * (1 << 10) + (1 << 16) + (surrogate2nd - 0xDC00);
                                unicodeCodes.push(unicodeCode);
                            }
                            surrogate1st = 0;
                        } else if (utf16Code >= 0xD800 && utf16Code <= 0xDBFF) {
                            surrogate1st = utf16Code;
                        } else {
                            unicodeCodes.push(utf16Code);
                        }
                    }
                    return unicodeCodes;
                },
                //编码转换
                _escapeToUtf32 = function (str) {
                    var escaped = [],
                        unicodeCodes = _convertStringToUnicodeCodePoints(str),
                        i = 0,
                        l = unicodeCodes.length,
                        hex;

                    for (; i < l; i++) {
                        hex = unicodeCodes[i].toString(16);
                        escaped.push('0000'.substr(hex.length) + hex);
                    }
                    return escaped.join('_');
                };
            return function (text, opt) {
                opt = _.extend(_default, opt);
                return text.replace(_reg, function(v) {
                    return '<img class="emoji" style="vertical-align:middle" src="' + opt.path + opt.imgPrefix + _escapeToUtf32(v) + opt.imgExtension + '" />';
                })
            }
        })(),

        /**
         * 过滤特殊字符：< > ' "
         * @param text
         * @returns {*}
         */
        cutBadStr: function(text){
            if(!text) return '';
            return text.replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/"/g, '&#34;').replace(/'/g, '&#39;');
        },
        /**
         * 验证是不是手机号码
         * @param phoneNum
         * @returns {boolean}
         */
        isMobilePhoneNum: function (phoneNum) {
            return new RegExp('^(13[0-9]|15[0-9]|18[0-9])|14[7]\\d{8}|17[067]\\d{8}$').test(phoneNum);
        },
        /**
         * 输入框带下拉
         */
        bindIptSearch: function($ipt, url, opts) {
        	var id = 'app_ipt_search_layer',
        		index = 0,
        		result,
        		$layer;
        	function refreshLayer(data){
        		index = 0;
        		if(!$('#' + id)[0]) {
        			$(document.body).append('<div id="' + id + '" class="app-ipt-search-layer"></div>');
        			$layer = $('#' + id);
        			$layer.delegate('.item', 'click', function(e){
        				var $this = $(this);
        				$layer.hide();
            			result = {
            				id: parseInt($(this).attr('data-id')),
            				name: $(this).text()
            			};
            			$ipt.val(result.name);
            			e.stopPropagation();
        			});
        			$(document.body).bind('click', function(){
        				($('#' + id)[0]) && ($('#' + id).hide());
        			});
        		}
        		$layer = $('#' + id);
        		$layer.html('').show();
        		var pos = $ipt.offset(),
        			width = $ipt[0].offsetWidth,
        			height = $ipt[0].offsetHeight;
        		$layer.css({
        			left: pos.left,
        			top: pos.top + height - 1,
        			width: width - 2
        		});
        		if(data.length > 10) {
        			data = data.slice(0, 10);
        		}
        		if(data.length) {
	        		$.each(data, function(idx, item){
	        			$layer.append('<a class="item" href="#" onclick="return false;" data-id="' + item.id + '">' + item.name + '</a>');
	        		});
        		} else {
        			$layer.html('<div class="blank">搜索不到数据</div>')
        		}
        	}
        	$ipt = $($ipt);
        	$ipt.bind('input propertychange', function(){
        		var keyword = $(this).val(),
        			data = _.extend({keyword:keyword}, opts);
        		util.api({
        			"url": url,
                    "type": 'get',
                    "dataType": 'json',
                    "data": data,
                    "success": function(responseData) { 
        				refreshLayer(responseData.value);
        			}
        		});
//        		refreshLayer([{
//        			id: 1,
//        			name: '账单'
//        		},{
//        			id: 2,
//        			name: '单价整体'
//        		},{
//        			id: 3,
//        			name: '描述'
//        		}])
        	}).bind('keydown', function(e){
        		$layer = $('#' + id);
        		if(!$layer || !$layer[0]) return;
        		var length = $layer.find('.item').length;
        		//向上
        		if(e.keyCode == 38) {
        			if(index <= 1) return;
        			index--;
        			$layer.find('.item').removeClass('cur');
        			$layer.find('.item').eq(index-1).addClass('cur');
        		} else if(e.keyCode == 40) { //向下
        			if(index >= length) return;
        			index++;
        			$layer.find('.item').removeClass('cur');
        			$layer.find('.item').eq(index-1).addClass('cur');
        		} else if(e.keyCode == 13) {
        			$layer.hide();
        			if($layer.find('.cur')[0]) {
        				result = {
            				id: parseInt($layer.find('.cur').attr('data-id')),
            				name: $layer.find('.cur').text()
            			}
            			$ipt.val(result.name);
        			}
        		}
        	}).bind('click', function(e){
        		e.stopPropagation();
        	});
        	return {
        		getValue: function(){
        			return result;
        		}
        	}
        },
        unbindIptSearch: function($ipt){
        	$ipt = $($ipt);
        	$ipt.unbind('propertychange');
        	$ipt.unbind('input');
        	$ipt.unbind('click');
        	$ipt.unbind('keydown');
        },
        /**
         * 根据部门ID或者员工ID判断是否已加星标
         * @param id,type
         */
        isAsterisk: function (id, type) {
            var url = '';
            var data = {};
            var isAsterisk = 0;
            if (type == 'g') {
                url = '/Employee/IsCircleAsterisk';
                data = {circleID: id};
            } else if (type == 'p') {
                url = '/Employee/IsEmployeeAsterisk';
                data = {employeeID: id};
            }
            util.api({
                "url": url,
                "type": 'get',
                "dataType": 'json',
                "data": data,
                "async": false,
                "success": function (responseData) {
                    if (responseData.success) {
                        isAsterisk = responseData.value;
                    }
                }
            });
            return isAsterisk;
        }

    });
    FS.util = util;
    module.exports = util;
});