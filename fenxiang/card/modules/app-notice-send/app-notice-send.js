/*
*工作通知弹出框
*????????????????获取checkbox的check属性 ie 下是否能通过checked属性获取
*连接接口
*/
define(function(require, exports, module) {

    //工具
    var util=require('util');

    var Dialog = require("dialog");
    var publish=require('modules/publish/publish'),
        SelectBar=publish.selectBar,
        AtInput=publish.atInput,
        MediaMaker=publish.mediaMaker;

    //样式
    var sendStyle=require('modules/app-notice-send/app-notice-send.css');
    var sendString = require("modules/app-notice-send/app-notice-send.html");

    var contactData=util.getContactData(),
        currentUserData=contactData["u"]; //当前用户

    var Send=Dialog.extend({
        "attrs":{
            "content":sendString,
            "width":564
        },
        //setup
        setup:function(){
            var result=Send.superclass.setup.apply(this,arguments);
            return this;
        },
        //渲染
        "render": function () {
            var self=this;
            var result =Send.superclass.render.apply(this, arguments);

            var $element=self.element;
            var $select=$('.-sendcontent-range',$element);
            var $title=$('.-sendcontent-title-area',$element);
            var $content=$('.-sendcontent-txt-area',$element);
            var $media=$('.-sendcontent-media',$element);
            var $check=$('.-sendcontent-check',$element);

            /*选择范围框*/  
            var selectBar=new SelectBar({
                "element": $select,        
                "data": [
                    {
                        "title": "同事",
                        "type": "p",
                        "list": contactData["p"]
                    },
                    {
                        "title":"部门",
                        "type":"g",
                        "list": contactData["g"]
                    }
                ],
                "title": "选择同事或部门",
                "autoCompleteTitle": "请输入同事的名称或拼音",
                "defaultSelectedData":[{
                    "type":"p"
                }],
                "acInitData":util.getPublishRange()
            });

            /*通知标题*/
            var titleAtInput=new AtInput({
                "element":$title
            });
            /*通知内容*/
            var contentAtInput=new AtInput({
                "element":$content
            });
            
            var media=new MediaMaker({
                "element":$media,
                "action":["h5imgupload"],
                "actionOpts": {
                    "h5imgupload":{
                        "flashFallback":true  //对于不支持h5上传的要启用flash回退
                    }
                }
            });

            self.set('selectBar',selectBar);
            self.set('titleInput',titleAtInput);
            self.set('contentInput',contentAtInput);
            self.set('media',media);
            self.set('$title',$title);
            self.set('$content',$content);
            self.set('$check',$check);

            return result;
        },
        //显示
        "show": function () {
            var self=this;
            var result = Send.superclass.show.apply(this, arguments);
            return self;
        },
        //获取基本数据
        "_getData":function(){
            var self=this;

            var title=self.get('$title').val();
            var content=self.get('$content').val();
            var range=self.get('selectBar').getSelectedData();
            var check=self.get('$check').attr('checked');


            title=$.trim(title).replace(/\n/g,'');
            content=$.trim(content).replace(/\n/g,'');
            if(check){
                check=true;
            }else{
                check=false;
            }

            if(self._isNull(range)){
                util.alert('请选择发送范围');
                return false;
            }
            if(title==""){
                util.alert('请填写群通知标题');
                return false;
            }else if(title.length>20){
                util.alert('群通知标题最多可输入20个字符');
                return false;
            }
            if(content==""){
                util.alert('请填写群通知内容');
                return false;
            }else if(content.length>2000){
                util.alert('群通知内容最多可输入2000个字符');
                return false;
            }

            var circleIDs='';
            var employeeIDs='';
            if(range['g'] && range['g'].length>0){
                circleIDs=range['g'].join(',');
            }
            if(range['p'] && range['p'].length>0){
                employeeIDs=range['p'].join(',');
            }
            var requestData={
                'title':title,
                'feedContent':content,
                'circleIDs':circleIDs,
                'employeeIDs':employeeIDs,
                'isNeedConfirm':check
            };
           
            return requestData;
        },
        //获取已上传的文件数据
        "_getFiles":function(){
            var self=this;

            var media=self.get('media');
            var value=media.getUploadValue();

            var files=[];

             _.each(value,function(file){
                if(file.uploadType=="img"){
                    files.push({
                        "value": 2,          //FeedAttachType
                        "value1":file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name  //文件原名
                    });
                }
            });

            return files;
        },
        //清空
        "_clear":function(){
            var self=this;

            self.get('selectBar').removeAllItem();
            self.get('$title').val('');
            self.get('$content').val('');
            self.get('titleInput').element.trigger('autosize.resize');
            self.get('contentInput').element.trigger('autosize.resize');
            self.get('$check').attr('checked',false);
            self.get('media').resetAll();
            return self;
        },
        //发送数据
        "send":function(){
            var self=this;
            var requestData=self._getData();
            if(!requestData) return;
            var $submit=$('.-sendcontent-btn-sure',self.element);

            var media=self.get('media');

            //发送附件数据成功后发送基础数据
            media.send(function(callback){
                var files=self._getFiles();
                requestData.fileInfos=files;
                //发送基础数据
                util.api({
                    "type":'post',
                    "data":requestData,
                    "url":"/FeedWorkNotice/SendWorkNotice",
                    "success":function(responseData){
                        if(responseData.success){
                        	callback();
                            self.trigger('success');
                            self.hide();
                            util.remind(2, '发送成功');
                        }
                    },
                    "error":function(){
                        callback();
                    	util.alert('发送失败 请重试');
                    }
                },{
                    "submitSelector":$submit
                });

            },self.element);

        },
        //隐藏
        "hide": function () {
            var result =Send.superclass.hide.apply(this, arguments);
            this._clear();
            return this;
        },
        //事件注册
        "events":{
            "click .-sendcontent-btn-cancel":"hide",
            "click .-sendcontent-btn-sure":"send"
        },
        //判断对象是否为空
        '_isNull':function(obj){
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    return false;
                }
            }
            return true;
        },
        //销毁
        "destroy":function(){
            var result=Send.superclass.destroy.apply(this,arguments);
            return result;
        }
    });

    module.exports=Send;
});   
