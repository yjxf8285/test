/**
 * Attach模板
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
        ImgList=require('modules/fs-attach/fs-attach-list'),
        tplCommon=require('./attach-common');

    exports.init = function () {
        var tplEl=exports.tplEl,
            tplName=exports.tplName,
            imgTabsEl=$('.img-tabs',tplEl);
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
        var imgTabs=new Tabs({
            "element":imgTabsEl,
            "triggers": $('.ui-tab-item',imgTabsEl),
            "panels": $('.ui-tab-panel',imgTabsEl),
            "activeIndex": 0,
            "activeTriggerClass":"ui-tab-item-current",
            "triggerType":'click'
        }).render();
        imgTabs.on('switched',function(toIndex,fromIndex){
            var curPanelEl=this.get('panels').eq(toIndex),
                listEl=$('.img-list',curPanelEl),
                pagEl=$('.img-list-pagination',curPanelEl);
            var imgList=curPanelEl.data('imgList'),
                feedType=curPanelEl.attr('feedtype');
            if(!imgList){
                imgList=new ImgList({
                    "element":listEl, //list selector
                    "pagSelector":pagEl, //pagination selector
                    "pagOpts":{ //分页配置项
                        "pageSize":16,
                        "visiblePageNums":7
                    },
                    "attachType":"img", //请求图片类型的附件
                    "listPath":"/attach/getAttachFilesOfIReceive", //我收到的附件
                    "loadSize":15,   //单次加载15条记录
                    "defaultRequestData":function(){
                        return {
                            "attachType":2, //2表示为图片
                            "feedType":feedType,
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
					"searchOpts":{
						"inputSelector":searchEl,
						"btnSelector":searchBtnEl
					} //默认请求数据
                });
                imgList.load();
                curPanelEl.data('imgList',imgList);
            }else{
                imgList.reload();
            }
            currentList=imgList;
        });
        //默认加载第一个tab
        //imgTabs.trigger('switched',0,-1);
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            currentList.reload();
            evt.preventDefault();
        });
        //切换到当前模板后重新加载feedlist
        /*tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //imgTabs.switchTo(0);
                reloadFirstTab(imgTabs);
            }
        });*/
        var destroy=function(){
            var panels=imgTabs.get('panels');
            panels.each(function(){
                var panelEl=$(this);
                var imgList=panelEl.data('imgList');
                imgList&&imgList.destroy();
                panelEl.removeData();
            });
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
        //改为不缓存
        reloadFirstTab(imgTabs);
    };
});