/**
 * 分页组件2
 *
 * 遵循seajs module规范
 * @author zhangdl
 */

define(function(require, exports, module) {
    /*
    *分页控件
    *pageSize必须属性
    *totalSize必须属性
    */
    var Widget=require('widget'),
        $ = require('$');

    var Pagination = Widget.extend({
        attrs: {
            "pageSize":10,
            "totalSize":-1,
            "activePageNumber":1,
            "pageNums":{
                "value":0,
                "getter":function(){
                    return this._pageNums;
                }
            }
        },
        events: {
            //'click .ui-pagination-num': '_numClick',
            'click .fs-pagination-prev': '_prevClick',
            'click .fs-pagination-next': '_nextClick',
            'click .fs-pagination-select': '_showDropDown',
            'mouseover .fs-pagination-select-option': '_onMouseover',
            'mouseout .fs-pagination-select-option': '_onMouseout',
            'click .fs-pagination-select-option': '_numClick'
        },
        setup:function(){
            var result=Pagination.superclass.setup.apply(this,arguments);
            this._setupPageNums();
            this._setHtml();
            this._setEvent();
            return result;
        },
        render:function(){
            var result=Pagination.superclass.render.apply(this,arguments);
            this._setHtml();
            return result;
        },

        //初始化page number
        _setupPageNums:function(){
            var totalSize = this.get('totalSize'),
                pageSize = this.get('pageSize'),
                activePn = this.get('activePageNumber');
            this._pageNums=Math.ceil(this.get('totalSize')/this.get('pageSize'));
            this.set("from",(activePn - 1) * pageSize + 1);
            if(pageSize*activePn > totalSize){
                this.set("to",totalSize);
            }else{
                this.set("to",this.get("from") + pageSize -1);
            }
            this._updateStyle(activePn);
        },

        //上一页
        _prevClick:function(){
            var activePn=this.get('activePageNumber');
            if(activePn>1){
                activePn--;
                this.jump(activePn);
            }
        },

        //下一页
        _nextClick:function(){
            var activePn=this.get('activePageNumber'),
                pageNums=this._pageNums;
            if(activePn<pageNums){
                activePn++;
                this.jump(activePn);
            }
        },

        //选择某一页
        _numClick:function(e){
            var curEl=$(e.currentTarget),
                pageNumber=parseInt(curEl.val());
            this.jump(pageNumber);
        },

        //显示选项
        _showDropDown:function(e){
            var divHeight = $(".fs-pagination-option-container",this.element).height();
            if(Math.abs($(window).scrollTop() + $(window).height() - $(e.target).offset().top) >= divHeight){
                $(".fs-pagination-option-container",this.element).css("margin-top","1px");
            }else{
                var marginTop = divHeight + 35;
                $(".fs-pagination-option-container",this.element).css("margin-top","-"+marginTop+"px");
            }
            if($(".fs-pagination-option-container",this.element).length > 0){
                //$(".fs-pagination-option-container",this.element).toggle();
                $(".fs-pagination-option-container",this.element).show();
            }
        },

        //选项页鼠标浮动事件
        _onMouseover:function(e){
            if(!$(e.target).hasClass("fs-pagination-option-active")){
                $(e.target).addClass("fs-pagination-option-active");
            }
        },

        //选项页鼠标移出事件
        _onMouseout:function(e){
            if($(e.target).hasClass("fs-pagination-option-active")){
                $(e.target).removeClass("fs-pagination-option-active");
            }
        },

        /**
         * 跳转页
         * @param pageNumber
         */
        jump:function(pageNumber,noFire){
            this.set('activePageNumber',pageNumber);
            this._updateStyle(pageNumber);
            //触发page事件
            if(!noFire){
                this.trigger('page',pageNumber);    
            }
        },

        //更新状态
        _updateStyle:function(pageNumber){
            var pageSize = this.get('pageSize');
            var totalSize = this.get("totalSize");
            var activePn = this.get("activePageNumber");
            this.set("from",(pageNumber - 1) * pageSize + 1);
            if(pageSize*activePn > totalSize){
                this.set("to", totalSize);
            }else{
                this.set("to",this.get("from") + pageSize-1);
            }
            if(totalSize < 1){
                this.element.hide();
            }else{
                this.element.show();
            }
            $(".fs-pagination-from",this.element).text(this.get("from"));
            $(".fs-pagination-to",this.element).text(this.get("to"));
            $(".fs-pagination-select-title",this.element).text("第"+pageNumber+"页");
            if(pageNumber == 1 && !$(".fs-pagination-prev",this.element).hasClass("fs-pagination-button-disable")){
                $(".fs-pagination-prev",this.element).addClass("fs-pagination-button-disable");
            }
            if(pageNumber != 1 && $(".fs-pagination-prev",this.element).hasClass("fs-pagination-button-disable")){
                $(".fs-pagination-prev",this.element).removeClass("fs-pagination-button-disable");
            }
            if(pageNumber == this._pageNums && !$(".fs-pagination-next",this.element).hasClass("fs-pagination-button-disable")){
                $(".fs-pagination-next",this.element).addClass("fs-pagination-button-disable");
            }
            if(pageNumber != this._pageNums && $(".fs-pagination-next",this.element).hasClass("fs-pagination-button-disable")){
                $(".fs-pagination-next",this.element).removeClass("fs-pagination-button-disable");
            }
            $(".fs-pagination-option-selected",this.element).removeClass("fs-pagination-option-selected");
            $("[value="+ pageNumber +"]",this.element).addClass("fs-pagination-option-selected");
        },

        //显示
        show:function(){
            this.element.show();
        },

        //隐藏
        hide:function(){
            this.element.hide();
        },

        /**
         * 构建html结构
         * @param activePn
         * @private
         */
        _setHtml:function(){
            var elEl=$(this.element),
                pageNums=this._pageNums,
                htmlStr='', 
                optionHtmlStr = '',
                from= this.get("from"),
                to= this.get("to"),
                activePn=this.get('activePageNumber'),
                totalSize = this.get('totalSize'),
                pageSize = this.get('pageSize');
            //if(totalSize<=pageSize){
                //return;
            //}
            htmlStr += "<span>第</span><span class = 'fs-pagination-from'>" + from + "</span><span>-</span><span class = 'fs-pagination-to'>" + to +"</span><span>项</span>";
            htmlStr += "，<span>共</span><span class = 'fs-pagination-total'>" + totalSize + "</span><span>项</span>&nbsp;&nbsp;";
            if(activePn == 1){
                htmlStr += "<span class = 'fs-pagination-prev fs-pagination-button-disable' title='上一页'><</span>";
            }else{
                htmlStr += "<span class = 'fs-pagination-prev' title='上一页'><</span>";
            }
            optionHtmlStr = this._setOptions(pageNums);
            //htmlStr += "<div class = 'fs-pagination-select'></div>";
            //util.mnSelect($('.fs-pagination-select',elEl),'syncModel',options);
            
            htmlStr += "&nbsp;&nbsp;<span class = 'fs-pagination-select'><span class = 'fs-pagination-select-title-container'><span class = 'fs-pagination-select-title'>第"+activePn+"页</span>&nbsp;&nbsp;<span class = 'fs-pagination-select-drop'>&nbsp;</span></span>";
            htmlStr += "<div class = 'fn-hide fs-pagination-option-container'><ul>"+optionHtmlStr+"</ul></div></span>&nbsp;&nbsp;";
            if(activePn == pageNums){
                htmlStr += "<span class = 'fs-pagination-next fs-pagination-button-disable' title='下一页'>></span>";
            }else{
                htmlStr += "<span class = 'fs-pagination-next' title='下一页'>></span>";
            }
            elEl.html(htmlStr);
        },

        //初始化事件
        _setEvent:function(){
            $(document).on("click",function(e){
                if ($(e.target).is('.fs-pagination-select-title-container') || $(e.target).is('.fs-pagination-select-title') || $(e.target).is('.fs-pagination-select-drop')){
                return;
            }
            $(".fs-pagination-option-container",this.element).hide();
            });
        },

        //设置选项
        _setOptions:function(pageNums){
            var optionHtmlStr = "",
            activePn=this.get('activePageNumber');
            for(var i=1; i <= pageNums; i++){
                //options.push({"text":"第"+i+"页","value":i});
                
                if(i == activePn){
                    optionHtmlStr += "<li class = 'fs-pagination-select-option fs-pagination-option-selected' value = " + i + ">第" + i + "页</li>";
                }else{
                    optionHtmlStr += "<li class = 'fs-pagination-select-option' value = " + i + ">第" + i + "页</li>";
                }
            }
            return optionHtmlStr;
        },

        /**
         * 设置分页总数
         * @param totalSize
         */
        setTotalSize:function(totalSize,pageNumber){
            var elEl=$(this.element);
            
            //set total size
            this.set('totalSize',totalSize);
            if(totalSize < 1){
                elEl.hide();
            }else{
                elEl.show();
            }
            this._setupPageNums();//reset pagenumber
            $(".fs-pagination-total",this.element).text(totalSize); // change total text in html
            //reset options
            var optionHtmlStr = this._setOptions(this._pageNums);
            $(".fs-pagination-option-container ul").html(optionHtmlStr);
            var activePageNumber=this.get('activePageNumber');
            //set default active page number
            if(pageNumber && activePageNumber != pageNumber){
                this.set('activePageNumber',pageNumber);
                //check active page number
                if(activePageNumber > this._pageNums){
                    this.set('activePageNumber',this._pageNums);
                }
                if(activePageNumber < 1){
                    this.set('activePageNumber',1);
                }
                activePageNumber=this.get('activePageNumber');
            
                this._updateStyle(activePageNumber);
            }
            //check active page number
            if(activePageNumber > this._pageNums){
                this.set('activePageNumber',this._pageNums);
                activePageNumber=this.get('activePageNumber');
                this._updateStyle(activePageNumber);
            }
            if(activePageNumber < 1){
                this.set('activePageNumber',1);
                activePageNumber=this.get('activePageNumber');
                this._updateStyle(activePageNumber);
            }
        },

        //重置
        "reset":function(){
            this.set('activePageNumber',1);
            this.set('totalSize',0);
            this._setupPageNums();
        },
        "getCurrentPageNum": function(){
            return this.get('activePageNumber') || 1;
        },
        
        "destroy":function(){
            var result;
            result=Pagination.superclass.destroy.apply(this,arguments);
            if(this.element){
                this.element.empty();
                //console.log("destroy");
                //this.off('click');
                //this.off('mouseover');
                //this.off('mouseout');
            }
            $(document).unbind();
            return result;
        }
    });
    module.exports=Pagination;
});