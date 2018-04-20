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
    var tpl = require('modules/crm-contact-box/crm-contact-box.html');
////    var tplStyle = require('modules/crm-contact-box/crm-contact-box.css');
    var util = require('util');
    var ContactsDialog=require('modules/crm-select-contacts/crm-select-contacts');
    var ContactView=require('modules/crm-contact-view/crm-contact-view');
    var ContactDialog = require('modules/crm-contact-edit/crm-contact-edit');
    var Operation = require('modules/crm-contact-operation/crm-contact-operation');
 	var Contact = Widget.extend({
 		"attrs":{
 			"element":null,
            "showTabContactNumEl": null,   // 显示联系人（num）的元素
            "title":"联合跟进人",
            "type":"operation",//operation or modify
            "customerID":0,//if type is modify, customerID is reqired
            "hasOperation":true,
 			"items":[],
            "combineApi":"/Contact/BatchCombineContactAndFCustomer",
            "parameter":{
                "customerID":0,
                "contactIDs":[]
            },
            "contactsDialog":null,
            "newContactDialog":null
 		},

 		"events":{
            "click .crm-contact-box-select":"_showSelectDialog",
            "click .crm-contact-box-new":"_showNewDialog",
            "click .crm-contact-box-modify":"_modify",
            "click .crm-contact-box-image":"_detailoredit",
            "click .crm-contact-box-name":"_detail"
 		},

 		"setup":function(){
 			var result = Contact.superclass.setup.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		//重新加载
 		"reload":function(items){
            if(items){
                this.set("items",items);
            }
            this._generateHtml();
 		},

        "remove":function(contactID){
            if(!contactID){
                return;
            }
            var items = _.filter(this.get("items"),function(item){
                return item.contactID != contactID;
            });
            this.set("items",items);
            this._generateHtml();
        },

        "add":function(item){
            if(!item){
                return;
            }
            var items = this.get("items");
            items.push(item);
            this.set("items",items);
            this._generateHtml();
        },

        "_showSelectDialog":function(){
            this.get("contactsDialog").show();
        },

        "_showNewDialog":function(){
            this.trigger("onNew");
        },
        
 		//初始化
 		"_init":function(){
            this.element.html(tpl);
            this._initContactsDialog();
            this._initContactView();
            this._initContactDialog();
            if(this.get("type") == "operation"){
                this._initOperation();
            }
            if(this.get("type") == "modify"){
                this._initModifyDialog();
            }
            this._generateHtml();
 		},
 		
        "_initContactsDialog":function(){
            var self = this;
            var contactsDialog = new ContactsDialog({
                "title":"给客户选择联系人",
                "defaultCondition":{
                    "employeeID":util.getCrmData().currentEmp.employeeID
                }
            });
            contactsDialog.on("selected",function(val){
                if(val.length < 1){
                    return;
                }
                var parameter = self.get("parameter");
                var items = self.get("items");
                var contactIDs = [];
                _.each(val,function(item){
                    contactIDs.push(item.contactID);
                });
                parameter.contactIDs = contactIDs;
                util.api({
                    'url': self.get("combineApi"),
                    'type': 'post',
                    "dataType": 'json',
                    'data': parameter,
                    'success': function (responseData) {
                        if(!responseData.success){
                            return;
                        }
                        items = items.concat(val);
                        self.set("items",items);
                        self._generateHtml();
                    }
                });
            });
            this.set("contactsDialog",contactsDialog);
        },

        "_initModifyDialog":function(){
            var self = this;
            var modifyDialog = new ContactsDialog({
                "title":"选择联系人",
                "url":"/Contact/GetContactsByCustomerID/",
                "type":"modify",
                "defaultCondition":{
                    "customerID":this.get("customerID")
                }

            });
            modifyDialog.on("selected",function(val){
                var parameter = self.get("parameter");
                var items = self.get("items");
                var contactIDs = [];
                _.each(val,function(item){
                    contactIDs.push(item.contactID);
                });
                parameter.contactIDs = contactIDs;
                util.api({
                    'url': "/SalesOpportunity/SetOppContacts",
                    'type': 'post',
                    "dataType": 'json',
                    'data': parameter,
                    'success': function (responseData) {
                        if(!responseData.success){
                            return;
                        }
                        items = val;
                        self.set("items",items);
                        self._generateHtml();
                        self.trigger("modify",items);
                    }
                });
            });
            this.set("modifyDialog",modifyDialog);
        },

        "_initContactView":function(){
            var contactView = new ContactView();
            this.set("contactView",contactView);
        },
        
        //初始化编辑组件
        "_initContactDialog":function(){
        	var that = this,
        		contactDialog = new ContactDialog();
        	contactDialog.on('updateSuccess', function(){
        		that.trigger('updateSuccess');
        	});
        	this.set('contactDialog', contactDialog);
        },
        
        "_initOperation":function(){
            var self = this;
            var operation = new Operation({
                "element":$(".crm-contact-box-operation",this.element)
            })

            operation.on("new",function(){
                self._showNewDialog();
            });
            operation.on("select",function(){
                self._showSelectDialog();
            });
        },

 		//生成html
 		"_generateHtml":function(){
            var items = this.get("items");
            var html = "";
            _.each(items,function(item){
                html += "<div class = 'crm-contact-box-image-container fn-left fn-clear'>";
                html += "<img src ='"+util.getAvatarLink(item.profileImagePath, '2')+"' title = '"+item.name+"' class = 'crm-contact-box-image fn-left' data-value = '"+item.contactID+"' data-name ='"+item.name+"' data-post = '"+item.post+"' data-department = '"+item.department+"' />";
                html += "<div class = 'crm-contact-box-name fn-text-overflow fn-left fn-clear' data-value = '"+item.contactID+"' title = '"+item.name+"'>"+item.name+"</div>";
                if(item.post && item.department && (item.post.length + item.department.length > 0)){
                    html += "<div class = 'crm-contact-box-department fn-text-overflow fn-left fn-clear' title = '"+item.post+"&nbsp;"+item.department+"'>"+item.post+"&nbsp;"+item.department+"</div></div>";    
                }else{
                    html += "<div class = 'crm-contact-box-department fn-text-overflow fn-left fn-clear' >"+item.post+"&nbsp;"+item.department+"</div></div>";    
                }
                
            });
            $(".crm-contact-box-content",this.element).html(html);
            this._showStatus();
 		},

        "_detailoredit":function(e){
            var current = $(e.currentTarget);
            if(this.get('canEdit')) {
            	this.get("contactDialog").show({"contactID":current.attr("data-value")});
            } else {
            	this.get("contactView").show({"contactID":current.attr("data-value")});
            }
        },

        "_modify":function(){
            if(this.get("type") != "modify"){
                return;
            }
            this.get("modifyDialog").show(this.get("items"));
        },
        
        // 在 客户下 联系人tab上加上（num）的数量
        "_showContactNum": function(num) {
            var that = this,
                $curTab = that.get('showTabContactNumEl'),
                curTabHtml = '';
            
            if (!$curTab || !$curTab[0]) { // 当前tab为 null || 未获取到元素 
                return;
            }
            
            curTabHtml = $curTab.html();
            
            if (!curTabHtml || $.trim(curTabHtml) == '') { // html字符串不存在 或者为空
                return;
            }
            
            // 第一次载入 记录当前联系人长度
            if (typeof that.curContactsNum == 'undefined') {
                that.curContactsNum = num;
                if (num > 0) {
                    $curTab.html(curTabHtml.replace('联系人', '联系人（'+ num +'）'));
                }
                return;
            }
            
            if (num == 0) {
                $curTab.html(curTabHtml.replace('联系人（'+ that.curContactsNum +'）', '联系人'));
            } else {
                if (that.curContactsNum > 0) {
                    $curTab.html(curTabHtml.replace(that.curContactsNum, num));
                } else { //==0
                    $curTab.html(curTabHtml.replace('联系人', '联系人（'+ num +'）'));
                }
            }
            
            that.curContactsNum = num;             
        },
        "_showStatus":function(){
            var hasOperation = this.get("hasOperation");
            var items = this.get("items");
            var type = this.get("type");
            if(type == "modify"){
                $(".crm-contact-box-info-modify",this.element).show();
                $(".crm-contact-box-info-operation",this.element).hide();
                if(items&&items.length){
                	$('.crm-contact-box-modify', this.element).show();
                } else {
                	$('.crm-contact-box-modify', this.element).hide();
                }
            }
            if(type == "operation"){
                $(".crm-contact-box-info-modify",this.element).hide();
                $(".crm-contact-box-info-operation",this.element).show();
            }
            if(items && items.length > 0){
                this._showContactNum(items.length);
                $(".crm-contact-box-number", this.element).text(items.length);
                $(".crm-contact-box-number-container",this.element).show();
                $(".crm-contact-box-content",this.element).show();
                $(".crm-contact-box-info",this.element).hide();
            }else{
                this._showContactNum(0);
                $(".crm-contact-box-number",this.element).text("");
                $(".crm-contact-box-number-container",this.element).hide();
                $(".crm-contact-box-content",this.element).hide();
                $(".crm-contact-box-info",this.element).show();
                if(hasOperation) {
                	$('.crm-contact-box-or', this.element).show();
                	$('.crm-contact-box-select', this.element).show();
                } else {
                	$('.crm-contact-box-or', this.element).hide();
                	$('.crm-contact-box-select', this.element).hide();
                }
            }
            if(hasOperation){
                $(".crm-contact-box-operation",this.element).show();
                $('.crm-contact-operation-select-li', this.element).show();
                $(".crm-contact-box-can-do",this.element).show();
            }else{
                $(".crm-contact-box-operation",this.element).show();
                $('.crm-contact-operation-select-li', this.element).hide();
            }
        },


 		"destroy":function(){
        	this.get('contactDialog') && (this.get('contactDialog').destroy());
        	this.get('contactsDialog') && (this.get('contactsDialog').destroy());
 			var result = Contact.superclass.destroy.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Contact;
 });