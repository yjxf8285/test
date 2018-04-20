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
 	var tpl = require('modules/crm-modify-records/crm-modify-records.html');
////    var tplStyle = require('modules/crm-modify-records/crm-modify-records.css');
    var util = require('util'),
    	moment = require('moment');
 	var ModifyRecords = Backbone.View.extend({
 		records: [],
 		params: null,//存储参数
 		template: _.template($(tpl).filter('.crm-modifyrecords-tpl').html()), //模板
 		refresh: function(snapShotID, snapShotTitle){
 			!this.params && (this.params = this.options);
 			snapShotTitle && (this.params.snapShotTitle = snapShotTitle);
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
 				me.back(me.params.contactId, util.mnGetter($select));
 			});
 			util.mnEvent($select, 'change', function(id){
 				var idx = me.getRecordIdx(id);
                me.refresh(id, me.records[idx].title);
            });
        },
        //恢复此条记录
        back: function(contactID, snapShotID){
        	var me = this;
        	util.api({
                "url": '/' + me.params.restoreUrl,
                "type": 'post',
                "dataType": 'json',
                "data": {
                    contactID: contactID,
                    snapShotID: snapShotID
                },
                "success": function(responseData) {
                	 util.remind(2, '恢复成功');
                	 me.params.v.tab.select("tab-time-line");
                	 me.params.v.refresh();
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
 				contactId = me.params.contactId,
 				recordsUrl = me.params.recordsUrl,
 				snapshotsUrl = me.params.snapshotsUrl;
            util.api({
                "dataType": 'json',
                "type": "get",
                "url": recordsUrl,
                "data": {contactId: contactId},
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
                        "data": {contactId: contactId, snapshotID: snapShotID || responseData.value.snapshots[0].snapshotID},
                        "success": function (responseData) {
                        	util.hideGlobalLoading(1); //隐藏黄条加载提示
                            if(responseData.success) {
                            	var content = me.formatContent(responseData.value);
                                me.render({
                                	records: me.records,
                                	main: content.main,
                                	other: content.other,
                                	phone: content.phone,
                                	addr: content.addr,
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
 				o = data.secondSnapshot,
 				noOld = false;
 			if(!o.contactID) {
 				o.name = '无';
 				o.post = '无';
 				o.department = '无';
 				o.company = '无';
 				o.webSite = '无';
 				o.gender = '无';
 				o.yearOfBirth = '0000';
 				o.monthOfBirth = o.dayOfBirth = '00';
 				o.interest = '无';
 				o.contactWayObject = [];
 				o.addressObject = [];
 				o.remark = '无';
 				noOld = true;
 			}
 			var main = [],
 				other = [],
 				phone = [],
 				addr = [],
 				desc = [];
			main.push({
 				name: '姓名',
 				state: noOld ? '' : (o.name==n.name? '' : 'change'),
 				value0: o.name,
 				value1: n.name
 			});
			main.push({
 				name: '职务',
 				state: noOld ? '' : (o.post==n.post? '' : 'change'),
 				value0: o.post || '无',
 				value1: n.post
 			});
			main.push({
 				name: '部门',
 				state: noOld ? '' : (o.department==n.department? '' : 'change'),
 				value0: o.department || '无',
 				value1: n.department
 			});
			main.push({
 				name: '公司',
 				state: noOld ? '' : (o.company==n.company? '' : 'change'),
 				value0: o.company || '无',
 				value1: n.company
 			});
			main.push({
 				name: '网址',
 				state: noOld ? '' : (o.webSite==n.webSite? '' : 'change'),
 				value0: o.webSite || '无',
 				value1: n.webSite
 			});
// 			if(o.gender || n.gender) {
 				other.push({
 	 				name: '性别',
 	 				state: noOld ? '' : (o.gender==n.gender? '' : 'change'),
 	 				value0: o.gender=='M'?'男':(o.gender=='F'?'女':'无'),
 	 				value1: n.gender=='M'?'男':(n.gender=='F'?'女':'')
 	 			});
// 			}
// 			if(o.yearOfBirth || n.yearOfBirth || o.monthOfBirth || n.monthOfBirth || o.dayOfBirth || n.dayOfBirth) {
 				other.push({
 	 				name: '生日',
 	 				state: noOld ? '' : (o.yearOfBirth==n.yearOfBirth && o.monthOfBirth==n.monthOfBirth && o.dayOfBirth==n.dayOfBirth? '' : 'change'),
 	 				value0: [(o.yearOfBirth||'0000')+'年', (o.monthOfBirth||'00')+'月', (o.dayOfBirth||'00')+'日'].join(''),
 	 				value1: [n.yearOfBirth?n.yearOfBirth+'年':'', n.monthOfBirth?n.monthOfBirth+'月':'', n.dayOfBirth?n.dayOfBirth+'日':''].join('')
 	 			});
// 			}
// 			if(o.interest || n.interest) {
 				other.push({
 	 				name: '爱好',
 	 				state: noOld ? '' : (o.interest==n.interest? '' : 'change'),
 	 				value0: o.interest||'无',
 	 				value1: n.interest
 	 			});
// 			}
			for(var i=0,j=o.contactWayObject.length; i<j; i++) {
 				var oItem = o.contactWayObject[i],
 					state = '',
 					flag = false; 				
 				for(var m=0,l=n.contactWayObject.length; m<l; m++) {
 					var nItem = n.contactWayObject[m];
 					if(nItem.type==oItem.type && nItem.content==oItem.content) {
 						flag = true;
 						break;
 					}
 				}
 				if(!flag) {
 					phone.push({
 						name: oItem.typeDesc,
 						state: 'del',
 						value0: oItem.content,
 						value1: ''
 					});
 				}
 			}
 			for(var i=0,j=n.contactWayObject.length; i<j; i++) {
 				var nItem = n.contactWayObject[i],
 					state = '',
 					flag = false;
 				for(var m=0,l=o.contactWayObject.length; m<l; m++) {
 					var oItem = o.contactWayObject[m];
 					if(nItem.type==oItem.type && nItem.content==oItem.content) {
 						flag = true;
 						break;
 					}
 				}
				phone.push({
					name: nItem.typeDesc,
					state: flag ? '' : 'new',
					value0: '',
					value1: nItem.content
				});
 			}
 			for(var i=0,j=o.addressObject.length; i<j; i++) {
 				var oItem = o.addressObject[i],
 					state = '',
 					flag = false;
 				for(var m=0,l=n.addressObject.length; m<l; m++) {
 					var nItem = n.addressObject[m];
 					if(nItem==oItem) {
 						flag = true;
 						break;
 					}
 				}
 				if(!flag) {
 					addr.push({
 						name: '地址',
 						state: 'del',
 						value0: oItem,
 						value1: ''
 					});
 				}
 			}
 			for(var i=0,j=n.addressObject.length; i<j; i++) {
 				var nItem = n.addressObject[i],
 					state = '',
 					flag = false;
 				for(var m=0,l=o.addressObject.length; m<l; m++) {
 					var oItem = o.addressObject[m];
 					if(nItem==oItem) {
 						flag = true;
 						break;
 					}
 				}
				addr.push({
					name: '地址',
					state: flag ? '' : 'new',
					value0: '',
					value1: nItem
				});
 			}
// 			if(o.remark || n.remark) {
 				desc.push({
 	 				name: '备注',
 	 				state: noOld ? '' : (o.remark==n.remark? '' : 'change'),
 	 				value0: o.remark||'无',
 	 				value1: n.remark
 	 			});
// 			}
 			return {
 				main: main,
 				other: other,
 				phone: phone,
 				addr: addr,
 				desc: desc
 			};
 		},
        // 渲染
        render: function (data) {
            var elEl = this.$el,
            	renderTemplate = this.template;
            elEl.html(renderTemplate(data));
            this.options.wrapEl.html(elEl);
            this.bindEvents();
            return this;
        }
 	});
 	module.exports = ModifyRecords;
 });