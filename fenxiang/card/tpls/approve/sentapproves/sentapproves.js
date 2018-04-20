/**
 * Approve
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
        Tabs=require('tabs'),
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('../approve-common');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var feedTabsEl=$('.feed-tabs',tplEl),
            feedTabs;
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        //公共处理
        tplCommon.init(tplEl,tplName);

        var killLoad=function(panelSelector){
            var panelEl=$(panelSelector),
                feedList=panelEl.data('feedList');
            feedList&&feedList.loadKill();
        };
        var currentList=null;
        /**
         * 刷新第一个tab
         * @param tabs
         */
        var reloadFirstTab=function(tabs){
            var queryParams = util.getTplQueryParams(); //传给模板的参数
            var approveStatus = queryParams ? queryParams.approvestatus : 0; //获取approve status
            approveStatus=parseInt(approveStatus);
            //刷新第一个子tab
            if(tabs.get('activeIndex')==approveStatus){
                tabs.trigger('switched', approveStatus, -1);
            }else{
                tabs.switchTo(approveStatus);
            }
            //$('.tpl-l a[href="#approve/sentapproves"]',tplEl).addClass('depw-menu-aon');
        };
        feedTabs=new Tabs({
            "element":feedTabsEl,
            "triggers": $('.ui-tab-item',feedTabsEl),
            "panels": $('.ui-tab-panel',feedTabsEl),
            "activeIndex": 0,
            "activeTriggerClass":"ui-tab-item-current",
            "triggerType":'click'
        }).render();
        feedTabs.on('switched',function(toIndex,fromIndex){
            var curPanelEl=this.get('panels').eq(toIndex),
                listEl=$('.feed-list',curPanelEl),
                pagEl=$('.feed-list-pagination',curPanelEl);
            var feedList=curPanelEl.data('feedList'),
                approveStatus=curPanelEl.attr('approvestatus');
            if(!feedList){
                feedList=new FeedList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":10,
                        "visiblePageNums":7
                    },
                    "listPath":"/FeedApprove/GetFeedApproveOfISend",
                    "defaultRequestData":function(){
                        return {
                            "feedApproveStatus":approveStatus,
                            "keyword":_.str.trim(searchEl.val())
                        };
                    },
                    "listEmptyText":"没有您发出的需要他人审批的事项",
					"searchOpts":{
						"inputSelector":searchEl,
						"btnSelector":searchBtnEl
					} //默认请求数据
                });
                feedList.load();
                curPanelEl.data('feedList',feedList);
            }else{
                feedList.reload();
            }
            currentList=feedList;
        }).on('switch',function(toIndex,fromIndex){
                //切换前kill掉当前tab中的feedList加载
                killLoad(this.get('panels').eq(fromIndex));
            });
        //默认加载第一个tab
        //feedTabs.trigger('switched',0,-1);
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
		/*var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //feedTabs.switchTo(0);
                reloadFirstTab(feedTabs);
				//刷新右侧列表
				if(!firstRender){
					tplCommon.createRightSb();	
				}else{
					firstRender=false;

				}
            }else{
                currentList&&currentList.loadKill();
                currentList&&currentList.empty();
            }
        });*/
        var destroy=function(){
            var panels=feedTabs.get('panels');
            panels.each(function(){
                var panelEl=$(this);
                var feedList=panelEl.data('feedList');
                feedList&&feedList.destroy();
                panelEl.removeData();
            });
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
        reloadFirstTab(feedTabs);
        //tplCommon.createRightSb();
    };
});