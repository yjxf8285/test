/**
 * 公告相关功能实现
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        Dialog=require('dialog'),
        moduleTpl=require('./fs-announcement.html'),
        moduleStyle=require('./fs-announcement.css'),
        publish=require('modules/publish/publish');
    var moduleTplEl=$(moduleTpl),
        contactData=util.getContactData();

    var SelectBar=publish.selectBar,
        AtInput=publish.atInput,
        MediaMaker=publish.mediaMaker,
        DateSelect=publish.dateSelect,
        Receipt=publish.Receipt;

    //公告展示
    var NoticeBanner=function(opts){
        opts= _.extend({
            "element":null,
            "cls":"",
            "data":[]
        },opts||{});
        this.opts=opts;
        this.element=$(opts.element);
        this.tid=null;
        this.init();
    };
    _.extend(NoticeBanner.prototype,{
        "init":function(){
            this._renderEl();
            this._bindEvents();
            this._setCycle();
        },
        "_renderEl":function(newData){
            var elEl=this.element,
                opts=this.opts,
                data=newData||opts.data;
            var htmlStr1='<ul class="fs-announcement-banner-list">',  //公告内容
                htmlStr2='<ul class="nav-list fn-clear">'; //导航条
            //构建element结构
            elEl.html('<div class="fs-announcement-banner '+opts.cls+'"><div class="fs-announcement-banner-content"></div><div class="fs-announcement-banner-nav"></div><span class="close-h">×</span></div>');
            //构建list列表
            _.each(data,function(item,i){
                var extCls="";
                if(i==0){
                    extCls="state-active";
                }
                htmlStr1+='<li class="fs-announcement-banner-item '+extCls+'">'+item+'</li>';
                htmlStr2+='<li class="nav-item '+extCls+'" navindex="'+i+'">'+(i+1)+'</li>';
            });
            htmlStr1+='</ul>';
			htmlStr2+='</ul>';
            $('.fs-announcement-banner-content',elEl).html(htmlStr1);
            $('.fs-announcement-banner-nav',elEl).html(htmlStr2);
        },
        "_bindEvents":function(){
            var that=this;
            var elEl=this.element;
            //点击关闭按钮隐藏自身
            elEl.on('click','.close-h',function(){
                elEl.hide();
            });
			elEl.on('click','.nav-item',function(){
                var animatedItemEl=$('.fs-announcement-banner-item',elEl).filter(':animated');
				var meEl=$(this),
					navIndex=meEl.attr('navindex');
				if(animatedItemEl.length>0){  //动画进行过程中，点击无效
                    animatedItemEl.stop(true,true);
                }
                //clear掉interval
                clearInterval(that.tid);
                that._switchTo(navIndex,FS.EMPTY_FN,false);
                //重新开启循环
                that._setCycle();
			});
			

        },
        "_setCycle":function(){
            var that=this;
            var elEl=this.element,
                navItemsEl=$('.nav-item',elEl),
                currentNavItemEl,
                toActiveIndex=0;
            this.tid=setInterval(function(){
                currentNavItemEl=navItemsEl.filter('.state-active');
                toActiveIndex=navItemsEl.index(currentNavItemEl)+1;
                if(toActiveIndex==navItemsEl.length){
                    toActiveIndex=0;
                }
                that._switchTo(toActiveIndex,FS.EMPTY_FN,true);
            },5000);
        },
        "_switchTo":function(index,cb,withAnimate){
            var that=this;
            var elEl=this.element,
                contentItemsEl=$('.fs-announcement-banner-item',elEl),
                navItemsEl=$('.nav-item',elEl),
                preActiveContentEl=contentItemsEl.filter('.state-active'),
                preActiveNavEl=navItemsEl.filter('.state-active'),
                preActiveIndex=navItemsEl.index(preActiveNavEl);
			var duration=0;
            if(withAnimate){
                duration=400;
            }
            if(preActiveIndex!=index){
                preActiveContentEl.stop(true,true).fadeOut(duration,function(){
                    //显示当前激活公告内容和对应导航
                    contentItemsEl.eq(index).addClass('state-active').show();
                    navItemsEl.eq(index).addClass('state-active');
                    //去掉上一公告内容和对应导航state-active class
                    preActiveContentEl.removeClass('state-active');
                    preActiveNavEl.removeClass('state-active');
                    cb&&cb.call(that,index,preActiveIndex);
                });
            }

        },
        /**
         * 添加一个新项
         * @param htmlStr
         * @param posIndex 插入位置
         */
        "addItem":function(htmlStr,posIndex){
            var opts=this.opts,
                data=opts.data;
            if(_.isUndefined(posIndex)){
                posIndex=data.length-1;
            }
            if(posIndex>data.length-1){
                posIndex=data.length-1;
            }
            data=data.slice(0);
            data.splice(posIndex,0,htmlStr);
            opts.data=data; //重新指回原来存储
            clearInterval(this.tid);
            //重新渲染dom
            this._renderEl(data);
            //重新开启循环
            this._setCycle();
        },
        /**
         * 更新数据并渲染
         * @param data
         */
        "updateData":function(data){
            var opts=this.opts;
            opts.data=data; //重新指回原来存储
            clearInterval(this.tid);
            //重新渲染dom
            this._renderEl(data);
            //重新开启循环
            this._setCycle();
        },
        "destroy":function(){
            clearInterval(this.tid);
            this.tid=null;
            this.element.off();
            this.element.empty();
            this.element=null;
        }
    });

    //创建公告
    var NewNoticeDialog=Dialog.extend({
        "attrs":{
            width: '580px',
			//height:"",
            className:'fs-announcement-new-dialog',
            content:moduleTplEl.filter('.fs-announcement-new-dialog-tpl').html(),
            successCb:FS.EMPTY_FN
        },
        "events":{
            "click .f-announcement-sub":"_submit",
            "click .f-announcement-cancel":"_cancel",
			"change .announcement-sel-day":"_selectDate",
			"click .is-announcement":"_clickIsReceipt"
        },
        /**
         * 渲染内容组件
         */
        "_renderCpt":function(){
            var that=this;
            var elEl=this.element,
                sbEl=$('.range-selectbar',elEl),
                atInputEl=$('.announcement-content',elEl),
                mediaEl=$('.media',elEl),
                dsEl=$('.announcement-free-time',elEl),
                isReceiptEl=$('.is-announcement',elEl);
            //可视范围
            var sb = new SelectBar({
                "element": sbEl,
                "data": [{
                    "title": "部门",
                    "type": "g",
                    "unitSuffix":"个部门",
                    "list": contactData["g"]
                },{
                    "title": "同事",
                    "type": "p",
                    "unitSuffix":"位同事",
                    "list": contactData["p"]
                }],
                "title": "选择公示范围",
                "defaultSelectedData":[{
                    "id":"999999",
                    "name":"全公司",
                    "type":"g"
                }],
                "acInitData":util.getPublishRange(),
                "autoCompleteTitle": "请输入部门或同事的名称或拼音"
            });
            //公告内容
            var atInput=new AtInput({
                "element":atInputEl
            });
            //多媒体功能
            var media= new MediaMaker({
                "element": mediaEl,
                "action": ["h5imgupload","h5attachupload","at"],
                "actionOpts": {
                    "at": {
                        "inputSelector": atInputEl
                    }
                }
            });
            //自定义时间控件
            var ds= new DateSelect({
                "element": dsEl,
                "placeholder": "选择日期"
            });
            //回执窗口
            var receipt=new Receipt({
                "inputSelector":atInputEl,
                "rangeSb":sb,
                "submitCb":function(sbData){
                    that.setReceiptRange(sbData);
                    this.hide();
                },
                "cancelCb":function(){
                    isReceiptEl.prop('checked',false);
                    //清空回执信息
                    that.clearReceipt();
                }
            });
            this.sb=sb;
            this.atInput=atInput;
            this.media=media;
            this.ds=ds;
            this.receipt=receipt;
        },
        /**
         * 设置回执范围
         */
        "setReceiptRange":function(rangeData){
            var gData,    //部门数据
                pData;   //个人数据
            var elEl=this.element,
                receiptTipEl=$('.receipt-tip',elEl),
                smsRangeGroupEl=$('.send-sms-g',elEl),
                smsRangePersonEl=$('.send-sms-p',elEl),
                isSendSmsEl=$('.is-send-sms',elEl);
            var receipt=this.receipt;
            if(_.isEmpty(rangeData)){
                receiptTipEl.text("").hide();
            }else{
                gData = rangeData['g']||[];
                pData = rangeData['p']||[];
                //设置隐藏传递值
                smsRangeGroupEl.val(gData.join(','));
                smsRangePersonEl.val(pData.join(','));
                isSendSmsEl.val($('.is-sms-send',receipt.element).prop('checked')?"1":"0");
                receiptTipEl.text('已选择'+gData.length+'个部门，'+pData.length+'个人').show();
            }
        },
        /**
         * 清理回执信息
         */
        "clearReceipt":function(){
            var elEl=this.element,
                receiptTipEl=$('.receipt-tip',elEl),
                smsRangeGroupEl=$('.send-sms-g',elEl),
                smsRangePersonEl=$('.send-sms-p',elEl),
                isSendSmsEl=$('.is-send-sms',elEl),
                isAnnouncementEl=$('.is-announcement',elEl);
            smsRangeGroupEl.val('');
            smsRangePersonEl.val('');
            isSendSmsEl.val("0");
            receiptTipEl.empty().hide();
            isAnnouncementEl.prop('checked',false);
        },
        /**
         * 点击是否回执checkbox
         */
        "_clickIsReceipt":function(evt){
            var receipt=this.receipt;
            var isReceiptEl=$(evt.target);
            if(isReceiptEl.prop('checked')){
                receipt.show();
            }else{
                receipt.hide();
                this.clearReceipt();
            }

        },
        "render":function(){
            var result=NewNoticeDialog.superclass.render.apply(this,arguments);
            this._renderCpt();
            return result;
        },
        "show":function(){
            var result=NewNoticeDialog.superclass.show.apply(this,arguments);
            return result;
        },
        "hide":function(){
            var result=NewNoticeDialog.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
				inputEl=$('.announcement-title',elEl),
                contentEl=$('.announcement-content',elEl),
                isReceiptEl=$('.is-announcement',elEl),
                isSendSmsEl=$('.is-send-sms',elEl),
                smsRangeGroupEl = $('.send-sms-g', elEl),    //发送部门范围
                smsRangePersonEl = $('.send-sms-p', elEl),   //发送个人范围;
                selectEl=$('.announcement-sel-day',elEl); //公示期类型
            var media=this.media,
                sb=this.sb,
                ds=this.ds;
            var requestData={},
                files,
                sbData=sb.getSelectedData(),
                smsRangeGData = smsRangeGroupEl.val(),
                smsRangePData = smsRangePersonEl.val(),
                time=ds.getValue(true);
            //feed model type
            //requestData["feedModelType"] = "1"; //1-工作管理，2-客群管理
            //title信息
            requestData["title"] = _.str.trim(inputEl.val());
            //content
            requestData["feedContent"] = _.str.trim(contentEl.val());
            //是否回执
            requestData["isSendReceipt"]=isReceiptEl.prop('checked');
            //是否发送短信
            requestData["isSendSms"]=isSendSmsEl.prop('checked');
            //短信发送范围
            requestData["smsCircleIDs"] = smsRangeGData ? smsRangeGData.split(',') : [];  //组织
            requestData["smsEmployeeIDs"] = smsRangePData ? smsRangePData.split(',') : [];    //个人
            //公示期类型
            requestData["showtimeDataType"]=selectEl.val();
            //自定义时间
            requestData["time"]=time?time.unix():0;
            //上传文件信息
            requestData["fileInfos"] = [];
            files = media.getUploadValue();
            _.each(files, function (file) {
                if (file.uploadType == "img") {
                    requestData["fileInfos"].push({
                        "value": 2, //FeedAttachType
                        "value1":file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name  //文件原名
                    });
                } else if (file.uploadType == "attach") {
                    requestData["fileInfos"].push({
                        "value": 3, //FeedAttachType
                        "value1":file.pathName,
                        "value2": file.size, //文件总长度（字节）
                        "value3": file.name  //文件原名
                    });
                }
            });
            //可视范围信息
            requestData["circleIDs"] = sbData['g'] || [];  //组织
            requestData["employeeIDs"] = sbData['p'] || [];    //个人

            return requestData;
        },
        "isValid":function(){
            var elEl=this.element,
				inputEl=$('.announcement-title',elEl),
                contentWEl=$('.content-input-wrapper',elEl);
            var sb=this.sb;
            var requestData=this.getRequestData(),
				title=requestData["title"];
			if(title.length==0){
				util.showInputError(inputEl);
				return false;	
			}
            if(requestData["feedContent"].length==0){
                util.showInputError(contentWEl);
                return false;
            }
            if (requestData["circleIDs"].length == 0&&requestData["employeeIDs"].length == 0) {
                $('.input-tip', sb.element).click();
                return false;
            }
            return true;
        },
        "_clear":function(){
            var elEl=this.element,
				inputEl=$('.announcement-title',elEl),
                contentEl=$('.announcement-content',elEl),
                selectEl=$('.announcement-sel-day',elEl);
			inputEl.val("");
            contentEl.val("").trigger('autosize.resize');
            this.sb.removeAllItem();
            this.sb.addItem({
                "id":"999999",
                "name":"全公司",
                "type":"g"
            });
            this.ds.clear();
            this.media.resetAll();
            selectEl.val("2").change();
            //清理回执
            this.clearReceipt();
        },
		"_selectDate":function(evt){
			var elEl=this.element,
				selectEl=$(evt.target),
				announcementFreeTime=$('.announcement-free-time',elEl);
			if(selectEl.val() == "12"){
				announcementFreeTime.show();
			}else{
				announcementFreeTime.hide();
			};		
		},
        "_submit":function(evt){
            var that=this;
            var elEl=this.element,
                subEl=$(evt.currentTarget);
            var media= this.media;
            var requestData;
            if (this.isValid()) {
                media.send(function(sendCb) {
                    requestData = that.getRequestData();
                    util.api({
                        "data":requestData,
                        "url":"/FeedAnnounce/SendFeedAnnounce",
                        "success":function(responseData){
                            if(responseData.success){
                                that._clear();
                                that.get('successCb').apply(that,[responseData,requestData]);
                            }
                            sendCb(); //media send callback回调
                        }
                    }, {
                        "submitSelector":subEl
                    });
                }, elEl);
            }
            evt.preventDefault();
            evt.stopPropagation();
        },
        "_cancel":function(){
            this.hide();
        },
        "destroy":function(){
            var result;
            this.sb&&this.sb.destroy();
            this.atInput&&this.atInput.destroy();
            this.media&&this.media.destroy();
            this.ds&&this.ds.destroy();
            this.receipt&&this.receipt.destroy();
            result=NewNoticeDialog.superclass.destroy.apply(this,arguments);
            return result;
        }
    });
    _.extend(exports,{
        "NewNoticeDialog":NewNoticeDialog,
        "NoticeBanner":NoticeBanner
    });
});