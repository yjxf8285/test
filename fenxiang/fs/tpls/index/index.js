/**
 * Index模板
 *
 * 遵循seajs module规范
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
		moment = require('moment'),
        tplEvent = tpl.event;
    var util = require('util');
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
			
		var globalData=FS.getAppStore('globalData');
		
		var departmentCountTpl=$('.department-count-tpl',tplEl),
			employeeCountTpl=$('.employee-count-tpl',tplEl),
			empcountOfnotincircleWrap=$('.empcount-ofnotincircle-wrap',tplEl),
			empcountOfnotincircleNumber=$('.empcount-ofnotincircle-number',tplEl);
		
		var departmentCountHtml='',
			employeeCountHtml='';
		if(globalData.departmentCount > 0){
			departmentCountHtml='<span class="rlist-icon"></span>至少创建1个部门（已完成）';
		}else{
			departmentCountHtml='<span class="rlist-icon rlist-icon02"></span><a href="#departmentstaff/=/create-circle">点击立即创建</a>';
		}	
		departmentCountTpl.html(departmentCountHtml);
		
		if(globalData.employeeCount > 5){
			employeeCountHtml='<span class="rlist-icon"></span>至少新建5位同事（已完成）';
		}else{
			employeeCountHtml='<span class="rlist-icon rlist-icon02"></span><a href="#departmentstaff/=/create-employee">点击立即创建</a>';
		}	
		employeeCountTpl.html(employeeCountHtml);
		
		if(globalData.empCountOfNotInCircle > 0){
			empcountOfnotincircleWrap.show();
			empcountOfnotincircleNumber.text(globalData.empCountOfNotInCircle);
		}else{
			empcountOfnotincircleWrap.hide();
		}
		//颜色条变化 function
		var funColorBlock = function(colorTpl,gDataTotal,gDataUsed,fontColor){
			var usedPercentage,widthPercentage;
			if(gDataTotal != 0){
				usedPercentage = gDataUsed * 100 / gDataTotal;
				widthPercentage = gDataUsed / gDataTotal * 100 + '%';
			}else{
				usedPercentage=0;
			}
			colorTpl.find('.strip-width').css('width',widthPercentage);
			if(usedPercentage <= 60){
				colorTpl.css('border-color','#6D89BC');
				fontColor.css('color','#6D89BC');
				colorTpl.find('.strip-width').css('background-color','#aebeda');
			}else if(usedPercentage > 60 && usedPercentage <= 80){
				colorTpl.css('border-color','#EB9523');
				fontColor.css('color','#EB9523');
				colorTpl.find('.strip-width').css('background-color','#f4c485');
			}else{
				colorTpl.css('border-color','#D04B38');
				fontColor.css('color','#D04B38');
				colorTpl.find('.strip-width').css('background-color','#e59b91');
			}
		}
		//短信数量 rander
		var smsTotalAmountEl=$('.sms-total-amount',tplEl),
			smsUsedAmountEl=$('.sms-used-amount',tplEl),
			smsRechargeUrlEl=$('.sms-recharge-url',tplEl),
			exceedStripTpl=$('.sesp-tpl',tplEl);
		var smsExceedAmountEl=globalData.smsTotalAmount - globalData.smsUsedAmount;
		if(smsExceedAmountEl < 0){
			exceedStripTpl.html('已超过'+Math.abs(smsExceedAmountEl)+'条');
		}else{
			exceedStripTpl.html('剩余'+smsExceedAmountEl+'条');
		}
	    smsTotalAmountEl.html(globalData.smsTotalAmount);
		smsUsedAmountEl.html(globalData.smsUsedAmount);
		smsRechargeUrlEl.attr('href',globalData.smsRechargeUrl);
		//短信数量 rander 颜色条判断
		var smsStripTpl=$('.sms-strip-tpl',tplEl); 
		funColorBlock(smsStripTpl,globalData.smsTotalAmount,globalData.smsUsedAmount,exceedStripTpl);
		
		//帐号使用 rander
		var accountTotalAmountEl=$('.account-total-amount',tplEl),
			accountUsedAmountEl=$('.account-used-amount',tplEl),
			surplusStripTpl=$('.assp-tpl',tplEl);
		var accountExceedAmountEl=globalData.accountTotalAmount - globalData.accountUsedAmount;
		if(accountExceedAmountEl < 0){
			surplusStripTpl.html('已超过'+Math.abs(accountExceedAmountEl)+'个');
		}else{
			surplusStripTpl.html('剩余'+accountExceedAmountEl+'个');
		}	
		accountTotalAmountEl.html(globalData.accountTotalAmount);
		accountUsedAmountEl.html(globalData.accountUsedAmount);
		//帐号使用 rander 颜色条判断
		var accountStripTpl=$('.account-strip-tpl',tplEl); 
		funColorBlock(accountStripTpl,globalData.accountTotalAmount,globalData.accountUsedAmount,surplusStripTpl);
		
		//存储空间 rander
		var storageTotalSpaceEl=$('.storage-total-space',tplEl),
			storageUsedSpaceEl=$('.storage-used-space',tplEl),
			ssRechargeUrlEl=$('.ss-recharge-url',tplEl),
			spaceStripTpl=$('.sssp-tpl',tplEl);
		var spaceExceedAmountEl=globalData.storageTotalSpace - globalData.storageUsedSpace;
		if(spaceExceedAmountEl < 0){
			spaceStripTpl.html('已超过'+globalData.storageUnusedSpaceDesc);
		}else{
			spaceStripTpl.html('剩余'+globalData.storageUnusedSpaceDesc);
		}
	    storageTotalSpaceEl.html(globalData.storageTotalSpaceDesc);
		storageUsedSpaceEl.html(globalData.storageUsedSpaceDesc);
		ssRechargeUrlEl.attr('href',globalData.ssRechargeUrl);
		//存储空间 rander 颜色条判断
		var ssSpaceStripTpl=$('.space-strip-tpl',tplEl); 
		funColorBlock(ssSpaceStripTpl,globalData.storageTotalSpace,globalData.storageUsedSpace,spaceStripTpl);
		
		//名片数量 rander
		var cardNumberTpl=$('.card-number-tpl',tplEl),
			businessCardUsedAmountEl=$('.business-card-used-amount',tplEl),
			cardStripTpl=$('.scsp-tpl',tplEl),
			cardUsedTpl=$('.card-used-tpl',tplEl);
		var cardExceedAmountEl=globalData.businessCardTotalAmount - globalData.businessCardUsedAmount;
		if(cardExceedAmountEl < 0){
			cardStripTpl.html('已超过'+Math.abs(cardExceedAmountEl)+'张');
		}else{
			cardStripTpl.html('剩余'+cardExceedAmountEl+'张');
		}	
		var gCardTcolor=globalData.businessCardTotalAmount,
			gCardUcolor=globalData.businessCardUsedAmount;
		if(globalData.businessCardUseType == 0){
			cardNumberTpl.html('未开通服务');
			gCardTcolor=0;
			gCardUcolor=0;
			cardUsedTpl.hide();
			cardStripTpl.hide();
		}else if(globalData.businessCardUseType == 2){
			cardNumberTpl.html('不限量使用');
			gCardTcolor=0;
			gCardUcolor=0;
			cardUsedTpl.show();
			cardStripTpl.hide();
		}else{
			cardNumberTpl.html('购买数量'+globalData.businessCardTotalAmount+'张');
			cardUsedTpl.show();
			cardStripTpl.show();
		}
		businessCardUsedAmountEl.html(globalData.businessCardUsedAmount);
		//名片数量 rander 颜色条判断
		var bsCardStripTpl=$('.card-strip-tpl',tplEl); 
		funColorBlock(bsCardStripTpl,gCardTcolor,gCardUcolor,cardStripTpl);
		//软件到期时间 rander
		var endTimeTpl=$('.end-time-tpl',tplEl),
			endDayTpl=$('.end-day-tpl',tplEl);
		var endTimeEl=moment.unix(globalData.endTime).format('YYYY年MM月DD日'),
			serviceTimeEl=new Date();
		var tsDateSs = serviceTimeEl.getTime();
		var tsDateSsDay = Math.floor(tsDateSs/(24*3600*1000));
		var tsDateDd = Math.floor(globalData.endTime/(24*3600));
		var tsDays = tsDateDd - tsDateSsDay;
		endTimeTpl.html(endTimeEl);
		if(tsDays >= 90){
			endDayTpl.css('color','#6D89BC');
		}else if(tsDays >= 30 && tsDays < 90){
			endDayTpl.css('color','#EB9523');
		}else{
			endDayTpl.css('color','#D04B38');
		}
		if(tsDays >= 0){
			endDayTpl.html('（剩余'+tsDays+'天）');
		}else{
			endDayTpl.html('（已超过'+Math.abs(tsDays)+'天）');
		}


        //几个导航链接
        if(globalData.model==2){    //促销宝权限
            $('.shortcut-links',tplEl).html('<li>1、创建员工帐号（<a href="#employeemgtformarketing/=/create-employee" class="create-employee-l">点击立即创建</a>）</li>');
            $('.create-circle-box,.disk-manage-box',tplEl).hide();
            $('.create-employee-box',tplEl).attr('href','#employeemgtformarketing/=/create-employee');
            $('.itplr-toplist-wrap',tplEl).hide();
        }
        //修改密码
        if(globalData.account=="admin"){
            $('.modify-pwd-tip').show();
        }
        $('.modify-admin-pwd-l',tplEl).on('click',function(evt){
            $('.hd .change-pwd-l').click();
            evt.preventDefault();
        });
    };
});