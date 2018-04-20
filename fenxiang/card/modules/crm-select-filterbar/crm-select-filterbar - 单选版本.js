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
            "click .row-option": "rowOption",
            "click .more-rows-btn": "moreRows",
            "click .more-option-btn": "moreOption",
            "click .del-btn": "delOption",
            "click .clear-option-btn": "clearOption"
        },
        // 初始化设置
        initialize: function () {
            this.render();
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
        reSet: function () {
            var elEl = this.$el;
            var tagsLen = this.options.data.length;
            var selectFilterbarBdEl = $('.select-filterbar-bd', elEl);
            var rowsEl = $('.rows', selectFilterbarBdEl);
            var rowOptionWarpEl = $('.row-option-warp', rowsEl);
            var moreRowsEl = $('.more-rows', selectFilterbarBdEl);
            var rowLenght = rowsEl.length;
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectOptionWarpEl = $('.isselect-rows .select-option-warp', elEl);
            selectOptionWarpEl.html('');
            isselectRowsEl.hide();
            moreRowsEl.children().text('更多筛选条件').removeClass('up');
            rowsEl.show();
            rowOptionWarpEl.each(function () {
                var WarpH = $(this).height();
                if (WarpH > 20) {
                    $(this).addClass('minidisplay');
                    $(this).find('.more-option-btn').text('展开').show().removeClass('up');
                }
            });
            if (rowLenght > this.options.defLine) {
                moreRowsEl.show();
                rowsEl.eq(this.options.defLine-1).nextAll().hide();
            } else {
                rowsEl.last().addClass('noborder');
            }


        },
        moreOption: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var rowOptionWarpEl = meEl.closest('.row-option-warp');
            if (meEl.text() == '收起') {
                meEl.text('展开').removeClass('up');
                rowOptionWarpEl.addClass('minidisplay');

            } else {
                rowOptionWarpEl.removeClass('minidisplay');
                meEl.text('收起').addClass('up');
            }

        },
        moreRows: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var rowslen = this.options.rowslen;
            var selectFilterbarBdEl = $('.select-filterbar-bd', elEl);
            var rowsEl = $('.rows', selectFilterbarBdEl);
            var rowOptionWarpEl = $('.row-option-warp', rowsEl);
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectOptionEl = $('.select-option', isselectRowsEl);

            if (meEl.text() == '收起') {
                meEl.text('更多筛选条件').removeClass('up');
                rowsEl.eq(this.options.defLine-1).nextAll().hide();
            } else {
                rowsEl.eq(this.options.defLine-1).nextAll().show();
                meEl.text('收起').addClass('up');
            }
            rowsEl.each(function () {
                var rowid = $(this).data('tagid');
                var that=this;
                selectOptionEl.each(function () {
                    var optionid = $(this).data('tagid');
                    if (optionid == rowid) {
                        $(that).hide();
                    }
                });
            });
        },
        rowOption: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var rowEl = meEl.closest('.rows');
            var rowTitEl = $('.row-tit', rowEl);
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectFilterbarBdEl = $('.select-filterbar-bd', elEl);
            var moreRowsEl = $('.more-rows', selectFilterbarBdEl);
            var rowsEl = $('.rows', selectFilterbarBdEl);
            var selectOptionWarpEl = $('.isselect-rows .select-option-warp', elEl);
            var selectedStr = '<div class="select-option" href="javascript:;" data-tagid="' + rowEl.data('tagid') + '" data-optionid="' + meEl.data('optionid') + '"> ' + rowTitEl.text() + '：<span class="orange">' + meEl.text() + '<span class="del-btn"> ×</span></span> </div>';
            selectOptionWarpEl.append(selectedStr);
            isselectRowsEl.show();
            rowEl.hide();
            this.submit();

        },
        clearOption: function () {
            var elEl = this.$el;
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectOptionWarpEl = $('.isselect-rows .select-option-warp', elEl);
            selectOptionWarpEl.html('');
            isselectRowsEl.hide();
            this.reSet();
            this.options.v.refresh({
                listTagOptionID: ''
            })
        },
        delOption: function (e) {
            var elEl = this.$el;
            var meEl = $(e.currentTarget);
            var selectOptionEl = meEl.closest('.select-option');
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectOptionWarpEl = $('.isselect-rows .select-option-warp', elEl);
            var selectFilterbarBdEl = $('.select-filterbar-bd', elEl);
            var rowsEl = $('.rows', selectFilterbarBdEl);
            var tagid = selectOptionEl.data('tagid');
            rowsEl.each(function () {
                var rowid = $(this).data('tagid');
                if (tagid == rowid) {
                    $(this).show();
                }
            });
            selectOptionEl.remove();
            if (selectOptionWarpEl.html() == '') {
                isselectRowsEl.hide();
            }
            this.submit();

        },
        submit: function () {
            var elEl = this.$el;
            var isselectRowsEl = $('.isselect-rows', elEl);
            var selectOptionEl = $('.select-option', isselectRowsEl);
            var listTagOptionID = [];
            selectOptionEl.each(function () {
                var tagid = $(this).data('tagid');
                var optionid = $(this).data('optionid');
                listTagOptionID.push(tagid + ',' + optionid);
            });
            var listTagOptionIDToStr = listTagOptionID.join('_');
            this.options.v.refresh({
                listTagOptionID: listTagOptionIDToStr
            })

        }

    });
    module.exports = SelectFilterbar;
});