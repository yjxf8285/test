/**
 * FS文件预览,类adobe pdf reader展示方式
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl;
    var $ = require("$"),
        Overlay = require("overlay"),
        Position=require('position'),
        moment=require('moment'),
        util=require('util'),
        fileReaderTpl=require('./fs-attach.html'),
//        moduleStyle=require('./fs-attach.css'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6,
        body = $(document.body),
        htmlEl=$('html'),
        doc = $(document),
        win=$(window);
    //模板
    var fileReaderTplEl=$(fileReaderTpl).filter('.fs-attach-file-reader-tpl');
    var FileReader = Overlay.extend({
        attrs: {
            //width: isIE6 ? doc.outerWidth(true) : "100%",
            // height: isIE6 ? doc.outerHeight(true) : "100%",
            width: isIE6 ? win.width() : "100%",
            height: isIE6 ? win.height() : "100%",
            className: "fs-attach-file-reader",
            opacity: 1,
            backgroundColor: "#000",
            style: {
                position: isIE6 ? "absolute" : "fixed",
                top: 0,
                left: 0
            },
            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            },
            zIndex:1001,
            directOpenPath:'/DF/Get', //txt和image直接打开地址
            fileInfoPath:'/Doc/Preview',   //获取文件信息接口，包括文件总页数信息
            readPath:'/Doc/Page',   //生成文件图片接口
            fileId:0,   //文件id
            fileName:'',    //文件名
            filePath:'', //文件路径
            pageWidth:780,   //生成预览文档宽度
            pageHeight:0, //生成预览文档每页高度
            pageCount:0    //生成页面总数
            //activePageNumber:0  //当前定位页码
        },
        events: {
            'click .file-reader-tbar .close-l': '_clickCloseLink',   //点击关闭按钮隐藏自身
            'click .pagination-wrapper .nav-l':'_clickNavLeft', //点击左导航
            'click .pagination-wrapper .nav-r':'_clickNavRight' //点击右导航
        },
        show: function() {
            /*if (isIE6) {
             this.set("width", doc.outerWidth(true));
             this.set("height", doc.outerHeight(true));
             }*/
            var result;
            if (isIE6) {
                this.set("width", win.width());
                this.set("height", win.height());
                //定位
                this.element.css({
                    "top":win.scrollTop(),
                    "left":win.scrollLeft()
                });
            }
            return FileReader.superclass.show.call(this);
        },
        hide:function(){
            var result;
            //清理
            this._clear();
            result=FileReader.superclass.hide.call(this);
            return result;
        },
        setup: function() {
            var that=this;
            this._createEl();

            //每次show后调整位置和尺寸
            this.before('show',function(){
                //设置全屏模式
               util.setFullScreen(true);
            });
            this.after('show',function(){
                that.adjustPosSize();
            });
            //每次隐藏后reset状态
            this.after('hide',function(){
                //that._resetPanel()
                //设置非全屏模式
                util.setFullScreen(false);
            });
            //点击element本身隐藏
            this.element.on('click',function(){
                //that.hide();
            });
            //window resize时调整panel大小位置
            this.after("_setPosition", function() {
                this.adjustPosSize();
                if (isIE6) {
                    //定位
                    this.element.css({
                        "top":win.scrollTop(),
                        "left":win.scrollLeft()
                    });
                    this.set("width", win.width());
                    this.set("height", win.height());
                }
            });
            //ie6下随window scroll重新定位element
            if (isIE6) {
                win.scroll(function(){
                    var elEl=that.element;
                    if(elEl.is(':visible')){
                        elEl.css({
                            "top":win.scrollTop(),
                            "left":win.scrollLeft()
                        });
                    }
                });
            }
            this._lazyloadTid=null;  //懒加载时间句柄
            this._regEvents(); //注册事件
            // 加载 iframe 遮罩层并与 overlay 保持同步
            return FileReader.superclass.setup.call(this);
        },
        _regEvents:function(){
            var that=this;
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl);
            pageListWEl.bind('scroll',function(evt) {
                clearTimeout(that._lazyloadTid);
                that._lazyloadTid=setTimeout(function(){
                    that._lazyLoadPageImg();
                    //that._setActivePageNumber(); //设置当前激活页码
                    that._updateShowPageNumber(evt);   //更新导航显示的页码
                },400);
            });
        },
        /**
         * 取消事件绑定，在destroy方法中会调用
         * @private
         */
        _unRegEvents:function(){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl);
            pageListWEl.unbind('scroll');
        },
        _createEl:function(){
            var elEl=this.element;
            var compiled=_.template(fileReaderTplEl.html()), //模板编译方法
                renderData={};
            _.extend(renderData,{
                "blankImgSrc":FS.BLANK_IMG
            });
            elEl.html(compiled(renderData));
        },
        /**
         * 调整位置和尺寸
         */
        "adjustPosSize":function(){
            var elEl=this.element,
                tbarEl=$('.file-reader-tbar',elEl),
                pageListWEl=$('.page-list-wrapper',elEl);
            var winH=win.height();
            pageListWEl.height(winH-tbarEl.outerHeight()-5);
        },
        _clickNavLeft:function(evt){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl);
            var activePageNumber=this.getActiveNumberByScroll(),
                pageHeight=this.get('pageHeight');
            if(activePageNumber>1){
                activePageNumber--;
                pageListWEl.scrollTop((activePageNumber-1)*(pageHeight+12));
            }
            evt.preventDefault();
        },
        _clickNavRight:function(evt){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl);
            var activePageNumber=this.getActiveNumberByScroll(),
                pageCount=this.get('pageCount'),
                pageHeight=this.get('pageHeight');
            if(activePageNumber<pageCount){
                activePageNumber++;
                pageListWEl.scrollTop((activePageNumber-1)*(pageHeight+12));
            }
            evt.preventDefault();
        },
        /**
         * 设置显示的页码号
         * @private
         */
        _updateShowPageNumber:function(){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl),
                pageListEl=$('.page-list',elEl),
                currentPageNumEl=$('.current-page-num',elEl);
            var scrollTop=pageListWEl.scrollTop(),
                wHeight=pageListWEl.height(),
                pageHeight=this.get('pageHeight'),
                pageCount=this.get('pageCount'),
                currentPageNum;
            currentPageNum=Math.floor((scrollTop+wHeight/2)/pageHeight)+1;
            if(scrollTop+wHeight-pageListEl.height()>10){   //保证能显示出最后一页
                currentPageNum=pageCount;
            }
            currentPageNumEl.val(currentPageNum);
        },
        /**
         * 根据滚动距离获得当前定位的page number
         */
        getActiveNumberByScroll:function(){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl);
            var scrollTop=pageListWEl.scrollTop(),
                pageHeight=this.get('pageHeight');
            var activePageNumber=Math.floor(scrollTop/(pageHeight+12))+1;
            return activePageNumber;
        },
        /**
         * page图片懒加载
         * @param evt
         * @private
         */
        _lazyLoadPageImg:function(){
            var elEl=this.element,
                pageListWEl=$('.page-list-wrapper',elEl),
                pageItemEl=$('.page-item',pageListWEl),
                blankItemEl;
            var filePath=this.get('filePath'),
                pageWidth=this.get('pageWidth'),
                readPath=this.get('readPath');
            readPath=FS.API_PATH+readPath;  //补全请求地址
            //readPath='http://placehold.it/780x250'; //For test

            var scrollTop=pageListWEl.scrollTop(),
                wHeight= pageListWEl.height(),
                pageHeight=this.get('pageHeight');
            //过滤掉已经rendered的item
            blankItemEl=pageItemEl.filter(function(){
                return !$(this).data('rendered');
            });
            blankItemEl.each(function(){
                var itemEl=$(this),
                    boxEl=$('.page-box',itemEl);
                var index=pageItemEl.index(itemEl),
                    offsetTop=index*(pageHeight+12);    //10px的下边距+2px边框
                //if(scrollTop+wHeight>offsetTop){
                if(scrollTop+wHeight>offsetTop&&scrollTop<offsetTop+wHeight){
                    boxEl.attr('src',readPath+'?path='+filePath+'&pageIndex='+index+'&width='+pageWidth+'&maxContentLength=0');
                    //boxEl.attr('src',FS.BASE_PATH+'/html/fs/data/Page.png?r='+new Date());
                    itemEl.data('rendered',true);   //设置渲染完成标志
                }
            });
        },
        /**
         * 点击关闭按钮绑定句柄
         * @private
         */
        _clickCloseLink:function(evt){
            this.hide();
            evt.preventDefault();
        },
        /**
         * filePath setter调用
         * @param val
         */
        _onRenderFilePath:function(val){
            var that=this;
            var elEl=this.element,
                downloadEl=$('.download-l',elEl), //下载地址链接
                pageListWEl=$('.page-list-wrapper',elEl),
                tbarContentEl=$('.file-reader-tbar .file-reader-content',elEl), //头部内容区
                previewUnitEl=$('.preview-unit',elEl),  //预览单位
                totalCountEl=$('.total-page-num',elEl);
            var fileInfoPath=this.get('fileInfoPath'),
                fileName=that.get('fileName'),
                filePath=this.get('filePath'),
                directOpenPath=this.get('directOpenPath');
            if(val.length>0){
                //提前show
                this.show();
                util.api({
                    //"url":FS.BASE_PATH+'/html/fs/data/file-preview.txt',
                    "url":fileInfoPath,
                    "data":{
                        "path":val
                    },
                    "type":"get",
                    "cache":true,    //缓存请求
                    "success":function(responseData){
                        var dataRoot,
                            pageCount=0;
                        if(responseData.success){
                            dataRoot=responseData.value;
                            //分流预览方式
                            if(dataRoot.previewFormat==1||dataRoot.previewFormat==2){  //图片式预览和网页式预览
                                //设置预览格式
                                that.previewFormat=dataRoot.previewFormat;

                                pageCount=dataRoot.pageCount;
                                //设置显示文件总数
                                totalCountEl.text(pageCount);
                                //设置页面总数
                                that.set('pageCount',pageCount);
                                //设置pageHeight值
                                that._setPageSize(function(){
                                    //构建page item
                                    that._renderPageItem();
                                    //触发page list wrapper scroll事件
                                    pageListWEl.removeClass('overflow-hidden').scrollTop(0);
                                    //设置头部内容区宽度
                                    tbarContentEl.width(that.get('pageWidth'));
                                    //第一次触发懒加载行为
                                    that._lazyLoadPageImg();
                                    that._updateShowPageNumber();   //更新导航显示的页码
                                });
                                //downloadEl.attr('src',FS.API_PATH+fileInfoPath+'?feedID=0&fileID='+val+'&type=1');   //type==1是下载方式
                                downloadEl.attr('href',util.getDfLink(val,fileName,true));
                                //设置预览单位
                                if(dataRoot.previewFormat==1){
                                    previewUnitEl.text('页');
                                }else if(dataRoot.previewFormat==2){
                                    previewUnitEl.text('Sheet');
                                }
                            }else if(dataRoot.previewFormat==3){ //后台判定为文本格式，尝试打开，可能会被拦截
                                that.hide();
                                root.open(FS.API_PATH+directOpenPath+'/'+filePath,'_blank');
                            }
                        }/*else{
                            if(util.getFileType({ //如果是图片直接打开
                                "name":val
                            })=="jpg"){
                                window.open(util.getDfLink(val,fileName,false),"_blank");
                                that._clear(); //清理
                            }
                        }*/
                    }
                },{
                    //"autoPrependPath":false //For test，不自动补全api地址
                });
                //
            }
        },
        _onRenderFileName:function(val){
            var elEl=this.element,
                fileNameEl=$('.file-name',elEl);
            fileNameEl.text(val);
        },
        /**
         * 根据页面总数构建page item
         * @private
         */
        _renderPageItem:function(){
            var pageCount=this.get('pageCount'),
                pageWidth=this.get('pageWidth'),
                pageHeight=this.get('pageHeight');
            var elEl=this.element,
                pageListEl=$('.page-list',elEl);
            var htmlStr='';
            var previewFormat=this.previewFormat;
            if(previewFormat==1){
                for (var i = 0; i < pageCount; i++) {
                    htmlStr+='<div class="page-item" style="width:'+pageWidth+'px"><img src="'+FS.BLANK_IMG+'" alt="'+(i+1)+'" class="page-img page-box" width="'+pageWidth+'" height="'+pageHeight+'" /></div>';
                }
            }else if(previewFormat==2){
                for (var i = 0; i < pageCount; i++) {
                    htmlStr+='<div class="page-item" style="width:'+pageWidth+'px"><iframe class="page-box" src="'+FS.BLANK_PAGE+'" scrolling="no" frameborder="0" class="page-html" width="'+pageWidth+'" height="'+pageHeight+'" /></div>';
                }
            }

            pageListEl.html(htmlStr);
        },
        /**
         * 设置预览页单页宽高度
         * @private
         */
        _setPageSize:function(cb){
            var that=this;
            var filePath=this.get('filePath'),
                pageWidth=this.get('pageWidth'),
                readPath=this.get('readPath');
            var previewFormat=this.previewFormat;
            readPath=FS.API_PATH+readPath;  //补全请求地址
            //readPath='http://placehold.it/780x250'; //For test
            var img,
                ifr;
            var pagePath=readPath+'?path='+filePath+'&pageIndex=0&width='+pageWidth+'&maxContentLength=0';
            //var pagePath=FS.BASE_PATH+'/html/fs/data/Page.png';
            if(previewFormat==1){
                img = new Image();
                img.onload = function () {
                    that.set('pageHeight',this.height);
                    that.set('pageWidth',this.width);
                    //回调
                    cb.call(that);
                    img.onload=null;
                    img = null;
                };
                img.src = pagePath;
            }else if(previewFormat==2){
                ifr=$('<iframe/>');
                ifr.load(function(){
                    var win=this.contentWindow,
                        bodyEl=$(win.document.body),
                        tableEl=$('table',bodyEl);
                    that.set('pageHeight',parseInt(tableEl.height()+10));  //width和height必须保证为int型，不然接口会报错
                    that.set('pageWidth',parseInt(tableEl.width()+10));
                    //回调
                    cb.call(that);
                    ifr.unbind('load');
                    ifr.remove();
                });
                ifr.addClass('fn-hide-abs').attr('src',pagePath).appendTo('body');
            }

        },
        /**
         * 组件清空
         * @private
         */
        _clear:function(){
            var elEl=this.element,
                downloadEl=$('.download-l',elEl), //下载地址链接
                previewUnitEl=$('.preview-unit',elEl),  //预览单位
                totalCountEl=$('.total-page-num',elEl),
                pageListWEl=$('.page-list-wrapper',elEl),
                pageListEl=$('.page-list',elEl),
                tbarContentEl=$('.file-reader-tbar .file-reader-content',elEl); //头部内容区
            pageListWEl.addClass('overflow-hidden');
            pageListEl.scrollTop(0).empty();
            tbarContentEl.width(780);
            //设置内部属性值
            this.set('fileId',0);
            this.set('fileName','');
            this.set('filePath','');
            this.set('pageWidth',780);
            this.set('pageHeight',0);
            this.set('pageCount',0);

            //设置显示文件总数
            totalCountEl.text(0);
            //清空列表
            pageListEl.empty();
            downloadEl.attr('href','#');
            //设置预览单位为空
            previewUnitEl.text('');

        },
        /**
         * 文件预览接口
         * @param fileData
         */
        readFile:function(fileData){
            var fileInfoPath=this.get('fileInfoPath'),
                directOpenPath=this.get('directOpenPath'),
                extendName;
            var bindLinkEl;
            if(fileData.bindLinkSelector){   //如果是直接打开预览的文件，可以设置一个绑定的链接dom，触发a链接的打开行为
                bindLinkEl=$(fileData.bindLinkSelector);
            }
            if(!this.rendered){  //未渲染及时渲染
                this.render();
            }
            //判定预览方式
            extendName=util.getFileExtText(fileData.fileName);  //文件扩展名

            if(extendName=="xls"||extendName=="xlsx"){  //xls直接打开
                //表格文件走预览接口
                root.open(FS.BASE_PATH+fileInfoPath+'/'+fileData.filePath+'?name='+encodeURIComponent(fileData.fileName)+'&_x=0','_blank');
                return;
            }
            if(util.getUploadType(fileData.fileName)=="img"||extendName=="txt"||extendName=="csv"){
                //如果是图片或者txt文件直接打开
                if(bindLinkEl){
                    bindLinkEl.attr('href',FS.API_PATH+directOpenPath+'/'+fileData.filePath);
                }else{
                    root.open(FS.API_PATH+directOpenPath+'/'+fileData.filePath,'_blank');
                }
                return;
            }
            //设置内部属性值
            this.set('fileId',fileData.fileId);
            this.set('fileName',fileData.fileName);
            this.set('filePath',fileData.filePath);

        },
        destroy:function(){
            var result;
            this._unRegEvents();
            this.element.empty();
            clearTimeout(this._lazyloadTid);
            this._lazyloadTid=null;
            result=FileReader.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports={
        "FileReader":function(){    //改为单例模式，减少dom上的开销
            var selfFn=arguments.callee;
            if(!selfFn.singleIns){
                selfFn.singleIns=new FileReader();
            }
            return selfFn.singleIns;
        }
    };
});