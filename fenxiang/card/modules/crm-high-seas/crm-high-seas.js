/**
 * 公海选择框
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

  define(function(require, exports, module){
 	var root = window,
        FS = root.FS;
        navTpl = FS.tpl;
 	var Widget=require('widget');
 	var tpl = require('modules/crm-high-seas/crm-high-seas.html');
////    var tplStyle = require('modules/crm-high-seas/crm-high-seas.css');
    var CreateDialog = require('modules/crm-highsea-editsetting/crm-highsea-editsetting');
    var util = require('util');
 	var Seas = Widget.extend({
 		"attrs":{
 			"api":"/HighSeas/GetAllHighSeas",
 			"type":"all",//all and mine
            "navClass":".nav-highseas",
 			"condition":{},
 			"canCreate":true,
            "createDialog":null,
            "url":"#crmsettings/highseas/"
 		},

 		"events":{
 			"click .crm-high-seas-create":"_create",
 			"click .crm-high-seas-container-ul li":"_showList"
 		},

 		"setup":function(){
 			var result = Seas.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		"_init":function(){
 			$(this.element).html(tpl);
 			this._getData(this.get("condition"));
            util.regGlobalClick($('.crm-high-seas-container', this.element));
            this._initCreateDialog();
            //this._initEvent();
 		},

        "_initEvent":function(){
            var self = this;
            $(document).on("click",function(e){
                if ($(e.target).is('.crm-high-seas-create') || $(e.target).is('.crm-high-seas-to-list')|| $(e.target).is(self.get("navClass"))){
                    return;
                }
                $(".crm-high-seas-container",$(self.element)).hide();
            });
        },

        "_initCreateDialog":function(){
            var self = this;
            var createDialog = new CreateDialog();
            createDialog.on("addSuccess",function(value){
                self.refresh();
                navTpl.navRouter.navigate('#crmsettings/highseas/=/param-' + encodeURIComponent(JSON.stringify(value)), { trigger: true });
            });
            this.set("createDialog",createDialog);
        },

 		"_create":function(){
 			this.get("createDialog").show();
 		},

 		"_getData":function(condition){
 			var self = this;
            
            util.api({
                'url': this.get("api"),
                'type': 'get',
                "dataType": 'json',
                'data': condition,
                'success': function (responseData) {
                    if(!responseData.success){
                        return;
                    }
                   	self._generateHtml(responseData.value.highSeas);
                }
            });
        },


        "_generateHtml":function(highSeas){
            var self = this;
        	var html = "";
            var param = util.getTplQueryParams2()
        	var id = 0;
            if(param){
                id = param.id;
            }

            if(highSeas.length<1){
                $(".crm-no-high-seas",this.element).show();
            }else{
                $(".crm-no-high-seas",this.element).hide();
            }
        	_.each(highSeas,function(item){
        		var myClass = "";
        		if(id == item.highSeasID){
        			myClass = "crm-high-seas-active";
        		}
                var param = {
                    id: item.highSeasID,
                    name: item.name
                };
                var paramStr = encodeURIComponent(JSON.stringify(param));
        		html += "<li class = "+myClass+"><a class = 'crm-high-seas-to-list' href = "+self.get("url")+"=/param-"+paramStr+" data-value = '"+item.highSeasID+"'><div class = 'crm-high-seas-to-list-font fn-text-overflow' title = '"+item.name+"'>"+item.name+"</div></a></li>";
        	});
        	$(".crm-high-seas-container-ul",$(this.element)).html(html);
        	if(this.get("canCreate") && $(".crm-high-seas-create-ul",this.element).length < 1){
        		var createLink = "<ul class = 'crm-high-seas-create-ul'><li><a class = 'crm-high-seas-create'>新建公海...</a></li></ul>"
        		$(".crm-high-seas-container",$(this.element)).append(createLink);
        	}
        },

        "_showList":function(e){
        	var currentEl = $(e.currentTarget);
        	$(".crm-high-seas-active",$(this.element)).removeClass("crm-high-seas-active");
        	currentEl.addClass("crm-high-seas-active");
        	$(".crm-high-seas-container",$(this.element)).hide();
        },

        "show":function(e){
            var param = util.getTplQueryParams2()
            var id = 0;
            if(param){
                id = param.id;
            }
            if($(".crm-high-seas-active a",this.element).attr("data-value") != id){
                $(".crm-high-seas-active",this.element).removeClass("crm-high-seas-active");
            }
        	var currentEl = $(e.currentTarget);
        	$(".crm-high-seas-container",$(this.element)).css({"left":currentEl.offset().left+currentEl.width()+1,"top":currentEl.offset().top-1});
        	$(".crm-high-seas-container",$(this.element)).toggle();
        },

        "hide":function(){
            $(".crm-high-seas-container",$(this.element)).hide();
        },

        "refresh":function(){
        	this._getData(this.get("condition"));
        },

 		"destroy":function(){
 			var result = Seas.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Seas;
 });