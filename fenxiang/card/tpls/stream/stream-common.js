/**
 * stream辅助页面逻辑
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util=require('util'),
        Zclip = require('assets/zclip/1.1.1/zclip'),
        Dialog=require('dialog'),
        leftTpl=require('./stream-common.html'),
        leftTplEl=$(leftTpl);
        
    var inviteApvTplEl=leftTplEl.filter('.invite-apv-tpl'),
        inviteFieldTpl='手机或邮箱：<input type="text" class="invite-inp" /><span class="invite-inp-cerror" style="display:none;">格式错误</span>';
    var InviteColleague=Dialog.extend({
        "attrs":{
            width: '500px',
            className:'invite-apv-dialog',
            list:null,   //列表组件
            content:inviteApvTplEl.html()
        },
        "tabStatus": 'email',
        "timer": null,
        "linkText": '',
        "createLinkStart": false,
        "createLinkSuc": false,
        "zclip": null,
        "events":{
            "click .f-sub":"_submit",
            "click .f-cancel":"_cancel",
            "click .invite-amore-add":"_addField",
            "click .dialog-invite-tab span": "_tabHandle",
            "focus .invite-inp":"_inputFocus",
            "blur .invite-inp":"_inputBlur"
        },
        "_tabHandle": function(evt) {
            var $el = this.element,
                $target = $(evt.target),
                index = $target.index();
            if ($target.hasClass('cur')) {
                return false;
            }
            $target.addClass('cur').siblings().removeClass('cur');
            $('.ui-dialog-text', $el).hide();
            $('.ui-dialog-text', $el).eq(index).show();
            
            if (index == 0) {
                this.tabStatus = 'email';
            } else {
                this._copy();
                this.tabStatus = 'link';
                this._createLink();    
            }
        },
        "_createLink": function() {
            var that = this;
            if (that.createLinkStart || that.createLinkSuc) {return;}
            that.createLinkStart = true;
            $('.invite-link-box', this.element).html('邀请链接正在生成...');  
            setTimeout(function(){
                util.api({
                    'type': 'post',
                    'url':  '/Invite/GetInviteMessage',
                    'success': function(responseData){
                        if(responseData.success){
                            that.linkText = responseData.value;
                            $('.invite-link-box', that.element).html('<span>' + that.linkText + '</span>');
                            that.createLinkStart = false;
                            that.createLinkSuc = true;
                        }
                    }
                });
            }, 300);
        },
        "_copy": function() {
            var that = this;
            if (that.zclip) {
                return;
            }
            that.zclip = new Zclip($('.f-copy', that.element), {
                copy: function() {
                    return that.createLinkSuc ? that.linkText : '';
                },
                beforeCopy: function() {
                    if (that.createLinkStart) {
                        util.alert('正在生成邀请链接请稍等！');
                        return false;
                    }              
                },
                afterCopy: function() {
                    if (that.createLinkSuc) {
                        if (!that.timer) {
                            $('.copy-suc-tip', that.element).show();
                            that.timer = setTimeout(function() {
                                $('.copy-suc-tip', that.element).hide();
                                clearTimeout(that.timer);
                                that.timer = null;
                            }, 1000 * 2);
                        }
                    }
                }
            });
        },
        "_addField":function(){
            var elEl=this.element,
                addItemWrap=$('.invite-item',elEl);
            addItemWrap.last().after("<div class='invite-item'>"+inviteFieldTpl+"</div>");
        },
        "_inputFocus":function(evt){
            var elEl=this.element;
            var meEl=$(evt.target),
                inputEl=$('.invite-inp',elEl);
            inputEl.removeClass('invite-inp-on');
            meEl.addClass('invite-inp-on');
			meEl.removeClass('invite-inp-onerror');
			meEl.next().hide();
        },
        "_inputBlur":function(evt){
            var elEl=this.element,
			    meEl=$(evt.target),
                inputEl=$('.invite-inp',elEl);
            inputEl.removeClass('invite-inp-on');
		    var emailNum=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			var val=_.str.trim(meEl.val());	
			if(val.length>0){
				if(!(util.isMobilePhoneNum(val)||emailNum.test(val))){
					meEl.addClass('invite-inp-onerror');
					meEl.next().show();
				}
			}
			
        },
        "show":function(){
            var result=InviteColleague.superclass.show.apply(this,arguments);
            if (this.tabStatus == 'link') {
                $('.dialog-invite-tab span', this.element).eq(0).trigger('click');
            }
            return result;
        },
        "hide":function(){
            var result=InviteColleague.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "getRequestData":function(){
            var elEl=this.element,
                inviteInputEl=$('.invite-inp',elEl);
            var requestData=[];
            inviteInputEl.each(function(){
                var inputEl=$(this),
                    inviteInputVal= _.str.trim(inputEl.val());
                if(inviteInputVal.length>0){
                    requestData.push(inviteInputVal);
                }
            });
            //requestData["FullName"]="";
            //requestData["Departments"]="";
            //requestData["Password"]="";
            return requestData;
        },
        "isValid":function(){
            var elEl=this.element;
            var passed=true;
            var inputEl=$('.invite-inp',elEl);
            var emailNum=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            var val=inputEl.val();
            var requestData=this.getRequestData();

            if(requestData.length==0){
                util.alert('请输入需要邀请的员工的手机或邮箱。');
                return false;
            }
            inputEl.each(function(){
                var val= _.str.trim($(this).val());
                if(val.length>0){
                    if(!(util.isMobilePhoneNum(val)||emailNum.test(val))){
                        util.alert('手机或邮箱格式不正确。');
                        passed=false;
                        return false;
                    }

                }
            });

            return passed;
        },
        "_clear":function(){
            var elEl=this.element,
                inputEl=$('.invite-inp',elEl),
                inputItemEl=$('.invite-item',elEl);
			inputEl.removeClass('invite-inp-onerror');
			inputEl.next().hide();	
            //只保留三个input
            inputEl.val("");
            inputItemEl.slice(5).remove();
            this.createLinkSuc = false;
            $('.invite-link-box', this.element).html('邀请链接正在生成...');            
        },
        "_submit":function(evt){
            var that=this;
            var btnEl=$(evt.target);
            var requestData=this.getRequestData();
            if(this.isValid()){
                if(requestData.length > 0){
                    util.confirm('本次邀请'+ requestData.length +'个用户','提示',function(){
                        util.api({
                            "type": "post",
                            "url":"/Invite/InvitePerson",
                            "data": {
                                "contacts": requestData.join(",")
                             },
                            "success":function(responseData){
                                if(responseData.success){
                                    that.hide();
                                }
                            }
                        },{
                            "submitSelector":btnEl
                        });
                    },{
                        "onCancel":function(){
                            return false;
                        },
                        "messageType":"",
                        "width":380
                    });
                }
            }
        },
        "_cancel":function(){
            this.hide();
        }
    });
    exports.InviteColleague=InviteColleague;

    var isShowGroupGuide=true;  //设置是否显示部门引导图标志
    var isShowAvatarGuide=true;  //设置是否显示头像引导
    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"],
            currentUserGroupIds=currentMember.groupIDs,
            groupsData=contactData["g"],
            employeesData=contactData["p"];
        var renderData={},
            groups=[];
        var leftCompiled=_.template(leftTplEl.filter('.stream-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });
        //组织group数据
        _.each(currentUserGroupIds,function(groupId){
            var groupData=_.find(groupsData,function(data){
                return data.id==groupId;
            });
            if(groupData){
                groups.push({
                    groupName:groupData.name,
                    groupID:groupData.id,
                    cTitle:encodeURIComponent(groupData.name)
                });
            }
        });
        renderData.groups=groups;
        renderData.allCompanyDefaultString=currentMember.allCompanyDefaultString;//全公司的字符串
        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));
        //部门guide提示,非演示帐号，部门数为0，员工大于等于5
        if(currentMember.isAdmin&&!currentMember["isDemoAccount"]&&groups.length==0&&employeesData.length>=5&&isShowGroupGuide){
            util.showGuideTip($('.group-list',tplLeftEl),{
                "leftLeftIncrement":0,  //左侧边框左移动增
                "rightLeftIncrement":-14, //右侧边框左移动增量
                "imageName":"stream-menu.png",
                "imagePosition":{
                    "top":"-90px",
                    "left":"20px"
                },
                "renderCb":function(imgWEl,leftEl,rightEl,hostEl){
                    //模拟图片map映射
                    var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                        toAdminBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                    var closeCb=function(){
                        leftEl.remove();
                        rightEl.remove();
                        $('.fs-guide-group-bracket').remove();  //清理其他部门提示
                        isShowGroupGuide=false;
                        //如果头像引导图存在显示出来
                        $('.fs-guide-send-receipt-bracket').css('visibility','visible');
                    };
                    $('.fs-guide-send-receipt-bracket,.fs-guide-history-plan-bracket').css('visibility','hidden');
                    //设置部门guide自己的标识
                    leftEl.addClass('fs-guide-group-bracket');
                    rightEl.addClass('fs-guide-group-bracket');
                    closeLinkEl.css({
                        "width":"26px",
                        "height":"26px",
                        "position":"absolute",
                        "top":"8px",
                        "left":"240px",
                        "cursor":"pointer"
                    }).appendTo(imgWEl);
                    toAdminBtnEl.css({
                        "width":"158px",
                        "height":"32px",
                        "position":"absolute",
                        "top":"124px",
                        "left":"83px",
                        "cursor":"pointer"
                    }).appendTo(imgWEl);
                    //点击关闭
                    closeLinkEl.click(function(){
                        closeCb();
                    });
                    //点击按钮进入后台管理
                    toAdminBtnEl.click(function(){
                        window.open(FS.BASE_PATH+'/h/home/admin?enterprise='+currentMember['enterpriseAccount']+'&account='+currentMember['account']+'&showcircleguide=yes');
                    });
                    //点击hostEl关闭
                    hostEl.click(function(){
                        closeCb();
                    });
                }
            });
        }
        //头像guide提示
        //产生条件，非演示帐号并且头像为空
        if(!currentMember["isDemoAccount"]&&currentMember.profileImagePath.length==0&&isShowAvatarGuide){
            util.showGuideTip($('.head-img-wrap',tplLeftEl),{
                "leftLeftIncrement":0,  //左侧边框左移动增
                "rightLeftIncrement":-14, //右侧边框左移动增量
                "imageName":"avatar.png",
                "imagePosition":{
                    "top":"-34px",
                    "left":"20px"
                },
                "renderCb":function(imgWEl,leftEl,rightEl){
                    //模拟图片map映射
                    var closeLinkEl=$('<div class="fs-guide-shadow-link"></div>'),
                        changeAvatarBtnEl=$('<div class="fs-guide-shadow-link"></div>');
                    var closeCb=function(){
                        leftEl.remove();
                        rightEl.remove();
                        $('.fs-guide-avatar-bracket').remove();  //清理其他头像提示
                        isShowAvatarGuide=false;
                        $('.fs-guide-group-bracket').css('visibility','visible');
                    };
                    //设置部门guide自己的标识
                    leftEl.addClass('fs-guide-avatar-bracket');
                    rightEl.addClass('fs-guide-avatar-bracket');
                    $('.fs-guide-group-bracket,.fs-guide-send-receipt-bracket,.fs-guide-history-plan-bracket').css('visibility','hidden');
                    closeLinkEl.css({
                        "width":"26px",
                        "height":"26px",
                        "position":"absolute",
                        "top":"16px",
                        "left":"200px",
                        "cursor":"pointer"
                    }).appendTo(imgWEl);
                    changeAvatarBtnEl.css({
                        "width":"140px",
                        "height":"32px",
                        "position":"absolute",
                        "top":"115px",
                        "left":"68px",
                        "cursor":"pointer"
                    }).appendTo(imgWEl);
                    //点击关闭
                    closeLinkEl.click(function(){
                        closeCb();
                    });
                    //点击按钮进入修改头像页
                    changeAvatarBtnEl.click(function(){
                        tpl.navRouter.navigate('#settings/avatarsetting', {
                            trigger: true
                        });
                        closeCb();
                    });
                }
            });
        }
		
		//部门展开收起
		var groupListWrap=$('.group-list',tplLeftEl),
			groupListItem=$('.fni-dep-con',groupListWrap),
			leftDeplistTpl=$('.left-deplist-tpl',tplLeftEl),
			deplistControlEl=$('.deplist-control',leftDeplistTpl);
		if(groupListItem.length > 5){
			groupListItem.hide();	
			groupListItem.slice(0,5).show();
			leftDeplistTpl.show();
			leftDeplistTpl.click(function(){
				if(deplistControlEl.html() == '展开'){
					groupListItem.show();
					deplistControlEl.html("收起");
				}else{
					groupListItem.slice(5,groupListItem.length).hide();
					deplistControlEl.html("展开");	
				}
			});
		}else{
			groupListItem.show();
			leftDeplistTpl.hide();
		}
		//left 工作状态 交互
        /**
		var onlineStatusWrap=$('.online-status-wrap',tplLeftEl),
			onlineStatusBtn=$('.online-status-drop',onlineStatusWrap),
			onlineStatusText=$('.online-status-text',onlineStatusWrap),
			onlineStatusList=$('.online-status-list',onlineStatusWrap);
		util.placeholder(onlineStatusText)	
		
		onlineStatusWrap.on('mouseenter',function(){
			onlineStatusWrap.addClass('online-status-border');
		}).on('mouseleave',function(){
			if(onlineStatusList.is(':hidden')){
				onlineStatusWrap.removeClass('online-status-border');	
			}
		});	
			
		onlineStatusBtn.on('click',function(evt){
			//if(onlineStatusList.is(':visible')){
				onlineStatusList.toggle();
			//}else{
			//	onlineStatusList.show();
			//}
			evt.stopPropagation();
		});
		onlineStatusList.find("a").click(function(){
			var aHtml=$(this).html();
			onlineStatusText.val(aHtml);
			onlineStatusText.attr('title',aHtml);
			onlineStatusList.hide();
			onlineStatusText.blur();
		});
		//$(document).click(function(){onlineStatusList.hide();});
        //注册全局点击隐藏
        util.regGlobalClick(onlineStatusList);
		
		var oldValue=currentMember.workingState||"忙碌中，请勿打扰";
		onlineStatusText.val(oldValue).attr('title',oldValue).blur(function(){
			var newValue=$(this).val();
			if(newValue!=oldValue){
				util.api({
					"type": "post",
					"data": {
						"workingState": newValue
						},
					"url": "/Account/UpdateWorkingState",
					"success": function(responseData){
						if (responseData.success) {
                        	
                   	 	}	
					}	
				});
				oldValue=newValue;	
				if(onlineStatusText.val()==""){
					onlineStatusText.attr('title',"请输入工作状态");
				}else{
					onlineStatusText.attr('title',oldValue);
				}
			}	
		});
        */
		
		
        //高亮导航注册
        util.regTplNav($('.tpl-nav-lb',tplLeftEl));
        //注册部门导航路由
        util.tplRouterReg('#department/=/:cid-:value/:ctitle-:value');
        //注册子导航
        util.tplRouterReg($('.files-nav-list .tpl-nav-lb',tplLeftEl));
        //自适应左右边栏位置
        util.autoAdjustPos(tplLeftEl);
        util.autoAdjustPos($('.tpl-r .tpl-inner',tplEl));
        /*
         * 点亮和qq图标
         * TODO: 优化
         */
        (function(root){
            var key = '__FXIAOKE__LIGHTICON__',
                keyseconds = '__FXIAOKE__LIGHTICON__SECONDS__',
                date = new Date(),
                dateArr = [date.getFullYear(), date.getMonth() + 1, date.getDate()],
                storage = root.localStorage || {
                    getItem: function() {return 0;},
                    setItem: function() {},
                    removeItem: function() {}
                };
            
            var $videoEl = $('.tutorials-video-wrap .tv-btn', tplEl),
                $qqEl = $('.right-qq-apv');
            
            
            var storageVal = storage.getItem(key),                    // 记录的当前日期
                storageSecondsVal = storage.getItem(keyseconds) * 1,  // 记录的起始秒速
                curseconds = date.getSeconds(), // 当前秒数
                duration = 0; // 持续时间
            
            
            // 第一次登陆
            if (!storageVal || storageVal != dateArr.join('-')) {
                
                /*
                 * 计算持续秒数
                 */
                if (storageSecondsVal && storageSecondsVal > 0) {
                
                    if (curseconds < storageSecondsVal) {
                        duration = (60 - (curseconds + 60)) + storageSecondsVal;
                    } else {
                        duration = (60 - curseconds) + storageSecondsVal;
                    }
                } else { // 没记录起始秒数
                
                    duration = 60;
                    storage.setItem(keyseconds, curseconds);
                }
                
                
                /*
                 * 点亮图标
                 */
                $videoEl.addClass('tv-btn-active');
                $qqEl.addClass('right-qq-apv-active');
                
                
                /*
                 * 取消点亮
                 */
                setTimeout(function() {
                    $videoEl.removeClass('tv-btn-active');
                    $qqEl.removeClass('right-qq-apv-active');
                    storage.setItem(keyseconds, '-1');
                    storage.setItem(key, dateArr.join('-'));
                }, duration * 1000);
            }
        }(root));          
    };
});