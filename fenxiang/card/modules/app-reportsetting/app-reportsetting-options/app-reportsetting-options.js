/**
 * 报表管理：创建或编辑；第一步
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl
        util = FS.util;
    require('modules/app-reportsetting/app-reportsetting-options/app-reportsetting-options.css');
    var tplhtml = require('modules/app-reportsetting/app-reportsetting-options/app-reportsetting-options.html');
    
    var SettingOptions = Backbone.View.extend({
    	tagName: 'div', //HTML标签名
        className: '', //CLASS名
        template: _.template($(tplhtml).filter('.report-settingsetting-options-ctner').html()), //模板
        options: {
            wrapEl: null, //父级容器
            templateID: null, //报表ID（用于编辑）
            fields: null, //报表（用于编辑）
            delFields: []
        },
        /**
         * 初始化
         */
        init: function(){
        	this.element = this.options.wrapEl;
        	this.render();
        	this.bindEvents();
        },
        /**
         * 显示：创建和编辑根据opts.templateID是否有值来确定
         */
        show: function(opts){
        	var that = this,
        		templateID = opts && opts.templateID || this.options.templateID;
        	this.options.templateID = templateID;
        	if(templateID) {
        		util.api({
                    "dataType": 'json',
                    "type": "get",
                    "url": '/DataReporting/GetTemplateItems',
                    "data": {templateID: templateID},
                    "success": function (responseData) {
                    	if(responseData.success) {
                    		that.options.fields = responseData.value.items;
                    		that.fillForms(responseData.value);
                        	that.updateRows();
                        	that.trigger('tplNameChange', {
                        		name: responseData.value.templateName,
                        		templateID: templateID
                        	});
                    	}
                    }
                });
        	} else {
        		this.renderRow();
            	this.updateRows();
        	}
        },
        /**
         * 编辑时，填充表单
         */
        fillForms: function(data){
        	var that = this,
        		name = data.templateName,
        		fields = data.items,
        		$tplName = $('.name-ipt', this.element),
        		$fieldsCtener = $('.options-field-ctner', this.element);
        	$tplName.val(name);
        	$.each(fields, function(idx, item){
        		that.renderRow({
        			value: item
        		});
        	});
        },
        /**
         * reset
         */
        reset: function(){
        	$('.options-fields-ctner', this.element).html('');
        	$('.name-ipt', this.element).val('');
        	this.options.templateID = null;
        	this.options.fields = null;
        	this.options.delFields = [];
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
        	var that = this,
        		$fieldsCtner = $('.options-fields-ctner', this.element);
        	$fieldsCtner.delegate('.btn-add', 'click', function(){
        		var $this = $(this),
        			count = $fieldsCtner.find('.options-field-ctner').length;
        		if(count == 20) {
        			util.alert('最多可添加20个列');
        			return;
        		} 
        		var $addedRow = that.renderRow({
        			target: $this.parent().parent()
        		});
        		$addedRow.find('.field-ipt').trigger('focus');
        		that.updateRows();
        	});
        	$fieldsCtner.delegate('.btn-del', 'click', function(){
        		var $this = $(this),
        			count = $fieldsCtner.find('.options-field-ctner').length;
        		if(count==1) {
        			util.alert('至少添加1个列');
        			return;
        		}
        		$this.parent().parent().remove();
        		that.updateRows();
        		var dataid = $this.attr('data-id');
        		if(dataid) {
        			that.options.delFields.push(dataid);
        		}
        	});
        	$fieldsCtner.delegate('.field-ipt', 'blur', function(){
        		that.updateRows();
        	});
        	$('.report-edit-btn-ok', this.element).bind('click', function(){
    			var param = that.isValid();
    			if(param) {
    				param.items = param.templateItems;
        			delete param.templateItems;
        			param.removeItems = that.options.delFields;
        			param.templateID = that.options.templateID;
        			util.api({
        				"url": '/DataReporting/UpdateTemplateItem',
                        "type": 'post',
                        "dataType": 'json',
                        "data": param,
                        "success": function (data) {
                            if (data.success) {
                            	that.options.delFields = [];
                            	that.trigger('tplNameChange', {
                            		name: param.templateName,
                            		templateID: that.options.templateID
                            	});
                            	util.alert('保存成功',function(){
                            		that.reset();
                            		that.show({
                            			templateID: param.templateID
                            		});
                            	});
                            }
                        }
        			});
    			}
        	});
        	//保存并下一步
        	$('.report-btn-ok', this.element).bind('click', function(){
        		if(that.options.templateID) {
        			var param = that.isValid();
        			if(param) {
        				param.items = param.templateItems;
            			delete param.templateItems;
            			param.removeItems = that.options.delFields;
            			param.templateID = that.options.templateID;
            			util.api({
            				"url": '/DataReporting/UpdateTemplateItem',
                            "type": 'post',
                            "dataType": 'json',
                            "data": param,
                            "success": function (data) {
                                if (data.success) {
                                	that.options.delFields = [];
                                	that.trigger('beginEdit', {
                                		templateID: that.options.templateID,
                                		step: 2,
                                		template: param.templateName
                                	})
                                }
                            }
            			});
        			}
        		} else {
        			var param = that.isValid();
            		if(param) {
            			util.api({
            				"url": '/DataReporting/AddTemplate',
                            "type": 'post',
                            "dataType": 'json',
                            "data": param,
                            "success": function (data) {
                                if (data.success) {
                                	that.options.templateID = data.value;
                                	that.trigger('beginEdit', {
                                		templateID: that.options.templateID,
                                		step: 2,
                                		template: param.templateName
                                	})
                                }
                            }
            			});
            		}
        		}
        	});
        	//取消
        	$('.report-btn-reset', this.element).bind('click', function(){
        		that.trigger('cancelCreate', {
        			step: 1
        		});
        		that.reset();
        	});
        },
        /**
         * 判断输入是否合法
         */
        isValid: function(){
        	var $tplName = $('.name-ipt', this.element),
        		$fields = $('.options-field-ctner', this.element);
			if(!$.trim($tplName.val())) {
				util.alert('请填写报表名称。');
				return false;
			}
			var templateItems = [];
			for(var i=0,len=$fields.length; i<len; i++) {
				var fieldName = $.trim($($fields[i]).find('.field-ipt').val());
				if(!fieldName) {
					util.alert('列名称不能为空。');
					return false;
				}
				templateItems.push({
					value: fieldName,
					value1: util.mnGetter($($fields[i]).find('.mn-select-box')),
					value2: $($fields[i]).find('.btn-del').attr('data-id') || 0
				});
			}
			var arrRepeat = this.hasRepeat();
			if(arrRepeat.length) {
				util.alert('列名称' + arrRepeat.join('、') + '存在重复。');
				return false;
			}
			return {
				templateName: $.trim($tplName.val()),
				templateItems: templateItems
			};
        },
        /**
         * 检查是否有重复项
         */
        hasRepeat: function(){
        	var $fieldsCtner = $('.options-fields-ctner', this.element),
        		$ipts = $fieldsCtner.find('.field-ipt'),
        		$item,
        		name,
        		arr = [],
        		result = [];
        	for(var i=0,len=$ipts.length; i<len; i++){
        		$item = $($ipts[i]);
        		name = $.trim($item.val());
        		if(name) {
            		$item.val(name);
        			if($.inArray(name, arr) >= 0 && $.inArray('“' + name + '”', result) < 0) {
        				result.push('“' + name + '”');
            		}
        			arr.push(name);
        		}
        	}
    		return result;
        },
        render: function(){
        	this.element.prepend(this.template);
//        	util.placeholder($('.name-ipt', this.element));
        },
        /**
         * 渲染一列
         */
        renderRow: function(opts){
        	var that = this,
        		$target = opts && opts.target,
        		fieldName = opts && opts.value && opts.value.value || '',
        		selected = opts && opts.value && opts.value.value1 || 1,
        		dataid = opts && opts.value && opts.value.value2 || '',
        		tplField = _.template($(tplhtml).filter('.filed-row-tpl').html()),
        		fieldsCtner = $('.options-fields-ctner', this.element),
        		selectData = [
        		    {
	        			text: '整数',
	        			value: 1,
	        			defaultSelected: selected==1,
	        			selected: selected==1
	        		},{
	        			text: '小数',
	        			value: 2,
	        			defaultSelected: selected==2,
	        			selected: selected==2
	        		},
	        		{
	        			text: '文本',
	        			value: 3,
	        			defaultSelected: selected==3,
	        			selected: selected==3
	        		}
        		];
        	if($target) {
        		$target.after(tplField);
        		$target.next().find('.field-ipt').val(fieldName);
        		var $selector = $target.next().find('.mn-select-box');
        		util.mnSelect($selector,'syncModel', selectData);
        		util.mnSetter($selector, selected);
        		util.mnEvent($selector, 'change', function(){
        			that.updateRows();
        		});
        		if(fieldName) {
        			util.mnDisable($selector);
        		}
        		if(dataid) {
        			$target.next().find('.btn-del').attr('data-id', dataid);
        		}
        		return $target.next();
        	} else {
        		fieldsCtner.append(tplField);
        		fieldsCtner.find('.field-ipt').last().val(fieldName);
        		var $selector = fieldsCtner.find('.mn-select-box').last();
            	util.mnSelect($selector, 'syncModel', selectData);
            	util.mnSetter($selector, selected);
            	util.mnEvent($selector, 'change', function(){
            		that.updateRows();
        		});
            	if(fieldName) {
            		util.mnDisable($selector);
            	}
            	if(dataid) {
            		fieldsCtner.find('.btn-del').last().attr('data-id', dataid);
        		}
            	return fieldsCtner.find('.options-field-ctner').last();
        	}
        },
        /**
         * 渲染预览列表
         */
        updateRows: function(){
        	var $fieldsCtner = $('.options-fields-ctner', this.element),
        		$fields = $fieldsCtner.find('.options-field-ctner'),
        		$table = $('.preview-table', this.element),
        		$thead = $table.find('thead tr'),
        		$tbody = $table.find('tbody tr'),
        		$item,
        		count = $fields.length + 2,
        		width = ($('.options-preview-ctner', this.element).width()-2)/count,
        		vtype = 1;
        	width = (width > 145 ? (width-22) : 145) + 'px';
        	$thead.html('<th style="width:' + width + ';min-width:' + width + ';max-width:' + width + ';">序号</th><th style="width:' + width + ';min-width:' + width + ';max-width:' + width + ';">层级</th>');
        	$tbody.html('<td>1</td><td>--</td>');
        	$.each($fields, function(idx, item){
        		$item = $(item);
        		$item.find('.lbl-name').text('列名称' + (idx+1) + ':');
        		$item.attr('data-idx', idx);
        		$thead.append('<th style="width:' + width + ';min-width:' + width + ';max-width:' + width + ';">' + ($.trim($item.find('.field-ipt').val())||$item.find('.lbl-name').text().replace(':','')) + '</th>');
        		vtype = util.mnGetter($item.find('.mn-select-box'));
        		$tbody.append('<td ' + (idx==$fields.length-1 ? 'class="last"' : '') + '>' + (vtype==3?'文本':(vtype==2?'小数':'整数')) + '</td>');
        	});
        	if($fields.length<=1) {
        		$fieldsCtner.find('.btn-del').addClass('btn-disabled');
        	} else {
        		$fieldsCtner.find('.btn-del').removeClass('btn-disabled');
        	}
        	if($fields.length>=20) {
        		$fieldsCtner.find('.btn-add').addClass('btn-disabled');
        	} else {
        		$fieldsCtner.find('.btn-add').removeClass('btn-disabled');
        	}
        }
    });
    module.exports = SettingOptions;
});