/**
 * 公告管理列表
 *
 * 遵循seajs module规范
 * @author qisx
 */
define(function(require, exports, module) {
    var root=window,
        FS=root.FS,
        tpl=FS.tpl,
        tplEvent=tpl.event;
    var util = require('util'),
		Dialog = require('dialog'),
        announcement=require('modules/fs-announcement/fs-announcement'),
		FeedList=require('modules/feed-list/feed-list');
	var contactData=util.getContactData();
		//render当前登录用户信息
	var currentMember=contactData["u"];
	var NewNoticeDialog=announcement.NewNoticeDialog;
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName,
            announcementsListEl=$('.announcements-list',tplEl),
            pagEl=$('.announcements-list-pagination',tplEl),
            sortDateEl=$('.sort-date',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        var announcementsList=new FeedList({
            "element":announcementsListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "noticeStyle":2,  //公告列表风格
            "listPath":"/FeedAnnounce/GetFeedAnnounces",//获取历史日程接口
            "listEmptyText":"没有搜索到公告信息",
            "defaultRequestData":function(){
                return {
                    //"feedModelType":1,    //与客群相关，去掉
                    "keyword": _.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
            //默认请求数据
        });
        //点击创建公告显示对话框
		if(_.some(currentMember.functionPermissions,function(permission){
            return permission.value==1;  //权限1表示可以发公告
        })){
			$('#btn-new-create',tplEl).show();
			new NewNoticeDialog({
				"trigger":$('#btn-new-create',tplEl),
				"successCb":function(responseData){
					if(responseData.success){
						//that.addFeedToMain(responseData.value);
                        announcementsList.reload();
						this.hide();
					}

				}
			});
		}
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            announcementsList.reload();
            evt.preventDefault();
        });
        //feedList.load();
        //切换到当前模板后重新加载feedlist
        tplEvent.on('switched', function (tplName2, tplEl) {
            if(tplName2==tplName){
                announcementsList.reload();
            }else{
                announcementsList&&announcementsList.loadKill();
            }
        });
		
		
		var headImgWrapEl=$('.head-img-wrap',tplEl),
			headImgWrapTpl=$('.head-img-wrap-tpl',headImgWrapEl).html(),   //获取模板
			headImgWrapCompiled=_.template(headImgWrapTpl); //模板编译方法
		var htmlStr=headImgWrapCompiled({
			"userName":currentMember.name,
			"profileImage":currentMember.profileImage
		});
		//重新渲染到页面
		headImgWrapEl.html(htmlStr);
    };
});