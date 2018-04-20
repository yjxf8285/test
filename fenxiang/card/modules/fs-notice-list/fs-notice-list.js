/**
 * 系统通知列表
 *
 * 遵循seajs module规范
 * @author Liuxf
 */

define(function(require, exports, module) {
	var root = window,
		FS = root.FS,
		tpl = FS.tpl;

	/* 引用文件 */
	var util = require('util'); //工具箱
	var Pagination = require('uilibs/pagination'); //分页组件
	var moment = require('moment'); //时间组件
	var noticeListTpl = require('./fs-notice-list.html');
	var noticeListtyle = require('./fs-notice-list.css');
	var feedHelper = require('modules/feed-list/feed-list-helper');
    //设置预览组件
    var AttachPreview = require('modules/fs-attach/fs-attach-preview');
    var attachPreviewer = new AttachPreview().render(); //fs预览组件实例
//    attachPreviewer.set("belongToType","notice");
	/* 定义组件 */
	var formatPics = feedHelper.picturesFormat; //拼图片
	var contactData = util.getContactData(),
		currentUserData = contactData["u"]; //自己
	/* 公共声明 */
	noticeListTpl = $(noticeListTpl);

	/**
	 * 系统通知列表MVC定义
	 * @param opts
	 * @constructor
	 */
	var NoticeListM = Backbone.Model.extend({});
	var NoticeListC = Backbone.Collection.extend({
		model: NoticeListM,
		// url:'/attach_html/getImgImgFilesOfIReceive',
		sync: function(method, model, options) {
			var data = options.data || {};
			options.data = _.extend({
				"pageSize": 10,
				"pageNumber": 1
			}, data);
			Backbone.sync('read', model, options);
		},
		parse: function(responseData) {
			/* 预处理 */
			var items = responseData.value.notices;
			if (responseData.success) {

				_.each(items, function(item) {
					// 拼数据
					var noticeType = item.noticeType; //1、系统通知，2、系统回复
					var noticeTypeDesc = item.noticeTypeDesc; //大标题
					var title = item.title; //副标题
					var noticeContent = item.noticeContent; //内容
					var noticeTime = item.noticeTime; //发布时间
					var isNew = item.isNew; //是否是新的
					var pasths = item.pasths || []; //附件们
					var picN = pasths.length;
					var	attachPath='';
					var	newico='';
                    var feedPic='';
                    var surplusN;
                    var moreLinkStr;
                    var pictureStr = '';
                    var firstPic = pasths[0];
					noticeTime = moment.unix(noticeTime).format('MMMDD日 HH:mm'); //格式化时间
					/*if (picN > 0) {
						attachPath = pasths[0].attachPath; //图片地址
						feedPic = '<div class="feed-img"><div class="img-warp"><table><tr><td valign="middle" align="center"><img src="' + FS.API_PATH + '/df/GetGlobal/?id=' + attachPath + '3.jpg"/></td></tr></table></div></div>';
						if (picN > 1) {
							feedPic = '<div class="feedpics-bor feed-img"><div class="fpt-group"><div class="img-warp" style="position: absolute;"><table><tr><td valign="middle" align="center"><img src="' + FS.API_PATH + '/df/GetGlobal/?id=' + attachPath + '3.jpg" alt=""/></td></tr></table></div></div></div><p class="pic-num">图集(共' + picN + '张)</p>'
						}
					}*/

                    surplusN = picN - 9;
                    moreLinkStr = '<div class="img-num"><div class="feed-img-item more-link">更多' + surplusN + '张</div></div>';
                    if (picN == 0) {
                        feedPic = '';
                    }
                    if (picN == 1) {
                        attachPath = pasths[0].attachPath; //图片地址
                        feedPic = '<div class="feed-img-only"><div class="img-num"><img class="feed-img-item" src="' + FS.API_PATH + '/df/GetGlobal/?id=' + attachPath + '3.jpg"/></div></div>';
                    }


                    if (picN > 1 && picN <= 10) {
                        _.each(pasths, function (pasth) {

                            pictureStr += '<div class="img-warp img-num"><img class="feed-img-item" src="' + FS.API_PATH + '/df/GetGlobal/?id=' + pasth.attachPath + '3.jpg"/></div>';
                        });
                        feedPic = '<div class="feed-img-many fn-clear">' + pictureStr + '</div>';
                    }
                    if (picN > 10) {
                        for (var i = 0; i <= 8; i++) {
                            pictureStr += '<div class="img-warp img-num"><img class="feed-img-item" src="' + FS.API_PATH + '/df/GetGlobal/?id=' +pasth[i].attachPath + '3.jpg"/></div>';
                        }
                        feedPic = '<div class="feed-img-many fn-clear">' + pictureStr + moreLinkStr + '</div>';
                    }

					// 输出
					if (noticeType == 2) {
						noticeType = 'notice-re';
					} else {
						noticeType = '';
					}
					if(isNew){
						newico='<div class="img-new"></div>';
					}
					_.extend(item, {
						"noticeType": noticeType,
						"noticeTypeDesc": noticeTypeDesc,
						"noticeTime": noticeTime,
						"title": title,
						"feedPic": feedPic,
						"newico": newico,
						"noticeContent": noticeContent
					});

				});
			} else {
				items = [];
			}
			return items;
		}
	});
	var NoticeListV = Backbone.View.extend({
		tagName: "div",
		className: "fs-notice-list-item",
        events: {
            "click .item-media .img-num": "_previewImg" //预览图片
        },
		initialize: function() {
			var templatepath = noticeListTpl.filter('.fs-notice-list-tpl').html(); //系统通知列表的模板
			this.template = _.template(templatepath);
			this.listenTo(this.model, "change", this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
        _previewImg: function(evt) {
            var model = this.model,
                pictures = model.get("pasths"),
                previewData = [];
            var currentItemEl = $(evt.currentTarget),
                index = currentItemEl.index();
            _.each(pictures, function(picture, i) {
                previewData[i] = {
                    "refId": 'noid',
                    "attachPath": picture.attachPath,
                    "previewPath": picture.attachPath+'2',
                    "originPath": picture.attachPath+'1',
                    "thumbPath": picture.attachPath+'3',
                    "createTime": picture.createTime,
                    "fileName": '系统通知.jpg',
                    "fileSize": picture.attachSize
                };
            });
            attachPreviewer.preview({
                "type": "img",
                "data": previewData,
                "refId": 'noid',
                "belongToType": "notice",
                "activeIndex": index
            });
        }
	});

	/**
	 * 系统通知列表定义
	 * @param opts
	 * @constructor
	 */
	var NoticeList = function(opts) {
		opts = _.extend({
			"element": null, //list selector
			"pagSelector": null, //pagination selector
			"pagOpts": { //分页配置项
				"pageSize": 15,
				"visiblePageNums": 7
			},
			"listPath": "/attach_html/getAttachImgFilesOfIReceive", //默认附件列表请求地址为我收到的附件列表地址
			"defaultRequestData": {}, //默认请求数据
			"searchOpts": {
				"inputSelector": null, //搜索输入框
				"btnSelector": null //搜索按钮
			},
			"listCb": FS.EMPTY_FN, //list请求后的回调
			"listEmptyText": "暂无记录" //列表记录为空的文字提示
		}, opts || {});
		this.opts = opts;
		this.element = $(opts.element);
		this.pagEl = $(opts.pagSelector);
		this.pagination = null; //分页组件
		this.tempRequestData = {}; //通过load或者reload覆盖的请求数据
		this.init();
	};

	_.extend(NoticeList.prototype, {
		"init": function() {
			var that = this,
				opts = this.opts;
			var elEl = this.element;
			var list;
			elEl.addClass('fs-notice-list');
			//设置list collection
			list = new NoticeListC();
			//监听collection add事件
			list.on('add', function(m, c, opts) {
				var itemV;
				itemV = new NoticeListV({
					"model": m
				}).render();
				itemV.$el.data('itemV', itemV).appendTo(elEl);
			});
			this.list = list;

			// 初始化分页组件
			this.pagination = new Pagination(_.extend({
				"element": this.pagEl
			}, opts.pagOpts));
			this.pagination.on('page', function(pageNumber) {
				//清空列表
				that.empty();
				//请求数据
				that.fetch();
			});
			//渲染分页组件
			this.pagination.render();
			//搜索返回bar初始化
			/*if (opts.searchOpts && opts.searchOpts.inputSelector) {
				// this._searchBarInit();
			}*/
			//初始化列表结果空白提示
			this._initListEmptyTip();
		},
		/**
		 * 搜索条初始化，显示查询总信息和返回按钮
		 * @private
		 */
		_searchBarInit: function() {
			var that = this,
				opts = this.opts,
				searchOpts = opts.searchOpts;
			var elEl = this.element,
				searchInputEl = $(searchOpts.inputSelector), //搜索输入框
				searchBtnEl = $(searchOpts.btnSelector), //搜索按钮
				barEl;
			barEl = $('<div class="list-search-bar fn-clear"></div>');
			barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
			barEl.hide().prependTo(elEl);
			//创建快速关闭按钮
			var searchEmptyEl = $('<span class="empty-h">&#10005;</span>'),
				searchInputWEl = $('<span class="list-search-input-wrapper"></span>');
			searchInputEl.wrap(searchInputWEl);
			searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
			searchEmptyEl.hide().appendTo(searchInputWEl);

			//搜索输入框enter提交事件注册和快速清空按钮
			searchInputEl.keydown(function(evt) {
				if (evt.keyCode == 13) { //监听回车按键
					searchBtnEl.click();
				}
			}).keyup(function() {
				var val = _.str.trim($(this).val());
				if (val.length > 0) {
					searchEmptyEl.show();
					searchInputEl.addClass('with-input-value');
				} else {
					searchEmptyEl.hide();
					searchInputEl.removeClass('with-input-value');
				}
			});
			searchEmptyEl.click(function() {
				searchInputEl.val("");
				searchInputEl.removeClass('with-input-value');
				searchEmptyEl.hide();
			});
			//点击返回到查看全部列表
			barEl.on('click', '.back-l', function(evt) {
				that.reload({
					"keyword": ""
				});
				//清空搜索输入框
				searchInputEl.val("");
				searchInputEl.removeClass('with-input-value');
				searchEmptyEl.hide();
				evt.preventDefault();
			});
		},
		/**
		 * 更新搜索条显隐状态
		 * @private
		 */
		_updateSearchBarState: function(requestData, responseData) {
			var elEl = this.element,
				barEl = $('.list-search-bar', elEl),
				numEl = $('.num', barEl);
			if (!requestData.isFirstChar && requestData.keyword.length > 0) {
				if (responseData.success) {
					numEl.text(responseData.value.totalCount);
					barEl.show();
					return;
				}
			}
			barEl.hide();
			return;
		},
		/**
		 * 初始化list记录为空的tip
		 * @private
		 */
		_initListEmptyTip: function() {
			var elEl = this.element,
				emptyEl = $('<div class="list-empty-tip"></div>');
			var opts = this.opts,
				emptyText = opts.listEmptyText;
			emptyEl.html('<img src="' + FS.BLANK_IMG + '" alt="loading" class="icon-empty" />&nbsp;&nbsp;<span class="empty-text">' + emptyText + '</span>');
			emptyEl.appendTo(elEl);
		},
		/**
		 * 列表结果记录集为空的提示状态
		 * @private
		 */
		_updatelistStatus: function(responseData) {
			var elEl = this.element,
				emptyEl = $('.list-empty-tip', elEl);
			var totalCount;
			if (responseData.success) {
				totalCount = responseData.value.totalCount;
				if (totalCount == 0) { //列表结果为空，提示空提示信息
					emptyEl.show();
				} else {
					emptyEl.hide();
				}
			}
		},
		/**
		 *
		 * @param config
		 */
		fetch: function() {
			var that = this;
			var opts = this.opts;
			var list = this.list;
			var pagination = this.pagination;
			var requestData = _.extend({
				"pageSize": pagination.get('pageSize'),
				"pageNumber": pagination.get('activePageNumber')
			});
			// var requestData = _.extend({
			// 	"pageSize": 10,
			// 	"pageNumber": 1,
			// 	"sinceID": 0,
			// 	"maxID": 0
			// });
			// 加入默认request数据
			if (_.isFunction(opts.defaultRequestData)) {
				requestData = _.extend(opts.defaultRequestData(), requestData);
			} else {
				requestData = _.extend(opts.defaultRequestData, requestData);
			}
			//加入load或者reload传过来的request数据
			requestData = _.extend(requestData, this.tempRequestData);
			this.tempRequestData = {}; //用完重置为空
			// 打开loading提示
			this.showLoading();
			this.list.fetch({
				"url": opts.listPath,
				"data": requestData,
				"success": function(c, responseData) {
					var dataRoot;
					if (responseData.success) {

						dataRoot = responseData.value;
						//设置分页总记录数
						//if(pagination.get('totalSize')==-1){
						pagination.setTotalSize(dataRoot.totalCount);
						//}
						//更新提示搜索信息
						// that._updateSearchBarState(requestData, responseData);
						//更新列表记录状态
						that._updatelistStatus(responseData);
						//参数回调
						opts.listCb.call(that, responseData);
						//关闭loading提示
						that.hideLoading();
					}
				}
			});
		},
		"showLoading": function() {
			var loading = this.loading,
				elEl = this.element,
				loadingEl = $('.list-loading', elEl);
			//第一次show之前render出来
			if (loadingEl.length == 0) {
				loadingEl = $('<div class="list-loading"></div>');
				loadingEl.prependTo(elEl);
				loadingEl.html('<span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
				/*loading = new Spin({
                    "color": "#0082CB",
                    "length": 5, // The length of each line
                    "width": 2,
                    "radius": 3,
                    "top": 5
                }).spin($('.icon-loading', loadingEl).get(0));*/
				//设置实例引用
				this.loading = loading;
			}
			loadingEl.show();
		},
		"hideLoading": function() {
			var elEl = this.element,
				loadingEl = $('.list-loading', elEl);
			loadingEl.hide();
		},
		/**
		 * 加载第一页
		 */
		"load": function(requestData) {
			this.tempRequestData = requestData;
			this.pagination.jump(1);
		},
		"reload": function(requestData) {
			this.load(requestData);
		},
		"empty": function() {
			var elEl = this.element,
				itemEl = $('.fs-notice-list-item', elEl);
			itemEl.each(function() {
				var meEl = $(this),
					itemV = meEl.data('itemV');
				//清除itemV
				itemV.remove();
				meEl.removeData(); //清空所有data数据
			});
			elEl.empty();
		},
		"destroy": function() {
			//清空list
			this.list = null;
			this.pagination.destroy();
			//移除loading实例
			this.loading && this.loading.stop();
			this.empty();
			//取消pagination绑定
			this.pagination = null;
			this.tempRequestData = {};
			this.element = null;
		}
	});
	module.exports = NoticeList;
});