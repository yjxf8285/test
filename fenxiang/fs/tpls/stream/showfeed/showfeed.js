 /**
 * Feed详情页
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        tplCommon = require('../stream-common'),
        feedV = require('modules/feed-list/feed-list-v'),
        feedM = require('modules/feed-list/feed-list-m'),
        feedC = require('modules/feed-list/feed-list-c');
    var FeedItemV = feedV.itemV,
        FeedItemM = feedM.itemM,
        FeedListC = feedC.listC;
    var tempFeedListC = new FeedListC(); //用于格式化数据

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var feedEl = $('.feed', tplEl);
        var feedV;
        //和子页面公共部门处理,左边栏部分
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData(),
            showFeedLeftTpl=$('.show-feed-tpl-left',tplEl),
            showFeedLeftTplHtml=showFeedLeftTpl.html();
        //remove tpl
        //showFeedLeftTpl.remove();
        //render左边栏信息
        var createLeftHtml=function(sender){
            var renderData={};
            var leftCompiled=_.template(showFeedLeftTplHtml); //模板编译方法
            _.extend(renderData,{
                "userId":sender.employeeID,
                "userName":sender.name,
                "profileImage":util.getAvatarLink(sender.profileImage,2)
            });
            //渲染到页面
            tplLeftEl.html(leftCompiled(renderData));
        };
        var createFeed = function() { //创建一个feed
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var feedId = queryParams ? queryParams.id : 0, //获取FeedID
                replyPn = queryParams ? queryParams.pn : 1, //回复分页激活页码
                isPrint = false, //是否处于打印模式，默认为否
                showVoteDetail=false,   //是否显示投票详情，默认不显示
                openAction=queryParams ? queryParams.open : "reply";    //自动打开哪个action ,默认为回复列表
            if(!openAction){
                openAction="reply";
            }
            if (queryParams && queryParams.isprint) {
                isPrint = true;
            }
            if (queryParams && queryParams.showvotedetail) {
                showVoteDetail = true;
            }
            if (feedId != 0) {
                util.api({
                    "url": "/Feed/GetFeedByFeedID",
                    "data": {
                        "feedID": feedId
                    },
                    "type": "get",
                    "success": function(responseData) {
                        var feedItemData;
                        if (responseData.success) {
                            feedItemData = tempFeedListC.parse(responseData);
                            //渲染左侧边栏
                            createLeftHtml(feedItemData[0].originData.sender);
                            feedV = new FeedItemV({
                                "model": new FeedItemM(feedItemData[0]),
                                "replyListOpts": { //回复列表配置参数
                                    "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                                    "withPagination": true, //带分页
                                    "activePageNumber": replyPn
                                },
                                "withShowBoteFeed": showVoteDetail, //是否显示投票详情
                                "withAvatar":false,  //不显示头像
                                "replyWithMedia":true,    //带多媒体功能
                                "noticeStyle":1,  //公告详情页风格
                                "likeStyle":2,   //赞风格，1表示列表页，2是详情页
                                "scheduleStyle":1,  //日程详情页风格
                                "detailStyle":isPrint?2:1,  //是否处于打印模式
                                "reloadAfterReply":false, //回复后不刷新整个feed
                                "deleteCb":function(responseData){
                                    var model=this.model,
                                        feedType=model.get('feedType');
                                    if(responseData.success){
                                        if(feedType!=4){
                                            tpl.navRouter.navigate('stream', {
                                                trigger: true
                                            });
                                        }
                                    }
                                }
                            }).render();
                            feedV.$el.appendTo(feedEl);
                            //默认打开回复列表
                            if(openAction=="reply"){
                                $('.aj-Reply', feedV.$el).click();
                            }else if(openAction=="like"){
                                feedV.islikelistbtn();
                            }

                            if (isPrint) {
                                printInit(); //打印初始化
                            }
                            //默认打开点评窗口
                            var commentBtnEl=$('.aj-commenton',feedV.$el);
                            if(commentBtnEl.is(':visible')){
                                commentBtnEl.click();
                                feedV.showCommentDialog(true);  //打开点评窗口,同时打开历史面板
                            }
                            //默认打开审批面板
                            var approveBtnEl=$('.aj-approval',feedV.$el);
                            if(approveBtnEl.is(':visible')){
                                approveBtnEl.click();
                            }
                        }
                    }
                });
            }
        }, destroyFeed = function() { //销毁一个feed
                feedV.destroy();
                feedEl.empty();
            }, printInit = function() { //打印一个feed
                //隐藏左边栏和右边栏
                $('.tpl-l,.tpl-r', tplEl).remove();
                //隐藏顶部和尾部导航
                $('.hd,.ft').remove();
                //设置打印class标识
                $('html').addClass('fs-print-html');
                $('body').addClass('fs-print-body');
                //隐藏feed功能键和回复
                /*$('.item-func,.feed-reply', feedV.$el).hide();
                //隐藏打印按钮
                $('.printer', feedV.$el).hide();
                //隐藏头像
                $('.item-face', feedV.$el).hide();
                $('.master-reply-face-l',feedV.$el).hide();
                //隐藏审批人
                $('.plan-leader', feedV.$el).hide();
                //内容图片可关闭
                feedImgEl = $('.feed-img', feedV.$el);
                //阻断弹框内所有的a点击默认行为
                $('a',feedV.$el).click(function(evt){
                    evt.preventDefault();
                });
                if (feedImgEl.length > 0) {
                    closeAttachLinkEl = $('<span class="close-attach-l">x</span>');
                    closeAttachLinkEl.css({
                        "position": "absolute",
                        "right": "-20px",
                        "top": "0px",
                        "width": "20px",
                        "height": "20px",
                        "line-height": "20px",
                        "text-align": "center",
                        "cursor": "pointer",
                        "color": "#333333"
                    }).appendTo(feedImgEl);
                    closeAttachLinkEl.click(function() {
                        feedImgEl.hide();
                        return false;
                    });
                }*/
                //隐藏qq客服和企信
                $('.right-apv-wrapper').remove();
                $('.fs-qx,.fs-chat-panel').addClass('fn-hide-abs').hide();
                $('.browser-upgrade-tip').remove();
                //执行全局回调
                root.printModelCb && root.printModelCb();
            };
        //切换到当前模板后重新加载feedlist,被缓存的tpl可以在init里注册switched时间而不用担心重复注册的问题
        tplEvent.on('switched', function(tplName2, tplEl) {
            if (tplName2 == tplName) {
                if (feedV) { //如果存在feed先销毁再创建
                    destroyFeed();
                    createFeed();
                } else {
                    createFeed();
                }
                //高亮首页导航
                $('#tip-home').addClass('tnavon state-active');
            }else{
                tplLeftEl.html('&nbsp;');  //清理头像信息
            }
        });
    };
});