/**
 * Created by 刘晓帆 on 2016-4-11.
 * 通用表格模块
 */
'use strict';
var tpl = require("./table-list-tpl.html");//模板

var TableList = Backbone.View.extend({
    model: new Backbone.Model({
        listData: []
    }),
    template: _.template($(tpl).filter('#tpl-layout').html()),
    events: {
        "click .seemore-btn": "seemore",
    },

    initialize: function (options) {
        var that = this;
        this.options = _.extend({}, options);
        this.model.on('change', function (m) {
            that.render();
        });
    },
    afterRender: function () {
        $('.dropdown-button',this.$el).dropdown();
    },

    render: function () {
        console.info(this.model.toJSON())
        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender();
        return this;
    }
});
//
module.exports = TableList;