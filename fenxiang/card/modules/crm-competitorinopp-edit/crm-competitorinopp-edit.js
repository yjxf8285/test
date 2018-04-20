/**
 *
var d = new CompetitorInOppDialog({
    salesOpportunityID: 179
})
d.show({
    flag: 'view', //edit
    salesOpportunityID: 179,
    competitorID: 11
});
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-competitorinopp-edit/crm-competitorinopp-edit.html');
    var Dialog = require('dialog');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var CurrencyInput = require('uilibs/currency-input');//选钱组件
    var moment = require('moment');

    var CompetitorInOppDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-competitorinopp-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            oppCompetitorRelations: undefined,
            salesOpportunityID: undefined,
            competitorID: undefined
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
            setTimeout(function(){
                $('.area-auto-height', self.element).trigger('autosize.resize');
            },1)
        },
        _showViewWrapper: function(){
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
        },
        _showSourceInfoWrapper: function(){
            var self = this;
            this.viewWrapper.hide();
            this.editWrapper.hide();
            this.editBtn.hide();
            this.closeBtn.hide();
            this.backBtn.show();
            this.sourceinfoWrapper.show();
            var oppCompetitorRelations = this.get('oppCompetitorRelations') || undefined;
            var competitorData = this.get('competitorData');
            if(oppCompetitorRelations.competitorID){
                util.api({
                    "url": '/Competitor/GetCompetitorByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        competitorID: oppCompetitorRelations.competitorID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.competitors && data.value.competitors.length>0){
                                self.set('competitorData', data.value.competitors[0]) ;
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
            var oppCompetitorRelations = this.get('oppCompetitorRelations') || undefined;
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
            var result = CompetitorInOppDialog.superclass.render.apply(this, arguments);
            var $el = this.element;
            this.editBtn = $('.dialog-button-edit', $el);
            this.closeBtn = $('.dialog-button-close', $el);
            this.submitBtn = $('.dialog-button-submit', $el);
            this.cancelBtn = $('.dialog-button-cancel', $el);
            this.backBtn = $('.dialog-button-back', $el);
            this.viewWrapper = $('.competitor-view-wrapper', $el);
            this.sourceinfoWrapper = $('.competitor-sourceinfo-wrapper', $el);
            this.editWrapper =  $('.competitor-edit-wrapper', $el);

            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = CompetitorInOppDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "reset": function () {
            var $el = this.element;

            var $edit = $el.find('.competitor-edit-wrapper');
            var $view = $el.find('.competitor-view-wrapper');
            var $si = $el.find('.competitor-sourceinfo-wrapper');

            $('.div-view-text',$view).html('');
            $('.div-view-text',$si).html('');

            this.currencyInput.reset();

            $('.area-auto-height', $edit).val('').removeAttr('style');

            util.mnReset($('.winRate', $edit));

            $('.base-info', $el).click();

        },
        "show": function (opts) {
            var self = this;
            var $el = this.element;
            var result = CompetitorInOppDialog.superclass.show.apply(this, arguments);
            if(opts.salesOpportunityID)
                this.set('salesOpportunityID',opts.salesOpportunityID);
            if(opts.competitorID){
                this.set('competitorID',opts.competitorID);}
            if(opts.flag)
                this.set('flag',opts.flag);

            var competitorID = this.get('competitorID') || undefined;
            var salesOpportunityID = this.get('salesOpportunityID') || undefined;
            var flag = this.get('flag') || 'view';
            if(flag == 'edit'){
                this._showEditWrapper();
            }else if(flag == 'view'){
                this._showViewWrapper();
            }

            if(competitorID && salesOpportunityID){
                util.api({
                    "url": '/SalesOpportunity/GetOppCompetitorRelationsByID',
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        salesOpportunityID: salesOpportunityID,
                        competitorID: competitorID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value.oppCompetitorRelations && data.value.oppCompetitorRelations.length>0){
                                self.set('oppCompetitorRelations', data.value.oppCompetitorRelations[0]) ;
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
            var self = this;
            var $el = this.element.find('.competitor-edit-wrapper');
            var oppCompetitorRelations = this.get('oppCompetitorRelations') ? this.get('oppCompetitorRelations') : undefined;
            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var competitorID = this.get('competitorID') || undefined;
            var meEl = $(e.currentTarget);

            var productDescription = $('.productDescription', $el).val() ||'',
                advantage = $('.advantage', $el).val()||'',
                disadvantage = $('.disadvantage', $el).val()||'',
                strategies = $('.strategies', $el).val()||'',
                winRate = util.mnGetter($('.winRate', $el))||10,
                price = this.currencyInput.val();

            if(price==-1){
                util.alert('请填写正确报阶');return;
            }

            if(oppCompetitorRelations){
                util.api({
                    "url": '/SalesOpportunity/UpdateOppCompetitorRelation',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        salesOpportunityID: salesOpportunityID,
                        competitorID: competitorID,
                        productDescription: productDescription,
                        advantage: advantage,
                        disadvantage: disadvantage,
                        strategies: strategies,
                        winRate: winRate,
                        price: price
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
        // 设置组件
        setupComponent: function () {
            var elEl = this.element;
            publishHelper.AdjustTextAreaSize({
                element: $('.area-auto-height', elEl)
            });
            this.currencyInput = new CurrencyInput({
                "element": $(".price", elEl.find('.competitor-edit-wrapper'))
            });
            var winRateOpts = [];
            for(var i=1,len=10; i<=len; i++){
                winRateOpts.push({
                    value: (i*10)+'',
                    text: (i*10)+''
                });
            }
            util.mnSelect($(".winRate", elEl.find('.competitor-edit-wrapper')), 'syncModel',winRateOpts );
        },
        fillFormData: function(){
            var oppCompetitorRelations = this.get('oppCompetitorRelations') || undefined;
            var $el = this.element;
            var $edit = $el.find('.competitor-edit-wrapper');
            var $view = $el.find('.competitor-view-wrapper');

            if(oppCompetitorRelations){
                $('.name', $view).text(oppCompetitorRelations.name);
                $('.price', $view).text(oppCompetitorRelations.price);
                $('.winRate', $view).text(oppCompetitorRelations.winRate);
                $('.advantage', $view).text(oppCompetitorRelations.advantage);
                $('.disadvantage', $view).text(oppCompetitorRelations.disadvantage);
                $('.productDescription', $view).text(oppCompetitorRelations.productDescription);
                $('.strategies', $view).text(oppCompetitorRelations.strategies);

                $('.name', $edit).val(oppCompetitorRelations.name);
                this.currencyInput.setValue(oppCompetitorRelations.price);
                util.mnSetter($(".winRate", $edit), oppCompetitorRelations.winRate);
                $('.advantage', $edit).val(oppCompetitorRelations.advantage);
                $('.disadvantage', $edit).val(oppCompetitorRelations.disadvantage);
                $('.productDescription', $edit).val(oppCompetitorRelations.productDescription);
                $('.strategies', $edit).val(oppCompetitorRelations.strategies);
                setTimeout(function(){
                    $('.area-auto-height', $edit).trigger('autosize.resize');
                }, 1);

            }
        },
        fillSourceInfoFormData: function(){
            var competitorData = this.get('competitorData') || undefined;
            var $el = this.element.find('.competitor-sourceinfo-wrapper');
            if(competitorData){
                $('.name', $el).text(competitorData.name);
                $('.competitorScaleTagOptionName', $el).text(competitorData.competitorScaleTagOptionName);
                $('.competitivenessTagOptionName', $el).text(competitorData.competitivenessTagOptionName);
                $('.advantage', $el).text(competitorData.advantage);
                $('.disadvantage', $el).text(competitorData.disadvantage);
                $('.productLineTagOptionName', $el).text(competitorData.productLineTagOptionName);
                $('.strategies', $el).text(competitorData.strategies);
                $('.salesSituation', $el).text(competitorData.salesSituation);
                $('.marketingSituation', $el).text(competitorData.marketingSituation);
                $('.contactInfo', $el).text(competitorData.contactInfo);
                $('.description', $el).text(competitorData.description);

                var tagUl = $('.competitor-source-info-tag', $el).empty();
                _.map(competitorData.fBusinessTagRelations, function(tag){
                    var li =$('<li class="fn-clear">'+
                        '<div class="inputs-tit"></div>'+
                        '<div class="input-warp">'+
                        '<input readonly class="dialog-input-text description" placeholder=""/>'+
                        '</div>'+
                        '</li>');
                    li.find('.inputs-tit').html(tag.fBusinessTagName);
                    li.find('.dialog-input-text').html(tag.fBusinessTagOptionName);
                    tagUl.append(li)
                });

            }
        }
    });

    module.exports = CompetitorInOppDialog;
});