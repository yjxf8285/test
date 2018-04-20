/**
 *
 新建：
 var createDialog = new PaymentRecordDialog({
    contractID: 157,
    ownerID: 2,
    ownerName: '刘晨',
 });
 //保存成功后，回调
 createDialog.on('success', function(){
    //...
 });


 在回款计划列表中添加：
 var createDialogByPlan = new PaymentRecordDialog({
    contractID: 157,
    ownerID: 2,
    ownerName: '刘晨',
 });
 createDialogByPlan.show({
    ownerID: 2,
    ownerName: '刘晨',
    paymentTimes: 2,
    paymentTime: 0,
    amount: 111
 });

 编辑：
 var editDialog = new PaymentRecordDialog({
    contractID: 157,
    ownerID: 2,
    ownerName: '刘晨',
 });
 editDialog.show({
    contractPaymentRecordID: 179,
 });

 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-paymentrecord-edit/crm-paymentrecord-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = publishHelper.DateSelect;
    var CurrencyInput = require('uilibs/currency-input');
    var moment = require('moment');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');

    var PaymentRecordDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-paymentrecord-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            contractID: undefined,
            contractTitle: undefined,
            amount: undefined,
            paymentTime: undefined,
            paymentTimes: undefined,
            ownerID: undefined,
            ownerName: undefined,
            payTimes: [],
            contractPaymentRecordID: undefined
//            contractPaymentPlan: undefined,
//            contractPaymentPlanID: undefined,
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .paymentrecord-isBilling-checkbox-item': '_isBilling',
            'click .ownerID-btn': 'selectOwner'
        },
        "render": function () {
            var $el = this.element;
            var result = PaymentRecordDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件

            this.selectOwnerDialog = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":false,
                "title":"选择同事"
            });
            this.selectOwnerDialog.on('selected', function(obj){
                $('.ownerID', $el).val(obj.name).attr('data-id', obj.employeeID);
            });
            return result;
        },
        "hide": function () {
            var result = PaymentRecordDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            util.mnSetter($('.paymentType', $el), 1);
            util.mnSetter($('.paymentTimes', $el), 1);
            util.mnSetter($('.isBilling', $el), [false]);
            this.amount.reset();

            $('.area-auto-height', $el).val('').height(100);
            this.paymentTime.clear();
            this.set('contractPaymentRecordID', '');
            this.set('contractPaymentTimes', '');
            $('.contract-title', $el).val('');
            $('.ownerID', $el).val(this.get('ownerName')).attr('data-id', this.get('ownerID'));
            $('.paymentTimes', $el).show().prev().hide();
        },
        "show": function (opts) {
            var self = this;
            var $el = this.element;
            var result = PaymentRecordDialog.superclass.show.apply(this, arguments);
            if(opts){
                if(opts.contractPaymentRecordID)
                    this.set('contractPaymentRecordID', opts.contractPaymentRecordID);
                if(opts.contractTitle)
                    $('.contract-title', $el).val(opts.contractTitle);
                if(opts.ownerID && opts.ownerName)
                    $('.ownerID', $el).val(opts.ownerName).attr('data-id', opts.ownerID);
                if(opts.paymentTime)
                    this.paymentTime.setValue(opts.paymentTime*1000);
                if(opts.amount)
                    this.amount.setValue(opts.amount);
                if(opts.contractPaymentPlanID){
                    $('.paymentTimes', $el).hide().prev().val(opts.paymentTimes+'期').show();
                    this.set('contractPaymentTimes', opts.paymentTimes);
                }else{
                    $('.paymentTimes', $el).show().prev().hide();
                    util.mnSetter($('.paymentTimes', $el), opts.paymentTimes);
                }
            }
            var contractPaymentRecordID = this.get('contractPaymentRecordID') || undefined;
//            编辑
            if(contractPaymentRecordID){
                $('.paymentTimes', $el).hide().prev().show();
                util.api({
                    "url": '/Contract/GetContractPaymentRecordByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        contractPaymentRecordID: contractPaymentRecordID
                    },
                    "success": function (data) {
                        if (data.success) {
                            self.set('contractPaymentRecord', data) ;
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }else{
//                $('.paymentTimes', $el).show().prev().hide();
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var contractPaymentRecord = this.get('contractPaymentRecord') ? this.get('contractPaymentRecord').value : undefined;
            var contractPaymentRecordID = this.get('contractPaymentRecordID') ? this.get('contractPaymentRecordID') : undefined;
            var contractID = this.get('contractID') || 0;
            var ownerID = this.get('ownerID') || 0;

            var meEl = $(e.currentTarget);
            var $el = this.element;

            var amount = this.amount.val(),
                paymentTime = this.paymentTime.getTime(),
                paymentTimes = util.mnGetter($('.paymentTimes', $el)) || 1,
                description = $('.description', $el).val(),
                paymentType = util.mnGetter($('.paymentType', $el)) || 1,
                isBilling = util.mnGetter($('.isBilling', $el)).length>0 ? true : false,
                ownerID = $('.ownerID', $el).attr('data-id');

            if(amount == -1){
                util.alert('请填写正确金额');
                return ;
            }
            if(amount == 0){
                util.alert('金额必须大于0');
                return ;
            }
            if(paymentTime == 0){
                util.alert('请填写实际回款日期');
                return ;
            }

            if(contractPaymentRecord){
                util.api({
                    "url": '/Contract/UpdateContractPaymentRecord',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        contractPaymentRecordID: contractPaymentRecordID,
                        contractID: contractID,
                        ownerID: ownerID,
                        amount: amount,
                        paymentTime: paymentTime,
                        paymentType: paymentType,
                        isBilling: isBilling,
                        description: description
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
//                            that.v.refresh()//刷新列表
                            that.trigger("success");
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": '/Contract/AddContractPaymentRecord',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        contractID: contractID,
                        ownerID: ownerID,
                        amount: amount,
                        paymentTime: paymentTime,
                        paymentTimes: this.get('contractPaymentTimes') || paymentTimes,
                        paymentType: paymentType,
                        isBilling: isBilling,
                        description: description
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
//                            that.v.refresh();
                            that.trigger("success");
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }

        },
        setupDoms: function() {
            var elEl = this.element;
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        setupComponent: function() {
            var contractID = this.get('contractID') || undefined;
            var amount = this.get('amount') || 0;
            var paymentTime = this.get('paymentTime') || 0;
            var paymentTimes = this.get('paymentTimes') || 1;
            var ownerID = this.get('ownerID') || undefined;
            var ownerName = this.get('ownerName') || undefined;

            var $el = this.element;

            $('.ownerID', $el).val(ownerName).attr('data-id', ownerID);

            util.mnSelect($('.paymentType', $el),'syncModel', util.getPayWays());
            this.paymentTime = new DateSelect({
                "element": $('.paymentTime', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            if(paymentTime)
                this.paymentTime.setValue(paymentTime*1000);
            this.amount = new CurrencyInput({
                "element": $(".amount", $el)
            });
            if(amount)
                this.amount.setValue(amount);

            var paymentTimesOps = [];
            for(var i= 1,len=13; i<len; i++){
                paymentTimesOps.push({
                    value: i,
                    text: i+'期'
                });
            }
            util.mnSelect($('.paymentTimes', $el),'syncModel', paymentTimesOps);

            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });
        },
        fillFormData: function(){
            var contractPaymentRecordID = this.get('contractPaymentRecordID') ? this.get('contractPaymentRecordID') : undefined;
            var contractPaymentRecord = this.get('contractPaymentRecord') ? this.get('contractPaymentRecord').value : undefined;
            var $el = this.element;

            //编辑，填充基本信息
            if(contractPaymentRecord){
                this.set('contractID', contractPaymentRecord.contractID);
                this.amount.setValue(contractPaymentRecord.amount);
                this.paymentTime.setValue(contractPaymentRecord.paymentTime*1000);
                util.mnSetter($('.paymentTimes', $el), contractPaymentRecord.paymentTimes);
                $('.paymentTimes', $el).prev().val(contractPaymentRecord.paymentTimes+'期');
                $('.description', $el).val(contractPaymentRecord.description);
                $('.ownerID', $el).attr('data-id', contractPaymentRecord.ownerID).val(contractPaymentRecord.owner && contractPaymentRecord.owner.name);
                util.mnSetter($('.paymentType', $el), contractPaymentRecord.paymentType);
                if(contractPaymentRecord.isBilling){
                    util.mnSetter($('.isBilling', $el), [true]);
                }else{
                    util.mnSetter($('.isBilling', $el), [false]);
                }
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        },
        _isBilling: function(e){
            if($(e.target).hasClass('mn-selected')){
                $(e.target).next().next().hide();
            }else{
                $(e.target).next().next().show();
            }
        },
        selectOwner: function(){
            this.selectOwnerDialog.show();
        }
    });

    module.exports = PaymentRecordDialog;
});