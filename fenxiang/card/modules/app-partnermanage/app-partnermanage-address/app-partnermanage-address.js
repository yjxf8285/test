/**
 * 选择城市
 * 切换页面时
 * 调用下destory方法
 * 有益无害
 */
define(function (require, exports, module) {

    var util=require('util'),
        tplStr=require('./app-partnermanage-address.html'),
        style=require('./app-partnermanage-address.css');
        
    var RecordCalendar = Backbone.View.extend({
        template:_.template(tplStr),
        className:'m-partneraddress',
        options:{
            trigger:null,
            isRender:false
        },
        //初始化
        initialize:function(options){
            var self=this;
          
            //生产dom
            self.$el.html(self.template({}));
            self.linkDom();

            self.$trigger=$(self.options.trigger);

            /*
            *防止冒泡到body 触发隐藏事件
            */
            self.$el.on('click',function(e){
                e.stopPropagation();
            })
           
            //销毁时注意清空相关事件????????????????
            $('body').on('click',function(e){
                if(e.target==self.$trigger[0]){
                    self.show();
                }else{
                    self.hide();
                }
            });
            var timeout;
            $(window).on('resize',function(e){
                timeout && clearTimeout(timeout);
                timeout=setTimeout(function(){
                    self.resize();
                },80)
            })
           
        },

        /*
        *linkDom
        */
        linkDom:function(){
            var self=this;
            self.$trigger=$(self.options.trigger);
        },
        events:{
            'click span':'selectEve'
        },
        show:function(){
            var self=this;

            self.resize();
            self.$el.show();

            $('body').append(self.$el);
        },
        resize:function(){
            var self=this;
            self.$el.css({
                'left':self.$trigger.offset().left,
                'top':self.$trigger.offset().top+self.$trigger.height()+4
            })
        },
        hide:function(){
            this.$el.detach();
        },
        //选择地区事件
        selectEve:function(e){
            var self=this;
            var $se=$(e.currentTarget);

            var id=$se.attr('data-id'),
                text=$se.text();

            self.$trigger.val(text);
            self.$trigger.attr('data-id',id);
            self.hide();
        },
        /**
        *销毁
        */
        destory:function(){
            this.$el.remove();
        }

    });

    module.exports = RecordCalendar;
});
