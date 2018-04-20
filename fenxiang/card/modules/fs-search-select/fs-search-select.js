/**
 * FS搜索选择人和时间
 *
 * 遵循seajs module规范
 * @author mxy
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var publish=require('modules/publish/publish'),
        Dialog=require('dialog'),
        mask=require('mask'),
        CardCalendar=require('cardcalendar'),
        ssTpl=require('./fs-search-select.html'),
//        ssStyle=require('./fs-search-select.css'),
        FeedList = require('modules/feed-list/feed-list'),
        util=require('util'),
        moment=require('moment'),
        publish=require('modules/publish/publish');

    var ssEl=$(ssTpl);
    var DateSelect=publish.dateSelect;
    var SelectBar = publish.selectBar; 
    var container=[],
        dateFormatStr="YYYY-MM-DD",
        dateFormatStr2="YYYY年MM月DD日";

    var SearchSelectDialog=Dialog.extend({
    	"sb": null,
        "attrs":{
            className:'fs-search-select-dialog',
            content:ssEl.filter('.fs-search-select-tpl').html(),
            employeeId:0,
            successCb:FS.EMPTY_FN,
            holder: null
        },
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
			"click .ff-success-a":"_clickAhref"  
        },
		"_clickAhref":function(){
			var elEl=this.element;
			$('.ff-success-a',elEl).hide();
		},
        /**
         * 获取发布的可视范围
         * @param feedTypeName plan/approve/work/schedule...
         * @returns {{}}
         */
        getPublishRange:function(feedTypeName){
            return util.getPublishRange(feedTypeName, true, true);
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
        	var that = this;
        	var contactData =util.getContactData();
            this.contactPersonData = contactData['p'];
            this.currentUserData=contactData['u'];
            var elEl=this.element,
                startDateEl=$('.start-date',elEl),
                endDateEl=$('.end-date',elEl);
            var startDate = new DateSelect({
                "element": startDateEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            var endDate = new DateSelect({
                "element": endDateEl,
                "placeholder": "选择日期",
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            this.sd=startDate;
            this.ed=endDate;
//            this.contactGroupData = _.reject(contactData["g"],function(circleData){  //排除全公司
//                return circleData.id==999999;
//            });
            var sb = new SelectBar({
                "element": $('.selectbar', this.element),
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": this.contactPersonData
                    }
                ],
                "acInitData":this.getPublishRange('searchselect'),
                "title": "选择同事&#8230;",
                "autoCompleteTitle": "请输入同事的名称或拼音"
            });
            this.sb = sb;
            sb.on('inputshow',function(){
                sb.setAcInitData(that.getPublishRange('searchselect'), $('.selectbar', that.element));
            });
            if(this.get('selectColleague')) {
            	$('.pc-selct-pp', elEl).show();
            }
        },
        "render":function(){
            var result=SearchSelectDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=SearchSelectDialog.superclass.show.apply(this,arguments);
            $('.search-inp', this.element).val(this.get('associatedIpt').val());
            return result;
        },
        "removeAllCondition": function(){
        	$('.' + this.get('customClass')).remove();
        	this.get('trigger').removeClass('has-condition');
        },
        "hide":function(){
            var result=SearchSelectDialog.superclass.hide.apply(this,arguments);
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
				feedPlanTypeEl=$('[name="plan_type"]',elEl);
			var sd=this.sd,
				ed=this.ed,
				selectedFeedPlanType=feedPlanTypeEl.filter(':checked').val(),
                employeeId=this.get('employeeId'),
                items = [];
			if(this.sb) {
				var sbData = this.sb.getSelectedData();
	            var requestData={
	            	"keyword": $('.search-inp', elEl).val() || '',
					"employeeIDs": sbData.p||[],
					"startTime": sd.getValue(true) ? sd.getValue(true).unix() : '',
					"endTime": ed.getValue(true) ? ed.getValue(true).add('days', 1).subtract('seconds', 1).unix() : ''  //保证是当天时间23:59:59
		        };
	            return requestData;
			} else {
				return {
					"keyword": $('.search-inp', elEl).val() || '',
					"employeeIDs": [],
					"startTime": '',
					"endTime": ''  //保证是当天时间23:59:59
				};
			}
        },
        "_clear":function(){
            var elEl=this.element,
			    feedPlanTypeEl=$('[name="plan_type"]',elEl),
			    startDateInputEl=$('.start-date .fs-publish-dateselect-input',elEl),
                endDateInputEl=$('.end-date .fs-publish-dateselect-input',elEl);
			$('.ff-success-a',elEl).hide();
			$('.ff-success-a',elEl).attr('href','#')
			feedPlanTypeEl.eq(0).attr('checked','checked');
//			startDateInputEl.val('');
//			endDateInputEl.val('');
			this.sd && (this.sd.clear());
			this.ed && (this.ed.clear());
			this.sb && (this.sb.removeAllItem());
        },
        getPersonalConfig: function(){
            var requestData=this.getRequestData(),
                employeeIDs=requestData["employeeIDs"];
            var searchselectEmployees=util.getPersonalConfig('searchselectEmployees')||[];

            //可视范围中的员工
            _.each(employeeIDs,function(employeeId){
                var employeeData=util.getContactDataById(employeeId,'p');
                searchselectEmployees= _.filter(searchselectEmployees,function(configItem){     //先删掉以前存储的
                    return configItem.dataID!=employeeId;
                });
                //前插一个新的
                searchselectEmployees.unshift({
                    "dataID": employeeId,
                    "isCircle":false,
                    "name":employeeData.name
                });
                if(searchselectEmployees.length>5){
                	searchselectEmployees.pop();  //大于5的话干掉最后一个
                }
            });
            return {
                "searchselectEmployees":searchselectEmployees
            };
        },
        "_isvalid": function(){
        	var requestData=this.getRequestData();
        	if(requestData.employeeIDs.length>10) {
        		util.alert('最多能选取10个人！');
        		return false;
        	}
        	if(requestData.startTime && requestData.endTime && requestData.startTime > requestData.endTime) {
        		util.alert('开始时间不应该大于结束时间！');
        		return false;
        	}
        	return true;
        },
        "_submit":function(){
            var that=this;
			var elEl=this.element,
                downloadEl=$('.ff-success-a',elEl);
			if(this._isvalid()) {
				var personalConfig=this.getPersonalConfig();
	            //重设回个人配置中
	            _.each(personalConfig,function(val,cateKey){
	                util.setPersonalConfig(cateKey,val);
	            });
	            //同步到服务端
	            util.updatePersonalConfig();
				var requestData=this.getRequestData();
				if(requestData.employeeIDs.length || requestData.startTime || requestData.endTime) {
					this.get('trigger').addClass('has-condition');
				} else {
					this.get('trigger').removeClass('has-condition');
				}
				that.get('associatedIpt').val(requestData.keyword);
				if(requestData.keyword) {
					that.get('associatedIpt').addClass('with-input-value');
				} else {
					that.get('associatedIpt').removeClass('with-input-value');
				}
				that.trigger('searchSelectOk', {});
				that.hide();
			}
        },
        "getConditionWords": function(){
        	var that = this,
        		requestData=this.getRequestData();
        	if(requestData.employeeIDs.length || requestData.startTime || requestData.endTime) {
        		var result = [],
        			pandg = [];
        		result.push('<span class="icon"></span>');
    			$.each(requestData.employeeIDs||[], function(idx, item){
    				pandg.push(that.sb.getItemData(item, 'p').name);
    			});
    			if(pandg.length > 1) {
    				result.push('共' + pandg.length + '个人');
    			} else {
    				result.push(pandg.join('，'));
    			}
    			if(requestData.startTime || requestData.endTime) {
    				if(requestData.startTime && requestData.endTime) {
    					result.push('<span style="padding: 0 3px;">' + moment.unix(requestData.startTime).format('YYYY-MM-DD') + '</span>');
    	    	        result.push('至');
    	    	        result.push('<span style="padding: 0 3px;">' + moment.unix(requestData.endTime).format('YYYY-MM-DD') + '</span>期间');
    				} else if(requestData.startTime) {
    					result.push('<span style="padding: 0 3px;">' + moment.unix(requestData.startTime).format('YYYY-MM-DD') + '</span>以后');
    				} else if(requestData.endTime) {
    					result.push('<span style="padding: 0 3px;">' + moment.unix(requestData.endTime).format('YYYY-MM-DD') + '</span>以前');
    				}
    			}
    	        result.push('的');
    	        return result.join('');
        	} else {
        		return '共找到';
        	}
        },
        "_cancel":function(){
			this.hide();
			this._clear();
        },
        "destroy":function(){
            var result;
            this.sd&&this.sd.destroy();
            this.ed&&this.ed.destroy();
            result=SearchSelectDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports = SearchSelectDialog;
});