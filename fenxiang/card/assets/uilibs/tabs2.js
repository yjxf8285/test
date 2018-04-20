/**
 * tab页组件2
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
 	var Widget=require('widget');
 	/*
 	item:{
		value:timeline,
		text:时间线
 	}
 	the container should have timeline-box css
 	*/
 	var Tab = Widget.extend({
 		"attrs":{
 			"element":null,
 			"container":null,
 			"items":[],
 			"defaultItem":{},
 			"active":""
 		},

 		"events":{
 			"click .crm-tab-btn":"_select",
 			'mouseover .crm-tab-btn': '_onMouseover',
 			'mouseout .crm-tab-btn': '_onMouseout'
 		},

 		"setup":function(){
 			var result = Tab.superclass.render.apply(this,arguments);
 			this._generateHtml();
 			return result;
 		},

 		"render":function(){
 			var result = Tab.superclass.render.apply(this,arguments);
 			return result;
 		},

 		//选择tab
 		"_select":function(e){
 			var curEl=$(e.currentTarget);
 			this.select(curEl.attr("data-value"));
 		},
 		"reset": function(){
 			var element = this.get("element"),
 				container = this.get("container"),
 				tabs = $('.crm-tab-btn', this.element),
 				selected = $(".crm-tab-selected",this.element);
 			if(selected){
 				var key = selected.attr("data-value");
 				$("."+key+"-box",container).hide();
 				$("."+key+"-icon",element).hide();
 				selected.removeClass("crm-tab-selected");
 			}
 			var value = tabs.eq(0).attr('data-value');
 			this.set("active", value);
 			if(!$("[data-value="+value+"]",element).hasClass("crm-tab-selected")){
 				$("[data-value="+value+"]",element).addClass("crm-tab-selected")
 			}
 			$("."+value+"-icon",element).show();
 			$("."+value+"-box",container).show();
 		},
 		//选中
 		"select":function(value){
 			var active = this.get("active"),
 				element = this.get("element"),
 				container = this.get("container");
 			if(!value || value == active){
 				return;
 			}
 			var selected = $(".crm-tab-selected",this.element);
 			if(selected){
 				var key = selected.attr("data-value");
 				$("."+key+"-box",container).hide();
 				$("."+key+"-icon",element).hide();
 				selected.removeClass("crm-tab-selected");
 			}
 			this.trigger("change",active,value);
 			this.set("active",value)
 			if(!$("[data-value="+value+"]",element).hasClass("crm-tab-selected")){
 				$("[data-value="+value+"]",element).addClass("crm-tab-selected")
 			}
 			$("."+value+"-icon",element).show();
 			$("."+value+"-box",container).show();

 		},

 		//tab页鼠标浮动事件
 		"_onMouseover":function(e){
 			var curEl=$(e.currentTarget);
 			if(!$(curEl).hasClass("crm-tab-hover")){
 				$(curEl).addClass("crm-tab-hover")
 			}
 		},
 		//tab页鼠标移出事件
 		"_onMouseout":function(e){
 			var curEl=$(e.currentTarget);
 			if($(curEl).hasClass("crm-tab-hover")){
 				$(curEl).removeClass("crm-tab-hover")
 			}
 		},
 		//生成html
 		"_generateHtml":function(){
 			var html = "",
 				element = this.get("element"),
 				container = this.get("container"),
 				defaultItem = this.get("defaultItem"),
 			    items = this.get("items");
 			if(!defaultItem.value){
 				defaultItem = items[0];
 			}
 			if(!container){
 				container = $("body");
 			}
 			html += "<ul class = 'crm-tab-menu'>";
 			_.each(items,function(item){
 				if(item.value == defaultItem.value){
 					html += "<li class = 'crm-tab-btn fn-left crm-tab-selected' data-value = '"+item.value+"'>"+item.text+"<div class = 'crm-tab-selected-icon "+item.value+"-icon'>&nbsp;</div></li>";
 					$("."+item.value+"-box",container).show();
 				}else{
 					html += "<li class = 'crm-tab-btn fn-left' data-value = '"+item.value+"'>"+item.text+"<div class = 'crm-tab-selected-icon fn-hide "+item.value+"-icon'>&nbsp;</div></li>";
 					$("."+item.value+"-box",container).hide();
 				}
 				
 			});
 			html += "<div class = 'fn-clear'></div></ul>";
 			this.set("active",defaultItem.value);
 			this.element.html(html);
 		},

 		"destroy":function(){
 			var result = Tab.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Tab;
 });