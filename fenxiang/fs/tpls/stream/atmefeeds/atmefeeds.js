/**
 * 提到我的
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var tplCommon=require('../stream-common'),
        fsReplyList=require('modules/fs-reply/fs-reply-list'),
        FeedList=require('modules/feed-list/feed-list'),
        Tabs=require('tabs'),
        util=require('util');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
        //feed tabs
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
            tabs.adjustTriggerBg();
        };
        //设置当前激活tab
        var currentList = null;

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
                            "pageSize": 20,
                            "visiblePageNums": 7
                        },
                        "withLazyload":false,    //关闭懒加载
                        "listPath":"/feed/getFeedsOfAtMe",
                        "defaultRequestData": function () {
                            return {
                                "subType": 0, //子类型
                                "feedType": feedType,
                                "keyword": _.str.trim(searchEl.val())
                            };
                        },
						"searchOpts":{
							"inputSelector":searchEl,
							"btnSelector":searchBtnEl
						},
                        "listEmptyText":"没有找到提到我的工作"
                    });
                    feedList.load();
                    curPanelEl.data('feedList', feedList);
                } else {
                    feedList.reload();
                }
                currentList = feedList;
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
                                        "pageSize": 20,
                                        "visiblePageNums": 7
                                    },
                                    "withLazyload":false,    //关闭懒加载
                                    "listPath":"/feed/getFeedsOfAtMe",
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
									},
                                    "listEmptyText":"没有找到提到我的工作"
                                });
                                feedList.load();
                                curPanelEl.data('feedList', feedList);
                            } else {
                                feedList.reload();
                            }
                            currentList = feedList;
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


        //reply tabs
        var ReplyList=fsReplyList.replyList;
        var replyTabsEl=$('.reply-tabs',tplEl);
        var replyTabs=new Tabs({
            "element":replyTabsEl,
            "triggers": $('.ui-tab-item',replyTabsEl),
            "panels": $('.ui-tab-panel',replyTabsEl),
            "activeIndex": 0,
            "activeTriggerClass":"ui-tab-item-current",
            "triggerType":'click'
        }).render();
        replyTabs.on('switched',function(toIndex,fromIndex){
            var curPanelEl=this.get('panels').eq(toIndex),
                listEl=$('.reply-list',curPanelEl),
                pagEl=$('.reply-list-pagination',curPanelEl);
            var feedType = curPanelEl.attr('feedtype');
            var replyList=curPanelEl.data('replyList');
            if(!replyList){
                replyList=new ReplyList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":45,
                        "totalSize":0,
                        "visiblePageNums":7
                    },
                    "listPath":'/feed/getFeedReplysOfAtMe',
                    "defaultRequestData": function () {
                        return {
                            "feedType": feedType,
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
                    "replyCb":function(){},
                    "listEmptyText":"没有找到提到我的回复",
                    "searchOpts":{
                        "inputSelector":searchEl,
                        "btnSelector":searchBtnEl
                    }
                });
                replyList.load();
                curPanelEl.data('feedList',replyList);
            }else{
                replyList.reload();
            }
            currentList= replyList;
        });

        //切换到当前模板后重新加载feedlist
        tpl.event.on('switched', function (tplName, tplEl) {
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var type=queryParams? queryParams.type:"feed"; //默认打开tab类型 feed/reply

            if (tplName == "stream-atmefeeds") {
                feedTabsEl.show();
                replyTabsEl.hide();
                //重置搜索输入框
                currentList&&currentList.resetSearch();
                //reloadFirstTab(feedListTabs);
                //filter field定位到“提到我的工作”
                if(type=="feed"){
                    $('.filter-field',filterEl).eq(0).click();
                }else{
                    $('.filter-field',filterEl).eq(1).click();
                }
            }else{
                currentList&&currentList.loadKill&&currentList.loadKill();
            }
        });
        //点击feed和reply切换
        var filterEl=$('.filter',tplEl);
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            var type=meEl.attr('val');
			var depwText=$('.depw-text',tplEl);
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
			depwText.hide();
            currentList&&currentList.resetSearch();
            if(type=="feed"){
                feedTabsEl.show();
                replyTabsEl.hide();
				depwText.eq(0).show();
                //feedListTabs.switchTo(0);
                reloadFirstTab(feedListTabs);
            }else{
                feedTabsEl.hide();
                replyTabsEl.show();
				depwText.eq(1).show();
                //replyTabsEl.switchTo(0);
                reloadFirstTab(replyTabs);
            }
            evt.preventDefault();
        });
        //点击关键字查询按钮触发当前feedlist的reload行为
        searchBtnEl.click(function (evt) {
            currentList.reload();
            evt.preventDefault();
        });
    };
});