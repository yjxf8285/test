/**
 * FS回复
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var publish = require('modules/publish/publish'),
        Widget = require('widget'),
        util = require('util'),
        moment = require('moment'),
//        moduleStyle = require('modules/fs-reply/fs-reply.css'),
        moduleTpl = require('modules/fs-reply/fs-reply.html'),
        Pagination = require('uilibs/pagination'),
        feedHelper = require('modules/feed-list/feed-list-helper'),
        fsReplyList = require('./fs-reply-list');

    var AtInput = publish.atInput,
        MediaMaker = publish.mediaMaker,
        moduleTplEl = $(moduleTpl),
        ReplyItemV = fsReplyList.itemV,
        ReplyItemM = fsReplyList.itemM,
        ReplyListC = fsReplyList.listC;
    var FsReply = Widget.extend({
        "attrs": {
            "trigger": {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            },
            "publishAction": {
                value: ["h5imgupload","h5attachupload", "at"],
                getter: function(val) {
                    return [].concat(val);
                }
            },
            //"sendPath": "/Feed/SendFeedReply", //发送回复地址
            "sendPath": "/Feed/Reply", //发送回复地址
            "getReplyPath": "/Feed/GetFeedReplyByID", //请求一条回复的内容
            //可以是{}或者Function
            "defaultRequestData": {
                "value": {},
                "getter": function(val) {
                    if (_.isFunction(val)) {
                        return val();
                    } else {
                        return val;
                    }
                }
            }, //默认回复列表请求数据
            "replyDefaultRequestData": null,
            "detailDefaultRequestData": {  //默认请求一条回复内容的附加参数
                "value": {},
                "getter": function(val) {
                    if (_.isFunction(val)) {
                        return val();
                    } else {
                        return val;
                    }
                }
            },
            "replyCb": function(responseData) { //可覆盖
                //如果带回复列表，自动添加一条新回复
                if (responseData.success && this.get('listOpts')) {
                    this.addNewReply(responseData.value);
                }
            },
            "bbarTpl": '<span class="fs-reply-send-sms label-for"><input type="checkbox" name="send_sms" />&nbsp;<label>立即发送短信息给：<em class="user-name">xx</em></label></span>',
            "submitText": "回复",
            "triggerText":"回复",
            "placeholder": "添加回复...",
            "defaultContent": "", //默认发布内容
            "withMedia": true, //是否有多媒体功能，默认带着
            "listOpts": {
                "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                "withPagination": false, //默认不带分页
                "activePageNumber": 1, //withPageNumber时有效，表示定位的页码
                "replyListCb": FS.EMPTY_FN      //回复列表请求接口
            }
        },
        "events": {
            "click .fs-reply-sub": "reply",
            "click .new-group-wrapper": "newgrouptoggle" //新增范围的黄条
        },
        newgrouptoggle: function() {
            this.element.find('.newgroup').toggleClass('cur');
        },
        setup: function() {
            var result = FsReply.superclass.setup.apply(this, arguments);
            this._bindEvents();
            this.items = []; //保存当前回复列表view
            return result;
        },
        _getItemEl: function(elSelector) {
            return $(elSelector).closest('.fs-reply-item');
        },
        _renderEl: function() {
            this.element.addClass('fs-reply').hide();
            this._renderHtml();
        },
        /**
         * 分页渲染，可能是双层分页
         * @private
         */
        _initPagination: function() {
            var that = this;
            var elEl = this.element,
                listEl = $('.fs-reply-list', elEl),
                pagEl;
            var listOpts = this.get('listOpts');
            //构造pagination结构
            $('<div class="fs-reply-pagination"></div>').insertAfter(listEl);
            $('<div class="fs-reply-pagination"></div>').insertBefore(listEl);

            pagEl = $('.fs-reply-pagination', elEl);
            this.paginations = [];
            pagEl.each(function() {
                var pagination = new Pagination({
                    "element": $(this),
                    "pageSize": 10, //回复列表每页10条
                    "activePageNumber": listOpts.activePageNumber || 1 //默认定位到第一页
                }).on('page', function(pageNumber) {
                    //绑定和其他pagination的关联
                    _.each(that.paginations, function(item) {
                        if (item !== pagination) {
                            item.set('activePageNumber', pageNumber);
                        }
                    });
                    that._renderReplyList();
                }).render();
                that.paginations.push(pagination);
            });

        },
        /**
         * 列表summary信息
         * @private
         */
        _initReplyListSummary: function() {
            var elEl = this.element,
                listEl = $('.fs-reply-list', elEl),
                summaryEl;
            //构造summary结构
            summaryEl = $('<div class="fs-reply-list-summary"></div>');
            summaryEl.html('后面还有<span class="num">0</span>条回复，<a class="jump-to-detail-l" href="#stream/showfeed" title="">点击查看</span> >>');
            summaryEl.hide().insertAfter(listEl);
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
        show: function() {
            var elEl = this.element,
                inputEl,
                defaultContent=this.get('defaultContent');
            if (!this.rendered) {
                this.render();
            }
            elEl.show();
            inputEl=$('.fs-reply-input', elEl);
            if(inputEl.is(':visible')){     //输入框有可能被隐藏，比如关键回复那部分
                //设置默认textarea内容
                inputEl.val(defaultContent);
                //焦点定位到输入框,光标位于输入框最后
                util.setCursorPositionEnd(inputEl);
                inputEl.trigger('autosize.resize'); //textarea auto size手动赋值后要手动触发resize事件
            }
            this.trigger('show');
        },
        hide: function() {
            var elEl = this.element;
            elEl.hide();
            //为ie性能考虑（swfupload在ie下渲染占用资源较多）,hide后清空列表
            this._emptyList();
            this.trigger('hide');
        },
        refresh: function() {
            var pagination = this.paginations[0];
            var activePageNumber = pagination.get('activePageNumber');
            if (activePageNumber != 1) {
                pagination.jump(1);
            } else {
                this._renderReplyList();
            }
        },
        /**
         * 清空发布框相关
         * @param subWrapperSelector
         */
        clearSubmit: function() {
            var subWEl = $('.fs-reply-submit-box', this.element),
                inputEl = $('.fs-reply-input', subWEl),
                mediaEl = $('.fs-reply-media', subWEl),
                media = mediaEl.data('media');
            //清空input
            inputEl.val('').trigger('autosize.resize');
            //清空多媒体
            media.resetAll();
            //重新开启上传
            media.enableAction('h5imgupload');
            media.enableAction('h5attachupload');
        },
        _bindEvents: function() {
            var that = this,
                elEl=this.element;
            this.on('show', function() {
                if (that.get('listOpts')) {
                    this._renderReplyList();
                }
            });
            this.get("trigger").addClass('fs-reply-trigger').on("click", function(evt) {
                evt.preventDefault();
                if (elEl.is(':visible')) {
                    that.hide();
                } else {
                    that.show();
                }
            });
        },
        _getInputTpl: function() {
            var tplStr = '<div class="fs-reply-input-wrapper">' +
                '<fieldset>' + //ie6下textarea 100%的解决方案，套一层fieldset
            '<div class="fs-reply-input-inner">' +
                '<textarea class="fs-reply-input" placeholder="' + this.get('placeholder') + '">' + this.get('defaultContent') + '</textarea>' +
                '</div>' +
                '</fieldset>' +
                '<div class="fs-reply-media"></div>' +
                '<div class="fs-reply-bbar fn-clear">' +
                '<div class="fs-reply-bbar-l">' + this.get('bbarTpl') + '</div>' +
                '<div class="fs-reply-bbar-r"><button type="button" class="fs-reply-sub button-green">' + this.get('submitText') + '</button></div>' +
                '</div>' +
                '</div>';
            return tplStr;
        },

        _getGroupTpl: function() { //新增分享范围的黄条
            var tplStr = '<div class="newgroup"><div class="arrow"></div><div class="info">新增同事范围<span class="num">8</span>人：<span class="man">Lucy</span></div></div>';
            return tplStr;
        },
        /**
         * 如果isRequest为true，表示重新请求新增范围，此时responseData为feedID
         * @param responseData
         * @param isRequest
         * @private
         */
        _updateGroupInfo: function(responseData,isRequest) {
            var that=this;
            var data,
                addEmployees,
                lengthNum,
                addEmployeesStr,
                elEl = this.element,
                newgroupEl = $('.newgroup', elEl),
                newgroupNumEl = $('.num', newgroupEl),
                newgroupManEl = $('.man', newgroupEl);
            var feedId;
            if(isRequest){  //需要重新请求
                feedId=responseData;
                util.api({
                    "url":"/Feed/GetAddAtEmpRanges",
                    "data":{
                        "feedID":feedId,
                        "isGetRangeData":true
                    },
                    "success":function(responseData){
                        var dataRoot,
                            addEmployees;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            addEmployees=dataRoot.addEmployees;
                            if(addEmployees.length>0){
                                addEmployeesStr = addEmployees.join('、') + '。';
                                lengthNum=addEmployees.length;

                                if (lengthNum > 0) {
                                    newgroupEl.show();
                                }
                                newgroupNumEl.text(lengthNum);
                                newgroupManEl.text(addEmployeesStr);
                                //触发新增可视范围事件
                                that.trigger('addatrange',dataRoot);
                            }

                        }
                    }
                });
            }else{
                data = responseData.value;
                addEmployees = data.addEmployees;
                lengthNum = addEmployees.length;
                addEmployeesStr = addEmployees.join('、') + '。';
                if (lengthNum > 0) {
                    newgroupEl.show();
                }
                newgroupNumEl.text(lengthNum);
                newgroupManEl.text(addEmployeesStr);
            }


        },
        _renderHtml: function() {
            var elEl = this.element;
            elEl.html('<div class="new-group-wrapper"></div><div class="fs-reply-main-wrapper fs-reply-submit-box">' + this._getInputTpl() + '</div>');
            //如果带列表，构造列表容器和分页组件初始化
            if (this.get('listOpts')) {
                $('.new-group-wrapper', elEl).html(this._getGroupTpl());
                $('<div class="fs-reply-list-wrapper"><div class="list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div><div class="fs-reply-list"></div></div>').appendTo(elEl);
            }
            this._renderInput();
            this._renderMedia();
            return elEl;
        },
        /* 点功能菜单 《回复》 展开回复列表 */
        _renderReplyList: function() {
            var that = this;
            var elEl = this.element,
                listEl = $('.fs-reply-list', elEl),
                triggerEl = this.get('trigger'),
                numEl = $('.num', triggerEl), //回复数
                summaryEl;
            var requestData = {};
            var listOpts = this.get('listOpts'),
                triggerText=this.get('triggerText');
            var pagination,
                pageSize,
                pageNumber;
            if (listOpts.withPagination) {
                pagination = this.paginations[0];
                pageSize = pagination.get('pageSize');
                pageNumber = pagination.get('activePageNumber');
            } else {
                summaryEl = $('.fs-reply-list-summary', elEl);
                pageSize = 10;
                pageNumber = 1;
            }
            summaryEl&&summaryEl.hide();   //先隐藏切换到下一页
            //准备请求数据
            requestData = _.extend(requestData, this.get('defaultRequestData'));

            //附加分页信息
            requestData = _.extend(requestData, {
                "pageSize": pageSize,
                "pageNumber": pageNumber
            });
            //清空列表
            this._emptyList();
            this._showListLoading();
            //清空上一次请求
            this._replyListXhr&&this._replyListXhr.abort(); //终止上次请求
            this._replyListXhr=util.api({
                "data": requestData,
                "type": "get",
                //"url":"/content/fs/data/list.txt",
                "url": listOpts.listPath,
                "success": function(responseData) {
                    var items,
                        tempListC = new ReplyListC(),
                        totalCount= 0,
                        summaryCount = 0; //后面有多少条reply未显示
                    if (responseData.success) {

                        that._updateGroupInfo(responseData); //调用显示黄条函数
                        //添加feedType
                        _.each(responseData.value.items,function(itemData){
                            itemData.feedType=responseData.value.feedType;
                        });
                        items = tempListC.parse(responseData); //利用list collection格式化
                        _.each(items, function(item) {
                            var itemV = new ReplyItemV({
                                "model": new ReplyItemM(item),
                                "replyCb": function(responseData) {
                                    //如果带回复列表，自动添加一条新回复
                                    if (responseData.success && that.get('listOpts')) {
                                        that.addNewReply(responseData.value);
                                    }
                                },
                                "hideReplyRef": true //隐藏回复引用
                            }).render();
                            itemV.$el.appendTo(listEl);
                            that.items.push(itemV);
                        });
                        //设置分页总数
                        totalCount=responseData.value.totalCount;
                        //that.pagination.setTotalSize(responseData.value.totalCount);
                        if (listOpts.withPagination) {
                            that._setTotalSize(responseData.value.totalCount);
                        } else {
                            summaryCount = totalCount - 10;
                            if (summaryCount > 0) {
                                $('.num', summaryEl).text(summaryCount);
                                $('.jump-to-detail-l', summaryEl).attr('href', '#stream/showfeed/=/id-' + items[0].feedID + '/pn-2');
                                summaryEl.show();
                            } else {
                                summaryEl.hide();
                            }
                        }
                        //回写回复总数
                        if(totalCount>0){
                            if (numEl.length > 0) {
                                numEl.text(totalCount);
                            } else {
                                triggerEl.html(triggerText+'(<span class="num">'+totalCount+'</span>)');
                            }
                        }
                        //隐藏加载loading
                        that._hideListLoading();
                        listOpts.replyListCb&&listOpts.replyListCb.call(that,responseData,requestData);
                    }
                }
            },{
                "mask": triggerEl
            });
        },
        _renderInput: function(wSelector) {
            var elEl = this.element,
                wEl = $(wSelector),
                inputEl,
                atInput;
            if (_.isUndefined(wSelector)) {
                inputEl = $('.fs-reply-main-wrapper .fs-reply-input', elEl);
            } else {
                inputEl = $('.fs-reply-input', wEl);
            }
            //输入框at功能
            atInput = new AtInput({
                "element": inputEl
            });
            //placeholder
            util.placeholder(inputEl);
            //禁用esc键
            inputEl.keydown(function(evt){
                if(evt.keyCode==27){
                    evt.preventDefault();
                }
            });
            //输入控制在2000字内
            /*inputEl.on('keyup',function(evt){
                var inputEl=$(evt.currentTarget);
                var val=inputEl.val();
                if(val.length>2000){
                    inputEl.val(val.slice(0,2000)).trigger('autosize.resize');
                    //evt.preventDefault();
                }
            });*/
            //保留引用供以后删除
            inputEl.data('atInput', atInput);
        },
        _renderMedia: function(wSelector) {
            var elEl = this.element,
                wEl = $(wSelector),
                mediaEl,
                inputEl,
                media;
            if (_.isUndefined(wSelector)) {
                mediaEl = $('.fs-reply-main-wrapper .fs-reply-media', elEl);
                inputEl = $('.fs-reply-main-wrapper .fs-reply-input', elEl);
            } else {
                mediaEl = $('.fs-reply-media', wEl);
                inputEl = $('.fs-reply-input', wEl);
            }
            //设置多媒体功能
            media = new MediaMaker({
                "element": mediaEl,
                "limitUploadSingle":true,
                "action": this.get('publishAction'),
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    },
                    "h5imgupload":{
                        "limitUploadSingle":false   //图片上传可以选多个，覆盖上面limitUploadSingle设置
                    }
                }
            });
            //保留引用供以后删除
            mediaEl.data('media', media);

            if (!this.get('withMedia')) { //不带多媒体的话直接隐藏
                mediaEl.addClass('fn-hide-abs'); //绝对式隐藏
            }
        },
        _emptyList: function() {
            var elEl = this.element,
                listEl = $('.fs-reply-list', elEl),
                items = this.items;
            _.each(items, function(itemV) {
                itemV.destroy && itemV.destroy();
            });
            this.items=[];  //引用释放
            listEl.empty();
        },
        "_showListLoading": function () {
            var loading = this.loading,
                elEl = this.element,
                loadingEl = $('.fs-reply-list-wrapper .list-loading', elEl);
            loadingEl.show();
        },
        "_hideListLoading": function () {
            var elEl = this.element,
                loadingEl = $('.fs-reply-list-wrapper .list-loading', elEl);
            loadingEl.hide();
        },
        replyValid: function() {
            var subWEl = $('.fs-reply-submit-box', this.element).eq(0), //可能包含子回复，所以取第一个
                inputEl = $('.fs-reply-input', subWEl),
                requestData = this.getReplyRequestData();
            var passed = true;
            if (requestData['replyContent'].length == 0) {
                util.showInputError(inputEl.closest('.fs-reply-input-inner'));
                passed = false;
                return passed;
            }
            if(requestData['replyContent'].length>2000){
                util.alert('发送内容不超过2000字，目前已超出<em>'+(requestData['replyContent'].length-2000)+'</em>个字');
                passed = false;
                return passed;
            }
            return passed;
        },
        getReplyRequestData: function() {
            var subWEl = $('.fs-reply-submit-box', this.element),
                mediaEl = $('.fs-reply-media', subWEl),
                media = mediaEl.data('media'),
                requestData = {},
                files;
            var attachTypeNames = []; //上传附件类型
            //主回复框
            _.extend(requestData, this.get('defaultRequestData'));
            //回复内容
            requestData["replyContent"] = _.str.trim($('.fs-reply-input', subWEl).val());
            //上传文件信息
            requestData["fileInfos"] = [];
            files = media.getUploadValue();
            _.each(files, function(file) {
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
                            requestData['replyContent'] = '分享' + attachTypeNames.join('、');
                        } else if (attachTypeNames.length > 1) { //两个用"和"
                            requestData['replyContent'] = '分享' + attachTypeNames.join('和');
                        } else { //一个直接输出
                            requestData['replyContent'] = '分享' + attachTypeNames[0];
                        }
                    }
                }
            }
            return requestData;
        },
        reply: function(evt) {
            var that = this;
            var meEl = $(evt.currentTarget);
            var requestData;
            var mediaEl,
                media;
            var subWEl = $('.fs-reply-submit-box', this.element),
                inputEl = $('.fs-reply-input', subWEl);
            var atContents;
            if (this.replyValid()) {
                mediaEl = $('.fs-reply-media', subWEl);
                media = mediaEl.data('media');
                media.send(function(sendCb,sendModal) {

                    /**
                     * 发回复核心执行体
                     */
                    var sendCore=function(){
                        util.api({
                            "type": "post",
                            "data": requestData,
                            "url": that.get('sendPath'),
                            "success": function(responseData) {
                                //回复成功追加item
                                if (responseData.success) {
                                    //发布清空
                                    that.clearSubmit();
                                }
                                sendCb(); //清理
                                //调用自定义回复发送后的回调
                                that.get('replyCb').call(that, responseData);
                            },
                            "error": function(){
                            	sendCb(); //清理
                            	util.alert('系统繁忙，请稍后重试。');
                            }
                        },{
                            "submitSelector":meEl
                        });
                    };
                    //保证获取完整的fileInfos信息
                    requestData = that.getReplyRequestData();
                    if (_.isFunction(that.get('replyDefaultRequestData'))) {
                        _.extend(requestData, that.get('replyDefaultRequestData').call(that, requestData));
                    } else {
                        _.extend(requestData, that.get('replyDefaultRequestData'));
                    }
                    //获取at内容
                    atContents=util.getAtFromInput(inputEl);
                    //验证是否有多加的at范围
                    if(atContents.length>0&&requestData.feedID){
                        util.api({
                            "url":"/Feed/SendFeedReplyAtEmpCheck",
                            "data":{
                                "feedID":requestData.feedID,
                                "replyContent":requestData.replyContent
                            },
                            "success":function(responseData){
                                var dataRoot,
                                    hasNewRange=false,
                                    message='回复中提到的员工：';
                                if(responseData.success){
                                    dataRoot=responseData.value;
                                    hasNewRange=!dataRoot.value;
                                    if(hasNewRange){
                                        message+=dataRoot.value1+'不在信息的原始范围中，是否要添加？添加后他们将能看到信息的原文和所有该信息的回复。'
                                        util.confirm(message, '添加范围提示', function () {
                                            sendCore();
                                        },{
                                            "onCancel": function () {

                                                sendModal.hide();
                                            }
                                        });
                                    }else{
                                        //直接发送
                                        sendCore();
                                    }
                                    
                                }
                            }
                        });
                    }else{
                        //直接发送
                        sendCore();
                    }
                }, subWEl);
            }
            //多层嵌套回复的情况，一定要组织事件的冒泡，不然可能会激发父提交

            evt.stopPropagation();

        },
        /* 提交回复 */
        addNewReply: function(feedReplyID) {
            var that = this;
            var elEl = this.element,
                listEl = $('.fs-reply-list', elEl),
                triggerEl = this.get('trigger'),
                triggerText=this.get('triggerText'),
                numEl = $('.num', triggerEl); //回复数
            var listOpts = this.get('listOpts');
            var requestData={
                "feedReplyID":feedReplyID
            };
            _.extend(requestData,this.get('detailDefaultRequestData'));
            util.api({
                type: 'get',
                data: requestData,
                url: this.get('getReplyPath'),
                success: function(responseData) {
                    var items,
                        tempListC = new ReplyListC();
                    if (responseData.success) {
                        items = tempListC.parse(responseData); //利用list collection格式化
                        _.each(items, function(item) {
                            var itemV = new ReplyItemV({
                                "model": new ReplyItemM(item),
                                "replyCb": function(responseData) {
                                    //如果带回复列表，自动添加一条新回复

                                    if (responseData.success && that.get('listOpts')) {

                                        that.addNewReply(responseData.value,responseData.feedType);
                                    }
                                },
                                "hideReplyRef": true //隐藏回复引用
                            }).render();
                            var elEl = itemV.$el;
                            elEl.prependTo(listEl);
                            that.items.push(itemV);
                        });
                        if (listOpts.withPagination) {
                            //重新设置总记录数 当前总记录+1
                            //that.pagination.setTotalSize(that.pagination.get('totalSize')+1);
                            that._setTotalSize(that.paginations[0].get('totalSize') + 1);
                        }
                        //设置显示回复数
                        if (numEl.length > 0) {
                            numEl.text(parseInt(numEl.text()) + 1);
                        } else {
                            triggerEl.html(triggerText+'(<span class="num">1</span>)');
                        }
                        that._updateGroupInfo(items[0].feedID,true); //只可能有一个item
                    }
                }
            });
        },
        render: function() {
            var listOpts = this.get('listOpts');
            var result = FsReply.superclass.render.apply(this, arguments);
            //渲染element
            this._renderEl();
            //分页组件渲染
            if (listOpts) {
                if (listOpts.withPagination) {
                    this._initPagination(); //初始化分页组件
                } else {
                    this._initReplyListSummary(); //初始化列表summary信息
                }
            }
            return result;
        },
        _onRenderFeedOpts: function() {

        },
        destroy: function() {
            var elEl = this.element;
            var result;
            $('.fs-reply-input', elEl).each(function() {
                var atInput = $(this).data('atInput');
                atInput && atInput.destroy();
            });
            $('.fs-reply-media', elEl).each(function() {
                var media = $(this).data('media');
                media && media.destroy();
            });
            //数据仓库销毁
            this.items = [];
            //分页组件销毁
            //this.pagination&&this.pagination.destroy();
            _.each(this.paginations, function(pagination) {
                pagination.destroy();
            });
            this.paginations = [];
            //回复列表xhr清空
            this._replyListXhr&&this._replyListXhr.abort();
            this._replyListXhr=null;
            result = FsReply.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = FsReply;
});