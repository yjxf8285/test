/**
 * 卡片式Feed回复组件
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var Widget = require('widget'),
        util = require('util'),
        moduleTpl = require('./reply.html'),
//        moduleStyle = require('./reply.css'),
        publish = require('modules/publish/publish'),
        moment = require('moment'),
        feedHelper = require('modules/feed-list/feed-list-helper.js'),
        AttachPreview = require('modules/fs-attach/fs-attach-preview'), //预览组件
        filePreview = require('modules/fs-attach/fs-attach-file-preview'), //文件阅读
        AudioPlayer = require('uilibs/audio-player'); //音频播放组件

    var moduleTplEl = $(moduleTpl),
        feedReplyTpl = moduleTplEl.filter('.feed-reply-tpl').html(), //主体模板
        inputBoxTplCompiled = _.template(moduleTplEl.filter('.feed-reply-input-tpl').html()),  //输入框模板
        replyItemTplCompiled = _.template(moduleTplEl.filter('.feed-reply-item-tpl').html());    //回复item模板
    var AtInput = publish.atInput,
        MediaMaker = publish.mediaMaker,
        formatContent = feedHelper.feedContentFormat_;//reply拼接;
    //设置预览组件
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件

    var contactData = util.getContactData(),
        loginUserData = contactData["u"];

    var FeedReply = Widget.extend({
        "attrs": {
            "feedData": {
                value: null,
                "getter": function (val) {
                    if (!val) {
                        return {
                            "feedID": 0,   //测试数据
                            "feedType": 1
                        };
                    }
                    return val;
                }
            },
            "className": "card-feed-reply",
            "pageSize": 10,   //一次加载回复数
            "showMainInput": true,    //默认显示主输入框
            "autoOpenMainInput": false,   //是否自动打开主输入框
            "title": "",    //title名
            "replyState": "plain" //plain/important  //回复状态，默认显示普通回复
        },
        "events": {
            "click .islike-btn": "sendIsLike",  //点击赞
            "click .reply-islike-tip .ico_page_prev": "likeTipPagePrev",
            "click .reply-islike-tip .ico_page_next": "likeTipPageNext",
            "mouseenter .islike-btn": "enterIsLike", // 赞的人员信息TIP 鼠标经过显示
            "mouseleave .islike-btn": "leaveIsLike", // 赞的人员信息TIP 鼠标离开隐藏
            "mouseenter .fn-btn-warp .reply-islike-tip": "enterIsTipLike",//鼠标经过显示
            "mouseleave .fn-btn-warp .reply-islike-tip": "leaveIsTipLike",//鼠标离开隐藏
            "click .islike-tip-more-btn": "moreTip",//更多赞列表
            "click .input-box .input-box-hidden": "_clickBoxHidden",  //点击隐藏输入框切换到显示状态
            "click .main-input .f-cancel": "_clickMainInputCancel",    //点击主输入框取消,
            "click .sub-input .f-cancel": "_clickSubInputCancel",    //点击子输入框取消
            "click .reply-item .open-reply-btn": "_clickOpenReplyBtn",    //点击二级回复框
            "click .load-more-l": "_clickLoadMore",   //点击加载更多
            "click .slide-up-l": "_clickSlideUp", //点击收起隐藏
            "click .input-box .f-sub": "_clickReplySubmit",   //点击发回复确定
            "click .employee-ranges": "_clickVisibleArrow", //点击新增范围箭头
            "click .reply-content-visible-h": "_clickReplyVisible",   //点击reply内容显隐控制
            "click .reply-content-img .img-item": "_clickImgItem",    //点击图片预览
            "click .reply-content-file .file-preview": "_clickFilePreview"  //点击附件预览
        },
        likeTipPagePrev: function (e) {
            var meEl = $(e.currentTarget);
            var isliketipEl = meEl.closest('.fn-btn-warp').find('.reply-islike-tip');
            var bottomInfoEl = $('.bottom-info', isliketipEl);
            var pageNumber = Number(bottomInfoEl.attr('pagenumber'));
            if (!meEl.is('.disable')) {
                this.reloadLikeTipData(isliketipEl, pageNumber - 1);
            }
        },
        likeTipPageNext: function (e) {
            var meEl = $(e.currentTarget);
            var isliketipEl = meEl.closest('.fn-btn-warp').find('.reply-islike-tip');
            var bottomInfoEl = $('.bottom-info', isliketipEl);
            var pageNumber = Number(bottomInfoEl.attr('pagenumber'));
            if (!meEl.is('.disable')) {
                this.reloadLikeTipData(isliketipEl, pageNumber + 1);
            }
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
        enterIsTipLike: function (e) {
            clearTimeout(this.attrs.likeTimer);
        },
        //鼠标离开TIP层隐藏
        leaveIsTipLike: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var delayhide = function (argument) {
                $('.reply-islike-tip').hide();
//                that.reloadLikeTipData(meEl, 1);//隐藏后把列表数据回到第1页
            };
            this.attrs.likeTimer = setTimeout(delayhide, 0);
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
            this.attrs.likeTimer = setTimeout(delayhide, 100);
        },
        // 赞的人员信息TIP 鼠标经过显示
        enterIsLike: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var islikeEl = meEl.closest('.fn-btn-warp');
            var isliketipEl = $('.reply-islike-tip', islikeEl);
            var likeMoreEl = $('.islike-tip-more-btn', islikeEl);
            var empidsEl = $('.js-empids', islikeEl);
            var bottomInfoEl = $('.bottom-info', islikeEl);
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
            isliketipEl.show();
            clearTimeout(this.attrs.likeTimer);
        },
        //提交赞
        sendIsLike: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var elEl = this.element;
            var itemEl = meEl.closest('.reply-item');
            var isliketipEl = meEl.closest('.fn-btn-warp').find('.reply-islike-tip');
            var feedID = elEl.closest('.fs-list-item').find('.item-face').attr('feedid');
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
        //更多赞列表
        moreTip: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var islikeEl = meEl.closest('.fn-btn-warp');
            var isliketipEl = $('.reply-islike-tip', islikeEl);
            var likeMoreEl = $('.islike-tip-more-btn', islikeEl);
            var bottomInfoEl = $('.bottom-info', islikeEl);
            var empidsEl = $('.js-empids', islikeEl);
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
            var islikeEl = $('.fn-btn-warp', itemEl);
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
                            if (islikeEl.children().is('.reply-islike-tip')) { //如果有提示框就添加内容没有就创建
                                $('.reply-islike-tip', islikeEl).html('<div class="toparrow"> <em>◆</em> <span>◆</span> </div><span class="list-warp">' + imgStr + '</span>' + morebtnStr + bottomInfoStr);
                                $('.reply-islike-tip', islikeEl).width(widthNum);
                            } else {
                                islikeEl.append('<div class="reply-islike-tip" pagenum="1" style="display:block;width: ' + widthNum + 'px"><div class="toparrow"> <em>◆</em> <span>◆</span> </div><span class="list-warp">' + imgStr + '</span>' + morebtnStr + bottomInfoStr + '</div>');
                            }
                            var likeMoreEl = $('.reply-islike-tip .islike-tip-more-btn', islikeEl);
                            //大于5个人隐藏后面并显示更多按钮
                            var empidsEl = $('.js-empids', islikeEl);
                            if (empidsEl.length > 8) {
                                empidsEl.show().eq(6).nextAll().hide();
                                likeMoreEl.show();
                            } else {
                                likeMoreEl.hide();
                                empidsEl.show();
                            }

                            isliketipEl.show();

                        } else {
                            likecountnumEl.html('').hide();
                            isliketipEl.remove();
                        }


                    }
                }
            });
        },
        setup: function () {
            var that = this;
            var result;
            result = FeedReply.superclass.setup.apply(this, arguments);
            this.$el = this.element;
            this._pageNumber = 0;  //请求回复列表页数内部算子
            this._totalCount = 0;   //存储请求回复列表的总数
            this._listPath = '/Feed/GetFeedReplysByFeedID';  //回复列表请求地址，默认请求普通回复列表
            this._replyState = 'plain';   //默认在普通回复列表状态
            return result;
        },
        /**
         * 设置输入框默认内容
         */
        _setInputDefaultValue: function (inputBoxSelector) {
            var inputBoxEl = $(inputBoxSelector),
                inputEl = $('.reply-input', inputBoxEl),
                replyItemEl = inputBoxEl.closest('.reply-item'),
                replyItemData;
            inputEl = $('.reply-input', inputBoxEl);
            //设置默认textarea内容
            if (replyItemEl.length > 0) {  //子回复
                replyItemData = replyItemEl.data('originData');
                inputEl.val("回复@" + replyItemData.sender.name + "：");
            } else {  //主回复
                inputEl.val("");
            }
            //焦点定位到输入框,光标位于输入框最后
            util.setCursorPositionEnd(inputEl);
            inputEl.trigger('autosize.resize'); //textarea auto size手动赋值后要手动触发resize事件
        },
        _clickVisibleArrow: function (evt) {
            var rangesEl = $('.employee-ranges', this.element),
                arrowEl = $('.visible-arrow', rangesEl),
            rangesContentEl=$('.employee-ranges-content', this.element);
//            console.info(rangesContentEl.height())  todo: bug-1406 如何判断固定高度的div什么时候文字是溢出状态？
            if (arrowEl.hasClass('visible-arrow-down')) {
                if (!rangesEl.data('originHeight')) {
                    rangesEl.data('originHeight', rangesEl.height());
                }
                rangesEl.css("height", "auto");
                arrowEl.removeClass('visible-arrow-down').addClass('visible-arrow-up');
                rangesEl.removeClass('employee-ranges-ellipsis');
                if (rangesEl.height() - rangesEl.data('originHeight') < 4) {
                    rangesEl.height(19);
                }
            } else {
                rangesEl.css("height", rangesEl.data('originHeight') + "px");
                arrowEl.removeClass('visible-arrow-up').addClass('visible-arrow-down');
                rangesEl.addClass('employee-ranges-ellipsis');
            }
        },
        /**
         * 点击主因仓库
         * @param evt
         * @private
         */
        _clickBoxHidden: function (evt) {
            var boxHiddenEl = $(evt.currentTarget),
                inputBoxEl = boxHiddenEl.closest('.input-box');
            //先隐藏其他输入框
            this._hideAllInputBox();
            //切换主输入框到显示状态
            this.switchInputState(inputBoxEl, "shown");
            this._setInputDefaultValue(inputBoxEl);
        },
        _clickMainInputCancel: function (evt) {
            var boxHiddenEl = $(evt.currentTarget);
            this.switchInputState(boxHiddenEl.closest('.input-box'), "hidden");
        },
        _clickSubInputCancel: function (evt) {
            var boxHiddenEl = $(evt.currentTarget);
            boxHiddenEl.closest('.input-box').hide();
        },
        _clickOpenReplyBtn: function (evt) {
            var meEl = $(evt.currentTarget),
                replyItemEl = meEl.closest('.reply-item'),
                reply2ReplyEl = $('.reply-to-reply', replyItemEl),
                inputBoxEl = $('.input-box', reply2ReplyEl);
            //先隐藏其他输入框
            this._hideAllInputBox();

            if (inputBoxEl.length == 0) {
                this._renderInputBox(reply2ReplyEl, 'sub');
                inputBoxEl = $('.input-box', reply2ReplyEl);
                //切换到显示状态
                this.switchInputState(inputBoxEl, 'shown');
                this._setInputDefaultValue(inputBoxEl);
            } else {
                if (inputBoxEl.is(":visible")) {
                    inputBoxEl.hide();
                } else {
                    inputBoxEl.show();
                    //切换到显示状态
                    this.switchInputState(inputBoxEl, 'shown');
                    this._setInputDefaultValue(inputBoxEl);
                }
            }
        },
        /**
         * 点击加载更多
         * @param evt
         * @private
         */
        _clickLoadMore: function (evt) {
            this.fetchList(null,true);
        },
        _clickSlideUp: function () {
            //滚动条回滚
            var that = this;
            var winEl = $(window);
            winEl.scrollTop(winEl.scrollTop() - that.element.height());
            //隐藏列表
            this.hide();
        },
        /**
         * 点击发回复按钮
         * @param evt
         * @private
         */
        _clickReplySubmit: function (evt) {
            var boxEl = $(evt.currentTarget).closest('.input-box');
            this.reply(boxEl);
            evt.preventDefault();
        },
        _clickReplyVisible: function (evt) {
            var meEl = $(evt.currentTarget),
                replyItemEl = meEl.closest('.reply-item');
            var originData = replyItemEl.data('originData'),
                replyFormatContent = originData["replyFormatContent"];
            var summaryContentEl = $('.reply-summary-text', replyItemEl),
                leftContentEl = $('.reply-left-text', replyItemEl),
                visibleEl = $('.reply-content-visible-h', replyItemEl),
                ellipsisEl = $('.reply-content-ellipsis', replyItemEl);
            if (leftContentEl.length == 0) { //第一次点击时创建剩余内容
                leftContentEl = $('<span class="reply-left-text">' + replyFormatContent.leftHtml + '</span>');
                leftContentEl.insertAfter(summaryContentEl);
                visibleEl.text('收起正文');
                ellipsisEl.hide();
            } else {
                if (leftContentEl.is(':visible')) {
                    leftContentEl.hide();
                    visibleEl.text('展开正文，（共' + replyFormatContent.feedWordNum + '个字）');
                    ellipsisEl.show();
                } else {
                    leftContentEl.show();
                    visibleEl.text('收起正文');
                    ellipsisEl.hide();
                }
            }
            evt.preventDefault();
        },
        /**
         * 点击图片预览
         * @private
         */
        _clickImgItem: function (evt) {
            var meEl = $(evt.currentTarget),
                replyItemEl = meEl.closest('.reply-item'),
                attachID = meEl.attr('attachid'),
                originData = replyItemEl.data("originData"),
                pictures = originData.pictures,
                previewData = [],
                activeIndex = -1;
            _.each(pictures, function (picture, i) {
                previewData[i] = {
                    "source": 2,//soure:信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                    "refId": originData.feedReplyID || 0,
                    "previewPath": picture.attachPath + '2',
                    "originPath": picture.attachPath + '1',
                    "thumbPath": picture.attachPath + '3',
                    "createTime": picture.createTime,
                    "fileName": picture.attachName,
                    "fileSize": picture.attachSize
                };
                if (picture.attachID == attachID) {
                    activeIndex = i;
                }
            });
            // 调用预览方法
            attachPreviewer.preview({
                "type": "img",
                "data": previewData,
                //                "refId": originData.feedID,
                "refId": originData.feedReplyID,
                "belongToType": "reply",
                "activeIndex": activeIndex
            });
            evt.preventDefault();
        },
        /**
         * 点击附件预览
         * @private
         */
        _clickFilePreview: function (evt) {
            var meEl = $(evt.currentTarget),
                fileItemEl = meEl.closest('.file-item'),
                replyItemEl = meEl.closest('.reply-item'),
                attachId = fileItemEl.attr('attachid'),
                originData = replyItemEl.data("originData"),
                files = originData.files,
                fileData;
            fileData = _.find(files, function (itemData) {
                return itemData.attachID == attachId;
            });
            fileReader.readFile({
                "fileId": fileData.attachID,
                "fileName": fileData.attachName,
                "filePath": fileData.attachPath
            });
            evt.preventDefault();
        },
        /**
         * 隐藏所有的输入框
         * @private
         */
        _hideAllInputBox: function () {
            var elEl = this.element,
                inputBoxEl = $('.input-box', elEl);
            inputBoxEl.filter(':visible').each(function () {
                $('.f-actions .f-cancel', this).click();
            });
        },
        _initInputCpt: function (boxSelector) {
            var boxEl = $(boxSelector),
                boxShownEl = $('.input-box-shown', boxEl),
                replyInputEl = $('.reply-input', boxShownEl),
                mediaEl = $('.media', boxShownEl);
            //输入框at功能

            var atInput = new AtInput({
                "element": replyInputEl
            });
            var media;
            var feedType=this.get("feedData").feedType;
            //如果是CRM环境
            if (feedType == 2003) {//2003代表为群通知类型
                media = new MediaMaker({
                    "element": mediaEl,
                    "action": ["h5imgupload", "h5attachupload"]
                });
            } else {
                media = new MediaMaker({
                    "element": mediaEl,
                    "action": ["h5imgupload", "h5attachupload", "at"],
                    "actionOpts": {
                        "at": {
                            "inputSelector": replyInputEl
                        }
                    }
                });
            }

            //保留引用供以后删除
            mediaEl.data('media', media);
            //placeholder
            util.placeholder(replyInputEl);
            //禁用esc键
            replyInputEl.keydown(function (evt) {
                if (evt.keyCode == 27) {
                    evt.preventDefault();
                }
            });
            //保留引用供以后删除
            replyInputEl.data('atInput', atInput);
            mediaEl.data('media'.media);
            boxEl.data('isInit', true);  //初始化完成，防止多次初始化
        },
        /**
         * 渲染输入框组件
         * @param boxType main或者sub
         * @private
         */
        _renderInputBox: function (wSelector, boxType) {
            var wEl = $(wSelector);
            boxType = boxType || "main";
            wEl.html(inputBoxTplCompiled({
                "loginUserAvatar": util.getAvatarLink(loginUserData.profileImagePath, 3)
            }));
            $('.input-box', wEl).addClass(boxType + '-input');
            if (boxType == "main") {
                $('.input-box', wEl).addClass('main-input-with-pt');
            }
        },
        /**
         * 生成一条reply item dom
         * @param replyData
         * @param serviceTime
         * @returns {*|jQuery}
         * @private
         */
        _createReplyItem: function (replyData, serviceTime) {
            var replyItemEl,
                audioWEl,
                imgWEl,
                fileWEl;
            var feedData = this.get('feedData');
            var replyFormatContent = formatContent(300, {
                "replyContent": replyData.replyContent
            }), pictures, files, audio, audioPlayer;
            var htmlStr = '',
                replySource = util.getSourceNameFromCode(replyData.source);
            var compiledData = {
                "blankImgSrc": FS.BLANK_IMG,
                "approveActionCls": "",
                "replyStateDesc": "",
                "employeeAvatar": util.getAvatarLink(replyData.sender.profileImage, 3),
                "employeeID": replyData.sender.employeeID,
                "employeeName": replyData.sender.name,
                "replyFormatContent": replyFormatContent,
                "createTime": util.getDateSummaryDesc(moment.unix(replyData.createTime), moment.unix(serviceTime), 1)
            };
            if (replySource == "纷享销客" || replySource == "未知") {
                replySource = "";
            }
            compiledData["replySource"] = replySource;

            if (feedData["feedType"] == 4) {    //审批
                if (replyData["operationType"] == 1) {
                    compiledData["approveActionCls"] = "approve-agree-icon";
                } else if (replyData["operationType"] == 2) {
                    compiledData["approveActionCls"] = "approve-disagree-icon";
                }
                compiledData["replyStateDesc"] = util.getApproveOperationTypeName(replyData["operationType"]);
            } else if (feedData["feedType"] == 3) {  //指令
                compiledData["replyStateDesc"] = util.getWorkOperationTypeName(replyData["operationType"]);
            } else if (feedData["feedType"] == 2) {  //日志
                compiledData["replyStateDesc"] = util.getPlanOperationType(replyData["operationType"]);
            }
            /* 赞 */
            var likeCount = replyData.like.likeCount;
            var isAlreadyLike = replyData.isAlreadyLike;
            var islikeStr = '';
            var islikeTitStr = '取消赞';
            var islikeCurStr = 'cur';
            var islikeCountStr = '(<span class="likecountnum">' + likeCount + '</span>)';
            var likeEmployees = replyData.like.likeEmployees;
            var disableClass = '';
            if (likeCount > 32) {
                disableClass = '';
            } else {
                disableClass = 'disable';
            }
            var bottomInfoStr = '<div class="bottom-info fn-clear fn-hide" pagenumber="1"><div class="l"><span class="count-number">' + replyData.like.likeCount + '</span>个人赞过</div><div class="r"><em class="ico_page_prev disable"><</em>&nbsp;&nbsp;<em class="ico_page_next ' + disableClass + '">></em></div></div>';
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
            islikeStr = '<span title="'+islikeTitStr+'" class="islike-btn aj-reply-fn-com-btn ' + islikeCurStr + '" title="' + islikeTitStr + '"><b></b> <a class="reply-likecount ' + hideStr + '" href="javascript:void(0);">' + islikeCountStr + '</a> </span> <i class="S_txt3">|</i>' + contentStr;


            compiledData.islike = islikeStr;
            compiledData.feedReplyID = replyData.feedReplyID;
            replyItemEl = $(replyItemTplCompiled(compiledData)).data('originData', _.extend(replyData, {
                "replyFormatContent": replyFormatContent
            }));
            //录音渲染
            audio = replyData.audio;
            if (audio) {
                audioWEl = $('.reply-content-audio', replyItemEl);
                htmlStr = '<div class="audio-player"></div>';
                audioWEl.html(htmlStr);
                audioPlayer = new AudioPlayer({
                    "element": $('.audio-player', audioWEl), //容器
                    "audioSrc": util.getDfLink(util.getFileNamePath(audio.attachPath) + '.mp3', audio.attachName, false), //录音文件地址
                    "length": audio.attachSize, //长度
                    "themeStyle": 4 //皮肤类型
                });
                $('.player-icon').removeClass('mc-pause').addClass('mc-play'); //移除其他播放按钮的播放中样式
                //设置存储引用
                replyItemEl.data('audioPlayer', audioPlayer);
            }
            //图片渲染
            pictures = replyData.pictures;
            if (pictures && pictures.length > 0) {
                imgWEl = $('.reply-content-img', replyItemEl);
                htmlStr = '<ul class="img-list fn-clear">';
                _.each(pictures.slice(0, 5), function (itemData) {
                    htmlStr += '<li class="img-item fn-left" attachid="' + itemData.attachID + '"><img src="' + util.getDfLink(itemData.attachPath + '3', itemData.attachName, false, itemData.fileIcon) + '" alt="' + itemData.attachName + '" /></li>';
                });
                if (pictures.length > 6) {
                    htmlStr += '<li class="img-item img-more fn-left" attachid="' + pictures[5].attachID + '"><span class="more-tip">更多' + (pictures.length - 5) + '张</span></li>';
                } else if (pictures.length == 6) {
                    htmlStr += '<li class="img-item fn-left" attachid="' + pictures[5].attachID + '"><img src="' + util.getDfLink(pictures[5].attachPath + '3', pictures[5].attachName, false, pictures[5].fileIcon) + '" alt="' + pictures[5].attachName + '" /></li>';
                }
                htmlStr += '</ul>';
                imgWEl.html(htmlStr);
            }
            //附件渲染
            files = replyData.files;
            if (files && files.length > 0) {
                fileWEl = $('.reply-content-file', replyItemEl);
                htmlStr = '<ul class="file-list fn-clear">';
                var aAttachIDs = [];
                _.each(files, function (itemData) {
                    var attachName;
                    try {
                        attachName = decodeURIComponent(itemData.attachName);
                    } catch (ex) {
                        attachName = itemData.attachName;
                    }
                    htmlStr += '<li class="file-item fn-left" attachid="' + itemData.attachID + '">' +
                        '<div class="file-item-inner fn-clear">' +
                        '<img src="' + FS.BLANK_IMG + '" alt="icon" class="fs-attach-' + util.getFileType({"name": itemData.attachName}, true) + '-icon file-icon fn-left" />' +
                        '<div class="file-content fn-left"><div class="file-name">' + attachName + '（' + util.getFileSize(itemData.attachSize) + '）</div>' +
                        '<div class="file-actions"><a href="' + util.getDfLink(itemData.attachPath, itemData.attachName, true) + '" class="file-download" target="_blank">下载</a>';
                    if (itemData.canPreview) {
                        htmlStr += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" class="file-preview">预览</a>';
                    }
                    htmlStr += '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                    aAttachIDs.push(itemData.attachID);
                });
                htmlStr += '</ul>';
                var attachIDs = aAttachIDs.join('|');
                var downAllLink = FS.API_PATH + '/df/GetBatchFiles1?dataID=' + replyData.feedReplyID + '&source=2';

                if (files.length > 1) {
                    //拼串方式下载
                    /*  htmlStr+='<a class="batch-download-l" href="'+FS.API_PATH+'/df/GetBatchFiles?ids='+ _.map(files,function(fileData){
                     return fileData.attachPath;
                     }).join('|')+'&names='+_.map(files,function(fileData){
                     return encodeURIComponent(fileData.attachName);
                     }).join('|')+'" target="_blank"><img src="'+FS.BLANK_IMG+'" alt=""/></a>';*/

                    htmlStr += '<a class="batch-download-l" href="' + downAllLink + '" target="_blank"><img src="' + FS.BLANK_IMG + '" alt=""/></a>';


                }
                fileWEl.html(htmlStr);
            }
            return replyItemEl;
        },
        /**
         * 渲染回复item
         * @private
         */
        _renderList: function (itemDatas, serverTime) {
            var that = this;
            var elEl = this.element,
                mainInputEl = $('.main-input', elEl),
                replyListEl = $('.reply-list', elEl);
            if (itemDatas.length > 0) {
                replyListEl.show();
            } else {
                replyListEl.hide();
            }
            _.each(itemDatas, function (itemData) {
                that._createReplyItem(itemData, serverTime).appendTo(replyListEl);
            });
            if (itemDatas.length == 0 && this.get('showMainInput')) {  //回复数为0，自动打开主回复框
                this.switchInputState($('.main-input', elEl), 'shown');
            }
            //控制main input和reply list边距
            if (itemDatas.length > 0 && this.get('showMainInput')) {
                mainInputEl.removeClass('main-input-with-pt');
            } else {
                mainInputEl.addClass('main-input-with-pt');
            }
        },
        _renderSelf: function () {
            var elEl = this.element;
            elEl.html(feedReplyTpl);
        },
        /**
         * 更新状态栏显示
         * @param totalCount
         * @private
         */
        _updateReplyListStatus: function (totalCount) {
            var elEl = this.element,
                replyListEl = $('.reply-list', elEl),
                statusBbarEl = $('.reply-list-status-bar', elEl);  //回复列表状态栏
            var pageSize = this.get('pageSize'),
                pageNumber = this._pageNumber,
                expectRecordNum = pageNumber * pageSize;
            if (expectRecordNum >= totalCount) {   //表示已经加载完毕
                statusBbarEl.html('<a href="javascript:;" class="slide-up-l">全部收起</a>');
            } else {
                statusBbarEl.html('<span class="leave-tip">还有&nbsp;<span class="leave-num">' + (totalCount - expectRecordNum) + '</span>&nbsp;条回复</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" class="load-more-l">加载更多</a>');
            }
            if (totalCount > 0) {
                if (totalCount > pageSize) { //只有总回复数大于pageSize才显示
                    statusBbarEl.show();
                } else {
                    statusBbarEl.hide();
                }
                replyListEl.show();
            } else {
                statusBbarEl.hide();
                replyListEl.hide();
            }
        },
        /**
         * 更新回复范围
         * @param isShown 控制范围显隐状态，默认为显示状态
         * @param originData 可选择携带范围数据
         * @private
         */
        _updateReplyRanges: function (isShown, originData) {
            var that = this;
            var feedData = this.get('feedData');
            var elEl = this.element,
                employeeRangesEl = $('.employee-ranges', elEl),
                contentEl = $('.employee-ranges-content', employeeRangesEl);
            var renderRanges = function (originData) {
                var addEmployees = originData,
                    employeeNums;
                employeeNums = addEmployees.length;
                if (employeeNums > 0) {
                    contentEl.html('新增同事范围' + employeeNums + '人：' + addEmployees.join('、') + '。');
                    employeeRangesEl.show();
                } else {
                    employeeRangesEl.hide();
                }
            };
            if (this._replyState == "important") {  //关键回复下不显示新增范围
                employeeRangesEl.hide();
                return;
            }
            if (isShown !== false) {
                if (!originData) {
                    util.api({
                        "url": "/Feed/GetAddAtEmpRanges",
                        "data": {
                            "feedID": feedData["feedID"],
                            "isGetRangeData": true
                        },
                        "success": function (responseData) {
                            var dataRoot;
                            if (responseData.success) {
                                dataRoot = responseData.value;
                                renderRanges(dataRoot.addEmployees);
                                //触发新增可视范围事件
                                that.trigger('addatrange', dataRoot);
                            }
                        }
                    });
                } else {
                    renderRanges(originData);
                }

            } else {
                employeeRangesEl.hide();
            }
        },
        render: function () {
            var elEl = this.element,
                mainInputEl,
                titleEl;
            var result = FeedReply.superclass.render.apply(this, arguments);
            this._renderSelf();
            //渲染主输入框
            this._renderInputBox($('.reply-header', elEl));
            mainInputEl = $('.main-input', elEl);
            //处理主输入框的默认可见性
            if (this.get('showMainInput')) {
                mainInputEl.show();
            } else {
                mainInputEl.hide();
            }
            //设置默认标题
            titleEl = $('.reply-title', elEl);
            titleEl.text(this.get('title'));
            if (this.get('title').length > 0) {
                titleEl.show();
            } else {
                titleEl.hide();
            }
            this.rendered = true;
            return result;
        },
        show: function () {
            var elEl = this.element;
            if (!this.rendered) {
                this.render();
            }
            //判断是否自动打开主输入框
            if (this.get('showMainInput') && this.get('autoOpenMainInput')) {
                this.switchInputState($('.main-input', elEl), "shown");
            }
            elEl.show();
            //触发show事件
            this.trigger('show');
            //show后默认加载第一页
            //this.fetchList();
            //更新员工范围显示
            //this._updateReplyRanges();
        },
        hide: function (withAnimate, callback) {
            var that = this;
            var elEl = this.element,
                employeeRangesEl = $('.employee-ranges', elEl),
                contentEl = $('.employee-ranges-content', employeeRangesEl);
            if (!withAnimate) {
                elEl.hide();
            } else {
                elEl.slideUp('normal', function () {
                    callback && callback.call(that, that.element);
                });
            }
            //隐藏后默认清空回复列表
            this.emptyList();
            //主输入框切换到hidden状态
            this.switchInputState($('.main-input', this.element), 'hidden');
            //清空范围列表
            contentEl.empty();
            employeeRangesEl.hide();

            //触发hide事件
            this.trigger('hide');
        },
        /**
         * 清空列表
         */
        emptyList: function () {
            var elEl = this.element,
                replyListEl = $('.reply-list', elEl);
            $('.reply-item', replyListEl).each(function () {
                var itemEl = $(this),
                    reply2ReplyEl = $('.reply-to-reply', itemEl),
                    boxShownEl = $('.input-box-shown', reply2ReplyEl),
                    replyInputEl = $('.reply-input', boxShownEl),
                    mediaEl = $('.media', boxShownEl);
                if (replyInputEl.length > 0) {
                    replyInputEl.data('atInput').destroy();
                    mediaEl.data('media').destroy();
                    replyInputEl.removeData();
                    mediaEl.removeData();
                }
                itemEl.data('audioPlayer') && itemEl.data('audioPlayer').destroy();
                itemEl.removeData();
            });
            replyListEl.empty().hide();
            this._pageNumber = 0;
        },
        /**
         * 切换主输入框的状态
         * @param state
         */
        switchInputState: function (boxSelector, state) {
            var boxEl = $(boxSelector),
                boxShownEl = $('.input-box-shown', boxEl),
                boxHiddenEl = $('.input-box-hidden', boxEl),
                replyBodyEl = $('.reply-body', this.element);
            state = state || "shown";
            if (state == "shown") {
                boxShownEl.show();
                boxHiddenEl.hide();
                //input组件懒初始化
                if (!boxEl.data('isInit')) {
                    this._initInputCpt(boxEl);
                }
                $('.reply-input', boxShownEl)[0].focus();
            } else {
                boxShownEl.hide();
                boxHiddenEl.show();
            }
        },
        /**
         * 获取输入框的状态
         * @param boxSelector
         */
        getInputState: function (boxSelector) {
            var boxEl = $(boxSelector),
                boxShownEl = $('.input-box-shown', boxEl);
            return boxShownEl.is(':visible') ? "shown" : "hidden";
        },
        showLoading: function () {
            var elEl = this.element,
                replyLoadingEl = $('.reply-loading', elEl);
            replyLoadingEl.show();
        },
        hideLoading: function () {
            var elEl = this.element,
                replyLoadingEl = $('.reply-loading', elEl);
            replyLoadingEl.hide();
        },
        /**
         * 是否从feed中提取回复列表
         * @param fromFeed 是否从feed中提取关键回复的数据
         */
        fetchList:function(fromFeed,loadMore){
            var that=this;
            var listPath=this._listPath,
                feedData=this.get('feedData'),
                pageSize=this.get('pageSize'),
                pageNumber=this._pageNumber+ 1,
                replies;
            var elEl = this.element,
                statusBbarEl = $('.reply-list-status-bar', elEl);  //回复列表状态栏
            var lastFeedReplyID=this.get('lastFeedReplyID')||0;
            var maxID=this.get('maxID')||0;

            if(!loadMore){//只有点击加载更多的时候才做处理
                lastFeedReplyID=0;
                maxID=0;
            }
            this.showLoading();
            if (!!fromFeed) {
                replies = feedData.replies;
                //页数加1
                this._pageNumber = pageNumber;
                //渲染列表
                this._renderList(replies.slice((pageNumber - 1) * pageSize, pageSize), feedData.serviceTime);
                this.hideLoading();
                //更新回复列表状态栏显示
                this._updateReplyListStatus(replies.length);
                //重设回复总数并触发replycount事件
                this._totalCount = replies.length;
                this.trigger('replycount', that._totalCount, that._replyState);
            } else {

                util.api({
                    "url":listPath,
                    "type":"post",
                    "data":{
                        "feedID":feedData.feedID,
                        "lastFeedReplyID":lastFeedReplyID,
                        "maxID":maxID,
                        "pageNumber":pageNumber,
                        "pageSize":pageSize
                    },
                    "success": function (responseData) {
                        var dataRoot;
                        var items=responseData.value.items;
                        var lastFeedReplyID,maxID;
                            if(responseData.success){
                            (items.length>0) && (lastFeedReplyID=_.last(items)['feedReplyID']);
                            maxID=responseData.value.maxID||0;
                            that.set('lastFeedReplyID',lastFeedReplyID);
                            that.set('maxID',maxID);

                            dataRoot=responseData.value;
                            //页数加1
                            that._pageNumber = pageNumber;
                            //渲染列表
                            that._renderList(dataRoot.items, responseData.serviceTime);
                            //更新回复列表状态栏显示
                            that._updateReplyListStatus(dataRoot.totalCount);
                            //更新范围显示
                            that._updateReplyRanges(true, dataRoot.addEmployees);
                            //重设回复总数并触发replycount事件
                            that._totalCount = dataRoot.totalCount;
                            that.trigger('replycount', that._totalCount, that._replyState);
                        }
                    },
                    "complete": function () {
                        that.hideLoading();
                    }
                }, {
                    "mask": statusBbarEl,
                    "abortLast": true    //自动中断上一条请求
                });
            }
        },
        /**
         * 重刷回复列表
         */
        refreshList: function () {
            this.emptyList();
            //重新请求
            this.fetchList();
        },
        /**
         * 发回复验证
         * @param boxSelector
         * @returns {boolean}
         */
        replyValid: function (boxSelector) {
            var boxEl = $(boxSelector),
                inputEl = $('.reply-input', boxEl),
                requestData = this.getReplyRequestData(boxSelector);
            var passed = true;
            if (requestData['replyContent'].length == 0) {
                //util.showInputError(inputEl.closest('.input-wrapper'));
                util.showInputError(inputEl.parent());
                passed = false;
                return passed;
            }
            if (requestData['replyContent'].length > 2000) {
                util.alert('发送内容不超过2000字，目前已超出<em>' + (requestData['replyContent'].length - 2000) + '</em>个字');
                passed = false;
                return passed;
            }
            return passed;
        },
        _getReplyRequestDataExt: function () {
            var feedData = this.get('feedData'),
                requestData = {};
            requestData = _.extend(requestData, {
                "feedID": feedData["feedID"],
                "fbrType": feedData["fbrType"],
                "isSendSms": false,  //默认不发送短信
                "feedType": feedData["feedType"]
            });
            //如果是审批或者指令的回复
            if (feedData["feedType"] == 3) { //指令
                requestData = _.extend(requestData, {
                    "feedSenderID": feedData["employeeID"],
                    "feedReceiverID": feedData["work"]["executerID"]
                });
            } else if (feedData["feedType"] == 4) { //审批
                requestData = _.extend(requestData, {
                    "feedSenderID": feedData["employeeID"],
                    "feedReceiverID": feedData["approve"]["currentApproverID"]
                });
            }
            return requestData;
        },
        getReplyRequestData: function (boxSelector) {
            var boxEl = $(boxSelector),
                replyItemEl = boxEl.closest('.reply-item'),
                inputEl = $('.reply-input', boxEl),
                mediaEl = $('.media', boxEl),
                media = mediaEl.data('media'),
                requestData = {},
                files;
            var feedData = this.get('feedData'),
                replyOriginData,
                attachTypeNames = []; //上传附件类型
            //回复内容
            requestData["replyContent"] = _.str.trim(inputEl.val());
            //上传文件信息
            requestData["fileInfos"] = [];
            files = media.getUploadValue();
            _.each(files, function (file) {
                if (file.uploadType == "img") {
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1": file.pathName, //服务器端文件名
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1": file.pathName, //服务器端文件名
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name //文件原名
                    });
                }
            });
            //有上传图片或者附件时，内容可以为空,否则必须填内容
            if (requestData.fileInfos.length > 0) {
                if (requestData['replyContent'].length == 0) {
                    attachTypeNames = util.getAttachTypeName(requestData.fileInfos);
                    if (attachTypeNames.length > 0) {
                        if (attachTypeNames.length > 2) { //三个分类或以上用顿号分割
                            requestData['replyContent'] = '回复' + attachTypeNames.join('、');
                        } else if (attachTypeNames.length > 1) { //两个用"和"
                            requestData['replyContent'] = '回复' + attachTypeNames.join('和');
                        } else { //一个直接输出
                            requestData['replyContent'] = '回复' + attachTypeNames[0];
                        }
                    }
                }
            }
            //如果是回复的回复
            if (replyItemEl.length > 0) {
                replyOriginData = replyItemEl.data('originData');
                requestData = _.extend(requestData, {
                    "replyToReplyID": replyOriginData["feedReplyID"],
                    "replyToEmployeeID": replyOriginData["employeeID"]
                });
            }
            //设置和feed相关的额外信息
            requestData = _.extend(requestData, this._getReplyRequestDataExt());

            return requestData;
        },
        clearReply: function (boxSelector) {
            var boxEl = $(boxSelector),
                boxShownEl = $('.input-box-shown', boxEl),
                mediaEl = $('.media', boxShownEl);
            var media = mediaEl.data('media');
            this._setInputDefaultValue(boxSelector);
            media && media.resetAll();
            if (boxEl.hasClass('main-input')) {
                //主回复发送成功后切换到hidden状态
                this.switchInputState(boxEl, 'hidden');
            } else if (boxEl.hasClass('sub-input')) {
                //子回复发送成功后直接关闭
                boxEl.hide();
            }
        },
        /**
         * 发送回复
         */
        reply: function (boxSelector, defaultRequestData) {
            var that = this;
            var requestData;
            var mediaEl,
                media;
            var boxEl = $(boxSelector),
                inputEl = $('.reply-input', boxEl),
                subBtnEl = $('.f-sub', boxEl);
            var atContents;

            if (this.replyValid(boxSelector)) {
                mediaEl = $('.media', boxEl);
                media = mediaEl.data('media');
                media.send(function (sendCb, sendModal) {
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
                                    that.clearReply(boxSelector);
                                    if (that._replyState == "plain") {
                                        //前追回复
                                        that.prependItem(responseData.value);
                                        //更新员工范围显示
                                        that._updateReplyRanges();
                                    } else if (that._replyState == "important") {
                                        that.switchReplyState("plain"); //切换到普通回复状态
                                    }
                                    //触发reply事件
                                    that.trigger('reply', responseData, requestData);
                                }
                                sendCb(); //清理
                                $('.fs-guide-shadow-link').click();//回复成功之后就触发回执按钮的点击事件

                            },
                            "error": function(){
                            	sendCb(); //清理
                            	util.alert('系统繁忙，请稍后重试。');
                            }
                        }, {
                            "submitSelector": subBtnEl
                        });
                    };
                    //保证获取完整的fileInfos信息
                    requestData = that.getReplyRequestData(boxSelector);
                    requestData = _.extend(requestData, defaultRequestData || {});

                    //获取at内容
                    atContents = util.getAtFromInput(inputEl);

                    //如果是CRM环境 把at人去掉
                    var feedType=that.get("feedData").feedType;
                    //如果是CRM环境
                    if (feedType == 2003) {//2003代表为群通知类型
                        atContents = '';
                    }

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
                }, $('.box-r', boxEl));
            }
        },
        /**
         * 带请求数据的回复提交
         * @param requestData
         * @param opts 额外配置
         */
        replyWithData: function (requestData, opts) {
            var that = this;
            var atContents;
            opts = _.extend({
                "mediaSendCb": FS.EMPTY_FN,
                "sendClearCb": FS.EMPTY_FN,
                "mediaSendModal": null,
                "subBtnSelector": null
            }, opts || {});
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
                            if (that._replyState == "plain") {
                                //前追回复
                                that.prependItem(responseData.value);
                                //更新员工范围显示
                                that._updateReplyRanges(true);
                            } else if (that._replyState == "important") {
                                that.switchReplyState("plain"); //切换到普通回复状态
                            }
                            //发布清空
                            opts.sendClearCb.call(this, responseData);
                            //触发reply事件
                            that.trigger('reply', responseData, requestData);
                        }
                        opts.mediaSendCb(); //清理
                    },
                    "error": function(){
                    	opts.mediaSendCb(); //清理
                    	util.alert('系统繁忙，请稍后重试。');
                    }
                }, {
                    "submitSelector": opts.subBtnSelector
                });
            };
            //设置和feed相关的额外信息
            requestData = requestData || {};
            requestData = _.extend(requestData, this._getReplyRequestDataExt());
            //获取at内容
            atContents = util.getAtFromContent(requestData.replyContent);
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
                                        opts.mediaSendModal && $(opts.mediaSendModal).hide();
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
        },
        /**
         * prepend一个新回复item
         * @param replyId
         */
        prependItem: function (replyId) {
            var that = this;
            var feedData = this.get('feedData'),
                requestData = {
                    "feedID": feedData.feedID,
                    "feedReplyID": replyId,
                    "feedType": feedData.feedType
                };
            var elEl = this.element,
                replyListEl = $('.reply-list', elEl);
            util.api({
                type: 'get',
                data: requestData,
                url: "/Feed/GetFeedReplyByID",
                success: function (responseData) {
                    var items;
                    if (responseData.success) {
                        items = responseData.value.items;
                        if (items.length > 0 && replyListEl.is(':hidden')) {
                            replyListEl.show();
                        }
                        _.each(items, function (itemData) {
                            that._createReplyItem(itemData, responseData.serviceTime).prependTo(replyListEl);
                        });
                        //重设回复总数并触发replycount事件
                        that._totalCount = that._totalCount + items.length;
                        that.trigger('replycount', that._totalCount, that._replyState);
                    }
                }
            });
        },
        /**
         * 提供给外界调用者，切换关键回复与普通回复状态
         * @param replyState  plain/important
         * @param collectDataInFeed 是否从feed里收集数据，只针对关键回复
         */
        switchReplyState: function (replyState, collectDataInFeed) {
            var feedData = this.get('feedData'),
                feedType = feedData["feedType"];
            var elEl = this.element,
                titleEl = $('.reply-title', elEl);
            if (elEl.is(':hidden')) {
                this.show();   //保证处于显示状态
            }
            if (replyState == "important") {
                if (feedType == 2 || feedType == 3 || feedType == 4) {   //只有日志、指令和审批才有关键回复
                    //设置请求回复列表地址
                    this._listPath = '/Feed/GetFeedKeyReplysByFeedID';
                    //设置主回复框隐藏
                    this.set('showMainInput', false);
                }
                //关键回复下显示title
                titleEl.show();
                //设置可视范围不可见
                this._updateReplyRanges(false);
            } else if (replyState == "plain") {
                //设置请求回复列表地址
                this._listPath = '/Feed/GetFeedReplysByFeedID';
                //设置主回复框显示
                this.set('showMainInput', true);
                //设置可视范围可见
                this._updateReplyRanges(true);
                //普通回复下不显示title
                titleEl.hide();
            }
            //列表数据刷新
            this.emptyList();
            this.fetchList(collectDataInFeed);
            //更新状态
            this._replyState = replyState;
            //触发replystate事件
            this.trigger('replystate', replyState);
        },
        /**
         * 获取当前状态
         */
        getReplyState: function () {
            return this._replyState;
        },
        _onChangeShowMainInput: function (isVisible) {
            var elEl = this.element,
                mainInputEl = $('.main-input', elEl),
                replyListEl = $('.reply-list', elEl);
            isVisible ? mainInputEl.show() : mainInputEl.hide();
            if (isVisible && this.get('autoOpenMainInput')) {
                this.switchInputState($('.main-input', elEl), "shown");
            }
            if (isVisible && replyListEl.is(':visible')) {
                mainInputEl.removeClass('main-input-with-pt');
            } else {
                mainInputEl.addClass('main-input-with-pt');
            }
        },
        _onChangeTitle: function (title) {
            var elEl = this.element,
                titleEl = $('.reply-title', elEl);
            titleEl.text(title);
            if (title.length == 0) {
                titleEl.hide();
            } else {
                titleEl.show();
            }
        },
        destroy: function () {
            var result;
            var elEl = this.element,
                mainInputEl = $('.main-input', elEl),
                mainBoxShownEl = $('.input-box-shown', mainInputEl),
                replyInputEl = $('.reply-input', mainBoxShownEl),
                mediaEl = $('.media', mainBoxShownEl);
            //清理主回复框
            mediaEl.data('media') && mediaEl.data('media').destroy();
            replyInputEl.data('atInput') && replyInputEl.data('atInput').destroy();
            //清空回复列表
            this.emptyList();
            elEl && elEl.empty();
            result = FeedReply.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = FeedReply;
});