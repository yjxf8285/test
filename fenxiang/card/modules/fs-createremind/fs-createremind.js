/*
* 提醒弹出框
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
        SelectBar=publish.selectBar,
        MediaMaker=publish.mediaMaker,
        DateSelect=publish.dateSelect,
        TimeSelect=publish.timeSelect,
        AtInput=publish.atInput,
        moment=require("moment");
    
    var remindString = require("modules/fs-createremind/fs-createremind.html");

    //获取联系人信息
    var contactData=util.getContactData(),
        currentUserData=contactData["u"]; //当前用户

    var Remind=Dialog.extend({
        "attrs":{
            isAddRigths:false,
            "content":remindString,
            "zIndex":1001,
            "width":526
        },

        //初始化
        setup:function(){
            var result=Remind.superclass.setup.apply(this,arguments);
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

            var dialogEl=self.element,
                rangeEl=$('.schedule-range',dialogEl),               //范围element
                dateWEl=$('.-createremind-date-wrapper',dialogEl),   //日期element
                timeWEl=$('.-createremind-time-wrapper',dialogEl),   //TIME element 
                textareaEl=$('.-createremind-textarea',dialogEl);    //内容 textarea

            var fxEl=$('.-createremind-fenx',dialogEl),
                fxPersonEl=$('.-createremind-fenx-person',dialogEl),
                fxTypeEl=$('.-createremind-fenx-type',dialogEl),
                fxContentEl=$('.-createremind-fenx-content',dialogEl);

            /*选择范围框*/  
            var selectBar=new SelectBar({
                "element": rangeEl,             
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData["p"]
                    }
                ],
                "title": "选择同事",
                "autoCompleteTitle": "请输入同事的名称或拼音",
                "defaultSelectedData":[{
                    "id":currentUserData.id,
                    "type":"p"
                }]
            });

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

            //填写内容组件自适应高度
            var titleAtInput=new AtInput({
                "element":textareaEl
            });

            self.set('selectBar',selectBar);
            self.set('dateSelect',dateSelect);
            self.set('timeSelect',timeSelect);
            self.set('contentArea',titleAtInput);
            self.set('$textarea',textareaEl);
            self.set('$fx',fxEl);
            self.set('$fxPerson',fxPersonEl);
            self.set('$fxType',fxTypeEl);
            self.set('$fxContent',fxContentEl);
            /*
            self.set('$submit',$('.-createremind-btn-sure',dialogEl));
            self.set('$cancel',$('.-createremind-btn-cancel',dialogEl));
            */
        },
        //显示
        "show": function () {
            var result = Remind.superclass.show.apply(this, arguments);
            this._setData.apply(this,arguments);
            return this;
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
            var selectBar=self.get('selectBar');
            var $textarea=self.get('$textarea');

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

            //提醒范围
            var range=selectBar.getSelectedData()['p'] 
            if(range==undefined){
                util.alert('请选择提醒范围');
                return false
            }
            responseData['employeeIDs']=range.join(',');

            //提醒内容 去除两边空格及换行符
            var message=$.trim($textarea.val());
            message=message.replace(/\n/g, '');
            if(message==""){
                util.alert('请输入提醒内容');
                return false
            }else if(message.length>200){
                util.alert('提醒内容不能超过200个字符');
                return false;
            }
            responseData['message']=message;

            //subType
            var subType=self.get('subType');
            responseData['subType']=subType;

            //dataId
            var dataId=self.get('dataID');
            responseData['dataID']=dataId;
            
            responseData['remindType']=1;
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
            var selectBar=self.get('selectBar');
            var $textarea=self.get('$textarea');
            var $fx=self.get('$fx'),
                $fxType=self.get('$fxType'),
                $fxPerson=self.get('$fxPerson'),
                $fxContent=self.get('$fxContent');



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
            
            //选择范围清空后 默认添加当前用户
            selectBar.removeAllItem();
            selectBar.addItem(currentUserData);
            
            /*
            *opts里如果有内容显示
            *否则设置为空
            */
            if(opts && opts.employeeName){
                var string;
                if(opts.content.length<=20){
                    string=opts.content;
                }else{
                    string=opts.content.slice(0,20)+'...';
                }
                $textarea.val(opts.content); 
                self._moveEnd($textarea[0]);
                //util.setCursorPositionEnd($textarea);   
                //填充数据后 自适应高度
                self.get('contentArea').element.trigger('autosize.resize');

                $fx.show();
                $fxPerson.text(opts.employeeName).attr('href','#profile/=/empid-'+opts.employeeID);
                $fxContent.text(string).attr('href','#stream/showfeed/=/id-'+opts.feedID);
                $fxType.text(opts.feedTypeName || '分享');

                self.set('dataID',opts.feedID);
                self.set('subType',opts.msgType);
            }else{
                $textarea.val('');
                //填充数据后自适应高度
                self.get('contentArea').element.trigger('autosize.resize');
                self.get('$fx').hide();
                self.set('dataID',0);
                self.set('subType',1);
                $fx.hide();
            }
        },
        "_moveEnd":function(obj){

            var len = obj.value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character',len);
                sel.moveEnd("character",0);
                sel.collapse();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }

        },
        /*
        *重置信息
        *窗口关闭的时候 重置信息 防止再次打开时显示以前的信息 
        */
        "_resetData":function(){
            var self=this;

            self.get('dateSelect').clear();
            self.get('timeSelect').clear();
            self.get('selectBar').removeAllItem();
            self.get('$textarea').val('');
            self.get('$fx').hide();
            self.set('dataID',0);
            self.set('subType',1);
            self.attrs.isAddRigths = false;
            
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
            requestData.isAddRigths=this.attrs.isAddRigths; // bool?，是否忽略权限（不考虑提醒人员对Feed的权限）
            //发送数据
            util.api({
                "type":'post',
                "data":requestData,
                "url":"/TimingMessage/AddTimingMessageRemaind",
                "success":function(responseData){
                    if(responseData.success){
                        self.hide();
                        //更新提醒数目
                        $('.feed-remind-wrapper').find('.remind-count-num').html(responseData.value.timingMessageRemaindOfToday||0);
                        self.trigger('success');
                        util.remind(2, '添加定时提醒成功!');
                        tplEvent.trigger('addremindsuccess');
                    }else{
                        if(responseData.ErrorCode==201){
                            util.confirm(responseData.message,'',function(){
                                self.attrs.isAddRigths=true;
                                self._save();
                            });
                        }else{
                            util.alert(responseData.message);
                        }

                    }
                }
            },{
                "errorAlertModel": "1" //1和2两种错误提醒模式，值越大提醒的信息越多，默认是2表示所有错误都提醒，1只会提醒服务端响应失败
            },{
                "submitSelector":$submit
            });
        },

        "events":{
           'click .-createremind-btn-sure':'_save',
           'click .-createremind-btn-cancel':'hide',
           'click .-createremind-fenx-person':'hide',
           'click .-createremind-fenx-content':'hide'
        },
        
        
        "destroy":function(){
            var result=Remind.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    
    module.exports=Remind;
});   
