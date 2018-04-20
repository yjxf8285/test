/**
 * plan
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('../plan-common');

    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;

        var feedListEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            filterEl=$('.filter',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        var feedList;
        tplCommon.init(tplEl,tplName);

        //feedlist列表
        feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "listPath":"/feed/getFeedsOfAtMe",     //从我的关注里只筛选日志类型
            "defaultRequestData":function(){
                var subType=$('.filter-field',filterEl).filter('.depw-tabs-aon').attr('val');
                return {
                    "keyword":_.str.trim(searchEl.val()),
                    "subType":subType,
                    "feedType":2    //限制为日志类型
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });
        //filter筛选
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            $('.filter-field',filterEl).removeClass('depw-tabs-aon');
            meEl.addClass('depw-tabs-aon');
            //reload
            feedList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
		/*var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                feedList.reload();
                //刷新右侧列表
				if(!firstRender){
					tplCommon.createRightSb();	
				}else{
					firstRender=false;	
				}
                
            }else{
                feedList&&feedList.loadKill();
            }
        });*/
        var destroy=function(){
            feedList.destroy();
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
        feedList.reload();
        //tplCommon.createRightSb();
    };
});