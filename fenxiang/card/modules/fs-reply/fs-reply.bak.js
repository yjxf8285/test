/**
 * FS回复
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var publish=require('modules/publish/publish'),
        Widget=require('widget'),
        util=require('util'),
        moment=require('moment'),
        moduleStyle=require('modules/fs-reply/fs-reply.css'),
        moduleTpl=require('modules/fs-reply/fs-reply.html'),
        Pagination=require('uilibs/pagination'),
        feedHelper=require('modules/feed-list/feed-list-helper');

    var AtInput=publish.atInput,
        MediaMaker=publish.mediaMaker,
        moduleTplEl=$(moduleTpl);
    var FsReply=Widget.extend({
        "attrs":{
            "trigger": {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            },
            "publishAction":{
                value: ['imgUpload','attachUpload','at'],
                getter: function(val) {
                    return [].concat(val);
                }
            },
            "listPath":"/Feed/GetFeedReplysByFeedID",  //请求回复列表地址
            "sendPath":"/feed_html/sendFeedReply", //发送回复地址
            //可以是{}或者Function
            "defaultRequestData":{
                "value":{},
                "getter":function(val){
                    if(_.isFunction(val)){
                        return val();
                    }else{
                        return val;
                    }
                }
            }, //默认回复列表请求数据
            "replyDefaultRequestData":{
                "value":{},
                "getter":function(val){
                    if(_.isFunction(val)){
                        return val();
                    }else{
                        return val;
                    }
                }
            },
            "replyCb":FS.EMPTY_FN,
            "bbarTpl":'<span class="fs-reply-send-sms"><input type="checkbox" name="send_sms" />&nbsp;<label>立即发送短信息给：<span class="user-name">xx</span></label></span>',
            "submitText":"回复",
            "placeholder":"添加回复……",
            "withPagination":true
        },
        "events": {
            "click .text-visible-l": "_textVisibleCtrl",
            "click .fs-reply-reply-trigger":"_subReplyCtrl",
            "click .fs-reply-sub":"reply"
        },
        setup:function(){
            var result=FsReply.superclass.setup.apply(this,arguments);
            this._setupElement();
            this._setupTrigger();
            this._bindEvents();
            this._initPagination();
            this.listStore=[];  //保存当前回复列表数据
            return result;
        },
        /*_textVisibleCtrl:function(e){
            var itemEl=this._getItemEl(e.currentTarget),
                leftTextEl=$('.fs-reply-text-left',itemEl),
                ctrlEl=$('.text-visible-l',itemEl);
            ctrlEl.data('initText')||ctrlEl.data('initText',ctrlEl.text());
            if(leftTextEl.is(':visible')){
                ctrlEl.text(ctrlEl.data('initText'));
                leftTextEl.hide();
            }else{
                ctrlEl.text('收起正文');
                leftTextEl.show();
            }   
            e.preventDefault();
        },*/
        _textVisibleCtrlInit:function(ctrlSelector){
            var ctrlEl=$(ctrlSelector),
                itemEl=this._getItemEl(ctrlEl),
                textInnerEl=$('.fs-reply-text-inner',itemEl),
                pEl=$('p',textInnerEl);
            if(pEl.height()>textInnerEl.height()){
                ctrlEl.show();
            }else{
                ctrlEl.hide();
            }
        },
        _textVisibleCtrl:function(e){
            var itemEl=this._getItemEl(e.currentTarget),
                textInnerEl=$('.fs-reply-text-inner',itemEl),
                ctrlEl=$('.text-visible-l',itemEl);
            //设置按钮初始文字
            ctrlEl.data('initText')||ctrlEl.data('initText',ctrlEl.text());
            //设置面板初始高度
            textInnerEl.data('initHeight')||textInnerEl.data('initHeight',textInnerEl.height());
            if(textInnerEl.get(0).style.height=="auto"){
                ctrlEl.text(ctrlEl.data('initText'));
                textInnerEl.height(textInnerEl.data('initHeight'));
            }else{
                ctrlEl.text('收起正文');
                textInnerEl.css('height','auto');
            }
            e.preventDefault();
        },
        /**
         * 子回复面板显隐控制
         * @param e
         * @private
         */
        _subReplyCtrl:function(e){
            var itemEl=this._getItemEl(e.currentTarget),
                subReplyEl=$('.fs-reply-sub-wrapper',itemEl);
            if(subReplyEl.length==0){
                subReplyEl=this._renderSubHtml(itemEl);
            }
            if(subReplyEl.is(':visible')){
                subReplyEl.hide();
            }else{
                subReplyEl.show();
            }
            e.preventDefault();
        },
        _getItemEl:function(elSelector){
            return $(elSelector).closest('.fs-reply-item');
        },
        _setupElement:function(){
            this.element.addClass('fs-reply').hide();
            this._renderHtml();
        },
        _setupTrigger:function(){
            var that=this;
            var elEl=this.element;
            this.get("trigger").addClass('fs-reply-trigger').on("click", function(e) {
                e.preventDefault();
                if(elEl.is(':visible')){
                    that.hide();
                }else{ 
                    that.show();
                }
            });
        },
        _initPagination:function(){
            var that=this;
            var elEl=this.element,
                pagEl=$('.fs-reply-pagination',elEl);
            this.pagination=new Pagination({
                "element":pagEl,
                "pageSize":10   //回复列表每页10条
            }).on('page',function(){
                that._renderReplyList();
            });
        },
        show:function(){
            var elEl=this.element;
            if(!this.rendered){
                this.render();
            }
            elEl.show();
            this.trigger('show');
        },
        hide:function(){
            var elEl=this.element;
            elEl.hide();
            this.trigger('hide');
        },
        refresh:function(){
            var activePageNumber=this.pagination.get('activePageNumber');
            if(activePageNumber!=1){
                this.pagination.jump(1);
            }else{
                this._renderReplyList();
            }
        },
        /**
         * 清空发布框相关
         * @param subWrapperSelector
         */
        clearSubmit:function(subWrapperSelector){
            var subWEl=$(subWrapperSelector),
                inputEl=$('.fs-reply-input',subWEl),
                mediaEl=$('.fs-reply-media',subWEl),
                media=mediaEl.data('media');
            //清空input
            inputEl.val('');
            //清空多媒体
            media.resetAll();
        },
        _bindEvents:function(){
            this.on('show',function(){
                this._renderReplyList();
            });
        },
        _getInputTpl:function(){
            var tplStr='<div class="fs-reply-input-wrapper">'+
                '<div class="fs-reply-input-inner">'+
                    '<textarea class="fs-reply-input" placeholder="'+this.get('placeholder')+'"></textarea>'+
                '</div>'+
                '<div class="fs-reply-media"></div>'+
                '<div class="fs-reply-bbar fn-clear">'+
                    '<div class="fs-reply-bbar-l">'+this.get('bbarTpl')+'</div>'+
                    '<div class="fs-reply-bbar-r"><button type="button" class="fs-reply-sub button-green">'+this.get('submitText')+'</button></div>'+
                '</div>'+
            '</div>';
            return tplStr;
        },
        _renderHtml:function(){
            var elEl=this.element;
            elEl.html('<div class="LR-arrow"> <em class="S_line1_c">◆</em> <span>◆</span> </div><div class="fs-reply-main-wrapper fs-reply-submit-box">'+this._getInputTpl()+'</div>'+
            '<div class="fs-reply-list-wrapper"><ul class="fs-reply-list"></ul><div class="fs-reply-pagination"></div></div>');
            this._renderInput();
            this._renderMedia();
            return elEl;
        },
        /**
         * 创建回复的回复面板
         * @return {[type]} [description]
         */
        _renderSubHtml:function(itemSelector){
            var itemEl=$(itemSelector),
                itemContentEl=$('.fs-reply-item-content',itemEl),
                wEl=$('<div class="fs-reply-sub-wrapper fs-reply-submit-box"></div>');
            wEl.html(this._getInputTpl()).hide().appendTo(itemContentEl);

            this._renderInput(wEl);
            this._renderMedia(wEl);
            return wEl;
        },
        _getItemCompiled:function(){
            var itemTpl='<li class="fs-reply-item fn-clear">'+moduleTplEl.filter('.fs-reply-item').html()+'</li>',
                compiled=_.template(itemTpl);
            return compiled;
        },
        _renderReplyList:function(){
            var that=this;
            var elEl=this.element,
                listEl=$('.fs-reply-list',elEl);
            var requestData={};
            //准备请求数据
            requestData= _.extend(requestData,this.get('defaultRequestData'));
            //附加分页信息
            requestData= _.extend(requestData,{
                "pageSize":this.pagination.get('pageSize'),
                "pageNumber":this.pagination.get('activePageNumber')
            });
            //清空列表
            this._emptyList();
            util.api({
                "data":requestData,
                "type":"get",
                //"url":"/content/fs/data/list.txt",
                "url":this.get('listPath'),
                "success":function(responseData){
                    var htmlStr=[],
                        compiled=that._getItemCompiled(),
                        items;
                    if(responseData.success){
                        //设置分页总数
                        that.pagination.setTotalSize(responseData.value.totalCount);
                        items=responseData.value.items;
                        _.each(items,function(row,i){
                            var formatContent=feedHelper.feedContentFormat(row.replyContent);
                            htmlStr[i]=compiled({
                                "thumbSrc":FS.BASE_PATH+'/'+row.sender.profileImage+"2.jpg",
                                "replyContent":formatContent,
                                "createTime":moment(row.createTime).startOf('hour').fromNow(),
                                "replyContentLength":row.replyContentLength,
                                "feedReplyID":row.feedReplyID,
                                "senderName":row.sender.name,
                                "senderId":row.sender.employeeID
                            });
                        });
                        //设置listStore,便于以后找回
                        that.listStore=items;
                        listEl.html(htmlStr.join(""));
                        //设置内容显隐状态
                        $('.text-visible-l',listEl).each(function(){
                            that._textVisibleCtrlInit(this);
                        });
                    }
                }
            });
        },
        _renderInput:function(wSelector){
            var elEl=this.element,
                wEl=$(wSelector),
                inputEl,
                atInput;
            if(_.isUndefined(wSelector)){
                inputEl=$('.fs-reply-main-wrapper .fs-reply-input',elEl);
            }else{
                inputEl=$('.fs-reply-input',wEl);
            }
            //输入框at功能
            atInput=new AtInput({
                "element":inputEl,
                "data":[]
            });
            //placeholder
            util.placeholder(inputEl);
            //保留引用供以后删除
            inputEl.data('atInput',atInput);
        },
        _renderMedia:function(wSelector){
            var elEl=this.element,
                wEl=$(wSelector),
                mediaEl,
                media;
            if(_.isUndefined(wSelector)){
                mediaEl=$('.fs-reply-main-wrapper .fs-reply-media',elEl);
            }else{
                mediaEl=$('.fs-reply-media',wEl);
            }
            //设置多媒体功能
            media=new MediaMaker({
                "element":mediaEl,
                "action":this.get('publishAction')
            });
            //保留引用供以后删除
            mediaEl.data('media',media);
        },
        _emptyList:function(){
            var elEl=this.element,
                listEl=$('.fs-reply-list',elEl);
            $('.fs-reply-input',listEl).each(function(){
                $(this).data('atInput').destroy();
            });
            $('.fs-reply-media',listEl).each(function(){
                $(this).data('media').destroy();
            });
            listEl.empty();
        },
        replyValid:function(subWrapperSelector){
            var subWEl=$(subWrapperSelector),
                inputEl=$('.fs-reply-input',subWEl),
                v= _.str.trim(inputEl.val());
            var passed=true;
            if(v.length==0){
                util.toggleAnimate({
                    "element": inputEl,
                    "startProperty": {
                        "backgroundColor": "#DD4B39"
                    },
                    "endProperty": {
                        "backgroundColor": "white"
                    },
                    "animateOpts": {
                        "easing": "swing",
                        "duration": 130
                    },
                    "count": 2   //循环2次
                });
                passed=false;
            }
            return passed;
        },
        getReplyRequestData:function(subWrapperSelector){
            var subWEl=$(subWrapperSelector),
                mediaEl=$('.fs-reply-media',subWEl),
                media=mediaEl.data('media'),
                requestData={},
                files,
                feedReplyId,
                replyItemData,
                replyItemEl;
            //主回复框
            if(subWEl.hasClass('fs-reply-main-wrapper')){
                requestData["feedID"]=this.get('defaultRequestData').feedID;
            }else{  //子回复框
                //获取回复数据
                replyItemEl=subWEl.closest('.fs-reply-list');
                feedReplyId=$('[feedreplyid]',replyItemEl).attr('feedreplyid');
                replyItemData=this.getReplyDataById(feedReplyId);
                requestData["feedID"]=replyItemData.feedID;
                //如果是回复的回复，则填写被回复的回复的ID
                requestData["replyToReplyID"]=feedReplyId;
                //如果是回复的回复，则填写被回复的回复的发出人的ID
                requestData["replyToEmployeeID"]=replyItemData.employeeID;
            }
            //回复内容
            requestData["replyContent"]= _.str.trim($('.fs-reply-input',subWEl).val());
            //上传文件信息
            requestData["fileInfos"]=[];
            files=media.getUploadValue();
            _.each(files,function(file){
                if(file.uploadType=="img"){
                    requestData["fileInfos"].push({
                        "v": 2, //FeedAttachType
                        "v1": file.pathName,    //服务器端文件名
                        "v2": file.size, //文件总长度（字节）
                        "v3": file.name  //文件原名
                    });
                }else if(file.uploadType=="attach"){
                    requestData["fileInfos"].push({
                        "v": 3, //FeedAttachType
                        "v1": file.pathName,    //服务器端文件名
                        "v2": file.size, //文件总长度（字节）
                        "v3": file.name  //文件原名
                    });
                }
            });

            return requestData;
        },
        getReplyDataById:function(id){
            var listStore=this.listStore;
            return _.find(listStore,function(item){
                return item.feedReplyID==id;
            });
        },
        reply:function(e){
            var that=this;
            var requestData;
            var curEl=$(e.currentTarget),
                subWEl=curEl.closest('.fs-reply-submit-box'),
                mediaEl,
                media;
            if(this.replyValid(subWEl)){
                requestData=this.getReplyRequestData(subWEl);
                _.extend(requestData,this.get('replyDefaultRequestData'));
                mediaEl=$('.fs-reply-media',subWEl);
                media=mediaEl.data('media');
                media.send(function(sendCb){
                    util.api({
                        "type":"post",
                        "data":requestData,
                        "url":that.get('sendPath'),
                        "success":function(responseData){
                            //回复成功追加item
                            if(responseData.success){
                                //that.refresh();
                                that.addNewReply(responseData.value);
                                //发布清空
                                that.clearSubmit(subWEl);
                                sendCb();
                            }
                            //调用自定义回复发送后的回调
                            that.get('replyCb')(responseData);
                        }
                    });
                },subWEl);
            }
        },
        addNewReply:function(feedReplyID){
            var that=this;
            var elEl=this.element,
                listEl=$('.fs-reply-list',elEl);
            util.api({
                type:'get',
                data:{
                    feedReplyID:feedReplyID
                },
                url:'/feed_html/getFeedReplyByID',
                success:function(responseData){
                    var item,
                        htmlStr="",
                        itemEl,
                        formatContent="";
                    var compiled=that._getItemCompiled();
                    if(responseData.success){
                        item=responseData.value.items[0];
                        formatContent=feedHelper.feedContentFormat(item.replyContent);
                        htmlStr=compiled({
                            "thumbSrc":FS.BASE_PATH+'/'+item.sender.profileImage+"2.jpg",
                            "replyContent":formatContent,
                            "createTime":moment(item.createTime).startOf('hour').fromNow(),
                            "replyContentLength":item.replyContentLength,
                            "feedReplyID":item.feedReplyID,
                            "senderName":item.sender.name,
                            "senderId":item.sender.employeeID
                        });
                        //填充listStore
                        that.listStore.push(item);
                        itemEl=$(htmlStr);
                        listEl.prepend(itemEl);
                        //设置内容显隐状态
                        $('.text-visible-l',itemEl).each(function(){
                            that._textVisibleCtrlInit(this);
                        });
                        //重新设置总记录数 当前总记录+1
                        that.pagination.setTotalSize(that.pagination.get('totalSize')+1);
                    }
                }
            });
        },
        render:function(){
            var result=FsReply.superclass.render.apply(this,arguments);
            //分页组件渲染
            this.pagination.render();
            return result;
        },
        destroy:function(){
            var elEl=this.element;
            var result;
            $('.fs-reply-input',elEl).each(function(){
                var atInput=$(this).data('atInput');
                atInput&&atInput.destroy();
            });
            $('.fs-reply-media',elEl).each(function(){
                var media=$(this).data('media');
                media&&media.destroy();
            });
            //数据仓库销毁
            this.listStore=[];
            //分页组件销毁
            this.pagination.destroy();
            result=FsReply.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports=FsReply;
});