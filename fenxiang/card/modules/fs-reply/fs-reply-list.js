/**
 * FS回复列表
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS;
    var ReplyList, //回复列表组件
        ListC, //collection
        ItemV, //view
        ItemM; //model
    var publish = require('modules/publish/publish');
    var FeedReply = require('modules/card-reply/feed-reply.js');//回复组件
    var feedHelper = require('modules/feed-list/feed-list-helper'),
        flutil = require('modules/feed-list/fl-util'),
//        feedlistcss = require('modules/feed-list/feed-list.css'),
        myreplyTpl = require('modules/fs-reply/fs-reply.html'),
//        moduleStyle = require('./fs-reply.css'),
        Pagination = require('uilibs/pagination'),
        AttachPreview = require('modules/fs-attach/fs-attach-preview'), //预览组件
        filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
        Spin = require('spin'),
        moment = require('moment'),
        util = require('util');
    var MediaMaker = publish.mediaMaker; //多媒体按钮组件
    var AtInput = publish.atInput; //at输入框
    var contactData = util.getContactData(); //所有人
    var currentUserData = contactData["u"]; //自己
    var myreplyitem = $(myreplyTpl).filter(".myreply-list-item").html();
    var pinLink = feedHelper.feedContentFormat; //拼超链接
    var formatPics = feedHelper.picturesFormat; //拼图片
    var formatFiles = feedHelper.filesFormat; //拼附件
    var formatFeedContent = feedHelper.feedContentFormat_; //feed内容拼接
    var feedReply = new FeedReply();

    //设置预览组件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var AudioPlayer = require('uilibs/audio-player'); //音频播放组件

    var loginUserData = contactData["u"]; //当前登录用户数据

    ItemM = Backbone.Model.extend({
        defaults: {}
    });

    /**
     * 回复列表的拼图片函数
     * @param itemData.pictures
     * @param num 显示多少张
     * @returns formatData
     */
    var formatPicsForReply = function (pictures, num) {
        var formatData = {};
        var pictureStr = '';
        var pictures = [].concat(pictures);
        var picN = pictures.length;
        var firstPic = pictures[0];
        var moreLinkStr = '';
        var n = num;//显示多少张
        var surplusN = picN - n+1;

        if (picN == 0) {
            formatData.feedPic = '';
        }
        if (picN == 1) {
            formatData.feedPic = '<div class="feed-img-only"><div class="img-num"><img class="feed-img-item" src="' + util.getDfLink(firstPic.attachPath + '3', firstPic.attachName, false, 'jpg') + '"/></div></div>';
        }
        if (picN > 1 && picN <= n) {
            _.each(pictures, function (picture) {
                pictureStr += '<div class="img-warp img-num"><img class="feed-img-item" src="' + util.getDfLink(picture.attachPath + '3', picture.attachName, false, 'jpg') + '"/></div>';
            });
            formatData.feedPic = '<div class="feed-img-many fn-clear">' + pictureStr + '</div>';

        } else if (picN > n) {
            moreLinkStr = '<div class="img-num"><div class="feed-img-item more-link">更多' + surplusN + '张</div></div>';
            for (var i = 0; i <= (n - 2); i++) {
                pictureStr += '<div class="img-warp img-num"><img class="feed-img-item" src="' + util.getDfLink(pictures[i].attachPath + '3', pictures[i].attachName, false, 'jpg') + '"/></div>';
            }
            formatData.feedPic = '<div class="feed-img-many fn-clear">' + pictureStr + moreLinkStr + '</div>';
        }
        return formatData;
    };
    var formator = {
        "common": function (itemData) {
            var formatData = {},
                source;
            /* 空值处理 */
            formatData.replyContent = itemData.replyContent || "";
            formatData.feedID = itemData.feedID || "";
            formatData.feedReplyID = itemData.feedReplyID || "";
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
            _.extend(formatData, formatPicsForReply(itemData.pictures || [], 5));

            /*=    显示附件    =*/
            _.extend(formatData, formatFiles(itemData.files || [], itemData));
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
                formatData.audioWarp = ' <div class="audio-warp"><div class="audio-box"></div></div>';
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
            /* 赞 */
            var likeCount = itemData.feedReplyLikeCount;
            var isAlreadyLike = itemData.isAlreadyLike;
            var islikeStr = '';
            var islikeTitStr = '取消赞';
            var islikeCurStr = 'cur';
            var islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
            var likeEmployees = itemData.feedReplyLiker;
            var disableClass = '';
            if (likeCount > 32) {
                disableClass = '';
            } else {
                disableClass = 'disable';
            }
            var bottomInfoStr = '<div class="bottom-info fn-clear fn-hide" pagenumber="1"><div class="l"><span class="count-number">' + itemData.feedReplyLikeCount + '</span>个人赞过</div><div class="r"><em class="ico_page_prev disable"><</em>&nbsp;&nbsp;<em class="ico_page_next ' + disableClass + '">></em></div></div>';
            var contentStr = '';
            var imgStr = '';
            var morebtnStr = '';
            var hideStr = '';
            var widthNum;//动态改变父级容器的宽度，1张图片的宽度为40
            if (likeEmployees) {
                _.some(likeEmployees, function (likeEmployeesdata, n) {
                    var name = likeEmployeesdata.name;
                    var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, '2');
                    var employeeID = likeEmployeesdata.employeeID;
                    if (n < 32) {//最多显示32条
                        imgStr += '<a href="#profile/=/empid-' + employeeID + '" class="js-empids" title="' + name + '"><img alt="' + name + '" src="' + profileImage + '"></a>';
                    }
                });
                //人数大于5个显示更多
                if (likeEmployees.length > 5) {
                    morebtnStr = '<a href="javascript:;" title="更多" class="islike-tip-more-btn"></a>';
                    widthNum = 200;//最大200
                } else {
                    morebtnStr = '<a href="javascript:;" title="更多" class="islike-tip-more-btn hide"></a>';
                    widthNum = likeEmployees.length * 40;
                }
            }
            if (!isAlreadyLike) { //我没赞过
                islikeTitStr = '赞';
                islikeCurStr = '';
                islikeCountStr = '';
                contentStr = '';
            }
            contentStr = '<div class="reply-islike-tip" style="display:none;width: ' + widthNum + 'px"><div class="toparrow"> <em>◆</em> <span>◆</span> </div><span class="list-warp">' + imgStr + '</span>' + morebtnStr + bottomInfoStr + '</div>';
            if (likeCount > 0) { //别人赞过
                islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
                hideStr = '';
            } else {
                contentStr = '';
                islikeCountStr = '';
                hideStr = 'fn-hide';
            }
            //                islikeStr = '<div class="fl-fn-btn ' + islikeCurStr + '"><span class="islike-btn aj-feed-fn-com-btn" title="' + islikeTitStr + '"><b></b><a href="javascript:void(0);" class="likecount ' + hideStr + '">' + islikeCountStr + '</a><i class="S_txt3">|</i></span>' + contentStr + '</div>';
            islikeStr = '<span title="'+islikeTitStr+'" class="islike-btn aj-reply-fn-com-btn ' + islikeCurStr + '" title="' + islikeTitStr + '"><b></b> <a class="reply-likecount ' + hideStr + '" href="javascript:void(0);">' + islikeCountStr + '</a> </span> <i class="S_txt3">|</i>';
            formatData.islike = islikeStr;
            formatData.liketip = contentStr;

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
            _.each(itemData.replyContent, function (feedItemF) {
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
        sync: function (method, model, options) {
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
                "apiCb": function (responseData) {
                }
            }));
        },
        parse: function (response) {
            /************/
            /** 预处理 **/
            /************/

            var items = response.value.items,
                data = response.value,
                formatItems = [];
            _.each(items, function (itemData, i) {
                //服务端时间
                itemData.serviceTime = response.serviceTime;
                //itemData.mainfeedType = data.feedType; //没用到，删除
                if (_.isUndefined(itemData.feedType)) {
                    itemData.feedType = data.feedType;
                }
                if (_.isUndefined(itemData.feedSender)) {
                    itemData.feedSender = data.feedSender;
                }
                if (_.isUndefined(itemData.feedExtendData)) {
                    itemData.feedExtendData = data.feedExtendData;
                }
                formatItems[i] = formatData(itemData);
            });
            return formatItems;
        }
    });

    ItemV = Backbone.View.extend({
        tagName: 'div',
        className: 'reply-item fs-list-item card-border-rad',
        template: _.template(myreplyitem),
        hideReplyBtn: false, //是否隐藏回复按钮
        events: {
            "click .aj-Reply": "reply", //回复
            "click .feed-reply-content-visible-h": "frcVisibleH", //展开收起正文控制
            "click .item-media .feed-img-item": "_previewImg", //预览图片
            "click .item-media .feed-attach .attach-preview-l": "_previewAttach", //预览附件
            "click .item-media .feed-attach .attach-play-l": "_playAttach", //音频播放
            "click .reply-audio-open-btn": "_openAudio", //打开录音播放
            "click .reply-audio-close-btn": "_closeAudio", //关闭录音播放
            "mouseenter .islike-btn": "enterIsLike", // 赞的人员信息TIP 鼠标经过显示
            "mouseleave .islike-btn": "leaveIsLike", // 赞的人员信息TIP 鼠标离开隐藏
            "mouseenter .reply-islike-tip": "enterIsTipLike",//鼠标经过显示
            "mouseleave .reply-islike-tip": "leaveIsTipLike",//鼠标离开隐藏
            "click .islike-tip-more-btn": "moreTip",//更多赞列表
            "click .islike-btn": "sendIsLike",  //点击赞
            "click .reply-islike-tip .ico_page_prev": "likeTipPagePrev",
            "click .reply-islike-tip .ico_page_next": "likeTipPageNext"
        },
        /**
         * 回复列表展开收起正文控制
         * @param evt
         */
        "frcVisibleH": function (evt) {
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
        likeTipPagePrev: function (e) {
            var meEl = $(e.currentTarget);
            var isliketipEl = meEl.closest('.reply-item').find('.reply-islike-tip');
            var bottomInfoEl = $('.bottom-info', isliketipEl);
            var pageNumber = Number(bottomInfoEl.attr('pagenumber'));
            if (!meEl.is('.disable')) {
                this.reloadLikeTipData(isliketipEl, pageNumber - 1);
            }
        },
        likeTipPageNext: function (e) {
            var meEl = $(e.currentTarget);
            var isliketipEl = meEl.closest('.reply-item').find('.reply-islike-tip');
            var bottomInfoEl = $('.bottom-info', isliketipEl);
            var pageNumber = Number(bottomInfoEl.attr('pagenumber'));
            if (!meEl.is('.disable')) {
                this.reloadLikeTipData(isliketipEl, pageNumber + 1);
            }
        },
        // 赞的人员信息TIP 离开隐藏
        leaveIsLike: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var itemEl = meEl.closest('.reply-item');
            var delayhide = function (argument) {
                $('.reply-islike-tip').hide();
//                that.reloadLikeTipData(itemEl.find('.reply-islike-tip'), 1);//隐藏后把列表数据回到第1页
            };
            this.likeTimer = setTimeout(delayhide, 100);
        },
        // 赞的人员信息TIP 鼠标经过显示
        enterIsLike: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.reply-item');
            var funcEl = itemEl.find('.item-func');
            var isliketipEl = $('.reply-islike-tip', itemEl);
            var likeMoreEl = $('.islike-tip-more-btn', itemEl);
            var empidsEl = $('.js-empids', itemEl);
            var bottomInfoEl = $('.bottom-info', itemEl);
            var isLike = true;
            var widthNum = 40;
            $('.reply-islike-tip').hide();
            bottomInfoEl.hide();
            //大于5个人隐藏后面并显示更多按钮
            if (empidsEl.length > 8) {
                empidsEl.show().eq(6).nextAll().hide();
                widthNum = 320;//最大320
                likeMoreEl.show();
            } else {
                likeMoreEl.hide();
                empidsEl.show();
                widthNum = (empidsEl.length) * 40;
            }
            isliketipEl.width(widthNum).height('auto');
            var pos = funcEl.position();
            isliketipEl.css('top', pos.top + 45).show();
            clearTimeout(this.likeTimer);
        },
        //提交赞
        sendIsLike: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var itemEl = meEl.closest('.reply-item');
            var isliketipEl = meEl.closest('.item-func').find('.reply-islike-tip');
            var feedID = meEl.closest('.fs-list-item').find('.item-face').attr('feedid');
            var feedReplyID = meEl.closest('.reply-item').data('feedreplyid');
            var isLike = true;
            var islikeCur = meEl.is('.cur');
            //按钮状态
            if (islikeCur) {
                isLike = false;
                meEl.removeClass('cur');
                meEl.attr('title', '赞');
            } else {
                isLike = true;
                meEl.addClass('cur');
                meEl.attr('title', '取消赞');
            }
            //发请求
            util.api({
                "url": '/FeedExtend/SetFeedReplyLike', //赞回复的接口地址
                "type": 'post',
                "data": {
                    "feedID": feedID,
                    "feedReplyID": feedReplyID,// int，FeedReplyID
                    "isLike": isLike
                },
                "dataType": 'json',
                "success": function (responseData) {
                    if (responseData.success) {
                        that.renderIslikeList(itemEl, isliketipEl, feedID, 1); //渲染赞列表
                    }
                }
            });
        },        
        enterIsTipLike: function (e) {
            clearTimeout(this.likeTimer);
        },
        //鼠标离开TIP层隐藏
        leaveIsTipLike: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var delayhide = function (argument) {
                $('.reply-islike-tip').hide();
//                that.reloadLikeTipData(meEl, 1);//隐藏后把列表数据回到第1页
            };
            this.likeTimer = setTimeout(delayhide, 0);
        },
        //LIKETIP的分页数据请求
        reloadLikeTipData: function (warpEl, pageNumber) {
            var listWarpEl = $('.list-warp', warpEl);
            var feedReplyID = warpEl.closest('.reply-item').data('feedreplyid');
            var bottomInfoEl = $('.bottom-info', warpEl);
            warpEl.height(191);//弹框高度固定
            //发请求
            util.api({
                "url": '/FeedExtend/GetFeedReplyLikersOfFeedID', //根据feedID获取赞列表的地址
                "type": 'get',
                "data": {
                    "feedReplyID": feedReplyID,
                    "pageSize": 32,
                    "pageNumber": pageNumber
                },
                "dataType": 'json',
                "success": function (responseData) {
                    var imgStr = '';
                    var totalCount = responseData.value.totalCount || 0;
                    var pageCount = responseData.value.pageCount || 0;
                    var likeEmployees = responseData.value.likers;
                    if (responseData.success) {
                        //拼头像列表
                        _.each(likeEmployees, function (likeEmployeesdata, index) {
                            var name = likeEmployeesdata.name;
                            var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, 2);
                            var empID = likeEmployeesdata.employeeID;
                            imgStr += '<a href="#profile/=/empid-' + empID + '" title="' + name + '" class="js-empids"><img alt="' + name + '" src="' + profileImage + '"></a>';
                        });
                        listWarpEl.html(imgStr);
                        bottomInfoEl.attr('pagenumber', pageNumber);
                        if (pageNumber <= 1) {
                            $('.ico_page_prev', bottomInfoEl).addClass('disable');
                        } else {
                            $('.ico_page_prev', bottomInfoEl).removeClass('disable');
                        }
                        if (pageNumber >= pageCount) {
                            $('.ico_page_next', bottomInfoEl).addClass('disable');
                        } else {
                            $('.ico_page_next', bottomInfoEl).removeClass('disable');
                        }
                    }
                }
            });
        },
        //更多赞列表
        moreTip: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.reply-item');
            var isliketipEl = $('.reply-islike-tip', itemEl);
            var likeMoreEl = $('.islike-tip-more-btn', itemEl);
            var bottomInfoEl = $('.bottom-info', itemEl);
            var empidsEl = $('.js-empids', itemEl);
            /*  var widthNum = 320;
             if (empidsEl.length >= 8) {
             widthNum = 320;
             } else {
             widthNum = (empidsEl.length) * 40;
             }*/
            isliketipEl.width(320).height(191); //固定宽高
            empidsEl.show();
            bottomInfoEl.show();
            likeMoreEl.hide();
        },
        //渲染赞列表
        renderIslikeList: function (itemEl, isliketipEl, feedID) {
            var islikeEl = $('.item-func', itemEl);
            var feedReplyID = itemEl.data('feedreplyid');
            var likecountnumEl = $('.reply-likecount', itemEl); //赞的按钮后面的数字
            util.api({
                "url": '/FeedExtend/GetFeedReplyLikersOfFeedID', //根据feedID获取赞列表的地址
                "type": 'get',
                "data": {
                    "feedReplyID": feedReplyID,
                    "pageSize": 32,
                    "pageNumber": 1
                },
                "dataType": 'json',
                "success": function (responseData) {
                    var totalCount = responseData.value.totalCount || 0;
                    var pageCount = responseData.value.pageCount || 0;
                    var likeEmployees = responseData.value.likers;
                    var likersLen = likeEmployees.length;
                    var htmlStr = '';
                    var morebtnStr = '';
                    var disableClass = '';
                    if (pageCount > 1) {
                        disableClass = '';
                    } else {
                        disableClass = 'disable';
                    }
                    var bottomInfoStr = '<div class="bottom-info fn-clear fn-hide" pagenumber="1"><div class="l"><span class="count-number">' + totalCount + '</span>个人赞过</div><div class="r"><em class="ico_page_prev disable"><</em>&nbsp;&nbsp;<em class="ico_page_next ' + disableClass + '">></em></div></div>';
                    var imgStr = '';
                    if (responseData.success) {
                        if (likersLen > 0) {
                            var widthNum;//动态改变父级容器的宽度，1张图片的宽度为40
                            //拼头像列表
                            _.each(likeEmployees, function (likeEmployeesdata, index) {
                                var name = likeEmployeesdata.name;
                                var profileImage = util.getAvatarLink(likeEmployeesdata.profileImage, 2);
                                var empID = likeEmployeesdata.employeeID;
                                imgStr += '<a href="#profile/=/empid-' + empID + '" title="' + name + '" class="js-empids"><img alt="' + name + '" src="' + profileImage + '"></a>';
                            });
                            likecountnumEl.html('<span class="likecountnum">(' + responseData.value.totalCount + ')</span>').show();
                            //人数大于8个显示更多
                            if (likeEmployees.length > 8) {
                                morebtnStr = '<a href="javascript:;" title="更多" class="islike-tip-more-btn"></a>';
                                widthNum = 320;//最大200
                            } else {
                                morebtnStr = '<a href="#stream/showfeed/=/id-' + feedID + '/open-like" title="更多" class="islike-more hide"></a>';
                                widthNum = (likeEmployees.length) * 40;
                            }
                            if (itemEl.find('.reply-islike-tip')[0]) { //如果有提示框就添加内容没有就创建
                                $('.reply-islike-tip', itemEl).html('<div class="toparrow"> <em>◆</em> <span>◆</span> </div><span class="list-warp">' + imgStr + '</span>' + morebtnStr + bottomInfoStr);
                                $('.reply-islike-tip', itemEl).width(widthNum);
                            } else {
                                itemEl.append('<div class="reply-islike-tip" pagenum="1" style="display:block;width: ' + widthNum + 'px"><div class="toparrow"> <em>◆</em> <span>◆</span> </div><span class="list-warp">' + imgStr + '</span>' + morebtnStr + bottomInfoStr + '</div>');
                            }
                            var likeMoreEl = $('.reply-islike-tip .islike-tip-more-btn', itemEl);
                            //大于5个人隐藏后面并显示更多按钮
                            var empidsEl = $('.js-empids', itemEl);
                            if (empidsEl.length > 8) {
                                empidsEl.show().eq(6).nextAll().hide();
                                likeMoreEl.show();
                            } else {
                                likeMoreEl.hide();
                                empidsEl.show();
                            }
                            isliketipEl = itemEl.find('.reply-islike-tip');
                            var funcEl = itemEl.find('.item-func');
                            var pos = funcEl.position();
                            isliketipEl.css('top', pos.top + 45).show();                            
                            isliketipEl.show();
                        } else {
                            likecountnumEl.html('').hide();
                            itemEl.find('.reply-islike-tip').remove();
                        }
                    }
                }
            });
        },
        _openAudio: function (evt) {
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
                    "length": originData.audio.attachSize,
                    "themeStyle":4
                });
                this.compStore.push(this.audioPlayer); //放入组件存储供以后删除
            }
            this.audioPlayer.play(); //打开直接播放
        },
        _renderAudioCpt:function(){
            var model=this.model,
                originData=model.get("originData"),
                audioSrc = model.get('attachPath');
            var audioWarpEl = $('.audio-warp', this.$el);
            if (originData.audio) {
                //初始化audio
                if (!this.audioPlayer) {
                    this.audioPlayer = new AudioPlayer({
                        "element": $('.audio-box', audioWarpEl),
                        "audioSrc": audioSrc,
                        "length": originData.audio.attachSize,
                        "themeStyle":4
                    });
                    this.compStore.push(this.audioPlayer); //放入组件存储供以后删除
                }
            }
        },
        _previewImg: function (evt) {
            var model = this.model,
                originData = model.get("originData"),
                pictures = originData.pictures,
                previewData = [];
            var currentItemEl = $(evt.currentTarget),
                index = currentItemEl.closest('.img-num').index();
            _.each(pictures, function (picture, i) {
                previewData[i] = {
                    "source": 2,//soure:信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                    "refId": originData.feedReplyID||0,
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
                "belongToType": "reply",
                "activeIndex": index
            });
            evt.preventDefault();
            evt.stopPropagation(); //阻止事件冒泡，因为主feed列表还有预览行为
        },
        _previewAttach: function (evt) {
            var model = this.model,
                originData = model.get("originData"),
                files = originData.files,
                file;
            var curEl = $(evt.currentTarget),
                itemEl = curEl.closest('dl'),
                attachId = itemEl.attr('attachid');
            file = _.find(files, function (itemData) {
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
        _playAttach: function (evt) {
            var model = this.model,
                originData = model.get("originData"),
                files = originData.files,
                file;
            var curEl = $(evt.currentTarget),
                itemEl = curEl.closest('dl'),
                attachId = itemEl.attr('attachid');
            file = _.find(files, function (itemData) {
                return itemData.attachID == attachId;
            });
            attachPreviewer.preview({
                "type": "audio",
                "data": [
                    {
                        "previewPath": FS.BLANK_IMG,
                        "originPath": file.attachPath,
                        "thumbPath": FS.BLANK_IMG,
                        "createTime": file.createTime,
                        "fileName": file.attachName,
                        "fileSize": file.attachSize,
                        "fileId": file.attachID,
                        "employeeName": originData.sender.name
                    }
                ],
                "refId": originData.feedReplyID,
                "belongToType": util.getAttachSourceName(file.source)
            });
            evt.preventDefault();
            evt.stopPropagation(); //阻止事件冒泡，因为主feed列表还有预览行为
        },
        /* 回复 */
        "reply": function (e) {
            var that = this;
            var replyOpts = this.options;
            var model = this.model,
                originData = model.get('originData');
            var meEl = $(e.currentTarget),
                itemEl = meEl.closest('.reply-item'),
                replyContentEl = $('.feed-reply', itemEl),
                inputEl;

            // 实例化回复功能函数
            if (!this.replyFn) {
                this.replyFn = new ReplyFn({
                    model: model,
                    itemV: this
                });
                replyContentEl.html(this.replyFn.el);
                this.replyFn.setupComponent();
            }
            inputEl = $('.input-text', replyContentEl);
            //判断什么时候显示箭头
            if (replyContentEl.is(':visible')) {
                meEl.removeClass('fl-common-up-arrow');
                replyContentEl.hide();
            } else {
                meEl.addClass('fl-common-up-arrow');
                replyContentEl.show();
                inputEl.val('回复@' + originData.sender.name + '：').trigger('autosize.resize');
                //焦点定位到输入框,光标位于输入框最后
                util.setCursorPositionEnd(inputEl);
            }
        },
        initialize: function () {
            //设置内部组件引用容器，供以后删除调用
            this.compStore = [];
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
        	var obj = this.model.toJSON();
            this.$el.html(this.template(obj));
            this.$el.data('feedreplyid', obj.feedReplyID);
            if (this.options.hideReplyRef) { //隐藏回复引用，默认为显示状态
                $('.myreply-content', this.$el).hide();
            }
            //隐藏回复按钮
            if (this.options.hideReplyBtn) { //隐藏回复按钮，默认为显示状态
                $('.aj-Reply', this.$el).hide();
            }
            //音频渲染
            this._renderAudioCpt();
            return this;
        },
        destroy: function () {
            //尝试删除绑定的每个组件
            _.each(this.compStore, function (comp) {
                comp.destroy && comp.destroy();
            });
            //this.modifyapprerSb&&this.modifyapprerSb.destroy();
            this.compStore = null;
            //清空dom和内部绑定事件
            this.remove();
        }
    });

    /**
     * 回复框功能函数
     */
    var ReplyFn = Backbone.View.extend({
        tagName: 'div',
        className: 'replyfn-item',
        template: _.template($(myreplyTpl).filter(".feed-reply-tpl").html()),
        events: {
            "click .f-submit": "submit", //提交
            "click .f-cancel": "cancel" //取消
        },
        initialize: function () {
            var elEl = this.$el;
            this.render(); //渲染
            this.originData = this.model.toJSON().originData;
            this.itemV = this.options.itemV;
            //this.setupComponent();//设置组件
            this.mediaEl = $('.media', elEl); //
            this.inputTextEl = $('.input-text', elEl); //输入框
            this.submitBtn = $('.f-submit', elEl); //提交按钮
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var inputTextEl = $('.input-text', elEl);
            var mediaEl = $('.media', elEl);
            // 设置多媒体功能
            if (!this.media) {
                var media = new MediaMaker({
                    "element": mediaEl,
                    "action": ["h5imgupload", "h5attachupload", "at"],
                    "actionOpts": {
                        "at": {
                            "inputSelector": inputTextEl,
                            "spOpts": {
                                "data": [
                                    {
                                        "title": "同事",
                                        "type": "p",
                                        "list": contactData['p']
                                    },
                                    {
                                        "title": "部门",
                                        "type": "g",
                                        "list": contactData['g']
                                    }
                                ]
                            }
                        }
                    }
                });
                this.media = media;
                // at input
                if (!this.atInput) {
                    var atInput = new AtInput({
                        "element": inputTextEl,
                        "withAt": true
                    });
                    this.atInput = atInput;
                }
            }
        },
        // 设置接口参数
        setoData: function () {
            var elEl = this.element;

            var replycontent = this.inputTextEl.val();
            var feedid = this.model.get("feedID"),
                originData = this.model.get('originData'),
                feedType = originData["feedType"],
                feedExtendData = originData["feedExtendData"],
                feedSenderID,
                feedReceiverID;

            var oData = {},
                attachTypeNames = [];

            var files = this.media.getUploadValue();
            oData["fileInfos"] = [];
            //回复内容
            oData["replyContent"] = _.str.trim(replycontent);
            _.each(files, function (file) {
                if (file.uploadType == "img") {
                    oData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    oData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1": file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                }
            });
            //有上传图片或者附件时，内容可以为空,否则必须填内容
            if (oData.fileInfos.length > 0) {
                if (oData['replyContent'].length == 0) {
                    attachTypeNames = util.getAttachTypeName(oData.fileInfos);
                    if (attachTypeNames.length > 0) {
                        if (attachTypeNames.length > 2) { //三个分类或以上用顿号分割
                            oData['replyContent'] = '分享' + attachTypeNames.join('、');
                        } else if (attachTypeNames.length > 1) { //两个用"和"
                            oData['replyContent'] = '分享' + attachTypeNames.join('和');
                        } else { //一个直接输出
                            oData['replyContent'] = '分享' + attachTypeNames[0];
                        }
                    }
                }
            }
            oData = _.extend({
                "feedID": feedid, //信息源ID
                "isSendSms": false,  //默认不发送短信
                "feedType": feedType,
                "replyContent": '', //回复内容
                "replyToEmployeeID": originData.sender.employeeID,
                "replyToReplyID": originData.feedReplyID
            }, oData);

            if (feedType == 3) {
                feedSenderID = feedExtendData.value1;
                feedReceiverID = feedExtendData.value2;
            } else if (feedType == 4) {
                feedSenderID = originData.feedSender.employeeID;
                feedReceiverID = feedExtendData.value1;
            }
            oData = _.extend(oData, {
                "feedSenderID": feedSenderID,
                "feedReceiverID": feedReceiverID
            });
            return oData;
        },
        // 回复接口操作
        send: function () {
            var elEl = this.$el;
            var requestData;
            var atContents,
                inputEl = this.inputTextEl;
            var that = this;
            //上传附件之后再取数据
            this.media.send(function (sendCb, sendModal) {
                /*feedReply.replyWithData(requestData, {
                 "mediaSendCb": sendCb, // media的CB
                 "sendClearCb": function () {
                 that.cancel();
                 that.media.resetAll();
                 flutil.showAlertDialog('回复成功'); //提示成功
                 }, // 提交后的CB
                 "mediaSendModal": sendModel,
                 "subBtnSelector": that.submitBtn //提交按钮
                 });*/
                /**
                 * 发回复核心执行体
                 */
                var sendCore = function () {
                    util.api({
                        "type": "post",
                        "data": requestData,
                        "url": "/Feed/Reply",
                        "success": function (responseData) {
                            if (responseData.success) {
                                //发布清空
                                that.cancel();
                                that.media.resetAll();
                                //itemV的replyCb回调
                                that.itemV.options.replyCb && that.itemV.options.replyCb.call(that.itemV, responseData, requestData);
                                flutil.showAlertDialog('回复成功'); //提示成功
                            }
                            sendCb(); //清理
                        },
                        "error": function(){
                        	sendCb(); //清理
                        	util.alert('系统繁忙，请稍后重试。');
                        }
                    }, {
                        "submitSelector": that.submitBtn
                    });
                };
                //保证获取完整的fileInfos信息
                requestData = that.setoData();
                //获取at内容
                atContents = util.getAtFromInput(inputEl);
                //验证是否有多加的at范围
                if (atContents.length > 0 && requestData.feedID) {
                    util.api({
                        "url": "/Feed/SendFeedReplyAtEmpCheck",
                        "data": {
                            "feedID": requestData.feedID,
                            "replyContent": requestData.replyContent
                        },
                        "success": function (responseData) {
                            var dataRoot,
                                hasNewRange = false,
                                message = '回复中提到的员工：';
                            if (responseData.success) {
                                dataRoot = responseData.value;
                                hasNewRange = !dataRoot.value;
                                if (hasNewRange) {
                                    message += dataRoot.value1 + '不在信息的原始范围中，是否要添加？添加后他们将能看到信息的原文和所有该信息的回复。';
                                    util.confirm(message, '添加范围提示', function () {
                                        sendCore();
                                    }, {
                                        "onCancel": function () {
                                            sendModal.hide();
                                        }
                                    });
                                } else {
                                    //直接发送
                                    sendCore();
                                }

                            }
                        }
                    });
                } else {
                    //直接发送
                    sendCore();
                }
            }, elEl);
        },
        submit: function (e) {
            if (this.isEmpty(this.inputTextEl)) { //如果为空暂定操作
                this.send();
            }
        },
        cancel: function () {
            this.$el.parent().hide();
            this.itemV.$el.find('.aj-Reply').removeClass('fl-common-up-arrow');
            this.inputTextEl.val('');
        },
        formatData: function (oData) {
            var formatData = {};
            _.extend(formatData, oData);
            formatData.profileImage = currentUserData.profileImage || ''; //追加到原始数据里面
            return formatData;
        },
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            var originData = this.model.toJSON().originData;
            elEl.html(renderTemplate(this.formatData(originData)));
            return this;
        },
        // 判断表单内容是否为空
        isEmpty: function (target) {
            var targetText = target.val();
            var passed = true;
            targetText = $.trim(targetText);
            // 内容不能为空
            if (targetText == "") {
                util.showInputError(target);
                passed = false;
            }
            // 不能超过2000字
            if (targetText.length > 2000) {
                util.alert('发送内容不超过2000字，目前已超出<em>' + (targetText.length - 2000) + '</em>个字');
                passed = false;
            }
            return passed;
        },
        // 清空
        destroy: function () {
            this.remove();
        }
    });

    /**
     * 创建回复列表组件
     * @param {type} opts
     * @returns {undefined}
     */
    ReplyList = function (opts) {
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
            "replyCb": FS.EMPTY_FN,
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
        this.pagination = {}; //分页组件
        this.tempRequestData = {};
        this.init();
    };
    _.extend(ReplyList.prototype, {
        "init": function () {
            var that = this,
                opts = this.opts;
            var elEl = this.element,
                listEl;
            var list = this.list;
            //构建list容器
            elEl.addClass('fs-reply-list').html('<div class="fs-reply-list-inner"></div>');
            listEl = $('.fs-reply-list-inner', elEl);
            //监听collection add事件
            list.on('add', function (m, c, listOpts) {
                var itemV,
                    index = c.indexOf(m);
                itemV = new ItemV({
                    "model": m,
                    "hideReplyBtn": opts.hideReplyBtn,
                    "withReplySuccessTip": true, //带回复成功提示
                    "replyCb": function (responseData, requestData) {
                        opts.replyCb.call(this, responseData);
                    }
                }).render();
                if($('.fs-reply-list-inner', elEl)[0]) {
                	listEl = $('.fs-reply-list-inner', elEl);
                } else {
                	if($('.list-empty-tip', elEl)[0]) {
                		$('.list-empty-tip', elEl).before('<div class="fs-reply-list-inner"></div>');
                	} else {
                		elEl.append('<div class="fs-reply-list-inner"></div>');
                	}
                	listEl = $('.fs-reply-list-inner', elEl);
                }
                if (index == 0) { //前插
                    itemV.$el.prependTo(listEl);
                } else { //后插
                    itemV.$el.appendTo(listEl);
                }
                that.items.push(itemV);
                try{
                	var t = window.store.get('receivedreplies');
                	t = t || '';
                	if(index==0) {
                		t = t + 'element-' + listEl.parent().attr('class') + ',' + listEl.parent().parent().attr('class') + ',' + listEl.parent().parent().parent().attr('class') + (+new Date()) + '-';
                	}
            		if(t.length > 500) {
            			t = t.substring(t.length-500);
            		}
            		window.store.set('receivedreplies', t);
                } catch(e){}
            });
            //初始化分页组件
            var pageEl = this.pagEl;
            var pagination = new Pagination(_.extend({
                "element": pageEl
            }, opts.pagOpts));
            pagination.on('page', function (pageNumber) {
                //绑定和其他pagination的关联
//                    _.each(that.paginations, function (item) {
//                        if (item !== pagination) {
//                            item.set('activePageNumber', pageNumber);
//                        }
//                    });
                //清空列表
                that.empty();
                try{
                	var t = window.store.get('receivedreplies');
                	t = t || '';
            		t = t + 'pageevent-' + (+new Date()) + '-';
            		if(t.length > 500) {
            			t = t.substring(t.length-500);
            		}
            		window.store.set('receivedreplies', t);
                } catch(e){}
                //请求数据
                that.fetch();
            });
            //渲染分页组件
            pagination.render();
            that.pagination = pagination;
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                this._searchBarInit();
            }
            if(opts.searchSelect) {
            	opts.searchSelect.on('searchSelectOk', function(data){
            		data = opts.searchSelect.getRequestData();
            		delete data.employeeIDs;
            		that.reload(data);
            	});
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
        _searchBarInit: function () {
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
                searchInputEl.keydown(function (evt) {
                    if (evt.keyCode == 13) {    //监听回车按键
                        searchBtnEl.click();
                    }
                }).keyup(function () {
                        var val = _.str.trim($(this).val());
                        if (val.length > 0) {
                            searchEmptyEl.show();
                            searchInputEl.addClass('with-input-value');
                        } else {
                            searchEmptyEl.hide();
                            searchInputEl.removeClass('with-input-value');
                        }
                    });
                searchEmptyEl.click(function () {
                    searchInputEl.val("");
                    searchInputEl.removeClass('with-input-value');
                    searchEmptyEl.hide();
                });
                searchInputEl.data('isInit', true);
            }
            barEl = $('<div class="list-search-bar fn-clear"><span class="words"></span><span class="num">0</span>条记录<a class="btn-close" href="#" onclick="return false;"></a></div>');
            barEl.hide().prependTo(elEl);

            //点击返回到查看全部列表
            barEl.on('click', '.btn-close', function (evt) {
                var emptyEl = $('.list-empty-tip', elEl), //记录空白提示
                    searchEmptyEl = $('.empty-h', searchInputEl.closest('.list-search-input-wrapper'));
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                //重置筛选条件
                if(that.opts.searchSelect) {
                	that.opts.searchSelect._clear();
					that.opts.searchSelect.removeAllCondition();
                }
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
        _searchBarDestroy: function () {
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
        _updateSearchBarState: function (requestData, responseData) {
            var elEl = this.element,
                barEl = $('.list-search-bar', elEl),
                wordsEl = $('.words', elEl),
                numEl = $('.num', barEl);
            //feed-list(<div class="reply-list fs-reply-list" style="display: none;"></div>)列 莫名隐藏bug TODO
            if(elEl.hasClass('fs-reply-list'))
                elEl.show();
            var flag = false;
            if (requestData.keyword.length > 0) {
            	flag = true;
            }
            if(this.opts.searchSelect) {
            	var data = this.opts.searchSelect.getRequestData();
            	if(data.employeeIDs.length || data.startTime || data.endTime) {
            		flag = true;
            	}
            }
            if (flag) {
                if (responseData.success) {
                	if(this.opts.searchSelect) {
                		var result = this.opts.searchSelect.getConditionWords();
                		wordsEl.html(result);
                	} else {
                		wordsEl.html('共搜到');
                	}
                    numEl.text(responseData.value.totalCount);
                    barEl.show();
                    return;
                }
            }
            barEl.hide();
            return;
        },
        /**
         * 
         */
        _updateSearchSelectStatus: function(){
        	var that = this;
        	if(this.opts.searchSelect) {
        		var result = this.opts.searchSelect.getConditionWords();
        		if(result) {
        			this.element.find('.fs-search-select-opts-area').remove();
        			this.element.prepend(result);
        			$(this.element.find('.fs-search-select-opts-area')).on('click', '.btn-close', function(){
        				that.opts.searchSelect._clear();
        				that.opts.searchSelect.removeAllCondition();
        				that.reload();
        			});
        		} else {
        			this.element.find('.fs-search-select-opts-area').remove();
        		}
        	}
        },
        /**
         * 搜索重置
         */
        resetSearch: function () {
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
        _initListEmptyTip: function () {
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
        _updatelistStatus: function (responseData) {
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
        _hideEmptyTip: function () {
            var elEl = this.element,
                emptyEl = $('.list-empty-tip', elEl);
            emptyEl.hide();
        },
        /**
         * 设置分页总记录数
         * @private
         */
        _setTotalSize: function (totalSize) {
        	this.pagination.setTotalSize(totalSize);
        },
        /**
         * 事件注册
         * @private
         */
        _regEvents: function () {
        },
        /**
         * 设置回复按钮是否可见
         * @param isVisible
         */
        setReplyBtnVisible: function (isVisible) {
            var opts = this.opts;
            opts.hideReplyBtn = !!isVisible;
        },
        /**
         *
         * @param config
         */
        fetch: function () {
            var that = this;
            var requestData = {};
            var opts = this.opts,
                pagination = this.pagination;
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
            if(this.opts.searchSelect) {
        		data = this.opts.searchSelect.getRequestData();
        		delete data.employeeIDs;
        		data.keyword = $(this.opts.searchOpts.inputSelector).val();
                requestData = _.extend(requestData||{}, data);
        	}
            this.tempRequestData = {}; //用完重置为空
            //打开loading提示
            this.showLoading();
            this.list.fetch({
                "url": opts.listPath,
                "data": requestData,
                //success回调已经被backbone封装，如下
                //if (success) success(collection, resp, options);
                "success": function (c, responseData, ajaxOpts) {
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
                        try{
                        	var t = window.store.get('receivedreplies');
                        	t = t || '';
                    		t = t + 'success-' + (+new Date()) + '-';
                    		if(t.length > 500) {
                    			t = t.substring(t.length-500);
                    		}
                    		window.store.set('receivedreplies', t);
                        } catch(e){}
                    }
                }
            });
        },
        /**
         * prepend一个新回复item
         * @param replyId
         */
        prependItem: function (replyId, feedId, feedType) {
            var that = this;
            var requestData = {
                "feedID": feedId,
                "feedReplyID": replyId,
                "feedType": feedType
            };
            var list = this.list; //list collection
            util.api({
                type: 'get',
                data: requestData,
                url: "/Feed/GetFeedReplyByID",
                success: function (responseData) {
                    if (responseData.success) {
                        var formatData = list.parse(responseData)[0];
                        list.unshift(formatData);
                        that._updatelistStatus(responseData);   //更新列表状态
                    }
                }
            });
        },
        "showLoading": function () {
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
        "hideLoading": function () {
            var elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 加载第一页
         */
        "load": function (requestData) {
        	if(this.opts.searchSelect) {
        		data = this.opts.searchSelect.getRequestData();
        		delete data.employeeIDs;
        		data.keyword = $(this.opts.searchOpts.inputSelector).val();
                requestData = _.extend(requestData||{}, data);
        	}
            //先隐藏空记录提示
            this._hideEmptyTip();
            //重置分页组件
//            _.each(this.paginations, function (pagination) {
            this.pagination.reset();
//            });
            this.tempRequestData = requestData;
            try{
            	var t = window.store.get('receivedreplies');
            	t = t || '';
        		t = t + '执行load跳第一页-' + (+new Date()) + '-';
        		if(t.length > 500) {
        			t = t.substring(t.length-500);
        		}
        		window.store.set('receivedreplies', t);
            } catch(e){}
            this.pagination.jump(1);
        },
        "reload": function (requestData) {
            //清理上一次加载的原始数据
            this.list.lastOriginData = null;
            this.load(requestData);
        },
        "empty": function () {
            var items = this.items;
            var listEl = $('.fs-reply-list-inner', this.element);
            _.each(items, function (itemV) {
                itemV.destroy && itemV.destroy();
            });
            listEl.empty();
        },
        "destroy": function () {
            //搜索框销毁
            this._searchBarDestroy();
            //this.pagination.destroy();
//            _.each(this.paginations, function (pagination) {
    		this.pagination.destroy();
//            });
            this.pagination = {};
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