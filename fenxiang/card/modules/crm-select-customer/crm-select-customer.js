define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util'),
	Pagination=require('uilibs/pagination2');
    var tpl = require('modules/crm-select-customer/crm-select-customer.html');
//    var tplStyle = require('modules/crm-select-customer/crm-select-customer.css');
	var SelectCustomer = Dialog.extend({
		/*customize attrs
		   title
		   defaultCondition
		*/
		"attrs":{
			"title":"选择客户",
            "url":"/FCustomer/GetFCustomers/",
			"content": tpl,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
			"width":800,
			"height":600,
			"condition":{},
			"needToRest":false,
			"defaultCondition":{
                "employeeID":2,//int，员工ID
				"isFirstChar":false,// bool，是否首字母查询
                //"ownerIDs"[],//
                "listTagOptionID":"",//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                "sortType":2,//int，排序规则(按照最后更新时间或者关注时间倒序=1；按照客户nameSpell、Name正排序=2;先按照归属人nameSpell、Name正排，再按照客户的最后变化时间倒排，当前用户的客户排列在前面=3)
                "queryType":2,//int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;)
				"keyword":"",
				"pageSize":12,
				"pageNumber":1
			},
			"result":[]
		},

		setup:function(){
            var result=SelectCustomer.superclass.setup.apply(this,arguments);
            //this.set("content",this._getTemplate());
            var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
            this.set("condition",copyDefaultCondition);
            return result;
        },

		"render": function () {
            var result = SelectCustomer.superclass.render.apply(this, arguments);
            this._initOthers();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = SelectCustomer.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (val) {
            var result = SelectCustomer.superclass.show.apply(this, arguments);
            var condition = this.get("condition");
            if(val){
                condition.keyword = val;
                $(".crm-select-customer-search-input",this.element).val(val);
                this.set("condition",condition);
            }
            this._getData(condition);
            return result;
        },

        //重置
        "reset":function(){
        	$(".crm-select-customer-search-input",this.element).val("");
        	var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
        	this.set("condition",copyDefaultCondition);
        },

        "events":{
        	'click .crm-select-customer-search-button': '_onButtonClick',
            'click .crm-select-customer-clean-keywords': '_cleanKeywords',
            'keydown .crm-select-customer-search-input':'_onButtonKeydown',
        	'click .crm-select-customer-colleague': '_onColleageClick',
        	'mouseover .crm-select-customer-colleague': '_onColleageMouseOver',
        	'mouseout .crm-select-customer-colleague': '_onColleageMouseOut',
        	'click .crm-select-customer-button-cancel': '_cancel'
        },

        //初始化其他元素
        "_initOthers":function(){
        	
            if(this.get("title")){
                $(".crm-select-customer-title").text(this.get("title"));
            }
        	var self = this;
        	self.pagination=new Pagination({
            "element":$('.crm-select-customer-result-pagination',self.element),
            "pageSize":self.get("condition").pageSize,
            "totalSize":0,
            "activePageNumber":1
            });
            self.pagination.on("page",function(val){
            	var condition = self.get("condition");
            	condition.pageNumber = val;
            	self.set("condition",condition);
            	self._getData(condition);
            })
        },

        //获取数据
        "_getData":function(condition){
        	var self = this;
        	util.api({
                'url': this.get("url"),
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                    	return;
                    }
                    self._getColleagueHtml(responseData.value.customers,responseData.value.totalCount);
                }
            },{
                "mask":self.element,
                "maskCls":"self-cls"
            });
        },

        "_cleanKeywords":function(){
            var condition = this.get("condition");
            condition.keyword = "";
            $(".crm-select-customer-search-input",this.element).val("");
            this.set("condition",condition);
            this._getData(condition);
        },

        //获取html
        "_getColleagueHtml":function(customers,totle){
        	var html = "";
        	var self = this;
            if(totle < 1){
                $(".crm-select-customer-no-result",this.element).show();
                $(".crm-select-customer-result-container",this.element).hide();
            }else{
                $(".crm-select-customer-no-result",this.element).hide();
                $(".crm-select-customer-result-container",this.element).show();
            }
        	if(!customers){
        		return html;
        	}
        	if(totle >= 0){
        		this.pagination.setTotalSize(totle);
        	}
        	$(".crm-select-customer-result-container",this.element).empty();
        	_.each(customers,function(item){
        		var result = self.get("result");
        		var find = _.find(result,function(contact){
        			return contact.customerID == item.customerID;
        		});
                if(find){
                    html += "<div class = 'crm-select-customer-colleague crm-select-customer-colleague-selected fn-left fn-clear' data-value = '"+item.customerID+"' data-name ='"+item.name+"'>";    
                }else{
                    html += "<div class = 'crm-select-customer-colleague fn-left fn-clear' data-value = '"+item.customerID+"' data-name ='"+item.name+"'>";
                }
        		
                html += "<div class = 'crm-select-customer-name fn-text-overflow' title = '"+item.name+"'>"+item.name+"</div>";
                html += "<div class = 'crm-select-customer-owner fn-text-overflow' title = '"+item.ownerName+"'>归属人："+item.ownerName+"</div></div>"
        	});
        	$(".crm-select-customer-result-container",this.element).html(html);
        },
        
        "_showSelected":function(e){
            if(this.get("needToRest")){
            	return;
            }
            this.set("needToRest",true);
            $(".crm-select-customer-search-box",this.element).css("width", $(".crm-select-customer-search-box",this.element).width() - 103);
        	$(".crm-select-customer-search-input",this.element).css("width",$(".crm-select-customer-search-input",this.element).width() - 103);
            $(".crm-select-customer-unselect-all",this.element).show();
            $(".crm-select-customer-result-box",this.element).hide();
            $(".crm-select-customer-result-selected-box",this.element).show();
            
        },

        //跳转至选择页
        "_toSelecting":function(){
        	if(!this.get("needToRest")){
        		return;
        	}
            this.set("needToRest",false);
        	$(".crm-select-customer-search-box",this.element).css("width", $(".crm-select-customer-search-box",this.element).width() + 103);
        	$(".crm-select-customer-search-input",this.element).css("width",$(".crm-select-customer-search-input",this.element).width() + 103);
        	$(".crm-select-customer-unselect-all",this.element).hide();
        	$(".crm-select-customer-result-selected-box",this.element).hide();
            $(".crm-select-customer-result-box",this.element).show();
            
        },

        //搜索
        "_onButtonClick":function(e){
        	var condition = this.get("condition");
        	condition.keyword = $(".crm-select-customer-search-input",this.element).val();
        	this.set("condition",condition);
        	this._getData(condition);
        },

        //回车事件
        "_onButtonKeydown":function(e){
            if(!e){
                return;
            }
            var keyCode = e.which;
            if (keyCode != 13){
                return;
            }else{
                e.preventDefault();
                this._onButtonClick();
            }
            
        },
        //选人事件
        "_onColleageClick":function(e){
            this.trigger("selected",{"customerID":$(e.currentTarget).attr("data-value"),"name":$(e.currentTarget).attr("data-name")});
            this.hide();
        },
        
        //选人鼠标浮动事件
        "_onColleageMouseOver":function(e){
        	if(!$(e.currentTarget).hasClass("crm-select-customer-colleague-active") && $(e.currentTarget).hasClass("crm-select-customer-colleague")){
                $(e.currentTarget).addClass("crm-select-customer-colleague-active");
            }
        },
        //选人鼠标移出事件
        "_onColleageMouseOut":function(e){
        	if($(e.currentTarget).hasClass("crm-select-customer-colleague-active")){
                $(e.currentTarget).removeClass("crm-select-customer-colleague-active");
            }
        },
        
        //取消
        "_cancel":function(e){
        	this.hide();
        },

        "destroy":function(){
            var result;
            this.reset();
            result=SelectCustomer.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = SelectCustomer;
});