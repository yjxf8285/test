/**
 * 客户导入
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

define(function(require,exports,module){
	var Dialog = require("dialog"),
        root = window,
        FS = root.FS;
	   util=require('util');
    var tpl = require('modules/crm-object-import/crm-object-import.html');
//    var tplStyle = require('modules/crm-object-import/crm-object-import.css');
    var fsQxhelper = require('modules/fs-qx/fs-qx-helper');
    var Uploader = fsQxhelper.Uploader;
	var ObjectImport = Dialog.extend({
		"attrs":{
			"content": tpl,
			"width":550,
            "title":"",
            "downloadApi":"",
            "downloadText":"",
            "importApi":"",
            "uploader":null,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            "returnFilePath":""
		},

		"setup":function(){
            var result=ObjectImport.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result = ObjectImport.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },

        "_init":function(){
            var title = this.get("title"),
                downloadText = this.get("downloadText"),
                downloadApi = FS.API_PATH +"/df/" + this.get("downloadApi");
            $(".crm-object-import-title",this.element).text(title);
            $(".crm-object-import-link",this.element).attr("href",downloadApi);
            $(".crm-object-import-link",this.element).text("点击下载《"+downloadText+"》");
            this._initUploader();
        },
        "_showLoading": function(){
        	var loading = '<div class="crm-import-loading"><span></span></div>';
        	this.element.append(loading);
        },
        "_hideLoading": function(){
        	$('.crm-import-loading', this.element).remove();
        },
        "_setFileInputPosition":function(){
            if (typeof(Worker) !== "undefined"){   
                return;
            }else{   
                var file = $(".crm-object-import-file-div object",this.element);
                var selectDiv = $(".crm-object-import-file-div",this.element);
                var selectBtn = $(".crm-object-import-button-select",this.elment).last();
                selectDiv.show();
                //file.click();
                file.css({"width":selectBtn.width()+50,"height":selectBtn.height()+2,"left":selectBtn.position().left,"top":selectBtn.position().top});
                //util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }
        },

        "_initUploader":function(){
            var self = this;
            var uploader = new Uploader({
                "element": $(".crm-object-import-file-input",this.element),
                "h5Opts": {
                    multiple: false,
                    accept: "excel/*",
                    filter: function (files) {
                        var passedFiles=[];
                        _.each(files,function(fileData){
                            if(util.getFileType(fileData)=="xls"){
                                passedFiles.push(fileData);
                            }else{
                                util.alert('请选择excel格式的文件');
                            }

                        });
                        return passedFiles;
                    }
                },
                "flashOpts": {
                    file_types: "*.xls;*.xlsx",
                    file_types_description: "Excel文件"
                },
                "onSuccess":function(file, responseText){
                    var returnFilePath = self.get("returnFilePath");
                    var fileInfo = JSON.parse(responseText).value;
                    returnFilePath = fileInfo.filePath;
                    self.set("returnFilePath",returnFilePath);
                },  
                "onFailure":function(file){
                	self._hideLoading();
                },
                "onSelect": function (file) {
                    $(".crm-object-import-file-name",self.element).text(file.name);
                    $(".crm-object-import-button-import",self.element).removeClass("crm-button-disable");
                },
                "onComplete":function(){
                    self._postData();
                    self.get("uploader").removeAllFile();
                    $(".crm-object-import-file-name",self.element).text("");
                    $(".crm-object-import-button-import",self.element).addClass("crm-button-disable");
                }
            });
            this.set("uploader",uploader);
        },

        //隐藏
        "hide": function () {
            var result = ObjectImport.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (attachId,oldName) {
            var result = ObjectImport.superclass.show.apply(this, arguments);
            if (typeof(Worker) == "undefined"){   
                this._setFileInputPosition();
            }
            return result;
        },

        "events":{
            "click .crm-object-import-button-select":"_fileSelect",
            "click .crm-object-import-button-import":"_import"
        },

        "_fileSelect":function(){
            var file = $(".crm-object-import-file-input",this.element);
            if (typeof(Worker) !== "undefined"){   
                file.click();
            }else{   
                util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }
        },

        "_import":function(e){
        	var el = $(e.currentTarget);
        	if(!el || el.hasClass("crm-button-disable")){
                return;
            }
        	this._showLoading();
            this.get("uploader").startUpload();
            $(".crm-object-import-button-import",self.element).addClass("crm-button-disable");
        },

        "_postData":function(){
            var self = this;
            var url = self.get("importApi");
            util.api({
                'url': url,
                'type': 'post',
                "dataType": 'json',
                'timeout': 120000,//导入设置超时2min
                'data': {"path":self.get("returnFilePath")},
                'success': function (responseData) {
                	self._hideLoading();
                    if(!responseData.success){
                        return;
                    }
                    if(responseData.value.importSucceed){
                        self.set("returnFilePath","");
                        util.remind(2,"导入成功");
                        self.trigger("uploaded");
                        self.hide();
                    }else{
                        self._showError(responseData.value.importEmployeePropertys);
                    }
                },
                'error': function(){
                	self._hideLoading();
                }
            });
        },

        "_showError":function(errorInfo){
            if(!errorInfo || errorInfo.length < 1){
                util.alert("导入失败");
                return;
            }
            var errorContainer = $(".crm-object-import-error-info3",this.element);
            errorContainer.empty();
            _.each(errorInfo,function(item){
                if(item.isError){
                    errorContainer.append("<div>第"+item.rowNo+"行："+item.errorMessage+"</div");
                }
            });
            $(".crm-object-import-error-container",this.element).show();

        },

        "reset":function(){
            $(".crm-object-import-file-name",this.element).text("");
            $(".crm-object-import-button-import",this.element).addClass("crm-button-disable");
            this.get("uploader").removeAllFile();
            $(".crm-object-import-error-container",this.element).hide();
        },

        "destroy":function(){
            var result=ObjectImport.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = ObjectImport;
});