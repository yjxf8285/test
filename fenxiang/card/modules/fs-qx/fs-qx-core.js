/**
 * 企信helper
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var util = require('util'),
        json = require('json'),
        Events = require('events');

    var contactData = util.getContactData();
    // 基本配置
    var config = {
            url: {
                startMessenger: '/V3Messenger/StartMessenger',     // 初始化接口
                checkUpdate: '/V3Messenger/CheckUpdated',          // 轮询接口
                stopMessenger: '/V3Messenger/StopMessenger',       // 停止轮询接口
                getMessages: '/V3Messenger/GetMessages',           // 获取信息接口
                sendMessage: '/V3Messenger/SendMessage',           // 发送信息接口
                updateSessionStatus: '/V3Messenger/UpdateSessionStatus',               // 更新会话状态与用户设置
                findOrCreateSingleSession: '/V3Messenger/FindOrCreateSingleSession',   // 获取或者创建单聊接口
                createDiscussionSession: '/V3Messenger/CreateDiscussionSession',       // 创建群对话接口
                changeDiscussionName: '/V3Messenger/ChangeDiscussionName',             // 修改群对话名称接口
                exitDiscussionSession: '/V3Messenger/ExitDiscussionSession',           // 退出群对话接口
                inviteDiscussionParticipants: '/V3Messenger/InviteDiscussionParticipants'  // 邀请、剔出群对话成员接口
            },
            pollingDelay: {
                starter: 10 * 1000, // 未打开时的轮询间隔
                delay: 3 * 1000     // 打开聊天框之后的轮询间隔
            },

            httpReg: new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?|www\\.[a-z0-9\\-]+(\\.[a-zA-Z]{2,4}){1,2}(:\\d+)?/?", "gi")
        },
        // 常量设置
        constants = {
            sessionType: {
                'discussion': "D",    // 群对话
                'single': 'S',        // 单聊
                'workNotice': 'WN',   // 工作通知
                'workReminder': 'WR'  // 工作提醒
            },
            chatWinStatus: {
                'close': 'close',
                'open': 'open',
                'min': 'min'
            },
            messageType: {
                'text': 'T',            // 文本
                'audio': 'A',           // 语音消息
                'image': 'I',           // 图片消息
                'emotion': 'E',         // 纷享大表情
                'news': 'N',            // 新闻
                'webPage': 'W',         // 网页
                'systemPrompt': 'S',    // 系统提示
                'systemTextPrompt': 'ST', // 纯文本型系统提示
                'document': 'D',        // 文档文件
                'location': 'L',        // 位置
                'remind': 'R',          // 提醒
                'workNotice': 'LWN',    // 链接到工作提醒
                'linkWorkItem': 'LWI',  // 链接到工作项
                'linkWorkSchdule': 'LWS' // 链接到日程
            },
            systemPrompt: {
                invite: "Invite",
                exit: "Exit",
                kick: "Kick",
                name: "Name"
            },
            localStrorageName: 'qxls' + (util.getCurrentEmp() && util.getCurrentEmp().id)
        };

    // 轮询
    var epTag = (FS.getAppStore('contactData') && FS.getAppStore('contactData').epTag),
        QXModel = (function () {
            var loginUserData = contactData["u"];
            var timer,      // 轮询延时
                polling,    // 轮询请求
                ajax,       // 确保当前只有一个请求发出
                queue = [], // 控制一次只发送一条企信的请求
                delay = config.pollingDelay.starter,    // 轮询时间间隔
                dataStore = {},         // 存储session数据
                singleDictionary = {},  // 单聊字典：方便查找用户id对应的sessionid
                discussion = [],        // 群对话数据
                single = [],            // 最近联系人数据
                statusVersion;

            var o = new Events(),
                /**
                 * 更新或者添加一条群对话、单聊session
                 * @param sessionData
                 * @returns {{}} 返回执行的操作集合
                 */
                addOrUpdateSession = function (sessionData) {
                    //Todo: 返回集合种只是返回了有变化的sessionId，考虑在返回到的操作集合中添加更新数据前后的差异
                    var flag = {};
                    if (!sessionData) return flag;
                    var id = sessionData.id;
                    if (!dataStore[id]) {
                        // 新群对话
                        if (sessionData.category == constants.sessionType.discussion
                            && (sessionData.status == 0 && sessionData.orderingTime >= 0)) {
                            discussion.unshift(id);
                            flag['qxSessionDiscussionAdd'] = id;
                            sessionData.lastReadMessageId = sessionData.lastMessageId;
                            if(sessionData.notReadCount){
                                flag['qxSessionNotReadCountChange'] = id;
                            }
                        }
                        // 新单聊
                        else if (sessionData.category == constants.sessionType.single && sessionData.orderingTime >= 0) {
                            single.unshift(id);
                            flag['qxSessionSingleAdd'] = id;
                            singleDictionary[sessionData.sessionSubCategory] = id;
                            sessionData.lastReadMessageId = sessionData.lastMessageId;
                            if(sessionData.notReadCount){
                                flag['qxSessionNotReadCountChange'] = id;
                            }
                        }
                        dataStore[id] = sessionData;
                    }
                    else {
                        // 群对话
                        if (sessionData.category == constants.sessionType.discussion) {
                            /**
                             * 现在的需求是：用户被踢、主动退出处理方式一样--等于删除群对话，如果以后做区分操作时可以考虑启用这段代码
                             */
                            /*
                            // 老数据时可用的
                            if(dataStore[id].status == 0 && dataStore[id].orderingTime > 0){
                                // 保证数据是可用的
                                if(sessionData.orderingTime > 0){
                                    // 退出群对话
                                    if (sessionData.status == 90) {
                                        _.each(discussion, function (v, k) {
                                            if (v == sessionData.id) {
                                                discussion.splice(k, 1);
                                            }
                                        });
                                        flag['qxSessionDiscussionExit'] = id;
                                    }
                                    // 被踢出群对话
                                    if (sessionData.status == 80) {
                                        flag['qxSessionDiscussionKick'] = id;
                                    }
                                }
                                // 群对话删除
                                if (sessionData.status >= 100 || sessionData.orderingTime < 0) {
                                    _.each(discussion, function (v, k) {
                                        if (v == sessionData.id) {
                                            discussion.splice(k, 1);
                                        }
                                    });
                                    flag['qxSessionDiscussionDel'] = id;
                                }
                            }
                            // 已有数据为退出状态、不可用的群对话
                            else if(dataStore[id].status >= 100 || dataStore[id].status == 90 || dataStore[id].orderingTime < 0) {
                                if (sessionData.status == 0 && sessionData.orderingTime > 0) {
                                    discussion.push(id);
                                    flag['qxSessionDiscussionAdd'] = id;
                                }
                            }
                            */

                            if((dataStore[id].status == 0 && dataStore[id].orderingTime >= 0)    // 以前是可用的
                                && (sessionData.status != 0 || sessionData.orderingTime < 0)){  // 现在不可用了
                                _.each(discussion, function (v, k) {
                                    if (v == sessionData.id) {
                                        discussion.splice(k, 1);
                                    }
                                });
                                sessionData.notReadCount = 0;
                                flag['qxSessionDiscussionDel'] = id;
                            }

                            // 现在的状态是可用的
                            if (sessionData.status == 0 && sessionData.orderingTime >= 0) {
                                // 以前是不可用的，现在可用，则认为是新增的
                                if(dataStore[id].status != 0 ||  dataStore[id].orderingTime < 0){
                                    discussion.unshift(id);
                                    flag['qxSessionDiscussionAdd'] = id;
                                }
                                // 收到群对话消息,注意：由新消息时未读数量可能为0（系统消息不计入未读数量）
                                if(dataStore[id].lastReadMessageId != sessionData.lastMessageId || sessionData.notReadCount > 0){
                                    flag['qxSessionNewMessage'] = id;
                                }
                                // 现在的未读数量与以前的未读数量不一致
                                if(sessionData.notReadCount != dataStore[id].notReadCount){
                                    flag['qxSessionNotReadCountChange'] = id;
                                }
                                // 群对话改名
                                if (sessionData.defaultName != dataStore[id].defaultName) {
                                    flag['qxSessionDiscussionRename'] = id;
                                }
                                // 群对话成员变化：先比较数量、再比较具体成员
                                if (sessionData.participantIds.length != dataStore[id].participantIds.length
                                    || _.difference(sessionData.participantIds, dataStore[id].participantIds).length) {
                                    flag['qxSessionDiscussionMemberChange'] = id;
                                }
                            }
                        }
                        // 单聊
                        else if (sessionData.category == constants.sessionType.single) {
                            // 收到单聊信息，注意：由新消息时未读数量可能为0（系统消息不计入未读数量）
                            // 本地消息
                            if (dataStore[id].lastReadMessageId != sessionData.lastMessageId || sessionData.notReadCount > 0) {
                                flag['qxSessionNewMessage'] = id;
                            }
                            // 现在的未读数量与以前的未读数量不一致
                            if(sessionData.notReadCount != dataStore[id].notReadCount){
                                flag['qxSessionNotReadCountChange'] = id;
                            }
                        }
                        // 更新本地存储信息
                        dataStore[id] = _.extend(dataStore[id], sessionData);
                    }
                    return flag;
                },

                /**
                 * 格式化收到的session数据
                 * @param data
                 * @returns {*}
                 */
                formatSessionData = function (data) {
                    var category = data.sessionCategory,
                        portraitPath = data.portraitPath,
                        name = data.sessionName,
                        u;
                    if (!_.contains(constants.sessionType, category)) return null;
                    if (category == constants.sessionType.single) {
                        u = util.getContactDataById(data.sessionSubCategory, 'p');
                        if (!u) return null;
                        portraitPath = u.profileImage;
                        if (!name) {
                            name = u.nickName;
                        }
                    } else {
                        portraitPath = portraitPath ? util.getFileUrl(portraitPath) : FS.ASSETS_PATH + '/images/group_default_50x50.png';
                        if (!name) {
                            var n = [], v;
                            for(var i = 0; i < data.participantIds.length && n.length <= 5; i++){
                                v = data.participantIds[i];
                                if (v == loginUserData.id) continue;
                                u = util.getContactDataById(v, "p");
                                if (u) {
                                    n.push(u.name);
                                }
                            }
                            name = n.join('、');
                        }
                        // 如果群对话成员只剩下自己时（上边拼装出的群对话名称还是空的），群对话的名字就叫「群对话」
                        if(!name){
                            name = '群对话';
                        }
                    }
                    return {
                        id: data.sessionId,
                        name: name,
                        lastMessageId: data.lastMessageId,
                        epochMessageId: data.epochMessageId,
                        defaultName: data.sessionName,
                        notReadFlag: data.notReadFlag,
                        portraitPath: portraitPath,
                        notReadCount: data.notReadCount,
                        status: data.status,
                        category: category,
                        sessionSubCategory: data.sessionSubCategory,
                        orderingTime: data.orderingTime,
                        // readMessageId: data.readMessageId,
                        readMessageIdOnServer: data.readMessageId,
                        participantIds: data.participantIds
                    };
                },

                /**
                 * 格式化收到的message信息
                 * @param msg
                 * @param sessionData
                 * @param tmpls
                 */
                formatMessageData = function (msg, sessionData, tmpls) {
                    var content = msg.content,
                        messageTypes = constants.messageType,
                        httpReg = constants.httpReg,
                        o = {
                            typeName: '',
                            senderId: msg.senderId,
                            senderName: msg.senderName,
                            messageId: msg.messageId,
                            messageTime: msg.messageTime,
                            profileImage: msg.profileImage,
                            createTime: util.getDateSummaryDesc(moment.unix(msg.messageTime / 1000), moment.unix(msg.serviceTime), 1)
                        };

                    for (var i in messageTypes) {
                        if (messageTypes.hasOwnProperty(i) && messageTypes[i] == msg.messageType) {
                            o.typeName = i;
                        }
                    }
                    if (!content) return;
                    switch (msg.messageType) {
                        case messageTypes.image:
                            content = json.parse(content);
                            content.FileSize = util.getFileSize(content.FileSize);
                            content.ThumbnailUrl = util.getFileUrl(content.Thumbnail);
                            content.fileName = content.N;
                            _.extend(o, content);
                            break;
                        case messageTypes.document:
                            content = json.parse(content);
                            content.Size = util.getFileSize(content.Size);
                            content.FileType = util.getFileType({"name": content.File}, true);
                            content.DownloadUrl = util.getFileUrl(content.File, true, content.Name);
                            _.extend(o, content);
                            break;
                        case messageTypes.audio:
                            content = json.parse(content);
                            content.File = util.getFileUrl(content.File);
                            _.extend(o, content);
                            break;
                        case messageTypes.location:
                            content = json.parse(content);
                            content.messageTime = parseInt(o.messageTime / 1000, 10);
                            _.extend(o, content);
                            break;
                        case messageTypes.workNotice: // 工作提醒
                            content = json.parse(content);
                            _.extend(o, {
                                "title": content.T,
                                "desc": content.C,
                                "feedid": content.F
                            });
                            break;
                        case messageTypes.systemPrompt:
                            content = json.parse(content);
                            var systemPrompt = constants.systemPrompt,
                                t = content.T,
                                u = content.U,
                                _html = [], _s = '';
                            switch (t) {
                                case systemPrompt.exit:
                                    _s = '退出群对话';
                                    break;
                                case systemPrompt.invite:
                                    _s = '邀请';
                                    _.each(content.A, function (id) {
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
                                    _s += _html.join("、") + "加入群对话";
                                    break;
                                case systemPrompt.kick:
                                    _s = '将';
                                    _.each(content.A, function (id) {
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
                                    _s += _html.join("、") + "移出群对话";
                                    break;
                                case systemPrompt.name:
                                    if (content.V) {
                                        _s = "将群对话的名称修改为：" + content.V;
                                    }
                                    else {
                                        _s = "取消了群对话名称";
                                    }
                                    break;
                            }
                            o.content = _s;
                            break;
                        case messageTypes.text:
                        default:
                            content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\n\r]/g, '<br/>').replace(new RegExp(' ', 'g'), '&nbsp;');
                            content = content.replace(httpReg, function (httpText) {
                                var protocolReg = /https{0,1}|ftp/gi;
                                return '<a href="' + (protocolReg.test(httpText) ? '' : 'http://') + httpText + '" target="_blank">' + httpText + '</a>';
                            });
                            content = util.emoji(content);
                            o.content = content;
                    }
                    if (tmpls) {
                        return tmpls[o.typeName](o);
                    }
                    return o;
                },

                /**
                 * 简单封装util.api，请求参数中添加epTag
                 * @param getOptsFn 获取请求参数，如果该方法返回false则取消该请求
                 * @param cusOpts
                 * @returns {*}
                 */
                api = function (getOptsFn, cusOpts) {
                    var self = arguments.callee;
                    if (ajax) {
                        queue.push([getOptsFn, cusOpts]);
                        return;
                    }
                    o.stop(true);
                    var opts = getOptsFn();
                    if (opts === false || !opts.url) {
                        if (queue.length) {
                            self.apply(window, queue.shift());
                        }
                        else {
                            // 如果没有请求在等待，打开轮询
                            o.start();
                        }
                        return;
                    }

                    var suc = opts.success || FS.EMPTY_FN,
                        complete = opts.complete || FS.EMPTY_FN;

                    opts.data = opts.data || {};
                    opts.data.epTag = epTag;
                    if (statusVersion) {
                        opts.data.statusVersion = statusVersion;
                    }
                    var sessionId = opts.data.sessionId;
                    opts.success = function (res) {
                        var value = res.value, i;
                        if (res.success && value) {
                            if (value.statusVersion) {
                                statusVersion = value.statusVersion;
                            }
                            var sessionList = value.sessionList || [],
                                singleSession = value.singleSession;
                            if (singleSession) {
                                var _flag = true;
                                for (i = 0; i < sessionList.length; i++) {
                                    if (sessionList[i].sessionId == singleSession.sessionId) {
                                        _flag = false;
                                    }
                                }
                                if (_flag) {
                                    sessionList.push(singleSession);
                                }
                            }
                            var messageList = value.messageList || [];
                            if (sessionId) {
                                var currentMessage = value.currentMessage;
                                if (currentMessage) {
                                    messageList.push(currentMessage);
                                }
                            }
                            if (sessionList && sessionList.length > 0) {
                                var diff = {};
                                sessionList.reverse();
                                _.each(sessionList, function (item) {
                                    if (item.orderingTime < 0 && !dataStore[item.sessionId]) {
                                        return;
                                    }
                                    if (item.sessionCategory == constants.sessionType.workNotice) {
                                        o.trigger('qxWorkNotice', {
                                            count: item.notReadCount
                                        });
                                        return;
                                    }
                                    if (item.sessionCategory != constants.sessionType.single
                                        && item.sessionCategory != constants.sessionType.discussion) {
                                        return;
                                    }
                                    var d = formatSessionData(item),
                                        t = addOrUpdateSession(d);
                                    if (t) {
                                        _.each(t, function (_item, _key) {
                                            if (!diff[_key]) {
                                                diff[_key] = [];
                                            }
                                            diff[_key].push(_item);
                                        })
                                    }
                                });
                                // 添加优先执行的发布
                                var firstTrigger = ['qxSessionDiscussionAdd', 'qxSessionDiscussionDel', 'qxSessionNewMessage'];
                                for(i = 0; i< firstTrigger.length; i++){
                                    if(diff[firstTrigger[i]] && diff[firstTrigger[i]].length){
                                        // 如果在当前请求返回当前会话的message，将当前会话从新消息的sessionlist中踢出
                                        if(firstTrigger[i] == 'qxSessionNewMessage' && sessionId && messageList.length){
                                            var __t = _.without(diff[firstTrigger[i]], sessionId);
                                            if(__t.length){
                                                o.trigger(firstTrigger[i], __t);
                                            }
                                        }
                                        else {
                                            o.trigger(firstTrigger[i], diff[firstTrigger[i]]);
                                        }
                                        delete diff[firstTrigger[i]];
                                    }
                                }
                                for (var k in diff) {
                                    if (diff.hasOwnProperty(k) && diff[k].length) {
                                        o.trigger(k, diff[k]);
                                    }
                                }
                            }
                            if (messageList.length) {
                                messageList = _.sortBy(messageList, 'messageId');
                                o.trigger('qxNewMessage', sessionId, messageList);
                                o.setSessionData(sessionId, {lastReadMessageId: messageList[messageList.length - 1].messageId});
                            }
                        }
                        else if(!res.success && res.statusCode == 904){
                            statusVersion = null;
                        }
                        suc(res);
                    };
                    opts.complete = function (res) {
                        ajax = null;
                        if (!statusVersion) {
                            o.stop(true);
                            o.start();
                            if(getOptsFn().url == config.url.getMessages){
                                queue.unshift([getOptsFn, cusOpts]);
                            }
                        }
                        else if(!queue.length){
                            o.stop(true);
                            o.start();
                        }
                        else {
                            self.apply(window, queue.shift());
                        }
                        complete(res);
                    };
                    ajax = util.api(opts, cusOpts);
                    return ajax;
                };
            /**
             * 启动轮询, 如果没有version并且没有缓存过version则先启动messager
             * @param version
             */
            var tryDelay = 0; // startMessenger失败后，重试时间间隔
            o.start = function () {
                if(timer) return ;
                if (statusVersion) {
                    timer = setTimeout(function () {
                        timer = null;
                        polling = api(function () {
                            return {
                                type: 'post',
                                url: config.url.checkUpdate
                            };
                        });
                    }, delay);
                }
                else {
                    timer = setTimeout(function () {
                        timer = null;
                        api(function () {
                            return {
                                type: 'post',
                                url: config.url.startMessenger,
                                success: function (res) {
                                    // 请求成功后将tryDelay重置为0，
                                    // 以便后续调用startMessenger时，能够立即请求
                                    if(res.success){
                                        tryDelay = 0;
                                    }
                                    else {
                                        tryDelay = 10 * 1000;
                                    }
                                },
                                error: function () {
                                    tryDelay = 10 * 1000;
                                }
                            };
                        });
                    }, tryDelay);
                }
            };

            /**
             * 停止轮询，abort指定是否强制停止已经发起的请求
             * @param abort 是否强制阻止当前请求
             */
            o.stop = function (abort) {
                if (abort && polling) {
                    polling.abort();
                }
                clearTimeout(timer);
                timer = null;
            };

            /**
             * 根据sessionId获取session数据
             * @param id
             * @returns {*}
             */
            o.getSessionData = function (id) {
                return dataStore[id];
            };
            /**
             * 设定session数据
             * @param id sessionId
             * @param data
             */
            o.setSessionData = function (id, data) {
                if (dataStore[id]) {
                    dataStore[id] = _.extend(dataStore[id], data);
                }
            };
            /**
             * 获取所有可用的群对话id
             * @returns {Array}
             */
            o.getDiscussionList = function () {
                return discussion;
            };
            /**
             * 获取所有单聊的id
             * @returns {Array}
             */
            o.getSingleList = function () {
                return single;
            };

            o.setDelay = function (toggle) {
                if (toggle && delay != config.pollingDelay.starter || !toggle && delay == config.pollingDelay.starter) {
                    delay = toggle ? config.pollingDelay.starter : config.pollingDelay.delay;
                    o.start();
                }
            };

            o.getMessages = function (sessionId, suc) {
                api(function () {
                    var sessionData = o.getSessionData(sessionId);
                    if (!sessionData) {
                        return false;
                    }
                    if(sessionData.readMessageId == sessionData.lastMessageId){

                    }
                    var data = {
                        sessionId: sessionId
                    };
                    if (sessionData.readMessageId) {
                        data.untilMessageId = sessionData.readMessageId;
                    }
                    if (sessionData.lastMessageId) {
                        data.fromMessageId = sessionData.lastMessageId;
                    }
                    return {
                        type: 'post',
                        url: config.url.getMessages,
                        data: data,
                        success: function (res) {
                            if (res.success) {
                                suc && suc(res);
                            }
                        }
                    };
                });
            };
            o.updateSessionStatus = function (sessionId, messageId, suc) {
                o.setSessionData(sessionId, {
                    readMessageId: messageId
                });
                api(function () {
                    var _sessionData = o.getSessionData(sessionId);
                    if (!_sessionData ||
                        (_sessionData.readMessageIdOnServer == _sessionData.lastMessageId && _sessionData.notReadCount == 0)) {
                        return false;
                    }
                    return {
                        url: config.url.updateSessionStatus,
                        data: {
                            sessionId: sessionId,
                            readMessageId: _sessionData.readMessageId
                        },
                        success: function (res) {
                            suc && suc(res);
                        }
                    }
                });
            };
            o.sendMessage = function (opts, cusOpts) {
                if (opts.data.sessionId) {
                    api(function () {
                        var _id = opts.data.sessionId,
                            _sessionData = o.getSessionData(_id);
                        if (!_sessionData) {
                            return false;
                        }
                        if(_sessionData.status != 0){
                            // 单聊被删除时重新创建
                            if(_sessionData.category == constants.sessionType.single){
                                o.findOrCreateSingleSession(_sessionData.sessionSubCategory, function (sid) {
                                    opts.data.sessionId = sid;
                                    o.sendMessage(opts, cusOpts);
                                });
                            }
                            return false;
                        }
                        opts.data.previousMessageId = _sessionData.readMessageId;
                        opts.url = config.url.sendMessage;
                        var suc = opts.success,
                            _sessionType = _sessionData.category;
                        opts.success = function (res) {
                            suc(res);
                            var index;
                            if(_sessionType == constants.sessionType.single){
                                index = _.indexOf(single, _id);
                                if(index > 0){
                                    single.unshift(single.splice(index, 1));
                                    o.trigger('qxSessionSingleOrderChange');
                                }
                            }
                            else if(_sessionType == constants.sessionType.discussion){
                                index = _.indexOf(discussion, _id);
                                if(index > 0){
                                    discussion.unshift(discussion.splice(index, 1));
                                    o.trigger('qxSessionDiscussionOrderChange');
                                }
                            }
                        };
                        return opts;
                    }, cusOpts);
                }
                else if(opts.data.participantId){
                    o.findOrCreateSingleSession(opts.data.participantId, function (sid) {
                        delete opts.data.participantId;
                        opts.data.sessionId = sid;
                        o.sendMessage(opts, cusOpts);
                    });
                }
            };
            o.findOrCreateSingleSession = function (id, suc) {
                var _sessionId = singleDictionary[id];
                if (_sessionId && o.getSessionData(_sessionId).status == 0) {
                    suc && suc(singleDictionary[id]);
                }
                else {
                    api(function () {
                        return {
                            type: 'post',
                            url: config.url.findOrCreateSingleSession,
                            data: {
                                participantId: id
                            },
                            success: function (res) {
                                if (res.success) {
                                    suc && suc(res.value.singleSession.sessionId);
                                }
                            }
                        };
                    });
                }
            };

            o.createDiscussionSession = function (ids, suc, cusOpts) {
                api(function () {
                    return {
                        type: 'post',
                        url: config.url.createDiscussionSession,
                        data: {
                            participantIds: ids
                        },
                        success: function (res) {
                            if (res.success) {
                                suc && suc(res.value.singleSession.sessionId);
                            }
                        }
                    };
                }, cusOpts);
            };
            o.changeDiscussionName = function (id, val, suc, complete) {
                api(function () {
                    return {
                        type: 'post',
                        url: config.url.changeDiscussionName,
                        data: {
                            sessionId: id,
                            newName: val
                        },
                        success: function (res) {
                            suc && suc(res);
                        },
                        complete: function(res){
                            complete && complete(res);
                        }
                    };
                });
            };
            o.exitDiscussionSession = function (id, cusOpts, suc) {
                api(function () {
                    return {
                        type: 'post',
                        url: config.url.exitDiscussionSession,
                        data: {
                            sessionId: id
                        },
                        success: function (res) {
                            if (res.success) {
                                suc && suc(res);
                            }
                        }
                    };
                }, cusOpts);
            };
            o.inviteDiscussionParticipants = function (data, suc, cusOpts) {
                api(function () {
                    return {
                        type: 'post',
                        url: config.url.inviteDiscussionParticipants,
                        data: data,
                        success: function (res) {
                            if (res.success) {
                                suc && suc(res);
                            }
                        }
                    };
                }, cusOpts);
            };

            o.getSessionIdByParticipantIds = function (id) {
                return singleDictionary[id];
            };

            o.formatMessage = formatMessageData;
            // 只给ajax的data添加epTag、statusVersion
            o.ajax = function(opts, cusOpts){
                if(opts.data){
                    opts.data.epTag = epTag;
                    opts.data.statusVersion = statusVersion;
                }
                else {
                    opts.data = {
                        epTag: epTag,
                        statusVersion: statusVersion
                    };
                }
                util.api(opts, cusOpts);
            };
            window.setEptag = function (val) {epTag = val;};
            return o;
        })();

    _.extend(exports, {
        "QXModel": QXModel,
        "config": config,
        "constants": constants
    });
});