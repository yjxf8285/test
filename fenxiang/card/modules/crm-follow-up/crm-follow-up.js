/**
 * 联合跟进人
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
    var root = window,
         FS = root.FS;
    var Widget=require('widget');
    var tpl = require('modules/crm-follow-up/crm-follow-up.html');
////    var tplStyle = require('modules/crm-follow-up/crm-follow-up.css');
    var util = require('util');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
 	var FollowUp = Widget.extend({
 		"attrs":{
 			"element":null,
            "title":"联合跟进人",
 			"items":[],
            "addApi":'/FCustomer/AddFCustomersCombineSalers',
            "deleteApi":"",
            "parameter":{
                "customerIDs":0,
                "employeeIDs":""
            },
            "typeName":"客户",
            "name":"联合跟进人",
            "selectColleague":null
 		},

 		"events":{
 			"click .crm-follow-up-add":"_showDialog",
            "click .crm-follow-up-image":"_delete"
 		},

 		"setup":function(){
 			var result = FollowUp.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

        "reload":function(items){
            this.set("items",items);
            this._generateHtml();
        },

 		//重新加载
 		"replace":function(ownerID,employee){
            if(ownerID <= 0 || !employee){
                return;
            }
            var items = this.get("items");
            items = _.filter(items,function(item){
                return item.employeeID != ownerID;
            });
            var find = _.find(items,function(item){
                return item.employeeID == employee.employeeID;
            });
            var ownerEl = $("[data-value="+ownerID+"]", this.element);
            if(!find){
                items.push(employee);
                this.set("items",items);
                ownerEl.attr("src",util.getAvatarLink(employee.profileImage, '2'));
                ownerEl.attr("data-value",employee.employeeID);
                ownerEl.attr("data-name",employee.name);
                ownerEl.attr("data-profileImage",employee.profileImage);
                ownerEl.parent().attr("title",employee.name);
            }else{
                ownerEl.parent().remove();
            }
            this.set('ownerID', employee.employeeID);
 		},

        "_showDialog":function(){
            var selectColleague = this.get("selectColleague");
            var condition = selectColleague.get("condition");
            condition.exceptEmployeeIDs = this._getExceptEmployeeIDs();
            selectColleague.set("condition",condition);
            selectColleague.show();
        },
        
 		//初始化
 		"_init":function(){
            this.element.html(tpl);
            $(".crm-follow-up-info",this.element).text(this.get("typeName")+"的查看权限为"+this.get("name")+"及全部上级");
            $(".crm-follow-up-title",this.element).text(this.get("title"));
            this._initColleague();
            this._generateHtml();
 		},

        "_initColleague":function(){
            var self = this;
            var selectColleague = new SelectColleague({
                "isMultiSelect":true,
                "hasWorkLeaveBtn":false,
                "title":self.get('addWinTitle') ||"选择联合跟进人",
                "defaultCondition":{
                    "queryType":0,
                    "isFirstChar":false,
                    "keyword":"",
                    "circleID":-1,
                    "exceptEmployeeIDs":this._getExceptEmployeeIDs(),
                    "isStop":false,
                    "pageSize":20,
                    "pageNumber":1
                }
            });
            selectColleague.on("selected",function(val){
                if(!val || val.length < 1){
                    return;
                }
                var parameter = self.get("parameter");
                var employeeIDs = [];
                _.each(val,function(item){
                    employeeIDs.push(item.employeeID);
                });
                parameter.employeeIDs = employeeIDs;
                util.api({
                    'url': self.get("addApi"),
                    'type': 'post',
                    "dataType": 'json',
                    'data': parameter,
                    'success': function (responseData) {
                        if(!responseData.success){
                            return;
                        }
                        var items = self.get("items");
                        items = items.concat(val);
                        self.set("items",items);
                        self._generateHtml();
                    }
                });
            });
            this.set("selectColleague",selectColleague);
        },

        "_getExceptEmployeeIDs":function(){
            var exceptEmployeeIDs = [];
            var items = this.get("items");
            _.each(items,function(item){
                exceptEmployeeIDs.push(item.employeeID);
            });
            return exceptEmployeeIDs.join(',');
        },

 		//生成html
 		"_generateHtml":function(){
            var items = this.get("items");
            var html = "";
            _.each(items,function(item){
                html += "<div class = 'crm-follow-up-image-container fn-left' title = '"+item.name+"'>";
                html += "<img src ='"+util.getAvatarLink(item.profileImage, '2')+"' class = 'crm-follow-up-image' data-value = '"+item.employeeID+"' data-name ='"+item.name+"' data-profileImage = '"+item.profileImage+"' /></div>";
            });
            html += "<div class = 'crm-follow-up-add fn-left' title ='" + (this.get('btnAddTitle')||"添加联合跟进人") + "'>+</div>";
            $(".crm-follow-up-content",this.element).html(html);
 		},

        "_delete":function(e){
            var self = this;
            var current = $(e.currentTarget);
            var name = current.attr("data-name");
            var employeeID = current.attr("data-value");
            var ownerID = self.get('ownerID');
            if(ownerID == employeeID) {
            	util.confirm(name+"是当前" + (self.get('typeName')||"客户") + "的负责人，是否要变更负责人？","变更"+self.get('typeName')+"负责人",function(){
                    self.get('selectColleagueS').show();
            	});
            } else {
            	util.confirm(name+"是当前" + (self.get('typeName')||"客户") + "的" + (self.get('name')||"联合跟进人") + "，是否将其删除？",self.get('name')||"联合跟进人",function(){
                    var parameter = self.get("parameter");
                    parameter.employeeID = employeeID;
                    parameter.customerID = parameter.customerIDs[0];
                    util.api({
                        'url': self.get("deleteApi"),
                        'type': 'post',
                        "dataType": 'json',
                        'data': parameter,
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }
                            var items = self.get("items");
                            items = _.filter(items,function(item){
                                return item.employeeID != employeeID;
                            });
                            self.set("items",items);
                            current.parent().remove();
                        }
                    });
                });
            }
        },

 		"destroy":function(){
        	this.get("selectColleague") && (this.get("selectColleague").destroy());
 			var result = FollowUp.superclass.render.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = FollowUp;
 });