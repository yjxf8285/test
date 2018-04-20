/**
 * 企信helper
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var moduleTpl=require('modules/fs-qx/fs-qx.html'),
        Dialog=require('dialog'),
        Events = require('events'),
        util=require('util'),
        filter=require('filter'),
        H5Uploader=require('h5uploader'),
        FlashUploader=require('flashuploader');
    var moduleTplEl=$(moduleTpl);   //模板对应的jquery对象
    var stringMatch=filter.stringMatch, //全词匹配
        startsWith=filter.startsWith;   //开头匹配
    var uploaderIndex= 0;   //flash上传计数
    /**
     * 上传组件，采用h5上传技术和flash fallback方案
     * @param opts
     * @constructor
     */
    var Uploader=function(opts){
        opts= _.extend({
            "element":null,
            "h5Opts":null, //h5的参数
            "flashOpts":null,  //flash参数
            "h5UploadPath":"/File/UploadFile", //上传地址
            "flashUploadPath":"/File/UploadFileByForm", //普通表单上传地址
            "onSelect":FS.EMPTY_FN,
            "onDelete":FS.EMPTY_FN,
            "onProgress":FS.EMPTY_FN,
            "onSuccess":FS.EMPTY_FN,
            "onFailure":FS.EMPTY_FN,
            "onComplete":FS.EMPTY_FN,
            "onFileNotFound": function(file){
                $('.submit-modal').hide();
                //util.alert('读取名为【'+file.name+"】的文件时发生错误，请检查文件是否存在");
                util.alert('网络不佳或不可用，附件上传失败');
            }

        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this.core=null; //内核
        this.coreType="h5"; //上传内核类型 h5/flash
        this.init();
    };
    _.extend(Uploader.prototype,{
        "init":function(){
            var that=this,
                opts=this.opts;
            var elEl=this.element,
                elWEl,
                flashDomId;
            var core=new H5Uploader(_.extend({
                multiple:false,
                accept:"*/*",
                fileInput:elEl.get(0),
                url: opts.h5UploadPath,
                onSelect: function (files) {
                    _.each(files,function(file){
                        return opts.onSelect.call(that,file);
                    });
                },
                onProgress:function(file,uploadedSize,totalSize){
                    
                    return opts.onProgress.call(that,file,uploadedSize,totalSize);
                },
                onSuccess: function (file, responseText) {
                    return opts.onSuccess.call(that,file,responseText);
                },
                onFailure: function (file) {
                    return opts.onFailure.call(that,file);
                },
                onFileNotFound: function(file){
                    return opts.onFileNotFound.call(that,file);
                },
                onComplete: function () {
                    return opts.onComplete.call(that);
                }
            },opts.h5Opts||{}));
            if(!core.isSupport()){
                elWEl=elEl.parent();
                flashDomId='fs-qx-flash-uploader-'+uploaderIndex;
                uploaderIndex++;
                elWEl.html('<span id="'+flashDomId+'"></span>');

                core=new FlashUploader(_.extend({
                    upload_url: FS.API_PATH+opts.flashUploadPath,
                    file_types : "*.*",
                    file_types_description : "All Files",
                    button_placeholder_id : flashDomId,
                    button_text:'',
                    file_queued_handler:function(file){
                        return opts.onSelect.call(that,file);
                    },
                    file_dialog_complete_handler : FS.EMPTY_FN,
                    upload_progress_handler : function(file, uploadedSize, totalSize){
                        return opts.onProgress.call(that,file,uploadedSize,totalSize);
                    },
                    upload_error_handler : function(file){
                        return opts.onFailure.call(that,file);
                    },
                    upload_success_handler : function(file, responseText){
                        return opts.onSuccess.call(that,file,responseText);
                    },
                    upload_complete_handler : function(){
                        return opts.onComplete.call(that);
                    }
                },opts.flashOpts));
                this.element=elWEl;
                this.coreType="flash";
            }
            this.core=core;
        },
        "removeFile":function(fileId){
            var opts=this.opts;
            var core=this.core;
            if(this.coreType=="h5"){
                core.removeFile(fileId);
            }else if(this.coreType=="flash"){
                core.core.cancelUpload(fileId, false);
            }
            opts.onDelete.call(this,fileId);
        },
        /**
         * 全部删除文件，默认不处理onDelete
         */
        "removeAllFile":function(){
            this.core.removeAllFile();
        },
        "startUpload":function(){
            var core=this.core;
            if(this.coreType=="h5"){
                core.startUpload();
            }else if(this.coreType=="flash"){
                core.core.startUpload();
            }
        },
        "setDisable":function(isDisabled){
            var elEl=this.element,
                wEl=elEl.parent();
            var core=this.core;
            isDisabled=!!isDisabled;
            if(this.coreType=="h5"){
                if(isDisabled){
                    elEl.prop('disabled',true).addClass('state-disabled');
                    wEl.addClass('state-disabled-wrapper');
                }else{
                    elEl.prop('disabled',false).removeClass('state-disabled');
                    wEl.removeClass('state-disabled-wrapper');
                }
            }else if(this.coreType=="flash"){
                core.core.setButtonDisabled(isDisabled);
                if(isDisabled){
                    elEl.addClass('state-disabled-wrapper');
                }else{
                    elEl.removeClass('state-disabled-wrapper');
                }
            }
        },
        "destroy":function(){
            this.core.destroy&&this.core.destroy();
        }
    });
    /**
     * 查询框组件class
     * @param opts
     * @constructor
     */
    var QueryInput=function(opts){
        opts= _.extend({
            "element":null,
            "cls":"" //附加列表className
        },opts||{});
        this.opts=opts;
        this.element=$(opts.element);
        this.init();
    };
    _.extend(QueryInput.prototype,{
        "init":function(){
            var that=this;
            var opts=this.opts;
            var elEl=this.element,
                wEl,
                emptyHEl;
            elEl.addClass('fs-qx-query '+opts.cls);
            //placeholder兼容性处理
            util.placeholder(elEl);
            //重新设置input宽度，减去padding值
            elEl.width(elEl.width()-32-5);
            //外面包一层span
            elEl.wrap('<span class="fs-qx-query-wrapper" />');
            wEl=elEl.closest('.fs-qx-query-wrapper');
            $('<span class="icon-query"></span>').appendTo(wEl);    //查询图标
            $('<span class="icon-empty">&#10005;</span>').appendTo(wEl);    //清空图标
            emptyHEl=$('.icon-empty',wEl);
            //注册事件
            wEl.on('click','.icon-empty',function(){
                elEl.val("").keyup();
                emptyHEl.hide();
            }).on('keyup','.fs-qx-query',function(evt){
                    var val= _.str.trim(elEl.val());
                    if(evt.keyCode!=38&&evt.keyCode!=40){
                        if(val.length>0){
                            emptyHEl.show();
                        }else{
                            emptyHEl.hide();
                        }
                        that.trigger('query',val);
                    }
                }).on('keydown','.fs-qx-query',function(evt){
                    if(evt.keyCode==38){     //向上
                        that.trigger('keynav','up');
                    }else if(evt.keyCode==40){  //向下
                        that.trigger('keynav','down');
                    }else if(evt.keyCode==13){  //enter
                        that.trigger('submit',evt);
                        evt.preventDefault();
                    }
                });
        },
        "getQuery":function(){
            return _.str.trim(this.element.val());
        },
        "reset":function(){
            var elEl=this.element,
                wEl=elEl.closest('.fs-qx-query-wrapper'),
                emptyBtnEl=$('.icon-empty',wEl);
            emptyBtnEl.click();
        },
        "destroy":function(){
            var elEl=this.element,
                wEl=elEl.closest('.fs-qx-query-wrappe');
            $('.icon-query,.icon-empty',wEl).remove();
            wEl.off();
            elEl.unwrap();
            elEl.width(elEl.width()+32+5);
            this.element=null;
        }
    });
    Events.mixTo(QueryInput);
    /**
     * 字母分组列表
     * @param opts
     * @constructor
     */
    var LetterGroupList=function(opts){
        opts= _.extend({
            "clickUnselect":true,   //true表示点击选中项会取消选中
            "singleSelect":false, //是否是单选模式，默认可以多选
            "element":null,
            "cls":"", //附加列表className
            "data":[],   //eg. [{"name":"13","id":"1","spell":"shisan"}]
            "emptyTip":"记录为空",   //空记录提醒
            "filterEmptyTip":"没有筛选条件为{{keyword}}的记录"
        },opts||{});
        this.opts=opts;
        this.element=$(opts.element);
        this.data=util.deepClone(opts.data); //内部维持一份动态的数据拷贝data
        this.init();
    };
    _.extend(LetterGroupList.prototype,{
        /**
         * 初始化入口
         */
        "init":function(){
            this._createList();
            this._bindEvents(); //绑定事件
        },
        "_bindEvents":function(){
            var that=this;
            var opts=this.opts,
                clickUnselect=opts.clickUnselect;
            var elEl=this.element;
            elEl.on('click','.letter-group-list .value-item',function(evt){
                var itemEl=$(this),
                    itemId=itemEl.attr('itemid');
                if(clickUnselect&&itemEl.hasClass('state-selected')){    //已选中项点击触发取消选中操作，否则触发选中操作
                    that.unselectItem(itemId);
                }else{
                    that.selectItem(itemId);
                }
            }).on('mouseenter','.letter-group-list .value-item',function(evt){
                    var itemEl=$(this);
                    itemEl.addClass('state-hover');
                }).on('mouseleave','.letter-group-list .value-item',function(evt){
                    var itemEl=$(this);
                    itemEl.removeClass('state-hover');
                });
        },
        /**
         * 创建列表dom结构
         */
        "_createList":function(data){
            var opts=this.opts,
                emptyTip=opts.emptyTip;
            var formatData=this._formatData(data||this.data), //格式化数据
                keys=formatData.keys,
                values=formatData.values;
            var elEl=this.element;
            var htmlStr = '';
            _.each(keys, function (key) {
                var item = values[key];
                var len = item.length,
                    htmlStr2 = '';
                htmlStr += '<li class="group-key-item" letter="'+key+'"><div class="index-box fn-clear"><div class="index-keyword fn-left">' + key + '</div><div class="item-length fn-right">' + len + '项</div></div><ul class="value-view">';
                _.each(item, function (subItem) {
                    htmlStr2 += '<li class="value-item" itemid="' + subItem.id + '">' + subItem.name + '</li>';
                });
                htmlStr += htmlStr2 + '</ul></li>';
            });
            if(htmlStr.length==0){
                elEl.html('<div class="empty-tip">'+emptyTip+'</div>');
            }else{
                elEl.html('<ul class="letter-group-list">'+htmlStr+'</ul>');
            }
            if(opts.cls){
                $('.letter-group-list',elEl).addClass(opts.cls);
            }
        },
        /**
         * 对原始数据格式化
         * @param originData
         * @returns {{}}
         */
        "_formatData":function(originData){
            var newData={};
            newData.values = _.groupBy(originData, function (v) {
                return v.spell.slice(0, 1).toUpperCase();
            });
            newData.keys = _.sortBy(_.keys(newData.values), function (v) {
                return v;
            });
            return newData;
        },
        /**
         * 通过itemId获取完整itemData信息
         * @param itemId
         * @returns {null}
         */
        "getItemDataById":function(itemId){
            var data=this.data,
                itemData;
            itemData=_.find(data,function(itemData2){
                return itemData2.id==itemId;
            });
            return itemData;
        },
        /**
         * 选中一个item，已选中项不会触发选中操作
         * @param itemId
         */
        "selectItem":function(itemId,silent){
            var opts=this.opts,
                singleSelect=opts.singleSelect;
            var elEl=this.element,
                listEl=$('.letter-group-list',elEl),
                itemEl=$('[itemid="'+itemId+'"]',listEl);
            var itemData=this.getItemDataById(itemId);
            if(singleSelect){   //单选模式选中前需要取消其他选中
                this.unselectAllItem(true);
            }
            if(itemEl.length>0){
                if(!itemEl.hasClass('state-selected')){ //如果选中才会触发select操作
                    itemEl.addClass('state-selected');
                    !silent&&this.trigger('select',itemData,itemEl);
                }
            }
        },
        /**
         * 取消选中一个item，未选中项不会触发取消选中操作
         * @param itemId
         */
        "unselectItem":function(itemId,silent){
            var elEl=this.element,
                listEl=$('.letter-group-list',elEl),
                itemEl=$('[itemid="'+itemId+'"]',listEl);
            var itemData=this.getItemDataById(itemId);
            if(itemEl.length>0){
                if(itemEl.hasClass('state-selected')){ //如果没有选中才会触发unselect操作
                    itemEl.removeClass('state-selected');
                    !silent&&this.trigger('unselect',itemData,itemEl);
                }
            }
        },
        /**
         * 全部选中快捷方式
         */
        "selectAllItem":function(silent){
            var that=this;
            var data=this.data;
            _.each(data,function(itemData){
                that.selectItem(itemData.id,silent);
            });
        },
        /**
         * 全部取消快捷方式
         */
        "unselectAllItem":function(silent){
            var that=this;
            var data=this.data;
            _.each(data,function(itemData){
                that.unselectItem(itemData.id,silent);
            });
        },
        /**
         * 删除一个item
         * @param itemId
         * @param silent 是否触发remove事件
         */
        "removeItem":function(itemId,silent){
            var elEl=this.element,
                listEl=$('.letter-group-list',elEl),
                itemEl=$('[itemid="'+itemId+'"]',listEl);
            var data=this.data,
                itemData=this.getItemDataById(itemId);
            if(itemEl.length>0){
                data= _.filter(data,function(itemData){
                    return itemData.id!=itemId;
                });
                //重设回this.data
                this.data=data;
                //重新构建list
                this._createList();
                //触发remove事件
                !silent&&this.trigger('remove',itemData,itemEl);
            }
        },
        /**
         * 添加一个item，已存在的itemData不会重复添加
         * @param itemData
         * @param silent 是否触发remove事件
         */
        "addItem":function(itemData,silent){
            var elEl=this.element,
                listEl=$('.letter-group-list',elEl),
                itemEl=$('[itemid="'+itemData.id+'"]',listEl);
            var data=this.data;
            if(itemEl.length==0){
                //itemData._temp=true;    //表示数据未经确认
                data.push(itemData);
                //重设回this.data
                this.data=data;
                //重新构建list
                this._createList();
                //触发add事件
                !silent&&this.trigger('add',itemData,itemEl);
            }
        },
        /**
         * 确认新加入的数据
         */
        /*"commitData":function(){
         var data=this.data;
         _.each(data,function(itemData){
         delete itemData._temp;
         });
         },*/
        /**
         * 获取新加入未经确认的临时数据
         */
        /*"getTempData":function(){
         var data=this.data,
         tempData;
         tempData= _.filter(data,function(itemData){
         return itemData._temp;
         });
         return tempData;
         },*/
        /**
         * 获取当前数据状态，和opts.data比较
         */
        "getDataState":function(){
            var opts=this.opts,
                originData=opts.data,
                data=this.data,
                dataState={},
                add=[],
                lost=[];
            _.each(data,function(itemData){
                if(!_.find(originData,function(itemData2){
                    return itemData.id==itemData2.id;
                })){
                    add.push(itemData);
                }
            });
            _.each(originData,function(itemData){
                if(!_.find(data,function(itemData2){
                    return itemData.id==itemData2.id;
                })){
                    lost.push(itemData);
                }
            });
            dataState.add=add;
            dataState.lost=lost;
            return dataState;
        },
        /**
         * 关键字过滤
         * @param keyword
         */
        "filter":function(keyword){
            var opts=this.opts,
                filterEmptyTip=opts.filterEmptyTip;
            var data=this.data,
                filterData=[],
                filterData1,
                filterData2;
            keyword=_.str.trim(keyword);    //过滤前后空格
            //确保数据源spell都小写
            _.each(data,function(itemData){
                itemData.spell=itemData.spell.toLowerCase();
            });
            if(keyword.length>0){
                /*filterData= _.filter(data,function(itemData){
                 var spell=itemData.spell,
                 name=itemData.name;
                 //全词匹配方式
                 if(spell.indexOf(keyword)>-1){
                 return true;
                 }
                 if(name.indexOf(keyword)>-1){
                 return true;
                 }
                 });*/
                filterData1=stringMatch(data,keyword,{
                    "key":"name"
                });
                filterData2=startsWith(data,keyword.toLowerCase(),{
                    "key":"spell"
                });
                //先插入filterData2的数据
                _.each(filterData2,function(itemData){
                    if(!_.find(filterData1,function(itemData2){
                        return itemData2.id==itemData.id;
                    })){
                        filterData.push(itemData);
                    }
                });
                filterData=filterData.concat(filterData1);
            }else{
                filterData=data;
            }
            //重新创建dom list
            this._createList(filterData);
            if(keyword.length>0&&filterData.length==0){
                $('.empty-tip',this.element).html(_.template(filterEmptyTip)({
                    "keyword":keyword
                }));
            }
        },
        /**
         * 获取选中的itemData {Array}
         */
        "getSelectedItemData":function(){
            var elEl=this.element,
                listEl=$('.letter-group-list',elEl),
                itemEl=$('.state-selected',listEl);
            var data=this.data,
                selectedDatas=[];
            itemEl.each(function(){
                var meEl=$(this),
                    itemId=meEl.attr('itemid'),
                    selectedData;
                selectedData= _.find(data,function(itemData){
                    return itemData.id==itemId;
                });
                if(selectedData){
                    selectedDatas.push(selectedData);
                }

            });
            return selectedDatas;
        },
        /**
         * 设置列表数据
         * @param data
         */
        "setData":function(data){
            data=data||[];
            this.data=data;
            this._createList();
        },
        /**
         * 获取列表数据
         */
        "getData":function(){
            return this.data;
        },
        /**
         * 销毁工作
         */
        "destroy":function(){
            this.data=null;
            this.opts=null;
            this.element.off();
            this.element.empty();
        }
    });
    Events.mixTo(LetterGroupList);
    /**
     * 邀请对话框
     * @type {*}
     */
    var JoinDialog=Dialog.extend({
        attrs: {
            "width":600,
            /*"height":600,*/
            //"trigger": '#trigger',
            "content":moduleTplEl.filter('.fs-qx-join-tpl').html(),
            "className":"fs-qx-join-dialog",
            "unjoinData":{  //未邀请数据，默认除登录用户外的所有数据
                "value":[],
                "getter":function(val){
                    /*var contactData;
                    if(val.length==0){
                        contactData=util.getContactData();
                        val=contactData["p"];
                    }*/
                    return val;
                }
            },
            "joinData":{    //已邀请数据，默认是登录用户
                "value":[],
                "getter":function(val){
                    /*var contactData;
                    if(val.length==0){
                        contactData=util.getContactData();
                        val=[contactData["u"]];
                    }*/
                    return val;
                }
            },
            "unjoinLabel":"未邀请",
            "joinLabel":"已邀请",
            "unit":"人",
            "bbarUnit":"人",
            "inputPlaceholder":"",
            "unjoinEmptyTip":"记录为空",
            "unjoinSearchEmptyTip":"未找到{{keyword}}的记录",
            "joinEmptyTip":"记录为空",
            "joinSearchEmptyTip":"未找到{{keyword}}的记录",
            "successCb":FS.EMPTY_FN, //点击“确定”的回调
            "moveLeftIntercept":FS.EMPTY_FN,
            "moveRightIntercept":FS.EMPTY_FN,
            "joinMinNum":-1, //最少参与项
            "joinMinNumTpl":"参与组最少{{joinMinNum}}人"
        },
        events: {
            'click':'_clickEl', //拦截click事件，防止触发聊天窗口隐藏
            'click .move-right-btn':'_clickMoveRight', //右移
            'click .move-left-btn':'_clickMoveLeft',   //左移
            'click .unjoin-wrapper .check-all':'_unjoinSelectAll', //未邀请全选
            'click .join-wrapper .check-all':'_joinSelectAll',   //已邀请全选
            'click .show-add-data-l':'_selectAddJoinItem', //显示新邀请的人
            'click .show-lost-data-l':'_selectLostJoinItem', //显示新取消邀请的人
            'click .f-sub': '_submit',
            'click .f-cancel': '_cancel'
        },
        setup:function(){
            var result=JoinDialog.superclass.setup.apply(this,arguments);
            this._bindEvents();
            return result;
        },
        render:function(){
            var result=JoinDialog.superclass.render.apply(this,arguments);
            this._renderSelf();
            this._renderQuery();
            this._renderList();
            return result;
        },
        /**
         * 事件注册
         * @private
         */
        _bindEvents:function(){
            var elEl=this.element,
                subEl; //确定按钮
            this.on('statechange',function(changeData){
                var addNum=changeData.addNum,
                    lostNum=changeData.lostNum;
                subEl=$('.f-sub',elEl);
                if(addNum+lostNum>0){
                    subEl.removeClass('button-state-disabled').prop('disabled',false);
                }else{
                    subEl.addClass('button-state-disabled').prop('disabled',true);
                }
            });
        },
        _clickEl:function(evt){
            evt.stopPropagation();
        },
        /**
         * 根据配置项修改dom显示
         * @private
         */
        _renderSelf:function(){
            var unjoinLabel=this.get('unjoinLabel'),
                joinLabel=this.get('joinLabel'),
                unit=this.get('unit'),
                bbarUnit=this.get('bbarUnit'),
                inputPlaceholder=this.get('inputPlaceholder');
            var elEl=this.element,
                unjoinWEl=$('.unjoin-wrapper',elEl),
                joinWEl=$('.join-wrapper',elEl),
                unjoinLabelEl=$('.unjoin-label',elEl),
                joinLabelEl=$('.join-label',elEl);
            unjoinLabelEl.text(unjoinLabel);
            joinLabelEl.text(joinLabel);
            $('.unit',unjoinWEl).text(unit);
            $('.unit',joinWEl).text(unit);
            $('.ui-dialog-bbar .unit',elEl).text(bbarUnit);
            $('.box-search',elEl).attr('placeholder',inputPlaceholder);
        },
        /**
         * 渲染query查询框
         * @private
         */
        _renderQuery:function(){
            var that=this;
            var elEl=this.element,
                unjoinQueryEl=$('.unjoin-wrapper .box-search',elEl),  //未邀请查询框
                joinQueryEl=$('.join-wrapper .box-search',elEl),  //已邀请查询框
                unjoinShowNumEl=$('.unjoin-wrapper .show-num',elEl),    //未邀请过滤显示人数
                joinShowNumEl=$('.join-wrapper .show-num',elEl);    //已邀请过滤显示人数
            //初始化未邀请查询框
            this.unjoinQuery=new QueryInput({
                "element":unjoinQueryEl,
                "cls":"unjoin-query"
            });
            //query事件绑定
            this.unjoinQuery.on('query',function(keyword){
                that.unjoinList.filter(keyword);
                if(keyword.length>0){
                    $('.num',unjoinShowNumEl).text($('.unjoin-wrapper .value-item',elEl).length);
                    unjoinShowNumEl.show();
                }else{
                    unjoinShowNumEl.hide();
                }
                $('.unjoin-wrapper .select-summary .num',elEl).text(0);
//                $('.move-right-btn',elEl).addClass('button-state-disabled');
            });
            //初始化已邀请查询框
            this.joinQuery=new QueryInput({
                "element":joinQueryEl,
                "cls":"join-query"
            });
            //query事件绑定
            this.joinQuery.on('query',function(keyword){
                that.joinList.filter(keyword);
                if(keyword.length>0){
                    $('.num',joinShowNumEl).text($('.join-wrapper .value-item',elEl).length);
                    joinShowNumEl.show();
                }else{
                    joinShowNumEl.hide();
                }
                $('.join-wrapper .select-summary .num',elEl).text(0);
//                $('.move-left-btn',elEl).addClass('button-state-disabled');
            });
        },
        /**
         * 渲染未邀请和已邀请列表
         * @private
         */
        _renderList:function(){
            var that=this;
            var unjoinEmptyTip=this.get('unjoinEmptyTip'),
                joinEmptyTip=this.get('joinEmptyTip'),
                unjoinSearchEmptyTip=this.get('unjoinSearchEmptyTip'),
                joinSearchEmptyTip=this.get('joinSearchEmptyTip');
            var elEl=this.element,
                unjoinWEl=$('.unjoin-wrapper .box-list-wrapper',elEl),  //未邀请列表容器
                joinWEl=$('.join-wrapper .box-list-wrapper',elEl),  //已邀请列表容器
                rightBtnEl=$('.move-right-btn',elEl),   //右移按钮
                leftBtnEl=$('.move-left-btn',elEl), //左移按钮
                unjoinNumEl=$('.unjoin-wrapper .contain-num .num',elEl),    //未邀请人数
                joinNumEl=$('.join-wrapper .contain-num .num',elEl),    //已邀请人数
                unjoinSelectNumEl=$('.unjoin-wrapper .select-summary .num',elEl),    //未邀请选中人数
                joinSelectNumEl=$('.join-wrapper .select-summary .num',elEl),    //已邀请选中人数
                joinTempNumEl=$('.join-temp-num',elEl),    //临时添加邀请人数
                unjoinTempNumEl=$('.unjoin-temp-num',elEl), //临时取消邀请人数
                joinAllCkEl=$('.join-wrapper .check-all',elEl),
                unjoinAllCkEl=$('.unjoin-wrapper .check-all',elEl);
            //初始化未邀请列表
            this.unjoinList=new LetterGroupList({
                "element":unjoinWEl,
                "data":this.get('unjoinData'),
                "cls":"unjoin-list box-list",
                "emptyTip":unjoinEmptyTip,
                "filterEmptyTip":unjoinSearchEmptyTip
            });
            //绑定选中事件
            this.unjoinList.on('select',function(){
                var selectedDatas=that.unjoinList.getSelectedItemData();
                rightBtnEl.removeClass('button-state-disabled').prop('disabled',false);
                unjoinSelectNumEl.text(selectedDatas.length);
                if(selectedDatas.length==elEl.find('.unjoin-list .value-item').length){
                    unjoinAllCkEl.prop('checked',true);
                }else{
                    unjoinAllCkEl.prop('checked',false);
                }
            }).on('unselect',function(){
                    var selectedDatas=that.unjoinList.getSelectedItemData();
                    if(selectedDatas.length==0){
                        rightBtnEl.addClass('button-state-disabled').prop('disabled',true);
                    }
                    unjoinSelectNumEl.text(selectedDatas.length);
                    //取消全选
                    unjoinAllCkEl.prop('checked',false);
                });
            //绑定添加和输出事件
            this.unjoinList.on('add',function(){
                unjoinNumEl.text(that.unjoinList.data.length);
            }).on('remove',function(){
                    unjoinNumEl.text(that.unjoinList.data.length);
                });
            //初始化已邀请列表
            this.joinList=new LetterGroupList({
                "element":joinWEl,
                "data":this.get('joinData'),
                "cls":"join-list box-list",
                "emptyTip":joinEmptyTip,
                "filterEmptyTip":joinSearchEmptyTip
            });
            //绑定选中事件
            this.joinList.on('select',function(){
                var selectedDatas=that.joinList.getSelectedItemData();
                leftBtnEl.removeClass('button-state-disabled').prop('disabled',false);
                joinSelectNumEl.text(selectedDatas.length);
                if(selectedDatas.length==elEl.find('.join-list .value-item').length){
                    joinAllCkEl.prop('checked',true);
                }else{
                    joinAllCkEl.prop('checked',false);
                }
            }).on('unselect',function(){
                    var selectedDatas=that.joinList.getSelectedItemData();
                    if(selectedDatas.length==0){
                        leftBtnEl.addClass('button-state-disabled').prop('disabled',true);
                    }
                    joinSelectNumEl.text(selectedDatas.length);
                    //取消全选
                    joinAllCkEl.prop('checked',false);
                });
            //绑定添加和输出事件
            this.joinList.on('add',function(){
                var dataState=that.joinList.getDataState();
                joinNumEl.text(that.joinList.data.length);
                joinTempNumEl.text(dataState.add.length);
                unjoinTempNumEl.text(dataState.lost.length);
                //触发statechange事件，控制确认按钮的状态
                that.trigger('statechange',{
                    "addNum":dataState.add.length,
                    "lostNum":dataState.lost.length
                });
            }).on('remove',function(){
                    var dataState=that.joinList.getDataState();
                    joinNumEl.text(that.joinList.data.length);
                    joinTempNumEl.text(dataState.add.length);
                    unjoinTempNumEl.text(dataState.lost.length);
                    that.trigger('statechange',{
                        "addNum":dataState.add.length,
                        "lostNum":dataState.lost.length
                    });
                });
            //初始化未邀请人数和已邀请人数
            unjoinNumEl.text(this.get('unjoinData').length);
            joinNumEl.text(this.get('joinData').length);
        },
        /**
         * 点击右移按钮
         * @param evt
         * @private
         */
        _clickMoveRight:function(evt){
            var that=this;
            var moveRightIntercept=this.get("moveRightIntercept");
            var unjoinList=this.unjoinList,
                joinList=this.joinList,
                joinQuery=this.joinQuery,
                unjoinQuery=this.unjoinQuery,
                rightBtnEl=$(evt.currentTarget),
                elEl=this.element,
                checkAllEl=$('.unjoin-wrapper .check-all',elEl),
                unjoinSelectNumEl=$('.unjoin-wrapper .select-summary .num',elEl);    //未邀请选中人数

            var unjoinSelectedDatas=unjoinList.getSelectedItemData();
            evt.stopPropagation();
            if(unjoinSelectedDatas.length>0){
                //右列表添加，左列表删除，触发add和remove事件
                _.each(unjoinSelectedDatas,function(unjoinSelectedData){
                    if(moveRightIntercept.call(that,unjoinSelectedData)!==false){
                        joinList.addItem(unjoinSelectedData);
                        unjoinList.removeItem(unjoinSelectedData.id);
                    }
                });
                rightBtnEl.addClass('button-state-disabled').prop('disabled',true);
                checkAllEl.prop('checked',false);
                unjoinSelectNumEl.text('0');
                //清空搜索框
                //this.unjoinQuery.reset();
                //this.joinQuery.reset();
                //手动触发query
                joinQuery.trigger('query',joinQuery.getQuery());
                unjoinQuery.trigger('query',unjoinQuery.getQuery());
            }
        },
        /**
         * 点击左移按钮
         * @param evt
         * @private
         */
        _clickMoveLeft:function(evt){
            var that=this;
            var moveLeftIntercept=this.get("moveLeftIntercept"),
                joinMinNum=this.get('joinMinNum'),
                joinMinNumTpl=this.get('joinMinNumTpl');
            var unjoinList=this.unjoinList,
                joinList=this.joinList,
                joinQuery=this.joinQuery,
                unjoinQuery=this.unjoinQuery,
                leftBtnEl=$(evt.currentTarget),
                elEl=this.element,
                checkAllEl=$('.join-wrapper .check-all',elEl),
                joinSelectNumEl=$('.join-wrapper .select-summary .num',elEl);    //已邀请选中人数;
            var joinSelectedDatas=joinList.getSelectedItemData(),
                joinDatas=joinList.getData();
            evt.stopPropagation();
            //群对话至少要2人
            if(joinMinNum>-1&&(joinDatas.length-joinSelectedDatas.length)<joinMinNum){
                //util.alert('群对话最少应有'+joinMinNum+'人');
                util.alert( _.template(joinMinNumTpl)({
                    joinMinNum: joinMinNum
                }));
                return;
            }
            if(joinSelectedDatas.length>0){
                //右列表删除，左列表添加，触发add和remove事件
                _.each(joinSelectedDatas,function(joinSelectedData){
                    if(moveLeftIntercept.call(that,joinSelectedData)!==false){
                        joinList.removeItem(joinSelectedData.id);
                        unjoinList.addItem(joinSelectedData);
                    }
                });
                leftBtnEl.addClass('button-state-disabled').prop('disabled',true);
                checkAllEl.prop('checked',false);
                joinSelectNumEl.text('0');
                //清空搜索框
                //this.unjoinQuery.reset();
                //this.joinQuery.reset();
                joinQuery.trigger('query',joinQuery.getQuery());
                unjoinQuery.trigger('query',unjoinQuery.getQuery());
            }
        },
        /**
         * 未邀请list全选
         * @param evt
         * @private
         */
        _unjoinSelectAll:function(evt){
            var unjoinList=this.unjoinList;
            var inputEl=$(evt.currentTarget);
            if(inputEl.prop('checked')){
                unjoinList.selectAllItem();
            }else{
                unjoinList.unselectAllItem();
            }
        },
        /**
         * 已邀请list全选
         * @param evt
         * @private
         */
        _joinSelectAll:function(evt){
            var joinList=this.joinList;
            var inputEl=$(evt.currentTarget);
            if(inputEl.prop('checked')){
                joinList.selectAllItem();
            }else{
                joinList.unselectAllItem();
            }
        },
        _selectAddJoinItem:function(evt){
            var joinList=this.joinList;
            var dataState=joinList.getDataState(),
                addData=dataState.add;
            if(addData.length>0){
                _.each(addData,function(itemData){
                    joinList.selectItem(itemData.id);
                });
            }
            evt.preventDefault();
        },
        _selectLostJoinItem:function(evt){
            var joinList=this.joinList,
                unjoinList=this.unjoinList;
            var dataState=joinList.getDataState(),
                lostData=dataState.lost;
            if(lostData.length>0){
                _.each(lostData,function(itemData){
                    unjoinList.selectItem(itemData.id);
                });
            }
            evt.preventDefault();
        },
        _submit:function(evt){
            var btnEl=$(evt.currentTarget);
            var successCb=this.get('successCb');
            var joinList=this.joinList;
            //受邀请的列表数据作为参数传过去
            if(!btnEl.hasClass('button-state-disabled')){
                successCb&&successCb.call(this,joinList.getData());
            }
        },
        _cancel:function(){
            this.hide();
        },
        /**
         * 重置初始化状态
         */
        resetInitState:function(){
            var elEl=this.element,
                rightBtnEl=$('.move-right-btn',elEl),   //右移按钮
                leftBtnEl=$('.move-left-btn',elEl), //左移按钮
                unjoinNumEl=$('.unjoin-wrapper .contain-num .num',elEl),    //未邀请人数
                joinNumEl=$('.join-wrapper .contain-num .num',elEl),    //已邀请人数
                unjoinSelectNumEl=$('.unjoin-wrapper .select-summary .num',elEl),    //未邀请选中人数
                joinSelectNumEl=$('.join-wrapper .select-summary .num',elEl),    //已邀请选中人数
                joinTempNumEl=$('.join-temp-num',elEl),    //临时添加邀请人数
                unjoinTempNumEl=$('.unjoin-temp-num',elEl), //临时取消邀请人数
                checkAllEl=$('.check-all',elEl),    //全选复选框
                subEl=$('.f-sub',elEl); //确定按钮
            var joinList=this.joinList,
                unjoinList=this.unjoinList,
                joinData=joinList.data,
                unjoinData=unjoinList.data;
            leftBtnEl.addClass('button-state-disabled').prop('disabled',true);
            rightBtnEl.addClass('button-state-disabled').prop('disabled',true);

            unjoinNumEl.text(unjoinData.length);
            joinNumEl.text(joinData.length);
            //joinList.unselectAllItem(true)
            unjoinSelectNumEl.text("0");
            joinSelectNumEl.text("0");
            joinTempNumEl.text("0");
            unjoinTempNumEl.text("0");
            checkAllEl.prop('checked',false);
            //确定按钮禁用
            subEl.addClass('button-state-disabled').prop('disabled',true);
            //搜索框清空
            this.joinQuery.reset();
            this.unjoinQuery.reset();
            //list滚动到最上面
            joinList.element.scrollTop(0);
            unjoinList.element.scrollTop(0);
        },
        /**
         * 设置标题显示
         */
        setTitle:function(title){
            $('.ui-dialog-title',this.element).text(title);
        },
        /**
         * 设置邀请和未邀请初始化数据
         *
         */
        setInitData:function(data){
            var joinData=data.joinData, //已邀请数据列表
                unjoinData=data.unjoinData; //未邀请数据列表
            var joinList=this.joinList,
                unjoinList=this.unjoinList;
            joinList.setData(util.deepClone(joinData));
            joinList.opts.data=joinData;  //替换原始数据
            unjoinList.setData(util.deepClone(unjoinData));
            unjoinList.opts.data=unjoinData; //替换原始数据
            //重置状态
            this.resetInitState();
        },
        destroy:function(){
            var result;
            //销毁列表对象
            this.unjoinList&&this.unjoinList.destroy();
            this.joinList&&this.joinList.destroy();
            this.unjoinList=null;
            this.joinList=null;
            //销毁查询框对象
            this.unjoinQuery&&this.unjoinQuery.destroy();
            this.joinQuery&&this.joinQuery.destroy();
            this.unjoinQuery=null;
            this.joinQuery=null;

            result=JoinDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });

    _.extend(exports,{
        "QueryInput":QueryInput,
        "LetterGroupList":LetterGroupList,
        "JoinDialog":JoinDialog,
        "Uploader":Uploader
    });
});