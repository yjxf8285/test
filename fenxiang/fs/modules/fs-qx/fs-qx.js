/**
 * 企信
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var Dialog=require('dialog'),
        Overlay=require('overlay'),
        Position=require('position'),
        moduleStyle=require('./fs-qx.css'),
        moduleTpl=require('./fs-qx.html'),
        Events = require('events'),
        util=require('util'),
        moment=require('moment'),
        filter=require('filter'),
        json=require('json'),
        AudioPlayer = require('uilibs/audio-player'), //音频播放组件
        H5Uploader=require('h5uploader'),
        FlashUploader=require('flashuploader'),
        AttachPreview = require('modules/fs-attach/fs-attach-preview'),
        filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
        fsMap = require('modules/fs-map/fs-map'), //地图组件
        Scrollbar=require('scrollbar'), //滚动条
        fsQxhelper=require('./fs-qx-helper');

    var moduleTplEl=$(moduleTpl),   //模板对应的jquery对象
        chatPanelNavItemCompiled=_.template(moduleTplEl.filter('.fs-qx-chat-item-tpl').html()),  //聊天面板左侧导航面板编译方法
        messageTextCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-text-tpl').html()),   //纯文本信息模板
        messageImgCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-img-tpl').html()), //图片信息模板
        messageAttachCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-attach-tpl').html()),  //附件信息模板
        messageAudioCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-audio-tpl').html()),    //录音信息模板
        messageControlCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-control-tpl').html()),    //控制信息模板
        messageLocationCompiled=_.template(moduleTplEl.filter('.fs-qx-message-item-location-tpl').html());  //定位信息
    var originContactData=FS.getAppStore('contactData');
    var contactData=util.getContactData(),  //联系人数据
        loginUserData=contactData["u"]; //登录用户数据;
    var stringMatch=filter.stringMatch, //全词匹配
        startsWith=filter.startsWith;   //开头匹配
    var attachPreview=new AttachPreview().render();  //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    //地图定位
    var FsMapOverlay = fsMap.FsMapOverlay;
    var fsMapOverlay = new FsMapOverlay();

    var audioIndex= 0,   //播放录音flash插件计数器
        uploaderIndex= 0,   //flash上传计数
        CHAT_STATE_CLS='state-offline state-pc-online state-mobile-online';
    var httpReg=new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?", "gi");
    var htmlTitle="纷享科技";
    //注册显示企信对话路由
    util.tplRouterReg('#shortmessage/showsession/=/:id-:value');
    /**
     * 返回排除ids剩余employee data
     * @param ids
     */
    var excludeEmployee=function(ids){
        ids=[].concat(ids);
        return _.reject(contactData["p"],function(itemData){
            return _.some(ids,function(id){
                return itemData.id==id;
            });
        });
    };
    /**
     * 从ids列表里提取对方id
     * @param ids
     */
    var getOppositeEmpId=function(ids){
        return _.find(ids,function(itemId){
            return itemId!=loginUserData.id;
        });
    };
    /**
     * 上传组件，采用h5上传技术和flash fallback方案
     * @param opts
     * @constructor
     */
    var Uploader=fsQxhelper.Uploader;
    var QueryInput=fsQxhelper.QueryInput;
    var LetterGroupList=fsQxhelper.LetterGroupList;
    var JoinDialog=fsQxhelper.JoinDialog;
    var ChatPanel=Overlay.extend({
        attrs: {
            "align":{
                selfXY: ['100%+242px', '100%'],     // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
                baseXY: ['100%', '100%']      // 基准定位元素的定位点，默认为左上角
            },
            "className":"fs-chat-panel",
            "maxHisNum":100,    //保存最大聊天历史记录
            "zIndex":100,
            "activeIndex":-1,    //当前激活chat item
            "joinDialog":null,   //邀请同事弹框对象
            "qxPanel":null  //企信主列表面板，注意destroy时可能产生的问题
        },
        events: {
            'click':'_clickSelf',
            'click .fs-qx-chat-shown .fs-qx-chat-tbar .hide-l': '_clickMinBtn', //显示状态下点击"-"会切换到最小化状态
            'click .fs-qx-chat-hidden .fs-qx-chat-title':'_clickHiddenTitle',  //点击隐藏按钮切换到最大化
            'click .fs-qx-chat-shown .fs-qx-chat-tbar .close-l': '_switchToClosed', //显示状态下点击"x"会切换到关闭状态
            //'click .fs-qx-chat-hidden .fs-qx-chat-tbar': '_switchToShown', //隐藏状态下点击tbar会切换到最大化状态
            'click .fs-qx-chat-shown .open-dg-l': '_openJoinDialog', //打开邀请框
            'click .fs-qx-chat-shown .open-dg-btn': '_openJoinDialog', //打开邀请框
            'mouseenter .fs-qx-chat-shown .chat-item':'_enterChatItem',  //鼠标进入chat item
            'mouseleave .fs-qx-chat-shown .chat-item':'_leaveChatItem',  //鼠标离开 chat item
            'click .chat-nav-panel .chat-item-content':'_clickChatItemNav',  //点击chat item导航切换activeIndex
            'click .chat-nav-panel .remove-l':'_clickRemoveChatItemNav', //点击移除chat item导航
            'click .fs-qx-chat-shown .chat-title-edit-enable .chat-title-shown':'_clickChatTitleShown', //点击显示状态chat title
            'blur .fs-qx-chat-shown .chat-title-edit-enable .title-edit':'_blurChatTitleEdit',   //焦点离开title编辑框
            'keydown .fs-qx-chat-shown .chat-title-edit-enable .title-edit':'_keydownChatTitleEdit',   //title编辑框监听回车键控制
            'keyup .fs-qx-chat-shown .chat-title-edit-enable .title-edit':'_keyupChatTitleEdit',   //输入字数控制
            'click .fs-qx-chat-shown .nav-up':'_clickNavUp',
            'click .fs-qx-chat-shown .nav-down':'_clickNavDown',
            'click .message-submit-wrapper .remove-l':'_clickUploadRemove', //点击上传文件删除按钮
            'click .message-submit-bbar .f-sub':'_clickSubmit',  //点击发送信息按钮
            'keydown .fs-qx-chat-shown .message-input':'_keydownInput',  //点击enter发送信息按钮
            'click .logout-btn':'_clickLogout',  //点击退出按钮
            'click .message-type-img .preview-l':'_previewImg',    //图片预览
            'click .message-type-img .img-wrapper':'_previewImg',  //图片预览
            'click .message-type-attach .preview-l':'_previewAttach',  //附件预览
            'click .message-type-location .message-location':'_showLocation',    //显示定位
            'click .message-type-audio .ctr-btn':'_clickAudioPlay',   //点击音频播放按钮，去掉未读标志
            'click .state-offline-tip .close-tip-l':'_clickCloseOfflineTip' //点击关注不在线提示
        },
        setup:function(){
            var result=ChatPanel.superclass.setup.apply(this,arguments);
            this.messageTid=null;   //3秒message计时器
            this.sessionListData=null; //存储session item数据
            this.audioCpts=[];  //音频对象容器
            this._newMessageStore={};   //来新消息存储
            this._sessionXhr=null;  //存储切换session的请求ajax
            this._bindEvents();
            return result;
        },
        /**
         * 事件绑定处理
         * @private
         */
        _bindEvents:function(){
            var that=this;
            var qxPanel=this.get('qxPanel');
            var elEl=this.element,
                shownEl,
                hiddenEl,
                chatNavItemEl, //chat导航
                participantItemEl,
                avatarWinInner;

            //监听qxPanel的qxstatus事件，员工聊天状态更新，新session，新消息数量
            qxPanel.on('qxstatus',function(qxStatus){
                var shortMessageCount=qxStatus.shortMessageCount,
                    statusData=qxStatus.statusData,
                    sessions=statusData.sessions, //新session
                    newMessages=statusData.newMessages; //新消息
                var activeSession;

                shownEl=$('.fs-qx-chat-shown',elEl);
                hiddenEl=$('.fs-qx-chat-hidden',elEl);
                chatNavItemEl=$('.chat-nav-panel .chat-item',elEl); //chat导航
                participantItemEl=$('.participant-item',elEl);
                avatarWinInner=$('.avatar-win-inner',elEl);
                //如果面板处于closed状态并且有新消息，需要show出来并切换到hidden状态
                if(elEl.is(':hidden')&&statusData.newMessages.length>0){
                    //that.show();
                    that.switchPanelStatus('hidden',true);
                }
                activeSession=that.getActiveSession(); //获取当前激活session
                //最大化状态
                if(shownEl.is(':visible')){
                    //更新员工聊天状态
                    chatNavItemEl.each(function(){
                        var itemEl=$(this),
                            employeeId=itemEl.attr('employeeid'),
                            chatState;
                        if(employeeId){
                            chatState=qxPanel.getEmployeeChatState(employeeId);
                            itemEl.removeClass(CHAT_STATE_CLS).addClass('state-'+chatState);
                        }
                    });
                    participantItemEl.each(function(){
                        var itemEl=$(this),
                            employeeId=itemEl.attr('participantid'),
                            chatState;
                        if(employeeId){
                            chatState=qxPanel.getEmployeeChatState(employeeId);
                            itemEl.removeClass(CHAT_STATE_CLS).addClass('state-'+chatState);
                        }
                    });
                    if(activeSession.sessionType=="pair"){
                        avatarWinInner.removeClass(CHAT_STATE_CLS).addClass('state-'+qxPanel.getEmployeeChatState(getOppositeEmpId(activeSession.employeeIds)));
                    }else{
                        avatarWinInner.removeClass(CHAT_STATE_CLS);
                    }

                }
                //最小化状态
                if(hiddenEl.is(':visible')){
                    if(statusData.newMessages.length>0){
                        that.show();
                        that.showNewMessageAlert(statusData.newMessages.length);
                    }
                }
                //自动插入新session
                if(sessions.length>0&&newMessages.length>0){
                    util.api({
                        "url":"/ShortMessage/GetSessionNames",
                        "data":{
                            "sessionIDs": _.map(sessions,function(sessionData){
                                return sessionData.value;
                            })
                        },
                        "success":function(responseData){
                            var dataRoot,
                                discussionListData=[];
                            if(responseData.success){
                                dataRoot=responseData.value;
                                _.each(dataRoot,function(extSessionData){
                                    var sessionData= _.find(sessions,function(itemData){
                                        return itemData.value==extSessionData.value;
                                    });
                                    var profileImage='<img src="'+util.getAvatarLink(extSessionData.value2,3)+'" class="avatar-thumb" alt="" />';
                                    that.addOrUpdateSession({
                                        "sessionId":sessionData.value,
                                        "sessionType":(sessionData.value1?"discussion":"pair"),
                                        "employeeIds":sessionData.value2,
                                        "data":{
                                            "name":extSessionData.value1,
                                            "profileImage":extSessionData.value2
                                        }
                                    },false,{
                                        //'profileImage':extSessionData.value2,
                                        'profileImage':util.getAvatarLink(extSessionData.value2,3),
                                        'chatStateCls':(sessionData.value1?"":qxPanel.getEmployeeChatState(getOppositeEmpId(sessionData.value2))),
                                        'title':extSessionData.value1,
                                        'name':extSessionData.value1
                                    });
                                    //高亮提醒
                                    _.each(that.sessionListData,function(itemData,i){
                                        var chatNavEl=$('.chat-nav-panel .chat-item-content',elEl).eq(i);
                                        if(itemData.sessionId==sessionData.value){
                                            if(activeSession&&(sessionData.value==activeSession.sessionId)){ //如果新消息所属session处于active状态，不提示直接返回
                                                return;
                                            }
                                            util.toggleAnimate({
                                                "element": chatNavEl,
                                                "startProperty": {
                                                    "backgroundColor": "#f4f4f4"
                                                    //"opacity":0.33
                                                    //"color":"#000000"
                                                },
                                                "endProperty": {
                                                    "backgroundColor": "#fff1ba"
                                                    //"opacity":1
                                                    //"color":"#ffffff"
                                                },
                                                "animateOpts": {
                                                    "easing": "swing",
                                                    "duration": 260
                                                },
                                                "count": 2   //循环2次
                                            });
                                            chatNavEl.addClass('cic-come-on');
                                            //return true;
                                        }
                                    });

                                    //如果chat panel处于最大化状态，需要更新面板layout
                                    if(shownEl.is(':visible')){
                                        that.updateLayout();
                                    }
                                    //如果是讨论组，构建qxPanel的讨论组列表
                                    if(sessionData.value1){
                                        //participantsCount 参与人数
                                        discussionListData.push({
                                            "sessionID":sessionData.value,
                                            "profileImage":extSessionData.value2,
                                            "name":extSessionData.value1,
                                            "participantsCount":sessionData.value2.length,
                                            "participantsIDs":sessionData.value2,
                                            "lastCreateTime":sessionData.value3
                                        });
                                    }
                                });
                                //更新qx panel讨论组列表
                                if(qxPanel._groupListRendered&&discussionListData.length>0){
                                    qxPanel.addDiscussionMemberData(discussionListData);
                                    qxPanel.reRenderDiscussionGroup();
                                }
                            }
                        }
                    });
                    //新消息提醒，如果只有当前打开的session有消息则不提醒
                    if(shownEl.is(':visible')){
                        if(_.some(sessions,function(sessionData){
                            return sessionData.value!=activeSession.sessionId;
                        })){
                            //点亮页面标题，显示新消息来了
                            that.starHtmlTitle();
                            //新消息来了提示音
                            that.operNewMessageSound(newMessages);
                        }
                    }
                    if(hiddenEl.is(':visible')){    //如果是隐藏状态直接点亮
                        //点亮页面标题，显示新消息来了
                        that.starHtmlTitle();
                        //新消息来了提示音
                        that.operNewMessageSound(newMessages);
                    }

                }
            });
            //随window的scroll和重新定位element位置
            $(root).scroll(function(){
                that._setPosition();
            });
            $('body').click(function(evt){
                if(that.getPanelStatus()=="shown"){
                    that._clickMinBtn();
                }
            });
        },
        _onRenderVisible: function(val) {
            var result=ChatPanel.superclass._onRenderVisible.apply(this,arguments);
            if(val&&!this._uploaderReady){
                this._lazyRenderUploader();
                this._uploaderReady=true;
            }
            return result;
        },
        _clickSelf:function(evt){
            evt.stopPropagation();  //拦截事件冒泡
        },
        _clickCloseOfflineTip:function(evt){
            var activeSession=this.getActiveSession();
            var meEl=$(evt.currentTarget),
                tipEl=meEl.closest('.state-offline-tip');
            tipEl.hide();
            activeSession.hideOfflineTip=true;
        },
        /**
         * 点击音频播放按钮，去除未读标志
         * @param evt
         * @private
         */
        _clickAudioPlay:function(evt){
            var meEl=$(evt.currentTarget),
                contentEl=meEl.closest('.message-content'),
                isUnReadEl=$('.is-unread',contentEl),
                messageId;
            if(isUnReadEl.length>0){
                messageId=isUnReadEl.attr('messageid');
                util.api({
                    "url":'/ShortMessage/ReadAudioShortMessage',
                    "type":"post",
                    "data":{
                        "shortMessageID":messageId
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            //去除未读标志
                            isUnReadEl.remove();
                        }
                    }
                });
            }
        },
        /**
         * 切换到关闭状态
         * @param evt
         * @private
         */
        _switchToClosed:function(evt){
            this.hide();
            //关闭语音播放
            this.stopAllAudio();
            this.resetPanel();  //清理面板
            evt.preventDefault();
        },
        /**
         * 重置面板
         */
        resetPanel:function(){
            var elEl=this.element,
                chatListWEl=$('.chat-list-wrapper',elEl),
                participantListWEl=$('.participant-list-wrapper',elEl),
                chatTbarEl=$('.fs-qx-chat-shown .fs-qx-chat-tbar',elEl),
                chatTitleShownEl=$('.chat-title-shown',chatTbarEl),
                joinNumEl=$('.join-num .num',chatTbarEl),
                avatarThumbEl=$('.avatar-thumb',chatTbarEl);
            //清空
            $('.chat-list',chatListWEl).empty();
            $('.participant-list',participantListWEl).empty();
            this.reRenderMessageList([]);   //清空聊天记录
            chatTitleShownEl.text("");
            joinNumEl.text("0");
            avatarThumbEl.attr("src",FS.BLANK_IMG);
        },
        /**
         * 重置面板除了聊天导航
         */
        resetPanelExceptChatNav:function(){
            var elEl=this.element,
                participantListWEl=$('.participant-list-wrapper',elEl),
                chatTbarEl=$('.fs-qx-chat-shown .fs-qx-chat-tbar',elEl),
                chatTitleShownEl=$('.chat-title-shown',chatTbarEl),
                joinNumEl=$('.join-num .num',chatTbarEl),
                avatarThumbEl=$('.avatar-thumb',chatTbarEl);
            //清空
            $('.participant-list',participantListWEl).empty();
            this.reRenderMessageList([]);   //清空聊天记录
            chatTitleShownEl.text("");
            joinNumEl.text("0");
            avatarThumbEl.attr("src",FS.BLANK_IMG);
        },
        /**
         * 页面title显示新消息comming
         */
        starHtmlTitle:function(){
            var count=0;
            clearInterval(this.starHtmlTitleTid);
            this.starHtmlTitleTid=setInterval(function(){
                if(count%2==0){
                    //$('title').html('【&nbsp;新企信&nbsp;】'+htmlTitle);
                    document.title='【新企信】'+htmlTitle;
                }else{
                    //$('title').html('【&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;】'+htmlTitle);
                    document.title='【　　　】'+htmlTitle;
                }
                count++;
            },1000);
        },
        /**
         * 停止点亮html title
         */
        stopStarHtmlTitle:function(){
            clearInterval(this.starHtmlTitleTid);
            //$('title').text(htmlTitle);
            document.title=htmlTitle;
        },
        /**
         * 新消息comming提示音
         */
        operNewMessageSound:function(newMessages){
            var audioBoxEl;
            var newMessageAlertPlayer=this.newMessageAlertPlayer;
            var newMessageStore=this._newMessageStore,
                tempMessageStore,
                needPlay=false;
            tempMessageStore= _.groupBy(newMessages,function(newMessage){
                return newMessage.value;
            });
            //
            _.each(tempMessageStore,function(listData,sessionId){
                tempMessageStore[sessionId]=[];
                _.each(listData,function(itemData){
                    tempMessageStore[sessionId].push(itemData.value1);
                });
            });
            /*tempMessageStore= _.map(tempMessageStore,function(itemArr){
                return itemArr.length;
            });*/
            //构建播放器
            if(!newMessageAlertPlayer){
                audioBoxEl=$('<div class="fn-hide-abs"></div>');
                audioBoxEl.appendTo('body');
                newMessageAlertPlayer=new AudioPlayer({
                    "element":audioBoxEl,
                    "audioSrc":FS.MODULE_PATH+'/fs-qx/shortmessage.mp3'
                });
                newMessageAlertPlayer.shadowEl=audioBoxEl;
                this.newMessageAlertPlayer=newMessageAlertPlayer;
            }
            _.each(tempMessageStore,function(tempMessageIds,sessionId){
                if(!newMessageStore[sessionId]){
                    needPlay=true;
                    newMessageStore[sessionId]=tempMessageIds;
                }else if(!util.isArrayElementEq(newMessageStore[sessionId],tempMessageIds)){
                    needPlay=true;
                    newMessageStore[sessionId]=tempMessageIds;
                }
            });
            if(needPlay){
                newMessageAlertPlayer.play();
            }

        },
        clearNewMessageStore:function(sessionId){
            var newMessageStore=this._newMessageStore;
            newMessageStore[sessionId]=[];   //重置为空数组
        },
        /**
         * 切换面板状态，最小化/最大化/关闭
         * @param status hidden/shown/closed
         * @param withInterval true/false,是否开启或终止3秒message interval
         */
        switchPanelStatus:function(status,withInterval){
            var elEl=this.element,
                shownEl=$('.fs-qx-chat-shown',elEl),
                hiddenEl=$('.fs-qx-chat-hidden',elEl);
            if(status=="shown"){
                if(elEl.is(':hidden')){
                    this.show();
                }
                shownEl.show();
                hiddenEl.hide();
                //网页标题恢复正常
                this.stopStarHtmlTitle();
                //this._setPosition();    //重新设置位置
                /*if(!this._uploaderReady){
                    this._lazyRenderUploader();
                    this._uploaderReady=true;
                }*/
                this.updateLayout(); //更新布局
                //自适应导航滚动位置
                this._adjustNavScrollTop();
                //焦点置于输入框内
                $('.message-input',shownEl)[0].focus();
                //开启3秒轮询
                if(withInterval){
                    this.startMessageInterval();
                }
            }else if(status=="hidden"){
                if(elEl.is(':hidden')){
                    this.show();
                }
                //关闭3秒轮询
                if(withInterval){
                    this.stopMessageInterval();
                }
                shownEl.hide();
                hiddenEl.show();
                //this._setPosition();    //重新设置位置
            }else if(status=="closed"){
                //关闭3秒轮询
                if(withInterval){
                    this.stopMessageInterval();
                }
                shownEl.hide();
                hiddenEl.show();
                this.hide();
            }

        },
        /**
         * 获取面板状态，shown/hidden/closed
         */
        getPanelStatus:function(){
            var elEl=this.element,
                shownEl=$('.fs-qx-chat-shown',elEl),
                hiddenEl=$('.fs-qx-chat-hidden',elEl);
            if(shownEl.is(':visible')&&hiddenEl.is(':hidden')){
                return "shown";
            }
            if(shownEl.is(':hidden')&&hiddenEl.is(':visible')){
                return "hidden";
            }
            if(elEl.is(':hidden')){
                return "closed";
            }
        },
        /**
         * 图片预览
         * @param evt
         * @private
         */
        _previewImg:function(evt){
            var meEl=$(evt.currentTarget);
            var path=meEl.attr('path');
            var attachData=json.parse(decodeURIComponent(meEl.attr('attachdata')));
            attachPreview.preview({
                "type":"img",
                "data":[{
                    "previewPath":path+'2',
                    "originPath":path+'1',
                    "thumbPath":path+'3',
                    "createTime":attachData.createTime,
                    "fileName":attachData.attachName,
                    "fileSize":attachData.attachSize,
                    "fileId":attachData.attachID
                }],
                "refId":0,
                "belongToType":"qx"
            });
            evt.preventDefault();
        },
        /**
         * 文件预览
         * @param evt
         * @private
         */
        _previewAttach:function(evt){
            var meEl=$(evt.currentTarget);
            var path=meEl.attr('path');
            var attachData=json.parse(decodeURIComponent(meEl.attr('attachdata')));
            fileReader.readFile({
                "fileId": attachData.attachID,
                "fileName": attachData.attachName,
                "filePath": attachData.attachPath
            });
            evt.preventDefault();
        },
        /**
         * 定位
         * @private
         */
        _showLocation:function(evt){
            var meEl=$(evt.currentTarget);
            var locationData=json.parse(decodeURIComponent(meEl.attr('locationdata')));
            fsMapOverlay.fixLocation(locationData,{
                "showQd":false  //不显示签到信息
            });
            evt.preventDefault();
        },
        /**
         * 打开邀请对话框
         * @private
         */
        _openJoinDialog:function(evt){
            var that=this;
            var joinDialog=this.get('joinDialog'),
                qxPanel=this.get('qxPanel');
            var activeSession=this.getActiveSession(),
                coreData=activeSession.data,
                participantIds=coreData.participantIds,
                sessionType=activeSession.sessionType,
                joinData,
                requestUrl;
            var meEl=$(evt.currentTarget);
            if(!meEl.hasClass('state-disabled')){
                joinDialog&&joinDialog.show();
                //设置初始化数据
                joinData= _.map(participantIds,function(participantId){
                    return util.getContactDataById(participantId,'p');
                });
                joinDialog.setInitData({
                    "joinData":joinData,
                    "unjoinData":excludeEmployee(participantIds)
                });
                if(sessionType=="pair"){
                    requestUrl='/ShortMessage/CreateSessionForDiscussion';
                }else{
                    requestUrl='/ShortMessage/ParticipantsChanged';
                }
                //设置动态回调
                joinDialog.set('successCb',function(joinData){
                    var participantsIDs= _.map(joinData,function(employeeData){
                        return employeeData.id;
                    });
                    //设置讨论组上限
                    if(participantsIDs.length>100){
                        util.alert('讨论组的人数上限为100位同事，请确认。',function(){
                            joinDialog.hide();
                        });
                        return;
                    }
                    //更改参与人
                    util.api({
                        "url":requestUrl,
                        "data":{
                            "sessionID":activeSession.sessionId,
                            "participantsIDs":participantsIDs
                        },
                        "success":function(responseData){
                            var dataRoot,
                                sessionData;
                            if(responseData.success){
                                dataRoot=responseData.value;
                                if(sessionType=="pair"){
                                    sessionData=dataRoot;
                                }else{
                                    sessionData=dataRoot.session;
                                }
                                //更新qx panel discussion group list
                                qxPanel.addDiscussionMemberData(sessionData);
                                qxPanel.reRenderDiscussionGroup();
                                //更新chat panel表现
                                if(sessionType=="discussion"){  //讨论组更新
                                    that._updateSessionData(sessionData);
                                    that._renderActiveSessionInfo();
                                }else{
                                    that.addOrUpdateSession({
                                        "sessionId":sessionData.sessionID,
                                        "sessionType":(sessionData.isDiscussion?"discussion":"pair"),
                                        "employeeIds":sessionData.participantsIDs,
                                        "data":sessionData
                                    },true,{
                                        "profileImage":util.getAvatarLink(sessionData.profileImage,3),
                                        "chatStateCls":(sessionData.isDiscussion?"":qxPanel.getEmployeeChatState(getOppositeEmpId(sessionData.participantsIDs))),
                                        "title":sessionData.name,
                                        "name":sessionData.name
                                    });
                                }
                                //隐藏joinDialog
                                joinDialog.hide();
                            }
                        }
                    },{
                        "submitSelector":$('.f-sub',joinDialog.element)
                    });
                });
            }
            evt.preventDefault();
        },
        _enterChatItem:function(evt){
            var chatItemEl=$(evt.currentTarget),
                removeLinkEl=$('.remove-l',chatItemEl);
            removeLinkEl.show();
        },
        _leaveChatItem:function(evt){
            var chatItemEl=$(evt.currentTarget),
                removeLinkEl=$('.remove-l',chatItemEl);
            removeLinkEl.hide();
        },
        /**
         * 点击chat item导航触发
         * @param evt
         * @private
         */
        _clickChatItemNav:function(evt){
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                chatItemEl=$(evt.currentTarget).closest('.chat-item'),
                chatItemsEl=$('.chat-item',chatNavPanelEl);
            this.set('activeIndex',chatItemsEl.index(chatItemEl));
        },
        /**
         * 点击移除按钮移除chat item导航
         * @private
         */
        _clickRemoveChatItemNav:function(evt){
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                chatItemEl=$(evt.currentTarget).closest('.chat-item'),
                chatItemsEl=$('.chat-item',chatNavPanelEl);
            //先停止3秒轮询
            this.stopMessageInterval();
            //移除对应的dom
            chatItemEl.remove();
            //如果session全关闭了，直接隐藏chat panel
            if($('.chat-item',chatNavPanelEl).length==0){
                this.switchPanelStatus('closed',true);
            }else{
                //移除对应的session数据存储
                this.removeSession(chatItemsEl.index(chatItemEl));
            }
            //左侧导航自适应scrollTop
            this._adjustNavScrollTop();
        },
        /**
         * 焦点离开title编辑框触发
         * @private
         */
        _blurChatTitleEdit:function(evt){
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                activeChatItemEl=$('.state-active',chatNavPanelEl),  //当前被激活的chat item
                inputEl=$(evt.currentTarget),
                chatTitleEl=inputEl.closest('.fs-qx-chat-title'),
                titleShownEl=$('.chat-title-shown',chatTitleEl),
                joinNumEl=$('.join-num',chatTitleEl);
            var val= _.str.trim(inputEl.val());
            var activeSessionData=this.getActiveSession(),
                coreData=activeSessionData.data;
            var qxPanel=this.get('qxPanel');
            //验证
            if(val.length==0&&coreData.isDefaultName){  //输入为空并且是默认名称，不需要改名提交
                titleShownEl.show();
                joinNumEl.show();
                inputEl.hide();
                return;
            }
            if(val.length>200){
                util.alert('请控制名称在200字内');
                return;
            }
            if(inputEl.data('request')){    //防止多次重复请求
                return;
            }
            if(val!= _.str.trim(titleShownEl.text())){  //只有title发生改动时才发送请求
                inputEl.data('request',true);
                util.api({
                    "url":"/ShortMessage/ModifySessionName",
                    "data":{
                        "sessionID":activeSessionData.sessionId,
                        "name":val
                    },
                    "success":function(responseData){
                        var dataRoot;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            titleShownEl.text(dataRoot.value2).show();
                            $('.chat-name',activeChatItemEl).text(dataRoot.value2);
                            joinNumEl.show();
                            inputEl.hide();
                            //刷新主列表
                            qxPanel.addDiscussionMemberData({
                                "sessionID":activeSessionData.sessionId,
                                "name":dataRoot.value2
                            });
                            qxPanel.reRenderDiscussionGroup();
                            //是否是默认名字，更新状态
                            coreData.isDefaultName=dataRoot.value1;
                        }else{    //失败的话切换到shown状态
                            titleShownEl.show();
                            joinNumEl.show();
                            inputEl.hide();
                        }
                    },
                    "complete":function(){
                        inputEl.data('request',false);
                    }
                });
            }else{
                titleShownEl.show();
                joinNumEl.show();
                inputEl.hide();
            }
        },
        /**
         * 点击回车后焦点离开title编辑框
         * @private
         */
        _keydownChatTitleEdit:function(evt){
            var inputEl=$(evt.currentTarget);
            var val= _.str.trim(inputEl.val());
            if(evt.keyCode==13){
                inputEl.blur();
            }
            //200字控制
            /*if(val.length>200){
                evt.preventDefault();
            }*/
        },
        /**
         * title编辑框字数控制
         * @private
         */
        _keyupChatTitleEdit:function(evt){
            var inputEl=$(evt.currentTarget);
            var val= _.str.trim(inputEl.val());
            //200字控制
            /*if(val.length>200){
                inputEl.val(val.slice(0,200));
            }*/
        },
        /**
         * 点击聊天面板名称
         * @param evt
         * @private
         */
        _clickChatTitleShown:function(evt){
            var meEl=$(evt.currentTarget),
                chatTitleEl=meEl.closest('.fs-qx-chat-title'),
                editInputEl=$('.title-edit',chatTitleEl),
                joinNumEl=$('.join-num',chatTitleEl);
            var activeSession=this.getActiveSession(),
                coreData=activeSession.data;
            if(!meEl.hasClass('state-disabled')){
                meEl.hide();
                joinNumEl.hide();
                editInputEl.val(coreData.isDefaultName?'':meEl.text()).show().get(0).focus();
            }
            evt.preventDefault();
        },
        _clickNavDown:function(evt){
            var elEl=this.element,
                chatNavListWEl=$('.chat-nav-panel .chat-list-wrapper',elEl),
                chatNavListEl=$('.chat-list',chatNavListWEl);
            var scrollTop=chatNavListWEl.scrollTop(),
                listWH=chatNavListWEl.height(),
                listH=chatNavListEl.height();
            if(scrollTop+listWH<(listH+4)){
                chatNavListWEl.scrollTop(scrollTop+32);
            }
            evt.preventDefault();
        },
        _clickNavUp:function(evt){
            var elEl=this.element,
                chatNavListWEl=$('.chat-nav-panel .chat-list-wrapper',elEl);
            var scrollTop=chatNavListWEl.scrollTop();
            if(scrollTop>0){
                chatNavListWEl.scrollTop(scrollTop-32);
            }
            evt.preventDefault();
        },
        _clickHiddenTitle:function(evt){
            //准备面板
            var qxPanel=this.get('qxPanel');
            qxPanel._prepareGroupList();

            if(this.sessionListData.length>0){
                if(this.get('activeIndex')==-1){
                    this.set('activeIndex',0,{
                        //"silent":true   //不触发change事件
                    });
                    this.switchPanelStatus("shown",false);  //不触发3秒轮询，依赖set activeIndex触发
                }else{
                    this.switchPanelStatus("shown",true);
                }
            }else{
                this.switchPanelStatus("shown",true);
            }
            evt.preventDefault();
        },
        _clickMinBtn:function(evt){
            var activeSession=this.getActiveSession(),
                coreData=activeSession.data;
            var elEl=this.element,
                tbarEl=$('.fs-qx-chat-hidden .fs-qx-chat-tbar',elEl),
                hiddenTitleEl=$('.fs-qx-chat-title',tbarEl);
            tbarEl.removeClass('fs-qx-new-message');
            hiddenTitleEl.html(coreData.name).css({
                "background":"#eaeaea",
                "color":"#3d3d3d"
            });
            //关闭语音播放
            this.stopAllAudio();
            this.switchPanelStatus("hidden",true);
            evt&&evt.preventDefault();
        },
        _clickUploadRemove:function(evt){
            var elEl=this.element,
                messageSubmitWEl=$('.message-submit-wrapper',elEl),
                uploadEl=$('.upload-file',messageSubmitWEl);
            var fileId=uploadEl.attr('fileid'),
                uploadType=uploadEl.attr('uploadtype');
            this.imgUploader.setDisable(false);
            this.attachUploader.setDisable(false);
            this[uploadType+"Uploader"].removeFile(fileId);

            messageSubmitWEl.removeClass('with-upload');
            evt.preventDefault();
        },
        _clickSubmit:function(evt){
            var that=this;
            var qxPanel=this.get('qxPanel');
            var elEl=this.element,
                modalEl=$('.message-submit-wrapper .submit-modal',elEl),
                uploadEl=$('.message-submit-wrapper .upload-file',elEl),
                removeUploadEl=$('.remove-l',uploadEl),
                inputEl=$('.message-input',elEl),
                historyHEl=$('.history-h',elEl),   //聊天记录
                submitEl=$(evt.currentTarget);  //发送按钮
            var inputValue= _.str.trim(inputEl.val());
            var activeSession=this.getActiveSession(),
                sessionType=activeSession.sessionType,  //session类型pair or discussion
                coreData=activeSession.data,
                otherParticipantId, //如果是pair型，指向另外一个参与人的id
                otherParticipant;
            if(uploadEl.is(':hidden')&&inputValue.length==0){
                util.showInputError(inputEl);
                return false;
            }
            evt.preventDefault();
            //字数限制
            if(inputValue.length>2000){
                util.alert('发布内容不能超过2000字，目前已超出<em>'+(inputValue.length-2000)+'</em>个字');
                return;
            }
            //准备qxPanel的group list结构，保证发信息之前准备好
            qxPanel._prepareGroupList();
            //开启遮罩
            modalEl.show();
            this._sendMessage(function(fileInfos,uploadType){
                var requestData={
                    "sessionID":activeSession.sessionId,
                    "messageContent":inputValue,
                    "receiveIDs":coreData.participantIds,
                    "fileInfo":fileInfos[0]
                };
                if(fileInfos.length>0){
                    if(inputValue.length==0){   //纯图片或附件
                        requestData["shortMessageType"]=(uploadType=="img"?3:4);
                    }else{
                        requestData["shortMessageType"]=1;  //混合型信息
                    }
                }else{
                    requestData["shortMessageType"]=2; //纯文字
                }
                //先终止3s轮询
                //that.stopMessageInterval();  //不终止3s轮询，和发送同步进行
                util.api({
                    "url":"/ShortMessage/SendShortMessage",
                    "data":requestData,
                    "success":function(responseData){
                        //一些清理
                        //先移除上传项
                        if(fileInfos.length>0){
                            removeUploadEl.click();
                        }
                        //清空输入框
                        inputEl.val("");
                        //更新sessionId
                        if(responseData.success&&activeSession.sessionId==0){   //用于双人第一次聊天的清况
                            activeSession.sessionId=responseData.value.value;
                            if(that.isCurrentSession(activeSession)){   //防止用户已经切换了session
                                historyHEl.attr('href','#shortmessage/showsession/=/id-'+activeSession.sessionId);
                            }
                        }
                        if(responseData.success){
                            //更新讨论组数据或最近联系人数据
                            if(sessionType=="pair"){
                                //获取对方employeeId
                                otherParticipantId= _.find(coreData.participantIds,function(itemId){
                                    return itemId!=loginUserData.id;
                                });
                                //取得对方数据
                                otherParticipant=util.getContactDataById(otherParticipantId,'p');
                                //构造memberData数据
                                otherParticipant=_.extend({
                                    "state":qxPanel.getEmployeeChatState(otherParticipant.id),
                                    "lastChatDate":responseData.serviceTime //已后台接口serverTime作为排序时间
                                },otherParticipant);
                                qxPanel.addRlmMemberData(otherParticipant);
                                //重新刷新最近联系人列表
                                qxPanel.reRenderRlmGroup();
                            }else if(sessionType=="discussion"){
                                //更新讨论组最后一条信息的创建时间，并重新渲染
                                qxPanel.addDiscussionMemberData({
                                    "sessionID":activeSession.sessionId,
                                    "lastCreateTime":responseData.serviceTime  //已后台接口serverTime作为排序时间
                                });
                                qxPanel.reRenderDiscussionGroup();
                            }
                            that._appendMessageAfterSend(responseData,requestData,{
                                "uploadType":uploadType
                            });
                            //开启message interval
                            //that.startMessageInterval();
                        }
                    },
                    "complete":function(){
                        modalEl.hide();  //完成后遮罩隐藏，无论成功失败
                    }
                },{
                    "submitSelector":submitEl
                });
            },function(){   //上传失败回调
                util.alert('上传附件失败，请重试');
                modalEl.hide();
            });
        },
        _keydownInput:function(evt){
            var elEl=this.element,
                subBtnEl=$('.fs-qx-chat-shown .f-sub',elEl);
            if(evt.keyCode==13){
                //this._clickSubmit($.Event("click"));
                subBtnEl.click();
                evt.preventDefault();   //阻止用户输入换行符
            }
        },
        _clickLogout:function(evt){
            var that=this;
            var activeSession=this.getActiveSession();
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                chatItemsEl=$('.chat-item',chatNavPanelEl),
                activeChatItemEl=chatItemsEl.eq(this.get('activeIndex'));
            var qxPanel=this.get('qxPanel');
            util.confirm("是否要确定退出并删除当前讨论组"," ",function(evt){
                var that=this;
                util.api({
                    "url":"/ShortMessage/QuitAndDeleteSession",
                    "data":{
                        "sessionID":activeSession.sessionId
                    },
                    "success":function(responseData){
                        if(responseData.success){
                            $('.remove-l',activeChatItemEl).click();
                            //移除对应的讨论组数据
                            qxPanel.removeDiscussionMemberData(activeSession.sessionId);
                            //重新渲染列表
                            qxPanel.reRenderDiscussionGroup();
                        }
                        that.hide();
                    }
                },{
                    "submitSelector":$(evt.currentTarget)
                });
            },{
                "messageType":"question",
                "autoHide":false    //需要手动隐藏弹框
            });
            evt.preventDefault();
        },
        /**
         * 删除讨论组快捷方式
         * @param sessionId
         */
        shortCutDelDiscussion:function(sessionId){
            var chatNavIndex=-1;
            var qxPanel=this.get('qxPanel');
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                chatItemsEl=$('.chat-item',chatNavPanelEl),
                currentChatItemEl;
            var sessionListData=this.sessionListData;
            _.some(sessionListData,function(sessionData,index){
                if(sessionData.sessionId==sessionId){
                    chatNavIndex=index;
                    return true;
                }
            });
            if(chatNavIndex>-1){    //当前讨论组已打开情况下删除聊天窗口
                currentChatItemEl=chatItemsEl.eq(chatNavIndex);
                $('.remove-l',currentChatItemEl).click();
            }
            //移除对应的讨论组数据
            qxPanel.removeDiscussionMemberData(sessionId);
            //重新渲染列表
            qxPanel.reRenderDiscussionGroup();
        },
        /**
         * 渲染一个新chat item
         * @param chatItemData可以为空
         * @private
         */
        _renderNewChatItem:function(chatItemData){
            var elEl=this.element,
                chatNavListWEl=$('.chat-nav-panel .chat-list-wrapper',elEl),
                chatListEl=$('.chat-list',elEl);
            chatItemData=chatItemData||{};
            chatListEl.append(chatPanelNavItemCompiled(_.extend({
                //'profileImage':'<img src="'+FS.BLANK_IMG+'" class="avatar-thumb" alt="" />',
                //'chatStateImage':'<img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state" alt="" />',
                'profileImage':FS.BLANK_IMG,
                //'chatStateImage':'<img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state" alt="" />',
                'chatStateCls':'', //聊天状态
                'blankImage':FS.BLANK_IMG,
                'title':'',
                'name':''
            },chatItemData)));
            this._adjustNavScrollTop();
        },
        /**
         * 自适应scrollTop
         * @private
         */
        _adjustNavScrollTop:function(){
            var elEl=this.element,
                chatNavListWEl=$('.chat-nav-panel .chat-list-wrapper',elEl),
                chatListEl=$('.chat-list',elEl),
                activeChatNavEl=$('.state-active',chatListEl),  //被激活的导航
                activeIndex=$('.chat-item',chatListEl).index(activeChatNavEl);
            var wHeight,
                height,
                curScrollTop;   //当前滚动top
            wHeight=chatNavListWEl.height();
            height=chatListEl.height();
            //curScrollTop=chatNavListWEl.scrollTop();
            chatNavListWEl.scrollTop(0);
            if(height>wHeight){
                if(activeChatNavEl.length>0){  //如果存在激活导航，保证激活导航可见
                    if((activeIndex+2)*32+4>wHeight){
                        chatNavListWEl.scrollTop((activeIndex+2)*32-wHeight+4);
                    }
                }else{
                    chatNavListWEl.scrollTop(height-wHeight+10);    //滚动到最底部
                }
            }else{
                chatNavListWEl.scrollTop(0);
            }
        },
        /**
         * 发送消息
         * @private
         */
        _sendMessage:function(uploadedCb,errorCb){
            var that=this;
            var elEl=this.element,
                uploadEl=$('.message-submit-wrapper .upload-file',elEl);
            var uploadType=uploadEl.attr('uploadtype'),
                fileId=uploadEl.attr('fileid'),
                uploader;
            if(uploadEl.is(':visible')){
                uploader=this[uploadType+'Uploader'];
                this.on('uploaded',function(file,responseText,uploadType){
                    var responseData=json.parse(responseText),
                        fileInfos=[];
                    if(responseData.success){
                        fileInfos.push({
                            "value": uploadType=="img"?2:3, //FeedAttachType
                            "value1":responseData.value.filePath,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                        uploadedCb.call(that,fileInfos,uploadType);
                        uploader.removeFile(fileId);
                    }else{
                        errorCb&&errorCb.call(that);
                    }
                    that.off('uploaded');
                });
                this.on('uploadederror',function(){
                    errorCb&&errorCb.call(that);
                    that.off('uploadederror');
                });
                uploader.startUpload();
            }else{
                uploadedCb.call(that,[],uploadType);
            }
        },
        /**
         * 通过发布后的responseData,requestData,extData生成message data并渲染
         * @param responseData
         * @param requestData
         * @param extData
         * @private
         */
        _appendMessageAfterSend:function(responseData,requestData,extData){
            var that=this;
            var messageDatas=[],
                responseDataRoot=responseData.value,
                messageIds=responseDataRoot.value1,
                attachPath=responseDataRoot.value2,
                attachSize=responseDataRoot.value4,
                canPreview=responseDataRoot.value5; //是否可预览
            if(attachPath){ //如果存在附件
                if(requestData["shortMessageType"]==1){   //如果是混合型，先插入文本
                    messageDatas.push({
                        "messageType":2,
                        "messageShowContent":requestData.messageContent,
                        "createTime":responseData.serviceTime,
                        "shortMessageID":messageIds[0],
                        "employeeID":loginUserData.id,
                        "employee":{
                            "name":loginUserData.name
                        }
                    });
                }
                messageDatas.push({ //插入附件
                    "messageType":extData.uploadType=="img"?3:4,
                    "createTime":responseData.serviceTime,
                    "shortMessageID":messageIds[1]||messageIds[0],
                    "employeeID":loginUserData.id,
                    "employee":{
                        "name":loginUserData.name
                    },
                    "attach":[{
                        "attachPath":attachPath,
                        "attachName":requestData.fileInfo.value3,
                        "fileIcon":extData.uploadType=="img"?'jpg':util.getFileExtText(requestData.fileInfo.value3),
                        "attachSize":attachSize,
                        "canPreview":canPreview
                    }]
                });
            }else{
                messageDatas.push({     //只有文本
                    "messageType":2,
                    "messageShowContent":requestData.messageContent,
                    "createTime":responseData.serviceTime,
                    "shortMessageID":messageIds[0],
                    "employeeID":loginUserData.id,
                    "employee":{
                        "name":loginUserData.name
                    }
                });
            }
            /*_.each(messageDatas,function(messageData){
                that.appendNewMessage(messageData);
            });*/
            this.appendAllNewMessage(messageDatas);
            //更新最后一条信息mark
            //不能简单以发出信息的messageID作为最后一条id，否则可能会出现信息丢失的情况
            //this._updateLastMessageMark(responseDataRoot.value,messageDatas[messageDatas.length-1]);
        },
        /**
         * 获取当前激活的session数据
         */
        getActiveSession:function(){
            //console.info(arguments.callee.caller.toString());
            var activeIndex=this.get('activeIndex'),
                sessionListData=this.sessionListData,
                activeSessionData;
            if(sessionListData&&sessionListData.length>0&&activeIndex>-1){
                activeSessionData=sessionListData[activeIndex];
            }else{
                activeSessionData=null;
            }
            return activeSessionData;
        },
        /**
         * 判定sessionData
         * @param sessionData
         */
        isCurrentSession:function(sessionData){
            var activeSessionData=this.getActiveSession(),
                sessionId=activeSessionData["sessionId"],
                sessionType=activeSessionData["sessionType"],
                employeeIds=activeSessionData["employeeIds"];
            if(sessionId==sessionData.sessionId){
                return true;
            }
            if(sessionType=='pair'&&sessionData.sessionType==sessionType&& this.isEqualParticipantIds(sessionData.employeeIds,employeeIds)){ //主要针对sessionType=="pair"的情况
                return true;
            }
            return false;
        },
        /**
         * 通过id获取对应的session信息
         * @returns {*}
         */
        getSessionById:function(sessionId){
            var sessionListData=this.sessionListData;
            return _.find(sessionListData,function(sessionData){
                return sessionData.sessionId==sessionId;
            });
        },

        /**
         * 删除对应index的session数据
         * @param index
         */
        removeSession:function(index){
            var activeIndex=this.get('activeIndex'),
                sessionListData=this.sessionListData;
            sessionListData.splice(index,1);
            this.sessionListData=sessionListData;

            if(index<activeIndex){
                this.set('activeIndex',activeIndex-1,{
                    "silent":true   //不触发change事件
                });
            }else if(index==activeIndex){
                if(index==sessionListData.length){  //如果index在原来队尾，activeIndex需要前移一位
                    this.set('activeIndex',index-1);
                }else{
                    //activeIndex值不变，手动调用_onRenderActiveIndex方法
                    this._onRenderActiveIndex(index);
                }
            }
        },
        /**
         * 参与人列表一致
         */
        isEqualParticipantIds:function(firstList,secondList){
            var isEqual=true;
            //转换成数值型
            firstList= _.map(firstList,function(id){
                return parseInt(id);
            });
            secondList= _.map(secondList,function(id){
                return parseInt(id);
            });
            if(firstList.length!=secondList.length){
                isEqual=false;
                return isEqual;
            }
            _.some(firstList,function(firstItem){
                if(!_.contains(secondList,firstItem)){
                    isEqual=false;
                    return true;
                }
            });
            return isEqual;
        },
        /**
         * 添加或更新session item
         * @param sessionData sessionData.sessionType指明session类型，目前有两种 discussion和pair(两个人聊天)
         *     sessionData.employeeId为可选项，当employeeId存在时sessionType==pair
         * @param isActive 是否添加完session后马上激活
         * @param newChatItemData chat新导航数据
         */
        addOrUpdateSession:function(sessionData,isActive,newChatItemData){
            var that=this;
            var sessionId=sessionData.sessionId,
                sessionType=sessionData.sessionType,
                employeeIds=sessionData.employeeIds,
                activeIndex;
            var sessionListData=this.sessionListData||[],
                findSession= _.find(sessionListData,function(itemData,i){
                    activeIndex=i;
                    if(itemData.sessionId==sessionId){
                        return true;
                    }
                    if(sessionType=='pair'&&itemData.sessionType==sessionType&& that.isEqualParticipantIds(itemData.employeeIds,employeeIds)){ //主要针对sessionType=="pair"的情况
                        //更新sessionId
                        if(sessionId>0){
                            itemData.sessionId=sessionId;
                        }
                        return true;
                    }
                });
            if(!findSession){   //如果没找到，开辟新存储
                sessionListData.push(_.extend({
                    "sessionId":0,
                    "sessionType":sessionType
                },sessionData));
                activeIndex=sessionListData.length-1;
                //增加一个新chat item
                this._renderNewChatItem(newChatItemData);
            }
            this.sessionListData=sessionListData;   //重设回
            if(isActive){
                if(activeIndex==this.get('activeIndex')){
                    this.switchPanelStatus('shown',true);
                }else{
                    this.set('activeIndex',activeIndex);
                }
            }
        },
        /**
         * 更新面板布局，左侧和右侧边栏
         * @private
         */
        updateLayout:function(){
            var qxPanel=this.get('qxPanel');    //企信主面板
            var elEl=this.element,
                chatTbarEl=$('.fs-qx-chat-shown .fs-qx-chat-tbar',elEl),
                chatTitleWEl=$('.fs-qx-chat-shown .fs-qx-chat-title',elEl),
                chatTitleShownEl=$('.chat-title-shown',chatTitleWEl),
                joinNumEl=$('.join-num',chatTitleWEl), //参与人数
                openDgLinkEl=$('.open-dg-l',chatTbarEl),  //点击添加用户按钮
                openDgBtnEl=$('.fs-qx-chat-shown .open-dg-btn',elEl),    //打开邀请人按钮
                logoutBtnEl=$('.fs-qx-chat-shown .logout-btn',elEl), //退出按钮
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                chatMessagePanelEl=$('.chat-message-panel',elEl),
                stateOfflineTipEl=$('.state-offline-tip',chatMessagePanelEl),   //对方用户不在线提示
                messageSubmitWEl=$('.message-submit-wrapper',elEl),
                messageInputEl=$('.message-input',elEl),    //输入框
                participantPanelEl=$('.participant-panel',elEl),
                messageListWEl=$('.message-list-wrapper',elEl), //消息列表框
                messageSubmitBtnEl=$('.message-submit-bbar .f-sub',elEl);   //提交按钮
            var sessionListData=this.sessionListData,
                activeIndex=this.get('activeIndex'),
                activeSessionData=sessionListData[activeIndex],
                participantIds=activeSessionData["employeeIds"];
            var chatStateCls;
            //ie6/7要控制聊天框tbar宽度
            var htmlEl=$('html');
            if(htmlEl.hasClass('lt-ie8')){
                chatTbarEl.removeAttr('style');
            }
            //左侧chat item导航显隐控制
            if(sessionListData.length>1){
                chatNavPanelEl.show();
            }else{
                chatNavPanelEl.hide();
            }
            //先开启可输入方式
            if(!messageSubmitWEl.hasClass('with-upload')){
                try{
                    this.imgUploader.setDisable(false);
                    this.attachUploader.setDisable(false);
                }catch(e){}
            }else{
                try{
                    this.imgUploader.setDisable(true);
                    this.attachUploader.setDisable(true);
                }catch(e){}
            }
            //开启输入框
            messageInputEl.prop('disabled',false);
            messageSubmitBtnEl.removeClass('button-state-disabled').prop('disabled',false);
            chatTitleShownEl.removeClass('state-disabled');
            openDgLinkEl.removeClass('state-disabled');
            openDgBtnEl.removeClass('button-state-disabled').prop('disabled',false);
            logoutBtnEl.removeClass('button-state-disabled').prop('disabled',false);

            //右侧成员列表显隐控制
            if(activeSessionData.sessionType=="discussion"){
                participantPanelEl.show();
                chatMessagePanelEl.width(294);   //294是中部宽度，100是右边栏宽度
                messageInputEl.width(284);  //294-10(padding)
                joinNumEl.show();
                chatTitleWEl.addClass('chat-title-edit-enable'); //可编辑
                //判断当前登录用户id是否在session的参与人列表中，如果不在禁用发布功能
                if(!_.some(participantIds,function(employeeId){ //当前参与人列表不包括当前登录用户，设置session状态为禁用
                    return employeeId==loginUserData.id;
                })){
                    try{     //ie7下此时可能flash uploader还没准备好，直接调用会报错
                        this.imgUploader.setDisable(true);
                        this.attachUploader.setDisable(true);
                    }catch(e){}
                    //禁用输入框
                    messageInputEl.prop('disabled',true);
                    messageSubmitBtnEl.addClass('button-state-disabled').prop('disabled',true);
                    chatTitleShownEl.addClass('state-disabled');
                    openDgLinkEl.addClass('state-disabled');
                    openDgBtnEl.addClass('button-state-disabled').prop('disabled',true);
                    logoutBtnEl.addClass('button-state-disabled').prop('disabled',true);
                }
                //隐藏不在线提示
                stateOfflineTipEl.hide();
            }else{
                participantPanelEl.hide();
                chatMessagePanelEl.width(294+100);  //294是中部宽度，100是右边栏宽度
                messageInputEl.width(284+100);  //294-10(padding)+100
                joinNumEl.hide();
                chatTitleWEl.removeClass('chat-title-edit-enable'); //不可编辑
                //判断对方是否在线
                chatStateCls=qxPanel.getEmployeeChatState(getOppositeEmpId(participantIds));
                if(chatStateCls=="pc-online"||chatStateCls=="mobile-online"){
                    stateOfflineTipEl.hide();
                }else{
                    if(activeSessionData.hideOfflineTip){
                        stateOfflineTipEl.hide();
                    }else{
                        stateOfflineTipEl.show();
                    }
                }
            }
            //ie6/7要控制聊天框tbar宽度
            if(htmlEl.hasClass('lt-ie8')){
                chatTbarEl.width(elEl.width()-2);
            }
            //去掉当前session导航高亮
            $('.chat-item',chatNavPanelEl).eq(activeIndex).find('a').removeAttr('style');
            //滚到最底部
            messageListWEl.scrollTop(10000);
        },
        /**
         * 更新session信息
         * @param sessionData
         * @private
         */
        _updateSessionData:function(sessionData){
            var activeIndex=this.get('activeIndex'),
                sessionListData=this.sessionListData,
                activeSessionData=sessionListData[activeIndex];
            //更新session数据
            if(sessionData.sessionID){
                activeSessionData["sessionId"]=sessionData.sessionID;
            }
            if(sessionData.participantIds){
                activeSessionData["employeeIds"]=sessionData.participantIds;
            }
            activeSessionData["data"]= _.extend(activeSessionData["data"]||{},sessionData);  //覆盖session核心数据
        },
        _updateLastMessageMark:function(sessionId,messageData){
            var sessionData=this.getSessionById(sessionId);
            sessionData.lastMessageCreatTime=messageData?messageData.createTime:0; //更新最近一条消息创建时间
            sessionData.lastMessageID=messageData?messageData.shortMessageID:0; //更新最近一条消息id
        },
        /**
         * 渲染当前激活的session信息
         * @private
         */
        _renderActiveSessionInfo:function(){
            var qxPanel=this.get('qxPanel');    //企信主面板
            var activeIndex=this.get('activeIndex'),
                sessionListData=this.sessionListData,
                activeSessionData=sessionListData[activeIndex],
                sessionType=activeSessionData.sessionType,  //session类型discussion和pair
                coreData=activeSessionData["data"],
                participantIds=coreData.participantIds; //参与人
            var elEl=this.element,
                chatTitleWEl=$('.fs-qx-chat-shown .fs-qx-chat-title',elEl),
                avatarEl=$('.fs-qx-chat-shown .avatar-win',elEl),
                titleShownEl=$('.chat-title-shown',chatTitleWEl),
                joinNumEl=$('.join-num .num',chatTitleWEl),
                chatListWEl=$('.chat-list-wrapper',elEl),   //chat list导航
                activeChatItemEl=$('.chat-item',chatListWEl).eq(activeIndex),
                activeChatItemContentEl=$('.chat-item-content',activeChatItemEl),
                navAvatarThumbEl=$('.avatar-thumb',activeChatItemEl),
                navChatNameEl=$('.chat-name',activeChatItemEl),
                participantListWEl=$('.participant-list-wrapper',elEl),
                historyHEl=$('.history-h',elEl);    //聊天记录
            var htmlStr='',
                chatStateCls="",
                oppositeEmpId;
            //chat面板tbar和左右边栏信息

            if(sessionType=="pair"){    //双人聊天要显示聊天状态
                oppositeEmpId=getOppositeEmpId(activeSessionData.employeeIds); //获取对方的id
                chatStateCls='state-'+qxPanel.getEmployeeChatState(oppositeEmpId);
                activeChatItemEl.attr('employeeid',oppositeEmpId).removeClass('state-pc-online state-mobile-online state-offline').addClass(chatStateCls);
            }
            avatarEl.html('<a class="avatar-win-inner '+chatStateCls+'"><img width="50" height="50" src="'+util.getAvatarLink(coreData.profileImage,2)+'" alt="'+coreData.name+'" class="avatar-thumb" />'+
                '<img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state"></a>');
            //加链接
            if(sessionType=="pair"){
                titleShownEl.attr('href','#profile/=/empid-'+oppositeEmpId);
                $('.avatar-win-inner',avatarEl).attr('href','#profile/=/empid-'+oppositeEmpId);
            }else{
                titleShownEl.attr('href','javascript:;');
                $('.avatar-win-inner',avatarEl).attr('href','javascript:;');
            }
            navAvatarThumbEl.attr('src',util.getAvatarLink(coreData.profileImage,3));
            titleShownEl.html(coreData.name); //先隐藏再显示出来
            navChatNameEl.html(coreData.name);
            joinNumEl.html(participantIds.length);
            activeChatItemContentEl.attr('title',coreData.name);
            //渲染参与者
            _.each(participantIds,function(participantId){
                var chatState=qxPanel.getEmployeeChatState(participantId),
                    participant=util.getContactDataById(participantId,'p');
                if(participant){     //filter掉离职者
                    htmlStr+='<li class="participant-item state-'+chatState+'" participantid="'+participantId+'">'+
                        '<a title="'+participant.name+'" class="participant-item-content fn-clear" href="javascript:;">'+
                        '<span class="avatar-wrapper fn-left"><img width="20" height="20" alt="" class="avatar-thumb" src="'+util.getAvatarLink(participant.profileImagePath,3)+'" />'+
                        '<img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state" />'+
                        '</span>'+
                        '<span class="participant-name fn-left">'+participant.name+'</span>'+
                        '</a>'+
                        '</li>';
                }

            });
            participantListWEl.html('<ul class="participant-list">'+htmlStr+'</ul>');
            //this._participantScrollBar.update();    //更新滚动条位置到顶部
            //设置聊天记录地址
            if(activeSessionData.sessionId>0){
                historyHEl.attr('href','#shortmessage/showsession/=/id-'+activeSessionData.sessionId);
            }else{
                historyHEl.attr('href','javascript:;');
            }
        },
        _onRenderActiveIndex:function(activeIndex){
            var that=this;
            var elEl=this.element,
                chatItemEl,
                activeChatItemEl;
            var sessionListData=this.sessionListData,
                activeSessionData;
            var qxPanel=this.get('qxPanel');
            //中断先前ajax请求
            this._sessionXhr&&this._sessionXhr.abort();
            //关闭语音播放
            this.stopAllAudio();
            //重置面板，除了导航面板
            this.resetPanelExceptChatNav();
            if(activeIndex>-1){
                //先终止message interval
                this.stopMessageInterval();
                //设置成最大化状态
                this.switchPanelStatus("shown",false);  //不影响现在的message interval

                chatItemEl=$('.chat-item',elEl);
                //当前激活的item dom
                activeChatItemEl=chatItemEl.eq(activeIndex);
                //当前激活的数据源
                activeSessionData=sessionListData[activeIndex];

                chatItemEl.removeClass('state-active');
                //激活当前导航条
                activeChatItemEl.show().addClass('state-active');
                //去掉当前激活当前导航条新消息高亮提示
                $('a',activeChatItemEl).removeAttr('style').removeClass('cic-come-on');
                //清空当前消息列表
                this.emptyMessageList();
                //清空新消息列表
                this.clearNewMessageStore(activeSessionData.sessionId);
                //请求session和message信息
                this._sessionXhr=util.api({
                    "url":"/ShortMessage/GetSessionAndNewMessages",
                    "data":{
                        "employeeIDs":activeSessionData.employeeIds,
                        "sessionID":activeSessionData.sessionId
                    },
                    "type":"post",
                    "success":function(responseData){
                        var dataRoot,
                            session,
                            shortMessages,
                            lastMessage;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            session=dataRoot.session;
                            shortMessages=dataRoot.shortMessages.reverse();
                            lastMessage=shortMessages[shortMessages.length-1]; //最后一条message
                            if(session.isDeleted){    //如果session已被删除
                                if(session.isDiscussion){   //只处理讨论组
                                    util.alert('该讨论组已被删除');
                                    that.shortCutDelDiscussion(session.sessionID);
                                    return;
                                }
                            }
                            //更新讨论组最后一条信息的创建时间，并重新渲染
                            if(session.isDiscussion&&lastMessage){
                                //尝试初始化主面板
                                qxPanel._prepareGroupList();

                                qxPanel.addDiscussionMemberData(_.extend({
                                    //"sessionID":session.sessionID,
                                    "lastCreateTime":lastMessage.createTime
                                },session));
                                qxPanel.reRenderDiscussionGroup();
                            }
                            //丢失头像，自己补充
                            if(!session.isDiscussion&& _.isUndefined(session.profileImage)){
                                session.profileImage=util.getContactDataById(getOppositeEmpId(activeSessionData.employeeIds),'p').profileImagePath;
                            }
                            //各种更新
                            that._updateSessionData(session);
                            //更新布局
                            that.updateLayout();
                            that._renderActiveSessionInfo();
                            that.reRenderMessageList(shortMessages);
                            that.serverTime=responseData.serverTime;    //保留服务端时间
                            //更新最近一条message标志
                            that._updateLastMessageMark(dataRoot.session.sessionID,lastMessage);
                            //开启新一轮message interval
                            that.startMessageInterval();
                        }
                    }
                });
            }else{
                //清空当前消息列表
                this.emptyMessageList();
            }

        },
        //开启执行message interval,3秒轮询
        startMessageInterval:function(){
            var that=this;
            var intervalFn=function(){
                that.requestNewMessage(function(){
                    clearTimeout(this.messageTid);  //保险杠
                    that.messageTid=setTimeout(function(){
                        intervalFn();
                    },3000);
                });
            };
            intervalFn();
        },
        /**
         * 终止message interval
         */
        stopMessageInterval:function(){
            clearTimeout(this.messageTid);
        },
        /**
         * 重启message interval
         */
        reStartMessageInterval:function(){
            this.stopMessageInterval();
            this.startMessageInterval();
        },
        /**
         * 请求当前session下的新message
         */
        requestNewMessage:function(completeCb){
            var that=this;
            var qxPanel=this.get('qxPanel');
            var activeSession=this.getActiveSession(),
                lastMessageID;
            if(activeSession){  //如果能获得当前有效值
                lastMessageID=activeSession.lastMessageID||0;
                util.api({
                    "url":"/ShortMessage/GetNewMessageFromOneSession1",
                    "type":"get",
                    "data":{
                        "sessionID":activeSession.sessionId,
                        "lastMessageID":lastMessageID
                    },
                    "success":function(responseData){
                        var dataRoot,
                            shortMessages,
                            lastMessage,
                            firstMessage;
                        var currentlastMessageID=activeSession.lastMessageID|| 0,
                            participantIds;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            shortMessages=dataRoot.shortMessages;
                            if(shortMessages.length>0){
                                shortMessages.reverse();    //数据反转
                                firstMessage=shortMessages[0];  //第一条message
                                lastMessage=shortMessages[shortMessages.length-1]; //最后一条message
                                //防止重复append对话信息
                                if(firstMessage.shortMessageID>currentlastMessageID){
                                    that.appendAllNewMessage(shortMessages);
                                    _.each(shortMessages,function(messageData){
                                        //that.appendNewMessage(messageData);
                                        //根据控制信息调整状态
                                        if(messageData.messageType==7){
                                            that._updateSessionFromControl(json.parse(messageData.messageContent));
                                        }
                                    });
                                    //更新最后一条信息mark
                                    that._updateLastMessageMark(lastMessage.sessionID,lastMessage);
                                    //如果message中有一条非控制信息，更新状态为可输入状态
                                    if(_.some(shortMessages,function(messageData){
                                        return messageData.messageType!=7;
                                    })){
                                        participantIds=activeSession.employeeIds;
                                        if(!_.contains(participantIds,loginUserData.id)){
                                            //加入参与人列表更新数据
                                            participantIds.push(loginUserData.id);
                                            that._updateSessionData({
                                                "participantIds":participantIds
                                            });
                                            //重新渲染聊天窗口
                                            that._renderActiveSessionInfo();
                                            that.updateLayout();
                                        }
                                    }
                                    //如果是讨论组信息，更新qx面板最后一条message的创建时间，并重新排序
                                    if(activeSession.sessionType=="discussion"){
                                        qxPanel.addDiscussionMemberData({
                                            "sessionID":activeSession.sessionId,
                                            "lastCreateTime":lastMessage.createTime
                                        });
                                        qxPanel.reRenderDiscussionGroup();
                                    }
                                }
                            }
                            //需要根据session更新输入状态
                        }
                    },
                    "complete":function(){
                        completeCb.call(that);
                    }
                },{
                    "abortLast":true,
                    "errorAlertModel":1 //错误提交等级降为1，不提示服务端错误，保证不会终止下次请求
                });
            }
        },

        _updateSessionFromControl:function(controlData){
            var qxPanel=this.get('qxPanel');
            var activeSession=this.getActiveSession();
            var currentEmployeeIds=controlData['A'],    //当前参与人列表
                sessionName=controlData['B'],         //session名
                sessionProfileImage=controlData['D']; //session头像地址
            var currentEmployeeIdArr=currentEmployeeIds.split(',');
            //更新session信息
            this._updateSessionData({
                "name":sessionName,
                "profileImage":sessionProfileImage,
                "participantIds":currentEmployeeIdArr
            });
            //重新渲染聊天窗口
            this._renderActiveSessionInfo();
            this.updateLayout();
            //更新qx主面板讨论组显示
            if(activeSession.sessionType=="discussion"){
                qxPanel.addDiscussionMemberData({
                    "sessionID":activeSession.sessionId,
                    "name":sessionName,
                    "profileImage":sessionProfileImage,
                    "participantsIDs":currentEmployeeIdArr,
                    "participantsCount":currentEmployeeIdArr.length
                });
                qxPanel.reRenderDiscussionGroup();
            }
        },
        /**
         * 根据createTime unix时间戳获取时间的文本显示
         * @param createTime
         */
        getFormatCreateTime:function(createTime){
            var baseTime=this.serverTime?moment.unix(this.serviceTime):moment(),
                createTime=moment.unix(createTime);
            var formatTime='',
                year=createTime.year(),
                month=createTime.month(),
                date=createTime.date();
            if(baseTime.year()!=createTime.year()){
                formatTime+=year+'-';
            }
            if(baseTime.month()!=month||baseTime.date()!=date){
                formatTime+=(month+1)+'-'+date;
            }
            formatTime+=' '+createTime.format('HH:mm');
            return formatTime;
        },
        /**
         * 根据messageType获取对应的key
         * @param messageType
         */
        getMessageTypeKey:function(messageType){
            var key;
            switch(messageType){
                case 2:
                    key="text";
                    break;
                case 3:
                    key="img";
                    break;
                case 4:
                    key="attach";
                    break;
                case 5:
                    key="audio";
                    break;
                case 6:
                    key="location";
                    break;
                case 7:
                    key="control";
                    break;
                default:
                    key="unknown";
                    break;
            }
            return key;
        },
        /**
         * 根据messageType获取模板编译后的html string
         * @param messageType
         */
        getMessageItemHtml:function(messageData){
            var messageItemHtml,
                messageContentText,
                messageType=messageData.messageType,
                employeeName,
                attach;
            var activeSession=this.getActiveSession();
            if(activeSession.sessionType=="discussion"){
                employeeName=messageData.employee.name;
                if(messageData.employeeID==loginUserData.id){
                    employeeName="我";
                }
            }else{
                employeeName="";
            }
            //选择不同的模板编译函数
            switch(messageType){
                case 3: //图片
                    attach=messageData.attach[0];   //只会有一个attach
                    messageItemHtml=messageImgCompiled({
                        "messageContent":messageData.messageShowContent,
                        "createTime":this.getFormatCreateTime(messageData.createTime),
                        "employeeName":employeeName,
                        "img":'<img class="img-thumb" src="'+util.getDfLink(attach.attachPath+'3',attach.attachName,false,attach.fileIcon)+'" alt="" />',
                        "attachSize":util.getFileSize(attach.attachSize),
                        "path":attach.attachPath,
                        "attachData":encodeURIComponent(json.stringify(attach))
                    });
                    break;
                case 4: //附件
                    attach=messageData.attach[0];   //只会有一个attach
                    messageItemHtml=messageAttachCompiled({
                        "messageContent":messageData.messageShowContent,
                        "createTime":this.getFormatCreateTime(messageData.createTime),
                        "employeeName":employeeName,
                        "attachName":attach.attachName,
                        "attachSize":util.getFileSize(attach.attachSize),
                        "attachIcon": '<img class="fs-attach-'+util.getFileType({
                            "name":attach.attachName
                        })+'-icon attach-icon" src="'+FS.BLANK_IMG+'" alt="" />',
                        "downloadPath":util.getDfLink(attach.attachPath,attach.attachName,true),
                        "attachData":encodeURIComponent(json.stringify(attach)),
                        "canPreview":attach.canPreview
                    });
                    break;
                case 5: //录音
                    attach=messageData.attach[0];   //只会有一个attach
                    messageItemHtml=messageAudioCompiled({
                        "messageContent":messageData.messageShowContent,
                        "createTime":this.getFormatCreateTime(messageData.createTime),
                        "employeeName":employeeName,
                        "audioSrc":util.getDfLink(util.getFileNamePath(attach.attachPath),attach.attachName,false,'mp3'),
                        "audioLength":attach.attachSize,
                        "isAudioUnread":messageData.isAudioUnread,
                        "messageId":messageData.shortMessageID
                    });
                    break;
                case 6: //定位
                    messageItemHtml=messageLocationCompiled({
                        "messageContent":util.getLocationInfo(messageData.messageLocation),
                        "createTime":this.getFormatCreateTime(messageData.createTime),
                        "employeeName":employeeName,
                        "locationData":encodeURIComponent(json.stringify(messageData.messageLocation))
                    });
                    break;
                case 7: //控制
                    messageItemHtml=messageControlCompiled({
                        "messageContent":(employeeName=="我"?"你":employeeName)+messageData.messageShowContent
                    });
                    break;
                case 2:     //普通文本
                default:
                    //替换尖括号
                    messageContentText=messageData.messageShowContent;
                    messageContentText=messageContentText.replace(/</g,'&lt;');
                    messageContentText=messageContentText.replace(/>/g,'&gt;');
                    messageContentText=messageContentText.replace(/[\n\r]/g,'<br/>');
                    messageContentText=messageContentText.replace(new RegExp(' ', 'g'),'&nbsp;');
                    //地址变为a链接
                    messageContentText=messageContentText.replace(httpReg,function(httpText){
                        return '<a href="'+httpText+'" target="_blank">'+httpText+'</a>';
                    });
                    messageItemHtml=messageTextCompiled({
                        "messageContent":messageContentText,
                        "createTime":this.getFormatCreateTime(messageData.createTime),
                        "employeeName":employeeName
                    });
                    break;
            }
            return messageItemHtml;
        },
        getMessageCompiled:function(messageData){

        },
        getMessagePosition:function(messageData){

        },
        /**
         * 根据message list数据重新渲染message列表
         * @param messageListData
         */
        reRenderMessageList:function(messageListData){
            var that=this;
            var elEl=this.element,
                messageListEl=$('.message-list',elEl);
            //播放录音组件清空
            _.each(this.audioCpts,function(audioCpt){
                audioCpt.destroy();
            });
            this.audioCpts=[];  //置空
            messageListEl.empty();
            /*_.each(messageListData,function(itemData){
                that.appendNewMessage(itemData);
            });*/
            this.appendAllNewMessage(messageListData);
        },
        /**
         * 清空当前消息列表
         */
        emptyMessageList:function(){
            this.reRenderMessageList([]);
        },
        appendAllNewMessage:function(messageDatas){
            var that=this;
            var elEl=this.element,
                messageListWEl=$('.message-list-wrapper',elEl);
            messageDatas=[].concat(messageDatas);
            _.each(messageDatas,function(messageData){
                that.appendNewMessage(messageData);
            });
            //滚动条滚到最下面
            messageListWEl.scrollTop(10000);
        },
        /**
         * 追加新的message
         * @param messageData
         */
         appendNewMessage:function(messageData){
            var elEl=this.element,
                messageListWEl=$('.message-list-wrapper',elEl),
                messageListEl=$('.message-list',messageListWEl),
                messageItemEl,
                messageTextEl,
                refInsertAfterEl,    //消息插入位置的参考元素
                lastItemEl, //最后一条message item
                ignore=false;
            //最后一道防线，防止重复信息显示
            if(_.isUndefined(messageData.shortMessageID)){  //如果未定义id，直接返回
                return;
            }
            //获取插入位置参考
            $('.message-item',messageListEl).each(function(){
                var meEl=$(this),
                    messageId=meEl.attr('messageid');
                if(messageId==messageData.shortMessageID){
                    ignore=true;
                    return false;
                }
            });
            if(ignore){
                return;
            }else{
                refInsertAfterEl=$('.message-item',messageListEl).filter('[messageid="'+(messageData.shortMessageID-1)+'"]');
                if(refInsertAfterEl.length==0){
                    lastItemEl=$('.message-item',messageListEl).last();
                    if(messageData.shortMessageID-1>lastItemEl.attr('messageid')){
                        refInsertAfterEl="last";
                    }else{
                        refInsertAfterEl="first";
                    }
                }
            }
            /*if(messageData.shortMessageID<=messageListEl.children('.message-item').last().attr('messageid')){
                return;
            }*/
            var messageTypeKey=this.getMessageTypeKey(messageData.messageType);
            var messageItemHtml=this.getMessageItemHtml(messageData),
                messagePosition,
                audioThemeStyle;    //音频播放风格
            //确定消息位置
            if(messageData.messageType==7){ //控制信息在中间
                messagePosition="center";
            }else{
                if(messageData.employeeID==loginUserData.id){
                    messagePosition="right";
                    audioThemeStyle=3;
                }else{
                    messagePosition="left";
                    audioThemeStyle=2;
                }
            }
            //生成dom
            messageItemEl=$('<li messageid="'+messageData.shortMessageID+'" class="message-item message-type-'+messageTypeKey+' message-position-'+messagePosition+' fn-clear">'+messageItemHtml+'</li>');
            //如果包含图片，在img.load里滚动到底部
            var tempImgEl=messageItemEl.find('img');
            if(tempImgEl.length>0){
                tempImgEl.load(function(){
                    //滚动条滚到最下面
                    messageListWEl.scrollTop(10000);
                });
            }
            //追加到相应位置
            if(refInsertAfterEl=="last"){
                messageItemEl.appendTo(messageListEl);
            }else if(refInsertAfterEl=="first"){
                messageItemEl.prependTo(messageListEl);
            }else{
                messageItemEl.insertAfter(refInsertAfterEl);
            }
            //messageItemEl.appendTo(messageListEl);
            //更新滚动条位置
            //this._chatMessageScrollBar.update('bottom');
            //滚动条滚到最下面
            //messageListWEl.scrollTop(10000);

            //播放录音兼容性处理
            var audioBoxEl;
            if(messageData.messageType==5){
                //创建音频对象
                audioBoxEl=$('.audio-box',messageItemEl);
                this.audioCpts.push(new AudioPlayer({
                    "element":audioBoxEl,
                    "audioSrc":audioBoxEl.attr('audiosrc'),
                    "themeStyle":audioThemeStyle,
                    "length":messageData.attach[0].attachSize
                }));
            }
            //清除最大阈值以上历史记录
            var maxHisNum=this.get('maxHisNum'),
                messageItemsEl=$('.message-item',messageListEl),
                removeItemsEl;
            if(messageItemsEl.length>maxHisNum){
                removeItemsEl=messageItemsEl.slice(0,messageItemsEl.length-maxHisNum);
                //先清空录音播放组件
                _.each(this.audioCpts.splice(0,removeItemsEl.filter('.message-type-audio').length),function(audioCpt){
                    audioCpt.destroy();
                });
                //直接remove dom
                removeItemsEl.remove();
            }
        },
        /**
         * 关闭所有的语音播放
         */
        stopAllAudio:function(){
            _.each(this.audioCpts,function(audioPlayer){
                audioPlayer.stop();
            });
        },
        /**
         * 显示新消息提醒
         */
        showNewMessageAlert:function(newMessNum){
            var elEl=this.element,
                tbarEl=$('.fs-qx-chat-hidden .fs-qx-chat-tbar',elEl),
                chatTitleEl=$('.fs-qx-chat-title',tbarEl);
            tbarEl.addClass('fs-qx-new-message');
            chatTitleEl.css({
                "color":"#ffffff"
            }).text('您有'+newMessNum+'条新企信');
            //高亮提示
            util.toggleAnimate({
                "element": chatTitleEl,
                "startProperty": {
                    "backgroundColor": "#ffffff"
                    //"opacity":0.33
                },
                "endProperty": {
                    "backgroundColor": "#f76c05"
                    //"opacity":1
                },
                "animateOpts": {
                    "easing": "swing",
                    "duration": 130
                },
                "count": 2   //循环2次
            });
        },
        /**
         * 上传组件懒渲染
         * @private
         */
        _lazyRenderUploader:function(){
            var that=this;
            var elEl=this.element,
                imgUploaderEl=$('.upload-img-h .upload-field',elEl),
                attachUploaderEl=$('.upload-attach-h .upload-field',elEl),
                messageSubmitEl=$('.message-submit-wrapper',elEl),
                uploadEl=$('.upload-file',messageSubmitEl);
            var selectUploadItem=function(file,uploadType){
                var fileSize=util.getFileSize(file.size),
                    fileType=util.getFileType(file);
                messageSubmitEl.addClass('with-upload');
                uploadEl.attr('fileid',file.id);
                uploadEl.attr('uploadtype',uploadType);
                $('.file-name',uploadEl).html('<img class="file-icon fs-attach-'+fileType+'-small-icon" src="'+FS.BLANK_IMG+'" /><span class="file-name-content">'+file.name+'（'+fileSize+')</span>');
                imgUploader.setDisable(true);
                attachUploader.setDisable(true);
            };
            var uploadFileSizeLimit=contactData["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            var imgUploader=new Uploader({
                "element":imgUploaderEl,
                "h5Opts":{
                    multiple:false,
                    accept:"image/*",
                    filter: function (files) {
                        var passedFiles=[];
                        _.each(files,function(fileData){
                            if (fileData.size < uploadFileSizeLimit*1024*1024&&fileData.size>0) {   //最大20m
                                if(util.getFileType(fileData)=="jpg"){
                                    passedFiles.push(fileData);
                                }else{
                                    util.alert('请选择图片格式的文件');
                                }
                            }else{
                                util.alert("上传文件不能大于"+uploadFileSizeLimit+"m，内容不能为空");
                            }

                        });
                        return passedFiles;
                    }
                },
                "flashOpts":{
                    file_types : "*.jpg;*.gif;*.jpeg;*.png",
                    file_types_description : "图片格式",
                    file_queued_handler:function(fileData){
                        if (fileData.size < uploadFileSizeLimit*1024*1024&&fileData.size>0) {   //最大20m
                            return imgUploader.opts.onSelect.call(imgUploader,fileData);
                        }else{
                            imgUploader.core.cancelUpload(fileData.id,false);   //不触发uploadError事件
                            util.alert("上传文件不能大于"+uploadFileSizeLimit+"m，内容不能为空");
                        }
                    }
                },
                "onSelect":function(file){
                    selectUploadItem(file,'img');
                },
                "onSuccess":function(file,responseText){
                    that.trigger('uploaded',file,responseText,'img');
                },
                "onFailure":function(file){
                    that.trigger('uploadederror',file);
                }
            }),attachUploader=new Uploader({
                "element":attachUploaderEl,
                "h5Opts":{
                    multiple:false,
                    accept:"*/*",
                    filter: function (files) {
                        var passedFiles=[];
                        _.each(files,function(fileData){
                            if (fileData.size < uploadFileSizeLimit*1024*1024&&fileData.size>0) {   //最大20m
                                passedFiles.push(fileData);
                            }else{
                                util.alert("上传文件不能大于"+uploadFileSizeLimit+"m，内容不能为空");
                            }

                        });
                        return passedFiles;
                    }
                },
                "flashOpts":{
                    file_types : "*.*",
                    file_types_description : "所有文件",
                    file_queued_handler:function(fileData){
                        if (fileData.size < uploadFileSizeLimit*1024*1024&&fileData.size>0) {   //最大20m
                            return attachUploader.opts.onSelect.call(attachUploader,fileData);
                        }else{
                            attachUploader.core.cancelUpload(fileData.id,false);   //不触发uploadError事件
                            util.alert("上传文件不能大于"+uploadFileSizeLimit+"m，内容不能为空");
                        }
                    }
                },
                "onSelect":function(file){
                    selectUploadItem(file,'attach');
                },
                "onSuccess":function(file,responseText){
                    that.trigger('uploaded',file,responseText,'attach');
                },
                "onFailure":function(file){
                    that.trigger('uploadederror',file);
                }
            });
            this.imgUploader=imgUploader;
            this.attachUploader=attachUploader;
        },
        render:function(){
            this.element.html(moduleTplEl.filter('.fs-qx-chat-tpl').html());
            var result=ChatPanel.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        _renderCpt:function(){
            var elEl=this.element,
                shownPanelEl=$('.fs-qx-chat-shown',elEl),
                messageListWEl=$('.message-list-wrapper',shownPanelEl),
                participantWEl=$('.participant-list-wrapper',shownPanelEl);
            //聊天窗口滚动条
            /*this._chatMessageScrollBar=new Scrollbar({
                "element":messageListWEl
            });*/
            //参与人滚动条
            /*this._participantScrollBar=new Scrollbar({
                "element":participantWEl
            });*/
        },
        show:function(){
            var result=ChatPanel.superclass.show.apply(this,arguments);
            return result;
        },
        hide:function(){
            var result=ChatPanel.superclass.hide.apply(this,arguments);
            this.clear();
            return result;
        },
        /**
         * 清理数据和dom
         */
        clear:function(){
            var elEl=this.element,
                chatNavPanelEl=$('.chat-nav-panel',elEl),
                participantPanelEl=$('.participant-panel',elEl);
            this.sessionListData=null;
            this.set('activeIndex',-1); //激活index reset
            $('.chat-list',chatNavPanelEl).empty();
            chatNavPanelEl.hide();
            $('.participant-list',chatNavPanelEl).remove();
            participantPanelEl.hide();
        },
        destroy:function(){
            var result;
            this.serverTime=null;
            clearTimeout(this.messageTid);
            this.messageTid=null;
            clearInterval(this.starHtmlTitleTid);
            this.starHtmlTitleTid=null;
            //音频对象销毁
            _.each(this.audioCpts,function(cpt){
                cpt.destroy&&cpt.destroy();
            });
            this.audioCpts=null;
            //新消息提醒音频对象销毁
            this._newMessageStore=null;
            this.newMessageAlertPlayer&&this.newMessageAlertPlayer.destroy();
            this.newMessageAlertPlayer&&this.newMessageAlertPlayer.shadowEl.remove();
            this.newMessageAlertPlayer&&(this.newMessageAlertPlayer.shadowEl=null);
            this.newMessageAlertPlayer=null;
            //清理切换session ajax对象
            this._sessionXhr=null;
            //滚动条组件清理
            this._chatMessageScrollBar&&this._chatMessageScrollBar.destroy();
            this._participantScrollBar&&this._participantScrollBar.destroy();

            this.joinDialog&&this.joinDialog.destroy();
            this.imgUploader&&this.imgUploader.destroy();
            this.attachUploader&&this.attachUploader.destroy();
            this.sessionListData=null;
            result=ChatPanel.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    /**
     * 企信主面板
     * @type {*}
     */
    var FsQx=Overlay.extend({
        attrs: {
            "align":{
                selfXY: ['100%+20px', '100%'],     // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
                baseXY: ['100%', '100%']      // 基准定位元素的定位点，默认为左上角
            },
            "className":"fs-qx",
            "zIndex":100,
            "qxStatus":null  //存储通过全局提醒循环返回的企信状态数据
        },
        events: {
            'click':'_clickSelf',   //点击本身
            'click .fs-qx-shown .fs-qx-tbar': '_clickToHidden', //显示状态下点击tbar会切换到隐藏状态
            'click .fs-qx-shown .fs-qx-bbar .hide-h':'_clickToHidden',  //显示状态下点击tbar会切换到隐藏状态
            'click .fs-qx-hidden .fs-qx-tbar': '_switchToShown', //隐藏状态下点击tbar会切换到显示状态
            'click .open-dg-l':'_openNewDg',    //创建新的讨论组
            'click .fs-qx-group-item .fs-qx-group-hd':'_clickGroupItem',   //点击组item
            'click .online-group .fs-qx-member-item':'_clickEmployeeItem', //点击全部在线同事列表
            'click .circle-group .fs-qx-member-item':'_clickEmployeeItem',   //点击部门同事item
            'click .no-circle-group .fs-qx-member-item':'_clickEmployeeItem',   //点击无部门同事item
            'click .fs-qx-list-search .fs-qx-member-item':'_clickEmployeeItem', //点击搜索同事列表
            'click .rlm-group .fs-qx-member-item':'_clickEmployeeItem',   //点击最近联系人
            'click .discussion-group .fs-qx-member-item':'_clickTeamItem'   //点击讨论组成员
        },
        setup:function(){
            var that=this;
            var result=FsQx.superclass.setup.apply(this,arguments);
            this.groupListData=null;    //存储分组数据，根据分组数据渲染组成员
            this._setupCpt();
            this._initGroupListData();  //初始化分组数据
            this._bindEvents();
            return result;
        },
        /**
         * 创建内部依赖组件
         * @private
         */
        _setupCpt:function(){
            //创建邀请对话框
            var joinDialog=new JoinDialog({
                "moveLeftIntercept":function(joinSelectedData){
                    if(joinSelectedData.id==loginUserData.id){
                        this.joinList.unselectItem(joinSelectedData.id);
                        return false;
                    }
                },
                "moveRightIntercept":function(unjoinSelectedData){
                    if(unjoinSelectedData.id==loginUserData.id){
                        this.unjoinList.unselectItem(unjoinSelectedData.id);
                        return false;
                    }
                },
                "joinMinNum":2,
                "joinMinNumTpl":"讨论组最少{{joinMinNum}}人"
            });
            var chatPanel=new ChatPanel({
                "joinDialog":joinDialog,
                "qxPanel":this  //双向绑定
            }).render();    //需要提前render，保证结构准备好
            this.joinDialog=joinDialog;
            this.chatPanel=chatPanel;
        },
        /**
         * 组数据初始化
         * @private
         */
        _initGroupListData:function(){
            var that=this;
            var groupListData=[];
            var circleListData=contactData["g"],    //部门列表
                myDiscussions=originContactData["myDiscussions"], //讨论组成员
                recentlyLinkMans=originContactData["recentlyLinkMans"], //最近联系人列表
                noCircleListData=this.getNoCircleEmployees(); //未分配部分的员工
            //讨论组
            myDiscussions= _.map(myDiscussions,function(itemData){
                return _.extend({},itemData);
            });
            groupListData.push({
                "name":'讨论组[<span class="total-num">'+myDiscussions.length+'</span>]',
                "title":"讨论组",
                "groupType":"discussion",   //组类型
                "cls":"discussion-group",   //附加item的cls
                "memberListData":myDiscussions
            });
            //最近联系同事
            recentlyLinkMans=_.map(recentlyLinkMans,function(itemData){
                var employeeData=util.getContactDataById(itemData.value,'p');
                if(employeeData){
                    return _.extend({
                        "state":"offline",
                        "lastChatDate":itemData.value1
                    },employeeData);
                }else{
                    return null;
                }
            });
            //过滤掉null用户
            recentlyLinkMans=_.filter(recentlyLinkMans,function(itemData){
                return !!itemData;
            });
            //recentlyLinkMans.reverse();
            groupListData.push({
                "name":'最近联系同事[<span class="online-num">0</span>/<span class="total-num">'+recentlyLinkMans.length+'</span>]',
                "title":"最近联系同事",
                "groupType":"rlm",   //组类型
                "cls":"rlm-group",
                //"onlineNum":0,  //在线人数
                "memberListData":recentlyLinkMans
            });
            //全部在线
            groupListData.push({
                "name":'全部在线[<span class="total-num">0</span>]',
                "title":"全部在线",
                "groupType":"online",   //组类型
                "cls":"online-group",
                //"onlineNum":0,  //在线人数
                "memberListData":[]
            });
            //部门
            //滤掉全公司信息
            circleListData= _.filter(circleListData,function(itemData){
                return itemData.id!="999999";
            });
            _.each(circleListData,function(itemData){
                var memberListData=util.getEmployeeListByCircleId(itemData.id);
                //过滤掉登录登录用户
                memberListData= _.filter(memberListData,function(itemData){
                    return itemData.id!=loginUserData.id;
                });
                memberListData=_.map(memberListData,function(itemData){
                    return _.extend({
                        "state":"offline"
                    },itemData);
                });
                //按spell排序
                memberListData= _.sortBy(memberListData,function(itemData){
                    return itemData.spell;
                });
                groupListData.push({
                    "name":itemData.name+'[<span class="online-num">0</span>/<span class="total-num">'+memberListData.length+'</span>]',
                    "title":itemData.name,
                    "groupType":"circle",   //组类型
                    "cls":"circle-group",
                    //"onlineNum":0,  //在线人数
                    "memberListData":memberListData
                });
            });
            //无部门
            //过滤掉登录登录用户
            noCircleListData= _.filter(noCircleListData,function(itemData){
                return itemData.id!=loginUserData.id;
            });
            noCircleListData=_.map(noCircleListData,function(itemData){
                return _.extend({
                    "state":"offline"
                },itemData);
            });
            groupListData.push({
                "name":'无部门[<span class="online-num">0</span>/<span class="total-num">'+noCircleListData.length+'</span>]',
                "title":"无部门",
                "groupType":"noCircle",   //组类型
                "cls":"no-circle-group",
                //"onlineNum":0,  //在线人数
                "memberListData":noCircleListData
            });
            this.groupListData=groupListData;
        },
        /**
         * 事件绑定处理
         * @private
         */
        _bindEvents:function(){
            var that=this;
            //企信session轮询信息通过黄条提醒输出，需要注册globalremind事件
            tpl.event.on('globalremind',function(responseData){
                if(responseData.success){
                    that.pullSessionInfo(responseData.value);
                }
            });
            //随window的scroll和重新定位element位置
            $(root).scroll(function(){
                that._setPosition();
            });
            $('body').on('click',function(evt){
                that._switchToHidden();
            });
        },
        _clickSelf:function(evt){
            evt.stopPropagation();  //阻止事件冒泡
        },
        _clickToHidden:function(evt){
            this._switchToHidden();
            evt.preventDefault();
        },
        /**
         * 切换到隐藏状态
         * @param evt
         * @private
         */
        _switchToHidden:function(){
            var elEl=this.element,
                shownEl=$('.fs-qx-shown',elEl),
                hiddenEl=$('.fs-qx-hidden',elEl);
            shownEl.hide();
            hiddenEl.show();
        },
        /**
         * 切换到显示状态
         * @param evt
         * @private
         */
        _switchToShown:function(evt){
            var that=this;
            var elEl=this.element,
                shownEl=$('.fs-qx-shown',elEl),
                hiddenEl=$('.fs-qx-hidden',elEl);
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
        _prepareGroupList:function(){
            var that=this;
            if(!this._groupListRendered){  //懒渲染group组
                this._renderGroupList();
                //更新聊天状态
                setTimeout(function(){
                    that._onRenderQxStatus(that.get('qxStatus'));
                },0);
                this._groupListRendered=true;
            }
        },
        /**
         * 打开新的讨论组
         * @param evt
         * @private
         */
        _openNewDg:function(evt){
            var that=this;
            var joinDialog=this.joinDialog,
                chatPanel=this.chatPanel;
            var meEl=$(evt.currentTarget);
            if(!meEl.hasClass('state-disabled')){
                joinDialog.show();
                //设置邀请框初始数据
                joinDialog.setInitData({
                    "joinData":[loginUserData],
                    "unjoinData":excludeEmployee(loginUserData.id)
                });
                //设置动态回调
                joinDialog.set('successCb',function(joinData){
                    var participantsIDs= _.map(joinData,function(employeeData){
                        return employeeData.id;
                    });
                    //设置讨论组上限
                    if(participantsIDs.length>100){
                        util.alert('讨论组的人数上限为100位同事，请确认。',function(){
                            joinDialog.hide();
                        });
                        return;
                    }
                    util.api({
                        "url":"/ShortMessage/CreateSessionForDiscussion",
                        "data":{
                            "name":"",
                            "participantsIDs":participantsIDs
                        },
                        "success":function(responseData){
                            var dataRoot;
                            if(responseData.success){
                                dataRoot=responseData.value;
                                //更新qx panel discussion group list
                                that.addDiscussionMemberData(dataRoot);
                                that.reRenderDiscussionGroup();
                                //打开新创建的session chat
                                chatPanel.addOrUpdateSession({
                                    "employeeIds":dataRoot.participantsIDs,
                                    "sessionId":dataRoot.sessionID,
                                    "sessionType":"discussion"  //表明是讨论组团队
                                },true,{
                                    "profileImage":util.getAvatarLink(dataRoot.profileImage,3),
                                    "chatStateCls":"",  //讨论组无聊天状态
                                    "title":dataRoot.name,
                                    "name":dataRoot.name
                                });
                                //隐藏joinDialog
                                joinDialog.hide();
                            }
                        }
                    });
                });
            }
            evt.preventDefault();
            evt.stopPropagation();
        },
        /**
         * 根据group item打开关闭状态更新图标显示
         * @private
         */
        _updateGroupItemIconView:function(circleItemSelector){
            var circleItemEl=$(circleItemSelector),
                memberListWEl=$('.fs-qx-member-list-wrapper',groupItemEl);
            if(memberListWEl.length==0||memberListWEl.is(':hidden')){
                circleItemEl.addClass('state-collapse').removeClass('state-open');
            }else{
                circleItemEl.addClass('state-open').removeClass('state-collapse');
            }
        },
        /**
         * 点击部门item触发
         * @private
         */
        _clickGroupItem:function(evt){
            var circleItemEl=$(evt.currentTarget).closest('.fs-qx-group-item'),
                memberListWEl=$('.fs-qx-member-list-wrapper',circleItemEl);
            if(circleItemEl.hasClass('state-open')){    //处于open状态点击关闭
                memberListWEl.hide();
                circleItemEl.addClass('state-collapse').removeClass('state-open');
            }else{     //处于关闭状态点击展开
                //if(memberListEl.length==0){
                this._renderMemberList(circleItemEl); //重新创建
                memberListWEl=$('.fs-qx-member-list-wrapper',circleItemEl);
                //}
                memberListWEl.show();
                circleItemEl.addClass('state-open').removeClass('state-collapse');
            }
            this.updateQxScrollBar();
            evt.preventDefault();
        },
        /**
         * 点击同事item触发
         * @param evt
         * @private
         */
        _clickEmployeeItem:function(evt){
            var chatPanel=this.chatPanel;
            var memberItemEl=$(evt.currentTarget);
            var employeeId=memberItemEl.attr('employeeid'),
                employeeData=util.getContactDataById(employeeId,'p');
            chatPanel.addOrUpdateSession({
                "employeeIds":[parseInt(employeeId),loginUserData.id],
                "sessionType":"pair",
                "data":{
                    "name":employeeData.name,
                    "profileImage":employeeData.profileImagePath,
                    "participantIds":[loginUserData.id,employeeData.id]
                }
            },true,{
                "profileImage":util.getAvatarLink(employeeData.profileImagePath,3),
                "chatStateCls":this.getEmployeeChatState(employeeData.id),
                "title":employeeData.name,
                "name":employeeData.name
            });
            //chatPanel.show();
            //chatPanel.switchPanelStatus("shown",false);   //切换到最大化
        },
        /**
         * 点击讨论组团队
         * @param evt
         * @private
         */
        _clickTeamItem:function(evt){
            var chatPanel=this.chatPanel;
            var memberItemEl=$(evt.currentTarget);
            var sessionId=memberItemEl.attr('sessionid');
            var groupListData=this.groupListData,
                groupItemData=groupListData[0], //讨论组数据在第一位
                sessionData;
            //find出对应的session信息
            sessionData= _.find(groupItemData.memberListData,function(itemData){
                return itemData.sessionID==sessionId;
            });
            chatPanel.addOrUpdateSession({
                "employeeIds":sessionData.participantsIDs,
                "sessionId":sessionId,
                "sessionType":"discussion"  //表明是讨论组团队
            },true,{
                "profileImage":util.getAvatarLink(sessionData.profileImage,3),
                "chatStateCls":'',
                "title":sessionData.name,
                "name":sessionData.name
            });
            //chatPanel.show();
            //chatPanel.switchPanelStatus("shown",false);   //切换到最大化
        },
        _getDiscussionAvatar:function(profileImage){
            var imgPath;
            if(profileImage){
                imgPath=util.getDfLink(profileImage+'3','',false,'jpg');
            }else{
                imgPath=FS.ASSETS_PATH+'/images/icon-discussion-avatar.png';
            }
            return imgPath;
        },
        /**
         * 渲染内部组件
         * @private
         */
        _renderCpt:function(){
            var that=this;
            var elEl=this.element,
                listWEl=$('.fs-qx-list-wrapper',elEl),
                queryEl=$('.fs-qx-search',elEl),
                listSearchEl=$('.fs-qx-list-search',elEl);//搜索面板
            this.employeeQuery=new QueryInput({
                "element":queryEl,
                "cls":"employee-query"
            });
            //query事件绑定
            this.employeeQuery.on('query',function(keyword){
                if(keyword.length>0){
                    that._renderSearchList(keyword);  //渲染search list面板
                    that.switchListPanel("search");
                }else{
                    that.switchListPanel("group");
                }
                //默认选中第一个
                $('.fs-qx-member-item',listSearchEl).eq(0).addClass('state-selected');
            }).on('keynav',function(dir){
                var itemsEl=$('.fs-qx-member-item',listSearchEl),
                    selectedEl=itemsEl.filter('.state-selected'),
                    newSelectedEl;
                if(selectedEl.length==0){
                    selectedEl=itemsEl.eq(0);
                }
                if(dir=="up"){
                    newSelectedEl=selectedEl.prev();
                    if(newSelectedEl.length==0){
                        newSelectedEl=itemsEl.last();
                    }
                }else if(dir=="down"){
                    newSelectedEl=selectedEl.next();
                    if(newSelectedEl.length==0){
                        newSelectedEl=itemsEl.first();
                    }
                }
                //选中下一个
                selectedEl.removeClass('state-selected');
                newSelectedEl.addClass('state-selected');
            }).on('submit',function(evt){
                var itemsEl=$('.fs-qx-member-item',listSearchEl),
                    selectedEl=itemsEl.filter('.state-selected');
                if(selectedEl.length==0){
                    selectedEl=itemsEl.eq(0);
                }
                //触发item的click事件
                $('.member-info',selectedEl).click();
                evt.preventDefault();
            });
            listSearchEl.on('mouseenter','.fs-qx-member-item',function(evt){
                var itemEl=$(evt.currentTarget);
                $('.fs-qx-member-item',listSearchEl).removeClass('state-selected');
                itemEl.addClass('state-selected');
            });
            //主面板自定义滚动条
            //listWEl.tinyscrollbar();
            this.qxListScrollBar=new Scrollbar({
                "element":listWEl
            });
            this.qxSearchScrollBar=new Scrollbar({
                "element":listSearchEl
            });
            //先隐藏搜索列表
            this.qxSearchScrollBar.hide();
        },
        /**
         * 渲染搜索员工列表
         * @private
         */
        _renderSearchList:function(keyword){
            var elEl=this.element,
                listSearchEl=$('.fs-qx-list-search',elEl);//搜索面板
            var qxStatus=this.get('qxStatus'),
                onlineEmployeeIDs=qxStatus.statusData.onlineEmployeeIDs,
                mobileOnlineEmployeeIDs=qxStatus.statusData.mobileOnlineEmployeeIDs;
            var employeeListData=excludeEmployee(loginUserData.id);
            var searchListData=[],
                filterData1,
                filterData2;
            filterData1=stringMatch(employeeListData,keyword,{
                "key":"name"
            });
            filterData2=startsWith(employeeListData,keyword,{
                "key":"spell"
            });
            //先插入filterData2的数据
            _.each(filterData2,function(itemData){
                if(!_.find(filterData1,function(itemData2){
                    return itemData2.id==itemData.id;
                })){
                    searchListData.push(itemData);
                }
            });
            searchListData=searchListData.concat(filterData1);
            searchListData=_.map(searchListData,function(itemData){
                var state;
                if(_.contains(onlineEmployeeIDs,itemData.id)){
                    if(_.contains(mobileOnlineEmployeeIDs,itemData.id)){
                        state="mobile-online";
                    }else{
                        state="pc-online";
                    }
                }else{
                    state="offline";
                }
                return _.extend({
                    "state":state
                },itemData);
            });
            //渲染列表
            this._renderMemberList_circle(listSearchEl,{
                "memberListData":searchListData
            });
        },
        /**
         * 渲染成员列表入口，分派给对应适配器
         * @param groupItemSelector
         * @private
         */
        _renderMemberList:function(groupItemSelector){
            //var groupItemData=this.getGroupDataBySelector(groupItemSelector),
            var groupItemData=this.getGroupDataByIndex($(groupItemSelector).attr('groupindex')),
                groupType=groupItemData.groupType;
            this["_renderMemberList_"+groupType].call(this,groupItemSelector,groupItemData);
        },
        _renderMemberList_discussion:function(groupItemSelector,groupItemData){
            var that=this;
            var groupItemEl=$(groupItemSelector),
                memberListWEl=$('.fs-qx-member-list-wrapper',groupItemEl);

            var htmlStr='',
                memberListData=groupItemData["memberListData"];
            if(memberListData.length>0){
                htmlStr+='<ul class="fs-qx-member-list">';
                _.each(memberListData,function(itemData){
                    var participantsIDs=itemData.participantsIDs||[];
                    htmlStr+='<li class="fs-qx-member-item" sessionid="'+itemData.sessionID+'"><a href="javascript:;" title="'+itemData.name+'&nbsp;[共'+participantsIDs.length+'人]" class="member-info fn-clear"><span class="avatar-wrapper fn-left"><img src="'+that._getDiscussionAvatar(itemData.profileImage)+'" alt="" class="avatar-thumb" /><img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state" /></span><span class="member-name fn-left">'+itemData.name+'<span class="working-state">&nbsp;['+participantsIDs.length+']</span></span></a></li>';
                });
                htmlStr+='</ul>';
            }
            memberListWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        _renderMemberList_rlm:function(groupItemSelector,groupItemData){
            //额外限制，只渲染前20个
            groupItemData["memberListData"]=groupItemData["memberListData"].slice(0,20);
            //和部门group构建方式一样
            this._renderMemberList_circle(groupItemSelector,groupItemData);
        },
        /**
         * 全部在线group
         * @param groupItemSelector
         * @param groupItemData
         * @private
         */
        _renderMemberList_online:function(groupItemSelector,groupItemData){
            //和部门group构建方式一样
            this._renderMemberList_circle(groupItemSelector,groupItemData);
        },
        _renderMemberList_circle:function(groupItemSelector,groupItemData){
            var groupItemEl=$(groupItemSelector),
                memberListWEl=$('.fs-qx-member-list-wrapper',groupItemEl);

            var htmlStr='',
                memberListData=groupItemData["memberListData"];
            if(memberListData.length>0){
                htmlStr+='<ul class="fs-qx-member-list">';
                _.each(memberListData,function(itemData){
                    var workingState=itemData.workingState;
                    //工作状态提示
                    if(_.isString(workingState)&&workingState.length>0){
                        workingState='&nbsp;-&nbsp;'+workingState;
                    }
                    htmlStr+='<li class="fs-qx-member-item state-'+itemData.state+'" employeeid="'+itemData.id+'"><a href="javascript:;" title="'+itemData.name+workingState+'" class="member-info fn-clear"><span class="avatar-wrapper fn-left"><img src="'+util.getAvatarLink(itemData.profileImagePath,3)+'" alt="" class="avatar-thumb" /><img src="'+FS.BLANK_IMG+'" class="fs-qx-flag-state" /></span><span class="member-name fn-left">'+itemData.name+'<span class="working-state">'+workingState+'</span></span></a></li>';
                });
                htmlStr+='</ul>';
            }
            memberListWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        _renderMemberList_noCircle:function(groupItemSelector,groupItemData){
            //和部门group构建方式一样
            this._renderMemberList_circle(groupItemSelector,groupItemData);
        },
        /**
         * 渲染组列表
         * @private
         */
        _renderGroupList:function(){
            var groupListData=this.groupListData;
            var elEl=this.element,
                listWEl=$('.fs-qx-list-wrapper',elEl);  //列表容器
            var htmlStr='';
            if(groupListData.length>0){
                htmlStr+='<ul class="fs-qx-group-list">';
                _.each(groupListData,function(groupItemData,i){
                    htmlStr+='<li class="'+groupItemData.cls+' fs-qx-group-item state-collapse" groupindex="'+i+'"><div class="fs-qx-group-hd"><a href="javascript:;" title="'+groupItemData.title+'">'+groupItemData.name+'</a></div><div class="fs-qx-member-list-wrapper"></div></li>';
                });
                htmlStr+='</ul>';
            }
            listWEl.html(htmlStr);
            this.updateQxScrollBar();
        },
        render:function(){
            this.element.html(moduleTplEl.filter('.fs-qx-tpl').html());
            var result=FsQx.superclass.render.apply(this,arguments);
            this._renderCpt();
            //改成懒渲染，防止页面打开时阻断js的执行
            //this._renderGroupList(); //组列表渲染
            return result;
        },
        show:function(){
            var result=FsQx.superclass.show.apply(this,arguments);
            return result;
        },
        /**
         * 根据panelState切换列表面板状态，目前有两种类型的面板group/search
         * @param panelState
         */
        switchListPanel:function(panelState){
            panelState=panelState||"group"; //默认切换到group面板
            /*var elEl=this.element,
                listWEl=$('.fs-qx-list-wrapper',elEl),  //group面板
                listSearchEl=$('.fs-qx-list-search',elEl);//搜索面板
            if(panelState=="group"){
                listWEl.show();
                listSearchEl.hide();
            }else if(panelState=="search"){
                listWEl.hide();
                listSearchEl.show();
            }*/
            var qxListScrollBar=this.qxListScrollBar,
                qxSearchScrollBar=this.qxSearchScrollBar;
            if(panelState=="group"){
                qxListScrollBar.show();
                qxListScrollBar.update();
                qxSearchScrollBar.hide();
            }else if(panelState=="search"){
                qxListScrollBar.hide();
                qxSearchScrollBar.show();
                qxSearchScrollBar.update();
            }
        },
        /**
         * 获取所有未分配员工列表
         */
        getNoCircleEmployees:function(){
            var employeeListData=contactData["p"],
                noCircleListData; //未分配部分的员工
            noCircleListData= _.filter(employeeListData,function(itemData){
                return ((!itemData.groupIDs)||itemData.groupIDs.length==0);
            });
            return noCircleListData;
        },
        /**
         * 根据group item选择符获取对应 groupData
         */
        getGroupDataBySelector:function(groupItemSelector){
            var elEl=this.element,
                groupListEl=$('.fs-qx-group-item',elEl),
                groupItemEl=$(groupItemSelector),
                groupIndex=groupListEl.index(groupItemEl);
            var groupListData=this.groupListData,
                groupItemData=groupListData[groupIndex];
            return groupItemData;
        },
        /**
         * 根据index取groupData，比getGroupDataBySelector效率高很多，尤其在ie<=7下
         * @param groupItemIndex
         * @returns {*}
         */
        getGroupDataByIndex:function(groupItemIndex){
            groupItemIndex=parseInt(groupItemIndex);
            if(!_.isNumber(groupItemIndex)){
                return;
            }
            return this.groupListData[groupItemIndex];
        },
        /**
         * 获取员工聊天状态，pc在线/mobile在线/离线
         */
        getEmployeeChatState:function(employeeId){
            employeeId=parseInt(employeeId);
            var qxStatus=this.get('qxStatus'),
                statusData=qxStatus.statusData,
                onlineEmployeeIDs=statusData.onlineEmployeeIDs,
                mobileOnlineEmployeeIDs=statusData.mobileOnlineEmployeeIDs;
            var state;
            if(_.contains(onlineEmployeeIDs,employeeId)){
                if(_.contains(mobileOnlineEmployeeIDs,employeeId)){
                    state="mobile-online";
                }else{
                    state="pc-online";
                }
            }else{
                state="offline";
            }
            return state;
        },
        /**
         * 拉取session信息
         */
        pullSessionInfo:function(remindData){
            var qxStatus={
                "shortMessageCount":remindData.shortMessageCount,
                "statusData":remindData.shortMessage
            };
            this.set('qxStatus',qxStatus);
            //触发自定义事件qxstatus
            this.trigger('qxstatus',qxStatus);
        },
        /**
         * 根据group item和在线员工id调整group list sort
         */
        updateCircleMemberData:function(groupItemSelector){
            var that=this;
            //var groupData=this.getGroupDataBySelector(groupItemSelector),
            var groupData=this.getGroupDataByIndex($(groupItemSelector).attr('groupindex')),
                memberListData=groupData["memberListData"];
            var tempListData= _.groupBy(memberListData,function(itemData){
                var state=that.getEmployeeChatState(itemData.id); //获取员工聊天状态
                itemData.state=state;
                if(state!="offline"){
                    return "online";
                }else{
                    return "offline";
                }
            });
            //在线和不在线分别按字母排序
            tempListData["online"]= _.sortBy(tempListData["online"],function(itemData){
                return itemData.spell;
            });
            tempListData["offline"]= _.sortBy(tempListData["offline"],function(itemData){
                return itemData.spell;
            });
            //重新设置groupData的memberListData
            groupData["memberListData"]=tempListData["online"].concat(tempListData["offline"]);
        },
        /**
         * 调整最近联系人数据
         * @param groupItemSelector
         * @param onlineEmployeeIDs
         * @param mobileOnlineEmployeeIDs
         */
        updateRlmMemberData:function(groupItemSelector){
            var that=this;
            //var groupData=this.getGroupDataBySelector(groupItemSelector),
            var groupData=this.getGroupDataByIndex($(groupItemSelector).attr('groupindex')),
                memberListData=groupData["memberListData"];
            _.each(memberListData,function(itemData){
                itemData.state=that.getEmployeeChatState(itemData.id);
            });
            //按创建时间排序
            memberListData=_.sortBy(memberListData,function(itemData){
                return itemData.lastChatDate;
            });
            //反转
            memberListData.reverse();
            //重新设置groupData的memberListData
            groupData["memberListData"]=memberListData;
        },
        /**
         * 给最近联系人添加一个或多个memberData
         * 会覆盖已存在的数据
         * @param memberDatas
         */
        addRlmMemberData:function(memberDatas){
            memberDatas=[].concat(memberDatas);
            var groupListData=this.groupListData,
                groupItemData=groupListData[1], //最近联系人存储
                memberListData=groupItemData["memberListData"];
            var tempArr=[];
            //更新已存在的member
            _.each(memberDatas,function(memberData){
                if(!_.some(memberListData,function(memberData2){
                    if(memberData2.id==memberData.id){
                        memberData2.lastChatDate=memberData.lastChatDate;
                        return true;
                    }
                })){
                    tempArr.push(memberData);
                }
            });
            //添加新的member
            memberListData=memberListData.concat(tempArr);
            //根据lastChatDate排序
            memberListData=_.sortBy(memberListData,function(itemData){
                return itemData.lastChatDate;
            });
            //反转
            memberListData.reverse();
            //重设回原来存储
            groupItemData["memberListData"]=memberListData;
        },
        /**
         * 重新渲染最近联系人group
         */
        reRenderRlmGroup:function(){
            var elEl=this.element,
                rlmGroupEl=$('.rlm-group',elEl),
                memberListEl=$('.fs-qx-member-list',rlmGroupEl),
                totalNumEl=$('.total-num',rlmGroupEl);
            //var groupData=this.getGroupDataBySelector(rlmGroupEl);
            var groupData=this.getGroupDataByIndex(rlmGroupEl.attr('groupindex'));
            totalNumEl.text(groupData.memberListData.length>20?20:groupData.memberListData.length);   //最多显示20个最近联系人
            if(memberListEl.is(':visible')){
                this._renderMemberList_rlm(rlmGroupEl,groupData);
            }
        },
        /**
         * 给全部在线添加一个或多个memberData
         * 会覆盖已存在的数据
         * @param memberDatas
         */
        addOnlineMemberData:function(memberDatas){
            memberDatas=[].concat(memberDatas);
            var groupListData=this.groupListData,
                groupItemData=groupListData[2], //全部在线存储
                memberListData=groupItemData["memberListData"];
            var tempArr=[];
            //更新已存在的member
            _.each(memberDatas,function(memberData){
                if(!_.some(memberListData,function(memberData2){
                    if(memberData2.id==memberData.id){
                        _.extend(memberData2,memberData);
                        return true;
                    }
                })){
                    tempArr.push(memberData);
                }
            });
            //添加新的member
            memberListData=memberListData.concat(tempArr);
            //根据spell排序
            memberListData=_.sortBy(memberListData,function(itemData){
                return itemData.spell;
            });
            //重设回原来存储
            groupItemData["memberListData"]=memberListData;
        },
        /**
         * 删除全部在线一个memberData
         * @param memberDatas
         */
        removeOnlineMemberData:function(employeeId){
            var groupListData=this.groupListData,
                groupItemData=groupListData[2], //全部在线存储
                memberListData=groupItemData["memberListData"];
            memberListData= _.filter(memberListData,function(itemData){
                return itemData.id!=employeeId;
            });
            //重排
            memberListData=_.sortBy(memberListData,function(itemData){
                return itemData.spell;
            });
            //重设回原来存储
            groupItemData["memberListData"]=memberListData;
        },
        /**
         * 清掉所有全部在线组数据
         */
        removeAllOnlineMemberData:function(){
            var groupListData=this.groupListData,
                groupItemData=groupListData[2]; //全部在线存储
            //清空原存储
            groupItemData["memberListData"]=[];
        },
        /**
         * 重新渲染全部在线group
         */
        reRenderOnlineGroup:function(){
            var elEl=this.element,
                onlineGroupEl=$('.online-group',elEl),
                memberListEl=$('.fs-qx-member-list',onlineGroupEl),
                totalNumEl=$('.total-num',onlineGroupEl);
            //var groupData=this.getGroupDataBySelector(onlineGroupEl);
            var groupData=this.getGroupDataByIndex(onlineGroupEl.attr('groupindex'));
            totalNumEl.text(groupData.memberListData.length);
            if(memberListEl.is(':visible')){
                this._renderMemberList_online(onlineGroupEl,groupData);
            }
        },
        /**
         * 判断sessionId对应讨论组是否存在
         * @param sessionId
         */
        isExistDiscussion:function(sessionId){
            var groupListData=this.groupListData,
                groupItemData=groupListData[0], //讨论组存储
                memberListData=groupItemData["memberListData"];
            return _.some(memberListData,function(itemData){
                return itemData.sessionID==sessionId;
            });
        },
        /**
         * 添加最近讨论组数据，一个或多个
         * 会覆盖已存在的数据
         * @param memberDatas
         */
        addDiscussionMemberData:function(memberDatas){
            memberDatas=[].concat(memberDatas);
            var groupListData=this.groupListData,
                groupItemData=groupListData[0], //讨论组存储
                memberListData=groupItemData["memberListData"];
            var tempArr=[];
            //更新已存在的member
            _.each(memberDatas,function(memberData){
                if(!_.some(memberListData,function(memberData2,index){
                    if(memberData2.sessionID==memberData.sessionID){
                        memberListData[index]=_.extend(memberData2,memberData);   //覆盖原来的数据
                        if(memberData['participantIds']){    //如果是有效值，覆盖
                            memberListData[index]['participantsIDs']=memberData['participantIds']||[];  //命名不统一，待调整
                        }
                        return true;
                    }
                })){
                    if(memberData['participantIds']){
                        memberData['participantsIDs']=memberData['participantIds'];
                    }
                    tempArr.push(memberData);
                }
            });
            //添加新的member
            memberListData=memberListData.concat(tempArr);
            //根据讨论组最新一条消息的创建时间排序
            memberListData=_.sortBy(memberListData,function(itemData){
                return itemData.lastCreateTime;
            });
            //反转
            memberListData.reverse();
            //重设回原来存储
            groupItemData["memberListData"]=memberListData;
        },
        /**
         * 根据sessionId移除对应的讨论组数据
         * @param sessionId
         */
        removeDiscussionMemberData:function(sessionId){
            var groupListData=this.groupListData,
                groupItemData=groupListData[0], //讨论组存储
                memberListData=groupItemData["memberListData"];
            memberListData= _.filter(memberListData,function(itemData){
                return itemData.sessionID!=sessionId;
            });
            //重设回原来存储
            groupItemData["memberListData"]=memberListData;
        },
        /**
         * 重新渲染讨论组
         */
        reRenderDiscussionGroup:function(){
            var elEl=this.element,
                discussionGroupEl=$('.discussion-group',elEl),
                memberListEl=$('.fs-qx-member-list',discussionGroupEl),
                totalNumEl=$('.total-num',discussionGroupEl);
            //var groupData=this.getGroupDataBySelector(discussionGroupEl);
            var groupData=this.getGroupDataByIndex(discussionGroupEl.attr('groupindex'));
            totalNumEl.text(groupData.memberListData.length);
            if(memberListEl.is(':visible')){
                this._renderMemberList_discussion(discussionGroupEl,groupData);
            }
        },
        _onRenderQxStatus:function(qxStatus){
            var that=this;
            var elEl=this.element,
                qxSummaryEl=$('.fs-qx-hidden .fs-qx-summary',elEl),
                groupItemsEl=$('.fs-qx-group-item',elEl);
            var statusData=qxStatus.statusData,
                onlineEmployeeIDs=statusData.onlineEmployeeIDs,
                mobileOnlineEmployeeIDs=statusData.mobileOnlineEmployeeIDs,
                onlineEmployees;
            //更新新message提示
            /*if(statusData.newMessages.length>0){
                this.chatPanel.show();
                this.chatPanel.showNewMessageAlert(statusData.newMessages.length);
            }*/
            //更新在线人数
            $('.online-num',qxSummaryEl).text(onlineEmployeeIDs.length-1);  //不包括登录用户
            //更新员工状态显示，注意只更新各部门在线人数总状态，员工状态点击各部门后更新
            groupItemsEl.not('.discussion-group').each(function(){ //排除掉讨论组和最近联系人
                var groupItemEl=$(this),
                    onlineNumEl=$('.online-num',groupItemEl);
                //var memberListData=that.getGroupDataBySelector(groupItemEl)["memberListData"],
                //var memberListData=that.getGroupDataByIndex(parseInt(groupItemEl.attr('groupid')))["memberListData"],
                var memberListData=that.getGroupDataByIndex(groupItemEl.attr('groupindex'))["memberListData"],
                    onlineNum=0;

                //逐个筛选出在线用户
                _.each(memberListData,function(memberItemData){
                    if(_.contains(onlineEmployeeIDs,memberItemData.id)){
                        onlineNum++;
                    }
                });
                //设置当前在线人数
                onlineNumEl.text(onlineNum);
                //更新数据
                if(groupItemEl.hasClass('circle-group')||groupItemEl.hasClass('no-circle-group')){
                    //更新部门同事状态显示
                    that.updateCircleMemberData(groupItemEl);
                }else if(groupItemEl.hasClass('rlm-group')){
                    //更新最近联系同事状态显示
                    that.updateRlmMemberData(groupItemEl);
                }else if(groupItemEl.hasClass('online-group')){
                    //维护全部在线组
                    //先全清
                    that.removeAllOnlineMemberData();
                    //构建在线数据
                    onlineEmployees= _.map(onlineEmployeeIDs,function(employeeId){
                        return _.extend({
                            "state":that.getEmployeeChatState(employeeId)
                        },util.getContactDataById(employeeId,'p'));
                    });
                    //排除自己
                    onlineEmployees= _.reject(onlineEmployees,function(itemData){
                        return itemData.id==loginUserData.id;
                    });
                    //添加数据
                    that.addOnlineMemberData(onlineEmployees);
                    //重刷
                    that.reRenderOnlineGroup();
                }

                //如果是打开状态，重新渲染调整排序
                if(groupItemEl.hasClass('state-open')){
                    //重新渲染member list
                    that._renderMemberList(groupItemEl);
                }
            });

        },
        /**
         * 更新主面板滚动条设置
         */
        updateQxScrollBar:function(){
            this.qxListScrollBar&&this.qxListScrollBar.update('relative');
        },
        destroy:function(){
            var result;
            this.groupListData=null;
            this.employeeQuery&&this.employeeQuery.destroy();
            this.chatPanel&&this.chatPanel.destroy();
            this.qxListScrollBar&&this.qxListScrollBar.destroy();
            result=FsQx.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports=new FsQx();  //单例模式
});