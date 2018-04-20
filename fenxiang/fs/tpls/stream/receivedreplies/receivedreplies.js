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
        fsReplyList=require('modules/fs-reply/fs-reply-list'),
        tplCommon = require('../stream-common');

    var ReplyList=fsReplyList.replyList;
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;

        var replyTabsEl=$('.reply-tabs',tplEl),
            replyTabs,
            filterEl=$('.filter',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
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
        /**
         * 发送回复后在回复列表里填一条新的回复
         * @param responseData
         */
        var prependNewReply=function(responseData){
            //prepend一条新回复
            if (responseData.success) {
                this.addNewReply(responseData.value);
            }
        };
        /**
         * 动态设置replyList配置
         */
        var dynaConfigReplyList=function(replyList){
            var replyType=$('.depw-menu-aon',filterEl).attr('replytype');
            //动态设置
            replyList.opts.listPath="/feed/getFeedReplysOfI"+ _.str.capitalize(replyType);
            //重新设置replyCb配置参数,收到的回复栏里发出回复后是不需要刷新的
            if(replyType=="send"){
                //replyList.opts.replyCb=prependNewReply;
                replyList.opts.replyCb=function(){
                    replyList.reload();
                };
            }else{
                replyList.opts.replyCb=FS.EMPTY_FN;
            }
        };
        var currentList=null;
        replyTabs=new Tabs({
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
            var replyList=curPanelEl.data('replyList');
            var feedType=curPanelEl.attr('feedtype');
            if(!replyList){
                replyList=new ReplyList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":45,
                        "visiblePageNums":7
                    },
                    "listPath":"/feed/getFeedReplysOfIReceive", //第一次加载获取我收到的回复
                    "defaultRequestData":function(){
                        return {     //默认请求数据
                            "feedType": feedType,
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
					"searchOpts":{
						"inputSelector":searchEl,
						"btnSelector":searchBtnEl
					},
                    "replyCb":prependNewReply
                });
                dynaConfigReplyList(replyList);     //动态配置replyList参数
                replyList.load();
                curPanelEl.data('replyList',replyList);
            }else{
                dynaConfigReplyList(replyList); //动态配置replyList参数
                replyList.reload();
            }

            currentList=replyList;
        });
        //默认加载第一个tab
        //replyTabs.trigger('switched',0,-1);
        //切换到当前模板后重新加载feedlist
        tplEvent.on('switched', function (tplName2) {
            var queryParams,
                type,
                filterFieldEl=$('.filter-field',filterEl);
            filterFieldEl.removeClass('depw-menu-aon');

            if(tplName2=="stream-receivedreplies"){
                queryParams=util.getTplQueryParams();   //传给模板的参数
                type=queryParams? queryParams.type:"receive"; //默认打开tab类型 receive/send/followed
                if(type=="receive"){
                    filterFieldEl.eq(0).addClass('depw-menu-aon');
                }else if(type=="send"){
                    filterFieldEl.eq(1).addClass('depw-menu-aon');
                }else{
                    filterFieldEl.eq(2).addClass('depw-menu-aon');
                }
                reloadFirstTab(replyTabs);
            }
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentList.reload();
            evt.preventDefault();
        });
        //filter筛选
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');

            dynaConfigReplyList(currentList);     //动态配置replyList参数
            //reload
            currentList.reload();
            evt.preventDefault();
        });
    };
});