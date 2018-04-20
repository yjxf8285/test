/**
 新建

 客户详情页下-> 新建
dialog.show({
    customerID
    customerName
    address
    webSite
})

 编辑
 contactID
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-contact-edit/crm-contact-edit.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var DateSelect = publishHelper.DateSelect;

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
            webSite: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .select-del': 'delSelect',
            'keyup .crm-contacts-contact-way': 'addSelect',
            'keyup .contact-address': 'addSelect'
        },
        "render": function () {
        	var that = this;
            var result = ContactDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            setTimeout(function(){
            	$('.area-auto-height', that.element).trigger('autosize.resize');
            }, 1);
            return result;
        },
        "hide": function () {
            var result = ContactDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
//            this.set('customerID', '');
//            this.set('customerName', '');
            var $el = this.element;

            this.set('address', '');
            this.set('webSite', '');

            $('.area-auto-height', $el).val('').removeAttr('style');
            $('.dialog-input-text', $el).val('');
            $('.mn-select-box', $el).each(function () {
                util.mnReset($(this));
            });
            $('.contact-company', $el).removeAttr('readonly').val('').removeAttr('data-id');

            util.mnSetter($('.contact-gender-radio', $el), '');
            util.mnSetter($('.crm-birth-year', $el), '');
            util.mnSetter($('.crm-birth-month', $el), '');
            util.mnSetter($('.crm-birth-day', $el), '');

            var addrUl = $('.crm-contact-address-ul', $el);
            var addrLi = $(htmltpl).filter('.dialog-contacts-address');
            addrUl.html('').append(addrLi);
            
            var $Ul = $('.crm-contact-ways-ul', this.element),
	        	$Li = $Ul.find('.dialog-contacts-contact-way');
	        $.each($Li, function(idx, item){
	        	util.mnDestroy($(item).find('.mn-select-box'));
	        });
            
            var cUl = $('.crm-contact-ways-ul', $el);
            var cLi = $(htmltpl).filter('.dialog-contacts-contact-way');
            cUl.html('').append(cLi);
            util.mnSelect(cLi.find('.mn-select-box'),'syncModel', util.getContactsWays());
            

            $('.dialog-input-text', this.element).val('');
            _.map(this.defineDateFieldArray, function(obj){
                obj.dateObj.clear();
            });
            $('.contact-tags-list-warp', $el).html('');
            this.set('contactData', null);
        },
        "show": function (opt) {
            var result = ContactDialog.superclass.show.apply(this, arguments);
            if(opt && opt.contactID) {
            	this.set('contactID', opt.contactID);
            }
            var contactID = this.get('contactID') ? this.get('contactID') : undefined;
            var self = this;
            if(opt && opt.customerID && opt.customerName){
                this.set('customerID', opt.customerID);
                this.set('customerName', opt.customerName);

            }
            var customerID = this.get('customerID');
            var customerName = this.get('customerName');
            if(customerName){
                var $company = $('.contact-company', this.element);
                $company.attr('data-id', opt.customerID).val(opt.customerName).attr('readonly',true).css('color', '#cdcdcd');;
            }
            if(opt && opt.address){
                this.set('address', opt.address);
                var cUl = $('.crm-contact-address-ul', this.element);
                var cLi = cUl.find('li');
                cLi.find('.contact-address').val(opt.address);
                cLi.find('.select-del').show();
                cLi = $(htmltpl).filter('.dialog-contacts-address');
                cUl.append(cLi);
//                publishHelper.AdjustTextAreaSize({
//                    element: cLi.find('.area-auto-height')
//                });
            }
            if(opt && opt.webSite){
                this.set('webSite', opt.webSite);
                $('.contact-website', this.element).val(opt.customerName);
            }
            $('.area-auto-height', self.element).trigger('autosize.resize');
//            编辑
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
                            self.setupTags();
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            } else {
            	self.setupTags();
            	//ff下placeholder有问题
              /*  if($.browser.mozilla && !navigator.userAgent.match(/Trident\/7\./)) {
                	setTimeout(function(){
                    	$('.area-auto-height', this.element).val('');
                    }, 1);
                }*/
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
                address = [],
                listTagOptionID = [],
                remark = $('.contact-remark', $el).val();


            gender = util.mnGetter($('.contact-gender-radio',$el));
            var y = util.mnGetter($('.crm-birth-year', $el)) || 0;
            var m = util.mnGetter($('.crm-birth-month', $el))|| 0;
            var d = util.mnGetter($('.crm-birth-day', $el))|| 0;
            if((y+'').length !== 4)
                y = 0;
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

            //自定义字段
            var $fieldUl = $('.contact-define-fields-list-warp', $el);
            var dataList = [];

            var num = [];
            $fieldUl.find('.f-user-define-field-num').each(function(){
                dataList.push($(this).attr('data-fieldname')+','+$(this).next().find('input').val()||0);
            });
            var text = [];
            $fieldUl.find('.f-user-define-field-text').each(function(){
                dataList.push($(this).attr('data-fieldname')+','+($(this).next().find('textarea').val()||''))
            });
            var dates = [];
            _.map(this.defineDateFieldArray, function(date){
                dataList.push(date.fieldName+','+date.dateObj.getTime())
            });

            if(contactData){
                util.api({
                    "url": '/Contact/UpdateContact',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改联系人发生错误，原因：',
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
                        dataList: dataList,
                        remark: remark,
                        source: 1//手工创建1
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
                            if(that.v && that.v.refresh)
                                that.v.refresh();
                            that.trigger('success');
                            that.trigger('updateSuccess');
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
            	if($.trim(name)=='') {
            		util.alert('请填写姓名');
            		return;
            	}
                util.api({
                    "url": '/Contact/AddContact',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加联系人发生错误，原因：',
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
                        dataList: dataList,
                        remark: remark,
                        source: 1//手工创建1
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
                            if(that.v && that.v.refresh)
                                that.v.refresh();
                            that.trigger('success');
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }

        },
        delSelect: function(e){
            var cLi = $(e.target).parent().parent();
            if(cLi.parent().children().length == 1){
            }else{
                cLi.remove();
            }
        },
        addSelect: function(e){
            var $el = $(e.target);
            var cLi = $el.parent().parent();
            if(cLi.next().length == 0){
                $el.next().show();
                var selectLi;
                if($el.hasClass('contact-address')){
                    selectLi = $(htmltpl).filter('.dialog-contacts-address');
                }else{
                    selectLi = $(htmltpl).filter('.dialog-contacts-contact-way');

                }
                cLi.parent().append(selectLi);
                util.mnSelect(selectLi.find('.mn-select-box'),'syncModel', util.getContactsWays());

                publishHelper.AdjustTextAreaSize({
                    element: selectLi.find('.area-auto-height')
                });
            }
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.autoHeightTextarea = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function () {
            var self = this;
            var contactData = this.get('contactData') &&this.get('contactData').value;
            var company = this.get('customerName');// &&this.get('customerName');

            var $el = this.element;
            var tagUl = $('.contact-tags-list-warp', $el);


            //客户详情页添加，联系人
            if(company){
                $('.contact-company', $el).val(company).attr('readOnly', true).css('color', '#cdcdcd');
            }
            this.setupBirthComponent();

            var $contactWays = $('.crm-contact-ways-select', $el);
            var contactWaysOpts = util.getContactsWays();
            util.mnSelect($contactWays, 'syncModel', contactWaysOpts);

//            自定义字段
            var defineFields = util.getUserDefineFieldByType(2);
            this.defineDateFieldArray = [];
            var fieldUl = $('.contact-define-fields-list-warp', $el);
            if(defineFields && defineFields.length>0){
                fieldUl.show();
            }
            this.defineDateFieldArray = util.generateDefineField(fieldUl, defineFields, DateSelect);
            publishHelper.AdjustTextAreaSize({
                element: $('.area-auto-height', $el)
            });
            $('.area-auto-height', $el).trigger('autosize.resize');

        },
        setupTags: function() {
        	var contactData = this.get('contactData') &&this.get('contactData').value;
        	var $el = this.element;
            var tagUl = $('.contact-tags-list-warp', $el);
        	var crmData = util.getCrmData();//获取CRM缓存数据
            var fBusinessTags = crmData.fBusinessTags;//标签数据
            var contactTags = [];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === util.CONSTANT.TAG_TYPE.CONTACTS) {
                    contactTags.push(fBusinessTag);
                }
            });
            //实例化下拉框（新建 ｜ 编辑）
            _.each(contactTags, function (tag, index) {
                var name = tag.name;
                var options = tag.options;
                var ulStr = '';
                var defaultItem = '';
                var currentSelectedTag;
                var selectedOptID;
                var selectedOptName;
                //编辑，取客户的标签内容
                if(contactData){
                    currentSelectedTag = _.find(contactData.fBusinessTagRelations, function(tempTag){
                        return tag.fBusinessTagID == tempTag.fBusinessTagID;
                    });
                    selectedOptID = currentSelectedTag && currentSelectedTag.fBusinessTagOptionID;
                    selectedOptName = currentSelectedTag &&currentSelectedTag.fBusinessTagOptionName;
                }
                if (options.length > 0) {
                    var selectedOpts = _.find(options, function(o){
                        return o.fBusinessTagOptionID == selectedOptID;
                    });
                    _.each(options, function (option, index) {
                        var isDefault = option.isDefault;
                        //编辑
                        if(selectedOpts && option.fBusinessTagOptionID == selectedOptID){
                            defaultItem = selectedOptName;
                            ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + selectedOptID + '" data-selected="' + true + '">' + selectedOptName + '</li></ul>';
                            //默认
                        }else{
                            if (isDefault) {
                                defaultItem = option.name;
                                ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + option.fBusinessTagOptionID + '" data-selected="' + isDefault + '">' + option.name + '</li></ul>';
                            }else{
                                ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + option.fBusinessTagOptionID + '">' + option.name + '</li></ul>';
                            }
                        }
                    });
                } else {
                    ulStr = '<ul class="mn-select-list"><li class="mn-select-item" data-value="0"></li></ul>';
                }
                tagUl.append('<li class="fn-clear"> <div class="inputs-tit f-business-tag-id" data-fbusinesstagid="' + tag.fBusinessTagID + '"> '
                    + name + ' </div> <div class="selects-warp"> <span select-cls="" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">' + defaultItem + '</span><span class="title-icon"></span></span>' + ulStr + '</span> </div> </li>');
            });
        },
        setupBirthComponent: function(){
            var $el = this.element;
            var $birthYear = $('.crm-birth-year', $el);
            var currentYear = new Date().getFullYear();
            var yearOpts = [{
                value: '',
                text: ''
            }];

            for(var i=0; i<100; i++){
                yearOpts.push({
                    value: currentYear,
                    text: currentYear+'年'
                });
                currentYear = currentYear-1;
            }
            util.mnSelect($birthYear, 'syncModel', yearOpts);
            util.mnEvent($birthYear, 'change', function (val, text) {
                //重新 day
                var y = val
                var m = util.mnGetter($birthMonth)
                if(m){
                    var days = new Date(new Date(y, m)-3600*24).getDate()
                }
                var dayOpts = [{
                    value: '',
                    text: ''
                }];
                for(var k=1; k<=days; k++){
                    dayOpts.push({
                        value: k,
                        text: (k<10 ? '0'+k : k)+'日'
                    });
                }
                util.mnSelect($birthDay, 'syncModel', dayOpts);
            });

            var $birthMonth = $('.crm-birth-month', $el);
            var currentMonth = new Date().getFullYear();
            var monthOpts = [{
                value: '',
                text: ''
            }];

            for(var j=1; j<13; j++){
                monthOpts.push({
                    value: j,
                    text: (j<10 ? '0'+j : j)+'月'
                });
            }
            util.mnSelect($birthMonth, 'syncModel', monthOpts);
            util.mnEvent($birthMonth, 'change', function (val, text) {
                //重新 day
                var y = util.mnGetter($birthYear) || 0;
                var m = val;
                if(y){
                    var days = new Date(new Date(y, m)-3600*24).getDate()
                } else {
                	var days = (val==2 ? 29 : ((val==4||val==6||val==9||val==11) ? 30 : 31));
                }
                var dayOpts = [{
                    value: '',
                    text: ''
                }];
                for(var k=1; k<=days; k++){
                    dayOpts.push({
                        value: k,
                        text: (k<10 ? '0'+k : k)+'日'
                    });
                }
                util.mnSelect($birthDay, 'syncModel', dayOpts);
            });

            var $birthDay = $('.crm-birth-day', $el);
            var dayOpts = [{
                value: '',
                text: ''
            }];
            for(var k=1; k<32; k++){
                dayOpts.push({
                    value: k,
                    text: (k<10 ? '0'+k : k)+'日'
                });
            }
            util.mnSelect($birthDay, 'syncModel', dayOpts);

        },
        fillFormData: function(){
            var $el = this.element;
            var self = this;
            var contactData = this.get('contactData') &&this.get('contactData').value;

            $('.contact-name', $el).val(contactData.name);
            $('.contact-post', $el).val(contactData.post)
            $('.contact-department', $el).val(contactData.department);
            $('.contact-company', $el).val(contactData.company);
            $('.contact-website', $el).val(contactData.webSite);
//                    gender = '',
//                    birthday = '',
            $('.contact-interest', $el).val(contactData.interest);
//                    listContactWay = [],
//                    address = []
//                    listTagOptionID = [], done
            $('.contact-remark', $el).val(contactData.remark);

            //性别
            if(contactData.gender){
                util.mnSetter($('.contact-gender-radio', $el), contactData.gender);
            }
            //生日
            if(contactData.yearOfBirth) util.mnSetter($('.crm-birth-year', $el), contactData.yearOfBirth);
            if(contactData.monthOfBirth) util.mnSetter($('.crm-birth-month', $el), contactData.monthOfBirth);
            if(contactData.dayOfBirth) util.mnSetter($('.crm-birth-day', $el), contactData.dayOfBirth);

            //联系方式
            if(contactData.contactWayObject && contactData.contactWayObject.length>0){
                var cUl = $('.crm-contact-ways-ul', $el);
                var cLi = cUl.find('li');
                for(var i= 0, len=contactData.contactWayObject.length; i<len; i++){
                    cLi.find('.crm-contacts-contact-way').val(contactData.contactWayObject[i].content);
                    cLi.find('.select-del').show();
                    util.mnSetter(cLi.find('.mn-select-box'), contactData.contactWayObject[i].type);

                    cLi = $(htmltpl).filter('.dialog-contacts-contact-way');
                    cUl.append(cLi);
                    util.mnSelect(cLi.find('.mn-select-box'),'syncModel', util.getContactsWays());

//                    publishHelper.AdjustTextAreaSize({
//                        element: cLi.find('.area-auto-height')
//                    });
                }
            }
            //多个地址
            if(contactData.addressObject && contactData.addressObject.length>0){
                var cUl = $('.crm-contact-address-ul', $el);
                var cLi = cUl.find('li');
                for(var i= 0, len=contactData.addressObject.length; i<len; i++){
                    cLi.find('.contact-address').val(contactData.addressObject[i]);
                    cLi.find('.select-del').show();
                    cLi = $(htmltpl).filter('.dialog-contacts-address');
                    cUl.append(cLi);
                    publishHelper.AdjustTextAreaSize({
                        element: cLi.find('.area-auto-height')
                    });
                }
            }
            //编辑，取客户的标签内容
            _.map(contactData.fBusinessTagRelations, function(tempTag){
                if(tempTag.fBusinessTagOptionID){
                    util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                }
            });
            //自定义字段
            if(contactData.userDefineFieldDataList && contactData.userDefineFieldDataList.dateList){
                _.map(contactData.userDefineFieldDataList.dateList, function(date){
                    var obj = _.find(self.defineDateFieldArray, function(obj){
                        return obj.fieldName == date.fieldName;
                    });
                    if(date.value>0){
                        obj.dateObj.setValue(date.value*1000);
                    }
                })
            }

            var $fieldUl = $('.contact-define-fields-list-warp', $el);
            if(contactData.userDefineFieldDataList && contactData.userDefineFieldDataList.numList){
                _.map(contactData.userDefineFieldDataList.numList, function(obj){
                    $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('input').val(obj.value);
                })
            }
            if(contactData.userDefineFieldDataList && contactData.userDefineFieldDataList.textList){
                _.map(contactData.userDefineFieldDataList.textList, function(obj){
                    $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('textarea').val(obj.value);
                })
            }
            $('.area-auto-height', $el).trigger('autosize.resize');
        },
        destroy: function(){
        	util.mnDestroy($('.crm-birth-year', this.element));
            util.mnDestroy($('.crm-birth-month', this.element));
            util.mnDestroy($('.crm-birth-day', this.element));
            util.mnDestroy($('.crm-contact-ways-select', this.element));
        	if(this.defineDateFieldArray) {
        		_.map(this.defineDateFieldArray, function(obj){
        			obj.dateObj && (obj.dateObj.destroy());
                });
        	}
        	var $tagLis = $('.contact-tags-list-warp > li', this.element);
            $tagLis.each(function (i) {
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                util.mnDestroy(mnSelectBoxEl);
            });
        	var result = ContactDialog.superclass.destroy.apply(this,arguments);
 			return result;
        }
    });

    module.exports = ContactDialog;
});