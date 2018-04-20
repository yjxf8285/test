/**

 查看联系人
    dialog.show({
        contactID
    })

 共享联系人下查看
    dialog.show({
        contactID: 11
        isShareContact: true
    })
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-contact-view/crm-contact-view.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件

    var ContactDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-contact-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            contactData: undefined,
            customerID: undefined,
            customerName: undefined,
            address: undefined,
            webSite: undefined,
            isShareContact: false,
            shareContactMessageID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .select-del': 'delSelect',
            'click .share-create-contact': 'copyContact',
            'keyup .crm-contacts-contact-way': 'addSelect',
            'keyup .contact-address': 'addSelect'
        },
        copyContact: function(){
            var that = this;
            util.api({
                "url": '/Contact/CopyContact',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    shareContactMessageID: this.get('shareContactMessageID')
                },
                "success": function (data) {
                    if (data.success) {
                        that.v && that.v.refresh();
                        that.trigger('success');
                        that.hide();
                    }
                }
            }, {
                "submitSelector": ''
            });
        },
        "render": function () {
            var result = ContactDialog.superclass.render.apply(this, arguments);
            return result;
        },
        "hide": function () {
            var result = ContactDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            $('.share-create-contact', $el).hide();
            $('.name', $el).text('')
            $('.view-text', $el).text('')
            $('.long-view-text', $el).text('')

            $('.crm-contact-ways-ul', $el).html('').css('display', 'none');
            $('.crm-contact-address-ul', $el).html('').css('display', 'none');
            $('.contact-tags-list-ul', $el).html('');
        },
        "show": function (opt) {
            var result = ContactDialog.superclass.show.apply(this, arguments);
            this.set('isCleared', false);
//            $('.crm-contact-ways-ul', $).html('').css('display', 'none');
//            $('.crm-contact-address-ul', $).html('').css('display', 'none');
//            $('.contact-tags-list-ul', $).html('').css('display', 'none');

            if(opt && opt.contactID){
                this.set('contactID', opt.contactID);
            }
            if(opt && opt.shareContactMessageID){
                this.set('shareContactMessageID', opt.shareContactMessageID);
            }
            if(opt && opt.isShareContact){
                this.set('isShareContact', opt.isShareContact);
                $('.share-create-contact', this.element).show();
            }
            var contactID = this.get('contactID') ? this.get('contactID') : undefined;
            var self = this;
            if(contactID){
                util.api({
                    "url": '/Contact/GetContactByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        contactID: contactID
                    },
                    "success": function (data) {
                        if (data.success) {
                            self.set('contactData', data) ;
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var contactData = this.get('contactData') ? this.get('contactData').value : undefined;
            var contactID = this.get('contactID') ? this.get('contactID') : undefined;
            var customerID = this.get('customerID') || 0;
            var meEl = $(e.currentTarget);
            var $el = this.element;

            var name = $('.contact-name', $el).val(),
                post = $('.contact-post', $el).val(),
                department = $('.contact-department', $el).val(),
                company = $('.contact-company', $el).val(),
                website = $('.contact-website', $el).val(),
                gender = '',
                birthday = '',
                interest = $('.contact-interest', $el).val(),
                listContactWay = [],
                address = []
                listTagOptionID = [],
                remark = $('.contact-remark', $el).val();


            gender = util.mnGetter($('.mn-radio-box'),$el);

            var y = util.mnGetter($('.crm-birth-year', $el)) || -1;
            var m = util.mnGetter($('.crm-birth-month', $el))|| 0;
            var d = util.mnGetter($('.crm-birth-day', $el))|| 0;
            birthday = ''+(y>0 ? y : '0000') +''+ (m<10 ? '0'+m : m) + ''+(d<10 ? '0'+d : d);

//            [{"A":1,"B":"a"},{"A":1,"B":"a"}]
            var contactSelectId = [];
            $('.crm-contact-ways-select', $el).each(function(){
                contactSelectId.push(util.mnGetter($(this)) || 1);
            })
            var index = 0;
            $('.crm-contacts-contact-way', $el).each(function(){
                var v = $(this).val();
                if(v){
                    listContactWay.push((contactSelectId[index]<10 ? '0'+contactSelectId[index]: contactSelectId[index]) + v);
                }
                index++;
            })

            $('.contact-address', $el).each(function(){
                if($(this).val()){
                    address.push($(this).val());
                }
            })

            var $tagLis = $('.contact-tags-list-warp > li', $el);
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });


            if(contactData){
                util.api({
                    "url": '/Contact/UpdateContact',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        contactID: parseInt(contactID),
                        name: name,
                        post: post,
                        department: department,
                        company: company,
                        website: website,
                        gender: gender,
                        birthday: birthday,
                        interest: interest,
                        listContactWay: listContactWay,
                        address: address.join(','),
                        listTagOptionID: listTagOptionID,
                        remark: remark,
                        source: 1//手工创建1
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
                            that.v && that.v.refresh();
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": '/Contact/AddContact',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        customerID: customerID,
                        name: name,
                        post: post,
                        department: department,
                        company: company,
                        website: website,
                        gender: gender,
                        birthday: birthday,
                        interest: interest,
                        listContactWay: listContactWay,
                        address: address.join(','),
                        listTagOptionID: listTagOptionID,
                        remark: remark,
                        source: 1//手工创建1
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
                            that.v && that.v.refresh()//刷新列表
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }

        },
        fillFormData: function(){
            var $el = this.element;
            var contactData = this.get('contactData') &&this.get('contactData').value;

            $('.name', $el).text(contactData.name);
            $('.post', $el).text(contactData.post)
            $('.department', $el).text(contactData.department);
            $('.company', $el).text(contactData.company);
            $('.website', $el).text(contactData.webSite);
            $('.interest', $el).text(contactData.interest);
            $('.remark', $el).text(contactData.remark);

            //性别
            if(contactData.gender){
                if(contactData.gender =='M'){
                    $('.gender', $el).text('男');
                }else if(contactData.gender =='F'){
                    $('.gender', $el).text('女');
                }
            }

            var addUl = $('.crm-contact-address-ul', $el);
            if(contactData.addressObject && contactData.addressObject.length>0){
                addUl.show();
                for(var i= 0, len=contactData.addressObject.length; i<len; i++){
                    var li = $(htmltpl).filter('.dialog-contacts-addr');
                    li.find('.inputs-tit').text('地址');
                    li.find('.long-view-text').text(contactData.addressObject[i]);
                    addUl.append(li);
                }
            }

            var contactUl = $('.crm-contact-ways-ul', $el);
            if(contactData.contactWayObject && contactData.contactWayObject.length>0){
                contactUl.show();
                for(var i= 0, len=contactData.contactWayObject.length; i<len; i++){
                    var li = $(htmltpl).filter('.dialog-contacts-addr');
                    li.find('.inputs-tit').text(contactData.contactWayObject[i].typeDesc);
                    li.find('.long-view-text').text(contactData.contactWayObject[i].content);
                    contactUl.append(li);
                }
            }
            var tagUl = $('.contact-tags-list-ul', $el);
            if(contactData.fBusinessTagRelations && contactData.fBusinessTagRelations.length>0){
                tagUl.show();
                for(var i= 0, len=contactData.fBusinessTagRelations.length; i<len; i++){
                    var li = $(htmltpl).filter('.dialog-contacts-addr');
                    li.find('.inputs-tit').text(contactData.fBusinessTagRelations[i].fBusinessTagName);
                    li.find('.long-view-text').text(contactData.fBusinessTagRelations[i].fBusinessTagOptionName);
                    tagUl.append(li);
                }
            }

            //生日
            var birthStr = '';
            if(contactData.yearOfBirth)
                birthStr+=contactData.yearOfBirth+'年'
            if(contactData.monthOfBirth)
                birthStr+=contactData.monthOfBirth+'月'
            if(contactData.dayOfBirth)
                birthStr+=contactData.dayOfBirth+'日'
            $('.birthday', $el).text(birthStr);

            if(contactData.picturePath)
                $('.profile', $el).attr('src', util.getAvatarLink(contactData.picturePath, '2'));
            else
                $('.profile', $el).attr('src', util.getAvatarLink());

        }
    });

    module.exports = ContactDialog;
});