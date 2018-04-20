/**
 * 自定义uploader，基于swfupload
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var SWFUpload=require('swfupload');

    //覆盖SwfUpload设置
    // Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
// This function is called by Flash each time the ExternalInterface functions are created.
    SWFUpload.prototype.cleanUp = function (movieElement) {
        // Pro-actively unhook all the Flash functions
        try {
            if (this.movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
                this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
                for (var key in movieElement) {
                    try {
                        if (typeof(movieElement[key]) === "function"&& key[0] <= 'Z') {          //From http://www.zamen.name/post/16.html
                            movieElement[key] = null;
                        }
                    } catch (ex) {
                    }
                }
            }
        } catch (ex1) {

        }

        // Fix Flashes own cleanup code so if the SWFMovie was removed from the page
        // it doesn't display errors.
        window["__flash__removeCallback"] = function (instance, name) {
            try {
                if (instance) {
                    instance[name] = null;
                }
            } catch (flashEx) {

            }
        };

    };

    function fileQueueError(file, errorCode, message) {
        try {
            var imageName = "error.gif";
            var errorName = "";
            if (errorCode === SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED) {
                errorName = "You have attempted to queue too many files.";
            }

            if (errorName !== "") {
                alert(errorName);
                return;
            }

            switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    imageName = "zerobyte.gif";
                    break;
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    imageName = "toobig.gif";
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                default:
                    alert(message);
                    break;
            }

            addImage("images/" + imageName);

        } catch (ex) {
            this.debug(ex);
        }

    }

    function fileDialogComplete(numFilesSelected, numFilesQueued) {
        try {
            if (numFilesQueued > 0) {
                this.startUpload();
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function uploadProgress(file, bytesLoaded) {

        try {
            var percent = Math.ceil((bytesLoaded / file.size) * 100);

            var progress = new FileProgress(file,  this.customSettings.upload_target);
            progress.setProgress(percent);
            if (percent === 100) {
                progress.setStatus("Creating thumbnail...");
                progress.toggleCancel(false, this);
            } else {
                progress.setStatus("Uploading...");
                progress.toggleCancel(true, this);
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function uploadSuccess(file, serverData) {
        try {
            var progress = new FileProgress(file,  this.customSettings.upload_target);

            if (serverData.substring(0, 7) === "FILEID:") {
                addImage("thumbnail.php?id=" + serverData.substring(7));

                progress.setStatus("Thumbnail Created.");
                progress.toggleCancel(false);
            } else {
                addImage("images/error.gif");
                progress.setStatus("Error.");
                progress.toggleCancel(false);
                alert(serverData);

            }


        } catch (ex) {
            this.debug(ex);
        }
    }

    function uploadComplete(file) {
        try {
            /*  I want the next upload to continue automatically so I'll call startUpload here */
            if (this.getStats().files_queued > 0) {
                this.startUpload();
            } else {
                var progress = new FileProgress(file,  this.customSettings.upload_target);
                progress.setComplete();
                progress.setStatus("All images received.");
                progress.toggleCancel(false);
            }
        } catch (ex) {
            this.debug(ex);
        }
    }

    function uploadError(file, errorCode, message) {
        var imageName =  "error.gif";
        var progress;
        try {
            switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    try {
                        progress = new FileProgress(file,  this.customSettings.upload_target);
                        progress.setCancelled();
                        progress.setStatus("Cancelled");
                        progress.toggleCancel(false);
                    }
                    catch (ex1) {
                        this.debug(ex1);
                    }
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    try {
                        progress = new FileProgress(file,  this.customSettings.upload_target);
                        progress.setCancelled();
                        progress.setStatus("Stopped");
                        progress.toggleCancel(true);
                    }
                    catch (ex2) {
                        this.debug(ex2);
                    }
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    imageName = "uploadlimit.gif";
                    break;
                default:
                    alert(message);
                    break;
            }

            addImage("images/" + imageName);

        } catch (ex3) {
            this.debug(ex3);
        }

    }


    function addImage(src) {
        var newImg = document.createElement("img");
        newImg.style.margin = "5px";

        document.getElementById("thumbnails").appendChild(newImg);
        if (newImg.filters) {
            try {
                newImg.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 0;
            } catch (e) {
                // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
                newImg.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + 0 + ')';
            }
        } else {
            newImg.style.opacity = 0;
        }

        newImg.onload = function () {
            fadeIn(newImg, 0);
        };
        newImg.src = src;
    }

    function fadeIn(element, opacity) {
        var reduceOpacityBy = 5;
        var rate = 30;  // 15 fps


        if (opacity < 100) {
            opacity += reduceOpacityBy;
            if (opacity > 100) {
                opacity = 100;
            }

            if (element.filters) {
                try {
                    element.filters.item("DXImageTransform.Microsoft.Alpha").opacity = opacity;
                } catch (e) {
                    // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
                    element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')';
                }
            } else {
                element.style.opacity = opacity / 100;
            }
        }

        if (opacity < 100) {
            setTimeout(function () {
                fadeIn(element, opacity);
            }, rate);
        }
    }



    /* ******************************************
     *  FileProgress Object
     *  Control object for displaying file info
     * ****************************************** */

    function FileProgress(file, targetID) {
        this.fileProgressID = "divFileProgress";

        this.fileProgressWrapper = document.getElementById(this.fileProgressID);
        if (!this.fileProgressWrapper) {
            this.fileProgressWrapper = document.createElement("div");
            this.fileProgressWrapper.className = "progressWrapper";
            this.fileProgressWrapper.id = this.fileProgressID;

            this.fileProgressElement = document.createElement("div");
            this.fileProgressElement.className = "progressContainer";

            var progressCancel = document.createElement("a");
            progressCancel.className = "progressCancel";
            progressCancel.href = "#";
            progressCancel.style.visibility = "hidden";
            progressCancel.appendChild(document.createTextNode(" "));

            var progressText = document.createElement("div");
            progressText.className = "progressName";
            progressText.appendChild(document.createTextNode(file.name));

            var progressBar = document.createElement("div");
            progressBar.className = "progressBarInProgress";

            var progressStatus = document.createElement("div");
            progressStatus.className = "progressBarStatus";
            progressStatus.innerHTML = "&nbsp;";

            this.fileProgressElement.appendChild(progressCancel);
            this.fileProgressElement.appendChild(progressText);
            this.fileProgressElement.appendChild(progressStatus);
            this.fileProgressElement.appendChild(progressBar);

            this.fileProgressWrapper.appendChild(this.fileProgressElement);

            document.getElementById(targetID).appendChild(this.fileProgressWrapper);
            fadeIn(this.fileProgressWrapper, 0);

        } else {
            this.fileProgressElement = this.fileProgressWrapper.firstChild;
            this.fileProgressElement.childNodes[1].firstChild.nodeValue = file.name;
        }

        this.height = this.fileProgressWrapper.offsetHeight;

    }
    FileProgress.prototype.setProgress = function (percentage) {
        this.fileProgressElement.className = "progressContainer green";
        this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
        this.fileProgressElement.childNodes[3].style.width = percentage + "%";
    };
    FileProgress.prototype.setComplete = function () {
        this.fileProgressElement.className = "progressContainer blue";
        this.fileProgressElement.childNodes[3].className = "progressBarComplete";
        this.fileProgressElement.childNodes[3].style.width = "";

    };
    FileProgress.prototype.setError = function () {
        this.fileProgressElement.className = "progressContainer red";
        this.fileProgressElement.childNodes[3].className = "progressBarError";
        this.fileProgressElement.childNodes[3].style.width = "";

    };
    FileProgress.prototype.setCancelled = function () {
        this.fileProgressElement.className = "progressContainer";
        this.fileProgressElement.childNodes[3].className = "progressBarError";
        this.fileProgressElement.childNodes[3].style.width = "";

    };
    FileProgress.prototype.setStatus = function (status) {
        this.fileProgressElement.childNodes[2].innerHTML = status;
    };

    FileProgress.prototype.toggleCancel = function (show, swfuploadInstance) {
        this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
        if (swfuploadInstance) {
            var fileID = this.fileProgressID;
            this.fileProgressElement.childNodes[0].onclick = function () {
                swfuploadInstance.cancelUpload(fileID);
                return false;
            };
        }
    };

    var FlashUploader=function(opts){
        var that=this;
        var uploadProgressHandler,
            uploadCompleteHandler,
            uploadSuccessHandler,
            uploadStartHandler;
        opts=_.extend({
            // Backend Settings
            upload_url: "#",
            file_post_name:'file',
            post_params: {},

            // File Upload Settings
            file_size_limit : 0,   // 不大于1000M，需要略高些,具体会在调用时限制
            //file_types : "*.jpg",
            //file_types_description : "JPG Images",
            file_upload_limit : 0,

            // Event Handler Settings - these functions as defined in Handlers.js
            //  The handlers are not part of SWFUpload but are part of my website and control how
            //  my website reacts to the SWFUpload events.
            file_queue_error_handler : fileQueueError,
            file_dialog_complete_handler : fileDialogComplete,
            upload_progress_handler : uploadProgress,
            upload_total_progress_handler:FS.EMPTY_FN,
            upload_error_handler : uploadError,
            upload_success_handler : uploadSuccess,
            upload_complete_handler : uploadComplete,
            upload_all_complete_handler:FS.EMPTY_FN,

            // Button Settings
            //button_image_url : "images/SmallSpyGlassWithTransperancy_17x18.png",
            //button_placeholder_id : "spanButtonPlaceholder",
            button_width: 18,
            button_height: 18,
            button_text : '<span class="button">Select Images <span class="buttonSmall">(2 MB Max)</span></span>',
            button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
            button_text_top_padding: 0,
            button_text_left_padding: 18,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_cursor: SWFUpload.CURSOR.HAND,
            //button_disabled:true,

            // Flash Settings
            flash_url : FS.BASE_PATH+"/html/fs/assets/swfupload/swfupload.swf",

            custom_settings : {
                upload_target : "divFileProgressContainer"
            },

            // Debug Settings
            debug: false
        },opts||{});
        uploadStartHandler=opts.upload_start_handler;
        opts.upload_start_handler=function(file){
            that._updateFileStore(file);
            that._updateFileStore({
                "id":file.id,
                "uploaded":false,
                "uploadedSize":0
            });
            return uploadStartHandler&&uploadStartHandler.apply(this,arguments);
        };
        uploadProgressHandler=opts.upload_progress_handler;
        opts.upload_progress_handler=function(file, uploadedSize, fileSize){
            that._updateFileStore({
                "id":file.id,
                "uploadedSize":uploadedSize
            });
            uploadProgressHandler&&uploadProgressHandler.apply(this,arguments);
            //总进度回调
            opts.upload_total_progress_handler.call(this,that.getTotalUploadedSize(),that.getTotalUploadSize());
        };
        uploadSuccessHandler=opts.upload_success_handler;
        opts.upload_success_handler=function(file){
            that._updateFileStore({
                "id":file.id,
                "uploaded":true
            }); //成功上传完毕标志
            return uploadSuccessHandler&&uploadSuccessHandler.apply(this,arguments);
        };
        uploadCompleteHandler=opts.upload_complete_handler;
        opts.upload_complete_handler=function(){
            var tempFile,
                fileIndex= 0,
                isAllUploaded=true;
            while(tempFile=this.getFile(fileIndex)){
                if(tempFile.filestatus==SWFUpload.FILE_STATUS.IN_PROGRESS||tempFile.filestatus==SWFUpload.FILE_STATUS.QUEUED){
                    isAllUploaded=false;
                }
                fileIndex++;
            }
            uploadCompleteHandler&&uploadCompleteHandler.apply(this,arguments);
            if(isAllUploaded){
                opts.upload_all_complete_handler.call(this);
            }
            that.totalUploadedSize=0;   //清空已上传总大小
        };
        var core=new SWFUpload(opts);
        this.type="flash";
        this._files=[];
        this.core=core;
    };
    _.extend(FlashUploader.prototype,{
        "startUpload":function(){
            var core=this.core;
            return core.startUpload.apply(core,arguments);
        },
        "cancelUpload":function(){
            var core=this.core;
            return core.cancelUpload.apply(core,arguments);
        },
        /**
         * removeFile是cancelUpload的别名，保证与h5上传接口的统一
         * @returns {*}
         */
        "removeFile":function(){
            return this.cancelUpload.apply(this,arguments);
        },
        /**
         * 删除所有的上传文件
         */
        "removeAllFile":function(slient){
            var core=this.core,
                file,
                index= 0;
            while(file=core.getFile(index)){
                this.removeFile(file.id,slient);
                index++;
            }
        },
        /**
         * 获取所有的文件
         */
        "getFiles":function(isValid){
            var core=this.core;
            var index= 0,
                file,
                fileStore=[];
            while(file=core.getFile(index)){
                if(isValid){
                    if(file.filestatus==SWFUpload.FILE_STATUS.QUEUED||file.filestatus==SWFUpload.FILE_STATUS.IN_PROGRESS){
                        fileStore.push(file);
                    }

                }else{
                    fileStore.push(file);
                }
                index++;
            }
            return fileStore;
        },
        /**
         * 更新文件存储
         * @param fileData
         */
        "_updateFileStore":function(fileData){
            var files=this._files;
            var isExit=false;
            _.some(files,function(itemData){
                if(itemData.id==fileData.id){
                    isExit=true;
                    _.extend(itemData,fileData);
                }
            });
            if(!isExit){ //不存在直接追加
                this._files.push(_.extend({},fileData));
            }
        },
        "_getFileFullData":function(fileId){
            var files=this._files;
            return _.find(files,function(fileData){
                return fileData.id==fileId;
            });
        },
        "getTotalUploadSize":function(){
            var totalSize=0;
            var files=this.getFiles();
            //过滤掉被取消文件
            files= _.filter(files,function(file){
                return file.filestatus!=SWFUpload.FILE_STATUS.CANCELLED;
            });
            for (var i = 0, file; file = files[i]; i++) {
                totalSize += file.size;
            }
            return totalSize;
        },
        "getTotalUploadedSize":function(){
            var totalUploadedlSize=0;
            var files=this.getFiles(),
                shadowFile;
            //过滤掉被取消文件
            files= _.filter(files,function(file){
                return file.filestatus!=SWFUpload.FILE_STATUS.CANCELLED;
            });
            for (var i = 0, file; file = files[i]; i++) {
                shadowFile=this._getFileFullData(file.id);
                if (shadowFile&&shadowFile.uploadedSize) {
                    totalUploadedlSize += shadowFile.uploadedSize;
                }
            }
            return totalUploadedlSize;
        },
        /**
         * 是否禁用
         * @param isDisabled
         */
        "setDisable":function(isDisabled){
            var core=this.core;
            core.setButtonDisabled(isDisabled);
        },
        "destroy":function(){
            this._files=null;
            this.core.destroy();
        }
    });
    module.exports=FlashUploader;
});
