define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util');
    var tpl = require('modules/crm-tag-dialog/crm-tag-dialog.html');
//    var tplStyle = require('modules/crm-tag-dialog/crm-tag-dialog.css');
	var Tag = Dialog.extend({
		"attrs":{
			"content": tpl,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
			"width":392,
            "myTags":["测试","真的","还有一个","另外一个"]
		},

		setup:function(){
            var result=Tag.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result = Tag.superclass.render.apply(this, arguments);
            return result;
        },
        //隐藏
        "hide": function () {
            var result = Tag.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function () {
            var result = Tag.superclass.show.apply(this, arguments);
            return result;
        },

        "willShow":function(condition){
            this._getMyTags(condition);
        },

        "events":{
        	'click .crm-tag-dialog-button-ok': '_submit',
        	'click .crm-tag-dialog-button-cancel': '_cancel',
            'click .crm-tag-dialog-my-tag':'_toInput',
            'keyup .crm-tag-dialog-input': '_keyup',
            'keydown .crm-tag-dialog-input': '_keydown'
        },

        "_keyup":function(evt){
            var valArrayNew = [];
            var elEl = this.element,
                    tagnamesEl = $('.crm-tag-dialog-input', elEl),
                    myVal = tagnamesEl.val(),
                    myValFm = $.trim(myVal), //去掉前后空格
                    valArray = myValFm.split(" "),//去除中间空格
                    valArrayN = [];
            valArray = _.filter(valArray,function(item){
                return item != "";
            });
            evt = (evt) ? evt : window.event;
            if (evt.keyCode == 32 && valArray.length >= 3 ) { //敲空格的时候     
                tagnamesEl.val(myValFm);
                return false;
            }
            if (evt.keyCode != 46 && evt.keyCode != 8 && evt.keyCode != 37 && evt.keyCode != 39) { //排除一些按键，如del,backspace,left……

                for (var n in valArray) {
                    var tagLength = 12;
                    if((/[\u4e00-\u9fa5]+/).test(valArray[n])){     
                         tagLength = 6;        
                      }
                    if (valArray[n].length > tagLength) { //每个数组元素的字符长度不能超过12
                        valArrayN = valArray[n].substr(0, tagLength); //超过12就把末尾字符删除
                        valArray[n] = valArrayN;
                        tagnamesEl.val(valArray.join(' '));
                    }
                }
            }
            
            if (evt.keyCode == 13){
                this._submit();
                return;
            }
            this._setDisableByInput();
        },

        "_keydown":function(evt){
            var valArrayNew = [];
            var elEl = this.element,
                    tagnamesEl = $('.crm-tag-dialog-input', elEl),
                    myVal = tagnamesEl.val(),
                    myValFm = $.trim(myVal), //去掉前后空格
                    valArray = myValFm.split(" ").join(" ").split(" "),//去除中间空格
                    valArrayN = [];
            valArray = _.filter(valArray,function(item){
                return item != "";
            });
            evt = (evt) ? evt : window.event;
            if (evt.keyCode == 32 && valArray.length >= 3 ) { //敲空格的时候     
                tagnamesEl.val(myValFm);
                return false;
            }

            if (evt.keyCode != 46 && evt.keyCode != 8 && evt.keyCode != 37 && evt.keyCode != 39) { //排除一些按键，如del,backspace,left……

                for (var n in valArray) {
                    var tagLength = 12;
                    if((/[\u4e00-\u9fa5]+/).test(valArray[n])){     
                         tagLength = 6;        
                      }
                    if (valArray[n].length > tagLength) { //每个数组元素的字符长度不能超过12
                        valArrayN = valArray[n].substr(0, tagLength); //超过12就把末尾字符删除
                        valArray[n] = valArrayN;
                        tagnamesEl.val(valArray.join(' '));
                    }
                }
            }
            if (evt.keyCode == 13){
                this._submit();
                return;
            }
            this._setDisableByInput();
        },

        "_toInput":function(e){
            var el = $(e.currentTarget);
            if(!el || el.hasClass("crm-tag-dialog-my-tag-disable") || !this._canInput()){
                return;
            }
            var elEl = this.element,
                tagStr = $.trim($('.crm-tag-dialog-input', elEl).val());
            tagStr += " "+el.text()
            $('.crm-tag-dialog-input', elEl).val(tagStr);
            if(!this._canInput()){
                this._setAllTagDisable();
            }else{
                el.addClass("crm-tag-dialog-my-tag-disable");
            }


        },

        "reset":function(){
            $(".crm-tag-dialog-input").val("");
        },

        "_cancel":function(){
            this.hide();
        },

        "_submit":function(){
            var value = $(".crm-tag-dialog-input",this.element).val();
            if(!value){
                util.showInputError($(".crm-tag-dialog-input",this.element));
                return;
            }
            this.trigger("submit",value);
            this.hide();
        },

        "_canInput":function(){
            var elEl = this.element,
                tagStr = $.trim($('.crm-tag-dialog-input', elEl).val());
                tagArray = tagStr.split(" ");
            if(tagArray.length > 2){
                return false;
            }
            return true;
        },

        "_setAllTagDisable":function(){
            _.each($(".crm-tag-dialog-my-tag",this.element),function(el){
                if(!$(el).hasClass("crm-tag-dialog-my-tag-disable")){
                    $(el).addClass("crm-tag-dialog-my-tag-disable");
                }
            });
        },

        "_setDisableByInput":function(){
            var elEl = this.element,
                tagStr = $.trim($('.crm-tag-dialog-input', elEl).val());
                tagArray = tagStr.split(" ");
            _.each($(".crm-tag-dialog-my-tag",this.element),function(el){
                if(_.contains(tagArray,$(el).text())){
                    $(el).addClass("crm-tag-dialog-my-tag-disable");
                }else{
                    $(el).removeClass("crm-tag-dialog-my-tag-disable");
                }
            });
        },

        //waiting for the api
        "_getMyTags":function(condition){
            var self = this;
            util.api({
                'url': '/CrmAttach/GetCrmAttachFileTags',
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                    self.show();
                    var tags = responseData.value.tags;
                    self.set("myTags",tags);
                    self._myTagHtml();
                }
            });
            
        },

        "_myTagHtml":function(){
            var tags = this.get("myTags");
            var container = $(".crm-tag-dialog-my-tags",this.element);
            var html = "";
            if(!tags || tags.length < 1){
                container.empty();
                return;
            }
            _.each(tags,function(tag){
                html += "<div class = 'crm-tag-dialog-my-tags-box fn-left fn-clear'><a class = 'crm-tag-dialog-my-tag' data-value = '"+tag.value+"'>"+tag.value+"</a></div>";
            });
            container.html(html);
        },

        "destroy":function(){
            var result=Tag.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Tag;
});