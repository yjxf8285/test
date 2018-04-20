/**
 * 客户导出
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

define(function (require, exports, module) {
    var Dialog = require("dialog"),
        root = window,
        FS = root.FS,
        util = require('util');
    var tpl = require('modules/crm-customer-export/crm-customer-export.html');
////    var tplStyle = require('modules/crm-customer-export/crm-customer-export.css');
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');
    var moment = require('moment');
    // exportApi : "/FCustomer/ImportMyFCustomer"
    // title:"测试客户导出"
    var CustomerExport = Dialog.extend({
        "attrs": {
            "content": tpl,
            "exportApi": "",
            "isFirstChar": false,
            "width": 480,
            "title": "",
            "hasBelongTo": false,
            "isMulti": false,
            "selectColleague": null,
            "closeTpl": "<div class = 'crm-ui-dialog-close'>×</div>",
            "belongTo": null,
            "ownerName": "归属人",
            "para": {
                "employeeID": -1,
                "keyword": "",
                "isFirstChar": false
            }
        },

        "setup": function () {
            var result = CustomerExport.superclass.setup.apply(this, arguments);
            return result;
        },

        "render": function () {
            var result = CustomerExport.superclass.render.apply(this, arguments);
            this._init();
            return result;
        },

        "_init": function () {
            var title = this.get("title");
            var hasBelongTo = this.get("hasBelongTo");
            $(".crm-customer-export-label-belong-to", this.element).text(this.get("ownerName") + "：")
            $(".crm-customer-export-title", this.element).text(title);
            if (hasBelongTo) {
                $(".crm-customer-export-belong-to-tr", this.element).show();
            } else {
                $(".crm-customer-export-belong-to-tr", this.element).hide();
            }
            this._initSelectColleague();
        },

        "_initSelectColleague": function () {
            var self = this;
            var selectColleague = new SelectColleague({
                "isMultiSelect": self.get('isMulti')?true:false,
                "hasWorkLeaveBtn": false,
                "title": "选择" + this.get("ownerName")
            });

            selectColleague.on("selected", function (val) {
                self._onColleagueSelect(val);
            });
            self.set("selectColleague", selectColleague);
        },

        //隐藏
        "hide": function () {
            var result = CustomerExport.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (para) {
            var result = CustomerExport.superclass.show.apply(this, arguments);
            if (para) {
                var currentPara = this.get("para");
                currentPara = _.extend(currentPara, para);
                this.set("para", currentPara);
            }
            return result;
        },

        "events": {
            "click .crm-customer-export-button-select": "_colleagueSelect",
            "click .crm-customer-export-button-clear": "_colleagueClear",
            "click .crm-customer-export-button-export": "_export"
        },

        "_colleagueSelect": function () {
            this.get("selectColleague").show();
        },

        "_onColleagueSelect": function (val) {
        	if(this.get('isMulti')) {
        		if(!val.length) return;
        		var names = [];
        		$.each(val, function(i, item){
        			names.push(item.name);
        		});
        		$(".crm-customer-export-belong-to", this.element).text(names.join(',')).attr('title', names.join(','));
                this.set("belongTo", val);
        	} else {
        		if (!val) return;
            $(".crm-customer-export-belong-to", this.element).text(val.name);
            this.set("belongTo", val);
        	}
            $(".crm-customer-export-button-clear", this.element).show();
        },

        "_colleagueClear": function () {
            this.reset();
        },

        "_export": function () {
            var self = this;
            var belongTo = this.get("belongTo");
            var name = "";
            var para = this.get("para");

            if (belongTo) {//已归属客户
            	if(self.get('isMulti')){//多选
            		var names = [],
            			employeeIDs = [];
            		$.each(belongTo, function(i, item){
            			names.push(item.name);
            			employeeIDs.push(item.employeeID);
            		});
            		para.employeeIDs = employeeIDs.join(',');
            	} else {//单选
            		para.employeeIDs = null;
                    name = belongTo.name;
                    para.employeeID=belongTo.employeeID;
            	}
            } else {
            	delete para.employeeIDs;
            }
            para.keyword = $(".crm-customer-export-keyword-input", this.element).val();
            para.isFirstChar = this.get("isFirstChar");
            util.api({
                'url': this.get("exportApi"),
                'type': 'get',
                "dataType": 'json',
                'data': para,
                'timeout': 120000,//导出设置超时2min
                'success': function (responseData) {
                    if (!responseData.success) {
                        return;
                    }
                    var serviceTime = responseData.serviceTime;
                    var fTime = moment.unix(serviceTime).format('YYYYMMDDHHmm');
                    $(".crm-customer-export-download", self.element).attr("href", FS.API_PATH + "/DF/GetTemp?id=" + responseData.value + "&name=" + fTime + '_' + encodeURI(name) + encodeURI(self.get("title")) + ".xls&isAttachment=true");
                    $(".crm-customer-export-download", self.element).show();
                }
            },{
                "submitSelector": $('.crm-customer-export-button-export', this.element)
            });
        },

        "setTitle": function (title) {
            $(".crm-customer-export-title", this.element).text(title);
        },

        "reset": function () {
            $(".crm-customer-export-belong-to", this.element).text("");
            $(".crm-customer-export-keyword-input", this.element).val("");
            this.set("belongTo", null);
            $(".crm-customer-export-button-clear", this.element).hide();
            $(".crm-customer-export-download", this.element).hide();
        },

        "destroy": function () {
            var result = CustomerExport.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    module.exports = CustomerExport;
});