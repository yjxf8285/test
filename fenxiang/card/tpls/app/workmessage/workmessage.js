/**
 * 工作通知
 * Created by liuxf on 08-27-0027.
 */

define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var Pagination = require('uilibs/pagination');
    var moment = require('moment');
    var SendWorkNotice = require('modules/app-notice-send/app-notice-send');

    exports.init = function () {
        var tplEl = exports.tplEl;
        var tplName = exports.tplName;
        var listEl = $('.workmessage-list', tplEl);
        var pagEl = $('.workmessage-list-pagination', tplEl);
        var sortDateEl = $('.sort-date', tplEl);
        var filterEl=$('.filter',tplEl);    //筛选容器
        var searchEl = $('.search-inp', tplEl);
        var searchBtnEl = $('.search-btn', tplEl);
        var addWorkMesBtnEl = $('.add-workmessage-btn', tplEl);
        // 发工作通知
        var sendWorkNotice = new SendWorkNotice();
        sendWorkNotice.on("success", function () {
            refresh({
                keyword: '',// string，通知标题，最多 10 字。
                status: 0,// int，状态,status=0全部;status=1未读;status=2已读;status=3已确认。
                pageSize: 10,// int，分页大小
                pageNumber: 1// int，页号
            });
            searchEl.val('');
            pagination.reset();
            sortDateEl.removeClass('depw-tabs-aon');
            sortDateEl.eq(0).addClass('depw-tabs-aon');
        });
        //列表
        var oData = {
            keyword: '',// string，通知标题，最多 10 字。
            status: 0,// int，状态,status=0全部;status=1未读;status=2已读;status=3已确认。
            pageSize: 10,// int，分页大小
            pageNumber: 1// int，页号
        };
        var load = function () {
            util.api({
                "url": "/FeedWorkNotice/GetWorkNoticeList",
                "type": 'get',
                "dataType": 'json',
                "data": oData,
                beforeSend: function() {
                    var loadingEl = '<tr><td colspan="4"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    var tBodyEl = listEl.find('tbody');
                    tBodyEl.html(loadingEl);
                },
                "success": function (responseData) {
                    if (responseData.success) {
                        render(responseData);
                        pagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                    }
                }
            });
        };

        var refresh = function (data) {
            oData = _.extend(oData, data);
            load();
        };
        
        // 隐藏状态栏
        // 发出的通知没有状态栏
        function hideStatusCol() {
            var isReceive = oData.isReceive || 1;
            // var thStatus = listEl.find('thead th').eq(0);
            if (isReceive == 2) {
                // listEl.find('thead').hide();
                // thStatus.css('display', 'none');
                listEl.addClass('send-notices');
                // listEl.find('thead').show();
            } else {
                // listEl.find('thead').hide();
                // thStatus.css('display', '');
                listEl.removeClass('send-notices');
                // listEl.find('thead').show();
            }
        }
        

        
        var render = function (responseData) {
            hideStatusCol();
            var tBodyEl = listEl.find('tbody'),
                tHeadEl = listEl.find('thead');
            var trStr = '';
            var rowTmpl = '<tr data-feedid="{{feedID}}"><td class="status-ico-ctner"><div class="status-ico {{statusStr}}"></div></td><td class="black-name"><span title="{{title}}">{{title}}</span></td><td class="black-name"><span title="{{senderName}}">{{senderName}}</span></td><td><span title="{{createTime}}">{{createTime}}</span></td></tr>',
                theadStr = '<tr><th style="width: 25px;">状态</th><th style="width: 250px;">标题</th><th>发送人</th><th class="th-blank">发送时间</th></tr>',
                emputyStr = '<tr><td valign="top" colspan="4" class="dataTables_empty"><span class="empty-tip">没有获取到群通知</span></td></tr>';
            var feedWorkNotices = responseData.value.feedWorkNotices;

            if(oData.isReceive == 2){
                rowTmpl = '<tr data-feedid="{{feedID}}"><td class="black-name"><span title="{{title}}">{{title}}</span></td><td class="black-name"><span title="{{senderName}}">{{senderName}}</span></td><td><span title="{{createTime}}">{{createTime}}</span></td></tr>';
                theadStr = '<tr><th style="width: 250px;">标题</th><th>发送人</th><th class="th-blank">发送时间</th></tr>';
                emputyStr = '<tr><td valign="top" colspan="3" class="dataTables_empty"><span class="empty-tip">没有获取到群通知</span></td></tr>';
            }
            tHeadEl.html(theadStr);
            if (feedWorkNotices && feedWorkNotices.length > 0) {
                _.each(feedWorkNotices, function (item) {
                    var feedID = item.feedID || 0;
                    var title = item.title || '';
                    var senderName = item.sender.name || '';
                    var createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm');
                    var status = item.status;
                    var statusStr = '';
                    switch (status) {
                        case 1:
                            statusStr = 'unread';
                            break;
                        case 2:
                            statusStr = 'read';
                            break;
                        case 3:
                            statusStr = 'confirm';
                            break;
                        default :
                            statusStr = '';
                            break;
                    }
                    trStr += _.template(rowTmpl, {
                        feedID: feedID,
                        statusStr: statusStr,
                        title: title,
                        senderName: senderName,
                        createTime: createTime
                    });
                    // '<tr data-feedid="' + feedID + '"><td class="status-ico-ctner"><div class="status-ico ' + statusStr + '"></div></td><td class="black-name"><span title="' + title + '">' + title + '</span></td><td class="black-name"><span title="' + senderName + '">' + senderName + '</span></td><td><span title="' + createTime + '">' + createTime + '</span></td></tr>';
                });
                tBodyEl.html(trStr);
            } else {
                tBodyEl.html(emputyStr);
            }
        };
        load();

        //分页
        var pagination = new Pagination({
            "element": pagEl,
            "pageSize": oData.pageSize,
            "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
        });
        pagination.render();
        pagination.on('page', function (pageNumber) {
            refresh({
                pageNumber: pageNumber// int，页码
            });
        });
        //筛选
        filterEl.on('click','.filter-field',function(evt){
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            $(this).addClass('depw-menu-aon');
            var val=$(this).attr('val');
            var status = 0;
            searchEl.val('');
            var tabsEl=$('.depw-tabs');
            if(val==2){
                tabsEl.hide();
            }else{
                tabsEl.show();
                status = oData.status;
            }
            tabsEl.find('.depw-tabs-a').removeClass('depw-tabs-aon').eq(0).addClass('depw-tabs-aon');
            //reload列表
            refresh({
                isReceive: val || 1,//int，(1收到， 2发出)
                keyword: '',
                pageNumber: 1,// int，页号
                status: status
            });
            pagination.reset();
            evt.preventDefault();
        });
        //筛选
        sortDateEl.click(function () {
            sortDateEl.removeClass('depw-tabs-aon');
            $(this).addClass('depw-tabs-aon');
            refresh({
                status: sortDateEl.filter('.depw-tabs-aon').attr('val') || 0,//int，是否已经过期(即将到来=0；已过期=1；全部=-1)
                keyword: searchEl.val(),
                pageNumber: 1// int，页号
            });
            pagination.reset();
        });

        //搜索输入框enter提交
        searchEl.keydown(function (evt) {
            if (evt.keyCode == 13) {
                searchBtnEl.click();
            }
        });
        searchEl.keyup(function () {
            var val = _.str.trim($(this).val());
            if (val.length > 0) {
                searchEl.addClass('with-input-value');
            } else {
                searchEl.removeClass('with-input-value');
            }
        });
        //点击搜索reload列表
        searchBtnEl.click(function (evt) {
            refresh({
                //                status: 0,// int，状态,status=0全部;status=1未读;status=2已读;status=3已确认。
                "keyword": _.str.trim(searchEl.val())
            });
        });

        //点击添加工作通知按钮
        addWorkMesBtnEl.click(function (evt) {
            sendWorkNotice.show();
        });

        //点击列表TR
        listEl.on('click', 'tbody tr', function (evt) {
            var feedId = $(this).data('feedid');
            if(feedId){
                tpl.navRouter.navigate('#stream/showfeed/=/id-' + feedId + '/datalighted-app|workmessage', { trigger: true });
            }
        });

        // 头像
        var contactData = util.getContactData();
        var currentMember = contactData["u"];
        var headImgWrapEl = $('.head-img-wrap', tplEl),
            headImgWrapTpl = $('.head-img-wrap-tpl', headImgWrapEl).html(),
            headImgWrapCompiled = _.template(headImgWrapTpl);
        var htmlStr = headImgWrapCompiled({
            "userName": currentMember.name,
            "profileImage": currentMember.profileImage
        });
        headImgWrapEl.html(htmlStr);


    };
});