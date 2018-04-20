/*
* 待办提醒弹出框
*/
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    //工具
    var util=require('util');
    //样式
//    var remindStyle=require('modules/fs-createremind/fs-createremind.css');
    
    var Dialog = require("dialog");
    var publish=require('modules/publish/publish'),
        DateSelect=publish.dateSelect,
        TimeSelect=publish.timeSelect,
        moment=require("moment");
    
    var remindString = require("modules/fs-createremind/fs-createremind.html");

    //获取联系人信息
    var contactData=util.getContactData(),
        currentUserData=contactData["u"]; //当前用户

    var Remind=Dialog.extend({
        "attrs":{
            "content":remindString,
            "zIndex":1001,
            "width":526,
            "url":"/WorkToDoList/AddRemaind"         //api路径
        },

        //初始化
        setup:function(){
            var result=Remind.superclass.setup.apply(this,arguments);
            this.render();
            return this;
        },
        //渲染
        //调用父类的render后 content才会填充 content填充完毕后再进行各模块初始化
        "render": function () {
            var result =Remind.superclass.render.apply(this, arguments);
            var self=this;

            self._renderModule();

            return self;
        },
        //渲染各组件
        "_renderModule":function(){
            var self=this;

            self.element.find('.-createremind-field-range').hide();
            self.element.find('.-createremind-field-content').hide();
            self.element.find('.-createremind-title').text('设置提醒时间');

            var dialogEl=self.element,
                dateWEl=$('.-createremind-date-wrapper',dialogEl),   //日期element
                timeWEl=$('.-createremind-time-wrapper',dialogEl);   //TIME element 

            /*选择时间*/
            var dateSelect=new DateSelect({
                "element":dateWEl,
                "formatStr":"YYYY年MM月DD日（dddd）"
            });
            /*选择time*/
            var timeSelect=new TimeSelect({
                "element":timeWEl
            });
            //如果time栏为空，选择date栏时默认选中第一个time option
            dateSelect.on('change', function () {
                if (timeSelect.getValue() == "") {
                    timeSelect.selector.select(0);
                }
            });

            self.set('dateSelect',dateSelect);
            self.set('timeSelect',timeSelect);
        },
        //显示
        "show": function () {
            var self=this;
            var result = Remind.superclass.show.apply(this, arguments);

            self._setData.apply(self,arguments);

            return self;
        },
        //隐藏
        "hide": function () {
            var result =Remind.superclass.hide.apply(this, arguments);
            this._resetData();

            return this;
        },
        //获取整个信息
        "_getData":function(){
            var self=this;

            var dateSelect=self.get('dateSelect');
            var timeSelect=self.get('timeSelect');

            var responseData={};

            //获取当前hour和minute
            var now=moment();
              
            //提醒时间
            var date=dateSelect.getValue(),
                time=timeSelect.getValue();
            var remindTime=moment(date+' '+time,'YYYY-MM-DD HH:mm:ss').unix();
            if(!date || !time){
                util.alert('请选择日期或时间');
                return false;
            }
            if(remindTime<now.unix()){
                util.alert('该提醒时间已过，请选择今后的时间');
                return false;
            }

            responseData['remindTime']=remindTime.toString();

            //workToDoListID
            var workToDoListID=self.get('workToDoListID');
            responseData['workToDoListID']=workToDoListID;
            
            //console.log(responseData);
            return responseData;
        },
        /*
        *设置初始化信息
        */
        "_setData":function(opts){
            var self=this;

            var dateSelect=self.get('dateSelect');
            var timeSelect=self.get('timeSelect');

            var now=moment(),
                nowhour=now.hour(),
                nowminute=now.minute();
            /*
            *提醒时间设置为当前时间
            *以30分钟为一个节点 不满30分钟的进一位
            */
            var index=(nowhour-8)*2;
            if(nowminute<=30){index=index+1}
            else{index=index+2}

            timeSelect.setValue(index);

            /*
            *日期设置为当前日期时间
            *如果现在时间为23:30+ 则日期+1
            */
            if(nowhour>23 && nowminute>30){
                nowhour=24;
            }
            dateSelect.setValue(now.hour(nowhour));
            
            //设置worktodolistid
            self.set('workToDoListID',opts.workToDoListID);
        },
        /*
        *重置信息
        *窗口关闭的时候 重置信息 防止再次打开时显示以前的信息 
        */
        "_resetData":function(){
            var self=this;

            self.get('dateSelect').clear();
            self.get('timeSelect').clear();

            self.set('workToDoListID',null);

            return self;
        },
        /*
        *保存数据
        */
        "_save":function(){
            var self=this;
            var requestData=this._getData();
            //验证不通过 直接返回
            if(!requestData){return false}
            
            var $submit=$('.-createremind-btn-sure',this.element);
            //发送数据
            util.api({
                "type":'post',
                "data":requestData,
                "url":self.get('url'),
                "success":function(responseData){
                    if(responseData.success){
                        self.hide();
                        self.trigger('success');
                        util.remind(2, '添加提醒成功!');
                        tplEvent.trigger('addremindsuccess');
                    }
                }
            },{
                "submitSelector":$submit
            });
        },

        "events":{
           'click .-createremind-btn-sure':'_save',
           'click .-createremind-btn-cancel':'hide'
        },
        
        
        "destroy":function(){
            var result=Remind.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    
    module.exports=Remind;
});   
