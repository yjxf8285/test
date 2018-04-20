/**
 * Created by 晓帆 on 2/25 025.
 * 工具箱
 */
'use strict';
var root = window || {};
$.extend(root, {
    baseUrl: '/',
    baseDir: 'm/',
    appName: 'TETEM',
    versions: '1.0.0', //当前版本号
    API_PATH: '/proxy/h5.test.intra.qiaoshoutete.com:8090/api/v1',//AJAX路径
    //API_PATH: '/api/v1',//AJAX路径
    EMPTY_FN: function () {
    }
});
//document.cookie = 'rasUserInfo' + '=ed9ee9cceefe44571a02ec98860dd2b5828d9ee8c47029a483eddd4be170d740542eb1fd007b7534934d5836ce01cff62bf07958dc215b99f52efd477c275990e29c1bd41b670f7efad904a405fed94b0ece346c48b789db1b0099ada6a7458b2d9a5ae39df6b2f93e647d3c0afbec84ff68bca031bebf377d271c7ae695d0aea88f5d68d487b10bc33393d38b69be194a9ef219eb3ead0e9ea02e0bda6d6161813aa6195b5bbf09783d9bd922324d67375275a1b80f66418b6cc0560036d9ffe99844af1b7b834700c642a7fd6b0ec084df52d16f7e93bc820d50fa2d94344d58fc2019eb1a0a48496d4702583fa2b1575abcd0451ae8106e5750b1d3a4c12d39ca5eb01be30ade87cc3228976c2c6207370894418917835c949dfe2a902eecc907707ec859331b3a31a27f079133cfc51b90600fc8635b61e7d202f7afec20b145f62deeea3050ada031c917d4642636aa3b89f876f8dbaa15472acc43037a1ce16ed71255393d6a88b472fb8970b691f6bdce5eec446508c6ee09e7ea022882a931ca43ce720f07af3d957b9c5324dc8a4cf5886bb42bae3680de180de1841f84706d9168922bddaeca255c68f50f654e1e4416b574af853953ecf43734a2e1a5f697b3c4fbb018a3219d31717f5f435bac3c787f42f4fb4fcbdfffb15d9c5f8d4c9cb499558535fd6fa2b1f3a6d7cd355dfeb4f92896;expires=1000000000;path=/;domain=.test.intra.qiaoshoutete.com';
//document.domain='test.intra.qiaoshoutete.com';
//cookie.domain='.test.intra.qiaoshoutete.com';
var util = {
    /**
     * ajax封装
     * @param opts
     * @param customOpts
     * @returns {*}
     */
    api: function (opts, customOpts) {
        var that = this;
        var success = opts.success || root.EMPTY_FN;
        var beforeSend = opts.beforeSend || root.EMPTY_FN;
        var error = opts.error || root.EMPTY_FN;
        var complete = opts.complete || root.EMPTY_FN;
        if (opts.surl) {
            opts.url = opts.surl;
        } else {
            opts.url = root.API_PATH + opts.url;
        }
        opts = $.extend({
            timeout: 5000,
            type: 'get',
            autoJumpLogin: true,
            //contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }, opts, {
            success: function (responseData, textStatus, jqXHR) {
                var status = responseData.status;
                if (status == 401 && opts.autoJumpLogin) {
                    dialog.confirm({
                        content: "您还没有登录，请先登录！", hasSureHander: function () {
                            window.location.href = "/m/html/login.html"
                        }
                    });
                }

                return success.apply(this, arguments);

            },
            beforeSend:function(){
                return beforeSend.apply(this, arguments);
            },
            error: function (jqXHR, textStatus) {
                //that.showErrorInfo(jqXHR);

                return error.apply(this, arguments);
            },
            complete: function (jqXHR, textStatus) {
                return complete.apply(this, arguments);
            }
        });
        //if (opts.type.toLowerCase() == "post" && opts.data) {
        //    opts.data = JSON.stringify(opts.data);
        //}
        var jqAjax = $.ajax(opts);
        return jqAjax;
    },
    uuid: function () {
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }

        return uuid;
    },
    //监听网页到底了
    scrollB: function (callback) {
        var resizeTimer=null;
        $(window).on('scroll', function(){
            if(resizeTimer){
                clearTimeout(resizeTimer)
            }
            resizeTimer=setTimeout(function(){
                var triggerSize = 200;
                var winH = $(window).height();
                var docH = $(document).height();
                var scrollTop = $(window).scrollTop();
                if ($("body").find('.no-list-data').length < 1) {
                    $("body").append('<div class="no-list-data"></div>');
                }
                if (winH + scrollTop + triggerSize >= docH) {
                    if ($("body").find('.no-list-data').length > 0) {
                        if ($("body").find('.no-list-data').attr("no-more") != "no-more")
                            $("body").find('.no-list-data').html("加载更多...");
                    }
                    if(callback){
                        callback();
                    }
                }
            },700);
        });
        //
        //throttle(700,function () {
        //
        //})
        //$(window).on('scroll', _.throttle(700,function () {
        //    var triggerSize = 200;
        //    var winH = $(window).height();
        //    var docH = $(document).height();
        //    var scrollTop = $(window).scrollTop();
        //    if ($("body").find('.no-list-data').length < 1) {
        //        $("body").append('<div class="no-list-data"></div>');
        //    }
        //    if (winH + scrollTop + triggerSize >= docH) {
        //        if ($("body").find('.no-list-data').length > 0) {
        //            if ($("body").find('.no-list-data').attr("no-more") != "no-more")
        //                $("body").find('.no-list-data').html("<img src='/m/img/ui/common/loading.gif' />加载更多...");
        //        }
        //        callback();
        //    }
        //}));
    }




};
module.exports = util;
