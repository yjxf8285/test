/**
 * FS回复列表
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
            FS = root.FS;
    var ReplyList, //回复列表组件
            ListC, //collection
            ItemV, //view
            ItemM; //model
    var feedHelper = require('modules/feed-list/feed-list-helper'),
            flutil = require('modules/feed-list/fl-util'),
            feedlistcss = require('modules/feed-list/feed-list.css'),
            myreplyTpl = require('modules/fs-reply/fs-reply.html'),
            Pagination = require('uilibs/pagination'),
            AttachPreview = require('modules/fs-attach/fs-attach-preview'), //预览组件
            filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
            Spin = require('spin'),
            moment = require('moment'),
            util = require('util');
    var myreplyitem = $(myreplyTpl).filter(".myreply-list-item").html();
    var pinLink = feedHelper.feedContentFormat; //拼超链接
    var formatPics = feedHelper.picturesFormat; //拼图片
    var formatFiles = feedHelper.filesFormat; //拼附件
    var formatFeedContent = feedHelper.feedContentFormat_; //feed内容拼接

    //设置预览组件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var AudioPlayer = require('uilibs/audio-player'); //音频播放组件
    var contactData = util.getContactData(),
            loginUserData = contactData["u"]; //当前登录用户数据

    ItemM = Backbone.Model.extend({
        defaults: {}
    });
    var formator = {
        "common": function(itemData) {
            var formatData = {},
                    source;
            /* 空值处理 */
            formatData.replyContent = itemData.replyContent || "";
            formatData.feedID = itemData.feedID || "";
            formatData.senderId = (itemData.sender && itemData.sender.employeeID) || "";
            formatData.feedsenderId = (itemData.feedSender && itemData.feedSender.employeeID) || "";
            formatData.profileImage = (itemData.sender && itemData.sender.profileImage) || "";
            formatData.sendername = (itemData.sender && itemData.sender.name) || "";
            var replyToReplyID = itemData.replyToReplyID;//如果大于0则是回复的回复 

            if (loginUserData.id == formatData.senderId) {
                formatData.sendername = "我";
            }
            formatData.feedSenderName = (itemData.feedSender && itemData.feedSender.name) || "";
            formatData.feedSenderName = '<a href="#profile/=/empid-' + formatData.feedsenderId + '">' + formatData.feedSenderName + '</a>';
            if (replyToReplyID > 0) {
                formatData.feedSenderName = '<a href="#profile/=/empid-' + itemData.replyToEmployee.employeeID + '">' + itemData.replyToEmployee.name + '</a>';
            } else {
                if (formatData.feedSenderName.length > 0) {
                    if (loginUserData.id == formatData.feedsenderId) {
                        formatData.feedSenderName = "我";
                    }
                }
            }


            formatData.feedText = itemData.feedText || "";
            formatData.feedPic = itemData.feedPic || "";
            formatData.feedFiles = itemData.feedFiles || "";
            formatData.feedTypeDescription = itemData.feedTypeDescription || "";
            formatData.createTime = itemData.createTime || "";
            formatData.sourceDescription = itemData.sourceDescription || "";
            //formatData.replyToReplyID = itemData.feedReplyID; //如果是回复的回复，则填写被回复的回复的ID否者为0
            //formatData.replyToEmployeeID = itemData.sender.employeeID; //如果是回复的回复，则填写被回复的回复的发出人的ID
            formatData.feedContent = itemData.feedContent;
            formatData.replyToContent = itemData.replyToContent;
            //头像处理
            formatData.profileImage = util.getAvatarLink(formatData.profileImage, 2);
            /*=    显示图片    =*/
            _.extend(formatData, formatPics(itemData.pictures || []));

            /*=    显示附件    =*/
            _.extend(formatData, formatFiles(itemData.files || []));
            /* 录音 */
            var audio = itemData.audio;
            var attachSize;
            var attachPath;
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
                formatData.audioBtn = '<div class="reply-audio-open-btn audio-btn">(' + attachSize + ')</div>';
                formatData.attachPath = attachPath;
                formatData.audioWarp = ' <div class="audio-warp"> <div class="reply-audio-close-btn audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div><div class="audio-box"></div></div>';
                /*formatData.audioWarp = ' <div class="audio-warp"> <div class="audio-close"><img src="../../html/fs/assets/images/audio_colse_ico.gif" alt="">收起</div> <div><audio src="' + FS.BASE_PATH + '/html/fs/data/wav2mp3.mp3" controls="true" ></div> </div>';*/
            } else {
                formatData.audioBtn = '';
                formatData.attachPath = '';
                formatData.audioWarp = '';
            }
            /* 格式化回复的时间和出处 */
            //var ctime = moment.unix(formatData.createTime).from(moment.unix(itemData.serviceTime));
            var ctime = util.getDateSummaryDesc(moment.unix(formatData.createTime), moment.unix(itemData.serviceTime), 1);
            //时间
             formatData.createTime = ctime;
            
            //feed的操作类型 
            formatData.operationType = '';
            var isagreeImg = ''; //审批同意不同意的图标
            formatData.isagreeImg = '';
            switch (itemData.feedType) {
                case 1: //分享
                    formatData.operationType = '';
                    break;
                case 2: //日志
                    if (util.getPlanOperationType(itemData.operationType)) {
                        formatData.operationType = '，' + util.getPlanOperationType(itemData.operationType);
                    }
                    break;
                case 3: //指令
                    if (util.getWorkOperationTypeName(itemData.operationType)) {
                        formatData.operationType = '，' + util.getWorkOperationTypeName(itemData.operationType);
                    }
                    break;
                case 4: //审批
                    if (util.getApproveOperationTypeName(itemData.operationType)) {
                        formatData.operationType = '，' + util.getApproveOperationTypeName(itemData.operationType);
                    }

                    if (itemData.operationType == 1) {
                        isagreeImg = '<img src="../../html/fs/assets/images/agree.gif" alt="" class="approve-isagree">';
                    } else if (itemData.operationType == 2) {
                        isagreeImg = '<img src="../../html/fs/assets/images/unagree.gif" alt="" class="approve-isagree">';
                    } else {
                        isagreeImg = '';
                    }
                    formatData.isagreeImg = isagreeImg;
                    break;
                default:
                    formatData.operationType = '';
                    break;
            }
             //来源
            if (formatData.sourceDescription) {
                if (itemData.source == 1) { //类型1：如果是来自纷享平台就为空不显示了
                    formatData.source = '';
                } else {
                   formatData.source = '，来自' + util.getSourceNameFromCode(itemData.source);
                }

            } else {
                formatData.source = "";
            }
            
            /* 内容拼接 */
            var feedText = '';
            _.each(itemData.replyContent, function(feedItemF) {
                feedText += pinLink(feedItemF);
            });
            formatData.feedText = feedText;

            /* 是否显示“新”图标 */
            var newico = '<div class="img-new"></div>';
            if (itemData.isUnRead) {
                formatData.newico = newico;
            } else {
                formatData.newico = '';
            }

            /* 正文格式化 */
            formatData.feedFormatContent = formatFeedContent(300, itemData);
            if (itemData.replyToReplyID > 0) { //如果是回复的回复
                formatData.feedContent = formatData.replyToContent;
                formatData.feedTypeDescription = '回复';
            } else {

                formatData.feedTypeDescription = util.getFeedTypeName(itemData.feedType);
            }
            return formatData;
        }
    };

    function formatData(itemData) {
        var data = {};
        data = _.extend(data, formator["common"](itemData));
        data.originData = itemData;
        return data;
    }
    ListC = Backbone.Collection.extend({
        sync: function(method, model, options) {
            var that = this;
            var data = options.data || {};
            options.data = _.extend({
                "circleID": 0, //部门id
                "subType": 0, //子类型
                "feedType": 0,
                "keyword": "",
                "pageSize": 30,
                "pageNumber": 2
            }, data);
            Backbone.sync('read', model, _.extend(options, {
                "apiCb": function(responseData) {
                }
            }));
        },
        parse: function(response) {
            /************/
            /** 预处理 **/
            /************/

            var items = response.value.items,
                    data = response.value,
                    formatItems = [];
            _.each(items, function(itemData, i) {
                //服务端时间
                itemData.serviceTime = response.serviceTime;
                //itemData.mainfeedType = data.feedType; //没用到，删除
                if(_.isUndefined(itemData.feedType)){
                    itemData.feedType = data.feedType;
                }
                if(_.isUndefined(itemData.feedSender)){
                    itemData.feedSender = data.feedSender;
                }
                if(_.isUndefined(itemData.feedExtendData)){
                    itemData.feedExtendData = data.feedExtendData;
                }
                formatItems[i] = formatData(itemData);
            });
            return formatItems;
        }
    });

    ItemV = Backbone.View.extend({
        tagName: 'div',
        className: 'reply-item fs-list-item',
        template: _.template(myreplyitem),
        events: {
            "click .aj-Reply": "reply", //回复
            "click .feed-reply-content-visible-h": "frcVisibleH", //展开收起正文控制
            "click .item-media .feed-img": "_previewImg", //预览图片
            "click .item-media .feed-attach .attach-preview-l": "_previewAttach", //预览附件
            "click .item-media .feed-attach .attach-play-l": "_playAttach", //音频播放
            "click .reply-audio-open-btn": "_openAudio", //打开录音播放
            "click .reply-audio-close-btn": "_closeAudio" //关闭录音播放
        },
        /**
         * 回复列表展开收起正文控制
         * @param evt
         */
        "frcVisibleH": function(evt) {
            var model = this.model,
                    feedFormatContent = model.get('feedFormatContent'),
                    leftHtml = feedFormatContent.leftHtml;
            var elEl = this.$el,
                    summaryContentEl = $('.feed-summary-text', elEl),
                    leftContentEl = $('.feed-left-text', elEl),
                    visibleEl = $('.feed-reply-content-visible-h', elEl),
                    ellipsisEl = $('.feed-content-ellipsis', elEl);

            if (leftContentEl.length == 0) { //第一次点击时创建剩余内容
                leftContentEl = $('<span class="feed-left-text">' + leftHtml + '</span>');
                leftContentEl.insertAfter(summaryContentEl);
                visibleEl.text('收起正文');
                ellipsisEl.hide();
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
        _openAudio: function(evt) {
            var meEl = $(evt.currentTarget);
            var elEl = this.$el;
            var audioWarpEl = $('.audio-warp', elEl);
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
        _closeAudio: function(evt) {
            var elEl = this.$el;
            var audioBtnEl = $('.audio-btn', elEl);
            var audioWarpEl = $('.audio-warp', elEl);
            audioWarpEl.hide();
            audioBtnEl.show();
            this.audioPlayer && this.audioPlayer.stop();
        },
        _previewImg: function(evt) {
            var model = this.model,
                    originData = model.get("originData"),
                    pictures = originData.pictures,
                    previewData = [];
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
                "refId": originData.feedID,
                "belongToType": "reply"
            });
            evt.preventDefault();
            evt.stopPropagation(); //阻止事件冒泡，因为主feed列表还有预览行为
        },
        _previewAttach: function(evt) {
            var model = this.model,
                    originData = model.get("originData"),
                    files = originData.files,
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
            evt.stopPropagation(); //阻止事件冒泡，因为主feed列表还有预览行为
        },
        _playAttach: function(evt) {
            var model = this.model,
                originData = model.get("originData"),
                files = originData.files,
                file;
            var curEl = $(evt.currentTarget),
                itemEl = curEl.closest('dl'),
                attachId = itemEl.attr('attachid');
            file = _.find(files, function(itemData) {
                return itemData.attachID == attachId;
            });
            attachPreviewer.preview({
                "type":"audio",
                "data":[{
                    "previewPath":FS.BLANK_IMG,
                    "originPath":file.attachPath,
                    "thumbPath":FS.BLANK_IMG,
                    "createTime":file.createTime,
                    "fileName":file.attachName,
                    "fileSize":file.attachSize,
                    "fileId":file.attachID,
                    "employeeName":originData.sender.name
                }],
                "refId":originData.feedReplyID,
                "belongToType":util.getAttachSourceName(file.source)
            });
            evt.preventDefault();
            evt.stopPropagation(); //阻止事件冒泡，因为主feed列表还有预览行为
        },
        /* 回复 */
        "reply": function(e) {
            var that = this;
            var replyOpts = this.options;
            var model = this.model,
                    originData = model.get('originData');
            var meEl = $(e.currentTarget),
                    itemEl = meEl.closest('.reply-item'),
                    replyContentEl = $('.feed-reply', itemEl);
            var FsReply = require('modules/fs-reply/fs-reply');
            var fsReply;

            var replyListWrapperEL = meEl.closest('.fs-reply-list-wrapper');
            var allSubfeedreplyEL = $('.feed-reply', replyListWrapperEL); //回复列表的子回复框容器
            var allSubAjreplyEL = $('.aj-Reply', replyListWrapperEL); //回复列表的子回复按钮
            var disabled = '';

            if (originData.sender.employeeID == loginUserData.id) { //如果当前人是我就不能给自己发短信
                disabled = 'disabled';
            }
            if (!itemEl.data('fsReply')) {
                fsReply = new FsReply({
                    "trigger": meEl,
                    "element": replyContentEl,
                    "bbarTpl": '<span class="fs-reply-send-sms label-for fn-hide"><input type="checkbox" name="send_sms" class="is-send-sms" ' + disabled + ' />&nbsp;<label>推送短信给：<em class="user-name">' + originData.sender.name + '</em></label></span>',
                    //发送回复附加请求参数，这块是回复的回复
                    "replyDefaultRequestData": function(requestData) {
                        var replyToReplyID = originData.feedReplyID,
                            replyToEmployeeID = originData.sender.employeeID;
                        var feedSenderID= 0,
                            feedReceiverID= 0,
                            feedType=originData.feedType,
                            feedExtendData=originData.feedExtendData;
                        if(feedType==3){
                            feedSenderID=feedExtendData.value1;
                            feedReceiverID=feedExtendData.value2;
                        }else if(feedType==4){
                            feedSenderID=originData.feedSender.employeeID;
                            feedReceiverID=feedExtendData.value1;
                        }

                        var defaultRequestData = {
                            "feedID": model.get('feedID'),
                            "isSendSms": $('.is-send-sms', replyContentEl).prop('checked') //是否发送短信
                        };
                        _.extend(defaultRequestData, {
                            "feedType":feedType,
                            "feedSenderID":feedSenderID,
                            "feedReceiverID":feedReceiverID,
                            "replyToReplyID": replyToReplyID, //如果是回复的回复，则填写被回复的回复的ID
                            "replyToEmployeeID": replyToEmployeeID //如果是回复的回复，则填写被回复的回复的发出人的ID
                        });
                        return defaultRequestData;
                    },
                    /**
                     * 请求一条回复的附加参数
                     */
                    "detailDefaultRequestData":function(){
                        var feedType=originData.feedType;
                        return {
                            "feedType":feedType
                        };
                    },
                    //发送回复成功后回调
                    "replyCb": function() {
                        var opts = that.options;
                        //发送回复成功后每次都把所有的框隐藏掉
                        allSubfeedreplyEL.hide();
                        allSubAjreplyEL.removeClass('fl-common-up-arrow');
                        //发送回复成功后取消发送短信选中
                        $('.is-send-sms', replyContentEl).prop('checked', false);
                        //回复成功后隐藏自身
                        fsReply.hide();
                        meEl.removeClass('fl-common-up-arrow'); //隐藏按钮的箭头
                        if (replyOpts.withReplySuccessTip) { //有回复成功提示
                            flutil.showAlertDialog('回复成功'); //提示成功
                        }
                        //调用view的replyCb实现
                        opts.replyCb && opts.replyCb.apply(this, arguments);
                    },
                    "defaultContent": "回复@" + originData.sender.name + '：',
                    "listOpts": null //回复不带回复列表
                });
                fsReply.show();
                this.compStore.push(fsReply);
                itemEl.data('fsReply', fsReply);
            }
            //判断什么时候显示箭头
            if (replyContentEl.is(':visible')) {
                meEl.addClass('fl-common-up-arrow');
            } else {
                meEl.removeClass('fl-common-up-arrow');
            }
        },
        initialize: function() {
            //设置内部组件引用容器，供以后删除调用
            this.compStore = [];
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.options.hideReplyRef) { //隐藏回复引用，默认为显示状态
                $('.myreply-content', this.$el).hide();
            }
            //隐藏回复按钮
            if (this.options.hideReplyBtn) { //隐藏回复按钮，默认为显示状态
                $('.aj-Reply', this.$el).hide();
            }
            return this;
        },
        destroy: function() {
            //尝试删除绑定的每个组件
            _.each(this.compStore, function(comp) {
                comp.destroy && comp.destroy();
            });
            //this.modifyapprerSb&&this.modifyapprerSb.destroy();
            this.compStore = null;
            //清空dom和内部绑定事件
            this.remove();
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //创建回复列表组件
    ReplyList = function(opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": {//分页配置项
                "pageSize": 45,
                "totalSize": 0,
                "visiblePageNums": 7
            },
            "hideReplyBtn": false, //是否隐藏回复按钮，默认显示
            "listPath": '/feed_html/getFeedReplysOfAtMe', //默认请求at我的回复
            "defaultRequestData": {}, //默认请求数据
            //默认发送回复成功后刷新列表，可被重载
            "replyCb": function(responseData) {
                //prepend一条新回复
                if (responseData.success) {
                    this.addNewReply(responseData.value);
                    //this.reload(); //重新刷新列表
                }
            },
            "searchOpts": {
                "inputSelector": null, //搜索输入框
                "btnSelector": null //搜索按钮
            },
            "listEmptyText": "暂无记录" //列表记录为空的文字提示
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.pagEl = $(opts.pagSelector); //可能是上下两层分页
        this.items = [];
        this.list = new ListC();
        this.paginations = []; //分页组件
        this.tempRequestData = {};
        this.init();
    };
    _.extend(ReplyList.prototype, {
        "init": function() {
            var that = this,
                    opts = this.opts;
            var elEl = this.element,
                    listEl;
            var list = this.list;
            //构建list容器
            elEl.addClass('fs-reply-list').html('<div class="fs-reply-list-inner"></div>');
            listEl = $('.fs-reply-list-inner', elEl);
            //监听collection add事件
            list.on('add', function(m, c, listOpts) {
                var itemV,
                        index = c.indexOf(m);
                itemV = new ItemV({
                    "model": m,
                    "hideReplyBtn": opts.hideReplyBtn,
                    "withReplySuccessTip": true, //带回复成功提示
                    "replyCb": function(responseData) {
                        opts.replyCb.call(this, responseData);
                    }
                }).render();
                if (index == 0) { //前插
                    itemV.$el.prependTo(listEl);
                } else { //后插
                    itemV.$el.appendTo(listEl);
                }
                that.items.push(itemV);
            });
            //初始化分页组件
            this.pagEl.each(function() {
                var pageEl = $(this);
                var pagination = new Pagination(_.extend({
                    "element": pageEl
                }, opts.pagOpts));

                pagination.on('page', function(pageNumber) {
                    //绑定和其他pagination的关联
                    _.each(that.paginations, function(item) {
                        if (item !== pagination) {
                            item.set('activePageNumber', pageNumber);
                        }
                    });
                    //清空列表
                    that.empty();
                    //请求数据
                    that.fetch();
                });
                //渲染分页组件
                pagination.render();
                that.paginations.push(pagination);
            });
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                this._searchBarInit();
            }
            //初始化列表结果空白提示
            this._initListEmptyTip();
            //注册事件
            this._regEvents();
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
                    barEl,
                    isInit = searchInputEl.data('isInit');
            var searchEmptyEl,
                    searchInputWEl;
            if (!isInit) {
                //创建快速关闭按钮
                searchEmptyEl = $('<span class="empty-h">&#10005;</span>');
                searchInputWEl = $('<span class="list-search-input-wrapper"></span>');

                searchInputEl.wrap(searchInputWEl);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchEmptyEl.hide().appendTo(searchInputWEl);

                //搜索输入框enter提交事件注册和快速清空按钮
                searchInputEl.keydown(function(evt) {
                    if (evt.keyCode == 13) {    //监听回车按键
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
                searchInputEl.data('isInit', true);
            }
            barEl = $('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);

            //点击返回到查看全部列表
            barEl.on('click', '.back-l', function(evt) {
                var emptyEl = $('.list-empty-tip', elEl), //记录空白提示
                        searchEmptyEl = $('.empty-h', searchInputEl.closest('.list-search-input-wrapper'));
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                barEl.hide();
                emptyEl.hide();
                that.reload({
                    "keyword": ""
                });
                evt.preventDefault();
            });
            this.searchBarEl = barEl;
        },
        /**
         * 搜索框销毁
         * @private
         */
        _searchBarDestroy: function() {
            var opts = this.opts,
                    searchOpts = opts.searchOpts;
            var searchInputEl, //搜索输入框
                    searchInputWEl; //搜索包裹框
            if (this.searchBarEl) {
                searchInputEl = $(searchOpts.inputSelector);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchInputEl.insertAfter(searchInputWEl);
                searchInputWEl.remove();
                searchInputEl.val("").unbind();
                searchInputEl.data('isInit', false);
                this.searchBarEl.remove();
                this.searchBarEl = null;  //释放，节约内存
            }
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState: function(requestData, responseData) {
            var elEl = this.element,
                    barEl = $('.list-search-bar', elEl),
                    numEl = $('.num', barEl);
            if (requestData.keyword.length > 0) {
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
         * 搜索重置
         */
        resetSearch: function() {
            var opts = this.opts,
                    searchOpts = opts.searchOpts;
            var searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                    searchInputWEl = searchInputEl.closest('.list-search-input-wrapper'),
                    searchEmptyEl = $('.empty-h', searchInputWEl);
            searchEmptyEl.click().hide();
            this.searchBarEl && this.searchBarEl.hide();
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
         * 隐藏空记录提示
         * @private
         */
        _hideEmptyTip: function() {
            var elEl = this.element,
                    emptyEl = $('.list-empty-tip', elEl);
            emptyEl.hide();
        },
        /**
         * 设置分页总记录数
         * @private
         */
        _setTotalSize: function(totalSize) {
            var paginations = this.paginations;
            _.each(paginations, function(pagination) {
                pagination.setTotalSize(totalSize);
            });
        },
        /**
         * 事件注册
         * @private
         */
        _regEvents: function() {
        },
        /**
         * 设置回复按钮是否可见
         * @param isVisible
         */
        setReplyBtnVisible: function(isVisible) {
            var opts = this.opts;
            opts.hideReplyBtn = !!isVisible;
        },
        /**
         *
         * @param config
         */
        fetch: function() {
            var that = this;
            var requestData = {};
            var opts = this.opts,
                    pagination = this.paginations[0];
            requestData = _.extend({
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber') //当前页码
            }, requestData || {});
            //加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData = _.extend(requestData, this.tempRequestData);
            this.tempRequestData = {}; //用完重置为空
            //打开loading提示
            this.showLoading();
            this.list.fetch({
                "url": opts.listPath,
                "data": requestData,
                //success回调已经被backbone封装，如下
                //if (success) success(collection, resp, options);
                "success": function(c, responseData, ajaxOpts) {
                    var dataRoot;
                    if (responseData.success) {
                        dataRoot = responseData.value;
                        //设置分页总记录数
                        that._setTotalSize(dataRoot.totalCount);
                        //保存上一次数据存储
                        that.list.lastOriginData = responseData;
                        //更新提示搜索信息
                        that._updateSearchBarState(ajaxOpts.data, responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
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
            //先隐藏空记录提示
            this._hideEmptyTip();
            //重置分页组件
            _.each(this.paginations, function(pagination) {
                pagination.reset();
            });
            this.tempRequestData = requestData;
            this.paginations[0].jump(1);
        },
        "reload": function(requestData) {
            //清理上一次加载的原始数据
            this.list.lastOriginData = null;
            this.load(requestData);
        },
        "empty": function() {
            var items = this.items;
            var listEl = $('.fs-reply-list-inner', this.element);
            _.each(items, function(itemV) {
                itemV.destroy && itemV.destroy();
            });
            listEl.empty();
        },
        "destroy": function() {
            //搜索框销毁
            this._searchBarDestroy();
            //this.pagination.destroy();
            _.each(this.paginations, function(pagination) {
                pagination.destroy();
            });
            this.paginations = [];
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消list和pagination绑定
            this.list.lastOriginData = null;
            this.list = null;
            //this.pagination = null;
            this.tempRequestData = {};
            this.element.off();
            this.element = null;
        }
    });
    _.extend(module.exports, {
        "replyList": ReplyList,
        "itemV": ItemV,
        "listC": ListC,
        "itemM": ItemM
    });
});