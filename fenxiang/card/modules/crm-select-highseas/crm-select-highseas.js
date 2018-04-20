define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util'),
	Pagination=require('uilibs/pagination2');
    var tpl = require('modules/crm-select-highseas/crm-select-highseas.html');
//    var tplStyle = require('modules/crm-select-highseas/crm-select-highseas.css');
    var CreateDialog = require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
	var SelectHighseas = Dialog.extend({
		/*customize attrs
		   title
		   defaultCondition
		*/
		"attrs":{
			"title":"选择公海",
            "url":"/HighSeas/GetAllHighSeas/",
			"content": tpl,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
			"width":790,
			"height":600,
            "currentHighSeaID":0,
            "hasCreate":true,
            "createDialog":null,
            "created":false,
            "id":0
		},

		setup:function(){
            var result=SelectHighseas.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result = SelectHighseas.superclass.render.apply(this, arguments);
            this._initCreateDialog();
            this._initOthers();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = SelectHighseas.superclass.hide.apply(this, arguments);
            if(this.get("created")){
                this.trigger("created");
            }
            return result;
        },

        //当前公海id，如果不传显示所有公海
        "show": function (id) {
            var result = SelectHighseas.superclass.show.apply(this, arguments);
            this.set("created",false);
            this.set("id",id);
            this._getData(id);
            return result;
        },



        //重置
        "reset":function(){
        },

        "events":{
        	'click .crm-select-highsea': '_submit',
        	'click .crm-select-highseas-button-create': '_create',
        	'click .crm-select-highseas-button-cancel': '_cancel'
        },

        //初始化其他元素
        "_initOthers":function(){
            if(this.get("title")){
                $(".crm-select-highseas-title").text(this.get("title"));
            }
            if(this.get("hasCreate")){
                $(".crm-select-highseas-button-create",this.element).show();
            }else{
                $(".crm-select-highseas-button-create",this.element).hide();
            }
        },

        "_initCreateDialog":function(){
            var self = this;
            var createDialog = new CreateDialog();
            createDialog.on("addSuccess",function(value){
                self.set("created",true);
                self._getData(self.get("id"));
            });
            this.set("createDialog",createDialog);
        },

        //获取数据
        "_getData":function(id){
        	var self = this;
        	util.api({
                'url': this.get("url"),
                'type': 'get',
                "dataType": 'json',
                'data': {},
                'success': function (responseData) {
                    if(!responseData.success){
                    	return;
                    }
                    self._getColleagueHtml(responseData.value.highSeas,id);
                }
            });
        },

        //获取html
        "_getColleagueHtml":function(highseas,id){
        	var html = "";
        	var self = this;
        	if(!highseas){
        		return html;
        	}
        	_.each(highseas,function(item){
        		if(id != item.highSeasID){
                    html += "<div class = 'crm-select-highsea fn-left fn-clear' data-value = '"+item.highSeasID+"' data-name ='"+item.name+"'>";
                    html += "<div class = 'crm-select-highsea-name' title = '"+item.name+"'>"+item.name+"</div>"
                    html += "<div class = 'crm-select-highsea-customer-number'>共有"+item.customerCount+"个客户</div></div>"
                }
            });  
        	$(".crm-select-highseas-result-container",this.element).html(html);
        },
        
        //提交事件
        "_submit":function(e){
        	var currentEl = $(e.currentTarget);
            var value = {
                "id":currentEl.attr("data-value"),
                "name":currentEl.attr("data-name")
            }
            this.trigger("selected",value);
        	this.hide();
        },

        "_create":function(){
            this.get("createDialog").show();
        },

        //取消
        "_cancel":function(e){
        	this.hide();
        },

        "destroy":function(){
            var result;
            result=Pagination.superclass.destroy.apply(this,arguments);
            this.element.empty();
            return result;
        }
	});
	module.exports = SelectHighseas;
});