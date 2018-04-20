/**
 * 部门模板逻辑依赖
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {

    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        store=tpl.store,
        tplEvent=tpl.event;
    var util=require('util'),
	    moment = require('moment'),
		portalTpl=require('modules/left-list/left-list.html'),
        Dialog=require('dialog'),
        Tabs=require('tabs'),
        FeedList=require('modules/feed-list/feed-list'),
        fsReplyList=require('modules/fs-reply/fs-reply-list');
		
	var portalTplEl=$(portalTpl),
	    leftManageHtml=portalTplEl.filter('.home-left-list').html(),
		leftCirclesHtml=portalTplEl.filter('.circles-left-list').html(),
		leftWorkHtml=portalTplEl.filter('.work-left-list').html(),
		leftApproveHtml=portalTplEl.filter('.approve-left-list').html(),
		leftPlanHtml=portalTplEl.filter('.plan-left-list').html(),
		leftSearchHtml=portalTplEl.filter('.search-left-list').html(),
		leftSearchcolleaguesHtml=portalTplEl.filter('.search-colleagues-left-list').html();
	
    var exec={};
    _.extend(exec,{

        "common":function(){
            var tplEl = exports.tplEl;
            $('.files-nav-list', tplEl).html(leftManageHtml);
            $('.circles-nav-list', tplEl).html(leftCirclesHtml);
            $('.work-nav-list', tplEl).html(leftWorkHtml);
            $('.approve-nav-list', tplEl).html(leftApproveHtml);
            $('.plan-nav-list', tplEl).html(leftPlanHtml);
            $('.search-nav-list', tplEl).html(leftSearchHtml);
            $('.search-colleagues-nav-list', tplEl).html(leftSearchcolleaguesHtml);

            $(".depw-menu li").find(">a").bind("click",function () {
                $(".depw-menu li").find(">a").removeClass("depw-menu-aon");
                $(this).addClass("depw-menu-aon");
                if ($(this).attr("id") == "eff-inf") {
                    $(".tpl-c").width("80%");
                    $(".tpl-r").hide();
                    $("#profile-work").hide();
                    $("#profile-eff").show();
                } else {
                    $(".tpl-c").width("");
                    $(".tpl-r").show();
                    $("#profile-work").show();
                    $("#profile-eff").hide();
                }
            });
            //高亮对应的左侧导航
            var hash = window.location.hash;
            $('.files-nav-item a', tplEl).each(function () {
                var href = $(this).attr('href');
                if (href == hash) {
                    $(this).addClass('tpl-nav-lbon');
                }
            });
            //注册子路由
            util.tplRouterReg($('.tpl-nav-l', tplEl));
            util.tplRouterReg($('.tpl-nav-lb', tplEl));
			
			//左侧头像显示信息
			var tplEl = exports.tplEl;
			var contactData=FS.getAppStore('contactData');
			//render当前登录用户信息
			var currentMember=contactData.currentMember;
			var headImgWrapEl=$('.head-img-wrap',tplEl),
				headImgWrapTpl=$('.head-img-wrap-tpl',headImgWrapEl).html(),   //获取模板
				headImgWrapCompiled=_.template(headImgWrapTpl); //模板编译方法
			var htmlStr=headImgWrapCompiled({
				"userName":currentMember.name,
				"profileImage":currentMember.profileImage
			});
			//重新渲染到页面
			headImgWrapEl.html(htmlStr);
        },

        "leftDepartment":function(){
            var tplEl = exports.tplEl;

            //var contactData=FS.getAppStore('contactData');
            var contactData=util.getContactData();
            //var currentMember=contactData.currentMember;
            var currentMember=contactData["u"];
            //render 部门
            var groupListEl=$('.group-list',tplEl),
                groupItemTplEl=$('.group-item-tpl',groupListEl),
                groupItemTpl=groupItemTplEl.html(),   //获取模板
                groupItemCompiled=_.template(groupItemTpl); //模板编译方
            var groupsData=contactData.groups,
                currentUserGroupIds=currentMember.groupIDs;
            var htmlStr="";
            _.each(currentUserGroupIds,function(groupId){
                var groupData=_.find(groupsData,function(data){
                    return data.id==groupId;
                });
                htmlStr+=groupItemCompiled({
                    groupName:groupData.name,
                    groupID:groupData.id,
                    cTitle:groupData.name
                });
            });
            //重新渲染回页面
            groupListEl.append(htmlStr);
            //删除模版
            groupItemTplEl.remove();
            //注册部门导航路由
            util.tplRouterReg('#department/=/:cid-:value/:ctitle-:value');

        },
        "doTabReplyList":function(){
            var tplEl = exports.tplEl,
                tplName=exports.tplName,
                tabsEl=$('.home-center-list',tplEl),
                tabs;
            var ReplyList=fsReplyList.replyList;
            tabs=new Tabs({
                "element":tabsEl,
                "triggers": $('.ui-tab-item',tabsEl),
                "panels": $('.ui-tab-panel',tabsEl),
                "activeIndex": 0,
                "activeTriggerClass":"ui-tab-item-current",
                "triggerType":'click'
            }).render();
            tabs.on('switched',function(toIndex,fromIndex){
                var curPanelEl=this.get('panels').eq(toIndex),
                    listEl=$('.reply-list',curPanelEl),
                    pagEl=$('.reply-list-pagination',curPanelEl);
                var replyList=curPanelEl.data('replyList');
                if(!replyList){
                    replyList=new ReplyList({
                        "element":listEl, //list selector
                        "pagSelector":pagEl, //pagination selector
                        "pagOpts":{ //分页配置项
                            "pageSize":45,
                            "totalSize":0,
                            "visiblePageNums":7
                        },
                        "defaultRequestData":{
                            "circleID": 999999, //部门id
                            "subType": 0, //子类型
                            "feedType": 0,
                            "keyword": ""
                        } //默认请求数据
                    });
                    replyList.load();
                    curPanelEl.data('feedList',replyList);
                }else{
                    replyList.reload();
                }
            });
            //默认加载第一个tab
            tabs.trigger('switched',0,-1);
            //切换到当前模板后重新加载feedlist
            tplEvent.on('switched', function (tplName2, tplEl) {
                if(tplName2==tplName){
                    tabs.switchTo(0);
                }
            });
            return tabs;
        },
		"UiTabList":function(){
		    var tplEl = exports.tplEl,
                tplName=exports.tplName,
                tabsEl=$('.home-center-list',tplEl),
                tabs;
            var killLoad=function(panelSelector){
                var panelEl=$(panelSelector),
                    feedList=panelEl.data('feedList');
                feedList&&feedList.loadKill();
            };
            tabs=new Tabs({
                "element":tabsEl,
                "triggers": $('.ui-tab-item',tabsEl),
                "panels": $('.ui-tab-panel',tabsEl),
                "activeIndex": 0,
                "activeTriggerClass":"ui-tab-item-current",
                "triggerType":'click'
            }).render();
            tabs.on('switched',function(toIndex,fromIndex){
                var curPanelEl=this.get('panels').eq(toIndex),
                    listEl=$('.feed-list',curPanelEl),
                    pagEl=$('.feed-list-pagination',curPanelEl);
                var feedList=curPanelEl.data('feedList');
                if(!feedList){
                    feedList=new FeedList({
                        "element":listEl, //list selector
                        "pagSelector":pagEl, //pagination selector
                        "pagOpts":{ //分页配置项
                            "pageSize":45,
                            "totalSize":0,
                            "visiblePageNums":7
                        },
                        "loadSize":15,   //单次加载15条记录
                        "defaultRequestData":{
                            "circleID": 999999, //部门id
                            "subType": 0, //子类型
                            "feedType": 0,
                            "keyword": ""
                        } //默认请求数据
                    });
                    feedList.load();
                    curPanelEl.data('feedList',feedList);
                }else{
                    feedList.reload();
                }
            }).on('switch',function(toIndex,fromIndex){
                    //切换前kill掉当前tab中的feedList加载
                    killLoad(this.get('panels').eq(fromIndex));
                });
            //默认加载第一个tab
            tabs.trigger('switched',0,-1);
            //切换到当前模板后重新加载feedlist
            tplEvent.on('switched', function (tplName2, tplEl) {
                if(tplName2==tplName){
                    tabs.switchTo(0);
                }
            });
		},
		"plan-right":function(){
			var tplEl = exports.tplEl;
			//右边栏
			var planRmylistWrapEl=$('.planr-my-list-wrap',tplEl);
			var planRupslistWrapEl=$('.planr-ups-list-wrap',tplEl);
			util.api({
			   "type":"get",
			   "data":{},
			   "url":"/content/fs/data/plan-right-nav.json",
			   "success":function(responseData){
				   if(responseData.success){
					  //render 右侧栏 待我点评的日志
					  var iSends=responseData.value.iSends,
				          iSendCount=responseData.value.iSendCount;
						  $('.planr-my-title-count').text(iSendCount);
						  if(iSends.length>5){
						     iSends=iSends.slice(0,5);
						  }
					  _.each(iSends,function(data){
						  var userName=data.employee.name,
						      profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent; 
						  var planRmylistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>";
						  planRmylistWrapEl.append(planRmylistHtml);
					  });
					  
					  //render 右侧栏 待上级点评的日志
					  var toBeIs=responseData.value.toBeIs,
				          toBeICount=responseData.value.toBeICount;
						  $('.planr-ups-title-count').text(toBeICount);
						  if(toBeIs.length>5){
						     toBeIs=toBeIs.slice(0,5);
						  }
					  _.each(toBeIs,function(data){
						  var userName=data.employee.name,
						      profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var planRupslistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  planRupslistWrapEl.append(planRupslistHtml);
					  });
					  
				   }
			   }
			});		
		},
		"approve-right":function(){
			var tplEl = exports.tplEl;
			//右边栏
			var approveRmylistWrapEl=$('.approver-my-list-wrap',tplEl);
			var approveRupslistWrapEl=$('.approver-ups-list-wrap',tplEl);
			util.api({
			   "type":"get",
			   "data":{},
			   "url":"/content/fs/data/approve-right-nav.json",
			   "success":function(responseData){
				   if(responseData.success){
					  //render 右侧栏 待我
					  var iSends=responseData.value.iSends,
				          iSendCount=responseData.value.iSendCount;
						  $('.approver-my-title-count').text(iSendCount);
						  if(iSends.length>5){
						     iSends=iSends.slice(0,5);
						  }
					  _.each(iSends,function(data){
						  var userName=data.employee.name,
						  	  profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var approveRmylistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  approveRmylistWrapEl.append(approveRmylistHtml);
					  });
					  
					  //render 右侧栏 待上级
					  var toBeIs=responseData.value.toBeIs,
				          toBeICount=responseData.value.toBeICount;
						  $('.approver-ups-title-count').text(toBeICount);
						  if(toBeIs.length>5){
						     toBeIs=toBeIs.slice(0,5);
						  }
					  _.each(toBeIs,function(data){
						  var userName=data.employee.name,
						  	  profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var approveRupslistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  approveRupslistWrapEl.append(approveRupslistHtml);
					  });
					  
				   }
			   }
			});		
		},
		"work-right":function(){
			var tplEl = exports.tplEl;
			//右边栏
			var workRdolistWrapEl=$('.workr-do-list-wrap',tplEl);
			var workRmylistWrapEl=$('.workr-my-list-wrap',tplEl);
			var workRupslistWrapEl=$('.workr-ups-list-wrap',tplEl);
			util.api({
			   "type":"get",
			   "data":{},
			   "url":"/content/fs/data/work-right-nav.json",
			   "success":function(responseData){
				   if(responseData.success){
					   //render 右侧栏 我执行中
					  var iExecuters=responseData.value.iExecuters,
				          iExecuterCount=responseData.value.iExecuterCount;
						  $('.workr-do-title-count').text(iExecuterCount);
						  if(iExecuters.length>5){
						     iExecuters=iExecuters.slice(0,5);
						  }
					  _.each(iExecuters,function(data){
						  var userName=data.employee.name,
						      profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var workRdolistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  workRdolistWrapEl.append(workRdolistHtml);
					  });
					  
					  //render 右侧栏 我发出
					  var iSends=responseData.value.iSends,
				          iSendCount=responseData.value.iSendCount;
						  $('.workr-my-title-count').text(iSendCount);
						  if(iSends.length>5){
						     iSends=iSends.slice(0,5);
						  }
					  _.each(iSends,function(data){
						  var userName=data.employee.name,
						      profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var workRmylistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  workRmylistWrapEl.append(workRmylistHtml);
					  });
					  
					  //render 右侧栏 待我点评
					  var toBeIs=responseData.value.toBeIs,
				          toBeICount=responseData.value.toBeICount;
						  $('.workr-ups-title-count').text(toBeICount);
						  if(toBeIs.length>5){
						     toBeIs=toBeIs.slice(0,5);
						  }
					  _.each(toBeIs,function(data){
						  var userName=data.employee.name,
						      profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
						      dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							  feedContent=data.feedContent;
						  var workRupslistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='javascript:;' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='javascript:;'>"+feedContent+"</a></div>"; 
						  workRupslistWrapEl.append(workRupslistHtml);
					  });
					  
				   }
			   }
			});
		},
        "plan":function(){
            var tplEl = exports.tplEl,
                feedListEl=$('.feed-list',tplEl),
                pagEl=$('.feed-list-pagination',tplEl),
                feedListCtrEl=$('.plan-status-type',tplEl);
            var dialog,
                feedList;
            //批量点评弹框
            dialog=new Dialog({
                trigger: $('#btn-remark-plan',tplEl),
                //title: '批量点评',
                width: '440px',
                className:'plan-bat-remark-dialog',
                // height:'450px',
                content: $('.bat-remark-plan-tpl', tplEl).html()
            }).render();

            $('.f-cancel', dialog.element).click(function () {
                dialog.hide();
            });
            //feedlist列表
            feedList=new FeedList({
                "element":feedListEl, //list selector
                "pagSelector":pagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":45,
                    "totalSize":0,
                    "visiblePageNums":7
                },
                "loadSize":15,   //单次加载15条记录
                "defaultRequestData":{
                    "circleID": 999999, //部门id
                    "subType": 0, //子类型
                    "feedType": 0,
                    "keyword": ""
                } //默认请求数据
            });
            feedList.load();
            feedListCtrEl.on('click','.plan-status,.plan-type',function(e){
                var meEl=$(this);
                if(meEl.hasClass('plan-status')){
                    $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon');
                    meEl.addClass('depw-tabs-aon');
                }else{
                    $('.plan-type',feedListCtrEl).removeClass('depw-tabs-aon');
                    meEl.addClass('depw-tabs-aon');
                }
                feedList.reload();
                e.preventDefault();
            });
			exec["plan-right"]();
        },
        "plan-assignedplans":function(){
			exec["plan-right"]();
		},
		"plan-followedplans":function(){
			exec["plan-right"]();
		},
		"plan-receivedplanreplies":function(){
			exec["plan-right"]();
		},
		"plan-atmeplans":function(){
			exec["plan-right"]();
		},
        "approve":function(){
            exec["UiTabList"]();
			exec["approve-right"]();
        },
        "approve-sentapproves":function(){
            exec["UiTabList"]();
            exec["approve-right"]();
        },
        "approve-followedapproves":function(){
            exec["UiTabList"]();
            exec["approve-right"]();
        },
		"approve-receivedapprovereplies":function(){
            exec["approve-right"]();
        },
        "approve-atmeapproves":function(){
            exec["UiTabList"]();
            exec["approve-right"]();
        },
        "work":function(){
            exec["UiTabList"]();
			exec["work-right"]();
        },
        "work-assignedworks":function(){
            exec["UiTabList"]();
            exec["work-right"]();
        },
        "work-followedworks":function(){
            exec["UiTabList"]();
			exec["work-right"]();
        },
		"work-receivedworkreplies":function(){
			exec["work-right"]();
        },
        "work-atmeworks":function(){
            exec["UiTabList"]();
			exec["work-right"]();
        },
        "stream-atmefeeds":function(){
            exec["leftDepartment"]();
            exec["UiTabList"]();
        },
        "stream-followedfeeds":function(){
            exec["leftDepartment"]();
            exec["UiTabList"]();
        },
        "stream-receivedreplies":function(){
            exec["leftDepartment"]();
            //exec["approve"]();
            exec["doTabReplyList"]();
        },
        "stream-archivetag":function(){
            exec["leftDepartment"]();
            
        },
        "stream-votes":function(){
            exec["leftDepartment"]();
            //exec["approve"]();
        },
        "search":function(){
            exec["UiTabList"]();
        },
        "search-attachs":function(){
            // exec["approve"]();
        },
        "search-colleagues":function(){
            //exec["approve"]();
        },
        "schedules":function(){

        },
        "worktodo":function(){

        },
        "department":function(){

            exec["leftDepartment"]();
            var queryParams=util.getTplQueryParams();

            var tplEl = exports.tplEl,
                feedListEl=$('.feed-list',tplEl),
                pagEl=$('.feed-list-pagination',tplEl),
                feedListCtrEl=$('.plan-status-type',tplEl);
            var feedList;
            //feedType=$('.plan-status-wrap .depw-tabs-aon',tplEl).attr('feedtype');

            //feedlist列表
            feedList=new FeedList({
                "element":feedListEl, //list selector
                "pagSelector":pagEl, //pagination selector
                "pagOpts":{ //分页配置项
                    "pageSize":45,
                    "totalSize":0,
                    "visiblePageNums":7
                },
                "loadSize":15,   //单次加载15条记录
                "listPath":"/feed_html/getFeedsFromCircleSend",
                "defaultRequestData":function(){
                    var curSubtypeWrapper=$('.subtype-wrapper',feedListCtrEl).filter(':visible');
                    return {
                        "circleID": queryParams?queryParams.cid:0, //部门id
                        "subType": $('.depw-tabs-aon',curSubtypeWrapper).attr('subtype'), //子类型
                        //"feedType":1,
                        "feedAttachType":$('.include-file-wrap .depw-tabs-aon',tplEl).attr('attachtype'),
                        "feedType": $('.plan-status-wrap .depw-tabs-aon',tplEl).attr('feedtype'),
                        "keyword": ""
                    };
                }
                //默认请求数据
            });
            feedList.load();
            feedListCtrEl.on('click','.plan-status',function(e){
                var meEl=$(this);
                if(meEl.hasClass('plan-status')){
                    $('.subtype-wrapper',feedListCtrEl).hide();
                    if(meEl.is('[feedname]')){
                        $('.'+meEl.attr('feedname')+'-wrapper').show();
                    }
                }
                e.preventDefault();
            }).on('click','.depw-tabs-a',function(){
                var meEl=$(this),
                    statusWrapperEl=meEl.closest('.status-wrapper');
                var infoType=meEl.attr('infotype');
                $('.depw-tabs-a',statusWrapperEl).removeClass('depw-tabs-aon');
                meEl.addClass('depw-tabs-aon');
                if(infoType=="send"){
                    feedList.opts.listPath="/feed_html/getFeedsFromCircleSend";
                }else if(infoType=="received"){
                    feedList.opts.listPath="/feed_html/getFeeds";
                }
                //点击status刷新列表
                feedList.reload();
            });

            //部门发出与收到信息切换 reload
            $('.depw-menu li').find(">a").on("click",function(){
                feedList.reload();
            });
			
			//render 右侧栏 同事
			var contactData=FS.getAppStore('contactData');
			var righthImgWrapEl=$('.right-img-wrap',tplEl);
			var righthTitleWrapEl=$('.right-htitle-wrap',tplEl);  
			util.api({
				"type":"get",
				"data":{},
				"url":"/content/fs/data/stream-right-nav.json",
				"success":function(responseData){
					var inCircleEmployeeIDs;
					var members=contactData.members;
					//var filterMemberData=[];
					if(responseData.success){
						inCircleEmployeeIDs=responseData.value.inCircleEmployeeIDs;
						if(inCircleEmployeeIDs.length>14){
							inCircleEmployeeIDs=inCircleEmployeeIDs.slice(0,14);	
						}
						_.each(inCircleEmployeeIDs,function(id){
							var memberData=_.find(members,function(data){
								return data.id==id;	
							});
							if(memberData){
								//filterMemberData.push(memberData);
								var userName=memberData.name;
								var profileImage=FS.FILES_PATH+'/'+memberData.profileImage+'3.jpg';
								var righthImgHtml="<a href='javascript:;' title='"+userName+"'><img src='"+profileImage+"' /></a>"; 
								righthImgWrapEl.append(righthImgHtml);                
							}
						});
						//render 右侧栏 同事 title
						var thisCircle;
							thisCircle=responseData.value.thisCircle;
					    righthTitleWrapEl.html(thisCircle.name+'（'+thisCircle.memberCount+'）');
					}		
				}		
			});
        }

    });


    exports.init=function(){
        var tplName = exports.tplName;
        exec["common"]();
        exec[tplName]&&exec[tplName]();

    };

});