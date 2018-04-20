define("uilibs/uploader/h5uploader",["util"],function(a,b,c){var d=window,e=d.FS,f=a("util"),g=function(a){var b;if(!this.isSupport())return this;if(!(this instanceof g))return new g(a);if(a===Object(a)){for(b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);return this.init(),this}};_.extend(g.prototype,{multiple:!1,accept:"*.*",fileInput:null,dragDrop:null,upButton:null,url:"",fileFilter:[],filter:function(a){return a},onSelect:function(){},onDelete:function(){},onDragOver:function(){},onDragLeave:function(){},onProgress:function(){},onTotalProgress:function(){},onSuccess:function(){},onFailure:function(){},onComplete:function(){},funDragHover:function(a){return a.stopPropagation(),a.preventDefault(),this["dragover"===a.type?"onDragOver":"onDragLeave"].call(a.target),this},funGetFiles:function(a){this.funDragHover(a);var b=a.target.files||a.dataTransfer.files;return b=Array.prototype.slice.call(b),b=this.filter(b),this.addFile(b),this},addFile:function(a){for(var b,c=0;b=a[c];c++)b.id="h5-upload-file-"+g.fileIndex,g.fileIndex++;return this.fileFilter=this.fileFilter.concat(a),this.onSelect(a),this},removeFile:function(a){for(var b,c=[],d=0;b=this.fileFilter[d];d++)b.id!=a?c.push(b):this.onDelete(b);return this.fileFilter=c,this},removeAllFile:function(){return this.fileFilter=[],this},getFiles:function(){return this.fileFilter},startUpload:function(){var a=this,b=a.getTotalUploadSize();if(!(location.host.indexOf("sitepointstatic")>=0)){var c=this.fileFilter,d=0;c.length>0&&!function g(h){var i=new XMLHttpRequest;i.upload&&(i.upload.addEventListener("progress",function(c){a.onProgress(h,c.loaded,c.total),h.uploadedSize=c.loaded,a.onTotalProgress(a.getTotalUploadedSize(),b)},!1),i.onreadystatechange=function(){4==i.readyState&&(200==i.status?(a.onSuccess(h,i.responseText),h.uploaded=!0,d++,c[d]&&g(c[d]),a.isAllUploaded()&&a.onComplete()):a.onFailure(h,i.responseText))},i.open("POST",e.API_PATH+a.url,!0),i.setRequestHeader("Content-Type","multipart/form-data"),i.setRequestHeader("totalLength",h.size),i.setRequestHeader("startIndex","0"),i.setRequestHeader("storagePath",""),i.setRequestHeader("extension",f.getFileExtText(h.name)),i.send(h))}(c[0])}},getTotalUploadSize:function(){for(var a,b=0,c=0;a=this.fileFilter[c];c++)b+=a.size;return b},getTotalUploadedSize:function(){for(var a,b=0,c=0;a=this.fileFilter[c];c++)a.uploadedSize&&(b+=a.uploadedSize);return b},isAllUploaded:function(){for(var a,b=!0,c=0;a=this.fileFilter[c];c++)if(!a.uploaded){b=!1;break}return b},init:function(){var a=this;this.type="h5",this.multiple&&(this.fileInput.multiple="multiple"),this.fileInput.accept=this.accept,this.dragDrop&&(this.dragDrop.addEventListener("dragover",function(b){a.funDragHover(b)},!1),this.dragDrop.addEventListener("dragleave",function(b){a.funDragHover(b)},!1),this.dragDrop.addEventListener("drop",function(b){a.funGetFiles(b)},!1)),this.fileInput&&this.fileInput.addEventListener("change",function(b){a.funGetFiles(b),$(a.fileInput).wrap("<form>").closest("form").get(0).reset(),$(a.fileInput).unwrap()},!1),this.upButton&&this.upButton.addEventListener("click",function(b){a.funUploadFile(b)},!1)},setDisable:function(a){var b=$(this.fileInput);a?b.addClass("state-disabled").prop("disabled",!0):b.removeClass("state-disabled").prop("disabled",!1)},isSupport:function(){return g.isSupport()},destroy:function(){}}),g.fileIndex=0,g.isSupport=function(){var a,b=!0;return d.XMLHttpRequest?(a=new XMLHttpRequest,b=!(!a.upload||!a.addEventListener)):b=!1,b},c.exports=g});