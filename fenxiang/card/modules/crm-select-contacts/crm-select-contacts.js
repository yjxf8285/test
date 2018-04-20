define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util'),
	Pagination=require('uilibs/pagination2');
    var tpl = require('modules/crm-select-contacts/crm-select-contacts.html');
//    var tplStyle = require('modules/crm-select-contacts/crm-select-contacts.css');
	var SelectContacts = Dialog.extend({
		/*customize attrs
		   title
		   defaultCondition
		*/
		"attrs":{
			"title":"选择联系人",
            "type":"search",//search,modify
            "url":"/Contact/GetUserContacts/",
			"content": tpl,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
			"width":800,
			"height":600,
			"condition":{},
			"needToRest":false,
			"defaultCondition":{
                "employeeID":0,
				"isFirstChar":false,
                "source":0,
                "createCustomer":0,
                "startDate":0,
                "endDate":0,
                "tagOptionIDsJson":"",
                "sortType":0,
				"keyword":"",
				"isContainSubordinate":0,
				"pageSize":12,
				"pageNumber":1
			},
			"result":[]
		},

		setup:function(){
            var result=SelectContacts.superclass.setup.apply(this,arguments);
            //this.set("content",this._getTemplate());
            var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
            this.set("condition",copyDefaultCondition);
            this.render();
            return result;
        },
        //render
		"render": function () {
            var result = SelectContacts.superclass.render.apply(this, arguments);
            this._initOthers();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = SelectContacts.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (items) {
            var self=this;
            var result = SelectContacts.superclass.show.apply(this, arguments);
            if(items){
                this.set("result",items);
            }
            //判断获取数据是否成功 如果未成功 不执行默认显示步骤 直接返回
            var getdata=this._getData(this.get("condition"),function(){
                self.hide();
            });

            return result;
        },

        //重置
        "reset":function(){
        	this._unselectAll();
        	$(".crm-select-contacts-search-input",this.element).val("");
        	var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
        	this.set("condition",copyDefaultCondition);
        },
        //事件列表
        "events":{
        	'click .crm-contacts-multiselect-info': '_showSelected',
        	'click .crm-select-contacts-unselect-all': '_unselectAll',
        	'click .crm-select-contacts-search-button': '_onButtonClick',
            'keydown .crm-select-contacts-search-input':'_onButtonKeydown',
        	'click .crm-select-contacts-colleague': '_onColleageClick',
        	'mouseover .crm-select-contacts-colleague': '_onColleageMouseOver',
        	'mouseout .crm-select-contacts-colleague': '_onColleageMouseOut',
        	'click .crm-select-contacts-button-ok': '_submit',
        	'click .crm-select-contacts-button-cancel': '_cancel'
        },

        //初始化其他元素
        "_initOthers":function(){
        	
            if(this.get("title")){
                $(".crm-select-contacts-title").text(this.get("title"));
            }
            if(this.get("type")=="modify"){
                $(".crm-select-contacts-search-title-container",this.element).hide();
                $(".crm-select-contacts-result-info",this.element).hide();
            }
        	var self = this;
            if(self.get("condition").pageSize){
                self.pagination=new Pagination({
                "element":$('.crm-select-contacts-result-pagination',self.element),
                "pageSize":self.get("condition").pageSize,
                "totalSize":0,
                "activePageNumber":1
                });
                self.pagination.on("page",function(val){
                    var condition = self.get("condition");
                    condition.pageNumber = val;
                    self.set("condition",condition);
                    self._getData(condition);
                });    
            }
        	
        },

        //获取数据
        "_getData":function(condition,callback){
        	var self = this;
            util.api({
                'url': this.get("url"),
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        callback();
                        return false;
                    }
                    self._getColleagueHtml(responseData.value.contacts,responseData.value.totalCount);
                    return true;
                }
            },{
                "mask":self.element,
                "maskCls":"self-cls"
            });
        },

        //获取html
        "_getColleagueHtml":function(contacts,totle){
        	var html = "";
        	var self = this;
        	if(!contacts){
        		return html;
        	}
        	if(totle >= 0){
        		this.pagination.setTotalSize(totle);
        	}
        	$(".crm-select-contacts-result-container",this.element).empty();
        	_.each(contacts,function(item){
        		var result = self.get("result");
        		var find = _.find(result,function(contact){
        			return contact.contactID == item.contactID;
        		});
                if(find){
                    html += "<div class = 'crm-select-contacts-colleague crm-select-contacts-colleague-selected fn-left fn-clear' data-value = '"+item.contactID+"' data-name ='"+item.name+"'  data-post = '"+item.post+"' data-department = '"+item.department+"' data-company = '"+item.company+"' data-picturePath = '"+item.picturePath+"'>";    
                }else{
                    html += "<div class = 'crm-select-contacts-colleague fn-left fn-clear' data-value = '"+item.contactID+"' data-name ='"+item.name+"' data-post = '"+item.post+"' data-department = '"+item.department+"' data-company = '"+item.company+"' data-picturePath = '"+item.picturePath+"'>";
                }
        		html += "<img src ='"+util.getAvatarLink(item.picturePath, '2')+"' class = 'crm-select-contacts-colleague-img' data-value = '"+item.contactID+"' data-name ='"+item.name+"' data-picturePath = '"+item.picturePath+"' />";
                html += "<div class = 'crm-select-contacts-colleague-info'><div class = 'crm-select-contacts-colleague-name fn-text-overflow' title = '"+item.name+"'>"+item.name+"</div>";
                html += "<div class = 'crm-select-contacts-colleague-department fn-text-overflow' title = '"+item.post+"&nbsp;"+item.department+"'>"+item.post+"&nbsp;"+item.department+"</div></div><div class = 'crm-select-contacts-colleague-select fn-hide fn-right'>&nbsp;</div>";
                html += "<div class = 'crm-select-contacts-colleague-company fn-clear fn-text-overflow' title = '"+item.company+"'>"+item.company+"</div></div>";
        	});
        	$(".crm-select-contacts-result-container",this.element).html(html);
        },
        
        "_showSelected":function(e){
            if(this.get("needToRest")){
            	return;
            }
            this.set("needToRest",true);
            $(".crm-select-contacts-search-box",this.element).css("width", $(".crm-select-contacts-search-box",this.element).width() - 103);
        	$(".crm-select-contacts-search-input",this.element).css("width",$(".crm-select-contacts-search-input",this.element).width() - 103);
            $(".crm-select-contacts-unselect-all",this.element).show();
            $(".crm-select-contacts-result-box",this.element).hide();
            $(".crm-select-contacts-result-selected-box",this.element).show();
            
        },

        //取消选择
        "_unselectAll":function(e){
        	var result = this.get("result");
			$(".crm-contacts-multiselect-info",this.element).hide();
            $(".crm-contacts-multiselect-number",this.element).text(0);
        	_.each(result,function(item){
        		$("[data-value="+item.contactID+"]",$(".crm-select-contacts-result-box",this.element)).removeClass("crm-select-contacts-colleague-selected");
        	});
        	this.set("result",[]);
            this._toSelecting();
            $(".crm-select-contacts-result-selected-box",this.element).empty()
        },

        //跳转至选择页
        "_toSelecting":function(){
        	if(!this.get("needToRest")){
        		return;
        	}
            this.set("needToRest",false);
        	$(".crm-select-contacts-search-box",this.element).css("width", $(".crm-select-contacts-search-box",this.element).width() + 103);
        	$(".crm-select-contacts-search-input",this.element).css("width",$(".crm-select-contacts-search-input",this.element).width() + 103);
        	$(".crm-select-contacts-unselect-all",this.element).hide();
        	$(".crm-select-contacts-result-selected-box",this.element).hide();
            $(".crm-select-contacts-result-box",this.element).show();
            
        },

        //搜索
        "_onButtonClick":function(e){
        	var condition = this.get("condition");
        	condition.keyword = $(".crm-select-contacts-search-input",this.element).val();
        	this.set("condition",condition);
            this._toSelecting();
        	this._getData(condition);
        },

        //回车事件
        "_onButtonKeydown":function(e){
            var keyCode = e.which;
            if (keyCode != 13){
                return;
            }else{
                this._onButtonClick();
                e.preventDefault();
            }
            
        },
        //选人事件
        "_onColleageClick":function(e){
        	var result = this.get("result");
            //unselect
            if($(e.currentTarget).hasClass("crm-select-contacts-colleague-selected")){
                    $(e.currentTarget).removeClass("crm-select-contacts-colleague-selected");
                    result =_.filter(result,function(item){
                        return item.contactID != $(e.currentTarget).attr("data-value");
                    });
                    $("[data-value="+$(e.currentTarget).attr("data-value")+"]",$(".crm-select-contacts-result-selected-box",this.element)).remove();
                    $("[data-value="+$(e.currentTarget).attr("data-value")+"]",$(".crm-select-contacts-result-box",this.element)).removeClass("crm-select-contacts-colleague-selected");
            }else{//select
                $(e.currentTarget).addClass("crm-select-contacts-colleague-selected");
                result.push({"contactID":$(e.currentTarget).attr("data-value"),"name":$(e.currentTarget).attr("data-name"),"post":$(e.currentTarget).attr("data-post"),"company":$(e.currentTarget).attr("data-company"),"department":$(e.currentTarget).attr("data-department"),"picturePath":$(e.currentTarget).attr("data-picturePath")});
                $(".crm-select-contacts-result-selected-box",this.element).append($(e.currentTarget).clone(true));
            }
            this.set("result",result);
            if(result.length > 0 ){
                $(".crm-contacts-multiselect-info",this.element).show();
            }
            if(result.length <= 0 ){
                $(".crm-contacts-multiselect-info",this.element).hide();
                this._toSelecting();
            }
            $(".crm-contacts-multiselect-number",this.element).text(result.length);
        },
        
        //选人鼠标浮动事件
        "_onColleageMouseOver":function(e){
        	if(!$(e.currentTarget).hasClass("crm-select-contacts-colleague-active") && $(e.currentTarget).hasClass("crm-select-contacts-colleague")){
                $(e.currentTarget).addClass("crm-select-contacts-colleague-active");
            }
        },
        //选人鼠标移出事件
        "_onColleageMouseOut":function(e){
        	if($(e.currentTarget).hasClass("crm-select-contacts-colleague-active")){
                $(e.currentTarget).removeClass("crm-select-contacts-colleague-active");
            }
        },
        //提交事件
        "_submit":function(e){
        	this.trigger("selected",this.get("result"));
        	this.hide();
        },
        //取消
        "_cancel":function(e){
        	this.hide();
        },

        "destroy":function(){
            var result;
            this.reset();
            result=SelectContacts.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = SelectContacts;
});