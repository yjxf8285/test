/**
 * 历史日程列表
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
        FeedList=require('modules/feed-list/feed-list');
    exports.init=function(){
        var tplEl = exports.tplEl,
            tplName=exports.tplName,
            scheduleListEl=$('.schedule-list',tplEl),
            pagEl=$('.schedule-list-pagination',tplEl),
            sortDateEl=$('.sort-date',tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);
        var scheduleList=new FeedList({
            "element":scheduleListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":20,
                "visiblePageNums":7
            },
            "loadSize":15,   //单次加载15条记录
            "scheduleStyle":2,  //弹框列表风格
            "listPath":"/Schedule/GetHistoryScheduleInfos",//获取历史日程接口
            "defaultRequestData":function(){
                var orderType=sortDateEl.filter('.depw-tabs-aon').attr('sort')||0;  //默认为0全部
                return {
                    "orderType":orderType,
                    "keyword": _.str.trim(searchEl.val())
                };
            },
			"searchOpts":{
				"inputSelector":searchEl,
				"btnSelector":searchBtnEl
			}
            //默认请求数据
        });
        sortDateEl.click(function(){
            sortDateEl.removeClass('depw-tabs-aon');
            $(this).addClass('depw-tabs-aon');
            //重新请求列表
            scheduleList.reload();
        });
        //点击搜索reload列表
        searchBtnEl.click(function(evt){
            scheduleList.reload();
            evt.preventDefault();
        });
        //feedList.load();
        //切换到当前模板后重新加载feedlist
        tplEvent.on('switched', function (tplName2, tplEl) {
            var queryParams,
                tabIndex;
            if(tplName2==tplName){
                queryParams = util.getTplQueryParams(); //传给模板的参数
                tabIndex = queryParams ? queryParams.tabindex : 0;
                //定位初始过滤项
                sortDateEl.removeClass('depw-tabs-aon').eq(tabIndex).addClass('depw-tabs-aon');
                scheduleList.reload();
            }else{
                scheduleList&&scheduleList.loadKill();
            }
        });
		
		var contactData=util.getContactData();
		//render当前登录用户信息
		var currentMember=contactData["u"];
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