/**

 新建

 设置中 -> 新建
 dialog = new CustomerDialog({
    inSetting: true
 })
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-customer-add/crm-customer-add.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var DateSelect = publishHelper.DateSelect;
    var moment = require('moment');

    var CustomerDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-customer-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            inSetting: false,
            customerID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .ownerID-btn': 'showOwerDialog'
        },
        showOwerDialog: function(){
            this.selectOwnerDialog.show();
        },
        "render": function () {
            var result = CustomerDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = CustomerDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            $('.area-auto-height', this.element).val('').removeAttr('style');
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });

            var currentEmp = util.getCurrentEmp();
            $('.ownerID', this.element).val(currentEmp.name).attr('data-id', currentEmp.employeeID);
            $('.dialog-input-text', this.element).val('');
            _.map(this.defineDateFieldArray, function(obj){
                obj.dateObj.clear();
            });

            this.setupComponent();

        },
        "show": function () {
            var self = this;
            var result = CustomerDialog.superclass.show.apply(this, arguments);
            var customerID = this.get('customerID') ? this.get('customerID') : undefined;
//            编辑
            if(customerID){
                util.api({
                    "url": '/FCustomer/GetCustomerByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        customerID: customerID
                    },
                    "success": function (data) {
                        if (data.success) {
                            self.set('customerData', data) ;
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            } else {
            	//ff下placeholder有问题
                if($.browser.mozilla) {
                	setTimeout(function(){
                    	$('.area-auto-height', this.element).val('');
                    }, 1);
                }
            }

            return result;
        },
        "submit": function (e) {
            var that = this;
            var self = this;
            var customerData = this.get('customerData') ? this.get('customerData').value.fCustomer : undefined;
            var meEl = $(e.currentTarget);
            var elEl = this.element;

            var name = $('.c-name', elEl).val(),
            	fCustomerNo = $('.c-number', elEl).val(),
                fullName = $('.c-fullname', elEl).val(),
                address = $('.c-address', elEl).val(),
                webSite = $('.c-webSite', elEl).val(),
                ownerID = parseInt($('.ownerID', elEl).attr('data-id')),
                introduction = $('.c-introduction', elEl).val();

            var $tagLis = $('.customer-tags-list-warp > li', elEl);

            var listTagOptionID = [];
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });

            //自定义字段
            var $fieldUl = $('.customer-define-fields-list-warp', elEl);
            var dataList = [];

            var num = [];
            $fieldUl.find('.f-user-define-field-num').each(function(){
                dataList.push($(this).attr('data-fieldname')+','+($(this).next().find('input').val()||0))
            });
            var text = [];
            $fieldUl.find('.f-user-define-field-text').each(function(){
                dataList.push($(this).attr('data-fieldname')+','+($(this).next().find('textarea').val()||''))
            });
            var dates = [];
            _.map(this.defineDateFieldArray, function(date){
                dataList.push(date.fieldName+','+date.dateObj.getTime())
            });
            if(customerData){
                util.api({
                    "url": '/FCustomer/ModifyFCustomer',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改客户发生错误，原因：',
                    "data": {
                        customerID: customerData.customerID,
                        name: name,
                        fullName: fullName,
                        address: address,
                        webSite: webSite,
                        introduction: introduction,
                        listTagOptionID: listTagOptionID,
                        dataList: dataList,
                        fCustomerNo: fCustomerNo
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
                            that.v && that.v.refresh && that.v.refresh();
                            that.trigger('success');
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": self.get('inSetting') ? '/FCustomer/AddFCustomerForManager' :'/FCustomer/AddFCustomer',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加客户发生错误，原因：',
                    "data": {
                        ownerID: ownerID,
                        name: name,
                        fullName: fullName,
                        address: address,
                        webSite: webSite,
                        introduction: introduction,
                        listTagOptionID: listTagOptionID,
                        dataList: dataList,
                        fCustomerNo: fCustomerNo
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
                            that.v && that.v.refresh && that.v.refresh();
                            that.trigger('success');
                        }
                    }
                }, {
                    "submitSelector": meEl
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
            var customerData = this.get('customerData') &&this.get('customerData').value.fCustomer;
            var $el = this.element;
            var self = this;
            var tagUl = $('.customer-tags-list-warp', $el);
            var tags = util.getTagsByType(util.CONSTANT.TAG_TYPE.CUSTOMER);
            this.selectOwnerDialog = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":false,
                "title":"选择同事"
            });
            this.selectOwnerDialog.on('selected', function(obj){
                $('.ownerID', $el).val(obj.name).attr('data-id', obj.employeeID).trigger('autosize.resize');;
            });
            tagUl.html('');
            //实例化下拉框（新建 ｜ 编辑）
            _.each(tags, function (tag, index) {
                var name = tag.name;
                var options = tag.options;
                var ulStr = '';
                var defaultItem = '';
                if (options.length > 0) {
                    _.each(options, function (option, index) {
                        var isDefault = option.isDefault;
                        if (isDefault) {
                            defaultItem = option.name;
                            ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + option.fBusinessTagOptionID + '" data-selected="' + isDefault + '">' + option.name + '</li></ul>';
                        }else{
                            ulStr += '<ul class="mn-select-list"><li class="mn-select-item" data-value="' + option.fBusinessTagOptionID + '">' + option.name + '</li></ul>';
                        }
                    });
                } else {
                    ulStr = '<ul class="mn-select-list"><li class="mn-select-item" data-value="0"></li></ul>';
                }
                tagUl.append('<li class="fn-clear"> <div class="selects-tit inputs-tit f-business-tag-id" data-fbusinesstagid="'
                    + tag.fBusinessTagID + '"> ' + name + ' </div> <div class="selects-warp"> <span select-cls="" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">' + defaultItem + '</span><span class="title-icon"></span></span>' + ulStr + '</span> </div> </li>');
            });

            var defineFields = util.getUserDefineFieldByType(1);
            var fieldUl = $('.customer-define-fields-list-warp', $el);
            if(defineFields && defineFields.length>0){
                fieldUl.show();
            }
            this.defineDateFieldArray = util.generateDefineField(fieldUl, defineFields, DateSelect);

            if(this.get('inSetting')){
                var currentEmp = util.getCurrentEmp();
                $('.crm-owner-wrapper', $el).show();
                $('.ownerID', $el).val(currentEmp.name).attr('data-id', currentEmp.employeeID);
            }
            publishHelper.AdjustTextAreaSize({
                element: $('.area-auto-height', $el)
            });
            $('.area-auto-height', $el).trigger('autosize.resize');
        },
        fillFormData: function(){
            var customerData = this.get('customerData') &&this.get('customerData').value.fCustomer;
            var $el = this.element;
            //编辑，填充基本信息
            if(customerData){
                $('.c-fullname', $el).val(customerData.fullName);
                $('.c-name', $el).val(customerData.name);
                $('.c-number', $el).val(customerData.fCustomerNo);
                $('.c-address', $el).val(customerData.address);
                $('.c-webSite', $el).val(customerData.webSite);
                $('.c-introduction', $el).val(customerData.introduction);

                //编辑，取客户的标签内容
                _.map(customerData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                $('.area-auto-height', $el).trigger('autosize.resize');

            }
        }
    });

    module.exports = CustomerDialog;
});