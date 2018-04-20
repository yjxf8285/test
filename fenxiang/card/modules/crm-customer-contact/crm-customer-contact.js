/**
 * CRM - 产品
 * @author liuxiaofan
 * 2014-04-02
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-customer-contact/crm-customer-contact.html');
    var Dialog = require('dialog');
    var util = require('util');
    var moment = require('moment');
    var ContactDialog=require('modules/crm-contact-edit/crm-contact-edit');
    var ContactsDialog=require('modules/crm-select-contacts/crm-select-contacts');





    var CustomerContact = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'customer-basic-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-customer-baseinfo-template').html()),
        initialize: function(){
            var $el = this.$el,
                self = this;
            var fCustomer = self.options.customerData.value.fCustomer;
            $el.html(this.template({
                value:''
            }));
            this.panel = $($(htmltpl).filter('.crm-operate-contact-panel-template').html());
            $('.operate', $el).append(this.panel);
            this.options.warpEl.html($el);

            util.regGlobalClick(this.panel);
            this.editExits = new ContactsDialog({
                "title":"选择联系人",
                "url":"/Contact/GetUserContacts/",
                "defaultCondition":{
                    "employeeID":util.getCurrentEmp().employeeID,
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
                }
            });
            this.editExits.on('selected', function(arr){
                var cID = fCustomer.customerID;
                var contactsIDArr = [];
                _.map(arr, function(obj){
                    contactsIDArr.push(obj.contactID);
                });
                util.api({
                "url": '/Contact/BatchCombineContactAndFCustomer',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    contactIDs: contactsIDArr,
                    customerID: cID
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        //TODO 列表刷新
                    }
                }
            });


            })

        },
        events: {
            'click .operate': '_operate',
//            'click document': '_hideTip'
            'click .crm-contact-add-btn': 'addContact',
            'click .crm-contact-add-exits-btn': 'addExitsContact'
        },
        _operate: function(e){
            e.stopPropagation();
            this.panel.show();
        },
        addContact: function(e){
            var self = this;
            var fCustomer = this.options.customerData.value.FCustomer;
            e.stopPropagation();
            this.panel.hide();


//            util.api({
//                "url": '/Contact/GetContactByID',
//                "type": 'get',
//                "dataType": 'json',
//                "data": {
//                    contactID: 985
//                },
//                "success": function(responseData) {
//                    self.options.contactData = responseData;
//                    if (responseData.success) {
//                        self.createDialog = new ContactDialog({
//                            contactData: self.options.contactData,
////                            customerID: fCustomer.customerID,
////                            customerName: fCustomer.name
//                        });//先把弹框NEW出来因为只有1个
//                        self.createDialog.v = self;
//                        self.createDialog.show();
//                    }
//                }
//            });

            this.createDialog = new ContactDialog({
//                customerData: self.options.customerData,
                customerID: fCustomer.customerID,
                customerName: fCustomer.name
            });//先把弹框NEW出来因为只有1个
            this.createDialog.v = this;

            this.createDialog.show();
        },
        addExitsContact: function(e){
            this.editExits.show();
        }

    });

    var CustomerBasic = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'customer-basic-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-customer-baseinfo-template').html()), //模板
        options: {
            warpEl: null,
            customerData: null
        },
        initialize: function(){
            this.loadData();

        },
        render: function(){
            var $el = this.$el;
            var c = this.options.customerData.value.FCustomer;
            var renderTemplate = this.template;


            $el.html(renderTemplate({
                fullName: c.fullName,
                name: c.name,
                address: c.address,
                webSite: c.webSite,
                introduction: c.introduction,
                ownerName: c.owner.name,
                createTime: moment.unix(c.createTime).format('YYYY年MM月DD日 HH:mm'),
                lastChangedTime: moment.unix(c.lastChangedTime).format('YYYY年MM月DD日 HH:mm'),
                value: {tags: []}
            }));

            var $tagUl = $('.customer-baseinfo-tag-ul', $el);
            var tagHtml = [];
            _.map(c.fBusinessTagRelations, function(tag){
                tagHtml.push('<li class="fn-clear"><div class="input-tip">');
                tagHtml.push(tag.fBusinessTagName);
                tagHtml.push('</div><div class="input-wrapper">');
                tagHtml.push(tag.fBusinessTagOptionName);
                tagHtml.push('</div></li>');
            });
            $tagUl.html(tagHtml.join(''));
            this.options.warpEl.html($el);
        },
        refresh: function(){
            var $el = this.$el;
            var c = this.v.options.customerData.value.fCustomer;
            var renderTemplate = this.template;

            $el.html(renderTemplate({
                fullName: c.fullName,
                name: c.name,
                address: c.address,
                webSite: c.webSite,
                introduction: c.introduction,
                ownerName: c.owner.name,
                createTime: moment.unix(c.createTime).format('YYYY年MM月DD日 HH:mm'),
                lastChangedTime: moment.unix(c.lastChangedTime).format('YYYY年MM月DD日 HH:mm'),
                value: {tags: []}
            }));

            var $tagUl = $('.customer-baseinfo-tag-ul', $el);
            var tagHtml = [];
            _.map(c.fBusinessTagRelations, function(tag){
                tagHtml.push('<li class="fn-clear"><div class="input-tip">');
                tagHtml.push(tag.fBusinessTagName);
                tagHtml.push('</div><div class="input-wrapper">');
                tagHtml.push(tag.fBusinessTagOptionName);
                tagHtml.push('</div></li>');
            });
            $tagUl.html(tagHtml.join(''));
        },
        loadData: function(){
            var self = this;
            var customerID = this.options.customerData.value.FCustomer.customerID;
            util.api({
                "url": '/FCustomer/GetFCustomerDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    customerID: customerID, //int，产品ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function(responseData) {
                    if (responseData.success) {
                        self.responseData = responseData;
                        self.render();
                    }
                }
            });
        }

    });


    module.exports = CustomerContact;
});