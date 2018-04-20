/**
 * 我的提醒列表
 *
 * 遵循seajs module规范
 * @author liuxf
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util'),
        MyremindList = require('modules/fs-myremind-list/fs-myremind-list');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName,
            myremindListEl = $('.myremind-list', tplEl),
            pagEl = $('.myremind-list-pagination', tplEl),
            sortDateEl = $('.sort-date', tplEl);
        var searchEl = $('.search-inp', tplEl),
            searchBtnEl = $('.search-btn', tplEl);

        var myremindList = new MyremindList({
            "warpEl": myremindListEl, //list selector
            "pagEl":pagEl,

            "url": "/TimingMessage/GetTimingMessageRemaindList",//获取提醒列表
            data: {
                isOverTime: 1,//int，是否已经过期(即将到来=0；已过期=1；全部=-1)
                pageSize: 10,// int，分页大小
                pageNumber: 1,// int，页码
                "keyword": _.str.trim(searchEl.val())
            }
        });
        myremindList.load();
        myremindList.on('success',function(responseData){
            var totalCount=responseData.value.totalCount,
                $listSearchBar = $('.list-search-bar',tplEl);
            $listSearchBar.find('.num').text(totalCount);
            
            // HACK: for request slowly
            if ($listSearchBar.attr('hasSearch')) {
                $listSearchBar.show();
            }
        });
        $('.list-search-bar',tplEl).find('.btn-close').click(function(){
            searchEl.val('');//清空搜索框
            myremindList.refresh({
                "keyword": ''
            });
            $('.list-search-bar',tplEl).hide();
            $('.list-search-bar',tplEl).removeAttr('hasSearch');
        });
        sortDateEl.click(function () {
            sortDateEl.removeClass('depw-tabs-aon');
            $(this).addClass('depw-tabs-aon');
//            searchEl.val('');//清空搜索框
              // 隐藏搜索条
              $('.list-search-bar',tplEl).hide();
              myremindList.$el.html('');
              
            //重新请求列表
            myremindList.refresh({
                isOverTime: sortDateEl.filter('.depw-tabs-aon').attr('sort') || 0//int，是否已经过期(即将到来=0；已过期=1；全部=-1)
//                "keyword": ''
            });
        });
        //搜索输入框enter提交
        searchEl.keydown(function (evt) {
            if (evt.keyCode == 13) {    //监听回车按键
                searchBtnEl.click();
            }
        });
        //点击搜索reload列表
        searchBtnEl.click(function (evt) {
        /*    evt.preventDefault({
                "keyword": _.str.trim(searchEl.val())
            });*/
            myremindList.refresh({
                "keyword": _.str.trim(searchEl.val())
            });

            if(_.str.trim(searchEl.val())!=''){
                $('.list-search-bar',tplEl).show();
                $('.list-search-bar',tplEl).attr('hasSearch', true);
            }else{
                $('.list-search-bar',tplEl).hide();
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

        var contactData = util.getContactData();
        //render当前登录用户信息
        var currentMember = contactData["u"];
        var headImgWrapEl = $('.head-img-wrap', tplEl),
            headImgWrapTpl = $('.head-img-wrap-tpl', headImgWrapEl).html(),   //获取模板
            headImgWrapCompiled = _.template(headImgWrapTpl); //模板编译方法
        var htmlStr = headImgWrapCompiled({
            "userName": currentMember.name,
            "profileImage": currentMember.profileImage
        });
        //重新渲染到页面
        headImgWrapEl.html(htmlStr);
    };
});