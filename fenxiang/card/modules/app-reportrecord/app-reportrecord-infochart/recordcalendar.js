/**
 * 报表记录
 * 简易日历插件
 * 切换页面时
 * 调用destory方法 否则dom会留在<body></body>标签内
 */
define(function (require, exports, module) {

    var util=require('util'),
        templateStr=require('./recordcalendar.html'),
        tableStr=require('./recordcalendar-table.html'),
        style=require('./recordcalendar.css');
        
    var RecordCalendar = Backbone.View.extend({
        template:_.template(templateStr),
        className:'m-recordcalendar',
        attr:{
            trigger:null,
            time:null,
            monthDate:[['一月','01'],['二月','02'],['三月','03'],['四月','04'],['五月','05'],['六月','06'],['七月','07'],['八月','08'],['九月','09'],['十月','10'],['十一月','11'],['十二月','12']]
        },
        //初始化
        initialize:function(options){
            var self=this;

            var now=new Date();
            self.attr.time=now.getFullYear()+'-'+(now.getMonth()+1);

            _.extend(self.attr,options);

            //生产dom
            self.$el.html(self.template({}));
            self.tableTemp=_.template(tableStr);
            self.$('.m-recordcalendar-table-current').html(self.tableTemp({'date':self.attr.monthDate}));
            self.linkDom();

            self.$trigger=$(self.attr.trigger);
            self.set(self.attr.time,true);

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
           
        },

        /*
        *linkDom
        */
        linkDom:function(){
            var self=this;
            self.$tableTime=self.$('.m-recordcalendar-date');
        },
        /*
        *设置时间
        *默认触发change事件
        */
        set:function(time,notrigger){
            var self=this;

            var now=new Date();
            now.setFullYear(time.split('-')[0]);
            now.setMonth(parseInt(time.split('-')[1])-1);
            self.attr.time=now;

            self.$tableTime.text(time.split('-')[0]);
            self.$trigger.val(time);
            if(notrigger){
                return;
            }else{
                self.trigger('change',self.attr.time);
            }
        },
        //取得时间
        get:function(){
            return self.attr.time;
        },
        events:{
            'click .m-recordcalendar-vecl':'_left',
            'click .m-recordcalendar-vecr':'_right',
            'click td':'_tdFocus'
        },
        /*
        *表格td点击事件
        */
        _tdFocus:function(e){
            var $se=$(e.target);
            this.set(this.$tableTime.text()+'-'+$se.attr('data-value'));

            this.hide();
        },
        show:function(){
            var self=this;
            self.$el.css({
                'left':self.$trigger.offset().left,
                'top':self.$trigger.offset().top+self.$trigger.height()+4
            }).show();
            $('body').append(self.$el);
        },
        hide:function(){
            this.$el.detach();
        },
        /*
        *向左切换
        */
        _left:function(){
            var self=this;

            var data={
                'date':self.attr.monthDate
            }
            var year=parseInt(self.$tableTime.text());
            self.$tableTime.text(year-1);

            self.$('.m-recordcalendar-table-current').stop(true,true).animate({'left':'-100%'},function(){
                $(this).attr('css','m-recordcalendar-table-next').removeAttr('style');
            });
            self.$('.m-recordcalendar-table-next').html(self.tableTemp(data)).show().stop(true,true).animate({'left':0},function(){
                $(this).attr('css','m-recordcalendar-table-current').removeAttr('style');
            });
        },
        /*
        *向右切换
        */
        _right:function(){
            var self=this;

            var data={
                'date':self.attr.monthDate
            }
            var year=parseInt(self.$tableTime.text());
            self.$tableTime.text(year+1);

            self.$('.m-recordcalendar-table-current').stop(true,true).animate({'left':'100%'},function(){
                $(this).attr('css','m-recordcalendar-table-next').removeAttr('style');
            });
            self.$('.m-recordcalendar-table-next').html(self.tableTemp(data)).css({'left':'-100%'}).show().stop(true,true).animate({'left':0},function(){
                $(this).attr('css','m-recordcalendar-table-current').removeAttr('style');
            });
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
