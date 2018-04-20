/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
	var root = window;
	var FS = root.FS;
	var tpl = FS.tpl;
	var util = require('util');
	var json = require('json');
    var Pagination = require('uilibs/pagination');
	var formatImportData = function(originData) {
		var importEmployeePropertys = originData.importEmployeePropertys;
		var results = [];
		_.each(importEmployeePropertys, function(cellData) {
			var rowData = results[cellData.rowNo - 1] || {},
				itemData = rowData[cellData.fieldName] || {};
			itemData.value = cellData.fieldValue;
			itemData.isError = cellData.isError;
			itemData.errorMessage = cellData.errorMessage || "";
			//重设回数据引用
			rowData[cellData.fieldName] = itemData;
            rowData["Index"] = cellData.rowNo;
			results[cellData.rowNo - 1] = rowData;
		});
		return results;
	};
	exports.init = function() {
		var originData=util.getTplStore('departmentstaff','importData'),
            importData=formatImportData(originData);

		var tplName = exports.tplName;
		var tplEl = exports.tplEl;
		/**
		 * 批量导入员工后的编辑页面
		 * @param {object} opts
		 */
		var ImportEmployeesEditor = function(opts) {
			opts = $.extend({
				"element": tplEl //容器是JQ对象
			}, opts || {});
			this.opts = opts;
			this.element = opts.element;
			this.init(); //初始化
		};
		$.extend(ImportEmployeesEditor.prototype, {
			init: function() {
				var elEl = this.element;
				var opts = this.opts;
				$('body').append('<div class="errtip">该昵称已经被系统内的其他员工使用</div>');
				//this.fetch(); //渲染表格
				this.bindEvents(); //事件绑定
				//this.trOdd(); //tr隔行变色
				//this.showErr(); //显示错误的单元
			},
			showErr: function(originData) {
				var elEl = this.element;
				var tbodyEl = $('.importemployeeseditor-table tbody', elEl);
				var trEl = $('.importemployeeseditor-table tbody tr', elEl);
				var tabletitEl = $('.importemployeeseditor-tabletit', elEl);
				var dataInputEl = $('.data-input', tbodyEl);
				var errNum = 0; //共有多少个错误

				dataInputEl.each(function(index, el) {
					var errorMessage = $(this).data('errormessage');
					if (errorMessage) {
						$(this).addClass('err');
						$(this).closest('tr').addClass('errrow');
						errNum++;
					}
				});
				trEl.each(function(index, el) {
					var err = $(this).is('.errrow');
					if (!err) {
						$(this).addClass('rightrow');
					}
				});
				var RowNum = trEl.length;
				var errRowNum = $('tr.errrow', tbodyEl).length;
                var employees=originData.employees,
                    errorRowNum= 0,
                    errorNum=0;
                _.each(employees,function(itemData){
                    if(itemData.errorCount>0){
                        errorRowNum++;
                        errorNum+=itemData.errorCount;
                    }
                });
				tabletitEl.html('<span class="tit">批量导入员工</span><span class="info">（共有数据<b class="green">'+employees.length+'</b>行，其中错误数据<b>'+errorRowNum+'</b>行，共有<b>'+errorNum+'</b>个错误）</span>');

			},
			trOdd: function() {
				var elEl = this.element;
				var trEl = $('.importemployeeseditor-table tbody tr', elEl);
				trEl.each(function(i) {
					if (i % 2) {
						$(this).addClass('odd');
					}
				});
			},
			bindEvents: function() {
				var elEl = this.element;
				var that = this;
				elEl.on('click', '.importemployeeseditor-table tr', function() {
					$('.importemployeeseditor-table tr', elEl).removeClass('cur');
					$(this).addClass('cur');
				});
				elEl.on('focus', '.importemployeeseditor-table .data-input', function() {
					$(this).addClass('cur');
				});
				elEl.on('blur', '.importemployeeseditor-table .data-input', function() {
					$(this).removeClass('cur');
				});
				elEl.on('mouseenter', '.importemployeeseditor-table .data-input.err', function() {
					var meEl = $(this);
					var errorMessage = meEl.data('errormessage');
					var width = meEl.width() + 10;
					var offset = meEl.offset();
					var errtipEl = $('.errtip');
					errtipEl.css({
						top: offset.top,
						left: offset.left + width
					}).text(errorMessage).show();
				});
				elEl.on('mouseout', '.importemployeeseditor-table .data-input.err', function() {
					var errtipEl = $('.errtip');
					errtipEl.hide();
				});
				elEl.on('click', '.j-submit', function() {
					that.importEmployeesForUpdatePropertys($(this));
				});
			},
			/**
			 * 属性更新后批量导入用户
			 */

			importEmployeesForUpdatePropertys: function(meEl) {
				var elEl = this.element;
				var that = this;
				var isSendSMSEl = $('#importemployeeseditor-labelid-1', elEl);
				var isSendSMS = isSendSMSEl.is(':checked');
				var tbodyEl = $('.importemployeeseditor-table tbody', elEl);
				var trEl = $('.importemployeeseditor-table tbody tr', elEl);
				var dataInputEl = $('.data-input', tbodyEl);
				var isRightEl = $('#importemployeeseditor-labelid-0', elEl);
				var isRight = isRightEl.is(':checked');
				var rightTrEl = $('tr.rightrow', tbodyEl); //正确数据的行
				var jsonObj = [];
				var jsonString = "";
				if (isRight) {
					if (rightTrEl.length == 0) {
						util.alert('没有正确的数据，不能提交');
						return false;
					} else {

						_.each($('.data-input', rightTrEl), function(data) {
							var data = $(data);
							var A = data.data('a');
							var B = data.data('b');
							var C = data.val();
							jsonObj.push({
								"A": A,
								"B": B,
								"C": C
							});
						});
					}
					jsonString = json.stringify(jsonObj); //转成josn格式
					var oData = {
						"jsonString": jsonString,
						"isSendSMS": isSendSMS
					};
					util.api({
						"url": '/Management/ImportEmployeesForUpdatePropertys',
						"type": 'post',
						"dataType": 'json',
						"data": oData,
						beforeSend: function() {},
						"success": function(responseData) {
                            var dataRoot;
							if (responseData.success) {
                                util.showSucessTip('导入成功');
                                dataRoot=responseData.value;
                                //如果返回数据为空，返回部门与员工页
                                if(dataRoot.importEmployeePropertys.length==0){
                                    tpl.navRouter.navigate('#departmentstaff', {
                                        trigger: true
                                    });
                                    return;
                                }
                                //更新数据源
                                importData=formatImportData(dataRoot);
                                originData=dataRoot;
                                //设置分页数据
                                pagination.setTotalSize(importData.length);
                                that.fetch(importData.slice(0,pageSize),dataRoot);
							}
						}
					}, {
						"submitSelector": meEl
					});
				} else {
					_.each(dataInputEl, function(data) {
						var data = $(data);
						var A = data.data('a');
						var B = data.data('b');
						var C = data.val();
						jsonObj.push({
							"A": A,
							"B": B,
							"C": C
						});
					});
					jsonString = json.stringify(jsonObj); //转成josn格式
					var oData = {
						"jsonString": jsonString,
						"isSendSMS": isSendSMS
					};
					util.api({
						"url": '/Management/ImportEmployeesForUpdatePropertys',
						"type": 'post',
						"dataType": 'json',
						"data": oData,
						beforeSend: function() {},
						"success": function(responseData) {
                            var dataRoot;
							if (responseData.success) {
                                util.showSucessTip('导入成功');
                                dataRoot=responseData.value;
                                //如果返回数据为空，返回部门与员工页
                                if(dataRoot.importEmployeePropertys.length==0){
                                    tpl.navRouter.navigate('#departmentstaff', {
                                        trigger: true
                                    });
                                    return;
                                }
                                //更新数据源
                                importData=formatImportData(dataRoot);
                                originData=dataRoot;
                                //设置分页数据
                                pagination.setTotalSize(importData.length);
                                that.fetch(importData.slice(0,pageSize),dataRoot);
							}
						}
					}, {
						"submitSelector": meEl
					});
				}



			},
            fetch: function(readyDatas,originData) {
                var that=this;
				var elEl = this.element;
				var tbodyEl = $('.importemployeeseditor-table tbody', elEl);
				var trStr = '';
				_.each(readyDatas, function(readyData, index) {
					var rowNo = readyData.Index;
					var Account = readyData.Account.value;
					var AccounterrorMessage = readyData.Account.errorMessage;

					var Department = readyData.Department.value;
					var DepartmenterrorMessage = readyData.Department.errorMessage;

					var Email = readyData.Email.value;
					var EmailerrorMessage = readyData.Email.errorMessage;

					var FullName = readyData.FullName.value;
					var FullNameerrorMessage = readyData.FullName.errorMessage;

					var Mobile = readyData.Mobile.value;
					var MobileerrorMessage = readyData.Mobile.errorMessage;

					var Name = readyData.Name.value;
					var NameerrorMessage = readyData.Name.errorMessage;

					var Password = readyData.Password.value;
					var PassworderrorMessage = readyData.Password.errorMessage;

					var Post = readyData.Post.value;
					var PosterrorMessage = readyData.Post.errorMessage;

					trStr += '<tr> <td>' + rowNo + '</td> <td><input type="text" class="data-input" value="' + FullName + '" title="' + FullName + '" data-a="FullName" data-errormessage="' + FullNameerrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Name + '" title="' + Name + '" data-a="Name" data-errormessage="' + NameerrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Account + '" title="' + Account + '" data-a="Account" data-errormessage="' + AccounterrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Password + '" title="' + Password + '" data-a="Password" data-errormessage="' + PassworderrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Mobile + '" title="' + Mobile + '" data-a="Mobile" data-errormessage="' + MobileerrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Department + '" title="' + Department + '" data-a="Department" data-errormessage="' + DepartmenterrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Email + '" title="' + Email + '" data-a="Email" data-errormessage="' + EmailerrorMessage + '" data-b="' + rowNo + '"></td> <td><input type="text" class="data-input" value="' + Post + '" title="' + Post + '" data-a="Post" data-errormessage="' + PosterrorMessage + '" data-b="' + rowNo + '"></td> </tr>';

				});

				tbodyEl.html(trStr);
                that.trOdd();
                that.showErr(originData);
			},
			destroy: function() {
				//this.xxx = null;
			}
		});
        var pageSize=1000;
		var editor=new ImportEmployeesEditor();

        var pagination=new Pagination({
            "element":$('.pagination-box',tplEl),
            "pageSize":pageSize
        });
        pagination.render();
        pagination.setTotalSize(importData.length);
        //加载数据
        editor.fetch(importData.slice(0,pageSize),originData);

        pagination.on('page',function(pageNumber){
            //跳页后刷新
            var startRecordIndex=(pageNumber-1)*pageSize,
                endRecordIndex=startRecordIndex+pageSize;
            editor.fetch(importData.slice(startRecordIndex,endRecordIndex),originData);
        });
        //返回键
        $('.return-back-btn',tplEl).on('click',function(){
            tpl.navRouter.navigate('#departmentstaff/=/enter-import', {
                trigger: true
            });
        });
	};
});