/**
 * 附件列表
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
    /**
     * two events
     *
     * uploaded
     * toAll
     */

    var root = window,
         FS = root.FS;
    var Widget=require('widget');
    var tpl = require('modules/crm-attachment-simple/crm-attachment-simple.html');
////    var tplStyle = require('modules/crm-attachment-simple/crm-attachment-simple.css');
    var filePreview = require('modules/fs-attach/fs-attach-file-preview');//文件阅读
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var util = require('util');
    var fsQxhelper = require('modules/fs-qx/fs-qx-helper');
    var FileDialog = require('modules/crm-file-dialog/crm-file-dialog');
    var Uploader = fsQxhelper.Uploader;
    var NProgress = require('nprogress');
 	var Attachment = Widget.extend({
 		"attrs":{
 			"element":null,
 			"items":[],
            "condition":{},
            "attachUploader":null,
            "fileDialog":null,
            "tagStr":"",
            "suportH5":true,
            "flashFiles":[],
            "contactData":util.getContactData(true),
            "returnValues":[]
 		},

 		"events":{
 			"click .crm-attachment-simple-all":"_toAll",
 			"click .crm-attachment-simple-title-upload":"_upload",
 			"click .crm-attachment-simple-upload":"_upload",
 			"click .crm-attachment-simple-preview":"_preview"
 		},

 		"setup":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		"render":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			return result;
 		},
 		//重新加载
 		"reload":function(){
            this._getData();
 		},

        "reset":function(condition){
            if(condition){
                var defaultCondition = {
                    "fbrType":4,
                    "dataID":0,
                    "attachType":0,
                    "tagName":"",
                    "pageSize":10,
                    "pageNumber":1
                };
                condition = _.extend(defaultCondition,condition);
                this.set("condition",condition);
            }
            this.reload(condition);
        },

 		//显示全部
 		"_toAll":function(){
 			this.trigger("toAll",this.get("items"));
 		},

 		//上传
 		"_upload":function(){
            var file = $(".crm-attachment-simple-file-input",this.element);
            if (typeof(Worker) !== "undefined"){   
                file.click();
            }else{   
                util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }
 		},
 		//预览
 		"_preview":function(e){  
 			var el = $(e.currentTarget);
 			if(!el){
 				return;
 			}
 			fileReader.readFile({
                "fileId": el.attr("data-attachID"),
                "fileName": el.attr("data-attachName"),
                "filePath": el.attr("data-attachPath")
            });
 		},

 		//清空
 		"_empty":function(){
            if (typeof(Worker) == "undefined"){
                $(".crm-attachment-simple-title-upload",this.element).show();
                $(".crm-attachment-simple-content",this.element).html($(".crm-attachment-simple-result-empty-flash",tpl).clone());
                $(".crm-attachment-simple-result-empty-flash",this.element).show();

            }else{
                $(".crm-attachment-simple-title-upload",this.element).hide();
                $(".crm-attachment-simple-content",this.element).html($(".crm-attachment-simple-result-empty",tpl).clone());    
            }
 			$(".crm-attachment-simple-footer",this.element).hide();
 			$(".crm-attachment-simple-content",this.element).css({"border-bottom": "1px #d8d8d8 solid"});
 		},

 		//填充
 		"_full":function(){
 			$(".crm-attachment-simple-title-upload",this.element).show();
 			$(".crm-attachment-simple-content",this.element).css({"border-bottom": "0px #d8d8d8 solid"});
 			$(".crm-attachment-simple-footer",this.element).show();
 			this._generateHtml();
 		},

 		//初始化
 		"_init":function(){
            this.element.html(tpl);
            if (typeof(Worker) == "undefined"){
                this.set("suportH5",false);
            }
            this._getData();
            this._initUploader();
            this._initFileDialog();
            this._initEvents();
 		},

        "_initUploader":function(){
            var self = this;
            var attachUploader = new Uploader({
                "element": $(".crm-attachment-simple-file-input",this.element),
                "h5Opts": {
                    multiple: true,
                    accept: "*/*",
                    filter: function (files) {
                        return self.uploadFilter(files,"attach");
                    }
                },
                "flashOpts": {
                    file_types: "*.*",
                    file_types_description: "所有文件"
                },
                "onSuccess":function(file, responseText){
                    var returnValues = self.get("returnValues");
                    var fileInfo = JSON.parse(responseText).value;
                    if (self.get("suportH5")){
                        returnValues.push({
                            "value": 3, //FeedAttachType
                            "value1":fileInfo.filePath,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                    }else{
                        var attachUploader = self.get("attachUploader");
                        var fileDialog = self.get("fileDialog")
                        var status = fileDialog.get("status");
                        var flashFiles = self.get("flashFiles");
                        var flashFiles = _.filter(flashFiles,function(item){
                            return item.id != file.id;
                        });
                        returnValues.push({
                            "value": 3, //FeedAttachType
                            "value1":fileInfo.filePath,
                            "value2": file.size, //文件总长度（字节）
                            "value3": file.name  //文件原名
                        });
                        attachUploader.removeFile(file.id,false);
                        if(flashFiles.length>0){
                            //attachUploader._updateFileStore(flashFiles[0]);
                            attachUploader.startUpload();    
                        }
                        self.set("flashFiles",flashFiles);
                        self.set("attachUploader",attachUploader);
                        
                        if(status!="show"){
                            fileDialog.show();
                        }  
                        fileDialog.add(file,fileInfo.filePath);
                    }
                    self.set("returnValues",returnValues);
                },
                "onProgress":function(file,uploadedSize,totalSize){
                   //NProgress.inc(uploadedSize/totalSize);
                },
                "onFailure":function(file){
                    util.alert("上传失败，请重试！");
                    self.get("attachUploader").removeAllFile();
                    NProgress.done();
                },
                "onSelect": function (file) {
                    if(self.get("suportH5")){
                        var fileDialog = self.get("fileDialog")
                        var status = fileDialog.get("status");
                        if(status!="show"){
                            fileDialog.show();
                        }  
                        fileDialog.add(file);  
                    }else{
                        var tempResult = self.uploadFilter([file],"attach");
                        var flashFiles = self.get("flashFiles");

                        _.each(tempResult,function(item){
                            if(flashFiles.length == 0){
                                self.get("attachUploader").startUpload();
                            }
                            flashFiles.push(item);
                        });
                        self.set("flashFiles",flashFiles);
                    }
                },
                "onComplete":function(){
                    if (self.get("suportH5")){
                        NProgress.done();
                        self._postData();
                        self.get("attachUploader").removeAllFile();
                    }
                }
            });
            this.set("attachUploader",attachUploader);
        },

        "uploadFilter":function(fileData,uploadType){
            fileData=[].concat(fileData);
            var passedFiles=[], //保存筛选后的文件
                typeFiles=[],
                message;
            var uploadFileSizeLimit=this.get("contactData")["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            var attachUploader = this.get("attachUploader");
            typeFiles = attachUploader.core.fileFilter;
            _.each(fileData,function(file){
                if (file.size < uploadFileSizeLimit * 1024 * 1024&&file.size>0) { //最大uploadFilesSizeLimit
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

        "_initFileDialog":function(){
            var condition = this.get("condition");
            var fileDialog = new FileDialog({
                "fbrType":condition.fbrType,
                "dataID":condition.dataID
            });
            this.set("fileDialog",fileDialog);
        },

        "_initEvents":function(){
            var fileDialog = this.get("fileDialog");
            var self = this;
            fileDialog.on("fileSelect",function(){
                var file = $(".crm-attachment-simple-file-input",self.element);
                if (self.get("suportH5")){   
                    file.click();
                }else{   
                    util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
                }
            });

            fileDialog.on("delete",function(fileId,filePath){
                if(!self.get("suportH5")){
                    var fileInfos = self.get("returnValues");
                    if(filePath){
                        fileInfos = _.filter(fileInfos,function(item){
                            return item.value1 != filePath;
                        });
                        self.set("returnValues",fileInfos);
                    }
                }
                self.get("attachUploader").removeFile(fileId);
            });

            fileDialog.on("submit",function(tags){
                if (self.get("suportH5")){   
                    self.set("tagStr",tags);
                    self.get("attachUploader").startUpload();
                    NProgress.start();
                }else{
                	self.set("tagStr",tags);
                    self._postData();
                }
            });
            fileDialog.on("cancel",function(){
                if(!self.get("suportH5")){
                    self.set("returnValues",[]);
                }
                self.get("attachUploader").removeAllFile();
            });
        },


        "_postData":function(){
            var self = this;
            var tagStr = this.get("tagStr");
            var fileInfos = this.get("returnValues");
            var condition = this.get("condition");
            var para = {
                "tagNames":tagStr,
                "fileInfos":fileInfos,
                "fbrType":condition.fbrType,
                "dataID":condition.dataID
            };
            util.api({
                'url': '/CrmAttach/AddCrmAttachs',
                'type': 'post',
                "dataType": 'json',
                'data': para,
                'success': function (responseData) {
                    if(!responseData.success){
                        util.remind(2,"上传失败，请重新上传");
                        NProgress.done();
                        return;
                    }
                    self.set("returnValues",[]);
                    self.reload();
                    NProgress.done();
                    util.remind(2,"上传成功");
                    self.trigger("uploaded");
                }
            });
        },

        "_getData":function(){
            var self = this;
            var condition = this.get("condition");
            var defaultCondition = {
                "fbrType":0,
                "dataID":0,
                "attachType":0,
                "tagName":"",
                "pageSize":6,
                "pageNumber":1
            };
            condition = _.extend(defaultCondition,condition);
            this.set("condition",condition);
            util.api({
                'url': '/CrmAttach/GetCrmAttachFiles',
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    self.set("items",responseData.value.feedAttachEntitys);
                    var items = self.get("items");
                    if(items && items.length > 0){
                        self._full();
                    }else{
                        self._empty();
                    }
                }
            });
        },



 		//生成html
 		"_generateHtml":function(){
 			var items = this.get("items");
 			var html = "<table class = 'crm-attachment-simple-table'>";
 			if(!items || items.length < 1){
 				return;
 			}
 			_.each(items,function(item){
 				html += "<tr><td class = 'crm-attachment-simple-image-td'><img src='"+FS.BLANK_IMG+"' alt='icon' class='crm-attachment-simple-image fs-attach-"+util.getFileType({"name":item.attachName},true)+"-small-icon file-icon'/></td>";
 				html += "<td class = 'crm-attachment-simple-name-td'><div title='"+item.attachName+"' class = 'crm-attachment-simple-name-div fn-text-overflow'>"+item.attachName+"</div></td>";
 				html += "<td class = 'crm-attachment-simple-download-td'><a href = '"+ util.getDfLink(item.attachPath, item.attachName, true)+"' title = '"+item.attachName+"' target ='_blank'>下载</a></td>";
 				var str = "";
 				if(!item.canPreview){
 					str = "fn-hide";
 				}
 				html += "<td class = 'crm-attachment-simple-show-td'><a data-attachID = '"+item.attachID+"' data-attachName = '"+item.attachName+"' data-attachPath = '"+item.attachPath+"' class = 'crm-attachment-simple-preview "+str+"'>预览</a></td></tr>";
 			});
 			html += "</table>";
 			//$(".crm-attachment-simple-content".tpl).empty();
 			$(".crm-attachment-simple-content",this.element).html(html);
 		},

 		"destroy":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Attachment;
 });