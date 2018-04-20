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
        tplCommon = require('../settings-common');
    var feedPlanRemaidObject=FS.getAppStore('contactData')["feedPlanRemaidObject"];
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        //提交数据
        var weekIsRemaid=$('#weekIsRemaid',tplEl),
            dayOfWeek=$('#dayOfWeek',tplEl),
            weekTime=$('#weekTime',tplEl),
            monthIsRemaid=$('#monthIsRemaid',tplEl),
            dayOfMonth=$('#dayOfMonth',tplEl),
            monthTime=$('#monthTime',tplEl);

		//时间下拉 控件
		var choseTimeEl=$('.chose-time-input',tplEl),
			choseTimeTpl=$('.chose-time-apv',tplEl);
        //默认值设置
        monthIsRemaid.prop('checked',feedPlanRemaidObject.monthIsRemaid);
        weekIsRemaid.prop('checked',feedPlanRemaidObject.weekIsRemaid);
        if(feedPlanRemaidObject.weekIsRemaid){
            dayOfWeek.val(feedPlanRemaidObject.dayOfWeek);
            weekTime.val(feedPlanRemaidObject.weekShow.split(' ')[1]);
        }
        if(feedPlanRemaidObject.monthIsRemaid){
            dayOfMonth.val(feedPlanRemaidObject.dayOfMonth);
            monthTime.val(feedPlanRemaidObject.monthShow.split(' ')[1]);
        }

		choseTimeEl.click(function(event){
			var meEl=$(this);
			choseTimeTpl.hide();
			meEl.next().show();
			event.stopPropagation();
		});
		choseTimeTpl.find('a').click(function(){
			var meEl=$(this);
			var	itemVal=meEl.html();
			var parentInput=meEl.parents('.planremindconfig-control').find('.chose-time-input');
			parentInput.val(itemVal);
			meEl.parents('.chose-time-apv').hide();
		});
		$(document).click(function(){$('.chose-time-apv',tplEl).hide();});
		
		//select checkbox input 交互
		var checkboxEl=$('.chk-week',tplEl),
			selectEl=$('.sel-week-list',tplEl);
		checkboxEl.click(function(){
			var meEl=$(this);
			if (meEl.attr("checked")){
				meEl.next().find('option').eq(1).prop('selected',true);
				meEl.nextAll('.chose-time-input').val("08:00");
			}else{
				meEl.next().val("0");
				meEl.nextAll('.chose-time-input').val("");	
			}
		});
		selectEl.change(function(){
			var meEl=$(this);
			if (meEl.val() !== '0'){
				meEl.prev().prop('checked',true);
				meEl.next().val("08:00");
			}else{
				meEl.prev().prop('checked',false);
				meEl.next().val("");
			}
		});
		var getRequestData=function(){
			var requestData={};
			requestData.dayOfWeek=parseInt(dayOfWeek.val());
			requestData.weekHour=parseInt(weekTime.val().slice(0,2))||0;
			requestData.weekMinute=parseInt(weekTime.val().slice(3,5))||0;
			if(weekIsRemaid.is(':checked')){
				requestData.weekIsRemaid=true;
			}else{
				requestData.weekIsRemaid=false;
			}
			if(dayOfMonth.val() == -1 ){
				requestData.monthRemaidType=1;
			}else if(dayOfMonth.val() == -2 ){
				requestData.monthRemaidType=2;
			}else{
				requestData.monthRemaidType=3;
			}
			requestData.dayOfMonth=parseInt(dayOfMonth.val());
			requestData.MonthHour=parseInt(monthTime.val().slice(0,2))||0;
			requestData.MonthMinute=parseInt(monthTime.val().slice(3,5))||0;
			if(monthIsRemaid.is(':checked')){
				requestData.monthIsRemaid=true;
			}else{
				requestData.monthIsRemaid=false;
			}
			return requestData;	
		};
		var planMcBtn=$('.save-success-btn',tplEl);
		planMcBtn.click(function(evt){
			var requestData;
			requestData=getRequestData();
			util.api({
				"type":"post",
				"data":requestData,
				"url":"/FeedPlan/SetSmsRemaid/",
				"success":function(responseData){
					if(responseData.success){
						tplCommon.saveSuccessAnimated(tplEl,tplName);
					}
				}
			});
			evt.preventDefault();
		});
		//tab部分
		tplCommon.init(tplEl,tplName);
		
    };
});