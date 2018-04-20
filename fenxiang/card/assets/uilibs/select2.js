/**
 * 扩展Select2
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    //this.element Jquery object
    //this.options 选项
    //this.selected 当前被选中项
    //this.lastSelected 上一次被选中项
    /*
    [{
        "value":0,
        "text":"全部"
            }];
    */
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var util=require('util'),
        Events = require('events'),
        $ = require('$');

    var Select=function(opts){
        opts= _.extend({
            "element":null,
            "options":[],//option structure
            "defaultOption":null,
            "autoRender":true   //自动渲染
        },opts||{});
        this.opts=opts;
        this.element=$(opts.element);
        this.options = opts.options;
        this.init();
        //if(opts.beforeInit.call(this)!==false){
            //this.init();
        //}
    };
    _.extend(Select.prototype,{
        /**
         * 组件初始化
         */
        "init":function(){
            var opts=this.opts;
            if(opts.defaultOption){
                this.selected = opts.defaultOption
            }else if(this.options){
                this.selected = this.options[0];
            }
            if(opts.autoRender){
                this.render();
            }
        },
        /**
         * 控件内事件绑定
         */
        "_bindEvents":function(){
            var self = this;
            this.element.on('click','.fs-select',function(){
                if($(".fs-select-option-container",this.element).length > 0){
                    $(".fs-select-option-container",this.element).toggle();
                }
            });

            this.element.on('click','ul li', function(){
                var selected = {
                    "value":$(this).val(),
                    "text":$(this).text()
                }
                self.change(selected);
            });

            this.element.on("mouseover","ul li", function(){
                if(!$(this).hasClass("fs-select-active")){
                    $(this).addClass("fs-select-active");
                }
            });

            this.element.on("mouseout","ul li", function(){
                if($(this).hasClass("fs-select-active")){
                    $(this).removeClass("fs-select-active");
                }
            });

            $(document).on("click",function(e){

                if ($(e.target).is('.fs-select') || $(e.target).is('.fs-select-text') || $(e.target).is('.fs-select-drop')){
                    return;
                }
                $(".fs-select-option-container",this.element).hide();
            });
        },
        /**
         * 单选
         */
        "change":function(item){
            this.lastSelected = this.selected;
            this.selected = item;
            this._changeSelectedStyle(this.lastSelected,this.selected);
            $(".fs-select-option-container",this.element).hide();
            //$(".fs-select-text",this.element).text(item.text);
            this.trigger('selected',item);
        },
        /**
         * 单选样式变化
         */
        "_changeSelectedStyle":function(lastSelected,selected){
            if($("[value="+ lastSelected.value +"]",this.element).hasClass("fs-select-selected")){
                $("[value="+ lastSelected.value +"]",this.element).removeClass("fs-select-selected");
            }
            if(!$("[value="+ selected.value +"]",this.element).hasClass("fs-select-selected")){
                $("[value="+ selected.value +"]",this.element).addClass("fs-select-selected");
            }
        },
        /**
         * 渲染
         */
        "render":function(){
            var element=this.element;
            var optionsHtml = "";
            var self = this;
            _.each(this.options,function(item){
                if(self.selected.value == item.value){
                    optionsHtml += "<li class = 'fs-select-option fs-select-selected' value = " + item.value + ">" + item.text + "</li>";
                }else{
                    optionsHtml += "<li class = 'fs-select-option' value = " + item.value + ">" + item.text + "</li>";
                }
                
            });
            element.html("<div class = 'fs-select-container'><div class = 'fn-right fn-clear fs-select'><div class = 'fn-left fs-select-text'>更多操作</div><div class = 'fn-right fn-clear fs-select-drop'>&nbsp;</div></div></div><div class = 'fn-hide fs-select-option-container'><ul>" + optionsHtml + "</ui></div>");
            this._bindEvents();
        },
        /**
         * 销毁
         */
        "destroy":function(){
            this.element.off();
            this.element.empty();
            this.options = [];
            this.selected = null;
            this.lastSelected = null;
        }
    });
    //使Select具备自定义事件的能力
    Events.mixTo(Select);
    module.exports=Select;
});