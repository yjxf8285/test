/**
 * crm发布销售记录
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

 define(function(require, exports, module){
    
    var root = window,
         FS = root.FS;
    var Widget=require('widget');
    var tpl = require('modules/crm-publish/crm-publish.html');
//    var tplStyle = require('modules/crm-publish/crm-publish.css');
    var util = require('util');
    var fsQxhelper = require('modules/fs-qx/fs-qx-helper');
    var Uploader = fsQxhelper.Uploader;
    var ContactsDialog=require('modules/crm-select-contacts/crm-select-contacts');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var moment = require('moment');
    var NProgress = require('nprogress');
    var Events = require('events');
    var filter = require('filter');
    var Dialog = require('dialog');
    var Tabs = require('uilibs/tabs');
    var Scrollbar=require('scrollbar');
    var publish=require('modules/publish/publish');
    var TimeSelect=publish.timeSelect;
    var contactData=util.getContactData();
    
    /**
     * 插入话题弹框
     * @type {*}
     */
    var TopicDialog=Dialog.extend({
        "attrs":{
            "content":$(tpl).filter('.topic-dialog-tpl').html(),
            "className":"fs-publish-topic-dialog",
            "width":240,
            "height":412,
            "hasMask":false,
            "listPath":"/Topic/GetRecentlySendAndNewTopics" //默认请求投票列表数据
            /*"data":[{
                "title":"常用话题",
                "list":[{
                    "name":"研发每日计划"
                },{
                    "name":"研发周计划"
                }]
            },{
                "title":"最新话题",
                "list":[{
                    "name":"研发每日计划"
                },{
                    "name":"研发周计划"
                }]
            }]*/
        },
        "events":{
            "mouseenter .topic-item":"_enterTopicItem",
            "mouseleave .topic-item":"_leaveTopicItem",
            "click .topic-item":"_clickTopicItem",
            "click .insert-topic-btn":"_clickInsertBtn",
            "click .f-cancel":"hide"
        },
        "setup":function(){
            var result=TopicDialog.superclass.setup.apply(this,arguments);
            return result;
        },
        "render":function(){
            var result=TopicDialog.superclass.render.apply(this,arguments);
            this._renderList();
            return result;
        },
        /**
         * 鼠标进入topicItem触发
         * @param evt
         */
        "_enterTopicItem":function(evt){
            var topicEl=$(evt.target);
            topicEl.addClass('state-hover');
        },
        /**
         * 鼠标离开topicItem触发
         * @param evt
         */
        "_leaveTopicItem":function(evt){
            var topicEl=$(evt.target);
            topicEl.removeClass('state-hover');
        },
        /**
         * 鼠标点击topic item触发
         * @param evt
         */
        "_clickTopicItem":function(evt){
            var topicEl=$(evt.target),
                keyId=topicEl.attr('keyid');
            var itemData=this.getItemData(keyId);
            //触发itemclick事件
            this.trigger('itemclick',itemData);
        },
        /**
         * 点击插入话题按钮触发inserttopic事件
         * @param evt
         */
        "_clickInsertBtn":function(evt){
            //触发inserttopic事件
            this.trigger('inserttopic');
        },
        /**
         * 渲染话题列表
         */
        "_renderList":function(){
            //var data=this.get('data');
            var that=this;
            var listPath=this.get('listPath');
            util.api({
                "url":listPath,
                "type":"get",
                "success":function(responseData){
                    var dataRoot,
                        dataStore=[];
                    if(responseData.success){
                        dataRoot=responseData.value;
                        _.each(dataRoot,function(cateData,key){
                            var cateTitle=(key=="recentlyTopics"?"常用话题":"最新话题");
                            var listData=[];
                            _.each(cateData,function(name){
                                name= _.str.trim(name);   //去掉左右空格
                                if(!_.some(listData,function(itemData){   //去重
                                    return itemData.name==name;
                                })){
                                    listData.push({
                                        "name":name
                                    });
                                }
                            });
                            //存储数据
                            dataStore.push({
                                "title":cateTitle,
                                "list":listData,
                                "key":key
                            });
                        });
                        //保存数据
                        that.dataStore=dataStore;
                        //创建html
                        that._createListHtml(dataStore);
                    }

                }
            });
        },
        /**
         * 渲染列表到页面
         */
        "_createListHtml":function(dataStore){
            var elEl=this.element,
                cateListEl=$('.cate-list',elEl);
            var htmlStr="";
            _.each(dataStore,function(cateData,i){
                var cateTitle=cateData.title,
                    listData=cateData.list;
                var htmlStr2='';
                htmlStr+='<li class="cate-item"><div class="cate-title">'+cateTitle+'</div><ul class="topic-list">';
                _.each(listData,function(itemData,j){
                    htmlStr2+='<li class="topic-item" keyid="'+i+'-'+j+'">'+itemData.name+'</li>';
                });
                htmlStr+=htmlStr2+'</ul><li>';
            });
            cateListEl.html(htmlStr);
        },
        /**
         * 通过keyId(cateIndex-itemIndex形式)获取对应的data信息
         * @param keyId
         */
        "getItemData":function(keyId){
            var keyIdArr=keyId.split('-');
            var data=this.dataStore;
            return data[keyIdArr[0]].list[keyIdArr[1]];
        }
    });
    /**
     * 选人或可视范围面板
     */
    var SelectPanel = function (opts) {
        opts = _.extend({
            "trigger": null,
            "singleCked": false,
            "zIndex":200000,
            "data": [
                {
                    "title": "标题 A",
                    "type": "a",
                    "sortType":"letter",    //排序方式，letter表示按字母排序，origin表示按原来顺序排序
                    "list": [
                        {
                            "name": "测试",
                            "id": "test",
                            "spell": "test"
                        },
                        {
                            "name": "测试a",
                            "id": "test2",
                            "spell": "aest"
                        },
                        {
                            "name": "测试b-1",
                            "id": "test3",
                            "spell": "best"
                        },
                        {
                            "name": "测试b-2",
                            "id": "test4",
                            "spell": "best"
                        }
                    ]
                },
                {
                    "title": "标题 B",
                    "type": "b",
                    "unitSuffix":"位同事",
                    "list": [
                        {
                            "name": "测试A",
                            "id": "test1",
                            "spell": "aest"
                        }
                    ]
                },
                {
                    "title": "标题 B",
                    "type": "c",
                    "list": [
                        {
                            "name": "测试b",
                            "id": "test1",
                            "spell": "best"
                        }
                    ]
                }
            ]
        }, opts || {});
        var panelTpl = '<div class="fs-contact-letter-nav fn-clear"></div><div class="fs-contact-list-wrapper"><ul class="fs-contact-list"></ul></div>';
        var navHtmlStr = '',
            panelHtmlStr = '';
        _.each(opts.data, function () {
            navHtmlStr += '<li class="ui-tab-item" data-role="trigger"></li>';
            panelHtmlStr += '<div data-role="panel" class="ui-tab-panel fn-clear">' + panelTpl + '</div>';
        });
        var triggerEl = $(opts.trigger);
        var dialog = new Dialog(_.extend({
            hasMask: false,
            width: 250,
            height: 425,
            className: "fs-contact-dialog",
            content: '<div class="fs-contact-content"><div class="fs-contact-tabs ui-tab"><ul class="ui-switchable-nav ui-tab-items" data-role="nav">' +
                navHtmlStr +
                '</ul><div class="ui-switchable-content">' + panelHtmlStr + '</div></div>' +
                '<div class="fs-contact-bbar fn-clear"><div class="fs-contact-summary">共有<span class="num">0</span>位同事</div><div class="fs-contact-action"><button class="fs-contact-close-btn button-cancel">关闭</button></div></div>' +
                '</div>',
            align: {
                selfXY: ['right', 0],     // element 的定位点，默认为左上角
                baseElement: triggerEl,     // 基准定位元素，默认为当前可视区域
                baseXY: [triggerEl.width(), triggerEl.height()]      // 基准定位元素的定位点，默认为左上角
            },
            "zIndex": opts.zIndex
        }, opts.dialogOpts || {})).render();
        var tab = new Tabs(_.extend({
            element: $('.fs-contact-tabs', dialog.element),
            triggers: $('.ui-tab-item', dialog.element),
            panels: $('.ui-tab-panel', dialog.element),
            activeIndex: 0,
            triggerType: 'click',
            withTabEffect: false
            //effect: 'fade'
        }, opts.tabOpts || {})).render();

        this.opts = opts;
        this.dialog = dialog;
        this.tab = tab;
        //保留每个实例的引用
        SelectPanel.ins.push(this);
        //自定义滚动条
        //this.scrollBarIns=[];
        this.init();
        $('.fs-contact-list-wrapper',dialog.element).each(function(){
            new Scrollbar({
                "element":$(this)
            });
        });
    };
    _.extend(SelectPanel.prototype, {
        "init": function () {
            var that = this;
            var opts = this.opts,
                data = opts.data;
            _.each(data, function (row, i) {
                that.updateTab(row, i);
            });
            this.bindEvents();
        },
        /**
         * 判断是否可见
         */
        "isVisible":function(){
            var dialog=this.dialog;
            return dialog.element.is(':visible');
        },
        /**
         * 更新数据源，重绘组件
         * @param listData
         */
        "updateData":function(listData){
            var that=this;
            _.each(listData, function (row, i) {
                that.updateTab(row, i);
            });
        },
        "updateTab": function (data, i) {
            var title = data.title,
                type = data.type,
                list = data.list;
            var dialog = this.dialog,
                tab = this.tab,
                tabNavEl = tab.get('triggers').eq(i),
                tabPanelEl = tab.get('panels').eq(i);
            tabNavEl.html('<a href="javascript:;">' + title + '</a>');
            tabPanelEl.attr('emptype', type);
            //tabNavEl.html(title);
            this.doTabPanel(tabPanelEl, data);
        },
        "doTabPanel": function (panelSelector, data) {
            var panelEl = $(panelSelector),
                letterNavEl = $('.fs-contact-letter-nav', panelEl),
                listEl = $('.fs-contact-list', panelEl),
                letterNavEl;
            var i, htmlStr = '<li>★</li>';
            var list=data.list, //列表数据
                sortType=data.sortType||"letter", //排序类型,letter表示按字母排序，origin表示遵循原来列表顺序
                unitSuffix=data.unitSuffix||"位同事";  //footer提示后缀
            var groupList,
                groupKeys;
            letterNavEl.html('<ul class="list-0"></ul><ul class="list-1"></ul>');
            for (i = 65; i <= 77; i++) {
                htmlStr += '<li>' + String.fromCharCode(i) + '</li>';
            }
            $('.list-0', letterNavEl).html(htmlStr);
            htmlStr = '';
            for (i = 78; i <= 90; i++) {
                htmlStr += '<li>' + String.fromCharCode(i) + '</li>';
            }
            htmlStr += '<li>#</li>';
            $('.list-1', letterNavEl).html(htmlStr);
            //获得letter navs
            letterNavEl = $('li', letterNavEl);
            //构建contact list列表
            htmlStr = '';
            if(sortType=="letter"){     //按字母排序
                groupList = this.groupByLetter(list);
                groupKeys = _.sortBy(_.keys(groupList), function (v) {
                    if (v == 'starred') {
                        return 64; // 星标的key排列在A的前面
                    }
                    return v.charCodeAt(0) == 35 ? 91 : v.charCodeAt(0); //35为#号 排在Z后面
                });
                _.each(groupKeys, function (key) {
                    var item = groupList[key];
                    var len = item.length,
                        htmlStr2 = '';
                    if (key == 'starred') { // 改变星标样式
                        htmlStr += '<li><div class="index-box fn-clear"><div class="index-keyword index-keyword-starred">★</div><div class="item-length">' + len + '项</div></div><ul class="fs-contact-view">';
                    } else {
                        htmlStr += '<li><div class="index-box fn-clear"><div class="index-keyword">' + key + '</div><div class="item-length">' + len + '项</div></div><ul class="fs-contact-view">';
                    }
                    _.each(item, function (subItem) {
                        if (subItem.type == 'g') {
                            subItem.profileImage = FS.ASSETS_PATH + '/images/group_default_50x50.png';
                        }
                        htmlStr2 += '<li class="fs-contact-item" itemid="' + subItem.id + '"><div class="contact-item-pic"><img src="'+ subItem.profileImage +'" /></div><span class="contact-item-name">'+ subItem.name +'</span></li>';
                    });
                    htmlStr += htmlStr2 + '</ul></li>';
                    //设置导航高亮
                    if (key == 'starred') {
                        letterNavEl.eq(0).addClass('fs-contact-letter-selected');
                        return;
                    }                    
                    letterNavEl.each(function () {
                        var meEl = $(this),
                            letter = meEl.text();
                        if (letter == key) {
                            meEl.addClass('fs-contact-letter-selected');
                        }
                    });
                });
                listEl.html(htmlStr);
            }else if(sortType=="origin"){   //按原序排
                htmlStr +='<ul class="fs-contact-view">';
                _.each(list, function (item) {
                    if (item.type == 'g') {
                        item.profileImage = FS.ASSETS_PATH + '/images/group_default_50x50.png';
                    }
                    htmlStr += '<li class="fs-contact-item" itemid="' + item.id + '"><div class="contact-item-pic"><img src="'+ item.profileImage +'" /></div><span class="contact-item-name">'+ item.name +'</span></li>';
                });
                htmlStr +='</ul>';
                listEl.html(htmlStr);
            }
            panelEl.data('unitSuffix',unitSuffix);
            this.updateSummary();
        },
        "show": function (emitEvent) {
            //修正对dialog定位
            var opts=this.opts,
                dialogOpts=opts.dialogOpts||{};
            var triggerEl = $(this.opts.trigger);
            this.dialog.set('align', _.extend({
                selfXY: ['right', 0],     // element 的定位点，默认为左上角
                baseElement: triggerEl,     // 基准定位元素，默认为当前可视区域
                baseXY: [triggerEl.width(), triggerEl.height()]      // 基准定位元素的定位点，默认为左上角
            },dialogOpts.align||{}));
            this.dialog.show();
            if(emitEvent!==false){  //默认触发show事件，除非emitEvent===false
                this.trigger('show');
            }

        },
        "hide": function (emitEvent) {  //默认触发hide事件，除非emitEvent===false
            this.dialog.hide();
            if(emitEvent!==false){
                this.trigger('hide');
            }
        },
        "groupByLetter": function (list) {
            var groupList = [];
            groupList = _.groupBy(list, function (v) {
                var key = v.spell.slice(0, 1).toUpperCase(),
                    keyCode = key.charCodeAt(0);
                    
                // 暂无接口 用M数据模拟个图标的
                if (v.isAsterisk) { return 'starred'; }
                
                if (keyCode >= 65 && keyCode <= 90) {
                    return key;
                } else {
                    return '#';
                }
            });
            return groupList;
        },
        "updateSummary": function () {
            var tab = this.tab,
                dialog = this.dialog,
                dialogEl = dialog.element,
                activenPanelEl=tab.get('panels').eq(tab.get("activeIndex")),
                contactItemEl = $('.fs-contact-item', activenPanelEl),
                selectedItemEl = contactItemEl.filter('.fs-contact-item-selected'),
                summaryEl = $('.fs-contact-summary', dialogEl);
            var unitSuffix=activenPanelEl.data('unitSuffix');
            if (selectedItemEl.length > 0) {
                summaryEl.html('已选中' + selectedItemEl.length + '/' + contactItemEl.length);
            } else {
                summaryEl.html('共有' + contactItemEl.length + unitSuffix);
            }
        },
        /**
         * [ description]
         * @param  {[type]} ids   [description]
         * @param  {[type]} reset 是否清空原来选中项
         * @return {[type]}       [description]
         */
        //"select": function (ids, type, reset) {
        "select": function (ids, type, silent) {
            var opts=this.opts;
            var tab = this.tab,
                tabEl = tab.element,
                tabPanelEl = tab.get('panels'),
                itemsEl;
            var eventData = {};   //select事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $('.fs-contact-item', tabEl);
                tabPanelEl.each(function () {
                    var meEl = $(this),
                        empType = meEl.attr('emptype');
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $('.fs-contact-item', $('[emptype="' + type + '"]', tabEl));
                eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr('emptype')] = [];
            }

            if (ids[0] == "all") {
                itemsEl.addClass('fs-contact-item-selected');
                //设置select事件数据
                itemsEl.each(function () {
                    var meEl = $(this),
                        panelEl = meEl.closest('.ui-tab-panel'),
                        itemId = meEl.attr('itemid'),
                        empType = panelEl.attr('emptype');
                    eventData[empType].push({
                        "name": meEl.text(),
                        "id": itemId
                    });
                });
            } else {
                /*if (!!reset) {
                    itemsEl.removeClass('fs-contact-item-selected');
                }*/
                _.each(ids, function (id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.addClass('fs-contact-item-selected');
                    //设置select事件数据
                    itemEl.each(function () {
                        var meEl = $(this),
                            panelEl = meEl.closest('.ui-tab-panel'),
                            itemId = meEl.attr('itemid'),
                            empType = panelEl.attr('emptype');
                        eventData[empType].push({
                            "name": meEl.text(),
                            "id": itemId
                        });
                    });
                });
            }
            if(opts.singleCked){    //如果是单选的话，选中后隐藏
                this.hide();
            }
            if(!silent){
                this.trigger('select', eventData);
            }
        },
        /**
         * 取消选中动作
         * @param ids
         * @param type
         * @param silent
         */
        "unselect": function (ids, type,silent) {
            var tab = this.tab,
                tabEl = tab.element,
                tabPanelEl = tab.get('panels'),
                itemsEl;
            var eventData = {};  //unselect事件数据
            ids = [].concat(ids);
            if (type == "all") {
                itemsEl = $('.fs-contact-item', tabEl);
                tabPanelEl.each(function () {
                    var meEl = $(this),
                        empType = meEl.attr('emptype');
                    eventData[empType] = [];
                });
            } else {
                itemsEl = $('.fs-contact-item', $('[emptype="' + type + '"]', tabEl));
               // eventData[tabPanelEl.filter('[emptype="' + type + '"]').attr('emptype')] = [];
                eventData[type] = [];
            }

            if (ids[0] == "all") {
                itemsEl.removeClass('fs-contact-item-selected');
                //设置unselect事件数据
                itemsEl.each(function () {
                    var meEl = $(this),
                        panelEl = meEl.closest('.ui-tab-panel'),
                        itemId = meEl.attr('itemid'),
                        empType = panelEl.attr('emptype');
                    eventData[empType].push({
                        "name": meEl.text(),
                        "id": itemId
                    });
                });
            } else {
                _.each(ids, function (id) {
                    var itemEl = itemsEl.filter('[itemid="' + id + '"]');
                    itemEl.removeClass('fs-contact-item-selected');
                    //设置unselect事件数据
                    itemEl.each(function () {
                        var meEl = $(this),
                            panelEl = meEl.closest('.ui-tab-panel'),
                            itemId = meEl.attr('itemid'),
                            empType = panelEl.attr('emptype');
                        eventData[empType].push({
                            "name": meEl.text(),
                            "id": itemId
                        });
                    });
                });
            }
            if(!silent){
                this.trigger('unselect', eventData);
            }
        },
        "bindEvents": function () {
            var that = this;
            var tab = this.tab,
                tabEl = tab.element,
                dialog = this.dialog,
                dialogEl = dialog.element,
                opts = this.opts,
                triggerEl=$(opts.trigger);
            tabEl.on('click', '.fs-contact-item', function (e) {
                var meEl = $(this),
                    panelEl = meEl.closest('.ui-tab-panel'),
                    itemId = meEl.attr('itemid'),
                    empType = panelEl.attr('emptype');
                if (meEl.hasClass('fs-contact-item-selected')) {
                    //meEl.removeClass('fs-contact-item-selected');
                    that.unselect(itemId, empType);
                } else {
                    if (opts.singleCked) {
                        that.unselect('all', 'all');
                    }
                    that.select(itemId, empType);
                }
                that.updateSummary();
            });
            tab.on('switched', function (toIndex, fromIndex) {
                var curPanelEl = tab.get('panels').eq(toIndex),
                    listWEl=$('.fs-contact-list-wrapper',curPanelEl);
                that.updateSummary();
                //自定义滚动条更新
                listWEl.data('ins').update();
            });
            dialog.after('show',function(){   //打开后滚到最上面
                var elEl=this.element,
                    listWEl=$('.fs-contact-list-wrapper',elEl);
                //listWEl.scrollTop(0);
                listWEl.data('ins').update();
            });
            dialogEl.click(function (e) {
                e.stopPropagation();
            });
            dialogEl.on('click', '.fs-contact-close-btn', function () {
                that.hide();
            }).on('click','.ui-dialog-close',function(){
                that.trigger('hide');
            });
            //点击字母导航到对应条目开始
            tabEl.on('click','.fs-contact-letter-selected',function(){
                var meEl=$(this),
                    letter=meEl.text(),
                    listWEl=meEl.closest('.ui-tab-panel').find('.fs-contact-list-wrapper'),
                    contactListEl=$('.fs-contact-list',listWEl),
                    letterItem;
                $('li',contactListEl).each(function(){
                    var itemEl=$(this),
                        indexKeywordEl=$('.index-keyword',itemEl);
                    if(indexKeywordEl.text()==letter){
                        letterItem=itemEl;
                        return false;   //中断循环
                    }
                });
                if(letterItem){
                    //listWEl.scrollTop(letterItem.position().top);
                    listWEl.data('ins').update(letterItem.position().top);
                }
            });
            //点击trigger显示面板
            triggerEl.click(function (e) {
                //隐藏其它instance
                _.each(_.filter(SelectPanel.ins, function (item) {
                    return item !== that;
                }), function (item) {
                    item.hide();
                });
                if(that.dialog.element.is(':visible')){
                    that.hide();
                }else{
                    that.show();
                }
                that.updateSummary();
                //e.stopPropagation();
                e.preventDefault();
            });

            /*this.regHide = util.regDocEvent('click', function () {
                that.hide();
            });*/
            util.regGlobalClick(this.dialog.element,function(evt){
                var targetEl=$(evt.target);
                if(triggerEl.length>0&&(!$.contains(triggerEl[0],targetEl[0]))&&(triggerEl[0]!==targetEl[0])){  //判定点击dom不是trigger本身或者不包含在trigger里
                    if(that.dialog.element.is(':visible')){
                        that.hide();
                    }
                }
            });

        },
        "destroy": function () {
            var that = this;
            var opts = this.opts;
            this.dialog.destroy();
            this.tab.destroy();
            this.off(); //注销事件
            $(opts.trigger).unbind('click');
            //util.unRegDocEvent('click', this.regHide);
            //清空引用
            SelectPanel.ins = _.filter(SelectPanel.ins, function (item) {
                return item !== that;
            });
        }
    });
    SelectPanel.ins = [];
    Events.mixTo(SelectPanel);
 	var Publish = Widget.extend({
 		"attrs":{
 			"element":null,//need to set
            "title":"",
            "placeholder":"发布新建销售记录...",
            "type":"event",//event,feed
            "isContact":false,
            "attachUploader":null,
            "attachNumber":0,
            "attachSize":0,
            "pictureNumber":0,
            "pictureSize":0,
            "files":[],
            "flashFiles":[],
            "activeUploader":"attach",//picture and attach
            "contactsDialog":null,
            "contacts":[],
            "startDate":null,
            "alarmDate":null,
            "contactData":util.getContactData(true),
            "condition":{},
            "suportH5":true,
            "eventCondition":{
                "associationContactIDs":"",// string，关联联系人ID集合，逗号分隔
                "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件集合
                "isAllDayEvent":false,// bool，是否全天事件
                "startTime":0,// long，事件开始提醒时间
                "remindType":1,// int，全部 = 0,不提醒 = 1,销售记录发生时= 2,5分钟前 = 3,15分钟前= 4,30分钟前= 5,1小时前= 6,2小时前= 7,6小时前= 8,1天前= 9,2天前= 10,自定义时间= 11
                "remindTime":0,// long，自定义时间
                "isSentSms":false,// bool，是否发送短信
                "feedContent":"",// string，事件内容
                "parentFeedID":0, //int，父事件ID
                "listTagOptionID":[],// List<string>，销售记录标签选项列表(string格式为 标签ID和标签选项ID，用逗号隔开)，除销售记录外选其他标签会报错
                "fbrType":0,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                            //1，与客户关联，dataID：客户ID；DataID1：联系人ID
                            //2,与联系人关联，DataID：客户ID；DataID1：联系人ID
                            //3,与机会关联，DataID：客户ID；DataID1：联系人ID列表；DataID2：机会ID
                "customerID":0,// int，数据ID
                "contactIDs":0// string，数据ID1
            },
            "feedCondition":{
                "fileInfos":[],// List<ParamValue<int, string, int, string>>，附件
                "feedContent":"",// string，Feed内容
                "fbrType":0,// int，信息源与业务关系类型:枚举参照 FeedBusinessRelationType
                            //4，与产品关联，dataID：产品ID；
                            //5,与对手关联，dataID：对手ID；
                            //6，与合同关联，dataID：合同ID；
                            //7，与市场活动关联，dataID：市场活动ID；
                            //8，销售线索关联，dataID：线索ID
                "dataID":0// int，数据ID
            },
            "display":["time","contact","picture","attach","tag"]
 		},

 		"events":{
 			"click .crm-publish-button-ok":"_publish",//发布按钮
            "click .crm-publish-button-cancel":"_cancel",//取消按钮
            "click .crm-publish-operation div":"_showOperation",//显示操作栏
            "mousedown .crm-publish-content":"_active",//开始输入
            "mouseover .crm-publish-operation-event-tag":"_tagMouseover",
            "mouseout .crm-publish-operation-event-tag":"_tagMouseout",
            "mouseover .crm-publish-operation-attach-box":"_attachMouseover",
            "mouseout .crm-publish-operation-attach-box":"_attachMouseout",
            "mouseover .crm-publish-operation-picture-box":"_pictureMouseover",
            "mouseout .crm-publish-operation-picture-box":"_pictureMouseout",
            "mouseover .crm-publish-operation-contact-box":"_contactMouseover",
            "mouseout .crm-publish-operation-contact-box":"_contactMouseout",
            "click .crm-publish-operation-tag-option-item":"_optionClick",
            "click .crm-publish-operation-picture-add":"_pictureUpload",
            "click .crm-publish-operation-picture-close":"_pictureDelete",
            "click .crm-publish-operation-attach-add":"_attachUpload",
            "click .crm-publish-operation-attach-close":"_attachDelete",
            "click .crm-publish-operation-contact-add":"_showContactDialog",
            "click .crm-publish-operation-contact-close":"_contactDelete",
            "propertychange .crm-publish-content":"_contentChange",
            "input .crm-publish-content":"_contentChange",
            "keyup .crm-publish-content":"_contentChange",
            "blur .crm-publish-content":"_contentChange"
 		},

 		"setup":function(){
 			var result = Publish.superclass.render.apply(this,arguments);
 			this._init();
 			return result;
 		},

 		"render":function(){
 			var result = Publish.superclass.render.apply(this,arguments);
 			return result;
 		},
 		/**
         * 获取默认的at功能中select panel的数据源
         */
        "atGetDefaultSpData":function(){
            var contactData=util.getContactData(true); //完整的一份拷贝，防止单体contactData被污染覆盖
            var spData,
                spData1=[], //第一部分数据，常用联系人
                spData2=contactData["p"], //第二部分数据，全部同事
                spData3=contactData["g"], //第三部分数据，全部部门
                lastAtData=util.getPersonalConfig('lastAtData');
            _.each(lastAtData,function(itemData,i){
                var cacheData=util.getContactDataById(itemData.dataID,itemData.isCircle?"g":"p");
                if(cacheData){   //可能被离职
                    spData1.push({
                        "name":cacheData.name,
                        "id":cacheData.id,
                        "spell":cacheData.spell,
                        "type": cacheData.type,
                        "profileImage": cacheData.profileImage
                    });
                }

            });
            //过滤掉全公司
            spData1= _.reject(spData1,function(itemData){
                return itemData.id==999999;
            });
            spData3= _.reject(spData3,function(itemData){
                return itemData.id==999999;
            });
            spData=[{
                "title":"最近",
                "type":"mix",   //包含p和g两种类型
                "sortType":"origin",    //按原来顺序排
                "list":spData1
            },{
                "title":"同事",
                "unitSuffix":"位同事",
                "type":"p",
                "list":spData2
            },{
                "title":"部门",
                "unitSuffix":"个部门",
                "type":"g",
                "list":spData3
            }];
            return spData;
        },
        "_showOperation":function(e){
            var currentEl = $(e.currentTarget);
            var currentElName = currentEl.attr("name");
            var activeOne = $(".crm-publish-operation-active",this.element);
            if(activeOne.length > 0){
                var name = activeOne.attr("name");
                activeOne.removeClass("crm-publish-operation-active");
                $(".crm-publish-operation-"+name+"-container",this.element).hide();    
            }
            currentEl.addClass("crm-publish-operation-active");
            if(currentElName == "tag"){
                $(".crm-publish-operation-"+currentElName+"-container",this.element).css({"left":19,"top":-1});
            }
//            if(currentElName == "time"){
//                var startDate = this.get("startDate");
//                var hour = moment().hour();
//                var minute = moment().minute();
//                startDate.setValue(moment());
//                util.mnSetter($(".crm-publish-operation-time-start-time",this.element),hour);
//                util.mnSetter($(".crm-publish-operation-time-start-minute",this.element),Math.floor(minute/10)*10);
//            }


            if(currentElName == "attach"){
                this.set("activeUploader","attach");
            }
            if(currentElName == "picture"){
                this.set("activeUploader","picture");
            }
            if(currentElName == "attach" || currentElName == "picture") {
            	$(".crm-publish-operation-attach-div object",this.element).show();
            } else {
            	$(".crm-publish-operation-attach-div object",this.element).hide();
            }
            
            $(".crm-publish-operation-"+currentElName+"-container",this.element).show();
            if (!this.get("suportH5")){
                if(currentElName == "attach" || currentElName == "picture"){
                    this._setFileInputPosition();
                }
                if(currentElName == "attach"){
                    this.get("attachUploader").core.core.setFileTypes("*.*", "文件");
                }
                if(currentElName == "picture"){
                    this.get("attachUploader").core.core.setFileTypes("*.jpg;*.gif;*.jpeg;*.png", "图片");
                }
            }
            if(currentElName=="topic") {
            	
            }
        },

        "_setFileInputPosition":function(){
            var name = this.get("activeUploader");
            var selectDiv = $(".crm-publish-operation-attach-div",this.element);
            if (this.get("suportH5")){   
                selectDiv.hide();
                return;
            }else{
                var file = $(".crm-publish-operation-attach-div object",this.element);
                
                var selectBtn = $(".crm-publish-operation-"+name+"-add",this.elment).last();
                var container = $(".crm-publish-operation-picture-operation",this.element);
                selectDiv.show();
                file.css({"width":selectBtn.width(),"height":selectBtn.height(),"left":selectBtn.position().left,"top":selectBtn.position().top});
            }
        },

        "_tagMouseover":function(e){
            var currentEl = $(e.currentTarget);
            var ctner = $('.crm-publish-operation-tag-container', this.element);
            var fBusinessTagID = currentEl.attr("data-fBusinessTagID");
            var top = currentEl.position().top;
            var optionEl = $(".crm-publish-operation-tag-"+fBusinessTagID,this.element);
            optionEl.show();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if($(window).height() < (currentEl.offset().top-scrollTop) + optionEl.height()){
                top = (currentEl.offset().top - ctner.offset().top) - optionEl.height() + 23;
                if(currentEl.offset().top-$('.bd').offset().top < optionEl.height()) {
                	top = 0 - (ctner.offset().top - ($('.bd').offset().top));
                }
            }
            optionEl.css({"left":currentEl.position().left+200,"top":top});
        },

        "_tagMouseout":function(e){
            var currentEl = $(e.currentTarget);
            var fBusinessTagID = currentEl.attr("data-fBusinessTagID");
            $(".crm-publish-operation-tag-"+fBusinessTagID,this.element).hide();
        },

        "_attachMouseover":function(e){
            var currentEl = $(e.currentTarget);
            $(".crm-publish-operation-attach-close",currentEl).show();
        },

        "_attachMouseout":function(e){
            var currentEl = $(e.currentTarget);
            $(".crm-publish-operation-attach-close",currentEl).hide();
        },

        "_pictureMouseover":function(e){
            var currentEl = $(e.currentTarget);
            var close = $(".crm-publish-operation-picture-close",currentEl);
            close.css({"top":currentEl.position().top+10,"left":currentEl.position().left + 122});
            close.show();
        },

        "_pictureMouseout":function(e){
            var currentEl = $(e.currentTarget);
            $(".crm-publish-operation-picture-close",currentEl).hide();
        },

        "_contactMouseover":function(e){
            var currentEl = $(e.currentTarget);
            var close = $(".crm-publish-operation-contact-close",currentEl);
            close.css({"top":currentEl.position().top+10,"left":currentEl.position().left + 122});
            close.show();
        },

        "_contactMouseout":function(e){
            var currentEl = $(e.currentTarget);
            $(".crm-publish-operation-contact-close",currentEl).hide();
        },

        "_publish":function(e){
            var currentEl = $(e.currentTarget);
            if(currentEl.hasClass("crm-publish-button-disable")){
                return;
            }
            this._startUpload();        
        },

        "_cancel":function(){
            $(".crm-publish-content",this.element).val("");
            $(".crm-publish-content",this.element).removeClass("crm-publish-content-active").css('height', '');
            $(".crm-publish-button-ok",this.element).addClass("crm-publish-button-disable");
            $(".crm-publish-operation",this.element).hide();
            $(".crm-publish-foot",this.element).hide();
            $(".crm-publish-operation-active",this.element).removeClass("crm-publish-operation-active");
//            $(".crm-publish-operation-time-start-time",this.element).show();
//            $(".crm-publish-operation-time-start-minute",this.element).show();
            util.mnSetter($(".crm-publish-operation-time-alarm-select",this.element),1);
            $(".crm-publish-operation-time-alarm-date",this.element).hide();
            $(".crm-publish-operation-time-alarm-time",this.element).hide();
            $(".crm-publish-operation-time-alarm-minute",this.element).hide();
            $(".crm-publish-operation-time-alarm-info",this.element).hide();
            $(".crm-publish-operation-time",this.element).removeClass("crm-publish-operation-time-selected");
            $(".crm-publish-operation-time-container",this.element).hide();
            this.set("contacts",[]);
            $(".crm-publish-operation-contact-list",self.element).empty();
            $(".crm-publish-operation-contact",this.element).removeClass("crm-publish-operation-contact-selected");
            $(".crm-publish-operation-contact-num",this.element).hide();
            $(".crm-publish-operation-contact-container",this.element).hide();
            this.set("attachNumber",0);
            this.set("attachSize",0);
            $(".crm-publish-operation-attach-list",self.element).empty();
            $(".crm-publish-operation-attach",this.element).removeClass("crm-publish-operation-attach-selected");
            $(".crm-publish-operation-attach-num",this.element).hide();
            $(".crm-publish-operation-attach-info",this.element).hide();
            $(".crm-publish-operation-attach-container",this.element).hide();
            this.set("pictureNumber",0);
            this.set("pictureSize",0);
            this.get('startDate').clear();
            this.get('ts').clear();
            $(".crm-publish-operation-picture-list",self.element).empty();
            $(".crm-publish-operation-picture",this.element).removeClass("crm-publish-operation-picture-selected");
            $(".crm-publish-operation-picture-num",this.element).hide();
            $(".crm-publish-operation-picture-info",this.element).hide();
            $(".crm-publish-operation-picture-container",this.element).hide();
            $(".crm-publish-operation-tag",this.element).removeClass("crm-publish-operation-tag-selected");
            $(".crm-publish-operation-tag-container",this.element).hide();
            $(".crm-publish-operation-event-tag-selected",this.element).removeClass("crm-publish-operation-event-tag-selected");
            $(".mn-selected.crm-publish-operation-tag-option-radio",this.element).removeClass("mn-selected");
            $("span[data-isDefault='true']",this.element).addClass("mn-selected");
            if(this.get("files").length > 0){
                this.get("attachUploader").removeAllFile();    
            }
            var condition = this.get("condition");
            condition.fileInfos = [];
            condition.feedContent = "";
            this.set("condition",condition);
            this.set("files",[]);
            $(".crm-publish-operation-attach-div",this.element).hide();
        },

        "_contentChange":function(){
            if($.trim($(".crm-publish-content",this.element).val()).length > 0){
                $(".crm-publish-button-ok",this.element).removeClass("crm-publish-button-disable");
            }else{
                $(".crm-publish-button-ok",this.element).addClass("crm-publish-button-disable");
            }
        },

 		//输入中
 		"_active":function(e){
            var currentEl = $(".crm-publish-content",this.element);
            if(!currentEl.hasClass("crm-publish-content-active")){
                currentEl.addClass("crm-publish-content-active");
                $(".crm-publish-operation",this.element).show();
                $(".crm-publish-foot",this.element).show();
            }
 		},

        "_optionClick":function(e){
            var currentEl = $(e.currentTarget);
            var radioEl = $(".mn-radio-item",currentEl);
            if(radioEl.hasClass("mn-selected")){
                return;
            }
            $(".mn-selected",currentEl.parent()).removeClass("mn-selected");
            //todo select tag
            radioEl.addClass("mn-selected");
            if(currentEl.attr("data-isDefault") == "true"){
                currentEl.parent().parent().parent().removeClass("crm-publish-operation-event-tag-selected");
            }else{
                currentEl.parent().parent().parent().addClass("crm-publish-operation-event-tag-selected");
            }
            if($(".crm-publish-operation-event-tag-selected",this.element).length>0){
                $(".crm-publish-operation-tag",this.element).addClass("crm-publish-operation-tag-selected");
            }else{
                $(".crm-publish-operation-tag",this.element).removeClass("crm-publish-operation-tag-selected");
            }
        },

 		//上传附件
 		"_attachUpload":function(){
            this.set("activeUploader","attach");
            var file = $(".crm-publish-operation-attach-input",this.element);
            file.attr("accept","*/*");
            if (this.get("suportH5")){
                /*
                *兼容世界之窗浏览器极速版
                *必须显示才能触发click事件
                */
                file.parent().show();   
                file.show().click().hide();
                file.parent().hide();
            }else{   
                util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }            
 		},

        //上传图片
        "_pictureUpload":function(){
            //var file = $(".crm-publish-operation-picture-input",this.element);
            this.set("activeUploader","picture");
            var file = $(".crm-publish-operation-attach-input",this.element);
            file.attr("accept","image/*");
            if (this.get("suportH5")){
                /*
                *兼容世界之窗浏览器极速版
                *必须显示才能触发click事件
                */
                file.parent().show();   
                file.show().click().hide();
                file.parent().hide();
            }else{
                util.alert("当前浏览器不能满足html5版的上传功能，请尝试其他浏览器");   
            }
        },

 		//初始化
 		"_init":function(){
            if (typeof(Worker) == "undefined"){
                this.set("suportH5",false);
            }
            this._initOthers();
            this._initTags();
            this._initAttachUploader();
            //this._initPictureUploader();
            this._initContactDialog();
            this._initStartDate();
            this._initAlarmDate();
            this._initTime();
            //this._getData();
            this._initAt();
            this._initTopic();
            this._initEvents();
 		},
 		
 		"_initTopic": function(){
 			var that = this,
 				elEl = this.element,
 				btnEl = $('.crm-publish-operation-topic', elEl),
 				opts = this.opts,
 				inputEl = $('.crm-publish-content', elEl);
            var topicDialog = new TopicDialog(_.extend({
                "trigger": btnEl,
                "align":{
                    "selfXY": [0, 0],     // element 的定位点，默认为左上角
                    "baseElement":btnEl,
                    "baseXY": [-227, 22]      // 基准定位元素的定位点，默认为左上角
                    //"baseXY": [-227, btnEl.height()]      // 基准定位元素的定位点，默认为左上角
                },
                "listPath":"/Topic/GetRecentlySendAndNewTopics"
            }, {})).render();
            //监听itemclick事件append到input对应的话题
            topicDialog.on('itemclick', function (itemData) {
                var currentInputEl=inputEl.filter('.fs-publish-topic-focus');
                if(currentInputEl.length==0){
                    currentInputEl=inputEl.eq(0);
                }
                util.appendInput(currentInputEl.get(0), '#' + itemData.name + '# ');
                that._contentChange();
                //触发keyup事件，显示话题提示
                currentInputEl.keyup();
                topicDialog.hide();
            });
            //监听inserttopic事件插入新话题模板
            topicDialog.on('inserttopic', function () {
                var currentInputDom=inputEl.filter('.fs-publish-topic-focus').get(0)||inputEl.eq(0).get(0);
                var cursorPos;
                util.appendInput(currentInputDom, '#请输入话题（最多10个字符，不能有空格）# ');
                that._contentChange();
                //input输入框自适应高度
                $(currentInputDom).trigger('autosize.resize');
                //获取光标位置
                cursorPos=util.getCursorPosition(currentInputDom);
                //触发keyup事件，显示话题提示
                $(currentInputDom).keyup();
                //先隐藏topic弹框
                topicDialog.hide();
                //选中模板，保证光标置于input内
                cursorPos.start=cursorPos.start-22;
                cursorPos.end=cursorPos.end-2;
                util.setCursorPosition(currentInputDom,cursorPos);
            });
            inputEl.change(function(){
                inputEl.trigger('autosize.resize');
            });
            inputEl.focus(function(){
                inputEl.removeClass('fs-publish-topic-focus');
                $(this).addClass('fs-publish-topic-focus');
            });
            //输入框话题提示
            //话题部分
            var remoteTimeId;
            util.asyncOrder(['jslibs/jquery.atwho.js','jslibs/jquery.atwho.custom.js'], function () {
                var filterHandler = filter.stringMatch;
                var topicData=topicDialog.dataStore;
                inputEl.atwho('#', {
                    //"data": topicData,
                    "data": '/Topic/Get10Topics',
                    "insertSeparator":false, //插入值时不包括"空格"分隔符
                    "emptyTipTpl":"没有搜索到话题",   //记录空的提示
                    "withEmptyTip":false,   //不显示空信息提示
                    "callbacks": {
                        "remote_filter":function(params, url, render_view){
                            var atViewTitleEl=$('#at-view .at-view-title'),
                                loadingEl=$('#at-view .loading-mask');
                            if(loadingEl.length==0){
                                loadingEl=$('<div class="loading-mask"><img src="'+FS.BLANK_IMG+'" class="loading-img" alt="loading" /></div>');
                                loadingEl.prependTo('#at-view');
                            }
                            if(atViewTitleEl.length==0){
                                atViewTitleEl=$('<h3 class="at-view-title"></h3>');
                                atViewTitleEl.prependTo('#at-view');
                            }
                            if(_.str.trim(params.q).length==0){
                                atViewTitleEl.hide();
                                loadingEl.hide();
                                render_view([]);
                                return;
                            }
                            loadingEl.show();
                            clearTimeout(remoteTimeId);
                            remoteTimeId=setTimeout(function(){
                                return util.api({
                                    "url":url,
                                    "type":"get",
                                    "data":{
                                        "keyword":params.q
                                    },
                                    "success":function(responseData){
                                        var items;
                                        if(responseData.success){
                                            items=responseData.value||[];
                                            atViewTitleEl.text('#相似话题#').show();
                                            loadingEl.hide();
                                            items=_.map(items,function(item){
                                                return {
                                                    "name":item
                                                };
                                            });
                                            render_view(items);
                                        }else{
                                            atViewTitleEl.hide();
                                            loadingEl.hide();
                                            render_view([]);
                                        }
                                    }
                                });
                            },80);

                        },
                        matcher: function (flag, subtext) {
                            var match, matched, regexp;
                            var content = this.$inputor.val(),
                                nextChar=content.slice(subtext.length,subtext.length+1),
                                subtextArr=subtext.split(/\n/),   //字符串切分成数组
                                flagCount=0; //按"#"分组，统计subtext中"#"出现的次数,要求出现odd数次
                            regexp = new RegExp(flag + '([^\\s|^#]*)$', 'gi');
                            match = regexp.exec(subtext);
                            subtextArr=subtextArr[subtextArr.length-1].split('');   //从最后一个换行符开始统计
                            for(var i= 0,len=subtextArr.length;i<len;i++){
                                if(subtextArr[i]=="#"){
                                    flagCount++;
                                }
                            }
                            matched = null;
                            //console.info(subtext);
                            if (flagCount%2==1&&nextChar=="#"&&match) {
                                matched = match[2] ? match[2] : match[1];
                            }
                            return matched;
                        },
                        sorter:function(query, items, searchKey){
                            return items;
                        }/*,
                        selector:function(itemEl){
                            return "few";
                            if (itemEl.length > 0) {
                                return _.str.trim(itemEl.data("value"));
                            }

                        }*/
                    }
                });
            });
            //点击全局隐藏
            topicDialog.element.on('click',function(evt){
                evt.stopPropagation();
            });
            util.regGlobalClick(topicDialog.element,function(evt){
                var targetEl=$(evt.target);
                if((btnEl[0]!==targetEl[0])&&(!$.contains(btnEl[0],targetEl[0]))){ //判定点击dom不是trigger本身或者不包含在trigger里
                    if(topicDialog.element.is(':visible')){
                        topicDialog.hide();
                    }
                }

            });
            this.topicDialog = topicDialog;
 		},
 		
 		"_initAt": function(){
 			var that=this,
	    		elEl = this.element,
	    		opts = this.opts,
	    		atSpData=this.atGetDefaultSpData();
	        var inputEl = $('.crm-publish-content', elEl);
	        //输入框中添加at提示
	        util.asyncOrder(['jslibs/jquery.atwho.js','jslibs/jquery.atwho.custom.js'], function () {
	            var filterHandler = filter.stringMatch;
	            //at联系人部分
	            inputEl.atwho('@', {
	                //"data": atSpData[1].list,
	                "data":contactData["p"].concat(_.reject(contactData["g"],function(circleData){  //排除全公司
	                    return circleData.id==999999;
	                })),
	                "callbacks": {
	                    "filter": function (query, data, search_key) {
	                        var stringMatch = filter.stringMatch,
	                            startsWith=filter.startsWith;
	                        var filterData=[],
	                            filterData1,
	                            filterData2;
	                        var atSpData2=that.atGetDefaultSpData();
	                        var atViewTitleEl=$('#at-view .at-view-title'),
	                            loadingEl=$('#at-view .loading-mask');
	                        if(loadingEl.length==0){
	                            loadingEl=$('<div class="loading-mask"><img src="'+FS.BLANK_IMG+'" class="loading-img" alt="loading" /></div>');
	                            loadingEl.prependTo('#at-view');
	                        }
	                        if(atViewTitleEl.length==0){
	                            atViewTitleEl=$('<h3 class="at-view-title"></h3>');
	                            atViewTitleEl.prependTo('#at-view');
	                        }
	                        //直接隐藏loading
	                        loadingEl.hide();
	                        if (_.str.trim(query).length == 0) {    //如果为空，显示常用联系人信息
	                            filterData=atSpData2[0].list.slice(0); //必须用副本，不然下次查询会被清除数据
	                            if(filterData.length>0){
	                                atViewTitleEl.text('选择最近@提到的或直接输入').show();
	                            }else{
	                                atViewTitleEl.hide();
	                            }
	                        } else {
	                            filterData1 = stringMatch.apply(this, [data, query, {
	                                "key": "name"
	                            }]);
	                            filterData2 = startsWith.apply(this, [data, query.toLowerCase(), {
	                                "key": "spell"
	                            }]);
	                            //先插入filterData2的数据
	                            _.each(filterData2,function(itemData){
	                                if(!_.find(filterData1,function(itemData2){
	                                    return itemData2.id==itemData.id;
	                                })){
	                                    filterData.push(itemData);
	                                }
	                            });
	                            filterData=filterData.concat(filterData1);
	                            //title提示
	                            if(filterData.length>0){
	                                atViewTitleEl.text('选择名称或轻敲空格完成输入').show();
	                            }else{
	                                atViewTitleEl.hide();
	                            }
	
	                        }
	                        return filterData;
	                    },
	                    matcher: function (flag, subtext) {
	                        var match, matched, regexp;
	                        //regexp = new RegExp(flag + '([\\S]*)$', 'gi');
	                        regexp = new RegExp(flag + '([a-zA-Z0-9_\\u4e00-\\u9fa5]*)$', 'gi');    //汉字、数字、字母、下划线组合
	                        match = regexp.exec(subtext);
	                        matched = null;
	                        if (match) {
	                            matched = match[2] ? match[2] : match[1];
	                        }
	                        return matched;
	                    },
	                    sorter:function(query, items, searchKey){
	                        return items;
	                    }
	                }
	            }).addClass('fs-publish-input');
	        });
	        var atSelectPanel,
	        	btnEl = $('.crm-publish-operation-at', this.element),
	        	inputEl = $('.crm-publish-content');
	        if(!this.atSelectPanel){
	            atSelectPanel = new SelectPanel(_.extend({
	                "trigger": btnEl,
	                "singleCked": false,    //可多选
	                "data": atSpData
	            }, {}));
	            atSelectPanel.on('select', function (selectedData) {
	                var currentInputDom=inputEl.filter('.fs-publish-at-focus').get(0)||inputEl.eq(0).get(0);
	                _.each(selectedData, function (val) {
	                    util.appendInput(currentInputDom, '@' + val[0].name + ' ');
	                    that._contentChange();
	                });
	                //input输入框自适应高度
	                $(currentInputDom).trigger('autosize.resize');
	
	                atSelectPanel.unselect("all", "all");
	                //atSelectPanel.hide();
	            });
	            this.atSelectPanel = atSelectPanel;
	        }
	        inputEl.focus(function(){
	            inputEl.removeClass('fs-publish-at-focus');
	            $(this).addClass('fs-publish-at-focus');
	        });
	        inputEl.change(function(){
	            inputEl.trigger('autosize.resize');
	        });
 		},

        "_initOthers":function(){
            this.element.html(tpl);
            _.each(this.get("display"),function(item){
                $(".crm-publish-operation-"+item,this.element).show();
            });
            $(".crm-publish-title",this.element).text(this.get("title"));
            $(".crm-publish-content",this.element).attr("placeholder",this.get("placeholder"));
            var condition = _.extend(this.get(this.get("type")+"Condition"),this.get("condition"));
            this.set("condition",condition);
            publishHelper.AdjustTextAreaSize({
                element: $(".crm-publish-content",this.element)
            });
        },

        "_initTags":function(){
            var tags = util.getTagsByType(util.CONSTANT.TAG_TYPE.EVENT);
            var tagHtml = "";
            var tagOptions = [];
            _.each(tags,function(tag){
                var tagOptionHtml = "";
                var hasDefault = false;
                _.each(tag.options,function(option){
                    if(option.isDefault){
                        hasDefault = true;
                        tagOptionHtml += "<li class='crm-publish-operation-tag-option-item' data-isDefault = true ><span class='mn-radio-item mn-selected crm-publish-operation-tag-option-radio' data-isDefault = true data-fBusinessTagID = "+option.fBusinessTagID+" data-fBusinessTagOptionID = "+option.fBusinessTagOptionID+"></span><span class='crm-publish-operation-tag-option-name fn-text-overflow' title='"+option.name+"'>"+option.name+"</span><span class = 'crm-publish-operation-tag-option-default fn-right'>默认</span></li>";    
                    }else{
                        tagOptionHtml += "<li class='crm-publish-operation-tag-option-item' data-isDefault = false ><span class='mn-radio-item crm-publish-operation-tag-option-radio' data-isDefault = false data-fBusinessTagID = "+option.fBusinessTagID+" data-fBusinessTagOptionID = "+option.fBusinessTagOptionID+"></span><span class='crm-publish-operation-tag-option-name fn-text-overflow' title='"+option.name+"'>"+option.name+"</span></li>";
                    }
                });
                if(!hasDefault){
                    tagOptionHtml = "<li class='crm-publish-operation-tag-option-item' data-isDefault = true><span class='mn-radio-item mn-selected crm-publish-operation-tag-option-radio' data-isDefault = true data-fBusinessTagOptionID = 0></span><span class='crm-publish-operation-tag-option-name fn-text-overflow'>无</span></li>"+tagOptionHtml;
                }
                tagOptionHtml = "<div class = 'mn-radio-box crm-publish-operation-tag-option crm-publish-operation-tag-"+tag.fBusinessTagID+" fn-hide''><ul>" + tagOptionHtml;
                tagOptionHtml += "</ul></div>";
                tagHtml += "<li class='crm-publish-operation-event-tag' data-fBusinessTagID = "+tag.fBusinessTagID+"><span class='crm-publish-operation-event-tag-name fn-text-overflow' title = '"+tag.name+"'>"+tag.name+"</span><span class='crm-publish-operation-event-tag-icon'>></span>"+tagOptionHtml+"</li>";
            });
            $(".crm-publish-operation-tag-container ul",this.element).html(tagHtml);
        },

        "_initEvents":function(){
            var self = this;
            $(document).on("click",function(e){
                if ($(e.target).is('.crm-publish-operation-tag') || $(e.target).is('.crm-publish-operation-tag-container')
                 || $(e.target).is('.crm-publish-operation-event-tag')|| $(e.target).is('.crm-publish-operation-event-tag-icon')
                 || $(e.target).is('.crm-publish-operation-tag-option')|| $(e.target).is('.crm-publish-operation-tag-option-item')
                 || $(e.target).is('.crm-publish-operation-tag-option-radio')|| $(e.target).is('.crm-publish-operation-tag-option-name')
                 || $(e.target).is('.crm-publish-operation-tag-option-default')){
                    return;
                }
                $(".crm-publish-operation-tag",this.element).removeClass("crm-publish-operation-active");
                $(".crm-publish-operation-tag-container",this.element).hide();
            });
            util.mnEvent($(".crm-publish-operation-time-alarm-select",this.element), 'change', function (val, text) {
                $(".crm-publish-operation-time",self.element).addClass("crm-publish-operation-time-selected");
                if(val == 1){
                    $(".crm-publish-operation-time-alarm-info",self.element).hide();
                    $(".crm-publish-operation-time",self.element).removeClass("crm-publish-operation-time-selected");
                }
                self.showRemindTime(val);
                var condition = self.get("condition");
                condition.remindType = val;
                self.set("condition",condition);
            });
//            util.mnEvent($(".crm-publish-operation-time-start-time",this.element), 'change', function (val, text) {
//                var condition = self.get("condition");
//                self.showRemindTime(condition.remindType);
//            });
//
//            util.mnEvent($(".crm-publish-operation-time-start-minute",this.element), 'change', function (val, text) {
//                var condition = self.get("condition");
//                self.showRemindTime(condition.remindType);
//            });
            
        },

        "showRemindTime":function(val){
            var self = this;
            if(val == 1){
                $(".crm-publish-operation-time-alarm-info",self.element).hide();
                $(".crm-publish-operation-time",self.element).removeClass("crm-publish-operation-time-selected");
                return;
            }
            var day = moment();
            day = self._getStartDate();
            if(!day) return;
            $(".crm-publish-operation-time-alarm-info",self.element).show();
            switch(val){
                case 3:
                day = day.add("minutes",-5);
                break;
                case 4:
                day = day.add("minutes",-15);
                break;
                case 5:
                day = day.add("minutes",-30);
                break;
                case 6:
                day = day.add("hours",-1);
                break;
                case 7:
                day = day.add("hours",-2);
                break;
                case 8:
                day = day.add("hours",-6);
                break;
                case 9:
                day = day.add("days",-1);
                break;
                case 10:
                day = day.add("days",-2);
                break;
                default:
                break;
            }
            $(".crm-publish-operation-time-alarm-info-datetime",self.element).text(day.format('YYYY年MM月DD日 HH:mm'));
        },

        "_initAttachUploader":function(){
            var self = this;
            var attachUploader = new Uploader({
                "element": $(".crm-publish-operation-attach-input",this.element),
                "h5Opts": {
                    multiple: true,
                    accept: "*/*",
                    filter: function (files) {
                        var activeUploader = self.get("activeUploader");
                        var type = "attach";
                        if(activeUploader == "picture"){
                            type = "img";
                        }
                        return self.uploadFilter(files,type);
                    }
                },
                "flashOpts": {
                    file_types: "*.*",
                    file_types_description: "所有文件",
                    button_width: 61,
                    button_height: 20
                },
                "onSuccess":function(file, responseText){

                    var condition = self.get("condition");
                    var fileInfo = JSON.parse(responseText).value;
                    var files = self.get("files");
                    
                    //h5
                    if (self.get("suportH5")){   
                        var savedFile = _.find(files,function(item){
                            return item.id == file.id;
                        });
                        condition.fileInfos.push({
                                "value": savedFile.type, //FeedAttachType
                                "value1":fileInfo.filePath,
                                "value2": file.size, //文件总长度（字节）
                                "value3": file.name  //文件原名
                        });
                    }else{  //flash 
                        var activeUploader = self.get("activeUploader");
                        var attachUploader = self.get("attachUploader");
                        var flashFiles = self.get("flashFiles");
                        var flashFiles = _.filter(flashFiles,function(item){
                            return item.id != file.id;
                        });
                        var myType = 2;
                        if(activeUploader == "attach"){
                            myType = 3;
                            self._addAttach(file,fileInfo.filePath);
                        }
                        if(activeUploader == "picture"){
                            self._addPicture(file,fileInfo.filePath);
                        }
                        condition.fileInfos.push({
                                "value": myType, //FeedAttachType
                                "value1":fileInfo.filePath,
                                "value2": file.size, //文件总长度（字节）
                                "value3": file.name  //文件原名
                        });

                        attachUploader.removeFile(file.id,false);
                        if(flashFiles.length>0){
                            //attachUploader._updateFileStore(flashFiles[0]);
                            attachUploader.startUpload();    
                        }else{
                            util.hideMask();
                        }
                        self.set("flashFiles",flashFiles);
                        self.set("attachUploader",attachUploader);
                        
                    }
                    self.set("condition",condition);
                },
                "onProgress":function(file,uploadedSize,totalSize){
                   //NProgress.inc(uploadedSize/totalSize);
                },
                "onFailure":function(file){
                    //util.alert("上传失败，请重试！");
                    NProgress.done();
                },
                "onSelect": function (file) {
                    var activeUploader = self.get("activeUploader");
                    //h5
                    if (self.get("suportH5")){
                        if(activeUploader == "attach"){
                            self._addAttach(file);
                        }
                        if(activeUploader == "picture"){
                            self._addPicture(file);
                        }
                    }else{  //flash 
                        var type = "attach";
                        if(activeUploader == "picture"){
                            type = "img";
                        }
                        var tempResult = self.uploadFilter([file],type);
                        var flashFiles = self.get("flashFiles");

                        _.each(tempResult,function(item){
                            if(flashFiles.length == 0){
                                util.showMask();
                                self.get("attachUploader").startUpload();
                            }
                            flashFiles.push(item);
                        });
                        self.set("flashFiles",flashFiles);
                    }
                },
                "onComplete":function(){
                    //h5
                    if (self.get("suportH5")){
                        self._send();    
                    }
                }
            });
            this.set("attachUploader",attachUploader);
        },

        "uploadFilter":function(fileData,uploadType){
            fileData=[].concat(fileData);
            var passedFiles=[], //保存筛选后的文件
                typeFiles=this.get("files"),
                typeMap ={"img":2,"attach":3},
                message;
            var uploadFileSizeLimit=this.get("contactData")["u"].uploadFileSizeLimit;  //uploadFilesSizeLimit单位是M
            _.each(fileData,function(file){
                if (file.size < uploadFileSizeLimit * 1024 * 1024&&file.size>0) { //最大uploadFilesSizeLimit
                    if(!_.find(typeFiles,function(existFile){
                        return existFile.name==file.name && typeMap[uploadType] == existFile.type;
                    })){
                        if (uploadType=="img"&&util.getFileType(file)=="jpg") {
                            passedFiles.push(file);
                        }
                        if(uploadType=="attach"){
                            passedFiles.push(file);
                        }
                    }
                } //最大20m
            });
            if (passedFiles.length < fileData.length) {
                if(uploadType=="img"){
                    message="选择的文件类型必须为jpg、gif、jpeg或png，大小不能超过"+uploadFileSizeLimit+"MB且文件名不能相同，内容不能为空。本次添加了" + passedFiles.length + "个文件。";
                }else if(uploadType=="attach"){
                    message="选择的文件大小不能超过"+uploadFileSizeLimit+"MB且文件名不能相同，内容不能为空。本次添加了" + passedFiles.length + "个文件。";
                }
                util.alert(message);
            }
            return passedFiles;
        },

        "_initContactDialog":function(){
            var self = this;
            var customerID = this.get("condition").customerID;
            if(!customerID){
                return;
            }
            var contactsDialog = new ContactsDialog({
                "title":"选择联系人",
                "url":"/Contact/GetContactsByCustomerID/",
                "type":"modify",
                "defaultCondition":{
                    "customerID":customerID
                }
            });

            contactsDialog.on("selected",function(contacts){
                self._addContact(contacts);
            });
            this.set("contactsDialog",contactsDialog);
        },

        "_addAttach":function(file,filePath){
            var self = this;
            var html ="";
            var path = "";
            if(filePath){
                path = filePath;
            }
            if(!file){
                return;
            }
            var attachNumber = this.get("attachNumber");
            var attachSize = this.get("attachSize");
            var files = this.get("files");
            files.push({"id":file.id,"type":3,"name":file.name});
            this.set("files",files);
            html += "<div  class = 'crm-publish-operation-attach-box fn-left fn-clear'>";
            html += "<img title = '"+file.name+"' src='"+FS.BLANK_IMG+"' alt='icon' class='crm-publish-operation-attach-image fs-attach-"+util.getFileType({"name":file.name},true)+"-small-icon file-icon fn-left'/>";
            html += "<div class = 'crm-publish-operation-attach-name fn-left fn-clear fn-text-overflow' title = '"+file.name+"'>"+file.name+"</div><div fileId = '"+file.id+"' fileSize = '"+file.size+"' filePath = '"+path+"' class='crm-publish-operation-attach-close fn-hide fn-right'>x</div></div>";
            setTimeout(function(){
                $(".crm-publish-operation-attach-list",self.element).append(html);
                if(!self.get("suportH5")){
                    self._setFileInputPosition();
                }
            },50);
            
            attachNumber = attachNumber + 1;
            attachSize = attachSize + file.size;
            this.set("attachNumber",attachNumber);
            this.set("attachSize",attachSize);
            $(".crm-publish-operation-attach-num",this.element).text(attachNumber);
            $(".crm-publish-operation-attach-number",this.element).text(attachNumber);
            $(".crm-publish-operation-attach-size",this.element).text(util.getFileSize(attachSize));
            if(attachNumber == 1){
                $(".crm-publish-operation-attach",this.element).addClass("crm-publish-operation-attach-selected");
                $(".crm-publish-operation-attach-info",this.element).show();
                $(".crm-publish-operation-attach-num",this.element).show();
            }

        },

        "_attachDelete":function(e){

            var currentEl = $(e.currentTarget);
            var fileId = currentEl.attr("fileId");
            var fileSize = currentEl.attr("fileSize");
            var attachNumber = this.get("attachNumber");
            var attachSize = this.get("attachSize");
            var files = this.get("files");
            files = _.filter(files,function(item){
                return item.id != fileId;
            });
            if(!this.get("suportH5")){
                var condition = this.get("condition");
                var fileInfos = condition.fileInfos;
                var path = currentEl.attr("filePath");
                if(path){
                    fileInfos = _.filter(fileInfos,function(item){
                        return item.value1 != path;
                    });
                    condition.fileInfos = fileInfos;
                    this.set("condition",condition);
                }
            }
            this.set("files",files);
            attachNumber = attachNumber - 1;
            attachSize = attachSize -fileSize;
            this.set("attachNumber",attachNumber);
            this.set("attachSize",attachSize);
            this.get("attachUploader").removeFile(fileId);
            currentEl.parent().remove();
            $(".crm-publish-operation-attach-num",this.element).text(attachNumber);
            $(".crm-publish-operation-attach-number",this.element).text(attachNumber);
            $(".crm-publish-operation-attach-size",this.element).text(util.getFileSize(attachSize));
            if(attachNumber == 0){
                $(".crm-publish-operation-attach",this.element).removeClass("crm-publish-operation-attach-selected");
                $(".crm-publish-operation-attach-info",this.element).hide();
                $(".crm-publish-operation-attach-num",this.element).hide();
            }
            if(!this.get("suportH5")){
                this._setFileInputPosition();
            }
        },

        "_initStartDate":function(){
            var self = this;
            var startDate = new DateSelect({
                "element": $('.crm-publish-operation-time-start-date', this.element),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
//            startDate.setValue(moment());
            var condition = this.get("condition");
            startDate.on("change",function(datetime){
                self.showRemindTime(condition.remindType);
            });
            this.set("startDate",startDate);
        },

        "_initAlarmDate":function(){
            var alarmDate = new DateSelect({
                "element": $('.crm-publish-operation-time-alarm-date', this.element),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            alarmDate.setValue(moment());
            this.set("alarmDate",alarmDate);
        },

        "_initTime":function(){
//            var hour = moment().hour();
//            var minute = moment().minute();
//            util.mnSelect($(".crm-publish-operation-time-start-time",this.element), 'syncModel',this._getHourOption(true));
//            util.mnSetter($(".crm-publish-operation-time-start-time",this.element),hour);
//            util.mnSelect($(".crm-publish-operation-time-start-minute",this.element), 'syncModel',this._getMinuteOption(true));
//            util.mnSetter($(".crm-publish-operation-time-start-minute",this.element),Math.floor(minute/10)*10);
//            util.mnSelect($(".crm-publish-operation-time-alarm-time",this.element), 'syncModel',this._getHourOption(false));
//            util.mnSelect($(".crm-publish-operation-time-alarm-minute",this.element), 'syncModel',this._getMinuteOption(false));
        	var self = this,
        		timeWEl=$('.crm-publish-operation-time-start-time',this.element);
            ts=new TimeSelect({
                "element":timeWEl
            });
            this.set('ts', ts);
            //如果time栏为空，选择date栏时默认选中第一个time option
            this.get('startDate').on('change', function () {
                if (ts.getValue() == "" && self.get('startDate').getValue()) {
                    ts.selector.select(0);
                }
            });
            ts.on('change', function(){
            	var condition = self.get("condition");
            	self.showRemindTime(condition.remindType);
            });
        },


        "_addPicture":function(file,filePath){
            var self = this;
            var html ="";
            var path = "";
            var src = "";
            if(filePath){
                path = filePath;
            }
            if(!file){
                return;
            }
            if(!this.get("suportH5") && filePath){
                src = FS.API_PATH+'/df/getTempImg?id='+filePath;
            }

            var pictureNumber = this.get("pictureNumber");
            var pictureSize = this.get("pictureSize");
            var files = this.get("files");
            files.push({"id":file.id,"type":2,"name":file.name});
            this.set("files",files);
            html += "<div class = 'crm-publish-operation-picture-box fn-left fn-clear'>";
            html += "<img fileId = 'img_"+file.id+"' class = 'crm-publish-operation-picture-image' src = '"+src+"' />";
            html += "<div fileId = '"+file.id+"' fileSize = '"+file.size+"' filePath = '"+path+"' class='crm-publish-operation-picture-close fn-hide fn-right'>x</div></div>";
            if(this.get("suportH5")){
                var reader = new FileReader();
                reader.onload = function(e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        var img = $('[fileId=img_'+file.id+']',self.element);
                        img.attr('src', e.target.result);
                        var rect = self._clacImgZoomParam(139, 103, img.width(), img.height());
                        img.css({'height': rect.height,'width': rect.width});
                    };
                   
                };    
                reader.readAsDataURL(file);
            }
            $(".crm-publish-operation-picture-list",self.element).append(html);
            if(!self.get("suportH5")){
                self._setFileInputPosition();
            }
            pictureNumber = pictureNumber + 1;
            pictureSize = pictureSize + file.size;
            this.set("pictureNumber",pictureNumber);
            this.set("pictureSize",pictureSize);
            $(".crm-publish-operation-picture-num",this.element).text(pictureNumber);
            $(".crm-publish-operation-picture-number",this.element).text(pictureNumber);
            $(".crm-publish-operation-picture-size",this.element).text(util.getFileSize(pictureSize));
            if(pictureNumber == 1){
                $(".crm-publish-operation-picture",this.element).addClass("crm-publish-operation-picture-selected");
                $(".crm-publish-operation-picture-info",this.element).show();
                $(".crm-publish-operation-picture-num",this.element).show();
            }
        },
        "_clacImgZoomParam":function( maxWidth, maxHeight, width, height ){
            var param = {top:0, left:0, width:width, height:height};
            if( width>maxWidth || height>maxHeight )
            {
                rateWidth = width / maxWidth;
                rateHeight = height / maxHeight;
                
                if( rateWidth > rateHeight )
                {
                    param.width =  maxWidth;
                    param.height = Math.round(height / rateWidth);
                }else
                {
                    param.width = Math.round(width / rateHeight);
                    param.height = maxHeight;
                }
            }
            
            param.left = Math.round((maxWidth - param.width) / 2);
            param.top = Math.round((maxHeight - param.height) / 2);
            return param;
        },

        "_pictureDelete":function(e){
            var currentEl = $(e.currentTarget);
            var fileId = currentEl.attr("fileId");
            var fileSize = currentEl.attr("fileSize");
            var pictureNumber = this.get("pictureNumber");
            var pictureSize = this.get("pictureSize");
            var files = this.get("files");
            files = _.filter(files,function(item){
                return item.id != fileId
            });
            this.set("files",files);
            if(!this.get("suportH5")){
                var condition = this.get("condition");
                var fileInfos = condition.fileInfos;
                var path = currentEl.attr("filePath");
                if(path){
                    fileInfos = _.filter(fileInfos,function(item){
                        return item.value1 != path;
                    });
                    condition.fileInfos = fileInfos;
                    this.set("condition",condition);
                }
            }
            pictureNumber = pictureNumber - 1;
            pictureSize = pictureSize -fileSize;
            this.set("pictureNumber",pictureNumber);
            this.set("pictureSize",pictureSize);
            this.get("attachUploader").removeFile(fileId);
            currentEl.parent().remove();
            $(".crm-publish-operation-picture-num",this.element).text(pictureNumber);
            $(".crm-publish-operation-picture-number",this.element).text(pictureNumber);
            $(".crm-publish-operation-picture-size",this.element).text(util.getFileSize(pictureSize));
            if(pictureNumber == 0){
                $(".crm-publish-operation-picture",this.element).removeClass("crm-publish-operation-picture-selected");
                $(".crm-publish-operation-picture-info",this.element).hide();
                $(".crm-publish-operation-picture-num",this.element).hide();
            }
            if(!this.get("suportH5")){
                this._setFileInputPosition();
            }
        },

        "_showContactDialog":function(){
            this.get("contactsDialog").show(this.get("contacts"));
        },

        "_addContact":function(contacts){
            var html = "";
            _.each(contacts,function(item){
                html += "<div class = 'crm-publish-operation-contact-box fn-left fn-clear'>";
                html += "<img src ='"+util.getAvatarLink(item.picturePath, '2')+"' class = 'crm-publish-operation-contact-img'/>";
                html += "<div class = 'crm-publish-operation-contact-info'><div class = 'crm-publish-operation-contact-name fn-text-overflow' title = '"+item.name+"'>"+item.name+"</div>";
                html += "<div class = 'crm-publish-operation-contact-department fn-text-overflow' title = '"+item.post+"&nbsp;"+item.department+"'>"+item.post+"&nbsp;"+item.department+"</div></div>";
                html += "<div class = 'crm-publish-operation-contact-company fn-clear fn-text-overflow' title = '"+item.company+"'>"+item.company+"</div>";
                html += "<div contactID = '"+item.contactID+"' class='crm-publish-operation-contact-close fn-hide fn-right'>x</div></div>";
            });
            $(".crm-publish-operation-contact-list",self.element).html(html);
            this.set("contacts",contacts);
            $(".crm-publish-operation-contact-num",this.element).text(contacts.length);
            if(contacts.length > 0){
                $(".crm-publish-operation-contact",this.element).addClass("crm-publish-operation-contact-selected");
                $(".crm-publish-operation-contact-num",this.element).show();
            }
        },

        "_contactDelete":function(e){
            var currentEl = $(e.currentTarget);
            var contactID = currentEl.attr("contactID");
            var contacts = this.get("contacts");
            contacts = _.filter(contacts,function(item){
                return item.contactID != contactID
            });
            this.set("contacts",contacts);
            currentEl.parent().remove();
            $(".crm-publish-operation-contact-num",this.element).text(contacts.length);
            if(contacts.length == 0){
                $(".crm-publish-operation-contact",this.element).removeClass("crm-publish-operation-contact-selected");
                $(".crm-publish-operation-contact-num",this.element).hide();
            }
        },

        "_getHourOption":function(hasDefault){
            var hour = moment().hour();
            var option = [{
                "text":"00点",
                "value": 0,
                "selected":hasDefault && hour == 0
                },{
                "text":"01点",
                "value": 1,
                "selected":hasDefault && hour == 1
                },{
                "text":"02点",
                "value": 2,
                "selected":hasDefault && hour == 2
                },{
                "text":"03点",
                "value": 3,
                "selected":hasDefault && hour == 3
                },{
                "text":"04点",
                "value": 4,
                "selected":hasDefault && hour == 4
                },{
                "text":"05点",
                "value": 5,
                "selected":hasDefault && hour == 5
                },{
                "text":"06点",
                "value": 6,
                "selected":hasDefault && hour == 6
                },{
                "text":"07点",
                "value": 7,
                "selected":hasDefault && hour == 7
                },{
                "text":"08点",
                "value": 8,
                "selected":hasDefault && hour == 8
                },{
                "text":"09点",
                "value": 9,
                "selected":hasDefault && hour == 9
                },{
                "text":"10点",
                "value": 10,
                "selected":hasDefault && hour == 10
                },{
                "text":"11点",
                "value":11,
                "selected":hasDefault && hour == 11
                },{
                "text":"12点",
                "value": 12,
                "selected":hasDefault && hour == 12
                },{
                "text":"13点",
                "value": 13,
                "selected":hasDefault && hour == 13
                },{
                "text":"14点",
                "value": 14,
                "selected":hasDefault && hour == 14
                },{
                "text":"15点",
                "value": 15,
                "selected":hasDefault && hour == 15
                },{
                "text":"16点",
                "value": 16,
                "selected":hasDefault && hour == 16
                },{
                "text":"17点",
                "value": 17,
                "selected":hasDefault && hour == 17
                },{
                "text":"18点",
                "value": 18,
                "selected":hasDefault && hour == 18
                },{
                "text":"19点",
                "value": 19,
                "selected":hasDefault && hour == 19
                },{
                "text":"20点",
                "value": 20,
                "selected":hasDefault && hour == 20
                },{
                "text":"21点",
                "value": 21,
                "selected":hasDefault && hour == 21
                },{
                "text":"22点",
                "value":22,
                "selected":hasDefault && hour == 22
                },{
                "text":"23点",
                "value": 23,
                "selected":hasDefault && hour == 23
                },{
                "text":"24点",
                "value": 24,
                "selected":hasDefault && hour == 24
                }];
            return option;
        },

        "_getMinuteOption":function(hasDefault){
            var minute = moment().minute();
            var option = [{
                "text":"00分",
                "value": 0,
                "selected":hasDefault && minute >= 0 && minute < 10
                },{
                "text":"10分",
                "value": 10,
                "selected":hasDefault && minute >= 10 && minute < 20
                },{
                "text":"20分",
                "value": 20,
                "selected":hasDefault && minute >= 20 && minute < 30
                },{
                "text":"30分",
                "value": 30,
                "selected":hasDefault && minute >= 30 && minute < 40
                },{
                "text":"40分",
                "value": 40,
                "selected":hasDefault && minute >= 40 && minute < 50
                },{
                "text":"50分",
                "value": 50,
                "selected":hasDefault && minute >= 50
                }];
            return option;
        },

        "_startUpload":function(){
            var self = this;
            var condition = this.get("condition");
            var pictureNumber = this.get("pictureNumber");
            var attachNumber = this.get("attachNumber");
            if(condition.startTime != undefined){
                condition.startTime = this._getStartDateTime();    
            }
//            if(condition.remindTime != undefined){
//                condition.remindTime = this._getAlarmDateTime();
//            }
            if(condition.remindType && condition.remindType != 1 && !condition.startTime) {
            	util.alert('请选择开始时间');
            	return;
            }
            $(".crm-publish-button-ok",self.element).addClass("crm-publish-button-disable");
            if(condition.associationContactIDs != undefined){
                if(this.get("isContact")){
                    condition.associationContactIDs = condition.contactIDs;
                }else{
                    var contactArray = [];
                    _.each(this.get("contacts"),function(item){
                        contactArray.push(item.contactID);
                    });
                    condition.associationContactIDs = contactArray.join(",");    
                }
            }
            if(condition.listTagOptionID != undefined){
                condition.listTagOptionID = this._getTagOption();
            }
            condition.feedContent = $(".crm-publish-content",this.element).val();
            if(pictureNumber + attachNumber > 0 && this.get("suportH5")){
                this.get("attachUploader").startUpload();
                NProgress.start();
            }else{
                this._send();
            }
            this.set("condition",condition);
        },

        "_send":function(){
            var self = this;
            var type = this.get("type");
                var api = '/Event/AddEvent';
                if(type == "feed"){
                    api = '/CrmFeed/SendCrmFeed';
                }
                var customerInfo = this.get('customerInfo');
                if(customerInfo) {
                	var customerConfig = util.getCustomerConfig() || [],
                		id = customerInfo.customerID,
    	        		isExist = _.find(customerConfig, function(item){return item.customerID == id});
    	        	if(!isExist) {
    	        		customerConfig.unshift(customerInfo);
    	        	}
        	        if(customerConfig.length > 50) {
        	        	customerConfig = customerConfig.slice(0, 50);
        	        }
        	        util.setCustomerConfig(customerConfig);
                }
                var contactInfo = this.get('contactInfo');
                if(contactInfo) {
                	var contactConfig = util.getContactsConfig() || [],
                		id = contactInfo.contactID,
    	        		isExist = _.find(contactConfig, function(item){return item.contactID == id});
    	        	if(!isExist) {
    	        		contactConfig.unshift(contactInfo);
    	        	}
        	        if(contactConfig.length > 50) {
        	        	contactConfig = contactConfig.slice(0, 50);
        	        }
        	        util.setContactsConfig(contactConfig);
                }
                util.api({
                    'url': api,
                    'type': 'post',
                    "dataType": 'json',
                    'data': this.get("condition"),
                    'success': function (responseData) {
                        if(!responseData.success){
                            if($.trim($(".crm-publish-content",this.element).val())==""){
                                $(".crm-publish-button-ok",this.element).addClass("crm-publish-button-disable");    
                            }else{
                                $(".crm-publish-button-ok",this.element).removeClass("crm-publish-button-disable");
                            }
                            return;
                        }
                        NProgress.done();
                        util.remind(2,"记录发布成功");
                        self._cancel();
                        self.trigger("post",responseData.value);
                    },
                    "error": function () {
                        NProgress.done();
                        //$(".crm-publish-button-ok",self.element).removeClass("crm-publish-button-disable");
//                        return error.apply(this, arguments);
                    }
//                    "complete": function (jqXHR, textStatus) {
//                        NProgress.done();
//                        $(".crm-publish-button-ok",self.element).removeClass("crm-publish-button-disable");
//                        return complete.apply(this,arguments);
//                    }
                });
        },

        "_getStartDateTime":function(){
            var condition = this.get("condition");
            var day = this._getStartDate();
            if(day) {
            	return day._d.getTime()/1000;
            } else {
            	return 0;
            }
        },

        "_getAlarmDateTime":function(){
            return this._getStartDateTime();
        },

        "_getStartDate":function(){
            var startDate = this.get("startDate"),
            	ts = this.get('ts');
            var day = startDate.getValue(),
            	time = ts.getValue();
            if(!day || !time) {
            	return 0;
            }
            return moment(day+' '+time,'YYYY-MM-DD HH:mm:ss');
//            var condition = this.get("condition");
//            var hour = util.mnGetter($(".crm-publish-operation-time-start-time",this.element));
//            var minute = util.mnGetter($(".crm-publish-operation-time-start-minute",this.element));
//            if(condition.isAllDayEvent){
//                hour = 9;
//                minute = 0;
//            }
//            day.add("hours",hour);
//            day.add("minutes",minute);
//            return day;
        },

        "_getTagOption":function(){
            var tags = $(".mn-selected.crm-publish-operation-tag-option-radio",this.element);
            result = [];
            _.each(tags,function(tag){
                var fBusinessTagID = $(tag).attr("data-fBusinessTagID");
                var fBusinessTagOptionID = $(tag).attr("data-fBusinessTagOptionID");
                var isDefault = $(tag).attr("data-isDefault");
                if(isDefault=="false"){
                    result.push(fBusinessTagID+","+fBusinessTagOptionID)
                }
            });
            return result;
        },

 		"destroy":function(){
            this._cancel();
            this.get('startDate') && (this.get('startDate').destroy());
            this.get('alarmDate') && (this.get('alarmDate').destroy());
            this.get('ts') && (this.get('ts').destroy());
            this.topicDialog && (this.topicDialog.destroy());
            this.atSelectPanel && (this.atSelectPanel.destroy());
            this.get('contactsDialog') && (this.get('contactsDialog').destroy());
            util.mnDestroy($(".crm-publish-operation-time-alarm-select",this.element));
            var result = Publish.superclass.destroy.apply(this,arguments);
 			return result;
 		}
 	});
 	module.exports = Publish;
 });