/**
 * 定义信息列表View
 *
 * 遵循seajs module规范
 * @author liuxf
 */

define(function(require, exports, module) {
    var root = window,
            FS = root.FS,
            tpl = FS.tpl,
            store = tpl.store,
            tplEvent = tpl.event;
    var util = require('util'),
            moment = require('moment'),
            Dialog = require('dialog'),
            publish = require('modules/publish/publish'),
            feedListStyle = require('modules/feed-list/feed-list.css'),
            M = require('modules/feed-list/feed-list-m'),
            C = require('modules/feed-list/feed-list-c'),
            tpl = require('modules/feed-list/feed-list.html'),
            feedHelper = require('modules/feed-list/feed-list-helper');

    var pinLink = feedHelper.feedContentFormat; //拼超链接
    var ItemM = M.itemM, //item model
            ListC = C.listC, //list collection
            tplEl = $(tpl);

    var AtInput = publish.atInput, //at输入框
            MediaMaker = publish.mediaMaker; //选人组件
    var contactData = util.getContactData(), //人和组织的数据来源
            currentUserData = contactData["u"]; //自己
    var formatFeedContent = feedHelper.feedContentFormat_; //feed内容拼接

    /* 判断输入内容不能为空 */
    var isEmpty = function(target) {
        var targetText = target.val(),
                passed = true;
        //标题不能为空
        if (targetText == "") {
            util.showInputError(target);
            passed = false;
        }
        return passed;
    };

    var ItemV = Backbone.View.extend({
        tagName: "div",
        template: _.template(tplEl.filter('.preview-feed').html()),
        className: "list-item fn-clear",
        events: {
            "click .feed-content-visible-h": "fcVisibleH", //展开收起正文
            "click .feed-reply-content-visible-h": "fRcVisibleH", //回复的展开收起正文
            "click .aj-replyinput": "replyinput", //回复框事件

            "click .aj-replytext": "replytext", //回复文字事件							
            "click .aj-replysubmit": "replysubmit", //回复按钮事件
            "click .aj-replysubmit-sub": "replysubmitsub", //子回复按钮事件
            "click .reply-audio-open-btn": "audioBtn", //点击播放录音
            "click .reply-audio-close-btn": "audioCloseBtn", //关闭播放录音
            "click .fs-switch-tpl-l": "_clickSwitchTplLink"
        },
        /*关闭播放录音窗口*/
        audioCloseBtn: function(e) {
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.list-item');
            var audioBtnEl = $('.audio-btn', itemEl);
            var audioWarpEl = $('.audio-warp', itemEl);
            audioWarpEl.hide();
            audioBtnEl.show();
            this.audioPlayer && this.audioPlayer.stop();
        },
        /* 点击播放录音 */
        audioBtn: function(e) {
            var meEl = $(e.currentTarget);
            var audioEl = meEl.closest('.audio-el');
            var audioWarpEl = $('.audio-warp', audioEl);
            var model = this.model,
                    audioSrc = model.get('attachPath'),
                    originData = model.get('originData');
            meEl.hide();
            audioWarpEl.show();
            //初始化audio
            if (!this.audioPlayer) {
                this.audioPlayer = new AudioPlayer({
                    "element": $('.audio-box', audioWarpEl),
                    "audioSrc": audioSrc,
                    "length": originData.audio.attachSize
                });
                this.compStore.push(this.audioPlayer); //放入组件存储供以后删除
            }
            this.audioPlayer.play(); //打开直接播放
        },
        /**
         * 回复的展开收起正文控制
         * @param evt
         */
        "fRcVisibleH": function(evt) {
            var meEl = $(evt.currentTarget);
            var itemEl = meEl.closest('.item-detail');
            var summaryTextEl = $('.feed-summary-text', itemEl);
            var leftHtmlEl = $('.feed-content-lefthtml', itemEl);
            var ellipsisEl = $('.feed-content-ellipsis', itemEl);
            var feedWordNum = meEl.attr('feedwordnum');
            if (leftHtmlEl.is(':visible')) {
                ellipsisEl.show();
                leftHtmlEl.hide();
                meEl.text('展开正文，（共' + feedWordNum + '个字）');
            } else {
                ellipsisEl.hide();
                leftHtmlEl.show();
                meEl.text('收起正文');
            }

            evt.preventDefault();
        },
        /**
         * 展开收起正文控制
         * @param evt
         */
        "fcVisibleH": function(evt) {
            var model = this.model,
                    feedFormatContent = model.get('feedFormatContent'),
                    leftHtml = feedFormatContent.leftHtml;
            var meEl = $(evt.currentTarget);
            var itemEl = meEl.closest('.content');

            var summaryContentEl = $('.feed-summary-text', itemEl),
                    leftContentEl = $('.feed-left-text', itemEl),
                    ellipsisEl = $('.feed-content-ellipsis', itemEl),
                    visibleEl = $('.feed-content-visible-h', itemEl);
            if (leftContentEl.length == 0) { //第一次点击时创建剩余内容
                leftContentEl = $('<span class="feed-left-text">' + leftHtml + '</span>');
                leftContentEl.insertAfter(summaryContentEl);
                ellipsisEl.hide();
                visibleEl.text('收起正文');
            } else {
                if (leftContentEl.is(':visible')) {
                    leftContentEl.hide();
                    visibleEl.text('展开正文，（共' + feedFormatContent.feedWordNum + '个字）');
                    ellipsisEl.show();
                } else {
                    leftContentEl.show();
                    visibleEl.text('收起正文');
                    ellipsisEl.hide();
                }
            }
            evt.preventDefault();
        },
        "replyEls": function(e) { //相关元素绑定
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.list-item'),
                    replyinputEl = $('.preview-reply', itemEl),
                    feedId = $('.item-face', itemEl).attr('feedid'),
                    replybbarEl = $('.preview-reply-bbar', itemEl),
                    feedreplyEl = $('.feed-reply', itemEl),
                    replyContent = replyinputEl.val();
            return {
                "replyinputEl": replyinputEl,
                "replybbarEl": replybbarEl,
                "feedreplyEl": feedreplyEl,
                "replyContent": replyContent,
                "feedId": feedId
            };
        },
        "replysubmitsub": function(e) { //子回复按钮事件
            var meEl = $(e.currentTarget),
                    mEls = this.replyEls(e),
                    detailEL = meEl.closest('.item-detail'),
                    replyToReplyID = detailEL.attr('feedid'), //回复的回复的ID
                    replyToEmployeeID = detailEL.attr('employeeid'); //回复的回复的发出人的ID
            var senderNameEl = $('.aj-senderName', detailEL);
            var senderNameText = senderNameEl.attr('name');

            var replywho = '回复@' + senderNameText + '：';
            //mEls.replyinputEl.focus().css('height', '30px').val(replywho);
            mEls.replyinputEl.focus().val(replywho).trigger('autosize.resize');
            mEls.replybbarEl.show();
            this.replyEls.replyToReplyID = replyToReplyID;
            this.replyEls.replyToEmployeeID = replyToEmployeeID;
            mEls.replyinputEl.attr('placeholder', '');
        },
        "replyinput": function(e) { //回复框事件
            var mEls = this.replyEls(e);
            mEls.replybbarEl.show();
            mEls.replyinputEl.focus();
            //mEls.replyinputEl.attr('placeholder', '');
        },
        "replytext": function(e) { //回复文字事件	
            var mEls = this.replyEls(e);
            if (mEls.replybbarEl.is(':visible')) {
                //mEls.replybbarEl.hide();
                //mEls.replyinputEl.css('height', '20px');
                //mEls.replyinputEl.attr('placeholder', '回复原文...');
            } else {
                //mEls.replyinputEl.focus().css('height', '30px');
                mEls.replybbarEl.show();
                //mEls.replyinputEl.attr('placeholder', '');
            }
        },
        "replysubmit": function(e) { //回复按钮事件
            var that = this,
                    mEls = this.replyEls(e),
                    subBtnEl = $(e.currentTarget);
            var elEl = this.$el,
                    replyNumEl = $('.aj-replytext .num', elEl);
            var replyinputEl = $('.aj-replyinput', elEl);
            var replyContent = _.str.trim(replyinputEl.val()); //过滤前后空格和回车
            // var blankReg = /^\s*$/; //全是空格的正则
            var blankReg = new RegExp('^\s*$'); //全是空格的正则
            if (blankReg.test(replyContent)) { //如果输入全是空格就把内容变成空
                replyinputEl.val('');
            }
            if (isEmpty(replyinputEl)) {
                if (replyContent.length > 2000) { //如果字数长度超过2000   
                    util.alert('请控制输入在2000字内');
                } else {
                    util.api({//提交回复
                        "url": "/Feed/SendFeedReply", //发送回复地址
                        "type": 'post',
                        "data": {
                            "feedID": mEls.feedId, //回复的FeedID
                            "replyContent": replyContent,
                            "replyToReplyID": this.replyEls.replyToReplyID || 0, //如果是回复的回复，则填写被回复的回复的ID
                            "replyToEmployeeID": this.replyEls.replyToEmployeeID || 0, //如果是回复的回复，则填写被回复的回复的发出人的ID
                            "fileInfos": [], //附件信息
                            "isSendSms": false //是否发送短信
                        },
                        "dataType": 'json',
                        "success": function(responseData) {
                            if (responseData.success) {
                                // that.getFeedReply(responseData.value);
                                mEls.replybbarEl.hide();
                                //mEls.replyinputEl.css('height', '20px').val('');
                                mEls.replyinputEl.val('').trigger('autosize.resize');
                                that.getReplyContent(mEls.feedId);
                                replyNumEl.text(parseInt(replyNumEl.text()) + 1);
                            }
                        }
                    }, {
                        "submitSelector": subBtnEl
                    });
                }
            }

        },
        /* 回复内容数据获取 */
        "getReplyContent": function(feedId) {
            var that = this;
            util.api({
                "url": '/Feed/GetFeedReplysByFeedID',
                type: 'get',
                "data": {
                    feedID: feedId,
                    pageSize: 10,
                    pageNumber: 1
                },
                "success": function(responseData) {
                    var data = responseData.value;
                    var itemEl = that.$el;
                    var feedreplyEl = $('.feed-reply', itemEl);
                    var mainItemFeed = $('.item-face', itemEl).attr('feedid');
                    var feedid = 0;
                    var employeeID = 0;
                    var senderName = '';
                    var ctime = '';
                    var feedText = '';
                    var profileImage = '';
                    var sourceDescription = '';
                    var feedreplylistStr = '';
                    var operationTypeStr = '';
                    var totalCount = data.totalCount; //总条数
                    var nextCount = totalCount - 10; //还有多少条数
                    var nextCountHtml = '';
                    if (nextCount > 0) {
                        nextCountHtml = '<div class="fs-reply-list-summary mt10" style="display: block;">后面还有<span class="num">' + nextCount + '</span>条回复，<a title="" href="#stream/showfeed/=/id-' + mainItemFeed + '/pn-2" class="jump-to-detail-l fs-switch-tpl-l">点击查看 &gt;&gt;</a></div>';
                    } else {
                        nextCountHtml = '';
                    }
                    _.each(data.items, function(item, index) {

                        feedid = item.feedReplyID;
                        senderName = item.sender.name;
                        employeeID = item.sender.employeeID;
                        profileImage = item.sender.profileImage;
                        ctime = util.getDateSummaryDesc(moment.unix(item.createTime), moment.unix(responseData.serviceTime), 1);
                        // feedText = pinLink(item.replyContent, item);
                        //判断回复人是不是自己
                        if (employeeID == currentUserData.employeeID) {
                            senderName = '我';
                        } else {
                            senderName = item.sender.name;
                        }
                        /* 正文格式化 */
                        var feedFormatContent = formatFeedContent(300, item);
                        var feedFormatContentOpenBtn = '';
                        var contentEllipsis = '';
                        var feedTextAll = feedFormatContent.leftHtml; //没截取过的正文
                        feedText = feedFormatContent.summaryHtml; //截取过的正文
                        //添加展开收起按钮
                        if (feedTextAll.length > 0) {
                            contentEllipsis = '<span class="feed-content-lefthtml hide">' + feedTextAll + '</span><span class="feed-content-ellipsis">&#8230;</span>';
                            feedFormatContentOpenBtn = '<br/><br/><a href="javascript:;" class="feed-reply-content-visible-h" feedwordnum="' + feedFormatContent.feedWordNum + '"> 展开正文，（共' + feedFormatContent.feedWordNum + '个字）</a>';
                        }

                        /* 来自哪里 */
                        if (item.source != 1) {
                            sourceDescription = '，来自' + item.sourceDescription;
                        }
                        /* 操作类型 */
                        switch (data.feedType) {
                            case 1: //分享
                                operationTypeStr = '';
                                break;
                            case 2: //日志
                                if (util.getPlanOperationType(item.operationType)) {
                                    operationTypeStr = '，' + util.getPlanOperationType(item.operationType);
                                } else {
                                    operationTypeStr = '';
                                }
                                break;
                            case 3: //指令
                                if (util.getWorkOperationTypeName(item.operationType)) {
                                    operationTypeStr = '，' + util.getWorkOperationTypeName(item.operationType);
                                } else {
                                    operationTypeStr = '';
                                }
                                break;
                            case 4: //审批
                                if (util.getApproveOperationTypeName(item.operationType)) {
                                    operationTypeStr = '，' + util.getApproveOperationTypeName(item.operationType);
                                } else {
                                    operationTypeStr = '';
                                }
                                break;
                            default:
                                operationTypeStr = '';
                                break;
                        }
                        /**
                         * 录音
                         * @type {[type]}
                         */
                        /*
                         var audio = item.audio;
                         var attachSize;
                         var attachPath;
                         var audioBtn;
                         var audioWarp;
                         if (audio) {
                         attachPath = audio.attachPath;
                         attachPath = util.getFileNamePath(attachPath) + '.mp3';
                         attachPath = util.getDfLink(attachPath, '', false, '');
                         attachSize = audio.attachSize;
                         
                         if (attachSize > 60 && attachSize < 60 * 60) {
                         attachSize = parseInt(attachSize / 60.0) + ':' + parseInt((parseFloat(attachSize / 60.0) -
                         parseInt(attachSize / 60.0)) * 60);
                         } else {
                         attachSize = '00:' + parseInt(attachSize);
                         }
                         audioBtn = '<div class="reply-audio-open-btn audio-btn">(' + attachSize + ')</div>';
                         
                         audioWarp = ' <div class="audio-warp"> <div class="reply-audio-close-btn audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div><div class="audio-box"></div></div>';
                         } else {
                         audioBtn = '';
                         attachPath = '';
                         audioWarp = '';
                         }
                         */
                        var audioBtn = '';
                        var attachPath = '';
                        var audioWarp = '';
                        
                        feedreplylistStr += '<div class="fs-reply-list-wrapper fn-clear"> <div class="fs-reply-list"> <div class="reply-item fs-list-item"> <div class="item-face"> <a href="#profile/=/empid-' + employeeID + '"> <img src="' + util.getAvatarLink(profileImage, '3') + '" alt=""></a> </div> <div class="item-detail" feedid="' + feedid + '" employeeid="' + employeeID + '"> <div class="item-info"> <div> <a href="#profile/=/empid-' + employeeID + '" class="aj-senderName" name="' + item.sender.name + '">' + senderName + '</a>：<span class="feed-summary-text">' + feedText + '</span>' + contentEllipsis + '(' + ctime + operationTypeStr + sourceDescription + ')' + feedFormatContentOpenBtn + '</div>  <div class="audio-el" >' + audioBtn + audioWarp + '</div></div> <div class="item-func fn-clear myreply preview-feed"> <div class="handle"> <a href="javascript:void(0);" class="aj-replysubmit-sub">回复</a> </div> </div> </div> </div> </div> </div>';

                    });


                    if (responseData.success) {

                        feedreplyEl.html(feedreplylistStr + nextCountHtml);
                    }
                }
            });
        },
        /**
         * 更新model重新render
         * @param callback
         */
        "updateModel": function(callback) {
            var that = this;
            var model = this.model,
                    elEl = this.$el;
            util.api({
                "url": "/Feed/GetFeedByFeedID",
                "type": "get",
                "data": {
                    "feedID": model.get('feedID')
                },
                "success": function(responseData) {
                    var tempListC = new ListC();
                    if (responseData.success) {
                        that.model.set(tempListC.parse(responseData)[0], {
                            "silent ": false //不触发change事件
                        });
                        //手动调用渲染
                        that.render();
                        callback && callback.call(that, responseData);
                    }
                }
            });
        },
        initialize: function() {
            //设置内部组件引用容器，供以后删除调用
            var model = this.model,
                    feedId = model.get('feedID');

            this.compStore = [];
            this.listenTo(this.model, "change ", this.render);
            this.getReplyContent(feedId);
        },
        render: function() {
            var model = this.model,
                    originData = model.get('originData');
            this.$el.addClass('fs-feed-item');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        renderCpt: function() {
            var inputEl,
                    mediaEl;
            inputEl = $('.preview-reply', this.$el);
            mediaEl = $('.media', this.$el);
            //at input
            this.atInput = new AtInput({
                "element": inputEl
            });

            this.media = new MediaMaker({
                "element": mediaEl,
                "action": ["at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    }
                }
            });
        },
        destroy: function() {
            //清空data meta
            this.$el.removeData();
            //尝试删除绑定的每个组件
            _.each(this.compStore, function(comp) {
                comp.destroy && comp.destroy();
            });
            this.compStore = [];
            this.atInput && this.atInput.destroy && this.atInput.destroy();
            this.atInput = null;
            this.media && this.media.destroy();
            this.media = null;
            //清空dom和内部绑定事件
            this.remove();
        }
    });
    exports.itemV = ItemV;
});