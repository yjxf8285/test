/**
 * @auther wangyunfu
 *
 *  新建 & 编辑 合同弹框

 新建合同===================================
    this.createDialog = new ContractDialog();
    this.createDialog.v = this;

 编辑合同===================================
 this.editDialog = new ContractDialog({
        contractID: 154
 });
 this.editDialog.v = this;

 客户下添加合同=============================
 this.createDialogInOpp = new ContractDialog({
    customerID: 22,
    customerName: 'ss'
 });
 this.createDialogInOpp.v = this;
 机会下添加合同=============================
 this.createDialogInOpp = new ContractDialog({
    salesOpportunityID: 11,
    salesOpportunityName: 'tt',
    customerID: 22,
    customerName: 'ss'
 });
 this.createDialogInOpp.v = this;



 *
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-contract-edit/crm-contract-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var moment = require('moment');
    var SelectCustomerDialog=require('modules/crm-select-customer/crm-select-customer');
    var SelectColleague=require('modules/crm-select-colleague/crm-select-colleague');
    var SelectOpp=require('modules/crm-select-opp/crm-select-opp');

    var ContractDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-contract-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            contractData: undefined,
            contractID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
//            'click .contract-discount-checkbox-item': '_switchDiscount',
            'click .contract-opp-name-btn': 'selectOpp',
            'click .contract-customer-name-btn': 'selectCustomer',
            'click .contract-ownerID-btn': 'selectOwner',
            'click .contract-signerID-btn': 'selectSigner'
        },
        "render": function () {
            var $el = this.element;
            var result = ContractDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            var self = this;
            this.selectOppDialog = new SelectOpp({//TODO
//                "title":"选择客户",
//                "url":"/FCustomer/GetFCustomers/",
                "condition":{
                    "employeeID": util.getCurrentEmp().employeeID,
                    customerID: self.get('customerID')||0
                }
            });
            this.selectOppDialog.on('selected', function(obj){
                util.disableCrmBtn($('.contract-customer-name-btn', $el));
                $('.contract-opp-name', $el).val(obj.name).attr('data-id', obj.salesOpportunityID).trigger('autosize.resize');
                $('.contract-customer-name', $el).val(obj.customerName).attr('data-id', obj.customerID);
                self.totalAmount.setValue(obj.expectedSalesAmount);
            });
            this.selectCustomerDialog = new SelectCustomerDialog({
                "title":"选择客户",
                "url":"/FCustomer/GetFCustomers/",
                "defaultCondition":{
                    "employeeID": util.getCurrentEmp().employeeID,//int，员工ID
                    "isFirstChar":false,// bool，是否首字母查询
                    //"ownerIDs"[],//
                    "listTagOptionID":"",//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                    "sortType":2,//int，排序规则(按照最后更新时间或者关注时间倒序=1；按照客户nameSpell、Name正排序=2;先按照归属人nameSpell、Name正排，再按照客户的最后变化时间倒排，当前用户的客户排列在前面=3)
                    "queryType":2,//int，查询类型(全部客户=1；我的客户=2；下属的客户=3;关注的客户=4;)
                    "keyword":"",
                    "pageSize":12,
                    "pageNumber":1
                }
            });
            this.selectCustomerDialog.on('selected', function(obj){
                $('.contract-customer-name', $el).val(obj.name).attr('data-id', obj.customerID).trigger('autosize.resize');;
            });

            this.selectOwnerDialog = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":false,
                "title":"选择同事"
            });
            this.selectOwnerDialog.on('selected', function(obj){
                $('.contract-ownerID', $el).val(obj.name).attr('data-id', obj.employeeID).trigger('autosize.resize');;
            });
            this.selectSignerDialog = new SelectColleague({
                "isMultiSelect":false,
                "hasWorkLeaveBtn":false,
                "title":"选择同事"
            });
            this.selectSignerDialog.on('selected', function(obj){
                $('.contract-signerID', $el).val(obj.name).attr('data-id', obj.employeeID).trigger('autosize.resize');;
            });

            return result;
        },
        "hide": function () {
            try{
                this.selectOppDialog.hide();
                this.selectCustomerDialog.hide();
                this.selectOwnerDialog.hide();
                this.selectSignerDialog.hide();
            }catch(ex){}
            var result = ContractDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            util.enableCrmBtn($('.contract-opp-name-btn', $el));
            util.enableCrmBtn($('.contract-customer-name-btn', $el));
            util.enableCrmBtn($('.contract-ownerID-btn', $el));

            $('.dialog-input-text', $el).val('');
            $('.area-auto-height', $el).val('').removeAttr('style');
            $('.contract-opp-name', $el).removeAttr('data-id').val('');
            $('.contract-customer-name', $el).removeAttr('data-id').val('');

            //重置所有下拉框默认值
            $('.mn-select-box', $el).each(function () {
                util.mnReset($(this));
            });
            util.mnSetter($('.contract-discount', $el), [false]);
            $('.contract-discount', $el).find('input').val(10);
            $('.contract-discount', $el).find('input').parent().hide();
            this.totalAmount.reset();
            this.signDate.clear();
            this.beginDate.clear();
            this.endDate.clear();

            var emp = util.getCurrentEmp();
            $('.contract-ownerID', $el).val(emp.name).attr('data-id', emp.employeeID);
            $('.contract-signerID', $el).val(emp.name).attr('data-id', emp.employeeID);
        },
        "show": function (opts) {
            var self = this;
            var result;
            if(opts && opts.contractID)
                this.set('contractID', opts.contractID);
            var contractID = this.get('contractID') || undefined;
            this.fillExitsData();
//            编辑
            if(contractID){
                util.api({
                    "url": '/Contract/GetContractByID',
                    "type": 'get',
                    "dataType": 'json',
                    "errorMsgTitle": '获取合同发生错误。原因：',
                    "async": false,
                    "data": {
                        contractID: contractID
                    },
                    "success": function (data) {
                        if (data.success) {
                            result = ContractDialog.superclass.show.apply(self, arguments);
                            self.set('contractData', data) ;
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }else{
                result = ContractDialog.superclass.show.apply(this, arguments);
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var contractData = this.get('contractData') ? this.get('contractData').value.hContractEntity[0] : undefined;
            var contractID = this.get('contractID') || undefined;
            var meEl = $(e.currentTarget);
            var $el = this.element;

            var title = $('.contract-title', $el).val(),
                salesOpportunityID = $('.contract-opp-name', $el).attr('data-id') || 0,
                customerID = $('.contract-customer-name', $el).attr('data-id') || 0,
                totalAmount = this.totalAmount.val(),
                discount = 10,

                signDate = this.signDate.getTime(),
                beginDate = this.beginDate.getTime(),
                endDate = this.endDate.getTime(),

                ownerID = $('.contract-ownerID', $el).attr('data-id') || 0,
                signerID = $('.contract-signerID', $el).attr('data-id') || 0,

                customerSigner = $('.contract-customerSigner', $el).val(),
                contractNO = $('.contract-contractNO', $el).val(),
                content = $('.contract-content', $el).val(),
                productDescription = $('.contract-productDescription', $el).val(),
                description = $('.contract-description', $el).val(),
                isSalesStageWin = false,
                isSetExpectedDealTime = false,
                paymentType = util.mnGetter($('.contract-paymentType', $el)) || 1,
                listTagOptionID = [];

            if(title==''){
                util.alert('标题不能为空');return;
            }
            if(customerID == 0){
                util.alert('请选择客户');return;
            }
            if(totalAmount==-1){
                util.alert('请正确填写总金额');return;
            }
            var d = util.mnGetter($('.contract-discount', $el));
            if(d && d.length>0){
                discount = $('.contract-discount', $el).find('input').val() || 10;
            }
            if(signDate == 0){
                util.alert('请填写签约日期');return ;
            }
            if(beginDate == 0){
                util.alert('请填写开始日期');return ;
            }
            if(endDate == 0){
                util.alert('请填写结束日期');return ;
            }


            var $tagLis = $('.contract-tags-list-warp > li', $el);
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                if(fBusinessTagID)
                    listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });


            if(contractData){
                util.api({
                    "url": '/Contract/UpdateContract',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改合同发生错误，原因：',
                    "data": {
                        contractID: contractID,
                        title: title,
                        customerID: customerID,
                        totalAmount: totalAmount,
                        beginDate: beginDate,
                        endDate: endDate,
                        paymentType: paymentType,
                        productDescription: productDescription,
                        customerSigner: customerSigner,
                        signerID: signerID,
                        signDate: signDate,
                        contractNO: contractNO,
                        content: content,
                        description: description,
                        ownerID: ownerID,
                        discount: discount,
                        salesOpportunityID: salesOpportunityID,
                        listTagOptionID: listTagOptionID,
                        isSalesStageWin: isSalesStageWin,
                        isSetExpectedDealTime: isSetExpectedDealTime
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
                            if(that.v && that.v.refresh)
                                that.v.refresh();
                            that.trigger('success')
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": '/Contract/AddContract',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加合同发生错误，原因：',
                    "data": {
                        title: title,
                        customerID: customerID,
                        totalAmount: totalAmount,
                        beginDate: beginDate,
                        endDate: endDate,
                        paymentType: paymentType,
                        productDescription: productDescription,
                        customerSigner: customerSigner,
                        signerID: signerID,
                        signDate: signDate,
                        contractNO: contractNO,
                        content: content,
                        description: description,
                        ownerID: ownerID,
                        discount: discount,
                        salesOpportunityID: salesOpportunityID,
                        listTagOptionID: listTagOptionID,
                        isSalesStageWin: isSalesStageWin,
                        isSetExpectedDealTime: isSetExpectedDealTime
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
                            if(that.v && that.v.refresh)
                                that.v.refresh();
                            that.trigger('success')
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
        fillExitsData: function(){
            var contractID = this.get('contractID')||undefined;
            var salesOpportunityID = this.get('salesOpportunityID') || undefined;
            var salesOpportunityName = this.get('salesOpportunityName') || undefined;
            var customerID = this.get('customerID') || undefined;
            var customerName = this.get('customerName') || undefined;

            var $el = this.element;
            var self = this;

            //编辑
            if(contractID){
                util.disableCrmBtn($('.contract-opp-name-btn', $el));
                util.disableCrmBtn($('.contract-customer-name-btn', $el));
                util.disableCrmBtn($('.contract-ownerID-btn', $el));
            }
            //客户下新建
            if(customerID && customerName){
                util.disableCrmBtn($('.contract-customer-name-btn', $el));
                $('.contract-customer-name', $el).attr('data-id', customerID).val(customerName);
            }
            //机会下新建
            if(salesOpportunityID && customerID){
                util.disableCrmBtn($('.contract-opp-name-btn', $el));
                util.disableCrmBtn($('.contract-customer-name-btn', $el));
                $('.contract-opp-name', $el).attr('data-id', salesOpportunityID).val(salesOpportunityName);
                $('.contract-customer-name', $el).attr('data-id', customerID).val(customerName);
            }

            var emp = util.getCurrentEmp();
            $('.contract-ownerID', $el).val(emp.name).attr('data-id', emp.employeeID);
            $('.contract-signerID', $el).val(emp.name).attr('data-id', emp.employeeID);
            setTimeout(function(){
                self.conTextareaEl.trigger('autosize.resize');
            }, 1);
        },
        setupComponent: function() {
            var contractID = this.get('contractID')||undefined;
            var $el = this.element;
            var self = this;

            this.fillExitsData();

            this.signDate = new DateSelect({
                "element": $('.contract-signDate', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.beginDate = new DateSelect({
                "element": $('.contract-beginDate', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.endDate = new DateSelect({
                "element": $('.contract-endDate', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.totalAmount = new CurrencyInput({
                "element": $(".contract-totalAmount", $el)
            });

            util.mnSelect($('.contract-paymentType', $el),'syncModel', util.getPayWays());

            util.mnEvent($('.contract-discount', $el), 'change', function(e){
                var $input = $('.contract-discount', $el).find('input').parent();
                var vals = util.mnGetter($('.contract-discount', $el));
                if(vals && vals[0]){
                    $input.hide();
                }else{
                    $input.show();
                }
            });

            $('.contract-discount', $el).find('input').bind('change', function(e) {
                var value = $(e.target).val();
                var $this = $(e.target);
                var v, vInt, vFloat=0;
                if(value == '' || value == 10) return;

                if(!/^\d{1}(.[0-9]{0,2})?$/.test(value)){
                    util.alert('请输入正确的折扣', function(){
                        $this.val('');
                    });
                }
            });

            var tagUl = $('.contract-tags-list-warp', $el);

            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });

//            实例化下拉框
            var oppoTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.CONTRACT);
            _.each(oppoTags, function (tag, index) {
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
                tagUl.append('<li class="fn-clear"> <div class="selects-tit inputs-tit f-business-tag-id" data-fbusinesstagid="' + tag.fBusinessTagID + '"> '
                    + name + ' </div> <div class="selects-warp"> <span select-cls="" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">' + defaultItem + '</span><span class="title-icon"></span></span>' + ulStr + '</span> </div> </li>');
            });
            setTimeout(function(){
                self.conTextareaEl.trigger('autosize.resize');
            }, 1);

        },
        fillFormData: function(){
            var contractID = this.get('contractID') ? this.get('contractID') : undefined;
            var contractData = this.get('contractData') ? this.get('contractData').value.hContractEntity[0] : undefined;
            var $el = this.element;

            //编辑，填充基本信息
            if(contractData){
                $('.contract-opp-name-btn', $el).attr({disabled: true}).css('opacity','.5');
                $('.contract-customer-name-btn', $el).attr({disabled: true}).css('opacity','.5');
                $('.contract-ownerID-btn', $el).attr({disabled: true}).css('opacity','.5');

                $('.contract-title', $el).val(contractData.title);
                $('.contract-opp-name', $el).attr('data-id', contractData.salesOpportunityID).val(contractData.salesOpportunityName);
                $('.contract-customer-name', $el).attr('data-id', contractData.customerID).val(contractData.customerName);
                this.totalAmount.setValue(contractData.totalAmount);

                this.signDate.setValue(contractData.signDate*1000);
                this.beginDate.setValue(contractData.beginDate*1000);
                this.endDate.setValue(contractData.endDate*1000);

                $('.contract-ownerID', $el).attr('data-id', contractData.ownerID).val(contractData.owner.name);
                $('.contract-signerID', $el).attr('data-id', contractData.signerID).val(contractData.signer.name);

                $('.contract-customerSigner', $el).val(contractData.customerSigner);
                $('.contract-contractNO', $el).val(contractData.contractNO);
                $('.contract-content', $el).val(contractData.content);
                $('.contract-productDescription', $el).val(contractData.productDescription);
                $('.contract-description', $el).val(contractData.description);
                util.mnSetter($('.contract-paymentType', $el), contractData.paymentType);

                if(contractData.discount == 10){
                    util.mnSetter($('.contract-discount', $el), [false]);
                    $('.contract-discount', $el).find('input').val(10);
                    $('.contract-discount', $el).find('input').parent().hide();
                }else{
                    util.mnSetter($('.contract-discount', $el), [true]);
                    $('.contract-discount', $el).find('input').val(contractData.discount);
                    $('.contract-discount', $el).find('input').parent().show();
                }

                _.map(contractData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                this.conTextareaEl.trigger('autosize.resize');
            }
        },
//        _switchDiscount: function(e){
//
//            if($(e.target).hasClass('mn-selected')){
//                alert('true')
//                $(e.target).next().next().hide();
//            }else{
//                alert('false')
//                $(e.target).next().next().show();
//            }
//        },
        selectOpp: function(){
            this.selectOppDialog.show();
        },
        selectCustomer: function(){
            this.selectCustomerDialog.show();
        },
        selectOwner: function(){
            this.selectOwnerDialog.show();
        },
        selectSigner: function(){
            this.selectSignerDialog.show();
        }
    });

    module.exports = ContractDialog;
});