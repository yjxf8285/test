/**
 * CRM - 设置 - 同事上下级 - module
 *
 * @author liuxiaofan
 * 2014-03-26
 */

define(function (require, exports, module) {
    var tpl = require('modules/crm-leaderssetting/crm-leaderssetting.html');
////    var tplStyle = require('modules/crm-leaderssetting/crm-leaderssetting.css');
    var Dialog = require('dialog');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var Pagination = require('uilibs/pagination2');//分页组件
    var Select = require('uilibs/select2');//下拉框组件
    var util = require('util');
    var publishHelper = require('modules/publish/publish-helper');
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');//选人弹框
    /**
     * CRM - 设置 - 同事上下级
     * 普通选项参数会被注册到 this.options 中。
     * 特殊的选项： model, collection, el, id, className, 以及 tagName。
     */
    var Leaderssetting = Backbone.View.extend({
        warpEl: null,//父级容器
        tagName: 'div', //HTML标签名
        className: 'leaders-setting-module fn-clear', //CLASS名
        options: {
            data: {
                isStop: 0,//是否离职员工
                keyword: '',//搜索关键字
                isFirstChar: false,//是否是首字符方式查询
                pageSize: 28,//分页大小 28
                pageNumber: 1//第几页
            }
        },
        template: _.template($(tpl).filter('.leaders-setting-list-template').html()), //模板
        events: {
            "click .leaders-settings-keyword-btn li": "_keyWordForSearch", //字母索引搜索
            "click .leaders-setting-list-item": "_getLeaderInfoOfOneEmployee" //触发设置上下属
        },
        // 初始化设置
        initialize: function () {
            this.render();
            this.renderTemplate = this.template;
            this.warpEl = this.options.warpEl;
            this.ModifyLeaderDialog = new ModifyLeaderDialog();
            this.ModifyLeaderDialog.itemV = this;
            this.isStop = 0;//在职员工
            this.pageSize = this.options.data.pageSize;//一页显示多少条

        },
        // 渲染
        render: function () {
            var elEl = this.$el;
            var renderTemplate = this.template;
            elEl.html(renderTemplate({value: {
                employees: {}
            }}));
            this.options.warpEl.html(elEl);
            return this;
        },
        // 清空
        destroy: function () {
            this.remove();
        },
        // 请求数据
        load: function () {
            var that = this;
            var elEl = this.$el;
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                "success": function (responseData) {
                    if (responseData.success) {
                        that.originData = responseData;
                        that.totalCount = responseData.value.totalCount;
                        that.pageNumber = responseData.value.pageNumber;
                        //渲染
                        elEl.html(that.renderTemplate(that.formatData(responseData)));
                        that.setupDoms();
                        that.modifyTplDoms();

                    }
                }
            }, {
                "loadingType": 1
            });
        },
        // 刷新数据
        refresh: function (data) {
            data && (_.extend(this.options.data, data));
            this.load();
        },
        // 原始数据格式化
        formatData: function (responseData) {
            var formatData = {};
            _.extend(formatData, responseData || {});
            _.each(responseData.value.employees, function (employee, index) {
                employee.profileImage = util.getAvatarLink(employee.profileImage, '1');//头像
            });
            responseData.value.employees = _.filter(responseData.value.employees, function(employee){
                return employee.name;
            });
            formatData.isFirstChar = this.options.data.isFirstChar;//是否为字母索引
            formatData.keyWord = this.options.data.keyword;
            return formatData;
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.$el;
            this.elEl = elEl;
        },
        // 设置组件
        setupComponent: function () {

        },
        //修改TPL页面DOM
        modifyTplDoms: function () {
            var that = this;
            var elEl = this.$el;
            var tplEl = this.$el.closest('.leaders-settings-warp');
            var searchWarpEl = $('.search-warp', elEl);
            var selectWarpEl = $('.select-warp', elEl);
            var paginationWarpEl = $('.pagination-wrapper', elEl);
            var employeesTitNameEl = tplEl.find('.leaders-settings-hd .tit-name');
            var employeesLengthEl = tplEl.find('.leaders-settings-hd .count');
            var employeesLength = this.originData.value.employees.length;
            var totalCount = this.totalCount;
            var pageNumber = this.pageNumber;

            if (this.isStop === 0) {
                employeesTitNameEl.text('在职同事');
            } else {
                employeesTitNameEl.text('离职同事');
            }
            employeesLengthEl.text('共' + totalCount + '个');
            //实例化搜索框
            var searchBox = new SearchBox({
                "element": searchWarpEl,
                "placeholder": "按名字搜索同事"
            });
            searchBox.on('search', function (queryValue) {
                that.queryValue = queryValue;
                var data = {
                    tagType: that.tagType,
                    keyword: queryValue
                }
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    that.refresh({
                        isStop: that.isStop,//是否离职员工
                        keyword: queryValue,//搜索关键字
                        pageNumber: 1,//第几页
                        isFirstChar: false//是否是首字符方式查询
                    });
                }

            });
            //初始化下拉列表组件
            var select = new Select({
                "element": selectWarpEl,
                "autoRender": true,  //不自动渲染
                "hasAll": true,
                defaultOption: {"value": that.isStop},
                "options": [
                    {"value": 0, "text": "在职同事"},
                    {"value": 1, "text": "离职同事"}
                ]
            });
            select.on('selected', function (val) {
                that.isStop = val.value;
                that.refresh({
                    isStop: that.isStop,//是否离职员工
                    pageNumber: 1//第几页
                });
            });
            //初始化分页组件
            var pagination = new Pagination({
                "element": paginationWarpEl,
                "pageSize": this.pageSize,
                "totalSize": totalCount,
                "activePageNumber": pageNumber
            });
            pagination.on('page', function (val) {
                that.refresh({
                    pageSize: that.pageSize,//分页大小 22
                    pageNumber: val//第几页
                });
            });
            //修改左侧字母选中状态和右上搜索框word
            if(this.options.data.isFirstChar) {
            	var eLis = $('.leaders-settings-keyword-btn li', this.$el);
            	eLis.removeClass('cur');
            	for(var i=0,len=eLis.length; i<len; i++) {
            		if($(eLis[i]).text()==this.options.data.keyword) {
            			$(eLis[i]).addClass('cur');
            		}
            	}
            } else {
            	searchWarpEl.find('.ui-search-field').val(this.options.data.keyword);
            }
        },
        //字母索引搜索
        _keyWordForSearch: function (e) {
            var that = this;
            var meEl = $(e.target);
            var keyWord = meEl.text().toString();
            (keyWord === '全部') && (keyWord = '');
            meEl.siblings().removeClass('cur');
            meEl.addClass('cur');
            this.refresh({
                isStop: that.isStop,//是否离职员工
                keyword: keyWord,//搜索关键字
                pageNumber: 1,//第几页
                isFirstChar: true//是否是首字符方式查询

            });
        },
        // 修改标签
        _getLeaderInfoOfOneEmployee: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.leaders-setting-list-item');
            var employeeId = itemEl.data('employeeid');
            var employeeName = itemEl.data('employeename');
            util.api({
                "url": '/Employee/GetLeaderInfoOfOneEmployee',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "employeeID": employeeId
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.ModifyLeaderDialog.oData = responseData;
                        that.ModifyLeaderDialog.myName = employeeName;
                        that.ModifyLeaderDialog.myId = employeeId;
                        that.ModifyLeaderDialog.show();
                    }
                }
            });
        }
    });

    /**
     * 设置上下级的弹框
     */
    var ModifyLeaderDialog = Dialog.extend({
        "attrs": {
            width: 886,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            content: $(tpl).filter('.dialog-modifyleader-template').html(),
            className: 'dialog-modifyleader'
        },
        "events": {
            'click .close-btn': '_closeItem',//itme的x关闭按钮
            'click .set-leader-unset-btn': '_unsetLeader',//不设置上级
            'click .set-leader-updatebtn': '_setLeaderUpdate',//设置上级保存
            'click .set-lower-updatebtn': '_setLowerUpdate',//设置下级保存
            'click .set-leader-modify-btn': '_selectColleagueLeader',//选择上级级按钮
            'click .select-colleague-lower-btn': '_selectColleagueLower',//选择下级按钮
            'click .button-cancel': 'hide'
        },
        "render": function () {
            var result = ModifyLeaderDialog.superclass.render.apply(this, arguments);
            this.setupDoms();//设置DOM
            this.setupComponent();//设置组件
            return result;
        },
        "hide": function () {
            var result = ModifyLeaderDialog.superclass.hide.apply(this, arguments);
            this.clear();
            return result;
        },
        "show": function () {
            var that = this;
            var result = ModifyLeaderDialog.superclass.show.apply(this, arguments);
            var vData = this.oData.value;
            var lowers = vData.lowers;//下属
            var setLeaderItemStr = '';
            var setLowerItemStr = '';
            //标题名字
            $('.my-name').text(this.myName);
            //渲染上级

            if (vData.leader && vData.leader.employeeID > 0) {
                setLeaderItemStr = '<li data-employeename="' + vData.leader.name + '" data-employeeid="' + vData.leader.employeeID + '" class="leaders-setting-list-item"><span class="close-btn leader">×</span><div class="l"><img class="item-img" alt="" src="' + util.getAvatarLink(vData.leader.profileImage, '2')
                    + '"></div><div class="r item-con"><div class="item-names"><div class="item-employee-name">' + vData.leader.name + '</div></div></div></li>';
                this.leaderListWarpEl.html(setLeaderItemStr);
                $('.set-leader-tip', this.element).show();
            } else {
                this.leaderListWarpEl.html('<li data-employeename="" data-employeeid="0" class="leaders-setting-list-item add"><a class="tip set-leader-modify-btn" href="javascript:;"> 点击选择上级 </a></li>');
                $('.set-leader-tip', this.element).hide();
            }
            //渲染下属
            if (lowers.length > 0) {
                _.each(lowers, function (lower, index) {
                    setLowerItemStr += '<li data-employeename="' + lower.name + '" data-employeeid="' + lower.employeeID + '" class="leaders-setting-list-item"><span class="close-btn">×</span><div class="l"><img class="item-img" alt="" src="' + util.getAvatarLink(lower.profileImage, '2')
                        + '"></div><div class="r item-con"><div class="item-names"><div class="item-employee-name">' + lower.name + '</div></div></div></li>';

                });
                this.lowerListWarpEl.html(setLowerItemStr);
            }
            this.lowersCountEl.text(lowers.length + '人');

            return result;
        },
        "clear": function () {
            this.lowerListWarpEl.html('');
            this.setLeaderUpdatebtnEl.addClass('button-state-disabled');
            this.setLowerUpdatebtnEl.addClass('button-state-disabled');
        },
        //设置上级保存
        _setLeaderUpdate: function (e) {
            var meEl = $(e.currentTarget);
            var that = this;
            var rEl = meEl.closest('.r');
            var myId = this.myId;
            var itemEl = rEl.find('.leaders-setting-list-item');
            var leaderId = itemEl.data('employeeid');
            var leaderName = itemEl.data('employeename');
            var confirmTipTextStr = '';
            if (!meEl.is('.button-state-disabled')) {//保存按钮没有被禁用的时候

                if (leaderId == 0) {
                    confirmTipTextStr = '是否确定不设置上级？在销售团队中，一般是只有最高负责人不需要设置上级';
                } else {
                    confirmTipTextStr = '确定设置“' + leaderName + '”为“' + this.myName + '”的直属上级吗？设置成功以后“' + leaderName + '”将可以看到“' + this.myName + '”及所有下属的客户资料。';
                }
                util.confirm(confirmTipTextStr, '', function () {
                    util.api({
                        "url": '/Employee/SetLeaderInfo',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            employeeID: myId,//int，员工id
                            leaderID: leaderId//int，直属领导id
                        },
                        beforeSend: function () {

                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                //成功之后
                                util.remind(1, "设置成功");
                                that.itemV.refresh();//刷新列表
                            }
                        }
                    }, {
                        "submitSelector": meEl
                    });
                });
            }
        },
        //设置下级保存
        _setLowerUpdate: function (e) {
            var that = this;
            var meEl = $(e.currentTarget);
            var myId = this.myId;
            var rEl = meEl.closest('.r');
            var itemEl = rEl.find('.leaders-setting-list-item');
            var leaderId = itemEl.data('employeeid');
            var lowerIDs = [];
            itemEl.each(function () {
                var lowerID = $(this).data('employeeid');
                lowerIDs.push(lowerID);
            });
            if (!meEl.is('.button-state-disabled')) {//保存按钮没有被禁用的时候
                util.confirm('确定设置所列用户为“' + this.myName + '”的直属下属吗？设置成功以后“' + this.myName + '”将可以看到所有下属的客户资料。', '', function () {
                    util.api({
                        "url": '/Employee/SetlowerInfo',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            employeeID: myId,//int，员工id
                            lowerIDs: lowerIDs.join(',') //string，下属id集合（,号分割）
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                //成功之后
                                util.remind(1, "设置成功");
                                that.itemV.refresh();//刷新列表
                            }
                        }
                    }, {
                        "submitSelector": meEl
                    });
                });
            }
        },
        // 选择上级
        _selectColleagueLeader: function () {
            var exceptEmployeeIDs = [];
            var leaderId=this.leaderListWarpEl.find('.leaders-setting-list-item',this.element).data('employeeid');
            exceptEmployeeIDs.push(leaderId);
            exceptEmployeeIDs.push(this.myId);//把自己也加入到排除列表里面
            this.selectColleagueS.set('condition', {
                'exceptEmployeeIDs': exceptEmployeeIDs.join(',')//排除人的ID
            });
            this.selectColleagueS.show({
                'exceptEmployeeIDs': exceptEmployeeIDs.join(',')//排除人的ID
            });
        },
        // 选择下级
        _selectColleagueLower: function () {
            var exceptEmployeeIDs = [];
            var leaderId=this.leaderListWarpEl.find('.leaders-setting-list-item',this.element).data('employeeid');
            exceptEmployeeIDs.push(leaderId);
            exceptEmployeeIDs.push(this.myId);//把自己也加入到排除列表里面
            this.lowerListWarpEl.find('.leaders-setting-list-item').each(function(){
                var employeeid=$(this).data('employeeid');
                exceptEmployeeIDs.push(employeeid);
            });
            this.selectColleagueM.set('condition', {
                'exceptEmployeeIDs': exceptEmployeeIDs.join(',')//排除人的ID
            });
            this.selectColleagueM.show({
                'exceptEmployeeIDs': exceptEmployeeIDs.join(',')//排除人的ID
            });
        },
        _closeItem: function (e) {
            var meEl = $(e.currentTarget);
            var setLowerEl = meEl.closest('.lower-list-warp');
            var allItemEl = setLowerEl.find('.leaders-setting-list-item');
            var itemEl = meEl.closest('.leaders-setting-list-item');
            var itemLength = allItemEl.length - 1;
            //上级和下级分开操作
            if (meEl.is('.leader')) {
                itemEl.html('<a class="tip set-leader-modify-btn" href="javascript:;"> 点击选择上级 </a>').addClass('add').attr({'data-employeeid': 0, 'data-employeename': ''}).data('employeeid', 0).data('employeename', '');
                this.setLeaderUpdatebtnEl.removeClass('button-state-disabled');
            } else {
                itemEl.remove();
                this.lowersCountEl.text(itemLength + '人');
                this.setLowerUpdatebtnEl.removeClass('button-state-disabled');
            }
        },
        //点击不设置上级
        _unsetLeader: function (e) {
            var meEl = $(e.currentTarget);
            var itemEl = meEl.closest('.r').find('.leaders-setting-list-item');
            itemEl.html('<a class="tip set-leader-modify-btn" href="javascript:;"> 点击选择上级 </a>').addClass('add').attr({'data-employeeid': 0, 'data-employeename': ''}).data('employeeid', 0).data('employeename', '');
            this.setLeaderUpdatebtnEl.removeClass('button-state-disabled');
        },
        // 设置Doms
        setupDoms: function () {
            var elEl = this.element;
            this.elEl = elEl;
            this.leaderListWarpEl = $('.leader-list-warp', elEl); //设置上级容器
            this.setLeaderUpdatebtnEl = $('.set-leader-updatebtn', elEl); //设置上级的保存按钮
            this.setLowerUpdatebtnEl = $('.set-lower-updatebtn', elEl); //设置下级的保存按钮
            this.lowerListWarpEl = $('.lower-list-warp', elEl); //设置下级容器
            this.lowersCountEl = $('.lowers-count', elEl); //下级人数
        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            this.selectColleagueS = new SelectColleague({
                "isMultiSelect": false,
                "condition":{
                    "exceptEmployeeIDs":this.myId//排除自己
                },
                "title": '请选择上级'
            });
            this.selectColleagueM = new SelectColleague({
                "isMultiSelect": true,
                "condition":{
                    "exceptEmployeeIDs":this.myId//排除自己
                },
                "title": '请选择下级'
            });
            this.selectColleagueS.on("selected", function (val) {
                var setLeaderItemStr = '<li data-employeename="' + val.name + '" data-employeeid="' + val.employeeID + '" class="leaders-setting-list-item"><span class="close-btn leader">×</span><div class="l"><img class="item-img" alt="" src="' + util.getAvatarLink(val.profileImage, '2')
                    + '"></div><div class="r item-con"><div class="item-names"><div class="item-employee-name">' + val.name + '</div></div></div></li>';
                that.leaderListWarpEl.html(setLeaderItemStr);
                that.setLeaderUpdatebtnEl.removeClass('button-state-disabled');
            });
            //下级事件
            this.selectColleagueM.on("selected", function (val) {
                that.setLowerUpdatebtnEl.removeClass('button-state-disabled');
                var setLowerItemStr = '';
                var lowers = val;
                _.each(lowers, function (lower, index) {
                    setLowerItemStr += '<li data-employeename="' + lower.name + '" data-employeeid="' + lower.employeeID + '" class="leaders-setting-list-item"><span class="close-btn">×</span><div class="l"><img class="item-img" alt="" src="' + util.getAvatarLink(lower.profileImage, '2')
                        + '"></div><div class="r item-con"><div class="item-names"><div class="item-employee-name">' + lower.name + '</div></div></div></li>';

                });
                that.lowerListWarpEl.append(setLowerItemStr);
                that.lowersCountEl.text($('.leaders-setting-list-item', that.lowerListWarpEl).length+"人");
            });
        }
    });
    module.exports = Leaderssetting;
});