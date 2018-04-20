/**
 * 企信
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;

    var Overlay = require('overlay'),
        Position = require('position'),
        moduleStyle = require('modules/fs-qx/fs-qx.css'),
        moduleTpl=require('modules/fs-qx/fs-qx.html'),
        util = require('util'),
        moment = require('moment'),
        filter = require('filter'),
        json = require('json'),
        AudioPlayer = require('uilibs/audio-player'), //音频播放组件
        AttachPreview = require('modules/fs-attach/fs-attach-preview'),
        filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
        fsMap = require('modules/fs-map/fs-map'), //地图组件
        Scrollbar = require('scrollbar'), //滚动条
        fsQxhelper = require('./fs-qx-helper'),
        fsQxCore = require('./fs-qx-core');

    var moduleTplEl = $(moduleTpl),   //模板对应的jquery对象
        chatPanelNavItemCompiled = _.template(moduleTplEl.filter('.fs-qx-chat-item-tpl').html()),           //聊天面板左侧导航面板编译方法
        messageTextCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-text-tpl').html()),        //纯文本信息模板
        messageImgCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-img-tpl').html()),          //图片信息模板
        messageAttachCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-attach-tpl').html()),    //附件信息模板
        messageAudioCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-audio-tpl').html()),      //录音信息模板
        messageControlCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-control-tpl').html()),  //控制信息模板
        messageLocationCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-location-tpl').html()),//定位信息
        messageWorkNoticeCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-workNotice-tpl').html()),// 工作提醒
        messageLinkWorkSchduleCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-linkWorkSchdule-tpl').html()),// 工作提醒
        messageLinkWorkItemCompiled = _.template(moduleTplEl.filter('.fs-qx-message-item-linkWorkItem-tpl').html()),// 工作提醒
        participantCompiled = _.template(moduleTplEl.filter('.fs-qx-participant-item-tpl').html());         // 群对话成员列表模版

    var contactData = util.getContactData(),  //联系人数据
        loginUserData = contactData["u"]; //登录用户数据;

    var stringMatch = filter.stringMatch, //全词匹配
        startsWith = filter.startsWith;   //开头匹配
    var attachPreview = new AttachPreview().render();  //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    //地图定位
    var FsMapOverlay = fsMap.FsMapOverlay;
    var fsMapOverlay = new FsMapOverlay();

    var httpReg = new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?|www\\.[a-z0-9\\-]+(\\.[a-zA-Z]{2,4}){1,2}(:\\d+)?/?", "gi");
    var htmlTitle = FS.pageTitle;
    /**
     * 过滤特殊字符
     * @param text
     */
    var cutBadStr = util.cutBadStr;
    //注册显示企信对话路由
    util.tplRouterReg('#shortmessage/showsession/=/:id-:value');
    /**
     * 返回排除ids剩余employee data
     * @param ids
     */
    var excludeEmployee = function (ids) {
        ids = [].concat(ids);
        return _.reject(contactData["p"], function (itemData) {
            return _.some(ids, function (id) {
                return itemData.id == id;
            });
        });
    };
    /**
     * 上传组件，采用h5上传技术和flash fallback方案
     * @param opts
     * @constructor
     */
    var Uploader = fsQxhelper.Uploader;
    var QueryInput = fsQxhelper.QueryInput;
    var JoinDialog = fsQxhelper.JoinDialog;
    var QXModel = fsQxCore.QXModel,
        QXConfig = fsQxCore.config,
        constants = fsQxCore.constants;

    var ChatPanel = Overlay.extend({
        attrs: {
            "align": {
                selfXY: ['100%+242px', '100%'], // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT, // 基准定位元素，默认为当前可视区域
                baseXY: ['100%', '100%']        // 基准定位元素的定位点，默认为左上角
            },
            "className": "fs-chat-panel",
            "maxHisNum": 1000,   // 保存最大聊天历史记录
            "scrollToBottomThreshold": 410, // 消息框滚动到最底的阈值
            "scrollGetHistoryThreshold": 10, // 消息框滚动到顶部时获取历史消息的阈值
            "zIndex": 100,
            "activeIndex": -1,  // 当前激活chat item
            "joinDialog": null, // 邀请同事弹框对象
            "qxPanel": null     // 企信主列表面板，注意destroy时可能产生的问题
        },
        events: {
            'click': '_clickSelf',
            'click .fs-qx-chat-shown .fs-qx-chat-tbar .hide-l': '_clickMinBtn', // 显示状态下点击"-"会切换到最小化状态
            'click .fs-qx-chat-hidden .fs-qx-chat-title': '_clickHiddenTitle',   // 点击隐藏按钮切换到最大化
            'click .fs-qx-chat-shown .fs-qx-chat-tbar .close-l': '_switchToClosed', //显示状态下点击"x"会切换到关闭状态
            'click .fs-qx-chat-shown .open-dg-l': '_openJoinDialog', //打开邀请框
            'click .fs-qx-chat-shown .open-dg-btn': '_openJoinDialog', //打开邀请框
            'mouseenter .fs-qx-chat-shown .chat-item': '_enterChatItem',  //鼠标进入chat item
            'mouseleave .fs-qx-chat-shown .chat-item': '_leaveChatItem',  //鼠标离开 chat item
            'click .chat-nav-panel .chat-item-content': '_clickChatItemNav',  //点击chat item导航切换activeIndex
            'click .chat-nav-panel .remove-l': '_clickRemoveChatItemNav', //点击移除chat item导航
            'click .fs-qx-chat-shown .chat-title-edit-enable .chat-title-shown': '_clickChatTitleShown', //点击显示状态chat title
            'blur .fs-qx-chat-shown .chat-title-edit-enable .title-edit': '_blurChatTitleEdit',   //焦点离开title编辑框
            'keydown .fs-qx-chat-shown .chat-title-edit-enable .title-edit': '_keydownChatTitleEdit',   //title编辑框监听回车键控制
            'click .fs-qx-chat-shown .nav-up': '_clickNavUp',
            'click .fs-qx-chat-shown .nav-down': '_clickNavDown',
            'click .message-submit-wrapper .remove-l': '_clickUploadRemove', //点击上传文件删除按钮
            'click .message-submit-bbar .f-sub': '_clickSubmit',  //点击发送信息按钮
            'keydown .fs-qx-chat-shown .message-input': '_keydownInput',  // 输入事件
            'blur .fs-qx-chat-shown .message-input': '_blurInput',  // 输入事件
            'click .logout-btn': '_clickLogout',  //点击退出按钮
            'click .message-type-image .preview-l': '_previewImg',    //图片预览
            'click .message-type-image .img-wrapper': '_previewImg',  //图片预览
            'click .message-type-document .preview-l': '_previewAttach',  //附件预览
            'click .message-type-location .message-location': '_showLocation',    //显示定位
            'click .message-type-audio .ctr-btn': '_clickAudioPlay',   //点击音频播放按钮，去掉未读标志
            'click .state-offline-tip .close-tip-l': '_clickCloseOfflineTip', //点击关注不在线提示
            'click .message-type-workNotice .message-content': '_clickShowFeed', // 链接到工作提醒
            'click .message-type-linkWorkItem .message-content': '_clickShowWorkItem', // 链接到工作项
            'click .message-type-linkWorkSchdule .message-content': '_clickWorkSchdule' //链接到日程
        },
        setup: function () {
            var result = ChatPanel.superclass.setup.apply(this, arguments);
            this.participantPrefix = 'emp_';
            this.status = ""; // min, close, open
            this._updateStatus('close');
            this.sessionList = []; // 存储未读、已打开的session
            this.cacheSessionList = []; // 缓存新session
            this._setJoinDialog();
            this.audioCpts = [];  //音频对象容器
            this._bindEvents();
            return result;
        },

        /**
         * JoinDialog
         * @private
         */
        _setJoinDialog: function () {
            //创建邀请对话框
            this.joinDialog = new JoinDialog({
                "joinMinNum": 3,
                "joinMinNumTpl": "创建群对话至少需要选择{{joinMinNum}}位同事，请确认。"
            });

            this.joinDialog.set("moveLeftIntercept", function (joinSelectedData) {
                if (joinSelectedData.id == loginUserData.id) {
                    this.joinList.unselectItem(joinSelectedData.id);
                    return false;
                }
            });

            this.joinDialog.set("moveRightIntercept", function (unjoinSelectedData) {
                if (unjoinSelectedData.id == loginUserData.id) {
                    this.unjoinList.unselectItem(unjoinSelectedData.id);
                    return false;
                }
            });
        },

        /**
         * 打开JoinDialog
         * @param joinData
         * @param unjoinData
         * @param callback
         */
        showJoinDialog: function (joinData, unjoinData, callback) {
            var me = this,
                joinDialog = me.joinDialog;

            joinDialog.show();
            //设置邀请框初始数据
            joinDialog.setInitData({
                "joinData": joinData,
                "unjoinData": unjoinData
            });

            //设置动态回调
            joinDialog.set('successCb', function (joinData) {
                var participantsIDs = _.map(joinData, function (employeeData) {
                    return employeeData.id;
                });

                //设置群对话上限
                if (participantsIDs.length > 100) {
                    util.alert('群对话的人数上限为100位同事，请确认。', function () {});
                    return;
                }
                if(participantsIDs.length < 3){
                    util.alert('创建群对话至少需要选择3位同事，请确认。', function () {});
                    return;
                }
                callback && callback(participantsIDs);
            });
        },

        /**
         * 更新窗口的状态
         * @param status 状态：open/min/close
         * @private
         */
        _updateStatus: function (status) {
            var chatWinStatus = constants.chatWinStatus;
            if (_.contains(chatWinStatus, status)) {
                this.status = status;
                switch (status) {
                    case chatWinStatus.close :
                        this.hide();
                        this.element.hide();
                        this.stopAllAudio();
                        this.stopStarHtmlTitle();
                        QXModel.setDelay(true);
                        break;
                    case chatWinStatus.min :
                        var activeSession = this.getActiveSession();
                        if (activeSession) {
                            this.element.show();
                            this.element.find('.fs-qx-chat-shown').hide();
                            this.element.find('.fs-qx-chat-hidden .fs-qx-chat-title').html(activeSession.name).css({
                                'background': '#eaeaea',
                                'color': '#3d3d3d'
                            });
                            this.element.find('.fs-qx-chat-hidden .fs-qx-chat-tbar').removeClass('fs-qx-new-message');
                            this.element.find('.fs-qx-chat-hidden').show();
                        }
                        break;
                    case chatWinStatus.open :
                        if (this.get('activeIndex') == -1) {
                            if (this.sessionList.length == 0) {
                                return;
                            }
                            this.set('activeIndex', 0);
                        }
                        this.show();
                        this.element.find('.fs-qx-chat-shown').show();
                        this.element.find('.fs-qx-chat-hidden').hide();
                        this.element.find('.fs-qx-chat-tbar').attr('class', 'fs-qx-chat-tbar');
                        QXModel.setDelay(false);
                        break;
                }
            }
        },

        /**
         * 事件绑定处理
         * @private
         */
        _bindEvents: function () {
            var me = this;
            QXModel.on('qxSessionDiscussionAdd qxSessionSingleAdd', function (ids) {
                _.each(ids, function (id) {
                    var d = QXModel.getSessionData(id);
                    if(d.category == constants.sessionType.single){
                        for(var i = 0; i < me.sessionList.length; i++){
                            if(me.sessionList[i] == me.participantPrefix + d.sessionSubCategory){
                                me.sessionList[i] = d.id;
                                if(i == me.get('activeIndex')){
                                    // me._getMessages();
                                    $('.history-h', me.element).removeClass('state-disabled').attr('href', '#shortmessage/showsession/=/id-' + d.id);
                                }
                                return ;
                            }
                        }
                    }
                    if (d && d.notReadCount > 0) {
                        if(me.status == constants.chatWinStatus.open){
                            me.addSession(id);
                        }
                        else {
                            if(!_.contains(me.sessionList.concat(me.cacheSessionList), id)){
                                me.cacheSessionList.push(id);
                            }
                        }
                    }
                });
            });
            QXModel.on('qxSessionNewMessage', function (ids) {
                var activeSession = me.getActiveSession(),
                    activeSessionId = activeSession && activeSession.id;

                _.each(ids, function (id) {
                    var d = QXModel.getSessionData(id);
                    if (d.id == activeSessionId) {
                        if(me.status == constants.chatWinStatus.open) {
                            me._getMessages();
                        }
                        return ;
                    }
                    if (d && d.notReadCount > 0) {
                        if(me.status == constants.chatWinStatus.open){
                            me.addSession(id);
                        }
                        else {
                            if(!_.contains(me.sessionList.concat(me.cacheSessionList), id)){
                                me.cacheSessionList.push(id);
                            }
                        }
                    }
                });
            });
            // 群对话改名、成员变化
            QXModel.on('qxSessionDiscussionRename qxSessionDiscussionMemberChange', function (ids) {
                var elEl = me.element,
                    chatNavPanelEl = $('.chat-nav-panel', elEl),
                    chatItemsEl = $('.chat-item', chatNavPanelEl),
                    activeSession = me.getActiveSession(),
                    activeSessionId = activeSession && activeSession.id;
                _.each(ids, function (v) {
                    var index = _.indexOf(me.sessionList, v);
                    if(index == -1) return ;
                    var d = QXModel.getSessionData(v),
                        name = cutBadStr(d.name);
                    if(v == activeSessionId){
                        me._renderParticipant(d.participantIds);
                        me.element.find('.avatar-win-inner img').attr('src', d.portraitPath);
                        me.element.find('.chat-title-shown').html(name);
                    }
                    chatItemsEl.eq(index).html('<a href="javascript:;" title="' + name + '" class="chat-item-content fn-clear' + (d.notReadCount > 0 ? ' cic-come-on' : '') + '"><span class="avatar-wrapper fn-left"><img src="' + d.portraitPath + '" class="avatar-thumb" /></span><span class="chat-name fn-left">' + name + '</span></a><span class="remove-l">×</span>');
                })
            });
            // 删除群对话
            QXModel.on('qxSessionDiscussionDel', function (ids) {
                var flag = false;
                _.each(ids, function (id) {
                    var index = _.indexOf(me.sessionList, id), activeIndex = me.get('activeIndex');
                    if(index > -1){
                        me.removeSession(index);
                        if(index == activeIndex){
                            flag = true;
                        }
                    }
                    me.cacheSessionList = _.without(me.cacheSessionList, id);
                });
                var activeSession = me.getActiveSession();
                if(me.status == 'min' && flag){
                    if(activeSession){
                        me.element.find('.fs-qx-chat-hidden .fs-qx-chat-title').html(activeSession.name);
                    }
                    else {
                        me._updateStatus('close');
                    }
                }
                me.showNewMessageAlert(me.getUnreadMessageCount());
            });
            QXModel.on('qxNewMessage', function (id, messageList) {
                me.appendMessageListHtml(id, messageList);
            });

            // 未读数变化后
            QXModel.on('qxSessionNotReadCountChange', function (ids) {
                var activeIndex = me.get('activeIndex');
                _.each(ids, function (id) {
                    var d = QXModel.getSessionData(id), index = _.indexOf(me.sessionList, id);
                    if(index == -1) {
                        if(d.notReadCount == 0){
                            me.cacheSessionList = _.without(me.cacheSessionList, id);
                        }
                        return ;
                    }
                    var el = me.element.find('.chat-list .chat-item:eq('+ index +')').find(".chat-item-content");
                    if(d.notReadCount) {
                        if(activeIndex == index) return ;
                        if (me.status == constants.chatWinStatus.open) {
                            util.toggleAnimate({
                                "element": el,
                                "startProperty": {
                                    "backgroundColor": "#f4f4f4"
                                },
                                "endProperty": {
                                    "backgroundColor": "#fff1ba"
                                },
                                "animateOpts": {
                                    "easing": "swing",
                                    "duration": 260,
                                    "complete": function () {
                                        var activeIndex = me.get('activeIndex');
                                        //如果动画进行中切换到当前栏，最后要清除动画效果
                                        if (activeIndex > -1 && me.sessionList[activeIndex] == id) {
                                            el.css({
                                                "background": "transparent",
                                                "color": "#767573"
                                            });
                                        }
                                    }
                                },
                                "count": 2   //循环2次
                            });
                        }
                        el.addClass('cic-come-on');
                    }
                    else {
                        el.removeClass('cic-come-on').removeAttr('style');
                    }
                });
                var count = me.getUnreadMessageCount();
                me.showNewMessageAlert(count);
                if (count) {
                    me.openNewMessageSound();
                    me.starHtmlTitle();
                }
                else {
                    me.stopAllAudio();
                    me.stopStarHtmlTitle();
                }
            });
            $('body').on('click', '.js-qx-quick-reply', function () {
                var $this = $(this),
                    employeeid,
                    sessionId = $this.attr('data-sessionid');
                if(!sessionId) {
                    employeeid = $this.attr('data-employeeid');
                    sessionId = me.participantPrefix + employeeid;
                }
                me.openChat(sessionId);
                return false;
            });
            //随window的scroll和重新定位element位置
            $(root).scroll(function () {
                me._setPosition();
            });
            $('body').click(function () {
                if (me.status == constants.chatWinStatus.open) {
                    me._clickMinBtn();
                }
            });
        },
        // 绑定滚动事件
        _bindScrollEvents: function () {
            var me = this,
                $el = me.element,
                messageListWrapper = $el.find('.message-list-wrapper');
            messageListWrapper.on('scroll', function(){
                var $this = $(this);
                if($this.data('scroll_timer')){
                    return ;
                }
                $this.data('scroll_timer', setTimeout(function(){
                    var top = $this.scrollTop(),
                        activeSession = me.getActiveSession(),
                        index = me.get('activeIndex');
                    if(index == -1 || !activeSession){
                        $this.data('scroll_timer', null);
                        return false;
                    }
                    var curMessageList = messageListWrapper.find('.message-list').eq(index),
                        previousMessageId = curMessageList.find('li:first-child').attr('previousMessageId');

                    if(!curMessageList.data('posting') &&   // 当前会话没有正在请求历史数据
                        previousMessageId &&                // 确保有previousMessageId
                        previousMessageId > activeSession.epochMessageId && // previousMessageId得大于session的epochMessageId
                        top < $this.data('old_scroll_top') &&   // 简单的确保是向上滚动
                        top < me.get('scrollGetHistoryThreshold')){ // 滚动到指定返回时触发
                        curMessageList.data('posting', true);
                        QXModel.ajax({
                            url: QXConfig.url.getMessages,
                            data: {
                                sessionId: activeSession.id,
                                fromMessageId: previousMessageId
                            },
                            success: function(res){
                                var html = "", messageList, audios = [];
                                if(res.success && res.value &&
                                    res.value.messageList && res.value.messageList.length){
                                    messageList = res.value.messageList.reverse();

                                    _.each(messageList, function (item) {
                                        html += me.getMessageItemHtml(activeSession, item);
                                        if(item.messageType == constants.messageType.audio){
                                            var c = json.parse(item.content);
                                            audios.push({
                                                id: item.messageId,
                                                file: me.getMp3Url(c.File),
                                                duration: c.Duration,
                                                style: item.senderId == loginUserData.id ? 3 : 2
                                            })
                                        }
                                    });
                                    if(html){
                                        var _h = curMessageList.height();
                                        curMessageList.prepend(html);
                                        me.messageListWrapper.scrollTop(curMessageList.height() - _h);
                                    }
                                    if(audios.length){
                                        _.each(audios, function (a) {
                                            new AudioPlayer({
                                                "element": $("#js_message_" + a.id),
                                                "audioSrc": a.file,
                                                "themeStyle": a.style,
                                                "length": a.duration
                                            })
                                        });
                                    }
                                }
                            },
                            complete: function () {
                                $this.data('scroll_timer', null);
                                curMessageList.data('posting', false);
                            }
                        });
                    }
                    else {
                        $this.data('scroll_timer', null);
                    }
                    $this.data('old_scroll_top', top);
                }, 50));
            });
        },

        /**
         * 阻止冒泡
         * @param evt
         * @private
         */
        _clickSelf: function (evt) {
            evt && evt.stopPropagation();  //阻止事件冒泡
        },

        /**
         * 点击chat item导航触发
         * @param evt
         * @private
         */
        _clickChatItemNav: function (evt) {
            var elEl = this.element,
                chatNavPanelEl = $('.chat-nav-panel', elEl),
                chatItemEl = $(evt.currentTarget).closest('.chat-item'),
                chatItemsEl = $('.chat-item', chatNavPanelEl);
            this.set('activeIndex', chatItemsEl.index(chatItemEl));
        },

        _enterChatItem: function (evt) {
            $('.remove-l', $(evt.currentTarget)).show();
        },

        _leaveChatItem: function (evt) {
            $('.remove-l', $(evt.currentTarget)).hide();
        },

        /**
         * 点击移除按钮移除chat item导航
         * @private
         */
        _clickRemoveChatItemNav: function (evt) {
            this.removeSession($(evt.currentTarget).closest('.chat-item').index()); // 移除对应的session数据存储
        },

        /**
         * 点击提示信息数量打开聊天窗口
         * @param evt
         * @private
         */
        _clickHiddenTitle: function (evt) {
            if (this.sessionList.length > 0) {
                var activeIndex = this.get('activeIndex');

                activeIndex = activeIndex < 0 ? 0 : activeIndex;
                this.openChat(this.sessionList[activeIndex]);
            }
            else if(this.cacheSessionList.length){
                this.openChat(this.cacheSessionList[0]);
            }
            evt && evt.preventDefault();
        },

        /**
         * 最小化聊天窗口
         * @param evt
         * @private
         */
        _clickMinBtn: function (evt) {
            var me = this;
            if(this.status == 'open') {
                me._updateStatus('min');
            }
            evt && evt.preventDefault();
        },

        /**
         * 关闭聊天窗口
         * @param evt
         * @private
         */
        _switchToClosed: function (evt) {
            this._updateStatus('close');
            evt && evt.preventDefault();
        },

        /**
         * 点击聊天面板名称
         * @param evt
         * @private
         */
        _clickChatTitleShown: function (evt) {
            var meEl = $(evt.currentTarget),
                chatTitleEl = meEl.closest('.fs-qx-chat-title'),
                editInputEl = $('.title-edit', chatTitleEl),
                joinNumEl = $('.join-num', chatTitleEl);
            var activeSession = this.getActiveSession();
            if (!meEl.hasClass('state-disabled') || activeSession == constants.sessionType.discussion) {
                meEl.hide();
                joinNumEl.hide();
                editInputEl.val(activeSession.defaultName).show().get(0).focus();
            }
            evt.preventDefault();
        },

        /**
         * 点击回车后焦点离开title编辑框
         * @private
         */
        _keydownChatTitleEdit: function (evt) {
            if (evt.keyCode == 13) {
                $(evt.currentTarget).blur();
            }
        },

        /**
         * 焦点离开title编辑框触发
         * @private
         */
        _blurChatTitleEdit: function (evt) {
            var inputEl = $(evt.currentTarget),
                chatTitleEl = inputEl.closest('.fs-qx-chat-title'),
                titleShownEl = $('.chat-title-shown', chatTitleEl),
                joinNumEl = $('.join-num', chatTitleEl);
            var val = _.str.trim(inputEl.val());
            var activeSessionData = this.getActiveSession();
            //验证
            if (val != activeSessionData.defaultName) {
                if (val.length > 200) {
                    util.alert('请控制名称在200字内');
                    return;
                }
                if(inputEl.data('status')){
                    return false;
                }
                inputEl.data('status', 'posting');
                QXModel.changeDiscussionName(activeSessionData.id, val, function (res) {
                    if (res.success) {
                        titleShownEl.show();
                        joinNumEl.show();
                        inputEl.hide();
                    }
                }, function () {
                    inputEl.data('status', null);
                });
            }
            else {
                titleShownEl.show();
                joinNumEl.show();
                inputEl.hide();
            }
        },

        _clickLogout: function (evt) {
            var activeSession = this.getActiveSession();
            var elEl = this.element,
                chatNavPanelEl = $('.chat-nav-panel', elEl),
                chatItemsEl = $('.chat-item', chatNavPanelEl),
                activeChatItemEl = chatItemsEl.eq(this.get('activeIndex'));
            var qxPanel = this.get('qxPanel');
            util.confirm("是否要确定退出并删除当前群对话", " ", function (evt) {
                var that = this;
                QXModel.exitDiscussionSession(activeSession.id, {
                    "submitSelector": $(evt.currentTarget)
                }, function () {
                    that.hide();
                    $('.remove-l', activeChatItemEl).click();
                });
            }, {
                "messageType": "question",
                "autoHide": false    //需要手动隐藏弹框
            });
            evt && evt.preventDefault();
        },

        _clickNavDown: function (evt) {
            var elEl = this.element,
                chatNavListWEl = $('.chat-nav-panel .chat-list-wrapper', elEl),
                chatNavListEl = $('.chat-list', chatNavListWEl);
            var scrollTop = chatNavListWEl.scrollTop(),
                listWH = chatNavListWEl.height(),
                listH = chatNavListEl.height();
            if (scrollTop + listWH < (listH + 4)) {
                chatNavListWEl.scrollTop(scrollTop + 32);
            }
            evt.preventDefault();
        },

        _clickNavUp: function (evt) {
            var elEl = this.element,
                chatNavListWEl = $('.chat-nav-panel .chat-list-wrapper', elEl);
            var scrollTop = chatNavListWEl.scrollTop();
            if (scrollTop > 0) {
                chatNavListWEl.scrollTop(scrollTop - 32);
            }
            evt.preventDefault();
        },

        _clickUploadRemove: function (evt) {
            var elEl = this.element,
                messageSubmitWEl = $('.message-submit-wrapper', elEl),
                uploadEl = $('.upload-file', messageSubmitWEl);
            var fileId = uploadEl.attr('fileid'),
                uploadType = uploadEl.attr('uploadtype');
            this.imgUploader.setDisable(false);
            this.attachUploader.setDisable(false);
            this[uploadType + "Uploader"].removeFile(fileId);

            messageSubmitWEl.removeClass('with-upload');
            evt.preventDefault();
        },

        /**
         * 点击发送信息
         * @param evt
         * @private
         */
        _clickSubmit: function (evt) {
            var me = this;
            var qxPanel = this.get('qxPanel');
            var elEl = this.element,
                modalEl = $('.message-submit-wrapper .submit-modal', elEl),
                uploadEl = $('.message-submit-wrapper .upload-file', elEl),
                removeUploadEl = $('.remove-l', uploadEl),
                inputEl = $('.message-input', elEl);   //聊天记录
            var inputValue = _.str.trim(inputEl.val());
            var activeIndex = this.get('activeIndex'),
                sessionId = this.sessionList[activeIndex];
            if (uploadEl.is(':hidden') && inputValue.length == 0) {
                util.showInputError(inputEl);
                return false;
            }
            evt.preventDefault();
            //字数限制
            if (inputValue.length > 2000) {
                util.alert('发布内容不能超过2000字，目前已超出<em>' + (inputValue.length - 2000) + '</em>个字');
                return;
            }
            //开启遮罩
            modalEl.show();
            //保证输入框失去焦点
            try {
                inputEl.get(0).blur();
            } catch (e) {
            }

            this._sendMessage(function (fileInfos) {
                var data = {
                        content: inputValue,
                        fileInfo: fileInfos[0]
                    },
                    _id = sessionId, _s,
                    idInfo = me.getSessionIdInfoByIdStr(sessionId);
                if(idInfo.type == 'sessionId'){
                    data.sessionId = idInfo.id;
                    _s = QXModel.getSessionData(idInfo.id);
                    if(_s.category == constants.sessionType.single){
                        _id = me.participantPrefix + _s.sessionSubCategory;
                    }
                }
                else{
                    data.participantId = idInfo.id;
                }
                QXModel.sendMessage({
                    "data": data,
                    "complete": function () {
                        modalEl.hide();  //完成后遮罩隐藏，无论成功失败
                    },
                    "success": function (res) {
                        //一些清理
                        if (res.success) {
                            //先移除上传项
                            if (fileInfos.length > 0) {
                                removeUploadEl.click();
                            }
                            //清空输入框
                            inputEl.val("");
                            me._removels(_id);
                            inputEl.focus();
                            me.messageListWrapper.scrollTop(900000);
                        }
                    }
                });
            }, function () {   //上传失败回调
                util.alert('上传附件失败，请重试');
                modalEl.hide();
            });
            evt && evt.preventDefault();
        },

        /**
         * 图片预览
         * @param evt
         * @private
         */
        _previewImg: function (evt) {
            var meEl = $(evt.currentTarget);
            var path = meEl.attr('path');
            var attachData = json.parse(decodeURIComponent(meEl.attr('attachdata')));
            attachPreview.preview({
                "type": "img",
                "data": [
                    {
                        "previewPath": attachData.HDImg || attachData.Image,
                        "originPath": attachData.Image,
                        "thumbPath": attachData.Thumbnail,
                        "createTime": attachData.createTime,
                        "fileName": attachData.N,
                        "fileSize": attachData.FileSize,
                        "fileId": attachData.attachID
                    }
                ],
                "refId": 0,
                "belongToType": "newqx"
            });
           evt && evt.preventDefault();
        },

        /**
         * 文件预览
         * @param evt
         * @private
         */
        _previewAttach: function (evt) {
            var meEl = $(evt.currentTarget);
            var path = meEl.attr('path');
            var attachData = json.parse(decodeURIComponent(meEl.attr('attachdata')));
            fileReader.readFile({
                "fileId": util.getFileNamePath(attachData.File),
                "fileName": attachData.Name,
                "filePath": attachData.File
            });
            evt && evt.preventDefault();
        },
        /**
         * 定位
         * @private
         */
        _showLocation: function (evt) {
            var $this = $(evt.currentTarget);
            fsMapOverlay.fixLocation({
                latitude: $this.attr("data-latitude"),
                longitude: $this.attr("data-longitude"),
                address: $this.attr("data-address"),
                createTime: $this.attr("data-createTime")
            }, {
                "showQd": false  //不显示签到信息
            });
            evt.preventDefault();
        },
        _clickShowFeed: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            tpl.navRouter.navigate('#stream/showfeed/=/id-' + id + '/datalighted-app|workmessage', { trigger: true });
            evt.preventDefault();
        },
        _clickWorkSchdule: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            tpl.navRouter.navigate('#stream/showfeed/=/id-' + id, { trigger: true });
            evt.preventDefault();
        },
        _clickShowWorkItem: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            tpl.navRouter.navigate('#stream/showfeed/=/id-' + id, { trigger: true });
            evt.preventDefault();
        },
        _clickAudioPlay: function (evt) {
            evt && evt.preventDefault();
        },
        /**
         * 发送消息
         * @param evt
         * @private
         */
        _keydownInput: function (evt) {
            if (evt.keyCode == 13) {
                $('.fs-qx-chat-shown .f-sub', this.element).click();
                evt.preventDefault();   //阻止用户输入换行符
            }
        },

        _blurInput: function (evt) {
            var val = $('.message-input', this.element).val();
            if (val) {
                var sessionData = this.getActiveSession(), id = sessionData.id;
                if(sessionData.category == constants.sessionType.single){
                    id = this.participantPrefix + sessionData.sessionSubCategory;
                }
                this._setls(id, val);
            }
            evt && evt.preventDefault();
        },

        _openJoinDialog: function (evt) {
            var activeSessionData = this.getActiveSession();

            if (activeSessionData.category == constants.sessionType.discussion) {
                this.openInviteJoinDialog();
            }
            else if(activeSessionData.category == constants.sessionType.single){
                var joinData = [], participantIds = activeSessionData.participantIds;

                _.each(participantIds, function (participantId) {
                    var _u = util.getContactDataById(participantId, 'p');
                    if(_u){
                        joinData.push(_u);
                    }
                });
                this.createDiscussionSession(joinData, excludeEmployee(participantIds), function () {});
            }
            else {
                this.createDiscussionSession([loginUserData], excludeEmployee(loginUserData.id), function () {
                });
            }
            evt && evt.preventDefault();
        },

        /**
         * 打开邀请、踢出群对话成员窗口
         */
        openInviteJoinDialog: function () {
            var me = this,
                activeSessionData = me.getActiveSession(),
                participantIds = activeSessionData.participantIds,
            //设置初始化数据
                joinData = [];
            _.each(participantIds, function (participantId) {
                var _u = util.getContactDataById(participantId, 'p');
                if(_u){
                    joinData.push(_u);
                }
            });
            me.showJoinDialog(joinData, excludeEmployee(participantIds), function () {
                var dataState = me.joinDialog.joinList.getDataState(),
                    data = {};

                data.addParticipantsIDs = [];
                if (dataState.add.length > 0) {
                    _.each(dataState.add, function (p) {
                        data.addParticipantsIDs.push(p.id);
                    });
                }

                data.delParticipantsIDs = [];
                if (dataState.lost.length > 0) {
                    _.each(dataState.lost, function (p) {
                        data.delParticipantsIDs.push(p.id)
                    });
                }

                if (data) {
                    data.sessionId = activeSessionData.id;
                    QXModel.inviteDiscussionParticipants(data, function () {
                        me.joinDialog.hide();
                    }, {
                        "submitSelector":$('.f-sub', me.joinDialog.element)
                    });
                }
            });
        },

        createDiscussionSession: function (joinData, unJoinData) {
            var me = this;
            me.showJoinDialog(joinData, unJoinData, function (ids) {
                QXModel.createDiscussionSession(ids, function (id) {
                    me.openChat(id);
                    me.joinDialog.hide();
                }, {
                    "submitSelector":$('.f-sub', me.joinDialog.element)
                });
            });
        },
        /**
         * 页面title显示新消息comming
         */
        starHtmlTitle: function () {
            var count = 0;
            clearInterval(this.starHtmlTitleTid);
            this.starHtmlTitleTid = setInterval(function () {
                if (count % 2 == 0) {
                    document.title = '【新企信】' + htmlTitle;
                } else {
                    document.title = '【　　　】' + htmlTitle;
                }
                count++;
            }, 1000);
        },
        /**
         * 停止点亮html title
         */
        stopStarHtmlTitle: function () {
            clearInterval(this.starHtmlTitleTid);
            document.title = htmlTitle;
        },
        /**
         * 新消息comming提示音
         */
        openNewMessageSound: function () {
            var newMessageAlertPlayer = this.newMessageAlertPlayer;

            if (!newMessageAlertPlayer) {
                var audioBoxEl = $('<div class="fn-hide-abs"></div>');
                audioBoxEl.appendTo('body');
                newMessageAlertPlayer = new AudioPlayer({
                    "element": audioBoxEl,
                    "audioSrc": FS.MODULE_PATH + '/fs-qx/shortmessage.mp3'
                });
                newMessageAlertPlayer.shadowEl = audioBoxEl;
                this.newMessageAlertPlayer = newMessageAlertPlayer;
            }
            newMessageAlertPlayer.play();
        },
        /**
         * 发送消息
         * @private
         */
        _sendMessage: function (uploadedCb, errorCb) {
            var that = this;
            var elEl = this.element,
                uploadEl = $('.message-submit-wrapper .upload-file', elEl);
            var uploadType = uploadEl.attr('uploadtype'),
                fileId = uploadEl.attr('fileid'),
                uploader;
            if (uploadEl.is(':visible')) {
                uploader = this[uploadType + 'Uploader'];
                this.on('uploaded', function (file, responseText, uploadType) {
                    var responseData = json.parse(responseText),
                        fileInfos = [];
                    if (responseData.success) {
                        fileInfos.push({
                            "value": uploadType == "img" ? 2 : 3, //FeedAttachType
                            "value1": responseData.value.filePath,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                        uploadedCb.call(that, fileInfos, uploadType);
                        //uploader.removeFile(fileId);
                    } else {
                        errorCb && errorCb.call(that);
                    }
                    that.off('uploaded');
                    that.off('uploadederror');
                });
                this.on('uploadederror', function () {
                    errorCb && errorCb.call(that);
                    that.off('uploadederror');
                    that.off('uploaded');
                });
                uploader.startUpload();
            }
            else {
                uploadedCb.call(that, [], uploadType);
            }
        },

        /**
         * 渲染一个新chat item
         * @param id
         * @private
         */
        _renderNewChatItem: function (id) {
            if (!id) return ;
            var me = this,
                sessionData = me.getSessionData(id);
            if(!sessionData) return ;
            var _n = $(chatPanelNavItemCompiled({
                'portraitPath': sessionData.portraitPath || FS.BLANK_IMG,
                'name': cutBadStr(sessionData.name) || '',
                'id': sessionData.id || ''
            })).appendTo($('.chat-list', this.element)).find('.chat-item-content');
            if(sessionData.notReadCount > 0){
                if (this.status == constants.chatWinStatus.open) {
                    util.toggleAnimate({
                        "element": _n,
                        "startProperty": {
                            "backgroundColor": "#f4f4f4"
                        },
                        "endProperty": {
                            "backgroundColor": "#fff1ba"
                        },
                        "animateOpts": {
                            "easing": "swing",
                            "duration": 260,
                            "complete": function () {
                                var activeIndex = me.get('activeIndex');
                                //如果动画进行中切换到当前栏，最后要清除动画效果
                                if (activeIndex > -1 && me.sessionList[activeIndex] == id) {
                                    _n.css({
                                        "background": "transparent",
                                        "color": "#767573"
                                    });
                                }
                            }
                        },
                        "count": 2   //循环2次
                    });
                }
                _n.addClass('cic-come-on');
            }
            $('.message-list-wrapper', this.element).append('<ul class="message-list"></ul>');
            if (this.status == constants.chatWinStatus.open) {
                this._adjustNavScrollTop();
            }
            this.updateChatItem();
        },

        /**
         * 获取当前激活的session数据
         */
        getActiveSession: function () {
            var activeIndex = this.get('activeIndex');

            if (activeIndex == -1) return null;

            var sessionList = this.sessionList,
                activeSessionData = null;

            if (sessionList && sessionList.length > 0 && activeIndex > -1) {
                activeSessionData = this.getSessionData(sessionList[activeIndex]);
            }

            return activeSessionData;
        },

        /**
         * 删除对应index的session数据
         * @param index
         */
        removeSession: function (index) {
            if (index == -1) return;
            var me = this,
                len = me.sessionList.length,
                activeIndex = me.get('activeIndex'),
                elEl = me.element;
            QXModel.setSessionData(me.sessionList[index], {readMessageId: null});
            me.sessionList.splice(index, 1);
            elEl.find('.chat-list .chat-item').eq(index).remove();     // 移除左侧导航
            elEl.find('.message-list-wrapper .message-list').eq(index).remove();  // 移除聊天内容
            me.updateChatItem();

            if (index < activeIndex) {
                this.set('activeIndex', activeIndex - 1, {
                    "silent": true   // 不触发change事件
                });

                // 聊天窗口为打开状态时，调整左侧导航位置
                if (me.status == 'open') {
                    me._adjustNavScrollTop();
                }
            }
            else if (index == activeIndex) {
                if (index == len - 1) {
                    this.set('activeIndex', index - 1); // 如果index在原来队尾，activeIndex需要前移一位
                }
                else {
                    this._onRenderActiveIndex(index);   // activeIndex值不变，手动调用_onRenderActiveIndex方法
                }
            }
        },

        /**
         * 添加新session
         * @param id
         */
        addSession: function (id) {
            var me = this;
            if (!_.contains(me.sessionList, id)) {
                me.sessionList.push(id);
                me._renderNewChatItem(id);
            }
        },

        /**
         * 渲染群对话成员
         * @param ids
         * @private
         */
        _renderParticipant: function (ids) {
            // if (ids.length < 2) return;
            var html = "";
            $('.join-num .num', this.element).html(ids.length);
            _.each(ids, function (id) {
                if (id) {
                    var u = util.getContactDataById(id, 'p');
                    if (u) {// filter掉离职者
                        html += participantCompiled({
                            id: u.id,
                            name: cutBadStr(u.name),
                            avatar: util.getAvatarLink(u.profileImagePath, 3)
                        });
                    }
                }
            });
            $('.participant-list-wrapper', this.element).html('<ul class="participant-list">' + html + '</ul>');
        },

        /**
         * 渲染当前激活的session信息
         * @private
         */
        _renderActiveSessionInfo: function () {
            var me = this,
                activeIndex = this.get('activeIndex'),
                activeSessionData = me.getActiveSession();
            if (!activeSessionData) return;

            var sessionType = activeSessionData.category,
                _sessionName = activeSessionData.name,
                sessionName = cutBadStr(_sessionName);

            var elEl = this.element,
                chatTitleWEl = $('.fs-qx-chat-shown .fs-qx-chat-title', elEl),
                avatarEl = $('.fs-qx-chat-shown .avatar-win', elEl),
                titleShownEl = $('.chat-title-shown', chatTitleWEl),
                chatListWEl = $('.chat-list-wrapper', elEl),   //chat list导航
                activeChatItemEl = $('.chat-item', chatListWEl).eq(activeIndex),
                navAvatarThumbEl = $('.avatar-thumb', activeChatItemEl),
                navChatNameEl = $('.chat-name', activeChatItemEl),
                historyHEl = $('.history-h', elEl);    //聊天记录

            var _href = 'javascript:void(0)';
            // 单聊
            if (sessionType == constants.sessionType.single) {
                titleShownEl.attr('href', '#profile/=/empid-' + activeSessionData.sessionSubCategory);

                _href = '#profile/=/empid-' + activeSessionData.sessionSubCategory;
            }
            // 群对话
            else if (sessionType == constants.sessionType.discussion) {
                titleShownEl.attr('href', 'javascript:;');

                // 渲染参与者
                me._renderParticipant(activeSessionData.participantIds);
            }

            avatarEl.html('<a class="avatar-win-inner" title="' + sessionName + '" href="' + _href + '"><img width="50" height="50" src="' + activeSessionData.portraitPath + '" class="avatar-thumb" /></a>');
            navAvatarThumbEl.attr('src', activeSessionData.portraitPath);

            // chat面板tbar和左右边栏信息
            titleShownEl.html(sessionName); //先隐藏再显示出来
            navChatNameEl.html(sessionName);

            //设置聊天记录地址
            if(activeSessionData.id) {
                historyHEl.removeClass('state-disabled').attr('href', '#shortmessage/showsession/=/id-' + activeSessionData.id);
            }
            else {
                historyHEl.addClass('state-disabled');
            }

            me.updateLayout();
        },

        _setls: function (id, val) {
            try {
                var content = window.store.get(constants.localStrorageName);
                if (content) {
                    content = json.parse(content);
                    if (content[id]) {
                        content[id] = val;
                    }
                    else {
                        if (content.queue >= 20) {
                            content.queue.shift();
                            delete content[id];
                        }
                        content.queue.push(id);
                        content[id] = val;
                    }

                }
                else {
                    content = {};
                    content[id] = val;
                    content.queue = [id]
                }
                window.store.set(constants.localStrorageName, json.stringify(content));
            } catch (e) {
            }
        },

        _getls: function (id) {
            var con = "";
            try {
                con = json.parse(window.store.get(constants.localStrorageName))[id];
            } catch (e) {
            }
            return con;
        },

        _removels: function (id) {
            try {
                var content = window.store.get(constants.localStrorageName);
                content = json.parse(content);
                if (content && content[id]) {
                    _.each(content.queue, function (v, k) {
                        if (v == id) {
                            content.queue.splice(k, 1)
                        }
                    });
                    delete content[id];
                    window.store.set(constants.localStrorageName, json.stringify(content));
                }
            } catch (e) {
            }

        },

        /**
         * 自适应scrollTop
         * @private
         */
        _adjustNavScrollTop: function () {
            var elEl = this.element,
                chatNavListWEl = $('.chat-nav-panel .chat-list-wrapper', elEl),
                chatListEl = $('.chat-list', elEl),
                activeChatNavEl = $('.state-active', chatListEl),  //被激活的导航
                activeIndex = $('.chat-item', chatListEl).index(activeChatNavEl);
            var wHeight = chatNavListWEl.height(),
                height = chatListEl.height();

            chatNavListWEl.scrollTop(0);
            if (height > wHeight) {
                if (activeChatNavEl.length > 0) {  //如果存在激活导航，保证激活导航可见
                    if ((activeIndex + 2) * 32 + 4 > wHeight) {
                        chatNavListWEl.scrollTop((activeIndex + 2) * 32 - wHeight + 4);
                    }
                } else {
                    chatNavListWEl.scrollTop(height - wHeight + 10);    //滚动到最底部
                }
            } else {
                chatNavListWEl.scrollTop(0);
            }
        },

        /**
         * 设置activeIndex时触发
         * @param activeIndex
         * @private
         */
        _onRenderActiveIndex: function (activeIndex) {
            var me = this,
                elEl = me.element,
                chatItemEl,
                sessionData, id,
                activeChatItemEl;

            if (activeIndex >= 0) {
                chatItemEl = $('.chat-item', elEl);
                activeChatItemEl = chatItemEl.eq(activeIndex);        //当前激活的item dom
                sessionData = me.getActiveSession();
                id = sessionData.category == constants.sessionType.single ? me.participantPrefix + sessionData.sessionSubCategory : sessionData.id;

                chatItemEl.removeClass('state-active');
                activeChatItemEl.show().addClass('state-active');   //激活当前导航条
                $('a', activeChatItemEl).stop().removeAttr('style').removeClass('cic-come-on'); //去掉当前激活当前导航条新消息高亮提示
                elEl.find('.message-list-wrapper .message-list').eq(activeIndex).show().siblings().hide();
                $('.message-input', elEl).val(me._getls(id));
                me._renderActiveSessionInfo();
                me._getMessages();
            }
            else {
                me._updateStatus('close')
            }
        },

        /**
         * 获取当前会话的最新消息
         * @private
         */
        _getMessages: function () {
            var me = this,
                activeIndex = me.get("activeIndex"),
                activeSession = me.getActiveSession(),
                sessionId = activeSession && activeSession.id;
            if (activeIndex == -1 || !activeSession || !sessionId) return;

            QXModel.getMessages(sessionId, function (messageList) {});
        },

        /**
         * 根据createTime unix时间戳获取时间的文本显示
         * @param createTime
         */
        getFormatCreateTime: function (createTime) {
            createTime = moment(createTime);
            var baseTime = this.serverTime ? moment.unix(this.serviceTime) : moment(),
                formatTime = '',
                year = createTime.year(),
                month = createTime.month(),
                date = createTime.date();

            if (baseTime.year() != createTime.year()) {
                formatTime += year + '-';
            }
            if (baseTime.month() != month || baseTime.date() != date) {
                formatTime += (month + 1) + '-' + date;
            }
            formatTime += ' ' + createTime.format('HH:mm');
            return formatTime;
        },

        /**
         * 根据messageType获取对应的key
         * @param messageType
         */
        getMessageTypeKey: function (messageType) {
            var key = null, messageTypes = constants.messageType;
            for (var i in messageTypes) {
                if (messageTypes.hasOwnProperty(i) && messageTypes[i] == messageType) {
                    key = i;
                }
            }
            return key;
        },

        updateChatItem: function () {
            //左侧chat item导航显隐控制
            if (this.sessionList.length > 1) {
                $('.chat-nav-panel', this.element).show();
            }
            else {
                $('.chat-nav-panel', this.element).hide();
            }
        },

        /**
         * 关闭所有的语音播放
         */
        stopAllAudio: function () {
            _.each(this.audioCpts, function (audioPlayer) {
                audioPlayer.stop();
            });
        },

        /**
         * 更新面板布局，左侧和右侧边栏
         * @private
         */
        updateLayout: function () {
            var elEl = this.element,
                chatTbarEl = $('.fs-qx-chat-shown .fs-qx-chat-tbar', elEl),
                chatTitleWEl = $('.fs-qx-chat-shown .fs-qx-chat-title', elEl),
                chatTitleShownEl = $('.chat-title-shown', chatTitleWEl),
                joinNumEl = $('.join-num', chatTitleWEl), //参与人数
                openDgLinkEl = $('.open-dg-l', chatTbarEl),  //点击添加用户按钮
                openDgBtnEl = $('.fs-qx-chat-shown .open-dg-btn', elEl),    //打开邀请人按钮
                logoutBtnEl = $('.fs-qx-chat-shown .logout-btn', elEl), //退出按钮
                chatNavPanelEl = $('.chat-nav-panel', elEl),
                chatMessagePanelEl = $('.chat-message-panel', elEl),
                messageSubmitWEl = $('.message-submit-wrapper', elEl),
                messageInputEl = $('.message-input', elEl),    //输入框
                participantPanelEl = $('.participant-panel', elEl),
                messageListWEl = $('.message-list-wrapper', elEl), //消息列表框
                messageSubmitBtnEl = $('.message-submit-bbar .f-sub', elEl);   //提交按钮

            var activeIndex = this.get('activeIndex'),
                activeSessionData = this.getActiveSession();

            //ie6/7要控制聊天框tbar宽度
            var htmlEl = $('html');
            if (htmlEl.hasClass('lt-ie8')) {
                chatTbarEl.removeAttr('style');
            }
            this.updateChatItem();

            //先开启可输入方式
            if (!messageSubmitWEl.hasClass('with-upload')) {
                try {
                    this.imgUploader.setDisable(false);
                    this.attachUploader.setDisable(false);
                } catch (e) {}
            }
            else {
                try {
                    this.imgUploader.setDisable(true);
                    this.attachUploader.setDisable(true);
                } catch (e) {}
            }

            //开启输入框
            var _enableInput = function () {
                messageInputEl.prop('disabled', false).focus();
                messageSubmitBtnEl.removeClass('button-state-disabled').prop('disabled', false);
                chatTitleShownEl.removeClass('state-disabled');
                openDgLinkEl.removeClass('state-disabled');
                openDgBtnEl.removeClass('button-state-disabled').prop('disabled', false);
                logoutBtnEl.removeClass('button-state-disabled').prop('disabled', false);
            };

            // 右侧成员列表显隐控制
            if (activeSessionData.category == constants.sessionType.discussion) {
                participantPanelEl.show();
                chatMessagePanelEl.width(294);   //294是中部宽度，100是右边栏宽度
                messageInputEl.width(284);  //294-10(padding)
                joinNumEl.show();

                if (activeSessionData.status != 0) {// 判断当前登录用户id是否在session的参与人列表中，如果不在禁用发布功能
                    try {     //ie7下此时可能flash uploader还没准备好，直接调用会报错
                        this.imgUploader.setDisable(true);
                        this.attachUploader.setDisable(true);
                    } catch (e) {
                    }
                    //禁用输入框
                    messageInputEl.prop('disabled', true);
                    messageSubmitBtnEl.addClass('button-state-disabled').prop('disabled', true);
                    chatTitleShownEl.addClass('state-disabled');
                    openDgLinkEl.addClass('state-disabled');
                    openDgBtnEl.addClass('button-state-disabled').prop('disabled', true);
                    logoutBtnEl.addClass('button-state-disabled').prop('disabled', true);
                    chatTitleWEl.removeClass('chat-title-edit-enable'); //不可编辑
                }
                else {
                    _enableInput();
                    chatTitleWEl.addClass('chat-title-edit-enable'); //可编辑
                }
            }
            else {
                _enableInput();
                participantPanelEl.hide();
                chatMessagePanelEl.width(294 + 100);  //294是中部宽度，100是右边栏宽度
                messageInputEl.width(284 + 100);  //294-10(padding)+100
                joinNumEl.hide();
                chatTitleWEl.removeClass('chat-title-edit-enable'); //不可编辑
            }
            //ie6/7要控制聊天框tbar宽度
            if (htmlEl.hasClass('lt-ie8')) {
                chatTbarEl.width(elEl.width() - 2);
            }
            //去掉当前session导航高亮
            $('.chat-item', chatNavPanelEl).eq(activeIndex).find('a').removeAttr('style');
            //滚到最底部
            messageListWEl.scrollTop(10000);
        },

        getMp3Url : function (id) {
            return FS.API_PATH + '/df/GetMp3?clientPath=' + id;
        },
        appendMessageListHtml: function (sessionId, messageList) {
            var me = this,
                html = "",
                len = messageList.length,
                index = _.indexOf(me.sessionList, sessionId),
                audios = [];

            if(index == -1) {
                return ;
            }
            var sessionData = QXModel.getSessionData(sessionId);
            _.each(messageList, function (item) {
                html += me.getMessageItemHtml(sessionData, item);
                if(item.messageType == constants.messageType.audio){
                    var c = json.parse(item.content);
                    audios.push({
                        id: item.messageId,
                        file: me.getMp3Url(c.File),
                        duration: c.Duration,
                        style: item.senderId == loginUserData.id ? 3 : 2
                    })
                }
            });
            var _messageList = me.element.find('.message-list-wrapper .message-list').eq(index),
                scrollToBottomFlag = _messageList.height() - me.get('scrollToBottomThreshold') < me.messageListWrapper.scrollTop();

            // getMessages接口一次最多返回20条聊天记录，导致当消息数超过20条事，倒数20以前的数据会『丢失』
            if(messageList[0].previousMessageId > sessionData.lastReadMessageId){
                _messageList.html(html);
            }
            else {
                _messageList.append(html);
            }
            QXModel.updateSessionStatus(sessionId, messageList[len - 1].messageId, function(){});
            if(audios.length){
                _.each(audios, function (a) {
                    new AudioPlayer({
                        "element": $("#js_message_" + a.id),
                        "audioSrc": a.file,
                        "themeStyle": a.style,
                        "length": a.duration
                    })
                });
            }
            if(scrollToBottomFlag){
                me.messageListWrapper.scrollTop(900000);
                var _len = _messageList.find('li').length;
                if(_len > 1000){
                    _messageList.find('li:lt(' + (_len - 1000) + ')').remove();
                }
            }
        },

        /**
         * 根据messageType获取模板编译后的html string
         * @param sessionData
         * @param messageData
         * @returns {string}
         */
        getMessageItemHtml: function (sessionData, messageData) {
            var constantsMessageType = constants.messageType,
                messageItemHtml,
                messageContentText,
                messageType = messageData.messageType,
                messageClassName = '',
                employeeName,
                content,
                attach;

            var activeSession = sessionData;
            if (activeSession.category == constants.sessionType.discussion && messageData.messageType != constantsMessageType.systemPrompt) {
                if (messageData.senderId == loginUserData.id) {
                    employeeName = "我";
                }
                else {
                    var _senderInfo = util.getContactDataById(messageData.senderId, "p");
                    employeeName = _senderInfo ? _senderInfo.name : '';
                }
            }
            else {
                employeeName = "";
            }
            // 选择不同的模板编译函数
            switch (messageType) {
                case constantsMessageType.emotion://大表情
                    var objContent = json.parse(messageData.content);//转换为JSON对象
                    var directoryStr=objContent.PackId+'/';
                    var imgNameStr='fs_bee_'+(objContent.Index-1)+'.gif';
                    var imgStr='<img class="fs-img-emotion" src="'+FS.ASSETS_PATH+'/images/'+directoryStr+imgNameStr+'">';
                    messageItemHtml = messageTextCompiled({
                        styleType:'message-emotion',
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        messageContent : imgStr
                    });
                    break;
                case constantsMessageType.image: //图片
                    content = json.parse(messageData.content);
                    messageItemHtml = messageImgCompiled({
                        "messageContent": messageData.messageShowContent,
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "img": '<img class="img-thumb" src="' + util.getFileUrl(content.Thumbnail) + '" />',
                        "attachSize": util.getFileSize(content.FileSize),
                        "height": content.ThumbH,
                        "path": content.Image,
                        "attachData": encodeURIComponent(json.stringify(content))
                    });
                    break;
                case constantsMessageType.document: //附件
                    content = json.parse(messageData.content);
                    messageItemHtml = messageAttachCompiled({
                        "messageContent": "",
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "attachName": content.Name,
                        "attachSize": util.getFileSize(content.Size),
                        "attachIcon": '<img class="fs-attach-' + util.getFileType({
                            "name": content.File
                        }, true) + '-icon attach-icon" src="' + FS.BLANK_IMG + '" />',
                        "downloadPath": util.getDfLink(content.File, content.Name, true),
                        "attachData": encodeURIComponent(json.stringify(content)),
                        "canPreview": content.Prv
                    });
                    break;
                case constantsMessageType.audio: //录音
                    content = json.parse(messageData.content);
                    messageItemHtml = messageAudioCompiled({
                        "messageContent": "",
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "audioSrc": util.getFileUrl(content.File),
                        "audioLength": content.Duration,
                        // "isAudioUnread": content.isAudioUnread,
                        "messageId": messageData.messageId
                    });
                    break;
                case constantsMessageType.systemPrompt: // 系统提醒
                    content = json.parse(messageData.content);
                    var systemPrompt = constants.systemPrompt,
                        t = content.T,
                        u = content.U,
                        _u = util.getContactDataById(u, "p"),
                        name = u == loginUserData.id ? "你" : _u ? _u.name : '',
                        _html = [];
                    switch (t) {
                        case systemPrompt.exit:
                            messageItemHtml = '退出群对话';
                            break ;
                        case systemPrompt.invite:
                            messageItemHtml = '邀请';
                            _.each(content.A, function (id) {
                                if(id == u) return ;
                                var _n;
                                if(id == loginUserData.id){
                                    _n = '你';
                                }
                                else {
                                    var _e = util.getContactDataById(id, "p");
                                    if(_e){
                                        _n = _e.name;
                                    }
                                }
                                if(_n){
                                    _html.push(_n);
                                }
                            });
                            messageItemHtml += _html.join("、") + "加入群对话";
                            break ;
                        case systemPrompt.kick:
                            messageItemHtml = '将';
                            _.each(content.A, function (id) {
                                if(id == u) return ;
                                var _n;
                                if(id == loginUserData.id){
                                    _n = '你';
                                }
                                else {
                                    var _e = util.getContactDataById(id, "p");
                                    if(_e){
                                        _n = _e.name;
                                    }
                                }
                                if(_n){
                                    _html.push(_n);
                                }
                            });
                            messageItemHtml += _html.join("、") + "移出群对话";
                            break ;
                        case systemPrompt.name:
                            if(content.V){
                                messageItemHtml = "将群对话的名称修改为：" + content.V;
                            }
                            else {
                                messageItemHtml = "取消了群对话名称";
                            }
                            break ;
                    }
                    messageItemHtml = name + messageItemHtml;
                    messageItemHtml = messageControlCompiled({
                        messageContent : messageItemHtml
                    });
                    break;
                case constantsMessageType.systemTextPrompt: // 纯文本型系统提示
                    messageItemHtml = messageControlCompiled({
                        messageContent : messageData.content
                    });
                    break;
                case constantsMessageType.location: //定位
                    content = json.parse(messageData.content);
                    messageItemHtml = messageLocationCompiled({
                        "messageContent": content.Text,
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "latitude": content.Latitude,
                        "longitude": content.Longitude,
                        "address": content.Text,
                        "messageTime": parseInt(messageData.messageTime / 1000, 10)
                    });
                    break;
                case constantsMessageType.workNotice: // 工作提醒
                    content = json.parse(messageData.content);
                    messageItemHtml = messageWorkNoticeCompiled({
                        "title": content.T,
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "desc": content.C,
                        "feedid": content.F
                    });
                    break;
                case constantsMessageType.linkWorkItem: // 链接到工作项
                    content = json.parse(messageData.content);
                    var title = {
                            'P1': '日志',
                            'P2': '周计划',
                            'P3': '月计划',
                            'A1': '普通审批',
                            'A2': '请假单',
                            'A3': '报销单',
                            'A4': '差旅单',
                            'A5': '借款单',
                            'W': '指令'
                        },
                        cls = {
                            'P': ' linkWorkItem-post',
                            'W': ' linkWorkItem-command',
                            'A': ' linkWorkItem-approval'
                        };
                    messageClassName = cls[content.T] || '';
                    var _t = '';
                    if(content.T == 'W'){
                        _t = title['W'];
                    }
                    else {
                        if(content.T == 'P' && content.ST == 1){
                            _t = moment(content.D).format('MM月DD日的日志');
                        }
                        else {
                            _t = title[content.T + content.ST];
                        }
                    }
                    messageItemHtml = messageLinkWorkItemCompiled({
                        "title": _t,
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "desc": content.C,
                        "feedid": content.F
                    });
                    break;
                case constantsMessageType.linkWorkSchdule: // 链接到日程
                    content = json.parse(messageData.content);
                    messageItemHtml = messageLinkWorkSchduleCompiled({
                        "title": moment(content.ST).format('MM月DD日 HH:mm的日程'),
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName,
                        "desc": content.C,
                        "feedid": content.F
                    });
                    break;
                case constantsMessageType.text:     //普通文本
                default:
                    if(!messageData.content){return "";}
                    messageContentText = messageData.content;
                    messageContentText = messageContentText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\n\r]/g, '<br/>').replace(new RegExp(' ', 'g'), '&nbsp;');
                    //地址变为a链接
                    messageContentText = messageContentText.replace(httpReg, function (httpText) {
                        var protocolReg = /https{0,1}|ftp/gi;
                        return '<a href="' + (protocolReg.test(httpText) ? '' : 'http://') + httpText + '" target="_blank">' + httpText + '</a>';
                    });
                    messageContentText = util.emoji(messageContentText);
                    messageItemHtml = messageTextCompiled({
                        styleType:'',
                        "messageContent": messageContentText,
                        "createTime": this.getFormatCreateTime(messageData.messageTime),
                        "employeeName": employeeName
                    });
                    break;
            }

            var messagePosition = "left";
            if (messageData.messageType == constantsMessageType.systemPrompt
                || messageData.messageType == constantsMessageType.systemTextPrompt) { //控制信息在中间
                messagePosition = "center";
            }
            else if (messageData.senderId == loginUserData.id) {
                messagePosition = "right";
            }
            messageItemHtml = '<li messageid="' + messageData.messageId + '" previousMessageId="' + messageData.previousMessageId + '" class="message-item message-type-' + this.getMessageTypeKey(messageData.messageType) + messageClassName + ' message-position-' + messagePosition + ' fn-clear">' + messageItemHtml + '</li>';
            return messageItemHtml;
        },

        /**
         * 显示新消息提醒
         */
        showNewMessageAlert: function (count) {
            if(this.status == constants.chatWinStatus.open) return;
            var elEl = this.element,
                tbarEl = $('.fs-qx-chat-hidden .fs-qx-chat-tbar', elEl),
                chatTitleEl = $('.fs-qx-chat-title', tbarEl);
            if (count > 0) {
                // 如果当前窗口是关闭的，设置窗口为最小化
                if (this.status == constants.chatWinStatus.close) {
                    this._updateStatus('min');
                }
                this.element.show();
                this.element.find('.fs-qx-chat-shown').hide();
                tbarEl.addClass('fs-qx-new-message');
                chatTitleEl.css({
                    "color": "#FFF"
                }).text('您有' + count + '条新企信');
                //高亮提示
                util.toggleAnimate({
                    "element": chatTitleEl,
                    "startProperty": {
                        "backgroundColor": "#FFF"
                    },
                    "endProperty": {
                        "backgroundColor": "#f76c05"
                    },
                    "animateOpts": {
                        "easing": "swing",
                        "duration": 130
                    },
                    "count": 2   //循环2次
                });
                this.element.find('.fs-qx-chat-hidden').show();
            }
            else {
                if(this.status == 'min'){
                    var activeSession = this.getActiveSession();
                    if(!activeSession){
                        this._updateStatus('close');
                    }
                    else {
                        this._updateStatus('min');
                    }
                }
            }
        },

        /**
         * 上传组件懒渲染
         * @private
         */
        _lazyRenderUploader: function () {
            var that = this;
            var elEl = this.element,
                imgUploaderEl = $('.upload-img-h .upload-field', elEl),
                attachUploaderEl = $('.upload-attach-h .upload-field', elEl),
                messageSubmitEl = $('.message-submit-wrapper', elEl),
                uploadEl = $('.upload-file', messageSubmitEl);
            var selectUploadItem = function (file, uploadType) {
                var fileSize = util.getFileSize(file.size),
                    fileType = util.getFileType(file, true);
                messageSubmitEl.addClass('with-upload');
                uploadEl.attr('fileid', file.id);
                uploadEl.attr('uploadtype', uploadType);
                $('.file-name', uploadEl).html('<img class="file-icon fs-attach-' + fileType + '-small-icon" src="' + FS.BLANK_IMG + '" /><span class="file-name-content">' + file.name + '（' + fileSize + ')</span>');
                imgUploader.setDisable(true);
                attachUploader.setDisable(true);
            };
            var uploadFileSizeLimit = contactData["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            var imgUploader = new Uploader({
                    "element": imgUploaderEl,
                    "h5Opts": {
                        multiple: false,
                        accept: "image/*",
                        filter: function (files) {
                            var passedFiles = [];
                            _.each(files, function (fileData) {
                                if (fileData.size < uploadFileSizeLimit * 1024 * 1024 && fileData.size > 0) {   //最大20m
                                    if (util.getFileType(fileData) == "jpg") {
                                        passedFiles.push(fileData);
                                    } else {
                                        util.alert('请选择图片格式的文件');
                                    }
                                } else {
                                    util.alert("上传文件不能大于" + uploadFileSizeLimit + "m，内容不能为空");
                                }

                            });
                            return passedFiles;
                        }
                    },
                    "flashOpts": {
                        file_types: "*.jpg;*.gif;*.jpeg;*.png",
                        file_types_description: "图片格式",
                        file_queued_handler: function (fileData) {
                            if (fileData.size < uploadFileSizeLimit * 1024 * 1024 && fileData.size > 0) {   //最大20m
                                return imgUploader.opts.onSelect.call(imgUploader, fileData);
                            } else {
                                imgUploader.core.cancelUpload(fileData.id, false);   //不触发uploadError事件
                                util.alert("上传文件不能大于" + uploadFileSizeLimit + "m，内容不能为空");
                            }
                        }
                    },
                    "onSelect": function (file) {
                        selectUploadItem(file, 'img');
                    },
                    "onSuccess": function (file, responseText) {
                        that.trigger('uploaded', file, responseText, 'img');
                    },
                    "onFailure": function (file) {
                        that.trigger('uploadederror', file);
                    }
                }),
                attachUploader = new Uploader({
                    "element": attachUploaderEl,
                    "h5Opts": {
                        multiple: false,
                        accept: "*/*",
                        filter: function (files) {
                            var passedFiles = [];
                            _.each(files, function (fileData) {
                                if (fileData.size < uploadFileSizeLimit * 1024 * 1024 && fileData.size > 0) {   //最大20m
                                    passedFiles.push(fileData);
                                } else {
                                    util.alert("上传文件不能大于" + uploadFileSizeLimit + "m，内容不能为空");
                                }

                            });
                            return passedFiles;
                        }
                    },
                    "flashOpts": {
                        file_types: "*.*",
                        file_types_description: "所有文件",
                        file_queued_handler: function (fileData) {
                            if (fileData.size < uploadFileSizeLimit * 1024 * 1024 && fileData.size > 0) {   //最大20m
                                return attachUploader.opts.onSelect.call(attachUploader, fileData);
                            } else {
                                attachUploader.core.cancelUpload(fileData.id, false);   //不触发uploadError事件
                                util.alert("上传文件不能大于" + uploadFileSizeLimit + "m，内容不能为空");
                            }
                        }
                    },
                    "onSelect": function (file) {
                        selectUploadItem(file, 'attach');
                    },
                    "onSuccess": function (file, responseText) {
                        that.trigger('uploaded', file, responseText, 'attach');
                    },
                    "onFailure": function (file) {
                        that.trigger('uploadederror', file);
                    }
                });
            this.imgUploader = imgUploader;
            this.attachUploader = attachUploader;
        },

        _onRenderVisible: function (val) {
            var result = ChatPanel.superclass._onRenderVisible.apply(this, arguments);
            if (val && !this._uploaderReady) {
                this._lazyRenderUploader();
                this._uploaderReady = true;
            }
            return result;
        },

        render: function () {
            this.element.html(moduleTplEl.filter('.fs-qx-chat-tpl').html());
            this._bindScrollEvents();
            this.messageListWrapper = this.element.find('.message-list-wrapper');
            return ChatPanel.superclass.render.apply(this, arguments);
        },

        show: function () {
            return ChatPanel.superclass.show.apply(this, arguments);
        },

        hide: function () {
            var result = ChatPanel.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },

        /**
         * 清理数据和dom
         */
        clear: function () {
            var me = this,
                elEl = this.element,
                chatNavPanelEl = $('.chat-nav-panel', elEl),
                participantPanelEl = $('.participant-panel', elEl);
            _.each(this.sessionList, function (id) {
                if(me.getSessionIdInfoByIdStr(id).type == 'sessionId') {
                    QXModel.setSessionData(id, {
                        readMessageId: null
                    });
                }
            });
            this.sessionList = [];
            this.set('activeIndex', -1); //激活index reset
            $('.chat-list', chatNavPanelEl).empty();
            $('.message-list', elEl).remove();
            chatNavPanelEl.hide();
            $('.participant-list', chatNavPanelEl).remove();
            participantPanelEl.hide();
        },

        getUnreadMessageCount: function () {
            var count = 0;
            _.each(this.sessionList.concat(this.cacheSessionList), function (i) {
                var sessionData = QXModel.getSessionData(i);
                if(sessionData){
                    count += sessionData.notReadCount;
                }
            });
            return count;
        },

        _appendCacheSession: function () {
            var me = this,
                cache = me.cacheSessionList;
            _.each(cache, function (item) {
                var d = QXModel.getSessionData(item);
                if(d && d.notReadCount > 0 && !_.contains(me.sessionList, item)){
                    me.addSession(item);
                }
            });
            me.cacheSessionList = [];
        },
        /**
         * 打开聊天窗
         * @param sessionId
         */
        openChat: function (sessionId) {
            this._appendCacheSession();
            var me = this,
                activeIndex = me.get('activeIndex'),
                index = -1,
                idInfo = me.getSessionIdInfoByIdStr(sessionId);
            if(idInfo.type == 'sessionId'){
                sessionId = idInfo.id;
            }
            _.each(me.sessionList, function (id, i) {
                if (id == sessionId) {
                    index = i;
                    return false;
                }
            });
            if (index == -1) {
                if (!this.getSessionData(sessionId)) {
                    util.alert('该员工已离职，无法与他进行会话。');
                    return false;
                }
                me.addSession(sessionId);
                index = me.sessionList.length - 1;
            }

            if (activeIndex != index) {
                me.set('activeIndex', index);
            }
            else {
                me._getMessages();
            }

            me._updateStatus('open');
            me.updateLayout();
            return true;
        },
        /**
         * 获取session信息
         * @param id
         * @returns {*}
         */
        getSessionData: function (id) {
            var me = this,
                info = me.getSessionIdInfoByIdStr(id);
            if (info.type == 'userId') {
                var participant = util.getContactDataById(info.id, 'p');
                if(participant) {
                    return {
                        category: constants.sessionType.single,
                        name: participant.name,
                        defaultName: participant.name,
                        portraitPath: participant.profileImage,
                        participantIds: [info.id, loginUserData.id],
                        sessionSubCategory: info.id
                    }
                }
                return null;
            }
            return QXModel.getSessionData(info.id);
        },
        /**
         * 根据id字符串判断session类型
         * @param id
         * @returns {*}
         */
        getSessionIdInfoByIdStr: function (id) {
            var reg = new RegExp('^' + this.participantPrefix),
                _id = id;
            if(reg.test(id)){
                id = id.replace(reg, '');
                _id = QXModel.getSessionIdByParticipantIds(id);
                if(!_id){
                    return {
                        type: 'userId',
                        id: id
                    };
                }
            }
            return {
                type: 'sessionId',
                id: _id
            };
        },

        destroy: function () {
            var result;
            this.serverTime = null;
            clearInterval(this.starHtmlTitleTid);
            this.starHtmlTitleTid = null;
            //音频对象销毁
            _.each(this.audioCpts, function (cpt) {
                cpt.destroy && cpt.destroy();
            });
            this.audioCpts = null;
            this.newMessageAlertPlayer && this.newMessageAlertPlayer.destroy();
            this.newMessageAlertPlayer && this.newMessageAlertPlayer.shadowEl.remove();
            this.newMessageAlertPlayer && (this.newMessageAlertPlayer.shadowEl = null);
            this.newMessageAlertPlayer = null;

            this.joinDialog && this.joinDialog.destroy();
            this.imgUploader && this.imgUploader.destroy();
            this.attachUploader && this.attachUploader.destroy();
            this.sessionList = [];
            result = ChatPanel.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    /**
     * 企信主面板
     * @type {*}
     */
    var FsQx = Overlay.extend({
        attrs: {
            "align": {
                selfXY: ['100%+20px', '100%'],     // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
                baseXY: ['100%', '100%']      // 基准定位元素的定位点，默认为左上角
            },
            "className": "fs-qx",
            "zIndex": 100
        },
        events: {
            'click': '_clickSelf',   //点击本身
            'click .fs-qx-shown .fs-qx-tbar': '_clickToHidden', //显示状态下点击tbar会切换到隐藏状态
            'click .fs-qx-shown .fs-qx-bbar .hide-h': '_clickToHidden',  //显示状态下点击tbar会切换到隐藏状态
            'click .fs-qx-hidden .fs-qx-tbar': '_switchToShown', //隐藏状态下点击tbar会切换到显示状态
            'click .open-dg-l': '_openNewDg',    //创建新的群对话
            'click .fs-qx-group-item .fs-qx-group-hd': '_clickGroupItem'   //点击组item
        },
        setup: function () {
            var result = FsQx.superclass.setup.apply(this, arguments);
            this.groupListData = null;    //存储分组数据，根据分组数据渲染组成员
            this._setupCpt();
            this._initGroupListData();  //初始化分组数据
            this._bindEvents();
            return result;
        },
        /**
         * 创建内部依赖组件
         * @private
         */
        _setupCpt: function () {
            this.chatPanel = new ChatPanel({
                "qxPanel": this  //双向绑定
            }).render();
        },
        /**
         * 组数据初始化
         * @private
         */
        _initGroupListData: function () {
            var groupListData = [];
            var circleListData = contactData["g"],    //部门列表
                noCircleListData = this.getNoCircleEmployees(); //未分配部分的员工
            //群对话
            groupListData.push({
                "name": '群对话[<span class="total-num">0</span>]',
                "title": "群对话",
                "groupType": "discussion",   //组类型
                "cls": "discussion-group",   //附加item的cls
                "memberListData": []
            });

            groupListData.push({
                "name": '最近联系同事[<span class="total-num">0</span>]',
                "title": "最近联系同事",
                "groupType": "rlm",   //组类型
                "cls": "rlm-group",
                "memberListData": []
            });
            //部门
            //滤掉全公司信息
            circleListData = _.filter(circleListData, function (itemData) {
                return itemData.id != "999999";
            });
            _.each(circleListData, function (itemData) {
                var memberListData = util.getEmployeeListByCircleId(itemData.id);
                //过滤掉登录登录用户
                memberListData = _.filter(memberListData, function (itemData) {
                    return itemData.id != loginUserData.id;
                });
                //按spell排序
                memberListData = _.sortBy(memberListData, function (itemData) {
                    return itemData.spell;
                });
                groupListData.push({
                    "name": itemData.name + '[<span class="total-num">' + memberListData.length + '</span>]',
                    "title": itemData.name,
                    "groupType": "circle",   //组类型
                    "cls": "circle-group",
                    //"onlineNum":0,  //在线人数
                    "memberListData": memberListData
                });
            });
            //无部门
            //过滤掉登录登录用户
            noCircleListData = _.filter(noCircleListData, function (itemData) {
                return itemData.id != loginUserData.id;
            });
            groupListData.push({
                "name": '无部门[<span class="total-num">' + noCircleListData.length + '</span>]',
                "title": "无部门",
                "groupType": "noCircle",   //组类型
                "cls": "no-circle-group",
                //"onlineNum":0,  //在线人数
                "memberListData": noCircleListData
            });
            this.groupListData = groupListData;
        },
        /**
         * 事件绑定处理
         * @private
         */
        _bindEvents: function () {
            var me = this;
            //随window的scroll和重新定位element位置
            $(root).scroll(function () {
                me._setPosition();
            });
            $('body').on('click', function () {
                me._switchToHidden();
            });
            QXModel.on("qxSessionSingleAdd", function () {
                var single = QXModel.getSingleList() || [];
                if (me._groupListRendered) {
                    $(".rlm-group .total-num", me.element).text(single.length > 20 ? 20 : single.length);
                }
                else {
                    me.groupListData[1].name = '最近联系同事[<span class="total-num">' + (single.length > 20 ? 20 : single.length) + '</span>]';
                }
                if($(".rlm-group").hasClass('state-open')){
                    me._renderMemberList_rlm(".rlm-group");
                }
            });

            QXModel.on("qxSessionDiscussionAdd qxSessionDiscussionDel qxSessionDiscussionRename qxSessionDiscussionMemberChange qxSessionDiscussionOrderChange", function () {
                var disscussions = QXModel.getDiscussionList();
                if (me._groupListRendered) {
                    $(".discussion-group .total-num", me.element).text(disscussions.length);
                }
                else {
                    me.groupListData[0].name = '群对话[<span class="total-num">' + disscussions.length + '</span>]';
                }
                if($(".discussion-group").hasClass('state-open')){
                    me._renderMemberList_discussion(".discussion-group");
                }
            });
            QXModel.on('qxSessionSingleOrderChange', function () {
                if($(".rlm-group").hasClass('state-open')){
                    me._renderMemberList_rlm(".rlm-group");
                }
            });

            me.element.on('click', '.js-qx-quick-reply', function () {
                var $this = $(this),
                    employeeid,
                    sessionId = $this.attr('data-sessionid');
                if(!sessionId) {
                    employeeid = $this.attr('data-employeeid');
                    sessionId = 'emp_' + employeeid;
                }
                me.chatPanel.openChat(sessionId);
                return false;
            });
        },
        _clickSelf: function (evt) {
            evt.stopPropagation();  //阻止事件冒泡
        },
        _clickToHidden: function (evt) {
            this._switchToHidden();
            evt.preventDefault();
        },
        /**
         * 切换到隐藏状态
         * @private
         */
        _switchToHidden: function () {
            var elEl = this.element,
                shownEl = $('.fs-qx-shown', elEl),
                hiddenEl = $('.fs-qx-hidden', elEl);
            shownEl.hide();
            hiddenEl.show();
        },
        /**
         * 切换到显示状态
         * @param evt
         * @private
         */
        _switchToShown: function (evt) {
            var elEl = this.element,
                shownEl = $('.fs-qx-shown', elEl),
                hiddenEl = $('.fs-qx-hidden', elEl);
            shownEl.show();
            hiddenEl.hide();
            this._prepareGroupList();
            this._setPosition();    //重新设置位置
            this.updateQxScrollBar();   //重设滚动条位置
            evt.preventDefault();
        },
        /**
         * 准备group list结构
         * @private
         */
        _prepareGroupList: function () {
            if (!this._groupListRendered) {  //懒渲染group组
                this._renderGroupList();
                this._groupListRendered = true;
            }
        },
        /**
         * 打开新的群对话
         * @param evt
         * @private
         */
        _openNewDg: function (evt) {
            var chatPanel = this.chatPanel,
                meEl = $(evt.currentTarget);
            if (!meEl.hasClass('state-disabled')) {
                chatPanel.createDiscussionSession([loginUserData], excludeEmployee(loginUserData.id));
            }
            evt.preventDefault();
            evt.stopPropagation();
        },
        /**
         * 点击部门item触发
         * @private
         */
        _clickGroupItem: function (evt) {
            var circleItemEl = $(evt.currentTarget).closest('.fs-qx-group-item'),
                memberListWEl = $('.fs-qx-member-list-wrapper', circleItemEl);
            if (circleItemEl.hasClass('state-open')) {    //处于open状态点击关闭
                memberListWEl.hide();
                circleItemEl.addClass('state-collapse').removeClass('state-open');
            } else {     //处于关闭状态点击展开
                //if(memberListEl.length==0){
                this._renderMemberList(circleItemEl); //重新创建
                memberListWEl = $('.fs-qx-member-list-wrapper', circleItemEl);
                //}
                memberListWEl.show();
                circleItemEl.addClass('state-open').removeClass('state-collapse');
            }
            this.updateQxScrollBar();
            evt.preventDefault();
        },
        /**
         * 渲染内部组件
         * @private
         */
        _renderCpt: function () {
            var that = this;
            var elEl = this.element,
                listWEl = $('.fs-qx-list-wrapper', elEl),
                queryEl = $('.fs-qx-search', elEl),
                listSearchEl = $('.fs-qx-list-search', elEl);//搜索面板
            this.employeeQuery = new QueryInput({
                "element": queryEl,
                "cls": "employee-query"
            });
            //query事件绑定
            this.employeeQuery.on('query', function (keyword) {
                if (keyword.length > 0) {
                    that._renderSearchList(keyword);  //渲染search list面板
                    that.switchListPanel("search");
                } else {
                    that.switchListPanel("group");
                }
                //默认选中第一个
                $('.fs-qx-member-item', listSearchEl).eq(0).addClass('state-selected');
            }).on('keynav', function (dir) {
                var itemsEl = $('.fs-qx-member-item', listSearchEl),
                    selectedEl = itemsEl.filter('.state-selected'),
                    newSelectedEl;
                if (selectedEl.length == 0) {
                    selectedEl = itemsEl.eq(0);
                }
                if (dir == "up") {
                    newSelectedEl = selectedEl.prev();
                    if (newSelectedEl.length == 0) {
                        newSelectedEl = itemsEl.last();
                    }
                } else if (dir == "down") {
                    newSelectedEl = selectedEl.next();
                    if (newSelectedEl.length == 0) {
                        newSelectedEl = itemsEl.first();
                    }
                }
                //选中下一个
                selectedEl.removeClass('state-selected');
                newSelectedEl.addClass('state-selected');
            }).on('submit', function (evt) {
                var itemsEl = $('.fs-qx-member-item', listSearchEl),
                    selectedEl = itemsEl.filter('.state-selected');
                if (selectedEl.length == 0) {
                    selectedEl = itemsEl.eq(0);
                }
                //触发item的click事件
                $('.member-info', selectedEl).click();
                evt.preventDefault();
            });
            listSearchEl.on('mouseenter', '.fs-qx-member-item', function (evt) {
                var itemEl = $(evt.currentTarget);
                $('.fs-qx-member-item', listSearchEl).removeClass('state-selected');
                itemEl.addClass('state-selected');
            });
            //主面板自定义滚动条
            //listWEl.tinyscrollbar();
            this.qxListScrollBar = new Scrollbar({
                "element": listWEl
            });
            this.qxSearchScrollBar = new Scrollbar({
                "element": listSearchEl
            });
            //先隐藏搜索列表
            this.qxSearchScrollBar.hide();
        },
        /**
         * 渲染搜索员工列表
         * @private
         */
        _renderSearchList: function (keyword) {
            var elEl = this.element,
                listSearchEl = $('.fs-qx-list-search', elEl);//搜索面板
            var employeeListData = excludeEmployee(loginUserData.id);
            var searchListData = [],
                filterData1,
                filterData2;
            filterData1 = stringMatch(employeeListData, keyword, {
                "key": "name"
            });
            filterData2 = startsWith(employeeListData, keyword, {
                "key": "spell"
            });
            //先插入filterData2的数据
            _.each(filterData2, function (itemData) {
                if (!_.find(filterData1, function (itemData2) {
                    return itemData2.id == itemData.id;
                })) {
                    searchListData.push(itemData);
                }
            });
            searchListData = searchListData.concat(filterData1);
            //渲染列表
            this._renderMemberList_circle(listSearchEl, {
                "memberListData": searchListData
            });
        },
        /**
         * 渲染成员列表入口，分派给对应适配器
         * @param groupItemSelector
         * @private
         */
        _renderMemberList: function (groupItemSelector) {
            //var groupItemData=this.getGroupDataBySelector(groupItemSelector),
            var groupItemData = this.getGroupDataByIndex($(groupItemSelector).attr('groupindex')),
                groupType = groupItemData.groupType;
            this["_renderMemberList_" + groupType].call(this, groupItemSelector, groupItemData);
        },
        _renderMemberList_discussion: function (groupItemSelector) {
            var groupItemEl = $(groupItemSelector),
                memberListWEl = $('.fs-qx-member-list-wrapper', groupItemEl);

            var htmlStr = '',
                memberListData = QXModel.getDiscussionList();
            if (memberListData.length > 0) {
                htmlStr += '<ul class="fs-qx-member-list">';
                _.each(memberListData, function (id) {
                    var itemData = QXModel.getSessionData(id),
                        name = cutBadStr(itemData.name);
                    htmlStr += '<li class="fs-qx-member-item js-qx-quick-reply" data-sessionid="' + id + '"><a href="javascript:;" title="' + name;
                    htmlStr += ' [共' + itemData.participantIds.length + '人]" class="member-info fn-clear"><span class="avatar-wrapper fn-left"><img src="';
                    htmlStr += itemData.portraitPath + '" class="avatar-thumb" /></span><span class="member-name fn-left">';
                    htmlStr += name + '<span class="working-state">&nbsp;[' + itemData.participantIds.length + ']</span></span></a></li>';
                });
                htmlStr += '</ul>';
            }
            memberListWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        _renderMemberList_rlm: function (groupItemSelector) {
            //额外限制，只渲染前20个
            var memberListData = QXModel.getSingleList();
            if(memberListData.length > 20){
                memberListData = memberListData.slice(0, 20);
            }

            var groupItemEl = $(groupItemSelector),
                memberListWEl = $('.fs-qx-member-list-wrapper', groupItemEl);

            var htmlStr = '';
            if (memberListData.length > 0) {
                htmlStr += '<ul class="fs-qx-member-list">';
                _.each(memberListData, function (id) {
                    var itemData = QXModel.getSessionData(id),
                        name = cutBadStr(itemData.name);
                    htmlStr += '<li class="fs-qx-member-item js-qx-quick-reply" data-sessionid="' + id + '"><a href="javascript:;" title="' + name;
                    htmlStr += '" class="member-info fn-clear"><span class="avatar-wrapper fn-left"><img src="' + itemData.portraitPath;
                    htmlStr += '" class="avatar-thumb" /></span><span class="member-name fn-left">' + name + '</span></a></li>';
                });
                htmlStr += '</ul>';
            }
            memberListWEl.html(htmlStr);
        },
        _renderMemberList_circle: function (groupItemSelector, groupItemData) {
            var groupItemEl = $(groupItemSelector),
                memberListWEl = $('.fs-qx-member-list-wrapper', groupItemEl);

            var htmlStr = '',
                memberListData = groupItemData["memberListData"];
            if (memberListData.length > 0) {
                htmlStr += '<ul class="fs-qx-member-list">';
                _.each(memberListData, function (itemData) {
                    var name = cutBadStr(itemData.name);
                    htmlStr += '<li class="fs-qx-member-item js-qx-quick-reply" data-employeeid="' + itemData.id + '"><a href="javascript:;" title="' + name + '" class="member-info fn-clear"><span class="avatar-wrapper fn-left"><img src="' + util.getAvatarLink(itemData.profileImagePath, 3) + '" class="avatar-thumb" /></span><span class="member-name fn-left">' + name + '</span></a></li>';
                });
                htmlStr += '</ul>';
            }
            memberListWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        _renderMemberList_noCircle: function (groupItemSelector, groupItemData) {
            //和部门group构建方式一样
            this._renderMemberList_circle(groupItemSelector, groupItemData);
        },
        /**
         * 渲染组列表
         * @private
         */
        _renderGroupList: function () {
            var groupListData = this.groupListData;
            var elEl = this.element,
                listWEl = $('.fs-qx-list-wrapper', elEl);  //列表容器
            var htmlStr = '';
            if (groupListData.length > 0) {
                htmlStr += '<ul class="fs-qx-group-list">';
                _.each(groupListData, function (groupItemData, i) {
                    htmlStr += '<li class="' + groupItemData.cls + ' fs-qx-group-item state-collapse" groupindex="' + i + '"><div class="fs-qx-group-hd"><a href="javascript:;" title="' + groupItemData.title + '">' + groupItemData.name + '</a></div><div class="fs-qx-member-list-wrapper"></div></li>';
                });
                htmlStr += '</ul>';
            }
            listWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        render: function () {
            this.element.html(moduleTplEl.filter('.fs-qx-tpl').html());
            var result = FsQx.superclass.render.apply(this, arguments);
            this._renderCpt();
            QXModel.start();
            //改成懒渲染，防止页面打开时阻断js的执行
            //this._renderGroupList(); //组列表渲染
            return result;
        },
        show: function () {
            return FsQx.superclass.show.apply(this, arguments);
        },
        /**
         * 根据panelState切换列表面板状态，目前有两种类型的面板group/search
         * @param panelState
         */
        switchListPanel: function (panelState) {
            panelState = panelState || "group"; //默认切换到group面板
            var qxListScrollBar = this.qxListScrollBar,
                qxSearchScrollBar = this.qxSearchScrollBar;
            if (panelState == "group") {
                qxListScrollBar.show();
                qxListScrollBar.update();
                qxSearchScrollBar.hide();
            } else if (panelState == "search") {
                qxListScrollBar.hide();
                qxSearchScrollBar.show();
                qxSearchScrollBar.update();
            }
        },
        /**
         * 获取所有未分配员工列表
         */
        getNoCircleEmployees: function () {
            var employeeListData = contactData["p"],
                noCircleListData; //未分配部分的员工
            noCircleListData = _.filter(employeeListData, function (itemData) {
                return ((!itemData.groupIDs) || itemData.groupIDs.length == 0);
            });
            return noCircleListData;
        },
        /**
         * 根据index取groupData，比getGroupDataBySelector效率高很多，尤其在ie<=7下
         * @param groupItemIndex
         * @returns {*}
         */
        getGroupDataByIndex: function (groupItemIndex) {
            groupItemIndex = parseInt(groupItemIndex);
            if (!_.isNumber(groupItemIndex)) {
                return;
            }
            return this.groupListData[groupItemIndex];
        },
        /**
         * 更新主面板滚动条设置
         */
        updateQxScrollBar: function () {
            this.qxListScrollBar && this.qxListScrollBar.update('relative');
        },
        destroy: function () {
            var result;
            this.groupListData = null;
            this.employeeQuery && this.employeeQuery.destroy();
            this.chatPanel && this.chatPanel.destroy();
            this.qxListScrollBar && this.qxListScrollBar.destroy();
            result = FsQx.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = new FsQx();  //单例模式
});