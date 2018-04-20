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
            pagEl=$('.feed-list-pagination',tplEl);
        var feedList;
        tplCommon.init(tplEl,tplName);

        //feedlist列表
        feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":10,
                "visiblePageNums":7
            },
            "listPath":"/feed/getFeedFollows",     //从我的关注里只筛选日志类型
            "defaultRequestData":function(){
                return {
                    "keyword":"",
                    "feedType":2
                };
            }
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