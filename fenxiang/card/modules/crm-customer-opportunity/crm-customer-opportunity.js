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
    var htmltpl = require('modules/crm-customer-opportunity/crm-customer-opportunity.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
//    var publishHelper = require('modules/publish/publish-helper');
//    var DataTables = require('datatable');
    var moment = require('moment');
//    var SearchBox = require('uilibs/search-box');//搜索框组件
//    var Pagination = require('uilibs/pagination2');//分页组件


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
        },
        setCrmAttachment: function() {
            var that = this;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            var itemsData = this.responseData.value.feedAttachEntitys;
            //左栏附件模块
//            this.attachment = new Attachment({
//                "element": crmAttachmentSimpleWarp,
//                "items": itemsData
//            });
//            this.attachment.render();
//
//            this.attachment.on('toAll', function() {
//                //切换到附件信息
//                that.options.detail.tab.select("tab-files");
//            });
//            this.attachment.on('uploaded',function (){
//                that.attachmentList.reload();
//            });
        }

    });


    module.exports = CustomerBasic;
});