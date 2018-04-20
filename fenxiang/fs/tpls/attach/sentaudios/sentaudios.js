/**
 * Attach-FilesInCircle模板
 * 
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        Tabs=require('tabs'),
        AttachList=require('modules/fs-attach/fs-attach-list'),
        tplCommon=require('../attach-common');

    exports.init = function () {
        var tplEl=exports.tplEl,
            tplName=exports.tplName,
            attachTabsEl=$('.attach-tabs',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        //公共处理
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
        var currentList=null;
        var attachTabs=new Tabs({
            "element":attachTabsEl,
            "triggers": $('.ui-tab-item',attachTabsEl),
            "panels": $('.ui-tab-panel',attachTabsEl),
            "activeIndex": 0,
            "activeTriggerClass":"ui-tab-item-current",
            "triggerType":'click'
        }).render();
        attachTabs.on('switched',function(toIndex,fromIndex){
            var curPanelEl=this.get('panels').eq(toIndex),
                listEl=$('.attach-list',curPanelEl),
                pagEl=$('.attach-list-pagination',curPanelEl);
            var attachList=curPanelEl.data('attachList'),
                feedType=curPanelEl.attr('feedtype');
            if(!attachList){
                attachList=new AttachList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":15,
                        "visiblePageNums":7
                    },
                    "attachType":"audio", //请求文件类型的附件
                    "listPath":"/attach/getAttachFilesOfISend", //我发出的附件
                    "loadSize":15,   //单次加载15条记录
                    "defaultRequestData":function(){
                        return {
                            "attachType":1, //3表示为录音
                            "feedType":feedType,
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
					"searchOpts":{
						"inputSelector":searchEl,
						"btnSelector":searchBtnEl
					} //默认请求数据
                });
                attachList.load();
                curPanelEl.data('attachList',attachList);
            }else{
                attachList.reload();
            }
            currentList=attachList;
        });
        //默认加载第一个tab
        //attachTabs.trigger('switched',0,-1);
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
        /*tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //attachTabs.switchTo(0);
                reloadFirstTab(attachTabs);
            }
        });*/
        var destroy=function(){
            var panels=attachTabs.get('panels');
            panels.each(function(){
                var panelEl=$(this);
                var attachList=panelEl.data('attachList');
                attachList&&attachList.destroy();
                panelEl.removeData();
            });
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
        reloadFirstTab(attachTabs);
    };
});