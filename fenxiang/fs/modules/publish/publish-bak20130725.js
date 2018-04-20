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
        moment = require('moment'),
        Events = require('events'),
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
        publishTpl = require('modules/publish/publish.html'),
        publishStyle = require('modules/publish/publish.css');

    var publishTplEl = $(publishTpl);

    var UPLOAD_FILES_PATH = FS.BASE_PATH + '/Files/Temp';

    //模块作用域范围内的contactData
    var contactData=util.getContactData();
    /**
     * 发布at
     * @param {Object} elSelector
     */
    var AtInput = function (opts) {
        var elEl;
        opts = _.extend({
            "element": null,
            "data": util.getContactData()["p"]  //默认选中所有的同事
        }, opts || {});
        elEl = $(opts.element);
        this.element = elEl;
        util.asyncOrder(['stylelibs/jquery.atwho.css', 'jslibs/jquery.atwho.min.js','jslibs/jquery.atwho.custom.js', 'jslibs/jquery.autosize.js'], function () {
            var filterHandler = filter.stringMatch;
            //at联系人部分
            elEl.atwho('@', {
                "data": opts.data,
                "callbacks": {
                    "filter": function (query, data, search_key) {
                        var filterData=[],
                            filterData1,
                            filterData2;
                        if (_.str.trim(query).length == 0) {    //如果为空，显示常用联系人信息
                            var lastAtEmployees=util.getPersonalConfig('lastAtEmployees');
                            _.each(lastAtEmployees,function(employeeData){
                                var userData=util.getContactDataById(employeeData.dataID,'p');
                                filterData.push(userData);
                            });
                        } else {
                            filterData1 = filterHandler.apply(this, [data, query, {
                                "key": "name"
                            }]);
                            filterData2 = filterHandler.apply(this, [data, query.toLowerCase(), {
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

                        }
                        return filterData;
                    },
                    matcher: function (flag, subtext) {
                        var match, matched, regexp;
                        regexp = new RegExp(flag + '([\\S]*)$', 'gi');
                        match = regexp.exec(subtext);
                        matched = null;
                        if (match) {
                            matched = match[2] ? match[2] : match[1];
                        }
                        return matched;
                    }
                }
            }).addClass('fs-publish-input');
            //话题部分
            elEl.atwho('#', {
                "data": opts.data,
                "callbacks": {
                    "filter": function (query, data, search_key) {
                        var filterData=[],
                            filterData1,
                            filterData2;
                        if (_.str.trim(query).length == 0) {    //如果为空，显示常用联系人信息
                            var lastAtEmployees=util.getPersonalConfig('lastAtEmployees');
                            _.each(lastAtEmployees,function(employeeData){
                                var userData=util.getContactDataById(employeeData.dataID,'p');
                                filterData.push(userData);
                            });
                        } else {
                            filterData1 = filterHandler.apply(this, [data, query, {
                                "key": "name"
                            }]);
                            filterData2 = filterHandler.apply(this, [data, query.toLowerCase(), {
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

                        }
                        return filterData;
                    },
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
                    }
                }
            });
            elEl.addClass('autosize-animated').autosize();
        });
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
        var that = this;
        opts = _.extend({
            "element": null,
            "action": ['imgUpload', 'attachUpload', 'vote', 'at','topic'],
            "actionOpts": {}
        }, opts || {});
        this.id='media-'+MediaMaker.idIndex;
        this.opts = opts;
        this.element = $(opts.element);
        this.init();
        this.allUploaded = true;  //设置全部上传完毕(img/attach)标志
        /*_.each(opts.action, function (v) {
            that[v].call(that);
        });*/
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
                var btnEl = $('<a href="#" class="fs-publish-' + vName + '-btn fs-publish-media-btn"></a>'),
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
            //设置上传事件监听
            this.on('uploadstart',function(file, bytesLoaded, type, infoEl){
                this.trigger('uploadprogress',file, bytesLoaded, type, infoEl);
            });
            this.on('uploadprogress', function (file, bytesLoaded, type, infoEl) {
                var uploader = that[type + 'Uploader'],
                    uploadFiles = uploader.uploadFiles || [];
                var uploadFile = _.find(uploadFiles, function (v) {
                    if (v.id == file.id) {
                        _.extend(v, file, {   //更新file状态
                            "uploadedSize": bytesLoaded
                        });
                        return true;
                    }
                });
                if (!uploadFile) {
                    uploadFiles.push(_.extend(file, {
                        "uploadedSize": bytesLoaded
                    }));
                }
                uploader.uploadFiles = uploadFiles;
                //console.info(uploadFiles);
                //设置上传信息
                that.updateUploadInfo(uploader, infoEl);
            });
            this.on('uploadsuccess', function (file, serverData, type) {
                var uploader = that[type + 'Uploader'],
                    uploadFiles = uploader.uploadFiles || [];
                var uploadFile = _.find(uploadFiles, function (v) {
                    if (v.id == file.id) {
                        _.extend(v, file, {   //更新file状态
                            "pathName": json.parse(serverData).value
                        });
                        return true;
                    }
                });
                if (!uploadFile) {
                    uploadFiles.push(_.extend(file, {
                        "pathName": json.parse(serverData).value
                    }));
                }
                uploader.uploadFiles = uploadFiles;
            });
            //test
            this.on('alluploadcomplete', function () {
                //console.info(that.getUploadValue());
            });
            this.on('typeuploadcomplete', function (uploader) {
                var allUpload = true,
                    uploaders=[that["imgUploader"], that["attachUploader"],that["gUploader"]];
                uploader.uploaded = true;
                //先过滤掉空值
                uploaders= _.filter(uploaders,function(uploader){
                    return !!uploader;
                });
                _.find(uploaders, function (v) {
                    if (v && v.uploaded === false) {
                        allUpload = false;

                        return true;
                    }
                });
                if (allUpload) {
                    that.allUploaded = true;  //全部上传完毕标志
                    that.trigger('alluploadcomplete');
                }
            });
        },
        "getUploadItem": function (file, wSelector) {
            var wEl = $(wSelector);
            var fileName = file.name;
            var itemEl = $('[filename="' + fileName + '"]', wEl);
            if (itemEl.length == 0) {
                itemEl = $('<div class="fs-publish-upload-item" filename="' + fileName + '" fileid="' + file.id + '"></div>');
                itemEl.html('<div class="fs-publish-upload-item-inner fn-clear"><div class="thumb"></div><div class="summary"></div></div><div class="fs-publish-upload-pbar"></div>');
                itemEl.appendTo(wEl);
            }
            return itemEl;
        },
        "renderUploadItem": function (file, serverData, wSelector, type) {
            var wEl = $(wSelector),
                serverData = json.parse(serverData);
            var itemEl = this.getUploadItem(file, wEl),
                innerEl = $('.fs-publish-upload-item-inner', itemEl),
                thumbEl = $('.thumb', innerEl),
                summaryEl = $('.summary', innerEl);
            if (type == "img") {
                thumbEl.html('<div class="thumb-img"><img src="' + FS.BASE_PATH + '/' + serverData.value + '" alt="' + file.name + '" /></div>');
            } else {
                thumbEl.html('<div class="thumb-attach"><img src="' + FS.ASSETS_PATH + '/images/clear.gif" alt="' + file.name + '" class="icon-file fs-attach-' + util.getFileType(file) + '-icon" /></div>');
            }

            summaryEl.html('<p class="file-name">' + file.name + '</p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
        },
        "renderUploadError": function (file, errorCode, wSelector) {
            var wEl = $(wSelector);
            var itemEl = this.getUploadItem(file, wEl),
                innerEl = $('.fs-publish-upload-item-inner', itemEl),
                thumbEl = $('.thumb', innerEl),
                summaryEl = $('.summary', innerEl);
            thumbEl.html('<img src="' + FS.ASSETS_PATH + '/images/error.png" alt="' + file.name + '" />');
            summaryEl.html('<p class="file-error">上传失败(' + errorCode + ')，请取消后重试</p><p class="file-remove-wrapper"><a href="#" class="file-remove-l">取消</a></p>');
        },
        "getUploadStatus": function (uploader) {
            var uploaderCore = uploader.core,
                files = [],
                file,
                i = 0,
                uploadFiles = uploader.uploadFiles,
                uploadedSize = 0,
                totalSize = 0;
            //暂时看不出最后的防线的必要
            /*while (file = uploaderCore.getFile(i)) {
                _.find(uploadFiles, function (v) {
                    if (v.id == file.id) {
                        files.push(_.extend({
                            "uploadType": uploader.type
                        }, v, file)); //最后的防线，更新文件上传状态
                        return true;
                    }
                });
                i++;
            }*/
            //获得upload下的文件总大小和总上传量
            _.each(files, function (file) {
                totalSize += file.size;
                _.find(uploadFiles, function (v) {
                    if (v.id == file.id) {
                        uploadedSize += v.uploadedSize;
                        return true;
                    }
                });
                file.uploadType=uploader.type;
            });
            return {
                "files": files,
                "uploadedSize": uploadedSize,
                "totalSize": totalSize
            };
        },
        "updateUploadInfo": function (uploader, infoSelector) {
            var infoEl = $(infoSelector);
            var gUploadStore=this.gUploadStore;
            var uploadStatus = this.getUploadStatus(uploader),
                files = uploadStatus.files,
                uploadedSize = uploadStatus.uploadedSize,
                totalSize = uploadStatus.totalSize;
            //追加全局media存储
            _.each(gUploadStore,function(file){
                uploadedSize+=file.size;
                totalSize+=file.size;
                files.push(file);
            });

            infoEl.html('共添加了' + files.length + '个文件，总大小' + util.getFileSize(totalSize)+'&nbsp;&nbsp;<a href="#" class="file-remove-all-l" title="全部取消">全部取消</a>');
        },
        "getAllUploadStatus": function () {
            var that = this,
                imgUploader = this.imgUploader,
                attachUploader = this.attachUploader,
                gUploader=this.gUploader,
                gUploadStore=this.gUploadStore,
                uploadedSize = 0,
                totalSize = 0,
                files = [],
                uploaders;
            //先过滤掉不存在的uploader
            uploaders= _.filter([imgUploader, attachUploader,gUploader],function(uploader){
                return !!uploader;
            });
            _.each(uploaders, function (uploader) {
                var uploadStatus = that.getUploadStatus(uploader);
                uploadedSize += uploadStatus.uploadedSize;
                totalSize += uploadStatus.totalSize;
                files = files.concat(uploadStatus.files);
            });
            //追加全局media存储
            _.each(gUploadStore,function(file){
                uploadedSize+=file.size;
                totalSize+=file.size;
                files.push(file);
            });
            return {
                "files": files,
                "uploadedSize": uploadedSize,
                "totalSize": totalSize
            };
        },
        "getUploadValue": function () {
            var addUploadStatus = this.getAllUploadStatus();
            return  addUploadStatus.files;
        },
        /**
         * 从uploader.uploadFiles中获取对应的file信息
         * @param uploader
         * @param fileId
         * @returns {Mixed}
         */
        "getUploadFile":function(uploader,fileId){
            var uploadFiles = uploader.uploadFiles;
            return _.find(uploadFiles, function (v) {
                return v.id == fileId;
            });
        },
        /**
         * 从uploader.uploadFiles中删除对应的file信息
         * @param uploader
         * @param fileId
         */
        "removeUploadFile": function (uploader, fileId) {
            var uploadFiles = uploader.uploadFiles;
            uploadFiles = _.filter(uploadFiles, function (v) {
                return v.id != fileId;
            });
            uploader.uploadFiles = uploadFiles;
        },
        /**
         * 从gUploadStore中删除对应的file信息
         * @param uploader
         * @param fileId
         */
        "removeGUploadFile": function (fileId) {
            var gUploadStore = this.gUploadStore;
            gUploadStore = _.filter(gUploadStore, function (v) {
                return v.id != fileId;
            });
            this.gUploadStore = gUploadStore;
        },
        "uploadValid": function (uploader, file) {
            var passed = true;
            var uploadFiles = uploader.uploadFiles;
            _.find(uploadFiles, function (v) {
                if (v.name == file.name) {   //同名验证
                    passed = false;
                    util.alert('有同名文件存在');
                    return true;
                }
            });
            return passed;
        },
        /**
         * 开始上传回调
         * uploaderType和type的区别
         * uploaderType包含三个值:img/attach/g,对应三种uploader:imgUploader/attachUploader/gUploader
         * gUploader是后来追加的，gUploader处理两种type:img/attach
         * imgUploader/attachUploader分别只处理对应的一种type:img/attach
         * @param type
         */
        "uploadStartHandler":function(file,type,uploaderType){
            uploaderType=uploaderType||"";
            var elEl = this.element,
                btnEl = $('.fs-publish-'+uploaderType + type + 'upload-btn', elEl),
                panelEl = $('.fs-publish-'+uploaderType + type + 'upload-panel', elEl),
                listEl=$('.fs-publish-upload-list', panelEl),
                infoEl = $('.fs-publish-upload-info', panelEl);
            uploaderType=uploaderType||type;    //默认uploaderType==type
            var uploader=this[uploaderType+"Uploader"];
            var itemEl,
                progressBarEl;
            //上传验证
            if (!this.uploadValid(uploader, file)) {
                return false;  //取消上传，触发uploadError事件
            }

            itemEl = this.getUploadItem(file, listEl);
            progressBarEl = $('.fs-publish-upload-pbar', itemEl);
            //设置进度条位置
            progressBarEl.css({
                "top": "50px",
                "left": "14px",
                "width": "100px"
            });
            new ProgressBar({
                "element": progressBarEl
            });
            //that.trigger('uploadprogress', file, 0, type, infoEl);
            //触发上传开始事件
            this.trigger('uploadstart', file, 0, uploaderType, infoEl,type);
            //如果panel当前状态为隐藏，显示出来
            if (panelEl.is(':hidden')) {
                btnEl.trigger('showpanel');
            }
            this.allUploaded = false;
            uploader.uploaded = false;
        },
        "uploadProgressHandler":function(file, bytesLoaded,type,uploaderType){
            uploaderType=uploaderType||"";
            var elEl = this.element,
                panelEl = $('.fs-publish-'+uploaderType + type + 'upload-panel', elEl),
                listEl=$('.fs-publish-upload-list', panelEl),
                infoEl = $('.fs-publish-upload-info', panelEl);
            uploaderType=uploaderType||type;    //默认uploaderType==type
            var percent = Math.ceil((bytesLoaded / file.size) * 100) + '%';
            var itemEl = this.getUploadItem(file, listEl),
                progressBarEl = $('.fs-publish-upload-pbar', itemEl);
            var progressBar = progressBarEl.data('progressBar');
            progressBar.setProgress(percent);
            this.trigger('uploadprogress', file, bytesLoaded, uploaderType, infoEl,type);
        },
        "uploadSuccessHandler":function(file, serverData,type,uploaderType){
            uploaderType=uploaderType||"";
            var elEl = this.element,
                panelEl = $('.fs-publish-'+uploaderType + type + 'upload-panel', elEl),
                listEl=$('.fs-publish-upload-list', panelEl),
                infoEl = $('.fs-publish-upload-info', panelEl);
            uploaderType=uploaderType||type;    //默认uploaderType==type
            var uploader=this[uploaderType+"Uploader"];

            var state = uploader.core.getStats();
            var itemEl = this.getUploadItem(file, listEl),
                progressBarEl = $('.fs-publish-upload-pbar', itemEl);
            //隐藏上传指示器
            progressBarEl.hide();
            this.renderUploadItem(file, serverData, listEl, type);
            if (state.files_queued > 0) {
                uploader.core.startUpload();
            }
            this.trigger('uploadsuccess', file, serverData, uploaderType,type);
        },
        "uploadErrorHandler":function(file, errorCode,type,uploaderType){
            uploaderType=uploaderType||"";
            var elEl = this.element,
                panelEl = $('.fs-publish-'+uploaderType + type + 'upload-panel', elEl),
                listEl=$('.fs-publish-upload-list', panelEl),
                infoEl = $('.fs-publish-upload-info', panelEl);
            uploaderType=uploaderType||type;    //默认uploaderType==type
            var uploader=this[uploaderType+"Uploader"];
            var state = uploader.core.getStats();
            if (errorCode == SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED) {
                uploader.core.cancelUpload(file.id, false);
            } else {
                this.renderUploadError(file, errorCode, listEl);
            }
            if (state.files_queued > 0) {
                uploader.core.startUpload();
            }
        },
        "uploadCompleteHandler":function(type,uploaderType){
            uploaderType=uploaderType||type;    //默认uploaderType==type
            var uploader=this[uploaderType+"Uploader"];
            var state = uploader.core.getStats();
            if (state.files_queued == 0) {
                this.trigger('typeuploadcomplete', uploader,type);
            }
        },
        /**
         * [ description]
         * @param  {[type]} type img/attach
         * @return {[type]}      [description]
         */
        "uploadInit": function (type) {
            var that = this;
            var elEl = this.element;
            var btnEl = $('.fs-publish-' + type + 'upload-btn', elEl),
                panelEl = $('.fs-publish-' + type + 'upload-panel', elEl),
                listEl,
                infoEl,
                iconName;
            //设置上传唯一id供FsUpload配置使用
            var uploadId = 'fs-publish-upload-' + MediaMaker.uploadCount;
            btnEl.html('<span id="' + uploadId + '"></span>');
            panelEl.html('<div class="fs-publish-upload-list fn-clear"></div><div class="fs-publish-upload-info color-333333"></div>');
            listEl = $('.fs-publish-upload-list', panelEl);
            infoEl = $('.fs-publish-upload-info', panelEl);
            //设置link alt
            if(type=="img"){
                btnEl.attr('title','添加图片（多张）');
            }else{
                btnEl.attr('title','添加附件（多个）');
            }
            btnEl.click(function(evt){
                evt.preventDefault();   //阻止默认点击
            });
            MediaMaker.uploadCount++;

            var uploader = new FsUpload({
                "upload_url": FS.API_PATH + '/uploadfile_html/fileUpload',
                "file_types": (type == "img" ? "*.jpg;*.gif;*.jpeg;*.png" : "*.*"),
                "file_types_description": (type == "img" ? "图片格式" : "所有格式"),
                "button_placeholder_id": uploadId,
                "button_image_url": FS.BASE_PATH + "/html/fs/modules/publish/images/icon-upload-" + type+'.png',
                button_width: 18,
                //button_disabled:true,
                button_height: (type == "img" ? 14 : 15),
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
                    return that.uploadStartHandler(file,type);
                },
                "upload_progress_handler": function (file, bytesLoaded) {
                    return that.uploadProgressHandler(file, bytesLoaded,type);
                },
                "upload_success_handler": function (file, serverData) {
                    return that.uploadSuccessHandler(file, serverData,type);
                },
                "upload_error_handler": function (file, errorCode) {
                    return that.uploadErrorHandler(file, errorCode,type);
                },
                "upload_complete_handler": function () {
                    return that.uploadCompleteHandler(type);
                }
            });
            uploader.type = type;
            uploader.uploaded = true;
            //注册对象外引用
            //this[type + 'Upload'] = upload;   //和imgUpload初始化函数冲突了
            this[type + 'Uploader'] = uploader;
            //绑定删除事件
            panelEl.on('click', '.file-remove-l', function (e) {
                var meEl = $(this),
                    fileItemEl = meEl.closest('.fs-publish-upload-item');
                var fileId = fileItemEl.attr('fileid');
                //清除swfupload容器
                uploader.core.cancelUpload(fileId);
                //清空html结构
                fileItemEl.remove();
                //uploader.uploadFiles列表
                that.removeUploadFile(uploader, fileId);
                //更新上传信息
                that.updateUploadInfo(uploader, infoEl);
                //如果列表为空，隐藏对应面板
                if ($('.fs-publish-upload-item', listEl).length == 0) {
                    $('.close-btn', panelEl.closest('.fs-publish-media-panel-wrapper')).click();
                }
                e.preventDefault();
            }).on('click','.file-remove-all-l',function(evt){   //全部取消
                $('.file-remove-l',panelEl).click();
                evt.preventDefault();
            });

        },
        "imgUpload": function () {
            this.uploadInit("img");
        },
        "imgUploadClear": function () {
            var elEl = this.element;
            var panelEl = $('.fs-publish-imgupload-panel', elEl),
                listEl = $('.fs-publish-upload-list', panelEl),
                uploadInfoEl = $('.fs-publish-upload-info', panelEl);
            listEl.empty();
            uploadInfoEl.empty();
            this["imgUpload"].uploadFiles = [];
        },
        "attachUpload": function () {
            this.uploadInit("attach");
        },
        "attachUploadClear": function () {
            var elEl = this.element;
            var panelEl = $('.fs-publish-attachupload-panel', elEl),
                listEl = $('.fs-publish-upload-list', panelEl),
                uploadInfoEl = $('.fs-publish-upload-info', panelEl);
            listEl.empty();
            uploadInfoEl.empty();
            this["attachUpload"].uploadFiles = [];
        },
        /**
         * 获取全局上传对话框面板，单例模式
         */
        "getGUploadDialog":function(){
            var gUploadDia=MediaMaker.gUploadDia;
            if(!gUploadDia.rendered){   //如果对话框没渲染，首先render
                gUploadDia.render();
            }
            if(!this.gUploader){
                this.gUploader=gUploadDia.uploader;
                this.gUploadStore=[];   //定义全局上传media存储
            }
            return gUploadDia;
        },
        /**
         * 全局上传action初始化入口
         */
        "gUploadInit":function(type){
            var that=this;
            var gUploadDialog=this.getGUploadDialog(),
                uploader=this["gUploader"];
            var opts = this.opts,
                actionOpts = opts.actionOpts;
            var elEl = this.element;
            var btnEl = $('.fs-publish-g'+type+'upload-btn', elEl),
                panelEl = $('.fs-publish-g'+type+'upload-panel', elEl),
                listEl,
                infoEl;
            //按钮背景图
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="upload" />');
            //设置panel结构
            panelEl.html('<div class="fs-publish-upload-list fn-clear"></div><div class="fs-publish-upload-info color-333333"></div>');

            listEl = $('.fs-publish-upload-list', panelEl);
            infoEl = $('.fs-publish-upload-info', panelEl);
            //设置link title
            if(type=="img"){
                btnEl.attr('title','添加图片（多张）');
            }else{
                btnEl.attr('title','添加附件（多个）');
            }

            //点击btn触发showpanel事件显示对应的面板
            btnEl.click(function (evt) {
                //设置media引用
                gUploadDialog.set('media',that);
                //设置上传类型
                gUploadDialog.set('actionModel',type);
                gUploadDialog.show();
                //$(this).trigger('showpanel');
                evt.preventDefault();
            });
            //绑定删除事件
            panelEl.on('click', '.file-remove-l', function (e) {
                var meEl = $(this),
                    fileItemEl = meEl.closest('.fs-publish-upload-item');
                var fileId = fileItemEl.attr('fileid');
                //清除swfupload容器
                uploader.core.cancelUpload(fileId);
                //清空html结构
                fileItemEl.remove();
                //uploader.uploadFiles列表
                that.removeUploadFile(uploader, fileId);
                //移除gUploadStore对应file存储
                that.removeGUploadFile(fileId);
                //更新上传信息
                that.updateUploadInfo(uploader, infoEl);
                //如果列表为空，隐藏对应面板
                if ($('.fs-publish-upload-item', listEl).length == 0) {
                    $('.close-btn', panelEl.closest('.fs-publish-media-panel-wrapper')).click();
                }
                e.preventDefault();
            }).on('click','.file-remove-all-l',function(evt){   //全部取消
                $('.file-remove-l',panelEl).click();
                evt.preventDefault();
            });
        },
        /**
         * 全局图片上传
         */
        "gImgUpload":function(){
            this.gUploadInit("img");
        },
        "gImgUploadClear":function(){
            this.gUploadClear("img");
        },
        /**
         * 全局附件上传
         */
        "gAttachUpload":function(){
            this.gUploadInit("attach");
        },
        "gAttachUploadClear":function(){
            this.gUploadClear("attach");
        },
        "gUploadClear":function(type){
            var elEl = this.element;
            var panelEl = $('.fs-publish-g'+type+'upload-panel', elEl),
                listEl = $('.fs-publish-upload-list', panelEl),
                uploadInfoEl = $('.fs-publish-upload-info', panelEl);
            listEl.empty();
            uploadInfoEl.empty();
            this.gUploadStore=[];   //重置全局media存储
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
                $(htmlStr).appendTo(optWEl);
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
                if(v=="0"){ //自定义时间类型
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
            value.deadlineTicks.element.val("1").change();
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
                util.alert('至少两个投票选项');
                passed=false;
                return passed;
            }
            //截止时间非空判定
            if(value.deadlineTicks.value.length==0){
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
            value["deadlineTicks"]={
                "element":dealineDtEl,
                "value":deadlineTicksEl.val()
            };
            //根据不同的截止时间类型得出unix ticks
            timeTypeValue= parseInt(value["timeType"].value);
            if(timeTypeValue!=0){
                if(timeTypeValue<=3){
                    value["deadlineTicks"].value=now.add('weeks',timeTypeValue).unix();
                }else{  //timeValue==4 weeks==1 month
                    value["deadlineTicks"].value=now.add('months',1).unix();
                }
            }else{  //自定义截止时间
                dsValue = ds.getValue(),
                tsValue = ts.getValue();
                if(dsValue.length>0){
                    value["deadlineTicks"].value=moment(dsValue+" "+tsValue,'YYYYMMDD HH:mm').unix();
                }else{
                    value["deadlineTicks"].value="";
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
            var elEl = this.element;
            var btnEl = $('.fs-publish-at-btn', elEl),
                panelEl = $('.fs-publish-at-panel', elEl);
            var opts = this.opts,
                actionOpts = opts.actionOpts,
                atOpts = actionOpts["at"] || {};
            var inputEl = $(atOpts.inputSelector);
            btnEl.html('<img src="' + FS.BLANK_IMG + '" alt="vote" />');
            //设置link title
            btnEl.attr('title','添加提到');
            var atSelectPanel = new SelectPanel(_.extend({
                "trigger": btnEl,
                "singleCked": true,
                "data": this.atGetDefaultSpData()
            }, atOpts.spOpts || {}));
            atSelectPanel.on('select', function (selectedData) {
                var currentInputDom=inputEl.filter('.fs-publish-at-focus').get(0)||inputEl.eq(0).get(0);
                _.each(selectedData, function (val) {
                    util.appendInput(currentInputDom, '@' + val[0].name + ' ');
                });
                //input输入框自适应高度
                $(currentInputDom).trigger('autosize.resize');

                atSelectPanel.unselect("all", "all");
                atSelectPanel.hide();
            });
            inputEl.focus(function(){
                inputEl.removeClass('fs-publish-at-focus');
                $(this).addClass('fs-publish-at-focus');
            });
            this.atSelectPanel = atSelectPanel;
        },
        "atClear": function () {
        },
        /**
         * 获取默认的at功能中select panel的数据源
         */
        "atGetDefaultSpData":function(){
            var spData,
                spData1=[], //第一部分数据，常用联系人
                spData2=util.getContactData()["p"], //第二部分数据，全部同事
                lastAtEmployees=util.getPersonalConfig('lastAtEmployees');
            _.each(lastAtEmployees,function(employeeData,i){
                var userData=util.getContactDataById(employeeData.dataID,'p');
                spData1[i]= _.extend({},userData);
            });
            spData=[{
                "title":"常用联系人",
                "type":"p",
                "list":spData1
            },{
                "title":"同事",
                "type":"p",
                "list":spData2
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
            var atEmployeeData=util.getPersonalConfig('lastAtEmployees')||[];
            inputEl.each(function(){
                var atContents=util.getAtFromInput(this);    //获取所有的at同事
                _.each(atContents,function(employeeName){
                    var userData=util.getContactDataByName(employeeName,'p');
                    if(userData&&!_.find(atEmployeeData,function(employeeData){   //不在常用联系人里的，push进去
                        return employeeData.dataID==userData.id;
                    })){
                        atEmployeeData.push({
                            "dataID":userData.id,
                            "name":userData.name,
                            "isCircle":false
                        });
                    }
                });
            });

            //保存到presonal config中
            util.setPersonalConfig('lastAtEmployees',atEmployeeData);
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
                    "baseXY": [-207, 24]      // 基准定位元素的定位点，默认为左上角
                }
            }, topicOpts.dialogOpts || {})).render();
            //监听itemclick事件append到input对应的话题
            topicDialog.on('itemclick', function (itemData) {
                util.appendInput(inputEl.filter('.fs-publish-topic-focus').get(0), '#' + itemData.name + '# ');
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
                //先隐藏topic弹框
                topicDialog.hide();
                //选中模板，保证光标置于input内
                cursorPos.start=cursorPos.start-18;
                cursorPos.end=cursorPos.end-2;
                util.setCursorPosition(currentInputDom,cursorPos);
            });
            inputEl.focus(function(){
                inputEl.removeClass('fs-publish-topic-focus');
                $(this).addClass('fs-publish-topic-focus');
            });
            //点击全局隐藏
            btnEl.on('click',function(evt){
                evt.stopPropagation();
            });
            topicDialog.element.on('click',function(evt){
                evt.stopPropagation();
            });
            util.regGlobalClick(topicDialog.element,function(){
                if(topicDialog.element.is(':visible')){
                    topicDialog.hide();
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
            if(actionName=="imgUpload"||actionName=="attachUpload"){
                this[actionName+'er'].core.setButtonDisabled(true);
            }
            btnEl.addClass('fs-publish-'+actionCls+'-disabled');
        },
        /**
         * 启用某个action
         * @param actionName
         */
        "enableAction":function(actionName){
            var actionCls=actionName.toLowerCase();
            var elEl = this.element,
                btnEl = $('.fs-publish-'+actionCls+'-btn', elEl);
            if(actionName=="imgUpload"||actionName=="attachUpload"){
                this[actionName+'er'].core.setButtonDisabled(false);
            }
            btnEl.removeClass('fs-publish-'+actionCls+'-disabled');
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
            //初始化文件上传进度dialog
            var sendDialog = this.sendDialog;
            var pbar = this.sendPbar,
                sendInfoEl;
            var modalEl = modalSelector ? $(modalSelector) : $(document);
            var sendCb = function () {
                sendDialog.hide();
                pbar.setProgress(0);
                pbar.element.hide();    //默认隐藏进度条，只有存在附件上传时才显示
                sendInfoEl.empty();
            };
            if (!sendDialog) {
                sendDialog = new Overlay({
                    height: '100px',
                    className: 'fs-publish-allupload-dialog',
                    template: '<div><div class="fs-publish-allupload-pbar"></div><div class="fs-publish-send-info"></div></div>'
                }).render();
                pbar = new ProgressBar({
                    "element": $('.fs-publish-allupload-pbar', sendDialog.element)
                });
                //默认隐藏进度条
                pbar.element.hide();
                this.sendDialog = sendDialog;
                this.sendPbar = pbar;
            }
            sendInfoEl = $('.fs-publish-send-info', sendDialog.element);
            //定位自适应尺寸
            sendDialog.set('width', modalEl.outerWidth());
            sendDialog.set('height', modalEl.outerHeight());
            sendDialog.set('align', {
                selfXY: [0, 0],
                baseElement: modalEl,
                baseXY: [0, 0]
            });
            //更新at功能中的常用联系人个人配置
            if(this.atSelectPanel){
                this.atUpdateSpData();
            }

            if (this.allUploaded) {  //文件已经上传成功
                sendInfoEl.html('正在提交请稍后...');
                sendHandler(sendCb);
            } else {  //显示文件上传进度，上传成功后提交send接口
                //注册media上传文件uploadprogress事件
                this.one('uploadprogress', function () {
                    var uploadStatus = that.getAllUploadStatus(),
                        uploadedSize = uploadStatus.uploadedSize,
                        totalSize = uploadStatus.totalSize;
                    var percent = Math.ceil((uploadedSize / totalSize) * 100) + '%';
                    if(pbar.element.is(':hidden')){
                        pbar.element.show();
                    }
                    if(parseFloat(percent)>100){
                        percent="100%";
                    }
                    pbar.setProgress(percent);
                    sendInfoEl.html('已上传' + util.getFileSize(uploadedSize) + '/' + util.getFileSize(totalSize));
                });
                this.one('alluploadcomplete', function () {
                    sendDialog.hide();
                    sendHandler(sendCb);
                    sendInfoEl.html('正在提交请稍后...');
                    //上传完毕隐藏进度条
                    pbar.element.hide();
                });
            }
            sendDialog.show();
        },
        "destroy": function () {
            if (this.imgUploader) {
                this.imgUploader.destroy();
                this.imgUploader = null;
            }
            if (this.attachUploader) {
                this.attachUploader.destroy();
                this.attachUploader = null;
            }
            if (this.atSelectPanel) {
                this.atSelectPanel.destroy();
                this.atSelectPanel = null;
            }
            if (this.gUploadDia) {
                this.gUploadDia.destroy();
                this.gUploadDia = null;
            }
            if (this.topicDialog) {
                this.topicDialog.destroy();
                this.topicDialog = null;
            }
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
            "data":[{
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
            }]
        },
        "events":{
            "mouseenter .topic-item":"_enterTopicItem",
            "mouseleave .topic-item":"_leaveTopicItem",
            "click .topic-item":"_clickTopicItem",
            "click .insert-topic-btn":"_clickInsertBtn",
            "click .f-cancel":"hide"
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
            var data=this.get('data');
            var elEl=this.element,
                cateListEl=$('.cate-list',elEl);
            var htmlStr='';
            _.each(data,function(cateData,i){
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
            var data=this.get('data');
            return data[keyIdArr[0]].list[keyIdArr[1]];
        }
    });

    var ProgressBar = function (opts) {
        opts = _.extend({
            "element": null
        }, opts || {});
        var elEl = $(opts.element);
        this.element = elEl;
        this.opts = opts;
        elEl.data('progressBar', this);
        this.init();
    };
    ProgressBar.prototype.init = function () {
        var elEl = this.element;
        elEl.html('<div class="fs-progress-indicator"></div><div class="fs-progress-text"></div>');
        elEl.addClass('fs-progressbar');
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
    ProgressBar.prototype.reset=function(){
        this.setProgress('0%');
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
            this.doTabPanel(tabPanelEl, list);
        },
        "doTabPanel": function (panelSelector, list) {
            var panelEl = $(panelSelector),
                letterNavEl = $('.fs-contact-letter-nav', panelEl),
                listEl = $('.fs-contact-list', panelEl),
                letterNavEl;
            var i, htmlStr = '';
            var groupList = this.groupByLetter(list),
                groupKeys = _.sortBy(_.keys(groupList), function (v) {
                    return v;
                });
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
            this.updateSummary();
        },
        "show": function (emitEvent) {
            //修正对dialog定位
            var triggerEl = $(this.opts.trigger);
            this.dialog.set('align', {
                selfXY: ['right', 0],     // element 的定位点，默认为左上角
                baseElement: triggerEl,     // 基准定位元素，默认为当前可视区域
                baseXY: [triggerEl.width(), triggerEl.height()]      // 基准定位元素的定位点，默认为左上角
            });

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
                contactItemEl = $('.fs-contact-item', tab.get('panels').eq(tab.get("activeIndex"))),
                selectedItemEl = contactItemEl.filter('.fs-contact-item-selected'),
                summaryEl = $('.fs-contact-summary', dialogEl);
            if (selectedItemEl.length > 0) {
                summaryEl.html('已选中' + selectedItemEl.length + '/' + contactItemEl.length);
            } else {
                summaryEl.html('共有' + contactItemEl.length + '位同事');
            }
        },
        /**
         * [ description]
         * @param  {[type]} ids   [description]
         * @param  {[type]} reset 是否清空原来选中项
         * @return {[type]}       [description]
         */
        "select": function (ids, type, reset) {
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
                if (!!reset) {
                    itemsEl.removeClass('fs-contact-item-selected');
                }
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
            this.trigger('select', eventData);
        },
        "unselect": function (ids, type) {
            var tab = this.tab,
                tabEl = tab.element,
                tabPanelEl = tab.get('panels'),
                itemsEl;
            var eventData = {};   //unselect事件数据
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
            this.trigger('unselect', eventData);
        },
        "bindEvents": function () {
            var that = this;
            var tab = this.tab,
                tabEl = tab.element,
                dialog = this.dialog,
                dialogEl = dialog.element,
                opts = this.opts;
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
            tab.on('switched', function () {
                that.updateSummary();
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
                    listWEl.scrollTop(letterItem.position().top);
                }
            });
            //点击trigger显示面板
            $(opts.trigger).click(function (e) {
                //隐藏其它instance
                _.each(_.filter(SelectPanel.ins, function (item) {
                    return item !== that;
                }), function (item) {
                    item.hide();
                });
                that.show();
                e.stopPropagation();
                e.preventDefault();
            });

            /*this.regHide = util.regDocEvent('click', function () {
                that.hide();
            });*/
            util.regGlobalClick(this.dialog.element,function(){
                if(that.dialog.element.is(':visible')){
                    that.hide();
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
                    className:'fs-contact-bar-ac'
                }).render();

                //重设过滤器
                acFilter = ac.get('filter');
                acFilterFunc = acFilter.func;
                acFilter.func = function (data, query, options) {
                    var selectedData = that.getSelectedData(barEl);
                    var filterData=[];
                    var filterData1 = acFilterFunc.apply(this, [data, query, {
                        "key": "name"
                    }]);
                    var filterData2 = acFilterFunc.apply(this, [data, query.toLowerCase(), {
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
                });

                selectPanel = new SelectPanel({
                    "trigger": $('.show-select-panel-h', barEl),
                    "data": opts.data,
                    "singleCked": opts.singleCked
                });
                selectPanel.on('show', function () {
                    var selectedData = that.getSelectedData(barEl);
                    //先清空原来的选项
                    selectPanel.unselect('all','all');
                    _.each(selectedData, function (v, key) {
                        selectPanel.select(v, key);
                    });
                    //隐藏单选的话调用select会隐藏selectPanel,所有要手动显示出selectPanel并且不触发show事件
                    if(opts.singleCked){
                        selectPanel.show(false);    //不触发show事件
                    }
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
                    that.switchInputState(barEl, 'show');
                    //隐藏selectPanel
                    selectPanel.hide();
                    e.stopPropagation();
                }).on('click','.fs-contact-bar-list',function(evt){
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
                    //itemEl.remove();
                });
                //设置默认选中值
                if(opts.defaultSelectedData.length>0){
                    _.each(opts.defaultSelectedData,function(val){
                        var itemData=that.getItemData(val.id,val.type);
                        //加入
                        that.addItem(itemData,barEl);
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
        var htmlStr,
            itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + itemData.type + '"]'),
            cls="";
        if (itemEl.length == 0) {
            if(itemData.type=="g"){
                cls=" fs-cbi-dept";
            }
            if(parseInt(itemData.id)==999999){
                cls=" fs-cbi-allcomp";
            }
            htmlStr = '<li class="fs-contact-bar-item'+cls+'" itemid="' + itemData.id + '" emptype="' + itemData.type + '"><span class="item-name">' + itemData.name + '</span><span class="remove-h">×</span></li>';
            $(htmlStr).appendTo(listEl);
            this.trigger('add', itemData, elSelector);
        }
    };
    SelectBar.prototype.removeItem = function (itemData, elSelector) {
        var elEl = this.getEl(elSelector),
            listEl = $('.fs-contact-bar-list', elEl);
        var itemEl = $('[itemid="' + itemData.id + '"]', listEl).filter('[emptype="' + itemData.type + '"]');
        itemEl.remove();
        this.trigger('remove', itemData, elSelector);
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
            inputEl.show().get(0).focus();
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
                    empType = meEl.attr('emptype'),
                    itemId = meEl.attr('itemid');
                if (!data[empType]) {
                    data[empType] = [];
                }
                data[empType].push(itemId);
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
                "eqFields":itemInitData.eqFields
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
                        var data = parseData(storeItemData)[0];
                        if(storeItemData.type=="mix"){   //对于type==mix的item直接放行
                            return true;
                        }else{
                            if (data.id == itemId && data.type == type) {
                                return false;
                            } else {
                                return true;
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
            ins.ac.destroy();
            ins.selectPanel.destroy();
        });
        this.off();
        //util.unRegDocEvent('click', this.docClick);
        this.element.removeData();
        this.element.empty();
        this.element = null;
    };

    var InnerCalendar = Calendar.extend({
        "attrs": {
            showTodayBtn: false,
            align: {
                getter: function () {
                    var trigger = this.get("trigger");
                    if (trigger) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: trigger,
                            baseXY: [ 13, 13 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        }
    });
    var DateSelect = function (opts) {
        opts = _.extend({
            "element": null,
            "placeholder": "请选择日期",
            "formatStr":"YYYY-MM-DD"    //时间格式化字符串
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    DateSelect.prototype.init = function () {
        var that = this;
        var elEl = this.element,
            opts = this.opts,
            inputEl;
        var dateModel = [],
            tempDate,
            tempDateText;
        var formatStr=opts.formatStr;
        elEl.html('<input type="text" class="fs-publish-dateselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $('.fs-publish-dateselect-input', elEl);
        placeholder(inputEl);
        //设置date model
        tempDate = moment();  //今天
        tempDateText = tempDate.format(formatStr);
        dateModel[0] = {
            "value": tempDateText,
            "text": '今天'
        };

        tempDate = moment().add('days', 1);    //明天
        tempDateText = tempDate.format(formatStr);
        dateModel[1] = {
            "value": tempDateText,
            "text": '明天'
        };

        tempDate = moment().startOf('week').add('days', 5);    //本周五
        tempDateText = tempDate.format(formatStr);
        dateModel[2] = {
            "value": tempDateText,
            "text": '本周五'
        };

        tempDate = moment().startOf('week').add('days', 8);    //下周一
        tempDateText = tempDate.format(formatStr);
        dateModel[3] = {
            "value": tempDateText,
            "text": '下周一'
        };
        var selector = new Select({
            trigger: inputEl,
            className: 'fs-publish-dateselect',
            template: '<div class="{{classPrefix}}">' +
                '<div class="fs-publish-dateselect-title">请选择日期</div>' +
                '<div class="fs-publish-dateselect-calendar"></div>' +
                '<ul class="{{classPrefix}}-content" data-role="content">' +
                '{{#each select}}' +
                '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>' +
                '{{/each}}' +
                '</ul>' +
                '</div>',
            model: dateModel,
            zIndex: 2000,
            autoWidth: false
        }).render();
        var selectorEl = selector.element,
            calendarPlaceEl = $('.fs-publish-dateselect-calendar', selectorEl);
        var calendar = new InnerCalendar({
            trigger: calendarPlaceEl,
            zIndex: 2000
        });
        calendar.on('selectDate', function (date) {
            var val = date.format(formatStr);
            inputEl.val(val);
            that.trigger('change', val);
        });
        selector.on('change', function (targetEl) {
            var val = targetEl.data('value');
            inputEl.val(val);
            that.trigger('change', val);
        });
        selector.after("show", function () {
            calendar.show();
        });
        selector.after('hide', function () {
            calendar.hide();
        });
        this.calendar=calendar;
        this.selector = selector;
    };
    DateSelect.prototype.getValue = function (isDate) {
        var opts=this.opts,
            formatStr=opts.formatStr;
        var elEl = this.element,
            inputEl = $('.fs-publish-dateselect-input', elEl),
            dateText=_.str.trim(inputEl.val()),
            dateValue=moment(dateText, formatStr);
        if(isDate){
            return dateValue;
        }else{
            return _.str.trim(dateValue?dateValue.format('YYYY-MM-DD'):"");  //默认输出YYYY-MM-DD格式的字符串
        }

    };
    DateSelect.prototype.setValue = function (momentParam) {
        var momentDate=moment(momentParam);
        var calendar=this.calendar;
        //设置calendar日期
        calendar.setFocus(momentDate);
        calendar.trigger('selectDate',momentDate);

    };
    DateSelect.prototype.clear = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-dateselect-input', elEl);
        this.selector.select(-1);   //select清空
        return inputEl.val('');
    };
    Events.mixTo(DateSelect);

    var TimeSelect = function (opts) {
        opts = _.extend({
            "element": null,
            "placeholder": "请选择时间"
        }, opts || {});
        this.element = $(opts.element);
        this.opts = opts;
        this.init();
    };
    TimeSelect.prototype.init = function () {
        var that = this;
        var elEl = this.element,
            opts = this.opts,
            inputEl;
        var timeModel = [],
            i = 0,
            beginTime = moment("20130423080000", "YYYYMMDDhhmmss"),   //2013-04-23 08:00:00
            tempTime = beginTime;
        elEl.html('<input type="text" class="fs-publish-timeselect-input" readonly="readonly" placeholder="' + opts.placeholder + '" />');
        inputEl = $('.fs-publish-timeselect-input', elEl);
        placeholder(inputEl);
        //设置time model
        for (i = 0; i < 48; i++) {
            timeModel.push({
                value: tempTime.format("HH:mm"),
                text: tempTime.format("HH:mm")
            });
            tempTime = beginTime.add('minutes', 30);
        }
        this.selector = new Select({
            trigger: inputEl,
            model: timeModel,
            zIndex: 2000,
            autoWidth: false,
            className: 'fs-publish-timeselect',
            template: '<div class="{{classPrefix}}">' +
                '<div class="fs-publish-timeselect-title">请选择时间</div>' +
                '<ul class="{{classPrefix}}-content" data-role="content">' +
                '{{#each select}}' +
                '<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}" data-defaultSelected="{{defaultSelected}}" data-selected="{{selected}}"><a href="javascript:;" title="{{{text}}}">{{{text}}}</a></li>' +
                '{{/each}}' +
                '</ul>' +
                '</div>'
        }).render().on('change', function (targetEl) {
                var val = targetEl.data('value');
                inputEl.val(val);
                that.trigger('change', val);
            });
    };
    TimeSelect.prototype.getValue = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-timeselect-input', elEl);
        return _.str.trim(inputEl.val());
    };
    TimeSelect.prototype.setValue = function (mix) {
        var selector=this.selector;
        selector.select(mix);
    };
    TimeSelect.prototype.clear = function () {
        var elEl = this.element,
            inputEl = $('.fs-publish-timeselect-input', elEl);
        this.selector.select(-1);   //select清空
        return inputEl.val('');
    };
    Events.mixTo(TimeSelect);
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
            "cancelCb":FS.EMPTY_FN  //点击"取消"回调
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
                            "title": "同事",
                            "type": "p",
                            "list": contactData["p"]
                        },{
                            "title": "部门",
                            "type": "g",
                            "list": contactData["g"]
                        }
                    ],
                    "title": "选择同事",
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
            var atName=util.getAtFromInput(inputEl),
                rangeSbData=rangeSb.getSelectedData(),
                atData=[],
                rangeSbFullData=[];
            //收集at正文数据
            _.each(atName,function(itemName,i){
                atData[i]=util.getContactDataByName(itemName,'p');
            });
            //收集发送范围数据
            //"p"类型数据
            _.each(rangeSbData['p'],function(itemId){
                rangeSbFullData.push(util.getContactDataById(itemId,'p'));
            });
            //"g"类型数据
            _.each(rangeSbData['g'],function(itemId){
                rangeSbFullData.push(util.getContactDataById(itemId,'g'));
            });
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
        "_submit":function(){
            var submitCb=this.get('submitCb'),
                sb=this.sb;
            var sbData=sb.getSelectedData();
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
            "width":1000,
            "height":507,
            "inputSelector":{   //日志的三个输入框选择符
                "today":null,   //今日工作总结
                "tomorrow":null,    //明日工作计划
                "xdth":null //心得提会
            }
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel"
        },
        "setup":function(){
            var result;
            result=MyHistoryPlan.superclass.setup.apply(this,arguments);
            //设置当前plan发布日期
            this.currentPublishDate=moment(new Date());
            return result;
        },
        "_renderCpt":function(){
            var elEl=this.element,
                switchLinkEl=$('.switch-l',elEl),
                userNameEl=$('.user-name',elEl),
                avatarEl=$('.user-avatar',elEl),
                mediaEl=$('.media',elEl),
                inputEl=$('.publish-input',elEl);
            var sp=new SelectPanel({
                "trigger": switchLinkEl,
                "data": [{
                    "title":"同事",
                    "type":"p",
                    "list":contactData["p"]
                }],
                "singleCked": true  //单选方式
            });
            sp.on('select',function(selectData){
                var typeData=selectData["p"],
                    userData=typeData[0];
                userNameEl.text(userData.name);
                avatarEl.attr("src",util.getDfLink(userData.id,userData.name,false,'jpg'));
                //同时取消选中
                sp.unselect(userData.id,'p');
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
        "_submit":function(){},
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
         * 重置状态，默认显示当前登录用户plan信息
         * 同步当前日志信息
         */
        "_resetState":function(){
            var sp=this.sp;
            //切换到当前用户
            sp.select(contactData["u"].id,'p');
            //设置导航时间
            this._updateNavDate();
            //设置当前日志内容
            this._updateEditContent();
        },
        /**
         * 更新导航时间
         */
        "_updateNavDate":function(){
            var elEl=this.element,
                showAreaEl=$('.show-area',elEl);
            var currentPublishDate=this.currentPublishDate;
            showAreaEl.text(currentPublishDate.format('MM月DD日（dddd）'));
        },
        /**
         * 更新当前编辑内容
         */
        "_updateEditContent":function(){
            var elEl=this.element,
                todayInputEl=$('.today-input',elEl),
                tomorrowInputEl=$('.tomorrow-input',elEl),
                xdthInputEl=$('.xdth-input',elEl);
            var inputSelector=this.get('inputSelector')
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
    _.extend(exports, {
        "progressBar": ProgressBar,
        "atInput": AtInput,
        "selectPanel": SelectPanel,
        "selectBar": SelectBar,
        "mediaMaker": MediaMaker,
        "inputAutoHeight": InputAutoHeight,
        "dateSelect": DateSelect,
        "timeSelect": TimeSelect,
        "Receipt":Receipt,
        "MyHistoryPlan":MyHistoryPlan
    });
    exports.atInput = AtInput;
});
