/**
 * CRM - 联系人详情 - tpl
 *
 * @author liuxiaofan
 * 2014-05-20
 */
define(function (require, exports, module) {

    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var FeedList = require('modules/feed-list/feed-list');
    var Dialog = require('dialog');
    var moment = require('moment');
    var Tab = require('uilibs/tabs2');
    var SelectColleague = require('modules/crm-select-colleague/crm-select-colleague');
    var publishHelper = require('modules/publish/publish-helper');
    var Attachment = require('modules/crm-attachment-simple/crm-attachment-simple');//左栏附件组件
    var AttachmentList = require('modules/crm-attachment/crm-attachment');//附件列表组件
    var ModifyRecords = require('modules/crm-modify-records/crm-modify-records');//修改记录
    var SalesclueDialog = require('modules/crm-salesclue-edit/crm-salesclue-edit');
    var CustomerDialog = require('modules/crm-select-customer/crm-select-customer');//选客户
    var ContactDialog = require('modules/crm-contact-edit/crm-contact-edit');
    var Detaillist = require('modules/crm-detaillists/crm-detaillists');//明细页产品列表
    var Publish = require('modules/crm-publish/crm-publish');//输入框组件
    var Tabs = require('uilibs/tabs');
    /**
     * 联系人详情页
     */
    var ShowContract = function (options) {
        options = $.extend({
            element: null //容器是JQ对象
        }, options || {});
        this.options = options;
        this.$el = options.element;
        this.myID = this.options.queryParams.id;
        this.init(); //初始化
    };
    $.extend(ShowContract.prototype, {
        init: function () {
            var elEl = this.$el;
            this._getTagsDatas();
            this.setupComponent();//设置组件
            this.bindEvents(); //事件绑定
            var that = this;
            var tplName = exports.tplName;
            tpl.event.one('beforeremove',function(tplName2){
                if(tplName2==tplName){
                    that.destroy();
                }
            });
    	},
        //事件绑定
        bindEvents: function () {
            var elEl = this.$el;
            var that = this;
            // 更新状态下拉框
            util.mnEvent($('.updatestates-select-list', elEl), 'change', function (val, text) {
                util.confirm('是否确定要将当前合同的【状态】变更为【' + text + '】？', '', function () {
                    util.api({
                        "url": '/Contact/UpdateContractsStates', //谁的接口地址
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contractIDs: that.myID,
                            states: val
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                //成功之后
                                util.remind(1, "变更成功");
                                that.load();
                            }
                        }
                    });
                });
            });
            elEl.on('click', '.crm-button-back', function () {
                that._backToListPage();//返回到上级页面

            });
            //删除
            elEl.on('click', '.delete-btn', function () {
                that._delete();
            });
            //创建
            elEl.on('click', '.create-btn', function (e) {
                var $current = $(e.target);
                var company = that.responseData.value.contact.company;
                if (company) {
                    util.confirm('是否通过该联系人创建相关客户?', '&nbsp;', function () {
                        util.api({
                            "url": '/FCustomer/AddFCustomerByContactID',
                            "type": 'post',
                            "dataType": 'json',
                            "data": { contactID: that.myID },
                            "success": function (responseData) {
                                if (responseData.success) {
                                    $current.hide();
                                    that.refresh();
                                    that.tab.select('tab-time-line');
                                }
                            }
                        });

                    });
                } else {
                    util.alert('没有公司名称不能创建相关客户。');
                }
            });
            //修改
            elEl.on('click', '.modify-btn', function () {
                that.modifyCompetitorDialog.show();
            });
            //关联客户
            elEl.on('click', '.batchcombinecontactandfcustomer-btn', function () {
                var company = that.responseData.value.contact.company || '';
                that.customerDialog.show(company);

            });
            //取消关联客户
            elEl.on('click', '.uncombinecontactandfcustomer-btn', function () {
                that._unCombineContactAndFCustomer();
                that.tab.select('tab-time-line');
            });

            //关注按钮
            elEl.on('click', '.follow-switch-btn', function (e) {
                that._switchFollow(e);
            });
            //关联客户
            this.customerDialog.on("selected", function (val) {
                that._batchCombineContactAndFCustomer(val);
            });
        },
        //关注开关
        _switchFollow: function (e) {
            var $el = $(e.target);
            var that = this;
            if ($el.hasClass('following')) {
                //取消关注
                util.api({
                    "url": '/Contact/ContractCancelFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('following').addClass('no-follow').text('关注')
                        }
                    }
                });
            } else {
                //添加关注
                util.api({
                    "url": '/Contact/ContractFollow',
                    "type": 'post',
                    "dataType": 'json',
                    "data": { contractID: that.myID },
                    "success": function (responseData) {
                        if (responseData.success) {
                            $el.removeClass('no-follow').addClass('following').text('已关注')
                        }
                    }
                });
            }

        },
        //获取线索标签的相关数据
        _getTagsDatas: function () {
            var crmData = util.getCrmData(); //获取CRM缓存数据
            var functionPermissions = crmData.functionPermissions; //权限数据
            var marketingEventTypes = util.getTagsByType(9); //获取所有线索标签
            var allTags = []; //存放线索标签数据数组
            var that = this;
            var currentEmpId = crmData.currentEmp.employeeID;//登录用户ID
            var competitorscale = [//规模标签数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            var competitiveness = [//竞争力标签数据
                {
                    "text": '不限',
                    "value": 0
                }
            ];
            _.each(marketingEventTypes, function (marketingEventType, index) {
                allTags.push(marketingEventType);

                if (marketingEventType.systemTagCode === 109) { //109线索来源
                    _.each(marketingEventType.options, function (option, index) {
                        competitiveness.push({
                            "text": option.name,
                            "value": option.fBusinessTagOptionID
                        });
                    });
                    that.marketingEventTypeFBusinessTagID = marketingEventType.fBusinessTagID;//线索来源的标签ID
                }
            });
            _.extend(this, {
                allTags: allTags, //标签数据，新建标签的窗口需要用到
                competitorscale: competitorscale, //规模标签数据
                currentEmpId: currentEmpId, //登录用户ID
                functionPermissions: functionPermissions //权限数据
            });

        },
        //实例化左栏附件
        setCrmAttachment: function () {
            var that = this;
            var crmAttachmentSimpleWarp = $('.crm-attachment-simple-warp', this.$el);
            //左栏附件模块
            this.attachment = new Attachment({
                "element": crmAttachmentSimpleWarp,
                "condition": {
                    "dataID": that.myID,
                    "fbrType": 2
                }
            });
            this.attachment.render();
            this.attachment.on('toAll', function () {
                //切换到附件信息
                that.tab.select("tab-files");
            });
            this.attachment.on('uploaded', function () {
                that.attachmentList.reload();
            });
        },
        //实例化附件列表
        setAttachmentList: function () {
            var that = this;
            var crmAttachmentListSimpleWarp = $('.crm-attachmentlist-simple-warp', this.$el);
            this.attachmentList = new AttachmentList({
                "element": crmAttachmentListSimpleWarp,
                "condition": {
                    "fbrType": 2,// 1，客户ID； 2,联系人；3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                    "dataID": that.myID // 对手ID
                }
            });
            this.attachmentList.on('uploaded', function () {
                that.attachment.reload();
            });
        },
        //实例化feed列表
        setFeedList: function () {
            var that = this;
            var feedListEl = $('.crm-feed-list-warp', this.$el);
            var pagEl = $('.feed-list-pagination', this.$el);
            var searchEl = $('.search-inp', this.$el),
                searchBtnEl = $('.search-btn', this.$el);

            //构建feedtabs
            var feedTabsEl = $('.feed-tabs', this.$el);
            this.feedTabs = new Tabs({
                "element": feedTabsEl,
                "triggers": $('.ui-tab-item', feedTabsEl),
                "panels": $('.ui-tab-panel', feedTabsEl),
                "activeIndex": 0,
                "activeTriggerClass": "ui-tab-item-current",
                "triggerType": 'click'
            }).render();
            this.feedTabs.on('switched', function (toIndex, fromIndex) {
                var curPanelEl=this.get('panels').eq(toIndex);
                that.feedList = new FeedList({
                    "element": $('.crm-feed-list-warp',curPanelEl), //list selector
                    "pagSelector": $('.feed-list-pagination', curPanelEl), //pagination selector
                    "pagOpts": {//分页配置项
                        "pageSize": 15,
                        "visiblePageNums": 3
                    },
                    GetBatchFilesSource: 1, //附件下载权限控制标示： 1、信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                    crmParam: {
                        type: 'contact',
                        id: that.myID
                    },
                    "listPath": "/CrmFeed/GetFeeds",
                    "defaultRequestData": function () {
                        return {
                            "feedType": toIndex,
                            "fbrType": 2, // 1，客户ID； 3，机会ID； 4，产品ID； 5,对手ID； 6，合同ID； 7，市场活动ID； 8，线索ID
                            "dataID": that.myID, //
                            "type": 1, //1是分享类型
                            "keyword": _.str.trim(searchEl.val())
                        };
                    },
                    "listEmptyText": "暂无记录",
                    "searchOpts": {
                        "inputSelector": searchEl,
                        "btnSelector": searchBtnEl
                    } //默认请求数据
                });
                that.feedList.load();
            });
            this.feedTabs.trigger('switched', 0, -1); //将feed切换到全部列表
            searchBtnEl.on('click',function(evt){
                that.feedList.reload({
                    "keyword": _.str.trim(searchEl.val())
                });
                evt.preventDefault();
            });
        },
        // 通过权限控制是否显示功能按钮
        showFnBtn: function () {
            var elEl = this.$el;
            var value = this.responseData.value;
            var canModify = value.canModify;
            var canDelete = value.canDelete;
            var canChangeOwner = value.canChangeOwner;
            var creatorID = value.contact.creatorID;//创建人
            var currentEmpId = this.currentEmpId;//登录人
            if (canModify) {
                $('.modify-btn', elEl).show();
            } else {
                $('.modify-btn', elEl).hide();
            }
            if (canDelete) {
                $('.delete-btn', elEl).show();
            } else {
                $('.delete-btn', elEl).hide();
            }
            if (canChangeOwner) {
                $('.canchangeowner-btn', elEl).show();
            } else {
                $('.canchangeowner-btn', elEl).hide();
            }
            //如果当前当如人等于创建人 证明这个联系是我的联系人，否则为我的下属联系人
            if (creatorID != currentEmpId) {
                $('.batchcombinecontactandfcustomer-btn', elEl).hide();
                $('.uncombinecontactandfcustomer-btn', elEl).hide();
            }
        },
        render: function () {
            var elEl = this.$el;
            var that = this;
            var contact = this.responseData.value.contact || null;
            var customer = this.responseData.value.customer || 0;
            var fBusinessTagRelationsStr = '';
            var followBtn = $('.follow-switch-btn', elEl);
            var addressObjectStr = '';
            var contactWayObjectStr = '';
            var customerName;
            var birthdayStr = '<span class="birthday-info">'+contact.monthOfBirth+'月'+contact.dayOfBirth+'日是'+contact.name+'的生日,记得送去温馨的祝福哦！</span>';
            var currentParam = util.getTplQueryParams2();
            var param;
            if(!contact.isShowBirthDay){
                birthdayStr = '';
            }
            if (customer && customer.customerID > 0) {
                customerName = customer.name || "";
                $('.jdata-customer-fullname', elEl).text(customer.fullName);
                $('.jdata-customer-name', elEl).text(customer.name);
                $('.jdata-customer-address', elEl).text(customer.address);
                $('.jdata-customer-website', elEl).text(customer.webSite);
                $('.jdata-customer-introduction', elEl).text(customer.introduction);


                if (customer) {

                    param = {
                        id: customer.customerID,
                        returnUrl: 'contacts/showcontact/=/param-' + encodeURIComponent(JSON.stringify(currentParam))
                    }
                    $('.jdata-customername', elEl).html('<a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '" style="line-height:13px;">' + customer.name + '</a>').show();

                } else {

                    $('.jdata-customername', elEl).html('<a href="javascript:;"></a>').hide();
                }
                if (customer.fBusinessTagRelations) {
                    _.each(customer.fBusinessTagRelations, function (fBusinessTagRelation, index) {
                        var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                        var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                        fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
                    });
                    $('.customerfbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
                }
            } else {
                $('.jdata-customername', elEl).html('<a href="javascript:;"></a>').hide();
            }

            if (contact.customerID > 0) { //大于0表示已经关联了客户
                $('.batchcombinecontactandfcustomer-btn', elEl).hide();
                $('.create-btn', elEl).hide();
                $('.uncombinecontactandfcustomer-btn', elEl).show();
                param = {
                    id: contact.customerID,
                    returnUrl: 'contacts/showcontact/=/param-' + encodeURIComponent(JSON.stringify(currentParam))
                }
                //                $('.jdata-customername', elEl).html('<a href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + customerName + '</a>');

                $('.isbatch-warp', elEl).html('<span class="words">已关联到客户“</span>' + '<a title="' + customerName + '" class="link" href="#customers/showcustomer/=/param-' + encodeURIComponent(JSON.stringify(param)) + '">' + customerName + '</a>' + '<span class="words">”</span>').addClass("cur");
            } else {
                $('.batchcombinecontactandfcustomer-btn', elEl).show();
                $('.create-btn', elEl).show();
                $('.uncombinecontactandfcustomer-btn', elEl).hide();
                $('.isbatch-warp', elEl).html('尚未关联到客户').removeClass("cur");
            }
            if (contact) {
                if (contact.fBusinessTagRelations) {
                    _.each(contact.fBusinessTagRelations, function (fBusinessTagRelation, index) {
                        var fBusinessTagName = fBusinessTagRelation.fBusinessTagName;
                        var fBusinessTagOptionName = fBusinessTagRelation.fBusinessTagOptionName;
                        fBusinessTagRelationsStr += '<li class="fn-clear"><span class="input-tip">' + fBusinessTagName + '</span><div class="input-wrapper">' + fBusinessTagOptionName + '</div></li>';
                    });
                    $('.product-fbusinesstagrelations', elEl).html(fBusinessTagRelationsStr);
                }

                var $defineFieldUl = $('.contact-define-field-tag-ul', elEl);
                var defineFieldHtml = [];
                if (contact.userDefineFieldDataList && contact.userDefineFieldDataList.textList) {
                    _.map(contact.userDefineFieldDataList.textList, function (obj) {
                        if (obj.value != '') {
                            defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                            defineFieldHtml.push(obj.fieldDescription);
                            defineFieldHtml.push('</div><div class="textarea-wrapper">');
                            defineFieldHtml.push(obj.value);
                            defineFieldHtml.push('</div></li>');
                        }
                    });
                }
                if (contact.userDefineFieldDataList && contact.userDefineFieldDataList.dateList) {
                    _.map(contact.userDefineFieldDataList.dateList, function (obj) {
                        if (obj.value > 0) {
                            defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                            defineFieldHtml.push(obj.fieldDescription);
                            defineFieldHtml.push('</div><div class="input-wrapper">');
                            //                        defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日 HH:mm'));
                            defineFieldHtml.push(moment.unix(obj.value).format('YYYY年MM月DD日'));
                            defineFieldHtml.push('</div></li>');
                        }
                    });
                }
                if (contact.userDefineFieldDataList && contact.userDefineFieldDataList.numList) {
                    _.map(contact.userDefineFieldDataList.numList, function (obj) {
                        defineFieldHtml.push('<li class="fn-clear"><div class="input-tip">');
                        defineFieldHtml.push(obj.fieldDescription);
                        defineFieldHtml.push('</div><div class="input-wrapper">');
                        defineFieldHtml.push(obj.value);
                        defineFieldHtml.push('</div></li>');
                    });
                }
                if (defineFieldHtml.length > 0) {
                    $defineFieldUl.show();
                    $defineFieldUl.html(defineFieldHtml.join(''));
                } else {
                    $defineFieldUl.hide();
                }

                if (contact.contactWayObject.length > 0) {
                    _.each(contact.contactWayObject, function (option) {
                        var typeDesc = option.typeDesc;
                        var content = option.content;
                        contactWayObjectStr += '<li class="fn-clear"><span class="input-tip">' + typeDesc + '</span><div class="input-wrapper">' + content + '</div></li>';
                    });
                    $('.contactwayobject-warp-baseinfo', elEl).html(contactWayObjectStr).show();
                    $('.contactwayobject-warp', elEl).html('<ul>' + contactWayObjectStr + '</ul>');
                } else {
                    $('.contactwayobject-warp-baseinfo', elEl).hide();
                    $('.contactwayobject-warp', elEl).html('<div class="text-align-c">当前联系人没有联系方式</div>');
                }
                if (contact.addressObject.length > 0) {
                    _.each(contact.addressObject, function (option) {
                        addressObjectStr += '<li class="fn-clear"><span class="input-tip">地址</span><div class="input-wrapper">' + option + '</div></li>';
                    });

                    $('.addressobject-warp', elEl).html(addressObjectStr).show();
                } else {
                    $('.addressobject-warp', elEl).hide();
                }
                var birthDayYstr=contact.yearOfBirth+'年';
                var birthDayMstr=contact.monthOfBirth+'月';
                var birthDayDstr=contact.dayOfBirth+'日';
                (!contact.yearOfBirth) && (birthDayYstr='');
                (!contact.monthOfBirth) && (birthDayMstr='');
                (!contact.dayOfBirth) && (birthDayDstr='');
                $('.birthday-warp', elEl).html('<li class="fn-clear"><span class="input-tip">生日</span><div class="input-wrapper">' + birthDayYstr +birthDayMstr+birthDayDstr +'</div></li>');

                if (contact.isFollow) {
                    followBtn.addClass('following').text('已关注');
                } else {
                    followBtn.addClass('no-follow').text('关注');
                }
                $('.hd-titname', elEl).html(contact.name+birthdayStr);//标题
                $('.jdata-creatorname', elEl).text(contact.creator.name);//创建人人
                $('.jdata-creatorname', elEl).text(contact.creator.name);
                $('.jdata-createtime', elEl).text(moment.unix(contact.createTime).format('YYYY年MMMDD日 HH:mm'));//创建时间
                //                $('.jdata-lasteditemployeename', elEl).text(contact.lastEditEmployee.name);//最后修改人
                $('.jdata-lastedittime', elEl).text(moment.unix(contact.lastEditTime).format('YYYY年MMMDD日 HH:mm'));//最后修改时间
                $('.jdata-name', elEl).text(contact.name);//string，姓名(必填，长度100)

                $('.jdata-post', elEl).text(contact.post);
                $('.jdata-department', elEl).text(contact.department);
                $('.jdata-company', elEl).text(contact.company);
                $('.jdata-website', elEl).text(contact.webSite);
                $('.jdata-remark', elEl).text(contact.remark);


            }
            this.showFnBtn();


            this.modifyCompetitorDialog = new ContactDialog({
                contactID: this.options.queryParams && this.options.queryParams.id
            });
            this.modifyCompetitorDialog.on('success', function () {
                that.refresh();
            })
            this.modifyCompetitorDialog.v = this;

        },
        load: function () {
            var elEl = this.$el;
            var that = this;
            util.api({
                "url": '/Contact/GetContactDetailByID',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    contactID: that.myID, //int，ID
                    attachNum: 6//int，附件显示条数(写死6条)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        that.responseData = responseData;
                        that.render();
                        that.setPublish();
                        that.setCard(responseData.value.contact.picturePath);
                    } else {
                        util.alert(responseData.message, function () {
                            that._backToListPage();//不成功就返回到列表
                        }, {  "zIndex": 3000});
                    }
                }
            }, {
                "errorAlertModel": "1" //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
            });
        },

        setCard: function (cardPath) {
            var elEl = this.$el;
            if (cardPath == "") {
                $(".contacts-card-box", elEl).hide();
                return;
            }
            $(".contacts-card-box", elEl).show();
            $(".contacts-card-image", elEl).attr("src", util.getAvatarLink(cardPath, 1));
        },

        refresh: function () {
            this.load();
        },
        //返回到上级页面
        _backToListPage: function () {
            var queryParams = util.getTplQueryParams2();
            tpl.navRouter.navigate(queryParams.returnUrl, {trigger: true});//手动跳转页面
            tpl.event.trigger('dataUpdate');
        },
        //删除
        _delete: function () {
            var that = this;
            util.confirm('你确定要删除该联系人吗？删除后将不可恢复。', '', function () {
                util.api({
                    "url": '/Contact/DeleteContact',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "contactID": that.myID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that._backToListPage();//返回到上级页面
                        }
                    }
                });
            });

        },
        //关联客户
        _batchCombineContactAndFCustomer: function (val) {
            var that = this;
            util.api({
                "url": '/Contact/BatchCombineContactAndFCustomer',
                "type": 'post',
                "dataType": 'json',
                "data": {
                    "customerID": val.customerID,
                    "contactIDs": that.myID
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        that.tab.select('tab-time-line');
                        that.refresh();
                    }
                }
            });
        },
        //取消关联客户
        _unCombineContactAndFCustomer: function () {
            var that = this;
            util.confirm('你确定要将该联系人从客户下移除吗？此操作不可恢复。', '', function () {
                util.api({
                    "url": '/Contact/UnCombineContactAndFCustomer',
                    "type": 'post',
                    "dataType": 'json',
                    "data": {
                        "contactID": that.myID
                    },
                    "success": function (responseData) {
                        if (responseData.success) {
                            that.refresh();
                        }
                    }
                });
            });
        },
        //联系人中的共享联系人
        _detaillistShareContacts: function () {
            var that = this;
            var elEl = this.$el;
            if (!this.detaillistShareContacts) {
                this.detaillistShareContacts = new Detaillist({
                    warpEl: $('.tab-share-contact-box', elEl),
                    rightTopBTnText: '共享',
                    title: '共享联系人',
                    pagination: true,//是否显示分页
                    url: '/Contact/GetShareContactsToOthers', //请求地址
                    data: {
                        employeeID: 0,//int，员工id
                        contactID: that.myID,//int，联系人ID
                        pageSize: 10,//int，
                        pageNumber: 1//int
                    },
                    emptyStr: '暂无共享',
                    emptyBtnWords: '立即共享',
                    jDatas: 'shareContactDetails',//需要的数据对象
                    thDatas: ['描述', '共享时间', '操作'],//表格标题
                    aoColumnsData: [//列配置
                        //名称
                        {
                            "mData": "employeeName",
                            "sWidth": "500px",
                            "sClass": "text-black",
                            "bSortable": false,
                            "mRender": function (data, type, full) {
                                var whoName = '';
                                if (that.currentEmpId == full.shareEmployeeID) {
                                    whoName = '我';
                                } else {
                                    whoName = full.shareName;
                                }
                                var newData = '<span title="' + data + '">' + whoName + '共享给' + data + '</span>';
                                return newData;
                            }
                        },

                        {
                            "mData": "shareTime",
                            "sWidth": "90px",
                            "bSortable": false,
                            "mRender": function (data, type, full) {
                                var newData = '<span title="' + moment.unix(data).format('YYYY-MM-DD') + '">' + moment.unix(data).format('YYYY-MM-DD') + '</span>';
                                return newData;
                            }
                        },
                        //操作
                        {
                            "mData": "blank",
                            "sWidth": "200px",
                            "bSortable": false,
                            "mRender": function (data, type, full) {
                                var newData = '';
                                if (full.isCreated) {
                                    newData = '已创建'
                                } else {
                                    newData = '<a href="javascript:;" class="table-del-btn">删除</a>';
                                }
                                return newData;
                            }
                        },
                        {
                            "mData": "blank",
                            "sClass": "th-blank",
                            "bSortable": false,
                            "mRender": function (data, type, full) { //第2列内容
                                var newData = '';
                                return newData;
                            }
                        }
                    ]

                });
            } else {
                this.detaillistShareContacts.refresh();
            }

            this.detaillistShareContacts.on('add', function (rowData) {
                //                var salesOpportunityID = that.myID;
                that.selectColleague.show({
                    exceptEmployeeIDs: util.getCurrentEmp().employeeID
                });
            });

            this.detaillistShareContacts.on('del', function (rowData) {
                var that = this;
                util.confirm('你确定要删除该共享吗？', '', function () {
                    util.api({
                        "url": '/Contact/DeleteShareContactMessageByID',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            "shareContactMessageID": rowData.shareContactMessageID
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                that.refresh();
                            }
                        }
                    });
                });
            });
        },
        _modifyRecords: function () {
            var that = this;
            var crmModifyRecordsWarp = $('.crm-modifyrecords-wrap', this.$el);
            this.modifyrecords = new ModifyRecords({
                "wrapEl": crmModifyRecordsWarp,
                "contactId": this.options.queryParams && this.options.queryParams.id,
                "recordsUrl": "/Contact/GetSnapshotsOfContactID",//获取所有的修改记录请求地址
                "snapshotsUrl": "/Contact/GetContactSnapshotTwoEntity",//获取两条实体
                "restoreUrl": "/Contact/RestoreSnapshot",
                "v": that
            });
        },
        _selectColleague: function () {
            var that = this;
            this.selectColleague = new SelectColleague({
                "isMultiSelect": true,
                "hasWorkLeaveBtn": false
            });
            this.selectColleague.on("selected", function (data) {
                var contactID = that.options.queryParams && that.options.queryParams.id,
                    employeeIDs = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    employeeIDs.push(data[i].employeeID);
                }
                if (employeeIDs.length) {
                    util.api({
                        "url": '/Contact/ShareContactsToEmployees',
                        "type": 'post',
                        "dataType": 'json',
                        "data": {
                            contactIDs: [contactID],
                            employeeIDs: employeeIDs
                        },
                        "success": function (responseData) {
                            util.remind(2, '成功共享联系人');
                            that.detaillistShareContacts.refresh();
                        }
                    });
                }
            });
        },
        //实例化输入框
        setPublish: function () {
            var that = this;
            var elEl = this.$el;
            var contactIDs = that.myID.toString();
            if (!this.feedpublish) {
                this.feedpublish = new Publish({
                    "element": $('.feed-submit-box-warp', elEl),
                    "title": "新建销售记录",
                    "placeholder": "发布新销售记录",
                    "isContact": true,
                    "type": "event",
                    "contactInfo": that.responseData.value.contact,
                    "condition": {
                        "associationContactIDs": "",// string，关联联系人ID集合，逗号分隔
                        "fileInfos": [],// List<ParamValue<int, string, int, string>>，附件集合
                        "isAllDayEvent": false,// bool，是否全天事件
                        "startTime": 0,// long，事件开始提醒时间
                        "remindType": 1,// int，全部 = 0,不提醒 = 1,销售记录发生时= 2,5分钟前 = 3,15分钟前= 4,30分钟前= 5,1小时前= 6,2小时前= 7,6小时前= 8,1天前= 9,2天前= 10,自定义时间= 11
                        //"remindTime":0,// long，自定义时间
                        "isSentSms": false,// bool，是否发送短信
                        "feedContent": "",// string，事件内容
                        "parentFeedID": 0, //int，父事件ID
                        "listTagOptionID": [],// List<string>，销售记录标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)，除销售记录外选其他标签会报错
                        "fbrType": 2,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                        //1，与客户关联，dataID：客户ID；DataID1：联系人ID
                        //2,与联系人关联，DataID：客户ID；DataID1：联系人ID
                        //3,与机会关联，DataID：客户ID；DataID1：联系人ID列表；DataID2：机会ID
                        "customerID": that.responseData.value.contact.customerID,// int，客户ID
                        "contactIDs": contactIDs,// string，联系人ID1
                        "salesOpportunityID": that.responseData.value.contact.salesOpportunityID// int，机会ID
                    },
                    "display": ["time", "picture", "attach", "tag", "at", "topic"]
                });
                this.feedpublish.on('post', function (feedID) {
                    //                that.feedList.unshiftFromFeedId(feedID);//请求一条数据
                    that.feedList.load({
                        "keyword": ''
                    });
                    that.feedTabs.switchTo(0); //将feed切换到全部列表
                });
            }

        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            var topMenuTabEl = $('.tab-menu', this.$el);
            this.setFeedList();//实例化feed列表
            this.setCrmAttachment();//实例化左栏附件
            this.setAttachmentList();//实例化附件列表
            this._detaillistShareContacts();//联系人中的共享联系人列表
            this._modifyRecords();//修改记录
            this._selectColleague();
            this.tab = new Tab({
                "element": topMenuTabEl, //容器
                "container": this.$el, //大父级容器
                "items": [
                    {value: "tab-time-line", text: "时间线"},
                    {value: "tab-base-info", text: "基本信息"},
                    {value: "tab-share-contact", text: "共享联系人"},
                    {value: "tab-customer-info", text: "客户信息"},
                    {value: "tab-modify-records", text: "修改记录"},
                    {value: "tab-files", text: "附件"}
                ]
            });
            //            util.autoAdjustPos($('.flaot-left-menu', this.$el));//浮动元素（滚动到元素位置贴到顶部固定）//注释掉因为左侧太长会导致页面跳动bug 774
            //实例化选人组件
            this.customerDialog = new CustomerDialog({
                "defaultCondition": {
                    "keyword": "",
                    "employeeID": that.currentEmpId//int，当前登录用户的ID
                }
            });
            this.tab.on('change', function (beforeTab, nowTab) {
                switch (nowTab) {
                    case 'tab-share-contact':
                        that.detaillistShareContacts.refresh();
                        break;
                    case 'tab-competitor':
                        that.detaillistCompetitor.refresh();
                        break;
                    case 'tab-contract':
                        that.detaillistContracts.refresh();
                        break;
                    case 'tab-modify-records':
                        that.modifyrecords.refresh();
                        break;
                    case 'tab-customer-info':
                        that.refresh();
                        var havecustomerInfoWarpEl = $('.havecustomer-info-warp', this.$el);
                        var nocustomerInfoWarpEl = $('.nocustomer-info-warp', this.$el);
                        var customer = that.responseData.value.customer;
                        if (customer && customer.customerID > 0) {
                            nocustomerInfoWarpEl.hide();
                            havecustomerInfoWarpEl.show();
                        } else {
                            nocustomerInfoWarpEl.show();
                            havecustomerInfoWarpEl.hide();
                        }

                        break;
                }

            });

        },
        destroy: function () {
        	this.feedpublish && (this.feedpublish.destroy());
        	this.modifyCompetitorDialog && (this.modifyCompetitorDialog.destroy());
        }
    });


    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var queryParams = util.getTplQueryParams2();   //取地址栏的参数格式示例 /=/tagType-4
        var showContract = new ShowContract({
            element: tplEl,
            queryParams: queryParams
        });
        showContract.load();
    };

});