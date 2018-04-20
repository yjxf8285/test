define(function(require,exports,module){
    var root = window,
        FS = root.FS;
	var Dialog = require("dialog"),
	util=require('util');
    var tpl = require('modules/crm-file-dialog/crm-file-dialog.html');
////    var tplStyle = require('modules/crm-file-dialog/crm-file-dialog.css');
    var TagDialog = require('modules/crm-tag-dialog/crm-tag-dialog');
	var File = Dialog.extend({
		"attrs":{
			"content": tpl,
			"width":500,
            "size":0,
            "number":0,
            "status":"hide",
            "tag":"",
            "tagStr":"",
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            "fbrType":0,
            "dataID":0,
            "cancel":true
		},

		setup:function(){
            var result=File.superclass.setup.apply(this,arguments);
            this._init();
            this._initEvents();
            return result;
        },

		"render": function () {
            var result = File.superclass.render.apply(this, arguments);
            return result;
        },
        //隐藏
        "hide": function () {
            var result = File.superclass.hide.apply(this, arguments);
            var cancel = this.get("cancel");
            if(cancel == true){
                this.trigger("cancel");
            }
            this.reset();
            return result;
        },

        //显示
        "show": function (files) {
            var result = File.superclass.show.apply(this, arguments);
            //this._generateFileTable(files);
            this.set("sttaus","show");
            if (typeof(Worker) == "undefined"){
                $(".crm-file-dialog-button-upload",this.element).hide();
            }
            return result;
        },

        "events":{
            'click .crm-file-dialog-button-upload':'_fileSelect',
            'click .crm-file-dialog-file-delete':'_delete',
            'click .crm-file-dialog-button-tag': '_showTagDialog',
        	'click .crm-file-dialog-button-ok': '_submit',
        	'click .crm-file-dialog-button-cancel': '_cancel',
            'mouseover .crm-file-dialog-file-tr': '_mouseover',
            'mouseout .crm-file-dialog-file-tr': '_mouseout'
        },

        "_init":function(){
            var tag = new TagDialog({});
            this.set("tag",tag);
        },

        "_initEvents":function(){
            var self = this;
            var tag = this.get("tag");
            tag.on("submit",function(tagStr){
                self.set("tagStr",tagStr);
                $(".crm-file-dialog-tags",self.element).text(tagStr);
                $(".crm-file-dialog-tags",self.element).attr("title",tagStr);
            });
        },

        "_fileSelect":function(){
            this.trigger("fileSelect");
        },

        "_delete":function(e){
            var el = $(e.currentTarget);
            var fileId = el.attr("fileId");
            var filePath = el.attr("filePath");
            var fileSize = el.attr("fileSize");

            if(!el || !fileId){
                return;
            }
            $("[fileId="+fileId+"tr]").remove();
            if($(".crm-file-dialog-file-delete",this.element).length < 1){
                $(".crm-file-dialog-button-ok",this.element).addClass("button-disable");
            }

            //更新大小
            var size=this.get("size");
            size=size - fileSize;
            $(".crm-file-dialog-file-size",this.element).text(util.getFileSize(size));
            this.set("size",size);

            //更新数量
            var number=this.get("number");
            number=number - 1;
            $(".crm-file-dialog-file-num",this.element).text(number);
            this.set("number",number);

            this.trigger("delete",fileId,filePath);
        },

        "_showTagDialog":function(){
            var fbrType = this.get("fbrType");
            var dataID = this.get("dataID");
            var condition = {};
            if(fbrType && dataID){
                condition = {"fbrType":fbrType,"dataID":dataID};
            }
            this.get("tag").willShow(condition);
        },

        "add":function(file,filePath){
            var self = this;
            var html ="";
            if(!file){
                return;
            }
            var path = "";
            if(filePath){
                path = filePath;
            }
            var number = this.get("number");
            var size = this.get("size");
            html += "<tr fileId = '"+file.id+"tr' class = 'crm-file-dialog-file-tr'><td><img src='"+FS.BLANK_IMG+"' alt='icon' class='crm-file-dialog-image fs-attach-"+util.getFileType({"name":file.name},true)+"-small-icon file-icon fn-left'/><div class ='crm-file-dialog-file-name fn-left fn-text-overflow' title = '"+file.name+"'>"+file.name+"</div></td>";
            html += "<td>"+util.getFileType(file,true).toUpperCase()+"</td>";
            html += "<td>"+util.getFileSize(file.size)+"</td>";
            html += "<td><a fileId = '"+file.id+"' filePath = '"+path+"' fileSize='"+file.size+"' class = 'crm-file-dialog-file-delete'>删除</a></td></tr>";
            setTimeout(function(){
                $(".crm-file-dialog-file-body",self.element).append(html);    
            },50);
            
            number = number + 1;
            size = size + file.size;
            this.set("number",number);
            this.set("size",size);
            $(".crm-file-dialog-file-num",this.element).text(number);
            $(".crm-file-dialog-file-size",this.element).text(util.getFileSize(size));
            if($(".crm-file-dialog-button-ok",this.element).hasClass("button-disable")){
                $(".crm-file-dialog-button-ok",this.element).removeClass("button-disable");
            }
        },

        "reset":function(){
            $(".crm-file-dialog-file-body",this.element).empty();
            $(".crm-file-dialog-tags",self.element).text("");
            this.set("status","hide");
            this.set("number",0);
            this.set("size",0);
            this.set("tagStr","");
            this.set("cancel",true);
        },

        "_cancel":function(){
            this.hide();
        },

        "_mouseover":function(e){
            var tr = $(e.currentTarget);
            if(!tr){
                return;
            }
            tr.addClass("crm-file-dialog-file-tr-active");
        },
        "_mouseout":function(e){
            var tr = $(e.currentTarget);
            if(!tr){
                return;
            }
            tr.removeClass("crm-file-dialog-file-tr-active");
        },

        "_submit":function(){
            if($(".crm-file-dialog-button-ok",this.element).hasClass("button-disable")){
                return;
            }
            var tag = this.get("tagStr");
            this.trigger("submit",tag);
            this.set("cancel",false);
            this.hide();
        },

        "destroy":function(){
            var result=File.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = File;
});