/**
 * 发布时选择客户
 *
 * @author mxy
 */

 define(function(require, exports, module){
 	var root = window,
        FS = root.FS;
 	var Widget=require('widget');
 	var tpl = require('modules/fs-select-contacts/fs-select-contacts.html');
 	var tplStyle = require('modules/fs-select-contacts/fs-select-contacts.css');
    var util = require('util'),
    	moment = require('moment');
 	var SelectContacts = Backbone.View.extend({
 		records: [],
 		params: null,//存储参数
 		template: _.template($(tpl).filter('.fs-select-contacts-tpl').html()), //模板
 		refresh: function(opts){
 			this.params = opts;
 			this.loadData();
 		},
 		bindEvents: function(){
 			var me = this;
 			this.$el.delegate('li', 'click', function(e){
 				var $this = $(this),
 					id = $this.attr('data-id'),
 					name = $this.attr('data-name');
 				if($this.hasClass('selected')) {
 					me.trigger('unselected', {id:id, name:name});
 					$this.removeClass('selected');
 				} else {
 					me.trigger('selected', {id:id, name:name});
 					$this.addClass('selected');
 				}
 				e.stopPropagation();
 			}).delegate('.btn-close', 'click', function(){
 				me.$el.hide();
 			});
 			$(document.body).on('click', function(){
 				me.$el.hide();
 			});
 		},
 		loadData: function(snapShotID){
 			var me = this;
 			util.api({
                "dataType": 'json',
                "type": "get",
                "url": '/Contact/GetUserContacts',
                "data": {
 					employeeID: util.getCrmData().currentEmp.employeeID,
 					keyword: '',
 					source: 1,
 					isFirstChar: false,
 					createCustomer: -1,
 					listTagOptionID: '',
 					sortType: 1,
 					startDate: 0,
 					endDate: 0,
 					isContainSubordinate: -1,
 					pageSize: 20,
 					pageNumber: 1
 				},
                "success": function (responseData) {
                    if(responseData.success) {
                        var data = {contacts: responseData.value.contacts};
                        me.render(data);
                    }
                }
            });
        },
        // 渲染
        render: function (data) {
        	var elEl = this.$el,
	        	renderTemplate = this.template;
	        elEl.html(renderTemplate(data));
	        if(!$('.fs-select-contacts')[0]) {
	        	$(document.body).append(elEl);
	        	this.bindEvents();
	        }
	        var dom = this.params.dom,
	        	posDom = $(dom).offset();
	        $(elEl).css({
	        	top: posDom.top + 20,
	        	left: posDom.left,
	        	position: 'absolute',
	        	zIndex: 1001,
	        	display: 'block'
	        });
	        return this;
        }
 	});
 	module.exports = SelectContacts;
 });