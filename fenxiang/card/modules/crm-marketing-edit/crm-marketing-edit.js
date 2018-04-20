/**
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-marketing-edit/crm-marketing-edit.html');
////    require('modules/crm-marketing-edit/crm-marketing-edit.css');
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

    var MarketingDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-marketing-template').html(),
            className: 'dialog-crm',
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            marketingEventData: undefined,
            marketingEventID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide'
        },
        "render": function () {
            var self = this;
            var $el = self.element;
            var result = MarketingDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = MarketingDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            //清空所有输入框val
            $('.area-auto-height', this.element).val('').removeAttr('style');
            $('.dialog-input-text', this.element).val('');
            //清空时间控件
            this.beginDate.clear();
            this.endDate.clear();
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });
            //清空选钱组件
            this.expectedCost.reset();
            this.actualCost.reset();
            this.expectedIncome.reset();
            this.actualIncome.reset();
        },
        "show": function () {
            var self = this;
            var result ;//= MarketingDialog.superclass.show.apply(self, arguments);
            var marketingEventID = this.get('marketingEventID') ? this.get('marketingEventID') : undefined;
            this.fillTags();
//            编辑
            if(marketingEventID){
                util.api({
                    "url": '/MarketingEvent/GetMarketingEventByID',
                    "type": 'get',
                    "dataType": 'json',
                    "async": false,
                    "data": {
                        marketingEventID: marketingEventID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.marketingEvents && data.value.marketingEvents.length>0){
                                result = MarketingDialog.superclass.show.apply(self, arguments);
                                self.set('marketingEventData', data.value.marketingEvents[0]) ;
                                self.fillFormData();
                            }
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }else{
                result = MarketingDialog.superclass.show.apply(this, arguments);
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var marketingEventData = this.get('marketingEventData') ? this.get('marketingEventData') : undefined;
            var marketingEventID = this.get('marketingEventID') ? this.get('marketingEventID') : undefined;
            var meEl = $(e.currentTarget);
            var $el = this.element;

            var name = $('.marketing-name', $el).val(),
                beginDate = this.beginDate.getTime(),
                endDate = this.endDate.getTime(),
                expectedCost = this.expectedCost.val(),
                actualCost = this.actualCost.val(),
                expectedIncome = this.expectedIncome.val(),
                actualIncome = this.actualIncome.val(),
                location = $('.marketing-location', $el).val(),

                marketingPlan = $('.marketing-marketingPlan', $el).val(),
                executionDescription = $('.marketing-executionDescription', $el).val(),
                summary = $('.marketing-summary', $el).val(),
                effect = $('.marketing-effect', $el).val(),
                description = $('.marketing-description', $el).val(),
                listTagOptionID = [];

            if(expectedCost ==-1){

            }
//            expectedCost = this.expectedCost.val(),
//                actualCost = this.actualCost.val(),
//                expectedIncome = this.expectedIncome.val(),
//                actualIncome = this.actualIncome.val(),

            if(!name){
                util.alert('活动名称不能为空！');
                return ;
            }
            if(!beginDate){
                util.alert('开始日期不能为空！');
                return ;
            }
            if(!endDate){
                util.alert('结束日期不能为空！');
                return ;
            }
            var $tagLis = $('.marketing-tags-list-warp > li', $el);
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });


            if(marketingEventData){
                util.api({
                    "url": '/MarketingEvent/UpdateMarketingEvent',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改市场发生错误，原因：',
                    "data": {
                        marketingEventID: marketingEventID,
                        name: name,
                        beginDate: beginDate,
                        endDate: endDate,
                        expectedCost: expectedCost,
                        actualCost: actualCost,
                        expectedIncome: expectedIncome,
                        actualIncome: actualIncome,
                        location: location,
                        marketingPlan: marketingPlan,
                        executionDescription: executionDescription,
                        summary: summary,
                        effect: effect,
                        description: description,
                        listTagOptionID: listTagOptionID
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
                    "url": '/MarketingEvent/AddMarketingEvent',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加市场发生错误，原因：',
                    "data": {
                        name: name,
                        beginDate: beginDate,
                        endDate: endDate,
                        expectedCost: expectedCost,
                        actualCost: actualCost,
                        expectedIncome: expectedIncome,
                        actualIncome: actualIncome,
                        location: location,
                        marketingPlan: marketingPlan,
                        executionDescription: executionDescription,
                        summary: summary,
                        effect: effect,
                        description: description,
                        listTagOptionID: listTagOptionID
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
        setupDoms: function() {
            var elEl = this.element;
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function() {
            var marketingEventID = this.get('marketingEventID') ? this.get('marketingEventID') : undefined;
            var $el = this.element;

            if(marketingEventID){
                $('.select-customer-btn', $el).attr({
                    disabled: true,
                    opacity:.5
                })
            }

            var expectedDealTimeEl = $('.expected-deal-time', $el);
            this.beginDate = new DateSelect({
                "element": $('.marketing-beginDate', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.endDate = new DateSelect({
                "element": $('.marketing-endDate', $el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            this.expectedCost = new CurrencyInput({
                "element": $(".marketing-expectedCost", $el)
            });
            this.actualCost = new CurrencyInput({
                "element": $(".marketing-actualCost", $el)
            });
            this.expectedIncome = new CurrencyInput({
                "element": $(".marketing-expectedIncome", $el)
            });
            this.actualIncome = new CurrencyInput({
                "element": $(".marketing-actualIncome", $el)
            });

            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });
            this.fillTags();


        },
        //实例化下拉框（新建 ｜ 编辑）
        fillTags: function() {
        	var tagUl = $('.marketing-tags-list-warp', this.$el),
        		marketingTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.MARKETING),
        		html = [];
            _.each(marketingTags, function (tag, index) {
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
                html.push('<li class="fn-clear"> <div class="selects-tit inputs-tit f-business-tag-id" data-fbusinesstagid="' + tag.fBusinessTagID + '"> '
                    + name + ' </div> <div class="selects-warp"> <span select-cls="" class="mn-select-box "><span class="mn-select-title-wrapper select-for-dialog"><span class="mn-select-title ">' + defaultItem + '</span><span class="title-icon"></span></span>' + ulStr + '</span> </div> </li>');
            });
            tagUl.html(html.join(''));
        },
        fillFormData: function(){
            var marketingEventID = this.get('marketingEventID') ? this.get('marketingEventID') : undefined;
            var marketingEventData = this.get('marketingEventData') ? this.get('marketingEventData') : undefined;
            var $el = this.element;

            //编辑，填充基本信息
            if(marketingEventData){
                $('.marketing-name', $el).val(marketingEventData.name);

                this.beginDate.setValue(marketingEventData.beginDate*1000);
                this.endDate.setValue(marketingEventData.endDate*1000);
                this.expectedCost.setValue(marketingEventData.expectedCost);
                this.actualCost.setValue(marketingEventData.actualCost);
                this.expectedIncome.setValue(marketingEventData.expectedIncome);
                this.actualIncome.setValue(marketingEventData.actualIncome);

                $('.marketing-location', $el).val(marketingEventData.location);
                $('.marketing-marketingPlan', $el).val(marketingEventData.marketingPlan);
                $('.marketing-executionDescription', $el).val(marketingEventData.executionDescription);
                $('.marketing-summary', $el).val(marketingEventData.summary);
                $('.marketing-effect', $el).val(marketingEventData.effect);
                $('.marketing-description', $el).val(marketingEventData.description);

                _.map(marketingEventData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        }
    });

    module.exports = MarketingDialog;
});