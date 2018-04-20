/**
 * 我的企信列表
 *
 * 遵循seajs module规范
 * @author Liuxf
 */

define(function(require, exports, module) {
    var root = window,
            FS = root.FS,
            tpl = FS.tpl;

    /* 引用文件 */
//    require('modules/feed-list/feed-list.css');
    var util = require('util'); //工具箱
    var flutil = require('modules/feed-list/fl-util');
    var Pagination = require('uilibs/pagination'); //分页组件
    var moment = require('moment'); //时间组件
    var listTpl = require('./fs-shortmessage-list.html');
    var listStyle = require('./fs-shortmessage-list.css');
    var feedHelper = require('modules/feed-list/feed-list-helper');
    var AttachPreview = require('modules/fs-attach/fs-attach-preview');
    var filePreview = require('modules/fs-attach/fs-attach-file-preview'); //文件阅读
    var fsQx = require('modules/fs-qx/fs-qx.js'); //企信
    var json = require('json'),
        fsMap = require('modules/fs-map/fs-map'); //地图组件
    //地图定位
    var FsMapOverlay = fsMap.FsMapOverlay;
    var fsMapOverlay = new FsMapOverlay();

    /* 定义组件 */
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var AudioPlayer = require('uilibs/audio-player'); //音频播放组件
    var contactData = util.getContactData(),
        currentUserData = contactData["u"]; //自己
    /* 公共声明 */
    var listTpl = $(listTpl);
    var fsQxCore = require('./fs-qx-core'),
        constants = fsQxCore.constants;

    var getTplList = function () {
            var o = {};
            _.each(constants.messageType, function (v, k) {
                o[k] = _.template(listTpl.filter('.fs-shortmessage-' + k + '-tpl').html());
            });
            return o;
        },
        getMp3Url = function (id) {
            return FS.API_PATH + '/df/GetMp3?clientPath=' + id;
        },
        messageTpl = getTplList(),
        getMessageHtml = function (tmpl, msg) {
            var content = msg.content,
                messageTypes = constants.messageType,
                httpReg = new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?|www\\.[a-z0-9\\-]+(\\.[a-zA-Z]{2,4}){1,2}(:\\d+)?/?", "gi"), //用于判断文本内容超链接
                o = {
                    typeName: '',
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    messageId: msg.messageId,
                    messageTime: msg.messageTime,
                    profileImage: msg.profileImage,
                    createTime: util.getDateSummaryDesc(moment.unix(msg.messageTime/1000), moment.unix(msg.serviceTime), 1)
                };

            for (var i in messageTypes) {
                if (messageTypes.hasOwnProperty(i) && messageTypes[i] == msg.messageType) {
                    o.typeName = i;
                }
            }
            if(!content) return ;
            switch (msg.messageType) {
                case messageTypes.emotion://大表情
                    var objContent = json.parse(content);//转换为JSON对象
                    var directoryStr=objContent.PackId+'/';
                    var imgNameStr='fs_bee_'+(objContent.Index-1)+'.gif';
                    var imgStr='<img class="fs-img-emotion" src="'+FS.ASSETS_PATH+'/images/'+directoryStr+imgNameStr+'">';
                    o.content = imgStr;
                    break;
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
                    content.FileType =  util.getFileType({"name": content.File}, true);
                    content.DownloadUrl = util.getFileUrl(content.File, content.Name, true);
                    _.extend(o, content);
                    break;
                case messageTypes.audio:
                    content = json.parse(content);
                    content.File = getMp3Url(content.File);
                    _.extend(o, content);
                    break;
                case messageTypes.location:
                    content = json.parse(content);
                    content.messageTime = parseInt(o.messageTime/1000, 10);
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
                case messageTypes.linkWorkItem: // 链接到工作项
                    content = json.parse(content);
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
                    };
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
                    _.extend(o, {
                        "title": _t,
                        "desc": content.C,
                        "feedid": content.F
                    });
                    break;
                case messageTypes.linkWorkSchdule: // 链接到日程
                    content = json.parse(content);
                    _.extend(o, {
                        "title": moment(content.ST).format('MM月DD日 HH:mm的日程'),
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
                                if(id == u) return ;
                                var _n;
                                if(id == currentUserData.id){
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
                                if(id == u) return ;
                                var _n;
                                if(id == currentUserData.id){
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
                            if(content.V){
                                _s = "将群对话的名称修改为：" + content.V;
                            }
                            else {
                                _s = "取消了群对话名称";
                            }
                            break;
                    }
                    o.content = _s;
                    break;
                case messageTypes.systemTextPrompt: // 纯文本型系统提示
                    o.content = content;
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
            return tmpl[o.typeName](o);
        };

    /**
     * 我的企信列表MVC定义
     * @param opts
     * @constructor
     */
    var ShortmessagelistM = Backbone.Model.extend({});
    var ShortmessagelistC = Backbone.Collection.extend({
        model: ShortmessagelistM,
        // url:'/attach_html/getImgImgFilesOfIReceive',
        sync: function(method, model, options) {
            var data = options.data || {};
            options.data = _.extend({
                "pageSize": 10,
                "pageNumber": 1
            }, data);
            Backbone.sync('read', model, options);
        },
        parse: function(responseData) {
            /* 预处理 */
            var items = responseData.value.sessions, r = [];
            if (responseData.success) {
                var constantsMessageType = constants.messageType;
                _.each(items, function (item) {
                    var sessionType = item.sessionCategory,
                        lastMessage = item.lastMessage;
                    if(sessionType != constants.sessionType.single && sessionType != constants.sessionType.discussion
                        || !lastMessage){
                        return ;
                    }
                    var lastContent = lastMessage.content,
                        senderId = lastMessage.senderId,
                        messageType = lastMessage.messageType;
                    var o = {
                            sessionId: item.sessionId,
                            sessionName: item.sessionName,
                            sessionType: sessionType,
                            lastMessageTime: lastMessage.messageTime,
                            lastCreateTime: util.getDateSummaryDesc(moment.unix(parseInt(lastMessage.messageTime/1000, 10)), moment.unix(responseData.serviceTime), 1)
                        };
                    if (!senderId ) {
                        if(messageType == constantsMessageType.systemPrompt){
                            senderId = json.parse(lastContent).U;
                        }
                        else {
                            return ;
                        }
                    }
                    var sender = lastMessage.sender;

                    if(sessionType == constants.sessionType.discussion){
                        o.profileImageUrl = item.portraitPath ? util.getFileUrl(item.portraitPath) : FS.ASSETS_PATH + '/images/group_default_50x50.png';
                        if(!o.sessionName){
                            var t = [];
                            _.each(item.participantIds, function (i) {
                                if(i == currentUserData.id) {
                                    return ;
                                }
                                var _e = util.getContactDataById(i, 'p');
                                if(_e){
                                    t.push(_e.name);
                                }
                            });
                            o.sessionName = t.join('、');
                        }
                        if(!o.sessionName){
                            o.sessionName = '群对话';
                        }
                    }
                    else {
                        o.profileImageUrl = sender ? util.getAvatarLink(sender.profileImage, 2) : FS.ASSETS_PATH+'/images/employee_default_120_120.png';
                    }
                    o.name = senderId == currentUserData.employeeID ? '我' : sender.name;

                    /* 是否显示“新”图标 */
                    if (item.notReadFlag) {
                        o.newico = '<div class="img-new"></div>';
                    } else {
                        o.newico = '';
                    }
                    o.content = getMessageHtml(messageTpl, {
                        content: lastContent,
                        messageType: messageType,
                        senderId: senderId,
                        senderName: o.name,
                        messageId: lastMessage.messageId,
                        messageTime: lastMessage.messageTime
                    });
                    r.push(o);
                });
                r = _.sortBy(r, 'lastMessageTime').reverse();
            }
            return r;

        }
    });
    var ShortmessagelistV = Backbone.View.extend({
        tagName: "div",
        className: "fs-shortmessage-item card-border-rad",
        events: {
            "click .feed-img-thumb": "previewImg", //图片预览
            "click .attach-preview-l": "previewAttach", //附件预览
            "click .worknotice-content-wrap": "clickWorknotice", //工作通知
            "click .workSchdule-content-wrap": "clickWorkSchdule", //链接到工作项
            "click .workItem-content-wrap": "clickWorkItem", //链接到工作项
            "click .shortcut-del-btn": "shortcutDel", //删除企信
            "click .feed-location-fn-map": "showLocation" //地址显示
        },
        /*删除企信*/
        shortcutDel: function(evt) {
            var that = this;
            var opts = that.options;
            var $this = $(evt.currentTarget),
                sessionId = $this.attr('data-sessionid'),
                sessionType = $this.attr('data-sessiontype'),
                data = {
                    "markAllMessagesDeleted": true,
                    "epTag": FS.getAppStore('contactData').epTag,
                    "sessionID": sessionId
                },
                url = sessionType == constants.sessionType.discussion ? 'ResetDiscussionSession' : 'ResetSingleSession';
            if(sessionType == constants.sessionType.discussion){
                url = 'ResetDiscussionSession';
                data.markSessionHide = true;
            }
            else {
                url = 'ResetSingleSession';
                data.markSessionDeleted = true;
            }
            util.confirm('你确定要从企信列表删除该对话吗？', '提示', function(evt) {
                //点确定执行
                util.api({
                    "url": '/V3Messenger/' + url,
                    "type": 'post',
                    "dataType": 'json',
                    "data": data,
                    "success": function(responseData) {
                        if (responseData.success) {
                            //成功之后
                            that.remove(); //刷新列表
                            opts.removeItemCb && opts.removeItemCb.call(that, responseData);
                        }
                    }
                });
            }, {
                "onCancel": function() {
                },
                "width": 338
            });


        },
        previewImg: function(evt) {
            var $this = $(evt.currentTarget);
            attachPreviewer.preview({
                "type": "img",
                "data": [{
                    previewPath : $this.attr("data-HDImg") || $this.attr("data-Image"),
                    originPath: $this.attr("data-Image"),
                    fileName: $this.attr('data-name'),
                    thumbPath: $this.attr("data-Thumbnail")
                }],
                "belongToType": "newqx"
            });
            evt.preventDefault();
        },
        previewAttach: function(evt) {
            var $this = $(evt.currentTarget),
                file = $this.attr('data-file'),
                name = $this.attr('data-name');
            fileReader.readFile({
                "fileId": util.getFileNamePath(file),
                "fileName": name,
                "filePath": file
            });
            evt.preventDefault();
        },
        clickWorknotice: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            if(id){
                tpl.navRouter.navigate('#stream/showfeed/=/id-' + id + '/datalighted-app|workmessage', { trigger: true });
            }
            evt && evt.preventDefault();
        },
        clickWorkSchdule: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            if(id){
                tpl.navRouter.navigate('#stream/showfeed/=/id-' + id, { trigger: true });
            }
            evt && evt.preventDefault();
        },
        clickWorkItem: function (evt) {
            var id = $(evt.currentTarget).attr('data-id');
            if(id){
                tpl.navRouter.navigate('#stream/showfeed/=/id-' + id, { trigger: true });
            }
            evt && evt.preventDefault();
        },
        showLocation: function (evt) {
            var location = util.queryToJson($(evt.currentTarget).attr('action-data'));
            fsMapOverlay.fixLocation(location);
            evt.preventDefault();
        },
        initialize: function() {
            var templatepath = listTpl.filter('.fs-shortmessage-send-item-tpl').html(); //发出赞的模板
            this.template = _.template(templatepath);
            this.listenTo(this.model, "change", this.render);
        },
        _renderAudioCpt:function(){
            var elEl = this.$el;
            var audioBoxEl = $('.audio-box', elEl);
            var audioSrc,
                attachSize;
            if (audioBoxEl.length > 0) {
                audioSrc = audioBoxEl.attr('data-src');
                attachSize = parseInt(audioBoxEl.attr('data-duration'));
                //初始化audio
                if (!this.audioPlayer) {
                    this.audioPlayer = new AudioPlayer({
                        "element": audioBoxEl,
                        "audioSrc": audioSrc,
                        "length": attachSize,
                        "themeStyle": 4
                    });
                }
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this._renderAudioCpt();
            return this;
        },
        destroy: function() {
            this.audioPlayer && this.audioPlayer.destroy();
            this.remove();
        }
    });

    /**
     * 列表定义
     * @param {object}
     * @constructor
     */

    var Shortmessagelist = function(opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": {//分页配置项
                "pageSize": 20,
                "visiblePageNums": 7
            },
            "listPath": "/attach_html/getAttachImgFilesOfIReceive", //默认附件列表请求地址为我收到的附件列表地址
            "defaultRequestData": {}, //默认请求数据
            "searchOpts": {
                "inputSelector": null, //搜索输入框
                "btnSelector": null //搜索按钮
            },
            "listCb": FS.EMPTY_FN, //list请求后的回调
            "listEmptyText": "暂无记录" //列表记录为空的文字提示
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.pagEl = $(opts.pagSelector);
        this.pagination = null; //分页组件
        this.tempRequestData = {}; //通过load或者reload覆盖的请求数据
        this.init();
    };

    _.extend(Shortmessagelist.prototype, {
        "init": function() {
            var that = this,
                    opts = this.opts;
            var elEl = this.element;
            var list;
            var chatPanel = fsQx.chatPanel;
            //设置list collection
            list = new ShortmessagelistC();
            //监听collection add事件
            
            list.on('add', function(m, c) {
               
                var itemV;
                itemV = new ShortmessagelistV({
                    "model": m,
                    "removeItemCb": function(responseData) {
                        if (responseData.success) {
                            // todo:删除企信面板相关群对话信息
                            // chatPanel.shortCutDelDiscussion(responseData.value.sessionID);
                            that.reload();
                        }
                    }
                }).render();
                
                itemV.$el.data('itemV', itemV).appendTo(elEl);
            });
            this.list = list;

            // 初始化分页组件
            this.pagination = new Pagination(_.extend({
                "element": this.pagEl
            }, opts.pagOpts));
            this.pagination.on('page', function(pageNumber) {
                //清空列表
                that.empty();
                //请求数据
                that.fetch();
            });
            //渲染分页组件
            this.pagination.render();
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                // this._searchBarInit();
            }

            //初始化列表结果空白提示
            this._initListEmptyTip();
        },
        /**
         * 搜索条初始化，显示查询总信息和返回按钮
         * @private
         */
        _searchBarInit: function() {
            var that = this,
                    opts = this.opts,
                    searchOpts = opts.searchOpts;
            var elEl = this.element,
                    searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                    searchBtnEl = $(searchOpts.btnSelector), //搜索按钮
                    barEl;
            barEl = $('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="javascript:void(0)" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);
            //创建快速关闭按钮
            var searchEmptyEl = $('<span class="empty-h">&#10005;</span>'),
                    searchInputWEl = $('<span class="list-search-input-wrapper"></span>');
            searchInputEl.wrap(searchInputWEl);
            searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
            searchEmptyEl.hide().appendTo(searchInputWEl);

            //搜索输入框enter提交事件注册和快速清空按钮
            searchInputEl.keydown(function(evt) {
                if (evt.keyCode == 13) { //监听回车按键
                    searchBtnEl.click();
                }
            }).keyup(function() {
                var val = _.str.trim($(this).val());
                if (val.length > 0) {
                    searchEmptyEl.show();
                    searchInputEl.addClass('with-input-value');
                } else {
                    searchEmptyEl.hide();
                    searchInputEl.removeClass('with-input-value');
                }
            });
            searchEmptyEl.click(function() {
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
            });
            //点击返回到查看全部列表
            barEl.on('click', '.back-l', function(evt) {
                var emptyEl = $('.list-empty-tip', elEl); //记录空白提示
                that.reload({
                    "keyword": ""
                });
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                emptyEl.hide();
                evt.preventDefault();
            });
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState: function(requestData, responseData) {
            var elEl = this.element,
                    barEl = $('.list-search-bar', elEl),
                    numEl = $('.num', barEl);
            if (!requestData.isFirstChar && requestData.keyword.length > 0) {
                if (responseData.success) {
                    numEl.text(responseData.value.totalCount);
                    barEl.show();
                    return;
                }
            }
            barEl.hide();
            return;
        },
        /**
         * 初始化list记录为空的tip
         * @private
         */
        _initListEmptyTip: function() {
            var elEl = this.element,
                    emptyEl = $('<div class="list-empty-tip"></div>');
            var opts = this.opts,
                    emptyText = opts.listEmptyText;
            emptyEl.html('<img src="' + FS.BLANK_IMG + '" alt="loading" class="icon-empty" />&nbsp;&nbsp;<span class="empty-text">' + emptyText + '</span>');
            emptyEl.appendTo(elEl);
        },
        /**
         * 列表结果记录集为空的提示状态
         * @private
         */
        _updatelistStatus: function(responseData) {
            var elEl = this.element,
                    emptyEl = $('.list-empty-tip', elEl);
            var totalCount;
            if (responseData.success) {
                totalCount = responseData.value.totalCount;
                if (totalCount == 0) { //列表结果为空，提示空提示信息
                    emptyEl.show();
                } else {
                    emptyEl.hide();
                }
            }
        },
        /**
         *
         * @param config
         */
        fetch: function() {
            var that = this;
            var opts = this.opts;
            var list = this.list;
            var pagination = this.pagination;
            var requestData = _.extend({
                "epTag": FS.getAppStore('contactData').epTag,
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber')
            });

            // 加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData = _.extend(requestData, this.tempRequestData);
            this.tempRequestData = {}; //用完重置为空
            // 打开loading提示
            this.showLoading();
            this.list.fetch({
                "url": opts.listPath,
                "data": requestData,
                "success": function(c, responseData) {
                    var dataRoot;
                   
                    if (responseData.success) {

                        dataRoot = responseData.value;
                        //设置分页总记录数
                        //if(pagination.get('totalSize')==-1){
                        pagination.setTotalSize(dataRoot.totalCount);
                        //}
                        //更新提示搜索信息
                        // that._updateSearchBarState(requestData, responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
                        //参数回调
                        opts.listCb.call(that, responseData);
                        //关闭loading提示
                        that.hideLoading();
                    }
                }
            });
        },
        "showLoading": function() {
            var loading = this.loading,
                    elEl = this.element,
                    loadingEl = $('.list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length == 0) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo(elEl);
                loadingEl.html('<span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
                /*loading = new Spin({
                 "color": "#0082CB",
                 "length": 5, // The length of each line
                 "width": 2,
                 "radius": 3,
                 "top": 5
                 }).spin($('.icon-loading', loadingEl).get(0));*/
                //设置实例引用
                this.loading = loading;
            }
            loadingEl.show();
        },
        "hideLoading": function() {
            var elEl = this.element,
                    loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 加载第一页
         */
        "load": function(requestData) {
            this.tempRequestData = requestData;
            this.pagination.jump(1);
        },
        "reload": function(requestData) {
            this.load(requestData);
        },
        "empty": function() {
            var elEl = this.element,
                    itemEl = $('.fs-shortmessagelist-item', elEl);
            itemEl.each(function() {
                var meEl = $(this),
                        itemV = meEl.data('itemV');
                //清除itemV
                itemV.destroy();
                meEl.removeData(); //清空所有data数据
            });
            elEl.empty();
        },
        "destroy": function() {
            //清空list
            this.list = null;
            this.pagination.destroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消pagination绑定
            this.pagination = null;
            this.tempRequestData = {};
            this.element = null;
        }
    });
    module.exports = Shortmessagelist;
});