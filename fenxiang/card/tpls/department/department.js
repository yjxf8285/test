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
        tplCommon = require('../stream/stream-common');
    /*邀请同事 START*/
    var InviteColleague=tplCommon.InviteColleague;

    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName;
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        //和子页面公共部门处理,左边栏部分
        tplCommon.init(tplEl,tplName);

        var queryParams=util.getTplQueryParams();

        var feedListEl=$('.feed-list',tplEl),
            pagEl=$('.feed-list-pagination',tplEl),
            feedListCtrEl=$('.plan-status-type',tplEl),
            infoTypeWrapperEl=$('.info-type-wrapper',tplEl);

        var feedList;
        //feedType=$('.plan-status-wrap .depw-tabs-aon',tplEl).attr('feedtype');
        //部门名称
        $('.tpl-c .depw-title-text',tplEl).text(queryParams?decodeURIComponent(queryParams.ctitle):"");
        if (queryParams) {
            if (queryParams.cid == "999999") {
                $('.depw-title .star-big', tplEl).hide();
            } else {
                if(util.isAsterisk(queryParams.cid,'g')){
                    $('.depw-title .star-big', tplEl).attr('data-groupid', queryParams.cid).addClass('j-starred').addClass('star-big-active').attr('title','取消部门星标');
                }else{
                    $('.depw-title .star-big', tplEl).attr('data-groupid', queryParams.cid).addClass('j-starred').removeClass('star-big-active').attr('title','添加部门星标');
                }
            }
        }
        //重置搜索条件
        var resetFilter=function(infoType){
            if(infoType=="send"){
                $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                $('.share-wrapper,.plan-wrapper,.approve-wrapper,.work-wrapper',feedListCtrEl).hide();
                $('.include-file',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
            }else{
                $('.plan-status',feedListCtrEl).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                $('.share-wrapper,.plan-wrapper,.approve-wrapper,.work-wrapper,.include-file-wrap',feedListCtrEl).hide();
            }
        };
        //feedlist列表
        feedList=new FeedList({
            "element":feedListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "withFeedRemind":true, //开启new feed提示
            "withLazyload":true,    //开启懒加载
            "listPath":"/feed/getFeedsFromCircleSend",
            "defaultRequestData":function(){
                var curSubtypeWrapper=$('.subtype-wrapper',feedListCtrEl).filter(':visible');
                return {
                    "circleID": queryParams?queryParams.cid:0, //部门id
                    "subType": $('.depw-tabs-aon',curSubtypeWrapper).attr('subtype')||0, //子类型
                    //"feedType":1,
                    "feedAttachType":$('.include-file-wrap .depw-tabs-aon',tplEl).attr('attachtype'),
                    "feedType": $('.plan-status-wrap .depw-tabs-aon',tplEl).attr('feedtype'),
                    "keyword":_.str.trim(searchEl.val())
                };
            },
            "listSuccessCb":function(){
                var lastMaxId=parseInt(util.getTplStore("stream","maxFeedId")||0);
                if(feedList.lastMaxId>lastMaxId){
                    util.setTplStore("stream",{     //设置stream模板变量maxFeedId，用于new feed提醒
                        "maxFeedId":feedList.lastMaxId
                    });
                }
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
                $('.subtype-wrapper,.include-file-wrap',feedListCtrEl).each(function(){
                    $('.depw-tabs-a',this).removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
                });
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
                withAttachEl=$('.include-file-wrap',tplEl), //是否包含附件的筛选
                infoType=meEl.attr('infotype');
            $('a',infoTypeWrapperEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            //筛选条件重置
            resetFilter(infoType);
            if(infoType=="send"){
                feedList.opts.listPath="/feed/getFeedsFromCircleSend";
                withAttachEl.show();
            }else{
                feedList.opts.listPath="/feed/getFeeds";
                withAttachEl.hide();
            }
            feedList.resetSearch(); //搜索重置
            feedList.reload();
            evt.preventDefault();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            feedList.reload();
            evt.preventDefault();
        });

        //render 右侧栏 同事
        var contactData=util.getContactData(),
            employeeData=contactData["p"],
            circleEmployeeData=[];
        var righthImgWrapEl=$('.right-img-wrap',tplEl);
        var righthTitleWrapEl=$('.right-htitle-wrap',tplEl);
        var htmlStr='';
        var circleId=queryParams?parseInt(queryParams.cid): 0, //部门id
            circleData,
            memberCount,
            circleName;
        //设置title
        circleData=util.getContactDataById(circleId,'g');
        //filter掉自己
        employeeData= _.filter(employeeData,function(itemData){
            return itemData.id!=contactData["u"].id;
        });
        if(circleId=="999999"){ //全公司包含所有用户，不包括登录用户
            circleEmployeeData= employeeData;
            memberCount=circleData.memberCount-1;   //全公司不包括自己
        }else{
            _.each(employeeData,function(itemData){
                var groupIds=itemData.groupIDs;
                if(_.contains(groupIds,circleId)){
                    circleEmployeeData.push(itemData);
                }
            });
            memberCount=circleData.memberCount;
            if(_.some(contactData["u"].groupIDs,function(groupId){
                return groupId==circleId;
            })){
                memberCount=memberCount-1;  //人数上把自己去掉
            }
        }
        circleName=circleData.name||contactData['u'].allCompanyDefaultString;
        righthTitleWrapEl.html('<span class="circle-name">'+circleName+'('+memberCount+')'+'</span><span class="rt-apv right-yq-apv fn-hide"><a href="javascript:;" class="invite-apv fna-blue">邀请同事</a></span>');    //

        circleEmployeeData=circleEmployeeData.slice(0,35);  //只截取前35个
        _.each(circleEmployeeData,function(itemData){
            htmlStr+='<a href="#profile/=/empid-'+itemData.id+'" title="'+itemData.name+'"><img src="'+itemData.profileImage+'" /></a>';
        });
        righthImgWrapEl.html(htmlStr);
        //邀请同事
        //判断是否显示管理和邀请同事按钮
        if(contactData['u'].isAdmin){
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
        //查看全部同事
        if(circleId!="999999"){
            $('.view-all-employee-l',tplEl).attr('href','#circles/allcolleague/=/id-'+circleId+'/name-'+encodeURIComponent(circleName));
        }
        // 添加星标时间
        tplEl.on('click', '.j-starred', function(evt) {
            var isAsterisk=false;
            var $this = $(this),
                activeCls = $this[0].className.split(' ')[0] + '-active';
            if ($this.hasClass(activeCls)) {
                isAsterisk=false;
            } else {
                isAsterisk=true;
            }
            util.api({
                "url": '/Employee/SetCircleAsterisk', //添加星标
                "type": 'post',
                "dataType": 'json',
                "data": {
                    circleID: $this.attr('data-groupid'),// int，部门ID
                    isAsterisk: isAsterisk// bool，是否星标(设置:true;取消:false)
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        //成功之后
                        if (isAsterisk) {
                            $this.addClass(activeCls).attr('title','取消部门星标');
                        } else {
                            $this.removeClass(activeCls).attr('title','添加部门星标');
                        }
                    }
                }
            });

        });


        //未缓存的tpl移除前需要做一些清理
        tplEvent.one('beforeremove', function (tplName2, tplEl) {
            if(tplName2==tplName){
                feedList.destroy();
                feedList=null;
            }
        });
    };
});