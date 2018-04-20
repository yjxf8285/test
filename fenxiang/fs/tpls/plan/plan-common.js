/**
 * plan辅助页面逻辑
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
        leftTpl=require('./plan-common.html'),
        leftTplEl=$(leftTpl);
    /**
     * 创建右边栏
     */
    var createRightSb=function(tplEl,tplName){
        //右边栏
        var planRmylistWrapEl=$('.planr-my-list-wrap',tplEl);
        var planRupslistWrapEl=$('.planr-ups-list-wrap',tplEl);
		//先清空
		planRmylistWrapEl.empty();
		planRupslistWrapEl.empty();
        util.api({
            "type":"get",
            "data":{},
            //"url":"/content/fs/data/plan-right-nav.json",
            "url":"/feedPlan/getFeedPlansInAbeyance",
            "success":function(responseData){
                if(responseData.success){
                    //render 右侧栏 待我点评的日志
                    var toBeIs=responseData.value.toBeIs,
                        toBeICount=responseData.value.toBeICount;
                    $('.planr-my-title-count').text(toBeICount);
                    if(toBeIs.length>5){
                        toBeIs=toBeIs.slice(0,5);
                    }
                    if(toBeIs.length>0){
                        var planRmylistHtml='';
                        _.each(toBeIs,function(data){
                            if(!data.employee){
                                return;
                            }
                            var userName=data.employee.name,
                                userId=data.employeeID,
                                //profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
                                profileImage=util.getAvatarLink(data.employee.profileImage,3),
                                dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
                                feedId=data.feedID,
                                feedContent=data.report+data.planContent+data.feedContent;
                            planRmylistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";
                        });
                        planRmylistWrapEl.html(planRmylistHtml);
                    }else{
                        planRmylistWrapEl.append("<div class='right-list-notext color-999999'>无我点评的日志</div>");
                    }
                    //render 右侧栏 待上级点评的日志
                    var iSends=responseData.value.iSends,
                        iSendCount=responseData.value.iSendCount;
                    $('.planr-ups-title-count').text(iSendCount);
                    if(iSends.length>5){
                        iSends=iSends.slice(0,5);
                    }
                    if(iSends.length>0){
                        var planRupslistHtml='';
                        _.each(iSends,function(data){
                            if(!data.employee){
                                return;
                            }
                            var userName=data.employee.name,
                                userId=data.employeeID,
                                //profileImage=FS.FILES_PATH+'/'+data.employee.profileImage+'3.jpg',
                                profileImage=util.getAvatarLink(data.employee.profileImage,3),
                                dateTime=moment.unix(data.dateTime).format('MM-DD HH:mm'),
                                feedId=data.feedID,
                                feedContent=data.report+data.planContent+data.feedContent;
                            planRupslistHtml+="<div class='rightc-listwrap fn-clear'><a href='javascript:;' class='rlist-headimg-wrap'><img class='rlist-headimg' src='"+profileImage+"' /></a><p class='rlist-pname'><a href='#profile/=/empid-"+userId+"' class='fna-blue'>"+userName+"</a> <span class='rlist-pname-apvdate'>"+dateTime+"</span></p><a class='rlist-atext fna-grey' href='#stream/showfeed/=/id-"+feedId+"'>"+feedContent+"</a></div>";
                        });
                        planRupslistWrapEl.html(planRupslistHtml);
                    }else{
                        planRupslistWrapEl.append("<div class='right-list-notext color-999999'>无上级点评的日志</div>");
                    }

                }
            }
        });
    };
    exports.createRightSb=createRightSb;
    exports.init=function(tplEl,tplName){
        var tplLeftEl=$('.tpl-l .tpl-inner',tplEl);
        var contactData=util.getContactData();
        //render左边栏信息
        var currentMember=contactData["u"];
        var renderData={};
        var leftCompiled=_.template(leftTplEl.filter('.plan-tpl-left').html()); //模板编译方法
        _.extend(renderData,{
            "userName":currentMember.name,
            "profileImage":currentMember.profileImage
        });

        //渲染到页面
        tplLeftEl.html(leftCompiled(renderData));
        //日志统计权限控制
        if(_.some(currentMember.functionPermissions,function(permission){
            return permission.value==6;    //日志管理员
        })){
            $('.plan-statistics-l',tplLeftEl).closest('.files-nav-item').show();
        }else{
            $('.plan-statistics-l',tplLeftEl).closest('.files-nav-item').hide();
        }
        //高亮对应的页面导航
        util.regTplNav($('.tpl-nav-lb',tplLeftEl),'depw-menu-aon');
        //右侧渲染
        createRightSb(tplEl,tplName);
        //注册子导航
        util.tplRouterReg($('.tpl-nav-lb',tplLeftEl));
    };
});