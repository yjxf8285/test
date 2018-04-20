/**
 * 我的投票
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('../stream-common');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var feedListEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            filterEl=$('.filter',tplEl);    //筛选容器
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
        var feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":20,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "listPath":"/feedextend/getFeedsOfVote",
            "defaultRequestData":function(){
                var voteType=$('.depw-menu-aon',filterEl).attr('val');
                return {
                    "voteType":voteType,
                    "feedType":1,    //投票的feedType是分享
                    "keyword":_.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
        });
        filterEl.on('click','.filter-field',function(evt){
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            $(this).addClass('depw-menu-aon');
            //reload列表
            feedList.reload();
            evt.preventDefault();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });
        //feedList.load();
        //切换到当前模板后重新加载feedlist
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //重定位到我参与的投票
                $('.filter-field',filterEl).removeClass('depw-menu-aon').eq(0).addClass('depw-menu-aon');
                feedList.reload();
            }else{
                feedList&&feedList.loadKill();
            }
        });
    };
});