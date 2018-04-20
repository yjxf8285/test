 /**
 *
 *

 客户下编辑
 var d = new CustomerInSettingDialog()
 d.show({
    flag: 'view', //edit
    customerID: 179
});

 设置->全部客户->编辑
var d = new CustomerInSettingDialog()
d.show({
    flag: 'view', //edit
    customerID: 179,
    inSetting: true
});

 dialogType:
 0: 设置-【全部客户，未分配客户，已归属客户，公海客户】 <>
 1：客户-【我的公海(非管理员)】 <领取>
 2: 客户-【我的公海(该公海管理员)】 <设置跟进人>
 3: 客户详情->下编辑<>


 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        list = tpl.list;
    var htmltpl = require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit.html');
////    var modelStyle = require('modules/crm-customerinsetting-edit/crm-customerinsetting-edit.css');
    var Dialog = require('dialog');
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');
    var ModifyRecords = require('modules/crm-customer-modify-records/crm-customer-modify-records');
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var moment = require('moment');
    var HighSeaSelect = require('modules/crm-select-highseas/crm-select-highseas');        //公海
    var FollowSelect = require('modules/crm-seaselect-follow/crm-seaselect-follow');       //跟进人
    var Expiretime=require('modules/crm-highsea-expiretime/crm-highsea-expiretime');       //延期时间控件
    var DateSelect = publishHelper.DateSelect; //选择日期组件

    var CustomerInSettingDialog = Dialog.extend({
        "attrs": {
            width: 760,
            content: $(htmltpl).filter('.dialog-customerinsetting-template').html(),
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            className: 'dialog-crm',
            customerID: undefined,
            pageSize: 10,
            currentPageNum: 1
        },
        "events": {
            'click .dialog-button-submit': 'submit',
            'click .dialog-button-close': 'hide',
            'click .dialog-button-edit': '_showEditWrapper',
            'click .dialog-button-cancel': '_showViewWrapper',
            'click .dialog-button-back': '_backToBaseInfo',
            'click .left-list li': '_switchNav',
            'click .owner-edit-btn': '_ownerEdit',                //编辑归属人
            'click .owner-cancel-btn': '_ownerCancel',            //取消归属人
            'click .owner-set-btn': '_ownerSet',                  //设置归属人
            'click .move-highseas-btn': '_moveHighseas',          //移动到公海
            'click .follow-edit-btn':'_followEdit',               //编辑跟进人
            'click .follow-cancel-btn':'_followCancel',           //取消跟进人
            'click .follow-set-btn':'_followEdit',                //设置跟进人
            'click .follow-get':'_followGet',                     //领取
            'click .follow-time':'_followTime',                   //延期
            'click .next-page': '_nextPage',                      //下一页
            'click .prev-page': '_prevPage'                       //上一页
        },
        //上一页 下一页 
        //根据是跟进人历史 还是归属人历史 调用不同的数据
        _nextPage: function(e){
            if($(e.target).hasClass('page-btn-disabled')){
                return ;
            }
            var num=this.get('currentPageNum');
            this.set('currentPageNum',num+1);
            if(this.get('isFollowed')){
                this.refreshFollowHistory();
            }else{
                this.refreshHistory();
            }
        },
        //
        _prevPage: function(e){
            if($(e.target).hasClass('page-btn-disabled')){
                return ;
            }
            var num=this.get('currentPageNum');
            this.set('currentPageNum',num-1);
            if(this.get('isFollowed')){
                this.refreshFollowHistory();
            }else{
                this.refreshHistory();
            }
        },
        _backToBaseInfo: function(){
            $('.base-info', this.element).click();
        },
        _ownerEdit: function(){
            this.selectColleague.show();
        },
        _ownerCancel: function(){
            var self =this;
            util.confirm('是否要取消当前客户的归属人？', ' ', function () {
                util.api({
                    "url": '/FCustomer/ModifyFCustomerOwners',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        customerIDs: self.get('customerID'),
                        ownerID: 0
                    },
                    "success": function (data) {
                        if(data.success == true){
                            self.hasNoOwnerSet();
                            self.trigger('success');
                        }else{
                            return;
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            });
        },
        _ownerSet: function(){
            this._ownerEdit();
        },
        //跟进人编辑
        _followEdit:function(){
            var self=this;
            var customerID=self.get('customerID');
            var highseasId=self.get('customerData').fCustomer.highSeasID;
            var permissions=self.get('customerData').highSeas.highSeasPermissions;
            if(permissions.length<0){
                util.alert("公海中无任何员工");
            }else{
                self.followSelect.show(permissions);
            }
            /*
            util.api({
                "url": '/HighSeas/GetHighSeasByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                   "highSeasID":highseasId        // int，公海ID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        if(responseData.value.highSeas.highSeasPermissions.length<=0){
                            util.alert("公海中无任何员工");
                        }else{
                            self.followSelect.show(responseData.value.highSeas.highSeasPermissions);
                        }     
                    }
                }
            },{'mask':true});
            */
        },
        //取消跟进人 设置模块和客户模块中调用的api url不一样
        _followCancel:function(){
            var self=this;
            var url="/HighSeas/TakeBackCustomersForManager";
            if(self.get('dialogType')!=0){
                url="/HighSeas/TakeBackCustomers"
            }
            util.confirm('是否要取消当前客户的跟进人',' ',function(){

                util.api({
                    'url':url,
                    'type':'post',
                    'dataType':'json',
                    'data':{
                        customerIDs:self.get('customerID')
                    },
                    'success':function(data){
                        if(data.success){
                            self.refresh();
                            self.trigger('success');
                        }else{
                            return;
                        }
                    }
                })
            });
        },
        //领取
        _followGet:function(){
            var self=this;
            var customerID=this.get('customerID');
            util.api({
                'url':'/Highseas/ClaimCustomer',
                'type':'post',
                'dataType':'json',
                'data':{"customerID":customerID},
                'success':function(responseData){
                    if(responseData.success){
                        self.refresh();
                        self.trigger('success');
                    }else{
                        return;
                    }
                }
            });
        },
        //延期
        _followTime:function(){
            var self=this;
            var customerData=self.get('customerData');
            var time=customerData.fCustomer.expireTime;
            var days=customerData.fCustomer.remainingDays;
            self.expiretime.show(time*1000,days);
        },
        //移动到公海
        _moveHighseas: function(){
            this.highseaSelect.show();
        },
        _showEditWrapper: function(){
            this.set('flag', 'edit');
            this.viewWrapper.hide();
            this.editWrapper.show();
            this.editBtn.hide();
            this.submitBtn.show();
            this.cancelBtn.show();
            this.closeBtn.attr('disabled', true).css('opacity', '.5');
            $('.source-info').css({
                opacity: '.5',
                cursor: 'default'
            });
        },
        _showViewWrapper: function(){
            this.set('flag', 'view');
            this.viewWrapper.show();
            this.editWrapper.hide();

            this._isshowEdit();
            
            this.submitBtn.hide();
            this.cancelBtn.hide();
            this.closeBtn.css('opacity', '1').removeAttr('disabled');
//            $('.source-info').css({
//                opacity: '1',
//                cursor: 'pointer'
//            });
        },
        _switchNav: function(e){
            var self = this;
            var $target = $(e.target)
            var flag = this.get('flag') || 'view';
            var customerData = this.get('customerData') || {};
            var $el = this.element;
            $target.parent().children().addClass('unselected');
            $target.removeClass('unselected');
            if($target.hasClass('customer-modify-record-wrapper-btn')){
                this.showRecordWrapper();
            }else if($target.hasClass('customer-owner-history-wrapper-btn')){
                this.showHistoryWrapper();
            }else if($target.hasClass('base-info')){
                this.showBaseinfoWrapper();
            }
        },
        //显示修改记录
        showRecordWrapper: function(){
            this.recordWrapper.show();
            this.historyWrapper.hide();
            this.viewWrapper.hide();
            this.editWrapper.hide();
            var self = this;
            $('.button-wrapper', this.element).children('button').hide();
            $('.dialog-button-back', this.element).show();
            if(!this._modifyRecords) {

        		this._modifyRecords = new ModifyRecords({
                    "wrapEl": $('.customer-modify-record-wrapper', this.element),
                    "customerID": this.get('customerID'),
                    "recordsUrl": "/FCustomer/GetSnapshotsOfCustomerID",//获取所有的修改记录请求地址
                    "snapshotsUrl": "/FCustomer/GetFCustomerSnapshotTwoEntity",//获取两条实体
                    "restoreUrl": "/FCustomer/RestoreSnapshot",//恢复记录
                    "v": this
                });
                this._modifyRecords.on('success', function(){
                    self.refresh();
                    self.v && self.v.refresh && self.v.refresh();
                    self.trigger('success');
                });
        	}
        	this._modifyRecords.refresh(undefined, undefined, this.get('customerID'));
        },
        //显示历史记录
        showHistoryWrapper: function(){
            this.recordWrapper.hide();
            this.historyWrapper.show();
            this.viewWrapper.hide();
            this.editWrapper.hide();
            var self = this;
            $('.button-wrapper', this.element).children('button').hide();
            $('.dialog-button-back', this.element).show();
            this.set('currentPageNum',1);

            //
            if(this.get('isFollowed')){
                self.refreshFollowHistory();
            }else{
                self.refreshHistory();
            }
        },
        //刷新归属人历史记录
        refreshHistory: function(){
            var self = this;
            var pageNum=self.get('currentPageNum');
            //数据请求前先清空列表
            $('.customer-owner-history-wrapper',this.element).children('.history-inner').empty();
            util.api({
                "url": '/FCustomer/GetFCustomerChangeOwnerLogs/',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    customerID: this.get('customerID'),
                    pageSize: self.get('pageSize')||10,
                    pageNumber: parseInt(pageNum) || 1
                },
                "success": function (data) {
                    if (data.success) {
                        self.renderHistory(data.value);
                    }
                }
            }, {
                "submitSelector": ''
            });
        },
        //渲染归属人历史记录
        renderHistory: function(data){
            var $el = this.element;
            var hWrapper = $('.customer-owner-history-wrapper',$el).children('.history-inner').empty();
            var totalCount = data.totalCount;
            var logs = data.fCustomerChangeOwnerLogs;
            var innerEl = $('<ul>');
            var pageSize = this.get('pageSize');
            var baseDate = new Date();
            if(totalCount>0){
                _.map(logs, function(log){
                    if(log.owner){
                        var s1 = $('<span>').text((log.employee&&log.employee.name)+'设置客户的归属人为'+(log.owner && log.owner.name));
                        var s2 = $('<span class="time-display">').text('('+util.getDateSummaryDesc((new Date(log.createTime*1000)),baseDate,1)+')');
                        innerEl.append($('<li>').append(s1).append(s2));
                    }else{
                        var s1 = $('<span>').text((log.employee&&log.employee.name)+'取消了客户的归属人');
                        var s2 = $('<span class="time-display">').text('('+util.getDateSummaryDesc((new Date(log.createTime*1000)),baseDate,1)+')');
                        innerEl.append($('<li>').append(s1).append(s2));
                    }
                })
                hWrapper.html(innerEl);
            }else{
                hWrapper.html('<ul><li>没有归属人历史信息</li></ul>');
            }
            var currentPageNum = this.get('currentPageNum')||1;
            if(totalCount<pageSize){
                $('.page-button',$el).addClass('page-btn-disabled');
            }else{
                if(currentPageNum>1){
                    $('.prev-page',$el).removeClass('page-btn-disabled');
                }else{
                    $('.prev-page',$el).addClass('page-btn-disabled');
                }
                if((totalCount-currentPageNum*pageSize)>0){
                    $('.next-page',$el).removeClass('page-btn-disabled');
                }else{
                    $('.next-page',$el).addClass('page-btn-disabled');
                }
            }
        },
        //刷新跟进人历史记录
        refreshFollowHistory:function(){
            var self=this;
            var pageNum=self.get('currentPageNum');
            //数据请求前先清空列表
            $('.customer-owner-history-wrapper',this.element).children('.history-inner').empty();
            util.api({
                "url":'/HighSeas/GetFCustomerClaimLogs',
                "type":'get',
                "dataType":'json',
                "data":{
                    customerID:self.get('customerID'),
                    pageSize:self.get('pageSize')||10,
                    pageNumber:parseInt(pageNum)||1
                },
                "success":function(data){
                    if(data.success){
                        self.renderFollowHistory(data.value);
                    }
                }
            })
        },
        //渲染跟进人历史记录
        renderFollowHistory:function(data){
            var $el=this.element;
            var $wrapper=$('.customer-owner-history-wrapper',$el).children('.history-inner').empty();
            var totalCount=data.totalCount;
            var logs=data.fCustomerClaimLogs;
            var $ul=$('<ul>');
            var pageSize=this.get('pageSize');
            var baseDate=new Date();
            if(totalCount>0){
                _.map(logs,function(log){
                    var time=util.getDateSummaryDesc((new Date(log.H*1000)),baseDate,1);
                    var str='<li><span>'+log.showStr+'</span> <span class="time-display">('+time+')</span></li>'
                    $ul.append($(str));
                })
                $wrapper.html($ul);
            }else{
                $wrapper.html('<ul><li>没有归属人历史信息</li></ul>');
            }
            var currentPageNum=this.get('currentPageNum')||1;
            if(totalCount<pageSize){
                $('.page-button',$el).addClass('page-btn-disabled');
            }else{
                if(currentPageNum>1){
                    $('.prev-page',$el).removeClass('page-btn-disabled');
                }else{
                    $('.prev-page',$el).addClass('page-btn-disabled');
                }
                if((totalCount-currentPageNum*pageSize)>0){
                    $('.next-page',$el).removeClass('page-btn-disabled');
                }else{
                    $('.next-page',$el).addClass('page-btn-disabled');
                }
            }
        },
        //显示基本信息
        showBaseinfoWrapper: function(){
            this.recordWrapper.hide();
            this.historyWrapper.hide();
            this.viewWrapper.show();
            this.editWrapper.hide();
            $('.dialog-button-back', this.element).hide();
            this.closeBtn.show();
            this._isshowEdit();
            this.submitBtn.hide();
            this.cancelBtn.hide();
            util.enableCrmBtn(this.closeBtn);
        },
        "render": function () {
            var result = CustomerInSettingDialog.superclass.render.apply(this, arguments);
            var $el = this.element;
            this.editBtn = $('.dialog-button-edit', $el);
            this.closeBtn = $('.dialog-button-close', $el);
            this.submitBtn = $('.dialog-button-submit', $el);
            this.cancelBtn = $('.dialog-button-cancel', $el);

            this.editBox = $('.owner-name-wrapper', $el).closest('ul');

            this.viewWrapper = $('.customer-view-wrapper', $el);
            this.recordWrapper = $('.customer-modify-record-wrapper', $el);
            this.historyWrapper = $('.customer-owner-history-wrapper', $el);
            this.editWrapper =  $('.customer-edit-wrapper', $el);

            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件

            return result;
        },
        "hide": function () {
            var result = CustomerInSettingDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "show": function (opts) {
            var result = CustomerInSettingDialog.superclass.show.apply(this, arguments);
            var self = this;
            var $el = this.element;
            
            if(opts && opts.customerID){
                self.set('customerID',opts.customerID);
            }
            //self.set('isSetting',false);
            //默认类型为0
            if(opts && opts.dialogType){
                self.set('dialogType',opts.dialogType);
            }else{
                self.set('dialogType',0);
            }

            if(opts && opts.flag == 'edit'){
                this._showEditWrapper();
            }
            var customerID = this.get('customerID') || undefined;
            if(customerID){
                util.api({
                    "url": '/FCustomer/GetCustomerByID',
                    "type": 'get',
                    "dataType":'json',
                    "data": {
                        customerID: customerID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value){
                                self.set('customerData', data.value) ;
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
        "reset": function(){
            this.clear();

            $('.base-info',this.element).click();
        },
        "clear": function () {
            //清空所有输入框val
            $('.area-auto-height', this.element).val('');
            $('.dialog-input-text', this.element).val('');
            _.map(this.defineDateFieldArray, function(obj){
                obj.dateObj.clear();
            })
            $('.crm-customer-modify-records-container',this.element).find('.old,.new').text('')
            var $view = $('.customer-view-wrapper',this.element);
            $view.find('.fullName').text('');
            $view.find('.long-view-text').text('');
            //this.editBox.css('background-color', '#ffffff');
        },
        "refresh":function(){
            this.clear();
            var self=this;
            var customerID = this.get('customerID') || undefined;
            if(customerID){
                util.api({
                    "url": '/FCustomer/GetCustomerByID',
                    "type": 'get',
                    "dataType":'json',
                    "data": {
                        customerID: customerID
                    },
                    "success": function (data) {
                        if (data.success) {
                            if(data.value && data.value){
                                self.set('customerData', data.value) ;
                                self.fillFormData();
                            }
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }
        },
        "submit": function (e) {
            var self = this;
            var that = this;
            var $el = this.element.find('.customer-edit-wrapper');
            var customerData = this.get('customerData') ? this.get('customerData') : undefined;
            var salesOpportunityID = this.get('salesOpportunityID') ? this.get('salesOpportunityID') : undefined;
            var customerID = this.get('customerID') || undefined;
            var meEl = $(e.currentTarget);

            var name = $('.name', $el).val() ||'',
            	fCustomerNo = $('.number', $el).val() ||'',
                fullName = $('.fullName', $el).val()||'',
                address = $('.address', $el).val()||'',
                introduction = $('.introduction', $el).val()||'',
                webSite = $('.webSite', $el).val()||'';

            var $tagLis = $('.customer-tags-list-warp > li', $el);
            var listTagOptionID = [];
            $tagLis.each(function (i) {
                var fBusinessTagID = $('.f-business-tag-id', $(this)).data('fbusinesstagid');
                var mnSelectBoxEl = $('.mn-select-box', $(this));
                var optionID = util.mnGetter(mnSelectBoxEl) || 0;
                listTagOptionID.push(fBusinessTagID + ',' + optionID);
            });

            //自定义字段
            var $fieldUl = $('.customer-define-fields-list-warp', $el);
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

            util.api({
                "url": '/FCustomer/ModifyFCustomer',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    customerID: customerID,
                    name: name,
                    fullName: fullName,
                    address: address,
                    webSite: webSite,
                    introduction: introduction,
                    listTagOptionID: listTagOptionID,
                    dataList: dataList,
                    fCustomerNo: fCustomerNo
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.hide();
                        util.remind(2,"保存成功");
                        that.v && that.v.refresh && that.v.refresh()//刷新列表
                        that.trigger('success');
                    }
                }
            }, {
                "submitSelector": ''
            });
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.conTextareaEl = $('.area-auto-height', elEl);
        },
        // 设置组件 初始化各种弹出框
        setupComponent: function () {
            var self = this;
            var $el = this.element;

            var tagUl = $('.customer-tags-list-warp', self.element);
            var tags = util.getTagsByType(util.CONSTANT.TAG_TYPE.CUSTOMER);
            //实例化下拉框（新建 ｜ 编辑）
            _.each(tags, function (tag, index) {
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

            //自定义字段
            var defineFields = util.getUserDefineFieldByType(1);
            this.defineDateFieldArray = [];
            var fieldUl = $('.customer-define-fields-list-warp', $el);
            if(defineFields && defineFields.length>0){
                fieldUl.show();
            }
            this.defineDateFieldArray = util.generateDefineField(fieldUl, defineFields, DateSelect);
            $('.area-auto-height', $el).trigger('autosize.resize');
            //================归属人选择相关
            this.selectColleague = new SelectColleague({
                //"element":$('.select-colleague',tplEl)
                "isMultiSelect": false,
                "hasWorkLeaveBtn": false,
                "title": "选择归属人"
            });
            //设置归属人
            this.selectColleague.on("selected", function (obj) {
                var name=obj.name;
                if(name.length>20){
                    name=name.slice(0,20)+"...";
                }
                util.confirm('您确定要将该销售客户的归属变更为【' + name + '】吗?', ' ', function () {
                    util.api({
                        "url": '/FCustomer/ModifyFCustomerOwner',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            customerID: self.get('customerID'),
                            ownerID: obj.employeeID
                        },
                        "success": function (data) {
                            if(data.success == true){
                                if(self.get('dialogType') == 3){
                                    //客户下修改归属人
    //                                self.v._pageBack();
                                    self.hasOwnerSet(obj.name);
                                    self.v && self.v.refreshRespName && self.v.refreshRespName(obj);
                                }else{
                                    self.hasOwnerSet(obj.name);
                                    self.trigger('success');
                                }
                            }

                        }
                    }, {
                        "submitSelector": ''
                    });
                });
            });
            var crmModifyRecordsWarp = $('.customer-modify-record-wrapper', this.$el);
//            this.modifyrecords = new ModifyRecords({
//                "wrapEl": crmModifyRecordsWarp,
//                "contactId": this.options.queryParams && this.options.queryParams.id,
//                "recordsUrl": "/Contact/GetSnapshotsOfContactID",//获取所有的修改记录请求地址
//                "snapshotsUrl": "/Contact/GetContactSnapshotTwoEntity",//获取两条实体
//                "restoreUrl": "/Contact/RestoreSnapshot",
//                "v": self
//            });
            //=================公海选择相关
            this.highseaSelect=new HighSeaSelect({
                "title":"选择公海",
                "url":"/HighSeas/GetAllHighSeas/",
                "hasCreate":true
            });
            //移动到公海
            this.highseaSelect.on("selected",function(obj){
                var name=obj.name;
                if(name.length>20){
                    name=name.slice(0,20)+"...";
                }
                util.confirm('是否要将当前客户移动到'+name+'？',' ',function(){
                    util.api({
                        'url': "/HighSeas/MoveHighseasCustomersForManager",
                        'type': 'post',
                        "dataType": 'json',
                        'data': {"targetHighSeasID":obj.id,"customerIDs":self.get('customerID').toString()},
                        'success': function (responseData) {
                            if(!responseData.success){
                                return;
                            }else{
                                self.refresh();
                                self.trigger('success');
                            }
                        }
                    });
                });
            })
            //================跟进人选择相关
            this.followSelect=new FollowSelect({});
            //设置跟进人
            this.followSelect.on("selected",function(value){
                
                //客户id
                var customerID=self.get('customerID').toString();
                //员工id
                var employeeID=value.employeeID;
                var url="/HighSeas/AllocateCustomersForManager";
                if(self.get('dialogType')!=0){
                    url="/Highseas/AllocateCustomers";
                }
                //设置客户的跟进人
                var name=value.name;
                if(name.length>20){
                    name=name.slice(0,20)+"...";
                }
                util.confirm("是否将当前客户的跟进人设置为"+name+"？"," ",function(){
                    util.api({
                        'url':url,
                        'type':'post',
                        'dataType':'json',
                        'data':{"employeeID":employeeID,"customerIDs":customerID},
                        'success':function(responseData){
                            if(responseData.success){
                                self.refresh();
                                self.trigger('success');
                            }else{
                                return;
                            }
                        }
                    });
                });

            });
           /* publishHelper.AdjustTextAreaSize({
                element: $('.area-auto-height', $el)
            });*/
        },
        /*=====================
                状态转换
         ======================*/
        //是否应该有编辑按钮的转换
        _isshowEdit:function(){
            if(this.get('dialogType')==1 && this.get('customerData').fCustomer.ownerID!==util.getCrmData().currentEmp.employeeID){
                this.editBtn.hide();
            }else{
                this.editBtn.show();
            }
        },
        //有跟进人设置
        hasFollowSet:function(name){
            var $el=this.element;

            //修改历史显示类别
            $('.customer-owner-history-wrapper-btn',$el).text('跟进人历史');
            this.set('isFollowed',true);

            this.editBox.css('background-color', '#53a93f');
            $('.owner-name-wrapper', $el).text('跟进人'+name).css('color', '#fff');
            //隐藏编辑按钮
            //$('.dialog-button-edit',$el).hide();
            //相关按钮显示隐藏
            switch(this.get('dialogType')){
                case 0:
                    $('.follow-cancel-btn',$el).show();
                    $('.follow-edit-btn',$el).show();
                    $('.follow-time',$el).hide();
                break;
                case 1:
                    $('.follow-cancel-btn',$el).hide();
                    $('.follow-edit-btn',$el).hide();
                    $('.follow-time',$el).hide();
                    if(this.get('customerData').fCustomer.ownerID!==util.getCrmData().currentEmp.employeeID){
                        $('.dialog-button-edit',$el).hide();
                    }
                break;
                case 2:
                    $('.follow-cancel-btn',$el).show();
                    $('.follow-edit-btn',$el).show();
                    $('.follow-time',$el).show();
                break;
            }
            $('.follow-set-btn',$el).hide();
            $('.follow-get',$el).hide();
            $('.owner-set-btn',$el).hide();
            $('.owner-cancel-btn',$el).hide();
            $('.owner-edit-btn',$el).hide();
            $('.move-highseas-btn',$el).hide();
        },
        //未含有跟进人设置
        hasNoFollowSet:function(){
            var $el=this.element;

            //修改历史显示类别
            $('.customer-owner-history-wrapper-btn',$el).text('跟进人历史');
            this.set('isFollowed',true);

            this.editBox.css('background-color', '#fff1a8');
            $('.owner-name-wrapper', $el).text('尚未设置跟进人').css('color', '#000');
            //隐藏编辑按钮
            //$('.dialog-button-edit',$el).hide();
            //相关按钮显示隐藏
            switch(this.get('dialogType')){
                case 0:
                    $('.follow-set-btn',$el).show();
                    $('.follow-get',$el).hide();
                break;
                case 1:
                    $('.follow-set-btn',$el).hide();
                    $('.follow-get',$el).show();
                    if(this.get('customerData').fCustomer.ownerID!=util.getCrmData().currentEmp.employeeID){
                        $('.dialog-button-edit',$el).hide();
                    }
                break;
                case 2:
                    $('.follow-set-btn',$el).show();
                    $('.follow-get',$el).hide();
                break;
            }
            
            $('.follow-cancel-btn',$el).hide();
            $('.follow-edit-btn',$el).hide();
            $('.owner-set-btn',$el).hide();
            $('.owner-cancel-btn',$el).hide();
            $('.owner-edit-btn',$el).hide();
            $('.move-highseas-btn',$el).hide();
            $('.follow-time',$el).hide();
        },
        //有归属人设置
        hasOwnerSet: function(name){
            var $el = this.element;

            //修改历史显示类别
            $('.customer-owner-history-wrapper-btn',$el).text('归属人历史');
            this.set('isFollowed',false);

            $('.owner-name-wrapper', $el).text('归属人'+name).css('color', '#fff');
            this.editBox.css('background-color', '#53a93f');
            //显示编辑按钮
            //$('.dialog-button-edit',$el).show();
            //相关按钮显示隐藏
            $('.owner-set-btn', $el).hide();
            $('.owner-edit-btn', $el).show();
            $('.owner-cancel-btn', $el).show();
            $('.follow-set-btn',$el).hide();
            $('.follow-cancel-btn',$el).hide();
            $('.follow-edit-btn',$el).hide();
            $('.follow-get',$el).hide();
            $('.move-highseas-btn',$el).show();
            $('.follow-time',$el).hide();

            if(this.get('dialogType') == 3){
                $('.owner-cancel-btn', $el).hide();
                $('.move-highseas-btn', $el).hide();
            }
        },
        //未含有归属人设置
        hasNoOwnerSet: function(name){
            var $el = this.element;

            //修改历史显示类别
            $('.customer-owner-history-wrapper-btn',$el).text('归属人历史');
            this.set('isFollowed',false);

            $('.owner-name-wrapper', $el).text('未分配客户').css('color', '#000');
            this.editBox.css('background-color', '#fff1a8');
            //显示编辑按钮
            //$('.dialog-button-edit',$el).show();
            //相关按钮显示隐藏
            $('.owner-set-btn', $el).show();
            $('.owner-edit-btn', $el).hide();
            $('.owner-cancel-btn', $el).hide();
            $('.follow-set-btn',$el).hide();
            $('.follow-cancel-btn',$el).hide();
            $('.follow-edit-btn',$el).hide();
            $('.follow-get',$el).hide();
            $('.move-highseas-btn',$el).show();
            $('.follow-time',$el).hide();
        },
        fillFormData: function(){
            var $el = this.element;
            var self = this;
            var customerData = this.get('customerData') || undefined;
            var fCustomer, highSeas;
            if(customerData && customerData.fCustomer){
                fCustomer = customerData.fCustomer;
                highSeas = customerData.highSeas;
            }else{
                return;
            }
            //先判断是否属于某公海 如果属于某公海
              //是否有跟进人
            //如果不属于某公海
              //是否有归属人

            //属于公海
            var followname;
            var tempname;
            if(self.get('dialogType')==2){
                self.expiretime=new Expiretime();
                self.expiretime.on('submit',function(val){
                    util.api({   
                        "url": '/HighSeas/SetCustomerExpireTime',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            customerID: self.get('customerID'),
                            expireTime:val
                        },
                        "success": function (data) {
                            if(data.success == true){
                                self.refresh();
                                self.trigger('success');
                            }else{
                                return;
                            }
                        }
                    });
                })
            }
            if(fCustomer.highSeasID){
                //含有跟进人
                if(fCustomer.ownerID){
                    if(self.get('dialogType')!=0){
                        var tempStr;
                        if(fCustomer.remainingDays<0){
                            tempStr="(超期"+(-fCustomer.remainingDays)+"天)"
                        }else{
                            tempStr="(余"+fCustomer.remainingDays+"天)"
                        }
                        tempname=fCustomer.owner.name;
                        if(tempname.length>5){
                            tempname=tempname.slice(0,4)+'...';
                        }
                        tempname=' '+tempname+' ';
                        followname=tempname+' '+moment(fCustomer.expireTime*1000).format('YYYY年MM月DD日')+'到期'+tempStr;
                    }else{
                        tempname=fCustomer.owner.name;
                        if(tempname.length>14){
                            tempname=' '+tempname.slice(0,13)+'... ';
                        }
                        followname=tempname;
                    }
                    self.hasFollowSet(followname);
                //不含跟进人
                }else{
                    self.hasNoFollowSet();
                }
            //不属于公海
            }else{
                //含有归属人
                if(fCustomer.ownerID){
                    tempname=fCustomer.owner.name;
                    if(tempname.length>14){
                        tempname=' '+tempname.slice(0,13)+'... ';
                    }
                    self.hasOwnerSet(tempname);
                //不含归属人
                }else{
                    self.hasNoOwnerSet();
                }
            }
            if(fCustomer){
            	$('input.fullName', $el).val(fCustomer.fullName);
                $('div.fullName', $el).text(fCustomer.fullName);
                $('input.name', $el).val(fCustomer.name);
                $('div.number', $el).text(fCustomer.fCustomerNo);
                $('input.number', $el).val(fCustomer.fCustomerNo);
                $('div.name', $el).text(fCustomer.name);
                $('input.address', $el).val(fCustomer.address);
                $('div.address', $el).text(fCustomer.address);
                $('input.webSite', $el).val(fCustomer.webSite);
                $('div.webSite', $el).text(fCustomer.webSite);
                $('textarea.introduction', $el).val(fCustomer.introduction);
                $('div.introduction', $el).text(fCustomer.introduction);

                //遍历客户相关信息 赋值给编辑页面和显示页面
                var container=$('.customer-infos-li',$el).parent();
                var infoLi=$('<li class="fn-clear customer-infos-li"><div class="inputs-tit"></div><div class="input-warp"><div class="long-view-text"></div></div></li>');

                container.empty();
                _.map(fCustomer.fBusinessTagRelations, function(tempTag){
                    if(tempTag.fBusinessTagOptionID){
                        util.mnSetter($('[data-fbusinesstagid='+tempTag.fBusinessTagID+']', $el).next().children('.mn-select-box'), tempTag.fBusinessTagOptionID)
                    }
                    /*
                    if(tempTag.fBusinessTagName == '客户状态')
                        $('.customer-status').val(tempTag.fBusinessTagOptionName);
                    */
                    var ele=infoLi.clone();
                    	ele.find('.inputs-tit').text(tempTag.fBusinessTagName);
                    	ele.find('.input-warp div').text(tempTag.fBusinessTagOptionName);
                    container.append(ele);
                });

                if(fCustomer.userDefineFieldDataList && fCustomer.userDefineFieldDataList.dateList){
                    _.map(fCustomer.userDefineFieldDataList.dateList, function(date){
                        var obj = _.find(self.defineDateFieldArray, function(obj){
                            return obj.fieldName == date.fieldName;
                        });
                        if(date.value>0){
                            obj.dateObj.setValue(date.value*1000);
                        }
                    })
                }

                var $fieldUl = $('.customer-define-fields-list-warp', $el);
                if(fCustomer.userDefineFieldDataList && fCustomer.userDefineFieldDataList.numList){
                    _.map(fCustomer.userDefineFieldDataList.numList, function(obj){
                        $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('input').val(obj.value);
                    })
                }
                if(fCustomer.userDefineFieldDataList && fCustomer.userDefineFieldDataList.textList){
                    _.map(fCustomer.userDefineFieldDataList.textList, function(obj){
                        $fieldUl.find("div[data-fieldname='"+obj.fieldName+"']").next().find('textarea').val(obj.value);
                    })
                }

                $('.area-auto-height', $el).trigger('autosize.resize');
            }
        },
        fillSourceInfoFormData: function(){
            var competitorData = this.get('competitorData') &&this.get('competitorData');
            var $el = this.element.find('.customer-sourceinfo-wrapper');
            if(competitorData){
                $('.name', $el).val(competitorData.name);
                $('.competitorScaleTagOptionName', $el).text(competitorData.competitorScaleTagOptionName);
                $('.competitivenessTagOptionName', $el).val(competitorData.competitivenessTagOptionName);
                $('.advantage', $el).val(competitorData.advantage);
                $('.disadvantage', $el).val(competitorData.disadvantage);
                $('.productLineTagOptionName', $el).val(competitorData.productLineTagOptionName);
            }
        },
        destroy: function(){
        	this.expiretime && (this.expiretime.destroy());
        	if(this.defineDateFieldArray) {
        		_.map(this.defineDateFieldArray, function(obj){
        			obj.dateObj && (obj.dateObj.destroy());
                })
        	}
        	this._modifyRecords && (this._modifyRecords.destroy());
        	var result = CustomerInSettingDialog.superclass.destroy.apply(this,arguments);
 			return result;
        }
    });

    module.exports = CustomerInSettingDialog;
});