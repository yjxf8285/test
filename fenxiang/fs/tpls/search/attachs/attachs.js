/**
 * Search模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        AttachList=require('modules/fs-attach/fs-attach-list'),
        tplCommon = require('../search-common');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;

        var tplLeftEl=$('.tpl-l',tplEl),
            listEl=$('.attach-list',tplEl),
            pagEl=$('.attach-list-pagination',tplEl),
            searchEl=$('.search-inp-s',tplEl),  //搜索框
            feedList;
        //公共处理
        var tplLeftEvent=tplCommon.init(tplEl,tplName);

        var attachList=new AttachList({
            "element":listEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "attachType":"attach", //请求文件类型的附件
            "listPath":"/FeedSearch/getAttachFeedForSearch", //搜索附件地址
            "defaultRequestData":{}, //默认请求数据
            "listEmptyText": "没有符合条件的搜索结果"  //列表记录为空的文字提示
        });

        tplLeftEvent.on('search',function(extendParams){
            var requestData=_.extend({
                "feedType": 0,
                "keyword": _.str.trim(searchEl.val()),
                "feedAttachType":0
            },extendParams);
            if(requestData.keyword.length>0){
                attachList.opts.defaultRequestData= requestData;
                attachList.reload();
            }
        });


        /*tpl.event.on('switched', function (tplName2, tplEl) {
            if (tplName2 == tplName) {
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var key=queryParams? queryParams.key:""; //获取key
                searchEl.val(key).keyup();  //设置默认查询参数
                //高亮附件栏
                $('.tpl-nav-l',tplLeftEl).eq(2).addClass('depw-menu-aon');
                //首次触发查询全部发出的feed
                $('.all-employee',tplEl).click();
                //隐藏包含过滤
                $('.search-include-nav-list',$('.tpl-l',tplEl)).hide();
            }
        });*/
        //不缓存搜索结果
        (function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var key=queryParams? queryParams.key:""; //获取key
            searchEl.val(key).keyup();  //设置默认查询参数
            //高亮附件栏
            $('.tpl-nav-l',tplLeftEl).eq(2).addClass('depw-menu-aon');
            //首次触发查询全部发出的feed
            $('.all-employee',tplEl).click();
            //隐藏包含过滤
            $('.search-include-nav-list',$('.tpl-l',tplEl)).hide();
        }());
    };
});