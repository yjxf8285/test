/**
 * 搜索框组件
 *
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl;
    var util=require('util'),
        Events = require('events');

    var SearchBox=function(opts){
        opts= _.extend({
            "element":null,
            "placeholder":"",
            "autoRender":true   //自动渲染
        },opts||{});
        this.opts=opts;
        this.element=$(opts.element);
        this.init();
    };
    _.extend(SearchBox.prototype,{
        "init":function(){
            var opts=this.opts,
                elEl=this.element;
            if(opts.autoRender){
                this.render();
            }
            this.bindEvent();
        },
        "render":function(){
            var elEl=this.element,
                opts=this.opts,
                placeholder=opts.placeholder;
            elEl.addClass('ui-search-box');
            elEl.html('<span class="ui-search-box-inner"><input type="text" class="ui-search-field crm-textfield" placeholder="'+placeholder+'" /><button type="button" class="button-submit">搜索</button></span>');
            //placeholder兼容性处理
            util.placeholder($('.ui-search-field',elEl));
        },
        "bindEvent":function(){
            var that=this,
                elEl=this.element;
            elEl.on('click','.button-submit',function(){
                that.trigger('search',that.getValue());
            }).on('keydown','.ui-search-field',function(evt){
                if(evt.keyCode==13){
                    that.trigger('search',that.getValue());
                    evt.preventDefault();
                }
            });
        },
        "getValue":function(){
            return _.str.trim($('.ui-search-field',this.element).val());
        },
        "clear":function(){
        	$('.ui-search-field',this.element).val('');
        },
        "destroy":function(){
            var elEl=this.element;
            elEl.removeClass('ui-search-box');
            elEl.off();
            elEl.empty();
        }
    });
    //使SearchBox具备自定义事件的能力
    Events.mixTo(SearchBox);

    module.exports=SearchBox;
});