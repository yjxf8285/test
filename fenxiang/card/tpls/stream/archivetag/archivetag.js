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
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('../stream-common');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName,
            tabsEl=$('.feed-tabs',tplEl),
            tabs;
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl),
            tagFilterEl=$('.tag-filter-result',tplEl);

        var archiveRlistWrapEl=$('.right-archive-list-wrap',tplEl); //右边栏tag list
        var tagItemTpl=$('.tag-item-tpl',tplEl),
            tagItemCompiled=_.template(tagItemTpl.html());
        
        var killLoad=function(panelSelector){
            var panelEl=$(panelSelector),
                feedList=panelEl.data('feedList');
            feedList&&feedList.loadKill();
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
        var currentList=null;

        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
        //中部tab列表
        tabs=new Tabs({
            "element":tabsEl,
            "triggers": $('.ui-tab-item',tabsEl),
            "panels": $('.ui-tab-panel',tabsEl),
            "activeIndex": 0,
            "activeTriggerClass":"ui-tab-item-current",
            "triggerType":'click'
        }).render();
        tabs.on('switched',function(toIndex,fromIndex){
            var curPanelEl=this.get('panels').eq(toIndex),
                listEl=$('.feed-list',curPanelEl),
                pagEl=$('.feed-list-pagination',curPanelEl);
            var feedList=curPanelEl.data('feedList'),
                feedType=curPanelEl.attr('feedtype');
            if(!feedList){
                feedList=new FeedList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":45,
                        "visiblePageNums":7
                    },
                    "withArchive":true, //显示归档信息
                    "loadSize":15,   //单次加载15条记录
                    "listPath":"/feedarchive/GetFeedsByArchiveTagID",
                    "defaultRequestData":function(){
                        var currentTagId=$('.state-active',archiveRlistWrapEl).attr('tagid');
                        return {
                            "feedArchiveTagID": currentTagId||0, //tag标签，默认为0表示获取全部tag的归档信息
                            "feedType": feedType, //feed类型
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
                    "beforeListParse": function (responseData) {   //默认原样返回
                        return responseData;
                    },
					"searchOpts":{
						"inputSelector":searchEl,
						"btnSelector":searchBtnEl
					},
                    "listEmptyText": "还没有本类归档内容"  //列表记录为空的文字提示
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
        //tabs.trigger('switched',0,-1);
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist

        /*tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //tabs.switchTo(0);
                reloadFirstTab(tabs);
                //获取归档标签
                util.api({
                    "type":"get",
                    "data":{},
                    //"url":"/content/fs/data/archive-right-nav.json",
                    "url":"/feedarchive/getMyFeedArchiveTags",
                    "success":function(responseData){

                        var archiveRlistHtml="";
                        if(responseData.success){
                            //render 右侧栏 归档
                            var Avalue=responseData.value;
                            _.each(Avalue,function(data){
                                var tagName=data.tagName,
                                    count=data.count,
                                    feedArchiveTagID=data.feedArchiveTagID;
                                archiveRlistHtml+=tagItemCompiled({
                                    "tagName":tagName,
                                    "tagId":feedArchiveTagID,
                                    "count":count
                                });
                            });
                            archiveRlistWrapEl.html(archiveRlistHtml);
                        }
                    }
                });
            }else{
                currentList&&currentList.loadKill();
            }
        });*/
        var destroy=function(){
            var panels=tabs.get('panels');
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
        //改为不缓存方式
        reloadFirstTab(tabs);
        //获取归档标签
        util.api({
            "type":"get",
            "data":{},
            //"url":"/content/fs/data/archive-right-nav.json",
            "url":"/feedarchive/getMyFeedArchiveTags",
            "success":function(responseData){
                var archiveRlistHtml="";
                if(responseData.success){
                    //render 右侧栏 归档
                    var Avalue=responseData.value;
                    _.each(Avalue,function(data){
                        var tagName=data.tagName,
                            count=data.count,
                            feedArchiveTagID=data.feedArchiveTagID;
                        archiveRlistHtml+=tagItemCompiled({
                            "tagName":tagName,
                            "tagId":feedArchiveTagID,
                            "count":count
                        });
                    });
                    archiveRlistWrapEl.html(archiveRlistHtml);
                }
            }
        });

		//右边栏

        /**
         * 状态切换器
         * @param state
         * @param itemSelector
         */
        var switchState=function(state,itemSelector){
            var itemEl=$(itemSelector),
                tagEditPanelEl=$('.tag-edit-panel',itemEl),
                tagShowPanelEl=$('.tag-show-panel',itemEl);
            state=state||"show";
            switch(state){
                case "show":
                    tagEditPanelEl.hide();
                    tagShowPanelEl.show();
                    break;
                case "edit":
                    tagEditPanelEl.show();
                    tagShowPanelEl.hide();
                    $('.right-archive-text',tagEditPanelEl).val($('.tag-name',tagShowPanelEl).text());
                    break;
                default:
                    break;
            }
        };

		//事件监听，鼠标移到item上显示功能菜单，编辑，保存
		archiveRlistWrapEl.on('mouseenter','.right-archive-item',function(e){
			var meEl=$(this),
				controlEl=$('.right-archive-control',meEl);
			controlEl.show();		
		}).on('mouseleave','.right-archive-item',function(e){
			var meEl=$(this),
				controlEl=$('.right-archive-control',meEl);
			controlEl.hide();		
		}).on('click','.right-ac-edit',function(evt){
			var meEl=$(this),
				itemEl=meEl.closest('.right-archive-item');

            var tagEditPanelEl=$('.tag-edit-panel',itemEl),
                tagShowPanelEl=$('.tag-show-panel',itemEl);
            //切换到edit状态
            switchState("edit",itemEl);
            //将初始text放入input中
            $('.right-archive-text',tagEditPanelEl).val($('.tag-name',tagShowPanelEl).text());
			evt.preventDefault();		
		}).on('click','.rarchive-btn-save',function(){  //保存修改的tagName
			var meEl=$(this),
				itemEl=meEl.closest('.right-archive-item'),
                tagId=itemEl.attr('tagid');
            var tagEditPanelEl=$('.tag-edit-panel',itemEl),
                tagShowPanelEl=$('.tag-show-panel',itemEl),
                tagNameShowEl=$('.tag-name',tagShowPanelEl),
                tagName= _.str.trim($('.right-archive-text',tagEditPanelEl).val());
            util.api({
                "url":"/feedarchive/modifyFeedArchiveTagName",
                "data":{
                    "tagName":tagName,
                    "feedArchiveTagID":tagId
                },
                "dataType":"json",
                "success":function(responseData){
                    if(responseData.success){
                        tagNameShowEl.text(tagName);
                        //切换到show状态
                        switchState("show",itemEl);
                        //刷新第一个tab
                        reloadFirstTab(tabs);
                    }
                }
            });

		}).on('click','.right-ac-del',function(){  //删除tag item
            var meEl=$(this),
                itemEl=meEl.closest('.right-archive-item'),
                tagId=itemEl.attr('tagid');
				
			util.confirm('如果归档没有标签标识，归档也将被一起删除','你确定要删除这个标签吗？',function(){
                util.api({
                    "url":"/feedarchive/deleteFeedArchiveTag",
                    "data":{
                        "feedArchiveTagID":tagId
                    },
                    "type":"post",
                    "success":function(responseData){
                    if(responseData.success){
                            //简单从文档流中删除
                             itemEl.remove();
                            //刷新feedlist
                            currentList.reload();
                        }
                    }
                });
            },{
                "onCancel":function(){
                    return false;
                },
                "messageType":"question",
                "width":380
            });
			
            

        }).on('click','.rarchive-btn-cancel',function(){
			var meEl=$(this),
				itemEl=meEl.closest('.right-archive-item');
            //切换到show状态
            switchState("show",itemEl);
		}).on('click','.tag-name',function(evt){
            var meEl=$(this),
                itemEl=meEl.closest('.right-archive-item');
            //高亮对应的tag item
            var addItemEl=$('.right-archive-item',archiveRlistWrapEl);
            addItemEl.removeClass('state-active');
            itemEl.addClass('state-active');
            //设置tag筛选信息
            $('.tag-name',tagFilterEl).text(meEl.text());
            tagFilterEl.show();

            //刷新第一个子tab
            reloadFirstTab(tabs);
            evt.preventDefault();
        });
        //点击列表里的归档标签跳转到对应的标签列表页
        tabsEl.on('click','.archive-remind .ar-tip',function(evt){
            var tagName= _.str.trim($(this).text());
            $('.tag-name',archiveRlistWrapEl).each(function(){
                var itemEl=$(this);
                if(_.str.trim(itemEl.text())==tagName){
                    itemEl.click();
                    return false; //终止跳转退出
                }
            });
        });
        //返回到全部归档
        tagFilterEl.on('click','.to-back-all-l',function(evt){
            //清空所有的高亮tag
            $('.right-archive-item',archiveRlistWrapEl).removeClass('state-active');
            $('.tag-name',tagFilterEl).text("");
            tagFilterEl.hide();
            //刷新第一个子tab
            reloadFirstTab(tabs);
            evt.preventDefault();
        });
    };
});