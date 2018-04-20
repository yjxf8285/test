/**
 * 修改记录页
 *
 * 遵循seajs module规范
 * @author mxy
 */

 define(function(require, exports, module){
 	var root = window,
        FS = root.FS;
 	var Widget=require('widget');
 	var tpl = require('modules/crm-customer-modify-records/crm-customer-modify-records.html');
////    var tplStyle = require('modules/crm-customer-modify-records/crm-customer-modify-records.css');
    var util = require('util'),
    	moment = require('moment');
 	var ModifyRecords = Backbone.View.extend({
 		records: [],
 		params: null,//存储参数
 		template: _.template($(tpl).filter('.crm-modifyrecords-tpl').html()), //模板
 		refresh: function(snapShotID, snapShotTitle, customerID){
 			!this.params && (this.params = this.options);
 			snapShotTitle && (this.params.snapShotTitle = snapShotTitle);
 			customerID && (this.params.customerID = customerID);
 			this.loadData(snapShotID);
 		},
 		
 		bindEvents: function(){
 			var me = this,
 				$select = this.$el.find('.mn-select-box');
 			this.$el.find('.btn-left').bind('click', function(e){
 				me.left(e);
 			});
 			this.$el.find('.btn-right').bind('click', function(e){
 				me.right(e);
 			});
 			this.$el.find('.btn-back').bind('click', function(e){
 				me.back(me.params.customerID, util.mnGetter($select));
 			});
 			util.mnEvent($select, 'change', function(id){
 				var idx = me.getRecordIdx(id);
                me.refresh(id, me.records[idx].title);
            });
        },
        //恢复此条记录
        back: function(customerID, snapShotID){
        	var me = this;
        	util.api({
                "url": '/' + me.params.restoreUrl,
                "type": 'post',
                "dataType": 'json',
                "data": {
        			customerID: customerID,
                    snapShotID: snapShotID
                },
                "success": function(responseData) {
                	 util.remind(1, '恢复成功');
                    me.trigger('success');
//                	 me.params.v.tab.select("tab-time-line");
//                	 me.params.v.refresh();
                }
            });
        },
        left: function(e){
        	var $this = $(e.target),
        		$select = this.$el.find('.mn-select-box');
        	if($this.hasClass('btn-disabled')) return;
        	var cur = util.mnGetter($select),
        		idx = this.getRecordIdx(cur);
        	if(idx>0) {
        		util.mnSetter($select, this.records[idx-1].snapshotID);
        	} 
        	if(idx==1) {
	    		$this.addClass('btn-disabled');
	    	}
        	this.$el.find('.btn-right').removeClass('btn-disabled');
//        	this.refresh(util.mnGetter($select), this.records[idx-1].title);
        },
        right: function(e){
        	var $this = $(e.target),
	    		$select = this.$el.find('.mn-select-box');
	    	if($this.hasClass('btn-disabled')) return;
	    	var cur = util.mnGetter($select),
	    		idx = this.getRecordIdx(cur);
	    	if(idx<this.records.length-1) {
	    		util.mnSetter($select, this.records[idx+1].snapshotID);
	    	} 
	    	if(idx==this.records.length-2) {
	    		$this.addClass('btn-disabled');
	    	}
	    	this.$el.find('.btn-left').removeClass('btn-disabled');
//	    	this.refresh(util.mnGetter($select), this.records[idx+1].title);
        },
        getRecordIdx: function(cur) {
        	cur = cur + '';
        	var idx = -1;
        	for(var i=0, len=this.records.length; i<len; i++) {
        		if(cur == this.records[i].snapshotID + '') {
        			idx = i;
        			break;
        		}
        	}
        	return idx;
        },
 		loadData: function(snapShotID){
 			var me = this,
 				customerID = me.params.customerID,
 				recordsUrl = me.params.recordsUrl,
 				snapshotsUrl = me.params.snapshotsUrl;
            util.api({
                "dataType": 'json',
                "type": "get",
                "url": recordsUrl,
                "data": {customerID: customerID},
                beforeSend: function () {
                    util.showGlobalLoading(1); //显示黄条加载提示
                },
                "success": function (responseData) {
                	if(!responseData.success || responseData.value.snapshots.length<1) {
                		util.hideGlobalLoading(1); //隐藏黄条加载提示
                		return;
                	}
                	me.formatRecords(responseData.value, snapShotID);
                    util.api({
                        "dataType": 'json',
                        "type": "get",
                        "url": snapshotsUrl,
                        "data": {customerID: customerID, snapshotID: snapShotID || responseData.value.snapshots[0].snapshotID},
                        "success": function (responseData) {
                        	util.hideGlobalLoading(1); //隐藏黄条加载提示
                            if(responseData.success) {
                            	var content = me.formatContent(responseData.value);
                                me.render({
                                	records: me.records,
                                	main: content.main,
                                	desc: content.desc,
                                	snapShotTitle: me.params.snapShotTitle || me.records[0].title
                                });
                            }
                        }
                    });
                }
            });
 		},
 		//处理recordss数据
 		formatRecords: function(data, snapShotID) {
 			var snapshots = data.snapshots,
 				result = [];
 			for(var i=0,len=snapshots.length; i<len; i++) {
 				result.push({
 					title: [
 		 				    snapshots[i].employee.name,
 		 				    '在',
 		 				    moment.unix(snapshots[i].snapshotTime).format('YYYY-MM-DD HH:mm'),
 		 				    '创建记录'
 		 				].join(''),
 		 			snapshotID: snapshots[i].snapshotID,
 		 			selected: (snapShotID && (snapShotID == snapshots[i].snapshotID)) ? 1: ''
 				});
 			}
 			if(!snapShotID) {
 				result[0].selected = 1;
 			}
 			this.records = result;
 		},
 		//处理下方分项数据
 		formatContent: function(data) {
 			var n = data.firstSnapshot,
 				o = data.secondSnapshot;
 			if(!o.customerID) {
 				o.name = '';
 				o.webSite = '';
 				o.address = '';
 				o.introduction = '';
 				o.fullName = '';
 			}
 			var main = [],
 				desc = [];
 			main.push({
 				name: '',
 				state: n.fullName!=o.fullName&&o.fullName? 'change' : '',
 				value0: o.fullName,
 				value1: n.fullName
 			});
			main.push({
 				name: '简称',
 				state: n.name!=o.name&&o.name? 'change' : '',
 				value0: o.name,
 				value1: n.name
 			});
			main.push({
 				name: '地址',
 				state: o.address!=n.address&&o.address? 'change' : '',
 				value0: o.address || '无',
 				value1: n.address
 			});
			main.push({
 				name: '网址',
 				state: o.webSite!=n.webSite&&o.webSite? 'change' : '',
 				value0: o.webSite || '无',
 				value1: n.webSite
 			});
			desc.push({
 				name: '简介',
 				state: o.introduction!=n.introduction? 'change' : '',
 				value0: o.introduction,
 				value1: n.introduction
 			});
 			return {
 				main: main,
 				desc: desc
 			}
 		},
        // 渲染
        render: function (data) {
            var elEl = this.$el,
            	renderTemplate = this.template;
            elEl.html(renderTemplate(data));
            this.options.wrapEl.html(elEl);
            var elDesc = $('.content-desc', elEl);
            elDesc.css('height', elDesc.find('.old').height() + elDesc.find('.new').height());
            this.bindEvents();
            return this;
        },
        destroy: function(){
        	util.mnDestroy(this.$el.find('.mn-select-box'));
        }
 	});
 	module.exports = ModifyRecords;
 });
