/**
 * Created by liuxf on 11-24-0024.
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event,
        store = tpl.store,
        list = tpl.list;
    var util = require('util');
    var leftNav = require('modules/partner-leftnav/partner-leftnav');
    var Pagination = require('uilibs/pagination2'); //分页组件

    /**
     * 代理商管理
     * @param opts
     * @constructor
     */
    var PartnerManage = function (opts) {
        opts = $.extend({
            element: null, //容器是JQ对象
            data: {
                status: 0,
                keyword: '',//string，搜索关键字
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，页数
            }
        }, opts || {});
        this.options = opts;
        this.$el = opts.element;
        this.init(); //初始化
    };
    $.extend(PartnerManage.prototype, {
        init: function () {
            var elEl = this.$el;
            this.setupComponent();
            this.bindEvents();
        },
        bindEvents: function () {
            this.pagination.setTotalSize(25);//设置分页总数
            /*  GetAllDepartments
             SearchDepartments
             GetPlayersByDepartmentId*/
        },
        setupComponent: function () {
            var that = this;
            //分页
            this.pagination = new Pagination({
                "element": this.options.pagEl,
                "pageSize": this.options.data.pageSize,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });
            this.pagination.render();

            this.pagination.on('page', function (pageNumber) {
                that.refresh({
                    pageNumber: pageNumber// int，页码
                });
            });
        },
        load: function () {
            var that = this;
            util.api({
                "url": '/CrossPartner/GetAllDepartments',
                "type": 'get',
                "dataType": 'json',
                "data": {},
                beforeSend: function () {
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        console.info(responseData);
                    }
                }
            });
        }
    });
    exports.init = function () {
        var tplEl = exports.tplEl;
        leftNav.init($('.tpl-l', tplEl)); //初始化左侧导航

        var partnerManage = new PartnerManage({
            element: tplEl, //父级容器
            pagEl: $('.partnermanage-member-list-paginationwarp', tplEl)
        });
        partnerManage.load();

    }; //init end
});