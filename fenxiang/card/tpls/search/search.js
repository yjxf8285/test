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
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('./search-common');

    var updateSearchList=function(keyword,listEl){
        var searchHistory=util.getPersonalConfig('searchHistory')||[],
            htmlStr='';
        searchHistory= _.reject(searchHistory,function(itemData){
            return itemData==keyword;
        });
        searchHistory.unshift(keyword);
        searchHistory=searchHistory.slice(0,10);
        _.each(searchHistory,function(itemData){
            htmlStr+='<li><a href="#search/=/key-'+itemData+'"><i class="srl-icon"></i>'+itemData+'</a></li>';
        });
        listEl.html(htmlStr);
        util.setPersonalConfig('searchHistory',searchHistory);
        util.updatePersonalConfig();
    };
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var tplLeftEl=$('.tpl-l',tplEl),
            tplRightEl=$('.tpl-r',tplEl),
            listEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            searchEl=$('.search-inp-s',tplEl),  //搜索框
            searchListEl=$('.search-r-list',tplRightEl),
            feedList;
        //公共处理
        var tplLeftEvent=tplCommon.init(tplEl,tplName);
        //初始化feedlist
        feedList = new FeedList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 20,
                "visiblePageNums": 7
            },
            "loadSize": 15,   //单次加载15条记录
            "listPath":"/FeedSearch/GetFeedForSearch",
            "defaultRequestData": function () {
                return {
                    "feedType": 0,
                    "keyword": _.str.trim(searchEl.val()),
                    "feedAttachType":0
                };
            },
            "listEmptyText": "没有符合条件的搜索结果"  //列表记录为空的文字提示
        });
        tplRightEl.on('click','.clear-search-l',function(){
            searchListEl.empty();
            util.setPersonalConfig('searchHistory',[]);
            util.updatePersonalConfig();
        });
        tplLeftEvent.on('search',function(extendParams){
            var keyword=_.str.trim(searchEl.val());
            var requestData=_.extend({
                "feedType": 0,
                "keyword": keyword,
                "feedAttachType":0
            },extendParams);
            if(requestData.keyword.length>0){
                feedList.opts.defaultRequestData= requestData;
                feedList.reload();
            }
            updateSearchList(keyword,searchListEl);
        });

        /*tpl.event.on('switched', function (tplName2, tplEl) {
            if (tplName2 == tplName) {
                var queryParams=util.getTplQueryParams();   //传给模板的参数
                var key=queryParams? queryParams.key:""; //获取key
                searchEl.val(key).keyup();  //设置默认查询参数
                //高亮工作栏
                $('.tpl-nav-l',tplLeftEl).eq(0).addClass('depw-menu-aon');
                //首次触发查询全部发出的feed
                $('.all-employee',tplEl).click();
                //隐藏包含过滤
                $('.search-include-nav-list',tplLeftEl).hide();
            }else{
                feedList.loadKill();
            }
        });*/
        //不缓存搜索结果
        (function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var key=queryParams? queryParams.key:""; //获取key
            searchEl.val(decodeURIComponent(key)).keyup();  //设置默认查询参数
            //高亮工作栏
            $('.tpl-nav-l',tplLeftEl).eq(0).addClass('depw-menu-aon');
            //首次触发查询全部发出的feed
            $('.all-employee',tplEl).click();
            //隐藏包含过滤
            $('.search-include-nav-list',tplLeftEl).hide();
        }());
    };
    //保存和设置最近搜索记录
    tpl.event.on('switched', function (tplName2, tplEl) {
        var queryParams,
            key,
            searchListEl; //获取key
        if (tplName2 == "search" ) {
            queryParams=util.getTplQueryParams();   //传给模板的参数
            key=queryParams? queryParams.key:""; //获取key
            searchListEl=$('.tpl-r .search-r-list',tplEl);
            updateSearchList(key,searchListEl);
        }
    });
});