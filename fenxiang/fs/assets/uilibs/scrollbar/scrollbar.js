/**
 * 自定义滚动条
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS;
    var TinyScrollBar=require('tinyscrollbar'),
        moduleStyle=require('./scrollbar.css');
    var ScrollBar=function(opts){
        opts= _.extend({
            "element":null
        },opts||{});
        this.element=$(opts.element);
        this.opts=opts;
        this._originOffset='overflow';
        this._wrapperEl=null;
        this.init();
    };
    _.extend(ScrollBar.prototype,{
        "init":function(){
            var elEl=this.element;
            var wEl=$('<div class="fs-scrollbar"></div>'),
                innerEl=$('<div class="fs-scrollbar-inner viewport"></div>');
            wEl.html('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
            wEl.insertAfter(elEl);
            innerEl.css({
                "overflow":"hidden",
                "height":elEl.height()
            }).appendTo(wEl);
            //设置element直接后代class
            elEl.addClass('fs-scrollbar-box overview');
            this._originOffset=elEl.css('overflow');

            elEl.css('overflow','visible').css({
                "height":"auto"
            }).appendTo(innerEl);
            wEl.tinyscrollbar();
            elEl.data('ins',this);
            this._wrapperEl=wEl;
        },
        "update":function(sScroll){
            this._wrapperEl.tinyscrollbar_update(sScroll);
        },
        "hide":function(){
            this._wrapperEl.hide();
        },
        "show":function(){
            this._wrapperEl.show();
        },
        "destroy":function(){
            var wEl=this._wrapperEl;
            $('.fs-scrollbar-box',wEl).removeData().insertAfter(wEl).removeClass('fs-scrollbar-box').css('overflow',this._originOffset);
            wEl.remove();
            this._wrapperEl=null;
        }
    });
    module.exports=ScrollBar;
});
