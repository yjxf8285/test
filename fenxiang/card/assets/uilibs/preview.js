/**
 * 预览图片和文件UI
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var $ = require("$"),
        Overlay = require("overlay"),
        Position = require('position'),
        moment = require('moment'),
        util = require('util'),
        swfobject = require('swfobject'),
    //AudioPlayer=require('audioplayer'), //音频播放组件
        AudioPlayer = require('uilibs/audio-player'), //音频播放组件
        filePreview = require('modules/fs-attach/fs-attach-file-preview'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6,
        body = $(document.body),
        htmlEl = $('html'),
        doc = $(document),
        win = $(window),
        FileReader = filePreview.FileReader;  //文件预览组件类

    var rotateAngle = 0,  //图片初始旋转角度
        navInc = 0;    //导航移动增量
    var audioIndex = 0;   //audio player计数
    var fileReader = new FileReader();    //文件预览组件类

    var Preview = Overlay.extend({
        attrs: {
            //width: isIE6 ? doc.outerWidth(true) : "100%",
            // height: isIE6 ? doc.outerHeight(true) : "100%",
            width: isIE6 ? win.width() : "100%",
            height: isIE6 ? win.height() : "100%",
            className: "ui-preview fs-float-win",
            opacity: 1,
            backgroundColor: "#000",
            style: {
                position: isIE6 ? "absolute" : "fixed",
                top: 0,
                left: 0
            },
            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            },
            type: "img", //img/attach/audio
            //data:["201304_26_2c7c2dde-29ed-4568-a3de-8585cce1fbe1","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_a536d8e1-acf9-4e33-a310-4664799d5017","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9","201304_25_c79bb6d8-04fa-434c-b6f6-a8ced69949f9"],
            data: [],    //包含previewPath,originPath,thumbPath,createTime,fileName,fileSize,
            // fileId,employeeName,serverTime
            refId: 0,//feedid或feedrepayid
            activeIndex: -1,
            zIndex: 100
        },
        events: {
            'click .ui-preview-close-btn': '_clickCloseBtn',
            'click .ui-preview-img-panel .ui-preview-nav-item': 'previewImg',
            'click .ui-preview-img-panel .ui-preview-img-tools .rotate-l': 'rotateLeft',
            'click .ui-preview-img-panel .ui-preview-img-tools .rotate-r': 'rotateRight',
            'click .ui-preview-img-panel .ui-preview-img-tools .view-origin': 'viewOrigin',
            'click .ui-preview-img-panel .ui-preview-img-tools .download-origin': 'downloadOrigin',
            'click .ui-preview-switch-l,.ui-preview-switch-r': 'switchItem',
            'click .ui-preview-img-panel .ui-preview-img': 'clickPreviewImg', //点击预览图片向右循环移动
            'click .ui-preview-attach-wrapper .attach-preview-l': 'clickPreviewAttach',   //点击文件预览按钮
            'click .ui-preview-audio-wrapper .audio-player-wrapper': 'clickAudioPlayer' //点击音频播放
        },
        show: function () {
            /*if (isIE6) {
             this.set("width", doc.outerWidth(true));
             this.set("height", doc.outerHeight(true));
             }*/
            var result;
            if (isIE6) {
                this.set("width", win.width());
                this.set("height", win.height());
                //定位
                this.element.css({
                    "top": win.scrollTop(),
                    "left": win.scrollLeft()
                });
            }

            return Preview.superclass.show.call(this);
        },
        hide: function () {
            //尝试关闭录音
            this.audioPlayer && this.audioPlayer.stop();
            return Preview.superclass.hide.call(this);
        },
        _clickCloseBtn: function (evt) {
            this.hide();
            evt.preventDefault();
            evt.stopPropagation();
        },
        previewImg: function (evt) {
            var elEl = this.element,
                navItemEl = $('.ui-preview-nav-item', elEl),
                curTargetEl = $(evt.currentTarget),
                activeIndex = navItemEl.index(curTargetEl);
            //设置当前预览图片index
            this.set('activeIndex', activeIndex);
            //拦截click事件，阻止冒泡到element上隐藏自身
            evt.stopPropagation();
        },
        switchItem: function (evt) {
            var elEl = this.element,
                navItemEl = $('.ui-preview-nav-item', elEl),
                curTargetEl = $(evt.currentTarget),
                maxItemLength = navItemEl.length,
                activeIndex = this.get('activeIndex');
            if (curTargetEl.hasClass('ui-preview-switch-r')) {
                if (activeIndex == (maxItemLength - 1)) {
                    activeIndex = 0;
                } else {
                    activeIndex++;
                }
            } else {
                if (activeIndex == 0) {
                    activeIndex = maxItemLength - 1;
                } else {
                    activeIndex--;
                }
            }
            //设置当前预览图片index
            this.set('activeIndex', activeIndex);
            //拦截click事件，阻止冒泡到element上隐藏自身
            evt.stopPropagation();
        },
        clickPreviewImg: function (evt) {
            var elEl = this.element,
                rEl = $('.ui-preview-switch-r', elEl);
            var activeIndex = this.get('activeIndex'),
                data = this.get('data');
            if (activeIndex + 1 == data.length) {
                this.set('activeIndex', 0);
            } else {
                //模拟右方向键点击事件
                rEl.click();
            }

            //拦截click事件，阻止冒泡到element上隐藏自身
            evt.stopPropagation();
        },
        clickPreviewAttach: function (evt) {
            var activeIndex = this.get('activeIndex'),
                data = this.get('data'),
                itemData = data[activeIndex];
            fileReader.readFile({
                "fileId": itemData.fileId,
                "fileName": itemData.fileName,
                "filePath": itemData.originPath
            });
            evt.preventDefault();
            evt.stopPropagation();
        },
        rotateLeft: function (evt) {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                imgEl = $('.ui-preview-img', boxEl);
            require.async('jslibs/jquery-rotate-2.2.js', function () {
                rotateAngle -= 90;
                imgEl.rotate(rotateAngle);
            });
            //拦截click事件，阻止冒泡到element上隐藏自身
            evt.stopPropagation();
        },
        rotateRight: function (evt) {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                imgEl = $('.ui-preview-img', boxEl);
            require.async('jslibs/jquery-rotate-2.2.js', function () {
                rotateAngle += 90;
                imgEl.rotate(rotateAngle);
            });
            //拦截click事件，阻止冒泡到element上隐藏自身
            evt.stopPropagation();
        },
        viewOrigin: function (evt) {
            evt.stopPropagation();
        },
        downloadOrigin: function (evt) {
            evt.stopPropagation();
        },
        clickAudioPlayer: function (evt) {
            evt.stopPropagation();
        },
        setup: function () {
            var that = this;
            this._imgSizeStore = [];  //用于存储图片尺寸
            this._createEl();

            //每次show后调整面板大小位置
            this.before('show', function () {
                //设置全屏模式
                util.setFullScreen(true);
            });
            this.after('show', function () {
                that._adjustPanel();
            });
            //每次隐藏后reset状态
            this.after('hide', function () {
                that._resetPanel();
                //设置非全屏模式
                util.setFullScreen(false);
            });
            //点击element本身隐藏
            this.element.on('click', function (evt) {
                that.hide();
                evt.stopPropagation();
            });
            //window resize时调整panel大小位置
            this.after("_setPosition", function () {
                this._adjustPanel();
                if (isIE6) {
                    //定位
                    this.element.css({
                        "top": win.scrollTop(),
                        "left": win.scrollLeft()
                    });
                    this.set("width", win.width());
                    this.set("height", win.height());
                }
            });
            //ie6下随window scroll重新定位element
            if (isIE6) {
                win.scroll(function () {
                    var elEl = that.element;
                    if (elEl.is(':visible')) {
                        elEl.css({
                            "top": win.scrollTop(),
                            "left": win.scrollLeft()
                        });
                    }
                });
            }
            // 加载 iframe 遮罩层并与 overlay 保持同步
            return Preview.superclass.setup.call(this);
        },
        _createEl: function () {
            var elEl = this.element,
                type = this.get('type');
            elEl.html('<span class="ui-preview-close-btn">&#10005;</span><div class="ui-preview-info"></div><div class="ui-preview-panel ui-preview-' + type + '-panel"><div class="ui-preview-panel-inner"><div class="ui-preview-port"><div class="ui-preview-switch-l"><a href="javascript:;">&#139;</a></div><div class="ui-preview-switch-r"><a href="javascript:;">&#155;</a></div><div class="ui-preview-box"></div></div><div class="ui-preview-action-panel"></div></div></div>');

            if (type == "img" || type == "qximg") {
                this._createImgEl();
            } else if (type == "attach") {
                this._createAttachEl();
            } else if (type == "audio") {
                this._createAudio();
            }

            this._createNavEl();
            //如果只有一个item，隐藏滑动导航和箭头导航
            if ($('.ui-preview-nav-item', elEl).length > 1) {
                $('.ui-preview-switch-l,.ui-preview-switch-r', elEl).show();
                $('.ui-preview-action-panel', elEl).show();
            } else {
                //如果是附件肯定会执行这块的逻辑
                $('.ui-preview-switch-l,.ui-preview-switch-r', elEl).hide();
                $('.ui-preview-action-panel', elEl).hide();
                //隐藏批量打包下载
                $('.batch-download-origin', elEl).hide();
            }
            //拦截click事件，阻止冒泡到element上隐藏自身
            $('.ui-preview-info', elEl).click(function (evt) {
                evt.stopPropagation();
            });
        },
        _createAttachEl: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl);
            boxEl.html('<div class="ui-preview-attach-wrapper fn-clear"><div class="ui-preview-attach-icon"><img src="' + FS.BLANK_IMG + '" alt="loading" class="icon-file" /></div><div class="ui-preview-attach-content"><h3 class="ui-preview-attach-name"></h3><p class="ui-preview-attach-size"></p><p class="ui-preview-attach-create-time"></p><p class="ui-preview-attach-actions"></p></div></div>');
        },
        _createImgEl: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl);
            var data = this.get('data'),
                fileIds = [],
                source,//1、soure:信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                refId,//feedId或者是feedreplyId,传入图片信息的时候带过来的
                fileNames = [];
            _.each(data, function (itemData) {
                fileIds.push(itemData.originPath + '.jpg');
                fileNames.push(encodeURIComponent(itemData.fileName));
            });
            fileIds = fileIds.join('|');
            fileNames = fileNames.join('|');

            if (data.length > 0) {
                refId = data[0].refId;
                source = data[0].source || 1;
            }

            var downAllLink = FS.API_PATH + '/df/GetBatchFiles1?dataID=' + (refId && refId) + '&source=' + source + '&attachType=2';
            //拼串方式下载
            var downlinkStr = _.map(data, function (fileData) {
                return fileData.attachPath+'1.jpg';
            }).join('|') + '&names=' + _.map(data, function (fileData) {
                return encodeURIComponent(fileData.fileName);
            }).join('|');
            if (refId == 'noid') {
                downAllLink = FS.API_PATH + '/df/GetBatchGlobalFiles?ids='+downlinkStr;
            }
            boxEl.html('<div class="ui-preview-img-wrapper"><img src="' + FS.BLANK_IMG + '" alt="loading" class="ui-preview-img" /></div><div class="ui-preview-img-tools"><span class="rotate-l">&#8630;向左旋转</span>&nbsp;&nbsp;&nbsp;<span class="rotate-r">&#8631;向右旋转</span>&nbsp;&nbsp;&nbsp;<a class="view-origin" href="#" target="_blank">查看原图</a>&nbsp;&nbsp;&nbsp;<a class="download-origin" href="#" target="_blank">下载原图</a>&nbsp;&nbsp;&nbsp;<a class="batch-download-origin" href="' + downAllLink + '" target="_blank">打包下载</a></div>');

        },
        _createAudio: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl);
            boxEl.html('<div class="ui-preview-audio-wrapper"><div class="audio-player-wrapper" id="preview-audio-player-' + audioIndex + '"></div><div class="audio-info"><p class="ui-preview-attach-name"></p><p class="audio-duration">时长：<span class="duration-value">0秒</span></p><p class="upload-info"></p></div></div>');
            audioIndex++;
        },
        _createNavEl: function () {
            var that = this;
            var elEl = this.element,
                actionEl = $('.ui-preview-action-panel', elEl),
                indicatorEl = $('<div class="ui-preview-nav-indicator fn-hide"></div>'),  //导航指示器
                navWEl = $('<div class="ui-preview-nav-wrapper"></div>'),
                htmlStr = '';
            var data = this.get('data'),
                type = this.get('type');
            if (type == "img") {
                //如果是图片显示bbar
                actionEl.show();
                _.each(data, function (v) {
                    htmlStr += '<li class="ui-preview-nav-item" originpath="' + v.originPath + '" thumbpath="' + v.thumbPath + '" previewpath="' + v.previewPath + '"><div class="img-center-wrapper"><img src="' + that._getFileLink(v.thumbPath, v.fileName, false, 'jpg') + '" alt="loading" width="50" /></div></li>';
                });
            } else {  //atach仅作占位用
                //如果是附件隐藏bbar
                actionEl.hide();
                _.each(data, function (v) {
                    htmlStr += '<li class="ui-preview-nav-item"><div class="img-center-wrapper"><img src="' + FS.BLANK_IMG + '" alt="loading" /></div></li>';
                });
            }

            navWEl.html('<ul class="ui-preview-nav-list fn-clear">' + htmlStr + '</ul><div class="ui-preview-thumb-box"></div>');
            indicatorEl.appendTo(actionEl);
            navWEl.appendTo(actionEl);
        },
        _adjustPanel: function () {
            var type = this.get('type');
            if (_.str.trim(this.element.text()).length > 0) {
                //设置port区高度
                this._setPortHeight();
                //设置info区高度
                this._setInfoHeight();
                //设置切换手柄位置
                this._setSwitchPosition();
                //设置导航位置
                this._setNavPosition();
                //图片预览位置调整
                if (type == "img") {
                    this._adjustImgPanel();
                    this._adjustImg();
                } else if (type == "attach") {
                    this._adjustAttachPanel();
                } else if (type == "audio") {
                    this._adjustAudioPanel();
                }
            }
        },
        _adjustAudioPanel: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                audioWEl = $('.ui-preview-audio-wrapper', boxEl);
            Position.center(audioWEl, boxEl);
        },
        _adjustAttachPanel: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                attachWEl = $('.ui-preview-attach-wrapper', boxEl);
            Position.center(attachWEl, boxEl);
        },
        _adjustImgPanel: function () {
            this._setImgBoxSize();
            this._setImgBoxPosition();
        },
        /*_adjustNavPanel:function(){
         var elEl=this.element,
         navListEl=$('.ui-preview-nav-list',elEl);
         var activeIndex=this.get('activeIndex'),
         navItemWidth=$('.ui-preview-nav-item',navListEl).outerWidth(true);
         navInc=navItemWidth*activeIndex;
         this._setNavPosition(true);
         },*/
        _setImgBoxSize: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                imgWEl = $('.ui-preview-img-wrapper', boxEl);
            var boxH = boxEl.height(),
                boxW = boxEl.width();
            imgWEl.height(boxH * 1 - 50).css({    //*0.8表示缩放到外围框尺寸的80%
                "line-height": (boxH * 1 - 50) + 'px'
            });
            imgWEl.width(boxW * 1 - 2);
        },
        _setImgBoxPosition: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                imgWEl = $('.ui-preview-img-wrapper', boxEl);
            /*Position.pin({
             element: imgWEl,
             x: imgWEl.width()/2,
             y: imgWEl.height()/2
             }, {
             element: boxEl,
             x: '50%',
             y: '50%'
             });*/
            //Position.center(imgWEl,boxEl);
        },
        /**
         * 从预览图片存储中获取对应的尺寸
         * @param src
         * @returns {null}
         * @private
         */
        _getPreviewImgSize: function (src) {
            var imgSizeStore = this._imgSizeStore,
                imgSize = null;
            _.some(imgSizeStore, function (itemData) {
                if (itemData.src == src) {
                    imgSize = itemData.size;
                    return true;
                }
            });
            return imgSize;
        },
        /**
         * 判断是否在预览图片尺寸存储中
         * @param src
         * @private
         */
        _isInPreviewImgStore: function (src) {
            var imgSizeStore = this._imgSizeStore;
            return _.some(imgSizeStore, function (itemData) {
                return itemData.src == src;
            });
        },
        /**
         * 设置图片的尺寸和位置For IE6不支持max-width和max-height的问题
         * 位置通过button居中显示img的机制实现
         * @return {[type]} [description]
         */
        _adjustImg: function () {
            var elEl = this.element,
                boxEl = $('.ui-preview-box', elEl),
                imgWEl = $('.ui-preview-img-wrapper', boxEl),
                imgEl = $('.ui-preview-img', imgWEl);
            var imgSize = imgEl.data('size'),
                imgWSize = this._getPreviewImgSize(imgEl.attr('src')),
                imgNewSizePos = {};
            if (imgSize) {
                if (imgSize.width / imgSize.height >= imgWSize.width / imgWSize.height) {
                    if (imgSize.width > imgWSize.width) {
                        imgNewSizePos.width = imgWSize.width;
                        imgNewSizePos.height = (imgSize.height * imgWSize.width ) / imgSize.width;
                    } else {
                        imgNewSizePos.width = imgSize.width;
                        imgNewSizePos.height = imgSize.height;
                    }
                } else {
                    if (imgSize.height > imgWSize.height) {
                        imgNewSizePos.height = imgWSize.height;
                        imgNewSizePos.width = (imgSize.width * imgWSize.height) / imgSize.height;
                    } else {
                        imgNewSizePos.width = imgSize.width;
                        imgNewSizePos.height = imgSize.height;
                    }
                }
                imgEl.width(imgNewSizePos.width);
                imgEl.height(imgNewSizePos.height);
            }
            //Position.center(imgEl,imgWEl);
            //console.info(imgWSize.height);
        },
        /*_setPosition:function(){
         var self=Preview.superclass._setPosition.call(this);
         this._setPortHeight();
         return self;
         },*/
        _setSwitchPosition: function () {
            var elEl = this.element,
                baseEl = $('.ui-preview-port', elEl),
                lEl = $('.ui-preview-switch-l', elEl),
                rEl = $('.ui-preview-switch-r', elEl);
            Position.pin({
                element: lEl,
                x: 0,
                y: 60
            }, {
                element: baseEl,
                x: 0,
                y: '50%'
            });
            Position.pin({
                element: rEl,
                x: 60,
                y: 60
            }, {
                element: baseEl,
                x: '100%',
                y: '50%'
            });
        },
        /**
         * 是否带动画切换，默认不带动画
         * @param {[type]} withAnimate [description]
         */
        _setNavPosition: function (withAnimate) {
            var elEl = this.element,
                navWEl = $('.ui-preview-nav-wrapper', elEl),
                navListEl = $('.ui-preview-nav-list', elEl),
                thumbBoxEl = $('.ui-preview-thumb-box', elEl);
            var pin = withAnimate ? Position["pinWithAnimate"] : Position["pin"];
            //console.info(navInc);
            pin({
                element: navListEl,
                x: $('.ui-preview-nav-item', navListEl).outerWidth(true) / 2 + navInc,
                y: 0
            }, {
                element: navWEl,
                x: '50%',
                y: 0
            });
            Position.pin({
                element: thumbBoxEl,
                x: '50%',
                y: 0
            }, {
                element: navWEl,
                x: '50%',
                y: 0
            });
            //Position.center(thumbBoxEl,navWEl);
        },
        _setNavListWidth: function () {
            var elEl = this.element,
                navListEl = $('.ui-preview-nav-list', elEl),
                navItemEl = $('.ui-preview-nav-item', elEl);
            var width = 0;
            navItemEl.each(function () {
                width += $(this).outerWidth(true);
            });
            navListEl.width(width);
        },
        _setPortHeight: function () {
            var elEl = this.element,
                portEl = $('.ui-preview-port', elEl),
                actionEl = $('.ui-preview-action-panel', elEl);
            var overlayH = elEl.height(),
                actionH;
            //alert(overlayH);
            if (actionEl.is(':visible')) {
                actionH = actionEl.outerHeight(true);
                portEl.height(overlayH - actionH);
            } else {
                portEl.height(overlayH);
            }

        },
        _setInfoHeight: function () {
            var elEl = this.element,
                infoEl = $('.ui-preview-info', elEl);
            infoEl.height(elEl.height());
        },
        _onRenderActiveIndex: function (val) {
            var that = this;
            var elEl = this.element,
                indicatorEl = $('.ui-preview-nav-indicator', elEl),
                navItemEl = $('.ui-preview-nav-item', elEl),
                curItemEl = navItemEl.eq(val),
                boxEl = $('.ui-preview-box', elEl),
                data = this.get('data'),
                itemData = data[val],
                serverTime,
                attachPreviewStr;
            var imgWEl,
                imgEl,
                attachWEl,
                attachCreateTimeEl,
                attachIconEl,
                attachSizeEl,
                attachNameEl,
                attachActions,
                newImgEl,
                audioWEl,
                audioPlayerEl;
            var previewPath,
                originPath,
                navItemWidth,
                audioPath;   //音频文件地址
            var type = this.get('type');
            var realImgSrc;

            //设置当前定位导航class
            navItemEl.removeClass('state-active');
            curItemEl.addClass('state-active');
            if (itemData) {
                serverTime = itemData.serverTime ? moment.unix(itemData.serverTime) : moment();
                if (type == "img") {
                    imgWEl = $('.ui-preview-img-wrapper', boxEl);
                    imgEl = $('.ui-preview-img', boxEl);
                    newImgEl = $('<img class="ui-preview-img" />');
                    //newImgEl.addClass('fn-hide-abs').appendTo('body');

                    previewPath = curItemEl.attr('previewpath');
                    originPath = curItemEl.attr('originpath');
                    navItemWidth = 0;

                    if (val > -1) {
                        rotateAngle = 0;  //设置初始旋转角度
                        navItemWidth = navItemEl.eq(0).outerWidth(true);
                        navInc = navItemWidth * val;
                        //设置预加载loading
                        imgWEl.html('<img src="' + FS.ASSETS_PATH + '/' + 'images/loading.gif' + '" /><span style="inline-block;"> </span>');
                        realImgSrc = this._getFileLink(previewPath, itemData.fileName, false, 'jpg');

                        if (this._isInPreviewImgStore(realImgSrc)) {
                            imgWEl.html('<img src="' + realImgSrc + '" alt="loaded" class="ui-preview-img" /><span style="inline-block;"> </span>');
                            that._adjustImg();
                        } else {
                            newImgEl.load(function () {
                                var meEl = $(this),
                                    meDom = meEl.get(0);
                                var width = meDom.width,
                                    height = meDom.height;
                                var src = meEl.attr('src');
                                imgWEl.empty();
                                //meEl.removeClass('fn-hide-abs').appendTo(imgWEl);
                                imgWEl.html('<img src="' + src + '" alt="loaded" class="ui-preview-img" /><span style="inline-block;"> </span>');
                                //存储图片尺寸信息
                                that._imgSizeStore.push({
                                    "src": src,
                                    "size": {
                                        "width": width,
                                        "height": height
                                    }
                                });
                                that._adjustImg();
                                newImgEl.unbind('load').remove();
                                newImgEl = null;
                                //imgEl.replaceWith(meEl);
                            }).attr('src', realImgSrc).addClass('fn-hide-abs').appendTo('body');
                        }
                        //imgEl.replaceWith('<img src="http://push.oa.b.qq.com/QQ00000011/sl/DF/Get/'+path+'2.jpg" alt="loading" class="ui-preview-img" />');
                        //调整导航条位置
                        if (elEl.is(':visible')) {
                            this._setNavPosition(true);
                        }
                        //导航指示器提示
                        indicatorEl.html('第&nbsp;' + (val + 1) + '&nbsp;个（共&nbsp;' + navItemEl.length + '&nbsp;个）');
                        //设置查看原图和下载原图的链接
                        //$('.view-origin',boxEl).attr('href',originPath);
                        $('.view-origin', boxEl).attr('href', this._getFileLink(originPath, itemData.fileName, false, 'jpg'));
                        $('.download-origin', boxEl).attr('href', this._getFileLink(originPath, itemData.fileName, true, 'jpg'));
                        //$('.download-origin',boxEl).attr('href',originPath);
                    }
                } else if (type == "attach") {
                    attachWEl = $('.ui-preview-attach-wrapper', boxEl);
                    attachIconEl = $('.ui-preview-attach-icon img', attachWEl);
                    attachNameEl = $('.ui-preview-attach-name', attachWEl);
                    attachSizeEl = $('.ui-preview-attach-size', attachWEl);
                    attachCreateTimeEl = $('.ui-preview-attach-create-time', attachWEl);
                    attachActions = $('.ui-preview-attach-actions', attachWEl);

                    attachIconEl.addClass('icon-file-' + util.getFileType({
                        "name": itemData.fileName
                    }, true));
                    attachNameEl.text(itemData.fileName);
                    attachSizeEl.text(util.getFileSize(itemData.fileSize));
                    //attachCreateTimeEl.text(moment(itemData.createTime).startOf('hour').fromNow());
                    attachCreateTimeEl.text((itemData.employeeName || '') + '上传于' + util.getDateSummaryDesc(moment.unix(itemData.createTime), serverTime, 1));
                    //设置下载和预览链接
                    //attachActions.html('<a href="'+itemData.originPath+'" target="_blank">下载</a>&nbsp;&nbsp;&nbsp;<a href="javascript:;">预览</a>');
                    attachPreviewStr = '<a href="' + this._getFileLink(itemData.originPath, itemData.fileName, true) + '" target="_blank">下载</a>';
                    if (itemData.canPreview) {
                        attachPreviewStr += '&nbsp;&nbsp;&nbsp;<a href="#" title="预览" class="attach-preview-l">预览</a>';
                    }
                    attachActions.html(attachPreviewStr);
                } else if (type == "audio") {
                    audioWEl = $('.ui-preview-audio-wrapper', boxEl);
                    audioPlayerEl = $('.audio-player-wrapper', audioWEl);
                    //audioPath= util.getDfLink(itemData.originPath,itemData.fileName,false,util.getFileExtText(itemData.fileName));
                    //audioPath="test.mp3";   //For test
                    audioPath = util.getFileNamePath(itemData.originPath) + '.mp3';
                    audioPath = this._getFileLink(audioPath, itemData.fileName, false);
                    /*if(!!(document.createElement('audio').canPlayType)){
                     //audioPlayerEl.html('<audio controls="controls" src="'+audioPath+'"></audio>');
                     audioPlayerEl.html('<audio controls="controls"></audio>');
                     }else{
                     AudioPlayer.embed(audioPlayerEl.attr('id'),{
                     soundFile: audioPath,
                     autostart: "yes",
                     width: 290
                     });
                     this.audioFlashRendered=true;
                     }*/
                    //初始化audio
                    if (!this.audioPlayer) {
                        this.audioPlayer = new AudioPlayer({
                            "element": audioPlayerEl,
                            "audioSrc": audioPath,
                            "length": itemData.fileSize,
                            "themeStyle": 4
                        });
                    }
                    this.audioPlayer.play(); //打开直接播放
                    $('.ui-preview-attach-name', audioWEl).text(util.getFileNamePath(itemData.fileName) + '.mp3');
                    $('.duration-value', audioWEl).text(itemData.fileSize + '秒');
                    $('.upload-info', audioWEl).text((itemData.employeeName || '') + '上传于' + util.getDateSummaryDesc(moment.unix(itemData.createTime), serverTime, 1));
                }
            }

        },
        /**
         * 根据不同的type获取不同的请求图片地址接口
         * @returns {*}
         * @private
         */
        _getFileLink: function (path) {
            var belongToType = this.get('belongToType'),
                arg = Array.prototype.slice.call(arguments);
            if(belongToType == 'qx'){
                return util.getFileUrl(this, arg);
            }
            return util.getDfLink.apply(this, arg);
        },
        _resetPanel: function () {
            this.set('activeIndex', -1);
        },
        _onRenderData: function (val) {
            //数据变更重新渲染页面
            this._clear();
            if (val.length > 0) {
                this._createEl();
                this._adjustPanel();
            } else {
                this.element.empty();
            }
        },
        _onRenderType: function (val) {

            //类型改成重新渲染页面
            this._clear();
            this._createEl();
            this._adjustPanel();
        },
        _onRenderBackgroundColor: function (val) {
            this.element.css("backgroundColor", val);
        },
        _onRenderOpacity: function (val) {
            this.element.css("opacity", val);
        },
        /**
         * 清理组件
         * @private
         */
        _clear: function () {
            //清空audio组件
            /*this.audioFlashRendered&&swfobject.removeSWF('preview-audio-player-'+audioIndex);
             this.audioFlashRendered=false;*/
            this.audioPlayer && this.audioPlayer.destroy();
            this.audioPlayer = null;
        },
        destroy: function () {
            var result;
            this._imgSizeStore = null;    //清空
            //清空audio组件
            this.audioFlashRendered && swfobject.removeSWF('preview-audio-player-' + audioIndex);
            this.element.empty();
            result = Preview.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = Preview;
});