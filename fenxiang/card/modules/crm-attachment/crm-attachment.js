/**
 * Attachment页组件2
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 /**
 * 使用方法
 *
 * 1.请确保只new一次，不要出现重复初始化
 * 2.必须的参数
    element：控件所站位置元素
    condition"{
        fbrType: int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
        1，与客户关联，dataID：客户ID；
        3，与机会关联，dataID：机会ID；
        4，与产品关联，dataID：产品ID；
        5,与对手关联，dataID：对手ID；
        6，与合同关联，dataID：合同ID；
        7，与市场活动关联，dataID：市场活动ID；
        8，销售线索关联，dataID：线索ID
        dataID: int，数据ID
        attachType: int，附件类型：1、录音；2、图片；3、文件；
        tagName: string，标签名称
        pageSize: int，分页大小
        pageNumber: int，当前页
    }
    3.如果条件不变，仅是刷新列表请调用reload（）
    4.如果条件改变变，刷新列表请调用reset（condition）

 */

 define(function(require, exports, module){
 	var root = window,
        FS = root.FS;
 	var Widget=require('widget');
 	var tpl = require('modules/crm-attachment/crm-attachment.html');
//    var tplStyle = require('modules/crm-attachment/crm-attachment.css');
    var filePreview = require('modules/fs-attach/fs-attach-file-preview');//文件阅读
    var FileReader = filePreview.FileReader; //文件阅读组件类
    var fileReader = new FileReader(); //文件阅读组件
    var util = require('util');
    var fsQxhelper = require('modules/fs-qx/fs-qx-helper');
    var FileDialog = require('modules/crm-file-dialog/crm-file-dialog');
    var Uploader = fsQxhelper.Uploader;
    var moment = require('moment');
    var Pagination=require('uilibs/pagination2');
    var Tag=require('modules/crm-tag-dialog/crm-tag-dialog');
    var RenameDialog=require('modules/crm-attachment-rename/crm-attachment-rename');
    var NProgress = require('nprogress');
 	var Attachment = Widget.extend({
 		"attrs":{
 			"element":null,
 			"condition":{},
 			"pagination":null,
 			"attachUploader":null,
            "fileDialog":null,
            "tagStr":"",
            "returnValues":[],
            "selectedItems":[],
            "tagDialog":null,
            "suportH5":true,
            "flashFiles":[],
            "contactData":util.getContactData(true),
            "renameDialog":null
 		},

 		"events":{
 			"click .crm-attachment-tag":"_tagFilter",
 			"click .crm-attachment-upload":"_upload",
 			"click .crm-attachment-no-file-upload":"_upload",
 			"click .crm-attachment-checkbox-all":"_toggleAll",
 			"click .crm-attachment-checkbox-single":"_toggleSingle",
 			"click .crm-attachment-set-tag":"_showTagDialog",
 			"click .crm-attachment-delete":"_delete",
 			"click .crm-attachment-file-rename":"_showRenameDialog",
 			"click .crm-attachment-file-preview":"_preview",
 			'mouseover .crm-attachment-file-tr': '_onMouseover',
 			'mouseout .crm-attachment-file-tr': '_onMouseout'
 		},

 		"setup":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		"_init":function(){
 			$(this.element).html(tpl);
            if (typeof(Worker) == "undefined"){
                this.set("suportH5",false);
                $(".crm-attachment-file-flash-container",this.element).show();
            }
 			this._getData();
 			this._initUploader();
 			this._initFileDialog();
 			this._initPagination();
 			this._initTag();
 			this._initRenameDialog();
 		},

 		"_initUploader":function(){
            var self = this;
            var attachUploader = new Uploader({
                "element": $(".crm-attachment-file-input",this.element),
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
        	var self = this;
            var condition = this.get("condition");
            var fileDialog = new FileDialog({
                "fbrType":condition.fbrType,
                "dataID":condition.dataID
            });
            fileDialog.on("fileSelect",function(){
                var file = $(".crm-attachment-file-input",self.element);
                if (typeof(Worker) !== "undefined"){   
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
                self.set("tagStr",tags);
                if (self.get("suportH5")){
                    self.get("attachUploader").startUpload();
                    NProgress.start();
                }else{
                    self._postData();
                }
            });
            fileDialog.on("cancel",function(){
                if(!self.get("suportH5")){
                    self.set("returnValues",[]);
                }
                self.get("attachUploader").removeAllFile();
            });
            this.set("fileDialog",fileDialog);
        },

 		"_initPagination":function(){
 			var self = this;
 			var condition = self.get("condition");
 			var pagination=new Pagination({
	            "element":$('.crm-attachment-page',self.element),
	            "pageSize":condition.pageSize,
	            "totalSize":0,
	            "activePageNumber":1
	        });
	        pagination.on('page',function(val){
	        	condition = self.get("condition");
	            condition.pageNumber = val;
	            self.set("condition",condition);
	            self._getData(condition);
	        });
	        self.set("pagination",pagination);
 		},

 		"_initTag":function(){
 			var self = this;
 			var tag = new Tag({});
 			tag.on("submit",function(tagStr){
 				self._setTag(tagStr);
 			});
 			this.set("tagDialog",tag);
 		},

 		"_initRenameDialog":function(){
 			var self = this;
 			var renameDialog = new RenameDialog({});
 			renameDialog.on("submit",function(attachId,oldName,newName){
 				self._rename(attachId,oldName,newName);
 			});
 			this.set("renameDialog",renameDialog);
 		},

 		"_getData":function(condition){
 			var self = this;
 			if(!condition){
 				condition = this.get("condition");
	            var defaultCondition = {
	                "fbrType":4,
	                "dataID":92,
	                "attachType":0,
	                "tagName":"",
	                "pageSize":10,
	                "pageNumber":1
	            };
	            condition = _.extend(defaultCondition,condition);
	            this.set("condition",condition);
 			}
            
            util.api({
                'url': '/CrmAttach/GetCrmAttachFiles',
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    var tags =  responseData.value.tags;
                    self._generateTagHtml(tags);
                    var files = responseData.value.feedAttachEntitys;
                    if(files.length > 0){
	                    self.get("pagination").setTotalSize(responseData.value.totalCount);
	                    self._generateFilesHtml(files);
	                    $(".crm-attachment-file-contanner",self.element).show();
	                    $(".crm-attachment-no-file",self.element).hide();
                        $(".crm-attachment-no-file-flash",self.element).hide();
                    }else{
                        if(condition.tagName != ""){
                            condition.tagName = "";
                            self._getData();
                        }else{
                            $(".crm-attachment-file-contanner",self.element).hide();
                            if(self.get("suportH5")){
                                $(".crm-attachment-no-file",self.element).show();        
                            }else{
                                $(".crm-attachment-no-file-flash",self.element).show();        
                            }
                            
                        }
                    }
                }
            });
        },


        "_generateTagHtml":function(tags){
        	var condition = this.get("condition");
        	var str = "";
        	if(condition.tagName == ""){
        		str = "crm-attachment-tag-disable";
        	}
        	var html = "<a class = 'crm-attachment-tag "+str+"' data-value = ''>全部</a>";
        	
        	if(tags && tags.length > 0){
        		_.each(tags,function(tag){
        			str = "";
        			if(condition.tagName == tag.value){
        				str = "crm-attachment-tag-disable";
        			}
        			html += "<a class = 'crm-attachment-tag "+str+"' data-value = '"+tag.value+"'>"+tag.value+"</a>"
        		});
        	}
        	$(".crm-attachment-tags",this.element).html(html);
        },

        "_generateFilesHtml":function(files){
        	var self = this;
            var html ="";
            if(!files || files.length < 1){
                return;
            }
            this.set("selectedItems",[]);
            if($(".crm-attachment-checkbox-all",this.element).hasClass("mn-selected")){
            	$(".crm-attachment-checkbox-all",this.element).removeClass("mn-selected");
            }
            _.each(files,function(file){
            	var str = "";
                var tagHtml = "";
 				if(!file.canPreview){
 					str = "fn-hide";
 				}
                _.each(file.tags,function(tag){
                    tagHtml += "<a class = 'crm-attachment-tag' data-value = '"+tag+"'>"+tag+"</a>&nbsp;"
                });
          	    html += "<tr fileId = '"+file.attachID+"tr' class = 'crm-attachment-file-tr'><td><div class='mn-checkbox-box'><span class = 'mn-checkbox-item crm-attachment-checkbox-single' data-value = '"+file.attachID+"'></span></div></td>";
          	    html += "<td><img title = '"+file.attachName+"' src='"+FS.BLANK_IMG+"' alt='icon' class='crm-attachment-image fs-attach-"+util.getFileType({"name":file.attachName},true)+"-small-icon file-icon fn-left'/><div class ='crm-attachment-file-name fn-left fn-text-overflow' title = '"+file.attachName+"'>"+file.attachName+"</div></td>";
          	    html += "<td class = 'crm-attachment-file-td'>"+util.getFileSize(file.attachSize)+"</td>";
			    html += "<td class = 'crm-attachment-file-td'>"+tagHtml+"</td>";
			    html += "<td class = 'crm-attachment-file-td'>"+file.employee.name+"</td>";
			    html += "<td class = 'crm-attachment-file-td'>"+moment.unix(file.createTime).format('YYYY年MMMDD日')+"</td>";
			    html += "<td><a fileId = '"+file.attachID+"' data-name = '"+file.attachName+"' class = 'crm-attachment-file-rename'>重命名</a><a  href = '"+ util.getDfLink(file.attachPath, file.attachName, true)+"' title = '"+file.attachName+"' target ='_blank'>下载</a><a data-attachID = '"+file.attachID+"' data-attachName = '"+file.attachName+"' data-attachPath = '"+file.attachPath+"' class = 'crm-attachment-file-preview "+str+"'>预览</a></td></tr>";
            });
			$(".crm-attachment-file-body",this.element).html(html);
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
                    util.remind(2,"上传成功");
                    NProgress.done();
                    self.trigger("uploaded");
                }
            });
        },

        "_tagFilter":function(e){
        	var el = $(e.currentTarget);
        	if(!el || el.hasClass("crm-attachment-tag-disable")){
        		return;
        	}
        	var tag = el.attr("data-value");
        	var condition = this.get("condition");
        	$("[data-value="+condition.tagName+"]").removeClass("crm-attachment-tag-disable");
        	condition.tagName = tag;
        	this.set("condition",condition);
        	$("[data-value="+condition.tagName+"]").addClass("crm-attachment-tag-disable");
        	this._getData(condition);
        },

        "_upload":function(){
        	var file = $(".crm-attachment-file-input",self.element);
            if (typeof(Worker) !== "undefined"){   
                file.click();
            }else{   
                util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }
        },

        "reload":function(){
        	var condition = this.get("condition");
            this._getData(condition);
 		},

 		"reset":function(condition){
        	if(condition){
	            var defaultCondition = {
	                "fbrType":0,
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

 		"_toggleAll":function(e){
 			var el = $(e.currentTarget);
 			if(!el){
 				return;
 			}
 			var selectedItems = this.get("selectedItems");
 			selectedItems = [];
 			var toCheck = true;
 			//uncheck
 			if(el.hasClass("mn-selected")){
 				toCheck = false
 			}
 			_.each($(".crm-attachment-checkbox-single",this.element),function(item){
 				if(toCheck){
 					$(item).addClass("mn-selected");
 					$("[fileid="+$(item).attr("data-value")+"tr]").addClass("crm-attachment-file-tr-selected");
					selectedItems.push($(item).attr("data-value"));
 				}else{
 					$(item).removeClass("mn-selected");
 					$("[fileid="+$(item).attr("data-value")+"tr]").removeClass("crm-attachment-file-tr-selected");
 				}
			});
 			this.set("selectedItems",selectedItems);
 		},

 		"_toggleSingle":function(e){
 			var el = $(e.currentTarget);
 			if(!el){
 				return;
 			}
 			var selectedItems = this.get("selectedItems");
 			//check
 			if(!el.hasClass("mn-selected")){
 				selectedItems.push(el.attr("data-value"));
 				$("[fileid="+$(el).attr("data-value")+"tr]").addClass("crm-attachment-file-tr-selected");
 			}else{
 				selectedItems = _.without(selectedItems,el.attr("data-value"));
 				$("[fileid="+$(el).attr("data-value")+"tr]").removeClass("crm-attachment-file-tr-selected");
 			}
 			this.set("selectedItems",selectedItems);
 		},

 		"_onMouseover":function(e){
 			var tr = $(e.currentTarget);
            if(!tr){
                return;
            }
            tr.addClass("crm-attachment-file-tr-active");
 		},

 		"_onMouseout":function(e){
 			var tr = $(e.currentTarget);
            if(!tr){
                return;
            }
            tr.removeClass("crm-attachment-file-tr-active");
 		},

 		"_showTagDialog":function(e){
 			var selectedItems = this.get("selectedItems");
 			if(selectedItems.length < 1){
 				util.alert("请选择要设置标签的附件。");
 				return;
 			}
 			var condition = this.get("condition");
            var tagCondition = {};
            tagCondition = {"fbrType":condition.fbrType,"dataID":condition.dataID};
 			this.get("tagDialog").willShow(tagCondition);
 		},

 		"_showRenameDialog":function(e){
 			var el = $(e.currentTarget);
 			var attachId = el.attr("fileId");
 			var attachName = el.attr("data-name");
 			this.get("renameDialog").show(attachId,attachName);
 		},

 		"_setTag":function(str){
 			var self = this;
 			var condition = this.get("condition");
 			var selectedItems = this.get("selectedItems");
 			if(selectedItems.length < 1){
 				return;
 			}
 			var para = {
 				"fbrType":condition.fbrType,
 				"dataID":condition.dataID,
 				"attachIDs":selectedItems,
 				"tagNames":str
 			};
 			util.api({
                'url': '/CrmAttach/SetCrmAttachTags',
                'type': 'post',
                "dataType": 'json',
                'data': para,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    util.remind(2,"设置成功");
                    self.set("selectedItems",[]);
                    self.reload();
                }
            });
 		},

 		"_rename":function(attachId,oldName,newName){
 			var self = this;
 			var condition = this.get("condition");
 			var para = {
 				"fbrType":condition.fbrType,
 				"dataID":condition.dataID,
 				"attachID":attachId,
 				"oldAttachName":oldName,
 				"newAttachName":newName
 			};
 			util.api({
                'url': '/CrmAttach/ModifyCrmAttachName',
                'type': 'post',
                "dataType": 'json',
                'data': para,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    self.reload();
                }
            });
 		},

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

 		"_delete":function(){
 			var selectedItems = this.get("selectedItems");
 			if(selectedItems.length < 1){
 				util.alert("请选择要删除的附件。");
 				return;
 			};
 			var self = this;
 			util.confirm("您确定要删除选中的"+selectedItems.length+"个附件吗？","",function(){
 				var condition = self.get("condition");
 				var para = {
	 				"fbrType":condition.fbrType,
	 				"dataID":condition.dataID,
	 				"attachIDs":selectedItems
	 			};
	 			util.api({
	                'url': '/CrmAttach/DeleteCrmAttachs',
	                'type': 'post',
	                "dataType": 'json',
	                'data': para,
	                'success': function (responseData) {
	                    if(!responseData.success){
	                        return;
	                    }
	                    util.remind(2,"删除成功");
                        self.set("selectedItems",[]);
                        self.trigger("uploaded");
	                    self.reload();
	                }
	            });
 			});
 		},

 		"render":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			return result;
 		},

 		"destroy":function(){
 			var result = Attachment.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Attachment;
 });