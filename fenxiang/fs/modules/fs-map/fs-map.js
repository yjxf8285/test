/**
 * 地图组件
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var Events=require('events');
    var Overlay = require("overlay"),
        position=require('position'),
        moment=require('moment'),
        util=require('util'),
        fsMapTpl=require('./fs-map.html'),
        moduleStyle=require('./fs-map.css'),
        isIE6 = ($.browser || 0).msie && $.browser.version == 6,
        body = $(document.body),
        htmlEl=$('html'),
        doc = $(document),
        win=$(window);

    var fsMapEl=$(fsMapTpl);   //模板jquery对象

    var FsMap=function(opts){
        opts= _.extend({
            "element":null,
            "enforcRefresh":true,   //强制刷新
            "autoOpenTip":true,  //自动打开tip
            "tipTpl":'' //tip模板
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this.pointers=[];   //存储定位点引用
        this.init();
    };
    _.extend(FsMap.prototype,{
        "init":function(){
            var that=this;
            var opts=this.opts;

        },
        /**
         * 初始化地图
         * @param rootNs
         */
        "_initMap":function(rootNs){
            var mapCore,
                tool,
                view,
                scale;
            var AMap=rootNs.AMap;
            mapCore = new AMap.Map("map",{
                center:new AMap.LngLat(116.392936,39.919479)
            });
            mapCore.plugin(["AMap.ToolBar","AMap.OverView,AMap.Scale"],function(){
                //加载工具条
                tool = new AMap.ToolBar({
                    direction:false,
                    ruler:false,
                    autoPosition:false//禁止自动定位
                });
                mapCore.addControl(tool);
                //加载鹰眼
                view = new AMap.OverView({visible:false});
                mapCore.addControl(view);
                //加载比例尺
                scale = new AMap.Scale();
                mapCore.addControl(scale);
            });
            this.mapCore=mapCore;
            this.AMap=AMap;
            this.trigger('mapinit',rootNs); //iframe.contentWindow作为参数传递
        },
        /**
         * 获取map的iframe承载体
         */
        "_getMapIframe":function(){
            var that=this;
            var elEl=this.element,
                ifrEl=$('.map-ifr',elEl);
            if(ifrEl.length==0){
                ifrEl=$('<iframe class="map-ifr" src="'+FS.BASE_PATH+'/html/fs/modules/fs-map/fs-map-container.html" frameborder="0" scrolling="no" />');
                ifrEl.load(function(){
                    that._initMap(this.contentWindow);
                });
                ifrEl.appendTo(elEl);
                this.adjustSize();
            }
            return ifrEl;
        },
        /**
         * 自适应尺寸，是width==100%，height==100%
         */
        adjustSize:function(){
            var elEl=this.element,
                ifrEl=$('.map-ifr',elEl);
            if(ifrEl.length>0){
                ifrEl.attr('width',elEl.width());
                ifrEl.attr('height',elEl.height());
            }
            this.mapCore&&this.mapCore.setFitView();   //自适应视野级别
        },
        /**
         * 设置定位描点坐标
         * @param locationData
         *  longitude(*)
         *  latitude(*)
         */
        "setLocation":function(locationData){
            var opts=this.opts,
                enforcRefresh=opts.enforcRefresh;
            if(this.mapCore&&enforcRefresh){ //强制刷新将会清空原来的地图
                this.clear();
            }
            if(this.mapCore){
                 this._setLocation(locationData);
            }else{
                this._getMapIframe();   //iframe初始化
                this.one('mapinit',function(){
                    this._setLocation(locationData);
                });
            }
        },
        /**
         * 不直接调用，供setLocation调用
         * @param locationData
         */
        "_setLocation":function(locationData){
            var that=this;
            var opts=this.opts,
                tipTpl=opts.tipTpl;
            var mapCore=this.mapCore;
            var AMap=this.AMap;
            locationData=[].concat(locationData);
            //先清理以前的覆盖物和自定义图层
            mapCore.clearMap();
            mapCore.clearInfoWindow();
            //清理定位点
            _.each(this.pointers,function(pointerData){
                AMap.event.removeListener(pointerData.clickHandler);
            });
            this.pointers=[];

            _.each(locationData,function(itemData,i){
                var tipTplStr;
                if(_.isFunction(tipTpl)){
                    tipTplStr=tipTpl.call(that,itemData);
                }else{
                    tipTplStr=tipTplStr.toString();
                }
                var pointer=new AMap.Marker({
                    map:mapCore,
                    position:new AMap.LngLat(itemData.longitude,itemData.latitude), //基点位置
                    offset:new AMap.Pixel(0,-30), //相对于基点的偏移位置
                    //draggable:true,  //是否可拖动
                    content:'<span class="tip-pointer">'+(i+1)+'</span>'   //自定义覆盖物内容
                });
                var tip=new AMap.InfoWindow({
                    isCustom:true,
                    content:'<div class="fs-map-tip"><div class="tip-content">'+tipTplStr+'</div><span class="triangle-down-wrapper"><span class="triangle-down-1 triangle-down">&#9660;</span><span class="triangle-down-2 triangle-down">&#9660;</span></span></div>',
                    //size:new AMap.Size(300, 0),
                    offset:new AMap.Pixel(0, -45)
                });
                var clickHandler=AMap.event.addListener(pointer,'click',function(){
                    if(tip.getIsOpen()){
                        tip.close();
                    }else{
                        tip.open(mapCore, pointer.getPosition());
                        //mapCore.setFitView();
                        mapCore.setCenter(pointer.getPosition());
                    }
                });
                if(opts.autoOpenTip){   //自动打开tip
                    tip.open(mapCore, pointer.getPosition());
                }
                //存储pointer引用
                that.pointers.push({
                    "clickHandler":clickHandler,
                    "pointer":pointer,
                    "data":itemData
                });
            });
            try{
                mapCore.setFitView();   //自适应视野级别
            }catch(e){}

        },
        /**
         * 地图清理
         */
        "clear":function(){
            var elEl=this.element,
                ifrEl=$('.map-ifr',elEl);
            this.off();
            this.mapCore&&this.mapCore.destroy();
            this.mapCore=null;
            this.AMap=null;
            this.pointers=null;
            if(ifrEl.length>0){
                ifrEl.unbind('load').remove();
            }
            elEl.empty();
        },
        "destroy":function(){
            this.clear();
            this.element=null;
            this.opts=null;
            return this;
        }
    });
    Events.mixTo(FsMap);


    var FsMapOverlay=Overlay.extend({
        attrs: {
            //width: isIE6 ? doc.outerWidth(true) : "100%",
            // height: isIE6 ? doc.outerHeight(true) : "100%",
            width: isIE6 ? win.width() : "100%",
            height: isIE6 ? win.height() : "100%",
            className: "fs-map-overlay",
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
            zIndex:100
        },
        events: {
            'click .close-l':'_clickCloseLink',  //点击close按钮
            'click .qd-l':'hide'    //点击签到链接隐藏地图
        },
        show: function() {
            if (isIE6) {
                this.set("width", win.width());
                this.set("height", win.height());
                //定位
                this.element.css({
                    "top":win.scrollTop(),
                    "left":win.scrollLeft()
                });
            }
            return FsMapOverlay.superclass.show.call(this);
        },
        setup: function() {
            var that=this;
            this._createEl();   //创建结构
            //初始化FsMap
            this._setupMap();
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
                //非全屏模式
                util.setFullScreen(false);
            });
            //点击element本身隐藏
            this.element.on('click',function(){
                //that.hide();
            });
            //window resize时调整panel大小位置
            this.after("_setPosition", function() {
                if (isIE6) {
                    //定位
                    this.element.css({
                        "top":win.scrollTop(),
                        "left":win.scrollLeft()
                    });
                    this.set("width", win.width());
                    this.set("height", win.height());
                }
                that.adjustPosSize();
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
                        that.adjustPosSize();
                    }
                });
            }
            this._regEvents(); //注册事件
            // 加载 iframe 遮罩层并与 overlay 保持同步
            return FsMapOverlay.superclass.setup.call(this);
        },
        _setupMap:function(){
            var that=this;
            var elEl=this.element,
                mapWEl=$('.iframe-wrapper',elEl);
            this.map=new FsMap({
                "element":mapWEl,
                "tipTpl":function(itemData){
                    var address=that._addressHelper(itemData);
                    return '<h3 style="margin-bottom: 15px;">'+address+'</h3><p style="color:#999999;">'+util.getDateSummaryDesc(moment.unix(itemData.createTime),new Date(),2)+'</p>';
                }
            });
        },
        /**
         * 根据locationData构建地址
         * @private
         */
        _addressHelper:function(locationData){
            return util.getLocationInfo(locationData);
        },
        /**
         * 调整组件的position和size
         */
        adjustPosSize:function(){
            var elEl=this.element,
                mapWEl=$('.map-wrapper',elEl);
            mapWEl.width(elEl.width()*0.9);
            mapWEl.height(elEl.height()*0.8);
            position.center(mapWEl,elEl);
            this.map&&this.map.adjustSize();
        },
        _regEvents:function(){

        },
        /**
         * 取消事件绑定，在destroy方法中会调用
         * @private
         */
        _unRegEvents:function(){

        },
        _clickCloseLink:function(evt){
            this.hide();
            evt.preventDefault();
            evt.stopPropagation();
        },
        _createEl:function(){
            var elEl=this.element;
            elEl.html(fsMapEl.filter('.fs-map-overlay-tpl').html());
        },
        /**
         * 定位描点坐标
         */
        fixLocation:function(locationData,cusOpts){
            var map=this.map;
            cusOpts= _.extend({
                "showQd":true   //是否显示签到link，默认显示
            },cusOpts||{});
            map.setLocation(locationData);
            this.updateSummary(locationData,cusOpts);
            this.show();
        },
        /**
         * 更新底部统计信息
         */
        updateSummary:function(locationData,cusOpts){
            var elEl=this.element,
                bbarEl=$('.map-summary',elEl),
                addressEl=$('.address',bbarEl),
                qdLinkEl=$('.qd-l',bbarEl);
            var showQd=cusOpts.showQd;
            addressEl.text(this._addressHelper(locationData));
            if(showQd){
                qdLinkEl.show();
            }else{
                qdLinkEl.hide();
            }
            qdLinkEl.attr('href','#profile/profilelocations/=/id-'+locationData.employeeID);
        },
        render:function(){
            var result;
            result=FsMapOverlay.superclass.render.apply(this,arguments);
            return result;
        },
        destroy:function(){
            var result;
            this._unRegEvents();
            this.map&&this.map.destroy();
            this.element.empty();
            result=FsMapOverlay.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    module.exports={
        "FsMap":FsMap,
        "FsMapOverlay":FsMapOverlay
    };
});

