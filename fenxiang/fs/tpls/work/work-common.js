/**
 * work辅助页面逻辑
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
        leftTpl=require('./work-common.html'),
        leftTplEl=$(leftTpl);
	/**
     * 创建右边栏
     */
    var createRightSb=function(tplEl,tplName){
		//右边栏
        var workRdolistWrapEl=$('.workr-do-list-wrap',tplEl);
        var workRmylistWrapEl=$('.workr-my-list-wrap',tplEl);
        var workRupslistWrapEl=$('.workr-ups-list-wrap',tplEl);
		//先清空
		workRdolistWrapEl.empty();
		workRmylistWrapEl.empty();
		workRupslistWrapEl.empty();
        util.api({
            "type":"get",
            "data":{},
            //"url":"/content/fs/data/work-right-nav.json",
            "url":"/feedWork/getFeedWorksInAbeyance",
            "success":function(responseData){
                if(responseData.success){
                    //render 右侧栏 我执行中
                    var iExecuters=responseData.value.iExecuters,
                        iExecuterCount=responseData.value.iExecuterCount;
                    $('.workr-do-title-count').text(iExecuterCount);
                    if(iExecuters.length>5){
                        iExecuters=iExecuters.slice(0,5);
                    }
					if(iExecuters.length>0){
                    _.each(iExecuters,function(data){
                        var userName=data.employee.name,
							userId=data.employeeID,
                            //profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
                            profileImage=util.getAvatarLink(data.employee.profileImage,3),
                            dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							feedId=data.feedID,
                            feedContent=data.feedContent;
                        var workRdolistHtml="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";
                        workRdolistWrapEl.append(workRdolistHtml);
                    });
					}else{	
						workRdolistWrapEl.append("<div class='right-list-notext color-999999'>无我执行的指令</div>");	
					}

                    //render 右侧栏 我发出
                    var iSends=responseData.value.iSends,
                        iSendCount=responseData.value.iSendCount;
                    $('.workr-my-title-count').text(iSendCount);
                    if(iSends.length>5){
                        iSends=iSends.slice(0,5);
                    }
					if(iSends.length>0){
                        var workRmylistHtml='';
                        _.each(iSends,function(data){
                            if(!data.employee){
                                return;
                            }
                            var userName=data.employee.name,
                                userId=data.employeeID,
                                profileImage=util.getAvatarLink(data.employee.profileImage,3),
                                dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
                                feedId=data.feedID,
                                feedContent=data.feedContent;
                            workRmylistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";

                        });
                        workRmylistWrapEl.html(workRmylistHtml);
					}else{
						workRmylistWrapEl.append("<div class='right-list-notext color-999999'>无我发出执行的指令</div>");	
					}

                    //render 右侧栏 待我点评
                    var toBeIs=responseData.value.toBeIs,
                        toBeICount=responseData.value.toBeICount;
					if(toBeICount==0){
						$(".workr-ups-tpl-wrap").hide();
					}
                    $('.workr-ups-title-count').text(toBeICount);
                    if(toBeIs.length>5){
                        toBeIs=toBeIs.slice(0,5);
                    }
                    var workRupslistHtml='';
                    _.each(toBeIs,function(data){
                        if(!data.employee){
                            return;
                        }
                        var userName=data.employee.name,
							userId=data.employeeID,
                            profileImage=util.getAvatarLink(data.employee.profileImage,3),
                            dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
							feedId=data.feedID,
                            feedContent=data.feedContent;
                       workRupslistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";
                    });
                    workRupslistWrapEl.html(workRupslistHtml);

                }
            }
        });
	}
	exports.createRightSb=createRightSb;
    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"],
            functionPermissions=currentMember.functionPermissions;
        var renderData={};
        var leftCompiled=_.template(leftTplEl.filter('.work-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });

        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));
        //根据指令权限显示指令绩效导航
        if(_.some(functionPermissions,function(permission){
            return permission.value==5;
        })){
            $('.performance-nav-item',tplLeftEl).show();
        }

        //高亮对应的页面导航
        util.regTplNav($('.tpl-nav-lb',tplLeftEl),'depw-menu-aon');
        //右侧渲染
        createRightSb(tplEl,tplName);

        //注册子导航
        util.tplRouterReg($('.tpl-nav-lb',tplLeftEl));
        util.tplRouterReg('#work/=/:tabindex-:value');
        util.tplRouterReg('#work/assignedworks/=/:tabindex-:value'); //可通过地址直接切换到对应的tab
    };
});