/**
 * 部门feed列表
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
        FeedList=require('modules/feed-list/feed-list'),
        tplCommon = require('tpls/stream/stream-common');

    var contactData=util.getContactData();
    var InviteColleague=tplCommon.InviteColleague;
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl),
            circleListEl=$('.circles-nav-list',tplEl);
        var htmlStr='';

        var feedListEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            feedListCtrEl=$('.plan-status-type',tplEl),
            infoTypeWrapperEl=$('.info-type-wrapper',tplEl);

        var employeeData=contactData["p"],
            loginUserData=contactData["u"],
            circleEmployeeData=[];
        var queryParams=util.getTplQueryParams();
        var righthImgWrapEl=$('.right-img-wrap',tplEl);
        var righthTitleWrapEl=$('.right-htitle-wrap',tplEl);

        var circleId=queryParams?parseInt(queryParams.cid): 0, //部门id
            circleData,
            circleName;

        var feedList;
        /**
         * 重置过滤项
         */
        var resetFilter=function(infoType){
            infoType=infoType||"send";
            $('.status-wrapper',feedListCtrEl).each(function(){
                var fieldEl=$(this);
                $('a',fieldEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
            });
            if(infoType=="send"){
                $('.plan-wrapper,.approve-wrapper,.work-wrapper',feedListCtrEl).hide();
                $('.include-file-wrap',feedListCtrEl).show();
                $('.plan-status-wrap',feedListCtrEl).show();
            }else if(infoType=="received"){
                $('.plan-wrapper,.approve-wrapper,.work-wrapper,.include-file-wrap',feedListCtrEl).hide();
                $('.plan-status-wrap',feedListCtrEl).show();
            }
        };

        //部门名称
        $('.tpl-c .depw-title',tplEl).text(util.getContactDataById(circleId,'g').name);
        //左侧部门列表
        var groupsData=contactData["g"];
        groupsData= _.filter(groupsData,function(groupData){
            return groupData.id!="999999";
        });
        _.each(groupsData,function(groupData){
            if(groupData){
               htmlStr+='<li class="circle-nav-item fni-dep-con"><a class="circle-l tpl-nav-lb tpl-nav-lbq" href="#circles/atcircle/=/cid-'+groupData.id+'" title="">'+groupData.name+'</a></li>';
            }
        });
        circleListEl.html(htmlStr);
        //注册高亮导航
        util.regTplNav($('.circle-nav-item a',circleListEl));

        //feedlist列表
        feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "withFeedRemind":false, //关闭new feed提示
            "withLazyload":true,    //开启懒加载
            "listPath":"/feed/getFeedsFromCircleSend",
            "defaultRequestData":function(){
                var curSubtypeWrapper=$('.subtype-wrapper',feedListCtrEl).filter(':visible');
                var queryParams=util.getTplQueryParams();
                return {
                    "circleID": queryParams?queryParams.cid:0, //部门id
                    "subType": $('.depw-tabs-aon',curSubtypeWrapper).attr('subtype')||0, //子类型
                    //"feedType":1,
                    "feedAttachType":$('.include-file-wrap .depw-tabs-aon',tplEl).attr('attachtype'),
                    "feedType": $('.plan-status-wrap .depw-tabs-aon',tplEl).attr('feedtype'),
                    "keyword":_.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
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
                    feedList.opts.listPath="/feed/getFeedsFromCircleSend";
                }else if(infoType=="received"){
                    feedList.opts.listPath="/feed/getFeeds";
                }
                //点击status刷新列表
                feedList.reload();
            });

        //部门发出与收到信息切换 reload
        /*$('.depw-menu li').find(">a").on("click",function(){
            feedList.reload();
        });*/
        infoTypeWrapperEl.on('click','a',function(evt){
            var meEl=$(this),
                infoType=meEl.attr('infotype'),
				nextTagaWrap=infoTypeWrapperEl.next('.plan-status-type').find('.status-wrapper'),
				nextTaga=nextTagaWrap.find('a');
            resetFilter(infoType);
			
            if(infoType=="send"){
				nextTagaWrap.filter('.include-file-wrap').show();
                feedList.opts.listPath="/feed/getFeedsFromCircleSend";
            }else{
				nextTagaWrap.filter('.include-file-wrap').hide();
                feedList.opts.listPath="/feed/getFeeds";
            }
            $('a',infoTypeWrapperEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            feedList.reload();
            evt.preventDefault();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });

        //render 右侧栏 同事
        //把登录用户filter掉
        employeeData= _.reject(employeeData,function(itemData){
            return itemData.id==loginUserData.id;
        });

        if(circleId=="999999"){ //全公司包含所有用户
            circleEmployeeData=employeeData;
        }else{
            _.each(employeeData,function(itemData){
                var groupIds=itemData.groupIDs;
                if(_.contains(groupIds,circleId)){
                    circleEmployeeData.push(itemData);
                }
            });
        }
        //设置title
        circleData=util.getContactDataById(circleId,'g');
        circleName=circleData.name||loginUserData.allCompanyDefaultString;
        righthTitleWrapEl.html('<span class="circle-name">'+circleName+'（'+circleEmployeeData.length+'）'+'</span><span class="rt-apv right-yq-apv fn-hide"><a href="javascript:;" class="invite-apv fna-blue">邀请同事</a></span>');

        circleEmployeeData=circleEmployeeData.slice(0,35);  //只截取前35个
        htmlStr='';
        _.each(circleEmployeeData,function(itemData){
            htmlStr+='<a href="#profile/=/empid-'+itemData.id+'" title="'+itemData.name+'"><img src="'+itemData.profileImage+'" /></a>';
        });
        righthImgWrapEl.html(htmlStr);

        //判断是否显示管理和邀请同事按钮
        if(loginUserData.isAdmin){
            //$('.open-admin-wrapper').show();
            $('.right-yq-apv',righthTitleWrapEl).show();
        }else{
            //$('.open-admin-wrapper').hide();
            $('.right-yq-apv',righthTitleWrapEl).hide();
        }
        //邀请同事弹框
        var inviteDialog=new InviteColleague({
            trigger: $('.invite-apv',righthTitleWrapEl)
        }).render();
        //查看部门内的同事
        if(circleId!="999999"){
            $('.view-all-employee-l',tplEl).attr('href','#circles/allcolleague/=/id-'+circleId+'/name-'+encodeURIComponent(circleName));
        }
        //未缓存的tpl移除前需要做一些清理
        tplEvent.one('beforeremove', function (tplName2, tplEl) {
            if(tplName2==tplName){
                feedList.destroy();
                feedList=null;
            }
        });
    };
});