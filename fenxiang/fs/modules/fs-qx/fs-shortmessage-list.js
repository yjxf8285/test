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

    /* 定义组件 */
    var formatPics = feedHelper.picturesFormat; //拼图片
    var formatFiles = feedHelper.filesFormat; //拼附件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var AudioPlayer = require('uilibs/audio-player'); //音频播放组件
    var contactData = util.getContactData(),
            currentUserData = contactData["u"]; //自己	
    /* 公共声明 */
    var listTpl = $(listTpl);

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
            var items = responseData.value.session;
            if (responseData.success) {
                var disable = ''; //用於判斷快速回覆按鈕顯示
                _.each(items, function(item) {
                    //保存原始数据
                    item.originData = util.deepClone(item);
                    /**
                     * 声明
                     */
                    var sessionID = item.sessionID;
                    var lastEmployee = item.lastEmployee; //人的信息
                    var isDiscussion = item.isDiscussion; //是否显示我与谁谁谁
                    var fromName = item.name; //来自谁
                    var name = lastEmployee.name; //人的名字
                    var employeeID = lastEmployee.employeeID; //人的ID
                    var profileImage = item.profileImage; //人的头像地址
                    var messageCount = item.messageCount; //会话条数
                    var lastMessageShowContent = item.lastMessageShowContent || ''; //最后一条会话内容
                    var lastCreateTime = item.lastCreateTime; //最后会话时间
                    var attachs = item.lstShortMessageAttach || []; //媒体文件(录音，图片，附件)
                    var isShowMe = '';
                    var inSession = item.inSession; //是否在討論組
                    var httpReg = new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?", "gi"); //用于判断文本内容超链接

                    item.attach = ''; //输出附件
                    /**
                     * 格式化
                     */
                    if (!inSession) {
                        disable = 'disable';
                    } else {
                        disable = '';
                    }

                    if (!isDiscussion) { //如果是单人对话
                        isShowMe = '我与';
                        profileImage = lastEmployee.profileImage; //人的头像地址用最后一个发消息的人

                    }
                    profileImage = util.getAvatarLink(profileImage, 2); //格式化头像地址
                    //文本地址变为a链接
                    lastMessageShowContent = lastMessageShowContent.replace(httpReg, function(httpText) {
                        return '<a href="' + httpText + '" target="_blank">' + httpText + '</a>';
                    });

                    fromName = '<a href="#shortmessage/showsession/=/id-' + sessionID + '/empid-' + employeeID + '" title="' + fromName + '">' + isShowMe + fromName + '</a>'; //来自哪
                    messageCount = '<a href="#shortmessage/showsession/=/id-' + sessionID + '/empid-' + employeeID + '">查看共' + messageCount + '条企信</a>'; //多少条
                    /**
                     * 计算发布的时间
                     */
                    lastCreateTime = util.getDateSummaryDesc(moment.unix(lastCreateTime), moment.unix(responseData.serviceTime), 1);


                    /**
                     * 显示附件
                     * 录音、图片、文件。。。
                     */
                    if (attachs) {
                        _.each(attachs, function(attach) {
                            var attachID = attach.attachID; //附件ID
                            var attachType = attach.attachType; //附件类型
                            var attachName = attach.attachName; //附件名字
                            var attachPath = attach.attachPath; //附件地址
                            var attachSize = attach.attachSize; //附件大小
                            var fileIcon = attach.fileIcon; //附件图标

                            switch (attachType) {
                                case 1: //录音
                                    attachPath = util.getDfLink(attachPath, '', false, '');
                                    attachPath = util.getFileNamePath(attachPath) + '.mp3'; //转换成mp3路径
                                    if (attachSize > 60 && attachSize < 60 * 60) {
                                        attachSize = parseInt(attachSize / 60.0) + ':' + parseInt((parseFloat(attachSize / 60.0) -
                                                parseInt(attachSize / 60.0)) * 60);
                                    } else {
                                        attachSize = '00:' + parseInt(attachSize);
                                    }
                                    item.attach = '<div class="audio-btn">(' + attachSize + ')</div><div class="audio-warp"> <div class="audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div class="audio-box" audiosrc="' + attachPath + '" attachsize="' + attach.attachSize + '"></div></div>';
                                    break;
                                case 2: //图片
                                    item.attach = '<div class="item-media"> <div class="feed-img"><div class="img-warp"><table><tbody><tr><td valign="middle" align="center"><img src="' + util.getDfLink(attachPath + '3', attachName, false, 'jpg') + '" alt="" class="feed-img-thumb" /></td></tr></tbody></table></div></div></div>';
                                    break;
                                case 3: //文件
                                    attachSize = util.getFileSize(attach.attachSize);
                                    item.attach = '<div class="item-media"> <div class="feed-files feed-attach fn-clear"> <dl attachid="' + attachID + '"><dt><img src="' + FS.ASSETS_PATH + '/images/file/' + fileIcon + '.png" alt=""></dt><dd><p>' + attachName + '(' + attachSize + ')</p><p><a href="' + util.getDfLink(attachPath, attachName, true) + '" class="d" title="" target="_blank">下载</a> <a href="#" class="attach-preview-l v">预览</a></p></dd></dl> </div></div>';
                                    break;
                            }
                        });
                    }
                    /* 是否显示“新”图标 */
                    if (item.hasUnread) {
                        item.newico = '<div class="img-new"></div>';
                    } else {
                        item.newico = '';
                    }

                    //输出
                    _.extend(item, {
                        "sessionID": sessionID,
                        "fromName": fromName,
                        "lastMessageShowContent": lastMessageShowContent,
                        "name": name,
                        "employeeID": employeeID,
                        "profileImage": profileImage,
                        "lastCreateTime": lastCreateTime,
                        "disable": disable,
                        "messageCount": messageCount
                    });
                });
            } else {
                items = [];
            }
            return items;

        }
    });
    var ShortmessagelistV = Backbone.View.extend({
        tagName: "div",
        className: "fs-shortmessage-item",
        events: {
            "click .audio-btn": "audioBtn", //点击播放录音
            "click .audio-close": "audioCloseBtn", //关闭播放录音
            "click .feed-img-thumb": "previewImg", //图片预览
            "click .attach-preview-l": "previewAttach", //附件预览
            "click .shortcut-reply-l": "clickScReply", //点击快速回复
            "click .shortcut-del-btn": "shortcutDel" //删除企信
        },
        /*删除企信*/
        shortcutDel: function(e) {
            var that = this;
            var opts = that.options;
            var elEl = this.$el;
            var model = this.model;
            var originData = model.get('originData');
            var sessionID = originData.sessionID;
            util.confirm('你确定要从企信列表删除该对话吗？', '提示', function(evt) {
                //点确定执行
                util.api({
                    "url": '/ShortMessage/RemoveSessionFromList', //谁的接口地址
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "sessionID": sessionID
                    },
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
        /*关闭播放录音窗口*/
        audioCloseBtn: function(e) {
            var elEl = this.$el;
            var audioBtnEl = $('.audio-btn', elEl);
            var audioWarpEl = $('.audio-warp', elEl);
            audioWarpEl.hide();
            audioBtnEl.show();
            this.audioPlayer && this.audioPlayer.stop();
        },
        /* 点击播放录音 */
        audioBtn: function(evt) {
            var meEl = $(evt.currentTarget);
            var elEl = this.$el;
            var audioWarpEl = $('.audio-warp', elEl),
                    audioBoxEl = $('.audio-box', elEl);
            var audioSrc = audioBoxEl.attr('audiosrc'),
                    attachSize = parseInt(audioBoxEl.attr('attachsize'));
            meEl.hide();
            audioWarpEl.show();
            //初始化audio
            if (!this.audioPlayer) {
                this.audioPlayer = new AudioPlayer({
                    "element": $('.audio-box', audioWarpEl),
                    "audioSrc": audioSrc,
                    "length": attachSize
                });
            }
            this.audioPlayer.play(); //打开直接播放
        },
        previewImg: function(evt) {
            var model = this.model,
                    originData = model.get('originData'),
                    pictures = originData.lstShortMessageAttach;
            var previewData = [];
            _.each(pictures, function(picture, i) {
                previewData[i] = {
                    "previewPath": picture.attachPath + '2',
                    "originPath": picture.attachPath + '1',
                    "thumbPath": picture.attachPath + '3',
                    "createTime": picture.createTime,
                    "fileName": picture.attachName,
                    "fileSize": picture.attachSize
                };
            });
            attachPreviewer.preview({
                "type": "img",
                "data": previewData,
                "refId": originData.shortMessageID,
                "belongToType": "qx"
            });
        },
        previewAttach: function(evt) {
            var model = this.model,
                    originData = model.get("originData"),
                    files = originData.lstShortMessageAttach,
                    file;
            var curEl = $(evt.currentTarget),
                    itemEl = curEl.closest('dl'),
                    attachId = itemEl.attr('attachid');
            file = _.find(files, function(itemData) {
                return itemData.attachID == attachId;
            });
            fileReader.readFile({
                "fileId": file.attachID,
                "fileName": file.attachName,
                "filePath": file.attachPath
            });
            evt.preventDefault();
        },
        clickScReply: function(evt) {
            var model = this.model,
                    originData = model.get('originData'),
                    sessionId = model.get('sessionID'),
                    isDiscussion = originData.isDiscussion;
            var chatPanel = fsQx.chatPanel,
                chatStateCls;
            var meEl = $(evt.currentTarget);
            var participantsIDs = originData.participantsIDs.split(','),
                coreData = {
                    "name": originData.name,
                    "profileImage": originData.profileImagePath,
                    "participantIds": participantsIDs
                };
            if (!meEl.is('.disable')) {
                evt.preventDefault();
                evt.stopPropagation();
                //如果是讨论组，如果此讨论组在企信列表中是否存在，如果已经不存在了，表示当前用户已经退出了，则什么都不干
                if (isDiscussion && !fsQx.isExistDiscussion(sessionId)) {
                    return;
                }
                if(isDiscussion){   //讨论组无在线状态
                    chatStateCls="";
                }else{
                    chatStateCls=fsQx.getEmployeeChatState(originData.lastEmployee.employeeID);
                }
                chatPanel.addOrUpdateSession({
                    "employeeIds": originData.participantsIDs.split(','),
                    "sessionId": sessionId,
                    "sessionType": isDiscussion ? "discussion" : "pair", //讨论组或是双人聊天
                    "data": coreData
                }, true,{
                    "profileImage":util.getAvatarLink(originData.profileImage,3),
                    "chatStateCls":chatStateCls,  //讨论组无聊天状态
                    "title":originData.name,
                    "name":originData.name
                });
            }
        },
        initialize: function() {
            var templatepath = listTpl.filter('.fs-shortmessage-send-item-tpl').html(); //发出赞的模板
            this.template = _.template(templatepath);
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
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
                            //删除企信面板相关讨论组信息
                            chatPanel.shortCutDelDiscussion(responseData.value.sessionID);
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
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
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