/**
 * 新建 || 编辑  竞争对手弹框
 *
 *  attrs{
 *      competitorID: 123
 *  }
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-competitor-edit/crm-competitor-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var moment = require('moment');

    var CompetitorDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-competitor-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            competitorData: undefined,
            competitorID: undefined
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-cancel': 'hide'
        },
        "render": function () {
            var result = CompetitorDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = CompetitorDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;
            $('.dialog-input-text', $el).val('');
            $('.area-auto-height', $el).val('').removeAttr('style');
            $('.mn-select-box', $el).each(function () {
                util.mnReset($(this));
            });
        },
        "show": function () {
            var self = this;
            var result = CompetitorDialog.superclass.show.apply(this, arguments);
            var competitorID = this.get('competitorID') ? this.get('competitorID') : undefined;
//            编辑
            if(competitorID){
                util.api({
                    "url": '/Competitor/GetCompetitorByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        competitorID: competitorID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.competitors && data.value.competitors.length>0){
                                self.set('competitorData', data.value.competitors[0]) ;
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
            var competitorData = this.get('competitorData') ? this.get('competitorData') : undefined;
            var competitorID = this.get('competitorID') ? this.get('competitorID') : undefined;

            var meEl = $(e.currentTarget);
            var $el = this.element;

            var name = $('.competitor-name', $el).val(),
                advantage = $('.competitor-advantage', $el).val(),
                disadvantage = $('.competitor-disadvantage', $el).val(),
                strategies = $('.competitor-strategies', $el).val(),
                salesSituation = $('.competitor-salesSituation', $el).val(),
                marketingSituation = $('.competitor-marketingSituation', $el).val(),
                contactInfo = $('.competitor-contactInfo', $el).val(),
                description = $('.competitor-description', $el).val(),
                listTagOptionID = [];

            var $tagLis = $('.competitor-tags-list-warp > li', $el);

            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });
            if(competitorData){
                util.api({
                    "url": '/Competitor/UpdateCompetitor',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '修改竞争对手发生错误，原因：',
                    "data": {
                        competitorID: competitorID,
                        name: name,
                        advantage: advantage,
                        disadvantage: disadvantage,
                        strategies: strategies,
                        salesSituation: salesSituation,
                        marketingSituation: marketingSituation,
                        contactInfo: contactInfo,
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
                    "url": '/Competitor/AddCompetitor',
                    "type": 'post',
                    "errorMsgTitle": '添加竞争对手发生错误，原因：',
                    "dataType": 'json',
                    "data": {
                        name: name,
                        advantage: advantage,
                        disadvantage: disadvantage,
                        strategies: strategies,
                        salesSituation: salesSituation,
                        marketingSituation: marketingSituation,
                        contactInfo: contactInfo,
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
            var $el = this.element;
            this.conTextareaEl = $('.area-auto-height', $el);
        },
        // 设置组件
        setupComponent: function () {
            var $el = this.element;
            var tagUl = $('.competitor-tags-list-warp', $el);
            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            });

            var productTags = util.getTagsByType(util.CONSTANT.TAG_TYPE.COMPETITOR);

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
            var competitorData = this.get('competitorData') &&this.get('competitorData');
            var $el = this.element;
            //编辑，填充基本信息
            if(competitorData){
                $('.competitor-name', $el).val(competitorData.name);
                $('.competitor-advantage', $el).val(competitorData.advantage);
                $('.competitor-disadvantage', $el).val(competitorData.disadvantage);
                $('.competitor-strategies', $el).val(competitorData.strategies);
                $('.competitor-salesSituation', $el).val(competitorData.salesSituation);
                $('.competitor-marketingSituation', $el).val(competitorData.marketingSituation);
                $('.competitor-contactInfo', $el).val(competitorData.contactInfo);
                $('.competitor-description', $el).val(competitorData.description);

                _.map(competitorData.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                });
                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        }
    });

    module.exports = CompetitorDialog;
});