/**
 * 纷享页面逻辑
 * @Author: 纷享网页前端部
 * @Date: 2014-11-03
 */
define("tpls/products/product/product",["util","modules/crm-list-header/crm-list-header","modules/crm-product-list/crm-product-list"],function(a,b){var c=window,d=c.FS,e=d.tpl;e.event,a("util");var f=a("modules/crm-list-header/crm-list-header"),g=a("modules/crm-product-list/crm-product-list");b.init=function(){var a=b.tplEl;b.tplName;var c=$(".products-product-warp",a),d=new g({data:{keyword:"",listTagOptionID:"",sortType:0,pageSize:10,pageNumber:1},warpEl:c,url:"/Product/GetProductList"});d.load();var e=new f({element:$(".crm-list-hd",a),title:"产品列表",searchPlaceholder:"搜索产品"});e.on("search",function(a){d.refresh({keyword:a})})}});