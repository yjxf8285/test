define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util'),
	Pagination=require('uilibs/pagination2');
    var tpl = require('modules/crm-select-colleague/crm-select-colleague.html');
//    var tplStyle = require('modules/crm-select-colleague/crm-select-colleague.css');
	var SelectColleague = Dialog.extend({
		/*customize attrs
		   title
		   *isMultiSelect
		   hasDeptTree
		   hasWorkLeaveBtn
		   defaultCondition
		*/
		"attrs":{
			"title":"选择同事",
			"content": tpl,
			"isMultiSelect":false,
			"hasDeptTree":false,
			"hasWorkLeaveBtn":false,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
			"width":1080,
			"height":695,
			"condition":{},
			"needToRest":false,
			"defaultCondition":{
				"queryType":0,
				"isFirstChar":false,
				"keyword":"",
				"circleID":-1,
				"exceptEmployeeIDs":"",
				"isStop":false,
				"pageSize":20,
				"pageNumber":1
			},
			"result":[]
		},

		setup:function(){
            var result=SelectColleague.superclass.setup.apply(this,arguments);
            //this.set("content",this._getTemplate());
            var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
            this.set("condition",copyDefaultCondition);
            return result;
        },

		"render": function () {
            var result = SelectColleague.superclass.render.apply(this, arguments);
            this._initOthers();
            return result;
        },
        //隐藏
        "hide": function () {
            var result = SelectColleague.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (condition) {
            var result = SelectColleague.superclass.show.apply(this, arguments);
            if(condition){
                var currentCondition = this.get("condition");
                _.extend(currentCondition, condition);
                this.set("condition",currentCondition);
            }
            this._getData(this.get("condition"));
            return result;
        },

        //重置
        //@param isdestroy 
        "reset":function(isdestroy){
        	if(!isdestroy) {
        		this._unselectAll();
        	}
        	$(".fs-col-select-search-input",this.element).val("");
        	$(".fs-col-select-unselect-all",this.element).hide();
        	var copyDefaultCondition = util.deepClone(this.get("defaultCondition"));
        	this.set("condition",copyDefaultCondition);
        	this.pagination && (this.pagination.reset());
        },

        "events":{
        	'click .fs-col-multiselect-info': '_showSelected',
        	'click button.fs-col-select-unselect-all': '_unselectAll',
        	'click .fs-col-select-search-button': '_onButtonClick',
            'keydown .fs-col-select-search-input':'_onButtonKeydown',
            'change .fs-col-select-search-input':'_inputChange',
        	'click .fs-col-select-button-group1': '_onWorkingButtonClick',
        	'mouseover .fs-col-select-button-group1': '_onButtonGroupMouseOver',
        	'mouseout .fs-col-select-button-group1': '_onButtonGroupMouseOut',
        	'click .fs-col-select-button-group2': '_onLeaveButtonClick',
        	'mouseover .fs-col-select-button-group2': '_onButtonGroupMouseOver',
        	'mouseout .fs-col-select-button-group2': '_onButtonGroupMouseOut',
        	'click .fs-col-select-colleague': '_onColleageClick',
        	'mouseover .fs-col-select-colleague': '_onColleageMouseOver',
        	'mouseout .fs-col-select-colleague': '_onColleageMouseOut',
        	'click .fs-col-select-button-ok': '_submit',
        	'click .fs-col-select-button-cancel': '_cancel'
        },

        //初始化其他元素
        "_initOthers":function(){
        	if(this.get("hasWorkLeaveBtn")){
        		$(".fs-col-select-button-group-box",this.element).show();
        		$(".fs-col-select-search-box",this.element).css("width",748);
        		$(".fs-col-select-search-input",this.element).css("width",676);
        	}
        	if(this.get("isMultiSelect")){
        		$(".fs-col-multiselect-info-container",this.element).show();
        		$(".fs-col-select-button-ok",this.element).show();
        	}else{
        		$(".fs-col-multiselect-info-container",this.element).hide();
        		$(".fs-col-select-button-ok",this.element).hide();
        	}
        	if(this.get("defaultCondition").isStop){
        		$(".fs-col-select-button-group2",this.element).addClass("fs-col-select-button-group-selected");
        		$(".fs-col-select-button-group1",this.element).removeClass("fs-col-select-button-group-selected");
        	}else{
        		$(".fs-col-select-button-group1",this.element).addClass("fs-col-select-button-group-selected");
        		$(".fs-col-select-button-group2",this.element).removeClass("fs-col-select-button-group-selected");
        	}
            if(this.get("title")){
                $(".fs-col-select-title",this.element).text(this.get("title"));
            }
        	var self = this;
        	self.pagination=new Pagination({
            "element":$('.fs-col-select-result-pagination',self.element),
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
                'url': '/Employee/GetEmployeesForSearch',
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                    	return;
                    }
                self._getColleagueHtml(responseData.value.employees,responseData.value.totalCount);
                }
            });
        },

        //获取html
        "_getColleagueHtml":function(colleague,totle){
        	var html = "";
        	var self = this;
        	if(!colleague){
        		return html;
        	}
        	if(totle >= 0){
        		this.pagination.setTotalSize(totle);
        	}
        	$(".fs-col-select-result-container",this.element).empty();
        	_.each(colleague,function(item){
        		var result = self.get("result");
        		var find = _.find(result,function(employee){
        			return employee.employeeID == item.employeeID;
        		});
        		if(find){
        			html += "<div class = 'fs-col-select-colleague fs-col-select-colleague-selected fn-left fn-clear' data-value = '"+item.employeeID+"' data-name ='"+item.name+"' data-profileImage = '"+item.profileImage+"'>";
        		}else{
        			html += "<div class = 'fs-col-select-colleague fn-left fn-clear' data-value = '"+item.employeeID+"' data-name ='"+item.name+"' data-profileImage = '"+item.profileImage+"'>";
        		}
        		html += "<img src ='"+util.getAvatarLink(item.profileImage, 1)+"' class = 'fs-col-select-colleague-img' data-value = '"+item.employeeID+"' data-name ='"+item.name+"' data-profileImage = '"+item.profileImage+"' />&nbsp;&nbsp;"+item.name+"</div>";
        	});
        	$(".fs-col-select-result-container",this.element).html(html);
        	$(".fs-col-select-result-box",this.element).show();
            $(".fs-col-select-result-selected-box",this.element).hide();
            self.set("needToRest",false);
        },
        
        "_showSelected":function(e){
        	if($(e.currentTarget).hasClass("fs-col-multiselect-info-disable")){
                return;
            }
            if(this.get("needToRest")){
            	return;
            }
            this.set("needToRest",true);
            $(".fs-col-select-search-box",this.element).css("width", $(".fs-col-select-search-box",this.element).width() - 103);
        	$(".fs-col-select-search-input",this.element).css("width",$(".fs-col-select-search-input",this.element).width() - 103).val('');
            $(".fs-col-select-unselect-all",this.element).show();
            $(".fs-col-select-result-box",this.element).hide();
            $(".fs-col-select-result-selected-box",this.element).show();
            
        },

        //取消选择
        "_unselectAll":function(e){
        	var result = this.get("result");
        	if($(".fs-col-multiselect-info",this.element).hasClass("fs-col-multiselect-info-active")){
    			$(".fs-col-multiselect-info",this.element).addClass("fs-col-multiselect-info-disable");
    			$(".fs-col-multiselect-info",this.element).removeClass("fs-col-multiselect-info-active");
    		}
            $(".fs-col-multiselect-number",this.element).text(0);
        	_.each(result,function(item){
        		$("[data-value="+item.employeeID+"]",$(".fs-col-select-result-box",this.element)).removeClass("fs-col-select-colleague-selected");
        	});
        	this.set("result",[]);
            this._toSelecting();
            $(".fs-col-select-result-selected-box",this.element).empty()
            var condition = this.get('condition') || {};
        	condition.keyword = $.trim($(".fs-col-select-search-input",this.element).val()) || '';
        	condition.pageNumber = 1;
        	this.set('condition', condition);
            this._getData(condition);
        },

        //跳转至选择页
        "_toSelecting":function(){
        	if(!this.get("needToRest")){
        		return;
        	}
            this.set("needToRest",false);
        	$(".fs-col-select-search-box",this.element).css("width", $(".fs-col-select-search-box",this.element).width() + 103);
        	$(".fs-col-select-search-input",this.element).css("width",$(".fs-col-select-search-input",this.element).width() + 103);
        	$(".fs-col-select-unselect-all",this.element).hide();
        	$(".fs-col-select-result-selected-box",this.element).hide();
            $(".fs-col-select-result-box",this.element).show();
            
        },

        //搜索
        "_onButtonClick":function(e){
        	var condition = this.get("condition");
            var keyword = $.trim($(".fs-col-select-search-input",this.element).val());
            if(keyword > 200){
                keyword = keyword.substr(0,200);
            }
        	condition.keyword = keyword;
        	this.set("condition",condition);
        	this._getData(condition);
        },

        //回车事件
        "_onButtonKeydown":function(e){
            var currentTarget = $(e.currentTarget);
            var keyword = currentTarget.val();
            if(keyword.length > 200){
                currentTarget.val(keyword.substr(0,200));
            }
            var keyCode = e.which;
            if (keyCode != 13){
                return;
            }else{
                this._onButtonClick();
                e.preventDefault();
            }
            
        },

        "_inputChange":function(e){
            var currentTarget = $(e.currentTarget);
            var keyword = currentTarget.val();
            if(keyword.length > 200){
                currentTarget.val(keyword.substr(0,200));
            }
        },

        //在职状态
        "_onWorkingButtonClick":function(e){
        	var condition = this.get("condition");
        	if(!condition.isStop){
        		return;
        	}
        	condition.isStop = false;
        	if(!$(e.currentTarget).hasClass("fs-col-select-button-group-selected")){
                $(e.currentTarget).addClass("fs-col-select-button-group-selected");
            }
            if($(".fs-col-select-button-group2",this.element).hasClass("fs-col-select-button-group-selected")){
                $(".fs-col-select-button-group2").removeClass("fs-col-select-button-group-selected");
            }
        	this.set("condition",condition);
        	this._getData(condition);
        },

        //离职状态
        "_onLeaveButtonClick":function(e){
        	var condition = this.get("condition");
        	if(condition.isStop){
        		return;
        	}
        	condition.isStop = true;
        	if(!$(e.currentTarget).hasClass("fs-col-select-button-group-selected")){
                $(e.currentTarget).addClass("fs-col-select-button-group-selected");
            }
            if($(".fs-col-select-button-group1",this.element).hasClass("fs-col-select-button-group-selected")){
                $(".fs-col-select-button-group1").removeClass("fs-col-select-button-group-selected");
            }
        	this.set("condition",condition);
        	this._getData(condition);
        },

        //在职，离职鼠标浮动事件
        "_onButtonGroupMouseOver":function(e){
        	if(!$(e.currentTarget).hasClass("fs-col-select-button-group-active")){
                $(e.currentTarget).addClass("fs-col-select-button-group-active");
            }
        },

        //在职，离职鼠标移出事件
        "_onButtonGroupMouseOut":function(e){
        	if($(e.currentTarget).hasClass("fs-col-select-button-group-active")){
                $(e.currentTarget).removeClass("fs-col-select-button-group-active");
            }
        },
        //选人事件
        "_onColleageClick":function(e){
        	var isMultiSelect = this.get("isMultiSelect");
        	var result = this.get("result");
        	if(isMultiSelect){
        		this._multiSelect(e);
        	}else{
        		result.push({"employeeID":$(e.currentTarget).attr("data-value"),"name":$(e.currentTarget).attr("data-name"),"profileImage":$(e.currentTarget).attr("data-profileImage")});
        		this.set("result",result);
        		this._submit(e);
        	}
        },
        //多选状态更新
        "_multiSelect":function(e){
        	var result = this.get("result");
        	//unselect
        	if($(e.currentTarget).hasClass("fs-col-select-colleague-selected")){
        			$(e.currentTarget).removeClass("fs-col-select-colleague-selected");
        			result =_.filter(result,function(item){
        				return item.employeeID != $(e.currentTarget).attr("data-value");
        			});
        			$("[data-value="+$(e.currentTarget).attr("data-value")+"]",$(".fs-col-select-result-selected-box",this.element)).remove();
        			$("[data-value="+$(e.currentTarget).attr("data-value")+"]",$(".fs-col-select-result-box",this.element)).removeClass("fs-col-select-colleague-selected");
        	}else{//select
        		$(e.currentTarget).addClass("fs-col-select-colleague-selected");
    			result.push({"employeeID":$(e.currentTarget).attr("data-value"),"name":$(e.currentTarget).attr("data-name"),"profileImage":$(e.currentTarget).attr("data-profileImage")});
    			$(".fs-col-select-result-selected-box",this.element).append($(e.currentTarget).clone(true));
    		}
    		this.set("result",result);
    		if(result.length > 0 && $(".fs-col-multiselect-info",this.element).hasClass("fs-col-multiselect-info-disable")){
    			$(".fs-col-multiselect-info",this.element).removeClass("fs-col-multiselect-info-disable");
    			$(".fs-col-multiselect-info",this.element).addClass("fs-col-multiselect-info-active");
    		}
    		if(result.length <= 0 && $(".fs-col-multiselect-info",this.element).hasClass("fs-col-multiselect-info-active")){
    			$(".fs-col-multiselect-info",this.element).addClass("fs-col-multiselect-info-disable");
    			$(".fs-col-multiselect-info",this.element).removeClass("fs-col-multiselect-info-active");
    			this._toSelecting();
    		}
    		$(".fs-col-multiselect-number",this.element).text(result.length);
        },
        //选人鼠标浮动事件
        "_onColleageMouseOver":function(e){
        	if(!$(e.currentTarget).hasClass("fs-col-select-colleague-active") && $(e.currentTarget).hasClass("fs-col-select-colleague")){
                $(e.currentTarget).addClass("fs-col-select-colleague-active");
            }
        },
        //选人鼠标移出事件
        "_onColleageMouseOut":function(e){
        	if($(e.currentTarget).hasClass("fs-col-select-colleague-active")){
                $(e.currentTarget).removeClass("fs-col-select-colleague-active");
            }
        },
        //提交事件
        "_submit":function(e){
        	if(this.get("isMultiSelect")){
        		this.trigger("selected",this.get("result"));
        	}else{
        		this.trigger("selected",this.get("result")[0]);
        	}
        	this.hide();
        },
        //取消
        "_cancel":function(e){
        	this.hide();
        },

        "destroy":function(){
            var result;
            this.reset(true);
            result=SelectColleague.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = SelectColleague;
});