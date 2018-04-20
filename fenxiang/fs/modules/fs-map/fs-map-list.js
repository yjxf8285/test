/**
 * 我的赞列表
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
	var maplistTpl = require('./fs-map-list.html');
	var maplistStyle = require('./fs-map-list.css');
	var Dialog = require('dialog');
    var feedV = require('modules/feed-list/feed-list-v'),
        feedM = require('modules/feed-list/feed-list-m'),
        feedC = require('modules/feed-list/feed-list-c');

	var contactData = util.getContactData(),
		currentUserData = contactData["u"]; //自己
	/* 公共声明 */
    var maplistTpl = $(maplistTpl);

    var FeedItemV = feedV.itemV,
        FeedItemM = feedM.itemM,
        FeedListC = feedC.listC;
    var tempFeedListC = new FeedListC(); //用于格式化数据

	/**
	 * 弹出框组
	 */

	var MapShowDetailDialog = Dialog.extend({ //新建或修改目录功能
		"attrs": {
			width: 570,
            height:420,
			content: maplistTpl.filter('.map-showdetail-dialog-templet').html(),
			className: 'common-style-richard map-showdetail-dialog',
			webDisk: null,
            feedId:0,
            zIndex:99
		},
		"events": {

		},
		"render": function() {
            var result = MapShowDetailDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
			return result;
		},
		"hide": function() {
			var result = MapShowDetailDialog.superclass.hide.apply(this, arguments);
			this._clear();
			return result;
		},
		"show": function() {
			var result = MapShowDetailDialog.superclass.show.apply(this, arguments);
			return result;
		},
		"_clear": function() {

		},
        "_onRenderFeedId":function(feedId){
            var that=this;
            var elEl=this.element,
                feedWEl=$('.feed-wrapper',elEl);
            if (feedId != 0) {
                this.feedV&&this.feedV.destroy();
                util.api({
                    "url": "/Feed/GetFeedByFeedID",
                    "data": {
                        "feedID": feedId
                    },
                    "type": "get",
                    "success": function(responseData) {
                        var feedItemData;
                        if (responseData.success) {
                            feedItemData = tempFeedListC.parse(responseData);
                            feedV = new FeedItemV({
                                "model": new FeedItemM(feedItemData[0]),
                                "replyListOpts": { //回复列表配置参数
                                    "listPath": "/Feed/GetFeedReplysByFeedID", //请求回复列表地址
                                    "withPagination": true, //带分页
                                    "activePageNumber": 1
                                },
                                "replyWithMedia":true,   //带多媒体功能
                                "withShowBoteFeed": false, //是否显示投票详情
                                "withAvatar":false,  //不显示头像
                                "detailStyle":1 //审批下区分两种模式，正常为1,2为打印模式
                            }).render();
                            feedV.$el.appendTo(feedWEl);
                            //默认打开回复列表
                            $('.aj-Reply', feedV.$el).click();
                            //创建feedV引用
                            that.feedV=feedV;
                            //重新定位居中
                            that.show();
                        }
                    }
                });
            }
        },
        "destroy":function(){
            var result;
            this.feedV&&this.feedV.destroy();
            result = MapShowDetailDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
	});
	var mapShowDetailDialog = new MapShowDetailDialog();
	/**
	 * 我的赞列表MVC定义
	 * @param opts
	 * @constructor
	 */
	var MaplistM = Backbone.Model.extend({});
	var MaplistC = Backbone.Collection.extend({
		model: MaplistM,
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
            var newItems=[];
			var locations;
			if (responseData.success) {
                locations = responseData.value.locations;
				_.each(locations, function(item, n) {
					var slocation = item.country + item.province + item.city + item.district + item.street + item.streetNumber;
					var createTime = util.getDateSummaryDesc(moment.unix(item.createTime), moment.unix(responseData.serviceTime), 2); //时间
					var listNum = n + 1;
					var slocation = slocation;
                    newItems.push(_.extend({},item,{
                        "createTime":createTime,
                        "listNum":listNum,
                        "slocation":slocation
                    }));
				});
			}
			return newItems;
		}
	});
	var MaplistV = Backbone.View.extend({
		tagName: "div",
		className: "fs-maplist-item",
		events: {
			"click": "setCur", //点击添加cur样式
			"click .map-showdetail": "mapShowDetail" //点击详情弹出框
		},
		"mapShowDetail": function(events) {
			var that = this;
			var meEl = $(events.currentTarget);
            if(!mapShowDetailDialog.rendered){
                mapShowDetailDialog.render();
            }
            mapShowDetailDialog.set('feedId',this.model.get('feedID'));
			mapShowDetailDialog.show();
            return false;
		},
        "setCur": function (e) {
            var opts=this.options;
            var oMeEl = this.$el;
            var bElCur = oMeEl.hasClass('cur');
            $('.fs-maplist-item').removeClass('cur');
            if (!bElCur) {
                oMeEl.addClass('cur');
                opts.selectCb&&opts.selectCb.call(this,this.model.toJSON());
            }
        },
		initialize: function() {
			var templatepath = maplistTpl.filter('.fs-maplist-receive-item-tpl').html(); //收到赞的模板
			this.template = _.template(templatepath);
			this.listenTo(this.model, "change", this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	/**
	 * 员工列表定义
	 * @param opts
	 * @constructor
	 */
	var Maplist = function(opts) {
		opts = _.extend({
			"element": null, //list selector
			"pagSelector": null, //pagination selector
			"pagOpts": { //分页配置项
				"pageSize": 20,
				"visiblePageNums": 7
			},
			"oData": null,
			"listPath": "/attach_html/getAttachImgFilesOfIReceive", //默认附件列表请求地址为我收到的附件列表地址
			"defaultRequestData": {}, //默认请求数据
			"searchOpts": {
				"inputSelector": null, //搜索输入框
				"btnSelector": null //搜索按钮
			},
			"listCb": FS.EMPTY_FN, //list请求后的回调
			"listEmptyText": "暂无记录", //列表记录为空的文字提示
            "selectCb":FS.EMPTY_FN
		}, opts || {});
		this.opts = opts;
		this.element = $(opts.element);
		this.pagEl = $(opts.pagSelector);
		this.pagination = null; //分页组件
		this.tempRequestData = {}; //通过load或者reload覆盖的请求数据
		this.init();
	};

	_.extend(Maplist.prototype, {
		"init": function() {
			var that = this,
				opts = this.opts;
			var elEl = this.element,
                listEl;
			var list;
            elEl.html('<div class="fs-maplist-inner"></div>');
            listEl = $('.fs-maplist-inner', elEl);
			//设置list collection
			list = new MaplistC();
			//监听collection add事件
			list.on('add', function(m, c) {
				var itemV;
				itemV = new MaplistV({
					"model": m,
                    "selectCb":opts.selectCb
				}).render();
				itemV.$el.data('itemV', itemV).appendTo(listEl);
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
			if (opts.searchOpts && opts.searchOpts.inputSelector) {
				// this._searchBarInit();
			}
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
			var searchEmptyEl = $('<span class="empty-h">x</span>'),
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
				"pageNumber": pagination.get('activePageNumber'),
				"maxID": 0
			}, opts.oData);
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
				itemEl = $('.fs-maplist-item', elEl);
            var listEl = $('.fs-maplist-inner', elEl);
			itemEl.each(function() {
				var meEl = $(this),
					itemV = meEl.data('itemV');
				//清除itemV
				itemV.remove();
				meEl.removeData(); //清空所有data数据
			});
            listEl.empty();
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
	module.exports = Maplist;
});