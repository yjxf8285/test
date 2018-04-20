/**
 * 我的赞
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var Tabs = require('tabs'),
        util = require('util');
    var tplCommon = require('../stream-common');
    var Likelist = require('modules/fs-like/fs-like');

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var listEl = $('.like-list', tplEl);
        var pagEl = $('.like-list-pagination', tplEl),
            filterEl = $('.filter', tplEl);
        //创建列表
        var likeList = new Likelist({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/FeedExtend/GetFeedLikesOfIReceive", //我收到的赞接口地址
            // "listPath": "/FeedExtend/GetFeedLikesOfISend", //我发出的赞接口地址
            "searchOpts": {},
            "listCb": function(responseData) { //列表数据请求后的回调

            }
        });
        //filter筛选
        filterEl.on('click', '.filter-field', function(evt) {
            var meEl = $(this);
            var likeType = meEl.attr('liketype');
            $('.filter-field', filterEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            if (likeType == "received") {
                likeList.opts.listPath = "/FeedExtend/GetFeedLikesOfIReceive";
            } else {
                likeList.opts.listPath = "/FeedExtend/GetFeedLikesOfISend";
            }
            //reload
            likeList.reload();
            evt.preventDefault();
        });

        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl, tplName);
        //likeList
        var firstRender = true;
        tplEvent.on('switched', function(tplName2) {
            if (tplName2 == tplName) {
                if (firstRender) {
                    likeList.load();
                    firstRender = false;
                } else {
                    //定位到第一个tab
                    $('.filter-field',filterEl).removeClass('depw-menu-aon').eq(0).addClass('depw-menu-aon');
                    likeList.opts.listPath = "/FeedExtend/GetFeedLikesOfIReceive";
                    likeList.reload();
                }
            }
        });
    };
});