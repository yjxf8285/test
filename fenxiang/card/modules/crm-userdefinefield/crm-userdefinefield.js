/**
 * CRM - 设置 - 标签管理 - module
 *
 * @author liuxiaofan
 * 2014-03-20
 */

define(function (require, exports, module) {
    var tpl = require('modules/crm-userdefinefield/crm-userdefinefield.html');
////    var tplStyle = require('modules/crm-businesstags/crm-businesstags.css');
    var Dialog = require('dialog');
    var util = require('util');
    var SearchBox = require('uilibs/search-box');
    var publishHelper = require('modules/publish/publish-helper');
    /**
     * CRM - 设置 - 标签管理
     * 普通选项参数会被注册到 this.options 中。
     * 特殊的选项： model, collection, el, id, className, 以及 tagName。
     */
    var BusinessTags = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: 'businesstags-list', //CLASS名
        url: null, //请求地址
        data: null, //请求参数
        template: _.template($(tpl).filter('.businesstags-template').html()), //模板
        events: {
            "click .create-define-field-btn": "_create",
            "click .tag-item": "_modify", //修改标签按钮
            "click .tag-delbtn": "_delete",
            "keyup .tags-search-input": "_searchTagsByKeyUp", //搜索框按键事件
            "click .backtoall-btn": "_backToAll", //返回查看全部
            "click .tags-search-btn": "_searchTags" //搜索按钮
        },
        // 初始化设置
        initialize: function () {
            var type = this.options.data.tagType;
            if(type ==1 || type ==2 || type==3){}else{
                this.options.data.tagType = 1;
            }
            this.render();
            //因为只有两个弹框，所以初始化的时候就先new出来
            this.createDialog = new CreateDefineFieldDialog({
                tagType: this.options.data.tagType
            });
            this.createDialog.itemV = this;
            this.modifyDialog = new CreateDefineFieldDialog({
                title: '编辑字段'
            });
            this.modifyDialog.itemV = this;

        },
        // 渲染
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            var defaultData = {
                tagsLength: 0,
                keyWord: '',
                tagTitle: '客户自定义字段',
                value: {UserDefineFields: []}
            };

            elEl.html(renderTemplate(defaultData));
            this.options.warpEl.html(elEl);

            return this;
        },
        // 清空
        destroy: function () {
            this.remove();
        },
        // 请求数据
        load: function () {
            var that = this;
            var elEl = this.$el;
            var param = _.extend({},this.options.data,{type: this.options.data.tagType});
            util.api({
                "url": '/UserDefineField/GetUserDefineFieldData',
                "type": 'get',
                "dataType": 'json',
                "data": param,
                "success": function (responseData) {
                    if (responseData.success) {
                        elEl.html(that.template(that.formatData(responseData)));//更新模板HTML字符串并且插入到父级容器
                        var d = that.options.data;
                        if(d.textNum>9 && d.dateNum>4 && d.numNum>4){
                            $('.user-define-field-ul', elEl).children().first().find('.create-define-field-btn').addClass('create-define-field-btn-disabled')
                        }else{
                            $('.user-define-field-ul', elEl).children().first().find('.create-define-field-btn').removeClass('create-define-field-btn-disabled')
                        }
                        var introEl = $('.create-define-field-intro', elEl);
                        d.textNum == 10 ? introEl.find('.text').text(10-d.textNum).css('color', '#ff0000') : introEl.find('.text').text(10-d.textNum);
                        d.dateNum == 5 ? introEl.find('.date').text(5-d.dateNum).css('color', '#ff0000') : introEl.find('.date').text(5-d.dateNum);
                        d.numNum == 5 ? introEl.find('.num').text(5-d.numNum).css('color', '#ff0000') : introEl.find('.num').text(5-d.numNum);

                        that.tagType = that.options.data.tagType;
                        that.setupDoms();
                    }
                }
            });
        },
        // 刷新数据
        refresh: function (data) {
            data && (_.extend(this.options.data, data));
            this.load();

        },
        // 原始数据格式化
        formatData: function (responseData) {
            var formatData = {};
            var tagTitle = '';
            _.extend(formatData, responseData || {});
            //标签类型(1:客户;2:联系人;3:销售记录;4:销售机会;5:产品;6:竞争对手;7:合同;8:市场活动;9:销售线索;)
            switch (parseFloat(this.options.data.tagType)) {
                case 1:
                    tagTitle = '客户';
                    break;
                case 2:
                    tagTitle = '联系人';
                    break;
                case 3:
                    tagTitle = '机会';
                    break;
                default :
                    tagTitle = '客户';
                    break;
            }
            // 搜索结果
            formatData.tagTitle = tagTitle;//标签标题
            formatData.keyWord = this.options.data.keyword;//搜索关键字
            formatData.tagsLength = responseData.value.UserDefineFields.length || 0;


            var textNum=0, dateNum=0, numNum=0;
            formatData.value.UserDefineFields = _.map(responseData.value.UserDefineFields, function(obj){
                if(obj.fieldType == 1){
                    obj.fieldTypeName = '文本';
                    textNum = textNum+1;
                }
                if(obj.fieldType == 2){
                    dateNum = dateNum+1;
                    obj.fieldTypeName = '日期';
                }
                if(obj.fieldType == 3){
                    numNum = numNum+1;
                    obj.fieldTypeName = '数值';
                }
                return obj
            });
            this.options.data.textNum = textNum;
            this.options.data.dateNum = dateNum;
            this.options.data.numNum = numNum;
            return formatData;
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.$el;
            var that = this;
            this.elEl = elEl;
            this.searchInputEl = $('.tags-search-input', elEl);
            this.searchInputEl.val(this.options.data.keyword);
            var searchWarpEl = $('.search-warp', elEl);

            var searchBox = new SearchBox({
                "element": searchWarpEl,
                "placeholder": '搜索字段'
            });
            searchBox.on('search', function (queryValue) {
                that.queryValue = queryValue;
                var data = {
                    tagType: that.tagType,
                    keyword: queryValue
                }
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    that.refresh(data);
                }
            });
            searchWarpEl.find('.ui-search-field').val(this.options.data.keyword);
        },
        // 设置组件
        setupComponent: function () {

        },
        _create: function (e) {
            if($(e.target).hasClass('create-define-field-btn-disabled')) return ;

            var d = this.options.data;
            this.createDialog.show({
                textNum: d.textNum,
                dateNum: d.dateNum,
                numNum:  d.numNum
            });
        },
        _modify: function (e) {
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.tag-item');

            var userDefineFieldID = itemEl.attr('data-id');
            var fieldTypeName = itemEl.attr('data-typename');

            var fieldDescription = itemEl.find('.tag-name').text();

            this.modifyDialog.show({
                userDefineFieldID: userDefineFieldID,
                fieldDescription: fieldDescription,
                fieldTypeName: fieldTypeName

            });
        },
        _delete: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.tag-item');
            var userDefineFieldID = itemEl.attr('data-id');
            var fieldDescription = itemEl.find('.tag-name').text();

            util.confirm('确定要删除该字段吗“' + fieldDescription + '”吗？', '', function () {
                util.api({
                    "url": '/UserDefineField/DeleteUserDefineField',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        userDefineFieldID: parseInt(userDefineFieldID)
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.refresh();
                        }
                    }
                });
            });
            return false;
        },
        // 返回全部
        _backToAll: function () {
            var that = this;
            var data = {
                tagType: this.tagType,//int，标签类型(1:客户;2:联系人;3:销售记录;4:销售机会;5:产品;6:竞争对手;7:合同;8:市场活动;9:销售线索;)
                keyword: ''//string，搜索关键字(标签名称 模糊匹配)
            }
            this.refresh(data);
        }

    });

    var CreateDefineFieldDialog = Dialog.extend({
        "attrs": {
            width: 600,
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            content: $(tpl).filter('.dialog-createnewtags-template').html(),
            className: 'dialog-createnewtags',
            webDisk: null
        },
        "events": {
            'click .crm-button-submit': 'submit',
            'click .crm-button-cancel': 'hide'
        },
        "render": function () {
            var result = CreateDefineFieldDialog.superclass.render.apply(this, arguments);
            if(this.get('title')){
                $('h1', this.element).text(this.get('title'));
            }
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = CreateDefineFieldDialog.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },
        "show": function (opts) {
            var result = CreateDefineFieldDialog.superclass.show.apply(this, arguments);
            var $el = this.element;
            if(opts && opts.userDefineFieldID){
                $('.view-wrapper', $el).show();
                $('.edit-wrapper', $el).hide();
                this.set('userDefineFieldID', opts.userDefineFieldID);
                $('.fieldDescription', $el).val(opts.fieldDescription);
                $('.user-define-field-type-name', $el).text(opts.fieldTypeName)
            }

//            if(opts && opts.textNum){
//                var options = [];
//                if(opts && opts.textNum<10){
//                    options.push({
//                        value: 1,
//                        text: '文本',
//                    });
//                }
//                if(opts && opts.dateNum<5){
//                    options.push({
//                        value: 2,
//                        text: '日期',
//                    });
//                }
//                if(opts && opts.numNum<5){
//                    options.push({
//                        value: 3,
//                        text: '数值',
//                    });
//                }
//                if(options.length>0){
//                    options[0].selected = true;
//                    this.set('selectedType', options[0].value);
//                    util.mnSelect($('.user-define-field-type', $el), 'syncModel', options);
//                }
//            }
            return result;
        },
        "reset": function () {
            var $el = this.element;
            util.mnSetter($('.user-define-field-type', $el), 1);
            this.setupComponent();
            this.set('userDefineFieldID', undefined);
            $('.view-wrapper', $el).hide();
            $('.edit-wrapper', $el).show();
            $('.fieldDescription', $el).val('');
        },
        "submit": function () {
            var that = this;
            var type = this.get('tagType');
            var fieldType = util.mnGetter($('.user-define-field-type', this.element))||1;
            var fieldDescription = $('.fieldDescription', this.element).val();
            var userDefineFieldID = this.get('userDefineFieldID');
            if(userDefineFieldID){
                util.api({
                    "url": '/UserDefineField/UpdateUserDefineField',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加自定义字段发生错误，原因：',
                    "data": {
                        userDefineFieldID: userDefineFieldID,
                        fieldDescription: fieldDescription
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.hide();
                            that.itemV.refresh();
                        }
                    }
                }, {
//                    "submitSelector": $('.crm-button-submit', this.elEl)
                    "submitSelector": ''
                });
            }else{
                util.api({
                    "url": '/UserDefineField/AddUserDefineField',
                    "type": 'post',
                    "dataType": 'json',
                    "errorMsgTitle": '添加自定义字段发生错误，原因：',
                    "data": {
                        type: type,
                        fieldType: fieldType,
                        fieldDescription: fieldDescription
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            that.hide();
                            that.itemV.refresh();//刷新LIST
                        }
                    }
                }, {
                    "submitSelector": ''
                });
            }

        },
        setupComponent: function() {
            var $el = this.element;
            util.mnSelect($('.user-define-field-type', $el), 'syncModel', [{
                value: 1,
                text: '文本',
                selected: true
            },{
                value: 2,
                text: '日期'
            },{
                value: 3,
                text: '数值'
            }]);
        }
    });

    module.exports = BusinessTags;
});