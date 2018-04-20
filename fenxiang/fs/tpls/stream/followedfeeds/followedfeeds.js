/**
 * 我的归档
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var Tabs=require('tabs'),
        util=require('util'),
        FeedList=require('modules/feed-list/feed-list');
    var tplCommon = require('../stream-common');

    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;

        var feedTabsEl = $('.feed-tabs', tplEl),
            searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        var feedListTabs;

        var killLoad = function (panelSelector) {
            var panelEl = $(panelSelector),
                feedList = panelEl.data('feedList');
            feedList && feedList.loadKill();
        };
        /**
         * 刷新第一个tab
         * @param tabs
         */
        var reloadFirstTab=function(tabs){
            //刷新第一个子tab
            if(tabs.get('activeIndex')==0){
                tabs.trigger('switched', 0, -1);
            }else{
                tabs.switchTo(0);
            }
        };
        //设置当前激活tab
        var currentFeedList = null;
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);

        feedListTabs = new Tabs({
            "element": feedTabsEl,
            "triggers": $('.feed-main-item', feedTabsEl),
            "panels": $('.feed-main-panel', feedTabsEl),
            "activeIndex": 0,
            "activeTriggerClass": "ui-tab-item-current",
            "triggerType": 'click'
        }).render();

        feedListTabs.on('switched',function (toIndex, fromIndex) {
            var curPanelEl = this.get('panels').eq(toIndex),
                listEl = $('.feed-list', curPanelEl),
                pagEl = $('.feed-list-pagination', curPanelEl),
                subFeedListEl,
                subTabs;
            var feedType = curPanelEl.attr('feedtype'),
                feedName = curPanelEl.attr('feedname'),
                feedList;
            if (feedType == "0" || feedType == "1") {   //全部和分享
                feedList = curPanelEl.data('feedList');
                if (!feedList) {
                    feedList = new FeedList({
                        "element": listEl, //list selector
                        "pagSelector": pagEl, //pagination selector
                        "pagOpts": { //分页配置项
                            "pageSize": 45,
                            "visiblePageNums": 7
                        },
                        "loadSize": 15,   //单次加载15条记录
                        "listPath":"/feed/getFeedFollows",
                        "withFollowTime":true,  //显示关注时间
                        "defaultRequestData": function () {
                            return {
                                "subType": 0, //子类型
                                "feedType": feedType,
                                "keyword": _.str.trim(searchEl.val())
                            };
                        },
                        "itemReadyCb":function(){
                            var itemEl=this.$el;    //this指向item view
                            $('.aj-attention',itemEl).addClass('aj-unattention myatt').removeClass('aj-attention').text("取消关注");

                        },
						"searchOpts":{
							"inputSelector":searchEl,
							"btnSelector":searchBtnEl
						}
                    });
                    feedList.load();
                    curPanelEl.data('feedList', feedList);
                } else {
                    feedList.reload();
                }
                currentFeedList = feedList;
            } else {  //日志、审批、任务
                subFeedListEl = $('.feed-sub-list', curPanelEl);
                //获取当前主tab面板内的子tabs
                subTabs=subFeedListEl.data('subTabs');
                if (!subFeedListEl.data('rendered')) {
                    subTabs = new Tabs({
                        "element": subFeedListEl,
                        "triggers": $('.feed-' + feedName + '-item', subFeedListEl),
                        "panels": $('.feed-' + feedName + '-panel', subFeedListEl),
                        "activeIndex": 0,
                        "activeTriggerClass": "ui-tab-item-current",
                        "triggerType": 'click',
                        "withTabEffect": false
                    }).render().on('switched',function (toIndex, fromIndex) {
                            var curPanelEl = this.get('panels').eq(toIndex),
                                listEl = $('.feed-list', curPanelEl),
                                pagEl = $('.feed-list-pagination', curPanelEl);
                            var subType = curPanelEl.attr('subtype'),
                                feedList = curPanelEl.data('feedList');
                            if (!feedList) {
                                feedList = new FeedList({
                                    "element": listEl, //list selector
                                    "pagSelector": pagEl, //pagination selector
                                    "pagOpts": { //分页配置项
                                        "pageSize": 45,
                                        "totalSize": 0,
                                        "visiblePageNums": 7
                                    },
                                    "loadSize": 15,   //单次加载15条记录
                                    "listPath":"/feed/getFeedFollows",
                                    "withFollowTime":true,  //显示关注时间
                                    "defaultRequestData": function () {
                                        return {
                                            "subType": subType, //子类型
                                            "feedType": feedType,
                                            "keyword": _.str.trim(searchEl.val())
                                        };
                                    },
									"searchOpts":{
										"inputSelector":searchEl,
										"btnSelector":searchBtnEl
									}
                                });
                                feedList.load();
                                curPanelEl.data('feedList', feedList);
                            } else {
                                feedList.reload();
                            }
                            currentFeedList = feedList;
                        }).on('switch', function (toIndex, fromIndex) {
                            //切换前kill掉当前tab中的feedList加载
                            killLoad(this.get('panels').eq(fromIndex));
                        });
                    //默认加载第一个tab
                    subTabs.trigger('switched', 0, -1);
                    subFeedListEl.data('rendered', true);
                    //保存引用
                    subFeedListEl.data('subTabs', subTabs);
                }else{
                    //刷新第一个子tab
                    reloadFirstTab(subTabs);
                }
            }
        }).on('switch', function (toIndex, fromIndex) {
                killLoad(this.get('panels').eq(fromIndex));
            });
        //默认加载全部feed列表
        //feedListTabs.trigger('switched', 0, -1);
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentFeedList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
        tpl.event.on('switched', function (tplName, tplEl) {
            if (tplName == "stream-followedfeeds") {
                //feedListTabs.trigger('switched',0,-1);
                //feedListTabs.switchTo(0);
                reloadFirstTab(feedListTabs);
            }else{
                currentFeedList&&currentFeedList.loadKill();
            }
        });
    };
});