/**
 * 
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
        moment=require('moment'),
        Tabs=require('tabs'),
		Dialog = require('dialog'),
        FeedList=require('modules/feed-list/feed-list'),
        ReplyList=require('modules/fs-reply/fs-reply-list').replyList,
        AttachList=require('modules/fs-attach/fs-attach-list'),
        fsPlanCalendar=require('modules/fs-plan-calendar/fs-plan-calendar');
    var FsPlanCalendar=fsPlanCalendar.FsPlanCalendar,   //日志日历
        ExportPlanDialog=fsPlanCalendar.ExportPlanDialog;   //导出日历弹框
    var fsQx = require('modules/fs-qx/fs-qx.js'); //企信
	//tj dialog
    var pamrkApvTpl=$('.pamrk-apv-tpl');
    var PamrkColleague=Dialog.extend({
        "attrs":{
            width: '580px',
            className:'pamrk-apv-dialog',
            list:null,   //列表组件
            content:'<div class="ui-dialog-title"></div>'+
			'<div class="ui-dialog-text">'+
				'<div class="pamrk-list-wrap">'+
				'<table class="pamrk-list-table" cellspacing="1">'+
					'<tr>'+
						'<th>员工</th>'+
						'<th>响应时间(分钟)</th>'+
						'<th>排名</th>'+
						'<th>趋势</th>'+
					'</tr>'+
					'<tbody class="pamrk-item-wrap">'+
					'</tbody>'+
				'</table>'+
				'</div>'+
				'<div class="pamrk-btn-wrap marg20">'+
					'<button class="f-cancel button-grey f-cancel" data-role="cancel">关闭</button>'+
				'</div>'+
			'</div>'
        },
        "events":{
            "click .f-cancel":"_cancel"
        },
		"renderTable":function(title,responseData,type){
			var elEl=this.element,
				tableWEl=$('.pamrk-item-wrap',elEl);
			var htmlStr="";
			//改变标题
			//this.set('title',title);
			$('.ui-dialog-title',elEl).html(title);
			//渲染表格
			if(responseData.value.rankings.length > 0){
				_.each(responseData.value.rankings,function(data){
					var employeeID = data.employeeID, //员工ID
						employee = data.employee, //员工信息
						employeeName=data.employee.name,
						profileImage=util.getAvatarLink(data.employee.profileImage,3),
						averageMinutes = data.averageMinutes, //平均响应时间
						ranking = data.ranking, //排名
						trend = data.trend, //趋势
						totalCount = data.totalCount; //数量
					var trendHtml='';
					if(trend > 0){
						trendHtml='<img src='+FS.ASSETS_PATH+'/images/arrowup.png />';
					}else if(trend < 0){
						trendHtml='<img src='+FS.ASSETS_PATH+'/images/arrowdown.png />';
					}else{
						trendHtml='-';
					}	
						
					htmlStr+='<tr><td style="text-align:left;padding-left:5px;"><img class="pamrk_tdimg_head" src="'+profileImage+'" width="25" height="25" />'+employeeName+'</td><td>'+averageMinutes+'分钟</td><td>'+ranking+'</td><td>'+trendHtml+'</td></tr>';	
				});
			}
			tableWEl.html(htmlStr);
		},
        "show":function(){
            var result=PamrkColleague.superclass.show.apply(this,arguments);
            return result;
        },
        "hide":function(){
            var result=PamrkColleague.superclass.hide.apply(this,arguments);
            this._clear();
            return result;
        },
        "_clear":function(){
            var elEl=this.element;
			$('.ui-dialog-title',elEl).html('');
			var tableWEl=$('.pamrk-item-wrap',elEl);
			tableWEl.empty();
        },
        "_cancel":function(){
			var elEl=this.element;
			$('.ui-dialog-title',elEl).html('');
			var tableWEl=$('.pamrk-item-wrap',elEl);
			tableWEl.empty();
            this.hide();
        }
    });
    var pamrkColleague=new PamrkColleague(); 
	
	
    var Profile = function () {
        this.tplEl = exports.tplEl;
        this.tplName = exports.tplName;
        this.init();
    };
    _.extend(Profile.prototype, {
        init: function () {
            this.contactDataInit();
            this.centerTopInit();
            this.leftSideBarInit();
            this.rightSideBarInit();
            this.profileTabsInit();
			this.otherInit();
        },
        destroy:function(){
            this.contactDestroy();
            this.centerTopDestroy();
            this.leftSideBarDestroy();
            this.rightSideBarDestroy();
            this.profileTabsDestroy();
            this.feedDestroy();
            this.replyDestroy();
            this.attachDestroy();
            this.tjDestroy();
            this.otherDestroy();
        },
        contactDataInit:function(){
            this.contactData=util.getContactData();
        },
        contactDestroy:function(){
            this.contactData=null;
        },
        centerTopInit:function(){
            var tplEl=this.tplEl,
                centerTopEl=$('.tpl-c',tplEl),
                editProfileLinkEl=$('.edit-user-profile-l',centerTopEl),
                chatLinkEl=$('.chat-l',centerTopEl);   //发企信
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var employeeID=queryParams? queryParams.empid: 0, //获取employeeID
                employeeData;
            var contactData=this.contactData,
                loginUserData=contactData["u"];
            if(employeeID==0||loginUserData.id==employeeID){
                editProfileLinkEl.show();
                chatLinkEl.hide();
            }else{
                employeeData=util.getContactDataById(employeeID,'p');
                editProfileLinkEl.hide();
                if(employeeData){   //保证在职的人才可以发企信
                    chatLinkEl.show();
                    //点击打开chat窗口
                    chatLinkEl.click(function(evt){
                        var chatPanel=fsQx.chatPanel;
                        var queryParams=util.getTplQueryParams();   //传给模板的参数
                        var employeeID=queryParams? queryParams.empid:0; //获取employeeID
                        var participantsIDs,
                            coreData;
                        if(employeeID!=0){
                            participantsIDs=[employeeID,loginUserData.id];
                            coreData={
                                "name":employeeData.name,
                                "profileImage":employeeData.profileImagePath,
                                "participantIds":participantsIDs
                            };
                            chatPanel.addOrUpdateSession({
                                "employeeIds":participantsIDs,
                                "sessionType":"pair",  //讨论组或是双人聊天
                                "data":coreData
                            },true);
                            //fsQx.show();
                            chatPanel.switchPanelStatus("shown",true);
                        }
                        evt.preventDefault();
                        evt.stopPropagation();
                    });
                }else{  //离职隐藏
                    chatLinkEl.hide();
                }

            }
        },
        centerTopDestroy:function(){

        },
        profileTabsInit:function(){
            var that=this;
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl);
            var tabs=new Tabs({
                "element": profileTabsEl,
                "triggers": $('.ui-tab-item',profileTabsEl).removeClass('ui-tab-item-current'),
                "panels": $('.ui-tab-panel',profileTabsEl).hide(),
                "activeIndex": 0,
                "activeTriggerClass":"ui-tab-item-current",
                "triggerType":'click',
                "withTabEffect": false   //取消动画
            }).render();
            //延迟渲染publishTabs里的其他组件
            tabs.on('switched',function(toIndex, fromIndex){
                var curPanelEl = tabs.get('panels').eq(toIndex),
                    action=curPanelEl.attr('action');
                var tplCEl=$('.tpl-c',tplEl),
                    tplREl=$('.tpl-r',tplEl);
                if(!curPanelEl.data('rendered')){
                    that[action+'Init']&&that[action+'Init']();
                    curPanelEl.data('rendered',true);
                }
                if(action=="attach"||action=="tj"){
                    tplCEl.css({
                        "width":"80%"
                    });
                    //隐藏右边栏
                    tplREl.hide();
                    that.planCalendar.hide();
                }else{
                    tplCEl.css({
                        "width":"60%"
                    });
                    tplREl.show();
                    that.planCalendar.show();
                    that.planCalendar.refreshPlanDate(); //重新请求数据，日历show后会重画结构

                }
            });
            tabs.trigger('switched',0,-1);
            //创建引用以供销毁
            this.profileTabs=tabs;
        },
        profileTabsDestroy:function(){
            //清空rendered dom data
            this.profileTabs.get('panels').removeData();
            this.profileTabs.destroy();
            this.profileTabs=null;
        },
        "feedInit":function(){
            var that=this;
            var tplEl=this.tplEl,
                tplName=this.tplName,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.feed-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                feedTypeWEl=$('.feed-type',panelEl),
                subTypeWEl=$('.sub-type',panelEl),
                attachWEl=$('.attach',panelEl),
                searchEl = $('.search-inp', panelEl),
                searchBtnEl = $('.search-btn', panelEl),
                listEl=$('.feed-list',panelEl),
                pagEl=$('.feed-list-pagination',panelEl);
            var contactData=this.contactData,
                currentUserData=contactData["u"];

            var feedList = new FeedList({
                "element": listEl, //list selector
                "pagSelector": pagEl, //pagination selector
                "pagOpts": { //分页配置项
                    "pageSize": 20,
                    "visiblePageNums": 7
                },
                "loadSize": 15,   //单次加载15条记录
                "listPath":"/feed/getFeedsOfOneEmployeeSend",
                "defaultRequestData": function () {
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var feedType=$('.state-active',feedTypeWEl).attr('val'),
                        subType=$('.filter-field',subTypeWEl).filter(':visible').find('.state-active').attr('val')|| 0,
                        feedAttachType=$('.state-active',attachWEl).attr('val');
                    return {
                        "employeeID":employeeID,
                        "feedAttachType":feedAttachType,
                        "subType": subType, //子类型
                        "feedType": feedType,
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
				"searchOpts":{
					"inputSelector":searchEl,
					"btnSelector":searchBtnEl
				},
                "listEmptyText":"没有获取到信息",
                "listSuccessCb":function(responseData){
                    var dataRoot,
                        employeeInfo;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        employeeInfo=dataRoot.fullEmployee;
                        that.renderEmployeeInfo(employeeInfo);
                    }
                }
            });
            feedList.load();
            filterEl.on('click','.feed-type .filter-value',function(evt){
                var meEl=$(this),
                    subTypeName=meEl.attr('subtypename'),
                    subTypeEl=$('.'+subTypeName+'-type',subTypeWEl);
                $('.filter-field',subTypeWEl).hide();
                subTypeEl.length>0&&subTypeEl.show();
                evt.preventDefault();
            }).on('click','.filter-value',function(evt){
                var meEl=$(this),
                    fieldEl=meEl.closest('.filter-value-wrapper');
                $('.filter-value',fieldEl).removeClass('state-active');
                meEl.addClass('state-active');
                    //重新请求feed列表
                    feedList.reload();
                evt.preventDefault();
            });
            //点击搜索reload列表
            searchBtnEl.click(function(evt){
                feedList.reload();
                evt.preventDefault();
            });
            this.feedList=feedList;
        },
        "feedDestroy":function(){
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.feed-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                searchBtnEl = $('.search-btn', panelEl);
            if(this.feedList){
                this.feedList.destroy();
                this.feedList=null;
            }
            //取消事件绑定
            filterEl.off();
            searchBtnEl.unbind();
            //filter条件重新设置
            $('.sub-type .filter-field',filterEl).hide().removeClass('state-active').eq(0).addClass('state-active');
            $('.feed-type .filter-value',filterEl).removeClass('state-active').eq(0).addClass('state-active');
            $('.attach .filter-value',filterEl).removeClass('state-active').eq(0).addClass('state-active');
        },
        "replyInit":function(){
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.reply-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                feedTypeWEl=$('.feed-type',panelEl),
                attachWEl=$('.attach',panelEl),
                searchEl = $('.search-inp', panelEl),
                searchBtnEl = $('.search-btn', panelEl),
                listEl=$('.reply-list',panelEl),
                pagEl=$('.reply-list-pagination',panelEl);
            var contactData=this.contactData,
                currentUserData=contactData["u"];

            var replyList=new ReplyList({
                "element":listEl, //list selector
                "pagSelector":pagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":45,
                    "totalSize":0,
                    "visiblePageNums":7
                },
                "hideReplyBtn":false,    //隐藏回复按钮
                "listPath":"/feed/getFeedReplysOfOneEmployee",
                "defaultRequestData":function(){
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var feedType=$('.state-active',feedTypeWEl).attr('val'),
                        feedAttachType=$('.state-active',attachWEl).attr('val');
                    return {
                        "employeeID":employeeID,
                        "feedAttachType":feedAttachType,
                        "feedType": feedType,
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
				"searchOpts":{
					"inputSelector":searchEl,
					"btnSelector":searchBtnEl
				},
                "replyCb":function(responseData){
                    if(responseData.success){
                        replyList.reload();
                    }
                }
            });
            replyList.load();
            filterEl.on('click','.filter-value',function(evt){
                var meEl=$(this),
                    fieldEl=meEl.closest('.filter-value-wrapper');
                $('.filter-value',fieldEl).removeClass('state-active');
                meEl.addClass('state-active');
                //重新请求reply列表
                replyList.reload();
                evt.preventDefault();
            });
            //点击搜索reload列表
            searchBtnEl.click(function(evt){
                replyList.reload();
                evt.preventDefault();
            });
            this.replyList=replyList;
        },
        replyDestroy:function(){
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.reply-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                searchBtnEl = $('.search-btn', panelEl);
            if(this.replyList){
                this.replyList.destroy();
                this.replyList=null;
            }
            filterEl.off();
            searchBtnEl.unbind();
            //filter条件重新设置
            $('.feed-type .filter-value',filterEl).removeClass('state-active').eq(0).addClass('state-active');
            $('.attach .filter-value',filterEl).removeClass('state-active').eq(0).addClass('state-active');
        },
        "attachInit":function(){
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.attach-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                attachWEl=$('.attach',panelEl),
                searchEl = $('.search-inp', panelEl),
                searchBtnEl = $('.search-btn', panelEl),
                attachListWEl=$('.attach-list-wrapper',panelEl),
                attachListEl=$('.attach-list',panelEl),
                attachPagEl=$('.attach-list-pagination',panelEl),
                imgListWEl=$('.img-list-wrapper',panelEl),
                imgListEl=$('.img-list',panelEl),
                imgPagEl=$('.img-list-pagination',panelEl),
                audioListWEl=$('.audio-list-wrapper',panelEl),
                audioListEl=$('.audio-list',panelEl),
                audioPagEl=$('.audio-list-pagination',panelEl);
            var contactData=this.contactData,
                currentUserData=contactData["u"];
            /**
             * 重新刷新当前列表
             */
            var reloadCurrentList=function(){
                var feedAttachType=$('.state-active',attachWEl).attr('val');
                if(feedAttachType=="2"){    //2是图片
                    attachListWEl.hide();
                    audioListWEl.hide();
                    imgListWEl.show();
                    imgList.reload();
                }else if(feedAttachType=="3"){  //3是文件
                    imgListWEl.hide();
                    audioListWEl.hide();
                    attachListWEl.show();
                    attachList.reload();
                }else if(feedAttachType=="1"){  //1是录音
                    imgListWEl.hide();
                    attachListWEl.hide();
                    audioListWEl.show();
                    audioList.reload();
                }
            };

            var attachList=new AttachList({
                "element":attachListEl, //list selector
                "pagSelector":attachPagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":15,
                    "visiblePageNums":7
                },
                "attachType":"attach", //请求文件类型的附件
                "listPath":"/attach/getAttachFilesOfOneEmployeeSend", //获取某人发出的附件
                "loadSize":15,   //单次加载15条记录
                "defaultRequestData":function(){
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var feedAttachType=$('.state-active',attachWEl).attr('val');
                    var searchEl=$('.search-inp',attachListWEl);
                    return {
                        "employeeID":employeeID,
                        "attachType":feedAttachType,
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
				"searchOpts":{
					"inputSelector":$('.search-inp',attachListWEl),
					"btnSelector":$('.search-btn',attachListWEl)
				}, //默认请求数据
                "showSenderName":false //不显示发送人
            }),imgList=new AttachList({
                "element":imgListEl, //list selector
                "pagSelector":imgPagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":12,
                    "visiblePageNums":7
                },
                "attachType":"img", //请求文件类型的附件
                "listPath":"/attach/getAttachFilesOfOneEmployeeSend", //获取某人发出的附件
                "loadSize":15,   //单次加载15条记录
                "defaultRequestData":function(){
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var feedAttachType=$('.state-active',attachWEl).attr('val');
                    var searchEl=$('.search-inp',imgListWEl);
                    return {
                        "employeeID":employeeID,
                        "attachType":feedAttachType,
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
                "searchOpts":{
                    "inputSelector":$('.search-inp',imgListWEl),
                    "btnSelector":$('.search-btn',imgListWEl)
                }, //默认请求数据
                "showSenderName":false //不显示发送人
            }),audioList=new AttachList({
                "element":audioListEl, //list selector
                "pagSelector":audioPagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":15,
                    "visiblePageNums":7
                },
                "attachType":"audio", //请求文件类型的附件
                "listPath":"/attach/getAttachFilesOfOneEmployeeSend", //获取某人发出的录音
                "loadSize":15,   //单次加载15条记录
                "defaultRequestData":function(){
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var feedAttachType=$('.state-active',attachWEl).attr('val');
                    var searchEl=$('.search-inp',audioListWEl);
                    return {
                        "employeeID":employeeID,
                        "attachType":feedAttachType,
                        "keyword": _.str.trim(searchEl.val())
                    };
                },
                "searchOpts":{
                    "inputSelector":$('.search-inp',audioListWEl),
                    "btnSelector":$('.search-btn',audioListWEl)
                }, //默认请求数据
                "showSenderName":false //不显示发送人
            });
            //默认打开请求图片列表
            imgList.load();
            //点击搜索reload列表
            searchBtnEl.click(function(evt){
                reloadCurrentList();
                evt.preventDefault();
            });
            filterEl.on('click','.filter-value',function(evt){
                var meEl=$(this),
                    fieldEl=meEl.closest('.filter-value-wrapper');
                var feedAttachType=meEl.attr('val');
                $('.filter-value',fieldEl).removeClass('state-active');
                meEl.addClass('state-active');
                //重新请求列表
                reloadCurrentList();
                evt.preventDefault();
            });
            this.attachList=attachList;
            this.imgList=imgList;
            this.audioList=audioList;
        },
        attachDestroy:function(){
            var tplEl=this.tplEl,
                profileTabsEl=$('.profile-tabs',tplEl),
                panelEl=$('.attach-panel',profileTabsEl),
                filterEl=$('.filter',panelEl),
                searchBtnEl = $('.search-btn', panelEl);
            if(this.attachList){
                this.attachList.destroy();
                this.attachList=null;
            }
            if(this.imgList){
                this.imgList.destroy();
                this.imgList=null;
            }
            if(this.audioList){
                this.audioList.destroy();
                this.audioList=null;
            }
            //取消事件绑定
            searchBtnEl.unbind();
            filterEl.off();
            //filter条件重新设置
            $('.attach .filter-value',filterEl).removeClass('state-active').eq(0).addClass('state-active');
        },
        /**
         * 实际个人资料的tab panel的render
         */
        renderEmployeeInfo:function(employeeInfo){
            var tplEl=this.tplEl,
                userPanelEl=$('.userinfo-panel',tplEl);
            var cenUserInfoWrapEl=$('.cen-user-info-wrap',userPanelEl),
                cenUserInfoWrapTpl=$('.cen-user-info-tpl',userPanelEl),
                cenUserInfoCompiled=_.template(cenUserInfoWrapTpl.html());
            var gender=employeeInfo.gender,
				department=employeeInfo.department,
				post=employeeInfo.post,
				qq=employeeInfo.qq,
                msn=employeeInfo.msn,
				email=employeeInfo.email,
				tel=employeeInfo.tel,
				mobile=employeeInfo.mobile,
				description=employeeInfo.description;
			if(gender=='M'){
				gender="男";
			}else{
				gender="女";
			}
            var cenUserInfoHtml=cenUserInfoCompiled({
                "gender":gender,
				"department":department,
				"post":post,
				"qq":qq,
                "msn":msn,
				"email":email,
				"tel":tel,
				"mobile":mobile,
				"description":description
            });
            cenUserInfoWrapEl.html(cenUserInfoHtml);
            //cenUserInfoWrapTpl.remove();
            //中上部提示用户手机号
            $('.tpl-c .employee-mobile',tplEl).html(mobile);
            //上中部提示用户所属部门和职位
			if(post != "" && department != ""){
				$('.tpl-c .circle-job',tplEl).html(post+'-'+department);
			}else{
				$('.tpl-c .circle-job',tplEl).html(post+department);
			}
            
        },
        userinfoInit:function(){}, //个人资料tab初始化占位
        userinfoDestroy:function(){}, //个人资料tab destroy占位
        tjInit:function(){
			var tplEl=this.tplEl,
                tjPanelEl=$('.tj-panel',tplEl),
                yearSelectEl=$('.year-select',tjPanelEl);
            var contactData=this.contactData,
                currentUserData=contactData["u"];
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
            var tjPersonListWrapEl=$('.tjp-person-wrap',tplEl),
                tjPersonListWrapTpl=$('.tjp-person-list-tpl',tplEl),
                tjPersonListCompiled=_.template(tjPersonListWrapTpl.html());
            var tjManageListWrapEl=$('.tjp-manage-wrap',tplEl),
                tjManageListWrapTpl=$('.tjp-manage-list-tpl',tplEl),
                tjManageListCompiled=_.template(tjManageListWrapTpl.html());
            //设置年份
            var nowYear=moment(new Date()).year(),
                htmlStr='';
            for (var i = nowYear-2,len=nowYear; i < len; i++) {   //拼接前两年
                htmlStr+='<option value="'+i+'">'+i+'年</option>';
            }
            htmlStr+='<option value="'+nowYear+'" selected="selected">'+nowYear+'年</option>'; //今年
            htmlStr+='<option value="'+(nowYear+1)+'">'+(nowYear+1)+'年</option>';   //下一年
            yearSelectEl.html(htmlStr);

            yearSelectEl.change(function(){
                util.api({
                    "url":"/statistic/getMonthStatisticInfoByEmployeeID",
                    "data":{
                        "employeeID":employeeID,
                        "year":yearSelectEl.val()
                    },
                    "type":"get",
                    "success":function(responseData){
                        var dataRoot;
                        if(responseData.success){
                            //table 个人工作效率分析表 rander
                            var tjPersonListHtml="";
                            var tjManageListHtml="";
                            var rv;
                            dataRoot=responseData.value;
                            rv=dataRoot.items;
							if(rv.length>0){
								tjPanelEl.find('.list-empty-tip').hide();
							}else{
								tjPanelEl.find('.list-empty-tip').show();
							}
                            rv.reverse();   //反转
                            if(rv.length>0){
                                //定义合计
                                var shareTcount=0,
                                    planTcount=0,
									planTnumber=0,
                                    planCountAvg=0,
									workTnumber=0,
									workCcount=0,
                                    workCountAvg=0,
                                    workCompleteTCount=0,
                                    workTimeoverCompleteTCount=0;
                                var planAmTCount=0,
                                    workAmTCount=0,
                                    approveAmTCount=0,
                                    planAMRkTCount=0,
                                    workAMRkTCount=0,
                                    approveAMRkTCount=0;

                                _.each(rv,function(data){
                                    var month=data.month+'月',
                                        shareTotalCount=data.shareTotalCount,
                                        planTotalCount=data.planTotalCount,
                                        planCommentCount=data.planCommentCount,
                                        planTotalNumber=data.planTotalNumber,
                                        workTotalNumber=data.workTotalNumber,
                                        workCompleteTotalCount=data.workCompleteTotalCount,
                                        workTimeoverCompleteTotalCount=data.workTimeoverCompleteTotalCount,
                                        planAverageMinutes=data.planAverageMinutes,
                                        workAverageMinutes=data.workAverageMinutes,
                                        approveAverageMinutes=data.approveAverageMinutes,
                                        approveTotalCount=data.approveTotalCount,
                                        workCommentCount=data.workCommentCount,
                                        approveAverageMinuteRanking=data.approveAverageMinuteRanking,
                                        planAverageMinuteRanking=data.planAverageMinuteRanking,
                                        workAverageMinuteRanking=data.workAverageMinuteRanking;

                                    var planAvg=0,
                                        workAvg=0;
                                    if(planTotalCount != 0){
                                        planAvg=parseInt(planTotalNumber) / parseInt(planTotalCount);
                                    }else{
                                        planAvg=0;
                                    }
                                    if(workCompleteTotalCount != 0){
                                        workAvg=parseInt(workTotalNumber) / parseInt(workCompleteTotalCount);
                                    }else{
                                        workAvg=0;
                                    }
                                    var planStarImgName;
                                    if(planAvg < 0.5){
                                        planStarImgName="star0";
                                    }else if(planAvg < 1){
                                        planStarImgName="star0.5";
                                    }else if(planAvg < 1.5){
                                        planStarImgName="star1";
                                    }else if(planAvg < 2){
                                        planStarImgName="star1.5";
                                    }else if(planAvg < 2.5){
                                        planStarImgName="star2";
                                    }else if(planAvg < 3){
                                        planStarImgName="star2.5";
                                    }else if(planAvg < 3.5){
                                        planStarImgName="star3";
                                    }else if(planAvg < 4){
                                        planStarImgName="star3.5";
                                    }else if(planAvg < 4.5){
                                        planStarImgName="star4";
                                    }else if(planAvg < 5){
                                        planStarImgName="star4.5";
                                    }else if(planAvg < 5.5){
                                        planStarImgName="star5";
                                    }
                                    var workStarImgName;
                                    if(workAvg < 0.5){
                                        workStarImgName="star0";
                                    }else if(workAvg < 1){
                                        workStarImgName="star0.5";
                                    }else if(workAvg < 1.5){
                                        workStarImgName="star1";
                                    }else if(workAvg < 2){
                                        workStarImgName="star1.5";
                                    }else if(workAvg < 2.5){
                                        workStarImgName="star2";
                                    }else if(workAvg < 3){
                                        workStarImgName="star2.5";
                                    }else if(workAvg < 3.5){
                                        workStarImgName="star3";
                                    }else if(workAvg < 4){
                                        workStarImgName="star3.5";
                                    }else if(workAvg < 4.5){
                                        workStarImgName="star4";
                                    }else if(workAvg < 5){
                                        workStarImgName="star4.5";
                                    }else if(workAvg < 5.5){
                                        workStarImgName="star5";
                                    }
									//数量为0转换 - 
									if(shareTotalCount==0){
										shareTotalCount='-';
									}
									if(planTotalCount==0){
										planTotalCount='-';
									}
									if(workCompleteTotalCount==0){
										workCompleteTotalCount='-';
									}
									if(workTimeoverCompleteTotalCount==0){
										workTimeoverCompleteTotalCount='-';
									}
									
                                    tjPersonListHtml+=tjPersonListCompiled({
                                        "month":month,
                                        "shareTotalCount":shareTotalCount,
                                        "planTotalCount":planTotalCount,
                                        "planStarImgName":planStarImgName,
                                        "workStarImgName":workStarImgName,
                                        "planTotalCount":planTotalCount,
                                        "workCompleteTotalCount":workCompleteTotalCount,
                                        "workTimeoverCompleteTotalCount":workTimeoverCompleteTotalCount
                                    });

                                    //合计
									if(shareTotalCount=='-'){
										shareTotalCount=0;
									}
									if(planTotalCount=='-'){
										planTotalCount=0;
									}
									if(workCompleteTotalCount=='-'){
										workCompleteTotalCount=0;
									}	
									if(workTimeoverCompleteTotalCount=='-'){
										workTimeoverCompleteTotalCount=0;
									}		
									
                                    shareTcount+=parseInt(shareTotalCount);
                                    planTcount+=parseInt(planTotalCount);
									planTnumber+=parseInt(planTotalNumber);
                                    //table 日志平均分
                                    planCountAvg+=parseInt(planAvg);
									
                                    //table 任务平均分
                                    workCountAvg+=workAvg;
									workTnumber+=parseInt(workTotalNumber);
									workCcount+=parseInt(workCommentCount);
                                    workCompleteTCount+=parseInt(workCompleteTotalCount);
                                    workTimeoverCompleteTCount+=parseInt(workTimeoverCompleteTotalCount);
									
                                    //table 管理效率分析表 rander
                                    if (approveTotalCount != 0){
                                        approveAverageMinutes = approveAverageMinutes / approveTotalCount;
                                    }else{
                                        approveAverageMinutes = 0;
                                    }
                                    if (planCommentCount != 0){
                                        planAverageMinutes = planAverageMinutes / planCommentCount;
                                    }else{
                                        planAverageMinutes = 0;
                                    }
                                    if (workCommentCount != 0){
                                        workAverageMinutes = workAverageMinutes / workCommentCount;
                                    }else{
                                        workAverageMinutes = 0;
                                    }
									//判断点击响应时间是否为0
									if(planAverageMinutes==0){
										planAverageMinutes='-';
									}else{
										planAverageMinutes=parseInt(planAverageMinutes)+'分钟';
									}
									if(workAverageMinutes==0){
										workAverageMinutes='-';
									}else{
										workAverageMinutes=parseInt(workAverageMinutes)+'分钟';
									}
									if(approveAverageMinutes==0){
										approveAverageMinutes='-';
									}else{
										approveAverageMinutes=parseInt(approveAverageMinutes)+'分钟';
									}
									
                                    tjManageListHtml+=tjManageListCompiled({
                                        "month":month,
                                        "planAverageMinutes":planAverageMinutes,
                                        "workAverageMinutes":workAverageMinutes,
                                        "approveAverageMinutes":approveAverageMinutes,
                                        "planAverageMinuteRanking":planAverageMinuteRanking,
                                        "workAverageMinuteRanking":workAverageMinuteRanking,
                                        "approveAverageMinuteRanking":approveAverageMinuteRanking
                                    });

                                    //合计
                                    planAmTCount+=parseInt(planAverageMinutes);
									workAmTCount+=parseInt(workAverageMinutes);
									approveAmTCount+=parseInt(approveAverageMinutes);
									planAMRkTCount+=parseInt(planAverageMinuteRanking);
                                    workAMRkTCount+=parseInt(workAverageMinuteRanking);
                                    approveAMRkTCount+=parseInt(approveAverageMinuteRanking);

                                });
                                tjPersonListWrapEl.empty();
                                tjManageListWrapEl.empty();
                                tjPersonListWrapEl.append(tjPersonListHtml);
                                tjManageListWrapEl.append(tjManageListHtml);
                                //渲染合计
								if(shareTcount==0){
									shareTcount='-';
								}
								if(planTcount==0){
									planTcount='-';
								}
                                $('#shareTcount').html(shareTcount);
                                $('#planTcount').html(planTcount);
								
								if(shareTcount=='-'){
									shareTcount=0;
								}
								if(planTcount=='-'){
									planTcount=0;
								}
								
                                var planAmTCountAvg=planAmTCount/rv.length,
									planAMRkTCountAvg=planAMRkTCount/rv.length,
									workAmTCountAvg=workAmTCount/rv.length,
									workAMRkTCountAvg=workAMRkTCount/rv.length,
									approveAmTCountAvg=approveAmTCount/rv.length,
									approveAMRkTCountAvg=approveAMRkTCount/rv.length;
								var planTCountAvg;
								if(planTcount != 0){
									planTCountAvg=planTnumber/planTcount;
								}else{
									planTCountAvg=0;
								}
                                var planCountStarImgName;
                                if(planTCountAvg < 0.5){
                                    planCountStarImgName="star0";
                                }else if(planTCountAvg < 1){
                                    planCountStarImgName="star0.5";
                                }else if(planTCountAvg < 1.5){
                                    planCountStarImgName="star1";
                                }else if(planTCountAvg < 2){
                                    planCountStarImgName="star1.5";
                                }else if(planTCountAvg < 2.5){
                                    planCountStarImgName="star2";
                                }else if(planTCountAvg < 3){
                                    planCountStarImgName="star2.5";
                                }else if(planTCountAvg < 3.5){
                                    planCountStarImgName="star3";
                                }else if(planTCountAvg < 4){
                                    planCountStarImgName="star3.5";
                                }else if(planTCountAvg < 4.5){
                                    planCountStarImgName="star4";
                                }else if(planTCountAvg < 5){
                                    planCountStarImgName="star4.5";
                                }else if(planTCountAvg < 5.5){
                                    planCountStarImgName="star5";
                                }
                                $('#plansrathtml').html('<img src="../../html/fs/assets/images/rating/'+planCountStarImgName+'.png" />');
                                var workTCountAvg;
								if (workCcount !=0){
									workTCountAvg=workTnumber/workCcount;
								}else{
									workTCountAvg=0;
								}
                                var workCountStarImgName;
                                if(workTCountAvg < 0.5){
                                    workCountStarImgName="star0";
                                }else if(workTCountAvg < 1){
                                    workCountStarImgName="star0.5";
                                }else if(workTCountAvg < 1.5){
                                    workCountStarImgName="star1";
                                }else if(workTCountAvg < 2){
                                    workCountStarImgName="star1.5";
                                }else if(workTCountAvg < 2.5){
                                    workCountStarImgName="star2";
                                }else if(workTCountAvg < 3){
                                    workCountStarImgName="star2.5";
                                }else if(workTCountAvg < 3.5){
                                    workCountStarImgName="star3";
                                }else if(workTCountAvg < 4){
                                    workCountStarImgName="star3.5";
                                }else if(workTCountAvg < 4.5){
                                    workCountStarImgName="star4";
                                }else if(workTCountAvg < 5){
                                    workCountStarImgName="star4.5";
                                }else if(workTCountAvg < 5.5){
                                    workCountStarImgName="star5";
                                }
								
								if(workCompleteTCount==0){
									workCompleteTCount='-';
								}
								if(workTimeoverCompleteTCount==0){
									workTimeoverCompleteTCount='-';
								}
								
                                $('#worksrathtml').html('<img src="../../html/fs/assets/images/rating/'+workCountStarImgName+'.png" />');
                                $('#workCompleteTCount').html(workCompleteTCount);
                                $('#workTimeoverCompleteTCount').html(workTimeoverCompleteTCount);

                                $('#planAmTCount').html('-');
                                $('#workAmTCount').html('-');
                                //$('#approveAmTCount').html(approveAmTCountAvg);
								$('#approveAmTCount').html('-');
                                $('#planAMRkTCount').html(parseInt(planAMRkTCountAvg));
                                $('#workAMRkTCount').html(parseInt(workAMRkTCountAvg));
                                $('#approveAMRkTCount').html(parseInt(approveAMRkTCountAvg));
                            }else{  //空值清理列表
                                $('#worksrathtml').empty();
                                $('#workCompleteTCount').empty();
                                $('#workTimeoverCompleteTCount').empty();

                                $('#planAmTCount').empty();
                                $('#workAmTCount').empty();
                                $('#approveAmTCount').empty('-');
                                $('#planAMRkTCount').empty();
                                $('#workAMRkTCount').empty();
                                $('#approveAMRkTCount').empty();

                                tjPersonListWrapEl.empty();
                                tjManageListWrapEl.empty();
                                $('.person-eff .total-summary tr span',tplEl).empty();  //总数清空
                            }
                        }
                    }
                });
            }).change();
			//公司效率排名 点击事件
			var personEffTable=$('.person-eff',tplEl);
			personEffTable.on('click','.pamrk-adialog',function(){
				var meEl=$(this),
					type=meEl.attr('type'),
					year=$('.year-select',tplEl).val(),
					month=parseInt(meEl.attr('month'));
				var typeName='';
				if(type==1){
					typeName='日志';
				}else if(type==2){
					typeName='指令';
				}else{
					typeName='审批';
				}	
				var	title=year+'年'+month+'月'+typeName+'点评响应时间排名';
				util.api({
					"type":"get",
               		"data":{rankingType:type,year:year,month:month},
                	"url":"/Statistic/GetYearMonthStatisticByRanking",
					"success":function(responseData){
						pamrkColleague.show();	
						pamrkColleague.renderTable(title,responseData,type);		
					}	
				});
				
			});
        },
        tjDestroy:function(){
            var tplEl=this.tplEl,
                tjPanelEl=$('.tj-panel',tplEl),
                yearSelectEl=$('.year-select',tjPanelEl);
            //取消事件注册
            yearSelectEl.unbind('change');
        },
        leftSideBarInit:function(){
			var that=this;
            var tplEl=this.tplEl,
				tplLeftEl=$('.tpl-l',tplEl),
                lefthImgWrapEl=$('.head-img-wrap',tplEl),
                nodisturbEl=$('.nodisturb',tplLeftEl),  //免打扰设置
                smsAlertEl=$('.sms-alert',tplLeftEl);   //短信提醒设置
            var contactData=this.contactData,
                loginUserData=contactData["u"];
            //render左边栏信息
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var employeeID=queryParams? queryParams.empid:loginUserData.id; //获取employeeID

            var userInfoWrapEl=$('.puser-left-info-wrap',tplEl),
                userInfoWrapTpl=$('.puser-left-info-tpl',tplEl),
                userInfoCompiled=_.template(userInfoWrapTpl.html());
            util.api({
                "type":"get",
                "data":{employeeID:employeeID},
                "url":"/statistic/getStatisticInfoByEmployeeID",
                "success":function(responseData){
                    var dataRoot,
                        smsNotDisturb,
                        feedPlanRemaidObject,
                        employeeData;
                    var userInfoHtml="";
                    if(responseData.success){
                        //render 左侧栏 用户关联信息
                        dataRoot= responseData.value;
                        smsNotDisturb=dataRoot.smsNotDisturb;
                        feedPlanRemaidObject=dataRoot.feedPlanRemaidObject;
                        employeeData=dataRoot.employee;
                        //员工头像信息
                        lefthImgWrapEl.html('<img class="fn-left" src="'+util.getAvatarLink(employeeData.profileImage,1)+'" />');
                        var rvs=dataRoot.statistic;
                        var shareTotalCount=rvs.shareTotalCount,
                            planTotalNumber=rvs.planTotalNumber,
                            planTotalCount=rvs.planTotalCount,
                            planCommentCount=rvs.planCommentCount,
                            planAverageMinutes=rvs.planAverageMinutes,
                            workCompleteTotalCount=rvs.workCompleteTotalCount,
                            workTimeoverCompleteTotalCount=rvs.workTimeoverCompleteTotalCount,
                            workTotalNumber=rvs.workTotalNumber,
                            workCommentCount=rvs.workCommentCount,
                            workAverageMinutes=rvs.workAverageMinutes,
                            approveTotalCount=rvs.approveTotalCount,
                            approveAverageMinutes=rvs.approveAverageMinutes;
                        if (approveTotalCount != 0){
                            approveAverageMinutes = approveAverageMinutes / approveTotalCount;
                        }else{
                            approveAverageMinutes = 0;
                        }
                        if (planCommentCount != 0){
                            planAverageMinutes = planAverageMinutes / planCommentCount;
                        }else{
                            planAverageMinutes = 0;
                        }
                        if (workCommentCount != 0){
                            workAverageMinutes = workAverageMinutes / workCommentCount;
                        }else{
                            workAverageMinutes = 0;
                        }
                        var workCompletePrencet,
                            planAvg,
                            workAvg;
                        if(workCompleteTotalCount != 0){
                            workCompletePrencet=100.0 * parseFloat(workCompleteTotalCount - workTimeoverCompleteTotalCount) / workCompleteTotalCount;
                        }else{
                            workCompletePrencet=0;
                        }
                        if(planTotalCount != 0){
                            planAvg=1.0 * planTotalNumber / planTotalCount;
                        }else{
                            planAvg=0;
                        }
                        if(workCompleteTotalCount != 0){
                            workAvg=1.0 * workTotalNumber / workCompleteTotalCount;
                        }else{
                            workAvg=0;
                        }
                        var planStarImgName;
                        if(planAvg < 0.5){
                            planStarImgName="star0";
                        }else if(planAvg < 1){
                            planStarImgName="star0.5";
                        }else if(planAvg < 1.5){
                            planStarImgName="star1";
                        }else if(planAvg < 2){
                            planStarImgName="star1.5";
                        }else if(planAvg < 2.5){
                            planStarImgName="star2";
                        }else if(planAvg < 3){
                            planStarImgName="star2.5";
                        }else if(planAvg < 3.5){
                            planStarImgName="star3";
                        }else if(planAvg < 4){
                            planStarImgName="star3.5";
                        }else if(planAvg < 4.5){
                            planStarImgName="star4";
                        }else if(planAvg < 5){
                            planStarImgName="star4.5";
                        }else if(planAvg < 5.5){
                            planStarImgName="star5";
                        }
                        var workStarImgName;
                        if(workAvg < 0.5){
                            workStarImgName="star0";
                        }else if(workAvg < 1){
                            workStarImgName="star0.5";
                        }else if(workAvg < 1.5){
                            workStarImgName="star1";
                        }else if(workAvg < 2){
                            workStarImgName="star1.5";
                        }else if(workAvg < 2.5){
                            workStarImgName="star2";
                        }else if(workAvg < 3){
                            workStarImgName="star2.5";
                        }else if(workAvg < 3.5){
                            workStarImgName="star3";
                        }else if(workAvg < 4){
                            workStarImgName="star3.5";
                        }else if(workAvg < 4.5){
                            workStarImgName="star4";
                        }else if(workAvg < 5){
                            workStarImgName="star4.5";
                        }else if(workAvg < 5.5){
                            workStarImgName="star5";
                        }
						//判断左侧点击响应时间是否为0
						if(planAverageMinutes==0){
							planAverageMinutes='-';
						}else{
							planAverageMinutes=parseInt(planAverageMinutes)+'分钟';
						}
						if(workAverageMinutes==0){
							workAverageMinutes='-';
						}else{
							workAverageMinutes=parseInt(workAverageMinutes)+'分钟';
						}
						if(approveAverageMinutes==0){
							approveAverageMinutes='-';
						}else{
							approveAverageMinutes=parseInt(approveAverageMinutes)+'分钟';
						}
                        userInfoHtml=userInfoCompiled({
                            "shareTotalCount":shareTotalCount,
                            "planStarImgName":planStarImgName,
                            "planAverageMinutes":planAverageMinutes,
                            "workCompletePrencet":workCompletePrencet.toFixed(2),
                            "workStarImgName":workStarImgName,
                            "workAverageMinutes":workAverageMinutes,
                            "approveAverageMinutes":approveAverageMinutes
                        });
                        userInfoWrapEl.html(userInfoHtml);
						//点击查看详细数据链到统计表
						$('.show-tj-detail-l',tplLeftEl).click(function(evt){
							that.profileTabs.switchTo(4);
							evt.preventDefault();
						});

                        //免打扰状态
                        if(smsNotDisturb.length>0){
                            smsNotDisturb=smsNotDisturb.split(',');
                            nodisturbEl.html('免打扰 <strong class="color-blue">'+smsNotDisturb[0]+':00~'+smsNotDisturb[1]+':00</strong>');
                        }else{
                            nodisturbEl.html('未设置免打扰');
                        }
                        //短信提醒状态
                        if(feedPlanRemaidObject&&feedPlanRemaidObject.weekShow){
                            smsAlertEl.html('日志短信提醒时间<br/><strong class="color-blue">'+feedPlanRemaidObject.weekShow+'</strong><br/><strong class="color-blue">'+feedPlanRemaidObject.monthShow+'</strong>');
                        }else{
                            smsAlertEl.html('还没有设置短信提醒');
                        }
                        //工作状态提示
                        $('.tpl-c .working-state',tplEl).html(dataRoot.employee.workingState);
                        //员工名称
                        $('.tpl-c .employee-name',tplEl).html(dataRoot.employee.name);
                    }
                }
            });
        },
        leftSideBarDestroy:function(){
            //依赖jquery的dom覆盖
        },
        rightSideBarInit:function(){
            var tplEl=this.tplEl;
            var holderEl = $('.plan-calendar', tplEl),
                qdCountEl=$('.r-map-count',tplEl),
                qdTipEl=$('.r-map-sign-wrap',tplEl),
                exportPlanLinkEl=$('.export-plan-l',tplEl);
            var contactData=this.contactData,
                currentUserData=contactData["u"];
            var planCalendar=new FsPlanCalendar({
                "trigger": holderEl,
                "listDefaultRequest":function(){    //获取日志列表的附加参数
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    return {
                        "employeeID":employeeID
                    };
                },
                "refreshDefaultRequest":function(){ //获取选定时间的附加参数
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    return {
                        "employeeID":employeeID
                    };
                },
                "refreshCb":function(responseData){
                    var queryParams=util.getTplQueryParams();   //传给模板的参数
                    var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
                    var dataRoot;
                    if(responseData.success){
                        dataRoot=responseData.value;
                        //填充签到次数
                        qdCountEl.text(dataRoot.totalLocationCount);
                        if(dataRoot.totalLocationCount>0){
                            qdTipEl.addClass('map-flag').html('<a href="#profile/profilelocations/=/id-'+employeeID+'" title="">&nbsp;</a>');
                        }else{
                            qdTipEl.removeClass('map-flag').text("没有签到信息 ");
                        }
                    }
                }
            });
            planCalendar.refreshPlanDate();
            this.planCalendar=planCalendar;
            //导出日志
            var queryParams=util.getTplQueryParams();   //传给模板的参数
            var employeeID=queryParams? queryParams.empid:currentUserData.id; //获取employeeID
            this.exportPlan=new ExportPlanDialog({
                "trigger":exportPlanLinkEl,
                "employeeId":employeeID
            });
        },
        rightSideBarDestroy:function(){
            this.planCalendar&&this.planCalendar.destroy();
            this.exportPlan&&this.exportPlan.destroy();
        },
        /**
         * 初始化其他补充信息
         */
        otherInit:function(){
        },
        otherDestroy:function(){

        }

    });
	
	    
    exports.init=function(){
        var tplEl=exports.tplEl,
            tplName=exports.tplName;
        var profile;
		
        //切换到当前模板后重新加载feedlist
        /*tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                //清空全局搜索框
                $('#global-search').val("");
                if(profile){
                    profile.destroy();
                }
                profile=new Profile();
            }else{
                profile&&profile.feedList&&profile.feedList.loadKill();
            }
        });*/
        profile=new Profile();
        var destroy=function(){
            profile.destroy();
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
    };
});