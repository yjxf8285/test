/**
 * CRM - 产品 - tpl
 *
 * @author liuxiaofan
 * 2014-03-28
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Header = require('modules/crm-list-header/crm-list-header');
    var ProductList = require('modules/crm-product-list/crm-product-list');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var productListWarpEl = $('.products-product-warp', tplEl);
        var productList = new ProductList({
            data:{
                keyword: '',//搜索关键字
                listTagOptionID: '',//List<string>，标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)
                sortType: 0,//排序方式：最后编辑时间倒序=0；最后编辑时间正序=1；名称正序=2；名称倒序=3
                pageSize: 10,//分页大小
                //                "totalSize": 38,//一共多少条
                pageNumber: 1//当前页
            },
            warpEl: productListWarpEl,
            url: "/Product/GetProductList"
        });

        productList.load();

        var header = new Header({
            "element":$(".crm-list-hd",tplEl),
            "title":"产品列表",
            "searchPlaceholder":"搜索产品"
        });
        header.on("search",function(keyword){
            productList.refresh({
                "keyword":keyword
            });
        });
    };

});