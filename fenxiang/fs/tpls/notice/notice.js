/**
 * 系统通知/系统回复
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
        NoticeList = require('modules/fs-notice-list/fs-notice-list');
    exports.init=function(){
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var noticeListEl = $('.notice-list', tplEl),
            pagEl = $('.notice-list-pagination', tplEl),
            filterEl=$('.filter',tplEl);
        var noticeList = new NoticeList({
            "element": noticeListEl, //容器
            "pagSelector": pagEl, //分页按钮容器
            "listPath": "/GlobalInfo/GetNoticeRecords", //系统通知接口地址
            "defaultRequestData":function(){
                var noticeType=$('.depw-tabs-aon',filterEl).attr('noticetype');
                return {
                    "noticeType":noticeType     //系统通知类型，0：全部；1：系统通知；2：系统回复
                };
            }
        });
        //filter筛选
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            $('.filter-field',filterEl).removeClass('depw-tabs-aon');
            meEl.addClass('depw-tabs-aon');
            noticeList.reload();
            evt.preventDefault();
        })
        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //刷新列表
                if(firstRender){
                    noticeList.load();
                }else{
                    firstRender=false;
                    noticeList.reload();
                }
            }
        });
		//清空系统通知
		var noticeClearEl=$('.clear-notice-l',tplEl),
			noticeClearWraper=$('.clear-alert-wrap',tplEl),
			noticeClearTpl=$('.clear-alert-main',tplEl),
			clearBtnConfirm=$('.clear-btn-confirm',tplEl),
			clearBtnCanncel=$('.clear-btn-canncel',tplEl);
		noticeClearEl.click(function(evt){
            if($('.fs-notice-list-item',noticeList.element).length>0){
                noticeClearWraper.show();
                noticeClearTpl.animate({top:'0px'},500);
            }
			evt.preventDefault();
		});
		clearBtnConfirm.click(function(){
			util.api({
				"type":"post",
				"data":{},
				"url":"/GlobalInfo/ClearNoticeRecords",
				"success":function(responseData){
					if(responseData.success){
                        noticeList.empty(); //清空列表
						noticeClearTpl.animate({top:'100px'},500);
						setTimeout(function(){
							noticeClearWraper.hide();
						},500);
					}
				}
			});
			
		});
		clearBtnCanncel.click(function(){
			noticeClearTpl.animate({top:'100px'},500);
			setTimeout(function(){
				noticeClearWraper.hide();
			},500);
		});
		
    };
});