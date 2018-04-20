/**
 * Search企信模板
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
        SessionList = require('modules/fs-qx/fs-showsession-list'),
        tplCommon = require('../search-common');
    var updateSearchList=function(keyword,listEl){
        var searchHistory=util.getPersonalConfig('searchHistory')||[],
            htmlStr='';
        searchHistory= _.reject(searchHistory,function(itemData){
            return itemData==keyword;
        });
        searchHistory.unshift(keyword);
        searchHistory=searchHistory.slice(0,10);
        _.each(searchHistory,function(itemData){
            htmlStr+='<li><a href="#search/shortmessage/=/key-'+itemData+'"><i class="srl-icon"></i>'+itemData+'</a></li>';
        });
        listEl.html(htmlStr);
        util.setPersonalConfig('searchHistory',searchHistory);
        util.updatePersonalConfig();
    };
    //注册显示企信对话路由
    util.tplRouterReg('#shortmessage/showsession/=/:id-:value');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;

        var tplLeftEl=$('.tpl-l',tplEl),
            listEl=$('.session-list',tplEl),
            pagEl=$('.session-list-pagination',tplEl),
            searchEl=$('.search-inp-s',tplEl);  //搜索框
        //公共处理
        var tplLeftEvent=tplCommon.init(tplEl,tplName);

        var sessionList = new SessionList({
            "element": listEl, //list selector
            "pagSelector": pagEl, //pagination selector
            "listPath": "/FeedSearch/GetShortMessagesForSearch", //企信搜索接口
            "searchOpts": {},
            "itemRenderCb":function(itemV,m){
                var itemEl=itemV.$el,
                    itemContentEl=$('.fs-showsession-item-my-dialog',itemEl);
                var sessionData= m.get('session');
                var title;
                if(sessionData.value3){ //是群对话
                    title='+展开该群对话的对话';
                }else{
                    title='+展开我与'+sessionData.value1+'的对话';
                }
                $('<a style="display:block;padding-top:10px;text-align: right;" class="to-session-l" href="#shortmessage/showsession/=/id-'+sessionData.value+'" title="'+title+'">'+title+'</a>').appendTo(itemContentEl);
            },
            "listEmptyText": "没有符合条件的搜索结果"  //列表记录为空的文字提示
        });

        tplEl.on('click','.clear-search-l',function(){
            var searchListEl=$('.tpl-r .search-r-list',tplEl);
            if(searchListEl){
                searchListEl.empty();
                util.setPersonalConfig('searchHistory',[]);
                util.updatePersonalConfig();
            }
        });

        tplLeftEvent.on('search',function(extendParams){
            var keyword = _.str.trim(searchEl.val());
            var searchListEl=$('.tpl-r .search-r-list',tplEl);
            var requestData=_.extend({
                "feedType": 0,
                "keyword": keyword,
                "feedAttachType":0
            },extendParams);
            if(requestData.keyword.length>0){
                sessionList.opts.defaultRequestData= requestData;
                sessionList.reload();
            }
            if(searchListEl){
                updateSearchList(keyword,searchListEl);
            }

        });


        tpl.event.on('switched', function (tplName2, tplEl) {
            var queryParams,
                key,
                searchListEl; //获取key
            if (tplName2 == "search-shortmessage") {
                queryParams=util.getTplQueryParams();   //传给模板的参数
                key=queryParams? queryParams.key:""; //获取key
                searchListEl=$('.tpl-r .search-r-list',tplEl);
                updateSearchList(key,searchListEl);
            }
        });
        //缓存搜索结果
        (function(){
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var key=queryParams? queryParams.key:""; //获取key
            searchEl.val(decodeURIComponent(key)).keyup();  //设置默认查询参数
            //高亮附件栏
            $('.tpl-nav-l',tplLeftEl).eq(5).addClass('depw-menu-aon');
            //首次触发查询全部发出的feed
            $('.all-employee',tplEl).click();
            //显示包含过滤
            $('.search-include-nav-list',$('.tpl-l',tplEl)).show();
        }());
    };
});