/**
 * 定义发布@、上传、录音、选人、选取可视范围、发布框自适应大小
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        detector = require('detector'),
        json = require('json'),
        Position=require('position'),
        moment = require('moment'),
        Events = require('events'),
        Widget=require('widget'),
        Overlay = require('overlay'),
        Dialog = require('dialog'),
        Tabs = require('uilibs/tabs'),
        filter = require('filter'),
        AutoComplete = require('autocomplete'),
        Select = require('select'),
        placeholder = require('placeholder'),
        Calendar = require('calendar'),
        SWFUpload = require('swfupload'),
        FsUpload = require('fsupload'),
        H5Uploader=require('h5uploader'),
        FlashUploader=require('flashuploader'),
        Scrollbar=require('scrollbar'), //滚动条
        publishTpl = require('modules/publish/publish.html'),
        publishStyle = require('modules/publish/publish.css'),
        publishHelper=require('./publish-helper');

    var publishTplEl = $(publishTpl);
    var DateSelect=publishHelper.DateSelect,
        TimeSelect=publishHelper.TimeSelect;

    var UPLOAD_FILES_PATH = FS.BASE_PATH + '/Files/Temp';
    var MEDIA_UPLOADER_INDEX=0; //MediaMaker上传计数

    //模块作用域范围内的contactData
    var contactData=util.getContactData();
    /**
     * 发布框自适应输入高度
     * @param {Object} elSelector
     */
    var AtInput = function (opts) {
        var elEl;
        opts = _.extend({
            "element": null,
            "withAt":false
        }, opts || {});
        elEl = $(opts.element);
        this.element = elEl;
        //placeholder
        util.placeholder(elEl);
        util.asyncOrder(['jslibs/jquery.autosize.js'], function () {
            elEl.addClass('autosize-animated').autosize({
                "append":" " //ie11下需要append一个空格才能返回正确的高度
            });
        });
        if(opts.withAt){
            //输入框中添加at提示
            util.asyncOrder(['stylelibs/jquery.atwho.css', 'jslibs/jquery.atwho.js','jslibs/jquery.atwho.custom.js'], function () {
                //at联系人部分
                elEl.atwho('@', {
                    //"data": atSpData[1].list,
                    "data":contactData["p"].concat(_.reject(contactData["g"],function(circleData){  //排除全公司
                        return circleData.id==999999;
                    })),
                    "callbacks": {
                        "filter": function (query, data, search_key) {
                            var stringMatch = filter.stringMatch,
                                startsWith=filter.startsWith;
                            var filterData=[],
                                filterData1,
                                filterData2;
                            var atSpData2=MediaMaker.prototype.atGetDefaultSpData();
                            var atViewTitleEl=$('#at-view .at-view-title'),
                                loadingEl=$('#at-view .loading-mask');
                            if(loadingEl.length==0){
                                loadingEl=$('<div class="loading-mask"><img src="'+FS.BLANK_IMG+'" class="loading-img" alt="loading" /></div>');
                                loadingEl.prependTo('#at-view');
                            }
                            if(atViewTitleEl.length==0){
                                atViewTitleEl=$('<h3 class="at-view-title"></h3>');
                                atViewTitleEl.prependTo('#at-view');
                            }
                            //直接隐藏loading
                            loadingEl.hide();
                            if (_.str.trim(query).length == 0) {    //如果为空，显示常用联系人信息
                                filterData=atSpData2[0].list.slice(0); //必须用副本，不然下次查询会被清除数据
                                if(filterData.length>0){
                                    atViewTitleEl.text('选择最近@提到的或直接输入').show();
                                }else{
                                    atViewTitleEl.hide();
                                }
                            } else {
                                filterData1 = stringMatch.apply(this, [data, query, {
                                    "key": "name"
                                }]);
                                filterData2 = startsWith.apply(this, [data, query.toLowerCase(), {
                                    "key": "spell"
                                }]);
                                //先插入filterData2的数据
                                _.each(filterData2,function(itemData){
                                    if(!_.find(filterData1,function(itemData2){
                                        return itemData2.id==itemData.id;
                                    })){
                                        filterData.push(itemData);
                                    }
                                });
                                filterData=filterData.concat(filterData1);
                                //title提示
                                if(filterData.length>0){
                                    atViewTitleEl.text('选择名称或轻敲空格完成输入').show();
                                }else{
                                    atViewTitleEl.hide();
                                }

                            }
                            return filterData;
                        },
                        matcher: function (flag, subtext) {
                            var match, matched, regexp;
                            //regexp = new RegExp(flag + '([\\S]*)$', 'gi');
                            regexp = new RegExp(flag + '([a-zA-Z0-9_\\u4e00-\\u9fa5]*)$', 'gi');    //汉字、数字、字母、下划线组合
                            match = regexp.exec(subtext);
                            matched = null;
                            if (match) {
                                matched = match[2] ? match[2] : match[1];
                            }
                            return matched;
                        },
                        sorter:function(query, items, searchKey){
                            return items;
                        }
                    }
                }).addClass('fs-publish-input');
            });
            elEl.change(function(){
                elEl.trigger('autosize.resize');
            });
        }
    };
    _.extend(AtInput.prototype, {
        "destroy": function () {
            this.element.trigger('autosize.destroy').removeClass('autosize-animated');
        }
    });
    /**
     * 全局上传面板，MediaMaker辅助类
     * @type {*}
     */
    var GlobalUploadDialog=Dialog.extend({
        "attrs":{
            "className":'fs-publish-g-upload-dialog',
            "content": publishTplEl.filter('.global-upload-dialog-wrapper').html(),
            "media":null,    //关联media的引用
            "actionModel":"attach",  //默认是文件上传模式
            "zIndex":1001
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .remove-l":"_removeFile"
        },
        "render":function(){
            var result=GlobalUploadDialog.superclass.render.apply(this,arguments);
            this._createUploader();
            return result;
        },
        "_updateListView":function(){
            var uploader=this.uploader,
                uploadFiles=uploader.uploadFiles;
            var fileItemEl=$('.file-item',this.element);
            fileItemEl.each(function(){
                var elEl=$(this);
                var fileId=elEl.attr('fileid');
                if(!_.find(uploadFiles,function(v){
                    return v.id==fileId;
                })){
                    elEl.remove();
                }
            });
        },
        "show":function(){
            var result,
                that;
            var uploader=this.uploader,
                uploadFiles=uploader.uploadFiles;
            var elEl=this.element,
                tableEl=$('.list-body',elEl);
            var media=this.get('media');
            if(media.id!=this.mediaId&&this.uploading){
                util.confirm('有上传操作占用，确定要结束上传吗', '确认操作', function () {
                    _.each(uploadFiles,function(uploadFile){
                        uploader.cancelUpload(uploadFile.id,false);
                    });
                    uploader.uploadFiles=[];
                    //that._updateListView();
                    $('tbody',tableEl).empty();
                    result=GlobalUploadDialog.superclass.show.apply(this,arguments);
                });
                this.mediaId=media.id;
            }else{
                //this._updateListView();
                result=GlobalUploadDialog.superclass.show.apply(this,arguments);
            }
            return result;
        },
        /**
         * 上传文件验证
         * @param file
         * @returns {boolean}
         */
        "uploadValid":function(file){
            return true;
        },
        /**
         * 渲染media下对应的上传文件
         * @param file
         * @param serverData
         */
        /*"_mediaRenderUploadItem":function(file, serverData){
            var actionModel=this.get('actionModel'),
                media=this.get('media');
            var mediaEl=media.element,
                listEl=$('.fs-publish-g'+actionModel+'upload-panel .fs-publish-upload-list', mediaEl);
            media.renderUploadItem(file, serverData, listEl, actionModel);
        },*/
        "_updateFileView":function(file,bytesLoaded){
            var elEl=this.element,
                listBodyEl=$('.list-body',elEl),
                fileItemEl=$('[fileid="'+file.id+'"]',listBodyEl),
                pbarEl=$('.upload-pbar',fileItemEl),
                pbar;
            if(fileItemEl.length==0){
                fileItemEl=$('<tr class="file-item" fileid="'+file.id+'"><td class="file-name">'+file.name+'</td><td class="upload-progress"><div class="upload-pbar-wrapper"><div class="upload-pbar"></div></div></td><td class="operation"><a href="#" class="remove-l">删除</a></td></tr>');
                fileItemEl.appendTo($('tbody',listBodyEl));
                pbarEl=$('.upload-pbar',fileItemEl);
                //设置进度条位置
                pbarEl.css({
                    "width": "100px"
                });
                pbar=new ProgressBar({
                    "element": pbarEl
                });
                pbarEl.data('progressBar',pbar);
            }
            var percent = Math.ceil((bytesLoaded / file.size) * 100) + '%';
            pbar = pbarEl.data('progressBar');
            pbar.setProgress(percent);
        },
        "_syncUploadFile":function(file){
            var elEl=this.element,
                tableEl=$('.list-body',elEl);
            var media=this.get('media'),
                gUploadStore=media.gUploadStore,
                uploader=this.uploader,
                uploadFile;
            uploadFile=media.getUploadFile(uploader,file.id);
            uploadFile.uploadType=util.getUploadType(uploadFile.name);
            gUploadStore.push(uploadFile);
            //取消swfupload上传
            uploader.core.cancelUpload(file.id,false);
            //从uploader.uploadFiles中移除对应文件
            media.removeUploadFile(uploader,file.id);
            //从列表中删除dom
            $('[fileid="'+file.id+'"]',tableEl).fadeOut(2000,function(){
                $(this).remove();
            });
        },
        "_createUploader":function(){
            var that=this;
            var uploader=new FsUpload({
                //"upload_url": FS.API_PATH + '/',
                "upload_url": FS.API_PATH + '/uploadfile_html/fileUpload',
                "file_types": "*.*",
                "file_types_description":"所有格式",
                "button_placeholder_id": "fs-publish-global-upload-btn",
                //"button_image_url": FS.BASE_PATH + "/html/fs/modules/publish/images/icon-upload-" + type+'.png',
                "button_text":'<span class="upload-text">上传</span>',
                //button_text_style : ".upload-text { color:#ff0000;}",
                button_width: 50,
                //button_disabled:true,
                button_height: 20,
                "fileDialogComplete": function (numFilesSelected, numFilesQueued) {
                    try {
                        if (numFilesQueued > 0) {
                            this.startUpload();
                        }
                    } catch (ex) {
                        this.debug(ex);
                    }
                },
                "upload_start_handler": function (file) {
                    var media=that.get('media'),
                        actionModel=that.get('actionModel');
                    var result=media.uploadStartHandler(file,actionModel,'g');
                    if(result){
                        //更新file显示
                        that._updateFileView(file,0);
                        that.uploading = true;  //设置上传正在进行中的标志
                    }
                    return result;
                },
                "upload_progress_handler": function (file, bytesLoaded) {
                    var media=that.get('media'),
                        actionModel=that.get('actionModel');
                    var result=media.uploadProgressHandler(file, bytesLoaded,actionModel,'g');
                    //更新file显示
                    that._updateFileView(file,bytesLoaded);
                    return result;
                },
                "upload_success_handler": function (file, serverData) {
                    var media=that.get('media'),
                        actionModel=that.get('actionModel');
                    var result=media.uploadSuccessHandler(file, serverData,actionModel,'g');
                    //更新file显示
                    that._updateFileView(file,file.size);   //上传成功，bytesLoaded==file.size
                    //上传成功后从uploader.uploadFiles中把file移入到gUploadStore中
                    that._syncUploadFile(file);
                    return result;
                },
                "upload_error_handler": function (file, errorCode) {
                    var media=that.get('media'),
                        actionModel=that.get('actionModel');
                    var result=media.uploadErrorHandler(file, errorCode,actionModel,'g');
                    return result;
                },
                "upload_complete_handler": function () {
                    var media=that.get('media'),
                        actionModel=that.get('actionModel');
                    var result=media.uploadCompleteHandler(actionModel,'g');
                    that.uploading = false;  //变更upload状态，上传完成
                    return result;
                }
            });
            uploader.uploadFiles=[];
            uploader.type = "global";
            uploader.uploaded = true;

            this.uploader=uploader;
        },
        /**
         * 删除file
         */
        "_removeFile":function(evt){
            var currentTargetEl=$(evt.currentTarget),
                trEl=currentTargetEl.closest('tr');
            var fileId=trEl.attr('fileid'),
                uploader=this.uploader;
            var actionModel=this.get('actionModel'),
                media=this.get('media');
            var mediaEl=media.element,
                listEl=$('.fs-publish-g'+actionModel+'upload-panel .fs-publish-upload-list', mediaEl),
                fileItemEl=$('[fileid="'+fileId+'"]',listEl);
            //清除swfupload容器
            uploader.core.cancelUpload(fileId);
            //触发media下的文件删除事件
            $('.file-remove-l',fileItemEl).click();
            trEl.remove();  //清除dom
            evt.preventDefault();
        },
        "_submit":function(){
            this.hide();
        },
        "_cancel":function(){
            this.hide();
        },
        "_onRenderActionModel":function(val){
            var uploader=this.uploader;
            if(uploader){
                setTimeout(function(){
                    if(val=="img"){
                        uploader.core.setFileTypes("*.jpg;*.gif;*.jpeg;*.png", "图片");
                    }else{
                        uploader.core.setFileTypes("*.*", "文件");
                    }
                },500); //延时500ms，需要等到swfupload方法可用后再调用setFileTypes方法
            }

        },
        "destroy":function(){
            var result;
            this.uploader&&this.uploader.destroy();
            this.uploader=null;
            result=GlobalUploadDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    /**
     * 上传、附件、投票、at
     */
    var MediaMaker = function (opts) {
        opts = _.extend({
            "element": null,
            "limitUploadSingle":false,  //是否限制单一文件上传(一次只能提交唯一一个上传文件)
            "action": ['h5imgupload', 'h5attachupload', 'vote', 'at','topic'],
            "actionOpts": {}
        }, opts || {});
        this.id='media-'+MediaMaker.idIndex;
        this.opts = opts;
        this.element = $(opts.element);
        this.uploaders={};  //存储上传实例
        this.uploadFiles={}; //上传文件存储
        this.init();
        MediaMaker.idIndex++;
    };
    _.extend(MediaMaker.prototype, {
        "init": function () {
            var that = this;
            var elEl = this.element,
                opts = this.opts;
            var btnWEl,
                panelWEl;
            elEl.html('<div class="fs-publish-action-btns"></div><div class="fs-publish-action-panels"></div>');
            btnWEl = $('.fs-publish-action-btns', elEl);
            panelWEl = $('.fs-publish-action-panels', elEl);
            _.each(opts.action, function (v) {
                var vName = v.toLowerCase();
                var btnEl = $('<a href="javascript:;" class="fs-publish-' + vName + '-btn fs-publish-media-btn"></a>'),
                    panelBoxEl = $('<div class="fs-publish-media-panel-wrapper"></div>'),
                    panelCloseBtnEl = $('<span class="close-btn">×</span>'),
                    panelEl = $('<div class="fs-publish-' + vName + '-panel fs-publish-media-panel"></div>');
                btnEl.appendTo(btnWEl);

                panelCloseBtnEl.appendTo(panelBoxEl);
                panelEl.appendTo(panelBoxEl);
                panelBoxEl.appendTo(panelWEl);
                //通过自定义事件控制面板的显隐
                btnEl.bind('showpanel', function () {
                    panelBoxEl.show();
                });
                panelCloseBtnEl.click(function () {
                    that[v + 'Clear']();
                    panelBoxEl.hide();
                    that.trigger('closeaction',v);
                });
                //调用子init
                that[v].call(that);
            });
            //监听showpanel事件
            this.on('showpanel',function(actionName){
                var vName = actionName.toLowerCase();
                var panelEl = $('.fs-publish-' + vName + '-panel',elEl),
                    panelBoxEl=panelEl.closest('.fs-publish-media-panel-wrapper');
                panelBoxEl.show();
            });
            //设置上传事件监听
            this.on('uploadstart',function(actionName,uploadData){});
            this.on('uploadprogress', function (actionName,uploadDat) {});
            this.on('uploadsuccess', function (actionName,uploadData) {});
            this.on('uploadfailure', function (actionName,uploadData) {});
            //test
            this.on('alluploadcomplete', function () {});
            this.on('typeuploadcomplete', function (actionName) {
                var uploadStatus=that.getTotalUploadStatus();
                if(uploadStatus.uploaded){  //全部子上传完毕触发alluploadcomplete事件
                    that.trigger("alluploadcomplete");
                }
            });
        },
        /**
         * 根据actionName获取对应的button和panel
         * @param actionName
         */
        "getDomByActionName":function(actionName){
            var elEl = this.element;
            var btnEl = $('.fs-publish-' + actionName + '-btn', elEl),
                panelEl = $('.fs-publish-' + actionName + '-panel', elEl);
            return {
                "button":btnEl,
                "panel":panelEl
            };
        },
        "getUploadItem": function (actionName,uploadData) {
            var itemRef = this.getDomByActionName(actionName),
                panelEl=itemRef.panel,
                uploadType=uploadData.uploadType,
                listEl=$('.fs-publish-upload-list',panelEl);
            var fileName = uploadData.name,
                fileId=uploadData.id;
            var itemEl = $('[fileid="' + fileId + '"]', listEl);
            if (itemEl.length == 0) {
                itemEl = $('<div class="fs-publish-upload-item" filename="' + fileName + '" fileid="' + fileId + '"></div>');
                itemEl.html('<div class="fs-publish-upload-item-inner fn-clear"><div class="thumb"></div><div class="summary"></div></div><div class="fs-publish-upload-pbar"></div>');
                itemEl.appendTo(listEl);
            }
            return itemEl;
        },
        "renderUploadItem":function(actionName,uploadData){
            var serverData = uploadData.serverData;
            var itemEl = this.getUploadItem(actionName,uploadData),
                innerEl = $('.fs-publish-upload-item-inner', itemEl),
                thumbEl = $('.thumb', innerEl),
                summaryEl = $('.summary', innerEl);
            if (uploadData.uploadType == "img") {
                thumbEl.html('<div class="thumb-img"><img class="blank-place" src="' + serverData.value + '" alt="' + uploadData.name + '" /></div>');
            } else {
                thumbEl.html('<div class="thumb-attach"><img src="' + FS.ASSETS_PATH + '/images/clear.gif" alt="' + uploadData.name + '" class="icon-file fs-attach-' + util.getFileType(uploadData) + '-icon" /></div>');
            }
            summaryEl.html('<p class="file-name"><a href="javascript:;" title="'+uploadData.name+'">' + uploadData.name + '</a></p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
            return itemEl;
        },
        "renderUploadError":function(actionName,uploadData){
            var itemEl = this.getUploadItem(actionName,uploadData),
                innerEl = $('.fs-publish-upload-item-inner', itemEl),
                thumbEl = $('.thumb', innerEl),
                summaryEl = $('.summary', innerEl);
            thumbEl.html('<img src="' + FS.ASSETS_PATH + '/images/error.png" alt="' + uploadData.name + '" />');
            summaryEl.html('<p class="file-error">上传失败(' + uploadData.serverData.message + ')，请取消后重试</p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
        },
        /**
         * 删除一个uploadData,同时删除对应的Dom
         */
        "removeUploadItem":function(actionName,id){
            var itemEl = this.getUploadItem(actionName,{
                "name":"",
                "id":id
            });
            var uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName];
            typeFiles=_.filter(typeFiles,function(itemData){
                return id!=itemData.id;
            });
            //重设回原来的数据存储
            this.uploadFiles[actionName]=typeFiles;
            //删除对应的dom
            itemEl.remove();
        },
        /**
         * 更新上传信息
         * @param uploader
         * @param infoSelector
         */
        "updateUploadInfo": function (actionName) {
            var itemRef=this.getDomByActionName(actionName),
                panelEl=itemRef.panel,
                infoEl=$('.fs-publish-upload-info',panelEl);
            var uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName],
                totalSize=0;
            _.each(typeFiles,function(uploadData){
                totalSize+=uploadData.size;
            });
            infoEl.html('共添加了' + typeFiles.length + '个文件，总大小' + util.getFileSize(totalSize)+'&nbsp;&nbsp;<a href="#" class="file-remove-all-l" title="全部取消">全部取消</a>');
            if(typeFiles.length>0){
                infoEl.show();
            }else{
                infoEl.hide();
                panelEl.closest('.fs-publish-media-panel-wrapper').hide();
            }
        },
        /**
         * 上传文件筛选
         * @param actionName
         * @param fileData
         * @param uploadType
         * @returns {Array}
         */
        "uploadFilter":function(actionName,fileData,uploadType){
            fileData=[].concat(fileData);
            var passedFiles=[], //保存筛选后的文件
                uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName],
                message;
            var uploadFileSizeLimit=contactData["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            _.each(fileData,function(file){
                if (file.size < uploadFileSizeLimit*1024*1024&&file.size>0) { //最大uploadFilesSizeLimit
                    if(!_.find(typeFiles,function(existFile){
                        return existFile.name==file.name;
                    })){
                        if (uploadType=="img"&&util.getFileType(file)=="jpg") {
                            passedFiles.push(file);
                        }
                        if(uploadType=="attach"){
                            passedFiles.push(file);
                        }
                    }
                } //最大20m
            });
            if (passedFiles.length < fileData.length) {
                if(uploadType=="img"){
                    message="选择的文件类型必须为jpg、gif、jpeg或png，大小不能超过"+uploadFileSizeLimit+"MB且文件名不能相同，内容不能为空。本次添加了" + passedFiles.length + "个文件。";
                }else if(uploadType=="attach"){
                    message="选择的文件大小不能超过"+uploadFileSizeLimit+"MB且文件名不能相同，内容不能为空。本次添加了" + passedFiles.length + "个文件。";
                }
                util.alert(message);
            }
            return passedFiles;
        },
        /**
         * 设置上传存储，已存在的存储更新存储信息
         */
        "setUploadFile":function(actionName,uploadData){
            var uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName]||[];
            if(!_.find(typeFiles,function(itemData){
                if(itemData.id==uploadData.id){
                    _.extend(itemData,uploadData);
                    return true;
                }
            })){
                typeFiles.push(uploadData);
            }
            //重设回存储引用
            uploadFiles[actionName]=typeFiles;

        },
        /**
         * 通过id获取对应类型下的数据存储
         */
        "getUploadFile":function(actionName,id){
            var uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName]||[];
            return _.find(typeFiles,function(itemData){
                return itemData.id==id;
            });
        },
        /**
         * 根据id清空对应的数据存储，并返回被清除的数据
         * @param actionName
         * @param id
         * @returns {*}
         */
        "removeUploadFile":function(actionName,id){
            var uploadFiles=this.uploadFiles,
                typeFiles=uploadFiles[actionName]||[];
            var removeData;
            typeFiles= _.filter(typeFiles,function(itemData){
                if(itemData.id!=id){
                    return true;
                }else{
                    removeData=itemData;
                    return false;
                }
            });
            uploadFiles[actionName]=typeFiles;
            return removeData;
        },
        /**
         * 获取所有的上传状态信息，包括已上传的大小，总大小，是否上传完毕
         */
        "getTotalUploadStatus":function(){
            var uploadFiles=this.uploadFiles,
                uploadedSize= 0,
                totalSize= 0,
                uploaded=true;
            _.each(uploadFiles,function(typeFiles){
                _.each(typeFiles,function(itemData){
                    uploadedSize+=itemData.uploadedSize;
                    totalSize+=itemData.size;
                    if(!itemData.uploaded){
                        uploaded=false;
                    }
                });
            });
            return {
                "uploadedSize":uploadedSize,
                "totalSize":totalSize,
                "uploaded":uploaded
            };
        },
        /**
         * 获取所有的已上传成功的file信息
         */
        "getUploadValue":function(){
            var uploadFiles=this.uploadFiles,
                readyFiles=[];
            _.each(uploadFiles,function(typeFiles){
                _.each(typeFiles,function(itemData){
                    //if(itemData.uploaded){
                    readyFiles.push(_.extend({
                        "pathName":itemData.serverData.value.filePath    //返回的服务端文件路径
                    },itemData));
                    //}
                });
            });
            return readyFiles;
        },
        /**
         * 基于XMLHttpRequest的异步图片上传
         * 基于window.URL || window.webkitURL本地图片预览
         */
        "h5imgupload":function(){
            var that=this;
            var opts = this.opts,
                limitUploadSingle=opts.limitUploadSingle,  //限制只能选一个上传文件，在所有类型范围内限制
                actionOpts = opts.actionOpts,
                selfOpts = actionOpts["h5imgupload"] || {},
                TypeLimitUploadSingle=selfOpts.limitUploadSingle, //可以覆盖opts.limitUploadSingle
                isMultiple; //是否支持多选
            var elEl = this.element;
            var btnEl = $('.fs-publish-h5imgupload-btn', elEl),
                panelEl = $('.fs-publish-h5imgupload-panel', elEl);
            //btnEl.replaceWith('<span class="fs-publish-h5imgupload-btn fs-publish-media-btn"></span>');
            //btnEl=$('.fs-publish-h5imgupload-btn', elEl);   //重新获取
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="upload" class="btn-shadow" /><input class="fs-publish-h5-img-upload fs-publish-h5-upload" type="file" title="添加图片（多张）" />');
            //设置link title
            //$('.fs-publish-h5-upload',btnEl).attr('title','添加图片（多张）');
            btnEl.attr('title','添加图片（多张）');
            if(limitUploadSingle&&TypeLimitUploadSingle!==false){
                btnEl.attr('title','添加图片（一张）');
                $('.fs-publish-h5-upload',btnEl).attr('title','添加图片（一张）');
                isMultiple=false;
            }else{
                isMultiple=true;
            }
            panelEl.html('<div class="fs-publish-upload-list fn-clear"></div><div class="fs-publish-upload-info color-333333"></div>');


            var h5ImgUploader=new H5Uploader({
                multiple:isMultiple,
                accept:"image/*",
                fileInput: $('.fs-publish-h5-upload',btnEl).get(0),
                url: '/File/UploadFile',
                filter: function (files) {
                    return that.uploadFilter("h5imgupload",files,"img");
                },
                onSelect: function (files) {
                    if (files.length <= 0){
                        return;
                    }
                    if(panelEl.is(':hidden')){
                        that.trigger('showpanel','h5ImgUpload');
                    }
                    //设置数据存储
                    var typeFiles=that.uploadFiles["h5imgupload"]||[];
                    _.each(files,function(fileData){
                        var itemEl,
                            uploadData;
                        //组装上传文件信息
                        uploadData={
                            "id":fileData.id,
                            "name":fileData.name,
                            "size":fileData.size,
                            "uploaded":false,
                            "uploadedSize":0,   //已上传的大小
                            "uploadType":"img",
                            "serverData":{
                                "success":true,
                                "value":FS.BLANK_IMG
                            }
                        };
                        //render item
                        itemEl=that.renderUploadItem("h5imgupload",uploadData);
                        //替换thumb图为canvas
                        $('.thumb-img img',itemEl).replaceWith('<canvas width="120" height="120"></canvas>');
                        //存储file数据
                        typeFiles.push(uploadData);
                    });
                    //更新数据存储
                    that.uploadFiles["h5imgupload"]=typeFiles;

                    //listEl.html(htmlStr);
                    for (var j = 0, len = files.length; j < len; j++) {
                        (function (j) {
                            var file = files[j],
                                canvasDom,
                                canvasContext;
                            var URL = window.URL || window.webkitURL;
                            var itemEl=that.getUploadItem("h5imgupload",file);
                            canvasDom = $('canvas', itemEl).get(0);
                            canvasContext = canvasDom.getContext("2d");
                            var img = new Image();
                            img.onload = function () {
                                var width = img.width,
                                    newWidth = width,
                                    height = img.height,
                                    newHeight = height,
                                    ratio = 1,
                                    posLeft= 0, //开始绘制left位置
                                    posTop=0;   //开始绘制top位置
                                if (width >= height) {
                                    if (width > 120) {  //缩放
                                        ratio = 120 / width;
                                    } else {    //比120小原样绘出
                                        ratio = 1;
                                    }
                                } else {
                                    if (height > 120) {  //缩放
                                        ratio = 120 / height;
                                    } else {    //比120小原样绘出
                                        ratio = 1;
                                    }

                                }
                                newWidth = ratio * width;
                                newHeight = ratio * height;
                                canvasDom.width = newWidth;
                                canvasDom.height = newHeight;
                                canvasContext.drawImage(img, posTop, posLeft, newWidth, newHeight);
                                URL.revokeObjectURL(img.src);
                                img = null;
                            };
                            //取消reader读取方式，改用以下接口能有效节约系统资源
                            img.src = URL.createObjectURL(file);

                        }(j));
                    }
                    //更新summary信息
                    that.updateUploadInfo("h5imgupload");
                    //单一上传
                    if(limitUploadSingle){
                        that.disableAction('h5imgupload');
                        that.disableAction('h5attachupload');
                    }
                    if(TypeLimitUploadSingle===false){  //覆盖上面的设置
                        that.enableAction('h5imgupload');
                    }
                },
                onDelete: function (file) {},
                onProgress:function(file,uploadedSize,totalSize){
                    that.setUploadFile('h5imgupload',{
                        "uploadedSize":uploadedSize,
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadprogress','h5imgupload',that.getUploadFile('h5imgupload',file.id));
                },
                onTotalProgress: function (loaded, total) {},
                onSuccess: function (file, responseText) {
                    //修正上传大小和总大小相等,设置完成标志,后台返回信息
                    that.setUploadFile('h5imgupload',{
                        "uploadedSize":file.size,
                        "uploaded":true,
                        "serverData":json.parse(responseText),
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadsuccess','h5imgupload',that.getUploadFile('h5imgupload',file.id));
                },
                onFailure: function (file) {
                    //移除失败的上传数据存储
                    var removeData=that.removeUploadFile('h5imgupload',file.id);
                    //触发failure事件
                    that.trigger('uploadfailure','h5imgupload',removeData);
                },
                onComplete: function () {
                    //触发类型上传完成事件
                    that.trigger('typeuploadcomplete','h5imgupload');
                }
            });
            this.uploaders["h5imgupload"]=h5ImgUploader;
            //检测是否满足当前h5上传功能，不能满足给出用户提示
            if(!h5ImgUploader.isSupport()||!(window.URL || window.webkitURL)){
                //隐藏input[type="file"]
                $('input[type="file"]',btnEl).hide();
                if(selfOpts.flashFallback){
                    this.h5imgupload_fb();
                }else{
                    btnEl.on('click',function(){
                        util.alert('当前浏览器不能满足html5版的上传功能，请尝试其他浏览器');
                        return false;
                    });
                }
            }
            //点击删除按钮删除对应的item
            panelEl.on('click','.file-remove-l',function(evt){
                var itemEl=$(this).closest('.fs-publish-upload-item'),
                    fileId=itemEl.attr('fileid');
                var h5ImgUploader=that.uploaders["h5imgupload"];
                //清除item数据和dom
                that.removeUploadItem('h5imgupload',fileId);
                //清除对应的上传数据
                h5ImgUploader.removeFile(fileId);
                //更新summary信息
                that.updateUploadInfo('h5imgupload');
                //单一上传
                if(limitUploadSingle&&$('.file-remove-l',panelEl).length==0){
                    that.enableAction('h5imgupload');
                    that.enableAction('h5attachupload');
                }
                evt.preventDefault();
            }).on('click','.file-remove-all-l',function(evt){
                $('.file-remove-l',panelEl).each(function(){
                    $(this).click();
                });
                evt.preventDefault();
            });
            //监听closeaction事件，重新启用单一上传
            this.on('closeaction',function(actionName){
                if(limitUploadSingle&&actionName=="h5imgupload"){
                    that.enableAction('h5imgupload');
                    that.enableAction('h5attachupload');
                }
            });
        },
        "h5imguploadClear":function(){
            var uploader=this.uploaders["h5imgupload"],
                uploadFiles=this.uploadFiles;
            var itemRef=this.getDomByActionName("h5imgupload"),
                panelEl=itemRef.panel;
            //清空数据储存
            uploadFiles["h5imgupload"]=[];
            uploader.removeAllFile();
            //清空item
            $('.fs-publish-upload-list',panelEl).empty();
        },
        /**
         * flash fallback for图片上传
         */
        "h5imgupload_fb":function(){
            var that=this;
            var opts=this.opts,
                limitUploadSingle=opts.limitUploadSingle,
                actionOpts = opts.actionOpts,
                selfOpts = actionOpts["h5imgupload"] || {},
                TypeLimitUploadSingle=selfOpts.limitUploadSingle, //可以覆盖opts.limitUploadSingle
                isMultiple; //是否支持多选
            var elEl = this.element;
            var btnEl = $('.fs-publish-h5imgupload-btn', elEl),
                panelEl = $('.fs-publish-h5imgupload-panel', elEl);
            var flashWEl,
                flashId;
            flashId='fs-publish-media-upload-'+MEDIA_UPLOADER_INDEX;
            MEDIA_UPLOADER_INDEX++;
            //设置flash容器
            flashWEl=$('<span id="'+flashId+'"></span>');
            flashWEl.appendTo(btnEl);
            if(limitUploadSingle&&TypeLimitUploadSingle!==false){
                isMultiple=false;
            }else{
                isMultiple=true;
            }
            //FlashUploader
            //设置上传对象
            var uploader=new FlashUploader({
                upload_url: FS.API_PATH+'/File/UploadFileByForm',
                file_types : "*.jpg;*.gif;*.jpeg;*.png",
                file_upload_limit:!isMultiple?1:0,    //0表示不限制上传数
                file_types_description : "图片格式",
                button_placeholder_id : flashId,
                button_text:'',
                file_queued_handler:function(file){
                    var passedFiles=that.uploadFilter("h5imgupload",file,"img");
                    var typeFiles;
                    var uploadData;
                    if(passedFiles.length==0){   //没文件通过验证，则取消已选中文件
                        uploader.cancelUpload(file.id,false);   //不触发uploadError事件
                    }else{
                        if(panelEl.is(':hidden')){
                            that.trigger('showpanel','h5ImgUpload');
                        }
                        //设置数据存储
                        typeFiles=that.uploadFiles["h5imgupload"]||[];
                        //组装上传文件信息
                        uploadData={
                            "id":file.id,
                            "name":file.name,
                            "size":file.size,
                            "uploaded":false,
                            "uploadedSize":0,   //已上传的大小
                            "uploadType":"img",
                            "serverData":{
                                "success":true,
                                "value":FS.BLANK_IMG
                            }
                        };
                        //render item
                        that.renderUploadItem("h5imgupload",uploadData);
                        //替换thumb图为canvas
                        //$('.thumb-img img',itemEl).replaceWith('<canvas width="120" height="120"></canvas>');
                        //存储file数据
                        typeFiles.push(uploadData);
                        //更新数据存储
                        that.uploadFiles["h5imgupload"]=typeFiles;
                        //更新summary信息
                        that.updateUploadInfo("h5imgupload");
                        //单一上传
                        if(limitUploadSingle){
                            that.disableAction('h5imgupload');
                            that.disableAction('h5attachupload');
                        }
                        if(TypeLimitUploadSingle===false){  //覆盖上面的设置
                            that.enableAction('h5imgupload');
                        }
                    }
                },
                file_dialog_complete_handler : function (numFilesSelected, numFilesQueued) {
                    if (numFilesQueued > 0) {
                        this.startUpload();
                    }
                },
                upload_progress_handler : function(file, uploadedSize, totalSize){
                    that.setUploadFile('h5imgupload',{
                        "uploadedSize":uploadedSize,
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadprogress','h5imgupload',that.getUploadFile('h5imgupload',file.id));
                },
                upload_error_handler : function(file){
                    var itemEl=that.getUploadItem("h5imgupload",file),
                        imgWEl=$('.thumb-img',itemEl);
                    imgWEl.html('上传失败，请取消后重试');
                    //移除失败的上传数据存储
                    var removeData=that.removeUploadFile('h5imgupload',file.id);
                    //触发failure事件
                    that.trigger('uploadfailure','h5imgupload',removeData);
                },
                upload_success_handler : function(file, responseText){
                    var itemEl=that.getUploadItem("h5imgupload",file),
                        imgEl=$('.thumb-img img',itemEl);
                    var responseData=json.parse(responseText);
                    //设置thumb地址
                    imgEl.removeClass('blank-place').attr('src',FS.API_PATH+'/df/getTempImg?id='+responseData.value.filePath);

                    //修正上传大小和总大小相等,设置完成标志,后台返回信息
                    that.setUploadFile('h5imgupload',{
                        "uploadedSize":file.size,
                        "uploaded":true,
                        "serverData":responseData,
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadsuccess','h5imgupload',that.getUploadFile('h5imgupload',file.id));
                },
                upload_complete_handler:function(){
                    if (this.getStats().files_queued > 0) {
                        this.startUpload();
                    }
                },
                upload_all_complete_handler : function(){
                    //触发类型上传完成事件
                    that.trigger('typeuploadcomplete','h5imgupload');
                }
            });
            this.uploaders["h5imgupload"]=uploader;
        },
        /**
         * 基于XMLHttpRequest的异步文件上传
         */
        "h5attachupload":function(){
            var that=this;
            var opts = this.opts,
                limitUploadSingle=opts.limitUploadSingle,
                actionOpts = opts.actionOpts,
                selfOpts = actionOpts["h5attachupload"] || {};
            var elEl = this.element;
            var btnEl = $('.fs-publish-h5attachupload-btn', elEl),
                panelEl = $('.fs-publish-h5attachupload-panel', elEl);
            //btnEl.replaceWith('<span class="fs-publish-h5attachupload-btn fs-publish-media-btn"></span>');
            //btnEl=$('.fs-publish-h5attachupload-btn', elEl);   //重新获取
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="upload" class="btn-shadow" /><input class="fs-publish-h5-img-upload fs-publish-h5-upload" type="file" title="添加附件（多个）" />');
            //设置link title
            //$('.fs-publish-h5-upload',btnEl).attr('title','添加附件（多个）');
            btnEl.attr('title','添加附件（多个）');
            if(limitUploadSingle){
                btnEl.attr('title','添加附件（一个）');
                $('.fs-publish-h5-upload',btnEl).attr('title','添加附件（一个）');
            }
            panelEl.html('<div class="fs-publish-upload-list fn-clear"></div><div class="fs-publish-upload-info color-333333"></div>');


            var h5AttachUploader=new H5Uploader({
                multiple:!limitUploadSingle,
                accept:"*/*",
                fileInput: $('.fs-publish-h5-upload',btnEl).get(0),
                url: '/File/UploadFile',
                filter: function (files) {
                    return that.uploadFilter("h5attachupload",files,"attach");
                },
                onSelect: function (files) {
                    if (files.length <= 0){
                        return;
                    }
                    if(panelEl.is(':hidden')){
                        that.trigger('showpanel','h5attachupload');
                    }
                    //设置数据存储
                    var typeFiles=that.uploadFiles["h5attachupload"]||[];
                    _.each(files,function(fileData){
                        var itemEl,
                            uploadData;
                        //组装上传文件信息
                        uploadData={
                            "id":fileData.id,
                            "name":fileData.name,
                            "size":fileData.size,
                            "uploaded":false,
                            "uploadedSize":0,   //已上传的大小
                            "uploadType":"attach",  //文件类型
                            "serverData":{
                                "success":true,
                                "value":FS.BLANK_IMG
                            }
                        };
                        //render item
                        that.renderUploadItem("h5attachupload",uploadData);
                        //存储file数据
                        typeFiles.push(uploadData);
                    });
                    //更新数据存储
                    that.uploadFiles["h5attachupload"]=typeFiles;
                    //更新summary信息
                    that.updateUploadInfo("h5attachupload");
                    //单一上传
                    if(limitUploadSingle){
                        that.disableAction('h5imgupload');
                        that.disableAction('h5attachupload');
                    }
                },
                onDelete: function (file) {},
                onProgress:function(file,uploadedSize,totalSize){
                    that.setUploadFile('h5attachupload',{
                        "uploadedSize":uploadedSize,
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadprogress','h5attachupload',that.getUploadFile('h5attachupload',file.id));
                },
                onTotalProgress: function (loaded, total) {},
                onSuccess: function (file, responseText) {
                    //修正上传大小和总大小相等,设置完成标志,后台返回信息
                    that.setUploadFile('h5attachupload',{
                        "uploadedSize":file.size,
                        "uploaded":true,
                        "serverData":json.parse(responseText),
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadsuccess','h5attachupload',that.getUploadFile('h5attachupload',file.id));
                },
                onFailure: function (file) {
                    //移除失败的上传数据存储
                    var removeData=that.removeUploadFile('h5attachupload',file.id);
                    //触发failure事件
                    that.trigger('uploadfailure','h5attachupload',removeData);
                },
                onComplete: function () {
                    //触发类型上传完成事件
                    that.trigger('typeuploadcomplete','h5attachupload');
                }
            });
            this.uploaders["h5attachupload"]=h5AttachUploader;
            //检测是否满足当前h5上传功能，不能满足给出用户提示
            if(!h5AttachUploader.isSupport()){
                //隐藏input[type="file"]
                $('input[type="file"]',btnEl).hide();
                if(selfOpts.flashFallback){
                    this.h5attachupload_fb();
                }else{
                    btnEl.on('click',function(){
                        util.alert('当前浏览器不能满足html5版的上传功能，请尝试其他浏览器');
                        return false;
                    });
                }
            }
            //点击删除按钮删除对应的item
            panelEl.on('click','.file-remove-l',function(evt){
                var itemEl=$(this).closest('.fs-publish-upload-item'),
                    fileId=itemEl.attr('fileid');
                var h5AttachUploader=that.uploaders["h5attachupload"];
                //清除item数据和dom
                that.removeUploadItem('h5attachupload',fileId);
                //清除对应的上传数据
                h5AttachUploader.removeFile(fileId);
                //更新summary信息
                that.updateUploadInfo('h5attachupload');
                //单一上传
                if(limitUploadSingle&&$('.file-remove-l',panelEl).length==0){
                    that.enableAction('h5imgupload');
                    that.enableAction('h5attachupload');
                }
                evt.preventDefault();
            }).on('click','.file-remove-all-l',function(evt){
                    $('.file-remove-l',panelEl).each(function(){
                        $(this).click();
                    });
                    evt.preventDefault();
                });
            //监听closeaction事件，重新启用单一上传
            this.on('closeaction',function(actionName){
                if(limitUploadSingle&&actionName=="h5attachupload"){
                    that.enableAction('h5imgupload');
                    that.enableAction('h5attachupload');
                }
            });
        },
        "h5attachuploadClear":function(){
            var uploader=this.uploaders["h5attachupload"],
                uploadFiles=this.uploadFiles;
            var itemRef=this.getDomByActionName("h5attachupload"),
                panelEl=itemRef.panel;
            //清空数据储存
            uploadFiles["h5attachupload"]=[];
            uploader.removeAllFile();
            //清空item
            $('.fs-publish-upload-list',panelEl).empty();
        },
        /**
         * flash fallback for附件上传
         */
        "h5attachupload_fb":function(){
            var that=this;
            var opts=this.opts,
                limitUploadSingle=opts.limitUploadSingle;
            var elEl = this.element;
            var btnEl = $('.fs-publish-h5attachupload-btn', elEl),
                panelEl = $('.fs-publish-h5attachupload-panel', elEl);
            var flashWEl,
                flashId;
            flashId='fs-publish-media-upload-'+MEDIA_UPLOADER_INDEX;
            MEDIA_UPLOADER_INDEX++;
            //设置flash容器
            flashWEl=$('<span id="'+flashId+'"></span>');
            flashWEl.appendTo(btnEl);
            //FlashUploader
            //设置上传对象
            var uploader=new FlashUploader({
                upload_url: FS.API_PATH+'/File/UploadFileByForm',
                file_types : "*.*",
                file_upload_limit:limitUploadSingle?1:0,    //0表示不限制上传数
                file_types_description : "所有格式",
                button_placeholder_id : flashId,
                button_text:'',
                file_queued_handler:function(file){
                    var passedFiles=that.uploadFilter("h5attachupload",file,"attach");
                    var typeFiles;
                    var itemEl,
                        uploadData;
                    if(passedFiles.length==0){   //没文件通过验证，则取消已选中文件
                        uploader.cancelUpload(file.id,false);   //不触发uploadError事件
                    }else{
                        if(panelEl.is(':hidden')){
                            that.trigger('showpanel','h5attachupload');
                        }
                        //设置数据存储
                        typeFiles=that.uploadFiles["h5attachupload"]||[];
                        //组装上传文件信息
                        uploadData={
                            "id":file.id,
                            "name":file.name,
                            "size":file.size,
                            "uploaded":false,
                            "uploadedSize":0,   //已上传的大小
                            "uploadType":"attach",
                            "serverData":{
                                "success":true,
                                "value":FS.BLANK_IMG
                            }
                        };
                        //render item
                        that.renderUploadItem("h5attachupload",uploadData);
                        //替换thumb图为canvas
                        //$('.thumb-img img',itemEl).replaceWith('<canvas width="120" height="120"></canvas>');
                        //存储file数据
                        typeFiles.push(uploadData);
                        //更新数据存储
                        that.uploadFiles["h5attachupload"]=typeFiles;
                        //更新summary信息
                        that.updateUploadInfo("h5attachupload");
                        //单一上传
                        if(limitUploadSingle){
                            that.disableAction('h5imgupload');
                            that.disableAction('h5attachupload');
                        }
                    }
                },
                file_dialog_complete_handler : FS.EMPTY_FN,
                upload_progress_handler : function(file, uploadedSize, totalSize){
                    that.setUploadFile('h5attachupload',{
                        "uploadedSize":uploadedSize,
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadprogress','h5attachupload',that.getUploadFile('h5attachupload',file.id));
                },
                upload_error_handler : function(file){
                    //移除失败的上传数据存储
                    var removeData=that.removeUploadFile('h5attachupload',file.id);
                    //触发failure事件
                    that.trigger('uploadfailure','h5attachupload',removeData);
                },
                upload_success_handler : function(file, responseText){
                    //修正上传大小和总大小相等,设置完成标志,后台返回信息
                    that.setUploadFile('h5attachupload',{
                        "uploadedSize":file.size,
                        "uploaded":true,
                        "serverData":json.parse(responseText),
                        "id":file.id
                    });
                    //触发progress事件
                    that.trigger('uploadsuccess','h5attachupload',that.getUploadFile('h5attachupload',file.id));
                },
                upload_complete_handler:function(){
                    if (this.getStats().files_queued > 0) {
                        this.startUpload();
                    }
                },
                upload_all_complete_handler : function(){
                    //触发类型上传完成事件
                    that.trigger('typeuploadcomplete','h5attachupload');
                }
            });
            this.uploaders["h5attachupload"]=uploader;
        },
        "vote": function () {
            var opts = this.opts,
                actionOpts = opts.actionOpts,
                voteOpts = actionOpts["vote"] || {},
                contactData=voteOpts.contactData;
            var elEl = this.element;
            var btnEl = $('.fs-publish-vote-btn', elEl),
                panelEl = $('.fs-publish-vote-panel', elEl),
                voteEl;
            var voteHtmlStr = publishTplEl.filter('.vote-wrapper').html();
            panelEl.html(voteHtmlStr);
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="vote" />');
            voteEl=$('.vote',panelEl);
            //设置link title
            btnEl.attr('title','添加投票');
            //placeholder兼容处理
            util.placeholder($('[placeholder]',voteEl));
            var customRangeEl=$('.custom-range',voteEl);
            //创建自定义类型
            var customRangeSb=new SelectBar({
                "element": customRangeEl,
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list":contactData
                    }
                ],
                "singleCked": false, //可以多选
                "title": "选择投票后可见人",
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            customRangeEl.data('sb',customRangeSb);
            //自定义时间区间
            var deadlineTicksEl=$('.deadline-ticks',voteEl),
                dealineDtEl=$('.dealine-date-time',voteEl),
                dateWrapperEl=$('.date-wrapper',dealineDtEl),
                timeWrapperEl=$('.time-wrapper',dealineDtEl),
                dateSelect,
                timeSelect;
            dateSelect = new DateSelect({
                "element": dateWrapperEl,
                "placeholder": "请选择日期"
            });
            timeSelect = new TimeSelect({
                "element": timeWrapperEl,
                "placeholder": "请选择时间"
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            dateSelect.on('change', function () {
                if (timeSelect.getValue() == "") {
                    timeSelect.selector.select(0);
                }
            });
            dealineDtEl.data('ds',dateSelect);
            dealineDtEl.data('ts',timeSelect);
            //添加新选项
            var addOptEl=$('.add-vote-option-l',voteEl),
                optWEl=$('.option-wrapper',voteEl),
                optTpl=$('.option-tpl',voteEl),
                optCompiled= _.template(optTpl.html());
            addOptEl.click(function(evt){
                var htmlStr;
                var index=$('.option-item',optWEl).length+1;
                htmlStr=optCompiled({
                    "index":index
                });
                if(index<=20){  //最大限制20项
                    $(htmlStr).appendTo(optWEl);
                }
                evt.preventDefault();
            });
            //删除选项
            optWEl.on('click','.remove-l',function(){
                var meEl=$(this),
                    itemEl=meEl.closest('.option-item');
                itemEl.remove();
                //序号重排
                $('.option-index',optWEl).each(function(i){
                    $(this).text(i+1+'、');
                });
                //触发option的change时间，重新渲染可选数量
                $('.vote-option',optWEl).change();
            });

            //选择自定义截止时间显示对应面板
            deadlineTicksEl.change(function(){
                var v=$(this).val();
                if(v=="5"){ //自定义时间类型
                    dealineDtEl.show();
                }else{
                    dealineDtEl.hide();
                }
            }).change();    //默认选择一周
            //点击投票结果选择可见范围
            $('.result-view-type',voteEl).click(function(){
                var meEl=$(this),
                    customRangeEl=$('.custom-range',voteEl);
                //如果是自定义范围显示select bar
                if(meEl.val()=="3"){
                    customRangeEl.show();
                }else{
                    customRangeEl.hide();
                }
            }).eq(0).click();   //默认选中投票人可见
            //动态调整可选option数量
            optWEl.on('change','.vote-option',function(){
                var optEl=$('.vote-option',optWEl),
                    voteCountEl=$('.vote-count',voteEl),    //单选多选select
                    defaultSelectValue=voteCountEl.val(),   //默认选中的value
                    validCount=0;   //有效非空option的数量
                optEl.each(function(){
                    if(_.str.trim($(this).val()).length>0){
                        validCount++;
                    }
                });
                if(validCount<1){
                    validCount=1;   //至少保留“单选”
                }
                //重新渲染可选数量
                var htmlStr="";
                for (var i = 1; i <=validCount; i++) {
                    if(i==1){
                        htmlStr+='<option value="1">单选</option>';
                    }else{
                        htmlStr+='<option value="'+i+'">最多选'+i+'个项目</option>';
                    }
                }
                voteCountEl.html(htmlStr).val(defaultSelectValue);
                //设置select状态
                if(validCount>1){
                    voteCountEl.prop('disabled',false);
                }else{
                    voteCountEl.prop('disabled',true);
                }
            });

            //点击btn触发showpanel事件显示对应的面板
            btnEl.click(function (evt) {
                $(this).trigger('showpanel');
                evt.preventDefault();
            });
        },
        "voteClear": function () {
            var value=this.voteGetValue();
            //reset里面的内容
            value.employeeIDs.element.removeAllItem();
            //title清空
            value.title.element.val("");
            //投票选项
            value.voteOptions.element.each(function(){
                var meEl=$(this),
                    itemEl=meEl.closest('.option-item');
                if($('.remove-l',itemEl).length>0){
                    itemEl.remove();
                }else{
                    meEl.val("");   //剩下的两个清空
                }
            }).change();    //触发change
            //单选多选
            value.voteCount.element.val("1");
            //截止时间
            value.timeType.element.val("1").change();
            value.deadline.element.data('ds').clear();
            value.deadline.element.data('ts').clear();
            //匿名投票
            value.isAnoymouse.element.prop("checked",false);
            //TODO:自定义范围清空
        },
        "voteIsValid":function(){
            var passed=true;
            var value=this.voteGetValue(),
                voteOptions=value.voteOptions,
                optValue=voteOptions.value;
            //标题验证
            if(value.title.value.length==0){
                util.alert('投票标题不能为空');
                passed=false;
                return passed;
            }
            if(value.title.value.length>25){    //标题限制25个字符
                util.alert('投票标题不能超过25个字符');
                passed=false;
                return passed;
            }
            if(optValue.length<2){
                util.alert('投票选项最少为2项，请填写');
                passed=false;
                return passed;
            }
            //截止时间非空判定
            if(value.deadline.value.length==0){
                util.alert('请设置自定义截止时间');
                passed=false;
                return passed;
            }
            //可视范围限制
            if(value.resultViewType.value=="3"){
                if(value.employeeIDs.value.length==0){
                    util.alert('请选择自定义范围');
                    passed=false;
                }
                return passed;
            }
            return passed;
        },
        "voteGetValue":function(){
            var value={};
            var elEl = this.element;
            var panelEl = $('.fs-publish-vote-panel', elEl),
                voteEl = $('.vote', panelEl);
            var titleEl=$('.vote-title',voteEl), //投票标题
                voteOptEl=$('.vote-option',voteEl),  //投票选项
                voteCountEl=$('.vote-count',voteEl),    //可选数量
                deadlineTicksEl=$('.deadline-ticks',voteEl),    //截止时间
                dealineDtEl=$('.dealine-date-time',voteEl), //自定义截止时间
                isAnoymouseEl=$('.is-anoymouse',voteEl),    //是否匿名
                viewTypeEl=$('.result-view-type',voteEl),   //可视范围
                customRangeEl=$('.custom-range',voteEl),
                customRangeSb=customRangeEl.data('sb'),
                rangeData=customRangeSb.getSelectedData();
            var optValue=[],
                ds=dealineDtEl.data('ds'),
                ts=dealineDtEl.data('ts'),
                dsValue,    //自定义截止日期
                tsValue,    //自定义截止时间
                now=moment(),
                timeTypeValue;
            //截止时间类型
            value["timeType"]={
                "element":deadlineTicksEl,
                "value": deadlineTicksEl.val()
            };
            value["title"]={
                "element":titleEl,
                "value": _.str.trim(titleEl.val())
            };
            value["deadline"]={
                "element":dealineDtEl,
                "value":deadlineTicksEl.val()
            };
            //根据不同的截止时间类型得出unix ticks
            timeTypeValue= parseInt(value["timeType"].value);
            if(timeTypeValue!=5){
                if(timeTypeValue<=3){
                    value["deadline"].value=now.add('weeks',timeTypeValue).unix();
                }else{  //timeValue==4 weeks==1 month
                    value["deadline"].value=now.add('months',1).unix();
                }
            }else{  //自定义截止时间
                dsValue = ds.getValue();
                tsValue = ts.getValue();
                if(dsValue.length>0){
                    value["deadline"].value=moment(dsValue+" "+tsValue,'YYYYMMDD HH:mm').unix();
                }else{
                    value["deadline"].value="";
                }
            }

            value["isAnoymouse"]={
                "element":isAnoymouseEl,
                "value":isAnoymouseEl.prop('checked')
            };
            value["resultViewType"]={
                "element":viewTypeEl,
                "value":viewTypeEl.filter(':checked').val()
            };
            value["employeeIDs"]={
                "element":customRangeSb,
                "value":rangeData['p'] || []
            };
            //投票选项
            voteOptEl.each(function(i){
                var v=_.str.trim($(this).val());
                //只筛选非空值
                if(v.length>0){
                    optValue.push(v);
                }
            });
            value["voteOptions"]={
                "element":voteOptEl,
                "value":optValue
            };
            //可选数量
            value["voteCount"]={
                "element":voteCountEl,
                "value":voteCountEl.val()
            };
            return value;
        },
        /**
         * at功能
         */
        "at": function () {
            var that=this;
            var elEl = this.element;
            var btnEl = $('.fs-publish-at-btn', elEl),
                panelEl = $('.fs-publish-at-panel', elEl);
            var opts = this.opts,
                actionOpts = opts.actionOpts,
                atOpts = actionOpts["at"] || {};
            var inputEl = $(atOpts.inputSelector);
            var atSpData=this.atGetDefaultSpData();

            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="vote" />');
            //设置link title
            btnEl.attr('title','添加提到');
            var atSelectPanel = new SelectPanel(_.extend({
                "trigger": btnEl,
                "singleCked": false,    //可多选
                "data": atSpData
            }, atOpts.spOpts || {}));
            atSelectPanel.on('select', function (selectedData) {
                var currentInputDom=inputEl.filter('.fs-publish-at-focus').get(0)||inputEl.eq(0).get(0);
                _.each(selectedData, function (val) {
                    util.appendInput(currentInputDom, '@' + val[0].name + ' ');
                });
                //input输入框自适应高度
                $(currentInputDom).trigger('autosize.resize');

                atSelectPanel.unselect("all", "all");
                //atSelectPanel.hide();
            });
            //输入框中添加at提示
            util.asyncOrder(['stylelibs/jquery.atwho.css', 'jslibs/jquery.atwho.js','jslibs/jquery.atwho.custom.js'], function () {
                var filterHandler = filter.stringMatch;
                //at联系人部分
                inputEl.atwho('@', {
                    //"data": atSpData[1].list,
                    "data":contactData["p"].concat(_.reject(contactData["g"],function(circleData){  //排除全公司
                        return circleData.id==999999;
                    })),
                    "callbacks": {
                        "filter": function (query, data, search_key) {
                            var stringMatch = filter.stringMatch,
                                startsWith=filter.startsWith;
                            var filterData=[],
                                filterData1,
                                filterData2;
                            var atSpData2=that.atGetDefaultSpData();
                            var atViewTitleEl=$('#at-view .at-view-title'),
                                loadingEl=$('#at-view .loading-mask');
                            if(loadingEl.length==0){
                                loadingEl=$('<div class="loading-mask"><img src="'+FS.BLANK_IMG+'" class="loading-img" alt="loading" /></div>');
                                loadingEl.prependTo('#at-view');
                            }
                            if(atViewTitleEl.length==0){
                                atViewTitleEl=$('<h3 class="at-view-title"></h3>');
                                atViewTitleEl.prependTo('#at-view');
                            }
                            //直接隐藏loading
                            loadingEl.hide();
                            if (_.str.trim(query).length == 0) {    //如果为空，显示常用联系人信息
                                filterData=atSpData2[0].list.slice(0); //必须用副本，不然下次查询会被清除数据
                                if(filterData.length>0){
                                    atViewTitleEl.text('选择最近@提到的或直接输入').show();
                                }else{
                                    atViewTitleEl.hide();
                                }
                            } else {
                                filterData1 = stringMatch.apply(this, [data, query, {
                                    "key": "name"
                                }]);
                                filterData2 = startsWith.apply(this, [data, query.toLowerCase(), {
                                    "key": "spell"
                                }]);
                                //先插入filterData2的数据
                                _.each(filterData2,function(itemData){
                                    if(!_.find(filterData1,function(itemData2){
                                        return itemData2.id==itemData.id;
                                    })){
                                        filterData.push(itemData);
                                    }
                                });
                                filterData=filterData.concat(filterData1);
                                //title提示
                                if(filterData.length>0){
                                    atViewTitleEl.text('选择名称或轻敲空格完成输入').show();
                                }else{
                                    atViewTitleEl.hide();
                                }

                            }
                            return filterData;
                        },
                        matcher: function (flag, subtext) {
                            var match, matched, regexp;
                            //regexp = new RegExp(flag + '([\\S]*)$', 'gi');
                            regexp = new RegExp(flag + '([a-zA-Z0-9_\\u4e00-\\u9fa5]*)$', 'gi');    //汉字、数字、字母、下划线组合
                            match = regexp.exec(subtext);
                            matched = null;
                            if (match) {
                                matched = match[2] ? match[2] : match[1];
                            }
                            return matched;
                        },
                        sorter:function(query, items, searchKey){
                            return items;
                        }
                    }
                }).addClass('fs-publish-input');
            });
            inputEl.focus(function(){
                inputEl.removeClass('fs-publish-at-focus');
                $(this).addClass('fs-publish-at-focus');
            });
            inputEl.change(function(){
                inputEl.trigger('autosize.resize');
            });
            this.atSelectPanel = atSelectPanel;
        },
        "atClear": function () {
        },
        /**
         * 获取默认的at功能中select panel的数据源
         */
        "atGetDefaultSpData":function(){
            var contactData=util.getContactData(true); //完整的一份拷贝，防止单体contactData被污染覆盖
            var spData,
                spData1=[], //第一部分数据，常用联系人
                spData2=contactData["p"], //第二部分数据，全部同事
                spData3=contactData["g"], //第三部分数据，全部部门
                lastAtData=util.getPersonalConfig('lastAtData');
            _.each(lastAtData,function(itemData,i){
                var cacheData=util.getContactDataById(itemData.dataID,itemData.isCircle?"g":"p");
                if(cacheData){   //可能被离职
                    spData1.push({
                        "name":cacheData.name,
                        "id":cacheData.id,
                        "spell":cacheData.spell
                    });
                }

            });
            //过滤掉全公司
            spData1= _.reject(spData1,function(itemData){
                return itemData.id==999999;
            });
            spData3= _.reject(spData3,function(itemData){
                return itemData.id==999999;
            });
            spData=[{
                "title":"常用",
                "type":"mix",   //包含p和g两种类型
                "sortType":"origin",    //按原来顺序排
                "list":spData1
            },{
                "title":"同事",
                "unitSuffix":"位同事",
                "type":"p",
                "list":spData2
            },{
                "title":"部门",
                "unitSuffix":"个部门",
                "type":"g",
                "list":spData3
            }];
            return spData;
        },
        /**
         * 更新at功能中的select panel的数据源
         */
        "atUpdateSpData":function(){
            var opts = this.opts,
                actionOpts = opts.actionOpts,
                atOpts = actionOpts["at"] || {};
            var inputEl = $(atOpts.inputSelector);
            var lastAtData=util.getPersonalConfig('lastAtData')||[];   //可能包含employee和circle
            inputEl.each(function(){
                var atContents=util.getAtFromInput(this);    //获取所有的at成员
                _.each(atContents,function(atContent){
                    var contentData=util.getContactDataByName(atContent,'g');
                    //先尝试查部门
                    if(contentData){
                        //将部门数据塞到lastAtData最前面
                        lastAtData=util.toListTop(lastAtData,{
                            "dataID":contentData.id,
                            "name":contentData.name,
                            "isCircle":true
                        },function(itemData){
                            return itemData.dataID==contentData.id;
                        });
                    }else{
                        //再尝试查员工
                        contentData=util.getContactDataByName(atContent,'p');
                        if(contentData){
                            //将员工数据塞到lastAtData最前面
                            lastAtData=util.toListTop(lastAtData,{
                                "dataID":contentData.id,
                                "name":contentData.name,
                                "isCircle":false
                            },function(itemData){
                                return itemData.dataID==contentData.id;
                            });
                        }
                    }
                });
            });
            //保存到presonal config中
            util.setPersonalConfig('lastAtData',lastAtData);
            //更新at selectpanel数据源并重绘
            this.atSelectPanel.updateData(this.atGetDefaultSpData());
        },
        /**
         * 话题功能
         */
        "topic":function(){
            var elEl = this.element;
            var btnEl = $('.fs-publish-topic-btn', elEl),
                panelEl = $('.fs-publish-topic-panel', elEl);
            var opts = this.opts,
                actionOpts = opts.actionOpts,
                topicOpts = actionOpts["topic"] || {};
            var inputEl = $(topicOpts.inputSelector);

            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="topic" />');
            //设置link title
            btnEl.attr('title','添加话题');
            var topicDialog = new TopicDialog(_.extend({
                "trigger": btnEl,
                "align":{
                    "selfXY": [0, 0],     // element 的定位点，默认为左上角
                    "baseElement":btnEl,
                    "baseXY": [-227, 22]      // 基准定位元素的定位点，默认为左上角
                    //"baseXY": [-227, btnEl.height()]      // 基准定位元素的定位点，默认为左上角
                },
                "listPath":"/Topic/GetRecentlySendAndNewTopics"
            }, topicOpts.dialogOpts || {})).render();
            //监听itemclick事件append到input对应的话题
            topicDialog.on('itemclick', function (itemData) {
                var currentInputEl=inputEl.filter('.fs-publish-topic-focus');
                if(currentInputEl.length==0){
                    currentInputEl=inputEl.eq(0);
                }
                util.appendInput(currentInputEl.get(0), '#' + itemData.name + '# ');
                //触发keyup事件，显示话题提示
                currentInputEl.keyup();
                topicDialog.hide();
            });
            //监听inserttopic事件插入新话题模板
            topicDialog.on('inserttopic', function () {
                var currentInputDom=inputEl.filter('.fs-publish-topic-focus').get(0)||inputEl.eq(0).get(0);
                var cursorPos;
                util.appendInput(currentInputDom, '#请输入话题（10个以内连续汉字）# ');
                //input输入框自适应高度
                $(currentInputDom).trigger('autosize.resize');
                //获取光标位置
                cursorPos=util.getCursorPosition(currentInputDom);
                //触发keyup事件，显示话题提示
                $(currentInputDom).keyup();
                //先隐藏topic弹框
                topicDialog.hide();
                //选中模板，保证光标置于input内
                cursorPos.start=cursorPos.start-18;
                cursorPos.end=cursorPos.end-2;
                util.setCursorPosition(currentInputDom,cursorPos);
            });
            inputEl.change(function(){
                inputEl.trigger('autosize.resize');
            });
            inputEl.focus(function(){
                inputEl.removeClass('fs-publish-topic-focus');
                $(this).addClass('fs-publish-topic-focus');
            });
            //输入框话题提示
            //话题部分
            var remoteTimeId;
            util.asyncOrder(['stylelibs/jquery.atwho.css', 'jslibs/jquery.atwho.js','jslibs/jquery.atwho.custom.js'], function () {
                var filterHandler = filter.stringMatch;
                var topicData=topicDialog.dataStore;
                inputEl.atwho('#', {
                    //"data": topicData,
                    "data": '/Topic/Get10Topics',
                    "insertSeparator":false, //插入值时不包括"空格"分隔符
                    "emptyTipTpl":"没有搜索到话题",   //记录空的提示
                    "withEmptyTip":false,   //不显示空信息提示
                    "callbacks": {
                        "remote_filter":function(params, url, render_view){
                            var atViewTitleEl=$('#at-view .at-view-title'),
                                loadingEl=$('#at-view .loading-mask');
                            if(loadingEl.length==0){
                                loadingEl=$('<div class="loading-mask"><img src="'+FS.BLANK_IMG+'" class="loading-img" alt="loading" /></div>');
                                loadingEl.prependTo('#at-view');
                            }
                            if(atViewTitleEl.length==0){
                                atViewTitleEl=$('<h3 class="at-view-title"></h3>');
                                atViewTitleEl.prependTo('#at-view');
                            }
                            if(_.str.trim(params.q).length==0){
                                atViewTitleEl.hide();
                                loadingEl.hide();
                                render_view([]);
                                return;
                            }
                            loadingEl.show();
                            clearTimeout(remoteTimeId);
                            remoteTimeId=setTimeout(function(){
                                return util.api({
                                    "url":url,
                                    "type":"get",
                                    "data":{
                                        "keyword":params.q
                                    },
                                    "success":function(responseData){
                                        var items;
                                        if(responseData.success){
                                            items=responseData.value||[];
                                            atViewTitleEl.text('#相似话题#').show();
                                            loadingEl.hide();
                                            items=_.map(items,function(item){
                                                return {
                                                    "name":item
                                                };
                                            });
                                            render_view(items);
                                        }else{
                                            atViewTitleEl.hide();
                                            loadingEl.hide();
                                            render_view([]);
                                        }
                                    }
                                });
                            },80);

                        },
                        /*"filter": function (query, data, search_key) {
                            var filterData=[],
                                filterData1,
                                filterData2,
                                topicDataCopy=util.deepClone(topicDialog.dataStore),    //操纵话题数据的副本，防止被删除
                                recentlyTopics,
                                newTopics;
                            var atViewTitleEl=$('#at-view .at-view-title');
                            if(atViewTitleEl.length==0){
                                atViewTitleEl=$('<h3 class="at-view-title"></h3>');
                                atViewTitleEl.prependTo('#at-view');
                            }

                            //获取常用话题和最新话题
                            recentlyTopics=_.find(topicDataCopy,function(cateData){
                                if(cateData.key=="recentlyTopics"){
                                    return true;
                                }
                            });
                            newTopics=_.find(topicDataCopy,function(cateData){
                                if(cateData.key=="newTopics"){
                                    return true;
                                }
                            });

                            if (_.str.trim(query).length == 0) {    //如果为空，显示常用话题
                                //filterData=recentlyTopics.list;
                                filterData=[];        //如果为空，不显示任何信息
                            } else {
                                filterData1 = filterHandler.apply(this, [recentlyTopics.list, query, {
                                    "key": "name"
                                }]);
                                filterData2 = filterHandler.apply(this, [newTopics.list, query.toLowerCase(), {
                                    "key": "name"
                                }]);
                                //先插入filterData2的数据
                                _.each(filterData2,function(itemData){
                                    if(!_.find(filterData1,function(itemData2){
                                        return itemData2.name==itemData.name;
                                    })){
                                        filterData.push(itemData);
                                    }
                                });
                                filterData=filterData.concat(filterData1);
                                //title提示
                                if(filterData.length>0){
                                    atViewTitleEl.text('选择名称完成输入').show();
                                }else{
                                    atViewTitleEl.hide();
                                }
                            }
                            if(filterData.length>0){
                                atViewTitleEl.text('#相似话题#').show();
                            }else{
                                atViewTitleEl.hide();
                            }
                            return filterData;
                        },*/
                        matcher: function (flag, subtext) {
                            var match, matched, regexp;
                            var content = this.$inputor.val(),
                                nextChar=content.slice(subtext.length,subtext.length+1),
                                subtextArr=subtext.split(/\n/),   //字符串切分成数组
                                flagCount=0; //按"#"分组，统计subtext中"#"出现的次数,要求出现odd数次
                            regexp = new RegExp(flag + '([^\\s|^#]*)$', 'gi');
                            match = regexp.exec(subtext);
                            subtextArr=subtextArr[subtextArr.length-1].split('');   //从最后一个换行符开始统计
                            for(var i= 0,len=subtextArr.length;i<len;i++){
                                if(subtextArr[i]=="#"){
                                    flagCount++;
                                }
                            }
                            matched = null;
                            //console.info(subtext);
                            if (flagCount%2==1&&nextChar=="#"&&match) {
                                matched = match[2] ? match[2] : match[1];
                            }
                            return matched;
                        },
                        sorter:function(query, items, searchKey){
                            return items;
                        }/*,
                        selector:function(itemEl){
                            return "few";
                            if (itemEl.length > 0) {
                                return _.str.trim(itemEl.data("value"));
                            }

                        }*/
                    }
                });
            });
            //点击全局隐藏
            topicDialog.element.on('click',function(evt){
                evt.stopPropagation();
            });
            util.regGlobalClick(topicDialog.element,function(evt){
                var targetEl=$(evt.target);
                if((btnEl[0]!==targetEl[0])&&(!$.contains(btnEl[0],targetEl[0]))){ //判定点击dom不是trigger本身或者不包含在trigger里
                    if(topicDialog.element.is(':visible')){
                        topicDialog.hide();
                    }
                }

            });
            this.topicDialog = topicDialog;
        },
        /**
         * 话题功能clear
         */
        "topicClear":function(){
            //this.topicDialog&&this.topicDialog.destroy();
            //this.topicDialog=null;
        },
        /**
         * 判断传入action是否处于激活态
         * @param actionName
         * @returns {boolean}
         */
        "isActive":function(actionName){
            var elEl = this.element;
            var panelEl = $('.fs-publish-'+actionName+'-panel', elEl);
            if(panelEl.is(':visible')){
                return true;
            }else{
                return false;
            }
        },
        /**
         * 禁用某个action
         * @param actionName
         */
        "disableAction":function(actionName){
            var actionCls=actionName.toLowerCase();
            var elEl = this.element,
                btnEl = $('.fs-publish-'+actionCls+'-btn', elEl);
            if(actionName=="h5imgupload"||actionName=="h5attachupload"){
                this.uploaders[actionName].setDisable(true);
            }
            btnEl.addClass('fs-publish-'+actionCls+'-disabled fs-publish-media-disabled');
        },
        /**
         * 启用某个action
         * @param actionName
         */
        "enableAction":function(actionName){
            var actionCls=actionName.toLowerCase();
            var elEl = this.element,
                btnEl = $('.fs-publish-'+actionCls+'-btn', elEl);
            if(actionName=="h5imgupload"||actionName=="h5attachupload"){
                this.uploaders[actionName].setDisable(false);
            }
            btnEl.removeClass('fs-publish-'+actionCls+'-disabled fs-publish-media-disabled');
        },
        /**
         * 隐藏某个action
         * @param actionName
         */
        "hideAction":function(actionName){
            var actionCls=actionName.toLowerCase();
            var elEl = this.element,
                btnEl = $('.fs-publish-'+actionCls+'-btn', elEl),
                panelWEl=$('.fs-publish-'+actionCls+'-panel', elEl).closest('.fs-publish-media-panel-wrapper');
            btnEl.hide();
            panelWEl.hide();
        },
        /**
         * 显示某个action
         * @param actionName
         */
        "showAction":function(actionName){
            var actionCls=actionName.toLowerCase();
            var elEl = this.element,
                btnEl = $('.fs-publish-'+actionCls+'-btn', elEl);
            btnEl.show();
        },
        /**
         * 重置所有面板
         */
        "resetAll": function () {
            var that = this,
                elEl = this.element,
                opts = this.opts;
            _.each(opts.action, function (v) {
                that[v + 'Clear']();
            });
            //隐藏所有面板
            $('.fs-publish-media-panel-wrapper', elEl).hide();
        },
        /**
         * 多媒体提交接口
         * @param sendHandler
         * @param modalSelector
         */
        "send": function (sendHandler, modalSelector) {
            var that = this;
            var sendModelEl;
            var pbar;
            var modalEl = modalSelector ? $(modalSelector) : $('body');
            var startTime=new Date();   //开始时间点
            var sendCb = function () {
                sendModelEl.hide();
                pbar.reset();   //重置
                pbar.setPipeVisible(false);    //默认隐藏进度条，只有存在附件上传时才显示
            };

            var adjustModal=function(){
                //定位自适应尺寸
                sendModelEl.width(modalEl.outerWidth());
                sendModelEl.height(modalEl.outerHeight());
            };
            var adjustPbar=function(){
                pbar.setWidth(modalEl.width()-40);
                Position.center(pbar.element,modalEl);
            };
            sendModelEl=modalEl.children('.fs-publish-media-send-model');
            //不存在需要创建
            if(sendModelEl.length==0){
                sendModelEl=$('<div class="fs-publish-media-send-model"></div>');
                sendModelEl.html('<div class="fs-publish-allupload-pbar"></div><div class="fs-publish-send-info"></div>');
                sendModelEl.appendTo(modalEl);
                pbar = new ProgressBar({
                    "element": $('.fs-publish-allupload-pbar', sendModelEl)
                });
                sendModelEl.data('pbar',pbar).hide();
                //默认隐藏进度条
                pbar.setPipeVisible(false);
                //设置父元素定位
                if(modalEl.css('position')=="static"){
                    modalEl.css('position','relative');
                }
            }
            //获取进度条组件
            pbar=sendModelEl.data('pbar');
            //定位自适应尺寸
            adjustModal();

            //更新at功能中的常用联系人个人配置
            if(this.atSelectPanel){
                this.atUpdateSpData();
            }
            var totalUploadStatus;
            //尝试触发开始上传
            _.each(this.uploaders,function(uploader){
                uploader.startUpload();
            });
            //获取上传状态
            totalUploadStatus=this.getTotalUploadStatus();  //获取上传状态
            //显示提交遮罩
            sendModelEl.show();
            if (totalUploadStatus.uploaded) {  //文件已经上传成功
                pbar.setTbar('正在提交请稍候...');
                //设置进度条尺寸位置居中
                adjustPbar();
                sendHandler(sendCb,sendModelEl);
            } else {  //显示文件上传进度，上传成功后提交send接口
                if(!pbar.isPipeVisible()){ //如进度条处于隐藏状态，需要先显示出来，并且设置位置居中
                    pbar.setPipeVisible(true);
                    adjustPbar();
                }
                //注册media上传文件uploadprogress事件
                this.on('uploadprogress', function () {
                    var endTime=new Date(),
                        averageSpeed= 0,
                        leftSeconds;
                    var uploadStatus = that.getTotalUploadStatus(),
                        uploadedSize = uploadStatus.uploadedSize,
                        totalSize = uploadStatus.totalSize;
                    var percent = Math.ceil((uploadedSize / totalSize) * 100) + '%';

                    if(parseFloat(percent)>100){
                        percent="100%";
                    }
                    pbar.setProgress(percent);
                    averageSpeed=uploadedSize/((endTime.getTime()-startTime.getTime())/1000);
                    leftSeconds=(totalSize-uploadedSize)/averageSpeed;
                    pbar.setTbar('正在上传&nbsp;' + util.getFileSize(uploadedSize) + '&nbsp;/&nbsp;' + util.getFileSize(totalSize)+'&nbsp;&nbsp;&nbsp;剩余时间：'+leftSeconds.toFixed(2)+'秒');
                    pbar.setBbar('速度：' + util.getFileSize(averageSpeed)+'/秒');
                });
                this.one('alluploadcomplete', function () {
                    //取消uploadprogress监听
                    this.off('uploadprogress');
                    //设置上传进度100%
                    pbar.setProgress('100%');
                    sendHandler(sendCb,sendModelEl);
                    pbar.setTbar('正在提交请稍候...');
                    //上传完毕隐藏进度条
                    //pbar.setPipeVisible(false,true);
                });
            }
        },
        "destroy": function () {
            if (this.atSelectPanel) {
                this.atSelectPanel.destroy();
                this.atSelectPanel = null;
            }
            if (this.topicDialog) {
                this.topicDialog.destroy();
                this.topicDialog = null;
            }
            if(this.uploaders){
                _.each(this.uploaders,function(uploader){
                    uploader.destroy();
                });
                this.uploaders=null;
            }
            this.uploadFiles=null;
            //重置所有面板
            //this.resetAll();
            this.off();
            this.element.empty();
        }
    });
    MediaMaker.idIndex = 0; //为实例id计数
    MediaMaker.uploadCount = 0;
    MediaMaker.gUploadDia=new GlobalUploadDialog(); //全局上传面板
    Events.mixTo(MediaMaker);

    /**
     * 插入话题弹框
     * @type {*}
     */
    var TopicDialog=Dialog.extend({
        "attrs":{
            "content":publishTplEl.filter('.topic-dialog-tpl').html(),
            "className":"fs-publish-topic-dialog",
            "width":240,
            "height":412,
            "hasMask":false,
            "listPath":"/Topic/GetRecentlySendAndNewTopics" //默认请求投票列表数据
            /*"data":[{
                "title":"常用话题",
                "list":[{
                    "name":"研发每日计划"
                },{
                    "name":"研发周计划"
                }]
            },{
                "title":"最新话题",
                "list":[{
                    "name":"研发每日计划"
                },{
                    "name":"研发周计划"
                }]
            }]*/
        },
        "events":{
            "mouseenter .topic-item":"_enterTopicItem",
            "mouseleave .topic-item":"_leaveTopicItem",
            "click .topic-item":"_clickTopicItem",
            "click .insert-topic-btn":"_clickInsertBtn",
            "click .f-cancel":"hide"
        },
        "setup":function(){
            var result=TopicDialog.superclass.setup.apply(this,arguments);
            return result;
        },
        "render":function(){
            var result=TopicDialog.superclass.render.apply(this,arguments);
            this._renderList();
            return result;
        },
        /**
         * 鼠标进入topicItem触发
         * @param evt
         */
        "_enterTopicItem":function(evt){
            var topicEl=$(evt.target);
            topicEl.addClass('state-hover');
        },
        /**
         * 鼠标离开topicItem触发
         * @param evt
         */
        "_leaveTopicItem":function(evt){
            var topicEl=$(evt.target);
            topicEl.removeClass('state-hover');
        },
        /**
         * 鼠标点击topic item触发
         * @param evt
         */
        "_clickTopicItem":function(evt){
            var topicEl=$(evt.target),
                keyId=topicEl.attr('keyid');
            var itemData=this.getItemData(keyId);
            //触发itemclick事件
            this.trigger('itemclick',itemData);
        },
        /**
         * 点击插入话题按钮触发inserttopic事件
         * @param evt
         */
        "_clickInsertBtn":function(evt){
            //触发inserttopic事件
            this.trigger('inserttopic');
        },
        /**
         * 渲染话题列表
         */
        "_renderList":function(){
            //var data=this.get('data');
            var that=this;
            var listPath=this.get('listPath');
            util.api({
                "url":listPath,
                "type":"get",
                "success":function(responseData){
                    var dataRoot,
                        dataStore=[];
                    if(responseData.success){
                        dataRoot=responseData.value;
                        _.each(dataRoot,function(cateData,key){
                            var cateTitle=(key=="recentlyTopics"?"常用话题":"最新话题");
                            var listData=[];
                            _.each(cateData,function(name){
                                name= _.str.trim(name);   //去掉左右空格
                                if(!_.some(listData,function(itemData){   //去重
                                    return itemData.name==name;
                                })){
                                    listData.push({
                                        "name":name
                                    });
                                }
                            });
                            //存储数据
                            dataStore.push({
                                "title":cateTitle,
                                "list":listData,
                                "key":key
                            });
                        });
                        //保存数据
                        that.dataStore=dataStore;
                        //创建html
                        that._createListHtml(dataStore);
                    }

                }
            });
        },
        /**
         * 渲染列表到页面
         */
        "_createListHtml":function(dataStore){
            var elEl=this.element,
                cateListEl=$('.cate-list',elEl);
            var htmlStr="";
            _.each(dataStore,function(cateData,i){
                var cateTitle=cateData.title,
                    listData=cateData.list;
                var htmlStr2='';
                htmlStr+='<li class="cate-item"><div class="cate-title">'+cateTitle+'</div><ul class="topic-list">';
                _.each(listData,function(itemData,j){
                    htmlStr2+='<li class="topic-item" keyid="'+i+'-'+j+'">'+itemData.name+'</li>';
                });
                htmlStr+=htmlStr2+'</ul><li>';
            });
            cateListEl.html(htmlStr);
        },
        /**
         * 通过keyId(cateIndex-itemIndex形式)获取对应的data信息
         * @param keyId
         */
        "getItemData":function(keyId){
            var keyIdArr=keyId.split('-');
            var data=this.dataStore;
            return data[keyIdArr[0]].list[keyIdArr[1]];
        }
    });

    var ProgressBar = function (opts) {
        opts = _.extend({
            "element": null,
            "width":"auto"
        }, opts || {});
        var elEl = $(opts.element);
        this.element = elEl;
        this.opts = opts;
        elEl.data('progressBar', this);
        this.init();
    };
    ProgressBar.prototype.init = function () {
        var opts=this.opts;
        var elEl = this.element;
        elEl.html('<div class="fs-progressbar-tbar"></div><div class="fs-progressbar-pipe"><div class="fs-progress-indicator"></div><div class="fs-progress-text"></div></div><div class="fs-progressbar-bbar"></div>');
        elEl.addClass('fs-progressbar');
        if(opts.width!="auto"){
            $('.fs-progressbar-pipe',elEl).width(opts.width);
        }
    };
    ProgressBar.prototype.setProgress = function (percent) {
        var elEl = this.element,
            indicatorEl = $('.fs-progress-indicator', elEl),
            textEl=$('.fs-progress-text', elEl);
        indicatorEl.css({
            "width": percent
        });
        textEl.text(percent);
    };
    /**
     * 设置上传tbar信息
     * @param text
     */
    ProgressBar.prototype.setTbar = function (text) {
        var elEl = this.element,
            tbarEl = $('.fs-progressbar-tbar', elEl);
        tbarEl.html(text);
    };
    /**
     * 设置上传bbar信息
     * @param text
     */
    ProgressBar.prototype.setBbar = function (text) {
        var elEl = this.element,
            bbarEl = $('.fs-progressbar-bbar', elEl);
        bbarEl.html(text);
    };
    /**
     * 设置上传条宽度
     * @param width
     */
    ProgressBar.prototype.setWidth = function (width) {
        var elEl = this.element,
            pipeEl = $('.fs-progressbar-pipe', elEl),
            tbarEl = $('.fs-progressbar-tbar', elEl),
            bbarEl = $('.fs-progressbar-bbar', elEl);
        pipeEl.width(width);
        tbarEl.width(width);
        bbarEl.width(width);
    };
    /**
     * 设置进度条显隐状态
     * @param isVisible
     * @param withAnimate 是否带动画，默认不带
     */
    ProgressBar.prototype.setPipeVisible = function (isVisible,withAnimate) {
        var elEl = this.element,
            pipeEl = $('.fs-progressbar-pipe', elEl);
        withAnimate=!!withAnimate;
        if(isVisible){
            if(withAnimate){
                pipeEl.fadeIn();
            }else{
                pipeEl.show();
            }
        }else{
            if(withAnimate){
                pipeEl.fadeOut();
            }else{
                pipeEl.hide();
            }
        }
    };
    /**
     * 返回进度条显隐状态
     * @param isVisible
     */
    ProgressBar.prototype.isPipeVisible = function () {
        var elEl = this.element,
            pipeEl = $('.fs-progressbar-pipe', elEl);
        return pipeEl.is(':visible');
    };
    ProgressBar.prototype.reset=function(){
        this.setProgress('0%');
        this.setTbar("");
        this.setBbar("");
    };
    /**
     * 销毁
     */
    ProgressBar.prototype.destroy=function(){
        var elEl = this.element;
        elEl.removeData('progressBar');
        elEl.addClass('fs-progressbar').empty();
        this.element=null;
    };


    /**
     * 选人或可视范围面板
     */
    var SelectPanel = function (opts) {
        opts = _.extend({
            "trigger": null,
            "singleCked": false,
            "data": [
                {
                    "title": "标题 A",
                    "type": "a",
                    "sortType":"letter",    //排序方式，letter表示按字母排序，origin表示按原来顺序排序
                    "list": [
                        {
                            "name": "测试",
                            "id": "test",
                            "spell": "test"
                        },
                        {
                            "name": "测试a",
                            "id": "test2",
                            "spell": "aest"
                        },
                        {
                            "name": "测试b-1",
                            "id": "test3",
                            "spell": "best"
                        },
                        {
                            "name": "测试b-2",
                            "id": "test4",
                            "spell": "best"
                        }
                    ]
                },
                {
                    "title": "标题 B",
                    "type": "b",
                    "unitSuffix":"位同事",
                    "list": [
                        {
                            "name": "测试A",
                            "id": "test1",
                            "spell": "aest"
                        }
                    ]
                },
                {
                    "title": "标题 B",
                    "type": "c",
                    "list": [
                        {
                            "name": "测试b",
                            "id": "test1",
                            "spell": "best"
                        }
                    ]
                }
            ]
        }, opts || {});
        var panelTpl = '<div class="fs-contact-letter-nav fn-clear"></div><div class="fs-contact-list-wrapper"><ul class="fs-contact-list"></ul></div>';
        var navHtmlStr = '',
            panelHtmlStr = '';
        _.each(opts.data, function () {
            navHtmlStr += '<li class="ui-tab-item" data-role="trigger"></li>';
            panelHtmlStr += '<div data-role="panel" class="ui-tab-panel fn-clear">' + panelTpl + '</div>';
        });
        var triggerEl = $(opts.trigger);
        var dialog = new Dialog(_.extend({
            hasMask: false,
            width: 280,
            height: 415,
            className: "fs-contact-dialog",
            content: '<div class="fs-contact-content"><div class="fs-contact-tabs ui-tab"><ul class="ui-switchable-nav ui-tab-items" data-role="nav">' +
                navHtmlStr +
                '</ul><div class="ui-switchable-content">' + panelHtmlStr + '</div></div>' +
                '<div class="fs-contact-bbar fn-clear"><div class="fs-contact-summary">共有<span class="num">0</span>位同事</div><div class="fs-contact-action"><button class="fs-contact-close-btn">关闭</button></div></div>' +
                '</div>',
            align: {
                selfXY: ['right', 0],     // element 的定位点，默认为左上角
                baseElement: triggerEl,     // 基准定位元素，默认为当前可视区域
                baseXY: [triggerEl.width(), triggerEl.height()]      // 基准定位元素的定位点，默认为左上角
            },
            "zIndex": 2000
        }, opts.dialogOpts || {})).render();
        var tab = new Tabs(_.extend({
            element: $('.fs-contact-tabs', dialog.element),
            triggers: $('.ui-tab-item', dialog.element),
            panels: $('.ui-tab-panel', dialog.element),
            activeIndex: 0,
            triggerType: 'click',
            withTabEffect: false
            //effect: 'fade'
        }, opts.tabOpts || {})).render();

        this.opts = opts;
        this.dialog = dialog;
        this.tab = tab;
        //保留每个实例的引用
        SelectPanel.ins.push(this);
        //自定义滚动条
        //this.scrollBarIns=[];
        $('.fs-contact-list-wrapper',dialog.element).each(function(){
            new Scrollbar({
                "element":$(this)
            });
        });
        this.init();
    };
    _.extend(SelectPanel.prototype, {
        "init": function () {
            var that = this;
            var opts = this.opts,
                data = opts.data;
            _.each(data, function (row, i) {
                that.updateTab(row, i);
            });
            this.bindEvents();
        },
        /**
         * 更新数据源，重绘组件
         * @param listData
         */
        "updateData":function(listData){
            var that=this;
            _.each(listData, function (row, i) {
                that.updateTab(row, i);
            });
        },
        "updateTab": function (data, i) {
            var title = data.title,
                type = data.type,
                list = data.list;
            var dialog = this.dialog,
                tab = this.tab,
                tabNavEl = tab.get('triggers').eq(i),
                tabPanelEl = tab.get('panels').eq(i);
            tabNavEl.html('<a href="javascript:;">' + title + '</a>');
            tabPanelEl.attr('emptype', type);
            //tabNavEl.html(title);
            this.doTabPanel(tabPanelEl, data);
        },
        "doTabPanel": function (panelSelector, data) {
            var panelEl = $(panelSelector),
                letterNavEl = $('.fs-contact-letter-nav', panelEl),
                listEl = $('.fs-contact-list', panelEl),
                letterNavEl;
            var i, htmlStr = '';
            var list=data.list, //列表数据
                sortType=data.sortType||"letter", //排序类型,letter表示按字母排序，origin表示遵循原来列表顺序
                unitSuffix=data.unitSuffix||"位同事";  //footer提示后缀
            var groupList,
                groupKeys;
            letterNavEl.html('<ul class="list-0"></ul><ul class="list-1"></ul>');
            for (i = 65; i <= 77; i++) {
                htmlStr += '<li>' + String.fromCharCode(i) + '</li>';
            }
            $('.list-0', letterNavEl).html(htmlStr);
            htmlStr = '';
            for (i = 78; i <= 90; i++) {
                htmlStr += '<li>' + String.fromCharCode(i) + '</li>';
            }
            $('.list-1', letterNavEl).html(htmlStr);
            //获得letter navs
            letterNavEl = $('li', letterNavEl);
            //构建contact list列表
            htmlStr = '';
            if(sortType=="letter"){     //按字母排序
                groupList = this.groupByLetter(list);
                groupKeys = _.sortBy(_.keys(groupList), function (v) {
                    return v;
                });
                _.each(groupKeys, function (key) {
                    var item = groupList[key];
                    var len = item.length,
                        htmlStr2 = '';
                    htmlStr += '<li><div class="index-box fn-clear"><div class="index-keyword">' + key + '</div><div class="item-length">' + len + '项</div></div><ul class="fs-contact-view">';
                    _.each(item, function (subItem) {
                        htmlStr2 += '<li class="fs-contact-item" itemid="' + subItem.id + '">' + subItem.name + '</li>';
                    });
                    htmlStr += htmlStr2 + '</ul></li>';
                    //设置导航高亮
                    letterNavEl.each(function () {
                        var meEl = $(this),
                            letter = meEl.text();
                        if (letter == key) {
                            meEl.addClass('fs-contact-letter-selected');
                        }
                    });
                });
                listEl.html(htmlStr);
            }else if(sortType=="origin"){   //按原序排
                htmlStr +='<ul class="fs-contact-view">';
                _.each(list, function (item) {
                    htmlStr += '<li class="fs-contact-item" itemid="' + item.id + '">' + item.name + '</li>';
                });
                htmlStr +='</ul>';
                listEl.html(htmlStr);
            }
            panelEl.data('unitSuffix',unitSuffix);
            this.updateSummary();
        },
        "show": function (emitEvent) {
            //修正对dialog定位
            var opts=this.opts,
                dialogOpts=opts.dialogOpts||{};
            var triggerEl = $(this.opts.trigger);
            this.dialog.set('align', _.extend({
                selfXY: ['right', 0],     // element 的定位点，默认为左上角
                baseElement: triggerEl,     // 基准定位元素，默认为当前可视区域
                baseXY: [triggerEl.width(), triggerEl.height()]      // 基准定位元素的定位点，默认为左上角
            },dialogOpts.align||{}));
            this.dialog.show();
            if(emitEvent!==false){  //默认触发show事件，除非emitEvent===false
                this.trigger('show');
            }

        },
        "hide": function (emitEvent) {  //默认触发hide事件，除非emitEvent===false
            this.dialog.hide();
            if(emitEvent!==false){
                this.trigger('hide');
            }
        },
        "groupByLetter": function (list) {
            var groupList = [];
            groupList = _.groupBy(list, function (v) {
                return v.spell.slice(0, 1).toUpperCase();
            });
            return groupList;
        },
        "updateSummary": function () {
            var tab = this.tab,
                dialog = this.dialog,
                dialogEl = dialog.element,
                activenPanelEl=tab.get('panels').eq(tab.get("activeIndex")),
                contactItemEl = $('.fs-contact-item', activenPanelEl),
                selectedItemEl = contactItemEl.filter('.fs-contact-item-selected'),
                summaryEl = $('.fs-contact-summary', dialogEl);
            var unitSuffix=activenPanelEl.data('unitSuffix');
            if (selectedItemEl.length > 0) {
                summaryEl.html('已选中' + selectedItemEl.length + '/' + contactItemEl.length);
            } else {
                summaryEl.html('共有' + contactItemEl.length + unitSuffix);
            }
        },
        /**
         * [ description]
         * @param  {[type]} ids   [description]
         * @param  {[type]} reset 是否清空原来选中项
         * @return {[type]}       [description]
         */
        //"select": function (ids, type, reset) {
        "select": function (ids, type, silent) {
            var opts=this.opts;
            var tab = this.tab,
                tabEl = tab.element,
                tabPanelEl = tab.get('panels'),
                itemsEl;
            var eventData = {};   //select事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $('.fs-contact-item', tabEl);
                tabPanelEl.each(function () {
                    var meEl = $(this),
                        empType = meEl.attr('emptype');
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $('.fs-contact-item', $('[emptype="' + type + '"]', tabEl));
                eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr('emptype')] = [];
            }

            if (ids[0] == "all") {
                itemsEl.addClass('fs-contact-item-selected');
                //设置select事件数据
                itemsEl.each(function () {
                    var meEl = $(this),
                        panelEl = meEl.closest('.ui-tab-panel'),
                        itemId = meEl.attr('itemid'),
                        empType = panelEl.attr('emptype');
                    eventData[empType].push({
                        "name": meEl.text(),
                        "id": itemId
                    });
                });
            } else {
                /*if (!!reset) {
                    itemsEl.removeClass('fs-contact-item-selected');
                }*/
                _.each(ids, function (id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.addClass('fs-contact-item-selected');
                    //设置select事件数据
                    itemEl.each(function () {
                        var meEl = $(this),
                            panelEl = meEl.closest('.ui-tab-panel'),
                            itemId = meEl.attr('itemid'),
                            empType = panelEl.attr('emptype');
                        eventData[empType].push({
                            "name": meEl.text(),
                            "id": itemId
                        });
                    });
                });
            }
            if(opts.singleCked){    //如果是单选的话，选中后隐藏
                this.hide();
            }
            if(!silent){
                this.trigger('select', eventData);
            }
        },
        /**
         * 取消选中动作
         * @param ids
         * @param type
         * @param silent
         */
        "unselect": function (ids, type,silent) {
            var tab = this.tab,
                tabEl = tab.element,
                tabPanelEl = tab.get('panels'),
                itemsEl;
            var eventData = {};  //unselect事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $('.fs-contact-item', tabEl);
                tabPanelEl.each(function () {
                    var meEl = $(this),
                        empType = meEl.attr('emptype');
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $('.fs-contact-item', $('[emptype="' + type + '"]', tabEl));
               // eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr('emptype')] = [];
                eventData[type] = [];
            }

            if (ids[0] == "all") {
                itemsEl.removeClass('fs-contact-item-selected');
                //设置unselect事件数据
                itemsEl.each(function () {
                    var meEl = $(this),
                        panelEl = meEl.closest('.ui-tab-panel'),
                        itemId = meEl.attr('itemid'),
                        empType = panelEl.attr('emptype');
                    eventData[empType].push({
                        "name": meEl.text(),
                        "id": itemId
                    });
                });
            } else {
                _.each(ids, function (id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.removeClass('fs-contact-item-selected');
                    //设置unselect事件数据
                    itemEl.each(function () {
                        var meEl = $(this),
                            panelEl = meEl.closest('.ui-tab-panel'),
                            itemId = meEl.attr('itemid'),
                            empType = panelEl.attr('emptype');
                        eventData[empType].push({
                            "name": meEl.text(),
                            "id": itemId
                        });
                    });
                });
            }
            if(!silent){
                this.trigger('unselect', eventData);
            }
        },
        "bindEvents": function () {
            var that = this;
            var tab = this.tab,
                tabEl = tab.element,
                dialog = this.dialog,
                dialogEl = dialog.element,
                opts = this.opts,
                triggerEl=$(opts.trigger);
            tabEl.on('click', '.fs-contact-item', function (e) {
                var meEl = $(this),
                    panelEl = meEl.closest('.ui-tab-panel'),
                    itemId = meEl.attr('itemid'),
                    empType = panelEl.attr('emptype');
                if (meEl.hasClass('fs-contact-item-selected')) {
                    //meEl.removeClass('fs-contact-item-selected');
                    that.unselect(itemId, empType);
                } else {
                    if (opts.singleCked) {
                        that.unselect('all', 'all');
                    }
                    that.select(itemId, empType);
                }
                that.updateSummary();
            });
            tab.on('switched', function (toIndex, fromIndex) {
                var curPanelEl = tab.get('panels').eq(toIndex),
                    listWEl=$('.fs-contact-list-wrapper',curPanelEl);
                that.updateSummary();
                //自定义滚动条更新
                listWEl.data('ins').update();
            });
            dialog.after('show',function(){   //打开后滚到最上面
                var elEl=this.element,
                    listWEl=$('.fs-contact-list-wrapper',elEl);
                //listWEl.scrollTop(0);
                listWEl.data('ins').update();
            });
            dialogEl.click(function (e) {
                e.stopPropagation();
            });
            dialogEl.on('click', '.fs-contact-close-btn', function () {
                that.hide();
            });
            //点击字母导航到对应条目开始
            tabEl.on('click','.fs-contact-letter-selected',function(){
                var meEl=$(this),
                    letter=meEl.text(),
                    listWEl=meEl.closest('.ui-tab-panel').find('.fs-contact-list-wrapper'),
                    contactListEl=$('.fs-contact-list',listWEl),
                    letterItem;
                $('li',contactListEl).each(function(){
                    var itemEl=$(this),
                        indexKeywordEl=$('.index-keyword',itemEl);
                    if(indexKeywordEl.text()==letter){
                        letterItem=itemEl;
                        return false;   //中断循环
                    }
                });
                if(letterItem){
                    //listWEl.scrollTop(letterItem.position().top);
                    listWEl.data('ins').update(letterItem.position().top);
                }
            });
            //点击trigger显示面板
            triggerEl.click(function (e) {
                //隐藏其它instance
                _.each(_.filter(SelectPanel.ins, function (item) {
                    return item !== that;
                }), function (item) {
                    item.hide();
                });
                if(that.dialog.element.is(':visible')){
                    that.hide();
                }else{
                    that.show();
                }
                that.updateSummary();
                //e.stopPropagation();
                e.preventDefault();
            });

            /*this.regHide = util.regDocEvent('click', function () {
                that.hide();
            });*/
            util.regGlobalClick(this.dialog.element,function(evt){
                var targetEl=$(evt.target);
                if(triggerEl.length>0&&(!$.contains(triggerEl[0],targetEl[0]))&&(triggerEl[0]!==targetEl[0])){  //判定点击dom不是trigger本身或者不包含在trigger里
                    if(that.dialog.element.is(':visible')){
                        that.hide();
                    }
                }
            });

        },
        "destroy": function () {
            var that = this;
            var opts = this.opts;
            this.dialog.destroy();
            this.tab.destroy();
            this.off(); //注销事件
            $(opts.trigger).unbind('click');
            //util.unRegDocEvent('click', this.regHide);
            //清空引用
            SelectPanel.ins = _.filter(SelectPanel.ins, function (item) {
                return item !== that;
            });
        }
    });
    SelectPanel.ins = [];
    Events.mixTo(SelectPanel);
    /**
     * 选人或可视范围bar
     */
    var SelectBar = function (opts) {
        opts = _.extend({
            "element": null,
            "data": null,
            "title": "",
            "autoCompleteTitle": "",
            "acTpl": "",
            "singleCked": false,
            "defaultSelectedData":[]    //默认选中的数据
            /*"acInitData":[{ //example
             "parseData":function(data){
             var acData=[];
             var vals=data.value.split(','),
             ids=data.id.split(',');
             _.each(vals,function(val,i){
             acData[i]={
             "value":vals[i],
             "id":ids[i]
             };
             });
             return acData;
             },
             "createHtml":function(data){
             var itemEl;
             itemEl=$('<li class="ui-autocomplete-item"><a href="javascript:;">'+data.value+'</a></li>');
             return itemEl;
             },
             "eqFields":['id'],
             "store":[{
             "value":"test1,test2",
             "id":"1,13",  //其他自定义字段
             "type":"mix"
             },{
             "value":"test3,test4",
             "id":"3,4",  //其他自定义字段
             "type":"mix"
             }]
             },{
             "parseData":function(data){
             var acData=[].concat(data);
             return acData;
             },
             "createHtml":function(data){
             var itemEl;
             itemEl=$('<li class="ui-autocomplete-item"><a href="javascript:;">'+data.name+'</a></li>');
             return itemEl;
             },
             "eqFields":['id','type'],
             "store":[{
             "type":"p",
             "name":"13",
             "id":"13",
             "spell":"qishuxu"
             }]
             }]*/
        }, opts || {});
        var elEl = $(opts.element);
        var that = this;
        var acTpl = '',
            acTplEl = publishTplEl.filter('.publish-ac'),
            acDataBak; //自动完成的筛选数据
        if (opts.acTpl.length == 0) {
            acTplEl = publishTplEl.filter('.publish-ac');
            $('.fs-publish-ac-title', acTplEl).html(opts.autoCompleteTitle);
            acTpl = acTplEl.html();
        } else {
            acTpl = opts.acTpl;
        }
        $('.fs-publish-ac-title', acTplEl).html(opts.autoCompleteTitle);
        this.opts = opts;
        this.element = elEl;
        //设置自动完成的筛选数据
        acDataBak = this.getAcData();
        if (elEl.length > 0) {
            elEl.each(function () {
                var barEl = $(this),
                    selectPanel,
                    ac,
                    acFilter,
                    acFilterFunc;
                //构建html结构
                barEl.html('<div class="fs-contact-bar fn-clear"><div class="fs-contact-bar-content fn-clear"><ul class="fs-contact-bar-list"></ul><div class="input-wrapper"><span class="input-tip"><i class="prefix">+</i>' + opts.title + '</span><input class="input-field" type="text" /></div></div><em class="show-select-panel-h">&nbsp;</em></div>');
                //自动完成输入
                ac = new AutoComplete({
                    trigger: $('.input-field', barEl),
                    template: acTpl,
                    delay: 0,    //默认延迟100ms
                    submitOnEnter: false,    //回车不会提交表单
                    dataSource: acDataBak.slice(0),
                    zIndex: 2000,
                    initDataSource:opts.acInitData,
                    className:'fs-contact-bar-ac',
                    selectFirst:true    //自动选中第一个
                }).render();

                //重设过滤器
                acFilter = ac.get('filter');
                acFilter.func = function (data, query, options) {
                    var selectedData = that.getSelectedData(barEl);
                    var stringMatch = filter.stringMatch,
                        startsWith=filter.startsWith;
                    var filterData=[];
                    var filterData1 = stringMatch.apply(this, [data, query, {   //全词匹配
                        "key": "name"
                    }]);
                    var filterData2 = startsWith.apply(this, [data, query.toLowerCase(), {  //挨个匹配
                        "key": "spell"
                    }]);
                    //先插入filterData2的数据
                    _.each(filterData2,function(itemData){
                        if(!_.find(filterData1,function(itemData2){
                            return itemData2.id==itemData.id;
                        })){
                            filterData.push(itemData);
                        }
                    });
                    filterData=filterData.concat(filterData1);

                    //过滤掉已选中的data
                    _.each(selectedData, function (cateData, empType) {
                        _.each(cateData, function (selectedDataId) {
                            filterData = _.reject(filterData, function (v) {
                                if (v.type == empType && v.id == selectedDataId) {
                                    return true;
                                }
                            });
                        });
                    });
                    //动态设置query用于在模板显示
                    ac.model.query=query;
                    //渲染局部模板
                    ac.renderPartial(".ac-title");
                    return filterData;
                };
                ac.set('filter', acFilter);
                //监听itemSelect事件
                ac.on('itemSelect', function (data) {
                    if (opts.singleCked) {
                        that.removeAllItem(barEl);
                    }
                    that.addItem(data, barEl);
                    //隐藏输入框
                    that.switchInputState(barEl, 'hide');
                   /* if (!opts.singleCked) {  //如果是多选，还可以继续输入
                        that.switchInputState(barEl, 'show');
                    }*/
                });
                ac.after('show',function(){
                    var initPanelEl=$('.ui-autocomplete-init-panel',ac.element),
                        queryPanelEl=$('.ui-autocomplete-query .ui-autocomplete-ctn',ac.element);
                    var offsetPos,
                        initHeight,
                        finallyHeight,
                        winHeight,
                        winTopScroll;
                    initPanelEl.css({
                        "height":"auto",
                        "overflow":"auto"
                    });
                    queryPanelEl.css({
                        "height":"auto",
                        "overflow":"auto"
                    });
                    if(initPanelEl.is(':visible')){
                        offsetPos=initPanelEl.offset();
                        initHeight=initPanelEl.height();
                        winHeight=$(root).height();
                        winTopScroll=$(root).scrollTop();
                        if(offsetPos.top+initHeight>winHeight+winTopScroll){
                            finallyHeight=winHeight-offsetPos.top+winTopScroll-10;
                            initPanelEl.height(finallyHeight>180?finallyHeight:180);
                        }
                    }else{
                        offsetPos=queryPanelEl.offset();
                        initHeight=queryPanelEl.height();
                        winHeight=$(root).height();
                        winTopScroll=$(root).scrollTop();
                        if(offsetPos.top+initHeight>winHeight+winTopScroll){
                            finallyHeight=winHeight-offsetPos.top+winTopScroll-30;
                            queryPanelEl.height(finallyHeight>180?finallyHeight:180);
                        }
                    }
                });
                //阻止ac上的点击冒泡
                ac.element.on('click',function(evt){
                    evt.stopPropagation();
                });
                selectPanel = new SelectPanel({
                    "trigger": $('.show-select-panel-h', barEl),
                    "data": opts.data,
                    "singleCked": opts.singleCked
                });
                selectPanel.on('show', function () {
                    var triggerEl=$('.show-select-panel-h',barEl);
                    var selectedData = that.getSelectedData(barEl);
                    //先清空原来的选项
                    selectPanel.unselect('all','all',true); //不触发unselect事件
                    _.each(selectedData, function (v, key) {
                        selectPanel.select(v, key,true);    //不触发select事件
                    });
                    //隐藏单选的话调用select会隐藏selectPanel,所有要手动显示出selectPanel并且不触发show事件
                    if(opts.singleCked){
                        selectPanel.show(false);    //不触发show事件
                    }
                    //设置trigger class
                    triggerEl.addClass('show-select-panel-h-up');
                });
                selectPanel.on('hide', function () {
                    var triggerEl=$('.show-select-panel-h',barEl);
                    //设置trigger class
                    triggerEl.removeClass('show-select-panel-h-up');
                });
                selectPanel.on('select', function (eventData) {
                    _.each(eventData, function (v, key) {
                        _.each(v, function (itemData) {
                            that.addItem({
                                "type": key,
                                "id": itemData.id,
                                "name": itemData.name
                            }, barEl);
                        });
                    });
                });
                selectPanel.on('unselect', function (eventData) {
                    _.each(eventData, function (v, key) {
                        _.each(v, function (itemData) {
                            that.removeItem({
                                "type": key,
                                "id": itemData.id,
                                "name": itemData.name
                            }, barEl);
                        });

                    });
                });
                //注册组件事件
                barEl.on('click', '.fs-contact-bar-content', function (e) {
                    //先隐藏所有的SelecBar自动完成
                    /*$('.fs-contact-bar-ac').each(function(){
                        Widget.query(this).hide();
                    });*/
                    //先触发body的click事件，隐藏所有的下拉框
                    $('body').click();
                    that.switchInputState(barEl, 'show');
                    //隐藏selectPanel
                    selectPanel.hide();
                    e.stopPropagation();
                }).on('click','.fs-contact-bar-list,.input-field',function(evt){
                    evt.stopPropagation();  //阻止冒泡
                });
                //可通过删除键删除已选中的item
                $('.input-field', barEl).keydown(function (e) {
                    var meEl = $(this),
                        listEl = $('.fs-contact-bar-list', barEl),
                        lastItemEl = $('.fs-contact-bar-item', listEl).slice(-1),
                        v = _.str.trim(meEl.val());
                    if (v.length == 0 && lastItemEl.length > 0 && e.keyCode == 8) {  //backspace.keyCode==8
                        that.removeItem({
                            "id": lastItemEl.attr("itemid"),
                            "type": lastItemEl.attr("emptype")
                        }, barEl);
                    }
                });
                /*that.docClick = util.regDocEvent('click', function () {
                    that.switchInputState(barEl, 'hide');
                });*/
                util.regGlobalClick(barEl,function(){
                    that.switchInputState(barEl, 'hide');
                });
                barEl.on('click', '.fs-contact-bar-list .remove-h', function () {
                    var meEl = $(this),
                        itemEl = meEl.closest('.fs-contact-bar-item'),
                        itemId = itemEl.attr('itemid'),
                        empType = itemEl.attr('emptype');
                    that.removeItem({
                        "id": itemId,
                        "type": empType
                    }, barEl);
                    //同时隐藏select panel
                    selectPanel.hide();
                    //itemEl.remove();
                });
                //设置默认选中值
                if(opts.defaultSelectedData.length>0){
                    _.each(opts.defaultSelectedData,function(val){
                        var itemData=that.getItemData(val.id,val.type);
                        //加入
                        if(itemData){
                            that.addItem(itemData,barEl);
                        }
                    });
                }
                barEl.data('ins', {
                    "ac": ac,
                    "selectPanel": selectPanel
                });
            }); //end of each
            //监听add和remove事件，更新ac的初始化面板
            this.on('add', function (itemData, elSelector) {
                if(opts.acInitData){
                    that.updateAcState(elSelector, opts.acInitData);
                }
            });
            this.on('remove', function (itemData, elSelector) {
                if(opts.acInitData){
                    that.updateAcState(elSelector, opts.acInitData);
                }
            });
        }
    };
    Events.mixTo(SelectBar);
    /**
     * 更新组件数据并重绘
     * @returns {Array}
     */
    SelectBar.prototype.updateData = function (newData) {
        var opts = this.opts;
        var elEl=this.element;
        var newAcData;
        //更新引用
        opts.data=newData;
        //重新获取ac data
        newAcData=this.getAcData();
        elEl.each(function () {
            var barEl=$(this);
            var ins=barEl.data('ins'),
                ac=ins.ac,
                selectPanel=ins.selectPanel;
            ac.dataSource.set("source",newAcData);
            selectPanel.updateData(newData);
        });
    };
    /**
     * 格式化自动完成数据
     * @return {[type]} [description]
     */
    SelectBar.prototype.getAcData = function () {
        var opts = this.opts,
            data = opts.data,
            acData = [],
            type;
        _.each(data, function (item) {
            type = item.type;
            _.each(item.list, function (subItem) {
                acData.push({
                    "name": subItem.name,
                    "id": subItem.id,
                    "spell": subItem.spell.toLowerCase(),
                    "type": type
                });
            });
        });
        return acData;
    };
    /**
     * 设置自定完成的初始init数据
     * @param acInitData
     * @param elSelector
     */
    SelectBar.prototype.setAcInitData = function (acInitData,elSelector) {
        var elEl = this.getEl(elSelector),
            ac=elEl.data('ins').ac;
        ac.set('initDataSource',acInitData);
    };
    SelectBar.prototype.addItem = function (itemData, elSelector) {
        var elEl = this.getEl(elSelector),
            listEl = $('.fs-contact-bar-list', elEl);
        var emptype=itemData.valueType||itemData.type;
        var htmlStr,
            itemEl,
            cls="";
        //寻找已存在的item
        itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + emptype + '"]');
        if (itemEl.length == 0) {
            if(emptype=="g"){
                cls=" fs-cbi-dept";
                if(parseInt(itemData.id)==999999){
                    cls=" fs-cbi-allcomp";
                }
            }
            htmlStr = '<li class="fs-contact-bar-item'+cls+'" itemid="' + itemData.id + '" emptype="' + emptype + '"><span class="item-name">' + itemData.name + '</span><span class="remove-h">×</span></li>';
            $(htmlStr).appendTo(listEl);
            this.trigger('add', itemData, elSelector);
        }
    };
    SelectBar.prototype.removeItem = function (itemData, elSelector) {
        var elEl = this.getEl(elSelector),
            listEl = $('.fs-contact-bar-list', elEl);
        var emptype=itemData.valueType||itemData.type;
        var itemEl;
        //寻找已存在的item
        itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + emptype + '"]');
        if(itemEl.length>0){
            itemEl.remove();
            this.trigger('remove', itemData, elSelector);
        }
    };
    SelectBar.prototype.removeAllItem = function (elSelector) {
        var that = this;
        var elEl = this.getEl(elSelector),
            listEl = $('.fs-contact-bar-list', elEl);
        var itemEl = $('.fs-contact-bar-item', listEl);
        itemEl.each(function () {
            var meEl = $(this);
            that.removeItem({
                "id": meEl.attr('itemid'),
                "type": meEl.attr('emptype')
            }, elEl);
        });
    };
    SelectBar.prototype.switchInputState = function (elSelector, state) {
        var elEl,
            inputWEl,
            tipEl,
            inputEl;
        if(!state){
            state=elSelector;
            elEl = this.getEl();
        }else{
            elEl = this.getEl(elSelector);
        }
        inputWEl = $('.input-wrapper', elEl);
        tipEl = $('.input-tip', inputWEl);
        inputEl = $('.input-field', inputWEl);
        var ins=elEl.data('ins');
        state = state || 'show';
        if (state == "show") {
            tipEl.hide();
            inputEl.show();
            setTimeout(function(){
                inputEl.get(0).focus();
            },0);
            this.trigger('inputshow');  //触发inputshow事件
        } else if (state == "hide") {
            tipEl.show();
            inputEl.val('').hide();
            //隐藏自动完成
            ins.ac.hide();
            this.trigger('inputhide'); //触发inputhide事件
        }

    };
    SelectBar.prototype.getSelectedData = function (elSelector) {
        var itemEl;
        var data = {};
        var elEl = this.getEl(elSelector);
        itemEl = $('.fs-contact-bar-item', elEl);
        if (itemEl.length > 0) {
            itemEl.each(function () {
                var meEl = $(this),
                    valueType = meEl.attr('emptype'),
                    itemId = meEl.attr('itemid');
                if (!data[valueType]) {
                    data[valueType] = [];
                }
                //data[empType].push(itemId);
                data[valueType]=data[valueType].concat(itemId.split(','));
            });
        }
        return data;
    };
    /**
     * 根据itemId和empType获取item详细信息
     * @param itemId
     * @param empType
     * @returns {*}
     */
    SelectBar.prototype.getItemData = function (itemId,empType) {
        var acData=this.getAcData();
        return _.find(acData,function(itemData){
            if(itemData.id==itemId&&itemData.type==empType){
                return true;
            }
        });
    };
    SelectBar.prototype.updateAcState = function (elSelector, acInitData) {
        var elEl = this.getEl(elSelector),
            ac = elEl.data('ins').ac,
            selectData = this.getSelectedData(elEl),
            newAcInitData = [];
        _.each(acInitData, function (itemInitData, i) {
            newAcInitData[i] = {
                "parseData": itemInitData.parseData,
                "createHtml": itemInitData.createHtml,
                "eqFields":itemInitData.eqFields,
                "renderCb": itemInitData.renderCb
            };

            newAcInitData[i].store = util.deepClone(itemInitData.store); //不要覆盖初始化ac数据,深度拷贝
        });
        //下面这一团是为了从ac的初始化数据中删除已选中的item data
        _.each(selectData, function (typeData, type) {
            _.each(typeData, function (itemId) {
                _.each(newAcInitData, function (itemInitData) {
                    var parseData = itemInitData.parseData,
                        store = itemInitData.store;
                    itemInitData.store = _.filter(store, function (storeItemData) {
                        var data;
                        if(storeItemData){  //排除掉离职的人
                            data = parseData(storeItemData)[0];
                            if(storeItemData.type=="mix"){   //对于type==mix的item直接放行
                                return true;
                            }else{
                                if (data.id == itemId && data.type == type) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    });
                });
            });
        });
        //更新ac的初始面板
        ac.set('initDataSource', newAcInitData);
    };
    SelectBar.prototype.getEl = function (elSelector) {
        if (elSelector) {
            return $(elSelector);
        } else {
            return this.element.eq(0);
        }
    };
    SelectBar.prototype.destroy = function () {
        this.element.each(function () {
            var meEl = $(this),
                ins = meEl.data('ins');
            ins&&ins.ac.destroy();
            ins&&ins.selectPanel.destroy();
        });
        this.off();
        //util.unRegDocEvent('click', this.docClick);
        this.element.removeData();
        this.element.empty();
        this.element = null;
    };
    /**
     * 输入框自适应高度
     */
    var InputAutoHeight = function () {

    };
    /**
     * 回执范围选择对话框
     * @type {*}
     */
    var Receipt=Dialog.extend({
        "attrs":{
            "content":publishTplEl.filter('.receipt-dialog-tpl').html(),
            "className":"fs-publish-receipt",
            "inputSelector":null, //input选择符
            "rangeSb":null, //SelectBar组件
            "submitCb":FS.EMPTY_FN, //点击"确定"回调
            "cancelCb":FS.EMPTY_FN,  //点击"取消"回调
            "zIndex":"1001" //保证比一般的dialog高2层
        },
        "events":{
            "click .f-sub:enabled":"_submit",
            "click .f-cancel":"_cancel",
            "click .content-at-h.state-active":"_clickContentAt",
            "click .send-range-h.state-active":"_clickSendRange",
            "click .ui-dialog-close":"_cancel"
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
            var that=this;
            var elEl=this.element;
            var rangeSbEl=$('.sb-range',elEl),
                rangeSb=new SelectBar({
                    "element": rangeSbEl,
                    "data": [
                        {
                            "title": "部门",
                            "type": "g",
                            "list": contactData["g"]
                        },{
                            "title": "同事",
                            "type": "p",
                            "list": contactData["p"]
                        }
                    ],
                    "title": "选择同事和范围&#8230;",
                    "acInitData":util.getPublishRange('receipt'),
                    "autoCompleteTitle": "请输入同事的名称或拼音"
                });
            rangeSb.on('add',function(){
                that.updateSubmitState();
            });
            rangeSb.on('remove',function(){
                that.updateSubmitState();
            });
            this.sb=rangeSb;
        },
        "render":function(){
            var result=Receipt.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=Receipt.superclass.show.apply(this,arguments);
            this._setShortcutData();
            return result;
        },
        "hide":function(){
            var result=Receipt.superclass.hide.apply(this,arguments);
            this._clear();  //dialog清空
            return result;
        },
        /**
         * 根据sb的选中值更新确认按钮状态
         */
        "updateSubmitState":function(){
            var elEl=this.element,
                subEl=$('.f-sub',elEl);
            var sb=this.sb,
                sbData=sb.getSelectedData();
            if(_.isEmpty(sbData)){
                subEl.addClass('button-state-disabled').prop('disabled',true);
            }else{
                subEl.removeClass('button-state-disabled').prop('disabled',false);
            }
        },
        /**
         * 设置快捷选择数据
         */
        "_setShortcutData":function(){
            var elEl=this.element,
                contentAtHEl=$('.content-at-h',elEl),   //at正文快捷键
                sendRangeHEl=$('.send-range-h',elEl);   //发送范围快捷键
            var inputEl=$(this.get('inputSelector')), //正文at
                rangeSb=this.get('rangeSb');    //发送范围
            var atName,
                rangeSbData,
                atData=[],
                rangeSbFullData=[];
            if(inputEl.length>0){   //如果input selector有效
                atName=util.getAtFromInput(inputEl);
                //收集at正文数据
                _.each(atName,function(itemName,i){
                    var itemData= util.getContactDataByName(itemName,'g'); //先尝试找部门
                    if(!itemData){
                        itemData=util.getContactDataByName(itemName,'p');
                    }
                    if(itemData){
                        if(!_.some(atData,function(itemData2){   //去重
                            return itemData2.id==itemData.id;
                        })){
                            atData.push(itemData);
                        }

                    }
                });
            }
            if(rangeSb){    //如果可视范围有效
                //收集发送范围数据
                rangeSbData=rangeSb.getSelectedData();
                //"p"类型数据
                _.each(rangeSbData['p'],function(itemId){
                    rangeSbFullData.push(util.getContactDataById(itemId,'p'));
                });
                //"g"类型数据
                _.each(rangeSbData['g'],function(itemId){
                    rangeSbFullData.push(util.getContactDataById(itemId,'g'));
                });
            }
            //保留引用
            this.shortcutData={
                "atData":atData,
                "rangeData":rangeSbFullData
            };
            //设置快捷页面状态
            if(atData.length>0){
                contentAtHEl.addClass('state-active');
                $('.num',contentAtHEl).text(atData.length);
            }else{
                contentAtHEl.removeClass('state-active');
                $('.num',contentAtHEl).text(0);
            }
            if(rangeSbFullData.length>0){
                sendRangeHEl.addClass('state-active');
                $('.num',sendRangeHEl).text(rangeSbFullData.length);
            }else{
                sendRangeHEl.removeClass('state-active');
                $('.num',sendRangeHEl).text(0);
            }
        },
        /**
         * 点击at正文快捷键触发
         * @param evt
         */
        "_clickContentAt":function(evt){
            var shortcutData=this.shortcutData,
                atData=shortcutData.atData;
            var sb=this.sb;
            _.each(atData,function(itemData){
                sb.addItem(itemData);
            });
        },
        /**
         * 点击发送范围快捷键触发
         * @param evt
         */
        "_clickSendRange":function(evt){
            var shortcutData=this.shortcutData,
                rangeData=shortcutData.rangeData;
            var sb=this.sb;
            _.each(rangeData,function(itemData){
                sb.addItem(itemData);
            });
        },
        "_clear":function(){
            var elEl=this.element,
                contentAtHEl=$('.content-at-h',elEl),   //at正文快捷键
                sendRangeHEl=$('.send-range-h',elEl),   //发送范围快捷键
                isSmsSendEl=$('.is-sms-send',elEl);
            var sb=this.sb;
            //同事范围
            sb.removeAllItem();
            //清除快捷数据
            this.shortcutData=null;
            contentAtHEl.removeClass('state-active');
            $('.num',contentAtHEl).text("0");
            sendRangeHEl.removeClass('state-active');
            $('.num',sendRangeHEl).text("0");
            //是否发送短信
            isSmsSendEl.prop('checked',false);
        },
        /**
         * 获取回执个人配置信息
         */
        "_getReceiptConfig":function(){
            var sb=this.sb,
                sbData=sb.getSelectedData(),
                employeeIDs=sbData["p"]||[], //员工
                circleIDs=sbData["g"]||[], //部门
                rangeIds=circleIDs.join(',')+'|'+employeeIDs.join(','),
                rangeNames=""; //可视范围名称
            var receiptEmployees=util.getPersonalConfig('receiptEmployees')||[],
                receiptRanges=util.getPersonalConfig('receiptRanges')||[];

            //可视范围中的员工
            _.each(employeeIDs,function(employeeId){
                var employeeData=util.getContactDataById(employeeId,'p');
                receiptEmployees= _.filter(receiptEmployees,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=employeeId;
                });
                //前插一个新的
                receiptEmployees.unshift({
                    "dataID": employeeId,
                    "isCircle":false,
                    "name":employeeData.name
                });
                if(receiptEmployees.length>5){
                    receiptEmployees.pop();  //大于5的话干掉最后一个
                }
            });
            //可视范围
            if(circleIDs.length+employeeIDs.length>1){
                receiptRanges= _.filter(receiptRanges,function(configItem){     //先删掉以前存储的
                    return configItem.dataIDs!=rangeIds;
                });

                _.each(circleIDs,function(circleId){
                    var circleData=util.getContactDataById(circleId,'g');
                    rangeNames+=circleData.name+',';
                });
                _.each(employeeIDs,function(employeeId){
                    var employeeData=util.getContactDataById(employeeId,'p');
                    rangeNames+=employeeData.name+',';
                });
                //干掉最后一个逗号
                if(rangeNames.length>0){
                    rangeNames=rangeNames.slice(0,-1);
                }
                //前插一个新的
                receiptRanges.unshift({
                    "dataIDs": rangeIds,
                    "names":rangeNames
                });
                if(receiptRanges.length>5){
                    receiptRanges.pop();  //大于5的话干掉最后一个
                }
            }
            return {
                "receiptEmployees":receiptEmployees,
                "receiptRanges":receiptRanges
            };
        },
        /**
         * 存储回执配置到本地缓存
         */
        "_setReceiptConfig":function(){
            var config=this._getReceiptConfig();
            _.each(config,function(val,cateKey){
                util.setPersonalConfig(cateKey,val);
            });
        },
        /**
         * 更新回执的个人配置信息到服务端
         */
        "_updateReceiptConfig":function(){
            util.updatePersonalConfig();
        },
        "_submit":function(){
            var submitCb=this.get('submitCb'),
                sb=this.sb;
            var sbData=sb.getSelectedData();
            //更新回执配置到服务端
            this._setReceiptConfig();
            this._updateReceiptConfig();
            //将sb的选中数据作为submitCb参数调用
            submitCb&&submitCb.call(this,sbData);
        },
        "_cancel":function(){
            var cancelCb=this.get('cancelCb');
            //用户自定义回调
            cancelCb&&cancelCb.call(this);
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            this.shortcutData=null;
            result=Receipt.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    /**
     * 查看我的历史日志
     * @type {*}
     */
    var MyHistoryPlan=Dialog.extend({
        "attrs":{
            "content":_.template(publishTplEl.filter('.my-history-plan-tpl').html())({
                "blankImgSrc":FS.BLANK_IMG
            }),
            "className":"my-history-plan",
            "width":990,
            "height":507,
            "inputSelector":{   //日志的三个输入框选择符
                "today":null,   //今日工作总结
                "tomorrow":null,    //明日工作计划
                "xdth":null //心得提会
            },
            "planType":1 //默认日志类型
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .nav-l":"_clickNavLeft",
            "click .nav-r":"_clickNavRight"
        },
        "setup":function(){
            var result;
            result=MyHistoryPlan.superclass.setup.apply(this,arguments);
            return result;
        },
        "_renderCpt":function(){
            var that=this;
            var elEl=this.element,
                switchLinkEl=$('.switch-l',elEl),
                userNameEl=$('.user-name',elEl),
                avatarEl=$('.user-avatar',elEl),
                mediaEl=$('.media',elEl),
                inputEl=$('.publish-input',elEl),
                topicTipEl=$('.publish-topic-tip',elEl);
            var sp=new SelectPanel({
                "trigger": switchLinkEl,
                "data": [{
                    "title":"同事",
                    "type":"p",
                    "list":contactData["p"]
                }],
                "singleCked": true,  //单选方式
                "dialogOpts":{
                    align: {
                        selfXY: [0, 0],     // element 的定位点，默认为左上角
                        baseElement: switchLinkEl,     // 基准定位元素，默认为当前可视区域
                        baseXY: [0, 20]      // 基准定位元素的定位点，默认为左上角
                    }
                }
            });
            sp.on('select',function(selectData){
                var typeData=selectData["p"],
                    userData=typeData[0];
                userData=util.getContactDataById(userData.id,'p');
                userNameEl.attr('employeeid',userData.id).text(userData.name);
                avatarEl.attr("src",util.getAvatarLink(userData.profileImagePath,3));
                //同时取消选中
                sp.unselect(userData.id,'p');
                //更新历史日志
                that._updateHistory({
                    "feedID":0,
                    "isForward":true
                });
            });
            var media=new MediaMaker({
                "element": mediaEl,
                "action": ["at","topic"],
                "actionOpts": {
                    "at": {
                        "inputSelector": inputEl
                    },
                    "topic":{
                        "inputSelector": inputEl
                    }
                }
            });
            var atInput=new AtInput({
                "element": inputEl
            });
            inputEl.keyup(function(){
                var meEl=$(this);
                var v= _.str.trim(meEl.val()),
                    name=meEl.attr('name');
                if(/#[^\n]+?#/g.test(v)){
                    topicTipEl.slideDown(200);
                }else{
                    topicTipEl.slideUp(200);
                }
            });
            //show后触发input的keyup事件，处理话题提示
            this.after('show',function(){
                inputEl.keyup();
            });
            this.sp=sp;
            this.media=media;
            this.atInput=atInput;
        },
        "render":function(){
            var result;
            result=MyHistoryPlan.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "_submit":function(){
            var elEl=this.element,
                todayInputEl=$('.today-input',elEl),
                tomorrowInputEl=$('.tomorrow-input',elEl),
                xdthInputEl=$('.xdth-input',elEl);
            var inputSelector=this.get('inputSelector');
            $(inputSelector.today).val(todayInputEl.val()).keyup().change().trigger('autosize.resize');
            $(inputSelector.tomorrow).val(tomorrowInputEl.val()).keyup().change().trigger('autosize.resize');
            $(inputSelector.xdth).val(xdthInputEl.val()).keyup().change().trigger('autosize.resize');
            this.hide();
        },
        "_cancel":function(){
            this.hide();
        },
        "show":function(){
            var result;
            result=MyHistoryPlan.superclass.show.apply(this,arguments);
            this._resetState();
            return result;
        },
        /**
         * 时间左导航
         * @param evt
         */
        "_clickNavLeft":function(evt){
            var linkEl=$(evt.currentTarget);
            if(!linkEl.hasClass('state-disabled')){
                this._updateHistory({
                    "isForward":true
                });
            }
        },
        /**
         * 时间右导航
         * @param evt
         */
        "_clickNavRight":function(evt){
            var linkEl=$(evt.currentTarget);
            if(!linkEl.hasClass('state-disabled')){
                this._updateHistory({
                    "isForward":false
                });
            }
        },
        /**
         * 重置状态，默认显示当前登录用户plan信息
         * 同步当前日志信息
         */
        "_resetState":function(){
            var loginUserData=contactData["u"];
            var sp=this.sp;
            //设置当前feedID
            this.currentFeedId=0;
            //切换到当前用户,切换用户的同时会重新刷新历史内容
            sp.select(loginUserData.id,'p');
            //设置当前日志内容
            this._updateEditContent();
            //触发input的keyup事件，处理话题提示
            //$('.publish-input',this.element).keyup();
        },
        /**
         * 更新历史日志内容
         */
        "_updateHistory":function(requestData){
            var that=this;
            var elEl=this.element,
                userNameEl=$('.user-name',elEl),
                navLeftEl=$('.nav-l',elEl),
                navRightEl=$('.nav-r',elEl),
                showDateEl=$('.show-area',elEl);
            var currentEmployeeId=userNameEl.attr('employeeid');
            util.api({
                "url":"/Feed/GetSomeOnePlanWithForwardOrBackward",
                "type":"get",
                "data": _.extend({
                    "employeeID":currentEmployeeId,
                    "feedID":this.currentFeedId||0,
                    "planType":that.get('planType'),    //只查询日志类型的历史
                    "isForward":false    //默认向前查询,相对于当前时间向过去查询
                },requestData),
                "success":function(responseData){
                    var dataRoot,
                        createTime;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        that.currentFeedId=dataRoot.feedID;
                        //拼接日志内容
                        that._renderHisPlan(dataRoot,responseData);
                        //先加上禁用class
                        navRightEl.addClass('state-disabled');
                        navLeftEl.addClass('state-disabled');
                        //根据标识去除disable class
                        if(dataRoot.hasForward){
                            navLeftEl.removeClass('state-disabled');
                        }
                        if(dataRoot.hasBackward){
                            navRightEl.removeClass('state-disabled');
                        }
                        //更新当前日志创建时间
                        if(dataRoot.createTime==0){
                            createTime=moment();
                        }else{
                            createTime=moment.unix(dataRoot.createTime);
                        }
                        showDateEl.text(createTime.format('MM月DD日（dddd）'));
                    }
                }
            });
        },
        /**
         * 拼接历史日志
         */
        "_renderHisPlan":function(planData,responseData){
            var elEl=this.element,
                planContentEl=$('.plan-content',elEl);
            var report=planData.report||"", //今日总结
                planContent=planData.planContent||"",   //明日计划
                feedContent=planData.feedContent||"";   //心得
            var htmlStr='';
            var planTypeNames=this._getPlanTypeName();
            
            var commentContent = planData.commentContent, //目前通过是否有点评内容来判断是否显示领导点评，可能并不是特别合理
                replyContentList = '',
                senderName = '',
                RCTime = '',
                senderId = '',
                profileImage = '',
                replycontText = '',
                operationText = '1',
                replyContentStr = '',
                replyconterText = '以下为日志点评人的点评';

            _.each([{
                "title":planTypeNames[0]+"工作总结",
                "content":report
            },{
                "title":planTypeNames[1]+"工作计划",
                "content":planContent
            },{
                "title":"工作心得体会",
                "content":feedContent
            }],function(itemData){
                htmlStr+='<li class="content-item"><div class="content-item-title">'+itemData.title+'</div><div class="content-item-text">'+itemData.content.replace(/[\n\r]/g, '<br/>').replace(new RegExp(' ', 'g'), '&nbsp;')+'</div></li>';
            });

            if(report.length==0&&planContent.length==0&&feedContent.length==0){
                htmlStr='<div class="content-empty-tip"><img class="empty-icon" src="'+FS.BLANK_IMG+'" />&nbsp;<span>没有内容</span></div>';
            }else{
                /* 回复-上部(日志关键回复) */
                if (commentContent) { //显示领导点评
                    RCTime = util.getDateSummaryDesc(moment.unix(planData.replyTime), moment.unix(responseData.serviceTime), 1);
                    replycontText = commentContent;
                    profileImage = planData.leader.profileImage;
                    senderName = planData.leader.name;
                    senderId = planData.leader.employeeID;
                    /* 人名加链接 */
                    /*senderName = '<a href="#profile/=/empid-' + senderId + '"> ' + senderName + '</a>';*/
                    replyContentList = '<dl class="comment-list fn-clear"><dt><a class="master-reply-face-l" href="javascript:void(0);"><a href="javascript:;"><img src = "' + util.getAvatarLink(profileImage, '3') + '" / ></a></a></dt><dd><span class="color-blue">' + senderName + '</span>：' + replycontText + ' (' + RCTime + '，点评)</dd></dl>';
                    replyContentStr = '<div class="fs-list-item"><div class="reply-content"><div class="RC-arrow"><em class="S_line1_c">◆</em><span>◆</span></div><div class="RC-tit">' + replyconterText + '</div><div class="RC-feed">' + replyContentList + '</div></div></div>';
                } else {
                    replyContentStr = "";
                }
                htmlStr = '<ul class="content-list">' + htmlStr + replyContentStr + '</ul>';
            }
            planContentEl.html(htmlStr);
        },
        "_getPlanTypeName":function(planType){
            planType=planType||this.get('planType');
            var planTypeName=[];
            switch(planType){
                case 1:
                    planTypeName[0]='今日';
                    planTypeName[1]='明日';
                    break;
                case 2:
                    planTypeName[0]='本周';
                    planTypeName[1]='下周';
                    break;
                case 3:
                    planTypeName[0]='本月';
                    planTypeName[1]='下月';
                    break;
                default:
                    break;
            }
            return planTypeName;
        },
        "_onRenderPlanType":function(val){
            var elEl=this.element,
                bodyRightEl=$('.body-r',elEl),
                planTypeNameEl=$('.plan-type-name',bodyRightEl);
            var planTypeNames=this._getPlanTypeName(val);
            planTypeNameEl.each(function(i){
                $(this).text(planTypeNames[i]);
            });
        },
        /**
         * 更新当前编辑内容
         */
        "_updateEditContent":function(){
            var elEl=this.element,
                todayInputEl=$('.today-input',elEl),
                tomorrowInputEl=$('.tomorrow-input',elEl),
                xdthInputEl=$('.xdth-input',elEl);
            var inputSelector=this.get('inputSelector');
            todayInputEl.val($(inputSelector.today).val()).trigger('autosize.resize');
            tomorrowInputEl.val($(inputSelector.tomorrow).val()).trigger('autosize.resize');
            xdthInputEl.val($(inputSelector.xdth).val()).trigger('autosize.resize');
        },
        "destroy":function(){
            var result;
            this.sp&&this.sp.destroy();
            this.sp=null;
            this.media&&this.media.destroy();
            this.media=null;
            this.atInput&&this.atInput.destroy();
            this.atInput=null;
            result=MyHistoryPlan.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    /**
     * 搜索input组件
     * @param opts
     * @constructor
     */
    var SearchInput=function(opts){
        opts=_.extend({
            "element":null
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this.init();
    };
    _.extend(SearchInput.prototype,{
        "init":function(){
            var that=this;
            var elEl=this.element,
                wEl,
                iconSearchEl,
                iconClearEl,
                inputHeight;
            elEl.addClass('fs-publish-search-input').wrap('<span class="fs-publish-search"></span>');
            wEl=elEl.closest('.fs-publish-search');
            iconSearchEl=$('<img src="'+FS.BLANK_IMG+'" class="icon-search" />');
            iconSearchEl.appendTo(wEl);
            iconClearEl=$('<span class="icon-clear fn-hide">&#10005;</span>');
            iconClearEl.appendTo(wEl);
            //重设element宽度
            inputHeight=elEl.height();
            elEl.width(elEl.width()-44);    //减去padding-right
            iconSearchEl.height(inputHeight);
            iconClearEl.height(inputHeight);
            iconClearEl.css({
                "line-height":inputHeight+'px'
            });

            //注册事件
            wEl.on('keyup','.fs-publish-search-input',function(){
                var val = _.str.trim($(this).val());
                if (val.length > 0) {
                    iconClearEl.show();
                    elEl.addClass('with-input-value');
                } else {
                    iconClearEl.hide();
                    elEl.removeClass('with-input-value');
                }
            }).on('keydown','.fs-publish-search-input',function(evt){
                if (evt.keyCode == 13) {    //监听回车按键
                    that.trigger('search',that.getValue());
                }
            }).on('click','.icon-clear',function(evt){
                elEl.val("");
                iconClearEl.hide();
            }).on('click','.icon-search',function(evt){
                 that.trigger('search',that.getValue());
            });
        },
        "getValue":function(){
            return _.str.trim(this.element.val());
        },
        "setValue":function(val){
            var elEl=this.element;
            elEl.val(val);
        },
        "clear":function(){
            var elEl=this.element,
                wEl=elEl.closest('.fs-publish-search'),
                iconClearEl=$('.icon-clear',wEl);
            elEl.val("");
            iconClearEl.hide();
        },
        "destroy":function(){
            var elEl=this.element,
                wEl=elEl.closest('.fs-publish-search');
            wEl.off();
            elEl.insertAfter(wEl);
            wEl.remove();
        }
    });
    Events.mixTo(SearchInput);

    /**
     * 解密feed或attach验证对话框
     * @type {*}
     */
    var FeedPwdValid=Dialog.extend({
        "attrs":{
            width:300,
            className:'fs-publish-fpv-dialog',
            content:publishTplEl.filter('.fs-publish-fpv-tpl').html(),
            defaultRequestData:{},  //默认请求数据
            successCb:FS.EMPTY_FN,
            cancelCb:FS.EMPTY_FN
        },
        "events":{
            "keydown .feed-pwd":"_keydownPwd",  //回车快捷键
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel"
        },
        "hide":function(){
            var result=FeedPwdValid.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
                pwdEl=$('.feed-pwd',elEl);
            var requestData= _.extend({
                "feedID":0,
                "password": _.str.trim(pwdEl.val())
            },this.get('defaultRequestData'));
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
                pwdEl=$('.feed-pwd',elEl);
            if(_.str.trim(pwdEl.val()).length==0){
                util.showInputError(pwdEl);
                return false;
            }
            return true;
        },
        "_clear":function(){
            var elEl=this.element,
                pwdEl=$('.feed-pwd',elEl);
            pwdEl.val("");
        },
        "_submit":function(evt){
            var that=this;
            var requestData=this.getRequestData();
            var subBtnEl=$(evt.currentTarget);
            if(this.isValid()){
                util.api({
                    "data":requestData,
                    "url":"/FeedExtend/CheckPasswords",
                    "success":function(responseData){
                        if(responseData.success){
                            that.get('successCb').apply(that,[responseData,requestData]);
                            that.hide();
                        }
                    }
                },{
                    "submitSelector":subBtnEl
                });
            }
        },
        "_keydownPwd":function(evt){
            var elEl=this.element,
                subBtnEl=$('.f-sub',elEl);
            if(evt.keyCode==13){
                subBtnEl.click();
                evt.preventDefault();
            }
        },
        "_cancel":function(){
            this.hide();
            this.get('cancelCb').call(this);
        }
    });
    /**
     * 显示加密feed验证对话框
     * @param successCb
     * @param cancelCb
     */
    var showFeedPwdValid=function(successCb,cancelCb,requestData){
        var pwdDialog=showFeedPwdValid.pwdDialog;
        if(!pwdDialog){ //验证密码对话框不存在，先创建
            pwdDialog=new FeedPwdValid();
        }
        pwdDialog.set('successCb',function(){
            successCb&&successCb.apply(this,arguments);
            pwdDialog.set('successCb',FS.EMPTY_FN);
            //清空默认请求数据
            pwdDialog.set('defaultRequestData',{});
        });
        pwdDialog.set('cancelCb',function(){
            cancelCb&&cancelCb.apply(this,arguments);
            pwdDialog.set('cancelCb',FS.EMPTY_FN);
            //清空默认请求数据
            pwdDialog.set('defaultRequestData',{});
        });
        //设置默认请求数据
        pwdDialog.set('defaultRequestData',requestData||{});
        pwdDialog.show();
    };
    _.extend(exports, {
        "progressBar": ProgressBar,
        "atInput": AtInput,
        "selectPanel": SelectPanel,
        "selectBar": SelectBar,
        "mediaMaker": MediaMaker,
        "inputAutoHeight": InputAutoHeight,
        //"dateSelect": DateSelect,
        //"timeSelect": TimeSelect,
        "dateSelect": publishHelper.DateSelect,
        "timeSelect": publishHelper.TimeSelect,
        "Receipt":Receipt,
        "MyHistoryPlan":MyHistoryPlan,
        "SearchInput":SearchInput,
        "showFeedPwdValid":showFeedPwdValid
    });
    exports.atInput = AtInput;
});
