/**
 * 自定义uploader，基于XMLHttpRequest
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var util=require('util');
    var H5Uploader=function(params){
        var key;
        //浏览器支持情况检测
        if(!this.isSupport()){
            return this;
        }
        if (!(this instanceof H5Uploader)) {
            return new H5Uploader(params);
        } else if (params === Object(params)) { //判定是否为普通object，来自underscore
            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    this[key] = params[key];
                }
            }
            this.init();
            return this;
        }
    };
    _.extend(H5Uploader.prototype,{
        multiple:false, //是否多选
        accept:"*.*",   //类型限制
        fileInput: null,				//html file控件
        dragDrop: null,					//拖拽敏感区域
        upButton: null,					//提交按钮
        url: "",						//ajax地址
        fileFilter: [],					//过滤后的文件数组
        timeout: 120,                   // 超时时间（单位：秒）
        filter: function (files) {		//选择文件组的过滤方法
            return files;
        },
        onSelect: function () { },		//文件选择后
        onDelete: function () { },		//文件删除后
        onDragOver: function () { },		//文件拖拽到敏感区域时
        onDragLeave: function () { },	//文件离开到敏感区域时
        onProgress: function () { },		//文件上传进度
        onTotalProgress: function () { },		//文件总上传进度
        onSuccess: function () { },		//文件上传成功时
        onFailure: function () { },		//文件上传失败时,
        onComplete: function () { },		//文件全部上传完毕时
        onFileNotFound: function(file){ },      //文件改名 或 被删除

        /* 开发参数和内置方法分界线 */
        /**
         * FileList转换成普遍数组
         */
        /*toPlainArray:function(fileList){
            var firstStepArr=Array.prototype.slice(fileList),
                arr=[];
            for(var i= 0,len=firstStepArr.length;i<len;i++){
                arr[i]={
                    "id":firstStepArr[i].id,
                    "name":firstStepArr[i].name,
                    "size":firstStepArr[i].size
                };
            }
            return arr;
        },*/
        //文件拖放
        funDragHover: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);
            return this;
        },
        //获取选择文件，file控件或拖放
        funGetFiles: function (e) {
            // 取消鼠标经过样式
            this.funDragHover(e);

            // 获取文件列表对象
            var files = e.target.files || e.dataTransfer.files;
            //转换成普通数组
            files=Array.prototype.slice.call(files);
            //先过滤
            files=this.filter(files);
            //再添加
            this.addFile(files);
            return this;
        },

        //选中文件的处理与回调
        addFile: function (files) {
            for (var i = 0, file; file = files[i]; i++) {
                //添加id
                file.id = 'h5-upload-file-'+H5Uploader.fileIndex;
                H5Uploader.fileIndex++;
            }
            //添加到数据存储
            this.fileFilter = this.fileFilter.concat(files);
            //执行选择回调
            this.onSelect(files);
            return this;
        },

        //删除对应的文件
        removeFile: function (id) {
            var arrFile = [];
            for (var i = 0, file; file = this.fileFilter[i]; i++) {
                if (file.id != id) {
                    arrFile.push(file);
                } else {
                    this.onDelete(file);
                }
            }
            this.fileFilter = arrFile;
            return this;
        },
        removeAllFile:function(){
            this.fileFilter =[];
            return this;
        },
        getFiles:function(){
            return this.fileFilter;
        },
        //文件上传
        startUpload: function () {
            var self = this;
            var totalSize=self.getTotalUploadSize();
            if (location.host.indexOf("sitepointstatic") >= 0) {
                //非站点服务器上运行
                return;
            }
            var files = this.fileFilter,
                j = 0;
            if(files.length>0){
                (function uploadFile(file) {
                    var xhr = new XMLHttpRequest(),
                        timeoutTimer, abort = false;
                    if (xhr.upload) {
                        // 上传中
                        xhr.upload.addEventListener("progress", function (e) {
                            self.onProgress(file, e.loaded, e.total);
                            file.uploadedSize = e.loaded;
                            self.onTotalProgress(self.getTotalUploadedSize(), totalSize);
                        }, false);

                        // 文件上传成功或是失败
                        xhr.onreadystatechange = function (e) {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    self.onSuccess(file, xhr.responseText);
                                    file.uploaded = true;   //上传成功标志
                                    j++;
                                    if (files[j]) {
                                        uploadFile(files[j]);
                                    }
                                    if (self.isAllUploaded()) {
                                        //全部完毕
                                        self.onComplete();
                                    }
                                }else if(xhr.status === 0 && !abort){
                                    self.onFileNotFound(file);
                                }else {
                                    self.onFailure(file, xhr.responseText);
                                    try{
                                		window.store.set('uploaderror', 'xhr.status:' + xhr.status + ';abort:' + abort + ';responsetext:' + xhr.responseText);
                                	}catch(e){}
                                }
                                clearTimeout(timeoutTimer);
                            }
                        };
                        // 开始上传
                        xhr.open("POST", FS.API_PATH+self.url, true);
                        //xhr.setRequestHeader("X_FILENAME", file.name);
                        xhr.setRequestHeader("Content-Type", 'multipart/form-data');
                        xhr.setRequestHeader("totalLength", file.size);
                        xhr.setRequestHeader("startIndex", "0");
                        xhr.setRequestHeader("storagePath", "");
                        xhr.setRequestHeader("extension", util.getFileExtText(file.name));

                        //xhr.setRequestHeader("X-File-Name", file.name);
                        //xhr.setRequestHeader("X-File-Size", file.fileSize);
                        //xhr.setRequestHeader("X-File-Type", file.type);
                        xhr.send(file);
                        if(self.timeout > 0){
                            timeoutTimer = setTimeout(function () {
                                abort = true;
                                xhr.abort();
                                self.onFailure(file, '上传超时，请重试');
                            }, self.timeout * 1000);
                        }
                    }
                })(files[0]);
            }

        },
        getTotalUploadSize:function(){
            var totalSize=0;
            for (var i = 0, file; file = this.fileFilter[i]; i++) {
                totalSize += file.size;
            }
            return totalSize;
        },
        getTotalUploadedSize:function(){
            var totalUploadedlSize=0;
            for (var i = 0, file; file = this.fileFilter[i]; i++) {
                if (file.uploadedSize) {
                    totalUploadedlSize += file.uploadedSize;
                }
            }
            return totalUploadedlSize;
        },
        isAllUploaded: function () {
            var allUploaded = true;
            for (var i = 0, file; file = this.fileFilter[i]; i++) {
                if (!file.uploaded) {
                    allUploaded = false;
                    break;
                }
            }
            return allUploaded;
        },
        init: function () {
            var self = this;
            //设置类型标识
            this.type="h5";
            //添加多选和类型限制
            if(this.multiple){
                this.fileInput.multiple="multiple";
            }
            this.fileInput.accept=this.accept;

            if (this.dragDrop) {
                this.dragDrop.addEventListener("dragover", function (e) { self.funDragHover(e); }, false);
                this.dragDrop.addEventListener("dragleave", function (e) { self.funDragHover(e); }, false);
                this.dragDrop.addEventListener("drop", function (e) { self.funGetFiles(e); }, false);
            }

            //文件选择控件选择
            if (this.fileInput) {
                this.fileInput.addEventListener("change", function (e) {
                    self.funGetFiles(e);
                    //reset input[type=file]
                    //self.fileInput.value=null;  //ie10下失效
                    //from http://stackoverflow.com/questions/6987452/clearing-file-input-box-in-internet-explorer
                    $(self.fileInput).wrap('<form>').closest('form').get(0).reset();
                    $(self.fileInput).unwrap();
                }, false);
            }

            //上传按钮提交
            if (this.upButton) {
                this.upButton.addEventListener("click", function (e) { self.funUploadFile(e); }, false);
            }
        },
        /**
         * 是否禁用
         * @param isDisabled
         */
        "setDisable":function(isDisabled){
            var inputEl=$(this.fileInput);
            if(isDisabled){
                inputEl.addClass('state-disabled').prop('disabled',true);
            }else{
                inputEl.removeClass('state-disabled').prop('disabled',false);
            }
        },
        /**
         * 特性检测
         */
        "isSupport":function(){
            return H5Uploader.isSupport();
        },
        "destroy":function(){}
    });
    H5Uploader.fileIndex=0;
    /**
     * h5上传特性检测
     */
    H5Uploader.isSupport=function(){
        var isPassed=true,
            xhr;
        if(!root.XMLHttpRequest){
            isPassed=false;
        }else{
            xhr=new XMLHttpRequest();
            isPassed=!!(xhr.upload&&xhr.addEventListener);
        }
        return isPassed;
    };
    module.exports=H5Uploader;
});
