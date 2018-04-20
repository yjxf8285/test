/**
 * 基于jQuery和underscore的公用文件
 * User: qisx
 * Date: 13-7-25
 * Time: 下午4:14
 */

(function($,root){
    var XK={},
        util={};
    XK.EMPTY_FN=function(){};   //空函数
    _.extend(util,{
        /**
         * ajax包装
         */
        "ajax":function(opts,cusOpts){
            var xhr,
                error,
                beforeSend,
                complete,
                executeFn,
                tryIndex=0;
            var globalLoadingEl=$('#global-loading');
            if(globalLoadingEl.length==0){
                globalLoadingEl=$('<div id="global-loading"></div>');
                globalLoadingEl.appendTo('body');
                $(root).resize(function(){
                    globalLoadingEl.width($(root).width());
                    globalLoadingEl.height($(root).height());
                }).scroll(function(){
                        globalLoadingEl.css('top',$(root).scrollTop());
                        globalLoadingEl.css('left',$(root).scrollLeft());
                    }).resize().scroll();
            }

            opts= _.extend({
                "type":"get",
                "dataType":"json",
                "cache": false,
                "timeout":60000 //默认设置1m钟超时
            },opts||{});
            cusOpts= _.extend({
                "tryTimes":0,    //失败后尝试执行次数
                "finallyError":XK.EMPTY_FN,
                "keepLoading":false //是否保持loading遮罩
            },cusOpts||{});
            error=opts.error;
            opts.error=function(){
                if(tryIndex<cusOpts.tryTimes){
                    executeFn();
                    tryIndex++;
                }else{
                    cusOpts.finallyError.apply(this,arguments);
                }
                return error&&error.apply(this,arguments);
            };
            beforeSend=opts.beforeSend;
            opts.beforeSend=function(){
                globalLoadingEl.show();
                return beforeSend&&beforeSend.apply(this,arguments);
            };
            complete=opts.complete;
            opts.complete=function(){
                if(!cusOpts.keepLoading){
                    globalLoadingEl.hide();
                }
                return complete&&complete.apply(this,arguments);
            };
            executeFn=function(){
                xhr=$.ajax(opts);
                return xhr;
            };
            return executeFn();
        },
        /**
         * 系统检测
         */
        "sysDetector":function(){
			//alert(navigator.userAgent);
			//var testArr=navigator.userAgent.match(/Version\/(\d+\.\d+) Mobile/);
			//alert(testArr);
			//alert(navigator.userAgent);
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                return "ios";
            } else if (/(Android)/i.test(navigator.userAgent)) {
                return "android";
            }else{
                return "unknown";
            }
        },
		"numberToTextInIos":function(elSelector){
			var sysName=util.sysDetector(),
				iosVersion;
			var elEl=$(elSelector);
			if(sysName=="ios"){
				iosVersion=navigator.userAgent.match(/CPU iPhone OS (\d+_\d+_\d+) like Mac/)[1];
				iosVersion=parseFloat(iosVersion.replace(/_/g,''));
				if(iosVersion<600){
					elEl.attr('type','text');		
				}	
			}		
		},
        "alert":function(message){
            var sysName=util.sysDetector(),
                ifrEl=$('#ios-show-tip'),
                ifrDom;
            if (sysName=="ios") {
                if(ifrEl.length==0){
                    ifrEl=$('<iframe id="ios-show-tip" src="data:text/plain" />');
                    ifrEl.hide();
                    ifrEl.appendTo('body');
                }
                ifrDom=ifrEl.get(0);
                return ifrDom.contentWindow.alert(message);
                //return alert(message);
            } else if (sysName=="android") {
                //return external.alert(message);
                return alert(message);
            }else{
                try{
                    return alert(message);
                }catch(e){
                    return "未知系统不能执行";
                }
            }
        },
        "confirm":function(message){
            var sysName=util.sysDetector(),
                ifrEl=$('#ios-show-tip'),
                ifrDom;
            if (sysName=="ios") {
                if(ifrEl.length==0){
                    ifrEl=$('<iframe id="ios-show-tip" src="data:text/plain" />');
                    ifrEl.hide();
                    ifrEl.appendTo('body');
                }
                ifrDom=ifrEl.get(0);
                return ifrDom.contentWindow.confirm(message);
                //return confirm(message);
            } else if (sysName=="android") {
                //return external.confirm(message);
                return confirm(message);
            }else{
                try{
                    return confirm(message);
                }catch(e){
                    return "未知系统不能执行";
                }
            }
        },
        /**
         * external调用者
         * @param cmdName
         * @param params
         * @returns {*}
         */
        "externalExecute":function(cmdName,params){
            var ifrEl,
                sysName;
            params=params||"";
            sysName=util.sysDetector();
            if (sysName=="ios") {
                ifrEl=$('#for-ios-exe');
                if(ifrEl.length==0){
                    ifrEl=$('<iframe src="facishare://'+cmdName+':'+params+'" id="for-ios-exe" />');
                    ifrEl.wrap('<div class="for-ios-exe-wrapper" style="display: none"></div>').closest('.for-ios-exe-wrapper').appendTo('body');
                }else{
                    ifrEl.attr('src','facishare://'+cmdName+':'+params);
                }
                return;
            } else if (sysName=="android") {
                return external[cmdName](params);
            }else{
                return "未知系统不能执行";
            }
        },
        /**
         * external拦截器
         * @param interceptorName
         * @param executor
         */
        "regInterceptor":function(interceptorName,executor){
            var sysName=util.sysDetector();
            /*if (sysName=="ios") {
                window[interceptorName]=executor;
            } else if (sysName=="android"||sysName=="unknown") {
                window[interceptorName]=function(){
                    try{
                        external.executeInterceptor(interceptorName,executor());
                    }catch(e){
                        util.alert(e.message);
                    }
                };
            }else{
                return "未知系统不能执行";
            }*/
            if (sysName=="ios"||sysName=="android") {
                window[interceptorName]=executor;
            }else{
                return "未知系统不能执行";
            }
        },
        "showGlobalLoading":function(){
            var globalLoadingEl=$('#global-loading');
            globalLoadingEl.show();
        },
        "hideGlobalLoading":function(){
            var globalLoadingEl=$('#global-loading');
            globalLoadingEl.hide();
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
        }
    });
    _.extend(XK,{
        "util":util
    });
    root.XK=XK;
}(jQuery,window));