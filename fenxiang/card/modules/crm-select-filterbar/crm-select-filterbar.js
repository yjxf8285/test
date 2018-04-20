/**
 * Created by liuxf on 2014/7/9.
 * 条件筛选工具条
 */
define(function (require, exports, module) {
    var tpl = require('./crm-select-filterbar.html');
    var css = require('./crm-select-filterbar.css');

    var SelectFilterbar = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: 'crm-select-filterbar', //CLASS名
        template: _.template($(tpl).filter('.select-filterbar-template').html()), //模板
        events: {
            "click .mn-checkbox-item": "rowOption",//点击选项
            "click .more-rows-btn": "moreRows",//更多筛选结果
            "click .more-option-btn": "moreOption",//行的更多
            "click .clear-all-btn": "clearOption"//清空
        },
        // 初始化设置
        initialize: function () {
            this.render();
            //            this.rowOption();
        },
        // 渲染
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            var tags = this.options.data || null;
            var defaultData = {
                title: this.options.title || '',
                tags: tags
            };
            elEl.html(renderTemplate(this.formatData(defaultData)));
            this.options.warpEl.html(elEl);
            this.reSet();
            return this;
        },

        // 数据格式化
        formatData: function (responseData) {
            var formatData = {};
            _.extend(formatData, responseData || {});
            // 搜索结果
            formatData.results = responseData.results || '';
            return formatData;
        },
        // 重置状态
        reSet: function () {
            var elEl = this.$el;
            var tagsLen = this.options.data.length;
            var selectFilterbarBdEl = $('.select-filterbar-bd', elEl);
            var rowsEl = $('.rows', selectFilterbarBdEl);
            var rowOptionWarpEl = $('.row-option-warp', rowsEl);
            var moreRowsEl = $('.more-rows', selectFilterbarBdEl);
            var rowLenght = rowsEl.length;
            var bdEl = $('.select-filterbar-bd', elEl);
            var checkboxItemEl = $('.mn-checkbox-item', bdEl);
            checkboxItemEl.removeClass('mn-selected');
            moreRowsEl.children().text('更多筛选条件').removeClass('up');
            $('.clear-all-btn', elEl).hide();
            rowOptionWarpEl.each(function () {
                var WarpH = $(this).height();
                if (WarpH > 26) {
                    $(this).addClass('minidisplay');
                    $(this).find('.more-option-btn').text('展开').show().removeClass('up');
                }
            });
            if (rowLenght > this.options.defLine) {
                moreRowsEl.show();
                rowsEl.eq(this.options.defLine - 1).nextAll().hide();
            } else {
                rowsEl.last().addClass('noborder');
            }

        },
        moreOption: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var rowOptionWarpEl = meEl.closest('.row-option-warp');
            var bdEl = $('.select-filterbar-bd', elEl);
            var checkboxItemEl = $('.mn-checkbox-item', bdEl);
            if (meEl.text() == '收起') {
                meEl.text('展开').removeClass('up');
                rowOptionWarpEl.addClass('minidisplay');

            } else {
                rowOptionWarpEl.removeClass('minidisplay');
                meEl.text('收起').addClass('up');
            }
            //如果是IE7 就重新渲染一下dom，解决错位问题。
            var b_v = navigator.appVersion;
            var IE7 = b_v.search(/MSIE 7/i) != -1;
            if (IE7) {
                $('body').hide().show();
            }

        },
        moreRows: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var rowslen = this.options.rowslen;
            var bdEl = $('.select-filterbar-bd', elEl);
            var rowsEl = $('.rows', bdEl);

            if (meEl.text() == '收起') {
                meEl.text('更多筛选条件').removeClass('up');
                rowsEl.eq(this.options.defLine - 1).nextAll().hide();
            } else {
                rowsEl.eq(this.options.defLine - 1).nextAll().show();
                meEl.text('收起').addClass('up');
            }

        },
        //清空
        clearOption: function () {
            var elEl = this.$el;
            var bdEl = $('.select-filterbar-bd', elEl);
            var checkboxItemEl = $('.mn-checkbox-item', bdEl);
            var clearBtn = $('.clear-all-btn', elEl);
            checkboxItemEl.removeClass('mn-selected');
            clearBtn.hide();
            this.options.v.options.data.listTagOptionID = '';
            this.submit();
        },
        // 选项操作
        rowOption: function (e) {
            var that = this;
            // 加了延迟请求，因为要等到点击后把框勾上再遍历
            _.delay(function () {
                that.submit(e);
            }, 2);
        },
        //提交操作
        submit: function () {
            var elEl = this.$el;
            var that = this;
            var bdEl = $('.select-filterbar-bd', elEl);
            var clearBtn = $('.clear-all-btn', elEl);
            var checkboxItemEl = $('.mn-checkbox-box', bdEl);
            var searchInputEl = $('.crm-list-header-search .ui-search-field');
            var listTagOptionID = [];
            checkboxItemEl.each(function () {
                var meEl = $(this);
                var isSelected = meEl.find('.mn-checkbox-item').is('.mn-selected');
                if (isSelected) {

                    listTagOptionID.push(meEl.find('.mn-checkbox-item').data('value'));
                }
            });
            // 有选项被勾上的时候才显示清空按钮
            if (listTagOptionID.length > 0) {
                clearBtn.show();
            } else {
                clearBtn.hide();
            }
            this.options.v.refresh({
                keyword: searchInputEl.val(),
                listTagOptionID: listTagOptionID.join('_')
            });
        }

    });
    module.exports = SelectFilterbar;
});