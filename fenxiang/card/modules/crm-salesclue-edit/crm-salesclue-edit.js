/**
 * 新建 || 编辑  销售机会弹框
 *
 *  attrs{
 *      salesclueID: 123
 *  }
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-salesclue-edit/crm-salesclue-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var moment = require('moment');

    var SalesclueDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-salesclue-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            salesclueData: undefined,
            salesclueID: undefined,
            marketingEventID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide'
        },
        "render": function () {
            var result = SalesclueDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = SalesclueDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            //清空所有输入框val
            $('.dialog-input-text', this.element).val('');
            $('.area-auto-height', this.element).val('').removeAttr('style');
            util.mnSetter($('.salesclue-gender-radio', this.element), '');
            //重置所有下拉框默认值
            $('.mn-select-box', this.element).each(function () {
                util.mnReset($(this));
            });
        },
        "show": function () {
            var self = this;
            var result;
            var salesclueID = this.get('salesclueID') ? this.get('salesclueID') : undefined;
//            编辑
            if(salesclueID){
                util.api({
                    "url": '/SalesClue/GetSalesClueByID',
                    "type": 'get',
                    "dataType": 'json',
                    "async": false,
                    "data": {
                        salesClueID: salesclueID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.salesClues && data.value.salesClues.length>0){
                                result = SalesclueDialog.superclass.show.apply(self, arguments);
                                self.set('salesclueData', data.value.salesClues[0]) ;
                                self.fillFormData();
                            }
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }else{
                result = SalesclueDialog.superclass.show.apply(this, arguments);
            }
            return result;
        },
        "submit": function (e) {
            var that = this;
            var salesclueData = this.get('salesclueData') ? this.get('salesclueData') : undefined;
            var salesclueID = this.get('salesclueID') ? this.get('salesclueID') : undefined;
            var marketingEventID = this.get('marketingEventID') ? this.get('marketingEventID') : 0;

            var meEl = $(e.currentTarget);
            var $el = this.element;

            var name = $('.salesclue-name', $el).val(),
                company = $('.salesclue-company', $el).val(),
                gender = util.mnGetter($('.salesclue-gender-radio',$el)),
                post = $('.salesclue-post', $el).val(),
                tel = $('.salesclue-tel', $el).val(),
                mobile = $('.salesclue-mobile', $el).val(),
                email = $('.salesclue-email', $el).val(),
                weibo = $('.salesclue-weibo', $el).val(),
                weChat = $('.salesclue-weChat', $el).val(),
                qq = $('.salesclue-qq', $el).val(),
                province = $('.salesclue-province', $el).val(),
                address = $('.salesclue-address', $el).val(),
                postCode = $('.salesclue-postCode', $el).val(),
                description = $('.salesclue-description', $el).val(),
                listTagOptionID = [];

            var $tagLis = $('.salesclue-tags-list-warp > li', $el);

            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });
            if(salesclueData){
                util.api({
                    "url": '/SalesClue/UpdateSalesClue',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改线索发生错误，原因：',
                    "data": {
                        salesclueID: salesclueID,
                        name: name,
                        company: company,
                        gender: gender,
                        post: post,
                        tel: tel,
                        mobile: mobile,
                        email: email,
                        weibo: weibo,
                        weChat: weChat,
                        qq: qq,
                        province: province,
                        address: address,
                        postCode: postCode,
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
                    "url": '/SalesClue/AddSalesClue',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        marketingEventID: marketingEventID,
                        name: name,
                        company: company,
                        gender: gender,
                        post: post,
                        tel: tel,
                        mobile: mobile,
                        email: email,
                        weibo: weibo,
                        weChat: weChat,
                        qq: qq,
                        province: province,
                        address: address,
                        postCode: postCode,
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
        setupDoms: function () {
            var $el = this.element;
            this.conTextareaEl = $('.area-auto-height', $el);
        },
        // 设置组件
        setupComponent: function () {
            var $el = this.element;
            var tagUl = $('.salesclue-tags-list-warp', $el);
            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });

            var productTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.SALES_CLUE);

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
            var salesclueData = this.get('salesclueData') &&this.get('salesclueData');
            var $el = this.element;
            //编辑，填充基本信息
            if(salesclueData){
                $('.salesclue-name', $el).val(salesclueData.name);
                $('.salesclue-company', $el).val(salesclueData.company);
                util.mnGetter($('.salesclue-gender-radio', $el), salesclueData.gender);
                $('.salesclue-post', $el).val(salesclueData.post);
                $('.salesclue-tel', $el).val(salesclueData.tel);
                $('.salesclue-mobile', $el).val(salesclueData.mobile);
                $('.salesclue-email', $el).val(salesclueData.email);
                $('.salesclue-weibo', $el).val(salesclueData.weibo);
                $('.salesclue-weChat', $el).val(salesclueData.weChat);
                $('.salesclue-qq', $el).val(salesclueData.qq);
                $('.salesclue-province', $el).val(salesclueData.province);
                $('.salesclue-address', $el).val(salesclueData.address);
                $('.salesclue-postCode', $el).val(salesclueData.postCode);
                $('.salesclue-description', $el).val(salesclueData.description);

                if(salesclueData.gender){
                    util.mnSetter($('.salesclue-gender-radio', $el), salesclueData.gender);
                }

                //编辑，取客户的标签内容
                _.map(salesclueData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        }
    });

    module.exports = SalesclueDialog;
});