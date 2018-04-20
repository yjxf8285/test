/**
 * 附件列表
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var util = require('util'),
        AttachPreview = require('./fs-attach-preview'),
        Pagination=require('uilibs/pagination'),
        Spin=require('spin'),
        moment=require('moment'),
		Dialog=require('dialog'),
        publish=require('modules/publish/publish'),
        attachTpl=require('./fs-attach.html');
//        attachStyle=require('./fs-attach.css');
    var attachTplEl=$(attachTpl),
        attachPreview=new AttachPreview().render();  //fs预览组件实例
	var showFeedPwdValid=publish.showFeedPwdValid;  //加密附件验证接口

    var contactData=util.getContactData(),
        loginUserData=contactData["u"];

    var AttachM = Backbone.Model.extend({}),
        AttachC = Backbone.Collection.extend({
            model:AttachM,
            url:'/attach/getAttachFilesOfIReceive',
            sync: function(method, model, options) {
                var data = options.data || {};
                options.data = _.extend({
                    "attachType":3,  //3表示附件
                    "feedType": 0,
                    "keyword": "",
                    "pageSize": 10,
                    "pageNumber": 1
                }, data);
                Backbone.sync('read', model,options);
            },
            parse: function(responseData) {
                /* 预处理 */
                var items;
                var newItems=[];
                if(responseData.success){

                    items=responseData.value.items;
                    _.each(items, function(item,i) {
                        var userData=item.employee,
                            attachData=item.attachs[0];
                        var nickName=userData?userData.name:"";
                        if(userData&&userData.employeeID==loginUserData.id){
                            nickName="我";
                        }
                        newItems[i]={
                            "feedId": item.dataID?item.dataID:attachData.dataID,
                            "blankImgSrc":FS.BLANK_IMG,
                            "fileType":util.getFileType({
                                "name":attachData.attachName
                            },true),
                            "attachs":item.attachs,
                            "attachName":attachData.attachName, //文件名
                            "attachSize":attachData.attachSize, //文件大小
                            "attachTitle":attachData.attachName+'('+util.getFileSize(attachData.attachSize)+')',
                            "attachSummary":'<span class="employee-name">'+nickName+'</span>上传于'+util.getDateSummaryDesc(moment.unix(item.createTime),moment.unix(responseData.serviceTime),1),
                            "attachPath":attachData.attachPath,
                            "createTime":item.createTime,
                            "attachId":item.attachID,
                            "employeeName":nickName,
                            "isEncrypted":item.isEncrypted,
                            "encryptTitle":item.encryptTitle||"",
                            "serverTime":responseData.serverTime,
                            "canPreview":attachData.canPreview
                        };
                    });
                }
                return newItems;
            }
        }),
        AttachV =Backbone.View.extend({
            tagName: "div",
            template:_.template(attachTplEl.filter('.fs-attach-item-tpl').html()),
            className: "fs-attach-item",
            events: {
                "click .fs-attach-item-desc":"showPreview",
                "click .lockapv-open":"showLockOpen"
            },
            showPreview:function(){
                var model=this.model,
                    attachs=model.get('attachs');
                var source=1;  //soure:信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                attachPreview.preview({
                    "type":"attach",
                    "data":[{
                        "source": source,
                        "refId": model.attributes.feedId||0,
                        "previewPath":FS.BLANK_IMG,
                        "originPath":model.get('attachPath'),
                        "thumbPath":FS.BLANK_IMG,
                        "createTime":model.get('createTime'),
                        "fileName":model.get('attachName'),
                        "fileSize":model.get('attachSize'),
                        "fileId":model.get('attachId'),
                        "employeeName":model.get('employeeName'),
                        "serverTime":model.get('serverTime'),
                        "canPreview":model.get('canPreview')
                    }],
                    "refId":model.get('feedId'),
                    "belongToType":util.getAttachSourceName(attachs[0].source)
                });
            },
            showLockOpen:function(evt){
                var elEl=this.$el,
                    lockEl=$('.fs-attach-item-lockapv',elEl);
                var model=this.model;
                showFeedPwdValid(function(responseData){
                    if(responseData.success){
                        lockEl.hide();
                    }
                },function(){},{
                    "feedID":model.get('feedId')
                });
                evt.preventDefault();
            },
            initialize: function() {
                this.listenTo(this.model, "change", this.render);
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
		
	var AudioM = Backbone.Model.extend({}),
        AudioC = Backbone.Collection.extend({
            model:AudioM,
            url:'#',
            sync: function(method, model, options) {
                var data = options.data || {};
                options.data = _.extend({
                    "attachType":3,  //3表示附件
                    "feedType": 0,
                    "keyword": "",
                    "pageSize": 10,
                    "pageNumber": 1
                }, data);
                Backbone.sync('read', model,options);
            },
            parse: function(responseData) {
                /* 预处理 */
                var items;
                var newItems=[];
                if(responseData.success){

                    items=responseData.value.items;
                    _.each(items, function(item,i) {
                        var userData=item.employee,
                            attachData=item.attachs[0];
                        var nickName=userData?userData.name:"";
                        if(userData&&userData.employeeID==loginUserData.id){
                            nickName="我";
                        }
                        newItems[i]={
                            "feedId": item.dataID?item.dataID:attachData.dataID,
                            "blankImgSrc":FS.BLANK_IMG,
                            "fileType":util.getFileType({
                                "name":attachData.attachName
                            },true),
                            "attachs":item.attachs,
                            "attachName":attachData.attachName, //文件名
                            "attachSize":attachData.attachSize, //文件大小
                            "attachTitle":util.getFileNamePath(attachData.attachName)+'.mp3'+'('+attachData.attachSize+'秒)',
                            "attachSummary":'<span class="employee-name">'+nickName+'</span>上传于'+util.getDateSummaryDesc(moment.unix(item.createTime),moment.unix(responseData.serviceTime),1),
                            "attachPath":attachData.attachPath,
                            "createTime":item.createTime,
                            "attachId":item.attachID,
                            "employeeName":nickName,
                            "isEncrypted":item.isEncrypted,
                            "encryptTitle":item.encryptTitle||"",
                            "serverTime":responseData.serverTime
                        };
                    });
                }
                return newItems;
            }
        }),
        AudioV =Backbone.View.extend({
            tagName: "div",
            template:_.template(attachTplEl.filter('.fs-audio-item-tpl').html()),
            className: "fs-audio-item",
            events: {
                "click .fs-audio-item-desc":"showPreview",
                "click .lockapv-open":"showLockOpen"
            },
            showPreview:function(){
                var model=this.model,
                    attachs=model.get('attachs');
                attachPreview.preview({
                    "type":"audio",
                    "data":[{
                        "previewPath":FS.BLANK_IMG,
                        "originPath":model.get('attachPath'),
                        "thumbPath":FS.BLANK_IMG,
                        "createTime":model.get('createTime'),
                        "fileName":model.get('attachName'),
                        "fileSize":model.get('attachSize'),
                        "fileId":model.get('attachId'),
                        "employeeName":model.get('employeeName')
                    }],
                    "refId":model.get('feedId'),
                    "belongToType":util.getAttachSourceName(attachs[0].source)
                });
            },
            showLockOpen:function(evt){
                var elEl=this.$el,
                    lockEl=$('.fs-audio-item-lockapv',elEl);
                var model=this.model;
                showFeedPwdValid(function(responseData){
                    if(responseData.success){
                        lockEl.hide();
                    }
                },function(){},{
                    "feedID":model.get('feedId')
                });
                evt.preventDefault();
            },
            initialize: function() {
                this.listenTo(this.model, "change", this.render);
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
			
    var ImgM = Backbone.Model.extend({}),
        ImgC = Backbone.Collection.extend({
            model:ImgM,
            url:'/attach/getImgImgFilesOfIReceive',
            sync: function(method, model, options) {
                var data = options.data || {};
                options.data = _.extend({
                    "feedType": 0,
                    "keyword": "",
                    "pageSize": 10,
                    "pageNumber": 1
                }, data);
                Backbone.sync('read', model,options);
            },
            parse: function(responseData) {
                /* 预处理 */
                var items;
				//var picattachs=responseData.value.items.attachs;
                var newItems=[];
                if(responseData.success){
                    items=responseData.value.items;

                    _.each(items, function(item,i) {
                        var userData=item.employee,
                            attachs=item.attachs,
                            coverData;
                        var imgSummary,
                            imgWrapperCls="";
                        var nickName=userData?userData.name:"";
                        if(userData&&userData.employeeID==loginUserData.id){
                            nickName="我";
                        }
                        //获取第一个是图片的附件对象信息
                        coverData= _.find(attachs,function(attach){
                            return attach.fileIcon=="jpg";
                        });
                        if(attachs.length > 1){
                            imgSummary='<span class="employee-name">'+nickName+'</span>上传于'+util.getDateSummaryDesc(moment.unix(item.createTime),moment.unix(responseData.serviceTime),3)+'（共'+attachs.length+'张）';
                            imgWrapperCls="fpt-group"
                        }else{
                            imgSummary='<span class="employee-name">'+nickName+'</span>上传于'+util.getDateSummaryDesc(moment.unix(item.createTime),moment.unix(responseData.serviceTime),1);
                        }
                        newItems[i]={
                            "feedId":item.dataID?item.dataID:coverData.dataID,
                            "source":item.source?item.source:coverData.source,
                            "attachs":attachs,
                            //"thumbSrc":FS.FILES_PATH+'/'+attachs[0].attachPath+'3.jpg',
                            "thumbSrc":util.getDfLink(coverData.attachPath+'3','',false,'jpg'),
                            "imgSummary":imgSummary,
                            "imgWrapperCls":imgWrapperCls,
                            "attachPath":coverData.attachPath,
                            "attachName":coverData.attachName, //文件名
                            "attachSize":coverData.attachSize, //文件大小
                            "createTime":coverData.createTime,
                            "attachId":coverData.attachID,
                            "employeeName":coverData.employeeName||"",
                            "isEncrypted":item.isEncrypted,
                            "encryptTitle":item.encryptTitle||""
                        };
                    });
                }
                return newItems;
            }
        }),
        ImgV =Backbone.View.extend({
            tagName: "div",
            template:_.template(attachTplEl.filter('.fs-img-item-tpl').html()),
            className: "fs-img-item",
            events: {
                "click .fs-img-item-thumb":"showPreview",
				"click .lockapv-open":"showLockOpen"
            },
            showPreview:function(){
                var model=this.model,
                    attachs=model.get('attachs'),
                    data=[];
                //构建预览数据源
                _.each(attachs,function(attach,i){
                    data[i]={
                        "source": model.get('source')||1,//soure:信息源；2、回复；3、短消息 4、销售合同；5、销售机会；6、产品；7、竞争对手；8、市场活动；9、销售线索； 10、客户；
                        "refId": model.attributes.feedId||0,
                        "previewPath":attach.attachPath+'2',
                        "originPath":attach.attachPath+'1',
                        "thumbPath":attach.attachPath+'3',
                        "createTime":attach.createTime,
                        "fileName":attach.attachName,
                        "fileSize":attach.attachSize,
                        "fileId":attach.attachID,
                        "employeeName":model.get('employeeName')
                    };
                });
                attachPreview.preview({
                    "type":"img",
                    "data":data,
                    "refId":model.get('feedId'),
                    "belongToType":util.getAttachSourceName(attachs[0].source)
                });
            },
            showLockOpen:function(evt){
                var elEl=this.$el,
                    lockEl=$('.fs-img-item-lockapv',elEl);
                var model=this.model;
                showFeedPwdValid(function(responseData){
                    if(responseData.success){
                        lockEl.hide();
                    }
                },function(){},{
                    "feedID":model.get('feedId')
                });
                evt.preventDefault();
            },
            initialize: function() {
                this.listenTo(this.model, "change", this.render);
            },
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

    /**
     * 附件列表定义
     * @param opts
     * @constructor
     */
    var AttachList=function(opts){
        opts = _.extend({
            "element": null, //list selector
            "pagSelector": null, //pagination selector
            "pagOpts": { //分页配置项
                "pageSize": 45,
                "totalSize": -1,
                "visiblePageNums": 7
            },
            "attachType":"attach", //附件类型，img表示图片，attach表示普通附件文件，audio表示录音
            "listPath":"/attach/getAttachFilesOfIReceive",  //默认附件列表请求地址为我收到的附件列表地址
            "defaultRequestData": {}, //默认请求数据
            "searchOpts":{
                "inputSelector":null,   //搜索输入框
                "btnSelector":null  //搜索按钮
            },
            "listEmptyText":"暂无记录",  //列表记录为空的文字提示
            "showSenderName":true //显示发出人名称
        }, opts || {});
        this.opts = opts;
        this.element = $(opts.element);
        this.pagEl = $(opts.pagSelector);
        this.pagination = null; //分页组件
        this.tempRequestData={};    //通过load或者reload覆盖的请求数据
        this.init();
    };

    _.extend(AttachList.prototype, {
        "init": function() {
            var that = this,
                opts = this.opts;
            var elEl = this.element;
            var list,
                listEl;
            var attachType=opts.attachType,
                Collection,
                View;
            if(attachType=="attach"){
                Collection=AttachC;
                View=AttachV;
            }else if(attachType=="img"){
                Collection=ImgC;
                View=ImgV;
            }else if(attachType=="audio"){
                Collection=AudioC;
                View=AudioV;
            }
            //构建list容器
            elEl.addClass('fs-'+attachType+'-list').html('<div class="fs-'+attachType+'-list-inner fn-clear"></div>');
            listEl=$('.fs-'+attachType+'-list-inner',elEl);
            //设置list collection
            list=new Collection();
            //监听collection add事件
            list.on('add', function(m, c, listOpts) {
                var itemV;
                itemV= new View({
                    "model": m
                }).render();
                if(opts.showSenderName){
                    $('.employee-name',itemV.$el).show();
                }else{
                    $('.employee-name',itemV.$el).hide();
                }
                itemV.$el.data('itemV',itemV).appendTo(listEl);
            });
            this.list=list;
            //初始化分页组件
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
            if(opts.searchOpts&&opts.searchOpts.inputSelector){
                this._searchBarInit();
            }
            //初始化列表结果空白提示
            this._initListEmptyTip();

        },
        /**
         * 搜索条初始化，显示查询总信息和返回按钮
         * @private
         */
        _searchBarInit:function(){
            var that=this,
                opts=this.opts,
                searchOpts=opts.searchOpts;
            var elEl=this.element,
                searchInputEl=$(searchOpts.inputSelector), //搜索输入框
                searchBtnEl=$(searchOpts.btnSelector),  //搜索按钮
                barEl;
            barEl=$('<div class="list-search-bar fn-clear"></div>');
            barEl.html('<span class="result-info fn-left">共搜索到<span class="num color-red">0</span>条信息</span><a class="back-l fn-right" href="#" title="返回查看全部"><< 返回查看全部</a>');
            barEl.hide().prependTo(elEl);
            //创建快速关闭按钮
            var searchEmptyEl=$('<span class="empty-h">&#10005;</span>'),
                searchInputWEl=$('<span class="list-search-input-wrapper"></span>');
            searchInputEl.wrap(searchInputWEl);
            searchInputWEl=searchInputEl.closest('.list-search-input-wrapper');
            searchEmptyEl.hide().appendTo(searchInputWEl);

            //搜索输入框enter提交事件注册和快速清空按钮
            searchInputEl.keydown(function(evt){
                if(evt.keyCode==13){    //监听回车按键
                    searchBtnEl.click();
                }
            }).keyup(function(){
                    var val= _.str.trim($(this).val());
                    if(val.length>0){
                        searchEmptyEl.show();
                        searchInputEl.addClass('with-input-value');
                    }else{
                        searchEmptyEl.hide();
                        searchInputEl.removeClass('with-input-value');
                    }
                });
            searchEmptyEl.click(function(){
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
            });
            //点击返回到查看全部列表
            barEl.on('click','.back-l',function(evt){
                var emptyEl = $('.list-empty-tip', elEl);   //记录空白提示
                that.reload({
                    "keyword":""
                });
                //清空搜索输入框
                searchInputEl.val("");
                searchInputEl.removeClass('with-input-value');
                searchEmptyEl.hide();
                emptyEl.hide();
                barEl.hide();
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
                this.searchBarEl.remove();
                this.searchBarEl=null;  //释放，节约内存
            }
        },
        /**
         * 更新搜索条显隐状态
         * @private
         */
        _updateSearchBarState:function(requestData,responseData){
            var elEl=this.element,
                barEl=$('.list-search-bar',elEl),
                numEl=$('.num',barEl);
            if(requestData.keyword.length>0){
                if(responseData.success){
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
        _initListEmptyTip:function(){
            var elEl=this.element,
                emptyEl=$('<div class="list-empty-tip"></div>');
            var opts=this.opts,
                emptyText=opts.listEmptyText;
            emptyEl.html('<img src="'+FS.BLANK_IMG+'" alt="loading" class="icon-empty" />&nbsp;&nbsp;<span class="empty-text">'+emptyText+'</span>');
            emptyEl.appendTo(elEl);
        },
        /**
         * 列表结果记录集为空的提示状态
         * @private
         */
        _updatelistStatus:function(responseData){
            var elEl=this.element,
                emptyEl=$('.list-empty-tip',elEl);
            var totalCount;
            if(responseData.success){
                totalCount=responseData.value.totalCount;
                if(totalCount==0){  //列表结果为空，提示空提示信息
                    emptyEl.show();
                }else{
                    emptyEl.hide();
                }
            }
        },
        /**
         *
         * @param config
         */
        fetch: function() {
            var that=this;
            var opts=this.opts,
                list=this.list,
                pagination=this.pagination;
            var elEl=this.element,
                listEl=$('.fs-'+opts.attachType+'-list-inner', elEl);

            var requestData= _.extend({
                "pageSize":pagination.get('pageSize'),
                "pageNumber":pagination.get('activePageNumber')
            });
            //加入默认request数据
            if(_.isFunction(opts.defaultRequestData)){
                requestData= _.extend(opts.defaultRequestData(),requestData);
            }else{
                requestData= _.extend(opts.defaultRequestData,requestData);
            }
            //加入load或者reload传过来的request数据
            requestData= _.extend(requestData,this.tempRequestData);
            this.tempRequestData={};    //用完重置为空
            //打开loading提示
            this.showLoading();
            listEl.hide();
            this.list.fetch({
                "url":opts.listPath,
                "data":requestData,
                "success":function(c,responseData,ajaxOpts){
                    var dataRoot;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        //设置分页总记录数
                        //if(pagination.get('totalSize')==-1){
                        pagination.setTotalSize(dataRoot.totalCount);
                        //}
                        //更新提示搜索信息
                        that._updateSearchBarState(ajaxOpts.data,responseData);
                        //更新列表记录状态
                        that._updatelistStatus(responseData);
                        //关闭loading提示
                        that.hideLoading();
                        if(dataRoot.totalCount>0){
                            listEl.show();
                        }else{
                            listEl.hide();
                        }
                    }
                }
            });
        },
        "showLoading": function() {
            var loading = this.loading,
                elEl = this.element,
                loadingEl = $('.list-loading', elEl);
            //第一次show之前render出来
            if (loadingEl.length==0) {
                loadingEl = $('<div class="list-loading"></div>');
                loadingEl.prependTo(elEl);
                loadingEl.html('<span class="icon-loading"><img src="'+FS.BLANK_IMG+'" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span>');
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
            this.tempRequestData=requestData;
            this.pagination.jump(1);
        },
        "reload": function(requestData) {
            this.load(requestData);
        },
        "empty": function() {
            var opts=this.opts,
                attachType=opts.attachType;
            var listEl = $('.fs-'+attachType+'-list-inner', this.element),
                itemEl=$('.fs-'+attachType+'-item',listEl);
            itemEl.each(function(){
                var meEl=$(this),
                    itemV=meEl.data('itemV');
                //清除itemV
                itemV.remove();
                meEl.removeData();  //清空所有data数据
            });
            listEl.empty();
        },
        "destroy": function() {
            //搜索框销毁
            this._searchBarDestroy();
            //清空list
            this.list=null;
            this.pagination.destroy();
            //移除loading实例
            this.loading && this.loading.stop();
            this.empty();
            //取消pagination绑定
            this.pagination = null;
            this.tempRequestData={};
            this.element = null;
        }
    });
    module.exports=AttachList;
});
