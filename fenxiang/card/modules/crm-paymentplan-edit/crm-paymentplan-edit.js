/**
 *
 新建
 var createDialog = new PaymentPlanDialog({
    contractID: 157,
    contractTitle: 'ttt',
    ownerID: 2,
    ownerName: '刘晨',
 });
 createDialog.show({
    contractTitle: '',
    ownerID: '',
    ownerName: ''
 })
 //保存成功后，回调
 createDialog.on('success', function(){
    //...
 });

 编辑
 var createDialog = new PaymentPlanDialog({
    contractID: 157,
    contractTitle: 'ttt',
    ownerID: 2,
    ownerName: '刘晨',
 });
 createDialog.show({
    contractPaymentPlanID: 11,
    contractID: 157,
    contractTitle: 'ttt',
    ownerID: 2,
    ownerName: '刘晨',
 });

 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-paymentplan-edit/crm-paymentplan-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var moment = require('moment');
    var SelectCustomerDialog=require('modules/crm-select-customer/crm-select-customer');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var SelectOpp=require('modules/crm-select-opp/crm-select-opp');

    var PaymentPlanDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-paymentplan-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            contractID: undefined,
            contractTitle: undefined,
            contractPaymentPlan: undefined,
            contractPaymentPlanID: undefined,
            ownerID: undefined,
            ownerName: undefined,
            payTimes: []
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .contract-discount-checkbox-item': '_switchDiscount',
            'click .paymentplan-ownerID-btn': 'selectOwner'
        },
        "render": function () {

            var $el = this.element;
            var result = PaymentPlanDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            var self = this;

            this.selectOwnerDialog = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":false,
                "title":"选择同事"
            });
            this.selectOwnerDialog.on('selected', function(obj){
                $('.paymentplan-ownerID', $el).val(obj.name).attr('data-id', obj.employeeID);
            });
            return result;
        },
        "hide": function () {
            var result = PaymentPlanDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            $('.paymentplan-description', $el).val('').css('height', 100);
            util.mnSetter($('.paymentplan-paymentTimes', this.element), 1);
            this.expectedTime.clear();
            this.amount.reset();
            this.set('contractPaymentPlanID', '');
            $('.paymentplan-ownerID', $el).val(this.get('ownerName')).attr('data-id', this.get('ownerID'));
        },
        "show": function (opts) {
            var self = this;
            var $el = this.element;
            var result = PaymentPlanDialog.superclass.show.apply(this, arguments);

            if(opts){
                if(opts.contractPaymentPlanID)
                    this.set('contractPaymentPlanID', opts.contractPaymentPlanID);
                if(opts.contractTitle)
                    $('.contract-title', $el).val(opts.contractTitle);
                if(opts.ownerID && opts.ownerName)
                    $('.paymentplan-ownerID', $el).val(opts.ownerName).attr('data-id', opts.ownerID);
            }
            var contractPaymentPlanID = this.get('contractPaymentPlanID') ? this.get('contractPaymentPlanID') : undefined;
//            编辑
            if(contractPaymentPlanID){
                util.api({
                    "url": '/Contract/GetContractPaymentPlanByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        contractPaymentPlanID: contractPaymentPlanID
                    },
                    "success": function (data) {
                        if (data.success) {
                            self.set('contractPaymentPlan', data) ;
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
            var self = this;
            var contractPaymentPlan = this.get('contractPaymentPlan') ? this.get('contractPaymentPlan').value.contractPaymentPlan : undefined;
            var contractPaymentPlanID = this.get('contractPaymentPlanID') ? this.get('contractPaymentPlanID') : undefined;
            var contractID = this.get('contractID') || 0;
            var ownerID = this.get('ownerID') || 0;

            var meEl = $(e.currentTarget);
            var $el = this.element;

            var amount = this.amount.val(),
                expectedTime = this.expectedTime.getTime(),
                paymentTimes = util.mnGetter($('.paymentplan-paymentTimes', $el)) || 1,
                description = $('.paymentplan-description', $el).val(),
                ownerID = $('.paymentplan-ownerID', $el).attr('data-id');

            if(amount == -1){
                util.alert('请填写正确金额');
                return ;
            }
            if(amount == 0){
                util.alert('金额必须大于0');
                return ;
            }
            if(expectedTime == 0){
                util.alert('请填写计划回款日期');
                return ;
            }


            if(contractPaymentPlan){
                util.api({
                    "url": '/Contract/UpdateContractPaymentPlan',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        contractPaymentPlanID: contractPaymentPlanID,
                        ownerID: ownerID,
                        amount: amount,
                        expectedTime: expectedTime,
                        description: description
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            self.hide();
                            util.remind(2,"保存成功");
//                            self.v.refresh();
                            self.trigger("success");
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": '/Contract/AddContractPaymentPlan',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        contractID: contractID,
                        ownerID: ownerID,
                        amount: amount,
                        expectedTime: expectedTime,
                        paymentTimes: paymentTimes,
                        description: description
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            self.hide();
                            util.remind(2,"添加成功");
//                            self.v.refresh();
                            self.trigger("success");
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
            var contractPaymentPlan = this.get('contractPaymentPlan') || undefined;
            var contractTitle = this.get('contractTitle') || '';
            var ownerID = this.get('ownerID') || '';
            var ownerName = this.get('ownerName') || '';
            var $el = this.element;

            $('.contract-title', $el).val(contractTitle);
            $('.paymentplan-ownerID', $el).val(ownerName).attr('data-id', ownerID);

            this.expectedTime = new DateSelect({
                "element": $('.paymentplan-expectedTime', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.amount = new CurrencyInput({
                "element": $(".paymentplan-amount", $el)
            });

            var paymentTimesOps = [];
            for(var i= 1,len=13; i<len; i++){
                paymentTimesOps.push({
                    value: i,
                    text: i+'期'
                });
            }
            util.mnSelect($('.paymentplan-paymentTimes', $el),'syncModel', paymentTimesOps);

            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });
        },
        fillFormData: function(){
            var contractPaymentPlanID = this.get('contractPaymentPlanID') ? this.get('contractPaymentPlanID') : undefined;
            var contractPaymentPlan = this.get('contractPaymentPlan') ? this.get('contractPaymentPlan').value.contractPaymentPlan : undefined;
            var $el = this.element;

            //编辑，填充基本信息
            if(contractPaymentPlan){
                $('.paymentplan-paymentTimes', $el).hide().prev().val(contractPaymentPlan.paymentTimes+'期').show();
                this.amount.setValue(contractPaymentPlan.amount);
                this.expectedTime.setValue(contractPaymentPlan.expectedTime*1000);
                util.mnSetter($('.paymentplan-paymentTimes', $el), contractPaymentPlan.paymentTimes);
                $('.paymentplan-description', $el).val(contractPaymentPlan.description);
                $('.paymentplan-ownerID', $el).attr('data-id', contractPaymentPlan.ownerID).val(contractPaymentPlan.owner && contractPaymentPlan.owner.name);
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        },
        _switchDiscount: function(e){
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

    module.exports = PaymentPlanDialog;
});