/**
 *
var d = new ProductInOppDialog({
    oppProductRelationID: 179
})
d.show({
    flag: 'view', //edit
    oppProductRelationID: 179
});
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-productinopp-edit/crm-productinopp-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var moment = require('moment');

    var ProductInOppDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-productinopp-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            oppProductRelations: undefined,
            oppProductRelationID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-back': '_back',
            'click .dialog-button-close': 'hide',
            'click .dialog-button-edit': '_showEditWrapper',
            'click .dialog-button-cancel': '_showViewWrapper',
            'click .left-list li': '_switchNav'
        },
        _back: function(){
            $('.base-info', this.element).trigger('click');
        },
        _showEditWrapper: function(){
            var self = this;
            this.set('flag', 'edit');
            this.viewWrapper.hide();
            this.sourceinfoWrapper.hide();
            this.editWrapper.show();
            this.editBtn.hide();
            this.submitBtn.show();
            this.cancelBtn.show();
            this.closeBtn.attr('disabled', true).css('opacity', '.5');
            $('.source-info').css({
                opacity: '.5',
                cursor: 'default'
            });
            this.fillFormData();
        },
        _showViewWrapper: function(){
            var self = this;
            this.set('flag', 'view');
            this.viewWrapper.show();
            this.sourceinfoWrapper.hide();
            this.editWrapper.hide();
            this.editBtn.show();
            this.backBtn.hide();
            this.submitBtn.hide();
            this.cancelBtn.hide();
            this.backBtn.hide();
            this.closeBtn.show().css('opacity', '1').removeAttr('disabled');
            $('.source-info').css({
                opacity: '1',
                cursor: 'pointer'
            });
            setTimeout(function(){
                $('.area-auto-height', self.element).trigger('autosize.resize');
            },1)
        },
        _showSourceInfoWrapper: function(){
            var self = this;
            var oppProductRelations = this.get('oppProductRelations') || undefined;
            this.viewWrapper.hide();
            this.editWrapper.hide();
            this.editBtn.hide();
            this.closeBtn.hide();
            this.backBtn.show();
            this.sourceinfoWrapper.show();
            var productData = this.get('productData');
            if(oppProductRelations.productID){
                util.api({
                    "url": '/Product/GetProductByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        productID: oppProductRelations.productID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.products && data.value.products.length>0){
                                self.set('productData', data.value.products[0]) ;
                                self.fillSourceInfoFormData();
                            }
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }
        },
        _switchNav: function(e){
            var self = this;
            var $target = $(e.target)
            var flag = this.get('flag') || 'view';
            var oppProductRelations = this.get('oppProductRelations') || undefined;
            var $el = this.element;
            if(flag == 'view'){
                $target.parent().children().addClass('unselected');
                $target.removeClass('unselected');
                if($target.hasClass('source-info')){
                    this._showSourceInfoWrapper();
                }else if($target.hasClass('base-info')){
                    this._showViewWrapper();
                }
            }
            if($target.hasClass('base-info')){
                this._showViewWrapper();
            }
        },
        "render": function () {
            var result = ProductInOppDialog.superclass.render.apply(this, arguments);
            var $el = this.element;
            this.backBtn = $('.dialog-button-back', $el);
            this.editBtn = $('.dialog-button-edit', $el);
            this.closeBtn = $('.dialog-button-close', $el);
            this.submitBtn = $('.dialog-button-submit', $el);
            this.cancelBtn = $('.dialog-button-cancel', $el);
            this.viewWrapper = $('.product-view-wrapper', $el);
            this.sourceinfoWrapper = $('.product-sourceinfo-wrapper', $el);
            this.editWrapper =  $('.product-edit-wrapper', $el);

            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = ProductInOppDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "show": function (opts) {
            var self = this;
            var $el = this.element;
            var result = ProductInOppDialog.superclass.show.apply(this, arguments);
            if(opts.oppProductRelationID)
                this.set('oppProductRelationID',opts.oppProductRelationID);
            if(opts.flag)
                this.set('flag',opts.flag);

            var oppProductRelationID = this.get('oppProductRelationID') || undefined;
            var flag = this.get('flag') || 'view';
            if(flag == 'edit'){
                this._showEditWrapper();
            }else if(flag == 'view'){
                this._showViewWrapper();
            }

            if(oppProductRelationID){
                util.api({
                    "url": '/SalesOpportunity/GetOppProductRelationsByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        oppProductRelationID: oppProductRelationID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.oppProductRelations && data.value.oppProductRelations.length>0){
                                self.set('oppProductRelations', data.value.oppProductRelations[0]) ;
                                self.fillFormData();
                            }
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }
            return result;
        },
        "reset": function () {
            //清空所有输入框val
            $('.dialog-input-text', this.element).val('');
            $('.unitAmount', this.element).val('');
            $('.unit', this.element).val('');
            $('.area-auto-height', this.element).val('');
            this.currencyInput.reset();
            $('.base-info', this.element).trigger('click');
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });
        },
        "submit": function (e) {
            var self = this;
            var $el = this.element.find('.product-edit-wrapper');
            var oppProductRelations = this.get('oppProductRelations') ? this.get('oppProductRelations') : undefined;
            var oppProductRelationID = this.get('oppProductRelationID') ? this.get('oppProductRelationID') : undefined;
            var meEl = $(e.currentTarget);

            var productName = $('.productName', $el).val()||'',
//                unitAmount = $('.unitAmount', $el).val()||0,
                unitAmount = this.currencyInput.val()||0,
                unit = $('.unit', $el).val()||'',
                count = $('.count', $el).val()||0,
                description = $('.description', $el).val()||'';

//            if(!/^(([1-9]+)|([0-9]+\.[0-9]+))$/.test(count)){
//                util.alert('数量只能为数字');return ;
//            }
            var _count = parseFloat(count);
            if(isNaN(_count)){
                util.alert('请填写正确单价');return;
            }
            if(count.split('.')[0].length >16){
                util.alert('单价不能超过16位');return;
            }

            count = parseFloat(_count).toFixed(4);
            if(oppProductRelations){
                util.api({
                    "url": '/SalesOpportunity/UpdateOppProductRelation',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改产品发生错误，原因：',
                    "data": {
                        oppProductRelationID: oppProductRelationID,
                        productName: productName,
                        unitAmount: unitAmount,
                        unit: unit,
                        count: count,
                        description: description
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            self.hide();
                            util.remind(2,"保存成功");
                            if(self.v && self.v.refresh)
                                self.v.refresh();
                            self.trigger('success');
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            }else{
            }

        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.element;
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });
            this.currencyInput = new CurrencyInput({
                "element": $(".unitAmount", elEl.find('.product-edit-wrapper'))
            });
        },
        fillFormData: function(){
            var oppProductRelations = this.get('oppProductRelations') &&this.get('oppProductRelations');
            var $el = this.element;
            var self = this;
            if(oppProductRelations){
                $('.productName', $el).val(oppProductRelations.productName);
                $('.unitAmount', this.element.find('.product-view-wrapper')).text(oppProductRelations.unitAmount);
                this.currencyInput.setValue(oppProductRelations.unitAmount);
                $('.unit', $el).val(oppProductRelations.unit);
                $('.count', $el).val(oppProductRelations.count);
                $('.totalAmount', $el).val(oppProductRelations.totalAmount);
                $('.description', $el).val(oppProductRelations.description);
                setTimeout(function(){
                    $('.area-auto-height', self.element).trigger('autosize.resize');
                },1)
            }
        },
        fillSourceInfoFormData: function(){
            var productData = this.get('productData') &&this.get('productData');
            var $el = this.element.find('.product-sourceinfo-wrapper');
            var self = this;
            if(productData){
                $('.productName', $el).val(productData.name);
                $('.unit', $el).val(productData.unit);
                $('.unitAmount', $el).text(productData.unitAmount);
                $('.description', $el).text(productData.description);

                var tagUl = $('.product-source-info-tag', $el).empty();
                _.map(productData.fBusinessTagRelations, function(tag){
                    var li =$('<li class="fn-clear">'+
                                '<div class="inputs-tit"></div>'+
                                '<div class="input-warp">'+
                                    '<input readonly class="dialog-input-text description" placeholder=""/>'+
                                '</div>'+
                              '</li>');
                    li.find('.inputs-tit').html(tag.fBusinessTagName);
                    li.find('.dialog-input-text').val(tag.fBusinessTagOptionName);
                    tagUl.append(li)
                });

                setTimeout(function(){
                    $('.area-auto-height', self.element).trigger('autosize.resize');
                },1)
            }
        }
    });

    module.exports = ProductInOppDialog;
});