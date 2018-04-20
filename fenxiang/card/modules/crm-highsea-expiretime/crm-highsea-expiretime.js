
 /**
 * 使用方法
 *
 * 1.请确保只new一次，不要出现重复初始化
 * 2.无须传参数
    
3.使用的时候调用show（attachId,oldName）

 */
define(function(require,exports,module){
	var Dialog = require("dialog"),
	util=require('util');
    var tpl = require('modules/crm-highsea-expiretime/crm-highsea-expiretime.html');
////    var tplStyle = require('modules/crm-highsea-expiretime/crm-highsea-expiretime.css');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var moment=require('moment');
    
	var Expiretime= Dialog.extend({
		"attrs":{
			"content": tpl,
			"width":455,
            "attachId":0,
            "closeTpl":"<div class = 'crm-ui-dialog-close'>×</div>",
            "attachName":""
		},

		setup:function(){
            var result=Expiretime.superclass.setup.apply(this,arguments);
            return result;
        },

		"render": function () {
            var result =Expiretime.superclass.render.apply(this, arguments);
            var $el=this.element;
            this.time=new DateSelect({
                "element": $('.crm-highsea-expiretime-settime',$el),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日（dddd）",
                "isCRM":true
            });
            return result;
        },
        //隐藏
        "hide": function () {
            var result =Expiretime.superclass.hide.apply(this, arguments);
            this.reset();
            return result;
        },

        //显示
        "show": function (time,days) {
            var result = Expiretime.superclass.show.apply(this, arguments);
            var $el=this.element;
            var self=this;
            self.set('originTime',time);
            self.set('days',days);
            self.setComent();
            return result;
        },
        //设置组件
        setComent:function(){
            var self=this;
            var time=self.get('originTime');
            var days=self.get('days');
            var str="(余"+days+"天)";

            var $timeb=$('.crm-highsea-expiretime-content b',this.element);
            $timeb.text(str);
            self.time.on('change',function(val){
                var nowTime=self.time.getTime()*1000;
                var originTime=self.get('originTime');
                
                var changeDays=self._getDay(originTime,nowTime);
                changeDays=Math.floor(changeDays)+days;
                $timeb.text("(余"+changeDays+"天)");
            })
            self.time.setValue(time);
        },
        //取两个time之间的相差天数
        _getDay:function(timea,timeb){
            timea= new Date(timea); 
            timea.setHours(0);timea.setMinutes(0);timea.setSeconds(0);
            timeb= new Date(timeb); 
            timeb.setHours(0);timeb.setMinutes(0);timeb.setSeconds(0);
            return Math.floor((timeb.getTime()-timea.getTime())/(1000*3600*24));
        },
        "events":{
            "click .crm-highsea-expiretime-button-ok":"_submit",
            "click .crm-highsea-expiretime-button-cancel":"_cancel"
        },
        "reset":function(){
           
        },

        "_cancel":function(){
            this.hide();
        },

        "_submit":function(){
            var time=this.time.getTime();
            this.trigger('submit',time);
            this.hide();
        },

        "destroy":function(){
        	this.time && (this.time.destroy());
            var result=Expiretime.superclass.destroy.apply(this,arguments);
            return result;
        }
	});
	module.exports = Expiretime;
});