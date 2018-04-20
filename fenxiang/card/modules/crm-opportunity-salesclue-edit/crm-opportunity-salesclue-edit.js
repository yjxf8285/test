/**
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-opportunity-salesclue-edit/crm-opportunity-salesclue-edit.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var DataTables = require('datatable');
    var moment = require('moment');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var SelectCustomerDialog=require('modules/crm-select-customer/crm-select-customer');

    var OpportunityDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-opportunity-salesclue-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            salesClueID: undefined,
            customerName: undefined,
            contactName: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .isCreateSalesOpportunity-item': '_switchCreateOpp',
            'blur .fCustomerName': '_checkCustomerExits'
//            'click .select-del': 'delSelect',
//            'keyup .crm-contacts-contact-way': 'addSelect',
//            'keyup .contact-address': 'addSelect'
        },
        _checkCustomerExits: function(){
            var customerName = $('.fCustomerName', this.element).val() || (this.get('customerName') ? this.get('customerName') : '');
            var self = this;
            util.api({
                "url": '/FCustomer/CheckCustomerNameExists',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    name: customerName
                },
                "success": function (responseData) {
                    var info = '';
                    if (responseData.success) {
                        if(responseData.value.value){
                            if(responseData.value.value1){
                                info = '客户已存在，并且您拥有使用该客户的权限';
                                $('.customer-exits-flag-icon', self.element).removeClass('customer-exits-flag-icon-cuo').addClass('customer-exits-flag-icon-dui');
                            }else{
                                info = '客户已存在，您不能使用该客户';
                                $('.customer-exits-flag-icon', self.element).removeClass('customer-exits-flag-icon-dui').addClass('customer-exits-flag-icon-cuo');
                            }
                        }else{
                            info = '客户不存在，系统将自动创建';
                            $('.customer-exits-flag-icon', self.element).removeClass('customer-exits-flag-icon-cuo').addClass('customer-exits-flag-icon-dui');
                        }
                        $('.customer-exits-flag-text', self.element).text(info);
                    }
                }
            }, {
                "submitSelector": ''
            });

        },
        _switchCreateOpp: function(e){
            if($(e.target).hasClass('mn-selected')){
                $('.isCreateSalesOpportunity-content', this.element).hide();
            }else{
                $('.isCreateSalesOpportunity-content', this.element).show();
            }
        },
        "render": function () {
            var self = this;
            var $el = self.element;
            var result = OpportunityDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件

            util.mnEvent($('.sales-stages-in-use', $el),'change',function (val) {
                   console.log(val);
            });
            
            return result;
        },
        "hide": function () {
            var result = OpportunityDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            $('.area-auto-height', $el).val('');
            //重置所有下拉框默认值
            $('.mn-select-box', $el).each(function () {
                util.mnReset($(this));
            });
            util.mnSetter($('.sales-stages-in-use', $el), '1');
            util.mnSetter($('.isCreateSalesOpportunity', $el), []);
            $('.isCreateSalesOpportunity-content', $el).hide();

            this.starttimeDs.setValue(new Date());
            this.expectedDealTimeDs.clear();
            //清空选钱组件
            this.currencyInput.reset();
        },
        "show": function (opt) {
            var result = OpportunityDialog.superclass.show.apply(this, arguments);

            var $el = this.element;

            if(opt && opt.customerName)
                this.set('customerName', opt.customerName);
            if(opt && opt.contactName)
                this.set('contactName', opt.contactName);
            var customerName = this.get('customerName')||'';
            var contactName = this.get('contactName')||'';
            if(customerName){
                $('.fCustomerName', $el).val(customerName);
            }
            if(contactName){
                $('.contactName', $el).val(contactName);
            }
            this.autoHeightTextarea.trigger('autosize.resize');
            this._checkCustomerExits();
            return result;
        },
        "submit": function (e) {
            var that = this;
            var salesClueID = this.get('salesClueID') ? this.get('salesClueID') : 0;
            var customerName = this.get('customerName') ? this.get('customerName') : '';
            var contactName = this.get('contactName') ? this.get('contactName') : '';

            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var meEl = $(e.currentTarget);
            var $el = this.element;
            customerName = $('.fCustomerName', $el).val();
            var name = $('.opp-name', $el).val(),
                customerID = $('.opp-customer-name', $el).attr('data-customer-id'),
                salesStageNo = util.mnGetter($('.sales-stages-in-use', $el)) || FS.getAppStore('contactData').salesStagesInUse[0].salesStageNo,
                expectedSalesAmount = this.currencyInput.val() || 0,
                foundTime = this.starttimeDs.getTime() || 0,
                expectedDealTime = this.expectedDealTimeDs.getTime() || 0,
                demands =  $('.opp-demands', $el).val(),
                description = $('.opp-description', $el).val(),
                listTagOptionID = [],
                isCreateSalesOpportunity = false,
                isOutReport;

            var d = util.mnGetter($('.isCreateSalesOpportunity', $el));
            if(d && d.length>0){
                if(d[0] == true)
                    isCreateSalesOpportunity = true;
                else
                    isCreateSalesOpportunity = false;
            }else{
                isCreateSalesOpportunity = false;
            }

            var $tagLis = $('.opportunity-tags-list-warp > li', $el);
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });


            util.api({
                "url": '/SalesClue/CreateFCustomerAndContactAndSalesOpportunity',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    salesClueID: salesClueID,
                    fCustomerName: customerName,
                    contactName: contactName,
                    isCreateSalesOpportunity: isCreateSalesOpportunity,

                    sopName: name,

                    sopSalesStageNo: salesStageNo,
                    sopExpectedSalesAmount: expectedSalesAmount,
                    sopFoundTime: foundTime,
                    sopExpectedDealTime: expectedDealTime,
                    sopDemands: demands,
                    sopDescription: description,
                    listTagOptionID: listTagOptionID,
                    sopIsOutReport: isOutReport
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.hide();
                        util.remind(2,"添加成功");
                        that.v.refresh()//刷新列表
                    }
                }
            }, {
                "submitSelector": meEl
            });

        },
//        delSelect: function(e){
//            var cLi = $(e.target).parent().parent();
//            if(cLi.parent().children().length == 1){
//            }else{
//                cLi.remove();
//            }
//        },
//        addSelect: function(e){
//            var $el = $(e.target);
//            var cLi = $el.parent().parent();
//            if(cLi.next().length == 0){
//                $el.next().show();
//                var selectLi;
//                if($el.hasClass('contact-address')){
//                    selectLi = $(htmltpl).filter('.dialog-contacts-address');
//                }else{
//                    selectLi = $(htmltpl).filter('.dialog-contacts-contact-way');
//
//                }
//                cLi.parent().append(selectLi);
//                util.mnSelect(selectLi.find('.mn-select-box'),'syncModel', util.getContactsWays());
//
//                publishHelper.AdjustTextAreaSize({
//                    element: selectLi.find('.area-auto-height')
//                });
//            }
//        },
        // 设置Doms
        setupDoms: function() {
            var elEl = this.element;
            this.autoHeightTextarea = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function() {
            var salesClueID = this.get('salesClueID') ? this.get('salesClueID') : 0;
            var customerName = this.get('customerName') ? this.get('customerName') : '';
            var contactName = this.get('contactName') ? this.get('contactName') : '';

            //销售阶段
            var salesStagesInUse = FS.getAppStore('contactData').salesStagesInUse;
            var $el = this.element;

            if(customerName){
                $('.fCustomerName', this.element).val(customerName);
            }
            if(contactName){
                $('.contactName', this.element).val(contactName);
            }

            var tagUl = $('.opportunity-tags-list-warp', $el);
            var startTimeEl = $('.found-time', $el);
            var expectedDealTimeEl = $('.expected-deal-time', $el);
            this.starttimeDs = new DateSelect({
                "element": startTimeEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.starttimeDs.setValue(new Date());
            this.expectedDealTimeDs = new DateSelect({
                "element": expectedDealTimeEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });

            this.currencyInput = new CurrencyInput({
                "element": $(".expected-sales-amount", $el)
            });

            var salesStageTags = [];
            _.map(salesStagesInUse, function(obj){
                salesStageTags.push({
                    value: obj.salesStageNo,
                    text: obj.name
                });
            })
            util.mnSelect($('.sales-stages-in-use', $el), 'syncModel', salesStageTags);

            var oppoTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.SALES_OPP);

            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.autoHeightTextarea
            });
            //实例化下拉框
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

            $('.area-auto-height', $el).trigger('autosize.resize');

        },
        fillFormData: function(){
            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var oppData = this.get('oppData') ? this.get('oppData').value.salesOpportunitys[0] : undefined;
            var $el = this.element;

            //编辑，填充基本信息
            if(oppData){
                $('.opp-name', $el).val(oppData.name);
                $('.opp-customer-name', $el).val(oppData.name).attr('data-customer-id', oppData.customerID);
                util.mnSetter($('.sales-stages-in-use', $el), oppData.salesStageNo);
                this.currencyInput.setValue(oppData.expectedSalesAmount);
                this.starttimeDs.setValue(oppData.foundTime);
                this.expectedDealTimeDs.setValue(oppData.expectedDealTime);
                $('.opp-demands', $el).val(oppData.demands)
                $('.opp-description', $el).val(oppData.description);

                _.map(oppData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
            }
        }
    });

    module.exports = OpportunityDialog;
});