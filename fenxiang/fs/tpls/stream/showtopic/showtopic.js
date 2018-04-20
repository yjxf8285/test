/**
 * 话题详情
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        topicMode=require('modules/fs-topic/fs-topic');
    var tplCommon = require('../stream-common'),
        stream=require('../stream');
    var Stream=stream.Stream,
        TopicEditDialog=topicMode.TopicEditDialog,  //话题范围编辑框
        TopicDescDialog=topicMode.TopicDescDialog;  //话题描述编辑框
    var contactData=util.getContactData(),
        loginUserData=contactData["u"]; //当前登录用户数据
    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var topicNumEl=$('.topic-num',tplEl),
            topicNameEl=$('.topic-name',tplEl),
            followBtnEl=$('.follow-btn',tplEl),
            cancelFollowEl=$('.cancel-follow',tplEl),
			cancelFollowlEl=$('.cancel-follow-l',tplEl),
            publishInputEl=$('.publish-input',tplEl),
            ksfwEl=$('.ksfw .selectbar',tplEl),    //可视范围
			topicTypeEl=$('.topic-type-r',tplEl),
            topicDescEl=$('.topic-desc',tplEl), //话题描述
            topicSettingEl=$('.topic-setting-l',tplEl), //话题范围设置按钮
            topicDescEditEl=$('.topic-desc-edit-l',tplEl),  //话题描述修改按钮
            topicTipEl=$('.publish-tip',tplEl);   //话题提醒
        var topicDefaultSbData; //默认的话题范围

        //话题设置
        var topicEdit=new TopicEditDialog({
                "successCb":function(responseData,requestData){
                    var circleIds,
                        circleNames=[],
                        topicType;
                    if(responseData.success){
                        //重新render话题范围
                        circleIds=requestData.circleIDs;
                        topicType=requestData.isOpen?"1":"0";
                        if(topicType=="1"){ //范围性话题
                            _.each(circleIds,function(circleId){
                                circleNames.push(util.getContactDataById(circleId,'g').name);
                            });
                            topicTypeEl.html('范围性话题，范围：'+circleNames.join('，'));
                        }else{  //普通话题
                            topicTypeEl.html('普通话题');
                        }
                    }
                }
            }).render(),
            topicDescEdit=new TopicDescDialog({
                "successCb":function(responseData,requestData){
                    if(responseData.success){
                        topicDescEl.html(requestData.description);
                    }
                }
            }).render();

        //生成一个stream实例
        var stream=new Stream({
            "tplEl":tplEl,
            "tplName":tplName,
            "autoInit":false,    //稍后手动调用init
            "feedListPath":"/Topic/GetFeedsByTopicID",
            "refreshAfterPublish":false, //不强制刷新
            "applyFeedlistRd":function(feedList){
                var queryParams = util.getTplQueryParams(), //传给模板的参数
                    topicId = queryParams ? queryParams.id : 0, //获取topicId
                    topicName=queryParams ? queryParams.name : '';    //获取tooicName
                if(topicId){
                    //替换请求地址
                    feedList.opts.listPath="/Topic/GetFeedsByTopicID";
                    return {
                        "topicID":topicId
                    };
                }
                if(topicName.length>0){
                    //替换请求地址
                    feedList.opts.listPath="/Topic/GetFeedsByTopicName";
                    return {
                        "topicName":topicName
                    };
                }
            },
            "beforeFeedListParse":function(responseData){   //拦截feedlist-c中的格式化函数
                var dataRoot,
                    topicData,
					topicTypeHtml=[],
                    tCircles,
                    defaultSbData=[];
                var ksfwSb=ksfwEl.data('sb');

                if(responseData.success){
                    dataRoot=responseData.value;
                    topicData=dataRoot.topic;
                    if(topicData){  //Feed/GetFeedByFeedID也会走这条逻辑，所以要加判定
                        //话题类型
                        if(topicData.isOpen==true){
                            tCircles=topicData.circles;
                            if(topicData.isPublic){ //全公司
                                topicTypeHtml.push('全公司');
                                ksfwSb.addItem({
                                    "type":"g",
                                    "name":"全公司",
                                    "id":"999999"
                                });
                                defaultSbData.push({
                                    "type":"g",
                                    "name":"全公司",
                                    "id":"999999"
                                });
                            }else{
                                _.each(tCircles,function(data){
                                    topicTypeHtml.push(data.name);
                                });
                            }
                            topicTypeHtml='范围性话题，范围：'+topicTypeHtml.join('，');
                            //设置默认可视范围选项
                            _.each(tCircles,function(circleData){
                                var sbData={
                                    "type":"g",
                                    "name":circleData.name,
                                    "id":circleData.id
                                };
                                ksfwSb.addItem(sbData);
                                defaultSbData.push(sbData);
                            });
                        }else{
                            topicTypeHtml="普通话题";

                        }
                        //右侧话题类型提示
                        topicTypeEl.html(topicTypeHtml);
                        //设置话题描述修改
                        topicDescEl.html(topicData.description||"");
                        topicDescEdit.set('topicId',topicData.topicID);
                        topicDescEdit.set('defaultDesc',topicData.description||"");
                        //设置范围修改弹框默认数据
                        topicEdit.set('defaultSbData',defaultSbData);
                        topicEdit.set('topicType',topicData.isOpen?"1":"0");
                        topicEdit.set('topicId',topicData.topicID);
                        topicDefaultSbData=defaultSbData;

                        //设置话题名
                        topicNameEl.text(topicData.name);
                        publishInputEl.val('#'+topicData.name+'#').trigger('autosize.resize');
                        //设置话题数量
                        topicNumEl.text(topicData.count);
                        //设置话题状态
                        if(topicData.isFollow){
                            followBtnEl.hide();
                            cancelFollowEl.show();
                        }else{
                            followBtnEl.show();
                            cancelFollowEl.hide();
                        }
                        //保存topicData
                        stream.topicData=topicData;
                    }
                }
                return {
                    "success":responseData.success,
                    "isAuthorized":responseData.isAuthorized,
                    "statusCode":responseData.statusCode,
                    "serviceTime":responseData.serviceTime,
                    "value":responseData.value?(responseData.value.feeds||responseData.value):void(0)   //考虑Feed/GetFeedByFeedID的情况
                };
            },
            "publishCb":function(responseData,requestData){
                var ksfwSb=ksfwEl.data('sb'),
                    defaultTopicData=stream.topicData,
                    circleIDs=requestData.circleIDs;
                //设置默认input值，原话题
                publishInputEl.val('#'+defaultTopicData.name+'#');
                //设置更改后的可视范围
                _.each(circleIDs,function(circleId){
                    var circleData=util.getContactDataById(circleId,'g');
                    var sbData={
                        "type":"g",
                        "name":circleData.name,
                        "id":circleData.id
                    };
                    ksfwSb.addItem(sbData);
                });
            },
            "feedlistConfig":{
                "withFeedRemind":false,  //取消新feed提醒
                "listEmptyText":"该话题下没有您可见的信息",
                "withLazyload":false    //取消懒加载
            }
        });
        /**
         * 清理接口
         */
        var clear=function(){
            var ksfwSb=ksfwEl.data('sb');
            publishInputEl.val("");
            //清空话题描述
            topicDescEl.html("");
            topicDescEdit.set('defaultDesc',"");
            //清空可视范围
            ksfwSb.removeAllItem();
            topicEdit.set('defaultSbData',[]);
        };
		//关注话题按钮 切换
		followBtnEl.click(function(){
			var queryParams = util.getTplQueryParams(), //传给模板的参数
                topicId = queryParams ? queryParams.id : 0; //获取topicId
            if(!topicId){
                topicId=stream.topicData.topicID;
            }
			util.api({
				"type":"post",
				"data":{"flag":true,"id":parseInt(topicId)},
				"url":"/Topic/FollowTopic",
				"success":function(responseData){
					if(responseData.success){
						followBtnEl.hide();
						cancelFollowEl.show();
					}
				}
			});
		});
		cancelFollowlEl.click(function(evt){
			var queryParams = util.getTplQueryParams(), //传给模板的参数
                topicId = queryParams ? queryParams.id : 0; //获取topicId
            if(!topicId){
                topicId=stream.topicData.topicID;
            }
			util.api({
				"type":"post",
				"data":{"flag":false,"id":parseInt(topicId)},
				"url":"/Topic/FollowTopic",
				"success":function(responseData){
					if(responseData.success){
						followBtnEl.show();
						cancelFollowEl.hide();
					}
				}
			});
			evt.preventDefault();
		});

        //点击创建公告显示对话框
        if(_.some(loginUserData.functionPermissions,function(permission){
            return permission.value==2;    //权限1表示是话题管理员
        })){
            topicSettingEl.show();
            topicDescEditEl.show();
        }else{
            topicSettingEl.hide();
            topicDescEditEl.hide();
        }

        tplEl.on('click','.topic-setting-l',function(evt){
            var topicData=stream.topicData;
            topicEdit.show();
            if(topicData&&!topicEdit._hasChanged){
                topicEdit.sb.removeAllItem();
                if(topicData.isPublic){ //全公司
                    topicEdit.sb.addItem({
                        "type":"g",
                        "id":"999999",
                        "name":"全公司"
                    });
                }
                _.each(topicDefaultSbData,function(itemData){
                    topicEdit.sb.addItem(itemData);
                });

                topicEdit.set('topicType',topicData.isOpen?"1":"0");
                topicEdit.set('topicId',topicData.topicID);
            }
            evt.preventDefault();
        }).on('click','.topic-desc-edit-l',function(evt){
            var topicData=stream.topicData;
            topicDescEdit.show();
            if(topicData){
                $('.topic-desc-input',topicDescEdit.element).val(topicDescEl.text()).trigger('autosize.resize');
            }
            evt.preventDefault();
        });
        //如果输入框中有话题信息，显示话题tip，没有隐藏
        publishInputEl.keyup(function(){
            var v= _.str.trim($(this).val());
            if(/#[^\n]+?#/g.test(v)){
                topicTipEl.slideDown(200);
            }else{
                topicTipEl.slideUp(200);
            }
        });

        //init share publish
        stream.dataInit();  //初始化数据
        stream.atInputInit();
        stream.shareInit();
        stream.feedInit();

        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);

        //切换到当前模板后重新加载feedlist
        //此行为已经被集成到Stream中
        var firstRender=true;
        tplEvent.on('switched', function(tplName2, tplEl) {
            if (tplName2 == tplName) {
                //高亮"我的话题"
                $('[href="#stream/mytopics"]',tplEl).addClass('depw-menu-aon');
            }else{
                clear();
            }
        });
    	/**
			 * 创建右侧内容
		*/
		var rightFixedTopicsWrapEl=$('.right-fixedtopics-wrap',tplEl),
			rightFollowTopicsWrapEl=$('.right-followtopics-wrap',tplEl),
			rightNewTopicsWrapEl=$('.right-newtopics-wrap',tplEl),
			rightMostTopicsWrapEl=$('.right-mosttopics-wrap',tplEl);
		var createSideBarContent=function(){
				util.api({
					"type":"get",
					"data":{
						
					},
                    "url":"/Topic/GetTopicList",
					"success":function(responseData){
						if(responseData.success){
							//render 右侧栏 固定话题
							var fixedTopics;
							fixedTopics=responseData.value.fixedTopics;
							if(fixedTopics.length>5){
								fixedTopics=fixedTopics.slice(0,5);
							}
							if(fixedTopics.length<1){
								$('.fixedtopics-wrapper').hide();
							}else{
								$('.fixedtopics-wrapper').show();
							}
							rightFixedTopicsWrapEl.empty();	//清空内容
							_.each(fixedTopics,function(data){
								var feedId=data.topicID;
								var rightFixedTopicsHtml;
								rightFixedTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightFixedTopicsWrapEl.append(rightFixedTopicsHtml);
							});
							//render 右侧栏 关注的话题
							var followTopics;
							followTopics=responseData.value.followTopics;
							if(followTopics.length>5){
								followTopics=followTopics.slice(0,5);
							}
							if(followTopics.length<1){
								$('.followtopics-wrapper').hide();
							}else{
								$('.followtopics-wrapper').show();
							}
							rightFollowTopicsWrapEl.empty();	//清空内容
							_.each(followTopics,function(data){
								var feedId=data.topicID;
								var rightFollowTopicsHtml;
								rightFollowTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightFollowTopicsWrapEl.append(rightFollowTopicsHtml);
							});
							//render 右侧栏 最新话题
							var newTopics;
							newTopics=responseData.value.newTopics;
							if(newTopics.length>5){
								newTopics=newTopics.slice(0,5);
							}
							if(newTopics.length<1){
								$('.newtopics-wrapper').hide();
							}else{
								$('.newtopics-wrapper').show();
							}
							rightNewTopicsWrapEl.empty();	//清空内容
							_.each(newTopics,function(data){
								var feedId=data.topicID;
								var rightNewTopicsHtml;
								rightNewTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightNewTopicsWrapEl.append(rightNewTopicsHtml);
							});
							//render 右侧栏 热门话题
							var mostTopics;
							mostTopics=responseData.value.mostTopics;
							if(mostTopics.length>5){
								mostTopics=mostTopics.slice(0,5);
							}
							if(mostTopics.length<1){
								$('.mosttopics-wrapper').hide();
							}else{
								$('.mosttopics-wrapper').show();
							}
							rightMostTopicsWrapEl.empty();	//清空内容
							_.each(mostTopics,function(data){
								var feedId=data.topicID;
								var rightNewTopicsHtml;
								rightMostTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
								rightMostTopicsWrapEl.append(rightMostTopicsHtml);
							});
							
						}
					}
				});
		};
		createSideBarContent();
		/*右侧栏 END*/
		
	};
});