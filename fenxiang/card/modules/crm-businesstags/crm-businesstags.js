/**
 * CRM - 设置 - 标签管理 - module
 *
 * @author liuxiaofan
 * 2014-03-20
 */

define(function (require, exports, module) {
    var tpl = require('modules/crm-businesstags/crm-businesstags.html');
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
            "click .createtags-btn": "_createNewTags", //创建标签按钮
            "click .tag-item": "_modifyTags", //修改标签按钮
            "click .tag-delbtn": "_delTags", //删除标签按钮
            "keyup .tags-search-input": "_searchTagsByKeyUp", //搜索框按键事件
            "click .backtoall-btn": "_backToAll", //返回查看全部
            "click .tags-search-btn": "_searchTags" //搜索按钮
        },
        // 初始化设置
        initialize: function () {
            this.render();
            //因为只有两个弹框，所以初始化的时候就先new出来
            this.createNewTagsDialog = new CreateNewTagsDialog();
            this.createNewTagsDialog.itemV = this;
            this.modifyTagsDialog = new ModifyTagsDialog();
            this.modifyTagsDialog.itemV = this;

        },
        // 渲染
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            var defaultData = {
                tagsLength: 0,
                keyWord: '',
                tagTitle: '客户标签',
                value: {tags: []}
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
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                "success": function (responseData) {
                    if (responseData.success) {
                        elEl.html(that.template(that.formatData(responseData)));//更新模板HTML字符串并且插入到父级容器
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
                    tagTitle = '销售记录';
                    break;
                case 4:
                    tagTitle = '销售机会';
                    break;
                case 5:
                    tagTitle = '产品';
                    break;
                case 6:
                    tagTitle = '竞争对手';
                    break;
                case 7:
                    tagTitle = '合同';
                    break;
                case 8:
                    tagTitle = '市场活动';
                    break;
                case 9:
                    tagTitle = '销售线索';
                    break;
                default :
                    tagTitle = '客户';
                    break;
            }
            // 搜索结果
            formatData.tagTitle = tagTitle;//标签标题
            formatData.keyWord = this.options.data.keyword;//搜索关键字
            formatData.tagsLength = responseData.value.tags.length || 0;
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

            //初始化一个搜索框
            var searchBox = new SearchBox({
                "element": searchWarpEl,
                "placeholder": '搜索标签'
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
        // 创建新标签
        _createNewTags: function () {
            this.createNewTagsDialog.show();
        },
        // 修改标签
        _modifyTags: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.tag-item');
            var tagID = itemEl.data('id');
            util.api({
                "url": '/FBusinessTag/GetBusinessTagByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "tagID": tagID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.modifyTagsDialog.oData = responseData;
                        that.modifyTagsDialog.show();
                    }
                }
            });
        },
        // 删除标签
        _delTags: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.tag-item');
            var tagID = itemEl.data('id');
            var tagName = itemEl.data('name');
            util.confirm('确定要删除该标签“' + tagName + '”吗？', '', function () {
                util.api({
                    "url": '/FBusinessTag/DeleteBusinessTag',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "tagID": tagID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.refresh(); //刷新列表
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
    /**
     * 创建新标签的弹框
     */
    var CreateNewTagsDialog = Dialog.extend({
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
            var result = CreateNewTagsDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = CreateNewTagsDialog.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "show": function () {
            var result = CreateNewTagsDialog.superclass.show.apply(this, arguments);
            this.conTextareaEl.height('180px');
            return result;
        },
        "clear": function () {
            this.titInputEl.val('');
            this.conTextareaEl.val('');
        },
        "submit": function () {
            var that = this;
            var nameVal = this.titInputEl.val();
            var typeVal = this.itemV.options.data.tagType;
            var tagOptionsVal = this.conTextareaEl.val();
            var arrTagOptionsVal = tagOptionsVal.split('\n');
            if ($.trim(nameVal).length <= 0) {
                util.alert('请填写标签名称', function() {
                    that.titInputEl.focus();
                });
                return false;
            }
            var validVal = [];
            var validStatus = _.every(arrTagOptionsVal, function (item) {
                	validVal.push(item);
                return (item.length <= 20);
            });
            if (!validStatus) {
                util.alert('每项最多可输入20个字符！', function() {
                    that.conTextareaEl.focus();
            });
                return false;
            }
            util.api({
                "url": '/FBusinessTag/AddBusinessTag',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "name": nameVal,
                    "type": typeVal,
                    "tagOptions": validVal
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.hide();
                        that.itemV.refresh();//刷新LIST
                    }
                }
            }, {
                "submitSelector": $('.crm-button-submit', this.elEl)
            });

        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.elEl = elEl;
            this.titInputEl = $('.tit-input', elEl); //表单标题输入框
            this.conTextareaEl = $('.con-textarea', elEl); //选项输入框
        },
        // 设置组件
        setupComponent: function () {
            //textarea高度自适应
            publishHelper.AdjustTextAreaSize({
                element: this.conTextareaEl
            })
        }
    });
    /**
     * 修改标签的弹框
     */
    var ModifyTagsDialog = Dialog.extend({
        "attrs": {
            width: 600,
            closeTpl:"<div class = 'crm-ui-dialog-close'>×</div>",
            content: $(tpl).filter('.dialog-modifytags-template').html(),
            className: 'dialog-modifytags'
        },
        "events": {
            'click .crm-button-submit': 'submit',
            'click .modifytitname-btn': '_modifyTagTitName',
            'click .set-def-potion-btn': '_setDefPotion',
            'click .add-potion-btn': '_addTagOption',
            'click .save-potion-btn': '_modifyTagOption',
            'click .del-potion-btn': '_delTagOption',
            'click .crm-button-cancel': 'hide'
        },
        "render": function () {
            var result = ModifyTagsDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = ModifyTagsDialog.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "show": function () {
            var that = this;
            var result = ModifyTagsDialog.superclass.show.apply(this, arguments);
            var data = this.oData.value;
            var isSystemTag = data.isSystemTag;
            var options = data.options;//选项数组
            var allOptionStr = '';
            var listOptionStr = '';
            var arrMnSelectData = [
                {
                    "text": '不设置',
                    "value": 0
                }
            ];
            var defOption = {
                "text": '不设置',
                "value": 0
            };
            var titInputEl = $('.tit-input', this.element);
            if (isSystemTag) {
                titInputEl.prop("disabled", true); //表单置灰
                this.modifytitnameBtnWarpEl.html('系统标签');
                arrMnSelectData = [];//系统标签不要“不设置”选项了
            } else {
                titInputEl.prop("disabled", false); //表单置灰
                this.modifytitnameBtnWarpEl.html('<button class="crm-button-blue modifytitname-btn small-btn">保存</button>');
            }
            this.titInputEl.val(data.name);
            _.each(options, function (option, index) {
                var isDefault = option.isDefault;//是否默认显示
                var name = option.name;
                var fBusinessTagOptionID = option.fBusinessTagOptionID;
                arrMnSelectData.push({
                    "text": name,
                    "value": fBusinessTagOptionID
                });

                listOptionStr += '<li class="mn-select-item" data-value="' + name + '" data-selected="' + isDefault + '">' + name + '</li>';
                allOptionStr += '<div class="c"><input type="text" placeholder="" value="' + name + '" class="crm-textfield potion-tit-input" data-optionid="' + fBusinessTagOptionID + '" /> <button class="crm-button-blue save-potion-btn small-btn">保存</button> <button class="crm-button-gray del-potion-btn small-btn">删除</button></div>';
                if (isDefault) {
                    defOption = {
                        "text": name,
                        "value": fBusinessTagOptionID
                    };
                }
            });

            //重新设置select的数据源(重新设置options)
            util.mnSelect(this.mnSelectEl, 'syncModel', arrMnSelectData);
            util.mnSetter(this.mnSelectEl, defOption.value);//默认value
            this.mnSlTitleWarpEl.html(defOption.text || '不设置');//默认文字
            this.cWarpEl.html(allOptionStr);
            return result;
        },
        "clear": function () {
            this.titInputEl.val('');
            this.addTagPotionInputEl.val('');
            this.conTextareaEl.val('');
            util.mnReset(this.mnSelectEl);
        },
        "submit": function () {
            var that = this;
            var nameVal = this.titInputEl.val();
            var typeVal = this.itemV.options.data.tagType;
            var tagOptionsVal = this.conTextareaEl.val();
            var arrTagOptionsVal = tagOptionsVal.split('\n');
            var isErr = false;
            _.each(arrTagOptionsVal, function (item) {
                if (item.length >= 20) {
                    isErr = true;
                }
            });
            if (!isErr) {
                util.api({
                    "url": '/FBusinessTag/AddBusinessTag',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "name": nameVal,
                        "type": typeVal,
                        "tagOptions": tagOptionsVal.split('\n')
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            that.hide();
                            that.itemV.refresh();//刷新LIST
                        }
                    }
                }, {
                    "submitSelector": $('.crm-button-submit', this.elEl)
                });
            }else{
                util.alert('每行一个选项，选项最多20个字');
            }
        },
        //修改标签标题
        _modifyTagTitName: function (e) {
            var that = this;
            var data = this.oData.value;
            var nameVal = this.titInputEl.val();
            var typeVal = data.type;
            var meEl = $(e.currentTarget);
            util.api({
                "url": '/FBusinessTag/ModifyBusinessTag',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "name": nameVal,
                    "tagType": typeVal,
                    "tagID": data.fBusinessTagID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        util.alert('保存成功');
                        that.itemV.refresh();//刷新LIST
                    }
                }
            }, {
                "submitSelector": meEl
            });
        },
        //设置默认选项
        _setDefPotion: function (e) {
            var that = this;
            var data = this.oData.value;
            var nameVal = this.titInputEl.val();
            var typeVal = data.type;
            var meEl = $(e.currentTarget);
            var mnSelectEl = $('.mn-select-box', this.element);
            var aaa = util.mnGetter(mnSelectEl);
            util.api({
                "url": '/FBusinessTag/SetBusinessTagOptionIsDefault',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "tagOptionID": util.mnGetter(that.mnSelectEl),
                    "tagID": data.fBusinessTagID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        util.alert('设置成功');
                        that.itemV.refresh();//刷新LIST
                    }
                }
            }, {
                "submitSelector": meEl
            });
        },
        //新增标签选项
        _addTagOption: function (e) {
            var that = this;
            var data = this.oData.value;
            var nameVal = this.addTagPotionInputEl.val();
            var typeVal = data.type;
            var meEl = $(e.currentTarget);
            util.api({
                "url": '/FBusinessTag/AddBusinessTagOption',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "name": nameVal,
                    "tagID": data.fBusinessTagID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        var addOptionStr = '<div class="c"><input type="text" placeholder="" value="' + nameVal + '" class="crm-textfield potion-tit-input"  data-optionid="' + responseData.value + '" /> <button class="crm-button-blue save-potion-btn small-btn">保存</button> <button class="crm-button-gray del-potion-btn small-btn">删除</button></div>';
                        that.cWarpEl.append(addOptionStr);
                        util.mnSelect(that.mnSelectEl, 'addOption', {
                            "text": nameVal,
                            "value": responseData.value
                        });
                        var data = that.oData.value;
                        var isSystemTag = data.isSystemTag;
                        // HACK: 重新设置select下的值 addOption后 会重新用缓存数据渲染
                        $('.ui-select-item', $('.crm-setting-tageditselect')).each(function(i, item) {
                            if (isSystemTag) {
                                var val = $('.c-warp .c').eq(i).find('.potion-tit-input').val();
                                if ($.trim(val).length > 0) {
                                    $(item).html(val);
                                }
                            } else {
                                if (i > 0) {
                                    var val = $('.c-warp .c').eq(i-1).find('.potion-tit-input').val();
                                    if ($.trim(val).length > 0) {
                                        $(item).html(val);
                                    }
                                }
                            }
                        });
                        that.addTagPotionInputEl.val('');
                        that.itemV.refresh();//刷新LIST
                    }
                }
            }, {
                "submitSelector": meEl
            });
        },
        //修改标签选项
        _modifyTagOption: function (e) {
            var that = this;
            var data = this.oData.value;
            var typeVal = data.type;
            var meEl = $(e.currentTarget);
            var optionItemEl = meEl.closest('.c');
            var nameVal = $('.potion-tit-input', optionItemEl).val();
            var tagOptionID = $('.potion-tit-input', optionItemEl).data('optionid');
            util.api({
                "url": '/FBusinessTag/ModifyBusinessTagOption',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "name": nameVal,
                    "tagOptionID": tagOptionID,
                    "tagID": data.fBusinessTagID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        // 更新select的值
                        var $option = $('.ui-select-item[data-value='+ tagOptionID+ ']', $('.crm-setting-tageditselect'));
                        if ($option.hasClass('ui-select-selected')) {
                            $('.mn-select-title', that.mnSelectEl).html(nameVal);
                        }
                        $option.html(nameVal);
                        //成功之后
                        util.alert('保存成功');
                        that.itemV.refresh();
                    }
                }
            }, {
                "submitSelector": meEl
            });
        },
        //删除标签选项
        _delTagOption: function (e) {
            var that = this;
            var data = this.oData.value;
            var typeVal = data.type;
            var meEl = $(e.currentTarget);
            var optionItemEl = meEl.closest('.c'),
                optionIndex = optionItemEl.index();
            var nameVal = $('.potion-tit-input', optionItemEl).val();
            var tagOptionID = $('.potion-tit-input', optionItemEl).data('optionid');
            util.confirm('确定要删除该选项吗？删除后无法恢复', '', function () {
                util.api({
                    "url": '/FBusinessTag/DeleteBusinessTagOption',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "tagOptionID": tagOptionID,
                        "tagID": data.fBusinessTagID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            //成功之后
                            optionItemEl.remove();
                            
                            var data = that.oData.value;
                            var isSystemTag = data.isSystemTag;
                            if (isSystemTag) {
                                util.mnSelect(that.mnSelectEl, 'removeOption', optionIndex);
                                if (util.mnGetter(that.mnSelectEl) == tagOptionID) {
                                    var $option = $('.ui-select-item', $('.crm-setting-tageditselect')).eq(0);
                                    $option.addClass('ui-select-selected');
                                    $('.mn-select-title', that.mnSelectEl).html($option.html());
                                    util.mnSetter(that.mnSelectEl, $option.data('value'));
                                }  
                            } else {
                                util.mnSelect(that.mnSelectEl, 'removeOption', optionIndex + 1);
                                util.mnSetter(that.mnSelectEl, 0);
                            }
                            that.itemV.refresh();
                        }
                    }
                }, {
                    "submitSelector": meEl
                });
            });

        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.elEl = elEl;
            this.titInputEl = $('.tit-input', elEl); //表单标题输入框
            this.addTagPotionInputEl = $('.add-tag-potion-input', elEl); //添加选项输入框
            this.conTextareaEl = $('.con-textarea', elEl); //选项输入框
            this.modifytitnameBtnWarpEl = $('.modifytitname-btn-warp', elEl); //保存系统标签按钮容器
            this.mnSlWarpEl = $('.set-default-mn-warp', elEl); //模拟下拉列表容器
            this.mnSlTitleWarpEl = $('.potion-mn-select-list-title', elEl); //模拟下拉列表容器
            this.mnSelectEl = $('.mn-select-box', elEl);//模拟下拉列表元素
            this.cWarpEl = $('.c-warp', elEl); //选项列表容器
        },
        // 设置组件
        setupComponent: function () {

        }
    });
    module.exports = BusinessTags;
});