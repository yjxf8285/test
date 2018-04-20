/**
 * 下属选择器
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
 	var root = window,
        FS = root.FS,
        util=require('util');
 	var Widget=require('widget');
 	var tpl = require('modules/crm-subordinate-select/crm-subordinate-select.html');
//    var tplStyle = require('modules/crm-subordinate-select/crm-subordinate-select.css');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var Subordinate = Widget.extend({
    	"attrs":{
    		"element":null,
    		"imageSrc":"",
    		"employeeName":"",
    		"employeeID":util.getCrmData().currentEmp.employeeID,
    		"selectColleague":null,
            "canSelect":true,
            "selectedEmployeeID":0
    	},
    	"events":{
    		"click .crm-subordinate-select-container":"_showSelecter"
    	},
    	"setup":function(){
    		var result = Subordinate.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
    	},
    	"_init":function(){
    		this.element.html(tpl);
            this.set("selectedEmployeeID",this.get("employeeID"));
    		this._setHtml();
    		this._initSelectColleague();
    	},

        "reset":function(employee){
            this.set("imageSrc",util.getAvatarLink(employee.profileImage,'2'));
            this.set("employeeName",employee.employeeName);
            this._setHtml();
        },

    	"_initSelectColleague":function(){
    		var self = this;
    		var selectColleague = new SelectColleague({
	        	"isMultiSelect":false,
	            "hasWorkLeaveBtn":false,
	            "defaultCondition":{"queryType":5},
	            "title":"选择我或下属"
	        });

	        selectColleague.on("selected",function(val){
	        	self.set("imageSrc",util.getAvatarLink(val.profileImage, '2'));
	        	self.set("employeeName",val.name);
                self.set("selectedEmployeeID",val.employeeID);
	        	self._setHtml();
	        	self.trigger("selected",val);
	        });
	        self.set("selectColleague",selectColleague);
    	},

    	"_setHtml":function(){
    		var imageSrc = this.get("imageSrc");
    		var employeeName = this.get("employeeName");
    		var employeeID = this.get("employeeID");
    		$(".crm-subordinate-select-image",this.element).attr("src",imageSrc);
    		$(".crm-subordinate-select-name",this.element).text(employeeName);
            $(".crm-subordinate-select-name",this.element).attr("title",employeeName);
            if(!this.get("canSelect")){
                $(".crm-subordinate-select-guide",this.element).hide();
                $(".crm-subordinate-select-container",this.element).addClass("crm-subordinate-select-disable");
            }
    	},
    	"_showSelecter":function(){
            if(!this.get("canSelect")){
                return;
            }
    		var selectColleague = this.get("selectColleague");
            if(this.get("employeeID") == this.get("selectedEmployeeID")){
                selectColleague.set("condition",{"queryType":2,"exceptEmployeeIDs":this.get("selectedEmployeeID")})
            }else{
                selectColleague.set("condition",{"queryType":5,"exceptEmployeeIDs":this.get("selectedEmployeeID")})
            }
    		selectColleague.show();
    	}
    });
    module.exports = Subordinate;
 });