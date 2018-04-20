/**
 * feed-list-util工具箱(flutil)
 * 遵循seajs module规范
 */

define(function(require, exports, module) {
    /**
     * 定义组件
     */
    var Dialog = require('dialog');
    var Overlay = require('overlay');
//    var flutilstyle = require('./fl-util.css');
    /**
     * 创建方法
     */
    var flutil = {
        /**
         * 跳转到指定元素的位置
         * 使用方法
         * scroller(el, duration)
         * el : 目标锚点 ID
         * duration : 持续时间，以毫秒为单位，越小越快
         */
        intval: function(v) {
            v = parseInt(v);
            return isNaN(v) ? 0 : v;
        },
        getPos: function(e) { // 获取元素信息
            var l = 0;
            var t = 0;
            var w = this.intval(e.style.width);
            var h = this.intval(e.style.height);
            var wb = e.offsetWidth;
            var hb = e.offsetHeight;
            while (e.offsetParent) {
                l += e.offsetLeft + (e.currentStyle ? this.intval(e.currentStyle.borderLeftWidth) : 0);
                t += e.offsetTop + (e.currentStyle ? this.intval(e.currentStyle.borderTopWidth) : 0);
                e = e.offsetParent;
            }
            l += e.offsetLeft + (e.currentStyle ? this.intval(e.currentStyle.borderLeftWidth) : 0);
            t += e.offsetTop + (e.currentStyle ? this.intval(e.currentStyle.borderTopWidth) : 0);
            return {
                x: l,
                y: t,
                w: w,
                h: h,
                wb: wb,
                hb: hb
            };
        },
        getScroll: function() { // 获取滚动条信息
            var t, l, w, h;
            if (document.documentElement && document.documentElement.scrollTop) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.scrollLeft;
                w = document.documentElement.scrollWidth;
                h = document.documentElement.scrollHeight;
            } else if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
                w = document.body.scrollWidth;
                h = document.body.scrollHeight;
            }
            return {
                t: t,
                l: l,
                w: w,
                h: h
            };
        },
        scroller: function(el, duration) { // 锚点(Anchor)间平滑跳转
            if (typeof el != 'object') {
                el = document.getElementById(el);
            }
            if (!el)
                return;
            var z = this;
            z.el = el;
            z.p = this.getPos(el);
            z.s = this.getScroll();
            z.clear = function() {
                window.clearInterval(z.timer);
                z.timer = null;
            };
            z.t = (new Date).getTime();
            z.step = function() {
                var st, sl;
                var t = (new Date).getTime();
                var p = (t - z.t) / duration;
                if (t >= duration + z.t) {
                    z.clear();
                    window.setTimeout(function() {
                        z.scroll(z.p.y, z.p.x);
                    }, 13);
                } else {
                    st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.y - z.s.t) + z.s.t;
                    sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.x - z.s.l) + z.s.l;
                    z.scroll(st, sl);
                }
            };
            z.scroll = function(t, l) {
                window.scrollTo(l, t);
            };
            z.timer = window.setInterval(function() {
                z.step();
            }, 13);
        },
        /**
         * 判断多选框如果大于限制的选中数量的值则执行Callback函数
         * 使用方法如下
         * checkboxIsoverstep(defEl, voteCountNum, function() {
         *      alert('最多选' + voteCountNum + '项');
         *  });
         * checkboxsWarpEl : checkbox的父级元素
         * num : 限制的选中数量
         */
        checkboxIsoverstep: function(checkboxsWarpEl, num, callBack) {
            var checkboxEl = $('input[type=checkbox]', checkboxsWarpEl);
            checkboxEl.on('click', function() {
                var checkedsLen = $(':checked', checkboxsWarpEl).length;
                if (checkedsLen > num) {
                    $(this).prop('checked', false);
                    callBack();
                }
            });
        },
        /**
         * 按钮位置显示层
         * @param {type} opts
         * @returns {event}
         */
        showTip: function(opts) {
            var def = {
                "template": '<div class="fl-showtip"><h3>我是标题</h3></div>',
                "width": 200,
                "height": 'auto',
                "align": {
                    "selfXY": ['center', 'bottom'], // element 的定位点，默认为左上角
                    "baseElement": '.fl-showtip-btn',
                    "baseXY": ['center', 0]
                },
                "zIndex": 9999
            };
            var o = $.extend(def, opts);
            tip = new Overlay(o);
            return tip;
        },
        /**
         * 目标上方滑动提示框
         * 宽高必须要设置，根据容器内的元素大小
         * element为按钮
         * template为HTML内容*
         * 隐藏的按钮class名为 .f-sub .f-cancel
         */
        showSlideUpTip: function(opts) {
            opts = _.extend({
                "element": null,
                "autohide": true,
                "width": 500,
                "height": 300,
                "top": 4,
                "template": '关注成功！',
                "callback": function() {
                }
            }, opts || {});

            var timeData = new Date();
            var timeToId = timeData.getTime();
            this.id = timeToId;
            var o = new Overlay({
                "template": '<div class="show-slide-up-tip-warp" id="' + timeToId + '"><div class="show-slide-up-tip-conent">' + opts.template + '</div></div>',
                "autohide": opts.autohide,
                "width": opts.width,
                "height": opts.height,
                "align": {
                    "selfXY": ['center', 'bottom'], // element 的定位点，默认为左上角
                    "baseElement": opts.element,
                    "baseXY": ['center', 'top-' + opts.top + 'px']
                },
                "zIndex": 9999
            }).render().show();
            //            var oMainEl = o.element;
            var oMainEl = $('#' + timeToId + '');
            var otipWarpEl = $('.show-slide-up-tip-warp', oMainEl);
            var otipConentEl = $('.show-slide-up-tip-conent', oMainEl);
            var animateSpeed = 250;
            otipConentEl.css({
                "bottom": -opts.height
            });
            otipConentEl.animate({
                'bottom': '0'
            }, animateSpeed);
            if (opts.autohide) { //自动隐藏
                setTimeout(function() {
                    _hide();
                }, 1500);
            }
            oMainEl.on('click ', '.f-cancel', function() {
                _hide();
            });
            oMainEl.on('click ', '.f-sub', function() {
                opts.callback();
                _hide();
            });
            var _hide = function() {
                otipConentEl.animate({
                    'bottom': -opts.height
                }, animateSpeed, function() {
                    oMainEl.remove(); //销毁
                    $('IFRAME').remove(); //解决ie6自动添加IFRAME的Bug
                });
                this.id = null;
            };

        },
        /* 模拟alert提示框 */
        showAlertDialog: function(text, width) {
            var w = width || 192;
            var o = new Dialog({
                width: w,
                closeTpl: '',
                visibleWithAnimate: true, //淡出
                content: '<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> ' + text + '</div>',
                className: 'fs-feed-comment-dialog'
            }).render();
            o.show();
            setTimeout(function() {
                o.hide();
            }, 1500);
        },
        /* 模拟conform提示框 */
        showConformDialog: function(text) {
            var o = new Dialog({
                width: '',
                closeTpl: '',
                content: '<div class="fs-successtip"><img src="../../html/fs/assets/images/success.gif" width="50" height="50" /> ' + text + '</div>',
                className: 'fs-feed-comment-dialog'
            }).render();
            o.show();
            setTimeout(function() {
                o.hide();
            }, 1500);
        },
        /**
         * 返回字符的字节长度（汉字算2个字节）
         * @param {string}{number}
         * @returns {string}   +'...'
         */
        cutStrForNum: function(str, num) {
            var len = 0;
            var newStr = str; //默认返回原字符串
            var aStr = str.split(''); //字符转换成数组
            //不做全角半角区分了
            /* for (var i = 0; i < aStr.length; i++) {
             if (aStr[i].match(/[^\x00-\xff]/ig) != null) { //全角
             len += 2;
             } else {
             len += 1;
             }
             }*/

            if (str.length >= num) {
                //如果长度大于限制就在末尾添加...
                newStr = str.substring(0, num) + "…";
            }
            return newStr;
        },
        /**
         * 删除HTML文本中的超连接保留文字
         * @param {string}
         * @returns {string}
         */
        delStrLink: function(str) {
            var reg = /(<a.*?>)|(<\/a>)/g; //删除超连接使用的正则
            str = str.replace(reg, '');
            return str;
        },
        /**
         * 点击按钮显示层，点击其他地方隐藏层
         * @param {str} btnName
         * @param {str} divName
         */
        tarClickTip: function(btnName, divName) {
            $('.' + btnName).click(function(e) {
                $('.' + divName).show();
            });
            $(document).on('click', function(e) {
                var e = e ? e : window.event;
                var tar = e.srcElement || e.target;
                var tarClassName = $(tar).attr("class");
                if (tarClassName != btnName && tarClassName != divName) {
                    $('.' + divName).hide();
                }
            });
        }
      
    };
    //返回flutil
    module.exports = flutil;
});