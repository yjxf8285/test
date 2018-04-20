/**
 * 我的话题
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var Tabs = require('tabs'),
        util = require('util');
    var topicMod = require('modules/fs-topic/fs-topic'),
        tplCommon = require('../stream-common');

    var MyTopics=topicMod.Mytopics;

    exports.init = function() {
        var tplEl = exports.tplEl,
            tplName=exports.tplName;

        var topicEl = $('.topic-model-warp', tplEl);
        var pagEl = $('.topic-list-pagination', tplEl);
        var searchEl = $('.search-inp', tplEl);
        var searchBtnEl = $('.search-btn', tplEl);
        var filterEl=$('.filter',tplEl);
        var topicNumEl=$('.topic-num .num',tplEl);

        var myTopics = new MyTopics({
            "element": topicEl, //容器
            "listPath": '/Topic/GetTopics',//话题列表请求接口
            "pagSelector": pagEl, //pagination selector
            "defaultRequestData": function() {
                return {
                    "type":$('.depw-menu-aon',filterEl).attr('topictype'),
                    "keyword": _.str.trim(searchEl.val())
                };
            },
            "searchOpts": {
                "inputSelector": searchEl,
                "btnSelector": searchBtnEl
            },
            "listSuccessCb":function(responseData){
                var dataRoot,
                    activeFilterEl,
                    topicType;
                if(responseData.success){
                    dataRoot=responseData.value;
                    topicNumEl.text(dataRoot.totalCount);
                    //设置置顶按钮可见性
                    activeFilterEl=$('.depw-menu-aon',filterEl);
                    topicType=activeFilterEl.attr('topictype');
                    if(topicType=="1"){ //只有固定话题才显示置顶按钮
                        myTopics.setTopVisible(true);
                    }else{
                        myTopics.setTopVisible(false);
                    }
                    if(topicType=="0"){ //关注的话题强制设置成取消关注
                        myTopics.setFollowAction(false);
                    }
                }
            }
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            myTopics.load();
            evt.preventDefault();
        });
        //filter筛选
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            //reload
            myTopics.load();
            evt.preventDefault();
        });
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);
        //注册路由
        util.tplRouterReg('#stream/mytopics/=/:topictype-:value');

        //切换到当前模板后重新加载feedlist
        var firstRender=true;
        tplEvent.on('switched', function (tplName2) {
            if(tplName2==tplName){
                //定位话题类型
                var queryParams = util.getTplQueryParams(), //传给模板的参数
                    topicType = queryParams ? queryParams.topictype : 0; //获取话题类型
                $('.filter-field',filterEl).removeClass('depw-menu-aon');
                //设置当前话题类型高亮
                $('[topictype="'+topicType+'"]',filterEl).addClass('depw-menu-aon');
                //高亮"我的话题"
                $('.tpl-l [href="#stream/mytopics"]',tplEl).addClass('depw-menu-aon');
                //发请求
                myTopics.resetSearch();
                if(firstRender){
                    myTopics.load();
                    firstRender=false;
                }else{
                    myTopics.load();
                }
            }
        });
		/**
			 * 创建右侧内容
		*/
		var rightFixedTopicsWrapEl=$('.right-fixedtopics-wrap',tplEl),
			rightFollowTopicsWrapEl=$('.right-followtopics-wrap',tplEl),
			rightNewTopicsWrapEl=$('.right-newtopics-wrap',tplEl),
			rightMostTopicsWrapEl=$('.right-mosttopics-wrap',tplEl),
			rightMytopicsImgWrapEl=$('.mytopics-img-wrap',tplEl);
		 var contactData=util.getContactData()
		//话题管理员
		var createSideBarContentAdmin=function(){
				util.api({
					"type":"get",
					"data":{
						
					},
                    "url":"/Topic/GetTopicAdmins",
					"success":function(responseData){
						var inCircleEmployeeIDs;
						var members=contactData["p"];
						if(responseData.success){
							//话题管理员 rander
							inCircleEmployeeIDs=responseData.value;
							if(inCircleEmployeeIDs.length>14){
								inCircleEmployeeIDs=inCircleEmployeeIDs.slice(0,14);
							}
							//先清空内容
							rightMytopicsImgWrapEl.empty();
							_.each(inCircleEmployeeIDs,function(data){
								var userName=data.name,
									userId=data.employeeID,
									profileImage=data.profileImage;
								var rightMytopicsImgHtml="<a href='#profile/=/empid-"+userId+"' title='"+userName+"'><img src='"+util.getAvatarLink(profileImage,3)+"' width='24' height='24' /></a>";
								rightMytopicsImgWrapEl.append(rightMytopicsImgHtml);
								
							});
							$('.mytopics-admin-count').text(inCircleEmployeeIDs.length);
						}
					}
				});
		}
		createSideBarContentAdmin();
		//话题管理员 end					
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
								var rightMostTopicsHtml="<li><a href='#stream/showtopic/=/id-"+feedId+"' class='fna-blue'>#"+data.name+"#</a><span class='rfl-li-apv color-999999'>"+data.count+"</span></li>";
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