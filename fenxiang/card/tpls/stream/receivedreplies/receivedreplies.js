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
        try{
        	var t = window.store.get('receivedreplies');
        	t = t || '';
    		t = t + '刷新回复页:' + (+new Date()) + '-';
    		if(t.length > 500) {
    			t = t.substring(t.length-500);
    		}
    		window.store.set('receivedreplies', t);
        } catch(e){}
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
        var reloadFirstTab=function(){
        	try{
            	var t = window.store.get('receivedreplies');
            	t = t || '';
        		t = t + 'loadfirsttab-' + (+new Date()) + '-';
        		if(t.length > 500) {
        			t = t.substring(t.length-500);
        		}
        		window.store.set('receivedreplies', t);
            } catch(e){}
            $($('.ui-tab-item', tplEl)[0]).removeClass('ui-tab-item-current').click();
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
        replyTabsEl.on('click', '.ui-tab-item', function(){
            var $this = $(this),
            	curPanelEl= $('.ui-tab-panel',replyTabsEl),
                listEl=$('.fs-receivedreplies-list',curPanelEl);
            if($this.hasClass('ui-tab-item-current')) return;
            $('.ui-tab-item', tplEl).removeClass('ui-tab-item-current');
            $this.addClass('ui-tab-item-current');
            var replyList=$this.data('replyList');
            var feedType=$this.attr('feedtype');
            var pagEl=$('.pagination-' + feedType,curPanelEl);
            $('.reply-list-pagination',curPanelEl).hide();
            pagEl.show();
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
                try{
                	var t = window.store.get('receivedreplies');
                	t = t || '';
            		t = t + 'loadfeedtype-' + feedType + '-' + (+new Date()) + '-';
            		if(t.length > 500) {
            			t = t.substring(t.length-500);
            		}
            		window.store.set('receivedreplies', t);
                } catch(e){}
                replyList.load();
                $this.data('replyList',replyList);
            }else{
                dynaConfigReplyList(replyList); //动态配置replyList参数
                try{
                	var t = window.store.get('receivedreplies');
                	t = t || '';
            		t = t + 'reload-feedtype-' + feedtype + '-' + (+new Date()) + '-';
            		if(t.length > 500) {
            			t = t.substring(t.length-500);
            		}
            		window.store.set('receivedreplies', t);
                } catch(e){}
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
            	try{
                	var t = window.store.get('receivedreplies');
                	t = t || '';
            		t = t + '切换到回复:' + (+new Date()) + '-';
            		if(t.length > 500) {
            			t = t.substring(t.length-500);
            		}
            		window.store.set('receivedreplies', t);
                } catch(e){}
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