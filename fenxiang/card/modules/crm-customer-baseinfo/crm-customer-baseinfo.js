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
    var htmltpl = require('modules/crm-customer-baseinfo/crm-customer-baseinfo.html');
    var Dialog = require('dialog');
    var util = require('util');
    var moment = require('moment');


    var CustomerBasic = Backbone.View.extend({
        tagName: 'div', //HTML标签名
        className: 'customer-basic-module', //CLASS名
        template: _.template($(htmltpl).filter('.crm-customer-baseinfo-template').html()), //模板
        options: {
            warpEl: null,
            customerData: null
        },
        events:{
//            'click .edit-customer': '_editCustomer'
        },
        initialize: function(){
            this.loadData();
        },
        render: function(){
            this.refresh();
        },
        refresh: function(){
            var $el = this.$el;
            var self = this;
            var c = this.v.options.customerData.value.FCustomer;
            var renderTemplate = this.template;

            $el.html(renderTemplate({
                fullName: c.fullName,
                name: c.name,
                customerNo: c.fCustomerNo,
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


            var $defineFieldUl = $('.customer-define-field-tag-ul', $el);
            var defineFieldHtml = [];
            if(c.userDefineFieldDataList && c.userDefineFieldDataList.textList){
                _.map(c.userDefineFieldDataList.textList, function(obj){
                    if(obj.value != ''){
                        defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                        defineFieldHtml.push(obj.fieldDescription);
                        defineFieldHtml.push('</div><div class="textarea-wrapper">');
                        defineFieldHtml.push(obj.value);
                        defineFieldHtml.push('</div></li>');
                    }
                });
            }
            if(c.userDefineFieldDataList && c.userDefineFieldDataList.dateList){
                _.map(c.userDefineFieldDataList.dateList, function(obj){
                    if(obj.value >0) {
                        defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                        defineFieldHtml.push(obj.fieldDescription);
                        defineFieldHtml.push('</div><div class="input-wrapper">');
//                        defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日 HH:mm'));
                        defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日'));
                        defineFieldHtml.push('</div></li>');
                    }
                });
            }
            if(c.userDefineFieldDataList && c.userDefineFieldDataList.numList){
                _.map(c.userDefineFieldDataList.numList, function(obj){
                        defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                        defineFieldHtml.push(obj.fieldDescription);
                        defineFieldHtml.push('</div><div class="input-wrapper">');
                        defineFieldHtml.push(obj.value);
                        defineFieldHtml.push('</div></li>');
                });
            }
            if(defineFieldHtml.length >0){
                $defineFieldUl.show();
                $defineFieldUl.html(defineFieldHtml.join(''));
            }else{
                $defineFieldUl.hide();
            }
            this.options.warpEl.html($el);
            $el.find('.edit-customer').bind('click', function(){
                self._editCustomer();
            })
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
        },
        _editCustomer: function(){
            this.v._editCustomer();
        }
    });


    module.exports = CustomerBasic;
});