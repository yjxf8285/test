/**
 * App入口逻辑
 * 
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        store=tpl.store,
        list=tpl.list;
    var $=require('$'),
        Autocomplete=require('autocomplete'),
        position=require('position'),
        Events=require('events'),
        fsHelper=require('assets/html/helper.html'),
        util = require('util'),
        AudioPlayer = require('uilibs/audio-player'), //音频播放组件
        fsQx=require('modules/fs-qx/fs-qx'), //企信
        fsQxCore =require('modules/fs-qx/fs-qx-core'), //企信
        QXModel = fsQxCore.QXModel,
        Dialog=require('dialog'),
        clientStore=require('store'),
        H5uploader=require('h5uploader');
    var isIE6 = ($.browser || 0).msie && $.browser.version == 6;
    var newRemindStore={};  //黄条新提醒存储

    /**
     * 获取右上角全局提醒信息
     * @param successCb
     * @param completeCb
     */
    var getGlobalRemindInfo=function(successCb,completeCb){
        util.api({
            "url":"/GlobalInfo/GetRemindGlobalInfo",
            "type":"get",
            "data":{
                "feedID":util.getTplStore("stream","maxFeedId")||0
            },
            "success":function(responseData){
                var dataRoot=responseData.value;
                var loginUserData=util.getContactData()["u"];
                if(responseData.success){
                    if(dataRoot.currentEmployeeID!=loginUserData.id){  //同一浏览器多个不同帐号登录，前一个帐号退出到登录页
                        location.href = FS.BASE_PATH+"/login.aspx?auto=1";  //加上auto强制退出
                        return;
                    }
                }
                try{
                    successCb.call(this,responseData);
                }catch(e){}
            },
            "complete":function(){
                completeCb.call(this);
            }
        },{
            "abortLast":true,   //自动终止上一次请求
            "errorAlertModel":1 //不提示业务逻辑错误
        });
    };
    /**
     * 操作黄条铃声
     * @param newReminds
     */
    var operNewRemindSound=function(newReminds){
        var needPlay=false,
            newMessageAlertPlayer=FS.remindSoundPlayer,
            audioBoxEl;
        var enterpriseConfig=util.getEnterpriseConfig(107,true);
        _.each(newReminds,function(newRemind){
            var keyName=newRemind["keyName"],
                counts=newRemind["counts"];
            if(!newRemindStore[keyName]){
                needPlay=true;
                newRemindStore[keyName]=counts;
            }else if(newRemindStore[keyName]!=counts){
                needPlay=true;
                newRemindStore[keyName]=counts;
            }
        });
        if(needPlay&&enterpriseConfig&&enterpriseConfig['PlayNotificationSound']){
            newMessageAlertPlayer.play();
        }
    };
    /**
     * 清空keyName对应的黄条提醒
     * @param keyName
     */
    var clearNewRemindSound=function(keyName){
        newRemindStore[keyName]=0;   //重置为0
    };
    /**
     * 创建remind list，返回htmlstr array
     * @param listData
     */
    var createRemindList=function(listData){
        var htmlArr=[],
            remindInfos=listData.remindInfos;
        var appStore=FS.getAppStore('contactData'),
            enterpriseAccount=appStore.enterpriseAccount,
            account=appStore.account,
            workNotice = false, workNoticeCount = 0;
        _.each(remindInfos,function(itemObj){
            var htmlStr,
                weight,
                itemData=itemObj.value1,    //消息数量
                key=itemObj.value.toString(),  //消息类型
                keyName;    //存储对应的标识
            if(itemData>0){
                switch(key){
                    /*case "34":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条回复，</span><a href="#stream/receivedreplies">查看回复</a></li>';
                        weight=1;
                        break;*/
                    /*case "13":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条@我的工作，</span><a href="#stream/atmefeeds">查看@我</a></li>';
                        weight=2;
                        break;*/

                    case "48":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'个报表可查看，</span><a href="#app/reportrecord" keyname="'+key+'">立即查看</a></li>';
                        weight=0;
                        keyName=48;
                        break;

                    case "47":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'个已审核请求，</span><a href="#app/reportcheck/=/type-2" keyname="'+key+'">查看</a></li>';
                        weight=0;
                        keyName=47;
                        break;

                    case "46":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'个请求需要审核，</span><a href="#app/reportcheck" keyname="'+key+'">立即审核</a></li>';
                        weight=0;
                        keyName=46;
                        break;

                    case "45":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'个报表需要上报，</span><a href="#app/reportdata" keyname="'+key+'">立即上报</a></li>';
                        weight=0;
                        keyName=45;
                        break;

					case "26":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条@我的回复，</span><a href="#stream/atmefeeds/=/type-reply" keyname="'+key+'">查看回复</a></li>';
                        weight=3;
                        keyName=26;
                        break;
					/*case "11":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条关注的信息，</span><a href="#stream/followedfeeds">查看我关注的</a></li>';
                        weight=4;
                        break;*/
					case "9":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条未读指令，</span><a href="#work" keyname="'+key+'">查看我执行的</a></li>';
                        weight=5;
                        keyName=9;
                        break;	
					case "10":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条未读指令，</span><a href="#work/assignedworks" keyname="'+key+'">查看我交代的</a></li>';
                        weight=7;
                        keyName=10;
                        break;
					case "14":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条新审批，</span><a href="#approve" keyname="'+key+'">查看待我审批的</a></li>';
                        weight=8;
                        keyName=14;
                        break;
					case "15":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条未读审批，</span><a href="#approve/sentapproves" keyname="'+key+'">查看我发出的</a></li>';
                        weight=9;
                        keyName=15;
                        break;						
					case "22":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条新日志，</span><a href="#plan" keyname="'+key+'">查看我点评的</a></li>';
                        weight=10;
                        keyName=22;
                        break;
					case "23":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条未读日志，</span><a href="#plan/assignedplans" keyname="'+key+'">查看日志点评</a></li>';
                        weight=11;
                        keyName=23;
                        break;
					/*case "28":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条关注信息的回复，</span><a href="#stream/receivedreplies/=/type-followed">查看回复</a></li>';
                        weight=12;
                        break;*/
					case "37":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条日程，</span><a href="#schedules/=/tabindex-1" keyname="'+key+'">查看我的日程</a></li>';
                        weight=13;
                        keyName=37;
                        break;
					case "5":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'个新网盘文件，</span><a href="#entnetworkdisk/remindmyfile" keyname="'+key+'">查看文件</a></li>';
                        weight=14;
                        keyName=5;
                        break;		
					case "6":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条通知，</span><a href="#notice" keyname="'+key+'">查看我的通知</a></li>';
                        weight=15;
                        keyName=6;
                        break;
					case "4":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条赞，</span><a href="#stream/mylikes" keyname="'+key+'">查看我的赞</a></li>';
                        weight=16;
                        keyName=4;
                        break;			
					case "3":
                        htmlStr='<li class="receipt-item remind-item"><span class="color-666666"><span class="remind-counts">'+itemData+'</span>条回执请求，</span><a href="#stream/myreceipt" class="click-show" keyname="'+key+'">查看我的回执</a></li>';
                        weight=17;
                        keyName=3;
                        break;
					case "44":
						htmlStr='<li class="remind-item"><span class="color-666666">'+itemData+'条新提醒，</span><a href="#myremind" keyname="'+key+'">查看我的提醒</a></li>';
                        weight=17;
                        keyName=44;
                        break;
                    // 工作提醒
					case "100":
						htmlStr='<li class="remind-item remind-item-workNotice"><span class="color-666666">'+itemData+'个群通知，</span><a href="#app/workmessage" class="click-show" keyname="'+key+'">查看群通知</a></li>';
                        weight=17;
                        keyName=100;
                        workNotice = true;
                        workNoticeCount= itemData;
                        break;
                    default:
                        htmlStr='';
                        weight=0;
                        keyName=itemObj.value;
                        break;
                }
                htmlArr.push({
                    "htmlStr":htmlStr,
                    "weight":weight,
                    "keyName":keyName,
                    "counts":itemData
                });
            }
            else{
                if(key==100){
                    $('.remind-item-workNotice',remindListEl).remove();
                    workNotice = true;
                }
            }
        });
        //额外附件信息
        _.each(["overTimeFeedWorkCount","empCountOfNotInCircle","replyCountToMe","feedCountAtMe","feedCountFollowedByMe","replyCountFollowedByMe"],function(key){
            var htmlStr,
                weight;
            if(listData[key]>0){
                switch(key){
                    case "overTimeFeedWorkCount":
                        htmlStr='<li class="remind-item"><span class="color-ff0000">'+listData[key]+'条超时指令，</span><a href="#work" keyname="'+key+'">查看我执行的</a></li>';
                        weight=6;
                        break;
                    case "empCountOfNotInCircle":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+listData[key]+'个需分配部门的员工，</span><a href="'+FS.BASE_PATH+'/h/home/admin?enterprise='+enterpriseAccount+'&account='+encodeURIComponent(account)+'#departmentstaff/=/filterid-3" keyname="'+key+'" target="_blank" class="click-show">立即分配</a></li>';
                        weight=18;
                        break;
                    case "replyCountToMe":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+listData[key]+'条回复，</span><a href="#stream/receivedreplies" keyname="'+key+'">查看回复</a></li>';
                        weight=1;
                        break;
                    case "feedCountAtMe":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+listData[key]+'条@我的工作，</span><a href="#stream/atmefeeds" keyname="'+key+'">查看@我</a></li>';
                        weight=2;
                        break;
                    case "feedCountFollowedByMe":
                        htmlStr='<li class="remind-item"><span class="color-666666">'+listData[key]+'条关注的信息，</span><a href="#stream/followedfeeds" keyname="'+key+'">查看我关注的</a></li>';
                        weight=4;
                        break;
                    case "replyCountFollowedByMe":
                    htmlStr='<li class="remind-item"><span class="color-666666">'+listData[key]+'条关注信息的回复，</span><a href="#stream/followedfeeds/=/type-followed" keyname="'+key+'">查看回复</a></li>';
                    weight=12;
                        break;
                    default:
                        htmlStr='';
                        weight=0;
                        break;
                }
                htmlArr.push({
                    "htmlStr":htmlStr,
                    "weight":weight,
                    "keyName":key,
                    "counts":listData[key]
                });
            }
        });
        //过滤空值
        htmlArr=_.filter(htmlArr,function(htmlObj){
            return !!htmlObj.htmlStr;
        });
        //操作铃声
        operNewRemindSound(htmlArr);
        //按weight排序
        htmlArr=_.sortBy(htmlArr,function(htmlObj){     //升序
            return htmlObj.weight;
        });
        //只提取htmlStr
        htmlArr=_.map(htmlArr,function(htmlObj){
            return htmlObj.htmlStr;
        });

        var globalRemindEl=$('#global-remind'),
            remindListEl=$('.remind-list',globalRemindEl),
            $workNotice = $('.remind-item-workNotice',remindListEl);
        //手动取消绑定到a链接的click事件句柄,jquery可能已经做了这方面的处理
        $('a',remindListEl).unbind('click');

        if(htmlArr.length>0){
            if(workNotice){
                if($workNotice.length){
                    if(workNoticeCount){
                        $workNotice.replaceWith(htmlArr.join(''));
                    }
                    else {
                        $workNotice.remove();
                        if(!remindListEl.find('li:gt(0)').length){
                            globalRemindEl.hide();
                        }
                    }
                }
                else {
                    remindListEl.prepend(htmlArr.join(''));
                }
            }
            else {
                if($workNotice.length){
                    remindListEl.find('li:gt(0)').remove();
                    remindListEl.append(htmlArr.join(''));
                }
                else {
                    remindListEl.html(htmlArr.join(''));
                }
            }
            globalRemindEl.show();
        }
        else{
            if(!workNotice && !$workNotice.length){
                remindListEl.empty();
            }
            if($('.remind-item',globalRemindEl).length == 0){
                globalRemindEl.hide();
            }
        }
    };
    /**
     * 更新导航新feed消息提示
     * @param listData
     * @param navListselector
     */
    var updateFeedCount=function(listData,navListselector){
        var navListEl=$(navListselector),
            countEl=$('.remind-count',navListEl);
        countEl.each(function(){
            var meEl=$(this),
                feedTypeName=meEl.attr('feedtypename'),
                key=feedTypeName+'Count',
                counts=listData[key],
                navEl=meEl.closest('.tpl-nav-item').find('.tpl-nav-l'),
                titleTpl=navEl.attr('titletpl');
            if(counts>0){
                if(counts>99){    //三位数显示99+
                    counts="99+";
                }
                meEl.text(counts).show();
                //title设置
                if(feedTypeName=="plan"||feedTypeName=="approve"){
                    navEl.attr('title',_.template(titleTpl)({
                        "counts":listData[key]
                    }));
                }else if(feedTypeName=="work"){
                    navEl.attr('title',_.template(titleTpl)({
                        "executeCounts": listData["workExecutingCount"],
                        "sendCounts":listData["workCommentingCount"]
                    }));
                }
            }else{
            	if(feedTypeName=='exMailNew' && counts == -1) {
            		return;
            	}
                meEl.text(0).hide();
                navEl.removeAttr('title');
            }

        });
    };
    /**
     * 更新其他全局提示，包括短信剩余和空间剩余量
     * @param listData
     */
    var updateOtherGlobalTip=function(listData){
        var smsTipEl=$('.sms-amount-tip'),
            storageTipEl=$('.storage-space-tip');
        var smsTotal=listData["smsAmount"].value,   //总数
            smsUsed=listData["smsAmount"].value1,   //已使用量
            storageTotal=listData["storageSpace"].value*1024*1024,//总量,返回是以mb为单位的，换算成字节
            storageUsed=listData["storageSpace"].value1*1024*1024,    //已使用量,返回是以mb为单位的，换算成字节
            smsRate,
            storageRate;
        //空间
        if(storageTotal>=storageUsed){  //未超总量
            storageRate=parseFloat(parseFloat(storageUsed)/parseFloat(storageTotal)).toFixed(2);
            $('.v-unit',storageTipEl).text(util.getFileSize(storageTotal-storageUsed));
            $('.v-rate',storageTipEl).text(parseInt(storageRate*100)+'%');
            $('.shown-label',storageTipEl).text('剩余空间：');
            //使用量超过80%才会显示
            if(storageRate>0.8){
                storageTipEl.show();
            }else{
                storageTipEl.hide();
            }
        }else{  //已超总量
            storageRate=parseFloat(parseFloat(storageUsed)/parseFloat(storageTotal)).toFixed(2);
            $('.v-unit',storageTipEl).text(util.getFileSize(storageUsed-storageTotal));
            $('.v-rate',storageTipEl).text(parseInt(storageRate*100)+'%');
            $('.shown-label',storageTipEl).text('已超过空间：');
            //使用量超过80%才会显示
            if(storageRate>0.8){
                storageTipEl.show();
            }else{
                storageTipEl.hide();
            }
        }
        //短信
        if(smsTotal>=smsUsed){  //未超总量
            smsRate=parseFloat(parseFloat(smsUsed)/parseFloat(smsTotal)).toFixed(2);
            $('.v-unit',smsTipEl).text(smsTotal-smsUsed+'条');
            $('.v-rate',smsTipEl).text(parseInt(smsRate*100)+'%');
            $('.shown-label',smsTipEl).text('剩余短信：');
            //使用量超过80%才会显示
            if(smsRate>0.8){
                smsTipEl.show();
            }else{
                smsTipEl.hide();
            }
        }else{  //已超总量
            smsRate=parseFloat(parseFloat(smsUsed)/parseFloat(smsTotal)).toFixed(2);
            $('.v-unit',smsTipEl).text(smsUsed-smsTotal+'条');
            $('.v-rate',smsTipEl).text(parseInt(smsRate*100)+'%');
            $('.shown-label',smsTipEl).text('已超过短信：');
            //使用量超过80%才会显示
            if(smsRate>0.8){
                smsTipEl.show();
            }else{
                smsTipEl.hide();
            }
        }
    };
    /**
     *  服务器版本更新提示
     * @param version
     */
	var doServiceVersionTip=function(version){
        var contactData=util.getContactData(),
            serviceVersion=contactData["v"];
        if(serviceVersion!=version){
            util.showGlobalError("服务器已发布新的版本，为了保证您可以正常使用，请重新登录");
        }
    };
    /**
     * app预处理接口，显示一个合格用户所有可以见到的所有信息（不是第一次登录用户和邀请用户）
     */
    var appPrepare=function(){
        var limitAreaEl=$('.fs-limit-user-hide');
        limitAreaEl.removeClass('fs-limit-user-hide');
        //显示企信
        if(!fsQx.rendered){
            fsQx.show();
        }
    };
    /**
     * 进入演示帐号tip
     * @type {*}
     */
    var DemoTip=Dialog.extend({
        "attrs":{
            className:'fs-demo-tip-dialog fixed-in-tpl-switch',
            content:$(fsHelper).filter('.fs-demo-tip-tpl').html(),
            width:600,
            height:270,
            closeTpl:''
        },
        "events":{
            "click .f-sub":"_submit"
        },
        "render":function(){
            var result=DemoTip.superclass.render.apply(this,arguments);
            var returnTipEl=$('.return-tip',this.element);
            //判断是否从正式帐号跳转过来，如果是显示返回帐号提示
            /*if(this.isFromAccount()){
                returnTipEl.show();
            }*/
            return result;
        },
        /**
         * 是否从正式帐号跳转
         */
        "isFromAccount":function(){
            //判断是否从正式帐号跳转过来，如果是显示返回帐号提示
            var searchStr=location.search,
                queryParams;
            var isFromAccount=false;
            if(searchStr){
                queryParams=searchStr.slice(1).split("&");
                _.each(queryParams,function(paramStr){
                    var paramItem=paramStr.split("=");
                    if(paramItem[0]=="withreturntext"&&paramItem[1]=="1"){
                        isFromAccount=true;
                    }
                });
            }
            if(clientStore.enabled&&clientStore.get('openReturnAccount')){
                isFromAccount=true;
            }
            return isFromAccount;
        },
        "_submit":function(){
            this.hide();
        }
    });

    /**
     * 返回正式帐号的弹框
     */
    /*var BackToLogin = Dialog.extend({
        "attrs": {
            className: 'return-back-account-dialog fixed-in-tpl-switch',
            content: $(fsHelper).filter('.return-back-account').html(),
            width: 384
        },
        "events": {
            "click .f-sub": "_submit",
            "click .f-cancel": "_cancel"
        },
        "render": function () {
            var result = BackToLogin.superclass.render.apply(this, arguments);
            this._renderDom();
            this.imgCodeShown=false;
            return result;
        },
        "_renderDom":function(){
          this.enterpriseEl=$('.aj-enterprise',this.element);
          this.accountEl=$('.aj-account',this.element);
          this.passwordEl=$('.aj-password',this.element);
          this.imgCodeEl=$('.aj-imgcode',this.element);
          this.yzmWarpEl=$('.aj-yzm-warp',this.element);
          this.yzmWarpEl.hide();
        },
        "show": function () {
            var result = BackToLogin.superclass.show.apply(this, arguments);

            return result;
        },
        "hide": function () {
            var result = BackToLogin.superclass.hide.apply(this, arguments);

            return result;
        },
        "validateFn": function (imgCodeShown) {
            var e = $.trim(this.enterpriseEl.val()),
                u = $.trim(this.accountEl.val()),
                pw = $.trim(this.passwordEl.val()),
                yz = $.trim(this.imgCodeEl.val());
            if (e.length == 0) {
                util.alert('请输入企业帐号');
                return false;
            }
            if (u.length == 0) {
                util.alert('请输入个人帐号');
                return false;
            }
            if (pw.length == 0) {
                util.alert('请输入密码');
                return false;
            }
            if (imgCodeShown && yz.length == 0) {
                util.alert('请输入验证码');
                return false;
            }
            return true;
        },
        "getErrorMsg":function (errorStatus) {
            var message = "error";
            switch (errorStatus) {
                case "000":
                    message = "企业帐号错误";
                    break;
                case "001":
                    message = "企业服务已终止";
                    break;
                case "002":
                    message = "验证码输入错误";
                    break;
                case "003":
                    message = "手机号输入错误或未绑定";
                    break;
                case "005":
                    message = "已超过企业可登录的最大人数";
                    break;
                case "004":
                default:
                    message = '帐号或密码错误，检查帐号是否正确或检查密码大小写是否正确';
                    break;
            }
            return message;
        },
        "_submit": function () {
            var that=this;
            var e = $.trim(this.enterpriseEl.val())||'',
                u = $.trim(this.accountEl.val())||'',
                pw = $.trim(this.passwordEl.val())||'',
                yz = $.trim(this.imgCodeEl.val())||'';
            if (this.validateFn(this.imgCodeShown)) {
                util.api({
                    url: (FS.BASE_PATH+"/Account/UserLogin").replace('http','https'),
                    type: "post",
                    data: {
                        enterprise:e,
                        account:u,
                        password:pw,
                        imgCode:yz,
                        isSaveCookie:'on'
                    },
                    success: function (data) {
                        if(data.Success){
                            location.href = 'http://'+location.hostname+location.pathname.slice(0,location.pathname.lastIndexOf('/'))+"/H/Home/Index#stream";
                        }else{
                            if (data.Message == "002" || data.Message == "004") {
                                that.imgCodeShown = true;
                            }
                            if (that.imgCodeShown) {
                                $(".aj-codeimage",that.element).attr("src", "Account/GetCodeImg?randon=" + new Date());
                                that.yzmWarpEl.show();
                            }
                            //弹出服务器返回的错误信息
                           util.alert(that.getErrorMsg(data.Message));
                        }

                    },
                    error: function (data) {
                        util.alert("网络访问失败，请稍后再试");
                    }
                },{
                    autoPrependPath:false
                });
            }
        },
        "_cancel": function () {
            this.hide();
        },
        "destroy": function () {
            var result = BackToLogin.superclass.destroy.apply(this, arguments);
            return result;
        }
    });*/

    //右上角黄条注册
    util.tplRouterReg('#work');
    util.tplRouterReg('#work/assignedworks');
    util.tplRouterReg('#approve');
    util.tplRouterReg('#approve/sentapproves');
    util.tplRouterReg('#plan');
    util.tplRouterReg('#plan/assignedplans');
    util.tplRouterReg('#stream/receivedreplies');
    util.tplRouterReg('#stream/receivedreplies/=/:type-:value');
    util.tplRouterReg('#stream/followedfeeds');
    util.tplRouterReg('#stream/followedfeeds/=/:type-:value');    
    util.tplRouterReg('#schedules');
    util.tplRouterReg('#myremind');//我的提醒
    util.tplRouterReg('#app/workmessage');//工作通知
    util.tplRouterReg('#schedules/=/:tabindex-:value');
    util.tplRouterReg('#stream/atmefeeds');
    util.tplRouterReg('#stream/atmefeeds/=/:type-:value');
    util.tplRouterReg('#stream/myreceipt'); //回执路由

    //全局搜索包含的路由
    util.tplRouterReg('#search/colleagues/=/:key-:value');
    util.tplRouterReg('#search/=/:key-:value');
    util.tplRouterReg('#search/attachs/=/:key-:value');
    util.tplRouterReg('#profile/=/:empID-:value');  //不推荐，应该小写，历史遗留问题
    util.tplRouterReg('#profile/=/:empid-:value');

    //常用
    util.tplRouterReg('#notice');
    util.tplRouterReg('#showmessage');

    //其他预设置的路由
    util.tplRouterReg('#circles/atcircle/=/:cid-:value');
    util.tplRouterReg('#stream/showfeed/=/:id-:value'); //feed详情路由
    util.tplRouterReg('#stream/showfeed/=/:id-:value/:pn-:value'); //带回复分页的 feed详情路由
    util.tplRouterReg('#stream/showfeed/=/:id-:value/:pn-:value/:open-:value'); //自动打开哪个功能
    util.tplRouterReg('#stream/mytopics/=/:topictype-:value');  //话题类型页
    util.tplRouterReg('#stream/showtopic/=/:id-:value');  //话题详情页,根据id请求
    util.tplRouterReg('#stream/showtopic/=/:name-:value');  //话题详情页，根据name请求
    util.tplRouterReg('#profile/profilelocations/=/:id-:value');    //个人签到地图定位
    util.tplRouterReg('#entnetworkdisk/remindmyfile'); //网盘提醒我的文件
    util.tplRouterReg('#inviteemployeecomplateinfo'); //邀请人完善信息页
    util.tplRouterReg('#guides/resetpassword');     //需要重置密码的页面
    util.tplRouterReg('#guides/complatecoreprofile'); //通过手机号注册进入后定位的页面
//    util.tplRouterReg('#marketingintroduct');   //无权限促销宝
    util.tplRouterReg('#circles/allcolleague/=/:id-:value/:name-:value');   //查看部门通讯录导航


//    crm
    util.tplRouterReg('#customers/home');//客户列表
    util.tplRouterReg('#customers/home/=/:param-:value');//客户左侧菜单
    util.tplRouterReg('#customers/home/=/:param-:value');//客户左侧菜单
    util.tplRouterReg('#customers/showcustomer/=/:param-:value');//客户明细
    util.tplRouterReg('#customers/highseas/=/:param-:value');//设置-我的公海客户
    util.tplRouterReg('#contacts/contact');//联系人列表
    util.tplRouterReg('#contacts/sharetome');//共享的联系人
    util.tplRouterReg('#contacts/contact/=/:tagtype-:value');//联系人左侧菜单
    util.tplRouterReg('#contacts/showcontact/=/:param-:value');//联系人明细 ?由/=/代替
    util.tplRouterReg('#opportunities/salesopportunity');
    util.tplRouterReg('#contracts/contract');//合同列表
    util.tplRouterReg('#salesperformances/salesperformance');
    util.tplRouterReg('#salestargets/salestarget');
    util.tplRouterReg('#salestargets/salestarget/=/:param-:value');//销售预测
    util.tplRouterReg('#crmsettings/leaderssetting');//设置同事上下级
    util.tplRouterReg('#crmsettings/allcustomers');//设置-全部客户
    util.tplRouterReg('#crmsettings/allcontacts');//设置-全部联系人
    util.tplRouterReg('#crmsettings/unallocatedcustomers');//设置-未分配客户
    util.tplRouterReg('#crmsettings/commoncustomers');//设置-已归属客户
    util.tplRouterReg('#crmsettings/highseas/=/:param-:value');//设置-公海客户
    util.tplRouterReg('#crmsettings/businesstags');//设置标签
    util.tplRouterReg('#crmsettings/businesstags/=/:tagtype-:value');
    util.tplRouterReg('#crmsettings/userdefinefield');//设置标签
    util.tplRouterReg('#crmsettings/userdefinefield/=/:tagtype-:value');
    util.tplRouterReg('#products/product');//产品列表
    util.tplRouterReg('#products/product/=/:param-:value');//产品列表
    util.tplRouterReg('#products/showproduct/=/:param-:value');//产品明细 ?由/=/代替
    util.tplRouterReg('#competitors/competitor');//对手列表
    util.tplRouterReg('#competitors/competitor/=/:param-:value');//对手列表
    util.tplRouterReg('#competitors/showcompetitor/=/:param-:value');
    util.tplRouterReg('#salesclues/salesclue');//线索列表
    util.tplRouterReg('#salesclues/showsalesclue/=/:param-:value');
    util.tplRouterReg('#salesclues/salesclue/=/:tagtype-:value');//线索左侧菜单
    util.tplRouterReg('#marketings/marketing');//市场列表
    util.tplRouterReg('#marketings/showmarketing/=/:param-:value');//市场明细 ?由/=/代替
    util.tplRouterReg('#marketings/marketing/=/:tagtype-:value');//市场左侧菜单
    util.tplRouterReg('#contracts/contract');//合同列表
    util.tplRouterReg('#contracts/showcontract/=/:param-:value');//合同明细 ?由/=/代替
    util.tplRouterReg('#contracts/contract/=/:tagtype-:value');//合同左侧菜单
    util.tplRouterReg('#opportunities/salesopportunity');//机会列表
    util.tplRouterReg('#opportunities/showopportunity/=/:param-:value');//机会明细 ?由/=/代替
    util.tplRouterReg('#opportunities/salesopportunity/=/:tagtype-:value');//机会左侧菜单
    
    
    
    // 报数系统
    util.tplRouterReg('#app/reportmanage'); // 上报管理
    util.tplRouterReg('#app/reportdata'); // 上报数据
    util.tplRouterReg('#app/reportrecord'); // 报表记录
    util.tplRouterReg('#app/reportcheck'); // 审核记录
    util.tplRouterReg('#app/reportcheck/=/:tagtype-:value'); // 审核记录
    util.tplRouterReg('#app/reportother'); // 外部人员上报

    // 代理商
    util.tplRouterReg('#partner/partnermanage'); // 代理商管理
    
    //for test
    util.tplRouterReg('#ligd');
    util.tplRouterReg('#zhangdl');
    util.tplRouterReg('#zzliuxf'); //liuxf测试专用

    exports.init = function () {
        var appStore=FS.getAppStore('contactData'); //原始页面输出数据
		var bodyEl = $('body'); //1234
        var contactData,
            currentMember,
            companyName;
        QXModel.on('qxWorkNotice', function(data){
            createRemindList({
                remindInfos: [{
                    value: 100,
                    value1: data.count
                }]
            });
        });
        //页面打开或刷新时导航到当前子模板
        var navRouter = tpl.navRouter,
            locationHref=location.href,
            tplPath,    //页面默认请求地址
            routerPath; //待注册的路由
            //tplPath = root.location.hash.slice(1);
        var reged=false,
            queryParam,
            queryKeyArr;
        //显示公司名
        companyName=appStore?appStore.companyName:"纷享科技";
        $('.company-name').html(companyName);
        //获取当前tpl地址
        if(locationHref.indexOf('#')!=-1){
            tplPath=locationHref.slice(locationHref.indexOf('#') + 1);
        }else{
            tplPath="";
        }
        //判定是否是邀请用户或者需重置密码用户
        var isInvite=FS.getAppStore('isInvite');
        //先判断是否是邀请用户
        if(isInvite==3){      //3表示是邀请人，被定为到邀请人信息完善页
            if(tplPath=="inviteemployeecomplateinfo"){  //保证可正常跳转
                navRouter.navigate('', {
                    trigger: true
                });
            }
            navRouter.navigate('inviteemployeecomplateinfo', {
                trigger: true
            });
            return;
        }else{
            //准备数据
            contactData=util.getContactData();
            currentMember=contactData['u'];
            if(_.str.trim(appStore.mobile).length>0&&appStore.mobile==currentMember.name){    //通过手机号注册的用户被定为到个人信息完善页
                if(tplPath=="guides/complatecoreprofile"){    //保证可正常跳转
                    navRouter.navigate('', {
                        trigger: true
                    });
                }
                navRouter.navigate('guides/complatecoreprofile', {
                    trigger: true
                });
                return;
            }else{
                if(appStore.isInitialPassword){     //表示需要重置密码
                    if(tplPath=="guides/resetpassword"){    //保证可正常跳转
                        navRouter.navigate('', {
                            trigger: true
                        });
                    }
                    navRouter.navigate('guides/resetpassword', {
                        trigger: true
                    });
                    return;
                }else{
                    if(tplPath=="inviteemployeecomplateinfo"||tplPath=="guides/complatecoreprofile"||tplPath=="guides/resetpassword"){
                        tplPath="stream"; //重定位到首页
                    }
                    appPrepare();
                }
            }
        }
        //进入正常流程
        //注册tpl nav路由
        var tplNavEl = $('a.tpl-nav-l'),
            boundexMailEl=$('.settings-boundexmail');
        //是否显示“设置邮件”导航
        if(currentMember.exmailDomain){    //根据这个判定是否显示邮件，有效值才显示
            boundexMailEl.closest('.tpl-nav-item').show();
        }
        //构建黄条播放器
        (function(){
            var audioBoxEl;
            audioBoxEl=$('<div class="fn-hide-abs"></div>');
            audioBoxEl.appendTo('body');
            //获取企业配置
            util.fetchEnterpriseConfig();

            FS.remindSoundPlayer=new AudioPlayer({
                "element":audioBoxEl,
                "audioSrc":FS.ASSETS_PATH+'/sound/notification.mp3'
            });
        }());

        util.tplRouterReg(tplNavEl);
        if (tplPath.length > 0) {
            tplNavEl.each(function(){
                if($(this).attr('href').slice(1)==tplPath){
                    reged=true;
                    return false;
                }
            });
            routerPath=tplPath;
            if(!reged){
                //将实际地址替换成router路由配置
                if(routerPath.indexOf('/=/')!=-1){
                    queryParam=util.getTplQueryParams(routerPath);
                    queryKeyArr= _.keys(queryParam);
                    queryKeyArr=_.map(queryKeyArr,function(key){
                        return ':'+key+'-'+':value';
                    });
                    routerPath=routerPath.slice(0,routerPath.indexOf('/=/'))+'/=/'+queryKeyArr.join('/');
                }
                util.tplRouterReg('#'+routerPath);
            }
            navRouter.navigate('', {
                trigger: true
            });
            navRouter.navigate(tplPath, {
                trigger: true
            });
        }else{  //hash为空定位到stream页
            navRouter.navigate('stream', {
                trigger: true
            });
        }
		//已绑定邮件，导航点击会自动打开邮箱页
        if(currentMember.boundEmployeeExmail){
            $('#tip-settings-boundexmail').attr('href',FS.BASE_PATH+'/H/Account/GetBindingEmployeeExmailLoginUrl').attr('target','_blank');
        }
		//head 右侧 常用 下拉
		var commonUseWrap=$('.common-use-l'),
			commonUseTitle=$('.common-use-title'),
			commonUseList=$('.common-use-list');
		commonUseWrap.on('mouseenter',function(){
			commonUseTitle.addClass('culon');
			commonUseList.show();
		});
		commonUseWrap.on('mouseleave',function(){
			commonUseTitle.removeClass('culon');
			commonUseList.hide();
		});

        if(FS.getAppStore('contactData') && FS.getAppStore('contactData').isAllowSetOwnLeader){
        }else{
            commonUseList.find('[href="#settings/setleader"]').remove();
        }
        //高亮对应的头部导航
        util.regTplNav(tplNavEl,'tnavon state-active');

        $('.tpl-nav-list').on('click','a.state-active',function(evt){
            var aEl=$(this),
                aHref=aEl.attr('href');
            var currentTplName=util.getCurrentTplName();
            if(aHref.search(currentTplName.split('-').join('/'))!=-1){   //判断点击链接的地址和location指示的是否相同
                evt.preventDefault();
            }
        });
        //设置登录用户名
        $('.user-name-l').html(currentMember.name);
		$('.user-name-l').attr('title',currentMember.name);
        //全局搜索
        var globalSearchBtnEl=$('.h-search-btn'),
            searchEl=$('#global-search');   //全局搜索按钮
        var acFilter,
            acFilterFunc;
        var ac=new Autocomplete({
            className:'global-search-ac-panel',
            trigger: searchEl,
            template: $('.global-search-ac').html(),
            delay:0,    //默认延迟100ms
            submitOnEnter:false,    //回车不会提交表单
            zIndex:100,
            dataSource:contactData['p']
            //dataSource: formatGlobalAcData(FS.getAppStore('contactData').members,'p')   //只筛选人
        }).render();
        //重设过滤器
        acFilter=ac.get('filter');
        acFilterFunc=acFilter.func;
        acFilter.func=function(data, query, options){
            var filterData=[];
            var filterData1 = acFilterFunc.apply(this, [data, query, {
                "key": "name"
            }]);
            var filterData2 = acFilterFunc.apply(this, [data, query.toLowerCase(), {
                "key": "spell"
            }]);
            //先插入filterData2的数据
            _.each(filterData2,function(itemData){
                if(!_.find(filterData1,function(itemData2){
                    return itemData2.id==itemData.id;
                })){
                    filterData.push(itemData);
                }
            });
            filterData=filterData.concat(filterData1);
            //只显示前三个
            filterData=filterData.slice(0,3);
            //拼接profileImage正确地址
            _.each(filterData,function(itemData){
                itemData.profileImage=util.getAvatarLink(itemData.profileImagePath,3);
            });
            //动态设置query用于在模板显示
            ac.model.query=query;
            //渲染title
            //必须分别渲染，不然会共用一个模板
            ac.renderPartial(".global-search-members-title");
            ac.renderPartial(".global-search-work-title");
            ac.renderPartial(".global-search-attach-title");
            return filterData;
        };
        ac.set('filter',acFilter);
        ac.on('itemSelect',function(data){
            navRouter.navigate('#profile/=/empid-'+data.id, {
                trigger: true
            });
            searchEl.val("").get(0).blur();
        });
        ac.element.on('click','.global-search-title',function(){
            ac.hide();
        }).on('click','.tpl-nav-l',function(evt){
            searchEl.val("").get(0).blur();
        });
        //点击搜索按钮导航到搜索工作页
        globalSearchBtnEl.click(function(evt){
            var val= _.str.trim(searchEl.val()),
                employeeData;
            employeeData=util.getContactDataByName(val,'p');
            if(employeeData){
                navRouter.navigate('#profile/=/empid-'+employeeData.id, {
                    trigger: true
                });
            }else{
                navRouter.navigate('#search/=/key-'+encodeURIComponent(val), {
                    trigger: true
                });
            }
            searchEl.val("").get(0).blur();
            evt.preventDefault();
        });
        //回车快捷键绑定
        searchEl.keyup(function(evt){
            if(evt.keyCode==13){
                globalSearchBtnEl.click();
            }
        });

		//导航 Tip
		var tplNavListEl=$('.tpl-nav-list',bodyEl);
        //全局提醒
        var circleRemind=function(action){
            action=action||"start";
            if(action=="start"){
                getGlobalRemindInfo(function(responseData){
                    var globalRemindEl=$('#global-remind'),
                        remindListEl=$('.remind-list',globalRemindEl);
                    if(responseData.success){
                        createRemindList(responseData.value);
                        updateFeedCount(responseData.value,tplNavListEl);
                        //更新短息和剩余空间信息
                        updateOtherGlobalTip(responseData.value);
                        //服务端版本号变更提示
                        doServiceVersionTip(responseData.value.version);
                        //注册跳转链接为强制刷新链接
                        util.regRefreshLink($('a',remindListEl));
                        //分派globalremind事件
                        tpl.event.trigger('globalremind',responseData);
                    }
                },function(){
                    clearTimeout(FS.globalRemind);
                    FS.globalRemind=setTimeout(function(){  //取得信息后延时30s继续请求
                        circleRemind();
                    },30000);  //30s
                });
            }else if(action=="stop"){
                clearTimeout(FS.globalRemind);
            }
        };
        var globalRemindEl=$('#global-remind');
        /*FS.globalRemind=setInterval(function(){
            circleRemind();
        },30000);*/
//        circleRemind('start');
        //保存30s轮询处理接口
        FS.circleRemind=circleRemind;

        globalRemindEl.on('click','.close-btn',function(evt){
            globalRemindEl.hide();
            //evt.preventDefault();
        }).on('click','a',function(){
            var meEl=$(this),
                keyName=meEl.attr('keyname');
            if(!meEl.hasClass('click-show')){ //不加click-show class的链接点击后隐藏
                meEl.closest('.remind-item').remove();
                if($('.remind-item',globalRemindEl).length==0){
                    globalRemindEl.hide();
                }
            }
            clearNewRemindSound(keyName);
        });
        //返回到顶部
        var toTopBtnEl=$('.to-top-btn'),
			rightQqApvEl=$('.right-qq-apv'),
            winEl=$(window);
        winEl.scroll(function(){
            var scrollTop=winEl.scrollTop(),
                winH=winEl.height();
            if(scrollTop>0){
                if(isIE6){
                    toTopBtnEl.addClass('to-top-btn-abs-show');
                    toTopBtnEl.css({
                        "top":winH+scrollTop-160+'px'
                    });
                }else{
                    toTopBtnEl.addClass('to-top-btn-fixed-show');
                }
            }else{
                if(isIE6){
                    toTopBtnEl.addClass('to-top-btn-abs-show');
                    toTopBtnEl.css({
                        "top":"-10000px"
                    });
                }else{
                    toTopBtnEl.removeClass('to-top-btn-fixed-show');
                }
            }
        });
        toTopBtnEl.click(function(){
            winEl.scrollTop(0); //点击返回到顶部
        }).on('mouseenter',function(){
                toTopBtnEl.addClass('to-top-btn-hover');
            }).on('mouseleave',function(){
                toTopBtnEl.removeClass('to-top-btn-hover');
            });

        //切换tpl后scroll到顶部
        tpl.event.on('switched', function (tplName, tplEl) {
            winEl.scrollTop(0); //点击返回到顶部
            circleRemind('stop');
            setTimeout(function(){
            	circleRemind('start');
            }, 1000);
        });
		//判断 分辨率小于1024 返回顶部标签右侧浮动
        //保证模板切换遮罩正常起作用
		var toTopTid;
		$(window).resize(function(){
			clearTimeout(toTopTid);
		    toTopTid=setTimeout(function(){
				var winWidth=$(window).width(),
                    winHeight=$(window).height(),
                    hdHeight=$('.hd').outerHeight();
				if(winWidth < 1150){
					toTopBtnEl.css({left:"inherit",margin:"inherit",right:"0"});
					rightQqApvEl.css({left:"inherit",margin:"inherit",right:"0"});
				}else{
					toTopBtnEl.css({left:"50%","margin-left":"591px",right:"inherit"});
					rightQqApvEl.css({left:"50%","margin-left":"590px",right:"inherit"});
				}
                $('#sub-tpl').css('minHeight',(winHeight-hdHeight)+'px');
		    },300);
		}).resize();
        //placeholder
        util.placeholder('input,textarea');
        bodyEl.on('click','.fs-prevent-default',function(evt){
            evt.preventDefault();
        }).on('click','.fs-switch-tpl-l',function(evt){
            Dialog.hideAll();
        }).on('keydown','textarea',function(evt){   //textarea下禁用esc键
            if(evt.keyCode==27){
                evt.preventDefault();
            }
        });
        //本地生成enterpriseConfig
        util.fetchEnterpriseConfig();
        //判断是否显示管理和邀请同事按钮
        if(currentMember.isAdmin){
            $('.open-admin-wrapper').show();
            $('.open-admin-l').attr('href',$('.open-admin-l').attr('href')+'?enterprise='+appStore.enterpriseAccount+'&account='+encodeURIComponent(appStore.account)+'#index');
            //$('.right-yq-apv').show();
			//$('.global-search-f').css("right","220px");
        }else{
            $('.open-admin-wrapper').hide();
            //$('.right-yq-apv').hide();
			//$('.global-search-f').css("right","192px");
        }
        //label for checkbox or radio的绑定
        var labelIndex=0;   //label增量
        bodyEl.on('click','.label-for label',function(){
            var labelEl=$(this),
                labelForEl=labelEl.closest('.label-for'),
                elEl=$('[type="checkbox"],[type="radio"]',labelForEl);
            var checkId=elEl.attr('id');
            //如果label没有设置for属性手动模拟checkbox或radio触发
            if(!labelEl.attr('for')){
                if(!checkId){
                    checkId='fs-label-'+labelIndex;
                    labelIndex++;
                }
                elEl.attr('id',checkId);
                labelEl.attr('for',checkId);
            }
        }).on('focus','input,textarea',function(){
            var inputEl=$(this);
            inputEl.addClass('fs-input-focus');
        }).on('blur','input,textarea',function(){
            var inputEl=$(this);
            inputEl.removeClass('fs-input-focus');
        });
        //顶部导航控制
//        if(currentMember.modules>1&&_.some(currentMember.functionPermissions,function(permission){
//            return permission.value==21;    //权限21表示具有促销宝权限
//        })){
//            $('.cxb-l').attr('href',FS.BASE_PATH+'/marketing.aspx').attr('target','_blank').show();
//        }else{
//            $('.cxb-l').hide();
//        }
        //页面导航控制
        if(_.some(currentMember.functionPermissions,function(permission){
            return permission.value==7;    //定位管理员
        })){
            $('#tip-locations').closest('.tpl-nav-item').show();
        }else{
            $('#tip-locations').closest('.tpl-nav-item').hide();
        }
        bodyEl.on('click','.hd .top-nav-l',function(evt){
            var linkEl=$(evt.currentTarget);
            if(linkEl.attr('target')!="_blank"){
                $('.hd .top-nav-l',bodyEl).removeClass('sc-tagon').addClass('sc-tag');
                linkEl.removeClass('sc-tag').addClass('sc-tagon');
            }
        }).on('click','.hd .common-use-list',function(evt){     //点击常用隐藏列表
            $(this).hide();
        });
        //内侧版本提示

        if(!H5uploader.isSupport()){
            //$($(fsHelper).filter('.browser-upgrade-tip-tpl').html()).prependTo('body');
            $(_.template($(fsHelper).filter('.browser-upgrade-tip-tpl').html())({
                "browserIconPath":FS.ASSETS_PATH+'/images/browser'
            })).prependTo('body');

            $('.browser-upgrade-tip .browser-upgrade-content').show();
            $('.browser-upgrade-tip').slideDown(300);
            $('.browser-upgrade-tip .back-origin-l').attr('href',FS.BASE_PATH+'/plus.aspx#/Stream');
            $('.browser-upgrade-tip .close-l').click(function(evt){
                $('.browser-upgrade-tip').hide();
                evt.preventDefault();
            });
        }
        //演示帐号提示文字
        var demoTip;
        if(appStore.isDemoAccount){
            demoTip=new DemoTip();
            demoTip.show();

            //返回正式帐号按钮事件
            if(demoTip.isFromAccount()){
                $('#return-back-account-btn').show();
                /*bodyEl.on('click', '#return-back-account-btn', function () {
                    var backToLogin = new BackToLogin();
                    backToLogin.show();
                });*/
                //清除标识
                if(clientStore.enabled){
                    clientStore.remove('openReturnAccount');
                }
            }
        }

//        crm
        //更多下拉
        //不是crm管理员，隐藏设置
        if(!util.isCrmAdmin()){
            $('#tip-crmsetting').parent().hide();
            $('#tip-crmsetting').remove();
//            $('#tip-crmsetting').parent().remove();
//            $('<li class="tpl-nav-item"></li>').html($('#tip-marketing').clone()).insertBefore($('.hd-crm-inner').children().last());
//            $('.more-nav-link').find('#tip-marketing').parent().remove();
        }

        tplNavListEl.on('click','.more-nav-link',function(evt){
            var listEl=$('.more-nav-list',this);
            listEl.is(':visible')?listEl.hide():listEl.show();
            evt.stopPropagation();
        }).on('click','.more-nav-item',function(e){
            var currentLinkEl=$(this),
                moreNavLinkEl=$('.more-nav-link',tplNavListEl),
                prevNavLinkEl=moreNavLinkEl.prev(),
                moreNavListEl=$('.more-nav-list',moreNavLinkEl),
                lastMoreNavLinkEl=$('.more-nav-item',moreNavListEl).last();
            var lastItem = moreNavLinkEl.prev().show();

            var lastPlaceId = lastItem.children('a').attr('id');
            if(lastPlaceId && moreNavListEl.find('#'+lastPlaceId).length==0){
                $('<li class="more-nav-item"></li>').appendTo(moreNavListEl);
                $('a',prevNavLinkEl).appendTo($('.more-nav-item',moreNavListEl).last());
            }
            //替换链接
            prevNavLinkEl.empty();
            $('a',currentLinkEl).clone().addClass('tnavon').appendTo(prevNavLinkEl);
            //设置选中样式
            $('.state-selected',moreNavListEl).removeClass('state-selected');
            $('a',currentLinkEl).addClass('state-selected');
        });
        util.regGlobalClick($('.more-nav-list',tplNavListEl));
        //高亮对应的头部导航
        util.regTplNav(tplNavEl,'tnavon state-active');
        if (tplPath.length > 0) {
            tplNavEl.each(function(){
                if($(this).attr('href').slice(1)==tplPath){
                    reged=true;
                    return false;
                }
            });
            routerPath=tplPath;
            if(!reged){
                //将实际地址替换成router路由配置
                if(routerPath.indexOf('/=/')!=-1){
                    queryParam=util.getTplQueryParams(routerPath);
                    queryKeyArr= _.keys(queryParam);
                    queryKeyArr=_.map(queryKeyArr,function(key){
                        return ':'+key+'-'+':value';
                    });
                    routerPath=routerPath.slice(0,routerPath.indexOf('/=/'))+'/=/'+queryKeyArr.join('/');
                }
                util.tplRouterReg('#'+routerPath);
            }
            navRouter.navigate('', {
                trigger: true
            });
            navRouter.navigate(tplPath, {
                trigger: true
            });
        }else{  //hash为空定位到我的客户页
//            navRouter.navigate('customers/home', {
//                trigger: true
//            });
        }

        //切换tpl后scroll到顶部
        tpl.event.on('switched', function (tplName, tplEl) {
            winEl.scrollTop(0); //点击返回到顶部
        });
        //placeholder
        util.placeholder('input,textarea');
        bodyEl.on('click','.crm-prevent-default',function(evt){
            evt.preventDefault();
        }).on('click','.crm-switch-tpl-l',function(evt){
            Dialog.hideAll();
        }).on('keydown','textarea',function(evt){   //textarea下禁用esc键
            if(evt.keyCode==27){
                evt.preventDefault();
            }
        });
        //本地生成enterpriseConfig
        util.fetchEnterpriseConfig();


        //工作管理与CRM点击切换事件
        $('.app-top-nav-l, .crm-top-nav-l,.apps-top-nav-l').click(function (e) {
            if ($(e.target).hasClass('app-top-nav-l')) {
                $('.hd-crm-inner').hide();
                $('.hd-apps-inner').hide();
                $('.hd-app-inner').show();
                $('.crm-top-nav-l').removeClass('tnavon state-active');
                $('.apps-top-nav-l').removeClass('tnavon state-active');
                $('.app-top-nav-l').addClass('tnavon state-active');
            }
            if ($(e.target).hasClass('crm-top-nav-l')) {
                $('.hd-app-inner').hide();
                $('.hd-apps-inner').hide();
                $('.hd-crm-inner').show();
                $('.app-top-nav-l').removeClass('tnavon state-active');
                $('.apps-top-nav-l').removeClass('tnavon state-active');
                $('.crm-top-nav-l').addClass('tnavon state-active');
            }
            if ($(e.target).hasClass('apps-top-nav-l')) {
                $('.hd-crm-inner').hide();
                $('.hd-app-inner').hide();
                $('.hd-apps-inner').show();
                $('.crm-top-nav-l').removeClass('tnavon state-active');
                $('.app-top-nav-l').removeClass('tnavon state-active');
                $('.apps-top-nav-l').addClass('tnavon state-active');
            }


        });

        try {
        	window.store.remove('upgradetipshown');
        }catch(e){}
    };
});