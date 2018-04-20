/**
 *
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-product-edit/crm-product-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var moment = require('moment');

    var ProductDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-product-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            productData: undefined,
            productID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide'
        },
        "render": function () {
            var result = ProductDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = ProductDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            //清空所有输入框val
            $('.dialog-input-text', this.element).val('');
            $('.area-auto-height', this.element).val('').removeAttr('style');
            this.currencyInput.reset();
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });
        },
        "show": function () {
            var self = this;
            var result = ProductDialog.superclass.show.apply(this, arguments);
            var productID = this.get('productID') ? this.get('productID') : undefined;
//            编辑
            if(productID){
                util.api({
                    "url": '/Product/GetProductByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        productID: productID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.products && data.value.products.length>0){
                                self.set('productData', data.value.products[0]) ;
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
        "submit": function (e) {
            var that = this;
            var productData = this.get('productData') ? this.get('productData') : undefined;
            var productID = this.get('productID') ? this.get('productID') : undefined;
            var meEl = $(e.currentTarget);
            var elEl = this.element;

            var name = $('.product-name', elEl).val(),
                unitAmount = this.currencyInput.val() || 0,
                unit = $('.product-unit', elEl).val(),
                description = $('.product-description', elEl).val(),
                listTagOptionID = [];

            var $tagLis = $('.product-tags-list-warp > li', elEl);

            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });
            if(productData){
                util.api({
                    "url": '/Product/UpdateProduct',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改客户发生错误，原因：',
                    "data": {
                        productID: productID,
                        name: name,
                        unitAmount: unitAmount,
                        unit: unit,
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
                    "url": '/Product/AddProduct',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        name: name,
                        unitAmount: unitAmount,
                        unit: unit,
                        description: description,
                        listTagOptionID: listTagOptionID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            util.remind(2,"添加成功");
                            that.v.refresh && that.v.refresh();
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
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.element;
            var tagUl = $('.product-tags-list-warp', elEl);
            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });

            this.currencyInput = new CurrencyInput({
                "element": $(".product-unit-amount", elEl)
            });

            var crmData = util.getCrmData();
            var fBusinessTags = crmData.fBusinessTags;
            var productTags = [];
            _.each(fBusinessTags, function (fBusinessTag, index) {
                if (fBusinessTag.type === util.CONSTANT.TAG_TYPE.PRODUCT) {
                    productTags.push(fBusinessTag);
                }
            });
            //实例化标签下拉框
            _.each(productTags, function (tag, index) {
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
        },
        fillFormData: function(){
            var productData = this.get('productData') &&this.get('productData');
            var $el = this.element;
            //编辑，填充基本信息
            if(productData){
                $('.product-name', $el).val(productData.name);
                this.currencyInput.setValue(productData.unitAmount);
                $('.product-unit', $el).val(productData.unit);
                $('.product-description', $el).val(productData.description);

                //编辑，取客户的标签内容
                _.map(productData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                this.conTextareaEl.trigger('autosize.resize');
            }
        }
    });

    module.exports = ProductDialog;
});