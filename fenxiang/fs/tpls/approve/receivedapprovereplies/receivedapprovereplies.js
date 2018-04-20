/**
 * approve
 *
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        store = tpl.store,
        tplEvent = tpl.event;
    var util = require('util'),
        fsReplyList=require('modules/fs-reply/fs-reply-list'),
        tplCommon = require('../approve-common');

    var ReplyList=fsReplyList.replyList;
    exports.init = function() {
        var tplName = exports.tplName,
            tplEl = exports.tplEl;

        var replyListEl=$('.reply-list',tplEl),
            pagEl=$('.reply-list-pagination',tplEl),
            filterEl=$('.filter',tplEl);
        var replyList;
        tplCommon.init(tplEl,tplName);

        replyList=new ReplyList({
            "element":replyListEl, //list selector
            "pagSelector":pagEl, //pagination selector
            "pagOpts":{ //分页配置项
                "pageSize":45,
                "visiblePageNums":7
            },
            "listPath":"/feed/getFeedReplysOfIReceive", //第一次加载获取我收到的回复
            "defaultRequestData":{
                "feedType": 4,  //feedType限制为审批类型
                "keyword": ""
            }, //默认请求数据
            "replyCb":function(responseData){
                var replyType=$('.depw-menu-aon',filterEl).attr('replytype');
                if(responseData.success&&replyType=="send"){
                    replyList.reload();
                }
            }
        });
        replyList.load();
        //filter筛选
        filterEl.on('click','.filter-field',function(evt){
            var meEl=$(this);
            var replyType=meEl.attr('replytype');
            $('.filter-field',filterEl).removeClass('depw-menu-aon');
            meEl.addClass('depw-menu-aon');
            //动态设置
            replyList.opts.listPath="/feed/getFeedReplysOfI"+ _.str.capitalize(replyType);
            //reload
            replyList.reload();
            evt.preventDefault();
        });
        var destroy=function(){
            replyList.destroy();
        };
        tplEvent.one('beforeremove',function(tplName2){
            if(tplName2==tplName){
                destroy();
            }
        });
    };
});