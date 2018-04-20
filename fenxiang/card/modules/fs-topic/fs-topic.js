/**
 * fs-mytopic 话题
 *
 * 遵循seajs module规范
 * @author liuxf
 */

define(function (require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var mytopicsTpl = require('./fs-topic.html');
    var mytopicsStyle = require('./fs-topic.css');
    var Pagination = require('uilibs/pagination');
    var publish = require('modules/publish/publish');
    var flutil = require('modules/feed-list/fl-util');
    var Dialog = require('dialog');
    var Spin = require('spin');
    var moment = require('moment');
    /* 组件声明 */
    var SelectBar = publish.selectBar, // 选人组件
        AutoInputH = publish.atInput; //自动拉伸textarea组件
    var contactData = util.getContactData(); //选人组件的数据
    var currentUserData = contactData["u"]; //自己

    /* 公共声明 */
    var tplEl = $(mytopicsTpl);

    /**
     * 话题设置
     * @type {*}
     */
    var TopicEditDialog = Dialog.extend({
        "attrs": {
            width: 600,
            className: 'fs-topic-edit-dialog',
            content: tplEl.filter('.fs-topic-edit-tpl').html(),
            defaultSbData: [], //默认SelectBar数据
            topicType: '',
            topicId: 0,
            successCb: FS.EMPTY_FN,
            cancelCb: FS.EMPTY_FN
        },
        "events": {
            "click .f-sub": "_submit",
            "click .f-cancel": "_cancel",
            "click .topic-type": "_clickTopicType"
        },
        "hide": function () {
            var result = TopicEditDialog.superclass.hide.apply(this, arguments);
            //this._clear();
            return result;
        },
        "render": function () {
            var result = TopicEditDialog.superclass.render.apply(this, arguments);
            this._renderCpt();
            return result;
        },
        /**
         *渲染组件x
         */
        "_renderCpt": function () {
            var elEl = this.element,
                rangeEl = $('.range-sb', elEl);
            var rangeSb = new SelectBar({
                "element": rangeEl,
                "data": [
                    {
                        "title": "部门",
                        "type": "g",
                        "list": contactData["g"],
                        "unitSuffix": "个部门"
                    }
                ],
                "acInitData":util.getPublishRange('circle'),
                "title": "选择可查阅该话题的范围",
                "autoCompleteTitle": "请输入姓名或拼音"
            });
            this.sb = rangeSb;
        },
        "getRequestData": function () {
            var elEl = this.element,
                topicTypeEl = $('.topic-type', elEl),
                checkedTypeEl = topicTypeEl.filter(':checked');
            var rangeSb = this.sb;
            var sbData = rangeSb.getSelectedData();

            var requestData = {
                "topicID": this.get('topicId'),
                "isOpen": checkedTypeEl.val() == "1" ? true : false,
                "circleIDs": sbData['g'] || []
            };
            return requestData;
        },
        "isValid": function () {
            var elEl = this.element;
            var rangeSb = this.sb;
            var topicType = this.get('topicType'),
                sbData = rangeSb.getSelectedData();
            if (topicType == "1") { //范围性话题
                if (!sbData["g"]) {
                    $('.input-tip', rangeSb.element).click();
                    return false;
                }
            }
            return true;
        },
        "_clear": function () {

        },
        "_submit": function (evt) {
            var that = this;
            var requestData = this.getRequestData();
            if (this.isValid()) {
                util.api({
                    "data": requestData,
                    "url": "/Topic/SetTopicOpenStatus",
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.get('successCb').apply(that, [responseData, requestData]);
                            that._hasChanged = true;     //表示已经过接口提交改动
                            that.hide();
                        }
                    }
                });
            }
            evt.stopPropagation();
        },
        "_cancel": function () {
            this.hide();
            this.get('cancelCb').call(this);
        },
        "_clickTopicType": function (evt) {
            var meEl = $(evt.currentTarget);
            this.set('topicType', meEl.val());
        },
        "_onRenderDefaultSbData": function (val) {
            var rangeSb = this.sb;
            if (val.length > 0) {
                _.each(val, function (circleData) {
                    rangeSb.addItem(circleData);
                });
            } else {
                rangeSb.removeAllItem();
            }

        },
        "_onRenderTopicType": function (val) {
            var elEl = this.element,
                topicTypeEl = $('.topic-type', elEl),
                rangeFieldEl = $('.range-field', elEl);
            topicTypeEl.filter('[value="' + val + '"]').prop('checked', true);
            if (val == "1") {
                rangeFieldEl.show();
            } else {
                rangeFieldEl.hide();
            }
        },
        "destroy": function () {
            var result;
            this.sb && this.sb.destroy();
            result = TopicEditDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    /**
     * 话题描述
     * @type {*}
     */
    var TopicDescDialog = Dialog.extend({
        "attrs": {
            width: 500,
            className: 'fs-topic-desc-dialog',
            content: tplEl.filter('.fs-topic-desc-tpl').html(),
            topicId: 0,
            defaultDesc: "", //默认描述内容
            successCb: FS.EMPTY_FN,
            cancelCb: FS.EMPTY_FN
        },
        "events": {
            "click .f-sub": "_submit",
            "click .f-cancel": "_cancel"
        },
        "hide": function () {
            var result = TopicDescDialog.superclass.hide.apply(this, arguments);
            //this._clear();
            return result;
        },
        "render": function () {
            var result = TopicDescDialog.superclass.render.apply(this, arguments);
            this._renderCpt();
            return result;
        },
        /**
         *渲染组件x
         */
        "_renderCpt": function () {
            var elEl = this.element,
                inputEl = $('.topic-desc-input', elEl);
            var autoInputH = new AutoInputH({
                "element": inputEl
            });
            this.autoInputH = autoInputH;
        },
        "getRequestData": function () {
            var elEl = this.element,
                inputEl = $('.topic-desc-input', elEl);
            var requestData = {
                "topicID": this.get('topicId'),
                "description": _.str.trim(inputEl.val())
            };
            return requestData;
        },
        "isValid": function () {
            var requestData=this.getRequestData();
            if(requestData.description.length>250){
                util.alert('话题描述不能超过250字，目前已超出<em>'+(requestData.description.length-250)+'</em>个字');
                return false;
            }
            return true;
        },
        "_clear": function () {
            var elEl = this.element,
                inputEl = $('.topic-desc-input', elEl);
            inputEl.val("").trigger('autosize.resize');
        },
        "_submit": function () {
            var that = this;
            var requestData = this.getRequestData();
            if (this.isValid()) {
                util.api({
                    "data": requestData,
                    "url": "/Topic/ModifyTopicDescription",
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.get('successCb').apply(that, [responseData, requestData]);
                            that.hide();
                        }
                    }
                });
            }
        },
        "_onRenderDefaultDesc": function (val) {
            var elEl = this.element,
                inputEl = $('.topic-desc-input', elEl);
            inputEl.val(val).trigger('autosize.resize');
        },
        "_cancel": function () {
            this.hide();
            this.get('cancelCb').call(this);
        },
        "destroy": function () {
            var result;
            this.autoInputH && this.autoInputH.destroy();
            result = TopicDescDialog.superclass.destroy.apply(this, arguments);
            return result;
        }
    });
    /**
     * 弹窗功能组(Dialog)
     *
     */

    var SettingDialog = Dialog.extend({ //话题类型设置
        "attrs": {
            width: 580,
            content: tplEl.filter('.fn-setting-dialog-templet').html(),
            className: 'fn-setting-dialog common-style-richard'
        },
        "events": {
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel',
            'click .topictype input': '_labelTab'
        },
        "render": function () {
            var result = SettingDialog.superclass.render.apply(this, arguments); //调用阿拉蕾原始渲染接口
            this._rangeSelectBar();
            return result;
        },
        "_labelTab": function (event) {
            var thisEl = $(event.currentTarget);
            var warpEl = thisEl.closest('.ui-dialog-body');
            var readrangeEl = $('.readrange', warpEl);
            var tabId = thisEl.attr('id');
            if (tabId == 'radio-normal') {
                readrangeEl.hide();
                this.isOpen = false;
            } else {
                readrangeEl.show();
                this.isOpen = true;
            }

        },
        "_rangeSelectBar": function () { //修改审批人加选人组件
            var elEl = this.element;
            var rangeselectbarEl = $('.selectbar', elEl);
            var circles = this.circles;
            var sb = new SelectBar({
                "element": rangeselectbarEl, //容器
                "data": [
                    {
                        "title": "部门", //选项卡标题文字
                        "type": "g", //p是人 g是部门
                        "list": contactData["g"], //数据来源通过contactData获取
                        "unitSuffix": "个部门"
                    }
                ],
                "singleCked": false, //单选吗？
                "title": "选择可查阅该话题的范围", //默认文字内容
                "acInitData":util.getPublishRange('circle'),
                "autoCompleteTitle": "请输入部门名称的拼音"
            });
            this.rangeSelectSb = sb; //保存起来，为了避免多次渲染
        },
        "hide": function () {
            var result = SettingDialog.superclass.hide.apply(this, arguments);
            this._clear();
            return result;
        },
        "show": function () {
            var result = SettingDialog.superclass.show.apply(this, arguments);
            var elEl = this.element;
            var topictypeEl = $('.topictype', elEl);
            var readrangeEl = $('.readrange', elEl);
            var circles = this.circles;
            var sb = this.rangeSelectSb;
            if (circles.length <= 0) {
                $('input[id="radio-normal"]', topictypeEl).prop("checked", 'true');
                readrangeEl.hide();
            } else {
                $('input[id="radio-range"]', topictypeEl).prop("checked", 'true');
                readrangeEl.show();
            }
            _.each(circles, function (circle) { //为选人组件设置默认值
                circle.type='g';
                sb.addItem(circle);
            });
            return result;
        },
        "_clear": function () {
            var elEl = this.element;
            var topictypeEl = $('.topictype', elEl);
            var readrangeEl = $('.readrange', elEl);
            var circles = this.circles;
            var sb = this.rangeSelectSb;
            sb.removeAllItem(); //清空数据 
            this.isOpen = true;
        },
        "_sendSettingAJAX": function () {
            var that = this;
            var elEl = this.element;
            var topicID = this.topicID;
            var isOpen = false;
            var sb = this.rangeSelectSb;
            var sbData = sb.getSelectedData();
            var memberData = sbData.g || []; //p是人的数据g是部门的数据
            var radioEl = $('.topictype input:checked', elEl);
            if (radioEl.val() == '1') {
                isOpen = true;
            } else {
                isOpen = false;
            }
            if (isOpen && memberData.length == 0) {
                $('.input-tip', sb.element).click();
                return;
            }

            util.api({
                "url": '/Topic/SetTopicOpenStatus', //接口地址
                "type": 'post',
                "data": {
                    "topicID": topicID, //话题id
                    "isOpen":isOpen, //是否是范围性话题
                    "circleIDs": memberData //部门范围 List<int>
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.hide();
                        that.Mytopics.reload();
                    }
                }
            });
        },
        "_submit": function (evt) {
            this._sendSettingAJAX();
            evt.stopPropagation();
        },
        "_cancel": function (evt) {
            this.hide();
        }
    });
    /**
     * 话题列表定义
     * @param opts
     * @constructor
     */
    var Mytopics = function (opts) {
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 20,
                "totalSize": 0,
                "visiblePageNums": 7
            },
            "listPath": "/Mytopics_html/getMytopicss",
            "listSuccessCb": FS.EMPTY_FN, //列表请求回调
            "defaultRequestData": {}, //默认请求数据
            "searchOpts": {
                "inputSelector": null, //搜索输入框
                "btnSelector": null //搜索按钮
            },
            "showTopAction": false, //默认不显示“置顶”按钮
            "listEmptyText": "暂无记录" //列表记录为空的文字提示
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this._initPagination(); //分页配置初始化    
        this.pagination = null; //分页组件
        this.tempRequestData = {};
        this._lastRequestData=null; //上一次的请求参数
        this.init();

    };

    var mytopicsFns = {
        "_initPagination": function () {
            var opts = this.opts;
            if (opts.pagSelector === false) {
                this.pagEl = $('<div class="topic-list-pagination"></div>').appendTo(this.element);
                //隐藏分页，设置pageSize足够大，把数据一次请求完
                this.pagEl.hide();
                opts.pagOpts.pageSize = 10000;
            } else {
                this.pagEl = $(opts.pagSelector);
            }
        },
        "init": function () {
            var that = this;
            var opts = this.opts;
            var elEl = this.element;
            var templetHtml = $(mytopicsTpl).filter('.mytopicstpl-warp').html();
            elEl.html(templetHtml); //渲染html
            var settingDialog = new SettingDialog(); //设置话题的弹出框
            this.settingDialog = settingDialog;
            //根据配置显示置顶按钮
            if (opts.showTopAction) {
                $('.fn-settop-btn', elEl).show();
            } else {
                $('.fn-settop-btn', elEl).hide();
            }
            //初始化分页组件
            this.pagination = new Pagination(_.extend({
                "element": this.pagEl
            }, opts.pagOpts));
            //that.fetch();
            this.pagination.on('page', function (pageNumber) {
                //清空列表
                that.empty();
                //请求数据
                that.fetch();
            });
            //渲染分页组件
            this.pagination.render();
            //搜索返回bar初始化
            if (opts.searchOpts && opts.searchOpts.inputSelector) {
                this._searchBarInit();
            }
            //初始化列表结果空白提示
            this._initListEmptyTip();
            //注册事件
            this._bindEvents();
        },
        /**
         * 设置置顶按钮是否可见
         * @param isVisible
         */
        "setTopVisible": function (isVisible) {
            var elEl = this.element,
                topEl = $('.fn-settop-btn', elEl);
            if (isVisible) {
                topEl.show();
            } else {
                topEl.hide();
            }
        },
        /**
         * 设置关注操作按钮状态
         * @param isFollow
         */
        "setFollowAction": function (isFollow) {
            var elEl = this.element,
                followEl = $('.fn-follow-btn a', elEl);
            if (isFollow) {
                followEl.text('关注');
            } else {
                followEl.text('取消关注');
            }
        },
        /**
         * 事件绑定
         * @param config
         */
        "_bindEvents": function () {
            var that = this;
            var elEl = this.element;
            elEl.on('click', '.fn-follow-btn', function (event) { //关注和取消关注话题
                that._fnFollow(event);
            });
            elEl.on('click', '.fn-fixed-btn', function (event) { //固定和取消固定话题
                that._fnFixed(event);
            });
            elEl.on('click', '.fn-settop-btn', function (event) { //置顶话题
                that._fnSettop(event);
            });
            elEl.on('click', '.fn-setting-btn', function (event) { //话题类型设置
                var meEl = $(this);
                var itemEl = meEl.closest('.mtlist-item');
                var topicID = itemEl.attr('topicid');
                var circlesData = itemEl.data('circles');
                that.settingDialog.topicID = topicID;
                that.settingDialog.Mytopics = that;
                that.settingDialog.circles = circlesData;
                that.settingDialog.show();
            });
        },
        "_fnSettop": function (event) { //置顶话题
            var that = this;
            var meEl = $(event.currentTarget);
            var itemEl = meEl.closest('.mtlist-item');
            var topicID = itemEl.attr('topicid');
            var urlPath = '/Topic/SetTopicToTop'; //置顶话题接口地址
            util.api({
                "url": '/Topic/SetTopicToTop', //置顶话题接口地址
                "type": 'post',
                "data": {
                    "topicID": topicID //话题ID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.load();
                    }
                }
            });
            return false;
        },
        "_fnFixed": function (event) { //固定和取消固定话题
            var that = this;
            var meEl = $(event.currentTarget).find('a');
            var isfixText = meEl.text();
            var itemEl = meEl.closest('.mtlist-item');
            var topicID = itemEl.attr('topicid');
            var flagType = true;
            var urlPath = '/Topic/FixTopic'; //固定和取消固定话题接口地址
            var sfixedTpl = '<img src="../../html/fs/assets/images/dot_r.png" alt=""/>固定成功';
            var sUnfixedTpl = '<div><img src="../../html/fs/assets/images/tipconfirm.png" alt=""/>确定要取消固定这个话题吗？</div><div class="button-warp"><button class="f-sub button-green">确定</button>&nbsp;&nbsp;<button class="f-cancel button-green">取消</button></div>';
            $('.show-slide-up-tip-warp').hide();
            if (isfixText == '固定') {
                meEl.text('取消固定');
                new flutil.showSlideUpTip({
                    "element": meEl,
                    // "autohide": false, //自动隐藏吗？
                    "width": 116,
                    "height": 56,
                    "template": sfixedTpl
                });
                this._fnsSubmit(urlPath, topicID, flagType);
            } else {
                flagType = false;
                if (meEl.text() == '已固定') {
                    return false;
                }
                new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": 221,
                    "height": 85,
                    "template": sUnfixedTpl,
                    "callback": function () {
                        that._fnsSubmit(urlPath, topicID, flagType);
                    }
                });
            }
            return false;
        },
        "_fnFollow": function (event) { //关注和取消关注话题
            var that = this;
            var meEl = $(event.currentTarget).find('a');
            var isfollowText = meEl.text();
            var itemEl = meEl.closest('.mtlist-item');
            var topicID = itemEl.attr('topicid');
            var flagType = true;
            var urlPath = '/Topic/FollowTopic'; //关注和取消关注话题接口地址
            var sfollowTpl = '<img src="../../html/fs/assets/images/dot_r.png" alt=""/>关注成功';
            var sUnfollowTpl = '<div><img src="../../html/fs/assets/images/tipconfirm.png" alt=""/>确定要取消关注这个话题吗？</div><div class="button-warp"><button class="f-sub button-green">确定</button>&nbsp;&nbsp;<button class="f-cancel button-green">取消</button></div>';
            $('.show-slide-up-tip-warp').hide();
            if (isfollowText == '关注') {
                meEl.text('取消关注');
                /**
                 * 目标上方滑动提示框
                 * 宽高必须要设置，根据容器内的元素大小
                 * element为按钮
                 * template为HTML内容*
                 * 隐藏的按钮class名为 .f-sub .f-cancel
                 */
                new flutil.showSlideUpTip({
                    "element": meEl,
                    // "autohide": false, //自动隐藏吗？
                    "width": 116,
                    "height": 56,
                    "template": sfollowTpl
                });
                this._fnsSubmit(urlPath, topicID, flagType);
            } else {
                /* 取消关注时 */
                flagType = false;
                if (meEl.text() == '已关注') {
                    return false;
                }
                new flutil.showSlideUpTip({
                    "element": meEl,
                    "autohide": false, //自动隐藏吗？
                    "width": 221,
                    "height": 85,
                    "template": sUnfollowTpl,
                    "callback": function () {
                        that._fnsSubmit(urlPath, topicID, flagType);
                    }
                });
            }

            return false;
        },
        "_fnsSubmit": function (urlPath, topicID, flagType) {
            var that = this;
            util.api({
                "url": urlPath, //接口地址
                "type": 'post',
                "data": {
                    "id": topicID, //话题ID
                    "flag": flagType //是否关注或者固定
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        if (!flagType) { //是否刷新列表
                            that.load();
                        }
                    }
                    ;
                }
            });
        },
        /**
         * 拼HTML列表
         * @param config
         */
        "_createItem": function (item) {
            /*
             * isFixed:是否固定
             * fixedOrder:固定序号
             * lastUpdateTime:最后更新时间
             * followTime:最后更新时间
             * description:描述
             * isOpen:是否开放。
             * isPublic:是否公开
             * circles:部门范围
             * count:数量
             * name:标题
             */
            var htmlStr = '';
            var count = item.count;
            var name = item.name;
            var circles = item.circles;
            var topicID = item.topicID;
            var isFixed = item.isFixed;
            var isFollow = item.isFollow;
            var isOpen = item.isOpen;
            var isPublic = item.isPublic;
            var circlesName = '';
            var followBtnStr = '<span class="fn-follow-btn"><a href="javascript:void(0);">关注</a></span>';
            var fixedBtnStr = '<span class="fn-fixed-btn"> | <a href="javascript:void(0);">固定</a></span>';
            var settopBtnStr = '<span class="fn-settop-btn"> | <a href="javascript:void(0);" >置顶</a></span>';
            var settingBtnStr = '<span class="fn-setting-btn"> | <a href="javascript:void(0);">设置</a></span>';
            var authority = false; //默认话题管理员权限
            var aoMyPermissions = currentUserData.functionPermissions; //我的权限
            _.each(aoMyPermissions, function (oMyPermission) {
                if (oMyPermission.value == 2) {
                    authority = true;
                }
            });
            /*判断话题范围*/
            if (isOpen) {
                if (isPublic) {
                    circlesName = '开放范围：全公司';
                } else {
                    if (circles.length > 0) { //获取范围
                        _.each(circles, function (circle) {
                            circlesName += circle.name + '，';
                        });
                        circlesName = '开放范围：' + circlesName.substr(0, circlesName.length - 1); //删除字符串最后一位字符
                    }
                }
            } else {
                circlesName = '';
            }

            if (isFixed) {
                fixedBtnStr = '<span class="fn-fixed-btn"> | <a href="javascript:void(0);">取消固定</a></span>';
            }
            if (isFollow) {
                followBtnStr = '<span class="fn-follow-btn"><a href="javascript:void(0);">取消关注</a></span>';
            }
            if (!authority) {
                fixedBtnStr = '';
                settopBtnStr = '';
                settingBtnStr = '';
            }
            htmlStr = '<div class="mtlist-item fn-clear" topicid="' + topicID + '"> <span class="mtlist-item-tit"><a href="#stream/showtopic/=/id-' + topicID + '">#' + name + '#</a> (' + count + ')</span> <span class="mtlist-item-range" title="' + circlesName + '">' + circlesName + '</span> <span class="mtlist-item-fn">' + followBtnStr + fixedBtnStr + settopBtnStr + settingBtnStr + '</span> </div>';
            return $(htmlStr);

        },
        /**
         *
         * @param config
         */
        fetch: function () { //获取列表数据
            var that = this;
            var requestData = {};
            var opts = this.opts;
            var pagination = this.pagination;
            var elEl = this.element;
            var listEl = $('.mtlistwrap', elEl);
            requestData = _.extend({
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber') //当前页码
            }, requestData || {});
            //加入默认request数据
            if (_.isFunction(opts.defaultRequestData)) {
                requestData = _.extend(opts.defaultRequestData(), requestData);
            } else {
                requestData = _.extend(opts.defaultRequestData, requestData);
            }
            //加入load或者reload传过来的request数据
            requestData = _.extend({
                "type": "-1", //-1是所有
                "keyword": "",
                "pageSize": pagination.get('pageSize'),
                "pageNumber": pagination.get('activePageNumber')
            }, requestData, this.tempRequestData);
            this.tempRequestData = {}; //用完重置为空
            //保存上一次的请求参数
            this._lastRequestData=requestData;
            //打开loading提示
            this.showLoading();
            util.api({
                type: 'get',
                data: requestData,
                url: opts.listPath,
                success: function (responseData, ajaxOpts) {
                    var dataRoot,
                        items;
                    if (responseData.success) {
                        dataRoot = responseData.value;
                        items = dataRoot.items;
                        _.each(items, function (item) {
                            var itemEl = that._createItem(item);
                            var circles = item.circles;

                            itemEl.data('circles', circles); //保存到item的data里面
                            itemEl.appendTo(listEl);

                        });
                        //重新设置总记录数 当前总记录+1
                        pagination.setTotalSize(dataRoot.totalCount);
                        //更新提示搜索信息
                        that._updateSearchBarState(requestData, responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
                        //隐藏loading
                        that.hideLoading();
                        opts.listSuccessCb.apply(that, [responseData, requestData]);

                    }
                }
            }, {
                "abortLast": true    //中断上一次请求
            });
        },
        /**
         * 搜索条初始化，显示查询总信息和返回按钮
         * @private
         */
        _searchBarInit: function () {
            var that = this,
                opts = this.opts,
                searchOpts = opts.searchOpts;
            var elEl = this.element,
                searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                searchBtnEl = $(searchOpts.btnSelector),  //搜索按钮
                barEl,
                isInit=searchInputEl.data('isInit');
            var searchEmptyEl,
                searchInputWEl;
            if(!isInit){
                //创建快速关闭按钮
                searchEmptyEl = $('<span class="empty-h">&#10005;</span>');
                searchInputWEl = $('<span class="list-search-input-wrapper"></span>');

                searchInputEl.wrap(searchInputWEl);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchEmptyEl.hide().appendTo(searchInputWEl);

                //搜索输入框enter提交事件注册和快速清空按钮
                searchInputEl.keydown(function (evt) {
                    if (evt.keyCode == 13) {    //监听回车按键
                        searchBtnEl.click();
                    }
                }).keyup(function () {
                        var val = _.str.trim($(this).val());
                        if (val.length > 0) {
                            searchEmptyEl.show();
                            searchInputEl.addClass('with-input-value');
                        } else {
                            searchEmptyEl.hide();
                            searchInputEl.removeClass('with-input-value');
                        }
                    });
                searchEmptyEl.click(function () {
                    searchInputEl.val("");
                    searchInputEl.removeClass('with-input-value');
                    searchEmptyEl.hide();
                });
                searchInputEl.data('isInit',true);
            }
            barEl = $('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);

            //点击返回到查看全部列表
            barEl.on('click', '.back-l', function (evt) {
                var emptyEl = $('.list-empty-tip', elEl),   //记录空白提示
                    searchEmptyEl=$('.empty-h',searchInputEl.closest('.list-search-input-wrapper'));
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                barEl.hide();
                emptyEl.hide();
                that.load({
                    "keyword": ""
                });
                evt.preventDefault();
            });
            this.searchBarEl=barEl;
        },
        /**
         * 搜索框销毁
         * @private
         */
        _searchBarDestroy:function(){
            var opts = this.opts,
                searchOpts = opts.searchOpts;
            var searchInputEl, //搜索输入框
                searchInputWEl; //搜索包裹框
            if(this.searchBarEl){
                searchInputEl = $(searchOpts.inputSelector);
                searchInputWEl = searchInputEl.closest('.list-search-input-wrapper');
                searchInputEl.insertAfter(searchInputWEl);
                searchInputWEl.remove();
                searchInputEl.val("").unbind();
                searchInputEl.data('isInit',false);
                this.searchBarEl.remove();
                this.searchBarEl=null;  //释放，节约内存
            }
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState: function (requestData, responseData) {
            var elEl = this.element,
                barEl = $('.list-search-bar', elEl),
                numEl = $('.num', barEl);
            if (requestData.keyword.length > 0) {
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
         * 搜索重置
         */
        resetSearch:function(){
            var opts = this.opts,
                searchOpts = opts.searchOpts;
            var searchInputEl = $(searchOpts.inputSelector), //搜索输入框
                searchInputWEl=searchInputEl.closest('.list-search-input-wrapper'),
                searchEmptyEl=$('.empty-h',searchInputWEl);
            searchEmptyEl.click().hide();
            this.searchBarEl&&this.searchBarEl.hide();
        },
        /**
         * 初始化list记录为空的tip
         * @private
         */
        _initListEmptyTip: function () {
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
        _updatelistStatus: function (responseData) {
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
        "showLoading": function () {
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
        "hideLoading": function () {
            var elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            loadingEl.hide();
        },
        /**
         * 加载第一页
         */
        "load": function (requestData) {
            this.tempRequestData = requestData;
            this.pagination.jump(1);
        },
        "reload": function () {
            this.tempRequestData=this._lastRequestData||{};
            this.empty();
            this.fetch();
        },

        "empty": function () {
            var listEl = $('.mtlistwrap', this.element),
                itemEl = $('.mtlist-item', listEl);
            itemEl.each(function () {
                var meEl = $(this),
                    feedV = meEl.data('feedV');
                feedV && feedV.destroy && feedV.destroy(); //销毁feedV
                meEl.removeData(); //清空所有数据
            });
            $('.show-slide-up-tip-warp').remove();
            listEl.empty();
        },
        "destroy": function () {
            this.pagination.destroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //搜索框销毁
            this._searchBarDestroy();
            //取消pagination绑定
            this.pagination = null;
            this.tempRequestData = {};
            this._lastRequestData=null;
            this.element = null;
        }
    };
    _.extend(Mytopics.prototype, mytopicsFns);
    //注册话题详情路由
    util.tplRouterReg('#stream/showtopic/=/:key-:value');
    module.exports = {
        "TopicEditDialog": TopicEditDialog,
        "Mytopics": Mytopics,
        "TopicDescDialog": TopicDescDialog
    };
});