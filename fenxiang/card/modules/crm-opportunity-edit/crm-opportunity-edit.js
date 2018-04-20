/**
 *
 *
 新建

 编辑(销售阶段隐藏)
 salesOpportunityID
 customerName

 客户下添加机会
 customerID
 customerName
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-opportunity-edit/crm-opportunity-edit.html');
    var Dialog = require('dialog');
    //    var CrmDataTables = require('uilibs/crmdatatable');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
//    var DataTables = require('datatable');
    var moment = require('moment');
//    var SearchBox = require('uilibs/search-box');//搜索框组件
//    var Pagination = require('uilibs/pagination2');//分页组件
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var SelectCustomerDialog=require('modules/crm-select-customer/crm-select-customer');

    var OpportunityDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-opportunity-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            oppData: undefined,
            salesOpportunityID: undefined,
            customerID: undefined,
            customerName: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide',
            'click .opp-customer-name-btn': 'selectCustomer'
//            'click .select-del': 'delSelect',
//            'keyup .crm-contacts-contact-way': 'addSelect',
//            'keyup .contact-address': 'addSelect'
        },
        "render": function () {
            var self = this;
            var $el = self.element;
            var result = OpportunityDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
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
                $('.opp-customer-name', $el).val(obj.name).attr('data-id', obj.customerID);
                $('.opp-customer-name', $el).trigger('autosize.resize');
            });
            setTimeout(function(){
                $('.opp-customer-name', $el).trigger('autosize.resize');
            }, 1);

            return result;
        },
        "hide": function () {
            this.selectCustomerDialog.hide();
            var result = OpportunityDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            var salesStagesInUse = FS.getAppStore('contactData').salesStagesInUse;
            var salesStageTags = [];
            _.map(salesStagesInUse, function(obj){
                salesStageTags.push({
                    value: obj.salesStageNo,
                    text: obj.name
                });
            });
            util.enableCrmBtn($('.opp-customer-name-btn', $el));
            $('.sales-stages-in-use', $el).parents('li').show();
            $('.area-auto-height', $el).val('').removeAttr('style');
            $('.opp-customer-name', $el).removeAttr('data-id').removeAttr('style');
            $('.mn-select-box', $el).each(function () {
                util.mnReset($(this));
            });
            util.mnReset($('.sales-stages-in-use', $el));
            util.mnSetter($('.sales-stages-in-use', $el),salesStageTags[0].value);//设置第一条的value为默认值

            this.starttimeDs.setValue(new Date().getTime());
            this.expectedDealTimeDs.clear();
            //清空选钱组件
            this.currencyInput.reset();
            $('.dialog-input-text', this.element).val('');
            _.map(this.defineDateFieldArray, function(obj){
                obj.dateObj.clear();
            })
        },
        "show": function (opts) {
            var self = this;
            var result;
            if(opts && opts.salesOpportunityID) {
                this.set('salesOpportunityID', opts.salesOpportunityID);
            }
            if(opts && opts.customerName && opts.customerID){
                this.set('customerName', opts.customerName);
                this.set('customerID', opts.customerID);
            }
            var salesOpportunityID = this.get('salesOpportunityID') || undefined;
            var customerName = this.get('customerName') || '';
            var customerID = this.get('customerID') || 0;

//            客户下创建机会，选择客户的按钮置灰
            if(customerName && customerID){
                $('.opp-customer-name', this.element).val(customerName).attr('data-id', customerID).removeAttr('style');
                util.disableCrmBtn($('.opp-customer-name-btn', this.element));
                setTimeout(function(){
                    $('.opp-customer-name', this.element).removeAttr('style').trigger('autosize.resize');
                }, 1);

            }
            if(salesOpportunityID){
                $('.sales-stages-in-use', this.element).parents('li').hide();
                util.disableCrmBtn($('.opp-customer-name-btn', this.element));
                util.api({
                    "url": '/SalesOpportunity/GetSalesOpportunityByID',
                    "type": 'get',
                    "dataType": 'json',
                    "async": false,
                    "data": {
                        salesOpportunityID: salesOpportunityID
                    },
                    "success": function (data) {
                        if (data.success) {
                            result = OpportunityDialog.superclass.show.apply(self, arguments);
                            self.set('oppData', data) ;
                            self.fillFormData();
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }else{
                result = OpportunityDialog.superclass.show.apply(this, arguments);
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var oppData = this.get('oppData') ? this.get('oppData').value.salesOpportunitys[0] : undefined;
            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var meEl = $(e.currentTarget);
            var $el = this.element;

            var name = $('.opp-name', $el).val(),
                customerID = $('.opp-customer-name', $el).attr('data-id') ||0,
                salesStageNo = util.mnGetter($('.sales-stages-in-use', $el))||1,
                expectedSalesAmount = this.currencyInput.val(),
                foundTime = (this.starttimeDs.getValue(true) && this.starttimeDs.getValue(true)._d && this.starttimeDs.getValue(true)._d.getTime()/1000) ||-1,
                expectedDealTime = (this.expectedDealTimeDs.getValue(true)&& this.expectedDealTimeDs.getValue(true)._d && this.expectedDealTimeDs.getValue(true)._d.getTime()/1000)||-1,
                demands =  $('.opp-demands', $el).val()||'',
                description = $('.opp-description', $el).val()||'',
                listTagOptionID = [],
                isOutReport;
            var $tagLis = $('.opportunity-tags-list-warp > li', $el);
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });

            if(name == ''){
                util.alert('请填写机会名称');return;
            }
            if(customerID == 0){
                util.alert('请选择客户');return;
            }
            if(expectedSalesAmount == -1){
                util.alert('请正确填写预计销售金额');return;
            }
            if(expectedSalesAmount == 0){
                util.alert('预计销售金额必须大于0');return;
            }
            if(foundTime== -1){
                util.alert('请填写发现时间');return;
            }
            if(expectedDealTime== -1){
                util.alert('请填写预计成交日期');return;
            }

            //自定义字段
            var $fieldUl = $('.opportunity-define-fields-list-warp', $el);
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

            if(oppData){
                util.api({
                    "url": '/SalesOpportunity/UpdateSalesOpportunity',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改机会发生错误，原因：',
                    "data": {
                        salesOpportunityID: parseInt(salesOpportunityID),
                        name: name,
                        expectedSalesAmount: expectedSalesAmount,
                        foundTime: foundTime,
                        expectedDealTime: expectedDealTime,
                        demands: demands,
                        description: description,
                        listTagOptionID: listTagOptionID,
                        dataList: dataList
//                        isOutReport: isOutReport
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"保存成功");
                            if(that.v && that.v.refresh)
                                that.v.refresh();
                            that.trigger('success');
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
                util.api({
                    "url": '/SalesOpportunity/AddSalesOpportunity',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        name: name,
                        customerID: customerID,
                        salesStageNo: salesStageNo,
                        expectedSalesAmount: expectedSalesAmount,
                        foundTime: foundTime,
                        expectedDealTime: expectedDealTime,
                        demands: demands,
                        description: description,
                        listTagOptionID: listTagOptionID,
                        dataList: dataList,
                        isOutReport: isOutReport
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
        setupDoms: function() {
            var elEl = this.element;
            this.autoHeightTextarea = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function() {
            var self = this;
            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var customerName = this.get('customerName') || undefined;
            var customerID = this.get('customerID') || undefined;
            //销售阶段
            var $el = this.element;

            if(salesOpportunityID){
                util.disableCrmBtn($('.opp-customer-name-btn', $el));
                $('.sales-stages-in-use', this.element).parents('li').hide();
            }
            if(customerID){
                util.disableCrmBtn($('.opp-customer-name-btn', $el));
                $('.opp-customer-name', $el).attr('data-id', customerID).val(customerName);
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
            this.expectedDealTimeDs = new DateSelect({
                "element": expectedDealTimeEl,
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });

            this.starttimeDs.setValue(new Date().getTime());

            this.currencyInput = new CurrencyInput({
                "element": $(".expected-sales-amount", $el)
            });
            var salesStagesInUse = FS.getAppStore('contactData').salesStagesInUse;
            var salesStageTags = [];
            _.map(salesStagesInUse, function(obj){
                salesStageTags.push({
                    value: obj.salesStageNo,
                    text: obj.name
                });
            });
            util.mnSelect($('.sales-stages-in-use', $el), 'syncModel', salesStageTags);
            util.mnSetter($('.sales-stages-in-use', $el),salesStageTags[0].value);//设置第一条的value为默认值
            var oppoTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.SALES_OPP);

            //textarea高度自适应
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
            //            自定义字段
            var defineFields = util.getUserDefineFieldByType(3);
            this.defineDateFieldArray = [];
            var fieldUl = $('.opportunity-define-fields-list-warp', $el);
            if(defineFields && defineFields.length>0){
                fieldUl.show();
            }
            this.defineDateFieldArray = util.generateDefineField(fieldUl, defineFields, DateSelect);
            publishHelper.AdjustTextAreaSize({
                element: $('.area-auto-height', $el)
            });
            $('.area-auto-height', $el).trigger('autosize.resize');
            $('.opp-customer-name', $el).removeAttr('style').trigger('autosize.resize');
        },
        fillFormData: function(){
            var salesOpportunityID = this.get('salesOpportunityID') || undefined;
            var oppData = this.get('oppData') ? this.get('oppData').value.salesOpportunitys[0] : undefined;
            var $el = this.element;
            var self = this;
            //编辑，填充基本信息
            if(oppData){
                $('.opp-name', $el).val(oppData.name);
                $('.opp-customer-name', $el).val(oppData.customerName).attr('data-id', oppData.customerID)
                util.mnSetter($('.sales-stages-in-use', $el), oppData.salesStageNo);
                this.currencyInput.setValue(oppData.expectedSalesAmount);
                this.starttimeDs.setValue(oppData.foundTime*1000);
                this.expectedDealTimeDs.setValue(oppData.expectedDealTime*1000);
                $('.opp-demands', $el).val(oppData.demands);
                $('.opp-description', $el).val(oppData.description);

                _.map(oppData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });

                //自定义字段
                if(oppData.userDefineFieldDataList && oppData.userDefineFieldDataList.dateList){
                    _.map(oppData.userDefineFieldDataList.dateList, function(date){
                        var obj = _.find(self.defineDateFieldArray, function(obj){
                            return obj.fieldName == date.fieldName;
                        });
                        if(date.value>0){
                            obj.dateObj.setValue(date.value*1000);
                        }
                    })
                }

                var $fieldUl = $('.opportunity-define-fields-list-warp', $el);
                if(oppData.userDefineFieldDataList && oppData.userDefineFieldDataList.numList){
                    _.map(oppData.userDefineFieldDataList.numList, function(obj){
                        $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('input').val(obj.value);
                    })
                }
                if(oppData.userDefineFieldDataList && oppData.userDefineFieldDataList.textList){
                    _.map(oppData.userDefineFieldDataList.textList, function(obj){
                        $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('textarea').val(obj.value);
                    })
                }


                $('.opp-customer-name', $el).removeAttr('style').trigger('autosize.resize');
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        },
        selectCustomer: function(){
            this.selectCustomerDialog.show();
        },
        destroy: function(){
        	util.mnDestroy($('.sales-stages-in-use', this.element));
            if(this.defineDateFieldArray) {
            	_.map(this.defineDateFieldArray, function(obj){
            		obj.dateObj && (obj.dateObj.destroy());
                })
            }
        	this.starttimeDs && (this.starttimeDs.destroy());
        	this.expectedDealTimeDs && (this.expectedDealTimeDs.destroy());
        	this.selectCustomerDialog && (this.selectCustomerDialog.destroy());
        	var result = OpportunityDialog.superclass.destroy.apply(this,arguments);
 			return result;
        }
    });

    module.exports = OpportunityDialog;
});